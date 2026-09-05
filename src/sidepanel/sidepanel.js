import { MessageType } from "../shared/messages.js";
import { buildSelectionContextPack } from "../pdf/selection-context.js";
import { formatSelectionContextForPrompt } from "../ai/selection-prompt.js";
import { DEFAULT_PARSER_ID } from "../parsers/parser-registry.js";
import {
  canLoadDocumentFromTab,
  getCachedDocumentForUrl,
  loadDocumentForTab,
  saveDocumentForUrl
} from "../document/load-document.js";
import { PROMPT_PRESETS_KEY } from "../storage/prompt-presets-store.js";
import { getAiSettings, hasConfiguredAiApiKey, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { answerSelectionQuestion } from "../ai/selection-answer.js";
import { createConversationPanelController } from "./conversation-panel-controller.js";
import { createPromptPresetMenuController } from "./prompt-preset-menu.js";
import { createSelectionPanelController } from "./selection-panel-controller.js";
import { getSidePanelElements } from "./sidepanel-elements.js";

const DOCUMENT_CACHE_VERSION = "v15";
const NEW_THREAD_COMMAND = "---";
let activeTab = null;
let currentDocument = null;
let titleSaveTimer = null;
let refreshTimer = null;
let currentAnswerAbortController = null;
let documentRequestId = 0;

const elements = getSidePanelElements();

const conversation = createConversationPanelController({
  threadElement: elements.conversationThread,
  threadArchiveButton: elements.conversationThreadArchive,
  threadWheelElement: elements.conversationThreadWheel,
  onDiagnostic: addDiagnostic,
  onChange: updateAskReadiness
});

const selectionPanel = createSelectionPanelController({
  statusElement: elements.selectionStatus,
  quoteElement: elements.selectionText,
  toggleButton: elements.toggleSelectionText,
  contextStatusElement: elements.selectionContextStatus
});

const promptPresetMenu = createPromptPresetMenuController({
  textarea: elements.selectionQuestion,
  menuElement: elements.promptPresetMenu,
  onError: (error) => console.debug("[PDF AI] Prompt presets unavailable", error)
});

elements.reloadPdf.addEventListener("click", () => {
  loadPdf({ bypassCache: true });
});
elements.copyTabUrl.addEventListener("click", copyActiveTabUrl);
elements.documentTitle.addEventListener("input", () => {
  updateManualDocumentTitle();
});
elements.selectionQuestionForm.addEventListener("submit", askAiAboutSelection);
elements.selectionQuestion.addEventListener("input", handleSelectionQuestionInput);
elements.selectionQuestion.addEventListener("keydown", handleSelectionQuestionKeydown);
elements.selectionQuestion.addEventListener("focus", promptPresetMenu.update);
elements.selectionQuestion.addEventListener("blur", () => {
  window.setTimeout(promptPresetMenu.hide, 120);
});
elements.promptPresetMenu.addEventListener("mousedown", promptPresetMenu.preventBlurDismissal);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.PDF_SELECTION_CHANGED) {
    refreshSelection();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[PROMPT_PRESETS_KEY]) {
    promptPresetMenu.load();
  }
});

promptPresetMenu.load();
refreshState();
window.setInterval(refreshSelection, 1500);

chrome.tabs.onActivated.addListener(scheduleRefreshState);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (activeTab?.id !== tabId) {
    return;
  }

  if (changeInfo.url || changeInfo.status === "complete") {
    scheduleRefreshState();
  }
});

async function sendMessage(message) {
  const response = await chrome.runtime.sendMessage(message);
  if (!response?.ok) {
    throw new Error(response?.error || "Extension request failed.");
  }
  return response;
}

async function refreshState() {
  let request = null;
  setBusy(elements.reloadPdf, true);
  renderContextReady(false);
  clearError();

  try {
    activeTab = await getActiveTab();
    renderTab(activeTab);
    request = beginDocumentRequest(activeTab);

    if (!canLoadDocumentFromTab(activeTab)) {
      await renderDocumentIfCurrent(null, request);
      setStatus("Open a web PDF or publisher PDF viewer tab to inspect.");
      await refreshSelection();
      return;
    }

    const cached = await getCachedDocumentForUrl({
      url: activeTab.url,
      parserId: getSelectedParserId(),
      cacheVersion: DOCUMENT_CACHE_VERSION,
      onDiagnostic: addDiagnostic
    });
    if (!isCurrentDocumentRequest(request)) {
      return;
    }

    if (cached) {
      await renderDocumentIfCurrent(cached, request);
    } else {
      await renderDocumentIfCurrent(null, request);
      await loadPdf({ bypassCache: false });
    }

    await refreshSelection();
  } catch (error) {
    if (!request || isCurrentDocumentRequest(request)) {
      showError(error.message);
    }
  } finally {
    if (!request || isCurrentDocumentRequest(request)) {
      setBusy(elements.reloadPdf, false);
    }
  }
}

function scheduleRefreshState() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshState();
  }, 250);
}

