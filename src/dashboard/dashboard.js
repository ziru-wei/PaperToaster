import { listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";
import {
  deleteLibraryPapers,
  exportLibraryPapers,
  importLibraryArchive
} from "../storage/library-archive-store.js";
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
  editMode: false,
  selectedDocumentKeys: new Set()
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  importButton: document.querySelector("#paperImportButton"),
  importFile: document.querySelector("#paperImportFile"),
  editButton: document.querySelector("#paperEditButton"),
  bulkActions: document.querySelector("#bulkActions"),
  selectionSummary: document.querySelector("#selectionSummary"),
  selectAllButton: document.querySelector("#selectAllButton"),
  backupAllButton: document.querySelector("#backupAllButton"),
  archiveSelectedButton: document.querySelector("#archiveSelectedButton"),
  deleteSelectedButton: document.querySelector("#deleteSelectedButton"),
  sortButton: document.querySelector("#paperSortButton"),
  sortMenu: document.querySelector("#paperSortMenu"),
  paperList: document.querySelector("#paperList"),
  emptyState: document.querySelector("#emptyState")
};

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  refreshPapers();
});

elements.sortButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setSortMenuOpen(elements.sortMenu.hidden);
});

elements.importButton.addEventListener("click", () => {
  elements.importFile.click();
});

elements.importFile.addEventListener("change", () => {
  importArchiveFile(elements.importFile.files?.[0]).catch((error) => {
    elements.summary.textContent = `Could not import archive: ${error.message || String(error)}`;
  }).finally(() => {
    elements.importFile.value = "";
  });
});

elements.editButton.addEventListener("click", () => {
  setEditMode(!state.editMode);
});

elements.selectAllButton.addEventListener("click", () => {
  selectAllVisiblePapers();
});

elements.backupAllButton.addEventListener("click", () => {
  backupAllPapers().catch((error) => {
    elements.summary.textContent = `Could not back up papers: ${error.message || String(error)}`;
  });
});

elements.archiveSelectedButton.addEventListener("click", () => {
  archiveSelectedPapers().catch((error) => {
    elements.summary.textContent = `Could not archive papers: ${error.message || String(error)}`;
  });
});

elements.deleteSelectedButton.addEventListener("click", () => {
  deleteSelectedPapers().catch((error) => {
    elements.summary.textContent = `Could not delete papers: ${error.message || String(error)}`;
  });
});

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

function renderSummary() {
  const totalMessages = state.papers.reduce((sum, paper) => sum + paper.messageCount, 0);
  const selectedCount = getSelectedDocumentKeys().length;
  elements.summary.textContent = state.editMode
    ? `${state.papers.length} papers · ${selectedCount} selected`
    : `${state.papers.length} papers · ${totalMessages} messages`;
  renderBulkActions();
}

function renderPapers() {
  const maxMessageCount = getMaxMessageCount();
  elements.paperList.replaceChildren(...state.papers.map((paper) => createPaperCard(paper, maxMessageCount)));
  elements.emptyState.hidden = state.papers.length > 0;
}

function createPaperCard(paper, maxMessageCount) {
  const card = document.createElement("article");
  const isActive = paper.documentKey === state.activeDocumentKey;
  card.className = "paper-card";
  card.classList.toggle("active", isActive);
  card.classList.toggle("editing", state.editMode);
  card.classList.toggle("selected", state.selectedDocumentKeys.has(paper.documentKey));
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", String(state.editMode ? state.selectedDocumentKeys.has(paper.documentKey) : isActive));
  card.setAttribute("aria-label", state.editMode
    ? `Select ${paper.title || "paper"}`
    : `Open side panel context for ${paper.title || "paper"}`);
  card.addEventListener("click", (event) => {
    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (state.editMode) {
      togglePaperSelection(paper.documentKey);
      return;
    }

    openPaperContextInSidePanel(paper.documentKey);
  });
  card.addEventListener("keydown", (event) => {
    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (state.editMode) {
      togglePaperSelection(paper.documentKey);
      return;
    }

    openPaperContextInSidePanel(paper.documentKey);
  });

  const main = document.createElement("div");
  main.className = "paper-main";

  const topRow = document.createElement("div");
  topRow.className = "paper-top-row";

  const title = document.createElement("h2");
  title.className = "paper-title";
  title.append(createTitleLink(paper));

  topRow.append(title, createMessageRing(paper, maxMessageCount));

  const footer = document.createElement("div");
  footer.className = "paper-footer";

  const time = createPaperTimeLine(paper);
  if (time) {
    footer.append(time);
  }
  footer.append(createStarButton(paper));

  main.append(topRow, footer);
  if (state.editMode) {
    card.append(createPaperCheckbox(paper));
  }
  card.append(main);
  return card;
}

