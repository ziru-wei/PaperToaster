const DEFAULT_CHUNK_CHARS = 4200;
const DEFAULT_OVERLAP_CHARS = 500;

export function chunkDocument(document, options = {}) {
  const chunkSize = options.chunkSize || DEFAULT_CHUNK_CHARS;
  const overlap = options.overlap || DEFAULT_OVERLAP_CHARS;
  const chunks = [];

  for (const page of document.pages) {
    const text = page.text.trim();
    if (!text) {
      continue;
    }

    let start = 0;
    let index = 1;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end).trim();

      if (chunkText) {
        chunks.push({
          id: `p${page.pageNumber}-c${index}`,
          pageStart: page.pageNumber,
          pageEnd: page.pageNumber,
          text: chunkText
        });
      }

      if (end >= text.length) {
        break;
      }

      start = Math.max(end - overlap, start + 1);
      index += 1;
    }
  }

  return chunks;
}
