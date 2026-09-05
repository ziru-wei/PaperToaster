import { MessageType } from "../shared/messages.js";
import { isHttpUrl } from "../pdf/fetch-pdf.js";
import { acquirePdfBytesFromTab } from "../pdf/acquire-pdf.js";
import { extractRawMarkdownHeadingTitle } from "../pdf/extract-markdown-title.js";
import { extractPdfMetadataTitleFromBytes } from "../pdf/extract-metadata-title.js";
import { extractRenderedTextContentFromTab } from "../pdf/extract-rendered-text.js";
import { createEmptyTitleInfo, selectTitleInfoByPriority } from "../pdf/select-title.js";
import { retrieveRelevantChunks } from "../pdf/retrieve.js";
import { buildSelectionContextPack, formatSelectionContextForPrompt } from "../pdf/selection-context.js";
import { DEFAULT_PARSER_ID, parsePdfToContent } from "../parsers/parser-registry.js";
import { createDocument } from "../document/create-document.js";
import { getDocumentStoreKey, getStoredDocument, saveStoredDocument } from "../storage/document-store.js";

const documents = new Map();
const DOCUMENT_CACHE_VERSION = "v15";
let activeTab = null;
let currentDocument = null;
let titleSaveTimer = null;
let refreshTimer = null;
let currentLoadKey = null;

const elements = {
  reloadPdf: document.querySelector("#reloadPdf"),
  documentTitle: document.querySelector("#documentTitle"),
  tabStatus: document.querySelector("#tabStatus"),
  pdfStatus: document.querySelector("#pdfStatus"),
  searchForm: document.querySelector("#searchForm"),
  query: document.querySelector("#query"),
  results: document.querySelector("#results"),
  selectionStatus: document.querySelector("#selectionStatus"),
  selectionText: document.querySelector("#selectionText"),
  selectionQuestionForm: document.querySelector("#selectionQuestionForm"),
  selectionQuestion: document.querySelector("#selectionQuestion"),
  prepareSelectionContext: document.querySelector("#prepareSelectionContext"),
  selectionContextStatus: document.querySelector("#selectionContextStatus"),
  copySelection: document.querySelector("#copySelection"),
  clearSelection: document.querySelector("#clearSelection")
};

for (const [name, element] of Object.entries(elements)) {
  if (!element) {
    throw new Error(`Side panel element missing: ${name}`);
  }
}

elements.reloadPdf.addEventListener("click", () => {
  loadPdf({ bypassCache: true });
});
elements.documentTitle.addEventListener("input", () => {
  updateManualDocumentTitle();
});
elements.searchForm.addEventListener("submit", searchPdf);
elements.selectionQuestionForm.addEventListener("submit", prepareSelectionContext);
elements.copySelection.addEventListener("click", copySelection);
elements.clearSelection.addEventListener("click", clearSelection);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.PDF_SELECTION_CHANGED) {
    refreshSelection();
  }
});

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
  setBusy(elements.reloadPdf, true);
  clearError();

  try {
    activeTab = await getActiveTab();
    renderTab(activeTab);

    if (!canAttemptPdfLoad(activeTab.url)) {
      renderDocument(null);
      setStatus("Open a web PDF or publisher PDF viewer tab to inspect.");
      await refreshSelection();
      return;
    }

    const cached = await getCachedDocument(activeTab.url, getSelectedParserId());
    if (cached) {
      renderDocument(cached, true);
    } else {
      renderDocument(null);
      await loadPdf({ bypassCache: false });
    }

    await refreshSelection();
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(elements.reloadPdf, false);
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
    renderSelection(response.selection);
  } catch {
    // Keep the panel quiet if the background worker is waking up.
  }
}

