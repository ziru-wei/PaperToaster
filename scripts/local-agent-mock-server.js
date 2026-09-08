import http from "node:http";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PAPER_CHAT_LOCAL_AGENT_PORT) || 32177;
const AUTH_TOKEN = String(process.env.PAPER_CHAT_LOCAL_AGENT_TOKEN || "").trim();

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
    const prompt = String(body.prompt || "");
    const title = body.contextPack?.paper?.title || "Untitled paper";
    const selection = body.contextPack?.selection?.text || "";
    const retrievedCount = body.contextPack?.context?.retrieved?.length || 0;
    const profile = String(body.localAgentProfile || "codex");

    writeJson(response, request, 200, {
      model: `local-agent-mock:${profile}`,
      text: [
        "Local agent mock response.",
        "",
        `CLI profile: ${profile}`,
        `Paper: ${title}`,
        `Prompt characters: ${prompt.length}`,
        `Selection characters: ${String(selection).length}`,
        `Retrieved context chunks: ${retrievedCount}`
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
