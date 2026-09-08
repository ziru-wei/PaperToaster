import { buildOutlineGuidedArtifacts } from "../pdf/outline-guided-core.js";
import { parseWithLiteParse } from "../pdf/liteparse-runtime.js";
import { extractStructuredPdf } from "../pdf/structured-pdf-extraction.js";

export const outlineGuidedMarkdownParser = Object.freeze({
  id: "outline-guided-markdown",
  label: "Outline-guided Markdown",
  outputKind: "markdown",
  description: "PDF.js outline and geometry with LiteParse structured extraction.",

  async parse({ url, bytes }, options = {}) {
    const startedAt = performance.now();
    options.onProgress?.({ stage: "parsing", detail: "Loading PDF structure and outline." });
    const structure = await extractStructuredPdf(bytes, { onProgress: options.onProgress });

    options.onProgress?.({ stage: "parsing", detail: "Extracting structured layout with LiteParse." });
    const liteParseStartedAt = performance.now();
    const parsed = await parseWithLiteParse(bytes);
    const liteParseMs = performance.now() - liteParseStartedAt;

    options.onProgress?.({ stage: "parsing", detail: "Reconstructing outline-guided Markdown." });
    const pdfName = getPdfName(url);
    const result = buildOutlineGuidedArtifacts({
      parsed,
      pdfFacts: {
        ...structure.pdfFacts,
        title: options.documentTitle || structure.pdfFacts.title
      },
      pdfTextPages: structure.pdfTextPages,
      pdfName
    });
    const markdown = result.markdown || "";
    const elapsedMs = performance.now() - startedAt;

    return {
      parserId: this.id,
      parserLabel: this.label,
      outputKind: this.outputKind,
      pageCount: structure.pageCount,
      pages: markdown ? [{ pageNumber: 1, text: markdown }] : [],
      markdown,
      rawMarkdown: markdown,
      chunks: null,
      artifacts: {
        outline: result.outlineArtifact,
        debug: result.debugArtifact
      },
      metadata: {
        outlineType: result.outlineType,
        degradedMode: result.degradedMode,
        parserImplementationVersion: 1,
        matchedHeadingCount: result.matches.filter((match) => match.finalMarkdownHeadingLevel).length,
        unresolvedHeadingCount: result.matches.filter((match) => !match.finalMarkdownHeadingLevel).length
      },
      warnings: buildWarnings(result),
      stats: {
        pageCount: structure.pageCount,
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        processingMs: elapsedMs,
        liteParseMs
      }
    };
  }
});

function buildWarnings(result) {
  const unresolved = result.matches.filter((match) => !match.finalMarkdownHeadingLevel).length;
  return unresolved ? [{
    code: "outline_headings_unresolved",
    severity: "warning",
    message: `${unresolved} outline heading${unresolved === 1 ? "" : "s"} could not be placed in Markdown.`
  }] : [];
}

function getPdfName(url) {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).at(-1) || "paper.pdf");
  } catch {
    return "paper.pdf";
  }
}
