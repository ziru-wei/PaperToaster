import { renderMarkdownInto } from "../markdown/render-markdown.js";

export function renderConversationMessages(threadElement, messages) {
  threadElement.textContent = "";
  threadElement.hidden = !messages.length;

  for (const message of messages) {
    const item = document.createElement("article");
    item.className = `conversation-message ${message.role}`;

    const text = document.createElement("div");
    text.className = "conversation-text";
    renderMessageText(text, message);

    if (message.role === "user" && message.selectionText) {
      const quote = document.createElement("blockquote");
      quote.className = "conversation-selection";
      quote.tabIndex = 0;
      quote.setAttribute("aria-label", "Selected text");
      quote.textContent = message.selectionText;
      item.append(quote);
    }

    item.append(text);
    threadElement.append(item);
  }
}

function renderMessageText(element, message) {
  if (message.role === "assistant") {
    renderMarkdownInto(element, message.text);
    return;
  }

  element.textContent = message.text;
}

export function toggleConversationSelection(threadElement, quote) {
  const shouldExpand = !quote.classList.contains("scrollable");
  collapseOpenConversationSelections(threadElement, quote);
  quote.classList.toggle("scrollable", shouldExpand);
  if (!shouldExpand) {
    quote.scrollTop = 0;
  }
}

export function collapseOpenConversationSelections(threadElement, except = null) {
  for (const quote of threadElement.querySelectorAll(".conversation-selection.scrollable")) {
    if (quote === except) {
      continue;
    }

    quote.classList.remove("scrollable");
    quote.scrollTop = 0;
  }
}
