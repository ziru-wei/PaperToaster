import { renderMarkdownInto } from "../markdown/render-markdown.js";
import {
  normalizeAiResponseMarkdown,
  prepareAiResponseMarkdownForCopy
} from "../markdown/normalize-ai-response-markdown.js";
import { annotate } from "../../vendor/rough-notation/rough-notation.mjs";
import { createPaperNoteEditor, disposePaperNoteEditor } from "./paper-note-editor.js";
import { createQuestionResponseMap, getChronologicalMessageEntries } from "../conversation/message-state.js";

const highlightBarCleanups = new WeakMap();
const pendingResponseVisualFrames = new WeakMap();

export function renderConversationMessages(threadElement, messages, options = {}) {
  highlightBarCleanups.get(threadElement)?.();
  highlightBarCleanups.delete(threadElement);
  const paperNote = threadElement.querySelector(".saved-paper-user-note");
  if (paperNote) disposePaperNoteEditor(paperNote);
  threadElement.textContent = "";
  threadElement.classList.remove("saved-qa-thread");
  threadElement.hidden = !messages.length;
  const editBars = [];
  const cleanupCallbacks = [];
  const collapsedAssistantMessageIndexes = options.collapsedAssistantMessageIndexes instanceof Set
    ? options.collapsedAssistantMessageIndexes
    : new Set();
  const responseMessageIndexesByQuestion = createQuestionResponseMap(messages);

  const messageEntries = getChronologicalMessageEntries(messages);
  messageEntries.forEach(({ message, messageIndex }) => {
    const item = document.createElement("article");
    item.className = `conversation-message ${message.role}`;
    item.dataset.messageIndex = String(messageIndex);
    if (message.pending) {
      item.classList.add("pending");
    }
    if (message.role === "assistant" && collapsedAssistantMessageIndexes.has(messageIndex)) {
      item.classList.add("assistant-response-collapsed");
    }
    if (message.role === "user" && isQuestionInSavedUnit(messages, responseMessageIndexesByQuestion.get(messageIndex))) {
      item.classList.add("saved-unit");
    }
    if (message.role === "user" && messages[responseMessageIndexesByQuestion.get(messageIndex)]?.pending) {
      item.classList.add("pending-question");
    }

    const text = document.createElement("div");
    text.className = "conversation-text";
    renderMessageText(text, message, options, cleanupCallbacks);
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

    const content = message.role === "assistant"
      ? document.createElement("div")
      : item;
    if (message.role === "assistant") {
      content.className = "conversation-assistant-content";
      item.append(content);
    }
    content.append(text);
    if (message.role === "user") {
      const assistantMessageIndex = responseMessageIndexesByQuestion.get(messageIndex) ?? -1;
      if (assistantMessageIndex >= 0 && typeof options.onAssistantResponseCollapseChange === "function") {
        item.classList.add("question-has-response");
        item.dataset.responseMessageIndex = String(assistantMessageIndex);
        text.classList.add("conversation-response-toggle");
        text.setAttribute("aria-expanded", String(!collapsedAssistantMessageIndexes.has(assistantMessageIndex)));
        item.addEventListener("click", (event) => {
          const clickedSelection = event.target.closest(".conversation-selection");
          if (event.target.closest("button, textarea, a, [contenteditable=\"true\"]") || clickedSelection) {
            return;
          }
          const response = threadElement.querySelector(
            `.conversation-message.assistant[data-message-index="${assistantMessageIndex}"]`
          );
          if (!response) {
            return;
          }
          const collapsed = response.classList.toggle("assistant-response-collapsed");
          text.setAttribute("aria-expanded", String(!collapsed));
          options.onAssistantResponseCollapseChange(messageIndex, assistantMessageIndex, collapsed);
        });
      }
    }
    if (message.role === "user" && !message.pending && typeof options.onEditUserMessage === "function") {
      item.append(createUserMessageMetaRow({
        item,
        message,
        messageIndex,
        textElement: text,
        onEditUserMessage: options.onEditUserMessage
      }));
    }
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
        document.body.append(editBar.bar);
        cleanupCallbacks.push(() => editBar.bar.remove());
      }
      content.append(createAssistantActionRow({
        message,
        messageIndex,
        onToggleSaved: options.onToggleSaved,
        onDeleteUnit: options.onDeleteUnit,
        onSaveLimitRejected: options.onSaveLimitRejected
      }));
    }
    threadElement.append(item);
  });

  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
  schedulePendingResponseVisualState(threadElement, messages.some((message) => message?.role === "assistant" && message.pending));
}

