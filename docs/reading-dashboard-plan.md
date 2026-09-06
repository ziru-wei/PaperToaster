# Reading Dashboard Plan

Last updated: 2026-09-06

Status: dashboard MVP is implemented. This file is now a historical design note plus current-state reference. Deferred work is consolidated in `docs/unfinished-feature-plan.md`.

## Goal

Build a separate extension dashboard page that shows every paper already known to the local database, including papers that are not currently open in a browser tab.

This is a reading dashboard, not an AI chat page. It should help answer:

- What papers have local reading context or discussion history?
- Which papers have conversation history?
- Which paper did I talk about first or most recently?
- Which paper should I jump back into or star for later?

The dashboard should reuse the current local IndexedDB memory. It should not create a second source of truth.

## Scope

Included:

- A full-page extension dashboard, likely `src/dashboard/dashboard.html`.
- Gallery/list view over local `papers`.
- Plain paper title, message count visualization, first/early ask time, latest ask time.
- Sort controls.
- Open stored paper context in the side panel by clicking the card.
- Star/unstar papers as lightweight local triage.
- Manage mode for import, backup, archive, delete, and select all.
- Comparative Reading records shown as a separate dashboard record type.

Not included in the first pass:

- AI features.
- Notes features.
- Scanning Downloads, browser history, Zotero, Google Scholar Library, or arbitrary local folders.
- Storing raw Markdown, chunks, or extra RAG artifacts.
- Full-text search across Markdown. This can come later.

Important boundary: the dashboard can only show PDFs with local records. If a PDF has never been opened/loaded by the extension, the local database has no reliable way to know it exists.

## Current Data Foundation

Current database: `pdf-ai-inspector`, version `4`.

Relevant existing stores:

```text
papers
  documentKey
  canonicalUrl
  title
  titleSource
  metadata
  activeThreadId
  isStarred
  starredAt
  createdAt
  updatedAt

documents
  key
  documentKey
  parserId
  cacheVersion
  title
  markdown
  pageCount
  byteLength
  updatedAt

conversationThreads
  threadId
  documentKey
  title
  messageCount
  createdAt
  firstMessageCreatedAt
  updatedAt

conversationMessages
  messageId
  threadId
  documentKey
  sequence
  role
  text
  selectionText
  isSaved
  createdAt

comparisonSessions
  comparisonId
  documentKeys
  title
  messageCount
  isStarred
  createdAt
  firstMessageCreatedAt
  updatedAt

comparisonMessages
  messageId
  comparisonId
  sequence
  role
  text
  isSaved
  citedDocumentKeys
  createdAt
```

The dashboard should be built around `documentKey`, not title. Title remains editable and unsafe as a key.

## Proposed Storage Additions

The current dashboard-visible migration baseline is IndexedDB version `4`.

Current visible triage is a paper-level star on `papers`.

```text
papers.isStarred
papers.starredAt
```

The database also has normalized label stores from an earlier dashboard pass. They are not exposed in the current dashboard UI, but they can remain for possible future use without affecting the current page.

```text
labels
  labelId
  name
  color
  sortOrder
  createdAt
  updatedAt

paperLabels
  paperLabelId
  documentKey
  labelId
  assignedAt
```

Indexes:

```text
labels.bySortOrder
labels.byName
paperLabels.byDocumentKey
paperLabels.byLabelId
```

Why the paused label structure exists:

- Label order is global and user-arrangeable.
- A paper can start with one label, but the model supports multiple labels if needed.
- Sorting by label could use the first assigned label according to global `labels.sortOrder`.
- Deleting or renaming a label does not require rewriting all paper records.

Old MVP shortcut that was not used:

```js
papers.label = "To Read"
```

This is faster but weaker. It makes label ordering, renaming, deletion, and multi-label support messier. Prefer normalized labels unless implementation speed becomes the priority.

## Derived Paper Summary

Create a storage/query module:

```text
src/storage/library-store.js
```

Primary API:

```js
listLibraryPapers({
  sortBy,
  sortDirection,
  query
})
```

Return shape:

