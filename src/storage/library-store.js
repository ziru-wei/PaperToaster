import {
  CONVERSATION_THREAD_STORE,
  DOCUMENT_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

export async function listLibraryPapers(options = {}) {
  const db = await openPaperDatabase();
  const [papers, documents, threads] = await Promise.all([
    getAllFromStore(db, PAPER_STORE),
    getAllFromStore(db, DOCUMENT_STORE),
    getAllFromStore(db, CONVERSATION_THREAD_STORE)
  ]);

  const documentsByKey = groupDocumentsByKey(documents);
  const threadsByKey = groupThreadsByKey(threads);
  const summaries = new Map();

  for (const paper of papers) {
    summaries.set(paper.documentKey, createPaperSummary({
      paper,
      document: documentsByKey.get(paper.documentKey),
      threads: threadsByKey.get(paper.documentKey) || []
    }));
  }

  for (const [documentKey, document] of documentsByKey.entries()) {
    if (!summaries.has(documentKey)) {
      summaries.set(documentKey, createPaperSummary({
        paper: { documentKey },
        document,
        threads: threadsByKey.get(documentKey) || []
      }));
    }
  }

  return [...summaries.values()]
    .filter((paper) => matchesLibraryFilters(paper, options))
    .sort((left, right) => compareLibraryPapers(left, right, options));
}

export async function setLibraryPaperStarred(documentKey, starred, fallback = {}) {
  if (!documentKey) {
    return;
  }

  const db = await openPaperDatabase();
  const now = Date.now();
  const existing = await requestToPromise(db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(documentKey));
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  transaction.objectStore(PAPER_STORE).put({
    ...(existing || {}),
    documentKey,
    canonicalUrl: existing?.canonicalUrl || fallback.canonicalUrl || "",
    title: existing?.title || fallback.title || "",
    titleSource: existing?.titleSource || "",
    metadata: existing?.metadata || null,
    createdAt: existing?.createdAt || now,
    updatedAt: existing?.updatedAt || now,
    activeThreadId: existing?.activeThreadId || "",
    starred: Boolean(starred),
    starredAt: starred ? now : null
  });
  await transactionDone(transaction);
}

function getAllFromStore(db, storeName) {
  return requestToPromise(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
}

function groupDocumentsByKey(documents) {
  const grouped = new Map();
  for (const document of documents) {
    const documentKey = document.documentKey;
    if (!documentKey) {
      continue;
    }

    const current = grouped.get(documentKey);
    if (!current || getTime(document.updatedAt) > getTime(current.updatedAt)) {
      grouped.set(documentKey, document);
    }
  }
  return grouped;
}

function groupThreadsByKey(threads) {
  const grouped = new Map();
  for (const thread of threads) {
    if (!thread.documentKey) {
      continue;
    }

    if (!grouped.has(thread.documentKey)) {
      grouped.set(thread.documentKey, []);
    }
    grouped.get(thread.documentKey).push(thread);
  }
  return grouped;
}

function createPaperSummary({ paper, document, threads }) {
  const nonEmptyThreads = threads.filter((thread) => Number(thread.messageCount) > 0);
  const threadStartTimes = nonEmptyThreads.map(getThreadStartedAt).filter(Boolean);
  const messageCount = nonEmptyThreads.reduce((sum, thread) => sum + (Number(thread.messageCount) || 0), 0);
  const firstConversationAt = minTime(threadStartTimes);
  const lastThreadStartedAt = maxTime(threadStartTimes);
  const lastConversationAt = maxTime(nonEmptyThreads.map((thread) => thread.updatedAt));
  const updatedAt = maxTime([paper.updatedAt, document?.updatedAt, lastConversationAt]);
  const byteLength = Number(document?.byteLength) || 0;
  const canonicalUrl = paper.canonicalUrl || document?.url || "";

  return {
    documentKey: paper.documentKey || document?.documentKey || "",
    title: paper.title || document?.title || "Untitled paper",
    canonicalUrl,
    domain: getDomain(canonicalUrl),
    hasMarkdown: Boolean(document?.markdown),
    parserId: document?.parserId || "",
    pageCount: Number(document?.pageCount) || 0,
    byteLength,
    threadCount: nonEmptyThreads.length,
    emptyThreadCount: Math.max(0, threads.length - nonEmptyThreads.length),
    messageCount,
    firstConversationAt,
    firstThreadStartedAt: firstConversationAt,
    lastThreadStartedAt,
    lastConversationAt,
    updatedAt,
    activeThreadId: paper.activeThreadId || "",
    starred: Boolean(paper.starred),
    starredAt: getTime(paper.starredAt)
  };
}

function matchesLibraryFilters(paper, options) {
  const query = String(options.query || "").trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [
    paper.title,
    paper.canonicalUrl,
    paper.domain
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function compareLibraryPapers(left, right, options) {
  const direction = options.sortDirection === "asc" ? 1 : -1;
  const sortBy = options.sortBy || "latestThread";

  if (sortBy === "title") {
    return compareTitle(left, right) * (options.sortDirection === "desc" ? -1 : 1);
  }

  const leftValue = getSortValue(left, sortBy);
  const rightValue = getSortValue(right, sortBy);
  if (leftValue !== rightValue) {
    return (leftValue > rightValue ? 1 : -1) * direction;
  }

  return compareTitle(left, right);
}

function getSortValue(paper, sortBy) {
  if (sortBy === "firstConversation") {
    return paper.firstConversationAt || Number.MAX_SAFE_INTEGER;
  }

  if (sortBy === "latestThread") {
    return paper.lastThreadStartedAt || 0;
  }

  if (sortBy === "threadCount") {
    return paper.threadCount || 0;
  }

  if (sortBy === "messageCount") {
    return paper.messageCount || 0;
  }

  return paper.lastThreadStartedAt || 0;
}

function compareTitle(left, right) {
  return String(left.title || "").localeCompare(String(right.title || ""), undefined, { sensitivity: "base" });
}

function minTime(values) {
  const times = values.map(getTime).filter(Boolean);
  return times.length ? Math.min(...times) : null;
}

function maxTime(values) {
  const times = values.map(getTime).filter(Boolean);
  return times.length ? Math.max(...times) : null;
}

function getTime(value) {
  return Number(value) || 0;
}

function getThreadStartedAt(thread) {
  return getTime(thread?.firstMessageCreatedAt || thread?.createdAt);
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
