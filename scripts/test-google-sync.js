import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import {
  captureChanges, entryId, mergeEntries, pickSettings, pruneDeletedParents,
  SYNC_SCHEMA, SYNC_VERSION, validateReplica
} from "../src/sync/sync-model.js";
import { readSyncSnapshot, applySyncEntries, serializeRecord, deserializeRecord } from "../src/sync/sync-store.js";
import { openPaperDatabase, transactionDone, requestToPromise, SYNC_META_STORE } from "../src/storage/paper-database.js";
import { GoogleDriveClient, getGoogleToken } from "../src/sync/google-drive-client.js";

const local = {};
const alarms = new Map();
globalThis.chrome = {
  runtime: { getManifest: () => ({ oauth2: { client_id: "test" } }), sendMessage: async () => {} },
  storage: { local: {
    get: async (keys) => Object.fromEntries((Array.isArray(keys) ? keys : [keys]).filter((key) => Object.hasOwn(local, key)).map((key) => [key, structuredClone(local[key])])),
    set: async (patch) => { Object.assign(local, structuredClone(patch)); },
    remove: async (keys) => { for (const key of keys) delete local[key]; }
  } },
  identity: { getAuthToken: async () => ({ token: "fresh-token" }), removeCachedAuthToken: async () => {} },
  alarms: {
    get: async (name) => alarms.get(name),
    create: async (name, options) => { alarms.set(name, { name, ...options }); },
    clear: async (name) => alarms.delete(name)
  }
};
const noteId = entryId("paperNotes", "paper-1");
const entry = (value, clock, deviceId = "device-a") => ({ value, clock, deviceId, deleted: false });
const replica = (entries) => ({ schema: SYNC_SCHEMA, version: SYNC_VERSION, deviceId: "device-a", entries });

async function put(store, value) {
  const db = await openPaperDatabase();
  const tx = db.transaction(store, "readwrite");
  const done = transactionDone(tx);
  tx.objectStore(store).put(value);
  await done;
}

async function get(store, key) {
  const db = await openPaperDatabase();
  return requestToPromise(db.transaction(store, "readonly").objectStore(store).get(key));
}

test("replicas converge regardless of device upload order, with stable tie breaking", () => {
  const a = { [noteId]: entry({ documentKey: "paper-1", text: "a" }, 5) };
  const b = { [noteId]: entry({ documentKey: "paper-1", text: "b" }, 5, "device-b") };
  assert.deepEqual(mergeEntries(a, b), mergeEntries(b, a));
  assert.equal(mergeEntries(a, b)[noteId].value.text, "b");
  assert.deepEqual(captureChanges(a, { [noteId]: a[noteId].value }, "device-a", 99), a);
});

test("new installations do not delete cloud data and stale replicas cannot resurrect deletions", () => {
  const prior = { [noteId]: entry({ documentKey: "paper-1", text: "old" }, 10) };
  const deletion = captureChanges(prior, {}, "device-b", 20);
  assert.equal(deletion[noteId].deleted, true);
  assert.equal(mergeEntries(prior, deletion)[noteId].deleted, true);
  assert.deepEqual(captureChanges({}, {}, "new-device"), {});
  assert.deepEqual(captureChanges(deletion, {}, "device-b", 100), deletion);
});

test("offline edits advance beyond the device's last observed clock", () => {
  const prior = { [noteId]: entry({ documentKey: "paper-1", text: "old" }, 500) };
  const updated = captureChanges(prior, { [noteId]: { documentKey: "paper-1", text: "new" } }, "device-b", 20);
  assert.equal(updated[noteId].clock, 501);
});

test("paper and thread deletions prune stale child messages and notes", () => {
  const values = {
    [entryId("papers", "paper-1")]: { deleted: true, clock: 10, deviceId: "device-a" },
    [entryId("conversationThreads", "thread-1")]: entry({ threadId: "thread-1", documentKey: "paper-1" }, 5),
    [entryId("conversationMessages", "message-1")]: entry({ messageId: "message-1", threadId: "thread-1" }, 50),
    [noteId]: entry({ documentKey: "paper-1", text: "offline note" }, 50)
  };
  const merged = pruneDeletedParents(pruneDeletedParents(values));
  assert.ok(Object.values(merged).every((value) => value.deleted));
  assert.equal(merged[noteId].clock, 50);
});

