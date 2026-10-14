export const COMPARISON_SETTINGS_KEY = "comparisonSettingsV1";
export const MIN_COMPARISON_PAPERS = 5;
export const DEFAULT_COMPARISON_PAPER_LIMIT = MIN_COMPARISON_PAPERS;

export async function getComparisonSettings() {
  const data = await chrome.storage.local.get(COMPARISON_SETTINGS_KEY);
  return normalizeComparisonSettings(data[COMPARISON_SETTINGS_KEY]);
}

export async function saveComparisonSettings(settings) {
  // A partial update (just the limit, or just the reading mode) keeps the other setting.
  const normalized = normalizeComparisonSettings({ ...(await getComparisonSettings()), ...settings });
  await chrome.storage.local.set({
    [COMPARISON_SETTINGS_KEY]: normalized
  });
  return normalized;
}

// What the agent reads from each paper when comparing: abstracts by default,
// which keeps comparisons fast; full papers when the question needs detail.
export const COMPARISON_AGENT_READING = Object.freeze({
  ABSTRACT: "abstract",
  FULL: "full"
});

export function normalizeComparisonSettings(settings) {
  return {
    paperLimit: normalizeComparisonPaperLimit(settings?.paperLimit),
    agentReading: settings?.agentReading === COMPARISON_AGENT_READING.FULL
      ? COMPARISON_AGENT_READING.FULL
      : COMPARISON_AGENT_READING.ABSTRACT
  };
}

export function normalizeComparisonPaperLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_COMPARISON_PAPER_LIMIT;
  }

  return Math.max(MIN_COMPARISON_PAPERS, Math.floor(parsed));
}
