# Storage And Threading Plan

Last updated: 2026-09-07

Status: current storage/threading MVP is implemented. Reserved or future storage work is called out explicitly and consolidated in `docs/unfinished-feature-plan.md`.

## Current Storage Architecture

The extension now uses one canonical paper key as the join point for document memory and conversation memory.

```text
documentKey
  -> papers
  -> documents
  -> conversationThreads
  -> conversationMessages
```

The current key priority is:

1. DOI from URL.
2. arXiv id from URL.
3. IEEE `arnumber` from URL.
4. Cleaned URL fallback.

Title is not a storage key. Title is editable and can be missing, duplicated, or wrong in PDF metadata.

## IndexedDB Stores

Database: `pdf-ai-inspector`

Version: `5`

Stores:

- `papers`
  - Key: `documentKey`
  - Holds the paper-level record.
  - Important fields: `documentKey`, `canonicalUrl`, `title`, `titleSource`, `metadata`, `activeThreadId`, `isStarred`, `group`, `groupTone`, `createdAt`, `updatedAt`.
- `documents`
  - Key: parser/cache-specific `key`.
  - Holds final Markdown, parse metadata, and outline/debug artifacts.
  - Important fields: `documentKey`, `parserId`, `cacheVersion`, `markdown`, `artifacts`, `pageCount`, `byteLength`, `contentType`, `metadata`.
- `conversationThreads`
  - Key: `threadId`.
  - Holds per-document conversation thread metadata.
  - Important fields: `threadId`, `documentKey`, `title`, `messageCount`, `createdAt`, `updatedAt`, `firstMessageCreatedAt`.
- `conversationMessages`
  - Key: `messageId`.
  - Holds individual messages.
  - Important fields: `messageId`, `threadId`, `documentKey`, `sequence`, `role`, `text`, `selectionText`, `isSaved`, `createdAt`.
- `documentAliases`
  - Key: `aliasKey`.
  - Reserved for future key promotion.
  - Intended shape: `aliasKey -> documentKey`.
- `comparisonSessions`
  - Key: `comparisonId`.
  - Holds persistent Comparative Reading sessions.
  - Important fields: `comparisonId`, `documentKeys`, `title`, `isStarred`, `starredAt`, `createdAt`, `updatedAt`, `firstMessageCreatedAt`, `messageCount`.
- `comparisonMessages`
  - Key: `messageId`.
  - Holds Comparative Reading dialog messages.
  - Important fields: `messageId`, `comparisonId`, `sequence`, `role`, `text`, `isSaved`, `citedDocumentKeys`, `createdAt`.

Settings and prompt presets still use `chrome.storage.local`.

## Implemented Takeaways

- Markdown cache and conversation history now share the same `documentKey`.
- Conversation memory no longer lives as one large `chrome.storage.local` object.
- Each document can have multiple conversation threads at the storage layer.
- Each document has an `activeThreadId`.
- If the user does not create a new thread, messages continue appending to the current active thread.
- The side panel still displays only the active thread.
- Empty thread accumulation is guarded in two places: the composer command does nothing when the active thread is already empty, and storage reuses one existing empty thread while pruning duplicate empty threads.
- Existing legacy conversation data in `chrome.storage.local.paperChatThreadsV1` is read lazily and written into IndexedDB when that paper is opened.
- Chunks are not stored. They are rebuilt from final Markdown when cached content is hydrated.
- Raw Markdown is not stored.
- Selected text is one-shot composer state. Once a prompt is sent, the quote belongs only to that user message through `conversationMessages.selectionText`.
- Dashboard Labels are the `group` and `groupTone` fields on each paper record; they do not belong to a conversation thread or a separate join store.
- Comparative Reading sessions persist only paper `documentKeys` and dialog messages. They do not duplicate final Markdown, retrieved chunks, or context packs; those are rebuilt from `documents` when a comparative question is asked.
- Saved Q&A is stored as `isSaved` on assistant messages. The Saved page is a derived view over the same conversation records, not a separate notes store.
- Deleting a Q&A asks for browser confirmation. If a thread becomes empty after deletion, the empty thread cleanup path removes it.
- Dashboard and side-panel paper stars share `papers.isStarred`; comparison stars live on `comparisonSessions.isStarred`.

## Current Runtime Behavior

When the active browser tab changes:

```text
active tab URL
  -> documentKey
  -> load cached document Markdown if available
  -> otherwise fetch/parse/store document
  -> load paper.activeThreadId
  -> load conversationMessages for activeThreadId
  -> render the active thread
```

Fast tab switching is guarded by request ids in the side panel and in the conversation controller, so stale async loads should not overwrite the active paper title or active thread.

## Thread Rail UI

The first multi-thread UI pass is implemented in the fixed top title area.

Current UI behavior:

