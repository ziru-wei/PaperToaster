# Side-Panel Notes And Q&A Implementation Plan

Last updated: 2026-09-14

Status: planned; no implementation is included in this document.

## Scope And Terminology

- **User note** means the per-paper note rendered at the top of Saved Q&A by `renderSavedQuestionAnswerUnits()`.
- **Direct PDF context** means the active browser tab passes `canLoadDocumentFromTab()` and the rendered document does not have `sidePanelContextMode === "library-paper"` with `sidePanelContextSource === "dashboard"`. This is the code-level interpretation of a PDF opened in the left/main browser area.
- **Dashboard paper context** means a stored paper selected on the Reading Dashboard and hydrated through `renderLibraryPaperContextIfCurrent()`.
- **Chat view** means the single-paper or Comparative Reading conversation rendered through `renderConversationMessages()`.
- **Saved Q&A view** means the per-paper derived view rendered through `renderSavedQuestionAnswerUnits()`.
- **Saved question** means a user message whose associated assistant message has `isSaved === true`.
- **Pinned saved question** means a Saved Q&A unit whose assistant message also has `isPinned === true`.
- The configurable saved-Q&A limit is one global extension setting applied independently to every paper.
- A Comparative Reading answer counts once against every paper in that comparison session's `documentKeys`.
- Lowering the configured limit does not delete existing saved answers. While a paper is at or above the new limit, additional saves are rejected and unsaving remains available.
- The initial saved-Q&A limit will be `20`; normalization accepts any positive integer and falls back to `20` for missing or invalid stored values.

## Existing Implementation Map

| Area | Current implementation | Required change point |
| --- | --- | --- |
| User note UI | `createPaperUserNoteElement()` creates a one-row `<textarea>` in `conversation-message-renderer.js`. | Extract a structured note editor with image insertion and resize handles. |
| User note sizing | `.saved-paper-user-note-input` has `min-height: 20px`, `max-height: 180px`; `resizePaperUserNoteInput()` clamps to computed `max-height`. | Set the minimum to `100px`, remove the maximum and internal vertical scrolling, and let content grow the page. |
| User note persistence | `paper-note-store.js` writes a normalized string to `papers.userNote` with a 50,000-character cap. | Add a versioned note document and a separate binary asset store while retaining a plain-text compatibility field. |
| Saved Q&A control | `syncSavedQuestionAnswerMode()` shows `#savedQaControls`; an active Saved Q&A toggle swaps the bookmark mask for `message-circle-plus.svg`. | Clear Saved Q&A mode when context becomes a direct PDF so the dialogue-bubble glyph cannot appear there. |
| Save toggle | `toggleMessageSaved()` in both conversation controllers flips `isSaved` and persists without a capacity check. | Move save/unsave writes through one capacity-aware storage service. |
| Save-button feedback | `createAssistantActionRow()` invokes `onToggleSaved`; only edit-bar failures currently use `conversation-action-shake`. | Return a typed limit rejection and animate the exact save button horizontally. |
| Options | Parsing and AI settings auto-save; Comparative Reading has an explicitly saved numeric limit. | Add a Saved Q&A numeric setting using a dedicated settings store and auto-save status. |
| Label keyboard flow | `paper-label-control.js` handles Enter locally, but `sidepanel.js` has a document capture listener that runs first and treats the focused `.paper-group-editor` as non-editable. | Mark the label editor as a keyboard scope and make the global capture listener yield to it. |
| Chat collapse | Controllers keep `Set`s of collapsed assistant indexes. New scopes initialize with empty sets, so answers start expanded. | Store an explicit compact/expanded layout state per thread/session and initialize it to compact. |
| Collapsed chat layout | User and assistant messages remain separate siblings; collapsed assistants become zero-height while user bubbles keep the normal vertical layout. | Render Q&A units as wrappers and switch compact mode to a centered, wrapping question cloud. |
| Saved Q&A collapse | Saved units remain in the two-column height-balanced layout when their answers are collapsed. | Use the same question-cloud primitive in the manually collapsed Saved Q&A state, with pinned units in the center group. |

## Target Behavior Contract

### User note

