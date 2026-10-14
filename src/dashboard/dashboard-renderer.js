import {
  createPaperLabelControl,
  getPaperLabelOptions,
  getYesNoLabelValue,
  normalizePaperLabel
} from "../components/paper-label-control.js";
import { DEFAULT_LABEL_COLUMN_ID, getLabelToneHueRank, getPaperLabels } from "../storage/label-columns.js";
import { normalizeDocumentUrl } from "../storage/document-key.js";
import {
  PAPER_VIEW,
  clampPaperPropertyWidth,
  getVisiblePaperProperties,
  normalizePaperViewProperties,
  reorderPaperProperties,
  createPaperPropertyIcon,
  getPaperPropertySort,
  getPaperFigureRowHeight,
  PAPER_FIGURE_ROW_HEIGHTS,
  getPaperColorSort,
  getPaperPropertyDefinition,
  getPaperPropertyLabelColumnId,
  isPaperPropertyWrapped
} from "./paper-properties.js";
import { abbreviateVenue } from "./venue-abbreviation.js";

const FULL_MESSAGE_RING_COUNT = 10;
const PAPER_CARD_DRAG_LONG_PRESS_MS = 500;
const PAPER_CARD_DRAG_MOVE_TOLERANCE = 8;
const DASHBOARD_DRAG_DISPOSE_EVENT = "paper-toaster:dispose-dashboard-drag";
const DASHBOARD_DRAG_ARTIFACT_SELECTOR = [
  ".paper-group-drag-preview",
  ".paper-group-drop-indicator",
  ".paper-card-drag-preview"
].join(", ");
const PAPER_SHORT_NOTE_MAX_CHARS = 500;
const PAPER_CARD_TEXT_PROPERTIES = new Set(["shortNote", "savedAsk", "added"]);
// Bibliographic properties share one "Author et al. · 2017 · Venue" line on cards.
const PAPER_CARD_BYLINE_PROPERTIES = new Set(["authors", "year", "venue", "citations"]);
const shortNoteEditors = new WeakMap();

// Label columns, their options and callbacks for the render in progress.
let labelContext = null;

export function renderPaperList({
  container,
  emptyState,
  papers,
  comparisons = [],
  libraryView = "board",
  showEmptyState = false,
  comparisonMessageCountByDocumentKey = new Map(),
  sortId = "latestThread",
  sortDirection = "desc",
  paperView = PAPER_VIEW.CARDS,
  viewProperties = normalizePaperViewProperties(),
  previews = new Map(),
  paperGroupMode = "label",
  labelGroupOrder = [],
  activeDocumentKey,
  activeComparisonId = "",
  activeComparisonDocumentKeys = new Set(),
  openPaperUrls = new Set(),
  manageMode,
  selectedDocumentKeys,
  selectedComparisonIds = new Set(),
  onOpenPaperContext,
  onOpenPaper,
  onOpenComparisonContext,
  onTogglePaperSelection,
  onSetPaperGroupSelected,
  onReorderLabelGroups,
  onToggleComparisonSelection,
  onSetComparisonSelected,
  onTogglePaperStarred,
  onToggleComparisonStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  onUpdatePaperShortNote,
  onUpdateViewProperties,
  onSortByProperty,
  labelSettings = { columns: [{ id: DEFAULT_LABEL_COLUMN_ID, name: "Label" }], colors: {} },
  onChangePaperLabels,
  onRenameLabel,
  onDeleteLabel,
  onSetLabelTone,
  onAddLabelColumn,
  onRenameLabelColumn,
  onDeleteLabelColumn,
  boardOrganizeBy = "label"
}) {
  disposeDashboardDrags(container);
  const pendingShortNoteEdit = captureShortNoteEdit(container);

  const isArchiveView = libraryView === "archive";
  const labelOptionPapers = isArchiveView ? papers : papers.filter((paper) => paper.labelState !== "dead");
  const groupOptions = getPaperLabelOptions(labelOptionPapers, {
    settings: labelSettings,
    appearance: isArchiveView ? "gray" : "colored"
  });
  labelContext = {
    columns: labelSettings.columns,
    optionsByColumn: new Map(labelSettings.columns.map((column) => [column.id, getPaperLabelOptions(labelOptionPapers, {
      columnId: column.id,
      settings: labelSettings,
      appearance: isArchiveView ? "gray" : "colored"
    })])),
    isArchiveView,
    sortId,
    sortDirection,
    onChangePaperLabels,
    onRenameLabel,
    onDeleteLabel,
    onSetLabelTone,
    onAddLabelColumn,
    onRenameLabelColumn,
    onDeleteLabelColumn
  };
  const paperRecords = sortDashboardRecords(
    papers.map((paper) => ({ type: "single-paper", paper, preview: previews.get(paper.documentKey) })),
    sortId,
    libraryView,
    sortDirection
  );
  const comparisonRecords = sortDashboardRecords(
    comparisons.map((comparison) => ({ type: "comparative-reading", comparison })),
    sortId,
    libraryView,
    sortDirection
  );
  const records = [...paperRecords, ...comparisonRecords];

  const layout = document.createElement("div");
  layout.className = "dashboard-record-layout";
  layout.classList.toggle("has-comparisons", comparisonRecords.length > 0);
  layout.classList.toggle("has-papers", paperRecords.length > 0);
  layout.classList.toggle("ungrouped", paperGroupMode === "none");
  layout.classList.toggle("has-selection", Boolean(manageMode));

  if (paperRecords.length) {
    const createItem = (record) => (paperView === PAPER_VIEW.LIST ? createPaperListRow : createPaperCard)({
      paper: record.paper,
      preview: previews.get(record.paper.documentKey),
      properties: viewProperties[paperView],
      activityMessageCount: (Number(record.paper.messageCount) || 0) +
        (comparisonMessageCountByDocumentKey.get(record.paper.documentKey) || 0),
      activeDocumentKey,
      activeComparisonDocumentKeys,
      isOpenInBrowser: openPaperUrls.has(normalizeDocumentUrl(record.paper.canonicalUrl)),
      manageMode,
      selectedDocumentKeys,
      onOpenPaperContext,
      onOpenPaper,
      onTogglePaperSelection,
      onSetPaperSelected: (documentKey, selected) => onSetPaperGroupSelected?.([documentKey], selected),
      onTogglePaperStarred,
      onUpdatePaperGroup,
      onRenamePaperGroup,
      onDeletePaperGroup,
      onUpdatePaperShortNote,
      groupOptions,
      libraryView,
      paperView,
      onUpdateViewProperties
    });

    layout.append(createPaperGroups(paperRecords, createItem, paperGroupMode, {
      paperView,
      listProperties: viewProperties[PAPER_VIEW.LIST],
      libraryView,
      onUpdateViewProperties,
      listSort: { sortId, sortDirection, onSortByProperty },
      boardOrganizeBy,
      manageMode,
      selectedDocumentKeys,
      onSetPaperGroupSelected,
      labelGroupOrder,
      onReorderLabelGroups,
      groupOptions,
      onUpdatePaperGroup
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
      onSetComparisonSelected,
      onToggleComparisonStarred,
      libraryView
    })));
    layout.append(comparisonGrid);
  }

  if (records.length) {
    container.replaceChildren(layout);
  } else {
    container.replaceChildren();
  }
  restoreShortNoteEdit(container, pendingShortNoteEdit);
  emptyState.hidden = records.length > 0 || !showEmptyState;
}

function disposeDashboardDrags(container) {
  container.querySelectorAll(".paper-card-groups").forEach((groupContainer) => {
    groupContainer.dispatchEvent(new Event(DASHBOARD_DRAG_DISPOSE_EVENT));
  });
  document.querySelectorAll(DASHBOARD_DRAG_ARTIFACT_SELECTOR).forEach((element) => element.remove());
  document.body.classList.remove("dashboard-drag-active");
}

function createPaperGroups(paperRecords, createItem, mode, {
  paperView,
  listProperties,
  libraryView,
  onUpdateViewProperties,
  listSort,
  manageMode,
  selectedDocumentKeys,
  onSetPaperGroupSelected,
  labelGroupOrder,
  onReorderLabelGroups,
  groupOptions,
  onUpdatePaperGroup,
  boardOrganizeBy = "label"
}) {
  const container = document.createElement("div");
  container.className = "paper-card-groups";
  const isListView = paperView === PAPER_VIEW.LIST;
  // The board view groups like the others (titled sections, top to bottom);
  // inside each group a kanban lays papers out by its "organized by" column.
  const isBoardView = paperView === PAPER_VIEW.CARDS;
  container.dataset.libraryView = libraryView;
  const visibleProperties = isListView ? getVisiblePaperProperties(listProperties, libraryView) : [];
  if (isListView) {
    container.classList.add("paper-list-groups");
    container.style.setProperty("--paper-list-columns", getPaperListGridTemplate(visibleProperties));
    container.style.setProperty("--paper-list-figure-height", `${getPaperFigureRowHeight(listProperties)}px`);
  }
  const groups = createPaperRecordGroups(paperRecords, mode, labelGroupOrder, groupOptions);

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "paper-card-group";
    if (isLabelGroupMode(mode)) {
      section.dataset.groupKey = group.key;
      section.dataset.groupLabel = group.rawLabel;
      section.dataset.groupColumn = group.columnId;
      section.dataset.groupTone = group.tone;
    }

    if (mode !== "none") {
      const header = document.createElement("div");
      header.className = "paper-card-group-header";

      const heading = document.createElement("h2");
      heading.className = "paper-card-group-heading";
      heading.textContent = group.label;

      if (manageMode) {
        header.append(createGroupSelectButton(group, selectedDocumentKeys, onSetPaperGroupSelected));
      } else if (isLabelGroupMode(mode)) {
        header.append(createGroupDragHandle(group));
      }
      header.append(heading);
      section.append(header);
    }

    if (isListView) {
      section.append(createPaperListTable(group.records, createItem, {
        container,
        listProperties,
        visibleProperties,
        onUpdateViewProperties,
        listSort
      }));
    } else if (isBoardView) {
      section.append(createBoardKanban(group.records, createItem, boardOrganizeBy, {
        manageMode,
        labelGroupOrder,
        onReorderLabelGroups
      }));
    } else {
      const grid = document.createElement("div");
      grid.className = "paper-card-group-grid";
      grid.classList.toggle("paper-gallery-grid", paperView === PAPER_VIEW.GALLERY);
      grid.append(...group.records.map(createItem));
      section.append(grid);
    }
    container.append(section);
  });

  if (isLabelGroupMode(mode) && !manageMode) {
    attachLabelGroupReordering(container, onReorderLabelGroups);
    if (!isListView && !isBoardView) {
      attachPaperCardGroupTransfer(container, paperRecords, onUpdatePaperGroup);
    }
  }

  return container;
}

