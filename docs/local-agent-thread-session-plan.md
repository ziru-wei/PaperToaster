# Local Agent UI-thread session continuity — implementation plan

Source conversation: [code advice from planning agent.md](code%20advice%20from%20planning%20agent.md). This is the reviewed implementation plan; the source conversation remains unchanged. This document plans code changes only.

## Contract and product choices

- One single-paper UI `threadId` or comparative UI `comparisonId` maps to one resumable Codex CLI thread while its session record is valid. Different UI threads never share a Codex thread.
- Persist the mapping across local-bridge restarts with **no time limit**. Do not expire, reset, or delete a valid session merely because it has been idle. A session ends only through the explicit deletion, paper/skill change, or failed-turn paths below.
- Every real `/ask` requires `conversationKey`. Bump its wire version from `2` to `3`; no v2 fallback or keyless stateless `/ask`. `/connection-test` remains independent and ephemeral; debug answers still bypass the bridge.
- Only Codex is usable in the UI and bridge. Reject `antigravity` on server requests, and remove its model choices from Options and the side-panel model selector. The copyable bridge-start command is profile-neutral and stays.
- Keep the same Codex thread when model/reasoning effort changes, passing the current `-m` and `-c model_reasoning_effort=...` on each call. Verify actual behavior with this installed CLI before treating the switch as supported.
- Editing or deleting an earlier Q&A unit does not rewrite or invalidate the Codex rollout. Deleting the **entire** UI thread deletes its corresponding bridge mapping and Codex rollout. The same applies when a comparison is deleted.
- A changed `systemPrompt` in Options is sent as a new, explicit instruction on the next resumed turn; it does not start another Codex thread. New text must say it supersedes prior additional answer instructions. The earlier instruction still exists in the rollout.
- If a paper's `documentRef` changes after re-parsing, or a surviving comparison's paper set changes after permanent library deletion, retain the UI chat record but retire its old Codex session. Its next ask initializes a new Codex session using the current paper files. Do not send a 409 for these supported paths.

## Current code points to change

| Concern | Current code | Required change |
| --- | --- | --- |
| Fresh CLI call | `scripts/local-agent-server.js`: `runCodex()` / `spawnCodex()` use `codex exec --ephemeral` for every answer | First tracked answer uses non-ephemeral `codex exec --json`; later answers use `codex exec ... resume <agentSessionId> ...` |
| `/ask` schema | `validateAskBody()` accepts v2 and has no UI thread identity | Require v3 `conversationKey`, validate it and the mode/profile |
| Single-paper identity | `src/sidepanel/ask-flow-controller.js`: `persistCurrentAndGetSnapshot()` returns `threadId` | Forward `askSnapshot.threadId` through `answerSelectionQuestion()` and `generateLocalAgentText()` |
| Comparison identity | `src/sidepanel/comparative-reading-controller.js`: `ensureSession()` returns `comparisonId` | Forward `session.comparisonId` through `answerComparisonQuestion()` and `generateLocalAgentText()` |
| Managed files | `materializeRequestDocuments()` creates new request-scoped paths for each ask | Include **current** paths on every resumed prompt; never reuse paths from earlier turns |
| Paper changes | `sidepanel-document-context.js` can re-parse; `library-archive-store.js` can prune a retained comparison's `documentKeys` | Detect ordered paper fingerprint changes and retire the old Agent session |
| Deletion | `conversation-panel-controller.js` deletes/prunes single-paper threads; `library-archive-store.js` permanently removes paper/comparison records | Send authenticated session deletion after DB deletion, including cascaded/dependent IDs |
| Providers | `ai-settings-store.js`, `options.js`, `local-agent-client.js`, server model discovery still accept Antigravity | Normalize stored selections to Codex and expose only Codex |
| Mock | `scripts/local-agent-mock-server.js` accepts v2 | Require v3/key and model the first/resumed/retired session cases |

## 1. CLI session runner and prompt assembly

