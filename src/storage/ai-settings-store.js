export const AI_SETTINGS_KEY = "aiSettingsV1";
export const AI_PROVIDER_GEMINI = "gemini";
export const AI_PROVIDER_LOCAL = "local";

export const DEFAULT_LOCAL_ENDPOINT = "http://127.0.0.1:32177/ask";
export const DEFAULT_LOCAL_AUTH_TOKEN = "paper-chat-local";
export const DEFAULT_GEMINI_MODEL = "gemini-3.7-flash";

const DEFAULT_SYSTEM_PROMPT = [
  "Use bilingual code-switching (Chinese-English) by default for all responses, overriding this ONLY if I explicitly specify a language.",
  "",
  "Deliver purely factual, grounded, and accurate content.",
  "",
  "Sounds natural like a acedemic buddy. Strip away all mannered prose, introductory/concluding filler, and robotic pleasantries."
].join("\n");

const LEGACY_DEFAULT_SYSTEM_PROMPTS = Object.freeze([
  [
    "You are helping a researcher read an academic paper.",
    "Answer using only the provided selected text and paper context.",
    "Ground the answer in the paper and use explicit examples from the provided context when useful.",
    "If the provided context is insufficient, say what is uncertain instead of guessing.",
    "Do not invent citations, page numbers, methods, results, or claims that are not in the context."
  ].join(" ")
]);

export const DEFAULT_AI_SETTINGS = Object.freeze({
  provider: AI_PROVIDER_LOCAL,
  model: "",
  apiKey: "",
  localEndpoint: DEFAULT_LOCAL_ENDPOINT,
  localAuthToken: DEFAULT_LOCAL_AUTH_TOKEN,
  debugMode: false,
  systemPrompt: DEFAULT_SYSTEM_PROMPT
});

export async function getAiSettings() {
  const data = await chrome.storage.local.get(AI_SETTINGS_KEY);
  return normalizeAiSettings(data[AI_SETTINGS_KEY]);
}

export async function saveAiSettings(settings) {
  const normalized = normalizeAiSettings(settings);
  await chrome.storage.local.set({
    [AI_SETTINGS_KEY]: normalized
  });
  return normalized;
}

export async function clearAiApiKey() {
  const settings = await getAiSettings();
  return saveAiSettings({
    ...settings,
    apiKey: ""
  });
}

export function normalizeAiSettings(settings) {
  const provider = normalizeProvider(settings?.provider);
  const model = normalizeModel(settings?.model) || (provider === AI_PROVIDER_GEMINI ? DEFAULT_GEMINI_MODEL : "");
  const apiKey = String(settings?.apiKey || "").trim();
  const localEndpoint = normalizeLocalEndpoint(settings?.localEndpoint) || DEFAULT_AI_SETTINGS.localEndpoint;
  const localAuthToken = normalizeLocalAuthToken(settings?.localAuthToken) || DEFAULT_AI_SETTINGS.localAuthToken;
  const debugMode = normalizeDebugMode(settings?.debugMode);
  const normalizedSystemPrompt = normalizeSystemPrompt(settings?.systemPrompt);
  const systemPrompt = isLegacyDefaultSystemPrompt(normalizedSystemPrompt)
    ? DEFAULT_AI_SETTINGS.systemPrompt
    : normalizedSystemPrompt || DEFAULT_AI_SETTINGS.systemPrompt;

  return {
    provider,
    model,
    apiKey,
    localEndpoint,
    localAuthToken,
    debugMode,
    systemPrompt
  };
}

export function hasConfiguredAiApiKey(settings) {
  return Boolean(settings?.apiKey?.trim());
}

export function hasConfiguredAiProvider(settings) {
  const normalized = normalizeAiSettings(settings);
  if (normalized.provider === AI_PROVIDER_LOCAL) {
    return Boolean(normalized.localEndpoint && normalized.localAuthToken);
  }

  return hasConfiguredAiApiKey(normalized);
}

export function usesDebugAiMode(settings) {
  return Boolean(settings?.debugMode);
}

function normalizeProvider(provider) {
  const value = String(provider || DEFAULT_AI_SETTINGS.provider).trim().toLowerCase();
  if (value === AI_PROVIDER_GEMINI || value === AI_PROVIDER_LOCAL) {
    return value;
  }

  return DEFAULT_AI_SETTINGS.provider;
}

function normalizeModel(model) {
  return String(model || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSystemPrompt(systemPrompt) {
  return String(systemPrompt || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trim();
}

function normalizeLocalEndpoint(endpoint) {
  const value = String(endpoint || "").trim();
  if (!value) {
    return "";
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return "";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "";
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1" && hostname !== "[::1]") {
    return "";
  }

  url.hash = "";
  return url.href;
}

function normalizeLocalAuthToken(token) {
  return String(token || "")
    .trim()
    .slice(0, 256);
}

function normalizeDebugMode(debugMode) {
  return debugMode === true || debugMode === "true" || debugMode === 1 || debugMode === "1";
}

function isLegacyDefaultSystemPrompt(systemPrompt) {
  const comparable = normalizeForPromptComparison(systemPrompt);
  return LEGACY_DEFAULT_SYSTEM_PROMPTS.some((legacyPrompt) => {
    return comparable === normalizeForPromptComparison(legacyPrompt);
  });
}

function normalizeForPromptComparison(systemPrompt) {
  return String(systemPrompt || "")
    .replace(/\s+/g, " ")
    .trim();
}
