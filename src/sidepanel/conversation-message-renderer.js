import { renderMarkdownInto } from "../markdown/render-markdown.js";
import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";
import { annotate } from "../../vendor/rough-notation/rough-notation.mjs";
import { createToasterEmptyState } from "./toaster-empty-state.js";

const highlightBarCleanups = new WeakMap();

export function renderConversationMessages(threadElement, messages, options = {}) {
  highlightBarCleanups.get(threadElement)?.();
  highlightBarCleanups.delete(threadElement);
  threadElement.textContent = "";
  threadElement.classList.remove("saved-qa-thread");
  threadElement.hidden = !messages.length;
  const editBars = [];
  const cleanupCallbacks = [];

  messages.forEach((message, messageIndex) => {
    const item = document.createElement("article");
    item.className = `conversation-message ${message.role}`;
    item.dataset.messageIndex = String(messageIndex);
    if (message.pending) {
      item.classList.add("pending");
    }
    if (message.role === "user" && isQuestionInSavedUnit(messages, messageIndex)) {
      item.classList.add("saved-unit");
    }

    const text = document.createElement("div");
    text.className = "conversation-text";
    renderMessageText(text, message);
    if (message.role === "assistant" && !message.pending) {
      wireRenderedAnnotations({
        textElement: text,
        messageIndex,
        onRemoveAssistantHighlight: options.onRemoveAssistantHighlight,
        onRemoveAssistantCircle: options.onRemoveAssistantCircle,
        onRemoveAssistantHiddenText: options.onRemoveAssistantHiddenText,
        cleanupCallbacks
      });
    }

    if (message.role === "user" && message.selectionText) {
      const quote = document.createElement("blockquote");
      quote.className = "conversation-selection";
      quote.tabIndex = 0;
      quote.setAttribute("aria-label", "Selected text");
      quote.textContent = message.selectionText;
      item.append(quote);
    }

    item.append(text);
    if (message.role === "assistant" && !message.pending) {
      if (typeof options.onHighlightAssistantSelection === "function") {
        const editBar = createAssistantEditBar({
          anchorElement: item,
          targetElement: text,
          onHighlightSelection: (selectedText) => options.onHighlightAssistantSelection(messageIndex, selectedText),
          onCircleSelection: typeof options.onCircleAssistantSelection === "function"
            ? (selectedText) => options.onCircleAssistantSelection(messageIndex, selectedText)
            : null,
          onHideSelection: typeof options.onHideAssistantSelection === "function"
            ? (selectedText) => options.onHideAssistantSelection(messageIndex, selectedText)
            : null
        });
        editBars.push(editBar);
        item.append(editBar.bar);
      }
      item.append(createAssistantActionRow({
        message,
        messageIndex,
        onToggleSaved: options.onToggleSaved,
        onDeleteUnit: options.onDeleteUnit
      }));
    }
    threadElement.append(item);
  });

  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
}

function isQuestionInSavedUnit(messages, messageIndex) {
  const nextMessage = messages[messageIndex + 1];
  return Boolean(
    nextMessage &&
    nextMessage.role === "assistant" &&
    !nextMessage.pending &&
    isMessageSaved(nextMessage)
  );
}

export function renderSavedQuestionAnswerUnits(threadElement, units, options = {}) {
  highlightBarCleanups.get(threadElement)?.();
  highlightBarCleanups.delete(threadElement);
  threadElement.textContent = "";
  threadElement.classList.add("saved-qa-thread");
  threadElement.hidden = false;

  if (!units.length) {
    threadElement.append(createToasterEmptyState("Toaster is plugged in...", {
      className: "saved-qa-empty"
    }));
    return;
  }

  const pinnedRow = document.createElement("div");
  pinnedRow.className = "saved-qa-pinned-row";
  const track = document.createElement("div");
  track.className = "saved-qa-track";
  const editBars = [];
  const cleanupCallbacks = [];
  const normalItems = [];

  units.forEach((unit) => {
    const unitElement = createSavedQuestionAnswerUnitElement({
      unit,
      options,
      editBars,
      cleanupCallbacks
    });

    if (unit.isPinned) {
      pinnedRow.append(unitElement);
    } else {
      normalItems.push({
        unit,
        element: unitElement,
        estimatedHeight: estimateSavedQuestionAnswerUnitHeight(
          unit,
          options.collapsedUnitKeys?.has(getSavedQuestionAnswerUnitKey(unit))
        )
      });
    }
  });

  appendBalancedSavedQuestionAnswerUnits(track, normalItems);
  track.classList.toggle("single-note", normalItems.length === 1);
  if (pinnedRow.children.length) {
    threadElement.append(pinnedRow);
  }
  if (track.children.length) {
    threadElement.append(track);
  }
  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
}

