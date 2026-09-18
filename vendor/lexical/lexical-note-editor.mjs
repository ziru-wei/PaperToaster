var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/lexical/dist/Lexical.dev.mjs
var Lexical_dev_exports = {};
__export(Lexical_dev_exports, {
  $addUpdateTag: () => $addUpdateTag,
  $applyNodeReplacement: () => $applyNodeReplacement,
  $assumeActiveEditor: () => $assumeActiveEditor,
  $caretFromPoint: () => $caretFromPoint,
  $caretRangeFromSelection: () => $caretRangeFromSelection,
  $cloneWithProperties: () => $cloneWithProperties,
  $cloneWithPropertiesEphemeral: () => $cloneWithPropertiesEphemeral,
  $comparePointCaretNext: () => $comparePointCaretNext,
  $copyNode: () => $copyNode,
  $create: () => $create,
  $createChildrenArray: () => $createChildrenArray,
  $createLineBreakNode: () => $createLineBreakNode,
  $createNodeSelection: () => $createNodeSelection,
  $createParagraphNode: () => $createParagraphNode,
  $createPoint: () => $createPoint,
  $createRangeSelection: () => $createRangeSelection,
  $createRangeSelectionFromDom: () => $createRangeSelectionFromDom,
  $createTabNode: () => $createTabNode,
  $createTextNode: () => $createTextNode,
  $extendCaretToRange: () => $extendCaretToRange,
  $findMatchingParent: () => $findMatchingParent,
  $flushSyncAfterUpdate: () => $flushSyncAfterUpdate,
  $formatText: () => $formatText,
  $fullReconcile: () => $fullReconcile,
  $generateNodesFromRawText: () => $generateNodesFromRawText,
  $getAdjacentChildCaret: () => $getAdjacentChildCaret,
  $getAdjacentNode: () => $getAdjacentNode,
  $getAdjacentSiblingOrParentSiblingCaret: () => $getAdjacentSiblingOrParentSiblingCaret,
  $getCaretInDirection: () => $getCaretInDirection,
  $getCaretRange: () => $getCaretRange,
  $getCaretRangeInDirection: () => $getCaretRangeInDirection,
  $getCharacterOffsets: () => $getCharacterOffsets,
  $getChildCaret: () => $getChildCaret,
  $getChildCaretAtIndex: () => $getChildCaretAtIndex,
  $getChildCaretOrSelf: () => $getChildCaretOrSelf,
  $getCollapsedCaretRange: () => $getCollapsedCaretRange,
  $getCommonAncestor: () => $getCommonAncestor,
  $getCommonAncestorResultBranchOrder: () => $getCommonAncestorResultBranchOrder,
  $getDOMSlot: () => $getDOMSlot,
  $getDOMTextNode: () => $getDOMTextNode,
  $getDocument: () => $getDocument,
  $getEditor: () => $getEditor,
  $getEditorDOMRenderConfig: () => $getEditorDOMRenderConfig,
  $getNearestNodeFromDOMNode: () => $getNearestNodeFromDOMNode,
  $getNearestRootOrShadowRoot: () => $getNearestRootOrShadowRoot,
  $getNodeByKey: () => $getNodeByKey,
  $getNodeByKeyOrThrow: () => $getNodeByKeyOrThrow,
  $getNodeFromDOMNode: () => $getNodeFromDOMNode,
  $getPreviousSelection: () => $getPreviousSelection,
  $getRoot: () => $getRoot,
  $getSelection: () => $getSelection,
  $getSelectionSlotFrame: () => $getSelectionSlotFrame,
  $getSiblingCaret: () => $getSiblingCaret,
  $getSlot: () => $getSlot,
  $getSlotFrame: () => $getSlotFrame,
  $getSlotHost: () => $getSlotHost,
  $getSlotNameWithinHost: () => $getSlotNameWithinHost,
  $getSlotNames: () => $getSlotNames,
  $getState: () => $getState,
  $getStateChange: () => $getStateChange,
  $getTextContent: () => $getTextContent,
  $getTextNodeOffset: () => $getTextNodeOffset,
  $getTextPointCaret: () => $getTextPointCaret,
  $getTextPointCaretSlice: () => $getTextPointCaretSlice,
  $getWritableNodeState: () => $getWritableNodeState,
  $hasAncestor: () => $hasAncestor,
  $hasUpdateTag: () => $hasUpdateTag,
  $insertNodeToNearestRootAtCaret: () => $insertNodeToNearestRootAtCaret,
  $insertNodes: () => $insertNodes,
  $isBlockElementNode: () => $isBlockElementNode,
  $isBlockFullySelected: () => $isBlockFullySelected,
  $isChildCaret: () => $isChildCaret,
  $isDecoratorNode: () => $isDecoratorNode,
  $isEditorState: () => $isEditorState,
  $isElementDOMSlot: () => $isElementDOMSlot,
  $isElementNode: () => $isElementNode,
  $isExtendableTextPointCaret: () => $isExtendableTextPointCaret,
  $isInlineElementOrDecoratorNode: () => $isInlineElementOrDecoratorNode,
  $isInlineFormattable: () => $isInlineFormattable,
  $isLeafNode: () => $isLeafNode,
  $isLexicalNode: () => $isLexicalNode,
  $isLineBreakNode: () => $isLineBreakNode,
  $isNodeCaret: () => $isNodeCaret,
  $isNodeSelection: () => $isNodeSelection,
  $isParagraphNode: () => $isParagraphNode,
  $isRangeSelection: () => $isRangeSelection,
  $isRootNode: () => $isRootNode,
  $isRootOrShadowRoot: () => $isRootOrShadowRoot,
  $isSelectionCapturedInDecoratorInput: () => $isSelectionCapturedInDecoratorInput,
  $isShadowRootNode: () => $isShadowRootNode,
  $isSiblingCaret: () => $isSiblingCaret,
  $isSlotChild: () => $isSlotChild,
  $isSlotHost: () => $isSlotHost,
  $isTabNode: () => $isTabNode,
  $isTextNode: () => $isTextNode,
  $isTextPointCaret: () => $isTextPointCaret,
  $isTextPointCaretSlice: () => $isTextPointCaretSlice,
  $isTokenOrSegmented: () => $isTokenOrSegmented,
  $isTokenOrTab: () => $isTokenOrTab,
  $markSlotEditable: () => $markSlotEditable,
  $needsBlockCursorBeside: () => $needsBlockCursorBeside,
  $nodesOfType: () => $nodesOfType,
  $normalizeCaret: () => $normalizeCaret,
  $normalizeSelection__EXPERIMENTAL: () => $normalizeSelection,
  $onUpdate: () => $onUpdate,
  $parseSerializedNode: () => $parseSerializedNode,
  $removeFromParent: () => $removeFromParent,
  $removeSlot: () => $removeSlot,
  $removeTextFromCaretRange: () => $removeTextFromCaretRange,
  $rewindSiblingCaret: () => $rewindSiblingCaret,
  $selectAll: () => $selectAll,
  $setCompositionKey: () => $setCompositionKey,
  $setDirectionFromDOM: () => $setDirectionFromDOM,
  $setFormatFromDOM: () => $setFormatFromDOM,
  $setPointFromCaret: () => $setPointFromCaret,
  $setSelection: () => $setSelection,
  $setSelectionFromCaretRange: () => $setSelectionFromCaretRange,
  $setSlot: () => $setSlot,
  $setState: () => $setState,
  $setTextFormat: () => $setTextFormat,
  $splitAtPointCaretNext: () => $splitAtPointCaretNext,
  $splitNode: () => $splitNode,
  $updateDOMSelection: () => $updateDOMSelection,
  $updateRangeSelectionFromCaretRange: () => $updateRangeSelectionFromCaretRange,
  ArtificialNode__DO_NOT_USE: () => ArtificialNode__DO_NOT_USE,
  BEFORE_INPUT_COMMAND: () => BEFORE_INPUT_COMMAND,
  BLUR_COMMAND: () => BLUR_COMMAND,
  CAN_REDO_COMMAND: () => CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND: () => CAN_UNDO_COMMAND,
  CAN_USE_BEFORE_INPUT: () => CAN_USE_BEFORE_INPUT,
  CAN_USE_DOM: () => CAN_USE_DOM,
  CLEAR_EDITOR_COMMAND: () => CLEAR_EDITOR_COMMAND,
  CLEAR_HISTORY_COMMAND: () => CLEAR_HISTORY_COMMAND,
  CLICK_COMMAND: () => CLICK_COMMAND,
  COLLABORATION_TAG: () => COLLABORATION_TAG,
  COMMAND_PRIORITY_BEFORE_CRITICAL: () => COMMAND_PRIORITY_BEFORE_CRITICAL,
  COMMAND_PRIORITY_BEFORE_EDITOR: () => COMMAND_PRIORITY_BEFORE_EDITOR,
  COMMAND_PRIORITY_BEFORE_HIGH: () => COMMAND_PRIORITY_BEFORE_HIGH,
  COMMAND_PRIORITY_BEFORE_LOW: () => COMMAND_PRIORITY_BEFORE_LOW,
  COMMAND_PRIORITY_BEFORE_NORMAL: () => COMMAND_PRIORITY_BEFORE_NORMAL,
  COMMAND_PRIORITY_CRITICAL: () => COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR: () => COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH: () => COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW: () => COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL: () => COMMAND_PRIORITY_NORMAL,
  COMPOSITION_END_COMMAND: () => COMPOSITION_END_COMMAND,
  COMPOSITION_END_TAG: () => COMPOSITION_END_TAG,
  COMPOSITION_START_COMMAND: () => COMPOSITION_START_COMMAND,
  COMPOSITION_START_TAG: () => COMPOSITION_START_TAG,
  CONTROLLED_TEXT_INSERTION_COMMAND: () => CONTROLLED_TEXT_INSERTION_COMMAND,
  CONTROL_OR_ALT: () => CONTROL_OR_ALT,
  CONTROL_OR_META: () => CONTROL_OR_META,
  CONTROL_OR_OTHER_KEY: () => CONTROL_OR_OTHER_KEY,
  COPY_COMMAND: () => COPY_COMMAND,
  CUT_COMMAND: () => CUT_COMMAND,
  CUT_TAG: () => CUT_TAG,
  DEFAULT_EDITOR_DOM_CONFIG: () => DEFAULT_EDITOR_DOM_CONFIG,
  DELETE_CHARACTER_COMMAND: () => DELETE_CHARACTER_COMMAND,
  DELETE_LINE_COMMAND: () => DELETE_LINE_COMMAND,
  DELETE_WORD_COMMAND: () => DELETE_WORD_COMMAND,
  DRAGEND_COMMAND: () => DRAGEND_COMMAND,
  DRAGOVER_COMMAND: () => DRAGOVER_COMMAND,
  DRAGSTART_COMMAND: () => DRAGSTART_COMMAND,
  DROP_COMMAND: () => DROP_COMMAND,
  DecoratorNode: () => DecoratorNode,
  ElementNode: () => ElementNode,
  FOCUS_COMMAND: () => FOCUS_COMMAND,
  FORMAT_ELEMENT_COMMAND: () => FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND: () => FORMAT_TEXT_COMMAND,
  HISTORIC_TAG: () => HISTORIC_TAG,
  HISTORY_MERGE_TAG: () => HISTORY_MERGE_TAG,
  HISTORY_PUSH_TAG: () => HISTORY_PUSH_TAG,
  INDENT_CONTENT_COMMAND: () => INDENT_CONTENT_COMMAND,
  INPUT_COMMAND: () => INPUT_COMMAND,
  INSERT_LINE_BREAK_COMMAND: () => INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND: () => INSERT_PARAGRAPH_COMMAND,
  INSERT_TAB_COMMAND: () => INSERT_TAB_COMMAND,
  INTERNAL_$expandSelectionToWholeDocument: () => INTERNAL_$expandSelectionToWholeDocument,
  INTERNAL_$isBlock: () => INTERNAL_$isBlock,
  IS_ALL_FORMATTING: () => IS_ALL_FORMATTING,
  IS_ANDROID: () => IS_ANDROID,
  IS_ANDROID_CHROME: () => IS_ANDROID_CHROME,
  IS_APPLE: () => IS_APPLE,
  IS_APPLE_WEBKIT: () => IS_APPLE_WEBKIT,
  IS_BOLD: () => IS_BOLD,
  IS_CHROME: () => IS_CHROME,
  IS_CODE: () => IS_CODE,
  IS_FIREFOX: () => IS_FIREFOX,
  IS_HIGHLIGHT: () => IS_HIGHLIGHT,
  IS_IOS: () => IS_IOS,
  IS_ITALIC: () => IS_ITALIC,
  IS_SAFARI: () => IS_SAFARI,
  IS_STRIKETHROUGH: () => IS_STRIKETHROUGH,
  IS_SUBSCRIPT: () => IS_SUBSCRIPT,
  IS_SUPERSCRIPT: () => IS_SUPERSCRIPT,
  IS_UNDERLINE: () => IS_UNDERLINE,
  KEY_ARROW_DOWN_COMMAND: () => KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND: () => KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND: () => KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND: () => KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND: () => KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND: () => KEY_DELETE_COMMAND,
  KEY_DOWN_COMMAND: () => KEY_DOWN_COMMAND,
  KEY_ENTER_COMMAND: () => KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND: () => KEY_ESCAPE_COMMAND,
  KEY_MODIFIER_COMMAND: () => KEY_MODIFIER_COMMAND,
  KEY_SPACE_COMMAND: () => KEY_SPACE_COMMAND,
  KEY_TAB_COMMAND: () => KEY_TAB_COMMAND,
  LineBreakNode: () => LineBreakNode,
  MOVE_TO_END: () => MOVE_TO_END,
  MOVE_TO_START: () => MOVE_TO_START,
  NODE_STATE_DIRECT: () => NODE_STATE_DIRECT,
  NODE_STATE_KEY: () => NODE_STATE_KEY,
  NODE_STATE_LATEST: () => NODE_STATE_LATEST,
  OUTDENT_CONTENT_COMMAND: () => OUTDENT_CONTENT_COMMAND,
  PASTE_COMMAND: () => PASTE_COMMAND,
  PASTE_TAG: () => PASTE_TAG,
  ParagraphNode: () => ParagraphNode,
  REDO_COMMAND: () => REDO_COMMAND,
  REMOVE_TEXT_COMMAND: () => REMOVE_TEXT_COMMAND,
  RootNode: () => RootNode,
  SELECTION_CHANGE_COMMAND: () => SELECTION_CHANGE_COMMAND,
  SELECTION_INSERT_CLIPBOARD_NODES_COMMAND: () => SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,
  SELECT_ALL_COMMAND: () => SELECT_ALL_COMMAND,
  SET_TEXT_FORMAT_COMMAND: () => SET_TEXT_FORMAT_COMMAND,
  SKIP_COLLAB_TAG: () => SKIP_COLLAB_TAG,
  SKIP_DOM_SELECTION_TAG: () => SKIP_DOM_SELECTION_TAG,
  SKIP_SCROLL_INTO_VIEW_TAG: () => SKIP_SCROLL_INTO_VIEW_TAG,
  SKIP_SELECTION_FOCUS_TAG: () => SKIP_SELECTION_FOCUS_TAG,
  TEXT_TYPE_TO_FORMAT: () => TEXT_TYPE_TO_FORMAT,
  TabNode: () => TabNode,
  TextNode: () => TextNode,
  UNDO_COMMAND: () => UNDO_COMMAND,
  addClassNamesToElement: () => addClassNamesToElement,
  buildImportMap: () => buildImportMap,
  compileKeyboardShortcuts: () => compileKeyboardShortcuts,
  configExtension: () => configExtension,
  createCommand: () => createCommand,
  createEditor: () => createEditor,
  createRefCountedRegistry: () => createRefCountedRegistry,
  createSharedNodeState: () => createSharedNodeState,
  createState: () => createState,
  declarePeerDependency: () => declarePeerDependency,
  defineExtension: () => defineExtension,
  findAllLexicalElementsDeep: () => findAllLexicalElementsDeep,
  flipDirection: () => flipDirection,
  getActiveElement: () => getActiveElement,
  getActiveElementDeep: () => getActiveElementDeep,
  getComposedEventTarget: () => getComposedEventTarget,
  getComposedStaticRange: () => getComposedStaticRange,
  getDOMOwnerDocument: () => getDOMOwnerDocument,
  getDOMSelection: () => getDOMSelection,
  getDOMSelectionFromTarget: () => getDOMSelectionFromTarget,
  getDOMSelectionPoints: () => getDOMSelectionPoints,
  getDOMSelectionRange: () => getDOMSelectionRange,
  getDOMSelectionRangeAndPoints: () => getDOMSelectionRangeAndPoints,
  getDOMShadowRoots: () => getDOMShadowRoots,
  getDOMTextNode: () => getDOMTextNode,
  getDeclaredSlots: () => getDeclaredSlots,
  getEditorPropertyFromDOMNode: () => getEditorPropertyFromDOMNode,
  getNearestEditorFromDOMNode: () => getNearestEditorFromDOMNode,
  getParentElement: () => getParentElement,
  getRegisteredNode: () => getRegisteredNode,
  getRegisteredNodeOrThrow: () => getRegisteredNodeOrThrow,
  getRegisteredSubtypeMap: () => getRegisteredSubtypeMap,
  getRootOwnerDocument: () => getRootOwnerDocument,
  getStaticNodeConfig: () => getStaticNodeConfig,
  getStyleObjectFromCSS: () => getStyleObjectFromCSS,
  getTextDirection: () => getTextDirection,
  getTransformSetFromKlass: () => getTransformSetFromKlass,
  isBlockDomNode: () => isBlockDomNode,
  isCurrentlyReadOnlyMode: () => isCurrentlyReadOnlyMode,
  isDOMCapturingSelection: () => isDOMCapturingSelection,
  isDOMDocumentNode: () => isDOMDocumentNode,
  isDOMNode: () => isDOMNode,
  isDOMShadowRoot: () => isDOMShadowRoot,
  isDOMTextNode: () => isDOMTextNode,
  isDOMUnmanaged: () => isDOMUnmanaged,
  isDocumentFragment: () => isDocumentFragment,
  isExactShortcutMatch: () => isExactShortcutMatch,
  isHTMLAnchorElement: () => isHTMLAnchorElement,
  isHTMLElement: () => isHTMLElement,
  isHTMLTableCellElement: () => isHTMLTableCellElement,
  isHTMLTableRowElement: () => isHTMLTableRowElement,
  isInlineDomNode: () => isInlineDomNode,
  isLastChildInBlockNode: () => isLastChildInBlockNode,
  isLexicalEditor: () => isLexicalEditor,
  isModifierMatch: () => isModifierMatch,
  isOnlyChildInBlockNode: () => isOnlyChildInBlockNode,
  isSelectionCapturedInDecoratorInput: () => isSelectionCapturedInDecoratorInput,
  isSelectionWithinEditor: () => isSelectionWithinEditor,
  iterStaticNodeConfigChain: () => iterStaticNodeConfigChain,
  keyboardEventMaskForPlatform: () => keyboardEventMaskForPlatform,
  makeStepwiseIterator: () => makeStepwiseIterator,
  mergeRegister: () => mergeRegister,
  mountSlotContainer: () => mountSlotContainer,
  normalizeClassNames: () => normalizeClassNames,
  registerEventListener: () => registerEventListener,
  registerEventListeners: () => registerEventListeners,
  removeClassNamesFromElement: () => removeClassNamesFromElement,
  removeFromParent: () => removeFromParent,
  resetRandomKey: () => resetRandomKey,
  safeCast: () => safeCast,
  setDOMStyleFromCSS: () => setDOMStyleFromCSS,
  setDOMStyleObject: () => setDOMStyleObject,
  setDOMUnmanaged: () => setDOMUnmanaged,
  setNodeIndentFromDOM: () => setNodeIndentFromDOM,
  shallowMergeConfig: () => shallowMergeConfig,
  stopLexicalPropagation: () => stopLexicalPropagation,
  toggleTextFormatType: () => toggleTextFormatType,
  tokenizeRawText: () => tokenizeRawText,
  unmountSlotContainer: () => unmountSlotContainer
});
function formatDevErrorMessage(message) {
  throw new Error(message);
}
var CAN_USE_DOM = typeof window !== "undefined" && // eslint-disable-next-line no-restricted-syntax
typeof window.document !== "undefined" && // eslint-disable-next-line no-restricted-syntax
typeof window.document.createElement !== "undefined";
var documentMode = (
  // eslint-disable-next-line no-restricted-syntax
  CAN_USE_DOM && "documentMode" in document ? document.documentMode : null
);
var IS_APPLE = CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
var IS_FIREFOX = CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
var CAN_USE_BEFORE_INPUT = CAN_USE_DOM && "InputEvent" in window && !documentMode ? (
  // eslint-disable-next-line no-restricted-syntax
  "getTargetRanges" in new window.InputEvent("input")
) : false;
var IS_IOS = CAN_USE_DOM && // eslint-disable-next-line no-restricted-syntax
!window.MSStream && (/iPad|iPhone|iPod/.test(navigator.userAgent) || // iPadOS may report a desktop-class Macintosh user agent.
// Real Macs don't support multi-touch, so maxTouchPoints distinguishes them.
/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
var IS_ANDROID = CAN_USE_DOM && /Android/.test(navigator.userAgent);
var IS_SAFARI = CAN_USE_DOM && /Version\/[\d.]+.*Safari/.test(navigator.userAgent) && !IS_ANDROID;
var IS_CHROME = CAN_USE_DOM && /^(?=.*Chrome).*/i.test(navigator.userAgent);
var IS_ANDROID_CHROME = CAN_USE_DOM && IS_ANDROID && IS_CHROME;
var IS_APPLE_WEBKIT = CAN_USE_DOM && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && IS_APPLE && !IS_CHROME;
var DOM_ELEMENT_TYPE = 1;
var DOM_TEXT_TYPE = 3;
var DOM_DOCUMENT_TYPE = 9;
var DOM_DOCUMENT_FRAGMENT_TYPE = 11;
var NO_DIRTY_NODES = 0;
var HAS_DIRTY_NODES = 1;
var FULL_RECONCILE = 2;
var IS_NORMAL = 0;
var IS_TOKEN = 1;
var IS_SEGMENTED = 2;
var IS_BOLD = 1;
var IS_ITALIC = 1 << 1;
var IS_STRIKETHROUGH = 1 << 2;
var IS_UNDERLINE = 1 << 3;
var IS_CODE = 1 << 4;
var IS_SUBSCRIPT = 1 << 5;
var IS_SUPERSCRIPT = 1 << 6;
var IS_HIGHLIGHT = 1 << 7;
var IS_LOWERCASE = 1 << 8;
var IS_UPPERCASE = 1 << 9;
var IS_CAPITALIZE = 1 << 10;
var IS_ALL_FORMATTING = IS_BOLD | IS_ITALIC | IS_STRIKETHROUGH | IS_UNDERLINE | IS_CODE | IS_SUBSCRIPT | IS_SUPERSCRIPT | IS_HIGHLIGHT | IS_LOWERCASE | IS_UPPERCASE | IS_CAPITALIZE;
var IS_DIRECTIONLESS = 1;
var IS_UNMERGEABLE = 1 << 1;
var IS_ALIGN_LEFT = 1;
var IS_ALIGN_CENTER = 2;
var IS_ALIGN_RIGHT = 3;
var IS_ALIGN_JUSTIFY = 4;
var IS_ALIGN_START = 5;
var IS_ALIGN_END = 6;
var NON_BREAKING_SPACE = "\xA0";
var ZERO_WIDTH_SPACE = "\u200B";
var COMPOSITION_SUFFIX = IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT ? NON_BREAKING_SPACE : ZERO_WIDTH_SPACE;
var DOUBLE_LINE_BREAK = "\n\n";
var COMPOSITION_START_CHAR = IS_FIREFOX ? NON_BREAKING_SPACE : COMPOSITION_SUFFIX;
var RTL = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
var LTR = "A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF";
var RTL_REGEX = new RegExp("^[^" + LTR + "]*[" + RTL + "]");
var LTR_REGEX = new RegExp("^[^" + RTL + "]*[" + LTR + "]");
var TEXT_TYPE_TO_FORMAT = {
  bold: IS_BOLD,
  capitalize: IS_CAPITALIZE,
  code: IS_CODE,
  highlight: IS_HIGHLIGHT,
  italic: IS_ITALIC,
  lowercase: IS_LOWERCASE,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
  underline: IS_UNDERLINE,
  uppercase: IS_UPPERCASE
};
var DETAIL_TYPE_TO_DETAIL = {
  directionless: IS_DIRECTIONLESS,
  unmergeable: IS_UNMERGEABLE
};
var ELEMENT_TYPE_TO_FORMAT = {
  center: IS_ALIGN_CENTER,
  end: IS_ALIGN_END,
  justify: IS_ALIGN_JUSTIFY,
  left: IS_ALIGN_LEFT,
  right: IS_ALIGN_RIGHT,
  start: IS_ALIGN_START
};
var ELEMENT_FORMAT_TO_TYPE = {
  [IS_ALIGN_CENTER]: "center",
  [IS_ALIGN_END]: "end",
  [IS_ALIGN_JUSTIFY]: "justify",
  [IS_ALIGN_LEFT]: "left",
  [IS_ALIGN_RIGHT]: "right",
  [IS_ALIGN_START]: "start"
};
var TEXT_MODE_TO_TYPE = {
  normal: IS_NORMAL,
  segmented: IS_SEGMENTED,
  token: IS_TOKEN
};
var TEXT_TYPE_TO_MODE = {
  [IS_NORMAL]: "normal",
  [IS_SEGMENTED]: "segmented",
  [IS_TOKEN]: "token"
};
var NODE_STATE_KEY = "$";
var CONTROL_OR_OTHER_KEY = /* @__PURE__ */ Symbol.for("@lexical/ctrlOrOtherKey");
var PROTOTYPE_CONFIG_METHOD = "$config";
function $getActiveBlockCursorElement() {
  return $getEditor()._blockCursorElement;
}
function isSlotContainerDOM(node) {
  return node !== null && node.nodeType === 1 && node.hasAttribute("data-lexical-slot");
}
var IS_WEBKIT_BROWSER = IS_APPLE_WEBKIT || IS_IOS || IS_SAFARI;
function $createDecoratorBoundaryAnchor() {
  const img = $getDocument().createElement("img");
  img.setAttribute("data-lexical-decorator-boundary", "true");
  img.alt = "";
  for (const [property, value] of [["position", "absolute"], ["width", "0px"], ["height", "0px"], ["border", "0px"], ["margin", "0px"], ["padding", "0px"]]) {
    img.style.setProperty(property, value, "important");
  }
  return img;
}
function isDecoratorBoundaryAnchorDOM(node) {
  return node !== null && node.nodeType === 1 && node.hasAttribute("data-lexical-decorator-boundary");
}
var DOMSlot = class _DOMSlot {
  /** The content-bearing element of the node's DOM. */
  element;
  /** Upper boundary: the lexical-managed range ends before this node. */
  before;
  /** Lower boundary: the lexical-managed range starts after this node. */
  after;
  constructor(element, before, after) {
    this.element = element;
    this.before = before || null;
    this.after = after || null;
  }
  /** Return a new slot with `before` updated. */
  withBefore(before) {
    return new _DOMSlot(this.element, before, this.after);
  }
  /** Return a new slot with `after` updated. */
  withAfter(after) {
    return new _DOMSlot(this.element, this.before, after);
  }
  /** Return a new slot with `element` updated. */
  withElement(element) {
    if (this.element === element) {
      return this;
    }
    return new _DOMSlot(element, this.before, this.after);
  }
  /**
   * Insert the given node before `this.before` (if defined) or append it to
   * `this.element` otherwise. Subclasses may override to respect additional
   * boundaries (e.g. `ElementDOMSlot` also keeps the managed line break at
   * the end).
   */
  insertChild(dom) {
    const before = this.getInsertionAnchor();
    if (!(before === null || before.parentElement === this.element)) {
      formatDevErrorMessage(`DOMSlot.insertChild: before is not in element`);
    }
    this.element.insertBefore(dom, before);
    return this;
  }
  /**
   * Remove the given child from `this.element`. Throws if it was not a child.
   */
  removeChild(dom) {
    if (!(dom.parentElement === this.element)) {
      formatDevErrorMessage(`DOMSlot.removeChild: dom is not in element`);
    }
    this.element.removeChild(dom);
    return this;
  }
  /**
   * Replace `prevDom` with `dom`. Throws if `prevDom` is not a child.
   */
  replaceChild(dom, prevDom) {
    if (!(prevDom.parentElement === this.element)) {
      formatDevErrorMessage(`DOMSlot.replaceChild: prevDom is not in element`);
    }
    this.element.replaceChild(dom, prevDom);
    return this;
  }
  /**
   * Returns the first managed child (the first node in
   * `this.element` that is not a non-lexical prelude / decoration), or
   * `null` if there is none. Subclasses may override to also skip
   * reconciler-managed scaffolding such as the managed line break.
   */
  getFirstChild() {
    const anchor = this.getFirstChildAnchor();
    const firstChild = anchor ? anchor.nextSibling : this.element.firstChild;
    return firstChild === this.getInsertionAnchor() ? null : firstChild;
  }
  /**
   * @internal
   *
   * The leading-boundary counterpart to {@link getInsertionAnchor}: the node
   * the lexical-managed range starts immediately after (its `nextSibling` is
   * the first managed child), or `null` when managed children begin at
   * `this.element.firstChild`. The base slot uses `this.after`; subclasses
   * extend it to skip leading non-lexical scaffolding (e.g. the block cursor).
   */
  getFirstChildAnchor() {
    return this.after;
  }
  /**
   * Map a DOM selection point landing at or inside `leafDOM` (the node's
   * keyed DOM) to whether the caret is positioned BEFORE or AFTER the
   * node in document order. The default implementation derives the
   * boundary from `this.element`'s index inside `leafDOM`:
   *
   * - When `this.element === leafDOM` (no wrap exposed an inner content
   *   element via `withElement`): only a DOM caret directly on
   *   `leafDOM` at offset 0 counts as "before". Matches the historical
   *   decorator rule.
   * - When `this.element !== leafDOM` (wrap pattern that exposed the
   *   inner content element via `withElement`, e.g. a `<br>` inside a
   *   decoration `<span>`): caret positions at or before the content
   *   element are "before", later positions are "after". Handles
   *   nested wraps by walking each side up to its top-level child of
   *   `leafDOM`.
   *
   * Symmetric with {@link ElementDOMSlot.resolveChildIndex}, which
   * performs the analogous mapping for ElementNode children. Together
   * they let the slot abstraction own all DOM-offset to lexical-offset
   * translation.
   *
   * @internal
   */
  resolveLeafPosition(leafDOM, initialDOM, initialOffset) {
    if (this.element === leafDOM) {
      return initialDOM === leafDOM && initialOffset === 0 ? "before" : "after";
    }
    const innerChild = $topLevelChildOf(leafDOM, this.element);
    if (innerChild === null) {
      return "after";
    }
    const innerIndex = Array.prototype.indexOf.call(leafDOM.childNodes, innerChild);
    if (innerIndex < 0) {
      return "after";
    }
    if (initialDOM === leafDOM) {
      return initialOffset <= innerIndex ? "before" : "after";
    }
    const initialChild = $topLevelChildOf(leafDOM, initialDOM);
    if (initialChild === null) {
      return "after";
    }
    const childIndex = Array.prototype.indexOf.call(leafDOM.childNodes, initialChild);
    return childIndex >= 0 && childIndex <= innerIndex ? "before" : "after";
  }
  /**
   * @internal
   *
   * The node managed children are inserted before, or `null` to append.
   * Subclasses widen this to reserve trailing scaffolding (e.g.
   * {@link ElementDOMSlot} keeps the managed line break last).
   */
  getInsertionAnchor() {
    return this.before;
  }
};
function $topLevelChildOf(parent, descendant) {
  let node = descendant;
  while (node !== null && node.parentNode !== parent) {
    node = node.parentNode;
  }
  return node;
}
var ElementDOMSlot = class _ElementDOMSlot extends DOMSlot {
  /** Return a new slot with `before` updated, preserving subclass type. */
  withBefore(before) {
    return new _ElementDOMSlot(this.element, before, this.after);
  }
  /** Return a new slot with `after` updated, preserving subclass type. */
  withAfter(after) {
    return new _ElementDOMSlot(this.element, this.before, after);
  }
  /** Return a new slot with `element` updated, preserving subclass type. */
  withElement(element) {
    if (this.element === element) {
      return this;
    }
    return new _ElementDOMSlot(element, this.before, this.after);
  }
  /**
   * @internal
   */
  getInsertionAnchor() {
    return super.getInsertionAnchor() || this.getManagedLineBreak() || this.getDecoratorBoundaryAnchor("trailing");
  }
  /**
   * @internal
   *
   * Extends the leading boundary to skip the editor's transient block cursor
   * when it sits at the head of the managed range (a collapsed element
   * selection at offset 0), mirroring how {@link getInsertionAnchor} extends
   * the trailing boundary past the managed line break. Only ElementNodes host
   * a block cursor among their children, so the base slot stays editor-free.
   */
  getFirstChildAnchor() {
    let anchor = super.getFirstChildAnchor();
    let node = anchor ? anchor.nextSibling : this.element.firstChild;
    while (isSlotContainerDOM(node)) {
      anchor = node;
      node = node.nextSibling;
    }
    if (isDecoratorBoundaryAnchorDOM(node)) {
      anchor = node;
      node = node.nextSibling;
    }
    const firstChild = anchor ? anchor.nextSibling : this.element.firstChild;
    return firstChild !== null && firstChild === $getActiveBlockCursorElement() ? firstChild : anchor;
  }
  /**
   * @internal
   *
   * The zero-size selection anchor parked outside a leading / trailing block
   * decorator child, or `null` when this element has none on that edge. Each
   * edge's anchor has a fixed DOM position — leading: the head of the managed
   * range (after the `after` boundary and any slot containers); trailing: the
   * very end of the managed range (just inside the `before` boundary) — so
   * this reads the DOM directly instead of maintaining a cache.
   */
  getDecoratorBoundaryAnchor(edge) {
    let node;
    if (edge === "leading") {
      const after = super.getFirstChildAnchor();
      node = after ? after.nextSibling : this.element.firstChild;
      while (isSlotContainerDOM(node)) {
        node = node.nextSibling;
      }
    } else {
      node = this.before ? this.before.previousSibling : this.element.lastChild;
      if (node !== null && node === $getActiveBlockCursorElement()) {
        node = node.previousSibling;
      }
    }
    return isDecoratorBoundaryAnchorDOM(node) ? node : null;
  }
  /**
   * @internal
   *
   * Add or remove the selection anchor on one edge of this element. A no-op
   * when the edge is already in the requested state, so the reconciler can call
   * it unconditionally on every dirty non-inline element.
   */
  setDecoratorBoundaryAnchor(edge, enabled) {
    const existing = this.getDecoratorBoundaryAnchor(edge);
    if (enabled === (existing !== null)) {
      return;
    }
    if (existing !== null) {
      this.element.removeChild(existing);
    } else if (edge === "leading") {
      const firstChildAnchor = this.getFirstChildAnchor();
      this.element.insertBefore($createDecoratorBoundaryAnchor(), firstChildAnchor ? firstChildAnchor.nextSibling : this.element.firstChild);
    } else {
      this.element.insertBefore($createDecoratorBoundaryAnchor(), this.before);
    }
  }
  /**
   * @internal
   */
  getManagedLineBreak() {
    const element = this.element;
    return element.__lexicalLineBreak || null;
  }
  /** @internal */
  setManagedLineBreak(lineBreakType) {
    const element = this.element;
    const firstNode = this.after === null ? element.firstChild : this.after.nextSibling;
    const nextLineBreakType = lineBreakType === "empty" && isSlotContainerDOM(firstNode) ? null : lineBreakType;
    if (element.__lexicalLastChildKind === nextLineBreakType) {
      return;
    }
    element.__lexicalLastChildKind = nextLineBreakType;
    if (nextLineBreakType === null) {
      this.removeManagedLineBreak();
    } else {
      const webkitHack = nextLineBreakType === "decorator" && IS_WEBKIT_BROWSER;
      this.insertManagedLineBreak(webkitHack);
    }
  }
  /** @internal */
  removeManagedLineBreak() {
    const br = this.getManagedLineBreak();
    if (br) {
      const element = this.element;
      const sibling = br.nodeName === "IMG" ? br.nextSibling : null;
      if (sibling) {
        element.removeChild(sibling);
      }
      element.removeChild(br);
      element.__lexicalLineBreak = void 0;
    }
  }
  /** @internal */
  insertManagedLineBreak(webkitHack) {
    const prevBreak = this.getManagedLineBreak();
    if (prevBreak) {
      if (webkitHack === (prevBreak.nodeName === "IMG")) {
        return;
      }
      this.removeManagedLineBreak();
    }
    const element = this.element;
    const before = this.before || this.getDecoratorBoundaryAnchor("trailing");
    const br = $getDocument().createElement("br");
    br.setAttribute("data-lexical-managed-linebreak", "true");
    element.insertBefore(br, before);
    if (webkitHack) {
      const img = $getDocument().createElement("img");
      img.setAttribute("data-lexical-managed-linebreak", "true");
      img.style.setProperty("display", "inline", "important");
      img.style.setProperty("border", "0px", "important");
      img.style.setProperty("margin", "0px", "important");
      img.alt = "";
      element.insertBefore(img, br);
      element.__lexicalLineBreak = img;
    } else {
      element.__lexicalLineBreak = br;
    }
  }
  /**
   * @internal
   *
   * The DOM child index at which the first managed child appears — i.e. the
   * count of leading non-lexical nodes (the `this.after` region, plus the
   * block cursor when it sits at the head). Walks forward from the start,
   * stopping at the first managed child, or at the trailing boundary
   * (`this.before` / the managed line break via {@link getInsertionAnchor})
   * when there are no managed children.
   */
  getFirstChildOffset() {
    const firstChild = this.getFirstChild();
    const insertionAnchor = this.getInsertionAnchor();
    let i2 = 0;
    for (let node = this.element.firstChild; node !== null && node !== firstChild && node !== insertionAnchor; node = node.nextSibling) {
      i2++;
    }
    return i2;
  }
  /**
   * @internal
   */
  resolveChildIndex(element, elementDOM, initialDOM, initialOffset) {
    if (initialDOM === this.element) {
      const firstChildOffset = this.getFirstChildOffset();
      const blockCursor = $getActiveBlockCursorElement();
      const childNodes = this.element.childNodes;
      const limit = Math.min(initialOffset, childNodes.length);
      let idx = 0;
      for (let i2 = firstChildOffset; i2 < limit; i2++) {
        if (childNodes[i2] !== blockCursor) {
          idx++;
        }
      }
      return [element, Math.min(idx, element.getChildrenSize())];
    }
    const initialPath = indexPath(elementDOM, initialDOM);
    initialPath.push(initialOffset);
    const elementPath = indexPath(elementDOM, this.element);
    let offset = element.getIndexWithinParent();
    for (let i2 = 0; i2 < elementPath.length; i2++) {
      const target = initialPath[i2];
      const source = elementPath[i2];
      if (target === void 0 || target < source) {
        break;
      } else if (target > source) {
        offset += 1;
        break;
      }
    }
    return [element.getParentOrThrow(), offset];
  }
};
function indexPath(root, child) {
  const path = [];
  let node = child;
  for (; node !== root && node !== null; node = node.parentNode) {
    let i2 = 0;
    for (let sibling = node.previousSibling; sibling !== null; sibling = sibling.previousSibling) {
      i2++;
    }
    path.push(i2);
  }
  if (!(node === root)) {
    formatDevErrorMessage(`indexPath: root is not a parent of child`);
  }
  return path.reverse();
}
var envLexicalVersion;
try {
  envLexicalVersion = "0.50.0+dev.esm";
} catch (_unused) {
}
var LEXICAL_VERSION = envLexicalVersion ?? '"<unknown>+source"';
var DequeSet = class {
  _front = /* @__PURE__ */ new Set();
  _back = /* @__PURE__ */ new Set();
  _cache;
  get size() {
    return this._front.size + this._back.size;
  }
  addBack(v2) {
    delete this._cache;
    if (!this._front.has(v2)) {
      this._back.add(v2);
    }
    return this;
  }
  addFront(v2) {
    delete this._cache;
    if (!this._back.has(v2)) {
      this._front.add(v2);
    }
    return this;
  }
  delete(v2) {
    delete this._cache;
    return this._front.delete(v2) || this._back.delete(v2);
  }
  toArray() {
    const arr = Array.from(this._front).reverse();
    for (const v2 of this._back) {
      arr.push(v2);
    }
    return arr;
  }
  toReadonlyArray() {
    this._cache = this._cache || this.toArray();
    return this._cache;
  }
  [Symbol.iterator]() {
    return this.toReadonlyArray()[Symbol.iterator]();
  }
};
var TOMBSTONE = null;
var GEN_MAP_SIZE_THRESHOLD = 1e3;
function cloneMap(map, minGenMapSize = GEN_MAP_SIZE_THRESHOLD) {
  if (map instanceof GenMap) {
    return map.clone();
  }
  if (map.size < minGenMapSize) {
    return new Map(map);
  }
  return new GenMap().init(new Map(map), void 0, map.size);
}
var GenMap = class _GenMap {
  _mutable = false;
  _old = void 0;
  _nursery = void 0;
  _size = 0;
  /**
   * Returns a new GenMap that initially shares `_old` and `_nursery`
   * with this one. Marks both as not-mutable so the next write on either
   * side triggers a copy-on-write of the nursery before mutating.
   */
  clone() {
    this._mutable = false;
    return new _GenMap().init(this._old, this._nursery, this._size);
  }
  init(old, nursery, size) {
    this._old = old;
    this._nursery = nursery;
    this._size = size;
    return this;
  }
  get size() {
    return this._size;
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  /**
   * Returns the raw value for `key`, including TOMBSTONE for keys deleted
   * since the last compaction. Used internally to distinguish "missing"
   * from "deleted" without doing a second lookup.
   */
  getWithTombstone(key) {
    const v2 = this._nursery && this._nursery.get(key);
    if (v2 !== void 0) {
      return v2;
    }
    return this._old && this._old.get(key);
  }
  get(key) {
    const v2 = this.getWithTombstone(key);
    return v2 === TOMBSTONE ? void 0 : v2;
  }
  shouldCompact() {
    return this._nursery !== void 0 && this._nursery.size * 2 > this._size;
  }
  /**
   * Returns the nursery for in-place writes. If this GenMap is currently
   * sharing its nursery with an ancestor clone, this either compacts (if
   * the nursery has grown large enough) or makes a shallow copy.
   */
  getNursery() {
    if (!this._mutable || !this._nursery) {
      this.compact();
      this._nursery = new Map(this._nursery);
      this._mutable = true;
    }
    return this._nursery;
  }
  /**
   * Fold the nursery into a new `_old` snapshot when it has grown large
   * enough that lookup overhead outweighs the savings from sharing.
   * Triggered automatically from `getNursery` once `_nursery.size * 2 >
   * _size`; can be forced via `compact(true)`.
   */
  compact(force = false) {
    if (this._nursery && this._nursery.size > 0 && (force || this.shouldCompact())) {
      const compact = new Map(this._old);
      for (const [k, v2] of this._nursery) {
        if (v2 !== TOMBSTONE) {
          compact.set(k, v2);
        } else {
          compact.delete(k);
        }
      }
      this._old = compact;
      this._nursery = void 0;
    }
    this._mutable = false;
    return this;
  }
  set(key, value) {
    const v2 = this.getWithTombstone(key);
    if (v2 === value) {
      return this;
    }
    const nursery = this.getNursery();
    if (v2 === TOMBSTONE || v2 === void 0) {
      this._size++;
      if (v2 === TOMBSTONE) {
        nursery.delete(key);
      }
    }
    nursery.set(key, value);
    return this;
  }
  delete(key) {
    const deleted = this.has(key);
    if (deleted) {
      this.getNursery().set(key, TOMBSTONE);
      this._size--;
    }
    return deleted;
  }
  getOrInsert(key, defaultValue) {
    const existing = this.get(key);
    if (existing !== void 0) {
      return existing;
    }
    this.set(key, defaultValue);
    return defaultValue;
  }
  getOrInsertComputed(key, computer) {
    const existing = this.get(key);
    if (existing !== void 0) {
      return existing;
    }
    const value = computer(key);
    this.set(key, value);
    return value;
  }
  clear() {
    this._mutable = false;
    this._old = void 0;
    this._nursery = void 0;
    this._size = 0;
  }
  *keys() {
    for (const pair of this.entries()) {
      yield pair[0];
    }
  }
  *values() {
    for (const pair of this.entries()) {
      yield pair[1];
    }
  }
  *entries() {
    const nursery = this._nursery;
    const old = this._old;
    if (old) {
      for (const pair of old) {
        const k = pair[0];
        const v2 = nursery ? nursery.get(k) : void 0;
        if (v2 === TOMBSTONE) {
          continue;
        } else if (v2 !== void 0) {
          pair[1] = v2;
        }
        yield pair;
      }
    }
    if (nursery) {
      for (const pair of nursery) {
        if (pair[1] !== TOMBSTONE && !(old && old.has(pair[0]))) {
          yield pair;
        }
      }
    }
  }
  forEach(callbackfn, thisArg) {
    if (thisArg !== void 0) {
      callbackfn = callbackfn.bind(thisArg);
    }
    for (const [k, v2] of this.entries()) {
      callbackfn(v2, k, this);
    }
  }
  get [Symbol.toStringTag]() {
    return "GenMap";
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
function $garbageCollectDetachedDecorators(editor, pendingEditorState) {
  const currentDecorators = editor._decorators;
  const pendingDecorators = editor._pendingDecorators;
  let decorators = pendingDecorators || currentDecorators;
  const nodeMap = pendingEditorState._nodeMap;
  let key;
  for (key in decorators) {
    if (!nodeMap.has(key)) {
      if (decorators === currentDecorators) {
        decorators = cloneDecorators(editor);
      }
      delete decorators[key];
    }
  }
}
function $garbageCollectDetachedDeepChildNodes(node, parentKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes) {
  if ($isElementNode(node)) {
    let child = node.getFirstChild();
    while (child !== null) {
      const childKey = child.__key;
      if (child.__parent === parentKey) {
        if ($isElementNode(child) || $isSlotHost(child) && child.__slots !== null) {
          $garbageCollectDetachedDeepChildNodes(child, childKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes);
        }
        if (!prevNodeMap.has(childKey)) {
          dirtyNodes.delete(childKey);
        }
        nodeMapDelete.push(childKey);
      }
      child = child.getNextSibling();
    }
  }
  for (const slotKey of $isSlotHost(node) && node.__slots !== null ? node.__slots.values() : []) {
    const slotNode = nodeMap.get(slotKey);
    if (slotNode !== void 0 && $isSlotChild(slotNode) && slotNode.__slotHost === parentKey) {
      if ($isElementNode(slotNode) || $isSlotHost(slotNode) && slotNode.__slots !== null) {
        $garbageCollectDetachedDeepChildNodes(slotNode, slotKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes);
      }
      if (!prevNodeMap.has(slotKey)) {
        dirtyNodes.delete(slotKey);
      }
      nodeMapDelete.push(slotKey);
    }
  }
}
function $garbageCollectDetachedNodes(prevEditorState, editorState, dirtyLeaves, dirtyElements) {
  const prevNodeMap = prevEditorState._nodeMap;
  const nodeMap = editorState._nodeMap;
  const nodeMapDelete = [];
  for (const [nodeKey] of dirtyElements) {
    const node = nodeMap.get(nodeKey);
    if (node !== void 0) {
      if (!node.isAttached()) {
        if ($isElementNode(node)) {
          $garbageCollectDetachedDeepChildNodes(node, nodeKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyElements);
        }
        if (!prevNodeMap.has(nodeKey)) {
          dirtyElements.delete(nodeKey);
        }
        nodeMapDelete.push(nodeKey);
      }
    }
  }
  for (const nodeKey of dirtyLeaves) {
    const node = nodeMap.get(nodeKey);
    if (node !== void 0 && !node.isAttached()) {
      if ($isSlotHost(node) && node.__slots !== null) {
        $garbageCollectDetachedDeepChildNodes(node, nodeKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyLeaves);
      }
      if (!prevNodeMap.has(nodeKey)) {
        dirtyLeaves.delete(nodeKey);
      }
      nodeMapDelete.push(nodeKey);
    }
  }
  for (const nodeKey of nodeMapDelete) {
    nodeMap.delete(nodeKey);
  }
  const editor = getActiveEditor();
  const compositionKey = editor._compositionKey;
  if (compositionKey !== null && !nodeMap.has(compositionKey)) {
    editor._compositionKey = null;
  }
}
var TEXT_MUTATION_VARIANCE = 100;
var isProcessingMutations = false;
var lastTextEntryTimeStamp = 0;
function getIsProcessingMutations() {
  return isProcessingMutations;
}
function updateTimeStamp(event) {
  lastTextEntryTimeStamp = event.timeStamp;
}
function initTextEntryListener(editor) {
  if (lastTextEntryTimeStamp === 0) {
    getWindow(editor).addEventListener("textInput", updateTimeStamp, true);
  }
}
function isEditorManagedLineBreak(dom, target, editor) {
  const isBR = dom.nodeName === "BR";
  const lexicalLineBreak = target.__lexicalLineBreak;
  return lexicalLineBreak && (dom === lexicalLineBreak || isBR && dom.previousSibling === lexicalLineBreak) || isBR && getNodeKeyFromDOMNode(dom, editor) !== void 0;
}
function getLastSelection(editor) {
  return editor.read("latest", () => {
    const selection = $getSelection();
    return selection !== null ? selection.clone() : null;
  });
}
function $handleTextMutation(target, node, editor) {
  const domSelection = getDOMSelection(getWindow(editor));
  const domSelectionPoints = domSelection && getDOMSelectionPoints(domSelection, editor._rootElement);
  let anchorOffset = null;
  let focusOffset = null;
  if (domSelectionPoints !== null && domSelectionPoints.anchorNode === target) {
    anchorOffset = domSelectionPoints.anchorOffset;
    focusOffset = domSelectionPoints.focusOffset;
  }
  const text = target.nodeValue;
  if (text !== null) {
    $updateTextNodeFromDOMContent(node, text, anchorOffset, focusOffset, false);
  }
}
function shouldUpdateTextNodeFromMutation(selection, targetDOM, targetNode) {
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    if (anchorNode.is(targetNode) && selection.format !== anchorNode.getFormat()) {
      return false;
    }
  }
  return isDOMTextNode(targetDOM) && targetNode.isAttached();
}
function $getNearestManagedNodePairFromDOMNode(startingDOM, editor, editorState) {
  for (let dom = startingDOM; dom && !isDOMUnmanaged(dom); dom = getParentElement(dom)) {
    const key = getNodeKeyFromDOMNode(dom, editor);
    if (key !== void 0) {
      const node = $getNodeByKey(key, editorState);
      if (node) {
        return $isDecoratorNode(node) || !isHTMLElement(dom) ? void 0 : [dom, node];
      }
    }
  }
}
function flushMutations(editor, mutations, observer) {
  isProcessingMutations = true;
  const shouldFlushTextMutations = performance.now() - lastTextEntryTimeStamp > TEXT_MUTATION_VARIANCE;
  try {
    updateEditorSync(editor, () => {
      const selection = $getSelection() || getLastSelection(editor);
      const badDOMTargets = /* @__PURE__ */ new Map();
      const currentEditorState = editor._editorState;
      const blockCursorElement = editor._blockCursorElement;
      let shouldRevertSelection = false;
      let possibleTextForFirefoxPaste = "";
      for (let i2 = 0; i2 < mutations.length; i2++) {
        const mutation = mutations[i2];
        const type = mutation.type;
        const targetDOM = mutation.target;
        const pair = $getNearestManagedNodePairFromDOMNode(targetDOM, editor, currentEditorState);
        if (!pair) {
          continue;
        }
        const [nodeDOM, targetNode] = pair;
        if (type === "characterData") {
          if (
            // TODO there is an edge case here if a mutation happens too quickly
            //      after text input, it may never be handled since we do not
            //      track the ignored mutations in any way
            shouldFlushTextMutations && $isTextNode(targetNode) && isDOMTextNode(targetDOM) && shouldUpdateTextNodeFromMutation(selection, targetDOM, targetNode)
          ) {
            $handleTextMutation(targetDOM, targetNode, editor);
          }
        } else if (type === "childList") {
          shouldRevertSelection = true;
          const addedDOMs = mutation.addedNodes;
          for (let s2 = 0; s2 < addedDOMs.length; s2++) {
            const addedDOM = addedDOMs[s2];
            const node = $getNodeFromDOMNode(addedDOM);
            const parentDOM = addedDOM.parentNode;
            if (parentDOM != null && addedDOM !== blockCursorElement && node === null && !isEditorManagedLineBreak(addedDOM, parentDOM, editor) && // The zero-size selection anchors the reconciler parks outside
            // a leading / trailing block decorator (#8922) are keyless
            // scaffolding, like the managed line break — don't evict them
            // as foreign DOM.
            !isDecoratorBoundaryAnchorDOM(addedDOM) && // @experimental named-slots. Slot containers are keyless
            // reconciler scaffolding: a flush that observes one being
            // parked in its host or relocated by an explicit mount must
            // not evict it as foreign DOM. Gated on the editor slot latch so
            // a non-slot editor still evicts foreign DOM that happens to
            // carry a `data-lexical-slot` attribute.
            !(editor._slotsUsed && isHTMLElement(addedDOM) && addedDOM.hasAttribute("data-lexical-slot")) && // Skip externally-added DOM that's explicitly opted out of
            // mutation tracking (e.g. an extension-rendered decoration
            // inside a TextNode's span, like the autocomplete ghost).
            !isDOMUnmanaged(addedDOM)) {
              if (IS_FIREFOX) {
                const possibleText = (isHTMLElement(addedDOM) ? addedDOM.innerText : null) || addedDOM.nodeValue;
                if (possibleText) {
                  possibleTextForFirefoxPaste += possibleText;
                }
              }
              parentDOM.removeChild(addedDOM);
            }
          }
          const removedDOMs = mutation.removedNodes;
          const removedDOMsLength = removedDOMs.length;
          if (removedDOMsLength > 0) {
            let unremovedBRs = 0;
            for (let s2 = 0; s2 < removedDOMsLength; s2++) {
              const removedDOM = removedDOMs[s2];
              if (isEditorManagedLineBreak(removedDOM, targetDOM, editor) || blockCursorElement === removedDOM) {
                targetDOM.appendChild(removedDOM);
                unremovedBRs++;
              } else if (isDecoratorBoundaryAnchorDOM(removedDOM)) {
                unremovedBRs++;
              }
            }
            if (removedDOMsLength !== unremovedBRs) {
              badDOMTargets.set(nodeDOM, targetNode);
            }
          }
        }
      }
      if (badDOMTargets.size > 0) {
        for (const [nodeDOM, targetNode] of badDOMTargets) {
          targetNode.reconcileObservedMutation(nodeDOM, editor);
        }
      }
      const records = observer.takeRecords();
      if (records.length > 0) {
        for (let i2 = 0; i2 < records.length; i2++) {
          const record = records[i2];
          const addedNodes = record.addedNodes;
          const target = record.target;
          for (let s2 = 0; s2 < addedNodes.length; s2++) {
            const addedDOM = addedNodes[s2];
            const parentDOM = addedDOM.parentNode;
            if (parentDOM != null && addedDOM.nodeName === "BR" && !isEditorManagedLineBreak(addedDOM, target, editor)) {
              parentDOM.removeChild(addedDOM);
            }
          }
        }
        observer.takeRecords();
      }
      if (selection !== null) {
        if (shouldRevertSelection) {
          $setSelection(selection);
        }
        if (IS_FIREFOX && isFirefoxClipboardEvents(editor)) {
          selection.insertRawText(possibleTextForFirefoxPaste);
        }
      }
    });
  } finally {
    isProcessingMutations = false;
  }
}
function flushRootMutations(editor) {
  const observer = editor._observer;
  if (observer !== null) {
    const mutations = observer.takeRecords();
    flushMutations(editor, mutations, observer);
  }
}
function initMutationObserver(editor) {
  initTextEntryListener(editor);
  editor._observer = new MutationObserver((mutations, observer) => {
    flushMutations(editor, mutations, observer);
  });
}
var NODE_STATE_DIRECT = "direct";
var NODE_STATE_LATEST = "latest";
var StateConfig = class {
  /** The string key used when serializing this state to JSON */
  key;
  /** The parse function from the StateValueConfig passed to createState */
  parse;
  /**
   * The unparse function from the StateValueConfig passed to createState,
   * with a default that is simply a pass-through that assumes the value is
   * JSON serializable.
   */
  unparse;
  /**
   * An equality function from the StateValueConfig, with a default of
   * Object.is.
   */
  isEqual;
  /**
   * The result of `stateValueConfig.parse(undefined)`, which is computed only
   * once and used as the default value. When the current value `isEqual` to
   * the `defaultValue`, it will not be serialized to JSON.
   */
  defaultValue;
  resetOnCopyNode;
  constructor(key, stateValueConfig) {
    this.key = key;
    this.parse = stateValueConfig.parse.bind(stateValueConfig);
    this.unparse = (stateValueConfig.unparse || coerceToJSON).bind(stateValueConfig);
    this.isEqual = (stateValueConfig.isEqual || Object.is).bind(stateValueConfig);
    this.defaultValue = this.parse(void 0);
    this.resetOnCopyNode = stateValueConfig.resetOnCopyNode || false;
  }
};
// @__NO_SIDE_EFFECTS__
function createState(key, valueConfig) {
  return new StateConfig(key, valueConfig);
}
function $getState(node, stateConfig, version = NODE_STATE_LATEST) {
  const latestOrDirectNode = version === NODE_STATE_LATEST ? node.getLatest() : node;
  const state = latestOrDirectNode.__state;
  if (state) {
    $checkCollision(node, stateConfig, state);
    return state.getValue(stateConfig);
  }
  return stateConfig.defaultValue;
}
function $getStateChange(node, prevNode, stateConfig) {
  const value = $getState(node, stateConfig, NODE_STATE_DIRECT);
  const prevValue = $getState(prevNode, stateConfig, NODE_STATE_DIRECT);
  return stateConfig.isEqual(value, prevValue) ? null : [value, prevValue];
}
function $setState(node, stateConfig, valueOrUpdater) {
  errorOnReadOnly();
  let value;
  if (typeof valueOrUpdater === "function") {
    const latest = node.getLatest();
    const prevValue = $getState(latest, stateConfig);
    value = valueOrUpdater(prevValue);
    if (stateConfig.isEqual(prevValue, value)) {
      return latest;
    }
  } else {
    value = valueOrUpdater;
  }
  const writable = node.getWritable();
  const state = $getWritableNodeState(writable);
  $checkCollision(node, stateConfig, state);
  state.updateFromKnown(stateConfig, value);
  return writable;
}
function $checkCollision(node, stateConfig, state) {
  {
    const collision = state.sharedNodeState.sharedConfigMap.get(stateConfig.key);
    if (collision !== void 0 && collision !== stateConfig) {
      {
        formatDevErrorMessage(`$setState: State key collision ${JSON.stringify(stateConfig.key)} detected in ${node.constructor.name} node with type ${node.getType()} and key ${node.getKey()}. Only one StateConfig with a given key should be used on a node.`);
      }
    }
  }
}
function createSharedNodeState(nodeConfig) {
  const sharedConfigMap = /* @__PURE__ */ new Map();
  const flatKeys = /* @__PURE__ */ new Set();
  for (const {
    ownNodeConfig
  } of iterStaticNodeConfigChain(typeof nodeConfig === "function" ? nodeConfig : nodeConfig.replace)) {
    if (ownNodeConfig && ownNodeConfig.stateConfigs) {
      for (const requiredStateConfig of ownNodeConfig.stateConfigs) {
        let stateConfig;
        if ("stateConfig" in requiredStateConfig) {
          stateConfig = requiredStateConfig.stateConfig;
          if (requiredStateConfig.flat) {
            flatKeys.add(stateConfig.key);
          }
        } else {
          stateConfig = requiredStateConfig;
        }
        sharedConfigMap.set(stateConfig.key, stateConfig);
      }
    }
  }
  return {
    flatKeys,
    sharedConfigMap
  };
}
var UNSAFE_STATE_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
var NodeState = class _NodeState {
  /**
   * @internal
   *
   * Track the (versioned) node that this NodeState was created for, to
   * facilitate copy-on-write for NodeState. When a LexicalNode is cloned,
   * it will *reference* the NodeState from its prevNode. From the nextNode
   * you can continue to read state without copying, but the first $setState
   * will trigger a copy of the prevNode's NodeState with the node property
   * updated.
   */
  node;
  /**
   * @internal
   *
   * State that has already been parsed in a get state, so it is safe. (can be returned with
   * just a cast since the proof was given before).
   *
   * Note that it uses StateConfig, so in addition to (1) the CURRENT VALUE, it has access to
   * (2) the State key (3) the DEFAULT VALUE and (4) the PARSE FUNCTION
   */
  knownState;
  /**
   * @internal
   *
   * A copy of serializedNode[NODE_STATE_KEY] that is made when JSON is
   * imported but has not been parsed yet.
   *
   * It stays here until a get state requires us to parse it, and since we
   * then know the value is safe we move it to knownState.
   *
   * Note that since only string keys are used here, we can only allow this
   * state to pass-through on export or on the next version since there is
   * no known value configuration. This pass-through is to support scenarios
   * where multiple versions of the editor code are working in parallel so
   * an old version of your code doesnt erase metadata that was
   * set by a newer version of your code.
   */
  unknownState;
  /**
   * @internal
   *
   * This sharedNodeState is preserved across all instances of a given
   * node type in an editor and remains writable. It is how keys are resolved
   * to configuration.
   */
  sharedNodeState;
  /**
   * @internal
   *
   * The count of known or unknown keys in this state, ignoring the
   * intersection between the two sets.
   */
  size;
  /**
   * @internal
   */
  constructor(node, sharedNodeState, unknownState = void 0, knownState = /* @__PURE__ */ new Map(), size = void 0) {
    this.node = node;
    this.sharedNodeState = sharedNodeState;
    this.unknownState = unknownState;
    this.knownState = knownState;
    const {
      sharedConfigMap
    } = this.sharedNodeState;
    const computedSize = size !== void 0 ? size : computeSize(sharedConfigMap, unknownState, knownState);
    {
      if (!(size === void 0 || computedSize === size)) {
        formatDevErrorMessage(`NodeState: size != computedSize (${String(size)} != ${String(computedSize)})`);
      }
      for (const stateConfig of knownState.keys()) {
        if (!sharedConfigMap.has(stateConfig.key)) {
          formatDevErrorMessage(`NodeState: sharedConfigMap missing knownState key ${stateConfig.key}`);
        }
      }
    }
    this.size = computedSize;
  }
  /**
   * @internal
   *
   * Get the value from knownState, or parse it from unknownState
   * if it contains the given key.
   *
   * Updates the sharedConfigMap when no known state is found.
   * Updates unknownState and knownState when an unknownState is parsed.
   */
  getValue(stateConfig) {
    const known = this.knownState.get(stateConfig);
    if (known !== void 0) {
      return known;
    }
    this.sharedNodeState.sharedConfigMap.set(stateConfig.key, stateConfig);
    let parsed = stateConfig.defaultValue;
    if (this.unknownState && stateConfig.key in this.unknownState) {
      const jsonValue = this.unknownState[stateConfig.key];
      if (jsonValue !== void 0) {
        parsed = stateConfig.parse(jsonValue);
      }
      this.updateFromKnown(stateConfig, parsed);
    }
    return parsed;
  }
  /**
   * @internal
   *
   * Used only for advanced use cases, such as collab. The intent here is to
   * allow you to diff states with a more stable interface than the properties
   * of this class.
   */
  getInternalState() {
    return [this.unknownState, this.knownState];
  }
  /**
   * Encode this NodeState to JSON in the format that its node expects.
   * This returns `{[NODE_STATE_KEY]?: UnknownStateRecord}` rather than
   * `UnknownStateRecord | undefined` so that we can support flattening
   * specific entries in the future when nodes can declare what
   * their required StateConfigs are.
   */
  toJSON() {
    const state = {
      ...this.unknownState
    };
    const flatState = {};
    for (const [stateConfig, v2] of this.knownState) {
      if (stateConfig.isEqual(v2, stateConfig.defaultValue)) {
        delete state[stateConfig.key];
      } else {
        state[stateConfig.key] = stateConfig.unparse(v2);
      }
    }
    for (const key of this.sharedNodeState.flatKeys) {
      if (key in state) {
        flatState[key] = state[key];
        delete state[key];
      }
    }
    if (undefinedIfEmpty(state)) {
      flatState[NODE_STATE_KEY] = state;
    }
    return flatState;
  }
  /**
   * @internal
   *
   * A NodeState is writable when the node to update matches
   * the node associated with the NodeState. This basically
   * mirrors how the EditorState NodeMap works, but in a
   * bottom-up organization rather than a top-down organization.
   *
   * This allows us to implement the same "copy on write"
   * pattern for state, without having the state version
   * update every time the node version changes (e.g. when
   * its parent or siblings change).
   *
   * @param node The node to associate with the state
   * @returns The next writable state
   */
  getWritable(node) {
    if (this.node === node) {
      return this;
    }
    const {
      sharedNodeState,
      unknownState
    } = this;
    const nextKnownState = new Map(this.knownState);
    return new _NodeState(node, sharedNodeState, parseAndPruneNextUnknownState(sharedNodeState.sharedConfigMap, nextKnownState, unknownState), nextKnownState, this.size);
  }
  /** @internal */
  resetOnCopyNode() {
    for (const stateConfig of this.knownState.keys()) {
      if (stateConfig.resetOnCopyNode) {
        this.knownState.set(stateConfig, stateConfig.defaultValue);
      }
    }
    return this;
  }
  /** @internal */
  updateFromKnown(stateConfig, value) {
    const key = stateConfig.key;
    this.sharedNodeState.sharedConfigMap.set(key, stateConfig);
    const {
      knownState,
      unknownState
    } = this;
    if (!(knownState.has(stateConfig) || unknownState && key in unknownState)) {
      if (unknownState) {
        delete unknownState[key];
        this.unknownState = undefinedIfEmpty(unknownState);
      }
      this.size++;
    }
    knownState.set(stateConfig, value);
  }
  /**
   * @internal
   *
   * This is intended for advanced use cases only, such
   * as collab or dev tools.
   *
   * Update a single key value pair from unknown state,
   * parsing it if the key is known to this node. This is
   * basically like updateFromJSON, but the effect is
   * isolated to a single entry.
   *
   * @param k The string key from an UnknownStateRecord
   * @param v The unknown value from an UnknownStateRecord
   */
  updateFromUnknown(k, v2) {
    if (UNSAFE_STATE_KEYS.has(k)) {
      return;
    }
    const stateConfig = this.sharedNodeState.sharedConfigMap.get(k);
    if (stateConfig) {
      this.updateFromKnown(stateConfig, stateConfig.parse(v2));
    } else {
      this.unknownState = this.unknownState || {};
      if (!(k in this.unknownState)) {
        this.size++;
      }
      this.unknownState[k] = v2;
    }
  }
  /**
   * @internal
   *
   * Reset all existing state to default or empty values,
   * and perform any updates from the given unknownState.
   *
   * This is used when initializing a node's state from JSON,
   * or when resetting a node's state from JSON.
   *
   * @param unknownState The new state in serialized form
   */
  updateFromJSON(unknownState) {
    const {
      knownState
    } = this;
    for (const stateConfig of knownState.keys()) {
      knownState.set(stateConfig, stateConfig.defaultValue);
    }
    this.size = knownState.size;
    this.unknownState = void 0;
    if (unknownState) {
      for (const [k, v2] of Object.entries(unknownState)) {
        this.updateFromUnknown(k, v2);
      }
    }
  }
};
function $getWritableNodeState(node) {
  const writable = node.getWritable();
  const state = writable.__state ? writable.__state.getWritable(writable) : new NodeState(writable, $getSharedNodeState(writable));
  writable.__state = state;
  return state;
}
function $getSharedNodeState(node) {
  return node.__state ? node.__state.sharedNodeState : getRegisteredNodeOrThrow($getEditor(), node.getType()).sharedNodeState;
}
function $updateStateFromJSON(node, serialized) {
  const writable = node.getWritable();
  const unknownState = serialized[NODE_STATE_KEY];
  let parseState = unknownState;
  for (const k of $getSharedNodeState(writable).flatKeys) {
    if (k in serialized) {
      if (parseState === void 0 || parseState === unknownState) {
        parseState = {
          ...unknownState
        };
      }
      parseState[k] = serialized[k];
    }
  }
  if (writable.__state || parseState) {
    $getWritableNodeState(node).updateFromJSON(parseState);
  }
  return writable;
}
function nodeStatesAreEquivalent(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  const keys = /* @__PURE__ */ new Set();
  return !(a2 && hasUnequalMapEntry(keys, a2, b2) || b2 && hasUnequalMapEntry(keys, b2, a2) || a2 && hasUnequalRecordEntry(keys, a2, b2) || b2 && hasUnequalRecordEntry(keys, b2, a2));
}
function computeSize(sharedConfigMap, unknownState, knownState) {
  let size = knownState.size;
  if (unknownState) {
    for (const k in unknownState) {
      const sharedConfig = sharedConfigMap.get(k);
      if (!sharedConfig || !knownState.has(sharedConfig)) {
        size++;
      }
    }
  }
  return size;
}
function undefinedIfEmpty(obj) {
  if (obj) {
    for (const key in obj) {
      return obj;
    }
  }
  return void 0;
}
function coerceToJSON(v2) {
  return v2;
}
function parseAndPruneNextUnknownState(sharedConfigMap, nextKnownState, unknownState) {
  let nextUnknownState = void 0;
  if (unknownState) {
    for (const [k, v2] of Object.entries(unknownState)) {
      if (UNSAFE_STATE_KEYS.has(k)) {
        continue;
      }
      const stateConfig = sharedConfigMap.get(k);
      if (stateConfig) {
        if (!nextKnownState.has(stateConfig)) {
          nextKnownState.set(stateConfig, stateConfig.parse(v2));
        }
      } else {
        nextUnknownState = nextUnknownState || {};
        nextUnknownState[k] = v2;
      }
    }
  }
  return nextUnknownState;
}
function hasUnequalMapEntry(keys, sourceState, otherState) {
  for (const [stateConfig, value] of sourceState.knownState) {
    if (keys.has(stateConfig.key)) {
      continue;
    }
    keys.add(stateConfig.key);
    const otherValue = otherState ? otherState.getValue(stateConfig) : stateConfig.defaultValue;
    if (otherValue !== value && !stateConfig.isEqual(otherValue, value)) {
      return true;
    }
  }
  return false;
}
function hasUnequalRecordEntry(keys, sourceState, otherState) {
  const {
    unknownState
  } = sourceState;
  const otherUnknownState = otherState ? otherState.unknownState : void 0;
  if (unknownState) {
    for (const [key, value] of Object.entries(unknownState)) {
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      const otherValue = otherUnknownState ? otherUnknownState[key] : void 0;
      if (value !== otherValue) {
        return true;
      }
    }
  }
  return false;
}
function $cloneNodeState(from, to) {
  const state = from.__state;
  return state && state.node === from ? state.getWritable(to) : state;
}
function $canSimpleTextNodesBeMerged(node1, node2) {
  const node1Mode = node1.__mode;
  const node1Format = node1.__format;
  const node1Style = node1.__style;
  const node2Mode = node2.__mode;
  const node2Format = node2.__format;
  const node2Style = node2.__style;
  const node1State = node1.__state;
  const node2State = node2.__state;
  return (node1Mode === null || node1Mode === node2Mode) && (node1Format === null || node1Format === node2Format) && (node1Style === null || node1Style === node2Style) && (node1.__state === null || node1State === node2State || nodeStatesAreEquivalent(node1State, node2State));
}
function $mergeTextNodes(node1, node2) {
  const writableNode1 = node1.mergeWithSibling(node2);
  const normalizedNodes = getActiveEditor()._normalizedNodes;
  normalizedNodes.add(node1.__key);
  normalizedNodes.add(node2.__key);
  return writableNode1;
}
function $normalizeTextNode(textNode) {
  let node = textNode;
  if (node.__text === "" && node.isSimpleText() && !node.isUnmergeable()) {
    node.remove();
    return;
  }
  let previousNode;
  while ((previousNode = node.getPreviousSibling()) !== null && $isTextNode(previousNode) && previousNode.isSimpleText() && !previousNode.isUnmergeable()) {
    if (previousNode.__text === "") {
      previousNode.remove();
    } else if ($canSimpleTextNodesBeMerged(previousNode, node)) {
      node = $mergeTextNodes(previousNode, node);
      break;
    } else {
      break;
    }
  }
  let nextNode;
  while ((nextNode = node.getNextSibling()) !== null && $isTextNode(nextNode) && nextNode.isSimpleText() && !nextNode.isUnmergeable()) {
    if (nextNode.__text === "") {
      nextNode.remove();
    } else if ($canSimpleTextNodesBeMerged(node, nextNode)) {
      node = $mergeTextNodes(node, nextNode);
      break;
    } else {
      break;
    }
  }
}
function $normalizeSelection(selection) {
  $normalizePoint(selection.anchor);
  $normalizePoint(selection.focus);
  return selection;
}
function $normalizePoint(point) {
  while (point.type === "element") {
    const node = point.getNode();
    const offset = point.offset;
    let nextNode;
    let nextOffsetAtEnd;
    if (offset === node.getChildrenSize()) {
      nextNode = node.getChildAtIndex(offset - 1);
      nextOffsetAtEnd = true;
    } else {
      nextNode = node.getChildAtIndex(offset);
      nextOffsetAtEnd = false;
    }
    if ($isTextNode(nextNode)) {
      point.set(nextNode.__key, nextOffsetAtEnd ? nextNode.getTextContentSize() : 0, "text", true);
      break;
    } else if (!$isElementNode(nextNode)) {
      break;
    }
    point.set(nextNode.__key, nextOffsetAtEnd ? nextNode.getChildrenSize() : 0, "element", true);
  }
}
var CACHED_TEXT_SIZE_KEY = /* @__PURE__ */ Symbol.for("@lexical/CachedTextSize");
function $prevSuffixTextSize(startKey, count) {
  return activePrevEditorState.read(() => {
    let size = 0;
    let cur = startKey;
    for (let i2 = 0; i2 < count && cur !== null; i2++) {
      const prevNode = activePrevNodeMap.get(cur);
      if (!(prevNode !== void 0)) {
        formatDevErrorMessage(`prevSuffixTextSize: missing prev node for key ${cur}`);
      }
      if ($isElementNode(prevNode)) {
        const nextNode = activeNextNodeMap.get(cur);
        if (nextNode !== void 0 && $isElementNode(nextNode) && nextNode.__parent !== prevNode.__parent) {
          size += prevNode.getTextContentSize();
        } else {
          const keyedDom = activePrevKeyToDOMMap.get(cur);
          const cached = keyedDom && keyedDom.__lexicalTextContent;
          if (!(typeof cached === "string")) {
            formatDevErrorMessage(`prevSuffixTextSize: missing __lexicalTextContent for ElementNode of type ${prevNode.getType()}`);
          }
          size += cached.length;
        }
        if (i2 < count - 1 && !prevNode.isInline()) {
          size += DOUBLE_LINE_BREAK.length;
        }
      } else {
        const cached = prevNode[CACHED_TEXT_SIZE_KEY];
        if (!(cached !== void 0)) {
          formatDevErrorMessage(`prevSuffixTextSize: missing cached size for leaf ${prevNode.getType()} key ${cur}`);
        }
        size += cached;
      }
      cur = prevNode.__next;
    }
    return size;
  }, {
    editor: activeEditor$1
  });
}
function $setCachedTextSize(node) {
  if ($isElementNode(node)) {
    return;
  }
  if (node[CACHED_TEXT_SIZE_KEY] !== void 0) {
    return;
  }
  node[CACHED_TEXT_SIZE_KEY] = $isTextNode(node) ? node.__text.length : node.getTextContentSize();
}
var MIN_FAST_PATH_CHILDREN = 4;
var subTreeTextContent = "";
var subTreeTextFormat = null;
var subTreeTextStyle = null;
var subTreeFirstTextKey = null;
function $beginCaptureGuard() {
  return {
    firstTextKey: subTreeFirstTextKey,
    format: subTreeTextFormat,
    style: subTreeTextStyle
  };
}
function $endCaptureGuard(saved) {
  if (saved.firstTextKey !== null) {
    subTreeTextFormat = saved.format;
    subTreeTextStyle = saved.style;
    subTreeFirstTextKey = saved.firstTextKey;
  }
}
function $bubbleChildFirstText(childKeyedDom) {
  if (subTreeFirstTextKey !== null) {
    return;
  }
  const childFirstKey = childKeyedDom.__lexicalFirstTextKey;
  if (!(childFirstKey !== void 0)) {
    formatDevErrorMessage(`$bubbleChildFirstText: missing __lexicalFirstTextKey on element keyed DOM`);
  }
  if (childFirstKey === null) {
    return;
  }
  const textNode = activeNextNodeMap.get(childFirstKey);
  if ($isTextNode(textNode)) {
    subTreeTextFormat = textNode.getFormat();
    subTreeTextStyle = textNode.getStyle();
    subTreeFirstTextKey = childFirstKey;
  }
}
var activeEditorConfig;
var activeEditor$1;
var activeEditorNodes;
var treatAllNodesAsDirty = false;
var activeEditorStateReadOnly = false;
var activeMutationListeners;
var activeDirtyElements;
var activeDirtyLeaves;
var activePrevNodeMap;
var activePrevEditorState;
var activeNextNodeMap;
var activePrevKeyToDOMMap;
var activeDirtyChildrenByParent;
var mutatedNodes;
var activeEditorDOMRenderConfig;
function $destroyNode(key, parentDOM) {
  const node = activePrevNodeMap.get(key);
  const isMoved = activeNextNodeMap.has(key);
  if (parentDOM !== null) {
    const dom = getPrevElementByKeyOrThrow(key);
    if (dom.parentNode === parentDOM) {
      parentDOM.removeChild(dom);
    }
  }
  if (isMoved) {
    return;
  }
  activeEditor$1._keyToDOMMap.delete(key);
  if ($isElementNode(node)) {
    const children = $createChildrenArray(node, activePrevNodeMap);
    $destroyChildren(children, 0, children.length - 1, null);
  }
  if (node !== void 0) {
    for (const slotKey of $readSlots(node).values()) {
      const container = $slotContainerForKey(slotKey);
      $destroyNode(slotKey, null);
      if (container !== null) {
        container.remove();
      }
    }
    setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, node, "destroyed");
  }
}
function $destroyChildren(children, _startIndex, endIndex, dom) {
  for (let startIndex = _startIndex; startIndex <= endIndex; ++startIndex) {
    const child = children[startIndex];
    if (child !== void 0) {
      $destroyNode(child, dom);
    }
  }
}
function setTextAlign(domStyle, value) {
  domStyle.setProperty("text-align", value);
}
var DEFAULT_INDENT_VALUE = "40px";
function setElementIndent(dom, indent) {
  const indentClassName = activeEditorConfig.theme.indent;
  if (typeof indentClassName === "string") {
    const elementHasClassName = dom.classList.contains(indentClassName);
    if (indent > 0 && !elementHasClassName) {
      dom.classList.add(indentClassName);
    } else if (indent < 1 && elementHasClassName) {
      dom.classList.remove(indentClassName);
    }
  }
  dom.style.setProperty("padding-inline-start", indent === 0 ? "" : `calc(${indent} * var(--lexical-indent-base-value, ${DEFAULT_INDENT_VALUE}))`);
  removeEmptyDOMAttribute(dom, "class");
  removeEmptyDOMAttribute(dom, "style");
}
function setElementFormat(dom, format) {
  const domStyle = dom.style;
  if (format === 0) {
    setTextAlign(domStyle, "");
  } else if (format === IS_ALIGN_LEFT) {
    setTextAlign(domStyle, "left");
  } else if (format === IS_ALIGN_CENTER) {
    setTextAlign(domStyle, "center");
  } else if (format === IS_ALIGN_RIGHT) {
    setTextAlign(domStyle, "right");
  } else if (format === IS_ALIGN_JUSTIFY) {
    setTextAlign(domStyle, "justify");
  } else if (format === IS_ALIGN_START) {
    setTextAlign(domStyle, "start");
  } else if (format === IS_ALIGN_END) {
    setTextAlign(domStyle, "end");
  }
  removeEmptyDOMAttribute(dom, "style");
}
function $getReconciledDirection(node) {
  const direction = node.__dir;
  if (direction !== null) {
    return direction;
  }
  if ($isRootNode(node)) {
    return null;
  }
  const parent = node.getParent();
  if (parent === null) {
    return "auto";
  }
  if (!$isRootOrShadowRoot(parent) || parent.__dir !== null) {
    return null;
  }
  return "auto";
}
function $setElementDirection(dom, node) {
  const direction = $getReconciledDirection(node);
  if (direction !== null) {
    dom.dir = direction;
  } else {
    dom.removeAttribute("dir");
  }
}
function $createSlotDOM(name) {
  const container = $getDocument().createElement("div");
  container.setAttribute("data-lexical-slot", name);
  container.style.display = "none";
  return container;
}
function $applySlotEditable(hostDom, decoratorHost, container) {
  if (decoratorHost || hostDom.contentEditable === "false") {
    $markSlotEditable(container, activeEditor$1);
  } else {
    container.removeAttribute("contenteditable");
  }
}
function $mountSlotChildren(node, hostDom, slots) {
  const previousSubTreeTextContent = subTreeTextContent;
  const outerSaved = $beginCaptureGuard();
  subTreeTextContent = "";
  let totalText = "";
  const decoratorHost = $isDecoratorNode(node);
  for (const [name, slotKey] of slots) {
    const container = $createSlotDOM(name);
    $applySlotEditable(hostDom, decoratorHost, container);
    hostDom.appendChild(container);
    subTreeTextContent = "";
    const saved = $beginCaptureGuard();
    $createNode(slotKey, $getDOMSlot(node, container, activeEditor$1));
    $endCaptureGuard(saved);
    $applySlotTarget(node, name, hostDom, container);
    totalText += subTreeTextContent;
  }
  $endCaptureGuard(outerSaved);
  subTreeTextContent = previousSubTreeTextContent;
  return totalText;
}
function $readSlots(node) {
  return $isSlotHost(node) && node.__slots !== null ? node.__slots : EMPTY_SLOTS;
}
function $applySlotTarget(node, name, hostDom, container) {
  const target = activeEditorDOMRenderConfig.$getSlotTargetElement(node, name, hostDom, activeEditor$1);
  if (target !== null) {
    if (container.parentElement !== target) {
      target.appendChild(container);
    }
    container.style.display = "";
  }
}
function $slotContainerForKey(slotKey) {
  const slotDom = activePrevKeyToDOMMap.get(slotKey);
  return slotDom !== void 0 ? slotDom.parentElement : null;
}
function $reconcileSlotChildren(prevNode, nextNode, hostDom) {
  const prevSlots = $readSlots(prevNode);
  const nextSlots = $readSlots(nextNode);
  for (const [name, prevSlotKey] of prevSlots) {
    if (!nextSlots.has(name)) {
      const staleContainer = $slotContainerForKey(prevSlotKey);
      $destroyNode(prevSlotKey, null);
      if (staleContainer !== null) {
        staleContainer.remove();
      }
    }
  }
  const previousSubTreeTextContent = subTreeTextContent;
  const outerSaved = $beginCaptureGuard();
  let totalText = "";
  let prevContainer = null;
  const decoratorHost = $isDecoratorNode(nextNode);
  for (const [name, nextSlotKey] of nextSlots) {
    const prevSlotKey = prevSlots.get(name);
    let container = prevSlotKey !== void 0 ? $slotContainerForKey(prevSlotKey) : null;
    subTreeTextContent = "";
    const saved = $beginCaptureGuard();
    if (container === null) {
      container = $createSlotDOM(name);
      let firstNonSlot = null;
      for (const child of hostDom.children) {
        if (!child.hasAttribute("data-lexical-slot")) {
          firstNonSlot = child;
          break;
        }
      }
      hostDom.insertBefore(container, firstNonSlot);
      $createNode(nextSlotKey, $getDOMSlot(nextNode, container, activeEditor$1));
    } else if (prevSlotKey === nextSlotKey) {
      $reconcileNode(nextSlotKey, container);
    } else {
      if (prevSlotKey !== void 0) {
        $destroyNode(prevSlotKey, container);
      }
      $createNode(nextSlotKey, $getDOMSlot(nextNode, container, activeEditor$1));
    }
    $endCaptureGuard(saved);
    $applySlotEditable(hostDom, decoratorHost, container);
    $applySlotTarget(nextNode, name, hostDom, container);
    totalText += subTreeTextContent;
    if (container.parentElement === hostDom) {
      const anchor = prevContainer === null ? hostDom.firstChild : prevContainer.nextSibling;
      if (anchor !== container) {
        hostDom.insertBefore(container, anchor);
      }
      prevContainer = container;
    }
  }
  $endCaptureGuard(outerSaved);
  subTreeTextContent = previousSubTreeTextContent;
  return totalText;
}
function $createNode(key, slot) {
  const node = activeNextNodeMap.get(key);
  if (node === void 0) {
    {
      formatDevErrorMessage(`createNode: node does not exist in nodeMap`);
    }
  }
  if (slot !== null) {
    const prevNode = activePrevNodeMap.get(key);
    if (prevNode !== void 0) {
      const existingDOM = activePrevKeyToDOMMap.get(key);
      if (existingDOM !== void 0) {
        const prevSlotHost = $isSlotChild(prevNode) ? prevNode.__slotHost : null;
        const nextSlotHost = $isSlotChild(node) ? node.__slotHost : null;
        const modelMoved = prevNode.__parent !== node.__parent || prevSlotHost !== nextSlotHost;
        const slotChildDomDetached = nextSlotHost !== null && existingDOM.parentElement !== slot.element;
        if (modelMoved || slotChildDomDetached) {
          slot.insertChild(existingDOM);
          return $reconcileNode(key, slot.element);
        }
      }
    }
  }
  const dom = activeEditorDOMRenderConfig.$createDOM(node, activeEditor$1);
  storeDOMWithKey(key, dom, activeEditor$1);
  if ($isTextNode(node)) {
    dom.setAttribute("data-lexical-text", "true");
  } else if ($isDecoratorNode(node)) {
    dom.setAttribute("data-lexical-decorator", "true");
    setDOMUnmanaged(dom, {
      captureSelection: true
    });
  }
  if ($isElementNode(node)) {
    const indent = node.__indent;
    const childrenSize = node.__size;
    $setElementDirection(dom, node);
    if (indent !== 0) {
      setElementIndent(dom, indent);
    }
    const slots = $readSlots(node);
    const slotTextContent = slots.size > 0 ? $mountSlotChildren(node, dom, slots) : "";
    if (childrenSize === 0) {
      dom.__lexicalTextContent = slotTextContent;
      dom.__lexicalFirstTextKey = null;
      subTreeTextContent += slotTextContent;
      if (slots.size > 0) {
        dom.__lexicalSlotTextLength = slotTextContent.length;
      }
    } else {
      const outerBefore = subTreeTextContent;
      const endIndex = childrenSize - 1;
      const children = $createChildrenArray(node, activeNextNodeMap);
      $createChildren(children, node, 0, endIndex, $getDOMSlot(node, dom, activeEditor$1));
      if (slotTextContent !== "") {
        const childText = dom.__lexicalTextContent || "";
        dom.__lexicalTextContent = slotTextContent + childText;
        subTreeTextContent = outerBefore + slotTextContent + childText;
      }
      if (slots.size > 0) {
        dom.__lexicalSlotTextLength = slotTextContent.length;
      }
    }
    const format = node.__format;
    if (format !== 0) {
      setElementFormat(dom, format);
    }
    if (!node.isInline()) {
      $reconcileElementTerminatingLineBreak(null, node, dom);
      $reconcileDecoratorBoundaryAnchors(node, dom);
    }
  } else {
    const text = node.getTextContent();
    if ($isDecoratorNode(node)) {
      const decorator = node.decorate(activeEditor$1, activeEditorConfig);
      if (decorator !== null) {
        reconcileDecorator(key, decorator);
      }
      dom.contentEditable = "false";
      const slots = $readSlots(node);
      if (slots.size > 0) {
        $mountSlotChildren(node, dom, slots);
      }
    }
    subTreeTextContent += text;
  }
  if (slot !== null) {
    slot.insertChild(dom);
  }
  activeEditorDOMRenderConfig.$decorateDOM(node, null, dom, activeEditor$1);
  $setCachedTextSize(node);
  {
    Object.freeze(node);
  }
  setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, node, "created");
  return dom;
}
function $createChildren(children, element, _startIndex, endIndex, slot) {
  const previousSubTreeTextContent = subTreeTextContent;
  const outerSaved = $beginCaptureGuard();
  subTreeTextContent = "";
  subTreeTextFormat = null;
  subTreeTextStyle = null;
  subTreeFirstTextKey = null;
  let startIndex = _startIndex;
  for (; startIndex <= endIndex; ++startIndex) {
    const saved = $beginCaptureGuard();
    $createNode(children[startIndex], slot);
    const node = activeNextNodeMap.get(children[startIndex]);
    if (node !== null && $isTextNode(node)) {
      if (subTreeTextFormat === null) {
        subTreeTextFormat = node.getFormat();
        subTreeTextStyle = node.getStyle();
        subTreeFirstTextKey = node.__key;
      }
    } else if (
      // inline $textContentRequiresDoubleLinebreakAtEnd
      $isElementNode(node) && startIndex < endIndex && !node.isInline()
    ) {
      subTreeTextContent += DOUBLE_LINE_BREAK;
    }
    $endCaptureGuard(saved);
  }
  const cacheDom = activeEditor$1._keyToDOMMap.get(element.__key);
  if (!(cacheDom !== void 0)) {
    formatDevErrorMessage(`$createChildren: Element with key ${element.__key} missing from keyToDOMMap`);
  }
  cacheDom.__lexicalTextContent = subTreeTextContent;
  cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
  subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
  $endCaptureGuard(outerSaved);
}
function $isLastChildLineBreakOrDecorator(element, nodeMap) {
  if (element) {
    const lastKey = element.__last;
    if (lastKey) {
      const node = nodeMap.get(lastKey);
      if (node) {
        return $isLineBreakNode(node) ? "line-break" : $isDecoratorNode(node) && node.isInline() ? "decorator" : null;
      }
    }
    return "empty";
  }
  return null;
}
function $isBlockDecoratorChild(key, nodeMap) {
  if (!key) {
    return false;
  }
  const node = nodeMap.get(key);
  return $isDecoratorNode(node) && !node.isInline();
}
function $reconcileDecoratorBoundaryAnchors(nextElement, dom) {
  const slot = $getDOMSlot(nextElement, dom, activeEditor$1);
  slot.setDecoratorBoundaryAnchor("leading", $isBlockDecoratorChild(nextElement.__first, activeNextNodeMap));
  slot.setDecoratorBoundaryAnchor("trailing", $isBlockDecoratorChild(nextElement.__last, activeNextNodeMap));
}
function $reconcileElementTerminatingLineBreak(prevElement, nextElement, dom) {
  const slot = $getDOMSlot(nextElement, dom, activeEditor$1);
  const nextLineBreak = $isLastChildLineBreakOrDecorator(nextElement, activeNextNodeMap);
  slot.setManagedLineBreak(nextLineBreak);
}
function reconcileTextFormat(element) {
  if (subTreeTextFormat != null && subTreeTextFormat !== element.__textFormat && !activeEditorStateReadOnly) {
    element.setTextFormat(subTreeTextFormat);
  }
}
function reconcileTextStyle(element) {
  if (subTreeTextStyle != null && subTreeTextStyle !== element.__textStyle && !activeEditorStateReadOnly) {
    element.setTextStyle(subTreeTextStyle);
  }
}
function $reconcileChildrenWithDirection(prevElement, nextElement, dom) {
  subTreeTextFormat = null;
  subTreeTextStyle = null;
  subTreeFirstTextKey = null;
  $reconcileChildren(prevElement, nextElement, $getDOMSlot(nextElement, dom, activeEditor$1));
  if (!$isRootOrShadowRoot(nextElement)) {
    reconcileTextFormat(nextElement);
    reconcileTextStyle(nextElement);
  }
}
function $buildDirtyChildrenByParent() {
  const map = /* @__PURE__ */ new Map();
  const addKeysToMap = (keys) => {
    for (const key of keys) {
      const node = activeNextNodeMap.get(key);
      if (node === void 0) {
        continue;
      }
      const parentKey = node.__parent;
      if (parentKey === null) {
        continue;
      }
      let set = map.get(parentKey);
      if (set === void 0) {
        set = /* @__PURE__ */ new Set();
        map.set(parentKey, set);
      }
      set.add(key);
    }
  };
  addKeysToMap(activeDirtyElements.keys());
  addKeysToMap(activeDirtyLeaves);
  return map;
}
function $suffixStartIfContiguous(parent, dirty) {
  const k = dirty.size;
  if (k === 0 || k >= parent.__size) {
    return null;
  }
  let cur = parent.__last;
  let suffixStart = null;
  let i2 = 0;
  while (cur !== null && i2 < k) {
    if (!dirty.has(cur)) {
      return null;
    }
    suffixStart = cur;
    const node = activeNextNodeMap.get(cur);
    if (node === void 0) {
      return null;
    }
    cur = node.__prev;
    i2++;
  }
  if (i2 !== k) {
    return null;
  }
  if (cur !== null && dirty.has(cur)) {
    return null;
  }
  return suffixStart;
}
function $tryReconcileSuffixWithSizeDelta(prevElement, nextElement, slot, cacheDom, cachedParentText, suffixStartKey, k, sizeDelta) {
  if (sizeDelta !== 1 && sizeDelta !== -1) {
    return false;
  }
  const expectedK = sizeDelta === 1 ? 2 : 1;
  if (k !== expectedK) {
    return false;
  }
  const kPrime = k - sizeDelta;
  let prevSuffixStartKey = prevElement.__last;
  for (let i2 = 0; i2 < kPrime - 1; i2++) {
    if (prevSuffixStartKey === null) {
      return false;
    }
    const node = activePrevNodeMap.get(prevSuffixStartKey);
    if (node === void 0) {
      return false;
    }
    prevSuffixStartKey = node.__prev;
  }
  if (prevSuffixStartKey === null) {
    return false;
  }
  const nextStartNode = activeNextNodeMap.get(suffixStartKey);
  const prevStartNode = activePrevNodeMap.get(prevSuffixStartKey);
  if (nextStartNode === void 0 || prevStartNode === void 0) {
    return false;
  }
  if (nextStartNode.__prev !== prevStartNode.__prev) {
    return false;
  }
  const nextSuffixKeys = [];
  let cur = suffixStartKey;
  for (let i2 = 0; i2 < k; i2++) {
    if (cur === null) {
      return false;
    }
    nextSuffixKeys.push(cur);
    const node = activeNextNodeMap.get(cur);
    cur = node ? node.__next : null;
  }
  const prevSuffixKeys = [];
  cur = prevSuffixStartKey;
  for (let i2 = 0; i2 < kPrime; i2++) {
    if (cur === null) {
      return false;
    }
    prevSuffixKeys.push(cur);
    const node = activePrevNodeMap.get(cur);
    cur = node ? node.__next : null;
  }
  const prevSet = new Set(prevSuffixKeys);
  const nextSet = new Set(nextSuffixKeys);
  const ops = [];
  let pi = 0;
  let ni = 0;
  while (pi < kPrime && ni < k) {
    if (nextSuffixKeys[ni] === prevSuffixKeys[pi]) {
      ops.push({
        key: nextSuffixKeys[ni],
        kind: "reconcile"
      });
      pi++;
      ni++;
    } else if (!nextSet.has(prevSuffixKeys[pi])) {
      ops.push({
        key: prevSuffixKeys[pi],
        kind: "destroy"
      });
      pi++;
    } else if (!prevSet.has(nextSuffixKeys[ni])) {
      ops.push({
        key: nextSuffixKeys[ni],
        kind: "create",
        nextIndex: ni
      });
      ni++;
    } else {
      return false;
    }
  }
  while (pi < kPrime) {
    ops.push({
      key: prevSuffixKeys[pi++],
      kind: "destroy"
    });
  }
  while (ni < k) {
    ops.push({
      key: nextSuffixKeys[ni],
      kind: "create",
      nextIndex: ni
    });
    ni++;
  }
  const oldSuffixLength = $prevSuffixTextSize(prevSuffixStartKey, kPrime);
  for (const op of ops) {
    const saved = $beginCaptureGuard();
    if (op.kind === "reconcile") {
      $reconcileNode(op.key, slot.element);
    } else if (op.kind === "destroy") {
      $destroyNode(op.key, slot.element);
    } else {
      let beforeDOM = null;
      for (let j2 = op.nextIndex + 1; j2 < k; j2++) {
        const siblingDOM = activeEditor$1._keyToDOMMap.get(nextSuffixKeys[j2]);
        if (siblingDOM !== void 0) {
          beforeDOM = siblingDOM;
          break;
        }
      }
      $createNode(op.key, slot.withBefore(beforeDOM ?? slot.before));
    }
    if (op.kind !== "destroy") {
      const opNode = activeNextNodeMap.get(op.key);
      if (opNode && $isTextNode(opNode) && subTreeTextFormat === null) {
        subTreeTextFormat = opNode.getFormat();
        subTreeTextStyle = opNode.getStyle();
        subTreeFirstTextKey = opNode.__key;
      }
    }
    $endCaptureGuard(saved);
  }
  let newSuffix = "";
  for (let i2 = 0; i2 < k; i2++) {
    const node = activeNextNodeMap.get(nextSuffixKeys[i2]);
    if (node === void 0) {
      return false;
    }
    let text;
    if ($isElementNode(node)) {
      const childKeyedDom = activeEditor$1._keyToDOMMap.get(nextSuffixKeys[i2]);
      const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
      if (!(typeof cached === "string")) {
        formatDevErrorMessage(`tryReconcileSuffixWithSizeDelta: missing __lexicalTextContent on child of type ${node.getType()} after suffix reconcile`);
      }
      text = cached;
    } else {
      text = node.getTextContent();
    }
    newSuffix += text;
    if (i2 < k - 1 && $isElementNode(node) && !node.isInline()) {
      newSuffix += DOUBLE_LINE_BREAK;
    }
  }
  const slotLen = cacheDom.__lexicalSlotTextLength || 0;
  const prevChildText = slotLen > 0 ? cachedParentText.slice(slotLen) : cachedParentText;
  cacheDom.__lexicalTextContent = prevChildText.slice(0, prevChildText.length - oldSuffixLength) + newSuffix;
  return true;
}
function $resolveSuffixPathFormat(nextElement, dom, dirtyChildren) {
  const cachedFirstTextKey = dom.__lexicalFirstTextKey;
  if (cachedFirstTextKey != null) {
    const parentKey = nextElement.__key;
    let ancestor = cachedFirstTextKey;
    while (ancestor !== null) {
      const node = activeNextNodeMap.get(ancestor);
      if (node === void 0) {
        ancestor = null;
        break;
      }
      if (node.__parent === parentKey) {
        break;
      }
      ancestor = node.__parent;
    }
    if (ancestor !== null && !dirtyChildren.has(ancestor)) {
      const textNode = activeNextNodeMap.get(cachedFirstTextKey);
      if ($isTextNode(textNode)) {
        subTreeTextFormat = textNode.getFormat();
        subTreeTextStyle = textNode.getStyle();
        return;
      }
    }
  }
  dom.__lexicalFirstTextKey = subTreeFirstTextKey;
}
function $reconcileChildren(prevElement, nextElement, slot) {
  const previousSubTreeTextContent = subTreeTextContent;
  const prevChildrenSize = prevElement.__size;
  const nextChildrenSize = nextElement.__size;
  subTreeTextContent = "";
  const dom = slot.element;
  const cacheDom = activeEditor$1._keyToDOMMap.get(nextElement.__key);
  if (!(cacheDom !== void 0)) {
    formatDevErrorMessage(`$reconcileChildren: Element with key ${nextElement.__key} missing from keyToDOMMap`);
  }
  const sizeDelta = nextChildrenSize - prevChildrenSize;
  if (
    // A FULL_RECONCILE (e.g. `setEditorState`, which backs history
    // undo/redo) swaps the whole node map wholesale without routing
    // structural changes through `getWritable()`, so `_cloneNotNeeded`
    // is empty even when prev and next children differ by key. That
    // breaks the `sizeDelta === 0` walk below, which starts at
    // `prevElement.__first` but advances via the next map's `__next`
    // pointers — assuming both lists hold the same keys in the same
    // order. With a same-size key swap (undo replacing a CodeNode with
    // the paragraphs it came from) the walk reaches a next-only key and
    // `$reconcileNode` throws on the missing prev node (#8563). Dirty
    // tracking is meaningless in this mode anyway, so fall through to the
    // general key-diffing path.
    !treatAllNodesAsDirty && Math.abs(sizeDelta) <= 1 && prevChildrenSize >= MIN_FAST_PATH_CHILDREN && prevElement.__first === nextElement.__first && // For sizeDelta=0 the parent must not have been cloned this cycle —
    // any structural mutation routed through Lexical's mutation API
    // (insertBefore/insertAfter/replace/remove/append etc.) keeps the
    // parent in `_cloneNotNeeded` via `getWritable()`, so this single
    // check already covers a stale `__last` for those cases. Direct
    // pointer mutation that bypasses `getWritable()` is outside the
    // contract and not guarded against here. For sizeDelta=±1 the
    // parent is always cloned (its `__size` mutation goes through
    // `getWritable`), so the same check would dead-code that branch.
    (sizeDelta !== 0 || !activeEditor$1._cloneNotNeeded.has(prevElement.__key))
  ) {
    const cachedParentText = cacheDom.__lexicalTextContent;
    const dirtyChildren = activeDirtyChildrenByParent.get(prevElement.__key);
    if (!treatAllNodesAsDirty && typeof cachedParentText === "string" && dirtyChildren !== void 0) {
      const suffixStartKey = $suffixStartIfContiguous(nextElement, dirtyChildren);
      if (suffixStartKey !== null) {
        const k = dirtyChildren.size;
        if (sizeDelta === 0) {
          const oldSuffixLength = $prevSuffixTextSize(suffixStartKey, k);
          let cur = suffixStartKey;
          let i2 = 0;
          while (cur !== null && i2 < k) {
            const node = activeNextNodeMap.get(cur);
            if (node === void 0) {
              break;
            }
            const saved = $beginCaptureGuard();
            $reconcileNode(cur, dom);
            if ($isTextNode(node) && subTreeTextFormat === null) {
              subTreeTextFormat = node.getFormat();
              subTreeTextStyle = node.getStyle();
              subTreeFirstTextKey = node.__key;
            }
            $endCaptureGuard(saved);
            cur = node.__next;
            i2++;
          }
          let newSuffix = "";
          cur = suffixStartKey;
          i2 = 0;
          while (cur !== null && i2 < k) {
            const node = activeNextNodeMap.get(cur);
            if (node === void 0) {
              break;
            }
            let text;
            if ($isElementNode(node)) {
              const childKeyedDom = activeEditor$1._keyToDOMMap.get(cur);
              const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
              if (!(typeof cached === "string")) {
                formatDevErrorMessage(`reconcileChildren same-size suffix: missing __lexicalTextContent on child of type ${node.getType()} after reconcile`);
              }
              text = cached;
            } else {
              text = node.getTextContent();
            }
            newSuffix += text;
            if (i2 < k - 1 && $isElementNode(node) && !node.isInline()) {
              newSuffix += DOUBLE_LINE_BREAK;
            }
            cur = node.__next;
            i2++;
          }
          const slotLen = cacheDom.__lexicalSlotTextLength || 0;
          const prevChildText = slotLen > 0 ? cachedParentText.slice(slotLen) : cachedParentText;
          const newChildText = prevChildText.slice(0, prevChildText.length - oldSuffixLength) + newSuffix;
          cacheDom.__lexicalTextContent = newChildText;
          subTreeTextContent = previousSubTreeTextContent + newChildText;
          $resolveSuffixPathFormat(nextElement, cacheDom, dirtyChildren);
          return;
        }
        if ($tryReconcileSuffixWithSizeDelta(prevElement, nextElement, slot, cacheDom, cachedParentText, suffixStartKey, k, sizeDelta)) {
          const newCachedText = cacheDom.__lexicalTextContent;
          if (!(typeof newCachedText === "string")) {
            formatDevErrorMessage(`reconcileChildren: $tryReconcileSuffixWithSizeDelta returned true without writing __lexicalTextContent`);
          }
          subTreeTextContent = previousSubTreeTextContent + newCachedText;
          $resolveSuffixPathFormat(nextElement, cacheDom, dirtyChildren);
          return;
        }
      }
    }
    if (sizeDelta === 0) {
      let nodeKey = prevElement.__first;
      let i2 = 0;
      while (nodeKey !== null) {
        const node = activeNextNodeMap.get(nodeKey);
        if (node === void 0) {
          break;
        }
        const isDirty = treatAllNodesAsDirty || activeDirtyLeaves.has(nodeKey) || activeDirtyElements.has(nodeKey);
        const saved = $beginCaptureGuard();
        if (isDirty) {
          $reconcileNode(nodeKey, dom);
        } else {
          let text;
          let childKeyedDom;
          if ($isElementNode(node)) {
            childKeyedDom = activePrevKeyToDOMMap.get(nodeKey);
            const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
            if (!(typeof cached === "string")) {
              formatDevErrorMessage(`reconcileChildren structurally-clean walk: missing __lexicalTextContent on non-dirty child of type ${node.getType()}`);
            }
            text = cached;
          } else {
            text = node.getTextContent();
          }
          subTreeTextContent += text;
          if (childKeyedDom !== void 0) {
            $bubbleChildFirstText(childKeyedDom);
          }
        }
        if ($isTextNode(node)) {
          if (subTreeTextFormat === null) {
            subTreeTextFormat = node.getFormat();
            subTreeTextStyle = node.getStyle();
            subTreeFirstTextKey = node.__key;
          }
        } else if ($isElementNode(node) && i2 < nextChildrenSize - 1 && !node.isInline()) {
          subTreeTextContent += DOUBLE_LINE_BREAK;
        }
        $endCaptureGuard(saved);
        nodeKey = node.__next;
        i2++;
      }
      cacheDom.__lexicalTextContent = subTreeTextContent;
      cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
      subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
      return;
    }
  }
  if (prevChildrenSize === 1 && nextChildrenSize === 1) {
    const prevFirstChildKey = prevElement.__first;
    const nextFirstChildKey = nextElement.__first;
    if (prevFirstChildKey === nextFirstChildKey) {
      $reconcileNode(prevFirstChildKey, dom);
    } else {
      const lastDOM = getPrevElementByKeyOrThrow(prevFirstChildKey);
      const replacementDOM = $createNode(nextFirstChildKey, null);
      try {
        if (lastDOM.parentNode === dom) {
          dom.replaceChild(replacementDOM, lastDOM);
        } else {
          slot.insertChild(replacementDOM);
        }
      } catch (error) {
        if (typeof error === "object" && error != null) {
          const msg = `${error.toString()} Parent: ${dom.tagName}, new child: {tag: ${replacementDOM.tagName} key: ${nextFirstChildKey}}, old child: {tag: ${lastDOM.tagName}, key: ${prevFirstChildKey}}.`;
          throw new Error(msg);
        } else {
          throw error;
        }
      }
      $destroyNode(prevFirstChildKey, null);
    }
    const nextChildNode = activeNextNodeMap.get(nextFirstChildKey);
    if ($isTextNode(nextChildNode)) {
      if (subTreeTextFormat === null) {
        subTreeTextFormat = nextChildNode.getFormat();
        subTreeTextStyle = nextChildNode.getStyle();
        subTreeFirstTextKey = nextChildNode.__key;
      }
    }
  } else {
    const prevChildren = $createChildrenArray(prevElement, activePrevNodeMap);
    const nextChildren = $createChildrenArray(nextElement, activeNextNodeMap);
    if (!(prevChildren.length === prevChildrenSize)) {
      formatDevErrorMessage(`$reconcileChildren: prevChildren.length !== prevChildrenSize`);
    }
    if (!(nextChildren.length === nextChildrenSize)) {
      formatDevErrorMessage(`$reconcileChildren: nextChildren.length !== nextChildrenSize`);
    }
    if (prevChildrenSize === 0) {
      if (nextChildrenSize !== 0) {
        $createChildren(nextChildren, nextElement, 0, nextChildrenSize - 1, slot);
      }
    } else if (nextChildrenSize === 0) {
      if (prevChildrenSize !== 0) {
        const canUseFastPath = slot.after == null && slot.before == null && // Slot containers are prepended into this same DOM (slots-first), so
        // clearing it with `textContent = ''` would wipe them along with the
        // children. Fall back to the keyed slow path, which removes only the
        // child DOM nodes and leaves the slot containers intact.
        $readSlots(nextElement).size === 0 && slot.element.__lexicalLineBreak == null;
        $destroyChildren(prevChildren, 0, prevChildrenSize - 1, canUseFastPath ? null : dom);
        if (canUseFastPath) {
          dom.textContent = "";
        }
      }
    } else {
      $reconcileNodeChildren(nextElement, prevChildren, nextChildren, prevChildrenSize, nextChildrenSize, slot);
    }
  }
  cacheDom.__lexicalTextContent = subTreeTextContent;
  cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
  subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
}
function $reconcileNode(key, parentDOM) {
  const prevNode = activePrevNodeMap.get(key);
  let nextNode = activeNextNodeMap.get(key);
  if (prevNode === void 0 || nextNode === void 0) {
    {
      formatDevErrorMessage(`reconcileNode: prevNode or nextNode does not exist in nodeMap`);
    }
  }
  const isDirty = treatAllNodesAsDirty || activeDirtyLeaves.has(key) || activeDirtyElements.has(key);
  const dom = getElementByKeyOrThrow(activeEditor$1, key);
  if (prevNode === nextNode && !isDirty) {
    let text;
    if ($isElementNode(prevNode)) {
      const previousSubTreeTextContent = dom.__lexicalTextContent;
      if (!(typeof previousSubTreeTextContent === "string")) {
        formatDevErrorMessage(`reconcileNode: missing __lexicalTextContent on non-dirty element of type ${prevNode.getType()}`);
      }
      text = previousSubTreeTextContent;
      $bubbleChildFirstText(dom);
    } else {
      text = prevNode.getTextContent();
    }
    subTreeTextContent += text;
    return dom;
  }
  if (prevNode !== nextNode && isDirty) {
    setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, nextNode, "updated");
  }
  if (activeEditorDOMRenderConfig.$updateDOM(nextNode, prevNode, dom, activeEditor$1)) {
    const replacementDOM = $createNode(key, null);
    if (parentDOM === null) {
      {
        formatDevErrorMessage(`reconcileNode: parentDOM is null`);
      }
    }
    parentDOM.replaceChild(replacementDOM, dom);
    $destroyNode(key, null);
    return replacementDOM;
  }
  if ($isElementNode(prevNode)) {
    if (!$isElementNode(nextNode)) {
      formatDevErrorMessage(`Node with key ${key} changed from ElementNode to !ElementNode`);
    }
    const nextIndent = nextNode.__indent;
    if (treatAllNodesAsDirty || nextIndent !== prevNode.__indent) {
      setElementIndent(dom, nextIndent);
    }
    const nextFormat = nextNode.__format;
    if (treatAllNodesAsDirty || nextFormat !== prevNode.__format) {
      setElementFormat(dom, nextFormat);
    }
    const slotTextContent = isDirty && ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0) ? $reconcileSlotChildren(prevNode, nextNode, dom) : "";
    if (isDirty) {
      const outerBefore = subTreeTextContent;
      $reconcileChildrenWithDirection(prevNode, nextNode, dom);
      if (!nextNode.isInline()) {
        if (!$isRootNode(nextNode)) {
          $reconcileElementTerminatingLineBreak(prevNode, nextNode, dom);
        }
        $reconcileDecoratorBoundaryAnchors(nextNode, dom);
      }
      if (slotTextContent !== "") {
        const childText = dom.__lexicalTextContent || "";
        dom.__lexicalTextContent = slotTextContent + childText;
        subTreeTextContent = outerBefore + slotTextContent + childText;
        dom.__lexicalSlotTextLength = slotTextContent.length;
      } else if ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0) {
        dom.__lexicalSlotTextLength = 0;
      }
    } else {
      const previousSubTreeTextContent = dom.__lexicalTextContent;
      if (!(typeof previousSubTreeTextContent === "string")) {
        formatDevErrorMessage(`reconcileNode: missing __lexicalTextContent on cloned non-dirty element of type ${prevNode.getType()}`);
      }
      subTreeTextContent += previousSubTreeTextContent;
      $bubbleChildFirstText(dom);
    }
    if (treatAllNodesAsDirty || nextNode.__dir !== prevNode.__dir || nextNode.__parent !== prevNode.__parent) {
      $setElementDirection(dom, nextNode);
      if (
        // Root node direction changing from set to unset (or vice versa)
        // changes how children's direction is calculated.
        $isRootNode(nextNode) && // Can skip if all children already reconciled.
        !treatAllNodesAsDirty
      ) {
        for (const child of nextNode.getChildren()) {
          if ($isElementNode(child)) {
            const childDom = getElementByKeyOrThrow(activeEditor$1, child.getKey());
            $setElementDirection(childDom, child);
          }
        }
      }
    }
  } else {
    const text = nextNode.getTextContent();
    if ($isDecoratorNode(nextNode)) {
      const decorator = nextNode.decorate(activeEditor$1, activeEditorConfig);
      if (decorator !== null) {
        reconcileDecorator(key, decorator);
      }
      if (isDirty && ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0)) {
        $reconcileSlotChildren(prevNode, nextNode, dom);
      }
    }
    subTreeTextContent += text;
  }
  if (!activeEditorStateReadOnly && $isRootNode(nextNode)) {
    const latestRoot = nextNode.getLatest();
    if (latestRoot.__cachedText !== subTreeTextContent) {
      const nextRootNode = latestRoot.getWritable();
      nextRootNode.__cachedText = subTreeTextContent;
      nextNode = nextRootNode;
    }
  }
  activeEditorDOMRenderConfig.$decorateDOM(nextNode, prevNode, dom, activeEditor$1);
  $setCachedTextSize(nextNode);
  {
    Object.freeze(nextNode);
  }
  return dom;
}
function reconcileDecorator(key, decorator) {
  let pendingDecorators = activeEditor$1._pendingDecorators;
  const currentDecorators = activeEditor$1._decorators;
  if (pendingDecorators === null) {
    if (currentDecorators[key] === decorator) {
      return;
    }
    pendingDecorators = cloneDecorators(activeEditor$1);
  }
  pendingDecorators[key] = decorator;
}
function getNextSibling(element) {
  let nextSibling = element.nextSibling;
  if (nextSibling !== null && nextSibling === activeEditor$1._blockCursorElement) {
    nextSibling = nextSibling.nextSibling;
  }
  return nextSibling;
}
function childrenSet(children, start) {
  const s2 = /* @__PURE__ */ new Set();
  for (let i2 = start; i2 < children.length; i2++) {
    s2.add(children[i2]);
  }
  return s2;
}
function $reconcileNodeChildren(nextElement, prevChildren, nextChildren, prevChildrenLength, nextChildrenLength, slot) {
  const prevEndIndex = prevChildrenLength - 1;
  const nextEndIndex = nextChildrenLength - 1;
  let prevChildrenSet;
  let nextChildrenSet;
  let siblingDOM = slot.getFirstChild();
  let prevIndex = 0;
  let nextIndex = 0;
  while (prevIndex <= prevEndIndex && nextIndex <= nextEndIndex) {
    const prevKey = prevChildren[prevIndex];
    const nextKey = nextChildren[nextIndex];
    const saved = $beginCaptureGuard();
    if (prevKey === nextKey) {
      siblingDOM = getNextSibling($reconcileNode(nextKey, slot.element));
      prevIndex++;
      nextIndex++;
    } else {
      if (nextChildrenSet === void 0) {
        nextChildrenSet = childrenSet(nextChildren, nextIndex);
      }
      if (prevChildrenSet === void 0) {
        prevChildrenSet = childrenSet(prevChildren, prevIndex);
      } else if (!prevChildrenSet.has(prevKey)) {
        prevIndex++;
        $endCaptureGuard(saved);
        continue;
      }
      if (!nextChildrenSet.has(prevKey)) {
        siblingDOM = getNextSibling(getPrevElementByKeyOrThrow(prevKey));
        $destroyNode(prevKey, slot.element);
        prevIndex++;
        prevChildrenSet.delete(prevKey);
        $endCaptureGuard(saved);
        continue;
      }
      if (!prevChildrenSet.has(nextKey)) {
        $createNode(nextKey, slot.withBefore(siblingDOM ?? slot.before));
        nextIndex++;
      } else {
        const childDOM = getElementByKeyOrThrow(activeEditor$1, nextKey);
        if (childDOM !== siblingDOM) {
          slot.withBefore(siblingDOM ?? slot.before).insertChild(childDOM);
        }
        siblingDOM = getNextSibling($reconcileNode(nextKey, slot.element));
        prevIndex++;
        nextIndex++;
      }
    }
    const node = activeNextNodeMap.get(nextKey);
    if (node !== null && $isTextNode(node)) {
      if (subTreeTextFormat === null) {
        subTreeTextFormat = node.getFormat();
        subTreeTextStyle = node.getStyle();
        subTreeFirstTextKey = node.__key;
      }
    } else if (
      // inline $textContentRequiresDoubleLinebreakAtEnd
      $isElementNode(node) && nextIndex <= nextEndIndex && !node.isInline()
    ) {
      subTreeTextContent += DOUBLE_LINE_BREAK;
    }
    $endCaptureGuard(saved);
  }
  const appendNewChildren = prevIndex > prevEndIndex;
  const removeOldChildren = nextIndex > nextEndIndex;
  if (appendNewChildren && !removeOldChildren) {
    const previousNode = nextChildren[nextEndIndex + 1];
    const insertDOM = previousNode === void 0 ? null : activeEditor$1.getElementByKey(previousNode);
    $createChildren(
      nextChildren,
      nextElement,
      nextIndex,
      nextEndIndex,
      // Preserve the slot's trailing decoration anchor when appending at
      // the end (insertDOM === null).
      slot.withBefore(insertDOM ?? slot.before)
    );
  } else if (removeOldChildren && !appendNewChildren) {
    $destroyChildren(prevChildren, prevIndex, prevEndIndex, slot.element);
  }
}
function $reconcileRoot(prevEditorState, nextEditorState, editor, dirtyType, dirtyElements, dirtyLeaves) {
  subTreeTextContent = "";
  subTreeTextFormat = null;
  subTreeTextStyle = null;
  subTreeFirstTextKey = null;
  treatAllNodesAsDirty = dirtyType === FULL_RECONCILE;
  activeEditor$1 = editor;
  activeEditorConfig = editor._config;
  activeEditorDOMRenderConfig = editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG;
  activeEditorNodes = editor._nodes;
  activeMutationListeners = activeEditor$1._listeners.mutation;
  activeDirtyElements = dirtyElements;
  activeDirtyLeaves = dirtyLeaves;
  activePrevNodeMap = prevEditorState._nodeMap;
  activePrevEditorState = prevEditorState;
  activeNextNodeMap = nextEditorState._nodeMap;
  activeEditorStateReadOnly = nextEditorState._readOnly;
  activePrevKeyToDOMMap = cloneMap(editor._keyToDOMMap);
  activeDirtyChildrenByParent = $buildDirtyChildrenByParent();
  const currentMutatedNodes = /* @__PURE__ */ new Map();
  mutatedNodes = currentMutatedNodes;
  $reconcileNode("root", null);
  activeEditor$1 = void 0;
  activeEditorNodes = void 0;
  activeDirtyElements = void 0;
  activeDirtyLeaves = void 0;
  activePrevNodeMap = void 0;
  activePrevEditorState = void 0;
  activeNextNodeMap = void 0;
  activeEditorConfig = void 0;
  activePrevKeyToDOMMap = void 0;
  activeDirtyChildrenByParent = void 0;
  mutatedNodes = void 0;
  activeEditorDOMRenderConfig = DEFAULT_EDITOR_DOM_CONFIG;
  return currentMutatedNodes;
}
function storeDOMWithKey(key, dom, editor) {
  const keyToDOMMap = editor._keyToDOMMap;
  setNodeKeyOnDOMNode(dom, editor, key);
  keyToDOMMap.set(key, dom);
}
function getPrevElementByKeyOrThrow(key) {
  const element = activePrevKeyToDOMMap.get(key);
  if (element === void 0) {
    {
      formatDevErrorMessage(`Reconciliation: could not find DOM element for node key ${key}`);
    }
  }
  return element;
}
function warnOnlyOnce(message) {
  {
    let run = false;
    return () => {
      if (!run) {
        console.warn(message);
      }
      run = true;
    };
  }
}
// @__NO_SIDE_EFFECTS__
function createCommand(type) {
  return {
    type
  };
}
var SELECTION_CHANGE_COMMAND = /* @__PURE__ */ createCommand("SELECTION_CHANGE_COMMAND");
var SELECTION_INSERT_CLIPBOARD_NODES_COMMAND = /* @__PURE__ */ createCommand("SELECTION_INSERT_CLIPBOARD_NODES_COMMAND");
var CLICK_COMMAND = /* @__PURE__ */ createCommand("CLICK_COMMAND");
var BEFORE_INPUT_COMMAND = /* @__PURE__ */ createCommand("BEFORE_INPUT_COMMAND");
var INPUT_COMMAND = /* @__PURE__ */ createCommand("INPUT_COMMAND");
var COMPOSITION_START_COMMAND = /* @__PURE__ */ createCommand("COMPOSITION_START_COMMAND");
var COMPOSITION_END_COMMAND = /* @__PURE__ */ createCommand("COMPOSITION_END_COMMAND");
var DELETE_CHARACTER_COMMAND = /* @__PURE__ */ createCommand("DELETE_CHARACTER_COMMAND");
var INSERT_LINE_BREAK_COMMAND = /* @__PURE__ */ createCommand("INSERT_LINE_BREAK_COMMAND");
var INSERT_PARAGRAPH_COMMAND = /* @__PURE__ */ createCommand("INSERT_PARAGRAPH_COMMAND");
var CONTROLLED_TEXT_INSERTION_COMMAND = /* @__PURE__ */ createCommand("CONTROLLED_TEXT_INSERTION_COMMAND");
var PASTE_COMMAND = /* @__PURE__ */ createCommand("PASTE_COMMAND");
var REMOVE_TEXT_COMMAND = /* @__PURE__ */ createCommand("REMOVE_TEXT_COMMAND");
var DELETE_WORD_COMMAND = /* @__PURE__ */ createCommand("DELETE_WORD_COMMAND");
var DELETE_LINE_COMMAND = /* @__PURE__ */ createCommand("DELETE_LINE_COMMAND");
var FORMAT_TEXT_COMMAND = /* @__PURE__ */ createCommand("FORMAT_TEXT_COMMAND");
var SET_TEXT_FORMAT_COMMAND = /* @__PURE__ */ createCommand("SET_TEXT_FORMAT_COMMAND");
var UNDO_COMMAND = /* @__PURE__ */ createCommand("UNDO_COMMAND");
var REDO_COMMAND = /* @__PURE__ */ createCommand("REDO_COMMAND");
var KEY_DOWN_COMMAND = /* @__PURE__ */ createCommand("KEYDOWN_COMMAND");
var KEY_ARROW_RIGHT_COMMAND = /* @__PURE__ */ createCommand("KEY_ARROW_RIGHT_COMMAND");
var MOVE_TO_END = /* @__PURE__ */ createCommand("MOVE_TO_END");
var KEY_ARROW_LEFT_COMMAND = /* @__PURE__ */ createCommand("KEY_ARROW_LEFT_COMMAND");
var MOVE_TO_START = /* @__PURE__ */ createCommand("MOVE_TO_START");
var KEY_ARROW_UP_COMMAND = /* @__PURE__ */ createCommand("KEY_ARROW_UP_COMMAND");
var KEY_ARROW_DOWN_COMMAND = /* @__PURE__ */ createCommand("KEY_ARROW_DOWN_COMMAND");
var KEY_ENTER_COMMAND = /* @__PURE__ */ createCommand("KEY_ENTER_COMMAND");
var KEY_SPACE_COMMAND = /* @__PURE__ */ createCommand("KEY_SPACE_COMMAND");
var KEY_BACKSPACE_COMMAND = /* @__PURE__ */ createCommand("KEY_BACKSPACE_COMMAND");
var KEY_ESCAPE_COMMAND = /* @__PURE__ */ createCommand("KEY_ESCAPE_COMMAND");
var KEY_DELETE_COMMAND = /* @__PURE__ */ createCommand("KEY_DELETE_COMMAND");
var KEY_TAB_COMMAND = /* @__PURE__ */ createCommand("KEY_TAB_COMMAND");
var INSERT_TAB_COMMAND = /* @__PURE__ */ createCommand("INSERT_TAB_COMMAND");
var INDENT_CONTENT_COMMAND = /* @__PURE__ */ createCommand("INDENT_CONTENT_COMMAND");
var OUTDENT_CONTENT_COMMAND = /* @__PURE__ */ createCommand("OUTDENT_CONTENT_COMMAND");
var DROP_COMMAND = /* @__PURE__ */ createCommand("DROP_COMMAND");
var FORMAT_ELEMENT_COMMAND = /* @__PURE__ */ createCommand("FORMAT_ELEMENT_COMMAND");
var DRAGSTART_COMMAND = /* @__PURE__ */ createCommand("DRAGSTART_COMMAND");
var DRAGOVER_COMMAND = /* @__PURE__ */ createCommand("DRAGOVER_COMMAND");
var DRAGEND_COMMAND = /* @__PURE__ */ createCommand("DRAGEND_COMMAND");
var COPY_COMMAND = /* @__PURE__ */ createCommand("COPY_COMMAND");
var CUT_COMMAND = /* @__PURE__ */ createCommand("CUT_COMMAND");
var SELECT_ALL_COMMAND = /* @__PURE__ */ createCommand("SELECT_ALL_COMMAND");
var CLEAR_EDITOR_COMMAND = /* @__PURE__ */ createCommand("CLEAR_EDITOR_COMMAND");
var CLEAR_HISTORY_COMMAND = /* @__PURE__ */ createCommand("CLEAR_HISTORY_COMMAND");
var CAN_REDO_COMMAND = /* @__PURE__ */ createCommand("CAN_REDO_COMMAND");
var CAN_UNDO_COMMAND = /* @__PURE__ */ createCommand("CAN_UNDO_COMMAND");
var FOCUS_COMMAND = /* @__PURE__ */ createCommand("FOCUS_COMMAND");
var BLUR_COMMAND = /* @__PURE__ */ createCommand("BLUR_COMMAND");
var KEY_MODIFIER_COMMAND = /* @__PURE__ */ createCommand("KEY_MODIFIER_COMMAND");
var CONTROL_OR_META = {
  [CONTROL_OR_OTHER_KEY]: "metaKey",
  ctrlKey: !IS_APPLE,
  metaKey: IS_APPLE
};
var CONTROL_OR_ALT = {
  [CONTROL_OR_OTHER_KEY]: "altKey",
  altKey: IS_APPLE,
  ctrlKey: !IS_APPLE
};
var MODIFIER_BITS = [["altKey", 1], ["ctrlKey", 2], ["metaKey", 4], ["shiftKey", 8]];
function getEventModifierBits(event) {
  let bits = 0;
  for (const [prop, bit] of MODIFIER_BITS) {
    if (event[prop]) {
      bits |= bit;
    }
  }
  return bits;
}
function getMaskModifierBits(mask) {
  let combos = [0];
  for (const [prop, bit] of MODIFIER_BITS) {
    const expected = mask[prop] || false;
    if (expected === "any") {
      combos = combos.concat(combos.map((bits) => bits | bit));
    } else if (expected) {
      combos = combos.map((bits) => bits | bit);
    }
  }
  return combos;
}
function pushEntry(map, mapKey, shortcut) {
  const entry = map.get(mapKey);
  if (entry) {
    entry.push(shortcut);
  } else {
    map.set(mapKey, [shortcut]);
  }
}
var CompiledKeyboardShortcuts = class {
  /** `${modifierBits}:${key.toLowerCase()}` -> shortcuts in insertion order */
  byKey = /* @__PURE__ */ new Map();
  /**
   * `${modifierBits}:${code}` (e.g. `Digit1`, `KeyB`) -> shortcuts, used
   * only when `event.key` is not a single ASCII character so that
   * single-character shortcuts still work on non-Latin keyboard layouts
   * (the same fallback as {@link isExactShortcutMatch})
   */
  byCode = /* @__PURE__ */ new Map();
  add(shortcut) {
    const {
      key,
      modifiers = {}
    } = shortcut;
    if (!(key.length > 0)) {
      formatDevErrorMessage(`KeyboardShortcutMatch: key must be non-empty`);
    }
    const lowerKey = key.toLowerCase();
    for (const bits of getMaskModifierBits(modifiers)) {
      pushEntry(this.byKey, `${bits}:${lowerKey}`, shortcut);
      if (key.length === 1) {
        if (/[0-9]/.test(key)) {
          pushEntry(this.byCode, `${bits}:Digit${key}`, shortcut);
        } else if (/[a-z]/.test(lowerKey)) {
          pushEntry(this.byCode, `${bits}:Key${lowerKey.toUpperCase()}`, shortcut);
        }
      }
    }
    return this;
  }
  /**
   * All shortcuts matching the event, in insertion order.
   * Matches by `key` precede matches by the `code` fallback.
   * @see {@link match} for the single-result fast path.
   */
  matches(event) {
    const key = event.key;
    if (!key) {
      return [];
    }
    const bits = getEventModifierBits(event);
    const byKey = this.byKey.get(`${bits}:${key.toLowerCase()}`);
    const matches = byKey ? byKey.slice() : [];
    if (this.byCode.size > 0 && !(key.length === 1 && key.charCodeAt(0) <= 127)) {
      const byCode = this.byCode.get(`${bits}:${event.code}`);
      if (byCode) {
        matches.push(...byCode);
      }
    }
    return matches;
  }
  /**
   * The first shortcut matching the event, if any.
   * @see {@link matches} for the full list of matching shortcuts.
   */
  match(event) {
    return this.matches(event)[0];
  }
};
function compileKeyboardShortcuts(shortcuts) {
  const compiled = new CompiledKeyboardShortcuts();
  for (const shortcut of shortcuts) {
    compiled.add(shortcut);
  }
  return compiled;
}
function createRefCountedRegistry(activate) {
  const entries = /* @__PURE__ */ new Map();
  return {
    dispose() {
      for (const entry of entries.values()) {
        entry.dispose();
      }
      entries.clear();
    },
    register(key, options) {
      let entry = entries.get(key);
      if (entry === void 0) {
        entry = {
          dispose: activate(key, options),
          holders: /* @__PURE__ */ new Set()
        };
        entries.set(key, entry);
      }
      const release = () => {
        const current = entries.get(key);
        if (current && current.holders.delete(release) && current.holders.size === 0) {
          entries.delete(key);
          current.dispose();
        }
      };
      entry.holders.add(release);
      return release;
    }
  };
}
function registerEventListener(target, type, listener, options) {
  target.addEventListener(type, listener, options);
  return target.removeEventListener.bind(target, type, listener, options);
}
var PASS_THROUGH_COMMAND = Object.freeze({});
var ANDROID_COMPOSITION_LATENCY = 30;
var rootElementEvents = [["keydown", onKeyDown], ["pointerdown", onPointerDown], ["compositionstart", onCompositionStart], ["compositionend", onCompositionEnd], ["input", onInput], ["click", onClick], ["cut", PASS_THROUGH_COMMAND], ["copy", PASS_THROUGH_COMMAND], ["dragstart", PASS_THROUGH_COMMAND], ["dragover", PASS_THROUGH_COMMAND], ["dragend", PASS_THROUGH_COMMAND], ["paste", PASS_THROUGH_COMMAND], ["focus", PASS_THROUGH_COMMAND], ["blur", PASS_THROUGH_COMMAND], ["drop", PASS_THROUGH_COMMAND]];
if (CAN_USE_BEFORE_INPUT) {
  rootElementEvents.push(["beforeinput", (event, editor) => onBeforeInput(event, editor)]);
}
var rootElementToDocument = /* @__PURE__ */ new WeakMap();
var documentRegistrations = /* @__PURE__ */ new WeakMap();
var documentSelectionChange = createRefCountedRegistry((doc) => {
  doc.addEventListener("selectionchange", onDocumentSelectionChange);
  return () => doc.removeEventListener("selectionchange", onDocumentSelectionChange);
});
function $shouldPreventDefaultAndInsertText(selection, domTargetRange, text, timeStamp, isBeforeInput, cachedDOMSelectionPoints) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const editor = getActiveEditor();
  let domSelectionPoints;
  if (cachedDOMSelectionPoints !== void 0) {
    domSelectionPoints = cachedDOMSelectionPoints;
  } else {
    const domSelection = getDOMSelection(getWindow(editor));
    domSelectionPoints = domSelection !== null ? getDOMSelectionPoints(domSelection, editor._rootElement) : null;
  }
  const domAnchorNode = domSelectionPoints !== null ? domSelectionPoints.anchorNode : null;
  const anchorKey = anchor.key;
  const backingAnchorElement = editor.getElementByKey(anchorKey);
  const textLength = text.length;
  return anchorKey !== focus.key || // If we're working with a non-text node.
  !$isTextNode(anchorNode) || // If we are replacing a range with a single character or grapheme, and not composing.
  (!isBeforeInput && (!CAN_USE_BEFORE_INPUT || // We check to see if there has been
  // a recent beforeinput event for "textInput". If there has been one in the last
  // 50ms then we proceed as normal. However, if there is not, then this is likely
  // a dangling `input` event caused by execCommand('insertText').
  editor._inputState.lastBeforeInputInsertTextTimeStamp < timeStamp + 50) || anchorNode.isDirty() && textLength < 2 || // TODO consider if there are other scenarios when multiple code units
  //      should be addressed here
  doesContainSurrogatePair(text)) && anchor.offset !== focus.offset && !anchorNode.isComposing() || // Any non standard text node.
  $isTokenOrSegmented(anchorNode) || // If the text length is more than a single character and we're either
  // dealing with this in "beforeinput" or where the node has already recently
  // been changed (thus is dirty).
  anchorNode.isDirty() && textLength > 1 || // If the DOM selection element is not the same as the backing node during beforeinput.
  (isBeforeInput || !CAN_USE_BEFORE_INPUT) && backingAnchorElement !== null && !anchorNode.isComposing() && domAnchorNode !== $getDOMTextNode(anchorNode, backingAnchorElement, editor) || // If TargetRange is not the same as the DOM selection; browser trying to edit random parts
  // of the editor.
  domSelectionPoints !== null && domTargetRange !== null && (!domTargetRange.collapsed || domTargetRange.startContainer !== domSelectionPoints.anchorNode || domTargetRange.startOffset !== domSelectionPoints.anchorOffset) || // Check if we're changing from bold to italics, or some other format.
  !anchorNode.isComposing() && (anchorNode.getFormat() !== selection.format || anchorNode.getStyle() !== selection.style) || // One last set of heuristics to check against.
  $shouldInsertTextAfterOrBeforeTextNode(selection, anchorNode);
}
function shouldSkipSelectionChange(domNode, offset) {
  return isDOMTextNode(domNode) && domNode.nodeValue !== null && offset !== 0 && offset !== domNode.nodeValue.length;
}
function onSelectionChange(domSelection, editor, isActive) {
  const {
    anchorNode: anchorDOM,
    anchorOffset,
    focusNode: focusDOM,
    focusOffset
  } = getDOMSelectionPoints(domSelection, editor._rootElement);
  const inputState = editor._inputState;
  if (inputState.isSelectionChangeFromDOMUpdate) {
    inputState.isSelectionChangeFromDOMUpdate = false;
    const appliedPoints = inputState.selectionChangeFromDOMUpdatePoints;
    inputState.selectionChangeFromDOMUpdatePoints = null;
    if (shouldSkipSelectionChange(anchorDOM, anchorOffset) && shouldSkipSelectionChange(focusDOM, focusOffset) && !inputState.postDeleteSelectionToRestore && (appliedPoints === null || appliedPoints.anchorNode === anchorDOM && appliedPoints.anchorOffset === anchorOffset && appliedPoints.focusNode === focusDOM && appliedPoints.focusOffset === focusOffset)) {
      return;
    }
  }
  updateEditorSync(editor, () => {
    if (!isActive) {
      $setSelection(null);
      return;
    }
    if (!isSelectionWithinEditor(editor, anchorDOM, focusDOM)) {
      return;
    }
    let selection = $getSelection();
    if (inputState.postDeleteSelectionToRestore && $isRangeSelection(selection) && selection.isCollapsed()) {
      const curAnchor = selection.anchor;
      const prevAnchor = inputState.postDeleteSelectionToRestore.anchor;
      if (
        // Rightward shift in same node
        curAnchor.key === prevAnchor.key && curAnchor.offset === prevAnchor.offset + 1 || // Or rightward shift into sibling node
        curAnchor.offset === 1 && prevAnchor.getNode().is(curAnchor.getNode().getPreviousSibling())
      ) {
        selection = inputState.postDeleteSelectionToRestore.clone();
        $setSelection(selection);
      }
    }
    inputState.postDeleteSelectionToRestore = null;
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      if (selection.isCollapsed()) {
        if (domSelection.type === "Range" && anchorDOM === focusDOM) {
          selection.dirty = true;
        }
        const windowEvent = getWindow(editor).event;
        const currentTimeStamp = windowEvent ? windowEvent.timeStamp : performance.now();
        const {
          format: lastFormat,
          style: lastStyle,
          offset: lastOffset,
          key: lastKey,
          timeStamp
        } = inputState.collapsedSelectionFormat;
        const root = $getRoot();
        const isRootTextContentEmpty = editor.isComposing() === false && root.getTextContent() === "";
        if (currentTimeStamp < timeStamp + 200 && anchor.offset === lastOffset && anchor.key === lastKey) {
          $updateSelectionFormatStyle(selection, lastFormat, lastStyle);
        } else {
          if (anchor.type === "text") {
            if (!$isTextNode(anchorNode)) {
              formatDevErrorMessage(`Point.getNode() must return TextNode when type is text`);
            }
            $updateSelectionFormatStyleFromTextNode(selection, anchorNode);
          } else if (anchor.type === "element" && !isRootTextContentEmpty) {
            if (!$isElementNode(anchorNode)) {
              formatDevErrorMessage(`Point.getNode() must return ElementNode when type is element`);
            }
            const lastNode = anchor.getNode();
            if (
              // This previously applied to all ParagraphNode
              lastNode.isEmpty()
            ) {
              $updateSelectionFormatStyleFromElementNode(selection, lastNode);
            } else {
              $updateSelectionFormatStyle(selection, selection.format, "");
            }
          }
        }
      } else {
        const anchorKey = anchor.key;
        const focus = selection.focus;
        const focusKey = focus.key;
        const nodes = selection.getNodes();
        const nodesLength = nodes.length;
        const isBackward = selection.isBackward();
        const startOffset = isBackward ? focusOffset : anchorOffset;
        const endOffset = isBackward ? anchorOffset : focusOffset;
        const startKey = isBackward ? focusKey : anchorKey;
        const endKey = isBackward ? anchorKey : focusKey;
        let combinedFormat = IS_ALL_FORMATTING;
        let hasTextNodes = false;
        for (let i2 = 0; i2 < nodesLength; i2++) {
          const node = nodes[i2];
          const textContentSize = node.getTextContentSize();
          if ($isTextNode(node) && textContentSize !== 0 && // Exclude empty text nodes at boundaries resulting from user's selection
          !(i2 === 0 && node.__key === startKey && startOffset === textContentSize || i2 === nodesLength - 1 && node.__key === endKey && endOffset === 0)) {
            hasTextNodes = true;
            combinedFormat &= node.getFormat();
            if (combinedFormat === 0) {
              break;
            }
          }
        }
        selection.format = hasTextNodes ? combinedFormat : 0;
      }
    }
    dispatchCommand(editor, SELECTION_CHANGE_COMMAND);
  });
}
function $updateSelectionFormatStyle(selection, format, style) {
  if (selection.format !== format || selection.style !== style) {
    selection.format = format;
    selection.style = style;
    selection.dirty = true;
  }
}
function $updateSelectionFormatStyleFromTextNode(selection, node) {
  const format = node.getFormat();
  const style = node.getStyle();
  $updateSelectionFormatStyle(selection, format, style);
}
function $updateSelectionFormatStyleFromElementNode(selection, node) {
  const format = node.getTextFormat();
  const style = node.getTextStyle();
  $updateSelectionFormatStyle(selection, format, style);
}
function onClick(event, editor) {
  updateEditorSync(editor, () => {
    const selection = $getSelection();
    const domSelection = getDOMSelection(getWindow(editor));
    const lastSelection = $getPreviousSelection();
    if (domSelection) {
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();
        if (anchor.type === "element" && anchor.offset === 0 && selection.isCollapsed() && !$isRootNode(anchorNode) && $getRoot().getChildrenSize() === 1 && anchorNode.getTopLevelElementOrThrow().isEmpty() && lastSelection !== null && selection.is(lastSelection)) {
          domSelection.removeAllRanges();
          selection.dirty = true;
        }
      } else if (event.pointerType === "touch" || event.pointerType === "pen") {
        const domSelectionPoints = getDOMSelectionPoints(domSelection, editor._rootElement);
        const domAnchorNode = domSelectionPoints.anchorNode;
        if (isHTMLElement(domAnchorNode) || isDOMTextNode(domAnchorNode)) {
          const newSelection = $internalCreateRangeSelection(lastSelection, domSelection, editor, event);
          $setSelection(newSelection);
        }
      }
    }
    if (IS_FIREFOX && domSelection !== null && domSelection.rangeCount === 0) {
      const rootElement = editor._rootElement;
      if (rootElement !== null && event.target === rootElement) {
        const clientY = event.clientY;
        let offset = rootElement.childNodes.length;
        for (let i2 = 0; i2 < rootElement.childNodes.length; i2++) {
          const child = rootElement.childNodes[i2];
          if (isHTMLElement(child)) {
            const rect = child.getBoundingClientRect();
            if (clientY <= (rect.top + rect.bottom) / 2) {
              offset = i2;
              break;
            }
          }
        }
        domSelection.setBaseAndExtent(rootElement, offset, rootElement, offset);
        const newSelection = $internalCreateRangeSelection(lastSelection, domSelection, editor, event);
        if (newSelection !== null) {
          $setSelection(newSelection);
        } else {
          domSelection.removeAllRanges();
        }
      }
    }
    dispatchCommand(editor, CLICK_COMMAND, event);
  });
}
function onPointerDown(event, editor) {
  const target = getComposedEventTarget(event);
  const pointerType = event.pointerType;
  if (isDOMNode(target) && pointerType !== "touch" && pointerType !== "pen" && event.button === 0) {
    updateEditorSync(editor, () => {
      if (!isDOMCapturingSelection(target, editor)) {
        editor._inputState.isSelectionChangeFromMouseDown = true;
      }
    });
  }
}
function getTargetRange(event) {
  if (!event.getTargetRanges) {
    return null;
  }
  const targetRanges = event.getTargetRanges();
  if (targetRanges.length === 0) {
    return null;
  }
  return targetRanges[0];
}
function $maybeMoveSelectionPastTrailingAcceptanceBoundary(insertedText) {
  const {
    lastKeyCode
  } = getActiveEditor()._inputState;
  if (insertedText == null || insertedText.length <= 1 || lastKeyCode == null) {
    return;
  }
  const characterToSearchFor = lastKeyCode.length === 1 ? lastKeyCode : lastKeyCode === "Enter" ? "\n" : lastKeyCode === "Tab" ? "	" : null;
  if (!characterToSearchFor) {
    return;
  }
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return;
  }
  const anchorNode = selection.anchor.getNode();
  if (!$isTextNode(anchorNode)) {
    return;
  }
  const {
    offset
  } = selection.anchor;
  if (anchorNode.getTextContentSize() === offset) {
    const nextSibling = anchorNode.getNextSibling();
    if (characterToSearchFor === "\n") {
      if (IS_IOS) {
        return;
      }
      if ($isLineBreakNode(nextSibling)) {
        nextSibling.selectEnd();
      } else if (!nextSibling) {
        const block = $findMatchingParent(anchorNode, $isBlockElementNode);
        const nextBlock = block && block.getNextSibling();
        if ($isElementNode(nextBlock)) {
          nextBlock.selectStart();
        }
      }
    } else if (characterToSearchFor === "	") {
      if ($isTabNode(nextSibling)) {
        nextSibling.selectEnd();
      }
    } else if ($isTextNode(nextSibling) && nextSibling.getTextContent()[0] === characterToSearchFor) {
      nextSibling.select(1, 1);
    }
  } else if (anchorNode.getTextContent()[offset] === characterToSearchFor) {
    anchorNode.select(offset + 1, offset + 1);
  }
}
function $canRemoveText(anchorNode, focusNode) {
  return anchorNode !== focusNode || $isElementNode(anchorNode) || $isElementNode(focusNode) || !$isTokenOrTab(anchorNode) || !$isTokenOrTab(focusNode);
}
function isPossiblyAndroidKeyPress(inputState, timeStamp) {
  return inputState.lastKeyCode === "MediaLast" && timeStamp < inputState.lastKeyDownTimeStamp + ANDROID_COMPOSITION_LATENCY;
}
function clearHandledSelectionCommandInsertText(inputState) {
  inputState.isInsertTextAfterHandledSelectionCommand = false;
  if (inputState.handledSelectionCommandTimeoutId !== null) {
    clearTimeout(inputState.handledSelectionCommandTimeoutId);
    inputState.handledSelectionCommandTimeoutId = null;
  }
}
function markHandledSelectionCommandInsertText(inputState) {
  clearHandledSelectionCommandInsertText(inputState);
  inputState.isInsertTextAfterHandledSelectionCommand = true;
  inputState.handledSelectionCommandTimeoutId = setTimeout(() => clearHandledSelectionCommandInsertText(inputState), 0);
}
function registerDefaultCommandHandlers(editor) {
  editor.registerCommand(BEFORE_INPUT_COMMAND, $handleBeforeInput, COMMAND_PRIORITY_EDITOR);
  editor.registerCommand(INPUT_COMMAND, $handleInput, COMMAND_PRIORITY_EDITOR);
  editor.registerCommand(COMPOSITION_START_COMMAND, $handleCompositionStart, COMMAND_PRIORITY_EDITOR);
  editor.registerCommand(COMPOSITION_END_COMMAND, $handleCompositionEnd, COMMAND_PRIORITY_EDITOR);
  editor.registerCommand(KEY_DOWN_COMMAND, $handleKeyDown, COMMAND_PRIORITY_EDITOR);
}
function isInputEventTargetingCapturedSelection(event, editor) {
  const composedTarget = getComposedEventTarget(event);
  if (isHTMLElement(composedTarget) && isDOMCapturingSelection(composedTarget, editor)) {
    return true;
  }
  const rootElement = editor.getRootElement();
  if (rootElement === null) {
    return false;
  }
  const activeElement = getActiveElementDeep(rootElement.ownerDocument);
  return activeElement !== null && rootElement.contains(activeElement) && isDOMCapturingSelection(activeElement, editor);
}
function onBeforeInput(event, editor) {
  const inputType = event.inputType;
  if (inputType === "deleteCompositionText" || // If we're pasting in FF, we shouldn't get this event
  // as the `paste` event should have triggered, unless the
  // user has dom.event.clipboardevents.enabled disabled in
  // about:config. In that case, we need to process the
  // pasted content in the DOM mutation phase.
  IS_FIREFOX && isFirefoxClipboardEvents(editor)) {
    return;
  } else if (inputType === "insertCompositionText") {
    return;
  }
  updateEditorSync(editor, () => {
    if (!isInputEventTargetingCapturedSelection(event, editor)) {
      dispatchCommand(editor, BEFORE_INPUT_COMMAND, event);
    }
  }, {
    event
  });
}
function $handleBeforeInput(event) {
  const inputType = event.inputType;
  const targetRange = getTargetRange(event);
  const editor = getActiveEditor();
  const inputState = editor._inputState;
  const selection = $getSelection();
  if (inputType === "insertText" && event.data && inputState.isInsertTextAfterHandledSelectionCommand) {
    clearHandledSelectionCommandInsertText(inputState);
    event.preventDefault();
    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
      const point = selection.isBackward() ? selection.anchor : selection.focus;
      selection.anchor.set(point.key, point.offset, point.type);
      selection.focus.set(point.key, point.offset, point.type);
    }
    return true;
  }
  if (inputType === "deleteContentBackward") {
    if (selection === null) {
      const prevSelection = $getPreviousSelection();
      if (!$isRangeSelection(prevSelection)) {
        return true;
      }
      $setSelection(prevSelection.clone());
    }
    if ($isRangeSelection(selection)) {
      const isSelectionAnchorSameAsFocus = selection.anchor.key === selection.focus.key;
      if (isPossiblyAndroidKeyPress(inputState, event.timeStamp) && editor.isComposing() && isSelectionAnchorSameAsFocus) {
        $setCompositionKey(null);
        inputState.lastKeyDownTimeStamp = 0;
        setTimeout(() => {
          updateEditorSync(editor, () => {
            $setCompositionKey(null);
          });
        }, ANDROID_COMPOSITION_LATENCY);
        if ($isRangeSelection(selection)) {
          const anchorNode2 = selection.anchor.getNode();
          anchorNode2.markDirty();
          if (!$isTextNode(anchorNode2)) {
            formatDevErrorMessage(`Anchor node must be a TextNode`);
          }
          $updateSelectionFormatStyleFromTextNode(selection, anchorNode2);
        }
      } else {
        $setCompositionKey(null);
        if (IS_IOS && targetRange !== null && !targetRange.collapsed) {
          selection.applyDOMRange(targetRange);
          if (!selection.isCollapsed()) {
            event.preventDefault();
            selection.removeText();
            return true;
          }
        }
        event.preventDefault();
        const selectedNode = selection.anchor.getNode();
        const selectedNodeText = selectedNode.getTextContent();
        const selectedNodeCanInsertTextAfter = selectedNode.canInsertTextAfter();
        const hasSelectedAllTextInNode = selection.anchor.offset === 0 && selection.focus.offset === selectedNodeText.length;
        let shouldLetBrowserHandleDelete = IS_ANDROID_CHROME && isSelectionAnchorSameAsFocus && !hasSelectedAllTextInNode && selectedNodeCanInsertTextAfter;
        if (shouldLetBrowserHandleDelete && selection.isCollapsed()) {
          shouldLetBrowserHandleDelete = !$isDecoratorNode($getAdjacentNode(selection.anchor, true));
        }
        if (!shouldLetBrowserHandleDelete) {
          dispatchCommand(editor, DELETE_CHARACTER_COMMAND, true);
          const selectionAfterDelete = $getSelection();
          if (IS_ANDROID_CHROME && $isRangeSelection(selectionAfterDelete) && selectionAfterDelete.isCollapsed()) {
            inputState.postDeleteSelectionToRestore = selectionAfterDelete;
            setTimeout(() => inputState.postDeleteSelectionToRestore = null);
          }
        }
      }
      return true;
    }
  }
  if (!$isRangeSelection(selection)) {
    if (inputType === "historyUndo" || inputType === "historyRedo") {
      event.preventDefault();
      dispatchCommand(editor, inputType === "historyUndo" ? UNDO_COMMAND : REDO_COMMAND);
    }
    return true;
  }
  const data = event.data;
  if (inputState.unprocessedBeforeInputData !== null) {
    $updateSelectedTextFromDOM(false, editor, inputState.unprocessedBeforeInputData);
  }
  if ((!selection.dirty || inputState.unprocessedBeforeInputData !== null) && selection.isCollapsed() && !$isRootNode(selection.anchor.getNode()) && targetRange !== null) {
    selection.applyDOMRange(targetRange);
  }
  inputState.unprocessedBeforeInputData = null;
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (inputType === "insertText" || inputType === "insertTranspose") {
    if (data === "\n") {
      event.preventDefault();
      dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
    } else if (data === DOUBLE_LINE_BREAK) {
      event.preventDefault();
      dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
    } else if (data == null && event.dataTransfer) {
      const text = event.dataTransfer.getData("text/plain");
      event.preventDefault();
      selection.insertRawText(text);
    } else if (data != null && $shouldPreventDefaultAndInsertText(selection, targetRange, data, event.timeStamp, true)) {
      event.preventDefault();
      dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, data);
      $maybeMoveSelectionPastTrailingAcceptanceBoundary(data);
    } else {
      inputState.unprocessedBeforeInputData = data;
    }
    inputState.lastBeforeInputInsertTextTimeStamp = event.timeStamp;
    return true;
  }
  event.preventDefault();
  switch (inputType) {
    case "insertFromYank":
    case "insertFromDrop":
    case "insertReplacementText": {
      dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, event);
      const textFromDataTransfer = event.dataTransfer ? event.dataTransfer.getData("text/plain") : null;
      $maybeMoveSelectionPastTrailingAcceptanceBoundary(textFromDataTransfer ?? event.data);
      break;
    }
    case "insertFromComposition": {
      const skipRedundantInsert = inputState.hadOrphanedCompositionEvents;
      inputState.hadOrphanedCompositionEvents = false;
      const prevCompositionKey = editor._compositionKey;
      $setCompositionKey(null);
      if (!skipRedundantInsert) {
        dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, event);
      }
      $cleanupComposedSubclass(prevCompositionKey);
      break;
    }
    case "insertLineBreak": {
      $setCompositionKey(null);
      dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
      break;
    }
    case "insertParagraph": {
      $setCompositionKey(null);
      if (inputState.isInsertLineBreak && !IS_IOS) {
        inputState.isInsertLineBreak = false;
        dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
      } else {
        dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
      }
      break;
    }
    case "insertFromPaste":
    case "insertFromPasteAsQuotation": {
      dispatchCommand(editor, PASTE_COMMAND, event);
      break;
    }
    case "deleteByComposition": {
      if ($canRemoveText(anchorNode, focusNode)) {
        dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
      }
      break;
    }
    case "deleteByDrag": {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
      break;
    }
    case "deleteByCut": {
      dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
      break;
    }
    case "deleteContent": {
      dispatchCommand(editor, DELETE_CHARACTER_COMMAND, false);
      break;
    }
    case "deleteWordBackward": {
      dispatchCommand(editor, DELETE_WORD_COMMAND, true);
      break;
    }
    case "deleteWordForward": {
      dispatchCommand(editor, DELETE_WORD_COMMAND, false);
      break;
    }
    case "deleteHardLineBackward":
    case "deleteSoftLineBackward": {
      dispatchCommand(editor, DELETE_LINE_COMMAND, true);
      break;
    }
    case "deleteContentForward":
    case "deleteHardLineForward":
    case "deleteSoftLineForward": {
      dispatchCommand(editor, DELETE_LINE_COMMAND, false);
      break;
    }
    case "formatStrikeThrough": {
      dispatchCommand(editor, FORMAT_TEXT_COMMAND, "strikethrough");
      break;
    }
    case "formatBold": {
      dispatchCommand(editor, FORMAT_TEXT_COMMAND, "bold");
      break;
    }
    case "formatItalic": {
      dispatchCommand(editor, FORMAT_TEXT_COMMAND, "italic");
      break;
    }
    case "formatUnderline": {
      dispatchCommand(editor, FORMAT_TEXT_COMMAND, "underline");
      break;
    }
    case "historyUndo": {
      dispatchCommand(editor, UNDO_COMMAND);
      break;
    }
    case "historyRedo": {
      dispatchCommand(editor, REDO_COMMAND);
      break;
    }
  }
  return true;
}
function onInput(event, editor) {
  event.stopPropagation();
  const inputState = editor._inputState;
  clearHandledSelectionCommandInsertText(inputState);
  updateEditorSync(editor, () => {
    if (!isInputEventTargetingCapturedSelection(event, editor)) {
      editor.dispatchCommand(INPUT_COMMAND, event);
    }
  }, {
    event
  });
  inputState.unprocessedBeforeInputData = null;
}
function $handleInput(event) {
  const editor = getActiveEditor();
  const inputState = editor._inputState;
  const selection = $getSelection();
  const data = event.data;
  const targetRange = getTargetRange(event);
  let handled = false;
  if (data != null && $isRangeSelection(selection)) {
    const domSelection = getDOMSelection(getWindow(editor));
    const domSelectionPoints = domSelection !== null ? getDOMSelectionPoints(domSelection, editor._rootElement) : null;
    const isOrphanedCompositionEnd = event.inputType === "insertCompositionText" && inputState.compositionPhase !== "ending-firefox" && !editor.isComposing();
    if (isOrphanedCompositionEnd) {
      inputState.hadOrphanedCompositionEvents = true;
    }
    const inputAnchorNode = selection.anchor.getNode();
    const isCompositionOnToken = event.inputType === "insertCompositionText" && inputState.compositionPhase !== "ending-firefox" && editor.isComposing() && $isTextNode(inputAnchorNode) && $isTokenOrSegmented(inputAnchorNode);
    if (!isOrphanedCompositionEnd && !isCompositionOnToken && $shouldPreventDefaultAndInsertText(selection, targetRange, data, event.timeStamp, false, domSelectionPoints)) {
      handled = true;
      if (inputState.compositionPhase === "ending-firefox") {
        const tokenRedirected = $onCompositionEndImpl(editor, data);
        inputState.compositionPhase = "idle";
        if (tokenRedirected) {
          $addUpdateTag(COMPOSITION_END_TAG);
          $flushMutations();
          return true;
        }
      }
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      if (domSelection === null || domSelectionPoints === null) {
        return true;
      }
      const isBackward = selection.isBackward();
      const startOffset = isBackward ? selection.anchor.offset : selection.focus.offset;
      const endOffset = isBackward ? selection.focus.offset : selection.anchor.offset;
      if (!CAN_USE_BEFORE_INPUT || selection.isCollapsed() || !$isTextNode(anchorNode) || domSelectionPoints.anchorNode === null || anchorNode.getTextContent().slice(0, startOffset) + data + anchorNode.getTextContent().slice(startOffset + endOffset) !== getAnchorTextFromDOM(domSelectionPoints.anchorNode)) {
        dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, data);
      }
      const textLength = data.length;
      if (IS_FIREFOX && textLength > 1 && event.inputType === "insertCompositionText" && !editor.isComposing()) {
        selection.anchor.offset -= textLength;
        selection._cachedNodes = null;
        selection._cachedIsBackward = null;
      }
      if (IS_ANDROID_CHROME && editor.isComposing()) {
        inputState.lastKeyDownTimeStamp = 0;
        $setCompositionKey(null);
      }
    }
  }
  if (!handled) {
    const characterData = data !== null ? data : void 0;
    $updateSelectedTextFromDOM(false, editor, characterData);
    if (inputState.compositionPhase === "ending-firefox") {
      $onCompositionEndImpl(editor, data || void 0);
      $addUpdateTag(COMPOSITION_END_TAG);
      inputState.compositionPhase = "idle";
    }
  }
  $flushMutations();
  return true;
}
function onCompositionStart(event, editor) {
  dispatchCommand(editor, COMPOSITION_START_COMMAND, event);
}
function $handleCompositionStart(event) {
  const editor = getActiveEditor();
  const inputState = editor._inputState;
  const selection = $getSelection();
  if ($isRangeSelection(selection) && !editor.isComposing()) {
    inputState.compositionPhase = "composing";
    inputState.hadOrphanedCompositionEvents = false;
    const anchor = selection.anchor;
    const node = selection.anchor.getNode();
    $setCompositionKey(anchor.key);
    $addUpdateTag(COMPOSITION_START_TAG);
    if (
      // If it has been 30ms since the last keydown, then we should
      // apply the empty space heuristic. We can't do this for Safari,
      // as the keydown fires after composition start.
      event.timeStamp < inputState.lastKeyDownTimeStamp + ANDROID_COMPOSITION_LATENCY || // FF has issues around composing multibyte characters, so we also
      // need to invoke the empty space heuristic below.
      anchor.type === "element" || !selection.isCollapsed() || !IS_ANDROID_CHROME && (node.getFormat() !== selection.format || $isTextNode(node) && node.getStyle() !== selection.style) || $isTextNode(node) && ($isTokenOrSegmented(node) || anchor.offset === 0 && !node.canInsertTextBefore() || anchor.offset === node.getTextContentSize() && !node.canInsertTextAfter())
    ) {
      dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, COMPOSITION_START_CHAR);
      const updatedSelection = $getSelection();
      if ($isRangeSelection(updatedSelection)) {
        $setCompositionKey(updatedSelection.anchor.key);
      }
    }
  }
  return true;
}
function $handleCompositionEnd(event) {
  const editor = getActiveEditor();
  editor._inputState.compositionPhase = "idle";
  $onCompositionEndImpl(editor, event.data);
  $addUpdateTag(COMPOSITION_END_TAG);
  return true;
}
function $cleanupComposedSubclass(compositionKey) {
  if (compositionKey === null) {
    return;
  }
  const composedNode = $getNodeByKey(compositionKey);
  if (!$isTextNode(composedNode) || composedNode.getType() === "text" || $isTokenOrSegmented(composedNode) || !composedNode.isAttached()) {
    return;
  }
  const sel3 = $getSelection();
  const offset = $isRangeSelection(sel3) && sel3.anchor.key === compositionKey ? sel3.anchor.offset : null;
  const replacement = $createTextNode(composedNode.getTextContent());
  replacement.setFormat(composedNode.getFormat());
  replacement.setStyle(composedNode.getStyle());
  composedNode.replace(replacement);
  if (offset !== null) {
    const safeOffset = Math.min(offset, replacement.getTextContentSize());
    replacement.select(safeOffset, safeOffset);
  }
}
function $onCompositionEndImpl(editor, data) {
  const compositionKey = editor._compositionKey;
  $setCompositionKey(null);
  if (compositionKey !== null && data != null) {
    if (data === "") {
      const node2 = $getNodeByKey(compositionKey);
      const domElement = editor.getElementByKey(compositionKey);
      const textNode = domElement !== null && $isTextNode(node2) ? $getDOMTextNode(node2, domElement, editor) : null;
      if (textNode !== null && textNode.nodeValue !== null && $isTextNode(node2)) {
        const domSelection = getDOMSelection(getWindow(editor));
        const domSelectionPoints = domSelection && getDOMSelectionPoints(domSelection, editor._rootElement);
        let anchorOffset = null;
        let focusOffset = null;
        if (domSelectionPoints !== null && domSelectionPoints.anchorNode === textNode) {
          anchorOffset = domSelectionPoints.anchorOffset;
          focusOffset = domSelectionPoints.focusOffset;
        }
        $updateTextNodeFromDOMContent(node2, textNode.nodeValue, anchorOffset, focusOffset, true);
      }
      $cleanupComposedSubclass(compositionKey);
      return false;
    } else if (data[data.length - 1] === "\n") {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
        if ($isRangeSelection(selection)) {
          const focus = selection.focus;
          selection.anchor.set(focus.key, focus.offset, focus.type);
        }
        dispatchCommand(editor, KEY_ENTER_COMMAND, null);
        $cleanupComposedSubclass(compositionKey);
        return false;
      }
    }
    const node = $getNodeByKey(compositionKey);
    if (node !== null && $isTextNode(node) && $isTokenOrSegmented(node)) {
      node.markDirty();
      const selection = $getSelection();
      const textLen = node.getTextContentSize();
      const offset = $isRangeSelection(selection) && selection.anchor.key === compositionKey ? selection.anchor.offset : textLen;
      node.select(offset, offset).insertText(data);
      return true;
    }
  }
  $updateSelectedTextFromDOM(true, editor, data);
  $cleanupComposedSubclass(compositionKey);
  return false;
}
function onCompositionEnd(event, editor) {
  const inputState = editor._inputState;
  if (IS_FIREFOX) {
    inputState.compositionPhase = "ending-firefox";
  } else if (!IS_IOS && (IS_SAFARI || IS_APPLE_WEBKIT)) {
    inputState.compositionPhase = "ending-safari";
    inputState.compositionEndData = event.data;
  } else {
    dispatchCommand(editor, COMPOSITION_END_COMMAND, event);
  }
}
function onKeyDown(event, editor) {
  const inputState = editor._inputState;
  inputState.lastKeyDownTimeStamp = event.timeStamp;
  inputState.lastKeyCode = event.key;
  if (event.key !== "Backspace") {
    clearHandledSelectionCommandInsertText(inputState);
  }
  if (editor.isComposing()) {
    return;
  }
  dispatchCommand(editor, KEY_DOWN_COMMAND, event);
}
var ANY_MODIFIERS = {
  altKey: "any",
  ctrlKey: "any",
  metaKey: "any",
  shiftKey: "any"
};
var CTRL_KEY = {
  ctrlKey: true
};
var META_KEY = {
  metaKey: true
};
var SHIFT_KEY_ANY = {
  shiftKey: "any"
};
var ALT_SHIFT_KEY_ANY = {
  ...SHIFT_KEY_ANY,
  altKey: "any"
};
function buildKeyDownShortcuts() {
  const dispatch = (key, modifiers, command) => ({
    key,
    modifiers,
    onMatch: (event, editor) => {
      dispatchCommand(editor, command, event);
    }
  });
  const prevent = (key, modifiers, command, payload) => ({
    key,
    modifiers,
    onMatch: (event, editor) => {
      event.preventDefault();
      dispatchCommand(editor, command, payload);
    }
  });
  const enter = (modifiers, isInsertLineBreak) => ({
    key: "Enter",
    modifiers,
    onMatch: (event, editor) => {
      editor._inputState.isInsertLineBreak = isInsertLineBreak;
      dispatchCommand(editor, KEY_ENTER_COMMAND, event);
    }
  });
  const copyOrCut = (key, command) => ({
    key,
    modifiers: CONTROL_OR_META,
    onMatch: (event, editor) => {
      const prevSelection = editor._editorState._selection;
      if (prevSelection !== null && !$isRangeSelection(prevSelection)) {
        event.preventDefault();
        dispatchCommand(editor, command, event);
      }
    }
  });
  return [
    // moveForward / moveToEnd / moveBackward / moveToStart / moveUp / moveDown
    dispatch("ArrowRight", SHIFT_KEY_ANY, KEY_ARROW_RIGHT_COMMAND),
    dispatch("ArrowLeft", SHIFT_KEY_ANY, KEY_ARROW_LEFT_COMMAND),
    dispatch("ArrowUp", ALT_SHIFT_KEY_ANY, KEY_ARROW_UP_COMMAND),
    dispatch("ArrowDown", ALT_SHIFT_KEY_ANY, KEY_ARROW_DOWN_COMMAND),
    // lineBreak / paragraph
    enter({
      ...ANY_MODIFIERS,
      shiftKey: true
    }, true),
    enter({
      ...ANY_MODIFIERS,
      shiftKey: false
    }, false),
    dispatch(" ", ANY_MODIFIERS, KEY_SPACE_COMMAND),
    // deleteBackward
    {
      key: "Backspace",
      modifiers: SHIFT_KEY_ANY,
      onMatch: (event, editor) => {
        if (dispatchCommand(editor, KEY_BACKSPACE_COMMAND, event)) {
          markHandledSelectionCommandInsertText(editor._inputState);
        }
      }
    },
    dispatch("Escape", ANY_MODIFIERS, KEY_ESCAPE_COMMAND),
    // deleteForward
    dispatch("Delete", {}, KEY_DELETE_COMMAND),
    // deleteWordBackward / deleteWordForward
    prevent("Backspace", CONTROL_OR_ALT, DELETE_WORD_COMMAND, true),
    prevent("Delete", CONTROL_OR_ALT, DELETE_WORD_COMMAND, false),
    prevent("b", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "bold"),
    prevent("u", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "underline"),
    prevent("i", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "italic"),
    dispatch("Tab", SHIFT_KEY_ANY, KEY_TAB_COMMAND),
    // undo / redo
    prevent("z", CONTROL_OR_META, UNDO_COMMAND, void 0),
    prevent("z", {
      ...CONTROL_OR_META,
      shiftKey: true
    }, REDO_COMMAND, void 0),
    ...IS_APPLE ? [
      // openLineBreak
      {
        key: "o",
        modifiers: CTRL_KEY,
        onMatch: (event, editor) => {
          event.preventDefault();
          editor._inputState.isInsertLineBreak = true;
          dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, true);
        }
      },
      // moveToStart / moveToEnd mac
      dispatch("ArrowLeft", {
        metaKey: true,
        ...SHIFT_KEY_ANY
      }, MOVE_TO_START),
      dispatch("ArrowRight", {
        metaKey: true,
        ...SHIFT_KEY_ANY
      }, MOVE_TO_END),
      // deleteBackward / deleteForward
      prevent("h", CTRL_KEY, DELETE_CHARACTER_COMMAND, true),
      prevent("d", CTRL_KEY, DELETE_CHARACTER_COMMAND, false),
      // deleteLineBackward / deleteLineForward
      prevent("Backspace", META_KEY, DELETE_LINE_COMMAND, true),
      prevent("Delete", META_KEY, DELETE_LINE_COMMAND, false),
      prevent("k", CTRL_KEY, DELETE_LINE_COMMAND, false)
    ] : [dispatch("Home", SHIFT_KEY_ANY, MOVE_TO_START), dispatch("End", SHIFT_KEY_ANY, MOVE_TO_END), prevent("y", CTRL_KEY, REDO_COMMAND, void 0)],
    // selectAll
    {
      key: "a",
      modifiers: CONTROL_OR_META,
      onMatch: (event, editor) => {
        event.preventDefault();
        if (dispatchCommand(editor, SELECT_ALL_COMMAND, event)) {
          markHandledSelectionCommandInsertText(editor._inputState);
        }
      }
    },
    copyOrCut("c", COPY_COMMAND),
    copyOrCut("x", CUT_COMMAND)
  ];
}
function $handleKeyDown(event) {
  const editor = getActiveEditor();
  const inputState = editor._inputState;
  if (event.key == null) {
    return true;
  }
  if (inputState.compositionPhase === "ending-safari") {
    const isBack = isBackspace(event);
    if (isBack) {
      updateEditorSync(editor, () => {
        $onCompositionEndImpl(editor, inputState.compositionEndData);
      });
    }
    inputState.compositionPhase = "idle";
    inputState.compositionEndData = "";
    if (isBack) {
      return true;
    }
  }
  let keyDownShortcuts = editor._keyDownShortcuts;
  if (keyDownShortcuts === null) {
    keyDownShortcuts = compileKeyboardShortcuts(buildKeyDownShortcuts());
    editor._keyDownShortcuts = keyDownShortcuts;
  }
  const shortcut = keyDownShortcuts.match(event);
  if (shortcut) {
    shortcut.onMatch(event, editor);
  }
  if (isModifier(event)) {
    editor.dispatchCommand(KEY_MODIFIER_COMMAND, event);
  }
  return true;
}
function getRootElementRemoveHandles(rootElement) {
  let eventHandles = rootElement.__lexicalEventHandles;
  if (eventHandles === void 0) {
    eventHandles = [];
    rootElement.__lexicalEventHandles = eventHandles;
  }
  return eventHandles;
}
var activeNestedEditorsMap = /* @__PURE__ */ new Map();
function onDocumentSelectionChange(event) {
  const domSelection = getDOMSelectionFromTarget(event.target);
  if (domSelection === null) {
    return;
  }
  const ownerDocument = getDOMOwnerDocument(event.target);
  let nextActiveEditor = null;
  let resolvedAnchorNode = null;
  const registration = ownerDocument !== null ? documentRegistrations.get(ownerDocument) : void 0;
  if (ownerDocument !== null) {
    if (registration !== void 0) {
      const editorsForDoc = registration.editors;
      let hasShadow = registration.hasShadowEditor;
      if (hasShadow === void 0) {
        hasShadow = false;
        for (const ed of editorsForDoc) {
          if (ed._rootElement !== null && isDOMShadowRoot(ed._rootElement.getRootNode())) {
            hasShadow = true;
            break;
          }
        }
        registration.hasShadowEditor = hasShadow;
      }
      if (!hasShadow) {
        const anchorNode = domSelection.anchorNode;
        if (anchorNode !== null && !(isHTMLElement(anchorNode) && anchorNode.shadowRoot !== null)) {
          nextActiveEditor = getNearestEditorFromDOMNode(anchorNode);
          if (nextActiveEditor !== null) {
            resolvedAnchorNode = anchorNode;
          }
        }
      } else {
        let deferredLightEditor = null;
        let deferredLightAnchor = null;
        for (const candidate of editorsForDoc) {
          const candidateRoot = candidate._rootElement;
          if (candidateRoot === null) {
            continue;
          }
          const anchorNode = getDOMSelectionPoints(domSelection, candidateRoot).anchorNode;
          if (anchorNode === null) {
            continue;
          }
          if (getNearestEditorFromDOMNode(anchorNode) !== candidate) {
            continue;
          }
          if (isDOMShadowRoot(candidateRoot.getRootNode())) {
            nextActiveEditor = candidate;
            resolvedAnchorNode = anchorNode;
            break;
          }
          if (deferredLightEditor === null) {
            deferredLightEditor = candidate;
            deferredLightAnchor = anchorNode;
          }
        }
        if (nextActiveEditor === null && deferredLightEditor !== null) {
          nextActiveEditor = deferredLightEditor;
          resolvedAnchorNode = deferredLightAnchor;
        }
      }
    }
    if (nextActiveEditor === null) {
      const activeElement = getActiveElementDeep(ownerDocument);
      nextActiveEditor = activeElement !== null ? getNearestEditorFromDOMNode(activeElement) : null;
    }
  }
  if (nextActiveEditor === null) {
    return;
  }
  if (nextActiveEditor._inputState.isSelectionChangeFromMouseDown) {
    if (registration !== void 0) {
      for (const ed of registration.editors) {
        ed._inputState.isSelectionChangeFromMouseDown = false;
      }
    }
    updateEditorSync(nextActiveEditor, () => {
      const lastSelection = $getPreviousSelection();
      const domAnchorNode = resolvedAnchorNode ?? getDOMSelectionPoints(domSelection, nextActiveEditor._rootElement).anchorNode;
      if (isHTMLElement(domAnchorNode) || isDOMTextNode(domAnchorNode)) {
        const newSelection = $internalCreateRangeSelection(lastSelection, domSelection, nextActiveEditor, event);
        $setSelection(newSelection);
      }
    });
  }
  const editors = getEditorsToPropagate(nextActiveEditor);
  const rootEditor = editors[editors.length - 1];
  const rootEditorKey = rootEditor._key;
  const activeNestedEditor = activeNestedEditorsMap.get(rootEditorKey);
  const prevActiveEditor = activeNestedEditor || rootEditor;
  if (prevActiveEditor !== nextActiveEditor) {
    onSelectionChange(domSelection, prevActiveEditor, false);
  }
  onSelectionChange(domSelection, nextActiveEditor, true);
  if (nextActiveEditor !== rootEditor) {
    activeNestedEditorsMap.set(rootEditorKey, nextActiveEditor);
  } else if (activeNestedEditor) {
    activeNestedEditorsMap.delete(rootEditorKey);
  }
}
function stopLexicalPropagation(event) {
  event._lexicalHandled = true;
}
function hasStoppedLexicalPropagation(event) {
  const stopped = event._lexicalHandled === true;
  return stopped;
}
function addRootElementEvents(rootElement, editor) {
  const doc = rootElement.ownerDocument;
  rootElementToDocument.set(rootElement, doc);
  let registration = documentRegistrations.get(doc);
  if (registration === void 0) {
    registration = {
      editors: /* @__PURE__ */ new Set(),
      hasShadowEditor: void 0
    };
    documentRegistrations.set(doc, registration);
  }
  registration.editors.add(editor);
  registration.hasShadowEditor = void 0;
  rootElement.__lexicalEditor = editor;
  const removeHandles = getRootElementRemoveHandles(rootElement);
  removeHandles.push(documentSelectionChange.register(doc));
  for (let i2 = 0; i2 < rootElementEvents.length; i2++) {
    const [eventName, onEvent] = rootElementEvents[i2];
    const eventHandler = typeof onEvent === "function" ? (event) => {
      if (hasStoppedLexicalPropagation(event)) {
        return;
      }
      stopLexicalPropagation(event);
      if (editor.isEditable() || eventName === "click") {
        onEvent(event, editor);
      }
    } : (event) => {
      if (hasStoppedLexicalPropagation(event)) {
        return;
      }
      stopLexicalPropagation(event);
      const isEditable = editor.isEditable();
      switch (eventName) {
        case "cut":
          return isEditable && dispatchCommand(editor, CUT_COMMAND, event);
        case "copy":
          return dispatchCommand(editor, COPY_COMMAND, event);
        case "paste":
          return isEditable && dispatchCommand(editor, PASTE_COMMAND, event);
        case "dragstart":
          return isEditable && dispatchCommand(editor, DRAGSTART_COMMAND, event);
        case "dragover":
          return isEditable && dispatchCommand(editor, DRAGOVER_COMMAND, event);
        case "dragend":
          return isEditable && dispatchCommand(editor, DRAGEND_COMMAND, event);
        case "focus":
          return isEditable && dispatchCommand(editor, FOCUS_COMMAND, event);
        case "blur": {
          return isEditable && dispatchCommand(editor, BLUR_COMMAND, event);
        }
        case "drop":
          return isEditable && dispatchCommand(editor, DROP_COMMAND, event);
      }
    };
    removeHandles.push(registerEventListener(rootElement, eventName, eventHandler));
  }
}
var rootElementNotRegisteredWarning = warnOnlyOnce("Root element not registered");
function removeRootElementEvents(rootElement) {
  const doc = rootElementToDocument.get(rootElement);
  if (doc === void 0) {
    rootElementNotRegisteredWarning();
    return;
  }
  const registration = documentRegistrations.get(doc);
  if (registration === void 0) {
    rootElementNotRegisteredWarning();
    return;
  }
  rootElementToDocument.delete(rootElement);
  const editor = getEditorPropertyFromDOMNode(rootElement);
  if (isLexicalEditor(editor)) {
    cleanActiveNestedEditorsMap(editor);
    registration.editors.delete(editor);
    registration.hasShadowEditor = void 0;
    rootElement.__lexicalEditor = null;
  } else if (editor) {
    {
      formatDevErrorMessage(`Attempted to remove event handlers from a node that does not belong to this build of Lexical`);
    }
  }
  const removeHandles = getRootElementRemoveHandles(rootElement);
  for (let i2 = 0; i2 < removeHandles.length; i2++) {
    removeHandles[i2]();
  }
  rootElement.__lexicalEventHandles = [];
}
function cleanActiveNestedEditorsMap(editor) {
  if (editor._parentEditor !== null) {
    const editors = getEditorsToPropagate(editor);
    const rootEditor = editors[editors.length - 1];
    const rootEditorKey = rootEditor._key;
    if (activeNestedEditorsMap.get(rootEditorKey) === editor) {
      activeNestedEditorsMap.delete(rootEditorKey);
    }
  } else {
    activeNestedEditorsMap.delete(editor._key);
  }
}
function markSelectionChangeFromDOMUpdate(editor, anchorNode, anchorOffset, focusNode, focusOffset) {
  const inputState = editor._inputState;
  inputState.isSelectionChangeFromDOMUpdate = true;
  inputState.selectionChangeFromDOMUpdatePoints = anchorNode !== void 0 && anchorOffset !== void 0 && focusNode !== void 0 && focusOffset !== void 0 ? {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset
  } : null;
}
function markCollapsedSelectionFormat(editor, format, style, offset, key, timeStamp) {
  editor._inputState.collapsedSelectionFormat = {
    format,
    key,
    offset,
    style,
    timeStamp
  };
}
function $removeNode(nodeToRemove, restoreSelection, preserveEmptyParent) {
  errorOnReadOnly();
  const key = nodeToRemove.__key;
  const parent = nodeToRemove.getParent();
  if (parent === null) {
    if (!($getSlotHostKey(nodeToRemove) === null)) {
      formatDevErrorMessage(`$removeNode: node ${key} is slotted into host ${String($getSlotHostKey(nodeToRemove))}; use removeSlot on the host instead of remove().`);
    }
    return;
  }
  const selection = $maybeMoveChildrenSelectionToParent(nodeToRemove);
  let selectionMoved = false;
  if ($isRangeSelection(selection) && restoreSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    if (anchor.key === key) {
      moveSelectionPointToSibling(anchor, nodeToRemove, parent, nodeToRemove.getPreviousSibling(), nodeToRemove.getNextSibling());
      selectionMoved = true;
    }
    if (focus.key === key) {
      moveSelectionPointToSibling(focus, nodeToRemove, parent, nodeToRemove.getPreviousSibling(), nodeToRemove.getNextSibling());
      selectionMoved = true;
    }
  } else if ($isNodeSelection(selection) && restoreSelection && nodeToRemove.isSelected()) {
    nodeToRemove.selectPrevious();
  }
  if ($isRangeSelection(selection) && restoreSelection && !selectionMoved && // getIndexWithinParent is O(n) in the parent's child count, so skip it
  // unless the update below can observe the index (#5194).
  $selectionTouchesElement(selection, parent)) {
    const index = nodeToRemove.getIndexWithinParent();
    $removeFromParent(nodeToRemove);
    $updateElementSelectionOnCreateDeleteNode(selection, parent, index, -1);
  } else {
    $removeFromParent(nodeToRemove);
  }
  if (!preserveEmptyParent && !$isRootOrShadowRoot(parent) && !parent.canBeEmpty() && parent.isEmpty()) {
    $removeNode(parent, restoreSelection);
  }
  if (restoreSelection && selection && $isRootNode(parent) && parent.isEmpty()) {
    parent.selectEnd();
  }
}
function buildImportMap(importMap) {
  return importMap;
}
var EPHEMERAL = /* @__PURE__ */ Symbol.for("ephemeral");
function $isEphemeral(node) {
  return node[EPHEMERAL] || false;
}
function $markEphemeral(node) {
  node[EPHEMERAL] = true;
  return node;
}
var NON_ENUMERABLE_PROP_DESC = {
  configurable: true,
  enumerable: false,
  value: void 0,
  writable: true
};
var LexicalNode = class {
  /** @internal Allow us to look up the type including static props */
  /** @internal */
  // `__type` is assigned once, in the constructor, and is never valid to
  // mutate afterward.
  __type;
  /** @internal */
  //@ts-ignore We set the key in the constructor.
  __key;
  /** @internal */
  __parent;
  /** @internal */
  __prev;
  /** @internal */
  __next;
  /** @internal */
  __state;
  /** @internal */
  [CACHED_TEXT_SIZE_KEY];
  // Flow doesn't support abstract classes unfortunately, so we can't _force_
  // subclasses of Node to implement statics. All subclasses of Node should have
  // a static getType and clone method though. We define getType and clone here so we can call it
  // on any  Node, and we throw this error by default since the subclass should provide
  // their own implementation.
  /**
   * Returns the string type of this node. Every node must
   * implement this and it MUST BE UNIQUE amongst nodes registered
   * on the editor.
   *
   */
  static getType() {
    const {
      ownNodeType
    } = getStaticNodeConfig(this);
    if (!(ownNodeType !== void 0)) {
      formatDevErrorMessage(`LexicalNode: Node ${this.name} does not implement .getType().`);
    }
    return ownNodeType;
  }
  /**
   * Clones this node, creating a new node with a different key
   * and adding it to the EditorState (but not attaching it anywhere!). All nodes must
   * implement this method.
   *
   */
  static clone(_data) {
    {
      formatDevErrorMessage(`LexicalNode: Node ${this.name} does not implement .clone().`);
    }
  }
  /**
   * Override this to implement the new static node configuration protocol,
   * this method is called directly on the prototype and must not depend
   * on anything initialized in the constructor. Generally it should be
   * a trivial implementation.
   *
   * @example
   * ```ts
   * class MyNode extends TextNode {
   *   $config() {
   *     return this.config('my-node', {extends: TextNode});
   *   }
   * }
   * ```
   */
  $config() {
    return {};
  }
  /**
   * This is a convenience method for $config that
   * aids in type inference. See {@link LexicalNode.$config}
   * for example usage.
   *
   * An abstract base class that has no concrete node `type` may pass a
   * well-known symbol (by convention `Symbol.for(<NodeClassName>)`) instead of
   * a string `type` to declare configuration shared with its subclasses.
   */
  config(type, config) {
    const parentKlass = config.extends || getSuperclassOf(this.constructor);
    Object.assign(config, {
      extends: parentKlass
    });
    if (typeof type === "string") {
      Object.assign(config, {
        type
      });
    }
    return {
      [type]: config
    };
  }
  /**
   * Perform any state updates on the clone of prevNode that are not already
   * handled by the constructor call in the static clone method. If you have
   * state to update in your clone that is not handled directly by the
   * constructor, it is advisable to override this method but it is required
   * to include a call to `super.afterCloneFrom(prevNode)` in your
   * implementation. This is only intended to be called by
   * {@link $cloneWithProperties} function or via a super call.
   *
   * @example
   * ```ts
   * class ClassesTextNode extends TextNode {
   *   // Not shown: static getType, static importJSON, exportJSON, createDOM, updateDOM
   *   __classes = new Set<string>();
   *   static clone(node: ClassesTextNode): ClassesTextNode {
   *     // The inherited TextNode constructor is used here, so
   *     // classes is not set by this method.
   *     return new ClassesTextNode(node.__text, node.__key);
   *   }
   *   afterCloneFrom(node: this): void {
   *     // This calls TextNode.afterCloneFrom and LexicalNode.afterCloneFrom
   *     // for necessary state updates
   *     super.afterCloneFrom(node);
   *     this.__addClasses(node.__classes);
   *   }
   *   // This method is a private implementation detail, it is not
   *   // suitable for the public API because it does not call getWritable
   *   __addClasses(classNames: Iterable<string>): this {
   *     for (const className of classNames) {
   *       this.__classes.add(className);
   *     }
   *     return this;
   *   }
   *   addClass(...classNames: string[]): this {
   *     return this.getWritable().__addClasses(classNames);
   *   }
   *   removeClass(...classNames: string[]): this {
   *     const node = this.getWritable();
   *     for (const className of classNames) {
   *       this.__classes.delete(className);
   *     }
   *     return this;
   *   }
   *   getClasses(): Set<string> {
   *     return this.getLatest().__classes;
   *   }
   * }
   * ```
   *
   */
  afterCloneFrom(prevNode) {
    if (this.__key === prevNode.__key) {
      this.__parent = prevNode.__parent;
      this.__next = prevNode.__next;
      this.__prev = prevNode.__prev;
      this.__state = prevNode.__state;
    } else if (prevNode.__state) {
      this.__state = prevNode.__state.getWritable(this);
    }
  }
  /**
   * Reset state in this copy of originalNode, if necessary
   *
   * @param originalNode
   */
  resetOnCopyNodeFrom(originalNode) {
    if (this.__state) {
      this.__state = this.__state.getWritable(this).resetOnCopyNode();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static importDOM;
  constructor(key) {
    this.__type = this.constructor.getType();
    this.__parent = null;
    this.__prev = null;
    this.__next = null;
    Object.defineProperty(this, "__state", NON_ENUMERABLE_PROP_DESC);
    Object.defineProperty(this, CACHED_TEXT_SIZE_KEY, NON_ENUMERABLE_PROP_DESC);
    $setNodeKey(this, key);
    {
      if (this.__type !== "root") {
        errorOnTypeKlassMismatch(this.__type, this.constructor);
      }
    }
  }
  // Getters and Traversers
  /**
   * Returns the string type of this node.
   */
  getType() {
    return this.__type;
  }
  isInline() {
    {
      formatDevErrorMessage(`LexicalNode: Node ${this.constructor.name} does not implement .isInline().`);
    }
  }
  /**
   * Returns true if there is a path between this node and the RootNode, false otherwise.
   * This is a way of determining if the node is "attached" EditorState. Unattached nodes
   * won't be reconciled and will ultimately be cleaned up by the Lexical GC.
   */
  isAttached() {
    let nodeKey = this.__key;
    while (nodeKey !== null) {
      if (nodeKey === "root") {
        return true;
      }
      const node = $getNodeByKey(nodeKey);
      if (node === null) {
        break;
      }
      nodeKey = node.__parent !== null ? node.__parent : $getSlotHostKey(node);
    }
    return false;
  }
  /**
   * Returns true if this node is contained within the provided Selection., false otherwise.
   * Relies on the algorithms implemented in {@link BaseSelection.getNodes} to determine
   * what's included.
   *
   * @param selection - The selection that we want to determine if the node is in.
   */
  isSelected(selection) {
    const targetSelection = selection || $getSelection();
    if (targetSelection == null) {
      return false;
    }
    const isSelected = targetSelection.getNodes().some((n2) => n2.__key === this.__key);
    if ($isTextNode(this)) {
      return isSelected;
    }
    const isElementRangeSelection = $isRangeSelection(targetSelection) && targetSelection.anchor.type === "element" && targetSelection.focus.type === "element";
    if (isElementRangeSelection) {
      if (targetSelection.isCollapsed()) {
        return false;
      }
      const parentNode = this.getParent();
      if ($isDecoratorNode(this) && this.isInline() && parentNode) {
        const firstPoint = targetSelection.isBackward() ? targetSelection.focus : targetSelection.anchor;
        if (parentNode.is(firstPoint.getNode()) && firstPoint.offset === parentNode.getChildrenSize() && this.is(parentNode.getLastChild())) {
          return false;
        }
      }
    }
    return isSelected;
  }
  /**
   * Returns this nodes key.
   */
  getKey() {
    return this.__key;
  }
  /**
   * Returns the zero-based index of this node within the parent.
   */
  getIndexWithinParent() {
    const parent = this.getParent();
    if (parent === null) {
      return -1;
    }
    let node = parent.getFirstChild();
    let index = 0;
    while (node !== null) {
      if (this.is(node)) {
        return index;
      }
      index++;
      node = node.getNextSibling();
    }
    return -1;
  }
  /**
   * Returns the parent of this node, or null if none is found.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getParent() as T | null`, and will be removed
   * in a future release. Call this method without a type argument and
   * narrow the result with a type guard instead.
   */
  getParent() {
    const parent = this.getLatest().__parent;
    if (parent === null) {
      return null;
    }
    return $getNodeByKey(parent);
  }
  /**
   * Returns the parent of this node, or throws if none is found.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getParentOrThrow() as T`, and will be removed
   * in a future release. Call this method without a type argument and
   * narrow the result with a type guard instead.
   */
  getParentOrThrow() {
    const parent = this.getParent();
    if (parent === null) {
      {
        formatDevErrorMessage(`Expected node ${this.__key} to have a parent.`);
      }
    }
    return parent;
  }
  /**
   * Returns the highest (in the EditorState tree)
   * non-root ancestor of this node, or null if none is found. See {@link lexical!$isRootOrShadowRoot}
   * for more information on which Elements comprise "roots".
   */
  getTopLevelElement() {
    let node = this;
    while (node !== null) {
      const parent = node.getParent();
      if ($isRootOrShadowRoot(parent) || $getSlotHostKey(node) !== null) {
        if (!($isElementNode(node) || node === this && $isDecoratorNode(node))) {
          formatDevErrorMessage(`Children of root nodes must be elements or decorators`);
        }
        return node;
      }
      node = parent;
    }
    return null;
  }
  /**
   * Returns the highest (in the EditorState tree)
   * non-root ancestor of this node, or throws if none is found. See {@link lexical!$isRootOrShadowRoot}
   * for more information on which Elements comprise "roots".
   */
  getTopLevelElementOrThrow() {
    const parent = this.getTopLevelElement();
    if (parent === null) {
      {
        formatDevErrorMessage(`Expected node ${this.__key} to have a top parent element.`);
      }
    }
    return parent;
  }
  /**
   * Returns a list of the every ancestor of this node,
   * all the way up to the RootNode.
   *
   */
  getParents() {
    const parents = [];
    let node = this.getParent();
    while (node !== null) {
      parents.push(node);
      node = node.getParent();
    }
    return parents;
  }
  /**
   * Returns a list of the keys of every ancestor of this node,
   * all the way up to the RootNode.
   *
   */
  getParentKeys() {
    const parents = [];
    let node = this.getParent();
    while (node !== null) {
      parents.push(node.__key);
      node = node.getParent();
    }
    return parents;
  }
  /**
   * Returns the node before this one in the same parent, or null
   * if there is no such node.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getPreviousSibling() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getPreviousSibling() {
    const self = this.getLatest();
    const prevKey = self.__prev;
    return prevKey === null ? null : $getNodeByKey(prevKey);
  }
  /**
   * Returns all nodes before this one in the same parent,
   * in document order.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getPreviousSiblings() as T[]`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the results with a type guard instead.
   */
  getPreviousSiblings() {
    const siblings = [];
    const parent = this.getParent();
    if (parent === null) {
      return siblings;
    }
    let node = parent.getFirstChild();
    while (node !== null) {
      if (node.is(this)) {
        break;
      }
      siblings.push(node);
      node = node.getNextSibling();
    }
    return siblings;
  }
  /**
   * Returns the node after this one in the same parent, or null
   * if there is no such node.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getNextSibling() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getNextSibling() {
    const self = this.getLatest();
    const nextKey = self.__next;
    return nextKey === null ? null : $getNodeByKey(nextKey);
  }
  /**
   * Returns all nodes after this one in the same parent,
   * in document order.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `node.getNextSiblings() as T[]`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the results with a type guard instead.
   */
  getNextSiblings() {
    const siblings = [];
    let node = this.getNextSibling();
    while (node !== null) {
      siblings.push(node);
      node = node.getNextSibling();
    }
    return siblings;
  }
  /**
   * @deprecated use {@link $getCommonAncestor}
   *
   * Returns the closest common ancestor of this node and the provided one or null
   * if one cannot be found.
   *
   * @param node - the other node to find the common ancestor of.
   */
  getCommonAncestor(node) {
    const a2 = $isElementNode(this) ? this : this.getParent();
    const b2 = $isElementNode(node) ? node : node.getParent();
    const result = a2 && b2 ? $getCommonAncestor(a2, b2) : null;
    return result ? result.commonAncestor : null;
  }
  /**
   * Returns true if the provided node is the exact same one as this node, from Lexical's perspective.
   * Always use this instead of referential equality.
   *
   * @param object - the node to perform the equality comparison on.
   */
  is(object) {
    if (object == null) {
      return false;
    }
    return this.__key === object.__key;
  }
  /**
   * Returns true if this node logically precedes the target node in the
   * editor state, false otherwise (including if there is no common ancestor).
   *
   * Note that this notion of isBefore is based on post-order; a descendant
   * node is always before its ancestors. See also
   * {@link $getCommonAncestor} and {@link $comparePointCaretNext} for
   * more flexible ways to determine the relative positions of nodes.
   *
   * @param targetNode - the node we're testing to see if it's after this one.
   */
  isBefore(targetNode) {
    const compare = $getCommonAncestor(this, targetNode);
    if (compare === null) {
      return false;
    }
    if (compare.type === "descendant") {
      return true;
    }
    if (compare.type === "branch") {
      return $getCommonAncestorResultBranchOrder(compare) === -1;
    }
    if (!(compare.type === "same" || compare.type === "ancestor")) {
      formatDevErrorMessage(`LexicalNode.isBefore: exhaustiveness check`);
    }
    return false;
  }
  /**
   * Returns true if this node is an ancestor of and distinct from the target node, false otherwise.
   *
   * @param targetNode - the would-be child node.
   */
  isParentOf(targetNode) {
    return $hasAncestor(targetNode, this);
  }
  // TO-DO: this function can be simplified a lot
  /**
   * Returns a list of nodes that are between this node and
   * the target node in the EditorState.
   *
   * @param targetNode - the node that marks the other end of the range of nodes to be returned.
   */
  getNodesBetween(targetNode) {
    const isBefore = this.isBefore(targetNode);
    const nodes = [];
    const visited = /* @__PURE__ */ new Set();
    let node = this;
    while (true) {
      if (node === null) {
        break;
      }
      const key = node.__key;
      if (!visited.has(key)) {
        visited.add(key);
        nodes.push(node);
      }
      if (node === targetNode) {
        break;
      }
      const child = $isElementNode(node) ? isBefore ? node.getFirstChild() : node.getLastChild() : null;
      if (child !== null) {
        node = child;
        continue;
      }
      const nextSibling = isBefore ? node.getNextSibling() : node.getPreviousSibling();
      if (nextSibling !== null) {
        node = nextSibling;
        continue;
      }
      const parent = node.getParentOrThrow();
      if (!visited.has(parent.__key)) {
        nodes.push(parent);
      }
      if (parent === targetNode) {
        break;
      }
      let parentSibling = null;
      let ancestor = parent;
      do {
        if (ancestor === null) {
          {
            formatDevErrorMessage(`getNodesBetween: ancestor is null`);
          }
        }
        parentSibling = isBefore ? ancestor.getNextSibling() : ancestor.getPreviousSibling();
        ancestor = ancestor.getParent();
        if (ancestor !== null) {
          if (parentSibling === null && !visited.has(ancestor.__key)) {
            nodes.push(ancestor);
          }
        } else {
          break;
        }
      } while (parentSibling === null);
      node = parentSibling;
    }
    if (!isBefore) {
      nodes.reverse();
    }
    return nodes;
  }
  /**
   * Returns true if this node has been marked dirty during this update cycle.
   *
   */
  isDirty() {
    const editor = getActiveEditor();
    const dirtyLeaves = editor._dirtyLeaves;
    return dirtyLeaves !== null && dirtyLeaves.has(this.__key);
  }
  /**
   * Returns the latest version of the node from the active EditorState.
   * This is used to avoid getting values from stale node references.
   *
   */
  getLatest() {
    if ($isEphemeral(this)) {
      return this;
    }
    const latest = $getNodeByKey(this.__key);
    if (latest === null) {
      {
        formatDevErrorMessage(`Lexical node does not exist in active editor state. Avoid using the same node references between nested closures from editorState.read/editor.update.`);
      }
    }
    return latest;
  }
  /**
   * Returns a mutable version of the node using {@link $cloneWithProperties}
   * if necessary. Will throw an error if called outside of a Lexical Editor
   * {@link LexicalEditor.update} callback.
   *
   */
  getWritable() {
    if ($isEphemeral(this)) {
      return this;
    }
    errorOnReadOnly();
    const editorState = getActiveEditorState();
    const editor = getActiveEditor();
    const nodeMap = editorState._nodeMap;
    const key = this.__key;
    const latestNode = this.getLatest();
    const cloneNotNeeded = editor._cloneNotNeeded;
    const selection = $getSelection();
    if (selection !== null) {
      selection.setCachedNodes(null);
    }
    if (cloneNotNeeded.has(key)) {
      internalMarkNodeAsDirty(latestNode);
      return latestNode;
    }
    const mutableNode = $cloneWithProperties(latestNode);
    cloneNotNeeded.add(key);
    internalMarkNodeAsDirty(mutableNode);
    nodeMap.set(key, mutableNode);
    return mutableNode;
  }
  /**
   * Returns the text content of the node. Override this for
   * custom nodes that should have a representation in plain text
   * format (for copy + paste, for example)
   *
   */
  getTextContent() {
    return $getSlotsTextContent(this);
  }
  /**
   * Returns the length of the string produced by calling getTextContent on this node.
   *
   */
  getTextContentSize() {
    return this.getTextContent().length;
  }
  // View
  /**
   * Called during the reconciliation process to determine which nodes
   * to insert into the DOM for this Lexical Node.
   *
   * This method must return exactly one HTMLElement. Nested elements are not supported.
   *
   * Do not attempt to update the Lexical EditorState during this phase of the update lifecycle.
   *
   * @param _config - allows access to things like the EditorTheme (to apply classes) during reconciliation.
   * @param _editor - allows access to the editor for context during reconciliation.
   *
   * */
  createDOM(_config, _editor) {
    {
      formatDevErrorMessage(`createDOM: base method not extended`);
    }
  }
  /**
   * Called when a node changes and should update the DOM
   * in whatever way is necessary to make it align with any changes that might
   * have happened during the update.
   *
   * Returning "true" here will cause lexical to unmount and recreate the DOM node
   * (by calling createDOM). You would need to do this if the element tag changes,
   * for instance.
   *
   * */
  updateDOM(_prevNode, _dom, _config) {
    {
      formatDevErrorMessage(`updateDOM: base method not extended`);
    }
  }
  /**
   * Returns a {@link DOMSlot} pointing at the content-bearing element of this
   * node's DOM. The default returns a slot wrapping the keyed DOM as-is.
   *
   * Override this when {@link createDOM} returns a wrapper around the
   * content-bearing element (e.g. `<span><br/></span>` for a styled line
   * break), so selection / reconciliation logic can target the inner element.
   *
   * {@link ElementNode} overrides this to return an {@link ElementDOMSlot}
   * with children-management semantics (used by the reconciler to place
   * managed children).
   *
   * @experimental
   */
  getDOMSlot(element) {
    return new DOMSlot(element);
  }
  /**
   * Controls how the this node is serialized to HTML. This is important for
   * copy and paste between Lexical and non-Lexical editors, or Lexical editors with different namespaces,
   * in which case the primary transfer format is HTML. It's also important if you're serializing
   * to HTML for any other reason via {@link @lexical/html!$generateHtmlFromNodes}. You could
   * also use this method to build your own HTML renderer.
   *
   * */
  exportDOM(editor) {
    const element = this.createDOM(editor._config, editor);
    return {
      element
    };
  }
  /**
   * Controls how the this node is serialized to JSON. This is important for
   * copy and paste between Lexical editors sharing the same namespace. It's also important
   * if you're serializing to JSON for persistent storage somewhere.
   * See [Serialization & Deserialization](https://lexical.dev/docs/concepts/serialization#lexical---html).
   *
   * */
  exportJSON() {
    const state = this.__state ? this.__state.toJSON() : void 0;
    return {
      type: this.__type,
      version: 1,
      ...state
    };
  }
  /**
   * Controls how the this node is deserialized from JSON. This is usually boilerplate,
   * but provides an abstraction between the node implementation and serialized interface that can
   * be important if you ever make breaking changes to a node schema (by adding or removing properties).
   * See [Serialization & Deserialization](https://lexical.dev/docs/concepts/serialization#lexical---html).
   *
   * */
  static importJSON(_serializedNode) {
    {
      formatDevErrorMessage(`LexicalNode: Node ${this.name} does not implement .importJSON().`);
    }
  }
  /**
   * Update this LexicalNode instance from serialized JSON. It's recommended
   * to implement as much logic as possible in this method instead of the
   * static importJSON method, so that the functionality can be inherited in subclasses.
   *
   * The LexicalUpdateJSON utility type should be used to ignore any type, version,
   * or children properties in the JSON so that the extended JSON from subclasses
   * are acceptable parameters for the super call.
   *
   * If overridden, this method must call super.
   *
   * @example
   * ```ts
   * class MyTextNode extends TextNode {
   *   // ...
   *   static importJSON(serializedNode: SerializedMyTextNode): MyTextNode {
   *     return $createMyTextNode()
   *       .updateFromJSON(serializedNode);
   *   }
   *   updateFromJSON(
   *     serializedNode: LexicalUpdateJSON<SerializedMyTextNode>,
   *   ): this {
   *     return super.updateFromJSON(serializedNode)
   *       .setMyProperty(serializedNode.myProperty);
   *   }
   * }
   * ```
   **/
  updateFromJSON(serializedNode) {
    return $updateStateFromJSON(this, serializedNode);
  }
  /**
   * @experimental
   *
   * Registers the returned function as a transform on the node during
   * Editor initialization. Most such use cases should be addressed via
   * the {@link LexicalEditor.registerNodeTransform} API.
   *
   * Experimental - use at your own risk.
   */
  static transform() {
    return null;
  }
  // Setters and mutators
  /**
   * Removes this LexicalNode from the EditorState. If the node isn't re-inserted
   * somewhere, the Lexical garbage collector will eventually clean it up.
   *
   * @param preserveEmptyParent - If falsy, the node's parent will be removed if
   * it's empty after the removal operation. This is the default behavior, subject to
   * other node heuristics such as {@link ElementNode#canBeEmpty}
   * */
  remove(preserveEmptyParent) {
    $removeNode(this, true, preserveEmptyParent);
  }
  /**
   * Replaces this LexicalNode with the provided node, optionally transferring the children
   * of the replaced node to the replacing node.
   *
   * Named slots are bound to their host node and are never transferred: this
   * node keeps its slot map, so if it is reattached elsewhere (as
   * `$wrapNodeInElement` does) its slots come with it, and if it stays
   * detached the slot subtrees are garbage-collected along with it. To move a
   * slot value onto another host, use `$setSlot` explicitly.
   *
   * @param replaceWith - The node to replace this one with.
   * @param includeChildren - Whether or not to transfer the children of this node to the replacing node.
   * */
  replace(replaceWith, includeChildren) {
    errorOnReadOnly();
    let selection = $getSelection();
    if (selection !== null) {
      selection = selection.clone();
    }
    errorOnInsertTextNodeOnRoot(this, replaceWith);
    const self = this.getLatest();
    const toReplaceKey = this.__key;
    const slotHost = $getSlotHost(self);
    if (slotHost !== null) {
      {
        formatDevErrorMessage(`replace: node ${toReplaceKey} (type ${self.getType()}) is slotted into host ${slotHost.getKey()} (type ${slotHost.getType()}); a slot value cannot be replaced through the tree API. Use $setSlot on its host to assign a replacement.`);
      }
    }
    const key = replaceWith.__key;
    const writableReplaceWith = replaceWith.getWritable();
    const writableParent = this.getParentOrThrow().getWritable();
    $errorOnSlotCycleChild(writableParent, writableReplaceWith);
    const size = writableParent.__size;
    const replaceWithOldParent = writableReplaceWith.getParent();
    const restoreInReplaceWithOldParent = replaceWithOldParent !== null && $isRangeSelection(selection) && $selectionTouchesElement(selection, replaceWithOldParent);
    const replaceWithOldIndex = restoreInReplaceWithOldParent ? writableReplaceWith.getIndexWithinParent() : -1;
    $removeFromParent(writableReplaceWith);
    if (restoreInReplaceWithOldParent && replaceWithOldParent !== null && $isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(selection, replaceWithOldParent, replaceWithOldIndex, -1);
    }
    const prevSibling = self.getPreviousSibling();
    const nextSibling = self.getNextSibling();
    const prevKey = self.__prev;
    const nextKey = self.__next;
    const parentKey = self.__parent;
    $removeNode(self, false, true);
    if (prevSibling === null) {
      writableParent.__first = key;
    } else {
      const writablePrevSibling = prevSibling.getWritable();
      writablePrevSibling.__next = key;
    }
    writableReplaceWith.__prev = prevKey;
    if (nextSibling === null) {
      writableParent.__last = key;
    } else {
      const writableNextSibling = nextSibling.getWritable();
      writableNextSibling.__prev = key;
    }
    writableReplaceWith.__next = nextKey;
    writableReplaceWith.__parent = parentKey;
    writableParent.__size = replaceWithOldParent !== null && replaceWithOldParent.is(writableParent) ? size - 1 : size;
    let prevSizeBeforeChildrenTransfer = 0;
    if (includeChildren) {
      if (!($isElementNode(this) && $isElementNode(writableReplaceWith))) {
        formatDevErrorMessage(`includeChildren should only be true for ElementNodes`);
      }
      prevSizeBeforeChildrenTransfer = writableReplaceWith.getChildrenSize();
      writableReplaceWith.splice(prevSizeBeforeChildrenTransfer, 0, this.getChildren());
    }
    if ($isRangeSelection(selection)) {
      $setSelection(selection);
      const anchor = selection.anchor;
      const focus = selection.focus;
      if (anchor.key === toReplaceKey) {
        if (includeChildren && anchor.type === "element") {
          anchor.set(writableReplaceWith.__key, prevSizeBeforeChildrenTransfer + anchor.offset, "element");
        } else {
          $moveSelectionPointToEnd(anchor, writableReplaceWith);
        }
      }
      if (focus.key === toReplaceKey) {
        if (includeChildren && focus.type === "element") {
          focus.set(writableReplaceWith.__key, prevSizeBeforeChildrenTransfer + focus.offset, "element");
        } else {
          $moveSelectionPointToEnd(focus, writableReplaceWith);
        }
      }
    }
    if ($getCompositionKey() === toReplaceKey) {
      $setCompositionKey(key);
    }
    return writableReplaceWith;
  }
  /**
   * Inserts a node after this LexicalNode (as the next sibling).
   *
   * @param nodeToInsert - The node to insert after this one.
   * @param restoreSelection - Whether or not to attempt to resolve the
   * selection to the appropriate place after the operation is complete.
   * */
  insertAfter(nodeToInsert, restoreSelection = true) {
    errorOnReadOnly();
    errorOnInsertTextNodeOnRoot(this, nodeToInsert);
    const writableSelf = this.getWritable();
    const writableNodeToInsert = nodeToInsert.getWritable();
    $errorOnSlotCycleChild(this.getParentOrThrow(), writableNodeToInsert);
    const oldParent = writableNodeToInsert.getParent();
    const selection = $getSelection();
    let elementAnchorSelectionOnNode = false;
    let elementFocusSelectionOnNode = false;
    let oldIndex = -1;
    if (oldParent !== null && restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, oldParent)) {
      const oldParentKey = oldParent.__key;
      const anchor = selection.anchor;
      const focus = selection.focus;
      oldIndex = nodeToInsert.getIndexWithinParent();
      elementAnchorSelectionOnNode = anchor.type === "element" && anchor.key === oldParentKey && anchor.offset === oldIndex + 1;
      elementFocusSelectionOnNode = focus.type === "element" && focus.key === oldParentKey && focus.offset === oldIndex + 1;
    }
    $removeFromParent(writableNodeToInsert);
    if (oldIndex !== -1 && oldParent !== null && $isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(selection, oldParent, oldIndex, -1);
    }
    const nextSibling = this.getNextSibling();
    const writableParent = this.getParentOrThrow().getWritable();
    const insertKey = writableNodeToInsert.__key;
    const nextKey = writableSelf.__next;
    if (nextSibling === null) {
      writableParent.__last = insertKey;
    } else {
      const writableNextSibling = nextSibling.getWritable();
      writableNextSibling.__prev = insertKey;
    }
    writableParent.__size++;
    writableSelf.__next = insertKey;
    writableNodeToInsert.__next = nextKey;
    writableNodeToInsert.__prev = writableSelf.__key;
    writableNodeToInsert.__parent = writableSelf.__parent;
    if (restoreSelection && $isRangeSelection(selection)) {
      const writableParentKey = writableParent.__key;
      if (elementAnchorSelectionOnNode || elementFocusSelectionOnNode || $selectionTouchesElement(selection, writableParent)) {
        const index = this.getIndexWithinParent();
        $updateElementSelectionOnCreateDeleteNode(selection, writableParent, index + 1);
        if (elementAnchorSelectionOnNode) {
          selection.anchor.set(writableParentKey, index + 2, "element");
        }
        if (elementFocusSelectionOnNode) {
          selection.focus.set(writableParentKey, index + 2, "element");
        }
      }
    }
    return nodeToInsert;
  }
  /**
   * Inserts a node before this LexicalNode (as the previous sibling).
   *
   * @param nodeToInsert - The node to insert before this one.
   * @param restoreSelection - Whether or not to attempt to resolve the
   * selection to the appropriate place after the operation is complete.
   * */
  insertBefore(nodeToInsert, restoreSelection = true) {
    errorOnReadOnly();
    errorOnInsertTextNodeOnRoot(this, nodeToInsert);
    const writableSelf = this.getWritable();
    const writableNodeToInsert = nodeToInsert.getWritable();
    $errorOnSlotCycleChild(this.getParentOrThrow(), writableNodeToInsert);
    const insertKey = writableNodeToInsert.__key;
    const selection = $getSelection();
    const insertOldParent = writableNodeToInsert.getParent();
    const restoreInOldParent = insertOldParent !== null && restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, insertOldParent);
    const insertOldIndex = restoreInOldParent ? writableNodeToInsert.getIndexWithinParent() : -1;
    $removeFromParent(writableNodeToInsert);
    if (restoreInOldParent && insertOldParent !== null && $isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(selection, insertOldParent, insertOldIndex, -1);
    }
    const prevSibling = this.getPreviousSibling();
    const writableParent = this.getParentOrThrow().getWritable();
    const prevKey = writableSelf.__prev;
    const restoreInNewParent = restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, writableParent);
    const index = restoreInNewParent ? this.getIndexWithinParent() : -1;
    if (prevSibling === null) {
      writableParent.__first = insertKey;
    } else {
      const writablePrevSibling = prevSibling.getWritable();
      writablePrevSibling.__next = insertKey;
    }
    writableParent.__size++;
    writableSelf.__prev = insertKey;
    writableNodeToInsert.__prev = prevKey;
    writableNodeToInsert.__next = writableSelf.__key;
    writableNodeToInsert.__parent = writableSelf.__parent;
    if (restoreInNewParent && $isRangeSelection(selection)) {
      $updateElementSelectionOnCreateDeleteNode(selection, writableParent, index);
    }
    return nodeToInsert;
  }
  /**
   * Whether or not this node has a required parent. Used during copy + paste operations
   * to normalize nodes that would otherwise be orphaned. For example, ListItemNodes without
   * a ListNode parent or TextNodes with a ParagraphNode parent.
   *
   * */
  isParentRequired() {
    return false;
  }
  /**
   * The creation logic for any required parent. Should be implemented if {@link isParentRequired} returns true.
   *
   * */
  createParentElementNode() {
    return $createParagraphNode();
  }
  selectStart() {
    return this.selectPrevious();
  }
  selectEnd() {
    return this.selectNext(0, 0);
  }
  /**
   * Moves selection to the previous sibling of this node, at the specified offsets.
   *
   * @param anchorOffset - The anchor offset for selection.
   * @param focusOffset -  The focus offset for selection
   * */
  selectPrevious(anchorOffset, focusOffset) {
    errorOnReadOnly();
    const slotHost = $getSlotHost(this);
    if (slotHost !== null) {
      return slotHost.selectPrevious(anchorOffset, focusOffset);
    }
    const prevSibling = this.getPreviousSibling();
    const parent = this.getParentOrThrow();
    if (prevSibling === null) {
      return parent.select(0, 0);
    }
    if ($isElementNode(prevSibling)) {
      return prevSibling.select();
    } else if (!$isTextNode(prevSibling)) {
      const index = prevSibling.getIndexWithinParent() + 1;
      return parent.select(index, index);
    }
    return prevSibling.select(anchorOffset, focusOffset);
  }
  /**
   * Moves selection to the next sibling of this node, at the specified offsets.
   *
   * @param anchorOffset - The anchor offset for selection.
   * @param focusOffset -  The focus offset for selection
   * */
  selectNext(anchorOffset, focusOffset) {
    errorOnReadOnly();
    const slotHost = $getSlotHost(this);
    if (slotHost !== null) {
      return slotHost.selectNext(anchorOffset, focusOffset);
    }
    const nextSibling = this.getNextSibling();
    const parent = this.getParentOrThrow();
    if (nextSibling === null) {
      return parent.select();
    }
    if ($isElementNode(nextSibling)) {
      return nextSibling.select(0, 0);
    } else if (!$isTextNode(nextSibling)) {
      const index = nextSibling.getIndexWithinParent();
      return parent.select(index, index);
    }
    return nextSibling.select(anchorOffset, focusOffset);
  }
  /**
   * Marks a node dirty, triggering transforms and
   * forcing it to be reconciled during the update cycle.
   *
   * */
  markDirty() {
    this.getWritable();
  }
  /**
   * @internal
   *
   * When the reconciler detects that a node was mutated, this method
   * may be called to restore the node to a known good state.
   */
  reconcileObservedMutation(dom, editor) {
    this.markDirty();
  }
};
function errorOnTypeKlassMismatch(type, klass) {
  const registeredNode = getRegisteredNode(getActiveEditor(), type);
  if (registeredNode === void 0) {
    {
      formatDevErrorMessage(`Create node: Attempted to create node ${klass.name} that was not configured to be used on the editor.`);
    }
  }
  const editorKlass = registeredNode.klass;
  if (editorKlass !== klass) {
    {
      formatDevErrorMessage(`Create node: Type ${type} in node ${klass.name} does not match registered node ${editorKlass.name} with the same type`);
    }
  }
}
function insertRangeAfter(node, firstToInsert, lastToInsert) {
  const lastToInsert2 = firstToInsert.getParentOrThrow().getLastChild();
  let current = firstToInsert;
  const nodesToInsert = [firstToInsert];
  while (current !== lastToInsert2) {
    if (!current.getNextSibling()) {
      {
        formatDevErrorMessage(`insertRangeAfter: lastToInsert must be a later sibling of firstToInsert`);
      }
    }
    current = current.getNextSibling();
    nodesToInsert.push(current);
  }
  let currentNode = node;
  for (const nodeToInsert of nodesToInsert) {
    currentNode = currentNode.insertAfter(nodeToInsert);
  }
}
function $isLexicalNode(node) {
  return node instanceof LexicalNode;
}
var HISTORIC_TAG = "historic";
var HISTORY_PUSH_TAG = "history-push";
var HISTORY_MERGE_TAG = "history-merge";
var PASTE_TAG = "paste";
var CUT_TAG = "cut";
var COLLABORATION_TAG = "collaboration";
var SKIP_COLLAB_TAG = "skip-collab";
var SKIP_SCROLL_INTO_VIEW_TAG = "skip-scroll-into-view";
var SKIP_DOM_SELECTION_TAG = "skip-dom-selection";
var SKIP_SELECTION_FOCUS_TAG = "skip-selection-focus";
var FOCUS_TAG = "focus";
var COMPOSITION_START_TAG = "composition-start";
var COMPOSITION_END_TAG = "composition-end";
var IMPORTANT_FLAG = "!important";
function getStyleObjectFromCSS(css) {
  const styles = {};
  if (!css) {
    return styles;
  }
  let currentProperty = "";
  let currentValue = "";
  let currentQuote = null;
  let inComment = false;
  let isEscaped = false;
  let isParsingValue = false;
  let parenthesisDepth = 0;
  const length = css.length;
  let chunkStart = -1;
  for (let i2 = 0; i2 < length; i2++) {
    const char = css[i2];
    if (inComment) {
      if (char === "*" && css[i2 + 1] === "/") {
        inComment = false;
        i2++;
      }
      continue;
    }
    if (isEscaped) {
      if (chunkStart === -1) {
        chunkStart = i2;
      }
      isEscaped = false;
      continue;
    }
    if (currentQuote !== null) {
      if (chunkStart === -1) {
        chunkStart = i2;
      }
      if (char === "\\") {
        isEscaped = true;
      } else if (char === currentQuote) {
        currentQuote = null;
      }
      continue;
    }
    if (char === "/" && css[i2 + 1] === "*") {
      if (chunkStart !== -1) {
        if (isParsingValue) {
          currentValue += css.slice(chunkStart, i2);
        } else {
          currentProperty += css.slice(chunkStart, i2);
        }
        chunkStart = -1;
      }
      inComment = true;
      i2++;
      continue;
    }
    if (char === '"' || char === "'") {
      if (chunkStart === -1) {
        chunkStart = i2;
      }
      currentQuote = char;
      continue;
    }
    if (char === "(") {
      if (chunkStart === -1) {
        chunkStart = i2;
      }
      parenthesisDepth++;
      continue;
    }
    if (char === ")") {
      if (chunkStart === -1) {
        chunkStart = i2;
      }
      parenthesisDepth = Math.max(0, parenthesisDepth - 1);
      continue;
    }
    if (!isParsingValue && char === ":" && parenthesisDepth === 0) {
      if (chunkStart !== -1) {
        currentProperty += css.slice(chunkStart, i2);
        chunkStart = -1;
      }
      isParsingValue = true;
      continue;
    }
    if (char === ";" && parenthesisDepth === 0) {
      if (chunkStart !== -1) {
        if (isParsingValue) {
          currentValue += css.slice(chunkStart, i2);
        } else {
          currentProperty += css.slice(chunkStart, i2);
        }
        chunkStart = -1;
      }
      const property2 = currentProperty.trim();
      const value2 = currentValue.trim();
      if (property2 !== "" && value2 !== "") {
        styles[property2] = value2;
      }
      currentProperty = "";
      currentValue = "";
      isParsingValue = false;
      continue;
    }
    if (chunkStart === -1) {
      chunkStart = i2;
    }
  }
  if (chunkStart !== -1) {
    if (isParsingValue) {
      currentValue += css.slice(chunkStart, length);
    } else {
      currentProperty += css.slice(chunkStart, length);
    }
  }
  const property = currentProperty.trim();
  const value = currentValue.trim();
  if (property !== "" && value !== "") {
    styles[property] = value;
  }
  return styles;
}
function setDOMStyleProperty(domStyle, property, value) {
  const trimmedValue = value.trimEnd();
  const flagStart = trimmedValue.length - IMPORTANT_FLAG.length;
  const hasImportant = flagStart >= 0 && trimmedValue.slice(flagStart).toLowerCase() === IMPORTANT_FLAG;
  if (hasImportant) {
    domStyle.setProperty(property, trimmedValue.slice(0, flagStart).trim(), "important");
  } else {
    domStyle.setProperty(property, value, "");
  }
}
function setDOMStyleObject(domStyle, styleObject) {
  for (const property in styleObject) {
    const value = styleObject[property];
    if (value == null) {
      domStyle.removeProperty(property);
    } else {
      setDOMStyleProperty(domStyle, property, value);
    }
  }
}
function setDOMStyleFromCSS(domStyle, cssText, prevCSSText = "") {
  if (cssText === prevCSSText) {
    return;
  }
  const prevCSS = getStyleObjectFromCSS(prevCSSText);
  const nextCSS = getStyleObjectFromCSS(cssText);
  for (const property in nextCSS) {
    delete prevCSS[property];
    setDOMStyleProperty(domStyle, property, nextCSS[property]);
  }
  for (const property in prevCSS) {
    domStyle.removeProperty(property);
  }
}
function getElementOuterTag(node, format) {
  if (format & IS_CODE) {
    return "code";
  }
  if (format & IS_HIGHLIGHT) {
    return "mark";
  }
  if (format & IS_SUBSCRIPT) {
    return "sub";
  }
  if (format & IS_SUPERSCRIPT) {
    return "sup";
  }
  return null;
}
function getElementInnerTag(node, format) {
  if (format & IS_BOLD) {
    return "strong";
  }
  if (format & IS_ITALIC) {
    return "em";
  }
  return "span";
}
function setTextThemeClassNames(tag, prevFormat, nextFormat, dom, textClassNames) {
  const domClassList = dom.classList;
  let classNames = getCachedClassNameArray(textClassNames, "base");
  if (classNames !== void 0) {
    domClassList.add(...classNames);
  }
  classNames = getCachedClassNameArray(textClassNames, "underlineStrikethrough");
  let hasUnderlineStrikethrough = false;
  const prevUnderlineStrikethrough = prevFormat & IS_UNDERLINE && prevFormat & IS_STRIKETHROUGH;
  const nextUnderlineStrikethrough = nextFormat & IS_UNDERLINE && nextFormat & IS_STRIKETHROUGH;
  if (classNames !== void 0) {
    if (nextUnderlineStrikethrough) {
      hasUnderlineStrikethrough = true;
      if (!prevUnderlineStrikethrough) {
        domClassList.add(...classNames);
      }
    } else if (prevUnderlineStrikethrough) {
      domClassList.remove(...classNames);
    }
  }
  for (const key in TEXT_TYPE_TO_FORMAT) {
    const format = key;
    const flag = TEXT_TYPE_TO_FORMAT[format];
    classNames = getCachedClassNameArray(textClassNames, key);
    if (classNames !== void 0) {
      if (nextFormat & flag) {
        if (hasUnderlineStrikethrough && (key === "underline" || key === "strikethrough")) {
          if (prevFormat & flag) {
            domClassList.remove(...classNames);
          }
          continue;
        }
        if ((prevFormat & flag) === 0 || prevUnderlineStrikethrough && key === "underline" || key === "strikethrough") {
          domClassList.add(...classNames);
        }
      } else if (prevFormat & flag) {
        domClassList.remove(...classNames);
      }
    }
  }
  removeEmptyDOMAttribute(dom, "class");
}
function diffComposedText(a2, b2) {
  const aLength = a2.length;
  const bLength = b2.length;
  let left = 0;
  let right = 0;
  while (left < aLength && left < bLength && a2[left] === b2[left]) {
    left++;
  }
  while (right + left < aLength && right + left < bLength && a2[aLength - right - 1] === b2[bLength - right - 1]) {
    right++;
  }
  return [left, aLength - left - right, b2.slice(left, bLength - right)];
}
function $setTextContent(nextText, dom, node) {
  const isComposing = node.isComposing();
  const suffix = isComposing ? COMPOSITION_SUFFIX : "";
  const text = nextText + suffix;
  const editor = $getEditor();
  const slot = $getEditorDOMRenderConfig(editor).$getDOMSlot(node, dom, editor);
  const firstChild = slot.getFirstChild();
  if (firstChild === null || firstChild.nodeType !== Node.TEXT_NODE) {
    slot.insertChild($getDocument().createTextNode(text));
    return;
  }
  const textChild = firstChild;
  const nodeValue = textChild.nodeValue;
  if (nodeValue === text) {
    return;
  }
  if (isComposing || IS_FIREFOX) {
    const [index, remove, insert] = diffComposedText(nodeValue, text);
    if (remove !== 0) {
      textChild.deleteData(index, remove);
    }
    textChild.insertData(index, insert);
  } else {
    textChild.nodeValue = text;
  }
}
function $createTextInnerDOM(innerDOM, node, innerTag, format, text, config) {
  $setTextContent(text, innerDOM, node);
  const theme = config.theme;
  const textClassNames = theme.text;
  if (textClassNames !== void 0) {
    setTextThemeClassNames(innerTag, 0, format, innerDOM, textClassNames);
  }
}
function $wrapElementWith(element, tag) {
  const el = $getDocument().createElement(tag);
  el.appendChild(element);
  return el;
}
function $isInlineFormattable(node) {
  return node != null && node.__isInlineFormattable === true;
}
var TextNode = class extends LexicalNode {
  /** @internal */
  __text;
  /** @internal */
  __format;
  /** @internal */
  __style;
  /** @internal */
  __mode;
  /** @internal */
  __detail;
  /** @internal */
  get __isInlineFormattable() {
    return true;
  }
  $config() {
    return this.config("text", {
      importDOM: {
        "#text": () => ({
          conversion: $convertTextDOMNode,
          priority: 0
        }),
        b: () => ({
          conversion: convertBringAttentionToElement,
          priority: 0
        }),
        code: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        em: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        i: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        mark: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        s: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        span: () => ({
          conversion: convertSpanElement,
          priority: 0
        }),
        strong: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        sub: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        sup: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        }),
        u: () => ({
          conversion: convertTextFormatElement,
          priority: 0
        })
      }
    });
  }
  afterCloneFrom(prevNode) {
    super.afterCloneFrom(prevNode);
    this.__text = prevNode.__text;
    this.__format = prevNode.__format;
    this.__style = prevNode.__style;
    this.__mode = prevNode.__mode;
    this.__detail = prevNode.__detail;
  }
  constructor(text = "", key) {
    super(key);
    this.__text = text;
    this.__format = 0;
    this.__style = "";
    this.__mode = 0;
    this.__detail = 0;
  }
  /**
   * Returns a 32-bit integer that represents the TextFormatTypes currently applied to the
   * TextNode. You probably don't want to use this method directly - consider using TextNode.hasFormat instead.
   *
   * @returns a number representing the format of the text node.
   */
  getFormat() {
    const self = this.getLatest();
    return self.__format;
  }
  /**
   * Returns a 32-bit integer that represents the TextDetailTypes currently applied to the
   * TextNode. You probably don't want to use this method directly - consider using TextNode.isDirectionless
   * or TextNode.isUnmergeable instead.
   *
   * @returns a number representing the detail of the text node.
   */
  getDetail() {
    const self = this.getLatest();
    return self.__detail;
  }
  /**
   * Returns the mode (TextModeType) of the TextNode, which may be "normal", "token", or "segmented"
   *
   * @returns TextModeType.
   */
  getMode() {
    const self = this.getLatest();
    return TEXT_TYPE_TO_MODE[self.__mode];
  }
  /**
   * Returns the styles currently applied to the node. This is analogous to CSSText in the DOM.
   *
   * @returns CSSText-like string of styles applied to the underlying DOM node.
   */
  getStyle() {
    const self = this.getLatest();
    return self.__style;
  }
  /**
   * Returns whether or not the node is in "token" mode. TextNodes in token mode can be navigated through character-by-character
   * with a RangeSelection, but are deleted as a single entity (not individually by character).
   *
   * @returns true if the node is in token mode, false otherwise.
   */
  isToken() {
    const self = this.getLatest();
    return self.__mode === IS_TOKEN;
  }
  /**
   *
   * @returns true if Lexical detects that an IME or other 3rd-party script is attempting to
   * mutate the TextNode, false otherwise.
   */
  isComposing() {
    return this.__key === $getCompositionKey();
  }
  /**
   * Returns whether or not the node is in "segmented" mode. TextNodes in segmented mode can be navigated through character-by-character
   * with a RangeSelection, but are deleted in space-delimited "segments".
   *
   * @returns true if the node is in segmented mode, false otherwise.
   */
  isSegmented() {
    const self = this.getLatest();
    return self.__mode === IS_SEGMENTED;
  }
  /**
   * Returns whether or not the node is "directionless". Directionless nodes don't respect changes between RTL and LTR modes.
   *
   * @returns true if the node is directionless, false otherwise.
   */
  isDirectionless() {
    const self = this.getLatest();
    return (self.__detail & IS_DIRECTIONLESS) !== 0;
  }
  /**
   * Returns whether or not the node is unmergeable. In some scenarios, Lexical tries to merge
   * adjacent TextNodes into a single TextNode. If a TextNode is unmergeable, this won't happen.
   *
   * @returns true if the node is unmergeable, false otherwise.
   */
  isUnmergeable() {
    const self = this.getLatest();
    return (self.__detail & IS_UNMERGEABLE) !== 0;
  }
  /**
   * Returns whether or not the node has the provided format applied. Use this with the human-readable TextFormatType
   * string values to get the format of a TextNode.
   *
   * @param type - the TextFormatType to check for.
   *
   * @returns true if the node has the provided format, false otherwise.
   */
  hasFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return (this.getFormat() & formatFlag) !== 0;
  }
  /**
   * Returns whether or not the node is simple text. Simple text is defined as a TextNode that has the string type "text"
   * (i.e., not a subclass) and has no mode applied to it (i.e., not segmented or token).
   *
   * @returns true if the node is simple text, false otherwise.
   */
  isSimpleText() {
    return this.__type === "text" && this.__mode === 0;
  }
  /**
   * Returns the text content of the node as a string.
   *
   * @returns a string representing the text content of the node.
   */
  getTextContent() {
    const self = this.getLatest();
    return self.__text;
  }
  /**
   * Returns the format flags applied to the node as a 32-bit integer.
   *
   * @returns a number representing the TextFormatTypes applied to the node.
   */
  getFormatFlags(type, alignWithFormat) {
    const self = this.getLatest();
    const format = self.__format;
    return toggleTextFormatType(format, type, alignWithFormat);
  }
  /**
   *
   * @returns true if the text node supports font styling, false otherwise.
   */
  canHaveFormat() {
    return true;
  }
  /**
   * @returns true if the text node is inline, false otherwise.
   */
  isInline() {
    return true;
  }
  // View
  createDOM(config, editor) {
    const format = this.__format;
    const outerTag = getElementOuterTag(this, format);
    const innerTag = getElementInnerTag(this, format);
    const tag = outerTag === null ? innerTag : outerTag;
    const dom = $getDocument().createElement(tag);
    let innerDOM = dom;
    if (this.hasFormat("code")) {
      dom.setAttribute("spellcheck", "false");
    }
    if (outerTag !== null) {
      innerDOM = $getDocument().createElement(innerTag);
      dom.appendChild(innerDOM);
    }
    const text = this.__text;
    $createTextInnerDOM(innerDOM, this, innerTag, format, text, config);
    const style = this.__style;
    if (style !== "") {
      setDOMStyleFromCSS(dom.style, style);
    }
    return dom;
  }
  updateDOM(prevNode, dom, config) {
    const nextText = this.__text;
    const prevFormat = prevNode.__format;
    const nextFormat = this.__format;
    const prevOuterTag = getElementOuterTag(this, prevFormat);
    const nextOuterTag = getElementOuterTag(this, nextFormat);
    const prevInnerTag = getElementInnerTag(this, prevFormat);
    const nextInnerTag = getElementInnerTag(this, nextFormat);
    const prevTag = prevOuterTag === null ? prevInnerTag : prevOuterTag;
    const nextTag = nextOuterTag === null ? nextInnerTag : nextOuterTag;
    if (prevTag !== nextTag) {
      return true;
    }
    if (prevOuterTag === nextOuterTag && prevInnerTag !== nextInnerTag) {
      const prevInnerDOM = dom.firstChild;
      if (prevInnerDOM == null) {
        {
          formatDevErrorMessage(`updateDOM: prevInnerDOM is null or undefined`);
        }
      }
      const nextInnerDOM = $getDocument().createElement(nextInnerTag);
      $createTextInnerDOM(nextInnerDOM, this, nextInnerTag, nextFormat, nextText, config);
      dom.replaceChild(nextInnerDOM, prevInnerDOM);
      return false;
    }
    let innerDOM = dom;
    if (nextOuterTag !== null) {
      if (prevOuterTag !== null) {
        innerDOM = dom.firstChild;
        if (innerDOM == null) {
          {
            formatDevErrorMessage(`updateDOM: innerDOM is null or undefined`);
          }
        }
      }
    }
    $setTextContent(nextText, innerDOM, this);
    const theme = config.theme;
    const textClassNames = theme.text;
    if (textClassNames !== void 0 && prevFormat !== nextFormat) {
      setTextThemeClassNames(nextInnerTag, prevFormat, nextFormat, innerDOM, textClassNames);
    }
    const prevStyle = prevNode.__style;
    const nextStyle = this.__style;
    if (prevStyle !== nextStyle) {
      setDOMStyleFromCSS(dom.style, nextStyle, prevStyle);
      removeEmptyDOMAttribute(dom, "style");
    }
    return false;
  }
  updateFromJSON(serializedNode) {
    return super.updateFromJSON(serializedNode).setTextContent(serializedNode.text).setFormat(serializedNode.format).setDetail(serializedNode.detail).setMode(serializedNode.mode).setStyle(serializedNode.style);
  }
  // This improves Lexical's basic text output in copy+paste plus
  // for headless mode where people might use Lexical to generate
  // HTML content and not have the ability to use CSS classes.
  exportDOM(editor) {
    let {
      element
    } = super.exportDOM(editor);
    if (!isHTMLElement(element)) {
      formatDevErrorMessage(`Expected TextNode createDOM to always return a HTMLElement`);
    }
    element.style.whiteSpace = "pre-wrap";
    if (this.hasFormat("lowercase")) {
      element.style.textTransform = "lowercase";
    } else if (this.hasFormat("uppercase")) {
      element.style.textTransform = "uppercase";
    } else if (this.hasFormat("capitalize")) {
      element.style.textTransform = "capitalize";
    }
    if (this.hasFormat("bold")) {
      element = $wrapElementWith(element, "b");
    }
    if (this.hasFormat("italic")) {
      element = $wrapElementWith(element, "i");
    }
    if (this.hasFormat("strikethrough")) {
      element = $wrapElementWith(element, "s");
    }
    if (this.hasFormat("underline")) {
      element = $wrapElementWith(element, "u");
    }
    return {
      element
    };
  }
  exportJSON() {
    return {
      detail: this.getDetail(),
      format: this.getFormat(),
      mode: this.getMode(),
      style: this.getStyle(),
      text: this.getTextContent(),
      // As an exception here we invoke super at the end for historical reasons.
      // Namely, to preserve the order of the properties and not to break the tests
      // that use the serialized string representation.
      ...super.exportJSON()
    };
  }
  // Mutators
  selectionTransform(prevSelection, nextSelection) {
    return;
  }
  /**
   * Sets the node format to the provided TextFormatType or 32-bit integer. Note that the TextFormatType
   * version of the argument can only specify one format and doing so will remove all other formats that
   * may be applied to the node. For toggling behavior, consider using {@link TextNode.toggleFormat}
   *
   * @param format - TextFormatType or 32-bit integer representing the node format.
   *
   * @returns this TextNode.
   * // TODO 0.12 This should just be a `string`.
   */
  setFormat(format) {
    const self = this.getWritable();
    self.__format = typeof format === "string" ? TEXT_TYPE_TO_FORMAT[format] : format;
    return self;
  }
  /**
   * Sets the node detail to the provided TextDetailType or 32-bit integer. Note that the TextDetailType
   * version of the argument can only specify one detail value and doing so will remove all other detail values that
   * may be applied to the node. For toggling behavior, consider using {@link TextNode.toggleDirectionless}
   * or {@link TextNode.toggleUnmergeable}
   *
   * @param detail - TextDetailType or 32-bit integer representing the node detail.
   *
   * @returns this TextNode.
   * // TODO 0.12 This should just be a `string`.
   */
  setDetail(detail) {
    const self = this.getWritable();
    self.__detail = typeof detail === "string" ? DETAIL_TYPE_TO_DETAIL[detail] : detail;
    return self;
  }
  /**
   * Sets the node style to the provided CSSText-like string. Set this property as you
   * would an HTMLElement style attribute to apply inline styles to the underlying DOM Element.
   *
   * @param style - CSSText to be applied to the underlying HTMLElement.
   *
   * @returns this TextNode.
   */
  setStyle(style) {
    const self = this.getWritable();
    self.__style = style;
    return self;
  }
  /**
   * Applies the provided format to this TextNode if it's not present. Removes it if it's present.
   * The subscript and superscript formats are mutually exclusive.
   * Prefer using this method to turn specific formats on and off.
   *
   * @param type - TextFormatType to toggle.
   *
   * @returns this TextNode.
   */
  toggleFormat(type) {
    const format = this.getFormat();
    const newFormat = toggleTextFormatType(format, type, null);
    return this.setFormat(newFormat);
  }
  /**
   * Toggles the directionless detail value of the node. Prefer using this method over setDetail.
   *
   * @returns this TextNode.
   */
  toggleDirectionless() {
    const self = this.getWritable();
    self.__detail ^= IS_DIRECTIONLESS;
    return self;
  }
  /**
   * Toggles the unmergeable detail value of the node. Prefer using this method over setDetail.
   *
   * @returns this TextNode.
   */
  toggleUnmergeable() {
    const self = this.getWritable();
    self.__detail ^= IS_UNMERGEABLE;
    return self;
  }
  /**
   * Sets the mode of the node.
   *
   * Note: during IME composition, a segmented TextNode may be temporarily
   * switched to normal mode to preserve the DOM element that the browser's
   * composition tracker is bound to. Subclass transforms or method overrides
   * that assume the node is always in segmented mode should account for this
   * transient state.
   *
   * @returns this TextNode.
   */
  setMode(type) {
    const mode = TEXT_MODE_TO_TYPE[type];
    if (this.__mode === mode) {
      return this;
    }
    const self = this.getWritable();
    self.__mode = mode;
    return self;
  }
  /**
   * Sets the text content of the node.
   *
   * @param text - the string to set as the text value of the node.
   *
   * @returns this TextNode.
   */
  setTextContent(text) {
    if (this.__text === text) {
      return this;
    }
    const self = this.getWritable();
    self.__text = text;
    return self;
  }
  /**
   * Sets the current Lexical selection to be a RangeSelection with anchor and focus on this TextNode at the provided offsets.
   *
   * @param _anchorOffset - the offset at which the Selection anchor will be placed.
   * @param _focusOffset - the offset at which the Selection focus will be placed.
   *
   * @returns the new RangeSelection.
   */
  select(_anchorOffset, _focusOffset) {
    errorOnReadOnly();
    let anchorOffset = _anchorOffset;
    let focusOffset = _focusOffset;
    const selection = $getSelection();
    const text = this.getTextContent();
    const key = this.__key;
    if (typeof text === "string") {
      const lastOffset = text.length;
      if (anchorOffset === void 0) {
        anchorOffset = lastOffset;
      }
      if (focusOffset === void 0) {
        focusOffset = lastOffset;
      }
    } else {
      anchorOffset = 0;
      focusOffset = 0;
    }
    if (!$isRangeSelection(selection)) {
      return $internalMakeRangeSelection(key, anchorOffset, key, focusOffset, "text", "text");
    } else {
      const compositionKey = $getCompositionKey();
      if (compositionKey === selection.anchor.key || compositionKey === selection.focus.key) {
        $setCompositionKey(key);
      }
      selection.setTextNodeRange(this, anchorOffset, this, focusOffset);
    }
    return selection;
  }
  selectStart() {
    return this.select(0, 0);
  }
  selectEnd() {
    const size = this.getTextContentSize();
    return this.select(size, size);
  }
  /**
   * Inserts the provided text into this TextNode at the provided offset, deleting the number of characters
   * specified. Can optionally calculate a new selection after the operation is complete.
   *
   * @param offset - the offset at which the splice operation should begin.
   * @param delCount - the number of characters to delete, starting from the offset.
   * @param newText - the text to insert into the TextNode at the offset.
   * @param moveSelection - optional, whether or not to move selection to the end of the inserted substring.
   *
   * @returns this TextNode.
   */
  spliceText(offset, delCount, newText, moveSelection) {
    const writableSelf = this.getWritable();
    const text = writableSelf.__text;
    const handledTextLength = newText.length;
    let index = offset;
    if (index < 0) {
      index = handledTextLength + index;
      if (index < 0) {
        index = 0;
      }
    }
    const selection = $getSelection();
    if (moveSelection && $isRangeSelection(selection)) {
      const newOffset = offset + handledTextLength;
      selection.setTextNodeRange(writableSelf, newOffset, writableSelf, newOffset);
    }
    const updatedText = text.slice(0, index) + newText + text.slice(index + delCount);
    writableSelf.__text = updatedText;
    return writableSelf;
  }
  /**
   * This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
   * when a user event would cause text to be inserted before them in the editor. If true, Lexical will attempt
   * to insert text into this node. If false, it will insert the text in a new sibling node.
   *
   * @returns true if text can be inserted before the node, false otherwise.
   */
  canInsertTextBefore() {
    return true;
  }
  /**
   * This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
   * when a user event would cause text to be inserted after them in the editor. If true, Lexical will attempt
   * to insert text into this node. If false, it will insert the text in a new sibling node.
   *
   * @returns true if text can be inserted after the node, false otherwise.
   */
  canInsertTextAfter() {
    return true;
  }
  /**
   * Splits this TextNode at the provided character offsets, forming new TextNodes from the substrings
   * formed by the split, and inserting those new TextNodes into the editor, replacing the one that was split.
   *
   * @param splitOffsets - rest param of the text content character offsets at which this node should be split.
   *
   * @returns an Array containing the newly-created TextNodes.
   */
  splitText(...splitOffsets) {
    errorOnReadOnly();
    const self = this.getLatest();
    const textContent = self.getTextContent();
    if (textContent === "") {
      return [];
    }
    const key = self.__key;
    const compositionKey = $getCompositionKey();
    const textLength = textContent.length;
    splitOffsets.sort((a2, b2) => a2 - b2);
    splitOffsets.push(textLength);
    const parts = [];
    const splitOffsetsLength = splitOffsets.length;
    for (let start = 0, offsetIndex = 0; start < textLength && offsetIndex <= splitOffsetsLength; offsetIndex++) {
      const end = splitOffsets[offsetIndex];
      if (end > start) {
        parts.push(textContent.slice(start, end));
        start = end;
      }
    }
    const partsLength = parts.length;
    if (partsLength === 1) {
      return [self];
    }
    const firstPart = parts[0];
    const parent = self.getParent();
    let writableNode;
    const format = self.getFormat();
    const style = self.getStyle();
    const detail = self.__detail;
    let hasReplacedSelf = false;
    let startTextPoint = null;
    let endTextPoint = null;
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const [startPoint, endPoint] = selection.isBackward() ? [selection.focus, selection.anchor] : [selection.anchor, selection.focus];
      if (startPoint.type === "text" && startPoint.key === key) {
        startTextPoint = startPoint;
      }
      if (endPoint.type === "text" && endPoint.key === key) {
        endTextPoint = endPoint;
      }
    }
    if (self.isSegmented()) {
      writableNode = $createTextNode(firstPart);
      writableNode.__format = format;
      writableNode.__style = style;
      writableNode.__detail = detail;
      writableNode.__state = $cloneNodeState(self, writableNode);
      hasReplacedSelf = true;
    } else {
      writableNode = self.setTextContent(firstPart);
    }
    const splitNodes = [writableNode];
    for (let i2 = 1; i2 < partsLength; i2++) {
      const part = parts[i2];
      const sibling = $createTextNode(part);
      sibling.__format = format;
      sibling.__style = style;
      sibling.__detail = detail;
      sibling.__state = $cloneNodeState(self, sibling);
      const siblingKey = sibling.__key;
      if (compositionKey === key) {
        $setCompositionKey(siblingKey);
      }
      splitNodes.push(sibling);
    }
    const originalStartOffset = startTextPoint ? startTextPoint.offset : null;
    const originalEndOffset = endTextPoint ? endTextPoint.offset : null;
    let startOffset = 0;
    for (const node of splitNodes) {
      if (!(startTextPoint || endTextPoint)) {
        break;
      }
      const endOffset = startOffset + node.getTextContentSize();
      if (startTextPoint !== null && originalStartOffset !== null && originalStartOffset <= endOffset && originalStartOffset >= startOffset) {
        startTextPoint.set(node.getKey(), originalStartOffset - startOffset, "text");
        if (originalStartOffset < endOffset) {
          startTextPoint = null;
        }
      }
      if (endTextPoint !== null && originalEndOffset !== null && originalEndOffset <= endOffset && originalEndOffset >= startOffset) {
        endTextPoint.set(node.getKey(), originalEndOffset - startOffset, "text");
        break;
      }
      startOffset = endOffset;
    }
    if (parent !== null) {
      internalMarkSiblingsAsDirty(this);
      const writableParent = parent.getWritable();
      const insertionIndex = this.getIndexWithinParent();
      if (hasReplacedSelf) {
        writableParent.splice(insertionIndex, 0, splitNodes);
        this.remove();
      } else {
        writableParent.splice(insertionIndex, 1, splitNodes);
      }
      if ($isRangeSelection(selection)) {
        $updateElementSelectionOnCreateDeleteNode(selection, parent, insertionIndex, partsLength - 1);
      }
    }
    return splitNodes;
  }
  /**
   * Merges the target TextNode into this TextNode, removing the target node.
   *
   * @param target - the TextNode to merge into this one.
   *
   * @returns this TextNode.
   */
  mergeWithSibling(target) {
    const isBefore = target === this.getPreviousSibling();
    if (!isBefore && target !== this.getNextSibling()) {
      {
        formatDevErrorMessage(`mergeWithSibling: sibling must be a previous or next sibling`);
      }
    }
    const key = this.__key;
    const targetKey = target.__key;
    const text = this.__text;
    const textLength = text.length;
    const compositionKey = $getCompositionKey();
    if (compositionKey === targetKey) {
      $setCompositionKey(key);
    }
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      if (anchor !== null && anchor.key === targetKey) {
        adjustPointOffsetForMergedSibling(anchor, isBefore, key, target, textLength);
      }
      if (focus !== null && focus.key === targetKey) {
        adjustPointOffsetForMergedSibling(focus, isBefore, key, target, textLength);
      }
    }
    const targetText = target.__text;
    const newText = isBefore ? targetText + text : text + targetText;
    this.setTextContent(newText);
    const writableSelf = this.getWritable();
    target.remove();
    return writableSelf;
  }
  /**
   * This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
   * when used with the registerLexicalTextEntity function. If you're using registerLexicalTextEntity, the
   * node class that you create and replace matched text with should return true from this method.
   *
   * @returns true if the node is to be treated as a "text entity", false otherwise.
   */
  isTextEntity() {
    return false;
  }
};
function convertSpanElement(domNode) {
  const span = domNode;
  const style = span.style;
  return {
    forChild: applyTextFormatFromStyle(style),
    node: null
  };
}
function convertBringAttentionToElement(domNode) {
  const b2 = domNode;
  const hasNormalFontWeight = b2.style.fontWeight === "normal";
  return {
    forChild: applyTextFormatFromStyle(b2.style, hasNormalFontWeight ? void 0 : "bold"),
    node: null
  };
}
var preParentCache = /* @__PURE__ */ new WeakMap();
function isNodePre(node) {
  if (!isHTMLElement(node)) {
    return false;
  } else if (node.nodeName === "PRE") {
    return true;
  }
  const whiteSpace = node.style.whiteSpace;
  return typeof whiteSpace === "string" && whiteSpace.startsWith("pre");
}
function findParentPreDOMNode(node) {
  let cached;
  let parent = node.parentNode;
  const visited = [node];
  while (parent !== null && (cached = preParentCache.get(parent)) === void 0 && !isNodePre(parent)) {
    visited.push(parent);
    parent = parent.parentNode;
  }
  const resultNode = cached === void 0 ? parent : cached;
  for (let i2 = 0; i2 < visited.length; i2++) {
    preParentCache.set(visited[i2], resultNode);
  }
  return resultNode;
}
function $convertTextDOMNode(domNode) {
  const domNode_ = domNode;
  const parentDom = domNode.parentElement;
  if (!(parentDom !== null)) {
    formatDevErrorMessage(`Expected parentElement of Text not to be null`);
  }
  let textContent = domNode_.textContent || "";
  if (findParentPreDOMNode(domNode_) !== null) {
    return {
      node: $generateNodesFromRawText(textContent)
    };
  }
  textContent = textContent.replace(/\r/g, "").replace(/[ \t\n]+/g, " ");
  if (textContent === "") {
    return {
      node: null
    };
  }
  if (textContent[0] === " ") {
    let previousText = domNode_;
    let isStartOfLine = true;
    while (previousText !== null && (previousText = findTextInLine(previousText, false)) !== null) {
      const previousTextContent = previousText.textContent || "";
      if (previousTextContent.length > 0) {
        if (/[ \t\n]$/.test(previousTextContent)) {
          textContent = textContent.slice(1);
        }
        isStartOfLine = false;
        break;
      }
    }
    if (isStartOfLine) {
      textContent = textContent.slice(1);
    }
  }
  if (textContent[textContent.length - 1] === " ") {
    let nextText = domNode_;
    let isEndOfLine = true;
    while (nextText !== null && (nextText = findTextInLine(nextText, true)) !== null) {
      const nextTextContent = (nextText.textContent || "").replace(/^( |\t|\r?\n)+/, "");
      if (nextTextContent.length > 0) {
        isEndOfLine = false;
        break;
      }
    }
    if (isEndOfLine) {
      textContent = textContent.slice(0, textContent.length - 1);
    }
  }
  if (textContent === "") {
    return {
      node: null
    };
  }
  return {
    node: $createTextNode(textContent)
  };
}
function findTextInLine(text, forward) {
  let node = text;
  while (true) {
    let sibling;
    while ((sibling = forward ? node.nextSibling : node.previousSibling) === null) {
      const parentElement = node.parentElement;
      if (parentElement === null) {
        return null;
      }
      node = parentElement;
    }
    node = sibling;
    if (isHTMLElement(node)) {
      const display = node.style.display;
      if (display === "" && !isInlineDomNode(node) || display !== "" && !display.startsWith("inline")) {
        return null;
      }
    }
    let descendant = node;
    while ((descendant = forward ? node.firstChild : node.lastChild) !== null) {
      node = descendant;
    }
    if (isDOMTextNode(node)) {
      return node;
    } else if (node.nodeName === "BR") {
      return null;
    }
  }
}
var nodeNameToTextFormat = {
  code: "code",
  em: "italic",
  i: "italic",
  mark: "highlight",
  s: "strikethrough",
  strong: "bold",
  sub: "subscript",
  sup: "superscript",
  u: "underline"
};
function convertTextFormatElement(domNode) {
  const format = nodeNameToTextFormat[domNode.nodeName.toLowerCase()];
  if (format === void 0) {
    return {
      node: null
    };
  }
  return {
    forChild: applyTextFormatFromStyle(domNode.style, format),
    node: null
  };
}
function $createTextNode(text = "") {
  return $applyNodeReplacement(new TextNode(text));
}
function $isTextNode(node) {
  return node instanceof TextNode;
}
function applyTextFormatFromStyle(style, shouldApply) {
  const fontWeight = style.fontWeight;
  const textDecoration = style.textDecoration.split(" ");
  const hasBoldFontWeight = fontWeight === "700" || fontWeight === "bold";
  const hasLinethroughTextDecoration = textDecoration.includes("line-through");
  const hasItalicFontStyle = style.fontStyle === "italic";
  const hasUnderlineTextDecoration = textDecoration.includes("underline");
  const verticalAlign = style.verticalAlign;
  const textTransform = style.textTransform;
  return (lexicalNode) => {
    if (!$isTextNode(lexicalNode) && !$isInlineFormattable(lexicalNode)) {
      return lexicalNode;
    }
    if (hasBoldFontWeight && !lexicalNode.hasFormat("bold")) {
      lexicalNode.toggleFormat("bold");
    }
    if (hasLinethroughTextDecoration && !lexicalNode.hasFormat("strikethrough")) {
      lexicalNode.toggleFormat("strikethrough");
    }
    if (hasItalicFontStyle && !lexicalNode.hasFormat("italic")) {
      lexicalNode.toggleFormat("italic");
    }
    if (hasUnderlineTextDecoration && !lexicalNode.hasFormat("underline")) {
      lexicalNode.toggleFormat("underline");
    }
    if (verticalAlign === "sub" && !lexicalNode.hasFormat("subscript")) {
      lexicalNode.toggleFormat("subscript");
    }
    if (verticalAlign === "super" && !lexicalNode.hasFormat("superscript")) {
      lexicalNode.toggleFormat("superscript");
    }
    if ((textTransform === "lowercase" || textTransform === "uppercase" || textTransform === "capitalize") && !lexicalNode.hasFormat(textTransform)) {
      lexicalNode.toggleFormat(textTransform);
    }
    if (shouldApply && !lexicalNode.hasFormat(shouldApply)) {
      lexicalNode.toggleFormat(shouldApply);
    }
    return lexicalNode;
  };
}
var TabNode = class extends TextNode {
  $config() {
    return this.config("tab", {
      extends: TextNode
    });
  }
  // `key` carries an explicit `undefined` default (rather than the usual `?`)
  // so the constructor reports zero required arguments, which lets `$config`
  // synthesize the static `clone` by invoking the no-argument constructor.
  constructor(key = void 0) {
    super("	", key);
    this.__detail = IS_UNMERGEABLE;
  }
  createDOM(config) {
    const dom = super.createDOM(config);
    const classNames = getCachedClassNameArray(config.theme, "tab");
    if (classNames !== void 0) {
      const domClassList = dom.classList;
      domClassList.add(...classNames);
    }
    return dom;
  }
  /**
   * Always normalizes the stored content to `'\t'` regardless of input — see
   * comment below for the rationale.
   */
  setTextContent(_text) {
    return super.setTextContent("	");
  }
  spliceText(offset, delCount, newText, moveSelection) {
    if (!(newText === "" && delCount === 0 || newText === "	" && delCount === 1)) {
      formatDevErrorMessage(`TabNode does not support spliceText`);
    }
    return this;
  }
  setDetail(detail) {
    if (!(detail === IS_UNMERGEABLE)) {
      formatDevErrorMessage(`TabNode does not support setDetail`);
    }
    return this;
  }
  setMode(type) {
    if (!(type === "normal")) {
      formatDevErrorMessage(`TabNode does not support setMode`);
    }
    return this;
  }
  canInsertTextBefore() {
    return false;
  }
  canInsertTextAfter() {
    return false;
  }
};
function $createTabNode() {
  return $applyNodeReplacement(new TabNode());
}
function $isTabNode(node) {
  return node instanceof TabNode;
}
var Point = class {
  key;
  offset;
  type;
  _selection;
  constructor(key, offset, type) {
    {
      Object.defineProperty(this, "_selection", {
        enumerable: false,
        writable: true
      });
    }
    this._selection = null;
    this.key = key;
    this.offset = offset;
    this.type = type;
  }
  is(point) {
    return this.key === point.key && this.offset === point.offset && this.type === point.type;
  }
  isBefore(b2) {
    if (this.key === b2.key) {
      return this.offset < b2.offset;
    }
    const aCaret = $normalizeCaret($caretFromPoint(this, "next"));
    const bCaret = $normalizeCaret($caretFromPoint(b2, "next"));
    return $comparePointCaretNext(aCaret, bCaret) < 0;
  }
  getNode() {
    const key = this.key;
    const node = $getNodeByKey(key);
    if (node === null) {
      {
        formatDevErrorMessage(`Point.getNode: node not found`);
      }
    }
    return node;
  }
  set(key, offset, type, onlyIfChanged) {
    const selection = this._selection;
    const oldKey = this.key;
    if (onlyIfChanged && this.key === key && this.offset === offset && this.type === type) {
      return;
    }
    this.key = key;
    this.offset = offset;
    this.type = type;
    {
      const node = $getNodeByKey(key);
      if (!(type === "text" ? $isTextNode(node) : $isElementNode(node))) {
        formatDevErrorMessage(`PointType.set: node with key ${key} is ${node ? node.__type : "[not found]"} and can not be used for a ${type} point`);
      }
    }
    if (!isCurrentlyReadOnlyMode()) {
      if ($getCompositionKey() === oldKey) {
        $setCompositionKey(key);
      }
      if (selection !== null) {
        selection.setCachedNodes(null);
        if ($isRangeSelection(selection)) {
          selection._cachedIsBackward = null;
        }
        selection.dirty = true;
      }
    }
  }
};
function $createPoint(key, offset, type) {
  return new Point(key, offset, type);
}
function selectPointOnNode(point, node) {
  let key = node.__key;
  let offset = point.offset;
  let type = "element";
  if ($isTextNode(node)) {
    type = "text";
    const textContentLength = node.getTextContentSize();
    if (offset > textContentLength) {
      offset = textContentLength;
    }
  } else if (!$isElementNode(node)) {
    const nextSibling = node.getNextSibling();
    if ($isTextNode(nextSibling)) {
      key = nextSibling.__key;
      offset = 0;
      type = "text";
    } else {
      const parentNode = node.getParent();
      if (parentNode) {
        key = parentNode.__key;
        offset = node.getIndexWithinParent() + 1;
      }
    }
  }
  point.set(key, offset, type);
}
function $moveSelectionPointToEnd(point, node) {
  if ($isElementNode(node)) {
    const lastNode = node.getLastDescendant();
    if ($isElementNode(lastNode) || $isTextNode(lastNode)) {
      selectPointOnNode(point, lastNode);
    } else {
      selectPointOnNode(point, node);
    }
  } else {
    selectPointOnNode(point, node);
  }
}
function $transferStartingElementPointToTextPoint(start, end, format, style) {
  const element = start.getNode();
  const placementNode = element.getChildAtIndex(start.offset);
  const textNode = $createTextNode();
  textNode.setFormat(format);
  textNode.setStyle(style);
  if ($isParagraphNode(placementNode)) {
    placementNode.splice(0, 0, [textNode]);
  } else if (placementNode !== null) {
    const target = $isRootOrShadowRoot(element) ? $createParagraphNode().append(textNode) : textNode;
    placementNode.insertBefore(target);
  } else if ($isRootOrShadowRoot(element)) {
    const lastChild = element.getLastChild();
    if ($isElementNode(lastChild) && !lastChild.isInline() && lastChild.isEmpty()) {
      lastChild.append(textNode);
    } else {
      element.append($createParagraphNode().append(textNode));
    }
  } else {
    element.append(textNode);
  }
  if (start.is(end)) {
    end.set(textNode.__key, 0, "text");
  }
  start.set(textNode.__key, 0, "text");
}
function $insertTextAtPoint(selection, text, format, style) {
  const anchorNode = selection.anchor.getNode();
  if (!$isTextNode(anchorNode)) {
    formatDevErrorMessage(`insertText: anchor is not a text node`);
  }
  const offset = selection.anchor.offset;
  const textNode = $createTextNode(text);
  textNode.setFormat(format);
  textNode.setStyle(style);
  const parent = anchorNode.getParentOrThrow();
  if (offset === 0) {
    if (parent.isInline() && !anchorNode.__prev) {
      parent.insertBefore(textNode);
    } else {
      anchorNode.insertBefore(textNode, false);
    }
  } else if (offset === anchorNode.getTextContentSize()) {
    if (parent.isInline() && !anchorNode.__next) {
      parent.insertAfter(textNode);
    } else {
      anchorNode.insertAfter(textNode, false);
    }
  } else {
    const [before] = anchorNode.splitText(offset);
    before.insertAfter(textNode, false);
  }
  if (anchorNode.getTextContent() === "" && anchorNode.isAttached()) {
    anchorNode.remove();
  }
  textNode.selectEnd();
  if (textNode.isComposing() && selection.anchor.type === "text") {
    selection.anchor.set(selection.anchor.key, selection.anchor.offset - text.length, selection.anchor.type);
  }
}
var NodeSelection = class _NodeSelection {
  _nodes;
  _cachedNodes;
  dirty;
  constructor(objects) {
    this._cachedNodes = null;
    this._nodes = objects;
    this.dirty = false;
  }
  getCachedNodes() {
    return this._cachedNodes;
  }
  setCachedNodes(nodes) {
    this._cachedNodes = nodes;
  }
  is(selection) {
    if (!$isNodeSelection(selection)) {
      return false;
    }
    const a2 = this._nodes;
    const b2 = selection._nodes;
    return a2.size === b2.size && Array.from(a2).every((key) => b2.has(key));
  }
  isCollapsed() {
    return false;
  }
  isBackward() {
    return false;
  }
  getStartEndPoints() {
    return null;
  }
  add(key) {
    this.dirty = true;
    this._nodes.add(key);
    this._cachedNodes = null;
  }
  delete(key) {
    this.dirty = true;
    this._nodes.delete(key);
    this._cachedNodes = null;
  }
  clear() {
    this.dirty = true;
    this._nodes.clear();
    this._cachedNodes = null;
  }
  has(key) {
    return this._nodes.has(key);
  }
  clone() {
    return new _NodeSelection(new Set(this._nodes));
  }
  extract() {
    return this.getNodes();
  }
  insertRawText(text) {
  }
  insertText() {
  }
  insertNodes(nodes) {
    const selectedNodes = this.getNodes().filter((node) => $getSlotHostKey(node) === null);
    const selectedNodesLength = selectedNodes.length;
    if (selectedNodesLength === 0) {
      return;
    }
    const lastSelectedNode = selectedNodes[selectedNodesLength - 1];
    let selectionAtEnd;
    if ($isTextNode(lastSelectedNode)) {
      selectionAtEnd = lastSelectedNode.select();
    } else {
      const index = lastSelectedNode.getIndexWithinParent() + 1;
      selectionAtEnd = lastSelectedNode.getParentOrThrow().select(index, index);
    }
    selectionAtEnd.insertNodes(nodes);
    for (let i2 = 0; i2 < selectedNodesLength; i2++) {
      selectedNodes[i2].remove();
    }
  }
  getNodes() {
    const cachedNodes = this._cachedNodes;
    if (cachedNodes !== null) {
      return cachedNodes;
    }
    const objects = this._nodes;
    const nodes = [];
    for (const object of objects) {
      const node = $getNodeByKey(object);
      if (node !== null) {
        nodes.push(node);
      }
    }
    if (!isCurrentlyReadOnlyMode()) {
      this._cachedNodes = nodes;
    }
    return nodes;
  }
  getTextContent() {
    const nodes = this.getNodes();
    let textContent = "";
    for (let i2 = 0; i2 < nodes.length; i2++) {
      textContent += nodes[i2].getTextContent();
    }
    return textContent;
  }
  /**
   * Remove all nodes in the NodeSelection. If there were any nodes,
   * replace the selection with a new RangeSelection at the previous
   * location of the first node.
   */
  deleteNodes() {
    const nodes = this.getNodes().filter((node) => $getSlotHostKey(node) === null);
    if (($getSelection() || $getPreviousSelection()) === this && nodes[0]) {
      const firstCaret = $getSiblingCaret(nodes[0], "next");
      $setSelectionFromCaretRange($getCaretRange(firstCaret, firstCaret));
    }
    for (const node of nodes) {
      node.remove();
    }
    $ensureRootHasParagraph();
  }
};
function $ensureRootHasParagraph() {
  const root = $getRoot();
  if (root.isEmpty()) {
    const paragraph = $createParagraphNode();
    root.append(paragraph);
    paragraph.select();
  }
}
function $getNodeBeforePoint(point) {
  const node = point.getNode();
  if (point.offset > 0) {
    return point.type === "element" && $isElementNode(node) ? node.getChildAtIndex(point.offset - 1) : null;
  }
  for (let child = node; child !== null && !INTERNAL_$isBlock(child) && !$isRootOrShadowRoot(child); child = child.getParent()) {
    const previousSibling = child.getPreviousSibling();
    if (previousSibling !== null) {
      return previousSibling;
    }
  }
  return null;
}
function $isPointAfterEmptyLine(point) {
  const nodeBefore = $getNodeBeforePoint(point);
  return $isLineBreakNode(nodeBefore) && $isLineBreakNode(nodeBefore.getPreviousSibling());
}
function $isRangeSelection(x2) {
  return x2 instanceof RangeSelection;
}
var RangeSelection = class _RangeSelection {
  format;
  style;
  anchor;
  focus;
  _cachedNodes;
  /** @internal */
  _cachedIsBackward;
  dirty;
  constructor(anchor, focus, format, style) {
    this.anchor = anchor;
    this.focus = focus;
    anchor._selection = this;
    focus._selection = this;
    this._cachedNodes = null;
    this._cachedIsBackward = null;
    this.format = format;
    this.style = style;
    this.dirty = false;
  }
  getCachedNodes() {
    return this._cachedNodes;
  }
  setCachedNodes(nodes) {
    this._cachedNodes = nodes;
  }
  /**
   * Used to check if the provided selections is equal to this one by value,
   * including anchor, focus, format, and style properties.
   * @param selection - the Selection to compare this one to.
   * @returns true if the Selections are equal, false otherwise.
   */
  is(selection) {
    if (!$isRangeSelection(selection)) {
      return false;
    }
    return this.anchor.is(selection.anchor) && this.focus.is(selection.focus) && this.format === selection.format && this.style === selection.style;
  }
  /**
   * Returns whether the Selection is "collapsed", meaning the anchor and focus are
   * the same node and have the same offset.
   *
   * @returns true if the Selection is collapsed, false otherwise.
   */
  isCollapsed() {
    return this.anchor.is(this.focus);
  }
  /**
   * Gets all the nodes in the Selection. Uses caching to make it generally suitable
   * for use in hot paths.
   *
   * See also the {@link CaretRange} APIs (starting with
   * {@link $caretRangeFromSelection}), which are likely to provide a better
   * foundation for any operation where partial selection is relevant
   * (e.g. the anchor or focus are inside an ElementNode and TextNode)
   *
   * @returns an Array containing all the nodes in the Selection
   */
  getNodes() {
    const cachedNodes = this._cachedNodes;
    if (cachedNodes !== null) {
      return cachedNodes;
    }
    const range = $getCaretRangeInDirection($caretRangeFromSelection(this), "next");
    const nodes = $getNodesFromCaretRangeCompat(range);
    {
      if (this.isCollapsed() && nodes.length > 1) {
        {
          formatDevErrorMessage(`RangeSelection.getNodes() returned ${String(nodes.length)} > 1 nodes in a collapsed selection`);
        }
      }
    }
    if (!isCurrentlyReadOnlyMode()) {
      this._cachedNodes = nodes;
    }
    return nodes;
  }
  /**
   * Sets this Selection to be of type "text" at the provided anchor and focus values.
   *
   * @param anchorNode - the anchor node to set on the Selection
   * @param anchorOffset - the offset to set on the Selection
   * @param focusNode - the focus node to set on the Selection
   * @param focusOffset - the focus offset to set on the Selection
   */
  setTextNodeRange(anchorNode, anchorOffset, focusNode, focusOffset) {
    this.anchor.set(anchorNode.__key, anchorOffset, "text");
    this.focus.set(focusNode.__key, focusOffset, "text");
    return this;
  }
  /**
   * Gets the (plain) text content of all the nodes in the selection.
   *
   * @returns a string representing the text content of all the nodes in the Selection
   */
  getTextContent() {
    const nodes = this.getNodes();
    if (nodes.length === 0) {
      return "";
    }
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const anchor = this.anchor;
    const focus = this.focus;
    const isBefore = anchor.isBefore(focus);
    const [anchorOffset, focusOffset] = $getCharacterOffsets(this);
    let textContent = "";
    let prevWasElement = true;
    for (let i2 = 0; i2 < nodes.length; i2++) {
      const node = nodes[i2];
      if ($isElementNode(node) && !node.isInline()) {
        if (!prevWasElement) {
          textContent += "\n";
        }
        let slotText = "";
        for (const slotName of $getSlotNames(node)) {
          const slot = $getSlot(node, slotName);
          if (slot !== null) {
            slotText += slot.getTextContent();
          }
        }
        if (slotText !== "") {
          textContent += slotText;
          prevWasElement = false;
        } else if (node.isEmpty()) {
          prevWasElement = false;
        } else {
          prevWasElement = true;
        }
      } else {
        prevWasElement = false;
        if ($isTextNode(node)) {
          let text = node.getTextContent();
          if (node === firstNode) {
            if (node === lastNode) {
              if (anchor.type !== "element" || focus.type !== "element" || focus.offset === anchor.offset) {
                text = anchorOffset < focusOffset ? text.slice(anchorOffset, focusOffset) : text.slice(focusOffset, anchorOffset);
              }
            } else {
              text = isBefore ? text.slice(anchorOffset) : text.slice(focusOffset);
            }
          } else if (node === lastNode) {
            text = isBefore ? text.slice(0, focusOffset) : text.slice(0, anchorOffset);
          }
          textContent += text;
        } else if (($isDecoratorNode(node) || $isLineBreakNode(node)) && (node !== lastNode || !this.isCollapsed())) {
          textContent += node.getTextContent();
        }
      }
    }
    return textContent;
  }
  /**
   * Attempts to map a DOM selection range onto this Lexical Selection,
   * setting the anchor, focus, and type accordingly
   *
   * @param range a DOM Selection range conforming to the StaticRange interface.
   */
  applyDOMRange(range) {
    const editor = getActiveEditor();
    const currentEditorState = editor.getEditorState();
    const lastSelection = currentEditorState._selection;
    const resolvedSelectionPoints = $internalResolveSelectionPoints(range.startContainer, range.startOffset, range.endContainer, range.endOffset, editor, lastSelection);
    if (resolvedSelectionPoints === null) {
      return;
    }
    const [anchorPoint, focusPoint, dirty] = resolvedSelectionPoints;
    this.anchor.set(anchorPoint.key, anchorPoint.offset, anchorPoint.type, true);
    this.focus.set(focusPoint.key, focusPoint.offset, focusPoint.type, true);
    if (dirty) {
      this.dirty = true;
    }
    $normalizeSelection(this);
  }
  /**
   * Creates a new RangeSelection, copying over all the property values from this one.
   *
   * @returns a new RangeSelection with the same property values as this one.
   */
  clone() {
    const anchor = this.anchor;
    const focus = this.focus;
    const selection = new _RangeSelection($createPoint(anchor.key, anchor.offset, anchor.type), $createPoint(focus.key, focus.offset, focus.type), this.format, this.style);
    return selection;
  }
  /**
   * Toggles the provided format on all the TextNodes in the Selection.
   *
   * @param format a string TextFormatType to toggle on the TextNodes in the selection
   */
  toggleFormat(format) {
    this.format = toggleTextFormatType(this.format, format, null);
    this.dirty = true;
  }
  /**
   * Sets the value of the format property on the Selection
   *
   * @param format - the format to set at the value of the format property.
   */
  setFormat(format) {
    this.format = format;
    this.dirty = true;
  }
  /**
   * Sets the value of the style property on the Selection
   *
   * @param style - the style to set at the value of the style property.
   */
  setStyle(style) {
    this.style = style;
    this.dirty = true;
  }
  /**
   * Returns whether the provided TextFormatType is present on the Selection. This will be true if all text nodes in the Selection
   * have the specified format.
   *
   * @param type the TextFormatType to check for.
   * @returns true if the provided format is currently toggled on the Selection, false otherwise.
   */
  hasFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return (this.format & formatFlag) !== 0;
  }
  /**
   * Attempts to insert the provided text into the EditorState at the current Selection.
   * converts tabs, newlines, and carriage returns into LexicalNodes.
   *
   * @param text the text to insert into the Selection
   */
  insertRawText(text) {
    this.insertNodes($generateNodesFromRawText(text));
  }
  /**
   * Insert the provided text into the EditorState at the current Selection.
   *
   * @param text the text to insert into the Selection
   */
  insertText(text) {
    let format = this.format;
    let style = this.style;
    if (!this.isCollapsed()) {
      const firstPoint = this.focus.isBefore(this.anchor) ? this.focus : this.anchor;
      const firstNode = firstPoint.getNode();
      if ($isTextNode(firstNode)) {
        format = firstNode.getFormat();
        style = firstNode.getStyle();
      }
      this.removeText();
      this.format = format;
      this.style = style;
      if (text === "") {
        return;
      }
      if ($getCompositionKey() === null) {
        if (this.anchor.type === "element") {
          $transferStartingElementPointToTextPoint(this.anchor, this.focus, format, style);
        }
        $insertTextAtPoint(this, text, format, style);
        return;
      }
    }
    if (this.anchor.type === "element") {
      $transferStartingElementPointToTextPoint(this.anchor, this.focus, format, style);
    }
    const anchorNode = this.anchor.getNode();
    if (!$isTextNode(anchorNode)) {
      formatDevErrorMessage(`insertText: anchor is not a text node`);
    }
    const offset = this.anchor.offset;
    const anchorParent = anchorNode.getParentOrThrow();
    const anchorSize = anchorNode.getTextContentSize();
    const needsRedirect = $isTokenOrSegmented(anchorNode) || offset === 0 && (!anchorNode.canInsertTextBefore() || !anchorParent.canInsertTextBefore() && !anchorNode.__prev) || offset === anchorSize && (!anchorNode.canInsertTextAfter() || !anchorParent.canInsertTextAfter() && !anchorNode.__next);
    if (needsRedirect) {
      if (anchorNode.isSegmented() && offset !== 0 && offset !== anchorSize) {
        if ($getCompositionKey() !== null) {
          anchorNode.setMode("normal").setFormat(format).setStyle(style);
        } else {
          const replacement = $createTextNode(anchorNode.getTextContent());
          replacement.setFormat(format);
          replacement.setStyle(style);
          const isCurrentSelection = $getSelection() === this;
          anchorNode.replace(replacement);
          this.setTextNodeRange(replacement, offset, replacement, offset);
          if (isCurrentSelection && $getSelection() !== this) {
            $setSelection(this);
          }
        }
        if (text !== "") {
          this.insertText(text);
        }
        return;
      }
      if (text === "") {
        return;
      }
      if (offset === 0) {
        const prev = anchorNode.getPreviousSibling();
        if ($isTextNode(prev) && prev.canInsertTextAfter() && !$isTokenOrSegmented(prev)) {
          prev.select();
        } else {
          const newNode2 = $createTextNode();
          newNode2.setFormat(format);
          newNode2.setStyle(style);
          if (!anchorParent.canInsertTextBefore()) {
            anchorParent.insertBefore(newNode2);
          } else {
            anchorNode.insertBefore(newNode2);
          }
          newNode2.select();
        }
        this.insertText(text);
        return;
      } else if (offset === anchorSize) {
        const next = anchorNode.getNextSibling();
        if ($isTextNode(next) && next.canInsertTextBefore() && !$isTokenOrSegmented(next)) {
          next.select(0, 0);
        } else {
          const newNode2 = $createTextNode();
          newNode2.setFormat(format);
          newNode2.setStyle(style);
          if (!anchorParent.canInsertTextAfter()) {
            anchorParent.insertAfter(newNode2);
          } else {
            anchorNode.insertAfter(newNode2);
          }
          newNode2.select(0, 0);
        }
        this.insertText(text);
        return;
      }
      const newNode = $createTextNode(text);
      newNode.setFormat(format);
      newNode.setStyle(style);
      anchorNode.replace(newNode);
      newNode.select();
      return;
    }
    if (text === "") {
      return;
    }
    const atStartOfInline = anchorParent.isInline() && offset === 0 && !anchorNode.__prev;
    const atEndOfInline = anchorParent.isInline() && offset === anchorSize && !anchorNode.__next;
    const formatDiffers = anchorNode.getFormat() !== format || anchorNode.getStyle() !== style;
    if (atStartOfInline || atEndOfInline || formatDiffers) {
      if (anchorNode.getTextContent() === "" && !atStartOfInline && !atEndOfInline) {
        anchorNode.setFormat(format);
        anchorNode.setStyle(style);
      } else {
        $insertTextAtPoint(this, text, format, style);
        return;
      }
    }
    anchorNode.spliceText(offset, 0, text, true);
    if (anchorNode.isComposing() && this.anchor.type === "text") {
      this.anchor.set(this.anchor.key, this.anchor.offset - text.length, this.anchor.type);
    }
  }
  /**
   * Removes the text in the Selection, adjusting the EditorState accordingly.
   */
  removeText() {
    const isCurrentSelection = $getSelection() === this;
    const previousAnchorKey = this.anchor.key;
    const newRange = $removeTextFromCaretRange($caretRangeFromSelection(this));
    $updateRangeSelectionFromCaretRange(this, newRange);
    if (this.isCollapsed()) {
      $internalRefreshSelectionFormatAndStyle(this, previousAnchorKey);
    }
    if (isCurrentSelection && $getSelection() !== this) {
      $setSelection(this);
    }
  }
  // TO-DO: Migrate this method to the new utility function $forEachSelectedTextNode (share similar logic)
  /**
   * Applies the provided format to the TextNodes in the Selection, splitting or
   * merging nodes as necessary.
   *
   * @param formatType the format type to apply to the nodes in the Selection.
   * @param alignWithFormat a 32-bit integer representing formatting flags to align with.
   */
  formatText(formatType, alignWithFormat = null) {
    $formatText(this, formatType, alignWithFormat);
  }
  /**
   * Attempts to "intelligently" insert an arbitrary list of Lexical nodes into the EditorState at the
   * current Selection according to a set of heuristics that determine how surrounding nodes
   * should be changed, replaced, or moved to accommodate the incoming ones.
   *
   * @param nodes - the nodes to insert
   */
  insertNodes(nodes) {
    if (nodes.length === 0) {
      return;
    }
    if (!this.isCollapsed()) {
      this.removeText();
    }
    const anchorNode = this.anchor.getNode();
    if (this.anchor.type === "element" && $isElementNode(anchorNode) && anchorNode.isShadowRoot() && $getSlotHostKey(anchorNode) !== null) {
      let firstChild = anchorNode.getFirstChild() ?? anchorNode.append($createParagraphNode()).getFirstChild();
      if (firstChild !== null && !$isElementNode(firstChild)) {
        const seed = $createParagraphNode();
        firstChild.insertBefore(seed);
        firstChild = seed;
      }
      if (firstChild !== null) {
        firstChild.selectStart();
        const redirected = $getSelection();
        if (!$isRangeSelection(redirected)) {
          formatDevErrorMessage(`Expected RangeSelection after redirecting into slot subtree`);
        }
        return redirected.insertNodes(nodes);
      }
    }
    if (this.anchor.type === "element" && $isRootOrShadowRoot(anchorNode)) {
      const blocksParent2 = $wrapInlineNodes(nodes);
      const nodeToSelect2 = blocksParent2.getLastDescendant();
      anchorNode.splice(this.anchor.offset, 0, blocksParent2.getChildren());
      if (nodeToSelect2 !== null) {
        nodeToSelect2.selectEnd();
      }
      return;
    }
    const firstPoint = this.isBackward() ? this.focus : this.anchor;
    let firstNode = firstPoint.getNode();
    let firstBlock = $findMatchingParent(firstNode, INTERNAL_$isBlock);
    const last = nodes[nodes.length - 1];
    if ($isElementNode(firstBlock) && "__language" in firstBlock) {
      if ("__language" in nodes[0]) {
        this.insertText(nodes[0].getTextContent());
      } else {
        const [, index] = $removeTextAndSplitBlock(this);
        firstBlock.splice(index, 0, nodes);
        last.selectEnd();
      }
      return;
    }
    const notInline = (node) => ($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline();
    if (!nodes.some(notInline)) {
      if (!$isElementNode(firstBlock)) {
        formatDevErrorMessage(`Expected node ${firstNode.constructor.name} of type ${firstNode.getType()} to have a block ElementNode ancestor`);
      }
      const [container, index] = $removeTextAndSplitBlock(this, true);
      const insertionParent = $isElementNode(container) ? container : firstBlock;
      insertionParent.splice(index, 0, nodes);
      last.selectEnd();
      return;
    }
    if ($isElementNode(firstBlock) && $getSlotHostKey(firstBlock) !== null) {
      const [, index] = $removeTextAndSplitBlock(this);
      const inlineNodes = $extractInlineFromBlocks(nodes);
      firstBlock.splice(index, 0, inlineNodes);
      const lastInserted = inlineNodes[inlineNodes.length - 1];
      if (lastInserted !== void 0) {
        lastInserted.selectEnd();
      } else {
        firstBlock.select(index, index);
      }
      return;
    }
    if (firstBlock === null) {
      const blocksParent2 = $wrapInlineNodes(nodes);
      const nodeToSelect2 = blocksParent2.getLastDescendant();
      let caret = $caretFromPoint(this.anchor, "next");
      for (const block of blocksParent2.getChildren()) {
        caret = $insertNodeToNearestRootAtCaret(block, caret);
      }
      if (nodeToSelect2 !== null) {
        nodeToSelect2.selectEnd();
      }
      return;
    }
    if ($isElementNode(firstBlock) && !firstBlock.isParentRequired() && !$isRootOrShadowRoot(firstBlock.getParentOrThrow())) {
      const [, index] = $removeTextAndSplitBlock(this);
      const inlineNodes = $extractInlineFromBlocks(nodes);
      firstBlock.splice(index, 0, inlineNodes);
      const lastInserted = inlineNodes[inlineNodes.length - 1];
      if (lastInserted !== void 0) {
        lastInserted.selectEnd();
      } else {
        firstBlock.select(index, index);
      }
      return;
    }
    const blocksParent = $wrapInlineNodes(nodes);
    const nodeToSelect = blocksParent.getLastDescendant();
    const blocks = blocksParent.getChildren();
    const isAfterEmptyLine = $isPointAfterEmptyLine(firstPoint);
    const isMergeable = (node) => !isAfterEmptyLine && $isElementNode(node) && INTERNAL_$isBlock(node) && !node.isEmpty() && $isElementNode(firstBlock) && (!firstBlock.isEmpty() || firstBlock.canMergeWhenEmpty());
    const shouldInsert = !$isElementNode(firstBlock) || !firstBlock.isEmpty();
    const insertedParagraph = shouldInsert ? this.insertParagraph() : null;
    if (insertedParagraph && !firstBlock.isAttached()) {
      firstNode = this.anchor.getNode();
      firstBlock = $findMatchingParent(firstNode, INTERNAL_$isBlock);
    }
    const lastToInsert = blocks[blocks.length - 1];
    let firstToInsert = blocks[0];
    if (isMergeable(firstToInsert)) {
      if (!$isElementNode(firstBlock)) {
        formatDevErrorMessage(`Expected node ${firstNode.constructor.name} of type ${firstNode.getType()} to have a block ElementNode ancestor`);
      }
      firstBlock.append(...firstToInsert.getChildren());
      firstToInsert = blocks[1];
    }
    if (firstToInsert) {
      if (!(firstBlock !== null)) {
        formatDevErrorMessage(`Expected node ${firstNode.constructor.name} of type ${firstNode.getType()} to have a block ancestor`);
      }
      insertRangeAfter(firstBlock, firstToInsert);
    }
    const lastInsertedBlock = $findMatchingParent(nodeToSelect, INTERNAL_$isBlock);
    const insertSelection = nodeToSelect.selectEnd();
    if (insertedParagraph) {
      if ($isElementNode(lastInsertedBlock) && (insertedParagraph.canMergeWhenEmpty() || INTERNAL_$isBlock(lastToInsert))) {
        lastInsertedBlock.append(...insertedParagraph.getChildren());
        insertedParagraph.remove();
      } else if (insertedParagraph.isEmpty()) {
        insertedParagraph.remove();
      }
    }
    if ($isElementNode(firstBlock) && firstBlock.isEmpty()) {
      firstBlock.remove();
    }
    const lastChild = $isElementNode(firstBlock) ? firstBlock.getLastChild() : null;
    if ($isLineBreakNode(lastChild) && lastInsertedBlock !== firstBlock) {
      lastChild.remove();
    }
    const normalizedCaret = $normalizeCaret($caretFromPoint(insertSelection.anchor, "next"));
    $setPointFromCaret(insertSelection.anchor, normalizedCaret);
    $setPointFromCaret(insertSelection.focus, normalizedCaret);
  }
  /**
   * Inserts a new ParagraphNode into the EditorState at the current Selection
   *
   * @returns the newly inserted node.
   */
  insertParagraph() {
    if (!this.isCollapsed()) {
      this.removeText();
    }
    const anchorNode = this.anchor.getNode();
    if (this.anchor.type === "element" && $isRootOrShadowRoot(anchorNode)) {
      const paragraph = $createParagraphNode();
      anchorNode.splice(this.anchor.offset, 0, [paragraph]);
      paragraph.select();
      return paragraph;
    }
    const [, index] = $removeTextAndSplitBlock(this);
    const block = $findMatchingParent(this.anchor.getNode(), INTERNAL_$isBlock);
    if (block !== null && $getSlotHostKey(block) !== null) {
      return null;
    }
    if (!$isElementNode(block)) {
      formatDevErrorMessage(`Expected ancestor to be a block ElementNode`);
    }
    const firstToAppend = block.getChildAtIndex(index);
    const nodesToInsert = firstToAppend ? [firstToAppend, ...firstToAppend.getNextSiblings()] : [];
    const newBlock = block.insertNewAfter(this, false);
    if (newBlock) {
      newBlock.append(...nodesToInsert);
      newBlock.selectStart();
      return newBlock;
    }
    return null;
  }
  /**
   * Inserts a logical linebreak, which may be a new LineBreakNode or a new ParagraphNode, into the EditorState at the
   * current Selection.
   */
  insertLineBreak(selectStart) {
    const lineBreak = $createLineBreakNode();
    this.insertNodes([lineBreak]);
    if (selectStart) {
      const parent = lineBreak.getParentOrThrow();
      const index = lineBreak.getIndexWithinParent();
      parent.select(index, index);
    }
  }
  /**
   * Extracts the nodes in the Selection, splitting nodes where necessary
   * to get offset-level precision.
   *
   * @returns The nodes in the Selection
   */
  extract() {
    const selectedNodes = [...this.getNodes()];
    const selectedNodesLength = selectedNodes.length;
    let firstNode = selectedNodes[0];
    let lastNode = selectedNodes[selectedNodesLength - 1];
    const [anchorOffset, focusOffset] = $getCharacterOffsets(this);
    const isBackward = this.isBackward();
    const [startPoint, endPoint] = isBackward ? [this.focus, this.anchor] : [this.anchor, this.focus];
    const [startOffset, endOffset] = isBackward ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset];
    if (selectedNodesLength === 0) {
      return [];
    } else if (selectedNodesLength === 1) {
      if ($isTextNode(firstNode) && !this.isCollapsed()) {
        const splitNodes = firstNode.splitText(startOffset, endOffset);
        const node = startOffset === 0 ? splitNodes[0] : splitNodes[1];
        if (node) {
          startPoint.set(node.getKey(), 0, "text");
          endPoint.set(node.getKey(), node.getTextContentSize(), "text");
          return [node];
        }
        return [];
      }
      return [firstNode];
    }
    if ($isTextNode(firstNode)) {
      if (startOffset === firstNode.getTextContentSize()) {
        selectedNodes.shift();
      } else if (startOffset !== 0) {
        [, firstNode] = firstNode.splitText(startOffset);
        selectedNodes[0] = firstNode;
        startPoint.set(firstNode.getKey(), 0, "text");
      }
    }
    if ($isTextNode(lastNode)) {
      const lastNodeText = lastNode.getTextContent();
      const lastNodeTextLength = lastNodeText.length;
      if (endOffset === 0) {
        selectedNodes.pop();
      } else if (endOffset !== lastNodeTextLength) {
        [lastNode] = lastNode.splitText(endOffset);
        selectedNodes[selectedNodes.length - 1] = lastNode;
        endPoint.set(lastNode.getKey(), lastNode.getTextContentSize(), "text");
      }
    }
    return selectedNodes;
  }
  /**
   * Modifies the Selection according to the parameters and a set of heuristics that account for
   * various node types. Can be used to safely move or extend selection by one logical "unit" without
   * dealing explicitly with all the possible node types.
   *
   * @param alter the type of modification to perform
   * @param isBackward whether or not selection is backwards
   * @param granularity the granularity at which to apply the modification
   */
  modify(alter, isBackward, granularity) {
    if ($modifySelectionAroundDecoratorsAndBlocks(this, alter, isBackward, granularity)) {
      return;
    }
    const collapse = alter === "move";
    const editor = getActiveEditor();
    const domSelection = getDOMSelection(getWindow(editor));
    if (!domSelection) {
      return;
    }
    const blockCursorElement = editor._blockCursorElement;
    const rootElement = editor._rootElement;
    const focusNode = this.focus.getNode();
    if (rootElement !== null && blockCursorElement !== null && $isElementNode(focusNode) && !focusNode.isInline() && !focusNode.canBeEmpty()) {
      removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
    }
    const focusKeyedDOM = getElementByKeyOrThrow(editor, this.focus.key);
    let nextFocusDOM = focusKeyedDOM;
    if (this.focus.type === "text") {
      nextFocusDOM = $isTextNode(focusNode) ? $getDOMTextNode(focusNode, focusKeyedDOM, editor) : null;
    }
    if (this.dirty) {
      const anchorKeyedDOM = getElementByKeyOrThrow(editor, this.anchor.key);
      let nextAnchorDOM = anchorKeyedDOM;
      if (this.anchor.type === "text") {
        const node = this.anchor.getNode();
        nextAnchorDOM = $isTextNode(node) ? $getDOMTextNode(node, anchorKeyedDOM, editor) : null;
      }
      if (nextAnchorDOM && nextFocusDOM) {
        setDOMSelectionBaseAndExtent(domSelection, nextAnchorDOM, this.anchor.offset, nextFocusDOM, this.focus.offset);
      }
    }
    if (granularity === "character" && $isTextNode(focusNode) && focusNode.isUnmergeable()) {
      const atBoundary = isBackward ? this.focus.offset === 0 : this.focus.offset === focusNode.getTextContentSize();
      if (atBoundary) {
        const sibling = $getSiblingCaret(focusNode, isBackward ? "previous" : "next").getNodeAtCaret();
        if ($isTextNode(sibling)) {
          if (collapse) {
            const sibKeyedDOM = editor.getElementByKey(sibling.getKey());
            const sibDOM = sibKeyedDOM ? $getDOMTextNode(sibling, sibKeyedDOM, editor) : null;
            if (sibDOM) {
              const sibOffset = isBackward ? sibDOM.length : 0;
              setDOMSelectionBaseAndExtent(domSelection, sibDOM, sibOffset, sibDOM, sibOffset);
            }
          } else {
            const sibLen = sibling.getTextContentSize();
            if (isBackward) {
              this.focus.set(sibling.__key, sibLen - 1, "text");
            } else {
              this.focus.set(sibling.__key, 1, "text");
            }
            this.dirty = true;
            return;
          }
        }
      }
    }
    moveNativeSelection(domSelection, alter, isBackward ? "backward" : "forward", granularity, rootElement);
    if (domSelection.rangeCount > 0) {
      const composedRange = getComposedStaticRange(domSelection, editor._rootElement);
      const range = composedRange || domSelection.getRangeAt(0);
      const anchorNode = this.anchor.getNode();
      const root = $isRootNode(anchorNode) ? anchorNode : $getNearestRootOrShadowRoot(anchorNode);
      this.applyDOMRange(range);
      this.dirty = true;
      if (!collapse) {
        $shrinkSelectionToRoot(this, isBackward, root);
        const anchorIsAtRangeStart = composedRange ? domSelection.direction !== "backward" : domSelection.anchorNode === range.startContainer && domSelection.anchorOffset === range.startOffset;
        if (!anchorIsAtRangeStart) {
          $swapPoints(this);
        }
      }
    }
    if (granularity === "lineboundary") {
      $modifySelectionAroundDecoratorsAndBlocks(this, alter, isBackward, granularity, "decorators");
    }
  }
  /**
   * Helper for handling forward character and word deletion that prevents element nodes
   * like a table, columns layout being destroyed
   *
   * @param anchor the anchor
   * @param anchorNode the anchor node in the selection
   * @param isBackward whether or not selection is backwards
   */
  forwardDeletion(anchor, anchorNode, isBackward) {
    if (!isBackward && // Delete forward handle case
    (anchor.type === "element" && $isElementNode(anchorNode) && anchor.offset === anchorNode.getChildrenSize() || anchor.type === "text" && anchor.offset === anchorNode.getTextContentSize())) {
      const parent = anchorNode.getParent();
      const nextSibling = anchorNode.getNextSibling() || (parent === null ? null : parent.getNextSibling());
      if ($isElementNode(nextSibling) && nextSibling.isShadowRoot()) {
        return true;
      }
    }
    return false;
  }
  /**
   * Performs one logical character deletion operation on the EditorState based on the current Selection.
   * Handles different node types.
   *
   * @param isBackward whether or not the selection is backwards.
   */
  deleteCharacter(isBackward) {
    const wasCollapsed = this.isCollapsed();
    if (this.isCollapsed()) {
      const anchor = this.anchor;
      let anchorNode = anchor.getNode();
      if (this.forwardDeletion(anchor, anchorNode, isBackward)) {
        const nextSibling = $isElementNode(anchorNode) ? anchorNode.getNextSibling() : null;
        if (!($isElementNode(anchorNode) && anchorNode.isEmpty() && $isElementNode(nextSibling) && nextSibling.isShadowRoot())) {
          return;
        }
      }
      const direction = isBackward ? "previous" : "next";
      const initialCaret = $caretFromPoint(anchor, direction);
      const initialRange = $extendCaretToRange(initialCaret);
      if (initialRange.getTextSlices().every((slice) => slice === null || slice.distance === 0)) {
        if (anchor.type === "element") {
          const adjacent = initialCaret.getNodeAtCaret();
          if ($isElementNode(adjacent) && $needsBlockCursorBeside(adjacent)) {
            const container = adjacent.getParent();
            adjacent.remove();
            const restored = $restoreEmptyContainerParagraph(container, adjacent);
            if (restored !== null) {
              restored.selectStart();
            }
            return;
          }
        }
        let state = {
          type: "initial"
        };
        for (const caret of initialRange.iterNodeCarets("shadowRoot")) {
          if ($isChildCaret(caret)) {
            if (caret.origin.isInline()) ;
            else if (caret.origin.isShadowRoot()) {
              if (state.type === "merge-block") {
                break;
              }
              if ($isElementNode(initialRange.anchor.origin) && initialRange.anchor.origin.isEmpty()) {
                const normCaret = $normalizeCaret(caret);
                $updateRangeSelectionFromCaretRange(this, $getCaretRange(normCaret, normCaret));
                initialRange.anchor.origin.remove();
              }
              return;
            } else if (state.type === "merge-next-block" || state.type === "merge-block") {
              state = {
                block: state.block,
                caret,
                type: "merge-block"
              };
            }
          } else if (state.type === "merge-block") {
            break;
          } else if ($isSiblingCaret(caret)) {
            if ($isElementNode(caret.origin)) {
              if (!caret.origin.isInline()) {
                state = {
                  block: caret.origin,
                  type: "merge-next-block"
                };
              } else if (!caret.origin.isParentOf(initialRange.anchor.origin)) {
                break;
              }
              continue;
            } else if ($isDecoratorNode(caret.origin)) {
              if (caret.origin.isIsolated()) ;
              else if (state.type === "merge-next-block" && (caret.origin.isKeyboardSelectable() || !caret.origin.isInline()) && $isElementNode(initialRange.anchor.origin) && initialRange.anchor.origin.isEmpty()) {
                initialRange.anchor.origin.remove();
                const nodeSelection = $createNodeSelection();
                nodeSelection.add(caret.origin.getKey());
                $setSelection(nodeSelection);
              } else {
                const decorator = caret.origin;
                const container = decorator.getParent();
                decorator.remove();
                const restored = $restoreEmptyContainerParagraph(container, decorator);
                if (restored !== null) {
                  restored.selectStart();
                }
              }
              return;
            } else if ($isLineBreakNode(caret.origin)) {
              caret.origin.remove();
              return;
            }
            break;
          }
        }
        if (state.type === "merge-block") {
          const {
            caret,
            block
          } = state;
          if ($getSlotNames(block).length > 0) {
            return;
          }
          if (caret.origin.isEmpty() && !block.isEmpty() && caret.origin.getParent() === block.getParent()) {
            caret.origin.remove(true);
            return;
          }
          $updateRangeSelectionFromCaretRange(this, $getCaretRange(!caret.origin.isEmpty() && block.isEmpty() ? $rewindSiblingCaret($getSiblingCaret(block, caret.direction)) : initialRange.anchor, caret));
          return this.removeText();
        }
        for (let node = anchor.getNode(); node !== null; ) {
          if ($getSlotHostKey(node) !== null) {
            return;
          }
          if ($isElementNode(node) && node.isShadowRoot()) {
            break;
          }
          node = node.getParent();
        }
      }
      const focus = this.focus;
      $extendSelectionForDeletion(this, isBackward, "character");
      if (!this.isCollapsed()) {
        const focusNode = focus.type === "text" ? focus.getNode() : null;
        anchorNode = anchor.type === "text" ? anchor.getNode() : null;
        if (focusNode !== null && focusNode.isSegmented()) {
          const offset = focus.offset;
          const textContentSize = focusNode.getTextContentSize();
          if (focusNode.is(anchorNode) || isBackward && offset !== textContentSize || !isBackward && offset !== 0) {
            $removeSegment(focusNode, isBackward, offset);
            return;
          }
        } else if (anchorNode !== null && anchorNode.isSegmented()) {
          const offset = anchor.offset;
          const textContentSize = anchorNode.getTextContentSize();
          if (anchorNode.is(focusNode) || isBackward && offset !== 0 || !isBackward && offset !== textContentSize) {
            $removeSegment(anchorNode, isBackward, offset);
            return;
          }
        }
        $updateCaretSelectionForUnicodeCharacter(this, isBackward);
      } else if (isBackward && anchor.offset === 0) {
        if ($collapseAtStart(this, anchor.getNode())) {
          return;
        }
      }
    }
    if (!wasCollapsed) {
      INTERNAL_$expandSelectionToWholeDocument(this);
    }
    this.removeText();
    if (isBackward && !wasCollapsed && this.isCollapsed() && this.anchor.type === "element" && this.anchor.offset === 0) {
      const anchorNode = this.anchor.getNode();
      if (anchorNode.isEmpty() && $isRootNode(anchorNode.getParent()) && anchorNode.getPreviousSibling() === null) {
        $collapseAtStart(this, anchorNode);
      }
      $ensureRootHasParagraph();
    }
  }
  /**
   * Performs one logical line deletion operation on the EditorState based on the current Selection.
   * Handles different node types.
   *
   * @param isBackward whether or not the selection is backwards.
   */
  deleteLine(isBackward) {
    const wasCollapsed = this.isCollapsed();
    const anchorSlotFrame = $getPointSlotFrame(this.anchor);
    if (anchorSlotFrame !== null && $isDecoratorNode($getSlotHost(anchorSlotFrame))) {
      if (!this.isCollapsed()) {
        this.focus.set(this.anchor.key, this.anchor.offset, this.anchor.type);
      }
      this.deleteCharacter(isBackward);
      return;
    }
    if (this.isCollapsed()) {
      $extendSelectionForDeletion(this, isBackward, "lineboundary");
    }
    if (this.isCollapsed()) {
      this.deleteCharacter(isBackward);
    } else {
      const anchorBlock = $findMatchingParent(this.anchor.getNode(), INTERNAL_$isBlock);
      const focusBlock = $findMatchingParent(this.focus.getNode(), INTERNAL_$isBlock);
      if (anchorBlock !== focusBlock) {
        this.focus.set(this.anchor.key, this.anchor.offset, this.anchor.type);
        this.deleteCharacter(isBackward);
      } else {
        if (!wasCollapsed) {
          INTERNAL_$expandSelectionToWholeDocument(this);
        }
        this.removeText();
      }
    }
  }
  /**
   * Performs one logical word deletion operation on the EditorState based on the current Selection.
   * Handles different node types.
   *
   * @param isBackward whether or not the selection is backwards.
   */
  deleteWord(isBackward) {
    const wasCollapsed = this.isCollapsed();
    if (this.isCollapsed()) {
      const anchor = this.anchor;
      const anchorNode = anchor.getNode();
      if (this.forwardDeletion(anchor, anchorNode, isBackward)) {
        return;
      }
      $extendSelectionForDeletion(this, isBackward, "word");
    }
    if (this.isCollapsed()) {
      this.deleteCharacter(isBackward);
    } else {
      if (!wasCollapsed) {
        INTERNAL_$expandSelectionToWholeDocument(this);
      }
      this.removeText();
    }
  }
  /**
   * Returns whether the Selection is "backwards", meaning the focus
   * logically precedes the anchor in the EditorState.
   * @returns true if the Selection is backwards, false otherwise.
   */
  isBackward() {
    const cached = this._cachedIsBackward;
    if (cached !== null) {
      return cached;
    }
    const isBackward = this.focus.isBefore(this.anchor);
    if (!isCurrentlyReadOnlyMode()) {
      this._cachedIsBackward = isBackward;
    }
    return isBackward;
  }
  getStartEndPoints() {
    return [this.anchor, this.focus];
  }
};
function $isNodeSelection(x2) {
  return x2 instanceof NodeSelection;
}
function $updateTextFormat(selection, applyFormat) {
  if ($isNodeSelection(selection)) {
    for (const node of selection.getNodes()) {
      if ($isInlineFormattable(node)) {
        node.setFormat(applyFormat(node.getFormat()));
      }
    }
    return;
  }
  if (selection.isCollapsed()) {
    selection.setFormat(applyFormat(selection.format));
    $setCompositionKey(null);
    return;
  }
  const selectedTextNodes = [];
  for (const node of selection.getNodes()) {
    if ($isTextNode(node)) {
      selectedTextNodes.push(node);
    } else if ($isElementNode(node)) {
      node.setTextFormat(applyFormat(node.getTextFormat()));
    } else if ($isInlineFormattable(node)) {
      node.setFormat(applyFormat(node.getFormat()));
    }
  }
  const selectedTextNodesLength = selectedTextNodes.length;
  if (selectedTextNodesLength === 0) {
    selection.setFormat(applyFormat(selection.format));
    $setCompositionKey(null);
    return;
  }
  const anchor = selection.anchor;
  const focus = selection.focus;
  const isBackward = selection.isBackward();
  const startPoint = isBackward ? focus : anchor;
  const endPoint = isBackward ? anchor : focus;
  let firstIndex = 0;
  let firstNode = selectedTextNodes[0];
  let startOffset = startPoint.type === "element" ? 0 : startPoint.offset;
  if (startPoint.type === "text" && startOffset === firstNode.getTextContentSize()) {
    firstIndex = 1;
    firstNode = selectedTextNodes[1];
    startOffset = 0;
  }
  if (firstNode == null) {
    return;
  }
  const lastIndex = selectedTextNodesLength - 1;
  let lastNode = selectedTextNodes[lastIndex];
  const endOffset = endPoint.type === "text" ? endPoint.offset : lastNode.getTextContentSize();
  if (firstNode.is(lastNode)) {
    if (startOffset === endOffset) {
      return;
    }
    const newFormat = applyFormat(firstNode.getFormat());
    if ($isTokenOrSegmented(firstNode) || startOffset === 0 && endOffset === firstNode.getTextContentSize()) {
      firstNode.setFormat(newFormat);
    } else {
      const splitNodes = firstNode.splitText(startOffset, endOffset);
      const replacement = startOffset === 0 ? splitNodes[0] : splitNodes[1];
      replacement.setFormat(newFormat);
      if (startPoint.type === "text") {
        startPoint.set(replacement.__key, 0, "text");
      }
      if (endPoint.type === "text") {
        endPoint.set(replacement.__key, endOffset - startOffset, "text");
      }
    }
    selection.format = newFormat;
    return;
  }
  if (startOffset !== 0 && !$isTokenOrSegmented(firstNode)) {
    [, firstNode] = firstNode.splitText(startOffset);
    startOffset = 0;
  }
  const firstNextFormat = applyFormat(firstNode.getFormat());
  firstNode.setFormat(firstNextFormat);
  const lastNextFormat = applyFormat(lastNode.getFormat());
  if (endOffset > 0) {
    if (endOffset !== lastNode.getTextContentSize() && !$isTokenOrSegmented(lastNode)) {
      [lastNode] = lastNode.splitText(endOffset);
    }
    lastNode.setFormat(lastNextFormat);
  }
  for (let i2 = firstIndex + 1; i2 < lastIndex; i2++) {
    const textNode = selectedTextNodes[i2];
    textNode.setFormat(applyFormat(textNode.getFormat()));
  }
  if (startPoint.type === "text") {
    startPoint.set(firstNode.__key, startOffset, "text");
  }
  if (endPoint.type === "text") {
    endPoint.set(lastNode.__key, endOffset, "text");
  }
  selection.format = firstNextFormat | lastNextFormat;
}
function $setTextFormat(selection, formats) {
  const entries = [];
  for (const [type, value] of Object.entries(formats)) {
    if (typeof value === "boolean") {
      entries.push([type, value]);
    }
  }
  if (entries.length === 0) {
    return;
  }
  $updateTextFormat(selection, (format) => {
    for (const [type, value] of entries) {
      format = toggleTextFormatType(format, type, value ? TEXT_TYPE_TO_FORMAT[type] : 0);
    }
    return format;
  });
}
function $formatText(selection, formatType, alignWithFormat = null) {
  const effectiveAlign = alignWithFormat === null && $isRangeSelection(selection) ? toggleTextFormatType(selection.format, formatType, null) : alignWithFormat;
  $updateTextFormat(selection, (format) => toggleTextFormatType(format, formatType, effectiveAlign));
}
function getCharacterOffset(point) {
  const offset = point.offset;
  if (point.type === "text") {
    return offset;
  }
  const parent = point.getNode();
  return offset === parent.getChildrenSize() ? parent.getTextContent().length : 0;
}
function $getCharacterOffsets(selection) {
  const anchorAndFocus = selection.getStartEndPoints();
  if (anchorAndFocus === null) {
    return [0, 0];
  }
  const [anchor, focus] = anchorAndFocus;
  if (anchor.type === "element" && focus.type === "element" && anchor.key === focus.key && anchor.offset === focus.offset) {
    return [0, 0];
  }
  return [getCharacterOffset(anchor), getCharacterOffset(focus)];
}
function $collapseAtStart(selection, startNode) {
  for (let node = startNode; node; node = node.getParent()) {
    if ($isElementNode(node)) {
      if (node.collapseAtStart(selection)) {
        return true;
      }
      if ($isRootOrShadowRoot(node)) {
        break;
      }
    }
    if (node.getPreviousSibling()) {
      break;
    }
  }
  return false;
}
function INTERNAL_$expandSelectionToWholeDocument(selection) {
  const root = $getRoot();
  if (root.isEmpty() || !$isBlockFullySelected(root, selection)) {
    return;
  }
  selection.anchor.set(root.getKey(), 0, "element");
  selection.focus.set(root.getKey(), root.getChildrenSize(), "element");
}
function $swapPoints(selection) {
  const focus = selection.focus;
  const anchor = selection.anchor;
  const anchorKey = anchor.key;
  const anchorOffset = anchor.offset;
  const anchorType = anchor.type;
  anchor.set(focus.key, focus.offset, focus.type, true);
  focus.set(anchorKey, anchorOffset, anchorType, true);
}
function canMoveWithinDOMText(node, offset, direction) {
  if (node === null || node.nodeType !== DOM_TEXT_TYPE) {
    return false;
  }
  if (direction === "backward") {
    return offset > 0;
  } else if (direction === "forward") {
    return offset < node.length;
  }
  return false;
}
function moveNativeSelection(domSelection, alter, direction, granularity, rootElement) {
  const points = granularity === "character" ? getDOMSelectionPoints(domSelection, rootElement) : null;
  const focusNode = points && points.focusNode;
  const focusOffset = points ? points.focusOffset : 0;
  domSelection.modify(alter, direction, granularity);
  if (points === null || !canMoveWithinDOMText(focusNode, focusOffset, direction)) {
    return;
  }
  const nextPoints = getDOMSelectionPoints(domSelection, rootElement);
  if (nextPoints.focusNode === focusNode && nextPoints.focusOffset === focusOffset) {
    domSelection.modify(alter, direction, granularity);
  }
}
function $shrinkSelectionToRoot(selection, isBackward, root) {
  const nodes = selection.getNodes();
  const validNodes = nodes.filter((node) => $hasAncestor(node, root));
  if (validNodes.length === 0 || validNodes.length === nodes.length) {
    return false;
  }
  const edgeNode = isBackward ? validNodes[0] : validNodes[validNodes.length - 1];
  const edgeElement = $isElementNode(edgeNode) ? edgeNode : edgeNode.getParentOrThrow();
  if (isBackward) {
    edgeElement.selectStart();
  } else {
    edgeElement.selectEnd();
  }
  return true;
}
function $extendSelectionForDeletion(selection, isBackward, granularity) {
  if ($modifySelectionAroundDecoratorsAndBlocks(selection, "extend", isBackward, granularity)) {
    return;
  }
  const editor = getActiveEditor();
  const domSelection = getDOMSelection(getWindow(editor));
  if (!domSelection || typeof domSelection.modify !== "function") {
    return;
  }
  const blockCursorElement = editor._blockCursorElement;
  const rootElement = editor._rootElement;
  const anchor = selection.anchor;
  const focusNode = selection.focus.getNode();
  if (rootElement !== null && blockCursorElement !== null && $isElementNode(focusNode) && !focusNode.isInline() && !focusNode.canBeEmpty()) {
    removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
  }
  const $resolvePointDOM = (point) => {
    const pointNode = point.getNode();
    const keyedDOM = editor.getElementByKey(point.key);
    return keyedDOM !== null && point.type === "text" && $isTextNode(pointNode) ? $getDOMTextNode(pointNode, keyedDOM, editor) : keyedDOM;
  };
  const anchorNode = anchor.getNode();
  const anchorDOM = $resolvePointDOM(anchor);
  if (anchorDOM === null) {
    return;
  }
  const anchorOffset = anchor.offset;
  const wasCollapsed = selection.isCollapsed();
  const focus = selection.focus;
  const focusDOM = wasCollapsed ? anchorDOM : $resolvePointDOM(focus);
  if (focusDOM === null) {
    return;
  }
  const focusOffset = focus.offset;
  setDOMSelectionBaseAndExtent(domSelection, focusDOM, focusOffset, focusDOM, focusOffset);
  moveNativeSelection(domSelection, "move", isBackward ? "backward" : "forward", granularity, rootElement);
  if (domSelection.rangeCount === 0) {
    return;
  }
  const landedRange = getComposedStaticRange(domSelection, rootElement) || domSelection.getRangeAt(0);
  const landedContainer = landedRange.startContainer;
  const landedOffset = landedRange.startOffset;
  if (wasCollapsed && granularity === "character" && anchor.type === "text" && $isTextNode(anchorNode) && anchorNode.isUnmergeable()) {
    const boundaryOffset = isBackward ? 0 : anchorNode.getTextContentSize();
    if (anchorOffset === boundaryOffset) {
      const sibling = $getSiblingCaret(anchorNode, isBackward ? "previous" : "next").getNodeAtCaret();
      if ($isTextNode(sibling)) {
        const sibOffset = isBackward ? sibling.getTextContentSize() - 1 : 1;
        selection.focus.set(sibling.__key, sibOffset, "text");
        selection.dirty = true;
        return;
      }
    }
  }
  if (wasCollapsed && granularity === "character" && anchor.type === "text") {
    const edgeOffset = isBackward ? 0 : anchorNode.getTextContentSize();
    const clampedOffset = landedContainer === anchorDOM ? landedOffset : anchorOffset !== edgeOffset ? edgeOffset : -1;
    if (clampedOffset >= 0) {
      if (clampedOffset !== anchorOffset) {
        selection.focus.set(anchor.key, clampedOffset, "text");
        selection.dirty = true;
      }
      return;
    }
  }
  const [startContainer, startOffset, endContainer, endOffset] = isBackward ? [landedContainer, landedOffset, anchorDOM, anchorOffset] : [anchorDOM, anchorOffset, landedContainer, landedOffset];
  const root = $isRootNode(anchorNode) ? anchorNode : $getNearestRootOrShadowRoot(anchorNode);
  selection.applyDOMRange({
    collapsed: false,
    endContainer,
    endOffset,
    startContainer,
    startOffset
  });
  selection.dirty = true;
  if (!$shrinkSelectionToRoot(selection, isBackward, root) && isBackward) {
    $swapPoints(selection);
  }
  if (granularity === "lineboundary") {
    $modifySelectionAroundDecoratorsAndBlocks(selection, "extend", isBackward, granularity, "decorators");
  }
}
function $updateCaretSelectionForUnicodeCharacter(selection, isBackward) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (anchorNode === focusNode && anchor.type === "text" && focus.type === "text") {
    const anchorOffset = anchor.offset;
    const focusOffset = focus.offset;
    const isBefore = anchorOffset < focusOffset;
    const startOffset = isBefore ? anchorOffset : focusOffset;
    const endOffset = isBefore ? focusOffset : anchorOffset;
    const characterOffset = endOffset - 1;
    if (startOffset !== characterOffset) {
      const text = anchorNode.getTextContent().slice(startOffset, endOffset);
      if (shouldDeleteExactlyOneCodeUnit(text)) {
        if (isBackward) {
          focus.set(focus.key, characterOffset, focus.type);
        } else {
          anchor.set(anchor.key, characterOffset, anchor.type);
        }
      }
    }
  }
}
function shouldDeleteExactlyOneCodeUnit(text) {
  {
    if (!(text.length > 1)) {
      formatDevErrorMessage(`shouldDeleteExactlyOneCodeUnit: expecting to be called only with sequences of two or more code units`);
    }
  }
  return !(doesContainSurrogatePair(text) || doesContainEmoji(text));
}
var doesContainEmoji = (() => {
  try {
    const re = new RegExp("\\p{Emoji}", "u");
    const test = re.test.bind(re);
    if (
      // Emoji in the BMP (heart) with variation selector
      test("\u2764\uFE0F") && // Emoji in the BMP (#) with variation selector
      test("#\uFE0F\u20E3") && // Emoji outside the BMP (thumbs up) that is encoded with a surrogate pair
      test("\u{1F44D}")
    ) {
      return test;
    }
  } catch (_e) {
  }
  return () => false;
})();
function $removeSegment(node, isBackward, offset) {
  const textNode = node;
  const textContent = textNode.getTextContent();
  const split = textContent.split(/(?=\s)/g);
  const splitLength = split.length;
  let segmentOffset = 0;
  let restoreOffset = 0;
  for (let i2 = 0; i2 < splitLength; i2++) {
    const text = split[i2];
    const isLast = i2 === splitLength - 1;
    restoreOffset = segmentOffset;
    segmentOffset += text.length;
    if (isBackward && segmentOffset === offset || segmentOffset > offset || isLast) {
      split.splice(i2, 1);
      if (isLast) {
        restoreOffset = void 0;
      }
      break;
    }
  }
  const nextTextContent = split.join("").trim();
  if (nextTextContent === "") {
    textNode.remove();
  } else {
    textNode.setTextContent(nextTextContent);
    textNode.select(restoreOffset, restoreOffset);
  }
}
function shouldResolveAncestor(resolvedElement, resolvedOffset, lastPoint) {
  const parent = resolvedElement.getParent();
  return lastPoint === null || parent === null || !parent.canBeEmpty() || parent !== lastPoint.getNode();
}
function $internalResolveSelectionPoint(dom, offset, lastPoint, editor) {
  let resolvedOffset = offset;
  let resolvedNode;
  let dirty = false;
  if (isHTMLElement(dom)) {
    let moveSelectionToEnd = false;
    const childNodes = dom.childNodes;
    const childNodesLength = childNodes.length;
    const blockCursorElement = editor._blockCursorElement;
    if (resolvedOffset === childNodesLength && childNodesLength > 0) {
      moveSelectionToEnd = true;
      resolvedOffset = childNodesLength - 1;
    }
    if (getNodeKeyFromDOMNode(dom, editor) === void 0 && !isDOMCapturingSelection(dom, editor)) {
      dirty = true;
    }
    let childDOM = childNodes[resolvedOffset];
    let hasBlockCursor = false;
    if (childDOM === blockCursorElement) {
      childDOM = childNodes[resolvedOffset + 1];
      hasBlockCursor = true;
    } else if (blockCursorElement !== null) {
      const blockCursorElementParent = blockCursorElement.parentNode;
      if (dom === blockCursorElementParent) {
        const blockCursorOffset = Array.prototype.indexOf.call(blockCursorElementParent.children, blockCursorElement);
        if (offset > blockCursorOffset) {
          resolvedOffset--;
        }
      }
    }
    resolvedNode = $getNodeFromDOM(childDOM);
    if ($isTextNode(resolvedNode)) {
      resolvedOffset = $getTextNodeOffset(resolvedNode, moveSelectionToEnd ? "next" : "previous");
    } else {
      let resolvedElement = $getNodeFromDOM(dom);
      if (resolvedElement === null) {
        return null;
      }
      if ($isElementNode(resolvedElement)) {
        const elementDOM = editor.getElementByKey(resolvedElement.getKey());
        if (!(elementDOM !== null)) {
          formatDevErrorMessage(`$internalResolveSelectionPoint: node in DOM but not keyToDOMMap`);
        }
        const slot = $getDOMSlot(resolvedElement, elementDOM, editor);
        [resolvedElement, resolvedOffset] = slot.resolveChildIndex(resolvedElement, elementDOM, dom, offset);
        if (!$isElementNode(resolvedElement)) {
          formatDevErrorMessage(`$internalResolveSelectionPoint: resolvedElement is not an ElementNode`);
        }
        if (moveSelectionToEnd && resolvedOffset >= resolvedElement.getChildrenSize()) {
          resolvedOffset = Math.max(0, resolvedElement.getChildrenSize() - 1);
        }
        let child = resolvedElement.getChildAtIndex(resolvedOffset);
        if ($isElementNode(child) && shouldResolveAncestor(child, resolvedOffset, lastPoint)) {
          const descendant = moveSelectionToEnd ? child.getLastDescendant() : child.getFirstDescendant();
          if (descendant === null) {
            resolvedElement = child;
          } else {
            child = descendant;
            resolvedElement = $isElementNode(child) ? child : child.getParentOrThrow();
          }
          resolvedOffset = 0;
        }
        if ($isTextNode(child)) {
          resolvedNode = child;
          resolvedElement = null;
          resolvedOffset = $getTextNodeOffset(child, moveSelectionToEnd ? "next" : "previous");
        } else if (child !== resolvedElement && moveSelectionToEnd && !hasBlockCursor) {
          if (!$isElementNode(resolvedElement)) {
            formatDevErrorMessage(`invariant`);
          }
          resolvedOffset = Math.min(resolvedElement.getChildrenSize(), resolvedOffset + 1);
        }
      } else {
        const slotHost = $getSlotHost(resolvedElement);
        const anchorNode = slotHost !== null ? slotHost : resolvedElement;
        const index = anchorNode.getIndexWithinParent();
        const elementDOM = editor.getElementByKey(resolvedElement.getKey());
        let position = "after";
        if (elementDOM !== null && $getNodeFromDOM(dom) === resolvedElement) {
          const slot = $getDOMSlot(resolvedElement, elementDOM, editor);
          if (slot.element !== elementDOM) {
            position = slot.resolveLeafPosition(elementDOM, dom, offset);
          } else if (offset === 0 && $isDecoratorNode(resolvedElement)) {
            position = "before";
          }
        }
        resolvedOffset = position === "before" ? index : index + 1;
        resolvedElement = anchorNode.getParentOrThrow();
      }
      if ($isElementNode(resolvedElement)) {
        return [$createPoint(resolvedElement.__key, resolvedOffset, "element"), dirty];
      }
    }
  } else {
    resolvedNode = $getNodeFromDOM(dom);
  }
  if (!$isTextNode(resolvedNode)) {
    return null;
  }
  return [$createPoint(resolvedNode.__key, $getTextNodeOffset(resolvedNode, resolvedOffset, "clamp"), "text"), dirty];
}
function resolveSelectionPointOnBoundary(point, isBackward, isCollapsed) {
  const offset = point.offset;
  const node = point.getNode();
  if (offset === 0) {
    const prevSibling = node.getPreviousSibling();
    const parent = node.getParent();
    if (!isBackward) {
      if ($isElementNode(prevSibling) && !isCollapsed && prevSibling.isInline()) {
        point.set(prevSibling.__key, prevSibling.getChildrenSize(), "element");
      } else if ($isTextNode(prevSibling) && !node.isUnmergeable()) {
        point.set(prevSibling.__key, prevSibling.getTextContent().length, "text");
      }
    } else if ((isCollapsed || !isBackward) && prevSibling === null && $isElementNode(parent) && parent.isInline()) {
      const parentSibling = parent.getPreviousSibling();
      if ($isTextNode(parentSibling)) {
        point.set(parentSibling.__key, parentSibling.getTextContent().length, "text");
      }
    }
  } else if (offset === node.getTextContent().length) {
    const nextSibling = node.getNextSibling();
    const parent = node.getParent();
    if (isBackward && $isElementNode(nextSibling) && nextSibling.isInline()) {
      point.set(nextSibling.__key, 0, "element");
    } else if ((isCollapsed || isBackward) && nextSibling === null && $isElementNode(parent) && parent.isInline() && !parent.canInsertTextAfter() && parent.getTextContentSize() > 1) {
      const parentSibling = parent.getNextSibling();
      if ($isTextNode(parentSibling)) {
        point.set(parentSibling.__key, 0, "text");
      }
    }
  }
}
function $normalizeSelectionPointsForBoundaries(anchor, focus, lastSelection) {
  if (anchor.type === "text" && focus.type === "text") {
    const isBackward = anchor.isBefore(focus);
    const isCollapsed = anchor.is(focus);
    resolveSelectionPointOnBoundary(anchor, isBackward, isCollapsed);
    resolveSelectionPointOnBoundary(focus, !isBackward, isCollapsed);
    if (isCollapsed) {
      focus.set(anchor.key, anchor.offset, anchor.type);
    }
  }
}
function $getPointSlotFrame(point) {
  const node = $getNodeByKey(point.key);
  return node === null ? null : $getSlotFrame(node);
}
function $slotStraddleFocusAfterAnchor(anchorPoint, focusPoint, anchorFrame, focusFrame) {
  if (anchorFrame !== null && focusFrame !== null) {
    const anchorHost = $getSlotHost(anchorFrame);
    const focusHost2 = $getSlotHost(focusFrame);
    if (anchorHost !== null && anchorHost.is(focusHost2)) {
      for (const slotKey of $getSlotMap(anchorHost).values()) {
        if (slotKey === anchorFrame.getKey()) {
          return true;
        }
        if (slotKey === focusFrame.getKey()) {
          return false;
        }
      }
      return true;
    }
    return anchorHost !== null && focusHost2 !== null ? anchorHost.isBefore(focusHost2) : true;
  }
  if (anchorFrame !== null) {
    const anchorHost = $getSlotHost(anchorFrame);
    const focusNode = $getNodeByKey(focusPoint.key);
    if (anchorHost === null || focusNode === null) {
      return true;
    }
    if (anchorHost.is(focusNode) || anchorHost.isParentOf(focusNode)) {
      return true;
    }
    return anchorHost.isBefore(focusNode);
  }
  const focusHost = $getSlotHost(focusFrame);
  const anchorNode = $getNodeByKey(anchorPoint.key);
  if (focusHost === null || anchorNode === null) {
    return false;
  }
  if (focusHost.is(anchorNode) || focusHost.isParentOf(anchorNode)) {
    return false;
  }
  return anchorNode.isBefore(focusHost);
}
function $clampSelectionPointsToSlotFrame(anchorPoint, focusPoint, resolveFocusAfterAnchor) {
  const anchorFrame = $getPointSlotFrame(anchorPoint);
  const focusFrame = $getPointSlotFrame(focusPoint);
  if (anchorFrame === focusFrame || anchorFrame !== null && focusFrame !== null && anchorFrame.is(focusFrame)) {
    return false;
  }
  const focusAfterAnchor = resolveFocusAfterAnchor(anchorFrame, focusFrame);
  if (anchorFrame !== null) {
    if ($isElementNode(anchorFrame)) {
      focusPoint.set(anchorFrame.getKey(), focusAfterAnchor ? anchorFrame.getChildrenSize() : 0, "element");
    } else {
      focusPoint.set(anchorFrame.getKey(), focusAfterAnchor ? anchorFrame.getTextContentSize() : 0, "text");
    }
    return true;
  }
  const host = $getSlotHost(focusFrame);
  if (host === null) {
    return false;
  }
  const hostParent = host.getParent();
  if (hostParent === null) {
    return false;
  }
  const hostIndex = host.getIndexWithinParent();
  focusPoint.set(hostParent.getKey(), focusAfterAnchor ? hostIndex + 1 : hostIndex, "element");
  return true;
}
function $clampRangeSelectionToSlotFrame(selection) {
  const clamped = $clampSelectionPointsToSlotFrame(selection.anchor, selection.focus, (anchorFrame, focusFrame) => $slotStraddleFocusAfterAnchor(selection.anchor, selection.focus, anchorFrame, focusFrame));
  if (clamped) {
    selection.dirty = true;
  }
  return clamped;
}
function $internalResolveSelectionPoints(anchorDOM, anchorOffset, focusDOM, focusOffset, editor, lastSelection) {
  if (anchorDOM === null || focusDOM === null || !isSelectionWithinEditor(editor, anchorDOM, focusDOM)) {
    return null;
  }
  const resolvedAnchor = $internalResolveSelectionPoint(anchorDOM, anchorOffset, $isRangeSelection(lastSelection) ? lastSelection.anchor : null, editor);
  if (resolvedAnchor === null) {
    return null;
  }
  const resolvedFocus = $internalResolveSelectionPoint(focusDOM, focusOffset, $isRangeSelection(lastSelection) ? lastSelection.focus : null, editor);
  if (resolvedFocus === null) {
    return null;
  }
  const [resolvedAnchorPoint, anchorDirty] = resolvedAnchor;
  const [resolvedFocusPoint, focusDirty] = resolvedFocus;
  {
    $validatePoint("anchor", resolvedAnchorPoint);
    $validatePoint("focus", resolvedFocusPoint);
  }
  if (resolvedAnchorPoint.type === "element" && resolvedFocusPoint.type === "element") {
    const anchorNode = $getNodeFromDOM(anchorDOM);
    const focusNode = $getNodeFromDOM(focusDOM);
    if ($isDecoratorNode(anchorNode) && $isDecoratorNode(focusNode)) {
      return null;
    }
  }
  const slotClamped = editor._slotsUsed && $clampSelectionPointsToSlotFrame(resolvedAnchorPoint, resolvedFocusPoint, () => (anchorDOM.compareDocumentPosition(focusDOM) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
  $normalizeSelectionPointsForBoundaries(resolvedAnchorPoint, resolvedFocusPoint);
  return [resolvedAnchorPoint, resolvedFocusPoint, anchorDirty || focusDirty || slotClamped];
}
function $isBlockElementNode(node) {
  return $isElementNode(node) && !node.isInline();
}
function $internalMakeRangeSelection(anchorKey, anchorOffset, focusKey, focusOffset, anchorType, focusType) {
  const editorState = getActiveEditorState();
  const selection = new RangeSelection($createPoint(anchorKey, anchorOffset, anchorType), $createPoint(focusKey, focusOffset, focusType), 0, "");
  selection.dirty = true;
  editorState._selection = selection;
  return selection;
}
function $createRangeSelection() {
  const anchor = $createPoint("root", 0, "element");
  const focus = $createPoint("root", 0, "element");
  return new RangeSelection(anchor, focus, 0, "");
}
function $createNodeSelection() {
  return new NodeSelection(/* @__PURE__ */ new Set());
}
function $internalCreateSelection(editor, event) {
  const currentEditorState = editor.getEditorState();
  const lastSelection = currentEditorState._selection;
  const domSelection = getDOMSelection(getWindow(editor));
  if ($isRangeSelection(lastSelection) || lastSelection == null) {
    return $internalCreateRangeSelection(lastSelection, domSelection, editor, event);
  }
  return lastSelection.clone();
}
function $createRangeSelectionFromDom(domSelection, editor) {
  return $internalCreateRangeSelection(null, domSelection, editor, null);
}
function $internalCreateRangeSelection(lastSelection, domSelection, editor, event) {
  const windowObj = editor._window;
  if (windowObj === null) {
    return null;
  }
  const windowEvent = event || windowObj.event;
  const eventType = windowEvent ? windowEvent.type : void 0;
  const isSelectionChange = eventType === "selectionchange";
  const useDOMSelection = !getIsProcessingMutations() && (isSelectionChange || eventType === "beforeinput" || eventType === "compositionstart" || eventType === "compositionend" || eventType === "click" && windowEvent && windowEvent.detail === 3 || eventType === "drop" || eventType === void 0);
  let anchorDOM, focusDOM, anchorOffset, focusOffset;
  if (!$isRangeSelection(lastSelection) || useDOMSelection) {
    if (domSelection === null) {
      return null;
    }
    const points = getDOMSelectionPoints(domSelection, editor._rootElement);
    anchorDOM = points.anchorNode;
    focusDOM = points.focusNode;
    anchorOffset = points.anchorOffset;
    focusOffset = points.focusOffset;
    if ((isSelectionChange || eventType === void 0) && $isRangeSelection(lastSelection) && !isSelectionWithinEditor(editor, anchorDOM, focusDOM)) {
      return lastSelection.clone();
    }
  } else {
    return lastSelection.clone();
  }
  const resolvedSelectionPoints = $internalResolveSelectionPoints(anchorDOM, anchorOffset, focusDOM, focusOffset, editor, lastSelection);
  if (resolvedSelectionPoints === null) {
    return null;
  }
  const [resolvedAnchorPoint, resolvedFocusPoint, dirty] = resolvedSelectionPoints;
  let format = 0;
  let style = "";
  if ($isRangeSelection(lastSelection)) {
    const lastAnchor = lastSelection.anchor;
    if (resolvedAnchorPoint.key === lastAnchor.key) {
      format = lastSelection.format;
      style = lastSelection.style;
    } else {
      const anchorNode = resolvedAnchorPoint.getNode();
      if ($isTextNode(anchorNode)) {
        format = anchorNode.getFormat();
        style = anchorNode.getStyle();
      } else if ($isElementNode(anchorNode)) {
        format = anchorNode.getTextFormat();
        style = anchorNode.getTextStyle();
      }
    }
  }
  const newSelection = new RangeSelection(resolvedAnchorPoint, resolvedFocusPoint, format, style);
  if (dirty) {
    newSelection.dirty = true;
  }
  return newSelection;
}
function $internalRefreshSelectionFormatAndStyle(selection, previousAnchorKey) {
  const anchor = selection.anchor;
  if (anchor.key === previousAnchorKey) {
    return;
  }
  const anchorNode = anchor.getNode();
  let format = 0;
  let style = "";
  if ($isTextNode(anchorNode)) {
    format = anchorNode.getFormat();
    style = anchorNode.getStyle();
  } else if ($isElementNode(anchorNode)) {
    format = anchorNode.getTextFormat();
    style = anchorNode.getTextStyle();
  }
  if (selection.format !== format || selection.style !== style) {
    selection.format = format;
    selection.style = style;
    selection.dirty = true;
  }
}
function $validatePoint(name, point) {
  const node = $getNodeByKey(point.key);
  if (!(node !== void 0)) {
    formatDevErrorMessage(`$validatePoint: ${name} key ${point.key} not found in current editorState`);
  }
  if (point.type === "text") {
    if (!$isTextNode(node)) {
      formatDevErrorMessage(`$validatePoint: ${name} key ${point.key} is not a TextNode`);
    }
    const size = node.getTextContentSize();
    if (!(point.offset <= size)) {
      formatDevErrorMessage(`$validatePoint: ${name} point.offset > node.getTextContentSize() (${String(point.offset)} > ${String(size)})`);
    }
  } else {
    if (!$isElementNode(node)) {
      formatDevErrorMessage(`$validatePoint: ${name} key ${point.key} is not an ElementNode`);
    }
    const size = node.getChildrenSize();
    if (!(point.offset <= size)) {
      formatDevErrorMessage(`$validatePoint: ${name} point.offset > node.getChildrenSize() (${String(point.offset)} > ${String(size)})`);
    }
  }
}
function $getSelection() {
  const editorState = getActiveEditorState();
  return editorState._selection;
}
function $getPreviousSelection() {
  const editor = getActiveEditor();
  return editor._editorState._selection;
}
function $selectionTouchesElement(selection, parentNode) {
  const parentKey = parentNode.__key;
  return selection.anchor.key === parentKey || selection.focus.key === parentKey;
}
function $updateElementSelectionOnCreateDeleteNode(selection, parentNode, nodeOffset, times = 1) {
  if (!$selectionTouchesElement(selection, parentNode)) {
    return;
  }
  const anchor = selection.anchor;
  const focus = selection.focus;
  const parentKey = parentNode.__key;
  if (selection.isCollapsed()) {
    const selectionOffset = anchor.offset;
    if (nodeOffset <= selectionOffset && times > 0 || nodeOffset < selectionOffset && times < 0) {
      const newSelectionOffset = Math.max(0, selectionOffset + times);
      anchor.set(parentKey, newSelectionOffset, "element");
      focus.set(parentKey, newSelectionOffset, "element");
      $updateSelectionResolveTextNodes(selection);
    }
  } else {
    const isBackward = selection.isBackward();
    const firstPoint = isBackward ? focus : anchor;
    const firstPointNode = firstPoint.getNode();
    const lastPoint = isBackward ? anchor : focus;
    const lastPointNode = lastPoint.getNode();
    if (parentNode.is(firstPointNode)) {
      const firstPointOffset = firstPoint.offset;
      if (nodeOffset <= firstPointOffset && times > 0 || nodeOffset < firstPointOffset && times < 0) {
        firstPoint.set(parentKey, Math.max(0, firstPointOffset + times), "element");
      }
    }
    if (parentNode.is(lastPointNode)) {
      const lastPointOffset = lastPoint.offset;
      if (nodeOffset <= lastPointOffset && times > 0 || nodeOffset < lastPointOffset && times < 0) {
        lastPoint.set(parentKey, Math.max(0, lastPointOffset + times), "element");
      }
    }
  }
  $updateSelectionResolveTextNodes(selection);
}
function $updateSelectionResolveTextNodes(selection) {
  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const focus = selection.focus;
  const focusOffset = focus.offset;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (selection.isCollapsed()) {
    if (!$isElementNode(anchorNode)) {
      return;
    }
    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd ? anchorNode.getChildAtIndex(childSize - 1) : anchorNode.getChildAtIndex(anchorOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      anchor.set(child.__key, newOffset, "text");
      focus.set(child.__key, newOffset, "text");
    }
    return;
  }
  if ($isElementNode(anchorNode)) {
    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd ? anchorNode.getChildAtIndex(childSize - 1) : anchorNode.getChildAtIndex(anchorOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      anchor.set(child.__key, newOffset, "text");
    }
  }
  if ($isElementNode(focusNode)) {
    const childSize = focusNode.getChildrenSize();
    const focusOffsetAtEnd = focusOffset >= childSize;
    const child = focusOffsetAtEnd ? focusNode.getChildAtIndex(childSize - 1) : focusNode.getChildAtIndex(focusOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (focusOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      focus.set(child.__key, newOffset, "text");
    }
  }
}
function applySelectionTransforms(nextEditorState, editor) {
  const prevEditorState = editor.getEditorState();
  const prevSelection = prevEditorState._selection;
  const nextSelection = nextEditorState._selection;
  if ($isRangeSelection(nextSelection)) {
    const anchor = nextSelection.anchor;
    const focus = nextSelection.focus;
    let anchorNode;
    if (anchor.type === "text") {
      anchorNode = anchor.getNode();
      anchorNode.selectionTransform(prevSelection, nextSelection);
    }
    if (focus.type === "text") {
      const focusNode = focus.getNode();
      if (anchorNode !== focusNode) {
        focusNode.selectionTransform(prevSelection, nextSelection);
      }
    }
  }
}
function moveSelectionPointToSibling(point, node, parent, prevSibling, nextSibling) {
  let siblingKey = null;
  let offset = 0;
  let type = null;
  if (prevSibling !== null) {
    siblingKey = prevSibling.__key;
    if ($isTextNode(prevSibling)) {
      offset = prevSibling.getTextContentSize();
      type = "text";
    } else if ($isElementNode(prevSibling)) {
      offset = prevSibling.getChildrenSize();
      type = "element";
    }
  } else {
    if (nextSibling !== null) {
      siblingKey = nextSibling.__key;
      if ($isTextNode(nextSibling)) {
        type = "text";
      } else if ($isElementNode(nextSibling)) {
        type = "element";
      }
    }
  }
  if (siblingKey !== null && type !== null) {
    point.set(siblingKey, offset, type);
  } else {
    offset = node.getIndexWithinParent();
    if (offset === -1) {
      offset = parent.getChildrenSize();
    }
    point.set(parent.__key, offset, "element");
  }
}
function adjustPointOffsetForMergedSibling(point, isBefore, key, target, textLength) {
  if (point.type === "text") {
    point.set(key, point.offset + (isBefore ? 0 : textLength), "text");
  } else if (point.offset > target.getIndexWithinParent()) {
    point.set(point.key, point.offset - 1, "element");
  }
}
function setDOMSelectionBaseAndExtent(domSelection, nextAnchorDOM, nextAnchorOffset, nextFocusDOM, nextFocusOffset) {
  try {
    domSelection.setBaseAndExtent(nextAnchorDOM, nextAnchorOffset, nextFocusDOM, nextFocusOffset);
  } catch (error) {
    {
      console.warn(error);
    }
  }
}
function $getElementAndOffsetForPoint(editor, node, offset) {
  const element = getElementByKeyOrThrow(editor, node.getKey());
  if ($isElementNode(node)) {
    const slot = $getDOMSlot(node, element, editor);
    return [slot.element, offset + slot.getFirstChildOffset()];
  }
  return [element, offset];
}
function $updateDOMSelection(prevSelection, nextSelection, editor, domSelection, tags, rootElement) {
  const rootForActive = rootElement.getRootNode();
  const activeElement = isDOMDocumentNode(rootForActive) || isDOMShadowRoot(rootForActive) ? getActiveElementDeep(rootForActive) : null;
  if (tags.has(COLLABORATION_TAG) && activeElement !== rootElement || activeElement !== null && $isSelectionCapturedInDecoratorInput(activeElement, activeElement)) {
    return;
  }
  const currentPoints = getDOMSelectionPoints(domSelection, rootElement);
  let currentRangeCache;
  const getCurrentRange = () => {
    if (currentRangeCache === void 0) {
      currentRangeCache = getDOMSelectionRange(domSelection, rootElement);
    }
    return currentRangeCache;
  };
  if (!$isRangeSelection(nextSelection)) {
    if (prevSelection !== null && isSelectionWithinEditor(editor, currentPoints.anchorNode, currentPoints.focusNode)) {
      domSelection.removeAllRanges();
    }
    return;
  }
  const anchor = nextSelection.anchor;
  const focus = nextSelection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  const [anchorDOM, nextAnchorOffset] = $getElementAndOffsetForPoint(editor, anchorNode, anchor.offset);
  const [focusDOM, nextFocusOffset] = $getElementAndOffsetForPoint(editor, focusNode, focus.offset);
  const nextFormat = nextSelection.format;
  const nextStyle = nextSelection.style;
  const isCollapsed = nextSelection.isCollapsed();
  let nextAnchorNode = anchorDOM;
  let nextFocusNode = focusDOM;
  let anchorFormatOrStyleChanged = false;
  if (anchor.type === "text") {
    nextAnchorNode = $isTextNode(anchorNode) ? $getDOMTextNode(anchorNode, anchorDOM, editor) : null;
    anchorFormatOrStyleChanged = anchorNode.getFormat() !== nextFormat || anchorNode.getStyle() !== nextStyle;
  } else if ($isRangeSelection(prevSelection) && prevSelection.anchor.type === "text") {
    anchorFormatOrStyleChanged = true;
  }
  if (focus.type === "text") {
    nextFocusNode = $isTextNode(focusNode) ? $getDOMTextNode(focusNode, focusDOM, editor) : null;
  }
  if (nextAnchorNode === null || nextFocusNode === null) {
    return;
  }
  if (isCollapsed && (prevSelection === null || anchorFormatOrStyleChanged || $isRangeSelection(prevSelection) && (prevSelection.format !== nextFormat || prevSelection.style !== nextStyle))) {
    markCollapsedSelectionFormat(editor, nextFormat, nextStyle, nextAnchorOffset, anchor.key, performance.now());
  }
  if (!(domSelection.type === "Range" && isCollapsed) && // Badly interpreted range selection when collapsed - #1482
  currentPoints.anchorOffset === nextAnchorOffset && currentPoints.focusOffset === nextFocusOffset && currentPoints.anchorNode === nextAnchorNode && currentPoints.focusNode === nextFocusNode) {
    if (activeElement === null || !rootElement.contains(activeElement)) {
      const focusEditor = activeElement !== null ? getNearestEditorFromDOMNode(activeElement) : null;
      if ((focusEditor === null || focusEditor === editor) && !tags.has(SKIP_SELECTION_FOCUS_TAG)) {
        rootElement.focus({
          preventScroll: true
        });
      }
    }
    if (anchor.type !== "element") {
      return;
    }
  }
  setDOMSelectionBaseAndExtent(domSelection, nextAnchorNode, nextAnchorOffset, nextFocusNode, nextFocusOffset);
  if (IS_FIREFOX && nextSelection.isCollapsed() && rootElement !== null && !tags.has(SKIP_SELECTION_FOCUS_TAG)) {
    const focusedElement = getActiveElement(rootElement);
    if (focusedElement === null || !rootElement.contains(focusedElement)) {
      const deepFocusedElement = getActiveElementDeep(rootElement.ownerDocument);
      const focusEditor = deepFocusedElement !== null ? getNearestEditorFromDOMNode(deepFocusedElement) : null;
      if (focusEditor === null || focusEditor === editor) {
        rootElement.focus({
          preventScroll: true
        });
      }
    }
  }
  if (!tags.has(SKIP_SCROLL_INTO_VIEW_TAG) && nextSelection.isCollapsed() && rootElement !== null && // Re-read the active element rather than a value cached before the focus
  // restore / selection mutation above, which can become stale (e.g. when
  // setting the DOM selection focuses the contentEditable as a side effect).
  // Shallow is sufficient here for the same reason as the Firefox branch
  // above: the equality check doesn't cross the shadow boundary.
  rootElement === getActiveElement(rootElement)) {
    const selectionTarget = $isRangeSelection(nextSelection) && nextSelection.anchor.type === "element" ? nextAnchorNode.childNodes[nextAnchorOffset] || null : getCurrentRange();
    if (selectionTarget !== null) {
      let selectionRect;
      if (isDOMTextNode(selectionTarget)) {
        const range = selectionTarget.ownerDocument.createRange();
        range.selectNode(selectionTarget);
        selectionRect = range.getBoundingClientRect();
      } else {
        selectionRect = selectionTarget.getBoundingClientRect();
      }
      scrollIntoViewIfNeeded(editor, selectionRect, rootElement);
    }
  }
  markSelectionChangeFromDOMUpdate(editor, nextAnchorNode, nextAnchorOffset, nextFocusNode, nextFocusOffset);
}
function $insertNodes(nodes) {
  let selection = $getSelection() || $getPreviousSelection();
  if (selection === null) {
    selection = $getRoot().selectEnd();
  }
  selection.insertNodes(nodes);
}
function tokenizeRawText(text, visitor) {
  for (const part of text.split(/(\r?\n|\t)/)) {
    if (part === "\n" || part === "\r\n") {
      visitor.linebreak();
    } else if (part === "	") {
      visitor.tab();
    } else if (part !== "") {
      visitor.text(part);
    }
  }
}
function $generateNodesFromRawText(text) {
  const nodes = [];
  tokenizeRawText(text, {
    linebreak: () => nodes.push($createLineBreakNode()),
    tab: () => nodes.push($createTabNode()),
    text: (part) => nodes.push($createTextNode(part))
  });
  return nodes;
}
function $getTextContent() {
  const selection = $getSelection();
  if (selection === null) {
    return "";
  }
  return selection.getTextContent();
}
function $extractInlineFromBlocks(nodes) {
  const inlineNodes = [];
  for (const node of nodes) {
    if ($isLineBreakNode(node)) {
      continue;
    }
    if (($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline()) {
      if ($isElementNode(node)) {
        inlineNodes.push(...$extractInlineFromBlocks(node.getChildren()));
      }
      continue;
    }
    inlineNodes.push(node);
  }
  return inlineNodes;
}
function $removeTextAndSplitBlock(selection, stopAtUnsplittableNode = false) {
  let selection_ = selection;
  if (!selection.isCollapsed()) {
    selection_.removeText();
  }
  const newSelection = $getSelection();
  if ($isRangeSelection(newSelection)) {
    selection_ = newSelection;
  }
  if (!$isRangeSelection(selection_)) {
    formatDevErrorMessage(`Unexpected dirty selection to be null`);
  }
  const anchor = selection_.anchor;
  let node = anchor.getNode();
  let offset = anchor.offset;
  while (!INTERNAL_$isBlock(node) && $getSlotHostKey(node) === null) {
    const prevNode = node;
    [node, offset] = $splitNodeAtPoint(node, offset, stopAtUnsplittableNode);
    if (prevNode.is(node)) {
      break;
    }
  }
  return [node, offset];
}
function $splitNodeAtPoint(node, offset, stopAtUnsplittableNode = false) {
  const parent = node.getParent();
  if (!parent) {
    const paragraph = $createParagraphNode();
    $getRoot().append(paragraph);
    paragraph.select();
    return [$getRoot(), 0];
  }
  if ($isTextNode(node)) {
    const split = node.splitText(offset);
    if (split.length === 0) {
      return [parent, node.getIndexWithinParent()];
    }
    const x2 = offset === 0 ? 0 : 1;
    const index = split[0].getIndexWithinParent() + x2;
    return [parent, index];
  }
  if (!$isElementNode(node) || offset === 0) {
    return [parent, node.getIndexWithinParent()];
  }
  const firstToAppend = node.getChildAtIndex(offset);
  if (firstToAppend) {
    const insertPoint = new RangeSelection($createPoint(node.__key, offset, "element"), $createPoint(node.__key, offset, "element"), 0, "");
    const newElement = node.insertNewAfter(insertPoint);
    if (newElement) {
      newElement.append(firstToAppend, ...firstToAppend.getNextSiblings());
    } else if (stopAtUnsplittableNode) {
      return [node, offset];
    }
  }
  return [parent, node.getIndexWithinParent() + 1];
}
function $isInlineRunNode(node) {
  return $isLineBreakNode(node) || $isInlineElementOrDecoratorNode(node) || $isTextNode(node) || node.isParentRequired();
}
function $wrapInlineNodes(nodes) {
  const virtualRoot = $createParagraphNode();
  let currentBlock = null;
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = nodes[i2];
    if ($isInlineRunNode(node)) {
      if (currentBlock === null) {
        currentBlock = node.createParentElementNode();
        virtualRoot.append(currentBlock);
        const nextNode = nodes[i2 + 1];
        if ($isLineBreakNode(node) && (nextNode === void 0 || !$isInlineRunNode(nextNode))) {
          continue;
        }
      }
      currentBlock.append(node);
    } else {
      virtualRoot.append(node);
      currentBlock = null;
    }
  }
  return virtualRoot;
}
function $getNodesFromCaretRangeCompat(range) {
  const nodes = [];
  const [beforeSlice, afterSlice] = range.getTextSlices();
  if (beforeSlice) {
    nodes.push(beforeSlice.caret.origin);
  }
  const seenAncestors = /* @__PURE__ */ new Set();
  const seenElements = /* @__PURE__ */ new Set();
  for (const caret of range) {
    if ($isChildCaret(caret)) {
      const {
        origin
      } = caret;
      if (nodes.length === 0) {
        seenAncestors.add(origin);
      } else {
        seenElements.add(origin);
        nodes.push(origin);
      }
    } else {
      const {
        origin
      } = caret;
      if (!$isElementNode(origin) || !seenElements.has(origin)) {
        nodes.push(origin);
      }
    }
  }
  if (afterSlice) {
    nodes.push(afterSlice.caret.origin);
  }
  if ($isSiblingCaret(range.focus) && $isElementNode(range.focus.origin) && range.focus.getNodeAtCaret() === null) {
    for (let reverseCaret = $getChildCaret(range.focus.origin, "previous"); $isChildCaret(reverseCaret) && seenAncestors.has(reverseCaret.origin) && !reverseCaret.origin.isEmpty() && reverseCaret.origin.is(nodes[nodes.length - 1]); reverseCaret = $getAdjacentChildCaret(reverseCaret)) {
      seenAncestors.delete(reverseCaret.origin);
      nodes.pop();
    }
  }
  while (nodes.length > 1) {
    const lastIncludedNode = nodes[nodes.length - 1];
    if ($isElementNode(lastIncludedNode)) {
      if (seenElements.has(lastIncludedNode) || lastIncludedNode.isEmpty() || seenAncestors.has(lastIncludedNode)) ;
      else {
        nodes.pop();
        continue;
      }
    }
    break;
  }
  if (nodes.length === 0 && range.isCollapsed()) {
    const normCaret = $normalizeCaret(range.anchor);
    const flippedNormCaret = $normalizeCaret(range.anchor.getFlipped());
    const $getCandidate = (caret) => $isTextPointCaret(caret) ? caret.origin : caret.getNodeAtCaret();
    const node = $getCandidate(normCaret) || $getCandidate(flippedNormCaret) || (range.anchor.getNodeAtCaret() ? normCaret.origin : flippedNormCaret.origin);
    nodes.push(node);
  }
  return nodes;
}
function $modifySelectionAroundDecoratorsAndBlocks(selection, alter, isBackward, granularity, mode = "decorators-and-blocks") {
  if (alter === "move" && granularity === "character" && !selection.isCollapsed()) {
    const [src, dst] = isBackward === selection.isBackward() ? [selection.focus, selection.anchor] : [selection.anchor, selection.focus];
    dst.set(src.key, src.offset, src.type);
    return true;
  }
  const initialFocus = $caretFromPoint(selection.focus, isBackward ? "previous" : "next");
  const isLineBoundary = granularity === "lineboundary";
  const collapse = alter === "move";
  let focus = initialFocus;
  let checkForBlock = mode === "decorators-and-blocks";
  let isolated = false;
  if (!$isExtendableTextPointCaret(focus)) {
    for (const siblingCaret of focus) {
      checkForBlock = false;
      const {
        origin
      } = siblingCaret;
      if ($isDecoratorNode(origin)) {
        if (origin.isIsolated()) {
          isolated = true;
          break;
        }
        focus = siblingCaret;
        if (isLineBoundary && origin.isInline()) {
          continue;
        }
      }
      break;
    }
    if (isolated) {
      return true;
    }
    if (checkForBlock) {
      for (const nextCaret of $extendCaretToRange(initialFocus).iterNodeCarets(alter === "extend" ? "shadowRoot" : "root")) {
        if ($isChildCaret(nextCaret)) {
          if (!nextCaret.origin.isInline()) {
            focus = nextCaret;
          }
        } else if ($isElementNode(nextCaret.origin)) {
          continue;
        } else if ($isDecoratorNode(nextCaret.origin) && !nextCaret.origin.isInline()) {
          focus = nextCaret;
        }
        break;
      }
    }
  }
  if (focus === initialFocus) {
    return false;
  }
  if (collapse && !isLineBoundary && $isDecoratorNode(focus.origin) && focus.origin.isKeyboardSelectable()) {
    const nodeSelection = $createNodeSelection();
    nodeSelection.add(focus.origin.getKey());
    $setSelection(nodeSelection);
    return true;
  }
  focus = $normalizeCaret(focus);
  if (collapse) {
    $setPointFromCaret(selection.anchor, focus);
  }
  $setPointFromCaret(selection.focus, focus);
  return checkForBlock || !isLineBoundary;
}
var activeEditorState = null;
var activeEditor = null;
var isReadOnlyMode = false;
var isAttemptingToRecoverFromReconcilerError = false;
var isCommittingPendingUpdates = false;
var editorsWithPendingCascadeReset = /* @__PURE__ */ new Set();
var infiniteTransformCount = 0;
var observerOptions = {
  characterData: true,
  childList: true,
  subtree: true
};
function isCurrentlyReadOnlyMode() {
  return isReadOnlyMode || activeEditorState !== null && activeEditorState._readOnly;
}
function errorOnReadOnly() {
  if (isReadOnlyMode) {
    {
      formatDevErrorMessage(`Cannot use method in read-only mode.`);
    }
  }
}
function errorOnInfiniteTransforms() {
  if (infiniteTransformCount > 99) {
    {
      formatDevErrorMessage(`One or more transforms are endlessly triggering additional transforms. May have encountered infinite recursion caused by transforms that have their preconditions too lose and/or conflict with each other.`);
    }
  }
}
function getActiveEditorState() {
  if (activeEditorState === null) {
    {
      formatDevErrorMessage(`Unable to find an active editor state. State helpers or node methods can only be used synchronously during the callback of editor.update(), editor.read(), or editorState.read().${collectBuildInformation()}`);
    }
  }
  return activeEditorState;
}
function $assumeActiveEditor(editor) {
  if (getActiveEditorState() !== null && activeEditor === null) {
    activeEditor = editor;
  }
  if (!(activeEditor === editor)) {
    formatDevErrorMessage(`The given editor argument does not match $getEditor() in this context. Use editor.getEditorState().read(..., {editor}) if this cross-editor call is intentional.`);
  }
}
function getActiveEditor() {
  if (activeEditor === null) {
    {
      formatDevErrorMessage(`Unable to find an active editor. This method can only be used synchronously during the callback of editor.update(), editor.read(), or editor.getEditorState().read(..., {editor}).${collectBuildInformation()}`);
    }
  }
  return activeEditor;
}
function $fullReconcile() {
  getActiveEditor()._dirtyType = FULL_RECONCILE;
}
function collectBuildInformation() {
  let compatibleEditors = 0;
  const incompatibleEditors = /* @__PURE__ */ new Set();
  const thisVersion = LexicalEditor.version;
  if (typeof window !== "undefined") {
    for (const node of findAllLexicalElementsDeep(document)) {
      const editor = getEditorPropertyFromDOMNode(node);
      if (isLexicalEditor(editor)) {
        compatibleEditors++;
      } else if (editor) {
        let version = String(editor.constructor.version || "<0.17.1");
        if (version === thisVersion) {
          version += " (separately built, likely a bundler configuration issue)";
        }
        incompatibleEditors.add(version);
      }
    }
  }
  let output = ` Detected on the page: ${compatibleEditors} compatible editor(s) with version ${thisVersion}`;
  if (incompatibleEditors.size) {
    output += ` and incompatible editors with versions ${Array.from(incompatibleEditors).join(", ")}`;
  }
  return output;
}
function internalGetActiveEditor() {
  return activeEditor;
}
function internalGetActiveEditorState() {
  return activeEditorState;
}
function $applyTransforms(editor, node, transformsCache) {
  const type = node.__type;
  const registeredNode = getRegisteredNodeOrThrow(editor, type);
  let transformsArr = transformsCache.get(type);
  if (transformsArr === void 0) {
    transformsArr = Array.from(registeredNode.transforms);
    transformsCache.set(type, transformsArr);
  }
  const transformsArrLength = transformsArr.length;
  for (let i2 = 0; i2 < transformsArrLength; i2++) {
    transformsArr[i2](node);
    if (!node.isAttached()) {
      break;
    }
  }
}
function $isNodeValidForTransform(node, compositionKey) {
  return node !== void 0 && // We don't want to transform nodes being composed
  node.__key !== compositionKey && node.isAttached();
}
function $normalizeAllDirtyTextNodes(editorState, editor) {
  const dirtyLeaves = editor._dirtyLeaves;
  const nodeMap = editorState._nodeMap;
  for (const nodeKey of dirtyLeaves) {
    const node = nodeMap.get(nodeKey);
    if ($isTextNode(node) && node.isAttached() && node.isSimpleText() && !node.isUnmergeable()) {
      $normalizeTextNode(node);
    }
  }
}
function addTags(editor, tags) {
  if (!tags) {
    return;
  }
  const updateTags = editor._updateTags;
  let tags_ = tags;
  if (!Array.isArray(tags)) {
    tags_ = [tags];
  }
  for (const tag of tags_) {
    updateTags.add(tag);
  }
}
function $applyAllTransforms(editorState, editor) {
  const dirtyLeaves = editor._dirtyLeaves;
  const dirtyElements = editor._dirtyElements;
  const nodeMap = editorState._nodeMap;
  const compositionKey = $getCompositionKey();
  const transformsCache = /* @__PURE__ */ new Map();
  let untransformedDirtyLeaves = dirtyLeaves;
  let untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
  let untransformedDirtyElements = dirtyElements;
  let untransformedDirtyElementsLength = untransformedDirtyElements.size;
  while (untransformedDirtyLeavesLength > 0 || untransformedDirtyElementsLength > 0) {
    if (untransformedDirtyLeavesLength > 0) {
      editor._dirtyLeaves = /* @__PURE__ */ new Set();
      for (const nodeKey of untransformedDirtyLeaves) {
        const node = nodeMap.get(nodeKey);
        if ($isTextNode(node) && node.isAttached() && node.isSimpleText() && !node.isUnmergeable()) {
          $normalizeTextNode(node);
        }
        if (node !== void 0 && $isNodeValidForTransform(node, compositionKey)) {
          $applyTransforms(editor, node, transformsCache);
        }
        dirtyLeaves.add(nodeKey);
      }
      untransformedDirtyLeaves = editor._dirtyLeaves;
      untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
      if (untransformedDirtyLeavesLength > 0) {
        infiniteTransformCount++;
        continue;
      }
    }
    editor._dirtyLeaves = /* @__PURE__ */ new Set();
    editor._dirtyElements = /* @__PURE__ */ new Map();
    const rootDirty = untransformedDirtyElements.delete("root");
    if (rootDirty) {
      untransformedDirtyElements.set("root", true);
    }
    for (const currentUntransformedDirtyElement of untransformedDirtyElements) {
      const nodeKey = currentUntransformedDirtyElement[0];
      const intentionallyMarkedAsDirty = currentUntransformedDirtyElement[1];
      dirtyElements.set(nodeKey, intentionallyMarkedAsDirty);
      if (!intentionallyMarkedAsDirty) {
        continue;
      }
      const node = nodeMap.get(nodeKey);
      if (node !== void 0 && $isNodeValidForTransform(node, compositionKey)) {
        $applyTransforms(editor, node, transformsCache);
      }
    }
    untransformedDirtyLeaves = editor._dirtyLeaves;
    untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
    untransformedDirtyElements = editor._dirtyElements;
    untransformedDirtyElementsLength = untransformedDirtyElements.size;
    infiniteTransformCount++;
  }
  editor._dirtyLeaves = dirtyLeaves;
  editor._dirtyElements = dirtyElements;
}
function $parseSerializedNode(serializedNode) {
  const internalSerializedNode = serializedNode;
  return $parseSerializedNodeImpl(internalSerializedNode, getActiveEditor()._nodes);
}
function $parseSerializedNodeImpl(serializedNode, registeredNodes) {
  const type = serializedNode.type;
  const registeredNode = registeredNodes.get(type);
  if (registeredNode === void 0) {
    {
      formatDevErrorMessage(`parseEditorState: type "${type}" + not found`);
    }
  }
  const nodeClass = registeredNode.klass;
  if (serializedNode.type !== nodeClass.getType()) {
    {
      formatDevErrorMessage(`LexicalNode: Node ${nodeClass.name} does not implement .importJSON().`);
    }
  }
  const node = nodeClass.importJSON(serializedNode);
  const children = serializedNode.children;
  if ($isElementNode(node) && Array.isArray(children)) {
    for (let i2 = 0; i2 < children.length; i2++) {
      const serializedJSONChildNode = children[i2];
      const childNode = $parseSerializedNodeImpl(serializedJSONChildNode, registeredNodes);
      node.append(childNode);
    }
  }
  const slots = serializedNode.$slots;
  if (slots) {
    if (!$isSlotHost(node)) {
      formatDevErrorMessage(`$parseSerializedNode: node ${nodeClass.name} has slots but is not a valid slot host; only ElementNodes and DecoratorNodes can host slots.`);
    }
    for (const name in slots) {
      const slotNode = $parseSerializedNodeImpl(slots[name], registeredNodes);
      $setSlot(node, name, slotNode);
    }
  }
  return node;
}
function parseEditorState(serializedEditorState, editor, updateFn) {
  const editorState = createEmptyEditorState();
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  const previousDirtyElements = editor._dirtyElements;
  const previousDirtyLeaves = editor._dirtyLeaves;
  const previousCloneNotNeeded = editor._cloneNotNeeded;
  const previousDirtyType = editor._dirtyType;
  editor._dirtyElements = /* @__PURE__ */ new Map();
  editor._dirtyLeaves = /* @__PURE__ */ new Set();
  editor._cloneNotNeeded = /* @__PURE__ */ new Set();
  editor._dirtyType = NO_DIRTY_NODES;
  activeEditorState = editorState;
  isReadOnlyMode = false;
  activeEditor = editor;
  setPendingNodeToClone(null);
  try {
    const registeredNodes = editor._nodes;
    const serializedNode = serializedEditorState.root;
    $parseSerializedNodeImpl(serializedNode, registeredNodes);
    if (updateFn) {
      updateFn();
    }
    editorState._readOnly = true;
    editorState._parsed = true;
    {
      handleDEVOnlyPendingUpdateGuarantees(editorState);
    }
  } catch (error) {
    if (error instanceof Error) {
      editor._onError(error);
    }
  } finally {
    editor._dirtyElements = previousDirtyElements;
    editor._dirtyLeaves = previousDirtyLeaves;
    editor._cloneNotNeeded = previousCloneNotNeeded;
    editor._dirtyType = previousDirtyType;
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
  }
  return editorState;
}
function readEditorState(editor, editorState, callbackFn) {
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  activeEditorState = editorState;
  isReadOnlyMode = true;
  activeEditor = editor;
  try {
    return callbackFn();
  } finally {
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
  }
}
function handleDEVOnlyPendingUpdateGuarantees(pendingEditorState) {
  const nodeMap = pendingEditorState._nodeMap;
  nodeMap.set = () => {
    throw new Error("Cannot call set() on a frozen Lexical node map");
  };
  nodeMap.clear = () => {
    throw new Error("Cannot call clear() on a frozen Lexical node map");
  };
  nodeMap.delete = () => {
    throw new Error("Cannot call delete() on a frozen Lexical node map");
  };
}
function $commitPendingUpdates(editor, recoveryEditorState) {
  const previouslyCommitting = isCommittingPendingUpdates;
  isCommittingPendingUpdates = true;
  try {
    $commitPendingUpdatesImpl(editor, recoveryEditorState);
  } finally {
    isCommittingPendingUpdates = previouslyCommitting;
  }
}
function $commitPendingUpdatesImpl(editor, recoveryEditorState) {
  const pendingEditorState = editor._pendingEditorState;
  const rootElement = editor._rootElement;
  const shouldSkipDOM = editor._headless || rootElement === null;
  if (pendingEditorState === null) {
    if (!editor._updating && editor._deferred.length > 0) {
      triggerDeferredUpdateCallbacks(editor, editor._deferred);
    }
    return;
  }
  const currentEditorState = editor._editorState;
  const currentSelection = currentEditorState._selection;
  const pendingSelection = pendingEditorState._selection;
  const needsUpdate = editor._dirtyType !== NO_DIRTY_NODES;
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  const previouslyUpdating = editor._updating;
  const observer = editor._observer;
  let mutatedNodes2 = null;
  editor._pendingEditorState = null;
  editor._editorState = pendingEditorState;
  if (!shouldSkipDOM && needsUpdate && observer !== null) {
    activeEditor = editor;
    activeEditorState = pendingEditorState;
    isReadOnlyMode = false;
    editor._updating = true;
    try {
      const dirtyType = editor._dirtyType;
      const dirtyElements2 = editor._dirtyElements;
      const dirtyLeaves2 = editor._dirtyLeaves;
      observer.disconnect();
      mutatedNodes2 = $reconcileRoot(currentEditorState, pendingEditorState, editor, dirtyType, dirtyElements2, dirtyLeaves2);
    } catch (error) {
      if (error instanceof Error) {
        editor._onError(error);
      }
      if (!isAttemptingToRecoverFromReconcilerError) {
        resetEditor(editor, null, rootElement, pendingEditorState);
        initMutationObserver(editor);
        editor._dirtyType = FULL_RECONCILE;
        isAttemptingToRecoverFromReconcilerError = true;
        $commitPendingUpdates(editor, currentEditorState);
        isAttemptingToRecoverFromReconcilerError = false;
      } else {
        throw error;
      }
      return;
    } finally {
      observer.observe(rootElement, observerOptions);
      editor._updating = previouslyUpdating;
      activeEditorState = previousActiveEditorState;
      isReadOnlyMode = previousReadOnlyMode;
      activeEditor = previousActiveEditor;
    }
  }
  if (!pendingEditorState._readOnly) {
    pendingEditorState._readOnly = true;
    {
      handleDEVOnlyPendingUpdateGuarantees(pendingEditorState);
      if ($isRangeSelection(pendingSelection)) {
        Object.freeze(pendingSelection.anchor);
        Object.freeze(pendingSelection.focus);
      }
      Object.freeze(pendingSelection);
    }
  }
  const dirtyLeaves = editor._dirtyLeaves;
  const dirtyElements = editor._dirtyElements;
  const normalizedNodes = editor._normalizedNodes;
  const tags = editor._updateTags;
  if (needsUpdate) {
    editor._dirtyType = NO_DIRTY_NODES;
    editor._cloneNotNeeded.clear();
    editor._dirtyLeaves = /* @__PURE__ */ new Set();
    editor._dirtyElements = /* @__PURE__ */ new Map();
    editor._normalizedNodes = /* @__PURE__ */ new Set();
  }
  editor._updateTags = /* @__PURE__ */ new Set();
  $garbageCollectDetachedDecorators(editor, pendingEditorState);
  const domSelection = shouldSkipDOM ? null : getDOMSelection(getWindow(editor));
  if (editor._editable && // domSelection will be null in headless
  domSelection !== null && (needsUpdate || pendingSelection === null || pendingSelection.dirty || !pendingSelection.is(currentSelection)) && rootElement !== null && !tags.has(SKIP_DOM_SELECTION_TAG)) {
    activeEditor = editor;
    activeEditorState = pendingEditorState;
    try {
      if (observer !== null) {
        observer.disconnect();
      }
      if (needsUpdate || pendingSelection === null || pendingSelection.dirty) {
        const blockCursorElement = editor._blockCursorElement;
        if (blockCursorElement !== null) {
          removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
        }
        $updateDOMSelection(currentSelection, pendingSelection, editor, domSelection, tags, rootElement);
      }
      $updateDOMBlockCursorElement(editor, rootElement, pendingSelection);
    } finally {
      if (observer !== null) {
        observer.observe(rootElement, observerOptions);
      }
      activeEditor = previousActiveEditor;
      activeEditorState = previousActiveEditorState;
    }
  }
  if (mutatedNodes2 !== null) {
    triggerMutationListeners(editor, mutatedNodes2, tags, dirtyLeaves, currentEditorState);
  }
  if (!$isRangeSelection(pendingSelection) && pendingSelection !== null && (currentSelection === null || !currentSelection.is(pendingSelection))) {
    editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
  }
  const pendingDecorators = editor._pendingDecorators;
  if (pendingDecorators !== null) {
    editor._decorators = pendingDecorators;
    editor._pendingDecorators = null;
    triggerListeners("decorator", editor, true, pendingDecorators);
  }
  triggerTextContentListeners(editor, recoveryEditorState || currentEditorState, pendingEditorState);
  triggerListeners("update", editor, true, {
    dirtyElements,
    dirtyLeaves,
    editorState: pendingEditorState,
    mutatedNodes: mutatedNodes2,
    normalizedNodes,
    prevEditorState: recoveryEditorState || currentEditorState,
    tags
  });
  if (!previouslyUpdating) {
    const deferred = editor._deferred;
    triggerDeferredUpdateCallbacks(editor, deferred);
  }
  $triggerEnqueuedUpdates(editor);
}
function triggerTextContentListeners(editor, currentEditorState, pendingEditorState) {
  const currentTextContent = getEditorStateTextContent(currentEditorState);
  const latestTextContent = getEditorStateTextContent(pendingEditorState);
  if (currentTextContent !== latestTextContent) {
    triggerListeners("textcontent", editor, true, latestTextContent);
  }
}
function triggerMutationListeners(editor, mutatedNodes2, updateTags, dirtyLeaves, prevEditorState) {
  const listeners = Array.from(editor._listeners.mutation);
  const listenersLength = listeners.length;
  for (let i2 = 0; i2 < listenersLength; i2++) {
    const [listener, klassSet] = listeners[i2];
    for (const klass of klassSet) {
      const mutatedNodesByType = mutatedNodes2.get(klass);
      if (mutatedNodesByType !== void 0) {
        listener(mutatedNodesByType, {
          dirtyLeaves,
          prevEditorState,
          updateTags
        });
      }
    }
  }
}
function triggerListeners(type, editor, isCurrentlyEnqueuingUpdates, ...payload) {
  const previouslyUpdating = editor._updating;
  editor._updating = isCurrentlyEnqueuingUpdates;
  try {
    const listenerMap = editor._listeners[type];
    const listeners = Array.from(listenerMap);
    for (const [listener, unregister] of listeners) {
      if (unregister) {
        unregister();
      }
      const result = listener(...payload);
      const nextUnregister = typeof result === "function" ? result : void 0;
      if (listenerMap.has(listener)) {
        listenerMap.set(listener, nextUnregister);
      } else if (nextUnregister) {
        nextUnregister();
      }
    }
  } finally {
    editor._updating = previouslyUpdating;
  }
}
function triggerCommandListeners(editor, type, payload, fromEditor) {
  const editors = getEditorsToPropagate(editor);
  let updatingParentEditor;
  if (!isCommittingPendingUpdates) {
    for (let e2 = 0; e2 < editors.length; e2++) {
      if (!editors[e2]._updating) {
        editors[e2]._cascadeCount = 0;
      }
    }
  }
  for (let i2 = 4; i2 >= 0; i2--) {
    for (let e2 = 0; e2 < editors.length; e2++) {
      const currentEditor = editors[e2];
      if (e2 > 0 && currentEditor._updating) {
        updatingParentEditor = currentEditor;
        break;
      }
      const commandListeners = currentEditor._commands;
      const listenerInPriorityOrder = commandListeners.get(type);
      if (listenerInPriorityOrder !== void 0) {
        const listenersSet = listenerInPriorityOrder[i2];
        if (listenersSet.size > 0) {
          let returnVal = false;
          updateEditorSync(currentEditor, () => {
            for (const listener of listenersSet) {
              if (listener(payload, fromEditor)) {
                returnVal = true;
                return;
              }
            }
          });
          if (returnVal) {
            return returnVal;
          }
        }
      }
    }
  }
  if (updatingParentEditor) {
    updatingParentEditor.update(() => {
      triggerCommandListeners(updatingParentEditor, type, payload, fromEditor);
    });
  }
  return false;
}
function scheduleCascadeReset(editor) {
  if (editorsWithPendingCascadeReset.has(editor)) {
    return;
  }
  editorsWithPendingCascadeReset.add(editor);
  setTimeout(() => {
    editorsWithPendingCascadeReset.delete(editor);
    editor._cascadeCount = 0;
  }, 0);
}
function $triggerEnqueuedUpdates(editor) {
  const queuedUpdates = editor._updates;
  if (queuedUpdates.length === 0) {
    editor._cascadeCount = 0;
    return;
  }
  scheduleCascadeReset(editor);
  if (editor._cascadeCount++ > 99) {
    editor._updates = [];
    editor._cascadeCount = 0;
    editor._onWarn(new Error(`One or more update listeners are endlessly enqueueing more updates. May have encountered infinite recursion caused by update listeners that trigger additional updates without a stop condition. Editor namespace: ${editor._config.namespace}`));
    return;
  }
  const queuedUpdate = queuedUpdates.shift();
  if (queuedUpdate) {
    const [updateFn, options] = queuedUpdate;
    $beginUpdate(editor, updateFn, options);
  }
}
function triggerDeferredUpdateCallbacks(editor, deferred) {
  editor._deferred = [];
  if (deferred.length !== 0) {
    const previouslyUpdating = editor._updating;
    editor._updating = true;
    try {
      for (let i2 = 0; i2 < deferred.length; i2++) {
        deferred[i2]();
      }
    } finally {
      editor._updating = previouslyUpdating;
    }
  }
}
function $processNestedUpdates(editor, initialSkipTransforms) {
  const queuedUpdates = editor._updates;
  let skipTransforms = initialSkipTransforms || false;
  while (queuedUpdates.length !== 0) {
    const queuedUpdate = queuedUpdates.shift();
    if (queuedUpdate) {
      const [nextUpdateFn, options] = queuedUpdate;
      const pendingEditorState = editor._pendingEditorState;
      let onUpdate;
      if (options !== void 0) {
        onUpdate = options.onUpdate;
        if (options.skipTransforms) {
          skipTransforms = true;
        }
        if (options.discrete) {
          if (!(pendingEditorState !== null)) {
            formatDevErrorMessage(`Unexpected empty pending editor state on discrete nested update`);
          }
          pendingEditorState._flushSync = true;
        }
        if (onUpdate) {
          editor._deferred.push(onUpdate);
        }
        addTags(editor, options.tag);
      }
      if (pendingEditorState == null) {
        $beginUpdate(editor, nextUpdateFn, options);
      } else {
        nextUpdateFn();
      }
    }
  }
  return skipTransforms;
}
function $flushSyncAfterUpdate() {
  const editorState = getActiveEditorState();
  errorOnReadOnly();
  editorState._flushSync = true;
}
function $beginUpdate(editor, updateFn, options) {
  const updateTags = editor._updateTags;
  let onUpdate;
  let skipTransforms = false;
  let discrete = false;
  if (options !== void 0) {
    onUpdate = options.onUpdate;
    addTags(editor, options.tag);
    skipTransforms = options.skipTransforms || false;
    discrete = options.discrete || false;
  }
  if (onUpdate) {
    editor._deferred.push(onUpdate);
  }
  const currentEditorState = editor._editorState;
  let pendingEditorState = editor._pendingEditorState;
  let editorStateWasCloned = false;
  if (pendingEditorState === null || pendingEditorState._readOnly) {
    pendingEditorState = editor._pendingEditorState = cloneEditorState(pendingEditorState || currentEditorState);
    editorStateWasCloned = true;
  }
  pendingEditorState._flushSync = discrete;
  const previousActiveEditorState = activeEditorState;
  const previousReadOnlyMode = isReadOnlyMode;
  const previousActiveEditor = activeEditor;
  const previouslyUpdating = editor._updating;
  activeEditorState = pendingEditorState;
  isReadOnlyMode = false;
  editor._updating = true;
  activeEditor = editor;
  const headless = editor._headless || editor.getRootElement() === null;
  setPendingNodeToClone(null);
  try {
    if (editorStateWasCloned) {
      if (headless) {
        if (currentEditorState._selection !== null) {
          pendingEditorState._selection = currentEditorState._selection.clone();
        }
      } else {
        pendingEditorState._selection = $internalCreateSelection(editor, options && options.event || null);
      }
    }
    const startingCompositionKey = editor._compositionKey;
    updateFn();
    skipTransforms = $processNestedUpdates(editor, skipTransforms);
    applySelectionTransforms(pendingEditorState, editor);
    if (editor._dirtyType !== NO_DIRTY_NODES) {
      if (skipTransforms) {
        $normalizeAllDirtyTextNodes(pendingEditorState, editor);
      } else {
        $applyAllTransforms(pendingEditorState, editor);
      }
      $processNestedUpdates(editor);
      $garbageCollectDetachedNodes(currentEditorState, pendingEditorState, editor._dirtyLeaves, editor._dirtyElements);
    }
    const endingCompositionKey = editor._compositionKey;
    if (startingCompositionKey !== endingCompositionKey) {
      pendingEditorState._flushSync = true;
    }
    const pendingSelection = pendingEditorState._selection;
    if ($isRangeSelection(pendingSelection)) {
      if (editor._slotsUsed) {
        $clampRangeSelectionToSlotFrame(pendingSelection);
      }
      const pendingNodeMap = pendingEditorState._nodeMap;
      const anchorKey = pendingSelection.anchor.key;
      const focusKey = pendingSelection.focus.key;
      if (pendingNodeMap.get(anchorKey) === void 0 || pendingNodeMap.get(focusKey) === void 0) {
        {
          formatDevErrorMessage(`updateEditor: selection has been lost because the previously selected nodes have been removed and selection wasn't moved to another node. Ensure selection changes after removing/replacing a selected node.`);
        }
      }
    } else if ($isNodeSelection(pendingSelection)) {
      if (pendingSelection._nodes.size === 0) {
        pendingEditorState._selection = null;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      editor._onError(error);
    }
    editor._pendingEditorState = currentEditorState;
    editor._dirtyType = FULL_RECONCILE;
    editor._cloneNotNeeded.clear();
    editor._dirtyLeaves = /* @__PURE__ */ new Set();
    editor._dirtyElements.clear();
    $commitPendingUpdates(editor);
    return;
  } finally {
    activeEditorState = previousActiveEditorState;
    isReadOnlyMode = previousReadOnlyMode;
    activeEditor = previousActiveEditor;
    editor._updating = previouslyUpdating;
    infiniteTransformCount = 0;
  }
  const shouldUpdate = editor._dirtyType !== NO_DIRTY_NODES || editor._deferred.length > 0 || editorStateHasDirtySelection(pendingEditorState, editor);
  if (shouldUpdate) {
    if (pendingEditorState._flushSync) {
      pendingEditorState._flushSync = false;
      $commitPendingUpdates(editor);
    } else if (editorStateWasCloned) {
      scheduleMicroTask(() => {
        $commitPendingUpdates(editor);
      });
    }
  } else {
    pendingEditorState._flushSync = false;
    if (editorStateWasCloned) {
      updateTags.clear();
      editor._deferred = [];
      editor._pendingEditorState = null;
    }
  }
}
function updateEditorSync(editor, updateFn, options) {
  if (activeEditor === editor && options === void 0) {
    if (isCurrentlyReadOnlyMode()) {
      {
        console.warn(`updateEditorSync: an editor update (e.g. a command listener that mutates the editor) ran while a read-only context was on the stack. This most commonly happens when a command is dispatched from inside editor.read(). The update has been deferred to a fresh writable update so it still applies, but dispatching mutations from a read-only context is an anti-pattern \u2014 dispatch after editor.read() returns, or via queueMicrotask.`);
      }
      $beginUpdate(editor, updateFn, options);
    } else {
      updateFn();
    }
  } else {
    $beginUpdate(editor, updateFn, options);
  }
}
function updateEditor(editor, updateFn, options) {
  if (editor._updating) {
    editor._updates.push([updateFn, options]);
  } else {
    $beginUpdate(editor, updateFn, options);
  }
}
function $normalizeShadowRootChildren(node) {
  if ($isRootOrShadowRoot(node)) {
    let block = null;
    for (const child of node.getChildren()) {
      block = child.isInline() ? (block || child.replace(child.createParentElementNode())).append(child) : null;
    }
  }
}
var ElementNode = class extends LexicalNode {
  /** @internal */
  /** @internal */
  __first;
  /** @internal */
  __last;
  /** @internal */
  __size;
  /** @internal */
  __format;
  /** @internal */
  __style;
  /** @internal */
  __indent;
  /** @internal */
  __dir;
  /** @internal */
  __textFormat;
  /** @internal */
  __textStyle;
  /** @internal */
  __slotHost;
  /** @internal */
  __slots;
  // Specific type information is discarded for backwards compatibility,
  // there is nothing meaninful to gain from requiring `{extends: ElementNode}`
  // with the current shape here (just a `$transform`)
  $config() {
    return this.config(/* @__PURE__ */ Symbol.for("ElementNode"), {
      /*
       * Built-in normalize for shadow-root ElementNodes: wraps any direct child
       * that is neither an ElementNode nor a DecoratorNode in a paragraph, so
       * the slot-frame invariant set by `getTopLevelElement` continues to hold
       * for external inputs (URL doc payloads, imported JSON, paste round-trips)
       * that may carry shapes the in-editor mutation paths can no longer
       * produce. In-editor mutation paths still fail-fast on the invariant.
       *
       * Runs as a static transform so the existing dirty-node transform cycle
       * drives it — typing paths cover their own dirty bookkeeping, hydrate
       * paths (`setEditorState`) dirty-mark slot hosts so the cycle picks them
       * up.
       */
      $transform: $normalizeShadowRootChildren,
      extends: LexicalNode
    });
  }
  constructor(key) {
    super(key);
    this.__first = null;
    this.__last = null;
    this.__size = 0;
    this.__format = 0;
    this.__style = "";
    this.__indent = 0;
    this.__dir = null;
    this.__textFormat = 0;
    this.__textStyle = "";
    this.__slotHost = null;
    this.__slots = null;
  }
  afterCloneFrom(prevNode) {
    super.afterCloneFrom(prevNode);
    if (this.__key === prevNode.__key) {
      this.__first = prevNode.__first;
      this.__last = prevNode.__last;
      this.__size = prevNode.__size;
      this.__slotHost = prevNode.__slotHost;
      if (!(this.__slotHost === null || this.__parent === null)) {
        formatDevErrorMessage(`ElementNode: node ${this.__key} is both slotted into host ${String(this.__slotHost)} and a child of parent ${String(this.__parent)}; __slotHost and __parent are mutually exclusive`);
      }
      this.__slots = prevNode.__slots;
    }
    this.__indent = prevNode.__indent;
    this.__format = prevNode.__format;
    this.__style = prevNode.__style;
    this.__dir = prevNode.__dir;
    this.__textFormat = prevNode.__textFormat;
    this.__textStyle = prevNode.__textStyle;
  }
  getFormat() {
    const self = this.getLatest();
    return self.__format;
  }
  getFormatType() {
    const format = this.getFormat();
    return ELEMENT_FORMAT_TO_TYPE[format] || "";
  }
  getStyle() {
    const self = this.getLatest();
    return self.__style;
  }
  getIndent() {
    const self = this.getLatest();
    return self.__indent;
  }
  /**
   * Returns the children of this node, in document order.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getChildren() as T[]`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the results with a type guard instead.
   */
  getChildren() {
    const children = [];
    let child = this.getFirstChild();
    while (child !== null) {
      children.push(child);
      child = child.getNextSibling();
    }
    return children;
  }
  getChildrenKeys() {
    const children = [];
    let child = this.getFirstChild();
    while (child !== null) {
      children.push(child.__key);
      child = child.getNextSibling();
    }
    return children;
  }
  getChildrenSize() {
    const self = this.getLatest();
    return self.__size;
  }
  isEmpty() {
    return this.getChildrenSize() === 0 && $getSlotNames(this).length === 0;
  }
  isDirty() {
    const editor = getActiveEditor();
    const dirtyElements = editor._dirtyElements;
    return dirtyElements !== null && dirtyElements.has(this.__key);
  }
  isLastChild() {
    const self = this.getLatest();
    const parentLastChild = this.getParentOrThrow().getLastChild();
    return parentLastChild !== null && parentLastChild.is(self);
  }
  getAllTextNodes() {
    const textNodes = [];
    for (const name of $getSlotNames(this)) {
      const slot = $getSlot(this, name);
      if ($isElementNode(slot)) {
        for (const textNode of slot.getAllTextNodes()) {
          textNodes.push(textNode);
        }
      }
    }
    let child = this.getFirstChild();
    while (child !== null) {
      if ($isTextNode(child)) {
        textNodes.push(child);
      }
      if ($isElementNode(child)) {
        for (const textNode of child.getAllTextNodes()) {
          textNodes.push(textNode);
        }
      }
      child = child.getNextSibling();
    }
    return textNodes;
  }
  /**
   * Returns the deepest first descendant of this node,
   * or null if it has no children.
   *
   * Descendant navigation is children-only by design: it feeds selectStart /
   * selectEnd and selection, which must not see slots (slots are isolated).
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getFirstDescendant() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getFirstDescendant() {
    let node = this.getFirstChild();
    while ($isElementNode(node)) {
      const child = node.getFirstChild();
      if (child === null) {
        break;
      }
      node = child;
    }
    return node;
  }
  /**
   * Returns the deepest last descendant of this node,
   * or null if it has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getLastDescendant() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getLastDescendant() {
    let node = this.getLastChild();
    while ($isElementNode(node)) {
      const child = node.getLastChild();
      if (child === null) {
        break;
      }
      node = child;
    }
    return node;
  }
  /**
   * Returns the deepest descendant corresponding to the child at the given
   * index, or null if this node has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getDescendantByIndex(index) as T | null`, and
   * will be removed in a future release. Call this method without a type
   * argument and narrow the result with a type guard instead.
   */
  getDescendantByIndex(index) {
    const children = this.getChildren();
    const childrenLength = children.length;
    if (index >= childrenLength) {
      const resolvedNode2 = children[childrenLength - 1];
      return $isElementNode(resolvedNode2) && resolvedNode2.getLastDescendant() || resolvedNode2 || null;
    }
    const resolvedNode = children[index];
    return $isElementNode(resolvedNode) && resolvedNode.getFirstDescendant() || resolvedNode || null;
  }
  /**
   * Returns the first child of this node, or null if it has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getFirstChild() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getFirstChild() {
    const self = this.getLatest();
    const firstKey = self.__first;
    return firstKey === null ? null : $getNodeByKey(firstKey);
  }
  /**
   * Returns the first child of this node, or throws if it has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getFirstChildOrThrow() as T`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getFirstChildOrThrow() {
    const firstChild = this.getFirstChild();
    if (firstChild === null) {
      {
        formatDevErrorMessage(`Expected node ${this.__key} to have a first child.`);
      }
    }
    return firstChild;
  }
  /**
   * Returns the last child of this node, or null if it has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getLastChild() as T | null`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getLastChild() {
    const self = this.getLatest();
    const lastKey = self.__last;
    return lastKey === null ? null : $getNodeByKey(lastKey);
  }
  /**
   * Returns the last child of this node, or throws if it has no children.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getLastChildOrThrow() as T`, and will be
   * removed in a future release. Call this method without a type argument
   * and narrow the result with a type guard instead.
   */
  getLastChildOrThrow() {
    const lastChild = this.getLastChild();
    if (lastChild === null) {
      {
        formatDevErrorMessage(`Expected node ${this.__key} to have a last child.`);
      }
    }
    return lastChild;
  }
  /**
   * Returns the child of this node at the given index, or null if
   * the index is out of range.
   */
  /**
   * @deprecated The type parameter is an unchecked and unsafe cast,
   * equivalent to `element.getChildAtIndex(index) as T | null`, and will
   * be removed in a future release. Call this method without a type
   * argument and narrow the result with a type guard instead.
   */
  getChildAtIndex(index) {
    const size = this.getChildrenSize();
    let node;
    let i2;
    if (index < size / 2) {
      node = this.getFirstChild();
      i2 = 0;
      while (node !== null && i2 <= index) {
        if (i2 === index) {
          return node;
        }
        node = node.getNextSibling();
        i2++;
      }
      return null;
    }
    node = this.getLastChild();
    i2 = size - 1;
    while (node !== null && i2 >= index) {
      if (i2 === index) {
        return node;
      }
      node = node.getPreviousSibling();
      i2--;
    }
    return null;
  }
  getTextContent() {
    let textContent = $getSlotsTextContent(this);
    const children = this.getChildren();
    const childrenLength = children.length;
    for (let i2 = 0; i2 < childrenLength; i2++) {
      const child = children[i2];
      textContent += child.getTextContent();
      if (
        // this is an inline $textContentRequiresDoubleLinebreakAtEnd(child)
        $isElementNode(child) && i2 !== childrenLength - 1 && !child.isInline()
      ) {
        textContent += DOUBLE_LINE_BREAK;
      }
    }
    return textContent;
  }
  getTextContentSize() {
    let textContentSize = $getSlotsTextContentSize(this);
    const children = this.getChildren();
    const childrenLength = children.length;
    for (let i2 = 0; i2 < childrenLength; i2++) {
      const child = children[i2];
      textContentSize += child.getTextContentSize();
      if (
        // This is an inline $textContentRequiresDoubleLinebreakAtEnd(child)
        $isElementNode(child) && i2 !== childrenLength - 1 && !child.isInline()
      ) {
        textContentSize += DOUBLE_LINE_BREAK.length;
      }
    }
    return textContentSize;
  }
  getDirection() {
    const self = this.getLatest();
    return self.__dir;
  }
  getTextFormat() {
    const self = this.getLatest();
    return self.__textFormat;
  }
  hasFormat(type) {
    if (type !== "") {
      const formatFlag = ELEMENT_TYPE_TO_FORMAT[type];
      return (this.getFormat() & formatFlag) !== 0;
    }
    return false;
  }
  hasTextFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT[type];
    return (this.getTextFormat() & formatFlag) !== 0;
  }
  /**
   * Returns the format flags applied to the node as a 32-bit integer.
   *
   * @returns a number representing the TextFormatTypes applied to the node.
   */
  getFormatFlags(type, alignWithFormat) {
    const self = this.getLatest();
    const format = self.__textFormat;
    return toggleTextFormatType(format, type, alignWithFormat);
  }
  getTextStyle() {
    const self = this.getLatest();
    return self.__textStyle;
  }
  // Mutators
  select(_anchorOffset, _focusOffset) {
    errorOnReadOnly();
    const selection = $getSelection();
    let anchorOffset = _anchorOffset;
    let focusOffset = _focusOffset;
    const childrenCount = this.getChildrenSize();
    if (!this.canBeEmpty()) {
      if (_anchorOffset === 0 && _focusOffset === 0) {
        const firstChild = this.getFirstChild();
        if ($isTextNode(firstChild) || $isElementNode(firstChild)) {
          return firstChild.select(0, 0);
        }
      } else if ((_anchorOffset === void 0 || _anchorOffset === childrenCount) && (_focusOffset === void 0 || _focusOffset === childrenCount)) {
        const lastChild = this.getLastChild();
        if ($isTextNode(lastChild) || $isElementNode(lastChild)) {
          return lastChild.select();
        }
      }
    }
    if (anchorOffset === void 0) {
      anchorOffset = childrenCount;
    }
    if (focusOffset === void 0) {
      focusOffset = childrenCount;
    }
    const key = this.__key;
    if (!$isRangeSelection(selection)) {
      return $internalMakeRangeSelection(key, anchorOffset, key, focusOffset, "element", "element");
    } else {
      selection.anchor.set(key, anchorOffset, "element");
      selection.focus.set(key, focusOffset, "element");
      selection.dirty = true;
    }
    return selection;
  }
  selectStart() {
    const firstNode = this.getFirstDescendant();
    return firstNode ? firstNode.selectStart() : this.select();
  }
  selectEnd() {
    const lastNode = this.getLastDescendant();
    return lastNode ? lastNode.selectEnd() : this.select();
  }
  clear() {
    const writableSelf = this.getWritable();
    const children = this.getChildren();
    children.forEach((child) => child.remove());
    return writableSelf;
  }
  append(...nodesToAppend) {
    return this.splice(this.getChildrenSize(), 0, nodesToAppend);
  }
  setDirection(direction) {
    const self = this.getWritable();
    self.__dir = direction;
    return self;
  }
  setFormat(type) {
    const self = this.getWritable();
    self.__format = type !== "" ? ELEMENT_TYPE_TO_FORMAT[type] || 0 : 0;
    return this;
  }
  setStyle(style) {
    const self = this.getWritable();
    self.__style = style || "";
    return this;
  }
  setTextFormat(type) {
    const self = this.getWritable();
    self.__textFormat = type;
    return self;
  }
  setTextStyle(style) {
    const self = this.getWritable();
    self.__textStyle = style;
    return self;
  }
  setIndent(indentLevel) {
    const self = this.getWritable();
    self.__indent = indentLevel;
    return this;
  }
  splice(start, deleteCount, nodesToInsert) {
    if (!!$isEphemeral(this)) {
      formatDevErrorMessage(`ElementNode.splice: Ephemeral nodes can not mutate their children (key ${this.__key} type ${this.__type})`);
    }
    const oldSize = this.getChildrenSize();
    const writableSelf = this.getWritable();
    if (!(start + deleteCount <= oldSize)) {
      formatDevErrorMessage(`ElementNode.splice: start + deleteCount > oldSize (${String(start)} + ${String(deleteCount)} > ${String(oldSize)})`);
    }
    for (const nodeToInsert of nodesToInsert) {
      $errorOnSlotCycleChild(writableSelf, nodeToInsert);
    }
    const writableSelfKey = writableSelf.__key;
    const nodesToInsertKeys = [];
    const nodesToRemoveKeys = [];
    let nodeAfterRange = this.getChildAtIndex(start + deleteCount);
    let nodeBeforeRange = null;
    let newSize = oldSize - deleteCount + nodesToInsert.length;
    if (start !== 0) {
      if (start === oldSize) {
        nodeBeforeRange = this.getLastChild();
      } else {
        const node = this.getChildAtIndex(start);
        if (node !== null) {
          nodeBeforeRange = node.getPreviousSibling();
        }
      }
    }
    if (deleteCount > 0) {
      let nodeToDelete = nodeBeforeRange === null ? this.getFirstChild() : nodeBeforeRange.getNextSibling();
      for (let i2 = 0; i2 < deleteCount; i2++) {
        if (nodeToDelete === null) {
          {
            formatDevErrorMessage(`splice: sibling not found`);
          }
        }
        const nextSibling = nodeToDelete.getNextSibling();
        const nodeKeyToDelete = nodeToDelete.__key;
        const writableNodeToDelete = nodeToDelete.getWritable();
        $removeFromParent(writableNodeToDelete);
        nodesToRemoveKeys.push(nodeKeyToDelete);
        nodeToDelete = nextSibling;
      }
    }
    let prevNode = nodeBeforeRange;
    for (const nodeToInsert of nodesToInsert) {
      if (prevNode !== null && nodeToInsert.is(prevNode)) {
        nodeBeforeRange = prevNode = prevNode.getPreviousSibling();
      }
      if (nodeAfterRange !== null && nodeToInsert.is(nodeAfterRange)) {
        nodeAfterRange = nodeAfterRange.getNextSibling();
      }
      const writableNodeToInsert = nodeToInsert.getWritable();
      if (writableNodeToInsert.__parent === writableSelfKey) {
        newSize--;
      }
      $removeFromParent(writableNodeToInsert);
      const nodeKeyToInsert = nodeToInsert.__key;
      if (prevNode === null) {
        writableSelf.__first = nodeKeyToInsert;
        writableNodeToInsert.__prev = null;
      } else {
        const writablePrevNode = prevNode.getWritable();
        writablePrevNode.__next = nodeKeyToInsert;
        writableNodeToInsert.__prev = writablePrevNode.__key;
      }
      if (nodeToInsert.__key === writableSelfKey) {
        {
          formatDevErrorMessage(`append: attempting to append self`);
        }
      }
      writableNodeToInsert.__parent = writableSelfKey;
      nodesToInsertKeys.push(nodeKeyToInsert);
      prevNode = nodeToInsert;
    }
    if (nodeAfterRange === null) {
      if (prevNode !== null) {
        const writablePrevNode = prevNode.getWritable();
        writablePrevNode.__next = null;
        writableSelf.__last = prevNode.__key;
      }
    } else {
      const writableNodeAfterRange = nodeAfterRange.getWritable();
      if (prevNode !== null) {
        const writablePrevNode = prevNode.getWritable();
        writableNodeAfterRange.__prev = prevNode.__key;
        writablePrevNode.__next = nodeAfterRange.__key;
      } else {
        writableNodeAfterRange.__prev = null;
      }
    }
    writableSelf.__size = newSize;
    if (nodesToRemoveKeys.length) {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodesToRemoveKeySet = new Set(nodesToRemoveKeys);
        const nodesToInsertKeySet = new Set(nodesToInsertKeys);
        const {
          anchor,
          focus
        } = selection;
        if (isPointRemoved(anchor, nodesToRemoveKeySet, nodesToInsertKeySet)) {
          moveSelectionPointToSibling(anchor, anchor.getNode(), this, nodeBeforeRange, nodeAfterRange);
        }
        if (isPointRemoved(focus, nodesToRemoveKeySet, nodesToInsertKeySet)) {
          moveSelectionPointToSibling(focus, focus.getNode(), this, nodeBeforeRange, nodeAfterRange);
        }
        if (newSize === 0 && !this.canBeEmpty() && !$isRootOrShadowRoot(this)) {
          this.remove();
        }
      }
    }
    return writableSelf;
  }
  /**
   * @experimental
   *
   * An ElementNode subclass can override this to control where its children
   * are inserted into the DOM, e.g. to add a wrapping node or accessory nodes
   * before or after the children. The root of the node returned by createDOM
   * must still be exactly one HTMLElement.
   */
  getDOMSlot(element) {
    return new ElementDOMSlot(element);
  }
  exportDOM(editor) {
    const {
      element
    } = super.exportDOM(editor);
    if (isHTMLElement(element)) {
      const indent = this.getIndent();
      if (indent > 0) {
        element.style.paddingInlineStart = `${indent * 40}px`;
        element.setAttribute("data-lexical-indent", String(indent));
      }
      const direction = this.getDirection();
      if (direction) {
        element.dir = direction;
      }
    }
    return {
      element
    };
  }
  // JSON serialization
  exportJSON() {
    const json = {
      children: [],
      direction: this.getDirection(),
      format: this.getFormatType(),
      indent: this.getIndent(),
      // As an exception here we invoke super at the end for historical reasons.
      // Namely, to preserve the order of the properties and not to break the tests
      // that use the serialized string representation.
      ...super.exportJSON()
    };
    const textFormat = this.getTextFormat();
    const textStyle = this.getTextStyle();
    if ((textFormat !== 0 || textStyle !== "") && !$isRootOrShadowRoot(this) && !this.getChildren().some($isTextNode)) {
      if (textFormat !== 0) {
        json.textFormat = textFormat;
      }
      if (textStyle !== "") {
        json.textStyle = textStyle;
      }
    }
    return json;
  }
  updateFromJSON(serializedNode) {
    return super.updateFromJSON(serializedNode).setFormat(serializedNode.format).setIndent(serializedNode.indent).setDirection(serializedNode.direction).setTextFormat(serializedNode.textFormat || 0).setTextStyle(serializedNode.textStyle || "");
  }
  // These are intended to be extends for specific element heuristics.
  insertNewAfter(selection, restoreSelection) {
    return null;
  }
  canIndent() {
    return true;
  }
  /*
   * This method controls the behavior of the node during backwards
   * deletion (i.e., backspace) when selection is at the beginning of
   * the node (offset 0). You may use this to have the node replace
   * itself, change its state, or do nothing. When you do make such
   * a change, you should return true.
   *
   * When true is returned, the collapse phase will stop.
   * When false is returned, and isInline() is true, and getPreviousSibling() is null,
   * then this function will be called on its parent.
   */
  collapseAtStart(selection) {
    return false;
  }
  excludeFromCopy(destination) {
    return false;
  }
  /** @deprecated @internal */
  canReplaceWith(replacement) {
    return true;
  }
  /** @deprecated @internal */
  canInsertAfter(node) {
    return true;
  }
  canBeEmpty() {
    return true;
  }
  canInsertTextBefore() {
    return true;
  }
  canInsertTextAfter() {
    return true;
  }
  /**
   * If the method is overridden and returns true, ensure that `canBeEmpty()`
   * returns false for the inline node to work correctly
   */
  isInline() {
    return false;
  }
  // A shadow root is a Node that behaves like RootNode. The shadow root (and RootNode) mark the
  // end of the hierarchy, most implementations should treat it as there's nothing (upwards)
  // beyond this point. For example, node.getTopLevelElement(), when performed inside a TableCellNode
  // will return the immediate first child underneath TableCellNode instead of RootNode.
  isShadowRoot() {
    return false;
  }
  /** @deprecated @internal */
  canMergeWith(node) {
    return false;
  }
  extractWithChild(child, selection, destination) {
    return false;
  }
  /**
   * Determines whether this node, when empty, can merge with a first block
   * of nodes being inserted.
   *
   * This method is specifically called in {@link RangeSelection.insertNodes}
   * to determine merging behavior during nodes insertion.
   *
   * @example
   * // In a ListItemNode or QuoteNode implementation:
   * canMergeWhenEmpty(): true {
   *  return true;
   * }
   */
  canMergeWhenEmpty() {
    return false;
  }
  /** @internal */
  reconcileObservedMutation(dom, editor) {
    const slot = $getDOMSlot(this, dom, editor);
    let currentDOM = slot.getFirstChild();
    for (let currentNode = this.getFirstChild(); currentNode; currentNode = currentNode.getNextSibling()) {
      const correctDOM = editor.getElementByKey(currentNode.getKey());
      if (correctDOM === null) {
        continue;
      }
      if (currentDOM == null) {
        slot.insertChild(correctDOM);
        currentDOM = correctDOM;
      } else if (currentDOM !== correctDOM) {
        slot.replaceChild(correctDOM, currentDOM);
      }
      currentDOM = currentDOM.nextSibling;
    }
  }
};
function $isElementNode(node) {
  return node instanceof ElementNode;
}
function isPointRemoved(point, nodesToRemoveKeySet, nodesToInsertKeySet) {
  let node = point.getNode();
  while (node) {
    const nodeKey = node.__key;
    if (nodesToRemoveKeySet.has(nodeKey) && !nodesToInsertKeySet.has(nodeKey)) {
      return true;
    }
    node = node.getParent();
  }
  return false;
}
var DecoratorNode = class extends LexicalNode {
  /** @internal */
  /** @internal */
  __slotHost;
  /** @internal */
  __slots;
  constructor(key) {
    super(key);
    this.__slotHost = null;
    this.__slots = null;
  }
  afterCloneFrom(prevNode) {
    super.afterCloneFrom(prevNode);
    if (this.__key === prevNode.__key) {
      this.__slotHost = prevNode.__slotHost;
      if (!(this.__slotHost === null || this.__parent === null)) {
        formatDevErrorMessage(`DecoratorNode: node ${this.__key} is both slotted into host ${String(this.__slotHost)} and a child of parent ${String(this.__parent)}; __slotHost and __parent are mutually exclusive`);
      }
      this.__slots = prevNode.__slots;
    }
  }
  /**
   * The returned value is added to the LexicalEditor._decorators
   */
  decorate(editor, config) {
    return null;
  }
  /**
   * Whether this decorator is isolated from caret interaction: an isolated
   * decorator can not be traversed, extended over, selected as a node, or
   * deleted by an adjacent caret operation. A caret that reaches one stops
   * there, so an inline isolated decorator is only reachable by pointer.
   *
   * Defaults to false, which lets the caret step over the decorator (and
   * select it, when {@link DecoratorNode.isKeyboardSelectable} is also true).
   */
  isIsolated() {
    return false;
  }
  isInline() {
    return true;
  }
  isKeyboardSelectable() {
    return true;
  }
};
function $isDecoratorNode(node) {
  return node instanceof DecoratorNode;
}
var RootNode = class extends ElementNode {
  /** @internal */
  __cachedText;
  $config() {
    return this.config("root", {
      extends: ElementNode
    });
  }
  constructor() {
    super("root");
    this.__cachedText = null;
  }
  getTopLevelElementOrThrow() {
    {
      formatDevErrorMessage(`getTopLevelElementOrThrow: root nodes are not top level elements`);
    }
  }
  getTextContent() {
    const cachedText = this.__cachedText;
    return cachedText !== null && (isCurrentlyReadOnlyMode() || getActiveEditor()._dirtyType === NO_DIRTY_NODES) ? cachedText : super.getTextContent();
  }
  remove() {
    {
      formatDevErrorMessage(`remove: cannot be called on root nodes`);
    }
  }
  replace(node) {
    {
      formatDevErrorMessage(`replace: cannot be called on root nodes`);
    }
  }
  insertBefore(nodeToInsert) {
    {
      formatDevErrorMessage(`insertBefore: cannot be called on root nodes`);
    }
  }
  insertAfter(nodeToInsert) {
    {
      formatDevErrorMessage(`insertAfter: cannot be called on root nodes`);
    }
  }
  // View
  updateDOM(prevNode, dom) {
    return false;
  }
  // Mutate
  splice(start, deleteCount, nodesToInsert) {
    for (const node of nodesToInsert) {
      if (!($isElementNode(node) || $isDecoratorNode(node))) {
        formatDevErrorMessage(`rootNode.splice: Only element or decorator nodes can be inserted to the root node`);
      }
    }
    return super.splice(start, deleteCount, nodesToInsert);
  }
  static importJSON(serializedNode) {
    return $getRoot().updateFromJSON(serializedNode);
  }
  collapseAtStart() {
    return true;
  }
};
function $createRootNode() {
  return new RootNode();
}
function $isRootNode(node) {
  return node instanceof RootNode;
}
function editorStateHasDirtySelection(editorState, editor) {
  const currentSelection = editor.getEditorState()._selection;
  const pendingSelection = editorState._selection;
  if (pendingSelection !== null) {
    if (pendingSelection.dirty || !pendingSelection.is(currentSelection)) {
      return true;
    }
  } else if (currentSelection !== null) {
    return true;
  }
  return false;
}
function cloneEditorState(current) {
  return new EditorState(cloneMap(current._nodeMap), null, current._slotsUsed);
}
function createEmptyEditorState() {
  return new EditorState(/* @__PURE__ */ new Map([["root", $createRootNode()]]), null, false);
}
function $exportNodeToJSON(node) {
  const serializedNode = node.exportJSON();
  const nodeClass = node.constructor;
  if (serializedNode.type !== nodeClass.getType()) {
    {
      formatDevErrorMessage(`LexicalNode: Node ${nodeClass.name} does not match the serialized type. Check if .exportJSON() is implemented and it is returning the correct type.`);
    }
  }
  if ($isElementNode(node)) {
    const serializedChildren = serializedNode.children;
    if (!Array.isArray(serializedChildren)) {
      {
        formatDevErrorMessage(`LexicalNode: Node ${nodeClass.name} is an element but .exportJSON() does not have a children array.`);
      }
    }
    const children = node.getChildren();
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      const serializedChildNode = $exportNodeToJSON(child);
      serializedChildren.push(serializedChildNode);
    }
  }
  const slotNames = $getSlotNames(node);
  if (slotNames.length > 0) {
    const serializedSlots = {};
    for (const name of slotNames) {
      const slotNode = $getSlot(node, name);
      if (!(slotNode !== null)) {
        formatDevErrorMessage(`LexicalNode: Node ${nodeClass.name} has slot "${name}" but it resolved to no node during export.`);
      }
      serializedSlots[name] = $exportNodeToJSON(slotNode);
    }
    serializedNode.$slots = serializedSlots;
  }
  return serializedNode;
}
function $isEditorState(x2) {
  return x2 instanceof EditorState;
}
var EditorState = class _EditorState {
  _nodeMap;
  _selection;
  _flushSync;
  _readOnly;
  /**
   * True if this EditorState was parsed without running transforms
   */
  _parsed;
  /**
   * True if this EditorState or the LexicalEditor that created it has
   * ever used slots
   */
  _slotsUsed;
  constructor(nodeMap, selection = null, slotsUsed = false) {
    this._nodeMap = nodeMap;
    this._selection = selection || null;
    this._flushSync = false;
    this._readOnly = false;
    this._parsed = false;
    this._slotsUsed = slotsUsed;
  }
  isEmpty() {
    return this._nodeMap.size <= 1 && this._selection === null;
  }
  read(callbackFn, options) {
    return readEditorState(options && options.editor || null, this, callbackFn);
  }
  clone(selection) {
    const editorState = new _EditorState(this._nodeMap, selection === void 0 ? this._selection : selection, this._slotsUsed);
    editorState._readOnly = true;
    editorState._parsed = this._parsed;
    return editorState;
  }
  toJSON() {
    return readEditorState(null, this, () => ({
      root: $exportNodeToJSON($getRoot())
    }));
  }
};
var ArtificialNode__DO_NOT_USE = class extends ElementNode {
  $config() {
    return this.config("artificial", {
      extends: ElementNode
    });
  }
  createDOM(config) {
    const dom = $getDocument().createElement("div");
    return dom;
  }
};
var LineBreakNode = class extends LexicalNode {
  /** @internal */
  $config() {
    return this.config("linebreak", {
      importDOM: {
        br: (node) => {
          if (isOnlyChildInBlockNode(node) || isLastChildInBlockNode(node)) {
            return null;
          }
          return {
            conversion: $convertLineBreakElement,
            priority: 0
          };
        }
      }
    });
  }
  getTextContent() {
    return "\n";
  }
  createDOM() {
    return $getDocument().createElement("br");
  }
  updateDOM() {
    return false;
  }
  isInline() {
    return true;
  }
};
function $convertLineBreakElement(node) {
  return {
    node: $createLineBreakNode()
  };
}
function $createLineBreakNode() {
  return $applyNodeReplacement(new LineBreakNode());
}
function $isLineBreakNode(node) {
  return node instanceof LineBreakNode;
}
function isOnlyChildInBlockNode(node) {
  const parentElement = node.parentElement;
  if (parentElement !== null && isBlockDomNode(parentElement)) {
    const firstChild = parentElement.firstChild;
    if (firstChild === node || firstChild.nextSibling === node && isWhitespaceDomTextNode(firstChild)) {
      const lastChild = parentElement.lastChild;
      if (lastChild === node || lastChild.previousSibling === node && isWhitespaceDomTextNode(lastChild)) {
        return true;
      }
    }
  }
  return false;
}
function isLastChildInBlockNode(node) {
  const parentElement = node.parentElement;
  if (parentElement !== null && isBlockDomNode(parentElement)) {
    const firstChild = parentElement.firstChild;
    if (firstChild === node || firstChild.nextSibling === node && isWhitespaceDomTextNode(firstChild)) {
      return false;
    }
    const lastChild = parentElement.lastChild;
    if (lastChild === node || lastChild.previousSibling === node && isWhitespaceDomTextNode(lastChild)) {
      return true;
    }
  }
  return false;
}
function isWhitespaceDomTextNode(node) {
  return isDOMTextNode(node) && /^( |\t|\r?\n)+$/.test(node.textContent || "");
}
function $caretFromPoint(point, direction) {
  const {
    type,
    key,
    offset
  } = point;
  const node = $getNodeByKeyOrThrow(point.key);
  if (type === "text") {
    if (!$isTextNode(node)) {
      formatDevErrorMessage(`$caretFromPoint: Node with type ${node.getType()} and key ${key} that does not inherit from TextNode encountered for text point`);
    }
    return $getTextPointCaret(node, direction, offset);
  }
  if (!$isElementNode(node)) {
    formatDevErrorMessage(`$caretFromPoint: Node with type ${node.getType()} and key ${key} that does not inherit from ElementNode encountered for element point`);
  }
  return $getChildCaretAtIndex(node, point.offset, direction);
}
function $setPointFromCaret(point, caret) {
  const {
    origin,
    direction
  } = caret;
  const isNext = direction === "next";
  if ($isTextPointCaret(caret)) {
    point.set(origin.getKey(), caret.offset, "text");
  } else if ($isSiblingCaret(caret)) {
    if ($isTextNode(origin)) {
      point.set(origin.getKey(), $getTextNodeOffset(origin, direction), "text");
    } else {
      point.set(origin.getParentOrThrow().getKey(), origin.getIndexWithinParent() + (isNext ? 1 : 0), "element");
    }
  } else {
    if (!($isChildCaret(caret) && $isElementNode(origin))) {
      formatDevErrorMessage(`$setPointFromCaret: exhaustiveness check`);
    }
    point.set(origin.getKey(), isNext ? 0 : origin.getChildrenSize(), "element");
  }
}
function $setSelectionFromCaretRange(caretRange) {
  const currentSelection = $getSelection();
  const selection = $isRangeSelection(currentSelection) ? currentSelection : $createRangeSelection();
  $updateRangeSelectionFromCaretRange(selection, caretRange);
  $setSelection(selection);
  return selection;
}
function $updateRangeSelectionFromCaretRange(selection, caretRange) {
  $setPointFromCaret(selection.anchor, caretRange.anchor);
  $setPointFromCaret(selection.focus, caretRange.focus);
}
function $caretRangeFromSelection(selection) {
  const {
    anchor,
    focus
  } = selection;
  const anchorCaret = $caretFromPoint(anchor, "next");
  const focusCaret = $caretFromPoint(focus, "next");
  const direction = $comparePointCaretNext(anchorCaret, focusCaret) <= 0 ? "next" : "previous";
  return $getCaretRange($getCaretInDirection(anchorCaret, direction), $getCaretInDirection(focusCaret, direction));
}
function $rewindSiblingCaret(caret) {
  const {
    direction,
    origin
  } = caret;
  const rewindOrigin = $getSiblingCaret(origin, flipDirection(direction)).getNodeAtCaret();
  return rewindOrigin ? $getSiblingCaret(rewindOrigin, direction) : $getChildCaret(origin.getParentOrThrow(), direction);
}
function $getAnchorCandidates(anchor, rootMode = "root") {
  const carets = [anchor];
  for (let parent = $isChildCaret(anchor) ? anchor.getParentCaret(rootMode) : anchor.getSiblingCaret(); parent !== null; parent = parent.getParentCaret(rootMode)) {
    carets.push($rewindSiblingCaret(parent));
  }
  return carets;
}
function $isCaretAttached(caret) {
  return !!caret && caret.origin.isAttached();
}
function $removeTextFromCaretRange(initialRange, sliceMode = "removeEmptySlices") {
  if (initialRange.isCollapsed()) {
    return initialRange;
  }
  const rootMode = "root";
  const nextDirection = "next";
  let sliceState = sliceMode;
  const range = $getCaretRangeInDirection(initialRange, nextDirection);
  let rangeContainer = range.anchor.origin;
  while (rangeContainer !== null && !$isRootOrShadowRoot(rangeContainer)) {
    rangeContainer = rangeContainer.getParent();
  }
  const rangeContainerChild = $isElementNode(rangeContainer) ? rangeContainer.getFirstChild() : null;
  const anchorCandidates = $getAnchorCandidates(range.anchor, rootMode);
  const focusCandidates = $getAnchorCandidates(range.focus.getFlipped(), rootMode);
  const seenStart = /* @__PURE__ */ new Set();
  const removedNodes = [];
  for (const caret of range.iterNodeCarets(rootMode)) {
    if ($isChildCaret(caret)) {
      seenStart.add(caret.origin.getKey());
    } else if ($isSiblingCaret(caret)) {
      const {
        origin
      } = caret;
      if (!$isElementNode(origin) || seenStart.has(origin.getKey())) {
        removedNodes.push(origin);
      }
    }
  }
  const removedParents = /* @__PURE__ */ new Set();
  for (const node of removedNodes) {
    const parent = node.getParent();
    if (parent !== null && !seenStart.has(parent.getKey())) {
      removedParents.add(parent);
    }
    $removeFromParent(node);
  }
  for (const parent of removedParents) {
    if (!parent.canBeEmpty() && !$isRootOrShadowRoot(parent) && parent.isEmpty() && parent.isAttached()) {
      parent.remove();
    }
  }
  for (const slice of range.getTextSlices()) {
    if (!slice) {
      continue;
    }
    const {
      origin
    } = slice.caret;
    const contentSize = origin.getTextContentSize();
    const caretBefore = $rewindSiblingCaret($getSiblingCaret(origin, nextDirection));
    const mode = origin.getMode();
    if (Math.abs(slice.distance) === contentSize && sliceState === "removeEmptySlices" || mode === "token" && slice.distance !== 0) {
      caretBefore.remove();
    } else if (slice.distance !== 0) {
      sliceState = "removeEmptySlices";
      let nextCaret = slice.removeTextSlice();
      const sliceOrigin = slice.caret.origin;
      if (mode === "segmented") {
        const src = nextCaret.origin;
        const plainTextNode = $createTextNode(src.getTextContent()).setStyle(src.getStyle()).setFormat(src.getFormat());
        caretBefore.replaceOrInsert(plainTextNode);
        nextCaret = $getTextPointCaret(plainTextNode, nextDirection, nextCaret.offset);
      }
      if (sliceOrigin.is(anchorCandidates[0].origin)) {
        anchorCandidates[0] = nextCaret;
      }
      if (sliceOrigin.is(focusCandidates[0].origin)) {
        focusCandidates[0] = nextCaret.getFlipped();
      }
    }
  }
  let anchorCandidate;
  let focusCandidate;
  for (const candidate of anchorCandidates) {
    if ($isCaretAttached(candidate)) {
      anchorCandidate = $normalizeCaret(candidate);
      break;
    }
  }
  for (const candidate of focusCandidates) {
    if ($isCaretAttached(candidate)) {
      focusCandidate = $normalizeCaret(candidate);
      break;
    }
  }
  const mergeTargets = $getBlockMergeTargets(anchorCandidate, focusCandidate, seenStart);
  if (mergeTargets) {
    const [anchorBlock, focusBlock] = mergeTargets;
    $getChildCaret(anchorBlock, "previous").splice(0, focusBlock.getChildren());
    let parent = focusBlock.getParent();
    focusBlock.remove(true);
    while (parent && parent.isEmpty()) {
      const element = parent;
      parent = parent.getParent();
      element.remove(true);
    }
  } else if (focusCandidate) {
    const focusBlock = $getBlockFromCaret(focusCandidate);
    const focusBlockParent = focusBlock && focusBlock.getParent();
    const topmostShadowRoot = focusBlock && focusBlock.getParents().findLast($isShadowRootNode);
    if (focusBlock && focusBlockParent && !$isRootNode(focusBlockParent) && focusBlock.isEmpty() && seenStart.has(focusBlock.getKey()) && $getSlotNames(focusBlock).length === 0 && (!topmostShadowRoot || seenStart.has(topmostShadowRoot.getKey()))) {
      focusBlock.remove(true);
      let parent = focusBlockParent;
      while (parent && !$isRootNode(parent) && parent.isEmpty()) {
        const grandparent = parent.getParent();
        if (grandparent && $isRootNode(grandparent) && grandparent.getChildrenSize() <= 1) {
          break;
        }
        const element = parent;
        parent = grandparent;
        element.remove(true);
      }
    }
  }
  if ($restoreEmptyContainerParagraph(rangeContainer, rangeContainerChild) === null) {
    $restoreEmptyContainerParagraph($getRoot(), null);
  }
  const bestCandidate = [anchorCandidate, focusCandidate, ...anchorCandidates, ...focusCandidates].find($isCaretAttached);
  if (bestCandidate) {
    const anchor = $getCaretInDirection($normalizeCaret(bestCandidate), initialRange.direction);
    return $getCollapsedCaretRange(anchor);
  }
  {
    formatDevErrorMessage(`$removeTextFromCaretRange: selection was lost, could not find a new anchor given candidates with keys: ${JSON.stringify(anchorCandidates.map((n2) => n2.origin.__key))}`);
  }
}
function $getBlockFromCaret(caret) {
  if ($isChildCaret(caret)) {
    const origin = caret.origin;
    if (INTERNAL_$isBlock(origin)) {
      return origin;
    }
  } else {
    const parent = caret.getParentAtCaret();
    if (parent && INTERNAL_$isBlock(parent)) {
      return parent;
    }
  }
  return null;
}
function $getBlockMergeTargets(anchor, focus, seenStart) {
  if (!anchor || !focus) {
    return null;
  }
  const anchorParent = anchor.getParentAtCaret();
  const focusParent = focus.getParentAtCaret();
  if (!anchorParent || !focusParent) {
    return null;
  }
  const anchorElements = anchorParent.getParents().reverse();
  anchorElements.push(anchorParent);
  const focusElements = focusParent.getParents().reverse();
  focusElements.push(focusParent);
  const maxLen = Math.min(anchorElements.length, focusElements.length);
  let commonAncestorCount;
  for (commonAncestorCount = 0; commonAncestorCount < maxLen && anchorElements[commonAncestorCount] === focusElements[commonAncestorCount]; commonAncestorCount++) {
  }
  const $getBlock = (arr, predicate) => {
    let block;
    for (let i2 = commonAncestorCount; i2 < arr.length; i2++) {
      const ancestor = arr[i2];
      if ($isRootOrShadowRoot(ancestor)) {
        return;
      } else if (!block && predicate(ancestor)) {
        block = ancestor;
      }
    }
    return block;
  };
  const anchorBlock = $getBlock(anchorElements, INTERNAL_$isBlock);
  const focusBlock = anchorBlock && $getBlock(focusElements, (node) => seenStart.has(node.getKey()) && INTERNAL_$isBlock(node));
  if (focusBlock && $getSlotNames(focusBlock).length > 0) {
    return null;
  }
  return anchorBlock && focusBlock ? [anchorBlock, focusBlock] : null;
}
function $getDeepestChildOrSelf(initialCaret) {
  let caret = initialCaret;
  while ($isChildCaret(caret)) {
    const adjacent = $getAdjacentChildCaret(caret);
    if (!$isChildCaret(adjacent)) {
      break;
    }
    caret = adjacent;
  }
  return caret;
}
function $normalizeCaret(initialCaret) {
  const caret = $getDeepestChildOrSelf(initialCaret.getLatest());
  const {
    direction
  } = caret;
  if ($isTextNode(caret.origin)) {
    return $isTextPointCaret(caret) ? caret : $getTextPointCaret(caret.origin, direction, direction);
  }
  const adj = caret.getAdjacentCaret();
  return $isSiblingCaret(adj) && $isTextNode(adj.origin) ? $getTextPointCaret(adj.origin, direction, flipDirection(direction)) : caret;
}
function $isExtendableTextPointCaret(caret) {
  return $isTextPointCaret(caret) && caret.offset !== $getTextNodeOffset(caret.origin, caret.direction);
}
function $getCaretRangeInDirection(range, direction) {
  if (range.direction === direction) {
    return range;
  }
  return $getCaretRange(
    // focus and anchor get flipped here
    $getCaretInDirection(range.focus, direction),
    $getCaretInDirection(range.anchor, direction)
  );
}
function $getChildCaretAtIndex(parent, index, direction) {
  let caret = $getChildCaret(parent, "next");
  for (let i2 = 0; i2 < index; i2++) {
    const nextCaret = caret.getAdjacentCaret();
    if (nextCaret === null) {
      break;
    }
    caret = nextCaret;
  }
  return $getCaretInDirection(caret, direction);
}
function $getAdjacentSiblingOrParentSiblingCaret(startCaret, rootMode = "root") {
  let depthDiff = 0;
  let caret = startCaret;
  let nextCaret = $getAdjacentChildCaret(caret);
  while (nextCaret === null) {
    depthDiff--;
    nextCaret = caret.getParentCaret(rootMode);
    if (!nextCaret) {
      return null;
    }
    caret = nextCaret;
    nextCaret = $getAdjacentChildCaret(caret);
  }
  return nextCaret && [nextCaret, depthDiff];
}
function $getAdjacentNodes(initialCaret) {
  const siblings = [];
  for (let caret = initialCaret.getAdjacentCaret(); caret; caret = caret.getAdjacentCaret()) {
    siblings.push(caret.origin);
  }
  return siblings;
}
function $splitTextPointCaret(textPointCaret) {
  const {
    origin,
    offset,
    direction
  } = textPointCaret;
  if (offset === $getTextNodeOffset(origin, direction)) {
    return textPointCaret.getSiblingCaret();
  } else if (offset === $getTextNodeOffset(origin, flipDirection(direction))) {
    return $rewindSiblingCaret(textPointCaret.getSiblingCaret());
  }
  const [textNode] = origin.splitText(offset);
  if (!$isTextNode(textNode)) {
    formatDevErrorMessage(`$splitTextPointCaret: splitText must return at least one TextNode`);
  }
  return $getCaretInDirection($getSiblingCaret(textNode, "next"), direction);
}
function $alwaysSplit(_node, _edge) {
  return true;
}
function $splitAtPointCaretNext(pointCaret, {
  $copyElementNode = $copyNode,
  $splitTextPointCaretNext = $splitTextPointCaret,
  rootMode = "shadowRoot",
  $shouldSplit = $alwaysSplit,
  removeEmptyDestination = false
} = {}) {
  if ($isTextPointCaret(pointCaret)) {
    return $splitTextPointCaretNext(pointCaret);
  }
  const parentCaret = pointCaret.getParentCaret(rootMode);
  if (parentCaret) {
    const {
      origin
    } = parentCaret;
    if ($isChildCaret(pointCaret)) {
      const beforeParentCaret = $rewindSiblingCaret(parentCaret);
      if (removeEmptyDestination && origin.isEmpty()) {
        origin.remove();
        return beforeParentCaret;
      }
      if (!(origin.canBeEmpty() && $shouldSplit(origin, "first"))) {
        return beforeParentCaret;
      }
    }
    const siblings = $getAdjacentNodes(pointCaret);
    if (siblings.length > 0 || !removeEmptyDestination && origin.canBeEmpty() && $shouldSplit(origin, "last")) {
      parentCaret.insert($copyElementNode(origin).splice(0, 0, siblings));
    }
  }
  return parentCaret;
}
function $insertNodeToNearestRootAtCaret(node, caret, options) {
  let insertCaret = $getCaretInDirection(caret, "next");
  if ($isTextPointCaret(insertCaret)) {
    if (insertCaret.offset === 0) {
      insertCaret = $getSiblingCaret(insertCaret.origin, "previous").getFlipped();
    } else if (insertCaret.offset === insertCaret.origin.getTextContentSize()) {
      insertCaret = $getSiblingCaret(insertCaret.origin, "next");
    }
  }
  if (insertCaret.origin.is(node)) {
    if (!$isSiblingCaret(insertCaret)) {
      formatDevErrorMessage(`$insertNodeToNearestRootAtCaret node ${node.getKey()} of type ${node.getType()} can not be inserted into itself`);
    }
    insertCaret = $rewindSiblingCaret(insertCaret);
  }
  if (node.is(insertCaret.getNodeAtCaret()) || node.is(insertCaret.getFlipped().getNodeAtCaret())) {
    node.remove(true);
  }
  for (let nextCaret = insertCaret; nextCaret; nextCaret = $splitAtPointCaretNext(nextCaret, options)) {
    insertCaret = nextCaret;
  }
  if (!!$isTextPointCaret(insertCaret)) {
    formatDevErrorMessage(`$insertNodeToNearestRootAtCaret: An unattached TextNode can not be split`);
  }
  insertCaret.insert(node.isInline() ? $createParagraphNode().append(node) : node);
  return $getCaretInDirection($getSiblingCaret(node.getLatest(), "next"), caret.direction);
}
function $isBlockFullySelected(blockNode, selectionOrRange) {
  const range = $getCaretRangeInDirection($isRangeSelection(selectionOrRange) ? $caretRangeFromSelection(selectionOrRange) : selectionOrRange, "next");
  const anchorFrame = $getSlotFrame(range.anchor.origin);
  const blockFrame = $getSlotFrame(blockNode.getLatest());
  if (anchorFrame === null ? blockFrame !== null : !anchorFrame.is(blockFrame)) {
    return false;
  }
  const blockStart = $normalizeCaret($getChildCaret(blockNode, "next"));
  const blockEnd = $getCaretInDirection($normalizeCaret($getChildCaret(blockNode, "previous")), "next");
  return $comparePointCaretNext(range.anchor, blockStart) <= 0 && $comparePointCaretNext(range.focus, blockEnd) >= 0;
}
var ParagraphNode = class extends ElementNode {
  /** @internal */
  $config() {
    return this.config("paragraph", {
      extends: ElementNode,
      importDOM: {
        p: () => ({
          conversion: $convertParagraphElement,
          priority: 0
        })
      }
    });
  }
  // View
  createDOM(config) {
    const dom = $getDocument().createElement("p");
    const classNames = getCachedClassNameArray(config.theme, "paragraph");
    if (classNames !== void 0) {
      const domClassList = dom.classList;
      domClassList.add(...classNames);
    }
    return dom;
  }
  updateDOM(prevNode, dom, config) {
    return false;
  }
  exportDOM(editor) {
    const {
      element
    } = super.exportDOM(editor);
    if (isHTMLElement(element)) {
      if (this.isEmpty()) {
        element.append($getDocument().createElement("br"));
      }
      const formatType = this.getFormatType();
      if (formatType) {
        element.style.textAlign = formatType;
      }
    }
    return {
      element
    };
  }
  exportJSON() {
    const json = super.exportJSON();
    if (json.textFormat === void 0 || json.textStyle === void 0) {
      const firstTextNode = this.getChildren().find($isTextNode);
      if (firstTextNode) {
        json.textFormat = firstTextNode.getFormat();
        json.textStyle = firstTextNode.getStyle();
      } else {
        json.textFormat = this.getTextFormat();
        json.textStyle = this.getTextStyle();
      }
    }
    return json;
  }
  extractWithChild(child, selection, destination) {
    if (!$isRangeSelection(selection)) {
      return false;
    }
    if (this.getFormatType() === "" && this.getIndent() === 0 && this.getStyle() === "") {
      return false;
    }
    if ($isBlockFullySelected(this, selection)) {
      const textContent = this.getTextContent();
      return textContent !== "" && selection.getTextContent() === textContent;
    }
    return false;
  }
  // Mutation
  insertNewAfter(rangeSelection, restoreSelection) {
    const newElement = $createParagraphNode();
    newElement.setTextFormat(rangeSelection.format);
    newElement.setTextStyle(rangeSelection.style);
    const direction = this.getDirection();
    newElement.setDirection(direction);
    newElement.setFormat(this.getFormatType());
    newElement.setStyle(this.getStyle());
    this.insertAfter(newElement, restoreSelection);
    return newElement;
  }
  collapseAtStart() {
    if (this.getChildren().every((node) => $isTextNode(node) && !/\S/.test(node.getTextContent()))) {
      const nextSibling = this.getNextSibling();
      if (nextSibling !== null) {
        this.selectNext();
        this.remove();
        return true;
      }
      const prevSibling = this.getPreviousSibling();
      if (prevSibling !== null) {
        this.selectPrevious();
        this.remove();
        return true;
      }
    }
    return false;
  }
};
function $convertParagraphElement(element) {
  const node = $createParagraphNode();
  $setFormatFromDOM(node, element);
  setNodeIndentFromDOM(element, node);
  if (node.getFormatType() === "") {
    const align = element.getAttribute("align");
    if (align) {
      if (align && align in ELEMENT_TYPE_TO_FORMAT) {
        node.setFormat(align);
      }
    }
  }
  $setDirectionFromDOM(node, element);
  return {
    node
  };
}
function $createParagraphNode() {
  return $applyNodeReplacement(new ParagraphNode());
}
function $isParagraphNode(node) {
  return node instanceof ParagraphNode;
}
function createInputState() {
  return {
    collapsedSelectionFormat: {
      format: 0,
      key: "root",
      offset: 0,
      style: "",
      timeStamp: 0
    },
    compositionEndData: "",
    compositionPhase: "idle",
    hadOrphanedCompositionEvents: false,
    handledSelectionCommandTimeoutId: null,
    isInsertLineBreak: false,
    isInsertTextAfterHandledSelectionCommand: false,
    isSelectionChangeFromDOMUpdate: false,
    isSelectionChangeFromMouseDown: false,
    lastBeforeInputInsertTextTimeStamp: 0,
    lastKeyCode: null,
    lastKeyDownTimeStamp: 0,
    postDeleteSelectionToRestore: null,
    selectionChangeFromDOMUpdatePoints: null,
    unprocessedBeforeInputData: null
  };
}
function defaultOnWarn(error) {
  {
    throw error;
  }
}
var DEFAULT_SKIP_INITIALIZATION = false;
var COMMAND_PRIORITY_EDITOR = 0;
var COMMAND_PRIORITY_LOW = 1;
var COMMAND_PRIORITY_NORMAL = 2;
var COMMAND_PRIORITY_HIGH = 3;
var COMMAND_PRIORITY_CRITICAL = 4;
var COMMAND_PRIORITY_BEFORE_EDITOR = -8;
var COMMAND_PRIORITY_BEFORE_LOW = -7;
var COMMAND_PRIORITY_BEFORE_NORMAL = -6;
var COMMAND_PRIORITY_BEFORE_HIGH = -5;
var COMMAND_PRIORITY_BEFORE_CRITICAL = -4;
function normalizePriority(priority) {
  return priority & 7;
}
function resetEditor(editor, prevRootElement, nextRootElement, pendingEditorState, options) {
  const keyNodeMap = editor._keyToDOMMap;
  keyNodeMap.clear();
  editor._editorState = createEmptyEditorState();
  editor._pendingEditorState = pendingEditorState;
  editor._compositionKey = null;
  editor._dirtyType = NO_DIRTY_NODES;
  editor._cloneNotNeeded.clear();
  editor._dirtyLeaves = /* @__PURE__ */ new Set();
  editor._dirtyElements.clear();
  editor._normalizedNodes = /* @__PURE__ */ new Set();
  if (!options || !options.preserveUpdateQueue) {
    editor._updateTags = /* @__PURE__ */ new Set();
    editor._updates = [];
    editor._cascadeCount = 0;
  }
  editor._blockCursorElement = null;
  if (editor._inputState.handledSelectionCommandTimeoutId !== null) {
    clearTimeout(editor._inputState.handledSelectionCommandTimeoutId);
  }
  editor._inputState = createInputState();
  const observer = editor._observer;
  if (observer !== null) {
    observer.disconnect();
    editor._observer = null;
  }
  if (prevRootElement !== null) {
    prevRootElement.textContent = "";
    clearNodeKeyOnDOMNode(prevRootElement, editor);
  }
  if (nextRootElement !== null) {
    nextRootElement.textContent = "";
    keyNodeMap.set("root", nextRootElement);
    setNodeKeyOnDOMNode(nextRootElement, editor, "root");
  }
}
function initializeConversionCache(nodes, additionalConversions) {
  const conversionCache = /* @__PURE__ */ new Map();
  const handledConversions = /* @__PURE__ */ new Set();
  const addConversionsToCache = (map) => {
    Object.keys(map).forEach((key) => {
      let currentCache = conversionCache.get(key);
      if (currentCache === void 0) {
        currentCache = [];
        conversionCache.set(key, currentCache);
      }
      currentCache.push(map[key]);
    });
  };
  nodes.forEach((node) => {
    const importDOM = node.klass.importDOM;
    if (importDOM == null || handledConversions.has(importDOM)) {
      return;
    }
    handledConversions.add(importDOM);
    const map = importDOM.call(node.klass);
    if (map !== null) {
      addConversionsToCache(map);
    }
  });
  if (additionalConversions) {
    addConversionsToCache(additionalConversions);
  }
  return conversionCache;
}
function getTransformSetFromKlass(klass) {
  const transforms = /* @__PURE__ */ new Set();
  const staticTransforms = /* @__PURE__ */ new Set();
  for (const {
    klass: currentKlass,
    ownNodeConfig
  } of iterStaticNodeConfigChain(klass)) {
    const staticTransform = currentKlass.transform;
    if (!staticTransforms.has(staticTransform)) {
      staticTransforms.add(staticTransform);
      const transform = currentKlass.transform();
      if (transform) {
        transforms.add(transform);
      }
    }
    if (ownNodeConfig) {
      const $transform = ownNodeConfig.$transform;
      if ($transform) {
        transforms.add($transform);
      }
    }
  }
  return transforms;
}
var DEFAULT_EDITOR_DOM_CONFIG = {
  $createDOM: (node, editor) => node.createDOM(editor._config, editor),
  $decorateDOM: (_node, _prevNode, _dom, _editor) => {
  },
  $exportDOM: (node, editor) => {
    const registeredNode = getRegisteredNode(editor, node.getType());
    return registeredNode && registeredNode.exportDOM !== void 0 ? registeredNode.exportDOM(editor, node) : node.exportDOM(editor);
  },
  $extractWithChild: (node, childNode, selection, destination, _editor) => $isElementNode(node) && node.extractWithChild(childNode, selection, destination),
  $getDOMSlot: (node, dom, _editor) => node.getDOMSlot(dom),
  $getSlotTargetElement: (_node, _slotName, _hostDom, _editor) => null,
  $shouldExclude: (node, _selection, _editor) => $isElementNode(node) && node.excludeFromCopy("html"),
  $shouldInclude: (node, selection, _editor) => selection ? node.isSelected(selection) : true,
  $updateDOM: (nextNode, prevNode, dom, editor) => nextNode.updateDOM(prevNode, dom, editor._config)
};
function createEditor(editorConfig) {
  const config = editorConfig || {};
  const activeEditor2 = internalGetActiveEditor();
  const theme = config.theme || {};
  const parentEditor = editorConfig === void 0 ? activeEditor2 : config.parentEditor || null;
  const disableEvents = config.disableEvents || false;
  const editorState = createEmptyEditorState();
  const namespace = config.namespace || (parentEditor !== null ? parentEditor._config.namespace : createUID());
  const initialEditorState = config.editorState;
  const nodes = [RootNode, TextNode, LineBreakNode, TabNode, ParagraphNode, ArtificialNode__DO_NOT_USE, ...config.nodes || []];
  const {
    onError,
    onWarn,
    html
  } = config;
  const isEditable = config.editable !== void 0 ? config.editable : true;
  let registeredNodes;
  if (editorConfig === void 0 && activeEditor2 !== null) {
    registeredNodes = activeEditor2._nodes;
  } else {
    registeredNodes = /* @__PURE__ */ new Map();
    for (let i2 = 0; i2 < nodes.length; i2++) {
      let klass = nodes[i2];
      let replace = null;
      let replaceWithKlass = null;
      if (klass && typeof klass === "object") {
        const options = klass;
        klass = options.replace;
        replace = options.with;
        replaceWithKlass = options.withKlass || null;
      }
      if (typeof klass !== "function" || !klass.prototype || !(klass === LexicalNode || klass.prototype instanceof LexicalNode)) {
        let version = "<unknown>";
        try {
          version = JSON.parse(LEXICAL_VERSION);
        } catch (_unused) {
        }
        {
          formatDevErrorMessage(`createEditor: nodes[${String(i2 - nodes.length + (config.nodes ? config.nodes.length : 0))}] ${typeof klass === "function" ? `${klass.name}${typeof klass.getType === "function" ? ` (type ${String(klass.getType())})` : ""}` : String(klass)} is not a constructor that subclasses LexicalNode from the lexical package used by this editor (${String(version)})`);
        }
      }
      void getStaticNodeConfig(klass);
      {
        const name = klass.name;
        const nodeType = hasOwnStaticMethod(klass, "getType") && klass.getType();
        if (replaceWithKlass) {
          if (!(replaceWithKlass.prototype instanceof klass)) {
            formatDevErrorMessage(`${replaceWithKlass.name} doesn't extend the ${name}`);
          }
        } else if (replace) {
          console.warn(`Override for ${name} specifies 'replace' without 'withKlass'. 'withKlass' will be required in a future version.`);
        }
        if (name !== "RootNode" && nodeType !== "root" && nodeType !== "artificial" && // This is mostly for the unit test suite which
        // uses LexicalNode in an otherwise incorrect way
        // by mocking its static getType
        klass !== LexicalNode) {
          ["getType", "clone"].forEach((method) => {
            if (!hasOwnStaticMethod(klass, method)) {
              console.warn(`${name} must implement static "${method}" method`);
            }
          });
          if (!hasOwnStaticMethod(klass, "importJSON")) {
            console.warn(`${name} should implement "importJSON" method to ensure JSON and default HTML serialization works as expected`);
          }
        }
      }
      const type = klass.getType();
      const transforms = getTransformSetFromKlass(klass);
      registeredNodes.set(type, {
        exportDOM: html && html.export ? html.export.get(klass) : void 0,
        klass,
        replace,
        replaceWithKlass,
        sharedNodeState: createSharedNodeState(nodes[i2]),
        transforms
      });
    }
  }
  const editor = new LexicalEditor(editorState, parentEditor, registeredNodes, {
    disableEvents,
    dom: {
      ...DEFAULT_EDITOR_DOM_CONFIG,
      ...editorConfig && editorConfig.dom
    },
    namespace,
    theme
  }, onError ? onError : console.error, onWarn ? onWarn : defaultOnWarn, initializeConversionCache(registeredNodes, html ? html.import : void 0), isEditable, editorConfig);
  if (initialEditorState !== void 0) {
    editor._pendingEditorState = initialEditorState;
    editor._dirtyType = FULL_RECONCILE;
  }
  registerDefaultCommandHandlers(editor);
  return editor;
}
function triggerListener(listenerMap, listener, args) {
  const unregister = listenerMap.get(listener);
  if (unregister) {
    unregister();
  }
  listenerMap.set(listener, listener(...args) || void 0);
}
function unregisterListener(listenerMap, listener) {
  const unregister = listenerMap.get(listener);
  listenerMap.delete(listener);
  if (unregister) {
    unregister();
  }
}
function registerListener(listenerMap, listener, unregister) {
  listenerMap.set(listener, unregister);
  return unregisterListener.bind(null, listenerMap, listener);
}
var LexicalEditor = class {
  /** @internal */
  /** The version with build identifiers for this editor (since 0.17.1) */
  static version;
  /** @internal */
  _headless;
  /** @internal */
  _parentEditor;
  /** @internal */
  _rootElement;
  /** @internal */
  _editorState;
  /** @internal */
  _pendingEditorState;
  /** @internal */
  _compositionKey;
  /** @internal */
  _deferred;
  /** @internal */
  _keyToDOMMap;
  /** @internal */
  _updates;
  /** @internal */
  _updating;
  /** @internal */
  _cascadeCount;
  /** @internal */
  _listeners;
  /** @internal */
  _commands;
  /** @internal */
  _nodes;
  /** @internal */
  _decorators;
  /** @internal */
  _pendingDecorators;
  /** @internal */
  _config;
  /** @internal */
  _dirtyType;
  /** @internal */
  _cloneNotNeeded;
  /** @internal */
  _dirtyLeaves;
  /** @internal */
  _dirtyElements;
  /** @internal */
  _normalizedNodes;
  /** @internal */
  _updateTags;
  /** @internal */
  _observer;
  /** @internal */
  _key;
  /** @internal */
  _onError;
  /** @internal */
  _onWarn;
  /** @internal */
  _htmlConversions;
  /** @internal */
  _window;
  /** @internal */
  _editable;
  /** @internal */
  _blockCursorElement;
  /**
   * @internal @experimental
   *
   * Latches to `true` the first time {@link $setSlot} runs in this
   * editor. Gates the commit-time slot-containment clamp so editors that never
   * use slots skip the per-update frame walk entirely. The latch persists for
   * the lifetime of the editor instance — `resetEditor` and `setEditorState`
   * do not clear it, so an editor that once used slots keeps paying the clamp
   * cost even after switching to a slot-free state.
   */
  _slotsUsed;
  /** @internal */
  _keyDownShortcuts;
  /** @internal */
  _inputState;
  /** @internal */
  _createEditorArgs;
  /** @internal */
  constructor(editorState, parentEditor, nodes, config, onError, onWarn, htmlConversions, editable, createEditorArgs) {
    this._createEditorArgs = createEditorArgs;
    this._parentEditor = parentEditor;
    this._rootElement = null;
    this._editorState = editorState;
    this._pendingEditorState = null;
    this._compositionKey = null;
    this._deferred = [];
    this._keyToDOMMap = new GenMap();
    this._updates = [];
    this._updating = false;
    this._cascadeCount = 0;
    this._listeners = {
      decorator: /* @__PURE__ */ new Map(),
      editable: /* @__PURE__ */ new Map(),
      mutation: /* @__PURE__ */ new Map(),
      root: /* @__PURE__ */ new Map(),
      textcontent: /* @__PURE__ */ new Map(),
      update: /* @__PURE__ */ new Map()
    };
    this._commands = /* @__PURE__ */ new Map();
    this._config = config;
    this._nodes = nodes;
    this._decorators = {};
    this._pendingDecorators = null;
    this._dirtyType = NO_DIRTY_NODES;
    this._cloneNotNeeded = /* @__PURE__ */ new Set();
    this._dirtyLeaves = /* @__PURE__ */ new Set();
    this._dirtyElements = /* @__PURE__ */ new Map();
    this._normalizedNodes = /* @__PURE__ */ new Set();
    this._updateTags = /* @__PURE__ */ new Set();
    this._observer = null;
    this._key = createUID();
    this._onError = onError;
    this._onWarn = onWarn;
    this._htmlConversions = htmlConversions;
    this._editable = editable;
    this._headless = parentEditor !== null && parentEditor._headless;
    this._window = null;
    this._blockCursorElement = null;
    this._slotsUsed = false;
    this._keyDownShortcuts = null;
    this._inputState = createInputState();
  }
  /**
   *
   * @returns true if the editor is currently in "composition" mode due to receiving input
   * through an IME, or 3P extension, for example. Returns false otherwise.
   */
  isComposing() {
    return this._compositionKey != null;
  }
  /**
   * Registers a listener for Editor update event. Will trigger the provided callback
   * each time the editor goes through an update (via {@link LexicalEditor.update}) until the
   * teardown function is called.
   *
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerUpdateListener(listener) {
    return registerListener(this._listeners.update, listener);
  }
  /**
   * Registers a listener for when the editor changes between editable and non-editable states.
   * Will trigger the provided callback each time the editor transitions between these states until the
   * teardown function is called.
   *
   * If the listener returns a function, that function will be called before the next transition or
   * teardown.
   *
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerEditableListener(listener) {
    return registerListener(this._listeners.editable, listener);
  }
  /**
   * Registers a listener for when the editor's decorator object changes. The decorator object contains
   * all DecoratorNode keys -> their decorated value. This is primarily used with external UI frameworks.
   *
   * Will trigger the provided callback each time the editor transitions between these states until the
   * teardown function is called.
   *
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerDecoratorListener(listener) {
    return registerListener(this._listeners.decorator, listener);
  }
  /**
   * Registers a listener for when Lexical commits an update to the DOM and the text content of
   * the editor changes from the previous state of the editor. If the text content is the
   * same between updates, no notifications to the listeners will happen.
   *
   * Will trigger the provided callback each time the editor transitions between these states until the
   * teardown function is called.
   *
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerTextContentListener(listener) {
    return registerListener(this._listeners.textcontent, listener);
  }
  /**
   * Registers a listener for when the editor's root DOM element (the content editable
   * Lexical attaches to) changes. This is primarily used to attach event listeners to the root
   *  element. The root listener function is executed directly upon registration and then on
   * any subsequent update.
   *
   * Will trigger the provided callback each time the editor transitions between these states until the
   * teardown function is called.
   *
   * If the listener returns a function, that function will be called before the next transition or
   * teardown.
   *
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerRootListener(listener) {
    const listenerMap = this._listeners.root;
    return mergeRegister(registerListener(listenerMap, listener, listener(this._rootElement, null) || void 0), () => triggerListener(listenerMap, listener, [null, this._rootElement]));
  }
  /**
   * Registers a listener that will trigger anytime the provided command
   * is dispatched with {@link LexicalEditor.dispatch}, subject to priority.
   * Listeners that run at a higher priority can "intercept" commands and
   * prevent them from propagating to other handlers by returning true.
   *
   * Listeners are always invoked in an {@link LexicalEditor.update} and can
   * call dollar functions.
   *
   * Listeners registered at the same priority level will run
   * deterministically in the order of registration.
   *
   * @param command - the command that will trigger the callback.
   * @param listener - the function that will execute when the command is dispatched.
   * @param priority - the relative priority of the listener. 0 | 1 | 2 | 3 | 4
   *   (or {@link COMMAND_PRIORITY_EDITOR} |
   *     {@link COMMAND_PRIORITY_LOW} |
   *     {@link COMMAND_PRIORITY_NORMAL} |
   *     {@link COMMAND_PRIORITY_HIGH} |
   *     {@link COMMAND_PRIORITY_CRITICAL})
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerCommand(command, listener, priority) {
    if (priority === void 0) {
      {
        formatDevErrorMessage(`Listener for type "command" requires a "priority".`);
      }
    }
    const commandsMap = this._commands;
    if (!commandsMap.has(command)) {
      commandsMap.set(command, [new DequeSet(), new DequeSet(), new DequeSet(), new DequeSet(), new DequeSet()]);
    }
    const listenersInPriorityOrder = commandsMap.get(command);
    if (listenersInPriorityOrder === void 0) {
      {
        formatDevErrorMessage(`registerCommand: Command ${String(command)} not found in command map`);
      }
    }
    const normalizedPriority = normalizePriority(priority);
    const listeners = listenersInPriorityOrder[normalizedPriority];
    if (normalizedPriority !== priority) {
      listeners.addFront(listener);
    } else {
      listeners.addBack(listener);
    }
    return () => {
      listeners.delete(listener);
      if (listenersInPriorityOrder.every((listenersSet) => listenersSet.size === 0)) {
        commandsMap.delete(command);
      }
    };
  }
  /**
   * Registers a listener that will run when a Lexical node of the provided class is
   * mutated. The listener will receive a list of nodes along with the type of mutation
   * that was performed on each: created, destroyed, or updated.
   *
   * One common use case for this is to attach DOM event listeners to the underlying DOM nodes as Lexical nodes are created.
   * {@link LexicalEditor.getElementByKey} can be used for this.
   *
   * If any existing nodes are in the DOM, and skipInitialization is not true, the listener
   * will be called immediately with an updateTag of 'registerMutationListener' where all
   * nodes have the 'created' NodeMutation. This can be controlled with the skipInitialization option
   * (whose default was previously true for backwards compatibility with &lt;=0.16.1 but has been changed to false as of 0.21.0).
   *
   * @param klass - The class of the node that you want to listen to mutations on.
   * @param listener - The logic you want to run when the node is mutated.
   * @param options - see {@link MutationListenerOptions}
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerMutationListener(klass, listener, options) {
    const klassToMutate = this.resolveRegisteredNodeAfterReplacements(this.getRegisteredNode(klass)).klass;
    const mutations = this._listeners.mutation;
    let klassSet = mutations.get(listener);
    if (klassSet === void 0) {
      klassSet = /* @__PURE__ */ new Set();
      mutations.set(listener, klassSet);
    }
    klassSet.add(klassToMutate);
    const skipInitialization = options && options.skipInitialization;
    if (!(skipInitialization === void 0 ? DEFAULT_SKIP_INITIALIZATION : skipInitialization)) {
      this.initializeMutationListener(listener, klassToMutate);
    }
    return () => {
      klassSet.delete(klassToMutate);
      if (klassSet.size === 0) {
        mutations.delete(listener);
      }
    };
  }
  /** @internal */
  getRegisteredNode(klass) {
    const registeredNode = this._nodes.get(klass.getType());
    if (registeredNode === void 0) {
      {
        formatDevErrorMessage(`Node ${klass.name} has not been registered. Ensure node has been passed to createEditor.`);
      }
    }
    return registeredNode;
  }
  /** @internal */
  resolveRegisteredNodeAfterReplacements(registeredNode) {
    while (registeredNode.replaceWithKlass) {
      registeredNode = this.getRegisteredNode(registeredNode.replaceWithKlass);
    }
    return registeredNode;
  }
  /** @internal */
  initializeMutationListener(listener, klass) {
    const prevEditorState = this._editorState;
    const nodeMap = getCachedTypeToNodeMap(prevEditorState).get(klass.getType());
    if (!nodeMap) {
      return;
    }
    const nodeMutationMap = /* @__PURE__ */ new Map();
    for (const k of nodeMap.keys()) {
      nodeMutationMap.set(k, "created");
    }
    if (nodeMutationMap.size > 0) {
      listener(nodeMutationMap, {
        dirtyLeaves: /* @__PURE__ */ new Set(),
        prevEditorState,
        updateTags: /* @__PURE__ */ new Set(["registerMutationListener"])
      });
    }
  }
  /** @internal */
  registerNodeTransformToKlass(klass, listener) {
    const registeredNode = this.getRegisteredNode(klass);
    registeredNode.transforms.add(listener);
    return registeredNode;
  }
  /**
   * Registers a listener that will run when a Lexical node of the provided class is
   * marked dirty during an update. The listener will continue to run as long as the node
   * is marked dirty. There are no guarantees around the order of transform execution!
   *
   * Watch out for infinite loops. See [Node Transforms](https://lexical.dev/docs/concepts/transforms)
   * @param klass - The class of the node that you want to run transforms on.
   * @param listener - The logic you want to run when the node is updated.
   * @returns a teardown function that can be used to cleanup the listener.
   */
  registerNodeTransform(klass, listener) {
    const registeredNode = this.registerNodeTransformToKlass(klass, listener);
    const registeredNodes = [registeredNode];
    const replaceWithKlass = registeredNode.replaceWithKlass;
    if (replaceWithKlass != null) {
      const registeredReplaceWithNode = this.registerNodeTransformToKlass(replaceWithKlass, listener);
      registeredNodes.push(registeredReplaceWithNode);
    }
    markNodesWithTypesAsDirty(this, registeredNodes.map((node) => node.klass.getType()));
    return () => {
      registeredNodes.forEach((node) => node.transforms.delete(listener));
    };
  }
  /**
   * Used to assert that a certain node is registered, usually by plugins to ensure nodes that they
   * depend on have been registered.
   * @returns True if the editor has registered the provided node type, false otherwise.
   */
  hasNode(node) {
    return this._nodes.has(node.getType());
  }
  /**
   * Used to assert that certain nodes are registered, usually by plugins to ensure nodes that they
   * depend on have been registered.
   * @returns True if the editor has registered all of the provided node types, false otherwise.
   */
  hasNodes(nodes) {
    return nodes.every(this.hasNode.bind(this));
  }
  /**
   * Dispatches a command of the specified type with the specified payload.
   * This triggers all command listeners (set by {@link LexicalEditor.registerCommand})
   * for this type, passing them the provided payload. The command listeners
   * will be triggered in an implicit {@link LexicalEditor.update}, unless
   * this was invoked from inside an update in which case that update context
   * will be re-used (as if this was a dollar function itself).
   * @param type - the type of command listeners to trigger.
   * @param payload - the data to pass as an argument to the command listeners.
   */
  dispatchCommand(type, ...args) {
    return dispatchCommand(this, type, ...args);
  }
  /**
   * Gets a map of all decorators in the editor.
   * @returns A mapping of call decorator keys to their decorated content
   */
  getDecorators() {
    return this._decorators;
  }
  /**
   *
   * @returns the current root element of the editor. If you want to register
   * an event listener, do it via {@link LexicalEditor.registerRootListener}, since
   * this reference may not be stable.
   */
  getRootElement() {
    return this._rootElement;
  }
  /**
   * Gets the key of the editor
   * @returns The editor key
   */
  getKey() {
    return this._key;
  }
  /**
   * Imperatively set the root contenteditable element that Lexical listens
   * for events on.
   */
  setRootElement(nextRootElement) {
    const prevRootElement = this._rootElement;
    if (nextRootElement !== prevRootElement) {
      const classNames = getCachedClassNameArray(this._config.theme, "root");
      const pendingEditorState = this._pendingEditorState || this._editorState;
      this._rootElement = nextRootElement;
      resetEditor(this, prevRootElement, nextRootElement, pendingEditorState, {
        preserveUpdateQueue: true
      });
      if (prevRootElement !== null) {
        if (!this._config.disableEvents) {
          removeRootElementEvents(prevRootElement);
        }
        if (classNames != null) {
          prevRootElement.classList.remove(...classNames);
        }
      }
      if (nextRootElement !== null) {
        const windowObj = getDefaultView(nextRootElement);
        const style = nextRootElement.style;
        style.userSelect = "text";
        style.whiteSpace = "pre-wrap";
        style.wordBreak = "break-word";
        nextRootElement.setAttribute("data-lexical-editor", "true");
        this._window = windowObj;
        this._dirtyType = FULL_RECONCILE;
        initMutationObserver(this);
        this._updateTags.add(HISTORY_MERGE_TAG);
        $commitPendingUpdates(this);
        if (!this._config.disableEvents) {
          addRootElementEvents(nextRootElement, this);
        }
        if (classNames != null) {
          nextRootElement.classList.add(...classNames);
        }
        {
          const nextRootElementParent = getParentElement(nextRootElement);
          if (nextRootElementParent != null && ["flex", "inline-flex"].includes(getComputedStyle(nextRootElementParent).display)) {
            console.warn(`When using "display: flex" or "display: inline-flex" on an element containing content editable, Chrome may have unwanted focusing behavior when clicking outside of it. Consider wrapping the content editable within a non-flex element.`);
          }
        }
      } else {
        this._window = null;
        this._updateTags.add(HISTORY_MERGE_TAG);
        $commitPendingUpdates(this);
      }
      triggerListeners("root", this, false, nextRootElement, prevRootElement);
    }
  }
  /**
   * Gets the underlying HTMLElement associated with the LexicalNode for the given key.
   * @returns the HTMLElement rendered by the LexicalNode associated with the key.
   * @param key - the key of the LexicalNode.
   */
  getElementByKey(key) {
    return this._keyToDOMMap.get(key) || null;
  }
  /**
   * Gets the active editor state.
   * @returns The editor state
   */
  getEditorState() {
    return this._editorState;
  }
  /**
   * Imperatively set the EditorState. Triggers reconciliation like an update.
   * @param editorState - the state to set the editor
   * @param options - options for the update.
   */
  setEditorState(editorState, options) {
    if (editorState.isEmpty()) {
      {
        formatDevErrorMessage(`setEditorState: the editor state is empty. Ensure the editor state's root node never becomes empty.`);
      }
    }
    let writableEditorState = editorState;
    if (writableEditorState._readOnly) {
      writableEditorState = cloneEditorState(editorState);
      writableEditorState._selection = editorState._selection ? editorState._selection.clone() : null;
    }
    flushRootMutations(this);
    const pendingEditorState = this._pendingEditorState;
    const tag = options !== void 0 ? options.tag : null;
    if (pendingEditorState !== null && !pendingEditorState.isEmpty()) {
      if (tag != null) {
        this._updateTags.add(tag);
      }
      $commitPendingUpdates(this);
    }
    this._pendingEditorState = writableEditorState;
    this._dirtyType = FULL_RECONCILE;
    this._dirtyElements.set("root", false);
    this._compositionKey = null;
    this._slotsUsed = this._slotsUsed || editorState._slotsUsed;
    updateEditorSync(this, () => {
      if (tag) {
        this._updateTags.add(tag);
      }
      if (editorState._parsed) {
        for (const [key, node] of writableEditorState._nodeMap.entries()) {
          if ($isElementNode(node)) {
            this._dirtyElements.set(key, true);
          } else {
            this._dirtyLeaves.add(key);
          }
        }
      }
    }, {
      discrete: this._updating ? void 0 : true
    });
  }
  /**
   * Parses a SerializedEditorState (usually produced by {@link EditorState.toJSON}) and returns
   * and EditorState object that can be, for example, passed to {@link LexicalEditor.setEditorState}. Typically,
   * deserialization from JSON stored in a database uses this method.
   * @param maybeStringifiedEditorState
   * @param updateFn
   * @returns
   */
  parseEditorState(maybeStringifiedEditorState, updateFn) {
    const serializedEditorState = typeof maybeStringifiedEditorState === "string" ? JSON.parse(maybeStringifiedEditorState) : maybeStringifiedEditorState;
    return parseEditorState(serializedEditorState, this, updateFn);
  }
  /**
   * Executes a read of the editor's state, with the
   * editor context available (useful for exporting and read-only DOM
   * operations). Much like update, but prevents any mutation of the
   * editor's state.
   *
   * When called with a single argument the `mode` defaults to
   * `'force-commit'`, which flushes any pending updates immediately before the
   * read so it always observes a fully committed and reconciled state. See
   * {@link EditorReadMode} for the behavior of the other modes (`'pending'`
   * and `'latest'`).
   * @param callbackFn - A function that has access to read-only editor state.
   */
  /**
   * Executes a read of the editor's state in the given `mode`, with the editor
   * context available. See {@link EditorReadMode} for the available modes.
   * @param mode - Which editor state to read and whether to flush first.
   * @param callbackFn - A function that has access to read-only editor state.
   */
  read(...args) {
    const [mode, callbackFn] = args.length === 1 ? ["force-commit", args[0]] : args;
    if (mode === "force-commit") {
      $commitPendingUpdates(this);
    }
    const editorState = mode === "pending" ? this._pendingEditorState || this._editorState : this.getEditorState();
    return editorState.read(callbackFn, {
      editor: this
    });
  }
  /**
   * Executes an update to the editor state. The updateFn callback is the ONLY place
   * where Lexical editor state can be safely mutated.
   * @param updateFn - A function that has access to writable editor state.
   * @param options - A bag of options to control the behavior of the update.
   */
  update(updateFn, options) {
    updateEditor(this, updateFn, options);
  }
  /**
   * Focuses the editor by marking the existing selection as dirty, or by
   * creating a new selection at `defaultSelection` if one does not already
   * exist. If you want to force a specific selection, you should call
   * `root.selectStart()` or `root.selectEnd()` in an update.
   *
   * @param callbackFn - A function to run after the editor is focused.
   * @param options - A bag of options
   */
  focus(callbackFn, options = {}) {
    const rootElement = this._rootElement;
    if (rootElement !== null) {
      rootElement.setAttribute("autocapitalize", "off");
      updateEditorSync(this, () => {
        const selection = $getSelection();
        const root = $getRoot();
        if (selection !== null) {
          if (!selection.dirty) {
            $setSelection(selection.clone());
          }
        } else if (root.getChildrenSize() !== 0) {
          if (options.defaultSelection === "rootStart") {
            root.selectStart();
          } else {
            root.selectEnd();
          }
        }
        $addUpdateTag(FOCUS_TAG);
        $onUpdate(() => {
          rootElement.removeAttribute("autocapitalize");
          if (callbackFn) {
            callbackFn();
          }
        });
      });
      if (this._pendingEditorState === null) {
        rootElement.removeAttribute("autocapitalize");
      }
    }
  }
  /**
   * Removes focus from the editor.
   */
  blur() {
    const rootElement = this._rootElement;
    if (rootElement !== null) {
      rootElement.blur();
    }
    const domSelection = getDOMSelection(this._window);
    if (domSelection !== null) {
      domSelection.removeAllRanges();
    }
  }
  /**
   * Returns true if the editor is editable, false otherwise.
   * @returns True if the editor is editable, false otherwise.
   */
  isEditable() {
    return this._editable;
  }
  /**
   * Sets the editable property of the editor. When false, the
   * editor will not listen for user events on the underling contenteditable.
   * @param editable - the value to set the editable mode to.
   */
  setEditable(editable) {
    if (this._editable !== editable) {
      this._editable = editable;
      triggerListeners("editable", this, true, editable);
      if (this._slotsUsed) {
        this.update(() => $fullReconcile());
      }
    }
  }
  /**
   * Returns a JSON-serializable javascript object NOT a JSON string.
   * You still must call JSON.stringify (or something else) to turn the
   * state into a string you can transfer over the wire and store in a database.
   *
   * See {@link LexicalNode.exportJSON}
   *
   * @returns A JSON-serializable javascript object
   */
  toJSON() {
    return {
      editorState: this._editorState.toJSON()
    };
  }
};
LexicalEditor.version = LEXICAL_VERSION;
var pendingNodeToClone = null;
function setPendingNodeToClone(pendingNode) {
  pendingNodeToClone = pendingNode;
}
function getPendingNodeToClone() {
  const node = pendingNodeToClone;
  pendingNodeToClone = null;
  return node;
}
var INTERNAL_SKIP_AFTER_CLONE_FROM = /* @__PURE__ */ Symbol("INTERNAL_SKIP_AFTER_CLONE_FROM");
var keyCounter = 1;
function resetRandomKey() {
  keyCounter = 1;
}
function generateRandomKey() {
  return "" + keyCounter++;
}
function getRegisteredNodeOrThrow(editor, nodeType) {
  const registeredNode = getRegisteredNode(editor, nodeType);
  if (registeredNode === void 0) {
    {
      formatDevErrorMessage(`registeredNode: Type ${nodeType} not found`);
    }
  }
  return registeredNode;
}
function getRegisteredNode(editor, nodeType) {
  return editor._nodes.get(nodeType);
}
var scheduleMicroTask = typeof queueMicrotask === "function" ? queueMicrotask : (fn) => {
  Promise.resolve().then(fn);
};
function $isSelectionCapturedInDecoratorInput(anchorDOM, preResolvedActiveElement) {
  const activeElement = preResolvedActiveElement !== void 0 ? preResolvedActiveElement : (() => {
    const root = anchorDOM.getRootNode();
    return isDOMDocumentNode(root) || isDOMShadowRoot(root) ? getActiveElementDeep(root) : null;
  })();
  if (!isHTMLElement(activeElement)) {
    return false;
  }
  if (activeElement.hasAttribute("data-lexical-slot")) {
    return false;
  }
  const nearestNode = $getNearestNodeFromDOMNode(activeElement);
  const nodeName = activeElement.nodeName;
  return $isLexicalNode(nearestNode) && (nodeName === "INPUT" || nodeName === "TEXTAREA" || activeElement.contentEditable === "true" && getEditorPropertyFromDOMNode(activeElement) == null);
}
var isSelectionCapturedInDecoratorInput = $isSelectionCapturedInDecoratorInput;
function isSelectionWithinEditor(editor, anchorDOM, focusDOM) {
  const rootElement = editor.getRootElement();
  if (!rootElement) {
    return false;
  }
  try {
    if (!anchorDOM || !rootElement.contains(anchorDOM) || !rootElement.contains(focusDOM)) {
      return false;
    }
  } catch (_error) {
    return false;
  }
  return getNearestEditorFromDOMNode(anchorDOM) === editor && editor.read("latest", () => !$isSelectionCapturedInDecoratorInput(anchorDOM));
}
function isLexicalEditor(editor) {
  return editor instanceof LexicalEditor;
}
function getNearestEditorFromDOMNode(node) {
  let currentNode = node;
  while (currentNode != null) {
    const editor = getEditorPropertyFromDOMNode(currentNode);
    if (isLexicalEditor(editor)) {
      return editor;
    }
    currentNode = getParentElement(currentNode);
  }
  return null;
}
function getEditorPropertyFromDOMNode(node) {
  return node ? node.__lexicalEditor : null;
}
function getTextDirection(text) {
  if (RTL_REGEX.test(text)) {
    return "rtl";
  }
  if (LTR_REGEX.test(text)) {
    return "ltr";
  }
  return null;
}
function $isTokenOrTab(node) {
  return $isTabNode(node) || node.isToken();
}
function $isTokenOrSegmented(node) {
  return $isTokenOrTab(node) || node.isSegmented();
}
function isDOMTextNode(node) {
  return isDOMNode(node) && node.nodeType === DOM_TEXT_TYPE;
}
function isDOMDocumentNode(node) {
  return isDOMNode(node) && node.nodeType === DOM_DOCUMENT_TYPE;
}
function getDOMTextNode(element) {
  let node = element;
  while (node != null) {
    if (isDOMTextNode(node)) {
      return node;
    }
    node = node.firstChild;
  }
  return null;
}
function toggleTextFormatType(format, type, alignWithFormat) {
  const activeFormat = TEXT_TYPE_TO_FORMAT[type];
  if (alignWithFormat !== null && (format & activeFormat) === (alignWithFormat & activeFormat)) {
    return format;
  }
  let newFormat = format ^ activeFormat;
  if (type === "subscript") {
    newFormat &= ~TEXT_TYPE_TO_FORMAT.superscript;
  } else if (type === "superscript") {
    newFormat &= ~TEXT_TYPE_TO_FORMAT.subscript;
  } else if (type === "lowercase") {
    newFormat &= ~TEXT_TYPE_TO_FORMAT.uppercase;
    newFormat &= ~TEXT_TYPE_TO_FORMAT.capitalize;
  } else if (type === "uppercase") {
    newFormat &= ~TEXT_TYPE_TO_FORMAT.lowercase;
    newFormat &= ~TEXT_TYPE_TO_FORMAT.capitalize;
  } else if (type === "capitalize") {
    newFormat &= ~TEXT_TYPE_TO_FORMAT.lowercase;
    newFormat &= ~TEXT_TYPE_TO_FORMAT.uppercase;
  }
  return newFormat;
}
function $isLeafNode(node) {
  return $isTextNode(node) || $isLineBreakNode(node) || $isDecoratorNode(node);
}
function $setNodeKey(node, existingKey) {
  const pendingNode = getPendingNodeToClone();
  existingKey = existingKey || pendingNode && pendingNode.__key;
  if (existingKey != null) {
    {
      errorOnNodeKeyConstructorMismatch(node, existingKey, pendingNode);
    }
    node.__key = existingKey;
    return;
  }
  errorOnReadOnly();
  errorOnInfiniteTransforms();
  const editor = getActiveEditor();
  const editorState = getActiveEditorState();
  const key = generateRandomKey();
  editorState._nodeMap.set(key, node);
  if ($isElementNode(node)) {
    editor._dirtyElements.set(key, true);
  } else {
    editor._dirtyLeaves.add(key);
  }
  editor._cloneNotNeeded.add(key);
  if (editor._dirtyType === NO_DIRTY_NODES) {
    editor._dirtyType = HAS_DIRTY_NODES;
  }
  node.__key = key;
}
function errorOnNodeKeyConstructorMismatch(node, existingKey, pendingNode) {
  const editorState = internalGetActiveEditorState();
  if (!editorState) {
    return;
  }
  const existingNode = editorState._nodeMap.get(existingKey);
  if (pendingNode) {
    if (!(existingKey === pendingNode.__key)) {
      formatDevErrorMessage(`Lexical node with constructor ${node.constructor.name} (type ${node.getType()}) has an incorrect clone implementation, got ${String(existingKey)} for nodeKey when expecting ${pendingNode.__key}`);
    }
  }
  if (existingNode && existingNode.constructor !== node.constructor) {
    if (node.constructor.name !== existingNode.constructor.name) {
      {
        formatDevErrorMessage(`Lexical node with constructor ${node.constructor.name} attempted to re-use key from node in active editor state with constructor ${existingNode.constructor.name}. Keys must not be re-used when the type is changed.`);
      }
    } else {
      {
        formatDevErrorMessage(`Lexical node with constructor ${node.constructor.name} attempted to re-use key from node in active editor state with different constructor with the same name (possibly due to invalid Hot Module Replacement). Keys must not be re-used when the type is changed.`);
      }
    }
  }
}
function internalMarkParentElementsAsDirty(parentKey, nodeMap, dirtyElements) {
  let nextParentKey = parentKey;
  while (nextParentKey !== null) {
    if (dirtyElements.has(nextParentKey)) {
      return;
    }
    const node = nodeMap.get(nextParentKey);
    if (node === void 0) {
      break;
    }
    dirtyElements.set(nextParentKey, false);
    nextParentKey = node.__parent !== null ? node.__parent : $isSlotChild(node) ? node.__slotHost : null;
  }
}
function $markSlotsUsed() {
  getActiveEditor()._slotsUsed = true;
  getActiveEditorState()._slotsUsed = true;
}
function $removeFromParent(node) {
  if (!($getSlotHostKey(node) === null)) {
    formatDevErrorMessage(`$removeFromParent: node ${node.__key} is slotted into host ${String($getSlotHostKey(node))}; a slotted node and a child are mutually exclusive. Remove it from its slot first.`);
  }
  const oldParent = node.getParent();
  if (oldParent !== null) {
    const writableNode = node.getWritable();
    const writableParent = oldParent.getWritable();
    const prevSibling = node.getPreviousSibling();
    const nextSibling = node.getNextSibling();
    const nextSiblingKey = nextSibling !== null ? nextSibling.__key : null;
    const prevSiblingKey = prevSibling !== null ? prevSibling.__key : null;
    const writablePrevSibling = prevSibling !== null ? prevSibling.getWritable() : null;
    const writableNextSibling = nextSibling !== null ? nextSibling.getWritable() : null;
    if (prevSibling === null) {
      writableParent.__first = nextSiblingKey;
    }
    if (nextSibling === null) {
      writableParent.__last = prevSiblingKey;
    }
    if (writablePrevSibling !== null) {
      writablePrevSibling.__next = nextSiblingKey;
    }
    if (writableNextSibling !== null) {
      writableNextSibling.__prev = prevSiblingKey;
    }
    writableNode.__prev = null;
    writableNode.__next = null;
    writableNode.__parent = null;
    writableParent.__size--;
  }
}
var removeFromParent = $removeFromParent;
function internalMarkNodeAsDirty(node) {
  errorOnInfiniteTransforms();
  if (!!$isEphemeral(node)) {
    formatDevErrorMessage(`internalMarkNodeAsDirty: Ephemeral nodes must not be marked as dirty (key ${node.__key} type ${node.__type})`);
  }
  const latest = node.getLatest();
  const parent = latest.__parent !== null ? latest.__parent : $isSlotChild(latest) ? latest.__slotHost : null;
  const editorState = getActiveEditorState();
  const editor = getActiveEditor();
  const nodeMap = editorState._nodeMap;
  const dirtyElements = editor._dirtyElements;
  if (parent !== null) {
    internalMarkParentElementsAsDirty(parent, nodeMap, dirtyElements);
  }
  const key = latest.__key;
  if (editor._dirtyType === NO_DIRTY_NODES) {
    editor._dirtyType = HAS_DIRTY_NODES;
  }
  if ($isElementNode(node)) {
    dirtyElements.set(key, true);
  } else {
    editor._dirtyLeaves.add(key);
  }
}
function internalMarkSiblingsAsDirty(node) {
  const previousNode = node.getPreviousSibling();
  const nextNode = node.getNextSibling();
  if (previousNode !== null) {
    internalMarkNodeAsDirty(previousNode);
  }
  if (nextNode !== null) {
    internalMarkNodeAsDirty(nextNode);
  }
}
function $setCompositionKey(compositionKey) {
  errorOnReadOnly();
  const editor = getActiveEditor();
  const previousCompositionKey = editor._compositionKey;
  if (compositionKey !== previousCompositionKey) {
    editor._compositionKey = compositionKey;
    if (previousCompositionKey !== null) {
      const node = $getNodeByKey(previousCompositionKey);
      if (node !== null) {
        node.getWritable();
      }
    }
    if (compositionKey !== null) {
      const node = $getNodeByKey(compositionKey);
      if (node !== null) {
        node.getWritable();
      }
    }
  }
}
function $getCompositionKey() {
  if (isCurrentlyReadOnlyMode()) {
    return null;
  }
  const editor = getActiveEditor();
  return editor._compositionKey;
}
function $getNodeByKey(key, _editorState) {
  const editorState = _editorState || getActiveEditorState();
  const node = editorState._nodeMap.get(key);
  if (node === void 0) {
    return null;
  }
  return node;
}
function $getNodeFromDOMNode(dom, editorState) {
  const editor = getActiveEditor();
  const key = getNodeKeyFromDOMNode(dom, editor);
  if (key !== void 0) {
    return $getNodeByKey(key, editorState);
  }
  return null;
}
function setNodeKeyOnDOMNode(dom, editor, key) {
  const prop = `__lexicalKey_${editor._key}`;
  dom[prop] = key;
}
function clearNodeKeyOnDOMNode(dom, editor) {
  const prop = `__lexicalKey_${editor._key}`;
  delete dom[prop];
}
function getNodeKeyFromDOMNode(dom, editor) {
  const prop = `__lexicalKey_${editor._key}`;
  return dom[prop];
}
function $getNearestNodeFromDOMNode(startingDOM, editorState) {
  let dom = startingDOM;
  while (dom != null) {
    const node = $getNodeFromDOMNode(dom, editorState);
    if (node !== null) {
      return node;
    }
    dom = getParentElement(dom);
  }
  return null;
}
function cloneDecorators(editor) {
  const currentDecorators = editor._decorators;
  const pendingDecorators = Object.assign({}, currentDecorators);
  editor._pendingDecorators = pendingDecorators;
  return pendingDecorators;
}
function getEditorStateTextContent(editorState) {
  return editorState.read(() => $getRoot().getTextContent());
}
function markNodesWithTypesAsDirty(editor, types) {
  const cachedMap = getCachedTypeToNodeMap(editor.getEditorState());
  const dirtyNodeMaps = [];
  for (const type of types) {
    const nodeMap = cachedMap.get(type);
    if (nodeMap) {
      dirtyNodeMaps.push(nodeMap);
    }
  }
  if (dirtyNodeMaps.length === 0) {
    return;
  }
  editor.update(() => {
    for (const nodeMap of dirtyNodeMaps) {
      for (const nodeKey of nodeMap.keys()) {
        const latest = $getNodeByKey(nodeKey);
        if (latest) {
          latest.markDirty();
        }
      }
    }
  }, editor._pendingEditorState === null ? {
    tag: HISTORY_MERGE_TAG
  } : void 0);
}
function $getRoot() {
  return internalGetRoot(getActiveEditorState());
}
function $restoreEmptyContainerParagraph(container, removedChild) {
  if (!$isRootOrShadowRoot(container) || !container.isAttached() || !container.isEmpty() || !($isRootNode(container) || removedChild !== null && INTERNAL_$isBlock(removedChild))) {
    return null;
  }
  const paragraph = $createParagraphNode();
  container.append(paragraph);
  return paragraph;
}
function internalGetRoot(editorState) {
  return editorState._nodeMap.get("root");
}
function $setSelection(selection) {
  errorOnReadOnly();
  const editorState = getActiveEditorState();
  if (selection !== null) {
    {
      if (Object.isFrozen(selection)) {
        {
          formatDevErrorMessage(`$setSelection called on frozen selection object. Ensure selection is cloned before passing in.`);
        }
      }
    }
    selection.dirty = true;
    selection.setCachedNodes(null);
    if ($isRangeSelection(selection) && getActiveEditor()._slotsUsed) {
      $clampRangeSelectionToSlotFrame(selection);
    }
  }
  editorState._selection = selection;
}
function $flushMutations() {
  errorOnReadOnly();
  const editor = getActiveEditor();
  flushRootMutations(editor);
}
function $getNodeFromDOM(dom) {
  const editor = getActiveEditor();
  const nodeKey = getNodeKeyFromDOMTree(dom, editor);
  if (nodeKey === null) {
    return null;
  }
  return $getNodeByKey(nodeKey);
}
function getNodeKeyFromDOMTree(dom, editor) {
  let node = dom;
  while (node != null) {
    const key = getNodeKeyFromDOMNode(node, editor);
    if (key !== void 0) {
      return key;
    }
    node = getParentElement(node);
  }
  return null;
}
function doesContainSurrogatePair(str) {
  return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(str);
}
function getEditorsToPropagate(editor) {
  const editorsToPropagate = [];
  for (let currentEditor = editor; currentEditor !== null; currentEditor = currentEditor._parentEditor) {
    editorsToPropagate.push(currentEditor);
  }
  return editorsToPropagate;
}
function createUID() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substring(0, 5);
}
function getAnchorTextFromDOM(anchorNode) {
  return isDOMTextNode(anchorNode) ? anchorNode.nodeValue : null;
}
function $updateSelectedTextFromDOM(isCompositionEnd, editor, data) {
  const domSelection = getDOMSelection(getWindow(editor));
  if (domSelection === null) {
    return;
  }
  const points = getDOMSelectionPoints(domSelection, editor._rootElement);
  const anchorNode = points.anchorNode;
  let {
    anchorOffset,
    focusOffset
  } = points;
  if (anchorNode !== null) {
    let textContent = getAnchorTextFromDOM(anchorNode);
    const node = $getNearestNodeFromDOMNode(anchorNode);
    if (textContent !== null && $isTextNode(node)) {
      if ((textContent === COMPOSITION_SUFFIX || textContent === COMPOSITION_START_CHAR) && data) {
        const offset = data.length;
        textContent = data;
        anchorOffset = offset;
        focusOffset = offset;
      }
      if (textContent !== null) {
        $updateTextNodeFromDOMContent(node, textContent, anchorOffset, focusOffset, isCompositionEnd);
      }
    }
  }
}
function $updateTextNodeFromDOMContent(textNode, textContent, anchorOffset, focusOffset, compositionEnd) {
  let node = textNode;
  if (node.isAttached() && (compositionEnd || !node.isDirty())) {
    const isComposing = node.isComposing();
    if (node.isToken() && isComposing) {
      return;
    }
    let normalizedTextContent = textContent;
    if (isComposing || compositionEnd) {
      if (textContent.endsWith(COMPOSITION_SUFFIX)) {
        normalizedTextContent = textContent.slice(0, -COMPOSITION_SUFFIX.length);
      }
      if (compositionEnd) {
        const char = COMPOSITION_START_CHAR;
        let index;
        while ((index = normalizedTextContent.indexOf(char)) !== -1) {
          normalizedTextContent = normalizedTextContent.slice(0, index) + normalizedTextContent.slice(index + char.length);
          if (anchorOffset !== null && anchorOffset > index) {
            anchorOffset = Math.max(index, anchorOffset - char.length);
          }
          if (focusOffset !== null && focusOffset > index) {
            focusOffset = Math.max(index, focusOffset - char.length);
          }
        }
      }
    }
    const prevTextContent = node.getTextContent();
    if (compositionEnd || normalizedTextContent !== prevTextContent) {
      const selection = $getSelection();
      if (normalizedTextContent === "") {
        $setCompositionKey(null);
        if (!IS_SAFARI && !IS_IOS && !IS_APPLE_WEBKIT) {
          const editor = getActiveEditor();
          $setTextContentWithSelection(node, "", selection);
          setTimeout(() => {
            editor.update(() => {
              if (node.isAttached() && node.getTextContent() === "") {
                node.remove();
              }
            });
          }, 20);
        } else {
          node.remove();
        }
        return;
      }
      const parent = node.getParent();
      const prevSelection = $getPreviousSelection();
      const prevTextContentSize = node.getTextContentSize();
      const compositionKey = $getCompositionKey();
      const nodeKey = node.getKey();
      if (node.isToken() && !isComposing || compositionKey !== null && nodeKey === compositionKey && !isComposing || // Check if character was added at the start or boundaries when not insertable, and we need
      // to clear this input from occurring as that action wasn't permitted.
      $isRangeSelection(prevSelection) && (parent !== null && !parent.canInsertTextBefore() && prevSelection.anchor.offset === 0 || prevSelection.anchor.key === textNode.__key && prevSelection.anchor.offset === 0 && !node.canInsertTextBefore() && !isComposing || prevSelection.focus.key === textNode.__key && prevSelection.focus.offset === prevTextContentSize && !node.canInsertTextAfter() && !isComposing)) {
        node.markDirty();
        return;
      }
      if (!$isRangeSelection(selection) || anchorOffset === null || focusOffset === null) {
        $setTextContentWithSelection(node, normalizedTextContent, selection);
        return;
      }
      selection.setTextNodeRange(node, anchorOffset, node, focusOffset);
      if (node.isSegmented()) {
        const originalTextContent = node.getTextContent();
        const replacement = $createTextNode(originalTextContent);
        node.replace(replacement);
        node = replacement;
      }
      $setTextContentWithSelection(node, normalizedTextContent, selection);
    }
  }
}
function $setTextContentWithSelection(node, textContent, selection) {
  node.setTextContent(textContent);
  if ($isRangeSelection(selection)) {
    const key = node.getKey();
    let pointMutated = false;
    for (const k of ["anchor", "focus"]) {
      const pt = selection[k];
      if (pt.type === "text" && pt.key === key) {
        pt.offset = $getTextNodeOffset(node, pt.offset, "clamp");
        pointMutated = true;
      }
    }
    if (pointMutated) {
      selection._cachedNodes = null;
      selection._cachedIsBackward = null;
    }
  }
}
function $previousSiblingDoesNotAcceptText(node) {
  const previousSibling = node.getPreviousSibling();
  return ($isTextNode(previousSibling) || $isElementNode(previousSibling) && previousSibling.isInline()) && !previousSibling.canInsertTextAfter();
}
function $shouldInsertTextAfterOrBeforeTextNode(selection, node) {
  if (node.isSegmented()) {
    return true;
  }
  if (!selection.isCollapsed()) {
    return false;
  }
  const offset = selection.anchor.offset;
  const parent = node.getParentOrThrow();
  const isToken = $isTokenOrTab(node);
  if (offset === 0) {
    return !node.canInsertTextBefore() || !parent.canInsertTextBefore() && !node.isComposing() || isToken || $previousSiblingDoesNotAcceptText(node);
  } else if (offset === node.getTextContentSize()) {
    return !node.canInsertTextAfter() || !parent.canInsertTextAfter() && !node.isComposing() || isToken;
  } else {
    return false;
  }
}
function keyboardEventMaskForPlatform(mask, isApple) {
  const otherKey = mask[CONTROL_OR_OTHER_KEY];
  return otherKey && isApple !== IS_APPLE ? {
    ...mask,
    ctrlKey: mask[otherKey],
    [otherKey]: mask.ctrlKey
  } : mask;
}
function matchModifier(event, mask, prop) {
  const expected = mask[prop] || false;
  return expected === "any" || expected === event[prop];
}
function isModifierMatch(event, mask) {
  return matchModifier(event, mask, "altKey") && matchModifier(event, mask, "ctrlKey") && matchModifier(event, mask, "shiftKey") && matchModifier(event, mask, "metaKey");
}
function isExactShortcutMatch(event, expectedKey, mask) {
  if (!isModifierMatch(event, mask)) {
    return false;
  }
  if (event.key.toLowerCase() === expectedKey.toLowerCase()) {
    return true;
  }
  if (expectedKey.length > 1) {
    return false;
  }
  if (event.key.length === 1 && event.key.charCodeAt(0) <= 127) {
    return false;
  }
  if (event.code.startsWith("Digit") && /^\d$/.test(expectedKey)) {
    return event.code === `Digit${expectedKey}`;
  }
  const expectedCode = "Key" + expectedKey.toUpperCase();
  return event.code === expectedCode;
}
function isModifier(event) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
function isBackspace(event) {
  return event.key === "Backspace";
}
function $getRootChildAncestor(node) {
  let current = node;
  while (current !== null) {
    const parent = current.getParent();
    if (parent === null) {
      return null;
    }
    if ($isRootNode(parent)) {
      return current;
    }
    current = parent;
  }
  return null;
}
function $normalizeSelectionForSelectAll(selection, container) {
  const {
    anchor,
    focus
  } = selection;
  const anchorKey = anchor.key;
  const anchorOffset = anchor.offset;
  const anchorType = anchor.type;
  const focusKey = focus.key;
  const focusOffset = focus.offset;
  const focusType = focus.type;
  $normalizeSelection(selection);
  if (!$isRootNode(container)) {
    return selection;
  }
  const anchorTop = $getRootChildAncestor(anchor.getNode());
  if ($isElementNode(anchorTop) && anchorTop.isShadowRoot() && anchorTop.is($getRootChildAncestor(focus.getNode()))) {
    anchor.set(anchorKey, anchorOffset, anchorType);
    focus.set(focusKey, focusOffset, focusType);
  }
  return selection;
}
function $selectAll(selection) {
  const root = $getRoot();
  if ($isRangeSelection(selection)) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = anchor.getNode();
    if ($isRootNode(anchorNode)) {
      anchor.set(anchorNode.getKey(), 0, "element");
      focus.set(anchorNode.getKey(), anchorNode.getChildrenSize(), "element");
      $normalizeSelectionForSelectAll(selection, anchorNode);
      return selection;
    }
    const topParent = anchorNode.getTopLevelElementOrThrow();
    const parent = topParent.getParent();
    if (parent === null) {
      if ($isElementNode(topParent)) {
        anchor.set(topParent.getKey(), 0, "element");
        focus.set(topParent.getKey(), topParent.getChildrenSize(), "element");
        $normalizeSelectionForSelectAll(selection, topParent);
      }
      return selection;
    }
    anchor.set(parent.getKey(), 0, "element");
    focus.set(parent.getKey(), parent.getChildrenSize(), "element");
    $normalizeSelectionForSelectAll(selection, parent);
    return selection;
  } else {
    const newSelection = root.select(0, root.getChildrenSize());
    $setSelection($normalizeSelectionForSelectAll(newSelection, root));
    return newSelection;
  }
}
function removeEmptyDOMAttribute(dom, attributeName) {
  if (dom.getAttribute(attributeName) === "") {
    dom.removeAttribute(attributeName);
  }
}
function getCachedClassNameArray(classNamesTheme, classNameThemeType) {
  if (classNamesTheme.__lexicalClassNameCache === void 0) {
    classNamesTheme.__lexicalClassNameCache = {};
  }
  const classNamesCache = classNamesTheme.__lexicalClassNameCache;
  const cachedClassNames = classNamesCache[classNameThemeType];
  if (cachedClassNames !== void 0) {
    return cachedClassNames;
  }
  const classNames = classNamesTheme[classNameThemeType];
  if (typeof classNames === "string") {
    const classNamesArr = normalizeClassNames(classNames);
    classNamesCache[classNameThemeType] = classNamesArr;
    return classNamesArr;
  }
  return classNames;
}
function setMutatedNode(mutatedNodes2, registeredNodes, mutationListeners, node, mutation) {
  if (mutationListeners.size === 0) {
    return;
  }
  const nodeType = node.__type;
  const nodeKey = node.__key;
  const registeredNode = registeredNodes.get(nodeType);
  if (registeredNode === void 0) {
    {
      formatDevErrorMessage(`Type ${nodeType} not in registeredNodes`);
    }
  }
  const klass = registeredNode.klass;
  let mutatedNodesByType = mutatedNodes2.get(klass);
  if (mutatedNodesByType === void 0) {
    mutatedNodesByType = /* @__PURE__ */ new Map();
    mutatedNodes2.set(klass, mutatedNodesByType);
  }
  const prevMutation = mutatedNodesByType.get(nodeKey);
  const isMove = prevMutation === "destroyed" && mutation === "created";
  if (prevMutation === void 0 || isMove) {
    mutatedNodesByType.set(nodeKey, isMove ? "updated" : mutation);
  }
}
function $nodesOfType(klass) {
  const klassType = klass.getType();
  const editorState = getActiveEditorState();
  if (editorState._readOnly) {
    const nodes2 = getCachedTypeToNodeMap(editorState).get(klassType);
    return nodes2 ? Array.from(nodes2.values()) : [];
  }
  const nodes = editorState._nodeMap;
  const nodesOfType = [];
  for (const [, node] of nodes) {
    if (node instanceof klass && node.__type === klassType && node.isAttached()) {
      nodesOfType.push(node);
    }
  }
  return nodesOfType;
}
function resolveElement(element, isBackward, focusOffset) {
  const parent = element.getParent();
  let offset = focusOffset;
  let block = element;
  if (parent !== null) {
    if (isBackward && focusOffset === 0) {
      offset = block.getIndexWithinParent();
      block = parent;
    } else if (!isBackward && focusOffset === block.getChildrenSize()) {
      offset = block.getIndexWithinParent() + 1;
      block = parent;
    }
  }
  return block.getChildAtIndex(isBackward ? offset - 1 : offset);
}
function $getAdjacentNode(focus, isBackward) {
  const focusOffset = focus.offset;
  if (focus.type === "element") {
    const block = focus.getNode();
    return resolveElement(block, isBackward, focusOffset);
  } else {
    const focusNode = focus.getNode();
    if (isBackward && focusOffset === 0 || !isBackward && focusOffset === focusNode.getTextContentSize()) {
      const possibleNode = isBackward ? focusNode.getPreviousSibling() : focusNode.getNextSibling();
      if (possibleNode === null) {
        return resolveElement(focusNode.getParentOrThrow(), isBackward, focusNode.getIndexWithinParent() + (isBackward ? 0 : 1));
      }
      return possibleNode;
    }
  }
  return null;
}
function isFirefoxClipboardEvents(editor) {
  const event = getWindow(editor).event;
  const inputType = event && event.inputType;
  return inputType === "insertFromPaste" || inputType === "insertFromPasteAsQuotation";
}
function dispatchCommand(editor, command, ...args) {
  return triggerCommandListeners(editor, command, args[0], editor);
}
function getElementByKeyOrThrow(editor, key) {
  const element = editor._keyToDOMMap.get(key);
  if (element === void 0) {
    {
      formatDevErrorMessage(`Reconciliation: could not find DOM element for node key ${key}`);
    }
  }
  return element;
}
function getParentElement(node) {
  const parentElement = node.assignedSlot || node.parentElement;
  if (parentElement !== null) {
    return parentElement;
  }
  const parentNode = node.parentNode;
  return isDOMShadowRoot(parentNode) ? parentNode.host : null;
}
function getDOMOwnerDocument(target) {
  return isDOMDocumentNode(target) ? target : isHTMLElement(target) ? target.ownerDocument : null;
}
function scrollIntoViewIfNeeded(editor, selectionRect, rootElement) {
  const doc = getDOMOwnerDocument(rootElement);
  const defaultView = getDefaultView(doc);
  if (doc === null || defaultView === null) {
    return;
  }
  const rootRect = rootElement.getBoundingClientRect();
  if (selectionRect.bottom < rootRect.top) {
    return;
  }
  let {
    top: currentTop,
    bottom: currentBottom
  } = selectionRect;
  let targetTop = 0;
  let targetBottom = 0;
  let element = rootElement;
  while (element !== null) {
    const isBodyElement = element === doc.body;
    if (isBodyElement) {
      const visualViewport = defaultView.visualViewport;
      if (visualViewport) {
        const offsetTop = visualViewport.offsetTop;
        targetTop = offsetTop;
        targetBottom = offsetTop + visualViewport.height;
      } else {
        targetTop = 0;
        targetBottom = getWindow(editor).innerHeight;
      }
      const computedStyle = defaultView.getComputedStyle(doc.documentElement);
      const scrollPaddingTop = parseFloat(computedStyle.scrollPaddingTop);
      const scrollPaddingBottom = parseFloat(computedStyle.scrollPaddingBottom);
      if (isFinite(scrollPaddingTop)) {
        targetTop += scrollPaddingTop;
      }
      if (isFinite(scrollPaddingBottom)) {
        targetBottom -= scrollPaddingBottom;
      }
    } else {
      const targetRect = element === rootElement ? rootRect : element.getBoundingClientRect();
      targetTop = targetRect.top;
      targetBottom = targetRect.bottom;
    }
    let diff = 0;
    if (currentTop < targetTop) {
      diff = -(targetTop - currentTop);
    } else if (currentBottom > targetBottom) {
      diff = currentBottom - targetBottom;
    }
    if (diff !== 0) {
      if (isBodyElement) {
        defaultView.scrollBy(0, diff);
      } else {
        const scrollTop = element.scrollTop;
        element.scrollTop += diff;
        const yOffset = element.scrollTop - scrollTop;
        currentTop -= yOffset;
        currentBottom -= yOffset;
      }
    }
    if (isBodyElement) {
      break;
    }
    element = getParentElement(element);
  }
}
function $hasUpdateTag(tag) {
  const editor = getActiveEditor();
  return editor._updateTags.has(tag);
}
function $addUpdateTag(tag) {
  errorOnReadOnly();
  const editor = getActiveEditor();
  editor._updateTags.add(tag);
}
function $onUpdate(updateFn) {
  errorOnReadOnly();
  const editor = getActiveEditor();
  editor._deferred.push(updateFn);
}
function $maybeMoveChildrenSelectionToParent(parentNode) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !$isElementNode(parentNode)) {
    return selection;
  }
  const {
    anchor,
    focus
  } = selection;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if ($hasAncestor(anchorNode, parentNode)) {
    anchor.set(parentNode.__key, 0, "element");
  }
  if ($hasAncestor(focusNode, parentNode)) {
    focus.set(parentNode.__key, 0, "element");
  }
  return selection;
}
function $hasAncestor(child, targetNode) {
  let parent = child.getParent();
  while (parent !== null) {
    if (parent.is(targetNode)) {
      return true;
    }
    parent = parent.getParent();
  }
  return false;
}
function getDefaultView(domElem) {
  const ownerDoc = getDOMOwnerDocument(domElem);
  return ownerDoc ? ownerDoc.defaultView : null;
}
function getWindow(editor) {
  const windowObj = editor._window;
  if (windowObj === null) {
    {
      formatDevErrorMessage(`window object not found`);
    }
  }
  return windowObj;
}
function $isInlineElementOrDecoratorNode(node) {
  return $isElementNode(node) && node.isInline() || $isDecoratorNode(node) && node.isInline();
}
function $getNearestRootOrShadowRoot(node) {
  let current = node.getLatest();
  while (current !== null) {
    if ($getSlotHostKey(current) !== null && $isElementNode(current)) {
      return current;
    }
    const parent = current.getParentOrThrow();
    if ($isRootOrShadowRoot(parent)) {
      return parent;
    }
    current = parent;
  }
  return current;
}
function $isShadowRootNode(node) {
  return $isElementNode(node) && node.isShadowRoot();
}
function $isRootOrShadowRoot(node) {
  return $isRootNode(node) || $isShadowRootNode(node);
}
function $copyNode(node, skipReset = false) {
  const copy = node.constructor.clone(node, INTERNAL_SKIP_AFTER_CLONE_FROM);
  $setNodeKey(copy, null);
  copy.afterCloneFrom(node);
  if (!skipReset) {
    copy.resetOnCopyNodeFrom(node);
  }
  return copy;
}
function $applyNodeReplacement(node) {
  const editor = getActiveEditor();
  const nodeType = node.getType();
  const registeredNode = getRegisteredNode(editor, nodeType);
  if (!(registeredNode !== void 0)) {
    formatDevErrorMessage(`$applyNodeReplacement node ${node.constructor.name} with type ${nodeType} must be registered to the editor. You can do this by passing the node class via the "nodes" array in the editor config.`);
  }
  const {
    replace,
    replaceWithKlass
  } = registeredNode;
  if (replace !== null) {
    const replacementNode = replace(node);
    const replacementNodeKlass = replacementNode.constructor;
    if (replaceWithKlass !== null) {
      if (!(replacementNode instanceof replaceWithKlass)) {
        formatDevErrorMessage(`$applyNodeReplacement failed. Expected replacement node to be an instance of ${replaceWithKlass.name} with type ${replaceWithKlass.getType()} but returned ${replacementNodeKlass.name} with type ${replacementNodeKlass.getType()} from original node ${node.constructor.name} with type ${nodeType}`);
      }
    } else {
      if (!(replacementNode instanceof node.constructor && replacementNodeKlass !== node.constructor)) {
        formatDevErrorMessage(`$applyNodeReplacement failed. Ensure replacement node ${replacementNodeKlass.name} with type ${replacementNodeKlass.getType()} is a subclass of the original node ${node.constructor.name} with type ${nodeType}.`);
      }
    }
    if (!(replacementNode.__key !== node.__key)) {
      formatDevErrorMessage(`$applyNodeReplacement failed. Ensure that the key argument is *not* used in your replace function (from node ${node.constructor.name} with type ${nodeType} to node ${replacementNodeKlass.name} with type ${replacementNodeKlass.getType()}), Node keys must never be re-used except by the static clone method.`);
    }
    return replacementNode;
  }
  return node;
}
function errorOnInsertTextNodeOnRoot(node, insertNode) {
  const parentNode = node.getParent();
  if ($isRootNode(parentNode) && !$isElementNode(insertNode) && !$isDecoratorNode(insertNode)) {
    {
      formatDevErrorMessage(`Only element or decorator nodes can be inserted in to the root node`);
    }
  }
}
function $getNodeByKeyOrThrow(key) {
  const node = $getNodeByKey(key);
  if (node === null) {
    {
      formatDevErrorMessage(`Expected node with key ${key} to exist but it's not in the nodeMap.`);
    }
  }
  return node;
}
function $createBlockCursorElement(editorConfig) {
  const theme = editorConfig.theme;
  const element = $getDocument().createElement("div");
  element.contentEditable = "false";
  element.setAttribute("data-lexical-cursor", "true");
  let blockCursorTheme = theme.blockCursor;
  if (blockCursorTheme !== void 0) {
    if (typeof blockCursorTheme === "string") {
      const classNamesArr = normalizeClassNames(blockCursorTheme);
      blockCursorTheme = theme.blockCursor = classNamesArr;
    }
    if (blockCursorTheme !== void 0) {
      element.classList.add(...blockCursorTheme);
    }
  }
  return element;
}
function $needsBlockCursorBeside(node) {
  if (!node || node.isInline()) {
    return false;
  }
  if ($isDecoratorNode(node)) {
    return true;
  }
  if ($isElementNode(node)) {
    if (node.isShadowRoot()) {
      const parent = node.getParent();
      return !($isElementNode(parent) && parent.isShadowRoot());
    }
    return !node.canBeEmpty();
  }
  return false;
}
function removeDOMBlockCursorElement(blockCursorElement, editor, rootElement) {
  rootElement.style.removeProperty("caret-color");
  editor._blockCursorElement = null;
  const parentElement = blockCursorElement.parentElement;
  if (parentElement !== null) {
    parentElement.removeChild(blockCursorElement);
  }
}
function $updateDOMBlockCursorElement(editor, rootElement, nextSelection) {
  let blockCursorElement = editor._blockCursorElement;
  if ($isRangeSelection(nextSelection) && nextSelection.isCollapsed() && nextSelection.anchor.type === "element" && // getActiveElement rather than document.activeElement, which reports the
  // shadow host (outside rootElement) when the editor is in a shadow root
  rootElement.contains(getActiveElement(rootElement))) {
    const anchor = nextSelection.anchor;
    const elementNode = anchor.getNode();
    const offset = anchor.offset;
    const elementNodeSize = elementNode.getChildrenSize();
    let isBlockCursor = false;
    let insertBeforeElement = null;
    if (offset === elementNodeSize) {
      const child = elementNode.getChildAtIndex(offset - 1);
      if ($needsBlockCursorBeside(child)) {
        isBlockCursor = true;
      }
    } else {
      const child = elementNode.getChildAtIndex(offset);
      if (child !== null && $needsBlockCursorBeside(child)) {
        isBlockCursor = true;
        insertBeforeElement = editor.getElementByKey(child.__key);
      }
    }
    if (isBlockCursor) {
      const elementDOM = $getDOMSlot(elementNode, editor.getElementByKey(elementNode.__key), editor).element;
      if (blockCursorElement === null) {
        editor._blockCursorElement = blockCursorElement = $createBlockCursorElement(editor._config);
      }
      rootElement.style.caretColor = "transparent";
      if (insertBeforeElement === null) {
        elementDOM.appendChild(blockCursorElement);
      } else {
        elementDOM.insertBefore(blockCursorElement, insertBeforeElement);
      }
      return;
    }
  }
  if (blockCursorElement !== null) {
    removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
  }
}
function getDOMSelection(targetWindow) {
  return !CAN_USE_DOM ? null : (targetWindow || window).getSelection();
}
function getDOMSelectionFromTarget(eventTarget) {
  const defaultView = getDefaultView(eventTarget);
  return defaultView ? defaultView.getSelection() : null;
}
function isDOMShadowRoot(node) {
  return isDocumentFragment(node) && "host" in node;
}
var EMPTY_SHADOW_ROOTS = [];
function getDOMShadowRoots(node) {
  const root = node.getRootNode();
  if (root === node || !isDOMShadowRoot(root)) {
    return EMPTY_SHADOW_ROOTS;
  }
  const shadowRoots = [root];
  let current = root.host;
  for (; ; ) {
    const nextRoot = current.getRootNode();
    if (nextRoot === current || !isDOMShadowRoot(nextRoot)) {
      break;
    }
    shadowRoots.push(nextRoot);
    current = nextRoot.host;
  }
  return shadowRoots;
}
function* findAllLexicalElementsDeep(initialRoot) {
  const roots = [initialRoot];
  let root;
  while (root = roots.pop()) {
    yield* root.querySelectorAll('[data-lexical-editor="true"]');
    const doc = isDOMDocumentNode(root) ? root : root.ownerDocument;
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let el;
    while (el = walker.nextNode()) {
      if (el.shadowRoot) {
        roots.push(el.shadowRoot);
      }
    }
  }
}
function getRootOwnerDocument(rootElement) {
  return rootElement !== null ? rootElement.ownerDocument : document;
}
function $getDocument() {
  const editor = internalGetActiveEditor();
  return getRootOwnerDocument(editor !== null ? editor._rootElement : null);
}
function getComposedStaticRange(domSelection, rootElement) {
  if (rootElement === null || typeof domSelection.getComposedRanges !== "function") {
    return null;
  }
  const shadowRoots = getDOMShadowRoots(rootElement);
  if (shadowRoots.length === 0) {
    return null;
  }
  const getComposedRanges = domSelection.getComposedRanges;
  try {
    const dictRange = getComposedRanges.call(domSelection, {
      shadowRoots
    })[0];
    if (dictRange !== void 0) {
      return dictRange;
    }
  } catch (_error) {
  }
  try {
    const variadicRange = getComposedRanges.apply(domSelection, shadowRoots)[0];
    if (variadicRange !== void 0) {
      return variadicRange;
    }
  } catch (_error) {
  }
  return null;
}
function getDOMSelectionRange(domSelection, rootElement) {
  const staticRange = getComposedStaticRange(domSelection, rootElement);
  if (staticRange !== null) {
    const range = staticRangeToLiveRange(staticRange);
    if (range !== null) {
      return range;
    }
  }
  return domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null;
}
function getDOMSelectionPoints(domSelection, rootElement) {
  const staticRange = getComposedStaticRange(domSelection, rootElement);
  if (staticRange === null) {
    return domSelection;
  }
  return staticRangeToPoints(staticRange, readDirection(domSelection));
}
function getDOMSelectionRangeAndPoints(domSelection, rootElement) {
  const staticRange = getComposedStaticRange(domSelection, rootElement);
  if (staticRange === null) {
    return {
      points: domSelection,
      range: domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null
    };
  }
  const range = staticRangeToLiveRange(staticRange) ?? (domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null);
  return {
    points: staticRangeToPoints(staticRange, readDirection(domSelection)),
    range
  };
}
function staticRangeToLiveRange(staticRange) {
  const doc = staticRange.startContainer.ownerDocument;
  if (doc === null) {
    return null;
  }
  const range = doc.createRange();
  try {
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    return range;
  } catch (_error) {
    return null;
  }
}
function staticRangeToPoints(staticRange, direction) {
  const {
    startContainer,
    startOffset,
    endContainer,
    endOffset
  } = staticRange;
  return direction === "backward" ? {
    anchorNode: endContainer,
    anchorOffset: endOffset,
    direction,
    focusNode: startContainer,
    focusOffset: startOffset
  } : {
    anchorNode: startContainer,
    anchorOffset: startOffset,
    direction,
    focusNode: endContainer,
    focusOffset: endOffset
  };
}
function readDirection(domSelection) {
  return domSelection.direction;
}
function getActiveElement(node) {
  const root = node.getRootNode();
  return isDOMDocumentNode(root) || isDOMShadowRoot(root) ? root.activeElement : null;
}
function getActiveElementDeep(root) {
  let active = root.activeElement;
  while (active !== null && active.shadowRoot !== null) {
    const inner = active.shadowRoot.activeElement;
    if (inner === null) {
      break;
    }
    active = inner;
  }
  return active;
}
function getComposedEventTarget(event) {
  const target = event.target;
  if (target !== null && isHTMLElement(target) && target.shadowRoot !== null && typeof event.composedPath === "function") {
    const path = event.composedPath();
    if (path.length > 0) {
      return path[0];
    }
  }
  return target;
}
function $splitNode(node, offset) {
  let startNode = node.getChildAtIndex(offset);
  if (startNode == null) {
    startNode = node;
  }
  if (!!$isRootOrShadowRoot(node)) {
    formatDevErrorMessage(`Can not call $splitNode() on root element`);
  }
  const recurse = (currentNode) => {
    const parent = currentNode.getParentOrThrow();
    const isParentRoot = $isRootOrShadowRoot(parent);
    const nodeToMove = currentNode === startNode && !isParentRoot ? currentNode : $copyNode(currentNode);
    if (isParentRoot) {
      if (!($isElementNode(currentNode) && $isElementNode(nodeToMove))) {
        formatDevErrorMessage(`Children of a root must be ElementNode`);
      }
      currentNode.insertAfter(nodeToMove);
      return [currentNode, nodeToMove, nodeToMove];
    } else {
      const [leftTree2, rightTree2, newParent] = recurse(parent);
      const nextSiblings = currentNode.getNextSiblings();
      newParent.append(nodeToMove, ...nextSiblings);
      return [leftTree2, rightTree2, nodeToMove];
    }
  };
  const [leftTree, rightTree] = recurse(startNode);
  return [leftTree, rightTree];
}
function isHTMLAnchorElement(x2) {
  return isHTMLElement(x2) && x2.tagName === "A";
}
function isHTMLTableRowElement(x2) {
  return isHTMLElement(x2) && x2.tagName === "TR";
}
function isHTMLTableCellElement(x2) {
  return isHTMLElement(x2) && (x2.tagName === "TD" || x2.tagName === "TH");
}
function isHTMLElement(x2) {
  return isDOMNode(x2) && x2.nodeType === DOM_ELEMENT_TYPE;
}
function isDOMNode(x2) {
  return typeof x2 === "object" && x2 !== null && "nodeType" in x2 && typeof x2.nodeType === "number";
}
function isDocumentFragment(x2) {
  return isDOMNode(x2) && x2.nodeType === DOM_DOCUMENT_FRAGMENT_TYPE;
}
var INLINE_TAG_RE = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|mark|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/i;
function isInlineDomNode(node) {
  return isHTMLElement(node) && node.style.display.startsWith("inline") ? true : INLINE_TAG_RE.test(node.nodeName);
}
var BLOCK_TAG_RE = /^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/i;
function isBlockDomNode(node) {
  return isHTMLElement(node) && node.style.display.startsWith("inline") ? false : BLOCK_TAG_RE.test(node.nodeName);
}
function INTERNAL_$isBlock(node) {
  if ($isDecoratorNode(node) && !node.isInline()) {
    return true;
  }
  if (!$isElementNode(node) || $isRootOrShadowRoot(node)) {
    return false;
  }
  const firstChild = node.getFirstChild();
  const isLeafElement = firstChild === null || $isLineBreakNode(firstChild) || $isTextNode(firstChild) || firstChild.isInline();
  return !node.isInline() && node.canBeEmpty() !== false && isLeafElement;
}
function $getEditor() {
  return getActiveEditor();
}
function $getEditorDOMRenderConfig(editor = $getEditor()) {
  return editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG;
}
function $getDOMSlot(node, dom, editor = $getEditor()) {
  const slot = $getEditorDOMRenderConfig(editor).$getDOMSlot(node, dom, editor);
  if ($isElementNode(node)) {
    if (!$isElementDOMSlot(slot)) {
      formatDevErrorMessage(`$getDOMSlot: expected ElementDOMSlot for ElementNode (key ${node.getKey()} type ${node.getType()})`);
    }
  }
  return slot;
}
function $getSlotContainer(host, name, editor = $getEditor()) {
  const slot = $getSlot(host, name);
  if (slot === null) {
    return null;
  }
  const slotDom = editor.getElementByKey(slot.getKey());
  return slotDom !== null ? slotDom.parentElement : null;
}
function mountSlotContainer(editor, nodeKey, slotName, target) {
  const container = editor.read("latest", () => {
    const host = $getNodeByKey(nodeKey);
    return host !== null ? $getSlotContainer(host, slotName, editor) : null;
  });
  if (container !== null) {
    if (container.parentElement !== target) {
      target.appendChild(container);
    }
    container.style.display = "";
  }
  return container;
}
function unmountSlotContainer(editor, nodeKey, container) {
  container.style.display = "none";
  const hostDom = editor.getElementByKey(nodeKey);
  if (hostDom !== null && container.parentElement !== hostDom) {
    hostDom.insertBefore(container, hostDom.firstChild);
  }
}
function $isElementDOMSlot(slot) {
  return slot instanceof ElementDOMSlot;
}
function $getDOMTextNode(node, dom, editor = $getEditor()) {
  const slot = $getDOMSlot(node, dom, editor);
  return getDOMTextNode(slot.element);
}
var cachedNodeMaps = /* @__PURE__ */ new WeakMap();
var EMPTY_TYPE_TO_NODE_MAP = /* @__PURE__ */ new Map();
function getCachedTypeToNodeMap(editorState) {
  if (!editorState._readOnly && editorState.isEmpty()) {
    return EMPTY_TYPE_TO_NODE_MAP;
  }
  if (!editorState._readOnly) {
    formatDevErrorMessage(`getCachedTypeToNodeMap called with a writable EditorState`);
  }
  let typeToNodeMap = cachedNodeMaps.get(editorState);
  if (!typeToNodeMap) {
    typeToNodeMap = computeTypeToNodeMap(editorState);
    cachedNodeMaps.set(editorState, typeToNodeMap);
  }
  return typeToNodeMap;
}
function computeTypeToNodeMap(editorState) {
  const typeToNodeMap = /* @__PURE__ */ new Map();
  for (const [nodeKey, node] of editorState._nodeMap) {
    const nodeType = node.__type;
    let nodeMap = typeToNodeMap.get(nodeType);
    if (!nodeMap) {
      nodeMap = /* @__PURE__ */ new Map();
      typeToNodeMap.set(nodeType, nodeMap);
    }
    nodeMap.set(nodeKey, node);
  }
  return typeToNodeMap;
}
function $cloneWithProperties(latestNode) {
  const constructor = latestNode.constructor;
  const mutableNode = constructor.clone(latestNode, INTERNAL_SKIP_AFTER_CLONE_FROM);
  mutableNode.afterCloneFrom(latestNode);
  {
    if (!(mutableNode.__key === latestNode.__key)) {
      formatDevErrorMessage(`$cloneWithProperties: ${constructor.name}.clone(node) (with type '${constructor.getType()}') did not return a node with the same key, make sure to specify node.__key as the last argument to the constructor`);
    }
    if (!(mutableNode.__parent === latestNode.__parent && mutableNode.__next === latestNode.__next && mutableNode.__prev === latestNode.__prev)) {
      formatDevErrorMessage(`$cloneWithProperties: ${constructor.name}.clone(node) (with type '${constructor.getType()}') overrode afterCloneFrom but did not call super.afterCloneFrom(prevNode)`);
    }
    if ($isSlotChild(mutableNode) && $isSlotChild(latestNode)) {
      if (!(mutableNode.__slotHost === latestNode.__slotHost)) {
        formatDevErrorMessage(`$cloneWithProperties: ${constructor.name}.clone(node) (with type '${constructor.getType()}') overrode afterCloneFrom but did not preserve __slotHost`);
      }
    }
    if ($isSlotHost(mutableNode) && $isSlotHost(latestNode)) {
      const mutSlots = mutableNode.__slots;
      const latSlots = latestNode.__slots;
      const slotsMatch = mutSlots === latSlots || mutSlots !== null && latSlots !== null && mutSlots.size === latSlots.size && Array.from(mutSlots).every(([k, v2]) => latSlots.get(k) === v2);
      if (!slotsMatch) {
        formatDevErrorMessage(`$cloneWithProperties: ${constructor.name}.clone(node) (with type '${constructor.getType()}') overrode afterCloneFrom but did not preserve __slots`);
      }
    }
  }
  return mutableNode;
}
function $cloneWithPropertiesEphemeral(latestNode) {
  return $markEphemeral($cloneWithProperties(latestNode));
}
function setNodeIndentFromDOM(elementDom, elementNode) {
  const indentAttr = elementDom.getAttribute("data-lexical-indent");
  if (indentAttr !== null) {
    const parsed = parseInt(indentAttr, 10);
    if (Number.isFinite(parsed) && parsed >= 0) {
      elementNode.setIndent(parsed);
      return;
    }
  }
  const indentSize = parseInt(elementDom.style.paddingInlineStart, 10) || 0;
  const indent = Math.round(indentSize / 40);
  elementNode.setIndent(indent);
}
function $setDirectionFromDOM(node, domNode) {
  const dir = domNode.getAttribute("dir");
  return dir === "ltr" || dir === "rtl" ? node.setDirection(dir) : node;
}
function $setFormatFromDOM(node, domNode) {
  const alignment = domNode.style.textAlign;
  return alignment && alignment in ELEMENT_TYPE_TO_FORMAT ? node.setFormat(alignment) : node;
}
function setDOMUnmanaged(elementDom, options) {
  elementDom.__lexicalUnmanaged = true;
  if (options && options.captureSelection !== void 0) {
    elementDom.__lexicalCapturedSelection = options.captureSelection;
  }
}
function isDOMUnmanaged(elementDom) {
  return elementDom.__lexicalUnmanaged === true;
}
function $markSlotEditable(element, editor = $getEditor()) {
  const editable = editor.isEditable();
  element.contentEditable = editable ? "true" : "false";
  if (editable) {
    element.__lexicalEditor = editor;
  } else {
    delete element.__lexicalEditor;
  }
}
function isDOMCapturingSelection(elementDom, editor) {
  let dom = elementDom;
  while (dom != null) {
    if (dom.__lexicalCapturedSelection === true) {
      return true;
    }
    if (isHTMLElement(dom) && dom.hasAttribute("data-lexical-slot")) {
      return false;
    }
    if (getNodeKeyFromDOMNode(dom, editor) !== void 0) {
      return false;
    }
    dom = getParentElement(dom);
  }
  return false;
}
function hasOwn(o2, k) {
  return Object.prototype.hasOwnProperty.call(o2, k);
}
function hasOwnStaticMethod(klass, k) {
  return hasOwn(klass, k) && klass[k] !== LexicalNode[k];
}
function isAbstractNodeClass(klass) {
  if (!(klass === LexicalNode || klass.prototype instanceof LexicalNode)) {
    let ownNodeType = "<unknown>";
    let version = "<unknown>";
    try {
      ownNodeType = klass.getType();
    } catch (_err) {
    }
    try {
      if (LexicalEditor.version) {
        version = JSON.parse(LexicalEditor.version);
      }
    } catch (_err) {
    }
    {
      formatDevErrorMessage(`${klass.name} (type ${ownNodeType}) does not subclass LexicalNode from the lexical package used by this editor (version ${version}). All lexical and @lexical/* packages used by an editor must have identical versions. If you suspect the version does match, then the problem may be caused by multiple copies of the same lexical module (e.g. both esm and cjs, or included directly in multiple entrypoints).`);
    }
  }
  return klass === DecoratorNode || klass === ElementNode || klass === LexicalNode;
}
var STATIC_NODE_CONFIG_CACHE = /* @__PURE__ */ new WeakMap();
var SYNTHESIZED_GET_TYPE = /* @__PURE__ */ Symbol("lexical.synthesizedGetType");
var IS_UNOPTIMIZED_DEV_BUILD = (
  // constructor(key=undefined)
  TabNode.length === 0 && // constructor(text='', key?: NodeKey)
  TextNode.length === 0 && // Class name mangling is another signal that this may be unreliable
  TextNode.name === "TextNode"
);
function getStaticNodeConfig(klass) {
  const cache = STATIC_NODE_CONFIG_CACHE.get(klass);
  if (cache) {
    return cache;
  }
  const nodeConfigRecord = klass.prototype != null && PROTOTYPE_CONFIG_METHOD in klass.prototype ? klass.prototype[PROTOTYPE_CONFIG_METHOD]() : void 0;
  const isAbstract = isAbstractNodeClass(klass);
  const ownGetType = !isAbstract && hasOwnStaticMethod(klass, "getType") ? klass.getType : void 0;
  const nodeType = ownGetType && !(SYNTHESIZED_GET_TYPE in ownGetType) ? ownGetType.call(klass) : void 0;
  let ownNodeConfig;
  let ownNodeType = nodeType;
  if (nodeConfigRecord) {
    if (nodeType) {
      ownNodeConfig = nodeConfigRecord[nodeType];
    } else {
      for (const [k, v2] of Object.entries(nodeConfigRecord)) {
        ownNodeType = k;
        ownNodeConfig = v2;
      }
      if (!ownNodeConfig) {
        for (const symbolKey of Object.getOwnPropertySymbols(nodeConfigRecord)) {
          const symbolConfig = nodeConfigRecord[symbolKey];
          if (symbolConfig) {
            ownNodeConfig = symbolConfig;
            break;
          }
        }
      }
    }
  }
  if (!isAbstract && ownNodeType) {
    if (!hasOwnStaticMethod(klass, "getType")) {
      const synthesizedForKlass = klass;
      const synthesizedGetType = function() {
        if (this !== synthesizedForKlass) {
          return LexicalNode.getType.call(this);
        }
        return ownNodeType;
      };
      synthesizedGetType[SYNTHESIZED_GET_TYPE] = true;
      klass.getType = synthesizedGetType;
    }
    if (!hasOwnStaticMethod(klass, "clone")) {
      if (IS_UNOPTIMIZED_DEV_BUILD) {
        if (!(klass.length === 0)) {
          formatDevErrorMessage(`${klass.name} (type ${ownNodeType}) must implement a static clone method since its constructor has ${String(klass.length)} required arguments (expecting 0). Use an explicit default in the first argument of your constructor(prop: T=X, nodeKey?: NodeKey).`);
        }
      }
      klass.clone = (prevNode, internalSkipAfterCloneFrom) => {
        setPendingNodeToClone(prevNode);
        const node = new klass();
        if (internalSkipAfterCloneFrom !== INTERNAL_SKIP_AFTER_CLONE_FROM) {
          node.afterCloneFrom(prevNode);
        }
        return node;
      };
    }
    if (!hasOwnStaticMethod(klass, "importJSON")) {
      if (IS_UNOPTIMIZED_DEV_BUILD) {
        if (!(klass.length === 0)) {
          formatDevErrorMessage(`${klass.name} (type ${ownNodeType}) must implement a static importJSON method since its constructor has ${String(klass.length)} required arguments (expecting 0). Use an explicit default in the first argument of your constructor(prop: T=X, nodeKey?: NodeKey).`);
        }
      }
      klass.importJSON = ownNodeConfig && ownNodeConfig.$importJSON || ((serializedNode) => $create(klass).updateFromJSON(serializedNode));
    }
    if (!hasOwnStaticMethod(klass, "importDOM") && ownNodeConfig) {
      const {
        importDOM
      } = ownNodeConfig;
      if (importDOM) {
        klass.importDOM = () => importDOM;
      }
    }
  }
  const result = {
    klass,
    ownNodeConfig,
    ownNodeType
  };
  STATIC_NODE_CONFIG_CACHE.set(klass, result);
  return result;
}
function* iterStaticNodeConfigChain(klass) {
  for (let current = klass; current && (current === LexicalNode || $isLexicalNode(current.prototype)); ) {
    const config = getStaticNodeConfig(current);
    yield config;
    current = config.ownNodeConfig && config.ownNodeConfig.extends || getSuperclassOf(current);
  }
}
function getRegisteredSubtypeMap(nodes) {
  const subtypes = /* @__PURE__ */ new Map();
  const klassByType = /* @__PURE__ */ new Map();
  for (const klass of nodes) {
    const {
      ownNodeType
    } = getStaticNodeConfig(klass);
    if (ownNodeType) {
      klassByType.set(ownNodeType, klass);
      subtypes.set(ownNodeType, /* @__PURE__ */ new Set());
    }
  }
  for (const [type, klass] of klassByType) {
    for (const {
      ownNodeType
    } of iterStaticNodeConfigChain(klass)) {
      const bucket = ownNodeType && subtypes.get(ownNodeType);
      if (bucket) {
        bucket.add(type);
      }
    }
  }
  return subtypes;
}
function $create(klass) {
  const editor = $getEditor();
  errorOnReadOnly();
  const registeredNode = editor.resolveRegisteredNodeAfterReplacements(editor.getRegisteredNode(klass));
  const node = new registeredNode.klass();
  return registeredNode.replace === null ? node : $applyNodeReplacement(node);
}
var $findMatchingParent = (startingNode, findFn) => {
  let curr = startingNode;
  while (curr != null && !$isRootNode(curr)) {
    if (findFn(curr)) {
      return curr;
    }
    curr = curr.getParent();
  }
  return null;
};
function $createChildrenArray(element, nodeMap) {
  const children = [];
  let nodeKey = element.__first;
  while (nodeKey !== null) {
    const node = nodeMap === null ? $getNodeByKey(nodeKey) : nodeMap.get(nodeKey);
    if (node === null || node === void 0) {
      {
        formatDevErrorMessage(`$createChildrenArray: node does not exist in nodeMap`);
      }
    }
    children.push(nodeKey);
    nodeKey = node.__next;
  }
  return children;
}
function getSuperclassOf(klass) {
  const viaStatic = Object.getPrototypeOf(klass);
  if (typeof viaStatic === "function" && viaStatic !== Function.prototype) {
    return viaStatic;
  }
  const parentProto = klass.prototype && Object.getPrototypeOf(klass.prototype);
  return parentProto ? parentProto.constructor : null;
}
var EMPTY_SLOTS = /* @__PURE__ */ new Map();
function $isSlotHost(node) {
  return $isElementNode(node) || $isDecoratorNode(node);
}
function $isSlotChild(node) {
  return $isElementNode(node) || $isDecoratorNode(node);
}
function $getSlotHostKey(node) {
  const latest = node.getLatest();
  return $isSlotChild(latest) ? latest.__slotHost : null;
}
function $getSlotHost(node) {
  const slotHostKey = $getSlotHostKey(node);
  if (slotHostKey === null) {
    return null;
  }
  const host = $getNodeByKey(slotHostKey);
  if (!($isElementNode(host) || $isDecoratorNode(host))) {
    formatDevErrorMessage(`slotHost must be an ElementNode or a DecoratorNode`);
  }
  return host;
}
function $getSlotNameWithinHost(slotChild) {
  const host = $getSlotHost(slotChild);
  if (host === null) {
    return null;
  }
  const childKey = slotChild.getLatest().__key;
  for (const [name, key] of $getSlotMap(host)) {
    if (key === childKey) {
      return name;
    }
  }
  return null;
}
function $getSlotFrame(node) {
  let current = node.getLatest();
  while (current !== null) {
    if ($getSlotHostKey(current) !== null) {
      return current;
    }
    current = current.getParent();
  }
  return null;
}
function $getSelectionSlotFrame(selection) {
  if (selection === null) {
    return null;
  }
  const anchorNode = $isRangeSelection(selection) ? selection.anchor.getNode() : selection.getNodes()[0] ?? null;
  return anchorNode === null ? null : $getSlotFrame(anchorNode);
}
function $getSlotMap(node) {
  const latest = node.getLatest();
  return $isSlotHost(latest) && latest.__slots !== null ? latest.__slots : EMPTY_SLOTS;
}
function $getSlotNames(node) {
  return Array.from($getSlotMap(node).keys());
}
function $getSlot(node, name) {
  const key = $getSlotMap(node).get(name);
  return key === void 0 ? null : $getNodeByKey(key);
}
var RESERVED_SLOT_NAMES = ["__proto__", "constructor", "prototype"];
var SLOT_MAP_OWNER = /* @__PURE__ */ Symbol("slotMapOwner");
function $getWritableSlots(writableHost) {
  let slots = writableHost.__slots;
  if (slots === null || slots[SLOT_MAP_OWNER] !== writableHost) {
    slots = new Map(slots);
    slots[SLOT_MAP_OWNER] = writableHost;
    writableHost.__slots = slots;
  }
  return slots;
}
var slotRankCache = /* @__PURE__ */ new WeakMap();
var EMPTY_DECLARED_SLOTS = [];
function getDeclaredSlots(klass) {
  for (const {
    ownNodeConfig
  } of iterStaticNodeConfigChain(klass)) {
    const declared = ownNodeConfig && ownNodeConfig.slots;
    if (declared) {
      return declared;
    }
  }
  return EMPTY_DECLARED_SLOTS;
}
function $getSlotsTextContent(node) {
  let textContent = "";
  for (const name of $getSlotNames(node)) {
    const slot = $getSlot(node, name);
    if (slot !== null) {
      textContent += slot.getTextContent();
    }
  }
  return textContent;
}
function $getSlotsTextContentSize(node) {
  let textContentSize = 0;
  for (const name of $getSlotNames(node)) {
    const slot = $getSlot(node, name);
    if (slot !== null) {
      textContentSize += slot.getTextContentSize();
    }
  }
  return textContentSize;
}
function getDeclaredSlotRank(klass) {
  let rank = slotRankCache.get(klass);
  if (rank === void 0) {
    const declared = getDeclaredSlots(klass);
    const built = /* @__PURE__ */ new Map();
    for (const name of declared) {
      if (!!RESERVED_SLOT_NAMES.includes(name)) {
        formatDevErrorMessage(`getDeclaredSlotRank: ${klass.name} declares reserved slot name "${name}"; __proto__, constructor, and prototype break the plain-object serialization of slots`);
      }
      if (!!built.has(name)) {
        formatDevErrorMessage(`getDeclaredSlotRank: ${klass.name} declares slot name "${name}" more than once; the canonical order would be ambiguous`);
      }
      built.set(name, built.size);
    }
    rank = built;
    slotRankCache.set(klass, rank);
  }
  return rank;
}
function compareSlotNames(a2, b2, rank) {
  const rankA = rank.get(a2);
  const rankB = rank.get(b2);
  if (rankA !== void 0) {
    return rankB !== void 0 ? rankA - rankB : -1;
  }
  if (rankB !== void 0) {
    return 1;
  }
  return a2 < b2 ? -1 : a2 > b2 ? 1 : 0;
}
function $canonicalizeSlotOrder(host) {
  const slots = host.__slots;
  if (slots === null || slots.size < 2) {
    return;
  }
  const rank = getDeclaredSlotRank(host.constructor);
  let previous = null;
  let sorted = true;
  for (const name of slots.keys()) {
    if (previous !== null && compareSlotNames(previous, name, rank) > 0) {
      sorted = false;
      break;
    }
    previous = name;
  }
  if (sorted) {
    return;
  }
  const entries = Array.from(slots).sort(([a2], [b2]) => compareSlotNames(a2, b2, rank));
  slots.clear();
  for (const [name, key] of entries) {
    slots.set(name, key);
  }
}
function $setSlot(host, name, node) {
  if (!(name !== "__proto__" && name !== "constructor" && name !== "prototype")) {
    formatDevErrorMessage(`$setSlot: "${name}" is a reserved slot name; __proto__, constructor, and prototype break the plain-object serialization of slots`);
  }
  const latestHost = host.getLatest();
  if (latestHost.__slots !== null && latestHost.__slots.get(name) === node.getLatest().__key) {
    return latestHost;
  }
  if (!(($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline())) {
    formatDevErrorMessage(`$setSlot: node ${node.__key} is not a valid slot value; a slot value must be a non-inline ElementNode or DecoratorNode (the slot link itself is the shadow boundary).`);
  }
  {
    if (!!$isSlotAncestorOrSelf(node, host)) {
      formatDevErrorMessage(`$setSlot: node ${node.__key} cannot be slotted into ${host.__key}; a node may not host itself or an ancestor reached through children or slot up-links \u2014 the slot up-link would form a cycle that loops isAttached/GC.`);
    }
  }
  const writableSelf = host.getWritable();
  const slots = $getWritableSlots(writableSelf);
  const previousKey = slots.get(name);
  if (previousKey !== void 0) {
    $detachSlottedNode(previousKey);
  }
  const writableNode = node.getWritable();
  const previousHost = $getSlotHost(writableNode);
  if (previousHost !== null) {
    const previousName = $getSlotNameWithinHost(writableNode);
    if (previousName !== null) {
      $getWritableSlots(previousHost.getWritable()).delete(previousName);
    }
    writableNode.__slotHost = null;
  }
  $removeFromParent(writableNode);
  writableNode.__slotHost = writableSelf.__key;
  slots.set(name, writableNode.__key);
  $canonicalizeSlotOrder(writableSelf);
  $markSlotsUsed();
  return writableSelf;
}
function $removeSlot(host, name) {
  const writableSelf = host.getWritable();
  if (writableSelf.__slots === null) {
    return writableSelf;
  }
  const previousKey = writableSelf.__slots.get(name);
  if (previousKey !== void 0) {
    $detachSlottedNode(previousKey);
    $getWritableSlots(writableSelf).delete(name);
  }
  return writableSelf;
}
function $isSlotAncestorOrSelf(node, host) {
  let key = host.__key;
  while (key !== null) {
    if (key === node.__key) {
      return true;
    }
    const current = $getNodeByKey(key);
    if (current === null) {
      break;
    }
    key = current.__parent !== null ? current.__parent : $getSlotHostKey(current);
  }
  return false;
}
function $errorOnSlotCycleChild(parent, child) {
  if (!$getEditor()._slotsUsed) {
    return;
  }
  if (!!$isSlotAncestorOrSelf(child, parent)) {
    formatDevErrorMessage(`insert: node ${child.__key} cannot become a child of ${parent.__key}; the parent is reachable from the node through slot up-links, so the insertion would form a cycle that loops isAttached/GC.`);
  }
}
function $detachSlottedNode(slotKey) {
  const previous = $getNodeByKey(slotKey);
  if (previous === null) {
    return;
  }
  const writablePrevious = previous.getWritable();
  if (!$isSlotChild(writablePrevious)) {
    formatDevErrorMessage(`detach: slotted node ${slotKey} must be an ElementNode or a DecoratorNode`);
  }
  writablePrevious.__slotHost = null;
  writablePrevious.remove();
}
var FLIP_DIRECTION = {
  next: "previous",
  previous: "next"
};
var AbstractCaret = class {
  origin;
  constructor(origin) {
    this.origin = origin;
  }
  [Symbol.iterator]() {
    return makeStepwiseIterator({
      hasNext: $isSiblingCaret,
      initial: this.getAdjacentCaret(),
      map: (caret) => caret,
      step: (caret) => caret.getAdjacentCaret()
    });
  }
  getAdjacentCaret() {
    return $getSiblingCaret(this.getNodeAtCaret(), this.direction);
  }
  getSiblingCaret() {
    return $getSiblingCaret(this.origin, this.direction);
  }
  remove() {
    const node = this.getNodeAtCaret();
    if (node) {
      node.remove();
    }
    return this;
  }
  replaceOrInsert(node, includeChildren) {
    const target = this.getNodeAtCaret();
    if (node.is(this.origin) || node.is(target)) ;
    else if (target === null) {
      this.insert(node);
    } else {
      target.replace(node, includeChildren);
    }
    return this;
  }
  splice(deleteCount, nodes, nodesDirection = "next") {
    const nodeIter = nodesDirection === this.direction ? nodes : Array.from(nodes).reverse();
    let caret = this;
    const parent = this.getParentAtCaret();
    const nodesToRemove = /* @__PURE__ */ new Map();
    for (let removeCaret = caret.getAdjacentCaret(); removeCaret !== null && nodesToRemove.size < deleteCount; removeCaret = removeCaret.getAdjacentCaret()) {
      const writableNode = removeCaret.origin.getWritable();
      nodesToRemove.set(writableNode.getKey(), writableNode);
    }
    for (const node of nodeIter) {
      if (nodesToRemove.size > 0) {
        const target = caret.getNodeAtCaret();
        if (target) {
          nodesToRemove.delete(target.getKey());
          nodesToRemove.delete(node.getKey());
          if (target.is(node) || caret.origin.is(node)) ;
          else {
            const nodeParent = node.getParent();
            if (nodeParent && nodeParent.is(parent)) {
              node.remove();
            }
            target.replace(node);
          }
        } else {
          if (!(target !== null)) {
            formatDevErrorMessage(`NodeCaret.splice: Underflow of expected nodesToRemove during splice (keys: ${Array.from(nodesToRemove).join(" ")})`);
          }
        }
      } else {
        caret.insert(node);
      }
      caret = $getSiblingCaret(node, this.direction);
    }
    for (const node of nodesToRemove.values()) {
      node.remove();
    }
    return this;
  }
};
var AbstractChildCaret = class _AbstractChildCaret extends AbstractCaret {
  type = "child";
  getLatest() {
    const origin = this.origin.getLatest();
    return origin === this.origin ? this : $getChildCaret(origin, this.direction);
  }
  /**
   * Get the SiblingCaret from this origin in the same direction.
   *
   * @param mode 'root' to return null at the root, 'shadowRoot' to return null at the root or any shadow root
   * @returns A SiblingCaret with this origin, or null if origin is a root according to mode.
   */
  getParentCaret(mode = "root") {
    return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
  }
  getFlipped() {
    const dir = flipDirection(this.direction);
    return $getSiblingCaret(this.getNodeAtCaret(), dir) || $getChildCaret(this.origin, dir);
  }
  getParentAtCaret() {
    return this.origin;
  }
  getChildCaret() {
    return this;
  }
  isSameNodeCaret(other) {
    return other instanceof _AbstractChildCaret && this.direction === other.direction && this.origin.is(other.origin);
  }
  isSamePointCaret(other) {
    return this.isSameNodeCaret(other);
  }
};
var ChildCaretFirst = class extends AbstractChildCaret {
  direction = "next";
  getNodeAtCaret() {
    return this.origin.getFirstChild();
  }
  insert(node) {
    this.origin.splice(0, 0, [node]);
    return this;
  }
};
var ChildCaretLast = class extends AbstractChildCaret {
  direction = "previous";
  getNodeAtCaret() {
    return this.origin.getLastChild();
  }
  insert(node) {
    this.origin.splice(this.origin.getChildrenSize(), 0, [node]);
    return this;
  }
};
var MODE_PREDICATE = {
  root: $isRootNode,
  shadowRoot: $isRootOrShadowRoot
};
function flipDirection(direction) {
  return FLIP_DIRECTION[direction];
}
function $filterByMode(node, mode = "root") {
  if (node === null || MODE_PREDICATE[mode](node)) {
    return null;
  }
  return $getSlotHostKey(node) === null ? node : null;
}
var AbstractSiblingCaret = class _AbstractSiblingCaret extends AbstractCaret {
  type = "sibling";
  getLatest() {
    const origin = this.origin.getLatest();
    return origin === this.origin ? this : $getSiblingCaret(origin, this.direction);
  }
  getSiblingCaret() {
    return this;
  }
  getParentAtCaret() {
    return this.origin.getParent();
  }
  getChildCaret() {
    return $isElementNode(this.origin) ? $getChildCaret(this.origin, this.direction) : null;
  }
  getParentCaret(mode = "root") {
    return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
  }
  getFlipped() {
    const dir = flipDirection(this.direction);
    return $getSiblingCaret(this.getNodeAtCaret(), dir) || $getChildCaret(this.origin.getParentOrThrow(), dir);
  }
  isSamePointCaret(other) {
    return other instanceof _AbstractSiblingCaret && this.direction === other.direction && this.origin.is(other.origin);
  }
  isSameNodeCaret(other) {
    return (other instanceof _AbstractSiblingCaret || other instanceof AbstractTextPointCaret) && this.direction === other.direction && this.origin.is(other.origin);
  }
};
var AbstractTextPointCaret = class _AbstractTextPointCaret extends AbstractCaret {
  type = "text";
  offset;
  constructor(origin, offset) {
    super(origin);
    this.offset = offset;
  }
  getLatest() {
    const origin = this.origin.getLatest();
    return origin === this.origin ? this : $getTextPointCaret(origin, this.direction, this.offset);
  }
  getParentAtCaret() {
    return this.origin.getParent();
  }
  getChildCaret() {
    return null;
  }
  getParentCaret(mode = "root") {
    return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
  }
  getFlipped() {
    return $getTextPointCaret(this.origin, flipDirection(this.direction), this.offset);
  }
  isSamePointCaret(other) {
    return other instanceof _AbstractTextPointCaret && this.direction === other.direction && this.origin.is(other.origin) && this.offset === other.offset;
  }
  isSameNodeCaret(other) {
    return (other instanceof AbstractSiblingCaret || other instanceof _AbstractTextPointCaret) && this.direction === other.direction && this.origin.is(other.origin);
  }
  getSiblingCaret() {
    return $getSiblingCaret(this.origin, this.direction);
  }
};
function $isTextPointCaret(caret) {
  return caret instanceof AbstractTextPointCaret;
}
function $isNodeCaret(caret) {
  return caret instanceof AbstractCaret;
}
function $isSiblingCaret(caret) {
  return caret instanceof AbstractSiblingCaret;
}
function $isChildCaret(caret) {
  return caret instanceof AbstractChildCaret;
}
var SiblingCaretNext = class extends AbstractSiblingCaret {
  direction = "next";
  getNodeAtCaret() {
    return this.origin.getNextSibling();
  }
  insert(node) {
    this.origin.insertAfter(node);
    return this;
  }
};
var SiblingCaretPrevious = class extends AbstractSiblingCaret {
  direction = "previous";
  getNodeAtCaret() {
    return this.origin.getPreviousSibling();
  }
  insert(node) {
    this.origin.insertBefore(node);
    return this;
  }
};
var TextPointCaretNext = class extends AbstractTextPointCaret {
  direction = "next";
  getNodeAtCaret() {
    return this.origin.getNextSibling();
  }
  insert(node) {
    this.origin.insertAfter(node);
    return this;
  }
};
var TextPointCaretPrevious = class extends AbstractTextPointCaret {
  direction = "previous";
  getNodeAtCaret() {
    return this.origin.getPreviousSibling();
  }
  insert(node) {
    this.origin.insertBefore(node);
    return this;
  }
};
var TEXT_CTOR = {
  next: TextPointCaretNext,
  previous: TextPointCaretPrevious
};
var SIBLING_CTOR = {
  next: SiblingCaretNext,
  previous: SiblingCaretPrevious
};
var CHILD_CTOR = {
  next: ChildCaretFirst,
  previous: ChildCaretLast
};
function $getSiblingCaret(origin, direction) {
  return origin ? new SIBLING_CTOR[direction](origin) : null;
}
function $getTextPointCaret(origin, direction, offset) {
  return origin ? new TEXT_CTOR[direction](origin, $getTextNodeOffset(origin, offset)) : null;
}
function $getTextNodeOffset(origin, offset, mode = "error") {
  const size = origin.getTextContentSize();
  let numericOffset = offset === "next" ? size : offset === "previous" ? 0 : offset;
  if (numericOffset < 0 || numericOffset > size) {
    if (!(mode === "clamp")) {
      formatDevErrorMessage(`$getTextNodeOffset: invalid offset ${String(offset)} for size ${String(size)} at key ${origin.getKey()}`);
    }
    numericOffset = numericOffset < 0 ? 0 : size;
  }
  return numericOffset;
}
function $getTextPointCaretSlice(caret, distance) {
  return new TextPointCaretSliceImpl(caret, distance);
}
function $getChildCaret(origin, direction) {
  return $isElementNode(origin) ? new CHILD_CTOR[direction](origin) : null;
}
function $getChildCaretOrSelf(caret) {
  return caret && caret.getChildCaret() || caret;
}
function $getAdjacentChildCaret(caret) {
  return caret && $getChildCaretOrSelf(caret.getAdjacentCaret());
}
var CaretRangeImpl = class _CaretRangeImpl {
  type = "node-caret-range";
  direction;
  anchor;
  focus;
  constructor(anchor, focus, direction) {
    this.anchor = anchor;
    this.focus = focus;
    this.direction = direction;
  }
  getLatest() {
    const anchor = this.anchor.getLatest();
    const focus = this.focus.getLatest();
    return anchor === this.anchor && focus === this.focus ? this : new _CaretRangeImpl(anchor, focus, this.direction);
  }
  isCollapsed() {
    return this.anchor.isSamePointCaret(this.focus);
  }
  getTextSlices() {
    const getSlice = (k) => {
      const caret = this[k].getLatest();
      return $isTextPointCaret(caret) ? $getSliceFromTextPointCaret(caret, k) : null;
    };
    const anchorSlice = getSlice("anchor");
    const focusSlice = getSlice("focus");
    if (anchorSlice && focusSlice) {
      const {
        caret: anchorCaret
      } = anchorSlice;
      const {
        caret: focusCaret
      } = focusSlice;
      if (anchorCaret.isSameNodeCaret(focusCaret)) {
        return [$getTextPointCaretSlice(anchorCaret, focusCaret.offset - anchorCaret.offset), null];
      }
    }
    return [anchorSlice, focusSlice];
  }
  iterNodeCarets(rootMode = "root") {
    const anchor = $isTextPointCaret(this.anchor) ? this.anchor.getSiblingCaret() : this.anchor.getLatest();
    const focus = this.focus.getLatest();
    const isTextFocus = $isTextPointCaret(focus);
    const step = (state) => state.isSameNodeCaret(focus) ? null : $getAdjacentChildCaret(state) || state.getParentCaret(rootMode);
    return makeStepwiseIterator({
      hasNext: (state) => state !== null && !(isTextFocus && focus.isSameNodeCaret(state)),
      initial: anchor.isSameNodeCaret(focus) ? null : step(anchor),
      map: (state) => state,
      step
    });
  }
  [Symbol.iterator]() {
    return this.iterNodeCarets("root");
  }
};
var TextPointCaretSliceImpl = class {
  type = "slice";
  caret;
  distance;
  constructor(caret, distance) {
    this.caret = caret;
    this.distance = distance;
  }
  getSliceIndices() {
    const {
      distance,
      caret: {
        offset
      }
    } = this;
    const offsetB = offset + distance;
    return offsetB < offset ? [offsetB, offset] : [offset, offsetB];
  }
  getTextContent() {
    const [startIndex, endIndex] = this.getSliceIndices();
    return this.caret.origin.getTextContent().slice(startIndex, endIndex);
  }
  getTextContentSize() {
    return Math.abs(this.distance);
  }
  removeTextSlice() {
    const {
      caret: {
        origin,
        direction
      }
    } = this;
    const [indexStart, indexEnd] = this.getSliceIndices();
    const text = origin.getTextContent();
    return $getTextPointCaret(origin.setTextContent(text.slice(0, indexStart) + text.slice(indexEnd)), direction, indexStart);
  }
};
function $getSliceFromTextPointCaret(caret, anchorOrFocus) {
  const {
    direction,
    origin
  } = caret;
  const offsetB = $getTextNodeOffset(origin, anchorOrFocus === "focus" ? flipDirection(direction) : direction);
  return $getTextPointCaretSlice(caret, offsetB - caret.offset);
}
function $isTextPointCaretSlice(caretOrSlice) {
  return caretOrSlice instanceof TextPointCaretSliceImpl;
}
function $getCaretInDirection(caret, direction) {
  return caret.direction === direction ? caret : caret.getFlipped();
}
function $extendCaretToRange(anchor) {
  return $getCaretRange(anchor, $getCaretInDirection($getChildCaret($getRoot(), flipDirection(anchor.direction)), anchor.direction));
}
function $getCollapsedCaretRange(anchor) {
  return $getCaretRange(anchor, anchor);
}
function $getCaretRange(anchor, focus) {
  if (!(anchor.direction === focus.direction)) {
    formatDevErrorMessage(`$getCaretRange: anchor and focus must be in the same direction`);
  }
  return new CaretRangeImpl(anchor, focus, anchor.direction);
}
function makeStepwiseIterator(config) {
  const {
    initial,
    hasNext,
    step,
    map
  } = config;
  let state = initial;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (!hasNext(state)) {
        return {
          done: true,
          value: void 0
        };
      }
      const rval = {
        done: false,
        value: map(state)
      };
      state = step(state);
      return rval;
    }
  };
}
function compareNumber(a2, b2) {
  return Math.sign(a2 - b2);
}
function $comparePointCaretNext(a2, b2) {
  const compare = $getCommonAncestor(a2.origin, b2.origin);
  if (!(compare !== null)) {
    formatDevErrorMessage(`$comparePointCaretNext: a (key ${a2.origin.getKey()}) and b (key ${b2.origin.getKey()}) do not have a common ancestor`);
  }
  switch (compare.type) {
    case "same": {
      const aIsText = a2.type === "text";
      const bIsText = b2.type === "text";
      return aIsText && bIsText ? compareNumber(a2.offset, b2.offset) : a2.type === b2.type ? 0 : aIsText ? -1 : bIsText ? 1 : a2.type === "child" ? -1 : 1;
    }
    case "ancestor": {
      return a2.type === "child" ? -1 : 1;
    }
    case "descendant": {
      return b2.type === "child" ? 1 : -1;
    }
    case "branch": {
      return $getCommonAncestorResultBranchOrder(compare);
    }
  }
}
function $getCommonAncestorResultBranchOrder(compare) {
  const {
    a: a2,
    b: b2
  } = compare;
  const aKey = a2.__key;
  const bKey = b2.__key;
  let na = a2;
  let nb = b2;
  for (; na && nb; na = na.getNextSibling(), nb = nb.getNextSibling()) {
    if (na.__key === bKey) {
      return -1;
    } else if (nb.__key === aKey) {
      return 1;
    }
  }
  return na === null ? 1 : -1;
}
function $isSameNode(reference, other) {
  return other.is(reference);
}
function $initialElementTuple(node) {
  return $isElementNode(node) ? [node.getLatest(), null] : [node.getParent(), node.getLatest()];
}
function $getCommonAncestor(a2, b2) {
  if (a2.is(b2)) {
    return {
      commonAncestor: a2,
      type: "same"
    };
  }
  const aMap = /* @__PURE__ */ new Map();
  for (let [parent, child] = $initialElementTuple(a2); parent; child = parent, parent = parent.getParent()) {
    aMap.set(parent, child);
  }
  for (let [parent, child] = $initialElementTuple(b2); parent; child = parent, parent = parent.getParent()) {
    const aChild = aMap.get(parent);
    if (aChild === void 0) ;
    else if (aChild === null) {
      if (!$isSameNode(a2, parent)) {
        formatDevErrorMessage(`$originComparison: ancestor logic error`);
      }
      return {
        commonAncestor: parent,
        type: "ancestor"
      };
    } else if (child === null) {
      if (!$isSameNode(b2, parent)) {
        formatDevErrorMessage(`$originComparison: descendant logic error`);
      }
      return {
        commonAncestor: parent,
        type: "descendant"
      };
    } else {
      if (!(($isElementNode(aChild) || $isSameNode(a2, aChild)) && ($isElementNode(child) || $isSameNode(b2, child)) && parent.is(aChild.getParent()) && parent.is(child.getParent()))) {
        formatDevErrorMessage(`$originComparison: branch logic error`);
      }
      return {
        a: aChild,
        b: child,
        commonAncestor: parent,
        type: "branch"
      };
    }
  }
  return null;
}
// @__NO_SIDE_EFFECTS__
function defineExtension(extension) {
  return extension;
}
// @__NO_SIDE_EFFECTS__
function configExtension(...args) {
  return args;
}
// @__NO_SIDE_EFFECTS__
function declarePeerDependency(...args) {
  return args;
}
// @__NO_SIDE_EFFECTS__
function safeCast(value) {
  return value;
}
function shallowMergeConfig(config, overrides) {
  if (!overrides || config === overrides) {
    return config;
  }
  for (const k in overrides) {
    if (config[k] !== overrides[k]) {
      return {
        ...config,
        ...overrides
      };
    }
  }
  return config;
}
function normalizeClassNames(...classNames) {
  const rval = [];
  for (const className of classNames) {
    if (className && typeof className === "string") {
      for (const [s2] of className.matchAll(/\S+/g)) {
        rval.push(s2);
      }
    }
  }
  return rval;
}
function addClassNamesToElement(element, ...classNames) {
  const classesToAdd = normalizeClassNames(...classNames);
  if (classesToAdd.length > 0) {
    element.classList.add(...classesToAdd);
  }
}
function removeClassNamesFromElement(element, ...classNames) {
  const classesToRemove = normalizeClassNames(...classNames);
  if (classesToRemove.length > 0) {
    element.classList.remove(...classesToRemove);
  }
}
function mergeRegister(...func) {
  return () => {
    for (let i2 = func.length - 1; i2 >= 0; i2--) {
      func[i2]();
    }
    func.length = 0;
  };
}
function registerEventListeners(target, listeners, options) {
  const entries = Object.entries(listeners);
  return mergeRegister(...entries.map(([type, listener]) => registerEventListener(target, type, listener, options)));
}

// node_modules/lexical/dist/Lexical.mjs
var mod = true ? Lexical_dev_exports : Lexical_prod_exports;
var $addUpdateTag2 = mod.$addUpdateTag;
var $applyNodeReplacement2 = mod.$applyNodeReplacement;
var $assumeActiveEditor2 = mod.$assumeActiveEditor;
var $caretFromPoint2 = mod.$caretFromPoint;
var $caretRangeFromSelection2 = mod.$caretRangeFromSelection;
var $cloneWithProperties2 = mod.$cloneWithProperties;
var $cloneWithPropertiesEphemeral2 = mod.$cloneWithPropertiesEphemeral;
var $comparePointCaretNext2 = mod.$comparePointCaretNext;
var $copyNode2 = mod.$copyNode;
var $create2 = mod.$create;
var $createChildrenArray2 = mod.$createChildrenArray;
var $createLineBreakNode2 = mod.$createLineBreakNode;
var $createNodeSelection2 = mod.$createNodeSelection;
var $createParagraphNode2 = mod.$createParagraphNode;
var $createPoint2 = mod.$createPoint;
var $createRangeSelection2 = mod.$createRangeSelection;
var $createRangeSelectionFromDom2 = mod.$createRangeSelectionFromDom;
var $createTabNode2 = mod.$createTabNode;
var $createTextNode2 = mod.$createTextNode;
var $extendCaretToRange2 = mod.$extendCaretToRange;
var $findMatchingParent2 = mod.$findMatchingParent;
var $flushSyncAfterUpdate2 = mod.$flushSyncAfterUpdate;
var $formatText2 = mod.$formatText;
var $fullReconcile2 = mod.$fullReconcile;
var $generateNodesFromRawText2 = mod.$generateNodesFromRawText;
var $getAdjacentChildCaret2 = mod.$getAdjacentChildCaret;
var $getAdjacentNode2 = mod.$getAdjacentNode;
var $getAdjacentSiblingOrParentSiblingCaret2 = mod.$getAdjacentSiblingOrParentSiblingCaret;
var $getCaretInDirection2 = mod.$getCaretInDirection;
var $getCaretRange2 = mod.$getCaretRange;
var $getCaretRangeInDirection2 = mod.$getCaretRangeInDirection;
var $getCharacterOffsets2 = mod.$getCharacterOffsets;
var $getChildCaret2 = mod.$getChildCaret;
var $getChildCaretAtIndex2 = mod.$getChildCaretAtIndex;
var $getChildCaretOrSelf2 = mod.$getChildCaretOrSelf;
var $getCollapsedCaretRange2 = mod.$getCollapsedCaretRange;
var $getCommonAncestor2 = mod.$getCommonAncestor;
var $getCommonAncestorResultBranchOrder2 = mod.$getCommonAncestorResultBranchOrder;
var $getDOMSlot2 = mod.$getDOMSlot;
var $getDOMTextNode2 = mod.$getDOMTextNode;
var $getDocument2 = mod.$getDocument;
var $getEditor2 = mod.$getEditor;
var $getEditorDOMRenderConfig2 = mod.$getEditorDOMRenderConfig;
var $getNearestNodeFromDOMNode2 = mod.$getNearestNodeFromDOMNode;
var $getNearestRootOrShadowRoot2 = mod.$getNearestRootOrShadowRoot;
var $getNodeByKey2 = mod.$getNodeByKey;
var $getNodeByKeyOrThrow2 = mod.$getNodeByKeyOrThrow;
var $getNodeFromDOMNode2 = mod.$getNodeFromDOMNode;
var $getPreviousSelection2 = mod.$getPreviousSelection;
var $getRoot2 = mod.$getRoot;
var $getSelection2 = mod.$getSelection;
var $getSelectionSlotFrame2 = mod.$getSelectionSlotFrame;
var $getSiblingCaret2 = mod.$getSiblingCaret;
var $getSlot2 = mod.$getSlot;
var $getSlotFrame2 = mod.$getSlotFrame;
var $getSlotHost2 = mod.$getSlotHost;
var $getSlotNameWithinHost2 = mod.$getSlotNameWithinHost;
var $getSlotNames2 = mod.$getSlotNames;
var $getState2 = mod.$getState;
var $getStateChange2 = mod.$getStateChange;
var $getTextContent2 = mod.$getTextContent;
var $getTextNodeOffset2 = mod.$getTextNodeOffset;
var $getTextPointCaret2 = mod.$getTextPointCaret;
var $getTextPointCaretSlice2 = mod.$getTextPointCaretSlice;
var $getWritableNodeState2 = mod.$getWritableNodeState;
var $hasAncestor2 = mod.$hasAncestor;
var $hasUpdateTag2 = mod.$hasUpdateTag;
var $insertNodeToNearestRootAtCaret2 = mod.$insertNodeToNearestRootAtCaret;
var $insertNodes2 = mod.$insertNodes;
var $isBlockElementNode2 = mod.$isBlockElementNode;
var $isBlockFullySelected2 = mod.$isBlockFullySelected;
var $isChildCaret2 = mod.$isChildCaret;
var $isDecoratorNode2 = mod.$isDecoratorNode;
var $isEditorState2 = mod.$isEditorState;
var $isElementDOMSlot2 = mod.$isElementDOMSlot;
var $isElementNode2 = mod.$isElementNode;
var $isExtendableTextPointCaret2 = mod.$isExtendableTextPointCaret;
var $isInlineElementOrDecoratorNode2 = mod.$isInlineElementOrDecoratorNode;
var $isInlineFormattable2 = mod.$isInlineFormattable;
var $isLeafNode2 = mod.$isLeafNode;
var $isLexicalNode2 = mod.$isLexicalNode;
var $isLineBreakNode2 = mod.$isLineBreakNode;
var $isNodeCaret2 = mod.$isNodeCaret;
var $isNodeSelection2 = mod.$isNodeSelection;
var $isParagraphNode2 = mod.$isParagraphNode;
var $isRangeSelection2 = mod.$isRangeSelection;
var $isRootNode2 = mod.$isRootNode;
var $isRootOrShadowRoot2 = mod.$isRootOrShadowRoot;
var $isSelectionCapturedInDecoratorInput2 = mod.$isSelectionCapturedInDecoratorInput;
var $isShadowRootNode2 = mod.$isShadowRootNode;
var $isSiblingCaret2 = mod.$isSiblingCaret;
var $isSlotChild2 = mod.$isSlotChild;
var $isSlotHost2 = mod.$isSlotHost;
var $isTabNode2 = mod.$isTabNode;
var $isTextNode2 = mod.$isTextNode;
var $isTextPointCaret2 = mod.$isTextPointCaret;
var $isTextPointCaretSlice2 = mod.$isTextPointCaretSlice;
var $isTokenOrSegmented2 = mod.$isTokenOrSegmented;
var $isTokenOrTab2 = mod.$isTokenOrTab;
var $markSlotEditable2 = mod.$markSlotEditable;
var $needsBlockCursorBeside2 = mod.$needsBlockCursorBeside;
var $nodesOfType2 = mod.$nodesOfType;
var $normalizeCaret2 = mod.$normalizeCaret;
var $normalizeSelection__EXPERIMENTAL = mod.$normalizeSelection__EXPERIMENTAL;
var $onUpdate2 = mod.$onUpdate;
var $parseSerializedNode2 = mod.$parseSerializedNode;
var $removeFromParent2 = mod.$removeFromParent;
var $removeSlot2 = mod.$removeSlot;
var $removeTextFromCaretRange2 = mod.$removeTextFromCaretRange;
var $rewindSiblingCaret2 = mod.$rewindSiblingCaret;
var $selectAll2 = mod.$selectAll;
var $setCompositionKey2 = mod.$setCompositionKey;
var $setDirectionFromDOM2 = mod.$setDirectionFromDOM;
var $setFormatFromDOM2 = mod.$setFormatFromDOM;
var $setPointFromCaret2 = mod.$setPointFromCaret;
var $setSelection2 = mod.$setSelection;
var $setSelectionFromCaretRange2 = mod.$setSelectionFromCaretRange;
var $setSlot2 = mod.$setSlot;
var $setState2 = mod.$setState;
var $setTextFormat2 = mod.$setTextFormat;
var $splitAtPointCaretNext2 = mod.$splitAtPointCaretNext;
var $splitNode2 = mod.$splitNode;
var $updateDOMSelection2 = mod.$updateDOMSelection;
var $updateRangeSelectionFromCaretRange2 = mod.$updateRangeSelectionFromCaretRange;
var ArtificialNode__DO_NOT_USE2 = mod.ArtificialNode__DO_NOT_USE;
var BEFORE_INPUT_COMMAND2 = mod.BEFORE_INPUT_COMMAND;
var BLUR_COMMAND2 = mod.BLUR_COMMAND;
var CAN_REDO_COMMAND2 = mod.CAN_REDO_COMMAND;
var CAN_UNDO_COMMAND2 = mod.CAN_UNDO_COMMAND;
var CAN_USE_BEFORE_INPUT2 = mod.CAN_USE_BEFORE_INPUT;
var CAN_USE_DOM2 = mod.CAN_USE_DOM;
var CLEAR_EDITOR_COMMAND2 = mod.CLEAR_EDITOR_COMMAND;
var CLEAR_HISTORY_COMMAND2 = mod.CLEAR_HISTORY_COMMAND;
var CLICK_COMMAND2 = mod.CLICK_COMMAND;
var COLLABORATION_TAG2 = mod.COLLABORATION_TAG;
var COMMAND_PRIORITY_BEFORE_CRITICAL2 = mod.COMMAND_PRIORITY_BEFORE_CRITICAL;
var COMMAND_PRIORITY_BEFORE_EDITOR2 = mod.COMMAND_PRIORITY_BEFORE_EDITOR;
var COMMAND_PRIORITY_BEFORE_HIGH2 = mod.COMMAND_PRIORITY_BEFORE_HIGH;
var COMMAND_PRIORITY_BEFORE_LOW2 = mod.COMMAND_PRIORITY_BEFORE_LOW;
var COMMAND_PRIORITY_BEFORE_NORMAL2 = mod.COMMAND_PRIORITY_BEFORE_NORMAL;
var COMMAND_PRIORITY_CRITICAL2 = mod.COMMAND_PRIORITY_CRITICAL;
var COMMAND_PRIORITY_EDITOR2 = mod.COMMAND_PRIORITY_EDITOR;
var COMMAND_PRIORITY_HIGH2 = mod.COMMAND_PRIORITY_HIGH;
var COMMAND_PRIORITY_LOW2 = mod.COMMAND_PRIORITY_LOW;
var COMMAND_PRIORITY_NORMAL2 = mod.COMMAND_PRIORITY_NORMAL;
var COMPOSITION_END_COMMAND2 = mod.COMPOSITION_END_COMMAND;
var COMPOSITION_END_TAG2 = mod.COMPOSITION_END_TAG;
var COMPOSITION_START_COMMAND2 = mod.COMPOSITION_START_COMMAND;
var COMPOSITION_START_TAG2 = mod.COMPOSITION_START_TAG;
var CONTROLLED_TEXT_INSERTION_COMMAND2 = mod.CONTROLLED_TEXT_INSERTION_COMMAND;
var CONTROL_OR_ALT2 = mod.CONTROL_OR_ALT;
var CONTROL_OR_META2 = mod.CONTROL_OR_META;
var CONTROL_OR_OTHER_KEY2 = mod.CONTROL_OR_OTHER_KEY;
var COPY_COMMAND2 = mod.COPY_COMMAND;
var CUT_COMMAND2 = mod.CUT_COMMAND;
var CUT_TAG2 = mod.CUT_TAG;
var DEFAULT_EDITOR_DOM_CONFIG2 = mod.DEFAULT_EDITOR_DOM_CONFIG;
var DELETE_CHARACTER_COMMAND2 = mod.DELETE_CHARACTER_COMMAND;
var DELETE_LINE_COMMAND2 = mod.DELETE_LINE_COMMAND;
var DELETE_WORD_COMMAND2 = mod.DELETE_WORD_COMMAND;
var DRAGEND_COMMAND2 = mod.DRAGEND_COMMAND;
var DRAGOVER_COMMAND2 = mod.DRAGOVER_COMMAND;
var DRAGSTART_COMMAND2 = mod.DRAGSTART_COMMAND;
var DROP_COMMAND2 = mod.DROP_COMMAND;
var DecoratorNode2 = mod.DecoratorNode;
var ElementNode2 = mod.ElementNode;
var FOCUS_COMMAND2 = mod.FOCUS_COMMAND;
var FORMAT_ELEMENT_COMMAND2 = mod.FORMAT_ELEMENT_COMMAND;
var FORMAT_TEXT_COMMAND2 = mod.FORMAT_TEXT_COMMAND;
var HISTORIC_TAG2 = mod.HISTORIC_TAG;
var HISTORY_MERGE_TAG2 = mod.HISTORY_MERGE_TAG;
var HISTORY_PUSH_TAG2 = mod.HISTORY_PUSH_TAG;
var INDENT_CONTENT_COMMAND2 = mod.INDENT_CONTENT_COMMAND;
var INPUT_COMMAND2 = mod.INPUT_COMMAND;
var INSERT_LINE_BREAK_COMMAND2 = mod.INSERT_LINE_BREAK_COMMAND;
var INSERT_PARAGRAPH_COMMAND2 = mod.INSERT_PARAGRAPH_COMMAND;
var INSERT_TAB_COMMAND2 = mod.INSERT_TAB_COMMAND;
var INTERNAL_$expandSelectionToWholeDocument2 = mod.INTERNAL_$expandSelectionToWholeDocument;
var INTERNAL_$isBlock2 = mod.INTERNAL_$isBlock;
var IS_ALL_FORMATTING2 = mod.IS_ALL_FORMATTING;
var IS_ANDROID2 = mod.IS_ANDROID;
var IS_ANDROID_CHROME2 = mod.IS_ANDROID_CHROME;
var IS_APPLE2 = mod.IS_APPLE;
var IS_APPLE_WEBKIT2 = mod.IS_APPLE_WEBKIT;
var IS_BOLD2 = mod.IS_BOLD;
var IS_CHROME2 = mod.IS_CHROME;
var IS_CODE2 = mod.IS_CODE;
var IS_FIREFOX2 = mod.IS_FIREFOX;
var IS_HIGHLIGHT2 = mod.IS_HIGHLIGHT;
var IS_IOS2 = mod.IS_IOS;
var IS_ITALIC2 = mod.IS_ITALIC;
var IS_SAFARI2 = mod.IS_SAFARI;
var IS_STRIKETHROUGH2 = mod.IS_STRIKETHROUGH;
var IS_SUBSCRIPT2 = mod.IS_SUBSCRIPT;
var IS_SUPERSCRIPT2 = mod.IS_SUPERSCRIPT;
var IS_UNDERLINE2 = mod.IS_UNDERLINE;
var KEY_ARROW_DOWN_COMMAND2 = mod.KEY_ARROW_DOWN_COMMAND;
var KEY_ARROW_LEFT_COMMAND2 = mod.KEY_ARROW_LEFT_COMMAND;
var KEY_ARROW_RIGHT_COMMAND2 = mod.KEY_ARROW_RIGHT_COMMAND;
var KEY_ARROW_UP_COMMAND2 = mod.KEY_ARROW_UP_COMMAND;
var KEY_BACKSPACE_COMMAND2 = mod.KEY_BACKSPACE_COMMAND;
var KEY_DELETE_COMMAND2 = mod.KEY_DELETE_COMMAND;
var KEY_DOWN_COMMAND2 = mod.KEY_DOWN_COMMAND;
var KEY_ENTER_COMMAND2 = mod.KEY_ENTER_COMMAND;
var KEY_ESCAPE_COMMAND2 = mod.KEY_ESCAPE_COMMAND;
var KEY_MODIFIER_COMMAND2 = mod.KEY_MODIFIER_COMMAND;
var KEY_SPACE_COMMAND2 = mod.KEY_SPACE_COMMAND;
var KEY_TAB_COMMAND2 = mod.KEY_TAB_COMMAND;
var LineBreakNode2 = mod.LineBreakNode;
var MOVE_TO_END2 = mod.MOVE_TO_END;
var MOVE_TO_START2 = mod.MOVE_TO_START;
var NODE_STATE_DIRECT2 = mod.NODE_STATE_DIRECT;
var NODE_STATE_KEY2 = mod.NODE_STATE_KEY;
var NODE_STATE_LATEST2 = mod.NODE_STATE_LATEST;
var OUTDENT_CONTENT_COMMAND2 = mod.OUTDENT_CONTENT_COMMAND;
var PASTE_COMMAND2 = mod.PASTE_COMMAND;
var PASTE_TAG2 = mod.PASTE_TAG;
var ParagraphNode2 = mod.ParagraphNode;
var REDO_COMMAND2 = mod.REDO_COMMAND;
var REMOVE_TEXT_COMMAND2 = mod.REMOVE_TEXT_COMMAND;
var RootNode2 = mod.RootNode;
var SELECTION_CHANGE_COMMAND2 = mod.SELECTION_CHANGE_COMMAND;
var SELECTION_INSERT_CLIPBOARD_NODES_COMMAND2 = mod.SELECTION_INSERT_CLIPBOARD_NODES_COMMAND;
var SELECT_ALL_COMMAND2 = mod.SELECT_ALL_COMMAND;
var SET_TEXT_FORMAT_COMMAND2 = mod.SET_TEXT_FORMAT_COMMAND;
var SKIP_COLLAB_TAG2 = mod.SKIP_COLLAB_TAG;
var SKIP_DOM_SELECTION_TAG2 = mod.SKIP_DOM_SELECTION_TAG;
var SKIP_SCROLL_INTO_VIEW_TAG2 = mod.SKIP_SCROLL_INTO_VIEW_TAG;
var SKIP_SELECTION_FOCUS_TAG2 = mod.SKIP_SELECTION_FOCUS_TAG;
var TEXT_TYPE_TO_FORMAT2 = mod.TEXT_TYPE_TO_FORMAT;
var TabNode2 = mod.TabNode;
var TextNode2 = mod.TextNode;
var UNDO_COMMAND2 = mod.UNDO_COMMAND;
var addClassNamesToElement2 = mod.addClassNamesToElement;
var buildImportMap2 = mod.buildImportMap;
var compileKeyboardShortcuts2 = mod.compileKeyboardShortcuts;
var configExtension2 = mod.configExtension;
var createCommand2 = mod.createCommand;
var createEditor2 = mod.createEditor;
var createRefCountedRegistry2 = mod.createRefCountedRegistry;
var createSharedNodeState2 = mod.createSharedNodeState;
var createState2 = mod.createState;
var declarePeerDependency2 = mod.declarePeerDependency;
var defineExtension2 = mod.defineExtension;
var findAllLexicalElementsDeep2 = mod.findAllLexicalElementsDeep;
var flipDirection2 = mod.flipDirection;
var getActiveElement2 = mod.getActiveElement;
var getActiveElementDeep2 = mod.getActiveElementDeep;
var getComposedEventTarget2 = mod.getComposedEventTarget;
var getComposedStaticRange2 = mod.getComposedStaticRange;
var getDOMOwnerDocument2 = mod.getDOMOwnerDocument;
var getDOMSelection2 = mod.getDOMSelection;
var getDOMSelectionFromTarget2 = mod.getDOMSelectionFromTarget;
var getDOMSelectionPoints2 = mod.getDOMSelectionPoints;
var getDOMSelectionRange2 = mod.getDOMSelectionRange;
var getDOMSelectionRangeAndPoints2 = mod.getDOMSelectionRangeAndPoints;
var getDOMShadowRoots2 = mod.getDOMShadowRoots;
var getDOMTextNode2 = mod.getDOMTextNode;
var getDeclaredSlots2 = mod.getDeclaredSlots;
var getEditorPropertyFromDOMNode2 = mod.getEditorPropertyFromDOMNode;
var getNearestEditorFromDOMNode2 = mod.getNearestEditorFromDOMNode;
var getParentElement2 = mod.getParentElement;
var getRegisteredNode2 = mod.getRegisteredNode;
var getRegisteredNodeOrThrow2 = mod.getRegisteredNodeOrThrow;
var getRegisteredSubtypeMap2 = mod.getRegisteredSubtypeMap;
var getRootOwnerDocument2 = mod.getRootOwnerDocument;
var getStaticNodeConfig2 = mod.getStaticNodeConfig;
var getStyleObjectFromCSS2 = mod.getStyleObjectFromCSS;
var getTextDirection2 = mod.getTextDirection;
var getTransformSetFromKlass2 = mod.getTransformSetFromKlass;
var isBlockDomNode2 = mod.isBlockDomNode;
var isCurrentlyReadOnlyMode2 = mod.isCurrentlyReadOnlyMode;
var isDOMCapturingSelection2 = mod.isDOMCapturingSelection;
var isDOMDocumentNode2 = mod.isDOMDocumentNode;
var isDOMNode2 = mod.isDOMNode;
var isDOMShadowRoot2 = mod.isDOMShadowRoot;
var isDOMTextNode2 = mod.isDOMTextNode;
var isDOMUnmanaged2 = mod.isDOMUnmanaged;
var isDocumentFragment2 = mod.isDocumentFragment;
var isExactShortcutMatch2 = mod.isExactShortcutMatch;
var isHTMLAnchorElement2 = mod.isHTMLAnchorElement;
var isHTMLElement2 = mod.isHTMLElement;
var isHTMLTableCellElement2 = mod.isHTMLTableCellElement;
var isHTMLTableRowElement2 = mod.isHTMLTableRowElement;
var isInlineDomNode2 = mod.isInlineDomNode;
var isLastChildInBlockNode2 = mod.isLastChildInBlockNode;
var isLexicalEditor2 = mod.isLexicalEditor;
var isModifierMatch2 = mod.isModifierMatch;
var isOnlyChildInBlockNode2 = mod.isOnlyChildInBlockNode;
var isSelectionCapturedInDecoratorInput2 = mod.isSelectionCapturedInDecoratorInput;
var isSelectionWithinEditor2 = mod.isSelectionWithinEditor;
var iterStaticNodeConfigChain2 = mod.iterStaticNodeConfigChain;
var keyboardEventMaskForPlatform2 = mod.keyboardEventMaskForPlatform;
var makeStepwiseIterator2 = mod.makeStepwiseIterator;
var mergeRegister2 = mod.mergeRegister;
var mountSlotContainer2 = mod.mountSlotContainer;
var normalizeClassNames2 = mod.normalizeClassNames;
var registerEventListener2 = mod.registerEventListener;
var registerEventListeners2 = mod.registerEventListeners;
var removeClassNamesFromElement2 = mod.removeClassNamesFromElement;
var removeFromParent2 = mod.removeFromParent;
var resetRandomKey2 = mod.resetRandomKey;
var safeCast2 = mod.safeCast;
var setDOMStyleFromCSS2 = mod.setDOMStyleFromCSS;
var setDOMStyleObject2 = mod.setDOMStyleObject;
var setDOMUnmanaged2 = mod.setDOMUnmanaged;
var setNodeIndentFromDOM2 = mod.setNodeIndentFromDOM;
var shallowMergeConfig2 = mod.shallowMergeConfig;
var stopLexicalPropagation2 = mod.stopLexicalPropagation;
var toggleTextFormatType2 = mod.toggleTextFormatType;
var tokenizeRawText2 = mod.tokenizeRawText;
var unmountSlotContainer2 = mod.unmountSlotContainer;

// node_modules/@lexical/rich-text/dist/LexicalRichText.dev.mjs
var LexicalRichText_dev_exports = {};
__export(LexicalRichText_dev_exports, {
  $createHeadingNode: () => $createHeadingNode,
  $createQuoteNode: () => $createQuoteNode,
  $isHeadingNode: () => $isHeadingNode,
  $isQuoteNode: () => $isQuoteNode,
  DRAG_DROP_PASTE: () => DRAG_DROP_PASTE,
  HeadingAnnounceExtension: () => HeadingAnnounceExtension,
  HeadingNode: () => HeadingNode,
  QuoteNode: () => QuoteNode,
  RichTextExtension: () => RichTextExtension,
  RichTextImportExtension: () => RichTextImportExtension,
  RichTextImportRules: () => RichTextImportRules,
  ShadowRootQuoteRule: () => ShadowRootQuoteRule,
  defaultShouldHandlePasteAsFiles: () => defaultShouldHandlePasteAsFiles,
  eventFiles: () => eventFiles2,
  quoteShadowRootState: () => quoteShadowRootState,
  registerRichText: () => registerRichText
});

// node_modules/@lexical/clipboard/dist/LexicalClipboard.dev.mjs
var LexicalClipboard_dev_exports = {};
__export(LexicalClipboard_dev_exports, {
  $exportMimeTypeFromSelection: () => $exportMimeTypeFromSelection,
  $generateJSONFromSelectedNodes: () => $generateJSONFromSelectedNodes,
  $generateNodesFromSerializedNodes: () => $generateNodesFromSerializedNodes,
  $getClipboardDataFromSelection: () => $getClipboardDataFromSelection,
  $getHtmlContent: () => $getHtmlContent,
  $getLexicalContent: () => $getLexicalContent,
  $handlePlainTextDrop: () => $handlePlainTextDrop,
  $handleRichTextDrop: () => $handleRichTextDrop,
  $insertDataTransferForPlainText: () => $insertDataTransferForPlainText,
  $insertDataTransferForRichText: () => $insertDataTransferForRichText,
  $insertGeneratedNodes: () => $insertGeneratedNodes,
  $writeDragSourceToDataTransfer: () => $writeDragSourceToDataTransfer,
  ClipboardDOMImportExtension: () => ClipboardDOMImportExtension,
  ClipboardImportExtension: () => ClipboardImportExtension,
  DEFAULT_IMPORT_MIME_TYPE: () => DEFAULT_IMPORT_MIME_TYPE,
  DEFAULT_IMPORT_MIME_TYPE_PRIORITY: () => DEFAULT_IMPORT_MIME_TYPE_PRIORITY,
  GetClipboardDataExtension: () => GetClipboardDataExtension,
  caretFromPoint: () => caretFromPoint,
  copyToClipboard: () => copyToClipboard,
  setLexicalClipboardDataTransfer: () => setLexicalClipboardDataTransfer
});

// node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs
var LexicalExtension_dev_exports = {};
__export(LexicalExtension_dev_exports, {
  $applyFormatToDom: () => $applyFormatToDom,
  $createHorizontalRuleNode: () => $createHorizontalRuleNode,
  $defaultShouldInsertAfter: () => $defaultShouldInsertAfter,
  $getExtensionDependency: () => $getExtensionDependency,
  $getExtensionOutput: () => $getExtensionOutput,
  $getPeerDependency: () => $getPeerDependency,
  $isDecoratorTextNode: () => $isDecoratorTextNode,
  $isHorizontalRuleNode: () => $isHorizontalRuleNode,
  AutoFocusExtension: () => AutoFocusExtension,
  CONTROL_OR_ALT: () => CONTROL_OR_ALT2,
  CONTROL_OR_META: () => CONTROL_OR_META2,
  ClearEditorExtension: () => ClearEditorExtension,
  ClickAfterLastBlockExtension: () => ClickAfterLastBlockExtension,
  DecoratorTextExtension: () => DecoratorTextExtension,
  DecoratorTextNode: () => DecoratorTextNode,
  EditorStateExtension: () => EditorStateExtension,
  HMRExtension: () => HMRExtension,
  HorizontalRuleExtension: () => HorizontalRuleExtension,
  HorizontalRuleNode: () => HorizontalRuleNode,
  IMEExtension: () => IMEExtension,
  INSERT_HORIZONTAL_RULE_COMMAND: () => INSERT_HORIZONTAL_RULE_COMMAND,
  InitialStateExtension: () => InitialStateExtension,
  KeyboardShortcutsExtension: () => KeyboardShortcutsExtension,
  LexicalBuilder: () => LexicalBuilder,
  NestedEditorExtension: () => NestedEditorExtension,
  NodeSelectionDataSelectedExtension: () => NodeSelectionDataSelectedExtension,
  NodeSelectionExtension: () => NodeSelectionExtension,
  NormalizeInlineElementsExtension: () => NormalizeInlineElementsExtension,
  NormalizeTripleClickSelectionExtension: () => NormalizeTripleClickSelectionExtension,
  PreventSelectAllExtension: () => PreventSelectAllExtension,
  RootElementExtension: () => RootElementExtension,
  SelectBlockExtension: () => SelectBlockExtension,
  SelectionAlwaysOnDisplayExtension: () => SelectionAlwaysOnDisplayExtension,
  TabIndentationExtension: () => TabIndentationExtension,
  WatchEditableExtension: () => WatchEditableExtension,
  applyFormatFromStyle: () => applyFormatFromStyle,
  applyFormatToDom: () => applyFormatToDom,
  batch: () => n,
  buildEditorFromExtensions: () => buildEditorFromExtensions,
  compileKeyboardShortcuts: () => compileKeyboardShortcuts2,
  computed: () => g,
  configExtension: () => configExtension2,
  declarePeerDependency: () => declarePeerDependency2,
  defineExtension: () => defineExtension2,
  effect: () => j,
  formatKeyboardShortcut: () => formatKeyboardShortcut,
  getExtensionDependencyFromEditor: () => getExtensionDependencyFromEditor,
  getKnownTypesAndNodes: () => getKnownTypesAndNodes,
  getPeerDependencyFromEditor: () => getPeerDependencyFromEditor,
  getPeerDependencyFromEditorOrThrow: () => getPeerDependencyFromEditorOrThrow,
  namedSignals: () => namedSignals,
  registerClearEditor: () => registerClearEditor,
  registerTabIndentation: () => registerTabIndentation,
  safeCast: () => safeCast2,
  shallowMergeConfig: () => shallowMergeConfig2,
  signal: () => a,
  untracked: () => h,
  watchedSignal: () => watchedSignal
});

// node_modules/@lexical/utils/dist/LexicalUtils.dev.mjs
var LexicalUtils_dev_exports = {};
__export(LexicalUtils_dev_exports, {
  $descendantsMatching: () => $descendantsMatching,
  $dfs: () => $dfs,
  $dfsIterator: () => $dfsIterator,
  $dfsWithSlots: () => $dfsWithSlots,
  $dfsWithSlotsIterator: () => $dfsWithSlotsIterator,
  $filter: () => $filter,
  $findMatchingParent: () => $findMatchingParent2,
  $firstToLastIterator: () => $firstToLastIterator,
  $getAdjacentCaret: () => $getAdjacentCaret,
  $getAdjacentSiblingOrParentSiblingCaret: () => $getAdjacentSiblingOrParentSiblingCaret2,
  $getDepth: () => $getDepth,
  $getNearestBlockElementAncestorOrThrow: () => $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType: () => $getNearestNodeOfType,
  $getNextRightPreorderNode: () => $getNextRightPreorderNode,
  $getNextSiblingOrParentSibling: () => $getNextSiblingOrParentSibling,
  $handleIndentAndOutdent: () => $handleIndentAndOutdent,
  $insertFirst: () => $insertFirst,
  $insertNodeIntoLeaf: () => $insertNodeIntoLeaf,
  $insertNodeToNearestRoot: () => $insertNodeToNearestRoot,
  $insertNodeToNearestRootAtCaret: () => $insertNodeToNearestRootAtCaret2,
  $isAtEndOfNode: () => $isAtEndOfNode,
  $isAtStartOfNode: () => $isAtStartOfNode,
  $isBlockFullySelected: () => $isBlockFullySelected2,
  $isEditorIsNestedEditor: () => $isEditorIsNestedEditor,
  $lastToFirstIterator: () => $lastToFirstIterator,
  $onEscapeDown: () => $onEscapeDown,
  $onEscapeUp: () => $onEscapeUp,
  $restoreEditorState: () => $restoreEditorState,
  $reverseDfs: () => $reverseDfs,
  $reverseDfsIterator: () => $reverseDfsIterator,
  $reverseDfsWithSlots: () => $reverseDfsWithSlots,
  $reverseDfsWithSlotsIterator: () => $reverseDfsWithSlotsIterator,
  $splitNode: () => $splitNode2,
  $unwrapAndFilterDescendants: () => $unwrapAndFilterDescendants,
  $unwrapNode: () => $unwrapNode,
  $wrapNodeInElement: () => $wrapNodeInElement,
  CAN_USE_BEFORE_INPUT: () => CAN_USE_BEFORE_INPUT2,
  CAN_USE_DOM: () => CAN_USE_DOM2,
  IS_ANDROID: () => IS_ANDROID2,
  IS_ANDROID_CHROME: () => IS_ANDROID_CHROME2,
  IS_APPLE: () => IS_APPLE2,
  IS_APPLE_WEBKIT: () => IS_APPLE_WEBKIT2,
  IS_CHROME: () => IS_CHROME2,
  IS_FIREFOX: () => IS_FIREFOX2,
  IS_IOS: () => IS_IOS2,
  IS_SAFARI: () => IS_SAFARI2,
  addClassNamesToElement: () => addClassNamesToElement2,
  calculateZoomLevel: () => calculateZoomLevel,
  dedupeSelectionRects: () => dedupeSelectionRects,
  eventFiles: () => eventFiles,
  getScrollParent: () => getScrollParent,
  isBlockDomNode: () => isBlockDomNode2,
  isHTMLAnchorElement: () => isHTMLAnchorElement2,
  isHTMLElement: () => isHTMLElement2,
  isInlineDomNode: () => isInlineDomNode2,
  isMimeType: () => isMimeType,
  makeStateWrapper: () => makeStateWrapper,
  markSelection: () => markSelection,
  mediaFileReader: () => mediaFileReader,
  mergeRegister: () => mergeRegister2,
  objectKlassEquals: () => objectKlassEquals,
  positionNodeOnRange: () => mlcPositionNodeOnRange,
  registerNestedElementResolver: () => registerNestedElementResolver,
  removeClassNamesFromElement: () => removeClassNamesFromElement2,
  selectionAlwaysOnDisplay: () => selectionAlwaysOnDisplay
});

// node_modules/@lexical/selection/dist/LexicalSelection.dev.mjs
var LexicalSelection_dev_exports = {};
__export(LexicalSelection_dev_exports, {
  $addNodeStyle: () => $addNodeStyle,
  $cloneWithProperties: () => $cloneWithProperties2,
  $copyBlockFormatIndent: () => $copyBlockFormatIndent,
  $ensureForwardRangeSelection: () => $ensureForwardRangeSelection,
  $forEachSelectedTextNode: () => $forEachSelectedTextNode,
  $getComputedStyleForElement: () => $getComputedStyleForElement,
  $getComputedStyleForParent: () => $getComputedStyleForParent,
  $getSelectionStyleValueForProperty: () => $getSelectionStyleValueForProperty,
  $isAtEdgeOfElement: () => $isAtEdgeOfElement,
  $isAtNodeEnd: () => $isAtNodeEnd,
  $isParentElementRTL: () => $isParentElementRTL,
  $isParentRTL: () => $isParentRTL,
  $moveCaretSelection: () => $moveCaretSelection,
  $moveCharacter: () => $moveCharacter,
  $patchStyleText: () => $patchStyleText,
  $selectAll: () => $selectAll2,
  $setBlocksType: () => $setBlocksType,
  $shouldOverrideDefaultCharacterSelection: () => $shouldOverrideDefaultCharacterSelection,
  $sliceSelectedTextNodeContent: () => $sliceSelectedTextNodeContent,
  $trimTextContentFromAnchor: () => $trimTextContentFromAnchor,
  $wrapNodes: () => $wrapNodes,
  createDOMRange: () => createDOMRange,
  createRectsFromDOMRange: () => createRectsFromDOMRange,
  getCSSFromStyleObject: () => getCSSFromStyleObject,
  getStyleObjectFromCSS: () => getStyleObjectFromCSS3,
  trimTextContentFromAnchor: () => trimTextContentFromAnchor
});
function formatDevErrorMessage2(message) {
  throw new Error(message);
}
function warnOnlyOnce2(message) {
  {
    let run = false;
    return () => {
      if (!run) {
        console.warn(message);
      }
      run = true;
    };
  }
}
function getDOMTextNode3(element) {
  let node = element;
  while (node != null) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    node = node.firstChild;
  }
  return null;
}
function getDOMIndexWithinParent(node) {
  const parent = node.parentNode;
  if (parent == null) {
    throw new Error("Should never happen");
  }
  return [parent, Array.from(parent.childNodes).indexOf(node)];
}
function createDOMRange(editor, anchorNode, _anchorOffset, focusNode, _focusOffset) {
  const anchorKey = anchorNode.getKey();
  const focusKey = focusNode.getKey();
  const range = getRootOwnerDocument2(editor.getRootElement()).createRange();
  let anchorDOM = editor.getElementByKey(anchorKey);
  let focusDOM = editor.getElementByKey(focusKey);
  let anchorOffset = _anchorOffset;
  let focusOffset = _focusOffset;
  if ($isTextNode2(anchorNode)) {
    anchorDOM = getDOMTextNode3(anchorDOM);
  }
  if ($isTextNode2(focusNode)) {
    focusDOM = getDOMTextNode3(focusDOM);
  }
  if (anchorNode === void 0 || focusNode === void 0 || anchorDOM === null || focusDOM === null) {
    return null;
  }
  if (anchorDOM.nodeName === "BR") {
    [anchorDOM, anchorOffset] = getDOMIndexWithinParent(anchorDOM);
  }
  if (focusDOM.nodeName === "BR") {
    [focusDOM, focusOffset] = getDOMIndexWithinParent(focusDOM);
  }
  const firstChild = anchorDOM.firstChild;
  if (anchorDOM === focusDOM && firstChild != null && firstChild.nodeName === "BR" && anchorOffset === 0 && focusOffset === 0) {
    focusOffset = 1;
  }
  try {
    range.setStart(anchorDOM, anchorOffset);
    range.setEnd(focusDOM, focusOffset);
  } catch (_e) {
    return null;
  }
  if (range.collapsed && (anchorOffset !== focusOffset || anchorKey !== focusKey)) {
    range.setStart(focusDOM, focusOffset);
    range.setEnd(anchorDOM, anchorOffset);
  }
  return range;
}
function createRectsFromDOMRange(editor, range) {
  const rootElement = editor.getRootElement();
  if (rootElement === null) {
    return [];
  }
  const rootRect = rootElement.getBoundingClientRect();
  const computedStyle = getComputedStyle(rootElement);
  const rootPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
  const selectionRects = Array.from(range.getClientRects());
  let selectionRectsLength = selectionRects.length;
  selectionRects.sort((a2, b2) => {
    const top = a2.top - b2.top;
    if (Math.abs(top) <= 3) {
      return a2.left - b2.left;
    }
    return top;
  });
  let prevRect;
  for (let i2 = 0; i2 < selectionRectsLength; i2++) {
    const selectionRect = selectionRects[i2];
    const isOverlappingRect = prevRect && prevRect.top <= selectionRect.top && prevRect.top + prevRect.height > selectionRect.top && prevRect.left + prevRect.width > selectionRect.left;
    const selectionSpansElement = selectionRect.width + rootPadding === rootRect.width;
    if (isOverlappingRect || selectionSpansElement) {
      selectionRects.splice(i2--, 1);
      selectionRectsLength--;
      continue;
    }
    prevRect = selectionRect;
  }
  return selectionRects;
}
function getCSSFromStyleObject(styles) {
  let css = "";
  for (const style in styles) {
    if (style) {
      css += `${style}: ${styles[style]};`;
    }
  }
  return css;
}
function $getComputedStyleForElement(element) {
  const editor = $getEditor2();
  const domElement = editor.getElementByKey(element.getKey());
  if (domElement === null) {
    return null;
  }
  const view = domElement.ownerDocument.defaultView;
  if (view === null) {
    return null;
  }
  return view.getComputedStyle(domElement);
}
function $getComputedStyleForParent(node) {
  const parent = $isRootNode2(node) ? node : node.getParent();
  return parent && $getComputedStyleForElement(parent);
}
function $isParentRTL(node) {
  const styles = $getComputedStyleForParent(node);
  return styles !== null && styles.direction === "rtl";
}
function $sliceSelectedTextNodeContent(selection, textNode, mutates = "self") {
  const anchorAndFocus = selection.getStartEndPoints();
  if (textNode.isSelected(selection) && !$isTokenOrSegmented2(textNode) && anchorAndFocus !== null) {
    const [anchor, focus] = anchorAndFocus;
    const isBackward = selection.isBackward();
    const anchorNode = anchor.getNode();
    const focusNode = focus.getNode();
    const isAnchor = textNode.is(anchorNode);
    const isFocus = textNode.is(focusNode);
    if (isAnchor || isFocus) {
      const [anchorOffset, focusOffset] = $getCharacterOffsets2(selection);
      const isSame = anchorNode.is(focusNode);
      const isFirst = textNode.is(isBackward ? focusNode : anchorNode);
      const isLast = textNode.is(isBackward ? anchorNode : focusNode);
      let startOffset = 0;
      let endOffset = void 0;
      if (isSame) {
        startOffset = anchorOffset > focusOffset ? focusOffset : anchorOffset;
        endOffset = anchorOffset > focusOffset ? anchorOffset : focusOffset;
      } else if (isFirst) {
        const offset = isBackward ? focusOffset : anchorOffset;
        startOffset = offset;
        endOffset = void 0;
      } else if (isLast) {
        const offset = isBackward ? anchorOffset : focusOffset;
        startOffset = 0;
        endOffset = offset;
      }
      const text = textNode.__text.slice(startOffset, endOffset);
      if (text !== textNode.__text) {
        if (mutates === "clone") {
          textNode = $cloneWithPropertiesEphemeral2(textNode);
        }
        textNode.__text = text;
      }
    }
  }
  return textNode;
}
function $isAtNodeEnd(point) {
  if (point.type === "text") {
    return point.offset === point.getNode().getTextContentSize();
  }
  const node = point.getNode();
  if (!$isElementNode2(node)) {
    formatDevErrorMessage2(`isAtNodeEnd: node must be a TextNode or ElementNode`);
  }
  return point.offset === node.getChildrenSize();
}
function $trimTextContentFromAnchor(editor, anchor, delCount) {
  let currentNode = anchor.getNode();
  let remaining = delCount;
  if ($isElementNode2(currentNode)) {
    const descendantNode = currentNode.getDescendantByIndex(anchor.offset);
    if (descendantNode !== null) {
      currentNode = descendantNode;
    }
  }
  while (remaining > 0 && currentNode !== null) {
    if ($isElementNode2(currentNode)) {
      const lastDescendant = currentNode.getLastDescendant();
      if (lastDescendant !== null) {
        currentNode = lastDescendant;
      }
    }
    let nextNode = currentNode.getPreviousSibling();
    let additionalElementWhitespace = 0;
    if (nextNode === null) {
      let parent = currentNode.getParentOrThrow();
      let parentSibling = parent.getPreviousSibling();
      while (parentSibling === null) {
        parent = parent.getParent();
        if (parent === null) {
          nextNode = null;
          break;
        }
        parentSibling = parent.getPreviousSibling();
      }
      if (parent !== null) {
        additionalElementWhitespace = parent.isInline() ? 0 : 2;
        nextNode = parentSibling;
      }
    }
    let text = currentNode.getTextContent();
    if (text === "" && $isElementNode2(currentNode) && !currentNode.isInline()) {
      text = "\n\n";
    }
    const currentNodeSize = text.length;
    if (!$isTextNode2(currentNode) || remaining >= currentNodeSize) {
      const parent = currentNode.getParent();
      currentNode.remove();
      if (parent != null && parent.getChildrenSize() === 0 && !$isRootNode2(parent)) {
        parent.remove();
      }
      remaining -= currentNodeSize + additionalElementWhitespace;
      currentNode = nextNode;
    } else {
      const key = currentNode.getKey();
      const prevTextContent = editor.read("latest", () => {
        const prevNode = $getNodeByKey2(key);
        if ($isTextNode2(prevNode) && prevNode.isSimpleText()) {
          return prevNode.getTextContent();
        }
        return null;
      });
      const offset = currentNodeSize - remaining;
      const slicedText = text.slice(0, offset);
      if (prevTextContent !== null && prevTextContent !== text) {
        const prevSelection = $getPreviousSelection2();
        let target = currentNode;
        if (!currentNode.isSimpleText()) {
          const textNode = $createTextNode2(prevTextContent);
          currentNode.replace(textNode);
          target = textNode;
        } else {
          currentNode.setTextContent(prevTextContent);
        }
        if ($isRangeSelection2(prevSelection) && prevSelection.isCollapsed()) {
          const prevOffset = prevSelection.anchor.offset;
          target.select(prevOffset, prevOffset);
        }
      } else if (currentNode.isSimpleText()) {
        const isSelected = anchor.key === key;
        let anchorOffset = anchor.offset;
        if (anchorOffset < remaining) {
          anchorOffset = currentNodeSize;
        }
        const splitStart = isSelected ? anchorOffset - remaining : 0;
        const splitEnd = isSelected ? anchorOffset : offset;
        if (isSelected && splitStart === 0) {
          const [excessNode] = currentNode.splitText(splitStart, splitEnd);
          excessNode.remove();
        } else {
          const [, excessNode] = currentNode.splitText(splitStart, splitEnd);
          excessNode.remove();
        }
      } else {
        const textNode = $createTextNode2(slicedText);
        currentNode.replace(textNode);
      }
      remaining = 0;
    }
  }
}
var $addNodeStyle = warnOnlyOnce2("$addNodeStyle is a deprecated no-op and calls should be removed");
function $patchStyle(target, patch) {
  if (!($isRangeSelection2(target) ? target.isCollapsed() : $isTextNode2(target) || $isElementNode2(target))) {
    formatDevErrorMessage2(`$patchStyle must only be called with a TextNode, ElementNode, or collapsed RangeSelection`);
  }
  const prevStyles = getStyleObjectFromCSS2($isRangeSelection2(target) ? target.style : $isTextNode2(target) ? target.getStyle() : target.getTextStyle());
  const newStyles = Object.entries(patch).reduce((styles, [key, value]) => {
    if (typeof value === "function") {
      styles[key] = value(prevStyles[key], target);
    } else if (value === null) {
      delete styles[key];
    } else {
      styles[key] = value;
    }
    return styles;
  }, {
    ...prevStyles
  });
  const newCSSText = getCSSFromStyleObject(newStyles);
  if ($isRangeSelection2(target) || $isTextNode2(target)) {
    target.setStyle(newCSSText);
  } else {
    target.setTextStyle(newCSSText);
  }
}
function $patchStyleText(selection, patch) {
  const patchedElementKeys = /* @__PURE__ */ new Set();
  if ($isRangeSelection2(selection) && selection.isCollapsed()) {
    $patchStyle(selection, patch);
    const emptyNode = selection.anchor.getNode();
    if ($isElementNode2(emptyNode) && emptyNode.isEmpty()) {
      patchedElementKeys.add(emptyNode.getKey());
      $patchStyle(emptyNode, patch);
    }
  }
  $forEachSelectedTextNode((textNode) => {
    $patchStyle(textNode, patch);
  });
  const nodes = selection.getNodes();
  if (nodes.length > 0) {
    for (const node of nodes) {
      if (!$isElementNode2(node) || !node.canBeEmpty() || node.getChildrenSize() !== 0) {
        continue;
      }
      const key = node.getKey();
      if (patchedElementKeys.has(key)) {
        continue;
      }
      patchedElementKeys.add(key);
      $patchStyle(node, patch);
    }
  }
}
function $forEachSelectedTextNode(fn) {
  const selection = $getSelection2();
  if (!selection) {
    return;
  }
  const slicedTextNodes = /* @__PURE__ */ new Map();
  const getSliceIndices = (node) => slicedTextNodes.get(node.getKey()) || [0, node.getTextContentSize()];
  if ($isRangeSelection2(selection)) {
    for (const slice of $caretRangeFromSelection2(selection).getTextSlices()) {
      if (slice) {
        slicedTextNodes.set(slice.caret.origin.getKey(), slice.getSliceIndices());
      }
    }
  }
  const selectedNodes = selection.getNodes();
  for (const selectedNode of selectedNodes) {
    if (!($isTextNode2(selectedNode) && selectedNode.canHaveFormat())) {
      continue;
    }
    const [startOffset, endOffset] = getSliceIndices(selectedNode);
    if (endOffset === startOffset) {
      continue;
    }
    if ($isTokenOrSegmented2(selectedNode) || startOffset === 0 && endOffset === selectedNode.getTextContentSize()) {
      fn(selectedNode);
    } else {
      const splitNodes = selectedNode.splitText(startOffset, endOffset);
      const replacement = splitNodes[startOffset === 0 ? 0 : 1];
      fn(replacement);
    }
  }
  if ($isRangeSelection2(selection) && selection.anchor.type === "text" && selection.focus.type === "text" && selection.anchor.key === selection.focus.key) {
    $ensureForwardRangeSelection(selection);
  }
}
function $ensureForwardRangeSelection(selection) {
  if (selection.isBackward()) {
    const {
      anchor,
      focus
    } = selection;
    const {
      key,
      offset,
      type
    } = anchor;
    anchor.set(focus.key, focus.offset, focus.type);
    focus.set(key, offset, type);
  }
}
function $copyBlockFormatIndent(srcNode, destNode) {
  const format = srcNode.getFormatType();
  const indent = srcNode.getIndent();
  if (format !== destNode.getFormatType()) {
    destNode.setFormat(format);
  }
  if (indent !== destNode.getIndent()) {
    destNode.setIndent(indent);
  }
}
function $isAtEdgeOfElement(point, element, direction) {
  let caret = $caretFromPoint2(point, direction);
  if ($isExtendableTextPointCaret2(caret)) {
    return false;
  }
  for (; caret; caret = caret.getParentCaret()) {
    const parent = caret.getParentAtCaret();
    if (!parent || caret.getNodeAtCaret()) {
      return false;
    }
    if (element.is(parent)) {
      return true;
    }
  }
  return false;
}
function $isPointAtBlockEdge(point, block, direction) {
  const node = point.getNode();
  if ($isElementNode2(node) && node.isEmpty()) {
    return false;
  }
  return $isAtEdgeOfElement(point, block, direction);
}
function $setBlocksType(selection, $createElement, $afterCreateElement = $copyBlockFormatIndent) {
  if (!selection) {
    return;
  }
  const anchorAndFocus = selection.getStartEndPoints();
  let skipFocus = false;
  let focusBlock = null;
  const blockMap = /* @__PURE__ */ new Map();
  if (anchorAndFocus) {
    const [anchor, focus] = anchorAndFocus;
    const anchorBlock = $findMatchingParent2(anchor.getNode(), INTERNAL_$isBlock2);
    focusBlock = $findMatchingParent2(focus.getNode(), INTERNAL_$isBlock2);
    const direction = selection.isBackward() ? "previous" : "next";
    skipFocus = $isElementNode2(focusBlock) && !focusBlock.is(anchorBlock) && $isPointAtBlockEdge(focus, focusBlock, flipDirection2(direction));
    if ($isElementNode2(anchorBlock)) {
      blockMap.set(anchorBlock.getKey(), anchorBlock);
    }
    if ($isElementNode2(focusBlock) && !skipFocus) {
      blockMap.set(focusBlock.getKey(), focusBlock);
    }
  }
  for (const node of selection.getNodes()) {
    if ($isElementNode2(node) && INTERNAL_$isBlock2(node)) {
      if (skipFocus && node.is(focusBlock)) {
        continue;
      }
      blockMap.set(node.getKey(), node);
    } else if (!anchorAndFocus) {
      const ancestorBlock = $findMatchingParent2(node, INTERNAL_$isBlock2);
      if ($isElementNode2(ancestorBlock)) {
        blockMap.set(ancestorBlock.getKey(), ancestorBlock);
      }
    }
  }
  for (const prevNode of blockMap.values()) {
    if ($getSlotHost2(prevNode) !== null) {
      continue;
    }
    const element = $createElement();
    $afterCreateElement(prevNode, element);
    prevNode.replace(element, true);
  }
}
function isPointAttached(point) {
  return point.getNode().isAttached();
}
function $removeParentEmptyElements(startingNode) {
  let node = startingNode;
  while (node !== null && !$isRootOrShadowRoot2(node)) {
    const latest = node.getLatest();
    const parentNode = node.getParent();
    if (latest.getChildrenSize() === 0) {
      node.remove(true);
    }
    node = parentNode;
  }
}
function $wrapNodes(selection, createElement, wrappingElement = null) {
  const anchorAndFocus = selection.getStartEndPoints();
  const anchor = anchorAndFocus ? anchorAndFocus[0] : null;
  const nodes = selection.getNodes();
  const nodesLength = nodes.length;
  if (anchor !== null) {
    const slotFrame = $getSlotFrame2(anchor.getNode());
    if (slotFrame !== null && !$isRootOrShadowRoot2(slotFrame)) {
      return;
    }
  }
  if (anchor !== null && (nodesLength === 0 || nodesLength === 1 && anchor.type === "element" && anchor.getNode().getChildrenSize() === 0)) {
    const target = anchor.type === "text" ? anchor.getNode().getParentOrThrow() : anchor.getNode();
    const children = target.getChildren();
    let element = createElement();
    element.setFormat(target.getFormatType());
    element.setIndent(target.getIndent());
    children.forEach((child) => element.append(child));
    if (wrappingElement) {
      element = wrappingElement.append(element);
    }
    target.replace(element);
    return;
  }
  let topLevelNode = null;
  let descendants = [];
  for (let i2 = 0; i2 < nodesLength; i2++) {
    const node = nodes[i2];
    if ($isRootOrShadowRoot2(node)) {
      $wrapNodesImpl(selection, descendants, descendants.length, createElement, wrappingElement);
      descendants = [];
      topLevelNode = node;
    } else if (topLevelNode === null || topLevelNode !== null && $hasAncestor2(node, topLevelNode)) {
      descendants.push(node);
    } else {
      $wrapNodesImpl(selection, descendants, descendants.length, createElement, wrappingElement);
      descendants = [node];
    }
  }
  $wrapNodesImpl(selection, descendants, descendants.length, createElement, wrappingElement);
}
function $wrapNodesImpl(selection, nodes, nodesLength, createElement, wrappingElement = null) {
  if (nodes.length === 0) {
    return;
  }
  const firstNode = nodes[0];
  const elementMapping = /* @__PURE__ */ new Map();
  const elements = [];
  const firstNodeBlock = $isElementNode2(firstNode) ? firstNode : firstNode.getParentOrThrow();
  let target = firstNodeBlock.isInline() ? firstNodeBlock.getParentOrThrow() : firstNodeBlock;
  let targetIsPrevSibling = false;
  while (target !== null) {
    const prevSibling = target.getPreviousSibling();
    if (prevSibling !== null) {
      target = prevSibling;
      targetIsPrevSibling = true;
      break;
    }
    target = target.getParentOrThrow();
    if ($isRootOrShadowRoot2(target)) {
      break;
    }
  }
  const emptyElements = /* @__PURE__ */ new Set();
  for (let i2 = 0; i2 < nodesLength; i2++) {
    const node = nodes[i2];
    if ($isElementNode2(node) && node.getChildrenSize() === 0) {
      emptyElements.add(node.getKey());
    }
  }
  const movedNodes = /* @__PURE__ */ new Set();
  for (let i2 = 0; i2 < nodesLength; i2++) {
    const node = nodes[i2];
    let parent = node.getParent();
    if (parent !== null && parent.isInline()) {
      parent = parent.getParent();
    }
    if (parent !== null && $isLeafNode2(node) && !movedNodes.has(node.getKey())) {
      const parentKey = parent.getKey();
      if (elementMapping.get(parentKey) === void 0) {
        const targetElement = createElement();
        targetElement.setFormat(parent.getFormatType());
        targetElement.setIndent(parent.getIndent());
        elements.push(targetElement);
        elementMapping.set(parentKey, targetElement);
        const children = parent.getChildren();
        targetElement.splice(targetElement.getChildrenSize(), 0, children);
        for (const child of children) {
          movedNodes.add(child.getKey());
          if ($isElementNode2(child)) {
            for (const key of child.getChildrenKeys()) {
              movedNodes.add(key);
            }
          }
        }
        $removeParentEmptyElements(parent);
      }
    } else if (emptyElements.has(node.getKey())) {
      if (!$isElementNode2(node)) {
        formatDevErrorMessage2(`Expected node in emptyElements to be an ElementNode`);
      }
      const targetElement = createElement();
      targetElement.setFormat(node.getFormatType());
      targetElement.setIndent(node.getIndent());
      elements.push(targetElement);
      node.remove(true);
    }
  }
  if (wrappingElement !== null) {
    for (let i2 = 0; i2 < elements.length; i2++) {
      const element = elements[i2];
      wrappingElement.append(element);
    }
  }
  let lastElement = null;
  if ($isRootOrShadowRoot2(target)) {
    if (targetIsPrevSibling) {
      if (wrappingElement !== null) {
        target.insertAfter(wrappingElement);
      } else {
        for (let i2 = elements.length - 1; i2 >= 0; i2--) {
          const element = elements[i2];
          target.insertAfter(element);
        }
      }
    } else {
      const rootTarget = target;
      const firstChild = rootTarget.getFirstChild();
      if ($isElementNode2(firstChild)) {
        target = firstChild;
      }
      if (firstChild === null) {
        if (wrappingElement) {
          rootTarget.append(wrappingElement);
        } else {
          for (let i2 = 0; i2 < elements.length; i2++) {
            const element = elements[i2];
            rootTarget.append(element);
            lastElement = element;
          }
        }
      } else {
        if (wrappingElement !== null) {
          firstChild.insertBefore(wrappingElement);
        } else {
          for (let i2 = 0; i2 < elements.length; i2++) {
            const element = elements[i2];
            firstChild.insertBefore(element);
            lastElement = element;
          }
        }
      }
    }
  } else {
    if (wrappingElement) {
      target.insertAfter(wrappingElement);
    } else {
      for (let i2 = elements.length - 1; i2 >= 0; i2--) {
        const element = elements[i2];
        target.insertAfter(element);
        lastElement = element;
      }
    }
  }
  const prevSelection = $getPreviousSelection2();
  if ($isRangeSelection2(prevSelection) && isPointAttached(prevSelection.anchor) && isPointAttached(prevSelection.focus)) {
    $setSelection2(prevSelection.clone());
  } else if (lastElement !== null) {
    lastElement.selectEnd();
  } else {
    selection.dirty = true;
  }
}
function $isEditorVerticalOrientation(selection) {
  const computedStyle = $getComputedStyle(selection);
  return computedStyle !== null && computedStyle.writingMode === "vertical-rl";
}
function $getComputedStyle(selection) {
  const anchorNode = selection.anchor.getNode();
  if ($isElementNode2(anchorNode)) {
    return $getComputedStyleForElement(anchorNode);
  }
  return $getComputedStyleForParent(anchorNode);
}
function $shouldOverrideDefaultCharacterSelection(selection, isBackward) {
  const isVertical = $isEditorVerticalOrientation(selection);
  let adjustedIsBackward = isVertical ? !isBackward : isBackward;
  if ($isParentElementRTL(selection)) {
    adjustedIsBackward = !adjustedIsBackward;
  }
  const focusCaret = $caretFromPoint2(selection.focus, adjustedIsBackward ? "previous" : "next");
  if ($isExtendableTextPointCaret2(focusCaret)) {
    return false;
  }
  if ($isTextPointCaret2(focusCaret) && !$isTabNode2(focusCaret.origin) && focusCaret.origin.isUnmergeable()) {
    const sibling = focusCaret.getNodeAtCaret();
    if ($isTextNode2(sibling) && !$isTabNode2(sibling)) {
      return true;
    }
  }
  for (const nextCaret of $extendCaretToRange2(focusCaret)) {
    if ($isChildCaret2(nextCaret)) {
      return !nextCaret.origin.isInline();
    } else if ($isElementNode2(nextCaret.origin)) {
      continue;
    } else if ($isDecoratorNode2(nextCaret.origin)) {
      return true;
    }
    break;
  }
  return false;
}
function $moveCaretSelection(selection, isHoldingShift, isBackward, granularity) {
  selection.modify(isHoldingShift ? "extend" : "move", isBackward, granularity);
}
function $isParentElementRTL(selection) {
  const computedStyle = $getComputedStyle(selection);
  return computedStyle !== null && computedStyle.direction === "rtl";
}
function $moveCharacter(selection, isHoldingShift, isBackward) {
  const isRTL = $isParentElementRTL(selection);
  const isVertical = $isEditorVerticalOrientation(selection);
  let adjustedIsBackward;
  if (isVertical) {
    adjustedIsBackward = !isBackward;
  } else if (isRTL) {
    adjustedIsBackward = !isBackward;
  } else {
    adjustedIsBackward = isBackward;
  }
  $moveCaretSelection(selection, isHoldingShift, adjustedIsBackward, "character");
}
function $getNodeStyleValueForProperty(node, styleProperty, defaultValue) {
  const css = node.getStyle();
  const styleObject = getStyleObjectFromCSS2(css);
  if (styleObject !== null) {
    return styleObject[styleProperty] || defaultValue;
  }
  return defaultValue;
}
function $getSelectionStyleValueForProperty(selection, styleProperty, defaultValue = "") {
  let styleValue = null;
  const nodes = selection.getNodes();
  let startNode;
  let endNode;
  if ($isRangeSelection2(selection)) {
    if (selection.isCollapsed() && selection.style !== "") {
      const styleObject = getStyleObjectFromCSS2(selection.style);
      if (styleObject !== null && styleProperty in styleObject) {
        return styleObject[styleProperty];
      }
    }
    const {
      anchor,
      focus
    } = selection;
    const isBackward = selection.isBackward();
    const firstNode = isBackward ? focus.getNode() : anchor.getNode();
    const lastNode = isBackward ? anchor.getNode() : focus.getNode();
    const startOffset = isBackward ? focus.offset : anchor.offset;
    const endOffset = isBackward ? anchor.offset : focus.offset;
    if ($isTextNode2(firstNode) && startOffset === firstNode.getTextContentSize()) {
      startNode = firstNode;
    }
    if (endOffset === 0) {
      endNode = lastNode;
    }
  }
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = nodes[i2];
    if ($isTextNode2(node) && !node.is(i2 === 0 ? startNode : endNode)) {
      const nodeStyleValue = $getNodeStyleValueForProperty(node, styleProperty, defaultValue);
      if (styleValue === null) {
        styleValue = nodeStyleValue;
      } else if (styleValue !== nodeStyleValue) {
        styleValue = "";
        break;
      }
    }
  }
  return styleValue === null ? defaultValue : styleValue;
}
var getStyleObjectFromCSS3 = getStyleObjectFromCSS2;
var trimTextContentFromAnchor = $trimTextContentFromAnchor;

// node_modules/@lexical/selection/dist/LexicalSelection.mjs
var mod2 = true ? LexicalSelection_dev_exports : LexicalSelection_prod_exports;
var $addNodeStyle2 = mod2.$addNodeStyle;
var $cloneWithProperties3 = mod2.$cloneWithProperties;
var $copyBlockFormatIndent2 = mod2.$copyBlockFormatIndent;
var $ensureForwardRangeSelection2 = mod2.$ensureForwardRangeSelection;
var $forEachSelectedTextNode2 = mod2.$forEachSelectedTextNode;
var $getComputedStyleForElement2 = mod2.$getComputedStyleForElement;
var $getComputedStyleForParent2 = mod2.$getComputedStyleForParent;
var $getSelectionStyleValueForProperty2 = mod2.$getSelectionStyleValueForProperty;
var $isAtEdgeOfElement2 = mod2.$isAtEdgeOfElement;
var $isAtNodeEnd2 = mod2.$isAtNodeEnd;
var $isParentElementRTL2 = mod2.$isParentElementRTL;
var $isParentRTL2 = mod2.$isParentRTL;
var $moveCaretSelection2 = mod2.$moveCaretSelection;
var $moveCharacter2 = mod2.$moveCharacter;
var $patchStyleText2 = mod2.$patchStyleText;
var $selectAll3 = mod2.$selectAll;
var $setBlocksType2 = mod2.$setBlocksType;
var $shouldOverrideDefaultCharacterSelection2 = mod2.$shouldOverrideDefaultCharacterSelection;
var $sliceSelectedTextNodeContent2 = mod2.$sliceSelectedTextNodeContent;
var $trimTextContentFromAnchor2 = mod2.$trimTextContentFromAnchor;
var $wrapNodes2 = mod2.$wrapNodes;
var createDOMRange2 = mod2.createDOMRange;
var createRectsFromDOMRange2 = mod2.createRectsFromDOMRange;
var getCSSFromStyleObject2 = mod2.getCSSFromStyleObject;
var getStyleObjectFromCSS4 = mod2.getStyleObjectFromCSS;
var trimTextContentFromAnchor2 = mod2.trimTextContentFromAnchor;

// node_modules/@lexical/utils/dist/LexicalUtils.dev.mjs
function formatDevErrorMessage3(message) {
  throw new Error(message);
}
function dedupeSelectionRects(rects) {
  const contains = (a2, b2) => b2.left >= a2.left - 1 && b2.top >= a2.top - 1 && b2.right <= a2.right + 1 && b2.bottom <= a2.bottom + 1;
  const kept = [];
  for (const rect of Array.from(rects)) {
    if (rect.width < 0.5 || rect.height < 0.5) {
      continue;
    }
    if (kept.some((keptRect) => contains(rect, keptRect))) {
      continue;
    }
    for (let i2 = kept.length - 1; i2 >= 0; i2--) {
      if (contains(kept[i2], rect)) {
        kept.splice(i2, 1);
      }
    }
    kept.push(rect);
  }
  return kept;
}
function px(value) {
  return `${value}px`;
}
var mutationObserverConfig = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};
function prependDOMNode(parent, node) {
  parent.insertBefore(node, parent.firstChild);
}
function mlcPositionNodeOnRange(editor, range, onReposition) {
  let rootDOMNode = null;
  let parentDOMNode = null;
  let observer = null;
  let lastNodes = [];
  const wrapperNode = getRootOwnerDocument2(editor.getRootElement()).createElement("div");
  wrapperNode.style.position = "relative";
  function position() {
    if (!(rootDOMNode !== null)) {
      formatDevErrorMessage3(`Unexpected null rootDOMNode`);
    }
    if (!(parentDOMNode !== null)) {
      formatDevErrorMessage3(`Unexpected null parentDOMNode`);
    }
    const {
      left: parentLeft,
      top: parentTop
    } = parentDOMNode.getBoundingClientRect();
    const rects = dedupeSelectionRects(createRectsFromDOMRange2(editor, range));
    if (!wrapperNode.isConnected) {
      prependDOMNode(parentDOMNode, wrapperNode);
    }
    let hasRepositioned = false;
    for (let i2 = 0; i2 < rects.length; i2++) {
      const rect = rects[i2];
      const rectNode = lastNodes[i2] || getRootOwnerDocument2(rootDOMNode).createElement("div");
      const rectNodeStyle = rectNode.style;
      if (rectNodeStyle.position !== "absolute") {
        rectNodeStyle.position = "absolute";
        hasRepositioned = true;
      }
      const left = px(rect.left - parentLeft);
      if (rectNodeStyle.left !== left) {
        rectNodeStyle.left = left;
        hasRepositioned = true;
      }
      const top = px(rect.top - parentTop);
      if (rectNodeStyle.top !== top) {
        rectNode.style.top = top;
        hasRepositioned = true;
      }
      const width = px(rect.width);
      if (rectNodeStyle.width !== width) {
        rectNode.style.width = width;
        hasRepositioned = true;
      }
      const height = px(rect.height);
      if (rectNodeStyle.height !== height) {
        rectNode.style.height = height;
        hasRepositioned = true;
      }
      if (rectNode.parentNode !== wrapperNode) {
        wrapperNode.append(rectNode);
        hasRepositioned = true;
      }
      lastNodes[i2] = rectNode;
    }
    while (lastNodes.length > rects.length) {
      const node = lastNodes.pop();
      if (node != null) {
        node.remove();
      }
    }
    if (hasRepositioned) {
      onReposition(lastNodes);
    }
  }
  function stop() {
    parentDOMNode = null;
    rootDOMNode = null;
    if (observer !== null) {
      observer.disconnect();
    }
    observer = null;
    wrapperNode.remove();
    for (const node of lastNodes) {
      node.remove();
    }
    lastNodes = [];
  }
  function restart() {
    const currentRootDOMNode = editor.getRootElement();
    if (currentRootDOMNode === null) {
      return stop();
    }
    const currentParentDOMNode = currentRootDOMNode.parentElement;
    if (!isHTMLElement2(currentParentDOMNode)) {
      return stop();
    }
    stop();
    rootDOMNode = currentRootDOMNode;
    parentDOMNode = currentParentDOMNode;
    observer = new MutationObserver((mutations) => {
      const nextRootDOMNode = editor.getRootElement();
      const nextParentDOMNode = nextRootDOMNode && nextRootDOMNode.parentElement;
      if (nextRootDOMNode !== rootDOMNode || nextParentDOMNode !== parentDOMNode) {
        return restart();
      }
      for (const mutation of mutations) {
        if (!wrapperNode.contains(mutation.target)) {
          return position();
        }
      }
    });
    observer.observe(currentParentDOMNode, mutationObserverConfig);
    position();
  }
  const removeRootListener = editor.registerRootListener(() => {
    restart();
    return stop;
  });
  return () => {
    removeRootListener();
    stop();
  };
}
function $getOrderedSelectionPoints(selection) {
  const points = selection.getStartEndPoints();
  return selection.isBackward() ? [points[1], points[0]] : points;
}
function $rangeTargetFromPoint(editor, point, node, dom) {
  if (point.type === "text" || !$isElementNode2(node)) {
    const textDOM = ($isTextNode2(node) ? $getDOMTextNode2(node, dom, editor) : getDOMTextNode2(dom)) || dom;
    return [textDOM, point.offset];
  } else {
    const slot = $getDOMSlot2(node, dom, editor);
    return [slot.element, slot.getFirstChildOffset() + point.offset];
  }
}
function $rangeFromPoints(editor, start, startNode, startDOM, end, endNode, endDOM) {
  const editorDocument = editor._window ? editor._window.document : document;
  const range = editorDocument.createRange();
  range.setStart(...$rangeTargetFromPoint(editor, start, startNode, startDOM));
  range.setEnd(...$rangeTargetFromPoint(editor, end, endNode, endDOM));
  return range;
}
function defaultOnReposition(domNodes) {
  for (const domNode of domNodes) {
    const domNodeStyle = domNode.style;
    if (domNodeStyle.background !== "Highlight") {
      domNodeStyle.background = "Highlight";
    }
    if (domNodeStyle.color !== "HighlightText") {
      domNodeStyle.color = "HighlightText";
    }
    if (domNodeStyle.marginTop !== px(-1.5)) {
      domNodeStyle.marginTop = px(-1.5);
    }
    if (domNodeStyle.paddingTop !== px(4)) {
      domNodeStyle.paddingTop = px(4);
    }
    if (domNodeStyle.paddingBottom !== px(0)) {
      domNodeStyle.paddingBottom = px(0);
    }
  }
}
function markSelection(editor, onReposition = defaultOnReposition) {
  let previousAnchorNode = null;
  let previousAnchorNodeDOM = null;
  let previousAnchorOffset = null;
  let previousFocusNode = null;
  let previousFocusNodeDOM = null;
  let previousFocusOffset = null;
  let removeRangeListener = () => {
  };
  function compute(editorState) {
    editorState.read(() => {
      const selection = $getSelection2();
      if (!$isRangeSelection2(selection)) {
        previousAnchorNode = null;
        previousAnchorOffset = null;
        previousFocusNode = null;
        previousFocusOffset = null;
        removeRangeListener();
        removeRangeListener = () => {
        };
        return;
      }
      const [start, end] = $getOrderedSelectionPoints(selection);
      const currentStartNode = start.getNode();
      const currentStartNodeKey = currentStartNode.getKey();
      const currentStartOffset = start.offset;
      const currentEndNode = end.getNode();
      const currentEndNodeKey = currentEndNode.getKey();
      const currentEndOffset = end.offset;
      const currentStartNodeDOM = editor.getElementByKey(currentStartNodeKey);
      const currentEndNodeDOM = editor.getElementByKey(currentEndNodeKey);
      const differentStartDOM = previousAnchorNode === null || currentStartNodeDOM !== previousAnchorNodeDOM || currentStartOffset !== previousAnchorOffset || currentStartNodeKey !== previousAnchorNode.getKey();
      const differentEndDOM = previousFocusNode === null || currentEndNodeDOM !== previousFocusNodeDOM || currentEndOffset !== previousFocusOffset || currentEndNodeKey !== previousFocusNode.getKey();
      if ((differentStartDOM || differentEndDOM) && currentStartNodeDOM !== null && currentEndNodeDOM !== null) {
        const range = $rangeFromPoints(editor, start, currentStartNode, currentStartNodeDOM, end, currentEndNode, currentEndNodeDOM);
        removeRangeListener();
        removeRangeListener = mlcPositionNodeOnRange(editor, range, onReposition);
      }
      previousAnchorNode = currentStartNode;
      previousAnchorNodeDOM = currentStartNodeDOM;
      previousAnchorOffset = currentStartOffset;
      previousFocusNode = currentEndNode;
      previousFocusNodeDOM = currentEndNodeDOM;
      previousFocusOffset = currentEndOffset;
    }, {
      editor
    });
  }
  compute(editor.getEditorState());
  return mergeRegister2(editor.registerUpdateListener(({
    editorState
  }) => compute(editorState)), () => {
    removeRangeListener();
  });
}
function selectionAlwaysOnDisplay(editor, onReposition) {
  let removeSelectionMark = null;
  const onSelectionChange2 = () => {
    const editorRootElement = editor.getRootElement();
    const targetWindow = editorRootElement !== null ? editorRootElement.ownerDocument.defaultView : null;
    const domSelection = targetWindow !== null ? targetWindow.getSelection() : null;
    const domAnchorNode = domSelection !== null ? getDOMSelectionPoints2(domSelection, editorRootElement).anchorNode : null;
    const isSelectionInsideEditor = domAnchorNode !== null && editorRootElement !== null && editorRootElement.contains(domAnchorNode);
    if (isSelectionInsideEditor) {
      if (removeSelectionMark !== null) {
        removeSelectionMark();
        removeSelectionMark = null;
      }
    } else {
      if (removeSelectionMark === null) {
        removeSelectionMark = markSelection(editor, onReposition);
      }
    }
  };
  return editor.registerRootListener((rootElement) => {
    if (rootElement) {
      const document2 = rootElement.ownerDocument;
      const cleanup = mergeRegister2(registerEventListener2(document2, "selectionchange", onSelectionChange2), () => {
        if (removeSelectionMark !== null) {
          removeSelectionMark();
        }
      });
      onSelectionChange2();
      return cleanup;
    }
  });
}
function getScrollParent(element, includeHidden) {
  const ownerDocument = element.ownerDocument;
  const win = ownerDocument.defaultView || window;
  let style = win.getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
  if (style.position === "fixed") {
    return ownerDocument.body;
  }
  for (let parent = element; parent = getParentElement2(parent); ) {
    style = win.getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }
  return ownerDocument.body;
}
function isMimeType(file, acceptableMimeTypes) {
  for (const acceptableType of acceptableMimeTypes) {
    if (file.type.startsWith(acceptableType)) {
      return true;
    }
  }
  return false;
}
function mediaFileReader(files, acceptableMimeTypes) {
  const filesIterator = files[Symbol.iterator]();
  return new Promise((resolve, reject) => {
    const processed = [];
    const handleNextFile = () => {
      const {
        done,
        value: file
      } = filesIterator.next();
      if (done) {
        return resolve(processed);
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("error", reject);
      fileReader.addEventListener("load", () => {
        const result = fileReader.result;
        if (typeof result === "string") {
          processed.push({
            file,
            result
          });
        }
        handleNextFile();
      });
      if (isMimeType(file, acceptableMimeTypes)) {
        fileReader.readAsDataURL(file);
      } else {
        handleNextFile();
      }
    };
    handleNextFile();
  });
}
function $dfs(startNode, endNode) {
  return Array.from($dfsIterator(startNode, endNode));
}
function $getAdjacentCaret(caret) {
  return caret ? caret.getAdjacentCaret() : null;
}
function $reverseDfs(startNode, endNode) {
  return Array.from($reverseDfsIterator(startNode, endNode));
}
function $dfsIterator(startNode, endNode) {
  return $dfsCaretIterator("next", startNode, endNode);
}
function $dfsWithSlots(startNode, endNode) {
  return Array.from($dfsWithSlotsIterator(startNode, endNode));
}
function* $dfsWithSlotsIterator(startNode, endNode) {
  for (const dfsNode of $dfsCaretIterator("next", startNode, endNode)) {
    yield dfsNode;
    const {
      node,
      depth
    } = dfsNode;
    if ($isSlotHost2(node) && !node.is(endNode)) {
      for (const name of $getSlotNames2(node)) {
        const slot = $getSlot2(node, name);
        if (slot !== null) {
          yield* $dfsSubtreeIterator(slot, depth + 1);
        }
      }
    }
  }
}
function* $dfsSubtreeIterator(node, depth) {
  yield {
    depth,
    node
  };
  const childDepth = depth + 1;
  if ($isSlotHost2(node)) {
    for (const name of $getSlotNames2(node)) {
      const slot = $getSlot2(node, name);
      if (slot !== null) {
        yield* $dfsSubtreeIterator(slot, childDepth);
      }
    }
  }
  if ($isElementNode2(node)) {
    for (const child of node.getChildren()) {
      yield* $dfsSubtreeIterator(child, childDepth);
    }
  }
}
function $getEndCaret(startNode, direction) {
  const rval = $getAdjacentSiblingOrParentSiblingCaret2($getSiblingCaret2(startNode, direction));
  return rval && rval[0];
}
function $dfsCaretIterator(direction, startNode, endNode) {
  const root = $getRoot2();
  const start = startNode || root;
  const startCaret = $isElementNode2(start) ? $getChildCaret2(start, direction) : $getSiblingCaret2(start, direction);
  const startDepth = $getDepth(start);
  const endCaret = endNode ? $getAdjacentChildCaret2($getChildCaretOrSelf2($getSiblingCaret2(endNode, direction))) || $getEndCaret(endNode, direction) : $getEndCaret(start, direction);
  let depth = startDepth;
  return makeStepwiseIterator2({
    hasNext: (state) => state !== null,
    initial: startCaret,
    map: (state) => ({
      depth,
      node: state.origin
    }),
    step: (state) => {
      if (state.isSameNodeCaret(endCaret)) {
        return null;
      }
      if ($isChildCaret2(state)) {
        depth++;
      }
      const rval = $getAdjacentSiblingOrParentSiblingCaret2(state);
      if (!rval || rval[0].isSameNodeCaret(endCaret)) {
        return null;
      }
      depth += rval[1];
      return rval[0];
    }
  });
}
function $getNextSiblingOrParentSibling(node) {
  const rval = $getAdjacentSiblingOrParentSiblingCaret2($getSiblingCaret2(node, "next"));
  return rval && [rval[0].origin, rval[1]];
}
function $getDepth(node) {
  let depth = -1;
  for (
    let innerNode = node;
    innerNode !== null;
    // A slotted node has no parent; climb its slot host instead.
    innerNode = innerNode.getParent() ?? $getSlotHost2(innerNode)
  ) {
    depth++;
  }
  return depth;
}
function $getNextRightPreorderNode(startingNode) {
  const startCaret = $getChildCaretOrSelf2($getSiblingCaret2(startingNode, "previous"));
  const next = $getAdjacentSiblingOrParentSiblingCaret2(startCaret, "root");
  return next && next[0].origin;
}
function $reverseDfsIterator(startNode, endNode) {
  return $dfsCaretIterator("previous", startNode, endNode);
}
function $reverseDfsWithSlots(startNode, endNode) {
  return Array.from($reverseDfsWithSlotsIterator(startNode, endNode));
}
function* $reverseDfsWithSlotsIterator(startNode, endNode) {
  const pending = [];
  for (const dfsNode of $dfsCaretIterator("previous", startNode, endNode)) {
    while (pending.length > 0 && dfsNode.depth <= pending[pending.length - 1].depth) {
      const host = pending.pop();
      yield* $reverseSlotsOf(host.node, host.depth + 1);
    }
    yield dfsNode;
    const {
      node,
      depth
    } = dfsNode;
    if ($isSlotHost2(node) && $getSlotNames2(node).length > 0 && !node.is(endNode)) {
      pending.push({
        depth,
        node
      });
    }
  }
  while (pending.length > 0) {
    const host = pending.pop();
    yield* $reverseSlotsOf(host.node, host.depth + 1);
  }
}
function* $reverseSlotsOf(host, childDepth) {
  const names = $getSlotNames2(host);
  for (let i2 = names.length - 1; i2 >= 0; i2--) {
    const slot = $getSlot2(host, names[i2]);
    if (slot !== null) {
      yield* $reverseDfsSubtreeIterator(slot, childDepth);
    }
  }
}
function* $reverseDfsSubtreeIterator(node, depth) {
  yield {
    depth,
    node
  };
  const childDepth = depth + 1;
  if ($isElementNode2(node)) {
    const children = node.getChildren();
    for (let i2 = children.length - 1; i2 >= 0; i2--) {
      yield* $reverseDfsSubtreeIterator(children[i2], childDepth);
    }
  }
  if ($isSlotHost2(node)) {
    yield* $reverseSlotsOf(node, childDepth);
  }
}
function $getNearestNodeOfType(node, klass) {
  let parent = node;
  while (parent != null) {
    if (parent instanceof klass) {
      return parent;
    }
    parent = parent.getParent();
  }
  return null;
}
function $getNearestBlockElementAncestorOrThrow(startNode) {
  const blockNode = $findMatchingParent2(startNode, (node) => $isElementNode2(node) && !node.isInline());
  if (!$isElementNode2(blockNode)) {
    {
      formatDevErrorMessage3(`Expected node ${startNode.__key} to have closest block element node.`);
    }
  }
  return blockNode;
}
function registerNestedElementResolver(editor, targetNode, cloneNode, handleOverlap) {
  const $isTargetNode = (node) => {
    return node instanceof targetNode;
  };
  const $findMatch = (node) => {
    const children = node.getChildren();
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      if ($isTargetNode(child)) {
        return null;
      }
    }
    let parentNode = node;
    let childNode = node;
    while (parentNode !== null) {
      childNode = parentNode;
      parentNode = parentNode.getParent();
      if ($isTargetNode(parentNode)) {
        return {
          child: childNode,
          parent: parentNode
        };
      }
    }
    return null;
  };
  const $elementNodeTransform = (node) => {
    const match = $findMatch(node);
    if (match !== null) {
      const {
        child,
        parent
      } = match;
      if (child.is(node)) {
        handleOverlap(parent, node);
        const nextSiblings = child.getNextSiblings();
        const nextSiblingsLength = nextSiblings.length;
        parent.insertAfter(child);
        if (nextSiblingsLength !== 0) {
          const newParent = cloneNode(parent);
          child.insertAfter(newParent);
          for (let i2 = 0; i2 < nextSiblingsLength; i2++) {
            newParent.append(nextSiblings[i2]);
          }
        }
        if (!parent.canBeEmpty() && parent.getChildrenSize() === 0) {
          parent.remove();
        }
      }
    }
  };
  return editor.registerNodeTransform(targetNode, $elementNodeTransform);
}
function $restoreEditorState(editor, editorState) {
  const nodeMap = /* @__PURE__ */ new Map();
  const activeEditorState2 = editor._pendingEditorState;
  for (const [key, node] of editorState._nodeMap) {
    nodeMap.set(key, $cloneWithProperties2(node));
  }
  if (activeEditorState2) {
    activeEditorState2._nodeMap = nodeMap;
  }
  $fullReconcile2();
  const selection = editorState._selection;
  $setSelection2(selection === null ? null : selection.clone());
}
function $hasContentAfter(caret) {
  return $isExtendableTextPointCaret2(caret) || $getAdjacentSiblingOrParentSiblingCaret2($isTextPointCaret2(caret) ? caret.getSiblingCaret() : caret, "shadowRoot") !== null;
}
function $insertNodeToNearestRoot(node) {
  const selection = $getSelection2() || $getPreviousSelection2();
  let initialCaret;
  if ($isRangeSelection2(selection)) {
    initialCaret = $caretFromPoint2(selection.focus, "next");
  } else {
    if (selection != null) {
      const nodes = selection.getNodes();
      const lastNode = nodes[nodes.length - 1];
      if (lastNode) {
        initialCaret = $getSiblingCaret2(lastNode, "next");
      }
    }
    initialCaret = initialCaret || $getChildCaret2($getRoot2(), "previous").getFlipped().insert($createParagraphNode2());
  }
  const insertCaret = $insertNodeToNearestRootAtCaret2(node, initialCaret, $hasContentAfter(initialCaret) ? {
    $shouldSplit: (_node, edge) => edge !== "last"
  } : void 0);
  const adjacent = $getAdjacentChildCaret2(insertCaret);
  const selectionCaret = $isChildCaret2(adjacent) ? $normalizeCaret2(adjacent) : insertCaret;
  $setSelectionFromCaretRange2($getCollapsedCaretRange2(selectionCaret));
  return node.getLatest();
}
function $insertNodeIntoLeaf(node) {
  const selection = $getSelection2();
  if (!$isRangeSelection2(selection)) {
    if (selection) {
      selection.insertNodes([node]);
    }
    return;
  }
  const caretRange = $caretRangeFromSelection2(selection);
  let insertCaret = $getCaretRangeInDirection2($removeTextFromCaretRange2(caretRange), "next").anchor;
  if ($isTextPointCaret2(insertCaret)) {
    const nextAnchor = $splitAtPointCaretNext2(insertCaret);
    if (!nextAnchor) {
      return;
    }
    insertCaret = nextAnchor;
  }
  const focus = insertCaret.getFlipped();
  focus.insert(node);
  $setSelectionFromCaretRange2($getCaretRange2(focus, focus));
}
function $wrapNodeInElement(node, createElementNode) {
  const elementNode = createElementNode();
  node.replace(elementNode);
  elementNode.append(node);
  return elementNode;
}
function objectKlassEquals(object, objectClass) {
  if (object == null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(object);
  if (prototype == null || prototype.constructor == null) {
    return false;
  }
  return prototype.constructor.name === objectClass.name;
}
function eventFiles(event) {
  let dataTransfer = null;
  if (objectKlassEquals(event, DragEvent)) {
    dataTransfer = event.dataTransfer;
  } else if (objectKlassEquals(event, ClipboardEvent)) {
    dataTransfer = event.clipboardData;
  }
  if (dataTransfer === null) {
    return [false, [], false];
  }
  const types = dataTransfer.types;
  const hasFiles = types.includes("Files");
  const hasContent = types.includes("text/html") || types.includes("text/plain");
  return [hasFiles, Array.from(dataTransfer.files), hasContent];
}
function $filter(nodes, filterFn) {
  const result = [];
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = filterFn(nodes[i2]);
    if (node !== null) {
      result.push(node);
    }
  }
  return result;
}
function $handleIndentAndOutdent(indentOrOutdent) {
  const selection = $getSelection2();
  if (!$isRangeSelection2(selection)) {
    return false;
  }
  const alreadyHandled = /* @__PURE__ */ new Set();
  const nodes = selection.getNodes();
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = nodes[i2];
    const key = node.getKey();
    if (alreadyHandled.has(key)) {
      continue;
    }
    const parentBlock = $findMatchingParent2(node, (parentNode) => $isElementNode2(parentNode) && !parentNode.isInline());
    if (parentBlock === null) {
      continue;
    }
    const parentKey = parentBlock.getKey();
    if (parentBlock.canIndent() && !alreadyHandled.has(parentKey)) {
      alreadyHandled.add(parentKey);
      indentOrOutdent(parentBlock);
    }
  }
  return alreadyHandled.size > 0;
}
function $insertFirst(parent, node) {
  $getChildCaret2(parent, "next").insert(node);
}
var NEEDS_MANUAL_ZOOM = IS_FIREFOX2 || !CAN_USE_DOM2 ? false : void 0;
function needsManualZoom() {
  if (NEEDS_MANUAL_ZOOM === void 0) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.opacity = "0";
    div.style.width = "100px";
    div.style.left = "-1000px";
    document.body.appendChild(div);
    const noZoom = div.getBoundingClientRect();
    div.style.setProperty("zoom", "2");
    NEEDS_MANUAL_ZOOM = div.getBoundingClientRect().width === noZoom.width;
    document.body.removeChild(div);
  }
  return NEEDS_MANUAL_ZOOM;
}
function calculateZoomLevel(element, useManualZoom = false) {
  let zoom = 1;
  if (needsManualZoom() || useManualZoom) {
    const win = element && element.ownerDocument.defaultView || window;
    while (element) {
      zoom *= Number(win.getComputedStyle(element).getPropertyValue("zoom"));
      element = getParentElement2(element);
    }
  }
  return zoom;
}
function $isEditorIsNestedEditor(editor) {
  return editor._parentEditor !== null;
}
function $unwrapAndFilterDescendants(root, $predicate) {
  return $unwrapAndFilterDescendantsImpl(root, $predicate, null);
}
function $unwrapAndFilterDescendantsImpl(root, $predicate, $onSuccess) {
  let didMutate = false;
  for (const node of $lastToFirstIterator(root)) {
    if ($predicate(node)) {
      if ($onSuccess !== null) {
        $onSuccess(node);
      }
      continue;
    }
    didMutate = true;
    if ($isElementNode2(node)) {
      $unwrapAndFilterDescendantsImpl(node, $predicate, $onSuccess || ((child) => node.insertAfter(child)));
    }
    node.remove();
  }
  return didMutate;
}
function $descendantsMatching(children, $predicate) {
  const result = [];
  const stack = Array.from(children).reverse();
  for (let child = stack.pop(); child !== void 0; child = stack.pop()) {
    if ($predicate(child)) {
      result.push(child);
    } else if ($isElementNode2(child)) {
      for (const grandchild of $lastToFirstIterator(child)) {
        stack.push(grandchild);
      }
    }
  }
  return result;
}
function $firstToLastIterator(node) {
  return $childIterator($getChildCaret2(node, "next"));
}
function $lastToFirstIterator(node) {
  return $childIterator($getChildCaret2(node, "previous"));
}
function $childIterator(startCaret) {
  const seen = /* @__PURE__ */ new Set();
  return makeStepwiseIterator2({
    hasNext: $isSiblingCaret2,
    initial: startCaret.getAdjacentCaret(),
    map: (caret) => {
      const origin = caret.origin.getLatest();
      if (seen !== null) {
        const key = origin.getKey();
        if (!!seen.has(key)) {
          formatDevErrorMessage3(`$childIterator: Cycle detected, node with key ${String(key)} has already been traversed`);
        }
        seen.add(key);
      }
      return origin;
    },
    step: (caret) => caret.getAdjacentCaret()
  });
}
function $unwrapNode(node) {
  $rewindSiblingCaret2($getSiblingCaret2(node, "next")).splice(1, node.getChildren());
}
function makeStateWrapper(stateConfig) {
  const $get = (node) => $getState2(node, stateConfig);
  const $set = (node, valueOrUpdater) => $setState2(node, stateConfig, valueOrUpdater);
  return {
    $get,
    $set,
    accessors: [$get, $set],
    makeGetterMethod: () => function $getter() {
      return $get(this);
    },
    makeSetterMethod: () => function $setter(valueOrUpdater) {
      return $set(this, valueOrUpdater);
    },
    stateConfig
  };
}
function $onEscapeUp($isContainerNode, event) {
  const selection = $getSelection2();
  if ($isRangeSelection2(selection) && selection.isCollapsed()) {
    const containerNode = $findMatchingParent2(selection.anchor.getNode(), $isContainerNode);
    if (containerNode) {
      const parent = containerNode.getParent();
      if (parent !== null && parent.getFirstChild() === containerNode && $isAtStartOfNode(selection.anchor, containerNode)) {
        containerNode.insertBefore($createParagraphNode2()).selectEnd();
        if (event) {
          event.preventDefault();
        }
        return true;
      }
    }
  }
  return false;
}
function $onEscapeDown($isContainerNode, event) {
  const selection = $getSelection2();
  if ($isRangeSelection2(selection) && selection.isCollapsed()) {
    const containerNode = $findMatchingParent2(selection.anchor.getNode(), $isContainerNode);
    if (containerNode) {
      const parent = containerNode.getParent();
      if (parent !== null && parent.getLastChild() === containerNode && $isAtEndOfNode(selection.anchor, containerNode)) {
        containerNode.insertAfter($createParagraphNode2()).selectEnd();
        if (event) {
          event.preventDefault();
        }
        return true;
      }
    }
  }
  return false;
}
function $isAtStartOfNode(point, node) {
  return $isAtEdgeOfElement2(point, node, "previous");
}
function $isAtEndOfNode(point, node) {
  return $isAtEdgeOfElement2(point, node, "next");
}

// node_modules/@lexical/utils/dist/LexicalUtils.mjs
var mod3 = true ? LexicalUtils_dev_exports : LexicalUtils_prod_exports;
var $descendantsMatching2 = mod3.$descendantsMatching;
var $dfs2 = mod3.$dfs;
var $dfsIterator2 = mod3.$dfsIterator;
var $dfsWithSlots2 = mod3.$dfsWithSlots;
var $dfsWithSlotsIterator2 = mod3.$dfsWithSlotsIterator;
var $filter2 = mod3.$filter;
var $findMatchingParent3 = mod3.$findMatchingParent;
var $firstToLastIterator2 = mod3.$firstToLastIterator;
var $getAdjacentCaret2 = mod3.$getAdjacentCaret;
var $getAdjacentSiblingOrParentSiblingCaret3 = mod3.$getAdjacentSiblingOrParentSiblingCaret;
var $getDepth2 = mod3.$getDepth;
var $getNearestBlockElementAncestorOrThrow2 = mod3.$getNearestBlockElementAncestorOrThrow;
var $getNearestNodeOfType2 = mod3.$getNearestNodeOfType;
var $getNextRightPreorderNode2 = mod3.$getNextRightPreorderNode;
var $getNextSiblingOrParentSibling2 = mod3.$getNextSiblingOrParentSibling;
var $handleIndentAndOutdent2 = mod3.$handleIndentAndOutdent;
var $insertFirst2 = mod3.$insertFirst;
var $insertNodeIntoLeaf2 = mod3.$insertNodeIntoLeaf;
var $insertNodeToNearestRoot2 = mod3.$insertNodeToNearestRoot;
var $insertNodeToNearestRootAtCaret3 = mod3.$insertNodeToNearestRootAtCaret;
var $isAtEndOfNode2 = mod3.$isAtEndOfNode;
var $isAtStartOfNode2 = mod3.$isAtStartOfNode;
var $isBlockFullySelected3 = mod3.$isBlockFullySelected;
var $isEditorIsNestedEditor2 = mod3.$isEditorIsNestedEditor;
var $lastToFirstIterator2 = mod3.$lastToFirstIterator;
var $onEscapeDown2 = mod3.$onEscapeDown;
var $onEscapeUp2 = mod3.$onEscapeUp;
var $restoreEditorState2 = mod3.$restoreEditorState;
var $reverseDfs2 = mod3.$reverseDfs;
var $reverseDfsIterator2 = mod3.$reverseDfsIterator;
var $reverseDfsWithSlots2 = mod3.$reverseDfsWithSlots;
var $reverseDfsWithSlotsIterator2 = mod3.$reverseDfsWithSlotsIterator;
var $splitNode3 = mod3.$splitNode;
var $unwrapAndFilterDescendants2 = mod3.$unwrapAndFilterDescendants;
var $unwrapNode2 = mod3.$unwrapNode;
var $wrapNodeInElement2 = mod3.$wrapNodeInElement;
var CAN_USE_BEFORE_INPUT3 = mod3.CAN_USE_BEFORE_INPUT;
var CAN_USE_DOM3 = mod3.CAN_USE_DOM;
var IS_ANDROID3 = mod3.IS_ANDROID;
var IS_ANDROID_CHROME3 = mod3.IS_ANDROID_CHROME;
var IS_APPLE3 = mod3.IS_APPLE;
var IS_APPLE_WEBKIT3 = mod3.IS_APPLE_WEBKIT;
var IS_CHROME3 = mod3.IS_CHROME;
var IS_FIREFOX3 = mod3.IS_FIREFOX;
var IS_IOS3 = mod3.IS_IOS;
var IS_SAFARI3 = mod3.IS_SAFARI;
var addClassNamesToElement3 = mod3.addClassNamesToElement;
var calculateZoomLevel2 = mod3.calculateZoomLevel;
var dedupeSelectionRects2 = mod3.dedupeSelectionRects;
var eventFiles2 = mod3.eventFiles;
var getScrollParent2 = mod3.getScrollParent;
var isBlockDomNode3 = mod3.isBlockDomNode;
var isHTMLAnchorElement3 = mod3.isHTMLAnchorElement;
var isHTMLElement3 = mod3.isHTMLElement;
var isInlineDomNode3 = mod3.isInlineDomNode;
var isMimeType2 = mod3.isMimeType;
var makeStateWrapper2 = mod3.makeStateWrapper;
var markSelection2 = mod3.markSelection;
var mediaFileReader2 = mod3.mediaFileReader;
var mergeRegister3 = mod3.mergeRegister;
var objectKlassEquals2 = mod3.objectKlassEquals;
var positionNodeOnRange = mod3.positionNodeOnRange;
var registerNestedElementResolver2 = mod3.registerNestedElementResolver;
var removeClassNamesFromElement3 = mod3.removeClassNamesFromElement;
var selectionAlwaysOnDisplay2 = mod3.selectionAlwaysOnDisplay;

// node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs
var i = /* @__PURE__ */ Symbol.for("preact-signals");
function t() {
  if (e > 1) {
    e--;
    return;
  }
  let i2, t2 = false;
  !(function() {
    let i3 = r;
    r = void 0;
    while (void 0 !== i3) {
      if (i3.S.v === i3.v) i3.S.i = i3.i;
      i3 = i3.o;
    }
  })();
  while (void 0 !== s) {
    let n2 = s;
    s = void 0;
    u++;
    while (void 0 !== n2) {
      const o2 = n2.u;
      n2.u = void 0;
      n2.f &= -3;
      if (!(8 & n2.f) && w(n2)) try {
        n2.c();
      } catch (n3) {
        if (!t2) {
          i2 = n3;
          t2 = true;
        }
      }
      n2 = o2;
    }
  }
  u = 0;
  e--;
  if (t2) throw i2;
}
function n(i2) {
  if (e > 0) return i2();
  d = ++c;
  e++;
  try {
    return i2();
  } finally {
    t();
  }
}
var o;
var s;
function h(i2) {
  const t2 = o;
  o = void 0;
  try {
    return i2();
  } finally {
    o = t2;
  }
}
var r;
var e = 0;
var u = 0;
var c = 0;
var d = 0;
var v = 0;
function l(i2) {
  if (void 0 === o) return;
  let t2 = i2.n;
  if (void 0 === t2 || t2.t !== o) {
    t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
    if (void 0 !== o.s) o.s.n = t2;
    o.s = t2;
    i2.n = t2;
    if (32 & o.f) i2.S(t2);
    return t2;
  } else if (-1 === t2.i) {
    t2.i = 0;
    if (void 0 !== t2.n) {
      t2.n.p = t2.p;
      if (void 0 !== t2.p) t2.p.n = t2.n;
      t2.p = o.s;
      t2.n = void 0;
      o.s.n = t2;
      o.s = t2;
    }
    return t2;
  }
}
function y(i2, t2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.l = 0;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
y.prototype.brand = i;
y.prototype.h = function() {
  return true;
};
y.prototype.S = function(i2) {
  const t2 = this.t;
  if (t2 !== i2 && void 0 === i2.e) {
    i2.x = t2;
    this.t = i2;
    if (void 0 !== t2) t2.e = i2;
    else h(() => {
      var i3;
      null == (i3 = this.W) || i3.call(this);
    });
  }
};
y.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    const t2 = i2.e, n2 = i2.x;
    if (void 0 !== t2) {
      t2.x = n2;
      i2.e = void 0;
    }
    if (void 0 !== n2) {
      n2.e = t2;
      i2.x = void 0;
    }
    if (i2 === this.t) {
      this.t = n2;
      if (void 0 === n2) h(() => {
        var i3;
        null == (i3 = this.Z) || i3.call(this);
      });
    }
  }
};
y.prototype.subscribe = function(i2) {
  return j(() => {
    const t2 = this.value, n2 = o;
    o = void 0;
    try {
      i2(t2);
    } finally {
      o = n2;
    }
  }, { name: "sub" });
};
y.prototype.valueOf = function() {
  return this.value;
};
y.prototype.toString = function() {
  return this.value + "";
};
y.prototype.toJSON = function() {
  return this.value;
};
y.prototype.peek = function() {
  const i2 = o;
  o = void 0;
  try {
    return this.value;
  } finally {
    o = i2;
  }
};
Object.defineProperty(y.prototype, "value", { get() {
  const i2 = l(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set(i2) {
  if (i2 !== this.v) {
    if (u > 100) throw new Error("Cycle detected");
    !(function(i3) {
      if (0 !== e && 0 === u) {
        if (i3.l !== d) {
          i3.l = d;
          r = { S: i3, v: i3.v, i: i3.i, o: r };
        }
      }
    })(this);
    this.v = i2;
    this.i++;
    v++;
    e++;
    try {
      for (let i3 = this.t; void 0 !== i3; i3 = i3.x) i3.t.N();
    } finally {
      t();
    }
  }
} });
function a(i2, t2) {
  return new y(i2, t2);
}
function w(i2) {
  for (let t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function _(i2) {
  for (let t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    const n2 = t2.S.n;
    if (void 0 !== n2) t2.r = n2;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function b(i2) {
  let t2, n2 = i2.s;
  while (void 0 !== n2) {
    const i3 = n2.p;
    if (-1 === n2.i) {
      n2.S.U(n2);
      if (void 0 !== i3) i3.n = n2.n;
      if (void 0 !== n2.n) n2.n.p = i3;
    } else t2 = n2;
    n2.S.n = n2.r;
    if (void 0 !== n2.r) n2.r = void 0;
    n2 = i3;
  }
  i2.s = t2;
}
function p(i2, t2) {
  y.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = v - 1;
  this.f = 4;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
p.prototype = new y();
p.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === v) return true;
  this.g = v;
  this.f |= 1;
  if (this.i > 0 && !w(this)) {
    this.f &= -2;
    return true;
  }
  const i2 = o;
  try {
    _(this);
    o = this;
    const i3 = this.x();
    if (16 & this.f || this.v !== i3 || 0 === this.i) {
      this.v = i3;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  o = i2;
  b(this);
  this.f &= -2;
  return true;
};
p.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (let i3 = this.s; void 0 !== i3; i3 = i3.n) i3.S.S(i3);
  }
  y.prototype.S.call(this, i2);
};
p.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    y.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (let i3 = this.s; void 0 !== i3; i3 = i3.n) i3.S.U(i3);
    }
  }
};
p.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (let i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(p.prototype, "value", { get() {
  if (1 & this.f) throw new Error("Cycle detected");
  const i2 = l(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function g(i2, t2) {
  return new p(i2, t2);
}
function S(i2) {
  const n2 = i2.m;
  i2.m = void 0;
  if ("function" == typeof n2) {
    e++;
    const s2 = o;
    o = void 0;
    try {
      n2();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      m(i2);
      throw t2;
    } finally {
      o = s2;
      t();
    }
  }
}
function m(i2) {
  for (let t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  S(i2);
}
function x(i2) {
  if (o !== this) throw new Error("Out-of-order effect");
  b(this);
  o = i2;
  this.f &= -2;
  if (8 & this.f) m(this);
  t();
}
function E(i2, t2) {
  this.x = i2;
  this.m = void 0;
  this.s = void 0;
  this.u = void 0;
  this.f = 32;
  this.name = null == t2 ? void 0 : t2.name;
}
E.prototype.c = function() {
  const i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    const t2 = this.x();
    if ("function" == typeof t2) this.m = t2;
  } finally {
    i2();
  }
};
E.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  S(this);
  _(this);
  e++;
  const i2 = o;
  o = this;
  return x.bind(this, i2);
};
E.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.u = s;
    s = this;
  }
};
E.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) m(this);
};
E.prototype.dispose = function() {
  this.d();
};
function j(i2, t2) {
  const n2 = new E(i2, t2);
  try {
    n2.c();
  } catch (i3) {
    n2.d();
    throw i3;
  }
  const o2 = n2.d.bind(n2);
  o2[Symbol.dispose] = o2;
  return o2;
}
function namedSignals(defaults, opts = {}) {
  const initial = {};
  for (const k in defaults) {
    const v2 = opts[k];
    const store = a(v2 === void 0 ? defaults[k] : v2);
    initial[k] = store;
  }
  return initial;
}
var AutoFocusExtension = {
  build: (editor, config, state) => {
    return namedSignals(config);
  },
  config: {
    defaultSelection: "rootEnd",
    disabled: false
  },
  name: "@lexical/extension/AutoFocus",
  register(editor, config, state) {
    const stores = state.getOutput();
    return j(() => stores.disabled.value ? void 0 : editor.registerRootListener((rootElement) => {
      editor.focus(() => {
        const activeElement = rootElement !== null ? getActiveElement2(rootElement) : null;
        if (rootElement !== null && (activeElement === null || !rootElement.contains(activeElement))) {
          rootElement.focus({
            preventScroll: true
          });
        }
      }, {
        defaultSelection: stores.defaultSelection.peek()
      });
    }));
  }
};
function $defaultOnClear() {
  const root = $getRoot2();
  const selection = $getSelection2();
  const paragraph = $createParagraphNode2();
  root.clear();
  root.append(paragraph);
  if (selection !== null) {
    paragraph.select();
  }
  if ($isRangeSelection2(selection)) {
    selection.format = 0;
  }
}
function registerClearEditor(editor, $onClear = $defaultOnClear) {
  return editor.registerCommand(CLEAR_EDITOR_COMMAND2, () => {
    $onClear();
    return true;
  }, COMMAND_PRIORITY_EDITOR2);
}
var ClearEditorExtension = {
  build(editor, config, state) {
    return namedSignals(config);
  },
  config: {
    $onClear: $defaultOnClear
  },
  name: "@lexical/extension/ClearEditor",
  register(editor, config, state) {
    const {
      $onClear
    } = state.getOutput();
    return j(() => registerClearEditor(editor, $onClear.value));
  }
};
function $defaultShouldInsertAfter(node) {
  if ($isDecoratorNode2(node)) {
    return true;
  }
  if ($isElementNode2(node) && node.isShadowRoot()) {
    return true;
  }
  return false;
}
function shouldClaimClick(editor, rootElement, event, $shouldInsertAfter) {
  if (!editor.isEditable()) {
    return false;
  }
  if (event.target !== rootElement) {
    return false;
  }
  return editor.read("latest", () => {
    const lastChild = $getRoot2().getLastChild();
    if (lastChild === null) {
      return false;
    }
    const lastChildDOM = editor.getElementByKey(lastChild.getKey());
    if (lastChildDOM === null) {
      return false;
    }
    if (event.clientY <= lastChildDOM.getBoundingClientRect().bottom) {
      return false;
    }
    return $shouldInsertAfter(lastChild);
  });
}
var ClickAfterLastBlockExtension = {
  build: (_editor, config) => namedSignals(config),
  config: {
    $shouldInsertAfter: $defaultShouldInsertAfter,
    disabled: false
  },
  name: "@lexical/ClickAfterLastBlock",
  register: (editor, _config, _state) => j(() => {
    const output = _state.getOutput();
    if (output.disabled.value) {
      return;
    }
    return editor.registerRootListener((rootElement) => {
      if (rootElement === null) {
        return;
      }
      const onMouseDown = (event) => {
        if (shouldClaimClick(editor, rootElement, event, output.$shouldInsertAfter.peek())) {
          event.preventDefault();
        }
      };
      const onClick2 = (event) => {
        if (!shouldClaimClick(editor, rootElement, event, output.$shouldInsertAfter.peek())) {
          return;
        }
        event.preventDefault();
        stopLexicalPropagation2(event);
        editor.update(() => {
          const lastChild = $getRoot2().getLastChild();
          if (lastChild === null) {
            return;
          }
          if (!output.$shouldInsertAfter.peek()(lastChild)) {
            return;
          }
          const paragraph = $createParagraphNode2();
          lastChild.insertAfter(paragraph);
          paragraph.select();
        });
      };
      return registerEventListeners2(rootElement, {
        click: onClick2,
        mousedown: onMouseDown
      }, true);
    });
  })
};
function getKnownTypesAndNodes(config) {
  const types = /* @__PURE__ */ new Set();
  const nodes = /* @__PURE__ */ new Set();
  for (const klassOrReplacement of getNodeConfig(config)) {
    const klass = typeof klassOrReplacement === "function" ? klassOrReplacement : klassOrReplacement.replace;
    void getStaticNodeConfig2(klass);
    types.add(klass.getType());
    nodes.add(klass);
  }
  return {
    nodes,
    types
  };
}
function getNodeConfig(config) {
  return (typeof config.nodes === "function" ? config.nodes() : config.nodes) || [];
}
var formatState = /* @__PURE__ */ createState2("format", {
  parse: (value) => typeof value === "number" ? value : 0
});
var DecoratorTextNode = class extends DecoratorNode2 {
  /** @internal */
  get __isInlineFormattable() {
    return true;
  }
  $config() {
    return this.config("decorator-text", {
      extends: DecoratorNode2,
      stateConfigs: [{
        flat: true,
        stateConfig: formatState
      }]
    });
  }
  getFormat(version) {
    return $getState2(this, formatState, version);
  }
  getFormatFlags(type, alignWithFormat) {
    return toggleTextFormatType2(this.getFormat(), type, alignWithFormat);
  }
  hasFormat(type) {
    const formatFlag = TEXT_TYPE_TO_FORMAT2[type];
    return (this.getFormat() & formatFlag) !== 0;
  }
  setFormat(type) {
    return $setState2(this, formatState, type);
  }
  toggleFormat(type) {
    const format = this.getFormat();
    const newFormat = toggleTextFormatType2(format, type, null);
    return this.setFormat(newFormat);
  }
  isInline() {
    return true;
  }
  createDOM(config, editor) {
    return $getDocument2().createElement("span");
  }
};
function $isDecoratorTextNode(node) {
  return node instanceof DecoratorTextNode;
}
function applyFormatFromStyle(lexicalNode, style, shouldApply) {
  const fontWeight = style.fontWeight;
  const textDecoration = style.textDecoration.split(" ");
  const hasBoldFontWeight = fontWeight === "700" || fontWeight === "bold";
  const hasLinethroughTextDecoration = textDecoration.includes("line-through");
  const hasItalicFontStyle = style.fontStyle === "italic";
  const hasUnderlineTextDecoration = textDecoration.includes("underline");
  const verticalAlign = style.verticalAlign;
  if (hasBoldFontWeight && !lexicalNode.hasFormat("bold")) {
    lexicalNode.toggleFormat("bold");
  }
  if (hasLinethroughTextDecoration && !lexicalNode.hasFormat("strikethrough")) {
    lexicalNode.toggleFormat("strikethrough");
  }
  if (hasItalicFontStyle && !lexicalNode.hasFormat("italic")) {
    lexicalNode.toggleFormat("italic");
  }
  if (hasUnderlineTextDecoration && !lexicalNode.hasFormat("underline")) {
    lexicalNode.toggleFormat("underline");
  }
  if (verticalAlign === "sub" && !lexicalNode.hasFormat("subscript")) {
    lexicalNode.toggleFormat("subscript");
  }
  if (verticalAlign === "super" && !lexicalNode.hasFormat("superscript")) {
    lexicalNode.toggleFormat("superscript");
  }
  if (shouldApply && !lexicalNode.hasFormat(shouldApply)) {
    lexicalNode.toggleFormat(shouldApply);
  }
  return lexicalNode;
}
function applyFormatToDom(lexicalNode, domNode, tagNameToFormat = DEFAULT_TAG_NAME_TO_FORMAT) {
  let rval = domNode;
  for (const [tag, format] of Object.entries(tagNameToFormat)) {
    if (lexicalNode.hasFormat(format)) {
      rval = wrapElementWith(rval, tag);
    }
  }
  return rval;
}
var $applyFormatToDom = applyFormatToDom;
function wrapElementWith(element, tag) {
  const el = element.ownerDocument.createElement(tag);
  el.appendChild(element);
  return el;
}
var DEFAULT_TAG_NAME_TO_FORMAT = {
  b: "bold",
  code: "code",
  em: "italic",
  i: "italic",
  mark: "highlight",
  s: "strikethrough",
  strong: "bold",
  sub: "subscript",
  sup: "superscript",
  u: "underline"
};
var DecoratorTextExtension = {
  name: "@lexical/extension/DecoratorText",
  nodes: () => [DecoratorTextNode]
};
function watchedSignal(getSnapshot, register) {
  let dispose;
  return a(getSnapshot(), {
    unwatched() {
      if (dispose) {
        dispose();
        dispose = void 0;
      }
    },
    watched() {
      this.value = getSnapshot();
      dispose = register(this);
    }
  });
}
var EditorStateExtension = {
  build(editor) {
    return watchedSignal(() => editor.getEditorState(), (editorStateSignal) => editor.registerUpdateListener((payload) => {
      editorStateSignal.value = payload.editorState;
    }));
  },
  name: "@lexical/extension/EditorState"
};
function formatDevErrorMessage4(message) {
  throw new Error(message);
}
var envLexicalVersion2;
try {
  envLexicalVersion2 = "0.50.0+dev.esm";
} catch (_unused) {
}
var LEXICAL_VERSION2 = envLexicalVersion2 ?? '"<unknown>+source"';
var UNSAFE_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function deepThemeMergeInPlace(a2, b2) {
  if (a2 && b2 && !Array.isArray(b2) && typeof a2 === "object" && typeof b2 === "object") {
    const aObj = a2;
    const bObj = b2;
    for (const k in bObj) {
      if (UNSAFE_KEYS.has(k) || !Object.prototype.hasOwnProperty.call(bObj, k)) {
        continue;
      }
      aObj[k] = deepThemeMergeInPlace(aObj[k], bObj[k]);
    }
    return a2;
  }
  return b2;
}
var ExtensionRepStateIds = {
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  unmarked: 0,
  temporary: 1,
  permanent: 2,
  configured: 3,
  initialized: 4,
  built: 5,
  registered: 6,
  afterRegistration: 7
  /* eslint-enable sort-keys-fix/sort-keys-fix */
};
function isExactlyUnmarkedExtensionRepState(state) {
  return state.id === ExtensionRepStateIds.unmarked;
}
function isExactlyTemporaryExtensionRepState(state) {
  return state.id === ExtensionRepStateIds.temporary;
}
function isExactlyPermanentExtensionRepState(state) {
  return state.id === ExtensionRepStateIds.permanent;
}
function isConfiguredExtensionRepState(state) {
  return state.id >= ExtensionRepStateIds.configured;
}
function isInitializedExtensionRepState(state) {
  return state.id >= ExtensionRepStateIds.initialized;
}
function isBuiltExtensionRepState(state) {
  return state.id >= ExtensionRepStateIds.built;
}
function isAfterRegistrationState(state) {
  return state.id >= ExtensionRepStateIds.afterRegistration;
}
function applyTemporaryMark(state) {
  if (!isExactlyUnmarkedExtensionRepState(state)) {
    formatDevErrorMessage4(`LexicalBuilder: Can not apply a temporary mark from state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.unmarked)} unmarked)`);
  }
  return Object.assign(state, {
    id: ExtensionRepStateIds.temporary
  });
}
function applyPermanentMark(state) {
  if (!isExactlyTemporaryExtensionRepState(state)) {
    formatDevErrorMessage4(`LexicalBuilder: Can not apply a permanent mark from state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.temporary)} temporary)`);
  }
  return Object.assign(state, {
    id: ExtensionRepStateIds.permanent
  });
}
function applyConfiguredState(state, config, registerState) {
  return Object.assign(state, {
    config,
    id: ExtensionRepStateIds.configured,
    registerState
  });
}
function applyInitializedState(state, initResult, registerState) {
  return Object.assign(state, {
    id: ExtensionRepStateIds.initialized,
    initResult,
    registerState
  });
}
function applyBuiltState(state, output, registerState) {
  return Object.assign(state, {
    id: ExtensionRepStateIds.built,
    output,
    registerState
  });
}
function applyRegisteredState(state) {
  return Object.assign(state, {
    id: ExtensionRepStateIds.registered
  });
}
function applyAfterRegistrationState(state) {
  return Object.assign(state, {
    id: ExtensionRepStateIds.afterRegistration
  });
}
function rollbackToBuiltState(state) {
  return Object.assign(state, {
    id: ExtensionRepStateIds.built
  });
}
var emptySet = /* @__PURE__ */ new Set();
var ExtensionRep = class {
  builder;
  configs;
  _dependency;
  _peerNameSet;
  extension;
  state;
  _signal;
  constructor(builder, extension) {
    this.builder = builder;
    this.extension = extension;
    this.configs = /* @__PURE__ */ new Set();
    this.state = {
      id: ExtensionRepStateIds.unmarked
    };
  }
  mergeConfigs() {
    let config = this.extension.config || {};
    const mergeConfig = this.extension.mergeConfig ? this.extension.mergeConfig.bind(this.extension) : shallowMergeConfig2;
    for (const cfg of this.configs) {
      config = mergeConfig(config, cfg);
    }
    return config;
  }
  init(editorConfig) {
    const initialState = this.state;
    if (!isExactlyPermanentExtensionRepState(initialState)) {
      formatDevErrorMessage4(`ExtensionRep: Can not configure from state id ${String(initialState.id)}`);
    }
    const initState = {
      getDependency: this.getInitDependency.bind(this),
      getDirectDependentNames: this.getDirectDependentNames.bind(this),
      getPeer: this.getInitPeer.bind(this),
      getPeerNameSet: this.getPeerNameSet.bind(this)
    };
    const buildState = {
      ...initState,
      getDependency: this.getDependency.bind(this),
      getInitResult: this.getInitResult.bind(this),
      getPeer: this.getPeer.bind(this)
    };
    const state = applyConfiguredState(initialState, this.mergeConfigs(), initState);
    this.state = state;
    let initResult;
    if (this.extension.init) {
      initResult = this.extension.init(editorConfig, state.config, initState);
    }
    this.state = applyInitializedState(state, initResult, buildState);
  }
  build(editor) {
    const state = this.state;
    if (!(state.id === ExtensionRepStateIds.initialized)) {
      formatDevErrorMessage4(`ExtensionRep: register called in state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.built)} initialized)`);
    }
    let output;
    if (this.extension.build) {
      output = this.extension.build(editor, state.config, state.registerState);
    }
    const registerState = {
      ...state.registerState,
      getOutput: () => output,
      getSignal: this.getSignal.bind(this)
    };
    this.state = applyBuiltState(state, output, registerState);
  }
  register(editor, signal2) {
    this._signal = signal2;
    const state = this.state;
    if (!(state.id === ExtensionRepStateIds.built)) {
      formatDevErrorMessage4(`ExtensionRep: register called in state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.built)} built)`);
    }
    const cleanup = this.extension.register && this.extension.register(editor, state.config, state.registerState);
    this.state = applyRegisteredState(state);
    return () => {
      const afterRegistrationState = this.state;
      if (!(afterRegistrationState.id === ExtensionRepStateIds.afterRegistration)) {
        formatDevErrorMessage4(`ExtensionRep: rollbackToBuiltState called in state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.afterRegistration)} afterRegistration)`);
      }
      this.state = rollbackToBuiltState(afterRegistrationState);
      if (cleanup) {
        cleanup();
      }
    };
  }
  afterRegistration(editor) {
    const state = this.state;
    if (!(state.id === ExtensionRepStateIds.registered)) {
      formatDevErrorMessage4(`ExtensionRep: afterRegistration called in state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.registered)} registered)`);
    }
    let rval;
    if (this.extension.afterRegistration) {
      rval = this.extension.afterRegistration(editor, state.config, state.registerState);
    }
    this.state = applyAfterRegistrationState(state);
    return rval;
  }
  getSignal() {
    if (!(this._signal !== void 0)) {
      formatDevErrorMessage4(`ExtensionRep.getSignal() called before register`);
    }
    return this._signal;
  }
  getInitResult() {
    if (!(this.extension.init !== void 0)) {
      formatDevErrorMessage4(`ExtensionRep: getInitResult() called for Extension ${this.extension.name} that does not define init`);
    }
    const state = this.state;
    if (!isInitializedExtensionRepState(state)) {
      formatDevErrorMessage4(`ExtensionRep: getInitResult() called for ExtensionRep in state id ${String(state.id)} < ${String(ExtensionRepStateIds.initialized)} (initialized)`);
    }
    return state.initResult;
  }
  getInitPeer(name) {
    const rep = this.builder.extensionNameMap.get(name);
    return rep ? rep.getExtensionInitDependency() : void 0;
  }
  getExtensionInitDependency() {
    const state = this.state;
    if (!isConfiguredExtensionRepState(state)) {
      formatDevErrorMessage4(`ExtensionRep: getExtensionInitDependency called in state id ${String(state.id)} (expected >= ${String(ExtensionRepStateIds.configured)} configured)`);
    }
    return {
      config: state.config
    };
  }
  getPeer(name) {
    const rep = this.builder.extensionNameMap.get(name);
    return rep ? rep.getExtensionDependency() : void 0;
  }
  getInitDependency(dep) {
    const rep = this.builder.getExtensionRep(dep);
    if (!(rep !== void 0)) {
      formatDevErrorMessage4(`LexicalExtensionBuilder: Extension ${this.extension.name} missing dependency extension ${dep.name} to be in registry`);
    }
    return rep.getExtensionInitDependency();
  }
  getDependency(dep) {
    const rep = this.builder.getExtensionRep(dep);
    if (!(rep !== void 0)) {
      formatDevErrorMessage4(`LexicalExtensionBuilder: Extension ${this.extension.name} missing dependency extension ${dep.name} to be in registry`);
    }
    return rep.getExtensionDependency();
  }
  getState() {
    const state = this.state;
    if (!isAfterRegistrationState(state)) {
      formatDevErrorMessage4(`ExtensionRep getState called in state id ${String(state.id)} (expected ${String(ExtensionRepStateIds.afterRegistration)} afterRegistration)`);
    }
    return state;
  }
  getDirectDependentNames() {
    return this.builder.incomingEdges.get(this.extension.name) || emptySet;
  }
  getPeerNameSet() {
    let s2 = this._peerNameSet;
    if (!s2) {
      s2 = new Set((this.extension.peerDependencies || []).map(([name]) => name));
      this._peerNameSet = s2;
    }
    return s2;
  }
  getExtensionDependency() {
    if (!this._dependency) {
      const state = this.state;
      if (!isBuiltExtensionRepState(state)) {
        formatDevErrorMessage4(`Extension ${this.extension.name} used as a dependency before build`);
      }
      this._dependency = {
        config: state.config,
        init: state.initResult,
        output: state.output
      };
    }
    return this._dependency;
  }
};
var HISTORY_MERGE_OPTIONS = {
  tag: HISTORY_MERGE_TAG2
};
function $defaultInitializer() {
  const root = $getRoot2();
  if (root.isEmpty()) {
    root.append($createParagraphNode2());
  }
}
var InitialStateExtension = {
  config: {
    setOptions: HISTORY_MERGE_OPTIONS,
    updateOptions: HISTORY_MERGE_OPTIONS
  },
  init({
    $initialEditorState = $defaultInitializer
  }) {
    return {
      $initialEditorState,
      initialized: false
    };
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- typescript inference is order dependent here for some reason
  afterRegistration(editor, {
    updateOptions,
    setOptions
  }, state) {
    const initResult = state.getInitResult();
    if (!initResult.initialized) {
      initResult.initialized = true;
      const {
        $initialEditorState
      } = initResult;
      if ($isEditorState2($initialEditorState)) {
        editor.setEditorState($initialEditorState, setOptions);
      } else if (typeof $initialEditorState === "function") {
        editor.update(() => {
          $initialEditorState(editor);
        }, updateOptions);
      } else if ($initialEditorState && (typeof $initialEditorState === "string" || typeof $initialEditorState === "object")) {
        const parsedEditorState = editor.parseEditorState($initialEditorState);
        editor.setEditorState(parsedEditorState, setOptions);
      }
    }
    return () => {
    };
  },
  name: "@lexical/extension/InitialState",
  // These are automatically added by createEditor, we add them here so they are
  // visible during extensionRep.init so extensions can see all known types before the
  // editor is created.
  // (excluding ArtificialNode__DO_NOT_USE because it isn't really public API
  // and shouldn't change anything)
  nodes: [RootNode2, TextNode2, LineBreakNode2, TabNode2, ParagraphNode2]
};
var builderSymbol = /* @__PURE__ */ Symbol.for("@lexical/extension/LexicalBuilder");
function buildEditorFromExtensions(...extensions) {
  return LexicalBuilder.fromExtensions(extensions).buildEditor();
}
function noop() {
}
function defaultOnError(err) {
  throw err;
}
function maybeWithBuilder(editor) {
  return editor;
}
function normalizeExtensionArgument(arg) {
  return Array.isArray(arg) ? arg : [arg];
}
var PACKAGE_VERSION = LEXICAL_VERSION2;
var LexicalBuilder = class _LexicalBuilder {
  roots;
  extensionNameMap;
  outgoingConfigEdges;
  incomingEdges;
  conflicts;
  _sortedExtensionReps;
  PACKAGE_VERSION;
  constructor(roots) {
    this.outgoingConfigEdges = /* @__PURE__ */ new Map();
    this.incomingEdges = /* @__PURE__ */ new Map();
    this.extensionNameMap = /* @__PURE__ */ new Map();
    this.conflicts = /* @__PURE__ */ new Map();
    this.PACKAGE_VERSION = PACKAGE_VERSION;
    this.roots = roots;
    for (const extension of roots) {
      this.addExtension(extension);
    }
  }
  static fromExtensions(extensions) {
    const roots = [normalizeExtensionArgument(InitialStateExtension)];
    for (const extension of extensions) {
      roots.push(normalizeExtensionArgument(extension));
    }
    return new _LexicalBuilder(roots);
  }
  static maybeFromEditor(editor) {
    const builder = maybeWithBuilder(editor)[builderSymbol];
    if (builder) {
      if (!(builder.PACKAGE_VERSION === PACKAGE_VERSION)) {
        formatDevErrorMessage4(`LexicalBuilder.fromEditor: The given editor was created with LexicalBuilder ${builder.PACKAGE_VERSION} but this version is ${PACKAGE_VERSION}. A project should have exactly one copy of LexicalBuilder`);
      }
      if (!(builder instanceof _LexicalBuilder)) {
        formatDevErrorMessage4(`LexicalBuilder.fromEditor: There are multiple copies of the same version of LexicalBuilder in your project, and this editor was created with another one. Your project, or one of its dependencies, has its package.json and/or bundler configured incorrectly.`);
      }
    }
    return builder;
  }
  /** Look up the editor that was created by this LexicalBuilder or throw */
  static fromEditor(editor) {
    const builder = _LexicalBuilder.maybeFromEditor(editor);
    if (!(builder !== void 0)) {
      formatDevErrorMessage4(`LexicalBuilder.fromEditor: The given editor was not created with LexicalBuilder`);
    }
    return builder;
  }
  constructEditor() {
    const {
      $initialEditorState: _$initialEditorState,
      onError,
      onWarn,
      ...editorConfig
    } = this.buildCreateEditorArgs();
    const editor = Object.assign(createEditor2({
      ...editorConfig,
      ...onError ? {
        onError: (err) => {
          onError(err, editor);
        }
      } : {},
      ...onWarn ? {
        onWarn: (err) => {
          onWarn(err, editor);
        }
      } : {}
    }), {
      [builderSymbol]: this
    });
    for (const extensionRep of this.sortedExtensionReps()) {
      extensionRep.build(editor);
    }
    return editor;
  }
  buildEditor() {
    let disposeOnce = noop;
    function dispose() {
      try {
        disposeOnce();
      } finally {
        disposeOnce = noop;
      }
    }
    const editor = Object.assign(this.constructEditor(), {
      dispose,
      [Symbol.dispose]: dispose
    });
    disposeOnce = mergeRegister2(this.registerEditor(editor), () => editor.setRootElement(null));
    return editor;
  }
  hasExtensionByName(name) {
    return this.extensionNameMap.has(name);
  }
  getExtensionRep(extension) {
    const rep = this.extensionNameMap.get(extension.name);
    if (rep) {
      if (!(rep.extension === extension)) {
        formatDevErrorMessage4(`LexicalBuilder: A registered extension with name ${extension.name} exists but does not match the given extension`);
      }
      return rep;
    }
  }
  /**
   * @param configs - Ownership passes to the builder, which retains the array
   *   and may append to it. Callers must pass an array nobody else holds.
   */
  addEdge(fromExtensionName, toExtensionName, configs) {
    const outgoing = this.outgoingConfigEdges.get(fromExtensionName);
    if (outgoing) {
      const existing = outgoing.get(toExtensionName);
      if (existing) {
        existing.push(...configs);
      } else {
        outgoing.set(toExtensionName, configs);
      }
    } else {
      this.outgoingConfigEdges.set(fromExtensionName, /* @__PURE__ */ new Map([[toExtensionName, configs]]));
    }
    const incoming = this.incomingEdges.get(toExtensionName);
    if (incoming) {
      incoming.add(fromExtensionName);
    } else {
      this.incomingEdges.set(toExtensionName, /* @__PURE__ */ new Set([fromExtensionName]));
    }
  }
  addExtension(arg) {
    if (!(this._sortedExtensionReps === void 0)) {
      formatDevErrorMessage4(`LexicalBuilder: addExtension called after finalization`);
    }
    const normalized = normalizeExtensionArgument(arg);
    const [extension] = normalized;
    if (!(typeof extension.name === "string")) {
      formatDevErrorMessage4(`LexicalBuilder: extension name must be string, not ${typeof extension.name}`);
    }
    let extensionRep = this.extensionNameMap.get(extension.name);
    if (!(extensionRep === void 0 || extensionRep.extension === extension)) {
      formatDevErrorMessage4(`LexicalBuilder: Multiple extensions registered with name ${extension.name}, names must be unique`);
    }
    if (!extensionRep) {
      extensionRep = new ExtensionRep(this, extension);
      this.extensionNameMap.set(extension.name, extensionRep);
      const hasConflict = this.conflicts.get(extension.name);
      if (typeof hasConflict === "string") {
        {
          formatDevErrorMessage4(`LexicalBuilder: extension ${extension.name} conflicts with ${hasConflict}`);
        }
      }
      for (const name of extension.conflictsWith || []) {
        if (!!this.extensionNameMap.has(name)) {
          formatDevErrorMessage4(`LexicalBuilder: extension ${extension.name} conflicts with ${name}`);
        }
        this.conflicts.set(name, extension.name);
      }
      for (const dep of extension.dependencies || []) {
        const normDep = normalizeExtensionArgument(dep);
        this.addEdge(extension.name, normDep[0].name, normDep.slice(1));
        this.addExtension(normDep);
      }
      for (const [depName, config] of extension.peerDependencies || []) {
        this.addEdge(extension.name, depName, config ? [config] : []);
      }
    }
  }
  sortedExtensionReps() {
    if (this._sortedExtensionReps) {
      return this._sortedExtensionReps;
    }
    const sortedExtensionReps = [];
    const visit = (rep, fromExtensionName) => {
      let mark = rep.state;
      if (isExactlyPermanentExtensionRepState(mark)) {
        return;
      }
      const extensionName = rep.extension.name;
      if (!isExactlyUnmarkedExtensionRepState(mark)) {
        formatDevErrorMessage4(`LexicalBuilder: Circular dependency detected for Extension ${extensionName} from ${fromExtensionName || "[unknown]"}`);
      }
      mark = applyTemporaryMark(mark);
      rep.state = mark;
      const outgoingConfigEdges = this.outgoingConfigEdges.get(extensionName);
      if (outgoingConfigEdges) {
        for (const toExtensionName of outgoingConfigEdges.keys()) {
          const toRep = this.extensionNameMap.get(toExtensionName);
          if (toRep) {
            visit(toRep, extensionName);
          }
        }
      }
      mark = applyPermanentMark(mark);
      rep.state = mark;
      sortedExtensionReps.push(rep);
    };
    for (const rep of this.extensionNameMap.values()) {
      if (isExactlyUnmarkedExtensionRepState(rep.state)) {
        visit(rep);
      }
    }
    for (const rep of sortedExtensionReps) {
      for (const [toExtensionName, configs] of this.outgoingConfigEdges.get(rep.extension.name) || []) {
        if (configs.length > 0) {
          const toRep = this.extensionNameMap.get(toExtensionName);
          if (toRep) {
            for (const config of configs) {
              toRep.configs.add(config);
            }
          }
        }
      }
    }
    for (const [extension, ...configs] of this.roots) {
      if (configs.length > 0) {
        const toRep = this.extensionNameMap.get(extension.name);
        if (!(toRep !== void 0)) {
          formatDevErrorMessage4(`LexicalBuilder: Expecting existing ExtensionRep for ${extension.name}`);
        }
        for (const config of configs) {
          toRep.configs.add(config);
        }
      }
    }
    this._sortedExtensionReps = sortedExtensionReps;
    return this._sortedExtensionReps;
  }
  registerEditor(editor) {
    const extensionReps = this.sortedExtensionReps();
    const controller = new AbortController();
    const cleanups = [() => controller.abort()];
    const signal2 = controller.signal;
    for (const extensionRep of extensionReps) {
      const cleanup = extensionRep.register(editor, signal2);
      if (cleanup) {
        cleanups.push(cleanup);
      }
    }
    for (const extensionRep of extensionReps) {
      const cleanup = extensionRep.afterRegistration(editor);
      if (cleanup) {
        cleanups.push(cleanup);
      }
    }
    return mergeRegister2(...cleanups);
  }
  buildCreateEditorArgs() {
    const config = {};
    const nodes = /* @__PURE__ */ new Set();
    const replacedNodes = /* @__PURE__ */ new Map();
    const htmlExport = /* @__PURE__ */ new Map();
    const htmlImport = {};
    const theme = {};
    const extensionReps = this.sortedExtensionReps();
    for (const extensionRep of extensionReps) {
      const {
        extension
      } = extensionRep;
      if (extension.onError !== void 0) {
        config.onError = extension.onError;
      }
      if (extension.onWarn !== void 0) {
        config.onWarn = extension.onWarn;
      }
      if (extension.disableEvents !== void 0) {
        config.disableEvents = extension.disableEvents;
      }
      if (extension.parentEditor !== void 0) {
        config.parentEditor = extension.parentEditor;
      }
      if (extension.editable !== void 0) {
        config.editable = extension.editable;
      }
      if (extension.namespace !== void 0) {
        config.namespace = extension.namespace;
      }
      if (extension.$initialEditorState !== void 0) {
        config.$initialEditorState = extension.$initialEditorState;
      }
      if (extension.nodes) {
        for (const node of getNodeConfig(extension)) {
          if (typeof node !== "function") {
            const conflictExtension = replacedNodes.get(node.replace);
            if (conflictExtension) {
              {
                formatDevErrorMessage4(`LexicalBuilder: Extension ${extension.name} can not register replacement for node ${node.replace.name} because ${conflictExtension.extension.name} already did`);
              }
            }
            replacedNodes.set(node.replace, extensionRep);
          }
          nodes.add(node);
        }
      }
      if (extension.html) {
        if (extension.html.export) {
          for (const [k, v2] of extension.html.export.entries()) {
            htmlExport.set(k, v2);
          }
        }
        if (extension.html.import) {
          Object.assign(htmlImport, extension.html.import);
        }
      }
      if (extension.theme) {
        deepThemeMergeInPlace(theme, extension.theme);
      }
    }
    if (Object.keys(theme).length > 0) {
      config.theme = theme;
    }
    if (nodes.size) {
      config.nodes = [...nodes];
    }
    const hasImport = Object.keys(htmlImport).length > 0;
    const hasExport = htmlExport.size > 0;
    if (hasImport || hasExport) {
      config.html = {};
      if (hasImport) {
        config.html.import = htmlImport;
      }
      if (hasExport) {
        config.html.export = htmlExport;
      }
    }
    for (const extensionRep of extensionReps) {
      extensionRep.init(config);
    }
    if (!config.onError) {
      config.onError = defaultOnError;
    }
    return config;
  }
};
function getExtensionDependencyFromEditor(editor, extension) {
  const builder = LexicalBuilder.fromEditor(editor);
  const rep = builder.getExtensionRep(extension);
  if (!(rep !== void 0)) {
    formatDevErrorMessage4(`getExtensionDependencyFromEditor: Extension ${extension.name} was not built when creating this editor`);
  }
  return rep.getExtensionDependency();
}
function getPeerDependencyFromEditor(editor, extensionName) {
  const builder = LexicalBuilder.maybeFromEditor(editor);
  if (!builder) return void 0;
  const peer = builder.extensionNameMap.get(extensionName);
  return peer ? peer.getExtensionDependency() : void 0;
}
function getPeerDependencyFromEditorOrThrow(editor, extensionName) {
  const dep = getPeerDependencyFromEditor(editor, extensionName);
  if (!(dep !== void 0)) {
    formatDevErrorMessage4(`getPeerDependencyFromEditorOrThrow: Editor was not built with Extension ${extensionName}`);
  }
  return dep;
}
function $getExtensionDependency(extension) {
  return getExtensionDependencyFromEditor($getEditor2(), extension);
}
function $getExtensionOutput(extension) {
  return $getExtensionDependency(extension).output;
}
function $getPeerDependency(extensionName) {
  return getPeerDependencyFromEditor($getEditor2(), extensionName);
}
var SCRATCH_STATE_JSON = {
  root: {
    children: [],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1
  }
};
function serializeSelection(selection) {
  if ($isRangeSelection2(selection)) {
    return {
      anchor: {
        key: selection.anchor.key,
        offset: selection.anchor.offset,
        type: selection.anchor.type
      },
      focus: {
        key: selection.focus.key,
        offset: selection.focus.offset,
        type: selection.focus.type
      },
      format: selection.format,
      style: selection.style,
      type: "range"
    };
  }
  if ($isNodeSelection2(selection)) {
    return {
      keys: [...selection._nodes],
      type: "node"
    };
  }
  return null;
}
function $serializeNodeVersion(node) {
  const json = node.exportJSON();
  delete json.children;
  delete json.$slots;
  const version = {
    json,
    key: node.__key,
    next: node.__next,
    parent: node.__parent,
    prev: node.__prev
  };
  if ($isElementNode2(node)) {
    version.first = node.__first;
    version.last = node.__last;
    version.size = node.__size;
  }
  const {
    __slotHost,
    __slots
  } = node;
  if (__slots != null) {
    version.slots = [...__slots];
  }
  if (__slotHost != null) {
    version.slotHost = __slotHost;
  }
  return version;
}
function serializeEditorStateFamily(states) {
  const ids = /* @__PURE__ */ new Map();
  const nodes = [];
  const serializedStates = states.map((state) => (
    // exportJSON reads through getLatest(), so each state's nodes are
    // serialized with that state active.
    state.read(() => {
      const stateNodes = [];
      for (const node of state._nodeMap.values()) {
        let id = ids.get(node);
        if (id === void 0) {
          id = nodes.length;
          ids.set(node, id);
          nodes.push($serializeNodeVersion(node));
        }
        stateNodes.push(id);
      }
      return {
        nodes: stateNodes,
        selection: serializeSelection(state._selection)
      };
    })
  ));
  return {
    nodes,
    states: serializedStates
  };
}
function isObject(raw) {
  return raw != null && typeof raw === "object";
}
function isLink(raw) {
  return raw === null || raw === void 0 || typeof raw === "string";
}
function isSerializedNodeVersion(raw) {
  if (!isObject(raw)) {
    return false;
  }
  const {
    first,
    json,
    key,
    last,
    next,
    parent,
    prev,
    size,
    slotHost,
    slots
  } = raw;
  return isObject(json) && typeof json.type === "string" && typeof key === "string" && isLink(parent) && isLink(prev) && isLink(next) && isLink(first) && isLink(last) && (size === void 0 || typeof size === "number") && isLink(slotHost) && (slots === void 0 || Array.isArray(slots) && slots.every((slot) => Array.isArray(slot) && slot.length === 2 && typeof slot[0] === "string" && typeof slot[1] === "string"));
}
function isSerializedFamilyPoint(raw) {
  return isObject(raw) && typeof raw.key === "string" && typeof raw.offset === "number" && (raw.type === "text" || raw.type === "element");
}
function isSerializedFamilySelection(raw) {
  if (raw === null || raw === void 0) {
    return true;
  }
  if (!isObject(raw)) {
    return false;
  }
  if (raw.type === "node") {
    return Array.isArray(raw.keys) && raw.keys.every((key) => typeof key === "string");
  }
  return raw.type === "range" && isSerializedFamilyPoint(raw.anchor) && isSerializedFamilyPoint(raw.focus) && typeof raw.format === "number" && typeof raw.style === "string";
}
function isSerializedEditorStateFamily(raw) {
  if (!isObject(raw)) {
    return false;
  }
  const {
    nodes,
    states
  } = raw;
  return Array.isArray(nodes) && Array.isArray(states) && nodes.every(isSerializedNodeVersion) && states.every((state) => isObject(state) && Array.isArray(state.nodes) && state.nodes.every((id) => typeof id === "number" && id >= 0 && id < nodes.length) && isSerializedFamilySelection(state.selection));
}
function $buildNodeVersion(json, editor) {
  if (json.type !== "root") {
    return $parseSerializedNode2(json);
  }
  let root;
  editor.parseEditorState({
    root: json
  }, () => {
    root = $getRoot2();
  });
  if (root === void 0) {
    throw new Error("editorStateFamily: the root version did not parse");
  }
  return root;
}
function $restoreSelection(serialized, keys) {
  if (serialized == null) {
    return null;
  }
  if (serialized.type === "node") {
    const selection2 = $createNodeSelection2();
    for (const key of serialized.keys) {
      const restored = keys.get(key);
      if (restored === void 0) {
        return null;
      }
      selection2._nodes.add(restored);
    }
    return selection2;
  }
  const anchorKey = keys.get(serialized.anchor.key);
  const focusKey = keys.get(serialized.focus.key);
  if (anchorKey === void 0 || focusKey === void 0) {
    return null;
  }
  const selection = $createRangeSelection2();
  selection.anchor.key = anchorKey;
  selection.anchor.offset = serialized.anchor.offset;
  selection.anchor.type = serialized.anchor.type;
  selection.focus.key = focusKey;
  selection.focus.offset = serialized.focus.offset;
  selection.focus.type = serialized.focus.type;
  selection.format = serialized.format;
  selection.style = serialized.style;
  return selection;
}
function deserializeEditorStateFamily(family, editor) {
  const versions = [];
  const keys = /* @__PURE__ */ new Map();
  let slotsUsed = false;
  let linked = false;
  const template = editor.parseEditorState(SCRATCH_STATE_JSON, () => {
    for (const version of family.nodes) {
      let node = null;
      try {
        node = $buildNodeVersion(version.json, editor);
      } catch (_unused) {
        versions.push(null);
        continue;
      }
      const key = keys.get(version.key);
      if (key === void 0) {
        keys.set(version.key, node.__key);
      } else {
        node.__key = key;
      }
      versions.push(node);
    }
    const mapKey = (key) => key === null ? null : keys.get(key) ?? null;
    for (const [index, version] of family.nodes.entries()) {
      const node = versions[index];
      if (node === null) {
        continue;
      }
      node.__parent = mapKey(version.parent);
      node.__prev = mapKey(version.prev);
      node.__next = mapKey(version.next);
      if ($isElementNode2(node)) {
        node.__first = mapKey(version.first ?? null);
        node.__last = mapKey(version.last ?? null);
        node.__size = version.size ?? 0;
      }
      const slotted = node;
      if (version.slots !== void 0) {
        slotsUsed = true;
        slotted.__slots = new Map(version.slots.flatMap(([name, key]) => {
          const restored = mapKey(key);
          return restored === null ? [] : [[name, restored]];
        }));
      }
      if (version.slotHost !== void 0) {
        slotted.__slotHost = mapKey(version.slotHost);
      }
    }
    linked = true;
  });
  if (!linked) {
    return family.states.map(() => null);
  }
  return family.states.map((serializedState) => {
    const nodeMap = /* @__PURE__ */ new Map();
    for (const id of serializedState.nodes) {
      const node = versions[id];
      if (node === void 0 || node === null) {
        return null;
      }
      nodeMap.set(node.__key, node);
    }
    if (!nodeMap.has("root")) {
      return null;
    }
    const state = template.clone($restoreSelection(serializedState.selection, keys));
    state._nodeMap = nodeMap;
    state._slotsUsed = slotsUsed;
    state._parsed = false;
    return state;
  });
}
var RootElementExtension = {
  build(editor) {
    return watchedSignal(() => editor.getRootElement(), (rootElementSignal) => editor.registerRootListener((rootElement) => {
      rootElementSignal.value = rootElement;
    }));
  },
  name: "@lexical/extension/RootElement"
};
var WatchEditableExtension = {
  build(editor) {
    return watchedSignal(() => editor.isEditable(), (signal2) => editor.registerEditableListener((editable) => {
      signal2.value = editable;
    }));
  },
  name: "@lexical/extension/WatchEditable"
};
var HMR_KEY = "lexicalHMR";
var HISTORY_EXTENSION_NAME = "@lexical/history/History";
var HMR_EXTENSION_NAME = "@lexical/extension/HMR";
function getHMRKey(id, namespace) {
  const base = `${HMR_KEY}:${encodeURIComponent(namespace)}`;
  return id !== void 0 ? `${base}:${encodeURIComponent(id)}` : base;
}
function getEditorHMRKey(editor, configId) {
  const namespace = hasConfiguredNamespace(editor) ? editor._config.namespace : "";
  return getHMRKey(configId === "" ? void 0 : configId, namespace);
}
function sharesParentHMRKey(editor, hmrKey) {
  const parentEditor = editor._parentEditor;
  if (parentEditor === null) {
    return false;
  }
  const peer = getPeerDependencyFromEditor(parentEditor, HMR_EXTENSION_NAME);
  if (peer === void 0) {
    return false;
  }
  return getEditorHMRKey(parentEditor, peer.config.id) === hmrKey;
}
function hasConfiguredNamespace(editor) {
  const builder = LexicalBuilder.maybeFromEditor(editor);
  if (!builder) {
    return false;
  }
  for (const rep of builder.extensionNameMap.values()) {
    const {
      namespace
    } = rep.extension;
    if (namespace && namespace === editor._config.namespace) {
      return true;
    }
  }
  return editor._parentEditor !== null && hasConfiguredNamespace(editor._parentEditor);
}
var warnedSharedKeys = /* @__PURE__ */ new Set();
function warnOnSharedKey(hmrKey, prev, editor) {
  const owner = prev.owner;
  if (owner === void 0 || owner === editor || prev.mounted !== true || owner.getRootElement() === null || warnedSharedKeys.has(hmrKey)) {
    return;
  }
  warnedSharedKeys.add(hmrKey);
  console.warn(`HMR: Two mounted editors are sharing the HMR key "${hmrKey}", so they will overwrite each other's saved state. Give each editor a distinct \`namespace\`, or a distinct \`HMRConfig.id\`.`);
}
function getSavedHMRState(hot, key) {
  return hot.data[key];
}
function isEditorStateLike(raw) {
  return typeof raw === "object" && raw !== null && typeof raw.toJSON === "function" && typeof raw.isEmpty === "function";
}
function isValidHMRSavedState(raw) {
  if (raw == null || typeof raw !== "object") {
    return false;
  }
  const s2 = raw;
  const has = (k) => Object.prototype.hasOwnProperty.call(s2, k);
  return has("editable") && has("editorState") && typeof s2.editable === "boolean" && isEditorStateLike(s2.editorState);
}
function isSerializedHMRState(raw) {
  if (raw == null || typeof raw !== "object") {
    return false;
  }
  const {
    family,
    history
  } = raw;
  if (!isSerializedEditorStateFamily(family)) {
    return false;
  }
  if (history == null) {
    return true;
  }
  const isIndex = (value) => typeof value === "number" && value >= 0 && value < family.states.length;
  const {
    current,
    redoStack,
    undoStack
  } = history;
  return (current === null || isIndex(current)) && Array.isArray(redoStack) && redoStack.every(isIndex) && Array.isArray(undoStack) && undoStack.every(isIndex);
}
function serializeHMRState(editor, editorState, historyState) {
  const states = [editorState];
  let foreign = 0;
  const own = (entry) => {
    const isOwn = entry.editor === editor;
    if (!isOwn) {
      foreign++;
    }
    return isOwn;
  };
  const add = (entry) => states.push(entry.editorState) - 1;
  const addStack = (stack) => stack.filter(own).map(add);
  const history = historyState ? {
    current: historyState.current && own(historyState.current) ? add(historyState.current) : null,
    redoStack: addStack(historyState.redoStack),
    undoStack: addStack(historyState.undoStack)
  } : null;
  if (foreign > 0) {
    console.warn(`HMR: Left behind ${foreign} undo/redo ${foreign === 1 ? "entry" : "entries"} recorded by another editor sharing this history. They can only be applied to the editor that recorded them, which this reload replaced.`);
  }
  return {
    family: serializeEditorStateFamily(states),
    history
  };
}
function restoreHistoryState(history, states, editor) {
  let dropped = 0;
  const restoreEntry = (index) => {
    const editorState = states[index];
    if (editorState == null || editorState.isEmpty()) {
      dropped++;
      return null;
    }
    return {
      editor,
      editorState
    };
  };
  const restoreStack = (indices) => indices.map(restoreEntry).filter((entry) => entry !== null);
  const current = history.current === null ? null : restoreEntry(history.current);
  const undoStack = restoreStack(history.undoStack);
  const redoStack = restoreStack(history.redoStack);
  if (dropped > 0) {
    console.warn(`HMR: Dropped ${dropped} undo/redo ${dropped === 1 ? "entry" : "entries"} that could not be restored.`);
  }
  return {
    current,
    redoStack,
    undoStack
  };
}
var HMRExtension = {
  afterRegistration(editor, {
    hot,
    id: configId
  }, state) {
    if (!hot) {
      return () => {
      };
    }
    const hmrKey = getEditorHMRKey(editor, configId);
    {
      if (configId === "") {
        console.warn('HMR: `id` must not be an empty string. Use a stable non-empty string literal (e.g. `"main"`, `"sidebar"`).');
      }
      if (sharesParentHMRKey(editor, hmrKey)) {
        console.warn(`HMR: This editor is nested inside another and inherits its namespace, so both use the HMR key "${hmrKey}" and will overwrite each other. Give the nested editor a distinct \`HMRConfig.id\` (or its own \`namespace\`).`);
      }
    }
    const historyPeer = getPeerDependencyFromEditor(editor, HISTORY_EXTENSION_NAME);
    let restored = false;
    const saved = getSavedHMRState(hot, hmrKey);
    if (isValidHMRSavedState(saved)) {
      try {
        editor.setEditable(saved.editable);
        const serialized = typeof saved.serialize === "function" ? saved.serialize() : null;
        if (!isSerializedHMRState(serialized)) {
          {
            console.warn("HMR: The saved state could not be read \u2014 it was written by a different build of HMRExtension. Starting fresh.");
          }
        } else {
          const states = deserializeEditorStateFamily(serialized.family, editor);
          const restoredState = states[0];
          if (restoredState == null) {
            {
              console.warn("HMR: Could not restore previous editor state. Starting fresh.");
            }
          } else if (!restoredState.isEmpty()) {
            restoredState._parsed = true;
            editor.setEditorState(restoredState, {
              tag: HISTORY_MERGE_TAG2
            });
            if (serialized.history != null) {
              if (historyPeer) {
                historyPeer.output.historyState.value = restoreHistoryState(serialized.history, states, editor);
              } else {
                console.warn("HMR: Saved undo/redo history discarded \u2014 HistoryExtension is no longer configured.");
              }
            }
            restored = true;
          }
        }
      } catch (e2) {
        {
          console.warn("HMR: Could not restore previous editor state. Starting fresh.", e2);
        }
      }
    }
    if (restored) {
      state.getInitResult().restoreCount.value++;
    }
    const editorStateSignal = state.getDependency(EditorStateExtension).output;
    const editableSignal = state.getDependency(WatchEditableExtension).output;
    const rootElementSignal = state.getDependency(RootElementExtension).output;
    let written = null;
    return j(() => {
      const editorState = editorStateSignal.value;
      const editable = editableSignal.value;
      const mounted = rootElementSignal.value !== null;
      const prev = getSavedHMRState(hot, hmrKey);
      if (mounted && isValidHMRSavedState(prev)) {
        warnOnSharedKey(hmrKey, prev, editor);
      }
      if (written !== null && written.editorState === editorState && written.editable === editable) {
        if (isValidHMRSavedState(prev) && prev.owner === editor) {
          prev.mounted = mounted;
        }
        return;
      }
      written = {
        editable,
        editorState
      };
      const validPrev = editorState.isEmpty() && isValidHMRSavedState(prev) ? prev : null;
      const nextState = {
        ...validPrev ?? {
          editorState,
          serialize: () => serializeHMRState(
            editor,
            editorState,
            // peek() — avoid subscribing this effect to historyState
            // changes; @lexical/history mutates the HistoryState in place,
            // so this reads the latest history when it is finally called.
            historyPeer ? historyPeer.output.historyState.peek() : null
          )
        },
        editable,
        mounted,
        owner: editor
      };
      hot.data[hmrKey] = nextState;
    });
  },
  build: (_editor, _config, state) => state.getInitResult(),
  config: {
    hot: null
  },
  dependencies: [EditorStateExtension, RootElementExtension, WatchEditableExtension],
  init: () => ({
    restoreCount: a(0)
  }),
  name: HMR_EXTENSION_NAME
};
var EMPTY_SET = /* @__PURE__ */ new Set();
var NodeSelectionExtension = {
  build(editor, config, state) {
    const editorStateStore = state.getDependency(EditorStateExtension).output;
    const watchedNodeStore = a({
      watchedNodeKeys: /* @__PURE__ */ new Map()
    });
    const selectedNodeKeys = watchedSignal(() => void 0, () => j(() => {
      const prevSelectedNodeKeys = selectedNodeKeys.peek();
      const {
        watchedNodeKeys
      } = watchedNodeStore.value;
      let nextSelectedNodeKeys;
      let didChange = false;
      editorStateStore.value.read(() => {
        const selection = $getSelection2();
        if (selection) {
          for (const [key, listeners] of watchedNodeKeys.entries()) {
            if (listeners.size === 0) {
              watchedNodeKeys.delete(key);
              continue;
            }
            const node = $getNodeByKey2(key);
            const isSelected = node && node.isSelected() || false;
            didChange = didChange || isSelected !== (prevSelectedNodeKeys ? prevSelectedNodeKeys.has(key) : false);
            if (isSelected) {
              nextSelectedNodeKeys = nextSelectedNodeKeys || /* @__PURE__ */ new Set();
              nextSelectedNodeKeys.add(key);
            }
          }
        }
      });
      if (!(!didChange && nextSelectedNodeKeys && prevSelectedNodeKeys && nextSelectedNodeKeys.size === prevSelectedNodeKeys.size)) {
        selectedNodeKeys.value = nextSelectedNodeKeys;
      }
    }));
    function watchNodeKey(key) {
      const watcher = g(() => (selectedNodeKeys.value || EMPTY_SET).has(key));
      const {
        watchedNodeKeys
      } = watchedNodeStore.peek();
      let listeners = watchedNodeKeys.get(key);
      const hadListener = listeners !== void 0;
      listeners = listeners || /* @__PURE__ */ new Set();
      listeners.add(watcher);
      if (!hadListener) {
        watchedNodeKeys.set(key, listeners);
        watchedNodeStore.value = {
          watchedNodeKeys
        };
      }
      return watcher;
    }
    return {
      watchNodeKey
    };
  },
  dependencies: [EditorStateExtension],
  name: "@lexical/extension/NodeSelection"
};
var INSERT_HORIZONTAL_RULE_COMMAND = /* @__PURE__ */ createCommand2("INSERT_HORIZONTAL_RULE_COMMAND");
var HorizontalRuleNode = class extends DecoratorNode2 {
  $config() {
    return this.config("horizontalrule", {
      importDOM: {
        hr: () => ({
          conversion: $convertHorizontalRuleElement,
          priority: 0
        })
      }
    });
  }
  exportDOM() {
    return {
      element: $getDocument2().createElement("hr")
    };
  }
  createDOM(config) {
    const element = $getDocument2().createElement("hr");
    addClassNamesToElement2(element, config.theme.hr);
    return element;
  }
  getTextContent() {
    return "\n";
  }
  isInline() {
    return false;
  }
  updateDOM() {
    return false;
  }
};
function $convertHorizontalRuleElement() {
  return {
    node: $createHorizontalRuleNode()
  };
}
function $createHorizontalRuleNode() {
  return $create2(HorizontalRuleNode);
}
function $isHorizontalRuleNode(node) {
  return node instanceof HorizontalRuleNode;
}
function $toggleNodeSelection(node, shiftKey = false) {
  const selection = $getSelection2();
  const wasSelected = node.isSelected();
  const key = node.getKey();
  let nodeSelection;
  if (shiftKey && $isNodeSelection2(selection)) {
    nodeSelection = selection;
  } else {
    nodeSelection = $createNodeSelection2();
    $setSelection2(nodeSelection);
  }
  if (wasSelected) {
    nodeSelection.delete(key);
  } else {
    nodeSelection.add(key);
  }
}
var HorizontalRuleExtension = {
  dependencies: [EditorStateExtension, NodeSelectionExtension],
  name: "@lexical/extension/HorizontalRule",
  nodes: () => [HorizontalRuleNode],
  register(editor, config, state) {
    const {
      watchNodeKey
    } = state.getDependency(NodeSelectionExtension).output;
    const nodeSelectionStore = a({
      nodeSelections: /* @__PURE__ */ new Map()
    });
    const isSelectedClassName = editor._config.theme.hrSelected ?? "selected";
    return mergeRegister2(editor.registerCommand(INSERT_HORIZONTAL_RULE_COMMAND, (type) => {
      const selection = $getSelection2();
      if (!$isRangeSelection2(selection)) {
        return false;
      }
      const focusNode = selection.focus.getNode();
      if (focusNode !== null) {
        const horizontalRuleNode = $createHorizontalRuleNode();
        $insertNodeToNearestRoot2(horizontalRuleNode);
      }
      return true;
    }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(CLICK_COMMAND2, (event) => {
      if (isDOMNode2(event.target)) {
        const node = $getNodeFromDOMNode2(event.target);
        if ($isHorizontalRuleNode(node)) {
          $toggleNodeSelection(node, event.shiftKey);
          return true;
        }
      }
      return false;
    }, COMMAND_PRIORITY_LOW2), editor.registerMutationListener(HorizontalRuleNode, (nodes, payload) => {
      n(() => {
        let didChange = false;
        const {
          nodeSelections
        } = nodeSelectionStore.peek();
        for (const [k, v2] of nodes.entries()) {
          if (v2 === "destroyed") {
            nodeSelections.delete(k);
            didChange = true;
          } else {
            const prev = nodeSelections.get(k);
            const dom = editor.getElementByKey(k);
            if (prev) {
              prev.domNode.value = dom;
            } else {
              didChange = true;
              nodeSelections.set(k, {
                domNode: a(dom),
                selectedSignal: watchNodeKey(k)
              });
            }
          }
        }
        if (didChange) {
          nodeSelectionStore.value = {
            nodeSelections
          };
        }
      });
    }), j(() => {
      const effects = [];
      for (const {
        domNode,
        selectedSignal
      } of nodeSelectionStore.value.nodeSelections.values()) {
        effects.push(j(() => {
          const dom = domNode.value;
          if (dom) {
            const isSelected = selectedSignal.value;
            if (isSelected) {
              addClassNamesToElement2(dom, isSelectedClassName);
            } else {
              removeClassNamesFromElement2(dom, isSelectedClassName);
            }
          }
        }));
      }
      return mergeRegister2(...effects);
    }));
  }
};
var IMEExtension = {
  build(_editor) {
    return {
      composingTextNode: a(null),
      compositionKey: a(null)
    };
  },
  name: "@lexical/extension/IME",
  register(editor, _config, state) {
    const {
      compositionKey,
      composingTextNode
    } = state.getOutput();
    const removeStartCommand = editor.registerCommand(COMPOSITION_START_COMMAND2, () => {
      const selection = $getSelection2();
      if ($isRangeSelection2(selection)) {
        compositionKey.value = selection.anchor.key;
      }
      return false;
    }, COMMAND_PRIORITY_BEFORE_EDITOR2);
    const stopKeyEffect = j(() => {
      const key = compositionKey.value;
      if (key === null) {
        composingTextNode.value = null;
        return;
      }
      composingTextNode.value = editor.read("latest", () => {
        const node = $getNodeByKey2(key);
        return $isTextNode2(node) ? node : null;
      });
    });
    const removeUpdateListener = editor.registerUpdateListener(({
      tags,
      editorState
    }) => {
      if (!tags.has(COMPOSITION_START_TAG2)) {
        return;
      }
      editorState.read(() => {
        const selection = $getSelection2();
        if (!$isRangeSelection2(selection)) {
          return;
        }
        const node = selection.anchor.getNode();
        if ($isTextNode2(node)) {
          composingTextNode.value = node;
        }
      });
    });
    const removeRootListener = editor.registerRootListener((rootElem) => {
      if (rootElem === null) {
        compositionKey.value = null;
        return;
      }
      const onCompositionEnd2 = () => {
        compositionKey.value = null;
      };
      return registerEventListener2(rootElem, "compositionend", onCompositionEnd2);
    });
    return mergeRegister2(removeStartCommand, stopKeyEffect, removeUpdateListener, removeRootListener);
  }
};
var MODIFIERS = [["ctrlKey", "Ctrl"], ["altKey", "Alt"], ["shiftKey", "Shift"], ["metaKey", "Meta"]];
var UNIVERSAL_KEYS = {
  " ": "Space"
};
var APPLE_KEYS = {
  ...UNIVERSAL_KEYS,
  Alt: "\u2325",
  ArrowDown: "\u2193",
  ArrowLeft: "\u2190",
  ArrowRight: "\u2192",
  ArrowUp: "\u2191",
  Backspace: "\u232B",
  CapsLock: "\u21EA",
  Ctrl: "\u2303",
  Delete: "\u2326",
  End: "\u2198",
  Enter: "\u21A9",
  Escape: "\u238B",
  Home: "\u2196",
  Meta: "\u2318",
  PageDown: "\u21DF",
  PageUp: "\u21DE",
  Shift: "\u21E7",
  Tab: "\u21E5"
};
var SHIFT_APPLE_KEYS = {
  ...APPLE_KEYS,
  Tab: "\u21E4"
};
function formatKeyboardShortcut(shortcut, options = {}) {
  const {
    isApple = IS_APPLE2
  } = options;
  const {
    unshiftedKey,
    key
  } = shortcut;
  const modifiers = keyboardEventMaskForPlatform2(shortcut.modifiers || {}, isApple);
  const segments = [];
  const keyNames = isApple ? modifiers.shiftKey === true ? SHIFT_APPLE_KEYS : APPLE_KEYS : UNIVERSAL_KEYS;
  for (const [k, name] of MODIFIERS) {
    if (modifiers[k] === true) {
      if (isApple && k === "shiftKey" && unshiftedKey && key.length === 1) {
        continue;
      }
      segments.push(keyNames[name] || name);
    }
  }
  segments.push(keyNames[key] || !isApple && modifiers.shiftKey === true && unshiftedKey || key.length === 1 && key.toUpperCase() || key);
  return segments;
}
function registerKeyboardShortcuts(editor, shortcuts, priority) {
  const compiled = compileKeyboardShortcuts2(shortcuts);
  return editor.registerCommand(KEY_DOWN_COMMAND2, (event, fromEditor) => {
    let selection;
    for (const shortcut of compiled.matches(event)) {
      if (editor !== fromEditor && !shortcut.bubbleFromNestedEditors) {
        continue;
      }
      if (shortcut.$disabled) {
        if (selection === void 0) {
          selection = $getSelection2();
        }
        if (shortcut.$disabled(selection, fromEditor)) {
          continue;
        }
      }
      const $next = fromEditor.dispatchCommand.bind(fromEditor, shortcut.command, event);
      if (shortcut.$dispatch ? shortcut.$dispatch(shortcut.command, event, $next, fromEditor) : $next()) {
        return true;
      }
    }
    return false;
  }, priority);
}
function isReadonlyArray(x2) {
  return Array.isArray(x2);
}
function flattenKeyboardShortcuts(shortcuts) {
  return isReadonlyArray(shortcuts) ? shortcuts : shortcuts ? [shortcuts] : [];
}
function mergeNamedShortcuts(config, overrides) {
  if (!overrides) {
    return config;
  }
  const dest = {
    ...overrides
  };
  for (const [k, v0] of Object.entries(config)) {
    if (dest[k] === void 0) {
      dest[k] = v0;
    }
  }
  return dest;
}
var KeyboardShortcutsExtension = {
  build(editor, config, state) {
    return namedSignals(config);
  },
  config: {
    disabled: false,
    priority: COMMAND_PRIORITY_NORMAL2,
    shortcuts: {}
  },
  mergeConfig(config, overrides) {
    const merged = shallowMergeConfig2(config, overrides);
    merged.shortcuts = mergeNamedShortcuts(config.shortcuts, overrides.shortcuts);
    return merged;
  },
  name: "@lexical/extension/KeyboardShortcuts",
  register(editor, config, state) {
    const {
      disabled,
      priority,
      shortcuts
    } = state.getOutput();
    return j(() => {
      if (!disabled.value) {
        const allShortcuts = [];
        for (const shortcutConfig of Object.values(shortcuts.value)) {
          for (const v2 of flattenKeyboardShortcuts(shortcutConfig)) {
            allShortcuts.push(v2);
          }
        }
        return registerKeyboardShortcuts(editor, allShortcuts, priority.value);
      }
    });
  }
};
function $defaultGetParentEditor() {
  const editor = $getEditor2();
  LexicalBuilder.fromEditor(editor);
  return editor;
}
var NestedEditorExtension = {
  build: (editor, config) => namedSignals({
    inheritEditableFromParent: config.inheritEditableFromParent
  }),
  config: {
    $getParentEditor: $defaultGetParentEditor,
    inheritEditableFromParent: false
  },
  init: (editorConfig, config, state) => {
    const parentEditor = config.$getParentEditor();
    editorConfig.parentEditor = parentEditor;
    editorConfig.theme = editorConfig.theme || parentEditor._config.theme;
  },
  name: "@lexical/extension/NestedEditor",
  register: (editor, config, state) => j(() => {
    const parentEditor = editor._parentEditor;
    if (parentEditor) {
      if (state.getOutput().inheritEditableFromParent.value) {
        editor.setEditable(parentEditor.isEditable());
        return parentEditor.registerEditableListener(editor.setEditable.bind(editor));
      }
    }
  })
};
var NodeSelectionDataSelectedExtension = {
  config: {
    attribute: "data-selected",
    nodes: []
  },
  // Expand the configured classes to the types of every registered subclass,
  // so a subclass instance still matches without a runtime `instanceof`. This
  // needs the editor's node list, which is only available before creation.
  init(editorConfig, config) {
    const matchTypes = /* @__PURE__ */ new Set();
    const subtypeMap = getRegisteredSubtypeMap2(getKnownTypesAndNodes(editorConfig).nodes);
    for (const klass of config.nodes) {
      const type = klass.getType();
      const subtypes = subtypeMap.get(type);
      if (!(subtypes !== void 0)) {
        formatDevErrorMessage4(`Node class ${klass.name} with type ${type} not registered in editor`);
      }
      matchTypes.add(type);
      for (const subtype of subtypes) {
        matchTypes.add(subtype);
      }
    }
    return {
      matchTypes
    };
  },
  // Each consuming extension contributes its own node type through a separate
  // `configExtension` call, but they all resolve to this single named
  // extension. The default shallow merge would let the last `nodes` array win
  // and silently drop every earlier type, so concatenate them instead.
  mergeConfig(config, partial) {
    return shallowMergeConfig2(config, {
      ...partial,
      ...partial.nodes && {
        nodes: [...config.nodes, ...partial.nodes]
      }
    });
  },
  name: "@lexical/extension/NodeSelectionDataSelected",
  register(editor, config, state) {
    const {
      attribute
    } = config;
    const {
      matchTypes
    } = state.getInitResult();
    const marked = /* @__PURE__ */ new Map();
    const syncFromEditorState = (editorState) => {
      const nextKeys = /* @__PURE__ */ new Set();
      editorState.read(() => {
        const selection = $getSelection2();
        if ($isNodeSelection2(selection)) {
          for (const node of selection.getNodes()) {
            if (matchTypes.has(node.getType())) {
              nextKeys.add(node.getKey());
            }
          }
        }
      });
      for (const [key, dom] of marked) {
        if (!nextKeys.has(key)) {
          dom.removeAttribute(attribute);
          marked.delete(key);
        }
      }
      for (const key of nextKeys) {
        const dom = editor.getElementByKey(key);
        if (dom !== null) {
          dom.setAttribute(attribute, "true");
          marked.set(key, dom);
        }
      }
    };
    syncFromEditorState(editor.getEditorState());
    const removeUpdateListener = editor.registerUpdateListener(({
      editorState
    }) => syncFromEditorState(editorState));
    return () => {
      removeUpdateListener();
      for (const dom of marked.values()) {
        dom.removeAttribute(attribute);
      }
      marked.clear();
    };
  }
};
function deleteEmptyInline(node) {
  if ($isElementNode2(node) && node.isInline() && node.isEmpty()) {
    node.remove();
    if (node.canBeEmpty()) {
      console.warn(`Empty inline elements are removed from the EditorState, so returning 'true' from ${node.constructor.name}.canBeEmpty() is not allowed`);
    }
  }
}
var NormalizeInlineElementsExtension = {
  build: (editor, config, state) => namedSignals(config),
  config: {
    disabled: false
  },
  name: "@lexical/NormalizeInlineElements",
  register: (editor, config, state) => {
    const stores = state.getOutput();
    return j(() => {
      if (!stores.disabled.value) {
        const disposeTransformers = [];
        for (const {
          klass,
          transforms
        } of editor._nodes.values()) {
          if (klass.prototype instanceof ElementNode2 && klass.prototype.isInline !== ElementNode2.prototype.isInline) {
            transforms.add(deleteEmptyInline);
            disposeTransformers.push(() => transforms.delete(deleteEmptyInline));
          }
        }
        return () => disposeTransformers.forEach((fn) => fn());
      }
    });
  }
};
var SKIP_TAGS = /* @__PURE__ */ new Set([SKIP_SELECTION_FOCUS_TAG2, SKIP_SCROLL_INTO_VIEW_TAG2]);
function $fixFocusOverselection() {
  const selection = $getSelection2();
  if (!$isRangeSelection2(selection)) {
    return;
  }
  if (!selection.isCollapsed()) {
    const range = $getCaretRangeInDirection2($caretRangeFromSelection2(selection), "next");
    let focusCaret = range.focus;
    if ($isTextPointCaret2(focusCaret) && range.anchor.origin !== focusCaret.origin && focusCaret.offset === 0) {
      focusCaret = $rewindSiblingCaret2(focusCaret.getSiblingCaret());
    }
    if ($isSiblingCaret2(focusCaret) && range.anchor.origin !== focusCaret.origin && $isLineBreakNode2(focusCaret.origin)) {
      focusCaret = $rewindSiblingCaret2(focusCaret);
    }
    while ($isChildCaret2(focusCaret) && range.anchor.origin !== focusCaret.origin) {
      focusCaret = $rewindSiblingCaret2($getSiblingCaret2(focusCaret.origin, "next"));
    }
    if ($isSiblingCaret2(focusCaret) && $isElementNode2(focusCaret.origin)) {
      focusCaret = $normalizeCaret2($getChildCaret2(focusCaret.origin, "previous")).getFlipped();
    }
    focusCaret = $normalizeCaret2(focusCaret);
    if (!focusCaret.isSamePointCaret(range.focus)) {
      const sel3 = $setSelectionFromCaretRange2($getCaretRange2(range.anchor, focusCaret));
      const editor = $getEditor2();
      const rootElement = editor.getRootElement();
      const domSelection = rootElement && getDOMSelection2(rootElement.ownerDocument.defaultView);
      if (domSelection) {
        $updateDOMSelection2($getPreviousSelection2(), sel3, $getEditor2(), domSelection, SKIP_TAGS, rootElement);
      }
    }
  }
}
var NormalizeTripleClickSelectionExtension = {
  build: (editor, config, state) => namedSignals(config),
  config: {
    $fixFocusOverselection,
    dateNow: Date.now,
    disabled: false,
    thresholdMsec: 100
  },
  name: "@lexical/NormalizeTripleClickSelection",
  register: (editor, config, state) => j(() => {
    const stores = state.getOutput();
    if (stores.disabled.value) {
      return;
    }
    return editor.registerRootListener((rootElement) => {
      if (!rootElement) {
        return;
      }
      let lastTripleClick = 0;
      const refreshTripleClick = (event) => {
        if (event ? event.detail > 2 : lastTripleClick > 0) {
          const now = stores.dateNow.peek()();
          lastTripleClick = event && event.type === "mousedown" || now - lastTripleClick <= stores.thresholdMsec.peek() ? now : 0;
        }
        return lastTripleClick;
      };
      return mergeRegister2(editor.registerCommand(SELECTION_CHANGE_COMMAND2, () => {
        if (refreshTripleClick(null)) {
          lastTripleClick = 0;
          stores.$fixFocusOverselection.peek()();
        }
        return false;
      }, COMMAND_PRIORITY_BEFORE_CRITICAL2), registerEventListeners2(rootElement, {
        mousedown: refreshTripleClick,
        mouseup: refreshTripleClick
      }, true));
    });
  })
};
function captureKeydown(e2) {
  const target = e2.target;
  if (isExactShortcutMatch2(e2, "a", CONTROL_OR_META2) && isHTMLElement2(target) && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
    target.addEventListener("keydown", stopLexicalPropagation2, {
      once: true
    });
  }
}
var PreventSelectAllExtension = {
  build: (editor, config, state) => namedSignals(config),
  config: {
    disabled: false
  },
  name: "@lexical/extension/PreventSelectAll",
  register: (editor, config, state) => {
    const stores = state.getOutput();
    return j(() => {
      if (!stores.disabled.value) {
        return editor.registerRootListener((rootElement) => {
          if (rootElement) {
            return registerEventListener2(rootElement, "keydown", captureKeydown, true);
          }
        });
      }
    });
  }
};
function $hasCommonTopParent(nodes, commonTopParent) {
  return nodes.every((node) => commonTopParent.is(node.getTopLevelElement()));
}
var SelectBlockExtension = {
  build: (editor, config, state) => namedSignals(config),
  config: {
    cascadeSelection: false,
    disabled: false
  },
  dependencies: [PreventSelectAllExtension],
  name: "@lexical/extension/SelectBlock",
  register: (editor, config, state) => {
    const stores = state.getOutput();
    const preventSelectAllStores = state.getDependency(PreventSelectAllExtension).output;
    return mergeRegister2(
      // PreventSelectAllExtension is only a dependency in support of this
      // extension, so its disabled state is kept in sync
      j(() => {
        preventSelectAllStores.disabled.value = stores.disabled.value;
      }),
      j(() => {
        if (!stores.disabled.value) {
          return editor.registerCommand(
            SELECT_ALL_COMMAND2,
            (event, triggerEditor) => {
              if (triggerEditor !== editor) {
                if (!stores.cascadeSelection.peek()) {
                  return false;
                }
                const isAllSelected = triggerEditor.read("pending", () => {
                  const nestedSelection = $getSelection2();
                  return $isRangeSelection2(nestedSelection) && $isBlockFullySelected2($getRoot2(), nestedSelection);
                });
                if (!isAllSelected) {
                  return false;
                }
                $selectAll2();
                return true;
              }
              const selection = $getSelection2();
              if ($isNodeSelection2(selection)) {
                const selectedNodes = selection.getNodes();
                const firstNode = selectedNodes[0];
                if (!firstNode) {
                  return false;
                }
                const topParent = firstNode.getTopLevelElement();
                if (!topParent || $isRootNode2(topParent) || topParent.is(firstNode) || // if multiple nodes are selected and they do not share a common ancestor
                selectedNodes.length > 1 && !$hasCommonTopParent(selectedNodes, topParent)) {
                  $selectAll2();
                } else if ($isElementNode2(topParent)) {
                  topParent.select(0, topParent.getChildrenSize());
                }
                return true;
              }
              if (!$isRangeSelection2(selection)) {
                return false;
              }
              const anchorNode = selection.anchor.getNode();
              const blockNode = anchorNode.getTopLevelElement();
              if (blockNode && // A selection that crosses block boundaries expands to the
              // next enclosing scope instead of shrinking to the anchor's
              // block
              blockNode.is(selection.focus.getNode().getTopLevelElement()) && // an empty block is fully selected by its caret
              !$isBlockFullySelected2(blockNode, selection)) {
                blockNode.select(0, blockNode.getChildrenSize());
                return true;
              }
              let frame = $getSlotFrame2(anchorNode);
              while (frame !== null) {
                if ($isElementNode2(frame) && !$isBlockFullySelected2(frame, selection)) {
                  frame.select(0, frame.getChildrenSize());
                  return true;
                }
                const host = $getSlotHost2(frame);
                frame = host === null ? null : $getSlotFrame2(host);
              }
              if (!$isBlockFullySelected2($getRoot2(), selection)) {
                $selectAll2();
              }
              return true;
            },
            // This must be in a higher priority bucket than
            // COMMAND_PRIORITY_EDITOR (e.g. not COMMAND_PRIORITY_BEFORE_EDITOR)
            // for cascadeSelection to work. Listeners run for all editors in
            // priority bucket order (nested editor first within each bucket),
            // so an EDITOR bucket listener here would run after the nested
            // editor's own RichTextExtension SELECT_ALL_COMMAND handler.
            COMMAND_PRIORITY_LOW2
          );
        }
      })
    );
  }
};
var SelectionAlwaysOnDisplayExtension = {
  build: (editor, config, state) => namedSignals(config),
  config: {
    disabled: false,
    onReposition: void 0
  },
  name: "@lexical/utils/SelectionAlwaysOnDisplay",
  register: (editor, config, state) => {
    const stores = state.getOutput();
    return j(() => {
      if (!stores.disabled.value) {
        return selectionAlwaysOnDisplay2(editor, stores.onReposition.value);
      }
    });
  }
};
function $indentOverTab(selection) {
  const nodes = selection.getNodes();
  const canIndentBlockNodes = nodes.filter((node) => $isBlockElementNode2(node) && node.canIndent());
  if (canIndentBlockNodes.length > 0) {
    return true;
  }
  const anchor = selection.anchor;
  const focus = selection.focus;
  const first = focus.isBefore(anchor) ? focus : anchor;
  const firstNode = first.getNode();
  const firstBlock = $getNearestBlockElementAncestorOrThrow2(firstNode);
  if (firstBlock.canIndent()) {
    const firstBlockKey = firstBlock.getKey();
    let selectionAtStart = $createRangeSelection2();
    selectionAtStart.anchor.set(firstBlockKey, 0, "element");
    selectionAtStart.focus.set(firstBlockKey, 0, "element");
    selectionAtStart = $normalizeSelection__EXPERIMENTAL(selectionAtStart);
    if (selectionAtStart.anchor.is(first)) {
      return true;
    }
  }
  return false;
}
function $defaultCanIndent(node) {
  return node.canIndent();
}
function registerTabIndentation(editor, maxIndent, $canIndent = $defaultCanIndent) {
  return mergeRegister2(editor.registerCommand(KEY_TAB_COMMAND2, (event) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    event.preventDefault();
    const command = $indentOverTab(selection) ? event.shiftKey ? OUTDENT_CONTENT_COMMAND2 : INDENT_CONTENT_COMMAND2 : INSERT_TAB_COMMAND2;
    return editor.dispatchCommand(command);
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(INDENT_CONTENT_COMMAND2, () => {
    const currentMaxIndent = typeof maxIndent === "number" ? maxIndent : maxIndent ? maxIndent.peek() : null;
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    const $currentCanIndent = typeof $canIndent === "function" ? $canIndent : $canIndent.peek();
    return $handleIndentAndOutdent2((block) => {
      if ($currentCanIndent(block)) {
        const newIndent = block.getIndent() + 1;
        if (!currentMaxIndent || newIndent < currentMaxIndent) {
          block.setIndent(newIndent);
        }
      }
    });
  }, COMMAND_PRIORITY_CRITICAL2));
}
var TabIndentationExtension = {
  build(editor, config, state) {
    return namedSignals(config);
  },
  config: {
    $canIndent: $defaultCanIndent,
    disabled: false,
    maxIndent: null
  },
  name: "@lexical/extension/TabIndentation",
  register(editor, config, state) {
    const {
      disabled,
      maxIndent,
      $canIndent
    } = state.getOutput();
    return j(() => {
      if (!disabled.value) {
        return registerTabIndentation(editor, maxIndent, $canIndent);
      }
    });
  }
};

// node_modules/@lexical/extension/dist/LexicalExtension.mjs
var mod4 = true ? LexicalExtension_dev_exports : LexicalExtension_prod_exports;
var $applyFormatToDom2 = mod4.$applyFormatToDom;
var $createHorizontalRuleNode2 = mod4.$createHorizontalRuleNode;
var $defaultShouldInsertAfter2 = mod4.$defaultShouldInsertAfter;
var $getExtensionDependency2 = mod4.$getExtensionDependency;
var $getExtensionOutput2 = mod4.$getExtensionOutput;
var $getPeerDependency2 = mod4.$getPeerDependency;
var $isDecoratorTextNode2 = mod4.$isDecoratorTextNode;
var $isHorizontalRuleNode2 = mod4.$isHorizontalRuleNode;
var AutoFocusExtension2 = mod4.AutoFocusExtension;
var CONTROL_OR_ALT3 = mod4.CONTROL_OR_ALT;
var CONTROL_OR_META3 = mod4.CONTROL_OR_META;
var ClearEditorExtension2 = mod4.ClearEditorExtension;
var ClickAfterLastBlockExtension2 = mod4.ClickAfterLastBlockExtension;
var DecoratorTextExtension2 = mod4.DecoratorTextExtension;
var DecoratorTextNode2 = mod4.DecoratorTextNode;
var EditorStateExtension2 = mod4.EditorStateExtension;
var HMRExtension2 = mod4.HMRExtension;
var HorizontalRuleExtension2 = mod4.HorizontalRuleExtension;
var HorizontalRuleNode2 = mod4.HorizontalRuleNode;
var IMEExtension2 = mod4.IMEExtension;
var INSERT_HORIZONTAL_RULE_COMMAND2 = mod4.INSERT_HORIZONTAL_RULE_COMMAND;
var InitialStateExtension2 = mod4.InitialStateExtension;
var KeyboardShortcutsExtension2 = mod4.KeyboardShortcutsExtension;
var LexicalBuilder2 = mod4.LexicalBuilder;
var NestedEditorExtension2 = mod4.NestedEditorExtension;
var NodeSelectionDataSelectedExtension2 = mod4.NodeSelectionDataSelectedExtension;
var NodeSelectionExtension2 = mod4.NodeSelectionExtension;
var NormalizeInlineElementsExtension2 = mod4.NormalizeInlineElementsExtension;
var NormalizeTripleClickSelectionExtension2 = mod4.NormalizeTripleClickSelectionExtension;
var PreventSelectAllExtension2 = mod4.PreventSelectAllExtension;
var RootElementExtension2 = mod4.RootElementExtension;
var SelectBlockExtension2 = mod4.SelectBlockExtension;
var SelectionAlwaysOnDisplayExtension2 = mod4.SelectionAlwaysOnDisplayExtension;
var TabIndentationExtension2 = mod4.TabIndentationExtension;
var WatchEditableExtension2 = mod4.WatchEditableExtension;
var applyFormatFromStyle2 = mod4.applyFormatFromStyle;
var applyFormatToDom2 = mod4.applyFormatToDom;
var batch = mod4.batch;
var buildEditorFromExtensions2 = mod4.buildEditorFromExtensions;
var compileKeyboardShortcuts3 = mod4.compileKeyboardShortcuts;
var computed = mod4.computed;
var configExtension3 = mod4.configExtension;
var declarePeerDependency3 = mod4.declarePeerDependency;
var defineExtension3 = mod4.defineExtension;
var effect = mod4.effect;
var formatKeyboardShortcut2 = mod4.formatKeyboardShortcut;
var getExtensionDependencyFromEditor2 = mod4.getExtensionDependencyFromEditor;
var getKnownTypesAndNodes2 = mod4.getKnownTypesAndNodes;
var getPeerDependencyFromEditor2 = mod4.getPeerDependencyFromEditor;
var getPeerDependencyFromEditorOrThrow2 = mod4.getPeerDependencyFromEditorOrThrow;
var namedSignals2 = mod4.namedSignals;
var registerClearEditor2 = mod4.registerClearEditor;
var registerTabIndentation2 = mod4.registerTabIndentation;
var safeCast3 = mod4.safeCast;
var shallowMergeConfig3 = mod4.shallowMergeConfig;
var signal = mod4.signal;
var untracked = mod4.untracked;
var watchedSignal2 = mod4.watchedSignal;

// node_modules/@lexical/html/dist/LexicalHtml.dev.mjs
var LexicalHtml_dev_exports = {};
__export(LexicalHtml_dev_exports, {
  $appendNodeToHTML: () => $appendNodeToHTML,
  $distributeInlineWrapper: () => $distributeInlineWrapper,
  $generateDOMFromNodes: () => $generateDOMFromNodes,
  $generateDOMFromRoot: () => $generateDOMFromRoot,
  $generateHtmlFromNodes: () => $generateHtmlFromNodes,
  $generateNodesFromDOM: () => $generateNodesFromDOM,
  $generateNodesFromDOMViaExtension: () => $generateNodesFromDOMViaExtension,
  $getImportContextValue: () => $getImportContextValue,
  $getRenderContextValue: () => $getRenderContextValue,
  $getSessionDOMRenderConfig: () => $getSessionDOMRenderConfig,
  $inlineStylesFromStyleSheets: () => $inlineStylesFromStyleSheets,
  $isBlockLevel: () => $isBlockLevel,
  $propagateTextAlignToBlockChildren: () => $propagateTextAlignToBlockChildren,
  $setRenderContextValue: () => $setRenderContextValue,
  $updateRenderContextValue: () => $updateRenderContextValue,
  $withImportContext: () => $withImportContext,
  $withRenderContext: () => $withRenderContext,
  BlockSchema: () => BlockSchema,
  CoreImportExtension: () => CoreImportExtension,
  CoreImportRules: () => CoreImportRules,
  DOMImportExtension: () => DOMImportExtension,
  DOMRenderExtension: () => DOMRenderExtension,
  HorizontalRuleImportExtension: () => HorizontalRuleImportExtension,
  HorizontalRuleImportRules: () => HorizontalRuleImportRules,
  ImportOverlays: () => ImportOverlays,
  ImportSource: () => ImportSource,
  ImportSourceDataTransfer: () => ImportSourceDataTransfer,
  ImportTextFormat: () => ImportTextFormat,
  ImportTextStyle: () => ImportTextStyle,
  ImportWhitespaceConfig: () => ImportWhitespaceConfig,
  InlineSchema: () => InlineSchema,
  NestedBlockSchema: () => NestedBlockSchema,
  RenderContextExport: () => RenderContextExport,
  RenderContextRoot: () => RenderContextRoot,
  RootSchema: () => RootSchema,
  contextUpdater: () => contextUpdater,
  contextValue: () => contextValue,
  createImportState: () => createImportState,
  createRenderState: () => createRenderState,
  defaultIsInline: () => defaultIsInline,
  defaultPreservesWhitespace: () => defaultPreservesWhitespace,
  defineImportRule: () => defineImportRule,
  defineOverlayRules: () => defineOverlayRules,
  domOverride: () => domOverride,
  isElementOfTag: () => isElementOfTag,
  parseSelector: () => parseSelector,
  sel: () => sel
});
function formatDevErrorMessage5(message) {
  throw new Error(message);
}
var activeContext;
function getContextValue(contextRecord, cfg) {
  const {
    key
  } = cfg;
  return contextRecord && key in contextRecord ? contextRecord[key] : cfg.defaultValue;
}
function getEditorContext(editor) {
  return activeContext && activeContext.editor === editor ? activeContext : void 0;
}
function getContextRecord(sym, editor) {
  const editorContext = getEditorContext(editor);
  return editorContext && editorContext[sym];
}
function toPair(contextRecord, pairOrUpdater) {
  if ("cfg" in pairOrUpdater) {
    const {
      cfg,
      updater
    } = pairOrUpdater;
    return [cfg, updater(getContextValue(contextRecord, cfg))];
  }
  return pairOrUpdater;
}
function contextFromPairs(pairs, parent) {
  let rval = parent;
  for (const pairOrUpdater of pairs) {
    const [k, v2] = toPair(rval, pairOrUpdater);
    const key = k.key;
    if (rval === parent && getContextValue(rval, k) === v2) {
      continue;
    }
    const ctx = rval === parent || rval === void 0 ? createChildContext(parent) : rval;
    ctx[key] = v2;
    rval = ctx;
  }
  return rval;
}
function createChildContext(parent) {
  return Object.create(parent || null);
}
function contextValue(cfg, value) {
  return [cfg, value];
}
function contextUpdater(cfg, updater) {
  return {
    cfg,
    updater
  };
}
// @__NO_SIDE_EFFECTS__
function $withFullContext(sym, contextRecord, f, editor = $getEditor2()) {
  const prevDOMContext = activeContext;
  const parentEditorContext = getEditorContext(editor);
  try {
    activeContext = {
      ...parentEditorContext,
      editor,
      [sym]: contextRecord
    };
    return f();
  } finally {
    activeContext = prevDOMContext;
  }
}
// @__NO_SIDE_EFFECTS__
function $withContext(sym, $defaults = () => void 0) {
  return (cfg, editor = $getEditor2()) => {
    return (f) => {
      const parentEditorContext = getEditorContext(editor);
      const parentContextRecord = parentEditorContext && parentEditorContext[sym];
      const contextRecord = contextFromPairs(cfg, parentContextRecord || $defaults(editor));
      if (!contextRecord || contextRecord === parentContextRecord) {
        return f();
      }
      return /* @__PURE__ */ $withFullContext(sym, contextRecord, f, editor);
    };
  };
}
// @__NO_SIDE_EFFECTS__
function createContextState(tag, name, getDefaultValue, isEqual) {
  return Object.assign(createState2(Symbol(name), {
    isEqual,
    parse: getDefaultValue
  }), {
    [tag]: true
  });
}
var $inlineStylesFromStyleSheets = (dom, _ctx, $next) => {
  $inlineStylesFromStyleSheetsDOM(dom);
  $next();
};
function $inlineStylesFromStyleSheetsDOM(dom) {
  if (!isDOMDocumentNode2(dom)) {
    return;
  }
  const doc = dom;
  if (doc.querySelector("style") === null) {
    return;
  }
  const originalInlineStyles = /* @__PURE__ */ new Map();
  function getOriginalInlineProps(el) {
    let props = originalInlineStyles.get(el);
    if (props === void 0) {
      props = /* @__PURE__ */ new Set();
      for (let i2 = 0; i2 < el.style.length; i2++) {
        props.add(el.style[i2]);
      }
      originalInlineStyles.set(el, props);
    }
    return props;
  }
  try {
    for (const sheet of Array.from(doc.styleSheets)) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (_unused) {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (!objectKlassEquals2(rule, CSSStyleRule)) {
          continue;
        }
        let elements;
        try {
          elements = doc.querySelectorAll(rule.selectorText);
        } catch (_unused2) {
          continue;
        }
        for (const el of Array.from(elements)) {
          if (!isHTMLElement2(el)) {
            continue;
          }
          const originalProps = getOriginalInlineProps(el);
          for (let i2 = 0; i2 < rule.style.length; i2++) {
            const prop = rule.style[i2];
            if (!originalProps.has(prop)) {
              el.style.setProperty(prop, rule.style.getPropertyValue(prop), rule.style.getPropertyPriority(prop));
            }
          }
        }
      }
    }
  } catch (_unused3) {
  }
}
var DOMRenderExtensionName = "@lexical/html/DOM";
var DOMRenderContextSymbol = /* @__PURE__ */ Symbol.for("@lexical/html/DOMExportContext");
var DOMImportExtensionName = "@lexical/html/DOMImport";
var DOMImportContextSymbol = /* @__PURE__ */ Symbol.for("@lexical/html/DOMImportContext");
var ALWAYS_TRUE = () => true;
// @__NO_SIDE_EFFECTS__
function createRenderState(name, getDefaultValue, isEqual) {
  return /* @__PURE__ */ createContextState(DOMRenderContextSymbol, name, getDefaultValue, isEqual);
}
var RenderContextRoot = /* @__PURE__ */ createRenderState("root", Boolean);
var RenderContextExport = /* @__PURE__ */ createRenderState("isExport", Boolean);
function getDefaultRenderContext(editor) {
  const dep = getPeerDependencyFromEditor2(editor, DOMRenderExtensionName);
  return dep ? dep.output.defaults : void 0;
}
function getRenderContext(editor) {
  return getContextRecord(DOMRenderContextSymbol, editor) || getDefaultRenderContext(editor);
}
function $getRenderContextValue(cfg, editor = $getEditor2()) {
  return getContextValue(getRenderContext(editor), cfg);
}
function getRuntime(editor) {
  const dep = getPeerDependencyFromEditor2(editor, DOMRenderExtensionName);
  return dep ? dep.output.runtime : void 0;
}
function $setRenderContextValue(cfg, value, editor = $getEditor2()) {
  const runtime = getRuntime(editor);
  if (runtime) {
    runtime.setContextValue(cfg, value);
  }
}
function $updateRenderContextValue(cfg, updater, editor = $getEditor2()) {
  const runtime = getRuntime(editor);
  if (runtime) {
    runtime.setContextValue(cfg, updater(getContextValue(runtime.editorContext, cfg)));
  }
}
function $getSessionDOMRenderConfig(editor = $getEditor2()) {
  const runtime = getRuntime(editor);
  return runtime ? runtime.getSessionConfig() : $getEditorDOMRenderConfig2(editor);
}
var $withRenderContext = /* @__PURE__ */ $withContext(DOMRenderContextSymbol, getDefaultRenderContext);
// @__NO_SIDE_EFFECTS__
function domOverride(nodes, config, options) {
  return {
    ...config,
    ...options,
    nodes
  };
}
function buildNodePredicate(klass) {
  return (node) => node instanceof klass;
}
function getPredicate(subtypeMap, {
  nodes
}) {
  if (nodes === "*") {
    return ALWAYS_TRUE;
  }
  let types = {};
  const predicates = [];
  for (const klassOrPredicate of nodes) {
    if ("getType" in klassOrPredicate) {
      const type = klassOrPredicate.getType();
      if (types) {
        const subtypes = subtypeMap.get(type);
        if (!(subtypes !== void 0)) {
          formatDevErrorMessage5(`Node class ${klassOrPredicate.name} with type ${type} not registered in editor`);
        }
        for (const subtype of subtypes) {
          types[subtype] = true;
        }
      }
      predicates.push(buildNodePredicate(klassOrPredicate));
    } else {
      types = void 0;
      predicates.push(klassOrPredicate);
    }
  }
  if (types) {
    return types;
  } else if (predicates.length === 1) {
    return predicates[0];
  }
  return (node) => {
    for (const predicate of predicates) {
      if (predicate(node)) {
        return true;
      }
    }
    return false;
  };
}
function makePrerender() {
  return {
    $createDOM: [],
    $decorateDOM: [],
    $exportDOM: [],
    $extractWithChild: [],
    $getDOMSlot: [],
    $getSlotTargetElement: [],
    $shouldExclude: [],
    $shouldInclude: [],
    $updateDOM: []
  };
}
function ignoreNext2(acc) {
  return (node, _$next, editor) => acc(node, editor);
}
function ignoreNext3(acc) {
  return (node, a2, _$next, editor) => acc(node, a2, editor);
}
function ignoreNext4(acc) {
  return (node, a2, b2, _$next, editor) => acc(node, a2, b2, editor);
}
function ignoreNext5(acc) {
  return (node, a2, b2, c2, _$next, editor) => acc(node, a2, b2, c2, editor);
}
function merge2($acc, $getOverride) {
  return (node, editor) => {
    const $next = () => $acc(node, editor);
    const $override = $getOverride(node);
    return $override ? $override(node, $next, editor) : $next();
  };
}
function merge3(acc, $getOverride) {
  return (node, a2, editor) => {
    const $next = () => acc(node, a2, editor);
    const $override = $getOverride(node);
    return $override ? $override(node, a2, $next, editor) : $next();
  };
}
var merge3GetDOMSlot = merge3;
var ignoreNext3GetDOMSlot = ignoreNext3;
function merge4($acc, $getOverride) {
  return (node, a2, b2, editor) => {
    const $next = () => $acc(node, a2, b2, editor);
    const $override = $getOverride(node);
    return $override ? $override(node, a2, b2, $next, editor) : $next();
  };
}
function merge5(acc, $getOverride) {
  return (node, a2, b2, c2, editor) => {
    const $next = () => acc(node, a2, b2, c2, editor);
    const $override = $getOverride(node);
    return $override ? $override(node, a2, b2, c2, $next, editor) : $next();
  };
}
function sequence4($acc, $getOverride) {
  return (node, a2, b2, editor) => {
    $acc(node, a2, b2, editor);
    const $override = $getOverride(node);
    if ($override) {
      $override(node, a2, b2, editor);
    }
  };
}
function compilePrerenderKey(prerender, k, defaults, mergeFunction, ignoreNextFunction) {
  let acc = defaults[k];
  for (const pair of prerender[k]) {
    if (typeof pair[0] === "function") {
      const [$predicate, $override] = pair;
      acc = mergeFunction(acc, (node) => $predicate(node) && $override || void 0);
    } else {
      const typeOverrides = pair[1];
      const compiled = {};
      for (const type in typeOverrides) {
        const arr = typeOverrides[type];
        if (arr) {
          compiled[type] = arr.reduce(($acc, $override) => mergeFunction($acc, () => $override), acc);
        }
      }
      acc = mergeFunction(acc, (node) => {
        const f = compiled[node.getType()];
        return f && ignoreNextFunction(f);
      });
    }
  }
  defaults[k] = acc;
}
function addOverride(prerender, k, predicateOrTypes, override) {
  if (!override) {
    return;
  }
  const arr = prerender[k];
  if (typeof predicateOrTypes === "function") {
    arr.push([predicateOrTypes, override]);
  } else {
    const last = arr[arr.length - 1];
    let types;
    if (last && last[0] === "types") {
      types = last[1];
    } else {
      types = {};
      arr.push(["types", types]);
    }
    for (const type in predicateOrTypes) {
      const typeArr = types[type] || [];
      types[type] = typeArr;
      typeArr.push(override);
    }
  }
}
function isWildcard(override) {
  return override.nodes === "*";
}
function sortedOverrides(overrides) {
  const byWildcard = [];
  const byPredicate = [];
  const byNode = [];
  for (const override of overrides) {
    if (isWildcard(override)) {
      byWildcard.push(override);
    } else if (Array.isArray(override.nodes)) {
      for (const klassOrPredicate of override.nodes) {
        if ($isLexicalNode2(klassOrPredicate.prototype)) {
          byNode.push(override.nodes.length === 1 ? override : {
            ...override,
            nodes: [klassOrPredicate]
          });
        } else {
          byPredicate.push(override.nodes.length === 1 ? override : {
            ...override,
            nodes: [klassOrPredicate]
          });
        }
      }
    }
  }
  const depths = /* @__PURE__ */ new Map();
  const depthOf = (klass) => {
    let depth = depths.get(klass);
    if (depth === void 0) {
      depth = -1;
      for (const _2 of iterStaticNodeConfigChain2(klass)) {
        depth++;
      }
      depths.set(klass, depth);
    }
    return depth;
  };
  byNode.sort((a2, b2) => depthOf(a2.nodes[0]) - depthOf(b2.nodes[0]));
  return [...byNode, ...byPredicate, ...byWildcard];
}
function precompileDOMRenderConfigOverrides(editorConfig, overrides) {
  const subtypeMap = getRegisteredSubtypeMap2(getKnownTypesAndNodes2(editorConfig).nodes);
  const prerender = makePrerender();
  for (const override of sortedOverrides(overrides)) {
    const predicateOrTypes = getPredicate(subtypeMap, override);
    for (const k_ in prerender) {
      const k = k_;
      addOverride(prerender, k, predicateOrTypes, override[k]);
    }
  }
  return prerender;
}
function identity(v2) {
  return v2;
}
function compileDOMRenderConfigOverrides(editorConfig, {
  overrides
}) {
  const prerender = precompileDOMRenderConfigOverrides(editorConfig, overrides);
  const dom = {
    ...DEFAULT_EDITOR_DOM_CONFIG2,
    ...editorConfig.dom
  };
  compilePrerenderKey(prerender, "$createDOM", dom, merge2, ignoreNext2);
  compilePrerenderKey(prerender, "$exportDOM", dom, merge2, ignoreNext2);
  compilePrerenderKey(prerender, "$extractWithChild", dom, merge5, ignoreNext5);
  compilePrerenderKey(prerender, "$getDOMSlot", dom, merge3GetDOMSlot, ignoreNext3GetDOMSlot);
  compilePrerenderKey(prerender, "$shouldExclude", dom, merge3, ignoreNext3);
  compilePrerenderKey(prerender, "$shouldInclude", dom, merge3, ignoreNext3);
  compilePrerenderKey(prerender, "$getSlotTargetElement", dom, merge4, ignoreNext4);
  compilePrerenderKey(prerender, "$updateDOM", dom, merge4, ignoreNext4);
  compilePrerenderKey(prerender, "$decorateDOM", dom, sequence4, identity);
  return dom;
}
function makeReader(record) {
  return {
    get(cfg) {
      return getContextValue(record, cfg);
    }
  };
}
function createEditorContextRecord(contextDefaults) {
  const parent = /* @__PURE__ */ Object.create(null);
  return contextFromPairs(contextDefaults, parent) || parent;
}
function filterEditorInstalled(overrides, record) {
  const reader = makeReader(record);
  return overrides.filter((o2) => !(o2.disabledForEditor && o2.disabledForEditor(reader)));
}
function sameOverrides(a2, b2) {
  if (a2.length !== b2.length) {
    return false;
  }
  for (let i2 = 0; i2 < a2.length; i2++) {
    if (a2[i2] !== b2[i2]) {
      return false;
    }
  }
  return true;
}
function symmetricDiff(prev, next) {
  const prevSet = new Set(prev);
  const nextSet = new Set(next);
  const changed = [];
  for (const o2 of prev) {
    if (!nextSet.has(o2)) {
      changed.push(o2);
    }
  }
  for (const o2 of next) {
    if (!prevSet.has(o2)) {
      changed.push(o2);
    }
  }
  return changed;
}
function nodeMatcher(o2) {
  if (o2.nodes === "*") {
    return () => true;
  }
  const matchers = o2.nodes.map((match) => {
    const klass = match;
    return $isLexicalNode2(klass.prototype) ? (node) => node instanceof klass : match;
  });
  return (node) => matchers.some((f) => f(node));
}
function recreatePredicate(changed) {
  const matchers = [];
  for (const o2 of changed) {
    if (o2.$createDOM || o2.$getDOMSlot || o2.$decorateDOM) {
      matchers.push(nodeMatcher(o2));
    }
  }
  return matchers.length === 0 ? null : (node) => matchers.some((f) => f(node));
}
var DOMRenderRuntimeImpl = class {
  editor;
  /**
   * The `nodes` and base `dom` captured at `init` (before `dom` was
   * overwritten with the compiled config) — the clean base for every recompile.
   */
  initialEditorConfig;
  overrides;
  editorContext;
  hasSessionGates;
  installed;
  /** Memoized session configs keyed by the set of session-disabled overrides. */
  sessionCache = /* @__PURE__ */ new Map();
  constructor(editor, initialEditorConfig, overrides, editorContext) {
    this.editor = editor;
    this.initialEditorConfig = initialEditorConfig;
    this.overrides = overrides;
    this.editorContext = editorContext;
    this.installed = filterEditorInstalled(overrides, editorContext);
    this.hasSessionGates = overrides.some((o2) => o2.disabledForSession);
  }
  setContextValue(cfg, value) {
    const prev = this.installed;
    this.editorContext[cfg.key] = value;
    const next = filterEditorInstalled(this.overrides, this.editorContext);
    if (sameOverrides(prev, next)) {
      return;
    }
    const changed = symmetricDiff(prev, next);
    this.installed = next;
    this.sessionCache.clear();
    const dom = compileDOMRenderConfigOverrides(this.initialEditorConfig, {
      overrides: next
    });
    this.editor._config.dom = dom;
    const recreate = recreatePredicate(changed);
    if (!recreate) {
      return;
    }
    const base = dom.$updateDOM;
    dom.$updateDOM = (nextNode, prevNode, el, editor) => recreate(nextNode) ? true : base(nextNode, prevNode, el, editor);
    this.editor.update($fullReconcile2, {
      discrete: true
    });
    dom.$updateDOM = base;
  }
  getSessionConfig() {
    const resident = this.editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG2;
    if (!this.hasSessionGates) {
      return resident;
    }
    const reader = makeReader(getContextRecord(DOMRenderContextSymbol, this.editor) || this.editorContext);
    const disabledKeys = [];
    const sessionSet = [];
    this.installed.forEach((o2, i2) => {
      if (o2.disabledForSession && o2.disabledForSession(reader)) {
        disabledKeys.push(String(i2));
      } else {
        sessionSet.push(o2);
      }
    });
    if (disabledKeys.length === 0) {
      return resident;
    }
    const key = disabledKeys.join(",");
    let cfg = this.sessionCache.get(key);
    if (!cfg) {
      cfg = compileDOMRenderConfigOverrides(this.initialEditorConfig, {
        overrides: sessionSet
      });
      this.sessionCache.set(key, cfg);
    }
    return cfg;
  }
};
var DOMRenderExtension = {
  build(editor, config, state) {
    const {
      initialEditorConfig
    } = state.getInitResult();
    const editorContext = createEditorContextRecord(config.contextDefaults);
    const runtime = new DOMRenderRuntimeImpl(editor, initialEditorConfig, config.overrides, editorContext);
    return {
      defaults: editorContext,
      runtime
    };
  },
  config: {
    contextDefaults: [],
    overrides: []
  },
  html: {
    // Define a RootNode export for $generateDOMFromRoot
    export: /* @__PURE__ */ new Map([[RootNode2, () => {
      const element = $getDocument2().createElement("div");
      element.role = "textbox";
      return {
        element
      };
    }]])
  },
  init(editorConfig, config) {
    const initialEditorConfig = {
      dom: editorConfig.dom,
      nodes: editorConfig.nodes
    };
    const editorContext = createEditorContextRecord(config.contextDefaults);
    const installed = filterEditorInstalled(config.overrides, editorContext);
    editorConfig.dom = compileDOMRenderConfigOverrides(editorConfig, {
      overrides: installed
    });
    return {
      initialEditorConfig
    };
  },
  mergeConfig(config, partial) {
    const merged = shallowMergeConfig2(config, partial);
    for (const k of ["overrides", "contextDefaults"]) {
      if (partial[k]) {
        merged[k] = [...config[k], ...partial[k]];
      }
    }
    return merged;
  },
  name: DOMRenderExtensionName
};
var IMPL = /* @__PURE__ */ Symbol.for("@lexical/html/SelectorImpl");
function getSelectorImpl(sel3) {
  const impl = sel3[IMPL];
  if (!(impl !== void 0)) {
    formatDevErrorMessage5(`match must be a CompiledSelector produced by sel.* or sel.css(); received a raw object.`);
  }
  return impl;
}
function combinePredicates(preds) {
  if (preds.length === 0) {
    return isHTMLElement2;
  }
  if (preds.length === 1) {
    return preds[0];
  }
  return (node, captures) => {
    for (const p2 of preds) {
      if (!p2(node, captures)) {
        return false;
      }
    }
    return true;
  };
}
function buildSelector(tags, predicates) {
  const impl = {
    kind: "element",
    predicate: combinePredicates(predicates),
    tags
  };
  const refine = (additional) => buildSelector(tags, [...predicates, additional]);
  const builder = {
    [IMPL]: impl,
    attr: (name, value, options) => refine(buildAttrPredicate(name, value, options)),
    classAll: (...classes) => refine(buildClassAllPredicate(classes)),
    classAny: (...classes) => refine(buildClassAnyPredicate(classes)),
    styleAny: (prop, value, options) => refine(buildStylePredicate(prop, value, options))
  };
  return builder;
}
function normalizeClassList(classes) {
  const out = [];
  for (const c2 of classes) {
    if (c2) {
      out.push(c2);
    }
  }
  return out;
}
function buildClassAllPredicate(classes) {
  const ns = normalizeClassList(classes);
  if (ns.length === 0) {
    return () => true;
  }
  return (node) => {
    if (!isHTMLElement2(node)) {
      return false;
    }
    const cl = node.classList;
    for (const c2 of ns) {
      if (!cl.contains(c2)) {
        return false;
      }
    }
    return true;
  };
}
function buildClassAnyPredicate(classes) {
  const ns = normalizeClassList(classes);
  if (ns.length === 0) {
    return () => false;
  }
  return (node) => {
    if (!isHTMLElement2(node)) {
      return false;
    }
    const cl = node.classList;
    for (const c2 of ns) {
      if (cl.contains(c2)) {
        return true;
      }
    }
    return false;
  };
}
function buildAttrPredicate(name, value, options) {
  if (value === true) {
    return (node) => isHTMLElement2(node) && node.hasAttribute(name);
  }
  if (typeof value === "string") {
    return (node) => isHTMLElement2(node) && node.getAttribute(name) === value;
  }
  if (value instanceof RegExp) {
    const capture = options && options.capture;
    const re = value;
    return (node, captures) => {
      if (!isHTMLElement2(node)) {
        return false;
      }
      const v2 = node.getAttribute(name);
      if (v2 == null) {
        return false;
      }
      const m2 = v2.match(re);
      if (m2 === null) {
        return false;
      }
      if (capture !== void 0) {
        captures[capture] = m2;
      }
      return true;
    };
  }
  {
    formatDevErrorMessage5(`sel.attr(${JSON.stringify(name)}, ...) requires true, a string, or a RegExp`);
  }
}
function buildStylePredicate(prop, value, options) {
  if (typeof value === "string") {
    return (node) => isHTMLElement2(node) && node.style.getPropertyValue(prop) === value;
  }
  if (value instanceof RegExp) {
    const capture = options && options.capture;
    const re = value;
    return (node, captures) => {
      if (!isHTMLElement2(node)) {
        return false;
      }
      const v2 = node.style.getPropertyValue(prop);
      if (!v2) {
        return false;
      }
      const m2 = v2.match(re);
      if (m2 === null) {
        return false;
      }
      if (capture !== void 0) {
        captures[capture] = m2;
      }
      return true;
    };
  }
  {
    formatDevErrorMessage5(`sel.styleAny(${JSON.stringify(prop)}, ...) requires a string or a RegExp`);
  }
}
var TEXT_SELECTOR_IMPL = {
  kind: "text",
  predicate: isDOMTextNode2,
  tags: /* @__PURE__ */ new Set()
};
var TEXT_SELECTOR = {
  [IMPL]: TEXT_SELECTOR_IMPL
};
var COMMENT_SELECTOR_IMPL = {
  kind: "comment",
  predicate: (node) => node.nodeType === 8,
  tags: /* @__PURE__ */ new Set()
};
var COMMENT_SELECTOR = {
  [IMPL]: COMMENT_SELECTOR_IMPL
};
var selBase = {
  /** Match any {@link HTMLElement}. */
  any() {
    return buildSelector(/* @__PURE__ */ new Set(), []);
  },
  /** Match DOM {@link Comment} nodes. */
  comment() {
    return COMMENT_SELECTOR;
  },
  /**
   * Match by tag name(s). With one literal tag the element type is narrowed
   * (e.g. `'a' → HTMLAnchorElement`); with multiple, it is the union of
   * their `HTMLElementTagNameMap` entries.
   */
  tag(...tags) {
    if (!(tags.length > 0)) {
      formatDevErrorMessage5(`sel.tag() requires at least one tag name`);
    }
    const upper = /* @__PURE__ */ new Set();
    for (const t2 of tags) {
      upper.add(t2.toUpperCase());
    }
    return buildSelector(upper, []);
  },
  /** Match DOM {@link Text} nodes. */
  text() {
    return TEXT_SELECTOR;
  }
};
function isElementOfTag(node, tag) {
  return isHTMLElement2(node) && node.nodeName === tag.toUpperCase();
}
var IDENT_CHAR = /[A-Za-z0-9_-]/;
var Cursor = class {
  constructor(source, pos) {
    this.source = source;
    this.pos = pos;
  }
  peek(offset = 0) {
    return this.source[this.pos + offset] || "";
  }
  consume() {
    return this.source[this.pos++] || "";
  }
  eof() {
    return this.pos >= this.source.length;
  }
  skipWhitespace() {
    while (!this.eof() && /\s/.test(this.peek())) {
      this.pos++;
    }
  }
  readIdent() {
    const start = this.pos;
    while (!this.eof() && IDENT_CHAR.test(this.peek())) {
      this.pos++;
    }
    return this.source.slice(start, this.pos);
  }
  readQuoted() {
    const quote = this.consume();
    this.assert(quote === '"' || quote === "'", "expected quote");
    const start = this.pos;
    while (!this.eof() && this.peek() !== quote) {
      if (this.peek() === "\\") {
        this.pos += 2;
      } else {
        this.pos++;
      }
    }
    this.assert(!this.eof(), "unterminated string");
    const value = this.source.slice(start, this.pos);
    this.pos++;
    return value.replace(/\\(.)/g, "$1");
  }
  /**
   * `invariant(cond, fmt, …)`-flavored assertion that also surfaces the
   * cursor's position context. Use for parse-time errors so a malformed
   * CSS selector gets a useful, position-annotated message.
   */
  assert(cond, msg) {
    if (!cond) {
      formatDevErrorMessage5(`invalid CSS selector at col ${String(this.pos + 1)}: ${msg} in ${this.source}`);
    }
  }
};
function parseSimpleSelector(c2) {
  const tags = /* @__PURE__ */ new Set();
  const predicates = [];
  const classes = [];
  let isUniversal = false;
  c2.skipWhitespace();
  if (c2.peek() === "*") {
    c2.consume();
    isUniversal = true;
  } else if (IDENT_CHAR.test(c2.peek())) {
    const tag = c2.readIdent();
    if (tag) {
      tags.add(tag.toUpperCase());
    }
  }
  while (!c2.eof()) {
    const ch = c2.peek();
    if (ch === ".") {
      c2.consume();
      const cls = c2.readIdent();
      c2.assert(cls !== "", 'expected class name after "."');
      classes.push(cls);
    } else if (ch === "#") {
      c2.consume();
      const id = c2.readIdent();
      c2.assert(id !== "", 'expected id after "#"');
      predicates.push(buildAttrPredicate("id", id));
    } else if (ch === "[") {
      c2.consume();
      c2.skipWhitespace();
      const name = c2.readIdent();
      c2.assert(name !== "", 'expected attribute name after "["');
      c2.skipWhitespace();
      let value = true;
      if (c2.peek() === "=") {
        c2.consume();
        c2.skipWhitespace();
        const next = c2.peek();
        if (next === '"' || next === "'") {
          value = c2.readQuoted();
        } else {
          value = c2.readIdent();
          c2.assert(value !== "", "expected attribute value");
        }
        c2.skipWhitespace();
      }
      c2.assert(c2.peek() === "]", 'expected "]"');
      c2.consume();
      predicates.push(buildAttrPredicate(name, value));
    } else {
      break;
    }
  }
  if (classes.length > 0) {
    predicates.push(buildClassAllPredicate(classes));
  }
  c2.assert(isUniversal || tags.size > 0 || predicates.length > 0, "expected a selector");
  return {
    predicates,
    tags
  };
}
function parseSelector(source) {
  const c2 = new Cursor(source, 0);
  const groups = [];
  while (true) {
    groups.push(parseSimpleSelector(c2));
    c2.skipWhitespace();
    if (c2.eof()) {
      break;
    }
    c2.assert(c2.peek() === ",", 'expected "," (selector lists are the only supported combinator)');
    c2.consume();
    c2.skipWhitespace();
  }
  if (groups.length === 1) {
    return buildSelector(groups[0].tags, groups[0].predicates);
  }
  const tags = /* @__PURE__ */ new Set();
  if (groups.every((g2) => g2.tags.size > 0)) {
    for (const g2 of groups) {
      for (const t2 of g2.tags) {
        tags.add(t2);
      }
    }
  }
  const orPredicate = (node, captures) => {
    for (const g2 of groups) {
      const upper = node.nodeName;
      if (g2.tags.size > 0 && !g2.tags.has(upper)) {
        continue;
      }
      let ok = true;
      for (const p2 of g2.predicates) {
        if (!p2(node, captures)) {
          ok = false;
          break;
        }
      }
      if (ok) {
        return true;
      }
    }
    return false;
  };
  return buildSelector(tags, [orPredicate]);
}
// @__NO_SIDE_EFFECTS__
function createImportState(name, getDefaultValue, isEqual) {
  return /* @__PURE__ */ createContextState(DOMImportContextSymbol, name, getDefaultValue, isEqual);
}
var ImportSource = /* @__PURE__ */ createImportState("importSource", () => "unknown");
var ImportSourceDataTransfer = /* @__PURE__ */ createImportState("importSourceDataTransfer", () => null);
var ImportTextFormat = /* @__PURE__ */ createImportState("textFormat", () => 0);
var ImportTextStyle = /* @__PURE__ */ createImportState("textStyle", () => ({}));
function defaultPreservesWhitespace(node) {
  if (!isHTMLElement2(node)) {
    return false;
  }
  if (node.nodeName === "PRE") {
    return true;
  }
  const ws = node.style.whiteSpace;
  return typeof ws === "string" && ws.startsWith("pre");
}
function defaultIsInline(node) {
  if (isDOMTextNode2(node)) {
    return true;
  }
  if (!isHTMLElement2(node)) {
    return false;
  }
  const display = node.style.display;
  if (display) {
    return display.startsWith("inline");
  }
  if (isBlockDomNode2(node)) {
    return false;
  }
  return isInlineDomNode2(node);
}
var ImportWhitespaceConfig = /* @__PURE__ */ createImportState("whitespaceConfig", () => ({
  isInline: defaultIsInline,
  preservesWhitespace: defaultPreservesWhitespace
}));
var ImportOverlays = /* @__PURE__ */ createImportState("importOverlays", () => []);
var ImportSessionImpl = class {
  constructor(record) {
    this.record = record;
  }
  get(cfg) {
    return getContextValue(this.record, cfg);
  }
  set(cfg, value) {
    this.record[cfg.key] = value;
  }
  update(cfg, updater) {
    this.record[cfg.key] = updater(getContextValue(this.record, cfg));
  }
  has(cfg) {
    return Object.prototype.hasOwnProperty.call(this.record, cfg.key);
  }
};
function getDefaultImportContext(editor) {
  const dep = getPeerDependencyFromEditor2(editor, DOMImportExtensionName);
  return dep ? dep.output.defaults : void 0;
}
function getImportContext(editor) {
  return getContextRecord(DOMImportContextSymbol, editor) || getDefaultImportContext(editor);
}
function $getImportContextValue(cfg, editor = $getEditor2()) {
  return getContextValue(getImportContext(editor), cfg);
}
var $withImportContext = /* @__PURE__ */ $withContext(DOMImportContextSymbol, getDefaultImportContext);
function $isBlockLevel(node) {
  return $isBlockElementNode2(node) || $isDecoratorNode2(node) && !node.isInline();
}
function $distributeInlineWrapper(children, $makeWrapper) {
  const out = [];
  let inlineRun = [];
  const flushInline = () => {
    if (inlineRun.length === 0) {
      return;
    }
    out.push($makeWrapper().splice(0, 0, inlineRun));
    inlineRun = [];
  };
  for (const child of children) {
    if ($isBlockLevel(child)) {
      flushInline();
      if ($isElementNode2(child)) {
        const wrapped = $distributeInlineWrapper(child.getChildren(), $makeWrapper);
        child.splice(0, child.getChildrenSize(), wrapped);
      }
      out.push(child);
    } else {
      inlineRun.push(child);
    }
  }
  flushInline();
  return out;
}
function $applySchema(schema, children, parent, domParent) {
  const out = [];
  let run = null;
  const flushRun = () => {
    if (run === null) {
      return;
    }
    const rejected = run;
    run = null;
    if (schema.$packageRun) {
      const packaged = schema.$packageRun(rejected, parent, domParent);
      if (packaged.length > 0) {
        for (const n2 of packaged) {
          out.push(n2);
        }
        return;
      }
    }
    if (schema.onReject === "hoist") {
      for (const n2 of rejected) {
        out.push(n2);
      }
    }
  };
  for (const child of children) {
    if (schema.$accepts(child, parent)) {
      flushRun();
      out.push(child);
    } else {
      if (run === null) {
        run = [];
      }
      run.push(child);
    }
  }
  flushRun();
  return schema.$finalize ? schema.$finalize(out, parent) : out;
}
function $propagateTextAlignToBlockChildren(children, domParent) {
  if (!isHTMLElement2(domParent)) {
    return children;
  }
  const textAlign = domParent.style.textAlign;
  if (!isAlignmentValue(textAlign)) {
    return children;
  }
  for (const child of children) {
    if ($isBlockElementNode2(child) && child.getFormatType() === "") {
      child.setFormat(textAlign);
    }
  }
  return children;
}
function $paragraphPackageRun(run, _parent, domParent) {
  if (run.length === 1 && $isLineBreakNode2(run[0])) {
    run = [];
  }
  const paragraph = $createParagraphNode2();
  if (isHTMLElement2(domParent)) {
    const textAlign = domParent.style.textAlign;
    if (isAlignmentValue(textAlign)) {
      paragraph.setFormat(textAlign);
    }
  }
  return [paragraph.splice(0, 0, run)];
}
var BlockSchema = {
  $accepts: $isBlockLevel,
  $packageRun: $paragraphPackageRun,
  name: "BlockSchema"
};
var InlineSchema = {
  $accepts: (child) => !$isBlockLevel(child),
  name: "InlineSchema"
};
var NestedBlockSchema = {
  $accepts: $isBlockLevel,
  /**
   * Pass an inline run through unchanged. Because the schema iterator only
   * groups *maximal* rejected runs (each separated from the next by an
   * accepted block child), the legacy "linebreak between adjacent inline
   * groups" case never arises — adjacent inline siblings are already
   * coalesced into one run.
   */
  $packageRun: (run) => run,
  name: "NestedBlockSchema"
};
var RootSchema = {
  $accepts: $isBlockLevel,
  $packageRun: $paragraphPackageRun,
  name: "RootSchema"
};
var sel$1 = selBase;
var ALIGNMENT_VALUES = /* @__PURE__ */ new Set(["center", "end", "justify", "left", "right", "start"]);
function isAlignmentValue(value) {
  return ALIGNMENT_VALUES.has(value);
}
var TAG_DEFAULT_STYLE = {
  B: {
    fontWeight: "bold"
  },
  EM: {
    fontStyle: "italic"
  },
  I: {
    fontStyle: "italic"
  },
  S: {
    textDecoration: "line-through"
  },
  STRONG: {
    fontWeight: "bold"
  },
  SUB: {
    verticalAlign: "sub"
  },
  SUP: {
    verticalAlign: "super"
  },
  U: {
    textDecoration: "underline"
  }
};
var TAG_ONLY_SET = {
  CODE: IS_CODE2,
  MARK: IS_HIGHLIGHT2
};
function readElementFormatStyle(el) {
  return {
    fontStyle: el.style.fontStyle,
    fontWeight: el.style.fontWeight,
    textDecoration: el.style.textDecoration,
    textTransform: el.style.textTransform,
    verticalAlign: el.style.verticalAlign
  };
}
function mergeStyles(defaults, override) {
  return {
    fontStyle: override.fontStyle || defaults.fontStyle,
    fontWeight: override.fontWeight || defaults.fontWeight,
    textDecoration: override.textDecoration || defaults.textDecoration,
    textTransform: override.textTransform || defaults.textTransform,
    verticalAlign: override.verticalAlign || defaults.verticalAlign
  };
}
var FORMAT_BIT_STYLE_PROPS = /* @__PURE__ */ new Set(["font-weight", "font-style", "text-decoration", "text-transform", "vertical-align"]);
function styleFormatOverride(style) {
  let set = 0;
  let clear = 0;
  const {
    fontWeight,
    fontStyle,
    textDecoration,
    textTransform,
    verticalAlign
  } = style;
  if (fontWeight === "700" || fontWeight === "bold") {
    set |= IS_BOLD2;
  } else if (fontWeight === "normal" || fontWeight === "400") {
    clear |= IS_BOLD2;
  }
  if (fontStyle === "italic") {
    set |= IS_ITALIC2;
  } else if (fontStyle === "normal") {
    clear |= IS_ITALIC2;
  }
  if (textDecoration) {
    const parts = textDecoration.split(" ");
    if (parts.includes("underline")) {
      set |= IS_UNDERLINE2;
    }
    if (parts.includes("line-through")) {
      set |= IS_STRIKETHROUGH2;
    }
    if (parts.includes("none")) {
      clear |= IS_UNDERLINE2 | IS_STRIKETHROUGH2;
    }
  }
  if (textTransform === "lowercase") {
    set |= TEXT_TYPE_TO_FORMAT2.lowercase;
    clear |= TEXT_TYPE_TO_FORMAT2.uppercase | TEXT_TYPE_TO_FORMAT2.capitalize;
  } else if (textTransform === "uppercase") {
    set |= TEXT_TYPE_TO_FORMAT2.uppercase;
    clear |= TEXT_TYPE_TO_FORMAT2.lowercase | TEXT_TYPE_TO_FORMAT2.capitalize;
  } else if (textTransform === "capitalize") {
    set |= TEXT_TYPE_TO_FORMAT2.capitalize;
    clear |= TEXT_TYPE_TO_FORMAT2.lowercase | TEXT_TYPE_TO_FORMAT2.uppercase;
  } else if (textTransform === "none") {
    clear |= TEXT_TYPE_TO_FORMAT2.lowercase | TEXT_TYPE_TO_FORMAT2.uppercase | TEXT_TYPE_TO_FORMAT2.capitalize;
  }
  if (verticalAlign === "sub") {
    set |= IS_SUBSCRIPT2;
    clear |= IS_SUPERSCRIPT2;
  } else if (verticalAlign === "super") {
    set |= IS_SUPERSCRIPT2;
    clear |= IS_SUBSCRIPT2;
  } else if (verticalAlign === "baseline") {
    clear |= IS_SUBSCRIPT2 | IS_SUPERSCRIPT2;
  }
  return {
    clear,
    set
  };
}
function applyFormatOverride(format, ov) {
  return format & ~ov.clear | ov.set;
}
var InlineFormatRule = {
  $import: (ctx, el) => {
    const inherited = ctx.get(ImportTextFormat);
    const tagDefault = TAG_DEFAULT_STYLE[el.nodeName];
    const elStyle = readElementFormatStyle(el);
    const effective = tagDefault ? mergeStyles(tagDefault, elStyle) : elStyle;
    let merged = applyFormatOverride(inherited, styleFormatOverride(effective));
    const tagOnly = TAG_ONLY_SET[el.nodeName];
    if (tagOnly) {
      merged |= tagOnly;
    }
    if (merged === inherited) {
      return ctx.$importChildren(el);
    }
    return ctx.$importChildren(el, {
      context: [contextValue(ImportTextFormat, merged)]
    });
  },
  match: /* @__PURE__ */ sel$1.tag("b", "strong", "em", "i", "code", "mark", "s", "sub", "sup", "u", "span"),
  name: "@lexical/html/inline-format"
};
function isInsidePreserveWhitespace(node, wsConfig) {
  let current = node.parentNode;
  while (current !== null) {
    if (wsConfig.preservesWhitespace(current)) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}
function findAdjacentTextOnLine(text, forward, wsConfig) {
  let node = text;
  while (true) {
    let sibling = null;
    while ((sibling = forward ? node.nextSibling : node.previousSibling) === null) {
      const parent = node.parentNode;
      if (parent === null) {
        return null;
      }
      node = parent;
    }
    node = sibling;
    if (!wsConfig.isInline(node)) {
      return null;
    }
    let descendant = node;
    while ((descendant = forward ? node.firstChild : node.lastChild) !== null) {
      node = descendant;
    }
    if (isDOMTextNode2(node)) {
      return node;
    }
    if (node.nodeName === "BR") {
      return null;
    }
  }
}
function collapseWhitespace(textNode, wsConfig) {
  let textContent = (textNode.textContent || "").replace(/\r/g, "").replace(/[ \t\n]+/g, " ");
  if (textContent.length === 0) {
    return "";
  }
  if (textContent[0] === " ") {
    let neighbor = textNode;
    let isStartOfLine = true;
    while (neighbor !== null && (neighbor = findAdjacentTextOnLine(neighbor, false, wsConfig)) !== null) {
      const neighborContent = neighbor.textContent || "";
      if (neighborContent.length > 0) {
        if (/[ \t\n]$/.test(neighborContent)) {
          textContent = textContent.slice(1);
        }
        isStartOfLine = false;
        break;
      }
    }
    if (isStartOfLine) {
      textContent = textContent.slice(1);
    }
  }
  if (textContent.length > 0 && textContent[textContent.length - 1] === " ") {
    let neighbor = textNode;
    let isEndOfLine = true;
    while (neighbor !== null && (neighbor = findAdjacentTextOnLine(neighbor, true, wsConfig)) !== null) {
      const neighborContent = (neighbor.textContent || "").replace(/^( |\t|\r?\n)+/, "");
      if (neighborContent.length > 0) {
        isEndOfLine = false;
        break;
      }
    }
    if (isEndOfLine) {
      textContent = textContent.slice(0, -1);
    }
  }
  return textContent;
}
function $applyFormat(node, format) {
  return format !== 0 && $isTextNode2(node) ? node.setFormat(format) : node;
}
function styleObjectToCSS(style) {
  let css = "";
  for (const prop in style) {
    if (FORMAT_BIT_STYLE_PROPS.has(prop)) {
      continue;
    }
    css += `${prop}: ${style[prop]}; `;
  }
  return css.trimEnd();
}
function $applyTextStyle(node, style) {
  if ($isTextNode2(node)) {
    const css = styleObjectToCSS(style);
    if (css !== "") {
      node.setStyle(css);
    }
  }
  return node;
}
var TextRule = {
  $import: (ctx, el) => {
    const format = ctx.get(ImportTextFormat);
    const style = ctx.get(ImportTextStyle);
    const wsConfig = ctx.get(ImportWhitespaceConfig);
    if (isInsidePreserveWhitespace(el, wsConfig)) {
      const out = $generateNodesFromRawText2(el.textContent || "");
      for (const node of out) {
        $applyFormat(node, format);
        $applyTextStyle(node, style);
      }
      return out;
    }
    const collapsed = collapseWhitespace(el, wsConfig);
    if (collapsed === "") {
      return [];
    }
    const text = $createTextNode2(collapsed);
    $applyFormat(text, format);
    $applyTextStyle(text, style);
    return [text];
  },
  match: /* @__PURE__ */ sel$1.text(),
  name: "@lexical/html/#text"
};
var IgnoreScriptStyleRule = {
  $import: () => [],
  match: /* @__PURE__ */ sel$1.tag("script", "style"),
  name: "@lexical/html/script-style-ignore"
};
var LineBreakRule = {
  // Mirror the legacy LineBreakNode.importDOM filter: stray `<br>` that
  // are the sole or trailing child of a block parent (e.g. Apple's
  // `<br class="Apple-interchange-newline">` clipboard sentinel, or the
  // trailing `<br>` browsers insert after the last text in a `<div>`)
  // would otherwise survive as a LineBreakNode and tack an extra blank
  // line onto the imported content.
  $import: (_ctx, el) => isOnlyChildInBlockNode2(el) || isLastChildInBlockNode2(el) ? [] : [$createLineBreakNode2()],
  match: /* @__PURE__ */ sel$1.tag("br"),
  name: "@lexical/html/br"
};
var ParagraphRule = {
  $import: (ctx, el) => {
    const p2 = $createParagraphNode2();
    $setFormatFromDOM2(p2, el);
    setNodeIndentFromDOM2(el, p2);
    if (p2.getFormatType() === "") {
      const align = el.getAttribute("align");
      if (align && isAlignmentValue(align)) {
        p2.setFormat(align);
      }
    }
    $setDirectionFromDOM2(p2, el);
    return [p2.splice(0, 0, ctx.$importChildren(el))];
  },
  match: /* @__PURE__ */ sel$1.tag("p"),
  name: "@lexical/html/p"
};
var HorizontalRuleRule = {
  $import: (_ctx, _el, $next) => $getEditor2().hasNode(HorizontalRuleNode2) ? [$createHorizontalRuleNode2()] : $next(),
  match: /* @__PURE__ */ sel$1.tag("hr"),
  name: "@lexical/html/hr"
};
var TransparentBlockRule = {
  $import: (ctx, el, $next) => {
    if (!isBlockDomNode2(el)) {
      return $next();
    }
    return $propagateTextAlignToBlockChildren(ctx.$importChildren(el, {
      schema: BlockSchema
    }), el);
  },
  match: /* @__PURE__ */ sel$1.any(),
  name: "@lexical/html/transparent-block"
};
var CoreImportRules = [IgnoreScriptStyleRule, ParagraphRule, HorizontalRuleRule, TransparentBlockRule, TextRule, LineBreakRule, InlineFormatRule];
function mergeSortedAsc(a2, b2) {
  const out = [];
  let i2 = 0;
  let j2 = 0;
  while (i2 < a2.length && j2 < b2.length) {
    if (a2[i2] <= b2[j2]) {
      out.push(a2[i2++]);
    } else {
      out.push(b2[j2++]);
    }
  }
  while (i2 < a2.length) {
    out.push(a2[i2++]);
  }
  while (j2 < b2.length) {
    out.push(b2[j2++]);
  }
  return out;
}
function compileImportRules(rules) {
  const compiled = [];
  const byTag = /* @__PURE__ */ new Map();
  const wildcardIndices = [];
  const textIndices = [];
  const commentIndices = [];
  const seenNames = /* @__PURE__ */ new Set();
  rules.forEach((rule, i2) => {
    const sel3 = getSelectorImpl(rule.match);
    const name = rule.name || defaultRuleName(sel3, i2);
    if (typeof rule.name === "string" && seenNames.has(rule.name)) {
      console.warn(`[lexical] duplicate DOMImportRule name "${rule.name}" \u2014 keep names unique to aid debugging.`);
    }
    if (rule.name) {
      seenNames.add(rule.name);
    }
    compiled.push({
      $import: rule.$import,
      name,
      predicate: sel3.predicate
    });
    if (sel3.kind === "text") {
      textIndices.push(i2);
    } else if (sel3.kind === "comment") {
      commentIndices.push(i2);
    } else if (sel3.tags.size === 0) {
      wildcardIndices.push(i2);
    } else {
      for (const tag of sel3.tags) {
        let list = byTag.get(tag);
        if (!list) {
          list = [];
          byTag.set(tag, list);
        }
        list.push(i2);
      }
    }
  });
  const finalByTag = /* @__PURE__ */ new Map();
  if (wildcardIndices.length === 0) {
    for (const [tag, list] of byTag) {
      finalByTag.set(tag, list);
    }
  } else {
    for (const [tag, list] of byTag) {
      finalByTag.set(tag, mergeSortedAsc(list, wildcardIndices));
    }
  }
  return {
    byTag: finalByTag,
    commentIndices,
    rules: compiled,
    textIndices,
    wildcardIndices
  };
}
function defaultRuleName(sel3, index) {
  if (sel3.kind === "text") {
    return `#text@${index}`;
  }
  if (sel3.kind === "comment") {
    return `#comment@${index}`;
  }
  if (sel3.tags.size === 0) {
    return `*@${index}`;
  }
  const tagList = Array.from(sel3.tags).join(",").toLowerCase();
  return `${tagList}@${index}`;
}
function getDispatchIndices(dispatch, node) {
  if (isDOMTextNode2(node)) {
    return dispatch.textIndices;
  }
  if (node.nodeType === 8) {
    return dispatch.commentIndices;
  }
  if (isHTMLElement2(node)) {
    return dispatch.byTag.get(node.nodeName) || dispatch.wildcardIndices;
  }
  return EMPTY_INDICES;
}
var EMPTY_INDICES = Object.freeze([]);
function flattenRuleEntries(entries) {
  const out = [];
  for (const entry of entries) {
    if (isCompiledOverlayRules(entry)) {
      for (const r2 of entry.rules) {
        out.push(r2);
      }
    } else {
      out.push(entry);
    }
  }
  return out;
}
function isCompiledOverlayRules(entry) {
  return typeof entry === "object" && entry !== null && "__type" in entry && entry.__type === "CompiledOverlayRules";
}
// @__NO_SIDE_EFFECTS__
function defineOverlayRules(entries) {
  const rules = flattenRuleEntries(entries);
  return {
    __type: "CompiledOverlayRules",
    dispatch: compileImportRules(rules),
    rules
  };
}
var NO_CAPTURES = Object.freeze({});
function makeContext(runtime, captures) {
  const ctx = {
    $importChildren: (parent, opts) => $importChildrenInternal(runtime, parent, opts),
    $importOne: (node, opts) => $importOneInternal(runtime, node, opts),
    captures,
    get(cfg) {
      return $getImportContextValue(cfg, runtime.editor);
    },
    session: runtime.session
  };
  return ctx;
}
function $importChildrenInternal(runtime, parent, opts) {
  const overlay = opts && opts.rules ? opts.rules.dispatch : void 0;
  if (overlay) {
    runtime.overlays.push(overlay);
  }
  try {
    const run = () => $importChildrenRun(runtime, parent, opts);
    return opts && opts.context ? $withImportContext(opts.context, runtime.editor)(run) : run();
  } finally {
    if (overlay) {
      runtime.overlays.pop();
    }
  }
}
function $importChildrenRun(runtime, parent, opts) {
  const onChild = opts && opts.$onChild;
  const collected = [];
  for (const child of Array.from(parent.childNodes)) {
    const produced = $importOneInternal(runtime, child, void 0);
    for (const lex of produced) {
      const result = onChild ? onChild(lex) : lex;
      if (result != null) {
        collected.push(result);
      }
    }
  }
  const afterApplied = opts && opts.$after ? opts.$after(collected) : collected;
  const schema = opts && opts.schema;
  if (!schema) {
    return afterApplied;
  }
  return $applySchema(schema, afterApplied, null, parent);
}
function $importOneInternal(runtime, node, opts) {
  const run = () => $dispatch(runtime, node);
  const out = opts && opts.context ? $withImportContext(opts.context, runtime.editor)(run) : run();
  return out;
}
function getCandidates(runtime, node) {
  const candidates = [];
  for (let i2 = runtime.overlays.length - 1; i2 >= 0; i2--) {
    const d2 = runtime.overlays[i2];
    const idx = getDispatchIndices(d2, node);
    if (idx.length > 0) {
      candidates.push({
        dispatch: d2,
        indices: idx
      });
    }
  }
  const mainIdx = getDispatchIndices(runtime.dispatch, node);
  if (mainIdx.length > 0) {
    candidates.push({
      dispatch: runtime.dispatch,
      indices: mainIdx
    });
  }
  return candidates;
}
function $dispatch(runtime, node) {
  const candidates = getCandidates(runtime, node);
  if (candidates.length === 0) {
    return $hoistChildrenOf(runtime, node);
  }
  let groupCursor = 0;
  let ruleCursor = 0;
  const $next = () => {
    while (groupCursor < candidates.length) {
      const {
        dispatch,
        indices
      } = candidates[groupCursor];
      while (ruleCursor < indices.length) {
        const idx = indices[ruleCursor++];
        const rule = dispatch.rules[idx];
        const captures = {};
        if (rule.predicate(node, captures)) {
          const ctx = makeContext(runtime, Object.keys(captures).length === 0 ? NO_CAPTURES : captures);
          try {
            return rule.$import(ctx, node, $next);
          } catch (e2) {
            {
              console.error(`[lexical] DOM import rule "${rule.name}" threw on node`, node, e2);
            }
            throw e2;
          }
        }
      }
      groupCursor++;
      ruleCursor = 0;
    }
    return $hoistChildrenOf(runtime, node);
  };
  return $next();
}
function $hoistChildrenOf(runtime, node) {
  if (node.childNodes.length === 0) {
    return [];
  }
  const collected = [];
  for (const child of Array.from(node.childNodes)) {
    const produced = $importOneInternal(runtime, child, void 0);
    for (const lex of produced) {
      collected.push(lex);
    }
  }
  return collected;
}
function $runImport(dispatch, editor, dom, session) {
  const installed = session.get(ImportOverlays);
  const runtime = {
    dispatch,
    editor,
    overlays: installed.map((o2) => o2.dispatch),
    session
  };
  const rootParent = isDOMDocumentNode2(dom) ? dom.body : dom;
  return $importChildrenRun(runtime, rootParent, {
    schema: RootSchema
  });
}
function $runPreprocessStack(stack, dom, ctx) {
  let i2 = stack.length - 1;
  const $next = () => {
    while (i2 >= 0) {
      const cur = stack[i2--];
      cur(dom, ctx, $next);
      return;
    }
  };
  $next();
}
var DefaultHoistRule = {
  $import: (ctx, el) => ctx.$importChildren(el),
  match: /* @__PURE__ */ selBase.any(),
  name: "@lexical/html/default-hoist"
};
var DOMImportExtension = {
  build(editor, config) {
    const dispatch = compileImportRules(flattenRuleEntries(config.rules));
    const defaults = contextFromPairs(config.contextDefaults, void 0);
    const configPreprocess = config.preprocess;
    return {
      $generateNodesFromDOM: (dom, options) => {
        const parentRecord = getContextRecord(DOMImportContextSymbol, editor) || defaults;
        const fromOpts = options && options.context ? contextFromPairs(options.context, parentRecord) : parentRecord;
        const sessionRecord = fromOpts !== void 0 && fromOpts !== parentRecord ? fromOpts : Object.create(parentRecord || null);
        const session = new ImportSessionImpl(sessionRecord);
        const preprocessCtx = {
          session
        };
        const stack = options && options.preprocess ? [...configPreprocess, ...options.preprocess] : configPreprocess;
        $runPreprocessStack(stack, dom, preprocessCtx);
        return /* @__PURE__ */ $withFullContext(DOMImportContextSymbol, sessionRecord, () => $runImport(dispatch, editor, dom, session), editor);
      },
      defaults
    };
  },
  config: {
    contextDefaults: [],
    preprocess: [$inlineStylesFromStyleSheets],
    rules: [DefaultHoistRule]
  },
  // `contextDefaults` and `preprocess` append (last wins / runs first,
  // since the preprocess stack is run from the end) while `rules`
  // prepends (first entry wins, and dispatch reads the list front to
  // back). Configs are merged in dependency order, so in every case the
  // more dependent contributor ends up with the higher priority. See
  // `DOMImportConfig` for the full explanation.
  mergeConfig(config, partial) {
    return shallowMergeConfig2(config, {
      ...partial,
      ...partial.contextDefaults && {
        contextDefaults: [...config.contextDefaults, ...partial.contextDefaults]
      },
      ...partial.preprocess && {
        preprocess: [...config.preprocess, ...partial.preprocess]
      },
      ...partial.rules && {
        rules: [...partial.rules, ...config.rules]
      }
    });
  },
  name: DOMImportExtensionName
};
function $generateNodesFromDOMViaExtension(dom, options) {
  return $getExtensionOutput2(DOMImportExtension).$generateNodesFromDOM(dom, options);
}
var CoreImportExtension = {
  dependencies: [[DOMImportExtension, {
    rules: CoreImportRules
  }]],
  name: "@lexical/html/CoreImport"
};
// @__NO_SIDE_EFFECTS__
function defineImportRule(rule) {
  return rule;
}
var HorizontalRuleImportRules = [HorizontalRuleRule];
var HorizontalRuleImportExtension = {
  dependencies: [HorizontalRuleExtension2, CoreImportExtension],
  name: "@lexical/html/HorizontalRuleImport"
};
var sel = {
  any: selBase.any,
  comment: selBase.comment,
  /**
   * Parse a reduced CSS-selector subset and return a builder you can chain
   * combinator methods off of.
   */
  css: parseSelector,
  tag: selBase.tag,
  text: selBase.text
};
var IGNORE_TAGS = /* @__PURE__ */ new Set(["STYLE", "SCRIPT"]);
function $generateNodesFromDOM(editor, dom) {
  $inlineStylesFromStyleSheetsDOM(dom);
  const elements = isDOMDocumentNode2(dom) ? dom.body.childNodes : dom.childNodes;
  const lexicalNodes = [];
  const allArtificialNodes = [];
  for (const element of elements) {
    if (!IGNORE_TAGS.has(element.nodeName)) {
      const lexicalNode = $createNodesFromDOM(element, editor, allArtificialNodes, false);
      if (lexicalNode !== null) {
        for (const node of lexicalNode) {
          lexicalNodes.push(node);
        }
      }
    }
  }
  $unwrapArtificialNodes(allArtificialNodes);
  return lexicalNodes;
}
function $generateDOMFromNodes(container, selection = null, editor = $getEditor2()) {
  return $withRenderContext([contextValue(RenderContextExport, true)], editor)(() => {
    const root = $getRoot2();
    const domConfig = $getSessionDOMRenderConfig(editor);
    const slotFrame = $getSelectionSlotFrame2(selection);
    const parentElementAppend = container.append.bind(container);
    for (const topLevelNode of ($isElementNode2(slotFrame) ? slotFrame : root).getChildren()) {
      $appendNodesToHTML(editor, topLevelNode, parentElementAppend, selection, domConfig);
    }
    return container;
  });
}
function $generateDOMFromRoot(container, root = $getRoot2()) {
  const editor = $getEditor2();
  return $withRenderContext([contextValue(RenderContextExport, true), contextValue(RenderContextRoot, true)], editor)(() => {
    const selection = null;
    const domConfig = $getSessionDOMRenderConfig(editor);
    const parentElementAppend = container.append.bind(container);
    $appendNodesToHTML(editor, root, parentElementAppend, selection, domConfig);
    return container;
  });
}
function $generateHtmlFromNodes(editor, selection = null) {
  if (typeof document === "undefined" || typeof window === "undefined" && typeof global.window === "undefined") {
    {
      formatDevErrorMessage5(`To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom or use withDOM from @lexical/headless/dom before calling this function.`);
    }
  }
  $assumeActiveEditor2(editor);
  return $generateDOMFromNodes($getDocument2().createElement("div"), selection, editor).innerHTML;
}
function $appendTerminatingLineBreak(element, lastIncludedChild) {
  const lastChild = element.lastChild;
  if ($isLineBreakNode2(lastIncludedChild) && isHTMLElement2(element) && isBlockDomNode2(element) && lastChild !== null && lastChild.nodeName === "BR") {
    const br = $getDocument2().createElement("br");
    br.setAttribute("data-lexical-managed-linebreak", "true");
    element.append(br);
  }
}
function $appendNodesToHTML(editor, currentNode, parentElementAppend, selection = null, domConfig = $getEditorDOMRenderConfig2(editor)) {
  let shouldInclude = domConfig.$shouldInclude(currentNode, selection, editor);
  const shouldExclude = domConfig.$shouldExclude(currentNode, selection, editor);
  let target = currentNode;
  if (selection !== null && $isTextNode2(currentNode)) {
    target = $sliceSelectedTextNodeContent2(selection, currentNode, "clone");
  }
  const exportProps = domConfig.$exportDOM(target, editor);
  const {
    element,
    after,
    append,
    $getChildNodes
  } = exportProps;
  if (!element) {
    return false;
  }
  const fragment = $getDocument2().createDocumentFragment();
  const children = $getChildNodes ? $getChildNodes() : $isElementNode2(target) ? target.getChildren() : [];
  const childSelection = shouldInclude && $isNodeSelection2(selection) && $isElementNode2(currentNode) ? null : selection;
  const fragmentAppend = fragment.append.bind(fragment);
  let lastIncludedChild = null;
  for (const childNode of children) {
    const shouldIncludeChild = $appendNodesToHTML(editor, childNode, fragmentAppend, childSelection, domConfig);
    if (shouldIncludeChild) {
      lastIncludedChild = childNode;
    }
    if (!shouldInclude && shouldIncludeChild && domConfig.$extractWithChild(currentNode, childNode, selection, "html", editor)) {
      shouldInclude = true;
    }
  }
  if (shouldInclude && !shouldExclude) {
    if (isHTMLElement2(element) || isDocumentFragment2(element)) {
      if (append) {
        append(fragment);
      } else {
        element.append(fragment);
      }
      $appendTerminatingLineBreak(element, lastIncludedChild);
    }
    if (isDocumentFragment2(element)) {
      if (after) {
        const newElement = after.call(target, element);
        if (newElement) {
          element.replaceChildren(newElement);
        }
      }
      parentElementAppend(element);
    } else {
      parentElementAppend(element);
      if (after) {
        const newElement = after.call(target, element);
        if (newElement) {
          element.replaceWith(newElement);
        }
      }
    }
  } else {
    parentElementAppend(fragment);
  }
  return shouldInclude;
}
function $appendNodeToHTML(editor, node, parentElement, selection = null) {
  return $appendNodesToHTML(
    editor,
    node,
    parentElement.append.bind(parentElement),
    selection,
    // Resolve through the session so disabledForSession / export-only
    // overrides apply to slot subtrees the same way they apply to the
    // sibling content the outer exporter walks.
    $getSessionDOMRenderConfig(editor)
  );
}
function getConversionFunction(domNode, editor) {
  const {
    nodeName
  } = domNode;
  const cachedConversions = editor._htmlConversions.get(nodeName.toLowerCase());
  let currentConversion = null;
  if (cachedConversions !== void 0) {
    for (const cachedConversion of cachedConversions) {
      const domConversion = cachedConversion(domNode);
      if (domConversion !== null && (currentConversion === null || // Given equal priority, prefer the last registered importer
      // which is typically an application custom node or HTMLConfig['import']
      (currentConversion.priority || 0) <= (domConversion.priority || 0))) {
        currentConversion = domConversion;
      }
    }
  }
  return currentConversion !== null ? currentConversion.conversion : null;
}
function $createNodesFromDOM(node, editor, allArtificialNodes, hasBlockAncestorLexicalNode, forChildMap = /* @__PURE__ */ new Map(), parentLexicalNode) {
  const lexicalNodes = [];
  if (IGNORE_TAGS.has(node.nodeName)) {
    return lexicalNodes;
  }
  let currentLexicalNode = null;
  const transformFunction = getConversionFunction(node, editor);
  const transformOutput = transformFunction ? transformFunction(node) : null;
  let postTransform = null;
  if (transformOutput !== null) {
    postTransform = transformOutput.after;
    const transformNodes = transformOutput.node;
    currentLexicalNode = Array.isArray(transformNodes) ? transformNodes[transformNodes.length - 1] : transformNodes;
    if (currentLexicalNode !== null) {
      for (const [, forChildFunction] of forChildMap) {
        currentLexicalNode = forChildFunction(currentLexicalNode, parentLexicalNode);
        if (!currentLexicalNode) {
          break;
        }
      }
      if (currentLexicalNode) {
        lexicalNodes.push(...Array.isArray(transformNodes) ? transformNodes : [currentLexicalNode]);
      }
    }
    if (transformOutput.forChild != null) {
      forChildMap.set(node.nodeName, transformOutput.forChild);
    }
  }
  const children = node.childNodes;
  let childLexicalNodes = [];
  const hasBlockAncestorLexicalNodeForChildren = currentLexicalNode != null && $isRootOrShadowRoot2(currentLexicalNode) ? false : currentLexicalNode != null && $isBlockElementNode2(currentLexicalNode) || hasBlockAncestorLexicalNode;
  for (let i2 = 0; i2 < children.length; i2++) {
    childLexicalNodes.push(...$createNodesFromDOM(children[i2], editor, allArtificialNodes, hasBlockAncestorLexicalNodeForChildren, new Map(forChildMap), currentLexicalNode));
  }
  if (postTransform != null) {
    childLexicalNodes = postTransform(childLexicalNodes);
  }
  if (isBlockDomNode2(node)) {
    if (!hasBlockAncestorLexicalNodeForChildren) {
      childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, $createParagraphNode2);
    } else {
      childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, () => {
        const artificialNode = new ArtificialNode__DO_NOT_USE2();
        allArtificialNodes.push(artificialNode);
        return artificialNode;
      });
    }
  }
  if (currentLexicalNode == null) {
    if (childLexicalNodes.length > 0) {
      for (const childNode of childLexicalNodes) {
        lexicalNodes.push(childNode);
      }
    } else {
      if (isBlockDomNode2(node) && isDomNodeBetweenTwoInlineNodes(node)) {
        lexicalNodes.push($createLineBreakNode2());
      }
    }
  } else {
    if ($isElementNode2(currentLexicalNode)) {
      currentLexicalNode.append(...childLexicalNodes);
    }
  }
  return lexicalNodes;
}
function wrapContinuousInlines(domNode, nodes, createWrapperFn) {
  const textAlign = domNode.style.textAlign;
  const out = [];
  let continuousInlines = [];
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = nodes[i2];
    if ($isBlockElementNode2(node)) {
      if (textAlign && !node.getFormat()) {
        node.setFormat(textAlign);
      }
      out.push(node);
    } else {
      continuousInlines.push(node);
      if (i2 === nodes.length - 1 || i2 < nodes.length - 1 && $isBlockElementNode2(nodes[i2 + 1])) {
        const wrapper = createWrapperFn();
        wrapper.setFormat(textAlign);
        wrapper.append(...continuousInlines);
        out.push(wrapper);
        continuousInlines = [];
      }
    }
  }
  return out;
}
function $unwrapArtificialNodes(allArtificialNodes) {
  for (const node of allArtificialNodes) {
    if (node.getParent() && node.getNextSibling() instanceof ArtificialNode__DO_NOT_USE2) {
      node.insertAfter($createLineBreakNode2());
    }
  }
  for (const node of allArtificialNodes) {
    const parent = node.getParent();
    if (parent) {
      parent.splice(node.getIndexWithinParent(), 1, node.getChildren());
    }
  }
}
function isDomNodeBetweenTwoInlineNodes(node) {
  if (node.nextSibling == null || node.previousSibling == null) {
    return false;
  }
  return isInlineDomNode2(node.nextSibling) && isInlineDomNode2(node.previousSibling);
}

// node_modules/@lexical/html/dist/LexicalHtml.mjs
var mod5 = true ? LexicalHtml_dev_exports : LexicalHtml_prod_exports;
var $appendNodeToHTML2 = mod5.$appendNodeToHTML;
var $distributeInlineWrapper2 = mod5.$distributeInlineWrapper;
var $generateDOMFromNodes2 = mod5.$generateDOMFromNodes;
var $generateDOMFromRoot2 = mod5.$generateDOMFromRoot;
var $generateHtmlFromNodes2 = mod5.$generateHtmlFromNodes;
var $generateNodesFromDOM2 = mod5.$generateNodesFromDOM;
var $generateNodesFromDOMViaExtension2 = mod5.$generateNodesFromDOMViaExtension;
var $getImportContextValue2 = mod5.$getImportContextValue;
var $getRenderContextValue2 = mod5.$getRenderContextValue;
var $getSessionDOMRenderConfig2 = mod5.$getSessionDOMRenderConfig;
var $inlineStylesFromStyleSheets2 = mod5.$inlineStylesFromStyleSheets;
var $isBlockLevel2 = mod5.$isBlockLevel;
var $propagateTextAlignToBlockChildren2 = mod5.$propagateTextAlignToBlockChildren;
var $setRenderContextValue2 = mod5.$setRenderContextValue;
var $updateRenderContextValue2 = mod5.$updateRenderContextValue;
var $withImportContext2 = mod5.$withImportContext;
var $withRenderContext2 = mod5.$withRenderContext;
var BlockSchema2 = mod5.BlockSchema;
var CoreImportExtension2 = mod5.CoreImportExtension;
var CoreImportRules2 = mod5.CoreImportRules;
var DOMImportExtension2 = mod5.DOMImportExtension;
var DOMRenderExtension2 = mod5.DOMRenderExtension;
var HorizontalRuleImportExtension2 = mod5.HorizontalRuleImportExtension;
var HorizontalRuleImportRules2 = mod5.HorizontalRuleImportRules;
var ImportOverlays2 = mod5.ImportOverlays;
var ImportSource2 = mod5.ImportSource;
var ImportSourceDataTransfer2 = mod5.ImportSourceDataTransfer;
var ImportTextFormat2 = mod5.ImportTextFormat;
var ImportTextStyle2 = mod5.ImportTextStyle;
var ImportWhitespaceConfig2 = mod5.ImportWhitespaceConfig;
var InlineSchema2 = mod5.InlineSchema;
var NestedBlockSchema2 = mod5.NestedBlockSchema;
var RenderContextExport2 = mod5.RenderContextExport;
var RenderContextRoot2 = mod5.RenderContextRoot;
var RootSchema2 = mod5.RootSchema;
var contextUpdater2 = mod5.contextUpdater;
var contextValue2 = mod5.contextValue;
var createImportState2 = mod5.createImportState;
var createRenderState2 = mod5.createRenderState;
var defaultIsInline2 = mod5.defaultIsInline;
var defaultPreservesWhitespace2 = mod5.defaultPreservesWhitespace;
var defineImportRule2 = mod5.defineImportRule;
var defineOverlayRules2 = mod5.defineOverlayRules;
var domOverride2 = mod5.domOverride;
var isElementOfTag2 = mod5.isElementOfTag;
var parseSelector2 = mod5.parseSelector;
var sel2 = mod5.sel;

// node_modules/@lexical/clipboard/dist/LexicalClipboard.dev.mjs
function isWithinComposedTree(node, rootElement) {
  for (let current = node; current !== null; ) {
    if (current === rootElement) {
      return true;
    }
    current = getParentElement2(current);
  }
  return false;
}
function findTextOffsetAtPoint(x2, y2, container, doc) {
  const range = doc.createRange();
  const vDist = (r2) => y2 < r2.top ? r2.top - y2 : y2 > r2.bottom ? y2 - r2.bottom : 0;
  const hDist = (r2) => x2 < r2.left ? r2.left - x2 : x2 > r2.right ? x2 - r2.right : 0;
  const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let bestNode = null;
  let bestV = Infinity;
  let bestH = Infinity;
  for (let n2 = walker.nextNode(); n2; n2 = walker.nextNode()) {
    range.selectNodeContents(n2);
    for (const r2 of range.getClientRects()) {
      const v2 = vDist(r2);
      const h2 = hDist(r2);
      if (v2 < bestV || v2 === bestV && h2 < bestH) {
        bestV = v2;
        bestH = h2;
        bestNode = n2;
      }
    }
  }
  if (bestNode === null) {
    return null;
  }
  let bestOffset = 0;
  let offV = Infinity;
  let offH = Infinity;
  for (let i2 = 0; i2 <= bestNode.length; i2++) {
    range.setStart(bestNode, i2);
    range.collapse(true);
    const r2 = range.getBoundingClientRect();
    const v2 = vDist(r2);
    const h2 = Math.abs(x2 - r2.left);
    if (v2 < offV || v2 === offV && h2 < offH) {
      offV = v2;
      offH = h2;
      bestOffset = i2;
    }
  }
  return {
    node: bestNode,
    offset: bestOffset
  };
}
function caretFromPoint(x2, y2, rootElement = null) {
  const doc = getRootOwnerDocument2(rootElement);
  const shadowRoots = rootElement ? getDOMShadowRoots2(rootElement) : [];
  const hasShadow = rootElement !== null && shadowRoots.length > 0;
  if (hasShadow && typeof doc.caretPositionFromPoint === "function") {
    const caretPosition = doc.caretPositionFromPoint(x2, y2, {
      shadowRoots
    });
    if (caretPosition !== null && isWithinComposedTree(caretPosition.offsetNode, rootElement)) {
      return {
        node: caretPosition.offsetNode,
        offset: caretPosition.offset
      };
    }
  }
  if (hasShadow) {
    const rootNode = rootElement.getRootNode();
    if (isDOMShadowRoot2(rootNode)) {
      const element = rootNode.elementFromPoint(x2, y2);
      if (element !== null && rootElement.contains(element)) {
        const result = findTextOffsetAtPoint(x2, y2, element, doc);
        if (result !== null) {
          return result;
        }
      }
    }
  }
  if (typeof doc.caretRangeFromPoint === "function") {
    const range = doc.caretRangeFromPoint(x2, y2);
    if (range === null) {
      return null;
    }
    return {
      node: range.startContainer,
      offset: range.startOffset
    };
  } else if (typeof doc.caretPositionFromPoint === "function") {
    const caretPosition = doc.caretPositionFromPoint(x2, y2);
    if (caretPosition === null) {
      return null;
    }
    return {
      node: caretPosition.offsetNode,
      offset: caretPosition.offset
    };
  }
  return null;
}
function formatDevErrorMessage6(message) {
  throw new Error(message);
}
var DEFAULT_IMPORT_MIME_TYPE_PRIORITY = {
  "application/x-lexical-editor": 0,
  "text/html": 10,
  "text/plain": 20,
  "text/uri-list": 30
};
function trustHTML(html) {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    const policy = window.trustedTypes.createPolicy("lexical", {
      createHTML: (input) => input
    });
    return policy.createHTML(html);
  }
  return html;
}
var $defaultLexicalEditorImporter = (data, selection, $next) => {
  try {
    const editor = $getEditor2();
    const payload = JSON.parse(data);
    if (payload && payload.namespace === editor._config.namespace && Array.isArray(payload.nodes)) {
      const nodes = $generateNodesFromSerializedNodes(payload.nodes);
      $insertGeneratedNodes(editor, nodes, selection);
      return true;
    }
  } catch (error) {
    console.error(error);
  }
  return $next();
};
var $defaultHtmlImporter = (data, selection, $next) => {
  try {
    const editor = $getEditor2();
    const parser = new DOMParser();
    const dom = parser.parseFromString(trustHTML(data), "text/html");
    const nodes = $generateNodesFromDOM2(editor, dom);
    $insertGeneratedNodes(editor, nodes, selection);
    return true;
  } catch (error) {
    console.error(error);
    return $next();
  }
};
var $defaultPlainTextImporter = (data, selection) => {
  if (!$isRangeSelection2(selection)) {
    selection.insertRawText(data);
    return true;
  }
  if (selection !== $getSelection2()) {
    $setSelection2(selection);
  }
  const withCurrentRange = (fn) => {
    const cur = $getSelection2();
    if ($isRangeSelection2(cur)) {
      fn(cur);
    }
  };
  tokenizeRawText2(data, {
    linebreak: () => withCurrentRange((cur) => cur.insertParagraph()),
    tab: () => withCurrentRange((cur) => cur.insertNodes([$createTabNode2()])),
    text: (part) => withCurrentRange((cur) => cur.insertText(part))
  });
  return true;
};
var DEFAULT_IMPORT_MIME_TYPE = {
  "application/x-lexical-editor": [$defaultLexicalEditorImporter],
  "text/html": [$defaultHtmlImporter],
  "text/plain": [$defaultPlainTextImporter],
  // `text/uri-list` is a Webkit-only payload that drops behave-like text;
  // reuse the plain-text handler so a URL drop on a rich-text editor
  // inserts as plain text rather than being ignored.
  "text/uri-list": [$defaultPlainTextImporter]
};
function $callImportMimeTypeFunctionStack(fns, data, selection, dataTransfer) {
  if (!fns) {
    return false;
  }
  const callAt = (i2) => fns[i2] ? fns[i2](data, selection, callAt.bind(null, i2 - 1), dataTransfer) : false;
  return callAt(fns.length - 1);
}
function orderedMimeTypes(config) {
  const mimes = Object.keys(config.$importMimeType).filter((k) => config.$importMimeType[k] !== void 0);
  return mimes.sort((a2, b2) => {
    const wa = config.priority[a2];
    const wb = config.priority[b2];
    if (wa === void 0 && wb === void 0) {
      return a2 < b2 ? -1 : a2 > b2 ? 1 : 0;
    }
    if (wa === void 0) {
      return 1;
    }
    if (wb === void 0) {
      return -1;
    }
    return wa - wb;
  });
}
function $runImport2(config, dataTransfer, selection) {
  const plainString = dataTransfer.getData("text/plain");
  for (const mime of orderedMimeTypes(config)) {
    const data = dataTransfer.getData(mime);
    if (!data) {
      continue;
    }
    if (mime === "text/html" && data === plainString) {
      continue;
    }
    if ($callImportMimeTypeFunctionStack(config.$importMimeType[mime], data, selection, dataTransfer)) {
      return true;
    }
  }
  return false;
}
var DEFAULT_OUTPUT = {
  $importMimeType: DEFAULT_IMPORT_MIME_TYPE,
  $insertDataTransfer: (dataTransfer, selection) => $runImport2({
    $importMimeType: DEFAULT_IMPORT_MIME_TYPE,
    priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
  }, dataTransfer, selection),
  priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
};
function $getImportOutput() {
  const dep = $getPeerDependency2(ClipboardImportExtension.name);
  return dep ? dep.output : DEFAULT_OUTPUT;
}
var ClipboardImportExtension = {
  build: (_editor, config) => ({
    $importMimeType: config.$importMimeType,
    $insertDataTransfer: (dataTransfer, selection) => $runImport2(config, dataTransfer, selection),
    priority: config.priority
  }),
  config: {
    $importMimeType: DEFAULT_IMPORT_MIME_TYPE,
    priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
  },
  mergeConfig(config, partial) {
    const merged = shallowMergeConfig2(config, partial);
    if (partial.$importMimeType) {
      const $importMimeType = {
        ...config.$importMimeType
      };
      for (const [k, v2] of Object.entries(partial.$importMimeType)) {
        if (v2) {
          const prev = $importMimeType[k];
          $importMimeType[k] = prev ? [...prev, ...v2] : v2;
        }
      }
      merged.$importMimeType = $importMimeType;
    }
    if (partial.priority) {
      merged.priority = {
        ...config.priority,
        ...partial.priority
      };
    }
    return merged;
  },
  name: "@lexical/clipboard/Import"
};
var ClipboardDOMImportExtension = {
  dependencies: [CoreImportExtension2, [ClipboardImportExtension, {
    $importMimeType: {
      "text/html": [(html, selection, _$next, dataTransfer) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(trustHTML(html), "text/html");
        const nodes = $generateNodesFromDOMViaExtension2(dom, {
          context: [contextValue2(ImportSource2, "paste"), contextValue2(ImportSourceDataTransfer2, dataTransfer)]
        });
        $insertGeneratedNodes($getEditor2(), nodes, selection);
        return true;
      }]
    }
  }]],
  name: "@lexical/clipboard/DOMImport"
};
function $getHtmlContent(editor, selection = $getSelection2()) {
  if (selection == null) {
    {
      formatDevErrorMessage6(`Expected valid LexicalSelection`);
    }
  }
  if ($isRangeSelection2(selection) && selection.isCollapsed() || selection.getNodes().length === 0) {
    return "";
  }
  return $generateHtmlFromNodes2(editor, selection);
}
function $getLexicalContent(editor, selection = $getSelection2()) {
  if (selection == null) {
    {
      formatDevErrorMessage6(`Expected valid LexicalSelection`);
    }
  }
  if ($isRangeSelection2(selection) && selection.isCollapsed() || selection.getNodes().length === 0) {
    return null;
  }
  return JSON.stringify($generateJSONFromSelectedNodes(editor, selection));
}
function $insertDataTransferForPlainText(dataTransfer, selection) {
  const text = dataTransfer.getData("text/plain") || dataTransfer.getData("text/uri-list");
  if (text != null) {
    selection.insertRawText(text);
  }
}
function $insertDataTransferForRichText(dataTransfer, selection, _editor) {
  $getImportOutput().$insertDataTransfer(dataTransfer, selection);
}
var LEXICAL_DRAG_MIME_TYPE = "application/x-lexical-drag";
function $writeDragSourceToDataTransfer(dataTransfer, editor) {
  const marker = {
    editorKey: editor.getKey()
  };
  dataTransfer.setData(LEXICAL_DRAG_MIME_TYPE, JSON.stringify(marker));
}
function isLexicalDragMarker(value) {
  return value !== null && typeof value === "object" && "editorKey" in value && typeof value.editorKey === "string";
}
function readDragMarker(dataTransfer) {
  const raw = dataTransfer.getData(LEXICAL_DRAG_MIME_TYPE);
  if (!raw) {
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_unused) {
    return null;
  }
  return isLexicalDragMarker(parsed) ? parsed : null;
}
function findEditorRootByKey(key, doc) {
  for (const el of findAllLexicalElementsDeep2(doc)) {
    const editor = getEditorPropertyFromDOMNode2(el);
    if (isLexicalEditor2(editor) && editor.getKey() === key && isHTMLElement2(el)) {
      return el;
    }
  }
  return null;
}
function $resolveDropPointCaret(event, editor) {
  const hit = caretFromPoint(event.clientX, event.clientY, editor.getRootElement());
  if (hit === null) {
    return null;
  }
  const node = $getNearestNodeFromDOMNode2(hit.node);
  if (node === null) {
    return null;
  }
  if ($isTextNode2(node)) {
    return $getTextPointCaret2(node, "next", hit.offset);
  }
  if ($isElementNode2(node)) {
    return $getChildCaretAtIndex2(node, hit.offset, "next");
  }
  const parent = node.getParent();
  if (parent === null) {
    return null;
  }
  return $getChildCaretAtIndex2(parent, node.getIndexWithinParent() + 1, "next");
}
function $isDropCaretInsideSelection(dropCaret, selection) {
  const {
    anchor: start,
    focus: end
  } = $getCaretRangeInDirection2($caretRangeFromSelection2(selection), "next");
  return $comparePointCaretNext2(start, dropCaret) < 0 && $comparePointCaretNext2(dropCaret, end) < 0;
}
function $doDrop(event, editor, $insertDataTransfer) {
  const dataTransfer = event.dataTransfer;
  if (dataTransfer === null) {
    return false;
  }
  const marker = readDragMarker(dataTransfer);
  if (marker === null) {
    return false;
  }
  const dropCaret = $resolveDropPointCaret(event, editor);
  if (dropCaret === null) {
    return false;
  }
  const stableDropCaret = $splitAtPointCaretNext2(dropCaret);
  if (stableDropCaret === null) {
    return false;
  }
  const isSameEditorDrag = marker.editorKey === editor.getKey();
  const currentSelection = $getSelection2();
  if (isSameEditorDrag) {
    if (!$isRangeSelection2(currentSelection) || currentSelection.isCollapsed()) {
      return false;
    }
    if ($isDropCaretInsideSelection(dropCaret, currentSelection)) {
      event.preventDefault();
      return true;
    }
    currentSelection.removeText();
  }
  if (!stableDropCaret.origin.isAttached()) {
    event.preventDefault();
    return true;
  }
  const dropSelection = $setSelectionFromCaretRange2($getCollapsedCaretRange2(stableDropCaret));
  $insertDataTransfer(dataTransfer, dropSelection, editor);
  if (!isSameEditorDrag) {
    const rootElement = editor.getRootElement();
    const doc = rootElement ? rootElement.ownerDocument : null;
    const sourceRoot = doc ? findEditorRootByKey(marker.editorKey, doc) : null;
    if (sourceRoot !== null) {
      sourceRoot.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "deleteByDrag"
      }));
    }
  }
  event.preventDefault();
  return true;
}
function $handleRichTextDrop(event, editor) {
  return $doDrop(event, editor, $insertDataTransferForRichText);
}
function $handlePlainTextDrop(event, editor) {
  return $doDrop(event, editor, (dataTransfer, selection) => $insertDataTransferForPlainText(dataTransfer, selection));
}
function $insertGeneratedNodes(editor, nodes, selection) {
  if (!editor.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND2, {
    nodes,
    selection
  })) {
    selection.insertNodes(nodes);
    $updateSelectionOnInsert(selection);
  }
  return;
}
function $updateSelectionOnInsert(selection) {
  if ($isRangeSelection2(selection) && selection.isCollapsed()) {
    const anchor = selection.anchor;
    let nodeToInspect = null;
    const anchorCaret = $caretFromPoint2(anchor, "previous");
    if (anchorCaret) {
      if ($isTextPointCaret2(anchorCaret)) {
        nodeToInspect = anchorCaret.origin;
      } else {
        const range = $getCaretRange2(anchorCaret, $getChildCaret2($getRoot2(), "next").getFlipped());
        for (const caret of range) {
          if ($isTextNode2(caret.origin)) {
            nodeToInspect = caret.origin;
            break;
          } else if ($isElementNode2(caret.origin) && !caret.origin.isInline()) {
            break;
          }
        }
      }
    }
    if (nodeToInspect && $isTextNode2(nodeToInspect)) {
      const newFormat = nodeToInspect.getFormat();
      const newStyle = nodeToInspect.getStyle();
      if (selection.format !== newFormat || selection.style !== newStyle) {
        selection.format = newFormat;
        selection.style = newStyle;
        selection.dirty = true;
      }
    }
  }
}
function exportNodeToJSON(node) {
  const serializedNode = node.exportJSON();
  const nodeClass = node.constructor;
  if (serializedNode.type !== nodeClass.getType()) {
    {
      formatDevErrorMessage6(`LexicalNode: Node ${nodeClass.name} does not implement .exportJSON().`);
    }
  }
  if ($isElementNode2(node)) {
    const serializedChildren = serializedNode.children;
    if (!Array.isArray(serializedChildren)) {
      {
        formatDevErrorMessage6(`LexicalNode: Node ${nodeClass.name} is an element but .exportJSON() does not have a children array.`);
      }
    }
  }
  return serializedNode;
}
function $appendNodesToJSON(editor, selection, currentNode, targetArray = []) {
  let shouldInclude = selection !== null ? currentNode.isSelected(selection) : true;
  const shouldExclude = $isElementNode2(currentNode) && currentNode.excludeFromCopy("clone");
  let target = currentNode;
  if (selection !== null && $isTextNode2(target)) {
    target = $sliceSelectedTextNodeContent2(selection, target, "clone");
  }
  const children = $isElementNode2(target) ? target.getChildren() : [];
  const serializedNode = exportNodeToJSON(target);
  if ($isTextNode2(target) && target.getTextContentSize() === 0) {
    shouldInclude = false;
  }
  const childSelection = shouldInclude && $isNodeSelection2(selection) && $isElementNode2(currentNode) ? null : selection;
  for (let i2 = 0; i2 < children.length; i2++) {
    const childNode = children[i2];
    const shouldIncludeChild = $appendNodesToJSON(editor, childSelection, childNode, serializedNode.children);
    if (!shouldInclude && $isElementNode2(currentNode) && shouldIncludeChild && currentNode.extractWithChild(childNode, selection, "clone")) {
      shouldInclude = true;
    }
  }
  if (shouldInclude && !shouldExclude) {
    const slotNames = $getSlotNames2(target);
    if (slotNames.length > 0) {
      const serializedSlots = {};
      for (const name of slotNames) {
        const slotNode = $getSlot2(target, name);
        if (!(slotNode !== null)) {
          formatDevErrorMessage6(`LexicalNode: Node ${target.constructor.name} has slot "${name}" but it resolved to no node during export.`);
        }
        const slotArray = [];
        $appendNodesToJSON(editor, null, slotNode, slotArray);
        if (!(slotArray.length === 1 && slotArray[0].type === slotNode.getType())) {
          formatDevErrorMessage6(`LexicalNode: slot "${name}" on ${target.constructor.name} did not serialize to exactly the slot value node (got ${String(slotArray.length)} of type ${String(slotArray.length > 0 ? slotArray[0].type : "none")}); a slot value must not be excluded from copy.`);
        }
        serializedSlots[name] = slotArray[0];
      }
      serializedNode.$slots = serializedSlots;
    }
  }
  if (shouldInclude && !shouldExclude) {
    targetArray.push(serializedNode);
  } else if (Array.isArray(serializedNode.children)) {
    for (let i2 = 0; i2 < serializedNode.children.length; i2++) {
      const serializedChildNode = serializedNode.children[i2];
      targetArray.push(serializedChildNode);
    }
  }
  return shouldInclude;
}
function $generateJSONFromSelectedNodes(editor, selection) {
  const nodes = [];
  const root = $getRoot2();
  const slotFrame = $getSelectionSlotFrame2(selection);
  const topLevelChildren = ($isElementNode2(slotFrame) ? slotFrame : root).getChildren();
  for (let i2 = 0; i2 < topLevelChildren.length; i2++) {
    const topLevelNode = topLevelChildren[i2];
    $appendNodesToJSON(editor, selection, topLevelNode, nodes);
  }
  return {
    namespace: editor._config.namespace,
    nodes
  };
}
function $generateNodesFromSerializedNodes(serializedNodes) {
  const nodes = [];
  for (const serializedNode of serializedNodes) {
    nodes.push($parseSerializedNode2(serializedNode));
  }
  return nodes;
}
var EVENT_LATENCY = 50;
var clipboardEventTimeout = null;
async function copyToClipboard(editor, event, data) {
  if (clipboardEventTimeout !== null) {
    return false;
  }
  if (event !== null) {
    return new Promise((resolve, reject) => {
      editor.update(() => {
        resolve($copyToClipboardEvent(editor, event, data));
      });
    });
  }
  const rootElement = editor.getRootElement();
  const editorWindow = editor._window || window;
  const windowDocument = editorWindow.document;
  const domSelection = getDOMSelection2(editorWindow);
  if (rootElement === null || domSelection === null) {
    return false;
  }
  const element = windowDocument.createElement("span");
  element.style.position = "fixed";
  element.style.top = "-1000px";
  element.append(windowDocument.createTextNode("#"));
  rootElement.append(element);
  const range = windowDocument.createRange();
  range.setStart(element, 0);
  range.setEnd(element, 1);
  domSelection.removeAllRanges();
  domSelection.addRange(range);
  return new Promise((resolve, reject) => {
    const removeListener = editor.registerCommand(COPY_COMMAND2, (secondEvent) => {
      if (objectKlassEquals2(secondEvent, ClipboardEvent)) {
        removeListener();
        if (clipboardEventTimeout !== null) {
          editorWindow.clearTimeout(clipboardEventTimeout);
          clipboardEventTimeout = null;
        }
        resolve($copyToClipboardEvent(editor, secondEvent, data));
      }
      return true;
    }, COMMAND_PRIORITY_CRITICAL2);
    clipboardEventTimeout = editorWindow.setTimeout(() => {
      removeListener();
      clipboardEventTimeout = null;
      resolve(false);
    }, EVENT_LATENCY);
    windowDocument.execCommand("copy");
    element.remove();
  });
}
function $copyToClipboardEvent(editor, event, data) {
  if (data === void 0) {
    const domSelection = getDOMSelection2(editor._window);
    const selection = $getSelection2();
    if (!selection || selection.isCollapsed()) {
      return false;
    }
    if (!domSelection) {
      return false;
    }
    const points = getDOMSelectionPoints2(domSelection, editor.getRootElement());
    const anchorDOM = points.anchorNode;
    const focusDOM = points.focusNode;
    if (anchorDOM !== null && focusDOM !== null && !isSelectionWithinEditor2(editor, anchorDOM, focusDOM)) {
      return false;
    }
    data = $getClipboardDataFromSelection(selection);
  }
  event.preventDefault();
  const clipboardData = event.clipboardData;
  if (clipboardData === null) {
    return false;
  }
  setLexicalClipboardDataTransfer(clipboardData, data);
  return true;
}
var clipboardDataFunctions = [["text/html", $getHtmlContent], ["application/x-lexical-editor", $getLexicalContent]];
function $getClipboardDataFromSelection(selection = $getSelection2()) {
  return $getClipboardDataWithConfigFromSelection($getExportConfig(), selection);
}
function setLexicalClipboardDataTransfer(clipboardData, data) {
  for (const [k] of clipboardDataFunctions) {
    if (data[k] === void 0) {
      clipboardData.setData(k, "");
    }
  }
  for (const k in data) {
    const v2 = data[k];
    if (v2 !== void 0) {
      clipboardData.setData(k, v2);
    }
  }
}
function $getExportConfig(editor = $getEditor2()) {
  const dep = getPeerDependencyFromEditor2(editor, GetClipboardDataExtension.name);
  return dep ? dep.output : DEFAULT_EXPORT_MIME_TYPE;
}
var DEFAULT_EXPORT_MIME_TYPE = {
  "application/x-lexical-editor": [(sel3, next) => sel3 ? $getLexicalContent($getEditor2(), sel3) : next()],
  "text/html": [(sel3, next) => sel3 ? $getHtmlContent($getEditor2(), sel3) : next()],
  "text/plain": [(sel3, next) => sel3 ? sel3.getTextContent() : next()]
};
function $getClipboardDataWithConfigFromSelection($exportMimeType, selection) {
  const clipboardData = {
    "text/plain": ""
  };
  for (const [k, fns] of Object.entries($exportMimeType)) {
    if (fns) {
      const v2 = callExportMimeTypeFunctionStack(fns, selection);
      if (v2 !== null) {
        clipboardData[k] = v2;
      }
    }
  }
  return clipboardData;
}
function callExportMimeTypeFunctionStack(fns, selection) {
  const callAt = (i2) => fns[i2] ? fns[i2](selection, callAt.bind(null, i2 - 1)) : null;
  return callAt(fns.length - 1);
}
function $exportMimeTypeFromSelection(mimeType, selection = $getSelection2()) {
  return callExportMimeTypeFunctionStack($getExportConfig()[mimeType] || [], selection);
}
var GetClipboardDataExtension = {
  build(editor, config, state) {
    return config.$exportMimeType;
  },
  config: {
    $exportMimeType: DEFAULT_EXPORT_MIME_TYPE
  },
  mergeConfig(config, partial) {
    const merged = shallowMergeConfig2(config, partial);
    if (partial.$exportMimeType) {
      const $exportMimeType = {
        ...config.$exportMimeType
      };
      for (const [k, v2] of Object.entries(partial.$exportMimeType)) {
        if (v2) {
          const prev = $exportMimeType[k];
          $exportMimeType[k] = prev ? [...prev, ...v2] : v2;
        }
      }
      merged.$exportMimeType = $exportMimeType;
    }
    return merged;
  },
  name: "@lexical/clipboard/GetClipboardData"
};

// node_modules/@lexical/clipboard/dist/LexicalClipboard.mjs
var mod6 = true ? LexicalClipboard_dev_exports : LexicalClipboard_prod_exports;
var $exportMimeTypeFromSelection2 = mod6.$exportMimeTypeFromSelection;
var $generateJSONFromSelectedNodes2 = mod6.$generateJSONFromSelectedNodes;
var $generateNodesFromSerializedNodes2 = mod6.$generateNodesFromSerializedNodes;
var $getClipboardDataFromSelection2 = mod6.$getClipboardDataFromSelection;
var $getHtmlContent2 = mod6.$getHtmlContent;
var $getLexicalContent2 = mod6.$getLexicalContent;
var $handlePlainTextDrop2 = mod6.$handlePlainTextDrop;
var $handleRichTextDrop2 = mod6.$handleRichTextDrop;
var $insertDataTransferForPlainText2 = mod6.$insertDataTransferForPlainText;
var $insertDataTransferForRichText2 = mod6.$insertDataTransferForRichText;
var $insertGeneratedNodes2 = mod6.$insertGeneratedNodes;
var $writeDragSourceToDataTransfer2 = mod6.$writeDragSourceToDataTransfer;
var ClipboardDOMImportExtension2 = mod6.ClipboardDOMImportExtension;
var ClipboardImportExtension2 = mod6.ClipboardImportExtension;
var DEFAULT_IMPORT_MIME_TYPE2 = mod6.DEFAULT_IMPORT_MIME_TYPE;
var DEFAULT_IMPORT_MIME_TYPE_PRIORITY2 = mod6.DEFAULT_IMPORT_MIME_TYPE_PRIORITY;
var GetClipboardDataExtension2 = mod6.GetClipboardDataExtension;
var caretFromPoint2 = mod6.caretFromPoint;
var copyToClipboard2 = mod6.copyToClipboard;
var setLexicalClipboardDataTransfer2 = mod6.setLexicalClipboardDataTransfer;

// node_modules/@lexical/a11y/dist/LexicalA11y.dev.mjs
var LexicalA11y_dev_exports = {};
__export(LexicalA11y_dev_exports, {
  AriaLiveRegionExtension: () => AriaLiveRegionExtension,
  EditorModeAnnounceExtension: () => EditorModeAnnounceExtension,
  FocusManagerExtension: () => FocusManagerExtension,
  FocusTrapExtension: () => FocusTrapExtension,
  HistoryAnnounceExtension: () => HistoryAnnounceExtension,
  RovingTabIndexExtension: () => RovingTabIndexExtension
});
function applyVisuallyHidden(el) {
  const style = el.style;
  style.border = "0";
  style.clip = "rect(0 0 0 0)";
  style.height = "1px";
  style.margin = "-1px";
  style.overflow = "hidden";
  style.padding = "0";
  style.position = "absolute";
  style.whiteSpace = "nowrap";
  style.width = "1px";
}
function createLiveRegion(owner) {
  const region = owner.ownerDocument.createElement("div");
  region.setAttribute("aria-atomic", "true");
  region.setAttribute("role", "status");
  applyVisuallyHidden(region);
  owner.appendChild(region);
  return region;
}
var FOCUSABLE_SELECTOR = ["a[href]", "button:not([disabled])", 'input:not([disabled]):not([type="hidden"])', "select:not([disabled])", "textarea:not([disabled])", '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]'].join(",");
function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}
function containsComposed(container, target) {
  let current = target;
  while (current !== null) {
    if (current === container) {
      return true;
    }
    if (isDOMShadowRoot2(current)) {
      current = current.host;
    } else {
      current = current.parentNode;
    }
  }
  return false;
}
function registerFocusTrap(container, options = {}) {
  const initialFocus = options.initialFocus ?? "firstFocusable";
  const doc = container.ownerDocument;
  const deepActive = getActiveElementDeep2(doc);
  const previouslyFocused = isHTMLElement2(deepActive) ? deepActive : null;
  const focusable = getFocusableElements(container);
  if (initialFocus === "container" && container.hasAttribute("tabindex")) {
    container.focus();
  } else if (focusable.length > 0) {
    focusable[0].focus();
  } else if (container.hasAttribute("tabindex")) {
    container.focus();
  }
  const keydownHandler = (event) => {
    if (event.key !== "Tab") {
      return;
    }
    const currentFocusable = getFocusableElements(container);
    if (currentFocusable.length === 0) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const first = currentFocusable[0];
    const last = currentFocusable[currentFocusable.length - 1];
    const active = getActiveElementDeep2(doc);
    const activeIndex = isHTMLElement2(active) && containsComposed(container, active) ? currentFocusable.indexOf(active) : -1;
    if (event.shiftKey) {
      (activeIndex <= 0 ? last : currentFocusable[activeIndex - 1]).focus();
    } else {
      (activeIndex === -1 || activeIndex === currentFocusable.length - 1 ? first : currentFocusable[activeIndex + 1]).focus();
    }
  };
  const focusinHandler = (event) => {
    const target = getComposedEventTarget2(event);
    if (!isHTMLElement2(target) || containsComposed(container, target)) {
      return;
    }
    if (options.allowOutside != null && options.allowOutside(target)) {
      return;
    }
    const currentFocusable = getFocusableElements(container);
    if (currentFocusable.length > 0) {
      currentFocusable[0].focus();
    } else if (container.hasAttribute("tabindex")) {
      container.focus();
    }
  };
  return mergeRegister2(
    // Placed first so mergeRegister's reverse (LIFO) teardown runs it last,
    // after the focusin listener is removed — otherwise restoring focus to an
    // element outside the container would re-trigger the trap.
    () => {
      if (previouslyFocused !== null && typeof previouslyFocused.focus === "function" && containsComposed(doc, previouslyFocused)) {
        previouslyFocused.focus();
      }
    },
    registerEventListener2(container, "keydown", keydownHandler),
    registerEventListener2(doc, "focusin", focusinHandler)
  );
}
var DEFAULT_ROVING_SELECTOR = ":scope > button:not([disabled])";
function registerRovingTabIndex(container, options = {}) {
  const orientation = options.orientation ?? "horizontal";
  const selector = options.itemSelector ?? DEFAULT_ROVING_SELECTOR;
  const getItems = () => Array.from(container.querySelectorAll(selector));
  const applyTabIndex = (items, activeIndex) => {
    items.forEach((item, i2) => {
      item.tabIndex = i2 === activeIndex ? 0 : -1;
    });
  };
  const init = () => {
    const items = getItems();
    if (items.length === 0) {
      return;
    }
    const active = getActiveElementDeep2(container.ownerDocument);
    const activeIdx = items.findIndex((el) => el === active);
    applyTabIndex(items, activeIdx >= 0 ? activeIdx : 0);
  };
  init();
  const handler = (event) => {
    const items = getItems();
    if (items.length === 0) {
      return;
    }
    const active = getActiveElementDeep2(container.ownerDocument);
    const currentIdx = items.findIndex((el) => el === active);
    if (currentIdx < 0) {
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        applyTabIndex(items, 0);
        items[0].focus();
      }
      return;
    }
    const horizontal = orientation === "horizontal" || orientation === "both";
    const vertical = orientation === "vertical" || orientation === "both";
    let nextIdx = currentIdx;
    switch (event.key) {
      case "ArrowRight":
        if (!horizontal) {
          return;
        }
        nextIdx = currentIdx + 1;
        break;
      case "ArrowLeft":
        if (!horizontal) {
          return;
        }
        nextIdx = currentIdx - 1;
        break;
      case "ArrowDown":
        if (!vertical) {
          return;
        }
        nextIdx = currentIdx + 1;
        break;
      case "ArrowUp":
        if (!vertical) {
          return;
        }
        nextIdx = currentIdx - 1;
        break;
      case "Home":
        nextIdx = 0;
        break;
      case "End":
        nextIdx = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    nextIdx = (nextIdx + items.length) % items.length;
    applyTabIndex(items, nextIdx);
    items[nextIdx].focus();
  };
  return mergeRegister2(registerEventListener2(container, "keydown", handler), () => {
    const items = getItems();
    items.forEach((item) => {
      item.tabIndex = 0;
    });
  });
}
var DEFAULT_TOOLBAR_FOCUSABLE_SELECTOR = ':scope > button:not([disabled]), :scope > [tabindex="0"]';
function registerFocusManager(editor, toolbar, options = {}) {
  const selector = options.toolbarItemSelector ?? DEFAULT_TOOLBAR_FOCUSABLE_SELECTOR;
  const handler = (event) => {
    if (event.key !== "Escape") {
      return;
    }
    const target = getComposedEventTarget2(event);
    if (isHTMLElement2(target)) {
      const items = toolbar.querySelectorAll(selector);
      let isRovingItem = false;
      for (const item of items) {
        if (item === target || containsComposed(item, target)) {
          isRovingItem = true;
          break;
        }
      }
      if (!isRovingItem) {
        return;
      }
    }
    const rootElement = editor.getRootElement();
    if (rootElement === null) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    editor.focus();
    rootElement.focus();
  };
  return mergeRegister2(editor.registerCommand(KEY_DOWN_COMMAND2, (event) => {
    if (!event.altKey || event.key !== "F10") {
      return false;
    }
    const firstItem = toolbar.querySelector('[tabindex="0"]') ?? toolbar.querySelector(selector);
    if (firstItem === null) {
      return false;
    }
    event.preventDefault();
    firstItem.focus();
    return true;
  }, COMMAND_PRIORITY_LOW2), registerEventListener2(toolbar, "keydown", handler));
}
var AriaLiveRegionExtension = {
  build(_editor, config, state) {
    const message = state.getInitResult();
    return {
      ...namedSignals2(config),
      announce(text) {
        message.value = text === message.peek() ? text + "\u200B" : text;
      }
    };
  },
  config: {
    owner: null,
    politeness: "polite"
  },
  dependencies: [RootElementExtension2],
  // Private reactive message buffer shared by `build` (writer) and `register`
  // (renderer); see the extension doc comment.
  init: () => signal(""),
  name: "@lexical/a11y/AriaLiveRegion",
  register(_editor, _config, state) {
    const message = state.getInitResult();
    const {
      owner,
      politeness
    } = state.getOutput();
    const rootElement = state.getDependency(RootElementExtension2).output;
    const region = signal(null);
    return mergeRegister2(
      // Create / dispose the region as the root document (or `owner`) changes.
      // Subscribe to the root only when no explicit `owner` is configured, so a
      // fixed-owner region isn't torn down and rebuilt on unrelated root churn.
      effect(() => {
        const ownerEl = owner.value;
        const root = ownerEl ? null : rootElement.value;
        const host = ownerEl ?? (root ? root.ownerDocument.body : null);
        if (!host) {
          return void 0;
        }
        const el = createLiveRegion(host);
        region.value = el;
        return () => {
          el.remove();
          region.value = null;
        };
      }),
      // Apply the (runtime-tunable) politeness to whatever region is mounted.
      // This tracks `region` so it re-applies the attribute to a re-created
      // region (an attribute, not an announcement).
      effect(() => {
        const el = region.value;
        if (el) {
          el.setAttribute("aria-live", politeness.value);
        }
      }),
      // Mirror the current message into whatever region is mounted. Always read
      // `message.value` (to stay subscribed) but read the region with peek() so
      // this re-runs only when the message changes, not when the region is
      // (re)created: replaying the buffered message into a freshly mounted
      // region would make the screen reader re-announce it on every editor
      // remount with no user action.
      effect(() => {
        const text = message.value;
        const el = region.peek();
        if (el) {
          el.textContent = text;
        }
      })
    );
  }
};
var HistoryAnnounceExtension = {
  build: (_editor, config) => namedSignals2(config),
  config: {
    disabled: false,
    redone: "Redone",
    undone: "Undone"
  },
  dependencies: [AriaLiveRegionExtension],
  name: "@lexical/a11y/HistoryAnnounce",
  register(editor, _config, state) {
    const {
      disabled,
      redone,
      undone
    } = state.getOutput();
    const {
      announce
    } = state.getDependency(AriaLiveRegionExtension).output;
    return effect(() => disabled.value ? void 0 : mergeRegister2(editor.registerCommand(UNDO_COMMAND2, () => {
      announce(undone.peek());
      return false;
    }, COMMAND_PRIORITY_LOW2), editor.registerCommand(REDO_COMMAND2, () => {
      announce(redone.peek());
      return false;
    }, COMMAND_PRIORITY_LOW2)));
  }
};
var EditorModeAnnounceExtension = {
  build: (_editor, config) => namedSignals2(config),
  config: {
    disabled: false,
    editable: "Editor is editable",
    readOnly: "Editor is read-only"
  },
  dependencies: [AriaLiveRegionExtension],
  name: "@lexical/a11y/EditorModeAnnounce",
  register(editor, _config, state) {
    const {
      disabled,
      editable,
      readOnly
    } = state.getOutput();
    const {
      announce
    } = state.getDependency(AriaLiveRegionExtension).output;
    return effect(() => disabled.value ? void 0 : editor.registerEditableListener((isEditable) => {
      announce(isEditable ? editable.peek() : readOnly.peek());
    }));
  }
};
var FocusTrapExtension = {
  build: () => createRefCountedRegistry2(registerFocusTrap),
  name: "@lexical/a11y/FocusTrap",
  register: (_editor, _config, state) => () => state.getOutput().dispose()
};
var RovingTabIndexExtension = {
  build: () => createRefCountedRegistry2(registerRovingTabIndex),
  name: "@lexical/a11y/RovingTabIndex",
  register: (_editor, _config, state) => () => state.getOutput().dispose()
};
var FocusManagerExtension = {
  build: (editor) => createRefCountedRegistry2((toolbar, options) => registerFocusManager(editor, toolbar, options)),
  name: "@lexical/a11y/FocusManager",
  register: (_editor, _config, state) => () => state.getOutput().dispose()
};

// node_modules/@lexical/a11y/dist/LexicalA11y.mjs
var mod7 = true ? LexicalA11y_dev_exports : LexicalA11y_prod_exports;
var AriaLiveRegionExtension2 = mod7.AriaLiveRegionExtension;
var EditorModeAnnounceExtension2 = mod7.EditorModeAnnounceExtension;
var FocusManagerExtension2 = mod7.FocusManagerExtension;
var FocusTrapExtension2 = mod7.FocusTrapExtension;
var HistoryAnnounceExtension2 = mod7.HistoryAnnounceExtension;
var RovingTabIndexExtension2 = mod7.RovingTabIndexExtension;

// node_modules/@lexical/dragon/dist/LexicalDragon.dev.mjs
var LexicalDragon_dev_exports = {};
__export(LexicalDragon_dev_exports, {
  DragonExtension: () => DragonExtension,
  installDragonSupport: () => installDragonSupport,
  registerDragonSupport: () => registerDragonSupport
});
var TEXT_FORMAT_BY_EXEC_COMMAND = {
  bold: "bold",
  italic: "italic",
  strikeThrough: "strikethrough",
  subscript: "subscript",
  superscript: "superscript",
  underline: "underline"
};
var WINDOW_STATE_KEY = /* @__PURE__ */ Symbol.for("@lexical/dragon/WindowState");
function getOrCreateWindowState(targetWindow) {
  let state = targetWindow[WINDOW_STATE_KEY];
  if (state === void 0) {
    state = {
      dispose: () => {
      },
      editors: /* @__PURE__ */ new Map(),
      installs: /* @__PURE__ */ new Set()
    };
    targetWindow[WINDOW_STATE_KEY] = state;
  }
  return state;
}
function defaultWindow() {
  return typeof window !== "undefined" ? window : void 0;
}
function installDragonSupport(targetWindow = defaultWindow()) {
  return targetWindow ? addInstall(targetWindow, /* @__PURE__ */ Symbol("@lexical/dragon/globalInstall"), void 0) : () => {
  };
}
function addInstall(targetWindow, installKey, editor) {
  const state = getOrCreateWindowState(targetWindow);
  if (state.installs.size === 0) {
    const boundHandleMessage = handleMessage.bind(targetWindow);
    targetWindow.addEventListener("message", boundHandleMessage, true);
    state.dispose = () => {
      targetWindow.removeEventListener("message", boundHandleMessage, true);
    };
  }
  state.installs.add(installKey);
  if (editor) {
    const installSet = state.editors.get(editor) || /* @__PURE__ */ new Set();
    installSet.add(installKey);
    state.editors.set(editor, installSet);
  }
  return removeInstall.bind(null, targetWindow, state, installKey, editor);
}
function removeInstall(targetWindow, state, installKey, editor) {
  if (editor) {
    const installSet = state.editors.get(editor);
    if (installSet && installSet.delete(installKey) && installSet.size === 0) {
      state.editors.delete(editor);
    }
  }
  if (state.installs.delete(installKey) && state.installs.size === 0) {
    state.dispose();
    delete targetWindow[WINDOW_STATE_KEY];
  }
}
function getDefaultView2(el) {
  return el && el.ownerDocument.defaultView;
}
function registerDragonSupport(editor) {
  const windowSignal = watchedSignal2(() => getDefaultView2(editor.getRootElement()), (self) => editor.registerRootListener((rootElement) => {
    self.value = getDefaultView2(rootElement);
  }));
  return effect(() => {
    const targetWindow = windowSignal.value;
    if (targetWindow) {
      return addInstall(targetWindow, /* @__PURE__ */ Symbol("@lexical/dragon/editorInstall"), editor);
    }
  });
}
function getFocusedEditor(targetWindow) {
  const state = targetWindow[WINDOW_STATE_KEY];
  if (state === void 0) {
    return null;
  }
  const activeEditor2 = getEditorPropertyFromDOMNode2(getActiveElementDeep2(targetWindow.document));
  return isLexicalEditor2(activeEditor2) && state.editors.has(activeEditor2) ? activeEditor2 : null;
}
function handleMessage(event) {
  const targetWindow = this;
  if (event.origin !== targetWindow.location.origin) {
    return;
  }
  const editor = getFocusedEditor(targetWindow);
  if (editor === null) {
    return;
  }
  const data = event.data;
  if (typeof data === "string") {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (_e) {
      return;
    }
    if (parsedData && parsedData.protocol === "nuanria_messaging" && parsedData.type === "request") {
      const payload = parsedData.payload;
      if (payload && payload.functionId === "makeChanges") {
        const args = payload.args;
        if (Array.isArray(args)) {
          const [elementStart, elementLength, text, selStart, selLength, formatCommand] = args;
          if (![elementStart, elementLength, selStart, selLength].every(Number.isFinite) || typeof text !== "string" && text !== -1) {
            return;
          }
          editor.update(() => {
            const selection = $getSelection2();
            if ($isRangeSelection2(selection)) {
              const anchor = selection.anchor;
              let anchorNode = anchor.getNode();
              let setSelStart = 0;
              let setSelEnd = 0;
              if ($isTextNode2(anchorNode)) {
                if (elementStart >= 0 && elementLength >= 0) {
                  setSelStart = elementStart;
                  setSelEnd = elementStart + elementLength;
                  selection.setTextNodeRange(anchorNode, setSelStart, anchorNode, setSelEnd);
                }
              }
              if (typeof text === "string" && (setSelStart !== setSelEnd || text !== "")) {
                selection.insertRawText(text);
                anchorNode = anchor.getNode();
              }
              if ($isTextNode2(anchorNode)) {
                const anchorNodeTextLength = anchorNode.getTextContentSize();
                setSelStart = Math.min(Math.max(selStart, 0), anchorNodeTextLength);
                setSelEnd = selStart < 0 || selLength < 0 ? setSelStart : Math.min(selStart + selLength, anchorNodeTextLength);
                selection.setTextNodeRange(anchorNode, setSelStart, anchorNode, setSelEnd);
              }
              if (typeof formatCommand === "string" && selLength > 0 && !selection.isCollapsed()) {
                const format = TEXT_FORMAT_BY_EXEC_COMMAND[formatCommand];
                if (format !== void 0) {
                  selection.formatText(format);
                }
              }
              event.stopImmediatePropagation();
            }
          });
        }
      }
    }
  }
}
var DragonExtension = {
  build: (editor, config, state) => namedSignals2(config),
  config: {
    disabled: typeof window === "undefined"
  },
  name: "@lexical/dragon",
  register: (editor, config, state) => effect(() => state.getOutput().disabled.value ? void 0 : registerDragonSupport(editor))
};

// node_modules/@lexical/dragon/dist/LexicalDragon.mjs
var mod8 = true ? LexicalDragon_dev_exports : LexicalDragon_prod_exports;
var DragonExtension2 = mod8.DragonExtension;
var installDragonSupport2 = mod8.installDragonSupport;
var registerDragonSupport2 = mod8.registerDragonSupport;

// node_modules/@lexical/rich-text/dist/LexicalRichText.dev.mjs
function $readHeadingTag(key) {
  const node = $getNodeByKey2(key);
  return $isHeadingNode(node) ? node.getTag() : null;
}
var HeadingAnnounceExtension = {
  build: (_editor, config) => namedSignals2(config),
  config: {
    created: "Heading level %s",
    destroyed: "Heading level %s removed",
    disabled: false
  },
  dependencies: [AriaLiveRegionExtension2],
  name: "@lexical/rich-text/HeadingAnnounce",
  register(editor, _config, state) {
    const {
      created,
      destroyed,
      disabled
    } = state.getOutput();
    const {
      announce
    } = state.getDependency(AriaLiveRegionExtension2).output;
    return effect(() => disabled.value ? void 0 : editor.registerMutationListener(HeadingNode, (nodes, {
      prevEditorState
    }) => {
      let createdTag = null;
      let destroyedTag = null;
      for (const [key, mutation] of nodes) {
        if (mutation === "created" && createdTag === null) {
          createdTag = editor.read("latest", () => $readHeadingTag(key));
        } else if (mutation === "destroyed" && destroyedTag === null) {
          destroyedTag = prevEditorState.read(() => $readHeadingTag(key));
        }
      }
      if (createdTag !== null) {
        announce(created.peek().replace("%s", createdTag.slice(1)));
      } else if (destroyedTag !== null) {
        announce(destroyed.peek().replace("%s", destroyedTag.slice(1)));
      }
    }, {
      skipInitialization: true
    }));
  }
};
function isGoogleDocsTitleSpan(node) {
  return isHTMLElement2(node) && node.nodeName === "SPAN" && node.style.fontSize === "26pt";
}
var HeadingRule = {
  $import: (ctx, el) => {
    const tag = el.nodeName.toLowerCase();
    const node = $createHeadingNode(tag);
    setNodeIndentFromDOM2(el, node);
    $setFormatFromDOM2(node, el);
    $setDirectionFromDOM2(node, el);
    return [node.splice(0, 0, ctx.$importChildren(el))];
  },
  match: /* @__PURE__ */ sel2.tag("h1", "h2", "h3", "h4", "h5", "h6"),
  name: "@lexical/rich-text/heading"
};
var QuoteRule = {
  $import: (ctx, el) => {
    const node = $createQuoteNode();
    $setFormatFromDOM2(node, el);
    setNodeIndentFromDOM2(el, node);
    $setDirectionFromDOM2(node, el);
    return [node.splice(0, 0, ctx.$importChildren(el))];
  },
  match: /* @__PURE__ */ sel2.tag("blockquote"),
  name: "@lexical/rich-text/blockquote"
};
var ShadowRootQuoteRule = {
  $import: (ctx, el) => {
    const node = $createQuoteNode({
      shadowRoot: true
    });
    $setFormatFromDOM2(node, el);
    setNodeIndentFromDOM2(el, node);
    $setDirectionFromDOM2(node, el);
    return [node.splice(0, 0, ctx.$importChildren(el, {
      schema: BlockSchema2
    }))];
  },
  match: /* @__PURE__ */ sel2.tag("blockquote"),
  name: "@lexical/rich-text/blockquote-shadow-root"
};
var GoogleDocsTitleParagraphRule = {
  $import: (ctx, el, $next) => {
    const first = el.firstChild;
    if (first && isGoogleDocsTitleSpan(first)) {
      return ctx.$importChildren(el);
    }
    return $next();
  },
  match: /* @__PURE__ */ sel2.tag("p"),
  name: "@lexical/rich-text/google-docs-title-p"
};
var GoogleDocsTitleSpanRule = {
  $import: (ctx, el, $next) => el.style.fontSize !== "26pt" ? $next() : [$createHeadingNode("h1").splice(0, 0, ctx.$importChildren(el))],
  match: /* @__PURE__ */ sel2.tag("span"),
  name: "@lexical/rich-text/google-docs-title-span"
};
var RichTextImportRules = [HeadingRule, QuoteRule, GoogleDocsTitleParagraphRule, GoogleDocsTitleSpanRule];
var DEFAULT_RICH_TEXT_CONFIG = {
  escapeFormatTriggers: {
    capitalize: {
      enter: true,
      space: true,
      tab: true
    },
    lowercase: {
      enter: true,
      space: true,
      tab: true
    },
    uppercase: {
      enter: true,
      space: true,
      tab: true
    }
  },
  shouldHandlePasteAsFiles: defaultShouldHandlePasteAsFiles
};
function mergeTriggerConfig(config, override) {
  if (!config || override === null) {
    return override;
  }
  return shallowMergeConfig2(config, override);
}
function mergeEscapeFormatTriggers(config, overrides) {
  const merged = shallowMergeConfig2(config, overrides);
  for (const k of Object.keys(overrides)) {
    merged[k] = mergeTriggerConfig(config[k], overrides[k]);
  }
  return merged;
}
function mergeRichTextConfig(config, overrides) {
  const merged = shallowMergeConfig2(config, overrides);
  if (overrides.escapeFormatTriggers) {
    merged.escapeFormatTriggers = mergeEscapeFormatTriggers(config.escapeFormatTriggers, overrides.escapeFormatTriggers);
  }
  return merged;
}
var RichTextExtension = {
  build: (_editor, config) => namedSignals2(config),
  config: DEFAULT_RICH_TEXT_CONFIG,
  conflictsWith: ["@lexical/plain-text"],
  dependencies: [
    HeadingAnnounceExtension,
    DragonExtension2,
    NormalizeInlineElementsExtension2,
    NormalizeTripleClickSelectionExtension2,
    // DOMImportExtension support for the nodes registered here. Inert
    // unless the editor routes HTML through the pipeline (e.g. via
    // ClipboardDOMImportExtension or $generateNodesFromDOMViaExtension).
    CoreImportExtension2,
    [DOMImportExtension2, {
      rules: RichTextImportRules
    }]
  ],
  mergeConfig: mergeRichTextConfig,
  name: "@lexical/rich-text",
  nodes: () => [HeadingNode, QuoteNode],
  register: (editor, _config, state) => effect(() => {
    const {
      escapeFormatTriggers,
      shouldHandlePasteAsFiles
    } = state.getOutput();
    return registerRichText(editor, escapeFormatTriggers, shouldHandlePasteAsFiles);
  })
};
var RichTextImportExtension = {
  dependencies: [RichTextExtension],
  name: "@lexical/rich-text/Import"
};
var DRAG_DROP_PASTE = /* @__PURE__ */ createCommand2("DRAG_DROP_PASTE_FILE");
var quoteShadowRootState = /* @__PURE__ */ createState2("shadowRoot", {
  parse: Boolean
});
var QuoteNode = class extends ElementNode2 {
  $config() {
    return this.config("quote", {
      extends: ElementNode2,
      importDOM: {
        blockquote: () => ({
          conversion: $convertBlockquoteElement,
          priority: 0
        })
      },
      stateConfigs: [{
        flat: true,
        stateConfig: quoteShadowRootState
      }]
    });
  }
  /**
   * `true` when this quote has opted in to shadow root behavior with
   * {@link setIsShadowRoot} or `$createQuoteNode({shadowRoot: true})`,
   * in which case it contains block-level children rather than inline
   * content. `false` (the legacy inline-content behavior) by default.
   */
  isShadowRoot() {
    return $getState2(this, quoteShadowRootState);
  }
  /**
   * Opt this quote in to (or out of) shadow root behavior. See
   * {@link quoteShadowRootState}. Note that this does not restructure any
   * existing children; a shadow root quote is expected to contain
   * block-level children (non-element children will be normalized into
   * paragraphs by the built-in shadow root transform).
   */
  setIsShadowRoot(isShadowRoot) {
    return $setState2(this, quoteShadowRootState, isShadowRoot);
  }
  // View
  createDOM(config) {
    const element = $getDocument2().createElement("blockquote");
    addClassNamesToElement2(element, config.theme.quote);
    return element;
  }
  updateDOM(prevNode, dom, config) {
    return false;
  }
  exportDOM(editor) {
    const {
      element
    } = super.exportDOM(editor);
    if (isHTMLElement2(element)) {
      if (this.isEmpty()) {
        element.append($getDocument2().createElement("br"));
      }
      const formatType = this.getFormatType();
      if (formatType) {
        element.style.textAlign = formatType;
      }
      const direction = this.getDirection();
      if (direction) {
        element.dir = direction;
      }
    }
    return {
      element
    };
  }
  exportJSON() {
    return super.exportJSON();
  }
  static importJSON(serializedNode) {
    return $createQuoteNode().updateFromJSON(serializedNode);
  }
  // Mutation
  insertNewAfter(rangeSelection, restoreSelection) {
    const newBlock = $createParagraphNode2();
    newBlock.setTextFormat(rangeSelection.format);
    newBlock.setTextStyle(rangeSelection.style);
    const direction = this.getDirection();
    newBlock.setDirection(direction);
    newBlock.setFormat(this.getFormatType());
    newBlock.setStyle(this.getStyle());
    this.insertAfter(newBlock, restoreSelection);
    return newBlock;
  }
  collapseAtStart() {
    if (this.isShadowRoot()) {
      for (const child of this.getChildren()) {
        this.insertBefore(child);
      }
      this.remove();
      return true;
    }
    const paragraph = $createParagraphNode2();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }
  canMergeWhenEmpty() {
    return true;
  }
};
function $createQuoteNode(options) {
  const node = $applyNodeReplacement2(new QuoteNode());
  return options && options.shadowRoot ? node.setIsShadowRoot(true) : node;
}
function $isQuoteNode(node) {
  return node instanceof QuoteNode;
}
var HeadingNode = class extends ElementNode2 {
  /** @internal */
  __tag;
  $config() {
    return this.config("heading", {
      extends: ElementNode2,
      importDOM: {
        h1: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        h2: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        h3: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        h4: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        h5: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        h6: () => ({
          conversion: $convertHeadingElement,
          priority: 0
        }),
        p: (node) => {
          const paragraph = node;
          const firstChild = paragraph.firstChild;
          if (firstChild !== null && isGoogleDocsTitle(firstChild)) {
            return {
              conversion: () => ({
                node: null
              }),
              priority: 3
            };
          }
          return null;
        },
        span: (node) => {
          if (isGoogleDocsTitle(node)) {
            return {
              conversion: () => {
                return {
                  node: $createHeadingNode("h1")
                };
              },
              priority: 3
            };
          }
          return null;
        }
      }
    });
  }
  afterCloneFrom(prevNode) {
    super.afterCloneFrom(prevNode);
    this.__tag = prevNode.__tag;
  }
  constructor(tag = "h1", key) {
    super(key);
    this.__tag = tag;
  }
  getTag() {
    return this.getLatest().__tag;
  }
  setTag(tag) {
    const self = this.getWritable();
    self.__tag = tag;
    return self;
  }
  // View
  createDOM(config) {
    const tag = this.__tag;
    const element = $getDocument2().createElement(tag);
    const theme = config.theme;
    const classNames = theme.heading;
    if (classNames !== void 0) {
      const className = classNames[tag];
      addClassNamesToElement2(element, className);
    }
    return element;
  }
  updateDOM(prevNode, dom, config) {
    return prevNode.__tag !== this.__tag;
  }
  exportDOM(editor) {
    const {
      element
    } = super.exportDOM(editor);
    if (isHTMLElement2(element)) {
      if (this.isEmpty()) {
        element.append($getDocument2().createElement("br"));
      }
      const formatType = this.getFormatType();
      if (formatType) {
        element.style.textAlign = formatType;
      }
      const direction = this.getDirection();
      if (direction) {
        element.dir = direction;
      }
    }
    return {
      element
    };
  }
  updateFromJSON(serializedNode) {
    return super.updateFromJSON(serializedNode).setTag(serializedNode.tag);
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      tag: this.getTag()
    };
  }
  // Mutation
  insertNewAfter(selection, restoreSelection = true) {
    const anchorOffet = selection ? selection.anchor.offset : 0;
    const lastDesc = this.getLastDescendant();
    const isAtEnd = !lastDesc || selection && selection.anchor.key === lastDesc.getKey() && anchorOffet === lastDesc.getTextContentSize();
    const newElement = isAtEnd || !selection ? $createParagraphNode2() : (
      // The heading is split in two, so the second half keeps the
      // block format and style of the first, like ParagraphNode does.
      $createHeadingNode(this.getTag()).setFormat(this.getFormatType()).setStyle(this.getStyle())
    );
    const direction = this.getDirection();
    newElement.setDirection(direction);
    this.insertAfter(newElement, restoreSelection);
    if (anchorOffet === 0 && !this.isEmpty() && selection) {
      const paragraph = $createParagraphNode2();
      paragraph.select();
      this.replace(paragraph, true);
    }
    return newElement;
  }
  collapseAtStart() {
    if (this.isEmpty()) {
      const paragraph = $createParagraphNode2();
      const children = this.getChildren();
      children.forEach((child) => paragraph.append(child));
      this.replace(paragraph);
    }
    return true;
  }
  extractWithChild() {
    return true;
  }
};
function isGoogleDocsTitle(domNode) {
  if (domNode.nodeName.toLowerCase() === "span") {
    return domNode.style.fontSize === "26pt";
  }
  return false;
}
function $convertHeadingElement(element) {
  const nodeName = element.nodeName.toLowerCase();
  let node = null;
  if (nodeName === "h1" || nodeName === "h2" || nodeName === "h3" || nodeName === "h4" || nodeName === "h5" || nodeName === "h6") {
    node = $createHeadingNode(nodeName);
    setNodeIndentFromDOM2(element, node);
    $setFormatFromDOM2(node, element);
    $setDirectionFromDOM2(node, element);
  }
  return {
    node
  };
}
function $convertBlockquoteElement(element) {
  const node = $createQuoteNode();
  $setFormatFromDOM2(node, element);
  setNodeIndentFromDOM2(element, node);
  $setDirectionFromDOM2(node, element);
  return {
    node
  };
}
function $createHeadingNode(headingTag = "h1") {
  return $applyNodeReplacement2(new HeadingNode(headingTag));
}
function $isHeadingNode(node) {
  return node instanceof HeadingNode;
}
function onPasteForRichText(event, editor) {
  event.preventDefault();
  editor.update(() => {
    const selection = $getSelection2();
    const clipboardData = objectKlassEquals2(event, InputEvent) || objectKlassEquals2(event, KeyboardEvent) ? null : event.clipboardData;
    if (clipboardData != null && selection !== null) {
      $insertDataTransferForRichText2(clipboardData, selection, editor);
    }
  }, {
    // PASTE_TAG gives the paste its own undo entry: @lexical/history treats
    // the tag as a history boundary so undoing a paste does not also undo any
    // typing that preceded it (see #8609).
    tag: PASTE_TAG2
  });
}
async function onCutForRichText(event, editor) {
  editor.update(() => {
    const selection = $getSelection2();
    if ($isRangeSelection2(selection) && !selection.isCollapsed()) {
      INTERNAL_$expandSelectionToWholeDocument2(selection);
    }
  }, {
    discrete: true,
    tag: CUT_TAG2
  });
  await copyToClipboard2(editor, objectKlassEquals2(event, ClipboardEvent) ? event : null);
  editor.update(() => {
    const selection = $getSelection2();
    if ($isRangeSelection2(selection)) {
      selection.removeText();
    } else if ($isNodeSelection2(selection)) {
      selection.getNodes().forEach((node) => node.remove());
    }
  }, {
    // CUT_TAG gives the cut its own undo entry: @lexical/history treats the
    // tag as a history boundary so undoing a cut does not also undo any typing
    // that preceded it (see #8609).
    tag: CUT_TAG2
  });
}
function $isTargetWithinDecorator(target) {
  const node = $getNearestNodeFromDOMNode2(target);
  return $isDecoratorNode2(node);
}
function $isSelectionAtEndOfRoot(selection) {
  const focus = selection.focus;
  return focus.key === "root" && focus.offset === $getRoot2().getChildrenSize();
}
function $isSelectionAtStartOfRoot(selection) {
  const focus = selection.focus;
  return focus.key === "root" && focus.offset === 0;
}
function $isBlockCursorAtRootEdge(selection, direction) {
  if (!selection.isCollapsed()) {
    return false;
  }
  const isNext = direction === "next";
  if (!(isNext ? $isSelectionAtEndOfRoot(selection) : $isSelectionAtStartOfRoot(selection))) {
    return false;
  }
  const offset = selection.focus.offset;
  return $needsBlockCursorBeside2($getRoot2().getChildAtIndex(isNext ? offset - 1 : offset));
}
function $isSelectionCollapsedAtFrontOfIndentedBlock(selection) {
  if (!selection.isCollapsed()) {
    return false;
  }
  const {
    anchor
  } = selection;
  if (anchor.offset !== 0) {
    return false;
  }
  const anchorNode = anchor.getNode();
  if ($isRootNode2(anchorNode)) {
    return false;
  }
  const element = $getNearestBlockElementAncestorOrThrow2(anchorNode);
  return element.getIndent() > 0 && (element.is(anchorNode) || anchorNode.is(element.getFirstDescendant()));
}
function $escapeFormatsForTrigger(selection, trigger, direction, config) {
  let isBoundary = false;
  let anchorNode = null;
  if (selection.isCollapsed() && selection.anchor.type === "text") {
    const node = selection.anchor.getNode();
    if ($isTextNode2(node)) {
      anchorNode = node;
      const offset = selection.anchor.offset;
      const atEnd = offset === node.getTextContentSize() && node.getNextSibling() === null;
      const atStart = offset === 0 && node.getPreviousSibling() === null;
      isBoundary = direction === "end" && atEnd || direction === "start" && atStart || direction === "both" && (atEnd || atStart);
    }
  }
  let didEscapeBoundary = false;
  for (const [formatKey, triggers] of Object.entries(config)) {
    if (triggers == null || !triggers[trigger]) {
      continue;
    }
    const format = formatKey;
    if (triggers.onlyAtBoundary) {
      if (!isBoundary || !anchorNode || !$isTextNode2(anchorNode) || !anchorNode.hasFormat(format)) {
        continue;
      }
      didEscapeBoundary = true;
    }
    if (selection.hasFormat(format)) {
      selection.toggleFormat(format);
    }
  }
  if (didEscapeBoundary) {
    selection.setStyle("");
  }
}
var DEFAULT_ESCAPE_FORMAT_TRIGGERS = {
  capitalize: {
    enter: true,
    space: true,
    tab: true
  },
  lowercase: {
    enter: true,
    space: true,
    tab: true
  },
  uppercase: {
    enter: true,
    space: true,
    tab: true
  }
};
function $tryEnterFromBlockCursor(selection, direction) {
  if (!selection.isCollapsed() || selection.anchor.type !== "element") {
    return false;
  }
  const caret = $caretFromPoint2(selection.anchor, direction);
  const child = caret.getNodeAtCaret();
  if ($isShadowRootNode2(child) && !child.isInline()) {
    $setSelectionFromCaretRange2($getCollapsedCaretRange2($normalizeCaret2($getChildCaret2(child, direction))));
    return true;
  }
  return false;
}
function $tryBlockCursorShadowRootNavigation(selection, direction) {
  return $tryExitShadowRootToBlockCursor(selection, direction) || $tryEnterFromBlockCursor(selection, direction);
}
function $tryExitShadowRootToBlockCursor(selection, direction) {
  if (!selection.isCollapsed()) {
    return false;
  }
  const focusCaret = $caretFromPoint2(selection.focus, direction);
  const shadowRoot = $findMatchingParent2(focusCaret.origin, $isShadowRootNode2);
  if (!shadowRoot) {
    return false;
  }
  const focusNode = selection.focus.getNode();
  if (!shadowRoot.is(focusNode) && !$hasAncestor2(focusNode, shadowRoot)) {
    return false;
  }
  const textRange = $getCaretRange2(focusCaret, $getSiblingCaret2(shadowRoot, direction));
  if (textRange.getTextSlices().some((slice) => slice && slice.getTextContentSize() > 0)) {
    return false;
  }
  const range = $getCaretRange2(textRange.anchor.getSiblingCaret(), textRange.focus);
  let prevOrigin = range.anchor.origin;
  for (const caret of range) {
    if (!($isSiblingCaret2(caret) && caret.origin.is(prevOrigin.getParent()))) {
      return false;
    }
    prevOrigin = caret.origin;
  }
  let prevShadow = shadowRoot;
  for (const caret of $extendCaretToRange2($getSiblingCaret2(shadowRoot, direction))) {
    if (caret.origin.is(prevShadow.getParent())) {
      if (!$isShadowRootNode2(caret.origin)) {
        break;
      }
      prevShadow = caret.origin;
      continue;
    }
    if ($needsBlockCursorBeside2(caret.origin)) {
      const sr = $getSiblingCaret2(prevShadow, direction);
      $setSelectionFromCaretRange2($getCaretRange2(sr, sr));
      return true;
    }
    break;
  }
  return false;
}
function $isSelectableBlockDecorator(node) {
  return $isDecoratorNode2(node) && !node.isInline() && !node.isIsolated() && node.isKeyboardSelectable();
}
function $selectNode(key) {
  const nodeSelection = $createNodeSelection2();
  nodeSelection.add(key);
  $setSelection2(nodeSelection);
}
function $tryDecoratorLineNavigation(selection, isBackward) {
  if (!selection.isCollapsed()) {
    return false;
  }
  const focus = selection.focus;
  const focusNode = focus.getNode();
  const direction = isBackward ? "previous" : "next";
  const focusCaret = $caretFromPoint2(focus, direction);
  if (focus.type === "element" && $isElementNode2(focusNode) && $isRootOrShadowRoot2(focusNode)) {
    const adjacentChild = focusCaret.getNodeAtCaret();
    if (adjacentChild !== null && $isSelectableBlockDecorator(adjacentChild)) {
      $selectNode(adjacentChild.__key);
      return true;
    }
    return false;
  }
  const topBlock = $findMatchingParent2($isElementNode2(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n2) => $isElementNode2(n2) && !n2.isInline() && $isRootOrShadowRoot2(n2.getParent()));
  if (topBlock === null) {
    return false;
  }
  const adjacentSibling = $getSiblingCaret2(topBlock, direction).getNodeAtCaret();
  if (adjacentSibling === null || !$isSelectableBlockDecorator(adjacentSibling)) {
    return false;
  }
  if (topBlock.getTextContentSize() === 0) {
    $selectNode(adjacentSibling.__key);
    return true;
  }
  const rootElement = $getEditor2().getRootElement();
  if (rootElement === null) {
    return false;
  }
  const domSelection = getDOMSelection2(rootElement.ownerDocument.defaultView);
  if (domSelection === null || domSelection.rangeCount === 0) {
    return false;
  }
  const savedAnchorNode = domSelection.anchorNode;
  const savedAnchorOffset = domSelection.anchorOffset;
  const savedFocusNode = domSelection.focusNode;
  const savedFocusOffset = domSelection.focusOffset;
  domSelection.modify("move", isBackward ? "backward" : "forward", "line");
  const newAnchorNode = domSelection.anchorNode;
  const newAnchorOffset = domSelection.anchorOffset;
  if (newAnchorNode === null) {
    restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
    return false;
  }
  const movedNode = $getNearestNodeFromDOMNode2(newAnchorNode);
  restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
  if (movedNode === null) {
    return false;
  }
  const didNotMove = newAnchorNode === savedAnchorNode && newAnchorOffset === savedAnchorOffset;
  if (didNotMove) {
    $selectNode(adjacentSibling.__key);
    return true;
  }
  const stillInSameBlock = movedNode.is(topBlock) || $hasAncestor2(movedNode, topBlock);
  if (stillInSameBlock) {
    return false;
  }
  $selectNode(adjacentSibling.__key);
  return true;
}
function restoreDOMSelection(domSelection, anchorNode, anchorOffset, focusNode, focusOffset) {
  if (anchorNode !== null && focusNode !== null) {
    domSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  }
}
function $tryInlineGridLineNavigation(selection, isBackward) {
  if (!selection.isCollapsed()) {
    return false;
  }
  const focusNode = selection.focus.getNode();
  const parentBlock = $findMatchingParent2($isElementNode2(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n2) => $isElementNode2(n2) && !n2.isInline());
  if (parentBlock === null) {
    return false;
  }
  const editor = $getEditor2();
  const rootElement = editor.getRootElement();
  if (rootElement === null) {
    return false;
  }
  const win = rootElement.ownerDocument.defaultView;
  if (win === null) {
    return false;
  }
  let hasGrid = false;
  for (const child of parentBlock.getChildren()) {
    if ($isElementNode2(child) && child.isInline()) {
      const dom = editor.getElementByKey(child.getKey());
      if (dom !== null) {
        const d2 = win.getComputedStyle(dom).display;
        if (d2 === "inline-grid" || d2 === "inline-flex") {
          hasGrid = true;
          break;
        }
      }
    }
  }
  if (!hasGrid) {
    return false;
  }
  const direction = isBackward ? "previous" : "next";
  const siblingBlock = $getSiblingCaret2(parentBlock, direction).getNodeAtCaret();
  if (siblingBlock === null || !$isElementNode2(siblingBlock)) {
    if (isBackward) {
      const first = parentBlock.getFirstDescendant();
      if ($isTextNode2(first)) {
        first.select(0, 0);
      } else {
        parentBlock.select(0, 0);
      }
    } else {
      const last = parentBlock.getLastDescendant();
      if ($isTextNode2(last)) {
        const len = last.getTextContentSize();
        last.select(len, len);
      } else {
        const count = parentBlock.getChildrenSize();
        parentBlock.select(count, count);
      }
    }
    return true;
  }
  const siblingDOM = editor.getElementByKey(siblingBlock.getKey());
  if (siblingDOM === null) {
    return false;
  }
  const domSelection = getDOMSelection2(win);
  if (domSelection === null || domSelection.rangeCount === 0) {
    return false;
  }
  const curRange = domSelection.getRangeAt(0).cloneRange();
  curRange.collapse(true);
  const curRect = curRange.getBoundingClientRect();
  const sibRect = siblingDOM.getBoundingClientRect();
  const targetY = sibRect.top + sibRect.height / 2;
  if (curRect.height > 0) {
    const hit = caretFromPoint2(curRect.left, targetY, rootElement);
    if (hit !== null && siblingDOM.contains(hit.node)) {
      const hitRange = rootElement.ownerDocument.createRange();
      hitRange.setStart(hit.node, hit.offset);
      hitRange.collapse(true);
      selection.applyDOMRange(hitRange);
      selection.dirty = true;
      return true;
    }
  }
  const targetDesc = isBackward ? siblingBlock.getLastDescendant() : siblingBlock.getFirstDescendant();
  if ($isTextNode2(targetDesc)) {
    const offset = isBackward ? targetDesc.getTextContentSize() : 0;
    targetDesc.select(offset, offset);
  } else {
    const childCount = siblingBlock.getChildrenSize();
    siblingBlock.select(isBackward ? childCount : 0, isBackward ? childCount : 0);
  }
  return true;
}
function $exitNodeSelectionToward(node, direction) {
  const caret = $getSiblingCaret2(node, direction);
  const sibling = caret.getAdjacentCaret();
  if (sibling !== null && $isElementNode2(sibling.origin) && !sibling.origin.isInline() && sibling.origin.isShadowRoot()) {
    $setSelectionFromCaretRange2($getCollapsedCaretRange2(caret));
  } else if (direction === "next") {
    node.selectNext(0, 0);
  } else {
    node.selectPrevious();
  }
}
function $convertContiguousNodeSelection(selection, direction) {
  const carets = selection.getNodes().map((node) => $getSiblingCaret2(node, "next")).sort($comparePointCaretNext2);
  const firstCaret = carets[0];
  const lastCaret = carets[carets.length - 1];
  if (!firstCaret || !lastCaret) {
    return false;
  }
  for (let i2 = 0; i2 < carets.length - 1; i2++) {
    if (!carets[i2 + 1].origin.is(carets[i2].getNodeAtCaret())) {
      return false;
    }
  }
  $setSelectionFromCaretRange2($getCaretRangeInDirection2($getCaretRange2($rewindSiblingCaret2(firstCaret), lastCaret), direction));
  $flushSyncAfterUpdate2();
  return true;
}
function $promoteNodeSelectionToBlockEdge(selection, isBackward, event) {
  event.preventDefault();
  event.stopPropagation();
  const nodes = selection.getNodes();
  if (nodes.length === 0) {
    return true;
  }
  const sorted = nodes.map((node) => $getSiblingCaret2(node, "next")).sort($comparePointCaretNext2);
  const targetNode = (isBackward ? sorted[0] : sorted[sorted.length - 1]).origin;
  const block = $findMatchingParent2(targetNode, (n2) => n2 !== targetNode && $isElementNode2(n2) && !n2.isInline()) ?? $getRoot2();
  const offset = isBackward ? 0 : block.getChildrenSize();
  block.select(offset, offset);
  return true;
}
function defaultShouldHandlePasteAsFiles(files, hasTextContent) {
  return files.length > 0 && !hasTextContent;
}
function registerRichText(editor, escapeFormatTriggers = signal(DEFAULT_ESCAPE_FORMAT_TRIGGERS), shouldHandlePasteAsFiles = signal(defaultShouldHandlePasteAsFiles)) {
  const removeListener = mergeRegister2(editor.registerCommand(CLICK_COMMAND2, (event) => {
    const selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const eventTarget = event.target;
      if (isHTMLElement2(eventTarget)) {
        for (const node of selection.getNodes()) {
          const dom = editor.getElementByKey(node.getKey());
          if (dom !== null && dom.contains(eventTarget)) {
            return false;
          }
        }
      }
      selection.clear();
      return true;
    }
    if ($isRangeSelection2(selection)) {
      $escapeFormatsForTrigger(selection, "click", "both", escapeFormatTriggers.peek());
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DELETE_CHARACTER_COMMAND2, (isBackward) => {
    const selection = $getSelection2();
    if ($isRangeSelection2(selection)) {
      selection.deleteCharacter(isBackward);
      return true;
    } else if ($isNodeSelection2(selection)) {
      selection.deleteNodes();
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DELETE_WORD_COMMAND2, (isBackward) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    selection.deleteWord(isBackward);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DELETE_LINE_COMMAND2, (isBackward) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    selection.deleteLine(isBackward);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(CONTROLLED_TEXT_INSERTION_COMMAND2, (eventOrText) => {
    const selection = $getSelection2();
    if (typeof eventOrText === "string") {
      if (selection !== null) {
        selection.insertText(eventOrText);
      }
    } else {
      if (selection === null) {
        return false;
      }
      const dataTransfer = eventOrText.dataTransfer;
      if (dataTransfer != null) {
        $insertDataTransferForRichText2(dataTransfer, selection, editor);
      } else if ($isRangeSelection2(selection)) {
        const data = eventOrText.data;
        if (data) {
          selection.insertText(data);
        }
        return true;
      }
    }
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(REMOVE_TEXT_COMMAND2, () => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    selection.removeText();
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(FORMAT_TEXT_COMMAND2, (format) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection) && !$isNodeSelection2(selection)) {
      return false;
    }
    $formatText2(selection, format);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(SET_TEXT_FORMAT_COMMAND2, (formats) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection) && !$isNodeSelection2(selection)) {
      return false;
    }
    $setTextFormat2(selection, formats);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(FORMAT_ELEMENT_COMMAND2, (format) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection) && !$isNodeSelection2(selection)) {
      return false;
    }
    const nodes = selection.getNodes();
    for (const node of nodes) {
      const element = $findMatchingParent2(node, (parentNode) => $isElementNode2(parentNode) && !parentNode.isInline());
      if (element !== null) {
        element.setFormat(format);
      }
    }
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(INSERT_LINE_BREAK_COMMAND2, (selectStart) => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    selection.insertLineBreak(selectStart);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(INSERT_PARAGRAPH_COMMAND2, () => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    selection.insertParagraph();
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(INSERT_TAB_COMMAND2, () => {
    const tabNode = $createTabNode2();
    const selection = $getSelection2();
    if ($isRangeSelection2(selection)) {
      tabNode.setFormat(selection.format);
      tabNode.setStyle(selection.style);
    }
    $insertNodes2([tabNode]);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(INDENT_CONTENT_COMMAND2, () => {
    return $handleIndentAndOutdent2((block) => {
      const indent = block.getIndent();
      block.setIndent(indent + 1);
    });
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(OUTDENT_CONTENT_COMMAND2, () => {
    return $handleIndentAndOutdent2((block) => {
      const indent = block.getIndent();
      if (indent > 0) {
        block.setIndent(Math.max(0, indent - 1));
      }
    });
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ARROW_UP_COMMAND2, (event) => {
    let selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        if (event.shiftKey && $convertContiguousNodeSelection(selection, "previous")) {
          selection = $getSelection2();
        } else {
          event.preventDefault();
          $exitNodeSelectionToward(nodes[0], "previous");
          return true;
        }
      }
    }
    if ($isRangeSelection2(selection)) {
      if ($isSelectionAtStartOfRoot(selection)) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, "previous")) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryDecoratorLineNavigation(selection, true)) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryInlineGridLineNavigation(selection, true)) {
        event.preventDefault();
        return true;
      }
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ARROW_DOWN_COMMAND2, (event) => {
    let selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        if (event.shiftKey && $convertContiguousNodeSelection(selection, "next")) {
          selection = $getSelection2();
        } else {
          event.preventDefault();
          $exitNodeSelectionToward(nodes[0], "next");
          return true;
        }
      }
    }
    if ($isRangeSelection2(selection)) {
      if ($isSelectionAtEndOfRoot(selection)) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, "next")) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryDecoratorLineNavigation(selection, false)) {
        event.preventDefault();
        return true;
      }
      if (!event.shiftKey && $tryInlineGridLineNavigation(selection, false)) {
        event.preventDefault();
        return true;
      }
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ARROW_LEFT_COMMAND2, (event) => {
    let selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        const direction = $isParentRTL2(nodes[0]) ? "next" : "previous";
        if (event.shiftKey && $convertContiguousNodeSelection(selection, direction)) {
          selection = $getSelection2();
        } else {
          event.preventDefault();
          $exitNodeSelectionToward(nodes[0], direction);
          return true;
        }
      }
    }
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    const leftDirection = $isParentRTL2(selection.anchor.getNode()) ? "next" : "previous";
    if ($isBlockCursorAtRootEdge(selection, leftDirection)) {
      event.preventDefault();
      return true;
    }
    if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, leftDirection)) {
      event.preventDefault();
      return true;
    }
    if (!event.shiftKey) {
      $escapeFormatsForTrigger(selection, "arrow", "start", escapeFormatTriggers.peek());
    }
    if ($shouldOverrideDefaultCharacterSelection2(selection, true)) {
      const isHoldingShift = event.shiftKey;
      event.preventDefault();
      $moveCharacter2(selection, isHoldingShift, true);
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ARROW_RIGHT_COMMAND2, (event) => {
    let selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        const direction = $isParentRTL2(nodes[0]) ? "previous" : "next";
        if (event.shiftKey && $convertContiguousNodeSelection(selection, direction)) {
          selection = $getSelection2();
        } else {
          event.preventDefault();
          $exitNodeSelectionToward(nodes[0], direction);
          return true;
        }
      }
    }
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    const rightDirection = $isParentRTL2(selection.anchor.getNode()) ? "previous" : "next";
    if ($isBlockCursorAtRootEdge(selection, rightDirection)) {
      event.preventDefault();
      return true;
    }
    if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, rightDirection)) {
      event.preventDefault();
      return true;
    }
    if (!event.shiftKey) {
      $escapeFormatsForTrigger(selection, "arrow", "end", escapeFormatTriggers.peek());
    }
    if ($shouldOverrideDefaultCharacterSelection2(selection, false)) {
      const isHoldingShift = event.shiftKey;
      event.preventDefault();
      $moveCharacter2(selection, isHoldingShift, false);
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_BACKSPACE_COMMAND2, (event) => {
    const selection = $getSelection2();
    if (!$isNodeSelection2(selection)) {
      if ($isTargetWithinDecorator(event.target)) {
        return false;
      }
    }
    if ($isRangeSelection2(selection)) {
      if ($isSelectionCollapsedAtFrontOfIndentedBlock(selection)) {
        event.preventDefault();
        return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND2);
      }
      if (IS_IOS2 && CAN_USE_BEFORE_INPUT2) {
        return false;
      }
    } else if (!$isNodeSelection2(selection)) {
      return false;
    }
    event.preventDefault();
    return editor.dispatchCommand(DELETE_CHARACTER_COMMAND2, true);
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_DELETE_COMMAND2, (event) => {
    const selection = $getSelection2();
    if (!$isNodeSelection2(selection)) {
      if ($isTargetWithinDecorator(event.target)) {
        return false;
      }
    }
    if (!($isRangeSelection2(selection) || $isNodeSelection2(selection))) {
      return false;
    }
    event.preventDefault();
    return editor.dispatchCommand(DELETE_CHARACTER_COMMAND2, false);
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ENTER_COMMAND2, (event) => {
    let selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length === 1 && $isDecoratorNode2(nodes[0]) && !nodes[0].isInline()) {
        selection = nodes[0].selectNext();
      }
    }
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    $escapeFormatsForTrigger(selection, "enter", "both", escapeFormatTriggers.peek());
    if (event !== null) {
      if ((IS_IOS2 || IS_SAFARI2 || IS_APPLE_WEBKIT2) && CAN_USE_BEFORE_INPUT2) {
        return false;
      }
      event.preventDefault();
      if (event.shiftKey) {
        return editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND2, false);
      }
    }
    return editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND2);
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_ESCAPE_COMMAND2, () => {
    const selection = $getSelection2();
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    editor.blur();
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DROP_COMMAND2, (event) => {
    const [, files] = eventFiles2(event);
    if (files.length > 0) {
      const x2 = event.clientX;
      const y2 = event.clientY;
      const eventRange = caretFromPoint2(x2, y2, editor.getRootElement());
      if (eventRange !== null) {
        const {
          offset: domOffset,
          node: domNode
        } = eventRange;
        const node = $getNearestNodeFromDOMNode2(domNode);
        if (node !== null) {
          const selection = $createRangeSelection2();
          if ($isTextNode2(node)) {
            selection.anchor.set(node.getKey(), domOffset, "text");
            selection.focus.set(node.getKey(), domOffset, "text");
          } else {
            const parentKey = node.getParentOrThrow().getKey();
            const offset = node.getIndexWithinParent() + 1;
            selection.anchor.set(parentKey, offset, "element");
            selection.focus.set(parentKey, offset, "element");
          }
          const normalizedSelection = $normalizeSelection__EXPERIMENTAL(selection);
          $setSelection2(normalizedSelection);
        }
      }
      editor.dispatchCommand(DRAG_DROP_PASTE, files);
      event.preventDefault();
      return true;
    }
    return $handleRichTextDrop2(event, editor);
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DRAGSTART_COMMAND2, (event) => {
    const [isFileTransfer] = eventFiles2(event);
    const selection = $getSelection2();
    if (isFileTransfer && !$isRangeSelection2(selection)) {
      return false;
    }
    if ($isRangeSelection2(selection) && !selection.isCollapsed() && event.dataTransfer !== null) {
      setLexicalClipboardDataTransfer2(event.dataTransfer, $getClipboardDataFromSelection2(selection));
      $writeDragSourceToDataTransfer2(event.dataTransfer, editor);
    }
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(DRAGOVER_COMMAND2, (event) => {
    const [isFileTransfer] = eventFiles2(event);
    const selection = $getSelection2();
    if (isFileTransfer && !$isRangeSelection2(selection)) {
      return false;
    }
    const x2 = event.clientX;
    const y2 = event.clientY;
    const eventRange = caretFromPoint2(x2, y2, editor.getRootElement());
    if (eventRange !== null) {
      const node = $getNearestNodeFromDOMNode2(eventRange.node);
      if ($isDecoratorNode2(node)) {
        event.preventDefault();
      }
    }
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(SELECT_ALL_COMMAND2, () => {
    const selection = $getSelection2();
    $selectAll2($isRangeSelection2(selection) && $getSlotFrame2(selection.anchor.getNode()) !== null ? selection : null);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(COPY_COMMAND2, (event) => {
    copyToClipboard2(editor, objectKlassEquals2(event, ClipboardEvent) ? event : null);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(CUT_COMMAND2, (event) => {
    onCutForRichText(event, editor);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(PASTE_COMMAND2, (event) => {
    const [, files, hasTextContent] = eventFiles2(event);
    if (shouldHandlePasteAsFiles.peek()(files, hasTextContent) && editor.dispatchCommand(DRAG_DROP_PASTE, files)) {
      return true;
    }
    if (isDOMNode2(event.target) && $isSelectionCapturedInDecoratorInput2(event.target)) {
      return false;
    }
    const selection = $getSelection2();
    if (selection !== null) {
      onPasteForRichText(event, editor);
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_SPACE_COMMAND2, () => {
    const selection = $getSelection2();
    if ($isRangeSelection2(selection)) {
      $escapeFormatsForTrigger(selection, "space", "both", escapeFormatTriggers.peek());
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(KEY_TAB_COMMAND2, () => {
    const selection = $getSelection2();
    if ($isRangeSelection2(selection)) {
      $escapeFormatsForTrigger(selection, "tab", "both", escapeFormatTriggers.peek());
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(MOVE_TO_END2, (event) => {
    const selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      return $promoteNodeSelectionToBlockEdge(selection, false, event);
    }
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    const {
      anchor
    } = selection;
    if (anchor.type !== "element" || anchor.offset !== 0) {
      return false;
    }
    const element = anchor.getNode();
    if (!$isElementNode2(element)) {
      return false;
    }
    const firstChild = element.getFirstChild();
    if (!$isDecoratorNode2(firstChild) || !firstChild.isInline()) {
      return false;
    }
    const elementKey = element.getKey();
    const ending = element.selectEnd();
    if (event.shiftKey) {
      ending.anchor.set(elementKey, 0, "element");
    }
    event.preventDefault();
    event.stopPropagation();
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(MOVE_TO_START2, (event) => {
    const selection = $getSelection2();
    if ($isNodeSelection2(selection)) {
      return $promoteNodeSelectionToBlockEdge(selection, true, event);
    }
    if (!$isRangeSelection2(selection)) {
      return false;
    }
    const {
      anchor,
      focus
    } = selection;
    const focusBlock = $findMatchingParent2(focus.getNode(), (node) => $isElementNode2(node) && !node.isInline());
    if (focusBlock === null) {
      return false;
    }
    const firstChild = focusBlock.getFirstChild();
    if (!$isDecoratorNode2(firstChild) || !firstChild.isInline()) {
      return false;
    }
    const anchorBlock = $findMatchingParent2(anchor.getNode(), (node) => $isElementNode2(node) && !node.isInline());
    if (anchorBlock !== focusBlock) {
      return false;
    }
    const blockKey = focusBlock.getKey();
    if (focus.type === "element" && focus.key === blockKey && focus.offset === 0) {
      return false;
    }
    selection.focus.set(blockKey, 0, "element");
    if (!event.shiftKey) {
      selection.anchor.set(blockKey, 0, "element");
    }
    event.preventDefault();
    event.stopPropagation();
    return true;
  }, COMMAND_PRIORITY_EDITOR2));
  return removeListener;
}

// node_modules/@lexical/rich-text/dist/LexicalRichText.mjs
var mod9 = true ? LexicalRichText_dev_exports : LexicalRichText_prod_exports;
var $createHeadingNode2 = mod9.$createHeadingNode;
var $createQuoteNode2 = mod9.$createQuoteNode;
var $isHeadingNode2 = mod9.$isHeadingNode;
var $isQuoteNode2 = mod9.$isQuoteNode;
var DRAG_DROP_PASTE2 = mod9.DRAG_DROP_PASTE;
var HeadingAnnounceExtension2 = mod9.HeadingAnnounceExtension;
var HeadingNode2 = mod9.HeadingNode;
var QuoteNode2 = mod9.QuoteNode;
var RichTextExtension2 = mod9.RichTextExtension;
var RichTextImportExtension2 = mod9.RichTextImportExtension;
var RichTextImportRules2 = mod9.RichTextImportRules;
var ShadowRootQuoteRule2 = mod9.ShadowRootQuoteRule;
var defaultShouldHandlePasteAsFiles2 = mod9.defaultShouldHandlePasteAsFiles;
var eventFiles3 = mod9.eventFiles;
var quoteShadowRootState2 = mod9.quoteShadowRootState;
var registerRichText2 = mod9.registerRichText;

// node_modules/@lexical/history/dist/LexicalHistory.dev.mjs
var LexicalHistory_dev_exports = {};
__export(LexicalHistory_dev_exports, {
  HistoryExtension: () => HistoryExtension,
  SharedHistoryExtension: () => SharedHistoryExtension,
  createEmptyHistoryState: () => createEmptyHistoryState,
  registerHistory: () => registerHistory
});
var HISTORY_MERGE = 0;
var HISTORY_PUSH = 1;
var DISCARD_HISTORY_CANDIDATE = 2;
var OTHER = 0;
var COMPOSING_CHARACTER = 1;
var INSERT_CHARACTER_AFTER_SELECTION = 2;
var DELETE_CHARACTER_BEFORE_SELECTION = 3;
var DELETE_CHARACTER_AFTER_SELECTION = 4;
function getDirtyNodes(editorState, dirtyLeaves, dirtyElements) {
  const nodeMap = editorState._nodeMap;
  const nodes = [];
  for (const dirtyLeafKey of dirtyLeaves) {
    const dirtyLeaf = nodeMap.get(dirtyLeafKey);
    if (dirtyLeaf !== void 0) {
      nodes.push(dirtyLeaf);
    }
  }
  for (const [dirtyElementKey, intentionallyMarkedAsDirty] of dirtyElements) {
    if (!intentionallyMarkedAsDirty) {
      continue;
    }
    const dirtyElement = nodeMap.get(dirtyElementKey);
    if (dirtyElement !== void 0 && !$isRootNode2(dirtyElement)) {
      nodes.push(dirtyElement);
    }
  }
  return nodes;
}
function getChangeType(prevEditorState, nextEditorState, dirtyLeavesSet, dirtyElementsSet, isComposing) {
  if (prevEditorState === null || dirtyLeavesSet.size === 0 && dirtyElementsSet.size === 0 && !isComposing) {
    return OTHER;
  }
  const nextSelection = nextEditorState._selection;
  const prevSelection = prevEditorState._selection;
  if (isComposing) {
    return COMPOSING_CHARACTER;
  }
  if (!$isRangeSelection2(nextSelection) || !$isRangeSelection2(prevSelection) || !prevSelection.isCollapsed() || !nextSelection.isCollapsed()) {
    return OTHER;
  }
  const dirtyNodes = getDirtyNodes(nextEditorState, dirtyLeavesSet, dirtyElementsSet);
  if (dirtyNodes.length === 0) {
    return OTHER;
  }
  if (dirtyNodes.length > 1) {
    const nextNodeMap = nextEditorState._nodeMap;
    const nextAnchorNode = nextNodeMap.get(nextSelection.anchor.key);
    const prevAnchorNode = nextNodeMap.get(prevSelection.anchor.key);
    if (nextAnchorNode && prevAnchorNode && !prevEditorState._nodeMap.has(nextAnchorNode.__key) && $isTextNode2(nextAnchorNode) && nextAnchorNode.__text.length === 1 && nextSelection.anchor.offset === 1) {
      return INSERT_CHARACTER_AFTER_SELECTION;
    }
    return OTHER;
  }
  const nextDirtyNode = dirtyNodes[0];
  const prevDirtyNode = prevEditorState._nodeMap.get(nextDirtyNode.__key);
  if (!$isTextNode2(prevDirtyNode) || !$isTextNode2(nextDirtyNode) || prevDirtyNode.__mode !== nextDirtyNode.__mode) {
    return OTHER;
  }
  const prevText = prevDirtyNode.__text;
  const nextText = nextDirtyNode.__text;
  if (prevText === nextText) {
    return OTHER;
  }
  const nextAnchor = nextSelection.anchor;
  const prevAnchor = prevSelection.anchor;
  if (nextAnchor.key !== prevAnchor.key || nextAnchor.type !== "text") {
    return OTHER;
  }
  const nextAnchorOffset = nextAnchor.offset;
  const prevAnchorOffset = prevAnchor.offset;
  const textDiff = nextText.length - prevText.length;
  if (textDiff === 1 && prevAnchorOffset === nextAnchorOffset - 1) {
    return INSERT_CHARACTER_AFTER_SELECTION;
  }
  if (textDiff === -1 && prevAnchorOffset === nextAnchorOffset + 1) {
    return DELETE_CHARACTER_BEFORE_SELECTION;
  }
  if (textDiff === -1 && prevAnchorOffset === nextAnchorOffset) {
    return DELETE_CHARACTER_AFTER_SELECTION;
  }
  return OTHER;
}
function isTextNodeUnchanged(key, prevEditorState, nextEditorState) {
  const prevNode = prevEditorState._nodeMap.get(key);
  const nextNode = nextEditorState._nodeMap.get(key);
  const prevSelection = prevEditorState._selection;
  const nextSelection = nextEditorState._selection;
  const isDeletingLine = $isRangeSelection2(prevSelection) && $isRangeSelection2(nextSelection) && prevSelection.anchor.type === "element" && prevSelection.focus.type === "element" && nextSelection.anchor.type === "text" && nextSelection.focus.type === "text";
  if (!isDeletingLine && $isTextNode2(prevNode) && $isTextNode2(nextNode) && prevNode.__parent === nextNode.__parent) {
    return JSON.stringify(prevEditorState.read(() => prevNode.exportJSON())) === JSON.stringify(nextEditorState.read(() => nextNode.exportJSON()));
  }
  return false;
}
function createMergeActionGetter(editor, delayOrStore, dateNow) {
  let prevChangeTime = dateNow();
  let prevChangeType = OTHER;
  let compositionStartTime = prevChangeTime;
  let compositionStartChangeType = OTHER;
  let compositionStartState = null;
  return (prevEditorState, nextEditorState, currentHistoryEntry, dirtyLeaves, dirtyElements, tags) => {
    const changeTime = dateNow();
    if (tags.has(COMPOSITION_START_TAG2)) {
      compositionStartTime = prevChangeTime;
      compositionStartChangeType = prevChangeType;
      compositionStartState = prevEditorState;
    }
    if (tags.has(HISTORIC_TAG2)) {
      prevChangeType = OTHER;
      prevChangeTime = changeTime;
      return DISCARD_HISTORY_CANDIDATE;
    }
    const isCompositionEnd = tags.has(COMPOSITION_END_TAG2);
    if (isCompositionEnd && compositionStartState) {
      prevChangeTime = compositionStartTime;
      prevChangeType = compositionStartChangeType;
      prevEditorState = compositionStartState;
    }
    const changeType = tags.has(PASTE_TAG2) || tags.has(CUT_TAG2) ? OTHER : getChangeType(prevEditorState, nextEditorState, dirtyLeaves, dirtyElements, editor.isComposing());
    const mergeAction = (() => {
      const isSameEditor = currentHistoryEntry === null || currentHistoryEntry.editor === editor;
      const shouldPushHistory = tags.has(HISTORY_PUSH_TAG2);
      const shouldMergeHistory = !shouldPushHistory && isSameEditor && tags.has(HISTORY_MERGE_TAG2);
      if (shouldMergeHistory) {
        return HISTORY_MERGE;
      }
      if (changeType === COMPOSING_CHARACTER) {
        return DISCARD_HISTORY_CANDIDATE;
      }
      if (prevEditorState === null) {
        return HISTORY_PUSH;
      }
      const selection = nextEditorState._selection;
      const hasDirtyNodes = dirtyLeaves.size > 0 || dirtyElements.size > 0;
      if (!hasDirtyNodes) {
        if (selection !== null) {
          return HISTORY_MERGE;
        }
        return DISCARD_HISTORY_CANDIDATE;
      }
      const delay = typeof delayOrStore === "number" ? delayOrStore : delayOrStore.peek();
      if (shouldPushHistory === false && changeType !== OTHER && changeType === prevChangeType && changeTime < prevChangeTime + delay && isSameEditor) {
        return HISTORY_MERGE;
      }
      if (dirtyLeaves.size === 1) {
        const dirtyLeafKey = Array.from(dirtyLeaves)[0];
        if (isTextNodeUnchanged(dirtyLeafKey, prevEditorState, nextEditorState)) {
          return HISTORY_MERGE;
        }
      }
      return HISTORY_PUSH;
    })();
    prevChangeTime = changeTime;
    prevChangeType = changeType;
    return mergeAction;
  };
}
function getInverseEntry(historyStateEntry, current) {
  if (current !== null && current.editor === historyStateEntry.editor) {
    return current;
  }
  const {
    editor
  } = historyStateEntry;
  const editorState = editor.getEditorState();
  return editorState.isEmpty() ? null : {
    editor,
    editorState
  };
}
function getUndoEntry(editor, prevEditorState, current) {
  if (current === null) {
    return null;
  }
  if (current.editor === editor) {
    return {
      ...current
    };
  }
  return prevEditorState.isEmpty() ? null : {
    editor,
    editorState: prevEditorState
  };
}
function redo(editor, historyState, onChange) {
  const redoStack = historyState.redoStack;
  const undoStack = historyState.undoStack;
  if (redoStack.length !== 0) {
    const current = historyState.current;
    const historyStateEntry = redoStack.pop();
    if (historyStateEntry) {
      const inverseEntry = getInverseEntry(historyStateEntry, current);
      if (inverseEntry !== null) {
        undoStack.push(inverseEntry);
        editor.dispatchCommand(CAN_UNDO_COMMAND2, true);
      }
    }
    if (redoStack.length === 0) {
      editor.dispatchCommand(CAN_REDO_COMMAND2, false);
    }
    historyState.current = historyStateEntry || null;
    if (onChange) {
      onChange(historyState);
    }
    if (historyStateEntry) {
      historyStateEntry.editor.setEditorState(historyStateEntry.editorState, {
        tag: HISTORIC_TAG2
      });
    }
  }
}
function undo(editor, historyState, onChange) {
  const redoStack = historyState.redoStack;
  const undoStack = historyState.undoStack;
  const undoStackLength = undoStack.length;
  if (undoStackLength !== 0) {
    const current = historyState.current;
    const historyStateEntry = undoStack.pop();
    if (historyStateEntry) {
      const inverseEntry = getInverseEntry(historyStateEntry, current);
      if (inverseEntry !== null) {
        redoStack.push(inverseEntry);
        editor.dispatchCommand(CAN_REDO_COMMAND2, true);
      }
    }
    if (undoStack.length === 0) {
      editor.dispatchCommand(CAN_UNDO_COMMAND2, false);
    }
    historyState.current = historyStateEntry || null;
    if (onChange) {
      onChange(historyState);
    }
    if (historyStateEntry) {
      historyStateEntry.editor.setEditorState(historyStateEntry.editorState, {
        tag: HISTORIC_TAG2
      });
    }
  }
}
function clearHistory(historyState, onChange) {
  historyState.undoStack = [];
  historyState.redoStack = [];
  historyState.current = null;
  if (onChange) {
    onChange(historyState);
  }
}
function registerHistory(editor, historyState, delay, dateNow = Date.now, onHistoryStateChange, maxDepth = null) {
  const getMergeAction = createMergeActionGetter(editor, delay, dateNow);
  const readMaxDepth = () => typeof maxDepth === "number" || maxDepth === null ? maxDepth : maxDepth.peek();
  const notifyChange = () => {
    if (onHistoryStateChange) {
      onHistoryStateChange(historyState);
    }
  };
  const applyChange = ({
    editorState,
    prevEditorState,
    dirtyLeaves,
    dirtyElements,
    tags
  }) => {
    const current = historyState.current;
    const redoStack = historyState.redoStack;
    const undoStack = historyState.undoStack;
    const currentEditorState = current === null ? null : current.editorState;
    if (current !== null && editorState === currentEditorState) {
      return;
    }
    const mergeAction = getMergeAction(prevEditorState, editorState, current, dirtyLeaves, dirtyElements, tags);
    if (mergeAction === HISTORY_PUSH) {
      if (redoStack.length !== 0) {
        historyState.redoStack = [];
        editor.dispatchCommand(CAN_REDO_COMMAND2, false);
      }
      const undoEntry = getUndoEntry(editor, prevEditorState, current);
      if (undoEntry !== null) {
        undoStack.push(undoEntry);
        const cap = readMaxDepth();
        if (cap !== null && undoStack.length > cap) {
          undoStack.splice(0, undoStack.length - cap);
        }
        editor.dispatchCommand(CAN_UNDO_COMMAND2, true);
      }
    } else if (mergeAction === DISCARD_HISTORY_CANDIDATE) {
      return;
    }
    historyState.current = {
      editor,
      editorState
    };
    notifyChange();
  };
  notifyChange();
  return mergeRegister2(editor.registerCommand(UNDO_COMMAND2, () => {
    undo(editor, historyState, onHistoryStateChange);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(REDO_COMMAND2, () => {
    redo(editor, historyState, onHistoryStateChange);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(CLEAR_EDITOR_COMMAND2, () => {
    clearHistory(historyState, onHistoryStateChange);
    return false;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerCommand(CLEAR_HISTORY_COMMAND2, () => {
    clearHistory(historyState, onHistoryStateChange);
    editor.dispatchCommand(CAN_REDO_COMMAND2, false);
    editor.dispatchCommand(CAN_UNDO_COMMAND2, false);
    return true;
  }, COMMAND_PRIORITY_EDITOR2), editor.registerUpdateListener(applyChange));
}
function createEmptyHistoryState() {
  return {
    current: null,
    redoStack: [],
    undoStack: []
  };
}
var HistoryExtension = {
  build: (editor, {
    delay,
    createInitialHistoryState,
    disabled,
    maxDepth,
    now
  }, state) => {
    return {
      ...namedSignals2({
        delay,
        disabled,
        historyState: createInitialHistoryState(editor),
        maxDepth,
        now
      }),
      ...state.getInitResult()
    };
  },
  config: {
    createInitialHistoryState: createEmptyHistoryState,
    delay: 300,
    disabled: typeof window === "undefined",
    maxDepth: null,
    now: Date.now
  },
  init: () => ({
    canRedo: signal(false),
    canUndo: signal(false)
  }),
  name: "@lexical/history/History",
  register: (editor, config, state) => {
    const {
      canUndo,
      canRedo
    } = state.getInitResult();
    const stores = state.getOutput();
    const syncFromHistoryState = (historyState) => batch(() => {
      canUndo.value = historyState != null && historyState.undoStack.length > 0;
      canRedo.value = historyState != null && historyState.redoStack.length > 0;
    });
    return effect(() => {
      if (stores.disabled.value) {
        syncFromHistoryState(null);
        return void 0;
      }
      return registerHistory(editor, stores.historyState.value, stores.delay, () => stores.now.peek()(), syncFromHistoryState, stores.maxDepth);
    });
  }
};
var HMR_EXTENSION_NAME2 = "@lexical/extension/HMR";
function getHistoryPeer(editor) {
  return editor ? getPeerDependencyFromEditor2(editor, HistoryExtension.name) : null;
}
function hmrRestoreCount(editor) {
  const peer = editor ? getPeerDependencyFromEditor2(editor, HMR_EXTENSION_NAME2) : void 0;
  return peer ? peer.output.restoreCount.value : 0;
}
var SharedHistoryExtension = {
  build: (editor, {
    disabled,
    parentEditor
  }) => namedSignals2({
    disabled,
    parentEditor: parentEditor || editor._parentEditor
  }),
  config: {
    disabled: false,
    parentEditor: null
  },
  dependencies: [[HistoryExtension, {
    disabled: true
  }]],
  name: "@lexical/history/SharedHistory",
  register(editor, _config, state) {
    return effect(() => {
      const {
        disabled,
        parentEditor
      } = state.getOutput();
      if (!disabled.value) {
        const {
          output
        } = state.getDependency(HistoryExtension);
        hmrRestoreCount(editor);
        hmrRestoreCount(parentEditor.value);
        const parentPeer = getHistoryPeer(parentEditor.value);
        if (!parentPeer) {
          return;
        }
        const parentOutput = parentPeer.output;
        batch(() => {
          output.delay.value = parentOutput.delay.value;
          output.historyState.value = parentOutput.historyState.value;
          output.now.value = parentOutput.now.value;
          output.maxDepth.value = parentOutput.maxDepth.value;
          output.disabled.value = parentOutput.disabled.value;
        });
      }
    });
  }
};

// node_modules/@lexical/history/dist/LexicalHistory.mjs
var mod10 = true ? LexicalHistory_dev_exports : LexicalHistory_prod_exports;
var HistoryExtension2 = mod10.HistoryExtension;
var SharedHistoryExtension2 = mod10.SharedHistoryExtension;
var createEmptyHistoryState2 = mod10.createEmptyHistoryState;
var registerHistory2 = mod10.registerHistory;
export {
  $applyNodeReplacement2 as $applyNodeReplacement,
  $createNodeSelection2 as $createNodeSelection,
  $createParagraphNode2 as $createParagraphNode,
  $createTextNode2 as $createTextNode,
  $getNodeByKey2 as $getNodeByKey,
  $getRoot2 as $getRoot,
  $getSelection2 as $getSelection,
  $getSelectionStyleValueForProperty2 as $getSelectionStyleValueForProperty,
  $insertNodes2 as $insertNodes,
  $isRangeSelection2 as $isRangeSelection,
  $patchStyleText2 as $patchStyleText,
  $setSelection2 as $setSelection,
  COMMAND_PRIORITY_HIGH2 as COMMAND_PRIORITY_HIGH,
  DecoratorNode2 as DecoratorNode,
  FORMAT_TEXT_COMMAND2 as FORMAT_TEXT_COMMAND,
  PASTE_COMMAND2 as PASTE_COMMAND,
  createEditor2 as createEditor,
  createEmptyHistoryState2 as createEmptyHistoryState,
  registerHistory2 as registerHistory,
  registerRichText2 as registerRichText
};
