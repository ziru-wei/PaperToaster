export function normalizeAiResponseMarkdown(markdownText) {
  return stripMarkdownBoldMarkers(String(markdownText || ""));
}

function stripMarkdownBoldMarkers(markdownText) {
  const source = String(markdownText || "");
  if (!source.includes("**") && !source.includes("__")) {
    return source;
  }

  const codeRanges = collectCodeRanges(source);
  let output = "";
  let cursor = 0;
  for (const range of codeRanges) {
    output += stripBoldMarkersInPlainText(source.slice(cursor, range.start));
    output += source.slice(range.start, range.end);
    cursor = range.end;
  }
  output += stripBoldMarkersInPlainText(source.slice(cursor));
  return output;
}

function stripBoldMarkersInPlainText(text) {
  return String(text || "")
    .replace(/(\*\*\*|___)(?=\S)([\s\S]*?\S)\1/g, "$2")
    .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "$2");
}

function collectCodeRanges(markdownText) {
  return mergeRanges([
    ...collectRegexRanges(markdownText, /(^|\n)(```|~~~)[\s\S]*?(?:\n\2|$)/g),
    ...collectRegexRanges(markdownText, /`+[^`\n]*?`+/g)
  ]);
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
