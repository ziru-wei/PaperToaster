import { listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";
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
  { id: "starred", label: "Starred", sortBy: "starred", sortDirection: "desc" }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const state = {
  activeDocumentKey: "",
  papers: [],
  sort: "latestThread",
  query: "",
  manageMode: false,
  selectedDocumentKeys: new Set()
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
  refreshPapers();
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
    state.activeDocumentKey = String(message.context?.documentKey || "");
    renderPapers();
    return;
  }

  if (message?.type === MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED) {
    refreshPapers();
  }
});

refreshAll().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});
renderSortMenu();

async function refreshAll() {
  await refreshActivePaperContext();
  await refreshPapers();
}

async function refreshPapers() {
  const papers = await listLibraryPapers({
    ...(SORT_CONFIG[state.sort] || SORT_CONFIG.latestThread),
    query: state.query
  });
  state.papers = papers.filter(isDisplayablePaper);
  renderPapers();
  renderSummary();
}

function renderDashboard() {
  renderPapers();
  renderSummary();
}

function renderSummary() {
  const totalMessages = state.papers.reduce((sum, paper) => sum + paper.messageCount, 0);
  const selectedCount = bulkActions.getSelectedDocumentKeys().length;
  elements.summary.textContent = state.manageMode
    ? `${state.papers.length} papers · ${selectedCount} selected`
    : `${state.papers.length} papers · ${totalMessages} messages`;
  bulkActions.renderBulkActions();
}

function renderPapers() {
  renderPaperList({
    container: elements.paperList,
    emptyState: elements.emptyState,
    papers: state.papers,
    activeDocumentKey: state.activeDocumentKey,
    manageMode: state.manageMode,
    selectedDocumentKeys: state.selectedDocumentKeys,
    onOpenPaperContext: openPaperContextInSidePanel,
    onTogglePaperSelection: bulkActions.togglePaperSelection,
    onSetPaperSelected: bulkActions.setPaperSelected,
    onTogglePaperStarred: togglePaperStarred
  });
}

async function openPaperContextInSidePanel(documentKey) {
  if (!documentKey) {
    return;
  }

  state.activeDocumentKey = documentKey;
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

async function refreshActivePaperContext() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: MessageType.GET_LIBRARY_PAPER_CONTEXT
    });
    state.activeDocumentKey = String(response?.context?.documentKey || "");
  } catch (error) {
    console.debug("[PDF AI] Could not read active paper context", error);
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
  await setLibraryPaperStarred(paper.documentKey, !paper.starred, paper);
  notifyPaperActivityChanged(paper.documentKey);
  await refreshPapers();
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
      await refreshPapers();
    }
  });
}

async function handlePapersDeleted(documentKeys) {
  if (documentKeys.includes(state.activeDocumentKey)) {
    state.activeDocumentKey = "";
  }

  for (const documentKey of documentKeys) {
    notifyPaperActivityChanged(documentKey);
  }
  await refreshPapers();
}

function setSortMenuOpen(open) {
  elements.sortMenu.hidden = !open;
  elements.sortButton.setAttribute("aria-expanded", String(open));
  elements.sortButton.classList.toggle("active", open);
}
