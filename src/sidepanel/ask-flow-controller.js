import { answerSelectionQuestion } from "../ai/selection-answer.js";
import { formatSelectionContextForPrompt } from "../ai/selection-prompt.js";
import { buildSelectionContextPack } from "../pdf/selection-context.js";
import { getAiSettings, hasConfiguredAiApiKey, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { notifyLibraryPaperActivityChanged } from "./paper-actions-controller.js";

export function createAskFlowController({
  conversation,
  selectionPanel,
  getComposer,
  getCurrentDocument,
  clearError,
  showError,
  updateAskReadiness
}) {
  let currentAnswerAbortController = null;

  async function startNewThreadFromComposer() {
    clearError();
    getComposer().clear();
    selectionPanel.clearComposerSelection();

    try {
      await conversation.createThread();
      updateAskReadiness();
      getComposer().focus();
    } catch (error) {
      showError(error.message || String(error));
    }
  }

  async function askAiAboutSelection(event) {
    event.preventDefault();
    clearError();

    try {
      const question = getComposer().getText();
      const visibleSelectionText = selectionPanel.getVisibleText();
      const selectionText = visibleSelectionText;
      if (!question) {
        throw new Error("Enter a question.");
      }

      const currentDocument = getCurrentDocument();
      const contextPack = buildSelectionContextPack({
        document: currentDocument,
        selectionText,
        question
      });
      console.debug("[PDF AI] Selection context pack", contextPack);
      console.debug("[PDF AI] Selection prompt context\n%s", formatSelectionContextForPrompt(contextPack));

      const aiSettings = await getAiSettings();
      if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiApiKey(aiSettings)) {
        throw new Error("Gemini API key is not configured. Open extension Options to add it.");
      }

      const previousMessages = conversation.getMessages();
      conversation.appendMessage({
        role: "user",
        text: question,
        selectionText: visibleSelectionText
      });
      getComposer().clear();
      selectionPanel.clearComposerSelection();

      currentAnswerAbortController = new AbortController();
      selectionPanel.setAnswerBusy(true);
      selectionPanel.setContextStatus(getContextStatusForAsk(contextPack, Boolean(selectionText)));

      const answer = await answerSelectionQuestion({
        aiSettings,
        contextPack,
        conversationMessages: previousMessages,
        signal: currentAnswerAbortController.signal
      });

      conversation.appendMessage({
        role: "assistant",
        text: answer.text
      });
      await conversation.persist();
      notifyLibraryPaperActivityChanged(currentDocument?.documentKey);
      selectionPanel.setContextStatus(`Answered by ${answer.model}.`);
    } catch (error) {
      selectionPanel.clearContextStatus();
      showError(error.message || String(error));
    } finally {
      currentAnswerAbortController = null;
      selectionPanel.setAnswerBusy(false);
      updateAskReadiness();
    }
  }

  return {
    askAiAboutSelection,
    startNewThreadFromComposer
  };
}

function getContextStatusForAsk(contextPack, hasSelection) {
  if (!hasSelection) {
    return "Asking with whole-paper context...";
  }

  return contextPack.selection.anchor
    ? "Asking..."
    : "Asking with available context. Selected text was not confidently located in the paper.";
}
