let lastSentText = "";
let debounceTimer = null;

function getSelectedText() {
  return window.getSelection()?.toString().trim() || "";
}

function sendSelectionIfChanged(options = {}) {
  const text = getSelectedText();
  if (!text || (!options.force && text === lastSentText)) {
    return;
  }

  lastSentText = text;
  chrome.runtime.sendMessage({
    type: "PDF_SELECTION_CHANGED",
    text,
    sourceUrl: window.location.href,
    capturedAt: Date.now(),
    captureMethod: options.captureMethod || "content-script",
    openPanel: Boolean(options.openPanel)
  }).catch(() => {
    // The extension context can disappear during reloads; ignore transient errors.
  });
}

function scheduleSelectionCapture() {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(sendSelectionIfChanged, 150);
}

document.addEventListener("selectionchange", scheduleSelectionCapture);
document.addEventListener("mouseup", scheduleSelectionCapture);
document.addEventListener("keyup", scheduleSelectionCapture);
