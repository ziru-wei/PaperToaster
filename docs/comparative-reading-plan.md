# Comparative Reading Plan

Last updated: 2026-09-07

Status: implemented as a side-panel workflow launched from Reading Dashboard. This file keeps the architecture and resolved design decisions; unfinished follow-ups are consolidated in `docs/unfinished-feature-plan.md`.

## Goal

Add Comparative Reading as a side panel workflow that is launched and managed from the Reading Dashboard. The dashboard should show both individual paper records and persistent comparative-reading records. When the dashboard is open and no single paper card is selected, the side panel becomes the Comparative Reading workspace.

This is for cross-paper questions such as:

- Compare these papers' contributions.
- Contrast their methods.
- What design assumptions do they share?
- Which paper gives stronger evidence for the same claim?
- How does paper A extend or contradict paper B?

The feature reuses local paper records, final Markdown, existing RAG preparation, and the existing local agent provider. It does not create a second AI stack.

## Product Shape

The Reading Dashboard remains primarily a gallery. It should include two record types:

```text
paper record
  one normal paper card
  click card -> side panel shows that paper's single-paper conversation

comparison record
  compact right-side dashboard list item
  click record -> side panel shows that comparative session
  record shows the inferred title/question, time, and star state
```

Dashboard records should expose a first-class `type`:

```text
single-paper
comparative-reading
```

The dashboard sort menu should include type-based sorting/grouping so single-paper records and comparative-reading records can be separated or clustered predictably.

User flow:

1. User opens Reading Dashboard.
2. If no specific paper/comparison record is selected, the side panel opens in Comparative Reading mode.
3. User adds multiple dashboard papers to the active comparison from the dashboard card affordance.
4. The side panel shows selected papers as a compact vertical list near the lower composer area and uses the same chat layout as normal paper reading.
5. User asks a comparative question in the side panel composer.
6. Extension builds a multi-paper context pack from local final Markdown and paper metadata.
7. Existing AI provider answers through the same local agent bridge.
8. The comparison session and dialog persist as a dashboard comparison record.

The previous bottom-dashboard tray design is deprecated. Comparative Reading belongs in the side panel when the left/main tab is the Reading Dashboard.

Once a comparative session is created, its paper set is fixed. A saved comparison record represents a specific comparison among a specific group of papers. Adding papers from the dashboard while a saved comparison is open should start a new draft comparison, not mutate the saved record.

## Scope

Included in revised MVP:

- Side-panel Comparative Reading mode.
- Dashboard comparison records displayed alongside or near paper records.
- Click a comparison record to open that persisted comparative session in the side panel.
- Add dashboard paper cards to the active comparison from a lightweight card affordance.
- Remove a paper from draft comparison chips before the first question is sent.
- Saved comparison paper sets are immutable after the first question is sent.
- Build one multi-paper RAG context pack.
- Ask existing configured AI provider.
- Render Markdown answer.
- Show obvious busy/pending feedback while the local agent runs.
- Persist every Comparative Reading session and its dialog.

Not included in MVP:

- PDF fetching or parsing from the dashboard.
- Full-text dashboard search.
- Notes system.
- Citation export.
- Graph visualization.
- Dragging papers to a bottom dashboard tray.

Important boundary: Comparative Reading can only use papers that already have local final Markdown. A dashboard card with no cached document should be disabled for comparison or show a quiet "context unavailable" state.

## Architecture

Recommended new modules:

```text
src/sidepanel/comparative-reading-controller.js
src/sidepanel/comparative-reading-renderer.js
src/compare/build-comparison-context.js
src/compare/comparison-retrieve.js
src/compare/comparison-prompt.js
src/compare/comparison-answer.js
```

Relationship to existing modules:

```text
dashboard.js
  -> dashboard-renderer.js
  -> sends dashboard context messages

sidepanel.js
  -> sidepanel-document-context.js
       -> active-pdf-tab mode
       -> library-paper mode
       -> comparative-reading mode
  -> comparative-reading-controller.js
       -> comparison-store.js
       -> library-store.js / document-store.js
       -> build-comparison-context.js
       -> comparison-answer.js
            -> local-agent-client.js
```

Do not import side panel controllers into the dashboard. Dashboard owns gallery/record rendering. Side panel owns chat/composer/AI interaction. Shared logic should live in storage, RAG, AI, or compare modules.

Side panel modes:

