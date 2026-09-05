const NEW_THREAD_COMMAND = "---";

export function createComposerController({
  form,
  textarea,
  newThreadHintElement,
  promptPresetMenu,
  promptPresetMenuElement,
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
    updateNewThreadPromptHint();
  }

  function focus() {
    textarea.focus();
  }

  function handleSubmit(event) {
    if (isNewThreadCommand()) {
      event.preventDefault();
      startNewThread();
      return;
    }

    onSubmit(event);
  }

  function handleInput() {
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
    await onNewThread();
  }

  return {
    getText,
    clear,
    focus
  };
}
