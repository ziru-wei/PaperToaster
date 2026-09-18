import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { StringDecoder } from "node:string_decoder";
import { validateAgentSessionId } from "./local-agent-session-store.js";

const MAX_EVENT_LINE_BYTES = 32_000_000;
const MAX_STDERR_BYTES = 16_000;

export function buildCodexArgs({ outputFile, agentSessionId = "", ephemeral = false, model = "", reasoningEffort = "" }) {
  if (agentSessionId) validateAgentSessionId(agentSessionId);
  const common = [
    "exec",
    "--json",
    "--skip-git-repo-check",
    "--sandbox", "read-only",
    "--color", "never"
  ];
  if (ephemeral) common.push("--ephemeral");
  if (agentSessionId) common.push("resume", agentSessionId);
  common.push("--output-last-message", outputFile);
  const normalizedModel = String(model || "").replace(/\s+/g, " ").trim();
  const normalizedEffort = String(reasoningEffort || "").trim().toLowerCase();
  if (normalizedModel) common.push("--model", normalizedModel);
  if (normalizedEffort) common.push("-c", `model_reasoning_effort=${JSON.stringify(normalizedEffort)}`);
  common.push("-");
  return common;
}

export function createCodexEventParser() {
  let pending = "";
  const decoder = new StringDecoder("utf8");
  let threadId = "";
  let completed = false;
  let cachedInputTokens = null;

  function consume(line) {
    if (!line.trim()) return;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      throw new Error("Codex returned malformed JSONL.");
    }
    if (event?.type === "thread.started") {
      const id = validateAgentSessionId(event.thread_id);
      if (threadId) throw new Error("Codex returned more than one thread.started event.");
      threadId = id;
    }
    if (event?.type === "turn.completed") {
      completed = true;
      const count = event.usage?.cached_input_tokens;
      if (Number.isSafeInteger(count) && count >= 0) cachedInputTokens = count;
    }
  }

  return {
    push(chunk) {
      pending += decoder.write(chunk);
      if (Buffer.byteLength(pending, "utf8") > MAX_EVENT_LINE_BYTES) {
        throw new Error("Codex JSONL event exceeded the allowed size.");
      }
      let newline;
      while ((newline = pending.indexOf("\n")) !== -1) {
        consume(pending.slice(0, newline));
        pending = pending.slice(newline + 1);
      }
    },
    finish() {
      pending += decoder.end();
      consume(pending);
      pending = "";
      if (!threadId || !completed) throw new Error("Codex did not complete a tracked turn.");
      return { threadId, cachedInputTokens };
    },
    getThreadId() { return threadId; }
  };
}

export async function runCodex({ prompt, agentSessionId = "", ephemeral = false, model = "", reasoningEffort = "", signal,
  binary = "codex", cwd = os.tmpdir(), timeoutMs = 180_000 }) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "paper-chat-codex-"));
  const outputFile = path.join(tempDir, "answer.txt");
  const parser = createCodexEventParser();
  let cliStarted = false;
  try {
    signal?.throwIfAborted?.();
    const event = await new Promise((resolve, reject) => {
      const child = spawn(binary, buildCodexArgs({ outputFile, agentSessionId, ephemeral, model, reasoningEffort }), {
        cwd,
        env: { ...process.env, NO_COLOR: "1" },
        stdio: ["pipe", "pipe", "pipe"]
      });
      cliStarted = true;
      let settled = false;
      let terminalError = null;
      let stderr = "";
      let forceKill = null;
      const timeout = setTimeout(() => {
        terminalError = new Error(`Codex request timed out after ${timeoutMs}ms.`);
        child.kill("SIGTERM");
        forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
      }, timeoutMs);
      const abort = () => {
        terminalError = signal?.reason instanceof Error ? signal.reason : new Error("Codex request aborted.");
        child.kill("SIGTERM");
        forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
      };
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) abort();
      child.stdout.on("data", (chunk) => {
        if (terminalError) return;
        try { parser.push(chunk); } catch (error) {
          terminalError = error;
          child.kill("SIGTERM");
          forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
        }
      });
      child.stderr.on("data", (chunk) => {
        stderr = (stderr + chunk.toString("utf8")).slice(-MAX_STDERR_BYTES);
      });
      child.stdin.on("error", (error) => { terminalError ||= error; });
      child.on("error", (error) => { terminalError ||= error; });
      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        clearTimeout(forceKill);
        signal?.removeEventListener("abort", abort);
        if (terminalError) return reject(terminalError);
        if (code !== 0) return reject(new Error(`Codex exited with code ${code}: ${stderr.trim().slice(-1000)}`));
        try { resolve(parser.finish()); } catch (error) { reject(error); }
      });
      child.stdin.end(prompt);
    });
    if (agentSessionId && event.threadId !== agentSessionId) {
      throw new Error("Codex resumed a different session than requested.");
    }
    const text = (await readFile(outputFile, "utf8")).trim();
    if (!text) throw new Error("Codex returned no final message.");
    return { text, agentSessionId: event.threadId, cachedInputTokens: event.cachedInputTokens };
  } catch (error) {
    error.cliStarted = cliStarted;
    error.startedSessionId = parser.getThreadId();
    throw error;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function deleteCodexSession(agentSessionId, { binary = "codex", cwd = os.tmpdir(), timeoutMs = 30_000 } = {}) {
  validateAgentSessionId(agentSessionId);
  await new Promise((resolve, reject) => {
    const child = spawn(binary, ["delete", "--force", agentSessionId], {
      cwd,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "ignore", "pipe"]
    });
    let stderr = "";
    let failure = null;
    let forceKill = null;
    const timer = setTimeout(() => {
      failure = new Error("Codex session deletion timed out.");
      child.kill("SIGTERM");
      forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
    }, timeoutMs);
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString("utf8")).slice(-MAX_STDERR_BYTES); });
    child.on("error", (error) => { failure ||= error; });
    child.on("close", (code) => {
      clearTimeout(timer);
      clearTimeout(forceKill);
      if (failure) return reject(failure);
      if (code !== 0 && !/not found|does not exist/i.test(stderr)) {
        return reject(new Error(`Codex session deletion failed: ${stderr.trim().slice(-1000) || `exit ${code}`}`));
      }
      resolve();
    });
  });
}
