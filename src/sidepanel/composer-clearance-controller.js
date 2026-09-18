const COMPOSER_OVERLAP_PX = 0;

export function createComposerClearanceController({ composerElement, chatPanelElement, comparisonPapersElement }) {
  const observer = new ResizeObserver(() => update());

  function start() {
    observer.observe(composerElement);
    observer.observe(comparisonPapersElement);
    update();
  }

  function update() {
    const composerHeight = composerElement.getBoundingClientRect().height;
    const clearance = Math.max(0, Math.ceil(composerHeight - COMPOSER_OVERLAP_PX));
    chatPanelElement.style.setProperty("--comparison-composer-clearance", `${clearance}px`);

    const paperStyle = window.getComputedStyle(comparisonPapersElement);
    const paperStackHeight = comparisonPapersElement.hidden
      ? 0
      : comparisonPapersElement.getBoundingClientRect().height
        + Number.parseFloat(paperStyle.marginTop || "0")
        + Number.parseFloat(paperStyle.marginBottom || "0");
    chatPanelElement.style.setProperty("--comparison-paper-stack-height", `${Math.ceil(paperStackHeight)}px`);
  }

  return { start, update };
}