1. An empty note has a `100px` editable content minimum, exactly five times the current `20px` minimum.
2. The note has no CSS or JavaScript maximum height. The Saved Q&A document body owns scrolling after the note grows beyond the viewport.
3. The note accepts plain text, line breaks, and image blocks.
4. Images can be inserted through an image button/file chooser, clipboard paste, or file drop.
5. Accepted image MIME types are PNG, JPEG, WebP, and GIF. Unsupported files produce a non-destructive inline status.
6. Each image renders inside a non-editable figure with a lower-right resize handle and a remove button.
7. Dragging the handle preserves the image's aspect ratio, clamps its displayed width to `15%..100%` of the note content width, and persists `widthRatio` rather than a viewport-specific pixel width.
8. Text edits, image insertion/removal, and completed resize gestures use the existing 300 ms debounced note-save path. `blur` and `pagehide` flush pending note metadata.
9. Object URLs created for stored image blobs are revoked before the note is rerendered or the panel document changes.

### Direct PDF context and the dialogue-bubble icon

1. Dashboard-selected paper context may continue to auto-open Saved Q&A through `shouldAutoOpenSavedQuestionAnswerView()`.
2. When the active tab changes to a recognized PDF, `onDocumentChange` explicitly calls `conversation.setSavedQuestionAnswerViewActive(false)` before synchronizing controls.
3. `syncSavedQuestionAnswerMode()` only applies `.active` to `#savedQaToggle` for dashboard paper context.
4. A direct PDF displays the bookmark glyph for entering Saved Q&A; it never displays the active `message-circle-plus.svg` dialogue-bubble glyph.
5. Opening a paper URL from a dashboard-selected Saved Q&A view transitions the side panel to compact chat for that PDF, including when `setDocumentUrl()` returns early because the canonical URL and document key did not change.

### Saved-Q&A capacity

1. Saving an unsaved single-paper answer checks the combined direct and comparative saved count for the current `documentKey`.
2. Saving a Comparative Reading answer checks every `documentKey` on the active comparison session. The write succeeds only when every affected paper has an available slot.
3. Unsaving skips capacity checks and clears `isPinned` for single-paper answers.
4. A rejected save leaves stored and in-memory message state unchanged.
5. The clicked save button receives a replayable `limit-rejected` class, remains unpressed, and performs a short left-right “head shake.”
6. A visually hidden live status announces `Saved Q&A limit reached (N per paper).`; the button's accessible label returns to `Save response` after the animation.
7. Changing the option takes effect in every open side panel through `chrome.storage.onChanged`.

### Label Enter priority

1. Opening `.paper-group-editor` sets `data-keyboard-scope="paper-label"` on the editor root.
2. The capture-phase document Enter handler returns immediately when either `event.target` or `document.activeElement` is inside that scope.
3. In label browse mode, plain Enter enters label edit mode.
4. In label edit mode, plain Enter confirms the typed label or rename operation.
5. No label-management Enter press closes Saved Q&A, focuses `#selectionQuestion`, prepares a route suggestion, or submits a query.

### Compact question-cloud layout

1. Every newly hydrated single-paper thread and Comparative Reading session starts in compact mode for the current side-panel lifetime.
2. A newly submitted question keeps its pending/just-completed answer expanded. Reopening or switching back to the thread/session restores its default compact state only when that scope has not already received an in-memory layout state.
3. The collapse/expand control switches the whole scope between `compact` and `expanded`; its pressed state reflects the layout mode, not whether an individual compact-mode detail is open.
4. Compact mode renders question bubbles in deterministic flex-wrapped groups. Bubble width classes derive from normalized question length; small index-based CSS rotation values create the word-cloud-like arrangement without random layout changes between renders.
5. Unsaved questions are divided between leading and trailing cloud groups. Saved questions occupy a dedicated centered group.
6. In the Saved Q&A view, the same compact renderer places pinned units in the centered group and distributes unpinned units around it.
7. Clicking a question, or pressing Enter/Space while it is focused, opens that unit's answer. Opening a unit closes the previously open compact-mode unit in the same scope.
8. An open compact unit takes a full row and reveals its answer directly below its question through a grid-row/opacity transition. The answer retains its citations, annotations, action row, selection quote, and keyboard behavior.
9. `prefers-reduced-motion: reduce` disables cloud rotations, answer expansion motion, and save-button shake while preserving state changes and focus movement.
10. Expanded mode preserves the current chronological Q&A presentation.

