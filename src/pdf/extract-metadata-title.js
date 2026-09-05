import * as pdfjsLib from "../../vendor/pdfjs/pdf.mjs";
import { selectDocumentTitle } from "./select-title.js";

export async function extractPdfMetadataTitleFromBytes(bytes, options = {}) {
  const diagnose = options.onDiagnostic || (() => {});
  diagnose("Step 3E: reading PDF metadata title from fetched PDF bytes.");

  let loadingTask;
  let pdf;

  try {
    if (globalThis.chrome?.runtime?.getURL) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/pdfjs/pdf.worker.mjs");
    }

    loadingTask = pdfjsLib.getDocument({
      data: bytes.slice(0),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    pdf = await loadingTask.promise;

    const metadata = await pdf.getMetadata();
    const candidates = collectMetadataTitleCandidates(metadata);
    const selected = selectDocumentTitle(candidates);

    if (selected.title) {
      diagnose(`PDF metadata title selected: ${selected.title} (${selected.source})`);
    } else {
      diagnose("No usable PDF metadata title found.");
    }

    return {
      ...selected,
      rawMetadata: normalizeMetadataForStorage(metadata)
    };
  } catch (error) {
    diagnose(`PDF metadata title extraction failed: ${error.message || String(error)}`);
    return {
      title: "",
      source: "",
      candidates: [],
      rawMetadata: null,
      issue: {
        code: "pdf-metadata-title-failed",
        message: error.message || String(error)
      }
    };
  } finally {
    try {
      await pdf?.destroy?.();
    } catch {
      // Cleanup is best-effort.
    }

    try {
      await loadingTask?.destroy?.();
    } catch {
      // Cleanup is best-effort.
    }
  }
}

function collectMetadataTitleCandidates(metadata) {
  const candidates = [];
  const infoTitle = normalizeMetadataTitle(metadata?.info?.Title);

  if (infoTitle) {
    candidates.push({
      text: infoTitle,
      source: "pdf-info-title",
      score: 850
    });
  }

  for (const key of ["dc:title", "pdf:Title", "xmp:title", "title"]) {
    const title = normalizeMetadataTitle(readXmpMetadataValue(metadata?.metadata, key));
    if (!title) {
      continue;
    }

    candidates.push({
      text: title,
      source: `pdf-xmp-${key}`,
      score: 850
    });
  }

  return candidates;
}

function readXmpMetadataValue(metadata, key) {
  if (!metadata || typeof metadata.get !== "function") {
    return "";
  }

  try {
    return metadata.get(key) || "";
  } catch {
    return "";
  }
}

function normalizeMetadataTitle(value) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(normalizeMetadataTitle).filter(Boolean).join(" ");
  }

  if (typeof value === "object") {
    return normalizeMetadataTitle(value["#text"] || value.value || value.text || "");
  }

  return String(value)
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMetadataForStorage(metadata) {
  if (!metadata) {
    return null;
  }

  return {
    info: metadata.info || null,
    title: normalizeMetadataTitle(metadata.info?.Title)
  };
}
