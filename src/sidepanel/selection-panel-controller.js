export function createSelectionPanelController({
  quoteElement,
  clearButton
}) {
  const selectionTextNode = document.createTextNode("");
  let lastRenderedSelectionText = "";
  let dismissedSelectionText = "";
  let hasDocument = false;
  let answerBusy = false;
  let readyToAsk = false;

  quoteElement.append(selectionTextNode);

  quoteElement.addEventListener("click", () => {
    if (getSelectionText()) {
      toggle();
    }
  });
  clearButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissComposerSelection();
  });
  document.addEventListener("pointerdown", (event) => {
    if (
      !quoteElement.classList.contains("expanded") ||
      quoteElement.contains(event.target) ||
      clearButton?.contains(event.target)
    ) {
      return;
    }

    collapse();
  }, true);
  document.addEventListener("focusin", (event) => {
    if (
      !quoteElement.classList.contains("expanded") ||
      quoteElement.contains(event.target) ||
      clearButton?.contains(event.target)
    ) {
      return;
    }

    collapse();
  });
  window.addEventListener("blur", collapse);
  quoteElement.addEventListener("keydown", (event) => {
    if (!getSelectionText() || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    toggle();
  });

  function render(selection) {
    if (!selection?.text) {
      dismissedSelectionText = "";
      lastRenderedSelectionText = "";
      setSelectionText("");
      quoteElement.classList.remove("expanded");
      quoteElement.classList.remove("has-overflow");
      quoteElement.setAttribute("aria-expanded", "false");
      setClearButtonVisible(false);
      updateReadiness();
      return;
    }

    if (selection.text === dismissedSelectionText) {
      clearComposerSelection();
      return;
    }

    if (selection.text === lastRenderedSelectionText) {
      updateReadiness();
      window.requestAnimationFrame(updateOverflow);
      return;
    }

    dismissedSelectionText = "";
    lastRenderedSelectionText = selection.text;
    setSelectionText(selection.text);
    quoteElement.classList.remove("expanded");
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
    setClearButtonVisible(true);
    updateReadiness();
    window.requestAnimationFrame(updateOverflow);
  }

  function getVisibleText() {
    return getSelectionText();
  }

  function clearComposerSelection() {
    lastRenderedSelectionText = "";
    setSelectionText("");
    quoteElement.classList.remove("expanded");
    quoteElement.classList.remove("has-overflow");
    quoteElement.setAttribute("aria-expanded", "false");
    setClearButtonVisible(false);
    updateReadiness();
  }

  function dismissComposerSelection() {
    dismissedSelectionText = getSelectionText();
    clearComposerSelection();
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
    if (!getSelectionText()) {
      return;
    }

    const hasOverflow = quoteElement.scrollHeight > quoteElement.clientHeight + 1;
    quoteElement.classList.toggle("has-overflow", hasOverflow || quoteElement.classList.contains("expanded"));
  }

  function setClearButtonVisible(visible) {
    if (!clearButton) {
      return;
    }

    clearButton.hidden = !visible;
  }

  function getSelectionText() {
    ensureSelectionTextNode();
    return selectionTextNode.textContent.trim();
  }

  function setSelectionText(text) {
    ensureSelectionTextNode();
    selectionTextNode.textContent = text || "";
    quoteElement.classList.toggle("empty", !selectionTextNode.textContent.trim());
  }

  function ensureSelectionTextNode() {
    if (selectionTextNode.parentNode !== quoteElement) {
      quoteElement.append(selectionTextNode);
    }
  }

  return {
    render,
    getVisibleText,
    clearComposerSelection,
    dismissComposerSelection,
    setAnswerBusy,
    updateReadiness,
    canAsk
  };
}
