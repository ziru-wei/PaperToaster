const ICONS = Object.freeze({
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
  select: '<path d="M5 3h4M3 5v4M19 3h-4M21 5v4M5 21h4M3 19v-4M19 21h-4M21 19v-4"></path><path d="m9 9 8 3-4 2-2 4z"></path>',
  sort: '<path d="M3 6h12M3 12h8M3 18h4"></path><path d="m17 14 3 3 3-3M20 17V7"></path>',
  group: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="18" height="7" rx="1"></rect>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12"></path><circle cx="12" cy="12" r="2.5"></circle>',
  archive: '<rect x="3" y="5" width="18" height="4" rx="1"></rect><path d="M5 9v10h14V9M10 13h4"></path>',
  library: '<path d="M3 21h18M5 18V9M9 18V9M15 18V9M19 18V9M3 7l9-4 9 4z"></path>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"></path><path d="M4 19h16"></path>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"></path>',
  send: '<path d="M7 7h10v10M7 17 17 7"></path>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"></path>',
  more: '<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>',
  grip: '<circle cx="9" cy="6" r="1"></circle><circle cx="15" cy="6" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="18" r="1"></circle><circle cx="15" cy="18" r="1"></circle>'
});

export function createIcon(name, options = {}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", options.fill || "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", options.strokeWidth || "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.innerHTML = ICONS[name] || ICONS.more;
  return svg;
}

export function createIconButton({
  icon = "more",
  label,
  active = false,
  disabled = false,
  onClick
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ptk-icon-button";
  button.classList.toggle("is-active", Boolean(active));
  button.disabled = Boolean(disabled);
  button.setAttribute("aria-label", label || icon);
  button.setAttribute("aria-pressed", String(Boolean(active)));
  button.append(createIcon(icon));
  button.addEventListener("click", () => {
    const detail = { action: icon, active: button.classList.contains("is-active") };
    onClick?.(detail, button);
    emit(button, "ptk:action", detail);
  });
  return button;
}

export function createDashboardToolbar({
  searchValue = "",
  searchPlaceholder = "Search papers...",
  actions = [],
  status = "",
  onSearch
} = {}) {
  const header = el("header", "ptk-dashboard-header");
  const toolbar = el("div", "ptk-toolbar");
  const searchWrap = el("label", "ptk-search-wrap");
  const search = document.createElement("input");
  search.type = "search";
  search.className = "ptk-search";
  search.value = searchValue;
  search.placeholder = searchPlaceholder;
  search.setAttribute("aria-label", searchPlaceholder);
  search.addEventListener("input", () => {
    const detail = { value: search.value };
    onSearch?.(detail, search);
    emit(search, "ptk:search", detail);
  });
  searchWrap.append(search, withClass(createIcon("search"), "ptk-search-wrap__icon"));
  toolbar.append(searchWrap);

  for (const action of actions) {
    if (action.spacer) {
      toolbar.append(el("span", "ptk-toolbar__spacer"));
      continue;
    }
    toolbar.append(action.element || createIconButton(action));
  }

  const statusElement = el("p", "ptk-status", status);
  header.append(toolbar, statusElement);
  return header;
}

export function createSortMenu({ options = [], activeId = "", label = "Sort records", onChange } = {}) {
  const control = el("div", "ptk-sort-control");
  const trigger = createIconButton({ icon: "sort", label });
  trigger.classList.add("ptk-sort-button");
  trigger.classList.remove("ptk-icon-button");
  trigger.setAttribute("aria-expanded", "false");
  const menu = el("div", "ptk-sort-menu");
  menu.setAttribute("role", "menu");
  menu.hidden = true;

  for (const option of options) {
    const item = el("button", "ptk-sort-menu__option", option.label);
    item.type = "button";
    item.classList.toggle("is-active", option.id === activeId);
    item.classList.toggle("is-grouping", Boolean(option.grouping));
    item.disabled = Boolean(option.grouping);
    item.setAttribute("role", "menuitem");
    item.addEventListener("click", () => {
      menu.querySelectorAll(".is-active").forEach((node) => node.classList.remove("is-active"));
      item.classList.add("is-active");
      close();
      const detail = { id: option.id, option };
      onChange?.(detail, control);
      emit(control, "ptk:sort-change", detail);
    });
    menu.append(item);
  }

  const close = () => {
    menu.hidden = true;
    trigger.classList.remove("is-active");
    trigger.setAttribute("aria-expanded", "false");
  };
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const opening = menu.hidden;
    menu.hidden = !opening;
    trigger.classList.toggle("is-active", opening);
    trigger.setAttribute("aria-expanded", String(opening));
  });
  document.addEventListener("click", (event) => {
    if (!control.contains(event.target)) close();
  });
  control.append(trigger, menu);
  return control;
}

