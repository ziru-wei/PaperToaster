import { retrieveRelevantChunks } from "../pdf/retrieve.js";

const DEFAULT_NEIGHBOR_RADIUS = 1;
const DEFAULT_CANDIDATE_MULTIPLIER = 3;
const DEFAULT_MAX_CHUNK_TEXT_CHARS = 1400;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "in",
  "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was", "were", "with"
]);

export function buildEvidenceContext({
  chunks,
  query,
  intent,
  excludeIds = new Set(),
  limit = 6,
  maxChars = 12000
}) {
  const candidateLimit = Math.max(limit, limit * DEFAULT_CANDIDATE_MULTIPLIER);
  const retrieved = retrieveRelevantChunks(chunks, query, candidateLimit, { intent })
    .filter((chunk) => !excludeIds.has(chunk.id));
  const expanded = expandRetrievedChunks({
    allChunks: chunks,
    retrieved,
    excludeIds,
    radius: DEFAULT_NEIGHBOR_RADIUS
  });

  return selectCompressedEvidence({
    chunks: expanded,
    query,
    maxChars,
    limit: Math.max(limit + 2, limit)
  });
}

export function compressChunkForEvidence(chunk, query, options = {}) {
  const text = String(chunk?.text || "");
  const maxChars = options.maxChars || DEFAULT_MAX_CHUNK_TEXT_CHARS;
  if (text.length <= maxChars) {
    return {
      ...chunk,
      text
    };
  }

  const queryTerms = tokenize(query);
  const sentences = splitSentences(text);
  const selected = [];
  let usedChars = 0;

  for (const sentence of rankSentences(sentences, queryTerms)) {
    if (usedChars + sentence.length > maxChars && selected.length) {
      continue;
    }

    selected.push(sentence);
    usedChars += sentence.length;
    if (usedChars >= maxChars) {
      break;
    }
  }

  return {
    ...chunk,
    text: selected.length ? selected.sort((a, b) => text.indexOf(a) - text.indexOf(b)).join(" ") : text.slice(0, maxChars)
  };
}

function expandRetrievedChunks({ allChunks, retrieved, excludeIds, radius }) {
  const byId = new Map((allChunks || []).map((chunk, index) => [chunk.id, { chunk, index }]));
  const selectedIndexes = new Set();

  for (const chunk of retrieved) {
    const record = byId.get(chunk.id);
    if (!record) {
      continue;
    }

    for (let offset = -radius; offset <= radius; offset += 1) {
      const index = record.index + offset;
      const neighbor = allChunks[index];
      if (!neighbor || excludeIds.has(neighbor.id)) {
        continue;
      }

      selectedIndexes.add(index);
    }
  }

  return [...selectedIndexes]
    .sort((left, right) => left - right)
    .map((index) => {
      const chunk = allChunks[index];
      const retrievedChunk = retrieved.find((candidate) => candidate.id === chunk.id);
      return {
        ...chunk,
        score: typeof retrievedChunk?.score === "number" ? retrievedChunk.score : chunk.score || 0
      };
    });
}

function selectCompressedEvidence({ chunks, query, maxChars, limit }) {
  const selected = [];
  let usedChars = 0;

  for (const chunk of chunks) {
    const compressed = compressChunkForEvidence(chunk, query);
    const text = compressed.text || "";
    if (usedChars + text.length > maxChars && selected.length) {
      continue;
    }

    selected.push(compressed);
    usedChars += text.length;
    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

function rankSentences(sentences, queryTerms) {
  return sentences
    .map((sentence, index) => ({
      sentence,
      index,
      score: scoreSentence(sentence, queryTerms)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.index - right.index;
    })
    .map((item) => item.sentence);
}

function scoreSentence(sentence, queryTerms) {
  const sentenceTerms = new Set(tokenize(sentence));
  let score = 0;

  for (const term of queryTerms) {
    if (sentenceTerms.has(term)) {
      score += 1;
    }
  }

  return score;
}

function splitSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9-]{1,}/g)
    ?.filter((token) => token.length > 2 && !STOP_WORDS.has(token)) || [];
}
