import {
  deleteLibraryPaperGroup,
  getLibraryPaperSummary,
  LIBRARY_SCOPE_ARCHIVE,
  LIBRARY_SCOPE_BOARD,
  listLibraryPapers,
  deleteLibraryPaperLabel,
  renameLibraryPaperGroup,
  renameLibraryPaperLabel,
  setLibraryPaperGroup,
  setLibraryPaperLabels,
  setLibraryPaperShortNote,
  setLibraryPaperStarred
} from "../storage/library-store.js";
import { listComparisonSessions, setComparisonSessionStarred } from "../storage/comparison-store.js";
import { createDashboardBulkActions } from "./dashboard-bulk-actions.js";
import {
  isDisplayablePaper,
  renderPaperList,
  renderSortMenu as renderDashboardSortMenu,
  updateGalleryCover
} from "./dashboard-renderer.js";
import {
  PAPER_VIEW,
  PAPER_VIEW_OPTIONS,
  migrateLegacyPaperListColumns,
  LABEL_PROPERTY_PREFIX,
  PAPER_COLOR_SORT_PREFIX,
  PAPER_PROPERTY_SORT_PREFIX,
  getPaperColorSort,
  getPaperPropertySort,
  setPaperLabelColumns,
  isPaperPropertyVisible,
  normalizePaperView,
  normalizePaperViewProperties,
  openPaperPropertiesMenu
} from "./paper-properties.js";
import { createDashboardPaperPreview, listDashboardPaperPreviews } from "../storage/dashboard-preview-store.js";
import { ensurePaperFigures } from "../document/paper-figures.js";
import { ensurePaperMetadata } from "../document/paper-metadata.js";
import { MessageType } from "../shared/messages.js";
import { openPaperUrlInExistingTab } from "../browser/open-paper-tab.js";
import { normalizeDocumentUrl } from "../storage/document-key.js";
import { initializeGoogleSyncControls } from "../components/google-sync-controls.js";
import { initializeUpdateNotice } from "../components/update-notice.js";
import { initializeFigurePreview } from "./figure-preview.js";
import { importLocalPdfFile } from "../document/local-pdf-import.js";
import {
  LABEL_COLUMNS_STORAGE_KEY,
  createLabelColumnId,
  getPaperLabels,
  normalizeColumnName,
  normalizeLabelColumns,
  normalizeLabelList,
  readLabelColumns,
  withLabelTone,
  withTonesForNewLabels,
  withoutLabelTone,
  writeLabelColumns
} from "../storage/label-columns.js";

const DATE_DIRECTION_LABELS = { desc: "Newest first", asc: "Oldest first" };
const SORT_OPTIONS = [
  { id: "latestThread", label: "Latest ask", sortBy: "latestThread", sortDirection: "desc", directionLabels: DATE_DIRECTION_LABELS },
  { id: "latestAdded", label: "Latest added", sortBy: "latestAdded", sortDirection: "desc", directionLabels: DATE_DIRECTION_LABELS },
  { id: "title", label: "Title", sortBy: "title", sortDirection: "asc", directionLabels: { asc: "A → Z", desc: "Z → A" } }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const PAPER_GROUP_MODE = {
  LABEL: "label",
  RECENT_CONVERSATION: "recent-conversation",
  LATEST_ADDED: "latest-added",
  NONE: "none"
};
// Every label column can group papers ("label" is the original column,
// "label:<columnId>" the others), followed by the time groupings.
function getGroupOptions() {
  return [
    ...state.labelSettings.columns.map((column) => ({
      id: column.id === "label" ? PAPER_GROUP_MODE.LABEL : `label:${column.id}`,
      label: column.name
    })),
    ...TIME_GROUP_OPTIONS
  ];
}

const TIME_GROUP_OPTIONS = [
  { id: PAPER_GROUP_MODE.RECENT_CONVERSATION, label: "Latest ask" },
  { id: PAPER_GROUP_MODE.LATEST_ADDED, label: "Latest added" },
  { id: PAPER_GROUP_MODE.NONE, label: "No grouping" }
];
// Sort and grouping are saved per view, like Notion views.
const PAPER_VIEW_SETTINGS_STORAGE_KEY = "dashboardPaperViewSettings";
// Earlier builds shared one sort and grouping across views; only read to migrate.
const LEGACY_GROUP_MODE_STORAGE_KEY = "dashboardPaperGroupMode";
const LEGACY_SORT_STORAGE_KEY = "dashboardPaperSort";
const LEGACY_SORT_DIRECTION_STORAGE_KEY = "dashboardPaperSortDirection";
const PAPER_VIEW_STORAGE_KEY = "dashboardPaperView";
const PAPER_VIEW_PROPERTIES_STORAGE_KEY = "dashboardPaperViewProperties";
// Superseded by the view properties; only read to migrate older preferences.
const LEGACY_MESSAGE_RINGS_VISIBLE_STORAGE_KEY = "dashboardPaperMessageRingsVisible";
const LEGACY_LIST_COLUMNS_STORAGE_KEY = "dashboardPaperListColumns";
const PAPER_LABEL_GROUP_ORDER_STORAGE_KEY = "dashboardPaperLabelGroupOrder";
const DASHBOARD_FOCUS_REFRESH_DELAY_MS = 120;
const LIBRARY_VIEW = {
  BOARD: LIBRARY_SCOPE_BOARD,
  ARCHIVE: LIBRARY_SCOPE_ARCHIVE
};

const state = {
  activeDocumentKey: "",
  activeComparisonId: "",
  activeComparisonDocumentKeys: new Set(),
  comparisonMessageCountByDocumentKey: new Map(),
  hasLocalPapers: false,
  papers: [],
  comparisons: [],
  openPaperUrls: new Set(),
  sort: "latestThread",
  sortDirection: "desc",
  query: "",
  paperView: PAPER_VIEW.CARDS,
  viewProperties: normalizePaperViewProperties(),
  previews: new Map(),
  paperGroupMode: PAPER_GROUP_MODE.LABEL,
  viewSettings: {},
  boardOrganizeBy: PAPER_GROUP_MODE.LABEL,
  labelSettings: normalizeLabelColumns(),
  labelGroupOrder: [],
  manageMode: false,
  selectedDocumentKeys: new Set(),
  selectedComparisonIds: new Set(),
  libraryView: LIBRARY_VIEW.BOARD
};

let dashboardFocusRefreshTimer = 0;
let dashboardFocusRefreshPending = false;
let dashboardPointerActive = false;
let openPaperTabsRefreshTimer = 0;
let propertiesMenu = null;

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  bulkActions: document.querySelector("#bulkActions"),
  selectionSummary: document.querySelector("#selectionSummary"),
  sendToMachineButton: document.querySelector("#sendToMachineButton"),
  sendToMachinePrompt: document.querySelector("#sendToMachinePrompt"),
  archiveSelectedPrompt: document.querySelector("#archiveSelectedPrompt"),
  exportSelectedPrompt: document.querySelector("#exportSelectedPrompt"),
  restoreSelectedButton: document.querySelector("#restoreSelectedButton"),
  exportSelectedButton: document.querySelector("#exportSelectedButton"),
  deleteSelectedPrompt: document.querySelector("#deleteSelectedPrompt"),
  sortButton: document.querySelector("#paperSortButton"),
  sortMenu: document.querySelector("#paperSortMenu"),
  paperViewSwitch: document.querySelector("#paperViewSwitch"),
  groupButton: document.querySelector("#paperGroupButton"),
  groupMenu: document.querySelector("#paperGroupMenu"),
  propertiesButton: document.querySelector("#paperPropertiesButton"),
  importPdfButton: document.querySelector("#importPdfButton"),
  importPdfInput: document.querySelector("#importPdfInput"),
  viewSwitch: document.querySelector("#libraryViewSwitch"),
  paperList: document.querySelector("#paperList"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateMessage: document.querySelector("#emptyStateMessage"),
  multiSelectKeyboardPrompt: document.querySelector("#multiSelectKeyboardPrompt")
};

const bulkActions = createDashboardBulkActions({
  state,
  elements,
  onSendToMachine: sendSelectedPapersToMachine,
  onDeleteComplete: handlePapersDeleted,
  onRenderRequested: renderDashboard
});
initializeGoogleSyncControls();
initializeUpdateNotice();
initializeFigurePreview();

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  refreshRecords();
});