```js
{
  documentKey,
  title,
  canonicalUrl,
  domain,
  hasMarkdown,
  parserId,
  pageCount,
  byteLength,
  threadCount,
  messageCount,
  firstConversationAt,
  firstThreadStartedAt,
  lastThreadStartedAt,
  lastConversationAt,
  updatedAt,
  activeThreadId,
  isStarred,
  starredAt
}
```

Most fields are derived:

- `hasMarkdown`: any `documents` record exists for `documentKey` with non-empty `markdown`.
- `threadCount`: count of non-empty or all conversation threads, depending on UI choice.
- `messageCount`: sum of `conversationThreads.messageCount`.
- `firstConversationAt` / `firstThreadStartedAt`: earliest non-empty thread start time.
- `lastThreadStartedAt`: latest non-empty thread start time.
- `lastConversationAt`: maximum `conversationThreads.updatedAt` among threads with messages; not used for the card First/Last thread label.

Recommendation: empty threads should not make a paper look active. They can exist as active working state, but dashboard counters and dates should prefer threads with `messageCount > 0`.

## Sorting

Initial sort options:

```text
Latest ask
Early ask
Message count
Starred
```

Definitions:

- Latest ask: latest non-empty thread start time.
- Early ask: earliest `firstConversationAt`; papers without conversation go last.
- Message count: total message count, descending.
- Starred: starred papers first, then latest thread time.

Default sort:

```text
Latest ask desc
```

This matches the current dashboard semantics: resume what was recently discussed, without treating passive PDF loads as reading activity.

## Dashboard UI

Page type:

```text
chrome-extension://<id>/src/dashboard/dashboard.html
```

Entry points:

- Add a small dashboard/library icon in the side panel header later.
- Optional extension action menu entry later.

Visual direction:

- Same quiet, light UI language as the current side panel.
- No dark mode.
- Dense but elegant, closer to a reading workspace than a marketing page.
- Use compact controls, restrained borders, soft shadows, and enough whitespace for scanning.

Layout:

```text
top bar
  Paper Toaster dashboard icon
  search
  sort control
  manage/import/backup/archive/delete controls

paper gallery/list
  paper card/row
    title
    first/latest timestamps
    message-density ring
    add-to-comparison affordance
    star action

comparative reading list
  comparison record
    inferred title / first question
    timestamp
    star action
```

Current UI shape: mixed dashboard with paper cards on the left and Comparative Reading records on the right.

Reason: single papers and comparison sessions have different scanning needs. Paper cards need title/time/activity/star/add affordances; comparison records work better as a compact question/time list.

Paper item content:

```text
Title
plain text title
early/latest ask timestamps below title
message-density ring near the title
add-to-comparison affordance on the right edge
star button
```

Message-density ring scale: the visible paper with the highest `messageCount` is treated as 100%; other visible papers are drawn proportionally.

Actions per paper:

- Select paper context in the side panel by clicking the card.
- Continue active thread.
- Rename title.
- Star/unstar paper.
- Remove local record in Manage mode, only after confirmation.

The remove action should be conservative and not prominent.

## Label Management

Labels are paused in the current dashboard UI. If labels come back, they should be first-class but light. Current UI uses stars instead.

Label capabilities:

- Create label.
- Rename label.
- Choose subtle color.
- Reorder labels.
- Delete label.
- Assign/unassign label from a paper.

Ordering behavior:

- Global label order lives in `labels.sortOrder`.
- Dashboard label rail would display labels by `sortOrder`.
- Sorting by label would use `sortOrder`, then paper title.

Unlabeled behavior:

- Unlabeled is a virtual filter, not a stored label.
- When sorting by label, unlabeled papers go after labeled papers unless the active filter is Unlabeled.

## Efficient Query Strategy

For the first implementation, the dataset is probably small enough to aggregate in memory:

```text
getAll(papers)
getAll(documents)
getAll(conversationThreads)
merge by documentKey
sort/filter in JS
render
```

This is simpler and less bug-prone than premature complex indexes.

When the local library grows large, add paginated indexes:

- `papers.byUpdatedAt`
- `documents.byDocumentKey`
- `conversationThreads.byDocumentKey`
- `labels.bySortOrder`
- `paperLabels.byLabelId`

Avoid querying `conversationMessages` for every dashboard render. Thread-level `messageCount`, `firstMessageCreatedAt`, and `updatedAt` should be enough for summary cards.