test("sync whitelist excludes local endpoints, tokens and transient contexts", () => {
  const selected = pickSettings({
    aiSettingsV1: { localEndpoint: "http://localhost", localAuthToken: "secret", systemPrompt: "Read papers", debugMode: true },
    parsingSettingsV1: { autoParse: false },
    dashboardPaperSort: "title", libraryPaperContext: { documentKey: "paper-1" },
    googleSyncStateV1: { account: "private" }
  });
  assert.equal(selected[entryId("aiSettings", "systemPrompt")], "Read papers");
  assert.equal(selected[entryId("settings", "dashboardPaperSort")], "title");
  assert.equal(Object.keys(selected).length, 4);
  assert.ok(!JSON.stringify(selected).includes("secret"));
});

test("reject unknown schema, foreign settings and mismatched database keys", () => {
  assert.throws(() => validateReplica({ ...replica({}), version: 99 }));
  assert.throws(() => validateReplica(replica({ [entryId("settings", "localAuthToken")]: entry("secret", 1) })));
  assert.throws(() => validateReplica(replica({ [noteId]: entry({ documentKey: "other" }, 1) })));
  assert.deepEqual(validateReplica(replica({ [noteId]: entry({ documentKey: "paper-1" }, 1) })).entries[noteId].clock, 1);
});

test("note image bytes round trip, and content hashes remain available for Agent upload", async () => {
  const image = { assetId: "asset-1", documentKey: "paper-1", blob: new Blob([new Uint8Array([0, 255, 42])], { type: "image/png" }) };
  const serialized = await serializeRecord(image);
  assert.equal(serialized.dataBase64, "AP8q");
  const restored = deserializeRecord("paperNoteAssets", serialized);
  assert.deepEqual(new Uint8Array(await restored.blob.arrayBuffer()), new Uint8Array([0, 255, 42]));
  assert.equal((await serializeRecord({ agentDocumentRef: "sha256-content", markdown: "# paper" })).agentDocumentRef, "sha256-content");
});

test("database merge applies remote changes and durable tombstones, preserving local credentials", async () => {
  local.aiSettingsV1 = { localEndpoint: "http://127.0.0.1:111/ask", localAuthToken: "private", systemPrompt: "old" };
  await put("papers", { documentKey: "paper-1", title: "Original" });
  await put("paperNotes", { documentKey: "paper-1", text: "old" });
  const snapshot = await readSyncSnapshot("account-a");
  const entries = captureChanges({}, snapshot.current, "device-a", 10);
  entries[noteId] = entry({ documentKey: "paper-1", text: "remote" }, 20, "device-b");
  entries[entryId("aiSettings", "systemPrompt")] = entry("new", 20, "device-b");
  const result = await applySyncEntries("account-a", snapshot, entries);
  assert.equal(result.recordsChanged, true);
  assert.equal((await get("paperNotes", "paper-1")).text, "remote");
  assert.equal(local.aiSettingsV1.systemPrompt, "new");
  assert.equal(local.aiSettingsV1.localAuthToken, "private");
  assert.equal(local.aiSettingsV1.localEndpoint, "http://127.0.0.1:111/ask");
  const next = await readSyncSnapshot("account-a");
  assert.deepEqual(captureChanges(next.previous, next.current, "device-a", 30), entries);
  const deleted = { ...entries, [noteId]: { deleted: true, clock: 40, deviceId: "device-b" } };
  await applySyncEntries("account-a", next, deleted);
  assert.equal(await get("paperNotes", "paper-1"), undefined);
  assert.equal((await get(SYNC_META_STORE, "account-a")).entries[noteId].deleted, true);
  assert.deepEqual((await readSyncSnapshot("different-account")).previous, {});
});

