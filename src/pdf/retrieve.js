const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "is", "it",
  "of", "on", "or", "that", "the", "this", "to", "was", "were", "with"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9-]{1,}/g)
    ?.filter((token) => !STOP_WORDS.has(token)) || [];
}

export function retrieveRelevantChunks(chunks, query, limit = 6, options = {}) {
  const queryTerms = tokenize(query);
  const intent = options.intent || null;
  if (!queryTerms.length && !intent?.sectionKinds?.length) {
    return [];
  }

  const uniqueQueryTerms = [...new Set(queryTerms)];

  return chunks
    .map((chunk) => {
      const terms = tokenize(chunk.text);
      const termCounts = new Map();
      for (const term of terms) {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
      }

      let score = 0;
      for (const term of uniqueQueryTerms) {
        const count = termCounts.get(term) || 0;
        if (count > 0) {
          score += 1 + Math.log(count);
        }
      }

      score += scoreSectionMatch(chunk, intent);
      score += scoreHeadingMatch(chunk, uniqueQueryTerms);

      return { ...chunk, score: Number(score.toFixed(3)) };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function scoreSectionMatch(chunk, intent) {
  const preferredKinds = new Set(intent?.sectionKinds || []);
  if (!preferredKinds.size) {
    return 0;
  }

  const kind = chunk?.section?.kind || "";
  if (!kind) {
    return 0;
  }

  return preferredKinds.has(kind) ? 1.6 : 0;
}

function scoreHeadingMatch(chunk, queryTerms) {
  const sectionTitle = chunk?.section?.normalizedTitle || chunk?.section?.title || "";
  if (!sectionTitle || !queryTerms.length) {
    return 0;
  }

  const sectionTerms = new Set(tokenize(sectionTitle));
  let score = 0;
  for (const term of queryTerms) {
    if (sectionTerms.has(term)) {
      score += 1.4;
    }
  }

  return score;
}
