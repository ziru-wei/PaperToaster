import { listLibraryPapers } from "../storage/library-store.js";

export function createPaperMentionMenuController({
  textarea,
  menuElement,
  isEnabled,
  getSelectedDocumentKeys,
  onSelectPaper,
  onSelectPapers,
  onError
}) {
  let papers = null;
  let loadPromise = null;
  let activeIndex = 0;
  let lastQuery = "";

  async function load({ force = false } = {}) {
    if (loadPromise && !force) {
      return loadPromise;
    }

    loadPromise = listLibraryPapers()
      .then((records) => {
        papers = records
          .filter(isMentionablePaper)
          .sort(comparePapersByLabel);
        update();
      })
      .catch((error) => {
        onError?.(error);
      })
      .finally(() => {
        loadPromise = null;
      });
    return loadPromise;
  }

  function invalidate() {
    papers = null;
    hide();
  }

  function update() {
    const request = getRequest();
    if (!request) {
      hide();
      return;
    }

    if (!papers) {
      renderLoading();
      void load();
      return;
    }

    const requestKey = `${request.mode}:${request.query}`;
    if (requestKey !== lastQuery) {
      activeIndex = 0;
      lastQuery = requestKey;
    }
    const options = getOptions(request);
    activeIndex = Math.min(activeIndex, Math.max(0, options.length - 1));
    render(options, request);
  }

  function handleKeydown(event) {
    const request = getRequest();
    if (!request || menuElement.hidden) {
      return false;
    }

    if (!papers) {
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "Escape") {
          hide();
        }
        return true;
      }
      return false;
    }

    const options = getOptions(request);
    if (!options.length) {
      if (["Enter", "Escape", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "Escape") {
          hide();
        }
        return true;
      }
      return false;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      render(options, request);
      return true;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      render(options, request);
      return true;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      selectOption(options[activeIndex], request);
      return true;
    }
    if (event.key === "Escape") {
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
      empty.textContent = request.mode === "label" ? "No matching labels." : "No matching papers.";
      menuElement.append(empty);
      menuElement.hidden = false;
      return;
    }

    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-preset-option paper-mention-option";
      button.classList.toggle("active", index === activeIndex);
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", String(index === activeIndex));

      if (option.type === "label") {
        renderLabelOption(button, option);
      } else {
        renderPaperOption(button, option.paper);
      }

      button.addEventListener("mouseenter", () => {
        activeIndex = index;
        render(options, request);
      });
      button.addEventListener("click", () => selectOption(option, request));
      menuElement.append(button);
    });

    menuElement.hidden = false;
    menuElement.querySelector(".prompt-preset-option.active")?.scrollIntoView({
      block: "nearest"
    });
  }

  function renderLoading() {
    const loading = document.createElement("div");
    loading.className = "prompt-preset-empty muted";
    loading.textContent = "Loading papers...";
    menuElement.replaceChildren(loading);
    menuElement.hidden = false;
  }

  function getOptions(request) {
    if (request.mode === "label") {
      return filterLabels(request.query);
    }

    const selectedKeys = new Set(getSelectedDocumentKeys?.() || []);
    return papers.filter((paper) => {
      if (selectedKeys.has(paper.documentKey)) {
        return false;
      }
      if (!request.query) {
        return true;
      }
      return normalizeQuery(`${paper.title} ${paper.group || ""}`).includes(request.query);
    }).map((paper) => ({ type: "paper", paper }));
  }

  function filterLabels(query) {
    const labelsByName = new Map();
    papers.forEach((paper) => {
      const name = String(paper.group || "").trim();
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      if (!labelsByName.has(key)) {
        labelsByName.set(key, {
          type: "label",
          name,
          tone: paper.groupTone,
          documentKeys: []
        });
      }
      labelsByName.get(key).documentKeys.push(paper.documentKey);
    });

    return [...labelsByName.values()]
      .filter((label) => !query || normalizeQuery(label.name).includes(query))
      .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
  }

  function getRequest() {
    if (!isEnabled?.()) {
      return null;
    }
    const value = textarea.value;
    const cursor = textarea.selectionStart;
    if (cursor === null || cursor === undefined) {
      return null;
    }
    const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
    const linePrefix = value.slice(lineStart, cursor);
    if (!linePrefix.startsWith("@")) {
      return null;
    }
    const command = linePrefix.slice(1);
    const labelMode = command.startsWith("#");
    return {
      lineStart,
      cursor,
      mode: labelMode ? "label" : "paper",
      query: normalizeQuery(labelMode ? command.slice(1) : command)
    };
  }

  function selectOption(option, request) {
    const value = textarea.value;
    textarea.value = `${value.slice(0, request.lineStart)}${value.slice(request.cursor)}`;
    textarea.focus();
    textarea.setSelectionRange(request.lineStart, request.lineStart);
    hide();
    const selection = option.type === "label"
      ? onSelectPapers?.(option.documentKeys.slice(0, 5))
      : onSelectPaper?.(option.paper.documentKey);
    Promise.resolve(selection)
      .then(() => update())
      .catch((error) => onError?.(error));
  }

  function hide() {
    menuElement.hidden = true;
    menuElement.textContent = "";
    lastQuery = "";
  }

  return {
    load,
    invalidate,
    update,
    handleKeydown,
    hide,
    preventBlurDismissal
  };
}

function renderPaperOption(button, paper) {
  const title = document.createElement("strong");
  title.textContent = paper.title;
  const label = createLabelElement(paper.group || "Unlabeled", paper.groupTone, !paper.group);
  button.append(title, label);
}

function renderLabelOption(button, option) {
  button.classList.add("paper-mention-label-option");
  const label = createLabelElement(option.name, option.tone, false);
  const count = document.createElement("span");
  count.className = "paper-mention-count";
  count.textContent = `${option.documentKeys.length} paper${option.documentKeys.length === 1 ? "" : "s"}`;
  button.append(label, count);
}

function createLabelElement(text, tone, empty) {
  const label = document.createElement("span");
  label.className = "paper-mention-label";
  label.textContent = text;
  if (!empty && Number.isInteger(tone)) {
    label.classList.add(`paper-group-tone-${tone}`);
  } else if (empty) {
    label.classList.add("empty");
  }
  return label;
}

function isMentionablePaper(paper) {
  const title = String(paper?.title || "").trim();
  return Boolean(
    paper?.documentKey &&
    paper.hasMarkdown &&
    title &&
    title.toLowerCase() !== "untitled paper" &&
    title.toLowerCase() !== "title not found"
  );
}

function normalizeQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function comparePapersByLabel(left, right) {
  const leftLabel = normalizeQuery(left.group);
  const rightLabel = normalizeQuery(right.group);
  if (!leftLabel && rightLabel) {
    return 1;
  }
  if (leftLabel && !rightLabel) {
    return -1;
  }
  return leftLabel.localeCompare(rightLabel) ||
    String(left.title || "").localeCompare(String(right.title || ""), undefined, { sensitivity: "base" });
}
