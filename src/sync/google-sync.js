import { GoogleDriveClient, getGoogleToken, isGoogleSyncConfigured } from "./google-drive-client.js";
import { captureChanges, mergeEntries, pruneDeletedParents, SYNC_SETTINGS_KEYS, pickSettings, stableJson } from "./sync-model.js";
import { readSyncSnapshot, applySyncEntries } from "./sync-store.js";
import { fetchLocalPdfFromDrive, syncLocalPdfs } from "./pdf-sync.js";

export const GOOGLE_SYNC_STATE_KEY = "googleSyncStateV1";
const DEVICE_KEY = "googleSyncDeviceIdV1";
const PERIODIC_ALARM = "paperToasterGoogleSync";
const DIRTY_ALARM = "paperToasterGoogleSyncDirty";
const AUTO_SYNC_DELAY_MS = 3000;
const SYNC_INTERVAL_MINUTES = 1;
let activeOperation = null;
let autoSyncTimer = null;
let statusUpdates = Promise.resolve();

export async function getGoogleSyncStatus() {
  const data = await chrome.storage.local.get(GOOGLE_SYNC_STATE_KEY);
  const state = data[GOOGLE_SYNC_STATE_KEY] || { enabled: false };
  const running = state.phase === "syncing" && Boolean(activeOperation);
  return {
    ...state,
    phase: state.phase === "syncing" && !running ? "idle" : state.phase,
    configured: isGoogleSyncConfigured(),
    running
  };
}

async function updateStatus(patch) {
  statusUpdates = statusUpdates.catch(() => {}).then(async () => {
    const current = await getGoogleSyncStatus();
    const { configured, running, ...state } = current;
    const changes = typeof patch === "function" ? patch(state) : patch;
    await chrome.storage.local.set({ [GOOGLE_SYNC_STATE_KEY]: { ...state, ...changes } });
  });
  return statusUpdates;
}

function exclusive(operation) {
  if (activeOperation) return activeOperation;
  activeOperation = operation().finally(() => { activeOperation = null; });
  return activeOperation;
}

export function connectGoogleSync() {
  return exclusive(async () => {
    try {
      const client = new GoogleDriveClient(await getGoogleToken(true));
      const account = await client.getAccount();
      await updateStatus({ enabled: true, account, phase: "syncing", error: "", pendingRevision: "", lastSyncedAt: null });
      await chrome.alarms.create(PERIODIC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES });
      return await syncWithClient(client, account);
    } catch (error) {
      await updateStatus({ phase: "error", error: error.message || String(error) });
      throw error;
    }
  });
}

export async function disconnectGoogleSync() {
  // Disable immediately so in-flight work checks the flag before writing to Drive.
  clearTimeout(autoSyncTimer);
  await updateStatus({ enabled: false, phase: "disconnected", pendingRevision: "", error: "" });
  await Promise.all([chrome.alarms.clear(PERIODIC_ALARM), chrome.alarms.clear(DIRTY_ALARM)]);
  await activeOperation?.catch(() => {});
  await chrome.identity.clearAllCachedAuthTokens();
  await updateStatus({ enabled: false, phase: "disconnected", account: null, error: "" });
  return getGoogleSyncStatus();
}

export function syncGoogleNow() {
  return exclusive(async () => {
    const state = await getGoogleSyncStatus();
    if (!state.enabled) return state;
    try {
      await updateStatus({ phase: "syncing", error: "" });
      const client = new GoogleDriveClient(await getGoogleToken(false));
      const account = await client.getAccount();
      if (account.id !== state.account?.id) {
        throw new Error("The Google account changed. Disconnect and sign in again to choose the account for sync.");
      }
      return await syncWithClient(client, account);
    } catch (error) {
      if ((await getGoogleSyncStatus()).enabled) {
        await updateStatus({ phase: "error", error: error.message || String(error) });
      }
      throw error;
    }
  });
}

async function syncWithClient(client, account) {
  const data = await chrome.storage.local.get(DEVICE_KEY);
  const deviceId = data[DEVICE_KEY] || crypto.randomUUID();
  if (!data[DEVICE_KEY]) await chrome.storage.local.set({ [DEVICE_KEY]: deviceId });
  const files = await client.listReplicas();
  // Read every file successfully before publishing; a failed download must not
  // turn unavailable records into deletions. Sequential reads limit Drive load.
  const remote = [];
  for (const file of files) remote.push(await client.readReplica(file.id));
  const own = files.find((file) => file.name === `papertoaster-sync-v1-${deviceId}.json`);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!(await getGoogleSyncStatus()).enabled) return getGoogleSyncStatus();
    const pendingRevision = (await getGoogleSyncStatus()).pendingRevision || "";
    const snapshot = await readSyncSnapshot(account.id);
    const local = captureChanges(snapshot.previous, snapshot.current, deviceId);
    const merged = pruneDeletedParents(pruneDeletedParents(mergeEntries(local, ...remote.map((replica) => replica.entries))));
    const applied = await applySyncEntries(account.id, snapshot, merged);
    if (!applied) continue;
    if (applied.recordsChanged || applied.settingsChanged) {
      chrome.runtime.sendMessage({ type: "GOOGLE_SYNC_APPLIED" }).catch(() => {});
    }
    if (!(await getGoogleSyncStatus()).enabled) return getGoogleSyncStatus();
    const ownReplica = remote.find((replica) => replica.deviceId === deviceId);
    if (!own || stableJson(ownReplica?.entries) !== stableJson(applied.entries)) {
      await client.writeReplica(own?.id, deviceId, applied.entries);
    }
    const pdfs = await syncLocalPdfs(client, applied.entries);
    if (pdfs.downloaded) {
      chrome.runtime.sendMessage({ type: "GOOGLE_SYNC_APPLIED" }).catch(() => {});
    }
    await updateStatus((state) => {
      const stillPending = Boolean(state.pendingRevision && state.pendingRevision !== pendingRevision);
      return {
        phase: state.enabled ? stillPending ? "pending" : "idle" : "disconnected",
        pendingRevision: state.enabled && stillPending ? state.pendingRevision : "",
        error: "",
        lastSyncedAt: Date.now()
      };
    });
    return getGoogleSyncStatus();
  }
  throw new Error("The library is still being edited. Sync will retry automatically.");
}

