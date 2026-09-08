import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import initLiteParse, { LiteParse } from "@llamaindex/liteparse-wasm";
import {
  buildOutlineGuidedArtifacts as buildSharedOutlineGuidedArtifacts,
  flattenEmbeddedOutline as flattenSharedEmbeddedOutline,
  reconstructPdfTextLines as reconstructSharedPdfTextLines,
  resolveDestinationPage as resolveSharedDestinationPage,
  serializeDestination as serializeSharedDestination
} from "../src/pdf/outline-guided-core.js";

const require = createRequire(import.meta.url);
const inputDir = path.resolve(
  process.argv[2] || path.join(os.homedir(), "Downloads", "test pdf parser")
);
const outputDir = path.resolve(process.argv[3] || "test-results/inferred-outline");

await initializeLiteParse();
await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const parser = new LiteParse({
  ocrEnabled: false,
  outputFormat: "markdown",
  extractBlocks: true,
  extractLinks: false,
  extractTextMetadata: true
});

const pdfNames = (await fs.readdir(inputDir))
  .filter((name) => name.toLowerCase().endsWith(".pdf"))
  .sort((left, right) => left.localeCompare(right));

for (const pdfName of pdfNames) {
  const resultDir = path.join(outputDir, path.parse(pdfName).name);
  const outlinePath = path.join(resultDir, "outline.json");
  const debugPath = path.join(resultDir, "debug.json");
  const markdownPath = path.join(resultDir, "output.md");
  await fs.mkdir(resultDir, { recursive: true });

  try {
    const bytes = new Uint8Array(await fs.readFile(path.join(inputDir, pdfName)));
    const pdfFacts = await readPdfFacts(bytes.slice());
    const parsed = await parser.parse(bytes.slice());
    const pdfTextLines = pdfFacts.outlineAvailable ? [] : await readPdfTextLines(bytes.slice());
    const result = buildSharedOutlineGuidedArtifacts({
      parsed,
      pdfFacts,
      pdfTextPages: pdfTextLines,
      pdfName
    });
    await Promise.all([
      writeJson(outlinePath, result.outlineArtifact),
      writeJson(debugPath, result.debugArtifact),
      fs.writeFile(markdownPath, result.markdown, "utf8")
    ]);
    console.log(`${pdfName}: ${result.outlineType} ${result.matches.length} items`);
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    await Promise.all([
      writeJson(outlinePath, { outlineType: "error", outline: [] }),
      writeJson(debugPath, { pdf: pdfName, error: message }),
      fs.writeFile(markdownPath, "", "utf8")
    ]);
    console.error(`${pdfName}: failed: ${message}`);
  }
}

parser.free();

async function initializeLiteParse() {
  const packageJson = require.resolve("@llamaindex/liteparse-wasm/package.json");
  const wasmPath = path.join(path.dirname(packageJson), "pkg", "liteparse_wasm_bg.wasm");
  await initLiteParse({ module_or_path: await fs.readFile(wasmPath) });
}

async function readPdfFacts(bytes) {
  const loadingTask = getDocument({ data: bytes, disableWorker: true });
  const pdfDocument = await loadingTask.promise;
  try {
    const [outlineTree, metadata] = await Promise.all([
      pdfDocument.getOutline(),
      pdfDocument.getMetadata().catch(() => null)
    ]);
    const outline = flattenSharedEmbeddedOutline(outlineTree || []);
    for (const entry of outline) {
      entry.resolvedPageIndex = await resolveSharedDestinationPage(pdfDocument, entry.destination);
      entry.resolvedPage = entry.resolvedPageIndex == null ? null : entry.resolvedPageIndex + 1;
    }
    return {
      outlineAvailable: outline.length > 0,
      outline: outline.map((entry) => ({
        order: entry.order,
        title: entry.title,
        depth: entry.depth,
        destination: serializeSharedDestination(entry.destination),
        resolvedPageIndex: entry.resolvedPageIndex,
        resolvedPage: entry.resolvedPage
      })),
      title: cleanMetadataValue(metadata?.info?.Title),
      author: cleanMetadataValue(metadata?.info?.Author)
    };
  } finally {
    await loadingTask.destroy().catch(() => {});
  }
}

async function readPdfTextLines(bytes) {
  const loadingTask = getDocument({ data: bytes, disableWorker: true });
  const pdfDocument = await loadingTask.promise;
  const pages = [];
  try {
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const textContent = await page.getTextContent();
      const items = textContent.items
        .filter((item) => typeof item.str === "string" && item.str.trim())
        .map((item) => {
          const fontSize = Math.hypot(item.transform?.[2] || 0, item.transform?.[3] || 0)
            || Math.hypot(item.transform?.[0] || 0, item.transform?.[1] || 0)
            || Number(item.height)
            || 0;
          const x = Number(item.transform?.[4]) || 0;
          const baseline = Number(item.transform?.[5]) || 0;
          const y = viewport.height - baseline - fontSize;
          return {
            text: item.str.trim(),
            x,
            y,
            baseline,
            width: Number(item.width) || 0,
            height: Number(item.height) || fontSize,
            fontSize,
            fontName: String(item.fontName || "unknown"),
            hasEOL: Boolean(item.hasEOL)
          };
        });
      pages.push({
        pageIndex: pageNumber - 1,
        width: viewport.width,
        height: viewport.height,
        lines: reconstructSharedPdfTextLines(items, pageNumber - 1, viewport.width)
      });
    }
    return pages;
  } finally {
    await loadingTask.destroy().catch(() => {});
  }
}

function cleanMetadataValue(value) {
  const cleaned = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return cleaned && cleaned.toLowerCase() !== "untitled" ? cleaned : null;
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
