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

## TODO: New Thread Plus Button

Storage support exists, but UI does not expose multi-thread operations yet.

Needed UI behavior:

1. Add a small plus button in the chat header or near the conversation area.
2. Clicking plus calls `createStoredChatThread(activeDocument.url)`.
3. The new thread becomes `papers.activeThreadId`.
4. The side panel clears the visible conversation and starts appending to the new empty thread.
5. If the user does not click plus, continue using the existing `activeThreadId`.

Needed controller API:

```js
conversation.createNewThread()
conversation.listThreads()
conversation.setActiveThread(threadId)
```

Needed store APIs already present:

```js
createStoredChatThread(url)
listStoredChatThreads(url)
setActiveStoredChatThread(url, threadId)
```

## TODO: Thread Switcher

After plus button works, add a compact thread switcher:

- Show existing threads for the active `documentKey`.
- Use `updatedAt` and first user message as the default label if no custom thread title exists.
- Selecting a thread calls `setActiveStoredChatThread(activeDocument.url, threadId)`.
- The side panel reloads that thread's messages.

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
- Should deleting a thread be supported in V0.1, or deferred?
- Should all messages keep full `selectionText`, or should very long selections be stored separately to keep message records smaller?
