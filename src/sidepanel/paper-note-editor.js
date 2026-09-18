import {
  $applyNodeReplacement,
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $getSelectionStyleValueForProperty,
  $getNodeByKey,
  $getRoot,
  $insertNodes,
  $isRangeSelection,
  $patchStyleText,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  DecoratorNode,
  FORMAT_TEXT_COMMAND,
  PASTE_COMMAND,
  createEditor,
  createEmptyHistoryState,
  registerHistory,
  registerRichText
} from "../../vendor/lexical/lexical-note-editor.mjs";

const editorCleanups = new WeakMap();
const editorsByRoot = new WeakMap();
const activeImageResizeCleanups = new WeakMap();
const NOTE_HIGHLIGHT_STYLE_PROPERTY = "--paper-note-highlight-rgb";
const NOTE_HIGHLIGHT_COLORS = {
  green: "178 214 121",
  gray: "163 163 163"
};

function getNoteHighlightStyles(color) {
  return {
    "background-color": "transparent",
    "background-image": [
      `linear-gradient(103deg, transparent 1%, rgb(${color} / 84%) 3%, rgb(${color} / 58%) 7%, rgb(${color} / 32%) 91%, rgb(${color} / 62%) 96%, transparent 99%)`,
      `linear-gradient(181deg, transparent 0%, rgb(${color} / 30%) 8%, transparent 16%)`
    ].join(", "),
    "text-shadow": `-0.35em 0.3em 0.45em rgb(${color} / 18%)`
  };
}

export class ImageNode extends DecoratorNode {
  __src;
  __width;
  __height;

  static getType() { return "image"; }

  static clone(node) {
    return new ImageNode(node.__src, node.__width, node.__height, node.__key);
  }

  static importJSON(serializedNode) {
    return $createImageNode({
      src: serializedNode?.src,
      width: serializedNode?.width,
      height: serializedNode?.height
    });
  }

  constructor(src = "", width = null, height = null, key) {
    super(key);
    this.__src = normalizeImageSource(src);
    this.__width = normalizeDimension(width);
    this.__height = normalizeDimension(height);
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height
    };
  }

  createDOM() {
    const wrapper = document.createElement("figure");
    wrapper.className = "saved-paper-user-note-image lexical-image-node";
    wrapper.contentEditable = "false";
    wrapper.dataset.nodeKey = this.getKey();
    const image = document.createElement("img");
    image.src = this.__src;
    image.alt = "";
    image.draggable = false;
    applyImageDimensions(image, this.__width, this.__height);
    wrapper.append(image);
    for (const corner of ["nw", "ne", "sw", "se"]) {
      const handle = document.createElement("span");
      handle.className = `saved-paper-user-note-image-resize-handle corner-${corner}`;
      handle.dataset.resizeCorner = corner;
      handle.setAttribute("aria-hidden", "true");
      wrapper.append(handle);
    }
    wrapper.addEventListener("pointerdown", handleImagePointerDown);
    return wrapper;
  }

  updateDOM(previousNode, dom) {
    const image = dom.querySelector("img");
    if (image && (previousNode.__src !== this.__src || previousNode.__width !== this.__width || previousNode.__height !== this.__height)) {
      image.src = this.__src;
      applyImageDimensions(image, this.__width, this.__height);
    }
    return false;
  }

  decorate() { return null; }
  isInline() { return false; }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = normalizeDimension(width);
    writable.__height = normalizeDimension(height);
  }
}

export function $createImageNode({ src, width = null, height = null } = {}) {
  return $applyNodeReplacement(new ImageNode(src, width, height));
}

