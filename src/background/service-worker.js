import { MessageType } from "../shared/messages.js";

const CAPTURE_SELECTION_MENU_ID = "capture-selection";
const selectionsByTab = new Map();

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.contextMenus.create({
    id: CAPTURE_SELECTION_MENU_ID,
    title: "### Capture selection ###",
    contexts: ["selection"]
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
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
        capturedAt: message.capturedAt,
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

    case MessageType.CLEAR_SELECTION:
      if (message.tabId) {
        selectionsByTab.delete(message.tabId);
      }
      return { ok: true };

    default:
      throw new Error(`Unknown message type: ${message?.type}`);
  }
}

function saveSelectionForTab(tab, selection) {
  if (!tab?.id || !selection?.text) {
    return;
  }

  selectionsByTab.set(tab.id, {
    text: String(selection.text || "").trim(),
    sourceUrl: selection.sourceUrl || tab.url || "",
    tabUrl: tab.url || "",
    capturedAt: selection.capturedAt || Date.now(),
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
