import { listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";

const SORT_OPTIONS = [
  { id: "latestThread", label: "Latest thread", sortBy: "latestThread", sortDirection: "desc" },
  { id: "firstConversation", label: "First conversation", sortBy: "firstConversation", sortDirection: "asc" },
  { id: "title", label: "Title", sortBy: "title", sortDirection: "asc" },
  { id: "threadCount", label: "Thread count", sortBy: "threadCount", sortDirection: "desc" },
  { id: "messageCount", label: "Message count", sortBy: "messageCount", sortDirection: "desc" }
];

const SORT_CONFIG = {
  ...Object.fromEntries(SORT_OPTIONS.map((option) => [option.id, option]))
};

const state = {
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

document.addEventListener("click", (event) => {
  if (elements.sortMenu.hidden || elements.sortMenu.contains(event.target) || elements.sortButton.contains(event.target)) {
    return;
  }

  setSortMenuOpen(false);
});

refreshAll().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});
renderSortMenu();

async function refreshAll() {
  await refreshPapers();
}

async function refreshPapers() {
  state.papers = await listLibraryPapers({
    ...(SORT_CONFIG[state.sort] || SORT_CONFIG.latestThread),
    query: state.query
  });
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
  card.className = "paper-card";

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
  button.addEventListener("click", async () => {
    await setLibraryPaperStarred(paper.documentKey, !paper.starred, paper);
    await refreshPapers();
  });

  return button;
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
