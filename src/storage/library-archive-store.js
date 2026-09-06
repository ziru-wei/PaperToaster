import {
  COMPARISON_MESSAGE_STORE,
  COMPARISON_SESSION_STORE,
  CONVERSATION_MESSAGE_STORE,
  CONVERSATION_THREAD_STORE,
  DOCUMENT_ALIAS_STORE,
  DOCUMENT_STORE,
  LABEL_STORE,
  PAPER_LABEL_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

export const LIBRARY_ARCHIVE_SCHEMA = "pdf-ai-inspector.library-archive";
export const LIBRARY_ARCHIVE_VERSION = 2;
const SUPPORTED_LIBRARY_ARCHIVE_VERSIONS = new Set([1, 2]);

const DOCUMENT_KEY_STORES = [
  PAPER_STORE,
  DOCUMENT_STORE,
  CONVERSATION_THREAD_STORE,
  CONVERSATION_MESSAGE_STORE,
  DOCUMENT_ALIAS_STORE,
  PAPER_LABEL_STORE
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
  LABEL_STORE,
  PAPER_LABEL_STORE,
  COMPARISON_SESSION_STORE,
  COMPARISON_MESSAGE_STORE
];

export async function exportLibraryPapers(documentKeys) {
  return exportLibraryRecords({ documentKeys });
}

export async function exportLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const keys = normalizeDocumentKeys(documentKeys);
  const selectedComparisonIds = normalizeRecordIds(comparisonIds);
  if (!keys.length && !selectedComparisonIds.length) {
    throw new Error("No records selected for export.");
  }

  const db = await openPaperDatabase();
  const records = createEmptyArchiveRecords();
  const exportedLabelIds = new Set();
  const exportedComparisonIds = new Set();
  const exportedDocumentKeys = new Set();

  for (const documentKey of keys) {
    await appendPaperRecords(db, records, documentKey, exportedLabelIds, exportedDocumentKeys);
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
      await appendPaperRecords(db, records, documentKey, exportedLabelIds, exportedDocumentKeys);
    }
  }
  records.comparisonMessages.push(...await getComparisonMessagesByIds(db, exportedComparisonIds));
  records.labels.push(...await getLabelsById(db, exportedLabelIds));

  return {
    schema: LIBRARY_ARCHIVE_SCHEMA,
    version: LIBRARY_ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    documentKeys: [...exportedDocumentKeys],
    comparisonIds: [...exportedComparisonIds],
    records
  };
}

export async function deleteLibraryPapers(documentKeys) {
  const result = await deleteLibraryRecords({ documentKeys });
  return result.paperCount;
}

export async function deleteLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const keys = normalizeDocumentKeys(documentKeys);
  const selectedComparisonIds = normalizeRecordIds(comparisonIds);
  if (!keys.length && !selectedComparisonIds.length) {
    return {
      paperCount: 0,
      comparisonCount: 0
    };
  }

  const db = await openPaperDatabase();
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
    deleteRecordsByDocumentKey(transaction.objectStore(PAPER_LABEL_STORE), documentKey);
  }
  pruneComparisonRecordsForDeletedPapers(transaction, new Set(keys));

  await transactionDone(transaction);
  return {
    paperCount: keys.length,
    comparisonCount: selectedComparisonIds.length
  };
}

export async function importLibraryArchive(archive) {
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
  recordsToImport.labels = await filterMissingLabels(db, getLabelsForImportedPapers(records, recordsToImport.paperLabels));
  const availableDocumentKeys = new Set([
    ...skippedDocumentKeys,
    ...materializedImportedDocumentKeys
  ]);
  recordsToImport.comparisonSessions = await filterImportableComparisonSessions(db, records.comparisonSessions, availableDocumentKeys);
  const importedComparisonIds = new Set(recordsToImport.comparisonSessions.map((session) => session.comparisonId).filter(Boolean));
  recordsToImport.comparisonMessages = records.comparisonMessages.filter((message) => importedComparisonIds.has(message.comparisonId));

  if (!importedDocumentKeys.length && !recordsToImport.labels.length && !recordsToImport.comparisonSessions.length) {
    return createImportSummary({
      importedDocumentKeys: materializedImportedDocumentKeys,
      skippedDocumentKeys,
      records: recordsToImport
    });
  }

  const transaction = db.transaction(IMPORT_STORES, "readwrite");

  putRecords(transaction.objectStore(LABEL_STORE), recordsToImport.labels);
  putRecords(transaction.objectStore(PAPER_STORE), recordsToImport.papers);
  putRecords(transaction.objectStore(DOCUMENT_STORE), recordsToImport.documents);
  putRecords(transaction.objectStore(CONVERSATION_THREAD_STORE), recordsToImport.conversationThreads);
  putRecords(transaction.objectStore(CONVERSATION_MESSAGE_STORE), recordsToImport.conversationMessages);
  putRecords(transaction.objectStore(DOCUMENT_ALIAS_STORE), recordsToImport.documentAliases);
  putRecords(transaction.objectStore(PAPER_LABEL_STORE), recordsToImport.paperLabels);
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
    labels: [],
    paperLabels: [],
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
    ...records.paperLabels.map((record) => record.documentKey),
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
  filtered.paperLabels = records.paperLabels.filter((record) => documentKeys.has(record.documentKey));
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
    ...records.paperLabels.map((record) => record.documentKey)
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

function getLabelsForImportedPapers(records, paperLabels) {
  const labelIds = new Set(paperLabels.map((paperLabel) => paperLabel.labelId).filter(Boolean));
  return records.labels.filter((label) => labelIds.has(label.labelId));
}

async function filterMissingLabels(db, labels) {
  const missingLabels = [];
  for (const label of labels) {
    if (label?.labelId && !(await getStoreRecord(db, LABEL_STORE, label.labelId))) {
      missingLabels.push(label);
    }
  }
  return missingLabels;
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

async function appendPaperRecords(db, records, documentKey, exportedLabelIds, exportedDocumentKeys) {
  if (!documentKey || exportedDocumentKeys.has(documentKey)) {
    return;
  }

  exportedDocumentKeys.add(documentKey);
  const paper = await getStoreRecord(db, PAPER_STORE, documentKey);
  if (paper) {
    records.papers.push(cloneRecord(paper));
  }

  const [documents, threads, messages, aliases, paperLabels] = await Promise.all([
    getRecordsByDocumentKey(db, DOCUMENT_STORE, documentKey),
    getRecordsByDocumentKey(db, CONVERSATION_THREAD_STORE, documentKey),
    getRecordsByDocumentKey(db, CONVERSATION_MESSAGE_STORE, documentKey),
    getRecordsByDocumentKey(db, DOCUMENT_ALIAS_STORE, documentKey),
    getRecordsByDocumentKey(db, PAPER_LABEL_STORE, documentKey)
  ]);

  records.documents.push(...documents.map(cloneRecord));
  records.conversationThreads.push(...threads.map(cloneRecord));
  records.conversationMessages.push(...messages.map(cloneRecord));
  records.documentAliases.push(...aliases.map(cloneRecord));
  records.paperLabels.push(...paperLabels.map((paperLabel) => {
    if (paperLabel.labelId) {
      exportedLabelIds.add(paperLabel.labelId);
    }
    return cloneRecord(paperLabel);
  }));
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

async function getLabelsById(db, labelIds) {
  const labels = [];
  for (const labelId of labelIds) {
    const label = await getStoreRecord(db, LABEL_STORE, labelId);
    if (label) {
      labels.push(cloneRecord(label));
    }
  }
  return labels;
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
