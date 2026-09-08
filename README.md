# Paper Toaster

Minimal Edge / Chromium Manifest V3 prototype for inspecting the active PDF from a side panel.

## What Works

- Opens as a browser side panel.
- Reads the active tab URL.
- Fetches the active PDF URL with browser credentials.
- Falls back to fetching from the active tab context when publisher sites reject extension-origin requests.
- Tries browser-cache-aware page-context fetches across frames and embedded PDF viewers before giving up on PDF bytes.
- Falls back to rendered viewer text when PDF bytes cannot be fetched, with quality checks that reject publisher wrapper JavaScript/CSS.
- Parses PDFs locally with PDF.js and LiteParse WASM.
- Uses embedded PDF outlines when available and deterministic inferred outlines otherwise.
- Reconstructs final Markdown with outline-constrained heading hierarchy for PDFs of any supported size.
- Automatically loads the active PDF when the side panel opens or the active tab changes.
- Stores each parsed document in extension IndexedDB by canonical paper key and parser version, keeping only the URL, editable title, cleaned Markdown, and small document metadata.
- Reuses stored Markdown when the same PDF URL is opened again, so it does not re-fetch or re-parse unless the reload icon is clicked.
- Extracts the paper title from PDF metadata first, then the first usable raw Markdown H1; if there is no usable H1, it uses the earliest usable raw Markdown heading.
- Lets the title be edited manually in the side panel.
- Stores test-compatible outline and parser diagnostics with the final Markdown.
- Downloads `outline.json`, `debug.json`, and `output.md` as one local ZIP from the single-paper header.
- Captures the latest selected text from the current PDF tab when available.
- Adds a right-click `### Capture selection ###` menu item for selected text.
- Answers selected-text questions through a lightweight selection-grounded context pack, using the configured AI provider.
- Shows selected-text AI questions and answers as a conversation thread for the current selection.
- Persists each active conversation thread by canonical paper key in IndexedDB, so switching tabs does not erase the paper's chat memory.
- Adds a fixed top conversation thread rail: the left button creates a new thread, older threads scroll horizontally to the right, and existing threads can be selected or deleted.
- Supports slash prompt presets in the selected-text question box, backed by extension-local settings.
- Supports Debug mode in Options, which returns deterministic placeholder answers without making AI API requests.
- Provides an Options page for local AI provider settings. API keys are stored in `chrome.storage.local` and are not committed to the repo.

Whole-paper, selected-text, Saved Q&A, and comparative reading flows use the stored outline-guided Markdown context.

## Load In Edge

1. Open `edge://extensions`.
2. Enable `Developer mode`.
3. Choose `Load unpacked`.
4. Select this folder:

   `/Users/ziru/Documents/GitHub/chromePaperChat`

5. Open a PDF, for example an arXiv PDF or the ACM test URL from `guideline.md`.
6. Click the extension icon to open the side panel.
7. The active PDF loads automatically. Click the reload icon in the upper-right corner only when you want to force a fresh parse.
8. Select text in the PDF viewer, then use the right-click `### Capture selection ###` menu item. Check the `Selected Text` section.
9. Enter a question, or type `/` to choose a prompt preset, then click `Ask AI`.

## Notes

- Some publisher PDFs can block extension fetches even when the PDF is visible in the browser.
- Fetch/parse diagnostics are logged to the side panel DevTools console.
- If PDF byte fetches fail, the extension tries to inspect text already rendered by the PDF viewer. This may only include pages that the viewer has loaded into the DOM.
- Rendered-text fallback only accepts visible natural-language paper text. Publisher wrapper pages, analytics scripts, CSS, and empty iframe shells should fail cleanly instead of producing Markdown.
- The side panel first checks IndexedDB for the canonical paper key. A cache hit renders immediately; a miss automatically loads, parses, and stores the PDF.
- The reload icon bypasses the local document store and reparses the active PDF.
- Parsed-document cache keys prefer DOI, arXiv id, or IEEE `arnumber`; URL fallback removes fragments such as `#page=...` and common volatile query parameters.
- The persistent document store saves final Markdown and parser outline/debug artifacts, but not raw LiteParse blocks, PDF.js text items, page chunks, or generated RAG packs.
- Paper title extraction order is explicit: PDF metadata title, first usable raw Markdown H1, earliest usable raw Markdown heading, then manual editing. It does not read title from viewer DOM, tab title, or URL.
- Selection context preparation is local and lightweight. It locates the selected text in cleaned Markdown, adds nearby context, then adds keyword-retrieved paper context.
- Conversation history is stored by canonical paper key in IndexedDB. It reloads when that PDF link becomes active again.
- Selection question presets are stored in `chrome.storage.local` and can be edited from the extension Options page.
- AI provider settings are local to the installed browser profile. The API key is not rendered back into the Options page after saving; paste a new key to replace it, or clear it from Options. The system prompt is editable from the same page.
- Debug mode still appends user and placeholder assistant messages to the active conversation thread, so it can be used to test tab switching and multi-thread storage without spending model tokens.
- The selected-text answer flow currently uses Gemini's `generateContent` REST API through a small provider adapter.
- The production parser adapter lives in `src/parsers/outline-guided-markdown-parser.js`; its deterministic reconstruction logic lives in `src/pdf/outline-guided-core.js`.
- If automatic loading fails with a content-type or request error, test with a direct arXiv PDF URL first.
- Selection capture is scoped to the current tab and resets when that tab navigates. The right-click menu uses the browser-provided selected text.
