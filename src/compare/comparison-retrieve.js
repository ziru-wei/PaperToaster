import { buildEvidenceContext, compressChunkForEvidence } from "../rag/evidence-context.js";

export const COMPARISON_INTENTS = Object.freeze({
  CONTRIBUTION: "contribution_compare",
  METHOD: "method_compare",
  EVIDENCE: "evidence_compare",
  LIMITATION: "limitation_compare",
  THEORY: "theory_compare",
  GENERAL: "general_synthesis"
});

const INTENT_RULES = [
  {
    id: COMPARISON_INTENTS.CONTRIBUTION,
    sectionKinds: ["abstract", "introduction", "conclusion", "discussion"],
    patterns: [/\bcontributions?\b/i, /\bnovel(?:ty)?\b/i, /\bmain\s+(?:point|advance|idea)\b/i, /\badvance\b/i, /贡献|创新|主要观点|新意/]
  },
  {
    id: COMPARISON_INTENTS.METHOD,
    sectionKinds: ["method", "system", "study-design", "implementation", "evaluation"],
    patterns: [/\bmethods?\b/i, /\bmethodolog(?:y|ical)\b/i, /\bsystem\b/i, /\bstudy\b/i, /\bmodel\b/i, /\bimplementation\b/i, /方法|系统|实验|设计|模型/]
  },
  {
    id: COMPARISON_INTENTS.EVIDENCE,
    sectionKinds: ["result", "evaluation", "finding", "discussion"],
    patterns: [/\bevidence\b/i, /\bresults?\b/i, /\bfindings?\b/i, /\bevaluation\b/i, /\bperformance\b/i, /证据|结果|发现|评估/]
  },
  {
    id: COMPARISON_INTENTS.LIMITATION,
    sectionKinds: ["limitation", "discussion", "conclusion"],
    patterns: [/\blimitations?\b/i, /\bthreats?\b/i, /\bcaveats?\b/i, /\bfuture\s+work\b/i, /局限|限制|不足|未来工作/]
  },
  {
    id: COMPARISON_INTENTS.THEORY,
    sectionKinds: ["introduction", "related-work", "discussion"],
    patterns: [/\btheor(?:y|etical)\b/i, /\bframework\b/i, /\bconceptual\b/i, /\bassumptions?\b/i, /理论|框架|概念|假设/]
  }
];

export function routeComparisonQuestion(question = "") {
  const normalized = String(question || "").replace(/\s+/g, " ").trim();
  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      return {
        id: rule.id,
        sectionKinds: rule.sectionKinds,
        reason: `Matched ${rule.id} cues.`
      };
    }
  }

  return {
    id: COMPARISON_INTENTS.GENERAL,
    sectionKinds: ["abstract", "introduction", "method", "result", "discussion", "conclusion"],
    reason: "Default comparative synthesis route."
  };
}

export function retrieveComparisonEvidence({ document, question, intent, maxChars = 3600, limit = 3 }) {
  const chunks = Array.isArray(document?.chunks) ? document.chunks : [];
  if (!chunks.length) {
    return [];
  }

  const evidence = buildEvidenceContext({
    chunks,
    query: question,
    intent,
    limit,
    maxChars
  });

  if (evidence.length) {
    return evidence.map((chunk) => packEvidenceChunk(chunk, "retrieved"));
  }

  return chunks.slice(0, Math.max(1, limit))
    .map((chunk) => packEvidenceChunk(compressChunkForEvidence(chunk, question, { maxChars: 1200 }), "section-sample"));
}

function packEvidenceChunk(chunk, source) {
  return {
    id: chunk.id || "",
    pageStart: chunk.pageStart || null,
    pageEnd: chunk.pageEnd || chunk.pageStart || null,
    section: chunk.section || null,
    score: typeof chunk.score === "number" ? chunk.score : null,
    source,
    text: chunk.text || ""
  };
}
