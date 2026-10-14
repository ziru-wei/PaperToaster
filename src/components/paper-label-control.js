import {
  DEFAULT_LABEL_COLUMN_ID,
  LABEL_TONE_COUNT,
  getLabelTone,
  getPaperLabels,
  normalizeLabelList,
  normalizeLabelName
} from "../storage/label-columns.js";

// A multi-select label property. The button shows the paper's labels as pills;
// the editor toggles labels on and off and stays open, like Notion's
// multi-select. Enter switches to edit mode to create, rename, recolor or
// delete labels.

export const normalizePaperLabel = normalizeLabelName;

export function getPaperLabelToneClass(tone, appearance = "colored") {
  return appearance === "gray" ? "paper-group-gray" : `paper-group-tone-${tone}`;
}

// Every label used in a column across papers, with its color.
export function getPaperLabelOptions(papers, { columnId = DEFAULT_LABEL_COLUMN_ID, settings = null, appearance = "colored" } = {}) {
  const options = new Map();
  for (const paper of papers || []) {
    for (const name of getPaperLabels(paper, columnId)) {
      const key = name.toLowerCase();
      if (options.has(key)) continue;
      const legacyTone = columnId === DEFAULT_LABEL_COLUMN_ID ? paper.groupTone : null;
      const tone = getLabelTone(settings, columnId, name, legacyTone);
      options.set(key, { name, tone, toneClass: getPaperLabelToneClass(tone, appearance) });
    }
  }
  return [...options.values()].sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

// A column whose value is just "yes" or "no" reads as a check or a cross.
const YES_LABELS = new Set(["yes", "y", "true", "是"]);
const NO_LABELS = new Set(["no", "n", "false", "否"]);

export function getYesNoLabelValue(labels) {
  if (labels.length !== 1) return null;
  const value = labels[0].toLowerCase();
  if (YES_LABELS.has(value)) return true;
  if (NO_LABELS.has(value)) return false;
  return null;
}

export function createPaperLabelControl({
  paper,
  columnId = DEFAULT_LABEL_COLUMN_ID,
  columnName = "Label",
  labels = getPaperLabels(paper, columnId),
  options = [],
  appearance = "colored",
  // "card" shows "<column name> ✓"; "list" shows only the mark.
  yesNoDisplay = "card",
  onChangeLabels,
  onRenameLabel,
  onDeleteLabel,
  onSetLabelTone
}) {
  const selected = normalizeLabelList(labels);
  const control = document.createElement("div");
  control.className = "paper-group-control";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-group-button";
  button.dataset.labelAnchor = `${paper?.documentKey || ""}|${columnId}`;
  button.classList.toggle("empty", !selected.length);
  const yesNo = getYesNoLabelValue(selected);
  if (yesNo !== null) {
    button.classList.add("yes-no", yesNo ? "yes" : "no");
    if (yesNoDisplay === "card") {
      const name = document.createElement("span");
      name.className = "paper-group-yes-no-name";
      name.textContent = columnName;
      button.append(name);
    }
    const mark = document.createElement("span");
    mark.className = "paper-group-yes-no-mark";
    mark.setAttribute("aria-hidden", "true");
    button.append(mark);
  } else {
    for (const name of selected) {
      button.append(createLabelPill(name, findOption(options, name), appearance));
    }
  }
  button.title = selected.length ? `${columnName}: ${selected.join(", ")}` : `Add ${columnName}`;
  button.setAttribute("aria-label", selected.length ? `Edit ${columnName}: ${selected.join(", ")}` : `Add ${columnName}`);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPaperLabelEditor({
      button,
      columnName,
      selected,
      options,
      appearance,
      onChangeLabels,
      onRenameLabel,
      onDeleteLabel,
      onSetLabelTone
    });
  });

  control.append(button);
  return control;
}

function createLabelPill(name, option, appearance) {
  const pill = document.createElement("span");
  pill.className = ["paper-group-pill", getPaperLabelToneClass(option?.tone ?? 0, appearance)].join(" ");
  pill.textContent = name;
  return pill;
}

function getNextUnusedTone(options) {
  const used = new Set(options.map((option) => option.tone));
  for (let tone = 0; tone < LABEL_TONE_COUNT; tone += 1) {
    if (!used.has(tone)) return tone;
  }
  return options.length % LABEL_TONE_COUNT;
}

function findOption(options, name) {
  const key = normalizeLabelName(name).toLowerCase();
  return options.find((option) => option.name.toLowerCase() === key);
}

