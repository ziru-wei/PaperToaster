export function renderPaperList({
  container,
  emptyState,
  papers,
  comparisons = [],
  sortId = "latestThread",
  activeDocumentKey,
  activeComparisonId = "",
  activeComparisonDocumentKeys = new Set(),
  manageMode,
  selectedDocumentKeys,
  selectedComparisonIds = new Set(),
  onOpenPaperContext,
  onOpenComparisonContext,
  onTogglePaperSelection,
  onSetPaperSelected,
  onToggleComparisonSelection,
  onSetComparisonSelected,
  onTogglePaperStarred,
  onToggleComparisonStarred,
  onAddPaperToComparison
}) {
  const paperRecords = sortDashboardRecords(papers.map((paper) => ({ type: "single-paper", paper })), sortId);
  const comparisonRecords = sortDashboardRecords(
    comparisons.map((comparison) => ({ type: "comparative-reading", comparison })),
    sortId
  );
  const records = [...paperRecords, ...comparisonRecords];
  const maxPaperMessageCount = getMaxRecordMessageCount(paperRecords);

  const layout = document.createElement("div");
  layout.className = "dashboard-record-layout";
  layout.classList.toggle("has-comparisons", comparisonRecords.length > 0);
  layout.classList.toggle("has-papers", paperRecords.length > 0);

  if (paperRecords.length) {
    const paperGrid = document.createElement("div");
    paperGrid.className = "paper-record-grid";
    paperGrid.append(...paperRecords.map((record) => createPaperCard({
      paper: record.paper,
      maxMessageCount: maxPaperMessageCount,
      activeDocumentKey,
      activeComparisonDocumentKeys,
      manageMode,
      selectedDocumentKeys,
      onOpenPaperContext,
      onTogglePaperSelection,
      onSetPaperSelected,
      onTogglePaperStarred,
      onAddPaperToComparison
    })));
    layout.append(paperGrid);
  }

  if (comparisonRecords.length) {
    const comparisonGrid = document.createElement("div");
    comparisonGrid.className = "comparison-record-grid";
    comparisonGrid.append(...comparisonRecords.map((record) => createComparisonRecordCard({
      comparison: record.comparison,
      activeDocumentKey,
      activeComparisonId,
      manageMode,
      selectedComparisonIds,
      onOpenComparisonContext,
      onToggleComparisonSelection,
      onSetComparisonSelected,
      onToggleComparisonStarred
    })));
    layout.append(comparisonGrid);
  }

  if (records.length) {
    container.replaceChildren(layout);
  } else {
    container.replaceChildren();
  }
  emptyState.hidden = records.length > 0;
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
  activeComparisonDocumentKeys,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onTogglePaperSelection,
  onSetPaperSelected,
  onTogglePaperStarred,
  onAddPaperToComparison
}) {
  const card = document.createElement("article");
  const isActive = paper.documentKey === activeDocumentKey;
  const isComparisonRelated = !isActive && activeComparisonDocumentKeys.has(paper.documentKey);
  const isSelected = selectedDocumentKeys.has(paper.documentKey);
  card.className = "paper-card";
  card.classList.toggle("active", isActive);
  card.classList.toggle("comparison-related", isComparisonRelated);
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
      if (!manageMode && event.key.toLowerCase() === "c") {
        event.preventDefault();
        Promise.resolve(onAddPaperToComparison?.(paper.documentKey)).catch((error) => {
          console.debug("[PDF AI] Could not add paper to comparison", error);
        });
      }
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
  title.append(createTitleText(paper));

  const addButton = !manageMode && paper.hasMarkdown
    ? createAddToComparisonButton(paper, onAddPaperToComparison)
    : null;

  topRow.append(
    createMessageRing(paper.messageCount, maxMessageCount),
    title,
    ...(addButton ? [addButton] : [])
  );

  const footer = document.createElement("div");
  footer.className = "paper-footer";

  if (!manageMode) {
    footer.append(createStarButton(paper, onTogglePaperStarred));
  }
  const time = createPaperTimeLine(paper);
  if (time) {
    footer.append(time);
  }

  main.append(topRow, footer);
  if (manageMode) {
    card.append(createPaperCheckbox(paper, selectedDocumentKeys, onSetPaperSelected));
  }
  card.append(main);
  return card;
}

