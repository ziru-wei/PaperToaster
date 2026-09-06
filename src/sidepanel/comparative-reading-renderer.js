import { renderConversationMessages } from "./conversation-message-renderer.js";

export function renderComparativeReadingPanel({
  elements,
  title,
  selectedPapers,
  messages,
  status,
  busy,
  contextReadiness,
  allowRemovePapers,
  onRemovePaper,
  onOpenPaperUrl,
  onToggleSaved,
  onDeleteUnit,
  onHighlightAssistantSelection,
  onHideAssistantSelection,
  onRemoveAssistantHighlight,
  onRemoveAssistantHiddenText,
  scrollToLatest,
  scrollToBottom = true
}) {
  document.body.classList.add("comparative-mode");
  elements.documentTitle.readOnly = true;
  elements.documentTitle.tabIndex = -1;
  elements.documentTitle.setAttribute("aria-readonly", "true");
  elements.documentTitle.value = title || "Comparative Reading";
  elements.documentTitle.placeholder = "Comparative Reading";
  elements.documentTitle.classList.remove("muted");
  elements.documentTitle.title = title || "Comparative Reading";
  elements.tabStatus.textContent = "";
  elements.tabStatus.removeAttribute("title");
  elements.copyTabUrl.disabled = true;
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
  elements.selectionContextStatus.textContent = "";

  renderPaperChips({
    container: elements.comparisonPaperChips,
    selectedPapers,
    allowRemovePapers,
    onRemovePaper,
    onOpenPaperUrl
  });
  renderConversationMessages(elements.conversationThread, messages, {
    onToggleSaved,
    onDeleteUnit,
    onHighlightAssistantSelection,
    onHideAssistantSelection,
    onRemoveAssistantHighlight,
    onRemoveAssistantHiddenText
  });
  if (scrollToBottom) {
    scrollToLatest?.scrollToBottom();
  } else {
    window.requestAnimationFrame(() => scrollToLatest?.update());
  }
}

export function clearComparativeReadingPanel(elements) {
  document.body.classList.remove("comparative-mode");
  elements.documentTitle.readOnly = false;
  elements.documentTitle.removeAttribute("tabindex");
  elements.documentTitle.removeAttribute("aria-readonly");
  elements.selectionText.hidden = false;
  elements.comparisonContextBar.hidden = true;
  elements.comparisonStatus.textContent = "";
  elements.comparisonStatus.hidden = false;
  elements.comparisonStatus.classList.remove("error");
  elements.reloadPdf.disabled = false;
  elements.conversationThreadArchive.disabled = false;
  elements.comparisonPaperChips.replaceChildren();
  elements.comparisonPaperChips.hidden = true;
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

function renderPaperChips({ container, selectedPapers, allowRemovePapers, onRemovePaper, onOpenPaperUrl }) {
  if (!selectedPapers.length) {
    container.replaceChildren();
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.replaceChildren(...selectedPapers.map((paper, index) => {
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
}