export function updatePendingConversationMessageText(threadElement, messageIndex, text) {
  const textElement = threadElement.querySelector(
    `.conversation-message.pending[data-message-index="${Number(messageIndex)}"] .conversation-text`
  );
  if (!textElement) return false;
  textElement.textContent = String(text || "Toasting the pages...");
  return true;
}

function schedulePendingResponseVisualState(threadElement, pending) {
  const currentFrame = pendingResponseVisualFrames.get(threadElement);
  if (currentFrame) window.cancelAnimationFrame(currentFrame);
  if (pending === threadElement.classList.contains("awaiting-ai-response")) return;
  const frame = window.requestAnimationFrame(() => {
    pendingResponseVisualFrames.delete(threadElement);
    threadElement.getBoundingClientRect();
    threadElement.classList.toggle("awaiting-ai-response", pending);
  });
  pendingResponseVisualFrames.set(threadElement, frame);
}

function createUserMessageMetaRow({ item, message, messageIndex, textElement, onEditUserMessage }) {
  const row = document.createElement("div");
  row.className = "conversation-user-meta";

  const time = document.createElement("time");
  time.className = "conversation-user-time";
  time.dateTime = new Date(Number(message.createdAt) || Date.now()).toISOString();
  time.textContent = formatConversationMessageTime(message.createdAt);

  const editButton = createConversationActionButton({
    className: "conversation-user-edit-button",
    iconClassName: "conversation-user-edit-icon",
    title: "Edit question"
  });
  editButton.addEventListener("click", () => {
    if (item.classList.contains("editing-user-message")) {
      confirmUserMessageEdit({ item, messageIndex, onEditUserMessage });
      return;
    }
    beginUserMessageEdit({
      item,
      message,
      messageIndex,
      textElement,
      editButton,
      onEditUserMessage
    });
  });

  row.append(time, editButton);
  return row;
}

function beginUserMessageEdit({
  item,
  message,
  messageIndex,
  textElement,
  editButton,
  onEditUserMessage
}) {
  const questionLabel = textElement.querySelector(".conversation-question-label");
  if (!questionLabel) return;

  item.classList.add("editing-user-message");
  questionLabel.dataset.originalText = String(message.text || "");
  questionLabel.contentEditable = "true";
  questionLabel.setAttribute("role", "textbox");
  questionLabel.setAttribute("aria-label", "Edit question");
  questionLabel.setAttribute("aria-multiline", "true");
  editButton.classList.add("confirm");
  editButton.setAttribute("aria-label", "Confirm question edit");
  questionLabel.focus();
  moveCaretToEnd(questionLabel);
  questionLabel.onkeydown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      confirmUserMessageEdit({
        item,
        messageIndex,
        onEditUserMessage
      });
      return;
    }
    if (event.key !== "Escape") {
      return;
    }
    event.preventDefault();
    cancelUserMessageEdit({ item, textElement, editButton });
  };
}

