import {
  deleteLibraryPaperGroup,
  getLibraryPaperSummary,
  LIBRARY_SCOPE_ARCHIVE,
  LIBRARY_SCOPE_BOARD,
  listLibraryPapers,
  renameLibraryPaperGroup,
  setLibraryPaperGroup,
  setLibraryPaperStarred
} from "../storage/library-store.js";
import { listComparisonSessions, setComparisonSessionStarred } from "../storage/comparison-store.js";
import { createDashboardBulkActions } from "./dashboard-bulk-actions.js";
import {
  isDisplayablePaper,
  renderPaperList,
  renderSortMenu as renderDashboardSortMenu
} from "./dashboard-renderer.js";
import { MessageType } from "../shared/messages.js";
import { openPaperUrlInExistingTab } from "../browser/open-paper-tab.js";

const SORT_OPTIONS = [
  { id: "latestThread", label: "Latest ask", sortBy: "latestThread", sortDirection: "desc" },
  { id: "starred", label: "Starred", sortBy: "starred", sortDirection: "desc" },
  { id: "label", label: "Label", sortBy: "title", sortDirection: "asc" }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const PAPER_GROUP_MODE = {
  LABEL: "label",
  RECENT_CONVERSATION: "recent-conversation"
};
const PAPER_GROUP_MODE_STORAGE_KEY = "dashboardPaperGroupMode";
const PAPER_MESSAGE_RINGS_VISIBLE_STORAGE_KEY = "dashboardPaperMessageRingsVisible";
const PAPER_LABEL_GROUP_ORDER_STORAGE_KEY = "dashboardPaperLabelGroupOrder";
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
  sort: "latestThread",
  query: "",
  paperGroupMode: PAPER_GROUP_MODE.LABEL,
  labelGroupOrder: [],
  messageRingsVisible: true,
  manageMode: false,
  selectedDocumentKeys: new Set(),
  selectedComparisonIds: new Set(),
  libraryView: LIBRARY_VIEW.BOARD
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  manageButton: document.querySelector("#paperManageButton"),
  bulkActions: document.querySelector("#bulkActions"),
  selectionSummary: document.querySelector("#selectionSummary"),
  selectAllButton: document.querySelector("#selectAllButton"),
  sendToMachineButton: document.querySelector("#sendToMachineButton"),
  archiveSelectedButton: document.querySelector("#archiveSelectedButton"),
  restoreSelectedButton: document.querySelector("#restoreSelectedButton"),
  exportSelectedButton: document.querySelector("#exportSelectedButton"),
  deleteSelectedButton: document.querySelector("#deleteSelectedButton"),
  sortButton: document.querySelector("#paperSortButton"),
  sortMenu: document.querySelector("#paperSortMenu"),
  groupLayoutButton: document.querySelector("#paperGroupLayoutButton"),
  messageRingButton: document.querySelector("#paperMessageRingButton"),
  viewSwitch: document.querySelector("#libraryViewSwitch"),
  paperList: document.querySelector("#paperList"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateMessage: document.querySelector("#emptyStateMessage"),
  keyboardHint: document.querySelector("#dashboardKeyboardHint")
};

const bulkActions = createDashboardBulkActions({
  state,
  elements,
  onSendToMachine: sendSelectedPapersToMachine,
  onDeleteComplete: handlePapersDeleted,
  onRenderRequested: renderDashboard
});

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  refreshRecords();
});

elements.viewSwitch.addEventListener("click", async () => {
  state.libraryView = state.libraryView === LIBRARY_VIEW.BOARD
    ? LIBRARY_VIEW.ARCHIVE
    : LIBRARY_VIEW.BOARD;
  bulkActions.setManageMode(false);
  setSortMenuOpen(false);
  state.activeDocumentKey = "";
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
  renderViewControls();
  await refreshRecords();
});

elements.paperList.addEventListener("click", (event) => {
  if (state.manageMode || event.target !== elements.paperList) {
    return;
  }

  clearDashboardContext()
    .then(renderPapers)
    .catch((error) => {
      console.debug("[PDF AI] Could not clear dashboard context from paper grid", error);
    });
});

elements.sortButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setSortMenuOpen(elements.sortMenu.hidden);
});

elements.groupLayoutButton.addEventListener("click", () => {
  state.paperGroupMode = state.paperGroupMode === PAPER_GROUP_MODE.LABEL
    ? PAPER_GROUP_MODE.RECENT_CONVERSATION
    : PAPER_GROUP_MODE.LABEL;
  chrome.storage.local.set({
    [PAPER_GROUP_MODE_STORAGE_KEY]: state.paperGroupMode
  }).catch((error) => {
    console.debug("[Paper Toaster] Could not save dashboard grouping mode", error);
  });
  const groupingCriterion = getGroupingCriterion();
  if (state.sort === groupingCriterion) {
    state.sort = groupingCriterion === "label" ? "latestThread" : "label";
  }
  renderGroupLayoutButton();
  renderSortMenu();
  renderPapers();
});

