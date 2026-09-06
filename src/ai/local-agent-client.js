export async function generateLocalAgentText({
  endpoint,
  authToken,
  model,
  prompt,
  systemPrompt,
  contextPack,
  conversationMessages = [],
  signal
}) {
  const normalizedEndpoint = String(endpoint || "").trim();
  const normalizedAuthToken = String(authToken || "").trim();
  const normalizedPrompt = String(prompt || "").trim();

  if (!normalizedEndpoint) {
    throw new Error("Local agent endpoint is not configured. Open extension Options to add it.");
  }

  if (!normalizedPrompt) {
    throw new Error("No prompt was provided for the local agent.");
  }

  if (!normalizedAuthToken) {
    throw new Error("Local agent token is not configured. Open extension Options to add it.");
  }

  const response = await fetch(normalizedEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${normalizedAuthToken}`
    },
    body: JSON.stringify({
      version: 1,
      source: "pdf-ai-inspector",
      model: String(model || "").trim(),
      prompt: normalizedPrompt,
      systemPrompt: String(systemPrompt || "").trim(),
      contextPack,
      conversationMessages
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
