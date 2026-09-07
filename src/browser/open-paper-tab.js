import { getDocumentMemoryKey, normalizeDocumentUrl } from "../storage/document-key.js";

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
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
}
