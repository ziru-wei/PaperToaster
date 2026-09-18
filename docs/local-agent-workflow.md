# Local Agent Workflow

## Architecture

Paper Toaster cannot spawn a local CLI from a Chrome extension. It synchronizes each paper's Markdown with a token-protected loopback bridge, then sends a structured question referencing that managed document:

```text
Paper Toaster -> HEAD/PUT /documents/:documentRef (upload only when absent)
              -> POST /ask v3 (UI conversationKey, title, documentRef, source-span citation map, current question)
              -> request-scoped annotated Markdown files
              -> Codex CLI reads those files in the UI thread's resumed session
              -> answer text and source-span citations
```

Before a first tracked Codex turn, the bridge loads the repository-owned `paper-reading` skill, including its shared citation reference and mode-specific reference. A resumed turn reuses that Agent history and sends only current paper-file paths, the current question/selection, and any changed additional answer instructions. A skill change retires the old Agent session before the next ask.

The extension assigns source-span citation IDs and sends the current question, optional current selected text, paper titles, document references, and citation maps. Single Paper sends one descriptor (`p1`); Comparative Reading sends ordered descriptors (`p1`, `p2`, …). It does not route questions, retrieve chunks, or send Markdown, URLs, paper metadata, or prior conversation turns in `/ask`. UI chat messages are stored in extension IndexedDB; Codex separately persists its own resumable rollout, including its turns and any paper text it read. The skill directs the Agent to search and read the supplied files using read-only tools.

The extension sends the current Codex model and reasoning effort with every request. Changing either does not by itself start a new Agent session.

The bridge also exposes authenticated `GET /models`, `POST /connection-test`, and `DELETE /sessions`. Only Codex models are listed. The Options page lets the user choose which discovered models appear in the chat `/model` menu and mark one default. A connection test remains ephemeral and does not attach to any UI thread.

## Options

Settings are separated into three independently auto-saved sections:

- **AI Provider**: optional Codex model, local endpoint, and bearer token.
- **Mode**: live or debug placeholder responses.
- **System Prompt**: instructions shared by single-paper and Comparative Reading requests.

The model selected through `/model` is session-global rather than part of a paper or conversation record. It remains active while the browser session is open. A new browser session starts from the default marked in Options.

The local token input is intentionally cleared after saving. The saved token remains in `chrome.storage.local`.

## Prerequisites

Codex CLI must be installed and authenticated:

- Codex: `codex`

The bridge defaults to `codex`. Override it with `PAPER_CHAT_CODEX_BIN` when necessary.

The bridge loads the skill from `.agents/skills/paper-reading`. Override that directory with `PAPER_CHAT_READING_SKILL_DIR` when running a separately packaged bridge.

## Start The Bridge

Paste this into Terminal:

```sh
cd "/Users/ziru/Documents/GitHub/chromePaperChat" && PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-server.js
```

Keep that terminal process running while using live AI mode. Configure Options with:

- Local Endpoint: `http://127.0.0.1:32177/ask`
- Local Token: `paper-chat-local`
- Model: blank for the Codex default, or a model identifier accepted by Codex

## Managed Documents And Bridge Behavior

The bridge listens only on `127.0.0.1` and requires the bearer token for its document, model, connection-test, session-deletion, and ask endpoints. `HEAD /documents/:documentRef` checks for an existing paper; `PUT /documents/:documentRef` stores Markdown and source-span offsets; `DELETE /documents/:documentRef` removes one content-addressed object after a permanent paper deletion. A `documentRef` is `sha256-` followed by the SHA-256 hash of the Markdown's UTF-8 bytes. Uploads are limited by `PAPER_CHAT_MAX_DOCUMENT_BYTES` (default 25,000,000 bytes), independently from `/ask`'s request limit.

Persistent files live at `<PAPER_CHAT_LOCAL_AGENT_WORKDIR>/.paper-toaster/documents/<documentRef>/` as `paper.md`, `spans.json`, and `manifest.json`. If `PAPER_CHAT_LOCAL_AGENT_WORKDIR` is unset, the bridge uses the system temporary directory (or the legacy `PAPER_CHAT_CODEX_WORKDIR` override). For each `/ask`, it creates annotated Markdown under `.paper-toaster/requests/<request-id>/`, passes only relative file paths and short instructions to the CLI, and removes the request directory after success, failure, timeout, or abort. On startup, it also removes request directories older than one hour. Persistent document objects are not age-deleted; archiving and restoring papers leave them intact.

The bridge applies a three-minute default Agent timeout. The first `/ask` for a UI thread creates a persistent read-only Codex session; subsequent questions use `codex exec resume` with the saved session ID. The mapping lives in `~/.paper-toaster/sessions/` by default, or `PAPER_CHAT_LOCAL_AGENT_SESSION_DIR` when set; Codex stores the actual rollout separately in its own data directory. The mapping survives bridge restarts and has no idle-time expiry. Re-parsing a paper to different Markdown, changing a comparison's paper set, changing the paper-reading skill, or losing/aborting a turn retires that Agent session while retaining the UI chat record. Deleting a UI thread removes its mapping and Codex rollout; if the bridge is offline, the extension queues that deletion for retry.

Codex CLI is a local agent interface, not necessarily a local model. Its configuration determines whether requests are sent to a remote service. Persisting its session does not guarantee provider prompt-cache hits.

## Mock Bridge

For UI and storage testing without invoking Codex:

```sh
cd "/Users/ziru/Documents/GitHub/chromePaperChat" && PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-mock-server.js
```

## Implementation

- `src/storage/ai-settings-store.js`
- `src/options/options.html`
- `src/options/options.js`
- `src/ai/local-agent-client.js`
- `src/ai/local-agent-session-client.js`
- `src/ai/local-agent-document-client.js`
- `src/ai/selection-answer.js`
- `src/compare/comparison-answer.js`
- `.agents/skills/paper-reading/SKILL.md`
- `scripts/paper-reading-skill.js`
- `scripts/local-agent-document-store.js`
- `scripts/local-agent-session-store.js`
- `scripts/local-agent-codex-runner.js`
- `scripts/local-agent-server.js`
- `scripts/local-agent-mock-server.js`