elements.viewSwitch.addEventListener("click", async () => {
  state.libraryView = state.libraryView === LIBRARY_VIEW.BOARD
    ? LIBRARY_VIEW.ARCHIVE
    : LIBRARY_VIEW.BOARD;
  bulkActions.clearSelection();
  setSortMenuOpen(false);
  state.activeDocumentKey = "";
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
  renderViewControls();
  await refreshRecords();
});

// Like Notion, a click on empty space ends the current multi-selection, or
// deactivates the paper or comparison open in the side panel.
document.addEventListener("click", (event) => {
  if (event.defaultPrevented) {
    return;
  }
  if (state.manageMode) {
    if (!isSelectionPreservingTarget(event.target)) bulkActions.clearSelection();
    return;
  }
  if ((state.activeDocumentKey || state.activeComparisonId) && !isContextPreservingTarget(event.target)) {
    clearDashboardContext()
      .then(renderDashboard)
      .catch((error) => {
        console.debug("[PDF AI] Could not clear dashboard context", error);
      });
  }
});

// Records, controls and open menus keep the active paper; any other click releases it.
function isContextPreservingTarget(target) {
  return Boolean(target?.closest?.([
    ".paper-card",
    ".paper-list-row",
    ".paper-list-header",
    ".comparison-record-card",
    ".click-menu",
    ".paper-group-editor",
    ".update-notice",
    "dialog",
    "button",
    "a",
    "input",
    "textarea"
  ].join(", ")));
}

function isSelectionPreservingTarget(target) {
  return Boolean(target?.closest?.([
    ".paper-card",
    ".paper-list-row",
    ".comparison-record-card",
    ".paper-list-header",
    ".bulk-actions",
    ".dashboard-header",
    ".click-menu",
    ".paper-group-editor",
    "button",
    "a",
    "input",
    "textarea"
  ].join(", ")));
}

elements.sortButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setGroupMenuOpen(false);
  setSortMenuOpen(elements.sortMenu.hidden);
});

elements.groupButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setSortMenuOpen(false);
  setGroupMenuOpen(elements.groupMenu.hidden);
});

elements.propertiesButton.addEventListener("click", () => {
  if (propertiesMenu?.isOpen()) {
    propertiesMenu.close();
    return;
  }
  setSortMenuOpen(false);
  setGroupMenuOpen(false);
  propertiesMenu = openPaperPropertiesMenu({
    anchor: elements.propertiesButton,
    view: state.paperView,
    libraryView: state.libraryView,
    properties: state.viewProperties[state.paperView],
    onChange: updateViewProperties,
    onAddLabelColumn: (name, view) => addLabelColumn(name, { view })
  });
});

bulkActions.attachEventListeners();

// Local PDFs are copied into the library (and synced), never linked by path.
elements.importPdfButton.addEventListener("click", () => elements.importPdfInput.click());
elements.importPdfInput.addEventListener("change", () => {
  const files = [...elements.importPdfInput.files];
  elements.importPdfInput.value = "";
  void importPdfFiles(files);
});

let pdfDragDepth = 0;
const isFileDrag = (event) => [...(event.dataTransfer?.types || [])].includes("Files");
document.addEventListener("dragenter", (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  pdfDragDepth += 1;
  document.body.classList.add("pdf-drop-active");
});
document.addEventListener("dragover", (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});
document.addEventListener("dragleave", (event) => {
  if (!isFileDrag(event)) return;
  pdfDragDepth = Math.max(0, pdfDragDepth - 1);
  if (!pdfDragDepth) document.body.classList.remove("pdf-drop-active");
});
document.addEventListener("drop", (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  pdfDragDepth = 0;
  document.body.classList.remove("pdf-drop-active");
  void importPdfFiles([...event.dataTransfer.files]);
});

async function importPdfFiles(files) {
  const pdfs = files.filter((file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name));
  if (!pdfs.length) {
    showDashboardNotice(files.length ? "Only PDF files can be added." : "");
    return;
  }
  const imported = [];
  const failed = [];
  for (const file of pdfs) {
    try {
      imported.push(await importLocalPdfFile(file));
    } catch (error) {
      failed.push(`${file.name}: ${error.message || String(error)}`);
    }
  }
  await refreshRecords();
  for (const { figure } of imported) {
    figure.then((record) => {
      if (!record) return;
      const preview = updatePreview(record.documentKey, { figure: record });
      if (preview.figureImage && state.paperView !== PAPER_VIEW.LIST) {
        updateGalleryCover(elements.paperList, record.documentKey, preview);
      } else if (preview.figureImage) {
        scheduleEnrichedRender();
      }
    });
  }
  showDashboardNotice([
    imported.length ? `Added ${imported.length} PDF${imported.length === 1 ? "" : "s"} to your library.` : "",
    ...failed
  ].filter(Boolean).join(" "));
  // One PDF opens right away so it can be read and parsed.
  if (imported.length === 1 && pdfs.length === 1) {
    await openPaperUrlInExistingTab(imported[0].viewerUrl).catch((error) => {
      console.debug("[Paper Toaster] Could not open imported PDF", error);
    });
  }
}

let dashboardNoticeTimer = 0;
function showDashboardNotice(text) {
  window.clearTimeout(dashboardNoticeTimer);
  elements.summary.textContent = text;
  if (text) {
    dashboardNoticeTimer = window.setTimeout(() => {
      elements.summary.textContent = "";
    }, 6000);
  }
}

window.addEventListener("focus", () => scheduleDashboardFocusRefresh());
document.addEventListener("pointerdown", handleDashboardPointerDown, true);
window.addEventListener("pointerup", handleDashboardPointerComplete, true);
window.addEventListener("pointercancel", handleDashboardPointerComplete, true);

