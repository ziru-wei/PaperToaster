import {
  COMPARISON_SESSION_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

export async function archiveLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const selection = normalizeSelection({ documentKeys, comparisonIds });
  if (!selection.documentKeys.length && !selection.comparisonIds.length) {
    return;
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction([PAPER_STORE, COMPARISON_SESSION_STORE], "readwrite");
  const paperStore = transaction.objectStore(PAPER_STORE);
  const comparisonStore = transaction.objectStore(COMPARISON_SESSION_STORE);
  const now = Date.now();

  const [papers, comparisons] = await Promise.all([
    Promise.all(selection.documentKeys.map((documentKey) => requestToPromise(paperStore.get(documentKey)))),
    Promise.all(selection.comparisonIds.map((comparisonId) => requestToPromise(comparisonStore.get(comparisonId))))
  ]);

  papers.filter(Boolean).forEach((paper) => paperStore.put({
    ...paper,
    archivedAt: now,
    isStarred: false,
    starredAt: null,
    updatedAt: now
  }));
  comparisons.filter(Boolean).forEach((comparison) => comparisonStore.put({
    ...comparison,
    archivedAt: now,
    isStarred: false,
    starredAt: null,
    updatedAt: now
  }));

  await transactionDone(transaction);
}

export async function restoreLibraryRecords({ documentKeys = [], comparisonIds = [] } = {}) {
  const selection = normalizeSelection({ documentKeys, comparisonIds });
  if (!selection.documentKeys.length && !selection.comparisonIds.length) {
    return;
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction([PAPER_STORE, COMPARISON_SESSION_STORE], "readwrite");
  const paperStore = transaction.objectStore(PAPER_STORE);
  const comparisonStore = transaction.objectStore(COMPARISON_SESSION_STORE);
  const now = Date.now();

  const [allPapers, papers, comparisons] = await Promise.all([
    requestToPromise(paperStore.getAll()),
    Promise.all(selection.documentKeys.map((documentKey) => requestToPromise(paperStore.get(documentKey)))),
    Promise.all(selection.comparisonIds.map((comparisonId) => requestToPromise(comparisonStore.get(comparisonId))))
  ]);
  const liveLabels = buildLiveLabelCatalog(allPapers);

  papers.filter(Boolean).forEach((paper) => {
    const group = normalizeLabel(paper.group);
    const liveLabel = group ? liveLabels.get(group.toLowerCase()) : null;
    paperStore.put({
      ...paper,
      archivedAt: null,
      isStarred: false,
      starredAt: null,
      group,
      groupTone: liveLabel ? liveLabel.groupTone : null,
      labelState: group && !liveLabel ? "dead" : "live",
      updatedAt: now
    });
  });
  comparisons.filter(Boolean).forEach((comparison) => comparisonStore.put({
    ...comparison,
    archivedAt: null,
    isStarred: false,
    starredAt: null,
    updatedAt: now
  }));

  await transactionDone(transaction);
}

function buildLiveLabelCatalog(papers) {
  const labels = new Map();
  for (const paper of papers || []) {
    const group = normalizeLabel(paper?.group);
    if (!group || normalizeArchivedAt(paper?.archivedAt) || paper?.labelState === "dead") {
      continue;
    }
    const key = group.toLowerCase();
    if (!labels.has(key)) {
      labels.set(key, { group, groupTone: normalizeTone(paper.groupTone) });
    }
  }
  return labels;
}

function normalizeSelection({ documentKeys, comparisonIds }) {
  return {
    documentKeys: normalizeIds(documentKeys),
    comparisonIds: normalizeIds(comparisonIds)
  };
}

function normalizeIds(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean))];
}

function normalizeLabel(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 64);
}

function normalizeTone(value) {
  const tone = Number(value);
  return Number.isInteger(tone) && tone >= 0 && tone < 5 ? tone : null;
}

function normalizeArchivedAt(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}
