import { PAPER_METADATA_STORE } from "./paper-database.js";
import { listPaperCacheRecords, putPaperCacheRecord } from "./paper-cache-store.js";

export const PAPER_METADATA_STATUS = Object.freeze({
  OK: "ok",
  NONE: "none",
  FAILED: "failed"
});

// Bump when lookups change enough that stored results should be fetched again.
export const PAPER_METADATA_VERSION = 1;

export function listPaperMetadata() {
  return listPaperCacheRecords(PAPER_METADATA_STORE);
}

export async function savePaperMetadata(documentKey, { status, metadata = null, error = "", updatedAt = Date.now() }) {
  const key = String(documentKey || "").trim();
  if (!key) return null;
  const year = Number(metadata?.year);
  const citationCount = Number(metadata?.citationCount);
  return putPaperCacheRecord(PAPER_METADATA_STORE, {
    documentKey: key,
    status,
    authors: Array.isArray(metadata?.authors) ? metadata.authors.map(String).filter(Boolean) : [],
    year: Number.isInteger(year) && year > 0 ? year : null,
    venue: String(metadata?.venue || ""),
    citationCount: Number.isFinite(citationCount) && citationCount >= 0 ? citationCount : null,
    doi: String(metadata?.doi || ""),
    source: String(metadata?.source || ""),
    complete: metadata?.complete !== false,
    error: String(error || "").slice(0, 300),
    version: PAPER_METADATA_VERSION,
    updatedAt
  });
}
