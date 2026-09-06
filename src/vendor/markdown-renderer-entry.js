import markdownit from "markdown-it";
import DOMPurify from "dompurify";

let purifier = null;

const markdown = markdownit({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false
});

markdown.inline.ruler.before("emphasis", "paper_hidden_text", (state, silent) => {
  const start = state.pos;
  const encodedHidden = parseEncodedAnnotation(state, {
    open: "{{hide64:",
    close: "}}"
  });
  if (encodedHidden) {
    if (silent) {
      return true;
    }

    state.pos = encodedHidden.end;
    if (state.env?.omitHiddenText) {
      return true;
    }

    const openToken = state.push("span_open", "span", 1);
    openToken.attrSet("class", "paper-hidden-text");
    if (encodedHidden.groupId) {
      openToken.attrSet("data-annotation-group", encodedHidden.groupId);
    }
    const textToken = state.push("text", "", 0);
    textToken.content = encodedHidden.content;
    state.push("span_close", "span", -1);
    return true;
  }

  const open = "{{hide:";
  const close = "}}";
  if (!state.src.startsWith(open, start)) {
    return false;
  }

  const contentStart = start + open.length;
  const contentEnd = state.src.indexOf(close, contentStart);
  if (contentEnd <= contentStart) {
    return false;
  }

  if (silent) {
    return true;
  }

  state.pos = contentEnd + close.length;
  if (state.env?.omitHiddenText) {
    return true;
  }

  const openToken = state.push("span_open", "span", 1);
  openToken.attrSet("class", "paper-hidden-text");
  const textToken = state.push("text", "", 0);
  textToken.content = state.src.slice(contentStart, contentEnd);
  state.push("span_close", "span", -1);
  return true;
});

markdown.inline.ruler.before("emphasis", "paper_highlight_text", (state, silent) => {
  const encodedHighlight = parseEncodedAnnotation(state, {
    open: "{{highlight64:",
    close: "}}"
  });
  if (!encodedHighlight) {
    return false;
  }

  if (silent) {
    return true;
  }

  const openToken = state.push("span_open", "span", 1);
  openToken.markup = "highlight64";
  openToken.attrSet("class", "paper-highlight-text");
  const textToken = state.push("text", "", 0);
  textToken.content = encodedHighlight.content;
  const closeToken = state.push("span_close", "span", -1);
  closeToken.markup = "highlight64";
  state.pos = encodedHighlight.end;
  return true;
});

markdown.inline.ruler.before("emphasis", "paper_circle_text", (state, silent) => {
  const encodedCircle = parseEncodedAnnotation(state, {
    open: "{{circle64:",
    close: "}}"
  });
  if (!encodedCircle) {
    return false;
  }

  if (silent) {
    return true;
  }

  const openToken = state.push("span_open", "span", 1);
  openToken.markup = "circle64";
  openToken.attrSet("class", "paper-circle-text");
  const textToken = state.push("text", "", 0);
  textToken.content = encodedCircle.content;
  const closeToken = state.push("span_close", "span", -1);
  closeToken.markup = "circle64";
  state.pos = encodedCircle.end;
  return true;
});

markdown.inline.ruler.before("emphasis", "mark", (state, silent) => {
  const start = state.pos;
  if (state.src.charCodeAt(start) !== 0x3D || state.src.charCodeAt(start + 1) !== 0x3D) {
    return false;
  }

  const contentStart = start + 2;
  const end = state.src.indexOf("==", contentStart);
  if (end <= contentStart) {
    return false;
  }

  if (silent) {
    return true;
  }

  const openToken = state.push("span_open", "span", 1);
  openToken.markup = "==";
  openToken.attrSet("class", "paper-highlight-text");
  const textToken = state.push("text", "", 0);
  textToken.content = state.src.slice(contentStart, end);
  const closeToken = state.push("span_close", "span", -1);
  closeToken.markup = "==";
  state.pos = end + 2;
  return true;
});

function parseEncodedAnnotation(state, syntax) {
  const start = state.pos;
  if (!state.src.startsWith(syntax.open, start)) {
    return null;
  }

  const contentStart = start + syntax.open.length;
  const contentEnd = state.src.indexOf(syntax.close, contentStart);
  if (contentEnd <= contentStart) {
    return null;
  }

  const metadata = parseEncodedAnnotationMetadata(state.src.slice(contentStart, contentEnd));
  const content = decodeAnnotationContent(metadata.encodedText);
  if (!content) {
    return null;
  }

  return {
    content,
    groupId: metadata.groupId,
    end: contentEnd + syntax.close.length
  };
}

function parseEncodedAnnotationMetadata(content) {
  const value = String(content || "");
  const separatorIndex = value.indexOf(":");
  if (separatorIndex > 0) {
    const groupId = value.slice(0, separatorIndex);
    if (/^[a-z0-9-]+$/i.test(groupId)) {
      return {
        groupId,
        encodedText: value.slice(separatorIndex + 1)
      };
    }
  }
  return {
    groupId: "",
    encodedText: value
  };
}

function decodeAnnotationContent(encodedText) {
  try {
    const base64 = String(encodedText || "").replaceAll("-", "+").replaceAll("_", "/");
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const binary = atob(padded);
    const bytes = new Uint8Array(Array.from(binary, (character) => character.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

const defaultLinkOpen =
  markdown.renderer.rules.link_open ||
  ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));

markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  token.attrSet("target", "_blank");
  token.attrSet("rel", "noreferrer noopener");
  return defaultLinkOpen(tokens, index, options, env, self);
};

const SANITIZE_OPTIONS = Object.freeze({
  ALLOWED_TAGS: [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "li",
    "mark",
    "ol",
    "p",
    "pre",
    "s",
    "span",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul"
  ],
  ALLOWED_ATTR: ["class", "data-annotation-group", "href", "rel", "target", "title"]
});

export function renderMarkdown(markdownText, options = {}) {
  const html = markdown.render(String(markdownText || ""), createMarkdownEnv(options));
  return getPurifier().sanitize(html, SANITIZE_OPTIONS);
}

export function renderMarkdownFragment(markdownText, options = {}) {
  const html = markdown.render(String(markdownText || ""), createMarkdownEnv(options));
  return getPurifier().sanitize(html, {
    ...SANITIZE_OPTIONS,
    RETURN_DOM_FRAGMENT: true
  });
}

function createMarkdownEnv(options = {}) {
  return {
    omitHiddenText: Boolean(options.omitHiddenText)
  };
}

function getPurifier() {
  if (purifier) {
    return purifier;
  }

  if (typeof DOMPurify?.sanitize === "function") {
    purifier = DOMPurify;
    return purifier;
  }

  if (typeof DOMPurify === "function" && typeof window !== "undefined") {
    purifier = DOMPurify(window);
    return purifier;
  }

  throw new Error("Markdown sanitizer is not available in this browser context.");
}
