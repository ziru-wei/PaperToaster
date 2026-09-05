export function getSidePanelElements(root = document) {
  const elements = {
    reloadPdf: root.querySelector("#reloadPdf"),
    documentTitle: root.querySelector("#documentTitle"),
    tabStatus: root.querySelector("#tabStatus"),
    pdfStatus: root.querySelector("#pdfStatus"),
    selectionStatus: root.querySelector("#selectionStatus"),
    selectionText: root.querySelector("#selectionText"),
    toggleSelectionText: root.querySelector("#toggleSelectionText"),
    selectionQuestionForm: root.querySelector("#selectionQuestionForm"),
    selectionQuestion: root.querySelector("#selectionQuestion"),
    promptPresetMenu: root.querySelector("#promptPresetMenu"),
    askSelectionAi: root.querySelector("#askSelectionAi"),
    selectionContextStatus: root.querySelector("#selectionContextStatus"),
    conversationThread: root.querySelector("#conversationThread")
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Side panel element missing: ${name}`);
    }
  }

  return elements;
}
