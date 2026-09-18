export function getSidePanelElements(root = document) {
  const elements = {
    reloadPdf: root.querySelector("#reloadPdf"),
    downloadPaperArtifacts: root.querySelector("#downloadPaperArtifacts"),
    openDashboard: root.querySelector("#openDashboard"),
    openPaperUrl: root.querySelector("#openPaperUrl"),
    documentStar: root.querySelector("#documentStar"),
    documentLabel: root.querySelector("#documentLabel"),
    documentTitle: root.querySelector("#documentTitle"),
    comparisonContextBar: root.querySelector("#comparisonContextBar"),
    comparisonPaperChips: root.querySelector("#comparisonPaperChips"),
    comparisonStatus: root.querySelector("#comparisonStatus"),
    contextReadyIndicator: root.querySelector("#contextReadyIndicator"),
    statusLineShell: root.querySelector("#statusLineShell"),
    pdfStatus: root.querySelector("#pdfStatus"),
    agentConnectionHelp: root.querySelector("#agentConnectionHelp"),
    agentConnectionCommand: root.querySelector("#agentConnectionCommand"),
    copyAgentConnectionCommand: root.querySelector("#copyAgentConnectionCommand"),
    scrollToLatest: root.querySelector("#scrollToLatest"),
    selectionText: root.querySelector("#selectionText"),
    clearSelectionText: root.querySelector("#clearSelectionText"),
    selectionQuestionForm: root.querySelector("#selectionQuestionForm"),
    selectionQuestion: root.querySelector("#selectionQuestion"),
    modelCommandCompletion: root.querySelector("#modelCommandCompletion"),
    currentModelIndicator: root.querySelector("#currentModelIndicator"),
    newThreadPromptHint: root.querySelector("#newThreadPromptHint"),
    promptPresetMenu: root.querySelector("#promptPresetMenu"),
    idleState: root.querySelector("#idleState"),
    idleDashboardMessage: root.querySelector("#idleDashboardMessage"),
    manualParseMessage: root.querySelector("#manualParseMessage"),
    idleOpenDashboard: root.querySelector("#idleOpenDashboard"),
    conversationThread: root.querySelector("#conversationThread"),
    conversationThreadArchive: root.querySelector("#conversationThreadArchive"),
    conversationThreadWheel: root.querySelector("#conversationThreadWheel"),
    savedQaControls: root.querySelector("#savedQaControls"),
    savedQaToggle: root.querySelector("#savedQaToggle"),
    savedQaCollapseToggle: root.querySelector("#savedQaCollapseToggle"),
    sidePanelLiveStatus: root.querySelector("#sidePanelLiveStatus")
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Side panel element missing: ${name}`);
    }
  }

  return elements;
}
