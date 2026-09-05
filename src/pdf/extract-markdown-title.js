import { selectDocumentTitle } from "./select-title.js";

const NON_TITLE_HEADINGS = new Set([
  "abstract",
  "introduction",
  "background",
  "related work",
  "methods",
  "method",
  "results",
  "discussion",
  "conclusion",
  "conclusions",
  "references",
  "bibliography",
  "keywords",
  "index terms",
  "ccs concepts",
  "acknowledgements",
  "acknowledgments"
]);

export function extractRawMarkdownHeadingTitle(markdown, options = {}) {
  const diagnose = options.onDiagnostic || (() => {});
  const candidates = collectRawMarkdownHeadingCandidates(markdown);
  const selected = selectFirstUsableHeadingTitle(candidates);

  if (selected.title) {
    diagnose(`Raw Markdown heading title selected: ${selected.title} (${selected.source})`);
  } else if ((markdown || "").trim()) {
    diagnose("No usable Raw Markdown heading title found.");
  }

  return selected;
}

function collectRawMarkdownHeadingCandidates(markdown = "") {
  const candidates = [];
  const lines = String(markdown).split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^(#{1,6})(?!#)\s+(.+?)\s*#*\s*$/);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    const title = normalizeMarkdownHeadingTitle(match[2]);
    if (!title || NON_TITLE_HEADINGS.has(title.toLowerCase())) {
      continue;
    }

    candidates.push({
      text: title,
      source: `raw-markdown-h${level}`,
      score: 1000,
      level,
      lineNumber: index + 1
    });
  }

  return candidates;
}

function selectFirstUsableHeadingTitle(candidates) {
  const orderedCandidates = [...candidates].sort((left, right) => left.lineNumber - right.lineNumber);
  const firstUsableH1 = selectFirstUsableCandidate(orderedCandidates.filter((candidate) => candidate.level === 1));

  if (firstUsableH1.title) {
    return {
      ...firstUsableH1,
      candidates: orderedCandidates
    };
  }

  const firstUsableHeading = selectFirstUsableCandidate(orderedCandidates);
  return {
    ...firstUsableHeading,
    candidates: orderedCandidates
  };
}

function selectFirstUsableCandidate(candidates) {
  for (const candidate of candidates) {
    const selected = selectDocumentTitle([candidate]);
    if (selected.title) {
      return selected;
    }
  }

  return {
    title: "",
    source: "",
    candidates: []
  };
}

function normalizeMarkdownHeadingTitle(title) {
  return String(title || "")
    .replace(/\[([^\]]*)]\([^)]+\)/g, "$1")
    .replace(/^[\s*_`]+|[\s*_`]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
