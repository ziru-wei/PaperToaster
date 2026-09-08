import { answerSelectionQuestion } from "../ai/selection-answer.js";
import { formatSelectionContextForPrompt } from "../ai/selection-prompt.js";
import { buildSelectionContextPack } from "../pdf/selection-context.js";
import { getEffectiveAiSettings, hasConfiguredAiProvider, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { createLoadingMessageRotator, getInitialLoadingMessage } from "./loading-messages.js";
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

  async function askAiAboutSelection(event, submission = {}) {
    event.preventDefault();
    clearError();
    let pendingMessageId = "";
    let askSnapshot = null;
    let loadingRotator = null;

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
        question,
        options: {
          intentOverride: submission.intentOverride,
          intentOverrideSource: submission.intentOverrideSource
        }
      });
      console.debug("[PDF AI] Selection context pack", contextPack);
      console.debug("[PDF AI] Selection prompt context\n%s", formatSelectionContextForPrompt(contextPack));

      const previousMessages = conversation.getMessages();
      conversation.appendMessage({
        role: "user",
        text: question,
        selectionText: visibleSelectionText
      });
      pendingMessageId = conversation.appendTransientMessage({
        role: "assistant",
        text: getInitialLoadingMessage()
      });
      askSnapshot = await conversation.persistCurrentAndGetSnapshot();
      loadingRotator = createLoadingMessageRotator((text) => {
        if (!pendingMessageId || !conversation.isSnapshotCurrent(askSnapshot)) {
          return;
        }

        conversation.updateTransientMessage(pendingMessageId, { text });
      });
      loadingRotator.start();
      getComposer().clear();
      selectionPanel.clearComposerSelection();

      const aiSettings = await getEffectiveAiSettings();
      if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiProvider(aiSettings)) {
        throw new Error("AI provider is not configured. Open extension Options to finish setup.");
      }

      currentAnswerAbortController = new AbortController();
      if (conversation.isSnapshotCurrent(askSnapshot)) {
        selectionPanel.setAnswerBusy(true);
        selectionPanel.setContextStatus(getContextStatusForAsk(contextPack, Boolean(selectionText)));
      }

      const answer = await answerSelectionQuestion({
        aiSettings,
        contextPack,
        conversationMessages: previousMessages,
        signal: currentAnswerAbortController.signal
      });
      loadingRotator?.stop();
      loadingRotator = null;

      const assistantMessage = {
        role: "assistant",
        text: answer.text,
        model: answer.model
      };
      const persistedMessages = [...(askSnapshot?.messages || previousMessages), assistantMessage];

      const answerWasPlaced = conversation.isSnapshotCurrent(askSnapshot)
        ? conversation.replaceTransientMessage(pendingMessageId, assistantMessage)
        : false;
      pendingMessageId = "";

      await conversation.saveMessagesForSnapshot(askSnapshot, persistedMessages);
      notifyLibraryPaperActivityChanged(currentDocument?.documentKey);
      if (answerWasPlaced && conversation.isSnapshotCurrent(askSnapshot)) {
        selectionPanel.setContextStatus(`Answered by ${answer.model}.`);
      }
    } catch (error) {
      if (pendingMessageId && (!askSnapshot || conversation.isSnapshotCurrent(askSnapshot))) {
        conversation.removeTransientMessage(pendingMessageId);
      }
      if (!askSnapshot || conversation.isSnapshotCurrent(askSnapshot)) {
        selectionPanel.clearContextStatus();
        showError(error.message || String(error));
      }
    } finally {
      loadingRotator?.stop();
      currentAnswerAbortController = null;
      if (!askSnapshot || conversation.isSnapshotCurrent(askSnapshot)) {
        selectionPanel.setAnswerBusy(false);
        updateAskReadiness();
      }
    }
  }

  return {
    askAiAboutSelection,
    startNewThreadFromComposer
  };
}

function getContextStatusForAsk(contextPack, hasSelection) {
  if (hasSelection && !contextPack.selection.anchor) {
    return "Crunching the context...";
  }

  return getInitialLoadingMessage();
}
