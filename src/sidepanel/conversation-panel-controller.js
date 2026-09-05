import { getStoredChatThread, saveStoredChatThread } from "../storage/chat-store.js";

export function createConversationPanelController({ threadElement, onDiagnostic, onChange }) {
  let messages = [];
  let currentSelectionText = "";
  let threadUrl = "";
  let activeThreadId = "";
  let saveTimer = null;
  let documentRequestId = 0;

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
      render();
      onChange?.();
      return;
    }

    const thread = await getStoredChatThread(threadUrl);
    if (requestId !== documentRequestId) {
      return;
    }

    messages = thread.messages || [];
    currentSelectionText = thread.currentThreadSelectionText || "";
    activeThreadId = thread.threadId || "";
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
      selectionText: String(message.selectionText || "").trim()
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

  async function persist() {
    if (!threadUrl) {
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
      persist().catch((error) => {
        onDiagnostic?.(`Chat thread save skipped: ${error.message || String(error)}`);
      });
    }, 250);
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
        quote.textContent = message.selectionText;
        item.append(quote);
      }

      item.append(text);
      threadElement.append(item);
    }

    threadElement.scrollTop = threadElement.scrollHeight;
  }

  return {
    setDocumentUrl,
    appendMessage,
    getMessages,
    getCurrentSelectionText,
    setCurrentSelectionText,
    persist
  };
}
