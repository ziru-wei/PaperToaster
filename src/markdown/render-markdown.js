import { renderMarkdownFragment } from "../../vendor/markdown-renderer/markdown-renderer.mjs";

export function renderMarkdownInto(element, markdownText) {
  element.classList.add("markdown-body");
  element.replaceChildren(renderMarkdownFragment(markdownText));
}