test("an edit during a Drive download aborts the database commit for retry", async () => {
  const snapshot = await readSyncSnapshot("account-a");
  await put("papers", { documentKey: "paper-1", title: "Changed while downloading" });
  const result = await applySyncEntries("account-a", snapshot, snapshot.previous);
  assert.equal(result, false);
  assert.equal((await get("papers", "paper-1")).title, "Changed while downloading");
});

test("preferences edited during sync retain their local value and prior baseline", async () => {
  local.parsingSettingsV1 = { autoParse: true };
  const snapshot = await readSyncSnapshot("account-a");
  local.parsingSettingsV1 = { autoParse: false };
  const id = entryId("settings", "parsingSettingsV1");
  const merged = { ...snapshot.previous, [id]: entry({ autoParse: true }, 100, "device-b") };
  const result = await applySyncEntries("account-a", snapshot, merged);
  assert.equal(local.parsingSettingsV1.autoParse, false);
  assert.equal(result.entries[id], undefined);
});

test("Drive pagination and a single noninteractive token retry on HTTP 401", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response("{}", { status: 401 });
    if (calls.length === 2) return Response.json({ files: [{ id: "a" }], nextPageToken: "next" });
    return Response.json({ files: [{ id: "b" }] });
  });
  const files = await new GoogleDriveClient("expired-token").listReplicas();
  assert.deepEqual(files.map((file) => file.id), ["a", "b"]);
  assert.equal(calls[1].options.headers.Authorization, "Bearer fresh-token");
  assert.ok(calls[2].url.includes("pageToken=next"));
});

test("Drive creates separate device replicas in appDataFolder and updates only its own file", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: "own-file" });
  });
  const client = new GoogleDriveClient("token");
  await client.writeReplica(null, "device-a", {});
  await client.writeReplica("own-file", "device-a", {});
  assert.equal(calls[0].options.method, "POST");
  assert.ok(calls[0].options.body.includes('"parents":["appDataFolder"]'));
  assert.ok(calls[0].options.body.includes("papertoaster-sync-v1-device-a.json"));
  assert.equal(calls[1].options.method, "PATCH");
  assert.ok(calls[1].url.includes("/own-file?uploadType=media"));
});

test("unconfigured OAuth returns an actionable error before prompting Google", async (t) => {
  t.mock.method(chrome.runtime, "getManifest", () => ({}));
  await assert.rejects(getGoogleToken(true), /OAuth Client ID/);
});

test("failed upload retains the merge and a later sync publishes durable local deletions", async (t) => {
  const { syncGoogleNow, getGoogleSyncStatus } = await import("../src/sync/google-sync.js");
  const db = await openPaperDatabase();
  const stores = [...db.objectStoreNames];
  const tx = db.transaction(stores, "readwrite");
  const done = transactionDone(tx);
  for (const store of stores) tx.objectStore(store).clear();
  await done;
  for (const key of Object.keys(local)) delete local[key];
  local.googleSyncDeviceIdV1 = "device-local";
  local.googleSyncStateV1 = { enabled: true, account: { id: "account-c", email: "reader@example.com" } };
  await put("papers", { documentKey: "local-paper", title: "Local paper" });
  const remoteId = entryId("papers", "cloud-paper");
  const remoteReplica = { ...replica({ [remoteId]: entry({ documentKey: "cloud-paper", title: "Cloud paper" }, 10, "device-remote") }), deviceId: "device-remote" };
  let failUpload = true;
  let uploaded = null;
  const interactive = [];
  t.mock.method(chrome.identity, "getAuthToken", async (options) => {
    interactive.push(options.interactive);
    return { token: "token" };
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.includes("/userinfo")) return Response.json({ sub: "account-c", email: "reader@example.com" });
    if (url.includes("upload/drive")) {
      uploaded = options.body;
      if (failUpload) return Response.json({ error: { message: "Unavailable" } }, { status: 503 });
      return Response.json({ id: "local-replica" });
    }
    if (url.includes("alt=media")) return Response.json(remoteReplica);
    return Response.json({ files: [{ id: "remote-file", name: "papertoaster-sync-v1-device-remote.json" }] });
  });
  await assert.rejects(syncGoogleNow(), /503/);
  assert.equal((await get("papers", "cloud-paper")).title, "Cloud paper");
  assert.ok((await get(SYNC_META_STORE, "account-c")).entries[remoteId]);
  assert.equal((await getGoogleSyncStatus()).phase, "error");
  const deleteTx = db.transaction("papers", "readwrite");
  const deleted = transactionDone(deleteTx);
  deleteTx.objectStore("papers").delete("cloud-paper");
  await deleted;
  failUpload = false;
  await syncGoogleNow();
  assert.equal(await get("papers", "cloud-paper"), undefined);
  assert.ok(uploaded.includes('"deleted":true'));
  assert.ok(uploaded.includes("Local paper"));
  const status = await getGoogleSyncStatus();
  assert.equal(status.phase, "idle");
  assert.equal(status.running, false);
  assert.ok(status.lastSyncedAt);
  assert.ok(interactive.every((flag) => flag === false));
});

