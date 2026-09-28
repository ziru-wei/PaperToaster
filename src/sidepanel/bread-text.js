let breadTextPromise = null;

export function createBreadTextElement(className = "") {
  const bread = document.createElement("pre");
  bread.className = ["toaster-empty-bread", className].filter(Boolean).join(" ");
  bread.setAttribute("aria-hidden", "true");
  void hydrateBreadTextElement(bread);
  return bread;
}

export async function hydrateBreadTextElement(element) {
  if (!element) {
    return;
  }
  try {
    element.textContent = await loadBreadText();
  } catch (error) {
    console.debug("[Paper Toaster] Could not load bread text", error);
  }
}

function loadBreadText() {
  if (!breadTextPromise) {
    const url = chrome.runtime.getURL("src/assets/bread.txt");
    breadTextPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Bread text request failed (${response.status})`);
        }
        return response.text();
      })
      .then(trimBlankEdgeLines);
  }
  return breadTextPromise;
}

function trimBlankEdgeLines(value) {
  const lines = String(value || "").replace(/\r\n?/g, "\n").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  return lines.join("\n");
}
