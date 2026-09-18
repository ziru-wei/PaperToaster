# Dashboard Archive, Export, And Import

Last updated: 2026-09-09

Status: implemented; manual acceptance pending.

## Archive State

Archive is an in-product state for papers and Comparative Reading sessions. Archiving a record sets `archivedAt`, clears its star, removes it from the Board, and shows it in Archive View. Documents, parser artifacts, conversations, aliases, comparison messages, and cross-record references remain local and are not copied or deleted.

The Dashboard and Archive View share one extension page. The upper-right view button switches between them. Search and Label/Time grouping work in both views; Archive View does not expose Sort, Star, or Add to Comparison.

Archived paper cards and archived comparison cards load their stored context into the Side Panel. Opening an archived paper's web PDF also reuses its cached document without restoring or reparsing it.

## Management Actions

Board selection mode supports:

- `Archive`: move selected papers/comparisons to Archive View without exporting or deleting them.
- `Delete`: permanently delete selected records using the existing cascade.

Archive selection mode supports:

- `Restore`: return selected records to the Board.
- `Delete`: permanently delete selected records.
- `Export`: download a restorable JSON file without changing local state.

The former Board `Backup` action has been removed. Its non-destructive JSON behavior now belongs to Archive View's `Export` action.

## Label Rules

Archive Labels are editable but always gray. Archive Label creation, rename, assignment, and deletion affect only archived papers and do not consume any of the five colored Board Label slots.

Board Label changes do not mutate archived papers. On Restore, a paper rejoins a live colored Label only when the Board currently has the same normalized Label name. Otherwise the name is retained as a gray dead Label. Dead Labels group by name, remain editable, and do not consume colored Label slots.

## Comparative Reading

Papers and comparison sessions have independent archive state. Archiving a paper does not change existing comparison membership, and existing comparisons may continue reading its cached document. Archived papers are excluded from new comparison candidates and rejected by draft/session validation.

Restoring a comparison does not restore its source papers. Permanent paper deletion retains the existing pruning behavior: deleted keys are removed from comparisons, and comparisons with fewer than two papers are deleted with their messages.

## Export Format

The current transfer envelope is version 4:

```json
{
  "schema": "pdf-ai-inspector.library-archive",
  "version": 4,
  "exportedAt": "2026-09-09T00:00:00.000Z",
  "documentKeys": ["..."],
  "comparisonIds": ["..."],
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

Exports include final Markdown/parser artifacts, paper metadata and Label/archive state, threads/messages, aliases, and eligible comparison sessions/messages. Exporting a selected comparison includes its required source-paper records. Raw extraction blocks and derived RAG packs are not exported.

## Import Semantics

Versions 3 and 4 are accepted. After validation, Import asks for one destination:

- `Import to Dashboard`: import records as active. Labels matching a current live Board Label adopt its tone; other Labels become gray dead Labels.
- `Import to Archive`: import records as archived, unstarred records with gray Archive Labels.
- `Cancel`: write nothing.

Import keeps skip-existing semantics across both views. If any local data already exists for a paper key, that paper is skipped and is not moved between Board and Archive. Existing comparison IDs are also skipped. Restore/Archive, rather than Import, changes the state of an existing local record.

## Implementation Modules

```text
src/storage/library-lifecycle-store.js
  atomic Archive and Restore transitions

src/storage/library-archive-store.js
  JSON Export/Import and permanent deletion

src/dashboard/dashboard-bulk-actions.js
  Board and Archive selection actions

src/components/import-destination-dialog.js
  Import destination choice
```