```text
active-pdf-tab
  active browser tab is a PDF or publisher PDF viewer
  show single-paper reading/chat

library-paper
  active browser tab is Reading Dashboard
  dashboard selected one paper card
  show that paper's stored single-paper reading/chat

comparative-reading
  active browser tab is Reading Dashboard
  no specific paper is selected, or a comparison record is selected
  show comparative session/chat
```

Background/session state should distinguish:

```js
{
  source: "dashboard",
  mode: "library-paper",
  documentKey
}

{
  source: "dashboard",
  mode: "comparative-reading",
  comparisonId
}
```

If dashboard is open and no selected document/comparison exists, side panel should show an empty/new Comparative Reading session.

## Storage Usage

Use existing durable stores:

```text
papers
documents
conversationThreads
conversationMessages
```

Comparative Reading must be durable. Each comparison session stores the selected paper keys and dialog, but it must not store duplicated RAG context. The context is rebuilt from each paper's cached final Markdown whenever the user asks a new comparative question or reopens the session.

The comparison stores introduced in IndexedDB v4 remain part of the current v5 schema:

```text
comparisonSessions
  comparisonId
  documentKeys
  title
  active
  createdAt
  updatedAt
  firstMessageCreatedAt
  messageCount

comparisonMessages
  messageId
  comparisonId
  sequence
  role
  text
  isSaved
  citedDocumentKeys
  createdAt
```

Indexes:

```text
comparisonSessions.byUpdatedAt
comparisonSessions.byCreatedAt
comparisonMessages.byComparisonId
```

Minimum persisted session shape:

```js
{
  comparisonId,
  documentKeys: ["doi:...", "arxiv:..."],
  title: "optional generated or editable label",
  messageCount,
  createdAt,
  updatedAt
}
```

Minimum persisted message shape:

```js
{
  messageId,
  comparisonId,
  sequence,
  role: "user" | "assistant",
  text,
  isSaved,
  citedDocumentKeys: [],
  createdAt
}
```

Explicitly do not store:

- built comparative context packs
- retrieved chunks
- paper overviews copied into comparison records
- final Markdown duplicated into comparison records

The source of truth remains:

```text
comparisonSessions.documentKeys -> papers/documents -> rebuild context
comparisonMessages -> durable dialog only
```

Recommended storage API:

```text
src/storage/comparison-store.js
```

Primary methods:

```js
createComparisonSession(documentKeys)
listComparisonSessions()
getComparisonSession(comparisonId)
appendComparisonMessage(comparisonId, message)
saveComparisonMessages(comparisonId, messages)
```

The side panel can keep an in-memory draft comparison before the first question is sent, but once the first user question is submitted, a durable `comparisonSession` must exist.

## Multi-Paper Context Pack

Add a separate context pack shape instead of overloading the current single-paper `selectionContextPack`.

```js
{
  version: 1,
  mode: "comparative-reading",
  question,
  papers: [
    {
      documentKey,
      title,
      canonicalUrl,
      metadata,
      overview,
      selectedEvidence: [
        {
          sectionTitle,
          text,
          score,
          source: "overview" | "retrieved" | "section-sample"
        }
      ]
    }
  ],
  comparisonPlan: {
    intent,
    evidenceBudgetPerPaper,
    totalEvidenceBudget,
    warnings
  }
}
```

Why separate:

- Single-paper selection questions emphasize local quote context.
- Comparative questions need balanced evidence across papers.
- Prompt budgeting and citation labels are different.
- It prevents the current side panel flow from becoming overloaded.

## Retrieval Strategy

The retrieval rule should be balanced by paper, not global top-k.

Bad approach:

```text
merge all chunks from all papers -> top-k
```

This can let one long or keyword-heavy paper dominate the answer.

Recommended MVP:

```text
for each selected paper:
  load newest final Markdown
  build or reuse weak section chunks
  get cached overview if available
  retrieve top N chunks for the comparative question
  include small opening / contribution / method / result samples when detectable
  compress evidence per paper
combine paper packets into one prompt
```

Initial limits:

- Selected papers: at least 2, up to the user-configured limit. The default and minimum limit is 5.
- Retrieved chunks per paper: 2-4.
- Overview per paper: capped to a short paragraph or bullets.
- Total context: capped before sending to AI.

If the user selects too many papers, the UI should either warn or automatically switch to a stricter evidence budget per paper.

## Comparative Intent Router

Add a small router separate from the single-paper router:

