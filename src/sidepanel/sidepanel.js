import { MessageType } from "../shared/messages.js";
import { openExtensionPageInExistingTab, openPaperUrlInExistingTab } from "../browser/open-paper-tab.js";
import { PROMPT_PRESETS_KEY } from "../storage/prompt-presets-store.js";
import {
  COMPARISON_SETTINGS_KEY,
  normalizeComparisonSettings
} from "../storage/comparison-settings-store.js";
import {
  SAVED_QA_SETTINGS_KEY,
  getSavedQaSettings,
  normalizeSavedQaSettings
} from "../storage/saved-qa-settings-store.js";
import {
  areSavedQuestionAnswerUnitsCollapsed,
  setSavedQuestionAnswerUnitsCollapsed
} from "./conversation-message-renderer.js";
import { createAskFlowController } from "./ask-flow-controller.js";
import { createComposerController } from "./composer-controller.js";
import { createComposerClearanceController } from "./composer-clearance-controller.js";
import { createComparativeReadingController } from "./comparative-reading-controller.js";
import { createConversationPanelController } from "./conversation-panel-controller.js";
import { createPaperActionsController } from "./paper-actions-controller.js";
import { createPaperMentionMenuController } from "./paper-mention-menu.js";
import { createPromptPresetMenuController } from "./prompt-preset-menu.js";
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
let paperMentionMenu = null;
let lastAutoOpenedSavedContextId = "";
let savedQaFeedbackTimer = null;
let currentDocumentContextKind = "none";

const scrollToLatest = createScrollToLatestController({
  threadElement: elements.conversationThread,
  buttonElement: elements.scrollToLatest,
  hasMessages: () => comparativeReading?.isActive()
    ? comparativeReading.hasScrollableMessages()
    : Boolean(conversation?.hasScrollableMessages())
});

const composerClearance = createComposerClearanceController({
  composerElement: elements.selectionQuestionForm.closest(".composer"),
  chatPanelElement: elements.conversationThread.closest(".chat-panel"),
  comparisonPapersElement: elements.comparisonPaperChips
});
composerClearance.start();

conversation = createConversationPanelController({
  threadElement: elements.conversationThread,
  threadArchiveButton: elements.conversationThreadArchive,
  threadWheelElement: elements.conversationThreadWheel,
  scrollToLatest,
  onDiagnostic: addDiagnostic,
  onChange: updateAskReadiness,
  onMessageSaved: showSavedQaButtonFeedback,
  onSaveLimitRejected: announceSavedQaLimitRejection,
  onJumpToComparisonUnit: jumpToComparisonSavedUnit,
  onNavigateCitation: navigateToCitationPaper
});

const selectionPanel = createSelectionPanelController({
  quoteElement: elements.selectionText,
  clearButton: elements.clearSelectionText
});

const promptPresetMenu = createPromptPresetMenuController({
  textarea: elements.selectionQuestion,
  menuElement: elements.promptPresetMenu,
  commandCompletionElement: elements.modelCommandCompletion,
  modelIndicator: elements.currentModelIndicator,
  onError: (error) => console.debug("[PDF AI] Prompt presets unavailable", error)
});

comparativeReading = createComparativeReadingController({
  elements,
  getComposer: () => composer,
  scrollToLatest,
  clearError: () => documentContext?.clearError(),
  showError: (message) => documentContext?.showError(message),
  onChange: updateAskReadiness,
  onDiagnostic: addDiagnostic,
  onNavigateCitation: navigateToCitationPaper,
  onSaveLimitRejected: announceSavedQaLimitRejection
});

paperMentionMenu = createPaperMentionMenuController({
  textarea: elements.selectionQuestion,
  menuElement: elements.promptPresetMenu,
  isEnabled: () => comparativeReading.isActive() && comparativeReading.canAddPapers(),
  getSelectedDocumentKeys: () => comparativeReading.getSelectedDocumentKeys(),
  onSelectPaper: (documentKey) => comparativeReading.addPaper(documentKey),
  onSelectPapers: (documentKeys) => comparativeReading.addPapers(documentKeys),
  onError: (error) => documentContext?.showError(error.message || String(error))
});

const documentContext = createSidePanelDocumentContext({
  elements,
  conversation,
  selectionPanel,
  onDocumentChange: async (document) => {
    currentDocumentContextKind = getDocumentContextKind(document);
    composer?.hideMenus();
    comparativeReading.hide();
    await paperActions?.render(document);
    if (currentDocumentContextKind === "direct-pdf") {
      await conversation.setSavedQuestionAnswerViewActive(false);
    }
    if (shouldAutoOpenSavedQuestionAnswerView(document)) {
      await conversation.setSavedQuestionAnswerViewActive(true);
    }
    syncSavedQuestionAnswerMode();
  },
  onComparativeReadingContext: async (context) => {
    await showComparativeReadingContext(context);
  },
  onAskReadinessChange: updateAskReadiness,
  onDiagnostic: addDiagnostic
});

