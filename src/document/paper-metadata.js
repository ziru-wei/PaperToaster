import { fetchPaperMetadata } from "./fetch-paper-metadata.js";
import {
  PAPER_METADATA_STATUS,
  PAPER_METADATA_VERSION,
  savePaperMetadata
} from "../storage/paper-metadata-store.js";

const DAY_MS = 24 * 60 * 60 * 1000;
// Citation counts drift, so found metadata is refreshed now and then.
const REFRESH_AFTER_MS = {
  [PAPER_METADATA_STATUS.OK]: 14 * DAY_MS,
  [PAPER_METADATA_STATUS.NONE]: 7 * DAY_MS,
  [PAPER_METADATA_STATUS.FAILED]: DAY_MS
};

// A lookup that hit a rate limit on one API is retried within the hour.
const INCOMPLETE_RETRY_MS = 60 * 60 * 1000;

let lookupChain = Promise.resolve();
const queuedDocumentKeys = new Set();

// Looks up metadata for papers that have none (or stale), one at a time.
// `onMetadata(record)` is called after each stored result.
export function ensurePaperMetadata(papers, records, { onMetadata } = {}) {
  for (const paper of papers) {
    const key = paper?.documentKey;
    if (!key || queuedDocumentKeys.has(key) || !needsLookup(records.get(key))) continue;
    queuedDocumentKeys.add(key);
    lookupChain = lookupChain
      .then(() => lookUp(paper, records.get(key)))
      .then((record) => record && onMetadata?.(record))
      .catch((error) => console.debug("[Paper Toaster] Metadata lookup failed", key, error))
      .finally(() => queuedDocumentKeys.delete(key));
  }
}

function needsLookup(record) {
  if (!record || record.version !== PAPER_METADATA_VERSION) return true;
  const age = Date.now() - (Number(record.updatedAt) || 0);
  if (record.status === PAPER_METADATA_STATUS.OK && record.complete === false) return age > INCOMPLETE_RETRY_MS;
  return age > (REFRESH_AFTER_MS[record.status] ?? DAY_MS);
}

async function lookUp(paper, previous) {
  let metadata = null;
  let error = null;
  try {
    metadata = await fetchPaperMetadata({
      documentKey: paper.documentKey,
      canonicalUrl: paper.canonicalUrl,
      title: paper.title
    });
  } catch (lookupError) {
    error = lookupError;
  }
  if (metadata) {
    return savePaperMetadata(paper.documentKey, { status: PAPER_METADATA_STATUS.OK, metadata });
  }
  // A refresh that comes back empty keeps what was found before and tries again in a day.
  if (previous?.status === PAPER_METADATA_STATUS.OK && previous.version === PAPER_METADATA_VERSION) {
    return savePaperMetadata(paper.documentKey, {
      status: PAPER_METADATA_STATUS.OK,
      metadata: previous,
      updatedAt: Date.now() - REFRESH_AFTER_MS[PAPER_METADATA_STATUS.OK] + DAY_MS
    });
  }
  return savePaperMetadata(paper.documentKey, error
    ? { status: PAPER_METADATA_STATUS.FAILED, error: error.message || String(error) }
    : { status: PAPER_METADATA_STATUS.NONE });
}
