export const PARSING_SETTINGS_KEY = "parsingSettingsV1";

export const DEFAULT_PARSING_SETTINGS = Object.freeze({
  autoParse: true
});

export async function getParsingSettings() {
  const data = await chrome.storage.local.get(PARSING_SETTINGS_KEY);
  return normalizeParsingSettings(data[PARSING_SETTINGS_KEY]);
}

export async function saveParsingSettings(settings) {
  const normalized = normalizeParsingSettings(settings);
  await chrome.storage.local.set({
    [PARSING_SETTINGS_KEY]: normalized
  });
  return normalized;
}

export function normalizeParsingSettings(settings) {
  return {
    autoParse: settings?.autoParse !== false
  };
}
