import {
  PAPER_NOTE_ASSET_STORE,
  PAPER_NOTE_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";
import { normalizePaperShortNote } from "./library-store.js";

const MAX_PAPER_NOTE_CHARS = 50000;
const NOTE_DOCUMENT_VERSION = 3;
const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function getPaperUserNote(documentKey) {
  const key = normalizeDocumentKey(documentKey);
  if (!key) return createEmptyPaperNote();

  const db = await openPaperDatabase();
  const transaction = db.transaction([PAPER_NOTE_STORE, PAPER_NOTE_ASSET_STORE, PAPER_STORE], "readonly");
  const noteRequest = transaction.objectStore(PAPER_NOTE_STORE).get(key);
  const paperRequest = transaction.objectStore(PAPER_STORE).get(key);
  const assetsRequest = transaction.objectStore(PAPER_NOTE_ASSET_STORE).index("byDocumentKey").getAll(key);
  const [storedNote, paper, storedAssets] = await Promise.all([
    requestToPromise(noteRequest), requestToPromise(paperRequest), requestToPromise(assetsRequest)
  ]);
  const assets = normalizePaperNoteAssets(storedAssets, key);
  const document = await normalizeLexicalEditorState(storedNote?.document || paper?.userNote || "", assets);
  const updatedAt = Number(storedNote?.updatedAt || paper?.userNoteUpdatedAt) || null;
  return {
    document, assets: [], text: getLexicalPlainText(document), updatedAt,
    shortNote: normalizePaperShortNote(paper?.shortNote)
  };
}

export async function savePaperUserNote(documentKey, noteDocument) {
  const key = normalizeDocumentKey(documentKey);
  if (!key) throw new Error("Paper note cannot be saved without a document key.");

  const db = await openPaperDatabase();
  const transaction = db.transaction([PAPER_NOTE_STORE, PAPER_NOTE_ASSET_STORE, PAPER_STORE], "readwrite");
  const noteStore = transaction.objectStore(PAPER_NOTE_STORE);
  const assetStore = transaction.objectStore(PAPER_NOTE_ASSET_STORE);
  const paperStore = transaction.objectStore(PAPER_STORE);
  const [existingPaper, existingNote, existingAssets] = await Promise.all([
    requestToPromise(paperStore.get(key)),
    requestToPromise(noteStore.get(key)),
    requestToPromise(assetStore.index("byDocumentKey").getAll(key))
  ]);
  const assets = normalizePaperNoteAssets(existingAssets, key);
  const document = await normalizeLexicalEditorState(noteDocument, assets);
  const plainText = getLexicalPlainText(document);
  const now = Date.now();

  noteStore.put({
    ...(existingNote || {}), documentKey: key, version: NOTE_DOCUMENT_VERSION,
    document, plainText, createdAt: existingNote?.createdAt || now, updatedAt: now
  });
  for (const asset of assets) {
    assetStore.delete(asset.assetId);
  }
  paperStore.put({
    ...(existingPaper || {}), documentKey: key,
    canonicalUrl: existingPaper?.canonicalUrl || "", title: existingPaper?.title || "",
    titleSource: existingPaper?.titleSource || "", metadata: existingPaper?.metadata || null,
    createdAt: existingPaper?.createdAt || now, updatedAt: now,
    activeThreadId: existingPaper?.activeThreadId || "",
    userNote: plainText, userNoteUpdatedAt: now
  });
  await transactionDone(transaction);
  return { document, text: plainText, updatedAt: now };
}

export function normalizePaperUserNote(text) {
  return String(text || "").replace(/\r\n?/g, "\n").slice(0, MAX_PAPER_NOTE_CHARS);
}

function normalizePaperNoteAssets(assets, documentKey) {
  return (Array.isArray(assets) ? assets : [])
    .filter((asset) => asset && asset.documentKey === documentKey && asset.blob instanceof Blob)
    .filter((asset) => IMAGE_MIME_TYPES.has(String(asset.mimeType || asset.blob.type || "").toLowerCase()))
    .map((asset) => ({
      ...asset, assetId: String(asset.assetId || "").trim(),
      mimeType: String(asset.mimeType || asset.blob.type || "").toLowerCase(),
      naturalWidth: Math.max(1, Number(asset.naturalWidth) || 1),
      naturalHeight: Math.max(1, Number(asset.naturalHeight) || 1)
    }))
    .filter((asset) => asset.assetId);
}

function createEmptyPaperNote() {
  const document = createLexicalEditorState([]);
  return { document, assets: [], text: "", updatedAt: null, shortNote: "" };
}

async function normalizeLexicalEditorState(value, assets = []) {
  if (typeof value === "string") {
    const source = value.trim();
    if (source.startsWith("{")) {
      try {
        const parsed = JSON.parse(source);
        if (parsed?.root?.type === "root" && Array.isArray(parsed.root.children)) {
          return JSON.stringify(parsed);
        }
      } catch {
        // Fall through to legacy plain-text conversion.
      }
    }
    return createLexicalEditorState(createLegacyTextNodes(value));
  }

  const assetMap = new Map(assets.map((asset) => [asset.assetId, asset]));
  const children = [];
  for (const block of Array.isArray(value?.blocks) ? value.blocks : []) {
    if (block?.type === "image") {
      const asset = assetMap.get(String(block.assetId || ""));
      if (!asset?.blob) continue;
      const src = await blobToDataUrl(asset.blob);
      const ratio = clamp(Number(block.widthRatio), 0.15, 1, 0.72);
      const width = Math.min(480, Math.max(1, asset.naturalWidth * ratio));
      children.push({
        type: "image",
        version: 1,
        src,
        width,
        height: width / (asset.naturalWidth / Math.max(1, asset.naturalHeight))
      });
      continue;
    }
    children.push(...createLegacyTextNodes(block?.text || ""));
  }
  return createLexicalEditorState(children);
}

function createLexicalEditorState(children) {
  const normalizedChildren = children.length ? children : [createLexicalParagraph("")];
  return JSON.stringify({
    root: {
      children: normalizedChildren,
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  });
}

function createLegacyTextNodes(text) {
  return normalizePaperUserNote(text).split("\n").map(createLexicalParagraph);
}

function createLexicalParagraph(text) {
  return {
    children: text ? [{
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
      text,
      type: "text",
      version: 1
    }] : [],
    direction: null,
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
    textFormat: 0,
    textStyle: ""
  };
}

function getLexicalPlainText(editorStateJSON) {
  try {
    const root = JSON.parse(editorStateJSON)?.root;
    return collectLexicalText(root).slice(0, MAX_PAPER_NOTE_CHARS);
  } catch {
    return "";
  }
}

function collectLexicalText(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") return String(node.text || "");
  if (!Array.isArray(node.children)) return "";
  const separator = node.type === "root" || node.type === "list" ? "\n" : "";
  return node.children.map(collectLexicalText).filter(Boolean).join(separator);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("The stored note image could not be read."));
    reader.readAsDataURL(blob);
  });
}

function normalizeDocumentKey(documentKey) {
  return String(documentKey || "").trim();
}

function clamp(value, min, max, fallback) {
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback;
}
