export const QUERY_INTENTS = Object.freeze({
  SELECTION_EXPLAIN: "selection_explain",
  PAPER_OVERVIEW: "paper_overview",
  METHOD: "method_question",
  RESULT: "result_question",
  LIMITATION: "limitation_question",
  COMPARISON: "comparison_question",
  TARGETED_QA: "targeted_qa"
});

const ROUTES = Object.freeze([
  {
    id: QUERY_INTENTS.SELECTION_EXPLAIN,
    label: "Explain selection"
  },
  {
    id: QUERY_INTENTS.TARGETED_QA,
    label: "Targeted answer"
  },
  {
    id: QUERY_INTENTS.PAPER_OVERVIEW,
    label: "Paper overview"
  },
  {
    id: QUERY_INTENTS.METHOD,
    label: "Method"
  },
  {
    id: QUERY_INTENTS.RESULT,
    label: "Findings"
  },
  {
    id: QUERY_INTENTS.LIMITATION,
    label: "Limitations"
  },
  {
    id: QUERY_INTENTS.COMPARISON,
    label: "Compare"
  }
]);

const PAPER_OVERVIEW_PATTERNS = [
  /\bexplain\s+(?:the|this)\s+paper\b/i,
  /\bsummar(?:y|ize)\s+(?:the|this)\s+paper\b/i,
  /\bwhat\s+is\s+(?:the|this)\s+paper\s+about\b/i,
  /\boverview\s+of\s+(?:the|this)\s+paper\b/i,
  /这篇文章.*(?:讲|说|总结|解释)/,
  /解释.*这篇/,
  /总结.*这篇/
];

const INTENT_PATTERNS = [
  {
    id: QUERY_INTENTS.LIMITATION,
    patterns: [/\blimitations?\b/i, /\bthreats?\s+to\s+validity\b/i, /\bcaveats?\b/i, /\bfuture\s+work\b/i, /局限|限制|不足|未来工作/]
  },
  {
    id: QUERY_INTENTS.METHOD,
    patterns: [/\bmethods?\b/i, /\bmethodolog(?:y|ical)\b/i, /\bstudy\s+design\b/i, /\bprocedure\b/i, /\bsystem\b/i, /\bmodel\b/i, /\bimplementation\b/i, /方法|设计|系统|实验流程|怎么做/]
  },
  {
    id: QUERY_INTENTS.RESULT,
    patterns: [/\bresults?\b/i, /\bfindings?\b/i, /\bevaluation\b/i, /\bexperiment\b/i, /\bstudy\b/i, /\bevidence\b/i, /\bperformance\b/i, /结果|发现|实验|评估|证据/]
  },
  {
    id: QUERY_INTENTS.COMPARISON,
    patterns: [/\bcompare\b/i, /\bcontrast\b/i, /\bdifferen(?:ce|t)\b/i, /\bversus\b/i, /\bvs\.?\b/i, /比较|区别|不同|相比/]
  }
];

export function routePaperQuestion({ question = "", selectionText = "" } = {}) {
  const normalizedQuestion = normalizeQuery(question);
  const normalizedSelection = normalizeQuery(selectionText);

  if (!normalizedQuestion) {
    return createIntent(QUERY_INTENTS.PAPER_OVERVIEW, "No focused question was provided.");
  }

  if (PAPER_OVERVIEW_PATTERNS.some((pattern) => pattern.test(normalizedQuestion))) {
    return createIntent(QUERY_INTENTS.PAPER_OVERVIEW, "Question asks for a whole-paper overview.");
  }

  if (normalizedSelection) {
    return createIntent(QUERY_INTENTS.SELECTION_EXPLAIN, "Selected text is present.");
  }

  for (const candidate of INTENT_PATTERNS) {
    if (candidate.patterns.some((pattern) => pattern.test(normalizedQuestion))) {
      return createIntent(candidate.id, `Matched ${candidate.id} cues.`);
    }
  }

  return createIntent(QUERY_INTENTS.TARGETED_QA, "Default focused question answering route.");
}

export function listPaperQuestionRoutes() {
  return ROUTES.map((route) => ({
    ...route,
    sectionKinds: getPreferredSectionKinds(route.id)
  }));
}

export function getPaperQuestionRouteLabel(intentId) {
  return ROUTES.find((route) => route.id === intentId)?.label || "Targeted answer";
}

export function resolvePaperQuestionIntent(intentId, reason = "Manually selected route.") {
  const route = ROUTES.find((candidate) => candidate.id === intentId);
  if (!route) {
    return null;
  }

  return createIntent(route.id, reason);
}

function createIntent(id, reason) {
  return {
    id,
    reason,
    sectionKinds: getPreferredSectionKinds(id)
  };
}

function getPreferredSectionKinds(intentId) {
  if (intentId === QUERY_INTENTS.PAPER_OVERVIEW) {
    return ["abstract", "introduction", "method", "result", "discussion", "limitation", "conclusion"];
  }

  if (intentId === QUERY_INTENTS.METHOD) {
    return ["method", "system", "study-design", "implementation"];
  }

  if (intentId === QUERY_INTENTS.RESULT) {
    return ["result", "evaluation", "finding", "discussion"];
  }

  if (intentId === QUERY_INTENTS.LIMITATION) {
    return ["limitation", "discussion", "conclusion"];
  }

  if (intentId === QUERY_INTENTS.COMPARISON) {
    return ["introduction", "related-work", "method", "discussion"];
  }

  return [];
}

function normalizeQuery(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}
