import { createBreadTextElement } from "./bread-text.js";

export function createToasterEmptyState(message, options = {}) {
  const empty = document.createElement("div");
  empty.className = ["toaster-empty", options.className || ""].filter(Boolean).join(" ");
  empty.setAttribute("aria-label", message);

  empty.append(createBreadTextElement());
  if (options.subtitle) {
    const subtitle = document.createElement("div");
    subtitle.className = "toaster-empty-subtitle";
    subtitle.textContent = options.subtitle;
    empty.append(subtitle);
  }
  return empty;
}
