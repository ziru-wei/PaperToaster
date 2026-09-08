import {
  createStoredChatThread,
  deleteStoredChatThread,
  getStoredChatThreadById,
  getStoredChatThread,
  listSavedQuestionAnswerUnits,
  listStoredChatThreads,
  saveStoredChatThread,
  setActiveStoredChatThread,
  setPinnedSavedQuestionAnswerUnit
} from "../storage/chat-store.js";
import { listSavedComparisonQuestionAnswerUnitsForDocument } from "../storage/comparison-store.js";
import { getPaperUserNote, savePaperUserNote } from "../storage/paper-note-store.js";
import {
  collapseOpenConversationSelections,
  getSavedQuestionAnswerCollapsedUnitKeys,
  renderSavedQuestionAnswerUnits,
  renderConversationMessages,
  toggleConversationSelection
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
import { createThreadWheelController } from "./thread-wheel-controller.js";

export function createConversationPanelController({
  threadElement,
  threadArchiveButton,
  threadWheelElement,
  scrollToLatest,
  onDiagnostic,
  onChange
}) {
  let messages = [];
  let threadUrl = "";
  let threadDocumentKey = "";
  let activeThreadId = "";
  let threadSummaries = [];
  let saveTimer = null;
  let documentRequestId = 0;
  let transientMessageId = 0;
  let savedViewActive = false;
  let savedQuestionAnswerUnits = [];
  let savedCollapsedUnitKeys = new Set();
  let paperUserNote = "";
  let paperUserNoteSaveTimer = null;
  let pendingPaperUserNote = null;

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

    if (!threadUrl) {
      messages = [];
      threadDocumentKey = "";
      activeThreadId = "";
      threadSummaries = [];
      savedQuestionAnswerUnits = [];
      savedCollapsedUnitKeys = new Set();
      paperUserNote = "";
      threadWheel.close();
      render();
      scrollToLatest.update();
      renderThreadList();
      onChange?.();
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
    paperUserNote = storedPaperUserNote.text;
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

    messages.push({
      role,
      text,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now(),
      isSaved: isMessageSaved(message)
    });
    render();
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
    render();
    onChange?.();
    return id;
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
    render({ scrollToBottom: false });
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

    messages.splice(index, 1, {
      role,
      text,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now(),
      isSaved: isMessageSaved(message)
    });
    render();
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

    messages[index] = {
      ...message,
      isSaved: !isMessageSaved(message),
      isPinned: isMessageSaved(message) ? false : Boolean(message.isPinned)
    };
    render({ scrollToBottom: false });
    await persist();
    await refreshThreadList();
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
      render({ scrollToBottom: false });
    }
    onChange?.();
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

    if (threadUrl && activeThreadId) {
      const thread = await deleteStoredChatThread(threadUrl, activeThreadId);
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
    const thread = await deleteStoredChatThread(threadUrl, threadId);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
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
    const savedThread = await saveStoredChatThread(threadUrl, {
      threadId: activeThreadId,
      url: threadUrl,
      messages: messages.filter((message) => !message.pending)
    });
    activeThreadId = savedThread.threadId || activeThreadId;
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
      activeThreadId = snapshot.threadId;
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
    });

    if (isSnapshotCurrent(snapshot)) {
      applyThread(savedThread);
      await refreshThreadList();
      if (savedViewActive) {
        await loadSavedQuestionAnswerUnits();
      }
      render();
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
  }

  async function setSavedQuestionAnswerViewActive(active) {
    savedViewActive = Boolean(active);
    if (savedViewActive) {
      await loadSavedQuestionAnswerUnits();
    } else {
      savedQuestionAnswerUnits = [];
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

  function updatePaperUserNote(text) {
    paperUserNote = String(text || "");
    pendingPaperUserNote = {
      documentKey: threadDocumentKey,
      text: paperUserNote
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

    await savePaperUserNote(pending.documentKey, pending.text);
    if (pendingPaperUserNote === pending) {
      pendingPaperUserNote = null;
    }
  }

  async function jumpToSavedQuestionAnswerUnit(unit) {
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
    if (savedViewActive) {
      captureSavedCollapseState();
      renderSavedQuestionAnswerUnits(threadElement, savedQuestionAnswerUnits, {
        userNote: paperUserNote,
        onUserNoteChange: updatePaperUserNote,
        onUserNoteCommit: (text) => {
          updatePaperUserNote(text);
          return flushPaperUserNoteSave().catch((error) => {
            onDiagnostic?.(`Paper note save failed: ${error.message || String(error)}`);
          });
        },
        collapsedUnitKeys: savedCollapsedUnitKeys,
        onJumpToUnit: jumpToSavedQuestionAnswerUnit,
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
      onEditUserMessage: editUserMessage,
      onToggleSaved: toggleMessageSaved,
      onDeleteUnit: deleteMessageUnit,
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
    threadWheel.render();
  }

  function hasScrollableMessages() {
    return !savedViewActive && messages.length > 0;
  }

  function captureSavedCollapseState() {
    if (!savedViewActive || !threadElement.classList.contains("saved-qa-thread")) {
      return;
    }

    savedCollapsedUnitKeys = getSavedQuestionAnswerCollapsedUnitKeys(threadElement);
  }

  return {
    setDocumentUrl,
    appendMessage,
    appendTransientMessage,
    updateTransientMessage,
    replaceTransientMessage,
    removeTransientMessage,
    toggleMessageSaved,
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
    createThread,
    selectThread,
    deleteThread
  };
}

function scrollToConversationMessagePair({ userMessageIndex, assistantMessageIndex }) {
  const indexes = [userMessageIndex, assistantMessageIndex]
    .map((index) => Number(index))
    .filter((index) => Number.isInteger(index) && index >= 0);

  if (!indexes.length) {
    return;
  }

  window.requestAnimationFrame(() => {
    const targets = indexes
      .map((index) => document.querySelector(`.conversation-message[data-message-index="${index}"]`))
      .filter(Boolean);
    const firstTarget = targets[0];
    if (!firstTarget) {
      return;
    }

    firstTarget.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    targets.forEach((target) => target.classList.add("conversation-jump-highlight"));
    window.setTimeout(() => {
      targets.forEach((target) => target.classList.remove("conversation-jump-highlight"));
    }, 1200);
  });
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
