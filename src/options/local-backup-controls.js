import { exportLocalBackup, restoreLocalBackup } from "../storage/local-backup-store.js";

export function initializeLocalBackupControls(onRestored) {
  const exportButton = document.querySelector("#exportLocalBackup");
  const restoreButton = document.querySelector("#restoreLocalBackup");
  const fileInput = document.querySelector("#localBackupFile");
  const status = document.querySelector("#localBackupStatus");

  function showStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle("error", error);
  }

  exportButton.addEventListener("click", async () => {
    exportButton.disabled = true;
    showStatus("Preparing full backup…");
    try {
      const backup = await exportLocalBackup();
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `papertoaster-full-backup-${Date.now()}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showStatus("Backup download started. Check that the JSON file was saved before changing installations.");
    } catch (error) {
      showStatus(error.message || String(error), true);
    } finally {
      exportButton.disabled = false;
    }
  });

  restoreButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    restoreButton.disabled = true;
    showStatus("Restoring full backup…");
    try {
      const result = await restoreLocalBackup(JSON.parse(await file.text()));
      showStatus(`Restored ${result.imported} records; kept ${result.skipped} existing records.`);
      onRestored();
    } catch (error) {
      showStatus(error.message || String(error), true);
    } finally {
      restoreButton.disabled = false;
      fileInput.value = "";
    }
  });
}