export function createBulkActions({ selectedCount = 0, visible = true, actions = [] } = {}) {
  const bar = el("section", "ptk-bulk-actions");
  bar.classList.toggle("is-hidden", !visible);
  bar.setAttribute("aria-live", "polite");
  const summary = el("span", "ptk-bulk-actions__summary", `${selectedCount} selected`);
  bar.append(summary);

  for (const action of actions) {
    const button = el("button", `ptk-button${action.danger ? " is-danger" : ""}`);
    button.type = "button";
    button.disabled = Boolean(action.disabled);
    if (action.icon) button.append(createIcon(action.icon));
    button.append(document.createTextNode(action.label));
    button.addEventListener("click", () => {
      const detail = { id: action.id, selectedCount };
      action.onClick?.(detail, button);
      emit(bar, "ptk:action", detail);
    });
    bar.append(button);
  }
  return bar;
}

export function createLabelChip({ label = "", tone = "neutral", onClick } = {}) {
  const chip = document.createElement(onClick ? "button" : "span");
  if (onClick) chip.type = "button";
  chip.className = "ptk-label";
  chip.dataset.tone = normalizeTone(tone);
  chip.classList.toggle("is-empty", !label);
  chip.textContent = label || "+";
  if (onClick) {
    chip.setAttribute("aria-label", label ? `Edit label: ${label}` : "Add label");
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      const detail = { label, tone: chip.dataset.tone };
      onClick(detail, chip);
      emit(chip, "ptk:label-click", detail);
    });
  }
  return chip;
}