async function confirmUserMessageEdit({ item, messageIndex, onEditUserMessage }) {
  const editor = item.querySelector('.conversation-question-label[contenteditable="true"]');
  const editButton = item.querySelector(".conversation-user-edit-button");
  const nextText = String(editor?.innerText || editor?.textContent || "").trim();
  if (!editor || !editButton || !nextText) {
    editor?.focus();
    return;
  }

  editor.contentEditable = "false";
  editButton.disabled = true;
  try {
    const saved = await onEditUserMessage(messageIndex, nextText);
    if (saved === false) {
      throw new Error("Question is no longer available for editing.");
    }
  } catch (error) {
    editor.contentEditable = "true";
    editButton.disabled = false;
    editor.focus();
    console.debug("[Paper Toaster] Could not edit user question", error);
  }
}

function cancelUserMessageEdit({ item, textElement, editButton }) {
  const questionLabel = textElement.querySelector(".conversation-question-label");
  if (questionLabel) {
    questionLabel.textContent = questionLabel.dataset.originalText || questionLabel.textContent;
    delete questionLabel.dataset.originalText;
    questionLabel.removeAttribute("contenteditable");
    questionLabel.removeAttribute("role");
    questionLabel.removeAttribute("aria-label");
    questionLabel.removeAttribute("aria-multiline");
    questionLabel.oninput = null;
    questionLabel.onkeydown = null;
  }
  item.classList.remove("editing-user-message");
  editButton.classList.remove("confirm");
  editButton.setAttribute("aria-label", "Edit question");
  editButton.focus();
}

function moveCaretToEnd(element) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function formatConversationMessageTime(value) {
  const date = new Date(Number(value));
  if (!Number.isFinite(date.getTime())) {
    return "";
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  if (date.toDateString() === now.toDateString()) {
    return `Today ${time}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${time}`;
  }
  return `${date.toLocaleDateString([], { month: "short", day: "2-digit" })} ${time}`;
}

function isQuestionInSavedUnit(messages, assistantMessageIndex) {
  const nextMessage = messages[assistantMessageIndex];
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
  threadElement.querySelector(".saved-paper-user-note") && disposePaperNoteEditor(threadElement.querySelector(".saved-paper-user-note"));
  threadElement.textContent = "";
  threadElement.classList.add("saved-qa-thread");
  threadElement.hidden = false;
  threadElement.append(createPaperUserNoteElement(options));

  if (!units.length) return;

  const pinnedRow = document.createElement("div");
  pinnedRow.className = "saved-qa-pinned-row";
  const track = document.createElement("div");
  track.className = "saved-qa-track";
  const floatingLayer = document.createElement("div");
  floatingLayer.className = "saved-qa-floating-layer";
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
        element: unitElement
      });
    }
  });

  normalItems
    .sort(compareSavedQuestionAnswerUnitItemsByAge)
    .forEach((item) => track.append(item.element));
  if (pinnedRow.children.length) {
    floatingLayer.append(pinnedRow);
  }
  if (track.children.length) {
    floatingLayer.append(track);
  }
  if (floatingLayer.children.length) {
    threadElement.append(floatingLayer);
  }
  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
}

function createPaperUserNoteElement(options) {
  const note = createPaperNoteEditor({
    noteDocument: options.userNoteDocument,
    onChange: options.onUserNoteChange,
    onCommit: options.onUserNoteCommit,
    onError: options.onUserNoteError
  });
  note.prepend(createPaperShortNoteCallout(options));
  return note;
}

// The short note sits in a callout pinned above the notes, marked with the same
// sticky-note icon the dashboard uses for it.
function createPaperShortNoteCallout(options) {
  const callout = document.createElement("div");
  callout.className = "saved-paper-short-note-callout";
  const icon = document.createElement("span");
  icon.className = "saved-paper-short-note-icon";
  icon.setAttribute("aria-hidden", "true");
  callout.append(icon, createPaperShortNoteElement(options));
  return callout;
}

