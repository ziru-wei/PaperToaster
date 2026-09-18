import { generateLocalAgentText } from "./local-agent-client.js";
import { AI_PROVIDER_LOCAL, DEFAULT_AI_SETTINGS } from "../storage/ai-settings-store.js";

export async function answerSelectionQuestion({ aiSettings, question, selectionText = "", papers, conversationKey, signal }) {
  const provider = aiSettings?.provider || AI_PROVIDER_LOCAL;

  if (aiSettings?.debugMode) {
    signal?.throwIfAborted?.();
    return {
      text: buildDebugSelectionAnswer({ question, selectionText, papers }),
      model: "debug-placeholder",
      raw: { debugMode: true }
    };
  }

  if (provider === AI_PROVIDER_LOCAL) {
    return generateLocalAgentText({
      endpoint: aiSettings.localEndpoint,
      authToken: aiSettings.localAuthToken,
      localAgentProfile: aiSettings.localAgentProfile,
      model: aiSettings.model,
      reasoningEffort: aiSettings.reasoningEffort,
      systemPrompt: aiSettings.systemPrompt || DEFAULT_AI_SETTINGS.systemPrompt,
      mode: "single-paper",
      question,
      selectionText,
      papers,
      conversationKey,
      signal
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

function buildDebugSelectionAnswer({ question, selectionText, papers }) {
  return [
    "Debug response only. No AI request was sent.",
    "",
    `Paper: ${papers?.[0]?.title || "Untitled paper"}`,
    `Selection characters: ${String(selectionText || "").length}`,
    `Question: ${compactPreview(question, 180) || "(empty)"}`,
    "",
    `Managed document reference: ${papers?.[0]?.documentRef || "unavailable"}.`
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