export function createLabelControl({
  label = "",
  tone = "neutral",
  options = [],
  maxLabels = 5,
  open = false,
  confirmDelete = ({ label: name }) => globalThis.confirm?.(`Delete label "${name}"? All related items will lose this label.`) ?? true,
  onChange,
  onCreate,
  onRename,
  onDelete
} = {}) {
  const state = {
    label: normalizeLabel(label),
    tone: normalizeTone(tone),
    options: normalizeLabelOptions(options),
    managing: false
  };
  const control = el("div", "ptk-label-control");
  const button = createLabelChip({
    label: state.label,
    tone: state.tone,
    onClick: () => openEditor()
  });
  control.append(button);

  function syncButton() {
    button.textContent = state.label || "+";
    button.dataset.tone = state.label ? state.tone : "neutral";
    button.classList.toggle("is-empty", !state.label);
    button.setAttribute("aria-label", state.label ? `Edit label: ${state.label}` : "Add label");
  }

  function openEditor() {
    closeLabelEditors();
    button.classList.add("is-editing");
    state.managing = false;
    const editor = el("div", "ptk-label-editor");
    editor.tabIndex = -1;
    const input = el("input", "ptk-label-editor__input");
    input.type = "text";
    input.placeholder = "Label";
    input.setAttribute("aria-label", "Paper label");
    input.hidden = true;
    const optionsBox = el("div", "ptk-label-editor__options");
    const hint = el("div", "ptk-label-editor__hint");

    const render = () => {
      editor.classList.toggle("is-managing", state.managing);
      input.hidden = !state.managing;
      const children = state.managing
        ? state.options.map((option) => createEditableOption(option, editor, render))
        : state.options.map((option) => createSelectableOption(option, editor));
      const proposed = normalizeLabel(input.value);
      const exists = state.options.some((option) => option.name.toLowerCase() === proposed.toLowerCase());
      const atLimit = Boolean(state.managing && proposed && !exists && state.options.length >= maxLabels);
      if (atLimit) {
        const warning = el("div", "ptk-label-editor__limit");
        warning.append(document.createTextNode("⚠ That's too much!"));
        children.unshift(warning);
      }
      if (!children.length) {
        children.push(el("div", "ptk-label-editor__empty", state.managing ? "Type to create" : "No labels"));
      }
      optionsBox.replaceChildren(...children);
      hint.replaceChildren(createLabelHint(state.managing, Boolean(state.label)));
    };

    const setManaging = (value) => {
      state.managing = value;
      input.value = "";
      render();
      if (value) input.focus();
      else editor.focus({ preventScroll: true });
    };

    const createFromInput = () => {
      const name = normalizeLabel(input.value);
      if (!name) return;
      const existing = state.options.find((option) => option.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        selectOption(existing, editor);
        return;
      }
      if (state.options.length >= maxLabels) {
        input.classList.remove("is-limit-warning");
        void input.offsetWidth;
        input.classList.add("is-limit-warning");
        render();
        return;
      }
      const option = { name, tone: firstAvailableTone(state.options) };
      state.options.push(option);
      onCreate?.({ label: name, tone: option.tone, options: [...state.options] }, control);
      emit(control, "ptk:label-create", { label: name, tone: option.tone });
      selectOption(option, editor);
    };

    const selectOption = (option, editorElement) => {
      state.label = option.name;
      state.tone = option.tone;
      syncButton();
      const detail = { label: state.label, tone: state.tone };
      onChange?.(detail, control);
      emit(control, "ptk:label-change", detail);
      closeEditor(editorElement);
    };

    const clearLabel = () => {
      state.label = "";
      state.tone = "neutral";
      syncButton();
      const detail = { label: "", tone: "neutral" };
      onChange?.(detail, control);
      emit(control, "ptk:label-change", detail);
      closeEditor(editor);
    };

    function createSelectableOption(option, editorElement) {
      const optionButton = el("button", "ptk-label-option", option.name);
      optionButton.type = "button";
      optionButton.dataset.tone = option.tone;
      optionButton.classList.toggle("is-active", option.name === state.label);
      optionButton.addEventListener("click", () => selectOption(option, editorElement));
      return optionButton;
    }

    function createEditableOption(option, editorElement, rerender) {
      const chip = el("span", "ptk-label-edit-chip");
      chip.dataset.tone = option.tone;
      chip.classList.toggle("is-active", option.name === state.label);
      const renameInput = el("input", "ptk-label-edit-chip__input");
      renameInput.type = "text";
      renameInput.value = option.name;
      renameInput.setAttribute("aria-label", `Rename label ${option.name}`);
      let initialValue = option.name;
      const commitRename = () => {
        const next = normalizeLabel(renameInput.value);
        if (!next || next === initialValue) {
          renameInput.value = initialValue;
          return;
        }
        if (state.options.some((item) => item !== option && item.name.toLowerCase() === next.toLowerCase())) {
          renameInput.value = initialValue;
          return;
        }
        const previous = initialValue;
        option.name = next;
        initialValue = next;
        if (state.label === previous) {
          state.label = next;
          syncButton();
        }
        const detail = { previousLabel: previous, label: next, tone: option.tone };
        onRename?.(detail, control);
        emit(control, "ptk:label-rename", detail);
        rerender();
      };
      renameInput.addEventListener("keydown", (event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          commitRename();
        } else if (event.key === "Escape") {
          renameInput.value = initialValue;
          renameInput.blur();
        }
      });
      renameInput.addEventListener("blur", commitRename);
      const remove = el("button", "ptk-label-edit-chip__delete", "×");
      remove.type = "button";
      remove.setAttribute("aria-label", `Delete label ${option.name}`);
      remove.addEventListener("pointerdown", (event) => event.preventDefault());
      remove.addEventListener("click", () => {
        const previous = option.name;
        if (!confirmDelete({ label: previous, tone: option.tone }, control)) return;
        state.options = state.options.filter((item) => item !== option);
        if (state.label === previous) {
          state.label = "";
          state.tone = "neutral";
          syncButton();
        }
        const detail = { label: previous, tone: option.tone, options: [...state.options] };
        onDelete?.(detail, control);
        emit(control, "ptk:label-delete", detail);
        rerender();
      });
      chip.append(renameInput, remove);
      return chip;
    }

    input.addEventListener("input", render);
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        createFromInput();
      } else if (event.key === "Escape" || event.key === "ArrowLeft") {
        event.preventDefault();
        setManaging(false);
      }
    });
    editor.addEventListener("keydown", (event) => {
      if (event.target.matches("input")) return;
      if (event.key === "Enter") {
        event.preventDefault();
        setManaging(true);
      } else if (event.key === "Backspace" && state.label) {
        event.preventDefault();
        clearLabel();
      } else if (event.key === "Escape") {
        closeEditor(editor);
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        focusAdjacentLabelControl(editor, event.key === "ArrowDown" ? 1 : -1);
      }
    });
    editor.addEventListener("pointerdown", (event) => event.stopPropagation());
    editor.append(input, optionsBox, hint);
    control.append(editor);
    render();
    editor.focus({ preventScroll: true });

    const closeOnOutside = (event) => {
      if (!control.contains(event.target)) closeEditor(editor);
    };
    editor._ptkCleanup = () => {
      document.removeEventListener("pointerdown", closeOnOutside, true);
      button.classList.remove("is-editing");
    };
    window.setTimeout(() => document.addEventListener("pointerdown", closeOnOutside, true), 0);
  }

  if (open) {
    queueMicrotask(() => button.click());
  }
  return control;
}

