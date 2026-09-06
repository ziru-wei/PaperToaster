# Dashboard Archive And Import

Last updated: 2026-09-05

## Goal

Add a lightweight management mode to the Reading Dashboard so papers can be selected in bulk, archived, deleted, and later restored.

## Current Implementation

The dashboard now has a `Manage` mode:

- `Manage` toggles card-level checkboxes and bulk management controls.
- Cards can be multi-selected.
- `Import` lives inside `Manage` because it changes the local library, and it is only shown before any papers are selected.
- `Select all` selects all currently visible dashboard papers.
- `Backup` exports selected dashboard papers and does not delete anything.
- `Delete` removes selected papers from local IndexedDB.
- `Archive` exports selected records as a JSON file, then deletes them locally.
- `Import` reads a previously exported JSON archive and restores records into IndexedDB.

Archive data is handled in `src/storage/library-archive-store.js`. The dashboard UI only owns selection state, file download/upload, and confirmation prompts.

## Archive Format

The archive is a JSON object:

```json
{
  "schema": "pdf-ai-inspector.library-archive",
  "version": 1,
  "exportedAt": "2026-09-05T00:00:00.000Z",
  "documentKeys": ["..."],
  "records": {
    "papers": [],
    "documents": [],
    "conversationThreads": [],
    "conversationMessages": [],
    "documentAliases": [],
    "labels": [],
    "paperLabels": []
  }
}
```

The exported data includes cleaned Markdown stored in `documents`, conversation threads/messages, aliases, paper metadata, star state, and label assignments. It does not include raw Markdown or derived chunks unless those are already part of a stored document record.

## Delete Semantics

Deleting or archiving a paper removes records keyed by `documentKey` from:

- `papers`
- `documents`
- `conversationThreads`
- `conversationMessages`
- `documentAliases`
- `paperLabels`

Labels themselves are not deleted, because a label can belong to other papers.

## Import Semantics

Import defaults to `skip existing` at the paper level.

If any local records already exist for an archived `documentKey`, the whole paper is skipped. This prevents an older backup from overwriting newer local Markdown or newer conversation messages. Newly added papers are imported with their document records, cleaned Markdown, conversation threads/messages, aliases, star state, and label assignments.

After import, the dashboard shows a popup with:

- how many papers were added
- how many existing papers were skipped

Future conflict handling could add explicit advanced options:

- Preview before import.
- Overwrite existing records.
- Import summary by paper title.
- Archive compatibility migrations if the IndexedDB schema changes.

## Open Questions

- Whether archive should include an optional human-readable Markdown sidecar for each paper.
- Whether archive should be split into one file per paper when many papers are selected.
- Whether delete should require typing a confirmation word for large selections.
