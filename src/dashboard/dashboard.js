import { listLibraryLabels, listLibraryPapers } from "../storage/library-store.js";
import {
  assignLabelToPaper,
  createLabel,
  deleteLabel,
  removeLabelFromPaper,
  reorderLabels,
  updateLabel
} from "../storage/label-store.js";

const SORT_CONFIG = {
  latestActivity: { sortBy: "latestActivity", sortDirection: "desc" },
  firstConversation: { sortBy: "firstConversation", sortDirection: "asc" },
  title: { sortBy: "title", sortDirection: "asc" },
  label: { sortBy: "label", sortDirection: "asc" },
  recentlyOpened: { sortBy: "recentlyOpened", sortDirection: "desc" },
  largestPdf: { sortBy: "largestPdf", sortDirection: "desc" },
  mostMessages: { sortBy: "mostMessages", sortDirection: "desc" }
};

const state = {
  papers: [],
  labels: [],
  filterLabelId: "all",
  sort: "latestActivity",
  query: "",
  managingLabels: false
};

const elements = {
  summary: document.querySelector("#librarySummary"),
  search: document.querySelector("#paperSearch"),
  sort: document.querySelector("#paperSort"),
  labelFilters: document.querySelector("#labelFilters"),
  manageLabels: document.querySelector("#manageLabels"),
  labelManager: document.querySelector("#labelManager"),
  newLabelForm: document.querySelector("#newLabelForm"),
  newLabelName: document.querySelector("#newLabelName"),
  newLabelColor: document.querySelector("#newLabelColor"),
  labelManagerList: document.querySelector("#labelManagerList"),
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

elements.manageLabels.addEventListener("click", () => {
  state.managingLabels = !state.managingLabels;
  renderLabelManager();
});

elements.newLabelForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createLabel({
    name: elements.newLabelName.value,
    color: elements.newLabelColor.value
  });
  elements.newLabelName.value = "";
  await refreshAll();
});

refreshAll().catch((error) => {
  elements.summary.textContent = `Could not load dashboard: ${error.message || String(error)}`;
});

async function refreshAll() {
  state.labels = await listLibraryLabels();
  await refreshPapers();
  renderLabels();
  renderLabelManager();
}

async function refreshPapers() {
  state.papers = await listLibraryPapers({
    ...(SORT_CONFIG[state.sort] || SORT_CONFIG.latestActivity),
    labelId: state.filterLabelId,
    query: state.query
  });
  renderPapers();
  renderSummary();
}

function renderSummary() {
  const totalMessages = state.papers.reduce((sum, paper) => sum + paper.messageCount, 0);
  elements.summary.textContent = `${state.papers.length} papers · ${totalMessages} messages`;
}

function renderLabels() {
  elements.labelFilters.replaceChildren();
  elements.labelFilters.append(
    createLabelFilter({ labelId: "all", name: "All" }),
    createLabelFilter({ labelId: "unlabeled", name: "Unlabeled" }),
    ...state.labels.map((label) => createLabelFilter(label))
  );
}

function createLabelFilter(label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "label-filter";
  button.classList.toggle("active", state.filterLabelId === label.labelId);
  button.textContent = label.name;
  if (label.color && label.labelId !== state.filterLabelId) {
    button.style.background = label.color;
  }
  button.addEventListener("click", async () => {
    state.filterLabelId = label.labelId;
    renderLabels();
    await refreshPapers();
  });
  return button;
}

function renderLabelManager() {
  elements.labelManager.hidden = !state.managingLabels;
  elements.manageLabels.textContent = state.managingLabels ? "Done" : "Manage labels";
  elements.labelManagerList.replaceChildren(...state.labels.map((label, index) => createLabelManagerRow(label, index)));
}

function createLabelManagerRow(label, index) {
  const row = document.createElement("div");
  row.className = "label-manager-row";

  const swatch = document.createElement("span");
  swatch.className = "label-swatch";
  swatch.style.background = label.color || "#eef2f7";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = label.name;
  nameInput.maxLength = 40;
  nameInput.addEventListener("change", async () => {
    await updateLabel(label.labelId, { name: nameInput.value });
    await refreshAll();
  });

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = label.color || "#eef2f7";
  colorInput.addEventListener("change", async () => {
    await updateLabel(label.labelId, { color: colorInput.value });
    await refreshAll();
  });

  const upButton = createSmallButton("Up", async () => moveLabel(index, -1));
  const downButton = createSmallButton("Down", async () => moveLabel(index, 1));
  const deleteButton = createSmallButton("Delete", async () => {
    await deleteLabel(label.labelId);
    if (state.filterLabelId === label.labelId) {
      state.filterLabelId = "all";
    }
    await refreshAll();
  });

  upButton.disabled = index === 0;
  downButton.disabled = index === state.labels.length - 1;
  row.append(swatch, nameInput, colorInput, upButton, downButton, deleteButton);
  return row;
}