## Full-Text Search Plan

Full-text search over cached Markdown is feasible, but it should not be implemented as "scan every full Markdown string on every keypress" once the library grows.

MVP strategy:

- Search title, URL, and domain immediately.
- Only search Markdown after a short debounce, such as 250-350 ms.
- Search the latest cached document per `documentKey`.
- Return paper-level matches first, with a small snippet and rough line/section location.
- Do not read `conversationMessages` for dashboard search.

More robust strategy:

```text
documents.markdown
  -> split into searchable section/paragraph records
  -> normalize text
  -> store compact search records keyed by documentKey
```

Possible store:

```text
documentSearchBlocks
  blockId
  documentKey
  documentStoreKey
  heading
  text
  normalizedText
  startLine
  endLine
  sortOrder
  updatedAt
```

This makes navigation possible:

- Dashboard search result can show the paper plus matched block snippet.
- Clicking a match can open the PDF URL and, when available later, hydrate the side panel with the paper context.
- If a future Markdown reader view exists, `startLine/endLine` can jump directly to the relevant Markdown block.

Recommendation: do not add Markdown full-text search until the card/grid dashboard interaction is stable. When added, implement it as a debounced indexed block search, not as repeated full-document scans from the UI event handler.

## Relationship To Side Panel

The dashboard should not own active chat state. It should only navigate or update durable storage.

Side panel remains responsible for:

- Active tab detection.
- PDF loading/parsing.
- Current conversation rendering.
- Selection capture.
- Asking AI.

Dashboard owns:

- Library overview.
- Star/management controls.
- Sorting/filtering.
- Paper-level metadata edits.
- Comparative record overview.

Shared modules:

```text
src/storage/library-store.js
src/storage/label-store.js
src/storage/document-store.js
src/storage/chat-store.js
src/storage/paper-database.js
```

Avoid importing side panel controllers into the dashboard.

## Migration

Version `3` migration, completed historically:

1. Create `labels`.
2. Create `paperLabels`.
3. Add needed indexes.
4. Do not rewrite existing paper/thread/document records.

Existing papers start as unlabeled.

Version `4` migration, completed:

1. Create `comparisonSessions`.
2. Create `comparisonMessages`.
3. Keep comparison records keyed separately from single-paper records while sharing paper/document stores for context rebuilds.

No cache invalidation is required.

## Implementation Order

1. Add storage API for dashboard summaries.
2. Add `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
3. Render read-only paper list from existing DB.
4. Add sort controls.
5. Add plain paper title and card-level side-panel selection.
6. Add star/unstar.
7. Add side panel entry point to open dashboard.

Keep the first milestone read-only until summary aggregation is correct.

## First Implementation Pass

Implemented first:

- `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
- `src/storage/library-store.js` for paper summary aggregation.
- `src/storage/label-store.js` exists for paused label support, but dashboard UI does not currently use labels.
- IndexedDB version `4` with labels/paperLabels plus comparison session stores.
- Side panel dashboard entry icon using the Paper Toaster dashboard icon.
- Responsive dashboard layout with paper cards and comparative records.
- Compact paper cards with plain title, ask timestamps, message-density ring, add-to-comparison affordance, and star.
- Comparative Reading records rendered as a compact list separate from paper cards.
- Manage mode supports Import, Select all, Backup, Archive, and Delete.
- Dashboard-selected paper and comparison records hydrate the side panel from storage instead of triggering PDF fetch/parse.
- Placeholder title records such as `Untitled paper` and `Title not found` are hidden from the visible dashboard.

The dashboard currently aggregates all local papers in memory from IndexedDB. It does not read full conversation messages or raw Markdown.

## Open Questions

- Should labels stay paused permanently, or come back later as a secondary organization layer? The normalized storage can support them if needed.
- Should deleting a paper local record also delete cached Markdown and conversation history, or should these be separate actions?
- Should dashboard search include Markdown content later, or only title/domain/metadata?

Resolved:

- Title is plain text, not an embedded link. Card click selects context; add/star/manage controls have their own hit targets.
- Thread count is not shown on cards.
- Open-time is not stored or displayed.
- Visible organization uses stars, not labels.
