const THREAD_WHEEL_VISIBLE_COUNT = 5;
const THREAD_WHEEL_ANGLE_STEP = 10;
const THREAD_WHEEL_EASING = 0.32;
const THREAD_WHEEL_SCROLL_PIXELS_PER_SLOT = 72;
const THREAD_WHEEL_END_OVERSCROLL_SLOTS = 1.3;

export function createThreadWheelController({
  archiveButton,
  wheelElement,
  canOpen,
  getThreads,
  getActiveThreadId,
  onSelectThread,
  onDeleteThread,
  onDiagnostic
}) {
  let open = false;
  let scroll = 0;
  let targetScroll = 0;
  let animationFrame = 0;

  archiveButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggle();
  });
  wheelElement.addEventListener("click", (event) => {
    event.stopPropagation();
    const deleteButton = event.target.closest("[data-delete-thread-id]");
    if (deleteButton) {
      const threadId = deleteButton.dataset.deleteThreadId;
      const label = deleteButton.closest(".thread-wheel-item")?.querySelector(".thread-select")?.textContent || "this thread";
      if (window.confirm(`Delete ${label}?`)) {
        runThreadAction(() => onDeleteThread(threadId));
      }
      return;
    }

    const selectButton = event.target.closest("[data-select-thread-id]");
    if (selectButton) {
      runThreadAction(() => onSelectThread(selectButton.dataset.selectThreadId));
    }
  });
  document.addEventListener("wheel", handleWheel, { passive: false });
  document.addEventListener("click", (event) => {
    if (!archiveButton.contains(event.target) && !wheelElement.contains(event.target)) {
      close();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });
  window.addEventListener("blur", close);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      close();
    }
  });

  function render() {
    const threads = getWheelThreads();
    archiveButton.disabled = !canOpen() || !threads.length;
    archiveButton.classList.toggle("active", open && threads.length > 0);
    wheelElement.hidden = !open || !threads.length;
    document.body.classList.toggle("thread-wheel-open", open && threads.length > 0);

    if (!open || !threads.length) {
      wheelElement.textContent = "";
      return;
    }

    clampScroll();
    const existingItems = new Map(Array.from(wheelElement.querySelectorAll(".thread-wheel-item"), (item) => [
      item.dataset.threadId,
      item
    ]));
    const renderedThreadIds = new Set();

    threads.forEach((thread) => {
      renderedThreadIds.add(thread.threadId);
      const item = existingItems.get(thread.threadId) || document.createElement("div");
      item.className = "thread-wheel-item";
      item.dataset.threadId = thread.threadId;
      item.classList.toggle("current", thread.threadId === getActiveThreadId());

      const selectButton = item.querySelector(".thread-select") || document.createElement("button");
      selectButton.className = "thread-chip thread-select";
      selectButton.type = "button";
      selectButton.dataset.selectThreadId = thread.threadId;
      selectButton.removeAttribute("title");
      selectButton.setAttribute("aria-label", formatThreadTitle(thread));
      renderThreadLabel(selectButton, thread);

      const deleteButton = item.querySelector(".thread-delete") || document.createElement("button");
      deleteButton.className = "thread-delete";
      deleteButton.type = "button";
      deleteButton.dataset.deleteThreadId = thread.threadId;
      deleteButton.title = "Delete conversation";
      deleteButton.setAttribute("aria-label", `Delete ${formatThreadLabel(thread)}`);
      deleteButton.textContent = "×";

      if (!item.isConnected) {
        item.append(deleteButton, selectButton);
        wheelElement.append(item);
      }
    });

    for (const item of Array.from(wheelElement.querySelectorAll(".thread-wheel-item"))) {
      if (!renderedThreadIds.has(item.dataset.threadId)) {
        item.remove();
      }
    }

    updatePositions(threads);
  }

  function toggle() {
    if (!canOpen() || !getWheelThreads().length) {
      close();
      return;
    }

    open = !open;
    clampScroll();
    render();
    startAnimation();
  }

  function close() {
    if (!open && wheelElement.hidden) {
      return;
    }

    open = false;
    render();
  }

  function setTargetScroll(offset) {
    const maxOffset = getMaxScrollOffset(getWheelThreads());
    targetScroll = Math.min(Math.max(0, offset), maxOffset);
    startAnimation();
  }

  function clampScroll() {
    const maxOffset = getMaxScrollOffset(getWheelThreads());
    scroll = Math.min(Math.max(0, scroll), maxOffset);
    targetScroll = Math.min(Math.max(0, targetScroll), maxOffset);
  }

  function startAnimation() {
    if (animationFrame) {
      return;
    }

    animationFrame = window.requestAnimationFrame(animate);
  }

  function animate() {
    animationFrame = 0;
    const threads = getWheelThreads();
    const difference = targetScroll - scroll;
    if (Math.abs(difference) < 0.002) {
      scroll = targetScroll;
      updatePositions(threads);
      return;
    }

    scroll += difference * THREAD_WHEEL_EASING;
    updatePositions(threads);
    startAnimation();
  }

  function updatePositions(threads = getWheelThreads()) {
    const items = new Map(Array.from(wheelElement.querySelectorAll(".thread-wheel-item"), (item) => [
      item.dataset.threadId,
      item
    ]));

    for (const [index, thread] of threads.entries()) {
      const item = items.get(thread.threadId);
      if (!item) {
        continue;
      }

      const position = index - scroll;
      const opacity = getThreadWheelOpacity(position);
      const isSelectable = position >= -0.05 && position < THREAD_WHEEL_VISIBLE_COUNT - 0.05;
      item.classList.toggle("visible", isSelectable);
      item.style.setProperty("--thread-wheel-angle", `${position * -THREAD_WHEEL_ANGLE_STEP}deg`);
      item.style.setProperty("--thread-wheel-opacity", String(opacity));
      item.style.zIndex = String(100 - Math.round(Math.abs(position) * 10));
    }
  }

  function handleWheel(event) {
    const threads = getWheelThreads();
    const maxOffset = getMaxScrollOffset(threads);
    if (!open || maxOffset <= 0) {
      return;
    }

    event.preventDefault();
    setTargetScroll(targetScroll + event.deltaY / THREAD_WHEEL_SCROLL_PIXELS_PER_SLOT);
  }

  async function runThreadAction(action) {
    try {
      await action();
      close();
    } catch (error) {
      onDiagnostic?.(`Conversation thread action failed: ${error.message || String(error)}`);
    }
  }

  function getWheelThreads() {
    return [...getThreads()]
      .sort((first, second) => getThreadLabelTime(second) - getThreadLabelTime(first));
  }

  return {
    render,
    close
  };
}

