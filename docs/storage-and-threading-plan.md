# Storage And Threading Plan

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

Version: `2`

Stores:

- `papers`
  - Key: `documentKey`
  - Holds the paper-level record.
  - Important fields: `documentKey`, `canonicalUrl`, `title`, `titleSource`, `metadata`, `activeThreadId`, `createdAt`, `updatedAt`.
- `documents`
  - Key: parser/cache-specific `key`.
  - Holds cleaned Markdown and parse metadata.
  - Important fields: `documentKey`, `parserId`, `cacheVersion`, `markdown`, `pageCount`, `byteLength`, `contentType`, `metadata`.
- `conversationThreads`
  - Key: `threadId`.
  - Holds per-document conversation thread metadata.
  - Important fields: `threadId`, `documentKey`, `title`, `currentThreadSelectionText`, `messageCount`, `createdAt`, `updatedAt`.
- `conversationMessages`
  - Key: `messageId`.
  - Holds individual messages.
  - Important fields: `messageId`, `threadId`, `documentKey`, `sequence`, `role`, `text`, `selectionText`, `createdAt`.
- `documentAliases`
  - Key: `aliasKey`.
  - Reserved for future key promotion.
  - Intended shape: `aliasKey -> documentKey`.

Settings and prompt presets still use `chrome.storage.local`.

## Implemented Takeaways

- Markdown cache and conversation history now share the same `documentKey`.
- Conversation memory no longer lives as one large `chrome.storage.local` object.
- Each document can have multiple conversation threads at the storage layer.
- Each document has an `activeThreadId`.
- If the user does not create a new thread, messages continue appending to the current active thread.
- The side panel still displays only the active thread.
- Existing legacy conversation data in `chrome.storage.local.paperChatThreadsV1` is read lazily and written into IndexedDB when that paper is opened.
- Chunks are not stored. They are rebuilt from cleaned Markdown when cached content is hydrated.
- Raw Markdown is not stored.

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

1. The left `+` button creates a new active thread for the current paper.
2. Existing thread chips scroll horizontally to the right, with newer threads shown first.
3. Thread chips are labeled by the first message timestamp when available.
4. Selecting a chip calls `setActiveStoredChatThread(activeDocument.url, threadId)`.
5. Deleting a chip removes the thread and its messages, then activates the newest remaining thread if one exists.

Controller API:

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

- Should a new thread inherit the latest selected text, or start with no selected text?
- Should thread titles be user-editable immediately, or inferred from the first user question first?
- Should all messages keep full `selectionText`, or should very long selections be stored separately to keep message records smaller?