document.addEventListener("click", (event) => {
  // Menu items re-render on click, so check the dispatch path rather than the detached target.
  const path = event.composedPath();
  if (!elements.sortMenu.hidden && !path.includes(elements.sortMenu) && !path.includes(elements.sortButton)) {
    setSortMenuOpen(false);
  }
  if (!elements.groupMenu.hidden && !path.includes(elements.groupMenu) && !path.includes(elements.groupButton)) {
    setGroupMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return;
  }

  const actionableRecordCount = bulkActions.getActionableRecordCount();
  const actionablePaperCount = bulkActions.getActionableDocumentKeys().length;

  if (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    state.libraryView === LIBRARY_VIEW.BOARD &&
    actionablePaperCount > 0 &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.sendSelectedPapers().catch((error) => {
      elements.summary.textContent = `Could not send papers: ${error.message || String(error)}`;
    });
    return;
  }

  if (
    event.key === "ArrowDown" &&
    event.metaKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    actionableRecordCount > 0 &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.exportSelectedRecords().catch((error) => {
      elements.summary.textContent = `Could not export papers: ${error.message || String(error)}`;
    });
    return;
  }

  if (
    event.key === "ArrowDown" &&
    event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    state.libraryView === LIBRARY_VIEW.BOARD &&
    actionableRecordCount > 0 &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.archiveSelectedPapers().catch((error) => {
      elements.summary.textContent = `Could not archive papers: ${error.message || String(error)}`;
    });
    return;
  }

  if (
    (event.key === "Backspace" || event.key === "Delete") &&
    actionableRecordCount > 0 &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.deleteSelectedPapers().catch((error) => {
      elements.summary.textContent = `Could not delete papers: ${error.message || String(error)}`;
    });
    return;
  }

  if (event.key !== "Escape" || shouldIgnoreDashboardEscape(event.target)) {
    return;
  }

  event.preventDefault();
  state.activeDocumentKey = "";
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
  if (state.manageMode) {
    bulkActions.clearSelection();
  } else {
    renderPapers();
  }
  clearDashboardContext({ openPanel: true })
    .then(renderPapers)
    .catch((error) => {
      console.debug("[Paper Toaster] Could not clear dashboard context from Escape", error);
    });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "GOOGLE_SYNC_APPLIED") {
    restoreDashboardPreferences()
      .then(() => {
        renderPreferenceControls();
        return refreshRecords();
      })
      .catch((error) => console.warn("Could not refresh synced library", error));
    return;
  }
  if (message?.type === MessageType.LIBRARY_PAPER_CONTEXT_CHANGED) {
    applyActiveDashboardContext(message.context);
    renderPapers();
    return;
  }

  if (message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED) {
    refreshRecords();
  }
});

chrome.tabs.onCreated.addListener(scheduleOpenPaperTabsRefresh);
chrome.tabs.onRemoved.addListener(scheduleOpenPaperTabsRefresh);
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url || changeInfo.status === "complete") {
    scheduleOpenPaperTabsRefresh();
  }
});

initializeDashboard().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});

function scheduleDashboardFocusRefresh(delay = DASHBOARD_FOCUS_REFRESH_DELAY_MS) {
  dashboardFocusRefreshPending = true;
  if (dashboardPointerActive) {
    return;
  }

  window.clearTimeout(dashboardFocusRefreshTimer);
  dashboardFocusRefreshTimer = window.setTimeout(() => {
    dashboardFocusRefreshTimer = 0;
    dashboardFocusRefreshPending = false;
    refreshAll().catch((error) => {
      console.debug("[PDF AI] Dashboard focus refresh failed", error);
    });
  }, delay);
}

function handleDashboardPointerDown() {
  dashboardPointerActive = true;
  if (dashboardFocusRefreshTimer) {
    window.clearTimeout(dashboardFocusRefreshTimer);
    dashboardFocusRefreshTimer = 0;
  }
}

function handleDashboardPointerComplete() {
  dashboardPointerActive = false;
  if (dashboardFocusRefreshPending) {
    scheduleDashboardFocusRefresh(32);
  }
}

async function initializeDashboard() {
  await closeOtherDashboardTabs().catch((error) => {
    console.debug("[Paper Toaster] Could not close an older dashboard tab", error);
  });
  await restoreDashboardPreferences().catch((error) => {
    console.debug("[Paper Toaster] Could not restore dashboard view preferences", error);
  });
  renderPreferenceControls();
  renderViewControls();
  await clearDashboardContext();
  await refreshAll();
}

async function closeOtherDashboardTabs() {
  const currentTab = await chrome.tabs.getCurrent();
  if (!Number.isInteger(currentTab?.id)) {
    return;
  }

  const dashboardUrl = new URL(chrome.runtime.getURL("src/dashboard/dashboard.html"));
  const tabs = await chrome.tabs.query({});
  const duplicateTabIds = tabs
    .filter((tab) => (
      Number.isInteger(tab?.id) &&
      tab.id !== currentTab.id &&
      isDashboardUrl(tab.url, dashboardUrl)
    ))
    .map((tab) => tab.id);

  if (duplicateTabIds.length) {
    await chrome.tabs.remove(duplicateTabIds);
  }
}

function isDashboardUrl(value, dashboardUrl) {
  try {
    const candidate = new URL(String(value || ""));
    return candidate.origin === dashboardUrl.origin && candidate.pathname === dashboardUrl.pathname;
  } catch {
    return false;
  }
}

async function restoreDashboardPreferences() {
  // View layouts name label columns, so the columns load first.
  await restoreLabelColumns();
  await Promise.all([
    restoreViewSettings(),
    restorePaperView(),
    restoreViewProperties(),
    restoreLabelGroupOrder()
  ]);
  applyViewSettings();
}

function renderPreferenceControls() {
  renderViewButton();
  renderSortMenu();
}

function saveDashboardPreference(key, value, description) {
  chrome.storage.local.set({ [key]: value }).catch((error) => {
    console.debug(`[Paper Toaster] Could not save dashboard ${description}`, error);
  });
}

async function restoreViewSettings() {
  const stored = await chrome.storage.local.get([
    PAPER_VIEW_SETTINGS_STORAGE_KEY,
    LEGACY_SORT_STORAGE_KEY,
    LEGACY_SORT_DIRECTION_STORAGE_KEY,
    LEGACY_GROUP_MODE_STORAGE_KEY
  ]);
  const saved = stored[PAPER_VIEW_SETTINGS_STORAGE_KEY] || {};
  const legacy = {
    sort: stored[LEGACY_SORT_STORAGE_KEY],
    sortDirection: stored[LEGACY_SORT_DIRECTION_STORAGE_KEY],
    groupMode: stored[LEGACY_GROUP_MODE_STORAGE_KEY]
  };
  state.viewSettings = Object.fromEntries(Object.values(PAPER_VIEW).map((view) => [
    view,
    normalizeViewSettings(saved[view] || legacy, view)
  ]));
}

