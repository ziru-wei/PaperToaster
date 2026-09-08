# Unfinished Feature Plan

Last updated: 2026-09-07

This document consolidates unfinished or deferred work that was previously spread across the design docs and conversation history. Completed baseline behavior is listed first so future planning does not reopen already-settled decisions.

## Completed Baseline

- Product/UI identity is now `Paper Toaster`; the extension icon uses the cropped image asset in `src/assets/extension/`.
- PDF acquisition, outline-guided Markdown reconstruction, metadata/Markdown title extraction, document creation, RAG preparation, and agent calls are separated into modules.
- PDF.js metadata/outlines/text geometry plus LiteParse structured blocks form the single production PDF parser; the old pdf2md, plain PDF.js parser, and legacy cleaner have been removed.
- Final Markdown, parser outline/debug artifacts, paper metadata, stars, conversation threads/messages, comparison sessions/messages, and archive/import data persist in IndexedDB.
- Raw Markdown, page chunks, and generated RAG context packs are not stored.
- Paper keys use DOI/arXiv/IEEE `arnumber`/cleaned URL priority. Title is not a key.
- Single-paper chat supports multi-thread memory, route suggestion before send, local Codex bridge, debug mode, Markdown-rendered assistant output, answer copy, Q&A delete, and Saved Q&A.
- Saved Q&A can be opened from the floating side-panel affordance and can jump back to the original conversation Q&A.
- Reading Dashboard lists stored papers, hides placeholder untitled records, supports search/sort/star/manage/import/backup/archive/delete, and can open a paper's stored context in the side panel without refetching the PDF.
- Comparative Reading lives in the side panel when the dashboard is open, persists sessions by paper keys plus dialog, supports at least 2 papers up to the user-configured limit (default and minimum 5), uses the same provider path, and appears in the dashboard as a separate record type.
- Dashboard records support primary activation and secondary related-record highlighting across single-paper and comparative records.
- Archive/import v3 includes final Markdown/parser artifacts, paper records with star/Label fields, threads/messages, and eligible comparative sessions/messages. Import defaults to skip existing records.

## P0: Response Streaming And Busy Feedback

Status: not implemented.

Current behavior waits for the local bridge/provider to return a complete answer. The side panel can show a pending state, but it does not stream tokens.

Plan:

1. Extend the Local Agent response contract to optionally support streaming, preferably NDJSON or SSE-like chunks over `fetch()`.
2. Keep the existing non-streaming JSON/plain-text contract as the fallback.
3. Add an in-progress assistant message that appends streamed text and renders Markdown progressively or at completion.
4. Persist the assistant message only after completion, or persist a recoverable draft state if cancellation support is added.
5. Mirror the same visible feedback in single-paper and comparative modes.

## P1: Fixture-Based Tests

Status: not implemented.

This is the highest-value reliability work before adding more rules.

Needed fixtures:

- PDF reconstruction: ACM, IEEE, Springer, embedded/inferred outlines, degraded extraction, and heading placement.
- RAG routing: selected-text, targeted Q&A, paper overview, method, findings, limitations, comparison.
- Retrieval/prompt construction: route-confirmed prompt shape, evidence budget, overview usage, weak heading fallback.
- Storage: key generation, duplicate empty thread pruning, Saved Q&A deletion cleanup, archive/import skip-existing behavior.
- Dashboard/comparative: mixed record sorting, active/related highlighting, comparison session persistence.

## P1: Selection References Into Markdown

Status: planned, not implemented.

Conversation messages currently store full selected quote text. That is reliable but can make memory large if users repeatedly quote long passages.

Plan:

1. Add `selectionRef` and `selectionPreview` to new user messages.
2. Locate selected text in final Markdown using normalized exact match, whitespace/hyphenation-insensitive match, then fuzzy token overlap constrained by nearby chunks.
3. Store offsets, line/column, Markdown hash, prefix/suffix, preview, method, and confidence.
4. Render and prompt from dynamically resolved quote text when the current document Markdown is available.
5. Continue reading legacy `selectionText`; keep a capped fallback quote only when location confidence is low.

Target modules:

- `src/pdf/locate-selection-in-markdown.js`
- `src/pdf/resolve-selection-ref.js`
- side-panel hydration around current document context

## P1: Key Promotion And Aliases

Status: reserved in storage, not wired.

`documentAliases` exists, but the app does not yet promote fallback URL keys to stronger discovered identifiers.

Plan:

1. Parse stronger identifiers from URL, metadata, and final Markdown after document creation.
2. If a fallback URL key later reveals DOI/arXiv/IEEE identity, write `aliasKey -> documentKey`.
3. Migrate or merge paper, document, thread, message, star, and comparison references.
4. Avoid duplicate dashboard cards for the same paper.

## P2: Dashboard Full-Text Search

Status: deferred.

Current dashboard search is metadata-level: title, URL, and domain. Full Markdown search should not scan every full document on every keypress.

Plan:

1. Add a derived `documentSearchBlocks` store from final Markdown.
2. Store normalized section/paragraph blocks with document key, source document key, heading, snippet text, start/end lines, and order.
3. Search the compact index after debounce.
4. Show snippet matches and optionally select/open the paper context.

## P2: Optional Embedding Retrieval

Status: deferred.

Lexical retrieval is the current lightweight default. Embeddings should only be added behind the existing `retrieveRelevantChunks()` contract if real questions show lexical retrieval is too weak.

Constraints:

- No separate Python service unless clearly needed.
- No duplicated stored RAG packs.
- Keep deterministic fallback available.

## P2: Optional LLM Reranking

Status: deferred.

LLM reranking should come only after fixture tests show deterministic evidence compression fails in common paper-reading prompts.

## P2: Comparative Routing Confirmation

Status: deferred.

Single-paper chat already has human-confirmed route selection. Comparative Reading has a separate rule-based comparative intent router, but no route confirmation UI.

Add only if comparative answers visibly suffer from wrong routing.

## P2: Thread Title Polish

Status: deferred.

Thread chips currently use first-message timestamps and message counts. Editable thread titles can be added later if timestamp labels stop being enough.

## P2: Archive/Import Advanced Conflict Handling

Status: deferred.

Current import skips existing papers and reports added/skipped counts. Future options could include preview, overwrite, split-per-paper archives, Markdown sidecars, or typed confirmation for large destructive actions.

## P2: Visual Regression Smoke Tests

Status: deferred.

Add Playwright or Chrome screenshot smoke tests for:

- side panel narrow/wide
- Saved Q&A page
- comparative side panel
- dashboard narrow/two-column/wide
- manage mode

## Deferred / Not Current Goals

- Notes system.
- Zotero/browser-history/Downloads scanning.
- A second AI stack separate from the current provider boundary.
- Storing raw Markdown, page chunks, or duplicated comparative context packs.
- Internal schema renaming from `pdf-ai-inspector` to `paper-toaster`. Product-facing UI is renamed, but the DB/schema/source ids can remain stable for compatibility unless a migration is worth the risk.

## Recommended Next Order

1. Add fixture-based tests around PDF reconstruction, storage, RAG routing, and dashboard/comparative summaries.
2. Add streaming/pending answer feedback.
3. Add selection references into Markdown.
4. Implement key promotion and aliases.
5. Add indexed dashboard full-text search.
