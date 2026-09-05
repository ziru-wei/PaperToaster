export function createSelectionPanelController({
  quoteElement,
  contextStatusElement
}) {
  let lastRenderedSelectionText = "";
  let hasDocument = false;
  let answerBusy = false;
  let readyToAsk = false;

  quoteElement.addEventListener("click", () => {
    if (quoteElement.textContent.trim()) {
      toggle();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!quoteElement.classList.contains("expanded") || quoteElement.contains(event.target)) {
      return;
    }

    collapse();
  }, true);
  document.addEventListener("focusin", (event) => {
    if (!quoteElement.classList.contains("expanded") || quoteElement.contains(event.target)) {
      return;
    }

    collapse();
  });
  window.addEventListener("blur", collapse);
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
      quoteElement.textContent = "";
      quoteElement.classList.remove("expanded");
      quoteElement.classList.remove("has-overflow");
      quoteElement.setAttribute("aria-expanded", "false");
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
    quoteElement.textContent = selection.text;
    quoteElement.classList.remove("expanded");
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
    contextStatusElement.textContent = "";
    updateReadiness();
    window.requestAnimationFrame(updateOverflow);
  }

  function getVisibleText() {
    return quoteElement.textContent.trim();
  }

  function clearComposerSelection() {
    lastRenderedSelectionText = "";
    quoteElement.textContent = "";
    quoteElement.classList.remove("expanded");
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
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
    if (!expanded) {
      collapse();
    }
  }

  function collapse() {
    quoteElement.classList.remove("expanded");
    quoteElement.setAttribute("aria-expanded", "false");
    quoteElement.scrollTop = 0;
    updateOverflow();
  }

  function updateOverflow() {
    if (!quoteElement.textContent.trim()) {
      return;
    }

    const hasOverflow = quoteElement.scrollHeight > quoteElement.clientHeight + 1;
    quoteElement.classList.toggle("has-overflow", hasOverflow || quoteElement.classList.contains("expanded"));
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
