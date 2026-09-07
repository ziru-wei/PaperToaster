export const PROMPT_PRESETS_KEY = "selectionPromptPresetsV1";

export const DEFAULT_SELECTION_PROMPT_PRESETS = Object.freeze([
  {
    id: "explain-with-examples",
    label: "Explain with examples",
    prompt: "Explain this selected passage. Use explicit examples from the original paper text to explain it."
  },
  {
    id: "clarify-terms",
    label: "Clarify terms",
    prompt: "Clarify the key terms and assumptions in this selected passage, grounded in the paper's context."
  }
]);

export async function getSelectionPromptPresets() {
  const data = await chrome.storage.local.get(PROMPT_PRESETS_KEY);
  const presets = data[PROMPT_PRESETS_KEY];
  if (!Array.isArray(presets) || !presets.length) {
    return cloneDefaultPresets();
  }

  const normalized = normalizePromptPresets(presets);
  return normalized.length ? normalized : cloneDefaultPresets();
}

export async function saveSelectionPromptPresets(presets) {
  const normalized = normalizePromptPresets(presets);
  await chrome.storage.local.set({
    [PROMPT_PRESETS_KEY]: normalized
  });
  return normalized;
}

export async function resetSelectionPromptPresets() {
  const defaults = cloneDefaultPresets();
  await saveSelectionPromptPresets(defaults);
  return defaults;
}

export function normalizePromptPresets(presets) {
  const seenIds = new Set();
  return presets
    .map((preset, index) => normalizePromptPreset(preset, index))
    .filter((preset) => preset.label && preset.prompt)
    .map((preset) => {
      let id = preset.id || createPromptPresetId(preset.label);
      while (seenIds.has(id)) {
        id = `${id}-${indexSuffix(seenIds.size + 1)}`;
      }
      seenIds.add(id);
      return { ...preset, id };
    });
}

export function createBlankPromptPreset() {
  return {
    id: `custom-${Date.now().toString(36)}`,
    label: "",
    prompt: ""
  };
}

function normalizePromptPreset(preset, index) {
  const label = String(preset?.label || "")
    .replace(/\s+/g, " ")
    .trim();
  const prompt = String(preset?.prompt || "")
    .replace(/\s+/g, " ")
    .trim();
  const id = String(preset?.id || createPromptPresetId(label || `preset-${index + 1}`))
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return { id, label, prompt };
}

function createPromptPresetId(label) {
  return String(label || "preset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "preset";
}

function cloneDefaultPresets() {
  return DEFAULT_SELECTION_PROMPT_PRESETS.map((preset) => ({ ...preset }));
}

function indexSuffix(index) {
  return String(index).padStart(2, "0");
}
