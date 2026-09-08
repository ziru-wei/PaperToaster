import http from "node:http";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PAPER_CHAT_LOCAL_AGENT_PORT) || 32177;
const CODEX_BIN = process.env.PAPER_CHAT_CODEX_BIN || "codex";
const ANTIGRAVITY_BIN = process.env.PAPER_CHAT_ANTIGRAVITY_BIN || "agy";
const AGENT_WORKDIR = process.env.PAPER_CHAT_LOCAL_AGENT_WORKDIR
  || process.env.PAPER_CHAT_CODEX_WORKDIR
  || os.tmpdir();
const CODEX_MODEL = process.env.PAPER_CHAT_CODEX_MODEL || "";
const ANTIGRAVITY_MODEL = process.env.PAPER_CHAT_ANTIGRAVITY_MODEL || "";
const CODEX_MODEL_CACHE = process.env.PAPER_CHAT_CODEX_MODEL_CACHE
  || path.join(os.homedir(), ".codex", "models_cache.json");
const AUTH_TOKEN = String(process.env.PAPER_CHAT_LOCAL_AGENT_TOKEN || "").trim();
const REQUEST_TIMEOUT_MS = Number(process.env.PAPER_CHAT_LOCAL_AGENT_TIMEOUT_MS)
  || Number(process.env.PAPER_CHAT_CODEX_TIMEOUT_MS)
  || 180000;
const MAX_REQUEST_BYTES = Number(process.env.PAPER_CHAT_MAX_REQUEST_BYTES) || 2_000_000;
const PROFILE_CODEX = "codex";
const PROFILE_ANTIGRAVITY = "antigravity";
let modelCatalogCache = null;
let modelCatalogCachedAt = 0;

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

  if (request.method === "GET" && request.url === "/models") {
    if (!isAuthorized(request)) {
      writeJson(response, request, 401, { error: "Unauthorized local agent request." });
      return;
    }
    try {
      writeJson(response, request, 200, { models: await listAvailableModels() });
    } catch (error) {
      writeJson(response, request, 500, { error: error.message || String(error) });
    }
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
    const profile = normalizeProfile(body?.localAgentProfile);
    const prompt = buildAgentPrompt(body);
    const result = profile === PROFILE_ANTIGRAVITY
      ? await runAntigravity(prompt, body)
      : await runCodex(prompt, body);
    writeJson(response, request, 200, {
      profile,
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
  console.log(`Paper Toaster local agent bridge listening at http://${HOST}:${PORT}/ask`);
  console.log(`Codex: ${CODEX_BIN}; Antigravity: ${ANTIGRAVITY_BIN}; workdir: ${AGENT_WORKDIR}`);
});

function buildAgentPrompt(body) {
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

async function listAvailableModels() {
  if (modelCatalogCache && Date.now() - modelCatalogCachedAt < 60_000) {
    return modelCatalogCache;
  }
  const [codexModels, antigravityModels] = await Promise.all([
    listCodexModels(),
    listAntigravityModels()
  ]);
  modelCatalogCache = [...codexModels, ...antigravityModels];
  modelCatalogCachedAt = Date.now();
  return modelCatalogCache;
}

async function listCodexModels() {
  const raw = JSON.parse(await readFile(CODEX_MODEL_CACHE, "utf8"));
  return (Array.isArray(raw?.models) ? raw.models : [])
    .filter((model) => model?.slug && model?.visibility !== "hide")
    .sort((a, b) => Number(a.priority || 999) - Number(b.priority || 999))
    .flatMap((model) => {
      const efforts = Array.isArray(model.supported_reasoning_levels)
        ? model.supported_reasoning_levels.map((item) => String(item?.effort || "").trim()).filter(Boolean)
        : [];
      const levels = efforts.length ? efforts : [""];
      return levels.map((reasoningEffort) => ({
        profile: PROFILE_CODEX,
        id: String(model.slug),
        label: `${String(model.display_name || model.slug)}${reasoningEffort ? ` · ${formatEffort(reasoningEffort)}` : ""}`,
        description: String(model.description || ""),
        reasoningEffort,
        isProviderDefault: Boolean(model.is_default) && reasoningEffort === String(model.default_reasoning_level || "")
      }));
    });
}

async function listAntigravityModels() {
  const output = await spawnForText(ANTIGRAVITY_BIN, ["models"], "", "Antigravity model discovery");
  return output.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("Fetching "))
    .map((line) => {
      const [id, ...labelParts] = line.split(/\t+/);
      return {
        profile: PROFILE_ANTIGRAVITY,
        id: String(id || "").trim(),
        label: labelParts.join(" ").trim() || String(id || "").trim(),
        description: "",
        reasoningEffort: "",
        isProviderDefault: false
      };
    })
    .filter((model) => model.id);
}

function formatEffort(effort) {
  return String(effort).charAt(0).toUpperCase() + String(effort).slice(1);
}

function formatAnsweredByModel(model, reasoningEffort) {
  const effort = String(reasoningEffort || "").trim();
  return effort ? `${model} · ${formatEffort(effort)}` : model;
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
      model: formatAnsweredByModel(
        normalizeModelLabel(body?.model, CODEX_MODEL) || "codex",
        body?.reasoningEffort
      ),
      text
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function runAntigravity(prompt, body) {
  const model = normalizeModelLabel(body?.model, ANTIGRAVITY_MODEL);
  const args = [
    `--print=${prompt}`,
    "--output-format",
    "text",
    "--disable-slash-commands",
    "--sandbox",
    ...(model ? ["--model", model] : [])
  ];
  const result = await spawnForText(ANTIGRAVITY_BIN, args, "", "Antigravity");
  return {
    model: model || "antigravity",
    text: result
  };
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
      ...getReasoningEffortArgs(body?.reasoningEffort),
      "-"
    ];
    const child = spawn(CODEX_BIN, args, {
      cwd: AGENT_WORKDIR,
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
  const normalized = normalizeModelLabel(model, CODEX_MODEL);
  if (!normalized) {
    return [];
  }

  return ["--model", normalized];
}

function getReasoningEffortArgs(reasoningEffort) {
  const value = String(reasoningEffort || "").trim().toLowerCase();
  if (!value) return [];
  return ["-c", `model_reasoning_effort=${JSON.stringify(value)}`];
}

function normalizeModelLabel(model, fallback = "") {
  return String(model || fallback)
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeProfile(profile) {
  const value = String(profile || PROFILE_CODEX).trim().toLowerCase();
  if (value === PROFILE_CODEX || value === PROFILE_ANTIGRAVITY) {
    return value;
  }
  const error = new Error(`Unsupported local agent profile: ${value || "empty"}.`);
  error.status = 400;
  throw error;
}

function spawnForText(command, args, input, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: AGENT_WORKDIR,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["pipe", "pipe", "pipe"]
    });
    const stdout = [];
    const stderr = [];
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`${label} request timed out after ${REQUEST_TIMEOUT_MS}ms.`));
    }, REQUEST_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const output = Buffer.concat(stdout).toString("utf8").trim();
      if (code !== 0) {
        reject(new Error([
          `${label} exited with code ${code}.`,
          Buffer.concat(stderr).toString("utf8").trim(),
          output
        ].filter(Boolean).join("\n")));
        return;
      }
      if (!output) {
        reject(new Error(`${label} returned no response.`));
        return;
      }
      resolve(output);
    });
    child.stdin.end(input);
  });
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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