function createAddToComparisonButton(paper, onAddPaperToComparison) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-compare-add";
  button.setAttribute("aria-label", `Add ${paper.title || "paper"} to Comparative Reading`);
  button.textContent = "+";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    Promise.resolve(onAddPaperToComparison?.(paper.documentKey)).catch((error) => {
      console.debug("[PDF AI] Could not add paper to comparison", error);
    });
  });
  return button;
}

function createComparisonRecordCard({
  comparison,
  activeDocumentKey,
  activeComparisonId,
  manageMode,
  selectedComparisonIds,
  onOpenComparisonContext,
  onToggleComparisonSelection,
  onSetComparisonSelected,
  onToggleComparisonStarred
}) {
  const card = document.createElement("article");
  const isActive = comparison.comparisonId === activeComparisonId;
  const isRelated = !isActive &&
    Boolean(activeDocumentKey) &&
    comparison.documentKeys.includes(activeDocumentKey);
  const isSelected = selectedComparisonIds.has(comparison.comparisonId);
  card.className = "comparison-record-card";
  card.classList.toggle("active", isActive);
  card.classList.toggle("related", isRelated);
  card.classList.toggle("editing", manageMode);
  card.classList.toggle("selected", isSelected);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", String(manageMode ? isSelected : isActive));
  card.setAttribute("aria-label", manageMode
    ? `Select Comparative Reading ${comparison.title || ""}`.trim()
    : `Open Comparative Reading ${comparison.title || ""}`.trim());
  card.addEventListener("click", (event) => {
    if (isComparisonCardActionIgnored(event.target)) {
      return;
    }

    if (manageMode) {
      onToggleComparisonSelection(comparison.comparisonId);
      return;
    }

    onOpenComparisonContext(comparison.comparisonId);
  });
  card.addEventListener("keydown", (event) => {
    if (isComparisonCardActionIgnored(event.target)) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (manageMode) {
      onToggleComparisonSelection(comparison.comparisonId);
      return;
    }

    onOpenComparisonContext(comparison.comparisonId);
  });

  const main = document.createElement("div");
  main.className = "comparison-record-main";

  const title = document.createElement("h2");
  title.className = "comparison-record-title";
  title.textContent = comparison.title || "Comparative Reading";

  const meta = document.createElement("div");
  meta.className = "comparison-record-meta";

  const time = document.createElement("span");
  time.className = "comparison-record-time";
  time.textContent = formatTime(comparison.updatedAt || comparison.firstMessageCreatedAt);

  meta.append(time);
  if (!manageMode) {
    meta.append(createStarButton(comparison, onToggleComparisonStarred, {
      className: "comparison-record-star",
      starredLabel: "Unstar comparison",
      unstarredLabel: "Star comparison"
    }));
  }

  main.append(title, meta);
  if (manageMode) {
    card.append(createComparisonCheckbox(comparison, selectedComparisonIds, onSetComparisonSelected));
  }
  card.append(main);
  return card;
}

