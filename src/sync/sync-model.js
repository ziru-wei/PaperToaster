// Each device owns a Drive replica. Revisions and deletion markers converge
// without two devices overwriting the same cloud file.
export const SYNC_SCHEMA = "papertoaster.google-sync";
export const SYNC_VERSION = 1;
export const STORE_KEYS = Object.freeze({
  papers: "documentKey",
  documents: "key",
  conversationThreads: "threadId",
  conversationMessages: "messageId",
  documentAliases: "aliasKey",
  comparisonSessions: "comparisonId",
  comparisonMessages: "messageId",
  paperNotes: "documentKey",
  paperNoteAssets: "assetId"
});
export const SETTINGS_KEYS = [
  "selectionPromptPresetsV1", "comparativePromptPresetsV1",
  "comparisonSettingsV1", "parsingSettingsV1", "savedQaSettingsV1",
  "dashboardPaperSort", "dashboardPaperGroupMode",
  "dashboardPaperMessageRingsVisible", "dashboardPaperLabelGroupOrder",
  "dashboardPaperSortDirection", "dashboardPaperView", "dashboardPaperViewProperties",
  "dashboardPaperViewSettings", "paperLabelColumnsV1",
  // Legacy keys stay accepted so replicas written by earlier builds still validate.
  "dashboardPaperListColumns"
];
export const AI_FIELDS = [
  "model", "reasoningEffort", "enabledChatModels", "debugMode", "systemPrompt"
];
export const SYNC_SETTINGS_KEYS = [...SETTINGS_KEYS, "aiSettingsV1"];

export function stableJson(value) {
  return JSON.stringify(value, (_, item) => {
    if (item instanceof Blob) return { blobSize: item.size, blobType: item.type };
    if (!item || Array.isArray(item) || typeof item !== "object") return item;
    return Object.fromEntries(Object.keys(item).sort().map((key) => [key, item[key]]));
  });
}

export function entryId(store, key) {
  return JSON.stringify([store, key]);
}

export function pickSettings(settings) {
  const values = {};
  for (const key of SETTINGS_KEYS) {
    if (settings[key] !== undefined) values[entryId("settings", key)] = settings[key];
  }
  for (const field of AI_FIELDS) {
    if (settings.aiSettingsV1?.[field] !== undefined) {
      values[entryId("aiSettings", field)] = settings.aiSettingsV1[field];
    }
  }
  return values;
}

export function recordForSync(record) {
  // agentDocumentRef is a content hash, shared across machines. The existing
  // ensureAgentDocument flow uploads Markdown to each machine's local Agent.
  return { ...record };
}

export function captureChanges(previous = {}, current, deviceId, now = Date.now()) {
  const result = { ...previous };
  const maxClock = Object.values(previous).reduce((max, entry) => Math.max(max, entry.clock), 0);
  const clock = Math.max(now, maxClock + 1);
  for (const id of new Set([...Object.keys(previous), ...Object.keys(current)])) {
    const exists = Object.hasOwn(current, id);
    const old = previous[id];
    if (old && (exists ? !old.deleted && stableJson(old.value) === stableJson(current[id]) : old.deleted)) continue;
    result[id] = { clock, deviceId, deleted: !exists, ...(exists ? { value: current[id] } : {}) };
  }
  return result;
}

export function mergeEntries(...replicas) {
  const merged = {};
  for (const replica of replicas) {
    for (const [id, entry] of Object.entries(replica)) {
      const previous = merged[id];
      if (!previous || compareRevision(entry, previous) > 0) merged[id] = entry;
    }
  }
  return merged;
}

function compareRevision(a, b) {
  return a.clock - b.clock || (a.deviceId > b.deviceId ? 1 : a.deviceId < b.deviceId ? -1 : 0);
}

export function validateReplica(replica) {
  if (replica?.schema !== SYNC_SCHEMA || replica.version !== SYNC_VERSION ||
      typeof replica.deviceId !== "string" || !replica.entries ||
      typeof replica.entries !== "object" || Array.isArray(replica.entries)) {
    throw new Error("Unsupported Google sync data. Update Paper Toaster before syncing.");
  }
  for (const [id, entry] of Object.entries(replica.entries)) {
    const parsed = JSON.parse(id);
    if (!Array.isArray(parsed) || parsed.length !== 2) throw new Error("Invalid Google sync record ID.");
    const [store, key] = parsed;
    const allowed = Object.hasOwn(STORE_KEYS, store) ||
      (store === "settings" && SETTINGS_KEYS.includes(key)) ||
      (store === "aiSettings" && AI_FIELDS.includes(key));
    if (!allowed || typeof key !== "string" || !key || entryId(store, key) !== id ||
        !Number.isSafeInteger(entry?.clock) || entry.clock < 0 ||
        typeof entry.deviceId !== "string" || typeof entry.deleted !== "boolean" ||
        (!entry.deleted && !Object.hasOwn(entry, "value"))) throw new Error("Invalid Google sync record.");
    if (!entry.deleted && Object.hasOwn(STORE_KEYS, store) &&
        (entry.value?.[STORE_KEYS[store]] !== key || typeof entry.value !== "object")) {
      throw new Error("Invalid Google sync record key.");
    }
  }
  return replica;
}

// Parent deletion also removes stale children uploaded by an offline device.
export function pruneDeletedParents(entries) {
  const result = { ...entries };
  for (const [id, entry] of Object.entries(entries)) {
    if (entry.deleted) continue;
    const [store] = JSON.parse(id);
    const value = entry.value;
    const parents = [];
    if (store !== "papers" && value?.documentKey) parents.push(entryId("papers", value.documentKey));
    if (store === "conversationMessages") parents.push(entryId("conversationThreads", value.threadId));
    if (store === "comparisonMessages") parents.push(entryId("comparisonSessions", value.comparisonId));
    if (store === "comparisonSessions") {
      parents.push(...(value.documentKeys || []).map((key) => entryId("papers", key)));
    }
    const deletion = parents.map((key) => entries[key]).filter((parent) => parent?.deleted)
      .sort((a, b) => compareRevision(b, a))[0];
    if (deletion) result[id] = { ...deletion, clock: Math.max(deletion.clock, entry.clock), deleted: true };
  }
  return result;
}