// A kanban for one board group: a column per label of the organizing column.
// Columns reorder by dragging their handles; cards move between columns.
function createBoardKanban(records, createItem, organizeBy, { manageMode, labelGroupOrder, onReorderLabelGroups }) {
  const kanban = document.createElement("div");
  kanban.className = "paper-card-groups paper-board";
  const columnId = getGroupModeLabelColumnId(organizeBy);
  createLabelGroups(records, labelGroupOrder, columnId).forEach((column) => {
    const section = document.createElement("section");
    section.className = "paper-card-group";
    section.dataset.groupKey = column.key;
    section.dataset.groupLabel = column.rawLabel;
    section.dataset.groupColumn = column.columnId;
    section.dataset.groupTone = column.tone;

    const header = document.createElement("div");
    header.className = "paper-card-group-header";
    if (!manageMode) header.append(createGroupDragHandle(column));
    const heading = document.createElement("h2");
    heading.className = "paper-card-group-heading paper-board-label";
    heading.classList.add(getBoardLabelToneClass(column.tone));
    heading.textContent = column.label;
    const count = document.createElement("span");
    count.className = "paper-card-group-count";
    count.textContent = String(column.records.length);
    header.append(heading, count);

    const grid = document.createElement("div");
    grid.className = "paper-card-group-grid";
    grid.append(...column.records.map(createItem));
    section.append(header, grid);
    kanban.append(section);
  });
  if (!manageMode) {
    attachLabelGroupReordering(kanban, onReorderLabelGroups);
    attachPaperCardGroupTransfer(kanban, records);
  }
  return kanban;
}

function isLabelGroupMode(mode) {
  return mode === "label" || String(mode || "").startsWith("label:");
}

function createPaperRecordGroups(paperRecords, mode, labelGroupOrder, groupOptions) {
  if (mode === "none") {
    return [{ label: "", records: paperRecords }];
  }
  if (mode === "recent-conversation") {
    return createTimelineGroups(paperRecords, "lastThreadStartedAt");
  }
  if (mode === "latest-added") {
    return createTimelineGroups(paperRecords, "parsedAt");
  }
  return createLabelGroups(paperRecords, labelGroupOrder, getGroupModeLabelColumnId(mode));
}

function getBoardLabelToneClass(tone) {
  return /^\d+$/.test(String(tone)) ? `paper-group-tone-${tone}` : "paper-group-gray";
}

function createGroupDragHandle(group) {
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "paper-group-drag-handle";
  handle.setAttribute("aria-label", `Drag to reorder ${group.label}`);
  return handle;
}

function attachLabelGroupReordering(container, onReorderLabelGroups) {
  // Board columns sit side by side, so they reorder along x instead of y.
  const horizontal = container.classList.contains("paper-board");
  let pendingDrag = null;
  let activeDrag = null;
  let suppressHandleClick = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  container.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest(".paper-group-drag-handle");
    if (!handle || event.button !== 0) {
      return;
    }
    const section = handle.closest(".paper-card-group");
    // Board groups hold kanbans with their own columns; each container reorders only its own.
    if (!section || section.parentElement !== container) {
      return;
    }
    pendingDrag = {
      pointerId: event.pointerId,
      handle,
      section,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      originalNextSibling: section.nextSibling
    };
    handle.setPointerCapture(event.pointerId);
  });

  container.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pendingDrag?.pointerId) {
      return;
    }
    event.preventDefault();
    pendingDrag.lastX = event.clientX;
    pendingDrag.lastY = event.clientY;
    if (Math.hypot(event.clientX - pendingDrag.startX, event.clientY - pendingDrag.startY) < 4) {
      return;
    }
    activeDrag = beginPointerGroupDrag(pendingDrag);
    pendingDrag = null;
    suppressHandleClick = true;
  });

  container.addEventListener("pointerup", (event) => {
    if (event.pointerId === pendingDrag?.pointerId) {
      cancelPendingGroupDrag();
    }
  });

  container.addEventListener("pointercancel", (event) => {
    if (event.pointerId === pendingDrag?.pointerId) {
      cancelPendingGroupDrag();
    }
  });

  container.addEventListener("lostpointercapture", (event) => {
    if (event.target === container && event.pointerId === activeDrag?.pointerId) {
      finishActiveGroupDrag(true);
    }
  });

  container.addEventListener("click", (event) => {
    if (!suppressHandleClick || !event.target.closest(".paper-group-drag-handle")) {
      return;
    }
    suppressHandleClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  container.addEventListener(DASHBOARD_DRAG_DISPOSE_EVENT, () => {
    cancelPendingGroupDrag();
    finishActiveGroupDrag(true);
  }, { once: true });

  function beginPointerGroupDrag(drag) {
    const sourceRect = drag.section.getBoundingClientRect();
    const visualCenterX = getGroupVisualCenterX(drag.section, sourceRect);
    const preview = drag.section.cloneNode(true);
    preview.classList.add("paper-group-drag-preview");
    preview.setAttribute("aria-hidden", "true");
    preview.inert = true;
    Object.assign(preview.style, {
      top: `${sourceRect.top}px`,
      left: `${sourceRect.left}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`
    });
    preview.style.setProperty("--paper-group-drag-origin-x", `${visualCenterX}px`);
    document.body.append(preview);
    document.body.classList.add("dashboard-drag-active");

    const indicator = document.createElement("div");
    indicator.className = "paper-group-drop-indicator";
    document.body.append(indicator);
    drag.section.classList.add("paper-group-drop-placeholder");

    const active = {
      ...drag,
      preview,
      indicator,
      grabOffsetX: drag.startX - sourceRect.left,
      grabOffsetY: drag.startY - sourceRect.top,
      autoScrollFrame: 0
    };
    if (drag.handle.hasPointerCapture?.(drag.pointerId)) {
      drag.handle.releasePointerCapture(drag.pointerId);
    }
    container.setPointerCapture(drag.pointerId);
    positionDragPreview(active);
    positionDropIndicator(active);
    document.addEventListener("keydown", handleDragEscape, true);
    window.addEventListener("pointermove", handleActiveGroupPointerMove, true);
    window.addEventListener("pointerup", handleActiveGroupPointerUp, true);
    window.addEventListener("pointercancel", handleActiveGroupPointerCancel, true);
    window.addEventListener("mouseup", handleActiveGroupMouseUp, true);
    window.addEventListener("blur", handleGroupDragWindowBlur);
    document.addEventListener("visibilitychange", handleGroupDragVisibilityChange);
    active.autoScrollFrame = requestAnimationFrame(() => autoScrollDuringGroupDrag(active));
    return active;
  }

  function cancelPendingGroupDrag() {
    if (!pendingDrag) {
      return;
    }
    if (pendingDrag.handle.hasPointerCapture?.(pendingDrag.pointerId)) {
      pendingDrag.handle.releasePointerCapture(pendingDrag.pointerId);
    }
    pendingDrag = null;
  }

  function getGroupVisualCenterX(section, sectionRect) {
    const visualElements = section.querySelectorAll(
      ".paper-group-drag-handle, .paper-card-group-heading, .paper-card, .paper-list-table"
    );
    const rects = [...visualElements]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    if (!rects.length) {
      return sectionRect.width / 2;
    }
    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    return (left + right) / 2 - sectionRect.left;
  }

  function positionDragPreview(drag) {
    drag.preview.style.left = `${drag.lastX - drag.grabOffsetX}px`;
    drag.preview.style.top = `${drag.lastY - drag.grabOffsetY}px`;
  }

  function updatePointerGroupTarget(drag) {
    const sections = [...container.querySelectorAll(":scope > .paper-card-group")]
      .filter((section) => section !== drag.section);
    const target = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return horizontal
        ? drag.lastX < rect.left + rect.width / 2
        : drag.lastY < rect.top + rect.height / 2;
    });
    const reference = target || null;
    if (drag.section.nextSibling === reference || reference === drag.section) {
      positionDropIndicator(drag);
      return;
    }

    container.insertBefore(drag.section, reference);
    positionDropIndicator(drag);
  }

  function positionDropIndicator(drag) {
    const rect = drag.section.getBoundingClientRect();
    if (horizontal) {
      drag.indicator.style.left = `${rect.left - 6}px`;
      drag.indicator.style.top = `${rect.top + 6}px`;
      drag.indicator.style.width = "1px";
      drag.indicator.style.height = `${Math.max(0, rect.height - 12)}px`;
      return;
    }
    drag.indicator.style.left = `${rect.left + 6}px`;
    drag.indicator.style.top = `${rect.top - 3}px`;
    drag.indicator.style.width = `${Math.max(0, rect.width - 12)}px`;
  }

  function autoScrollDuringGroupDrag(drag) {
    if (activeDrag !== drag) {
      return;
    }
    if (horizontal) {
      if (scrollBoardNearEdge(container, drag.lastX)) {
        updatePointerGroupTarget(drag);
      }
      drag.autoScrollFrame = requestAnimationFrame(() => autoScrollDuringGroupDrag(drag));
      return;
    }
    const edgeSize = 52;
    const topDistance = drag.lastY;
    const bottomDistance = window.innerHeight - drag.lastY;
    let scrollAmount = 0;
    if (topDistance < edgeSize) {
      scrollAmount = -Math.ceil((edgeSize - topDistance) / 7);
    } else if (bottomDistance < edgeSize) {
      scrollAmount = Math.ceil((edgeSize - bottomDistance) / 7);
    }
    if (scrollAmount) {
      const previousScrollY = window.scrollY;
      window.scrollBy(0, scrollAmount);
      if (window.scrollY !== previousScrollY) {
        updatePointerGroupTarget(drag);
        positionDropIndicator(drag);
      }
    }
    drag.autoScrollFrame = requestAnimationFrame(() => autoScrollDuringGroupDrag(drag));
  }

  function finishPointerGroupDrag(drag, cancelled) {
    cancelAnimationFrame(drag.autoScrollFrame);
    document.removeEventListener("keydown", handleDragEscape, true);
    window.removeEventListener("pointermove", handleActiveGroupPointerMove, true);
    window.removeEventListener("pointerup", handleActiveGroupPointerUp, true);
    window.removeEventListener("pointercancel", handleActiveGroupPointerCancel, true);
    window.removeEventListener("mouseup", handleActiveGroupMouseUp, true);
    window.removeEventListener("blur", handleGroupDragWindowBlur);
    document.removeEventListener("visibilitychange", handleGroupDragVisibilityChange);
    if (container.hasPointerCapture?.(drag.pointerId)) {
      container.releasePointerCapture(drag.pointerId);
    }
    if (cancelled) {
      container.insertBefore(
        drag.section,
        drag.originalNextSibling?.parentNode === container ? drag.originalNextSibling : null
      );
    }

    positionDropIndicator(drag);
    const targetRect = drag.section.getBoundingClientRect();
    drag.preview.style.animation = "none";
    drag.preview.style.transform = "scale(1.01)";
    drag.preview.getBoundingClientRect();
    drag.preview.classList.add("settling");
    drag.preview.style.left = `${targetRect.left}px`;
    drag.preview.style.top = `${targetRect.top}px`;
    drag.preview.style.transform = "scale(1)";
    drag.indicator.classList.add("leaving");

    const cleanup = () => {
      drag.section.classList.remove("paper-group-drop-placeholder");
      drag.preview.remove();
      drag.indicator.remove();
      document.body.classList.remove("dashboard-drag-active");
    };
    if (reduceMotion) {
      cleanup();
    } else {
      setTimeout(cleanup, 150);
    }

    if (!cancelled) {
      onReorderLabelGroups?.(
        [...container.querySelectorAll(":scope > .paper-card-group")]
          .map((section) => section.dataset.groupKey)
          .filter(Boolean)
      );
    }
  }

  function handleDragEscape(event) {
    if (event.key !== "Escape" || !activeDrag) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    finishActiveGroupDrag(true);
  }

  function handleActiveGroupPointerMove(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.buttons === 0) {
      finishActiveGroupDrag(false);
      return;
    }
    activeDrag.lastX = event.clientX;
    activeDrag.lastY = event.clientY;
    positionDragPreview(activeDrag);
    updatePointerGroupTarget(activeDrag);
  }

  function handleActiveGroupPointerUp(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    finishActiveGroupDrag(false);
  }

  function handleActiveGroupPointerCancel(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.stopPropagation();
    finishActiveGroupDrag(true);
  }

  function handleActiveGroupMouseUp(event) {
    if (event.button === 0 && activeDrag) {
      finishActiveGroupDrag(false);
    }
  }

  function handleGroupDragWindowBlur() {
    finishActiveGroupDrag(true);
  }

  function handleGroupDragVisibilityChange() {
    if (document.visibilityState !== "visible") {
      finishActiveGroupDrag(true);
    }
  }

  function finishActiveGroupDrag(cancelled) {
    if (!activeDrag) {
      return;
    }
    const drag = activeDrag;
    activeDrag = null;
    pendingDrag = null;
    finishPointerGroupDrag(drag, cancelled);
  }
}

