# Local Agent Workflow

## Architecture

Paper Toaster cannot spawn a local CLI from a Chrome extension. It sends each question to a token-protected loopback bridge, and the bridge invokes the selected CLI:

```text
Paper Toaster -> POST http://127.0.0.1:32177/ask
              -> Codex CLI or Antigravity CLI
              -> answer text
```

The extension sends the selected CLI profile with every request. Changing the profile in Options affects the next request and does not require restarting the bridge.

The bridge also exposes authenticated `GET /models`. Codex models come from Codex's locally refreshed model catalog; Antigravity models come from `agy models`. The Options page lets the user choose which discovered models appear in the chat `/model` menu and mark one default.

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

## Bridge Behavior

The bridge listens only on `127.0.0.1`, requires the bearer token, accepts only `POST /ask`, passes prompts through stdin, and applies a three-minute default timeout. Codex uses an ephemeral read-only session. Antigravity uses print mode, text output, disabled slash commands, and sandbox mode.

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
- `src/ai/selection-answer.js`
- `src/compare/comparison-answer.js`
- `scripts/local-agent-server.js`
- `scripts/local-agent-mock-server.js`