elements.messageRingButton.addEventListener("click", () => {
  state.messageRingsVisible = !state.messageRingsVisible;
  chrome.storage.local.set({
    [PAPER_MESSAGE_RINGS_VISIBLE_STORAGE_KEY]: state.messageRingsVisible
  }).catch((error) => {
    console.debug("[Paper Toaster] Could not save message-ring visibility", error);
  });
  renderMessageRingButton();
  renderPapers();
});

bulkActions.attachEventListeners();

window.addEventListener("focus", () => {
  refreshAll().catch((error) => {
    console.debug("[PDF AI] Dashboard focus refresh failed", error);
  });
});

document.addEventListener("click", (event) => {
  if (elements.sortMenu.hidden || elements.sortMenu.contains(event.target) || elements.sortButton.contains(event.target)) {
    return;
  }

  setSortMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return;
  }

  if (
    event.key === "Enter" &&
    state.libraryView === LIBRARY_VIEW.BOARD &&
    !state.manageMode &&
    state.selectedDocumentKeys.size === 0 &&
    state.selectedComparisonIds.size === 0 &&
    (
      Boolean(state.activeDocumentKey) ||
      Boolean(state.activeComparisonId) ||
      state.activeComparisonDocumentKeys.size === 0
    ) &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.setManageMode(true);
    return;
  }

  if (
    event.key === "Enter" &&
    state.libraryView === LIBRARY_VIEW.BOARD &&
    state.manageMode &&
    bulkActions.getSelectedDocumentKeys().length > 0 &&
    !shouldIgnoreDashboardShortcut(event.target)
  ) {
    event.preventDefault();
    bulkActions.sendSelectedPapers().catch((error) => {
      elements.summary.textContent = `Could not send papers: ${error.message || String(error)}`;
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
    bulkActions.setManageMode(false);
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
  if (message?.type === MessageType.LIBRARY_PAPER_CONTEXT_CHANGED) {
    applyActiveDashboardContext(message.context);
    renderPapers();
    return;
  }

  if (message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED) {
    refreshRecords();
  }
});

initializeDashboard().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});

async function initializeDashboard() {
  await Promise.all([
    restorePaperGroupMode(),
    restoreMessageRingVisibility(),
    restoreLabelGroupOrder()
  ]).catch((error) => {
    console.debug("[Paper Toaster] Could not restore dashboard view preferences", error);
  });
  const groupingCriterion = getGroupingCriterion();
  if (state.sort === groupingCriterion) {
    state.sort = groupingCriterion === "label" ? "latestThread" : "label";
  }
  renderGroupLayoutButton();
  renderMessageRingButton();
  renderSortMenu();
  renderViewControls();
  await clearDashboardContext();
  await refreshAll();
}

async function restorePaperGroupMode() {
  const stored = await chrome.storage.local.get(PAPER_GROUP_MODE_STORAGE_KEY);
  const mode = stored[PAPER_GROUP_MODE_STORAGE_KEY];
  if (Object.values(PAPER_GROUP_MODE).includes(mode)) {
    state.paperGroupMode = mode;
  }
}

async function restoreMessageRingVisibility() {
  const stored = await chrome.storage.local.get(PAPER_MESSAGE_RINGS_VISIBLE_STORAGE_KEY);
  if (typeof stored[PAPER_MESSAGE_RINGS_VISIBLE_STORAGE_KEY] === "boolean") {
    state.messageRingsVisible = stored[PAPER_MESSAGE_RINGS_VISIBLE_STORAGE_KEY];
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
  const [allPapers, allComparisons] = await Promise.all([
    listLibraryPapers({
      view: state.libraryView,
      ...(SORT_CONFIG[state.sort] || SORT_CONFIG.latestThread)
    }),
    listDashboardComparisons(state.libraryView)
  ]);
  const displayablePapers = allPapers.filter(isDisplayablePaper);
  state.hasLocalPapers = displayablePapers.length > 0 || allComparisons.length > 0;
  state.papers = filterDashboardPapers(displayablePapers, state.query);
  state.comparisonMessageCountByDocumentKey = countComparisonMessagesByDocument(allComparisons);
  state.comparisons = filterDashboardComparisons(allComparisons, state.query);
  renderPapers();
  renderSummary();
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
    paperGroupMode: state.paperGroupMode,
    labelGroupOrder: state.labelGroupOrder,
    showMessageRings: state.libraryView === LIBRARY_VIEW.BOARD && state.messageRingsVisible,
    activeDocumentKey: state.activeDocumentKey,
    activeComparisonId: state.activeComparisonId,
    activeComparisonDocumentKeys: getActiveComparisonDocumentKeys(),
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
    onTogglePaperStarred: togglePaperStarred,
    onToggleComparisonStarred: toggleComparisonStarred,
    onUpdatePaperGroup: updatePaperGroup,
    onRenamePaperGroup: renamePaperGroup,
    onDeletePaperGroup: deletePaperGroup
  });
  renderKeyboardHint();
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
}

