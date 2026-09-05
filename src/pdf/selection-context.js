import { retrieveRelevantChunks } from "./retrieve.js";

const DEFAULT_RELEVANT_LIMIT = 6;
const DEFAULT_LOCAL_CONTEXT_CHARS = 9000;
const DEFAULT_RETRIEVED_CONTEXT_CHARS = 12000;
const MIN_EXACT_SELECTION_CHARS = 24;
const MIN_COMPACT_SELECTION_CHARS = 32;
const MIN_FUZZY_TOKEN_COUNT = 4;
const MIN_FUZZY_SCORE = 0.36;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "in",
  "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was", "were", "with"
]);

export function buildSelectionContextPack({ document, selectionText, question = "", options = {} }) {
  const normalizedSelectionText = normalizeVisibleText(selectionText);
  const normalizedQuestion = normalizeVisibleText(question);

  if (!document) {
    throw new Error("No active paper is loaded.");
  }

  if (!normalizedSelectionText) {
    throw new Error("No selected text is available.");
  }

  const chunks = Array.isArray(document.chunks) ? document.chunks : [];
  const anchor = findSelectionAnchor(chunks, normalizedSelectionText);
  const localContext = anchor
    ? selectLocalContextChunks(chunks, anchor.chunkIndex, options.localContextChars)
    : [];
  const retrievedContext = selectRetrievedContextChunks({
    chunks,
    query: [normalizedSelectionText, normalizedQuestion].filter(Boolean).join("\n"),
    excludeIds: new Set(localContext.map((chunk) => chunk.id)),
    limit: options.relevantLimit,
    maxChars: options.retrievedContextChars
  });

  return {
    kind: "selection-context-pack",
    version: 1,
    createdAt: new Date().toISOString(),
    paper: {
      title: document.title || "",
      url: document.url || "",
      pageCount: document.pageCount || null
    },
    question: normalizedQuestion,
    selection: {
      text: normalizedSelectionText,
      anchor
    },
    context: {
      local: localContext,
      retrieved: retrievedContext
    },
    warnings: buildWarnings({ anchor, localContext, retrievedContext })
  };
}

export function findSelectionAnchor(chunks, selectionText) {
  const selection = normalizeForMatch(selectionText);
  if (!selection) {
    return null;
  }

  const compactSelection = compactForMatch(selectionText);
  const selectionTokens = tokenizeForMatch(selectionText);
  let bestFuzzy = null;

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const chunkText = chunk.text || "";
    const normalizedChunk = normalizeForMatch(chunkText);

    if (selection.length >= MIN_EXACT_SELECTION_CHARS && normalizedChunk.includes(selection)) {
      return createAnchor({ chunk, chunkIndex: index, method: "normalized-exact", score: 1, selectionText });
    }

    if (
      compactSelection.length >= MIN_COMPACT_SELECTION_CHARS &&
      compactForMatch(chunkText).includes(compactSelection)
    ) {
      return createAnchor({ chunk, chunkIndex: index, method: "compact-exact", score: 0.94, selectionText });
    }

    if (selectionTokens.length >= MIN_FUZZY_TOKEN_COUNT) {
      const score = scoreTokenOverlap(selectionTokens, tokenizeForMatch(chunkText));
      if (!bestFuzzy || score > bestFuzzy.score) {
        bestFuzzy = createAnchor({ chunk, chunkIndex: index, method: "token-overlap", score, selectionText });
      }
    }
  }

  if (bestFuzzy?.score >= MIN_FUZZY_SCORE) {
    return bestFuzzy;
  }

  return null;
}

