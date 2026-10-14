import { extractAndSavePaperFigure } from "./paper-figures.js";
import { getLocalPdfViewerUrl } from "../storage/document-key.js";
import { ensureLocalPdfPaper, getLocalPdf, saveLocalPdf } from "../storage/local-pdf-store.js";

// Copies a PDF into the library. Resolves to { sha256, documentKey, viewerUrl,
// figure }, where `figure` settles with the cover figure record once cropped.
export async function importLocalPdf(bytes, { name = "" } = {}) {
  const sha256 = await saveLocalPdf(bytes, { name });
  const documentKey = await ensureLocalPdfPaper({ sha256, name });
  // The cover figure is cropped while the bytes are in hand.
  const figure = extractAndSavePaperFigure({ documentKey, bytes, sourceUrl: getLocalPdfViewerUrl(sha256) });
  return { sha256, documentKey, viewerUrl: getLocalPdfViewerUrl(sha256), figure };
}

export async function importLocalPdfFile(file) {
  return importLocalPdf(await file.arrayBuffer(), { name: file.name });
}

// A PDF opened from disk (file://) is read once and copied; Chrome only lets
// the extension read it when "Allow access to file URLs" is on.
export async function importLocalPdfFromFileUrl(url) {
  let bytes;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    bytes = await response.arrayBuffer();
  } catch {
    throw new Error([
      "Paper Toaster cannot read files on this computer yet.",
      "Turn on \"Allow access to file URLs\" for Paper Toaster in chrome://extensions,",
      "or drag the PDF onto the Paper Toaster dashboard."
    ].join(" "));
  }
  const name = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
  return importLocalPdf(bytes, { name });
}

// Reads a saved copy, asking sync to download it first when another device
// imported the PDF and it is not on this one yet.
export async function readLocalPdfBytes(sha256) {
  let record = await getLocalPdf(sha256);
  if (!record) {
    const response = await chrome.runtime.sendMessage({ type: "GOOGLE_SYNC_FETCH_PDF", sha256 }).catch(() => null);
    if (response?.error) throw new Error(response.error);
    record = await getLocalPdf(sha256);
  }
  if (!record?.blob) {
    throw new Error("This PDF's saved copy is not on this device yet. Connect Google sync on the device that imported it.");
  }
  return { bytes: await record.blob.arrayBuffer(), name: record.name || "" };
}
