# Reading Dashboard Plan

## Goal

Build a separate extension dashboard page that shows every paper already known to the local database, including papers that are not currently open in a browser tab.

This is a reading dashboard, not an AI chat page. It should help answer:

- What papers have I opened or discussed?
- Which papers have conversation history?
- Which paper did I talk about first or most recently?
- How are papers grouped by my own labels?
- Which paper should I jump back into?

The dashboard should reuse the current local IndexedDB memory. It should not create a second source of truth.

## Scope

Included:

- A full-page extension dashboard, likely `src/dashboard/dashboard.html`.
- Gallery/list view over local `papers`.
- Paper title, URL/domain, local context status, conversation thread count, message count, first conversation time, latest activity time.
- Sort controls.
- Label creation, editing, ordering, and assignment.
- Open paper URL in browser tab.
- Open the active side panel context when the paper is already open or after opening the URL.

Not included in the first pass:

- AI features.
- Notes features.
- Scanning Downloads, browser history, Zotero, Google Scholar Library, or arbitrary local folders.
- Storing raw Markdown, chunks, or extra RAG artifacts.
- Full-text search across Markdown. This can come later.

Important boundary: the dashboard can only show PDFs with local records. If a PDF has never been opened/loaded by the extension, the local database has no reliable way to know it exists.

## Current Data Foundation

Current database: `pdf-ai-inspector`, version `2`.

Relevant existing stores:

```text
papers
  documentKey
  canonicalUrl
  title
  titleSource
  metadata
  activeThreadId
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

Add labels as normalized records instead of embedding only a string on `papers`. This keeps label ordering clean and allows multiple labels later without migrating again.

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
  labelId,
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
  labels,
  hasMarkdown,
  parserId,
  pageCount,
  byteLength,
  threadCount,
  messageCount,
  firstConversationAt,
  lastConversationAt,
  lastOpenedAt,
  updatedAt,
  activeThreadId
}
```

Most fields are derived:

- `hasMarkdown`: any `documents` record exists for `documentKey` with non-empty `markdown`.
- `threadCount`: count of non-empty or all conversation threads, depending on UI choice.
- `messageCount`: sum of `conversationThreads.messageCount`.
- `firstConversationAt`: minimum non-null `conversationThreads.firstMessageCreatedAt`.
- `lastConversationAt`: maximum `conversationThreads.updatedAt` among threads with messages.
- `lastOpenedAt`: `papers.updatedAt` or a future explicit field if needed.

Recommendation: empty threads should not make a paper look active. They can exist as active working state, but dashboard counters and dates should prefer threads with `messageCount > 0`.

## Sorting

Initial sort options:

```text
Latest activity
First conversation
Title
Label
Recently opened
Largest PDF
Most messages
```

Definitions:

- Latest activity: `max(lastConversationAt, updatedAt)`.
- First conversation: earliest `firstConversationAt`; papers without conversation go last.
- Title: locale-aware title sort.
- Label: global label order first, then title.
- Recently opened: `papers.updatedAt` for now; can become `lastOpenedAt` later.
- Largest PDF: `documents.byteLength`, descending.
- Most messages: total message count, descending.

Default sort:

```text
Latest activity desc
```

This matches the way a reading dashboard is usually used: resume what was recently touched.

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

label rail
  All
  Unlabeled
  user labels in custom order
  manage labels

paper gallery/list
  paper card/row
    title
    source URL/domain
    labels
    conversation/thread summary
    local context status
    latest/first conversation timestamp
```

Recommended first UI shape: list-first gallery.

Reason: papers have long titles, URLs, thread counts, and timestamps. A pure visual card gallery wastes vertical space and makes scanning harder. The page can still feel like a gallery through elegant rows/cards, but information density matters.

Paper item content:

```text
Title
domain / short URL
label chips
3 threads · 14 messages
Context ready / metadata only
First talked: Sep/05 14:31
Latest: Today 16:02
```

Actions per paper:

- Open PDF.
- Continue active thread.
- Rename title.
- Assign label.
- Remove local record, only after a confirmation.

The remove action should be conservative and not prominent.

## Label Management

Labels should be first-class but light.

Label capabilities:

- Create label.
- Rename label.
- Choose subtle color.
- Reorder labels.
- Delete label.
- Assign/unassign label from a paper.

Ordering behavior:

- Global label order lives in `labels.sortOrder`.
- Dashboard label rail displays labels by `sortOrder`.
- Sorting by label uses `sortOrder`, then paper title.

Unlabeled behavior:

- Unlabeled is a virtual filter, not a stored label.
- When sorting by label, unlabeled papers go after labeled papers unless the active filter is Unlabeled.

## Efficient Query Strategy

For the first implementation, the dataset is probably small enough to aggregate in memory:

```text
getAll(papers)
getAll(documents)
getAll(conversationThreads)
getAll(labels)
getAll(paperLabels)
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

1. Add DB stores and storage APIs for labels and dashboard summaries.
2. Add `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
3. Render read-only paper list from existing DB.
4. Add sort controls.
5. Add label rail and label filter.
6. Add create/rename/reorder/delete labels.
7. Add assign/unassign labels on paper items.
8. Add side panel entry point to open dashboard.

Keep the first milestone read-only until summary aggregation is correct.

## First Implementation Pass

Implemented first:

- `src/dashboard/dashboard.html`, `dashboard.css`, and `dashboard.js`.
- `src/storage/library-store.js` for paper summary aggregation.
- `src/storage/label-store.js` for label CRUD, paper-label assignment, and label ordering.
- IndexedDB version `3` with `labels` and `paperLabels`.
- Side panel dashboard entry icon using `src/assets/icons/waves-arrow-down.svg`.

The dashboard currently aggregates all local papers in memory from IndexedDB. It does not read full conversation messages or raw Markdown.

## Open Questions

- Should a paper support multiple labels, or exactly one primary label? The normalized plan supports multiple, but the UI can initially expose one.
- Should papers with only cached Markdown and no conversation appear, or should the dashboard show only papers with at least one non-empty thread? Current recommendation: show all local papers, but visually distinguish `no conversation yet`.
- Should deleting a paper local record also delete cached Markdown and conversation history, or should these be separate actions?
- Should dashboard search include Markdown content later, or only title/domain/metadata/labels?
