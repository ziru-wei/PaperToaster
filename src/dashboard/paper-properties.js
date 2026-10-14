// "cards" stays the stored id of the board view so saved preferences carry over.
export const PAPER_VIEW = {
  CARDS: "cards",
  LIST: "list",
  GALLERY: "gallery"
};

export const PAPER_VIEW_OPTIONS = [
  { id: PAPER_VIEW.CARDS, label: "Board" },
  { id: PAPER_VIEW.LIST, label: "List" },
  { id: PAPER_VIEW.GALLERY, label: "Gallery" }
];

export const PAPER_PROPERTY_MAX_WIDTH = 800;

// Width, order and column options only apply to the list view; board and gallery
// cards use visibility alone. `options` lists the column menu settings a property has.
export const PAPER_PROPERTIES = [
  { id: "star", label: "Star", icon: "star-outline", width: 36, minWidth: 36, resizable: false, sortType: "number" },
  { id: "figure", label: "Figure", icon: "image", width: 96, minWidth: 40, options: ["iconOnly", "rowHeight"], sortType: "number" },
  { id: "title", label: "Title", icon: "type", width: 320, minWidth: 100, required: true, options: ["iconOnly", "wrap"], sortType: "text" },
  { id: "authors", label: "Authors", icon: "users", width: 200, minWidth: 60, options: ["iconOnly", "wrap", "firstAuthorOnly"], sortType: "text" },
  { id: "year", label: "Year", icon: "calendar", width: 80, minWidth: 40, sortType: "number", options: ["iconOnly"] },
  { id: "venue", label: "Venue", icon: "landmark", width: 160, minWidth: 40, options: ["iconOnly", "wrap"], sortType: "text" },
  { id: "citations", label: "Citations", icon: "quote", width: 84, minWidth: 40, sortType: "number", options: ["iconOnly"] },
  { id: "shortNote", label: "Short note", icon: "sticky-note", width: 260, minWidth: 60, options: ["iconOnly", "wrap"], sortType: "text" },
  { id: "label", label: "Label", icon: "tag", width: 120, minWidth: 40, sortType: "text", options: ["iconOnly"] },
  { id: "savedAsk", label: "Saved ask", icon: "message-circle-question", width: 260, minWidth: 60, options: ["iconOnly", "wrap"], sortType: "text" },
  { id: "messages", label: "Messages", icon: "messages-square", width: 108, minWidth: 40, sortType: "number", options: ["iconOnly"] },
  { id: "added", label: "Added", icon: "calendar-plus", width: 116, minWidth: 40, sortType: "number", options: ["iconOnly"] },
  { id: "openTab", label: "isOpen", icon: "app-window", width: 74, minWidth: 40, options: ["iconOnly"] }
];

export const PAPER_FIGURE_ROW_HEIGHTS = [
  { id: "small", label: "Small", px: 26, options: ["iconOnly"] },
  { id: "medium", label: "Medium", px: 56, options: ["iconOnly"] },
  { id: "large", label: "Large", px: 104, options: ["iconOnly"] }
];

// Lucide icons in src/assets/icons, one per property.
export function createPaperPropertyIcon(propertyId, className = "") {
  const icon = document.createElement("span");
  icon.className = ["icon-mask", "paper-property-icon", className].filter(Boolean).join(" ");
  icon.setAttribute("aria-hidden", "true");
  const name = getPaperPropertyDefinition(propertyId)?.icon;
  if (name) {
    const url = `url("${new URL(`../assets/icons/${name}.svg`, import.meta.url).href}")`;
    icon.style.maskImage = url;
    icon.style.webkitMaskImage = url;
  }
  return icon;
}

export const PAPER_PROPERTY_BY_ID = new Map(PAPER_PROPERTIES.map((property) => [property.id, property]));

// Label columns are user-made properties. The original column keeps the id
// "label"; every other one is "labels:<columnId>", placed right after it.
export const LABEL_PROPERTY_PREFIX = "labels:";
let labelColumnProperties = [];

