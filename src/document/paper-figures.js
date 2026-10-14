import { extractFirstFigureImage } from "../pdf/extract-first-figure.js";
import { fetchPdfBytes, isHttpUrl } from "../pdf/fetch-pdf.js";
import { getLocalPdfHashFromDocumentKey, getLocalPdfViewerUrl } from "../storage/document-key.js";
import { readLocalPdfBytes } from "./local-pdf-import.js";
import {
  PAPER_FIGURE_EXTRACTOR_VERSION,
  PAPER_FIGURE_STATUS,
  savePaperFigure
} from "../storage/paper-figure-store.js";

const FAILED_RETRY_MS = 24 * 60 * 60 * 1000;

let extractionChain = Promise.resolve();
const queuedDocumentKeys = new Set();

// Crops Figure 1 from PDF bytes that are already in hand and stores it as the
// paper's dashboard cover. Never throws; failures are recorded for retry.
export function extractAndSavePaperFigure({ documentKey, bytes, sourceUrl = "" }) {
  return enqueue(documentKey, async () => {
    try {
      const figure = await extractFirstFigureImage(bytes);
      return savePaperFigure(documentKey, figure
        ? { status: PAPER_FIGURE_STATUS.OK, dataUrl: figure.dataUrl, page: figure.page, sourceUrl }
        : { status: PAPER_FIGURE_STATUS.NONE, sourceUrl });
    } catch (error) {
      return recordFailure(documentKey, sourceUrl, error);
    }
  });
}

// Fetches and crops figures for papers that have none yet, one at a time.
// `onFigure(record)` is called after each stored result.
export function ensurePaperFigures(papers, figures, { onFigure } = {}) {
  for (const paper of papers) {
    if (!needsFigure(paper, figures.get(paper.documentKey))) continue;
    const localPdfHash = getLocalPdfHashFromDocumentKey(paper.documentKey);
    if (localPdfHash) {
      enqueue(paper.documentKey, () => extractFromLocalCopy(paper.documentKey, localPdfHash))
        .then((record) => record && onFigure?.(record));
      continue;
    }
    const urls = getPdfCandidateUrls(paper);
    if (!urls.length) continue;
    enqueue(paper.documentKey, () => fetchAndExtract(paper.documentKey, urls))
      .then((record) => record && onFigure?.(record));
  }
}

function needsFigure(paper, record) {
  if (!paper?.documentKey || queuedDocumentKeys.has(paper.documentKey)) return false;
  if (!record) return true;
  if (record.status === PAPER_FIGURE_STATUS.OK) return false;
  if (record.extractorVersion !== PAPER_FIGURE_EXTRACTOR_VERSION) return true;
  return record.status === PAPER_FIGURE_STATUS.FAILED && Date.now() - (Number(record.updatedAt) || 0) > FAILED_RETRY_MS;
}

function getPdfCandidateUrls(paper) {
  const urls = [];
  if (isHttpUrl(paper.canonicalUrl)) urls.push(paper.canonicalUrl);
  const arxivId = String(paper.documentKey).match(/^arxiv:(.+)$/)?.[1];
  if (arxivId) urls.push(`https://arxiv.org/pdf/${arxivId}`);
  return [...new Set(urls)];
}

async function fetchAndExtract(documentKey, urls) {
  let lastError = null;
  for (const url of urls) {
    let fetched;
    try {
      fetched = await fetchPdfBytes(url);
    } catch (error) {
      lastError = error;
      continue;
    }
    try {
      const figure = await extractFirstFigureImage(fetched.bytes);
      return savePaperFigure(documentKey, figure
        ? { status: PAPER_FIGURE_STATUS.OK, dataUrl: figure.dataUrl, page: figure.page, sourceUrl: url }
        : { status: PAPER_FIGURE_STATUS.NONE, sourceUrl: url });
    } catch (error) {
      return recordFailure(documentKey, url, error);
    }
  }
  return recordFailure(documentKey, urls[0], lastError);
}

async function extractFromLocalCopy(documentKey, sha256) {
  const sourceUrl = getLocalPdfViewerUrl(sha256);
  try {
    const { bytes } = await readLocalPdfBytes(sha256);
    const figure = await extractFirstFigureImage(bytes);
    return savePaperFigure(documentKey, figure
      ? { status: PAPER_FIGURE_STATUS.OK, dataUrl: figure.dataUrl, page: figure.page, sourceUrl }
      : { status: PAPER_FIGURE_STATUS.NONE, sourceUrl });
  } catch (error) {
    return recordFailure(documentKey, sourceUrl, error);
  }
}

function recordFailure(documentKey, sourceUrl, error) {
  console.debug("[Paper Toaster] Figure extraction failed", documentKey, error);
  return savePaperFigure(documentKey, {
    status: PAPER_FIGURE_STATUS.FAILED,
    sourceUrl,
    error: error?.message || String(error || "Unknown error")
  }).catch(() => null);
}

function enqueue(documentKey, task) {
  const key = String(documentKey || "").trim();
  if (!key) return Promise.resolve(null);
  queuedDocumentKeys.add(key);
  const run = extractionChain.then(task).catch((error) => {
    console.debug("[Paper Toaster] Figure task failed", key, error);
    return null;
  }).finally(() => queuedDocumentKeys.delete(key));
  extractionChain = run;
  return run;
}
