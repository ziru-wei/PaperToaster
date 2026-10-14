export const DB_NAME = "pdf-ai-inspector";
export const DB_VERSION = 11;
export const SYNC_META_STORE = "googleSyncMetadata";

export const PAPER_STORE = "papers";
export const DOCUMENT_STORE = "documents";
export const CONVERSATION_THREAD_STORE = "conversationThreads";
export const CONVERSATION_MESSAGE_STORE = "conversationMessages";
export const DOCUMENT_ALIAS_STORE = "documentAliases";
export const COMPARISON_SESSION_STORE = "comparisonSessions";
export const COMPARISON_MESSAGE_STORE = "comparisonMessages";
export const PAPER_NOTE_STORE = "paperNotes";
export const PAPER_NOTE_ASSET_STORE = "paperNoteAssets";
// Figure 1 crops for dashboard covers; derived from the PDF, so not backed up or synced.
export const PAPER_FIGURE_STORE = "paperFigures";
// Authors, year, venue and citation counts from public APIs; a refreshable local cache like figures.
export const PAPER_METADATA_STORE = "paperMetadata";
// Saved copies of local PDFs, keyed by SHA-256. Synced as separate Drive files,
// not inside the library replica.
export const LOCAL_PDF_STORE = "pdfFiles";

const OBSOLETE_STORES = ["labels", "paperLabels"];

let databasePromise = null;
const outdatedListeners = new Set();
let outdatedVersion = 0;

// An unpacked build serves new files at once, so a page reloaded after an upgrade can
// raise the schema while the side panel or service worker still runs the old code.
// Schema upgrades only add stores, so an outdated page keeps working on the newer
// database and only asks the person to reload when it suits them.
export function onPaperDatabaseOutdated(listener) {
  outdatedListeners.add(listener);
  if (outdatedVersion) listener(outdatedVersion);
  return () => outdatedListeners.delete(listener);
}

function reportOutdated(version) {
  if (!version || version <= DB_VERSION || version <= outdatedVersion) return;
  outdatedVersion = version;
  outdatedListeners.forEach((listener) => listener(version));
}

export function openPaperDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = openAtVersion(DB_VERSION).catch((error) => {
    if (error?.name !== "VersionError") throw error;
    return openAtVersion(undefined);
  }).catch((error) => {
    databasePromise = null;
    throw error;
  });
  return databasePromise;
}

function openAtVersion(version) {
  return new Promise((resolve, reject) => {
    const request = version === undefined ? indexedDB.open(DB_NAME) : indexedDB.open(DB_NAME, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;
      ensureStore(db, transaction, SYNC_META_STORE, { keyPath: "accountId" });

      const papers = ensureStore(db, transaction, PAPER_STORE, { keyPath: "documentKey" });
      ensureIndex(papers, "byUpdatedAt", "updatedAt", { unique: false });
      ensureIndex(papers, "byTitle", "title", { unique: false });
      ensureIndex(papers, "byArchivedAt", "archivedAt", { unique: false });

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
      ensureIndex(messages, "bySavedDocumentKey", "savedDocumentKey", { unique: false });

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
      ensureIndex(comparisonSessions, "byArchivedAt", "archivedAt", { unique: false });
      ensureIndex(comparisonSessions, "byDocumentKey", "documentKeys", { unique: false, multiEntry: true });

      const comparisonMessages = ensureStore(db, transaction, COMPARISON_MESSAGE_STORE, { keyPath: "messageId" });
      ensureIndex(comparisonMessages, "byComparisonId", "comparisonId", { unique: false });
      ensureIndex(comparisonMessages, "byComparisonCreatedAt", ["comparisonId", "createdAt"], { unique: false });
      ensureIndex(comparisonMessages, "bySavedDocumentKey", "savedDocumentKeys", { unique: false, multiEntry: true });

      const paperNotes = ensureStore(db, transaction, PAPER_NOTE_STORE, { keyPath: "documentKey" });
      ensureIndex(paperNotes, "byDocumentKey", "documentKey", { unique: false });
      ensureIndex(paperNotes, "byUpdatedAt", "updatedAt", { unique: false });

      const paperNoteAssets = ensureStore(db, transaction, PAPER_NOTE_ASSET_STORE, { keyPath: "assetId" });
      ensureIndex(paperNoteAssets, "byDocumentKey", "documentKey", { unique: false });

      ensureStore(db, transaction, PAPER_FIGURE_STORE, { keyPath: "documentKey" });
      ensureStore(db, transaction, PAPER_METADATA_STORE, { keyPath: "documentKey" });
      ensureStore(db, transaction, LOCAL_PDF_STORE, { keyPath: "sha256" });

      backfillSavedDocumentKeys(transaction);
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = (event) => {
        db.close();
        databasePromise = null;
        reportOutdated(event.newVersion);
      };
      reportOutdated(db.version);
      resolve(db);
    };
    request.onerror = () => reject(request.error || new Error("Could not open paper database."));
    request.onblocked = () => reject(new Error("Paper database upgrade is blocked by another extension view."));
  });
}

function backfillSavedDocumentKeys(transaction) {
  const conversationMessages = transaction.objectStore(CONVERSATION_MESSAGE_STORE);
  const comparisonMessages = transaction.objectStore(COMPARISON_MESSAGE_STORE);
  const comparisonSessions = transaction.objectStore(COMPARISON_SESSION_STORE);
  const sessionsRequest = comparisonSessions.getAll();

  const backfillConversationMessages = () => {
    const request = conversationMessages.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const message = cursor.value;
      const savedDocumentKey = message?.role === "assistant" && message?.isSaved
        ? String(message.documentKey || "")
        : "";
      if (message.savedDocumentKey !== savedDocumentKey) {
        cursor.update({ ...message, savedDocumentKey });
      }
      cursor.continue();
    };
  };

  sessionsRequest.onsuccess = () => {
    const documentKeysByComparisonId = new Map(
      (sessionsRequest.result || []).map((session) => [
        String(session?.comparisonId || ""),
        Array.isArray(session?.documentKeys)
          ? session.documentKeys.map((key) => String(key || "").trim()).filter(Boolean)
          : []
      ])
    );
    const request = comparisonMessages.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const message = cursor.value;
      const savedDocumentKeys = message?.role === "assistant" && message?.isSaved
        ? documentKeysByComparisonId.get(String(message.comparisonId || "")) || []
        : [];
      if (JSON.stringify(message.savedDocumentKeys || []) !== JSON.stringify(savedDocumentKeys)) {
        cursor.update({ ...message, savedDocumentKeys });
      }
      cursor.continue();
    };
    backfillConversationMessages();
  };
  sessionsRequest.onerror = backfillConversationMessages;
}

export function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Paper database request failed."));
  });
}

export function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      if (transaction.mode === "readwrite" && !transaction.objectStoreNames.contains(SYNC_META_STORE)) {
        globalThis.chrome?.runtime?.sendMessage?.({ type: "GOOGLE_SYNC_DIRTY" })?.catch(() => {});
      }
      resolve();
    };
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