function getMaxScrollOffset(threads) {
  if (!threads.length || threads.length <= THREAD_WHEEL_VISIBLE_COUNT) {
    return 0;
  }

  return Math.max(0, threads.length - THREAD_WHEEL_VISIBLE_COUNT + THREAD_WHEEL_END_OVERSCROLL_SLOTS);
}

function formatThreadLabel(thread) {
  if (!thread?.messageCount) {
    return "New thread";
  }

  const parts = formatThreadTimeParts(getThreadLabelTime(thread));
  if (!parts) {
    return "Thread";
  }

  return `${parts.date}  ${parts.time}`;
}

function formatThreadTitle(thread) {
  const count = thread?.messageCount || 0;
  const messageLabel = count === 1 ? "1 message" : `${count} messages`;
  return `${formatThreadLabel(thread)} · ${messageLabel}`;
}

function renderThreadLabel(element, thread) {
  element.textContent = "";
  const count = Number(thread?.messageCount) || 0;
  if (!thread?.messageCount) {
    renderThreadDateLabel(element, "New thread", count);
    return;
  }

  const parts = formatThreadTimeParts(getThreadLabelTime(thread));
  if (!parts) {
    renderThreadDateLabel(element, "Thread", count);
    return;
  }

  const main = document.createElement("span");
  main.className = "thread-label-main";

  const date = document.createElement("span");
  date.className = "thread-label-date";
  date.textContent = parts.date;

  const time = document.createElement("span");
  time.className = "thread-label-time";
  time.textContent = parts.time;

  main.append(date, time);
  element.append(main, createThreadCountLabel(count));
}

function renderThreadDateLabel(element, text, count) {
  const main = document.createElement("span");
  main.className = "thread-label-main";

  const date = document.createElement("span");
  date.className = "thread-label-date";
  date.textContent = text;

  main.append(date);
  element.append(main, createThreadCountLabel(count));
}

function createThreadCountLabel(count) {
  const countLabel = document.createElement("span");
  countLabel.className = "thread-label-count";
  countLabel.textContent = `#${Math.max(0, Number(count) || 0)}`;
  return countLabel;
}

function formatThreadTimeParts(timestamp) {
  const date = new Date(Number(timestamp));
  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const dateLabel = isSameDate(date, now)
    ? "Today"
    : isSameDate(date, yesterday)
      ? "Yesterday"
      : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric"
      }).format(date).replace(" ", "/");
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);

  return {
    date: dateLabel,
    time: timeLabel
  };
}

function isSameDate(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function getThreadLabelTime(thread) {
  return Number(thread?.firstMessageCreatedAt || thread?.createdAt || thread?.updatedAt) || 0;
}

function getThreadWheelOpacity(position) {
  if (position < -1 || position > THREAD_WHEEL_VISIBLE_COUNT) {
    return 0;
  }

  if (position < 0) {
    return Math.max(0, 1 + position);
  }

  if (position > THREAD_WHEEL_VISIBLE_COUNT - 1) {
    return Math.max(0, THREAD_WHEEL_VISIBLE_COUNT - position);
  }

  return 1;
}
