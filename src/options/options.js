import {
  createBlankPromptPreset,
  getComparativePromptPresets,
  getSelectionPromptPresets,
  normalizePromptPresets,
  resetComparativePromptPresets,
  resetSelectionPromptPresets,
  saveComparativePromptPresets,
  saveSelectionPromptPresets
} from "../storage/prompt-presets-store.js";
import {
  getAiSettings,
  hasConfiguredAiProvider,
  saveAiSettings
} from "../storage/ai-settings-store.js";
import { listLocalAgentModels, testLocalAgentConnection } from "../ai/local-agent-client.js";
import { stripStoredAssistantEmphasisMarkers } from "../storage/maintenance-store.js";
import {
  MIN_COMPARISON_PAPERS,
  getComparisonSettings,
  saveComparisonSettings
} from "../storage/comparison-settings-store.js";
import {
  getParsingSettings,
  saveParsingSettings
} from "../storage/parsing-settings-store.js";
import {
  getSavedQaSettings,
  saveSavedQaSettings
} from "../storage/saved-qa-settings-store.js";
import { importLibraryArchive, validateLibraryArchive } from "../storage/library-archive-store.js";
import { chooseImportDestination } from "../components/import-destination-dialog.js";

const elements = {
  aiLocalEndpoint: document.querySelector("#aiLocalEndpoint"),
  aiLocalAuthToken: document.querySelector("#aiLocalAuthToken"),
  autoParse: document.querySelector("#autoParse"),
  parsingStatus: document.querySelector("#parsingStatus"),
  savedQaPerPaperLimit: document.querySelector("#savedQaPerPaperLimit"),
  savedQaStatus: document.querySelector("#savedQaStatus"),
  aiDebugMode: document.querySelector("#aiDebugMode"),
  aiSystemPrompt: document.querySelector("#aiSystemPrompt"),
  aiProviderStatus: document.querySelector("#aiProviderStatus"),
  aiModeStatus: document.querySelector("#aiModeStatus"),
  aiSystemPromptStatus: document.querySelector("#aiSystemPromptStatus"),
  testAiProvider: document.querySelector("#testAiProvider"),
  localAgentCommand: document.querySelector("#localAgentCommand"),
  copyLocalAgentCommand: document.querySelector("#copyLocalAgentCommand"),
  chatModelsStatus: document.querySelector("#chatModelsStatus"),
  refreshChatModels: document.querySelector("#refreshChatModels"),
  chatModelList: document.querySelector("#chatModelList"),
  comparisonPaperLimit: document.querySelector("#comparisonPaperLimit"),
  saveComparisonSettings: document.querySelector("#saveComparisonSettings"),
  comparisonSettingsStatus: document.querySelector("#comparisonSettingsStatus"),
  addPreset: document.querySelector("#addPreset"),
  resetPresets: document.querySelector("#resetPresets"),
  savePresets: document.querySelector("#savePresets"),
  addComparativePreset: document.querySelector("#addComparativePreset"),
  resetComparativePresets: document.querySelector("#resetComparativePresets"),
  saveComparativePresets: document.querySelector("#saveComparativePresets"),
  stripStoredEmphasisMarkers: document.querySelector("#stripStoredEmphasisMarkers"),
  importLibraryArchive: document.querySelector("#importLibraryArchive"),
  libraryArchiveFile: document.querySelector("#libraryArchiveFile"),
  libraryImportStatus: document.querySelector("#libraryImportStatus"),
  presetList: document.querySelector("#presetList"),
  comparativePresetList: document.querySelector("#comparativePresetList"),
  presetTemplate: document.querySelector("#presetTemplate"),
  status: document.querySelector("#status")
};

let savedAiSettings = null;
let aiSettingsSaveQueue = Promise.resolve();
let systemPromptSaveTimer = null;
let availableChatModels = [];

for (const [name, element] of Object.entries(elements)) {
  if (!element) {
    throw new Error(`Options element missing: ${name}`);
  }
}