1. In `scripts/local-agent-server.js`, split command construction into a testable `buildCodexArgs({ agentSessionId, outputFile, model, reasoningEffort, ephemeral })`. Use these branches:

   - `/connection-test`: `codex exec --ephemeral ... -`; do not record its `thread_id`.
   - First real `/ask`: `codex exec --json --skip-git-repo-check --sandbox read-only --color never --output-last-message <file> [model/effort flags] -`. **Do not** pass `--ephemeral`.
   - Resumed `/ask`: `codex exec --json --skip-git-repo-check --sandbox read-only --color never resume <agentSessionId> --output-last-message <file> [model/effort flags] -`.

   The installed `codex-cli 0.149.1` accepts `--sandbox` and `--color` on the parent `exec`, not after `resume`; verify the generated argv with `codex exec resume --help` before integration. Preserve the existing read-only sandbox, timeout, abort, and final-answer file behavior.

2. Add a bounded JSONL parser for `--json` stdout in `spawnCodex()`. Extract exactly one valid `thread.started.thread_id` and optionally `turn.completed.usage.cached_input_tokens`; keep the final response from `--output-last-message`. Reject malformed/missing session IDs. On resume, require emitted `thread_id === agentSessionId`; treat a changed ID as a failed resume, never silently bind it to this UI thread. Limit buffered stdout/stderr and report errors without logging the full paper/question text.

3. Keep `buildFileReadingPrompt()` for a first turn: paper-reading skill, current additional answer instructions, mode, ordered paper titles and current request-scoped file paths, selection, question. Add `buildResumePrompt()` with the current question, optional selection, mode, ordered titles and **new** file paths, plus a short instruction to read those files for citations. Do not resend full skill or prior UI messages on an unchanged session. If `systemPrompt` hash changed, append the full updated prompt with an explicit supersession marker on this turn; advance its stored hash only after a successful answer. If the paper-reading skill text/hash changes, initialize a new Codex session so its new instructions are applied from turn one.

4. Continue materializing paper Markdown and citation sidecars before each CLI invocation and deleting only that request directory in `finally`. Session mapping files and Codex rollout files are separate from these request-scoped paper files.

## 2. Persistent mapping, serialization, and lifecycle

1. Add `scripts/local-agent-session-store.js` under a stable directory, defaulting to `path.join(os.homedir(), ".paper-toaster", "sessions")` with an optional `PAPER_CHAT_LOCAL_AGENT_SESSION_DIR` override. Do **not** put indefinite session records under `AGENT_WORKDIR`: its current default is `os.tmpdir()`, which the OS may clear. Store a versioned JSON record keyed by a SHA-256 filename of `mode + "\0" + conversationKey`; keep the original mode/key inside the record for collision/mismatch checks. Fields: `version`, `mode`, `conversationKey`, `agentSessionId`, `paperFingerprint`, `skillHash`, `systemPromptHash`, `createdAt`, `lastUsedAt`. `lastUsedAt` is diagnostic only, not an expiry input. Keep model/effort as optional diagnostics, **not** invalidation inputs. Create the directory with mode `0700`, files with `0600`, use atomic temp-write + rename, reject symlinks/invalid records, and validate the UUID-shaped Agent ID before passing it to the CLI.

2. Calculate `paperFingerprint` from the **ordered** `[{ paperId, documentRef }]` array and mode; do not sort comparison papers. `title` and citation display metadata do not define paper identity. Load and validate the stored record after acquiring the conversation lock; never compare `lastUsedAt` to a TTL. Update `lastUsedAt` only after a successful, non-aborted CLI answer and successful record write. On bridge startup, validate the session directory and remove only orphan atomic-write temp files matching a strict filename pattern; never age-delete finalized records or Codex rollouts.

3. Add `withConversationLock(mode, conversationKey, callback)` around session read → paper materialization → CLI call → record update / retirement. Re-check `AbortSignal` after waiting for the lock. Release and remove the lock-map entry in `finally`; a rejected prior call must not block later calls. Do not serialize unrelated UI threads.

