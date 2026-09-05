export function cleanMarkdownForReading(markdown, options = {}) {
  const profile = resolveCleanupProfile(markdown, options);
  const stripLinks = options.stripLinks ?? true;
  const trimAcademicFrontMatter = options.trimAcademicFrontMatter ?? true;
  const trimAcademicBackMatter = options.trimAcademicBackMatter ?? true;
  const removeEmptyCitations = options.removeEmptyCitations ?? true;
  const normalizeAcademicHeadings = options.normalizeAcademicHeadings ?? true;
  let cleaned = markdown || "";

  if (stripLinks) {
    cleaned = stripMarkdownLinksUntilStable(cleaned);
  }

  if (removeEmptyCitations) {
    cleaned = stripEmptyCitationBrackets(cleaned);
  }

  if (profile.promoteLineStartHeadings) {
    cleaned = promoteLineStartSectionHeadings(cleaned, profile);
  }

  if (trimAcademicFrontMatter) {
    cleaned = trimBeforeAbstractAndSkipToIntroduction(cleaned);
  }

  if (trimAcademicBackMatter) {
    cleaned = trimAcknowledgementsAndReferences(cleaned);
  }

  if (normalizeAcademicHeadings) {
    cleaned = normalizeAndSortAcademicHeadings(cleaned, { profile });
  }

  if (stripLinks) {
    cleaned = stripMarkdownLinksUntilStable(cleaned);
  }

  return cleaned
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function resolveCleanupProfile(markdown = "", options = {}) {
  if (options.cleanupProfile && CLEANUP_PROFILES[options.cleanupProfile]) {
    return CLEANUP_PROFILES[options.cleanupProfile];
  }

  const url = String(options.url || "").toLowerCase();
  const sample = markdown.slice(0, 8000);

  if (url.includes("ieeexplore.ieee.org") || /\bIEEE\b/.test(sample)) {
    return CLEANUP_PROFILES.ieee;
  }

  if (url.includes("dl.acm.org") || /\bACM\b/.test(sample) || /\bCCS Concepts\b/i.test(sample)) {
    return CLEANUP_PROFILES.acm;
  }

  return CLEANUP_PROFILES.generic;
}

export function stripEmptyCitationBrackets(markdown) {
  return markdown
    .replace(/\s*\[\s*\](?=\s*[,.;:!?])/g, "")
    .replace(/(?<=\S)\s*\[\s*\]/g, "")
    .replace(/\[\s*\]\s*/g, "");
}

export function trimAcknowledgementsAndReferences(markdown) {
  const backMatterStart = findBackMatterStart(markdown);
  if (backMatterStart === null) {
    return stripTrailingAcknowledgementParagraphs(markdown);
  }

  return stripTrailingAcknowledgementParagraphs(markdown.slice(0, backMatterStart));
}

export function trimBeforeAbstractAndSkipToIntroduction(markdown) {
  const abstractHeading = findHeading(markdown, /^abstract$/i);
  if (!abstractHeading) {
    return markdown;
  }

  const introductionHeading = findHeading(markdown, /^(?:\d+\.?\s+)?introduction$/i, abstractHeading.end);
  if (!introductionHeading) {
    return cleanAbstractBlock(markdown.slice(abstractHeading.start));
  }

  const nextHeadingAfterAbstract = findNextHeading(markdown, abstractHeading.end);
  if (!nextHeadingAfterAbstract || nextHeadingAfterAbstract.start >= introductionHeading.start) {
    const abstractBlock = cleanAbstractBlock(markdown.slice(abstractHeading.start, introductionHeading.start).trim());
    const introductionAndAfter = markdown.slice(introductionHeading.start).trim();
    return [abstractBlock, introductionAndAfter].filter(Boolean).join("\n\n");
  }

  const abstractBlock = cleanAbstractBlock(markdown.slice(abstractHeading.start, nextHeadingAfterAbstract.start).trim());
  const introductionAndAfter = markdown.slice(introductionHeading.start).trim();

  return [abstractBlock, introductionAndAfter].filter(Boolean).join("\n\n");
}

function cleanAbstractBlock(markdown) {
  const lines = markdown.split("\n");
  const output = [];

  for (const line of lines) {
    if (/^\s*(?:keywords?|index terms?|ccs concepts)\s*:/i.test(line)) {
      break;
    }

    output.push(line);
  }

  return output.join("\n").trim();
}

function stripTrailingAcknowledgementParagraphs(markdown) {
  const paragraphs = markdown.split(/\n{2,}/);

  while (paragraphs.length) {
    const last = paragraphs.at(-1).trim();
    if (!last) {
      paragraphs.pop();
      continue;
    }

    if (!isAcknowledgementParagraph(last)) {
      break;
    }

    paragraphs.pop();
  }

  return paragraphs.join("\n\n").trimEnd();
}

function isAcknowledgementParagraph(paragraph) {
  if (/^#{1,6}\s+/.test(paragraph)) {
    return false;
  }

  return /\b(?:acknowledg|we thank|thanks? to|supported by|funded by|under a grant|grant number|fellowships?)\b/i.test(paragraph);
}

const BACK_MATTER_HEADING_PATTERN = /^(?:\d+\.?\s+)?(?:acknowledgements?|acknowledgments?|r\s*eferences|references|bibliography|works cited)$/i;
const BACK_MATTER_STANDALONE_LINE_PATTERN = /^\s*(?:#{1,6}\s*)?(?:\|\s*)?(?:\d+\.?\s+)?(acknowledgements?|acknowledgments?|r\s*eferences|references|bibliography|works cited)\s*(?:\|\s*)?$/i;
const BACK_MATTER_LINE_START_PATTERN = /^\s*(?:#{1,6}\s*)?(?:\|\s*)?(?:\d+\.?\s+)?(acknowledgements?|acknowledgments?|r\s*eferences|references|bibliography|works cited)\b\s*(.*)$/i;

function findBackMatterStart(markdown) {
  const markdownHeading = findHeading(markdown, BACK_MATTER_HEADING_PATTERN);
  if (markdownHeading && isPlausibleBackMatterPosition(markdown, markdownHeading.start)) {
    return markdownHeading.start;
  }

  for (const marker of findBackMatterMarkers(markdown)) {
    if (!isPlausibleBackMatterPosition(markdown, marker.start)) {
      continue;
    }

    if (marker.kind === "references" && hasReferenceListEvidenceAfter(markdown, marker.start)) {
      return marker.start;
    }

    if (marker.kind === "acknowledgements" && hasAcknowledgementEvidenceAfter(markdown, marker.start)) {
      return marker.start;
    }
  }

  return findUnheadedReferenceListStart(markdown);
}

function findBackMatterMarkers(markdown) {
  const markers = [];
  const linePattern = /^.*$/gm;
  let match;

  while ((match = linePattern.exec(markdown)) !== null) {
    const line = match[0];
    const marker = findBackMatterMarkerInLine(line);
    if (marker) {
      markers.push({
        start: match.index + marker.index,
        kind: marker.kind
      });
    }

    if (linePattern.lastIndex === match.index) {
      linePattern.lastIndex += 1;
    }
  }

  return markers.sort((left, right) => left.start - right.start);
}

function findBackMatterMarkerInLine(line) {
  const normalizedLine = line.replace(/\s+/g, " ").trim();
  if (!normalizedLine) {
    return null;
  }

  const standalone = normalizedLine.match(BACK_MATTER_STANDALONE_LINE_PATTERN);
  if (standalone) {
    return {
      index: line.search(/\S/),
      kind: classifyBackMatterLabel(standalone[1])
    };
  }

  const lineStart = normalizedLine.match(BACK_MATTER_LINE_START_PATTERN);
  if (lineStart && isLikelyLineStartBackMatterMarker(lineStart[2] || "", lineStart[1])) {
    return {
      index: line.search(/\S/),
      kind: classifyBackMatterLabel(lineStart[1])
    };
  }

  const inline = findInlineBackMatterMarker(line);
  if (inline) {
    return inline;
  }

  const embedded = findEmbeddedReferenceMarker(line);
  if (embedded) {
    return embedded;
  }

  return null;
}

function findInlineBackMatterMarker(line) {
  const inlinePattern = /(?:^|[.!?]\s+)(\d{1,2}\.?\s+)?(acknowledgements?|acknowledgments?|r\s*eferences|references|bibliography)\b/gi;
  let match;

  while ((match = inlinePattern.exec(line)) !== null) {
    const prefixLength = match[0].length - match[0].replace(/^[.!?]\s+/, "").length;
    const labelOffset = (match[1] || "").length;
    const start = match.index + prefixLength + labelOffset;
    const before = line.slice(Math.max(0, start - 18), start);
    const after = line.slice(start + match[2].length, start + match[2].length + 180);

    const hasCleanBoundary = /[.!?]\s+$|^\s*$/.test(before);
    const hasEmbeddedReferenceListStart = classifyBackMatterLabel(match[2]) === "references"
      && hasNearbyReferenceListStart(after)
      && !/\bACM\s+$/i.test(before);

    if ((!hasCleanBoundary || !isLikelyBackMatterContinuation(after, match[2])) && !hasEmbeddedReferenceListStart) {
      continue;
    }

    return {
      index: start,
      kind: classifyBackMatterLabel(match[2])
    };
  }

  return null;
}

function findEmbeddedReferenceMarker(line) {
  const embeddedPattern = /\b(references|bibliography|works cited)\b/gi;
  let match;

  while ((match = embeddedPattern.exec(line)) !== null) {
    const before = line.slice(Math.max(0, match.index - 18), match.index);
    const after = line.slice(match.index + match[1].length, match.index + match[1].length + 260);
    if (/\bACM\s+$/i.test(before) || !hasNearbyReferenceListStart(after)) {
      continue;
    }

    return {
      index: match.index,
      kind: "references"
    };
  }

  return null;
}

function hasNearbyReferenceListStart(text) {
  return /^.{0,160}(?:^|[.!?]\s+|\s)(?:\[\s*1\s*\]|1\.)\s+[A-Z][\p{L}’'-]+(?:\s+[A-Z]\.?|,\s)/u.test(text.replace(/\s+/g, " "));
}

function classifyBackMatterLabel(label) {
  return /acknowledg/i.test(label) ? "acknowledgements" : "references";
}

function isLikelyLineStartBackMatterMarker(rest, label) {
  if (isLikelyBackMatterContinuation(rest, label)) {
    return true;
  }

  if (/acknowledg/i.test(label)) {
    return false;
  }

  const normalizedRest = rest.replace(/\s+/g, " ").trim();
  return Boolean(normalizedRest) && !/^(?:to|in|for|from|within|about|between|among|made)\b/i.test(normalizedRest);
}

function isLikelyBackMatterContinuation(rest, label) {
  const normalizedRest = rest.replace(/\s+/g, " ").trim();
  if (!normalizedRest) {
    return true;
  }

  if (/acknowledg/i.test(label)) {
    return /^(?:the authors?|we|this work|funding|supported|thanks?|would like)/i.test(normalizedRest);
  }

  return /^(?:\[\s*\d+\s*\]|\d+\.\s+[A-Z]|[A-Z][\p{L}’'-]+(?:\s+[A-Z]\.|\s*,))/u.test(normalizedRest);
}

function isPlausibleBackMatterPosition(markdown, start) {
  if (start < 1200) {
    return false;
  }

  const ratio = start / Math.max(markdown.length, 1);
  if (ratio >= 0.48) {
    return true;
  }

  if (ratio < 0.35) {
    return false;
  }

  const nearbyBefore = markdown.slice(Math.max(0, start - 9000), start);
  return /(?:^|\n)\s*#{0,6}\s*(?:\d+\.?\s+)?(?:conclusions?|discussion|limitations?|future work)\b/i.test(nearbyBefore)
    || /\b(?:in conclusion|we conclude|future work|limitations? of this work)\b/i.test(nearbyBefore);
}

function hasAcknowledgementEvidenceAfter(markdown, start) {
  const window = markdown.slice(start, Math.min(markdown.length, start + 5000));
  return /\b(?:acknowledg|we thank|thanks? to|supported by|funded by|grant|foundation|fellowship)\b/i.test(window)
    || hasReferenceListEvidenceAfter(markdown, start);
}

function hasReferenceListEvidenceAfter(markdown, start) {
  const window = markdown
    .slice(start, Math.min(markdown.length, start + 14000))
    .replace(/^\s*(?:#{1,6}\s*)?(?:\d+\.?\s+)?(?:r\s*eferences|references|bibliography|works cited)\b/i, " ");
  const bracketReferences = [...window.matchAll(/\[\s*(\d{1,3})\s*\]\s+[A-Z]/g)]
    .map((match) => Number(match[1]));
  const numberedReferences = [...window.matchAll(/(?:^|[\n\r]|\s+)(\d{1,3})\.\s+[A-Z][\p{L}’'-]+(?:\s+[A-Z]\.?|,\s)/gu)]
    .map((match) => Number(match[1]));

  if (hasAscendingReferenceRun(bracketReferences) || hasAscendingReferenceRun(numberedReferences)) {
    return true;
  }

  const referenceSignals = countMatches(window, /\b(?:doi|arxiv|proceedings|conference|journal|transactions|IEEE|ACM|Springer|Elsevier|pp\.|vol\.|retrieved|available:|in:)\b/gi);
  return referenceSignals >= 3 && (bracketReferences.length + numberedReferences.length) >= 2;
}

function findUnheadedReferenceListStart(markdown) {
  const searchStart = Math.floor(markdown.length * 0.55);
  const tail = markdown.slice(searchStart);
  const itemPattern = /(?:^|[\n\r]|\s+)(?:\[\s*(\d{1,3})\s*\]|(\d{1,3})\.)\s+[A-Z][\p{L}’'-]+(?:\s+[A-Z]\.?|,\s)[^\n]{30,}/gu;
  const items = [];
  let match;

  while ((match = itemPattern.exec(tail)) !== null) {
    const number = Number(match[1] || match[2]);
    const absoluteStart = searchStart + match.index + match[0].search(/\S/);
    if (!Number.isInteger(number)) {
      continue;
    }

    items.push({
      number,
      start: absoluteStart,
      text: match[0]
    });
  }

  for (const item of items) {
    const markerStart = findNearbyPreviousReferenceMarker(markdown, item.start);
    if (markerStart !== null && hasReferenceListEvidenceAfter(markdown, markerStart)) {
      return markerStart;
    }
  }

  for (let index = 0; index <= items.length - 3; index += 1) {
    const run = items.slice(index, index + 3);
    if (!isSequentialReferenceRun(run)) {
      continue;
    }

    const evidenceWindow = markdown.slice(run[0].start, Math.min(markdown.length, run[2].start + 3500));
    if (countReferenceSignals(evidenceWindow) >= 2) {
      return findNearbyPreviousReferenceMarker(markdown, run[0].start) ?? run[0].start;
    }
  }

  for (const item of items) {
    if (item.start / Math.max(markdown.length, 1) < 0.72) {
      continue;
    }

    const evidenceWindow = markdown.slice(item.start, Math.min(markdown.length, item.start + 5000));
    if (countReferenceSignals(evidenceWindow) >= 4) {
      return findNearbyPreviousReferenceMarker(markdown, item.start) ?? item.start;
    }
  }

  return null;
}

function findNearbyPreviousReferenceMarker(markdown, itemStart) {
  const lookbackStart = Math.max(0, itemStart - 260);
  const before = markdown.slice(lookbackStart, itemStart);
  const markers = [...before.matchAll(/\b(references|bibliography|works cited)\b/gi)];
  const marker = markers.at(-1);
  if (!marker) {
    return null;
  }

  const between = before.slice(marker.index + marker[1].length).replace(/\s+/g, " ").trim();
  if (between.length > 80) {
    return null;
  }

  if (/^(?:[a-z]{1,20}[.!?]?)?$/i.test(between)) {
    return lookbackStart + marker.index;
  }

  return null;
}

function hasAscendingReferenceRun(numbers) {
  for (let index = 0; index <= numbers.length - 3; index += 1) {
    const first = numbers[index];
    if (
      numbers[index + 1] === first + 1
      && numbers[index + 2] === first + 2
    ) {
      return true;
    }
  }

  return false;
}

function isSequentialReferenceRun(items) {
  return items[1].number === items[0].number + 1
    && items[2].number === items[1].number + 1
    && items[2].start - items[0].start < 8000;
}

function countReferenceSignals(text) {
  return countMatches(text, /\b(?:doi|arxiv|proceedings|conference|journal|transactions|IEEE|ACM|Springer|Elsevier|pp\.|vol\.|retrieved|available:|in:)\b/gi);
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

export function normalizeAndSortAcademicHeadings(markdown, options = {}) {
  const profile = options.profile || CLEANUP_PROFILES.generic;
  const normalized = normalizeHeadingLines(markdown, profile);
  const promoted = promoteInlineNumberedSubsectionHeadings(normalized, profile);
  return sortNumberedHeadingTree(promoted);
}

function promoteLineStartSectionHeadings(markdown, profile) {
  return markdown.split("\n").flatMap((line) => {
    if (!line.trim() || /^\s*(?:#{1,6}\s+|[-*+]|\||>|```)/.test(line)) {
      return [line];
    }

    const knownHeading = findKnownLineStartHeading(line, profile.lineStartHeadings || []);
    if (knownHeading) {
      return splitLineStartHeading(line, knownHeading);
    }

    if (!profile.inferTitleCaseLineStartHeadings) {
      return [line];
    }

    const inferredHeading = inferTitleCaseLineStartHeading(line);
    if (!inferredHeading) {
      return [line];
    }

    return [
      formatHeading(inferredHeading.title, inferredHeading.level),
      "",
      inferredHeading.rest
    ];
  }).join("\n");
}

function findKnownLineStartHeading(line, headings) {
  const normalizedLine = normalizeHeadingTitle(line);

  return headings.find((heading) => heading.pattern.test(normalizedLine)) || null;
}

function splitLineStartHeading(line, heading) {
  const match = normalizeHeadingTitle(line).match(heading.pattern);
  const rawMatchLength = match?.[0]?.length || heading.title.length;
  const rest = line.slice(rawMatchLength).trim();
  const output = [formatHeading(heading.title, heading.level || 2)];

  if (rest) {
    output.push("", rest);
  }

  return output;
}

function inferTitleCaseLineStartHeading(line) {
  const match = line.match(/^([A-Z][A-Za-z’'-]*(?:\s+(?:[A-Z][A-Za-z’'-]*|AI|HCI|UX|MVP|and|or|of|for|in|to|with|as|the|Is|Are|One:|Four:)){1,8}[?:]?)\s+([A-Z][a-z].{80,})$/);
  if (!match) {
    return null;
  }

  const title = match[1].trim();
  if (title.length > 90 || /^(?:Figure|Table)\s+\d+/i.test(title)) {
    return null;
  }

  return {
    title,
    level: 3,
    rest: match[2].trim()
  };
}

function normalizeHeadingLines(markdown, profile) {
  const lines = markdown.split("\n");
  const output = [];
  const context = {
    nextTopLevelNumber: 1,
    profile
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!heading) {
      output.push(line);
      continue;
    }

    output.push(...normalizeHeadingLine(heading[2], context, heading[1].length));
  }

  return output.join("\n");
}

function normalizeHeadingLine(rawTitle, context, originalLevel = 2) {
  const title = normalizeHeadingTitle(rawTitle);
  const profile = context.profile || CLEANUP_PROFILES.generic;

  if (/^abstract$/i.test(title)) {
    return ["## Abstract"];
  }

  const topLevelReplacement = getExpectedTopLevelReplacement(title, context);
  if (topLevelReplacement) {
    return [formatHeading(topLevelReplacement.title, 2)];
  }

  if (profile.dropHeading?.(title, context)) {
    return [];
  }

  const replacement = profile.headingReplacements?.get(title.toLowerCase());

  if (replacement) {
    for (const item of replacement) {
      const number = parseHeadingNumber(item.title);
      if (number) {
        markSeenTopLevelNumber(number, context);
      }
    }
    return replacement.map((item) => formatHeading(item.title, item.level));
  }

  for (const splitRule of profile.splitHeadingRules || []) {
    const result = splitRule(title, context);
    if (result) {
      return result;
    }
  }

  if (PSEUDO_HEADING_PATTERN.test(title)) {
    return [title];
  }

  const numbered = title.match(/^(\d+(?:\.\d+)*)\s+(.+)$/);
  if (numbered) {
    markSeenTopLevelNumber(numbered[1], context);
    return [formatHeading(title, headingLevelForNumber(numbered[1]))];
  }

  return [formatHeading(title, originalLevel)];
}

function formatHeading(title, level) {
  return `${"#".repeat(level)} ${title}`;
}

function headingLevelForNumber(number) {
  return Math.min(6, number.split(".").length + 1);
}

export function stripMarkdownLinks(markdown) {
  let output = "";
  let index = 0;

  while (index < markdown.length) {
    const isImage = markdown[index] === "!" && markdown[index + 1] === "[";
    const labelStart = isImage ? index + 1 : index;

    if (markdown[labelStart] !== "[") {
      output += markdown[index];
      index += 1;
      continue;
    }

    const labelEnd = findClosingBracket(markdown, labelStart);
    const destinationStart = labelEnd + 1;

    if (labelEnd === -1 || markdown[destinationStart] !== "(") {
      output += markdown[index];
      index += 1;
      continue;
    }

    const destinationEnd = findClosingParen(markdown, destinationStart);
    if (destinationEnd === -1) {
      output += markdown[index];
      index += 1;
      continue;
    }

    const label = markdown.slice(labelStart + 1, labelEnd);
    output += stripMarkdownLinks(label);
    index = destinationEnd + 1;
  }

  return output;
}

function stripMarkdownLinksUntilStable(markdown) {
  let previous = markdown;

  for (let pass = 0; pass < 20; pass += 1) {
    const next = stripMarkdownLinks(previous).replace(/\[([,.;:!?])\]\([^)]+\)/g, "$1");
    if (next === previous) {
      return next;
    }
    previous = next;
  }

  return previous;
}

function findClosingBracket(markdown, openIndex) {
  for (let index = openIndex + 1; index < markdown.length; index += 1) {
    if (markdown[index] === "\\") {
      index += 1;
      continue;
    }

    if (markdown[index] === "]") {
      return index;
    }
  }

  return -1;
}

function findClosingParen(markdown, openIndex) {
  let depth = 0;

  for (let index = openIndex + 1; index < markdown.length; index += 1) {
    if (markdown[index] === "\\") {
      index += 1;
      continue;
    }

    if (markdown[index] === "(") {
      depth += 1;
      continue;
    }

    if (markdown[index] === ")") {
      if (depth === 0) {
        return index;
      }

      depth -= 1;
    }
  }

  return -1;
}

const ACM_EXPECTED_TOP_LEVEL_HEADINGS = [
  { number: 1, pattern: /^introduction$/i, title: "1 Introduction" },
  { number: 2, pattern: /^related work$/i, title: "2 Related Work" },
  { number: 3, pattern: /^formative study 1: design professional designers$/i, title: "3 Formative Study 1: Design with Professional Designers" },
  { number: 4, pattern: /^formative study 2: co-design psychological hci experts$/i, title: "4 Formative Study 2: Co-Design with Psychological and HCI Experts" },
  { number: 5, pattern: /^design requirements$/i, title: "5 Design Requirements" },
  { number: 6, pattern: /^(?:system|satori system)$/i, title: "6 Satori System" },
  { number: 7, pattern: /^evaluation$/i, title: "7 Evaluation" },
  { number: 10, pattern: /^conclusion$/i, title: "10 Conclusion" }
];

const IEEE_EXPECTED_TOP_LEVEL_HEADINGS = [
  { number: 1, pattern: /^introduction$/i, title: "1 Introduction" },
  { number: 2, pattern: /^background$/i, title: "2 Background" },
  { number: 3, pattern: /^visualization design$/i, title: "3 Visualization Design" },
  { number: 4, pattern: /^implementation$/i, title: "4 Implementation" },
  { number: 5, pattern: /^conclusions?(?: and future work)?$/i, title: "5 Conclusions and Future Work" }
];

const ACM_LINE_START_HEADINGS = [
  { pattern: /^abstract\b/i, title: "Abstract", level: 2 },
  { pattern: /^introduction\b/i, title: "Introduction", level: 2 },
  { pattern: /^related work\b/i, title: "Related Work", level: 2 },
  { pattern: /^three questions for provocation\b/i, title: "Three Questions for Provocation", level: 2 },
  { pattern: /^method\b/i, title: "Method", level: 2 },
  { pattern: /^the framework\b/i, title: "The Framework", level: 2 },
  { pattern: /^using the framework\b/i, title: "Using the Framework", level: 2 },
  { pattern: /^discussion\b/i, title: "Discussion", level: 2 },
  { pattern: /^conclusion and acknowledgements?\b/i, title: "Conclusion", level: 2 },
  { pattern: /^conclusions? and future work\b/i, title: "Conclusion and Future Work", level: 2 },
  { pattern: /^conclusions?\b/i, title: "Conclusion", level: 2 },
  { pattern: /^acknowledgements?\b/i, title: "Acknowledgements", level: 2 },
  { pattern: /^references\b/i, title: "References", level: 2 },
  { pattern: /^bibliography\b/i, title: "Bibliography", level: 2 },
  { pattern: /^ux design challenges of ai\b/i, title: "UX Design Challenges of AI", level: 3 },
  { pattern: /^facilitating human-ai interaction design\b/i, title: "Facilitating Human-AI Interaction Design", level: 3 },
  { pattern: /^what is ai\??(?=\s|$)/i, title: "What is AI?", level: 3 },
  { pattern: /^what are ai’s capabilities and limits\??(?=\s|$)/i, title: "What Are AI’s Capabilities and Limits?", level: 3 },
  { pattern: /^why is prototyping ai difficult\??(?=\s|$)/i, title: "Why Is Prototyping AI Difficult?", level: 3 },
  { pattern: /^an operational bounding of ai\b/i, title: "An Operational Bounding of AI", level: 3 },
  { pattern: /^ux design processes as data\b/i, title: "UX Design Processes as Data", level: 3 },
  { pattern: /^designing the ux of ai applications\b/i, title: "Designing the UX of AI Applications", level: 4 },
  { pattern: /^studying ux practitioners\b/i, title: "Studying UX Practitioners", level: 4 },
  { pattern: /^teaching ux design of ai applications\b/i, title: "Teaching UX Design of AI Applications", level: 4 },
  { pattern: /^data analysis\b/i, title: "Data Analysis", level: 3 },
  { pattern: /^two sources of ai design complexity\b/i, title: "Two Sources of AI Design Complexity", level: 3 },
  { pattern: /^capability uncertainty\b/i, title: "Capability Uncertainty", level: 4 },
  { pattern: /^output complexity\b/i, title: "Output Complexity", level: 4 },
  { pattern: /^two complexity sources taken together\b/i, title: "Two Complexity Sources Taken Together", level: 4 },
  { pattern: /^four levels of ai systems\b/i, title: "Four Levels of AI Systems", level: 3 },
  { pattern: /^level one:?\s+designing probabilistic systems\b/i, title: "Level One: Designing Probabilistic Systems", level: 4 },
  { pattern: /^level four:?\s+designing evolving, adaptive systems\b/i, title: "Level Four: Designing Evolving, Adaptive Systems", level: 4 },
  { pattern: /^the anatomy of ai’s hci issue\b/i, title: "The Anatomy of AI’s HCI Issue", level: 3 },
  { pattern: /^implications for design methods and tools\b/i, title: "Implications for Design Methods and Tools", level: 3 }
];

const ACM_HEADING_REPLACEMENTS = new Map([
  ["2.2 understanding intention", [{ title: "2.2 Understanding User Intention", level: 3 }]],
  ["2.3 theory mind", [{ title: "2.3 Theory of Mind", level: 3 }]],
  ["2.4 framework", [{ title: "2.4 Belief-Desire-Intention Framework", level: 3 }]],
  ["2.5 human-ai collaboration", [{ title: "2.5 User Modeling in Human-AI Collaboration", level: 3 }]],
  ["6.1 implementing bdi model for assistance", [{ title: "6.1 Implementing the BDI Model for AR Assistance", level: 3 }]],
  ["6.6 interface interaction design", [{ title: "6.6 Interface and Interaction Design", level: 3 }]],
  ["8.3 nasa tlx result cognitive load", [{ title: "8.3 NASA TLX Result on cognitive load", level: 3 }]],
  ["4.4 interview two: adaption design models for", [{ title: "4.4 Interview Two: Adaption of Design Models", level: 3 }]],
  ["discussion 9.1 toward assistance", [
    { title: "9 Discussion", level: 2 },
    { title: "9.1 Toward Proactive AR Assistance", level: 3 }
  ]],
  ["9.2 baseline guiding users", [{ title: "9.2 Satori and baseline in guiding users", level: 3 }]],
  ["9.4 advanced methods user modeling", [{ title: "9.4 Advanced methods of user modeling in AR", level: 3 }]],
  ["9.5 challenges, improvements, generalizability", [{ title: "9.5 Challenges, improvements, and generalizability", level: 3 }]],
  ["9.6 limitation future directions", [{ title: "9.6 Limitation and Future Directions", level: 3 }]]
]);

const PSEUDO_HEADING_PATTERN = /^(?:llm|bdi|[+\-−\s]+|table\s+\d+:.+|formative study results)$/i;

function getExpectedTopLevelReplacement(title, context) {
  const normalized = normalizeHeadingTitle(title);
  const expected = (context.profile?.expectedTopLevelHeadings || []).find((candidate) => (
    candidate.number >= context.nextTopLevelNumber &&
    candidate.number <= context.nextTopLevelNumber + 1 &&
    candidate.pattern.test(normalized)
  ));

  if (!expected) {
    return null;
  }

  context.nextTopLevelNumber = expected.number + 1;
  return expected;
}

function splitAcmResultsHeading(title, context) {
  const splitResultsHeading = title.match(/^results\s+(8\.1)\s+(.+)$/i);
  if (!splitResultsHeading) {
    return null;
  }

  markSeenTopLevelNumber("8", context);
  return [
    "## 8 Results",
    formatHeading(`${splitResultsHeading[1]} ${splitResultsHeading[2]}`, 3)
  ];
}

function splitAcmDiscussionHeading(title, context) {
  const splitDiscussionHeading = title.match(/^discussion\s+(9\.1)\s+(.+)$/i);
  if (!splitDiscussionHeading) {
    return null;
  }

  markSeenTopLevelNumber("9", context);
  return [
    "## 9 Discussion",
    formatHeading(`${splitDiscussionHeading[1]} Toward Proactive AR Assistance`, 3)
  ];
}

function isLikelyIeeeFigureNoiseHeading(title) {
  if (/^[a-d](?:\s+[a-d])*$/.test(title)) {
    return true;
  }

  if (/^(?:walking|detail overview)$/i.test(title)) {
    return true;
  }

  return /^[A-Z][a-z]+(?:\s+[A-Z]\.)+\s+[A-Z][a-z]+$/.test(title);
}

function isLikelyAcmBylineHeading(title) {
  if (/@/.test(title)) {
    return true;
  }

  if (/\b(?:university|laboratory|institute|department|school)\b/i.test(title)) {
    return true;
  }

  if (/\b(?:AI|HCI|UX|design|interaction|system|framework|method|study|research|analysis|question|challenge|complexity)\b/i.test(title)) {
    return false;
  }

  const words = title.split(/\s+/).filter(Boolean);
  if (words.length < 3 || words.length > 8) {
    return false;
  }

  return words.every((word) => /^[\p{Lu}][\p{L}’'-]+\.?$/u.test(word) || /^[\p{Lu}]\.?$/u.test(word));
}

function markSeenTopLevelNumber(number, context) {
  const topLevel = Number(number.split(".")[0]);
  if (Number.isInteger(topLevel) && topLevel >= context.nextTopLevelNumber) {
    context.nextTopLevelNumber = topLevel + 1;
  }
}

function promoteInlineNumberedSubsectionHeadings(markdown, profile = CLEANUP_PROFILES.generic) {
  const knownHeadingNumbers = collectHeadingNumbers(markdown);

  return markdown.split("\n").flatMap((line) => {
    if (/^\s*(?:[-*+]|\||>)/.test(line) || /^#{1,6}\s+/.test(line)) {
      return [line];
    }

    const threeLevelMatch = line.match(/^(\d+\.\d+\.\d+)\s+(.{2,120}?\.)(?:\s+(.*))?$/);
    if (threeLevelMatch) {
      const number = threeLevelMatch[1];
      const parentNumber = number.split(".").slice(0, -1).join(".");
      if (!knownHeadingNumbers.has(parentNumber)) {
        return [line];
      }

      const title = normalizeInlineSubsectionTitle(number, threeLevelMatch[2], profile);
      const rest = threeLevelMatch[3]?.trim();
      const heading = formatHeading(`${number} ${title}`, headingLevelForNumber(number));

      return rest ? [heading, "", rest] : [heading];
    }

    if (!profile.promoteTwoLevelInlineHeadings) {
      return [line];
    }

    const twoLevelMatch = line.match(/^(\d+\.\d+)\s+(.{2,90}?)(?:\s+(The|This|In|If|When|We|Our|To|For)\b\s*(.*))$/);
    if (!twoLevelMatch) {
      return [line];
    }

    const number = twoLevelMatch[1];
    const parentNumber = number.split(".").slice(0, -1).join(".");
    if (!knownHeadingNumbers.has(parentNumber)) {
      return [line];
    }

    const title = normalizeInlineSubsectionTitle(number, twoLevelMatch[2], profile);
    const rest = `${twoLevelMatch[3]} ${twoLevelMatch[4] || ""}`.trim();
    const heading = formatHeading(`${number} ${title}`, headingLevelForNumber(number));

    return rest ? [heading, "", rest] : [heading];
  }).join("\n");
}

function collectHeadingNumbers(markdown) {
  const numbers = new Set();
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/gm;
  let match;

  while ((match = headingPattern.exec(markdown)) !== null) {
    const number = parseHeadingNumber(match[2]);
    if (number) {
      numbers.add(number);
    }
  }

  return numbers;
}

function normalizeInlineSubsectionTitle(number, title, profile = CLEANUP_PROFILES.generic) {
  const cleaned = title
    .replace(/\s+/g, " ")
    .replace(/\.$/, "")
    .trim();

  return profile.inlineTitleReplacements?.get(`${number} ${cleaned}`.toLowerCase()) || cleaned;
}

const ACM_INLINE_SUBSECTION_TITLE_REPLACEMENTS = new Map([
  ["3.4.1 benefits conventional assistance", "Benefits in conventional AR assistance"],
  ["3.4.2 challenges conventional assistance", "Challenges in conventional AR assistance"],
  ["3.4.3 benefits assistance", "Benefits of Proactive AR Assistance"],
  ["3.4.4 challenges assistance", "Challenges of Proactive AR Assistance"],
  ["3.4.1 benefits in conventional ar assistance", "Benefits in conventional AR assistance"],
  ["3.4.2 challenges in conventional ar assistance", "Challenges in conventional AR assistance"],
  ["3.4.3 benefits of proactive ar assistance", "Benefits of Proactive AR Assistance"],
  ["3.4.4 challenges of proactive ar assistance", "Challenges of Proactive AR Assistance"],
  ["4.2.1 c1 triggering assistance at right time is challenging", "C1: Triggering assistance at right time is challenging"],
  ["4.2.2 c2 reusability scalability assistance are problem", "C2: Reusability and scalability in AR assistance are a problem"],
  ["4.2.3 c3 task interruption multi-task tracking pose challenges", "C3: Task interruption and multi-task tracking pose challenges"],
  ["6.1.1 bdi-guided chain-of-thought", "BDI-guided chain-of-thought"],
  ["6.2.1 action forecasting", "Action forecasting"],
  ["6.2.2 early forecasting finished action detection", "Early forecasting with finished action detection"],
  ["6.6.1 human-ai interaction design", "Human-AI interaction design"],
  ["7.0.1 tasks", "Tasks"],
  ["7.5.1 user-rated scale", "User-rated scale"],
  ["7.5.2 nasa task load index", "NASA Task Load Index"],
  ["7.5.3 one-sided wilcoxon signed-rank test", "One-Sided Wilcoxon Signed-Rank Test"],
  ["8.2.1 content", "Content"],
  ["8.2.2 timing", "Timing"],
  ["8.2.3 effectiveness", "Effectiveness"],
  ["8.2.4 as proactive assistant everyday life", "Satori as a proactive AR assistant in everyday life"],
  ["8.2.4 satori as a proactive ar assistant in everyday life", "Satori as a proactive AR assistant in everyday life"],
  ["9.5.1 interaction latency", "Interaction latency"],
  ["9.5.2 from pre-defined adaptive tasks", "From pre-defined to adaptive tasks"],
  ["9.5.2 from pre-defined to adaptive tasks", "From pre-defined to adaptive tasks"],
  ["9.5.3 constraints fov", "Constraints in FoV"],
  ["9.5.3 constraints in fov", "Constraints in FoV"],
  ["9.5.4 a broader range assistance modalities could cater diverse assistance needs", "A broader range of assistance modalities could cater to diverse needs"],
  ["9.5.4 a broader range of assistance modalities could cater to diverse", "A broader range of assistance modalities could cater to diverse needs"],
  ["9.5.5 future development for collaborative interactions social dynamics", "Future development for collaborative interactions and social dynamics"],
  ["9.5.5 future development for collaborative interactions and social", "Future development for collaborative interactions and social assistance"]
]);

const CLEANUP_PROFILES = {
  generic: {
    id: "generic",
    expectedTopLevelHeadings: [],
    headingReplacements: new Map(),
    inlineTitleReplacements: new Map(),
    splitHeadingRules: [],
    promoteLineStartHeadings: false,
    inferTitleCaseLineStartHeadings: false,
    promoteTwoLevelInlineHeadings: false
  },
  acm: {
    id: "acm",
    expectedTopLevelHeadings: ACM_EXPECTED_TOP_LEVEL_HEADINGS,
    headingReplacements: ACM_HEADING_REPLACEMENTS,
    inlineTitleReplacements: ACM_INLINE_SUBSECTION_TITLE_REPLACEMENTS,
    splitHeadingRules: [splitAcmResultsHeading, splitAcmDiscussionHeading],
    lineStartHeadings: ACM_LINE_START_HEADINGS,
    promoteLineStartHeadings: true,
    inferTitleCaseLineStartHeadings: true,
    promoteTwoLevelInlineHeadings: false,
    dropHeading: isLikelyAcmBylineHeading
  },
  ieee: {
    id: "ieee",
    expectedTopLevelHeadings: IEEE_EXPECTED_TOP_LEVEL_HEADINGS,
    headingReplacements: new Map(),
    inlineTitleReplacements: new Map(),
    splitHeadingRules: [],
    promoteLineStartHeadings: false,
    inferTitleCaseLineStartHeadings: false,
    promoteTwoLevelInlineHeadings: true,
    dropHeading: isLikelyIeeeFigureNoiseHeading
  }
};

function sortNumberedHeadingTree(markdown) {
  const root = createTreeNode({ level: 0, heading: null });
  const stack = [root];

  for (const line of markdown.split("\n")) {
    const heading = parseHeadingLine(line);

    if (!heading) {
      stack.at(-1).body.push(line);
      continue;
    }

    const node = createTreeNode(heading);
    while (stack.at(-1).level >= node.level) {
      stack.pop();
    }

    stack.at(-1).children.push(node);
    stack.push(node);
  }

  sortChildrenRecursively(root);
  return renderTree(root).trim();
}

function createTreeNode({ level, heading, number = null }) {
  return {
    level,
    heading,
    number,
    body: [],
    children: []
  };
}

function parseHeadingLine(line) {
  const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
  if (!match) {
    return null;
  }

  return {
    level: match[1].length,
    heading: line,
    title: normalizeHeadingTitle(match[2]),
    number: parseHeadingNumber(match[2])
  };
}

function parseHeadingNumber(title) {
  const match = normalizeHeadingTitle(title).match(/^(\d+(?:\.\d+)*)\b/);
  return match ? match[1] : null;
}

function sortChildrenRecursively(node) {
  node.children = sortSiblingHeadings(node.children);

  for (const child of node.children) {
    sortChildrenRecursively(child);
  }
}

function sortSiblingHeadings(children) {
  const sortable = children.filter((child) => child.number);
  if (sortable.length < 2) {
    return children;
  }

  const sortedNumbers = sortable
    .map((child) => child.number)
    .sort(compareHeadingNumbers);
  const currentNumbers = sortable.map((child) => child.number);

  if (currentNumbers.join("\n") === sortedNumbers.join("\n")) {
    return children;
  }

  const sortedQueue = [...sortable].sort((a, b) => compareHeadingNumbers(a.number, b.number));

  return children.map((child) => {
    if (!child.number) {
      return child;
    }

    return sortedQueue.shift();
  });
}

function compareHeadingNumbers(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function renderTree(node) {
  const lines = [];

  if (node.heading) {
    lines.push(node.heading);
  }

  lines.push(...node.body);

  for (const child of node.children) {
    const rendered = renderTree(child);
    if (rendered) {
      if (lines.length && lines.at(-1) !== "") {
        lines.push("");
      }
      lines.push(rendered);
    }
  }

  return lines.join("\n");
}

function findHeading(markdown, titlePattern, startIndex = 0) {
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/gm;
  headingPattern.lastIndex = startIndex;

  let match;
  while ((match = headingPattern.exec(markdown)) !== null) {
    const title = normalizeHeadingTitle(match[2]);
    if (titlePattern.test(title)) {
      return {
        start: match.index,
        end: headingPattern.lastIndex,
        title
      };
    }
  }

  return null;
}

function findNextHeading(markdown, startIndex) {
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/gm;
  headingPattern.lastIndex = startIndex;
  const match = headingPattern.exec(markdown);

  if (!match) {
    return null;
  }

  return {
    start: match.index,
    end: headingPattern.lastIndex,
    title: normalizeHeadingTitle(match[2])
  };
}

function normalizeHeadingTitle(title) {
  return title
    .replace(/[*_`[\]()]/g, "")
    .replace(/[:.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