async function loadPdf(options = {}) {
  const bypassCache = options.bypassCache !== false;
  setBusy(elements.reloadPdf, true);
  clearError();
  clearDiagnostics();

  try {
    addDiagnostic("Step 1: reading active browser tab.");
    activeTab = await getActiveTab();
    renderTab(activeTab);
    addDiagnostic(`Active tab URL: ${activeTab.url}`);

    if (!canAttemptPdfLoad(activeTab.url)) {
      renderDocument(null);
      setStatus("Open a web PDF or publisher PDF viewer tab to inspect.");
      addDiagnostic("Load skipped: active tab URL is not an http/https page.");
      return;
    }

    const parserId = getSelectedParserId();
    const cacheKey = getCacheKey(activeTab.url, parserId);
    if (currentLoadKey === cacheKey) {
      return;
    }

    if (!bypassCache) {
      const cached = await getCachedDocument(activeTab.url, parserId);
      if (cached) {
        renderDocument(cached, true);
        return;
      }
    }

    currentLoadKey = cacheKey;
    setStatus("Loading PDF...");
    renderDocumentTitle(null);

    let titleInfo = createEmptyTitleInfo();
    renderDocumentTitle(titleInfo);

    addDiagnostic(bypassCache
      ? "Step 2: bypassing local document store for explicit reload."
      : "Step 2: no local document found; loading and storing this PDF.");

    let fetched;
    let content;
    let primaryError = null;

    try {
      fetched = await acquirePdfBytesFromTab(activeTab, {
        onDiagnostic: addDiagnostic
      });
      addDiagnostic([
        `Fetch ok: HTTP ${fetched.status}`,
        `content-type=${fetched.contentType || "unknown"}`,
        `bytes=${fetched.byteLength}`,
        `pdf-header=${fetched.hasPdfHeader ? "yes" : "no"}`
      ].join(", "));
      if (fetched.finalUrl && fetched.finalUrl !== activeTab.url) {
        addDiagnostic(`Redirected to: ${fetched.finalUrl}`);
      }

      const metadataTitleInfo = await extractPdfMetadataTitleFromBytes(fetched.bytes, {
        onDiagnostic: addDiagnostic
      });
      titleInfo = selectTitleInfoByPriority(metadataTitleInfo);
      renderDocumentTitle(titleInfo);

      addDiagnostic(`Step 4: parsing PDF with parser "${parserId}".`);
      content = await parsePdfToContent({
        url: activeTab.url,
        bytes: fetched.bytes
      }, {
        parserId,
        onProgress: (progress) => addDiagnostic(progress.detail || progress.stage)
      });
      addDiagnostic(`${content.parserLabel} produced ${content.pageCount} pages as ${content.outputKind}.`);

      const markdownTitleInfo = extractRawMarkdownHeadingTitle(content.rawMarkdown, {
        onDiagnostic: addDiagnostic
      });
      titleInfo = selectTitleInfoByPriority(metadataTitleInfo, markdownTitleInfo);
      renderDocumentTitle(titleInfo);
    } catch (error) {
      primaryError = error;
      addDiagnostic(`PDF byte acquisition/parsing failed: ${error.message || String(error)}`);
      try {
        content = await extractRenderedTextContentFromTab(activeTab, {
          onDiagnostic: addDiagnostic
        });
      } catch (fallbackError) {
        throw new Error([
          "Primary PDF fetch/parse failed:",
          primaryError.message || String(primaryError),
          "",
          "Rendered-text fallback also failed:",
          fallbackError.message || String(fallbackError)
        ].join("\n"));
      }
      fetched = {
        byteLength: null,
        contentType: "rendered-viewer-text"
      };
      addDiagnostic(`${content.parserLabel} produced ${content.pageCount} rendered text groups.`);
    }

    addDiagnostic("Step 5: extracting text and building chunks.");
    const document = createDocument({
      url: activeTab.url,
      fetched,
      content,
      titleInfo
    });
    const extractedChars = document.pages.reduce((total, page) => total + page.text.length, 0);
    addDiagnostic(`Extracted ${extractedChars.toLocaleString()} text characters into ${document.chunks.length} chunks.`);

    for (const warning of document.warnings) {
      addDiagnostic(`${warning.severity}: ${warning.message}`);
    }

    if (!document.pages.some((page) => page.text)) {
      throw new Error("No text could be extracted. This may be a scanned/image-only PDF.");
    }

    addDiagnostic("Step 6: saving title, URL, and cleaned document text to local document store.");
    try {
      const storedDocument = await saveDocumentToCache(activeTab.url, parserId, document);
      currentDocument = storedDocument;
      addDiagnostic("Local document store saved.");
    } catch (error) {
      addDiagnostic(`Local document store skipped: ${error.message || String(error)}`);
    }
    renderDocument(document, false);
  } catch (error) {
    showError(`Could not load PDF.\n${error.message || String(error)}`);
  } finally {
    currentLoadKey = null;
    setBusy(elements.reloadPdf, false);
  }
}

