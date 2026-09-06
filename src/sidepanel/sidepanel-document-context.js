import { MessageType } from "../shared/messages.js";
import { DEFAULT_PARSER_ID } from "../parsers/parser-registry.js";
import {
  canLoadDocumentFromTab,
  getCachedDocumentForUrl,
  loadDocumentForTab,
  saveDocumentForUrl
} from "../document/load-document.js";
import { getStoredDocumentByDocumentKey } from "../storage/document-store.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";

const DOCUMENT_CACHE_VERSION = "v15";

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
  let currentDocument = null;
  let titleSaveTimer = null;
  let refreshTimer = null;
  let documentRequestId = 0;

  elements.reloadPdf.addEventListener("click", () => {
    loadPdf({ bypassCache: true });
  });
  elements.copyTabUrl.addEventListener("click", copyActiveTabUrl);
  elements.documentTitle.addEventListener("input", updateManualDocumentTitle);

  function start() {
    refreshState();
    window.setInterval(refreshSelection, 1500);
    chrome.tabs.onActivated.addListener(scheduleRefreshState);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
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

      if (isReadingDashboardTab(activeTab)) {
        await renderLibraryPaperContextIfCurrent(request);
        return;
      }

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
        onDiagnostic
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

  function handleTabUpdated(tabId, changeInfo) {
    if (activeTab?.id !== tabId) {
      return;
    }

    if (changeInfo.url || changeInfo.status === "complete") {
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
      if (isReadingDashboardTab(activeTab)) {
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
      onDiagnostic?.(`Active tab URL: ${activeTab.url}`);

      if (isReadingDashboardTab(activeTab)) {
        await renderLibraryPaperContextIfCurrent(request);
        onDiagnostic?.("Load skipped: Reading Dashboard uses stored paper context.");
        return;
      }

      if (!canLoadDocumentFromTab(activeTab)) {
        await renderDocumentIfCurrent(null, request);
        setStatus("Open a web PDF or publisher PDF viewer tab to inspect.");
        onDiagnostic?.("Load skipped: active tab URL is not an http/https page.");
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
      await renderDocumentIfCurrent(null, request);
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
      await onDocumentChange?.(null);
      renderContextReady(false);
      elements.pdfStatus.textContent = "";
      onAskReadinessChange?.();
      return;
    }

    currentDocument = document;
    renderDocumentTitle(document);
    renderUrlLine(document.url || "");
    renderContextReady(true);
    elements.pdfStatus.textContent = "";
    await conversation.setDocumentUrl(document.url);
    await onDocumentChange?.(document);
    onAskReadinessChange?.();
  }

  function renderTab(tab) {
    if (!tab) {
      elements.tabStatus.textContent = "No active tab found.";
      elements.tabStatus.removeAttribute("title");
      elements.copyTabUrl.disabled = true;
      return;
    }

    renderUrlLine(tab.url);
  }

  function renderLibraryPaperHeader(paper) {
    if (!paper) {
      return;
    }

    renderDocumentTitle({
      title: paper.title || "Untitled paper"
    });
    renderUrlLine(paper.canonicalUrl || paper.documentKey || "");
  }

  function renderUrlLine(url) {
    elements.tabStatus.textContent = url || "";
    elements.tabStatus.title = url || "";
    elements.copyTabUrl.disabled = !url;
  }

  async function copyActiveTabUrl() {
    const url = currentDocument?.url || elements.tabStatus.textContent.trim() || activeTab?.url || "";
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

  function renderContextReady(isReady) {
    elements.contextReadyIndicator.classList.toggle("ready", Boolean(isReady));
    elements.contextReadyIndicator.classList.toggle("loading", !isReady);
    elements.contextReadyIndicator.classList.toggle("warning", false);
    elements.contextReadyIndicator.title = isReady ? "Context ready" : "Preparing context";
    elements.contextReadyIndicator.setAttribute("aria-label", elements.contextReadyIndicator.title);
  }

  function renderDocumentTitle(document) {
    elements.documentTitle.readOnly = false;
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

  function showError(message) {
    elements.pdfStatus.textContent = message;
    elements.pdfStatus.classList.add("error");
  }

  function setStatus(message) {
    elements.pdfStatus.textContent = message;
    elements.pdfStatus.classList.remove("error");
  }

  function clearError() {
    elements.pdfStatus.classList.remove("error");
  }

  function setBusy(button, busy) {
    button.disabled = busy;
  }

  function getCurrentDocument() {
    return currentDocument;
  }

  return {
    start,
    scheduleRefreshState,
    refreshSelection,
    getCurrentDocument,
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
    sidePanelContextMode: String(context?.mode || ""),
    sidePanelContextSource: String(context?.source || ""),
    sidePanelContextSelectedAt: Number(context?.selectedAt) || 0
  };
}

function clearDiagnostics() {
  // Diagnostics stay in the console now; the side panel UI stays minimal.
}
