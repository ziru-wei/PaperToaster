import { annotateChunksWithSections, chunkDocument, createSectionOutline } from "../pdf/chunk-document.js";
import { ensurePaperOverview } from "../rag/paper-overview.js";
import {
  getDocumentMemoryKey,
  normalizeDocumentUrl,
  normalizeLegacyDocumentUrl
} from "./document-key.js";
import {
  DOCUMENT_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

export { getDocumentMemoryKey, normalizeDocumentUrl } from "./document-key.js";

export function getDocumentStoreKey({ url, parserId, cacheVersion }) {
  return `pdf:${cacheVersion}:${parserId}:${getDocumentMemoryKey(url)}`;
}

export async function getStoredDocument({ url, parserId, cacheVersion }) {
  const db = await openPaperDatabase();
  const key = getDocumentStoreKey({ url, parserId, cacheVersion });
  let record = await getDocumentRecord(db, key);
  if (!record) {
    record = await getDocumentRecord(db, getLegacyDocumentStoreKey({ url, parserId, cacheVersion }));
  }
  return record ? hydrateStoredDocument(record, url) : null;
}

export async function getStoredDocumentByDocumentKey(documentKey) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return null;
  }

  const db = await openPaperDatabase();
  const records = await requestToPromise(
    db.transaction(DOCUMENT_STORE, "readonly")
      .objectStore(DOCUMENT_STORE)
      .index("byDocumentKey")
      .getAll(normalizedDocumentKey)
  );
  const record = selectBestDocumentRecord(records);
  return record ? hydrateStoredDocument(record, record.url) : null;
}

export async function saveStoredDocument({ url, parserId, cacheVersion, document }) {
  const db = await openPaperDatabase();
  const key = getDocumentStoreKey({ url, parserId, cacheVersion });
  const documentKey = getDocumentMemoryKey(url);
  const normalizedUrl = normalizeDocumentUrl(url);
  const now = Date.now();
  const record = {
    key,
    documentKey,
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
    overview: document.overview || null,
    sectionOutline: document.sectionOutline || createSectionOutline(document.chunks || []),
    byteLength: document.byteLength || null,
    contentType: document.contentType || "",
    metadata: document.metadata || null,
    artifacts: document.artifacts || null,
    warnings: document.warnings || [],
    stats: document.stats || null,
    parsedAt: document.parsedAt || now,
    updatedAt: now
  };

  const transaction = db.transaction([DOCUMENT_STORE, PAPER_STORE], "readwrite");
  transaction.objectStore(DOCUMENT_STORE).put(record);
  upsertPaperRecord(transaction.objectStore(PAPER_STORE), {
    documentKey,
    url,
    title: record.title,
    titleSource: record.titleSource,
    metadata: record.metadata,
    now
  });
  await transactionDone(transaction);
  return hydrateStoredDocument(record);
}

function getLegacyDocumentStoreKey({ url, parserId, cacheVersion }) {
  return `pdf:${cacheVersion}:${parserId}:${normalizeLegacyDocumentUrl(url)}`;
}

function getDocumentRecord(db, key) {
  return requestToPromise(db.transaction(DOCUMENT_STORE, "readonly").objectStore(DOCUMENT_STORE).get(key));
}

function hydrateStoredDocument(record, requestedUrl = "") {
  const page = {
    pageNumber: 1,
    text: record.markdown || ""
  };

  const chunks = record.markdown ? annotateChunksWithSections(chunkDocument({
    pageCount: record.pageCount || 1,
    pages: [page]
  })) : [];

  const document = {
    url: requestedUrl || record.url,
    documentKey: record.documentKey || "",
    normalizedUrl: record.normalizedUrl || "",
    title: record.title || "",
    titleSource: record.titleSource || "",
    titleCandidates: [],
    titleIssue: record.titleIssue || null,
    parser: record.parser || null,
    pageCount: record.pageCount || 1,
    pages: record.markdown ? [page] : [],
    markdown: record.markdown || "",
    rawMarkdown: "",
    chunks,
    sectionOutline: record.sectionOutline?.length ? record.sectionOutline : createSectionOutline(chunks),
    overview: record.overview || null,
    metadata: record.metadata || null,
    artifacts: record.artifacts || null,
    warnings: record.warnings || [],
    stats: record.stats || null,
    byteLength: record.byteLength || null,
    contentType: record.contentType || "",
    parsedAt: record.parsedAt || null,
    storedAt: record.updatedAt || null
  };

  return {
    ...document,
    overview: record.overview || ensurePaperOverview(document)
  };
}

function selectBestDocumentRecord(records) {
  return [...(records || [])]
    .filter((record) => record?.documentKey && record.markdown)
    .sort((left, right) => {
      const leftHasMarkdown = left.markdown ? 1 : 0;
      const rightHasMarkdown = right.markdown ? 1 : 0;
      if (leftHasMarkdown !== rightHasMarkdown) {
        return rightHasMarkdown - leftHasMarkdown;
      }

      return (Number(right.updatedAt) || 0) - (Number(left.updatedAt) || 0);
    })[0] || null;
}

function upsertPaperRecord(store, { documentKey, url, title, titleSource, metadata, now }) {
  if (!documentKey) {
    return;
  }

  const getRequest = store.get(documentKey);
  getRequest.onsuccess = () => {
    const existing = getRequest.result || {};
    store.put({
      ...existing,
      documentKey,
      canonicalUrl: url || existing.canonicalUrl || "",
      title: title || existing.title || "",
      titleSource: titleSource || existing.titleSource || "",
      metadata: metadata || existing.metadata || null,
      createdAt: existing.createdAt || now,
      updatedAt: now,
      activeThreadId: existing.activeThreadId || ""
    });
  };
}
