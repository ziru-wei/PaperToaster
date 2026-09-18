import { renderConversationMessages } from "./conversation-message-renderer.js";
import { clearMoreToastBurn, syncMoreToastBurn } from "./more-toast-burn.js";
import { createToasterEmptyState } from "./toaster-empty-state.js";

export function renderComparativeReadingPanel({
  elements,
  title,
  titleEditable = false,
  selectedPapers,
  messages,
  chronologicalMode = false,
  status,
  emptySubtitle = "More toast is needed",
  busy,
  contextReadiness,
  allowRemovePapers,
  onRemovePaper,
  onClearPapers,
  onOpenPaperUrl,
  onEditUserMessage,
  onToggleSaved,
  onSaveLimitRejected,
  onDeleteUnit,
  onHighlightAssistantSelection,
  onCircleAssistantSelection,
  onHideAssistantSelection,
  onRemoveAssistantHighlight,
  onRemoveAssistantCircle,
  onRemoveAssistantHiddenText,
  onNavigateCitation,
  collapsedAssistantMessageIndexes,
  onAssistantResponseCollapseChange,
  scrollToLatest,
  scrollToBottom = true
}) {
  document.body.classList.add("comparative-mode");
  document.body.classList.toggle("comparison-empty-mode", !messages.length);
  elements.documentTitle.readOnly = !titleEditable;
  elements.documentTitle.tabIndex = titleEditable ? 0 : -1;
  elements.documentTitle.setAttribute("aria-readonly", String(!titleEditable));
  if (!titleEditable || document.activeElement !== elements.documentTitle) {
    elements.documentTitle.value = title || "Comparative Reading";
  }
  elements.documentTitle.placeholder = "Comparative Reading";
  elements.documentTitle.classList.remove("muted");
  elements.documentTitle.removeAttribute("title");
  elements.openPaperUrl.disabled = true;
  elements.reloadPdf.disabled = true;
  elements.documentStar.disabled = true;
  elements.conversationThreadArchive.disabled = true;
  renderContextReadiness(elements.contextReadyIndicator, contextReadiness);
  elements.pdfStatus.textContent = "";
  elements.pdfStatus.classList.remove("error");
  elements.selectionText.textContent = "";
  elements.selectionText.hidden = true;
  const visibleStatus = status || "";
  elements.comparisonStatus.textContent = visibleStatus;
  elements.comparisonStatus.hidden = !visibleStatus;
  elements.comparisonStatus.classList.toggle("error", Boolean(status));
  elements.comparisonContextBar.hidden = !visibleStatus;
  elements.selectionQuestion.placeholder = allowRemovePapers ? "Press @ or @# to feed." : "";

  renderPaperChips({
    container: elements.comparisonPaperChips,
    selectedPapers,
    allowRemovePapers,
    onRemovePaper,
    onClearPapers,
    onOpenPaperUrl
  });
  elements.conversationThread.classList.remove("comparison-empty-thread");
  renderConversationMessages(elements.conversationThread, messages, {
    chronologicalMode,
    collapsedAssistantMessageIndexes,
    onAssistantResponseCollapseChange,
    onEditUserMessage,
    onToggleSaved,
    onSaveLimitRejected,
    onDeleteUnit,
    onHighlightAssistantSelection,
    onCircleAssistantSelection,
    onHideAssistantSelection,
    onRemoveAssistantHighlight,
    onRemoveAssistantCircle,
    onRemoveAssistantHiddenText,
    onNavigateCitation
  });
  if (!messages.length) {
    renderComparisonEmptyState(elements.conversationThread, selectedPapers.length, emptySubtitle);
  }
  if (scrollToBottom) {
    scrollToLatest?.scrollToBottom();
  } else {
    window.requestAnimationFrame(() => scrollToLatest?.update());
  }
}

