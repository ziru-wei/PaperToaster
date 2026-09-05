export function getSidePanelElements(root = document) {
  const elements = {
    reloadPdf: root.querySelector("#reloadPdf"),
    copyTabUrl: root.querySelector("#copyTabUrl"),
    documentTitle: root.querySelector("#documentTitle"),
    contextReadyIndicator: root.querySelector("#contextReadyIndicator"),
    tabStatus: root.querySelector("#tabStatus"),
    pdfStatus: root.querySelector("#pdfStatus"),
    selectionStatus: root.querySelector("#selectionStatus"),
    selectionText: root.querySelector("#selectionText"),
    toggleSelectionText: root.querySelector("#toggleSelectionText"),
    selectionQuestionForm: root.querySelector("#selectionQuestionForm"),
    selectionQuestion: root.querySelector("#selectionQuestion"),
    newThreadPromptHint: root.querySelector("#newThreadPromptHint"),
    promptPresetMenu: root.querySelector("#promptPresetMenu"),
    selectionContextStatus: root.querySelector("#selectionContextStatus"),
    conversationThread: root.querySelector("#conversationThread"),
    conversationThreadArchive: root.querySelector("#conversationThreadArchive"),
    conversationThreadWheel: root.querySelector("#conversationThreadWheel")
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Side panel element missing: ${name}`);
    }
  }

  return elements;
}
