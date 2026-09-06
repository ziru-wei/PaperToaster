import { cleanMarkdownForReading, resolveCleanupProfile } from "../markdown/clean-markdown.js";
import { parsePdf } from "../pdf/parse-pdf.js";

export const pdfjsMarkdownParser = Object.freeze({
  id: "pdfjs-markdown",
  label: "PDF.js Markdown",
  outputKind: "markdown",
  description: "Large-file Markdown fallback using PDF.js text extraction.",

  async parse({ url, bytes }, options = {}) {
    options.onProgress?.({
      stage: "parsing",
      detail: "PDF.js large-file Markdown extraction started."
    });

    const parsed = await parsePdf({ url, bytes }, {
      onProgress: options.onProgress
    });
    const rawMarkdown = pagesToPlainMarkdown(parsed.pages);
    const cleanupProfile = resolveCleanupProfile(rawMarkdown, { url });
    const markdown = cleanMarkdownForReading(rawMarkdown, {
      url,
      cleanupProfile: cleanupProfile.id
    });

    options.onProgress?.({
      stage: "parsing",
      detail: `PDF.js Markdown extracted ${parsed.pageCount} pages.`
    });

    return {
      parserId: this.id,
      parserLabel: this.label,
      outputKind: this.outputKind,
      pageCount: parsed.pageCount,
      pages: parsed.pages,
      markdown,
      rawMarkdown,
      chunks: null,
      metadata: {
        cleanupProfile: cleanupProfile.id,
        largeFileFallback: options.largeFileFallback === true,
        pdf2mdFallback: options.pdf2mdFallback === true,
        pdf2mdFallbackReason: options.pdf2mdFallbackReason || ""
      },
      warnings: [buildFallbackWarning(options)],
      stats: {
        pageCount: parsed.pageCount,
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        processingMs: parsed.stats?.processingMs || null
      }
    };
  }
});

function buildFallbackWarning(options = {}) {
  if (options.largeFileFallback) {
    return {
      code: "large_pdf_plain_markdown",
      severity: "warning",
      message: "Large PDF used PDF.js Markdown fallback. Layout quality may be lower than pdf2md."
    };
  }

  if (options.pdf2mdFallback) {
    return {
      code: "pdf2md_runtime_plain_markdown",
      severity: "warning",
      message: `pdf2md failed at runtime; PDF.js Markdown fallback was used. Reason: ${options.pdf2mdFallbackReason || "unknown"}`
    };
  }

  return {
    code: "pdfjs_plain_markdown",
    severity: "warning",
    message: "PDF.js Markdown extraction was used. Layout quality may be lower than pdf2md."
  };
}

function pagesToPlainMarkdown(pages) {
  return pages
    .filter((page) => page.text)
    .map((page) => `<!-- page:${page.pageNumber} -->\n\n${page.text}`)
    .join("\n\n---\n\n");
}
