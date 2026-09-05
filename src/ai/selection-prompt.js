export function formatSelectionContextForPrompt(contextPack) {
  const paperTitle = contextPack.paper.title || "Untitled paper";
  const lines = [
    `Paper: ${paperTitle}`,
    `URL: ${contextPack.paper.url || "unknown"}`,
    "",
    "Selected text:",
    contextPack.selection.text,
    "",
    "Nearby paper context:",
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

function formatChunks(chunks) {
  if (!chunks.length) {
    return "(No context available.)";
  }

  return chunks.map((chunk) => {
    const pageLabel = formatPageLabel(chunk);
    return `[${chunk.id || pageLabel} | ${pageLabel}]\n${chunk.text}`;
  }).join("\n\n");
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
