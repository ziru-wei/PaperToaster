import {
  createBlankPromptPreset,
  getSelectionPromptPresets,
  normalizePromptPresets,
  resetSelectionPromptPresets,
  saveSelectionPromptPresets
} from "../storage/prompt-presets-store.js";
import {
  AI_PROVIDER_LOCAL,
  DEFAULT_LOCAL_AUTH_TOKEN,
  DEFAULT_LOCAL_ENDPOINT,
  clearAiApiKey,
  DEFAULT_AI_SETTINGS,
  getAiSettings,
  hasConfiguredAiApiKey,
  hasConfiguredAiProvider,
  saveAiSettings
} from "../storage/ai-settings-store.js";
import { stripStoredAssistantBoldMarkers } from "../storage/maintenance-store.js";

const elements = {
  aiProvider: document.querySelector("#aiProvider"),
  aiModel: document.querySelector("#aiModel"),
  aiApiKey: document.querySelector("#aiApiKey"),
  aiLocalEndpoint: document.querySelector("#aiLocalEndpoint"),
  aiLocalAuthToken: document.querySelector("#aiLocalAuthToken"),
  aiDebugMode: document.querySelector("#aiDebugMode"),
  aiSystemPrompt: document.querySelector("#aiSystemPrompt"),
  saveAiSettings: document.querySelector("#saveAiSettings"),
  useLocalCodex: document.querySelector("#useLocalCodex"),
  clearAiKey: document.querySelector("#clearAiKey"),
  aiKeyStatus: document.querySelector("#aiKeyStatus"),
  addPreset: document.querySelector("#addPreset"),
  resetPresets: document.querySelector("#resetPresets"),
  savePresets: document.querySelector("#savePresets"),
  stripStoredBoldMarkers: document.querySelector("#stripStoredBoldMarkers"),
  presetList: document.querySelector("#presetList"),
  presetTemplate: document.querySelector("#presetTemplate"),
  status: document.querySelector("#status")
};

let savedAiSettings = null;

for (const [name, element] of Object.entries(elements)) {
  if (!element) {
    throw new Error(`Options element missing: ${name}`);
  }
}

elements.addPreset.addEventListener("click", () => {
  renderPresets([...readPresetsFromForm({ includeEmpty: true }), createBlankPromptPreset()]);
  setStatus("");
});
elements.aiProvider.addEventListener("change", () => {
  renderAiProviderFields();
  renderAiKeyStatus(readAiSettingsFromForm());
});
elements.aiApiKey.addEventListener("input", () => {
  renderAiKeyStatus(readAiSettingsFromForm());
});
elements.aiLocalEndpoint.addEventListener("input", () => {
  renderAiKeyStatus(readAiSettingsFromForm());
});
elements.aiLocalAuthToken.addEventListener("input", () => {
  renderAiKeyStatus(readAiSettingsFromForm());
});
elements.useLocalCodex.addEventListener("click", useLocalCodexDefaults);
elements.saveAiSettings.addEventListener("click", saveAiProviderSettings);
elements.clearAiKey.addEventListener("click", clearAiProviderKey);
elements.aiDebugMode.addEventListener("change", saveAiProviderSettings);
elements.resetPresets.addEventListener("click", resetPresets);
elements.savePresets.addEventListener("click", savePresets);
elements.stripStoredBoldMarkers.addEventListener("click", stripStoredBoldMarkers);

loadAiSettings();
loadPresets();

