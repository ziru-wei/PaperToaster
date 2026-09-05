# Architecture Review Notes

Status: MVP works, but the codebase is only partially modular. The pipeline stages are visible as files, while several orchestration responsibilities still live in the side panel UI module.

## Current Pipeline

1. PDF acquisition: `src/pdf/acquire-pdf.js`, `src/pdf/fetch-pdf.js`
2. PDF to Markdown: `src/parsers/parser-registry.js` plus parser adapters
3. Markdown cleanup: `src/markdown/clean-markdown.js`
4. Title extraction: `src/pdf/extract-metadata-title.js`, `src/pdf/extract-markdown-title.js`, `src/pdf/select-title.js`
5. Canonical document creation: `src/document/create-document.js`
6. RAG preparation: `src/pdf/chunk-document.js`, `src/pdf/retrieve.js`, `src/pdf/selection-context.js`
7. Agent call: `src/ai/selection-answer.js`, `src/ai/gemini-client.js`
8. Conversation UI controller: `src/sidepanel/conversation-panel-controller.js`
9. Memory/storage: `src/storage/paper-database.js`, `src/storage/document-store.js`, `src/storage/chat-store.js`, settings stores

## Architectural Risks

- `src/sidepanel/sidepanel.js` is too large and mixes UI rendering, active-tab state, PDF loading, title extraction, document caching, prompt presets, AI calls, and conversation memory.
- Document cache and chat memory should share the same canonical paper key. A raw normalized URL is not enough because publisher URLs often contain volatile query tokens.
- Chat memory has been moved toward the same IndexedDB database as document memory. Settings and prompt presets still use `chrome.storage.local`.
- `formatSelectionContextForPrompt()` belongs in the AI prompt layer, not the PDF/RAG layer.
- `src/markdown/clean-markdown.js` has the right profile idea, but it needs fixture-based tests before adding many more publisher rules.
- `docmarrow` code is currently experimental/dead unless registered in `parser-registry.js`.
- Multi-thread storage is implemented, but the plus button and thread switcher UI are still TODO. See `docs/storage-and-threading-plan.md`.

## Refactor Order

1. Add a canonical memory key module and use it in both document cache and chat memory. Done in `src/storage/document-key.js`.
2. Extract a `pdf-load-controller` from the side panel. Started as `src/document/load-document.js`.
3. Extract conversation state/render/persistence into a conversation controller. Done in `src/sidepanel/conversation-panel-controller.js`.
4. Move prompt formatting from `src/pdf/selection-context.js` into `src/ai/selection-prompt.js`. Done.
5. Extract selection quote/readiness UI into `src/sidepanel/selection-panel-controller.js`. Done.
6. Extract side panel DOM lookup into `src/sidepanel/sidepanel-elements.js`. Done.
7. Move chat memory from one `chrome.storage.local` object into IndexedDB multi-thread stores. Done in `src/storage/chat-store.js`.
8. Decide whether to delete `docmarrow` or register it as an explicit experimental parser.
9. Add markdown cleanup fixtures for ACM, IEEE, Springer, and generic PDFs.

## Memory Key Rule

Do not use title as the primary key. Title is editable, can be duplicated, and can be wrong in PDF metadata. Prefer stable identifiers:

1. DOI, normalized to lowercase.
2. arXiv id.
3. IEEE `arnumber`.
4. Cleaned URL fallback with fragment removed, volatile tracking params removed, and query params sorted.

## Metadata Audit Snapshot

Use `scripts/audit-pdf-metadata.js` to inspect local PDFs before changing title/key rules.

Command shape:

```sh
node scripts/audit-pdf-metadata.js paper1.pdf paper2.pdf
```

Initial sample details are in `docs/metadata-audit-2026-09-05.md`.

Observed from 10 recently downloaded PDFs:

- ACM/LaTeX papers often have useful `info.Title`, `Author`, `Creator`, `Subject`, and `Keywords`.
- XMP metadata was empty in all 10 samples.
- Some PDFs have no paper identity fields in metadata.
- Some PDFs expose bad `info.Title`, such as an original Word filename.
- One DOI appeared inside `Subject`, not as a stable dedicated field.
- Filenames are inconsistent: some are title-like, some are ACM numeric ids, some are publisher ids.

Implication: metadata is useful for title extraction, but not reliable enough as the primary memory key. The first implementation should key from URL-derived stable identifiers when possible, and use metadata only after a larger audit proves a specific field is stable across publishers.
