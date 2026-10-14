import { PAPER_FIGURE_STORE } from "./paper-database.js";
import { listPaperCacheRecords, putPaperCacheRecord } from "./paper-cache-store.js";

export const PAPER_FIGURE_STATUS = Object.freeze({
  OK: "ok",
  NONE: "none",
  FAILED: "failed"
});

// Bump when the extractor improves enough that old "none" results should be retried.
export const PAPER_FIGURE_EXTRACTOR_VERSION = 1;

export function listPaperFigures() {
  return listPaperCacheRecords(PAPER_FIGURE_STORE);
}

export async function savePaperFigure(documentKey, { status, dataUrl = "", page = 0, sourceUrl = "", error = "" }) {
  const key = String(documentKey || "").trim();
  if (!key) return null;
  return putPaperCacheRecord(PAPER_FIGURE_STORE, {
    documentKey: key,
    status,
    dataUrl: status === PAPER_FIGURE_STATUS.OK ? String(dataUrl || "") : "",
    page: Number(page) || 0,
    sourceUrl: String(sourceUrl || ""),
    error: String(error || "").slice(0, 300),
    extractorVersion: PAPER_FIGURE_EXTRACTOR_VERSION,
    updatedAt: Date.now()
  });
}
