const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function generateGeminiText({ apiKey, model, prompt, signal }) {
  const normalizedApiKey = String(apiKey || "").trim();
  const normalizedModel = normalizeGeminiModel(model);
  const normalizedPrompt = String(prompt || "").trim();

  if (!normalizedApiKey) {
    throw new Error("Gemini API key is not configured. Open extension Options to add it.");
  }

  if (!normalizedPrompt) {
    throw new Error("No prompt was provided for Gemini.");
  }

  const response = await fetch(`${GEMINI_API_BASE}/${normalizedModel}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": normalizedApiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: normalizedPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1200
      }
    }),
    signal
  });

  const data = await readJsonResponse(response);
  if (!response.ok) {
    throw new Error(formatGeminiError(data, response));
  }

  const text = extractGeminiText(data);
  if (!text) {
    throw new Error("Gemini returned no text.");
  }

  return {
    text,
    model: normalizedModel.replace(/^models\//, ""),
    raw: data
  };
}

function normalizeGeminiModel(model) {
  const value = String(model || "gemini-3.7-flash").trim();
  if (value.startsWith("models/")) {
    return value;
  }

  return `models/${value}`;
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: text } };
  }
}

function extractGeminiText(data) {
  return data?.candidates
    ?.flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("")
    .trim() || "";
}

function formatGeminiError(data, response) {
  const message = data?.error?.message || response.statusText || "Gemini request failed.";
  return `Gemini request failed: HTTP ${response.status} ${message}`.trim();
}
