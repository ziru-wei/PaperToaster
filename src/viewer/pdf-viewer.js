import { getLocalPdfHashFromUrl } from "../storage/document-key.js";
import { readLocalPdfBytes } from "../document/local-pdf-import.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";

// Shows the library's saved copy of a local PDF in Chrome's own PDF viewer.
// The side panel treats this page like any other PDF tab.

const status = document.getElementById("viewerStatus");
const frame = document.getElementById("viewerFrame");

async function openSavedPdf() {
  const sha256 = getLocalPdfHashFromUrl(location.href);
  if (!sha256) {
    throw new Error("This link does not name a saved PDF.");
  }
  const [{ bytes, name }, paper] = await Promise.all([
    readLocalPdfBytes(sha256),
    getLibraryPaperSummary(`pdf:${sha256}`).catch(() => null)
  ]);
  document.title = paper?.title || name || "PDF";
  frame.src = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  frame.hidden = false;
  status.hidden = true;
}

openSavedPdf().catch((error) => {
  status.textContent = error.message || String(error);
});
