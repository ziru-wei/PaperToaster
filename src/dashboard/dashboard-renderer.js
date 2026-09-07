import {
  createPaperLabelControl,
  getPaperLabelOptions,
  normalizePaperLabel
} from "../components/paper-label-control.js";

const FULL_MESSAGE_RING_COUNT = 10;

export function renderPaperList({
  container,
  emptyState,
  papers,
  comparisons = [],
  sortId = "latestThread",
  paperGroupMode = "label",
  activeDocumentKey,
  activeComparisonId = "",
  activeComparisonDocumentKeys = new Set(),
  manageMode,
  selectedDocumentKeys,
  selectedComparisonIds = new Set(),
  onOpenPaperContext,
  onOpenComparisonContext,
  onTogglePaperSelection,
  onSetPaperGroupSelected,
  onToggleComparisonSelection,
  onTogglePaperStarred,
  onToggleComparisonStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup
}) {
  const groupOptions = getPaperLabelOptions(papers);
  const paperRecords = sortDashboardRecords(papers.map((paper) => ({ type: "single-paper", paper })), sortId);
  const comparisonRecords = sortDashboardRecords(
    comparisons.map((comparison) => ({ type: "comparative-reading", comparison })),
    sortId
  );
  const records = [...paperRecords, ...comparisonRecords];

  const layout = document.createElement("div");
  layout.className = "dashboard-record-layout";
  layout.classList.toggle("has-comparisons", comparisonRecords.length > 0);
  layout.classList.toggle("has-papers", paperRecords.length > 0);

  if (paperRecords.length) {
    const createCard = (record) => createPaperCard({
      paper: record.paper,
      activeDocumentKey,
      activeComparisonDocumentKeys,
      manageMode,
      selectedDocumentKeys,
      onOpenPaperContext,
      onTogglePaperSelection,
      onTogglePaperStarred,
      onUpdatePaperGroup,
      onRenamePaperGroup,
      onDeletePaperGroup,
      groupOptions
    });

    layout.append(createPaperGroups(paperRecords, createCard, paperGroupMode, {
      manageMode,
      selectedDocumentKeys,
      onSetPaperGroupSelected
    }));
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

function createPaperGroups(paperRecords, createCard, mode, {
  manageMode,
  selectedDocumentKeys,
  onSetPaperGroupSelected
}) {
  const container = document.createElement("div");
  container.className = "paper-card-groups";
  const groups = mode === "recent-conversation"
    ? createRecentConversationGroups(paperRecords)
    : createLabelGroups(paperRecords);

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "paper-card-group";

    const header = document.createElement("div");
    header.className = "paper-card-group-header";

    const heading = document.createElement("h2");
    heading.className = "paper-card-group-heading";
    heading.textContent = group.label;

    if (manageMode) {
      header.append(createGroupSelectButton(group, selectedDocumentKeys, onSetPaperGroupSelected));
    }
    header.append(heading);

    const grid = document.createElement("div");
    grid.className = "paper-card-group-grid";
    grid.append(...group.records.map(createCard));
    section.append(header, grid);
    container.append(section);
  });

  return container;
}

function createGroupSelectButton(group, selectedDocumentKeys, onSetPaperGroupSelected) {
  const documentKeys = group.records
    .map((record) => record.paper.documentKey)
    .filter(Boolean);
  const selectedCount = documentKeys.filter((documentKey) => selectedDocumentKeys.has(documentKey)).length;
  const allSelected = documentKeys.length > 0 && selectedCount === documentKeys.length;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-group-select";
  button.classList.toggle("active", allSelected);
  button.classList.toggle("partial", selectedCount > 0 && !allSelected);
  button.setAttribute("aria-label", `${allSelected ? "Deselect" : "Select"} all papers in ${group.label}`);
  button.setAttribute("aria-pressed", String(allSelected));
  button.addEventListener("click", () => {
    onSetPaperGroupSelected?.(documentKeys, !allSelected);
  });
  return button;
}

function createLabelGroups(paperRecords) {
  const recordsByLabel = new Map();

  paperRecords.forEach((record) => {
    const label = normalizePaperLabel(record.paper.group);
    const key = label.toLowerCase();
    if (!recordsByLabel.has(key)) {
      recordsByLabel.set(key, { label, records: [] });
    }
    recordsByLabel.get(key).records.push(record);
  });

  return [...recordsByLabel.values()].sort((left, right) => {
    if (!left.label) {
      return 1;
    }
    if (!right.label) {
      return -1;
    }
    return left.label.localeCompare(right.label, undefined, { sensitivity: "base" });
  }).map((group) => ({
    ...group,
    label: group.label || "Unlabeled"
  }));
}