function persistLabelGroupOrder() {
  chrome.storage.local.set({
    [PAPER_LABEL_GROUP_ORDER_STORAGE_KEY]: state.labelGroupOrder
  }).catch((error) => {
    console.debug("[Paper Toaster] Could not save label-group order", error);
  });
}

function renderKeyboardHint() {
  const selectedPaperCount = bulkActions.getSelectedDocumentKeys().length;
  const showSelectionHint = state.libraryView === LIBRARY_VIEW.BOARD && state.manageMode && selectedPaperCount > 0;
  const showActivationHint = !state.manageMode &&
    state.paperGroupMode === PAPER_GROUP_MODE.LABEL &&
    Boolean(state.activeDocumentKey);
  const showMultiSelectHint = state.libraryView === LIBRARY_VIEW.BOARD &&
    !state.manageMode &&
    !state.activeDocumentKey &&
    !state.activeComparisonId &&
    state.activeComparisonDocumentKeys.size === 0 &&
    state.selectedDocumentKeys.size === 0 &&
    state.selectedComparisonIds.size === 0;
  elements.keyboardHint.hidden = !showSelectionHint && !showActivationHint && !showMultiSelectHint;
  elements.keyboardHint.replaceChildren();

  if (showSelectionHint) {
    elements.keyboardHint.append(
      "Press ",
      createShortcutLabel("↵", "Enter"),
      " for toasting"
    );
  } else if (showMultiSelectHint || showActivationHint) {
    elements.keyboardHint.append(
      "Press and hold a card to move it, OR, Press ",
      createShortcutLabel("↵"),
      " Enter for multi-selection"
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

  state.activeDocumentKey = documentKey;
  state.activeComparisonId = "";
  state.activeComparisonDocumentKeys = new Set();
  renderPapers();

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

  state.activeDocumentKey = "";
  state.activeComparisonId = comparisonId;
  state.activeComparisonDocumentKeys = getComparisonDocumentKeys(comparisonId);
  renderPapers();

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

async function updatePaperGroup(paper, group) {
  await setLibraryPaperGroup(paper.documentKey, group, paper, { scope: state.libraryView });
  notifyPaperActivityChanged(paper.documentKey);
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
  renderDashboardSortMenu({
    sortButton: elements.sortButton,
    sortMenu: elements.sortMenu,
    sortOptions: SORT_OPTIONS,
    activeSort: state.sort,
    groupingCriterion: getGroupingCriterion(),
    onSelectSort: async (option) => {
      state.sort = option.id;
      renderSortMenu();
      setSortMenuOpen(false);
      await refreshRecords();
    }
  });
}

function getGroupingCriterion() {
  return state.paperGroupMode === PAPER_GROUP_MODE.LABEL ? "label" : "latestThread";
}

function renderGroupLayoutButton() {
  const groupsByRecentConversation = state.paperGroupMode === PAPER_GROUP_MODE.RECENT_CONVERSATION;
  elements.groupLayoutButton.classList.remove("active");
  elements.groupLayoutButton.setAttribute("aria-pressed", String(groupsByRecentConversation));
  elements.groupLayoutButton.setAttribute(
    "aria-label",
    groupsByRecentConversation ? "Group papers by label" : "Group papers by latest conversation"
  );
}

function renderMessageRingButton() {
  const ringsHidden = !state.messageRingsVisible;
  elements.messageRingButton.classList.remove("active");
  elements.messageRingButton.classList.toggle("rings-hidden", ringsHidden);
  elements.messageRingButton.setAttribute("aria-pressed", String(ringsHidden));
  elements.messageRingButton.setAttribute("aria-label", ringsHidden ? "Show message rings" : "Hide message rings");
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
  elements.sortButton.closest(".sort-control").hidden = archiveView;
  elements.messageRingButton.hidden = archiveView;
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
    paper.group
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

function setSortMenuOpen(open) {
  elements.sortMenu.hidden = !open;
  elements.sortButton.setAttribute("aria-expanded", String(open));
  elements.sortButton.classList.toggle("active", open);
}

function shouldIgnoreDashboardEscape(target) {
  if (!elements.sortMenu.hidden) {
    setSortMenuOpen(false);
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