export function createPaperNoteEditor({ noteDocument, onChange, onCommit, onError }) {
  const note = document.createElement("section");
  note.className = "saved-paper-user-note";
  const editorElement = document.createElement("div");
  editorElement.id = "savedPaperUserNote";
  editorElement.className = "saved-paper-user-note-input lexical-note-editor";
  editorElement.contentEditable = "true";
  editorElement.setAttribute("role", "textbox");
  editorElement.setAttribute("aria-multiline", "true");
  editorElement.setAttribute("aria-label", "User note for this paper");
  editorElement.dataset.keyboardScope = "paper-note";
  const selectionToolbar = createSelectionToolbar();
  note.append(editorElement);
  document.body.append(selectionToolbar.element);

  const editor = createEditor({
    namespace: "PaperToasterUserNote",
    nodes: [ImageNode],
    theme: {
      text: {
        bold: "paper-note-bold-text",
        highlight: "paper-highlight-text"
      }
    },
    onError(error) {
      onError?.(error);
      console.error("[Paper Toaster] User note editor error", error);
    }
  });
  const cleanups = [];
  cleanups.push(() => selectionToolbar.element.remove());
  cleanups.push(registerRichText(editor));
  cleanups.push(registerHistory(editor, createEmptyHistoryState(), 300));
  editor.setRootElement(editorElement);
  editorsByRoot.set(editorElement, editor);
  initializeEditorState(editor, noteDocument, onError);
  const noteFrameSizing = setupPaperNoteFrameSizing(editorElement);
  cleanups.push(noteFrameSizing.cleanup);

  cleanups.push(editor.registerCommand(PASTE_COMMAND, (event) => handleImagePaste(editor, event, onError), COMMAND_PRIORITY_HIGH));
  cleanups.push(editor.registerUpdateListener(({ editorState }) => {
    onChange?.(JSON.stringify(editorState.toJSON()));
    updateSelectionToolbar(editor, editorElement, selectionToolbar);
    noteFrameSizing.update();
  }));

  for (const [action, button] of selectionToolbar.buttons) {
    const preserveSelection = (event) => event.preventDefault();
    const applyFormat = () => {
      if (action === "bold") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      } else {
        applyHighlightColor(editor, action);
      }
      editor.focus();
    };
    button.addEventListener("pointerdown", preserveSelection);
    button.addEventListener("mousedown", preserveSelection);
    button.addEventListener("click", applyFormat);
    cleanups.push(() => button.removeEventListener("pointerdown", preserveSelection));
    cleanups.push(() => button.removeEventListener("mousedown", preserveSelection));
    cleanups.push(() => button.removeEventListener("click", applyFormat));
  }

  let positionFrame = 0;
  const scheduleToolbarUpdate = () => {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(() => updateSelectionToolbar(editor, editorElement, selectionToolbar));
  };
  const hideToolbarAfterBlur = () => requestAnimationFrame(() => {
    if (!editorElement.contains(document.activeElement)) hideSelectionToolbar(selectionToolbar);
  });
  document.addEventListener("selectionchange", scheduleToolbarUpdate);
  window.addEventListener("scroll", scheduleToolbarUpdate, true);
  window.addEventListener("resize", scheduleToolbarUpdate);
  editorElement.addEventListener("blur", hideToolbarAfterBlur, true);
  cleanups.push(() => cancelAnimationFrame(positionFrame));
  cleanups.push(() => document.removeEventListener("selectionchange", scheduleToolbarUpdate));
  cleanups.push(() => window.removeEventListener("scroll", scheduleToolbarUpdate, true));
  cleanups.push(() => window.removeEventListener("resize", scheduleToolbarUpdate));
  cleanups.push(() => editorElement.removeEventListener("blur", hideToolbarAfterBlur, true));

  const handleBlur = () => onCommit?.(serializePaperNoteEditor(editor));
  const handleRootPointerDown = (event) => {
    const selected = event.target.closest?.(".lexical-image-node");
    editorElement.querySelectorAll(".lexical-image-node.selected").forEach((element) => {
      element.classList.toggle("selected", element === selected);
    });
  };
  editorElement.addEventListener("blur", handleBlur, true);
  editorElement.addEventListener("pointerdown", handleRootPointerDown, true);
  cleanups.push(() => editorElement.removeEventListener("blur", handleBlur, true));
  cleanups.push(() => editorElement.removeEventListener("pointerdown", handleRootPointerDown, true));
  cleanups.push(() => activeImageResizeCleanups.get(editorElement)?.());
  cleanups.push(() => {
    editorsByRoot.delete(editorElement);
    editor.setRootElement(null);
  });
  editorCleanups.set(note, () => cleanups.splice(0).reverse().forEach((cleanup) => cleanup?.()));
  return note;
}

function createSelectionToolbar() {
  const element = document.createElement("div");
  element.className = "paper-note-selection-toolbar";
  element.setAttribute("role", "toolbar");
  element.setAttribute("aria-label", "Text formatting");
  const buttons = new Map();
  const actions = [
    ["bold", "Bold", "B"],
    ["green", "Green highlight", ""],
    ["gray", "Gray highlight", ""]
  ];
  for (const [action, label, content] of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `paper-note-selection-toolbar-button ${action === "bold" ? "bold" : `highlight-color ${action}`}`;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");
    button.textContent = content;
    if (action !== "bold") {
      const swatch = document.createElement("span");
      swatch.className = "paper-note-highlight-swatch";
      swatch.setAttribute("aria-hidden", "true");
      button.append(swatch);
    }
    element.append(button);
    buttons.set(action, button);
  }
  return { element, buttons };
}

