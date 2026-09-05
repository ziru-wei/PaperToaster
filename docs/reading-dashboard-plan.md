# Reading Dashboard Plan

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
- Paper title link, conversation thread count, message count, first conversation time, latest activity time.
- Sort controls.
- Open paper URL in browser tab.
- Open the active side panel context when the paper is already open or after opening the URL.
- Star/unstar papers as lightweight local triage.

Not included in the first pass:

- AI features.
- Notes features.
- Scanning Downloads, browser history, Zotero, Google Scholar Library, or arbitrary local folders.
- Storing raw Markdown, chunks, or extra RAG artifacts.
- Full-text search across Markdown. This can come later.

Important boundary: the dashboard can only show PDFs with local records. If a PDF has never been opened/loaded by the extension, the local database has no reliable way to know it exists.

## Current Data Foundation

Current database: `pdf-ai-inspector`, version `3`.

Relevant existing stores:

```text
papers
  documentKey
  canonicalUrl
  title
  titleSource
  metadata
  activeThreadId
  starred
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
  createdAt
```

The dashboard should be built around `documentKey`, not title. Title remains editable and unsafe as a key.

## Proposed Storage Additions

Upgrade IndexedDB to version `3`.

Current visible triage is a paper-level star on `papers`.

```text
papers.starred
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

Why this structure:

- Label order is global and user-arrangeable.
- A paper can start with one label, but the model supports multiple labels if needed.
- Sorting by label can use the first assigned label according to global `labels.sortOrder`.
- Deleting or renaming a label does not require rewriting all paper records.

Possible MVP shortcut:

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
  starred,
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
Latest thread
First conversation
Title
Message count
Starred
```

Definitions:

- Latest thread: latest non-empty thread start time.
- First conversation: earliest `firstConversationAt`; papers without conversation go last.
- Title: locale-aware title sort.
- Message count: total message count, descending.
- Starred: starred papers first, then latest thread time.

Default sort:

```text
Latest thread desc
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
  title: Reading Dashboard
  search
  sort control

paper gallery/list
  paper card/row
    title
    title as embedded paper link
    first/latest timestamps aligned to the right
    message-density ring
    star action
```

Recommended first UI shape: list-first gallery.

Reason: papers have long titles, thread counts, and timestamps. A pure visual card gallery wastes vertical space and makes scanning harder. The page can still feel like a gallery through elegant rows/cards, but information density matters.

Paper item content:

```text
Title
embedded PDF link on title
left-aligned thread start timestamp below title
message-density ring
star button
```

Message-density ring scale: the visible paper with the highest `messageCount` is treated as 100%; other visible papers are drawn proportionally.

Actions per paper:

- Open PDF by clicking the title.
- Continue active thread.
- Rename title.
- Star/unstar paper.
- Remove local record, only after a confirmation.

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
- Label management.
- Sorting/filtering.
- Paper-level metadata edits.

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

Version `3` migration:

1. Create `labels`.
2. Create `paperLabels`.
3. Add needed indexes.
4. Do not rewrite existing paper/thread/document records.

Existing papers start as unlabeled.

No cache invalidation is required.

## Implementation Order

1. Add storage API for dashboard summaries.
2. Add `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
3. Render read-only paper list from existing DB.
4. Add sort controls.
5. Embed paper URL into the title link.
6. Add star/unstar.
7. Add side panel entry point to open dashboard.

Keep the first milestone read-only until summary aggregation is correct.

## First Implementation Pass

Implemented first:

- `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
- `src/storage/library-store.js` for paper summary aggregation.
- `src/storage/label-store.js` exists for paused label support, but dashboard UI does not currently use labels.
- IndexedDB version `3` with `labels` and `paperLabels`; visible star state is stored on `papers`.
- Side panel dashboard entry icon using `src/assets/icons/waves-arrow-down.svg`.
- Responsive dashboard grid: one, two, or three columns depending on available browser width.
- Compact paper cards with title-as-link, left-aligned thread start timestamp below the title, top-right message-density ring, and a bottom-right star.

The dashboard currently aggregates all local papers in memory from IndexedDB. It does not read full conversation messages or raw Markdown.

## Open Questions

- Should labels stay paused permanently, or come back later as a secondary organization layer? The normalized storage can support them if needed.
- Should papers with only cached Markdown and no conversation appear, or should the dashboard show only papers with at least one non-empty thread? Current recommendation: show all local papers, but visually distinguish `no conversation yet`.
- Should deleting a paper local record also delete cached Markdown and conversation history, or should these be separate actions?
- Should dashboard search include Markdown content later, or only title/domain/metadata?
