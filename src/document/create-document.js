import { createMarkdownSourceSpans } from "../pdf/chunk-document.js";

export function createDocument({ url, fetched, content, titleInfo }) {
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
    sourceSpans: createMarkdownSourceSpans(content.markdown || ""),
    metadata: content.metadata || null,
    artifacts: content.artifacts || null,
    warnings: content.warnings || [],
    stats: content.stats || null,
    byteLength: fetched.byteLength,
    contentType: fetched.contentType,
    parsedAt: Date.now()
  };
}
