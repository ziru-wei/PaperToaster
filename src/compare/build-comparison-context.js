import { getStoredDocumentByDocumentKey } from "../storage/document-store.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";
import { DEFAULT_COMPARISON_PAPER_LIMIT, normalizeComparisonPaperLimit } from "../storage/comparison-settings-store.js";
import { ensurePaperOverview } from "../rag/paper-overview.js";
import { retrieveComparisonEvidence, routeComparisonQuestion } from "./comparison-retrieve.js";

const OVERVIEW_MAX_CHARS = 900;
const EVIDENCE_MAX_CHARS_PER_PAPER = 3600;
const EVIDENCE_LIMIT_PER_PAPER = 3;

export async function buildComparisonContextPack({
  documentKeys = [],
  question = "",
  maxPapers = DEFAULT_COMPARISON_PAPER_LIMIT
}) {
  const paperLimit = normalizeComparisonPaperLimit(maxPapers);
  const keys = normalizeDocumentKeys(documentKeys, paperLimit);
  if (keys.length < 2) {
    throw new Error("Choose at least two papers for comparative reading.");
  }

  const normalizedQuestion = normalizeQuestion(question);
  if (!normalizedQuestion) {
    throw new Error("Enter a comparative question.");
  }

  const intent = routeComparisonQuestion(normalizedQuestion);
  const papers = [];
  const warnings = [];

  for (let index = 0; index < keys.length; index += 1) {
    const documentKey = keys[index];
    const [summary, document] = await Promise.all([
      getLibraryPaperSummary(documentKey),
      getStoredDocumentByDocumentKey(documentKey)
    ]);

    if (!document?.markdown) {
      warnings.push(`P${index + 1} has no cached Markdown and was skipped.`);
      continue;
    }

    const overview = ensurePaperOverview(document);
    const evidence = retrieveComparisonEvidence({
      document,
      question: normalizedQuestion,
      intent,
      maxChars: EVIDENCE_MAX_CHARS_PER_PAPER,
      limit: EVIDENCE_LIMIT_PER_PAPER
    });

    papers.push({
      label: `P${papers.length + 1}`,
      documentKey,
      title: summary?.title || document.title || "Untitled paper",
      canonicalUrl: summary?.canonicalUrl || document.url || "",
      metadata: document.metadata || summary?.metadata || null,
      overview: overview?.text ? {
        text: clipText(overview.text, OVERVIEW_MAX_CHARS)
      } : null,
      selectedEvidence: evidence
    });
  }

  if (papers.length < 2) {
    throw new Error("At least two selected papers need cached Markdown before comparison can run.");
  }

  return {
    kind: "comparison-context-pack",
    version: 1,
    mode: "comparative-reading",
    createdAt: new Date().toISOString(),
    question: normalizedQuestion,
    papers,
    comparisonPlan: {
      intent,
      maxPapers: paperLimit,
      evidenceBudgetPerPaper: EVIDENCE_MAX_CHARS_PER_PAPER,
      evidenceLimitPerPaper: EVIDENCE_LIMIT_PER_PAPER,
      warnings
    }
  };
}

function normalizeDocumentKeys(documentKeys, maxPapers) {
  return [...new Set((Array.isArray(documentKeys) ? documentKeys : [])
    .map((key) => String(key || "").trim())
    .filter(Boolean))]
    .slice(0, maxPapers);
}

function normalizeQuestion(question) {
  return String(question || "")
    .replace(/\s+/g, " ")
    .trim();
}

function clipText(text, maxChars) {
  const value = String(text || "").trim();
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 1)).trim()}...`;
}