function createPaperShortNoteElement(options) {
  const input = document.createElement("textarea");
  input.className = "saved-paper-short-note";
  input.value = options.shortNote || "";
  input.placeholder = "One-line summary";
  input.maxLength = 500;
  input.rows = 1;
  input.spellcheck = false;
  input.setAttribute("aria-label", "Short note for this paper");
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      input.blur();
    }
  });
  input.addEventListener("input", () => {
    if (/[\r\n]/.test(input.value)) {
      const caret = input.selectionStart;
      input.value = input.value.replace(/[\r\n]+/g, " ");
      input.setSelectionRange(caret, caret);
    }
    options.onShortNoteChange?.(input.value);
  });
  input.addEventListener("blur", () => options.onShortNoteCommit?.(input.value));
  return input;
}

export function updateRenderedPaperShortNote(threadElement, shortNote) {
  const input = threadElement.querySelector(".saved-paper-short-note");
  if (input && document.activeElement !== input && input.value !== shortNote) {
    input.value = shortNote;
  }
}

function compareSavedQuestionAnswerUnitItemsByAge(left, right) {
  return getSavedQuestionAnswerUnitTime(left.unit) - getSavedQuestionAnswerUnitTime(right.unit);
}

function getSavedQuestionAnswerUnitTime(unit) {
  return Number(unit?.answerCreatedAt || unit?.createdAt || unit?.questionCreatedAt) || 0;
}

