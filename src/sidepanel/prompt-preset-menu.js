import { getSelectionPromptPresets } from "../storage/prompt-presets-store.js";
import {
  AI_SETTINGS_KEY,
  getAiSettings,
  getEffectiveAiSettings,
  setCurrentAiModelSelection
} from "../storage/ai-settings-store.js";

export function createPromptPresetMenuController({
  textarea,
  menuElement,
  commandCompletionElement,
  modelIndicator,
  onError
}) {
  let promptPresets = [];
  let enabledModels = [];
  let currentModel = null;
  let activeIndex = 0;

  textarea.addEventListener("scroll", () => {
    if (!commandCompletionElement?.hidden) {
      positionModelCommandCompletion();
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes[AI_SETTINGS_KEY]) {
      load();
    }
  });

  async function load() {
    try {
      const [presets, settings, effectiveSettings] = await Promise.all([
        getSelectionPromptPresets(),
        getAiSettings(),
        getEffectiveAiSettings()
      ]);
      promptPresets = presets;
      enabledModels = settings.enabledChatModels;
      currentModel = {
        profile: effectiveSettings.localAgentProfile,
        model: effectiveSettings.model,
        reasoningEffort: effectiveSettings.reasoningEffort,
        label: enabledModels.find((item) => item.profile === effectiveSettings.localAgentProfile
          && item.model === effectiveSettings.model
          && item.reasoningEffort === effectiveSettings.reasoningEffort)?.label
          || effectiveSettings.model
      };
      renderModelIndicator();
      update();
    } catch (error) {
      onError?.(error);
    }
  }

  function update() {
    const request = getRequest();
    if (!request) {
      hide();
      return;
    }

    if (request.type === "model-completion") {
      menuElement.hidden = true;
      menuElement.textContent = "";
      renderModelCommandCompletion(request);
      return;
    }

    hideModelCommandCompletion();

    const options = getOptions(request);
    activeIndex = Math.min(activeIndex, Math.max(0, options.length - 1));
    render(options, request);
  }

  function handleKeydown(event) {
    const request = getRequest();
    if (!request) {
      return false;
    }

    if (request.type === "model-completion") {
      if (event.key === "Tab") {
        event.preventDefault();
        completeModelCommand(request);
        return true;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        hideModelCommandCompletion();
        return true;
      }
      return false;
    }

    if (menuElement.hidden) {
      return false;
    }

    const options = getOptions(request);
    if (!options.length) {
      if (event.key === "Escape") {
        hide();
        return true;
      }
      return false;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      render(options, request);
      return true;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      render(options, request);
      return true;
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectOption(options[activeIndex], request);
      return true;
    } else if (event.key === "Escape") {
      event.preventDefault();
      hide();
      return true;
    }

    return false;
  }

  function preventBlurDismissal(event) {
    event.preventDefault();
  }

  function render(options, request) {
    menuElement.textContent = "";

    if (!options.length) {
      const empty = document.createElement("div");
      empty.className = "prompt-preset-empty muted";
      empty.textContent = request.type === "model" ? "No matching models." : "No matching prompts.";
      menuElement.append(empty);
      menuElement.hidden = false;
      return;
    }

    options.forEach((preset, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-preset-option";
      button.classList.toggle("model-menu-option", request.type === "model");
      button.classList.toggle("active", index === activeIndex);
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", index === activeIndex ? "true" : "false");

      const label = document.createElement(request.type === "model" ? "span" : "strong");
      if (request.type === "model") {
        label.className = "model-menu-label";
      }
      label.textContent = preset.label;
      button.append(label);
      if (request.type !== "model") {
        const prompt = document.createElement("span");
        prompt.textContent = preset.prompt;
        button.append(prompt);
      }

      button.addEventListener("mouseenter", () => {
        activeIndex = index;
        render(options, request);
      });
      button.addEventListener("click", () => {
        selectOption(preset, request);
      });

      menuElement.append(button);
    });

    menuElement.hidden = false;
    scrollActiveOptionIntoView();
  }

  function scrollActiveOptionIntoView() {
    const activeOption = menuElement.querySelector(".prompt-preset-option.active");
    activeOption?.scrollIntoView({
      block: "nearest"
    });
  }

  function filterPresets(query) {
    const normalizedQuery = normalizeQuery(query);
    if (!normalizedQuery) {
      return promptPresets;
    }

    return promptPresets.filter((preset) => {
      const searchable = normalizeQuery(`${preset.label} ${preset.prompt}`);
      return searchable.includes(normalizedQuery);
    });
  }

  function getOptions(request) {
    if (request.type !== "model") {
      return filterPresets(request.query);
    }
    const query = normalizeQuery(request.query);
    return enabledModels
      .map((model) => ({ ...model, id: `${model.profile}:${model.model}:${model.reasoningEffort || ""}` }))
      .filter((model) => !query || normalizeQuery(`${model.label} ${model.model} ${model.profile}`).includes(query));
  }

  function getRequest() {
    const value = textarea.value;
    const cursor = textarea.selectionStart;
    if (cursor === null || cursor === undefined) {
      return null;
    }

    const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
    const linePrefix = value.slice(lineStart, cursor);
    if (!linePrefix.startsWith("/")) {
      return null;
    }

    const lineEnd = value.indexOf("\n", cursor);
    const textAfterCursor = value.slice(cursor, lineEnd < 0 ? value.length : lineEnd);
    const normalizedPrefix = linePrefix.toLowerCase();
    if (
      !textAfterCursor &&
      normalizedPrefix.length >= 2 &&
      normalizedPrefix.length < "/model".length &&
      "/model".startsWith(normalizedPrefix)
    ) {
      return {
        type: "model-completion",
        lineStart,
        cursor,
        linePrefix,
        suffix: "/model".slice(linePrefix.length)
      };
    }

    const modelMatch = linePrefix.match(/^\/model(?:\s+(.*))?$/i);
    return {
      type: modelMatch ? "model" : "preset",
      lineStart,
      cursor,
      query: modelMatch ? (modelMatch[1] || "") : linePrefix.slice(1)
    };
  }

  function renderModelCommandCompletion(request) {
    if (!commandCompletionElement) {
      return;
    }
    const prefix = document.createElement("span");
    prefix.className = "model-command-completion-prefix";
    prefix.textContent = request.linePrefix;
    const suffix = document.createElement("span");
    suffix.className = "model-command-completion-suffix";
    suffix.textContent = request.suffix;
    const key = document.createElement("kbd");
    key.textContent = "Tab";
    commandCompletionElement.replaceChildren(prefix, suffix, key);
    commandCompletionElement.hidden = false;
    positionModelCommandCompletion();
  }

  function positionModelCommandCompletion() {
    if (!commandCompletionElement) {
      return;
    }
    const styles = getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 18;
    const currentLine = textarea.value.slice(0, textarea.selectionStart).split("\n");
    const left = Number.parseFloat(styles.paddingLeft) - textarea.scrollLeft;
    const top = Number.parseFloat(styles.paddingTop)
      + (currentLine.length - 1) * lineHeight
      + 1
      - textarea.scrollTop;
    commandCompletionElement.style.left = `${left}px`;
    commandCompletionElement.style.top = `${top}px`;
  }

  function completeModelCommand(request) {
    const value = textarea.value;
    const replacement = "/model ";
    textarea.value = `${value.slice(0, request.lineStart)}${replacement}${value.slice(request.cursor)}`;
    const nextCursor = request.lineStart + replacement.length;
    textarea.setSelectionRange(nextCursor, nextCursor);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function hideModelCommandCompletion() {
    if (!commandCompletionElement) {
      return;
    }
    commandCompletionElement.hidden = true;
    commandCompletionElement.textContent = "";
  }

  function selectOption(option, request) {
    if (request.type === "model") {
      selectModel(option, request);
      return;
    }
    insert(option, request);
  }

  async function selectModel(model, request) {
    try {
      currentModel = {
        ...(await setCurrentAiModelSelection(model)),
        label: model.label || model.model
      };
      const value = textarea.value;
      textarea.value = `${value.slice(0, request.lineStart)}${value.slice(request.cursor)}`;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      textarea.setSelectionRange(request.lineStart, request.lineStart);
      renderModelIndicator();
      hide();
    } catch (error) {
      onError?.(error);
    }
  }

  function renderModelIndicator() {
    if (!modelIndicator) return;
    const label = String(currentModel?.label || currentModel?.model || "").trim();
    modelIndicator.textContent = label;
    modelIndicator.hidden = !label;
  }

  function insert(preset, request) {
    const value = textarea.value;
    const before = value.slice(0, request.lineStart);
    const after = value.slice(request.cursor);
    const separator = before && !before.endsWith("\n") ? "\n" : "";
    const inserted = `${before}${separator}${preset.prompt}`;
    textarea.value = `${inserted}${after}`;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    const nextCursor = inserted.length;
    textarea.focus();
    textarea.setSelectionRange(nextCursor, nextCursor);
    hide();
  }

  function hide() {
    menuElement.hidden = true;
    menuElement.textContent = "";
    hideModelCommandCompletion();
  }

  return {
    load,
    update,
    handleKeydown,
    hide,
    preventBlurDismissal
  };
}

function normalizeQuery(query) {
  return String(query || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
