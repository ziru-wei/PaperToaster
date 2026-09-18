import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  computePaperFingerprint,
  readSessionRecord,
  withConversationLock,
  writeSessionRecord
} from "./local-agent-session-store.js";
import { buildCodexArgs, createCodexEventParser } from "./local-agent-codex-runner.js";

const serverFile = fileURLToPath(new URL("./local-agent-server.js", import.meta.url));
const mockServerFile = fileURLToPath(new URL("./local-agent-mock-server.js", import.meta.url));
const fakeCli = fileURLToPath(new URL("./fixtures/fake-codex-cli.js", import.meta.url));
const key = "thread-test1234-abcdefgh";

test("Codex args and JSONL parser keep a resumable ID", () => {
  const first = buildCodexArgs({ outputFile: "/tmp/answer", model: "model-a", reasoningEffort: "high" });
  assert.equal(first.includes("--ephemeral"), false);
  assert.deepEqual(first.slice(0, 8), ["exec", "--json", "--skip-git-repo-check", "--sandbox", "read-only", "--color", "never", "--output-last-message"]);
  const resume = buildCodexArgs({ outputFile: "/tmp/answer", agentSessionId: "11111111-1111-4111-8111-111111111111", model: "model-b", reasoningEffort: "low" });
  assert.ok(resume.indexOf("--sandbox") < resume.indexOf("resume"));
  assert.equal(resume[resume.indexOf("resume") + 1], "11111111-1111-4111-8111-111111111111");
  assert.deepEqual(resume.slice(resume.indexOf("--model"), resume.indexOf("--model") + 2), ["--model", "model-b"]);
  assert.ok(resume.includes('model_reasoning_effort="low"'));
  const parser = createCodexEventParser();
  parser.push(Buffer.from('{"type":"thread.started","thread_id":"11111111-1111-4111-8111-111111111111"}\n{"type":"turn.completed","usage":{"cached_input_tokens":12}}\n'));
  assert.deepEqual(parser.finish(), { threadId: "11111111-1111-4111-8111-111111111111", cachedInputTokens: 12 });
});

test("paper order changes the fingerprint and a failed lock does not block the next call", async () => {
  const a = { paperId: "p1", documentRef: `sha256-${"a".repeat(64)}` };
  const b = { paperId: "p2", documentRef: `sha256-${"b".repeat(64)}` };
  assert.notEqual(computePaperFingerprint("comparative-reading", [a, b]),
    computePaperFingerprint("comparative-reading", [{ ...b, paperId: "p1" }, { ...a, paperId: "p2" }]));
  await assert.rejects(withConversationLock("single-paper", key, async () => { throw new Error("first failed"); }));
  assert.equal(await withConversationLock("single-paper", key, async () => "second ran"), "second ran");
  const order = [];
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const first = withConversationLock("single-paper", key, async () => {
    order.push("first start");
    await gate;
    order.push("first end");
  });
  const second = withConversationLock("single-paper", key, async () => { order.push("second start"); });
  await new Promise((resolve) => setTimeout(resolve, 0));
  release();
  await Promise.all([first, second]);
  assert.deepEqual(order, ["first start", "first end", "second start"]);
});