async function searchPdf(event) {
  event.preventDefault();
  clearError();
  elements.results.textContent = "";

  try {
    if (!elements.query.value.trim()) {
      throw new Error("Enter a search question or keyword.");
    }

    activeTab = activeTab || await getActiveTab();
    const document = await getCachedDocument(activeTab.url, getSelectedParserId());
    if (!document) {
      throw new Error("Load the current PDF before searching it.");
    }

    renderResults(retrieveRelevantChunks(document.chunks || [], elements.query.value));
  } catch (error) {
    showError(error.message);
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

function canAttemptPdfLoad(url) {
  return isHttpUrl(url);
}

function getCacheKey(url, parserId, version = DOCUMENT_CACHE_VERSION) {
  return getDocumentStoreKey({ url, parserId, cacheVersion: version });
}

async function getCachedDocument(url, parserId) {
  const cacheKey = getCacheKey(url, parserId);

  if (documents.has(cacheKey)) {
    return documents.get(cacheKey);
  }

  let document = null;
  try {
    document = await getStoredDocument({
      url,
      parserId,
      cacheVersion: DOCUMENT_CACHE_VERSION
    });
  } catch (error) {
    addDiagnostic(`Local document store read skipped: ${error.message || String(error)}`);
  }

  if (isUsableCachedDocument(document, parserId)) {
    documents.set(cacheKey, document);
    return document;
  }

  return null;
}

function isUsableCachedDocument(document, parserId) {
  if (!document || !isCompatibleCachedParser(document.parser?.id, parserId)) {
    return false;
  }

  if (!Array.isArray(document.pages) || !document.pages.some((page) => page.text?.trim())) {
    return false;
  }

  return Boolean(document.markdown?.trim() || document.pages.some((page) => page.text?.trim()));
}

async function saveDocumentToCache(url, parserId, document) {
  const cacheKey = getCacheKey(url, parserId);
  const storedDocument = await saveStoredDocument({
    url,
    parserId,
    cacheVersion: DOCUMENT_CACHE_VERSION,
    document
  });
  documents.set(cacheKey, storedDocument);
  return storedDocument;
}

function isCompatibleCachedParser(cachedParserId, requestedParserId) {
  if (cachedParserId === requestedParserId) {
    return true;
  }

  return requestedParserId === "pdf2md-markdown" && cachedParserId === "pdfjs-markdown";
}

function renderTab(tab) {
  if (!tab) {
    elements.tabStatus.textContent = "No active tab found.";
    elements.tabStatus.removeAttribute("title");
    return;
  }

  elements.tabStatus.textContent = tab.url;
  elements.tabStatus.title = tab.url;
}

function renderDocument(document, fromCache = false) {
  if (!document) {
    currentDocument = null;
    renderDocumentTitle(null);
    elements.pdfStatus.textContent = "";
    updateSelectionContextReadiness();
    return;
  }

  currentDocument = document;
  renderDocumentTitle(document);
  elements.pdfStatus.textContent = "";
  updateSelectionContextReadiness();
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
      await saveDocumentToCache(activeTab.url, getSelectedParserId(), currentDocument);
    } catch (error) {
      addDiagnostic(`Manual title cache save skipped: ${error.message || String(error)}`);
    }
  }, 400);
}

function renderSelection(selection) {
  if (!selection?.text) {
    elements.selectionStatus.textContent = "Select text in the PDF viewer.";
    elements.selectionText.textContent = "";
    setSelectionActionsEnabled(false);
    elements.selectionContextStatus.textContent = "";
    updateSelectionContextReadiness();
    return;
  }

  const when = selection.capturedAt ? new Date(selection.capturedAt).toLocaleTimeString() : "recently";
  elements.selectionStatus.textContent = `Captured ${when}`;
  elements.selectionText.textContent = selection.text;
  elements.selectionContextStatus.textContent = "";
  setSelectionActionsEnabled(true);
  updateSelectionContextReadiness();
}

async function copySelection() {
  const text = elements.selectionText.textContent.trim();
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    elements.selectionStatus.textContent = "Copied";
  } catch (error) {
    showError(`Could not copy selection.\n${error.message || String(error)}`);
  }
}

async function clearSelection() {
  try {
    activeTab = activeTab || await getActiveTab();
    await sendMessage({
      type: MessageType.CLEAR_SELECTION,
      tabId: activeTab.id
    });
  } catch {
    // Clearing the visible panel state is still correct if the worker is waking up.
  }

  renderSelection(null);
}

function setSelectionActionsEnabled(enabled) {
  elements.copySelection.disabled = !enabled;
  elements.clearSelection.disabled = !enabled;
  updateSelectionContextReadiness();
}

function updateSelectionContextReadiness() {
  const hasSelection = Boolean(elements.selectionText.textContent.trim());
  elements.prepareSelectionContext.disabled = !currentDocument || !hasSelection;
}

function prepareSelectionContext(event) {
  event.preventDefault();
  clearError();

  try {
    const question = elements.selectionQuestion.value.trim();
    const selectionText = elements.selectionText.textContent.trim();
    if (!question) {
      throw new Error("Enter a question about the selected text.");
    }

    const contextPack = buildSelectionContextPack({
      document: currentDocument,
      selectionText,
      question
    });
    console.debug("[PDF AI] Selection context pack", contextPack);
    console.debug("[PDF AI] Selection prompt context\n%s", formatSelectionContextForPrompt(contextPack));
    elements.selectionContextStatus.textContent = contextPack.selection.anchor
      ? "Context ready."
      : "Context ready, but the selected text was not confidently located in the paper.";
  } catch (error) {
    elements.selectionContextStatus.textContent = "";
    showError(error.message || String(error));
  }
}

function renderResults(results) {
  elements.results.textContent = "";

  if (!results.length) {
    elements.results.textContent = "No matching text found.";
    return;
  }

  for (const result of results) {
    const item = document.createElement("article");
    item.className = "result";

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = `p. ${result.pageStart}, score ${result.score}`;

    const text = document.createElement("div");
    text.textContent = result.text.slice(0, 900);

    item.append(title, text);
    elements.results.append(item);
  }
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
