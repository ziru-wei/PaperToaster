#!/usr/bin/env node
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const root = process.env.FAKE_CODEX_STATE_DIR || path.join(os.tmpdir(), "paper-toaster-fake-codex");
await mkdir(root, { recursive: true });

if (args[0] === "delete") {
  const id = args.at(-1);
  await unlink(path.join(root, `${id}.json`)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  process.exit(0);
}

if (args[0] !== "exec") process.exit(2);
const resumeIndex = args.indexOf("resume");
const requestedId = resumeIndex >= 0 ? args[resumeIndex + 1] : "";
const savedFile = requestedId ? path.join(root, `${requestedId}.json`) : "";
let prior = null;
if (savedFile) prior = JSON.parse(await readFile(savedFile, "utf8").catch(() => "null"));
const id = prior ? requestedId : randomUUID();
const turns = (prior?.turns || 0) + 1;
const outputIndex = args.indexOf("--output-last-message");
const outputFile = args[outputIndex + 1];
const prompt = await new Promise((resolve) => {
  let text = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { text += chunk; });
  process.stdin.on("end", () => resolve(text));
});
if (!args.includes("--ephemeral")) {
  await writeFile(path.join(root, `${id}.json`), JSON.stringify({ turns, prompt }), "utf8");
}
if (process.env.FAKE_CODEX_FAIL === "1" || prompt.includes("[FAKE_FAIL]")) process.exit(1);
await writeFile(outputFile, `Fake Codex answer, turn ${turns}.`, "utf8");
process.stdout.write(`${JSON.stringify({ type: "thread.started", thread_id: id })}\n`);
process.stdout.write(`${JSON.stringify({ type: "turn.completed", usage: { cached_input_tokens: turns > 1 ? 100 : 0 } })}\n`);