paperActions = createPaperActionsController({
  starElement: elements.documentStar,
  labelElement: elements.documentLabel,
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
  paperMentionMenu,
  promptPresetMenuElement: elements.promptPresetMenu,
  usePaperMentionMenu: () => comparativeReading.isActive(),
  canSubmit: () => comparativeReading.isActive() ? comparativeReading.canAsk() : selectionPanel.canAsk(),
  onSubmit: (event) => {
    if (comparativeReading.isActive()) {
      comparativeReading.ask(event);
      return;
    }

    askFlow.askAiAboutSelection(event);
  },
  onNewThread: () => comparativeReading.isActive()
    ? comparativeReading.startNewSession()
    : askFlow.startNewThreadFromComposer()
});

document.addEventListener("keydown", async (event) => {
  const isPlainEnter = event.key === "Enter" &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.isComposing;
  const focusedElement = document.activeElement;
  const focusIsEditable = focusedElement instanceof Element && Boolean(
    focusedElement.closest("textarea, input, select, [contenteditable='true'], [contenteditable='plaintext-only']")
  );
  const focusIsInModal = focusedElement instanceof Element && Boolean(
    focusedElement.closest("[role='dialog'], [aria-modal='true']")
  );
  const focusIsInKeyboardScope = focusedElement instanceof Element && Boolean(
    focusedElement.closest("[data-keyboard-scope]")
  );
  const targetIsInKeyboardScope = event.target instanceof Element && Boolean(
    event.target.closest("[data-keyboard-scope]")
  );
  const savedQuestionAnswerViewActive = conversation?.isSavedQuestionAnswerViewActive();
  const composerIsVisible = elements.selectionQuestion.offsetParent !== null;

  if (
    event.defaultPrevented ||
    !isPlainEnter ||
    focusIsEditable ||
    focusIsInModal ||
    focusIsInKeyboardScope ||
    targetIsInKeyboardScope ||
    elements.selectionQuestion.disabled
  ) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  if (savedQuestionAnswerViewActive) {
    await conversation.setSavedQuestionAnswerViewActive(false);
    syncSavedQuestionAnswerMode();
  }
  if (!composerIsVisible && !savedQuestionAnswerViewActive) {
    return;
  }
  elements.selectionQuestion.focus({ preventScroll: true });
}, true);

elements.openDashboard.addEventListener("click", handleHeaderToasterClick);
elements.idleOpenDashboard.addEventListener("click", activateIdleToaster);
elements.idleOpenDashboard.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  await activateIdleToaster();
});
const savedQaToggleDrag = createFloatingButtonPositionController({
  button: elements.savedQaControls,
  storageKey: SAVED_QA_TOGGLE_TOP_KEY
});
elements.savedQaToggle.addEventListener("click", async () => {
  if (savedQaToggleDrag.consumeSuppressedClick()) {
    return;
  }

  await conversation.toggleSavedQuestionAnswerView();
  syncSavedQuestionAnswerMode();
});
elements.savedQaCollapseToggle.addEventListener("click", () => {
  if (savedQaToggleDrag.consumeSuppressedClick()) {
    return;
  }

  if (comparativeReading.isActive()) {
    const shouldCollapse = !comparativeReading.areAllAssistantResponsesCollapsed();
    comparativeReading.setAllAssistantResponsesCollapsed(shouldCollapse);
  } else if (conversation.isSavedQuestionAnswerViewActive()) {
    const shouldCollapse = !areSavedQuestionAnswerUnitsCollapsed(elements.conversationThread);
    setSavedQuestionAnswerUnitsCollapsed(elements.conversationThread, shouldCollapse);
  } else {
    const shouldCollapse = !conversation.areAllAssistantResponsesCollapsed();
    conversation.setAllAssistantResponsesCollapsed(shouldCollapse);
  }
  syncSavedQuestionAnswerMode();
});
elements.conversationThread.addEventListener("saved-qa-unit-collapse-change", syncSavedQuestionAnswerMode);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.PDF_SELECTION_CHANGED) {
    void handlePdfSelectionChanged();
  }

  if (message?.type === MessageType.LIBRARY_PAPER_CONTEXT_CHANGED) {
    if (comparativeReading.shouldIgnoreContextRefresh(message.context)) {
      return;
    }
    documentContext.scheduleRefreshState();
  }

  if (message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED) {
    paperMentionMenu.invalidate();
  }

  if (
    message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED &&
    message.documentKey &&
    message.documentKey === documentContext.getCurrentDocument()?.documentKey
  ) {
    paperActions.refresh();
  }
});

