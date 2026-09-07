import {
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

const MAX_PAPER_NOTE_CHARS = 50000;

export async function getPaperUserNote(documentKey) {
  const key = normalizeDocumentKey(documentKey);
  if (!key) {
    return createEmptyPaperNote();
  }

  const db = await openPaperDatabase();
  const paper = await requestToPromise(
    db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(key)
  );

  return {
    text: normalizePaperUserNote(paper?.userNote),
    updatedAt: Number(paper?.userNoteUpdatedAt) || null
  };
}

export async function savePaperUserNote(documentKey, text) {
  const key = normalizeDocumentKey(documentKey);
  if (!key) {
    throw new Error("Paper note cannot be saved without a document key.");
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  const existing = await requestToPromise(store.get(key));
  const now = Date.now();
  const note = normalizePaperUserNote(text);
  store.put({
    ...(existing || {}),
    documentKey: key,
    canonicalUrl: existing?.canonicalUrl || "",
    title: existing?.title || "",
    titleSource: existing?.titleSource || "",
    metadata: existing?.metadata || null,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    activeThreadId: existing?.activeThreadId || "",
    userNote: note,
    userNoteUpdatedAt: now
  });
  await transactionDone(transaction);

  return {
    text: note,
    updatedAt: now
  };
}

export function normalizePaperUserNote(text) {
  return String(text || "")
    .replace(/\r\n?/g, "\n")
    .slice(0, MAX_PAPER_NOTE_CHARS);
}

function normalizeDocumentKey(documentKey) {
  return String(documentKey || "").trim();
}

function createEmptyPaperNote() {
  return {
    text: "",
    updatedAt: null
  };
}
