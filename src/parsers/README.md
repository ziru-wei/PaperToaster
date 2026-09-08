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

Only the parser adapter knows about LiteParse. The side panel calls
`parsePdfToContent()` from `parser-registry.js`; retrieval and cache code work
against the normalized document returned by `createDocument()`.

The production parser is `outline-guided-markdown`. PDF.js supplies metadata,
embedded outlines, destinations, and positioned text. LiteParse supplies
structured layout blocks. Embedded outlines are preferred; a deterministic
inferred outline is used when no embedded outline exists. The parser produces
the final Markdown directly and does not pass it through a legacy cleaner.

Parser results also include test-compatible `artifacts.outline` and
`artifacts.debug`. The canonical document stores those artifacts so the side
panel can download them without reparsing the PDF.

There is intentionally one production PDF parser. Add another adapter only if
the product explicitly adopts a second parsing strategy.
