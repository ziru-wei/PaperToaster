// Holding ⌘ (Ctrl elsewhere) while hovering a figure shows it large beside the
// pointer, in every view: list thumbnails and board or gallery covers.

const FIGURE_SELECTOR = ".paper-list-figure, .paper-gallery-cover img";
const POINTER_GAP = 18;
const VIEWPORT_MARGIN = 12;

export function initializeFigurePreview() {
  let hovered = null;
  let preview = null;
  let pointerX = 0;
  let pointerY = 0;

  const isModifier = (event) => event.metaKey || event.ctrlKey;

  const show = () => {
    if (!hovered?.isConnected || !hovered.currentSrc && !hovered.src) return;
    if (!preview) {
      preview = document.createElement("div");
      preview.className = "figure-hover-preview";
      preview.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      image.alt = "";
      image.addEventListener("load", position);
      preview.append(image);
      document.body.append(preview);
    }
    // The image's own tooltip would sit on top of the preview.
    if (hovered.title) {
      hovered.dataset.previewTitle = hovered.title;
      hovered.removeAttribute("title");
    }
    const image = preview.firstElementChild;
    const source = hovered.currentSrc || hovered.src;
    if (image.src !== source) image.src = source;
    position();
  };

  const hide = () => {
    preview?.remove();
    preview = null;
    document.querySelectorAll("[data-preview-title]").forEach((figure) => {
      figure.title = figure.dataset.previewTitle;
      delete figure.dataset.previewTitle;
    });
  };

  // Beside the pointer, on whichever side has room, kept inside the window.
  function position() {
    if (!preview) return;
    const { width, height } = preview.getBoundingClientRect();
    const fitsRight = pointerX + POINTER_GAP + width <= window.innerWidth - VIEWPORT_MARGIN;
    const left = fitsRight ? pointerX + POINTER_GAP : pointerX - POINTER_GAP - width;
    const top = pointerY - height / 2;
    preview.style.left = `${Math.round(Math.max(VIEWPORT_MARGIN, left))}px`;
    preview.style.top = `${Math.round(Math.min(Math.max(VIEWPORT_MARGIN, top), window.innerHeight - height - VIEWPORT_MARGIN))}px`;
  }

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    hovered = event.target.closest?.(FIGURE_SELECTOR) || null;
    if (hovered && isModifier(event)) show();
    else hide();
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if ((event.key === "Meta" || event.key === "Control") && hovered) show();
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "Meta" || event.key === "Control") hide();
  });
  window.addEventListener("blur", hide);
  window.addEventListener("scroll", hide, { capture: true, passive: true });
}