async function refreshSelection() {
  try {
    activeTab = await getActiveTab();
    const response = await sendMessage({
      type: MessageType.GET_LATEST_SELECTION,
      tabId: activeTab.id,
      tabUrl: activeTab.url
    });
    selectionPanel.render(response.selection);
  } catch {
    // Keep the panel quiet if the background worker is waking up.
  }
}

async function loadPdf(options = {}) {
  let request = null;
  const bypassCache = options.bypassCache !== false;
  setBusy(elements.reloadPdf, true);
  renderContextReady(false);
  clearError();
  clearDiagnostics();

  try {
    addDiagnostic("Step 1: reading active browser tab.");
    activeTab = await getActiveTab();
    renderTab(activeTab);
    request = beginDocumentRequest(activeTab);
    addDiagnostic(`Active tab URL: ${activeTab.url}`);

    if (!canLoadDocumentFromTab(activeTab)) {
      await renderDocumentIfCurrent(null, request);
      setStatus("Open a web PDF or publisher PDF viewer tab to inspect.");
      addDiagnostic("Load skipped: active tab URL is not an http/https page.");
      return;
    }

    const parserId = getSelectedParserId();
    setStatus("Loading PDF...");
    renderDocumentTitle(null);

    const result = await loadDocumentForTab({
      tab: activeTab,
      parserId,
      cacheVersion: DOCUMENT_CACHE_VERSION,
      bypassCache,
      onDiagnostic: addDiagnostic,
      onTitleInfo: (titleInfo) => {
        if (isCurrentDocumentRequest(request)) {
          renderDocumentTitle(titleInfo);
        }
      }
    });

    if (!isCurrentDocumentRequest(request)) {
      return;
    }

    if (result.skipped) {
      return;
    }

    if (result.document) {
      await renderDocumentIfCurrent(result.document, request);
    }
  } catch (error) {
    if (!request || isCurrentDocumentRequest(request)) {
      showError(`Could not load PDF.\n${error.message || String(error)}`);
    }
  } finally {
    if (!request || isCurrentDocumentRequest(request)) {
      setBusy(elements.reloadPdf, false);
    }
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    throw new Error("No active browser tab found.");
  }
  return {
    id: tab.id,
    title: tab.title || "",
    url: tab.url
  };
}

function getSelectedParserId() {
  return DEFAULT_PARSER_ID;
}

function beginDocumentRequest(tab) {
  documentRequestId += 1;
  return {
    id: documentRequestId,
    tabId: tab?.id || null,
    url: tab?.url || ""
  };
}

function isCurrentDocumentRequest(request) {
  return Boolean(
    request &&
    request.id === documentRequestId &&
    activeTab?.id === request.tabId &&
    activeTab?.url === request.url
  );
}

function renderTab(tab) {
  if (!tab) {
    elements.tabStatus.textContent = "No active tab found.";
    elements.tabStatus.removeAttribute("title");
    elements.copyTabUrl.disabled = true;
    return;
  }

  elements.tabStatus.textContent = tab.url;
  elements.tabStatus.title = tab.url;
  elements.copyTabUrl.disabled = !tab.url;
}

async function copyActiveTabUrl() {
  const url = activeTab?.url || elements.tabStatus.textContent.trim();
  if (!url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    elements.copyTabUrl.classList.add("copied");
    window.setTimeout(() => elements.copyTabUrl.classList.remove("copied"), 700);
  } catch (error) {
    showError(`Could not copy URL.\n${error.message || String(error)}`);
  }
}

async function renderDocumentIfCurrent(document, request) {
  if (!isCurrentDocumentRequest(request)) {
    return;
  }

  await renderDocument(document);
}

async function renderDocument(document) {
  if (!document) {
    currentDocument = null;
    await conversation.setDocumentUrl("");
    renderDocumentTitle(null);
    renderContextReady(false);
    elements.pdfStatus.textContent = "";
    updateAskReadiness();
    return;
  }

  currentDocument = document;
  renderDocumentTitle(document);
  renderContextReady(true);
  elements.pdfStatus.textContent = "";
  await conversation.setDocumentUrl(document.url);
  updateAskReadiness();
}

function renderContextReady(isReady) {
  elements.contextReadyIndicator.classList.toggle("ready", Boolean(isReady));
  elements.contextReadyIndicator.classList.toggle("loading", !isReady);
  elements.contextReadyIndicator.title = isReady ? "Context ready" : "Preparing context";
  elements.contextReadyIndicator.setAttribute("aria-label", elements.contextReadyIndicator.title);
}

function renderDocumentTitle(document) {
  const title = document?.title?.trim();

  if (title) {
    elements.documentTitle.value = title;
    elements.documentTitle.placeholder = "Document title";
    elements.documentTitle.classList.remove("muted");
    elements.documentTitle.title = title;
    return;
  }

  elements.documentTitle.value = "";
  elements.documentTitle.placeholder = "Title not found";
  elements.documentTitle.classList.add("muted");
  elements.documentTitle.removeAttribute("title");
}