function normalizeViewSettings(value = {}, view = "") {
  const sort = getSortOption(value.sort) ? value.sort : "latestThread";
  const isValidGroup = (mode) => Object.values(PAPER_GROUP_MODE).includes(mode) || isLabelGroupMode(mode);
  const settings = {
    sort,
    sortDirection: value.sortDirection === "asc" || value.sortDirection === "desc"
      ? value.sortDirection
      : getSortOption(sort).sortDirection,
    // A label column grouping stays valid while its column exists.
    groupMode: isValidGroup(value.groupMode) ? value.groupMode : PAPER_GROUP_MODE.LABEL
  };
  if (view === PAPER_VIEW.CARDS) {
    // The board's kanban columns come from "organized by". Earlier builds used
    // the board's grouping for that, so it carries over and grouping starts off.
    const migrated = !isLabelGroupMode(value.organizeBy);
    settings.organizeBy = migrated
      ? isLabelGroupMode(value.groupMode) ? value.groupMode : PAPER_GROUP_MODE.LABEL
      : value.organizeBy;
    settings.groupMode = migrated ? PAPER_GROUP_MODE.NONE : settings.groupMode;
  }
  return settings;
}

function isLabelGroupMode(mode) {
  return mode === PAPER_GROUP_MODE.LABEL || String(mode || "").startsWith("label:");
}

// Built-in sorts, or a column sort ("property:year") chosen from a list header.
function getSortOption(sortId) {
  if (SORT_CONFIG[sortId]) return SORT_CONFIG[sortId];
  const colorColumn = getPaperColorSort(sortId);
  if (colorColumn) {
    return {
      id: sortId,
      label: `${colorColumn.label} color`,
      sortBy: "latestThread",
      sortDirection: "asc",
      directionLabels: { asc: "Red → purple", desc: "Purple → red" }
    };
  }
  const property = getPaperPropertySort(sortId);
  if (!property) return null;
  return {
    id: sortId,
    label: property.label,
    sortBy: "latestThread",
    sortDirection: property.sortType === "text" ? "asc" : "desc",
    directionLabels: property.sortType === "text"
      ? { asc: "A → Z", desc: "Z → A" }
      : { asc: "Low → high", desc: "High → low" }
  };
}

// Built-in sorts, each label column's color sort, and a column sort while it is active.
function getSortMenuOptions() {
  const colorOptions = state.labelSettings.columns.map((column) => getSortOption(
    `${PAPER_COLOR_SORT_PREFIX}${column.id === "label" ? "label" : `${LABEL_PROPERTY_PREFIX}${column.id}`}`
  )).filter(Boolean);
  const options = [...SORT_OPTIONS, ...colorOptions];
  return options.some((option) => option.id === state.sort) || !getSortOption(state.sort)
    ? options
    : [...options, getSortOption(state.sort)];
}

// Title and Added columns map onto the matching built-in sorts.
async function sortByProperty(propertyId, direction, kind = "value") {
  const builtIn = { title: "title", added: "latestAdded" }[propertyId];
  const sort = kind === "color"
    ? `${PAPER_COLOR_SORT_PREFIX}${propertyId}`
    : builtIn || `${PAPER_PROPERTY_SORT_PREFIX}${propertyId}`;
  if (!getSortOption(sort) || (state.sort === sort && state.sortDirection === direction)) return;
  state.sort = sort;
  state.sortDirection = direction;
  saveViewSettings();
  renderSortMenu();
  await refreshRecords();
}

// Loads the current view's sort and grouping into the working state.
function applyViewSettings() {
  const settings = state.viewSettings[state.paperView] || normalizeViewSettings({}, state.paperView);
  state.sort = settings.sort;
  state.sortDirection = settings.sortDirection;
  state.paperGroupMode = settings.groupMode;
  state.boardOrganizeBy = settings.organizeBy || PAPER_GROUP_MODE.LABEL;
}

function saveViewSettings() {
  state.viewSettings = {
    ...state.viewSettings,
    [state.paperView]: {
      sort: state.sort,
      sortDirection: state.sortDirection,
      groupMode: state.paperGroupMode,
      ...(state.paperView === PAPER_VIEW.CARDS ? { organizeBy: state.boardOrganizeBy } : {})
    }
  };
  saveDashboardPreference(PAPER_VIEW_SETTINGS_STORAGE_KEY, state.viewSettings, "view sort and grouping");
}

async function restorePaperView() {
  const stored = await chrome.storage.local.get(PAPER_VIEW_STORAGE_KEY);
  const view = stored[PAPER_VIEW_STORAGE_KEY];
  state.paperView = normalizePaperView(view);
}

async function restoreViewProperties() {
  const stored = await chrome.storage.local.get([
    PAPER_VIEW_PROPERTIES_STORAGE_KEY,
    LEGACY_MESSAGE_RINGS_VISIBLE_STORAGE_KEY,
    LEGACY_LIST_COLUMNS_STORAGE_KEY
  ]);
  if (stored[PAPER_VIEW_PROPERTIES_STORAGE_KEY]) {
    state.viewProperties = normalizePaperViewProperties(stored[PAPER_VIEW_PROPERTIES_STORAGE_KEY]);
    return;
  }

  const properties = normalizePaperViewProperties({
    [PAPER_VIEW.LIST]: migrateLegacyPaperListColumns(stored[LEGACY_LIST_COLUMNS_STORAGE_KEY])
  });
  if (stored[LEGACY_MESSAGE_RINGS_VISIBLE_STORAGE_KEY] === false) {
    properties[PAPER_VIEW.CARDS] = properties[PAPER_VIEW.CARDS].map((property) => (
      property.id === "messages" ? { ...property, visible: false } : property
    ));
  }
  state.viewProperties = properties;
  if (stored[LEGACY_LIST_COLUMNS_STORAGE_KEY] || stored[LEGACY_MESSAGE_RINGS_VISIBLE_STORAGE_KEY] === false) {
    saveDashboardPreference(PAPER_VIEW_PROPERTIES_STORAGE_KEY, properties, "view properties");
  }
}

async function restoreLabelGroupOrder() {
  const stored = await chrome.storage.local.get(PAPER_LABEL_GROUP_ORDER_STORAGE_KEY);
  const order = stored[PAPER_LABEL_GROUP_ORDER_STORAGE_KEY];
  if (Array.isArray(order)) {
    state.labelGroupOrder = order.filter((key) => typeof key === "string");
  }
}

async function refreshAll() {
  await refreshActivePaperContext();
  await refreshRecords();
}

async function refreshRecords() {
  const [allPapers, allComparisons, tabs, previews] = await Promise.all([
    listLibraryPapers({
      view: state.libraryView,
      sortBy: (getSortOption(state.sort) || SORT_CONFIG.latestThread).sortBy,
      sortDirection: state.sortDirection
    }),
    listDashboardComparisons(state.libraryView),
    chrome.tabs.query({}),
    listDashboardPaperPreviews({ includeCovers: isCurrentViewPropertyVisible("figure") }).catch((error) => {
      console.debug("[Paper Toaster] Could not load paper previews", error);
      return state.previews;
    })
  ]);
  state.previews = previews;
  state.openPaperUrls = getOpenTabUrls(tabs);
  const displayablePapers = allPapers.filter(isDisplayablePaper);
  state.hasLocalPapers = displayablePapers.length > 0 || allComparisons.length > 0;
  state.papers = filterDashboardPapers(displayablePapers, state.query);
  state.comparisonMessageCountByDocumentKey = countComparisonMessagesByDocument(allComparisons);
  state.comparisons = filterDashboardComparisons(allComparisons, state.query);
  renderPapers();
  renderSummary();
  enrichDashboardPapers(displayablePapers);
}

