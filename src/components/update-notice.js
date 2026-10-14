import { onPaperDatabaseOutdated } from "../storage/paper-database.js";

// "Later" hides the notice; it comes back after this long while the view stays outdated.
const REMIND_AFTER_MS = 30 * 60 * 1000;

// Shows a notice when another view has upgraded Paper Toaster's data. The person
// picks when to reload: this view keeps working on the newer data meanwhile.
export function initializeUpdateNotice() {
  let notice = null;
  let remindTimer = 0;

  const show = () => {
    if (notice?.isConnected) return;
    notice = document.createElement("div");
    notice.className = "update-notice";
    notice.setAttribute("role", "status");

    const message = document.createElement("span");
    message.className = "update-notice-message";
    message.textContent = "Paper Toaster was updated. Reload this view to use the new version.";

    const later = document.createElement("button");
    later.type = "button";
    later.className = "update-notice-button";
    later.textContent = "Later";
    later.addEventListener("click", () => {
      notice.remove();
      window.clearTimeout(remindTimer);
      remindTimer = window.setTimeout(show, REMIND_AFTER_MS);
    });

    const reload = document.createElement("button");
    reload.type = "button";
    reload.className = "update-notice-button primary";
    reload.textContent = "Reload";
    reload.addEventListener("click", () => location.reload());

    notice.append(message, later, reload);
    document.body.append(notice);
  };

  onPaperDatabaseOutdated(show);
}
