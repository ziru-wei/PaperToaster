import http from "node:http";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { loadPaperReadingSkillPrompt } from "./paper-reading-skill.js";
import {
  cleanupStaleRequestDirectories,
  deleteManagedDocument,
  getManagedDocumentStatus,
  materializeRequestDocuments,
  putManagedDocument,
  removeRequestDocuments
} from "./local-agent-document-store.js";

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
const MAX_REQUEST_BYTES = Number(process.env.PAPER_CHAT_MAX_REQUEST_BYTES) || 10_000_000;
const MAX_DOCUMENT_BYTES = Number(process.env.PAPER_CHAT_MAX_DOCUMENT_BYTES) || 25_000_000;
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

  const documentRef = getDocumentRefFromRequest(request);
  if (documentRef) {
    if (!isAuthorized(request)) {
      writeJson(response, request, 401, { error: "Unauthorized local agent request." });
      return;
    }
    try {
      if (request.method === "HEAD") {
        const status = await getManagedDocumentStatus(AGENT_WORKDIR, documentRef, { touch: true });
        writeEmpty(response, request, status.exists ? 204 : 404);
        return;
      }
      if (request.method === "PUT") {
        const body = JSON.parse(await readRequestBody(request, MAX_DOCUMENT_BYTES));
        const result = await putManagedDocument({
          agentWorkdir: AGENT_WORKDIR,
          documentRef,
          markdown: body?.markdown,
          sourceSpans: body?.sourceSpans
        });
        writeEmpty(response, request, result.created ? 201 : 204);
        return;
      }
      if (request.method === "DELETE") {
        await deleteManagedDocument(AGENT_WORKDIR, documentRef);
        writeEmpty(response, request, 204);
        return;
      }
      writeJson(response, request, 405, { error: "Method not allowed." });
    } catch (error) {
      writeJson(response, request, error.status || 500, { error: error.message || String(error) });
    }
    return;
  }

  if (request.method !== "POST" || !["/ask", "/connection-test"].includes(request.url)) {
    writeJson(response, request, 404, { error: "Not found" });
    return;
  }

  if (!isAuthorized(request)) {
    writeJson(response, request, 401, { error: "Unauthorized local agent request." });
    return;
  }

  const requestAbort = new AbortController();
  response.on("close", () => {
    if (!response.writableEnded) requestAbort.abort();
  });
  try {
    const body = JSON.parse(await readRequestBody(request));
    const profile = normalizeProfile(body?.localAgentProfile);
    if (request.url === "/connection-test") {
      const prompt = "Reply with exactly: Local agent connection OK.";
      const result = profile === PROFILE_ANTIGRAVITY
        ? await runAntigravity(prompt, body, requestAbort.signal)
        : await runCodex(prompt, body, requestAbort.signal);
      if (!response.destroyed) writeJson(response, request, 200, { profile, model: result.model, text: result.text });
      return;
    }
    validateAskBody(body);
    let materialized = null;
    let result;
    try {
      materialized = await materializeRequestDocuments({
        agentWorkdir: AGENT_WORKDIR,
        papers: body.papers
      });
      requestAbort.signal.throwIfAborted();
      const prompt = await buildFileReadingPrompt(body, materialized.files);
      result = profile === PROFILE_ANTIGRAVITY
        ? await runAntigravity(prompt, body, requestAbort.signal)
        : await runCodex(prompt, body, requestAbort.signal);
    } finally {
      await removeRequestDocuments(materialized?.requestDirectory);
    }
    if (!response.destroyed) writeJson(response, request, 200, { profile, model: result.model, text: result.text });
  } catch (error) {
    if (!response.destroyed) writeJson(response, request, error.status || 500, {
      error: error.message || String(error)
    });
  }
});

try {
  const removed = await cleanupStaleRequestDirectories(AGENT_WORKDIR);
  if (removed) console.log(`[Paper Toaster] Removed ${removed} stale request director${removed === 1 ? "y" : "ies"}.`);
} catch (error) {
  console.warn(`[Paper Toaster] Stale request cleanup failed: ${error.message || String(error)}`);
}

server.listen(PORT, HOST, () => {
  console.log(`Paper Toaster local agent bridge listening at http://${HOST}:${PORT}/ask`);
  console.log(`Codex: ${CODEX_BIN}; Antigravity: ${ANTIGRAVITY_BIN}; workdir: ${AGENT_WORKDIR}`);
});

async function buildFileReadingPrompt(body, files) {
  const skillPrompt = await loadPaperReadingSkillPrompt({ mode: body.mode });
  return [
    "You are serving as paper reading assistant.",
    "Return only the answer to the user's question.",
    "",
    skillPrompt,
    "",
    ...(body.systemPrompt ? ["Additional answer instructions:", body.systemPrompt, ""] : []),
    `Mode: ${body.mode}`,
    ...files.flatMap((file) => [`Paper title: ${JSON.stringify(file.title)}`, `Paper file: ${file.relativePath}`]),
    ...(body.selectionText ? [`Selected text: ${body.selectionText}`] : []),
    `Current question: ${body.question}`
  ].join("\n");
}

