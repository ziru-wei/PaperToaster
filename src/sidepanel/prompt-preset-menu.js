import { getSelectionPromptPresets } from "../storage/prompt-presets-store.js";

export function createPromptPresetMenuController({ textarea, menuElement, onError }) {
  let promptPresets = [];
  let activeIndex = 0;

  async function load() {
    try {
      promptPresets = await getSelectionPromptPresets();
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

    const options = filterPresets(request.query);
    activeIndex = Math.min(activeIndex, Math.max(0, options.length - 1));
    render(options, request);
  }

  function handleKeydown(event) {
    const request = getRequest();
    if (!request || menuElement.hidden) {
      return false;
    }

    const options = filterPresets(request.query);
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
      insert(options[activeIndex], request);
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
      empty.textContent = "No matching prompts.";
      menuElement.append(empty);
      menuElement.hidden = false;
      return;
    }

    options.forEach((preset, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-preset-option";
      button.classList.toggle("active", index === activeIndex);
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", index === activeIndex ? "true" : "false");

      const label = document.createElement("strong");
      label.textContent = preset.label;
      const prompt = document.createElement("span");
      prompt.textContent = preset.prompt;
      button.append(label, prompt);

      button.addEventListener("mouseenter", () => {
        activeIndex = index;
        render(options, request);
      });
      button.addEventListener("click", () => {
        insert(preset, request);
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

    return {
      lineStart,
      cursor,
      query: linePrefix.slice(1)
    };
  }

  function insert(preset, request) {
    const value = textarea.value;
    const before = value.slice(0, request.lineStart);
    const after = value.slice(request.cursor);
    const separator = before && !before.endsWith("\n") ? "\n" : "";
    const inserted = `${before}${separator}${preset.prompt}`;
    textarea.value = `${inserted}${after}`;
    const nextCursor = inserted.length;
    textarea.focus();
    textarea.setSelectionRange(nextCursor, nextCursor);
    hide();
  }

  function hide() {
    menuElement.hidden = true;
    menuElement.textContent = "";
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