function createSavedQuestionAnswerUnitElement({ unit, options, editBars, cleanupCallbacks }) {
  const unitKey = getSavedQuestionAnswerUnitKey(unit);
  const isComparisonUnit = unit?.sourceType === "comparison";
  const unitElement = document.createElement("article");
  unitElement.className = "saved-qa-unit";
  unitElement.classList.toggle("pinned", Boolean(unit.isPinned));
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
  if (typeof options.onJumpToUnit === "function") {
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
  renderMarkdownInto(answer, normalizeAiResponseMarkdown(unit.answer || ""), {
    omitHiddenText: true,
    citationCatalog: unit.citationCatalog
  });
  wireCitationNavigation(
    answer,
    unit.citationCatalog,
    typeof options.onNavigateCitation === "function"
      ? (paper) => options.onNavigateCitation(paper, {
        sourceType: unit.sourceType || "single",
        comparisonId: unit.comparisonId || ""
      })
      : null,
    cleanupCallbacks
  );
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
    document.body.append(editBar.bar);
    cleanupCallbacks.push(() => editBar.bar.remove());
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
  threadElement.classList.toggle("saved-qa-cloud-mode", Boolean(collapsed));
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

export function getSavedQuestionAnswerUnitKey(unit) {
  if (unit?.sourceType === "comparison") {
    const comparisonId = String(unit?.comparisonId || "").trim();
    const assistantMessageIndex = Number(unit?.assistantMessageIndex);
    return `comparison:${comparisonId}:${Number.isInteger(assistantMessageIndex) ? assistantMessageIndex : ""}`;
  }

  const threadId = String(unit?.threadId || "").trim();
  const assistantMessageIndex = Number(unit?.assistantMessageIndex);
  return `${threadId}:${Number.isInteger(assistantMessageIndex) ? assistantMessageIndex : ""}`;
}

function renderMessageText(element, message, options = {}, cleanupCallbacks = []) {
  if (message.pending) {
    element.classList.add("pending-text");
    element.setAttribute("aria-live", "polite");
    element.textContent = message.text || "Toasting the pages...";
    return;
  }

  if (message.role === "assistant") {
    renderMarkdownInto(element, normalizeAiResponseMarkdown(message.text), {
      citationCatalog: message.citationCatalog
    });
    wireCitationNavigation(element, message.citationCatalog, options.onNavigateCitation, cleanupCallbacks);
    return;
  }

  const questionLabel = document.createElement("span");
  questionLabel.className = "conversation-question-label";
  questionLabel.textContent = message.text;
  element.append(questionLabel);
}

function wireCitationNavigation(textElement, citationCatalog, onNavigateCitation, cleanupCallbacks) {
  if (typeof onNavigateCitation !== "function") {
    return;
  }

  const papers = new Map(
    (Array.isArray(citationCatalog?.papers) ? citationCatalog.papers : [])
      .map((paper) => [String(paper?.id || "").toLowerCase(), paper])
  );

  textElement.querySelectorAll(".paper-context-citation").forEach((citation) => {
    const popover = citation.querySelector(".paper-context-citation-popover");
    const rows = [...citation.querySelectorAll(".paper-context-citation-label[data-citation-paper-id]")];
    if (!popover || !rows.length) {
      return;
    }

    document.body.append(popover);
    let pinnedOpen = false;
    let hideTimer = null;

    const positionPopover = () => {
      if (!popover.classList.contains("citation-popover-visible")) {
        return;
      }
      const citationRect = citation.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportPadding = 6;
      const gap = 5;
      const leftCandidate = citationRect.left - popoverRect.width - gap;
      const rightCandidate = citationRect.right + gap;
      const left = leftCandidate >= viewportPadding
        ? leftCandidate
        : rightCandidate + popoverRect.width <= window.innerWidth - viewportPadding
          ? rightCandidate
          : Math.min(
            Math.max(viewportPadding, citationRect.left - (popoverRect.width / 2)),
            window.innerWidth - popoverRect.width - viewportPadding
          );
      const top = Math.max(6, citationRect.top - popoverRect.height - 4);
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    };
    const showPopover = () => {
      window.clearTimeout(hideTimer);
      popover.classList.add("citation-popover-visible");
      window.requestAnimationFrame(positionPopover);
    };
    const hidePopover = () => {
      if (pinnedOpen) {
        return;
      }
      popover.classList.remove("citation-popover-visible");
    };
    const scheduleHidePopover = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hidePopover, 70);
    };

    const navigate = (row) => {
      const paperId = String(row.dataset.citationPaperId || "").toLowerCase();
      const paper = papers.get(paperId);
      if (!paper) {
        return;
      }
      pinnedOpen = false;
      popover.classList.remove("citation-popover-visible");
      citation.setAttribute("aria-expanded", "false");
      Promise.resolve(onNavigateCitation(paper)).catch((error) => {
        console.debug("[Paper Toaster] Could not open cited paper", error);
      });
    };

    rows.forEach((row) => {
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.addEventListener("click", (event) => {
        event.stopPropagation();
        navigate(row);
      });
      row.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        navigate(row);
      });
    });

    citation.setAttribute("role", "button");
    citation.tabIndex = 0;
    citation.setAttribute("aria-expanded", "false");
    citation.addEventListener("pointerenter", showPopover);
    citation.addEventListener("pointerleave", scheduleHidePopover);
    citation.addEventListener("focus", showPopover);
    citation.addEventListener("blur", scheduleHidePopover);
    popover.addEventListener("pointerenter", showPopover);
    popover.addEventListener("pointerleave", scheduleHidePopover);
    const activateCitation = () => {
      if (rows.length === 1) {
        navigate(rows[0]);
        return;
      }
      pinnedOpen = !pinnedOpen;
      citation.setAttribute("aria-expanded", String(pinnedOpen));
      if (pinnedOpen) {
        showPopover();
      } else {
        hidePopover();
      }
    };
    citation.addEventListener("click", activateCitation);
    citation.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      activateCitation();
    });

    if (rows.length > 1) {
      const closeOnOutsidePointer = (event) => {
        if (citation.contains(event.target) || popover.contains(event.target)) {
          return;
        }
        pinnedOpen = false;
        popover.classList.remove("citation-popover-visible");
        citation.setAttribute("aria-expanded", "false");
      };
      document.addEventListener("pointerdown", closeOnOutsidePointer, true);
      cleanupCallbacks.push(() => document.removeEventListener("pointerdown", closeOnOutsidePointer, true));
    }

    window.addEventListener("resize", positionPopover);
    document.addEventListener("scroll", positionPopover, true);
    cleanupCallbacks.push(() => {
      window.clearTimeout(hideTimer);
      window.removeEventListener("resize", positionPopover);
      document.removeEventListener("scroll", positionPopover, true);
      popover.remove();
    });
  });
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
  document.addEventListener("scroll", update, true);
  window.addEventListener("resize", update);
  highlightBarCleanups.set(threadElement, () => {
    document.removeEventListener("pointerup", update);
    threadElement.removeEventListener("keyup", update);
    document.removeEventListener("pointerdown", hide);
    document.removeEventListener("scroll", update, true);
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
    selectionRect.right - barWidth * 0.45,
    itemRect.left + padding,
    Math.max(itemRect.left + padding, itemRect.right - barWidth - padding)
  );
  const top = clamp(
    selectionRect.bottom - 3,
    itemRect.top + padding,
    Math.max(itemRect.top + padding, itemRect.bottom - barHeight - padding)
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

function createAssistantActionRow({ message, messageIndex, onToggleSaved, onDeleteUnit, onSaveLimitRejected }) {
  const row = document.createElement("div");
  row.className = "conversation-action-row";

  const saveButton = createConversationActionButton({
    className: "conversation-save-button",
    iconClassName: "conversation-save-icon",
    title: message.isSaved ? "Unsave response" : "Save response",
    pressed: Boolean(message.isSaved)
  });
  saveButton.classList.toggle("saved", Boolean(message.isSaved));
  let savePending = false;
  saveButton.addEventListener("click", async () => {
    if (savePending) return;
    savePending = true;
    saveButton.setAttribute("aria-busy", "true");
    saveButton.disabled = true;
    try {
      const result = await onToggleSaved?.(messageIndex);
      if (result?.status === "limit-reached") {
        flashSaveLimitRejection(saveButton);
        onSaveLimitRejected?.(result);
      }
    } catch (error) {
      console.debug("[Paper Toaster] Could not update response saved state", error);
    } finally {
      savePending = false;
      saveButton.disabled = false;
      saveButton.removeAttribute("aria-busy");
    }
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
    title: "Copy response",
    tooltip: String(message.model || "Model unavailable")
  });
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(prepareAiResponseMarkdownForCopy(message.text));
      copyButton.classList.add("copied");
      window.setTimeout(() => copyButton.classList.remove("copied"), 700);
    } catch (error) {
      console.debug("[PDF AI] Could not copy response", error);
    }
  });

  row.append(saveButton, deleteButton, copyButton);
  const signature = createModelSignature(message.model);
  if (signature) {
    row.append(signature);
  }
  return row;
}

function flashSaveLimitRejection(button) {
  button.classList.remove("limit-rejected");
  void button.offsetWidth;
  button.classList.add("limit-rejected");
  window.setTimeout(() => button.classList.remove("limit-rejected"), 460);
}

function createModelSignature(model) {
  const label = String(model || "").trim();
  if (!label) {
    return null;
  }

  const signature = document.createElement("span");
  signature.className = `conversation-model-signature ${getModelSignatureClass(label)}`;
  signature.textContent = `\u2014 ${label}`;
  return signature;
}

function getModelSignatureClass(model) {
  const normalized = String(model || "").toLowerCase();
  if (/claude/.test(normalized)) {
    return "model-signature-claude";
  }
  if (/gemini|antigravity/.test(normalized)) {
    return "model-signature-gemini";
  }
  if (/codex|gpt|openai/.test(normalized)) {
    return "model-signature-codex";
  }
  return "model-signature-default";
}

function isMessageSaved(message) {
  return Boolean(message?.isSaved);
}

function createConversationActionButton({ className, iconClassName, title, tooltip = "", pressed = null }) {
  const button = document.createElement("button");
  button.className = `conversation-action-button ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", title);
  if (tooltip) {
    button.title = tooltip;
  }
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