function applyHighlightColor(editor, colorName) {
  const color = NOTE_HIGHLIGHT_COLORS[colorName];
  if (!color) return;
  let highlighted = false;
  let currentColor = "";
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
    highlighted = selection.hasFormat("highlight");
    currentColor = $getSelectionStyleValueForProperty(selection, NOTE_HIGHLIGHT_STYLE_PROPERTY, NOTE_HIGHLIGHT_COLORS.green);
  });
  const removeHighlight = highlighted && currentColor === color;
  if (!highlighted || removeHighlight) {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
  }
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
    const colorStyles = getNoteHighlightStyles(color);
    $patchStyleText(selection, {
      [NOTE_HIGHLIGHT_STYLE_PROPERTY]: removeHighlight ? null : color,
      "background-color": removeHighlight ? null : colorStyles["background-color"],
      "background-image": removeHighlight ? null : colorStyles["background-image"],
      "text-shadow": removeHighlight ? null : colorStyles["text-shadow"]
    });
  });
}

function updateSelectionToolbar(editor, editorElement, toolbar) {
  if (!editorElement.contains(document.activeElement)) {
    hideSelectionToolbar(toolbar);
    return;
  }
  let visible = false;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
    visible = true;
    const highlighted = selection.hasFormat("highlight");
    const highlightColor = $getSelectionStyleValueForProperty(
      selection,
      NOTE_HIGHLIGHT_STYLE_PROPERTY,
      NOTE_HIGHLIGHT_COLORS.green
    );
    for (const [action, button] of toolbar.buttons) {
      const active = action === "bold"
        ? selection.hasFormat("bold")
        : highlighted && highlightColor === NOTE_HIGHLIGHT_COLORS[action];
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  });
  const domSelection = window.getSelection();
  if (!visible || !domSelection?.rangeCount || domSelection.isCollapsed) {
    hideSelectionToolbar(toolbar);
    return;
  }
  const range = domSelection.getRangeAt(0);
  if (!editorElement.contains(range.commonAncestorContainer)) {
    hideSelectionToolbar(toolbar);
    return;
  }
  toolbar.element.classList.add("visible");
  const selectionRect = range.getBoundingClientRect();
  const toolbarRect = toolbar.element.getBoundingClientRect();
  if (!selectionRect.width && !selectionRect.height) {
    hideSelectionToolbar(toolbar);
    return;
  }
  const gap = 7;
  const viewportPadding = 6;
  const centeredLeft = selectionRect.left + (selectionRect.width - toolbarRect.width) / 2;
  const left = Math.min(window.innerWidth - toolbarRect.width - viewportPadding, Math.max(viewportPadding, centeredLeft));
  const above = selectionRect.top - toolbarRect.height - gap;
  const top = above >= viewportPadding
    ? above
    : Math.min(window.innerHeight - toolbarRect.height - viewportPadding, selectionRect.bottom + gap);
  toolbar.element.style.left = `${Math.round(left)}px`;
  toolbar.element.style.top = `${Math.round(Math.max(viewportPadding, top))}px`;
}

function hideSelectionToolbar(toolbar) {
  toolbar.element.classList.remove("visible");
}

function setupPaperNoteFrameSizing(editorElement) {
  let frame = 0;
  let collapsedForPageScroll = false;
  const getPageScrollTop = () => Math.max(
    0,
    document.scrollingElement?.scrollTop || 0,
    document.documentElement?.scrollTop || 0,
    document.body?.scrollTop || 0,
    window.scrollY || 0
  );
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const style = window.getComputedStyle(editorElement);
      const minimumHeight = Number.parseFloat(style.minHeight) || 100;
      const maximumHeight = Number.parseFloat(style.maxHeight) || minimumHeight * 2;
      const contentHeight = Math.min(maximumHeight, Math.max(minimumHeight, editorElement.scrollHeight));
      if (getPageScrollTop() > 0) collapsedForPageScroll = true;
      const renderedHeight = collapsedForPageScroll ? minimumHeight : contentHeight;
      editorElement.style.height = `${Math.round(renderedHeight)}px`;
    });
  };
  const handlePageWheel = (event) => {
    if (editorElement.contains(event.target)) return;
    if (event.deltaY > 0) {
      collapsedForPageScroll = true;
    } else if (event.deltaY < 0 && getPageScrollTop() <= 2) {
      collapsedForPageScroll = false;
    }
    update();
  };
  window.addEventListener("scroll", update, { passive: true });
  document.addEventListener("scroll", update, { capture: true, passive: true });
  document.addEventListener("wheel", handlePageWheel, { capture: true, passive: true });
  window.addEventListener("resize", update);
  editorElement.addEventListener("load", update, true);
  update();
  return {
    update,
    cleanup() {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, true);
      document.removeEventListener("wheel", handlePageWheel, true);
      window.removeEventListener("resize", update);
      editorElement.removeEventListener("load", update, true);
    }
  };
}

