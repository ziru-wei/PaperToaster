export function getSidePanelElements(root = document) {
  const elements = {
    reloadPdf: root.querySelector("#reloadPdf"),
    openDashboard: root.querySelector("#openDashboard"),
    copyTabUrl: root.querySelector("#copyTabUrl"),
    documentStar: root.querySelector("#documentStar"),
    documentTitle: root.querySelector("#documentTitle"),
    comparisonContextBar: root.querySelector("#comparisonContextBar"),
    comparisonPaperChips: root.querySelector("#comparisonPaperChips"),
    comparisonStatus: root.querySelector("#comparisonStatus"),
    contextReadyIndicator: root.querySelector("#contextReadyIndicator"),
    tabStatus: root.querySelector("#tabStatus"),
    pdfStatus: root.querySelector("#pdfStatus"),
    scrollToLatest: root.querySelector("#scrollToLatest"),
    selectionText: root.querySelector("#selectionText"),
    selectionQuestionForm: root.querySelector("#selectionQuestionForm"),
    selectionQuestion: root.querySelector("#selectionQuestion"),
    routeSuggestion: root.querySelector("#routeSuggestion"),
    newThreadPromptHint: root.querySelector("#newThreadPromptHint"),
    promptPresetMenu: root.querySelector("#promptPresetMenu"),
    selectionContextStatus: root.querySelector("#selectionContextStatus"),
    conversationThread: root.querySelector("#conversationThread"),
    conversationThreadArchive: root.querySelector("#conversationThreadArchive"),
    conversationThreadWheel: root.querySelector("#conversationThreadWheel"),
    savedQaToggle: root.querySelector("#savedQaToggle")
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Side panel element missing: ${name}`);
    }
  }

  return elements;
}
