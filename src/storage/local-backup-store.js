import { readSyncSnapshot, deserializeRecord } from "../sync/sync-store.js";
import { STORE_KEYS, SYNC_SETTINGS_KEYS, captureChanges, validateReplica, SYNC_SCHEMA, SYNC_VERSION } from "../sync/sync-model.js";
import { openPaperDatabase, requestToPromise, transactionDone } from "./paper-database.js";

const BACKUP_SCHEMA = "papertoaster.local-backup";
const STORES = Object.keys(STORE_KEYS);

export async function exportLocalBackup() {
  const snapshot = await readSyncSnapshot("local-backup");
  const records = Object.fromEntries(Object.entries(snapshot.current)
    .filter(([id]) => Object.hasOwn(STORE_KEYS, JSON.parse(id)[0])));
  return {
    schema: BACKUP_SCHEMA,
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceExtensionId: chrome.runtime.id,
    records,
    // Includes this installation's Agent address/token, but no Google tokens,
    // account state, device identity, or transient tab/session state.
    settings: snapshot.settings
  };
}

export async function restoreLocalBackup(backup) {
  if (backup?.schema !== BACKUP_SCHEMA || backup.version !== 1 ||
      !backup.records || typeof backup.records !== "object" || Array.isArray(backup.records) ||
      !backup.settings || typeof backup.settings !== "object" || Array.isArray(backup.settings)) {
    throw new Error("This file is not a supported full Paper Toaster backup.");
  }
  if (Object.keys(backup.settings).some((key) => !SYNC_SETTINGS_KEYS.includes(key))) {
    throw new Error("This backup contains unsupported settings.");
  }
  const entries = captureChanges({}, backup.records, "local-backup", 1);
  validateReplica({ schema: SYNC_SCHEMA, version: SYNC_VERSION, deviceId: "local-backup", entries });
  const rows = Object.entries(entries).map(([id, entry]) => {
    const [store, key] = JSON.parse(id);
    if (!Object.hasOwn(STORE_KEYS, store)) throw new Error("This backup contains unsupported records.");
    return { store, key, record: deserializeRecord(store, entry.value) };
  });
  const db = await openPaperDatabase();
  const tx = db.transaction(STORES, "readwrite");
  const done = transactionDone(tx);
  const existing = await Promise.all(STORES.map((store) => requestToPromise(tx.objectStore(store).getAllKeys())));
  const keys = Object.fromEntries(STORES.map((store, index) => [store, new Set(existing[index])]));
  let imported = 0;
  for (const { store, key, record } of rows) {
    if (keys[store].has(key)) continue;
    tx.objectStore(store).put(record);
    imported += 1;
  }
  await done;
  const current = await chrome.storage.local.get(SYNC_SETTINGS_KEYS);
  const missingSettings = Object.fromEntries(Object.entries(backup.settings)
    .filter(([key]) => !Object.hasOwn(current, key)));
  if (Object.keys(missingSettings).length) await chrome.storage.local.set(missingSettings);
  chrome.runtime.sendMessage({ type: "GOOGLE_SYNC_APPLIED" }).catch(() => {});
  return { imported, skipped: rows.length - imported };
}
