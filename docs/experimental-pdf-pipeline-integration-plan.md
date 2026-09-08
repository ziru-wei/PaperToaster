# Experimental PDF Pipeline Integration Plan

Last updated: 2026-09-07

Status: implemented on 2026-09-07. The outline-guided parser is now the only production PDF parser; the old pdf2md/PDF.js adapters and legacy cleaner were removed.

## Goal

Replace the current production PDF-to-Markdown path with the tested outline-guided pipeline:

```text
PDF bytes
├─ PDF.js: metadata, embedded outline, destinations, page text geometry
└─ LiteParse: structured text/layout blocks
       ↓
embedded outline, or deterministic inferred outline when absent
       ↓
match headings to document content
       ↓
outline-constrained Markdown
       ↓
current tested Markdown output → canonical document → chunks/RAG/storage
```

The replacement must preserve the existing parser contract, title priority, document key, storage model, RAG preparation, diagnostics, and rendered-text acquisition fallback. It replaces both the old parsers and `src/markdown/clean-markdown.js`; the old cleaner is not part of the target pipeline.

## Current And Target Boundaries

Current production boundary:

- `src/parsers/parser-registry.js` selects `pdf2md-markdown`.
- `pdf2md-markdown` rejects files over 15 MB and falls back to `pdfjs-markdown`.
- Each parser runs `cleanMarkdownForReading()` before returning parser content.
- `createDocument()` converts parser content into the canonical document consumed by storage and RAG.

Target boundary:

- Add one production parser adapter, initially identified as `outline-guided-markdown`.
- The adapter returns the same fields as existing parsers: `parserId`, `parserLabel`, `outputKind`, `pageCount`, `pages`, `markdown`, `rawMarkdown`, `chunks`, `metadata`, `warnings`, and `stats`.
- The experimental pipeline owns the final Markdown result. It does not pass that result through `cleanMarkdownForReading()`.
- `createDocument()`, IndexedDB records, dashboard behavior, conversations, and AI providers remain unchanged.
- Large and small PDFs use the same parser. File size alone no longer selects a lower-quality path.

## Module Shape

Do not move the 84 KB test script into production as one file. Extract it into a small number of responsibility-level modules:

1. `src/parsers/outline-guided-markdown-parser.js`
   - Parser contract adapter, progress reporting, warnings, and stats.
2. `src/pdf/structured-pdf-extraction.js`
   - One PDF.js document lifecycle for metadata, embedded outline resolution, and positioned text items.
   - LiteParse initialization and structured block extraction.
3. `src/pdf/outline-analysis.js`
   - Embedded-outline normalization and the deterministic inferred-outline scoring/admission/hierarchy path.
4. `src/pdf/outline-guided-markdown.js`
   - Heading-to-block/line matching and normal/degraded Markdown reconstruction.

Keep generic utilities private to these modules until another production caller exists. The test script should eventually import the same pure analysis/building functions so test and production logic cannot drift.

## Implementation Phases

### Phase 1: Freeze The Experimental Contract

- Treat `test-results/inferred-outline/` as the initial manual-review baseline.
- Add focused assertions for outline shape, heading levels/order, references handling, and degraded-mode selection without turning manual quality review into a synthetic score.
- Record parser diagnostics needed in production: outline type, matched/unresolved headings, degraded mode, elapsed time, and recoverable warnings.
- Keep embedded and inferred outline objects immutable after admission/hierarchy is complete.

Exit condition: refactoring the experiment produces byte-identical outline JSON and expected Markdown fixtures.

### Phase 2: Make LiteParse Browser-Deployable

- Add `@llamaindex/liteparse-wasm` as an explicit dependency; it is currently available locally but not declared in `package.json`.
- Add a build script that bundles the browser wrapper and copies its `.wasm` file into `vendor/liteparse/`.
- Initialize WASM with `chrome.runtime.getURL()` or fetched extension bytes, not Node `fs` or `createRequire`.
- Confirm the Manifest V3 extension-page CSP permits the generated WASM initialization. Add only the minimum required `content_security_policy.extension_pages` directive if Chrome requires `wasm-unsafe-eval`.
- Keep LiteParse execution in an extension context, never in the publisher page.
- Verify packaged-extension paths, reload behavior, and repeated initialization. Cache one initialization promise rather than constructing the runtime per PDF.

Exit condition: the side-panel extension context can parse one fixture through LiteParse with no Node APIs, remote code, or CSP errors.

