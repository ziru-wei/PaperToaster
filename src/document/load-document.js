import { acquirePdfBytesFromTab } from "../pdf/acquire-pdf.js";
import { extractRawMarkdownHeadingTitle } from "../pdf/extract-markdown-title.js";
import { extractPdfMetadataTitleFromBytes } from "../pdf/extract-metadata-title.js";
import { extractRenderedTextContentFromTab } from "../pdf/extract-rendered-text.js";
import { isHttpUrl, looksLikePdfUrl } from "../pdf/fetch-pdf.js";
import { createEmptyTitleInfo, selectTitleInfoByPriority } from "../pdf/select-title.js";
import { parsePdfToContent } from "../parsers/parser-registry.js";
import { getDocumentStoreKey, getStoredDocument, saveStoredDocument } from "../storage/document-store.js";
import { createDocument } from "./create-document.js";
import { createAgentDocumentRef } from "../ai/local-agent-document-client.js";

const documentMemoryCache = new Map();
const activeLoadKeys = new Set();

export function canLoadDocumentFromTab(tab) {
  return isPotentialPaperViewerUrl(tab?.url);
}

export function getDocumentCacheKey(url, parserId, cacheVersion) {
  return getDocumentStoreKey({ url, parserId, cacheVersion });
}

export async function getCachedDocumentForUrl({ url, parserId, cacheVersion, onDiagnostic }) {
  const cacheKey = getDocumentCacheKey(url, parserId, cacheVersion);

  if (documentMemoryCache.has(cacheKey)) {
    return documentMemoryCache.get(cacheKey);
  }

  let document = null;
  try {
    document = await getStoredDocument({
      url,
      parserId,
      cacheVersion
    });
  } catch (error) {
    onDiagnostic?.(`Local document store read skipped: ${error.message || String(error)}`);
  }

  if (isUsableCachedDocument(document, parserId)) {
    documentMemoryCache.set(cacheKey, document);
    return document;
  }

  return null;
}

export async function saveDocumentForUrl({ url, parserId, cacheVersion, document }) {
  const cacheKey = getDocumentCacheKey(url, parserId, cacheVersion);
  const storedDocument = await saveStoredDocument({
    url,
    parserId,
    cacheVersion,
    document
  });
  documentMemoryCache.set(cacheKey, storedDocument);
  return storedDocument;
}

export async function loadDocumentForTab({
  tab,
  parserId,
  cacheVersion,
  bypassCache = false,
  onDiagnostic,
  onTitleInfo
}) {
  const diagnose = onDiagnostic || (() => {});

  if (!canLoadDocumentFromTab(tab)) {
    diagnose("Load skipped: active tab URL is not an http/https page.");
    return {
      document: null,
      loadedFromCache: false,
      skipped: true
    };
  }

  const cacheKey = getDocumentCacheKey(tab.url, parserId, cacheVersion);
  if (activeLoadKeys.has(cacheKey)) {
    return {
      document: null,
      loadedFromCache: false,
      skipped: true
    };
  }

  if (!bypassCache) {
    const cached = await getCachedDocumentForUrl({
      url: tab.url,
      parserId,
      cacheVersion,
      onDiagnostic: diagnose
    });
    if (cached) {
      return {
        document: cached,
        loadedFromCache: true,
        skipped: false
      };
    }
  }

  activeLoadKeys.add(cacheKey);

  try {
    let titleInfo = createEmptyTitleInfo();
    onTitleInfo?.(titleInfo);

    diagnose(bypassCache
      ? "Step 2: bypassing local document store for explicit reload."
      : "Step 2: no local document found; loading and storing this PDF.");

    let fetched;
    let content;
    let primaryError = null;

    try {
      const parsed = await fetchParseAndTitleDocument({
        tab,
        parserId,
        diagnose,
        onTitleInfo
      });
      fetched = parsed.fetched;
      content = parsed.content;
      titleInfo = parsed.titleInfo;
    } catch (error) {
      primaryError = error;
      diagnose(`PDF byte acquisition/parsing failed: ${error.message || String(error)}`);
      try {
        content = await extractRenderedTextContentFromTab(tab, {
          onDiagnostic: diagnose
        });
      } catch (fallbackError) {
        throw new Error([
          "Primary PDF fetch/parse failed:",
          primaryError.message || String(primaryError),
          "",
          "Rendered-text fallback also failed:",
          fallbackError.message || String(fallbackError)
        ].join("\n"));
      }
      fetched = {
        byteLength: null,
        contentType: "rendered-viewer-text"
      };
      diagnose(`${content.parserLabel} produced ${content.pageCount} rendered text groups.`);
    }

    diagnose("Step 5: extracting text and building citation source spans.");
    const document = createDocument({
      url: tab.url,
      fetched,
      content,
      titleInfo
    });
    document.agentDocumentRef = await createAgentDocumentRef(document.markdown);
    const extractedChars = document.pages.reduce((total, page) => total + page.text.length, 0);
    diagnose(`Extracted ${extractedChars.toLocaleString()} text characters into ${document.sourceSpans.length} citation source spans.`);

    for (const warning of document.warnings) {
      diagnose(`${warning.severity}: ${warning.message}`);
    }

    if (!document.pages.some((page) => page.text)) {
      throw new Error("No text could be extracted. This may be a scanned/image-only PDF.");
    }

    diagnose("Step 6: saving title, URL, and cleaned document text to local document store.");
    try {
      const storedDocument = await saveDocumentForUrl({
        url: tab.url,
        parserId,
        cacheVersion,
        document
      });
      diagnose("Local document store saved.");
      return {
        document: storedDocument,
        loadedFromCache: false,
        skipped: false
      };
    } catch (error) {
      diagnose(`Local document store skipped: ${error.message || String(error)}`);
      return {
        document,
        loadedFromCache: false,
        skipped: false
      };
    }
  } finally {
    activeLoadKeys.delete(cacheKey);
  }
}

