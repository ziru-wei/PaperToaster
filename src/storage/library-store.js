import { getLocalPdfHashFromDocumentKey, getLocalPdfViewerUrl } from "./document-key.js";
import {
  DEFAULT_LABEL_COLUMN_ID,
  getPaperLabels,
  normalizeLabelName,
  withPaperLabels
} from "./label-columns.js";
import {
  CONVERSATION_THREAD_STORE,
  DOCUMENT_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

const PAPER_GROUP_TONE_COUNT = 5;
const MAX_PAPER_SHORT_NOTE_CHARS = 500;
export const LIBRARY_SCOPE_BOARD = "board";
export const LIBRARY_SCOPE_ARCHIVE = "archive";

export async function listLibraryPaperTitleUrlMappings(options = {}) {
  const scope = normalizeTitleUrlMappingScope(options.scope);
  const db = await openPaperDatabase();
  const [papers, documents] = await Promise.all([
    getAllFromStore(db, PAPER_STORE),
    getAllFromStore(db, DOCUMENT_STORE)
  ]);
  const documentsByKey = groupDocumentsByKey(documents);
  const papersByKey = new Map(papers
    .filter((paper) => paper?.documentKey)
    .map((paper) => [paper.documentKey, paper]));
  const documentKeys = new Set([...papersByKey.keys(), ...documentsByKey.keys()]);

  return [...documentKeys].flatMap((documentKey) => {
    const paper = papersByKey.get(documentKey);
    const document = documentsByKey.get(documentKey);
    if (!matchesTitleUrlMappingScope(paper, scope)) {
      return [];
    }
    const title = String(paper?.title || document?.title || "").trim();
    const url = String(paper?.canonicalUrl || document?.url || "").trim();
    return title && url ? [{ title, url }] : [];
  }).sort((left, right) => left.title.localeCompare(right.title, undefined, { sensitivity: "base" }));
}

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
    .filter((paper) => matchesLibraryScope(paper, options.view))
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

export async function filterActiveLibraryDocumentKeys(documentKeys = []) {
  const keys = [...new Set((Array.isArray(documentKeys) ? documentKeys : [])
    .map((key) => String(key || "").trim())
    .filter(Boolean))];
  if (!keys.length) {
    return [];
  }

  const db = await openPaperDatabase();
  const store = db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE);
  const papers = await Promise.all(keys.map((key) => requestToPromise(store.get(key))));
  return keys.filter((key, index) => papers[index] && !normalizeArchivedAt(papers[index].archivedAt));
}

export async function listLibraryPaperGroups(options = {}) {
  const db = await openPaperDatabase();
  const papers = await getAllFromStore(db, PAPER_STORE);
  return papers
    .filter((paper) => matchesRecordScope(paper, options.scope))
    .filter((paper) => options.scope === LIBRARY_SCOPE_ARCHIVE || normalizeLibraryPaperLabelState(paper.labelState) !== "dead")
    .map((paper) => ({
      documentKey: paper.documentKey,
      group: paper.group,
      groupTone: options.scope === LIBRARY_SCOPE_ARCHIVE ? null : paper.groupTone,
      labelState: normalizeLibraryPaperLabelState(paper.labelState),
      labels: collectPaperLabels(paper)
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
    isStarred: normalizeArchivedAt(existing?.archivedAt) ? false : Boolean(isStarred),
    starredAt: normalizeArchivedAt(existing?.archivedAt) || !isStarred ? null : now
  });
  await transactionDone(transaction);
}

export async function setLibraryPaperShortNote(documentKey, shortNote, fallback = {}) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return "";
  }

  const db = await openPaperDatabase();
  const now = Date.now();
  const normalizedShortNote = normalizePaperShortNote(shortNote);
  const existing = await requestToPromise(
    db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(normalizedDocumentKey)
  );
  if (normalizePaperShortNote(existing?.shortNote) === normalizedShortNote) {
    return normalizedShortNote;
  }

  const transaction = db.transaction(PAPER_STORE, "readwrite");
  transaction.objectStore(PAPER_STORE).put({
    ...(existing || {}),
    documentKey: normalizedDocumentKey,
    canonicalUrl: existing?.canonicalUrl || fallback.canonicalUrl || "",
    title: existing?.title || fallback.title || "",
    titleSource: existing?.titleSource || "",
    metadata: existing?.metadata || null,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    activeThreadId: existing?.activeThreadId || "",
    shortNote: normalizedShortNote,
    shortNoteUpdatedAt: now
  });
  await transactionDone(transaction);
  return normalizedShortNote;
}

export async function getLibraryPaperShortNote(documentKey) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return "";
  }

  const db = await openPaperDatabase();
  const paper = await requestToPromise(
    db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(normalizedDocumentKey)
  );
  return normalizePaperShortNote(paper?.shortNote);
}

export function normalizePaperShortNote(value) {
  return String(value || "")
    .replace(/[\r\n]+/g, " ")
    .slice(0, MAX_PAPER_SHORT_NOTE_CHARS);
}

// The original "Label" column, kept for callers that set a single label.
export function setLibraryPaperGroup(documentKey, group, fallback = {}) {
  return setLibraryPaperLabels(documentKey, DEFAULT_LABEL_COLUMN_ID, normalizeLibraryPaperGroup(group) ? [group] : [], fallback);
}

export function renameLibraryPaperGroup(oldGroup, newGroup, options = {}) {
  return renameLibraryPaperLabel(DEFAULT_LABEL_COLUMN_ID, oldGroup, newGroup, options);
}

export function deleteLibraryPaperGroup(group, options = {}) {
  return deleteLibraryPaperLabel(DEFAULT_LABEL_COLUMN_ID, group, options);
}

