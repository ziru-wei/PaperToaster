import { getLocalPdfViewerUrl } from "./document-key.js";
import {
  LOCAL_PDF_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

// Local PDFs are copied into the extension, so a moved or deleted original
// never loses the paper. Copies are keyed by content hash: importing the same
// file twice keeps one copy, and every device names it the same way.

export async function hashPdfBytes(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", toArrayBuffer(bytes));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hasPdfHeader(bytes) {
  const head = new Uint8Array(toArrayBuffer(bytes).slice(0, 1024));
  const text = String.fromCharCode(...head);
  return text.includes("%PDF-");
}

// Saves a copy (if not already saved) and resolves to its hash.
export async function saveLocalPdf(bytes, { name = "" } = {}) {
  if (!hasPdfHeader(bytes)) {
    throw new Error("This file is not a PDF.");
  }
  const sha256 = await hashPdfBytes(bytes);
  const db = await openPaperDatabase();
  const existing = await requestToPromise(
    db.transaction(LOCAL_PDF_STORE, "readonly").objectStore(LOCAL_PDF_STORE).get(sha256)
  );
  if (!existing) {
    await putLocalPdfRecord({
      sha256,
      blob: new Blob([toArrayBuffer(bytes)], { type: "application/pdf" }),
      name: String(name || "").slice(0, 300),
      size: toArrayBuffer(bytes).byteLength,
      createdAt: Date.now()
    });
  }
  return sha256;
}

// Stores a copy fetched from sync or a backup; the hash must match its bytes.
export async function restoreLocalPdf({ sha256, blob, name = "", createdAt = Date.now() }) {
  const bytes = await blob.arrayBuffer();
  if (await hashPdfBytes(bytes) !== sha256) {
    throw new Error("A synced PDF did not match its checksum.");
  }
  await putLocalPdfRecord({
    sha256,
    blob: new Blob([bytes], { type: "application/pdf" }),
    name: String(name || "").slice(0, 300),
    size: bytes.byteLength,
    createdAt
  });
}

async function putLocalPdfRecord(record) {
  const db = await openPaperDatabase();
  const transaction = db.transaction(LOCAL_PDF_STORE, "readwrite");
  transaction.objectStore(LOCAL_PDF_STORE).put(record);
  // transactionDone also schedules a sync, which uploads the new copy.
  await transactionDone(transaction);
}

export async function getLocalPdf(sha256) {
  const db = await openPaperDatabase();
  return (await requestToPromise(
    db.transaction(LOCAL_PDF_STORE, "readonly").objectStore(LOCAL_PDF_STORE).get(String(sha256 || ""))
  )) || null;
}

export async function listLocalPdfs() {
  const db = await openPaperDatabase();
  return requestToPromise(db.transaction(LOCAL_PDF_STORE, "readonly").objectStore(LOCAL_PDF_STORE).getAll());
}

export async function listLocalPdfHashes() {
  const db = await openPaperDatabase();
  return new Set(await requestToPromise(
    db.transaction(LOCAL_PDF_STORE, "readonly").objectStore(LOCAL_PDF_STORE).getAllKeys()
  ));
}

// Adds an imported PDF to the library before it is parsed, titled after its
// file name; parsing later replaces the title with the paper's own.
export async function ensureLocalPdfPaper({ sha256, name = "" }) {
  const documentKey = `pdf:${sha256}`;
  const db = await openPaperDatabase();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  const store = transaction.objectStore(PAPER_STORE);
  const existing = await requestToPromise(store.get(documentKey));
  if (!existing) {
    const now = Date.now();
    store.put({
      documentKey,
      canonicalUrl: getLocalPdfViewerUrl(sha256),
      title: getTitleFromFileName(name),
      titleSource: "file-name",
      createdAt: now,
      updatedAt: now,
      activeThreadId: ""
    });
  }
  await transactionDone(transaction);
  return documentKey;
}

export function getTitleFromFileName(name) {
  return String(name || "").replace(/\.pdf$/i, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim() || "Untitled PDF";
}

function toArrayBuffer(bytes) {
  if (bytes instanceof ArrayBuffer) return bytes;
  if (ArrayBuffer.isView(bytes)) return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  throw new Error("PDF bytes must be an ArrayBuffer or typed array.");
}
