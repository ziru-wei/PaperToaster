# Dashboard Open Items

Last updated: 2026-09-05

## Current State

The Reading Dashboard is a separate extension page that lists papers already known to the local IndexedDB database. It shows compact paper cards, title-as-link, thread start timestamps, star state, and a message-density ring.

The side panel supports two context sources: the active PDF tab and a dashboard-selected library paper.

The dashboard also has a compact management mode for bulk archive/delete/import. Details are in `docs/dashboard-archive-import.md`.

## Implemented Feature: Dashboard Paper Context In Side Panel

Goal:

When the Reading Dashboard is open on the left/main browser area, the PDF AI side panel should not try to inspect the dashboard page as a PDF. Instead, clicking a paper-level control in the dashboard should load that paper's saved context into the side panel.

Expected behavior:

- The dashboard stays open in the main tab.
- Clicking a dashboard paper card selects that paper for the side panel.
- The side panel displays the same document title, URL, context ready state, conversation thread wheel, chat history, selected-text composer, and RAG-backed ask flow that it displays when the PDF itself is open.
- The side panel should hydrate from local storage by `documentKey`; it should not fetch or parse the PDF again.
- If the user switches from the dashboard to a real PDF tab, the side panel should return to active PDF tab mode.
- The selected dashboard card shows a subtle active state.
- Dashboard cards refresh when side panel conversation activity changes.
- The side panel title star and dashboard card star share the same `papers.starred` storage field.
- Placeholder title records such as `Untitled paper` and `Title not found` are hidden from the dashboard list.

## Architecture

Add two explicit side panel context sources:

```text
active-pdf-tab
library-paper
```

`active-pdf-tab`:

- Current behavior.
- The active tab URL drives document key resolution, cached document lookup, PDF load, selection capture, and conversation thread loading.

`library-paper`:

- The dashboard sends a message containing `documentKey`.
- Background/session storage records the selected dashboard paper context.
- Side panel loads the document, paper summary, and threads by `documentKey`.
- No PDF fetch, no tab DOM inspection, and no active-tab URL validation should run in this mode.

## Message Flow

Dashboard:

```js
chrome.runtime.sendMessage({
  type: "OPEN_LIBRARY_PAPER_CONTEXT",
  documentKey
});
```

Background:

- Store `{ documentKey, source: "dashboard" }` in `chrome.storage.session`.
- Open the side panel if needed.
- Notify the side panel that a library paper was selected.

Side panel:

- If active tab is `src/dashboard/dashboard.html`, check for a selected library paper context.
- If present, hydrate from IndexedDB by `documentKey`.
- If absent, show a quiet empty dashboard-sidepanel state rather than attempting PDF inspection.

## Storage APIs Needed

Storage helpers:

```js
getStoredDocumentByDocumentKey(documentKey)
getLibraryPaperSummary(documentKey)
```

The final side panel state is composed from:

```js
{
  paper,
  document
}
```

Conversation threads/messages are still loaded by the existing conversation controller after the hydrated document URL is set.

Requirements:

- Use the newest cached document for the `documentKey` from `documents.byDocumentKey`.
- Use existing conversation thread/message stores through the current conversation controller.
- Preserve the current active thread if present.
- Ignore duplicate empty threads the same way current chat storage does.

## UI Trigger

The dashboard paper card is the side panel context trigger.

Rationale:

- The title already opens the paper URL.
- The star is paper triage.
- The message-density ring is only an activity indicator.
- The card-level target is easier to hit and makes context switching feel direct.

## Current Dashboard Visual Open Items

- Message-density ring currently uses fixed circle size with proportional conic fill. If desired later, the circle diameter itself could also scale by message count, but fixed-size rings are easier to scan in a card grid.
- The exact message count is currently available through tooltip/aria-label, not visible text.
- Cards intentionally do not show thread count text.
- Cards with placeholder titles are filtered from the visible dashboard, but their raw database records are not deleted.

## Search Open Item

Current search is metadata-level only: title, canonical URL, and domain.

Possible future full-text search:

- Add a lightweight `searchIndex` store derived from cleaned Markdown.
- Store normalized chunks with `documentKey`, `startLine`, `endLine`, and compact text.
- Search against the index, not full Markdown records directly.
- Clicking a result can select the paper in side panel and optionally highlight or navigate later.

This should be a separate feature from dashboard paper context.

## Non-Goals For Now

- No note-taking system.
- No labels in current dashboard UI.
- No open-time display or open-time sorting in dashboard cards.
- No PDF parsing from the dashboard page.