export function setPaperLabelColumns(columns = []) {
  const original = PAPER_PROPERTY_BY_ID.get("label");
  const originalColumn = columns.find((column) => column.id === "label");
  original.label = originalColumn?.name || "Label";
  original.columnId = "label";
  labelColumnProperties = columns
    .filter((column) => column.id !== "label")
    .map((column) => ({
      id: `${LABEL_PROPERTY_PREFIX}${column.id}`,
      columnId: column.id,
      label: column.name,
      icon: "tag",
      width: 140,
      minWidth: 40,
      options: ["iconOnly"],
      sortType: "text"
    }));
}

export function getPaperPropertyDefinitions() {
  const index = PAPER_PROPERTIES.findIndex((property) => property.id === "label");
  return [...PAPER_PROPERTIES.slice(0, index + 1), ...labelColumnProperties, ...PAPER_PROPERTIES.slice(index + 1)];
}

export function getPaperPropertyDefinition(propertyId) {
  return PAPER_PROPERTY_BY_ID.get(propertyId) || labelColumnProperties.find((property) => property.id === propertyId) || null;
}

// The label column a property shows, or "" for other properties.
export function getPaperPropertyLabelColumnId(propertyId) {
  return getPaperPropertyDefinition(propertyId)?.columnId || "";
}

function getPaperPropertyIndex(propertyId) {
  return getPaperPropertyDefinitions().findIndex((property) => property.id === propertyId);
}

const DEFAULT_VISIBLE_PROPERTIES = {
  [PAPER_VIEW.CARDS]: new Set(["star", "title", "authors", "year", "label", "messages", "openTab"]),
  [PAPER_VIEW.LIST]: new Set(["star", "title", "authors", "year", "venue", "shortNote", "label", "savedAsk", "messages", "openTab"]),
  [PAPER_VIEW.GALLERY]: new Set(["star", "figure", "title", "authors", "year", "shortNote", "label", "messages", "openTab"])
};

// Earlier builds stored only list columns, where "latestAsk" has since become "savedAsk".
export function migrateLegacyPaperListColumns(columns) {
  return (Array.isArray(columns) ? columns : [])
    .map((column) => (column?.id === "latestAsk" ? { ...column, id: "savedAsk", width: undefined } : column));
}

export function normalizePaperView(value) {
  return Object.values(PAPER_VIEW).includes(value) ? value : PAPER_VIEW.CARDS;
}

export function normalizePaperViewProperties(value = {}) {
  return Object.fromEntries(Object.values(PAPER_VIEW).map((view) => [
    view,
    normalizePaperPropertyList(value?.[view], view)
  ]));
}

function normalizePaperPropertyList(value, view) {
  const properties = [];
  const seen = new Set();
  for (const item of Array.isArray(value) ? value : []) {
    const definition = getPaperPropertyDefinition(item?.id);
    if (!definition || seen.has(definition.id)) {
      continue;
    }
    seen.add(definition.id);
    properties.push({
      id: definition.id,
      visible: Boolean(definition.required || item.visible !== false),
      width: clampPaperPropertyWidth(item.width, definition),
      ...normalizePaperPropertyOptions(item, definition)
    });
  }
  // Properties added after a config was saved go right after their default predecessor.
  const definitions = getPaperPropertyDefinitions();
  definitions.forEach((definition, definitionIndex) => {
    if (seen.has(definition.id)) return;
    const previousId = definitions[definitionIndex - 1]?.id;
    const insertAt = previousId ? properties.findIndex((property) => property.id === previousId) + 1 : 0;
    properties.splice(insertAt, 0, {
      id: definition.id,
      visible: DEFAULT_VISIBLE_PROPERTIES[view].has(definition.id),
      width: definition.width
    });
    seen.add(definition.id);
  });
  return properties;
}

// Keeps only the column options a property supports, set to valid values.
function normalizePaperPropertyOptions(item, definition) {
  const options = {};
  const supported = definition.options || [];
  if (supported.includes("iconOnly") && item.iconOnly === true) options.iconOnly = true;
  // Wrap is stored either way, since its default differs between views.
  if (supported.includes("wrap") && typeof item.wrap === "boolean") options.wrap = item.wrap;
  if (supported.includes("firstAuthorOnly") && item.firstAuthorOnly === true) options.firstAuthorOnly = true;
  if (supported.includes("rowHeight") && PAPER_FIGURE_ROW_HEIGHTS.some((size) => size.id === item.rowHeight)) {
    options.rowHeight = item.rowHeight;
  }
  return options;
}

