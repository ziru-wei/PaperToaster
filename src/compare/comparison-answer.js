import { generateLocalAgentText } from "../ai/local-agent-client.js";
import { AI_PROVIDER_LOCAL, DEFAULT_AI_SETTINGS } from "../storage/ai-settings-store.js";

export async function answerComparisonQuestion({
  aiSettings,
  question,
  papers,
  signal
}) {
  const provider = aiSettings?.provider || AI_PROVIDER_LOCAL;

  if (aiSettings?.debugMode) {
    signal?.throwIfAborted?.();
    return {
      text: buildDebugComparisonAnswer({ question, papers }),
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
      mode: "comparative-reading",
      question,
      papers,
      signal
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

function buildDebugComparisonAnswer({ question, papers = [] }) {
  return [
    "Debug comparative response only. No AI request was sent.",
    "",
    `Question: ${question || "(empty)"}`,
    `Papers: ${papers.map((paper) => paper.title).join("; ")}`,
    `Managed documents: ${papers.length}`
  ].join("\n");
}