// Scrolls a board sideways while a drag nears its left or right edge.
function scrollBoardNearEdge(board, pointerX) {
  const rect = board.getBoundingClientRect();
  const edgeSize = 56;
  let amount = 0;
  if (pointerX < rect.left + edgeSize) {
    amount = -Math.ceil((rect.left + edgeSize - pointerX) / 6);
  } else if (pointerX > rect.right - edgeSize) {
    amount = Math.ceil((pointerX - (rect.right - edgeSize)) / 6);
  }
  if (!amount) return false;
  const previous = board.scrollLeft;
  board.scrollLeft += amount;
  return board.scrollLeft !== previous;
}

function attachPaperCardGroupTransfer(container, paperRecords, onUpdatePaperGroup) {
  // Board cards drag as soon as they move, like Notion; gallery cards need a long press.
  const isBoard = container.classList.contains("paper-board");
  const papersByDocumentKey = new Map(paperRecords.map((record) => [record.paper.documentKey, record.paper]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pendingDrag = null;
  let activeDrag = null;

  container.addEventListener("pointerdown", (event) => {
    const card = event.target.closest(".paper-card");
    if (!card || event.button !== 0 || isCardActionIgnored(event.target)) {
      return;
    }
    cancelPendingDrag();
    const drag = {
      pointerId: event.pointerId,
      card,
      paper: papersByDocumentKey.get(card.dataset.documentKey),
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      timer: 0,
      handleLostPointerCapture: null
    };
    drag.handleLostPointerCapture = () => {
      if (pendingDrag === drag) {
        cancelPendingDrag();
      }
    };
    drag.timer = window.setTimeout(() => beginCardDrag(), PAPER_CARD_DRAG_LONG_PRESS_MS);
    pendingDrag = drag;
    card.addEventListener("lostpointercapture", drag.handleLostPointerCapture, { once: true });
    card.setPointerCapture(event.pointerId);
  });

  container.addEventListener("pointermove", (event) => {
    if (event.pointerId === pendingDrag?.pointerId) {
      pendingDrag.lastX = event.clientX;
      pendingDrag.lastY = event.clientY;
      if (Math.hypot(event.clientX - pendingDrag.startX, event.clientY - pendingDrag.startY) > PAPER_CARD_DRAG_MOVE_TOLERANCE) {
        if (isBoard) {
          beginCardDrag();
        } else {
          cancelPendingDrag();
        }
      }
      return;
    }
  });

  container.addEventListener("pointerup", (event) => {
    if (event.pointerId === pendingDrag?.pointerId) {
      cancelPendingDrag();
    }
  });

  container.addEventListener("pointercancel", (event) => {
    if (event.pointerId === pendingDrag?.pointerId) {
      cancelPendingDrag();
    }
  });

  container.addEventListener("lostpointercapture", (event) => {
    if (event.target === container && event.pointerId === activeDrag?.pointerId) {
      finishActiveCardDrag(true);
    }
  });

  container.addEventListener("contextmenu", (event) => {
    if (activeDrag && event.target.closest(".paper-card")) {
      event.preventDefault();
    }
  });

  container.addEventListener(DASHBOARD_DRAG_DISPOSE_EVENT, () => {
    cancelPendingDrag();
    finishActiveCardDrag(true);
  }, { once: true });

  function beginCardDrag() {
    if (!pendingDrag?.paper || !pendingDrag.card.isConnected || !container.isConnected) {
      cancelPendingDrag();
      return;
    }
    const drag = pendingDrag;
    pendingDrag = null;
    window.clearTimeout(drag.timer);
    drag.card.removeEventListener("lostpointercapture", drag.handleLostPointerCapture);
    const cardRect = drag.card.getBoundingClientRect();
    if (cardRect.width <= 0 || cardRect.height <= 0) {
      return;
    }
    const preview = drag.card.cloneNode(true);
    preview.classList.add("paper-card-drag-preview");
    preview.setAttribute("aria-hidden", "true");
    preview.inert = true;
    Object.assign(preview.style, {
      top: `${cardRect.top}px`,
      left: `${cardRect.left}px`,
      width: `${cardRect.width}px`,
      height: `${cardRect.height}px`
    });
    document.body.append(preview);
    document.body.classList.add("dashboard-drag-active");
    if (drag.card.hasPointerCapture?.(drag.pointerId)) {
      drag.card.releasePointerCapture(drag.pointerId);
    }
    try {
      container.setPointerCapture(drag.pointerId);
    } catch (error) {
      preview.remove();
      document.body.classList.remove("dashboard-drag-active");
      console.debug("[Paper Toaster] Could not capture card drag pointer", error);
      return;
    }
    drag.card.classList.add("paper-card-drag-placeholder");
    drag.card.dataset.suppressClickUntil = String(performance.now() + 700);

    activeDrag = {
      ...drag,
      preview,
      sourceGroup: drag.card.closest(".paper-card-group"),
      targetGroup: null,
      grabOffsetX: drag.startX - cardRect.left,
      grabOffsetY: drag.startY - cardRect.top,
      autoScrollFrame: 0
    };
    positionCardDragPreview(activeDrag);
    updateCardDropTarget(activeDrag);
    document.addEventListener("keydown", handleCardDragEscape, true);
    window.addEventListener("pointermove", handleActiveCardPointerMove, true);
    window.addEventListener("pointerup", handleActiveCardPointerUp, true);
    window.addEventListener("pointercancel", handleActiveCardPointerCancel, true);
    window.addEventListener("mouseup", handleActiveCardMouseUp, true);
    window.addEventListener("blur", handleCardDragWindowBlur);
    document.addEventListener("visibilitychange", handleCardDragVisibilityChange);
    const active = activeDrag;
    active.autoScrollFrame = requestAnimationFrame(() => autoScrollDuringCardDrag(active));
  }

  function cancelPendingDrag() {
    if (!pendingDrag) {
      return;
    }
    const drag = pendingDrag;
    pendingDrag = null;
    window.clearTimeout(drag.timer);
    drag.card.removeEventListener("lostpointercapture", drag.handleLostPointerCapture);
    if (drag.card.hasPointerCapture?.(drag.pointerId)) {
      drag.card.releasePointerCapture(drag.pointerId);
    }
  }

  function positionCardDragPreview(drag) {
    drag.preview.style.left = `${drag.lastX - drag.grabOffsetX}px`;
    drag.preview.style.top = `${drag.lastY - drag.grabOffsetY}px`;
  }

  function updateCardDropTarget(drag) {
    const groups = [...container.querySelectorAll(":scope > .paper-card-group")];
    const nextTarget = groups.find((group) => isPointInsideGroupGrid(group, drag.lastX, drag.lastY));
    const effectiveTarget = nextTarget === drag.sourceGroup ? null : nextTarget || null;
    if (effectiveTarget === drag.targetGroup) {
      return;
    }
    drag.targetGroup?.classList.remove("paper-card-drop-target");
    drag.targetGroup = effectiveTarget;
    drag.targetGroup?.classList.add("paper-card-drop-target");
  }

  function isPointInsideGroupGrid(group, pointerX, pointerY) {
    // A whole board column takes the drop, not only the cards in it.
    const grid = isBoard ? group : group.querySelector(".paper-card-group-grid");
    if (!grid) {
      return false;
    }
    const rect = grid.getBoundingClientRect();
    return pointerX >= rect.left && pointerX <= rect.right &&
      pointerY >= rect.top && pointerY <= rect.bottom;
  }

  function autoScrollDuringCardDrag(drag) {
    if (activeDrag !== drag) {
      return;
    }
    if (isBoard && scrollBoardNearEdge(container, drag.lastX)) {
      updateCardDropTarget(drag);
    }
    const edgeSize = 52;
    const topDistance = drag.lastY;
    const bottomDistance = window.innerHeight - drag.lastY;
    let scrollAmount = 0;
    if (topDistance < edgeSize) {
      scrollAmount = -Math.ceil((edgeSize - topDistance) / 7);
    } else if (bottomDistance < edgeSize) {
      scrollAmount = Math.ceil((edgeSize - bottomDistance) / 7);
    }
    if (scrollAmount) {
      window.scrollBy(0, scrollAmount);
      updateCardDropTarget(drag);
    }
    drag.autoScrollFrame = requestAnimationFrame(() => autoScrollDuringCardDrag(drag));
  }

  function settleCardDrag(drag, cancelled) {
    cancelAnimationFrame(drag.autoScrollFrame);
    document.removeEventListener("keydown", handleCardDragEscape, true);
    window.removeEventListener("pointermove", handleActiveCardPointerMove, true);
    window.removeEventListener("pointerup", handleActiveCardPointerUp, true);
    window.removeEventListener("pointercancel", handleActiveCardPointerCancel, true);
    window.removeEventListener("mouseup", handleActiveCardMouseUp, true);
    window.removeEventListener("blur", handleCardDragWindowBlur);
    document.removeEventListener("visibilitychange", handleCardDragVisibilityChange);
    if (container.hasPointerCapture?.(drag.pointerId)) {
      container.releasePointerCapture(drag.pointerId);
    }
    const targetGroup = cancelled ? null : drag.targetGroup;
    const targetGrid = targetGroup?.querySelector(".paper-card-group-grid");
    const dropSlot = targetGrid ? document.createElement("div") : null;
    if (dropSlot) {
      dropSlot.className = "paper-card paper-card-drop-slot";
      targetGrid.append(dropSlot);
    }
    const targetRect = dropSlot?.getBoundingClientRect() || drag.card.getBoundingClientRect();
    drag.preview.style.animation = "none";
    drag.preview.style.transform = "scale(1.015)";
    drag.preview.getBoundingClientRect();
    drag.preview.classList.add("settling");
    drag.preview.style.left = `${targetRect.left}px`;
    drag.preview.style.top = `${targetRect.top}px`;
    drag.preview.style.width = `${targetRect.width}px`;
    drag.preview.style.height = `${targetRect.height}px`;
    drag.preview.style.transform = "scale(1)";
    drag.targetGroup?.classList.remove("paper-card-drop-target");

    const complete = async () => {
      if (targetGroup) {
        try {
          // Moving a card swaps the label it was under for the target's label.
          const columnId = targetGroup.dataset.groupColumn || DEFAULT_LABEL_COLUMN_ID;
          const from = drag.sourceGroup?.dataset.groupLabel || "";
          const to = targetGroup.dataset.groupLabel || "";
          const next = getPaperLabels(drag.paper, columnId).filter((label) => label.toLowerCase() !== from.toLowerCase());
          if (to) next.push(to);
          await labelContext?.onChangePaperLabels?.(drag.paper, columnId, next);
        } catch (error) {
          console.debug("[Paper Toaster] Could not move paper to label group", error);
        }
      }
      drag.card.classList.remove("paper-card-drag-placeholder");
      dropSlot?.remove();
      drag.preview.remove();
      document.body.classList.remove("dashboard-drag-active");
    };
    if (reduceMotion) {
      complete();
    } else {
      window.setTimeout(complete, 145);
    }
  }

  function handleCardDragEscape(event) {
    if (event.key !== "Escape" || !activeDrag) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    finishActiveCardDrag(true);
  }

  function handleActiveCardPointerMove(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.buttons === 0) {
      finishActiveCardDrag(false);
      return;
    }
    activeDrag.lastX = event.clientX;
    activeDrag.lastY = event.clientY;
    positionCardDragPreview(activeDrag);
    updateCardDropTarget(activeDrag);
  }

  function handleActiveCardPointerUp(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    finishActiveCardDrag(false);
  }

  function handleActiveCardPointerCancel(event) {
    if (event.pointerId !== activeDrag?.pointerId) {
      return;
    }
    event.stopPropagation();
    finishActiveCardDrag(true);
  }

  function handleActiveCardMouseUp(event) {
    if (event.button === 0 && activeDrag) {
      finishActiveCardDrag(false);
    }
  }

  function handleCardDragWindowBlur() {
    finishActiveCardDrag(true);
  }

  function handleCardDragVisibilityChange() {
    if (document.visibilityState !== "visible") {
      finishActiveCardDrag(true);
    }
  }

  function finishActiveCardDrag(cancelled) {
    if (!activeDrag) {
      return;
    }
    const drag = activeDrag;
    activeDrag = null;
    settleCardDrag(drag, cancelled);
  }
}

function createGroupSelectButton(group, selectedDocumentKeys, onSetPaperGroupSelected) {
  const documentKeys = group.records
    .map((record) => record.paper.documentKey)
    .filter(Boolean);
  const selectedCount = documentKeys.filter((documentKey) => selectedDocumentKeys.has(documentKey)).length;
  const allSelected = documentKeys.length > 0 && selectedCount === documentKeys.length;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "paper-group-select paper-select-checkbox";
  button.classList.toggle("active", allSelected);
  button.classList.toggle("partial", selectedCount > 0 && !allSelected);
  button.setAttribute("aria-label", `${allSelected ? "Deselect" : "Select"} all papers in ${group.label}`);
  button.setAttribute("role", "checkbox");
  button.setAttribute("aria-checked", selectedCount > 0 && !allSelected ? "mixed" : String(allSelected));
  button.addEventListener("click", () => {
    onSetPaperGroupSelected?.(documentKeys, !allSelected);
  });
  return button;
}

// "label" groups by the original column, "label:<columnId>" by another one.
function getGroupModeLabelColumnId(mode) {
  return String(mode || "").startsWith("label:") ? mode.slice("label:".length) : DEFAULT_LABEL_COLUMN_ID;
}

// "Yes" alone says little as a group title, so yes/no groups name their column.
function getLabelGroupTitle(label, columnName) {
  if (!label) return `No ${columnName}`;
  return getYesNoLabelValue([label]) === null ? label : `${columnName}: ${label}`;
}

// One group per label; a paper with several labels appears in each of them.
function createLabelGroups(paperRecords, preferredOrder = [], columnId = DEFAULT_LABEL_COLUMN_ID) {
  const options = labelContext?.optionsByColumn.get(columnId) || [];
  const toneByLabel = new Map(options.map((option) => [option.name.toLowerCase(), option.tone]));
  const recordsByLabel = new Map();
  const addTo = (label, record) => {
    const key = label.toLowerCase();
    if (!recordsByLabel.has(key)) recordsByLabel.set(key, { label, records: [] });
    recordsByLabel.get(key).records.push(record);
  };
  paperRecords.forEach((record) => {
    const labels = getPaperLabels(record.paper, columnId);
    if (!labels.length) addTo("", record);
    labels.forEach((label) => addTo(label, record));
  });
  // Group order is remembered per column; the original column keeps its older keys.
  const keyPrefix = columnId === DEFAULT_LABEL_COLUMN_ID ? "" : `${columnId}:`;

  const groups = [...recordsByLabel.values()].sort((left, right) => {
    if (!left.label) return 1;
    if (!right.label) return -1;
    return left.label.localeCompare(right.label, undefined, { sensitivity: "base" });
  }).map((group) => ({
    ...group,
    rawLabel: group.label,
    columnId,
    label: getLabelGroupTitle(group.label, labelContext?.columns.find((column) => column.id === columnId)?.name || "label"),
    key: `${keyPrefix}${group.label ? group.label.toLowerCase() : "__unlabeled__"}`,
    tone: group.label && Number.isInteger(toneByLabel.get(group.label.toLowerCase()))
      ? toneByLabel.get(group.label.toLowerCase())
      : "neutral"
  }));

  // Sorting by this column's color orders its groups by hue as well.
  const colorSort = getPaperColorSort(labelContext?.sortId);
  if (colorSort?.columnId === columnId) {
    const direction = labelContext.sortDirection === "desc" ? -1 : 1;
    return groups.sort((left, right) => comparePropertyValues(
      left.rawLabel ? getLabelHueRank(columnId, left.rawLabel) : null,
      right.rawLabel ? getLabelHueRank(columnId, right.rawLabel) : null,
      direction
    ));
  }
  const orderByKey = new Map(preferredOrder.map((key, index) => [key, index]));
  return groups.sort((left, right) => {
    const leftIndex = orderByKey.get(left.key);
    const rightIndex = orderByKey.get(right.key);
    if (leftIndex == null && rightIndex == null) {
      return 0;
    }
    if (leftIndex == null) {
      return 1;
    }
    if (rightIndex == null) {
      return -1;
    }
    return leftIndex - rightIndex;
  });
}

function createTimelineGroups(paperRecords, timestampField = "lastThreadStartedAt", now = new Date()) {
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
    {
      id: "no-timestamp",
      label: timestampField === "parsedAt" ? "No added date" : "No conversations"
    }
  ];
  const recordsByGroup = new Map(definitions.map((definition) => [definition.id, []]));

  paperRecords.forEach((record) => {
    const timestamp = Number(record.paper[timestampField]) || 0;
    let groupId = "no-timestamp";
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
  sortDirection,
  groupOptions,
  activeGroup,
  organizeOptions = null,
  activeOrganize = "",
  showSortOptions = true,
  onSelectSort,
  onSelectSortDirection,
  onSelectGroup,
  onSelectOrganize,
  // "sort" fills the sort menu (Sort by, Order); "group" the group menu (Organized by, Group by).
  part = "sort"
}) {
  const activeOption = sortOptions.find((option) => option.id === activeSort) || sortOptions[0];
  const activeGroupOption = groupOptions.find((option) => option.id === activeGroup) || groupOptions[0];
  sortButton.title = part === "sort"
    ? showSortOptions ? `Sort: ${activeOption.label}` : "Sorting is fixed in the archive"
    : `Group: ${activeGroupOption.label}`;
  const sections = [];
  if (part === "sort" && showSortOptions) {
    sections.push(createSortMenuSection("Sort by", sortOptions, activeOption.id, onSelectSort));
    sections.push(createSortMenuSection(
      "Order",
      [activeOption.sortDirection, activeOption.sortDirection === "asc" ? "desc" : "asc"]
        .map((id) => ({ id, label: activeOption.directionLabels[id] })),
      sortDirection,
      (option) => onSelectSortDirection(option.id)
    ));
  }
  if (part === "group") {
    if (organizeOptions?.length) {
      const activeOrganizeOption = organizeOptions.find((option) => option.id === activeOrganize) || organizeOptions[0];
      sections.push(createSortMenuSection("Organized by", organizeOptions, activeOrganizeOption.id, onSelectOrganize));
    }
    sections.push(createSortMenuSection("Group by", groupOptions, activeGroupOption.id, onSelectGroup));
  }
  sortMenu.replaceChildren(...sections);
}

function createSortMenuSection(heading, options, activeId, onSelect) {
  const section = document.createElement("div");
  section.className = "sort-menu-section";
  section.setAttribute("role", "group");
  section.setAttribute("aria-label", heading);
  const title = document.createElement("p");
  title.className = "click-menu-heading";
  title.textContent = heading;
  section.append(title, ...options.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "click-menu-item sort-menu-option";
    button.classList.toggle("active", option.id === activeId);
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(option.id === activeId));
    button.textContent = option.label;
    button.addEventListener("click", () => onSelect(option));
    return button;
  }));
  return section;
}

