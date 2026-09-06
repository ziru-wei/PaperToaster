import http from "node:http";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PAPER_CHAT_LOCAL_AGENT_PORT) || 32177;
const CODEX_BIN = process.env.PAPER_CHAT_CODEX_BIN || "codex";
const CODEX_WORKDIR = process.env.PAPER_CHAT_CODEX_WORKDIR || os.tmpdir();
const CODEX_MODEL = process.env.PAPER_CHAT_CODEX_MODEL || "";
const AUTH_TOKEN = String(process.env.PAPER_CHAT_LOCAL_AGENT_TOKEN || "").trim();
const REQUEST_TIMEOUT_MS = Number(process.env.PAPER_CHAT_CODEX_TIMEOUT_MS) || 180000;
const MAX_REQUEST_BYTES = Number(process.env.PAPER_CHAT_MAX_REQUEST_BYTES) || 2_000_000;

if (!AUTH_TOKEN) {
  console.error("PAPER_CHAT_LOCAL_AGENT_TOKEN is required.");
  process.exit(1);
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    writeCors(response, request, 204);
    response.end();
    return;
  }

  if (request.method !== "POST" || request.url !== "/ask") {
    writeJson(response, request, 404, { error: "Not found" });
    return;
  }

  if (!isAuthorized(request)) {
    writeJson(response, request, 401, { error: "Unauthorized local agent request." });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request));
    const result = await runCodex(buildCodexPrompt(body), body);
    writeJson(response, request, 200, {
      model: result.model,
      text: result.text
    });
  } catch (error) {
    writeJson(response, request, error.status || 500, {
      error: error.message || String(error)
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Codex local agent bridge listening at http://${HOST}:${PORT}/ask`);
  console.log(`Using ${CODEX_BIN}; workdir ${CODEX_WORKDIR}`);
});

function buildCodexPrompt(body) {
  const prompt = String(body?.prompt || "").trim();
  if (!prompt) {
    const error = new Error("Request body must include a non-empty prompt.");
    error.status = 400;
    throw error;
  }

  return [
    "You are serving as a local answer engine for a Chrome paper-reading extension.",
    "Answer the paper-reading question using only the supplied paper prompt and context.",
    "Do not edit files, run shell commands, inspect the current machine, inspect a repository, or mention this bridge.",
    "Return only the answer to the user's question.",
    "",
    prompt
  ].join("\n");
}

async function runCodex(prompt, body) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "paper-chat-codex-"));
  const outputFile = path.join(tempDir, "answer.txt");

  try {
    await spawnCodex(prompt, outputFile, body);
    const text = (await readFile(outputFile, "utf8")).trim();
    if (!text) {
      throw new Error("Codex returned no final message.");
    }

    return {
      model: normalizeModelLabel(body?.model) || "codex",
      text
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function spawnCodex(prompt, outputFile, body) {
  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      "--ephemeral",
      "--skip-git-repo-check",
      "--sandbox",
      "read-only",
      "--color",
      "never",
      "--output-last-message",
      outputFile,
      ...getModelArgs(body?.model),
      "-"
    ];
    const child = spawn(CODEX_BIN, args, {
      cwd: CODEX_WORKDIR,
      env: {
        ...process.env,
        NO_COLOR: "1"
      },
      stdio: ["pipe", "pipe", "pipe"]
    });
    const stdout = [];
    const stderr = [];
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`Codex request timed out after ${REQUEST_TIMEOUT_MS}ms.`));
    }, REQUEST_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);

      if (code !== 0) {
        reject(new Error([
          `Codex exited with code ${code}.`,
          Buffer.concat(stderr).toString("utf8").trim(),
          Buffer.concat(stdout).toString("utf8").trim()
        ].filter(Boolean).join("\n")));
        return;
      }

      resolve();
    });

    child.stdin.end(prompt);
  });
}

function getModelArgs(model) {
  const normalized = normalizeModelLabel(model);
  if (!normalized || normalized.startsWith("gemini-")) {
    return [];
  }

  return ["--model", normalized];
}

function normalizeModelLabel(model) {
  return String(model || CODEX_MODEL)
    .replace(/\s+/g, " ")
    .trim();
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;

    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_REQUEST_BYTES) {
        const error = new Error(`Request body exceeds ${MAX_REQUEST_BYTES} bytes.`);
        error.status = 413;
        reject(error);
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function isAuthorized(request) {
  const header = String(request.headers.authorization || "");
  return header === `Bearer ${AUTH_TOKEN}`;
}

function writeJson(response, request, status, data) {
  writeCors(response, request, status, {
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(data));
}

function writeCors(response, request, status, headers = {}) {
  const origin = getAllowedOrigin(request.headers.origin);
  response.writeHead(status, {
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...headers
  });
}

function getAllowedOrigin(origin) {
  const value = String(origin || "");
  if (/^(chrome|edge|moz)-extension:\/\/[a-zA-Z0-9_-]+$/.test(value)) {
    return value;
  }

  return "";
}