async function fetchParseAndTitleDocument({ tab, parserId, diagnose, onTitleInfo }) {
  const fetched = await acquirePdfBytesFromTab(tab, {
    onDiagnostic: diagnose
  });
  diagnose([
    `Fetch ok: HTTP ${fetched.status}`,
    `content-type=${fetched.contentType || "unknown"}`,
    `bytes=${fetched.byteLength}`,
    `pdf-header=${fetched.hasPdfHeader ? "yes" : "no"}`
  ].join(", "));
  if (fetched.finalUrl && fetched.finalUrl !== tab.url) {
    diagnose(`Redirected to: ${fetched.finalUrl}`);
  }

  const metadataTitleInfo = await extractPdfMetadataTitleFromBytes(fetched.bytes, {
    onDiagnostic: diagnose
  });
  let titleInfo = selectTitleInfoByPriority(metadataTitleInfo);
  onTitleInfo?.(titleInfo);

  diagnose(`Step 4: parsing PDF with parser "${parserId}".`);
  const content = await parsePdfToContent({
    url: tab.url,
    bytes: fetched.bytes
  }, {
    parserId,
    documentTitle: metadataTitleInfo.title,
    onProgress: (progress) => diagnose(progress.detail || progress.stage)
  });
  diagnose(`${content.parserLabel} produced ${content.pageCount} pages as ${content.outputKind}.`);

  const markdownTitleInfo = extractRawMarkdownHeadingTitle(content.rawMarkdown, {
    onDiagnostic: diagnose
  });
  titleInfo = selectTitleInfoByPriority(metadataTitleInfo, markdownTitleInfo);
  onTitleInfo?.(titleInfo);

  return {
    fetched,
    content,
    titleInfo
  };
}

function isUsableCachedDocument(document, parserId) {
  if (!document || !isCompatibleCachedParser(document.parser?.id, parserId)) {
    return false;
  }

  if (!Array.isArray(document.pages) || !document.pages.some((page) => page.text?.trim())) {
    return false;
  }

  return Boolean(document.markdown?.trim() || document.pages.some((page) => page.text?.trim()));
}

function isCompatibleCachedParser(cachedParserId, requestedParserId) {
  return cachedParserId === requestedParserId;
}

function isPotentialPaperViewerUrl(url) {
  if (!isHttpUrl(url)) {
    return false;
  }

  if (looksLikePdfUrl(url)) {
    return true;
  }

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    return (
      hostname === "ieeexplore.ieee.org" &&
      pathname === "/stamp/stamp.jsp" &&
      parsed.searchParams.has("arnumber")
    );
  } catch {
    return false;
  }
}