export function clearComparativeReadingPanel(elements) {
  document.body.classList.remove("comparative-mode");
  document.body.classList.remove("comparison-empty-mode");
  elements.conversationThread.classList.remove("comparison-empty-thread");
  elements.conversationThread.classList.remove("conversation-chronological-mode");
  elements.documentTitle.readOnly = false;
  elements.documentTitle.removeAttribute("tabindex");
  elements.documentTitle.removeAttribute("aria-readonly");
  elements.selectionText.hidden = false;
  elements.selectionQuestion.placeholder = "Start with typing /";
  elements.comparisonContextBar.hidden = true;
  elements.comparisonStatus.textContent = "";
  elements.comparisonStatus.hidden = false;
  elements.comparisonStatus.classList.remove("error");
  elements.reloadPdf.disabled = false;
  elements.conversationThreadArchive.disabled = false;
  elements.comparisonPaperChips.replaceChildren();
  elements.comparisonPaperChips.hidden = true;
}

function renderComparisonEmptyState(threadElement, paperCount, subtitle) {
  threadElement.textContent = "";
  threadElement.classList.remove("saved-qa-thread");
  threadElement.classList.add("comparison-empty-thread");
  threadElement.hidden = false;
  const empty = createToasterEmptyState("Hot air circulating...", {
    className: "comparison-empty saved-qa-empty",
    subtitle
  });
  threadElement.append(empty);
  if (subtitle === "More toast is needed") {
    syncMoreToastBurn({
      element: empty.querySelector(".toaster-empty-subtitle"),
      paperCount,
      stateKey: threadElement
    });
  } else {
    empty.querySelector(".toaster-empty-subtitle")?.classList.add("comparison-overflow-status");
    clearMoreToastBurn(threadElement);
  }
}

function renderContextReadiness(element, contextReadiness = {}) {
  const state = contextReadiness.state || "warning";
  const label = contextReadiness.label || "Comparative context not ready";
  element.classList.toggle("ready", state === "ready");
  element.classList.toggle("loading", state === "loading");
  element.classList.toggle("warning", state === "warning");
  element.title = label;
  element.setAttribute("aria-label", label);
}

function renderPaperChips({ container, selectedPapers, allowRemovePapers, onRemovePaper, onClearPapers, onOpenPaperUrl }) {
  if (!selectedPapers.length) {
    container.replaceChildren();
    container.hidden = true;
    return;
  }

  container.hidden = false;
  const children = [];
  if (allowRemovePapers) {
    const clearRow = document.createElement("div");
    clearRow.className = "comparison-paper-clear-row";

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "comparison-paper-clear";
    clearButton.setAttribute("aria-label", "Clear all comparison papers");
    clearButton.textContent = "×";
    clearButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClearPapers?.();
    });

    clearRow.append(clearButton);
    children.push(clearRow);
  }

  children.push(...selectedPapers.map((paper, index) => {
    const chip = document.createElement("span");
    chip.className = "comparison-paper-chip";
    chip.classList.toggle("locked", !allowRemovePapers);

    const label = document.createElement("span");
    label.className = "comparison-paper-label";
    label.textContent = `P${index + 1}`;

    const title = document.createElement("span");
    title.className = "comparison-paper-title";
    title.textContent = paper.title || paper.documentKey;
    title.title = paper.title || paper.documentKey;

    const actions = document.createElement("span");
    actions.className = "comparison-paper-actions";

    if (allowRemovePapers) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "comparison-paper-remove";
      remove.textContent = "×";
      remove.title = "Remove from comparison";
      remove.setAttribute("aria-label", `Remove ${paper.title || "paper"} from comparison`);
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemovePaper?.(paper.documentKey);
      });
      actions.append(remove);
    }

    const open = document.createElement("button");
    open.type = "button";
    open.className = "comparison-paper-open";
    open.disabled = !paper.canonicalUrl;
    open.title = paper.canonicalUrl ? "Open paper URL" : "No paper URL";
    open.setAttribute("aria-label", `Open ${paper.title || "paper"} URL`);
    open.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onOpenPaperUrl?.(paper);
    });
    actions.append(open);

    chip.append(label, title, actions);
    return chip;
  }));
  container.replaceChildren(...children);
}