async function loadAiSettings() {
  try {
    renderAiSettings(await getAiSettings());
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function saveAiProviderSettings() {
  try {
    const existing = await getAiSettings();
    const nextApiKey = elements.aiApiKey.value.trim() || existing.apiKey;
    const nextLocalAuthToken = elements.aiLocalAuthToken.value.trim() || existing.localAuthToken;
    const settings = await saveAiSettings({
      provider: elements.aiProvider.value,
      model: elements.aiModel.value,
      apiKey: nextApiKey,
      localEndpoint: elements.aiLocalEndpoint.value,
      localAuthToken: nextLocalAuthToken,
      debugMode: elements.aiDebugMode.checked,
      systemPrompt: elements.aiSystemPrompt.value
    });

    savedAiSettings = settings;
    elements.aiApiKey.value = "";
    elements.aiLocalAuthToken.value = "";
    renderAiKeyStatus(settings);
    setStatus("AI settings saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function useLocalCodexDefaults() {
  try {
    const settings = await saveAiSettings({
      ...DEFAULT_AI_SETTINGS,
      provider: AI_PROVIDER_LOCAL,
      model: "",
      apiKey: "",
      localEndpoint: DEFAULT_LOCAL_ENDPOINT,
      localAuthToken: DEFAULT_LOCAL_AUTH_TOKEN,
      debugMode: false
    });
    renderAiSettings(settings);
    setStatus("Local Codex settings saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function clearAiProviderKey() {
  try {
    const settings = await clearAiApiKey();
    savedAiSettings = settings;
    elements.aiApiKey.value = "";
    renderAiKeyStatus(settings);
    setStatus("API key cleared.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

function renderAiSettings(settings) {
  savedAiSettings = settings;
  elements.aiProvider.value = settings.provider;
  elements.aiModel.value = settings.model;
  elements.aiApiKey.value = "";
  elements.aiLocalEndpoint.value = settings.localEndpoint || "";
  elements.aiLocalAuthToken.value = "";
  elements.aiDebugMode.checked = Boolean(settings.debugMode);
  elements.aiSystemPrompt.value = settings.systemPrompt;
  renderAiProviderFields();
  renderAiKeyStatus(settings);
}

function renderAiKeyStatus(settings) {
  if (settings.debugMode) {
    elements.aiKeyStatus.textContent = "Debug mode enabled. API requests are skipped.";
    return;
  }

  if (settings.provider === AI_PROVIDER_LOCAL) {
    elements.aiKeyStatus.textContent = hasConfiguredAiProvider(settings)
      ? "Local agent endpoint and token configured."
      : "Local agent endpoint or token missing.";
    return;
  }

  elements.aiKeyStatus.textContent = hasConfiguredAiApiKey(settings)
    ? "API key configured."
    : "No API key configured.";
}

function renderAiProviderFields() {
  const usesLocalProvider = elements.aiProvider.value === AI_PROVIDER_LOCAL;
  elements.aiApiKey.closest("label").hidden = usesLocalProvider;
  elements.aiLocalEndpoint.closest("label").hidden = !usesLocalProvider;
  elements.aiLocalAuthToken.closest("label").hidden = !usesLocalProvider;
  elements.clearAiKey.hidden = usesLocalProvider;
}

function readAiSettingsFromForm() {
  return {
    provider: elements.aiProvider.value,
    model: elements.aiModel.value,
    apiKey: elements.aiApiKey.value.trim() || savedAiSettings?.apiKey || "",
    localEndpoint: elements.aiLocalEndpoint.value,
    localAuthToken: elements.aiLocalAuthToken.value.trim() || savedAiSettings?.localAuthToken || "",
    debugMode: elements.aiDebugMode.checked,
    systemPrompt: elements.aiSystemPrompt.value
  };
}

async function loadPresets() {
  try {
    renderPresets(await getSelectionPromptPresets());
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function savePresets() {
  try {
    const presets = normalizePromptPresets(readPresetsFromForm({ includeEmpty: false }));
    if (!presets.length) {
      throw new Error("Keep at least one prompt preset.");
    }

    renderPresets(await saveSelectionPromptPresets(presets));
    setStatus("Saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function resetPresets() {
  try {
    renderPresets(await resetSelectionPromptPresets());
    setStatus("Reset to defaults.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function stripStoredBoldMarkers() {
  const shouldContinue = window.confirm(
    "Strip Markdown bold markers from all stored assistant responses? This rewrites local conversation storage."
  );
  if (!shouldContinue) {
    return;
  }

  try {
    elements.stripStoredBoldMarkers.disabled = true;
    setStatus("Stripping stored bold markers...");
    const result = await stripStoredAssistantBoldMarkers();
    setStatus([
      `Updated ${result.conversation.updated}/${result.conversation.checked} paper chat responses.`,
      `Updated ${result.comparison.updated}/${result.comparison.checked} comparison responses.`
    ].join(" "));
  } catch (error) {
    setStatus(error.message || String(error), true);
  } finally {
    elements.stripStoredBoldMarkers.disabled = false;
  }
}

function renderPresets(presets) {
  elements.presetList.textContent = "";

  for (const preset of presets) {
    const fragment = elements.presetTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".preset-row");
    const label = fragment.querySelector(".preset-label");
    const prompt = fragment.querySelector(".preset-prompt");
    const deleteButton = fragment.querySelector(".delete-preset");

    row.dataset.presetId = preset.id || "";
    label.value = preset.label || "";
    prompt.value = preset.prompt || "";
    deleteButton.addEventListener("click", () => {
      row.remove();
      setStatus("");
    });

    elements.presetList.append(fragment);
  }
}

function readPresetsFromForm({ includeEmpty }) {
  return [...elements.presetList.querySelectorAll(".preset-row")]
    .map((row) => {
      const label = row.querySelector(".preset-label").value;
      const prompt = row.querySelector(".preset-prompt").value;
      return {
        id: row.dataset.presetId || "",
        label,
        prompt
      };
    })
    .filter((preset) => includeEmpty || preset.label.trim() || preset.prompt.trim());
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}
