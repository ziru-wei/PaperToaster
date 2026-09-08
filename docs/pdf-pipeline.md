# PDF Pipeline

Last updated: 2026-09-07

Status: implemented and browser-validated.

## Production Flow

```text
PDF bytes
├─ PDF.js
│  ├─ metadata
│  ├─ embedded outline and destination pages
│  └─ positioned page text
└─ LiteParse WASM
   └─ structured text/layout blocks
        ↓
embedded outline, or deterministic inferred outline
        ↓
outline-constrained Markdown reconstruction
        ↓
canonical document, RAG chunks, and IndexedDB
```

`outline-guided-markdown` is the only production parser. Small and large PDFs use the same path. The former pdf2md parser, plain PDF.js parser adapters, 15 MB gate, and legacy Markdown cleaner were removed.

## Modules

- `src/parsers/outline-guided-markdown-parser.js`: parser contract and progress reporting.
- `src/pdf/structured-pdf-extraction.js`: one PDF.js lifecycle for metadata, outline resolution, and positioned text.
- `src/pdf/liteparse-runtime.js`: cached LiteParse WASM initialization and per-document parser cleanup.
- `src/pdf/outline-guided-core.js`: deterministic outline analysis, matching, and Markdown reconstruction shared with the local test harness.
- `scripts/test-pdf-pipeline.js`: manual corpus runner using the same shared core.

The core is intentionally isolated from DOM, tabs, storage, and UI code.

## Outline Modes

- `embedded`: preserve PDF outline title, depth, order, destination, and resolved page.
- `inferred`: infer academic headings with deterministic scoring when no embedded outline exists.
- `degraded`: use PDF.js positioned text reconstruction when LiteParse body-font analysis is invalid.

The accepted outline controls Markdown heading hierarchy. LiteParse heading levels cannot override a matched outline heading.

## Persistence And Diagnostics

The stored document includes:

- final Markdown
- parser metadata and warnings
- `outline.json`-compatible data
- `debug.json`-compatible diagnostics

Raw LiteParse blocks, PDF.js text items, derived chunks, and generated prompt context are not persisted. The single-paper header can download one ZIP containing `outline.json`, `debug.json`, and `output.md` without reparsing.

Cache version `v16` separates new parser output from old cached documents while retaining the canonical `documentKey`, conversations, stars, Labels, notes, and comparison references.

## Failure Boundaries

- Missing embedded outlines use deterministic inference.
- Invalid LiteParse body-font analysis may use the degraded PDF.js reconstruction path.
- PDF-byte acquisition failure remains owned by `loadDocumentForTab()` and may use rendered viewer text.
- Image-only or unusable documents should fail explicitly rather than inventing content.
- Request guards prevent a slow parse from publishing into a newly selected tab.

## Local Corpus Test

Run:

```bash
npm run test:pdf
```

The default input is `~/Downloads/test pdf parser`. Generated results are written to `test-results/pdf-pipeline/`, which is intentionally ignored by Git and intended for local manual inspection.