### Phase 3: Extract Shared Pure Pipeline Code

- Move PDF.js text geometry, outline destination resolution, candidate scoring, hierarchy inference, matching, and Markdown builders from the test script into the production modules above.
- Pass data into pure functions; do not let inference code access DOM, tabs, storage, or UI.
- Consolidate metadata, outline, and text extraction under one PDF.js loading task to avoid opening and destroying the same PDF repeatedly.
- Keep LiteParse blocks and PDF.js lines as transient parse data. Do not persist them.
- Preserve the two explicit reconstruction modes:
  - normal outline-guided reconstruction from LiteParse Markdown/blocks;
  - degraded reconstruction from PDF.js positioned text when LiteParse body-font analysis is invalid.

Exit condition: the isolated script imports shared modules and reproduces the committed corpus results.

### Phase 4: Preserve The Tested Markdown Behavior

- Reuse the current experimental outline, matching, and Markdown reconstruction exactly as tested.
- Do not add another heading policy, inferred-heading feature, or cleaner mode during integration.
- Do not run `cleanMarkdownForReading()` or any legacy heading-repair logic over the reconstructed result.
- Keep link stripping and other behavior already present in the experiment unchanged.
- If a cleanup behavior is required, it must already exist inside the accepted experimental pipeline; do not import rules from the old cleaner.

Exit condition: the browser parser reproduces the committed experimental Markdown behavior without adding new transformations.

### Phase 5: Add The Production Parser Adapter

- Implement `outlineGuidedMarkdownParser.parse({ url, bytes }, options)`.
- Return page records usable by `createDocument()` and `chunkDocument()`; preserve page numbers where reconstruction can associate text with a page.
- Set metadata such as:
  - `outlineType: "embedded" | "inferred" | "none"`
  - `degradedMode`
  - matched/unresolved heading counts
  - LiteParse and PDF.js timing
  - parser implementation version
- Return parser artifacts matching the test output exactly:
  - `outline.json`, including `outlineType` and the final outline
  - `debug.json`, including the same inference/matching diagnostics as the test
  - `output.md`, using the parser's final Markdown bytes
- Emit concise progress stages: loading PDF, extracting layout, resolving/inferencing outline, and reconstructing Markdown.
- Treat image-only/no-text PDFs as explicit parser failures so the existing rendered-viewer fallback can still run.
- Ensure PDF.js/LiteParse cleanup occurs in `finally` blocks and that cancellation or tab switching cannot publish a stale result.

Exit condition: the adapter satisfies the existing parser content contract and loads through `loadDocumentForTab()` without downstream changes.

### Phase 6: Integrate Without Corrupting Cache Identity

- Register `outline-guided-markdown` in `parser-registry.js` without immediately deleting the old parsers.
- Increment `DOCUMENT_CACHE_VERSION` when enabling it. A cached `pdf2md-markdown` or `pdfjs-markdown` document must not count as a compatible cache hit for the new parser.
- Keep canonical paper keys unchanged so conversations, stars, labels, Saved Q&A, comparisons, and paper notes remain attached to the same paper.
- Reparse document content lazily when a paper is next opened; do not require users to reopen every tab at migration time.
- Store the pipeline's final Markdown plus its `outline.json` and `debug.json` artifact data on the document record. This is required so cached and Dashboard-opened papers can export diagnostics without reparsing the PDF.
- Continue not storing raw LiteParse blocks, PDF.js items, or generated context packs outside the explicit test-compatible debug artifact.
- Preserve these parser artifacts in dashboard backup/archive data so an imported paper retains the same download capability.

Exit condition: old conversations survive the parser switch while documents are independently regenerated under the new parser/cache key.

### Phase 7: Add Single-Paper Debug Download

- Add the supplied bug icon to the centralized icon assets and place its action in every single-paper side-panel header.
- Enable the action only when the current stored document has all required parser artifacts.
- Generate one ZIP in memory with exactly these files at its root:
  - `outline.json`
  - `debug.json`
  - `output.md`
- Serialize JSON with the same two-space indentation and trailing newline used by the test script.
- Use the stored final Markdown for `output.md`; do not rerun parsing when the button is clicked.
- Name the archive from a filesystem-safe paper title, with a stable fallback based on the document key.
- Trigger the download from a temporary Blob URL and revoke it immediately afterward. Do not send paper content to a server.
- Use a small locally bundled ZIP implementation; do not load executable code from a CDN.

