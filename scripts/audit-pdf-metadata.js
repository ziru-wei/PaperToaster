#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { extractCanonicalDocumentId, getDocumentMemoryKey } from "../src/storage/document-key.js";

const files = process.argv.slice(2);

if (!files.length) {
  console.error("Usage: node scripts/audit-pdf-metadata.js file1.pdf file2.pdf ...");
  process.exit(1);
}

const rows = [];

for (const file of files) {
  rows.push(await auditPdf(file));
}

console.log(JSON.stringify(rows, null, 2));

async function auditPdf(file) {
  const absolutePath = path.resolve(file);
  let loadingTask;
  let pdf;

  try {
    const bytes = await fs.readFile(absolutePath);
    loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(bytes),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    pdf = await loadingTask.promise;
    const metadata = await pdf.getMetadata();
    const xmp = collectXmp(metadata?.metadata);

    return {
      file: absolutePath,
      sizeBytes: bytes.byteLength,
      pageCount: pdf.numPages,
      memoryKeyFromFilename: getDocumentMemoryKey(path.basename(file)),
      canonicalIdFromFilename: extractCanonicalDocumentId(path.basename(file)),
      info: normalizeInfo(metadata?.info),
      xmp
    };
  } catch (error) {
    return {
      file: absolutePath,
      error: error.message || String(error)
    };
  } finally {
    await destroyPdf(pdf, loadingTask);
  }
}

function normalizeInfo(info = {}) {
  const output = {};
  for (const [key, value] of Object.entries(info || {})) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    output[key] = normalizeValue(value);
  }
  return output;
}

function collectXmp(metadata) {
  if (!metadata || typeof metadata.getAll !== "function") {
    return {};
  }

  const output = {};
  const all = metadata.getAll();
  for (const [key, value] of Object.entries(all || {})) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    output[key] = normalizeValue(value);
  }
  return output;
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, childValue]) => [key, normalizeValue(childValue)])
        .filter(([, childValue]) => childValue !== "")
    );
  }

  return String(value)
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function destroyPdf(pdf, loadingTask) {
  try {
    await pdf?.destroy?.();
  } catch {
    // Best-effort cleanup for local audit.
  }

  try {
    await loadingTask?.destroy?.();
  } catch {
    // Best-effort cleanup for local audit.
  }
}
