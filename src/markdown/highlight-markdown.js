export function applyMarkdownHighlight(markdown, selectedText) {
  return applyPlainMarkdownHighlight(markdown, selectedText);
}

export function removeMarkdownHighlight(markdown, highlightIndex) {
  return removeMarkdownAnnotation(markdown, highlightIndex, collectMarkdownHighlightRanges, "highlight-not-found");
}

export function applyMarkdownHiddenText(markdown, selectedText) {
  return applyMarkdownAnnotationWithUnion(markdown, selectedText, {
    syntax: {
      open: "{{hide64:",
      close: "}}",
      encoded: true
    },
    collectUnionRanges: collectMarkdownHiddenTextRanges,
    collectBlockingRanges: (source) => mergeRanges([
      ...collectCodeRanges(source),
      ...collectMarkdownHighlightRanges(source)
    ]),
    alreadyReason: "already-hidden"
  });
}

export function removeMarkdownHiddenText(markdown, hiddenIndex) {
  return removeMarkdownAnnotation(markdown, hiddenIndex, collectMarkdownHiddenTextRanges, "hidden-text-not-found");
}

function applyPlainMarkdownHighlight(markdown, selectedText) {
  const source = String(markdown || "");
  const needle = String(selectedText || "").trim();
  if (!source || !needle) {
    return {
      changed: false,
      markdown: source,
      reason: "empty-selection"
    };
  }

  if (hasUnsupportedHighlightText(needle)) {
    return {
      changed: false,
      markdown: source,
      reason: "unsupported-highlight-selection"
    };
  }

  const protectedRanges = collectProtectedRanges(source);
  const exactMatches = findMatchesOutsideRanges(source, needle, protectedRanges);
  const matches = exactMatches.length
    ? exactMatches
    : findWhitespaceTolerantMatchesOutsideRanges(source, needle, protectedRanges);
  if (matches.length !== 1) {
    return {
      changed: false,
      markdown: source,
      reason: matches.length > 1 ? "ambiguous-selection" : "selection-not-found"
    };
  }

  const range = trimRangeWhitespace(source, matches[0]);
  if (!isSafePlainHighlightRange(source, range)) {
    return {
      changed: false,
      markdown: source,
      reason: "unsupported-highlight-selection"
    };
  }

  return wrapPlainRange(source, range, {
    open: "==",
    close: "=="
  });
}

function applyMarkdownAnnotationWithUnion(markdown, selectedText, {
  syntax,
  collectUnionRanges,
  collectBlockingRanges,
  alreadyReason
}) {
  const source = String(markdown || "");
  const needle = String(selectedText || "").trim();
  if (!source || !needle) {
    return {
      changed: false,
      markdown: source,
      reason: "empty-selection"
    };
  }

  const unionRanges = collectUnionRanges(source);
  const protectedRanges = collectProtectedRanges(source);
  const matches = findMatchesOutsideRanges(source, needle, protectedRanges);
  if (matches.length === 1) {
    return wrapRange(source, matches[0], syntax);
  }

  const normalizedMatches = matches.length > 1
    ? matches
    : findWhitespaceTolerantMatchesOutsideRanges(source, needle, protectedRanges);
  if (normalizedMatches.length === 1) {
    return wrapRange(source, normalizedMatches[0], syntax);
  }

  const visibleMatches = normalizedMatches.length > 1
    ? normalizedMatches
    : findMarkdownVisibleMatchesOutsideRanges(source, needle, protectedRanges);
  if (visibleMatches.length === 1) {
    return wrapRange(source, visibleMatches[0], syntax);
  }

  const overlapProtectedRanges = collectBlockingRanges(source);
  const overlapMatches = findMarkdownVisibleMatchesOutsideRanges(source, needle, overlapProtectedRanges, {
    annotationRanges: unionRanges
  });
  if (overlapMatches.length !== 1) {
    return {
      changed: false,
      markdown: source,
      reason: overlapMatches.length > 1 ? "ambiguous-selection" : "selection-not-found"
    };
  }

  return wrapAnnotationUnionRange(source, overlapMatches[0], unionRanges, syntax, alreadyReason);
}

