# Reading Dashboard Architecture

Last updated: 2026-09-07

Status: implemented. Unfinished work is tracked in `docs/unfinished-feature-plan.md`.

## Purpose

The Reading Dashboard is the local library view for Paper Toaster. It lists papers with stored document context and Comparative Reading sessions without fetching or reparsing PDFs.

## Data Model

Single-paper cards are derived from the `papers`, `documents`, and `conversationThreads` IndexedDB stores and joined by `documentKey`.

Paper-level UI state lives directly on the `papers` record:

```text
documentKey
canonicalUrl
title
isStarred
starredAt
group
groupTone
activeThreadId
createdAt
updatedAt
```

`group` is the current single-label value shown by the UI. `groupTone` is its stable palette index. Label creation, replacement, rename, deletion, and grouping are implemented by `src/storage/library-store.js`; there is no separate label or paper-label join store.

Comparative Reading cards are derived from `comparisonSessions` and `comparisonMessages`. They reference source papers by `documentKeys` rather than copying Markdown or paper metadata.

## Layout And Organization

- Default paper organization groups cards by Label.
- The alternate organization groups cards by latest conversation period.
- Search is metadata-level and does not scan complete Markdown.
- Sort criteria operate inside the active grouping mode.
- Single-paper and Comparative Reading records have separate visual regions.
- Activating a record hydrates the side panel from IndexedDB.
- Related records receive secondary highlighting without becoming active.

## Paper Actions

- Click a paper card to open its stored context in the side panel.
- Star/unstar is synchronized with the single-paper side-panel header.
- Labels can be created, assigned, replaced, renamed, and deleted from the shared label control.
- A paper can be added to a draft comparison from its card or through Dashboard selection mode.
- Existing paper tabs are reused when opening a paper URL.

## Management

Selection mode supports paper and comparison records:

- Backup exports selected records.
- Archive exports and then deletes selected records.
- Delete removes selected records after confirmation.
- Import is a separate action and accepts only the current archive schema.
- Clear Unasked removes only paper records without Q&A and does not remove comparison sessions.

Archive behavior is documented in `docs/dashboard-archive-import.md`.

## Module Boundaries

```text
src/dashboard/dashboard.js
  page coordination and state

src/dashboard/dashboard-renderer.js
  card/group/comparison rendering

src/dashboard/dashboard-bulk-actions.js
  selection, backup, archive, delete, and import

src/components/paper-label-control.js
  shared paper Label interaction

src/storage/library-store.js
  paper summaries, stars, and group metadata

src/storage/library-archive-store.js
  archive/import persistence
```

The dashboard does not own PDF parsing, conversation persistence, or AI provider behavior.
