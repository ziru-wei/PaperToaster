export function createToasterEmptyState(message, options = {}) {
  const empty = document.createElement("div");
  empty.className = ["toaster-empty", options.className || ""].filter(Boolean).join(" ");
  empty.setAttribute("aria-label", message);

  const bubble = document.createElement("div");
  bubble.className = "toaster-empty-bubble";
  const speech = document.createElement("pre");
  speech.textContent = createSpeechBubbleText(message);
  bubble.append(speech);

  const icon = document.createElement("img");
  icon.className = "toaster-empty-icon";
  icon.src = "../assets/extension/icon-128.png";
  icon.alt = "";

  empty.append(bubble, icon);
  if (options.subtitle) {
    const subtitle = document.createElement("div");
    subtitle.className = "toaster-empty-subtitle";
    subtitle.textContent = options.subtitle;
    empty.append(subtitle);
  }
  return empty;
}

function createSpeechBubbleText(message) {
  const line = String(message || "").trim();
  const width = Math.max(line.length + 2, 26);
  const leftPadding = Math.floor((width - line.length) / 2);
  const rightPadding = width - line.length - leftPadding;
  const top = `.${"-".repeat(width)}.`;
  const middle = `|${" ".repeat(leftPadding)}${line}${" ".repeat(rightPadding)}|`;
  const pointerLeft = Math.max(1, Math.floor(width / 2));
  const pointerRight = width - pointerLeft - 1;
  const bottom = `'${"-".repeat(pointerLeft)}v${"-".repeat(pointerRight)}'`;
  return [top, middle, bottom].join("\n");
}
