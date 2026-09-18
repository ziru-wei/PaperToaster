export function scrollToConversationMessagePair({ userMessageIndex, assistantMessageIndex }) {
  const indexes = [userMessageIndex, assistantMessageIndex]
    .map((index) => Number(index))
    .filter((index) => Number.isInteger(index) && index >= 0);

  if (!indexes.length) {
    return;
  }

  window.requestAnimationFrame(() => {
    const targets = indexes
      .map((index) => document.querySelector(`.conversation-message[data-message-index="${index}"]`))
      .filter(Boolean);
    const firstTarget = targets[0];
    if (!firstTarget) {
      return;
    }

    firstTarget.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    targets.forEach((target) => target.classList.add("conversation-jump-highlight"));
    window.setTimeout(() => {
      targets.forEach((target) => target.classList.remove("conversation-jump-highlight"));
    }, 1200);
  });
}
