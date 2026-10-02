import {
  createStoredChatThread,
  deleteStoredChatThread,
  getStoredChatThreadById,
  getStoredChatThread,
  listSavedQuestionAnswerUnits,
  listStoredChatThreads,
  pruneActivePaperConversationHistory,
  saveStoredChatThread,
  setActiveStoredChatThread,
  setPinnedSavedQuestionAnswerUnit
} from "../storage/chat-store.js";
import { listSavedComparisonQuestionAnswerUnitsForDocument } from "../storage/comparison-store.js";
import { getPaperUserNote, savePaperUserNote } from "../storage/paper-note-store.js";
import { setConversationAnswerSaved } from "../storage/saved-qa-store.js";
import {
  collapseOpenConversationSelections,
  getSavedQuestionAnswerUnitKey,
  getSavedQuestionAnswerCollapsedUnitKeys,
  renderSavedQuestionAnswerUnits,
  renderConversationMessages,
  toggleConversationSelection,
  updatePendingConversationMessageText
} from "./conversation-message-renderer.js";
import {
  applyMarkdownCircle,
  applyMarkdownHiddenText,
  applyMarkdownHighlight,
  removeMarkdownCircle,
  removeMarkdownHiddenText,
  removeMarkdownHighlight
} from "../markdown/highlight-markdown.js";
import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";
import { normalizeCitationCatalog } from "../ai/citation-catalog.js";
import { createThreadWheelController } from "./thread-wheel-controller.js";
import { createQuestionScrollScheduler, scrollToConversationMessagePair } from "./conversation-navigation.js";
import { getHistoricalAssistantMessageIndexes } from "../conversation/message-state.js";
import { deleteLocalAgentSession, queueLocalAgentSessionDeletion, flushPendingLocalAgentSessionDeletes } from "../ai/local-agent-session-client.js";

