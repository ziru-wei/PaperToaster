const SCROLL_TO_LATEST_THRESHOLD = 80;

export function createScrollToLatestController({
  threadElement,
  buttonElement,
  hasMessages
}) {
  buttonElement.addEventListener("click", () => {
    scrollToBottom({ smooth: true });
  });
  threadElement.addEventListener("scroll", update);

  function scrollToBottom({ smooth = false } = {}) {
    if (smooth && typeof threadElement.scrollTo === "function") {
      threadElement.scrollTo({
        top: threadElement.scrollHeight,
        behavior: "smooth"
      });
    } else {
      threadElement.scrollTop = threadElement.scrollHeight;
    }

    window.requestAnimationFrame(update);
  }

  function update() {
    if (!hasMessages() || threadElement.hidden) {
      hide();
      return;
    }

    const distanceFromBottom = threadElement.scrollHeight - threadElement.clientHeight - threadElement.scrollTop;
    const hasScrollableThread = threadElement.scrollHeight > threadElement.clientHeight + 4;
    buttonElement.hidden = !hasScrollableThread || distanceFromBottom < SCROLL_TO_LATEST_THRESHOLD;
  }

  function hide() {
    buttonElement.hidden = true;
  }

  return {
    scrollToBottom,
    hide,
    update
  };
}
