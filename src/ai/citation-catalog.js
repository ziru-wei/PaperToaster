export function createSourceSpanCitationContext({ document, paperIndex = 1, title = "", shortName = "" }) {
  const paperId = `p${Math.max(1, Number(paperIndex) || 1)}`;
  const headings = {};
  const headingIds = new Map();
  const chunkCounts = new Map();
  const sourceSpanCitationIds = new Map();

  for (const span of document?.sourceSpans || []) {
    const section = span?.section || {};
    const sectionKey = section.key || `${section.title || section.kind || "Opening"}`;
    if (!headingIds.has(sectionKey)) {
      const headingId = `h${headingIds.size + 1}`;
      headingIds.set(sectionKey, headingId);
      headings[headingId] = String(section.title || section.kind || "Opening").trim() || "Opening";
    }
    const headingId = headingIds.get(sectionKey);
    const chunkIndex = (chunkCounts.get(headingId) || 0) + 1;
    chunkCounts.set(headingId, chunkIndex);
    sourceSpanCitationIds.set(span.id, `${paperId}-${headingId}-c${chunkIndex}`);
  }

  const paperTitle = String(title || document?.title || "Untitled paper").trim();
  return {
    paper: {
      id: paperId,
      shortName: String(shortName || createPaperCitationShortName(paperTitle)).trim(),
      title: paperTitle,
      documentKey: String(document?.documentKey || "").trim(),
      canonicalUrl: String(document?.url || "").trim(),
      headings
    },
    sourceSpanCitationIds,
    sourceSpanCitations: [...sourceSpanCitationIds].map(([sourceSpanId, citationId]) => ({
      sourceSpanId,
      citationId
    }))
  };
}

export function createPaperCitationShortName(title) {
  const words = String(title || "")
    .normalize("NFKD")
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu) || [];
  return words.slice(0, 3).map((word) => [...word].slice(0, 3).join("")).join("-") || "pap";
}

export function normalizeCitationCatalog(catalog) {
  const papers = (Array.isArray(catalog?.papers) ? catalog.papers : [])
    .map((paper, index) => ({
      id: /^p\d+$/.test(paper?.id) ? paper.id : `p${index + 1}`,
      shortName: String(paper?.shortName || "").trim().slice(0, 48),
      title: String(paper?.title || "").trim().slice(0, 500),
      documentKey: String(paper?.documentKey || "").trim().slice(0, 1000),
      canonicalUrl: String(paper?.canonicalUrl || "").trim().slice(0, 4000),
      headings: Object.fromEntries(Object.entries(paper?.headings || {})
        .filter(([key, value]) => /^h\d+$/.test(key) && String(value || "").trim())
        .map(([key, value]) => [key, String(value).trim().slice(0, 300)]))
    }))
    .filter((paper) => paper.shortName);
  return papers.length ? { version: 1, papers } : null;
}
