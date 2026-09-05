import { MessageType } from "../shared/messages.js";
import { PROMPT_PRESETS_KEY } from "../storage/prompt-presets-store.js";
import { createAskFlowController } from "./ask-flow-controller.js";
import { createComposerController } from "./composer-controller.js";
import { createConversationPanelController } from "./conversation-panel-controller.js";
import { createPaperActionsController } from "./paper-actions-controller.js";
import { createPromptPresetMenuController } from "./prompt-preset-menu.js";
import { createSelectionPanelController } from "./selection-panel-controller.js";
import { createSidePanelDocumentContext } from "./sidepanel-document-context.js";
import { getSidePanelElements } from "./sidepanel-elements.js";

const elements = getSidePanelElements();
let composer = null;
let paperActions = null;

const conversation = createConversationPanelController({
  threadElement: elements.conversationThread,
  threadArchiveButton: elements.conversationThreadArchive,
  threadWheelElement: elements.conversationThreadWheel,
  scrollToBottomButton: elements.scrollToLatest,
  onDiagnostic: addDiagnostic,
  onChange: updateAskReadiness
});

const selectionPanel = createSelectionPanelController({
  quoteElement: elements.selectionText,
  contextStatusElement: elements.selectionContextStatus
});

const promptPresetMenu = createPromptPresetMenuController({
  textarea: elements.selectionQuestion,
  menuElement: elements.promptPresetMenu,
  onError: (error) => console.debug("[PDF AI] Prompt presets unavailable", error)
});

const documentContext = createSidePanelDocumentContext({
  elements,
  conversation,
  selectionPanel,
  onDocumentChange: (document) => paperActions?.render(document),
  onAskReadinessChange: updateAskReadiness,
  onDiagnostic: addDiagnostic
});

paperActions = createPaperActionsController({
  starElement: elements.documentStar,
  getCurrentDocument: documentContext.getCurrentDocument,
  onDiagnostic: addDiagnostic,
  onError: documentContext.showError
});

const askFlow = createAskFlowController({
  conversation,
  selectionPanel,
  getComposer: () => composer,
  getCurrentDocument: documentContext.getCurrentDocument,
  clearError: documentContext.clearError,
  showError: documentContext.showError,
  updateAskReadiness
});

composer = createComposerController({
  form: elements.selectionQuestionForm,
  textarea: elements.selectionQuestion,
  newThreadHintElement: elements.newThreadPromptHint,
  promptPresetMenu,
  promptPresetMenuElement: elements.promptPresetMenu,
  canSubmit: () => selectionPanel.canAsk(),
  onSubmit: askFlow.askAiAboutSelection,
  onNewThread: askFlow.startNewThreadFromComposer
});

elements.openDashboard.addEventListener("click", openDashboard);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.PDF_SELECTION_CHANGED) {
    documentContext.refreshSelection();
  }

  if (message?.type === MessageType.LIBRARY_PAPER_CONTEXT_CHANGED) {
    documentContext.scheduleRefreshState();
  }

  if (message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED && message.documentKey === documentContext.getCurrentDocument()?.documentKey) {
    paperActions.refresh();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[PROMPT_PRESETS_KEY]) {
    promptPresetMenu.load();
  }
});

promptPresetMenu.load();
documentContext.start();

function updateAskReadiness() {
  selectionPanel.updateReadiness({
    hasDocument: Boolean(documentContext.getCurrentDocument())
  });
}

function openDashboard() {
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/dashboard/dashboard.html")
  });
}

function addDiagnostic(message) {
  console.debug("[PDF AI]", message);
}
