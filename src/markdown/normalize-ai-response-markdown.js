export function normalizeAiResponseMarkdown(markdownText) {
  return normalizePlainTextSegments(String(markdownText || ""));
}

export function prepareAiResponseMarkdownForCopy(markdownText) {
  return normalizeAiResponseMarkdown(unwrapNonHighlightAnnotations(String(markdownText || "")));
}

function normalizePlainTextSegments(markdownText) {
  const source = String(markdownText || "");
  if (!/[*_（）]|<br\s*\/?>/i.test(source)) {
    return source;
  }

  const protectedRanges = collectProtectedRanges(source);
  let output = "";
  let cursor = 0;
  for (const range of protectedRanges) {
    output += normalizePlainText(source.slice(cursor, range.start));
    output += source.slice(range.start, range.end);
    cursor = range.end;
  }
  output += normalizePlainText(source.slice(cursor));
  return output;
}

function normalizePlainText(text) {
  return normalizeChineseParenthesesInPlainText(
    stripEmphasisMarkersInPlainText(text)
  );
}

function stripEmphasisMarkersInPlainText(text) {
  return String(text || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/(\*\*\*|___)(?=\S)([\s\S]*?\S)\1/g, "$2")
    .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "$2")
    .replace(/(?<!\*)\*(?!\*)(?=\S)([^\n*]*?\S)\*(?!\*)/g, "$1")
    .replace(/(?<![\w_])_(?!_)(?=\S)([^\n_]*?\S)_(?![\w_])/g, "$1");
}

function normalizeChineseParenthesesInPlainText(text) {
  return String(text || "")
    .replace(/[ \t]*（[ \t]*/g, " (")
    .replace(/[ \t]*）[ \t]*/g, ") ");
}

function collectProtectedRanges(markdownText) {
  return mergeRanges([
    ...collectRegexRanges(markdownText, /(^|\n)(```|~~~)[\s\S]*?(?:\n\2|$)/g),
    ...collectRegexRanges(markdownText, /`+[^`\n]*?`+/g),
    ...collectRegexRanges(markdownText, /\{\{(?:hide(?:64)?|highlight64|circle64):[\s\S]*?\}\}/g)
  ]);
}

function unwrapNonHighlightAnnotations(markdownText) {
  return String(markdownText || "")
    .replace(/\{\{(?:hide64|circle64):([^{}]*)\}\}/g, (_match, payload) => (
      decodeAnnotationContent(stripAnnotationGroupId(payload))
    ))
    .replace(/\{\{hide:([\s\S]*?)\}\}/g, "$1");
}

function stripAnnotationGroupId(payload) {
  const value = String(payload || "");
  const separatorIndex = value.indexOf(":");
  if (separatorIndex <= 0 || !/^[a-z0-9-]+$/i.test(value.slice(0, separatorIndex))) {
    return value;
  }
  return value.slice(separatorIndex + 1);
}

function decodeAnnotationContent(encodedText) {
  try {
    const base64 = String(encodedText || "").replaceAll("-", "+").replaceAll("_", "/");
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const binary = atob(padded);
    const bytes = new Uint8Array(Array.from(binary, (character) => character.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function collectRegexRanges(source, pattern) {
  const ranges = [];
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const prefixLength = match[1] ? match[1].length : 0;
    ranges.push({
      start: match.index + prefixLength,
      end: match.index + match[0].length
    });
  }
  return ranges;
}

function mergeRanges(ranges) {
  return ranges
    .filter((range) => range.end > range.start)
    .sort((left, right) => left.start - right.start)
    .reduce((merged, range) => {
      const previous = merged.at(-1);
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
      } else {
        merged.push({ ...range });
      }
      return merged;
    }, []);
}
