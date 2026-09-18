import {
  COMPARISON_MESSAGE_STORE,
  COMPARISON_SESSION_STORE,
  CONVERSATION_MESSAGE_STORE,
  CONVERSATION_THREAD_STORE,
  DOCUMENT_ALIAS_STORE,
  DOCUMENT_STORE,
  PAPER_NOTE_ASSET_STORE,
  PAPER_NOTE_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";
import { getAiSettings } from "./ai-settings-store.js";
import { deleteAgentDocument } from "../ai/local-agent-document-client.js";

export const LIBRARY_ARCHIVE_SCHEMA = "pdf-ai-inspector.library-archive";
export const LIBRARY_ARCHIVE_VERSION = 5;
const SUPPORTED_LIBRARY_ARCHIVE_VERSIONS = new Set([3, 4, 5]);

const DOCUMENT_KEY_STORES = [
  PAPER_STORE,
  DOCUMENT_STORE,
  CONVERSATION_THREAD_STORE,
  CONVERSATION_MESSAGE_STORE,
  DOCUMENT_ALIAS_STORE,
  PAPER_NOTE_STORE,
  PAPER_NOTE_ASSET_STORE
];

const DELETE_TRANSACTION_STORES = [
  ...DOCUMENT_KEY_STORES,
  COMPARISON_SESSION_STORE,
  COMPARISON_MESSAGE_STORE
];

const IMPORT_STORES = [
  PAPER_STORE,
  DOCUMENT_STORE,
  CONVERSATION_THREAD_STORE,
  CONVERSATION_MESSAGE_STORE,
  DOCUMENT_ALIAS_STORE,
  PAPER_NOTE_STORE,
  PAPER_NOTE_ASSET_STORE,
  COMPARISON_SESSION_STORE,
  COMPARISON_MESSAGE_STORE
];

export async function exportLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const keys = normalizeDocumentKeys(documentKeys);
  const selectedComparisonIds = normalizeRecordIds(comparisonIds);
  if (!keys.length && !selectedComparisonIds.length) {
    throw new Error("No records selected for export.");
  }

  const db = await openPaperDatabase();
  const records = createEmptyArchiveRecords();
  const exportedComparisonIds = new Set();
  const exportedDocumentKeys = new Set();

  for (const documentKey of keys) {
    await appendPaperRecords(db, records, documentKey, exportedDocumentKeys);
  }

  const comparisonSessions = await getComparisonSessionsForDocumentKeys(db, new Set(keys));
  for (const session of comparisonSessions) {
    appendComparisonSessionRecord(records, session, exportedComparisonIds);
  }

  for (const comparisonId of selectedComparisonIds) {
    const session = await getStoreRecord(db, COMPARISON_SESSION_STORE, comparisonId);
    if (!session) {
      continue;
    }

    appendComparisonSessionRecord(records, session, exportedComparisonIds);
    for (const documentKey of normalizeDocumentKeys(session.documentKeys || [])) {
      await appendPaperRecords(db, records, documentKey, exportedDocumentKeys);
    }
  }
  records.comparisonMessages.push(...await getComparisonMessagesByIds(db, exportedComparisonIds));

  return {
    schema: LIBRARY_ARCHIVE_SCHEMA,
    version: LIBRARY_ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    documentKeys: [...exportedDocumentKeys],
    comparisonIds: [...exportedComparisonIds],
    records
  };
}

export function validateLibraryArchive(archive) {
  normalizeArchiveRecords(archive);
  return true;
}

