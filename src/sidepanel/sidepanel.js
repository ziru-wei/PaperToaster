import { MessageType } from "../shared/messages.js";
import { PROMPT_PRESETS_KEY } from "../storage/prompt-presets-store.js";
import { createAskFlowController } from "./ask-flow-controller.js";
import { createComposerController } from "./composer-controller.js";
import { createComparativeReadingController } from "./comparative-reading-controller.js";
import { createConversationPanelController } from "./conversation-panel-controller.js";
import { createPaperActionsController } from "./paper-actions-controller.js";
import { createPromptPresetMenuController } from "./prompt-preset-menu.js";
import { createRouteSuggestionController } from "./route-suggestion-controller.js";
import { createScrollToLatestController } from "./scroll-to-latest-controller.js";
import { createSelectionPanelController } from "./selection-panel-controller.js";
import { createSidePanelDocumentContext } from "./sidepanel-document-context.js";
import { getSidePanelElements } from "./sidepanel-elements.js";

const SAVED_QA_TOGGLE_TOP_KEY = "savedQaToggleTopPercent";

const elements = getSidePanelElements();
let composer = null;
let paperActions = null;
let conversation = null;
let comparativeReading = null;
let lastAutoOpenedSavedContextId = "";

const scrollToLatest = createScrollToLatestController({
  threadElement: elements.conversationThread,
  buttonElement: elements.scrollToLatest,
  hasMessages: () => comparativeReading?.isActive()
    ? comparativeReading.hasScrollableMessages()
    : Boolean(conversation?.hasScrollableMessages())
});

conversation = createConversationPanelController({
  threadElement: elements.conversationThread,
  threadArchiveButton: elements.conversationThreadArchive,
  threadWheelElement: elements.conversationThreadWheel,
  scrollToLatest,
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

const routeSuggestion = createRouteSuggestionController({
  element: elements.routeSuggestion,
  getSelectionText: () => selectionPanel.getVisibleText()
});

comparativeReading = createComparativeReadingController({
  elements,
  getComposer: () => composer,
  scrollToLatest,
  clearError: () => documentContext?.clearError(),
  showError: (message) => documentContext?.showError(message),
  onChange: updateAskReadiness,
  onDiagnostic: addDiagnostic
});

const documentContext = createSidePanelDocumentContext({
  elements,
  conversation,
  selectionPanel,
  onDocumentChange: async (document) => {
    comparativeReading.hide();
    routeSuggestion.reset();
    paperActions?.render(document);
    if (shouldAutoOpenSavedQuestionAnswerView(document)) {
      await conversation.setSavedQuestionAnswerViewActive(true);
    }
    syncSavedQuestionAnswerMode();
  },
  onComparativeReadingContext: async (context) => {
    lastAutoOpenedSavedContextId = "";
    await conversation.setSavedQuestionAnswerViewActive(false);
    syncSavedQuestionAnswerMode();
    routeSuggestion.reset();
    paperActions?.render(null);
    await comparativeReading.show(context);
  },
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
  routeSuggestion,
  shouldSuggestRoute: () => !comparativeReading.isActive(),
  canSubmit: () => comparativeReading.isActive() ? comparativeReading.canAsk() : selectionPanel.canAsk(),
  onSubmit: (event, submission) => {
    if (comparativeReading.isActive()) {
      comparativeReading.ask(event);
      return;
    }

    askFlow.askAiAboutSelection(event, submission);
  },
  onNewThread: () => comparativeReading.isActive()
    ? comparativeReading.startNewSession()
    : askFlow.startNewThreadFromComposer()
});

elements.openDashboard.addEventListener("click", openDashboard);
const savedQaToggleDrag = createFloatingButtonPositionController({
  button: elements.savedQaToggle,
  storageKey: SAVED_QA_TOGGLE_TOP_KEY
});
elements.savedQaToggle.addEventListener("click", async () => {
  if (savedQaToggleDrag.consumeSuppressedClick()) {
    return;
  }

  await conversation.toggleSavedQuestionAnswerView();
  syncSavedQuestionAnswerMode();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.PDF_SELECTION_CHANGED) {
    routeSuggestion.reset();
    documentContext.refreshSelection();
  }

  if (message?.type === MessageType.LIBRARY_PAPER_CONTEXT_CHANGED) {
    routeSuggestion.reset();
    documentContext.scheduleRefreshState();
  }

  if (
    message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED &&
    message.documentKey &&
    message.documentKey === documentContext.getCurrentDocument()?.documentKey
  ) {
    paperActions.refresh();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[PROMPT_PRESETS_KEY]) {
    promptPresetMenu.load();
  }
});

promptPresetMenu.load();
savedQaToggleDrag.load();
documentContext.start();

function updateAskReadiness() {
  syncSavedQuestionAnswerMode();

  if (comparativeReading?.isActive()) {
    selectionPanel.updateReadiness({
      hasDocument: false
    });
    return;
  }

  selectionPanel.updateReadiness({
    hasDocument: Boolean(documentContext.getCurrentDocument())
  });
}

function syncSavedQuestionAnswerMode() {
  const isActive = conversation.isSavedQuestionAnswerViewActive();
  const hasDocument = Boolean(documentContext.getCurrentDocument());
  const isComparative = Boolean(comparativeReading?.isActive());

  document.body.classList.toggle("saved-qa-mode", isActive && !isComparative);
  elements.savedQaToggle.hidden = isComparative || !hasDocument;
  elements.savedQaToggle.classList.toggle("active", isActive && !isComparative);
  elements.savedQaToggle.title = isActive ? "Back to chat" : "Saved Q&A";
  elements.savedQaToggle.setAttribute("aria-label", elements.savedQaToggle.title);
}

function shouldAutoOpenSavedQuestionAnswerView(document) {
  if (
    document?.sidePanelContextMode !== "library-paper" ||
    document?.sidePanelContextSource !== "dashboard"
  ) {
    return false;
  }

  const contextId = [
    document.documentKey || document.url || "",
    document.sidePanelContextSelectedAt || ""
  ].join(":");
  if (!contextId || contextId === lastAutoOpenedSavedContextId) {
    return false;
  }

  lastAutoOpenedSavedContextId = contextId;
  return true;
}

function openDashboard() {
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/dashboard/dashboard.html")
  });
}

