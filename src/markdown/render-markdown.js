import { renderMarkdownFragment } from "../../vendor/markdown-renderer/markdown-renderer.mjs";

export function renderMarkdownInto(element, markdownText, options = {}) {
  element.classList.add("markdown-body");
  try {
    element.replaceChildren(renderMarkdownFragment(markdownText, options));
  } catch (error) {
    console.debug("[Paper Toaster] Could not render markdown; falling back to plain text.", error);
    element.textContent = String(markdownText || "");
  }
}
