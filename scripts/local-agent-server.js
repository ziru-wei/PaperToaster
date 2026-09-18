import http from "node:http";
import os from "node:os";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { loadPaperReadingSkillPrompt } from "./paper-reading-skill.js";
import { deleteCodexSession, runCodex } from "./local-agent-codex-runner.js";
import {
  cleanupSessionTempFiles,
  computePaperFingerprint,
  deleteSessionRecord,
  getSessionDirectory,
  hashText,
  readSessionRecord,
  validateConversationIdentity,
  withConversationLock,
  writeSessionRecord
} from "./local-agent-session-store.js";
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
const AGENT_WORKDIR = process.env.PAPER_CHAT_LOCAL_AGENT_WORKDIR
  || process.env.PAPER_CHAT_CODEX_WORKDIR
  || os.tmpdir();
const CODEX_MODEL = process.env.PAPER_CHAT_CODEX_MODEL || "";
const SESSION_DIR = getSessionDirectory();
const CODEX_MODEL_CACHE = process.env.PAPER_CHAT_CODEX_MODEL_CACHE
  || path.join(os.homedir(), ".codex", "models_cache.json");
const AUTH_TOKEN = String(process.env.PAPER_CHAT_LOCAL_AGENT_TOKEN || "").trim();
const REQUEST_TIMEOUT_MS = Number(process.env.PAPER_CHAT_LOCAL_AGENT_TIMEOUT_MS)
  || Number(process.env.PAPER_CHAT_CODEX_TIMEOUT_MS)
  || 180000;