export function isDisplayablePaper(paper) {
  const title = normalizeTitleForDisplay(paper?.title);
  return title && !isPlaceholderTitle(title);
}

function createPaperCard({
  paper,
  preview,
  properties,
  activityMessageCount,
  activeDocumentKey,
  activeComparisonDocumentKeys,
  isOpenInBrowser,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onOpenPaper,
  onTogglePaperSelection,
  onSetPaperSelected,
  onTogglePaperStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  groupOptions,
  libraryView,
  paperView,
  onUpdateViewProperties
}) {
  const card = document.createElement("article");
  const isActive = paper.documentKey === activeDocumentKey;
  const isSelected = selectedDocumentKeys.has(paper.documentKey);
  const visibleProperties = getVisiblePaperProperties(properties, libraryView, { fixedOrder: true });
  const showCover = visibleProperties.some((property) => property.id === "figure");
  card.className = "paper-card";
  card.classList.toggle("paper-gallery-card", showCover);
  applyPaperRecordState(card, {
    paper,
    isActive,
    isComparisonRelated: !isActive && activeComparisonDocumentKeys.has(paper.documentKey),
    isSelected,
    manageMode
  });
  card.append(createSelectCheckbox({
    label: paper.title || "paper",
    selected: isSelected,
    onChange: (selected) => onSetPaperSelected?.(paper.documentKey, selected)
  }));
  attachPaperRecordInteractions(card, {
    paper,
    isActive,
    manageMode,
    onOpenPaperContext,
    onOpenPaper,
    onTogglePaperSelection
  });

  const propertyContext = {
    paper,
    preview,
    activityMessageCount,
    isOpenInBrowser,
    libraryView,
    groupOptions,
    onTogglePaperStarred,
    onUpdatePaperGroup,
    onRenamePaperGroup,
    onDeletePaperGroup
  };
  const main = document.createElement("div");
  main.className = "paper-main";

  const wrapOptions = { paperView, properties, onUpdateViewProperties };
  const title = document.createElement("h2");
  title.className = "paper-title";
  title.append(createTitleText(paper));
  applyCardWrap(title, "title", wrapOptions);
  main.append(title);

  const footer = document.createElement("div");
  footer.className = "paper-footer";
  let byline = null;
  visibleProperties
    .filter((property) => property.id !== "title" && property.id !== "figure")
    .forEach((property) => {
      const content = createPropertyContent(property.id, { ...propertyContext, compact: true });
      if (!PAPER_CARD_BYLINE_PROPERTIES.has(property.id)) {
        byline = null;
      } else {
        if (!content) return;
        if (!byline) {
          byline = document.createElement("p");
          byline.className = "paper-card-property paper-card-byline";
          main.append(byline);
        }
        byline.textContent = byline.textContent ? `${byline.textContent} · ${content}` : content;
        byline.title = byline.textContent;
        return;
      }
      if (PAPER_CARD_TEXT_PROPERTIES.has(property.id)) {
        if (!content) return;
        const line = document.createElement("p");
        line.className = `paper-card-property paper-card-property-${property.id}`;
        if (property.id === "shortNote") {
          const text = document.createElement("span");
          text.className = "paper-card-property-text";
          text.textContent = content;
          line.classList.add("with-icon");
          line.append(createPaperPropertyIcon("shortNote", "paper-card-property-icon"), text);
        } else {
          line.append(content);
        }
        line.title = `${property.label}: ${content}`;
        if (property.id === "shortNote") {
          applyCardWrap(line, "shortNote", wrapOptions);
        }
        main.append(line);
        return;
      }
      if (getPaperPropertyLabelColumnId(property.id)) {
        const meta = document.createElement("div");
        meta.className = "paper-footer-meta";
        meta.append(content);
        footer.append(meta);
        return;
      }
      if (content) {
        footer.append(content);
      }
    });

  main.append(footer);
  if (showCover) {
    card.append(createGalleryCover(preview));
  }
  card.append(main);
  return card;
}

