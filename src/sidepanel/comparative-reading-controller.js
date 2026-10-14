import { answerComparisonQuestion } from "../compare/comparison-answer.js";
import { createAbstractAgentDocument } from "../ai/abstract-document.js";
import { normalizeOpenableUrl, openPaperUrlInExistingTab } from "../browser/open-paper-tab.js";
import { MessageType } from "../shared/messages.js";
import {
  appendComparisonMessage,
  createComparisonSession,
  getComparisonSession,
  listComparisonSessions as listStoredComparisonSessions,
  saveComparisonMessages,
  setComparisonSessionTitle
} from "../storage/comparison-store.js";
import {
  COMPARISON_AGENT_READING,
  DEFAULT_COMPARISON_PAPER_LIMIT,
  getComparisonSettings,
  normalizeComparisonPaperLimit,
  saveComparisonSettings
} from "../storage/comparison-settings-store.js";
import { getEffectiveAiSettings, hasConfiguredAiProvider, usesDebugAiMode } from "../storage/ai-settings-store.js";
import { getLibraryPaperSummary } from "../storage/library-store.js";
import { getStoredDocumentByDocumentKey } from "../storage/document-store.js";
import { ensureAgentDocument } from "../ai/local-agent-document-client.js";
import { createPaperCitationShortName, createSourceSpanCitationContext } from "../ai/citation-catalog.js";
import { setComparisonAnswerSaved } from "../storage/saved-qa-store.js";
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
import { createQuestionScrollScheduler, scrollToConversationMessagePair } from "./conversation-navigation.js";
import { getHistoricalAssistantMessageIndexes } from "../conversation/message-state.js";
import { updatePendingConversationMessageText } from "./conversation-message-renderer.js";

