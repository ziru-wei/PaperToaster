import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import katex from "katex";

let purifier = null;

const markdown = markdownit({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false
});

installMathRules(markdown);
installContextCitationRule(markdown);

function installContextCitationRule(markdownInstance) {
  markdownInstance.core.ruler.after("inline", "paper_context_citation", (state) => {
    state.tokens.forEach((blockToken) => {
      if (!Array.isArray(blockToken.children)) {
        return;
      }
      const children = [];
      blockToken.children.forEach((token) => {
        const replacements = token.type === "text"
          ? splitContextCitationToken(state.Token, token, state.env?.citationCatalog)
          : [token];
        if (replacements[0]?.attrGet?.("class") === "paper-context-citation") {
          attachCitationToPreviousText(children);
        }
        children.push(...replacements);
      });
      blockToken.children = children;
    });
  });
}

function splitContextCitationToken(Token, token, citationCatalog) {
  const citationPattern = /\[p\d+-h\d+-c\d+\](?:\s+\[p\d+-h\d+-c\d+\])*/gi;
  const matches = [...token.content.matchAll(citationPattern)];
  if (!matches.length) {
    return [token];
  }

  const tokens = [];
  let cursor = 0;
  matches.forEach((match) => {
    if (match.index > cursor) {
      const precedingText = token.content
        .slice(cursor, match.index)
        .replace(/[ \t]+$/, "\u202f");
      tokens.push(createTextToken(Token, precedingText, token.level));
    }

    const openToken = new Token("span_open", "span", 1);
    openToken.level = token.level;
    openToken.attrSet("class", "paper-context-citation");
    tokens.push(openToken);

    const iconOpenToken = new Token("span_open", "span", 1);
    iconOpenToken.level = token.level + 1;
    iconOpenToken.attrSet("class", "paper-context-citation-icon");
    iconOpenToken.attrSet("aria-hidden", "true");
    tokens.push(iconOpenToken);
    const iconCloseToken = new Token("span_close", "span", -1);
    iconCloseToken.level = token.level + 1;
    tokens.push(iconCloseToken);

    tokens.push(...createCitationPopoverTokens(Token, match[0], token.level + 1, citationCatalog));

    const closeToken = new Token("span_close", "span", -1);
    closeToken.level = token.level;
    tokens.push(closeToken);
    cursor = match.index + match[0].length;
  });

  if (cursor < token.content.length) {
    tokens.push(createTextToken(Token, token.content.slice(cursor), token.level));
  }
  return tokens;
}

function attachCitationToPreviousText(tokens) {
  const previous = tokens.at(-1);
  if (previous?.type === "text" && /[ \t]$/.test(previous.content)) {
    previous.content = previous.content.replace(/[ \t]+$/, "\u202f");
  }
}

function createCitationPopoverTokens(Token, citationText, level, citationCatalog) {
  const tokens = [];
  const popoverOpen = new Token("span_open", "span", 1);
  popoverOpen.level = level;
  popoverOpen.attrSet("class", "paper-context-citation-popover");
  tokens.push(popoverOpen);

  groupCitationIds(citationText, citationCatalog).forEach((group) => {
    const rowOpen = new Token("span_open", "span", 1);
    rowOpen.level = level + 1;
    rowOpen.attrSet("class", "paper-context-citation-label");
    rowOpen.attrSet("data-citation-paper-id", group.paperId);
    tokens.push(rowOpen);

    const paperOpen = new Token("span_open", "span", 1);
    paperOpen.level = level + 2;
    paperOpen.attrSet("class", "paper-context-citation-paper");
    tokens.push(paperOpen);
    tokens.push(createTextToken(Token, group.shortName, level + 3));
    tokens.push(createCloseToken(Token, level + 2));

    group.locations.forEach((location) => {
      const locationOpen = new Token("span_open", "span", 1);
      locationOpen.level = level + 2;
      locationOpen.attrSet("class", "paper-context-citation-location");
      tokens.push(locationOpen);
      tokens.push(createTextToken(Token, `/ ${location.heading} · ${location.chunks.join(", ")}`, level + 3));
      tokens.push(createCloseToken(Token, level + 2));
    });
    tokens.push(createCloseToken(Token, level + 1));
  });

  tokens.push(createCloseToken(Token, level));
  return tokens;
}

