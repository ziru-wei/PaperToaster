import * as pdfjsLib from "../../vendor/pdfjs/pdf.mjs";

if (globalThis.chrome?.runtime?.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/pdfjs/pdf.worker.mjs");
}

function normalizeText(text) {
  return text
    .replace(/-\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function parsePdf({ url, bytes }, options = {}) {
  const startTime = performance.now();
  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;

  try {
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = normalizeText(content.items.map((item) => item.str || "").join(" "));
      pages.push({ pageNumber, text });
      options.onProgress?.({
        stage: "extracting",
        detail: `PDF.js extracted page ${pageNumber}/${pdf.numPages}`,
        currentPage: pageNumber,
        totalPages: pdf.numPages
      });
    }

    return {
      url,
      pageCount: pdf.numPages,
      pages,
      stats: {
        processingMs: performance.now() - startTime
      }
    };
  } finally {
    try {
      await pdf.destroy();
    } catch {
      // Cleanup is best-effort.
    }
  }
}
