import {
  CONVERSATION_THREAD_STORE,
  DOCUMENT_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

const PAPER_GROUP_TONE_COUNT = 8;

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

export async function getLibraryPaperSummary(documentKey) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return null;
  }

  const db = await openPaperDatabase();
  const [paper, documents, threads] = await Promise.all([
    requestToPromise(db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(normalizedDocumentKey)),
    requestToPromise(
      db.transaction(DOCUMENT_STORE, "readonly")
        .objectStore(DOCUMENT_STORE)
        .index("byDocumentKey")
        .getAll(normalizedDocumentKey)
    ),
    requestToPromise(
      db.transaction(CONVERSATION_THREAD_STORE, "readonly")
        .objectStore(CONVERSATION_THREAD_STORE)
        .index("byDocumentKey")
        .getAll(normalizedDocumentKey)
    )
  ]);
  const document = selectBestDocumentForSummary(documents);

  if (!paper && !document) {
    return null;
  }

  return createPaperSummary({
    paper: paper || { documentKey: normalizedDocumentKey },
    document,
    threads
  });
}

export async function listLibraryPaperGroups() {
  const db = await openPaperDatabase();
  const papers = await getAllFromStore(db, PAPER_STORE);
  return papers
    .filter((paper) => normalizeLibraryPaperGroup(paper.group))
    .map((paper) => ({
      group: paper.group,
      groupTone: paper.groupTone
    }));
}

export async function setLibraryPaperStarred(documentKey, isStarred, fallback = {}) {
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
    isStarred: Boolean(isStarred),
    starredAt: isStarred ? now : null
  });
  await transactionDone(transaction);
}

export async function setLibraryPaperGroup(documentKey, group, fallback = {}) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return;
  }

  const db = await openPaperDatabase();
  const now = Date.now();
  const allPapers = await getAllFromStore(db, PAPER_STORE);
  const existing = allPapers.find((paper) => paper.documentKey === normalizedDocumentKey);
  const normalizedGroup = normalizeLibraryPaperGroup(group);
  if (normalizedGroup && !canCreateLibraryPaperGroup(normalizedGroup, allPapers)) {
    throw new Error(`Paper labels are limited to ${PAPER_GROUP_TONE_COUNT}.`);
  }
  const groupTone = normalizedGroup ? resolveLibraryPaperGroupTone(normalizedGroup, allPapers) : null;
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  transaction.objectStore(PAPER_STORE).put({
    ...(existing || {}),
    documentKey: normalizedDocumentKey,
    canonicalUrl: existing?.canonicalUrl || fallback.canonicalUrl || "",
    title: existing?.title || fallback.title || "",
    titleSource: existing?.titleSource || fallback.titleSource || "",
    metadata: existing?.metadata || fallback.metadata || null,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    activeThreadId: existing?.activeThreadId || "",
    isStarred: Boolean(existing?.isStarred),
    starredAt: existing?.starredAt || null,
    group: normalizedGroup,
    groupTone
  });
  await transactionDone(transaction);
}

export async function renameLibraryPaperGroup(oldGroup, newGroup) {
  const normalizedOldGroup = normalizeLibraryPaperGroup(oldGroup);
  const normalizedNewGroup = normalizeLibraryPaperGroup(newGroup);
  if (!normalizedOldGroup) {
    return [];
  }
  if (!normalizedNewGroup) {
    return deleteLibraryPaperGroup(normalizedOldGroup);
  }
  if (normalizedOldGroup.toLowerCase() === normalizedNewGroup.toLowerCase()) {
    return [];
  }

  const db = await openPaperDatabase();
  const papers = await getAllFromStore(db, PAPER_STORE);
  const matchingPapers = papers.filter((paper) =>
    normalizeLibraryPaperGroup(paper.group).toLowerCase() === normalizedOldGroup.toLowerCase()
  );
  if (!matchingPapers.length) {
    return [];
  }

  const now = Date.now();
  const groupTone = resolveRenamedLibraryPaperGroupTone(normalizedOldGroup, normalizedNewGroup, papers);
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  matchingPapers.forEach((paper) => {
    store.put({
      ...paper,
      updatedAt: now,
      group: normalizedNewGroup,
      groupTone
    });
  });
  await transactionDone(transaction);
  return matchingPapers.map((paper) => paper.documentKey).filter(Boolean);
}

