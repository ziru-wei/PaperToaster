const NEW_THREAD_COMMAND = "---";

export function createComposerController({
  form,
  textarea,
  newThreadHintElement,
  promptPresetMenu,
  paperMentionMenu,
  promptPresetMenuElement,
  usePaperMentionMenu = () => false,
  routeSuggestion,
  shouldSuggestRoute = () => true,
  canSubmit,
  onSubmit,
  onNewThread
}) {
  form.addEventListener("submit", handleSubmit);
  textarea.addEventListener("input", handleInput);
  textarea.addEventListener("keydown", handleKeydown);
  textarea.addEventListener("focus", () => getActiveMenu().update());
  textarea.addEventListener("blur", () => {
    window.setTimeout(hideMenus, 120);
  });
  promptPresetMenuElement.addEventListener("mousedown", (event) => {
    getActiveMenu().preventBlurDismissal(event);
  });

  function getText() {
    return textarea.value.trim();
  }

  function clear() {
    textarea.value = "";
    routeSuggestion?.reset();
    updateNewThreadPromptHint();
  }

  function focus() {
    textarea.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isNewThreadCommand()) {
      startNewThread();
      return;
    }

    if (!getText() || !canSubmit()) {
      return;
    }

    const submission = routeSuggestion?.accept() || {};
    onSubmit(event, submission);
  }

  function handleInput() {
    routeSuggestion?.reset();
    getInactiveMenu()?.hide();
    getActiveMenu().update();
    updateNewThreadPromptHint();
  }

  function handleKeydown(event) {
    const isPlainEnter = (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.isComposing
    );

    if (isPlainEnter && isNewThreadCommand()) {
      event.preventDefault();
      startNewThread();
      return;
    }

    if (shouldSuggestRoute() && routeSuggestion?.handleKeydown(event)) {
      return;
    }

    if (getActiveMenu().handleKeydown(event)) {
      return;
    }

    if (!isPlainEnter) {
      return;
    }

    event.preventDefault();
    if (!getText() || !canSubmit()) {
      return;
    }

    if (shouldSuggestRoute() && routeSuggestion && !routeSuggestion.hasPendingSuggestionFor(getText())) {
      hideMenus();
      routeSuggestion.prepare(getText());
      return;
    }

    form.requestSubmit();
  }

  function isNewThreadCommand() {
    return getText() === NEW_THREAD_COMMAND;
  }

  function updateNewThreadPromptHint() {
    const active = isNewThreadCommand();
    newThreadHintElement.hidden = !active;
    textarea.classList.toggle("new-thread-command", active);
    if (active) {
      hideMenus();
    }
  }

  async function startNewThread() {
    routeSuggestion?.reset();
    await onNewThread();
  }

  function getActiveMenu() {
    return usePaperMentionMenu() && paperMentionMenu
      ? paperMentionMenu
      : promptPresetMenu;
  }

  function getInactiveMenu() {
    return getActiveMenu() === promptPresetMenu ? paperMentionMenu : promptPresetMenu;
  }

  function hideMenus() {
    promptPresetMenu.hide();
    paperMentionMenu?.hide();
  }

  return {
    getText,
    clear,
    focus,
    hideMenus
  };
}
