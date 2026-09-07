const MORE_TOAST_TEXT = "More toast is needed";
const BURN_STEP_MS = 86;
const BURN_STATES = [
  { text: "▓", className: "burn-heavy" },
  { text: "▒", className: "burn-medium" },
  { text: "░", className: "burn-light" },
  { text: "", className: "burn-gone" }
];

const burnStateByElement = new WeakMap();
const burnableIndexes = MORE_TOAST_TEXT
  .split("")
  .map((character, index) => character === " " ? null : index)
  .filter((index) => index !== null);

export function syncMoreToastBurn({ element, paperCount, stateKey }) {
  if (!element) {
    return;
  }

  const key = stateKey || element;
  let state = burnStateByElement.get(key);
  if (!state) {
    state = {
      currentElement: element,
      timers: [],
      burnOrder: createBurnOrder(),
      burnedIndexes: new Set(),
      targetLevel: getBurnLevel(paperCount)
    };
    burnStateByElement.set(key, state);
    setBurnLevel(state, state.targetLevel);
    renderBurnText(element, state);
    return;
  }

  state.currentElement = element;
  const nextLevel = getBurnLevel(paperCount);
  renderBurnText(element, state);
  if (nextLevel === state.targetLevel) {
    return;
  }

  if (nextLevel < state.targetLevel) {
    cancelBurnTimers(state);
    state.targetLevel = nextLevel;
    setBurnLevel(state, nextLevel);
    renderBurnText(element, state);
    return;
  }

  burnTowardLevel(state, nextLevel);
}

export function clearMoreToastBurn(stateKey) {
  const state = burnStateByElement.get(stateKey);
  if (!state) {
    return;
  }
  cancelBurnTimers(state);
  burnStateByElement.delete(stateKey);
}

function burnTowardLevel(state, nextLevel) {
  cancelBurnTimers(state);
  state.activeBurnStateByIndex = {};
  const fromCount = state.burnedIndexes.size;
  const toCount = getBurnedCountForLevel(nextLevel);
  state.targetLevel = nextLevel;

  state.burnOrder.slice(fromCount, toCount).forEach((characterIndex, burnIndex) => {
    const delay = getIrregularDelay(burnIndex);
    BURN_STATES.forEach((burnState, stateIndex) => {
      state.timers.push(window.setTimeout(() => {
        state.burnedIndexes.add(characterIndex);
        state.activeBurnStateByIndex = {
          ...(state.activeBurnStateByIndex || {}),
          [characterIndex]: burnState
        };
        renderBurnText(state.currentElement, state);
      }, delay + stateIndex * BURN_STEP_MS));
    });
  });

  const totalDelay = getIrregularDelay(Math.max(0, toCount - fromCount - 1)) + BURN_STATES.length * BURN_STEP_MS;
  state.timers.push(window.setTimeout(() => {
    state.activeBurnStateByIndex = {};
    setBurnLevel(state, nextLevel);
    renderBurnText(state.currentElement, state);
  }, totalDelay + 20));
}

function setBurnLevel(state, level) {
  cancelBurnTimers(state);
  state.targetLevel = level;
  state.activeBurnStateByIndex = {};
  state.burnedIndexes = new Set(state.burnOrder.slice(0, getBurnedCountForLevel(level)));
}

function renderBurnText(element, state) {
  element.classList.add("more-toast-status");
  element.replaceChildren(...MORE_TOAST_TEXT.split("").map((character, index) => {
    const span = document.createElement("span");
    const activeBurnState = state.activeBurnStateByIndex?.[index];
    const burned = state.burnedIndexes.has(index);
    span.className = [
      "more-toast-char",
      activeBurnState?.className || (burned ? "burn-gone" : "")
    ].filter(Boolean).join(" ");
    span.textContent = activeBurnState?.text ?? (burned ? "" : character);
    return span;
  }));
}

function getBurnLevel(paperCount) {
  const count = Number(paperCount) || 0;
  if (count <= 0) {
    return 0;
  }
  if (count === 1) {
    return 1;
  }
  return 2;
}

function getBurnedCountForLevel(level) {
  if (level <= 0) {
    return 0;
  }
  if (level === 1) {
    return Math.ceil(burnableIndexes.length / 2);
  }
  return burnableIndexes.length;
}

function cancelBurnTimers(state) {
  state.timers.forEach((timer) => window.clearTimeout(timer));
  state.timers = [];
}

function createBurnOrder() {
  const indexes = [...burnableIndexes];
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes;
}

function getIrregularDelay(index) {
  const base = index * 74;
  const jitter = ((index * 41) % 79) - 39;
  return Math.max(0, base + jitter);
}
