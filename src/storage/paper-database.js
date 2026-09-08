export const DB_NAME = "pdf-ai-inspector";
export const DB_VERSION = 5;

export const PAPER_STORE = "papers";
export const DOCUMENT_STORE = "documents";
export const CONVERSATION_THREAD_STORE = "conversationThreads";
export const CONVERSATION_MESSAGE_STORE = "conversationMessages";
export const DOCUMENT_ALIAS_STORE = "documentAliases";
export const COMPARISON_SESSION_STORE = "comparisonSessions";
export const COMPARISON_MESSAGE_STORE = "comparisonMessages";

const OBSOLETE_STORES = ["labels", "paperLabels"];

let databasePromise = null;

export function openPaperDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;

      const papers = ensureStore(db, transaction, PAPER_STORE, { keyPath: "documentKey" });
      ensureIndex(papers, "byUpdatedAt", "updatedAt", { unique: false });
      ensureIndex(papers, "byTitle", "title", { unique: false });

      const documents = ensureStore(db, transaction, DOCUMENT_STORE, { keyPath: "key" });
      ensureIndex(documents, "byNormalizedUrl", "normalizedUrl", { unique: false });
      ensureIndex(documents, "byUpdatedAt", "updatedAt", { unique: false });
      ensureIndex(documents, "byTitle", "title", { unique: false });
      ensureIndex(documents, "byDocumentKey", "documentKey", { unique: false });

      const threads = ensureStore(db, transaction, CONVERSATION_THREAD_STORE, { keyPath: "threadId" });
      ensureIndex(threads, "byDocumentKey", "documentKey", { unique: false });
      ensureIndex(threads, "byDocumentUpdatedAt", ["documentKey", "updatedAt"], { unique: false });

      const messages = ensureStore(db, transaction, CONVERSATION_MESSAGE_STORE, { keyPath: "messageId" });
      ensureIndex(messages, "byThreadId", "threadId", { unique: false });
      ensureIndex(messages, "byDocumentKey", "documentKey", { unique: false });
      ensureIndex(messages, "byThreadCreatedAt", ["threadId", "createdAt"], { unique: false });

      const aliases = ensureStore(db, transaction, DOCUMENT_ALIAS_STORE, { keyPath: "aliasKey" });
      ensureIndex(aliases, "byDocumentKey", "documentKey", { unique: false });

      for (const storeName of OBSOLETE_STORES) {
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
      }

      const comparisonSessions = ensureStore(db, transaction, COMPARISON_SESSION_STORE, { keyPath: "comparisonId" });
      ensureIndex(comparisonSessions, "byUpdatedAt", "updatedAt", { unique: false });
      ensureIndex(comparisonSessions, "byCreatedAt", "createdAt", { unique: false });

      const comparisonMessages = ensureStore(db, transaction, COMPARISON_MESSAGE_STORE, { keyPath: "messageId" });
      ensureIndex(comparisonMessages, "byComparisonId", "comparisonId", { unique: false });
      ensureIndex(comparisonMessages, "byComparisonCreatedAt", ["comparisonId", "createdAt"], { unique: false });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open paper database."));
    request.onblocked = () => reject(new Error("Paper database upgrade is blocked by another extension view."));
  });

  return databasePromise;
}

export function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Paper database request failed."));
  });
}

export function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Paper database transaction failed."));
    transaction.onabort = () => reject(transaction.error || new Error("Paper database transaction aborted."));
  });
}

function ensureStore(db, transaction, name, options) {
  if (db.objectStoreNames.contains(name)) {
    return transaction.objectStore(name);
  }

  return db.createObjectStore(name, options);
}

function ensureIndex(store, name, keyPath, options) {
  if (store.indexNames.contains(name)) {
    return;
  }

  store.createIndex(name, keyPath, options);
}
