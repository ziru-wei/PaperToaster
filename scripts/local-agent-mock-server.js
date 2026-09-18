import http from "node:http";
import { createHash } from "node:crypto";
import { computePaperFingerprint, validateConversationIdentity } from "./local-agent-session-store.js";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PAPER_CHAT_LOCAL_AGENT_PORT) || 32177;
const AUTH_TOKEN = String(process.env.PAPER_CHAT_LOCAL_AGENT_TOKEN || "").trim();
const documents = new Map();
const sessions = new Map();

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    writeCors(response, request, 204);
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/models") {
    if (!isAuthorized(request)) return writeJson(response, request, 401, { error: "Unauthorized local agent request." });
    writeJson(response, request, 200, { models: [{ profile: "codex", id: "mock-codex", label: "Mock Codex", reasoningEffort: "", isProviderDefault: true }] });
    return;
  }

  const documentRef = getDocumentRefFromRequest(request);
  if (documentRef) {
    if (!isAuthorized(request)) {
      writeJson(response, request, 401, { error: "Unauthorized local agent request." });
      return;
    }
    if (!/^sha256-[a-f0-9]{64}$/.test(documentRef)) {
      writeJson(response, request, 400, { error: "Invalid document reference." });
      return;
    }
    if (request.method === "HEAD") {
      writeEmpty(response, request, documents.has(documentRef) ? 204 : 404);
      return;
    }
    if (request.method === "PUT") {
      try {
        const body = JSON.parse(await readRequestBody(request));
        const markdown = String(body?.markdown || "");
        const computed = `sha256-${createHash("sha256").update(markdown, "utf8").digest("hex")}`;
        if (computed !== documentRef) throw new Error("Document reference does not match Markdown content.");
        const created = !documents.has(documentRef);
        documents.set(documentRef, { markdown, sourceSpans: body?.sourceSpans || [] });
        writeEmpty(response, request, created ? 201 : 204);
      } catch (error) {
        writeJson(response, request, 400, { error: error.message || String(error) });
      }
      return;
    }
    if (request.method === "DELETE") {
      documents.delete(documentRef);
      writeEmpty(response, request, 204);
      return;
    }
    writeJson(response, request, 405, { error: "Method not allowed." });
    return;
  }

  if (request.method === "DELETE" && request.url === "/sessions") {
    if (!isAuthorized(request)) return writeJson(response, request, 401, { error: "Unauthorized local agent request." });
    try {
      const body = JSON.parse(await readRequestBody(request));
      if (body.version !== 1 || !Number.isSafeInteger(body.requestedAt)
        || body.requestedAt <= 0 || body.requestedAt > Date.now() + 60_000) throw new Error("Invalid session deletion request.");
      validateConversationIdentity(body.mode, body.conversationKey);
      const key = `${body.mode}\0${body.conversationKey}`;
      if (sessions.get(key)?.createdAt <= body.requestedAt) sessions.delete(key);
      writeEmpty(response, request, 204);
    } catch (error) {
      writeJson(response, request, 400, { error: error.message || String(error) });
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

  try {
    const body = JSON.parse(await readRequestBody(request));
    const profile = String(body.localAgentProfile || "codex");
    if (profile !== "codex") throw new Error("Unsupported local agent profile.");
    if (request.url === "/connection-test") {
      writeJson(response, request, 200, { profile, model: `local-agent-mock:${profile}`, text: "Local agent connection OK." });
      return;
    }
    if (body.version !== 3 || body.source !== "paper-toaster") throw new Error("Unsupported /ask contract version.");
    const allowed = new Set(["version", "source", "localAgentProfile", "model", "reasoningEffort", "systemPrompt", "mode", "question", "selectionText", "papers", "conversationKey"]);
    if (Object.keys(body).some((key) => !allowed.has(key))) throw new Error("Unexpected /ask field.");
    if (!["single-paper", "comparative-reading"].includes(body.mode)) throw new Error("Invalid reading mode.");
    validateConversationIdentity(body.mode, body.conversationKey);
    if (typeof body.question !== "string" || !body.question.trim() || body.question.length > 12000) throw new Error("Invalid question.");
    if (body.selectionText !== undefined && (typeof body.selectionText !== "string" || body.selectionText.length > 8000)) throw new Error("Invalid selected text.");
    if (body.systemPrompt !== undefined && (typeof body.systemPrompt !== "string" || body.systemPrompt.length > 20000)) throw new Error("Invalid system prompt.");
    if (!Array.isArray(body.papers) || body.papers.length < (body.mode === "single-paper" ? 1 : 2)
      || body.papers.length > (body.mode === "single-paper" ? 1 : 20)) throw new Error("Invalid paper count.");
    if (body.papers.some((paper) => !paper || Object.keys(paper).some((key) => !["title", "documentRef", "paperId", "sourceSpanCitations"].includes(key))
      || typeof paper.title !== "string" || !paper.title.trim() || paper.title.length > 500
      || !/^sha256-[a-f0-9]{64}$/.test(paper.documentRef || ""))) throw new Error("Invalid paper descriptor.");
    if (body.papers.some((paper, index) => paper.paperId !== `p${index + 1}`)) throw new Error("Paper IDs must follow selected-paper order.");
    const missingDocument = body.papers.find((paper) => !documents.has(String(paper?.documentRef || "")));
    if (missingDocument) {
      throw new Error(`Managed document ${missingDocument.documentRef || ""} was not found.`);
    }
    for (const paper of body.papers) {
      const spans = documents.get(paper.documentRef).sourceSpans;
      const citations = paper.sourceSpanCitations;
      if (!Array.isArray(citations) || citations.length !== spans.length
        || new Set(citations.map((entry) => entry.sourceSpanId)).size !== spans.length
        || spans.some((span) => !citations.some((entry) => entry.sourceSpanId === span.id))) {
        throw new Error("Citation map must cover every source span.");
      }
      if (citations.some((entry) => !new RegExp(`^${paper.paperId}-h\\d+-c\\d+$`).test(entry.citationId))) {
        throw new Error("Invalid source-span citation map.");
      }
    }

    const key = `${body.mode}\0${body.conversationKey}`;
    const fingerprint = computePaperFingerprint(body.mode, body.papers);
    const previous = sessions.get(key);
    const resumed = previous?.fingerprint === fingerprint;
    const state = resumed ? previous : { createdAt: Date.now(), fingerprint, turns: 0 };
    state.turns += 1;
    sessions.set(key, state);
    writeJson(response, request, 200, {
      profile,
      model: `local-agent-mock:${profile}`,
      sessionState: resumed ? "resumed" : "created",
      text: [
        "Local agent mock response.",
        "",
        `Agent session: ${resumed ? "resumed" : "created"}; turn ${state.turns}`,
        `CLI profile: ${profile}`,
        `Papers: ${body.papers.length}`,
        `Paper files available: ${body.papers.length}`,
        `Question characters: ${body.question.length}`,
        `Selection characters: ${String(body.selectionText || "").length}`
      ].join("\n")
    });
  } catch (error) {
    writeJson(response, request, 400, {
      error: error.message || String(error)
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Local agent mock bridge listening at http://${HOST}:${PORT}/ask`);
  console.log(AUTH_TOKEN ? "Bearer token required." : "Bearer token not required by mock bridge.");
});

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function isAuthorized(request) {
  if (!AUTH_TOKEN) {
    return true;
  }

  const header = String(request.headers.authorization || "");
  return header === `Bearer ${AUTH_TOKEN}`;
}

function writeJson(response, request, status, data) {
  writeCors(response, request, status, {
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(data));
}

function writeEmpty(response, request, status) {
  writeCors(response, request, status);
  response.end();
}

function getDocumentRefFromRequest(request) {
  const pathname = new URL(request.url || "/", "http://127.0.0.1").pathname;
  const match = pathname.match(/^\/documents\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCors(response, request, status, headers = {}) {
  const origin = getAllowedOrigin(request.headers.origin);
  response.writeHead(status, {
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "HEAD, PUT, DELETE, POST, OPTIONS",
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
