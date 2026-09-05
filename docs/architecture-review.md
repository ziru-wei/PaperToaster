# Architecture Review Notes

Status: MVP works, and the main pipeline is modular enough for continued iteration. Side panel orchestration is now grouped into a thin wiring file plus three coarse controllers, so the remaining concentration is mostly in document-context details and CSS polish.

## Current Pipeline

1. PDF acquisition: `src/pdf/acquire-pdf.js`, `src/pdf/fetch-pdf.js`
2. PDF to Markdown: `src/parsers/parser-registry.js` plus parser adapters
3. Markdown cleanup: `src/markdown/clean-markdown.js`
4. Title extraction: `src/pdf/extract-metadata-title.js`, `src/pdf/extract-markdown-title.js`, `src/pdf/select-title.js`
5. Canonical document creation: `src/document/create-document.js`
6. RAG preparation: `src/pdf/chunk-document.js`, `src/pdf/retrieve.js`, `src/pdf/selection-context.js`
7. Agent call: `src/ai/selection-answer.js`, `src/ai/gemini-client.js`
8. Side panel orchestration: `src/sidepanel/sidepanel.js`, `src/sidepanel/sidepanel-document-context.js`, `src/sidepanel/paper-actions-controller.js`, `src/sidepanel/ask-flow-controller.js`
9. Side panel UI controllers: `src/sidepanel/conversation-panel-controller.js`, `src/sidepanel/composer-controller.js`, `src/sidepanel/thread-wheel-controller.js`, `src/sidepanel/scroll-to-latest-controller.js`, `src/sidepanel/selection-panel-controller.js`
10. Memory/storage: `src/storage/paper-database.js`, `src/storage/document-store.js`, `src/storage/chat-store.js`, settings stores

## Architectural Risks

- `src/sidepanel/sidepanel.js` is now a thin coordinator. The largest remaining side panel module is `sidepanel-document-context.js`, because active PDF tab mode and dashboard-selected library mode both belong to document context.
- Document cache and chat memory share the same canonical paper key. The remaining key risk is alias/key promotion for URLs that later reveal a better identifier.
- Chat memory has been moved toward the same IndexedDB database as document memory. Settings and prompt presets still use `chrome.storage.local`.
- `formatSelectionContextForPrompt()` belongs in the AI prompt layer, not the PDF/RAG layer.
- `src/markdown/clean-markdown.js` has the right profile idea, but it needs fixture-based tests before adding many more publisher rules.
- `docmarrow` code is currently experimental/dead unless registered in `parser-registry.js`.
- Side panel cleanup should stay grouped by coarse responsibility. Avoid creating many tiny model/controller files unless a responsibility becomes independently reusable or difficult to test.

## Refactor Order

1. Add a canonical memory key module and use it in both document cache and chat memory. Done in `src/storage/document-key.js`.
2. Extract a `pdf-load-controller` from the side panel. Started as `src/document/load-document.js`.
3. Extract conversation state/render/persistence into a conversation controller. Done in `src/sidepanel/conversation-panel-controller.js`.
4. Move prompt formatting from `src/pdf/selection-context.js` into `src/ai/selection-prompt.js`. Done.
5. Extract selection quote/readiness UI into `src/sidepanel/selection-panel-controller.js`. Done.
6. Extract side panel DOM lookup into `src/sidepanel/sidepanel-elements.js`. Done.
7. Move chat memory from one `chrome.storage.local` object into IndexedDB multi-thread stores. Done in `src/storage/chat-store.js`.
8. Extract composer input behavior into `src/sidepanel/composer-controller.js`. Done.
9. Extract conversation rendering, thread wheel, and scroll-to-latest behavior into focused side panel modules. Done.
10. Group side panel document context, paper actions, and ask flow into coarse modules. Done.
11. Decide whether to delete `docmarrow` or register it as an explicit experimental parser.
12. Add markdown cleanup fixtures for ACM, IEEE, Springer, and generic PDFs.

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
