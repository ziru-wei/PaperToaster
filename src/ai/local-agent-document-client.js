const ensurePromises = new Map();

export async function createAgentDocumentRef(markdown) {
  const bytes = new TextEncoder().encode(String(markdown || ""));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sha256-${hex}`;
}

export function getAgentDocumentEndpoint(askEndpoint, documentRef) {
  const url = new URL(String(askEndpoint || "").trim());
  const nextPathname = url.pathname.replace(/\/ask\/?$/, `/documents/${encodeURIComponent(documentRef)}`);
  if (nextPathname === url.pathname) {
    throw new Error("Local agent endpoint must end with /ask.");
  }
  url.pathname = nextPathname;
  url.search = "";
  url.hash = "";
  return url.href;
}

export async function getAgentDocumentStatus({ endpoint, authToken, documentRef, signal }) {
  const response = await fetch(getAgentDocumentEndpoint(endpoint, documentRef), {
    method: "HEAD",
    headers: createHeaders(authToken, false),
    signal
  });
  if (response.status === 204) return "available";
  if (response.status === 404) return "missing";
  throw new Error(`Local agent document status failed: HTTP ${response.status} ${response.statusText}`.trim());
}

export async function uploadAgentDocument({ endpoint, authToken, document, signal }) {
  const documentRef = String(document?.agentDocumentRef || "");
  const response = await fetch(getAgentDocumentEndpoint(endpoint, documentRef), {
    method: "PUT",
    headers: createHeaders(authToken, true),
    body: JSON.stringify({
      version: 1,
      markdown: String(document?.markdown || ""),
      sourceSpans: Array.isArray(document?.sourceSpans) ? document.sourceSpans : []
    }),
    signal
  });
  if (response.status !== 201 && response.status !== 204) {
    throw new Error(`Local agent document upload failed: HTTP ${response.status} ${await readError(response)}`.trim());
  }
  return documentRef;
}

export async function ensureAgentDocument({ endpoint, authToken, document, signal }) {
  const documentRef = String(document?.agentDocumentRef || "");
  if (!documentRef) throw new Error("Paper has no local agent document reference.");
  const expectedRef = await createAgentDocumentRef(document?.markdown || "");
  if (expectedRef !== documentRef) throw new Error("Paper Markdown does not match its local agent document reference.");
  const key = `${String(endpoint || "")}\n${documentRef}`;
  if (!ensurePromises.has(key)) {
    ensurePromises.set(key, (async () => {
      const status = await getAgentDocumentStatus({ endpoint, authToken, documentRef, signal });
      if (status === "missing") {
        await uploadAgentDocument({ endpoint, authToken, document, signal });
      }
      return documentRef;
    })().finally(() => ensurePromises.delete(key)));
  }
  return ensurePromises.get(key);
}

export async function deleteAgentDocument({ endpoint, authToken, documentRef, signal }) {
  const response = await fetch(getAgentDocumentEndpoint(endpoint, documentRef), {
    method: "DELETE",
    headers: createHeaders(authToken, false),
    signal
  });
  if (response.status !== 204) {
    throw new Error(`Local agent document deletion failed: HTTP ${response.status} ${await readError(response)}`.trim());
  }
}

function createHeaders(authToken, includeContentType) {
  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    "Authorization": `Bearer ${String(authToken || "").trim()}`
  };
}

async function readError(response) {
  try {
    const body = await response.json();
    return body?.error || response.statusText;
  } catch {
    return response.statusText;
  }
}