export function createComparativeReadingController({
  elements,
  getComposer,
  scrollToLatest,
  clearError,
  showError,
  onChange,
  onDiagnostic,
  onNavigateCitation,
  onSaveLimitRejected
}) {
  const TITLE_SAVE_DELAY_MS = 400;
  let allAssistantResponsesExpanded = false;
  const state = {
    active: false,
    selectedPapers: [],
    sessions: [],
    activeSessionId: "",
    messages: [],
    busy: false,
    contextLoading: false,
    status: "",
    draftIssue: "",
    paperLimit: DEFAULT_COMPARISON_PAPER_LIMIT,
    savedQaPerPaperLimit: 20
  };
  let titleSaveTimer = null;
  let sessionEpoch = 0;
  const scheduleNewQuestionAtTop = createQuestionScrollScheduler(elements.conversationThread);
  let agentReading = COMPARISON_AGENT_READING.ABSTRACT;

  // "Agent reads": abstracts (default) or full papers, saved for later comparisons.
  const renderAgentReading = () => {
    elements.comparisonReadMode?.querySelectorAll("[data-mode]").forEach((option) => {
      option.setAttribute("aria-checked", String(option.dataset.mode === agentReading));
    });
  };
  elements.comparisonReadMode?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-mode]");
    if (!option || option.dataset.mode === agentReading) return;
    agentReading = option.dataset.mode;
    renderAgentReading();
    saveComparisonSettings({ agentReading }).catch((error) => {
      onDiagnostic?.(`Could not save what the agent reads: ${error.message || String(error)}`);
    });
  });
  getComparisonSettings().then((settings) => {
    agentReading = settings.agentReading;
    renderAgentReading();
  }).catch(() => {});
  const pendingTitlesBySession = new Map();
  const collapsedAssistantResponsesBySession = new Map();

  async function listComparisonSessions() {
    const sessions = await listStoredComparisonSessions();
    if (!state.activeSessionId || sessions.some((session) => session.comparisonId === state.activeSessionId)) {
      return sessions;
    }
    const activeSession = await getComparisonSession(state.activeSessionId);
    return activeSession ? [...sessions, activeSession] : sessions;
  }

  elements.documentTitle.addEventListener("input", handleTitleInput);
  elements.documentTitle.addEventListener("blur", () => {
    void flushTitleSave();
  });

  async function show(context = {}) {
    sessionEpoch += 1;
    await flushTitleSave();
    state.active = true;
    allAssistantResponsesExpanded = false;
    clearError?.();
    const comparisonId = String(context.comparisonId || "").trim();
    state.activeSessionId = comparisonId;
    state.selectedPapers = [];
    state.messages = [];
    state.contextLoading = true;
    state.status = "";
    state.draftIssue = String(context.draftIssue || "");
    render();

    try {
      const [settings] = await Promise.all([
        getComparisonSettings(),
        refreshSessions()
      ]);
      state.paperLimit = settings.paperLimit;

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

    void flushTitleSave();
    state.active = false;
    allAssistantResponsesExpanded = false;
    state.status = "";
    clearComparativeReadingPanel(elements);
    onChange?.();
  }

  async function addPaper(documentKey, options = {}) {
    const key = String(documentKey || "").trim();
    if (!key || state.selectedPapers.some((paper) => paper.documentKey === key)) {
      return;
    }

    if (state.selectedPapers.length >= state.paperLimit) {
      setStatus(`Comparative reading supports up to ${state.paperLimit} papers.`);
      return;
    }

    const paper = await getLibraryPaperSummary(key);
    if (paper?.archivedAt) {
      setStatus("Archived papers cannot be added to a new comparison.");
      return;
    }
    if (!paper?.hasMarkdown) {
      setStatus("That paper has no cached Markdown yet.");
      return;
    }

    state.selectedPapers.push(paper);
    state.status = "";
    state.draftIssue = "";
    if (!state.activeSessionId && options.syncDraft !== false) {
      notifyComparisonDraftChanged(state.selectedPapers);
    }
    if (options.renderAfter !== false) {
      render();
      onChange?.();
    }
  }

  async function addPapers(documentKeys) {
    if (state.activeSessionId) {
      return;
    }

    const existingKeys = new Set(state.selectedPapers.map((paper) => paper.documentKey));
    const availableSlots = Math.max(0, state.paperLimit - state.selectedPapers.length);
    const keys = normalizeDocumentKeys(documentKeys)
      .filter((documentKey) => !existingKeys.has(documentKey))
      .slice(0, availableSlots);
    for (const documentKey of keys) {
      await addPaper(documentKey, { renderAfter: false, syncDraft: false });
    }
    state.status = "";
    state.draftIssue = "";
    notifyComparisonDraftChanged(state.selectedPapers);
    render();
    onChange?.();
  }

  async function removePaper(documentKey) {
    if (state.activeSessionId) {
      return;
    }

    state.selectedPapers = state.selectedPapers.filter((paper) => paper.documentKey !== documentKey);
    state.draftIssue = "";
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
    state.draftIssue = "";
    notifyComparisonDraftChanged([]);
    render();
    onChange?.();
  }

  async function startNewSession() {
    sessionEpoch += 1;
    allAssistantResponsesExpanded = false;
    state.activeSessionId = "";
    state.selectedPapers = [];
    state.messages = [];
    state.status = "";
    state.draftIssue = "";
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
    resetAssistantResponsesCollapsed();
    state.status = "";
    state.draftIssue = "";
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

    const askEpoch = sessionEpoch;
    const isCurrentAsk = () => sessionEpoch === askEpoch;
    let askPapers = state.selectedPapers;

    state.busy = true;
    state.status = "";
    allAssistantResponsesExpanded = false;
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
    collapseHistoricalAssistantResponses();
    getComposer().clear();
    render({ scrollToBottom: false });
    scheduleNewQuestionAtTop(state.messages.length - 2);

    let loadingRotator = null;
    let userMessagePersisted = false;

    try {
      loadingRotator = createLoadingMessageRotator((text) => {
        if (!isCurrentAsk()) {
          return;
        }
        const pendingIndex = state.messages.findIndex((message) => message.pending);
        if (pendingIndex < 0) {
          return;
        }

        state.messages[pendingIndex] = {
          ...state.messages[pendingIndex],
          text
        };
        updatePendingConversationMessageText(elements.conversationThread, pendingIndex, text);
      });
      loadingRotator.start();

      const session = await ensureSession(question);
      if (!session) throw new Error("This comparison is no longer available.");
      const sessionPaperKeys = session.documentKeys || [];
      if (askPapers.map((paper) => paper.documentKey).join("\0") !== sessionPaperKeys.join("\0")) {
        askPapers = await hydratePapers(sessionPaperKeys);
        if (askPapers.length < 2) throw new Error("This comparison no longer has two available papers.");
        if (isCurrentAsk()) {
          state.selectedPapers = askPapers;
        }
      }
      let updatedSession = await appendComparisonMessage(session.comparisonId, {
        role: "user",
        text: question,
        createdAt: userCreatedAt
      });
      userMessagePersisted = true;
      if (isCurrentAsk()) {
        const wasPendingCollapsed = getCollapsedAssistantMessageIndexes().has(state.messages.length - 1);
        state.activeSessionId = session.comparisonId;
        state.messages = [
          ...(updatedSession?.messages || []),
          {
            ...pendingAssistantMessage,
            text: getCurrentPendingLoadingText(state.messages)
          }
        ];
        if (allAssistantResponsesExpanded) {
          getCollapsedAssistantMessageIndexes().clear();
        } else {
          collapseHistoricalAssistantResponses();
          if (wasPendingCollapsed) getCollapsedAssistantMessageIndexes().add(state.messages.length - 1);
        }
        render({ scrollToBottom: false });
        scheduleNewQuestionAtTop(state.messages.length - 2);
      }

      const aiSettings = await getEffectiveAiSettings();
      if (!usesDebugAiMode(aiSettings) && !hasConfiguredAiProvider(aiSettings)) {
        throw new Error("AI provider is not configured. Open extension Options to finish setup.");
      }

      const usedShortNames = new Set();
      const citationShortNames = askPapers.map((paper) => {
        const base = String(paper.citationShortName || createPaperCitationShortName(paper.title)).trim() || "pap";
        let name = base;
        let suffix = 2;
        while (usedShortNames.has(name.toLowerCase())) name = `${base}-${suffix++}`;
        usedShortNames.add(name.toLowerCase());
        return name;
      });
      const readAbstracts = agentReading === COMPARISON_AGENT_READING.ABSTRACT;
      const citationContexts = await Promise.all(askPapers.map(async (paper, index) => {
        const storedDocument = await getStoredDocumentByDocumentKey(paper.documentKey);
        if (!storedDocument?.markdown || !storedDocument.agentDocumentRef) {
          throw new Error(`${paper.title || `Paper ${index + 1}`} has no local agent document reference.`);
        }
        // Abstract-only reading sends a document of just the opening and Abstract.
        const document = readAbstracts ? await createAbstractAgentDocument(storedDocument) : storedDocument;
        if (!usesDebugAiMode(aiSettings)) {
          await ensureAgentDocument({
            endpoint: aiSettings.localEndpoint,
            authToken: aiSettings.localAuthToken,
            document
          });
        }
        const citationContext = createSourceSpanCitationContext({
          document,
          paperIndex: index + 1,
          title: paper.title,
          shortName: citationShortNames[index]
        });
        return {
          citationContext,
          descriptor: {
            title: paper.title || document.title || `Paper ${index + 1}`,
            documentRef: document.agentDocumentRef,
            paperId: `p${index + 1}`,
            sourceSpanCitations: citationContext.sourceSpanCitations
          }
        };
      }));

      const answer = await answerComparisonQuestion({
        aiSettings,
        question,
        papers: citationContexts.map(({ descriptor }) => descriptor),
        conversationKey: session.comparisonId
      });
      loadingRotator?.stop();
      loadingRotator = null;

      updatedSession = await appendComparisonMessage(session.comparisonId, {
        role: "assistant",
        text: answer.text,
        model: answer.model,
        citationCatalog: {
          version: 1,
          papers: citationContexts.map(({ citationContext }) => citationContext.paper)
        },
        citedDocumentKeys: askPapers.map((paper) => paper.documentKey),
        createdAt: Date.now()
      });
      if (isCurrentAsk()) {
        const wasCurrentQuestionCollapsed = getCollapsedAssistantMessageIndexes().has(state.messages.length - 1);
        state.messages = updatedSession?.messages || [];
        if (allAssistantResponsesExpanded) {
          getCollapsedAssistantMessageIndexes().clear();
        } else {
          collapseHistoricalAssistantResponses(state.messages.length - 1);
          if (wasCurrentQuestionCollapsed && state.messages.at(-1)?.role === "assistant") {
            getCollapsedAssistantMessageIndexes().add(state.messages.length - 1);
          }
        }
        state.status = "";
      }
      state.sessions = await listComparisonSessions();
      notifyComparisonActivityChanged();
    } catch (error) {
      if (isCurrentAsk()) {
        state.messages = userMessagePersisted
          ? state.messages.filter((message) => !message.pending)
          : previousMessages;
        if (allAssistantResponsesExpanded) {
          getCollapsedAssistantMessageIndexes().clear();
        } else {
          collapseHistoricalAssistantResponses();
        }
        showError?.(error.message || String(error));
      }
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

  async function refreshFromSync() {
    if (!state.active) return true;
    if (state.busy) return false;
    await flushTitleSave();
    await refreshSessions();
    if (state.activeSessionId) {
      const session = await getComparisonSession(state.activeSessionId);
      if (session) await selectSession(state.activeSessionId, { renderAfter: false });
      else {
        state.activeSessionId = "";
        state.messages = [];
        state.selectedPapers = [];
      }
    }
    render();
    onChange?.();
    return true;
  }

  function shouldIgnoreContextRefresh(context = {}) {
    return Boolean(
      state.active &&
      state.busy &&
      state.activeSessionId &&
      context.mode === "comparative-reading" &&
      context.comparisonId === state.activeSessionId
    );
  }

  function canAddPapers() {
    return state.active && !state.activeSessionId && state.selectedPapers.length < state.paperLimit;
  }

  function getSelectedDocumentKeys() {
    return state.selectedPapers.map((paper) => paper.documentKey);
  }

  function hasScrollableMessages() {
    return state.active && state.messages.length > 0;
  }

  function setPaperLimit(value) {
    state.paperLimit = normalizeComparisonPaperLimit(value);
    if (state.active) {
      render();
      onChange?.();
    }
  }

  function setSavedQaPerPaperLimit(value) {
    state.savedQaPerPaperLimit = Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : 20;
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
      titleEditable: Boolean(activeSession),
      selectedPapers: state.selectedPapers,
      messages: state.messages,
      status: state.status,
      emptySubtitle: state.draftIssue === "too-many-papers"
        ? "That's too much."
        : "More toast is needed",
      busy: state.busy,
      contextReadiness: getContextReadiness(),
      allowRemovePapers: !state.activeSessionId,
      onRemovePaper: removePaper,
      onClearPapers: clearPapers,
      onOpenPaperUrl: openPaperUrl,
      onEditUserMessage: editUserMessage,
      onToggleSaved: toggleMessageSaved,
      onSaveLimitRejected,
      onDeleteUnit: deleteMessageUnit,
      onHighlightAssistantSelection: highlightAssistantSelection,
      onCircleAssistantSelection: circleAssistantSelection,
      onHideAssistantSelection: hideAssistantSelection,
      onRemoveAssistantHighlight: removeAssistantHighlight,
      onRemoveAssistantCircle: removeAssistantCircle,
      onRemoveAssistantHiddenText: removeAssistantHiddenText,
      onNavigateCitation,
      collapsedAssistantMessageIndexes: getCollapsedAssistantMessageIndexes(),
      onAssistantResponseCollapseChange: setAssistantResponseCollapsed,
      scrollToLatest,
      scrollToBottom
    });
  }

  function handleTitleInput() {
    if (!state.active || !state.activeSessionId) {
      return;
    }

    const title = elements.documentTitle.value;
    pendingTitlesBySession.set(state.activeSessionId, title);
    state.sessions = state.sessions.map((session) => session.comparisonId === state.activeSessionId
      ? { ...session, title }
      : session);
    window.clearTimeout(titleSaveTimer);
    titleSaveTimer = window.setTimeout(() => {
      void flushTitleSave();
    }, TITLE_SAVE_DELAY_MS);
  }

  async function flushTitleSave() {
    window.clearTimeout(titleSaveTimer);
    titleSaveTimer = null;
    if (!state.active || !state.activeSessionId) {
      return;
    }

    const comparisonId = state.activeSessionId;
    const pendingTitle = pendingTitlesBySession.get(comparisonId);
    if (pendingTitle === undefined) {
      return;
    }
    let saved = null;
    try {
      saved = await setComparisonSessionTitle(comparisonId, pendingTitle);
    } catch (error) {
      onDiagnostic?.(`Could not save comparative title: ${error.message || String(error)}`);
      return;
    }
    if (saved && pendingTitlesBySession.get(comparisonId) === pendingTitle) {
      pendingTitlesBySession.delete(comparisonId);
    }
    if (!saved || !state.active || state.activeSessionId !== comparisonId) {
      return;
    }

    state.sessions = state.sessions.map((session) => session.comparisonId === comparisonId
      ? { ...session, title: saved.title }
      : session);
    elements.documentTitle.value = saved.title;
    elements.documentTitle.removeAttribute("title");
    notifyComparisonActivityChanged();
  }

  async function editUserMessage(messageIndex, nextText) {
    const index = Number(messageIndex);
    const message = state.messages[index];
    const text = String(nextText || "").trim();
    if (!state.activeSessionId || !message || message.role !== "user" || message.pending || !text) {
      return false;
    }

    const comparisonId = state.activeSessionId;
    const nextMessages = state.messages.map((candidate, candidateIndex) => candidateIndex === index ? {
      ...message,
      text
    } : { ...candidate });
    const session = await saveComparisonMessages(comparisonId, nextMessages);
    if (!state.active || state.activeSessionId !== comparisonId) {
      return true;
    }

    state.messages = session?.messages || nextMessages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return true;
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

  function getAssistantCollapseScopeKey() {
    return state.activeSessionId || "draft";
  }

  function getCollapsedAssistantMessageIndexes() {
    const key = getAssistantCollapseScopeKey();
    if (!collapsedAssistantResponsesBySession.has(key)) {
      collapsedAssistantResponsesBySession.set(key, new Set(
        state.messages
          .map((message, index) => message?.role === "assistant" && !message.pending ? index : -1)
          .filter((index) => index >= 0)
      ));
    }
    return collapsedAssistantResponsesBySession.get(key);
  }

  function resetAssistantResponsesCollapsed() {
    allAssistantResponsesExpanded = false;
    collapsedAssistantResponsesBySession.set(
      getAssistantCollapseScopeKey(),
      new Set(getAssistantMessageIndexes())
    );
  }

  function collapseHistoricalAssistantResponses(exceptMessageIndex = -1) {
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    collapsedIndexes.clear();
    getHistoricalAssistantMessageIndexes(state.messages, exceptMessageIndex)
      .forEach((index) => collapsedIndexes.add(index));
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
    elements.conversationThread.querySelectorAll(".conversation-message.assistant").forEach((element) => {
      element.classList.toggle("assistant-response-collapsed", Boolean(collapsed));
    });
    elements.conversationThread.querySelectorAll(".conversation-response-toggle").forEach((element) => {
      element.setAttribute("aria-expanded", String(!collapsed));
    });
    if (allAssistantResponsesExpanded) elements.conversationThread.scrollTop = 0;
    window.requestAnimationFrame(() => scrollToLatest?.update());
    onChange?.();
  }

  function areAllAssistantResponsesCollapsed() {
    const indexes = getAssistantMessageIndexes();
    const collapsedIndexes = getCollapsedAssistantMessageIndexes();
    return indexes.length > 0 && indexes.every((index) => collapsedIndexes.has(index));
  }

  function getAssistantMessageIndexes() {
    return state.messages
      .map((message, index) => message?.role === "assistant" ? index : -1)
      .filter((index) => index >= 0);
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

    const result = await setComparisonAnswerSaved({
      comparisonId: state.activeSessionId,
      sequence: index,
      saved: !message.isSaved,
      perPaperLimit: state.savedQaPerPaperLimit
    });
    if (result.status === "limit-reached" || result.status === "not-found") {
      return result;
    }
    const session = await getComparisonSession(state.activeSessionId);
    state.messages = session?.messages || state.messages;
    state.sessions = await listComparisonSessions();
    notifyComparisonActivityChanged();
    render({ scrollToBottom: false });
    onChange?.();
    return result;
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
    getCollapsedAssistantMessageIndexes().clear();
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
      openPaperUrlInExistingTab(url).catch((error) => {
        setStatus("Could not open paper URL.");
        onDiagnostic?.(`Could not open comparative paper URL: ${error.message || String(error)}`);
      });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function jumpToMessagePair({ userMessageIndex, assistantMessageIndex }) {
    scrollToConversationMessagePair({ userMessageIndex, assistantMessageIndex });
  }

  function resolveCitationPaper(paper) {
    const match = String(paper?.id || "").match(/^p(\d+)$/i);
    const indexedPaper = match ? state.selectedPapers[Number(match[1]) - 1] : null;
    return {
      ...(indexedPaper || {}),
      ...(paper || {}),
      documentKey: paper?.documentKey || indexedPaper?.documentKey || "",
      canonicalUrl: paper?.canonicalUrl || indexedPaper?.canonicalUrl || ""
    };
  }

  return {
    show,
    hide,
    addPaper,
    addPapers,
    ask,
    startNewSession,
    canAsk,
    isActive,
    isBusy,
    refreshFromSync,
    shouldIgnoreContextRefresh,
    canAddPapers,
    setPaperLimit,
    setSavedQaPerPaperLimit,
    getSelectedDocumentKeys,
    hasScrollableMessages,
    jumpToMessagePair,
    resolveCitationPaper,
    setAllAssistantResponsesCollapsed,
    areAllAssistantResponsesCollapsed
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
    .filter(Boolean))];
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