function createPaperCheckbox(paper) {
  const label = document.createElement("label");
  label.className = "paper-select";
  label.title = `Select ${paper.title || "paper"}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = state.selectedDocumentKeys.has(paper.documentKey);
  checkbox.setAttribute("aria-label", `Select ${paper.title || "paper"}`);
  checkbox.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  checkbox.addEventListener("change", () => {
    setPaperSelected(paper.documentKey, checkbox.checked);
  });

  label.append(checkbox);
  label.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  return label;
}

function createMessageRing(paper, maxMessageCount) {
  const ring = document.createElement("span");
  const count = Number(paper.messageCount) || 0;
  const ratio = maxMessageCount > 0 ? count / maxMessageCount : 0;
  ring.className = "message-ring";
  ring.classList.toggle("empty", count === 0);
  ring.style.setProperty("--message-ratio", ratio.toFixed(3));
  ring.title = `${count} messages`;
  ring.setAttribute("aria-label", `${count} messages`);
  return ring;
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

function isDisplayablePaper(paper) {
  const title = normalizeTitleForDisplay(paper?.title);
  return title && !isPlaceholderTitle(title);
}

function normalizeTitleForDisplay(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isCardActionIgnored(target) {
  return Boolean(target?.closest?.(".paper-star, .paper-select"));
}

function isPlaceholderTitle(title) {
  return title === "untitled paper" || title === "title not found";
}

function createTitleLink(paper) {
  const link = document.createElement("a");
  link.className = "paper-title-link";
  link.textContent = paper.title;
  link.title = paper.canonicalUrl || paper.documentKey;
  if (paper.canonicalUrl) {
    link.href = paper.canonicalUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  link.addEventListener("click", (event) => {
    if (state.editMode) {
      event.preventDefault();
    }
  });
  return link;
}

function createPaperTimeLine(paper) {
  if (!paper.threadCount) {
    return null;
  }

  const line = document.createElement("div");
  line.className = "paper-time-line";
  if (paper.threadCount > 1) {
    line.textContent = `First ${formatTime(paper.firstThreadStartedAt)} · Last ${formatTime(paper.lastThreadStartedAt)}`;
  } else {
    line.textContent = `Started ${formatTime(paper.firstThreadStartedAt)}`;
  }
  return line;
}

function createStarButton(paper) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-star";
  button.classList.toggle("starred", paper.starred);
  button.title = paper.starred ? "Unstar paper" : "Star paper";
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await setLibraryPaperStarred(paper.documentKey, !paper.starred, paper);
    notifyPaperActivityChanged(paper.documentKey);
    await refreshPapers();
  });

  return button;
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

function renderSortMenu() {
  const activeOption = SORT_OPTIONS.find((option) => option.id === state.sort) || SORT_OPTIONS[0];
  elements.sortButton.title = `Sort: ${activeOption.label}`;
  elements.sortMenu.replaceChildren(...SORT_OPTIONS.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-menu-option";
    button.classList.toggle("active", option.id === state.sort);
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(option.id === state.sort));
    button.textContent = option.label;
    button.addEventListener("click", async () => {
      state.sort = option.id;
      renderSortMenu();
      setSortMenuOpen(false);
      await refreshPapers();
    });
    return button;
  }));
}

function renderBulkActions() {
  const selectedCount = getSelectedDocumentKeys().length;
  const allVisibleSelected = state.papers.length > 0 && selectedCount === state.papers.length;
  elements.bulkActions.hidden = !state.editMode;
  elements.selectionSummary.textContent = `${selectedCount} selected`;
  elements.selectAllButton.textContent = allVisibleSelected ? "Clear" : "Select all";
  elements.selectAllButton.disabled = state.papers.length === 0;
  elements.backupAllButton.disabled = state.papers.length === 0;
  elements.archiveSelectedButton.disabled = selectedCount === 0;
  elements.deleteSelectedButton.disabled = selectedCount === 0;
  elements.editButton.textContent = state.editMode ? "Done" : "Edit";
  elements.editButton.classList.toggle("active", state.editMode);
}

function setEditMode(editMode) {
  state.editMode = Boolean(editMode);
  if (!state.editMode) {
    state.selectedDocumentKeys.clear();
  }

  renderPapers();
  renderSummary();
}

function togglePaperSelection(documentKey) {
  setPaperSelected(documentKey, !state.selectedDocumentKeys.has(documentKey));
}

function setPaperSelected(documentKey, selected) {
  if (!documentKey) {
    return;
  }

  if (selected) {
    state.selectedDocumentKeys.add(documentKey);
  } else {
    state.selectedDocumentKeys.delete(documentKey);
  }

  renderPapers();
  renderSummary();
}

function selectAllVisiblePapers() {
  const visibleKeys = state.papers.map((paper) => paper.documentKey).filter(Boolean);
  const selectedVisibleCount = getSelectedDocumentKeys().length;
  const shouldSelectAll = selectedVisibleCount !== visibleKeys.length;
  state.selectedDocumentKeys.clear();

  if (shouldSelectAll) {
    for (const documentKey of visibleKeys) {
      state.selectedDocumentKeys.add(documentKey);
    }
  }

  renderPapers();
  renderSummary();
}

async function archiveSelectedPapers() {
  const selectedKeys = getSelectedDocumentKeys();
  if (!selectedKeys.length || !window.confirm(`Archive ${selectedKeys.length} selected paper(s)? This downloads a restorable archive, then removes them from the dashboard.`)) {
    return;
  }

  const archive = await exportLibraryPapers(selectedKeys);
  downloadArchiveFile(archive);
  await deleteLibraryPapers(selectedKeys);
  await afterBulkMutation(selectedKeys);
}

async function deleteSelectedPapers() {
  const selectedKeys = getSelectedDocumentKeys();
  if (!selectedKeys.length || !window.confirm(`Delete ${selectedKeys.length} selected paper(s)? This removes their local markdown and conversations.`)) {
    return;
  }

  await deleteLibraryPapers(selectedKeys);
  await afterBulkMutation(selectedKeys);
}

async function backupAllPapers() {
  const papers = await getAllDisplayablePapers();
  const documentKeys = papers.map((paper) => paper.documentKey).filter(Boolean);
  if (!documentKeys.length) {
    return;
  }

  const archive = await exportLibraryPapers(documentKeys);
  downloadArchiveFile(archive, "backup");
}

async function importArchiveFile(file) {
  if (!file) {
    return;
  }

  const archive = JSON.parse(await file.text());
  const result = await importLibraryArchive(archive);
  state.selectedDocumentKeys.clear();
  await refreshAll();
  const summary = `Added ${result.importedPaperCount} papers · skipped ${result.skippedPaperCount} existing`;
  elements.summary.textContent = summary;
  window.alert(`Import complete.\n${summary}`);
}

function downloadArchiveFile(archive, kind = "archive") {
  const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `reading-dashboard-${kind}-${date}-${archive.documentKeys.length}-papers.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function afterBulkMutation(documentKeys) {
  if (documentKeys.includes(state.activeDocumentKey)) {
    state.activeDocumentKey = "";
  }

  setEditMode(false);
  for (const documentKey of documentKeys) {
    notifyPaperActivityChanged(documentKey);
  }
  await refreshPapers();
}

function getSelectedDocumentKeys() {
  const visibleKeys = new Set(state.papers.map((paper) => paper.documentKey));
  return [...state.selectedDocumentKeys].filter((documentKey) => visibleKeys.has(documentKey));
}

async function getAllDisplayablePapers() {
  const papers = await listLibraryPapers(SORT_CONFIG[state.sort] || SORT_CONFIG.latestThread);
  return papers.filter(isDisplayablePaper);
}

function getMaxMessageCount() {
  return state.papers.reduce((max, paper) => Math.max(max, Number(paper.messageCount) || 0), 0);
}

function setSortMenuOpen(open) {
  elements.sortMenu.hidden = !open;
  elements.sortButton.setAttribute("aria-expanded", String(open));
  elements.sortButton.classList.toggle("active", open);
}

function formatTime(value) {
  const timestamp = Number(value) || 0;
  if (!timestamp) {
    return "none";
  }

  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  if (date.toDateString() === now.toDateString()) {
    return `Today ${time}`;
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${time}`;
  }

  const day = date.toLocaleDateString([], { month: "short", day: "2-digit" });
  return `${day} ${time}`;
}
