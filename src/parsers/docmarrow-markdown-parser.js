import { cleanMarkdownForReading, resolveCleanupProfile } from "../markdown/clean-markdown.js";

export const docmarrowMarkdownParser = Object.freeze({
  id: "docmarrow-markdown",
  label: "DocMarrow Markdown",
  outputKind: "markdown",
  description: "Layout-aware Markdown parser for larger PDFs using DocMarrow.",

  async parse({ url, bytes }, options = {}) {
    options.onProgress?.({
      stage: "parsing",
      detail: "DocMarrow Markdown extraction started."
    });

    const { parseDocument } = await import("../../vendor/docmarrow/docmarrow.mjs");
    const parsed = await parseDocument(new Uint8Array(bytes), {
      format: "pdf",
      readingOrder: true,
      tables: true,
      dropHeadersFooters: true
    });

    const rawMarkdown = parsed.markdown || "";
    const cleanupProfile = resolveCleanupProfile(rawMarkdown, { url });
    const cleanupOptions = { url, cleanupProfile: cleanupProfile.id };
    const markdown = cleanMarkdownForReading(rawMarkdown, cleanupOptions);
    const chunks = normalizeChunks(parsed, cleanupOptions);

    options.onProgress?.({
      stage: "parsing",
      detail: `DocMarrow extracted ${parsed.meta?.pageCount || 1} pages.`
    });

    return {
      parserId: this.id,
      parserLabel: this.label,
      outputKind: this.outputKind,
      pageCount: parsed.meta?.pageCount || 1,
      pages: blocksToPages(parsed.pages || [], markdown),
      markdown,
      rawMarkdown,
      chunks: chunks.length ? chunks : null,
      metadata: {
        ...(parsed.meta || {}),
        cleanupProfile: cleanupProfile.id
      },
      warnings: (parsed.meta?.warnings || []).map((message) => ({
        code: "docmarrow_warning",
        severity: "warning",
        message
      })),
      stats: {
        pageCount: parsed.meta?.pageCount || 1,
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        processingMs: null
      }
    };
  }
});

function normalizeChunks(parsed, cleanupOptions) {
  if (typeof parsed.chunks !== "function") {
    return [];
  }

  return parsed.chunks({
    maxTokens: 800,
    overlap: 80
  }).map((chunk, index) => {
    const pages = Array.isArray(chunk.pages) && chunk.pages.length ? chunk.pages : [1];
    return {
      id: `docmarrow-chunk-${index + 1}`,
      pageStart: Math.min(...pages),
      pageEnd: Math.max(...pages),
      markdown: cleanMarkdownForReading(chunk.text || "", cleanupOptions)
    };
  }).filter((chunk) => chunk.markdown.trim());
}

function blocksToPages(pages, markdown) {
  if (!Array.isArray(pages) || !pages.length) {
    return markdown ? [{ pageNumber: 1, text: markdown }] : [];
  }

  return pages.map((blocks, index) => ({
    pageNumber: index + 1,
    text: blocksToText(Array.isArray(blocks) ? blocks : [])
  })).filter((page) => page.text.trim());
}

function blocksToText(blocks) {
  return blocks.map((block) => {
    if (typeof block?.text === "string") {
      return block.text;
    }

    if (block?.type === "table" && Array.isArray(block.rows)) {
      return block.rows.map((row) => row.join(" ")).join("\n");
    }

    if (block?.type === "list" && Array.isArray(block.items)) {
      return block.items.map((item) => item.text || "").join("\n");
    }

    if (block?.type === "figure") {
      return block.alt || "";
    }

    return "";
  }).filter(Boolean).join("\n\n");
}
