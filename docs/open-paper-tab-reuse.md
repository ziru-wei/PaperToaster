# Open Paper Tab Reuse

Status: planned and implemented as a small browser utility.

## Need

When the Reading Dashboard is open in the main browser tab, the side panel can show a single paper's saved context. From that side-panel state, the user needs a lightweight way to open the paper page itself.

If the paper is already open in another browser tab, Paper Toaster should focus that existing tab instead of opening a duplicate.

## Behavior

- The existing URL line in the side-panel header is the open target.
- Clicking the URL line, or pressing Enter/Space while it is focused, opens the paper.
- If an existing tab represents the same paper, focus that tab and its window.
- If no matching tab exists, open a new tab with the paper URL.
- The Dashboard tab itself should not be opened as the paper URL when the side panel is showing a dashboard-selected paper.

## Matching Strategy

Use conservative, deterministic matching:

- First compare normalized URLs.
- Then compare existing document memory keys.

Normalized URL matching strips URL hashes, removes volatile tracking/session parameters through the existing `normalizeDocumentUrl()` helper, lowercases protocol/host, and sorts query parameters.

Document-key matching uses the existing `getDocumentMemoryKey()` logic, so DOI, arXiv, and IEEE article-number URLs can still resolve to the same paper without relying on title matching.

No title-based or fuzzy matching is used.

## Architecture

New browser helper:

```text
src/browser/open-paper-tab.js
```

Responsibilities:

- validate openable URLs
- query current browser tabs
- find an exact normalized URL match
- find a document-key match
- focus the existing tab/window if found
- otherwise open a new tab

Side-panel integration:

- `sidepanel-document-context.js` owns the displayed paper URL, so it binds click/keyboard behavior to `#tabStatus`.
- In active PDF mode, it opens the current document URL.
- In dashboard-selected library-paper mode, it opens the hydrated document or paper canonical URL, not the dashboard URL.

Future reuse:

- Comparative Reading paper chips can use the same helper so their paper-link buttons also avoid duplicate tabs.