const METADATA_PROPERTY_IDS = ["authors", "year", "venue", "citations"];

function isCurrentViewPropertyVisible(propertyId) {
  return isPaperPropertyVisible(state.viewProperties[state.paperView] || [], propertyId);
}

// Fills in Figure 1 covers and bibliographic metadata in the background for
// the properties the current view shows.
function enrichDashboardPapers(papers) {
  const recordsOf = (field) => new Map([...state.previews]
    .filter(([, preview]) => preview[field])
    .map(([documentKey, preview]) => [documentKey, preview[field]]));
  if (isCurrentViewPropertyVisible("figure")) {
    ensurePaperFigures(papers, recordsOf("figure"), {
      onFigure: (figure) => {
        const preview = updatePreview(figure.documentKey, { figure });
        if (!preview.figureImage) return;
        if (state.paperView === PAPER_VIEW.LIST) scheduleEnrichedRender();
        else updateGalleryCover(elements.paperList, figure.documentKey, preview);
      }
    });
  }
  if (METADATA_PROPERTY_IDS.some(isCurrentViewPropertyVisible)) {
    ensurePaperMetadata(papers, recordsOf("metadata"), {
      onMetadata: (metadata) => {
        updatePreview(metadata.documentKey, { metadata });
        scheduleEnrichedRender();
      }
    });
  }
}

function updatePreview(documentKey, records) {
  const preview = createDashboardPaperPreview(state.previews.get(documentKey), records);
  state.previews.set(documentKey, preview);
  return preview;
}

// Metadata usually arrives in a burst, so redraw once it settles, and never mid-gesture.
let enrichedRenderTimer = 0;
function scheduleEnrichedRender() {
  window.clearTimeout(enrichedRenderTimer);
  enrichedRenderTimer = window.setTimeout(() => {
    if (dashboardPointerActive || document.body.classList.contains("dashboard-drag-active")) {
      scheduleEnrichedRender();
      return;
    }
    renderPapers();
  }, 400);
}

function renderDashboard() {
  renderPapers();
  renderSummary();
}

function renderSummary() {
  const totalMessages = state.papers.reduce((sum, paper) => sum + paper.messageCount, 0);
  const totalComparisonMessages = state.comparisons.reduce((sum, comparison) => sum + comparison.messageCount, 0);
  elements.search.placeholder = `${state.papers.length} papers · ${state.comparisons.length} comparisons · ${totalMessages + totalComparisonMessages} messages`;
  elements.summary.textContent = "";
  bulkActions.renderBulkActions();
}

function renderPapers() {
  renderPaperList({
    container: elements.paperList,
    emptyState: elements.emptyState,
    papers: state.papers,
    comparisons: state.comparisons,
    libraryView: state.libraryView,
    showEmptyState: !state.hasLocalPapers,
    comparisonMessageCountByDocumentKey: state.comparisonMessageCountByDocumentKey,
    sortId: state.sort,
    sortDirection: state.sortDirection,
    paperView: state.paperView,
    viewProperties: state.viewProperties,
    previews: state.previews,
    paperGroupMode: state.paperGroupMode,
    labelGroupOrder: state.labelGroupOrder,
    activeDocumentKey: state.activeDocumentKey,
    activeComparisonId: state.activeComparisonId,
    activeComparisonDocumentKeys: getActiveComparisonDocumentKeys(),
    openPaperUrls: state.openPaperUrls,
    manageMode: state.manageMode,
    selectedDocumentKeys: state.selectedDocumentKeys,
    selectedComparisonIds: state.selectedComparisonIds,
    onOpenPaperContext: openPaperContextInSidePanel,
    onOpenPaper: openPaperFromDashboard,
    onOpenComparisonContext: openComparisonContextInSidePanel,
    onTogglePaperSelection: bulkActions.togglePaperSelection,
    onSetPaperGroupSelected: bulkActions.setPaperSelection,
    onReorderLabelGroups: reorderLabelGroups,
    onToggleComparisonSelection: bulkActions.toggleComparisonSelection,
    onSetComparisonSelected: bulkActions.setComparisonSelected,
    onTogglePaperStarred: togglePaperStarred,
    onToggleComparisonStarred: toggleComparisonStarred,
    onUpdatePaperGroup: updatePaperGroup,
    onRenamePaperGroup: renamePaperGroup,
    onDeletePaperGroup: deletePaperGroup,
    labelSettings: state.labelSettings,
    onChangePaperLabels: changePaperLabels,
    onRenameLabel: renameLabel,
    onDeleteLabel: deleteLabel,
    onSetLabelTone: setLabelTone,
    onAddLabelColumn: (name, options) => addLabelColumn(name, options),
    onRenameLabelColumn: renameLabelColumn,
    onDeleteLabelColumn: deleteLabelColumn,
    boardOrganizeBy: state.boardOrganizeBy,
    onUpdatePaperShortNote: updatePaperShortNote,
    onUpdateViewProperties: updateViewProperties,
    onSortByProperty: (propertyId, direction, kind) => {
      sortByProperty(propertyId, direction, kind).catch((error) => {
        console.debug("[Paper Toaster] Could not sort by column", error);
      });
    }
  });
  propertiesMenu?.update(state.paperView, state.libraryView, state.viewProperties[state.paperView]);
  renderKeyboardHint();
}

function scheduleOpenPaperTabsRefresh() {
  window.clearTimeout(openPaperTabsRefreshTimer);
  openPaperTabsRefreshTimer = window.setTimeout(() => {
    openPaperTabsRefreshTimer = 0;
    refreshOpenPaperTabs().catch((error) => {
      console.debug("[Paper Toaster] Could not refresh open-paper indicators", error);
    });
  }, 60);
}

async function refreshOpenPaperTabs() {
  state.openPaperUrls = getOpenTabUrls(await chrome.tabs.query({}));
  renderPapers();
}

function getOpenTabUrls(tabs) {
  return new Set((Array.isArray(tabs) ? tabs : [])
    .map((tab) => normalizeDocumentUrl(tab?.url))
    .filter(Boolean));
}

function reorderLabelGroups(groupOrder) {
  const visibleKeys = new Set(groupOrder);
  let visibleIndex = 0;
  const mergedOrder = state.labelGroupOrder.map((key) => {
    if (!visibleKeys.has(key)) {
      return key;
    }
    return groupOrder[visibleIndex++];
  });
  state.labelGroupOrder = [
    ...mergedOrder,
    ...groupOrder.slice(visibleIndex).filter((key) => !mergedOrder.includes(key))
  ];
  persistLabelGroupOrder();
  // Board groups each hold a kanban: redraw once the drop settles so all follow the new order.
  window.setTimeout(renderPapers, 200);
}

