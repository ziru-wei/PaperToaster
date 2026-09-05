export function createSelectionPanelController({
  statusElement,
  quoteElement,
  toggleButton,
  askButton,
  contextStatusElement
}) {
  let lastRenderedSelectionText = "";
  let hasDocument = false;
  let hasThreadSelection = false;
  let answerBusy = false;

  toggleButton.addEventListener("click", toggle);

  function render(selection) {
    if (!selection?.text) {
      lastRenderedSelectionText = "";
      statusElement.textContent = "Select text in the PDF viewer.";
      quoteElement.textContent = "";
      quoteElement.classList.remove("expanded");
      toggleButton.classList.remove("expanded");
      toggleButton.hidden = true;
      toggleButton.setAttribute("aria-label", "Expand selected text");
      contextStatusElement.textContent = "";
      updateReadiness();
      return;
    }

    if (selection.text === lastRenderedSelectionText) {
      updateReadiness();
      window.requestAnimationFrame(updateOverflow);
      return;
    }

    lastRenderedSelectionText = selection.text;
    statusElement.textContent = "";
    quoteElement.textContent = selection.text;
    quoteElement.classList.remove("expanded");
    toggleButton.classList.remove("expanded");
    toggleButton.setAttribute("aria-label", "Expand selected text");
    contextStatusElement.textContent = "";
    updateReadiness();
    window.requestAnimationFrame(updateOverflow);
  }

  function getVisibleText() {
    return quoteElement.textContent.trim();
  }

  function clearComposerSelection() {
    lastRenderedSelectionText = "";
    statusElement.textContent = "";
    quoteElement.textContent = "";
    quoteElement.classList.remove("expanded");
    toggleButton.classList.remove("expanded");
    toggleButton.hidden = true;
    toggleButton.setAttribute("aria-label", "Expand selected text");
    updateReadiness();
  }

  function setContextStatus(message) {
    contextStatusElement.textContent = message || "";
  }

  function clearContextStatus() {
    contextStatusElement.textContent = "";
  }

  function setAnswerBusy(busy) {
    answerBusy = Boolean(busy);
    askButton.textContent = answerBusy ? "Asking..." : "Ask AI";
    updateReadiness();
  }

  function updateReadiness(state = {}) {
    if (Object.hasOwn(state, "hasDocument")) {
      hasDocument = Boolean(state.hasDocument);
    }

    if (Object.hasOwn(state, "hasThreadSelection")) {
      hasThreadSelection = Boolean(state.hasThreadSelection);
    }

    const hasSelection = Boolean(getVisibleText() || hasThreadSelection);
    askButton.disabled = !hasDocument || !hasSelection || answerBusy;
  }

  function toggle() {
    const expanded = !quoteElement.classList.contains("expanded");
    quoteElement.classList.toggle("expanded", expanded);
    toggleButton.classList.toggle("expanded", expanded);
    toggleButton.setAttribute("aria-label", expanded ? "Collapse selected text" : "Expand selected text");
    if (!expanded) {
      quoteElement.scrollTop = 0;
      updateOverflow();
    }
  }

  function updateOverflow() {
    if (!quoteElement.textContent.trim()) {
      toggleButton.hidden = true;
      return;
    }

    const hasOverflow = quoteElement.scrollHeight > quoteElement.clientHeight + 1;
    toggleButton.hidden = !hasOverflow && !quoteElement.classList.contains("expanded");
  }

  return {
    render,
    getVisibleText,
    clearComposerSelection,
    setContextStatus,
    clearContextStatus,
    setAnswerBusy,
    updateReadiness
  };
}
