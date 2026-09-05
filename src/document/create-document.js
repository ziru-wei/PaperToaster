import { chunkDocument } from "../pdf/chunk-document.js";

export function createDocument({ url, fetched, content, titleInfo }) {
  const chunks = normalizeChunks(content);

  return {
    url,
    title: titleInfo?.title || "",
    titleSource: titleInfo?.source || "",
    titleCandidates: titleInfo?.candidates || [],
    titleIssue: titleInfo?.issue || null,
    parser: {
      id: content.parserId,
      label: content.parserLabel,
      outputKind: content.outputKind
    },
    pageCount: content.pageCount,
    pages: content.pages || [],
    markdown: content.markdown || "",
    rawMarkdown: content.rawMarkdown || "",
    chunks,
    metadata: content.metadata || null,
    warnings: content.warnings || [],
    stats: content.stats || null,
    byteLength: fetched.byteLength,
    contentType: fetched.contentType,
    parsedAt: Date.now()
  };
}

function normalizeChunks(content) {
  if (content.chunks?.length) {
    return content.chunks.map((chunk, index) => ({
      id: chunk.id || `chunk-${index + 1}`,
      pageStart: chunk.pageStart || 1,
      pageEnd: chunk.pageEnd || chunk.pageStart || 1,
      text: chunk.markdown || chunk.text || "",
      score: 0
    })).filter((chunk) => chunk.text.trim());
  }

  return chunkDocument({
    pageCount: content.pageCount,
    pages: content.pages || []
  });
}
