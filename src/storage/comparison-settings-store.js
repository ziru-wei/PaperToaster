export const COMPARISON_SETTINGS_KEY = "comparisonSettingsV1";
export const MIN_COMPARISON_PAPERS = 5;
export const DEFAULT_COMPARISON_PAPER_LIMIT = MIN_COMPARISON_PAPERS;

export async function getComparisonSettings() {
  const data = await chrome.storage.local.get(COMPARISON_SETTINGS_KEY);
  return normalizeComparisonSettings(data[COMPARISON_SETTINGS_KEY]);
}

export async function saveComparisonSettings(settings) {
  const normalized = normalizeComparisonSettings(settings);
  await chrome.storage.local.set({
    [COMPARISON_SETTINGS_KEY]: normalized
  });
  return normalized;
}

export function normalizeComparisonSettings(settings) {
  return {
    paperLimit: normalizeComparisonPaperLimit(settings?.paperLimit)
  };
}

export function normalizeComparisonPaperLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_COMPARISON_PAPER_LIMIT;
  }

  return Math.max(MIN_COMPARISON_PAPERS, Math.floor(parsed));
}
