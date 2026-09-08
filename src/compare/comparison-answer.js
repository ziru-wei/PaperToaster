import { generateLocalAgentText } from "../ai/local-agent-client.js";
import { AI_PROVIDER_LOCAL, DEFAULT_AI_SETTINGS } from "../storage/ai-settings-store.js";
import { buildComparisonPrompt } from "./comparison-prompt.js";

export async function answerComparisonQuestion({
  aiSettings,
  contextPack,
  conversationMessages = [],
  signal
}) {
  const provider = aiSettings?.provider || AI_PROVIDER_LOCAL;
  const prompt = buildComparisonPrompt({
    contextPack,
    systemPrompt: aiSettings?.systemPrompt || DEFAULT_AI_SETTINGS.systemPrompt,
    conversationMessages
  });

  if (aiSettings?.debugMode) {
    signal?.throwIfAborted?.();
    return {
      text: buildDebugComparisonAnswer({ contextPack, conversationMessages }),
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
      prompt,
      systemPrompt: aiSettings?.systemPrompt,
      contextPack,
      conversationMessages,
      signal
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

function buildDebugComparisonAnswer({ contextPack, conversationMessages }) {
  const papers = contextPack.papers || [];
  return [
    "Debug comparative response only. No AI request was sent.",
    "",
    `Question: ${contextPack.question || "(empty)"}`,
    `Route: ${contextPack.comparisonPlan?.intent?.id || "general_synthesis"}`,
    `Papers: ${papers.map((paper) => `[${paper.label}] ${paper.title}`).join("; ")}`,
    `Evidence packets: ${papers.reduce((sum, paper) => sum + (paper.selectedEvidence?.length || 0), 0)}`,
    `Previous comparison messages: ${conversationMessages.filter((message) => message?.role && message?.text).length}`
  ].join("\n");
}
