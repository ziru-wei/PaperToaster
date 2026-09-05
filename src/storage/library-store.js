import {
  CONVERSATION_THREAD_STORE,
  DOCUMENT_STORE,
  LABEL_STORE,
  PAPER_LABEL_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise
} from "./paper-database.js";

export async function listLibraryPapers(options = {}) {
  const db = await openPaperDatabase();
  const [papers, documents, threads, labels, paperLabels] = await Promise.all([
    getAllFromStore(db, PAPER_STORE),
    getAllFromStore(db, DOCUMENT_STORE),
    getAllFromStore(db, CONVERSATION_THREAD_STORE),
    getAllFromStore(db, LABEL_STORE),
    getAllFromStore(db, PAPER_LABEL_STORE)
  ]);

  const labelsById = new Map(labels.map((label) => [label.labelId, label]));
  const labelsByDocument = groupLabelsByDocument(paperLabels, labelsById);
  const documentsByKey = groupDocumentsByKey(documents);
  const threadsByKey = groupThreadsByKey(threads);
  const summaries = new Map();

  for (const paper of papers) {
    summaries.set(paper.documentKey, createPaperSummary({
      paper,
      document: documentsByKey.get(paper.documentKey),
      threads: threadsByKey.get(paper.documentKey) || [],
      labels: labelsByDocument.get(paper.documentKey) || []
    }));
  }

  for (const [documentKey, document] of documentsByKey.entries()) {
    if (!summaries.has(documentKey)) {
      summaries.set(documentKey, createPaperSummary({
        paper: { documentKey },
        document,
        threads: threadsByKey.get(documentKey) || [],
        labels: labelsByDocument.get(documentKey) || []
      }));
    }
  }

  return [...summaries.values()]
    .filter((paper) => matchesLibraryFilters(paper, options))
    .sort((left, right) => compareLibraryPapers(left, right, options));
}

export async function listLibraryLabels() {
  const db = await openPaperDatabase();
  const labels = await getAllFromStore(db, LABEL_STORE);
  return labels.sort(compareLabels);
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

function groupLabelsByDocument(paperLabels, labelsById) {
  const grouped = new Map();
  for (const assignment of paperLabels) {
    const label = labelsById.get(assignment.labelId);
    if (!assignment.documentKey || !label) {
      continue;
    }

    if (!grouped.has(assignment.documentKey)) {
      grouped.set(assignment.documentKey, []);
    }
    grouped.get(assignment.documentKey).push({
      ...label,
      assignedAt: assignment.assignedAt || null
    });
  }

  for (const labels of grouped.values()) {
    labels.sort(compareLabels);
  }
  return grouped;
}

function createPaperSummary({ paper, document, threads, labels }) {
  const nonEmptyThreads = threads.filter((thread) => Number(thread.messageCount) > 0);
  const messageCount = nonEmptyThreads.reduce((sum, thread) => sum + (Number(thread.messageCount) || 0), 0);
  const firstConversationAt = minTime(nonEmptyThreads.map((thread) => thread.firstMessageCreatedAt || thread.createdAt));
  const lastConversationAt = maxTime(nonEmptyThreads.map((thread) => thread.updatedAt));
  const updatedAt = maxTime([paper.updatedAt, document?.updatedAt, lastConversationAt]);
  const byteLength = Number(document?.byteLength) || 0;
  const canonicalUrl = paper.canonicalUrl || document?.url || "";

  return {
    documentKey: paper.documentKey || document?.documentKey || "",
    title: paper.title || document?.title || "Untitled paper",
    canonicalUrl,
    domain: getDomain(canonicalUrl),
    labels,
    hasMarkdown: Boolean(document?.markdown),
    parserId: document?.parserId || "",
    pageCount: Number(document?.pageCount) || 0,
    byteLength,
    threadCount: nonEmptyThreads.length,
    emptyThreadCount: Math.max(0, threads.length - nonEmptyThreads.length),
    messageCount,
    firstConversationAt,
    lastConversationAt,
    firstOpenedAt: minTime([paper.createdAt, document?.parsedAt, document?.updatedAt]),
    lastOpenedAt: maxTime([paper.updatedAt, document?.updatedAt]),
    updatedAt,
    activeThreadId: paper.activeThreadId || ""
  };
}

function matchesLibraryFilters(paper, options) {
  if (options.labelId === "unlabeled" && paper.labels.length) {
    return false;
  }

  if (options.labelId && options.labelId !== "all" && options.labelId !== "unlabeled") {
    if (!paper.labels.some((label) => label.labelId === options.labelId)) {
      return false;
    }
  }

  const query = String(options.query || "").trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [
    paper.title,
    paper.canonicalUrl,
    paper.domain,
    ...paper.labels.map((label) => label.name)
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function compareLibraryPapers(left, right, options) {
  const direction = options.sortDirection === "asc" ? 1 : -1;
  const sortBy = options.sortBy || "lastOpened";

  if (sortBy === "title") {
    return compareTitle(left, right) * (options.sortDirection === "desc" ? -1 : 1);
  }

  if (sortBy === "label") {
    return compareByLabel(left, right) || compareTitle(left, right);
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

  if (sortBy === "firstOpened") {
    return paper.firstOpenedAt || Number.MAX_SAFE_INTEGER;
  }

  if (sortBy === "lastOpened") {
    return paper.lastOpenedAt || 0;
  }

  if (sortBy === "threadCount") {
    return paper.threadCount || 0;
  }

  if (sortBy === "messageCount") {
    return paper.messageCount || 0;
  }

  return paper.lastOpenedAt || 0;
}

function compareByLabel(left, right) {
  const leftLabel = left.labels[0];
  const rightLabel = right.labels[0];
  if (!leftLabel && !rightLabel) {
    return 0;
  }

  if (!leftLabel) {
    return 1;
  }

  if (!rightLabel) {
    return -1;
  }

  return compareLabels(leftLabel, rightLabel);
}

function compareLabels(left, right) {
  const orderDifference = (Number(left.sortOrder) || 0) - (Number(right.sortOrder) || 0);
  if (orderDifference) {
    return orderDifference;
  }

  return String(left.name || "").localeCompare(String(right.name || ""));
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

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