function groupCitationIds(citationText, citationCatalog) {
  const papers = new Map(
    (Array.isArray(citationCatalog?.papers) ? citationCatalog.papers : [])
      .map((paper) => [paper.id, paper])
  );
  const groups = new Map();
  for (const match of citationText.matchAll(/\[(p\d+)-(h\d+)-(c\d+)\]/gi)) {
    const paperId = match[1].toLowerCase();
    const headingId = match[2].toLowerCase();
    const chunkId = match[3].toLowerCase();
    if (!groups.has(paperId)) {
      const paper = papers.get(paperId);
      groups.set(paperId, {
        paperId,
        shortName: paper?.shortName || paperId,
        locationsByHeading: new Map()
      });
    }
    const paper = papers.get(paperId);
    const headingName = truncateCitationHeading(paper?.headings?.[headingId] || headingId);
    const group = groups.get(paperId);
    if (!group.locationsByHeading.has(headingId)) {
      group.locationsByHeading.set(headingId, {
        heading: headingName,
        chunks: []
      });
    }
    group.locationsByHeading.get(headingId).chunks.push(chunkId);
  }
  return [...groups.values()].map(({ locationsByHeading, ...group }) => ({
    ...group,
    locations: [...locationsByHeading.values()]
  }));
}

function truncateCitationHeading(value) {
  const heading = String(value || "").trim();
  return heading.length > 22 ? `${heading.slice(0, 21).trimEnd()}…` : heading;
}

function createCloseToken(Token, level) {
  const token = new Token("span_close", "span", -1);
  token.level = level;
  return token;
}

function createTextToken(Token, content, level) {
  const token = new Token("text", "", 0);
  token.content = content;
  token.level = level;
  return token;
}

function installMathRules(markdownInstance) {
  markdownInstance.inline.ruler.before("escape", "paper_inline_math", (state, silent) => {
    const start = state.pos;
    if (state.src[start] !== "$" || state.src[start + 1] === "$" || isEscaped(state.src, start)) {
      return false;
    }

    const contentStart = start + 1;
    if (!state.src[contentStart] || /\s/.test(state.src[contentStart])) {
      return false;
    }

    const contentEnd = findClosingMathDelimiter(state.src, contentStart);
    if (contentEnd < 0 || contentEnd === contentStart || /\s/.test(state.src[contentEnd - 1])) {
      return false;
    }

    if (!silent) {
      const token = state.push("paper_inline_math", "math", 0);
      token.content = state.src.slice(contentStart, contentEnd);
      token.markup = "$";
    }
    state.pos = contentEnd + 1;
    return true;
  });

  markdownInstance.block.ruler.before("fence", "paper_block_math", (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const end = state.eMarks[startLine];
    const firstLine = state.src.slice(start, end);
    if (!firstLine.startsWith("$$")) {
      return false;
    }

    let content = firstLine.slice(2);
    let nextLine = startLine;
    let closed = false;
    const sameLineEnd = findUnescapedDoubleDollar(content);
    if (sameLineEnd >= 0) {
      content = content.slice(0, sameLineEnd);
      closed = true;
      nextLine = startLine + 1;
    } else {
      const lines = [content];
      for (nextLine = startLine + 1; nextLine < endLine; nextLine += 1) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
        const lineEnd = state.eMarks[nextLine];
        const line = state.src.slice(lineStart, lineEnd);
        const closingIndex = findUnescapedDoubleDollar(line);
        if (closingIndex >= 0) {
          lines.push(line.slice(0, closingIndex));
          closed = true;
          nextLine += 1;
          break;
        }
        lines.push(line);
      }
      content = lines.join("\n");
    }

    if (!closed) {
      return false;
    }
    if (silent) {
      return true;
    }

    const token = state.push("paper_block_math", "math", 0);
    token.block = true;
    token.content = content.trim();
    token.map = [startLine, nextLine];
    token.markup = "$$";
    state.line = nextLine;
    return true;
  });

  markdownInstance.renderer.rules.paper_inline_math = (tokens, index) => (
    renderMath(tokens[index].content, false)
  );
  markdownInstance.renderer.rules.paper_block_math = (tokens, index) => (
    `<span class="paper-math-block">${renderMath(tokens[index].content, true)}</span>\n`
  );
}

function renderMath(source, displayMode) {
  return katex.renderToString(source, {
    displayMode,
    output: "html",
    throwOnError: false,
    trust: false,
    strict: "ignore"
  });
}

function findClosingMathDelimiter(source, start) {
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "\n") {
      return -1;
    }
    if (source[index] === "$" && source[index + 1] !== "$" && !isEscaped(source, index)) {
      return index;
    }
  }
  return -1;
}

function findUnescapedDoubleDollar(source) {
  for (let index = 0; index < source.length - 1; index += 1) {
    if (source[index] === "$" && source[index + 1] === "$" && !isEscaped(source, index)) {
      return index;
    }
  }
  return -1;
}

function isEscaped(source, index) {
  let slashCount = 0;
  for (let cursor = index - 1; cursor >= 0 && source[cursor] === "\\"; cursor -= 1) {
    slashCount += 1;
  }
  return slashCount % 2 === 1;
}

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
  ALLOWED_ATTR: [
    "aria-hidden",
    "class",
    "data-annotation-group",
    "href",
    "rel",
    "style",
    "target",
    "title"
  ]
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
    omitHiddenText: Boolean(options.omitHiddenText),
    citationCatalog: options.citationCatalog || null
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