export function serializePaperNoteEditor(editorOrElement) {
  const editor = typeof editorOrElement?.getEditorState === "function" ? editorOrElement : editorsByRoot.get(editorOrElement);
  return editor ? JSON.stringify(editor.getEditorState().toJSON()) : "";
}

export function disposePaperNoteEditor(note) {
  editorCleanups.get(note)?.();
  editorCleanups.delete(note);
}

function initializeEditorState(editor, savedJSON, onError) {
  const serialized = typeof savedJSON === "string" ? savedJSON.trim() : "";
  if (serialized) {
    try {
      editor.setEditorState(editor.parseEditorState(serialized));
      return;
    } catch (error) {
      onError?.(error);
    }
  }
  editor.update(() => {
    const root = $getRoot();
    if (!root.getFirstChild()) root.append($createParagraphNode());
  }, { discrete: true });
}

function handleImagePaste(editor, event, onError) {
  const imageItems = Array.from(event?.clipboardData?.items || [])
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"));
  if (!imageItems.length) return false;
  event.preventDefault();
  imageItems.forEach((item) => {
    const file = item.getAsFile();
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) return;
      editor.update(() => {
        const imageNode = $createImageNode({ src, width: null, height: null });
        $insertNodes([imageNode]);
        imageNode.insertAfter($createParagraphNode());
      });
    };
    reader.onerror = () => onError?.(reader.error || new Error("The pasted image could not be read."));
    reader.readAsDataURL(file);
  });
  return true;
}

function handleImagePointerDown(event) {
  const wrapper = event.currentTarget;
  const root = wrapper.closest(".lexical-note-editor");
  const editor = root ? editorsByRoot.get(root) : null;
  if (!editor) return;
  selectImageNode(editor, wrapper.dataset.nodeKey, wrapper);
  const handle = event.target.closest?.("[data-resize-corner]");
  if (!handle) return;
  event.preventDefault();
  event.stopPropagation();
  const image = wrapper.querySelector("img");
  if (!image) return;
  const startRect = image.getBoundingClientRect();
  const aspectRatio = startRect.width / Math.max(1, startRect.height);
  const startX = event.clientX;
  const direction = handle.dataset.resizeCorner.includes("w") ? -1 : 1;
  const maxWidth = Math.max(48, root.clientWidth);
  activeImageResizeCleanups.get(root)?.();
  handle.setPointerCapture(event.pointerId);
  wrapper.classList.add("resizing");
  const move = (moveEvent) => {
    const width = Math.min(maxWidth, Math.max(48, startRect.width + ((moveEvent.clientX - startX) * direction)));
    image.style.width = `${Math.round(width)}px`;
    image.style.height = `${Math.round(width / aspectRatio)}px`;
  };
  const finish = (commit) => {
    wrapper.classList.remove("resizing");
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", up);
    handle.removeEventListener("pointercancel", cancel);
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    if (activeImageResizeCleanups.get(root) === cancelResize) activeImageResizeCleanups.delete(root);
    if (!commit) {
      applyImageDimensions(image, startRect.width, startRect.height);
      return;
    }
    const finalRect = image.getBoundingClientRect();
    editor.update(() => {
      const node = $getNodeByKey(wrapper.dataset.nodeKey);
      if (node instanceof ImageNode) node.setWidthAndHeight(finalRect.width, finalRect.height);
    });
  };
  const up = () => finish(true);
  const cancel = () => finish(false);
  const cancelResize = () => finish(false);
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", up);
  handle.addEventListener("pointercancel", cancel);
  activeImageResizeCleanups.set(root, cancelResize);
}

function selectImageNode(editor, nodeKey, wrapper) {
  wrapper.closest(".lexical-note-editor")?.querySelectorAll(".lexical-image-node.selected").forEach((element) => {
    element.classList.toggle("selected", element === wrapper);
  });
  editor.update(() => {
    if (!$getNodeByKey(nodeKey)) return;
    const selection = $createNodeSelection();
    selection.add(nodeKey);
    $setSelection(selection);
  });
}

function applyImageDimensions(image, width, height) {
  image.style.width = width ? `${Math.round(width)}px` : "";
  image.style.height = height ? `${Math.round(height)}px` : "";
}

function normalizeImageSource(value) {
  const src = String(value || "");
  return src.startsWith("data:image/") ? src : "";
}

function normalizeDimension(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}
