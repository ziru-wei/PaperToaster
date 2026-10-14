import { MessageType } from "../shared/messages.js";
import { normalizeOpenableUrl, openPaperUrlInExistingTab } from "../browser/open-paper-tab.js";
import {
  canDownloadParserArtifacts,
  downloadParserArtifacts
} from "../document/download-parser-artifacts.js";
import { DEFAULT_PARSER_ID } from "../parsers/parser-registry.js";
import {
  canLoadDocumentFromTab,
  getCachedDocumentForUrl,
  loadDocumentForTab,
  isLocalPdfFileUrl,
  saveDocumentForUrl
} from "../document/load-document.js";
import { importLocalPdfFromFileUrl } from "../document/local-pdf-import.js";
import { getStoredDocumentByDocumentKey } from "../storage/document-store.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";
import {
  PARSING_SETTINGS_KEY,
  getParsingSettings,
  normalizeParsingSettings
} from "../storage/parsing-settings-store.js";

const DOCUMENT_CACHE_VERSION = "v16";
const AGENT_CONNECTION_ERROR_PATTERN = /^(?:typeerror:\s*)?failed to fetch\.?$/i;

export function createSidePanelDocumentContext({
  elements,
  conversation,
  selectionPanel,
  onDocumentChange,
  onComparativeReadingContext,
  onAskReadinessChange,
  onDiagnostic
}) {
  let activeTab = null;
  // Saved copies of local files that should parse as soon as their tab opens.
  const parseOnArrivalUrls = new Set();
  let currentDocument = null;
  let titleSaveTimer = null;
  let refreshTimer = null;
  let documentRequestId = 0;
  let currentPaperUrl = "";
  let manualParseReady = false;
  let preservedViewTabId = null;
  let preservingExternalNavigation = false;
  let copyFeedbackTimer = null;

  elements.reloadPdf.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Reload and re-parse this PDF? This may reset the chat context."
    );
    if (!confirmed) {
      return;
    }
    loadPdf({ bypassCache: true });
  });
  elements.downloadPaperArtifacts.addEventListener("click", downloadCurrentParserArtifacts);
  elements.openPaperUrl.addEventListener("click", openCurrentPaperUrl);
  elements.documentTitle.addEventListener("input", updateManualDocumentTitle);
  elements.pdfStatus.addEventListener("click", toggleAgentConnectionHelp);
  elements.pdfStatus.addEventListener("keydown", handleAgentConnectionHelpKeydown);
  elements.copyAgentConnectionCommand.addEventListener("click", copyAgentConnectionCommand);
  document.addEventListener("pointerdown", handleAgentConnectionOutsidePointerDown);
  document.addEventListener("keydown", handleAgentConnectionDocumentKeydown);

  function start() {
    refreshState();
    window.setInterval(refreshSelection, 1500);
    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.storage.onChanged.addListener(handleParsingSettingsChanged);
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
      renderIdleState(false);

      if (isReadingDashboardTab(activeTab)) {
        await renderLibraryPaperContextIfCurrent(request);
        return;
      }

      if (!canLoadDocumentFromTab(activeTab)) {
        await renderDocumentIfCurrent(null, request);
        renderIdleState(true);
        return;
      }

      const cached = await getCachedDocumentForUrl({
        url: activeTab.url,
        parserId: getSelectedParserId(),
        cacheVersion: DOCUMENT_CACHE_VERSION,
        onDiagnostic
      });
      if (!isCurrentDocumentRequest(request)) {
        return;
      }

      if (cached) {
        parseOnArrivalUrls.delete(activeTab.url);
        await renderDocumentIfCurrent(cached, request);
      } else {
        await renderDocumentIfCurrent(null, request, { preserveConversationView: true });
        const parsingSettings = await getParsingSettings();
        if (!isCurrentDocumentRequest(request)) {
          return;
        }
        // A local PDF that was just copied in keeps going without a second click.
        const continueParse = parseOnArrivalUrls.delete(activeTab.url);
        if (parsingSettings.autoParse || continueParse) {
          await loadPdf({ bypassCache: false });
        } else {
          renderIdleState(true, { manualParse: true });
        }
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

  function handleTabActivated(activeInfo) {
    if (preservingExternalNavigation || activeInfo?.tabId === preservedViewTabId) {
      return;
    }
    preservedViewTabId = null;
    scheduleRefreshState();
  }

  function handleTabUpdated(tabId, changeInfo) {
    if (preservingExternalNavigation || tabId === preservedViewTabId) {
      return;
    }
    if (activeTab?.id !== tabId) {
      return;
    }

    if (changeInfo.url || changeInfo.status === "complete") {
      scheduleRefreshState();
    }
  }

  async function preserveViewWhileOpening(openAction) {
    preservingExternalNavigation = true;
    try {
      const result = await openAction();
      preservedViewTabId = Number.isInteger(result?.tabId) ? result.tabId : null;
      return result;
    } finally {
      preservingExternalNavigation = false;
    }
  }

  async function preserveViewForActiveTab() {
    const tab = await getActiveTab();
    activeTab = tab;
    preservedViewTabId = tab.id;
  }

  function hasPreservedView() {
    return Number.isInteger(preservedViewTabId);
  }

  function resumeActiveTabContext() {
    preservedViewTabId = null;
    preservingExternalNavigation = false;
    refreshState();
  }

  function handleParsingSettingsChanged(changes, areaName) {
    if (areaName !== "local" || !changes[PARSING_SETTINGS_KEY]) {
      return;
    }

    const previous = normalizeParsingSettings(changes[PARSING_SETTINGS_KEY].oldValue);
    const next = normalizeParsingSettings(changes[PARSING_SETTINGS_KEY].newValue);
    if (!previous.autoParse && next.autoParse && manualParseReady) {
      scheduleRefreshState();
    }
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

  async function refreshSelection() {
    try {
      activeTab = await getActiveTab();
      if (isReadingDashboardTab(activeTab) || !canLoadDocumentFromTab(activeTab)) {
        selectionPanel.clearComposerSelection();
        return;
      }

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
      onDiagnostic?.("Step 1: reading active browser tab.");
      activeTab = await getActiveTab();
      renderTab(activeTab);
      request = beginDocumentRequest(activeTab);
      renderIdleState(false);
      onDiagnostic?.(`Active tab URL: ${activeTab.url}`);

      if (isReadingDashboardTab(activeTab)) {
        await renderLibraryPaperContextIfCurrent(request);
        onDiagnostic?.("Load skipped: Reading Dashboard uses stored paper context.");
        return;
      }

      if (!canLoadDocumentFromTab(activeTab)) {
        await renderDocumentIfCurrent(null, request);
        renderIdleState(true);
        onDiagnostic?.("Load skipped: active tab is not a recognized PDF viewer.");
        return;
      }

      if (isLocalPdfFileUrl(activeTab.url)) {
        // Read the saved copy rather than the file path, so moving or deleting
        // the original never loses the paper.
        setStatus("Saving a copy of this PDF...");
        const { viewerUrl } = await importLocalPdfFromFileUrl(activeTab.url);
        onDiagnostic?.("Saved a copy of the local PDF; opening the saved copy.");
        parseOnArrivalUrls.add(viewerUrl);
        await chrome.tabs.update(activeTab.id, { url: viewerUrl });
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
        onDiagnostic,
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

  async function activateIdleToaster() {
    if (!manualParseReady) {
      return false;
    }

    manualParseReady = false;
    await loadPdf({ bypassCache: false });
    return true;
  }

  async function renderLibraryPaperContextIfCurrent(request) {
    selectionPanel.clearComposerSelection();
    const response = await sendMessage({
      type: MessageType.GET_LIBRARY_PAPER_CONTEXT
    });
    if (!isCurrentDocumentRequest(request)) {
      return;
    }

    const documentKey = String(response.context?.documentKey || "").trim();
    const mode = String(response.context?.mode || "").trim();
    if (mode !== "library-paper" || !documentKey) {
      await renderDocumentIfCurrent(null, request, { preserveConversationView: true });
      await onComparativeReadingContext?.(response.context || {});
      return;
    }

    const [document, paper] = await Promise.all([
      getStoredDocumentByDocumentKey(documentKey),
      getLibraryPaperSummary(documentKey)
    ]);
    if (!isCurrentDocumentRequest(request)) {
      return;
    }

    if (!document) {
      await renderDocumentIfCurrent(null, request);
      renderLibraryPaperHeader(paper);
      setStatus("No cached paper context found for this dashboard item.");
      return;
    }

    await renderDocumentIfCurrent(mergeLibraryDocument(document, paper, response.context), request);
  }

  async function renderDocumentIfCurrent(document, request, options = {}) {
    if (!isCurrentDocumentRequest(request)) {
      return;
    }

    await renderDocument(document, options);
  }

  async function renderDocument(document, options = {}) {
    if (!document) {
      currentDocument = null;
      await conversation.setDocumentUrl("");
      if (!options.preserveConversationView) {
        await conversation.setSavedQuestionAnswerViewActive(false);
      }
      renderDocumentTitle(null);
      await onDocumentChange?.(null, options);
      renderContextReady(false);
      elements.downloadPaperArtifacts.disabled = true;
      elements.pdfStatus.textContent = "";
      onAskReadinessChange?.();
      return;
    }

    currentDocument = document;
    renderIdleState(false);
    renderDocumentTitle(document);
    renderPaperUrl(document.url || "");
    renderContextReady(true, document);
    elements.downloadPaperArtifacts.disabled = !canDownloadParserArtifacts(document);
    elements.pdfStatus.textContent = "";
    await conversation.setDocumentUrl(document.url, {
      documentKey: document.documentKey
    });
    await onDocumentChange?.(document, options);
    onAskReadinessChange?.();
  }

  function renderTab(tab) {
    if (!tab) {
      renderPaperUrl("");
      return;
    }

    renderPaperUrl(tab.url);
  }

  function renderLibraryPaperHeader(paper) {
    if (!paper) {
      return;
    }

    renderIdleState(false);
    renderDocumentTitle({
      title: paper.title || "Untitled paper"
    });
    renderPaperUrl(paper.canonicalUrl || paper.documentKey || "");
  }

  function renderPaperUrl(url) {
    currentPaperUrl = normalizeOpenableUrl(url);
    elements.openPaperUrl.disabled = !currentPaperUrl;
  }

  async function openCurrentPaperUrl() {
    const url = getCurrentPaperUrl();
    if (!url) {
      return;
    }

    try {
      await openPaperUrlInExistingTab(url);
    } catch (error) {
      showError(`Could not open paper URL.\n${error.message || String(error)}`);
    }
  }

  function downloadCurrentParserArtifacts() {
    if (!window.confirm("Download this paper's parser artifacts as a ZIP file?")) {
      return;
    }
    try {
      downloadParserArtifacts(currentDocument);
    } catch (error) {
      showError(`Could not download parser artifacts.\n${error.message || String(error)}`);
    }
  }

  function getCurrentPaperUrl() {
    const documentUrl = normalizeOpenableUrl(currentDocument?.url);
    if (documentUrl) {
      return documentUrl;
    }

    if (currentPaperUrl) {
      return currentPaperUrl;
    }

    const activeUrl = normalizeOpenableUrl(activeTab?.url);
    if (!isReadingDashboardTab(activeTab) && activeUrl) {
      return activeUrl;
    }

    return "";
  }

  function updateManualDocumentTitle() {
    if (document.body.classList.contains("comparative-mode")) {
      return;
    }

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

  function queueCurrentDocumentCacheSave() {
    const documentUrl = currentDocument?.url || activeTab?.url || "";
    if (!currentDocument || !documentUrl) {
      return;
    }

    window.clearTimeout(titleSaveTimer);
    titleSaveTimer = window.setTimeout(async () => {
      try {
        await saveDocumentForUrl({
          url: documentUrl,
          parserId: getSelectedParserId(),
          cacheVersion: DOCUMENT_CACHE_VERSION,
          document: currentDocument
        });
      } catch (error) {
        onDiagnostic?.(`Manual title cache save skipped: ${error.message || String(error)}`);
      }
    }, 400);
  }

  function renderContextReady(isReady, document = null) {
    elements.contextReadyIndicator.classList.toggle("ready", Boolean(isReady));
    elements.contextReadyIndicator.classList.toggle("loading", !isReady);
    elements.contextReadyIndicator.classList.toggle("warning", false);
    elements.contextReadyIndicator.title = isReady ? formatContextReadyLabel(document) : "Preparing context";
    elements.contextReadyIndicator.setAttribute("aria-label", elements.contextReadyIndicator.title);
  }

  function renderDocumentTitle(document) {
    elements.documentTitle.readOnly = false;
    const title = document?.title?.trim();

    if (title) {
      elements.documentTitle.value = title;
      elements.documentTitle.placeholder = "Document title";
      elements.documentTitle.classList.remove("muted");
      elements.documentTitle.removeAttribute("title");
      return;
    }

    elements.documentTitle.value = "";
    elements.documentTitle.placeholder = "Title not found";
    elements.documentTitle.classList.add("muted");
    elements.documentTitle.removeAttribute("title");
  }

  function showError(message) {
    const normalizedMessage = String(message || "").trim();
    elements.pdfStatus.textContent = normalizedMessage;
    elements.pdfStatus.removeAttribute("title");
    elements.pdfStatus.classList.add("error");
    setAgentConnectionErrorState(AGENT_CONNECTION_ERROR_PATTERN.test(normalizedMessage));
  }

  function setStatus(message) {
    elements.pdfStatus.textContent = message;
    elements.pdfStatus.removeAttribute("title");
    elements.pdfStatus.classList.remove("error");
    setAgentConnectionErrorState(false);
  }

  function clearError() {
    elements.pdfStatus.classList.remove("error");
    setAgentConnectionErrorState(false);
  }

  function setAgentConnectionErrorState(isAgentConnectionError) {
    elements.pdfStatus.classList.toggle("agent-connection-error", isAgentConnectionError);
    if (isAgentConnectionError) {
      elements.pdfStatus.setAttribute("role", "button");
      elements.pdfStatus.setAttribute("tabindex", "0");
      elements.pdfStatus.setAttribute("aria-haspopup", "dialog");
      elements.pdfStatus.setAttribute("aria-expanded", "false");
      elements.pdfStatus.setAttribute("aria-label", "Failed to fetch. Show agent connection help.");
      return;
    }

    elements.pdfStatus.removeAttribute("role");
    elements.pdfStatus.removeAttribute("tabindex");
    elements.pdfStatus.removeAttribute("aria-haspopup");
    elements.pdfStatus.removeAttribute("aria-expanded");
    elements.pdfStatus.removeAttribute("aria-label");
    resetAgentConnectionCopyFeedback();
  }

  function toggleAgentConnectionHelp(event) {
    if (!elements.pdfStatus.classList.contains("agent-connection-error")) {
      return;
    }
    event?.stopPropagation?.();
    const isOpen = elements.pdfStatus.getAttribute("aria-expanded") === "true";
    elements.pdfStatus.setAttribute("aria-expanded", String(!isOpen));
  }

  function handleAgentConnectionHelpKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    toggleAgentConnectionHelp(event);
  }

  function handleAgentConnectionOutsidePointerDown(event) {
    if (!elements.statusLineShell.contains(event.target)) {
      closeAgentConnectionHelp();
    }
  }

  function handleAgentConnectionDocumentKeydown(event) {
    if (event.key === "Escape") {
      closeAgentConnectionHelp();
    }
  }

  function closeAgentConnectionHelp() {
    if (elements.pdfStatus.classList.contains("agent-connection-error")) {
      elements.pdfStatus.setAttribute("aria-expanded", "false");
    }
  }

  async function copyAgentConnectionCommand(event) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(elements.agentConnectionCommand.textContent.trim());
      showAgentConnectionCopyFeedback("Copied", true);
    } catch (error) {
      showAgentConnectionCopyFeedback("Copy failed", false);
      onDiagnostic?.(`Could not copy local agent command: ${error.message || String(error)}`);
    }
  }

  function showAgentConnectionCopyFeedback(label, copied) {
    window.clearTimeout(copyFeedbackTimer);
    const labelElement = elements.copyAgentConnectionCommand.querySelector(".agent-connection-copy-label");
    labelElement.textContent = label;
    elements.copyAgentConnectionCommand.classList.toggle("copied", copied);
    copyFeedbackTimer = window.setTimeout(resetAgentConnectionCopyFeedback, 1200);
  }

  function resetAgentConnectionCopyFeedback() {
    window.clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = null;
    const labelElement = elements.copyAgentConnectionCommand.querySelector(".agent-connection-copy-label");
    if (labelElement) {
      labelElement.textContent = "Copy";
    }
    elements.copyAgentConnectionCommand.classList.remove("copied");
  }

  function setBusy(button, busy) {
    button.disabled = busy;
  }

  function renderIdleState(isIdle, options = {}) {
    manualParseReady = Boolean(isIdle && options.manualParse);
    document.body.classList.toggle("idle-mode", Boolean(isIdle));
    document.body.classList.toggle("manual-parse-mode", manualParseReady);
    elements.idleState.hidden = !isIdle;
    elements.idleOpenDashboard.hidden = manualParseReady;
    elements.idleState.querySelector(".idle-bubble").hidden = !manualParseReady;
    elements.manualParseTrigger.hidden = !manualParseReady;

    if (!isIdle) {
      return;
    }

    elements.pdfStatus.textContent = "";
    elements.pdfStatus.classList.remove("error");
    renderPaperUrl("");
    elements.reloadPdf.disabled = true;
    elements.downloadPaperArtifacts.disabled = true;
    elements.documentStar.disabled = true;
    elements.conversationThreadArchive.disabled = true;
    elements.conversationThread.hidden = true;
    selectionPanel.clearComposerSelection();
  }

  function getCurrentDocument() {
    return currentDocument;
  }

  async function refreshFromSync() {
    if (!currentDocument?.documentKey) return;
    const previous = currentDocument;
    const requestId = documentRequestId;
    const [document, paper] = await Promise.all([
      getStoredDocumentByDocumentKey(previous.documentKey),
      getLibraryPaperSummary(previous.documentKey)
    ]);
    if (requestId !== documentRequestId || currentDocument !== previous) return;
    await renderDocument(document ? {
      ...previous,
      ...document,
      url: previous.url,
      title: paper?.title || document.title
    } : null, { preserveConversationView: true });
  }

  return {
    start,
    scheduleRefreshState,
    refreshSelection,
    activateIdleToaster,
    preserveViewWhileOpening,
    preserveViewForActiveTab,
    hasPreservedView,
    resumeActiveTabContext,
    getCurrentDocument,
    refreshFromSync,
    clearError,
    showError
  };
}

async function sendMessage(message) {
  const response = await chrome.runtime.sendMessage(message);
  if (!response?.ok) {
    throw new Error(response?.error || "Extension request failed.");
  }
  return response;
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

function normalizeManualTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isReadingDashboardTab(tab) {
  const dashboardUrl = chrome.runtime.getURL("src/dashboard/dashboard.html");
  return Boolean(tab?.url?.startsWith(dashboardUrl));
}

function mergeLibraryDocument(document, paper, context = {}) {
  return {
    ...document,
    url: document.url || paper?.canonicalUrl || "",
    title: document.title || paper?.title || "",
    titleSource: document.titleSource || paper?.titleSource || "",
    isStarred: Boolean(paper?.isStarred),
    group: paper?.group || "",
    groupTone: paper?.groupTone ?? null,
    sidePanelContextMode: String(context?.mode || ""),
    sidePanelContextSource: String(context?.source || ""),
    sidePanelContextSelectedAt: Number(context?.selectedAt) || 0
  };
}

function clearDiagnostics() {
  // Diagnostics stay in the console now; the side panel UI stays minimal.
}

function formatContextReadyLabel(document) {
  if (!document) {
    return "Context ready";
  }

  const parserLabel = document.parser?.label || document.parser?.id || "unknown parser";
  const outputKind = document.parser?.outputKind ? `/${document.parser.outputKind}` : "";
  const outlineType = document.metadata?.outlineType;
  const mode = outlineType ? ` · ${outlineType} outline` : "";
  const degraded = document.metadata?.degradedMode ? " · degraded reconstruction" : "";
  return `Context ready · ${parserLabel}${outputKind}${mode}${degraded}`;
}