function appendBalancedSavedQuestionAnswerUnits(track, items) {
  const sortedItems = [...items].sort(compareSavedQuestionAnswerUnitItemsByAge);
  if (sortedItems.length <= 1) {
    sortedItems.forEach((item) => track.append(item.element));
    return;
  }

  const columns = [
    createSavedQuestionAnswerColumn(),
    createSavedQuestionAnswerColumn()
  ];

  sortedItems.forEach((item) => {
    const column = chooseSavedQuestionAnswerColumn(columns, item);
    column.height += item.estimatedHeight;
    column.lastWasLong = isLongSavedQuestionAnswerItem(item);
    column.element.append(item.element);
  });

  columns.forEach((column) => track.append(column.element));
}

function createSavedQuestionAnswerColumn() {
  const element = document.createElement("div");
  element.className = "saved-qa-column";
  return {
    element,
    height: 0,
    lastWasLong: false
  };
}

function chooseSavedQuestionAnswerColumn(columns, item) {
  if (!columns[0].element.children.length) {
    return columns[0];
  }

  if (!columns[1].element.children.length) {
    return columns[1];
  }

  return columns
    .map((column) => ({
      column,
      score: column.height + getSavedQuestionAnswerLongItemPenalty(column, item)
    }))
    .sort((left, right) => left.score - right.score)[0].column;
}

function getSavedQuestionAnswerLongItemPenalty(column, item) {
  return column.lastWasLong && isLongSavedQuestionAnswerItem(item)
    ? item.estimatedHeight * 0.35
    : 0;
}

function isLongSavedQuestionAnswerItem(item) {
  return item.estimatedHeight >= 280;
}

function compareSavedQuestionAnswerUnitItemsByAge(left, right) {
  return getSavedQuestionAnswerUnitTime(left.unit) - getSavedQuestionAnswerUnitTime(right.unit);
}

function getSavedQuestionAnswerUnitTime(unit) {
  return Number(unit?.answerCreatedAt || unit?.createdAt || unit?.questionCreatedAt) || 0;
}

function estimateSavedQuestionAnswerUnitHeight(unit, isCollapsed) {
  const questionLines = estimateWrappedLines(unit?.question, 31);
  const baseHeight = 30 + questionLines * 15;
  if (isCollapsed) {
    return baseHeight + 16;
  }

  const answerText = stripMarkdownAnnotationTokens(unit?.answer || "");
  const answerLines = estimateWrappedLines(answerText, 36);
  const codeBonus = countMarkdownCodeBlocks(unit?.answer || "") * 18;
  const selectionBonus = unit?.selectionText
    ? 36 + estimateWrappedLines(unit.selectionText, 44) * 8
    : 0;

  return baseHeight + answerLines * 14 + codeBonus + selectionBonus + 32;
}

function estimateWrappedLines(text, charsPerLine) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return 1;
  }

  return Math.max(1, Math.ceil(normalized.length / charsPerLine));
}

function stripMarkdownAnnotationTokens(text) {
  return String(text || "").replace(/\{\{(?:highlight64|hide64|circle64):[^}]+}}/g, "");
}

