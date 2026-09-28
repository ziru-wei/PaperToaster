import path from "node:path";
import { createHash } from "node:crypto";
import {
  chmod,
  mkdir,
  mkdtemp,
  lstat,
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import { hashText } from "./local-agent-session-store.js";

const DOCUMENT_REF_PATTERN = /^sha256-[a-f0-9]{64}$/;
const CITATION_ID_PATTERN = /^p\d+-h\d+-c\d+$/;

export function getManagedRoots(agentWorkdir) {
  const root = path.resolve(agentWorkdir, ".paper-toaster");
  return {
    root,
    documents: path.join(root, "documents"),
    // Paper files a thread/comparison hands to Codex live here for as long as
    // the bridge process runs (see materializeThreadDocuments below), rather
    // than a fresh per-request directory: a stable path across turns lets
    // Codex recognize it already read this file's content earlier in the
    // resumed conversation instead of re-ingesting the whole paper every ask.
    threads: path.join(root, "threads")
  };
}

export function validateDocumentRef(documentRef) {
  const value = String(documentRef || "");
  if (!DOCUMENT_REF_PATTERN.test(value)) {
    throw createStoreError("Invalid document reference.", 400);
  }
  return value;
}

export function computeMarkdownDocumentRef(markdown) {
  return `sha256-${createHash("sha256").update(String(markdown || ""), "utf8").digest("hex")}`;
}

export async function getManagedDocumentStatus(agentWorkdir, documentRef, options = {}) {
  const ref = validateDocumentRef(documentRef);
  const paths = getDocumentPaths(agentWorkdir, ref);
  try {
    const [markdown, spansText, manifestText] = await Promise.all([
      readFile(paths.markdown, "utf8"),
      readFile(paths.spans, "utf8"),
      readFile(paths.manifest, "utf8")
    ]);
    const spansRecord = JSON.parse(spansText);
    const manifest = JSON.parse(manifestText);
    validateStoredDocument({ ref, markdown, spansRecord, manifest });
    if (options.touch !== false) {
      await writeJsonFile(paths.manifest, { ...manifest, lastAccessedAt: new Date().toISOString() });
    }
    return { exists: true, ref, paths, markdown, spans: spansRecord.spans, manifest };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { exists: false, ref, paths };
    }
    if (error?.status) {
      throw error;
    }
    throw createStoreError(`Managed document is inconsistent: ${error.message || error}`, 409);
  }
}

