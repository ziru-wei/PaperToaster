import { answerSelectionQuestion } from "../ai/selection-answer.js";
import { getEffectiveAiSettings, hasConfiguredAiProvider, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { createLoadingMessageRotator, getInitialLoadingMessage } from "./loading-messages.js";
import { notifyLibraryPaperActivityChanged } from "./paper-actions-controller.js";
import { ensureAgentDocument } from "../ai/local-agent-document-client.js";
import { createSourceSpanCitationContext } from "../ai/citation-catalog.js";

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
      if (!currentDocument?.markdown || !currentDocument.agentDocumentRef) {
        throw new Error("The active paper has no managed Markdown reference. Parse a new paper before asking.");
      }

      const aiSettings = await getEffectiveAiSettings();
      if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiProvider(aiSettings)) {
        throw new Error("AI provider is not configured. Open extension Options to finish setup.");
      }
      const sourceCitationContext = createSourceSpanCitationContext({
        document: currentDocument,
        paperIndex: 1,
        title: currentDocument.title
      });
      if (!usesDebugAiMode(aiSettings)) {
        await ensureAgentDocument({
          endpoint: aiSettings.localEndpoint,
          authToken: aiSettings.localAuthToken,
          document: currentDocument
        });
      }
      const papers = [{
        title: currentDocument.title || "Untitled paper",
        documentRef: currentDocument.agentDocumentRef,
        paperId: "p1",
        sourceSpanCitations: sourceCitationContext.sourceSpanCitations
      }];

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

      currentAnswerAbortController = new AbortController();
      if (conversation.isSnapshotCurrent(askSnapshot)) {
        selectionPanel.setAnswerBusy(true);
      }

      const answer = await answerSelectionQuestion({
        aiSettings,
        question,
        selectionText,
        papers,
        conversationKey: askSnapshot.threadId,
        signal: currentAnswerAbortController.signal
      });
      loadingRotator?.stop();
      loadingRotator = null;

      const assistantMessage = {
        role: "assistant",
        text: answer.text,
        model: answer.model,
        citationCatalog: { version: 1, papers: [sourceCitationContext.paper] }
      };
      const persistedMessages = [...(askSnapshot?.messages || previousMessages), assistantMessage];

      if (conversation.isSnapshotCurrent(askSnapshot)) {
        conversation.replaceTransientMessage(pendingMessageId, assistantMessage);
      }
      pendingMessageId = "";

      await conversation.saveMessagesForSnapshot(askSnapshot, persistedMessages);
      notifyLibraryPaperActivityChanged(currentDocument?.documentKey);
    } catch (error) {
      if (pendingMessageId && (!askSnapshot || conversation.isSnapshotCurrent(askSnapshot))) {
        conversation.removeTransientMessage(pendingMessageId);
      }
      if (!askSnapshot || conversation.isSnapshotCurrent(askSnapshot)) {
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