// Card titles and short notes either wrap or stay on one line; right-click
// either one to switch, saved for the current view.
function applyCardWrap(element, propertyId, { paperView, properties = [], onUpdateViewProperties }) {
  const property = properties.find((item) => item.id === propertyId) || { id: propertyId };
  const wrapped = isPaperPropertyWrapped(property, paperView);
  element.classList.add(wrapped ? "wrap" : "single-line");
  element.addEventListener("contextmenu", (event) => {
    if (!onUpdateViewProperties) return;
    event.preventDefault();
    event.stopPropagation();
    openPropertyOptionsMenu({
      anchorRect: getPointerAnchorRect(event),
      label: `${getPaperPropertyDefinition(propertyId)?.label || propertyId} options`,
      sections: [{
        heading: getPaperPropertyDefinition(propertyId)?.label || propertyId,
        items: [{
          label: "Wrap text",
          checked: wrapped,
          onSelect: () => onUpdateViewProperties(paperView, properties.map((item) => (
            item.id === propertyId ? { ...item, wrap: !wrapped } : item
          )))
        }]
      }]
    });
  });
}

// Swaps in a newly extracted cover without re-rendering the board.
export function updateGalleryCover(container, documentKey, preview) {
  for (const card of container.querySelectorAll(".paper-gallery-card")) {
    if (card.dataset.documentKey !== documentKey) continue;
    card.querySelector(":scope > .paper-gallery-cover")?.replaceWith(createGalleryCover(preview));
  }
}

function createGalleryCover(preview) {
  const cover = document.createElement("div");
  cover.className = "paper-gallery-cover";
  // The paper's own Figure 1 wins; note images and text are fallbacks.
  const imageSource = preview?.figureImage || preview?.coverImage;
  if (imageSource) {
    const image = document.createElement("img");
    image.src = imageSource;
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";
    image.loading = "lazy";
    if (preview.figureImage) {
      cover.classList.add("figure");
      image.title = `${preview.figure?.page ? `Figure 1 (page ${preview.figure.page})` : "Figure 1"} · hold ⌘ to enlarge`;
    }
    cover.append(image);
  } else if (preview?.notePreview) {
    const text = document.createElement("p");
    text.className = "paper-gallery-note-preview";
    text.textContent = preview.notePreview;
    cover.append(text);
  } else {
    cover.classList.add("empty");
  }
  return cover;
}

function createPropertyContent(propertyId, {
  paper,
  preview,
  compact = false,
  firstAuthorOnly = false,
  activityMessageCount,
  isOpenInBrowser,
  libraryView,
  groupOptions,
  onTogglePaperStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup
}) {
  const labelColumnId = getPaperPropertyLabelColumnId(propertyId);
  if (labelColumnId) {
    return createLabelColumnControl(paper, labelColumnId, libraryView, compact ? "card" : "list");
  }
  switch (propertyId) {
    case "star":
      return createStarButton(paper, onTogglePaperStarred);
    case "messages":
      return createMessagesValue(activityMessageCount);
    case "shortNote":
      return paper.shortNote || "";
    case "savedAsk":
      return preview?.savedAsk || "";
    case "added":
      return formatCellTime(paper.parsedAt);
    case "figure":
      return createFigureThumbnail(preview);
    case "authors":
      return firstAuthorOnly ? preview?.metadata?.authors?.[0] || "" : formatAuthors(preview?.metadata?.authors, compact);
    case "year":
      return preview?.metadata?.year ? String(preview.metadata.year) : "";
    case "venue":
      return abbreviateVenue(preview?.metadata?.venue);
    case "citations":
      return formatCitationCount(preview?.metadata?.citationCount, compact);
    case "openTab":
      return isOpenInBrowser ? createOpenIndicator() : "";
    default:
      return "";
  }
}

function formatAuthors(authors, compact) {
  const names = Array.isArray(authors) ? authors.filter(Boolean) : [];
  if (!compact || names.length <= 1) return names.join(", ");
  return names.length === 2 ? `${names[0]} & ${names[1]}` : `${names[0]} et al.`;
}

function formatCitationCount(count, compact) {
  if (!Number.isFinite(count)) return "";
  const value = count.toLocaleString();
  return compact ? `${value} ${count === 1 ? "citation" : "citations"}` : value;
}

function createFigureThumbnail(preview) {
  if (!preview?.figureImage) return "";
  const image = document.createElement("img");
  image.className = "paper-list-figure";
  image.src = preview.figureImage;
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";
  image.loading = "lazy";
  image.title = `${preview.figure?.page ? `Figure 1 (page ${preview.figure.page})` : "Figure 1"} · hold ⌘ to enlarge`;
  return image;
}

function createLabelColumnControl(paper, columnId, libraryView, yesNoDisplay = "card") {
  const column = labelContext?.columns.find((item) => item.id === columnId);
  return createPaperLabelControl({
    paper,
    columnId,
    columnName: column?.name || "Label",
    yesNoDisplay,
    labels: getPaperLabels(paper, columnId),
    options: labelContext?.optionsByColumn.get(columnId) || [],
    appearance: libraryView === "archive" || paper.labelState === "dead" ? "gray" : "colored",
    onChangeLabels: (labels) => labelContext?.onChangePaperLabels?.(paper, columnId, labels),
    onRenameLabel: (from, to) => labelContext?.onRenameLabel?.(columnId, from, to),
    onDeleteLabel: (name) => labelContext?.onDeleteLabel?.(columnId, name),
    onSetLabelTone: (name, tone) => labelContext?.onSetLabelTone?.(columnId, name, tone)
  });
}

function createOpenIndicator() {
  const indicator = document.createElement("span");
  indicator.className = "paper-open-indicator";
  indicator.setAttribute("role", "img");
  indicator.setAttribute("aria-label", "Paper is open in the browser");
  indicator.title = "Open in the browser";
  return indicator;
}

