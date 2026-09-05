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

export function retrieveRelevantChunks(chunks, query, limit = 6) {
  const queryTerms = tokenize(query);
  if (!queryTerms.length) {
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

      return { ...chunk, score: Number(score.toFixed(3)) };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
