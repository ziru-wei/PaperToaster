import {
  createStoredChatThread,
  deleteStoredChatThread,
  getStoredChatThread,
  listStoredChatThreads,
  saveStoredChatThread,
  setActiveStoredChatThread
} from "../storage/chat-store.js";

export function createConversationPanelController({
  threadElement,
  threadBarElement,
  threadScrollerElement,
  newThreadButton,
  onDiagnostic,
  onChange
}) {
  let messages = [];
  let currentSelectionText = "";
  let threadUrl = "";
  let activeThreadId = "";
  let threadSummaries = [];
  let saveTimer = null;
  let documentRequestId = 0;

  newThreadButton.addEventListener("click", () => {
    createThread().catch(reportError);
  });
  threadScrollerElement.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-thread-id]");
    if (deleteButton) {
      const threadId = deleteButton.dataset.deleteThreadId;
      const label = deleteButton.closest(".thread-chip")?.querySelector(".thread-select")?.textContent || "this thread";
      if (window.confirm(`Delete ${label}?`)) {
        deleteThread(threadId).catch(reportError);
      }
      return;
    }

    const selectButton = event.target.closest("[data-select-thread-id]");
    if (selectButton) {
      selectThread(selectButton.dataset.selectThreadId).catch(reportError);
    }
  });
  threadElement.addEventListener("click", (event) => {
    const quote = event.target.closest(".conversation-selection");
    if (quote) {
      toggleConversationSelection(quote);
    }
  });
  threadElement.addEventListener("keydown", (event) => {
    const quote = event.target.closest(".conversation-selection");
    if (!quote || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    toggleConversationSelection(quote);
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
      currentSelectionText = "";
      activeThreadId = "";
      threadSummaries = [];
      render();
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

  function getCurrentSelectionText() {
    return currentSelectionText;
  }

  function setCurrentSelectionText(selectionText) {
    currentSelectionText = String(selectionText || "").trim();
    queueSave();
    onChange?.();
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
    if (!threadUrl || (!activeThreadId && !messages.length && !currentSelectionText)) {
      return;
    }

    window.clearTimeout(saveTimer);
    const savedThread = await saveStoredChatThread(threadUrl, {
      threadId: activeThreadId,
      url: threadUrl,
      currentThreadSelectionText: currentSelectionText,
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
    currentSelectionText = thread.currentThreadSelectionText || "";
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
    threadElement.textContent = "";
    threadElement.hidden = !messages.length;

    for (const message of messages) {
      const item = document.createElement("article");
      item.className = `conversation-message ${message.role}`;

      const text = document.createElement("div");
      text.className = "conversation-text";
      text.textContent = message.text;

      if (message.role === "user" && message.selectionText) {
        const quote = document.createElement("blockquote");
        quote.className = "conversation-selection";
        quote.tabIndex = 0;
        quote.title = "Click to scroll selected text";
        quote.textContent = message.selectionText;
        item.append(quote);
      }

      item.append(text);
      threadElement.append(item);
    }

    threadElement.scrollTop = threadElement.scrollHeight;
  }

  function renderThreadList() {
    threadBarElement.hidden = !threadUrl;
    newThreadButton.disabled = !threadUrl;
    threadScrollerElement.textContent = "";

    for (const thread of threadSummaries) {
      const item = document.createElement("div");
      item.className = `thread-chip${thread.threadId === activeThreadId ? " active" : ""}`;

      const selectButton = document.createElement("button");
      selectButton.className = "thread-select";
      selectButton.type = "button";
      selectButton.dataset.selectThreadId = thread.threadId;
      selectButton.title = formatThreadTitle(thread);
      selectButton.textContent = formatThreadLabel(thread);

      const deleteButton = document.createElement("button");
      deleteButton.className = "thread-delete";
      deleteButton.type = "button";
      deleteButton.dataset.deleteThreadId = thread.threadId;
      deleteButton.title = "Delete conversation";
      deleteButton.setAttribute("aria-label", `Delete ${formatThreadLabel(thread)}`);
      deleteButton.textContent = "×";

      item.append(selectButton, deleteButton);
      threadScrollerElement.append(item);
    }
  }

  function reportError(error) {
    onDiagnostic?.(`Conversation thread action failed: ${error.message || String(error)}`);
  }

  function toggleConversationSelection(quote) {
    quote.classList.toggle("scrollable");
    if (!quote.classList.contains("scrollable")) {
      quote.scrollTop = 0;
    }
  }

  return {
    setDocumentUrl,
    appendMessage,
    getMessages,
    getCurrentSelectionText,
    setCurrentSelectionText,
    persist,
    createThread,
    selectThread,
    deleteThread
  };
}

function formatThreadLabel(thread) {
  if (!thread?.messageCount) {
    return "New thread";
  }

  return formatThreadTime(thread.firstMessageCreatedAt || thread.createdAt || thread.updatedAt);
}

function formatThreadTitle(thread) {
  const count = thread?.messageCount || 0;
  const messageLabel = count === 1 ? "1 message" : `${count} messages`;
  return `${formatThreadLabel(thread)} · ${messageLabel}`;
}

function formatThreadTime(timestamp) {
  const date = new Date(Number(timestamp));
  if (!Number.isFinite(date.getTime())) {
    return "Thread";
  }

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  }).format(date);
}