async function handlePdfSelectionChanged() {
  if (conversation.isSavedQuestionAnswerViewActive()) {
    await conversation.setSavedQuestionAnswerViewActive(false);
    syncSavedQuestionAnswerMode();
  }
  await documentContext.refreshSelection();
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes[PROMPT_PRESETS_KEY]) {
    promptPresetMenu.load();
  }

  if (changes[COMPARISON_SETTINGS_KEY]) {
    const settings = normalizeComparisonSettings(changes[COMPARISON_SETTINGS_KEY].newValue);
    comparativeReading.setPaperLimit(settings.paperLimit);
  }

  if (changes[SAVED_QA_SETTINGS_KEY]) {
    const settings = normalizeSavedQaSettings(changes[SAVED_QA_SETTINGS_KEY].newValue);
    conversation.setSavedQaPerPaperLimit(settings.perPaperLimit);
    comparativeReading.setSavedQaPerPaperLimit(settings.perPaperLimit);
  }
});

promptPresetMenu.load();
savedQaToggleDrag.load();
void loadSavedQaSettings();
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
  const savedModeActive = isActive && hasDocument && !isComparative;
  const conversationModeActive = !isActive && hasDocument && !isComparative;

  document.body.classList.toggle("saved-qa-mode", savedModeActive);
  elements.savedQaControls.hidden = !isComparative && !hasDocument;
  elements.savedQaToggle.hidden = isComparative;
  elements.savedQaToggle.classList.toggle("active", savedModeActive && currentDocumentContextKind === "dashboard-paper");
  const savedToggleLabel = isActive ? "Back to chat" : "Saved Q&A";
  elements.savedQaToggle.removeAttribute("title");
  elements.savedQaToggle.setAttribute("aria-label", savedToggleLabel);
  const allCollapsed = isComparative
    ? comparativeReading.areAllAssistantResponsesCollapsed()
    : savedModeActive
      ? areSavedQuestionAnswerUnitsCollapsed(elements.conversationThread)
      : conversationModeActive && conversation.areAllAssistantResponsesCollapsed();
  elements.savedQaCollapseToggle.hidden = !isComparative && !savedModeActive && !conversationModeActive;
  elements.savedQaCollapseToggle.classList.toggle("collapsed", allCollapsed);
  const collapseToggleLabel = allCollapsed
    ? (savedModeActive ? "Expand notes" : "Expand responses")
    : (savedModeActive ? "Collapse notes" : "Collapse responses");
  elements.savedQaCollapseToggle.removeAttribute("title");
  elements.savedQaCollapseToggle.setAttribute("aria-label", collapseToggleLabel);
  elements.savedQaCollapseToggle.setAttribute("aria-pressed", String(allCollapsed));
  syncHeaderToasterAction();
}

async function loadSavedQaSettings() {
  try {
    const settings = await getSavedQaSettings();
    conversation.setSavedQaPerPaperLimit(settings.perPaperLimit);
    comparativeReading.setSavedQaPerPaperLimit(settings.perPaperLimit);
  } catch (error) {
    addDiagnostic(`Saved Q&A settings unavailable: ${error.message || String(error)}`);
  }
}

function announceSavedQaLimitRejection(result) {
  const limit = Number(result?.perPaperLimit) || 0;
  elements.sidePanelLiveStatus.textContent = `Saved Q&A limit reached (${limit} per paper).`;
}

function getDocumentContextKind(document) {
  if (!document) return "none";
  return document.sidePanelContextMode === "library-paper" && document.sidePanelContextSource === "dashboard"
    ? "dashboard-paper"
    : "direct-pdf";
}

function showSavedQaButtonFeedback() {
  if (
    elements.savedQaToggle.hidden ||
    conversation?.isSavedQuestionAnswerViewActive() ||
    comparativeReading?.isActive()
  ) {
    return;
  }

  window.clearTimeout(savedQaFeedbackTimer);
  elements.savedQaToggle.classList.remove("save-feedback");
  void elements.savedQaToggle.offsetWidth;
  elements.savedQaToggle.classList.add("save-feedback");
  savedQaFeedbackTimer = window.setTimeout(() => {
    elements.savedQaToggle.classList.remove("save-feedback");
  }, 720);
}

