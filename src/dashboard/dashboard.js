import { getLibraryPaperSummary, listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";
import { listComparisonSessions, setComparisonSessionStarred } from "../storage/comparison-store.js";
import { createDashboardBulkActions } from "./dashboard-bulk-actions.js";
import {
  isDisplayablePaper,
  renderPaperList,
  renderSortMenu as renderDashboardSortMenu
} from "./dashboard-renderer.js";
import { MessageType } from "../shared/messages.js";

const SORT_OPTIONS = [
  { id: "latestThread", label: "Latest ask", sortBy: "latestThread", sortDirection: "desc" },
  { id: "firstConversation", label: "Early ask", sortBy: "firstConversation", sortDirection: "asc" },
  { id: "messageCount", label: "Message count", sortBy: "messageCount", sortDirection: "desc" },
  { id: "type", label: "Type", sortBy: "type", sortDirection: "asc" },
  { id: "starred", label: "Starred", sortBy: "starred", sortDirection: "desc" }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const state = {
  activeDocumentKey: "",
  activeComparisonId: "",
  activeComparisonDocumentKeys: new Set(),
  papers: [],
  comparisons: [],
  sort: "latestThread",
  query: "",
  manageMode: false,
  selectedDocumentKeys: new Set(),
  selectedComparisonIds: new Set()
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  importButton: document.querySelector("#paperImportButton"),
  importFile: document.querySelector("#paperImportFile"),
  manageButton: document.querySelector("#paperManageButton"),
  bulkActions: document.querySelector("#bulkActions"),
  selectionSummary: document.querySelector("#selectionSummary"),
  selectAllButton: document.querySelector("#selectAllButton"),
  backupSelectedButton: document.querySelector("#backupSelectedButton"),
  archiveSelectedButton: document.querySelector("#archiveSelectedButton"),
  deleteSelectedButton: document.querySelector("#deleteSelectedButton"),
  sortButton: document.querySelector("#paperSortButton"),
  sortMenu: document.querySelector("#paperSortMenu"),
  paperList: document.querySelector("#paperList"),
  emptyState: document.querySelector("#emptyState")
};

const bulkActions = createDashboardBulkActions({
  state,
  elements,
  onDeleteComplete: handlePapersDeleted,
  onRenderRequested: renderDashboard,
  onRefreshAllRequested: refreshAll
});

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  refreshRecords();
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
renderSortMenu();

async function initializeDashboard() {
  await clearDashboardContext();
  await refreshAll();
}

async function refreshAll() {
  await refreshActivePaperContext();
  await refreshRecords();
}

async function refreshRecords() {
  const papers = await listLibraryPapers({
    ...(SORT_CONFIG[state.sort] || SORT_CONFIG.latestThread),
    query: state.query
  });
  state.papers = papers.filter(isDisplayablePaper);
  state.comparisons = await listDashboardComparisons(state.query);
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
  const selectedCount = bulkActions.getSelectedDocumentKeys().length + bulkActions.getSelectedComparisonIds().length;
  elements.summary.textContent = state.manageMode
    ? `${state.papers.length} papers · ${selectedCount} selected`
    : `${state.papers.length} papers · ${state.comparisons.length} comparisons · ${totalMessages + totalComparisonMessages} messages`;
  bulkActions.renderBulkActions();
}

function renderPapers() {
  renderPaperList({
    container: elements.paperList,
    emptyState: elements.emptyState,
    papers: state.papers,
    comparisons: state.comparisons,
    sortId: state.sort,
    activeDocumentKey: state.activeDocumentKey,
    activeComparisonId: state.activeComparisonId,
    activeComparisonDocumentKeys: getActiveComparisonDocumentKeys(),
    manageMode: state.manageMode,
    selectedDocumentKeys: state.selectedDocumentKeys,
    selectedComparisonIds: state.selectedComparisonIds,
    onOpenPaperContext: openPaperContextInSidePanel,
    onOpenComparisonContext: openComparisonContextInSidePanel,
    onTogglePaperSelection: bulkActions.togglePaperSelection,
    onSetPaperSelected: bulkActions.setPaperSelected,
    onToggleComparisonSelection: bulkActions.toggleComparisonSelection,
    onSetComparisonSelected: bulkActions.setComparisonSelected,
    onTogglePaperStarred: togglePaperStarred,
    onToggleComparisonStarred: toggleComparisonStarred,
    onAddPaperToComparison: addPaperToComparison
  });
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

async function addPaperToComparison(documentKey) {
  if (!documentKey) {
    return;
  }

  state.activeDocumentKey = "";
  renderPapers();

  try {
    const response = await chrome.runtime.sendMessage({
      type: MessageType.ADD_PAPER_TO_ACTIVE_COMPARISON,
      documentKey
    });
    applyActiveDashboardContext(response?.context);
  } catch (error) {
    console.debug("[PDF AI] Could not add paper to comparative reading", error);
  } finally {
    renderPapers();
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

async function clearDashboardContext() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: MessageType.CLEAR_DASHBOARD_CONTEXT
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
    onSelectSort: async (option) => {
      state.sort = option.id;
      renderSortMenu();
      setSortMenuOpen(false);
      await refreshRecords();
    }
  });
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

async function listDashboardComparisons(query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const sessions = await listComparisonSessions();
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
      starredAt: session.starredAt || null
    };

    if (!normalizedQuery || matchesComparisonQuery(comparison, normalizedQuery)) {
      summaries.push(comparison);
    }
  }

  return summaries;
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
