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
- Provides an Options page for local AI provider settings. API keys are stored in `chrome.storage.local` and are not committed to the repo.
- Provides parallel Board and Archive library views. Archive preserves local paper/comparison data, Restore returns records to the Board, and Archive View can export restorable JSON without deleting local records.
- Keeps archived/dead Labels gray and outside the five colored Board Label slots.

Whole-paper, selected-text, and comparative questions use managed outline-guided Markdown files; Saved Q&A remains stored in extension IndexedDB.

## Load In Edge

1. Open `edge://extensions`.
2. Enable `Developer mode`.
3. Choose `Load unpacked`.
4. Select this folder:

   `/Users/ziru/Documents/GitHub/PaperToaster`

5. Open a PDF, for example an arXiv PDF or the ACM test URL from `guideline.md`.
6. Click the extension icon to open the side panel.
7. The active PDF loads automatically. Click the reload icon in the upper-right corner only when you want to force a fresh parse.
8. Select text in the PDF viewer, then use the right-click `------------------------------>` menu item.
9. Enter a question, or type `/` to choose a prompt preset, then press Enter.

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
- Selection question presets are stored in `chrome.storage.local` and can be edited from the extension Options page.
- Local-agent settings are local to the installed browser profile and auto-save from Options. AI Provider, Mode, and System Prompt are independent sections; the saved bearer token is not rendered back into the token field.
- Debug mode still appends user and placeholder assistant messages to the active conversation thread, so it can be used to test tab switching and multi-thread storage without spending model tokens.
- Single-paper and Comparative Reading answers use the token-protected local bridge with a selectable Codex CLI or Antigravity CLI profile.
- The production parser adapter lives in `src/parsers/outline-guided-markdown-parser.js`; its deterministic reconstruction logic lives in `src/pdf/outline-guided-core.js`.
- If automatic loading fails with a content-type or request error, test with a direct arXiv PDF URL first.
- Selection capture is scoped to the current tab and resets when that tab navigates. The right-click menu uses the browser-provided selected text.

## Google account sync

Click the cloud indicator in the Dashboard header → **Sign in with Google** to connect an account. Approve Google's consent screen once; automatic sync then starts. The indicator's dot shows disconnected (gray), pending (amber), syncing (pulsing blue), synced (green), or error (red); hover for status or click for account details and **Disconnect**. Settings also provides the account controls and an optional **Sync now** button. Ordinary users do not need a Google Cloud project or any OAuth configuration. Sync is opt-in. It includes Board and Archive papers, parsed Markdown and parser artifacts, labels/stars, notes (including images), conversation threads, saved Q&A and annotations, comparative readings, prompt presets, model preferences, system prompt, parsing options, and dashboard preferences.

Data is stored in Google Drive's private application data folder using the `drive.appdata` scope, not in a visible Drive document. Raw PDF files, local Agent endpoints/tokens, Google access tokens, current-tab context, and local CLI session files are not uploaded. Markdown content hashes remain in synced records so the existing Agent upload flow can register each paper on the receiving machine before answering.

### One-time Google OAuth setup (developer only)

Before distributing a build, the developer configures a real Google Cloud OAuth client registered against this extension's stable Chrome ID. Ship the configured manifest to users; they only sign in and consent. Local reading also works in builds without OAuth configuration.

When switching an existing unpacked installation to a fixed extension ID, first open Settings → **Full Backup** → **Export full backup** and verify the downloaded JSON exists. This exports Board/Archive records with their original label/star/archive metadata, image notes, conversations, and persistent preferences, including this device's Local Agent settings. After loading the extension with its fixed ID, use **Restore full backup** before connecting Google. Restore fills missing records/settings and keeps existing ones; Google account/device identity is excluded from the backup. Keep the original installation until the restored library is verified.

You can reuse an existing Google Cloud project from another plugin: keep its existing OAuth client, add a new Chrome Extension OAuth client for Paper Toaster's extension ID, and enable Google Drive API/add the required scopes if needed. A client bound to the other extension's ID cannot be used with Paper Toaster's different ID. OAuth branding, audience, and publishing status are project-level settings shared by the project's clients, so retain branding appropriate for both plugins if sharing a project.

1. For an unpacked development extension, run:

   ```sh
   npm run configure:google -- --generate-key
   ```

   This adds a public `key` to `manifest.json` and prints a stable extension ID. Keep the same public key on all installations. Reload the extension and confirm its ID in `chrome://extensions`. Changing the ID creates a different extension storage namespace; export existing local library data before changing it, then import it into the new installation.

   For a Chrome Web Store extension, use its existing ID and public key instead of generating a development key. Pass the public key with `--extension-key` when configuring the client. Do not replace an established extension key.

2. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project and enable **Google Drive API**. Configure Google Auth Platform branding/audience and add these scopes under Data Access:

   - `https://www.googleapis.com/auth/drive.appdata`
   - `openid`
   - `email`

   While the OAuth app is in Testing, add the Google accounts you will use as test users.

3. Create an OAuth client of type **Chrome Extension** (sometimes labeled **Chrome app**). Set its Application ID to the stable extension ID from step 1. No client secret is used or stored by the extension.

4. Configure the resulting client ID:

   ```sh
   npm run configure:google -- --client-id YOUR_CLIENT_ID.apps.googleusercontent.com
   ```

   The script writes the `oauth2` declaration to `manifest.json`. Use the actual client ID, which starts with a numeric project identifier. Keep this manifest's `key` and OAuth configuration identical across devices.

5. Reload Paper Toaster in `chrome://extensions`. Open Dashboard → cloud indicator, click **Sign in with Google**, and approve access. Distribute the configured extension; other users perform only this login/consent step.

See the official [Chrome OAuth setup](https://developer.chrome.com/docs/extensions/how-to/integrate/oauth), [Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity), and [Google Drive application data](https://developers.google.com/workspace/drive/api/guides/appdata) documentation.

### Sync behavior

- Local changes trigger sync after approximately three seconds without further edits. A 30-second fallback alarm survives background-worker suspension and prevents continuous editing from postponing sync indefinitely. A one-minute alarm checks for other devices' changes while Chrome is running; opening or focusing Dashboard/Settings and restoring the network also check for pending, failed, or overdue sync. Chrome may delay background alarms. Background retries never open a sign-in popup; authorization errors appear in the indicator and Settings. **Sync now** in Settings is optional.
- Each installation writes its own JSON replica; devices merge records using revision clocks with a stable device-ID tie breaker. Different records merge independently. Concurrent edits to the same record use the later revision observed at sync; individual AI preferences merge independently. This is not collaborative text editing.
- Deletion markers prevent offline replicas from restoring deleted records. Paper/thread deletion also removes stale child data. New installations merge existing local data with cloud data rather than clearing either library.
- Local edits made during a download are retained. Failed downloads do not publish a partial merge. Offline changes and deletion markers survive failed uploads and retry later.
- Disconnect stops automatic sync and clears the extension's cached Google authorization. It keeps both local data and Drive replicas. Reconnecting resumes merging. If Chrome's Google account changes, sync stops with an error until you disconnect and connect again.
- This first version downloads the replicas and uploads a complete JSON replica when changes occur. Large libraries or image-heavy notes can take longer; deletion markers are retained, and cloud replicas are not compacted automatically.

Run `npm run test:sync` for the mocked Google API and IndexedDB checks. A real sign-in and two-device smoke test require the OAuth setup above: connect both devices, add/edit a note, sync each, verify the note and an archived paper, then delete a thread and verify it stays deleted after reconnecting an offline device.