function persistLabelGroupOrder() {
  chrome.storage.local.set({
    [PAPER_LABEL_GROUP_ORDER_STORAGE_KEY]: state.labelGroupOrder
  }).catch((error) => {
    console.debug("[Paper Toaster] Could not save label-group order", error);
  });
}

function renderKeyboardHint() {
  const showMultiSelectHint = state.libraryView === LIBRARY_VIEW.BOARD && !state.manageMode;
  elements.multiSelectKeyboardPrompt.hidden = !showMultiSelectHint;
  elements.multiSelectKeyboardPrompt.replaceChildren();

  if (showMultiSelectHint) {
    elements.multiSelectKeyboardPrompt.append(
      "Hold ",
      createShortcutLabel("⇧"),
      " and click to multi-select"
    );
  }
}

function createShortcutLabel(symbol, label) {
  const shortcut = document.createElement("kbd");
  shortcut.textContent = [symbol, label].filter(Boolean).join(" ");
  return shortcut;
}

async function openPaperContextInSidePanel(documentKey) {
  if (!documentKey) {
    return;
  }

  bulkActions.clearSelection();
  state.activeDocumentKey = documentKey;
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
  renderDashboard();

  try {
    await chrome.runtime.sendMessage({
      type: MessageType.OPEN_LIBRARY_PAPER_CONTEXT,
      documentKey
    });
  } catch (error) {
    console.debug("[PDF AI] Could not open paper context in side panel", error);
  }
}

async function openPaperFromDashboard(paper) {
  const url = paper?.canonicalUrl;
  if (!url) {
    return;
  }

  try {
    await openPaperUrlInExistingTab(url);
  } catch (error) {
    console.debug("[Paper Toaster] Could not open paper from dashboard", error);
  }
}

async function openComparisonContextInSidePanel(comparisonId) {
  if (!comparisonId) {
    return;
  }

  bulkActions.clearSelection();
  state.activeDocumentKey = "";
  state.activeComparisonId = comparisonId;
  state.activeComparisonDocumentKeys = getComparisonDocumentKeys(comparisonId);
  renderDashboard();

  try {
    await chrome.runtime.sendMessage({
      type: MessageType.OPEN_COMPARISON_CONTEXT,
      comparisonId
    });
  } catch (error) {
    console.debug("[PDF AI] Could not open comparison context in side panel", error);
  }
}

async function refreshActivePaperContext() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: MessageType.GET_LIBRARY_PAPER_CONTEXT
    });
    applyActiveDashboardContext(response?.context);
  } catch (error) {
    console.debug("[PDF AI] Could not read active paper context", error);
  }
}

async function clearDashboardContext(options = {}) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: MessageType.CLEAR_DASHBOARD_CONTEXT,
      openPanel: Boolean(options.openPanel)
    });
    applyActiveDashboardContext(response?.context);
  } catch (error) {
    console.debug("[PDF AI] Could not clear dashboard context", error);
  }
}

function notifyPaperActivityChanged(documentKey) {
  if (!documentKey) {
    return;
  }

  chrome.runtime.sendMessage({
    type: MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED,
    documentKey
  }).catch(() => {
    // Side panel may be closed; dashboard local refresh still applies.
  });
}

async function togglePaperStarred(paper) {
  await setLibraryPaperStarred(paper.documentKey, !paper.isStarred, paper);
  notifyPaperActivityChanged(paper.documentKey);
  await refreshRecords();
}

async function restoreLabelColumns() {
  state.labelSettings = await readLabelColumns();
  setPaperLabelColumns(state.labelSettings.columns);
}

// Label columns and colors changed here, in another view or through sync.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !Object.hasOwn(changes, LABEL_COLUMNS_STORAGE_KEY)) return;
  state.labelSettings = normalizeLabelColumns(changes[LABEL_COLUMNS_STORAGE_KEY].newValue);
  setPaperLabelColumns(state.labelSettings.columns);
  state.viewProperties = normalizePaperViewProperties(state.viewProperties);
  if (state.paperGroupMode.startsWith("label:") &&
      !state.labelSettings.columns.some((column) => `label:${column.id}` === state.paperGroupMode)) {
    state.paperGroupMode = PAPER_GROUP_MODE.LABEL;
  }
  renderSortMenu();
  renderPapers();
});

async function saveLabelSettings(settings) {
  state.labelSettings = await writeLabelColumns(settings);
  setPaperLabelColumns(state.labelSettings.columns);
  // Group by lists the label columns by name.
  renderSortMenu();
}

// Label edits apply one at a time, so quick toggles never overwrite each other.
let labelChangeChain = Promise.resolve();
function changePaperLabels(paper, columnId, labels) {
  labelChangeChain = labelChangeChain
    .catch(() => {})
    .then(() => applyPaperLabelChange(paper, columnId, labels));
  return labelChangeChain;
}

// New labels get the next unused color in their column (colors repeat once all are used).
async function applyPaperLabelChange(paper, columnId, labels) {
  const next = normalizeLabelList(labels);
  const existing = [...new Set(state.papers.flatMap((item) => getPaperLabels(item, columnId)))];
  const settings = withTonesForNewLabels(state.labelSettings, columnId, next, existing);
  if (settings !== state.labelSettings) await saveLabelSettings(settings);
  await setLibraryPaperLabels(paper.documentKey, columnId, next, paper);
  notifyPaperActivityChanged(paper.documentKey);
  await refreshRecords();
}

async function renameLabel(columnId, from, to) {
  const changed = await renameLibraryPaperLabel(columnId, from, to, { scope: state.libraryView });
  const tone = state.labelSettings.colors?.[columnId]?.[from.toLowerCase()];
  if (Number.isInteger(tone)) {
    await saveLabelSettings(withLabelTone(withoutLabelTone(state.labelSettings, columnId, from), columnId, to, tone));
  }
  const prefix = columnId === "label" ? "" : `${columnId}:`;
  state.labelGroupOrder = state.labelGroupOrder.map((key) => key === `${prefix}${from.toLowerCase()}` ? `${prefix}${to.toLowerCase()}` : key);
  persistLabelGroupOrder();
  changed.forEach(notifyPaperActivityChanged);
  await refreshRecords();
}

async function deleteLabel(columnId, name) {
  const changed = await deleteLibraryPaperLabel(columnId, name, { scope: state.libraryView });
  await saveLabelSettings(withoutLabelTone(state.labelSettings, columnId, name));
  changed.forEach(notifyPaperActivityChanged);
  await refreshRecords();
}

async function setLabelTone(columnId, name, tone) {
  await saveLabelSettings(withLabelTone(state.labelSettings, columnId, name, tone));
  renderPapers();
}

