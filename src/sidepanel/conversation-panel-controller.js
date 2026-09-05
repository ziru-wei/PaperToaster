import {
  createStoredChatThread,
  deleteStoredChatThread,
  getStoredChatThread,
  listStoredChatThreads,
  saveStoredChatThread,
  setActiveStoredChatThread
} from "../storage/chat-store.js";

const THREAD_WHEEL_VISIBLE_COUNT = 5;
const THREAD_WHEEL_ANGLE_STEP = 10;
const THREAD_WHEEL_EASING = 0.32;
const THREAD_WHEEL_SCROLL_PIXELS_PER_SLOT = 72;

export function createConversationPanelController({
  threadElement,
  threadBarElement,
  threadArchiveButton,
  threadWheelElement,
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
  let threadWheelOpen = false;
  let threadWheelScroll = 0;
  let threadWheelTargetScroll = 0;
  let threadWheelAnimationFrame = 0;

  newThreadButton.addEventListener("click", () => {
    createThread().catch(reportError);
  });
  threadArchiveButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleThreadWheel();
  });
  threadWheelElement.addEventListener("click", (event) => {
    event.stopPropagation();
    const deleteButton = event.target.closest("[data-delete-thread-id]");
    if (deleteButton) {
      const threadId = deleteButton.dataset.deleteThreadId;
      const label = deleteButton.closest(".thread-wheel-item")?.querySelector(".thread-select")?.textContent || "this thread";
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
  document.addEventListener("wheel", handleThreadWheel, { passive: false });
  document.addEventListener("click", (event) => {
    if (!threadBarElement.contains(event.target)) {
      closeThreadWheel();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeThreadWheel();
    }
  });
  window.addEventListener("blur", closeThreadWheel);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      closeThreadWheel();
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
      closeThreadWheel();
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
    closeThreadWheel();
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
    closeThreadWheel();
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
    closeThreadWheel();
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
    clampThreadWheelScroll();
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
    const wheelThreads = getWheelThreads();
    threadBarElement.hidden = !threadUrl;
    newThreadButton.disabled = !threadUrl;
    threadArchiveButton.disabled = !threadUrl || !wheelThreads.length;
    threadArchiveButton.classList.toggle("active", threadWheelOpen && wheelThreads.length > 0);
    threadWheelElement.hidden = !threadWheelOpen || !wheelThreads.length;
    document.body.classList.toggle("thread-wheel-open", threadWheelOpen && wheelThreads.length > 0);

    if (!threadWheelOpen || !wheelThreads.length) {
      threadWheelElement.textContent = "";
      return;
    }

    clampThreadWheelScroll();
    const existingItems = new Map(Array.from(threadWheelElement.querySelectorAll(".thread-wheel-item"), (item) => [
      item.dataset.threadId,
      item
    ]));
    const renderedThreadIds = new Set();
    wheelThreads.forEach((thread) => {
      renderedThreadIds.add(thread.threadId);
      const item = existingItems.get(thread.threadId) || document.createElement("div");
      item.className = "thread-wheel-item";
      item.dataset.threadId = thread.threadId;
      item.classList.toggle("current", thread.threadId === activeThreadId);

      const selectButton = item.querySelector(".thread-select") || document.createElement("button");
      selectButton.className = "thread-chip thread-select";
      selectButton.type = "button";
      selectButton.dataset.selectThreadId = thread.threadId;
      selectButton.removeAttribute("title");
      selectButton.setAttribute("aria-label", formatThreadTitle(thread));
      renderThreadLabel(selectButton, thread);

      const deleteButton = item.querySelector(".thread-delete") || document.createElement("button");
      deleteButton.className = "thread-delete";
      deleteButton.type = "button";
      deleteButton.dataset.deleteThreadId = thread.threadId;
      deleteButton.title = "Delete conversation";
      deleteButton.setAttribute("aria-label", `Delete ${formatThreadLabel(thread)}`);
      deleteButton.textContent = "×";

      if (!item.isConnected) {
        item.append(deleteButton, selectButton);
        threadWheelElement.append(item);
      }
    });

    for (const item of Array.from(threadWheelElement.querySelectorAll(".thread-wheel-item"))) {
      if (!renderedThreadIds.has(item.dataset.threadId)) {
        item.remove();
      }
    }

    updateThreadWheelPositions(wheelThreads);
  }

  function getWheelThreads() {
    return [...threadSummaries]
      .sort((first, second) => getThreadLabelTime(second) - getThreadLabelTime(first));
  }

  function toggleThreadWheel() {
    if (!threadUrl || !getWheelThreads().length) {
      closeThreadWheel();
      return;
    }

    threadWheelOpen = !threadWheelOpen;
    clampThreadWheelScroll();
    renderThreadList();
    startThreadWheelAnimation();
  }

  function closeThreadWheel() {
    if (!threadWheelOpen && threadWheelElement.hidden) {
      return;
    }

    threadWheelOpen = false;
    renderThreadList();
  }

  function setThreadWheelTargetScroll(offset) {
    const maxOffset = Math.max(0, getWheelThreads().length - THREAD_WHEEL_VISIBLE_COUNT);
    threadWheelTargetScroll = Math.min(Math.max(0, offset), maxOffset);
    startThreadWheelAnimation();
  }

  function clampThreadWheelScroll() {
    const maxOffset = Math.max(0, getWheelThreads().length - THREAD_WHEEL_VISIBLE_COUNT);
    threadWheelScroll = Math.min(Math.max(0, threadWheelScroll), maxOffset);
    threadWheelTargetScroll = Math.min(Math.max(0, threadWheelTargetScroll), maxOffset);
  }

  function startThreadWheelAnimation() {
    if (threadWheelAnimationFrame) {
      return;
    }

    threadWheelAnimationFrame = window.requestAnimationFrame(animateThreadWheel);
  }

  function animateThreadWheel() {
    threadWheelAnimationFrame = 0;
    const wheelThreads = getWheelThreads();
    const difference = threadWheelTargetScroll - threadWheelScroll;
    if (Math.abs(difference) < 0.002) {
      threadWheelScroll = threadWheelTargetScroll;
      updateThreadWheelPositions(wheelThreads);
      return;
    }

    threadWheelScroll += difference * THREAD_WHEEL_EASING;
    updateThreadWheelPositions(wheelThreads);
    startThreadWheelAnimation();
  }

  function updateThreadWheelPositions(wheelThreads = getWheelThreads()) {
    const items = new Map(Array.from(threadWheelElement.querySelectorAll(".thread-wheel-item"), (item) => [
      item.dataset.threadId,
      item
    ]));
    for (const [index, thread] of wheelThreads.entries()) {
      const item = items.get(thread.threadId);
      if (!item) {
        continue;
      }

      const position = index - threadWheelScroll;
      const opacity = getThreadWheelOpacity(position);
      const isSelectable = position >= -0.05 && position < THREAD_WHEEL_VISIBLE_COUNT - 0.05;
      item.classList.toggle("visible", isSelectable);
      item.style.setProperty("--thread-wheel-angle", `${position * -THREAD_WHEEL_ANGLE_STEP}deg`);
      item.style.setProperty("--thread-wheel-opacity", String(opacity));
      item.style.zIndex = String(100 - Math.round(Math.abs(position) * 10));
    }
  }

  function reportError(error) {
    onDiagnostic?.(`Conversation thread action failed: ${error.message || String(error)}`);
  }

  function handleThreadWheel(event) {
    const wheelThreads = getWheelThreads();
    const maxOffset = Math.max(0, wheelThreads.length - THREAD_WHEEL_VISIBLE_COUNT);
    if (!threadWheelOpen || maxOffset <= 0) {
      return;
    }

    event.preventDefault();
    setThreadWheelTargetScroll(threadWheelTargetScroll + event.deltaY / THREAD_WHEEL_SCROLL_PIXELS_PER_SLOT);
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

  const parts = formatThreadTimeParts(getThreadLabelTime(thread));
  if (!parts) {
    return "Thread";
  }

  return `${parts.date}  ${parts.time}`;
}

function formatThreadTitle(thread) {
  const count = thread?.messageCount || 0;
  const messageLabel = count === 1 ? "1 message" : `${count} messages`;
  return `${formatThreadLabel(thread)} · ${messageLabel}`;
}

function renderThreadLabel(element, thread) {
  element.textContent = "";
  const count = Number(thread?.messageCount) || 0;
  if (!thread?.messageCount) {
    renderThreadDateLabel(element, "New thread", count);
    return;
  }

  const parts = formatThreadTimeParts(getThreadLabelTime(thread));
  if (!parts) {
    renderThreadDateLabel(element, "Thread", count);
    return;
  }

  const main = document.createElement("span");
  main.className = "thread-label-main";

  const date = document.createElement("span");
  date.className = "thread-label-date";
  date.textContent = parts.date;

  const time = document.createElement("span");
  time.className = "thread-label-time";
  time.textContent = parts.time;

  main.append(date, time);
  element.append(main, createThreadCountLabel(count));
}

function renderThreadDateLabel(element, text, count) {
  const main = document.createElement("span");
  main.className = "thread-label-main";

  const date = document.createElement("span");
  date.className = "thread-label-date";
  date.textContent = text;

  main.append(date);
  element.append(main, createThreadCountLabel(count));
}

function createThreadCountLabel(count) {
  const countLabel = document.createElement("span");
  countLabel.className = "thread-label-count";
  countLabel.textContent = `#${Math.max(0, Number(count) || 0)}`;
  return countLabel;
}

function formatThreadTimeParts(timestamp) {
  const date = new Date(Number(timestamp));
  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const dateLabel = isSameDate(date, now)
    ? "Today"
    : isSameDate(date, yesterday)
      ? "Yesterday"
      : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric"
      }).format(date).replace(" ", "/");
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);

  return {
    date: dateLabel,
    time: timeLabel
  };
}

function isSameDate(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function getThreadLabelTime(thread) {
  return Number(thread?.firstMessageCreatedAt || thread?.createdAt || thread?.updatedAt) || 0;
}

function getThreadWheelOpacity(position) {
  if (position < -1 || position > THREAD_WHEEL_VISIBLE_COUNT) {
    return 0;
  }

  if (position < 0) {
    return Math.max(0, 1 + position);
  }

  if (position > THREAD_WHEEL_VISIBLE_COUNT - 1) {
    return Math.max(0, THREAD_WHEEL_VISIBLE_COUNT - position);
  }

  return 1;
}