export function createPaperCard({
  id,
  title = "Untitled paper",
  label = "",
  labelTone = "neutral",
  messageCount = 0,
  messageScale = 20,
  showMessageRing = true,
  starred = false,
  active = false,
  selected = false,
  related = false,
  labelOptions = [],
  maxLabels = 5,
  onActivate,
  onToggleStar,
  onLabelChange,
  onLabelCreate,
  onLabelRename,
  onLabelDelete
} = {}) {
  const card = el("article", "ptk-paper-card");
  card.dataset.id = String(id || "");
  setVisualState(card, { active, selected, related });

  const activate = el("button", "ptk-paper-card__activate");
  activate.type = "button";
  activate.setAttribute("aria-label", `Open ${title}`);
  if (showMessageRing) activate.append(createMessageRing(messageCount, messageScale));
  activate.append(el("h3", "ptk-paper-card__title", title));
  activate.addEventListener("click", () => {
    const suppressUntil = Number(card.dataset.suppressClickUntil) || 0;
    delete card.dataset.suppressClickUntil;
    if (performance.now() < suppressUntil) return;
    const detail = { id: card.dataset.id, title };
    onActivate?.(detail, card);
    emit(card, "ptk:activate", detail);
  });

  const footer = el("footer", "ptk-paper-card__footer");
  const meta = el("div", "ptk-paper-card__meta");
  meta.append(createLabelControl({
    label,
    tone: labelTone,
    options: labelOptions,
    maxLabels,
    onChange: onLabelChange,
    onCreate: onLabelCreate,
    onRename: onLabelRename,
    onDelete: onLabelDelete
  }));
  const star = createStarButton({ id, title, starred, onToggleStar });
  footer.append(star, meta);
  card.append(activate, footer);
  return card;
}

