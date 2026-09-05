import { pdfjsTextParser } from "./pdfjs-text-parser.js";
import { pdf2mdMarkdownParser } from "./pdf2md-markdown-parser.js";
import { pdfjsMarkdownParser } from "./pdfjs-markdown-parser.js";

const PARSERS = Object.freeze([
  pdf2mdMarkdownParser,
  pdfjsMarkdownParser,
  pdfjsTextParser
]);

export const DEFAULT_PARSER_ID = pdf2mdMarkdownParser.id;

export function listParsers() {
  return PARSERS.map((parser) => ({
    id: parser.id,
    label: parser.label,
    outputKind: parser.outputKind,
    description: parser.description
  }));
}

export function getParser(parserId = DEFAULT_PARSER_ID) {
  const parser = PARSERS.find((candidate) => candidate.id === parserId);
  if (!parser) {
    throw new Error(`Unknown PDF parser: ${parserId}`);
  }
  return parser;
}

export async function parsePdfToContent(input, options = {}) {
  const parser = getParser(options.parserId);

  try {
    return await parser.parse(input, options);
  } catch (error) {
    if (error?.code !== "parser_file_too_large" || parser.id !== pdf2mdMarkdownParser.id) {
      throw error;
    }

    options.onProgress?.({
      stage: "fallback",
      detail: `pdf2md file limit hit; marking this as a large PDF and using ${pdfjsMarkdownParser.label}.`
    });
    const fallbackContent = await pdfjsMarkdownParser.parse(input, options);

    return {
      ...fallbackContent,
      metadata: {
        ...(fallbackContent.metadata || {}),
        largeFileFallback: true,
        largeFileFallbackReason: error.message,
        requestedParserId: parser.id,
        fallbackParserId: pdfjsMarkdownParser.id,
        limitBytes: error.limitBytes || null,
        actualBytes: error.actualBytes || input.bytes?.byteLength || null
      },
      warnings: [
        {
          code: "pdf2md_file_too_large",
          severity: "warning",
          message: error.message
        },
        ...(fallbackContent.warnings || [])
      ]
    };
  }
}
