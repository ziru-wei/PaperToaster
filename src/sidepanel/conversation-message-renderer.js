import { renderMarkdownInto } from "../markdown/render-markdown.js";
import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";

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
    const empty = document.createElement("div");
    empty.className = "saved-qa-empty";
    empty.textContent = "No saved Q&A yet.";
    threadElement.append(empty);
    return;
  }

  const track = document.createElement("div");
  track.className = "saved-qa-track";
  const editBars = [];
  const cleanupCallbacks = [];

  units.forEach((unit) => {
    const unitElement = document.createElement("article");
    unitElement.className = "saved-qa-unit";

    const cardShadow = document.createElement("div");
    cardShadow.className = "saved-qa-card-shadow";

    const card = document.createElement("div");
    card.className = "saved-qa-card";

    const question = document.createElement("div");
    question.className = "saved-qa-question";
    const questionText = document.createElement("span");
    questionText.className = "saved-qa-question-text";
    questionText.textContent = unit.question || "Question unavailable";
    const jumpButton = createSavedJumpButton(unit, options.onJumpToUnit);
    question.append(questionText, jumpButton);

    const answer = document.createElement("div");
    answer.className = "saved-qa-answer";
    renderMarkdownInto(answer, normalizeAiResponseMarkdown(unit.answer || ""), { omitHiddenText: true });
    if (typeof options.onRemoveSavedAnswerHighlight === "function" || typeof options.onRemoveSavedAnswerHiddenText === "function") {
      wireRenderedAnnotations({
        textElement: answer,
        onRemoveHighlight: typeof options.onRemoveSavedAnswerHighlight === "function"
          ? (highlightIndex) => options.onRemoveSavedAnswerHighlight(unit, highlightIndex)
          : null,
        onRemoveHiddenText: typeof options.onRemoveSavedAnswerHiddenText === "function"
          ? (hiddenIndex) => options.onRemoveSavedAnswerHiddenText(unit, hiddenIndex)
          : null,
        cleanupCallbacks
      });
    }

    card.append(question, answer);
    cardShadow.append(card);
    unitElement.append(cardShadow);

    if (typeof options.onHighlightSavedAnswerSelection === "function") {
      const editBar = createAssistantEditBar({
        anchorElement: unitElement,
        targetElement: answer,
        onHighlightSelection: (selectedText) => options.onHighlightSavedAnswerSelection(unit, selectedText),
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

    track.append(unitElement);
  });

  threadElement.append(track);
  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
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

function toggleSavedSelection(selection) {
  const shouldExpand = !selection.classList.contains("expanded");
  selection.classList.toggle("expanded", shouldExpand);
  selection.setAttribute("aria-expanded", String(shouldExpand));
  if (!shouldExpand) {
    selection.scrollTop = 0;
  }
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
  onRemoveAssistantHiddenText,
  onRemoveHighlight,
  onRemoveHiddenText,
  cleanupCallbacks
}) {
  const removeHighlight = typeof onRemoveHighlight === "function"
    ? onRemoveHighlight
    : typeof onRemoveAssistantHighlight === "function"
      ? (highlightIndex) => onRemoveAssistantHighlight(messageIndex, highlightIndex)
      : null;
  const removeHiddenText = typeof onRemoveHiddenText === "function"
    ? onRemoveHiddenText
    : typeof onRemoveAssistantHiddenText === "function"
      ? (hiddenIndex) => onRemoveAssistantHiddenText(messageIndex, hiddenIndex)
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

  if (typeof removeHiddenText === "function") {
    textElement.querySelectorAll(".paper-hidden-text").forEach((hiddenText, hiddenIndex) => {
      wireRenderedHiddenText({
        textElement,
        element: hiddenText,
        className: "conversation-hidden-text",
        label: "Hidden response text",
        onRemove: () => removeHiddenText(hiddenIndex),
        cleanupCallbacks
      });
    });
  }
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
    positionAnnotationRemoveButton({ textElement, element, removeButton: restoreButton });
  };
  const hideOnOutsidePointer = (event) => {
    if (event.target === element || element.contains(event.target) || event.target === restoreButton || restoreButton.contains(event.target)) {
      return;
    }
    restoreButton.classList.remove("visible");
  };

  element.addEventListener("pointerdown", () => {
    ignoreNextFocus = true;
  });
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
    restoreButton.remove();
  });
}

function createAssistantEditBar({ anchorElement, targetElement, onHighlightSelection, onHideSelection }) {
  const bar = document.createElement("div");
  bar.className = "conversation-edit-bar";
  const selectionState = {
    text: ""
  };

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
      return;
    }

    Promise.resolve(onHighlightSelection?.(selectedText))
      .then((changed) => {
        if (!changed) {
          flashConversationActionButton(highlightButton);
          return;
        }
        window.getSelection()?.removeAllRanges();
      })
      .catch((error) => {
        flashConversationActionButton(highlightButton);
        console.debug("[Paper Toaster] Could not highlight response text", error);
      });
  });

  const buttons = [highlightButton];
  if (typeof onHideSelection === "function") {
    const hideButton = createConversationActionButton({
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
        return;
      }

      Promise.resolve(onHideSelection(selectedText))
        .then((changed) => {
          if (!changed) {
            flashConversationActionButton(hideButton);
            return;
          }
          window.getSelection()?.removeAllRanges();
        })
        .catch((error) => {
          flashConversationActionButton(hideButton);
          console.debug("[Paper Toaster] Could not hide response text", error);
        });
    });
    buttons.push(hideButton);
  }

  bar.append(...buttons);
  return { anchorElement, targetElement, bar, selectionState };
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