export function createPaperGroup({
  id,
  label = "Unlabeled",
  tone = "neutral",
  cards = [],
  draggable = false,
  selectState = "none",
  onToggleSelection
} = {}) {
  const section = el("section", "ptk-paper-group");
  section.dataset.id = String(id || label);
  section.dataset.tone = normalizeTone(tone);
  const header = el("header", "ptk-paper-group__header");
  if (draggable) {
    const handle = el("button", "ptk-paper-group__drag-handle");
    handle.type = "button";
    handle.setAttribute("aria-label", `Drag to reorder ${label}`);
    handle.append(createIcon("grip"));
    header.append(handle);
  }
  if (onToggleSelection && !draggable) {
    const select = el("button", "ptk-paper-group__select");
    select.type = "button";
    select.classList.toggle("is-active", selectState === "all");
    select.classList.toggle("is-partial", selectState === "partial");
    select.setAttribute("aria-label", `Select ${label}`);
    select.addEventListener("click", () => {
      const detail = { id: section.dataset.id, selected: selectState !== "all" };
      onToggleSelection(detail, section);
      emit(section, "ptk:selection-change", detail);
    });
    header.append(select);
  }
  header.append(el("h2", "ptk-paper-group__title", label));
  const grid = el("div", "ptk-paper-group__grid");
  grid.append(...cards);
  section.append(header, grid);
  return section;
}

