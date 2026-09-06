import markdownit from "markdown-it";
import DOMPurify from "dompurify";

let purifier = null;

const markdown = markdownit({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false
});

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
    "ol",
    "p",
    "pre",
    "s",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul"
  ],
  ALLOWED_ATTR: ["class", "href", "rel", "target", "title"]
});

export function renderMarkdown(markdownText) {
  const html = markdown.render(String(markdownText || ""));
  return getPurifier().sanitize(html, SANITIZE_OPTIONS);
}

export function renderMarkdownFragment(markdownText) {
  const html = markdown.render(String(markdownText || ""));
  return getPurifier().sanitize(html, {
    ...SANITIZE_OPTIONS,
    RETURN_DOM_FRAGMENT: true
  });
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