export async function deleteLibraryPaperGroup(group) {
  const normalizedGroup = normalizeLibraryPaperGroup(group);
  if (!normalizedGroup) {
    return [];
  }

  const db = await openPaperDatabase();
  const papers = await getAllFromStore(db, PAPER_STORE);
  const matchingPapers = papers.filter((paper) =>
    normalizeLibraryPaperGroup(paper.group).toLowerCase() === normalizedGroup.toLowerCase()
  );
  if (!matchingPapers.length) {
    return [];
  }

  const now = Date.now();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  matchingPapers.forEach((paper) => {
    store.put({
      ...paper,
      updatedAt: now,
      group: "",
      groupTone: null
    });
  });
  await transactionDone(transaction);
  return matchingPapers.map((paper) => paper.documentKey).filter(Boolean);
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

function selectBestDocumentForSummary(documents) {
  return [...(documents || [])]
    .filter((document) => document?.documentKey)
    .sort((left, right) => {
      const leftHasMarkdown = left.markdown ? 1 : 0;
      const rightHasMarkdown = right.markdown ? 1 : 0;
      if (leftHasMarkdown !== rightHasMarkdown) {
        return rightHasMarkdown - leftHasMarkdown;
      }

      return getTime(right.updatedAt) - getTime(left.updatedAt);
    })[0] || null;
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
    isStarred: Boolean(paper.isStarred),
    starredAt: getTime(paper.starredAt),
    group: normalizeLibraryPaperGroup(paper.group),
    groupTone: normalizeLibraryPaperGroupTone(paper.groupTone, paper.group)
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
    paper.domain,
    paper.group
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function compareLibraryPapers(left, right, options) {
  const direction = options.sortDirection === "asc" ? 1 : -1;
  const sortBy = options.sortBy || "latestThread";

  if (sortBy === "title") {
    return compareTitle(left, right) * (options.sortDirection === "desc" ? -1 : 1);
  }

  if (sortBy === "starred") {
    const starredComparison = compareBoolean(left.isStarred, right.isStarred);
    if (starredComparison) {
      return starredComparison * direction;
    }

    const latestComparison = compareNumber(left.lastThreadStartedAt || 0, right.lastThreadStartedAt || 0, "desc");
    return latestComparison || compareTitle(left, right);
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

  if (sortBy === "messageCount") {
    return paper.messageCount || 0;
  }

  return paper.lastThreadStartedAt || 0;
}

function compareTitle(left, right) {
  return String(left.title || "").localeCompare(String(right.title || ""), undefined, { sensitivity: "base" });
}

function compareBoolean(left, right) {
  if (Boolean(left) === Boolean(right)) {
    return 0;
  }

  return Boolean(left) ? 1 : -1;
}

function compareNumber(left, right, direction = "asc") {
  if (left === right) {
    return 0;
  }

  const multiplier = direction === "desc" ? -1 : 1;
  return (left > right ? 1 : -1) * multiplier;
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

function normalizeLibraryPaperGroup(group) {
  return String(group || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

function normalizeLibraryPaperGroupTone(tone, group = "") {
  const toneNumber = Number(tone);
  if (Number.isInteger(toneNumber) && toneNumber >= 0 && toneNumber < PAPER_GROUP_TONE_COUNT) {
    return toneNumber;
  }

  return normalizeLibraryPaperGroup(group) ? getStableGroupToneIndex(group) : null;
}

function resolveLibraryPaperGroupTone(group, papers) {
  const normalizedGroup = normalizeLibraryPaperGroup(group);
  const usedTones = new Set();

  for (const paper of papers || []) {
    const paperGroup = normalizeLibraryPaperGroup(paper.group);
    if (!paperGroup) {
      continue;
    }

    const paperTone = normalizeLibraryPaperGroupTone(paper.groupTone, paperGroup);
    if (paperGroup.toLowerCase() === normalizedGroup.toLowerCase()) {
      return paperTone;
    }
    if (paperTone !== null) {
      usedTones.add(paperTone);
    }
  }

  for (let tone = 0; tone < PAPER_GROUP_TONE_COUNT; tone += 1) {
    if (!usedTones.has(tone)) {
      return tone;
    }
  }

  return getStableGroupToneIndex(normalizedGroup);
}

function canCreateLibraryPaperGroup(group, papers) {
  const normalizedGroup = normalizeLibraryPaperGroup(group);
  if (!normalizedGroup) {
    return true;
  }

  const groups = getDistinctLibraryPaperGroups(papers);
  if (groups.some((existingGroup) => existingGroup.toLowerCase() === normalizedGroup.toLowerCase())) {
    return true;
  }

  return groups.length < PAPER_GROUP_TONE_COUNT;
}

function getDistinctLibraryPaperGroups(papers) {
  const groups = [];
  for (const paper of papers || []) {
    const group = normalizeLibraryPaperGroup(paper.group);
    if (!group || groups.some((existingGroup) => existingGroup.toLowerCase() === group.toLowerCase())) {
      continue;
    }
    groups.push(group);
  }
  return groups;
}

function resolveRenamedLibraryPaperGroupTone(oldGroup, newGroup, papers) {
  const normalizedOldGroup = normalizeLibraryPaperGroup(oldGroup);
  const normalizedNewGroup = normalizeLibraryPaperGroup(newGroup);
  const existingNewGroupPaper = (papers || []).find((paper) =>
    normalizeLibraryPaperGroup(paper.group).toLowerCase() === normalizedNewGroup.toLowerCase()
  );
  if (existingNewGroupPaper) {
    return normalizeLibraryPaperGroupTone(existingNewGroupPaper.groupTone, normalizedNewGroup);
  }

  const existingOldGroupPaper = (papers || []).find((paper) =>
    normalizeLibraryPaperGroup(paper.group).toLowerCase() === normalizedOldGroup.toLowerCase()
  );
  return normalizeLibraryPaperGroupTone(existingOldGroupPaper?.groupTone, normalizedOldGroup);
}

function getStableGroupToneIndex(group) {
  const text = normalizeLibraryPaperGroup(group).toLowerCase();
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % PAPER_GROUP_TONE_COUNT;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
