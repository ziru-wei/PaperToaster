const DEFAULT_CHUNK_CHARS = 5000;
const DEFAULT_OVERLAP_CHARS = 500;

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

export function chunkDocument(document, options = {}) {
  const chunkSize = options.chunkSize || DEFAULT_CHUNK_CHARS;
  const overlap = options.overlap || DEFAULT_OVERLAP_CHARS;
  const chunks = [];
  let sectionState = createSectionState();
  const citationSectionKeys = new Map();
  const citationBaseCounts = new Map();
  const chunkCountsBySection = new Map();

  for (const page of document.pages) {
    const text = page.text.trim();
    if (!text) {
      continue;
    }

    const blocks = splitPageIntoSectionBlocks(text, sectionState);
    for (const block of blocks) {
      sectionState = block.state;
      const citationSectionKey = getCitationSectionKey(
        block.section,
        citationSectionKeys,
        citationBaseCounts
      );
      let start = 0;

      while (start < block.text.length) {
        const end = Math.min(start + chunkSize, block.text.length);
        const chunkText = block.text.slice(start, end).trim();

        if (chunkText) {
          const chunkIndex = (chunkCountsBySection.get(citationSectionKey) || 0) + 1;
          chunkCountsBySection.set(citationSectionKey, chunkIndex);
          chunks.push({
            id: `${citationSectionKey}-c${chunkIndex}`,
            pageStart: page.pageNumber,
            pageEnd: page.pageNumber,
            section: block.section,
            text: chunkText
          });
        }

        if (end >= block.text.length) {
          break;
        }

        start = Math.max(end - overlap, start + 1);
      }
    }
  }

  return chunks;
}

function getCitationSectionKey(section, sectionKeys, baseCounts) {
  const sectionIdentity = section?.key || "section-0";
  if (sectionKeys.has(sectionIdentity)) {
    return sectionKeys.get(sectionIdentity);
  }

  const base = slugifyCitationPart(section?.title || section?.kind || "opening") || "opening";
  const count = (baseCounts.get(base) || 0) + 1;
  baseCounts.set(base, count);
  const key = count === 1 ? base : `${base}-${count}`;
  sectionKeys.set(sectionIdentity, key);
  return key;
}

function slugifyCitationPart(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");
}

function splitPageIntoSectionBlocks(text, initialState) {
  const headingPattern = /^#{1,6}\s+.+?\s*#*\s*$/gm;
  const matches = [...text.matchAll(headingPattern)]
    .filter((match) => isPlausibleAcademicHeading(match[0]));
  const blocks = [];
  let state = cloneSectionState(initialState);

  if (!matches.length) {
    const section = state.current || createUnknownSection();
    return [{
      text,
      section,
      state
    }];
  }

  if (matches[0].index > 0) {
    const preface = text.slice(0, matches[0].index).trim();
    if (preface) {
      blocks.push({
        text: preface,
        section: state.current || createUnknownSection(),
        state
      });
    }
  }

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const blockText = text.slice(start, end).trim();
    if (!blockText) {
      continue;
    }

    state = updateSectionState(state, match[0], 0);
    blocks.push({
      text: blockText,
      section: state.current || createUnknownSection(),
      state
    });
  }

  return blocks;
}

export function annotateChunksWithSections(chunks) {
  let sectionState = createSectionState();

  return (chunks || []).map((chunk) => {
    const text = String(chunk?.text || chunk?.markdown || "");
    const section = getSectionForChunk(text, 0, sectionState);
    sectionState = section.state;
    return {
      ...chunk,
      section: chunk.section || section.section
    };
  });
}

export function createSectionOutline(chunks) {
  const sections = [];
  const seen = new Set();

  for (const chunk of chunks || []) {
    const section = chunk?.section;
    const key = section?.key || "";
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    sections.push({
      key,
      title: section.title,
      normalizedTitle: section.normalizedTitle,
      level: section.level,
      number: section.number,
      kind: section.kind,
      firstChunkId: chunk.id || "",
      pageStart: chunk.pageStart || null
    });
  }

  return sections;
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

function isPlausibleAcademicHeading(markdownHeading) {
  const level = markdownHeading.match(/^#+/)?.[0].length || 0;
  const rawTitle = markdownHeading.replace(/^#{1,6}\s+/, "").replace(/\s*#*\s*$/g, "");
  const parsed = parseHeadingTitle(rawTitle);
  const title = parsed.title;
  const normalized = normalizeHeading(title);
  const wordCount = normalized ? normalized.split(/\s+/).length : 0;
  const digitCount = (title.match(/\d/g) || []).length;
  const letterCount = (title.match(/[A-Za-z]/g) || []).length;

  if (!title || title.length < 2 || title.length > 150 || wordCount > 18) {
    return false;
  }

  if (/https?:\/\/|doi\.org|@|copyright|permission|proceedings|isbn|issn/i.test(title)) {
    return false;
  }

  if (digitCount > letterCount && classifySectionKind(title) === "body") {
    return false;
  }

  if (/[.;,:]\s*$/.test(title) && classifySectionKind(title) === "body") {
    return false;
  }

  return level >= 1 && level <= 6;
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
