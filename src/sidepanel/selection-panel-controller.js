export function createSelectionPanelController({
  statusElement,
  quoteElement,
  toggleButton,
  contextStatusElement
}) {
  let lastRenderedSelectionText = "";
  let hasDocument = false;
  let answerBusy = false;
  let readyToAsk = false;

  toggleButton.addEventListener("click", toggle);
  quoteElement.addEventListener("click", () => {
    if (quoteElement.textContent.trim()) {
      toggle();
    }
  });
  document.addEventListener("click", (event) => {
    if (!quoteElement.classList.contains("expanded") || quoteElement.contains(event.target)) {
      return;
    }

    collapse();
  });
  quoteElement.addEventListener("keydown", (event) => {
    if (!quoteElement.textContent.trim() || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    toggle();
  });

  function render(selection) {
    if (!selection?.text) {
      lastRenderedSelectionText = "";
      statusElement.textContent = "";
      quoteElement.textContent = "";
      quoteElement.classList.remove("expanded");
      quoteElement.classList.remove("has-overflow");
      quoteElement.setAttribute("aria-expanded", "false");
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
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
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
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
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
    updateReadiness();
  }

  function updateReadiness(state = {}) {
    if (Object.hasOwn(state, "hasDocument")) {
      hasDocument = Boolean(state.hasDocument);
    }

    readyToAsk = hasDocument && !answerBusy;
  }

  function canAsk() {
    return readyToAsk;
  }

  function toggle() {
    const expanded = !quoteElement.classList.contains("expanded");
    quoteElement.classList.toggle("expanded", expanded);
    quoteElement.setAttribute("aria-expanded", String(expanded));
    toggleButton.classList.toggle("expanded", expanded);
    toggleButton.setAttribute("aria-label", expanded ? "Collapse selected text" : "Expand selected text");
    if (!expanded) {
      collapse();
    }
  }

  function collapse() {
    quoteElement.classList.remove("expanded");
    quoteElement.setAttribute("aria-expanded", "false");
    toggleButton.classList.remove("expanded");
    toggleButton.setAttribute("aria-label", "Expand selected text");
    quoteElement.scrollTop = 0;
    updateOverflow();
  }

  function updateOverflow() {
    if (!quoteElement.textContent.trim()) {
      toggleButton.hidden = true;
      return;
    }

    const hasOverflow = quoteElement.scrollHeight > quoteElement.clientHeight + 1;
    quoteElement.classList.toggle("has-overflow", hasOverflow || quoteElement.classList.contains("expanded"));
    toggleButton.hidden = true;
  }

  return {
    render,
    getVisibleText,
    clearComposerSelection,
    setContextStatus,
    clearContextStatus,
    setAnswerBusy,
    updateReadiness,
    canAsk
  };
}