function createPaperCheckbox(paper, selectedDocumentKeys, onSetPaperSelected) {
  const label = document.createElement("label");
  label.className = "paper-select";

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

function createComparisonCheckbox(comparison, selectedComparisonIds, onSetComparisonSelected) {
  const label = document.createElement("label");
  label.className = "comparison-select";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = selectedComparisonIds.has(comparison.comparisonId);
  checkbox.setAttribute("aria-label", `Select ${comparison.title || "comparison"}`);
  checkbox.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  checkbox.addEventListener("change", () => {
    onSetComparisonSelected(comparison.comparisonId, checkbox.checked);
  });

  label.append(checkbox);
  label.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  return label;
}

function createMessageRing(messageCount, maxMessageCount) {
  const ring = document.createElement("span");
  const count = Number(messageCount) || 0;
  const ratio = maxMessageCount > 0 ? count / maxMessageCount : 0;
  ring.className = "message-ring";
  ring.classList.toggle("empty", count === 0);
  ring.style.setProperty("--message-ratio", ratio.toFixed(3));
  ring.setAttribute("aria-label", `${count} messages`);
  return ring;
}

function createTitleText(paper) {
  const text = document.createElement("span");
  text.className = "paper-title-text";
  text.textContent = paper.title;
  return text;
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

function createStarButton(paper, onTogglePaperStarred, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = ["paper-star", options.className].filter(Boolean).join(" ");
  button.classList.toggle("starred", paper.isStarred);
  const label = paper.isStarred
    ? options.starredLabel || "Unstar paper"
    : options.unstarredLabel || "Star paper";
  button.setAttribute("aria-label", label);
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await onTogglePaperStarred?.(paper);
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
  return Boolean(target?.closest?.(".paper-star, .paper-select, .paper-compare-add"));
}

function isComparisonCardActionIgnored(target) {
  return Boolean(target?.closest?.(".paper-star, .comparison-select"));
}

function isPlaceholderTitle(title) {
  return title === "untitled paper" || title === "title not found";
}

function getMaxRecordMessageCount(records) {
  return records.reduce((max, record) => Math.max(max, getRecordMessageCount(record)), 0);
}

function sortDashboardRecords(records, sortId) {
  return [...records].sort((left, right) => {
    if (sortId === "type") {
      return compareRecordType(left, right) || compareRecordTime(right, left) || compareRecordTitle(left, right);
    }

    if (sortId === "messageCount") {
      return compareNumber(getRecordMessageCount(right), getRecordMessageCount(left)) || compareRecordTitle(left, right);
    }

    if (sortId === "firstConversation") {
      return compareNumber(getRecordFirstTime(left) || Number.MAX_SAFE_INTEGER, getRecordFirstTime(right) || Number.MAX_SAFE_INTEGER) ||
        compareRecordTitle(left, right);
    }

    if (sortId === "starred") {
      return compareNumber(getRecordStarred(right), getRecordStarred(left)) || compareRecordTime(right, left) || compareRecordTitle(left, right);
    }

    return compareRecordTime(right, left) || compareRecordTitle(left, right);
  });
}

function compareRecordType(left, right) {
  return getRecordTypeRank(left) - getRecordTypeRank(right);
}

function getRecordTypeRank(record) {
  return record.type === "single-paper" ? 0 : 1;
}

function compareRecordTime(left, right) {
  return compareNumber(getRecordLatestTime(left), getRecordLatestTime(right));
}

function compareRecordTitle(left, right) {
  return String(getRecordTitle(left)).localeCompare(String(getRecordTitle(right)), undefined, { sensitivity: "base" });
}

function getRecordTitle(record) {
  return record.type === "comparative-reading" ? record.comparison.title : record.paper.title;
}

function getRecordLatestTime(record) {
  if (record.type === "comparative-reading") {
    return Number(record.comparison.updatedAt) || 0;
  }

  return Number(record.paper.lastThreadStartedAt || record.paper.updatedAt) || 0;
}

function getRecordFirstTime(record) {
  if (record.type === "comparative-reading") {
    return Number(record.comparison.firstMessageCreatedAt) || 0;
  }

  return Number(record.paper.firstConversationAt) || 0;
}

function getRecordMessageCount(record) {
  return record.type === "comparative-reading"
    ? Number(record.comparison.messageCount) || 0
    : Number(record.paper.messageCount) || 0;
}

function getRecordStarred(record) {
  return (record.type === "comparative-reading" ? record.comparison.isStarred : record.paper.isStarred) ? 1 : 0;
}

function compareNumber(left, right) {
  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
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
