export const AI_SETTINGS_KEY = "aiSettingsV1";
export const CURRENT_AI_MODEL_KEY = "currentAiModelV1";
export const AI_PROVIDER_LOCAL = "local";
export const LOCAL_AGENT_PROFILE_CODEX = "codex";

export const DEFAULT_LOCAL_ENDPOINT = "http://127.0.0.1:32177/ask";
export const DEFAULT_LOCAL_AUTH_TOKEN = "paper-chat-local";

const DEFAULT_SYSTEM_PROMPT = [
  "Give the direct core answer first, then provide evidence.",
  "Use natural Chinese-English code-switching by default. Never translate or gloss either language in parentheses, and never restate the same idea in both languages.",
  // "Use English for academic terms or phrases while maintain the readibility.",
  "Please remove all mannerd prose. Avoid chunky paragraphs, long-winded explanations, and verbose preambles. Use concise, direct, and clear language.",
].join("\n\n");

export const DEFAULT_AI_SETTINGS = Object.freeze({
  provider: AI_PROVIDER_LOCAL,
  localAgentProfile: LOCAL_AGENT_PROFILE_CODEX,
  model: "",
  reasoningEffort: "",
  enabledChatModels: [],
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

export async function getEffectiveAiSettings() {
  const settings = await getAiSettings();
  const data = await chrome.storage.session.get(CURRENT_AI_MODEL_KEY);
  const selection = normalizeModelSelection(data[CURRENT_AI_MODEL_KEY]);
  if (data[CURRENT_AI_MODEL_KEY] && !selection) {
    await chrome.storage.session.remove(CURRENT_AI_MODEL_KEY);
  }
  if (!selection || !isModelEnabled(settings.enabledChatModels, selection)) {
    return settings;
  }
  return {
    ...settings,
    localAgentProfile: selection.profile,
    model: selection.model,
    reasoningEffort: selection.reasoningEffort
  };
}

export async function setCurrentAiModelSelection(selection) {
  const normalized = normalizeModelSelection(selection);
  if (!normalized) {
    await chrome.storage.session.remove(CURRENT_AI_MODEL_KEY);
    return null;
  }
  await chrome.storage.session.set({ [CURRENT_AI_MODEL_KEY]: normalized });
  return normalized;
}

export function normalizeAiSettings(settings) {
  const provider = AI_PROVIDER_LOCAL;
  const localAgentProfile = LOCAL_AGENT_PROFILE_CODEX;
  const unsupportedProfile = ["antigravity", "gemini"].includes(String(settings?.localAgentProfile || settings?.provider || "").trim().toLowerCase());
  const model = unsupportedProfile ? "" : normalizeModel(settings?.model);
  const reasoningEffort = unsupportedProfile ? "" : normalizeReasoningEffort(settings?.reasoningEffort);
  const enabledChatModels = normalizeEnabledChatModels(settings?.enabledChatModels);
  const localEndpoint = normalizeLocalEndpoint(settings?.localEndpoint) || DEFAULT_AI_SETTINGS.localEndpoint;
  const localAuthToken = normalizeLocalAuthToken(settings?.localAuthToken) || DEFAULT_AI_SETTINGS.localAuthToken;
  const debugMode = normalizeDebugMode(settings?.debugMode);
  const systemPrompt = normalizeSystemPrompt(settings?.systemPrompt) || DEFAULT_AI_SETTINGS.systemPrompt;

  return {
    provider,
    localAgentProfile,
    model,
    reasoningEffort,
    enabledChatModels,
    localEndpoint,
    localAuthToken,
    debugMode,
    systemPrompt
  };
}

export function normalizeModelSelection(selection) {
  if (selection?.profile && selection.profile !== LOCAL_AGENT_PROFILE_CODEX) return null;
  const profile = LOCAL_AGENT_PROFILE_CODEX;
  const model = normalizeModel(selection?.model);
  const reasoningEffort = normalizeReasoningEffort(selection?.reasoningEffort);
  return model ? { profile, model, reasoningEffort } : null;
}

function normalizeEnabledChatModels(models) {
  const seen = new Set();
  return (Array.isArray(models) ? models : [])
    .map((model) => {
      const selection = normalizeModelSelection(model);
      return selection ? {
        ...selection,
        label: String(model?.label || selection.model).trim().slice(0, 120)
      } : null;
    })
    .filter((selection) => {
      if (!selection) return false;
      const key = `${selection.profile}:${selection.model}:${selection.reasoningEffort}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function isModelEnabled(models, selection) {
  if (!models.length) return true;
  return models.some((item) => item.profile === selection.profile
    && item.model === selection.model
    && item.reasoningEffort === selection.reasoningEffort);
}

export function hasConfiguredAiProvider(settings) {
  const normalized = normalizeAiSettings(settings);
  return Boolean(normalized.localEndpoint && normalized.localAuthToken);
}

export function usesDebugAiMode(settings) {
  return Boolean(settings?.debugMode);
}

function normalizeModel(model) {
  return String(model || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeReasoningEffort(reasoningEffort) {
  return String(reasoningEffort || "").trim().toLowerCase().slice(0, 24);
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
