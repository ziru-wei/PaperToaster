import { MessageType } from "../shared/messages.js";
import { getComparisonSettings } from "../storage/comparison-settings-store.js";
import { openExtensionPageInExistingTab } from "../browser/open-paper-tab.js";
import {
  filterActiveLibraryDocumentKeys,
  listLibraryPaperTitleUrlMappings
} from "../storage/library-store.js";
import {
  PAPER_TOASTER_EXTERNAL_API_VERSION,
  PaperToasterExternalMessageType,
  PaperToasterLibraryScope
} from "../shared/external-api.js";

const CAPTURE_SELECTION_MENU_ID = "capture-selection";
const LIBRARY_PAPER_CONTEXT_KEY = "libraryPaperContext";
const selectionsByTab = new Map();
let fallbackLibraryPaperContext = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.contextMenus.create({
    id: CAPTURE_SELECTION_MENU_ID,
    title: "------------------------------>",
    contexts: ["selection"]
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-dashboard") {
    return;
  }

  openExtensionPageInExistingTab(
    chrome.runtime.getURL("src/dashboard/dashboard.html")
  ).catch((error) => {
    console.error("Could not open Paper Toaster dashboard", error);
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  selectionsByTab.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    selectionsByTab.delete(tabId);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CAPTURE_SELECTION_MENU_ID || !tab?.id) {
    return;
  }

  const text = String(info.selectionText || "").trim();
  if (!text) {
    return;
  }

  saveSelectionForTab(tab, {
    text,
    sourceUrl: info.frameUrl || info.pageUrl || tab.url || "",
    captureMethod: "context-menu"
  });

  notifySelectionChanged(tab);
  openPanelForTab(tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      console.error(error);
      sendResponse({ ok: false, error: error.message || String(error) });
    });

  return true;
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  handleExternalMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      console.error("Paper Toaster external API request failed", error);
      sendResponse({
        ok: false,
        apiVersion: PAPER_TOASTER_EXTERNAL_API_VERSION,
        error: {
          code: "internal-error",
          message: error.message || String(error)
        }
      });
    });

  return true;
});

async function handleExternalMessage(message, sender) {
  if (!sender?.id || sender.id === chrome.runtime.id) {
    return createExternalApiError("extension-only", "Only another Chrome extension can use this API.");
  }
  if (message?.apiVersion !== PAPER_TOASTER_EXTERNAL_API_VERSION) {
    return createExternalApiError("unsupported-version", `Use API version ${PAPER_TOASTER_EXTERNAL_API_VERSION}.`);
  }
  if (message?.type !== PaperToasterExternalMessageType.GET_PAPER_TITLE_URL_MAPPINGS) {
    return createExternalApiError("unsupported-request", "The external API request type is not supported.");
  }

  const scope = normalizeExternalLibraryScope(message.scope);
  const mappings = await listLibraryPaperTitleUrlMappings({ scope });
  return {
    ok: true,
    apiVersion: PAPER_TOASTER_EXTERNAL_API_VERSION,
    scope,
    mappings
  };
}

function createExternalApiError(code, message) {
  return {
    ok: false,
    apiVersion: PAPER_TOASTER_EXTERNAL_API_VERSION,
    error: { code, message }
  };
}

function normalizeExternalLibraryScope(scope) {
  if (scope === PaperToasterLibraryScope.BOARD || scope === PaperToasterLibraryScope.ARCHIVE) {
    return scope;
  }
  return PaperToasterLibraryScope.ALL;
}

async function handleMessage(message, sender) {
  switch (message?.type) {
    case MessageType.PDF_SELECTION_CHANGED: {
      const tabId = sender.tab?.id || message.tabId;
      if (!tabId) {
        return { ok: true };
      }

      saveSelectionForTab({
        id: tabId,
        url: sender.tab?.url || message.tabUrl || ""
      }, {
        text: message.text,
        sourceUrl: message.sourceUrl || sender.tab?.url || message.tabUrl || "",
        captureMethod: message.captureMethod || "content-script"
      });
      if (message.openPanel && sender.tab) {
        openPanelForTab(sender.tab);
      }
      return { ok: true };
    }

    case MessageType.GET_LATEST_SELECTION:
      return {
        ok: true,
        selection: getSelectionForTab(message.tabId, message.tabUrl)
      };

    case MessageType.OPEN_LIBRARY_PAPER_CONTEXT:
      return openLibraryPaperContext(message, sender);

    case MessageType.OPEN_COMPARISON_CONTEXT:
      return openComparisonContext(message, sender);

    case MessageType.CLEAR_DASHBOARD_CONTEXT:
      return clearDashboardContext(message, sender);

    case MessageType.UPDATE_COMPARISON_DRAFT:
      return updateComparisonDraft(message, sender);

    case MessageType.GET_LIBRARY_PAPER_CONTEXT:
      return {
        ok: true,
        context: await getLibraryPaperContext()
      };

    case MessageType.LIBRARY_PAPER_CONTEXT_CHANGED:
      return { ok: true };

    case MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED:
      return { ok: true };

    default:
      throw new Error(`Unknown message type: ${message?.type}`);
  }
}