// Board and gallery cards show whole titles unless told otherwise; everything
// else (list cells, card short notes) stays on one line by default.
export function isPaperPropertyWrapped(property, view) {
  if (typeof property?.wrap === "boolean") return property.wrap;
  return view !== PAPER_VIEW.LIST && property?.id === "title";
}

export function getPaperFigureRowHeight(properties) {
  const id = properties.find((property) => property.id === "figure")?.rowHeight;
  return (PAPER_FIGURE_ROW_HEIGHTS.find((size) => size.id === id) || PAPER_FIGURE_ROW_HEIGHTS[0]).px;
}

// Sorting by a column stores "property:<id>" as the view's sort; sorting a
// label column by color stores "color:<id>".
export const PAPER_PROPERTY_SORT_PREFIX = "property:";
export const PAPER_COLOR_SORT_PREFIX = "color:";

export function getPaperColorSort(sortId) {
  const id = String(sortId || "").startsWith(PAPER_COLOR_SORT_PREFIX) ? sortId.slice(PAPER_COLOR_SORT_PREFIX.length) : "";
  const definition = getPaperPropertyDefinition(id);
  return definition?.columnId ? definition : null;
}

export function getPaperPropertySort(sortId) {
  const id = String(sortId || "").startsWith(PAPER_PROPERTY_SORT_PREFIX)
    ? sortId.slice(PAPER_PROPERTY_SORT_PREFIX.length)
    : "";
  const definition = getPaperPropertyDefinition(id);
  return definition?.sortType ? definition : null;
}

export function clampPaperPropertyWidth(value, definition) {
  if (definition.resizable === false) {
    return definition.width;
  }
  const width = Math.round(Number(value));
  return Number.isFinite(width) && width > 0
    ? Math.min(PAPER_PROPERTY_MAX_WIDTH, Math.max(definition.minWidth, width))
    : definition.width;
}

export function isPaperPropertyAvailable(propertyId, libraryView) {
  return !(propertyId === "star" && libraryView === "archive");
}

export function isPaperPropertyVisible(properties, propertyId) {
  return properties.some((property) => property.id === propertyId && property.visible);
}

// Only list columns follow a custom order (set by dragging headers); board and
// gallery cards always show properties in their fixed order.
export function getVisiblePaperProperties(properties, libraryView, { fixedOrder = false } = {}) {
  const visible = properties
    .filter((property) => property.visible && isPaperPropertyAvailable(property.id, libraryView))
    .map((property) => ({ ...getPaperPropertyDefinition(property.id), ...property }));
  return fixedOrder
    ? visible.sort((left, right) => getPaperPropertyIndex(left.id) - getPaperPropertyIndex(right.id))
    : visible;
}

// Applies a new order for the given ids while every other property keeps its slot.
export function reorderPaperProperties(properties, orderedIds) {
  const movable = new Set(orderedIds);
  const byId = new Map(properties.map((property) => [property.id, property]));
  let index = 0;
  return properties.map((property) => (movable.has(property.id) ? byId.get(orderedIds[index++]) : property));
}

