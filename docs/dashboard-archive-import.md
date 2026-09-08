# Dashboard Archive And Import

Last updated: 2026-09-07

Status: implemented for single-paper and eligible Comparative Reading records.

## Goal

Add a lightweight management mode to the Reading Dashboard so papers can be selected in bulk, archived, deleted, and later restored.

## Current Implementation

The dashboard has a selection-management mode:

- The selection button toggles card-level selection and bulk management controls.
- Cards can be multi-selected.
- `Import` is a separate dashboard action next to the selection button.
- `Select all` selects all currently visible dashboard papers.
- `Backup` exports selected dashboard papers and does not delete anything.
- `Delete` removes selected papers from local IndexedDB.
- `Archive` exports selected records as a JSON file, then deletes them locally.
- `Import` reads a previously exported JSON archive and restores records into IndexedDB.
- Comparative Reading records can also be selected in Manage mode. Backup/Archive/Delete applies to selected comparison records as well as selected paper records.

Archive data is handled in `src/storage/library-archive-store.js`. The dashboard UI only owns selection state, file download/upload, and confirmation prompts.

## Archive Format

The archive is a JSON object:

```json
{
  "schema": "pdf-ai-inspector.library-archive",
  "version": 3,
  "exportedAt": "2026-09-05T00:00:00.000Z",
  "documentKeys": ["..."],
  "records": {
    "papers": [],
    "documents": [],
    "conversationThreads": [],
    "conversationMessages": [],
    "documentAliases": [],
    "comparisonSessions": [],
    "comparisonMessages": []
  }
}
```

The exported data includes final Markdown and parser artifacts stored in `documents`, conversation threads/messages, aliases, paper metadata, star state, `group`/`groupTone` Label state on paper records, and Comparative Reading sessions/messages whose full paper set is included in the export. It does not include raw LiteParse/PDF.js extraction data or derived RAG chunks.

Only version 3 archives are accepted. Earlier experimental archive versions are intentionally unsupported.

## Delete Semantics

Deleting or archiving a paper removes records keyed by `documentKey` from:

- `papers`
- `documents`
- `conversationThreads`
- `conversationMessages`
- `documentAliases`

Comparative Reading sessions are pruned when selected papers are deleted. If a comparison loses too many papers to remain meaningful, its session and messages are removed. If at least two papers remain, the deleted paper keys are removed from the session.

## Import Semantics

Import defaults to `skip existing` at the paper level.

If any local records already exist for an archived `documentKey`, the whole paper is skipped. This prevents an older backup from overwriting newer local Markdown or newer conversation messages. Newly added papers are imported with their document records, final Markdown and parser artifacts, conversation threads/messages, aliases, star and Label state, and eligible Comparative Reading sessions.

After import, the dashboard shows a popup with:

- how many papers were added
- how many existing papers were skipped

Future conflict handling could add explicit advanced options:

- Preview before import.
- Overwrite existing records.
- Import summary by paper title.
- Explicit archive migrations if backward compatibility becomes a future requirement.

## Open Questions

- Whether archive should include an optional human-readable Markdown sidecar for each paper.
- Whether archive should be split into one file per paper when many papers are selected.
- Whether delete should require typing a confirmation word for large selections.
