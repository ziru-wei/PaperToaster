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
        largeFileFallback: options.largeFileFallback === true
      },
      warnings: [{
        code: "large_pdf_plain_markdown",
        severity: "warning",
        message: "Large PDF used PDF.js Markdown fallback. Layout quality may be lower than pdf2md."
      }],
      stats: {
        pageCount: parsed.pageCount,
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        processingMs: parsed.stats?.processingMs || null
      }
    };
  }
});

function pagesToPlainMarkdown(pages) {
  return pages
    .filter((page) => page.text)
    .map((page) => `<!-- page:${page.pageNumber} -->\n\n${page.text}`)
    .join("\n\n---\n\n");
}