export function createConversationPanelController({
  threadElement,
  threadArchiveButton,
  threadWheelElement,
  scrollToLatest,
  onDiagnostic,
  onChange,
  onMessageSaved,
  onSaveLimitRejected,
  onJumpToComparisonUnit,
  onNavigateCitation
}) {
  let messages = [];
  let threadUrl = "";
  let threadDocumentKey = "";
  let activeThreadId = "";
  let persistedMessagesJson = "[]";
  let threadSummaries = [];
  let saveTimer = null;
  let documentRequestId = 0;
  let transientMessageId = 0;
  let savedViewActive = false;
  let savedQuestionAnswerUnits = [];
  let savedCollapsedUnitKeys = new Set();
  let savedQaCollapseInitialized = false;
  let paperUserNoteDocument = null;
  let paperUserNoteSaveTimer = null;
  let pendingPaperUserNote = null;
  let savedQaPerPaperLimit = 20;
  const scheduleNewQuestionAtTop = createQuestionScrollScheduler(threadElement);
  let allAssistantResponsesExpanded = false;
  const collapsedAssistantResponsesByThread = new Map();

  const threadWheel = createThreadWheelController({
    archiveButton: threadArchiveButton,
    wheelElement: threadWheelElement,
    canOpen: () => Boolean(threadUrl),
    getThreads: () => threadSummaries,
    getActiveThreadId: () => activeThreadId,
    onSelectThread: selectThread,
    onDeleteThread: deleteThread,
    onDiagnostic
  });
  document.addEventListener("pointerdown", (event) => {
    collapseOpenConversationSelections(threadElement, event.target.closest(".conversation-selection"));
  }, true);
  window.addEventListener("blur", () => {
    collapseOpenConversationSelections(threadElement);
  });
  window.addEventListener("pagehide", () => {
    flushPaperUserNoteSave().catch((error) => {
      onDiagnostic?.(`Paper note save failed: ${error.message || String(error)}`);
    });
  });
  threadElement.addEventListener("click", (event) => {
    const quote = event.target.closest(".conversation-selection");
    if (quote) {
      toggleConversationSelection(threadElement, quote);
    }
  });
  threadElement.addEventListener("keydown", (event) => {
    const quote = event.target.closest(".conversation-selection");
    if (!quote || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    toggleConversationSelection(threadElement, quote);
  });

  async function setDocumentUrl(url, options = {}) {
    const requestId = ++documentRequestId;
    const nextUrl = String(url || "");
    const nextDocumentKey = String(options.documentKey || "").trim();
    if (threadUrl === nextUrl && threadDocumentKey === nextDocumentKey) {
      return;
    }

    await persist();
    await flushPaperUserNoteSave().catch((error) => {
      onDiagnostic?.(`Paper note save failed: ${error.message || String(error)}`);
    });
    if (requestId !== documentRequestId) {
      return;
    }

    threadUrl = nextUrl;
    threadDocumentKey = nextDocumentKey;
    savedCollapsedUnitKeys = new Set();
    savedQaCollapseInitialized = false;

    if (!threadUrl) {
      allAssistantResponsesExpanded = false;
      messages = [];
      threadDocumentKey = "";
      activeThreadId = "";
      threadSummaries = [];
      savedQuestionAnswerUnits = [];
      savedCollapsedUnitKeys = new Set();
      savedQaCollapseInitialized = false;
      paperUserNoteDocument = null;
      threadWheel.close();
      render();
      scrollToLatest.update();
      renderThreadList();
      onChange?.();
      return;
    }

    const pruneResult = await pruneActivePaperConversationHistory(threadUrl);
    for (const conversationKey of pruneResult.affectedThreadIds || []) {
      await queueLocalAgentSessionDeletion({ mode: "single-paper", conversationKey });
    }
    if (pruneResult.affectedThreadIds?.length) {
      void flushPendingLocalAgentSessionDeletes().then(({ failures }) => {
        if (failures.length) onDiagnostic?.(`Pruned Agent session deletion queued for retry: ${failures[0]}`);
      }).catch((error) => {
        onDiagnostic?.(`Could not immediately delete pruned Agent sessions: ${error.message || String(error)}`);
      });
    }
    if (requestId !== documentRequestId) {
      return;
    }

    const [thread, storedPaperUserNote] = await Promise.all([
      getStoredChatThread(threadUrl),
      getPaperUserNote(threadDocumentKey)
    ]);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
    resetAssistantResponsesCollapsed();
    paperUserNoteDocument = storedPaperUserNote.document;
    await refreshThreadList(requestId);
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits(requestId);
    }
    if (requestId !== documentRequestId) {
      return;
    }

    render();
    scrollToLatest.update();
    onChange?.();
  }

  function appendMessage(message) {
    const role = message.role === "assistant" ? "assistant" : "user";
    const rawText = String(message?.text || "").trim();
    const text = role === "assistant" ? normalizeAiResponseMarkdown(rawText) : rawText;
    if (!text) {
      return;
    }

    if (role === "user") {
      allAssistantResponsesExpanded = false;
      collapseHistoricalAssistantResponses();
    }
    const messageIndex = messages.length;
    messages.push({
      role,
      text,
      model: role === "assistant" ? String(message.model || "").trim() : "",
      citationCatalog: role === "assistant" ? normalizeCitationCatalog(message.citationCatalog) : null,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now(),
      isSaved: isMessageSaved(message)
    });
    render({
      scrollToBottom: role !== "user"
    });
    if (role === "user") scheduleNewQuestionAtTop(messageIndex);
    queueSave();
    onChange?.();
  }

  function getMessages() {
    return messages
      .filter((message) => !message.pending)
      .map((message) => ({ ...message }));
  }

  function appendTransientMessage(message) {
    const id = `transient-${Date.now()}-${++transientMessageId}`;
    messages.push({
      role: message?.role === "user" ? "user" : "assistant",
      text: String(message?.text || "").trim(),
      selectionText: "",
      createdAt: Number(message?.createdAt) || Date.now(),
      pending: true,
      transientId: id
    });
    collapseHistoricalAssistantResponses();
    render({ scrollToBottom: false });
    if (messages.at(-2)?.role === "user") scheduleNewQuestionAtTop(messages.length - 2);
    onChange?.();
    return id;
  }

  function collapseHistoricalAssistantResponses(exceptMessageIndex = -1) {
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    collapsedIndexes.clear();
    getHistoricalAssistantMessageIndexes(messages, exceptMessageIndex)
      .forEach((index) => collapsedIndexes.add(index));
  }

  function updateTransientMessage(transientId, updates = {}) {
    const index = messages.findIndex((candidate) => candidate.pending && candidate.transientId === transientId);
    if (index < 0) {
      return false;
    }

    messages[index] = {
      ...messages[index],
      text: String(updates.text || messages[index].text || "").trim()
    };
    updatePendingConversationMessageText(threadElement, index, messages[index].text);
    onChange?.();
    return true;
  }

  function replaceTransientMessage(transientId, message) {
    const index = messages.findIndex((candidate) => candidate.pending && candidate.transientId === transientId);
    if (index < 0) {
      return false;
    }

    const role = message.role === "assistant" ? "assistant" : "user";
    const rawText = String(message?.text || "").trim();
    const text = role === "assistant" ? normalizeAiResponseMarkdown(rawText) : rawText;
    if (!text) {
      messages.splice(index, 1);
      render();
      onChange?.();
      return true;
    }

    const wasCollapsed = getCollapsedAssistantMessageIndexes().has(index);
    messages.splice(index, 1, {
      role,
      text,
      model: role === "assistant" ? String(message.model || "").trim() : "",
      citationCatalog: role === "assistant" ? normalizeCitationCatalog(message.citationCatalog) : null,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now(),
      isSaved: isMessageSaved(message)
    });
    if (role === "assistant") {
      if (allAssistantResponsesExpanded) {
        getCollapsedAssistantMessageIndexes().clear();
      } else {
        collapseHistoricalAssistantResponses(index);
        if (wasCollapsed) getCollapsedAssistantMessageIndexes().add(index);
      }
    }
    render({
      scrollToBottom: role !== "assistant"
    });
    queueSave();
    onChange?.();
    return true;
  }

  function removeTransientMessage(transientId) {
    const index = messages.findIndex((candidate) => candidate.pending && candidate.transientId === transientId);
    if (index < 0) {
      return;
    }

    messages.splice(index, 1);
    render();
    onChange?.();
  }

  async function toggleMessageSaved(messageIndex) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return;
    }

    const nextSaved = !isMessageSaved(message);
    const result = await setConversationAnswerSaved({
      documentKey: threadDocumentKey,
      threadId: activeThreadId,
      sequence: index,
      saved: nextSaved,
      perPaperLimit: savedQaPerPaperLimit
    });
    if (result.status === "limit-reached" || result.status === "not-found") {
      return result;
    }
    applyThread(await getStoredChatThreadById(threadUrl, activeThreadId));
    if (!savedViewActive) {
      render({ scrollToBottom: false });
    }
    if (nextSaved) onMessageSaved?.();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return result;
  }

  function setSavedQaPerPaperLimit(limit) {
    savedQaPerPaperLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
  }

  async function highlightAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownHighlight(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Highlight skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return createEditResult(true);
  }

  async function hideAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownHiddenText(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Hide skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return createEditResult(true);
  }

  async function circleAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownCircle(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Circle skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return createEditResult(true);
  }

  async function removeAssistantHighlight(messageIndex, highlightIndex) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownHighlight(message.text, highlightIndex);
    if (!result.changed) {
      onDiagnostic?.("Highlight removal skipped: highlight was not found.");
      return false;
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return true;
  }

  async function removeAssistantCircle(messageIndex, circleIndex) {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownCircle(message.text, circleIndex);
    if (!result.changed) {
      onDiagnostic?.("Circle removal skipped: circle was not found.");
      return false;
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return true;
  }

  async function removeAssistantHiddenText(messageIndex, hiddenIndex, groupId = "") {
    const index = Number(messageIndex);
    const message = messages[index];
    if (!message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownHiddenText(message.text, hiddenIndex, groupId);
    if (!result.changed) {
      onDiagnostic?.("Hidden text removal skipped: hidden text was not found.");
      return false;
    }

    messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
    return true;
  }

  async function highlightSavedAnswerSelection(unit, selectedText) {
    return editSavedAnswerMessage(unit, (message) => applyMarkdownHighlight(message.text, selectedText));
  }

  async function circleSavedAnswerSelection(unit, selectedText) {
    return editSavedAnswerMessage(unit, (message) => applyMarkdownCircle(message.text, selectedText));
  }

  async function hideSavedAnswerSelection(unit, selectedText) {
    return editSavedAnswerMessage(unit, (message) => applyMarkdownHiddenText(message.text, selectedText), {
      unchanged: "Hide skipped: selected text was not found uniquely."
    });
  }

  async function removeSavedAnswerHighlight(unit, highlightIndex) {
    return editSavedAnswerMessage(unit, (message) => removeMarkdownHighlight(message.text, highlightIndex), {
      missingMessage: "Highlight removal skipped: saved answer was not found.",
      unchanged: "Highlight removal skipped: highlight was not found."
    });
  }

  async function removeSavedAnswerCircle(unit, circleIndex) {
    return editSavedAnswerMessage(unit, (message) => removeMarkdownCircle(message.text, circleIndex), {
      missingMessage: "Circle removal skipped: saved answer was not found.",
      unchanged: "Circle removal skipped: circle was not found."
    });
  }

  async function removeSavedAnswerHiddenText(unit, hiddenIndex, groupId = "") {
    return editSavedAnswerMessage(unit, (message) => removeMarkdownHiddenText(message.text, hiddenIndex, groupId), {
      missingMessage: "Hidden text removal skipped: saved answer was not found.",
      unchanged: "Hidden text removal skipped: hidden text was not found."
    });
  }

  async function toggleSavedQuestionAnswerPinned(unit) {
    captureSavedCollapseState();
    const didUpdate = await setPinnedSavedQuestionAnswerUnit(threadUrl, unit);
    if (!didUpdate) {
      onDiagnostic?.("Pin skipped: saved answer was not found.");
      return false;
    }

    if (activeThreadId) {
      const thread = await getStoredChatThreadById(threadUrl, activeThreadId);
      applyThread(thread);
    }
    await loadSavedQuestionAnswerUnits();
    await refreshThreadList();
    render({ scrollToBottom: false });
    onChange?.();
    return true;
  }

  async function editSavedAnswerMessage(unit, editMessage, diagnostics = {}) {
    const threadId = String(unit?.threadId || "").trim();
    const messageIndex = Number(unit?.assistantMessageIndex);
    if (!threadUrl || !threadId || !Number.isInteger(messageIndex) || messageIndex < 0) {
      return createEditResult(false, "saved answer reference is unavailable.");
    }

    const targetThread = threadId === activeThreadId
      ? { threadId: activeThreadId, messages }
      : await getStoredChatThreadById(threadUrl, threadId);
    const targetMessages = Array.isArray(targetThread?.messages)
      ? targetThread.messages.map((message) => ({ ...message }))
      : [];
    const message = targetMessages[messageIndex];
    if (!message || message.role !== "assistant" || message.pending) {
      const reason = diagnostics.missingMessage || "saved answer was not found.";
      onDiagnostic?.(reason.startsWith("Highlight") || reason.startsWith("Hide") ? reason : `Highlight skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    const result = editMessage(message);
    if (!result.changed) {
      const reason = diagnostics.unchanged || formatHighlightSkipReason(result.reason);
      onDiagnostic?.(diagnostics.unchanged || `Highlight skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    targetMessages[messageIndex] = {
      ...message,
      text: result.markdown
    };
    await saveStoredChatThread(threadUrl, {
      threadId,
      url: threadUrl,
      messages: targetMessages
    }, {
      setActive: threadId === activeThreadId
    });

    if (threadId === activeThreadId) {
      messages = targetMessages;
    }
    await loadSavedQuestionAnswerUnits();
    await refreshThreadList();
    render({ scrollToBottom: false });
    onChange?.();
    return createEditResult(true);
  }

  async function deleteMessageUnit(messageIndex) {
    const index = Number(messageIndex);
    if (!messages[index] || messages[index].pending) {
      return;
    }

    const startIndex = messages[index - 1]?.role === "user" && !messages[index - 1]?.pending
      ? index - 1
      : index;
    const deleteCount = index - startIndex + 1;
    if (!window.confirm("Delete this question and response?")) {
      return;
    }

    messages.splice(startIndex, deleteCount);
    getCollapsedAssistantMessageIndexes().clear();
    if (!hasVisibleMessages(messages)) {
      await deleteCurrentThreadAfterLastMessage();
      return;
    }

    render();
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render();
    }
    onChange?.();
  }

  async function deleteCurrentThreadAfterLastMessage() {
    window.clearTimeout(saveTimer);
    const requestId = documentRequestId;
    allAssistantResponsesExpanded = false;

    if (threadUrl && activeThreadId) {
      const deletedThreadId = activeThreadId;
      const thread = await deleteStoredChatThread(threadUrl, deletedThreadId);
      void deleteLocalAgentSession({ mode: "single-paper", conversationKey: deletedThreadId }).catch((error) => {
        onDiagnostic?.(`Could not immediately delete Agent session: ${error.message || String(error)}`);
      });
      if (requestId !== documentRequestId) {
        return;
      }

      applyThread(thread);
      await refreshThreadList(requestId);
      if (savedViewActive) {
        await loadSavedQuestionAnswerUnits(requestId);
      }
    } else {
      messages = [];
      activeThreadId = "";
      await refreshThreadList(requestId);
    }

    render();
    onChange?.();
  }

  async function createThread() {
    if (!threadUrl || !messages.length) {
      return;
    }

    await persist();
    const requestId = documentRequestId;
    const thread = await createStoredChatThread(threadUrl);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
    allAssistantResponsesExpanded = false;
    await refreshThreadList(requestId);
    threadWheel.close();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits(requestId);
    }
    render();
    onChange?.();
  }

  async function selectThread(threadId) {
    if (!threadUrl || !threadId) {
      return;
    }

    if (threadId === activeThreadId) {
      if (savedViewActive) {
        savedViewActive = false;
        savedQuestionAnswerUnits = [];
        render();
        onChange?.();
      }
      return;
    }

    await persist();
    const requestId = documentRequestId;
    const thread = await setActiveStoredChatThread(threadUrl, threadId);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
    resetAssistantResponsesCollapsed();
    savedViewActive = false;
    savedQuestionAnswerUnits = [];
    await refreshThreadList(requestId);
    render();
    onChange?.();
  }

  async function deleteThread(threadId) {
    if (!threadUrl || !threadId) {
      return;
    }

    window.clearTimeout(saveTimer);
    const requestId = documentRequestId;
    const deletingCurrentThread = threadId === activeThreadId;
    const thread = await deleteStoredChatThread(threadUrl, threadId);
    void deleteLocalAgentSession({ mode: "single-paper", conversationKey: threadId }).catch((error) => {
      onDiagnostic?.(`Could not immediately delete Agent session: ${error.message || String(error)}`);
    });
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
    if (deletingCurrentThread) allAssistantResponsesExpanded = false;
    await refreshThreadList(requestId);
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits(requestId);
    }
    render();
    onChange?.();
  }

  async function persist() {
    if (!threadUrl || (!activeThreadId && !messages.length)) {
      return;
    }

    window.clearTimeout(saveTimer);
    const visibleMessages = messages.filter((message) => !message.pending);
    if (JSON.stringify(visibleMessages) === persistedMessagesJson) return;
    const savedThread = await saveStoredChatThread(threadUrl, {
      threadId: activeThreadId,
      url: threadUrl,
      messages: visibleMessages
    });
    const nextThreadId = savedThread.threadId || activeThreadId;
    migrateAssistantCollapseScope(activeThreadId, nextThreadId);
    activeThreadId = nextThreadId;
    persistedMessagesJson = JSON.stringify(visibleMessages);
    return savedThread;
  }

  async function persistCurrentAndGetSnapshot() {
    const scopedUrl = threadUrl;
    const scopedThreadId = activeThreadId;
    const scopedMessages = getMessages();
    if (!scopedUrl || (!scopedThreadId && !scopedMessages.length)) {
      return createConversationSnapshot({
        url: scopedUrl,
        threadId: scopedThreadId,
        messages: scopedMessages
      });
    }

    window.clearTimeout(saveTimer);
    const savedThread = await saveStoredChatThread(scopedUrl, {
      threadId: scopedThreadId,
      url: scopedUrl,
      messages: scopedMessages
    });
    const snapshot = createConversationSnapshot({
      url: scopedUrl,
      threadId: savedThread.threadId || scopedThreadId,
      messages: savedThread.messages || scopedMessages
    });

    if (threadUrl === scopedUrl && activeThreadId === scopedThreadId) {
      migrateAssistantCollapseScope(activeThreadId, snapshot.threadId);
      activeThreadId = snapshot.threadId;
      persistedMessagesJson = JSON.stringify(scopedMessages);
      await refreshThreadList();
    }

    return snapshot;
  }

  async function saveMessagesForSnapshot(snapshot, nextMessages) {
    if (!snapshot?.url || !snapshot?.threadId) {
      return null;
    }

    const savedThread = await saveStoredChatThread(snapshot.url, {
      threadId: snapshot.threadId,
      url: snapshot.url,
      messages: normalizeVisibleMessages(nextMessages)
    }, {
      setActive: isSnapshotCurrent(snapshot),
      requireExisting: true
    });

    if (!savedThread) return null;

    if (isSnapshotCurrent(snapshot)) {
      const wasCurrentAnswerCollapsed = messages.at(-1)?.role === "assistant" &&
        getCollapsedAssistantMessageIndexes().has(messages.length - 1);
      applyThread(savedThread);
      if (allAssistantResponsesExpanded) {
        getCollapsedAssistantMessageIndexes().clear();
      } else {
        collapseHistoricalAssistantResponses(messages.length - 1);
        if (wasCurrentAnswerCollapsed && messages.at(-1)?.role === "assistant") {
          getCollapsedAssistantMessageIndexes().add(messages.length - 1);
        }
      }
      await refreshThreadList();
      if (savedViewActive) {
        await loadSavedQuestionAnswerUnits();
      }
      render({ scrollToBottom: false });
      onChange?.();
    }

    return savedThread;
  }

  function isSnapshotCurrent(snapshot) {
    return Boolean(
      snapshot?.url &&
      snapshot?.threadId &&
      threadUrl === snapshot.url &&
      activeThreadId === snapshot.threadId
    );
  }

  function queueSave() {
    if (!threadUrl) {
      return;
    }

    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      const requestId = documentRequestId;
      persist()
        .then(() => refreshThreadList(requestId))
        .catch((error) => {
          onDiagnostic?.(`Chat thread save skipped: ${error.message || String(error)}`);
        });
    }, 250);
  }

  function applyThread(thread) {
    messages = thread.messages || [];
    activeThreadId = thread.threadId || "";
    persistedMessagesJson = JSON.stringify(messages);
  }

  async function refreshFromSync() {
    if (!threadUrl) return true;
    if (messages.some((message) => message.pending)) return false;
    await persist();
    await flushPaperUserNoteSave();
    const requestId = documentRequestId;
    const [thread, note] = await Promise.all([
      activeThreadId ? getStoredChatThreadById(threadUrl, activeThreadId) : getStoredChatThread(threadUrl),
      getPaperUserNote(threadDocumentKey)
    ]);
    if (requestId !== documentRequestId) return true;
    applyThread(thread || { messages: [], threadId: "" });
    paperUserNoteDocument = note.document;
    await refreshThreadList(requestId);
    if (savedViewActive) await loadSavedQuestionAnswerUnits(requestId);
    render({ scrollToBottom: false });
    onChange?.();
    return true;
  }

  async function setSavedQuestionAnswerViewActive(active) {
    savedViewActive = Boolean(active);
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      if (!savedQaCollapseInitialized) {
        savedCollapsedUnitKeys = new Set(
          savedQuestionAnswerUnits.map((unit) => getSavedQuestionAnswerUnitKey(unit))
        );
        savedQaCollapseInitialized = true;
      }
    } else {
      savedQuestionAnswerUnits = [];
      resetAssistantResponsesCollapsed();
    }

    render();
    onChange?.();
  }

  async function toggleSavedQuestionAnswerView() {
    await setSavedQuestionAnswerViewActive(!savedViewActive);
  }

  function isSavedQuestionAnswerViewActive() {
    return savedViewActive;
  }

  async function loadSavedQuestionAnswerUnits(requestId = documentRequestId) {
    const [paperUnits, comparisonUnits] = threadUrl
      ? await Promise.all([
          listSavedQuestionAnswerUnits(threadUrl),
          threadDocumentKey
            ? listSavedComparisonQuestionAnswerUnitsForDocument(threadDocumentKey)
            : []
        ])
      : [[], []];
    if (requestId !== documentRequestId) {
      return;
    }

    savedQuestionAnswerUnits = [...paperUnits, ...comparisonUnits];
  }

  function updatePaperUserNote(noteDocument) {
    paperUserNoteDocument = noteDocument;
    pendingPaperUserNote = {
      documentKey: threadDocumentKey,
      document: paperUserNoteDocument
    };
    window.clearTimeout(paperUserNoteSaveTimer);
    paperUserNoteSaveTimer = window.setTimeout(() => {
      flushPaperUserNoteSave().catch((error) => {
        onDiagnostic?.(`Paper note save failed: ${error.message || String(error)}`);
      });
    }, 300);
  }

  async function flushPaperUserNoteSave() {
    window.clearTimeout(paperUserNoteSaveTimer);
    paperUserNoteSaveTimer = null;
    const pending = pendingPaperUserNote;
    if (!pending?.documentKey) {
      return;
    }

    await savePaperUserNote(pending.documentKey, pending.document);
    if (pendingPaperUserNote === pending) {
      pendingPaperUserNote = null;
    }
  }

  async function jumpToSavedQuestionAnswerUnit(unit) {
    if (unit?.sourceType === "comparison") {
      await onJumpToComparisonUnit?.(unit);
      return;
    }

    const threadId = String(unit?.threadId || "").trim();
    if (!threadUrl || !threadId) {
      return;
    }

    await persist();
    const requestId = documentRequestId;

    if (threadId !== activeThreadId) {
      const thread = await setActiveStoredChatThread(threadUrl, threadId);
      if (requestId !== documentRequestId) {
        return;
      }

      applyThread(thread);
      await refreshThreadList(requestId);
    }

    savedViewActive = false;
    savedQuestionAnswerUnits = [];
    savedCollapsedUnitKeys = new Set();
    savedQaCollapseInitialized = false;
    render();
    onChange?.();
    scrollToConversationMessagePair({
      userMessageIndex: unit.userMessageIndex,
      assistantMessageIndex: unit.assistantMessageIndex
    });
  }

  async function refreshThreadList(requestId = documentRequestId) {
    if (!threadUrl) {
      threadSummaries = [];
      renderThreadList();
      return;
    }

    const threads = await listStoredChatThreads(threadUrl);
    if (requestId !== documentRequestId) {
      return;
    }

    threadSummaries = threads;
    renderThreadList();
  }

  function render({ scrollToBottom = true } = {}) {
    syncThreadArchiveButtonVisibility();
    if (savedViewActive) {
      captureSavedCollapseState();
      renderSavedQuestionAnswerUnits(threadElement, savedQuestionAnswerUnits, {
        userNoteDocument: paperUserNoteDocument,
        onUserNoteChange: updatePaperUserNote,
        onUserNoteCommit: (noteDocument) => {
          updatePaperUserNote(noteDocument);
          return flushPaperUserNoteSave().catch((error) => {
            onDiagnostic?.(`Paper note save failed: ${error.message || String(error)}`);
          });
        },
        onUserNoteError: (error) => onDiagnostic?.(`Paper note image skipped: ${error.message || String(error)}`),
        collapsedUnitKeys: savedCollapsedUnitKeys,
        onJumpToUnit: jumpToSavedQuestionAnswerUnit,
        onNavigateCitation,
        onTogglePinned: toggleSavedQuestionAnswerPinned,
        onHighlightSavedAnswerSelection: highlightSavedAnswerSelection,
        onCircleSavedAnswerSelection: circleSavedAnswerSelection,
        onHideSavedAnswerSelection: hideSavedAnswerSelection,
        onRemoveSavedAnswerHighlight: removeSavedAnswerHighlight,
        onRemoveSavedAnswerCircle: removeSavedAnswerCircle,
        onRemoveSavedAnswerHiddenText: removeSavedAnswerHiddenText
      });
      scrollToLatest.hide();
      return;
    }

    renderConversationMessages(threadElement, messages, {
      collapsedAssistantMessageIndexes: getCollapsedAssistantMessageIndexes(),
      onAssistantResponseCollapseChange: setAssistantResponseCollapsed,
      onEditUserMessage: editUserMessage,
      onToggleSaved: toggleMessageSaved,
      onSaveLimitRejected,
      onDeleteUnit: deleteMessageUnit,
      onNavigateCitation,
      onHighlightAssistantSelection: highlightAssistantSelection,
      onCircleAssistantSelection: circleAssistantSelection,
      onHideAssistantSelection: hideAssistantSelection,
      onRemoveAssistantHighlight: removeAssistantHighlight,
      onRemoveAssistantCircle: removeAssistantCircle,
      onRemoveAssistantHiddenText: removeAssistantHiddenText
    });
    if (scrollToBottom) {
      scrollToLatest.scrollToBottom();
    }
    window.requestAnimationFrame(scrollToLatest.update);
  }

  async function editUserMessage(messageIndex, nextText) {
    const index = Number(messageIndex);
    const message = messages[index];
    const text = String(nextText || "").trim();
    if (!message || message.role !== "user" || message.pending || !text) {
      return false;
    }

    const requestId = documentRequestId;
    const scopedUrl = threadUrl;
    const scopedThreadId = activeThreadId;
    const nextMessages = messages.map((candidate, candidateIndex) => candidateIndex === index ? {
      ...message,
      text
    } : { ...candidate });
    const savedThread = await saveStoredChatThread(scopedUrl, {
      threadId: scopedThreadId,
      url: scopedUrl,
      messages: nextMessages.filter((candidate) => !candidate.pending)
    });
    if (requestId !== documentRequestId || scopedUrl !== threadUrl || scopedThreadId !== activeThreadId) {
      return true;
    }

    messages = savedThread.messages || nextMessages;
    render({ scrollToBottom: false });
    await refreshThreadList(requestId);
    onChange?.();
    return true;
  }

  function renderThreadList() {
    syncThreadArchiveButtonVisibility();
    if (threadArchiveButton.hidden) {
      return;
    }
    threadWheel.render();
  }

  function syncThreadArchiveButtonVisibility() {
    const shouldShow = Boolean(threadUrl) && !savedViewActive && hasMultipleSinglePaperThreads();
    threadArchiveButton.hidden = !shouldShow;
    if (!shouldShow) {
      threadWheel.close();
    }
  }

  function hasMultipleSinglePaperThreads() {
    const threadIds = new Set(
      threadSummaries
        .map((thread) => String(thread?.threadId || "").trim())
        .filter(Boolean)
    );
    if (activeThreadId) {
      threadIds.add(activeThreadId);
    }
    return threadIds.size > 1;
  }

  function hasScrollableMessages() {
    return !savedViewActive && messages.length > 0;
  }

  function getAssistantMessageIndexes() {
    return messages
      .map((message, index) => message?.role === "assistant" ? index : -1)
      .filter((index) => index >= 0);
  }

  function getAssistantCollapseScopeKey(threadId = activeThreadId) {
    return `${threadDocumentKey || threadUrl}::${threadId || "current"}`;
  }

  function migrateAssistantCollapseScope(previousThreadId, nextThreadId) {
    const previousKey = getAssistantCollapseScopeKey(previousThreadId);
    const nextKey = getAssistantCollapseScopeKey(nextThreadId);
    if (previousKey === nextKey) {
      return;
    }

    const collapsedIndexes = collapsedAssistantResponsesByThread.get(previousKey);
    if (!collapsedIndexes) {
      return;
    }

    collapsedAssistantResponsesByThread.set(nextKey, collapsedIndexes);
    collapsedAssistantResponsesByThread.delete(previousKey);
  }

  function getCollapsedAssistantMessageIndexes() {
    const key = getAssistantCollapseScopeKey();
    if (!collapsedAssistantResponsesByThread.has(key)) {
      collapsedAssistantResponsesByThread.set(key, new Set(getAssistantMessageIndexes()));
    }
    return collapsedAssistantResponsesByThread.get(key);
  }

  function resetAssistantResponsesCollapsed() {
    allAssistantResponsesExpanded = false;
    collapsedAssistantResponsesByThread.set(
      getAssistantCollapseScopeKey(),
      new Set(getAssistantMessageIndexes())
    );
  }

  function setAssistantResponseCollapsed(_userMessageIndex, assistantMessageIndex, collapsed) {
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    if (collapsed) {
      collapsedIndexes.add(assistantMessageIndex);
    } else {
      collapsedIndexes.delete(assistantMessageIndex);
    }
    const indexes = getAssistantMessageIndexes();
    allAssistantResponsesExpanded = indexes.length > 0 && indexes.every((index) => !collapsedIndexes.has(index));
    onChange?.();
  }

  function setAllAssistantResponsesCollapsed(collapsed) {
    const indexes = getAssistantMessageIndexes();
    allAssistantResponsesExpanded = !collapsed && indexes.length > 0;
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    collapsedIndexes.clear();
    if (collapsed) {
      indexes.forEach((index) => collapsedIndexes.add(index));
    }
    threadElement.querySelectorAll(".conversation-message.assistant").forEach((element) => {
      element.classList.toggle("assistant-response-collapsed", Boolean(collapsed));
    });
    threadElement.querySelectorAll(".conversation-response-toggle").forEach((element) => {
      element.setAttribute("aria-expanded", String(!collapsed));
    });
    if (allAssistantResponsesExpanded) threadElement.scrollTop = 0;
    window.requestAnimationFrame(scrollToLatest.update);
    onChange?.();
  }

  function areAllAssistantResponsesCollapsed() {
    const indexes = getAssistantMessageIndexes();
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    return indexes.length > 0 && indexes.every((index) => collapsedIndexes.has(index));
  }

  function captureSavedCollapseState() {
    if (!savedViewActive || !threadElement.classList.contains("saved-qa-thread")) {
      return;
    }

    savedCollapsedUnitKeys = getSavedQuestionAnswerCollapsedUnitKeys(threadElement);
  }

  return {
    setDocumentUrl,
    refreshFromSync,
    appendMessage,
    appendTransientMessage,
    updateTransientMessage,
    replaceTransientMessage,
    removeTransientMessage,
    toggleMessageSaved,
    setSavedQaPerPaperLimit,
    highlightAssistantSelection,
    circleAssistantSelection,
    hideAssistantSelection,
    removeAssistantHighlight,
    removeAssistantCircle,
    removeAssistantHiddenText,
    deleteMessageUnit,
    getMessages,
    hasScrollableMessages,
    persist,
    persistCurrentAndGetSnapshot,
    saveMessagesForSnapshot,
    isSnapshotCurrent,
    setSavedQuestionAnswerViewActive,
    toggleSavedQuestionAnswerView,
    isSavedQuestionAnswerViewActive,
    setAllAssistantResponsesCollapsed,
    areAllAssistantResponsesCollapsed,
    hasMultipleSinglePaperThreads,
    createThread,
    selectThread,
    deleteThread
  };
}