Exit condition: the ZIP from a newly parsed paper and from the same cached paper contains equivalent test-format artifacts.

### Phase 8: Extension Test And Default Switch

- Test the parser through a developer flag or dedicated experimental build without running both parsers during normal loads.
- Run the committed corpus in both Node test and packaged Chrome extension contexts.
- Add fixtures for parser lifecycle failures, malformed outlines, missing outlines, large files, and rapid tab switching.
- Make `outline-guided-markdown` the default only after browser output matches the reviewed test output closely enough.
- Keep the existing rendered-text fallback for publisher viewers where PDF bytes cannot be acquired.

Exit condition: the new parser is the default and diagnostics identify its outline mode and any degraded behavior.

### Phase 9: Remove Superseded Code Immediately After Extension Testing

Once the new parser passes packaged-extension testing and becomes the default, remove the old parser in the same integration sequence:

- Remove `@pdf2md/core`, its build command, bundled vendor files, the 15 MB gate, and pdf2md-specific warning text.
- Remove `pdf2md-markdown-parser.js`, `pdfjs-markdown-parser.js`, and their parser-registry fallback branch.
- Remove `pdfjs-text-parser.js` from the parser registry; delete it as well if no non-parser caller remains.
- Remove `src/markdown/clean-markdown.js` and all cleanup-profile logic after confirming no imports remain.
- Simplify parser compatibility rules in `document/load-document.js` and fallback metadata rendering in `sidepanel-document-context.js`.
- Remove duplicated implementations from the test scripts after they import production-pure modules.
- Update architecture and unfinished-feature docs to mark the replacement complete.

Exit condition: one production PDF-to-Markdown implementation remains, with no old cleaner, dormant parser bundles, or obsolete fallback UI language.

## Failure And Rollback Policy

- Embedded outline failure may fall through to deterministic inferred outline.
- Missing embedded outline is normal, not a warning by itself.
- LiteParse structural degradation may use the tested degraded PDF.js reconstruction path.
- Image-only documents should fail clearly; do not invent text or outline.
- PDF-byte acquisition failure remains owned by `loadDocumentForTab()` and may use its rendered-viewer fallback.
- Before the replacement commit lands, rollback means abandoning that integration change. After it lands, recovery should fix or revert the new parser commit rather than retaining dormant production parsers.

## Performance And Memory Guardrails

- Use one PDF.js loading task per parse and destroy it exactly once.
- Initialize LiteParse WASM once per extension-page lifecycle and release per-document parser data after use.
- Avoid unnecessary `ArrayBuffer` clones except where ownership/transfer requires one.
- Report stage progress for long PDFs so the UI never appears idle.
- Measure total parse time and peak practical behavior on the largest corpus PDFs before making the parser default.
- Do not run old and new parsers simultaneously during ordinary user loads.

## Acceptance Checklist

- Embedded outline title/depth/order/destination resolution remains unchanged.
- Inferred outline scoring/admission/hierarchy remains deterministic.
- PDFs without outlines still produce readable Markdown without invented embedded metadata.
- Mixed single/two-column pages preserve region reading order acceptably.
- Browser output matches the current reviewed experimental output without a new heading or cleanup policy.
- References are removed conservatively without deleting legitimate earlier content.
- Files above 15 MB use the same pipeline and no longer need the old size fallback.
- Parser failures and degraded mode are visible in diagnostics/context-ready hover text.
- Every single-paper panel can download one ZIP containing test-compatible `outline.json`, `debug.json`, and `output.md` without reparsing.
- Existing paper keys and all conversation-related storage remain intact.
- Rapid tab switches cannot attach one paper's parse result to another paper.
- Packaged MV3 extension runs without remote code, Node APIs, or WASM CSP errors.

## Implementation Result

- `outline-guided-markdown` is the sole parser registered in production.
- The test harness imports the same shared outline/Markdown core as production.
- LiteParse is declared, locally vendored, and initialized once per extension-page lifecycle.
- Document cache version `v16` keeps old parser results separate while preserving canonical paper keys and conversations.
- Final Markdown plus outline/debug artifacts persist on document records and therefore flow through existing archive/import records.
- Every single-paper header exposes a bug-icon download action that creates one local ZIP containing `outline.json`, `debug.json`, and `output.md`.
- The old parser adapters, old cleaner, pdf2md dependency, vendor bundle, and fallback-specific diagnostics were removed.