export async function deleteLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const keys = normalizeDocumentKeys(documentKeys);
  const selectedComparisonIds = normalizeRecordIds(comparisonIds);
  if (!keys.length && !selectedComparisonIds.length) {
    return {
      paperCount: 0,
      comparisonCount: 0,
      managedDocumentCleanupFailures: []
    };
  }

  const db = await openPaperDatabase();
  const selectedDocumentRecords = (await Promise.all(keys.map((documentKey) => requestToPromise(
    db.transaction(DOCUMENT_STORE, "readonly").objectStore(DOCUMENT_STORE).index("byDocumentKey").getAll(documentKey)
  )))).flat();
  const selectedRefs = [...new Set(selectedDocumentRecords
    .map((record) => String(record.agentDocumentRef || ""))
    .filter((ref) => /^sha256-[a-f0-9]{64}$/.test(ref)))];
  const transaction = db.transaction(DELETE_TRANSACTION_STORES, "readwrite");
  const comparisonSessionStore = transaction.objectStore(COMPARISON_SESSION_STORE);
  const comparisonMessageStore = transaction.objectStore(COMPARISON_MESSAGE_STORE);

  for (const comparisonId of selectedComparisonIds) {
    comparisonSessionStore.delete(comparisonId);
    deleteComparisonMessages(comparisonMessageStore, comparisonId);
  }

  for (const documentKey of keys) {
    transaction.objectStore(PAPER_STORE).delete(documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(DOCUMENT_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(CONVERSATION_THREAD_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(CONVERSATION_MESSAGE_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(DOCUMENT_ALIAS_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(PAPER_NOTE_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(PAPER_NOTE_ASSET_STORE), documentKey);
  }
  pruneComparisonRecordsForDeletedPapers(transaction, new Set(keys));

  await transactionDone(transaction);
  let managedDocumentCleanupFailures = [];
  try {
    const retainedRefs = new Set(selectedRefs.length
      ? (await requestToPromise(db.transaction(DOCUMENT_STORE, "readonly").objectStore(DOCUMENT_STORE).getAll()))
        .map((record) => String(record.agentDocumentRef || ""))
      : []);
    const refsToDelete = selectedRefs.filter((ref) => !retainedRefs.has(ref));
    managedDocumentCleanupFailures = await deleteManagedDocumentsBestEffort(refsToDelete);
  } catch (error) {
    const failure = `Could not verify remaining managed document references: ${error.message || String(error)}`;
    console.warn("[Paper Toaster] Managed document cleanup failed:", failure);
    managedDocumentCleanupFailures = [failure];
  }
  return {
    paperCount: keys.length,
    comparisonCount: selectedComparisonIds.length,
    managedDocumentCleanupFailures
  };
}

async function deleteManagedDocumentsBestEffort(documentRefs) {
  if (!documentRefs.length) return [];
  let settings;
  try {
    settings = await getAiSettings();
  } catch (error) {
    const failure = `Could not read Local Agent settings: ${error.message || String(error)}`;
    console.warn("[Paper Toaster] Managed document cleanup failed:", failure);
    return [failure];
  }
  const results = await Promise.allSettled(documentRefs.map((documentRef) => deleteAgentDocument({
    endpoint: settings.localEndpoint,
    authToken: settings.localAuthToken,
    documentRef,
    signal: AbortSignal.timeout(5000)
  })));
  const failures = results.flatMap((result, index) => result.status === "rejected"
    ? [`${documentRefs[index]}: ${result.reason?.message || String(result.reason)}`]
    : []);
  if (failures.length) console.warn("[Paper Toaster] Managed document cleanup failed:", failures);
  return failures;
}

export async function importLibraryArchive(archive, options = {}) {
  const destination = normalizeImportDestination(options.destination);
  const records = normalizeArchiveRecords(archive);
  const db = await openPaperDatabase();
  const archiveDocumentKeys = getArchiveDocumentKeys(archive, records);
  const skippedDocumentKeys = [];

  for (const documentKey of archiveDocumentKeys) {
    if (await hasExistingDocumentData(db, documentKey)) {
      skippedDocumentKeys.push(documentKey);
    }
  }

  const skippedSet = new Set(skippedDocumentKeys);
  const importedDocumentKeys = archiveDocumentKeys.filter((documentKey) => !skippedSet.has(documentKey));
  const importedSet = new Set(importedDocumentKeys);
  const recordsToImport = filterRecordsByDocumentKeys(records, importedSet);
  const materializedImportedDocumentKeys = getRecordDocumentKeys(recordsToImport);
  const availableDocumentKeys = new Set([
    ...skippedDocumentKeys,
    ...materializedImportedDocumentKeys
  ]);
  recordsToImport.comparisonSessions = await filterImportableComparisonSessions(db, records.comparisonSessions, availableDocumentKeys);
  const importedComparisonIds = new Set(recordsToImport.comparisonSessions.map((session) => session.comparisonId).filter(Boolean));
  recordsToImport.comparisonMessages = records.comparisonMessages.filter((message) => importedComparisonIds.has(message.comparisonId));
  recordsToImport.paperNoteAssets = await Promise.all(recordsToImport.paperNoteAssets.map(deserializePaperNoteAsset));
  materializeMissingPaperRecords(recordsToImport, materializedImportedDocumentKeys);
  await applyImportDestination(db, recordsToImport, destination);

  if (!importedDocumentKeys.length && !recordsToImport.comparisonSessions.length) {
    return createImportSummary({
      importedDocumentKeys: materializedImportedDocumentKeys,
      skippedDocumentKeys,
      records: recordsToImport
    });
  }

  const transaction = db.transaction(IMPORT_STORES, "readwrite");

  putRecords(transaction.objectStore(PAPER_STORE), recordsToImport.papers);
  putRecords(transaction.objectStore(DOCUMENT_STORE), recordsToImport.documents);
  putRecords(transaction.objectStore(CONVERSATION_THREAD_STORE), recordsToImport.conversationThreads);
  putRecords(transaction.objectStore(CONVERSATION_MESSAGE_STORE), recordsToImport.conversationMessages);
  putRecords(transaction.objectStore(DOCUMENT_ALIAS_STORE), recordsToImport.documentAliases);
  putRecords(transaction.objectStore(PAPER_NOTE_STORE), recordsToImport.paperNotes);
  putRecords(transaction.objectStore(PAPER_NOTE_ASSET_STORE), recordsToImport.paperNoteAssets);
  putRecords(transaction.objectStore(COMPARISON_SESSION_STORE), recordsToImport.comparisonSessions);
  putRecords(transaction.objectStore(COMPARISON_MESSAGE_STORE), recordsToImport.comparisonMessages);

  await transactionDone(transaction);
  return createImportSummary({
    importedDocumentKeys: materializedImportedDocumentKeys,
    skippedDocumentKeys,
    records: recordsToImport
  });
}

function createEmptyArchiveRecords() {
  return {
    papers: [],
    documents: [],
    conversationThreads: [],
    conversationMessages: [],
    documentAliases: [],
    paperNotes: [],
    paperNoteAssets: [],
    comparisonSessions: [],
    comparisonMessages: []
  };
}

function normalizeArchiveRecords(archive) {
  if (!archive || typeof archive !== "object") {
    throw new Error("Archive file is not valid JSON data.");
  }

  if (archive.schema !== LIBRARY_ARCHIVE_SCHEMA || !SUPPORTED_LIBRARY_ARCHIVE_VERSIONS.has(Number(archive.version))) {
    throw new Error("Archive file uses an unsupported format.");
  }

  const source = archive.records || {};
  const records = createEmptyArchiveRecords();
  for (const key of Object.keys(records)) {
    records[key] = Array.isArray(source[key])
      ? source[key].filter((record) => record && typeof record === "object").map(cloneRecord)
      : [];
  }

  return records;
}

function normalizeImportDestination(destination) {
  if (destination === "board" || destination === "archive") {
    return destination;
  }
  throw new Error("Choose whether to import records to the Dashboard or Archive.");
}

function materializeMissingPaperRecords(records, documentKeys) {
  const existingKeys = new Set(records.papers.map((paper) => paper.documentKey).filter(Boolean));
  for (const documentKey of documentKeys) {
    if (existingKeys.has(documentKey)) {
      continue;
    }
    const document = records.documents.find((record) => record.documentKey === documentKey);
    records.papers.push({
      documentKey,
      canonicalUrl: document?.url || "",
      title: document?.title || "Untitled paper",
      createdAt: document?.createdAt || Date.now(),
      updatedAt: document?.updatedAt || Date.now(),
      activeThreadId: "",
      isStarred: false,
      starredAt: null,
      group: "",
      groupTone: null,
      labelState: "live",
      archivedAt: null
    });
  }
}

async function applyImportDestination(db, records, destination) {
  const now = Date.now();
  const allLocalPapers = await getAllFromStore(db, PAPER_STORE);
  const liveLabels = buildLiveLabelCatalog(allLocalPapers);

  records.papers = records.papers.map((paper) => {
    const group = normalizeLabel(paper.group);
    if (destination === "archive") {
      return {
        ...paper,
        group,
        archivedAt: now,
        isStarred: false,
        starredAt: null,
        updatedAt: now
      };
    }

    const liveLabel = group ? liveLabels.get(group.toLowerCase()) : null;
    const wasArchived = Boolean(normalizeArchivedAt(paper.archivedAt));
    return {
      ...paper,
      group,
      groupTone: liveLabel ? liveLabel.groupTone : null,
      labelState: group && !liveLabel ? "dead" : "live",
      archivedAt: null,
      isStarred: wasArchived ? false : Boolean(paper.isStarred),
      starredAt: wasArchived ? null : Number(paper.starredAt) || null,
      updatedAt: now
    };
  });

  records.comparisonSessions = records.comparisonSessions.map((session) => {
    const wasArchived = Boolean(normalizeArchivedAt(session.archivedAt));
    return {
      ...session,
      archivedAt: destination === "archive" ? now : null,
      isStarred: destination === "archive" || wasArchived ? false : Boolean(session.isStarred),
      starredAt: destination === "archive" || wasArchived ? null : Number(session.starredAt) || null,
      updatedAt: now
    };
  });
}

function buildLiveLabelCatalog(papers) {
  const labels = new Map();
  for (const paper of papers || []) {
    const group = normalizeLabel(paper.group);
    if (!group || normalizeArchivedAt(paper.archivedAt) || paper.labelState === "dead") {
      continue;
    }
    const key = group.toLowerCase();
    if (!labels.has(key)) {
      const tone = Number(paper.groupTone);
      labels.set(key, {
        group,
        groupTone: Number.isInteger(tone) && tone >= 0 && tone < 5 ? tone : null
      });
    }
  }
  return labels;
}

function normalizeLabel(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 64);
}

function normalizeArchivedAt(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function normalizeDocumentKeys(documentKeys) {
  return [...new Set((Array.isArray(documentKeys) ? documentKeys : [documentKeys])
    .map((key) => String(key || "").trim())
    .filter(Boolean))];
}

function normalizeRecordIds(ids) {
  return [...new Set((Array.isArray(ids) ? ids : [ids])
    .map((id) => String(id || "").trim())
    .filter(Boolean))];
}

function getArchiveDocumentKeys(archive, records) {
  return normalizeDocumentKeys([
    ...(Array.isArray(archive.documentKeys) ? archive.documentKeys : []),
    ...records.papers.map((record) => record.documentKey),
    ...records.documents.map((record) => record.documentKey),
    ...records.conversationThreads.map((record) => record.documentKey),
    ...records.conversationMessages.map((record) => record.documentKey),
    ...records.documentAliases.map((record) => record.documentKey),
    ...records.paperNotes.map((record) => record.documentKey),
    ...records.paperNoteAssets.map((record) => record.documentKey),
    ...records.comparisonSessions.flatMap((record) => Array.isArray(record.documentKeys) ? record.documentKeys : [])
  ]);
}

async function hasExistingDocumentData(db, documentKey) {
  const paper = await getStoreRecord(db, PAPER_STORE, documentKey);
  if (paper) {
    return true;
  }

  for (const storeName of DOCUMENT_KEY_STORES.filter((name) => name !== PAPER_STORE)) {
    const records = await getRecordsByDocumentKey(db, storeName, documentKey);
    if (records.length) {
      return true;
    }
  }

  return false;
}

function filterRecordsByDocumentKeys(records, documentKeys) {
  const filtered = createEmptyArchiveRecords();
  filtered.papers = records.papers.filter((record) => documentKeys.has(record.documentKey));
  filtered.documents = records.documents.filter((record) => documentKeys.has(record.documentKey));
  filtered.conversationThreads = records.conversationThreads.filter((record) => documentKeys.has(record.documentKey));
  filtered.conversationMessages = records.conversationMessages.filter((record) => documentKeys.has(record.documentKey));
  filtered.documentAliases = records.documentAliases.filter((record) => documentKeys.has(record.documentKey));
  filtered.paperNotes = records.paperNotes.filter((record) => documentKeys.has(record.documentKey));
  filtered.paperNoteAssets = records.paperNoteAssets.filter((record) => documentKeys.has(record.documentKey));
  filtered.comparisonSessions = records.comparisonSessions.filter((record) => {
    const keys = Array.isArray(record.documentKeys) ? record.documentKeys : [];
    return keys.length >= 2 && keys.every((documentKey) => documentKeys.has(documentKey));
  });
  return filtered;
}

function getRecordDocumentKeys(records) {
  return normalizeDocumentKeys([
    ...records.papers.map((record) => record.documentKey),
    ...records.documents.map((record) => record.documentKey),
    ...records.conversationThreads.map((record) => record.documentKey),
    ...records.conversationMessages.map((record) => record.documentKey),
    ...records.documentAliases.map((record) => record.documentKey),
    ...records.paperNotes.map((record) => record.documentKey),
    ...records.paperNoteAssets.map((record) => record.documentKey)
  ]);
}

async function filterImportableComparisonSessions(db, sessions, availableDocumentKeys) {
  const importable = [];
  for (const session of sessions) {
    const comparisonId = String(session?.comparisonId || "").trim();
    const documentKeys = normalizeDocumentKeys(session?.documentKeys || []);
    if (!comparisonId || documentKeys.length < 2 || documentKeys.some((documentKey) => !availableDocumentKeys.has(documentKey))) {
      continue;
    }

    if (!(await getStoreRecord(db, COMPARISON_SESSION_STORE, comparisonId))) {
      importable.push(cloneRecord(session));
    }
  }

  return importable;
}

function createImportSummary({ importedDocumentKeys, skippedDocumentKeys, records }) {
  return {
    importedPaperCount: importedDocumentKeys.length,
    skippedPaperCount: skippedDocumentKeys.length,
    importedDocumentKeys,
    skippedDocumentKeys,
    paperCount: importedDocumentKeys.length,
    documentCount: records.documents.length,
    threadCount: records.conversationThreads.length,
    messageCount: records.conversationMessages.length,
    comparisonCount: records.comparisonSessions.length,
    comparisonMessageCount: records.comparisonMessages.length
  };
}

function getStoreRecord(db, storeName, key) {
  return requestToPromise(db.transaction(storeName, "readonly").objectStore(storeName).get(key));
}

function getRecordsByDocumentKey(db, storeName, documentKey) {
  return requestToPromise(
    db.transaction(storeName, "readonly")
      .objectStore(storeName)
      .index("byDocumentKey")
      .getAll(documentKey)
  );
}

function getAllFromStore(db, storeName) {
  return requestToPromise(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
}

async function getComparisonSessionsForDocumentKeys(db, documentKeys) {
  const sessions = await getAllFromStore(db, COMPARISON_SESSION_STORE);
  return sessions.filter((session) => {
    const keys = Array.isArray(session.documentKeys) ? session.documentKeys : [];
    return keys.length >= 2 && keys.every((documentKey) => documentKeys.has(documentKey));
  });
}

async function appendPaperRecords(db, records, documentKey, exportedDocumentKeys) {
  if (!documentKey || exportedDocumentKeys.has(documentKey)) {
    return;
  }

  exportedDocumentKeys.add(documentKey);
  const paper = await getStoreRecord(db, PAPER_STORE, documentKey);
  if (paper) {
    records.papers.push(cloneRecord(paper));
  }

  const [documents, threads, messages, aliases, notes, assets] = await Promise.all([
    getRecordsByDocumentKey(db, DOCUMENT_STORE, documentKey),
    getRecordsByDocumentKey(db, CONVERSATION_THREAD_STORE, documentKey),
    getRecordsByDocumentKey(db, CONVERSATION_MESSAGE_STORE, documentKey),
    getRecordsByDocumentKey(db, DOCUMENT_ALIAS_STORE, documentKey),
    getRecordsByDocumentKey(db, PAPER_NOTE_STORE, documentKey),
    getRecordsByDocumentKey(db, PAPER_NOTE_ASSET_STORE, documentKey)
  ]);

  records.documents.push(...documents.map(cloneRecord));
  records.conversationThreads.push(...threads.map(cloneRecord));
  records.conversationMessages.push(...messages.map(cloneRecord));
  records.documentAliases.push(...aliases.map(cloneRecord));
  records.paperNotes.push(...notes.map(cloneRecord));
  records.paperNoteAssets.push(...await Promise.all(assets.map(serializePaperNoteAsset)));
}

function appendComparisonSessionRecord(records, session, exportedComparisonIds) {
  const comparisonId = String(session?.comparisonId || "").trim();
  if (!comparisonId || exportedComparisonIds.has(comparisonId)) {
    return;
  }

  exportedComparisonIds.add(comparisonId);
  records.comparisonSessions.push(cloneRecord(session));
}

async function getComparisonMessagesByIds(db, comparisonIds) {
  const messages = [];
  for (const comparisonId of comparisonIds) {
    messages.push(...await requestToPromise(
      db.transaction(COMPARISON_MESSAGE_STORE, "readonly")
        .objectStore(COMPARISON_MESSAGE_STORE)
        .index("byComparisonId")
        .getAll(comparisonId)
    ));
  }
  return messages.map(cloneRecord);
}

function pruneComparisonRecordsForDeletedPapers(transaction, deletedDocumentKeys) {
  const sessionStore = transaction.objectStore(COMPARISON_SESSION_STORE);
  const messageStore = transaction.objectStore(COMPARISON_MESSAGE_STORE);
  const request = sessionStore.openCursor();
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    const session = cursor.value;
    const remainingKeys = (Array.isArray(session.documentKeys) ? session.documentKeys : [])
      .filter((documentKey) => !deletedDocumentKeys.has(documentKey));

    if (remainingKeys.length < 2) {
      cursor.delete();
      deleteComparisonMessages(messageStore, session.comparisonId);
    } else if (remainingKeys.length !== session.documentKeys.length) {
      cursor.update({
        ...session,
        documentKeys: remainingKeys,
        updatedAt: Date.now()
      });
    }

    cursor.continue();
  };
}

function deleteComparisonMessages(store, comparisonId) {
  const request = store.index("byComparisonId").openCursor(IDBKeyRange.only(comparisonId));
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    cursor.delete();
    cursor.continue();
  };
}

function deleteRecordsByDocumentKey(store, documentKey) {
  const request = store.index("byDocumentKey").openCursor(IDBKeyRange.only(documentKey));
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    cursor.delete();
    cursor.continue();
  };
}

function putRecords(store, records) {
  for (const record of records) {
    store.put(record);
  }
}

function cloneRecord(record) {
  return JSON.parse(JSON.stringify(record));
}

async function serializePaperNoteAsset(asset) {
  const blob = asset?.blob;
  if (!(blob instanceof Blob)) {
    throw new Error("Paper note image is unavailable for export.");
  }
  return {
    assetId: String(asset.assetId || ""),
    documentKey: String(asset.documentKey || ""),
    mimeType: String(asset.mimeType || blob.type || ""),
    naturalWidth: Number(asset.naturalWidth) || 1,
    naturalHeight: Number(asset.naturalHeight) || 1,
    fileName: String(asset.fileName || ""),
    createdAt: Number(asset.createdAt) || null,
    updatedAt: Number(asset.updatedAt) || null,
    dataBase64: bytesToBase64(new Uint8Array(await blob.arrayBuffer()))
  };
}

async function deserializePaperNoteAsset(asset) {
  const assetId = String(asset?.assetId || "").trim();
  const documentKey = String(asset?.documentKey || "").trim();
  const mimeType = String(asset?.mimeType || "").toLowerCase();
  if (!assetId || !documentKey || !/^image\/(?:png|jpeg|webp|gif)$/.test(mimeType) || typeof asset?.dataBase64 !== "string") {
    throw new Error("Paper note image in archive is invalid.");
  }
  const bytes = base64ToBytes(asset.dataBase64);
  return {
    assetId,
    documentKey,
    mimeType,
    blob: new Blob([bytes], { type: mimeType }),
    naturalWidth: Math.max(1, Number(asset.naturalWidth) || 1),
    naturalHeight: Math.max(1, Number(asset.naturalHeight) || 1),
    fileName: String(asset.fileName || "").slice(0, 240),
    createdAt: Number(asset.createdAt) || Date.now(),
    updatedAt: Number(asset.updatedAt) || Date.now()
  };
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  try {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw new Error("Paper note image payload is invalid.");
  }
}