function createConversationSnapshot({ url, threadId, messages }) {
  return {
    url: String(url || ""),
    threadId: String(threadId || ""),
    messages: normalizeVisibleMessages(messages)
  };
}

function normalizeVisibleMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message?.role && message?.text && !message.pending)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      text: String(message.text || "").trim(),
      model: message.role === "assistant" ? String(message.model || "").trim() : "",
      citationCatalog: message.role === "assistant" ? normalizeCitationCatalog(message.citationCatalog) : null,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now(),
      isSaved: isMessageSaved(message),
      isPinned: isMessageSaved(message) && Boolean(message.isPinned)
    }));
}

function isMessageSaved(message) {
  return Boolean(message?.isSaved);
}

function formatHighlightSkipReason(reason) {
  if (reason === "ambiguous-selection") {
    return "selected text appears more than once.";
  }
  if (reason === "selection-not-found") {
    return "selected text was not found in the response markdown.";
  }
  if (reason === "unsupported-highlight-selection") {
    return "selected text crosses unsupported markdown syntax or block boundaries.";
  }
  if (reason === "already-hidden") {
    return "selected text is already hidden.";
  }
  if (reason === "already-circled") {
    return "selected text is already circled.";
  }
  return "select response text first.";
}

function createEditResult(changed, reason = "") {
  return {
    changed: Boolean(changed),
    reason
  };
}

function hasVisibleMessages(messages) {
  return (Array.isArray(messages) ? messages : []).some((message) => (
    message?.role &&
    message?.text &&
    !message.pending
  ));
}
