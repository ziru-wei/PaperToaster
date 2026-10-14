import {
  COMPARISON_MESSAGE_STORE,
  CONVERSATION_MESSAGE_STORE,
  PAPER_NOTE_STORE,
  openPaperDatabase,
  requestToPromise
} from "./paper-database.js";
import { PAPER_FIGURE_STATUS, listPaperFigures } from "./paper-figure-store.js";
import { listPaperMetadata } from "./paper-metadata-store.js";

const NOTE_PREVIEW_CHARS = 280;
// Note documents embed images as data URLs, so covers are cached per note
// revision and only changed notes are read again.
const noteCoverCache = new Map();

export async function listDashboardPaperPreviews({ includeCovers = false } = {}) {
  const db = await openPaperDatabase();
  const [savedAsks, notes, figures, metadata] = await Promise.all([
    listLatestSavedAsks(db),
    includeCovers ? listNotePreviews(db) : new Map(),
    includeCovers ? listPaperFigures() : new Map(),
    listPaperMetadata()
  ]);
  const previews = new Map();
  for (const documentKey of new Set([...savedAsks.keys(), ...notes.keys(), ...figures.keys(), ...metadata.keys()])) {
    previews.set(documentKey, createDashboardPaperPreview({
      savedAsk: savedAsks.get(documentKey)?.text || "",
      savedAskAt: savedAsks.get(documentKey)?.createdAt || 0,
      coverImage: notes.get(documentKey)?.coverImage || "",
      notePreview: notes.get(documentKey)?.notePreview || ""
    }, { figure: figures.get(documentKey), metadata: metadata.get(documentKey) }));
  }
  return previews;
}

// Merges a figure or metadata record into a preview; a key left out keeps the preview's value.
export function createDashboardPaperPreview(preview = {}, records = {}) {
  const next = {
    savedAsk: "",
    savedAskAt: 0,
    coverImage: "",
    notePreview: "",
    figure: null,
    figureImage: "",
    metadata: null,
    ...preview
  };
  if ("figure" in records) {
    next.figure = records.figure || null;
    next.figureImage = records.figure?.status === PAPER_FIGURE_STATUS.OK ? records.figure.dataUrl : "";
  }
  if ("metadata" in records) {
    next.metadata = records.metadata || null;
  }
  return next;
}

async function listLatestSavedAsks(db) {
  const savedRange = IDBKeyRange.lowerBound("", true);
  const [paperAnswers, comparisonAnswers] = await Promise.all([
    requestToPromise(db.transaction(CONVERSATION_MESSAGE_STORE, "readonly")
      .objectStore(CONVERSATION_MESSAGE_STORE).index("bySavedDocumentKey").getAll(savedRange)),
    requestToPromise(db.transaction(COMPARISON_MESSAGE_STORE, "readonly")
      .objectStore(COMPARISON_MESSAGE_STORE).index("bySavedDocumentKey").getAll(savedRange))
  ]);

  const latestByDocument = new Map();
  const consider = (documentKey, answer, source) => {
    const current = latestByDocument.get(documentKey);
    if (!current || getTime(answer.createdAt) > getTime(current.answer.createdAt)) {
      latestByDocument.set(documentKey, { answer, source });
    }
  };
  for (const answer of paperAnswers) {
    if (answer?.isSaved && answer.savedDocumentKey) consider(answer.savedDocumentKey, answer, "paper");
  }
  for (const answer of comparisonAnswers) {
    if (!answer?.isSaved) continue;
    for (const documentKey of answer.savedDocumentKeys || []) consider(documentKey, answer, "comparison");
  }

  const questionCache = new Map();
  const results = new Map();
  await Promise.all([...latestByDocument.entries()].map(async ([documentKey, { answer, source }]) => {
    const ownerId = source === "paper" ? answer.threadId : answer.comparisonId;
    const cacheKey = `${source}:${ownerId}:${answer.sequence}`;
    if (!questionCache.has(cacheKey)) {
      questionCache.set(cacheKey, findQuestionForAnswer(db, answer, source));
    }
    const text = await questionCache.get(cacheKey);
    if (text) results.set(documentKey, { text, createdAt: getTime(answer.createdAt) });
  }));
  return results;
}

async function findQuestionForAnswer(db, answer, source) {
  const storeName = source === "paper" ? CONVERSATION_MESSAGE_STORE : COMPARISON_MESSAGE_STORE;
  const indexName = source === "paper" ? "byThreadId" : "byComparisonId";
  const ownerId = source === "paper" ? answer.threadId : answer.comparisonId;
  if (!ownerId) return "";
  const messages = await requestToPromise(
    db.transaction(storeName, "readonly").objectStore(storeName).index(indexName).getAll(ownerId)
  );
  const sequence = Number(answer.sequence);
  const question = messages
    .filter((message) => message?.role === "user" && Number(message.sequence) < sequence)
    .sort((left, right) => Number(right.sequence) - Number(left.sequence))[0];
  return String(question?.text || "").replace(/\s+/g, " ").trim();
}

async function listNotePreviews(db) {
  const revisions = await listNoteRevisions(db);
  const store = db.transaction(PAPER_NOTE_STORE, "readonly").objectStore(PAPER_NOTE_STORE);
  const staleKeys = [...revisions.entries()]
    .filter(([documentKey, updatedAt]) => noteCoverCache.get(documentKey)?.updatedAt !== updatedAt)
    .map(([documentKey]) => documentKey);
  const staleNotes = await Promise.all(staleKeys.map((documentKey) => requestToPromise(store.get(documentKey))));
  staleNotes.forEach((note, index) => {
    noteCoverCache.set(staleKeys[index], {
      updatedAt: revisions.get(staleKeys[index]),
      ...extractNotePreview(note)
    });
  });
  for (const documentKey of noteCoverCache.keys()) {
    if (!revisions.has(documentKey)) noteCoverCache.delete(documentKey);
  }
  return noteCoverCache;
}

function listNoteRevisions(db) {
  return new Promise((resolve, reject) => {
    const revisions = new Map();
    const request = db.transaction(PAPER_NOTE_STORE, "readonly")
      .objectStore(PAPER_NOTE_STORE).index("byUpdatedAt").openKeyCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        resolve(revisions);
        return;
      }
      revisions.set(cursor.primaryKey, cursor.key);
      cursor.continue();
    };
    request.onerror = () => reject(request.error || new Error("Could not read note revisions."));
  });
}

function extractNotePreview(note) {
  let root = null;
  if (typeof note?.document === "string") {
    try {
      root = JSON.parse(note.document)?.root || null;
    } catch {
      root = null;
    }
  }
  return {
    coverImage: findFirstImageSource(root),
    notePreview: String(note?.plainText || "").replace(/\s+/g, " ").trim().slice(0, NOTE_PREVIEW_CHARS)
  };
}

function findFirstImageSource(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "image") {
    const src = String(node.src || "");
    return src.startsWith("data:image/") ? src : "";
  }
  for (const child of Array.isArray(node.children) ? node.children : []) {
    const src = findFirstImageSource(child);
    if (src) return src;
  }
  return "";
}

function getTime(value) {
  return Number(value) || 0;
}
