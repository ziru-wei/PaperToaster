export function renderPaperList({
  container,
  emptyState,
  papers,
  activeDocumentKey,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onTogglePaperSelection,
  onSetPaperSelected,
  onTogglePaperStarred
}) {
  const maxMessageCount = getMaxMessageCount(papers);
  container.replaceChildren(...papers.map((paper) => createPaperCard({
    paper,
    maxMessageCount,
    activeDocumentKey,
    manageMode,
    selectedDocumentKeys,
    onOpenPaperContext,
    onTogglePaperSelection,
    onSetPaperSelected,
    onTogglePaperStarred
  })));
  emptyState.hidden = papers.length > 0;
}

export function renderSortMenu({ sortButton, sortMenu, sortOptions, activeSort, onSelectSort }) {
  const activeOption = sortOptions.find((option) => option.id === activeSort) || sortOptions[0];
  sortButton.title = `Sort: ${activeOption.label}`;
  sortMenu.replaceChildren(...sortOptions.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-menu-option";
    button.classList.toggle("active", option.id === activeSort);
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(option.id === activeSort));
    button.textContent = option.label;
    button.addEventListener("click", () => onSelectSort(option));
    return button;
  }));
}

export function isDisplayablePaper(paper) {
  const title = normalizeTitleForDisplay(paper?.title);
  return title && !isPlaceholderTitle(title);
}

function createPaperCard({
  paper,
  maxMessageCount,
  activeDocumentKey,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onTogglePaperSelection,
  onSetPaperSelected,
  onTogglePaperStarred
}) {
  const card = document.createElement("article");
  const isActive = paper.documentKey === activeDocumentKey;
  const isSelected = selectedDocumentKeys.has(paper.documentKey);
  card.className = "paper-card";
  card.classList.toggle("active", isActive);
  card.classList.toggle("editing", manageMode);
  card.classList.toggle("selected", isSelected);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", String(manageMode ? isSelected : isActive));
  card.setAttribute("aria-label", manageMode
    ? `Select ${paper.title || "paper"}`
    : `Open side panel context for ${paper.title || "paper"}`);
  card.addEventListener("click", (event) => {
    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (manageMode) {
      onTogglePaperSelection(paper.documentKey);
      return;
    }

    onOpenPaperContext(paper.documentKey);
  });
  card.addEventListener("keydown", (event) => {
    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (manageMode) {
      onTogglePaperSelection(paper.documentKey);
      return;
    }

    onOpenPaperContext(paper.documentKey);
  });

  const main = document.createElement("div");
  main.className = "paper-main";

  const topRow = document.createElement("div");
  topRow.className = "paper-top-row";

  const title = document.createElement("h2");
  title.className = "paper-title";
  title.append(createTitleLink(paper, manageMode));

  topRow.append(title, createMessageRing(paper, maxMessageCount));

  const footer = document.createElement("div");
  footer.className = "paper-footer";

  const time = createPaperTimeLine(paper);
  if (time) {
    footer.append(time);
  }
  footer.append(createStarButton(paper, onTogglePaperStarred));

  main.append(topRow, footer);
  if (manageMode) {
    card.append(createPaperCheckbox(paper, selectedDocumentKeys, onSetPaperSelected));
  }
  card.append(main);
  return card;
}

function createPaperCheckbox(paper, selectedDocumentKeys, onSetPaperSelected) {
  const label = document.createElement("label");
  label.className = "paper-select";
  label.title = `Select ${paper.title || "paper"}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedDocumentKeys.has(paper.documentKey);
  checkbox.setAttribute("aria-label", `Select ${paper.title || "paper"}`);
  checkbox.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  checkbox.addEventListener("change", () => {
    onSetPaperSelected(paper.documentKey, checkbox.checked);
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

function createTitleLink(paper, manageMode) {
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
    if (manageMode) {
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

function createStarButton(paper, onTogglePaperStarred) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-star";
  button.classList.toggle("starred", paper.starred);
  button.title = paper.starred ? "Unstar paper" : "Star paper";
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await onTogglePaperStarred(paper);
  });

  return button;
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

function getMaxMessageCount(papers) {
  return papers.reduce((max, paper) => Math.max(max, Number(paper.messageCount) || 0), 0);
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
