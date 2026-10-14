const DEFAULT_CHUNK_CHARS = 5000;
export function createMarkdownSourceSpans(markdown, options = {}) {
  const text = String(markdown || "");
  const maxChars = options.maxChars || DEFAULT_CHUNK_CHARS;
  const spans = [];
  let sectionState = createSectionState();
  let start = 0;

  while (start < text.length) {
    const end = findSourceSpanEnd(text, start, maxChars);
    const spanText = text.slice(start, end);
    const section = getSectionForChunk(spanText, 0, sectionState);
    sectionState = section.state;
    spans.push({
      id: `source-span-${spans.length + 1}`,
      index: spans.length + 1,
      markdownStart: start,
      markdownEnd: end,
      pageStart: null,
      pageEnd: null,
      section: section.section
    });
    start = end;
  }

  return spans;
}

function findSourceSpanEnd(text, start, maxChars) {
  const hardEnd = Math.min(start + maxChars, text.length);
  if (hardEnd >= text.length) {
    return text.length;
  }

  const headingPattern = /^#{1,6}\s+.+?\s*#*\s*$/gm;
  headingPattern.lastIndex = start + 1;
  const nextHeading = headingPattern.exec(text);
  if (nextHeading && nextHeading.index <= hardEnd) {
    return nextHeading.index;
  }

  const minimumEnd = start + Math.floor(maxChars * 0.55);
  const paragraphEnd = text.lastIndexOf("\n\n", hardEnd);
  if (paragraphEnd >= minimumEnd) {
    return paragraphEnd + 2;
  }

  const lineEnd = text.lastIndexOf("\n", hardEnd);
  if (lineEnd >= minimumEnd) {
    return lineEnd + 1;
  }

  const sentenceEnd = Math.max(
    text.lastIndexOf(". ", hardEnd),
    text.lastIndexOf("? ", hardEnd),
    text.lastIndexOf("! ", hardEnd)
  );
  if (sentenceEnd >= minimumEnd) {
    return sentenceEnd + 2;
  }

  const wordEnd = text.lastIndexOf(" ", hardEnd);
  return wordEnd >= minimumEnd ? wordEnd + 1 : hardEnd;
}

function getSectionForChunk(text, chunkStart, previousState) {
  const state = updateSectionState(previousState, text, chunkStart);
  return {
    state,
    section: state.current || createUnknownSection()
  };
}

function updateSectionState(previousState, text, offset = 0) {
  const state = cloneSectionState(previousState);
  const headingPattern = /^#{1,6}\s+(.+?)\s*#*\s*$/gm;
  let match;

  while ((match = headingPattern.exec(text)) !== null) {
    if (match.index > Math.max(0, offset + 32)) {
      break;
    }

    const level = match[0].match(/^#+/)?.[0].length || 2;
    const parsed = parseHeadingTitle(match[1]);
    const section = {
      key: `section-${state.nextSectionIndex}`,
      title: parsed.title,
      normalizedTitle: normalizeHeading(parsed.title),
      level,
      number: parsed.number,
      kind: classifySectionKind(parsed.title),
      path: []
    };
    state.nextSectionIndex += 1;
    state.stack = state.stack.filter((entry) => entry.level < level);
    state.stack.push(section);
    section.path = state.stack.map((entry) => entry.title);
    state.current = section;
  }

  return state;
}

function parseHeadingTitle(rawTitle) {
  const normalized = String(rawTitle || "")
    .replace(/\s+/g, " ")
    .trim();
  const numbered = normalized.match(/^((?:\d+\.)*\d+)\.?\s+(.+)$/);
  if (!numbered) {
    return {
      number: "",
      title: normalized
    };
  }

  return {
    number: numbered[1],
    title: numbered[2].trim()
  };
}

function classifySectionKind(title) {
  const normalized = normalizeHeading(title);
  if (!normalized) {
    return "unknown";
  }

  if (/\babstract\b/.test(normalized)) {
    return "abstract";
  }

  if (/\bintroduction\b|\bintro\b/.test(normalized)) {
    return "introduction";
  }

  if (/\brelated\b|\bbackground\b|\bprior\b/.test(normalized)) {
    return "related-work";
  }

  if (/\bmethod\b|\bmethodology\b|\bapproach\b|\bdesign\b/.test(normalized)) {
    return "method";
  }

  if (/\bsystem\b|\barchitecture\b|\bimplementation\b|\bprototype\b/.test(normalized)) {
    return "system";
  }

  if (/\bstudy\b|\bparticipants?\b|\bprocedure\b|\bmaterials?\b/.test(normalized)) {
    return "study-design";
  }

  if (/\bresults?\b|\bfindings?\b/.test(normalized)) {
    return "result";
  }

  if (/\bevaluation\b|\bexperiment\b|\banalysis\b/.test(normalized)) {
    return "evaluation";
  }

  if (/\bdiscussion\b|\bimplications?\b/.test(normalized)) {
    return "discussion";
  }

  if (/\blimitations?\b|\bthreats?\b|\bfuture work\b/.test(normalized)) {
    return "limitation";
  }

  if (/\bconclusions?\b|\bsummary\b/.test(normalized)) {
    return "conclusion";
  }

  return "body";
}

function normalizeHeading(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function createSectionState() {
  return {
    current: null,
    stack: [],
    nextSectionIndex: 1
  };
}

function cloneSectionState(state) {
  return {
    current: state?.current || null,
    stack: [...(state?.stack || [])],
    nextSectionIndex: state?.nextSectionIndex || 1
  };
}

function createUnknownSection() {
  return {
    key: "section-0",
    title: "Opening",
    normalizedTitle: "opening",
    level: 1,
    number: "",
    kind: "opening",
    path: ["Opening"]
  };
}
