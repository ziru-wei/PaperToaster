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
  const fallbackInput = parser.id === pdf2mdMarkdownParser.id ? cloneParserInput(input) : null;

  try {
    return await parser.parse(input, options);
  } catch (error) {
    if (parser.id !== pdf2mdMarkdownParser.id) {
      throw error;
    }

    const fallbackReason = error.message || String(error);
    const fallbackCode = error?.code === "parser_file_too_large"
      ? "pdf2md_file_too_large"
      : "pdf2md_runtime_fallback";
    options.onProgress?.({
      stage: "fallback",
      detail: `pdf2md failed; using ${pdfjsMarkdownParser.label}. Reason: ${fallbackReason}`
    });

    let fallbackContent;
    try {
      fallbackContent = await pdfjsMarkdownParser.parse(fallbackInput || input, {
        ...options,
        pdf2mdFallback: true,
        pdf2mdFallbackReason: fallbackReason,
        largeFileFallback: error?.code === "parser_file_too_large"
      });
    } catch (fallbackError) {
      throw new Error([
        "pdf2md parser failed:",
        fallbackReason,
        "",
        `${pdfjsMarkdownParser.label} fallback also failed:`,
        fallbackError.message || String(fallbackError)
      ].join("\n"));
    }

    return {
      ...fallbackContent,
      metadata: {
        ...(fallbackContent.metadata || {}),
        pdf2mdFallback: true,
        pdf2mdFallbackReason: fallbackReason,
        largeFileFallback: error?.code === "parser_file_too_large",
        largeFileFallbackReason: error?.code === "parser_file_too_large" ? fallbackReason : "",
        requestedParserId: parser.id,
        fallbackParserId: pdfjsMarkdownParser.id,
        limitBytes: error.limitBytes || null,
        actualBytes: error.actualBytes || input.bytes?.byteLength || null
      },
      warnings: [
        {
          code: fallbackCode,
          severity: "warning",
          message: `pdf2md failed; used ${pdfjsMarkdownParser.label}. Reason: ${fallbackReason}`
        },
        ...(fallbackContent.warnings || [])
      ]
    };
  }
}

function cloneParserInput(input) {
  return {
    ...input,
    bytes: clonePdfBytes(input.bytes)
  };
}

function clonePdfBytes(bytes) {
  if (bytes instanceof ArrayBuffer) {
    return bytes.slice(0);
  }

  if (ArrayBuffer.isView(bytes)) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }

  return bytes;
}