function countMarkdownCodeBlocks(text) {
  return (String(text || "").match(/```/g) || []).length / 2;
}

function createSavedQuestionAnswerUnitElement({ unit, options, editBars, cleanupCallbacks }) {
  const unitKey = getSavedQuestionAnswerUnitKey(unit);
  const isComparisonUnit = unit?.sourceType === "comparison";
  const unitElement = document.createElement("article");
  unitElement.className = "saved-qa-unit";
  unitElement.dataset.savedUnitKey = unitKey;
  if (options.collapsedUnitKeys?.has(unitKey)) {
    unitElement.classList.add("collapsed");
  }

  const cardShadow = document.createElement("div");
  cardShadow.className = "saved-qa-card-shadow";

  const card = document.createElement("div");
  card.className = "saved-qa-card";

  const question = document.createElement("div");
  question.className = "saved-qa-question";
  question.tabIndex = 0;
  question.setAttribute("role", "button");
  question.setAttribute("aria-expanded", String(!unitElement.classList.contains("collapsed")));
  const questionText = document.createElement("span");
  questionText.className = "saved-qa-question-text";
  questionText.textContent = unit.question || "Question unavailable";
  question.append(questionText);
  if (!isComparisonUnit) {
    question.append(createSavedJumpButton(unit, options.onJumpToUnit));
  }
  question.addEventListener("click", () => toggleSavedQuestionAnswerUnit(unitElement, question));
  question.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleSavedQuestionAnswerUnit(unitElement, question);
  });

  const answer = document.createElement("div");
  answer.className = "saved-qa-answer";
  renderMarkdownInto(answer, normalizeAiResponseMarkdown(unit.answer || ""), { omitHiddenText: true });
  decorateSavedCodeBlocks(answer);
  if (
    isComparisonUnit ||
    typeof options.onRemoveSavedAnswerHighlight === "function" ||
    typeof options.onRemoveSavedAnswerCircle === "function" ||
    typeof options.onRemoveSavedAnswerHiddenText === "function"
  ) {
    wireRenderedAnnotations({
      textElement: answer,
      onRemoveHighlight: !isComparisonUnit && typeof options.onRemoveSavedAnswerHighlight === "function"
        ? (highlightIndex) => options.onRemoveSavedAnswerHighlight(unit, highlightIndex)
        : null,
      onRemoveCircle: !isComparisonUnit && typeof options.onRemoveSavedAnswerCircle === "function"
        ? (circleIndex) => options.onRemoveSavedAnswerCircle(unit, circleIndex)
        : null,
      onRemoveHiddenText: !isComparisonUnit && typeof options.onRemoveSavedAnswerHiddenText === "function"
        ? (hiddenIndex) => options.onRemoveSavedAnswerHiddenText(unit, hiddenIndex)
        : null,
      cleanupCallbacks
    });
  }

  card.append(question, answer);
  if (!isComparisonUnit) {
    card.append(createSavedPinButton(unit, options.onTogglePinned));
  }
  cardShadow.append(card);
  unitElement.append(cardShadow);

  if (!isComparisonUnit && typeof options.onHighlightSavedAnswerSelection === "function") {
    const editBar = createAssistantEditBar({
      anchorElement: unitElement,
      targetElement: answer,
      onHighlightSelection: (selectedText) => options.onHighlightSavedAnswerSelection(unit, selectedText),
      onCircleSelection: typeof options.onCircleSavedAnswerSelection === "function"
        ? (selectedText) => options.onCircleSavedAnswerSelection(unit, selectedText)
        : null,
      onHideSelection: typeof options.onHideSavedAnswerSelection === "function"
        ? (selectedText) => options.onHideSavedAnswerSelection(unit, selectedText)
        : null
    });
    editBars.push(editBar);
    unitElement.append(editBar.bar);
  }

  if (unit.selectionText) {
    const selection = document.createElement("blockquote");
    selection.className = "saved-qa-selection";
    selection.tabIndex = 0;
    selection.setAttribute("aria-label", "Selected text");
    selection.setAttribute("aria-expanded", "false");
    const selectionText = document.createElement("span");
    selectionText.className = "saved-qa-selection-text";
    selectionText.textContent = unit.selectionText;
    selection.append(selectionText);
    selection.addEventListener("click", () => toggleSavedSelection(selection));
    selection.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      toggleSavedSelection(selection);
    });
    unitElement.append(selection);
  }

  return unitElement;
}

function decorateSavedCodeBlocks(answerElement) {
  answerElement.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement?.classList.contains("saved-code-block-frame")) {
      return;
    }

    const frame = document.createElement("div");
    frame.className = "saved-code-block-frame";
    pre.replaceWith(frame);
    frame.append(pre);
  });
}

function createSavedJumpButton(unit, onJumpToUnit) {
  const button = document.createElement("button");
  button.className = "saved-qa-jump";
  button.type = "button";
  button.setAttribute("aria-label", "Go to conversation");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    Promise.resolve(onJumpToUnit?.(unit)).catch((error) => {
      console.debug("[Paper Toaster] Could not jump to conversation unit", error);
    });
  });

  const icon = document.createElement("span");
  icon.className = "icon-mask saved-qa-jump-icon";
  icon.setAttribute("aria-hidden", "true");
  button.append(icon);
  return button;
}

function createSavedPinButton(unit, onTogglePinned) {
  const button = document.createElement("button");
  button.className = "saved-qa-pin";
  button.classList.toggle("pinned", Boolean(unit.isPinned));
  button.type = "button";
  button.setAttribute("aria-label", unit.isPinned ? "Unpin saved Q&A" : "Pin saved Q&A");
  button.setAttribute("aria-pressed", String(Boolean(unit.isPinned)));
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    Promise.resolve(onTogglePinned?.(unit)).catch((error) => {
      console.debug("[Paper Toaster] Could not update saved Q&A pin", error);
    });
  });

  const icon = document.createElement("span");
  icon.className = "icon-mask saved-qa-pin-icon";
  icon.setAttribute("aria-hidden", "true");
  button.append(icon);
  return button;
}

function toggleSavedSelection(selection) {
  const shouldExpand = !selection.classList.contains("expanded");
  selection.classList.toggle("expanded", shouldExpand);
  selection.setAttribute("aria-expanded", String(shouldExpand));
  if (!shouldExpand) {
    selection.scrollTop = 0;
  }
}

function toggleSavedQuestionAnswerUnit(unitElement, questionElement) {
  const shouldCollapse = !unitElement.classList.contains("collapsed");
  setSavedQuestionAnswerUnitCollapsed(unitElement, shouldCollapse, questionElement);
  unitElement.dispatchEvent(new CustomEvent("saved-qa-unit-collapse-change", { bubbles: true }));
}

export function setSavedQuestionAnswerUnitsCollapsed(threadElement, collapsed) {
  const units = Array.from(threadElement.querySelectorAll(".saved-qa-unit"));
  units.forEach((unitElement) => setSavedQuestionAnswerUnitCollapsed(unitElement, collapsed));
  return units.length > 0;
}

export function areSavedQuestionAnswerUnitsCollapsed(threadElement) {
  const units = Array.from(threadElement.querySelectorAll(".saved-qa-unit"));
  return units.length > 0 && units.every((unitElement) => unitElement.classList.contains("collapsed"));
}

export function getSavedQuestionAnswerCollapsedUnitKeys(threadElement) {
  return new Set(
    Array.from(threadElement.querySelectorAll(".saved-qa-unit.collapsed"))
      .map((unitElement) => unitElement.dataset.savedUnitKey || "")
      .filter(Boolean)
  );
}

function setSavedQuestionAnswerUnitCollapsed(unitElement, collapsed, questionElement = null) {
  unitElement.classList.toggle("collapsed", Boolean(collapsed));
  const question = questionElement || unitElement.querySelector(".saved-qa-question");
  question?.setAttribute("aria-expanded", String(!collapsed));
}

function getSavedQuestionAnswerUnitKey(unit) {
  if (unit?.sourceType === "comparison") {
    const comparisonId = String(unit?.comparisonId || "").trim();
    const assistantMessageIndex = Number(unit?.assistantMessageIndex);
    return `comparison:${comparisonId}:${Number.isInteger(assistantMessageIndex) ? assistantMessageIndex : ""}`;
  }

  const threadId = String(unit?.threadId || "").trim();
  const assistantMessageIndex = Number(unit?.assistantMessageIndex);
  return `${threadId}:${Number.isInteger(assistantMessageIndex) ? assistantMessageIndex : ""}`;
}

function renderMessageText(element, message) {
  if (message.pending) {
    element.classList.add("pending-text");
    element.setAttribute("aria-live", "polite");
    element.textContent = message.text || "Toasting the pages...";
    return;
  }

  if (message.role === "assistant") {
    renderMarkdownInto(element, normalizeAiResponseMarkdown(message.text));
    return;
  }

  element.textContent = message.text;
}

function registerHighlightEditBars(threadElement, editBars, cleanupCallbacks = []) {
  if (!editBars.length && !cleanupCallbacks.length) {
    return;
  }

  const update = () => {
    window.requestAnimationFrame(() => updateAssistantEditBars(editBars));
  };
  const hide = (event) => {
    if (event.target.closest?.(".conversation-edit-bar")) {
      return;
    }
    hideAssistantEditBars(editBars);
  };
  document.addEventListener("pointerup", update);
  threadElement.addEventListener("keyup", update);
  document.addEventListener("pointerdown", hide);
  window.addEventListener("resize", update);
  highlightBarCleanups.set(threadElement, () => {
    document.removeEventListener("pointerup", update);
    threadElement.removeEventListener("keyup", update);
    document.removeEventListener("pointerdown", hide);
    window.removeEventListener("resize", update);
    cleanupCallbacks.forEach((cleanup) => cleanup());
  });
}

function wireRenderedAnnotations({
  textElement,
  messageIndex,
  onRemoveAssistantHighlight,
  onRemoveAssistantCircle,
  onRemoveAssistantHiddenText,
  onRemoveHighlight,
  onRemoveCircle,
  onRemoveHiddenText,
  cleanupCallbacks
}) {
  const removeHighlight = typeof onRemoveHighlight === "function"
    ? onRemoveHighlight
    : typeof onRemoveAssistantHighlight === "function"
      ? (highlightIndex) => onRemoveAssistantHighlight(messageIndex, highlightIndex)
      : null;
  const removeCircle = typeof onRemoveCircle === "function"
    ? onRemoveCircle
    : typeof onRemoveAssistantCircle === "function"
      ? (circleIndex) => onRemoveAssistantCircle(messageIndex, circleIndex)
    : null;
  const removeHiddenText = typeof onRemoveHiddenText === "function"
    ? onRemoveHiddenText
    : typeof onRemoveAssistantHiddenText === "function"
      ? (hiddenIndex, groupId) => onRemoveAssistantHiddenText(messageIndex, hiddenIndex, groupId)
      : null;

  if (typeof removeHighlight === "function") {
    textElement.querySelectorAll("mark, .paper-highlight-text").forEach((mark, highlightIndex) => {
      wireRenderedAnnotation({
        textElement,
        element: mark,
        className: "conversation-highlight-mark",
        label: "Highlighted response text",
        title: "Remove highlight",
        topOffset: -4,
        onRemove: () => removeHighlight(highlightIndex),
        cleanupCallbacks
      });
    });
  }

  if (typeof removeCircle === "function") {
    textElement.querySelectorAll(".paper-circle-text").forEach((circle, circleIndex) => {
      wireRenderedAnnotation({
        textElement,
        element: circle,
        className: "conversation-circle-mark",
        label: "Circled response text",
        title: "Remove circle",
        topOffset: -4,
        onRemove: () => removeCircle(circleIndex),
        cleanupCallbacks
      });
    });
  }
  initializeRenderedCircleAnnotations(textElement, cleanupCallbacks);

  if (typeof removeHiddenText === "function") {
    textElement.querySelectorAll(".paper-hidden-text").forEach((hiddenText, hiddenIndex) => {
      const groupId = hiddenText.dataset.annotationGroup || "";
      wireRenderedHiddenText({
        textElement,
        element: hiddenText,
        className: "conversation-hidden-text",
        label: "Hidden response text",
        onRemove: () => removeHiddenText(hiddenIndex, groupId),
        cleanupCallbacks
      });
    });
  }
}

function initializeRenderedCircleAnnotations(textElement, cleanupCallbacks = []) {
  textElement.querySelectorAll(".paper-circle-text").forEach((element) => {
    let annotation = null;
    const frame = window.requestAnimationFrame(() => {
      if (!element.isConnected) {
        return;
      }

      annotation = annotate(element, {
        type: "circle",
        color: "#d95f59",
        strokeWidth: 2,
        padding: 4,
        iterations: 2,
        animate: false,
        multiline: true
      });
      annotation.show();
    });
    cleanupCallbacks.push(() => {
      window.cancelAnimationFrame(frame);
      annotation?.remove?.();
    });
  });
}

function wireRenderedAnnotation({ textElement, element, className, label, title, topOffset = 0, onRemove, cleanupCallbacks }) {
  element.classList.add(className, "conversation-annotated-text");
  element.tabIndex = 0;
  element.setAttribute("aria-label", label);

  const removeButton = document.createElement("button");
  removeButton.className = "conversation-annotation-remove";
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", title);
  removeButton.textContent = "×";
  removeButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    Promise.resolve(onRemove()).catch((error) => {
      console.debug("[Paper Toaster] Could not remove response annotation", error);
    });
  });

  const show = (event) => {
    event?.stopPropagation();
    hideVisibleAnnotationButtons(textElement, removeButton);
    positionAnnotationRemoveButton({ textElement, element, removeButton, topOffset });
  };
  const hideOnOutsidePointer = (event) => {
    if (event.target === element || element.contains(event.target) || event.target === removeButton || removeButton.contains(event.target)) {
      return;
    }
    removeButton.classList.remove("visible");
  };

  element.addEventListener("click", show);
  element.addEventListener("focus", show);
  document.addEventListener("pointerdown", hideOnOutsidePointer);
  document.body.append(removeButton);
  cleanupCallbacks?.push(() => {
    document.removeEventListener("pointerdown", hideOnOutsidePointer);
    removeButton.remove();
  });
}

function wireRenderedHiddenText({ textElement, element, className, label, onRemove, cleanupCallbacks }) {
  element.classList.add(className, "conversation-annotated-text");
  element.tabIndex = 0;
  element.setAttribute("aria-label", label);
  const groupedElements = getHiddenTextGroupElements(textElement, element);

  const restoreButton = document.createElement("button");
  restoreButton.className = "conversation-annotation-remove conversation-hidden-restore";
  restoreButton.type = "button";
  restoreButton.setAttribute("aria-label", "Unhide text");
  const icon = document.createElement("span");
  icon.className = "icon-mask conversation-hidden-restore-icon";
  icon.setAttribute("aria-hidden", "true");
  restoreButton.append(icon);

  restoreButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  restoreButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    Promise.resolve(onRemove()).catch((error) => {
      console.debug("[Paper Toaster] Could not unhide response text", error);
    });
  });

  let ignoreNextFocus = false;
  const showAtPointer = (event) => {
    event.stopPropagation();
    ignoreNextFocus = false;
    hideVisibleAnnotationButtons(textElement, restoreButton);
    activateHiddenTextGroup(textElement, groupedElements);
    positionAnnotationButtonAtPoint({
      textElement,
      button: restoreButton,
      clientX: event.clientX,
      clientY: event.clientY
    });
  };
  const showAtLastCharacter = (event) => {
    event?.stopPropagation();
    hideVisibleAnnotationButtons(textElement, restoreButton);
    activateHiddenTextGroup(textElement, groupedElements);
    positionAnnotationRemoveButton({ textElement, element, removeButton: restoreButton });
  };
  const hideOnOutsidePointer = (event) => {
    if (
      groupedElements.some((candidate) => event.target === candidate || candidate.contains(event.target)) ||
      event.target === restoreButton ||
      restoreButton.contains(event.target)
    ) {
      return;
    }
    restoreButton.classList.remove("visible");
    deactivateHiddenTextGroup(textElement);
  };
  const showGroupHover = () => {
    groupedElements.forEach((candidate) => candidate.classList.add("hover-hidden-group"));
  };
  const hideGroupHover = () => {
    groupedElements.forEach((candidate) => candidate.classList.remove("hover-hidden-group"));
  };

  element.addEventListener("pointerdown", () => {
    ignoreNextFocus = true;
  });
  element.addEventListener("pointerenter", showGroupHover);
  element.addEventListener("pointerleave", hideGroupHover);
  element.addEventListener("click", showAtPointer);
  element.addEventListener("focus", (event) => {
    if (ignoreNextFocus) {
      return;
    }
    if (restoreButton.classList.contains("visible")) {
      return;
    }
    showAtLastCharacter(event);
  });
  document.addEventListener("pointerdown", hideOnOutsidePointer);
  document.body.append(restoreButton);
  cleanupCallbacks?.push(() => {
    document.removeEventListener("pointerdown", hideOnOutsidePointer);
    hideGroupHover();
    restoreButton.remove();
  });
}

function getHiddenTextGroupElements(textElement, element) {
  const groupId = element.dataset.annotationGroup || "";
  if (!groupId) {
    return [element];
  }

  return Array.from(textElement.querySelectorAll(".paper-hidden-text"))
    .filter((candidate) => candidate.dataset.annotationGroup === groupId);
}

function activateHiddenTextGroup(textElement, groupedElements) {
  deactivateHiddenTextGroup(textElement);
  groupedElements.forEach((candidate) => candidate.classList.add("active-hidden-group"));
}

function deactivateHiddenTextGroup(textElement) {
  textElement.querySelectorAll(".paper-hidden-text.active-hidden-group").forEach((candidate) => {
    candidate.classList.remove("active-hidden-group");
  });
}

function createAssistantEditBar({ anchorElement, targetElement, onHighlightSelection, onCircleSelection, onHideSelection }) {
  const bar = document.createElement("div");
  bar.className = "conversation-edit-bar";
  const selectionState = {
    text: ""
  };
  let hintTimer = null;

  const highlightButton = createConversationActionButton({
    className: "conversation-highlight-button",
    iconClassName: "conversation-highlight-icon",
    title: "Highlight selected response text"
  });
  highlightButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
  });
  highlightButton.addEventListener("click", () => {
    const selectedText = selectionState.text || getSelectedResponseText(targetElement);
    if (!selectedText) {
      flashConversationActionButton(highlightButton);
      hintTimer = showConversationEditHint(bar, "No selected response text.", hintTimer);
      return;
    }

    Promise.resolve(onHighlightSelection?.(selectedText))
      .then((result) => {
        const editResult = normalizeEditResult(result);
        if (!editResult.changed) {
          flashConversationActionButton(highlightButton);
          hintTimer = showConversationEditHint(bar, editResult.reason || "Highlight failed.", hintTimer);
          return;
        }
        window.getSelection()?.removeAllRanges();
      })
      .catch((error) => {
        flashConversationActionButton(highlightButton);
        hintTimer = showConversationEditHint(bar, error.message || "Highlight failed.", hintTimer);
        console.debug("[Paper Toaster] Could not highlight response text", error);
      });
  });

  let circleButton = null;
  if (typeof onCircleSelection === "function") {
    circleButton = createConversationActionButton({
      className: "conversation-circle-button",
      iconClassName: "conversation-circle-icon",
      title: "Circle selected response text"
    });
    circleButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });
    circleButton.addEventListener("click", () => {
      const selectedText = selectionState.text || getSelectedResponseText(targetElement);
      if (!selectedText) {
        flashConversationActionButton(circleButton);
        hintTimer = showConversationEditHint(bar, "No selected response text.", hintTimer);
        return;
      }

      Promise.resolve(onCircleSelection(selectedText))
        .then((result) => {
          const editResult = normalizeEditResult(result);
          if (!editResult.changed) {
            flashConversationActionButton(circleButton);
            hintTimer = showConversationEditHint(bar, editResult.reason || "Circle failed.", hintTimer);
            return;
          }
          window.getSelection()?.removeAllRanges();
        })
        .catch((error) => {
          flashConversationActionButton(circleButton);
          hintTimer = showConversationEditHint(bar, error.message || "Circle failed.", hintTimer);
          console.debug("[Paper Toaster] Could not circle response text", error);
        });
    });
  }

  let hideButton = null;
  if (typeof onHideSelection === "function") {
    hideButton = createConversationActionButton({
      className: "conversation-hide-button",
      iconClassName: "conversation-hide-icon",
      title: "Hide selected response text"
    });
    hideButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });
    hideButton.addEventListener("click", () => {
      const selectedText = selectionState.text || getSelectedResponseText(targetElement);
      if (!selectedText) {
        flashConversationActionButton(hideButton);
        hintTimer = showConversationEditHint(bar, "No selected response text.", hintTimer);
        return;
      }

      Promise.resolve(onHideSelection(selectedText))
        .then((result) => {
          const editResult = normalizeEditResult(result);
          if (!editResult.changed) {
            flashConversationActionButton(hideButton);
            hintTimer = showConversationEditHint(bar, editResult.reason || "Hide failed.", hintTimer);
            return;
          }
          window.getSelection()?.removeAllRanges();
        })
        .catch((error) => {
          flashConversationActionButton(hideButton);
          hintTimer = showConversationEditHint(bar, error.message || "Hide failed.", hintTimer);
          console.debug("[Paper Toaster] Could not hide response text", error);
        });
    });
  }

  const hint = document.createElement("div");
  hint.className = "conversation-edit-hint";
  const buttons = [hideButton, highlightButton, circleButton].filter(Boolean);
  bar.append(...buttons, hint);
  return { anchorElement, targetElement, bar, selectionState };
}

function normalizeEditResult(result) {
  if (typeof result === "boolean") {
    return { changed: result, reason: "" };
  }
  return {
    changed: Boolean(result?.changed),
    reason: String(result?.reason || "").trim()
  };
}

function showConversationEditHint(bar, message, previousTimer = null) {
  const hint = bar.querySelector(".conversation-edit-hint");
  if (!hint) {
    return previousTimer;
  }

  window.clearTimeout(previousTimer);
  hint.textContent = message;
  hint.classList.add("visible");
  return window.setTimeout(() => {
    hint.classList.remove("visible");
  }, 2600);
}

function updateAssistantEditBars(editBars) {
  for (const editBar of editBars) {
    updateAssistantEditBarPosition(editBar);
  }
}

function hideAssistantEditBars(editBars) {
  for (const { bar } of editBars) {
    bar.classList.remove("anchored");
    bar.style.removeProperty("--conversation-edit-left");
    bar.style.removeProperty("--conversation-edit-top");
  }
}

function updateAssistantEditBarPosition(editBar) {
  const { anchorElement, targetElement, bar, selectionState } = editBar;
  const selectionRange = getSelectedResponseRange(targetElement);
  const selectionRect = selectionRange ? getLastSelectionRect(selectionRange) : null;
  if (!selectionRect) {
    selectionState.text = "";
    bar.classList.remove("anchored");
    bar.style.removeProperty("--conversation-edit-left");
    bar.style.removeProperty("--conversation-edit-top");
    return;
  }

  selectionState.text = window.getSelection()?.toString().trim() || "";

  const itemRect = anchorElement.getBoundingClientRect();
  const barWidth = bar.offsetWidth || 24;
  const barHeight = bar.offsetHeight || 24;
  const padding = 3;
  const left = clamp(
    selectionRect.right - itemRect.left - barWidth * 0.45,
    padding,
    Math.max(padding, itemRect.width - barWidth - padding)
  );
  const top = clamp(
    selectionRect.bottom - itemRect.top - 3,
    padding,
    Math.max(padding, itemRect.height - barHeight - padding)
  );

  bar.style.setProperty("--conversation-edit-left", `${left}px`);
  bar.style.setProperty("--conversation-edit-top", `${top}px`);
  bar.classList.add("anchored");
}

function positionAnnotationRemoveButton({ textElement, element, removeButton, topOffset = 0 }) {
  const rect = getLastElementRect(element);
  if (!rect) {
    removeButton.classList.remove("visible");
    return;
  }

  const buttonWidth = removeButton.offsetWidth || 15;
  const buttonHeight = removeButton.offsetHeight || 15;
  const left = clamp(
    rect.right - buttonWidth * 0.28,
    0,
    Math.max(0, window.innerWidth - buttonWidth)
  );
  const top = Math.max(0, rect.top + rect.height / 2 - buttonHeight / 2 + topOffset);
  removeButton.style.setProperty("--annotation-remove-left", `${left}px`);
  removeButton.style.setProperty("--annotation-remove-top", `${top}px`);
  removeButton.classList.add("visible");
}

function positionAnnotationButtonAtPoint({ textElement, button, clientX, clientY }) {
  const buttonWidth = button.offsetWidth || 18;
  const buttonHeight = button.offsetHeight || 18;
  const left = clamp(
    clientX - buttonWidth / 2,
    0,
    Math.max(0, window.innerWidth - buttonWidth)
  );
  const top = Math.max(0, clientY - buttonHeight / 2);
  button.style.setProperty("--annotation-remove-left", `${left}px`);
  button.style.setProperty("--annotation-remove-top", `${top}px`);
  button.classList.add("visible");
}

function hideVisibleAnnotationButtons(textElement, except = null) {
  document.querySelectorAll(".conversation-annotation-remove.visible").forEach((button) => {
    if (button !== except) {
      button.classList.remove("visible");
    }
  });
}

function getSelectedResponseText(targetElement) {
  const range = getSelectedResponseRange(targetElement);
  if (!range) {
    return "";
  }

  return window.getSelection().toString().trim();
}

function getSelectedResponseRange(textElement) {
  const selection = window.getSelection?.();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  if (!textElement) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!rangeIntersectsNode(range, textElement)) {
    return null;
  }

  return range;
}

function getLastSelectionRect(range) {
  return Array.from(range.getClientRects())
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .at(-1) || null;
}

function getLastElementRect(element) {
  return Array.from(element.getClientRects())
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .at(-1) || null;
}

function rangeIntersectsNode(range, node) {
  if (typeof range.intersectsNode === "function") {
    return range.intersectsNode(node);
  }

  return node.contains(range.commonAncestorContainer);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function flashConversationActionButton(button) {
  button.classList.remove("failed");
  void button.offsetWidth;
  button.classList.add("failed");
  window.setTimeout(() => button.classList.remove("failed"), 320);
}

function createAssistantActionRow({ message, messageIndex, onToggleSaved, onDeleteUnit }) {
  const row = document.createElement("div");
  row.className = "conversation-action-row";

  const saveButton = createConversationActionButton({
    className: "conversation-save-button",
    iconClassName: "conversation-save-icon",
    title: message.isSaved ? "Unsave response" : "Save response",
    pressed: Boolean(message.isSaved)
  });
  saveButton.classList.toggle("saved", Boolean(message.isSaved));
  saveButton.addEventListener("click", () => {
    Promise.resolve(onToggleSaved?.(messageIndex)).catch((error) => {
      console.debug("[Paper Toaster] Could not update response saved state", error);
    });
  });

  const deleteButton = createConversationActionButton({
    className: "conversation-delete-button",
    iconClassName: "conversation-delete-icon",
    title: "Delete question and response"
  });
  deleteButton.addEventListener("click", () => {
    Promise.resolve(onDeleteUnit?.(messageIndex)).catch((error) => {
      console.debug("[PDF AI] Could not delete conversation unit", error);
    });
  });

  const copyButton = createConversationActionButton({
    className: "conversation-copy-button",
    iconClassName: "conversation-copy-icon",
    title: "Copy response"
  });
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(String(message.text || ""));
      copyButton.classList.add("copied");
      window.setTimeout(() => copyButton.classList.remove("copied"), 700);
    } catch (error) {
      console.debug("[PDF AI] Could not copy response", error);
    }
  });

  row.append(saveButton, deleteButton, copyButton);
  return row;
}

function isMessageSaved(message) {
  return Boolean(message?.isSaved);
}

function createConversationActionButton({ className, iconClassName, title, pressed = null }) {
  const button = document.createElement("button");
  button.className = `conversation-action-button ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", title);
  if (pressed !== null) {
    button.setAttribute("aria-pressed", String(pressed));
  }

  const icon = document.createElement("span");
  icon.className = `icon-mask ${iconClassName}`;
  icon.setAttribute("aria-hidden", "true");
  button.append(icon);
  return button;
}

export function toggleConversationSelection(threadElement, quote) {
  const shouldExpand = !quote.classList.contains("scrollable");
  collapseOpenConversationSelections(threadElement, quote);
  quote.classList.toggle("scrollable", shouldExpand);
  if (!shouldExpand) {
    quote.scrollTop = 0;
  }
}

export function collapseOpenConversationSelections(threadElement, except = null) {
  for (const quote of threadElement.querySelectorAll(".conversation-selection.scrollable")) {
    if (quote === except) {
      continue;
    }

    quote.classList.remove("scrollable");
    quote.scrollTop = 0;
  }
}
