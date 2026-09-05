import { listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";
import { MessageType } from "../shared/messages.js";

const SORT_OPTIONS = [
  { id: "latestThread", label: "Latest thread", sortBy: "latestThread", sortDirection: "desc" },
  { id: "firstConversation", label: "First conversation", sortBy: "firstConversation", sortDirection: "asc" },
  { id: "messageCount", label: "Message count", sortBy: "messageCount", sortDirection: "desc" },
  { id: "starred", label: "Starred", sortBy: "starred", sortDirection: "desc" },
  { id: "title", label: "Title", sortBy: "title", sortDirection: "asc" }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const state = {
  activeDocumentKey: "",
  papers: [],
  sort: "latestThread",
  query: ""
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
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
  elements.summary.textContent = `${state.papers.length} papers · ${totalMessages} messages`;
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
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", String(isActive));
  card.setAttribute("aria-label", `Open side panel context for ${paper.title || "paper"}`);
  card.addEventListener("click", (event) => {
    if (isCardActionIgnored(event.target)) {
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
  card.append(main);
  return card;
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
  return Boolean(target?.closest?.(".paper-star"));
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