async function openLibraryPaperContext(message, sender) {
  const documentKey = String(message.documentKey || "").trim();
  if (!documentKey) {
    throw new Error("No document key was provided.");
  }

  const context = {
    documentKey,
    mode: "library-paper",
    source: "dashboard",
    selectedAt: Date.now()
  };
  await setLibraryPaperContext(context);

  if (sender.tab) {
    await openPanelForTab(sender.tab);
  }

  notifyLibraryPaperContextChanged(context);

  return { ok: true, context };
}

async function openComparisonContext(message, sender) {
  const comparisonId = String(message.comparisonId || "").trim();
  const context = {
    comparisonId,
    mode: "comparative-reading",
    source: "dashboard",
    draftDocumentKeys: [],
    selectedAt: Date.now()
  };
  await setLibraryPaperContext(context);

  if (sender.tab) {
    await openPanelForTab(sender.tab);
  }

  notifyLibraryPaperContextChanged(context);
  return { ok: true, context };
}

async function clearDashboardContext(message, sender) {
  const context = {
    comparisonId: "",
    mode: "comparative-reading",
    source: "dashboard",
    draftDocumentKeys: [],
    selectedAt: Date.now()
  };
  await setLibraryPaperContext(context);

  if (sender.tab && message.openPanel) {
    await openPanelForTab(sender.tab);
  }

  notifyLibraryPaperContextChanged(context);
  return { ok: true, context };
}

async function updateComparisonDraft(message, sender) {
  const panelOpenPromise = sender?.tab && message.openPanel
    ? openPanelForTab(sender.tab)
    : Promise.resolve();
  const { paperLimit } = await getComparisonSettings();
  const incomingDocumentKeys = Array.isArray(message.documentKeys)
    ? message.documentKeys.map((key) => String(key || "").trim()).filter(Boolean)
    : [];
  const currentContext = message.append ? await getLibraryPaperContext() : null;
  const currentDraftDocumentKeys = (
    currentContext?.mode === "comparative-reading" &&
    !currentContext?.comparisonId &&
    Array.isArray(currentContext?.draftDocumentKeys)
  ) ? currentContext.draftDocumentKeys : [];
  const uniqueDocumentKeys = await filterActiveLibraryDocumentKeys([...new Set([
    ...(message.append ? currentDraftDocumentKeys : []),
    ...incomingDocumentKeys
  ])]);
  const hasOverflow = Boolean(message.rejectOverflow) && uniqueDocumentKeys.length > paperLimit;
  const context = {
    comparisonId: "",
    mode: "comparative-reading",
    source: "dashboard",
    draftDocumentKeys: hasOverflow ? currentDraftDocumentKeys.slice(0, paperLimit) : uniqueDocumentKeys.slice(0, paperLimit),
    draftIssue: hasOverflow ? "too-many-papers" : "",
    selectedAt: Date.now()
  };
  await setLibraryPaperContext(context);
  await panelOpenPromise;
  notifyLibraryPaperContextChanged(context);
  return { ok: true, context };
}

async function setLibraryPaperContext(context) {
  fallbackLibraryPaperContext = context;
  if (chrome.storage?.session) {
    await chrome.storage.session.set({
      [LIBRARY_PAPER_CONTEXT_KEY]: context
    });
  }
}

function notifyLibraryPaperContextChanged(context) {
  chrome.runtime.sendMessage({
    type: MessageType.LIBRARY_PAPER_CONTEXT_CHANGED,
    context
  }).catch(() => {
    // Side panel may be closed; it will read session state when opened.
  });
}

async function getLibraryPaperContext() {
  if (chrome.storage?.session) {
    const data = await chrome.storage.session.get(LIBRARY_PAPER_CONTEXT_KEY);
    return data[LIBRARY_PAPER_CONTEXT_KEY] || fallbackLibraryPaperContext;
  }

  return fallbackLibraryPaperContext;
}

function saveSelectionForTab(tab, selection) {
  if (!tab?.id || !selection?.text) {
    return;
  }

  selectionsByTab.set(tab.id, {
    text: String(selection.text || "").trim(),
    sourceUrl: selection.sourceUrl || tab.url || "",
    tabUrl: tab.url || "",
    captureMethod: selection.captureMethod || "unknown"
  });
}

function notifySelectionChanged(tab) {
  chrome.runtime.sendMessage({
    type: MessageType.PDF_SELECTION_CHANGED,
    tabId: tab.id
  }).catch(() => {
    // Side panel may be closed; polling will pick this up when it opens.
  });
}

async function openPanelForTab(tab) {
  if (!tab?.windowId) {
    return;
  }

  await chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {
    // Opening the panel is best-effort from user-triggered capture actions.
  });
}

function getSelectionForTab(tabId, tabUrl) {
  if (!tabId) {
    return null;
  }

  const selection = selectionsByTab.get(tabId);
  if (!selection) {
    return null;
  }

  if (tabUrl && selection.tabUrl && normalizeUrl(tabUrl) !== normalizeUrl(selection.tabUrl)) {
    selectionsByTab.delete(tabId);
    return null;
  }

  return selection;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return String(url || "");
  }
}
