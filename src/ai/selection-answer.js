import { generateGeminiText } from "./gemini-client.js";
import { formatSelectionContextForPrompt } from "./selection-prompt.js";

export async function answerSelectionQuestion({ aiSettings, contextPack, conversationMessages = [], signal }) {
  const provider = aiSettings?.provider || "gemini";
  const prompt = buildSelectionQuestionPrompt({
    contextPack,
    systemPrompt: aiSettings?.systemPrompt,
    conversationMessages
  });

  if (aiSettings?.debugMode) {
    signal?.throwIfAborted?.();
    return {
      text: buildDebugSelectionAnswer({ contextPack, conversationMessages }),
      model: "debug-placeholder",
      raw: { debugMode: true }
    };
  }

  if (provider === "gemini") {
    return generateGeminiText({
      apiKey: aiSettings.apiKey,
      model: aiSettings.model,
      prompt,
      signal
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

export function buildSelectionQuestionPrompt({ contextPack, systemPrompt, conversationMessages = [] }) {
  const normalizedSystemPrompt = String(systemPrompt || "").trim();
  return [
    normalizedSystemPrompt || "You are helping a researcher read an academic paper. Answer using only the provided selected text and paper context.",
    "",
    "Previous conversation in this selected-text thread:",
    formatConversationMessages(conversationMessages),
    "",
    formatSelectionContextForPrompt(contextPack)
  ].join("\n");
}

function formatConversationMessages(messages) {
  const visibleMessages = messages
    .filter((message) => message?.role && message?.text)
    .slice(-8);

  if (!visibleMessages.length) {
    return "(No previous messages.)";
  }

  return visibleMessages
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.text}`)
    .join("\n\n");
}

function buildDebugSelectionAnswer({ contextPack, conversationMessages }) {
  const title = contextPack?.paper?.title || "Untitled paper";
  const question = compactPreview(contextPack?.question || "", 180);
  const selection = compactPreview(contextPack?.selection?.text || "", 260);
  const localCount = contextPack?.context?.local?.length || 0;
  const retrievedCount = contextPack?.context?.retrieved?.length || 0;
  const previousCount = conversationMessages.filter((message) => message?.role && message?.text).length;
  const pageLabel = contextPack?.selection?.anchor?.pageStart
    ? `page ${contextPack.selection.anchor.pageStart}`
    : "page not located";

  return [
    "Debug response only. No AI request was sent.",
    "",
    `Paper: ${title}`,
    `Selection: "${selection || "(empty)"}"`,
    `Question: ${question || "(empty)"}`,
    "",
    `Context check: selection ${pageLabel}; nearby chunks ${localCount}; retrieved chunks ${retrievedCount}; previous thread messages ${previousCount}.`
  ].join("\n");
}

function compactPreview(value, maxLength) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}
