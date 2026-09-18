import { flushPendingLocalAgentSessionDeletes, hasPendingLocalAgentSessionDeletion } from "./local-agent-session-client.js";

export async function generateLocalAgentText({
  endpoint,
  authToken,
  localAgentProfile,
  model,
  reasoningEffort,
  systemPrompt,
  mode,
  question,
  selectionText = "",
  papers,
  conversationKey,
  signal
}) {
  const normalizedEndpoint = String(endpoint || "").trim();
  const normalizedAuthToken = String(authToken || "").trim();
  const normalizedQuestion = String(question || "").trim();

  if (!normalizedEndpoint) {
    throw new Error("Local agent endpoint is not configured. Open extension Options to add it.");
  }

  if (!normalizedQuestion) {
    throw new Error("No question was provided for the local agent.");
  }

  if (!normalizedAuthToken) {
    throw new Error("Local agent token is not configured. Open extension Options to add it.");
  }
  if (!String(conversationKey || "").trim()) {
    throw new Error("Local Agent conversation ID is missing.");
  }

  await flushPendingLocalAgentSessionDeletes().catch(() => {});
  if (await hasPendingLocalAgentSessionDeletion({ mode, conversationKey: String(conversationKey).trim() })) {
    throw new Error("The previous Local Agent session is still pending deletion. Check the bridge and retry.");
  }

  const response = await fetch(normalizedEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${normalizedAuthToken}`
    },
    body: JSON.stringify({
      version: 3,
      source: "paper-toaster",
      localAgentProfile: String(localAgentProfile || "").trim(),
      model: String(model || "").trim(),
      reasoningEffort: String(reasoningEffort || "").trim(),
      systemPrompt: String(systemPrompt || "").trim(),
      mode,
      question: normalizedQuestion,
      selectionText: String(selectionText || ""),
      papers,
      conversationKey: String(conversationKey).trim()
    }),
    signal
  });

  const data = await readLocalAgentResponse(response);
  if (!response.ok) {
    throw new Error(formatLocalAgentError(data, response));
  }

  const text = extractLocalAgentText(data);
  if (!text) {
    throw new Error("Local agent returned no text.");
  }

  return {
    text,
    model: extractLocalAgentModel(data) || "local-agent",
    raw: data
  };
}

export async function testLocalAgentConnection({ endpoint, authToken, localAgentProfile, model, reasoningEffort, signal }) {
  const url = new URL(String(endpoint || "").trim());
  if (!/\/ask\/?$/.test(url.pathname)) throw new Error("Local agent endpoint must end with /ask.");
  url.pathname = url.pathname.replace(/\/ask\/?$/, "/connection-test");
  url.search = "";
  url.hash = "";
  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${String(authToken || "").trim()}`
    },
    body: JSON.stringify({
      localAgentProfile: String(localAgentProfile || "").trim(),
      model: String(model || "").trim(),
      reasoningEffort: String(reasoningEffort || "").trim()
    }),
    signal
  });
  const data = await readLocalAgentResponse(response);
  if (!response.ok) throw new Error(formatLocalAgentError(data, response));
  void flushPendingLocalAgentSessionDeletes().catch(() => {});
  return extractLocalAgentText(data);
}

export async function listLocalAgentModels({ endpoint, authToken, signal }) {
  const url = new URL(String(endpoint || "").trim());
  url.pathname = url.pathname.replace(/\/ask\/?$/, "/models");
  url.search = "";
  url.hash = "";
  const response = await fetch(url.href, {
    headers: { "Authorization": `Bearer ${String(authToken || "").trim()}` },
    signal
  });
  const data = await readLocalAgentResponse(response);
  if (!response.ok) {
    throw new Error(formatLocalAgentError(data, response));
  }
  void flushPendingLocalAgentSessionDeletes().catch(() => {});
  return (Array.isArray(data?.models) ? data.models : []).filter((model) => model?.id && model.profile === "codex");
}

async function readLocalAgentResponse(response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  if (!text) {
    return null;
  }

  if (!contentType.toLowerCase().includes("application/json")) {
    return { text };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function extractLocalAgentText(data) {
  if (typeof data === "string") {
    return data.trim();
  }

  return [
    data?.text,
    data?.answer,
    data?.content,
    data?.message?.content,
    data?.choices?.[0]?.message?.content,
    data?.choices?.[0]?.text
  ].find((value) => String(value || "").trim())?.trim() || "";
}

function extractLocalAgentModel(data) {
  return String(data?.model || data?.provider || "").trim();
}

function formatLocalAgentError(data, response) {
  const message = data?.error?.message || data?.error || data?.message || response.statusText || "Local agent request failed.";
  return `Local agent request failed: HTTP ${response.status} ${message}`.trim();
}
