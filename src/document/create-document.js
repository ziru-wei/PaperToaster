import { annotateChunksWithSections, chunkDocument, createSectionOutline } from "../pdf/chunk-document.js";
import { createPaperOverview } from "../rag/paper-overview.js";

export function createDocument({ url, fetched, content, titleInfo }) {
  const chunks = annotateChunksWithSections(normalizeChunks(content));

  const document = {
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
    sectionOutline: createSectionOutline(chunks),
    metadata: content.metadata || null,
    warnings: content.warnings || [],
    stats: content.stats || null,
    byteLength: fetched.byteLength,
    contentType: fetched.contentType,
    parsedAt: Date.now()
  };

  return {
    ...document,
    overview: createPaperOverview(document)
  };
}

function normalizeChunks(content) {
  if (content.chunks?.length) {
    return chunkDocument({
      pageCount: content.pageCount,
      pages: content.chunks.map((chunk, index) => ({
        pageNumber: chunk.pageStart || index + 1,
        text: chunk.markdown || chunk.text || ""
      }))
    });
  }

  return chunkDocument({
    pageCount: content.pageCount,
    pages: content.pages || []
  });
}
