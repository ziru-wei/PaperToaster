const NEW_THREAD_COMMAND = "---";

export function createComposerController({
  form,
  textarea,
  newThreadHintElement,
  promptPresetMenu,
  promptPresetMenuElement,
  routeSuggestion,
  shouldSuggestRoute = () => true,
  canSubmit,
  onSubmit,
  onNewThread
}) {
  form.addEventListener("submit", handleSubmit);
  textarea.addEventListener("input", handleInput);
  textarea.addEventListener("keydown", handleKeydown);
  textarea.addEventListener("focus", promptPresetMenu.update);
  textarea.addEventListener("blur", () => {
    window.setTimeout(promptPresetMenu.hide, 120);
  });
  promptPresetMenuElement.addEventListener("mousedown", promptPresetMenu.preventBlurDismissal);

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
    promptPresetMenu.update();
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

    if (promptPresetMenu.handleKeydown(event)) {
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
      promptPresetMenu.hide();
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
      promptPresetMenu.hide();
    }
  }

  async function startNewThread() {
    routeSuggestion?.reset();
    await onNewThread();
  }

  return {
    getText,
    clear,
    focus
  };
}
