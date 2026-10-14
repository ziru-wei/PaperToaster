import { createAgentDocumentRef } from "./local-agent-document-client.js";

// When comparing papers from their abstracts, the agent gets a document holding
// only each paper's opening (title, authors) and Abstract section. It reuses
// the full paper's source spans and their ids, so citations in the answer
// still point into, and jump to, the full paper.

const FALLBACK_ABSTRACT_CHARS = 3000;
const OPENING_KINDS = new Set(["opening", "unknown", "abstract"]);

export async function createAbstractAgentDocument(document) {
  const spans = Array.isArray(document?.sourceSpans) ? document.sourceSpans : [];
  const markdown = String(document?.markdown || "");
  const selected = selectAbstractSpans(spans);
  if (!selected.length) {
    return document;
  }
  const start = selected[0].markdownStart;
  const end = selected.at(-1).markdownEnd;
  const abstractMarkdown = markdown.slice(start, end);
  return {
    ...document,
    markdown: abstractMarkdown,
    sourceSpans: selected.map((span) => ({
      ...span,
      markdownStart: span.markdownStart - start,
      markdownEnd: span.markdownEnd - start
    })),
    agentDocumentRef: await createAgentDocumentRef(abstractMarkdown)
  };
}

// The leading spans through the end of the Abstract section. Without a
// heading named Abstract, the opening spans up to about a page of text.
export function selectAbstractSpans(spans) {
  const abstractEnd = findLastIndex(spans, (span) => span?.section?.kind === "abstract");
  if (abstractEnd >= 0) {
    return spans.slice(0, abstractEnd + 1);
  }
  const selected = [];
  let length = 0;
  for (const span of spans) {
    const kind = span?.section?.kind || "unknown";
    if (selected.length && (!OPENING_KINDS.has(kind) || length >= FALLBACK_ABSTRACT_CHARS)) break;
    selected.push(span);
    length += span.markdownEnd - span.markdownStart;
  }
  return selected;
}

function findLastIndex(items, predicate) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) return index;
  }
  return -1;
}
