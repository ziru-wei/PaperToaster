export function createQuestionScrollScheduler(threadElement) {
  let frame = 0;

  return function scheduleNewQuestionAtTop(messageIndex) {
    if (frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      // The message renderer positions cloud bubbles in its own animation frame.
      // Measure on the following frame so this uses the bubble's final packed position.
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const question = threadElement.querySelector(
          `.conversation-message.user[data-message-index="${Number(messageIndex)}"]`
        );
        if (!question) return;

        const rootStyle = window.getComputedStyle(document.documentElement);
        const topFadeHeight = Number.parseFloat(rootStyle.getPropertyValue("--chat-top-fade-height")) || 0;
        const topClearance = topFadeHeight + 12;
        const threadRect = threadElement.getBoundingClientRect();
        const questionRect = question.getBoundingClientRect();
        const questionTopInViewport = questionRect.top - threadRect.top;
        const requestedTop = threadElement.scrollTop + questionTopInViewport - topClearance;
        const maximumTop = Math.max(0, threadElement.scrollHeight - threadElement.clientHeight);
        const nextTop = Math.min(maximumTop, Math.max(0, requestedTop));
        if (Math.abs(nextTop - threadElement.scrollTop) < 1) return;

        threadElement.scrollTo({
          top: nextTop,
          behavior: "smooth"
        });
      });
    });
  };
}

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
