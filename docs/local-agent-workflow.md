# Local Agent Workflow

## Architecture

Paper Toaster cannot spawn a local CLI from a Chrome extension. It synchronizes each paper's Markdown with a token-protected loopback bridge, then sends a structured question referencing that managed document:

```text
Paper Toaster -> HEAD/PUT /documents/:documentRef (upload only when absent)
              -> POST /ask (title, documentRef, source-span citation map, current question)
              -> request-scoped annotated Markdown files
              -> Codex CLI or Antigravity CLI reads those files
              -> answer text and source-span citations
```

Before invoking either CLI, the bridge loads the repository-owned `paper-reading` skill. It loads the shared citation reference and the reference for the request's `single-paper` or `comparative-reading` mode. The same compiled skill instructions are supplied to Codex and Antigravity, so the workflow does not depend on implicit CLI skill discovery.

The extension assigns source-span citation IDs and sends the current question, optional current selected text, paper titles, document references, and citation maps. Single Paper sends one descriptor (`p1`); Comparative Reading sends ordered descriptors (`p1`, `p2`, …). It does not route questions, retrieve chunks, or send Markdown, URLs, paper metadata, or prior conversation turns in `/ask`. Chat messages remain in extension IndexedDB, not in managed Agent files. The skill directs the Agent to search and read the supplied files using read-only tools.

The extension sends the selected CLI profile with every request. Changing the profile in Options affects the next request and does not require restarting the bridge.

The bridge also exposes authenticated `GET /models` and `POST /connection-test`. Codex models come from Codex's locally refreshed model catalog; Antigravity models come from `agy models`. The Options page lets the user choose which discovered models appear in the chat `/model` menu and mark one default.

## Options

Settings are separated into three independently auto-saved sections:

- **AI Provider**: CLI profile, optional model, local endpoint, and bearer token.
- **Mode**: live or debug placeholder responses.
- **System Prompt**: instructions shared by single-paper and Comparative Reading requests.

The model selected through `/model` is session-global rather than part of a paper or conversation record. It remains active while the browser session is open. A new browser session starts from the default marked in Options.

The local token input is intentionally cleared after saving. The saved token remains in `chrome.storage.local`.

## Prerequisites

At least one supported CLI must be installed and authenticated:

- Codex profile: `codex`
- Antigravity profile: `agy`

The bridge defaults to those executable names. Override them with `PAPER_CHAT_CODEX_BIN` or `PAPER_CHAT_ANTIGRAVITY_BIN` when necessary.

The bridge loads the skill from `.agents/skills/paper-reading`. Override that directory with `PAPER_CHAT_READING_SKILL_DIR` when running a separately packaged bridge.

## Start The Bridge

Paste this into Terminal:

```sh
cd "/Users/ziru/Documents/GitHub/chromePaperChat" && PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-server.js
```

Keep that terminal process running while using live AI mode. Configure Options with:

- Local Endpoint: `http://127.0.0.1:32177/ask`
- Local Token: `paper-chat-local`
- CLI Profile: `Codex CLI` or `Antigravity CLI`
- Model: blank for the CLI default, or a model identifier accepted by that CLI

## Managed Documents And Bridge Behavior

The bridge listens only on `127.0.0.1` and requires the bearer token for its document, model, connection-test, and ask endpoints. `HEAD /documents/:documentRef` checks for an existing paper; `PUT /documents/:documentRef` stores Markdown and source-span offsets; `DELETE /documents/:documentRef` removes one content-addressed object after a permanent paper deletion. A `documentRef` is `sha256-` followed by the SHA-256 hash of the Markdown's UTF-8 bytes. Uploads are limited by `PAPER_CHAT_MAX_DOCUMENT_BYTES` (default 25,000,000 bytes), independently from `/ask`'s request limit.

Persistent files live at `<PAPER_CHAT_LOCAL_AGENT_WORKDIR>/.paper-toaster/documents/<documentRef>/` as `paper.md`, `spans.json`, and `manifest.json`. If `PAPER_CHAT_LOCAL_AGENT_WORKDIR` is unset, the bridge uses the system temporary directory (or the legacy `PAPER_CHAT_CODEX_WORKDIR` override). For each `/ask`, it creates annotated Markdown under `.paper-toaster/requests/<request-id>/`, passes only relative file paths and short instructions to the CLI, and removes the request directory after success, failure, timeout, or abort. On startup, it also removes request directories older than one hour. Persistent document objects are not age-deleted; archiving and restoring papers leave them intact.

The bridge applies a three-minute default Agent timeout. Codex uses an ephemeral read-only session and receives its short prompt on stdin. Antigravity uses print mode, text output, disabled slash commands, and sandbox mode.

Codex and Antigravity are local agent interfaces, not necessarily local models. Their own configuration determines whether requests are sent to remote services.

## Mock Bridge

For UI and storage testing without invoking either CLI:

```sh
cd "/Users/ziru/Documents/GitHub/chromePaperChat" && PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-mock-server.js
```

## Implementation

- `src/storage/ai-settings-store.js`
- `src/options/options.html`
- `src/options/options.js`
- `src/ai/local-agent-client.js`
- `src/ai/local-agent-document-client.js`
- `src/ai/selection-answer.js`
- `src/compare/comparison-answer.js`
- `.agents/skills/paper-reading/SKILL.md`
- `scripts/paper-reading-skill.js`
- `scripts/local-agent-document-store.js`
- `scripts/local-agent-server.js`
- `scripts/local-agent-mock-server.js`
