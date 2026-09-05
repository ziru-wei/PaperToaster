import { listLibraryPapers, setLibraryPaperStarred } from "../storage/library-store.js";

const SORT_CONFIG = {
  lastOpened: { sortBy: "lastOpened", sortDirection: "desc" },
  firstOpened: { sortBy: "firstOpened", sortDirection: "asc" },
  firstConversation: { sortBy: "firstConversation", sortDirection: "asc" },
  title: { sortBy: "title", sortDirection: "asc" },
  threadCount: { sortBy: "threadCount", sortDirection: "desc" },
  messageCount: { sortBy: "messageCount", sortDirection: "desc" }
};

const state = {
  papers: [],
  sort: "lastOpened",
  query: ""
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  sort: document.querySelector("#paperSort"),
  paperList: document.querySelector("#paperList"),
  emptyState: document.querySelector("#emptyState")
};

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  refreshPapers();
});

elements.sort.addEventListener("change", () => {
  state.sort = elements.sort.value;
  refreshPapers();
});

refreshAll().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});

async function refreshAll() {
  await refreshPapers();
}

async function refreshPapers() {
  state.papers = await listLibraryPapers({
    ...(SORT_CONFIG[state.sort] || SORT_CONFIG.lastOpened),
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
  elements.paperList.replaceChildren(...state.papers.map(createPaperCard));
  elements.emptyState.hidden = state.papers.length > 0;
}

function createPaperCard(paper) {
  const card = document.createElement("article");
  card.className = "paper-card";

  const main = document.createElement("div");
  main.className = "paper-main";

  const topRow = document.createElement("div");
  topRow.className = "paper-top-row";

  const title = document.createElement("h2");
  title.className = "paper-title";
  title.textContent = paper.title;

  const time = createPaperTimeBlock(paper);
  topRow.append(title, time);

  const url = document.createElement("div");
  url.className = "paper-source-row";
  url.append(createContextIndicator(paper), createUrlLink(paper), createCopyUrlButton(paper));

  const meta = document.createElement("div");
  meta.className = "paper-meta";
  meta.append(
    createMetaText(`${paper.threadCount} threads`),
    createMetaText(`${paper.messageCount} messages`)
  );

  main.append(topRow, url, meta);

  card.append(main, createStarButton(paper));
  return card;
}

function createContextIndicator(paper) {
  const indicator = document.createElement("span");
  indicator.className = paper.hasMarkdown ? "paper-context-check ready" : "paper-context-check";
  indicator.title = paper.hasMarkdown ? "Context ready" : "Context not ready";
  indicator.setAttribute("aria-label", indicator.title);
  return indicator;
}

function createUrlLink(paper) {
  const link = document.createElement("a");
  link.className = "paper-url";
  link.textContent = paper.canonicalUrl || paper.documentKey;
  link.title = paper.canonicalUrl || paper.documentKey;
  if (paper.canonicalUrl) {
    link.href = paper.canonicalUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
}

function createCopyUrlButton(paper) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-copy-url";
  button.title = "Copy URL";
  button.setAttribute("aria-label", "Copy URL");
  button.disabled = !paper.canonicalUrl;
  button.addEventListener("click", async () => {
    if (!paper.canonicalUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(paper.canonicalUrl);
      button.classList.add("copied");
      window.setTimeout(() => button.classList.remove("copied"), 700);
    } catch {
      button.classList.remove("copied");
    }
  });
  return button;
}

function createPaperTimeBlock(paper) {
  const block = document.createElement("div");
  block.className = "paper-time-block";
  const first = paper.firstConversationAt || paper.firstOpenedAt;
  const latest = paper.lastConversationAt || paper.lastOpenedAt || paper.updatedAt;

  const firstRow = document.createElement("span");
  firstRow.textContent = `First ${formatTime(first)}`;
  const latestRow = document.createElement("span");
  latestRow.textContent = `Latest ${formatTime(latest)}`;
  block.append(firstRow, latestRow);
  return block;
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

function createMetaText(text, className = "") {
  const span = document.createElement("span");
  if (className) {
    span.className = className;
  }
  span.textContent = text;
  return span;
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
