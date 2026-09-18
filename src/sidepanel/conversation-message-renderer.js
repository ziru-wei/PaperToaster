import { renderMarkdownInto } from "../markdown/render-markdown.js";
import {
  normalizeAiResponseMarkdown,
  prepareAiResponseMarkdownForCopy
} from "../markdown/normalize-ai-response-markdown.js";
import { annotate } from "../../vendor/rough-notation/rough-notation.mjs";
import { createToasterEmptyState } from "./toaster-empty-state.js";
import { createPaperNoteEditor, disposePaperNoteEditor } from "./paper-note-editor.js";

const highlightBarCleanups = new WeakMap();
const questionCloudAnimationFrames = new WeakMap();
const questionCloudResizeObservers = new WeakMap();
const questionCloudLayouts = new WeakMap();
const pendingPreservedQuestionCloudPositions = new WeakMap();
const questionCloudExpansionFrames = new WeakMap();
const questionCloudAnswerResizeObservers = new WeakMap();
const pendingResponseVisualFrames = new WeakMap();

export function renderConversationMessages(threadElement, messages, options = {}) {
  const preservedQuestionCloudPositions = options.preserveQuestionCloudLayout
    ? captureQuestionCloudPositions(threadElement)
    : null;
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

  messages.forEach((message, messageIndex) => {
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
          if (event.target.closest("button, textarea, a, [contenteditable=\"true\"], .conversation-selection")) {
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
          scheduleConversationQuestionCloudExpansion(threadElement);
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
        content.append(editBar.bar);
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
  scheduleConversationQuestionCloudLayout(threadElement, { preservedQuestionCloudPositions });
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

export function scheduleConversationQuestionCloudLayout(threadElement, options = {}) {
  if (Object.prototype.hasOwnProperty.call(options, "preservedQuestionCloudPositions")) {
    if (options.preservedQuestionCloudPositions?.size) {
      pendingPreservedQuestionCloudPositions.set(threadElement, options.preservedQuestionCloudPositions);
    } else {
      pendingPreservedQuestionCloudPositions.delete(threadElement);
    }
  }
  if (typeof ResizeObserver === "function" && !questionCloudResizeObservers.has(threadElement)) {
    const observer = new ResizeObserver(() => scheduleConversationQuestionCloudLayout(threadElement));
    observer.observe(threadElement);
    questionCloudResizeObservers.set(threadElement, observer);
  }
  const pendingFrame = questionCloudAnimationFrames.get(threadElement);
  if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
  const frame = window.requestAnimationFrame(() => {
    questionCloudAnimationFrames.delete(threadElement);
    const preservedPositions = pendingPreservedQuestionCloudPositions.get(threadElement) || null;
    pendingPreservedQuestionCloudPositions.delete(threadElement);
    layoutConversationQuestionCloud(threadElement, preservedPositions);
  });
  questionCloudAnimationFrames.set(threadElement, frame);
}

function captureQuestionCloudPositions(threadElement) {
  const layout = questionCloudLayouts.get(threadElement);
  const positions = new Map();
  if (!layout) return positions;
  for (const [question, rect] of layout.positions) {
    const messageIndex = Number(question.dataset.messageIndex);
    if (Number.isInteger(messageIndex) && messageIndex >= 0) {
      positions.set(messageIndex, { ...rect });
    }
  }
  return positions;
}

function layoutConversationQuestionCloud(threadElement, preservedPositions = null) {
  const questions = Array.from(threadElement.querySelectorAll(".conversation-message.user"));
  const assistants = Array.from(threadElement.querySelectorAll(".conversation-message.assistant"));
  questions.forEach((question, index) => {
    question.classList.remove("cloud-question-expanded");
    question.dataset.cloudWidth = question.classList.contains("saved-unit")
      ? "wide"
      : ["compact", "medium", "wide", "compact", "medium"][index % 5];
    question.style.removeProperty("left");
    question.style.removeProperty("top");
  });
  assistants.forEach((assistant) => {
    assistant.style.removeProperty("left");
    assistant.style.removeProperty("top");
    assistant.style.removeProperty("width");
  });
  if (!threadElement.classList.contains("question-cloud-mode") || !questions.length) {
    questionCloudLayouts.delete(threadElement);
    disconnectQuestionCloudAnswerResizeObserver(threadElement);
    threadElement.style.removeProperty("--question-cloud-scroll-height");
    return;
  }

  const insets = getCloudHorizontalInsets(threadElement);
  const availableWidth = Math.max(120, threadElement.clientWidth - insets.left - insets.right);
  const halfWidth = availableWidth / 2;
  const gap = 7;
  const orderedQuestions = questions
    .map((element, index) => ({
      element,
      index,
      messageIndex: Number(element.dataset.messageIndex),
      saved: element.classList.contains("saved-unit"),
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height
    }))
    .sort((left, right) => Number(right.saved) - Number(left.saved) || left.index - right.index);
  const cloudCenterX = insets.left + halfWidth;
  const shouldPreservePositions = preservedPositions instanceof Map && preservedPositions.size > 0;
  const placed = shouldPreservePositions
    ? orderedQuestions
        .filter((question) => preservedPositions.has(question.messageIndex))
        .map((question) => {
          const previous = preservedPositions.get(question.messageIndex);
          return {
            x: previous.x - cloudCenterX,
            y: previous.y,
            width: question.width,
            height: question.height,
            element: question.element
          };
        })
    : [];
  const questionsToPlace = shouldPreservePositions
    ? orderedQuestions.filter((question) => !preservedPositions.has(question.messageIndex))
    : orderedQuestions;

  questionsToPlace.forEach((question, questionIndex) => {
    const appendBelowPreservedCloud = shouldPreservePositions &&
      question.element.classList.contains("pending-question") &&
      placed.length > 0;
    let position;
    if (appendBelowPreservedCloud) {
      const bottom = placed.reduce((value, rect) => Math.max(value, rect.y + rect.height), 0);
      position = centeredCloudRect(question, 0, bottom + gap + question.height / 2);
    } else {
      position = questionIndex === 0 && !placed.length
        ? centeredCloudRect(question, 0, 0)
        : findPackedCloudRect(question, questionIndex, placed, halfWidth, gap, {
            minimumY: shouldPreservePositions ? 4 : -Infinity
          });
    }
    if (!position) {
      const bottom = placed.reduce((value, rect) => Math.max(value, rect.y + rect.height), 0);
      position = centeredCloudRect(question, 0, bottom + gap + question.height / 2);
    }
    placed.push({ ...position, element: question.element });
  });

  const minX = Math.min(...placed.map((rect) => rect.x));
  const maxX = Math.max(...placed.map((rect) => rect.x + rect.width));
  const minY = Math.min(...placed.map((rect) => rect.y));
  const maxY = Math.max(...placed.map((rect) => rect.y + rect.height));
  const cloudWidth = maxX - minX;
  const cloudHeight = maxY - minY;
  const cloudLeft = insets.left + Math.max(0, (availableWidth - cloudWidth) / 2);
  const cloudTop = Math.max(12, (threadElement.clientHeight - cloudHeight) * 0.1);

  placed.forEach((rect) => {
    rect.x = shouldPreservePositions ? cloudCenterX + rect.x : cloudLeft + rect.x - minX;
    rect.y = shouldPreservePositions ? rect.y : cloudTop + rect.y - minY;
    rect.element.style.left = `${Math.round(rect.x)}px`;
    rect.element.style.top = `${Math.round(rect.y)}px`;
  });
  questionCloudLayouts.set(threadElement, {
    gap,
    insets,
    positions: new Map(placed.map((rect) => [rect.element, { ...rect }]))
  });
  applyConversationQuestionCloudExpansion(threadElement);
}

function findPackedCloudRect(question, questionIndex, placed, halfWidth, gap, options = {}) {
  const minimumY = Number.isFinite(options.minimumY) ? options.minimumY : -Infinity;
  const horizontalCandidates = createAdjacentCloudCandidates(question, questionIndex, placed, gap, true)
    .filter((candidate) => cloudRectFits(candidate, placed, halfWidth, gap, minimumY));
  if (horizontalCandidates.length) return chooseCompactCloudCandidate(horizontalCandidates);

  const verticalCandidates = createAdjacentCloudCandidates(question, questionIndex, placed, gap, false)
    .filter((candidate) => cloudRectFits(candidate, placed, halfWidth, gap, minimumY));
  if (verticalCandidates.length) return chooseCompactCloudCandidate(verticalCandidates);

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let step = 1; step <= 6000; step += 1) {
    const radius = 5.2 * Math.sqrt(step);
    const angle = step * goldenAngle + questionIndex * 0.83;
    const centerX = Math.cos(angle) * radius;
    const centerY = Math.sin(angle) * radius * 0.68;
    const candidate = centeredCloudRect(question, centerX, centerY);
    if (candidate.y < minimumY) continue;
    if (candidate.x < -halfWidth || candidate.x + candidate.width > halfWidth) continue;
    if (placed.every((rect) => !cloudRectsOverlap(candidate, rect, gap))) return candidate;
  }
  return null;
}

function createAdjacentCloudCandidates(question, questionIndex, placed, gap, horizontal) {
  const candidates = [];
  const direction = questionIndex % 2 === 0 ? -1 : 1;
  for (const anchor of placed) {
    if (horizontal) {
      const yOffsets = [
        direction * Math.min(question.height, anchor.height) * 0.28,
        0,
        -direction * Math.min(question.height, anchor.height) * 0.42
      ];
      for (const yOffset of yOffsets) {
        const y = anchor.y + (anchor.height - question.height) / 2 + yOffset;
        candidates.push({ x: anchor.x + anchor.width + gap, y, width: question.width, height: question.height });
        candidates.push({ x: anchor.x - question.width - gap, y, width: question.width, height: question.height });
      }
    } else {
      const xOffsets = [
        direction * Math.min(question.width, anchor.width) * 0.24,
        -direction * Math.min(question.width, anchor.width) * 0.18,
        0
      ];
      for (const xOffset of xOffsets) {
        const x = anchor.x + (anchor.width - question.width) / 2 + xOffset;
        candidates.push({ x, y: anchor.y - question.height - gap, width: question.width, height: question.height });
        candidates.push({ x, y: anchor.y + anchor.height + gap, width: question.width, height: question.height });
      }
    }
  }
  return candidates;
}

function cloudRectFits(candidate, placed, halfWidth, gap, minimumY = -Infinity) {
  return candidate.y >= minimumY &&
    candidate.x >= -halfWidth &&
    candidate.x + candidate.width <= halfWidth &&
    placed.every((rect) => !cloudRectsOverlap(candidate, rect, gap));
}

function chooseCompactCloudCandidate(candidates) {
  return candidates.reduce((best, candidate) => {
    const centerX = candidate.x + candidate.width / 2;
    const centerY = candidate.y + candidate.height / 2;
    const score = Math.abs(centerX) * 0.82 + Math.abs(centerY) * 1.18;
    return !best || score < best.score ? { ...candidate, score } : best;
  }, null);
}

function scheduleConversationQuestionCloudExpansion(threadElement) {
  const pendingFrame = questionCloudExpansionFrames.get(threadElement);
  if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
  const frame = window.requestAnimationFrame(() => {
    questionCloudExpansionFrames.delete(threadElement);
    applyConversationQuestionCloudExpansion(threadElement);
  });
  questionCloudExpansionFrames.set(threadElement, frame);
}

function applyConversationQuestionCloudExpansion(threadElement) {
  const layout = questionCloudLayouts.get(threadElement);
  if (!layout || !threadElement.classList.contains("question-cloud-mode")) return;
  const questions = [...layout.positions.keys()];
  const assistants = Array.from(threadElement.querySelectorAll(".conversation-message.assistant"));
  for (const [question, rect] of layout.positions) {
    question.classList.remove("cloud-question-expanded");
    question.style.left = `${Math.round(rect.x)}px`;
    question.style.top = `${Math.round(rect.y)}px`;
  }
  assistants.forEach((assistant) => {
    assistant.style.removeProperty("left");
    assistant.style.removeProperty("top");
    assistant.style.removeProperty("width");
  });

  const expandedQuestions = questions.filter((question) => {
    const responseIndex = question.dataset.responseMessageIndex;
    const response = responseIndex === undefined
      ? null
      : threadElement.querySelector(`.conversation-message.assistant[data-message-index="${responseIndex}"]`);
    return response && !response.classList.contains("assistant-response-collapsed");
  });
  if (!expandedQuestions.length) {
    disconnectQuestionCloudAnswerResizeObserver(threadElement);
    updateQuestionCloudScrollHeight(threadElement, [...layout.positions.values()]);
    return;
  }

  const insets = getCloudHorizontalInsets(threadElement);
  const answerWidth = Math.max(1, threadElement.clientWidth - insets.left - insets.right);
  const expandedUnits = expandedQuestions
    .map((question) => {
      const base = layout.positions.get(question);
      const responseIndex = question.dataset.responseMessageIndex;
      const answer = threadElement.querySelector(`.conversation-message.assistant[data-message-index="${responseIndex}"]`);
      question.classList.add("cloud-question-expanded");
      const questionWidth = question.getBoundingClientRect().width;
      const questionX = threadElement.clientWidth - insets.right - questionWidth;
      question.style.left = `${Math.round(questionX)}px`;
      answer.style.left = `${Math.round(insets.left)}px`;
      answer.style.width = `${Math.round(answerWidth)}px`;
      return { question, answer, base, questionX, questionWidth };
    })
    .sort((left, right) => left.base.y - right.base.y);

  let expandedBottom = -Infinity;
  for (const unit of expandedUnits) {
    const questionHeight = unit.question.getBoundingClientRect().height;
    const top = Math.max(unit.base.y, expandedBottom + layout.gap);
    const answerY = top + questionHeight + layout.gap;
    unit.question.style.top = `${Math.round(top)}px`;
    unit.answer.style.top = `${Math.round(answerY)}px`;
    const answerContent = unit.answer.querySelector(".conversation-assistant-content");
    const answerStyle = window.getComputedStyle(unit.answer);
    const verticalPadding = (Number.parseFloat(answerStyle.paddingTop) || 0) +
      (Number.parseFloat(answerStyle.paddingBottom) || 0);
    const answerHeight = Math.max(
      unit.answer.getBoundingClientRect().height,
      unit.answer.scrollHeight,
      (answerContent?.scrollHeight || 0) + verticalPadding
    );
    unit.top = top;
    unit.questionHeight = questionHeight;
    unit.answerY = answerY;
    unit.answerHeight = answerHeight;
    unit.bottom = answerY + answerHeight;
    expandedBottom = unit.bottom;
  }

  observeExpandedQuestionCloudAnswers(threadElement, expandedUnits.map(({ answer }) => answer));
  const positionedRects = [];
  const collapsedItems = questions
    .filter((question) => !expandedQuestions.includes(question))
    .map((question) => ({ question, rect: layout.positions.get(question) }))
    .sort((left, right) => left.rect.y - right.rect.y);
  for (const { question, rect } of collapsedItems) {
    let y = rect.y;
    let shifted;
    do {
      shifted = false;
      for (const unit of expandedUnits) {
        if (y + rect.height + layout.gap > unit.top && y < unit.bottom + layout.gap) {
          y = unit.bottom + layout.gap;
          shifted = true;
        }
      }
      const collision = positionedRects.find((placed) => cloudRectsOverlap({ ...rect, y }, placed, layout.gap));
      if (collision) {
        y = collision.y + collision.height + layout.gap;
        shifted = true;
      }
    } while (shifted);
    question.style.top = `${Math.round(y)}px`;
    positionedRects.push({ ...rect, y });
  }

  updateQuestionCloudScrollHeight(threadElement, [
    ...positionedRects,
    ...expandedUnits.flatMap((unit) => [
      { x: unit.questionX, y: unit.top, width: unit.questionWidth, height: unit.questionHeight },
      { x: insets.left, y: unit.answerY, width: answerWidth, height: unit.answerHeight }
    ])
  ]);
}

function getCloudHorizontalInsets(threadElement) {
  const style = window.getComputedStyle(threadElement);
  return {
    left: Math.max(4, Number.parseFloat(style.paddingLeft) || 0),
    right: Math.max(4, Number.parseFloat(style.paddingRight) || 0)
  };
}

function updateQuestionCloudScrollHeight(threadElement, rects) {
  const bottom = rects.reduce((value, rect) => Math.max(value, rect.y + rect.height), 0);
  threadElement.style.setProperty("--question-cloud-scroll-height", `${Math.ceil(bottom + 28)}px`);
}

function observeExpandedQuestionCloudAnswers(threadElement, answers) {
  if (typeof ResizeObserver !== "function") return;
  const current = questionCloudAnswerResizeObservers.get(threadElement);
  if (current?.answers.length === answers.length && current.answers.every((answer, index) => answer === answers[index])) return;
  current?.observer.disconnect();
  const observer = new ResizeObserver(() => scheduleConversationQuestionCloudExpansion(threadElement));
  answers.forEach((answer) => observer.observe(answer.querySelector(".conversation-assistant-content") || answer));
  questionCloudAnswerResizeObservers.set(threadElement, { answers, observer });
}

function disconnectQuestionCloudAnswerResizeObserver(threadElement) {
  questionCloudAnswerResizeObservers.get(threadElement)?.observer.disconnect();
  questionCloudAnswerResizeObservers.delete(threadElement);
}

function centeredCloudRect(question, centerX, centerY) {
  return {
    x: centerX - question.width / 2,
    y: centerY - question.height / 2,
    width: question.width,
    height: question.height
  };
}

function cloudRectsOverlap(left, right, gap) {
  return !(
    left.x + left.width + gap <= right.x ||
    right.x + right.width + gap <= left.x ||
    left.y + left.height + gap <= right.y ||
    right.y + right.height + gap <= left.y
  );
}

function createQuestionResponseMap(messages) {
  const pendingQuestions = [];
  const responseIndexes = new Map();
  messages.forEach((message, messageIndex) => {
    if (message?.role === "user") {
      pendingQuestions.push(messageIndex);
      return;
    }
    if (message?.role !== "assistant" || !pendingQuestions.length) return;
    responseIndexes.set(pendingQuestions.shift(), messageIndex);
  });
  return responseIndexes;
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
  scheduleEditedQuestionCloudExpansion(item);
  questionLabel.focus();
  moveCaretToEnd(questionLabel);

  questionLabel.oninput = () => {
    scheduleEditedQuestionCloudExpansion(item);
  };
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
  scheduleEditedQuestionCloudExpansion(item);
  editButton.focus();
}

function scheduleEditedQuestionCloudExpansion(item) {
  const threadElement = item.closest(".question-cloud-mode");
  if (threadElement) scheduleConversationQuestionCloudExpansion(threadElement);
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

  if (!units.length) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "saved-qa-empty-slot";
    emptySlot.append(createToasterEmptyState("Toaster is plugged in...", {
      className: "saved-qa-empty"
    }));
    threadElement.append(emptySlot);
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
        element: unitElement
      });
    }
  });

  normalItems
    .sort(compareSavedQuestionAnswerUnitItemsByAge)
    .forEach((item) => track.append(item.element));
  if (pinnedRow.children.length) {
    threadElement.append(pinnedRow);
  }
  if (track.children.length) {
    threadElement.append(track);
  }
  registerHighlightEditBars(threadElement, editBars, cleanupCallbacks);
}

function createPaperUserNoteElement(options) {
  return createPaperNoteEditor({
    noteDocument: options.userNoteDocument,
    onChange: options.onUserNoteChange,
    onCommit: options.onUserNoteCommit,
    onError: options.onUserNoteError
  });
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