```text
contribution_compare
method_compare
evidence_compare
limitation_compare
theory_compare
general_synthesis
```

The router can remain rule-based and should be visible only if it is useful. It does not need the same two-step route confirmation UI as the side panel initially, unless routing mistakes become common.

Example mapping:

- "contribution", "novel", "main point", "advance" -> `contribution_compare`
- "method", "study", "pipeline", "model", "experiment" -> `method_compare`
- "result", "finding", "evidence", "evaluation" -> `evidence_compare`
- "limitation", "threat", "future work" -> `limitation_compare`

## Prompt Shape

The comparison prompt should force paper-by-paper grounding before synthesis.

Recommended structure:

```text
System prompt
Paper reading policy
Task: comparative reading
Question

Selected papers:
[P1] Title, URL
[P2] Title, URL

Evidence packets:
[P1]
Overview
Relevant excerpts

[P2]
Overview
Relevant excerpts

Answer requirements:
- Compare across papers, not one paper at a time only.
- Use paper labels [P1], [P2] when attributing claims.
- Separate direct evidence from inference.
- Say when the provided context is insufficient.
```

This should use the configured system prompt but add a comparison-specific policy around attribution.

## Agent Integration

The feature should use the same provider settings:

- Debug mode.
- Local Agent endpoint/token/model.
- Codex CLI or Antigravity CLI profile through the local bridge.
- Markdown response rendering.

Add a provider wrapper similar to current selection answer flow, but do not reuse `answerSelectionQuestion()` directly if doing so would make it semantically confusing.

Recommended:

```js
answerComparisonQuestion({
  aiSettings,
  comparisonContextPack,
  signal
})
```

This can share low-level clients:

```text
local-agent-client.js
```

## Dashboard UI Details

Dashboard card behavior:

- Clicking a paper card selects that single paper in the side panel.
- Paper titles are plain text inside the card; they should not be embedded browser links because that makes normal card selection too easy to mis-trigger.
- Each paper card gets a lightweight add-to-comparison affordance separate from the main click target.
- Cards already in the active comparison show a subtle selected-for-comparison state.
- When a comparative session or draft is active, its related paper cards are highlighted in the dashboard.
- Dragging to a lower dashboard tray is removed.

Comparison record behavior:

- A comparison record is now a compact right-side dashboard list item.
- It shows the inferred comparison title or first question, timestamp, and star.
- It does not show paper titles, paper count, or a message-density ring in the card body.
- Clicking the record opens that comparative session in the side panel.
- The active comparison record uses a yellow active state. Related single-paper records use secondary grey activation.
- Its paper set is immutable after creation. The side panel should not show remove controls for papers inside a saved comparison record.

Possible dashboard layout:

```text
top controls
  search
  manage
  sort, including type

main grid
  paper cards
  compact comparison record list
```

Alternative later: split records into two sections, but first pass can keep one unified dashboard if visual hierarchy is clear.

## Side Panel UI Details

Comparative Reading mode should reuse the normal side panel layout:

```text
fixed header
  small dashboard/status row
  read-only title: Comparative Reading or inferred comparison title

scrolling middle
  comparative conversation messages

fixed bottom composer
  vertical selected paper list
  prompt input
```

The selected papers replace the single-paper URL/title context. They should be visible but compact, and they belong near the lower composer area rather than as a horizontal strip under the title. The chat should feel like the normal side panel conversation, not a separate dashboard widget.

Comparative Reading history belongs in Reading Dashboard as comparison records. The side panel should not show a separate history list; it only renders the currently selected comparison record or the active draft.

The comparative title is display-only. It may be inferred from the first question, but it should not look editable in the side panel.

The context indicator is three-state:

- `loading`: comparison session, paper summaries, or draft paper keys are being hydrated.
- `ready`: at least two selected papers have cached Markdown and comparative RAG can be built.
- `warning`: fewer than two usable papers are selected, or context hydration failed. In draft mode, the user can manually add papers from dashboard paper cards.

Responsive behavior:

- Wide dashboard: selected papers on the left, question/answer on the right.
- Narrow dashboard: selected papers on top, composer/answer below.

Visual direction:

- Same light, quiet style as dashboard cards and side panel.
- No dark mode.
- Compact controls.
- Avoid large chat bubbles; comparative answers are closer to a reading memo.

## Revised Migration Implementation Order