function removeMarkdownAnnotation(markdown, annotationIndex, collectRanges, missingReason) {
  const source = String(markdown || "");
  const index = Number(annotationIndex);
  if (!source || !Number.isInteger(index) || index < 0) {
    return {
      changed: false,
      markdown: source,
      reason: missingReason
    };
  }

  const annotation = collectRanges(source)[index];
  if (!annotation) {
    return {
      changed: false,
      markdown: source,
      reason: missingReason
    };
  }

  return {
    changed: true,
    markdown: `${source.slice(0, annotation.start)}${getAnnotationReplacement(source, annotation)}${source.slice(annotation.end)}`,
    reason: ""
  };
}

function wrapRange(source, range, syntax) {
  const start = range.start;
  const end = range.end;
  const annotated = wrapMarkdownBlocks(source.slice(start, end), syntax);
  return {
    changed: true,
    markdown: `${source.slice(0, start)}${annotated}${source.slice(end)}`,
    reason: ""
  };
}

function wrapPlainRange(source, range, syntax) {
  const start = range.start;
  const end = range.end;
  return {
    changed: true,
    markdown: `${source.slice(0, start)}${formatAnnotationContent(source.slice(start, end), syntax)}${source.slice(end)}`,
    reason: ""
  };
}

function wrapAnnotationUnionRange(source, range, annotationRanges, syntax, alreadyReason) {
  const overlappingAnnotationRanges = annotationRanges.filter((annotationRange) => rangesOverlap(
    range.start,
    range.end,
    [{ start: annotationRange.contentStart, end: annotationRange.contentEnd }]
  ));
  const start = Math.min(range.start, ...overlappingAnnotationRanges.map((annotationRange) => annotationRange.start));
  const end = Math.max(range.end, ...overlappingAnnotationRanges.map((annotationRange) => annotationRange.end));
  const unwrapped = unwrapAnnotationsInRange(source, start, end, annotationRanges);
  const annotated = wrapMarkdownBlocks(unwrapped, syntax);
  const nextMarkdown = `${source.slice(0, start)}${annotated}${source.slice(end)}`;
  return {
    changed: nextMarkdown !== source,
    markdown: nextMarkdown,
    reason: nextMarkdown === source ? alreadyReason : ""
  };
}

function unwrapAnnotationsInRange(source, start, end, annotationRanges) {
  const containedRanges = annotationRanges
    .filter((annotationRange) => annotationRange.start >= start && annotationRange.end <= end)
    .sort((left, right) => left.start - right.start);
  let cursor = start;
  let text = "";
  for (const annotationRange of containedRanges) {
    text += source.slice(cursor, annotationRange.start);
    text += getAnnotationReplacement(source, annotationRange);
    cursor = annotationRange.end;
  }
  text += source.slice(cursor, end);
  return text;
}

function formatAnnotationContent(text, syntax) {
  const content = syntax.encoded
    ? encodeAnnotationContent(text)
    : text;
  return `${syntax.open}${content}${syntax.close}`;
}

function getAnnotationReplacement(source, annotation) {
  if (annotation.encoded) {
    return annotation.replacementText;
  }

  return source.slice(annotation.contentStart, annotation.contentEnd);
}

function wrapMarkdownBlocks(text, syntax) {
  return String(text || "")
    .split(/(\n{2,})/)
    .map((part) => {
      if (!part || /^\n{2,}$/.test(part)) {
        return part;
      }

      const leadingWhitespace = part.match(/^\s*/)?.[0] || "";
      const trailingWhitespace = part.match(/\s*$/)?.[0] || "";
      const contentStart = leadingWhitespace.length;
      const contentEnd = part.length - trailingWhitespace.length;
      if (contentEnd <= contentStart) {
        return part;
      }

      return `${leadingWhitespace}${formatAnnotationContent(part.slice(contentStart, contentEnd), syntax)}${trailingWhitespace}`;
    })
    .join("");
}

function trimRangeWhitespace(source, range) {
  let start = range.start;
  let end = range.end;
  while (start < end && /\s/.test(source[start])) {
    start += 1;
  }
  while (end > start && /\s/.test(source[end - 1])) {
    end -= 1;
  }
  return { start, end };
}

function hasUnsupportedHighlightText(text) {
  return hasParagraphBreak(text) || hasMarkdownControlCharacter(text);
}