test("bridge resumes after restart without idle expiry, and retires changed paper and deleted thread", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "paper-toaster-session-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sessionDir = path.join(root, "sessions");
  const fakeState = path.join(root, "fake-codex");
  const workdir = path.join(root, "workdir");
  const port = await freePort();
  const token = "test-token";
  const endpoint = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env,
    PAPER_CHAT_LOCAL_AGENT_PORT: String(port),
    PAPER_CHAT_LOCAL_AGENT_TOKEN: token,
    PAPER_CHAT_LOCAL_AGENT_SESSION_DIR: sessionDir,
    PAPER_CHAT_LOCAL_AGENT_WORKDIR: workdir,
    PAPER_CHAT_CODEX_BIN: fakeCli,
    FAKE_CODEX_STATE_DIR: fakeState
  };
  let bridge = await startBridge(env, endpoint);
  t.after(async () => { if (bridge) await stopBridge(bridge); });

  const paper = await uploadPaper(endpoint, token, "# First paper\nEvidence A.");
  const ask = async (descriptor, systemPrompt = "Style A", conversationKey = key, question = "What is the evidence?") => {
    const response = await fetch(`${endpoint}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        version: 3, source: "paper-toaster", localAgentProfile: "codex",
        mode: "single-paper", conversationKey, model: "", reasoningEffort: "",
        systemPrompt, question, selectionText: "", papers: [descriptor]
      })
    });
    return { status: response.status, body: await response.json() };
  };
  const first = await ask(paper);
  assert.equal(first.status, 200, JSON.stringify(first.body));
  assert.match(first.body.text, /turn 1/);
  const second = await ask(paper);
  assert.equal(second.status, 200, JSON.stringify(second.body));
  assert.match(second.body.text, /turn 2/);
  const beforeRestart = await readSessionRecord(sessionDir, "single-paper", key);
  await writeSessionRecord(sessionDir, { ...beforeRestart, createdAt: 1, lastUsedAt: 1 });
  await stopBridge(bridge);
  bridge = await startBridge(env, endpoint);
  const third = await ask(paper, "Style B");
  assert.equal(third.status, 200, JSON.stringify(third.body));
  assert.match(third.body.text, /turn 3/);
  const afterRestart = await readSessionRecord(sessionDir, "single-paper", key);
  assert.equal(afterRestart.agentSessionId, beforeRestart.agentSessionId);
  const fakeRollout = JSON.parse(await readFile(path.join(fakeState, `${afterRestart.agentSessionId}.json`), "utf8"));
  assert.match(fakeRollout.prompt, /supersede all prior additional answer instructions/);
  const fourth = await ask(paper, "Style B");
  assert.match(fourth.body.text, /turn 4/);
  const nextRollout = JSON.parse(await readFile(path.join(fakeState, `${afterRestart.agentSessionId}.json`), "utf8"));
  assert.doesNotMatch(nextRollout.prompt, /supersede all prior additional answer instructions/);

  const changedPaper = await uploadPaper(endpoint, token, "# Revised paper\nEvidence B.");
  const afterReparse = await ask(changedPaper, "Style B");
  assert.equal(afterReparse.status, 200, JSON.stringify(afterReparse.body));
  assert.match(afterReparse.body.text, /turn 1/);
  const newRecord = await readSessionRecord(sessionDir, "single-paper", key);
  assert.notEqual(newRecord.agentSessionId, beforeRestart.agentSessionId);
  await assert.rejects(readFile(path.join(fakeState, `${beforeRestart.agentSessionId}.json`), "utf8"), { code: "ENOENT" });

  const failed = await ask(changedPaper, "Style B", key, "[FAKE_FAIL]");
  assert.equal(failed.status, 500);
  assert.equal(await readSessionRecord(sessionDir, "single-paper", key), null);
  const afterFailure = await ask(changedPaper, "Style B");
  assert.match(afterFailure.body.text, /turn 1/);
  const replacementRecord = await readSessionRecord(sessionDir, "single-paper", key);

  const comparisonKey = "comparison-test1234-abcdefgh";
  const secondPaper = { ...changedPaper, paperId: "p2", sourceSpanCitations: [{ sourceSpanId: "span-1", citationId: "p2-h1-c1" }] };
  const askComparison = async (papers) => {
    const response = await fetch(`${endpoint}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ version: 3, source: "paper-toaster", localAgentProfile: "codex",
        mode: "comparative-reading", conversationKey: comparisonKey,
        question: "Compare the papers.", papers })
    });
    return { status: response.status, body: await response.json() };
  };
  assert.match((await askComparison([paper, secondPaper])).body.text, /turn 1/);
  assert.match((await askComparison([paper, secondPaper])).body.text, /turn 2/);
  const originalComparison = await readSessionRecord(sessionDir, "comparative-reading", comparisonKey);
  const swapped = [{ ...changedPaper, paperId: "p1" }, { ...paper, paperId: "p2", sourceSpanCitations: [{ sourceSpanId: "span-1", citationId: "p2-h1-c1" }] }];
  const changedComparison = await askComparison(swapped);
  assert.equal(changedComparison.status, 200, JSON.stringify(changedComparison.body));
  assert.match(changedComparison.body.text, /turn 1/);
  assert.notEqual((await readSessionRecord(sessionDir, "comparative-reading", comparisonKey)).agentSessionId, originalComparison.agentSessionId);
  await assert.rejects(readFile(path.join(fakeState, `${originalComparison.agentSessionId}.json`), "utf8"), { code: "ENOENT" });

  const deletion = await fetch(`${endpoint}/sessions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version: 1, mode: "single-paper", conversationKey: key, requestedAt: Date.now() })
  });
  assert.equal(deletion.status, 204);
  assert.equal(await readSessionRecord(sessionDir, "single-paper", key), null);
  await assert.rejects(readFile(path.join(fakeState, `${replacementRecord.agentSessionId}.json`), "utf8"), { code: "ENOENT" });
  const invalid = await ask(paper, "Style A", "missing-key");
  assert.equal(invalid.status, 400);
  const antigravity = await fetch(`${endpoint}/connection-test`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ localAgentProfile: "antigravity" })
  });
  assert.equal(antigravity.status, 400);
});

test("mock bridge enforces v3 and reports created/resumed turns", async (t) => {
  const port = await freePort();
  const token = "mock-test-token";
  const endpoint = `http://127.0.0.1:${port}`;
  const bridge = await startBridge({ ...process.env, PAPER_CHAT_LOCAL_AGENT_PORT: String(port), PAPER_CHAT_LOCAL_AGENT_TOKEN: token }, endpoint, mockServerFile);
  t.after(() => stopBridge(bridge));
  const paper = await uploadPaper(endpoint, token, "# Mock paper\nEvidence.");
  const send = async (version) => {
    const response = await fetch(`${endpoint}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ version, source: "paper-toaster", localAgentProfile: "codex",
        mode: "single-paper", conversationKey: key, question: "What?", papers: [paper] })
    });
    return { status: response.status, body: await response.json() };
  };
  assert.equal((await send(2)).status, 400);
  assert.equal((await send(3)).body.sessionState, "created");
  assert.equal((await send(3)).body.sessionState, "resumed");
  const deletion = await fetch(`${endpoint}/sessions`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version: 1, mode: "single-paper", conversationKey: key, requestedAt: Date.now() })
  });
  assert.equal(deletion.status, 204);
  assert.equal((await send(3)).body.sessionState, "created");
});

async function uploadPaper(endpoint, token, markdown) {
  const documentRef = `sha256-${createHash("sha256").update(markdown, "utf8").digest("hex")}`;
  const response = await fetch(`${endpoint}/documents/${documentRef}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      version: 1, markdown,
      sourceSpans: [{ id: "span-1", index: 1, markdownStart: 0, markdownEnd: markdown.length, sectionTitle: "Paper" }]
    })
  });
  assert.ok([201, 204].includes(response.status), await response.text());
  return { title: "Test paper", paperId: "p1", documentRef, sourceSpanCitations: [{ sourceSpanId: "span-1", citationId: "p1-h1-c1" }] };
}

async function freePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function startBridge(env, endpoint, scriptFile = serverFile) {
  const child = spawn(process.execPath, [scriptFile], { env, stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Bridge exited: ${stderr}`);
    try {
      const response = await fetch(`${endpoint}/not-found`);
      if (response.status === 404) return child;
    } catch { /* bridge still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  await stopBridge(child);
  throw new Error(`Bridge did not start: ${stderr}`);
}

async function stopBridge(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await once(child, "close");
}
