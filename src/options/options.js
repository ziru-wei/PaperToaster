import {
  createBlankPromptPreset,
  getSelectionPromptPresets,
  normalizePromptPresets,
  resetSelectionPromptPresets,
  saveSelectionPromptPresets
} from "../storage/prompt-presets-store.js";
import {
  clearAiApiKey,
  getAiSettings,
  hasConfiguredAiApiKey,
  saveAiSettings
} from "../storage/ai-settings-store.js";

const elements = {
  aiProvider: document.querySelector("#aiProvider"),
  aiModel: document.querySelector("#aiModel"),
  aiApiKey: document.querySelector("#aiApiKey"),
  aiDebugMode: document.querySelector("#aiDebugMode"),
  aiSystemPrompt: document.querySelector("#aiSystemPrompt"),
  saveAiSettings: document.querySelector("#saveAiSettings"),
  clearAiKey: document.querySelector("#clearAiKey"),
  aiKeyStatus: document.querySelector("#aiKeyStatus"),
  addPreset: document.querySelector("#addPreset"),
  resetPresets: document.querySelector("#resetPresets"),
  savePresets: document.querySelector("#savePresets"),
  presetList: document.querySelector("#presetList"),
  presetTemplate: document.querySelector("#presetTemplate"),
  status: document.querySelector("#status")
};

for (const [name, element] of Object.entries(elements)) {
  if (!element) {
    throw new Error(`Options element missing: ${name}`);
  }
}

elements.addPreset.addEventListener("click", () => {
  renderPresets([...readPresetsFromForm({ includeEmpty: true }), createBlankPromptPreset()]);
  setStatus("");
});
elements.saveAiSettings.addEventListener("click", saveAiProviderSettings);
elements.clearAiKey.addEventListener("click", clearAiProviderKey);
elements.resetPresets.addEventListener("click", resetPresets);
elements.savePresets.addEventListener("click", savePresets);

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
    const settings = await saveAiSettings({
      provider: elements.aiProvider.value,
      model: elements.aiModel.value,
      apiKey: nextApiKey,
      debugMode: elements.aiDebugMode.checked,
      systemPrompt: elements.aiSystemPrompt.value
    });

    elements.aiApiKey.value = "";
    renderAiKeyStatus(settings);
    setStatus("AI settings saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function clearAiProviderKey() {
  try {
    const settings = await clearAiApiKey();
    elements.aiApiKey.value = "";
    renderAiKeyStatus(settings);
    setStatus("API key cleared.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

function renderAiSettings(settings) {
  elements.aiProvider.value = settings.provider;
  elements.aiModel.value = settings.model;
  elements.aiApiKey.value = "";
  elements.aiDebugMode.checked = Boolean(settings.debugMode);
  elements.aiSystemPrompt.value = settings.systemPrompt;
  renderAiKeyStatus(settings);
}

function renderAiKeyStatus(settings) {
  if (settings.debugMode) {
    elements.aiKeyStatus.textContent = "Debug mode enabled. API requests are skipped.";
    return;
  }

  elements.aiKeyStatus.textContent = hasConfiguredAiApiKey(settings)
    ? "API key configured."
    : "No API key configured.";
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