elements.addPreset.addEventListener("click", () => {
  renderPresets([...readPresetsFromForm(elements.presetList, { includeEmpty: true }), createBlankPromptPreset()], elements.presetList);
  setStatus("");
});
elements.addComparativePreset.addEventListener("click", () => {
  renderPresets([
    ...readPresetsFromForm(elements.comparativePresetList, { includeEmpty: true }),
    createBlankPromptPreset()
  ], elements.comparativePresetList);
  setStatus("");
});
elements.aiLocalEndpoint.addEventListener("change", () => {
  queueAiSettingsSave({ localEndpoint: elements.aiLocalEndpoint.value }, "provider");
});
elements.aiLocalAuthToken.addEventListener("change", () => {
  const token = elements.aiLocalAuthToken.value.trim();
  if (token) {
    queueAiSettingsSave({ localAuthToken: token }, "provider", { clearTokenField: true });
  }
});
elements.aiDebugMode.addEventListener("change", () => {
  queueAiSettingsSave({ debugMode: elements.aiDebugMode.checked }, "mode");
});
elements.autoParse.addEventListener("change", saveAutoParseSetting);
elements.savedQaPerPaperLimit.addEventListener("change", saveSavedQaLimit);
elements.aiSystemPrompt.addEventListener("input", scheduleSystemPromptSave);
elements.aiSystemPrompt.addEventListener("change", saveSystemPromptImmediately);
elements.testAiProvider.addEventListener("click", testAiProvider);
elements.copyLocalAgentCommand.addEventListener("click", copyLocalAgentCommand);
elements.refreshChatModels.addEventListener("click", loadAvailableChatModels);
elements.resetPresets.addEventListener("click", resetPresets);
elements.savePresets.addEventListener("click", savePresets);
elements.resetComparativePresets.addEventListener("click", resetComparativePresets);
elements.saveComparativePresets.addEventListener("click", saveComparativePresets);
elements.stripStoredEmphasisMarkers.addEventListener("click", stripStoredEmphasisMarkers);
elements.saveComparisonSettings.addEventListener("click", saveComparativeReadingSettings);
elements.importLibraryArchive.addEventListener("click", () => elements.libraryArchiveFile.click());
elements.libraryArchiveFile.addEventListener("change", importSelectedLibraryArchive);

loadAiSettings();
loadParsingSettings();
loadSavedQaSettings();
loadPresets();
loadComparativePresets();
loadComparisonSettings();

async function importSelectedLibraryArchive() {
  const file = elements.libraryArchiveFile.files?.[0];
  if (!file) {
    return;
  }

  elements.importLibraryArchive.disabled = true;
  setLibraryImportStatus("Importing...");
  try {
    const archive = JSON.parse(await file.text());
    validateLibraryArchive(archive);
    const destination = await chooseImportDestination();
    if (!destination) {
      setLibraryImportStatus("Import cancelled.");
      return;
    }
    const result = await importLibraryArchive(archive, { destination });
    const summary = `Added ${result.importedPaperCount} papers · ${result.comparisonCount} comparisons · skipped ${result.skippedPaperCount} existing`;
    setLibraryImportStatus(summary);
    window.alert(`Import complete.\n${summary}`);
  } catch (error) {
    setLibraryImportStatus(error.message || String(error), true);
  } finally {
    elements.libraryArchiveFile.value = "";
    elements.importLibraryArchive.disabled = false;
  }
}

function setLibraryImportStatus(message, isError = false) {
  elements.libraryImportStatus.textContent = message;
  elements.libraryImportStatus.classList.toggle("error", isError);
}

async function loadComparisonSettings() {
  try {
    const settings = await getComparisonSettings();
    elements.comparisonPaperLimit.value = String(settings.paperLimit);
  } catch (error) {
    setComparisonSettingsStatus(error.message || String(error), true);
  }
}

async function loadParsingSettings() {
  try {
    const settings = await getParsingSettings();
    elements.autoParse.checked = settings.autoParse;
    setParsingStatus("✓ Auto saved");
  } catch (error) {
    setParsingStatus(error.message || String(error), true);
  }
}

async function loadSavedQaSettings() {
  try {
    const settings = await getSavedQaSettings();
    elements.savedQaPerPaperLimit.value = String(settings.perPaperLimit);
    setSavedQaStatus("✓ Auto saved");
  } catch (error) {
    setSavedQaStatus(error.message || String(error), true);
  }
}

async function saveSavedQaLimit() {
  const value = Number(elements.savedQaPerPaperLimit.value);
  if (!Number.isInteger(value) || value < 1) {
    setSavedQaStatus("Maximum saved Q&A must be a positive integer.", true);
    return;
  }
  setSavedQaStatus("Saving...");
  try {
    const settings = await saveSavedQaSettings({ perPaperLimit: value });
    elements.savedQaPerPaperLimit.value = String(settings.perPaperLimit);
    setSavedQaStatus("✓ Auto saved");
  } catch (error) {
    setSavedQaStatus(error.message || String(error), true);
  }
}

