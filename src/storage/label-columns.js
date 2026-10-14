// Label columns: any number of named, multi-select label properties.
//
// The column list and each label's color are a synced setting. A paper keeps
// its labels as `labels: { [columnId]: string[] }`. The original "Label"
// column also mirrors its first label into `paper.group`, which older code
// (archive lifecycle, mentions, table export) still reads.

export const LABEL_COLUMNS_STORAGE_KEY = "paperLabelColumnsV1";
export const DEFAULT_LABEL_COLUMN_ID = "label";
export const LABEL_TONE_COUNT = 10;
const MAX_LABEL_CHARS = 64;
const MAX_COLUMN_NAME_CHARS = 40;

export function normalizeLabelName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, MAX_LABEL_CHARS);
}

export function normalizeLabelList(values) {
  const seen = new Set();
  const labels = [];
  for (const value of Array.isArray(values) ? values : [values]) {
    const name = normalizeLabelName(value);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    labels.push(name);
  }
  return labels;
}

export function normalizeLabelColumns(value) {
  const columns = [];
  const seen = new Set();
  for (const column of Array.isArray(value?.columns) ? value.columns : []) {
    const id = String(column?.id || "").trim();
    if (!/^[a-z][\w-]{0,40}$/i.test(id) || seen.has(id)) continue;
    seen.add(id);
    columns.push({ id, name: normalizeColumnName(column.name) || "Labels" });
  }
  if (!seen.has(DEFAULT_LABEL_COLUMN_ID)) {
    columns.unshift({ id: DEFAULT_LABEL_COLUMN_ID, name: "Label" });
  }
  const colors = {};
  for (const [columnId, map] of Object.entries(value?.colors || {})) {
    if (!seen.has(columnId) && columnId !== DEFAULT_LABEL_COLUMN_ID) continue;
    colors[columnId] = {};
    for (const [label, tone] of Object.entries(map || {})) {
      if (isLabelTone(tone)) colors[columnId][normalizeLabelName(label).toLowerCase()] = tone;
    }
  }
  return { columns, colors };
}

export function normalizeColumnName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, MAX_COLUMN_NAME_CHARS);
}

export function createLabelColumnId() {
  return `labels-${crypto.randomUUID().slice(0, 8)}`;
}

// Tones by hue, red to purple: red, orange, tan, yellow, lime, green, teal,
// blue, purple, pink (pink sits past purple, on the way back to red).
const LABEL_TONE_HUE_ORDER = [7, 1, 8, 3, 9, 2, 6, 5, 0, 4];

export function getLabelToneHueRank(tone) {
  const rank = LABEL_TONE_HUE_ORDER.indexOf(tone);
  return rank < 0 ? null : rank;
}

export function isLabelTone(value) {
  return Number.isInteger(value) && value >= 0 && value < LABEL_TONE_COUNT;
}

// A paper's labels in one column, oldest first.
export function getPaperLabels(paper, columnId = DEFAULT_LABEL_COLUMN_ID) {
  const stored = paper?.labels?.[columnId];
  if (Array.isArray(stored)) return normalizeLabelList(stored);
  return columnId === DEFAULT_LABEL_COLUMN_ID ? normalizeLabelList(paper?.group || []) : [];
}

// A copy of the paper record with one column's labels replaced.
export function withPaperLabels(paper, columnId, labels) {
  const next = normalizeLabelList(labels);
  const record = { ...paper, labels: { ...(paper?.labels || {}), [columnId]: next } };
  if (columnId === DEFAULT_LABEL_COLUMN_ID) {
    record.group = next[0] || "";
    record.groupTone = null;
    record.labelState = "live";
  }
  return record;
}

// A label's color: its saved color, else the tone an older paper stored for
// it, else a stable color from its name.
export function getLabelTone(settings, columnId, label, legacyTone = null) {
  const saved = settings?.colors?.[columnId]?.[normalizeLabelName(label).toLowerCase()];
  if (isLabelTone(saved)) return saved;
  if (isLabelTone(Number(legacyTone)) && legacyTone !== null && legacyTone !== "") return Number(legacyTone);
  return getStableLabelTone(label);
}

// The color for a new label: the first one its column does not use yet; once
// every color is taken they repeat.
export function pickNewLabelTone(settings, columnId, existingLabels = []) {
  const used = new Set([
    ...existingLabels.map((label) => getLabelTone(settings, columnId, label)),
    ...Object.values(settings?.colors?.[columnId] || {})
  ]);
  for (let tone = 0; tone < LABEL_TONE_COUNT; tone += 1) {
    if (!used.has(tone)) return tone;
  }
  return existingLabels.length % LABEL_TONE_COUNT;
}

// Saves a color for each label that has none yet and is new to its column.
export function withTonesForNewLabels(settings, columnId, labels, existingLabels = []) {
  let next = settings;
  const existing = [...existingLabels];
  for (const label of normalizeLabelList(labels)) {
    const key = label.toLowerCase();
    if (isLabelTone(next.colors?.[columnId]?.[key])) continue;
    if (!existing.some((name) => name.toLowerCase() === key)) {
      next = withLabelTone(next, columnId, label, pickNewLabelTone(next, columnId, existing));
    }
    existing.push(label);
  }
  return next;
}

export function getStableLabelTone(label) {
  const text = normalizeLabelName(label).toLowerCase();
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % LABEL_TONE_COUNT;
}

export function withLabelTone(settings, columnId, label, tone) {
  const key = normalizeLabelName(label).toLowerCase();
  if (!key || !isLabelTone(tone)) return settings;
  return {
    ...settings,
    colors: { ...settings.colors, [columnId]: { ...(settings.colors?.[columnId] || {}), [key]: tone } }
  };
}

export function withoutLabelTone(settings, columnId, label) {
  const key = normalizeLabelName(label).toLowerCase();
  const columnColors = { ...(settings.colors?.[columnId] || {}) };
  delete columnColors[key];
  return { ...settings, colors: { ...settings.colors, [columnId]: columnColors } };
}

export async function readLabelColumns() {
  const stored = await chrome.storage.local.get(LABEL_COLUMNS_STORAGE_KEY);
  return normalizeLabelColumns(stored[LABEL_COLUMNS_STORAGE_KEY]);
}

export async function writeLabelColumns(settings) {
  const normalized = normalizeLabelColumns(settings);
  await chrome.storage.local.set({ [LABEL_COLUMNS_STORAGE_KEY]: normalized });
  return normalized;
}
