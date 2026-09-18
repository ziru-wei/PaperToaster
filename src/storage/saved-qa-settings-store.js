export const SAVED_QA_SETTINGS_KEY = "savedQaSettingsV1";
export const DEFAULT_SAVED_QA_PER_PAPER_LIMIT = 20;
export const MIN_SAVED_QA_PER_PAPER_LIMIT = 1;

export async function getSavedQaSettings() {
  const data = await chrome.storage.local.get(SAVED_QA_SETTINGS_KEY);
  return normalizeSavedQaSettings(data[SAVED_QA_SETTINGS_KEY]);
}

export async function saveSavedQaSettings(settings) {
  const normalized = normalizeSavedQaSettings(settings);
  await chrome.storage.local.set({
    [SAVED_QA_SETTINGS_KEY]: normalized
  });
  return normalized;
}

export function normalizeSavedQaSettings(settings) {
  return {
    perPaperLimit: normalizeSavedQaPerPaperLimit(settings?.perPaperLimit)
  };
}

export function normalizeSavedQaPerPaperLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return DEFAULT_SAVED_QA_PER_PAPER_LIMIT;
  }
  return Math.max(MIN_SAVED_QA_PER_PAPER_LIMIT, parsed);
}
