// Firefox exposes the panel as a sidebar (sidebarAction); Chromium uses chrome.sidePanel.
// Firefox only honors sidebarAction.open() inside a user-action handler, so callers
// must invoke these before their first await.

function getSidebarAction() {
  return globalThis.browser?.sidebarAction || globalThis.chrome?.sidebarAction || null;
}

export function isSidebarActionAvailable() {
  return typeof getSidebarAction()?.open === "function";
}

export function openSidePanel(windowId) {
  const sidebarAction = getSidebarAction();
  if (typeof sidebarAction?.open === "function") {
    return sidebarAction.open();
  }

  if (typeof globalThis.chrome?.sidePanel?.open === "function" && windowId) {
    return chrome.sidePanel.open({ windowId });
  }

  return Promise.resolve();
}

export function toggleSidePanel(windowId) {
  const sidebarAction = getSidebarAction();
  if (typeof sidebarAction?.toggle === "function") {
    return sidebarAction.toggle();
  }

  return openSidePanel(windowId);
}

export function configureSidePanelBehavior() {
  if (typeof globalThis.chrome?.sidePanel?.setPanelBehavior === "function") {
    return chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }

  return Promise.resolve();
}