test("a changed Google account cannot read or publish another account's replicas", async (t) => {
  const { syncGoogleNow } = await import("../src/sync/google-sync.js");
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return Response.json({ sub: "account-other", email: "different@example.com" });
  });
  await assert.rejects(syncGoogleNow(), /account changed/);
  assert.equal(requests, 1);
});

test("full backup restores archived records, images and local settings without carrying Google identity", async () => {
  const { exportLocalBackup, restoreLocalBackup } = await import("../src/storage/local-backup-store.js");
  const db = await openPaperDatabase();
  const clearDatabase = async () => {
    const tx = db.transaction([...db.objectStoreNames], "readwrite");
    const done = transactionDone(tx);
    for (const store of db.objectStoreNames) tx.objectStore(store).clear();
    await done;
  };
  await clearDatabase();
  for (const key of Object.keys(local)) delete local[key];
  const paper = { documentKey: "backup-paper", title: "Archived", archivedAt: 123, group: "Research", groupTone: 3, labelState: "live", isStarred: true };
  await put("papers", paper);
  await put("paperNoteAssets", { assetId: "backup-image", documentKey: "backup-paper", blob: new Blob([new Uint8Array([42, 255])], { type: "image/png" }) });
  local.aiSettingsV1 = { localEndpoint: "http://127.0.0.1:222/ask", localAuthToken: "backup-local-token", systemPrompt: "My prompt" };
  local.googleSyncStateV1 = { enabled: true, account: { id: "old-account" } };
  local.googleSyncDeviceIdV1 = "old-device";
  const backup = JSON.parse(JSON.stringify(await exportLocalBackup()));
  assert.equal(backup.settings.aiSettingsV1.localAuthToken, "backup-local-token");
  assert.ok(!Object.hasOwn(backup.settings, "googleSyncStateV1"));
  assert.ok(!Object.hasOwn(backup.settings, "googleSyncDeviceIdV1"));
  await clearDatabase();
  for (const key of Object.keys(local)) delete local[key];
  const result = await restoreLocalBackup(backup);
  assert.equal(result.imported, 2);
  assert.deepEqual(await get("papers", "backup-paper"), paper);
  const image = await get("paperNoteAssets", "backup-image");
  assert.deepEqual(new Uint8Array(await image.blob.arrayBuffer()), new Uint8Array([42, 255]));
  assert.equal(local.aiSettingsV1.localAuthToken, "backup-local-token");
  assert.ok(!Object.hasOwn(local, "googleSyncStateV1"));
  assert.ok(!Object.hasOwn(local, "googleSyncDeviceIdV1"));
  await put("papers", { ...paper, title: "New local title" });
  local.aiSettingsV1.systemPrompt = "New local prompt";
  const repeated = await restoreLocalBackup(backup);
  assert.equal(repeated.imported, 0);
  assert.equal(repeated.skipped, 2);
  assert.equal((await get("papers", "backup-paper")).title, "New local title");
  assert.equal(local.aiSettingsV1.systemPrompt, "New local prompt");
  const bad = structuredClone(backup);
  bad.settings.googleSyncStateV1 = { enabled: true };
  await assert.rejects(restoreLocalBackup(bad), /unsupported settings/);
  assert.equal((await get("papers", "backup-paper")).title, "New local title");
});

