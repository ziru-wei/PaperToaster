import { generateGeminiText } from "./gemini-client.js";
import { generateLocalAgentText } from "./local-agent-client.js";
import { formatSelectionContextForPrompt, getPaperReadingPolicyPrompt } from "./selection-prompt.js";
import {
  AI_PROVIDER_GEMINI,
  AI_PROVIDER_LOCAL,
  DEFAULT_AI_SETTINGS
} from "../storage/ai-settings-store.js";

export async function answerSelectionQuestion({ aiSettings, contextPack, conversationMessages = [], signal }) {
  const provider = aiSettings?.provider || AI_PROVIDER_GEMINI;
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

  if (provider === AI_PROVIDER_GEMINI) {
    return generateGeminiText({
      apiKey: aiSettings.apiKey,
      model: aiSettings.model,
      prompt,
      signal
    });
  }

  if (provider === AI_PROVIDER_LOCAL) {
    return generateLocalAgentText({
      endpoint: aiSettings.localEndpoint,
      authToken: aiSettings.localAuthToken,
      model: aiSettings.model,
      prompt,
      systemPrompt: aiSettings?.systemPrompt,
      contextPack,
      conversationMessages,
      signal
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

export function buildSelectionQuestionPrompt({ contextPack, systemPrompt, conversationMessages = [] }) {
  const normalizedSystemPrompt = String(systemPrompt || "").trim();
  return [
    normalizedSystemPrompt || DEFAULT_AI_SETTINGS.systemPrompt,
    "",
    getPaperReadingPolicyPrompt(),
    "",
    "Previous conversation in this thread:",
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
