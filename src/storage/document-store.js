import { stripHash } from "../pdf/fetch-pdf.js";
import { chunkDocument } from "../pdf/chunk-document.js";

const DB_NAME = "pdf-ai-inspector";
const DB_VERSION = 1;
const DOCUMENT_STORE = "documents";

let databasePromise = null;

export function getDocumentStoreKey({ url, parserId, cacheVersion }) {
  return `pdf:${cacheVersion}:${parserId}:${normalizeDocumentUrl(url)}`;
}

export async function getStoredDocument({ url, parserId, cacheVersion }) {
  const db = await openDatabase();
  const key = getDocumentStoreKey({ url, parserId, cacheVersion });
  const record = await requestToPromise(db.transaction(DOCUMENT_STORE, "readonly").objectStore(DOCUMENT_STORE).get(key));
  return record ? hydrateStoredDocument(record) : null;
}

export async function saveStoredDocument({ url, parserId, cacheVersion, document }) {
  const db = await openDatabase();
  const key = getDocumentStoreKey({ url, parserId, cacheVersion });
  const normalizedUrl = normalizeDocumentUrl(url);
  const now = Date.now();
  const record = {
    key,
    cacheVersion,
    parserId,
    normalizedUrl,
    url,
    title: document.title || "",
    titleSource: document.titleSource || "",
    titleIssue: document.titleIssue || null,
    parser: document.parser || null,
    pageCount: document.pageCount || 0,
    markdown: document.markdown || "",
    byteLength: document.byteLength || null,
    contentType: document.contentType || "",
    metadata: document.metadata || null,
    warnings: document.warnings || [],
    stats: document.stats || null,
    parsedAt: document.parsedAt || now,
    updatedAt: now
  };

  await requestToPromise(db.transaction(DOCUMENT_STORE, "readwrite").objectStore(DOCUMENT_STORE).put(record));
  return hydrateStoredDocument(record);
}

export function normalizeDocumentUrl(url) {
  try {
    return stripHash(url);
  } catch {
    return String(url || "");
  }
}

function openDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DOCUMENT_STORE)) {
        const store = db.createObjectStore(DOCUMENT_STORE, { keyPath: "key" });
        store.createIndex("byNormalizedUrl", "normalizedUrl", { unique: false });
        store.createIndex("byUpdatedAt", "updatedAt", { unique: false });
        store.createIndex("byTitle", "title", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open document store."));
    request.onblocked = () => reject(new Error("Document store upgrade is blocked by another extension view."));
  });

  return databasePromise;
}

function hydrateStoredDocument(record) {
  const page = {
    pageNumber: 1,
    text: record.markdown || ""
  };

  return {
    url: record.url,
    title: record.title || "",
    titleSource: record.titleSource || "",
    titleCandidates: [],
    titleIssue: record.titleIssue || null,
    parser: record.parser || null,
    pageCount: record.pageCount || 1,
    pages: record.markdown ? [page] : [],
    markdown: record.markdown || "",
    rawMarkdown: "",
    chunks: record.markdown ? chunkDocument({
      pageCount: record.pageCount || 1,
      pages: [page]
    }) : [],
    metadata: record.metadata || null,
    warnings: record.warnings || [],
    stats: record.stats || null,
    byteLength: record.byteLength || null,
    contentType: record.contentType || "",
    parsedAt: record.parsedAt || null,
    storedAt: record.updatedAt || null
  };
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Document store request failed."));
  });
}
