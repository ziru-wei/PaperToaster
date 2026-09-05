import {
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
export const LIBRARY_ARCHIVE_VERSION = 1;

const DOCUMENT_KEY_STORES = [
  PAPER_STORE,
  DOCUMENT_STORE,
  CONVERSATION_THREAD_STORE,
  CONVERSATION_MESSAGE_STORE,
  DOCUMENT_ALIAS_STORE,
  PAPER_LABEL_STORE
];

const IMPORT_STORES = [
  PAPER_STORE,
  DOCUMENT_STORE,
  CONVERSATION_THREAD_STORE,
  CONVERSATION_MESSAGE_STORE,
  DOCUMENT_ALIAS_STORE,
  LABEL_STORE,
  PAPER_LABEL_STORE
];

export async function exportLibraryPapers(documentKeys) {
  const keys = normalizeDocumentKeys(documentKeys);
  if (!keys.length) {
    throw new Error("No papers selected for export.");
  }

  const db = await openPaperDatabase();
  const records = createEmptyArchiveRecords();
  const exportedLabelIds = new Set();

  for (const documentKey of keys) {
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

  records.labels.push(...await getLabelsById(db, exportedLabelIds));

  return {
    schema: LIBRARY_ARCHIVE_SCHEMA,
    version: LIBRARY_ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    documentKeys: keys,
    records
  };
}

export async function deleteLibraryPapers(documentKeys) {
  const keys = normalizeDocumentKeys(documentKeys);
  if (!keys.length) {
    return 0;
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction(DOCUMENT_KEY_STORES, "readwrite");

  for (const documentKey of keys) {
    transaction.objectStore(PAPER_STORE).delete(documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(DOCUMENT_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(CONVERSATION_THREAD_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(CONVERSATION_MESSAGE_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(DOCUMENT_ALIAS_STORE), documentKey);
    deleteRecordsByDocumentKey(transaction.objectStore(PAPER_LABEL_STORE), documentKey);
  }

  await transactionDone(transaction);
  return keys.length;
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
  recordsToImport.labels = await filterMissingLabels(db, getLabelsForImportedPapers(records, recordsToImport.paperLabels));

  if (!importedDocumentKeys.length && !recordsToImport.labels.length) {
    return createImportSummary({ importedDocumentKeys, skippedDocumentKeys, records: recordsToImport });
  }

  const transaction = db.transaction(IMPORT_STORES, "readwrite");

  putRecords(transaction.objectStore(LABEL_STORE), recordsToImport.labels);
  putRecords(transaction.objectStore(PAPER_STORE), recordsToImport.papers);
  putRecords(transaction.objectStore(DOCUMENT_STORE), recordsToImport.documents);
  putRecords(transaction.objectStore(CONVERSATION_THREAD_STORE), recordsToImport.conversationThreads);
  putRecords(transaction.objectStore(CONVERSATION_MESSAGE_STORE), recordsToImport.conversationMessages);
  putRecords(transaction.objectStore(DOCUMENT_ALIAS_STORE), recordsToImport.documentAliases);
  putRecords(transaction.objectStore(PAPER_LABEL_STORE), recordsToImport.paperLabels);

  await transactionDone(transaction);
  return createImportSummary({ importedDocumentKeys, skippedDocumentKeys, records: recordsToImport });
}

function createEmptyArchiveRecords() {
  return {
    papers: [],
    documents: [],
    conversationThreads: [],
    conversationMessages: [],
    documentAliases: [],
    labels: [],
    paperLabels: []
  };
}

function normalizeArchiveRecords(archive) {
  if (!archive || typeof archive !== "object") {
    throw new Error("Archive file is not valid JSON data.");
  }

  if (archive.schema !== LIBRARY_ARCHIVE_SCHEMA || archive.version !== LIBRARY_ARCHIVE_VERSION) {
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

function getArchiveDocumentKeys(archive, records) {
  return normalizeDocumentKeys([
    ...(Array.isArray(archive.documentKeys) ? archive.documentKeys : []),
    ...records.papers.map((record) => record.documentKey),
    ...records.documents.map((record) => record.documentKey),
    ...records.conversationThreads.map((record) => record.documentKey),
    ...records.conversationMessages.map((record) => record.documentKey),
    ...records.documentAliases.map((record) => record.documentKey),
    ...records.paperLabels.map((record) => record.documentKey)
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
  return filtered;
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
    messageCount: records.conversationMessages.length
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