function selectLocalContextChunks(chunks, anchorIndex, maxChars = DEFAULT_LOCAL_CONTEXT_CHARS) {
  const budget = Math.max(1600, maxChars || DEFAULT_LOCAL_CONTEXT_CHARS);
  const selectedIndexes = new Set([anchorIndex]);
  let usedChars = chunks[anchorIndex]?.text?.length || 0;
  let radius = 1;

  while (usedChars < budget && (anchorIndex - radius >= 0 || anchorIndex + radius < chunks.length)) {
    for (const index of [anchorIndex - radius, anchorIndex + radius]) {
      if (index < 0 || index >= chunks.length || selectedIndexes.has(index)) {
        continue;
      }

      const chunkChars = chunks[index]?.text?.length || 0;
      if (usedChars + chunkChars > budget && selectedIndexes.size > 1) {
        continue;
      }

      selectedIndexes.add(index);
      usedChars += chunkChars;
    }
    radius += 1;
  }

  return [...selectedIndexes]
    .sort((a, b) => a - b)
    .map((index) => packChunk(chunks[index]));
}

function selectRetrievedContextChunks({ chunks, query, excludeIds, limit, maxChars }) {
  const budget = Math.max(1600, maxChars || DEFAULT_RETRIEVED_CONTEXT_CHARS);
  const retrieved = retrieveRelevantChunks(chunks, query, limit || DEFAULT_RELEVANT_LIMIT);
  const selected = [];
  let usedChars = 0;

  for (const chunk of retrieved) {
    if (excludeIds.has(chunk.id)) {
      continue;
    }

    const text = chunk.text || "";
    if (usedChars + text.length > budget && selected.length) {
      continue;
    }

    selected.push(packChunk(chunk));
    usedChars += text.length;
  }

  return selected;
}

function createAnchor({ chunk, chunkIndex, method, score, selectionText }) {
  return {
    found: true,
    method,
    score: Number(score.toFixed(3)),
    chunkId: chunk.id || "",
    chunkIndex,
    pageStart: chunk.pageStart || null,
    pageEnd: chunk.pageEnd || chunk.pageStart || null,
    matchedPreview: buildMatchedPreview(chunk.text || "", selectionText)
  };
}

function packChunk(chunk) {
  return {
    id: chunk.id || "",
    pageStart: chunk.pageStart || null,
    pageEnd: chunk.pageEnd || chunk.pageStart || null,
    score: typeof chunk.score === "number" ? chunk.score : null,
    text: chunk.text || ""
  };
}

function buildMatchedPreview(chunkText, selectionText) {
  const normalizedSelection = normalizeForMatch(selectionText);
  const normalizedChunk = normalizeForMatch(chunkText);
  const matchIndex = normalizedSelection ? normalizedChunk.indexOf(normalizedSelection) : -1;

  if (matchIndex < 0) {
    return chunkText.slice(0, 320).trim();
  }

  const startRatio = matchIndex / Math.max(1, normalizedChunk.length);
  const approximateStart = Math.max(0, Math.floor(chunkText.length * startRatio) - 120);
  return chunkText.slice(approximateStart, approximateStart + 420).trim();
}

function buildWarnings({ anchor, localContext, retrievedContext }) {
  const warnings = [];

  if (!anchor) {
    warnings.push("Selected text could not be confidently located in the cleaned paper text.");
  }

  if (!localContext.length) {
    warnings.push("No nearby context was available for the selected text.");
  }

  if (!retrievedContext.length) {
    warnings.push("No additional paper context matched the selection or question.");
  }

  return warnings;
}

function normalizeVisibleText(text) {
  return String(text || "")
    .replace(/\u00ad/g, "")
    .replace(/([A-Za-z])-\s*\n\s*([A-Za-z])/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForMatch(text) {
  return normalizeVisibleText(text)
    .normalize("NFKC")
    .toLowerCase();
}

function compactForMatch(text) {
  return normalizeForMatch(text)
    .replace(/[^a-z0-9]+/g, "");
}

function tokenizeForMatch(text) {
  const tokens = normalizeForMatch(text).match(/[a-z0-9][a-z0-9-]{1,}/g) || [];
  return [...new Set(tokens.filter((token) => token.length > 2 && !STOP_WORDS.has(token)))];
}

function scoreTokenOverlap(selectionTokens, chunkTokens) {
  const chunkTokenSet = new Set(chunkTokens);
  const overlap = selectionTokens.filter((token) => chunkTokenSet.has(token)).length;
  if (!overlap) {
    return 0;
  }

  return overlap / selectionTokens.length;
}
