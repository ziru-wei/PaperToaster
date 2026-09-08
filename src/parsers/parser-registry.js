import { outlineGuidedMarkdownParser } from "./outline-guided-markdown-parser.js";

const PARSERS = Object.freeze([
  outlineGuidedMarkdownParser
]);

export const DEFAULT_PARSER_ID = outlineGuidedMarkdownParser.id;

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
  return parser.parse(input, options);
}