export function openPaperPropertiesMenu({ anchor, view, libraryView, properties, onChange, onAddLabelColumn }) {
  let currentView = view;
  let currentLibraryView = libraryView;
  let currentProperties = properties;
  const menu = document.createElement("div");
  menu.className = "click-menu paper-properties-menu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", "Properties");
  document.body.append(menu);

  const commit = (nextProperties) => {
    currentProperties = nextProperties;
    render();
    onChange?.(currentView, nextProperties);
  };

  const render = () => {
    const viewLabel = PAPER_VIEW_OPTIONS.find((option) => option.id === currentView)?.label || "view";
    // The menu lists properties in their fixed order; list columns are reordered by dragging headers.
    const available = getPaperPropertyDefinitions()
      .map((definition) => currentProperties.find((property) => property.id === definition.id))
      .filter((property) => property && isPaperPropertyAvailable(property.id, currentLibraryView));
    const shown = available.filter((property) => property.visible);
    const hidden = available.filter((property) => !property.visible);
    const optional = available.filter((property) => !getPaperPropertyDefinition(property.id).required);

    const heading = document.createElement("p");
    heading.className = "click-menu-heading";
    heading.textContent = "Properties";
    menu.replaceChildren(heading);

    menu.append(createSectionHeader(`Shown in ${viewLabel.toLowerCase()}`, "Hide all",
      optional.some((property) => property.visible),
      () => commit(currentProperties.map((property) => (
        optional.includes(property) ? { ...property, visible: false } : property
      )))));
    const shownList = document.createElement("div");
    shownList.className = "paper-property-options";
    shownList.append(...shown.map(createOption));
    menu.append(shownList);

    if (hidden.length) {
      menu.append(createSectionHeader(`Hidden in ${viewLabel.toLowerCase()}`, "Show all", true,
        () => commit(currentProperties.map((property) => (
          isPaperPropertyAvailable(property.id, currentLibraryView) ? { ...property, visible: true } : property
        )))));
      const hiddenList = document.createElement("div");
      hiddenList.className = "paper-property-options";
      hiddenList.append(...hidden.map(createOption));
      menu.append(hiddenList);
    }
    if (onAddLabelColumn) {
      // Label columns are user-made: name one here and it shows in this view.
      const field = document.createElement("input");
      field.type = "text";
      field.className = "paper-property-menu-input paper-property-new-label";
      field.placeholder = "New label column…";
      field.setAttribute("aria-label", "New label column name");
      field.addEventListener("keydown", (event) => {
        event.stopPropagation();
        if (event.key !== "Enter") return;
        event.preventDefault();
        const name = field.value.trim();
        if (name) onAddLabelColumn(name, currentView);
      });
      menu.append(field);
    }
    position();
  };

  const createSectionHeader = (label, actionLabel, actionEnabled, onAction) => {
    const header = document.createElement("div");
    header.className = "paper-property-section-header";
    const title = document.createElement("span");
    title.textContent = label;
    const action = document.createElement("button");
    action.type = "button";
    action.className = "paper-property-section-action";
    action.textContent = actionLabel;
    action.disabled = !actionEnabled;
    action.addEventListener("click", onAction);
    header.append(title, action);
    return header;
  };

  const createOption = (property) => {
    const definition = getPaperPropertyDefinition(property.id);
    const option = document.createElement("div");
    option.className = "paper-property-option";
    option.classList.toggle("hidden-property", !property.visible);
    option.dataset.propertyId = property.id;

    const name = document.createElement("span");
    name.className = "paper-property-name";
    name.textContent = definition.label;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "paper-property-visibility";
    toggle.classList.toggle("property-hidden", !property.visible);
    toggle.disabled = Boolean(definition.required);
    toggle.setAttribute("role", "menuitemcheckbox");
    toggle.setAttribute("aria-checked", String(property.visible));
    toggle.setAttribute("aria-label", `${property.visible ? "Hide" : "Show"} ${definition.label}`);
    toggle.addEventListener("click", () => {
      commit(currentProperties.map((item) => item.id === property.id ? { ...item, visible: !item.visible } : item));
    });

    option.append(createPaperPropertyIcon(property.id), name, toggle);
    return option;
  };

  const position = () => {
    const anchorRect = anchor.getBoundingClientRect();
    const menuWidth = menu.getBoundingClientRect().width;
    menu.style.top = `${Math.round(anchorRect.bottom + window.scrollY + 6)}px`;
    menu.style.left = `${Math.round(Math.max(8, Math.min(anchorRect.left, window.innerWidth - menuWidth - 8)) + window.scrollX)}px`;
  };

  const handlePointerDown = (event) => {
    if (!menu.contains(event.target) && !anchor.contains(event.target)) {
      close();
    }
  };
  const handleKeydown = (event) => {
    if (event.key !== "Escape") {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener("pointerdown", handlePointerDown, true);
    document.removeEventListener("keydown", handleKeydown, true);
    anchor.setAttribute("aria-expanded", "false");
    anchor.classList.remove("active");
    menu.remove();
  };
  document.addEventListener("pointerdown", handlePointerDown, true);
  document.addEventListener("keydown", handleKeydown, true);
  anchor.setAttribute("aria-expanded", "true");
  anchor.classList.add("active");
  render();

  return {
    close,
    isOpen: () => !closed,
    update(nextView, nextLibraryView, nextProperties) {
      if (closed) return;
      currentView = nextView;
      currentLibraryView = nextLibraryView;
      currentProperties = nextProperties;
      render();
    }
  };
}
