import { parsePdf } from "../pdf/parse-pdf.js";

export const pdfjsTextParser = Object.freeze({
  id: "pdfjs-text",
  label: "PDF.js Text",
  outputKind: "text",
  description: "Fast text-layer extraction with page numbers.",

  async parse({ url, bytes }, options = {}) {
    options.onProgress?.({
      stage: "parsing",
      detail: "PDF.js text extraction started."
    });

    const parsed = await parsePdf({ url, bytes }, {
      onProgress: options.onProgress
    });

    options.onProgress?.({
      stage: "parsing",
      detail: `PDF.js extracted ${parsed.pageCount} pages.`
    });

    return {
      parserId: this.id,
      parserLabel: this.label,
      outputKind: this.outputKind,
      pageCount: parsed.pageCount,
      pages: parsed.pages,
      markdown: pagesToPlainMarkdown(parsed.pages),
      rawMarkdown: "",
      chunks: null,
      metadata: null,
      warnings: [],
      stats: parsed.stats || null
    };
  }
});

function pagesToPlainMarkdown(pages) {
  return pages
    .filter((page) => page.text)
    .map((page) => `<!-- page:${page.pageNumber} -->\n\n${page.text}`)
    .join("\n\n---\n\n");
}