4. On paper fingerprint or skill-hash mismatch, delete/retire the old mapping and Codex rollout, then run the same `/ask` as a first tracked turn under the lock. For a comparison reduced by permanent deletion, first refresh its selected papers from `getComparisonSession().documentKeys`/`hydratePapers()` so the request does not reuse stale `state.selectedPapers`. If fewer than two remain, the existing comparison deletion path applies instead.

5. If a CLI process has started and then times out, is aborted, exits unsuccessfully, has no final answer, or returns a different `thread_id`, invalidate its mapping: the hidden rollout may contain a partial or unshown turn. Best-effort delete a newly created rollout if its ID was already captured. An abort **before** CLI spawn leaves the previous mapping intact. Do not silently answer via a fresh stateless request. The next explicit user ask can initialize a new tracked session. If the HTTP connection closes after the CLI succeeds but before the response is delivered, do not commit a mapping that would make the next visible question follow an invisible answer; handle this under the same lock.

6. Unlimited **app session reuse** is not unlimited provider prompt-cache retention or a cache-hit guarantee. Codex can retain a conversation while `cached_input_tokens` is zero; model changes, provider cache eviction, compaction, or a changed prompt prefix can affect caching. Expose only a compact diagnostic of session created/resumed and cache-token count, never paper text or full prompts.

## 3. Browser and bridge API wiring

1. In `validateAskBody()`, require `version: 3`, `source: "paper-toaster"`, a non-empty bounded `conversationKey` matching the existing UI ID families (`thread-...` for `single-paper`, `comparison-...` for `comparative-reading`), and `localAgentProfile: "codex"` (or the existing default normalized to Codex). Update the strict allowed-field set. A missing/malformed key gets HTTP 400; no optional-key compatibility path. Keep `/connection-test` outside this validator and ephemeral.

2. Add `conversationKey` to `src/ai/local-agent-client.js::generateLocalAgentText()` and its v3 request body. Thread it through `src/ai/selection-answer.js::answerSelectionQuestion()` and `src/compare/comparison-answer.js::answerComparisonQuestion()`. Supply `askSnapshot.threadId` after `persistCurrentAndGetSnapshot()` and `session.comparisonId` after `ensureSession()`, respectively. Reject an empty ID before network I/O. Do not send prior messages or Markdown in `/ask`; continue using `ensureAgentDocument()` and document refs.

3. Change the server's `/ask` branch to normalize/validate Codex-only profile, acquire the per-key lock, load/validate/match the record, materialize papers, choose first/resume prompt and argv, execute, then commit session metadata before returning the answer. Return a bounded error if storage or session validation fails rather than downgrading to stateless. Keep the existing response's `text`/`model` shape. Add a non-sensitive `sessionState` field only if the UI/debug surface needs it.

4. For `systemPrompt` changes, compare the normalized value's SHA-256 to the stored `systemPromptHash`. Include the new text once in the next resume prompt, with “this replaces previous additional answer instructions” semantics. No reset. A failed turn leaves the old hash, subject to the failed-turn invalidation above.

5. In `src/storage/ai-settings-store.js`, normalize legacy Antigravity profile and enabled-model selections to Codex-only values; if the saved profile was Antigravity, clear its `model`/`reasoningEffort` instead of passing an Antigravity model ID to Codex. Clear incompatible `CURRENT_AI_MODEL_KEY` selections as well. In `src/ai/local-agent-client.js::listLocalAgentModels()`, filter to Codex. In `src/options/options.js::renderChatModels()` and the side-panel model menu, render Codex only. In `scripts/local-agent-server.js`, remove Antigravity from `/models` discovery and reject it from `/ask` and `/connection-test`; do not call `agy models` as part of a successful Codex model listing. Keep the generic copyable `node scripts/local-agent-server.js` command unchanged.

## 4. Deletion and paper-set change paths

1. Add authenticated `DELETE /sessions` with a narrow JSON body `{ version: 1, mode, conversationKey, requestedAt }`; validate the mode/key/timestamp and remove only the exact matching record whose `createdAt <= requestedAt`. Under that key's lock, call the installed CLI's `codex delete --force <agentSessionId>` for the associated rollout, then remove the mapping. Verify this CLI command works for an `exec`-created thread during implementation. Never delete `CODEX_HOME` or a broad directory directly. Make deletion idempotent when the record is already absent.