## Storage And Data Changes

### Saved Q&A setting

Add `src/storage/saved-qa-settings-store.js` with this public surface:

```js
export const SAVED_QA_SETTINGS_KEY = "savedQaSettingsV1";
export const DEFAULT_SAVED_QA_PER_PAPER_LIMIT = 20;
export const MIN_SAVED_QA_PER_PAPER_LIMIT = 1;

export async function getSavedQaSettings();
export async function saveSavedQaSettings(settings);
export function normalizeSavedQaSettings(settings);
export function normalizeSavedQaPerPaperLimit(value);
```

The normalized object is:

```js
{
  perPaperLimit: 20
}
```

### Note document

Move primary note persistence out of the `papers` record. Add these IndexedDB stores in `paper-database.js` and bump `DB_VERSION` from `6` to `7`:

```text
paperNotes
  keyPath: documentKey
  fields: documentKey, version, blocks, plainText, createdAt, updatedAt

paperNoteAssets
  keyPath: assetId
  index: byDocumentKey(documentKey)
  fields: assetId, documentKey, blob, mimeType, naturalWidth, naturalHeight,
          fileName, createdAt, updatedAt
```

Use note document version `2`:

```js
{
  version: 2,
  blocks: [
    { type: "text", text: "Observations..." },
    {
      type: "image",
      assetId: "note-image-...",
      alt: "",
      widthRatio: 0.72
    }
  ]
}
```

`paper-note-store.js` changes:

- `getPaperUserNote(documentKey)` returns `{ document, assets, updatedAt }`.
- `savePaperUserNote(documentKey, document)` normalizes blocks, writes `paperNotes`, updates `papers.userNote` with derived `plainText`, and deletes unreferenced `paperNoteAssets` records for that document.
- `savePaperNoteImage(documentKey, file)` validates the MIME type, reads natural dimensions, stores the `Blob`, and returns the image-block metadata.
- `deletePaperNoteImage(documentKey, assetId)` only deletes an asset belonging to that paper.
- `normalizePaperUserNoteDocument(value)` accepts version-2 documents and legacy strings, clamps `widthRatio`, removes missing/duplicate asset references, merges adjacent text blocks, and retains the existing 50,000-character text limit.
- `createEmptyPaperNote()` returns a version-2 document with one empty text block.
- Existing `papers.userNote` strings migrate lazily when no `paperNotes` record exists. The compatibility `papers.userNote` string remains populated after every structured-note save.

### Capacity-aware saved state

Add `src/storage/saved-qa-store.js` as the only write path for `isSaved` toggles:

```js
export async function setConversationAnswerSaved({
  documentKey,
  threadId,
  sequence,
  saved,
  perPaperLimit
});

export async function setComparisonAnswerSaved({
  comparisonId,
  sequence,
  saved,
  perPaperLimit
});
```

Both functions return:

```js
{
  status: "saved" | "unsaved" | "limit-reached" | "not-found",
  affectedDocumentKeys: [],
  fullDocumentKeys: [],
  perPaperLimit: 20
}
```

Add denormalized index fields to assistant message records:

```text
conversationMessages.savedDocumentKey
  documentKey when isSaved is true; empty string otherwise

comparisonMessages.savedDocumentKeys
  comparison session documentKeys when isSaved is true; [] otherwise
```

Add these indexes during the version-7 upgrade:

```text
conversationMessages.bySavedDocumentKey(savedDocumentKey)
comparisonMessages.bySavedDocumentKey(savedDocumentKeys, multiEntry: true)
comparisonSessions.byDocumentKey(documentKeys, multiEntry: true)
```

The upgrade transaction backfills the denormalized fields for existing saved messages. `writeThreadMessages()` and `rewriteComparisonMessages()` populate them on all later writes.

Each save API performs these operations in one read-write transaction:

1. Resolve and validate the target assistant message by its deterministic `threadId/comparisonId + sequence` message ID.
2. Resolve affected paper keys (`[documentKey]` for a direct answer; the session's `documentKeys` for a comparative answer).
3. Count both message indexes for every affected paper.
4. Return `limit-reached` without writing when any count is `>= perPaperLimit`.
5. Update `isSaved`, the denormalized saved-key field, and `isPinned` when applicable.
6. Update the owning thread/session `updatedAt` metadata.
7. Commit and let the controller reload the normalized thread/session.

### Archive and deletion coverage

Update `library-archive-store.js`:

- Increment `LIBRARY_ARCHIVE_VERSION` to `5` and continue accepting versions `3`, `4`, and `5`.
- Add `paperNotes` and `paperNoteAssets` arrays to `records`.
- Serialize each asset `Blob` as `{ ...metadata, dataBase64 }`; rebuild the `Blob` from `dataBase64` during import.
- Include both note stores in `IMPORT_STORES`, permanent-delete transactions, document-key filtering, import summaries, and existing-data detection.
- Reject asset records whose declared MIME type is unsupported, base64 payload is invalid, or `documentKey/assetId` is missing.
- Keep archive/restore operations non-destructive for note documents and note assets.

## UI And Controller Work

### 1. Build the note editor module

Create `src/sidepanel/paper-note-editor.js` and move note-specific rendering out of `conversation-message-renderer.js`.

Implement:

```js
export function createPaperNoteEditor({
  noteDocument,
  assets,
  onChange,
  onCommit,
  onInsertImage,
  onError
});

export function serializePaperNoteEditor(editor);
export function disposePaperNoteEditor(editor);
```

Editor structure:

```text
section.saved-paper-user-note
  div.saved-paper-user-note-toolbar
    button.saved-paper-user-note-image-button
    input.saved-paper-user-note-image-input[type=file][multiple]
    span.saved-paper-user-note-status[role=status]
  div.saved-paper-user-note-input[contenteditable=true]
    text nodes / line-break nodes
    figure.saved-paper-user-note-image[contenteditable=false]
      img
      button.saved-paper-user-note-image-remove
      span.saved-paper-user-note-image-resize-handle
```

Implementation details:

- Reconstruct editor DOM only from normalized blocks and asset records; do not persist or restore arbitrary HTML.
- Intercept rich HTML paste. Insert clipboard text as text nodes and clipboard image files through `onInsertImage`.
- Handle `dragover/drop` for local image files and prevent the browser from navigating to the dropped file.
- Preserve the last valid caret `Range` before the toolbar opens the file chooser and insert returned image figures at that range.
- Use Pointer Events and `setPointerCapture()` on the lower-right resize handle.
- On `pointermove`, calculate `widthRatio = clamp((startWidth + deltaX) / editorContentWidth, 0.15, 1)` and update the figure preview.
- On `pointerup/pointercancel`, release capture, serialize once, and call `onCommit`.
- Emit `onChange` from text `input`, insertion, and removal; keep resize pointer moves out of the debounced save queue until the gesture finishes.
- Store editor cleanup callbacks in a `WeakMap`, including object-URL revocation and active pointer listeners.

Update `conversation-panel-controller.js`:

- Rename `paperUserNote` to `paperUserNoteDocument` and keep the loaded asset map alongside it.
- Extend `pendingPaperUserNote` to hold the normalized document instead of a string.
- Add an async image insertion callback that calls `savePaperNoteImage(threadDocumentKey, file)`, adds the returned asset to the current asset map, and resolves it back to the editor.
- Continue flushing on document change and `pagehide`.
- Pass note-editor errors through `onDiagnostic` and a local note status rather than replacing the PDF status.

Update `sidepanel.css`:

- Change the editable region to `min-height: 100px`, `max-height: none`, `overflow: visible`, and `resize: none`.
- Add toolbar, image figure, remove button, and lower-right resize-handle states.
- Keep image width at `calc(var(--note-image-width-ratio) * 100%)`, `max-width: 100%`, and `height: auto`.
- Keep the note container in normal document flow even when its content exceeds the viewport; remove any note-local scrollbar rule.

Add `src/assets/icons/image-plus.svg` for the insert action.

### 2. Add the Saved Q&A option

Update `options.html` with a **Saved Q&A** section after Parsing:

```text
Maximum saved Q&A per paper
input#savedQaPerPaperLimit[type=number][min=1][step=1]
span#savedQaStatus.save-indicator[aria-live=polite]
```

Update `options.js`:

- Import the new settings store.
- Add both elements to the required `elements` map.
- Load the normalized value during page initialization.
- Save on `change`, reject non-integer or `< 1` form values, replace the input with the normalized stored value, and reuse the Saving/Auto saved/Error indicator pattern.

Update `options.css` only for any numeric-field width and inline status alignment not covered by `.settings-grid` and `.save-indicator`.

### 3. Enforce the saved-answer limit and animate rejection

Update both controllers' `toggleMessageSaved(messageIndex)` implementations:

- Determine the target message sequence and desired saved state.
- Read the current cached `perPaperLimit` supplied by `sidepanel.js`.
- Call the appropriate capacity-aware store function.
- Reload the active thread/session only for `saved` or `unsaved` results.
- Return the full result object to the renderer.
- Do not call `onMessageSaved` or library activity notifications on `limit-reached`.

Update `sidepanel.js`:

- Load Saved Q&A settings before the first save interaction and pass the current limit into both controllers.
- Handle `SAVED_QA_SETTINGS_KEY` in the existing `chrome.storage.onChanged` listener and call `conversation.setSavedQaPerPaperLimit()` plus `comparativeReading.setSavedQaPerPaperLimit()`.

Update `createAssistantActionRow()`:

- Make the save click handler `async` and temporarily set `aria-busy="true"`.
- On `limit-reached`, remove/re-add `.limit-rejected` with a layout read so consecutive rejected clicks replay the animation.
- Restore `aria-busy`, `aria-label`, and disabled state in `finally`.
- Ignore double clicks while the same save request is pending.

Add `.conversation-save-button.limit-rejected` and `@keyframes savedQaLimitHeadShake` to `sidepanel.css`. Use short alternating `translateX` plus small `rotate` values; disable the animation in the existing reduced-motion media query.

Add one visually hidden `#sidePanelLiveStatus` element in `sidepanel.html`, expose it from `sidepanel-elements.js`, and let the renderer/controller announce the rejected limit through a callback.

### 4. Give label management Enter priority

Update `openPaperLabelEditor()` in `paper-label-control.js` to set `editor.dataset.keyboardScope = "paper-label"`.

In the capture-phase `document.addEventListener("keydown", ...)` block in `sidepanel.js`:

```js
const focusIsInKeyboardScope = focusedElement instanceof Element && Boolean(
  focusedElement.closest("[data-keyboard-scope]")
);
const targetIsInKeyboardScope = event.target instanceof Element && Boolean(
  event.target.closest("[data-keyboard-scope]")
);
```

Return before `preventDefault()` when either flag is true. Keep the label control's local `preventDefault()` and `stopPropagation()` calls for Enter. Apply the same keyboard-scope attribute to future side-panel popovers that own unmodified Enter.

### 5. Separate context mode from the floating icon state

Update `sidepanel.js` to track:

```js
/** @type {"none" | "dashboard-paper" | "direct-pdf"} */
let currentDocumentContextKind = "none";
```

Set the value in `onDocumentChange` from the document's existing `sidePanelContextMode/source` fields. For `direct-pdf`:

1. Await `conversation.setSavedQuestionAnswerViewActive(false)`.
2. Initialize the active thread's compact chat state if needed.
3. Call `syncSavedQuestionAnswerMode()`.

Update `syncSavedQuestionAnswerMode()` so `.saved-qa-toggle.active` requires both `savedModeActive` and `currentDocumentContextKind === "dashboard-paper"`. Keep the collapse control available in direct-PDF chat.

### 6. Render message pairs as Q&A units

Refactor `renderConversationMessages()` around a pure `buildConversationQuestionAnswerUnits(messages)` helper. Each returned unit contains:

```js
{
  userMessage,
  userMessageIndex,
  assistantMessage,
  assistantMessageIndex,
  pending,
  isSaved
}
```

Preserve unmatched user messages, pending assistants, and orphan assistants as chronological fallback units.

Render paired markup:

```text
section.conversation-qa-unit[data-user-message-index][data-assistant-message-index]
  article.conversation-message.user
  article.conversation-message.assistant
```

Keep all existing message rendering helpers for Markdown, citations, selections, annotations, edit bars, save/delete/copy actions, model signatures, and user-message editing. Update selectors in `conversation-navigation.js`, highlight positioning, and collapse controls to traverse the wrapper without changing stored message indexes.

Add renderer options:

```js
{
  layoutMode: "compact" | "expanded",
  expandedCompactAssistantMessageIndex: null,
  onCompactQuestionToggle(userMessageIndex, assistantMessageIndex)
}
```

### 7. Add deterministic cloud grouping

Add pure helpers in `conversation-message-renderer.js`:

```js
buildConversationCloudGroups(units);
getQuestionCloudSize(question);
getQuestionCloudTilt(unitIndex);
```

`buildConversationCloudGroups()` performs these steps:

1. Keep units in chronological order within their category.
2. Place saved units in `center`.
3. Alternate unsaved units between `leading` and `trailing` so the centered saved group remains spatially central.
4. Place pending and currently expanded compact units in a full-width `detail` group immediately after their associated question group.

Use length buckets such as `short <= 36`, `medium <= 90`, and `long > 90` to assign `question-cloud-size-short|medium|long`. Set `--question-cloud-tilt` from a fixed repeating sequence such as `[-1.2deg, 0.6deg, -0.4deg, 1deg, 0deg]`.

Add CSS for:

```text
.conversation-thread.question-cloud-mode
.conversation-question-cloud
.conversation-question-cloud-group.leading|center|trailing
.conversation-qa-unit.question-cloud-item
.conversation-qa-unit.compact-answer-open
```

Compact CSS must:

- use wrapping flex/grid groups with centered alignment and bounded gaps;
- let each closed unit size to its question bubble;
- hide selection cards, user metadata, and assistant content for closed units;
- make `.compact-answer-open` span the available width;
- reveal assistant content in a nested `grid-template-rows: 0fr -> 1fr` container;
- retain the existing black saved-question styling for the centered saved group;
- remove decorative tilt when a unit is focused, editing, pending, or expanded.

### 8. Replace index sets with layout state objects

In `conversation-panel-controller.js`, replace `collapsedAssistantResponsesByThread` with:

```js
Map<scopeKey, {
  layoutMode: "compact" | "expanded",
  expandedAssistantMessageIndex: number | null
}>
```

Initialize missing scope state to `{ layoutMode: "compact", expandedAssistantMessageIndex: null }`. Add:

```js
setConversationLayoutMode(mode);
getConversationLayoutMode();
toggleCompactQuestion(userIndex, assistantIndex);
```

Use the same state shape in `comparative-reading-controller.js`, keyed by comparison session ID or `draft`.

When a pending assistant is replaced by a completed answer in the active scope, set `expandedAssistantMessageIndex` to that assistant index without leaving compact mode. Clear invalid indexes after unit deletion or message-array truncation.

Update `sidepanel.js` collapse-button handling and `syncSavedQuestionAnswerMode()` to call `getConversationLayoutMode()` and `setConversationLayoutMode()` for single and comparative chat. Retain the public `areAllAssistantResponsesCollapsed()`/`setAllAssistantResponsesCollapsed()` names only as temporary compatibility wrappers if another module still imports them.

### 9. Apply cloud collapse to Saved Q&A

Replace DOM-derived `savedCollapsedUnitKeys` as the top-level mode with:

```js
{
  layoutMode: "expanded" | "compact",
  expandedUnitKey: string | null
}
```

The Saved Q&A collapse control sets compact mode and clears `expandedUnitKey`; expand-all returns to the existing full card layout. In compact mode:

- partition pinned units into the centered group;
- alternate unpinned units between leading/trailing groups;
- show only question bubbles for closed units;
- expand one selected unit to full width with its answer, selection, pin control, jump button, citations, and annotations intact;
- keep the user note above the cloud in both modes.

Update `areSavedQuestionAnswerUnitsCollapsed()` and `setSavedQuestionAnswerUnitsCollapsed()` to read/write renderer state through callbacks instead of inferring the complete state only from `.collapsed` classes.

## File-Level Change List

New files:

```text
src/assets/icons/image-plus.svg
src/sidepanel/paper-note-editor.js
src/storage/saved-qa-settings-store.js
src/storage/saved-qa-store.js
```

Modified files:

```text
src/storage/paper-database.js
  DB version, note stores, saved-key indexes, upgrade backfill

src/storage/paper-note-store.js
  structured note normalization, blob asset CRUD, legacy-text migration

src/storage/chat-store.js
  savedDocumentKey maintenance and stable sequence/message identity exposure

src/storage/comparison-store.js
  savedDocumentKeys maintenance and stable sequence/message identity exposure

src/storage/library-archive-store.js
  archive v5 note/asset export, import, filtering, and deletion

src/options/options.html
src/options/options.js
src/options/options.css
  per-paper Saved Q&A limit controls

src/components/paper-label-control.js
  keyboard-scope marker

src/sidepanel/conversation-message-renderer.js
  Q&A wrappers, question-cloud groups, save rejection handling, note-editor integration

src/sidepanel/conversation-panel-controller.js
  structured note state, compact layout state, capacity-aware save calls

src/sidepanel/comparative-reading-controller.js
  compact layout state and multi-paper capacity-aware save calls

src/sidepanel/comparative-reading-renderer.js
  pass compact renderer options through shared conversation rendering

src/sidepanel/conversation-navigation.js
  wrapper-aware pair lookup and scrolling

src/sidepanel/sidepanel.html
src/sidepanel/sidepanel-elements.js
  shared live-status element

src/sidepanel/sidepanel.js
  settings propagation, Enter priority, direct-PDF context reset, collapse-mode routing

src/sidepanel/sidepanel.css
  unlimited note height, image controls, cloud layout, answer reveal, shake/reduced motion
```

Documentation follow-up after implementation:

- Update `README.md` Notes with structured notes, image persistence, the per-paper saved limit, and compact-by-default chat.
- Update `docs/storage-and-threading-plan.md` with `paperNotes`, `paperNoteAssets`, denormalized saved-key indexes, and archive version `5`.
- Update `docs/dashboard-archive-import.md` with note image export/import coverage.
- Update `docs/open-paper-tab-reuse.md` with the direct-PDF transition from dashboard Saved Q&A to compact chat.

## Implementation Order

1. Add Saved Q&A settings normalization and the Options UI.
2. Upgrade IndexedDB to version 7; add/backfill saved-key indexes and note stores.
3. Implement atomic capacity-aware saved-state APIs; route both controllers through them.
4. Add save-button rejection results, live announcement, and head-shake CSS.
5. Add the label keyboard scope and global Enter guard.
6. Implement structured note persistence, archive/delete coverage, and lazy string migration.
7. Build the note editor, image insertion, object-URL cleanup, and pointer resize behavior.
8. Refactor conversation rendering into Q&A wrappers while preserving expanded layout.
9. Add per-thread/session compact state and make it the default.
10. Add normal/comparative question-cloud grouping and one-answer expansion.
11. Add compact Saved Q&A grouping with pinned-center behavior.
12. Add the direct-PDF context transition and dialogue-bubble suppression.
13. Update the affected documentation.

## Lightweight Validation

- Run `node --check` on each modified JavaScript module and `npm run test:pdf` as the existing regression command.
- Reload the unpacked extension, verify an old text-only note migrates, insert/paste/drop an image, resize from the lower-right handle, reload the panel, and confirm text/image order and width persist.
- Export and re-import one paper with a note image; confirm its note, asset, and plain-text fallback survive.
- Set the per-paper limit to `1`; verify one direct save succeeds, the next save shakes without changing state, unsave reopens capacity, and a comparative save is rejected when any source paper is full.
- Open the label editor and exercise Enter in browse, create, and rename modes; confirm the query composer is not focused or submitted.
- Select a dashboard paper, open its PDF in the main area, and confirm the dialogue-bubble glyph disappears and compact chat is shown.
- Verify single-paper, comparative, and manually collapsed Saved Q&A clouds; activate bubbles by click and Enter/Space and confirm one answer opens directly below at a time.
- Enable reduced motion and confirm all state changes still work without rotation, expansion animation, or shake animation.