function validateAskBody(body) {
  const invalid = (message) => {
    const error = new Error(message);
    error.status = 400;
    throw error;
  };
  if (!body || body.version !== 2 || body.source !== "paper-toaster") invalid("Unsupported /ask contract version.");
  const allowed = new Set(["version", "source", "localAgentProfile", "model", "reasoningEffort", "systemPrompt", "mode", "question", "selectionText", "papers"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) invalid("Unexpected /ask field.");
  if (!["single-paper", "comparative-reading"].includes(body.mode)) invalid("Invalid reading mode.");
  if (typeof body.question !== "string" || !body.question.trim() || body.question.length > 12000) invalid("Question must be 1–12000 characters.");
  if (body.selectionText !== undefined && (typeof body.selectionText !== "string" || body.selectionText.length > 8000)) invalid("Selected text is too long.");
  if (body.systemPrompt !== undefined && (typeof body.systemPrompt !== "string" || body.systemPrompt.length > 20000)) invalid("System prompt is too long.");
  if (!Array.isArray(body.papers) || body.papers.length < (body.mode === "single-paper" ? 1 : 2)
    || body.papers.length > (body.mode === "single-paper" ? 1 : 20)) invalid("Invalid paper count.");
  body.papers.forEach((paper, index) => {
    if (!paper || Object.keys(paper).some((key) => !["title", "documentRef", "paperId", "sourceSpanCitations"].includes(key))) invalid("Unexpected paper field.");
    if (typeof paper.title !== "string" || !paper.title.trim() || paper.title.length > 500) invalid("Invalid paper title.");
    if (paper.paperId !== `p${index + 1}`) invalid("Paper IDs must follow selected-paper order.");
    if (!/^sha256-[a-f0-9]{64}$/.test(paper.documentRef || "")) invalid("Invalid managed document reference.");
    if (!Array.isArray(paper.sourceSpanCitations)) invalid("Missing source-span citation map.");
  });
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

async function runCodex(prompt, body, signal) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "paper-chat-codex-"));
  const outputFile = path.join(tempDir, "answer.txt");

  try {
    await spawnCodex(prompt, outputFile, body, signal);
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

async function runAntigravity(prompt, body, signal) {
  const model = normalizeModelLabel(body?.model, ANTIGRAVITY_MODEL);
  const args = [
    `--print=${prompt}`,
    "--output-format",
    "text",
    "--disable-slash-commands",
    "--sandbox",
    ...(model ? ["--model", model] : [])
  ];
  const result = await spawnForText(ANTIGRAVITY_BIN, args, "", "Antigravity", signal);
  return {
    model: model || "antigravity",
    text: result
  };
}

function spawnCodex(prompt, outputFile, body, signal) {
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
      stdio: ["pipe", "pipe", "pipe"],
      signal
    });
    const stdout = [];
    const stderr = [];
    let settled = false;
    let terminationError = null;
    let forceKill = null;
    const timeout = setTimeout(() => {
      if (settled) return;
      terminationError = new Error(`Codex request timed out after ${REQUEST_TIMEOUT_MS}ms.`);
      child.kill("SIGTERM");
      forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
    }, REQUEST_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      if (settled) {
        return;
      }
      if (error.name === "AbortError") {
        terminationError = error;
        forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
        return;
      }
      settled = true;
      clearTimeout(timeout);
      clearTimeout(forceKill);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      clearTimeout(forceKill);
      if (terminationError) {
        reject(terminationError);
        return;
      }

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

function spawnForText(command, args, input, label, signal) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: AGENT_WORKDIR,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["pipe", "pipe", "pipe"],
      signal
    });
    const stdout = [];
    const stderr = [];
    let settled = false;
    let terminationError = null;
    let forceKill = null;
    const timeout = setTimeout(() => {
      if (settled) return;
      terminationError = new Error(`${label} request timed out after ${REQUEST_TIMEOUT_MS}ms.`);
      child.kill("SIGTERM");
      forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
    }, REQUEST_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", (error) => {
      if (settled) return;
      if (error.name === "AbortError") {
        terminationError = error;
        forceKill = setTimeout(() => child.kill("SIGKILL"), 5000);
        return;
      }
      settled = true;
      clearTimeout(timeout);
      clearTimeout(forceKill);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      clearTimeout(forceKill);
      if (terminationError) {
        reject(terminationError);
        return;
      }
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

function readRequestBody(request, maxBytes = MAX_REQUEST_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;

    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        const error = new Error(`Request body exceeds ${maxBytes} bytes.`);
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

function getDocumentRefFromRequest(request) {
  const pathname = new URL(request.url || "/", "http://127.0.0.1").pathname;
  const match = pathname.match(/^\/documents\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function writeEmpty(response, request, status) {
  writeCors(response, request, status);
  response.end();
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
    "Access-Control-Allow-Methods": "GET, HEAD, PUT, DELETE, POST, OPTIONS",
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