// Like Notion's multi-select menu: the paper's labels sit as chips beside a
// search box; typing filters, Enter picks the match or creates the label, and
// each option's "⋯" opens rename, color and delete in place.
function openPaperLabelEditor({
  button: initialButton,
  columnName,
  selected: initialSelected,
  options: initialOptions,
  appearance,
  onChangeLabels,
  onRenameLabel,
  onDeleteLabel,
  onSetLabelTone
}) {
  closePaperLabelEditors();
  let button = initialButton;
  const anchorKey = button.dataset.labelAnchor;
  let selected = [...initialSelected];
  let options = [...initialOptions];
  let expanded = "";
  button.classList.add("editing");

  const editor = document.createElement("div");
  editor.className = "paper-group-editor";
  editor.dataset.keyboardScope = "paper-label";
  editor.tabIndex = -1;
  editor.addEventListener("pointerdown", (event) => event.stopPropagation());
  editor.addEventListener("click", (event) => event.stopPropagation());

  const searchRow = document.createElement("div");
  searchRow.className = "paper-group-search";
  const input = document.createElement("input");
  input.className = "paper-group-input";
  input.type = "text";
  input.placeholder = "Search or create…";
  input.setAttribute("aria-label", `Search or create a ${columnName} label`);

  const hint = document.createElement("div");
  hint.className = "paper-group-editor-heading";
  hint.textContent = "Select an option or create one";

  const list = document.createElement("div");
  list.className = "paper-group-options";

  const isSelected = (name) => selected.some((item) => item.toLowerCase() === name.toLowerCase());

  const commit = async (next) => {
    selected = normalizeLabelList(next);
    for (const name of selected) {
      // A label made here shows the color it will be saved with: the next unused one.
      if (!findOption(options, name)) options = [...options, { name, tone: getNextUnusedTone(options) }];
    }
    render();
    try {
      await onChangeLabels?.(selected);
    } catch (error) {
      console.debug("[Paper Toaster] Could not update labels", error);
    }
  };

  const toggle = (name) => commit(isSelected(name)
    ? selected.filter((item) => item.toLowerCase() !== name.toLowerCase())
    : [...selected, name]);

  const rename = async (oldName, newName) => {
    const from = normalizeLabelName(oldName);
    const to = normalizeLabelName(newName);
    if (!from || !to || from === to) return;
    options = options.map((option) => option.name === from ? { ...option, name: to } : option);
    selected = selected.map((item) => item === from ? to : item);
    expanded = to;
    render();
    try {
      await onRenameLabel?.(from, to);
    } catch (error) {
      console.debug("[Paper Toaster] Could not rename label", error);
    }
  };

  const remove = async (name) => {
    if (!window.confirm(`Delete label "${name}"? Every paper loses it from ${columnName}.`)) return;
    options = options.filter((option) => option.name !== name);
    selected = selected.filter((item) => item !== name);
    expanded = "";
    render();
    try {
      await onDeleteLabel?.(name);
    } catch (error) {
      console.debug("[Paper Toaster] Could not delete label", error);
    }
  };

  const recolor = async (name, tone) => {
    options = options.map((option) => option.name === name ? { ...option, tone } : option);
    render();
    try {
      await onSetLabelTone?.(name, tone);
    } catch (error) {
      console.debug("[Paper Toaster] Could not recolor label", error);
    }
  };

  function render() {
    // Chips for the paper's labels, then the search box.
    searchRow.replaceChildren(...selected.map((name) => {
      const chip = createLabelPill(name, findOption(options, name), appearance);
      chip.classList.add("paper-group-chip");
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "paper-group-chip-remove";
      removeButton.setAttribute("aria-label", `Remove ${name}`);
      removeButton.textContent = "×";
      removeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle(name);
      });
      chip.append(removeButton);
      return chip;
    }), input);

    const typed = normalizeLabelName(input.value);
    const query = typed.toLowerCase();
    const visible = query ? options.filter((option) => option.name.toLowerCase().includes(query)) : options;
    const children = visible.map((option) => createOptionRow({
      option,
      appearance,
      selected: isSelected(option.name),
      expanded: expanded === option.name,
      onToggle: () => toggle(option.name),
      onExpand: () => {
        expanded = expanded === option.name ? "" : option.name;
        render();
      },
      onRename: rename,
      onDelete: remove,
      onPickTone: (tone) => recolor(option.name, tone)
    }));
    if (typed && !options.some((option) => option.name.toLowerCase() === query)) {
      const create = document.createElement("button");
      create.type = "button";
      create.className = "paper-group-option paper-group-create";
      create.append("Create ", createLabelPill(typed, { tone: getNextUnusedTone(options) }, appearance));
      create.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        input.value = "";
        void commit([...selected, typed]);
        input.focus();
      });
      children.push(create);
    }
    if (!children.length) {
      const empty = document.createElement("div");
      empty.className = "paper-group-empty";
      empty.textContent = "Type a name to create a label";
      children.push(empty);
    }
    list.replaceChildren(...children);
  }

  input.addEventListener("input", render);
  input.addEventListener("beforeinput", (event) => event.stopPropagation());
  input.addEventListener("click", (event) => event.stopPropagation());
  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      const name = normalizeLabelName(input.value);
      if (!name) return;
      const match = findOption(options, name) ||
        options.find((option) => option.name.toLowerCase().includes(name.toLowerCase()));
      input.value = "";
      void (match ? toggle(match.name) : commit([...selected, name]));
    } else if (event.key === "Backspace" && !input.value && selected.length) {
      event.preventDefault();
      void commit(selected.slice(0, -1));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusAdjacentOption(editor, 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePaperLabelEditors();
    }
  });

  editor.addEventListener("keydown", (event) => {
    if (event.target === input || event.target.closest?.(".paper-group-option-panel")) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      focusAdjacentOption(editor, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closePaperLabelEditors();
    }
  }, true);

  editor.append(searchRow, hint, list);
  // The editor floats on the page so no scrolling or clipped container can cut it off.
  document.body.append(editor);
  render();
  // Changing labels re-renders the board, replacing the button: follow its replacement.
  let positionFrame = requestAnimationFrame(function followButton() {
    if (!button.isConnected) {
      const replacement = document.querySelector(`.paper-group-button[data-label-anchor="${CSS.escape(anchorKey)}"]`);
      if (!replacement) {
        closePaperLabelEditors();
        return;
      }
      button = replacement;
      button.classList.add("editing");
    }
    positionPaperLabelEditor(editor, button);
    positionFrame = requestAnimationFrame(followButton);
  });
  positionPaperLabelEditor(editor, button);
  input.focus({ preventScroll: true });

  const closeOnOutside = (event) => {
    if (!button.contains(event.target) && !editor.contains(event.target)) {
      closePaperLabelEditors();
    }
  };
  editor._paperGroupCleanup = () => {
    cancelAnimationFrame(positionFrame);
    document.removeEventListener("pointerdown", closeOnOutside, true);
    button.classList.remove("editing");
  };
  window.setTimeout(() => {
    document.addEventListener("pointerdown", closeOnOutside, true);
  }, 0);
}