function createMessagesValue(messageCount) {
  const count = Number(messageCount) || 0;
  const value = document.createElement("span");
  value.className = "paper-messages";
  value.setAttribute("role", "img");
  value.setAttribute("aria-label", `${count} messages`);
  value.title = `${count} messages`;
  const ring = createMessageRing(count);
  ring.removeAttribute("aria-label");
  ring.setAttribute("aria-hidden", "true");
  const number = document.createElement("span");
  number.className = "paper-messages-count";
  number.textContent = String(count);
  number.setAttribute("aria-hidden", "true");
  value.append(ring, number);
  return value;
}

function applyPaperRecordState(element, { paper, isActive, isComparisonRelated, isSelected, manageMode }) {
  element.classList.toggle("active", !manageMode && isActive);
  element.classList.toggle("comparison-related", isComparisonRelated);
  element.classList.toggle("selected", isSelected);
  element.tabIndex = 0;
  element.setAttribute("role", "button");
  element.setAttribute("aria-pressed", String(manageMode ? isSelected : isActive));
  element.setAttribute("aria-label", manageMode
    ? `Select ${paper.title || "paper"}`
    : `Open side panel context for ${paper.title || "paper"}`);
  element.dataset.documentKey = paper.documentKey;
}

function attachPaperRecordInteractions(element, {
  paper,
  isActive,
  manageMode,
  onOpenPaperContext,
  onOpenPaper,
  onTogglePaperSelection
}) {
  element.addEventListener("click", (event) => {
    const suppressUntil = Number(element.dataset.suppressClickUntil) || 0;
    delete element.dataset.suppressClickUntil;
    if (performance.now() < suppressUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (event.shiftKey) {
      onTogglePaperSelection(paper.documentKey);
      return;
    }

    onOpenPaperContext(paper.documentKey);
  });
  element.addEventListener("dblclick", (event) => {
    if (manageMode || isCardActionIgnored(event.target)) {
      return;
    }

    event.preventDefault();
    onOpenPaper?.(paper);
  });
  element.addEventListener("keydown", (event) => {
    if (isCardActionIgnored(event.target)) {
      return;
    }

    if (event.key === "Enter" && manageMode && !event.shiftKey) {
      return;
    }

    if (event.key === "Enter" && isActive && !manageMode && !event.shiftKey) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (event.shiftKey) {
      onTogglePaperSelection(paper.documentKey);
      return;
    }

    onOpenPaperContext(paper.documentKey);
  });
}

// Fixed column widths: squeezable columns made resizing invisible once the
// columns outgrew the table, so the list scrolls sideways instead.
function getPaperListGridTemplate(properties) {
  return [
    ...properties.map((property) => `${property.width}px`),
    "minmax(32px, 1fr)"
  ].join(" ");
}

function createPaperListTable(records, createRow, { container, listProperties, visibleProperties, onUpdateViewProperties, listSort }) {
  const table = document.createElement("div");
  table.className = "paper-list-table";
  table.append(
    createPaperListHeader({ container, listProperties, visibleProperties, onUpdateViewProperties, listSort }),
    ...records.map(createRow)
  );
  return table;
}

function createPaperListHeader({ container, listProperties, visibleProperties, onUpdateViewProperties, listSort = {} }) {
  const activeSort = getPaperPropertySort(listSort.sortId)?.id
    || (listSort.sortId === "title" ? "title" : listSort.sortId === "latestAdded" ? "added" : "");
  const header = document.createElement("div");
  header.className = "paper-list-header";
  visibleProperties.forEach((property) => {
    const cell = document.createElement("div");
    cell.className = `paper-list-header-cell paper-list-cell-${property.id}`;
    cell.dataset.propertyId = property.id;
    cell.title = property.sortType ? "Click for sort and options · drag to move" : "Drag to move";
    if (property.id === "star") {
      const icon = document.createElement("span");
      icon.className = "icon-mask paper-list-star-heading";
      icon.setAttribute("role", "img");
      icon.setAttribute("aria-label", property.label);
      cell.append(icon);
    } else {
      const label = document.createElement("span");
      label.className = "paper-list-header-label";
      label.textContent = property.label;
      cell.append(createPaperPropertyIcon(property.id, "paper-list-header-icon"), label);
      if (property.iconOnly) {
        cell.classList.add("icon-only");
        cell.setAttribute("aria-label", property.label);
      }
      if (property.id === activeSort) {
        const arrow = document.createElement("span");
        arrow.className = "paper-list-sort-arrow";
        arrow.textContent = listSort.sortDirection === "asc" ? "↑" : "↓";
        arrow.setAttribute("aria-label", listSort.sortDirection === "asc" ? "Sorted ascending" : "Sorted descending");
        cell.append(arrow);
      }
    }
    if (property.resizable !== false) {
      cell.append(createPaperListResizeHandle(property, {
        container,
        listProperties,
        visibleProperties,
        onUpdateViewProperties
      }));
    }
    header.append(cell);
  });
  header.append(document.createElement("div"));
  // Right-click opens the same column menu as a click.
  header.addEventListener("contextmenu", (event) => {
    const cell = event.target.closest(".paper-list-header-cell");
    if (!cell) return;
    event.preventDefault();
    header._openColumnMenu?.(cell, getPointerAnchorRect(event));
  });
  attachPaperListHeaderReordering(header, {
    listProperties,
    onUpdateViewProperties,
    onOpenColumnMenu: header._openColumnMenu = (cell, anchorRect = cell.getBoundingClientRect()) => openPaperListColumnMenu({
      anchorRect,
      property: listProperties.find((item) => item.id === cell.dataset.propertyId),
      activeSort,
      sortDirection: listSort.sortDirection,
      onSort: (propertyId, direction, kind) => listSort.onSortByProperty?.(propertyId, direction, kind),
      onUpdate: (propertyId, changes) => onUpdateViewProperties?.(PAPER_VIEW.LIST, listProperties.map((item) => (
        item.id === propertyId ? { ...item, ...changes } : item
      ))),
      hiddenProperties: listProperties
        .filter((item) => !item.visible && !(item.id === "star" && container.dataset.libraryView === "archive"))
        .map((item) => getPaperPropertyDefinition(item.id))
        .filter(Boolean),
      onAddColumn: (afterId, addedId) => {
        const added = { ...listProperties.find((item) => item.id === addedId), visible: true };
        const rest = listProperties.filter((item) => item.id !== addedId);
        rest.splice(rest.findIndex((item) => item.id === afterId) + 1, 0, added);
        onUpdateViewProperties?.(PAPER_VIEW.LIST, rest);
      }
    })
  });
  return header;
}

function createPaperListResizeHandle(property, { container, listProperties, visibleProperties, onUpdateViewProperties }) {
  const handle = document.createElement("span");
  handle.className = "paper-list-resize-handle";
  handle.setAttribute("aria-hidden", "true");
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = handle.parentElement.getBoundingClientRect().width;
    let width = property.width;
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add("paper-list-resizing");

    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      width = clampPaperPropertyWidth(startWidth + moveEvent.clientX - startX, property);
      container.style.setProperty("--paper-list-columns", getPaperListGridTemplate(
        visibleProperties.map((visible) => visible.id === property.id ? { ...visible, width } : visible)
      ));
    };
    const finish = (endEvent) => {
      if (endEvent.pointerId !== event.pointerId) return;
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
      document.body.classList.remove("paper-list-resizing");
      if (width !== property.width) {
        onUpdateViewProperties?.(PAPER_VIEW.LIST, listProperties.map((item) => (
          item.id === property.id ? { ...item, width } : item
        )));
      }
    };
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", finish, true);
  });
  return handle;
}

function attachPaperListHeaderReordering(header, { listProperties, onUpdateViewProperties, onOpenColumnMenu }) {
  header.addEventListener("pointerdown", (event) => {
    const cell = event.target.closest(".paper-list-header-cell");
    if (!cell || event.button !== 0 || event.target.closest(".paper-list-resize-handle")) {
      return;
    }
    const cells = [...header.querySelectorAll(".paper-list-header-cell")];
    const sourceIndex = cells.indexOf(cell);
    const startX = event.clientX;
    let drag = null;
    let frame = 0;
    let pointerX = startX;
    cell.setPointerCapture(event.pointerId);

    // Column geometry is measured once; per-frame work only moves composited layers.
    const begin = () => {
      const rect = cell.getBoundingClientRect();
      const table = header.closest(".paper-list-table").getBoundingClientRect();
      const rects = cells.map((item) => item.getBoundingClientRect());
      const ghost = cell.cloneNode(true);
      ghost.classList.add("paper-list-header-ghost");
      Object.assign(ghost.style, {
        top: `${rect.top}px`,
        left: "0px",
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });
      const indicator = document.createElement("div");
      indicator.className = "paper-list-column-drop-indicator";
      Object.assign(indicator.style, { top: `${table.top}px`, left: "0px", height: `${table.height}px` });
      document.body.append(ghost, indicator);
      document.body.classList.add("dashboard-drag-active");
      cell.classList.add("dragging");
      return {
        ghost,
        indicator,
        offsetX: startX - rect.left,
        centers: rects.map((item) => item.left + item.width / 2),
        boundaries: [...rects.map((item) => item.left), rects.at(-1).right],
        targetIndex: sourceIndex
      };
    };
    const paint = () => {
      frame = 0;
      if (!drag) return;
      drag.ghost.style.transform = `translate3d(${pointerX - drag.offsetX}px, 0, 0)`;
      drag.targetIndex = drag.centers.filter((center) => center < pointerX).length;
      drag.indicator.style.transform = `translate3d(${drag.boundaries[drag.targetIndex] - 1}px, 0, 0)`;
    };
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      pointerX = moveEvent.clientX;
      if (!drag) {
        if (Math.abs(pointerX - startX) < 4) return;
        drag = begin();
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const finish = (cancelled) => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", handleUp, true);
      window.removeEventListener("pointercancel", handleCancel, true);
      window.removeEventListener("keydown", handleKeydown, true);
      cancelAnimationFrame(frame);
      if (!drag) {
        // A press without movement is a click: open the column menu.
        if (!cancelled) onOpenColumnMenu?.(cell);
        return;
      }
      paint();
      drag.ghost.remove();
      drag.indicator.remove();
      document.body.classList.remove("dashboard-drag-active");
      cell.classList.remove("dragging");
      const { targetIndex } = drag;
      if (cancelled || targetIndex === sourceIndex || targetIndex === sourceIndex + 1) return;
      const orderedIds = cells.map((item) => item.dataset.propertyId);
      const [movedId] = orderedIds.splice(sourceIndex, 1);
      orderedIds.splice(targetIndex > sourceIndex ? targetIndex - 1 : targetIndex, 0, movedId);
      onUpdateViewProperties?.(PAPER_VIEW.LIST, reorderPaperProperties(listProperties, orderedIds));
    };
    const ownsPointer = (pointerEvent) => pointerEvent.pointerId === event.pointerId;
    const handleUp = (upEvent) => ownsPointer(upEvent) && finish(false);
    const handleCancel = (cancelEvent) => ownsPointer(cancelEvent) && finish(true);
    const handleKeydown = (keyEvent) => {
      if (keyEvent.key !== "Escape" || !drag) return;
      keyEvent.preventDefault();
      keyEvent.stopImmediatePropagation();
      finish(true);
    };
    // Listen on window: a refresh can replace the header mid-drag, and listeners
    // on the detached cell would never see the pointerup, leaving the ghost stuck.
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", handleUp, true);
    window.addEventListener("pointercancel", handleCancel, true);
    window.addEventListener("keydown", handleKeydown, true);
  });
}