function setSavedQaStatus(message, isError = false) {
  elements.savedQaStatus.textContent = message;
  elements.savedQaStatus.classList.toggle("error", isError);
  elements.savedQaStatus.classList.toggle("saving", message === "Saving...");
}

async function saveAutoParseSetting() {
  setParsingStatus("Saving...");
  try {
    const settings = await saveParsingSettings({
      autoParse: elements.autoParse.checked
    });
    elements.autoParse.checked = settings.autoParse;
    setParsingStatus("✓ Auto saved");
  } catch (error) {
    setParsingStatus(error.message || String(error), true);
  }
}

function setParsingStatus(message, isError = false) {
  elements.parsingStatus.textContent = message;
  elements.parsingStatus.classList.toggle("error", isError);
  elements.parsingStatus.classList.toggle("saving", message === "Saving...");
}

async function saveComparativeReadingSettings() {
  try {
    const rawLimit = Number(elements.comparisonPaperLimit.value);
    if (!Number.isInteger(rawLimit) || rawLimit < MIN_COMPARISON_PAPERS) {
      throw new Error(`Maximum papers must be an integer of at least ${MIN_COMPARISON_PAPERS}.`);
    }

    const settings = await saveComparisonSettings({ paperLimit: rawLimit });
    elements.comparisonPaperLimit.value = String(settings.paperLimit);
    setComparisonSettingsStatus(`Comparative Reading limit saved as ${settings.paperLimit} papers.`);
  } catch (error) {
    setComparisonSettingsStatus(error.message || String(error), true);
  }
}

function setComparisonSettingsStatus(message, isError = false) {
  elements.comparisonSettingsStatus.textContent = message;
  elements.comparisonSettingsStatus.classList.toggle("error", isError);
}