function createOptionRow({ option, appearance, selected, expanded, onToggle, onExpand, onRename, onDelete, onPickTone }) {
  const wrapper = document.createElement("div");
  wrapper.className = "paper-group-option-wrapper";
  wrapper.classList.toggle("expanded", expanded);

  const row = document.createElement("div");
  row.className = "paper-group-option";
  row.classList.toggle("active", selected);
  row.tabIndex = 0;
  row.setAttribute("role", "menuitemcheckbox");
  row.setAttribute("aria-checked", String(selected));
  row.append(createLabelPill(option.name, option, appearance));
  row.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  });
  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  });

  const more = document.createElement("button");
  more.type = "button";
  more.className = "paper-group-option-more";
  more.setAttribute("aria-label", `Edit ${option.name}`);
  more.setAttribute("aria-expanded", String(expanded));
  more.textContent = "⋯";
  more.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onExpand();
  });
  row.append(more);
  wrapper.append(row);

  if (expanded) {
    const panel = document.createElement("div");
    panel.className = "paper-group-option-panel";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "paper-group-rename-input";
    nameInput.value = option.name;
    nameInput.setAttribute("aria-label", `Rename ${option.name}`);
    const save = () => onRename(option.name, nameInput.value);
    for (const type of ["click", "pointerdown", "beforeinput"]) {
      nameInput.addEventListener(type, (event) => event.stopPropagation());
    }
    nameInput.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        save();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onExpand();
      }
    });
    nameInput.addEventListener("blur", save);

    const palette = document.createElement("div");
    palette.className = "paper-group-palette";
    palette.setAttribute("role", "group");
    palette.setAttribute("aria-label", `Colors for ${option.name}`);
    for (let tone = 0; tone < LABEL_TONE_COUNT; tone += 1) {
      const color = document.createElement("button");
      color.type = "button";
      color.className = `paper-group-palette-swatch paper-group-tone-${tone}`;
      color.classList.toggle("active", tone === option.tone);
      color.setAttribute("aria-label", `Color ${tone + 1}`);
      color.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        onPickTone(tone);
      });
      palette.append(color);
    }

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "paper-group-delete-label";
    deleteButton.textContent = "Delete label";
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onDelete(option.name);
    });
    panel.append(nameInput, palette, deleteButton);
    wrapper.append(panel);
  }
  return wrapper;
}

function focusAdjacentOption(editor, direction) {
  const candidates = [...editor.querySelectorAll(".paper-group-input, .paper-group-option")];
  if (!candidates.length) return;
  const currentIndex = candidates.indexOf(document.activeElement);
  const nextIndex = currentIndex < 0
    ? direction > 0 ? 0 : candidates.length - 1
    : (currentIndex + direction + candidates.length) % candidates.length;
  candidates[nextIndex].focus({ preventScroll: true });
}

// Below the label button, or above it when the viewport has no room below.
function positionPaperLabelEditor(editor, button) {
  const anchor = button.getBoundingClientRect();
  const { width, height } = editor.getBoundingClientRect();
  const margin = 8;
  const below = anchor.bottom + 4;
  const top = below + height > window.innerHeight - margin && anchor.top - 4 - height >= margin
    ? anchor.top - 4 - height
    : below;
  const left = Math.max(margin, Math.min(anchor.left, window.innerWidth - width - margin));
  editor.style.top = `${Math.round(top)}px`;
  editor.style.left = `${Math.round(left)}px`;
}

export function closePaperLabelEditors() {
  document.querySelectorAll(".paper-group-editor").forEach((editor) => {
    editor._paperGroupCleanup?.();
    editor.remove();
  });
}
