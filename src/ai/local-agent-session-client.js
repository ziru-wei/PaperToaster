import { getAiSettings } from "../storage/ai-settings-store.js";

const PENDING_PREFIX = "pendingLocalAgentSessionDeletionV1:";

export async function deleteLocalAgentSession({ mode, conversationKey }) {
  const result = await deleteLocalAgentSessions([{ mode, conversationKey }]);
  if (result.failures.length) {
    throw new Error(`Local Agent session deletion queued for retry: ${result.failures[0]}`);
  }
}

export async function deleteLocalAgentSessions(targets) {
  const entries = (targets || []).map(({ mode, conversationKey }) => createDeletionEntry(mode, conversationKey));
  if (!entries.length) return { deleted: 0, failures: [] };
  const queued = Object.fromEntries(entries.map((entry) => [storageKey(entry), entry]));
  await chrome.storage.local.set(queued);
  let reason = "bridge unavailable";
  try {
    const result = await flushPendingLocalAgentSessionDeletes();
    reason = result.failures[0] || reason;
  } catch (error) {
    reason = error.message || String(error);
  }
  const remaining = await chrome.storage.local.get(Object.keys(queued));
  const failures = Object.keys(remaining).map((key) => `${remaining[key].conversationKey}: ${reason}`);
  return { deleted: Object.keys(queued).length - failures.length, failures };
}

export async function queueLocalAgentSessionDeletion({ mode, conversationKey }) {
  const entry = createDeletionEntry(mode, conversationKey);
  const key = storageKey(entry);
  await chrome.storage.local.set({ [key]: entry });
  return key;
}

export async function hasPendingLocalAgentSessionDeletion({ mode, conversationKey }) {
  const key = storageKey(createDeletionEntry(mode, conversationKey));
  return Boolean((await chrome.storage.local.get(key))[key]);
}

export async function flushPendingLocalAgentSessionDeletes() {
  const entries = Object.entries(await chrome.storage.local.get(null))
    .filter(([key]) => key.startsWith(PENDING_PREFIX));
  if (!entries.length) return { deleted: 0, failures: [] };
  const settings = await getAiSettings();
  const endpoint = getSessionEndpoint(settings.localEndpoint);
  const failures = [];
  let deleted = 0;
  for (const [key, entry] of entries) {
    try {
      if (!entry || key !== storageKey(entry)) throw new Error("Invalid queued session deletion.");
      createDeletionEntry(entry.mode, entry.conversationKey);
      if (!Number.isSafeInteger(entry.requestedAt) || entry.requestedAt <= 0) {
        throw new Error("Invalid queued session deletion timestamp.");
      }
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.localAuthToken}`
        },
        body: JSON.stringify({ version: 1, ...entry })
      });
      if (response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(`HTTP ${response.status} ${data?.error || response.statusText}`.trim());
      }
      await chrome.storage.local.remove(key);
      deleted += 1;
    } catch (error) {
      failures.push(error.message || String(error));
    }
  }
  return { deleted, failures };
}

function createDeletionEntry(mode, conversationKey) {
  const prefix = mode === "single-paper" ? "thread" : mode === "comparative-reading" ? "comparison" : "";
  if (!prefix || typeof conversationKey !== "string"
    || !new RegExp(`^${prefix}-[a-z0-9]+-[a-z0-9]{1,16}$`).test(conversationKey)) {
    throw new Error("Invalid Local Agent conversation identity.");
  }
  return { mode, conversationKey, requestedAt: Date.now() };
}

function storageKey(entry) {
  return `${PENDING_PREFIX}${entry.mode}:${entry.conversationKey}`;
}

function getSessionEndpoint(askEndpoint) {
  const url = new URL(String(askEndpoint || "").trim());
  if (!/\/ask\/?$/.test(url.pathname)) throw new Error("Local Agent endpoint must end with /ask.");
  url.pathname = url.pathname.replace(/\/ask\/?$/, "/sessions");
  url.search = "";
  url.hash = "";
  return url.href;
}
