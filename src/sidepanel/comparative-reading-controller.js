import { answerComparisonQuestion } from "../compare/comparison-answer.js";
import { buildComparisonContextPack } from "../compare/build-comparison-context.js";
import { MessageType } from "../shared/messages.js";
import {
  MAX_COMPARISON_PAPERS,
  appendComparisonMessage,
  createComparisonSession,
  getComparisonSession,
  listComparisonSessions,
  saveComparisonMessages
} from "../storage/comparison-store.js";
import { getAiSettings, hasConfiguredAiProvider, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";
import {
  applyMarkdownCircle,
  applyMarkdownHiddenText,
  applyMarkdownHighlight,
  removeMarkdownCircle,
  removeMarkdownHiddenText,
  removeMarkdownHighlight
} from "../markdown/highlight-markdown.js";
import {
  clearComparativeReadingPanel,
  renderComparativeReadingPanel
} from "./comparative-reading-renderer.js";
import { createLoadingMessageRotator, getInitialLoadingMessage } from "./loading-messages.js";

export function createComparativeReadingController({
  elements,
  getComposer,
  scrollToLatest,
  clearError,
  showError,
  onChange,
  onDiagnostic
}) {
  const state = {
    active: false,
    selectedPapers: [],
    sessions: [],
    activeSessionId: "",
    messages: [],
    busy: false,
    contextLoading: false,
    status: ""
  };

  async function show(context = {}) {
    state.active = true;
    clearError?.();
    const comparisonId = String(context.comparisonId || "").trim();
    state.activeSessionId = comparisonId;
    state.selectedPapers = [];
    state.messages = [];
    state.contextLoading = true;
    state.status = "";
    render();

    try {
      await refreshSessions();

      if (comparisonId) {
        await selectSession(comparisonId, { renderAfter: false });
      } else {
        state.activeSessionId = "";
        state.selectedPapers = [];
        state.messages = [];
        state.status = "";
      }

      const draftKeys = normalizeDocumentKeys(context.draftDocumentKeys || []);
      for (const documentKey of draftKeys) {
        await addPaper(documentKey, { renderAfter: false, syncDraft: false });
      }
    } catch (error) {
      state.status = "Could not load comparative context.";
      showError?.(error.message || String(error));
      onDiagnostic?.(`Comparative context load failed: ${error.message || String(error)}`);
    } finally {
      state.contextLoading = false;
      render();
      onChange?.();
    }
  }

  function hide() {
    if (!state.active) {
      return;
    }

    state.active = false;
    state.status = "";
    clearComparativeReadingPanel(elements);
    onChange?.();
  }

  async function addPaper(documentKey, options = {}) {
    const key = String(documentKey || "").trim();
    if (!key || state.selectedPapers.some((paper) => paper.documentKey === key)) {
      return;
    }

    if (state.selectedPapers.length >= MAX_COMPARISON_PAPERS) {
      setStatus(`Comparative reading supports up to ${MAX_COMPARISON_PAPERS} papers.`);
      return;
    }

    const paper = await getLibraryPaperSummary(key);
    if (!paper?.hasMarkdown) {
      setStatus("That paper has no cached Markdown yet.");
      return;
    }

    state.selectedPapers.push(paper);
    state.status = "";
    if (!state.activeSessionId && options.syncDraft !== false) {
      notifyComparisonDraftChanged(state.selectedPapers);
    }
    if (options.renderAfter !== false) {
      render();
      onChange?.();
    }
  }

  async function removePaper(documentKey) {
    if (state.activeSessionId) {
      return;
    }

    state.selectedPapers = state.selectedPapers.filter((paper) => paper.documentKey !== documentKey);
    notifyComparisonDraftChanged(state.selectedPapers);
    render();
    onChange?.();
  }

  function clearPapers() {
    if (state.activeSessionId || !state.selectedPapers.length) {
      return;
    }

    state.selectedPapers = [];
    state.status = "";
    notifyComparisonDraftChanged([]);
    render();
    onChange?.();
  }

  async function startNewSession() {
    state.activeSessionId = "";
    state.selectedPapers = [];
    state.messages = [];
    state.status = "";
    getComposer()?.clear();
    notifyComparisonDraftChanged([]);
    render();
    onChange?.();
  }

  async function selectSession(comparisonId, options = {}) {
    const session = await getComparisonSession(comparisonId);
    if (!session) {
      return;
    }

    state.activeSessionId = session.comparisonId;
    state.selectedPapers = await hydratePapers(session.documentKeys);
    state.messages = session.messages || [];
    state.status = "";
    if (options.renderAfter !== false) {
      render();
      onChange?.();
    }
  }

  async function ask(event) {
    event.preventDefault();
    if (state.busy) {
      return;
    }

    if (state.contextLoading) {
      setStatus("Still loading comparative context.");
      return;
    }

    const question = getComposer().getText();
    if (!question) {
      setStatus("Enter a comparative question.");
      return;
    }

    if (state.selectedPapers.length < 2) {
      setStatus("Choose at least two papers.");
      return;
    }

    state.busy = true;
    state.status = "";
    const previousMessages = state.messages.filter((message) => !message.pending);
    const userCreatedAt = Date.now();
    const pendingAssistantMessage = {
      role: "assistant",
      text: getInitialLoadingMessage(),
      pending: true,
      createdAt: userCreatedAt + 1
    };
    state.messages = [
      ...previousMessages,
      {
        role: "user",
        text: question,
        createdAt: userCreatedAt
      },
      pendingAssistantMessage
    ];
    getComposer().clear();
    render();

    let loadingRotator = null;
    let userMessagePersisted = false;

    try {
      loadingRotator = createLoadingMessageRotator((text) => {
        const pendingIndex = state.messages.findIndex((message) => message.pending);
        if (pendingIndex < 0) {
          return;
        }

        state.messages[pendingIndex] = {
          ...state.messages[pendingIndex],
          text
        };
        render({ scrollToBottom: false });
      });
      loadingRotator.start();

      const session = await ensureSession(question);
      let updatedSession = await appendComparisonMessage(session.comparisonId, {
        role: "user",
        text: question,
        createdAt: userCreatedAt
      });
      userMessagePersisted = true;
      state.activeSessionId = session.comparisonId;
      state.messages = [
        ...(updatedSession?.messages || []),
        {
          ...pendingAssistantMessage,
          text: getCurrentPendingLoadingText(state.messages)
        }
      ];
      render();

      const contextPack = await buildComparisonContextPack({
        documentKeys: state.selectedPapers.map((paper) => paper.documentKey),
        question
      });
      const aiSettings = await getAiSettings();
      if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiProvider(aiSettings)) {
        throw new Error("AI provider is not configured. Open extension Options to finish setup.");
      }

      const answer = await answerComparisonQuestion({
        aiSettings,
        contextPack,
        conversationMessages: previousMessages
      });
      loadingRotator?.stop();
      loadingRotator = null;

      updatedSession = await appendComparisonMessage(session.comparisonId, {
        role: "assistant",
        text: answer.text,
        citedDocumentKeys: contextPack.papers.map((paper) => paper.documentKey),
        createdAt: Date.now()
      });
      state.messages = updatedSession?.messages || [];
      state.sessions = await listComparisonSessions();
      state.status = "";
      notifyComparisonActivityChanged();
    } catch (error) {
      state.messages = userMessagePersisted
        ? state.messages.filter((message) => !message.pending)
        : previousMessages;
      showError?.(error.message || String(error));
      onDiagnostic?.(`Comparative reading failed: ${error.message || String(error)}`);
    } finally {
      loadingRotator?.stop();
      state.busy = false;
      render();
      onChange?.();
    }
  }

  function canAsk() {
    return state.active && !state.busy;
  }

  function isActive() {
    return state.active;
  }

  function isBusy() {
    return state.busy;
  }

  function hasScrollableMessages() {
    return state.active && state.messages.length > 0;
  }

  async function refreshSessions() {
    state.sessions = await listComparisonSessions();
  }

  async function ensureSession(question) {
    const documentKeys = state.selectedPapers.map((paper) => paper.documentKey);
    if (state.activeSessionId) {
      return getComparisonSession(state.activeSessionId);
    }

    const session = await createComparisonSession(documentKeys, { question });
    state.sessions = await listComparisonSessions();
    notifyComparisonContextChanged(session.comparisonId);
    return session;
  }

  async function hydratePapers(documentKeys) {
    const papers = [];
    for (const documentKey of normalizeDocumentKeys(documentKeys)) {
      const paper = await getLibraryPaperSummary(documentKey);
      if (paper?.hasMarkdown) {
        papers.push(paper);
      }
    }
    return papers;
  }

  function render({ scrollToBottom = true } = {}) {
    if (!state.active) {
      return;
    }

    const activeSession = state.sessions.find((session) => session.comparisonId === state.activeSessionId);
    renderComparativeReadingPanel({
      elements,
      title: activeSession?.title || "Comparative Reading",
      selectedPapers: state.selectedPapers,
      messages: state.messages,
      status: state.status,
      busy: state.busy,
      contextReadiness: getContextReadiness(),
      allowRemovePapers: !state.activeSessionId,
      onRemovePaper: removePaper,
      onClearPapers: clearPapers,
      onOpenPaperUrl: openPaperUrl,
      onToggleSaved: toggleMessageSaved,
      onDeleteUnit: deleteMessageUnit,
      onHighlightAssistantSelection: highlightAssistantSelection,
      onCircleAssistantSelection: circleAssistantSelection,
      onHideAssistantSelection: hideAssistantSelection,
      onRemoveAssistantHighlight: removeAssistantHighlight,
      onRemoveAssistantCircle: removeAssistantCircle,
      onRemoveAssistantHiddenText: removeAssistantHiddenText,
      scrollToLatest,
      scrollToBottom
    });
  }

  function getContextReadiness() {
    if (state.contextLoading) {
      return {
        state: "loading",
        label: "Loading comparative context"
      };
    }

    if (state.selectedPapers.length >= 2) {
      return {
        state: "ready",
        label: "Comparative context ready"
      };
    }

    return {
      state: "warning",
      label: state.selectedPapers.length === 1
        ? "Need one more paper. Add it from dashboard."
        : "Need at least two papers. Add them from dashboard."
    };
  }

  function setStatus(message) {
    state.status = message || "";
    render();
  }

  async function toggleMessageSaved(messageIndex) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return;
    }

    state.messages[index] = {
      ...message,
      isSaved: !message.isSaved
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
  }

  async function highlightAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownHighlight(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Highlight skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return createEditResult(true);
  }

  async function hideAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownHiddenText(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Hide skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return createEditResult(true);
  }

  async function circleAssistantSelection(messageIndex, selectedText) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return createEditResult(false, "response message is unavailable.");
    }

    const result = applyMarkdownCircle(message.text, selectedText);
    if (!result.changed) {
      const reason = formatHighlightSkipReason(result.reason);
      onDiagnostic?.(`Circle skipped: ${reason}`);
      return createEditResult(false, reason);
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return createEditResult(true);
  }

  async function removeAssistantHighlight(messageIndex, highlightIndex) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownHighlight(message.text, highlightIndex);
    if (!result.changed) {
      onDiagnostic?.("Highlight removal skipped: highlight was not found.");
      return false;
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return true;
  }

  async function removeAssistantCircle(messageIndex, circleIndex) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownCircle(message.text, circleIndex);
    if (!result.changed) {
      onDiagnostic?.("Circle removal skipped: circle was not found.");
      return false;
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return true;
  }

  async function removeAssistantHiddenText(messageIndex, hiddenIndex, groupId = "") {
    const index = Number(messageIndex);
    const message = state.messages[index];
    if (!state.activeSessionId || !message || message.role !== "assistant" || message.pending) {
      return false;
    }

    const result = removeMarkdownHiddenText(message.text, hiddenIndex, groupId);
    if (!result.changed) {
      onDiagnostic?.("Hidden text removal skipped: hidden text was not found.");
      return false;
    }

    state.messages[index] = {
      ...message,
      text: result.markdown
    };
    render({ scrollToBottom: false });
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return true;
  }

  async function deleteMessageUnit(messageIndex) {
    const index = Number(messageIndex);
    if (!state.activeSessionId || !state.messages[index] || state.messages[index].pending) {
      return;
    }

    const startIndex = state.messages[index - 1]?.role === "user" && !state.messages[index - 1]?.pending
      ? index - 1
      : index;
    const deleteCount = index - startIndex + 1;
    if (!window.confirm("Delete this question and response?")) {
      return;
    }

    state.messages.splice(startIndex, deleteCount);
    render();
    const session = await saveComparisonMessages(state.activeSessionId, state.messages);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render();
    onChange?.();
  }

  function openPaperUrl(paper) {
    const url = normalizeOpenableUrl(paper?.canonicalUrl);
    if (!url) {
      setStatus("No paper URL is available.");
      return;
    }

    if (globalThis.chrome?.tabs?.create) {
      chrome.tabs.create({ url }).catch((error) => {
        setStatus("Could not open paper URL.");
        onDiagnostic?.(`Could not open comparative paper URL: ${error.message || String(error)}`);
      });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return {
    show,
    hide,
    addPaper,
    ask,
    startNewSession,
    canAsk,
    isActive,
    isBusy,
    hasScrollableMessages
  };
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

function getCurrentPendingLoadingText(messages) {
  return messages.find((message) => message?.pending)?.text || getInitialLoadingMessage();
}

function createEditResult(changed, reason = "") {
  return {
    changed: Boolean(changed),
    reason
  };
}

function normalizeDocumentKeys(documentKeys) {
  return [...new Set((Array.isArray(documentKeys) ? documentKeys : [])
    .map((key) => String(key || "").trim())
    .filter(Boolean))]
    .slice(0, MAX_COMPARISON_PAPERS);
}

function normalizeOpenableUrl(url) {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
}

function notifyComparisonContextChanged(comparisonId) {
  if (!globalThis.chrome?.runtime?.sendMessage) {
    return;
  }

  chrome.runtime.sendMessage({
    type: MessageType.OPEN_COMPARISON_CONTEXT,
    comparisonId
  }).catch(() => {});
}

function notifyComparisonActivityChanged() {
  if (!globalThis.chrome?.runtime?.sendMessage) {
    return;
  }

  chrome.runtime.sendMessage({
    type: MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED
  }).catch(() => {});
}

function notifyComparisonDraftChanged(papers) {
  if (!globalThis.chrome?.runtime?.sendMessage) {
    return;
  }

  chrome.runtime.sendMessage({
    type: MessageType.UPDATE_COMPARISON_DRAFT,
    documentKeys: papers.map((paper) => paper.documentKey)
  }).catch(() => {});
}
