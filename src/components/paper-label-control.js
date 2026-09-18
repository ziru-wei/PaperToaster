const PAPER_LABEL_TONE_COUNT = 5;

export function createPaperLabelControl({
  paper,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  groupOptions = [],
  appearance = "colored",
  enforceLimit = true
}) {
  const group = normalizePaperLabel(paper.group);
  const control = document.createElement("div");
  control.className = "paper-group-control";

  const button = document.createElement("button");
  button.type = "button";
  button.className = [
    "paper-group-button",
    appearance === "gray" ? "paper-group-gray" : "",
    appearance !== "gray" && group ? getPaperGroupToneClass(group, groupOptions, paper.groupTone) : ""
  ].filter(Boolean).join(" ");
  button.classList.toggle("empty", !group);
  button.textContent = group || "+";
  button.setAttribute("aria-label", group ? `Edit label: ${group}` : "Add label");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPaperLabelEditor({
      control,
      button,
      paper,
      group,
      groupOptions,
      onUpdatePaperGroup,
      onRenamePaperGroup,
      onDeletePaperGroup,
      enforceLimit
    });
  });

  control.append(button);
  return control;
}

export function getPaperLabelOptions(papers, options = {}) {
  const optionsByName = new Map();
  for (const paper of papers || []) {
    const name = normalizePaperLabel(paper.group);
    if (!name) {
      continue;
    }

    const key = name.toLowerCase();
    if (!optionsByName.has(key)) {
      optionsByName.set(key, {
        name,
        toneClass: options.appearance === "gray"
          ? "paper-group-gray"
          : getPaperGroupToneClass(name, [], paper.groupTone)
      });
    }
  }

  return [...optionsByName.values()]
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

export function normalizePaperLabel(group) {
  return String(group || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

function openPaperLabelEditor({
  control,
  button,
  paper,
  group,
  groupOptions,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  enforceLimit
}) {
  closePaperLabelEditors();
  button.classList.add("editing");
  let editMode = false;

  const editor = document.createElement("div");
  editor.className = "paper-group-editor";
  editor.dataset.keyboardScope = "paper-label";
  editor.tabIndex = -1;
  editor.addEventListener("pointerdown", (event) => event.stopPropagation());
  editor.addEventListener("click", (event) => event.stopPropagation());

  const input = document.createElement("input");
  input.className = "paper-group-input";
  input.type = "text";
  input.value = "";
  input.placeholder = "Label";
  input.setAttribute("aria-label", "Paper label");
  input.hidden = true;

  const options = document.createElement("div");
  options.className = "paper-group-options";

  const prompt = document.createElement("div");
  prompt.className = "paper-group-key-prompt";
  let limitWarningActive = false;

  const saveGroup = async (value) => {
    const nextGroup = normalizePaperLabel(value);
    if (nextGroup === group) {
      closePaperLabelEditors();
      return;
    }
    if (enforceLimit && !canUsePaperGroup(nextGroup, groupOptions)) {
      renderOptions();
      return;
    }

    closePaperLabelEditors();
    try {
      await onUpdatePaperGroup?.(paper, nextGroup);
    } catch (error) {
      console.debug("[Paper Toaster] Could not update paper group", error);
    }
  };

  const renameGroup = async (oldValue, newValue) => {
    const oldName = normalizePaperLabel(oldValue);
    const newName = normalizePaperLabel(newValue);
    if (!oldName || !newName || oldName.toLowerCase() === newName.toLowerCase()) {
      renderOptions();
      return;
    }

    try {
      await onRenamePaperGroup?.(oldName, newName);
      closePaperLabelEditors();
    } catch (error) {
      console.debug("[Paper Toaster] Could not rename paper label", error);
    }
  };

  const deleteGroup = async (value) => {
    const label = normalizePaperLabel(value);
    if (!label) {
      return;
    }

    const confirmed = window.confirm(`Delete label "${label}"? All related papers will lose this label.`);
    if (!confirmed) {
      return;
    }

    try {
      await onDeletePaperGroup?.(label);
      closePaperLabelEditors();
    } catch (error) {
      console.debug("[Paper Toaster] Could not delete paper label", error);
    }
  };

  const toggleEditMode = () => {
    const focusedRenameInput = editor.querySelector(".paper-group-edit-input:focus");
    focusedRenameInput?.blur();
    editMode = !editMode;
    input.value = "";
    renderOptions();
    if (editMode) {
      input.focus();
    } else {
      editor.focus({ preventScroll: true });
    }
  };

  const renderOptions = () => {
    const normalizedOptions = groupOptions.filter((option) => option.name);
    editor.classList.toggle("edit-mode", editMode);
    input.hidden = !editMode;
    const children = editMode
      ? normalizedOptions.map((option) => createEditablePaperGroupOption({
        option,
        active: option.name === group,
        onRename: renameGroup,
        onDelete: deleteGroup
      }))
      : normalizedOptions.map((option) => createPaperGroupOption({
        label: option.name,
        toneSource: option.name,
        toneClass: option.toneClass,
        groupOptions,
        active: option.name === group,
        onSelect: () => saveGroup(option.name)
      }));
    const typedGroup = normalizePaperLabel(input.value);
    const hasExactMatch = groupOptions.some((option) => option.name.toLowerCase() === typedGroup.toLowerCase());
    const hasAvailableTone = !enforceLimit || groupOptions.length < PAPER_LABEL_TONE_COUNT;
    const limitExceeded = Boolean(editMode && typedGroup && !hasExactMatch && !hasAvailableTone);
    if (limitExceeded && !limitWarningActive) {
      input.classList.add("limit-shake");
    } else if (!limitExceeded) {
      input.classList.remove("limit-shake");
    }
    limitWarningActive = limitExceeded;
    if (limitExceeded) {
      const limit = document.createElement("div");
      limit.className = "paper-group-limit-warning";
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "⚠";
      const text = document.createElement("span");
      text.textContent = "That's too much!";
      limit.append(icon, text);
      children.unshift(limit);
    }
    if (!children.length) {
      const empty = document.createElement("div");
      empty.className = "paper-group-empty";
      empty.textContent = editMode ? "Type to create" : "No labels";
      children.push(empty);
    }
    options.replaceChildren(...children);

    prompt.replaceChildren(createPaperGroupKeyPrompt(editMode, Boolean(group)));
  };

  input.addEventListener("input", renderOptions);
  input.addEventListener("beforeinput", (event) => event.stopPropagation());
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      if (normalizePaperLabel(input.value)) {
        saveGroup(input.value);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      toggleEditMode();
    }
  });
  input.addEventListener("click", (event) => event.stopPropagation());

  editor.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      focusAdjacentPaperGroupLabel(editor, editMode, event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (!editMode && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      toggleEditMode();
      return;
    }
    if (!editMode && group && event.key === "Backspace") {
      event.preventDefault();
      event.stopPropagation();
      saveGroup("");
      return;
    }
    if (editMode && event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      toggleEditMode();
    }
  }, true);

  editor.append(input, options, prompt);
  control.append(editor);
  renderOptions();
  editor.focus({ preventScroll: true });

  const closeOnOutside = (event) => {
    if (!control.contains(event.target)) {
      closePaperLabelEditors();
    }
  };
  editor._paperGroupCleanup = () => {
    document.removeEventListener("pointerdown", closeOnOutside, true);
    button.classList.remove("editing");
  };
  window.setTimeout(() => {
    document.addEventListener("pointerdown", closeOnOutside, true);
  }, 0);
}