function updateManualDocumentTitle() {
  const title = normalizeManualTitle(elements.documentTitle.value);
  elements.documentTitle.classList.toggle("muted", !title);

  if (!currentDocument) {
    return;
  }

  currentDocument.title = title;
  currentDocument.titleSource = title ? "manual" : "";
  if (title) {
    currentDocument.titleIssue = null;
  }

  queueCurrentDocumentCacheSave();
}

function normalizeManualTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim();
}

function queueCurrentDocumentCacheSave() {
  if (!currentDocument || !activeTab?.url) {
    return;
  }

  window.clearTimeout(titleSaveTimer);
  titleSaveTimer = window.setTimeout(async () => {
    try {
      await saveDocumentForUrl({
        url: activeTab.url,
        parserId: getSelectedParserId(),
        cacheVersion: DOCUMENT_CACHE_VERSION,
        document: currentDocument
      });
    } catch (error) {
      addDiagnostic(`Manual title cache save skipped: ${error.message || String(error)}`);
    }
  }, 400);
}

function updateAskReadiness() {
  selectionPanel.updateReadiness({
    hasDocument: Boolean(currentDocument)
  });
}

function handleSelectionQuestionKeydown(event) {
  const isPlainEnter = (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.isComposing
  );

  if (isPlainEnter && isNewThreadCommand()) {
    event.preventDefault();
    startNewThreadFromComposer();
    return;
  }

  if (promptPresetMenu.handleKeydown(event)) {
    return;
  }

  if (!isPlainEnter) {
    return;
  }

  event.preventDefault();
  if (!elements.selectionQuestion.value.trim() || !selectionPanel.canAsk()) {
    return;
  }

  elements.selectionQuestionForm.requestSubmit();
}

function handleSelectionQuestionInput() {
  promptPresetMenu.update();
  updateNewThreadPromptHint();
}

function isNewThreadCommand() {
  return elements.selectionQuestion.value.trim() === NEW_THREAD_COMMAND;
}

function updateNewThreadPromptHint() {
  const active = isNewThreadCommand();
  elements.newThreadPromptHint.hidden = !active;
  elements.selectionQuestion.classList.toggle("new-thread-command", active);
  if (active) {
    promptPresetMenu.hide();
  }
}

async function startNewThreadFromComposer() {
  clearError();
  elements.selectionQuestion.value = "";
  updateNewThreadPromptHint();
  selectionPanel.clearComposerSelection();

  try {
    await conversation.createThread();
    updateAskReadiness();
    elements.selectionQuestion.focus();
  } catch (error) {
    showError(error.message || String(error));
  }
}

async function askAiAboutSelection(event) {
  event.preventDefault();
  clearError();

  try {
    const question = elements.selectionQuestion.value.trim();
    const visibleSelectionText = selectionPanel.getVisibleText();
    const selectionText = visibleSelectionText;
    if (!question) {
      throw new Error("Enter a question.");
    }

    const contextPack = buildSelectionContextPack({
      document: currentDocument,
      selectionText,
      question
    });
    console.debug("[PDF AI] Selection context pack", contextPack);
    console.debug("[PDF AI] Selection prompt context\n%s", formatSelectionContextForPrompt(contextPack));

    const aiSettings = await getAiSettings();
    if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiApiKey(aiSettings)) {
      throw new Error("Gemini API key is not configured. Open extension Options to add it.");
    }

    const previousMessages = conversation.getMessages();
    conversation.appendMessage({
      role: "user",
      text: question,
      selectionText: visibleSelectionText
    });
    elements.selectionQuestion.value = "";
    selectionPanel.clearComposerSelection();

    currentAnswerAbortController = new AbortController();
    selectionPanel.setAnswerBusy(true);
    selectionPanel.setContextStatus(getContextStatusForAsk(contextPack, Boolean(selectionText)));

    const answer = await answerSelectionQuestion({
      aiSettings,
      contextPack,
      conversationMessages: previousMessages,
      signal: currentAnswerAbortController.signal
    });

    conversation.appendMessage({
      role: "assistant",
      text: answer.text
    });
    selectionPanel.setContextStatus(`Answered by ${answer.model}.`);
  } catch (error) {
    selectionPanel.clearContextStatus();
    showError(error.message || String(error));
  } finally {
    currentAnswerAbortController = null;
    selectionPanel.setAnswerBusy(false);
    updateAskReadiness();
  }
}

function getContextStatusForAsk(contextPack, hasSelection) {
  if (!hasSelection) {
    return "Asking with whole-paper context...";
  }

  return contextPack.selection.anchor
    ? "Asking..."
    : "Asking with available context. Selected text was not confidently located in the paper.";
}

function setBusy(button, busy) {
  button.disabled = busy;
}

function clearError() {
  elements.pdfStatus.classList.remove("error");
}

function showError(message) {
  elements.pdfStatus.textContent = message;
  elements.pdfStatus.classList.add("error");
}

function setStatus(message) {
  elements.pdfStatus.textContent = message;
  elements.pdfStatus.classList.remove("error");
}

function clearDiagnostics() {
  // Diagnostics stay in the console now; the side panel UI stays minimal.
}

function addDiagnostic(message) {
  console.debug("[PDF AI]", message);
}
