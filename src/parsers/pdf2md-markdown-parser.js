import { cleanMarkdownForReading, resolveCleanupProfile } from "../markdown/clean-markdown.js";

export const PDF2MD_MAX_FILE_SIZE = 15 * 1024 * 1024;

export const pdf2mdMarkdownParser = Object.freeze({
  id: "pdf2md-markdown",
  label: "pdf2md Markdown",
  outputKind: "markdown",
  description: "Browser-native Markdown conversion with layout heuristics.",

  async parse({ url, bytes }, options = {}) {
    if (bytes.byteLength > PDF2MD_MAX_FILE_SIZE) {
      const error = new Error(`pdf2md supports PDFs up to ${formatBytes(PDF2MD_MAX_FILE_SIZE)}. This PDF is ${formatBytes(bytes.byteLength)}.`);
      error.code = "parser_file_too_large";
      error.parserId = this.id;
      error.limitBytes = PDF2MD_MAX_FILE_SIZE;
      error.actualBytes = bytes.byteLength;
      throw error;
    }

    const { convert } = await import("../../vendor/pdf2md/pdf2md.mjs");
    const result = await convert(bytes, {
      includeMetadata: true,
      outputFormat: "json",
      chunkBy: "page",
      onProgress: (progress) => {
        options.onProgress?.({
          stage: progress.stage,
          detail: `pdf2md ${progress.stage}: page ${progress.currentPage}/${progress.totalPages}`
        });
      }
    });

    if (result.status === "failed") {
      throw new Error(formatMessages(result.messages) || "pdf2md conversion failed.");
    }

    const rawMarkdown = result.markdown || "";
    const cleanupProfile = resolveCleanupProfile(rawMarkdown, { url });
    const cleanupOptions = { url, cleanupProfile: cleanupProfile.id };
    const markdown = cleanMarkdownForReading(rawMarkdown, cleanupOptions);
    const chunks = cleanChunks(result.chunks || [], cleanupOptions);

    return {
      parserId: this.id,
      parserLabel: this.label,
      outputKind: this.outputKind,
      pageCount: result.stats.pageCount,
      pages: chunksToPages(chunks, markdown),
      markdown,
      rawMarkdown,
      chunks: chunks.length ? chunks : null,
      metadata: {
        ...(result.metadata || {}),
        cleanupProfile: cleanupProfile.id
      },
      warnings: (result.messages || []).map((message) => ({
        code: message.code,
        severity: message.severity,
        message: message.message
      })),
      stats: result.stats
    };
  }
});

function cleanChunks(chunks, cleanupOptions) {
  return chunks.map((chunk) => ({
    ...chunk,
    markdown: cleanMarkdownForReading(chunk.markdown || "", cleanupOptions)
  }));
}

function chunksToPages(chunks, markdown) {
  if (!chunks.length) {
    return markdown ? [{ pageNumber: 1, text: markdown }] : [];
  }

  return chunks.map((chunk, index) => ({
    pageNumber: chunk.pageStart || index + 1,
    pageStart: chunk.pageStart || index + 1,
    pageEnd: chunk.pageEnd || chunk.pageStart || index + 1,
    text: chunk.markdown || ""
  }));
}

function formatMessages(messages = []) {
  return messages.map((message) => message.message).filter(Boolean).join("\n");
}

function formatBytes(bytes) {
  return `${Math.round(bytes / 1024 / 1024 * 10) / 10} MB`;
}