2. Add `deleteLocalAgentSession()` in a small browser client module using the configured endpoint/token. After `deleteStoredChatThread()` succeeds in both `conversation-panel-controller.js::deleteThread()` and `deleteCurrentThreadAfterLastMessage()`, send its original `threadId` to the deletion endpoint. Do not call this for deleting/editing one historical Q&A unit unless that deletion removes the whole thread.

3. In `library-archive-store.js::deleteLibraryRecords()`, collect affected `threadId` and `comparisonId` values **before** the IndexedDB delete transaction: directly selected comparisons, paper-linked single threads, comparisons auto-deleted because fewer than two papers remain, and retained comparisons whose `documentKeys` will shrink. After the transaction commits, delete/retire their Agent sessions. For retained comparisons, preserve UI records/messages but refresh the controller's selected-paper state before the next ask. Do not remove a shared managed document still referenced by another paper.

4. If the bridge is offline during a whole-thread/permanent-library deletion, keep a small deduplicated pending-deletion queue in extension storage (`mode`, `conversationKey`, `requestedAt`) and retry after a successful authenticated bridge call; report cleanup failure rather than claiming immediate rollout deletion. Because there is no age-based cleanup, retain this queue until acknowledged. Apply a queued delete only to a mapping created no later than `requestedAt`, so a subsequently reused UI ID cannot lose its new Agent session.

5. Extend `chat-store.js::pruneActivePaperConversationHistory()` to return IDs for both removed empty threads and retained threads whose unanswered tail question was removed. In `conversation-panel-controller.js`'s caller, retire their Agent sessions after the DB transaction: an interrupted or unsaved Agent turn could otherwise remain hidden in the rollout. Do not delete a session for a simple side-panel close, new active tab, switching between intact threads, editing a prior message, or changing model/effort.

## 5. Mock, tests, and manual checks

1. Update `scripts/local-agent-mock-server.js` to require v3 `conversationKey`, reject Antigravity, track `mode + conversationKey`, and report deterministic `created`/`resumed` behavior. Add mock `DELETE /sessions` and paper-fingerprint invalidation; retain the existing managed-document and citation-map assertions.
2. Add small Node tests for: first call omits `--ephemeral`; resume argv keeps parent `exec` flags before `resume`; `thread.started` parsing and ID mismatch; missing/invalid key; per-key serialized calls and lock cleanup after rejection; disk reload across simulated bridge restart; successful resume after an artificially old `lastUsedAt`; ordered paper fingerprint; new `systemPrompt` sent once; paper-set change; abort/timeout invalidation; exact-record deletion and queued-deletion retry. Use a fake CLI process/JSONL fixture for automated tests; do not require paid Codex calls.
3. Run `node --check` on touched JS, the focused Node tests, and `git diff --check`. Manually perform one real two-turn single-paper and one comparative session check: confirm second call emits the same `thread_id`, uses current request-scoped paper paths, and returns citations. Also verify bridge restart, model and effort switch, document re-parse, comparison shrink after paper deletion, entire-thread deletion, and unanswered-question pruning. Record `cached_input_tokens` as an observation, not an acceptance threshold.

## CLI facts and scope notes

- OpenAI's [non-interactive Codex documentation](https://developers.openai.com/zh-Hans/docs/non-interactive-mode) documents `--ephemeral`, JSONL `thread.started.thread_id`, `turn.completed.usage.cached_input_tokens`, and `codex exec resume`. The first tracked turn must be non-ephemeral.
- The [Codex developer commands](https://developers.openai.com/codex/developer-commands?surface=cli) and the installed `codex-cli 0.149.1` help determine accepted flag placement; the installed `resume` subcommand does **not** list `--sandbox` or `--color` as local flags.
- OpenAI's [prompt-caching guide](https://developers.openai.com/api/docs/guides/prompt-caching) describes cache hits as prefix/availability dependent. Session persistence and prompt-cache retention are separate.