export async function putManagedDocument({ agentWorkdir, documentRef, markdown, sourceSpans }) {
  const ref = validateDocumentRef(documentRef);
  const text = String(markdown || "");
  if (computeMarkdownDocumentRef(text) !== ref) {
    throw createStoreError("Document reference does not match Markdown content.", 409);
  }
  const spans = normalizeAndValidateSourceSpans(sourceSpans, text.length);
  const existing = await getManagedDocumentStatus(agentWorkdir, ref, { touch: true });
  if (existing.exists) {
    return { created: false, ref, paths: existing.paths };
  }

  const roots = getManagedRoots(agentWorkdir);
  await ensurePrivateDirectory(roots.root);
  await ensurePrivateDirectory(roots.documents);
  const temporaryDirectory = await mkdtemp(path.join(roots.documents, ".upload-"));
  const finalPaths = getDocumentPaths(agentWorkdir, ref);
  try {
    await chmod(temporaryDirectory, 0o700);
    const now = new Date().toISOString();
    await Promise.all([
      writePrivateFile(path.join(temporaryDirectory, "paper.md"), text),
      writeJsonFile(path.join(temporaryDirectory, "spans.json"), { version: 1, spans }),
      writeJsonFile(path.join(temporaryDirectory, "manifest.json"), {
        version: 1,
        documentRef: ref,
        contentSha256: ref.slice("sha256-".length),
        markdownBytes: Buffer.byteLength(text, "utf8"),
        sourceSpanCount: spans.length,
        createdAt: now,
        lastAccessedAt: now
      })
    ]);
    try {
      await rename(temporaryDirectory, finalPaths.directory);
    } catch (error) {
      if (error?.code !== "EEXIST" && error?.code !== "ENOTEMPTY") {
        throw error;
      }
      await rm(temporaryDirectory, { recursive: true, force: true });
      const raced = await getManagedDocumentStatus(agentWorkdir, ref, { touch: true });
      if (!raced.exists) {
        throw error;
      }
      return { created: false, ref, paths: raced.paths };
    }
    return { created: true, ref, paths: finalPaths };
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
}

export async function deleteManagedDocument(agentWorkdir, documentRef) {
  const ref = validateDocumentRef(documentRef);
  await rm(getDocumentPaths(agentWorkdir, ref).directory, { recursive: true, force: true });
}

function getThreadDirectory(agentWorkdir, mode, conversationKey) {
  const key = hashText(`${mode}\0${conversationKey}`);
  return path.join(getManagedRoots(agentWorkdir).threads, key);
}

// Materializes each paper's annotated Markdown at a path that stays the same
// across every ask for this (mode, conversationKey) for as long as the bridge
// process keeps running (reset on startup by resetThreadDocumentsRoot, and
// removed early on explicit thread/comparison deletion by
// removeThreadDocuments). The annotated content is deterministic given the
// stored document + citation map, so overwriting the same path in place is
// safe even when content changes across a paper re-parse or documentKey swap.
export async function materializeThreadDocuments({ agentWorkdir, mode, conversationKey, papers }) {
  const roots = getManagedRoots(agentWorkdir);
  await ensurePrivateDirectory(roots.root);
  await ensurePrivateDirectory(roots.threads);
  const threadDirectory = getThreadDirectory(agentWorkdir, mode, conversationKey);
  await ensurePrivateDirectory(threadDirectory);
  const files = [];

  for (const [index, paper] of (papers || []).entries()) {
    const stored = await getManagedDocumentStatus(agentWorkdir, paper?.documentRef, { touch: true });
    if (!stored.exists) {
      throw createStoreError(`Managed document ${paper?.documentRef || ""} was not found.`, 404);
    }
    const citations = validateCitationMap(paper, stored.spans);
    const annotated = annotateMarkdown(stored.markdown, stored.spans, citations);
    const paperId = String(paper?.paperId || `p${index + 1}`);
    const filename = `${paperId}--${slugifyTitle(paper?.title)}.annotated.md`;
    const absolutePath = path.join(threadDirectory, filename);
    await writePrivateFile(absolutePath, annotated);
    files.push({
      paperId,
      title: String(paper?.title || "Untitled paper"),
      absolutePath,
      relativePath: path.relative(path.resolve(agentWorkdir), absolutePath)
    });
  }
  return { threadDirectory, files };
}

export async function removeThreadDocuments(agentWorkdir, mode, conversationKey) {
  await rm(getThreadDirectory(agentWorkdir, mode, conversationKey), { recursive: true, force: true });
}

// Called once at bridge startup: gives each new bridge run (approximating a
// fresh browser session) a clean slate instead of keeping thread-scoped paper
// copies indefinitely across restarts.
export async function resetThreadDocumentsRoot(agentWorkdir) {
  await rm(getManagedRoots(agentWorkdir).threads, { recursive: true, force: true });
}

function getDocumentPaths(agentWorkdir, ref) {
  const directory = path.join(getManagedRoots(agentWorkdir).documents, ref);
  return {
    directory,
    markdown: path.join(directory, "paper.md"),
    spans: path.join(directory, "spans.json"),
    manifest: path.join(directory, "manifest.json")
  };
}

function normalizeAndValidateSourceSpans(sourceSpans, markdownLength) {
  const spans = (Array.isArray(sourceSpans) ? sourceSpans : []).map((span) => ({
    id: String(span?.id || ""),
    index: Number(span?.index),
    markdownStart: Number(span?.markdownStart),
    markdownEnd: Number(span?.markdownEnd),
    sectionTitle: String(span?.section?.title || span?.sectionTitle || "")
  }));
  if (!spans.length && markdownLength > 0) {
    throw createStoreError("Source spans are required for non-empty Markdown.", 400);
  }
  const ids = new Set();
  let cursor = 0;
  spans.forEach((span, index) => {
    if (!span.id || ids.has(span.id)) throw createStoreError("Source span IDs must be unique.", 400);
    if (!Number.isInteger(span.index) || span.index <= 0 || (index && span.index <= spans[index - 1].index)) {
      throw createStoreError("Source span indexes must be strictly increasing positive integers.", 400);
    }
    if (!Number.isInteger(span.markdownStart) || !Number.isInteger(span.markdownEnd)
      || span.markdownStart !== cursor || span.markdownEnd <= span.markdownStart
      || span.markdownEnd > markdownLength) {
      throw createStoreError("Source spans must continuously cover the Markdown.", 400);
    }
    ids.add(span.id);
    cursor = span.markdownEnd;
  });
  if (cursor !== markdownLength) throw createStoreError("Source spans must cover the complete Markdown.", 400);
  return spans;
}

function validateStoredDocument({ ref, markdown, spansRecord, manifest }) {
  if (manifest?.version !== 1 || manifest.documentRef !== ref
    || manifest.contentSha256 !== ref.slice("sha256-".length)
    || spansRecord?.version !== 1 || computeMarkdownDocumentRef(markdown) !== ref) {
    throw createStoreError("Managed document manifest does not match its content.", 409);
  }
  const spans = normalizeAndValidateSourceSpans(spansRecord?.spans, markdown.length);
  if (manifest.sourceSpanCount !== spans.length || manifest.markdownBytes !== Buffer.byteLength(markdown, "utf8")) {
    throw createStoreError("Managed document manifest sizes do not match its content.", 409);
  }
}

function validateCitationMap(paper, spans) {
  const paperId = String(paper?.paperId || "");
  if (!/^p\d+$/.test(paperId)) throw createStoreError("Invalid citation paper ID.", 400);
  const entries = Array.isArray(paper?.sourceSpanCitations) ? paper.sourceSpanCitations : [];
  if (entries.length !== spans.length) throw createStoreError("Citation map must cover every source span.", 400);
  const bySpan = new Map();
  for (const entry of entries) {
    const spanId = String(entry?.sourceSpanId || "");
    const citationId = String(entry?.citationId || "");
    if (bySpan.has(spanId) || !CITATION_ID_PATTERN.test(citationId) || !citationId.startsWith(`${paperId}-`)) {
      throw createStoreError("Invalid source-span citation map.", 400);
    }
    bySpan.set(spanId, citationId);
  }
  if (spans.some((span) => !bySpan.has(span.id))) throw createStoreError("Citation map references do not match source spans.", 400);
  return bySpan;
}

function annotateMarkdown(markdown, spans, citations) {
  return spans.map((span) => {
    const attributes = [
      `citation_id="${citations.get(span.id)}"`,
      `chunk_index="${span.index}"`,
      span.sectionTitle ? `section="${escapeAttribute(span.sectionTitle)}"` : ""
    ].filter(Boolean).join(" ");
    return `<source ${attributes}>${markdown.slice(span.markdownStart, span.markdownEnd)}</source>`;
  }).join("");
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugifyTitle(value) {
  return String(value || "paper").normalize("NFKD").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "paper";
}

async function ensurePrivateDirectory(directory) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await chmod(directory, 0o700);
}

async function writePrivateFile(filename, content) {
  await writeFile(filename, content, { encoding: "utf8", mode: 0o600 });
  await chmod(filename, 0o600);
}

function writeJsonFile(filename, value) {
  return writePrivateFile(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function createStoreError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}
