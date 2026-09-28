# Paper Toaster

Firefox Manifest V3 extension for inspecting the active PDF from the browser sidebar.

## What Works

- Opens in the Firefox sidebar (toolbar button, `Alt+S`, or View → Sidebar).
- Reads the active tab URL.
- Fetches the active PDF URL with browser credentials.
- Falls back to fetching from the active tab context when publisher sites reject extension-origin requests.
- Tries browser-cache-aware page-context fetches across frames and embedded PDF viewers before giving up on PDF bytes.
- Falls back to rendered viewer text when PDF bytes cannot be fetched, with quality checks that reject publisher wrapper JavaScript/CSS.
- Parses PDFs locally with PDF.js and LiteParse WASM.
- Uses embedded PDF outlines when available and deterministic inferred outlines otherwise.
- Reconstructs final Markdown with outline-constrained heading hierarchy for PDFs of any supported size.
- Automatically loads the active PDF when the side panel opens or the active tab changes.
- Stores each parsed document in extension IndexedDB by canonical paper key and parser version, keeping the URL, editable title, final Markdown, parser artifacts, and small document metadata.
- Reuses stored Markdown when the same PDF URL is opened again, so it does not re-fetch or re-parse unless the reload icon is clicked.
- Extracts the paper title from PDF metadata first, then the first usable raw Markdown H1; if there is no usable H1, it uses the earliest usable raw Markdown heading.
- Lets the title be edited manually in the side panel.
- Stores test-compatible outline and parser diagnostics with the final Markdown.
- Downloads `outline.json`, `debug.json`, and `output.md` as one local ZIP from the single-paper header.
- Captures the latest selected text from the current PDF tab when available.
- Adds a right-click `------------------------------>` menu item for selected text.
- Answers selected-text questions by sending the current selection as a search anchor while the local Agent reads the managed paper Markdown file.
- Shows selected-text AI questions and answers as a conversation thread for the current selection.
- Persists each active conversation thread by canonical paper key in IndexedDB, so switching tabs does not erase the paper's chat memory.
- Adds a fixed top conversation thread rail: the left button creates a new thread, older threads scroll horizontally to the right, and existing threads can be selected or deleted.
- Supports slash prompt presets in the selected-text question box, backed by extension-local settings.
- Supports Debug mode in Options, which returns deterministic placeholder answers without making AI API requests.
- Provides an Options page for local AI provider settings. API keys are stored in extension-local storage and are not committed to the repo.
- Provides parallel Board and Archive library views. Archive preserves local paper/comparison data, Restore returns records to the Board, and Archive View can export restorable JSON without deleting local records.
- Keeps archived/dead Labels gray and outside the five colored Board Label slots.

Whole-paper, selected-text, and comparative questions use managed outline-guided Markdown files; Saved Q&A remains stored in extension IndexedDB.

## Load In Firefox

Requires Firefox 140 or later.

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose `Load Temporary Add-on…`.
3. Select `manifest.json` in this folder:

   `/Users/ziru/Documents/GitHub/PaperToaster`

   Or run `npm run firefox:run` to launch a fresh Firefox profile with the extension loaded and auto-reloaded on file changes.

4. Open a PDF, for example an arXiv PDF or the ACM test URL from `guideline.md`.
5. Click the Paper Toaster toolbar button to open the sidebar.
6. The active PDF loads automatically. Click the reload icon in the upper-right corner only when you want to force a fresh parse.
7. Select text in the PDF viewer, then use the right-click `------------------------------>` menu item.
8. Enter a question, or type `/` to choose a prompt preset, then press Enter.

`npm run firefox:lint` validates the extension with Mozilla's `web-ext` linter, and `npm run firefox:build` packages it into `web-ext-artifacts/`.

Firefox notes:

- Host access for `http://*/*` and `https://*/*` is requested at install. If PDFs stop loading, check that the permission is still granted under `about:addons` → Paper Toaster → Permissions.
- Firefox only opens the sidebar in direct response to a user action. Toolbar clicks, the context-menu item, and Dashboard clicks open it; selecting text in a page does not.
- Firefox's built-in PDF viewer does not run extension content scripts, so selections in PDFs are captured through the right-click menu item.

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
- The bridge stores content-addressed Markdown files and builds request-scoped citation views. Questions send document references and the current question, not browser-retrieved passages or chat history.
- Conversation history is stored by canonical paper key in IndexedDB. It reloads when that PDF link becomes active again.
- Selection question presets are stored in extension-local storage and can be edited from the extension Options page.
- Local-agent settings are local to the installed browser profile and auto-save from Options. AI Provider, Mode, and System Prompt are independent sections; the saved bearer token is not rendered back into the token field.
- Debug mode still appends user and placeholder assistant messages to the active conversation thread, so it can be used to test tab switching and multi-thread storage without spending model tokens.
- Single-paper and Comparative Reading answers use the token-protected local bridge with a selectable Codex CLI or Antigravity CLI profile.
- The production parser adapter lives in `src/parsers/outline-guided-markdown-parser.js`; its deterministic reconstruction logic lives in `src/pdf/outline-guided-core.js`.
- If automatic loading fails with a content-type or request error, test with a direct arXiv PDF URL first.
- Selection capture is scoped to the current tab and resets when that tab navigates. The right-click menu uses the browser-provided selected text.