function addDiagnostic(message) {
  console.debug("[PDF AI]", message);
}

function createFloatingButtonPositionController({ button, storageKey }) {
  const minTopPercent = 18;
  const maxTopPercent = 82;
  let drag = null;
  let suppressClick = false;

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      moved: false
    };
    button.setPointerCapture?.(event.pointerId);
  });

  button.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const delta = Math.abs(event.clientY - drag.startY);
    if (delta > 3) {
      drag.moved = true;
      suppressClick = true;
    }

    if (!drag.moved) {
      return;
    }

    const nextTop = clamp((event.clientY / Math.max(window.innerHeight, 1)) * 100, minTopPercent, maxTopPercent);
    button.style.top = `${nextTop}%`;
  });

  button.addEventListener("pointerup", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    button.releasePointerCapture?.(event.pointerId);
    if (drag.moved) {
      persist();
    }
    drag = null;
  });

  button.addEventListener("pointercancel", () => {
    drag = null;
  });

  async function load() {
    try {
      const data = await chrome.storage.local.get(storageKey);
      const savedTop = Number(data?.[storageKey]);
      if (Number.isFinite(savedTop)) {
        button.style.top = `${clamp(savedTop, minTopPercent, maxTopPercent)}%`;
      }
    } catch (error) {
      console.debug("[PDF AI] Could not load floating button position", error);
    }
  }

  async function persist() {
    try {
      const top = parseFloat(button.style.top);
      if (Number.isFinite(top)) {
        await chrome.storage.local.set({
          [storageKey]: clamp(top, minTopPercent, maxTopPercent)
        });
      }
    } catch (error) {
      console.debug("[PDF AI] Could not save floating button position", error);
    }
  }

  function consumeSuppressedClick() {
    if (!suppressClick) {
      return false;
    }

    suppressClick = false;
    return true;
  }

  return {
    load,
    consumeSuppressedClick
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
