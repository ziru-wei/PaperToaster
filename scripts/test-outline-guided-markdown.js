import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import initLiteParse, { LiteParse } from "@llamaindex/liteparse-wasm";

const require = createRequire(import.meta.url);
const defaultInputDir = path.join(os.homedir(), "Downloads", "test pdf parser");
const inputDir = path.resolve(process.argv[2] || defaultInputDir);
const outputRoot = path.resolve(
  process.argv[3] || "test-results/outline-guided-markdown"
);

await initializeLiteParse();
const parser = new LiteParse({
  ocrEnabled: false,
  outputFormat: "markdown",
  extractBlocks: true,
  extractLinks: false
});

const pdfNames = (await fs.readdir(inputDir))
  .filter((name) => name.toLowerCase().endsWith(".pdf"))
  .sort((left, right) => left.localeCompare(right));

for (const pdfName of pdfNames) {
  const pdfPath = path.join(inputDir, pdfName);
  const resultDir = path.join(outputRoot, path.parse(pdfName).name);
  await fs.mkdir(resultDir, { recursive: true });

  try {
    const bytes = new Uint8Array(await fs.readFile(pdfPath));
    const pdfData = await readPdfOutline(bytes.slice());
    const liteParseResult = await parser.parse(bytes.slice());
    const blocks = collectBlocks(liteParseResult.pages);
    const matches = matchOutlineToBlocks(pdfData.outline, blocks);
    const title = choosePaperTitle(pdfData.title, blocks, pdfName);
    const markdown = buildOutlineGuidedMarkdown(
      liteParseResult.pages,
      matches,
      title,
      blocks,
      pdfData.outline.length > 0,
      liteParseResult.text
    );

    await Promise.all([
      writeJson(path.join(resultDir, "outline.json"), pdfData.outline),
      writeJson(path.join(resultDir, "debug.json"), {
        pdf: pdfName,
        outlineAvailable: pdfData.outline.length > 0,
        note: pdfData.outline.length ? null : "No PDF outline was available.",
        matches: matches.map(toDebugMatch)
      }),
      fs.writeFile(path.join(resultDir, "output.md"), markdown, "utf8")
    ]);

    console.log(`${pdfName}: ok (${pdfData.outline.length} outline entries)`);
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    await Promise.all([
      writeJson(path.join(resultDir, "outline.json"), []),
      writeJson(path.join(resultDir, "debug.json"), { pdf: pdfName, error: message }),
      fs.writeFile(path.join(resultDir, "output.md"), "", "utf8")
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

async function readPdfOutline(bytes) {
  const loadingTask = getDocument({ data: bytes, disableWorker: true });
  const pdfDocument = await loadingTask.promise;

  try {
    const [tree, metadata] = await Promise.all([
      pdfDocument.getOutline(),
      pdfDocument.getMetadata().catch(() => null)
    ]);
    const flattened = flattenOutline(tree || []);

    for (const entry of flattened) {
      entry.resolvedPageIndex = await resolveDestinationPage(pdfDocument, entry.destination);
      entry.resolvedPage = entry.resolvedPageIndex == null
        ? null
        : entry.resolvedPageIndex + 1;
    }

    return {
      title: cleanTitle(metadata?.info?.Title),
      outline: flattened.map((entry) => ({
        order: entry.order,
        title: entry.title,
        depth: entry.depth,
        destination: serializeDestination(entry.destination),
        resolvedPageIndex: entry.resolvedPageIndex,
        resolvedPage: entry.resolvedPage
      }))
    };
  } finally {
    await loadingTask.destroy().catch(() => {});
  }
}

function flattenOutline(items, depth = 0, output = []) {
  for (const item of items) {
    output.push({
      order: output.length,
      title: String(item.title || "").trim(),
      depth,
      destination: item.dest ?? null
    });
    flattenOutline(item.items || [], depth + 1, output);
  }
  return output;
}

async function resolveDestinationPage(pdfDocument, destination) {
  try {
    const explicitDestination = typeof destination === "string"
      ? await pdfDocument.getDestination(destination)
      : destination;
    const target = Array.isArray(explicitDestination) ? explicitDestination[0] : null;

    if (Number.isInteger(target)) {
      return target;
    }
    if (target && typeof target === "object") {
      return await pdfDocument.getPageIndex(target);
    }
  } catch {
    return null;
  }
  return null;
}

function serializeDestination(destination) {
  if (destination == null || typeof destination === "string") {
    return destination ?? null;
  }
  if (!Array.isArray(destination)) {
    return String(destination);
  }
  return destination.map((part) => {
    if (part && typeof part === "object" && Number.isInteger(part.num)) {
      return { num: part.num, gen: part.gen || 0 };
    }
    if (part && typeof part === "object" && typeof part.name === "string") {
      return { name: part.name };
    }
    return part ?? null;
  });
}

function collectBlocks(pages = []) {
  return pages.flatMap((page, pageOffset) => (page.blocks || []).map((block, blockIndex) => ({
    page: Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1,
    pageIndex: (Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1) - 1,
    blockIndex,
    kind: block.kind,
    text: getBlockText(block),
    bbox: block.bbox || null
  }))).filter((block) => block.text);
}

function getBlockText(block) {
  if (typeof block.text === "string") {
    return block.text.trim();
  }
  if (Array.isArray(block.lines)) {
    return block.lines.join("\n").trim();
  }
  return "";
}

function matchOutlineToBlocks(outline, blocks) {
  const usedBlocks = new Set();

  return outline.map((entry) => {
    const match = findBestBlockMatch(entry, blocks, usedBlocks);
    if (match.block) {
      usedBlocks.add(blockKey(match.block));
    }
    return {
      ...entry,
      matchedBlock: match.block,
      matchType: match.type,
      finalMarkdownHeadingLevel: match.block ? Math.min(entry.depth + 2, 6) : null
    };
  });
}

function findBestBlockMatch(entry, blocks, usedBlocks) {
  const target = normalizeHeading(entry.title);
  if (!target) {
    return { block: null, type: "unresolved" };
  }

  const available = blocks.filter((block) => !usedBlocks.has(blockKey(block)));
  const samePage = entry.resolvedPageIndex == null
    ? []
    : available.filter((block) => block.pageIndex === entry.resolvedPageIndex);
  const nearbyPages = entry.resolvedPageIndex == null
    ? []
    : available.filter((block) => Math.abs(block.pageIndex - entry.resolvedPageIndex) === 1);
  const groups = [samePage, nearbyPages, available];

  for (const candidates of groups) {
    const exact = candidates.find((block) => normalizeHeading(block.text) === target);
    if (exact) {
      return { block: exact, type: "exact" };
    }
  }

  for (const candidates of groups) {
    const fuzzy = candidates
      .map((block) => ({ block, score: headingSimilarity(target, normalizeHeading(block.text)) }))
      .filter(({ block, score }) => isPlausibleFuzzyMatch(target, block.text, score))
      .sort((left, right) => right.score - left.score)[0];
    if (fuzzy) {
      return { block: fuzzy.block, type: "fuzzy" };
    }
  }

  return { block: null, type: "unresolved" };
}

function normalizeHeading(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^(?:section\s+)?(?:\d+(?:\.\d+)*|[ivxlcdm]+|[a-z])(?:\s*[.):\]-]\s*|\s+)/i, "")
    .replace(/[*_`]/g, "")
    .trim();
}

function headingSimilarity(left, right) {
  if (!left || !right) {
    return 0;
  }
  const maxLength = Math.max(left.length, right.length);
  return maxLength ? 1 - levenshteinDistance(left, right) / maxLength : 1;
}

function isPlausibleFuzzyMatch(target, blockText, score) {
  const candidate = normalizeHeading(blockText);
  if (!candidate || score < 0.82) {
    return false;
  }
  const lengthRatio = Math.min(target.length, candidate.length) / Math.max(target.length, candidate.length);
  return lengthRatio >= 0.72;
}

function levenshteinDistance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function buildOutlineGuidedMarkdown(pages, matches, title, blocks, outlineAvailable, rawMarkdown) {
  if (!outlineAvailable) {
    return rawMarkdown;
  }

  const rewrites = new Map();
  for (const match of matches) {
    if (!match.matchedBlock) {
      continue;
    }
    rewrites.set(blockKey(match.matchedBlock), {
      title: match.title,
      level: match.finalMarkdownHeadingLevel
    });
  }

  const titleBlock = findTitleBlock(title, blocks);
  if (titleBlock) {
    rewrites.set(blockKey(titleBlock), { title, level: 1 });
  }

  for (const block of blocks) {
    if (block.kind === "heading" && !rewrites.has(blockKey(block))) {
      rewrites.set(blockKey(block), { title: null, level: 0 });
    }
  }

  const pageMarkdown = pages.map((page, pageOffset) => rewritePageMarkdown(
    page.markdown || "",
    Number.isInteger(page.pageNum) ? page.pageNum - 1 : pageOffset,
    page.blocks || [],
    rewrites
  ));
  const body = pageMarkdown.join("\n\n").trim();
  return titleBlock ? `${body}\n` : `# ${title}\n\n${body}\n`;
}

function rewritePageMarkdown(markdown, pageIndex, pageBlocks, rewrites) {
  const lines = markdown.split("\n");
  const claimedLines = new Set();

  pageBlocks.forEach((block, blockIndex) => {
    const rewrite = rewrites.get(`${pageIndex}:${blockIndex}`);
    if (!rewrite) {
      return;
    }
    const blockText = getBlockText(block);
    const lineIndex = findMarkdownLine(lines, blockText, claimedLines);
    if (lineIndex >= 0) {
      lines[lineIndex] = rewrite.level === 0
        ? lines[lineIndex].replace(/^(\s{0,3})#{1,6}\s+/, "$1")
        : `${"#".repeat(rewrite.level)} ${rewrite.title}`;
      claimedLines.add(lineIndex);
    }
  });

  if (pageIndex === 0) {
    promoteAbstractHeading(lines);
  }

  return lines.join("\n").trim();
}

function promoteAbstractHeading(lines) {
  const limit = Math.min(lines.length, 80);

  for (let index = 0; index < limit; index += 1) {
    const line = lines[index];
    const wrappedRunIn = line.match(/^\s*(\*{1,3}|_{1,3})Abstract\s*:\s*(.*?)\1\s*$/i);
    if (wrappedRunIn) {
      lines.splice(index, 1, "## Abstract", "", `${wrappedRunIn[1]}${wrappedRunIn[2]}${wrappedRunIn[1]}`);
      return;
    }

    const labeledRunIn = line.match(/^\s*(\*{1,3}|_{1,3})Abstract\s*:\s*\1\s*(.+)$/i);
    if (labeledRunIn) {
      lines.splice(index, 1, "## Abstract", "", labeledRunIn[2]);
      return;
    }

    if (normalizeHeading(stripMarkdownLineSyntax(line).replace(/:\s*$/, "")) === "abstract") {
      lines[index] = "## Abstract";
      return;
    }
  }
}

function findMarkdownLine(lines, blockText, claimedLines) {
  const target = normalizeHeading(blockText);
  let best = { index: -1, score: 0 };

  lines.forEach((line, index) => {
    if (claimedLines.has(index)) {
      return;
    }
    const candidate = normalizeHeading(stripMarkdownLineSyntax(line));
    if (candidate === target) {
      best = { index, score: 1 };
      return;
    }
    const score = headingSimilarity(target, candidate);
    if (score > best.score && score >= 0.9) {
      best = { index, score };
    }
  });
  return best.index;
}

function stripMarkdownLineSyntax(line) {
  return line
    .replace(/^\s{0,3}#{1,6}\s+/, "")
    .replace(/^\s*(?:[-*+] |\d+[.)] )/, "")
    .replace(/[*_`]/g, "")
    .trim();
}

function choosePaperTitle(metadataTitle, blocks, pdfName) {
  if (metadataTitle) {
    return metadataTitle;
  }
  const firstHeading = blocks.find((block) => block.kind === "heading" && block.pageIndex <= 1);
  return firstHeading?.text || path.parse(pdfName).name;
}

function findTitleBlock(title, blocks) {
  const target = normalizeHeading(title);
  return blocks
    .filter((block) => block.pageIndex <= 1)
    .map((block) => ({ block, score: headingSimilarity(target, normalizeHeading(block.text)) }))
    .filter(({ block, score }) => normalizeHeading(block.text) === target || score >= 0.9)
    .sort((left, right) => right.score - left.score)[0]?.block || null;
}

function cleanTitle(value) {
  const title = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return title && title.toLowerCase() !== "untitled" ? title : null;
}

function blockKey(block) {
  return `${block.pageIndex}:${block.blockIndex}`;
}

function toDebugMatch(match) {
  return {
    outlineTitle: match.title,
    outlineDepth: match.depth,
    resolvedPage: match.resolvedPage,
    matchedBlockText: match.matchedBlock?.text || null,
    matchedBlockPage: match.matchedBlock?.page || null,
    matchedBlockBbox: match.matchedBlock?.bbox || null,
    matchType: match.matchType,
    finalMarkdownHeadingLevel: match.finalMarkdownHeadingLevel
  };
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