// Label columns are created, renamed and deleted from the properties and column menus.
async function addLabelColumn(name, { view = state.paperView, afterPropertyId = "" } = {}) {
  const columnName = normalizeColumnName(name);
  if (!columnName) return;
  const id = createLabelColumnId();
  await saveLabelSettings({ ...state.labelSettings, columns: [...state.labelSettings.columns, { id, name: columnName }] });
  const propertyId = `${LABEL_PROPERTY_PREFIX}${id}`;
  // The new column shows in the view it was made from, beside the column it came from.
  const properties = normalizePaperViewProperties(state.viewProperties)[view];
  const added = { ...properties.find((property) => property.id === propertyId), visible: true };
  const rest = properties.filter((property) => property.id !== propertyId);
  const afterIndex = afterPropertyId ? rest.findIndex((property) => property.id === afterPropertyId) : -1;
  rest.splice(afterIndex >= 0 ? afterIndex + 1 : rest.length, 0, added);
  updateViewProperties(view, rest);
}

async function renameLabelColumn(columnId, name) {
  const columnName = normalizeColumnName(name);
  if (!columnName) return;
  await saveLabelSettings({
    ...state.labelSettings,
    columns: state.labelSettings.columns.map((column) => column.id === columnId ? { ...column, name: columnName } : column)
  });
  renderSortMenu();
  renderPapers();
}

// Deleting a column hides it everywhere; papers keep their labels in case it was a mistake.
async function deleteLabelColumn(columnId) {
  if (columnId === "label") return;
  const column = state.labelSettings.columns.find((item) => item.id === columnId);
  if (!column || !window.confirm(`Delete the "${column.name}" label column?`)) return;
  const colors = { ...state.labelSettings.colors };
  delete colors[columnId];
  await saveLabelSettings({ columns: state.labelSettings.columns.filter((item) => item.id !== columnId), colors });
  state.viewProperties = normalizePaperViewProperties(state.viewProperties);
  saveDashboardPreference(PAPER_VIEW_PROPERTIES_STORAGE_KEY, state.viewProperties, "view properties");
  if (state.paperGroupMode === `label:${columnId}` || state.boardOrganizeBy === `label:${columnId}`) {
    if (state.paperGroupMode === `label:${columnId}`) state.paperGroupMode = PAPER_GROUP_MODE.LABEL;
    if (state.boardOrganizeBy === `label:${columnId}`) state.boardOrganizeBy = PAPER_GROUP_MODE.LABEL;
    saveViewSettings();
  }
  renderSortMenu();
  renderPapers();
}

async function updatePaperGroup(paper, group) {
  await setLibraryPaperGroup(paper.documentKey, group, paper, { scope: state.libraryView });
  notifyPaperActivityChanged(paper.documentKey);
  await refreshRecords();
}

async function updatePaperShortNote(paper, shortNote) {
  await setLibraryPaperShortNote(paper.documentKey, shortNote, paper);
  notifyPaperActivityChanged(paper.documentKey);
  await refreshRecords();
}

function updateViewProperties(view, properties) {
  const showedFigure = isCurrentViewPropertyVisible("figure");
  state.viewProperties = normalizePaperViewProperties({ ...state.viewProperties, [view]: properties });
  saveDashboardPreference(PAPER_VIEW_PROPERTIES_STORAGE_KEY, state.viewProperties, "view properties");
  if (!showedFigure && isCurrentViewPropertyVisible("figure")) {
    // Covers are only loaded while a view shows them.
    refreshRecords();
    return;
  }
  renderPapers();
  enrichDashboardPapers(state.papers);
}

async function selectPaperView(view) {
  setGroupMenuOpen(false);
  if (view === state.paperView) {
    return;
  }
  state.paperView = normalizePaperView(view);
  saveDashboardPreference(PAPER_VIEW_STORAGE_KEY, state.paperView, "view");
  applyViewSettings();
  renderViewButton();
  renderSortMenu();
  await refreshRecords();
}

async function renamePaperGroup(oldGroup, newGroup) {
  const changedDocumentKeys = await renameLibraryPaperGroup(oldGroup, newGroup, { scope: state.libraryView });
  const oldKey = getLabelGroupKey(oldGroup);
  const newKey = getLabelGroupKey(newGroup);
  state.labelGroupOrder = state.labelGroupOrder.map((key) => key === oldKey ? newKey : key);
  persistLabelGroupOrder();
  changedDocumentKeys.forEach(notifyPaperActivityChanged);
  await refreshRecords();
}

async function deletePaperGroup(group) {
  const changedDocumentKeys = await deleteLibraryPaperGroup(group, { scope: state.libraryView });
  const deletedKey = getLabelGroupKey(group);
  state.labelGroupOrder = state.labelGroupOrder.filter((key) => key !== deletedKey);
  persistLabelGroupOrder();
  changedDocumentKeys.forEach(notifyPaperActivityChanged);
  await refreshRecords();
}

function getLabelGroupKey(group) {
  const normalized = String(group || "").trim().toLowerCase();
  return normalized || "__unlabeled__";
}

async function toggleComparisonStarred(comparison) {
  await setComparisonSessionStarred(comparison.comparisonId, !comparison.isStarred);
  await refreshRecords();
}

function renderSortMenu() {
  // Sort and group live behind two buttons; both menus share one set of options.
  const options = {
    sortOptions: getSortMenuOptions(),
    activeSort: state.sort,
    sortDirection: state.sortDirection,
    groupOptions: getGroupOptions(),
    activeGroup: state.paperGroupMode,
    // The board's kanban columns: one per label of the chosen label column.
    organizeOptions: state.paperView === PAPER_VIEW.CARDS ? getGroupOptions().filter((option) => isLabelGroupMode(option.id)) : null,
    activeOrganize: state.boardOrganizeBy,
    onSelectOrganize: (option) => {
      if (option.id === state.boardOrganizeBy) return;
      state.boardOrganizeBy = option.id;
      saveViewSettings();
      renderSortMenu();
      renderPapers();
    },
    showSortOptions: state.libraryView !== LIBRARY_VIEW.ARCHIVE,
    onSelectSort: async (option) => {
      if (option.id === state.sort) {
        return;
      }
      state.sort = option.id;
      state.sortDirection = option.sortDirection;
      saveViewSettings();
      renderSortMenu();
      await refreshRecords();
    },
    onSelectSortDirection: async (direction) => {
      if (direction === state.sortDirection) {
        return;
      }
      state.sortDirection = direction;
      saveViewSettings();
      renderSortMenu();
      await refreshRecords();
    },
    onSelectGroup: (option) => {
      if (option.id === state.paperGroupMode) {
        return;
      }
      state.paperGroupMode = option.id;
      saveViewSettings();
      renderSortMenu();
      renderPapers();
    }
  };
  renderDashboardSortMenu({ ...options, sortButton: elements.sortButton, sortMenu: elements.sortMenu, part: "sort" });
  renderDashboardSortMenu({ ...options, sortButton: elements.groupButton, sortMenu: elements.groupMenu, part: "group" });
  // The archive keeps a fixed order, so only grouping is offered there.
  elements.sortButton.closest(".sort-control").hidden = state.libraryView === LIBRARY_VIEW.ARCHIVE;
}