const MAX_REQUEST_BYTES = Number(process.env.PAPER_CHAT_MAX_REQUEST_BYTES) || 10_000_000;
const MAX_DOCUMENT_BYTES = Number(process.env.PAPER_CHAT_MAX_DOCUMENT_BYTES) || 25_000_000;
const PROFILE_CODEX = "codex";
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

  if (request.method === "DELETE" && request.url === "/sessions") {
    if (!isAuthorized(request)) {
      writeJson(response, request, 401, { error: "Unauthorized local agent request." });
      return;
    }
    try {
      const body = JSON.parse(await readRequestBody(request));
      if (body?.version !== 1 || !Number.isSafeInteger(body.requestedAt) || body.requestedAt <= 0
        || body.requestedAt > Date.now() + 60_000
        || Object.keys(body).some((key) => !["version", "mode", "conversationKey", "requestedAt"].includes(key))) {
        throw httpError("Invalid session deletion request.", 400);
      }
      validateConversationIdentity(body.mode, body.conversationKey);
      await withConversationLock(body.mode, body.conversationKey, async () => {
        const record = await readSessionRecord(SESSION_DIR, body.mode, body.conversationKey);
        if (record && record.createdAt <= body.requestedAt) await retireSession(record);
      });
      writeEmpty(response, request, 204);
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
      const result = await callCodex(prompt, body, requestAbort.signal, { ephemeral: true });
      if (!response.destroyed) writeJson(response, request, 200, { profile, model: result.model, text: result.text });
      return;
    }
    validateAskBody(body);
    await withConversationLock(body.mode, body.conversationKey, async () => {
      requestAbort.signal.throwIfAborted();
      const result = await runTrackedAsk(body, requestAbort.signal, response);
      if (response.destroyed) {
        const record = await readSessionRecord(SESSION_DIR, body.mode, body.conversationKey);
        if (record) await retireSession(record);
        return;
      }
      writeJson(response, request, 200, { profile, model: result.model, text: result.text });
    });
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
try {
  await cleanupSessionTempFiles(SESSION_DIR);
} catch (error) {
  console.error(`[Paper Toaster] Session directory unavailable: ${error.message || String(error)}`);
  process.exit(1);
}

server.listen(PORT, HOST, () => {
  console.log(`Paper Toaster local agent bridge listening at http://${HOST}:${PORT}/ask`);
  console.log(`Codex: ${CODEX_BIN}; workdir: ${AGENT_WORKDIR}; sessions: ${SESSION_DIR}`);
});

async function runTrackedAsk(body, signal, response) {
  const { mode, conversationKey } = body;
  const fingerprint = computePaperFingerprint(mode, body.papers);
  const skillPrompt = await loadPaperReadingSkillPrompt({ mode });
  const skillHash = hashText(skillPrompt);
  const systemPromptHash = hashText(body.systemPrompt || "");
  let record = await readSessionRecord(SESSION_DIR, mode, conversationKey);
  if (record && (record.paperFingerprint !== fingerprint || record.skillHash !== skillHash)) {
    await retireSession(record);
    record = null;
  }
  let materialized = null;
  try {
    materialized = await materializeRequestDocuments({ agentWorkdir: AGENT_WORKDIR, papers: body.papers });
    signal.throwIfAborted();
    const prompt = record
      ? buildResumePrompt(body, materialized.files, record.systemPromptHash !== systemPromptHash)
      : buildFileReadingPrompt(body, materialized.files, skillPrompt);
    let result;
    try {
      result = await callCodex(prompt, body, signal, { agentSessionId: record?.agentSessionId || "" });
      if (response.destroyed || signal.aborted) throw new Error("Client disconnected before the answer was delivered.");
      const now = Math.max(Date.now(), record?.createdAt || 0);
      await writeSessionRecord(SESSION_DIR, {
        version: 1, mode, conversationKey,
        agentSessionId: result.agentSessionId,
        paperFingerprint: fingerprint, skillHash, systemPromptHash,
        createdAt: record?.createdAt || now,
        lastUsedAt: now
      });
      return result;
    } catch (error) {
      if (error.cliStarted || result) {
        await deleteSessionRecord(SESSION_DIR, mode, conversationKey);
        const ids = new Set([error.startedSessionId, result?.agentSessionId, record?.agentSessionId].filter(Boolean));
        for (const id of ids) {
          await deleteCodexSession(id, { binary: CODEX_BIN, cwd: AGENT_WORKDIR }).catch((cleanupError) => {
            console.warn(`[Paper Toaster] Failed to delete an invalidated Codex session: ${cleanupError.message || cleanupError}`);
          });
        }
      }
      throw error;
    }
  } finally {
    await removeRequestDocuments(materialized?.requestDirectory);
  }
}

async function retireSession(record) {
  await deleteCodexSession(record.agentSessionId, { binary: CODEX_BIN, cwd: AGENT_WORKDIR });
  await deleteSessionRecord(SESSION_DIR, record.mode, record.conversationKey);
}

async function callCodex(prompt, body, signal, { agentSessionId = "", ephemeral = false } = {}) {
  const result = await runCodex({
    prompt, agentSessionId, ephemeral,
    model: body?.model || CODEX_MODEL,
    reasoningEffort: body?.reasoningEffort,
    signal, binary: CODEX_BIN, cwd: AGENT_WORKDIR, timeoutMs: REQUEST_TIMEOUT_MS
  });
  return {
    ...result,
    model: formatAnsweredByModel(normalizeModelLabel(body?.model, CODEX_MODEL) || "codex", body?.reasoningEffort)
  };
}

function buildFileReadingPrompt(body, files, skillPrompt) {
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

function buildResumePrompt(body, files, systemPromptChanged) {
  return [
    "Continue this paper-reading conversation. Return only the answer to the current question.",
    "Read the current paper file(s) below; prior request-scoped paths no longer exist. Use their citation IDs when citing evidence.",
    ...(systemPromptChanged ? ["Updated additional answer instructions (supersede all prior additional answer instructions):", body.systemPrompt || "(none)"] : []),
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
  if (!body || body.version !== 3 || body.source !== "paper-toaster") invalid("Unsupported /ask contract version.");
  const allowed = new Set(["version", "source", "localAgentProfile", "model", "reasoningEffort", "systemPrompt", "mode", "question", "selectionText", "papers", "conversationKey"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) invalid("Unexpected /ask field.");
  if (!["single-paper", "comparative-reading"].includes(body.mode)) invalid("Invalid reading mode.");
  validateConversationIdentity(body.mode, body.conversationKey);
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
  modelCatalogCache = await listCodexModels();
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

function formatEffort(effort) {
  return String(effort).charAt(0).toUpperCase() + String(effort).slice(1);
}

function formatAnsweredByModel(model, reasoningEffort) {
  const effort = String(reasoningEffort || "").trim();
  return effort ? `${model} · ${formatEffort(effort)}` : model;
}

function normalizeModelLabel(model, fallback = "") {
  return String(model || fallback)
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeProfile(profile) {
  const value = String(profile || PROFILE_CODEX).trim().toLowerCase();
  if (value === PROFILE_CODEX) {
    return value;
  }
  const error = new Error(`Unsupported local agent profile: ${value || "empty"}.`);
  error.status = 400;
  throw error;
}

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
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
