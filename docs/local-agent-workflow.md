# Local Agent Workflow

Last updated: 2026-09-06

Status: implemented for the current MVP. Streaming responses are not implemented yet; that follow-up is tracked in `docs/unfinished-feature-plan.md`.

## Goal

Allow the extension to use a local AI agent through a small HTTP bridge instead of calling a hosted provider directly.

The extension cannot spawn local CLI tools such as Codex or Claude Code from inside Chrome. The supported architecture is:

```text
Paper Toaster
  -> build selected-text / whole-paper RAG prompt
  -> POST local HTTP bridge
  -> bridge invokes local agent or local model
  -> bridge returns answer text
```

## Extension Provider

Options now supports:

- `Gemini`
- `Local Agent`

Local Agent settings:

- `model`: optional label passed to the local bridge
- `localEndpoint`: defaults to `http://127.0.0.1:32177/ask`
- `localAuthToken`: local shared secret sent as `Authorization: Bearer ...`; the development default is `paper-chat-local`

The settings layer only accepts loopback hosts:

- `127.0.0.1`
- `localhost`
- `[::1]`

This prevents paper context from being sent to arbitrary remote URLs through a misconfigured endpoint.

## Request Contract

The extension sends:

```http
Authorization: Bearer <local token>
Content-Type: application/json
```

```json
{
  "version": 1,
  "source": "pdf-ai-inspector",
  "model": "optional-model-label",
  "prompt": "fully formatted prompt string",
  "systemPrompt": "configured system prompt",
  "contextPack": {},
  "conversationMessages": []
}
```

`prompt` is the canonical input. `contextPack` is included so a smarter local bridge can inspect structured paper context later, but a minimal bridge can ignore it.

`source` remains the legacy internal compatibility id. Product-facing UI is now `Paper Toaster`.

## Response Contract

The local bridge can return any of these:

```json
{ "text": "answer" }
```

```json
{ "answer": "answer" }
```

OpenAI-compatible shape is also accepted:

```json
{
  "choices": [
    {
      "message": {
        "content": "answer"
      }
    }
  ]
}
```

Plain text responses are accepted too.

## Minimal Bridge Shape

A local bridge should:

- listen on `127.0.0.1`
- expose `POST /ask`
- require the configured bearer token
- read JSON body
- pass `body.prompt` to the local agent
- return `{ "text": "..." }`

Pseudo-code:

```js
import http from "node:http";

http.createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/ask") {
    response.writeHead(404);
    response.end();
    return;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
const answer = await runLocalAgent(body.prompt, body);

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ text: answer }));
}).listen(32177, "127.0.0.1");
```

## Mock Bridge

For extension-side testing without spending model tokens:

```sh
PAPER_CHAT_LOCAL_AGENT_TOKEN="dev-local-token" node scripts/local-agent-mock-server.js
```

Then set Options:

- Provider: `Local Agent`
- Local Endpoint: `http://127.0.0.1:32177/ask`
- Local Token: any non-empty token, for example `dev-local-token`
- Debug mode: off

The mock bridge returns prompt/context statistics instead of an AI answer. If the side panel receives that response, the local provider path is wired correctly.

## Codex Bridge

For Codex CLI:

```sh
PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-codex-server.js
```

Then set Options:

- Provider: `Local Agent`
- Local Endpoint: `http://127.0.0.1:32177/ask`
- Local Token: `paper-chat-local`
- Model: leave blank to use Codex default, or set a Codex-supported model
- Debug mode: off

The bridge runs:

```sh
codex exec --ephemeral --skip-git-repo-check --sandbox read-only --color never --output-last-message <tmp-file> -
```

Safety properties:

- the bridge only listens on `127.0.0.1`
- requests must include the bearer token
- Codex receives the prompt through stdin
- the Codex process runs from the system temp directory by default
- the Codex sandbox is `read-only`
- sessions are `--ephemeral`
- each request has a timeout
- the bridge does not expose arbitrary command execution

Important limitation: Codex CLI is a local agent interface, not necessarily a local model. Depending on your Codex configuration, the paper prompt may be sent to Codex/OpenAI services.

## Current Implementation

Relevant files:

- `src/ai/local-agent-client.js`
- `scripts/local-agent-mock-server.js`
- `scripts/local-agent-codex-server.js`
- `src/ai/selection-answer.js`
- `src/storage/ai-settings-store.js`
- `src/options/options.html`
- `src/options/options.js`

The RAG, conversation memory, selected text handling, comparative reading flow, and document storage pipeline are unchanged. Only the final answer provider changes.
