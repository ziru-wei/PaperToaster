import { openPaperDatabase, requestToPromise, transactionDone, SYNC_META_STORE } from "../storage/paper-database.js";
import {
  STORE_KEYS, SYNC_SETTINGS_KEYS, AI_FIELDS, SETTINGS_KEYS,
  entryId, pickSettings, recordForSync, stableJson
} from "./sync-model.js";

const STORES = Object.keys(STORE_KEYS);

export async function readSyncSnapshot(accountId) {
  const db = await openPaperDatabase();
  const tx = db.transaction([...STORES, SYNC_META_STORE], "readonly");
  const done = transactionDone(tx);
  const requests = STORES.map((store) => requestToPromise(tx.objectStore(store).getAll()));
  const [records, metadata, settings] = await Promise.all([
    Promise.all(requests),
    requestToPromise(tx.objectStore(SYNC_META_STORE).get(accountId)),
    chrome.storage.local.get(SYNC_SETTINGS_KEYS)
  ]);
  await done;
  const raw = Object.fromEntries(STORES.map((store, index) => [store, records[index]]));
  const current = pickSettings(settings);
  for (const [store, rows] of Object.entries(raw)) {
    for (const row of rows) {
      current[entryId(store, row[STORE_KEYS[store]])] = await serializeRecord(row);
    }
  }
  return { raw, current, settings, previous: metadata?.entries || {} };
}

export async function serializeRecord(record) {
  const copy = recordForSync(record);
  if (copy.blob instanceof Blob) {
    const bytes = new Uint8Array(await copy.blob.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 32768) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    }
    copy.dataBase64 = btoa(binary);
    copy.mimeType = String(copy.mimeType || copy.blob.type || "").toLowerCase();
    delete copy.blob;
  }
  return copy;
}

export function deserializeRecord(store, record) {
  const copy = recordForSync(record);
  if (store === "paperNoteAssets") {
    if (typeof copy.dataBase64 !== "string" || !/^image\/(png|jpeg|gif|webp)$/.test(copy.mimeType)) {
      throw new Error("Invalid synced note image.");
    }
    copy.blob = new Blob([Uint8Array.from(atob(copy.dataBase64), (char) => char.charCodeAt(0))], { type: copy.mimeType });
    delete copy.dataBase64;
  }
  return copy;
}

// Commit only if no browser view changed the database while we read Drive.
// The verification and writes share one IDB transaction, excluding other writers.
export async function applySyncEntries(accountId, snapshot, entries) {
  const values = Object.entries(entries).map(([id, entry]) => {
    const [store, key] = JSON.parse(id);
    return { id, store, key, entry, value: !entry.deleted && Object.hasOwn(STORE_KEYS, store)
      ? deserializeRecord(store, entry.value) : null };
  });
  const db = await openPaperDatabase();
  const tx = db.transaction([...STORES, SYNC_META_STORE], "readwrite");
  const done = transactionDone(tx);
  const actual = await Promise.all(STORES.map((store) => requestToPromise(tx.objectStore(store).getAll())));
  if (STORES.some((store, index) => stableJson(actual[index]) !== stableJson(snapshot.raw[store]))) {
    tx.abort();
    await done.catch(() => {});
    return false;
  }
  let recordsChanged = false;
  for (const { id, store, key, entry, value } of values) {
    if (!Object.hasOwn(STORE_KEYS, store)) continue;
    if (entry.deleted ? !Object.hasOwn(snapshot.current, id) : stableJson(entry.value) === stableJson(snapshot.current[id])) continue;
    recordsChanged = true;
    if (entry.deleted) {
      tx.objectStore(store).delete(key);
    } else {
      tx.objectStore(store).put(value);
    }
  }
  // Keep the old settings baseline until chrome.storage has accepted the update.
  const committed = Object.fromEntries(values.filter(({ store }) => Object.hasOwn(STORE_KEYS, store)).map(({ id, entry }) => [id, entry]));
  for (const [id, entry] of Object.entries(snapshot.previous)) {
    if (!Object.hasOwn(STORE_KEYS, JSON.parse(id)[0])) committed[id] = entry;
  }
  tx.objectStore(SYNC_META_STORE).put({ accountId, entries: committed });
  await done;

  const latestSettings = await chrome.storage.local.get(SYNC_SETTINGS_KEYS);
  const latest = pickSettings(latestSettings);
  const patch = {};
  const remove = [];
  let aiPatch = null;
  for (const { id, store, key, entry } of values) {
    if (store !== "settings" && store !== "aiSettings") continue;
    // Preserve edits made by Options while the network request was in flight.
    if (stableJson(latest[id]) !== stableJson(snapshot.current[id])) continue;
    committed[id] = entry;
    if (entry.deleted ? !Object.hasOwn(latest, id) : stableJson(latest[id]) === stableJson(entry.value)) continue;
    if (store === "settings" && SETTINGS_KEYS.includes(key)) {
      if (entry.deleted) remove.push(key);
      else patch[key] = entry.value;
    } else if (store === "aiSettings" && AI_FIELDS.includes(key)) {
      aiPatch ||= { ...latestSettings.aiSettingsV1 };
      if (entry.deleted) delete aiPatch[key];
      else aiPatch[key] = entry.value;
    }
  }
  if (aiPatch) patch.aiSettingsV1 = aiPatch;
  if (Object.keys(patch).length) await chrome.storage.local.set(patch);
  if (remove.length) await chrome.storage.local.remove(remove);
  const metaTx = db.transaction(SYNC_META_STORE, "readwrite");
  const metaDone = transactionDone(metaTx);
  metaTx.objectStore(SYNC_META_STORE).put({ accountId, entries: committed });
  await metaDone;
  return { entries: committed, recordsChanged, settingsChanged: Boolean(Object.keys(patch).length || remove.length) };
}