function createPaperGroupOption({
  label,
  toneSource = "",
  toneClass = "",
  groupOptions = [],
  active = false,
  danger = false,
  onSelect
}) {
  const option = document.createElement("button");
  option.type = "button";
  option.className = [
    "paper-group-option",
    toneClass || (toneSource ? getPaperGroupToneClass(toneSource, groupOptions) : "")
  ].filter(Boolean).join(" ");
  option.classList.toggle("active", active);
  option.classList.toggle("danger", danger);
  option.textContent = label;
  let handledPointerDown = false;
  option.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    handledPointerDown = true;
    event.preventDefault();
    event.stopPropagation();
    onSelect();
  });
  option.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (handledPointerDown) {
      handledPointerDown = false;
      return;
    }
    onSelect();
  });
  return option;
}

function createPaperGroupKeyPrompt(editMode, hasGroup) {
  const prompt = document.createElement("span");
  prompt.className = "paper-group-key-prompt-content";
  if (editMode) {
    prompt.append(
      createPaperGroupKeyPromptRow("←", "Back"),
      createPaperGroupKeyPromptRow("↵", "Confirm")
    );
  } else {
    prompt.append(createPaperGroupKeyPromptRow("↵", "to edit"));
    if (hasGroup) {
      prompt.append(createPaperGroupKeyPromptRow("⌫", "to clear"));
    }
  }
  return prompt;
}

