# Parser Contract

Each parser adapter must export an object with:

```js
{
  id: "stable-parser-id",
  label: "Human Name",
  outputKind: "text" | "markdown",
  description: "Short UI description",
  async parse({ url, bytes }, { onProgress }) {}
}
```

`parse()` must return:

```js
{
  parserId,
  parserLabel,
  outputKind,
  pageCount,
  pages: [{ pageNumber, text }],
  markdown,
  rawMarkdown,
  chunks,
  metadata,
  warnings,
  stats
}
```

Only parser adapters should know about third-party parser libraries. The side
panel calls `parsePdfToContent()` from `parser-registry.js`; retrieval and cache
code work against the normalized document returned by `createDocument()`.

Parser adapters may apply parser-specific cleanup before returning content, but
should preserve raw converter output in `rawMarkdown` when available. For
example, `pdf2md-markdown-parser.js` keeps raw Markdown, then applies common and
provider-specific cleanup profiles so ACM and IEEE heading rules can evolve
independently.

Large files are handled through a separate adapter instead of changing
third-party parser limits. `pdf2md-markdown-parser.js` reports
`parser_file_too_large` when it hits the pdf2md 15 MB limit, and
`parser-registry.js` marks that request as a large-file fallback before routing
it directly to `pdfjs-markdown-parser.js`.

To add a parser:

1. Add `src/parsers/my-parser.js`.
2. Implement this contract.
3. Register it in `src/parsers/parser-registry.js`.