// The three views as a centered segmented control.
function renderViewButton() {
  elements.paperViewSwitch.replaceChildren(...PAPER_VIEW_OPTIONS.map((option) => {
    const active = option.id === state.paperView;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "paper-view-switch-option";
    button.classList.toggle("active", active);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(active));
    const icon = document.createElement("span");
    icon.className = "icon-mask paper-view-icon";
    icon.dataset.view = option.id;
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = option.label;
    button.append(icon, label);
    button.addEventListener("click", () => {
      selectPaperView(option.id).catch((error) => {
        console.debug("[Paper Toaster] Could not switch dashboard view", error);
      });
    });
    return button;
  }));
}

async function handlePapersDeleted(selection) {
  const documentKeys = Array.isArray(selection) ? selection : selection?.documentKeys || [];
  const comparisonIds = Array.isArray(selection) ? [] : selection?.comparisonIds || [];

  if (documentKeys.includes(state.activeDocumentKey)) {
    state.activeDocumentKey = "";
  }
  if (comparisonIds.includes(state.activeComparisonId)) {
    state.activeComparisonId = "";
    state.activeComparisonDocumentKeys = new Set();
  }

  for (const documentKey of documentKeys) {
    notifyPaperActivityChanged(documentKey);
  }
  await refreshRecords();
}

async function sendSelectedPapersToMachine(documentKeys) {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.UPDATE_COMPARISON_DRAFT,
    documentKeys,
    append: true,
    rejectOverflow: true,
    openPanel: true
  });
  applyActiveDashboardContext(response?.context);
  renderPapers();
}

async function listDashboardComparisons(view = LIBRARY_VIEW.BOARD) {
  const sessions = await listComparisonSessions({ view });
  const summaries = [];

  for (const session of sessions) {
    const papers = (await Promise.all(
      session.documentKeys.map((documentKey) => getLibraryPaperSummary(documentKey))
    )).filter(Boolean);
    const comparison = {
      type: "comparative-reading",
      comparisonId: session.comparisonId,
      title: session.title || "Comparative Reading",
      documentKeys: session.documentKeys,
      papers,
      messageCount: session.messageCount || 0,
      firstMessageCreatedAt: session.firstMessageCreatedAt || session.createdAt || null,
      createdAt: session.createdAt || null,
      updatedAt: session.updatedAt || session.createdAt || null,
      isStarred: Boolean(session.isStarred),
      starredAt: session.starredAt || null,
      archivedAt: session.archivedAt || null
    };

    summaries.push(comparison);
  }

  return summaries;
}

function renderViewControls() {
  const archiveView = state.libraryView === LIBRARY_VIEW.ARCHIVE;
  document.body.classList.toggle("library-view-archive", archiveView);
  elements.viewSwitch.setAttribute("aria-label", archiveView ? "Back to Board" : "Open Archive");
  elements.viewSwitch.classList.toggle("active", archiveView);
  renderSortMenu();
  elements.sendToMachineButton.hidden = archiveView || elements.sendToMachineButton.hidden;
  elements.paperList.setAttribute("aria-label", archiveView ? "Archived papers" : "Local papers");
  elements.emptyStateMessage.textContent = archiveView ? "archive is empty" : "open a PDF to kick off";
}

function filterDashboardComparisons(comparisons, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  return normalizedQuery
    ? comparisons.filter((comparison) => matchesComparisonQuery(comparison, normalizedQuery))
    : comparisons;
}

function filterDashboardPapers(papers, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return papers;
  }

  return papers.filter((paper) => [
    paper.title,
    paper.canonicalUrl,
    paper.domain,
    paper.group,
    paper.shortNote
  ].some((value) => String(value || "").toLowerCase().includes(normalizedQuery)));
}

function countComparisonMessagesByDocument(comparisons) {
  const counts = new Map();
  comparisons.forEach((comparison) => {
    const messageCount = Math.max(0, Number(comparison.messageCount) || 0);
    new Set(comparison.documentKeys || []).forEach((documentKey) => {
      if (!documentKey) {
        return;
      }
      counts.set(documentKey, (counts.get(documentKey) || 0) + messageCount);
    });
  });
  return counts;
}

function matchesComparisonQuery(comparison, query) {
  return [
    comparison.title,
    ...comparison.papers.map((paper) => paper.title),
    ...comparison.papers.map((paper) => paper.canonicalUrl)
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function applyActiveDashboardContext(context) {
  const mode = String(context?.mode || "").trim();
  if (mode === "library-paper") {
    state.activeDocumentKey = String(context?.documentKey || "");
    state.activeComparisonId = "";
    state.activeComparisonDocumentKeys = new Set();
    return;
  }

  if (mode === "comparative-reading") {
    state.activeDocumentKey = "";
    state.activeComparisonId = String(context?.comparisonId || "");
    state.activeComparisonDocumentKeys = state.activeComparisonId
      ? getComparisonDocumentKeys(state.activeComparisonId)
      : new Set(Array.isArray(context?.draftDocumentKeys) ? context.draftDocumentKeys : []);
    return;
  }

  state.activeDocumentKey = "";
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
}

function getActiveComparisonDocumentKeys() {
  if (state.activeComparisonId) {
    return getComparisonDocumentKeys(state.activeComparisonId);
  }

  return state.activeComparisonDocumentKeys;
}

function getComparisonDocumentKeys(comparisonId) {
  const comparison = state.comparisons.find((record) => record.comparisonId === comparisonId);
  return new Set(comparison?.documentKeys || []);
}

function setGroupMenuOpen(open) {
  elements.groupMenu.hidden = !open;
  elements.groupButton.setAttribute("aria-expanded", String(open));
  elements.groupButton.classList.toggle("active", open);
}

function setSortMenuOpen(open) {
  elements.sortMenu.hidden = !open;
  elements.sortButton.setAttribute("aria-expanded", String(open));
  elements.sortButton.classList.toggle("active", open);
}

function shouldIgnoreDashboardEscape(target) {
  if (!elements.sortMenu.hidden || !elements.groupMenu.hidden) {
    setSortMenuOpen(false);
    setGroupMenuOpen(false);
    return true;
  }

  const activeElement = document.activeElement;
  const eventTarget = target || activeElement;
  if (isEditableElement(eventTarget) || isEditableElement(activeElement)) {
    return true;
  }

  return Boolean(eventTarget?.closest?.(
    ".paper-group-editor, .paper-group-control"
  ));
}

function shouldIgnoreDashboardShortcut(target) {
  const activeElement = document.activeElement;
  const eventTarget = target || activeElement;
  if (isEditableElement(eventTarget) || isEditableElement(activeElement)) {
    return true;
  }

  if (state.manageMode && eventTarget?.closest?.(".paper-card, .paper-list-row, .comparison-record-card")) {
    return false;
  }

  if (eventTarget?.matches?.(".paper-card.active, .paper-list-row.active, .comparison-record-card.active")) {
    return false;
  }

  return Boolean(eventTarget?.closest?.(
    "button, a, [role='button'], .paper-group-editor, .paper-group-control"
  ));
}

function isEditableElement(element) {
  if (!element || element === document.body) {
    return false;
  }

  const tagName = String(element.tagName || "").toLowerCase();
  return tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    Boolean(element.isContentEditable);
}