// Notion-style column menu: sort by this column plus the column's display options.
function openPaperListColumnMenu({
  anchorRect,
  property,
  activeSort,
  sortDirection,
  onSort,
  onUpdate,
  hiddenProperties = [],
  onAddColumn
}) {
  const definition = getPaperPropertyDefinition(property?.id);
  if (!definition) return;
  const options = definition.options || [];
  const sections = [];
  if (definition.sortType) {
    const sorted = activeSort === definition.id;
    const [ascLabel, descLabel] = definition.sortType === "text" ? ["A → Z", "Z → A"] : ["Low → high", "High → low"];
    const sortItems = [
      { label: ascLabel, checked: sorted && sortDirection === "asc", onSelect: () => onSort(definition.id, "asc") },
      { label: descLabel, checked: sorted && sortDirection === "desc", onSelect: () => onSort(definition.id, "desc") }
    ];
    if (definition.columnId) {
      const colorSorted = getPaperColorSort(labelContext?.sortId)?.id === definition.id;
      sortItems.push(
        { label: "Red → purple", checked: colorSorted && sortDirection === "asc", onSelect: () => onSort(definition.id, "asc", "color") },
        { label: "Purple → red", checked: colorSorted && sortDirection === "desc", onSelect: () => onSort(definition.id, "desc", "color") }
      );
    }
    sections.push({ heading: "Sort", items: sortItems });
  }
  const displayItems = [];
  if (options.includes("iconOnly")) {
    displayItems.push({ label: "Icon only", checked: Boolean(property.iconOnly), onSelect: () => onUpdate(definition.id, { iconOnly: !property.iconOnly }) });
  }
  if (options.includes("wrap")) {
    const wrapped = isPaperPropertyWrapped(property, PAPER_VIEW.LIST);
    displayItems.push({ label: "Wrap text", checked: wrapped, onSelect: () => onUpdate(definition.id, { wrap: !wrapped }) });
  }
  if (options.includes("firstAuthorOnly")) {
    displayItems.push({
      label: "First author only",
      checked: Boolean(property.firstAuthorOnly),
      onSelect: () => onUpdate(definition.id, { firstAuthorOnly: !property.firstAuthorOnly })
    });
  }
  if (displayItems.length) sections.push({ heading: "Display", items: displayItems });
  if (options.includes("rowHeight")) {
    const current = property.rowHeight || PAPER_FIGURE_ROW_HEIGHTS[0].id;
    sections.push({
      heading: "Row height",
      items: PAPER_FIGURE_ROW_HEIGHTS.map((size) => ({
        label: size.label,
        checked: size.id === current,
        onSelect: () => onUpdate(definition.id, { rowHeight: size.id })
      }))
    });
  }
  if (definition.columnId && labelContext?.onRenameLabelColumn) {
    const labelItems = [{
      label: "Column name",
      input: true,
      value: definition.label,
      onSubmit: (name) => labelContext.onRenameLabelColumn(definition.columnId, name)
    }];
    if (definition.columnId !== DEFAULT_LABEL_COLUMN_ID) {
      labelItems.push({ label: "Delete column", onSelect: () => labelContext.onDeleteLabelColumn?.(definition.columnId) });
    }
    sections.push({ heading: "Label column", items: labelItems });
  }
  if (!definition.required) {
    sections.push({ heading: "Column", items: [{ label: "Hide", onSelect: () => onUpdate(definition.id, { visible: false }) }] });
  }
  const addItems = hiddenProperties.map((hidden) => ({
    label: hidden.label,
    icon: hidden.id,
    onSelect: () => onAddColumn(definition.id, hidden.id)
  }));
  if (labelContext?.onAddLabelColumn) {
    addItems.push({
      label: "New label column…",
      input: true,
      onSubmit: (name) => labelContext.onAddLabelColumn(name, { view: PAPER_VIEW.LIST, afterPropertyId: definition.id })
    });
  }
  if (addItems.length && onAddColumn) {
    sections.push({ heading: "Add column to the right", items: addItems });
  }
  openPropertyOptionsMenu({ anchorRect, label: `${definition.label} column`, sections });
}

// A small menu of checkable property options, opened under a header or at the pointer.
function openPropertyOptionsMenu({ anchorRect, label, sections }) {
  document.querySelectorAll(".paper-property-options-menu").forEach((menu) => menu._close?.());
  if (!sections.length) return;
  const menu = document.createElement("div");
  menu.className = "click-menu paper-property-options-menu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", label);
  menu.append(...sections.map(({ heading, items }) => {
    const section = document.createElement("div");
    section.className = "sort-menu-section";
    section.setAttribute("role", "group");
    const title = document.createElement("p");
    title.className = "click-menu-heading";
    title.textContent = heading;
    section.append(title, ...items.map(({ label: itemLabel, checked, icon, onSelect, input: isInput, value = "", onSubmit }) => {
      if (isInput) {
        // A text field item: Enter submits and closes the menu.
        const field = document.createElement("input");
        field.type = "text";
        field.className = "paper-property-menu-input";
        field.value = value;
        field.placeholder = itemLabel;
        field.setAttribute("aria-label", itemLabel);
        field.addEventListener("keydown", (event) => {
          event.stopPropagation();
          if (event.key !== "Enter") return;
          event.preventDefault();
          const text = field.value.trim();
          close();
          if (text) onSubmit(text);
        });
        return field;
      }
      const item = document.createElement("button");
      item.type = "button";
      item.className = "click-menu-item sort-menu-option";
      item.setAttribute("role", checked === undefined ? "menuitem" : "menuitemcheckbox");
      if (checked !== undefined) item.setAttribute("aria-checked", String(checked));
      if (icon) item.append(createPaperPropertyIcon(icon, "paper-property-menu-icon"));
      item.append(itemLabel);
      item.addEventListener("click", () => {
        close();
        onSelect();
      });
      return item;
    }));
    return section;
  }));
  document.body.append(menu);

  const { width, height } = menu.getBoundingClientRect();
  const top = anchorRect.bottom + 4 + height > window.innerHeight - 8 ? anchorRect.top - 4 - height : anchorRect.bottom + 4;
  menu.style.top = `${Math.round(Math.max(8, top))}px`;
  menu.style.left = `${Math.round(Math.max(8, Math.min(anchorRect.left, window.innerWidth - width - 8)))}px`;

  const handlePointerDown = (event) => {
    if (!menu.contains(event.target)) close();
  };
  const handleKeydown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  function close() {
    document.removeEventListener("pointerdown", handlePointerDown, true);
    document.removeEventListener("keydown", handleKeydown, true);
    window.removeEventListener("scroll", close, true);
    menu.remove();
  }
  menu._close = close;
  document.addEventListener("pointerdown", handlePointerDown, true);
  document.addEventListener("keydown", handleKeydown, true);
  window.addEventListener("scroll", close, true);
}

// A right-click spot as a zero-size anchor, so menus open at the pointer.
function getPointerAnchorRect(event) {
  return { left: event.clientX, right: event.clientX, top: event.clientY, bottom: event.clientY };
}

function createPaperListRow({
  paper,
  preview,
  properties,
  activityMessageCount,
  activeDocumentKey,
  activeComparisonDocumentKeys,
  isOpenInBrowser,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onOpenPaper,
  onTogglePaperSelection,
  onSetPaperSelected,
  onTogglePaperStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  onUpdatePaperShortNote,
  groupOptions,
  libraryView
}) {
  const row = document.createElement("div");
  const isActive = paper.documentKey === activeDocumentKey;
  const isSelected = selectedDocumentKeys.has(paper.documentKey);
  row.className = "paper-list-row";
  applyPaperRecordState(row, {
    paper,
    isActive,
    isComparisonRelated: !isActive && activeComparisonDocumentKeys.has(paper.documentKey),
    isSelected,
    manageMode
  });
  row.append(createSelectCheckbox({
    label: paper.title || "paper",
    selected: isSelected,
    onChange: (selected) => onSetPaperSelected?.(paper.documentKey, selected)
  }));
  attachPaperRecordInteractions(row, {
    paper,
    isActive,
    manageMode,
    onOpenPaperContext,
    onOpenPaper,
    onTogglePaperSelection
  });

  const propertyContext = {
    paper,
    preview,
    activityMessageCount,
    isOpenInBrowser,
    libraryView,
    groupOptions,
    onTogglePaperStarred,
    onUpdatePaperGroup,
    onRenamePaperGroup,
    onDeletePaperGroup
  };
  getVisiblePaperProperties(properties, libraryView).forEach((property) => {
    if (property.id === "shortNote") {
      const noteCell = createShortNoteCell(paper, onUpdatePaperShortNote);
      noteCell.classList.toggle("wrap", isPaperPropertyWrapped(property, PAPER_VIEW.LIST));
      row.append(noteCell);
      return;
    }
    const cell = document.createElement("div");
    cell.className = `paper-list-cell paper-list-cell-${property.id}`;
    cell.classList.toggle("wrap", isPaperPropertyWrapped(property, PAPER_VIEW.LIST));
    const content = property.id === "title"
      ? createPaperListTitle(paper)
      : createPropertyContent(property.id, { ...propertyContext, firstAuthorOnly: Boolean(property.firstAuthorOnly) });
    if (typeof content === "string") {
      // Text sits in its own span so a flex cell can still ellipsize it.
      cell.title = property.id === "venue"
        ? preview?.metadata?.venue || content
        : property.id === "authors" ? formatAuthors(preview?.metadata?.authors, false) || content : content;
      const text = document.createElement("span");
      text.className = "paper-list-cell-text";
      text.textContent = content;
      cell.append(text);
    } else {
      cell.append(content);
    }
    row.append(cell);
  });
  return row;
}

