export const PAPER_OVERVIEW_VERSION = 1;

const OVERVIEW_SECTION_ORDER = [
  "abstract",
  "introduction",
  "method",
  "system",
  "study-design",
  "result",
  "evaluation",
  "discussion",
  "limitation",
  "conclusion"
];

const MAX_SECTION_EXCERPT_CHARS = 900;
const MAX_OVERVIEW_CHARS = 6000;

export function createPaperOverview(document) {
  const chunks = Array.isArray(document?.chunks) ? document.chunks : [];
  const sections = selectOverviewSections(chunks);
  const overviewText = formatPaperOverviewText({
    title: document?.title || "",
    pageCount: document?.pageCount || null,
    sections
  });

  return {
    kind: "paper-overview",
    version: PAPER_OVERVIEW_VERSION,
    createdAt: new Date().toISOString(),
    title: document?.title || "",
    pageCount: document?.pageCount || null,
    sections,
    text: overviewText.slice(0, MAX_OVERVIEW_CHARS).trim()
  };
}

export function ensurePaperOverview(document) {
  if (document?.overview?.version === PAPER_OVERVIEW_VERSION && document.overview.text) {
    return document.overview;
  }

  return createPaperOverview(document);
}

function selectOverviewSections(chunks) {
  const firstByKind = new Map();
  const fallback = [];

  for (const chunk of chunks) {
    const text = normalizeText(chunk?.text || "");
    if (!text) {
      continue;
    }

    const section = chunk.section || {};
    const kind = section.kind || "body";
    const item = {
      chunkId: chunk.id || "",
      pageStart: chunk.pageStart || null,
      pageEnd: chunk.pageEnd || chunk.pageStart || null,
      sectionTitle: section.title || "Opening",
      sectionKind: kind,
      excerpt: createExcerpt(text)
    };

    if (!firstByKind.has(kind)) {
      firstByKind.set(kind, item);
    }

    if (fallback.length < 6) {
      fallback.push(item);
    }
  }

  const ordered = OVERVIEW_SECTION_ORDER
    .map((kind) => firstByKind.get(kind))
    .filter(Boolean);

  if (ordered.length >= 3) {
    return ordered;
  }

  return dedupeSections([...ordered, ...fallback]).slice(0, 8);
}

function formatPaperOverviewText({ title, pageCount, sections }) {
  const lines = [
    title ? `Title: ${title}` : "",
    pageCount ? `Pages: ${pageCount}` : "",
    "",
    "Section-aware paper overview evidence:"
  ].filter(Boolean);

  for (const section of sections) {
    lines.push("");
    lines.push(`[${section.sectionKind} | ${section.sectionTitle} | ${formatPageLabel(section)}]`);
    lines.push(section.excerpt);
  }

  return lines.join("\n").trim();
}

function createExcerpt(text) {
  return normalizeText(text)
    .slice(0, MAX_SECTION_EXCERPT_CHARS)
    .trim();
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPageLabel(section) {
  if (!section.pageStart) {
    return "page unknown";
  }

  if (section.pageEnd && section.pageEnd !== section.pageStart) {
    return `pages ${section.pageStart}-${section.pageEnd}`;
  }

  return `page ${section.pageStart}`;
}

function dedupeSections(sections) {
  const seen = new Set();
  const output = [];

  for (const section of sections) {
    const key = `${section.sectionKind}:${section.sectionTitle}:${section.chunkId}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(section);
  }

  return output;
}