function createPaperGroupKeyPromptRow(symbol, label) {
  const row = document.createElement("span");
  row.className = "paper-group-key-prompt-row";
  const prefix = document.createElement("span");
  prefix.textContent = "Press";
  const key = document.createElement("kbd");
  key.textContent = symbol;
  const text = document.createElement("span");
  text.textContent = label;
  row.append(prefix, key, text);
  return row;
}

function focusAdjacentPaperGroupLabel(editor, editMode, direction) {
  const selector = editMode
    ? ".paper-group-input, .paper-group-edit-input"
    : ".paper-group-option";
  const candidates = [...editor.querySelectorAll(selector)].filter((element) => !element.hidden);
  if (!candidates.length) {
    return;
  }
  const currentIndex = candidates.indexOf(document.activeElement);
  const nextIndex = currentIndex < 0
    ? direction > 0 ? 0 : candidates.length - 1
    : (currentIndex + direction + candidates.length) % candidates.length;
  candidates[nextIndex].focus({ preventScroll: true });
}

function createEditablePaperGroupOption({ option, active = false, onRename, onDelete }) {
  const chip = document.createElement("span");
  chip.className = ["paper-group-edit-chip", option.toneClass || ""].filter(Boolean).join(" ");
  chip.classList.toggle("active", active);

  const input = document.createElement("input");
  input.className = "paper-group-edit-input";
  input.type = "text";
  input.value = option.name;
  input.setAttribute("aria-label", `Rename label ${option.name}`);
  const saveRename = () => onRename(option.name, input.value);
  input.addEventListener("click", (event) => event.stopPropagation());
  input.addEventListener("pointerdown", (event) => event.stopPropagation());
  input.addEventListener("beforeinput", (event) => event.stopPropagation());
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      saveRename();
    } else if (event.key === "Escape") {
      event.preventDefault();
      input.value = option.name;
      input.blur();
    }
  });
  input.addEventListener("blur", saveRename);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "paper-group-delete";
  deleteButton.setAttribute("aria-label", `Delete label ${option.name}`);
  deleteButton.textContent = "×";
  let handledDeletePointerDown = false;
  deleteButton.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    handledDeletePointerDown = true;
    event.preventDefault();
    event.stopPropagation();
    onDelete(option.name);
  });
  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (handledDeletePointerDown) {
      handledDeletePointerDown = false;
      return;
    }
    onDelete(option.name);
  });
  chip.append(input, deleteButton);
  return chip;
}

function closePaperLabelEditors() {
  document.querySelectorAll(".paper-group-editor").forEach((editor) => {
    editor._paperGroupCleanup?.();
    editor.remove();
  });
}

function getPaperGroupToneClass(group, groupOptions = [], preferredTone = null) {
  const toneNumber = Number(preferredTone);
  if (Number.isInteger(toneNumber) && toneNumber >= 0 && toneNumber < PAPER_LABEL_TONE_COUNT) {
    return `paper-group-tone-${toneNumber}`;
  }
  const normalizedGroup = normalizePaperLabel(group);
  const option = groupOptions.find((groupOption) => {
    const optionName = normalizePaperLabel(groupOption?.name || groupOption);
    return optionName.toLowerCase() === normalizedGroup.toLowerCase();
  });
  if (option?.toneClass) {
    return option.toneClass;
  }
  return getAvailablePaperGroupToneClass(groupOptions, normalizedGroup);
}

function getAvailablePaperGroupToneClass(groupOptions = [], group = "") {
  const usedIndexes = new Set(groupOptions
    .map((option) => String(option?.toneClass || "").match(/^paper-group-tone-(\d)$/)?.[1])
    .filter((index) => index !== undefined)
    .map(Number));
  for (let index = 0; index < PAPER_LABEL_TONE_COUNT; index += 1) {
    if (!usedIndexes.has(index)) {
      return `paper-group-tone-${index}`;
    }
  }
  return `paper-group-tone-${getStableGroupToneIndex(group)}`;
}

function canUsePaperGroup(group, groupOptions = []) {
  const normalizedGroup = normalizePaperLabel(group);
  if (!normalizedGroup) {
    return true;
  }
  if (groupOptions.some((option) => option.name.toLowerCase() === normalizedGroup.toLowerCase())) {
    return true;
  }
  return groupOptions.length < PAPER_LABEL_TONE_COUNT;
}

function getStableGroupToneIndex(group) {
  const text = normalizePaperLabel(group).toLowerCase();
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % PAPER_LABEL_TONE_COUNT;
}
