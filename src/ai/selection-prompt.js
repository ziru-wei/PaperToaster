const PAPER_READING_POLICY = [
  "Paper reading answer policy:",
  "- Use only the supplied paper context, overview, selected text, and conversation history.",
  "- If context is insufficient, say exactly what is missing instead of guessing.",
  "- For selected text, explain the local meaning first, then connect it to the paper-level argument.",
  "- For whole-paper overview questions, synthesize from the cached overview and retrieved section evidence.",
  "- Cite page/chunk labels when they are useful for grounding."
].join("\n");

export function formatSelectionContextForPrompt(contextPack) {
  const paperTitle = contextPack.paper.title || "Untitled paper";
  const hasSelection = Boolean(contextPack.selection.text);
  const intent = contextPack.intent?.id || "targeted_qa";
  const intentSource = contextPack.intent?.source || "rule";
  const lines = [
    `Paper: ${paperTitle}`,
    `URL: ${contextPack.paper.url || "unknown"}`,
    `Question route: ${intent} (${intentSource})`,
    "",
    ...formatOverviewBlock(contextPack.overview),
    "",
    hasSelection ? "Selected text:" : "Scope:",
    hasSelection ? contextPack.selection.text : "No selected text was provided. Answer from the paper context.",
    "",
    hasSelection ? "Nearby paper context:" : "Opening paper context:",
    formatChunks(contextPack.context.local),
    "",
    "Retrieved paper context:",
    formatChunks(contextPack.context.retrieved),
    "",
    "User question:",
    contextPack.question || "(No question provided.)"
  ];

  return lines.join("\n").trim();
}

export function getPaperReadingPolicyPrompt() {
  return PAPER_READING_POLICY;
}

function formatChunks(chunks) {
  if (!chunks.length) {
    return "(No context available.)";
  }

  return chunks.map((chunk) => {
    const pageLabel = formatPageLabel(chunk);
    const sectionLabel = formatSectionLabel(chunk.section);
    return `[${chunk.id || pageLabel} | ${pageLabel}${sectionLabel ? ` | ${sectionLabel}` : ""}]\n${chunk.text}`;
  }).join("\n\n");
}

function formatOverviewBlock(overview) {
  if (!overview?.text) {
    return [];
  }

  return [
    "Cached paper overview:",
    overview.text
  ];
}

function formatSectionLabel(section) {
  if (!section?.title && !section?.kind) {
    return "";
  }

  return [section.kind, section.title].filter(Boolean).join(": ");
}

function formatPageLabel(chunk) {
  if (!chunk.pageStart) {
    return "page unknown";
  }

  if (chunk.pageEnd && chunk.pageEnd !== chunk.pageStart) {
    return `pages ${chunk.pageStart}-${chunk.pageEnd}`;
  }

  return `page ${chunk.pageStart}`;
}