async function loadAiSettings() {
  try {
    renderAiSettings(await getAiSettings());
    await loadAvailableChatModels();
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

function renderAiSettings(settings) {
  savedAiSettings = settings;
  elements.aiLocalEndpoint.value = settings.localEndpoint || "";
  elements.aiLocalAuthToken.value = "";
  elements.aiDebugMode.checked = Boolean(settings.debugMode);
  elements.aiSystemPrompt.value = settings.systemPrompt;
  elements.localAgentCommand.value = buildLocalAgentCommand();
  renderAiSectionStatuses(settings);
}

function renderAiSectionStatuses(settings) {
  setAiSectionStatus("provider", hasConfiguredAiProvider(settings) ? "✓ Auto saved" : "Configuration incomplete", !hasConfiguredAiProvider(settings));
  setAiSectionStatus("mode", "✓ Auto saved");
  setAiSectionStatus("systemPrompt", "✓ Auto saved");
}

function scheduleSystemPromptSave() {
  clearTimeout(systemPromptSaveTimer);
  elements.aiSystemPromptStatus.textContent = "Saving...";
  systemPromptSaveTimer = setTimeout(saveSystemPromptImmediately, 400);
}

function saveSystemPromptImmediately() {
  clearTimeout(systemPromptSaveTimer);
  systemPromptSaveTimer = null;
  queueAiSettingsSave({ systemPrompt: elements.aiSystemPrompt.value }, "systemPrompt");
}

function queueAiSettingsSave(patch, section, options = {}) {
  setAiSectionStatus(section, "Saving...");
  aiSettingsSaveQueue = aiSettingsSaveQueue
    .catch(() => {})
    .then(async () => {
      const base = savedAiSettings || await getAiSettings();
      savedAiSettings = await saveAiSettings({ ...base, ...patch });
      if (options.clearTokenField) {
        elements.aiLocalAuthToken.value = "";
      }
      renderAiSectionStatuses(savedAiSettings);
      if (section === "models") {
        setAiSectionStatus("models", "✓ Auto saved");
      }
    })
    .catch((error) => {
      setAiSectionStatus(section, error.message || String(error), true);
    });
  return aiSettingsSaveQueue;
}

function setAiSectionStatus(section, message, isError = false) {
  const status = section === "mode"
    ? elements.aiModeStatus
    : section === "systemPrompt"
      ? elements.aiSystemPromptStatus
      : section === "models"
        ? elements.chatModelsStatus
      : elements.aiProviderStatus;
  status.textContent = message;
  status.classList.toggle("error", isError);
  status.classList.toggle("saving", message === "Saving...");
}

async function loadAvailableChatModels() {
  elements.refreshChatModels.disabled = true;
  setAiSectionStatus("models", "Loading...");
  try {
    await aiSettingsSaveQueue.catch(() => {});
    const settings = savedAiSettings || await getAiSettings();
    availableChatModels = await listLocalAgentModels({
      endpoint: settings.localEndpoint,
      authToken: settings.localAuthToken
    });
    if (!availableChatModels.length) {
      throw new Error("The local bridge returned no available models.");
    }
    if (!settings.enabledChatModels.length) {
      const defaultModel = chooseInitialDefaultModel(availableChatModels, settings);
      await queueAiSettingsSave({
        enabledChatModels: availableChatModels.map(toModelSelection),
        localAgentProfile: defaultModel.profile,
        model: defaultModel.id,
        reasoningEffort: defaultModel.reasoningEffort
      }, "models");
    }
    renderChatModels();
    setAiSectionStatus("models", "✓ Auto saved");
  } catch (error) {
    elements.chatModelList.textContent = error.message || String(error);
    setAiSectionStatus("models", "Unavailable", true);
  } finally {
    elements.refreshChatModels.disabled = false;
  }
}

function renderChatModels() {
  elements.chatModelList.textContent = "";
  const models = availableChatModels.filter((model) => model.profile === "codex");
  if (!models.length) return;
  const group = document.createElement("div");
  group.className = "model-profile-group";
  const heading = document.createElement("h3");
  heading.textContent = "Codex";
  group.append(heading);
  for (const model of models) group.append(createChatModelRow(model));
  elements.chatModelList.append(group);
}

function createChatModelRow(model) {
  const row = document.createElement("div");
  row.className = "chat-model-row";
  const enabled = document.createElement("input");
  enabled.type = "checkbox";
  enabled.checked = isChatModelEnabled(model);
  enabled.setAttribute("aria-label", `Show ${model.label} in chat menu`);
  const name = document.createElement("span");
  name.className = "chat-model-name";
  name.textContent = model.label;
  const id = document.createElement("span");
  id.className = "chat-model-id";
  id.textContent = model.id;
  name.append(id);
  const defaultLabel = document.createElement("label");
  defaultLabel.className = "default-model-label";
  const defaultInput = document.createElement("input");
  defaultInput.type = "radio";
  defaultInput.name = "defaultChatModel";
  defaultInput.checked = isDefaultChatModel(model);
  defaultInput.disabled = !enabled.checked;
  defaultLabel.append(defaultInput, "Default");
  enabled.addEventListener("change", () => updateEnabledModel(model, enabled.checked));
  defaultInput.addEventListener("change", () => setDefaultChatModel(model));
  row.append(enabled, name, defaultLabel);
  return row;
}

async function updateEnabledModel(model, enabled) {
  const current = savedAiSettings.enabledChatModels;
  const key = modelKey(model);
  let next = enabled
    ? [...current.filter((item) => modelKey(item) !== key), toModelSelection(model)]
    : current.filter((item) => modelKey(item) !== key);
  if (!next.length) {
    window.alert("Keep at least one model in the chat menu.");
    renderChatModels();
    return;
  }
  const patch = { enabledChatModels: next };
  if (!next.some((item) => item.profile === savedAiSettings.localAgentProfile
    && item.model === savedAiSettings.model
    && item.reasoningEffort === savedAiSettings.reasoningEffort)) {
    patch.localAgentProfile = next[0].profile;
    patch.model = next[0].model;
    patch.reasoningEffort = next[0].reasoningEffort;
  }
  await queueAiSettingsSave(patch, "models");
  renderChatModels();
}

async function setDefaultChatModel(model) {
  await queueAiSettingsSave({
    localAgentProfile: model.profile,
    model: model.id,
    reasoningEffort: model.reasoningEffort
  }, "models");
  renderChatModels();
}

function isChatModelEnabled(model) {
  return savedAiSettings.enabledChatModels.some((item) => modelKey(item) === modelKey(model));
}

function isDefaultChatModel(model) {
  return savedAiSettings.localAgentProfile === model.profile
    && savedAiSettings.model === model.id
    && savedAiSettings.reasoningEffort === String(model.reasoningEffort || "");
}

function chooseInitialDefaultModel(models, settings) {
  return models.find((model) => model.profile === settings.localAgentProfile && model.id === settings.model)
    || models.find((model) => model.isProviderDefault)
    || models[0];
}

function toModelSelection(model) {
  return {
    profile: model.profile,
    model: model.id,
    reasoningEffort: model.reasoningEffort || "",
    label: model.label || model.id
  };
}

function modelKey(model) {
  return `${model.profile}:${model.model || model.id}:${model.reasoningEffort || ""}`;
}

async function testAiProvider() {
  elements.testAiProvider.disabled = true;
  elements.aiProviderStatus.title = "";
  setAiSectionStatus("provider", "Testing...");
  try {
    await aiSettingsSaveQueue.catch(() => {});
    const settings = savedAiSettings || await getAiSettings();
    await testLocalAgentConnection({
      endpoint: settings.localEndpoint,
      authToken: settings.localAuthToken,
      localAgentProfile: settings.localAgentProfile,
      model: settings.model,
      reasoningEffort: settings.reasoningEffort
    });
    elements.aiProviderStatus.title = "";
    setAiSectionStatus("provider", "✓ Connection ready");
  } catch (error) {
    const message = error.message || String(error);
    elements.aiProviderStatus.title = message;
    setAiSectionStatus("provider", "Test failed", true);
    window.alert(message);
  } finally {
    elements.testAiProvider.disabled = false;
  }
}

async function copyLocalAgentCommand() {
  try {
    await navigator.clipboard.writeText(elements.localAgentCommand.value);
    elements.copyLocalAgentCommand.textContent = "Copied";
    setTimeout(() => {
      elements.copyLocalAgentCommand.textContent = "Copy";
    }, 1200);
  } catch (error) {
    setAiSectionStatus("provider", `Could not copy command: ${error.message || String(error)}`, true);
  }
}

function buildLocalAgentCommand() {
  return 'cd "/Users/ziru/Documents/GitHub/PaperToaster" && PAPER_CHAT_LOCAL_AGENT_TOKEN="paper-chat-local" node scripts/local-agent-server.js';
}

async function loadPresets() {
  try {
    renderPresets(await getSelectionPromptPresets(), elements.presetList);
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function loadComparativePresets() {
  try {
    renderPresets(await getComparativePromptPresets(), elements.comparativePresetList);
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function savePresets() {
  try {
    const presets = normalizePromptPresets(readPresetsFromForm(elements.presetList, { includeEmpty: false }));
    if (!presets.length) {
      throw new Error("Keep at least one prompt preset.");
    }

    renderPresets(await saveSelectionPromptPresets(presets), elements.presetList);
    setStatus("Saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function resetPresets() {
  try {
    renderPresets(await resetSelectionPromptPresets(), elements.presetList);
    setStatus("Reset to defaults.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function saveComparativePresets() {
  try {
    const presets = normalizePromptPresets(
      readPresetsFromForm(elements.comparativePresetList, { includeEmpty: false })
    );
    if (!presets.length) {
      throw new Error("Keep at least one Comparative Reading prompt preset.");
    }

    renderPresets(
      await saveComparativePromptPresets(presets),
      elements.comparativePresetList
    );
    setStatus("Saved.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function resetComparativePresets() {
  try {
    renderPresets(
      await resetComparativePromptPresets(),
      elements.comparativePresetList
    );
    setStatus("Reset to defaults.");
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

async function stripStoredEmphasisMarkers() {
  const shouldContinue = window.confirm(
    "Strip Markdown bold and italic markers from all stored assistant responses? This rewrites local conversation storage."
  );
  if (!shouldContinue) {
    return;
  }

  try {
    elements.stripStoredEmphasisMarkers.disabled = true;
    setStatus("Stripping stored emphasis markers...");
    const result = await stripStoredAssistantEmphasisMarkers();
    setStatus([
      `Updated ${result.conversation.updated}/${result.conversation.checked} paper chat responses.`,
      `Updated ${result.comparison.updated}/${result.comparison.checked} comparison responses.`
    ].join(" "));
  } catch (error) {
    setStatus(error.message || String(error), true);
  } finally {
    elements.stripStoredEmphasisMarkers.disabled = false;
  }
}

function renderPresets(presets, listElement) {
  listElement.textContent = "";

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

    listElement.append(fragment);
  }
}

function readPresetsFromForm(listElement, { includeEmpty }) {
  return [...listElement.querySelectorAll(".preset-row")]
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