// Replaces a paper's labels in one column. There is no limit on how many labels exist.
export async function setLibraryPaperLabels(documentKey, columnId, labels, fallback = {}) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return;
  }
  const db = await openPaperDatabase();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  const existing = await requestToPromise(store.get(normalizedDocumentKey));
  const now = Date.now();
  store.put(withPaperLabels({
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
    archivedAt: normalizeArchivedAt(existing?.archivedAt)
  }, columnId, labels));
  await transactionDone(transaction);
}

// Renames a label on every paper in the scope that has it; renaming onto an
// existing label merges the two.
export async function renameLibraryPaperLabel(columnId, oldLabel, newLabel, options = {}) {
  const oldName = normalizeLabelName(oldLabel);
  const newName = normalizeLabelName(newLabel);
  if (!oldName) return [];
  if (!newName) return deleteLibraryPaperLabel(columnId, oldName, options);
  if (oldName === newName) return [];
  return updateLabelsInScope(columnId, oldName, options, (labels) => labels.map((label) => (
    label.toLowerCase() === oldName.toLowerCase() ? newName : label
  )));
}

export function deleteLibraryPaperLabel(columnId, label, options = {}) {
  const name = normalizeLabelName(label);
  if (!name) return Promise.resolve([]);
  return updateLabelsInScope(columnId, name, options, (labels) => labels.filter((item) => (
    item.toLowerCase() !== name.toLowerCase()
  )));
}

async function updateLabelsInScope(columnId, label, options, transform) {
  const db = await openPaperDatabase();
  const papers = await getAllFromStore(db, PAPER_STORE);
  const scope = normalizeLibraryScope(options.scope);
  const key = label.toLowerCase();
  const matching = papers.filter((paper) => (
    matchesRecordScope(paper, scope) &&
    getPaperLabels(paper, columnId).some((item) => item.toLowerCase() === key)
  ));
  if (!matching.length) return [];
  const now = Date.now();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  matching.forEach((paper) => {
    store.put({ ...withPaperLabels(paper, columnId, transform(getPaperLabels(paper, columnId))), updatedAt: now });
  });
  await transactionDone(transaction);
  return matching.map((paper) => paper.documentKey).filter(Boolean);
}

// Every label column's labels, including the original column's legacy `group`.
function collectPaperLabels(paper) {
  const labels = {};
  for (const columnId of Object.keys(paper?.labels || {})) {
    labels[columnId] = getPaperLabels(paper, columnId);
  }
  labels[DEFAULT_LABEL_COLUMN_ID] = getPaperLabels(paper, DEFAULT_LABEL_COLUMN_ID);
  return labels;
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
  // A saved local PDF opens in this device's viewer, whose extension ID can
  // differ from the device that imported it.
  const localPdfHash = getLocalPdfHashFromDocumentKey(paper.documentKey);
  const canonicalUrl = localPdfHash
    ? getLocalPdfViewerUrl(localPdfHash)
    : paper.canonicalUrl || document?.url || "";

  return {
    documentKey: paper.documentKey || document?.documentKey || "",
    title: paper.title || document?.title || "Untitled paper",
    citationShortName: paper.citationShortName || "",
    shortNote: normalizePaperShortNote(paper.shortNote).trim(),
    canonicalUrl,
    domain: getDomain(canonicalUrl),
    hasMarkdown: Boolean(document?.markdown),
    parserId: document?.parserId || "",
    parsedAt: getTime(document?.parsedAt),
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
    groupTone: normalizeLibraryPaperLabelState(paper.labelState) === "dead"
      ? null
      : normalizeLibraryPaperGroupTone(paper.groupTone, paper.group),
    labelState: normalizeLibraryPaperLabelState(paper.labelState),
    labels: collectPaperLabels(paper),
    archivedAt: normalizeArchivedAt(paper.archivedAt)
  };
}

function matchesLibraryScope(paper, view = LIBRARY_SCOPE_BOARD) {
  const archived = Boolean(normalizeArchivedAt(paper.archivedAt));
  return normalizeLibraryScope(view) === LIBRARY_SCOPE_ARCHIVE ? archived : !archived;
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
    paper.group,
    paper.shortNote
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function compareLibraryPapers(left, right, options) {
  if (normalizeLibraryScope(options.view) === LIBRARY_SCOPE_ARCHIVE) {
    const archivedComparison = compareNumber(left.archivedAt || 0, right.archivedAt || 0, "desc");
    return archivedComparison || compareTitle(left, right);
  }

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

  if (sortBy === "latestAdded") {
    return paper.parsedAt || 0;
  }

  if (sortBy === "messageCount") {
    return paper.messageCount || 0;
  }

  return paper.lastThreadStartedAt || 0;
}

function compareTitle(left, right) {
  return String(left.title || "").localeCompare(String(right.title || ""), undefined, { sensitivity: "base" });
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

function normalizeLibraryPaperLabelState(value) {
  return value === "dead" ? "dead" : "live";
}

function normalizeLibraryScope(scope) {
  return scope === LIBRARY_SCOPE_ARCHIVE ? LIBRARY_SCOPE_ARCHIVE : LIBRARY_SCOPE_BOARD;
}

function normalizeTitleUrlMappingScope(scope) {
  if (scope === LIBRARY_SCOPE_BOARD || scope === LIBRARY_SCOPE_ARCHIVE) {
    return scope;
  }
  return "all";
}

function matchesTitleUrlMappingScope(paper, scope) {
  if (scope === "all") {
    return true;
  }
  return matchesRecordScope(paper, scope);
}

function normalizeArchivedAt(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function matchesRecordScope(paper, scope) {
  const archived = Boolean(normalizeArchivedAt(paper?.archivedAt));
  return normalizeLibraryScope(scope) === LIBRARY_SCOPE_ARCHIVE ? archived : !archived;
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
