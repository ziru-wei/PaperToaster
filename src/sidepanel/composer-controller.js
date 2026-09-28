const NEW_THREAD_COMMAND = "---";

export function createComposerController({
  form,
  textarea,
  newThreadHintElement,
  promptPresetMenu,
  paperMentionMenu,
  promptPresetMenuElement,
  usePaperMentionMenu = () => false,
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
  syncContentState();

  function getText() {
    return textarea.value.trim();
  }

  function clear() {
    textarea.value = "";
    updateNewThreadPromptHint();
    syncContentState();
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

    onSubmit(event);
  }

  function handleInput() {
    syncContentState();
    getInactiveMenu()?.hide();
    getActiveMenu().update();
    updateNewThreadPromptHint();
  }

  function syncContentState() {
    textarea.classList.toggle("has-content", textarea.value.length > 0);
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
    await onNewThread();
  }

  function getActiveMenu() {
    return usePaperMentionMenu() && paperMentionMenu && isPaperMentionCommand()
      ? paperMentionMenu
      : promptPresetMenu;
  }

  function isPaperMentionCommand() {
    const cursor = textarea.selectionStart;
    if (cursor === null || cursor === undefined) {
      return false;
    }
    const value = textarea.value;
    const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
    const linePrefix = value.slice(lineStart, cursor);
    return linePrefix.startsWith("@");
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