function createRecentConversationGroups(paperRecords, now = new Date()) {
  const currentDate = new Date(now);
  const today = startOfLocalDay(currentDate);
  const yesterday = daysBefore(today, 1);
  const sevenDaysAgo = daysBefore(today, 7);
  const fourteenDaysAgo = daysBefore(today, 14);
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
  const definitions = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "past-seven", label: "Past 7 days" },
    { id: "past-fourteen", label: "Past 14 days" },
    { id: "this-month", label: "This month" },
    { id: "earlier", label: "Earlier" },
    { id: "no-conversations", label: "No conversations" }
  ];
  const recordsByGroup = new Map(definitions.map((definition) => [definition.id, []]));

  paperRecords.forEach((record) => {
    const timestamp = Number(record.paper.lastConversationAt || record.paper.lastThreadStartedAt) || 0;
    let groupId = "no-conversations";
    if (timestamp >= today) {
      groupId = "today";
    } else if (timestamp >= yesterday) {
      groupId = "yesterday";
    } else if (timestamp >= sevenDaysAgo) {
      groupId = "past-seven";
    } else if (timestamp >= fourteenDaysAgo) {
      groupId = "past-fourteen";
    } else if (timestamp >= monthStart) {
      groupId = "this-month";
    } else if (timestamp) {
      groupId = "earlier";
    }
    recordsByGroup.get(groupId).push(record);
  });

  return definitions
    .map((definition) => ({
      label: definition.label,
      records: recordsByGroup.get(definition.id)
    }))
    .filter((group) => group.records.length);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysBefore(timestamp, days) {
  const date = new Date(timestamp);
  date.setDate(date.getDate() - days);
  return date.getTime();
}

export function renderSortMenu({
  sortButton,
  sortMenu,
  sortOptions,
  activeSort,
  groupingCriterion,
  onSelectSort
}) {
  const activeOption = sortOptions.find((option) => option.id === activeSort) || sortOptions[0];
  sortButton.title = `Sort: ${activeOption.label}`;
  sortMenu.replaceChildren(...sortOptions.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-menu-option";
    const isGroupingCriterion = option.id === groupingCriterion;
    button.classList.toggle("active", option.id === activeSort);
    button.classList.toggle("grouping-criterion", isGroupingCriterion);
    button.disabled = isGroupingCriterion;
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(option.id === activeSort));
    button.setAttribute("aria-disabled", String(isGroupingCriterion));
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
  activeDocumentKey,
  activeComparisonDocumentKeys,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onTogglePaperSelection,
  onTogglePaperStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  groupOptions
}) {
  const card = document.createElement("article");
  const isActive = paper.documentKey === activeDocumentKey;
  const isComparisonRelated = !isActive && activeComparisonDocumentKeys.has(paper.documentKey);
  const isSelected = selectedDocumentKeys.has(paper.documentKey);
  card.className = "paper-card";
  card.classList.toggle("active", !manageMode && isActive);
  card.classList.toggle("comparison-related", isComparisonRelated);
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
  title.append(createTitleText(paper));

  topRow.append(
    createMessageRing(paper.messageCount),
    title
  );

  const footer = document.createElement("div");
  footer.className = "paper-footer";

  if (!manageMode) {
    footer.append(createStarButton(paper, onTogglePaperStarred));
  }
  const meta = document.createElement("div");
  meta.className = "paper-footer-meta";
  meta.append(createPaperLabelControl({
    paper,
    onUpdatePaperGroup,
    onRenamePaperGroup,
    onDeletePaperGroup,
    groupOptions
  }));
  footer.append(meta);

  main.append(topRow, footer);
  card.append(main);
  return card;
}

function createComparisonRecordCard({
  comparison,
  activeDocumentKey,
  activeComparisonId,
  manageMode,
  selectedComparisonIds,
  onOpenComparisonContext,
  onToggleComparisonSelection,
  onToggleComparisonStarred
}) {
  const card = document.createElement("article");
  const isActive = comparison.comparisonId === activeComparisonId;
  const isRelated = !isActive &&
    Boolean(activeDocumentKey) &&
    comparison.documentKeys.includes(activeDocumentKey);
  const isSelected = selectedComparisonIds.has(comparison.comparisonId);
  card.className = "comparison-record-card";
  card.classList.toggle("active", !manageMode && isActive);
  card.classList.toggle("related", isRelated);
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
  card.append(main);
  return card;
}

function createMessageRing(messageCount) {
  const ring = document.createElement("span");
  const count = Number(messageCount) || 0;
  const ratio = Math.min(count / FULL_MESSAGE_RING_COUNT, 1);
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
  return Boolean(target?.closest?.(
    ".paper-star, .paper-group-control"
  ));
}

function isComparisonCardActionIgnored(target) {
  return Boolean(target?.closest?.(".paper-star"));
}

function isPlaceholderTitle(title) {
  return title === "untitled paper" || title === "title not found";
}

function sortDashboardRecords(records, sortId) {
  return [...records].sort((left, right) => {
    if (sortId === "label" && left.type === "single-paper" && right.type === "single-paper") {
      return compareRecordLabels(left, right) || compareRecordTitle(left, right);
    }

    if (sortId === "starred") {
      return compareNumber(getRecordStarred(right), getRecordStarred(left)) || compareRecordTime(right, left) || compareRecordTitle(left, right);
    }

    return compareRecordTime(right, left) || compareRecordTitle(left, right);
  });
}

function compareRecordLabels(left, right) {
  const leftLabel = normalizePaperLabel(left.paper.group);
  const rightLabel = normalizePaperLabel(right.paper.group);
  if (!leftLabel && rightLabel) {
    return 1;
  }
  if (leftLabel && !rightLabel) {
    return -1;
  }
  return leftLabel.localeCompare(rightLabel, undefined, { sensitivity: "base" });
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
