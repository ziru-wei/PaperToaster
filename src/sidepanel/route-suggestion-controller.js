import {
  getPaperQuestionRouteLabel,
  listPaperQuestionRoutes,
  routePaperQuestion
} from "../rag/query-intent-router.js";

const ROUTE_DIRECTION = Object.freeze({
  PREVIOUS: -1,
  NEXT: 1
});

export function createRouteSuggestionController({
  element,
  getSelectionText,
  onChange
}) {
  const routes = listPaperQuestionRoutes();
  let pending = null;

  element.addEventListener("click", handleClick);

  function prepare(question) {
    const normalizedQuestion = normalizeQuestion(question);
    const selectionText = normalizeQuestion(getSelectionText?.() || "");
    const suggestedIntent = routePaperQuestion({
      question: normalizedQuestion,
      selectionText
    });

    pending = {
      question: normalizedQuestion,
      selectionText,
      suggestedId: suggestedIntent.id,
      selectedId: suggestedIntent.id,
      wasAdjusted: false
    };
    render();
    onChange?.(pending);
  }

  function accept() {
    if (!pending) {
      return null;
    }

    const submission = {
      intentOverride: pending.selectedId,
      intentOverrideSource: pending.wasAdjusted ? "manual" : "confirmed",
      suggestedIntentId: pending.suggestedId
    };
    reset();
    return submission;
  }

  function reset() {
    pending = null;
    element.hidden = true;
    element.textContent = "";
    onChange?.(null);
  }

  function hasPendingSuggestionFor(question) {
    return Boolean(pending && pending.question === normalizeQuestion(question));
  }

  function handleKeydown(event) {
    if (!pending) {
      return false;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(ROUTE_DIRECTION.PREVIOUS);
      return true;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(ROUTE_DIRECTION.NEXT);
      return true;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      reset();
      return true;
    }

    return false;
  }

  function move(direction) {
    if (!pending) {
      return;
    }

    const currentIndex = Math.max(0, routes.findIndex((route) => route.id === pending.selectedId));
    const nextIndex = (currentIndex + direction + routes.length) % routes.length;
    pending = {
      ...pending,
      selectedId: routes[nextIndex].id,
      wasAdjusted: true
    };
    render();
    onChange?.(pending);
  }

  function render() {
    if (!pending) {
      reset();
      return;
    }

    element.textContent = "";
    element.hidden = false;

    const previousButton = createRouteButton("previous", "‹", "Previous route");
    const label = document.createElement("span");
    label.className = "route-suggestion-label";
    label.textContent = getPaperQuestionRouteLabel(pending.selectedId);
    label.title = getPaperQuestionRouteLabel(pending.selectedId);

    const hint = document.createElement("span");
    hint.className = "route-suggestion-hint";
    hint.textContent = "↵";
    hint.title = pending.wasAdjusted ? "Press Enter to send with selected route" : "Press Enter to accept suggested route";

    const nextButton = createRouteButton("next", "›", "Next route");
    element.append(previousButton, label, hint, nextButton);
  }

  function handleClick(event) {
    const button = event.target.closest?.("[data-route-direction]");
    if (!button || !element.contains(button)) {
      return;
    }

    event.preventDefault();
    move(button.dataset.routeDirection === "previous" ? ROUTE_DIRECTION.PREVIOUS : ROUTE_DIRECTION.NEXT);
  }

  function createRouteButton(direction, text, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "route-suggestion-step";
    button.dataset.routeDirection = direction;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  }

  return {
    prepare,
    accept,
    reset,
    hasPendingSuggestionFor,
    handleKeydown
  };
}

function normalizeQuestion(question) {
  return String(question || "")
    .replace(/\s+/g, " ")
    .trim();
}
