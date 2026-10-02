import { GOOGLE_SYNC_STATE_KEY } from "../sync/google-sync.js";

export function initializeGoogleSyncControls(onSettingsApplied = () => {}, { showSetupInstructions = false } = {}) {
  const status = document.querySelector("#googleSyncStatus");
  const account = document.querySelector("#googleSyncAccount");
  const connect = document.querySelector("#googleSyncConnect");
  const sync = document.querySelector("#googleSyncNow");
  const disconnect = document.querySelector("#googleSyncDisconnect");
  const menu = document.querySelector("#googleSyncMenu");
  const indicator = document.querySelector("#googleSyncIndicator");
  let busy = false;

  async function request(type) {
    const response = await chrome.runtime.sendMessage({ type });
    if (!response?.ok) throw new Error(response?.error || "Google sync did not respond.");
    return response.status;
  }

  function render(state) {
    account.textContent = state.account?.email || "Not connected";
    connect.hidden = Boolean(state.enabled);
    connect.disabled = busy || !state.configured;
    disconnect.hidden = !state.enabled;
    if (sync) {
      sync.hidden = !state.enabled;
      sync.disabled = busy || state.running || state.phase === "syncing";
    }
    disconnect.disabled = busy;
    const last = state.lastSyncedAt ? `Last synced ${new Date(state.lastSyncedAt).toLocaleString()}.` : "";
    status.textContent = !state.configured
      ? showSetupInstructions
        ? "Google sync needs developer setup. Follow the Google sync section in README.md, then reload the extension."
        : "Google sync is not available in this build yet."
      : state.error || (state.phase === "syncing" ? "Syncing automatically…" : state.enabled && state.pendingRevision
        ? "Changes waiting to sync automatically…" : state.enabled
        ? `${last || "Connected."} Automatic sync is on.`
        : "Connect your Google account to sync across Chrome installations.");
    status.classList.toggle("error", Boolean(state.error));
    if (indicator) {
      const phase = state.error ? "error" : busy || state.running ? "syncing"
        : !state.enabled ? "disconnected" : state.pendingRevision ? "pending"
          : state.lastSyncedAt ? "synced" : "pending";
      indicator.dataset.state = phase;
      const label = `Google sync: ${phase}${state.account?.email ? ` · ${state.account.email}` : ""}. ${status.textContent}`;
      indicator.title = label;
      indicator.setAttribute("aria-label", label);
    }
  }

  async function refresh() {
    try { render(await request("GOOGLE_SYNC_STATUS")); }
    catch (error) {
      status.textContent = error.message;
      status.classList.add("error");
      if (indicator) {
        indicator.dataset.state = "error";
        indicator.title = `Google sync: ${error.message}`;
        indicator.setAttribute("aria-label", indicator.title);
      }
    }
  }

  async function action(type) {
    busy = true;
    connect.disabled = disconnect.disabled = true;
    if (sync) sync.disabled = true;
    if (indicator) indicator.dataset.state = "syncing";
    status.textContent = type === "GOOGLE_SYNC_DISCONNECT" ? "Disconnecting…" : "Connecting and syncing…";
    try { await request(type); }
    catch (error) { status.textContent = error.message; status.classList.add("error"); }
    finally { busy = false; await refresh(); }
  }

  connect.addEventListener("click", () => { void action("GOOGLE_SYNC_CONNECT"); });
  sync?.addEventListener("click", () => { void action("GOOGLE_SYNC_NOW"); });
  disconnect.addEventListener("click", () => { void action("GOOGLE_SYNC_DISCONNECT"); });
  if (menu) {
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) {
        event.preventDefault();
        event.stopPropagation();
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[GOOGLE_SYNC_STATE_KEY]) void refresh();
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "GOOGLE_SYNC_APPLIED") onSettingsApplied();
  });
  const resume = () => { void request("GOOGLE_SYNC_RESUME").catch(() => {}); };
  window.addEventListener("online", resume);
  window.addEventListener("focus", resume);
  void refresh();
  resume();
}
