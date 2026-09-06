import { getPaperReadingPolicyPrompt } from "../ai/selection-prompt.js";

const COMPARISON_POLICY = [
  "Comparative reading policy:",
  "- Compare across papers instead of summarizing each paper in isolation.",
  "- Use paper labels such as [P1] and [P2] when attributing claims.",
  "- Separate direct evidence from inference when the distinction matters.",
  "- If the provided context is insufficient, state what is missing.",
  "- Do not invent paper claims, methods, results, or citations."
].join("\n");

export function buildComparisonPrompt({ contextPack, systemPrompt, conversationMessages = [] }) {
  const normalizedSystemPrompt = String(systemPrompt || "").trim();
  return [
    normalizedSystemPrompt,
    "",
    getPaperReadingPolicyPrompt(),
    "",
    COMPARISON_POLICY,
    "",
    "Previous comparative conversation:",
    formatConversationMessages(conversationMessages),
    "",
    formatComparisonContextForPrompt(contextPack)
  ].join("\n").trim();
}

export function formatComparisonContextForPrompt(contextPack) {
  const lines = [
    "Task: Comparative reading",
    `Question route: ${contextPack.comparisonPlan?.intent?.id || "general_synthesis"}`,
    "",
    "Selected papers:",
    ...contextPack.papers.map((paper) => `[${paper.label}] ${paper.title}${paper.canonicalUrl ? ` | ${paper.canonicalUrl}` : ""}`),
    "",
    "Evidence packets:",
    ...contextPack.papers.flatMap(formatPaperEvidence),
    "",
    "User question:",
    contextPack.question || "(No question provided.)"
  ];

  const warnings = contextPack.comparisonPlan?.warnings || [];
  if (warnings.length) {
    lines.splice(3, 0, "Context warnings:", ...warnings.map((warning) => `- ${warning}`), "");
  }

  return lines.join("\n").trim();
}

function formatPaperEvidence(paper) {
  return [
    `[${paper.label}] ${paper.title}`,
    paper.overview?.text ? `Overview:\n${paper.overview.text}` : "Overview:\n(No overview available.)",
    "Relevant excerpts:",
    formatEvidenceChunks(paper.selectedEvidence),
    ""
  ];
}

function formatEvidenceChunks(chunks) {
  if (!chunks?.length) {
    return "(No retrieved evidence available.)";
  }

  return chunks.map((chunk) => {
    const pageLabel = formatPageLabel(chunk);
    const sectionLabel = formatSectionLabel(chunk.section);
    return `- [${chunk.id || pageLabel} | ${pageLabel}${sectionLabel ? ` | ${sectionLabel}` : ""}]\n${chunk.text}`;
  }).join("\n\n");
}

function formatConversationMessages(messages) {
  const visibleMessages = messages
    .filter((message) => message?.role && message?.text)
    .slice(-8);

  if (!visibleMessages.length) {
    return "(No previous messages.)";
  }

  return visibleMessages
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.text}`)
    .join("\n\n");
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