test("local changes sync automatically without consent prompts and foreground resume repairs the periodic alarm", async (t) => {
  const { scheduleGoogleSync, syncGoogleNow, resumeGoogleSync } = await import("../src/sync/google-sync.js");
  const timers = [];
  const interactive = [];
  t.mock.method(globalThis, "setTimeout", (callback, delay) => { timers.push({ callback, delay }); return timers.length; });
  t.mock.method(globalThis, "clearTimeout", () => {});
  t.mock.method(chrome.identity, "getAuthToken", async (options) => {
    interactive.push(options.interactive);
    return { token: "token" };
  });
  t.mock.method(GoogleDriveClient.prototype, "getAccount", async () => ({ id: "auto-account" }));
  t.mock.method(GoogleDriveClient.prototype, "listReplicas", async () => []);
  t.mock.method(GoogleDriveClient.prototype, "writeReplica", async () => {});
  alarms.clear();
  local.googleSyncStateV1 = { enabled: false };
  await scheduleGoogleSync();
  await resumeGoogleSync();
  assert.equal(timers.length, 0);
  assert.equal(interactive.length, 0);
  local.googleSyncStateV1 = { enabled: true, account: { id: "auto-account" } };
  await scheduleGoogleSync();
  const deadline = alarms.get("paperToasterGoogleSyncDirty").when;
  await scheduleGoogleSync();
  assert.equal(alarms.get("paperToasterGoogleSyncDirty").when, deadline);
  assert.equal(local.googleSyncStateV1.phase, "pending");
  assert.equal(timers.at(-1).delay, 3000);
  timers.at(-1).callback();
  await syncGoogleNow(); // Join the automatic operation started by the timer.
  assert.equal(local.googleSyncStateV1.pendingRevision, "");
  assert.ok(local.googleSyncStateV1.lastSyncedAt);
  alarms.set("paperToasterGoogleSync", { periodInMinutes: 5 });
  await resumeGoogleSync();
  assert.equal(alarms.get("paperToasterGoogleSync").periodInMinutes, 1);
  assert.equal(interactive.length, 1); // A recent successful sync need not repeat on every focus.
  local.googleSyncStateV1.lastSyncedAt = 0;
  await resumeGoogleSync();
  assert.equal(interactive.length, 2);
  assert.ok(interactive.every((flag) => flag === false));
});

test("an edit during upload remains pending and is included in the next automatic sync", async (t) => {
  const { scheduleGoogleSync, syncGoogleNow, getGoogleSyncStatus } = await import("../src/sync/google-sync.js");
  let timer;
  let uploadCount = 0;
  let uploaded;
  t.mock.method(globalThis, "setTimeout", (callback) => { timer = callback; return 1; });
  t.mock.method(globalThis, "clearTimeout", () => {});
  t.mock.method(GoogleDriveClient.prototype, "getAccount", async () => ({ id: "auto-account" }));
  t.mock.method(GoogleDriveClient.prototype, "listReplicas", async () => []);
  t.mock.method(GoogleDriveClient.prototype, "writeReplica", async (_id, _device, entries) => {
    uploaded = entries;
    if (++uploadCount === 1) {
      await put("paperNotes", { documentKey: "backup-paper", text: "Edited during upload" });
      await scheduleGoogleSync();
    }
  });
  local.googleSyncStateV1 = { enabled: true, account: { id: "auto-account" } };
  await scheduleGoogleSync();
  timer();
  await syncGoogleNow();
  const pending = await getGoogleSyncStatus();
  assert.equal(pending.phase, "pending");
  assert.ok(pending.pendingRevision);
  assert.equal(uploaded[entryId("paperNotes", "backup-paper")], undefined);
  timer();
  await syncGoogleNow();
  assert.equal(uploadCount, 2);
  assert.equal(uploaded[entryId("paperNotes", "backup-paper")].value.text, "Edited during upload");
  assert.equal((await getGoogleSyncStatus()).pendingRevision, "");
});
