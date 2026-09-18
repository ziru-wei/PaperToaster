export const PROMPT_PRESETS_KEY = "selectionPromptPresetsV1";

export const DEFAULT_SELECTION_PROMPT_PRESETS = Object.freeze([
  {
    id: "overview",
    label: "Overview",
    prompt: "Give an overview of this paper, including the problem, motivation, approach, main findings, and conclusions."
  },
  {
    id: "contribution",
    label: "Contribution",
    prompt: "What are the main contributions of this paper? Explain what is novel relative to the background, prior work, or existing approaches."
  },
  {
    id: "technical-method",
    label: "Technical Method",
    prompt: "Explain the technical method of this work, including the system, architecture, algorithm, implementation, or key technical components."
  },
  {
    id: "research-process",
    label: "Research Process",
    prompt: "How was this research carried out from start to finish? Explain the major research stages and how each stage informed the next."
  },
  {
    id: "evaluation",
    label: "Evaluation",
    prompt: "How was the proposed system or approach evaluated? Explain the evaluation setup, study design, baselines, tasks, metrics, and procedure."
  },
  {
    id: "results",
    label: "Results",
    prompt: "What are the main results and findings? Explain the key quantitative and qualitative outcomes of the evaluation or experiments."
  },
  {
    id: "discussion",
    label: "Discussion",
    prompt: "How do the authors interpret the findings? Explain the implications, limitations, caveats, and future directions discussed in the paper."
  }
]);

export async function getSelectionPromptPresets() {
  const data = await chrome.storage.local.get(PROMPT_PRESETS_KEY);
  const presets = data[PROMPT_PRESETS_KEY];
  if (!Array.isArray(presets) || !presets.length) {
    return cloneDefaultPresets();
  }

  const normalized = normalizePromptPresets(presets);
  if (!normalized.length) {
    return cloneDefaultPresets();
  }
  const migrated = replaceLegacyClarifyPreset(normalized);
  if (migrated !== normalized) {
    await saveSelectionPromptPresets(migrated);
  }
  return migrated;
}

function replaceLegacyClarifyPreset(presets) {
  const legacyIndex = presets.findIndex((preset) => {
    return preset.id === "clarify-terms"
      && preset.label === "Clarify terms"
      && preset.prompt === "Clarify the key terms and assumptions in this selected passage, grounded in the paper's context.";
  });
  if (legacyIndex < 0) {
    return presets;
  }
  const next = [...presets];
  next.splice(legacyIndex, 1, { ...DEFAULT_SELECTION_PROMPT_PRESETS[1] });
  return next;
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