export async function scheduleGoogleSync() {
  if (!(await getGoogleSyncStatus()).enabled) return;
  await updateStatus((state) => state.enabled ? {
    pendingRevision: crypto.randomUUID(),
    phase: state.phase === "syncing" || state.error ? state.phase : "pending"
  } : {});
  if (!(await getGoogleSyncStatus()).enabled) return;
  // An alarm survives service-worker suspension; keep an existing deadline so
  // continuous typing cannot postpone sync indefinitely.
  if (!(await chrome.alarms.get(DIRTY_ALARM))) {
    await chrome.alarms.create(DIRTY_ALARM, { when: Date.now() + 30000 });
  }
  // Run promptly in an awake worker, retaining the alarm if it is suspended.
  clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    autoSyncTimer = null;
    void syncGoogleNow().catch(() => {});
  }, AUTO_SYNC_DELAY_MS);
}

export async function resumeGoogleSync() {
  await restoreSyncAlarm();
  const state = await getGoogleSyncStatus();
  if (state.enabled && (state.pendingRevision || state.error ||
      !state.lastSyncedAt || Date.now() - state.lastSyncedAt >= SYNC_INTERVAL_MINUTES * 60000)) {
    await syncGoogleNow();
  }
  return getGoogleSyncStatus();
}

export function registerGoogleSync() {
  const backgroundSync = () => syncGoogleNow().catch((error) => {
    console.warn("[Paper Toaster] Google sync:", error.message);
  });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === PERIODIC_ALARM || alarm.name === DIRTY_ALARM) void backgroundSync();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !SYNC_SETTINGS_KEYS.some((key) => Object.hasOwn(changes, key))) return;
    const before = Object.fromEntries(Object.entries(changes).map(([key, value]) => [key, value.oldValue]));
    const after = Object.fromEntries(Object.entries(changes).map(([key, value]) => [key, value.newValue]));
    if (stableJson(pickSettings(before)) !== stableJson(pickSettings(after))) void scheduleGoogleSync();
  });
  chrome.runtime.onStartup.addListener(() => {
    void restoreSyncAlarm().then(backgroundSync);
  });
  chrome.runtime.onInstalled.addListener(() => { void restoreSyncAlarm().then(backgroundSync); });
  void restoreSyncAlarm();
}

async function fetchSyncedPdf(sha256) {
  if (!/^[0-9a-f]{64}$/.test(String(sha256 || ""))) throw new Error("Unknown PDF.");
  const state = await getGoogleSyncStatus();
  if (!state.enabled) return { found: false };
  const client = new GoogleDriveClient(await getGoogleToken(false));
  return { found: await fetchLocalPdfFromDrive(client, sha256) };
}

async function restoreSyncAlarm() {
  if (!(await getGoogleSyncStatus()).enabled) return;
  const alarm = await chrome.alarms.get(PERIODIC_ALARM);
  if (!alarm || alarm.periodInMinutes !== SYNC_INTERVAL_MINUTES) {
    await chrome.alarms.create(PERIODIC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES });
  }
}

export async function handleGoogleSyncMessage(message, sender) {
  if (sender?.id !== chrome.runtime.id ||
      !sender.url?.startsWith(chrome.runtime.getURL(""))) {
    throw new Error("Google sync is only available from Paper Toaster extension pages.");
  }
  switch (message.type) {
    case "GOOGLE_SYNC_STATUS": return getGoogleSyncStatus();
    case "GOOGLE_SYNC_RESUME": return resumeGoogleSync();
    case "GOOGLE_SYNC_CONNECT": return connectGoogleSync();
    case "GOOGLE_SYNC_DISCONNECT": return disconnectGoogleSync();
    case "GOOGLE_SYNC_NOW": return syncGoogleNow();
    case "GOOGLE_SYNC_DIRTY": await scheduleGoogleSync(); return { ok: true };
    case "GOOGLE_SYNC_FETCH_PDF": return fetchSyncedPdf(message.sha256);
    case "GOOGLE_SYNC_APPLIED": return { ok: true };
    default: throw new Error("Unknown Google sync request.");
  }
}
