import {
  createPaperLabelControl,
  getPaperLabelOptions,
  normalizePaperLabel
} from "../components/paper-label-control.js";
import { normalizeDocumentUrl } from "../storage/document-key.js";

const FULL_MESSAGE_RING_COUNT = 10;
const PAPER_CARD_DRAG_LONG_PRESS_MS = 500;
const PAPER_CARD_DRAG_MOVE_TOLERANCE = 8;
const DASHBOARD_DRAG_DISPOSE_EVENT = "paper-toaster:dispose-dashboard-drag";
const DASHBOARD_DRAG_ARTIFACT_SELECTOR = [
  ".paper-group-drag-preview",
  ".paper-group-drop-indicator",
  ".paper-card-drag-preview"
].join(", ");

export function renderPaperList({
  container,
  emptyState,
  papers,
  comparisons = [],
  libraryView = "board",
  showEmptyState = false,
  comparisonMessageCountByDocumentKey = new Map(),
  sortId = "latestThread",
  paperGroupMode = "label",
  labelGroupOrder = [],
  showMessageRings = true,
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
  onTogglePaperStarred,
  onToggleComparisonStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup
}) {
  disposeDashboardDrags(container);

  const isArchiveView = libraryView === "archive";
  const labelOptionPapers = isArchiveView ? papers : papers.filter((paper) => paper.labelState !== "dead");
  const groupOptions = getPaperLabelOptions(labelOptionPapers, {
    appearance: isArchiveView ? "gray" : "colored"
  });
  const paperRecords = sortDashboardRecords(
    papers.map((paper) => ({ type: "single-paper", paper })),
    sortId,
    libraryView
  );
  const comparisonRecords = sortDashboardRecords(
    comparisons.map((comparison) => ({ type: "comparative-reading", comparison })),
    sortId,
    libraryView
  );
  const records = [...paperRecords, ...comparisonRecords];

  const layout = document.createElement("div");
  layout.className = "dashboard-record-layout";
  layout.classList.toggle("has-comparisons", comparisonRecords.length > 0);
  layout.classList.toggle("has-papers", paperRecords.length > 0);

  if (paperRecords.length) {
    const createCard = (record) => createPaperCard({
      paper: record.paper,
      activityMessageCount: (Number(record.paper.messageCount) || 0) +
        (comparisonMessageCountByDocumentKey.get(record.paper.documentKey) || 0),
      activeDocumentKey,
      activeComparisonDocumentKeys,
      isOpenInBrowser: openPaperUrls.has(normalizeDocumentUrl(record.paper.canonicalUrl)),
      showMessageRings,
      manageMode,
      selectedDocumentKeys,
      onOpenPaperContext,
      onOpenPaper,
      onTogglePaperSelection,
      onTogglePaperStarred,
      onUpdatePaperGroup,
      onRenamePaperGroup,
      onDeletePaperGroup,
      groupOptions,
      libraryView
    });

    layout.append(createPaperGroups(paperRecords, createCard, paperGroupMode, {
      sortId,
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
  emptyState.hidden = records.length > 0 || !showEmptyState;
}

function disposeDashboardDrags(container) {
  container.querySelectorAll(".paper-card-groups").forEach((groupContainer) => {
    groupContainer.dispatchEvent(new Event(DASHBOARD_DRAG_DISPOSE_EVENT));
  });
  document.querySelectorAll(DASHBOARD_DRAG_ARTIFACT_SELECTOR).forEach((element) => element.remove());
  document.body.classList.remove("dashboard-drag-active");
}

function createPaperGroups(paperRecords, createCard, mode, {
  sortId,
  manageMode,
  selectedDocumentKeys,
  onSetPaperGroupSelected,
  labelGroupOrder,
  onReorderLabelGroups,
  groupOptions,
  onUpdatePaperGroup
}) {
  const container = document.createElement("div");
  container.className = "paper-card-groups";
  const groups = mode === "recent-conversation"
    ? createTimelineGroups(paperRecords, sortId)
    : createLabelGroups(paperRecords, labelGroupOrder, groupOptions);

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "paper-card-group";
    if (mode === "label") {
      section.dataset.groupKey = group.key;
      section.dataset.groupLabel = group.rawLabel;
      section.dataset.groupTone = group.tone;
    }

    const header = document.createElement("div");
    header.className = "paper-card-group-header";

    const heading = document.createElement("h2");
    heading.className = "paper-card-group-heading";
    heading.textContent = group.label;

    if (manageMode) {
      header.append(createGroupSelectButton(group, selectedDocumentKeys, onSetPaperGroupSelected));
    } else if (mode === "label") {
      header.append(createGroupDragHandle(group));
    }
    header.append(heading);

    const grid = document.createElement("div");
    grid.className = "paper-card-group-grid";
    grid.append(...group.records.map(createCard));
    section.append(header, grid);
    container.append(section);
  });

  if (mode === "label" && !manageMode) {
    attachLabelGroupReordering(container, onReorderLabelGroups);
    attachPaperCardGroupTransfer(container, paperRecords, onUpdatePaperGroup);
  }

  return container;
}

function createGroupDragHandle(group) {
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "paper-group-drag-handle";
  handle.setAttribute("aria-label", `Drag to reorder ${group.label}`);
  return handle;
}

function attachLabelGroupReordering(container, onReorderLabelGroups) {
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
    if (!section) {
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
      ".paper-group-drag-handle, .paper-card-group-heading, .paper-card"
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
    const target = sections.find((section) => (
      drag.lastY < section.getBoundingClientRect().top + section.offsetHeight / 2
    ));
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
    drag.indicator.style.left = `${rect.left + 6}px`;
    drag.indicator.style.top = `${rect.top - 3}px`;
    drag.indicator.style.width = `${Math.max(0, rect.width - 12)}px`;
  }

  function autoScrollDuringGroupDrag(drag) {
    if (activeDrag !== drag) {
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

function attachPaperCardGroupTransfer(container, paperRecords, onUpdatePaperGroup) {
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
        cancelPendingDrag();
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
    const grid = group.querySelector(".paper-card-group-grid");
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
          await onUpdatePaperGroup?.(drag.paper, targetGroup.dataset.groupLabel || "");
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

function createLabelGroups(paperRecords, preferredOrder = [], groupOptions = []) {
  const recordsByLabel = new Map();
  const toneByLabel = new Map(groupOptions.map((option) => [
    normalizePaperLabel(option.name).toLowerCase(),
    String(option.toneClass || "").match(/^paper-group-tone-(\d)$/)?.[1] || "neutral"
  ]));

  paperRecords.forEach((record) => {
    const label = normalizePaperLabel(record.paper.group);
    const key = label.toLowerCase();
    if (!recordsByLabel.has(key)) {
      recordsByLabel.set(key, { label, records: [] });
    }
    recordsByLabel.get(key).records.push(record);
  });

  const groups = [...recordsByLabel.values()].sort((left, right) => {
    if (!left.label) {
      return 1;
    }
    if (!right.label) {
      return -1;
    }
    return left.label.localeCompare(right.label, undefined, { sensitivity: "base" });
  }).map((group) => ({
    ...group,
    rawLabel: group.label,
    label: group.label || "Unlabeled",
    key: group.label ? group.label.toLowerCase() : "__unlabeled__",
    tone: group.label ? toneByLabel.get(group.label.toLowerCase()) || "neutral" : "neutral"
  }));

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

function createTimelineGroups(paperRecords, sortId = "latestThread", now = new Date()) {
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
      label: sortId === "latestAdded" ? "No added date" : "No conversations"
    }
  ];
  const recordsByGroup = new Map(definitions.map((definition) => [definition.id, []]));

  paperRecords.forEach((record) => {
    const timestamp = Number(sortId === "latestAdded"
      ? record.paper.parsedAt
      : record.paper.lastThreadStartedAt) || 0;
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
  onSelectSort
}) {
  const activeOption = sortOptions.find((option) => option.id === activeSort) || sortOptions[0];
  sortButton.title = `Sort: ${activeOption.label}`;
  sortMenu.replaceChildren(...sortOptions.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "click-menu-item sort-menu-option";
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
  activityMessageCount,
  activeDocumentKey,
  activeComparisonDocumentKeys,
  isOpenInBrowser,
  showMessageRings,
  manageMode,
  selectedDocumentKeys,
  onOpenPaperContext,
  onOpenPaper,
  onTogglePaperSelection,
  onTogglePaperStarred,
  onUpdatePaperGroup,
  onRenamePaperGroup,
  onDeletePaperGroup,
  groupOptions,
  libraryView
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
  card.dataset.documentKey = paper.documentKey;
  card.addEventListener("click", (event) => {
    const suppressUntil = Number(card.dataset.suppressClickUntil) || 0;
    delete card.dataset.suppressClickUntil;
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
  card.addEventListener("dblclick", (event) => {
    if (manageMode || isCardActionIgnored(event.target)) {
      return;
    }

    event.preventDefault();
    onOpenPaper?.(paper);
  });
  card.addEventListener("keydown", (event) => {
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

  const main = document.createElement("div");
  main.className = "paper-main";

  const topRow = document.createElement("div");
  topRow.className = "paper-top-row";
  topRow.classList.toggle("message-ring-hidden", !showMessageRings);

  const title = document.createElement("h2");
  title.className = "paper-title";
  title.append(createTitleText(paper));

  if (showMessageRings) {
    topRow.append(createMessageRing(activityMessageCount));
  }
  topRow.append(title);

  const footer = document.createElement("div");
  footer.className = "paper-footer";
  footer.classList.toggle("without-star", libraryView === "archive");

  if (libraryView !== "archive") {
    footer.append(createStarButton(paper, onTogglePaperStarred));
  }
  const meta = document.createElement("div");
  meta.className = "paper-footer-meta";
  meta.append(createPaperLabelControl({
    paper,
    onUpdatePaperGroup,
    onRenamePaperGroup,
    onDeletePaperGroup,
    groupOptions,
    appearance: libraryView === "archive" || paper.labelState === "dead" ? "gray" : "colored",
    enforceLimit: libraryView !== "archive"
  }));
  footer.append(meta);
  const openIndicator = document.createElement("span");
  openIndicator.className = "paper-open-indicator";
  openIndicator.hidden = !isOpenInBrowser;
  openIndicator.setAttribute("role", "img");
  openIndicator.setAttribute("aria-label", "Paper is open in the browser");
  footer.append(openIndicator);

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
    ".paper-star, .paper-group-control"
  ));
}

function isComparisonCardActionIgnored(target) {
  return Boolean(target?.closest?.(".paper-star"));
}

function isPlaceholderTitle(title) {
  return title === "untitled paper" || title === "title not found";
}

function sortDashboardRecords(records, sortId, libraryView = "board") {
  return [...records].sort((left, right) => {
    if (libraryView === "archive") {
      return compareNumber(getRecordArchivedAt(right), getRecordArchivedAt(left)) || compareRecordTitle(left, right);
    }
    return compareNumber(getRecordStarred(right), getRecordStarred(left))
      || compareNumber(getRecordSortTime(right, sortId), getRecordSortTime(left, sortId))
      || compareRecordTitle(left, right);
  });
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