1. Keep existing storage and compare modules.
2. Remove dashboard bottom tray HTML/CSS/controller wiring.
3. Add comparison-session summaries to dashboard storage/query layer.
4. Render comparison records in Reading Dashboard as compact list records.
5. Add dashboard sort support for mixed record types:
   - `type`: single-paper records together and comparative-reading records together
   - preserve existing sorts for latest ask, early ask, message count, and starred where applicable
   - comparison records should sort by `updatedAt` / `firstMessageCreatedAt` / `messageCount`
   - starred sort applies to both paper records and comparison records through `isStarred`
6. Add dashboard messages:
   - `OPEN_LIBRARY_PAPER_CONTEXT(documentKey)`
   - `OPEN_COMPARISON_CONTEXT(comparisonId)`
   - `CLEAR_DASHBOARD_CONTEXT`
   - `ADD_PAPER_TO_ACTIVE_COMPARISON(documentKey)`
7. Add side panel `comparative-reading` mode when the active tab is Reading Dashboard and no single paper is selected.
8. Move comparative controller/renderer from dashboard to sidepanel.
9. Reuse sidepanel chat layout and composer styling for comparative dialog.
10. Wire dashboard paper-card add-to-comparison affordance.
11. Wire dashboard comparison-record click to sidepanel comparative session.
12. Preserve the configurable paper limit, question-inferred title, persisted dialog, Markdown rendering, and existing AI provider path.

## Testing Plan

Manual MVP tests:

- Open Reading Dashboard with no selected card; side panel shows Comparative Reading mode.
- Click a paper card; side panel switches to that single paper conversation.
- Click empty dashboard grid area; side panel returns to an empty Comparative Reading workspace.
- Add two papers to comparison from dashboard card affordances.
- Remove one paper from side-panel comparison chips before the first question is sent.
- Try asking with zero or one paper and confirm validation.
- Ask with debug mode and confirm no provider request is made.
- Ask with each local CLI profile and confirm the answer references multiple paper labels.
- Try adding a paper with no Markdown, if such a record exists, and confirm unavailable state.
- Reload dashboard and confirm saved comparison sessions and dialog rehydrate from IndexedDB.
- Confirm the dashboard shows comparison records as compact right-side records.
- Click a comparison record and confirm the side panel opens that comparative session.
- Confirm stored comparison records contain paper keys and dialog, not duplicated Markdown/context chunks.

Code checks:

- `node --check` for new JS modules.
- Pure function fixtures for `buildComparisonContextPack()`.
- Pure function fixtures for per-paper retrieval balance.

## Implementation Status

Implemented:

- Added IndexedDB v4 stores for `comparisonSessions` and `comparisonMessages`.
- Added `src/storage/comparison-store.js`.
- Added pure comparison modules under `src/compare/`.
- Added session title inference from the first user question.
- Added comparative debug-mode and real provider ask path.
- Added Markdown rendering for comparative assistant answers.
- Added backup/archive/import support for comparison sessions whose full paper set is included in the archive.
- Added dashboard comparison records rendered as compact list records.
- Click comparison record -> side panel comparative session.
- Paper card add-to-compare -> active side panel comparative session.
- Reading Dashboard with no selected record -> empty side-panel Comparative Reading workspace.
- Click empty dashboard grid area -> clear selected record and return side panel to Comparative Reading.
- Removed the deprecated lower dashboard tray and drag-to-tray flow.
- Comparison records support Manage-mode selection, Backup, Archive, Delete, Import, and star/unstar.
- Comparison records are stored by paper keys plus dialog only; they do not duplicate final Markdown or retrieved context.
- Saved comparison paper lists are vertical in the lower side-panel composer area and include per-paper open-URL buttons.
- Comparative context readiness uses loading/ready/warning states.
- Related paper cards are highlighted when a comparison is active; related comparisons are highlighted when a paper is active.
- Comparative chat shares Markdown rendering and scroll-to-latest behavior with single-paper chat.
- Comparative assistant messages support copy, heart, and delete controls through the same message rendering conventions.

## Resolved And Deferred Questions

Resolved:

- Maximum comparison size is user-configurable in extension Options; its default and minimum value is 5 papers.
- First version infers the comparison title from the first user question.
- Comparative answers should not be forced into a table/prose format. The model can choose the shape, and the dashboard renders Markdown.
- Comparison records have their own Manage-mode delete/archive/backup behavior.
- Comparison records support starring.

Deferred:

- Comparative route confirmation UI is not implemented. Add it only if routing mistakes become common.
- Streaming response display is not implemented.