function syncHeaderToasterAction() {
  const opensPaperPanel = comparativeReading?.isActive() && documentContext?.hasPreservedView();
  const label = opensPaperPanel ? "Open this paper's panel" : "Reading Dashboard";
  elements.openDashboard.setAttribute("aria-label", label);
  elements.openDashboard.removeAttribute("title");
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
  openExtensionPageInExistingTab(
    chrome.runtime.getURL("src/dashboard/dashboard.html")
  ).catch((error) => {
    addDiagnostic(`Could not open Reading Dashboard: ${error.message || String(error)}`);
  });
}

async function handleHeaderToasterClick() {
  if (comparativeReading.isActive() && documentContext.hasPreservedView()) {
    comparativeReading.hide();
    documentContext.resumeActiveTabContext();
    syncHeaderToasterAction();
    return;
  }
  openDashboard();
}

async function showComparativeReadingContext(context) {
  composer?.hideMenus();
  lastAutoOpenedSavedContextId = "";
  await conversation.setSavedQuestionAnswerViewActive(false);
  syncSavedQuestionAnswerMode();
  paperActions?.render(null);
  await comparativeReading.show(context);
}

async function jumpToComparisonSavedUnit(unit) {
  const comparisonId = String(unit?.comparisonId || "").trim();
  if (!comparisonId) {
    return;
  }

  await documentContext.preserveViewForActiveTab();
  await showComparativeReadingContext({
    mode: "comparative-reading",
    comparisonId
  });
  comparativeReading.jumpToMessagePair({
    userMessageIndex: unit.userMessageIndex,
    assistantMessageIndex: unit.assistantMessageIndex
  });
}

async function navigateToCitationPaper(paper, source = {}) {
  const comparisonId = String(source?.comparisonId || "").trim();
  const shouldKeepComparison = comparativeReading.isActive() || source?.sourceType === "comparison";
  if (source?.sourceType === "comparison" && comparisonId && !comparativeReading.isActive()) {
    await showComparativeReadingContext({
      mode: "comparative-reading",
      comparisonId
    });
  }

  const resolvedPaper = comparativeReading.isActive()
    ? comparativeReading.resolveCitationPaper(paper)
    : paper;
  const currentDocument = documentContext.getCurrentDocument();
  const url = String(
    resolvedPaper?.canonicalUrl ||
    (String(resolvedPaper?.id || "").toLowerCase() === "p1" ? currentDocument?.url : "") ||
    ""
  ).trim();
  if (!url) {
    throw new Error("No URL is stored for this citation.");
  }

  if (shouldKeepComparison) {
    await documentContext.preserveViewWhileOpening(() => openPaperUrlInExistingTab(url));
    syncHeaderToasterAction();
    return;
  }

  await openPaperUrlInExistingTab(url);
}

async function activateIdleToaster() {
  if (await documentContext.activateIdleToaster()) {
    return;
  }
  openDashboard();
}

function addDiagnostic(message) {
  console.debug("[PDF AI]", message);
}

function createFloatingButtonPositionController({ button, storageKey }) {
  const minTopPercent = 18;
  const maxTopPercent = 82;
  const dragThreshold = 4;
  const suppressedClickMs = 220;
  let drag = null;
  let suppressClickUntil = 0;

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      moved: false
    };
    window.addEventListener("pointermove", handlePointerMove, { capture: true });
    window.addEventListener("pointerup", handlePointerEnd, { capture: true });
    window.addEventListener("pointercancel", handlePointerEnd, { capture: true });
  });

  function handlePointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const delta = Math.abs(event.clientY - drag.startY);
    if (delta > dragThreshold) {
      drag.moved = true;
      button.classList.add("dragging");
    }

    if (!drag.moved) {
      return;
    }

    event.preventDefault();
    const nextTop = clamp((event.clientY / Math.max(window.innerHeight, 1)) * 100, minTopPercent, maxTopPercent);
    button.style.top = `${nextTop}%`;
  }

  function handlePointerEnd(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    if (drag.moved) {
      suppressClickUntil = Date.now() + suppressedClickMs;
      persist();
    }
    drag = null;
    button.classList.remove("dragging");
    window.removeEventListener("pointermove", handlePointerMove, { capture: true });
    window.removeEventListener("pointerup", handlePointerEnd, { capture: true });
    window.removeEventListener("pointercancel", handlePointerEnd, { capture: true });
  }

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
    if (Date.now() > suppressClickUntil) {
      return false;
    }

    suppressClickUntil = 0;
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