1. Typing `---` in the prompt box shows a lightweight confirmation hint; pressing `Enter` starts a new active thread.
2. The archive/inbox button opens a circular thread wheel near the URL controls.
3. The current thread appears as a black chip; inactive thread chips use light cards.
4. Thread chips are labeled by first message timestamp when available, plus a compact message count.
5. Selecting a chip calls `setActiveStoredChatThread(activeDocument.url, threadId)`.
6. Deleting the current chip removes the thread and its messages, then activates the newest remaining thread if one exists.

Controller modules:

```text
sidepanel.js
  -> composer-controller.js
  -> selection-panel-controller.js
  -> scroll-to-latest-controller.js
  -> conversation-panel-controller.js
       -> conversation-message-renderer.js
       -> thread-wheel-controller.js
  -> comparative-reading-controller.js
```

Conversation controller API:

```js
conversation.createThread()
conversation.selectThread(threadId)
conversation.deleteThread(threadId)
```

Store APIs:

```js
createStoredChatThread(url)
listStoredChatThreads(url)
setActiveStoredChatThread(url, threadId)
deleteStoredChatThread(url, threadId)
```

## TODO: Thread Management Polish

- Add clearer management affordances if deletion becomes too easy to misclick.
- Consider editable thread titles only if timestamp labels become insufficient.
- Keep UI compact; this is utility chrome, not a notes app.

## Selection Reference Plan

Status: planned, not implemented.

Problem: conversation messages currently store the full selected quote in `selectionText`. This is simple and reliable for the MVP, but it can make conversation memory heavy when users quote long passages repeatedly.

Goal: store a compact reference into the cached final Markdown, then resolve the quote dynamically when rendering the conversation or building an AI prompt.

Proposed storage primitive:

```js
{
  version: 1,
  documentKey,
  parserId,
  markdownHash,
  startOffset,
  endOffset,
  startLine,
  startColumn,
  endLine,
  endColumn,
  method: "normalized-exact" | "compact-exact" | "token-overlap",
  score,
  prefix,
  suffix,
  preview
}
```

Field roles:

- `startOffset` and `endOffset`: primary exact span in the cached final Markdown.
- `startLine`, `startColumn`, `endLine`, `endColumn`: human-readable/debuggable position.
- `markdownHash`: verifies that the stored span belongs to the same final Markdown text.
- `prefix` and `suffix`: short surrounding text used to relocate the span if offsets drift after parser or cleanup changes.
- `preview`: short fallback display text, not the full quote.
- `method` and `score`: confidence metadata for UI/debugging and prompt warnings.

Recommended modules:

- `src/pdf/locate-selection-in-markdown.js`
  - Input: `document.markdown`, selected text, optional chunk anchor.
  - Output: `selectionRef`.
  - Matching order:
    1. Normalized exact match.
    2. Compact exact match that ignores whitespace, line breaks, and hyphenation.
    3. Token overlap fuzzy match, preferably constrained to the already detected anchor chunk neighborhood.
- `src/pdf/resolve-selection-ref.js`
  - Input: `document.markdown`, `selectionRef`.
  - Output: recovered quote text plus confidence.
  - Resolution order:
    1. Use offsets if `markdownHash` matches and the span still passes sanity checks.
    2. Relocate with `prefix + preview + suffix`.
    3. Fall back to `preview`.

Runtime integration:

```text
captured PDF selection
  -> buildSelectionContextPack()
  -> find chunk anchor
  -> locate span in document.markdown
  -> store selectionRef + short preview on the user message
  -> resolve selectionRef from currentDocument.markdown for display and prompt construction
```

Storage migration:

1. Keep reading legacy `message.selectionText`.
2. New messages should write `selectionRef` and `selectionPreview`.
3. During an interim phase, optionally keep a capped `selectionText` only for failed location cases.
4. After confidence is good across real PDFs, stop writing full `selectionText` by default.

Important constraints:

- Do not rely only on line/column positions. Parser changes can move line breaks.
- Do not rely only on absolute offsets. Cache-version changes can move text.
- The robust reference is the combination of `markdownHash`, offsets, line/column, and surrounding text.
- Dynamic quote recovery should happen close to the side panel/document context, not inside the low-level chat store. The chat store should persist structured records; the side panel should hydrate them with the active document Markdown.

## TODO: Key Promotion And Aliases

`documentAliases` is reserved but not wired yet.

Needed behavior:

```text
fallback URL key
  -> parse PDF
  -> discover stronger DOI/arXiv/publisher id from URL/metadata/markdown
  -> save alias fallbackKey -> stronger documentKey
  -> migrate or merge paper/document/thread records
```

This should happen before building a serious library UI, otherwise the same paper may fragment across multiple fallback URL keys.

## Open Design Questions

- Should thread titles be user-editable immediately, or inferred from the first user question first?
- What is the minimum confidence threshold for replacing full `selectionText` with `selectionRef` only?
- Should failed or low-confidence references keep a longer fallback preview than successful exact references?

Resolved:

- New threads and new prompt sends do not inherit selected text. Selected text is one-shot composer state and is attached only to the message that sends it.
- Title is not a storage key.
