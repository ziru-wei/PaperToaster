import * as pdfjsLib from "../../vendor/pdfjs/pdf.mjs";
import {
  flattenEmbeddedOutline,
  reconstructPdfTextLines,
  resolveDestinationPage,
  serializeDestination
} from "./outline-guided-core.js";

if (globalThis.chrome?.runtime?.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/pdfjs/pdf.worker.mjs");
}

export async function extractStructuredPdf(bytes, options = {}) {
  const source = toUint8Array(bytes);
  const loadingTask = pdfjsLib.getDocument({
    data: source.slice(),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  });
  const pdfDocument = await loadingTask.promise;

  try {
    const [outlineTree, metadata] = await Promise.all([
      pdfDocument.getOutline().catch(() => null),
      pdfDocument.getMetadata().catch(() => null)
    ]);
    const outline = flattenEmbeddedOutline(outlineTree || []);
    for (const entry of outline) {
      entry.resolvedPageIndex = await resolveDestinationPage(pdfDocument, entry.destination);
      entry.resolvedPage = entry.resolvedPageIndex == null ? null : entry.resolvedPageIndex + 1;
    }

    const pdfTextPages = [];
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const textContent = await page.getTextContent();
      const items = textContent.items
        .filter((item) => typeof item.str === "string" && item.str.trim())
        .map((item) => toPositionedTextItem(item, viewport.height));
      pdfTextPages.push({
        pageIndex: pageNumber - 1,
        width: viewport.width,
        height: viewport.height,
        lines: reconstructPdfTextLines(items, pageNumber - 1, viewport.width)
      });
      options.onProgress?.({
        stage: "extracting",
        detail: `PDF.js extracted structure from page ${pageNumber}/${pdfDocument.numPages}`,
        currentPage: pageNumber,
        totalPages: pdfDocument.numPages
      });
    }

    return {
      pageCount: pdfDocument.numPages,
      pdfFacts: {
        outlineAvailable: outline.length > 0,
        outline: outline.map((entry) => ({
          order: entry.order,
          title: entry.title,
          depth: entry.depth,
          destination: serializeDestination(entry.destination),
          resolvedPageIndex: entry.resolvedPageIndex,
          resolvedPage: entry.resolvedPage
        })),
        title: cleanMetadataValue(metadata?.info?.Title),
        author: cleanMetadataValue(metadata?.info?.Author)
      },
      pdfTextPages
    };
  } finally {
    await loadingTask.destroy().catch(() => {});
  }
}

function toPositionedTextItem(item, pageHeight) {
  const fontSize = Math.hypot(item.transform?.[2] || 0, item.transform?.[3] || 0)
    || Math.hypot(item.transform?.[0] || 0, item.transform?.[1] || 0)
    || Number(item.height)
    || 0;
  const x = Number(item.transform?.[4]) || 0;
  const baseline = Number(item.transform?.[5]) || 0;
  return {
    text: item.str.trim(),
    x,
    y: pageHeight - baseline - fontSize,
    baseline,
    width: Number(item.width) || 0,
    height: Number(item.height) || fontSize,
    fontSize,
    fontName: String(item.fontName || "unknown"),
    hasEOL: Boolean(item.hasEOL)
  };
}

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) return bytes;
  if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
  if (ArrayBuffer.isView(bytes)) {
    return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  throw new TypeError("PDF bytes must be an ArrayBuffer or typed array.");
}

function cleanMetadataValue(value) {
  const cleaned = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return cleaned && cleaned.toLowerCase() !== "untitled" ? cleaned : null;
}
