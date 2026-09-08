# Architecture Review Notes

Last updated: 2026-09-06

Status: MVP works, and the main pipeline is modular enough for continued iteration. Side panel orchestration is grouped into a thin wiring file plus coarse controllers, so remaining architecture work is mostly reliability-oriented rather than structural.

## Current Pipeline

1. PDF acquisition: `src/pdf/acquire-pdf.js`, `src/pdf/fetch-pdf.js`
2. PDF to Markdown: `src/parsers/outline-guided-markdown-parser.js`, `src/pdf/structured-pdf-extraction.js`, `src/pdf/outline-guided-core.js`
3. Title extraction: `src/pdf/extract-metadata-title.js`, `src/pdf/extract-markdown-title.js`, `src/pdf/select-title.js`
5. Canonical document creation: `src/document/create-document.js`
6. RAG preparation: `src/pdf/chunk-document.js`, `src/pdf/retrieve.js`, `src/pdf/selection-context.js`, `src/rag/query-intent-router.js`, `src/rag/evidence-context.js`, `src/rag/paper-overview.js`
7. Agent call: `src/ai/selection-answer.js`, `src/ai/gemini-client.js`, `src/ai/local-agent-client.js`
8. Side panel orchestration: `src/sidepanel/sidepanel.js`, `src/sidepanel/sidepanel-document-context.js`, `src/sidepanel/paper-actions-controller.js`, `src/sidepanel/ask-flow-controller.js`
9. AI response rendering: `src/markdown/render-markdown.js` wraps the bundled `markdown-it` + `DOMPurify` renderer in `vendor/markdown-renderer/markdown-renderer.mjs`; DOMPurify returns a sanitized `DocumentFragment`, which is inserted with `replaceChildren()`
10. Side panel UI controllers: `src/sidepanel/conversation-panel-controller.js`, `src/sidepanel/composer-controller.js`, `src/sidepanel/thread-wheel-controller.js`, `src/sidepanel/scroll-to-latest-controller.js`, `src/sidepanel/selection-panel-controller.js`, `src/sidepanel/comparative-reading-controller.js`
11. Dashboard orchestration: `src/dashboard/dashboard.js`, `src/dashboard/dashboard-renderer.js`, `src/dashboard/dashboard-bulk-actions.js`
12. Memory/storage: `src/storage/paper-database.js`, `src/storage/document-store.js`, `src/storage/chat-store.js`, `src/storage/comparison-store.js`, settings stores

## Architectural Risks

- `src/sidepanel/sidepanel.js` is now a thin coordinator. The largest remaining side panel module is `sidepanel-document-context.js`, because active PDF tab mode and dashboard-selected library mode both belong to document context.
- `src/dashboard/dashboard.js` is now a page coordinator. Card/sort DOM creation lives in `dashboard-renderer.js`; archive/import/backup/delete selection workflow lives in `dashboard-bulk-actions.js`.
- Document cache and chat memory share the same canonical paper key. The remaining key risk is alias/key promotion for URLs that later reveal a better identifier.
- Chat memory has been moved toward the same IndexedDB database as document memory. Settings and prompt presets still use `chrome.storage.local`.
- `formatSelectionContextForPrompt()` belongs in the AI prompt layer, not the PDF/RAG layer.
- Local agent support should stay behind the AI provider boundary. The extension talks to a token-protected loopback HTTP bridge; it should not know whether the bridge invokes Codex, Claude Code, Ollama, LM Studio, or another local tool.
- Side panel cleanup should stay grouped by coarse responsibility. Avoid creating many tiny model/controller files unless a responsibility becomes independently reusable or difficult to test.
- Markdown rendering for AI responses remains separate from PDF reconstruction. `outline-guided-core.js` produces paper Markdown; `render-markdown.js` converts assistant responses into sanitized HTML for display.
- Paper-reading RAG is now a lightweight middle layer. It uses rule-based intent routing, weak section-aware chunks, neighbor expansion, deterministic paper overview, and extractive evidence compression instead of a separate vector database or Python RAG service. Section metadata is a hint, not a hard dependency, because converted Markdown headings can be missing or wrong.
- Comparative Reading has its own side-panel controller, renderer, storage store, and compare prompt/context modules. It reuses the provider boundary instead of creating a second AI stack.
- Saved Q&A is conversation-message metadata (`isSaved`) plus a derived side-panel view. It should stay attached to message records, not become a separate notes system.
- `docmarrow`/`marrow` parser code is not present in the current repo scan. No docmarrow cleanup is currently pending.

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
11. Split Reading Dashboard rendering and bulk management into coarse modules. Done.
12. Extend outline-guided parser fixtures across ACM, IEEE, Springer, and generic PDFs.
13. Add prompt/retrieval fixtures for paper overview, method, result, limitation, and selected-text questions.
14. Add comparative reading fixtures for balanced per-paper retrieval and prompt shape.
15. Add visual regression smoke tests for side panel and dashboard responsive states.

Open refactor/future-work items are consolidated in `docs/unfinished-feature-plan.md`.

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