function isSafePlainHighlightRange(source, range) {
  if (range.end <= range.start) {
    return false;
  }

  const text = source.slice(range.start, range.end);
  if (!text.trim() || hasUnsupportedHighlightText(text)) {
    return false;
  }

  if (rangesOverlap(range.start, range.end, collectMarkdownLinkRanges(source))) {
    return false;
  }

  return !touchesMarkdownSyntaxBoundary(source, range);
}

function hasParagraphBreak(text) {
  return /\n[ \t]*\n/.test(text);
}

function hasMarkdownControlCharacter(text) {
  return /[\\`{}#>*_=|~<>]/.test(text);
}

function touchesMarkdownSyntaxBoundary(source, range) {
  const beforeTwo = source.slice(Math.max(0, range.start - 2), range.start);
  const afterTwo = source.slice(range.end, range.end + 2);
  if (/(\*\*|__|~~|`|\{|\||>)$/.test(beforeTwo)) {
    return true;
  }
  if (/^(\*\*|__|~~|`|\}|\||<)/.test(afterTwo)) {
    return true;
  }

  const lineStart = source.lastIndexOf("\n", range.start - 1) + 1;
  const lineEndIndex = source.indexOf("\n", range.start);
  const lineEnd = lineEndIndex === -1 ? source.length : lineEndIndex;
  const prefixEnd = findSkippableLinePrefixEnd(source, lineStart, {
    start: lineStart,
    end: lineEnd
  });
  return prefixEnd > lineStart && range.start <= prefixEnd;
}

function collectMarkdownLinkRanges(source) {
  const codeRanges = collectCodeRanges(source);
  const ranges = [];
  for (let index = 0; index < source.length; index += 1) {
    if (rangesOverlap(index, index + 1, codeRanges)) {
      continue;
    }

    const link = parseMarkdownLink(source, index, source.length);
    if (!link) {
      continue;
    }

    ranges.push({
      start: index,
      end: link.end
    });
    index = link.end - 1;
  }
  return ranges;
}

function collectProtectedRanges(markdown) {
  return mergeRanges([
    ...collectCodeRanges(markdown),
    ...collectMarkdownHighlightRanges(markdown),
    ...collectMarkdownHiddenTextRanges(markdown)
  ]);
}

function collectCodeRanges(markdown) {
  return mergeRanges([
    ...collectRegexRanges(markdown, /(^|\n)(```|~~~)[\s\S]*?(?:\n\2|$)/g),
    ...collectRegexRanges(markdown, /`+[^`\n]*?`+/g)
  ]);
}

function collectMarkdownHighlightRanges(markdown) {
  return collectAnnotationRanges(markdown, [
    {
      open: "==",
      close: "=="
    },
    {
      open: "{{highlight64:",
      close: "}}",
      encoded: true
    }
  ]);
}

function collectMarkdownHiddenTextRanges(markdown) {
  return collectAnnotationRanges(markdown, [
    {
      open: "{{hide:",
      close: "}}"
    },
    {
      open: "{{hide64:",
      close: "}}",
      encoded: true
    }
  ]);
}

function collectAnnotationRanges(markdown, syntaxes) {
  return syntaxes
    .flatMap((syntax) => collectDelimitedAnnotationRanges(markdown, syntax))
    .sort((left, right) => left.start - right.start);
}

function collectDelimitedAnnotationRanges(markdown, syntax) {
  const codeRanges = collectCodeRanges(markdown);
  const ranges = [];
  let start = markdown.indexOf(syntax.open);
  while (start !== -1) {
    const contentStart = start + syntax.open.length;
    const contentEnd = markdown.indexOf(syntax.close, contentStart);
    if (contentEnd === -1) {
      break;
    }

    const end = contentEnd + syntax.close.length;
    if (contentEnd <= contentStart || rangesOverlap(start, end, codeRanges)) {
      start = markdown.indexOf(syntax.open, start + syntax.open.length);
      continue;
    }

    ranges.push({
      start,
      end,
      contentStart,
      contentEnd,
      encoded: Boolean(syntax.encoded),
      replacementText: syntax.encoded
        ? decodeAnnotationContent(markdown.slice(contentStart, contentEnd))
        : ""
    });
    start = markdown.indexOf(syntax.open, end);
  }
  return ranges;
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

function findMatchesOutsideRanges(source, needle, protectedRanges) {
  const matches = [];
  let index = source.indexOf(needle);
  while (index !== -1) {
    const end = index + needle.length;
    if (!rangesOverlap(index, end, protectedRanges)) {
      matches.push({ start: index, end });
    }
    index = source.indexOf(needle, index + Math.max(needle.length, 1));
  }
  return matches;
}

function findWhitespaceTolerantMatchesOutsideRanges(source, needle, protectedRanges) {
  const normalizedNeedle = normalizeSearchText(needle);
  if (!normalizedNeedle) {
    return [];
  }

  const matches = [];
  for (const segment of collectSearchableSegments(source, protectedRanges)) {
    const normalized = normalizeSegment(source, segment);
    let index = normalized.text.indexOf(normalizedNeedle);
    while (index !== -1) {
      const endIndex = index + normalizedNeedle.length - 1;
      const start = normalized.map[index];
      const last = normalized.map[endIndex];
      if (Number.isInteger(start) && Number.isInteger(last)) {
        matches.push({
          start,
          end: last + 1
        });
      }
      index = normalized.text.indexOf(normalizedNeedle, index + Math.max(normalizedNeedle.length, 1));
    }
  }
  return matches;
}

function findMarkdownVisibleMatchesOutsideRanges(source, needle, protectedRanges, options = {}) {
  const normalizedNeedle = normalizeSearchText(needle);
  if (!normalizedNeedle) {
    return [];
  }

  const matches = [];
  for (const segment of collectSearchableSegments(source, protectedRanges)) {
    const normalized = normalizeMarkdownVisibleSegment(source, segment, options);
    let index = normalized.text.indexOf(normalizedNeedle);
    while (index !== -1) {
      const endIndex = index + normalizedNeedle.length - 1;
      const start = normalized.map[index];
      const last = normalized.map[endIndex];
      if (Number.isInteger(start) && Number.isInteger(last)) {
        matches.push({
          start,
          end: last + 1
        });
      }
      index = normalized.text.indexOf(normalizedNeedle, index + Math.max(normalizedNeedle.length, 1));
    }
  }
  return matches;
}

function collectSearchableSegments(source, protectedRanges) {
  const segments = [];
  let start = 0;
  for (const range of protectedRanges) {
    if (range.start > start) {
      segments.push({ start, end: range.start });
    }
    start = Math.max(start, range.end);
  }
  if (start < source.length) {
    segments.push({ start, end: source.length });
  }
  return segments;
}

function normalizeMarkdownVisibleSegment(source, segment, options = {}) {
  let text = "";
  const map = [];
  let pendingSpaceIndex = null;
  const annotationRanges = Array.isArray(options.annotationRanges) ? options.annotationRanges : [];

  const appendWhitespace = (index) => {
    if (text && !text.endsWith(" ") && pendingSpaceIndex === null) {
      pendingSpaceIndex = index;
    }
  };

  const appendCharacter = (character, index) => {
    if (/\s/.test(character)) {
      appendWhitespace(index);
      return;
    }

    if (pendingSpaceIndex !== null) {
      text += " ";
      map.push(pendingSpaceIndex);
      pendingSpaceIndex = null;
    }
    text += character;
    map.push(index);
  };

  for (let index = segment.start; index < segment.end; index += 1) {
    const encodedAnnotation = findEncodedAnnotationAtIndex(index, annotationRanges);
    if (encodedAnnotation) {
      if (index === encodedAnnotation.start) {
        for (const character of getAnnotationReplacement(source, encodedAnnotation)) {
          appendCharacter(character, encodedAnnotation.contentStart);
        }
      }
      index = encodedAnnotation.end - 1;
      continue;
    }

    const annotationSyntaxEnd = findAnnotationSyntaxSkipEnd(index, annotationRanges);
    if (annotationSyntaxEnd > index) {
      index = annotationSyntaxEnd - 1;
      continue;
    }

    const linePrefixEnd = findSkippableLinePrefixEnd(source, index, segment);
    if (linePrefixEnd > index) {
      index = linePrefixEnd - 1;
      continue;
    }

    const link = parseMarkdownLink(source, index, segment.end);
    if (link) {
      for (let labelIndex = link.labelStart; labelIndex < link.labelEnd; labelIndex += 1) {
        appendCharacter(source[labelIndex], labelIndex);
      }
      index = link.end - 1;
      continue;
    }

    const character = source[index];
    if (isSkippableMarkdownSyntax(source, index, segment)) {
      continue;
    }
    appendCharacter(character, index);
  }

  return { text, map };
}

function findEncodedAnnotationAtIndex(index, annotationRanges) {
  return annotationRanges.find((annotationRange) => (
    annotationRange.encoded &&
    index >= annotationRange.start &&
    index < annotationRange.end
  )) || null;
}

function findAnnotationSyntaxSkipEnd(index, annotationRanges) {
  for (const annotationRange of annotationRanges) {
    if (index >= annotationRange.start && index < annotationRange.contentStart) {
      return annotationRange.contentStart;
    }
    if (index >= annotationRange.contentEnd && index < annotationRange.end) {
      return annotationRange.end;
    }
  }
  return index;
}

function normalizeSegment(source, segment) {
  let text = "";
  const map = [];
  let pendingSpaceIndex = null;
  for (let index = segment.start; index < segment.end; index += 1) {
    const character = source[index];
    if (/\s/.test(character)) {
      if (text && !text.endsWith(" ") && pendingSpaceIndex === null) {
        pendingSpaceIndex = index;
      }
      continue;
    }

    if (pendingSpaceIndex !== null) {
      text += " ";
      map.push(pendingSpaceIndex);
      pendingSpaceIndex = null;
    }
    text += character;
    map.push(index);
  }

  return { text, map };
}

function normalizeSearchText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function findSkippableLinePrefixEnd(source, index, segment) {
  if (index > segment.start && source[index - 1] !== "\n") {
    return index;
  }

  let cursor = index;
  while (cursor < segment.end && /[ \t]/.test(source[cursor])) {
    cursor += 1;
  }

  const rest = source.slice(cursor, segment.end);
  const heading = rest.match(/^#{1,6}[ \t]+/);
  if (heading) {
    return cursor + heading[0].length;
  }

  const blockquote = rest.match(/^>+[ \t]*/);
  if (blockquote) {
    return cursor + blockquote[0].length;
  }

  const taskList = rest.match(/^[-*+][ \t]+\[[ xX]\][ \t]+/);
  if (taskList) {
    return cursor + taskList[0].length;
  }

  const bulletList = rest.match(/^[-*+][ \t]+/);
  if (bulletList) {
    return cursor + bulletList[0].length;
  }

  const orderedList = rest.match(/^\d{1,3}[.)][ \t]+/);
  if (orderedList) {
    return cursor + orderedList[0].length;
  }

  return index;
}

function parseMarkdownLink(source, index, end) {
  const labelStart = source[index] === "!" && source[index + 1] === "["
    ? index + 2
    : source[index] === "["
      ? index + 1
      : -1;
  if (labelStart < 0) {
    return null;
  }

  const labelEnd = findClosingCharacter(source, labelStart, end, "]");
  if (labelEnd < 0 || source[labelEnd + 1] !== "(") {
    return null;
  }

  const urlEnd = findClosingCharacter(source, labelEnd + 2, end, ")");
  if (urlEnd < 0) {
    return null;
  }

  return {
    labelStart,
    labelEnd,
    end: urlEnd + 1
  };
}

function findClosingCharacter(source, start, end, target) {
  for (let index = start; index < end; index += 1) {
    if (source[index] === "\\" && index + 1 < end) {
      index += 1;
      continue;
    }
    if (source[index] === target) {
      return index;
    }
  }
  return -1;
}

function isSkippableMarkdownSyntax(source, index, segment) {
  const character = source[index];
  if (character === "\\") {
    return index + 1 < segment.end && /[\\`*_[\]{}()#+\-.!>~|]/.test(source[index + 1]);
  }

  if (character === "*" || character === "_" || character === "~") {
    return !isWordCharacter(source[index - 1]) || !isWordCharacter(source[index + 1]);
  }

  return false;
}

function isWordCharacter(character) {
  return Boolean(character && /[A-Za-z0-9]/.test(character));
}

function rangesOverlap(start, end, ranges) {
  return ranges.some((range) => start < range.end && end > range.start);
}

function encodeAnnotationContent(text) {
  const bytes = new TextEncoder().encode(String(text || ""));
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
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
