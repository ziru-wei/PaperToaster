export const loadingMessages = [
  "Toasting the pages...",
  "Heating the coils...",
  "Crunching the context...",
  "Cooking up an answer...",
  "Serving up..."
];

export function getInitialLoadingMessage() {
  return loadingMessages[0];
}

export function createLoadingMessageRotator(onMessage, options = {}) {
  const intervalMs = Number(options.intervalMs) || 1800;
  let index = 0;
  let timer = null;

  function emit() {
    onMessage?.(loadingMessages[index % loadingMessages.length]);
    index += 1;
  }

  return {
    start() {
      if (timer) {
        return;
      }

      emit();
      timer = window.setInterval(emit, intervalMs);
    },
    stop() {
      if (!timer) {
        return;
      }

      window.clearInterval(timer);
      timer = null;
    }
  };
}
