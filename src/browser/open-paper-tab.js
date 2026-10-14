import {
  getDocumentMemoryKey,
  getLocalPdfHashFromUrl,
  getLocalPdfViewerUrl,
  normalizeDocumentUrl
} from "../storage/document-key.js";

export async function openPaperUrlInExistingTab(url) {
  const targetUrl = normalizeOpenableUrl(url);
  if (!targetUrl) {
    throw new Error("No openable paper URL is available.");
  }

  const existingTab = await findExistingPaperTab(targetUrl);
  if (existingTab) {
    await focusTab(existingTab);
    return {
      action: "focused",
      tabId: existingTab.id,
      windowId: existingTab.windowId,
      url: existingTab.url || ""
    };
  }

  const createdTab = await chrome.tabs.create({ url: targetUrl });
  return {
    action: "created",
    tabId: createdTab?.id || null,
    windowId: createdTab?.windowId || null,
    url: createdTab?.url || targetUrl
  };
}

export async function openExtensionPageInExistingTab(url) {
  const targetUrl = normalizeExtensionPageUrl(url);
  if (!targetUrl) {
    throw new Error("No valid extension page URL is available.");
  }

  const tabs = await chrome.tabs.query({});
  const existingTab = tabs.find((tab) => (
    Number.isInteger(tab?.id) && normalizeExtensionPageUrl(tab.url) === targetUrl
  ));
  if (existingTab) {
    await focusTab(existingTab);
    return {
      action: "focused",
      tabId: existingTab.id,
      windowId: existingTab.windowId,
      url: existingTab.url || targetUrl
    };
  }

  const createdTab = await chrome.tabs.create({ url: targetUrl });
  return {
    action: "created",
    tabId: createdTab?.id || null,
    windowId: createdTab?.windowId || null,
    url: createdTab?.url || targetUrl
  };
}

async function findExistingPaperTab(targetUrl) {
  const targetNormalizedUrl = normalizeDocumentUrl(targetUrl);
  const targetDocumentKey = getDocumentMemoryKey(targetUrl);
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!isUsableBrowserTab(tab)) {
      continue;
    }

    if (normalizeDocumentUrl(tab.url) === targetNormalizedUrl) {
      return tab;
    }
  }

  if (!targetDocumentKey) {
    return null;
  }

  return tabs.find((tab) => (
    isUsableBrowserTab(tab) &&
    getDocumentMemoryKey(tab.url) === targetDocumentKey
  )) || null;
}

async function focusTab(tab) {
  if (Number.isInteger(tab.windowId)) {
    await chrome.windows.update(tab.windowId, { focused: true });
  }

  await chrome.tabs.update(tab.id, { active: true });
}

function isUsableBrowserTab(tab) {
  return Number.isInteger(tab?.id) && Boolean(normalizeOpenableUrl(tab.url));
}

export function normalizeOpenableUrl(url) {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);
    // Saved local PDFs open in this device's viewer page; a URL synced from
    // another device may carry that device's extension ID.
    const localPdfHash = getLocalPdfHashFromUrl(parsed.href);
    if (localPdfHash) return getLocalPdfViewerUrl(localPdfHash);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
}

function normalizeExtensionPageUrl(url) {
  const value = String(url || "").trim();
  if (!value || !globalThis.chrome?.runtime?.getURL) {
    return "";
  }

  try {
    const parsed = new URL(value);
    const extensionBase = new URL(chrome.runtime.getURL("/"));
    if (parsed.protocol !== extensionBase.protocol || parsed.host !== extensionBase.host) {
      return "";
    }
    parsed.hash = "";
    return parsed.href;
  } catch {
    return "";
  }
}
