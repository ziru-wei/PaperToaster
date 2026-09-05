import {
  createStoredChatThread,
  deleteStoredChatThread,
  getStoredChatThread,
  listStoredChatThreads,
  saveStoredChatThread,
  setActiveStoredChatThread
} from "../storage/chat-store.js";
import {
  collapseOpenConversationSelections,
  renderConversationMessages,
  toggleConversationSelection
} from "./conversation-message-renderer.js";
import { createScrollToLatestController } from "./scroll-to-latest-controller.js";
import { createThreadWheelController } from "./thread-wheel-controller.js";

export function createConversationPanelController({
  threadElement,
  threadArchiveButton,
  threadWheelElement,
  scrollToBottomButton,
  onDiagnostic,
  onChange
}) {
  let messages = [];
  let threadUrl = "";
  let activeThreadId = "";
  let threadSummaries = [];
  let saveTimer = null;
  let documentRequestId = 0;

  const scrollToLatest = createScrollToLatestController({
    threadElement,
    buttonElement: scrollToBottomButton,
    hasMessages: () => messages.length > 0
  });
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

  async function setDocumentUrl(url) {
    const requestId = ++documentRequestId;
    const nextUrl = String(url || "");
    if (threadUrl === nextUrl) {
      return;
    }

    await persist();
    if (requestId !== documentRequestId) {
      return;
    }

    threadUrl = nextUrl;

    if (!threadUrl) {
      messages = [];
      activeThreadId = "";
      threadSummaries = [];
      threadWheel.close();
      render();
      scrollToLatest.update();
      renderThreadList();
      onChange?.();
      return;
    }

    const thread = await getStoredChatThread(threadUrl);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
    await refreshThreadList(requestId);
    if (requestId !== documentRequestId) {
      return;
    }

    render();
    scrollToLatest.update();
    onChange?.();
  }

  function appendMessage(message) {
    const text = String(message?.text || "").trim();
    if (!text) {
      return;
    }

    messages.push({
      role: message.role === "assistant" ? "assistant" : "user",
      text,
      selectionText: String(message.selectionText || "").trim(),
      createdAt: Number(message.createdAt) || Date.now()
    });
    render();
    queueSave();
    onChange?.();
  }

  function getMessages() {
    return messages.map((message) => ({ ...message }));
  }

  async function createThread() {
    if (!threadUrl) {
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
    render();
    onChange?.();
  }

  async function selectThread(threadId) {
    if (!threadUrl || !threadId || threadId === activeThreadId) {
      return;
    }

    await persist();
    const requestId = documentRequestId;
    const thread = await setActiveStoredChatThread(threadUrl, threadId);
    if (requestId !== documentRequestId) {
      return;
    }

    applyThread(thread);
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
      messages
    });
    activeThreadId = savedThread.threadId || activeThreadId;
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

  function render() {
    renderConversationMessages(threadElement, messages);
    scrollToLatest.scrollToBottom();
    window.requestAnimationFrame(scrollToLatest.update);
  }

  function renderThreadList() {
    threadWheel.render();
  }

  return {
    setDocumentUrl,
    appendMessage,
    getMessages,
    persist,
    createThread,
    selectThread,
    deleteThread
  };
}