export function enableDashboardDragAndDrop(container, {
  onReorderGroups,
  onMoveCard,
  cardLongPressMs = 500,
  cardMoveTolerance = 8
} = {}) {
  let pending = null;
  let active = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerDown = (event) => {
    if (event.button !== 0 || active) return;
    const handle = event.target.closest(".ptk-paper-group__drag-handle");
    if (handle) {
      const group = handle.closest(".ptk-paper-group");
      if (!group) return;
      pending = createPending("group", event, group, handle);
      handle.setPointerCapture?.(event.pointerId);
      return;
    }

    const card = event.target.closest(".ptk-paper-card");
    if (!card || event.target.closest(".ptk-star, input, .ptk-label-control")) return;
    pending = createPending("card", event, card, card);
    pending.timer = window.setTimeout(() => beginDrag(pending), cardLongPressMs);
    card.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (event.pointerId !== pending?.pointerId) return;
    pending.lastX = event.clientX;
    pending.lastY = event.clientY;
    const distance = Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY);
    if (pending.type === "group" && distance >= 4) {
      event.preventDefault();
      beginDrag(pending);
    } else if (pending.type === "card" && distance > cardMoveTolerance) {
      cancelPending();
    }
  };

  const onPointerEnd = (event) => {
    if (event.pointerId === pending?.pointerId) cancelPending();
  };

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerEnd);
  container.addEventListener("pointercancel", onPointerEnd);

  function createPending(type, event, source, captureTarget) {
    return {
      type,
      pointerId: event.pointerId,
      source,
      captureTarget,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      originalParent: source.parentNode,
      originalNextSibling: source.nextSibling,
      timer: 0
    };
  }

  function beginDrag(drag) {
    if (!drag || pending !== drag || !drag.source.isConnected) return;
    pending = null;
    window.clearTimeout(drag.timer);
    const rect = drag.source.getBoundingClientRect();
    const preview = drag.source.cloneNode(true);
    preview.classList.add(drag.type === "group" ? "ptk-group-drag-preview" : "ptk-card-drag-preview");
    preview.setAttribute("aria-hidden", "true");
    preview.inert = true;
    Object.assign(preview.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
    document.body.append(preview);
    document.body.classList.add("ptk-drag-active");
    drag.captureTarget.releasePointerCapture?.(drag.pointerId);
    container.setPointerCapture?.(drag.pointerId);
    drag.source.classList.add(drag.type === "group" ? "ptk-group-drag-placeholder" : "ptk-card-drag-placeholder");
    if (drag.type === "card") drag.source.dataset.suppressClickUntil = String(performance.now() + 700);
    active = {
      ...drag,
      preview,
      grabOffsetX: drag.startX - rect.left,
      grabOffsetY: drag.startY - rect.top,
      targetGroup: null,
      autoScrollFrame: 0,
      indicator: drag.type === "group" ? el("div", "ptk-group-drop-indicator") : null
    };
    if (active.indicator) document.body.append(active.indicator);
    positionPreview();
    updateTarget();
    window.addEventListener("pointermove", onActiveMove, true);
    window.addEventListener("pointerup", onActiveUp, true);
    window.addEventListener("pointercancel", onActiveCancel, true);
    document.addEventListener("keydown", onKeyDown, true);
    active.autoScrollFrame = requestAnimationFrame(autoScroll);
  }

  function onActiveMove(event) {
    if (event.pointerId !== active?.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    active.lastX = event.clientX;
    active.lastY = event.clientY;
    positionPreview();
    updateTarget();
  }

  function onActiveUp(event) {
    if (event.pointerId !== active?.pointerId) return;
    event.preventDefault();
    finish(false);
  }

  function onActiveCancel(event) {
    if (event.pointerId === active?.pointerId) finish(true);
  }

  function onKeyDown(event) {
    if (event.key !== "Escape" || !active) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    finish(true);
  }

  function positionPreview() {
    if (!active) return;
    active.preview.style.left = `${active.lastX - active.grabOffsetX}px`;
    active.preview.style.top = `${active.lastY - active.grabOffsetY}px`;
  }

  function updateTarget() {
    if (!active) return;
    if (active.type === "group") {
      const groups = [...container.querySelectorAll(":scope > .ptk-paper-group")]
        .filter((group) => group !== active.source);
      const reference = groups.find((group) => active.lastY < group.getBoundingClientRect().top + group.offsetHeight / 2) || null;
      if (active.source.nextSibling !== reference) container.insertBefore(active.source, reference);
      const rect = active.source.getBoundingClientRect();
      Object.assign(active.indicator.style, {
        left: `${rect.left + 6}px`,
        top: `${rect.top - 3}px`,
        width: `${Math.max(0, rect.width - 12)}px`
      });
      return;
    }

    const groups = [...container.querySelectorAll(":scope > .ptk-paper-group")];
    const sourceGroup = active.source.closest(".ptk-paper-group");
    const next = groups.find((group) => {
      const grid = group.querySelector(".ptk-paper-group__grid");
      const rect = grid?.getBoundingClientRect();
      return rect && active.lastX >= rect.left && active.lastX <= rect.right && active.lastY >= rect.top && active.lastY <= rect.bottom;
    });
    const target = next && next !== sourceGroup ? next : null;
    if (target === active.targetGroup) return;
    active.targetGroup?.classList.remove("is-drop-target");
    active.targetGroup = target;
    target?.classList.add("is-drop-target");
  }

  function autoScroll() {
    if (!active) return;
    const edge = 52;
    const amount = active.lastY < edge
      ? -Math.ceil((edge - active.lastY) / 7)
      : window.innerHeight - active.lastY < edge
        ? Math.ceil((edge - (window.innerHeight - active.lastY)) / 7)
        : 0;
    if (amount) {
      window.scrollBy(0, amount);
      updateTarget();
    }
    active.autoScrollFrame = requestAnimationFrame(autoScroll);
  }

  function finish(cancelled) {
    if (!active) return;
    const drag = active;
    active = null;
    cancelAnimationFrame(drag.autoScrollFrame);
    window.removeEventListener("pointermove", onActiveMove, true);
    window.removeEventListener("pointerup", onActiveUp, true);
    window.removeEventListener("pointercancel", onActiveCancel, true);
    document.removeEventListener("keydown", onKeyDown, true);
    container.releasePointerCapture?.(drag.pointerId);

    if (cancelled) {
      drag.originalParent.insertBefore(drag.source, drag.originalNextSibling?.parentNode === drag.originalParent ? drag.originalNextSibling : null);
    }
    if (!cancelled && drag.type === "card" && drag.targetGroup) {
      drag.targetGroup.querySelector(".ptk-paper-group__grid")?.append(drag.source);
    }

    const targetRect = drag.source.getBoundingClientRect();
    drag.preview.style.animation = "none";
    drag.preview.style.transform = drag.type === "card" ? "scale(1.015)" : "scale(1.01)";
    drag.preview.getBoundingClientRect();
    drag.preview.classList.add("is-settling");
    Object.assign(drag.preview.style, {
      left: `${targetRect.left}px`,
      top: `${targetRect.top}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
      transform: "scale(1)"
    });
    drag.indicator?.classList.add("is-leaving");
    drag.targetGroup?.classList.remove("is-drop-target");

    if (!cancelled && drag.type === "group") {
      const order = [...container.querySelectorAll(":scope > .ptk-paper-group")].map((group) => group.dataset.id);
      onReorderGroups?.({ order });
      emit(container, "ptk:groups-reordered", { order });
    } else if (!cancelled && drag.type === "card" && drag.targetGroup) {
      const detail = { cardId: drag.source.dataset.id, groupId: drag.targetGroup.dataset.id };
      onMoveCard?.(detail);
      emit(container, "ptk:card-moved", detail);
    }

    const cleanup = () => {
      drag.source.classList.remove("ptk-group-drag-placeholder", "ptk-card-drag-placeholder");
      drag.preview.remove();
      drag.indicator?.remove();
      document.body.classList.remove("ptk-drag-active");
    };
    if (reduceMotion) cleanup();
    else window.setTimeout(cleanup, 150);
  }

  function cancelPending() {
    if (!pending) return;
    window.clearTimeout(pending.timer);
    pending.captureTarget.releasePointerCapture?.(pending.pointerId);
    pending = null;
  }

  return {
    destroy() {
      cancelPending();
      if (active) finish(true);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerEnd);
      container.removeEventListener("pointercancel", onPointerEnd);
    }
  };
}

export function createComparisonCard({
  id,
  title = "Comparative Reading",
  time = "none",
  starred = false,
  active = false,
  selected = false,
  related = false,
  onActivate,
  onToggleStar
} = {}) {
  const card = el("article", "ptk-comparison-card");
  card.dataset.id = String(id || "");
  setVisualState(card, { active, selected, related });
  const activate = el("button", "ptk-comparison-card__activate");
  activate.type = "button";
  activate.setAttribute("aria-label", `Open comparison: ${title}`);
  activate.append(el("h3", "ptk-comparison-card__title", title));
  activate.addEventListener("click", () => {
    const detail = { id: card.dataset.id, title };
    onActivate?.(detail, card);
    emit(card, "ptk:activate", detail);
  });
  const meta = el("div", "ptk-comparison-card__meta");
  meta.append(el("span", "", time), createStarButton({ id, title, starred, onToggleStar }));
  card.append(activate, meta);
  return card;
}

export function createFloatingAction({ icon = "send", label = "Continue", onClick } = {}) {
  const button = el("button", "ptk-floating-action");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.append(createIcon(icon));
  button.addEventListener("click", () => {
    const detail = { action: icon };
    onClick?.(detail, button);
    emit(button, "ptk:action", detail);
  });
  return button;
}

export function createKeyboardHint({ keys = [], text = "" } = {}) {
  const hint = el("p", "ptk-keyboard-hint");
  for (const key of keys) {
    hint.append(el("kbd", "", key));
  }
  hint.append(document.createTextNode(text));
  return hint;
}

export function createEmptyState({ message = "Nothing here yet" } = {}) {
  const state = el("div", "ptk-empty-state");
  state.append(el("p", "", message));
  return state;
}

export function createMessageRing(count = 0, scale = 20) {
  const ring = el("span", "ptk-message-ring");
  const normalizedCount = Math.max(0, Number(count) || 0);
  const progress = Math.min(1, normalizedCount / Math.max(1, Number(scale) || 20));
  ring.style.setProperty("--ptk-ring-ratio", progress.toFixed(3));
  ring.classList.toggle("is-empty", normalizedCount === 0);
  ring.setAttribute("aria-label", `${normalizedCount} messages`);
  ring.title = `${normalizedCount} messages`;
  return ring;
}

export function setVisualState(element, state = {}) {
  for (const key of ["active", "selected", "related", "disabled"]) {
    if (key in state) element.classList.toggle(`is-${key}`, Boolean(state[key]));
  }
  return element;
}

function createStarButton({ id, title, starred = false, onToggleStar }) {
  const button = el("button", "ptk-star");
  button.type = "button";
  button.classList.toggle("is-starred", Boolean(starred));
  button.setAttribute("aria-label", `${starred ? "Unstar" : "Star"} ${title}`);
  button.setAttribute("aria-pressed", String(Boolean(starred)));
  button.append(createIcon("star"));
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const next = !button.classList.contains("is-starred");
    button.classList.toggle("is-starred", next);
    button.setAttribute("aria-pressed", String(next));
    button.setAttribute("aria-label", `${next ? "Unstar" : "Star"} ${title}`);
    const detail = { id: String(id || ""), starred: next };
    onToggleStar?.(detail, button);
    emit(button, "ptk:star-change", detail);
  });
  return button;
}

function normalizeTone(tone) {
  const value = String(tone);
  return ["0", "1", "2", "3", "4"].includes(value) ? value : "neutral";
}

function normalizeLabel(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 64);
}

function normalizeLabelOptions(options) {
  const seen = new Set();
  return (Array.isArray(options) ? options : []).flatMap((option, index) => {
    const name = normalizeLabel(option?.name ?? option?.label ?? option);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return [];
    seen.add(key);
    return [{ name, tone: normalizeTone(option?.tone ?? index) }];
  });
}

function firstAvailableTone(options) {
  const used = new Set(options.map((option) => normalizeTone(option.tone)));
  return ["0", "1", "2", "3", "4"].find((tone) => !used.has(tone)) || "neutral";
}

function createLabelHint(managing, hasLabel) {
  const content = el("span", "ptk-label-editor__hint-content");
  const rows = managing
    ? [["←", "Back"], ["↵", "Confirm"]]
    : [["↵", "to edit"], ...(hasLabel ? [["⌫", "to clear"]] : [])];
  for (const [key, text] of rows) {
    const row = el("span", "ptk-label-editor__hint-row");
    row.append(document.createTextNode("Press"), el("kbd", "", key), document.createTextNode(text));
    content.append(row);
  }
  return content;
}

function focusAdjacentLabelControl(editor, direction) {
  const candidates = [...editor.querySelectorAll("button, input")].filter((element) => !element.hidden && !element.disabled);
  if (!candidates.length) return;
  const current = candidates.indexOf(document.activeElement);
  const next = current < 0 ? (direction > 0 ? 0 : candidates.length - 1) : (current + direction + candidates.length) % candidates.length;
  candidates[next].focus({ preventScroll: true });
}

function closeEditor(editor) {
  editor?._ptkCleanup?.();
  editor?.remove();
}

function closeLabelEditors() {
  document.querySelectorAll(".ptk-label-editor").forEach(closeEditor);
}

function emit(element, name, detail) {
  element.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

function el(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== "") element.textContent = String(text);
  return element;
}

function withClass(element, className) {
  element.classList.add(className);
  return element;
}