function createPaperListTitle(paper) {
  const title = document.createElement("div");
  title.className = "paper-list-title";
  const text = createTitleText(paper);
  text.title = paper.title;
  title.append(text);
  return title;
}

function createShortNoteCell(paper, onUpdatePaperShortNote) {
  const cell = document.createElement("div");
  cell.className = "paper-list-cell paper-list-cell-shortNote paper-short-note-cell";
  cell.dataset.documentKey = paper.documentKey;
  let value = paper.shortNote || "";

  const save = (nextValue) => {
    const normalized = String(nextValue || "").replace(/[\r\n]+/g, " ").trim();
    if (normalized === value) {
      return;
    }
    value = normalized;
    Promise.resolve(onUpdatePaperShortNote?.(paper, normalized)).catch((error) => {
      console.debug("[Paper Toaster] Could not save paper short note", error);
    });
  };

  const renderText = () => {
    const text = document.createElement("span");
    text.className = "paper-short-note-text";
    text.textContent = value;
    cell.title = value;
    cell.classList.remove("editing");
    cell.classList.toggle("empty", !value);
    cell.replaceChildren(text);
  };

  const startEditing = ({ draft = value, selectionStart = null, selectionEnd = null, focus = true } = {}) => {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "paper-short-note-input";
    input.value = draft;
    input.maxLength = PAPER_SHORT_NOTE_MAX_CHARS;
    input.placeholder = "Short note";
    input.spellcheck = false;
    input.setAttribute("aria-label", `Short note for ${paper.title || "paper"}`);
    let finished = false;
    const finish = (commit, { refocusRow = false } = {}) => {
      if (finished || input.dataset.detached) {
        return;
      }
      finished = true;
      if (commit) {
        save(input.value);
      }
      renderText();
      if (refocusRow) {
        cell.closest(".paper-list-row")?.focus({ preventScroll: true });
      }
    };
    input.addEventListener("keydown", (event) => {
      if (event.isComposing) {
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        finish(true, { refocusRow: true });
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finish(false, { refocusRow: true });
      }
    });
    input.addEventListener("blur", () => finish(true));
    cell.title = "";
    cell.classList.add("editing");
    cell.replaceChildren(input);
    if (focus) {
      input.focus({ preventScroll: true });
      input.setSelectionRange(selectionStart ?? draft.length, selectionEnd ?? draft.length);
    }
  };

  cell.addEventListener("click", (event) => {
    if (event.shiftKey || cell.classList.contains("editing")) {
      return;
    }
    event.stopPropagation();
    startEditing();
  });
  shortNoteEditors.set(cell, { startEditing, save });
  renderText();
  return cell;
}

// Dashboard refreshes rebuild every row, so an in-progress short-note edit is
// carried over to the rebuilt cell instead of being dropped mid-typing.
function captureShortNoteEdit(container) {
  const input = container.querySelector(".paper-short-note-input");
  const cell = input?.closest(".paper-short-note-cell");
  if (!cell) {
    return null;
  }
  input.dataset.detached = "true";
  return {
    documentKey: cell.dataset.documentKey,
    draft: input.value,
    selectionStart: input.selectionStart,
    selectionEnd: input.selectionEnd,
    focus: document.activeElement === input,
    editor: shortNoteEditors.get(cell)
  };
}

function restoreShortNoteEdit(container, edit) {
  if (!edit) {
    return;
  }
  const cell = [...container.querySelectorAll(".paper-short-note-cell")]
    .find((candidate) => candidate.dataset.documentKey === edit.documentKey);
  const editor = cell ? shortNoteEditors.get(cell) : null;
  if (editor) {
    editor.startEditing(edit);
    return;
  }
  edit.editor?.save(edit.draft);
}

function formatCellTime(value) {
  return Number(value) ? formatTime(value) : "";
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
  onToggleComparisonStarred,
  libraryView
}) {
  const card = document.createElement("article");
  const isActive = comparison.comparisonId === activeComparisonId;
  const isRelated = !isActive &&
    Boolean(activeDocumentKey) &&
    comparison.documentKeys.includes(activeDocumentKey);
  const isSelected = selectedComparisonIds.has(comparison.comparisonId);
  card.className = "comparison-record-card";
  card.append(createSelectCheckbox({
    label: comparison.title || "Comparative Reading",
    selected: isSelected,
    onChange: (selected) => onSetComparisonSelected?.(comparison.comparisonId, selected)
  }));
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

    if (event.shiftKey) {
      onToggleComparisonSelection(comparison.comparisonId);
      return;
    }

    onOpenComparisonContext(comparison.comparisonId);
  });
  card.addEventListener("keydown", (event) => {
    if (isComparisonCardActionIgnored(event.target)) {
      return;
    }

    if (event.key === "Enter" && manageMode && !event.shiftKey) {
      return;
    }

    if (event.key === "Enter" && isActive && !manageMode && !event.shiftKey) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (event.shiftKey) {
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
  if (libraryView !== "archive") {
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
    ".paper-star, .paper-group-control, .paper-short-note-input, .paper-select-checkbox"
  ));
}

function isComparisonCardActionIgnored(target) {
  return Boolean(target?.closest?.(".paper-star, .paper-select-checkbox"));
}

function createSelectCheckbox({ label, selected, onChange }) {
  const checkbox = document.createElement("button");
  checkbox.type = "button";
  checkbox.className = "paper-select-checkbox";
  checkbox.setAttribute("role", "checkbox");
  checkbox.setAttribute("aria-checked", String(selected));
  checkbox.setAttribute("aria-label", `Select ${label}`);
  checkbox.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(!selected);
  });
  return checkbox;
}

function isPlaceholderTitle(title) {
  return title === "untitled paper" || title === "title not found";
}

function sortDashboardRecords(records, sortId, libraryView = "board", sortDirection = "desc") {
  const direction = sortDirection === "asc" ? 1 : -1;
  return [...records].sort((left, right) => {
    if (libraryView === "archive") {
      return compareNumber(getRecordArchivedAt(right), getRecordArchivedAt(left)) || compareRecordTitle(left, right);
    }
    if (sortId === "title") {
      return compareRecordTitle(left, right) * direction;
    }
    const colorSort = getPaperColorSort(sortId);
    if (colorSort) {
      return comparePropertyValues(
        getRecordLabelHueRank(left, colorSort.columnId),
        getRecordLabelHueRank(right, colorSort.columnId),
        direction
      ) || compareRecordTitle(left, right);
    }
    const propertySort = getPaperPropertySort(sortId);
    if (propertySort) {
      return comparePropertyValues(
        getRecordPropertyValue(left, propertySort.id),
        getRecordPropertyValue(right, propertySort.id),
        direction
      ) || compareRecordTitle(left, right);
    }
    const leftTime = getRecordSortTime(left, sortId);
    const rightTime = getRecordSortTime(right, sortId);
    if (Boolean(leftTime) !== Boolean(rightTime)) {
      return leftTime ? -1 : 1;
    }
    return compareNumber(leftTime, rightTime) * direction || compareRecordTitle(left, right);
  });
}

// The hue rank (red first) of a paper's first label in a column.
function getRecordLabelHueRank(record, columnId) {
  if (record.type === "comparative-reading") return null;
  const label = getPaperLabels(record.paper, columnId)[0];
  return label ? getLabelHueRank(columnId, label) : null;
}

function getLabelHueRank(columnId, label) {
  const option = labelContext?.optionsByColumn.get(columnId)?.find((item) => item.name.toLowerCase() === label.toLowerCase());
  return option ? getLabelToneHueRank(option.tone) : null;
}

// Empty values sort last in either direction, like Notion.
function comparePropertyValues(left, right, direction) {
  const leftEmpty = left === "" || left === null || left === undefined;
  const rightEmpty = right === "" || right === null || right === undefined;
  if (leftEmpty || rightEmpty) return leftEmpty === rightEmpty ? 0 : leftEmpty ? 1 : -1;
  if (typeof left === "string" || typeof right === "string") {
    return String(left).localeCompare(String(right), undefined, { sensitivity: "base", numeric: true }) * direction;
  }
  return compareNumber(left, right) * direction;
}

function getRecordPropertyValue(record, propertyId) {
  if (record.type === "comparative-reading") {
    return propertyId === "title" ? record.comparison.title : "";
  }
  const { paper, preview } = record;
  const labelColumnId = getPaperPropertyLabelColumnId(propertyId);
  if (labelColumnId) return getPaperLabels(paper, labelColumnId).join(", ");
  const metadata = preview?.metadata;
  switch (propertyId) {
    case "star": return paper.isStarred ? 1 : 0;
    case "figure": return preview?.figureImage ? 1 : null;
    case "title": return paper.title || "";
    case "authors": return metadata?.authors?.[0] || "";
    case "year": return metadata?.year || null;
    case "venue": return abbreviateVenue(metadata?.venue);
    case "citations": return Number.isFinite(metadata?.citationCount) ? metadata.citationCount : null;
    case "shortNote": return paper.shortNote || "";
    case "label": return getPaperLabels(paper, DEFAULT_LABEL_COLUMN_ID)[0] || "";
    case "savedAsk": return preview?.savedAsk || "";
    case "messages": return Number(paper.messageCount) || 0;
    case "added": return Number(paper.parsedAt) || null;
    default: return null;
  }
}

function getRecordArchivedAt(record) {
  return Number(record.type === "comparative-reading"
    ? record.comparison.archivedAt
    : record.paper.archivedAt) || 0;
}

function compareRecordTitle(left, right) {
  return String(getRecordTitle(left)).localeCompare(String(getRecordTitle(right)), undefined, { sensitivity: "base" });
}

function getRecordTitle(record) {
  return record.type === "comparative-reading" ? record.comparison.title : record.paper.title;
}

function getRecordSortTime(record, sortId) {
  if (sortId === "latestAdded") {
    return Number(record.type === "comparative-reading"
      ? record.comparison.createdAt
      : record.paper.parsedAt) || 0;
  }
  if (record.type === "comparative-reading") {
    return Number(record.comparison.updatedAt) || 0;
  }

  return Number(record.paper.lastThreadStartedAt) || 0;
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
