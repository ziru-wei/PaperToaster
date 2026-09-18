import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAiSettings, normalizeModelSelection } from "../src/storage/ai-settings-store.js";

test("Antigravity settings are not exposed as usable Codex models", () => {
  const settings = normalizeAiSettings({ localAgentProfile: "antigravity", model: "gemini-test", enabledChatModels: [
    { profile: "antigravity", model: "gemini-test" },
    { profile: "codex", model: "codex-test" }
  ] });
  assert.equal(settings.localAgentProfile, "codex");
  assert.equal(settings.model, "");
  assert.deepEqual(settings.enabledChatModels.map((item) => item.model), ["codex-test"]);
  assert.equal(normalizeModelSelection({ profile: "antigravity", model: "gemini-test" }), null);
});

test("offline session deletion remains queued and retries when the bridge returns", async () => {
  const values = new Map();
  globalThis.chrome = {
    storage: {
      local: {
        async get(keys) {
          if (keys === null) return Object.fromEntries(values);
          const selected = Array.isArray(keys) ? keys : [keys];
          return Object.fromEntries(selected.filter((key) => values.has(key)).map((key) => [key, values.get(key)]));
        },
        async set(entries) { for (const [key, value] of Object.entries(entries)) values.set(key, value); },
        async remove(key) { values.delete(key); }
      }
    }
  };
  const originalFetch = globalThis.fetch;
  let online = false;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (!online) throw new Error("bridge offline");
    return new Response(null, { status: 204 });
  };
  try {
    const { deleteLocalAgentSession, flushPendingLocalAgentSessionDeletes, hasPendingLocalAgentSessionDeletion } = await import("../src/ai/local-agent-session-client.js");
    await assert.rejects(deleteLocalAgentSession({ mode: "single-paper", conversationKey: "thread-abc123-def45678" }), /queued for retry/);
    const pending = [...values.keys()].filter((key) => key.startsWith("pendingLocalAgentSessionDeletionV1:"));
    assert.equal(pending.length, 1);
    assert.equal(await hasPendingLocalAgentSessionDeletion({ mode: "single-paper", conversationKey: "thread-abc123-def45678" }), true);
    assert.equal(requests[0].options.method, "DELETE");
    assert.match(requests[0].url, /\/sessions$/);
    online = true;
    const result = await flushPendingLocalAgentSessionDeletes();
    assert.deepEqual(result, { deleted: 1, failures: [] });
    assert.equal(values.has(pending[0]), false);
    assert.equal(await hasPendingLocalAgentSessionDeletion({ mode: "single-paper", conversationKey: "thread-abc123-def45678" }), false);
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.chrome;
  }
});