async function moveLabel(index, direction) {
  const labels = [...state.labels];
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= labels.length) {
    return;
  }

  const [label] = labels.splice(index, 1);
  labels.splice(targetIndex, 0, label);
  await reorderLabels(labels.map((item) => item.labelId));
  await refreshAll();
}

function renderPapers() {
  elements.paperList.replaceChildren(...state.papers.map(createPaperCard));
  elements.emptyState.hidden = state.papers.length > 0;
}

function createPaperCard(paper) {
  const card = document.createElement("article");
  card.className = "paper-card";

  const main = document.createElement("div");
  const title = document.createElement("h2");
  title.className = "paper-title";
  title.textContent = paper.title;

  const url = document.createElement("div");
  url.className = "paper-url";
  url.textContent = paper.canonicalUrl || paper.documentKey;

  const meta = document.createElement("div");
  meta.className = "paper-meta";
  meta.append(
    createMetaText(`${paper.threadCount} threads`),
    createMetaText(`${paper.messageCount} messages`),
    createMetaText(paper.hasMarkdown ? "Context ready" : "Metadata only", paper.hasMarkdown ? "status-pill" : ""),
    createMetaText(`First ${formatTime(paper.firstConversationAt)}`),
    createMetaText(`Latest ${formatTime(paper.lastConversationAt || paper.updatedAt)}`),
    createMetaText(formatPdfSize(paper.byteLength))
  );

  const labels = document.createElement("div");
  labels.className = "paper-labels";
  labels.append(...paper.labels.map((label) => createPaperLabelChip(paper, label)));
  if (!paper.labels.length) {
    labels.append(createMetaText("Unlabeled"));
  }

  main.append(title, url, meta, labels);

  const actions = document.createElement("div");
  actions.className = "paper-actions";
  actions.append(createOpenButton(paper), createAssignLabelSelect(paper));

  card.append(main, actions);
  return card;
}

function createPaperLabelChip(paper, label) {
  const chip = document.createElement("span");
  chip.className = "paper-label-chip";
  chip.style.background = label.color || "#eef2f7";

  const name = document.createElement("span");
  name.textContent = label.name;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.title = `Remove ${label.name}`;
  removeButton.setAttribute("aria-label", `Remove ${label.name}`);
  removeButton.textContent = "×";
  removeButton.addEventListener("click", async () => {
    await removeLabelFromPaper(paper.documentKey, label.labelId);
    await refreshAll();
  });

  chip.append(name, removeButton);
  return chip;
}

function createOpenButton(paper) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Open";
  button.disabled = !paper.canonicalUrl;
  button.addEventListener("click", () => {
    if (paper.canonicalUrl) {
      chrome.tabs.create({ url: paper.canonicalUrl });
    }
  });
  return button;
}

function createAssignLabelSelect(paper) {
  const select = document.createElement("select");
  select.setAttribute("aria-label", `Assign label to ${paper.title}`);

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Label";
  select.append(placeholder);

  for (const label of state.labels) {
    if (paper.labels.some((assigned) => assigned.labelId === label.labelId)) {
      continue;
    }

    const option = document.createElement("option");
    option.value = label.labelId;
    option.textContent = label.name;
    select.append(option);
  }

  select.disabled = state.labels.length === paper.labels.length;
  select.addEventListener("change", async () => {
    if (select.value) {
      await assignLabelToPaper(paper.documentKey, select.value);
      select.value = "";
      await refreshAll();
    }
  });
  return select;
}

function createMetaText(text, className = "") {
  const span = document.createElement("span");
  if (className) {
    span.className = className;
  }
  span.textContent = text;
  return span;
}

function createSmallButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-text-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
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

function formatPdfSize(byteLength) {
  const bytes = Number(byteLength) || 0;
  if (!bytes) {
    return "Size unknown";
  }

  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
}
