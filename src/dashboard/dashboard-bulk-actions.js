import {
  deleteLibraryRecords,
  exportLibraryRecords
} from "../storage/library-archive-store.js";
import {
  archiveLibraryRecords,
  restoreLibraryRecords
} from "../storage/library-lifecycle-store.js";
import { createLibraryRecordsCsv } from "../storage/library-table-export.js";
import { chooseExportFormat } from "../components/import-destination-dialog.js";

export function createDashboardBulkActions({
  state,
  elements,
  onSendToMachine,
  onDeleteComplete,
  onRenderRequested
}) {
  return {
    attachEventListeners,
    renderBulkActions,
    sendSelectedPapers,
    archiveSelectedPapers,
    exportSelectedRecords,
    deleteSelectedPapers,
    clearSelection,
    togglePaperSelection,
    setPaperSelection,
    toggleComparisonSelection,
    getSelectedDocumentKeys,
    getSelectedComparisonIds,
    getActionableDocumentKeys,
    getActionableRecordCount
  };

  function attachEventListeners() {
    elements.sendToMachineButton.addEventListener("click", () => {
      sendSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not send papers: ${error.message || String(error)}`;
      });
    });

    elements.restoreSelectedButton.addEventListener("click", () => {
      restoreSelectedRecords().catch((error) => {
        elements.summary.textContent = `Could not restore papers: ${error.message || String(error)}`;
      });
    });

    elements.exportSelectedButton.addEventListener("click", () => {
      exportSelectedRecords().catch((error) => {
        elements.summary.textContent = `Could not export papers: ${error.message || String(error)}`;
      });
    });
  }

  function renderBulkActions() {
    const selectedDocumentKeys = getSelectedDocumentKeys();
    const selectedComparisonIds = getSelectedComparisonIds();
    const selectedCount = selectedDocumentKeys.length + selectedComparisonIds.length;
    const hasSelection = selectedCount > 0;
    const actionableSelection = getActionableRecords();
    const actionableCount = actionableSelection.documentKeys.length + actionableSelection.comparisonIds.length;
    const hasActionableRecord = actionableCount > 0;
    const archiveView = state.libraryView === "archive";
    const showPromptRow = !archiveView || hasActionableRecord;
    elements.bulkActions.classList.toggle("is-hidden", !showPromptRow);
    elements.bulkActions.setAttribute("aria-hidden", String(!showPromptRow));
    elements.selectionSummary.hidden = !hasActionableRecord;
    elements.selectionSummary.textContent = `${actionableCount} selected`;
    elements.sendToMachineButton.hidden = archiveView || selectedDocumentKeys.length === 0;
    elements.restoreSelectedButton.hidden = !archiveView || !hasSelection;
    elements.exportSelectedButton.hidden = !archiveView || !hasSelection;
    elements.sendToMachineButton.disabled = selectedDocumentKeys.length === 0;
    elements.restoreSelectedButton.disabled = selectedCount === 0;
    elements.exportSelectedButton.disabled = selectedCount === 0;
    elements.sendToMachinePrompt.hidden = archiveView || actionableSelection.documentKeys.length === 0;
    elements.archiveSelectedPrompt.hidden = archiveView || !hasActionableRecord;
    elements.exportSelectedPrompt.hidden = !hasActionableRecord;
    elements.deleteSelectedPrompt.hidden = !hasActionableRecord;
    renderShortcutPrompt(elements.sendToMachinePrompt, "↵", "Enter", "Send to Machine");
    renderShortcutPrompt(
      elements.archiveSelectedPrompt,
      "⇧ ↓",
      "Shift + Arrow Down",
      "Archive"
    );
    renderShortcutPrompt(elements.exportSelectedPrompt, "⌘ ↓", "Command + Arrow Down", "Export");
    renderShortcutPrompt(elements.deleteSelectedPrompt, "⌫", "Backspace", archiveView ? "Burn" : "Delete");
    state.manageMode = hasSelection;
  }

  function clearSelection() {
    state.selectedDocumentKeys.clear();
    state.selectedComparisonIds.clear();
    state.manageMode = false;
    onRenderRequested();
  }

  function seedActiveSelectionIfEmpty() {
    if (state.selectedDocumentKeys.size > 0 || state.selectedComparisonIds.size > 0) {
      return;
    }

    if (state.activeDocumentKey) {
      state.selectedDocumentKeys.add(state.activeDocumentKey);
    } else if (state.activeComparisonId) {
      state.selectedComparisonIds.add(state.activeComparisonId);
    }
  }

  function togglePaperSelection(documentKey) {
    seedActiveSelectionIfEmpty();
    setPaperSelected(documentKey, !state.selectedDocumentKeys.has(documentKey));
  }

  function setPaperSelected(documentKey, selected) {
    if (!documentKey) {
      return;
    }

    if (selected) {
      state.selectedDocumentKeys.add(documentKey);
    } else {
      state.selectedDocumentKeys.delete(documentKey);
    }

    state.manageMode = state.selectedDocumentKeys.size > 0 || state.selectedComparisonIds.size > 0;
    onRenderRequested();
  }

  function setPaperSelection(documentKeys, selected) {
    const keys = Array.isArray(documentKeys) ? documentKeys : [];
    keys.forEach((documentKey) => {
      if (!documentKey) {
        return;
      }
      if (selected) {
        state.selectedDocumentKeys.add(documentKey);
      } else {
        state.selectedDocumentKeys.delete(documentKey);
      }
    });
    state.manageMode = state.selectedDocumentKeys.size > 0 || state.selectedComparisonIds.size > 0;
    onRenderRequested();
  }

  function toggleComparisonSelection(comparisonId) {
    seedActiveSelectionIfEmpty();
    setComparisonSelected(comparisonId, !state.selectedComparisonIds.has(comparisonId));
  }

  function setComparisonSelected(comparisonId, selected) {
    if (!comparisonId) {
      return;
    }

    if (selected) {
      state.selectedComparisonIds.add(comparisonId);
    } else {
      state.selectedComparisonIds.delete(comparisonId);
    }

    state.manageMode = state.selectedDocumentKeys.size > 0 || state.selectedComparisonIds.size > 0;
    onRenderRequested();
  }

  async function archiveSelectedPapers() {
    const selection = getActionableRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    if (!selectedCount || !window.confirm("Archive the paper?")) {
      return;
    }

    await archiveLibraryRecords(selection);
    await afterDelete(selection);
  }

  async function restoreSelectedRecords() {
    const selection = getSelectedRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    if (!selectedCount || !window.confirm(`Restore ${selectedCount} papers to the board?`)) {
      return;
    }

    await restoreLibraryRecords(selection);
    await afterDelete(selection);
  }

  async function deleteSelectedPapers() {
    const selection = getActionableRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    const confirmation = state.libraryView === "archive"
      ? `Burn ${selectedCount} papers? This can't be recovered`
      : `Delete ${selectedCount} selected record(s)? This removes their local conversations and cached records.`;
    if (!selectedCount || !window.confirm(confirmation)) {
      return;
    }

    const result = await deleteLibraryRecords(selection);
    await afterDelete(selection);
    const cleanupFailureCount = result.managedDocumentCleanupFailures.length + (result.agentSessionCleanupFailures?.length || 0);
    if (cleanupFailureCount) {
      elements.summary.textContent = `Records deleted, but ${cleanupFailureCount} local Agent cleanup(s) are pending or failed. Check the console.`;
    }
  }

  async function sendSelectedPapers() {
    const documentKeys = getActionableDocumentKeys();
    if (!documentKeys.length) {
      return;
    }

    await onSendToMachine(documentKeys);
    clearSelection();
  }

  async function exportSelectedRecords() {
    const selection = getActionableRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    if (!selectedCount) {
      return;
    }

    const format = await chooseExportFormat(selectedCount);
    if (!format) {
      return;
    }
    const archive = await exportLibraryRecords(selection);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filenameStem = createExportFilenameStem(archive, timestamp);
    if (format === "table" || format === "both") {
      downloadFile({
        contents: createLibraryRecordsCsv(archive, selection),
        type: "text/csv;charset=utf-8",
        filename: `${filenameStem}.csv`
      });
    }
    if (format === "re-importable" || format === "both") {
      downloadFile({
        contents: JSON.stringify(archive, null, 2),
        type: "application/json",
        filename: `${filenameStem}.json`
      });
    }
  }

  async function afterDelete(selection) {
    clearSelection();
    await onDeleteComplete(selection);
  }

  function getSelectedDocumentKeys() {
    const visibleKeys = new Set(state.papers.map((paper) => paper.documentKey));
    return [...state.selectedDocumentKeys].filter((documentKey) => visibleKeys.has(documentKey));
  }

  function getSelectedComparisonIds() {
    const visibleIds = new Set(state.comparisons.map((comparison) => comparison.comparisonId));
    return [...state.selectedComparisonIds].filter((comparisonId) => visibleIds.has(comparisonId));
  }

  function getSelectedRecords() {
    return {
      documentKeys: getSelectedDocumentKeys(),
      comparisonIds: getSelectedComparisonIds()
    };
  }

  function getActionableRecordCount() {
    const selection = getActionableRecords();
    return selection.documentKeys.length + selection.comparisonIds.length;
  }

  function getActionableDocumentKeys() {
    return getActionableRecords().documentKeys;
  }

  function getActionableRecords() {
    const selection = getSelectedRecords();
    if (selection.documentKeys.length || selection.comparisonIds.length) {
      return selection;
    }

    const activeDocumentKey = String(state.activeDocumentKey || "").trim();
    if (activeDocumentKey && state.papers.some((paper) => paper.documentKey === activeDocumentKey)) {
      return { documentKeys: [activeDocumentKey], comparisonIds: [] };
    }

    const activeComparisonId = String(state.activeComparisonId || "").trim();
    if (activeComparisonId && state.comparisons.some((comparison) => comparison.comparisonId === activeComparisonId)) {
      return { documentKeys: [], comparisonIds: [activeComparisonId] };
    }

    return selection;
  }
}

function renderShortcutPrompt(paragraph, symbol, keyLabel, actionLabel) {
  paragraph.replaceChildren();
  const kbd = document.createElement("kbd");
  kbd.textContent = symbol;
  kbd.setAttribute("aria-label", keyLabel);
  paragraph.append(kbd, ` ${actionLabel}`);
}

function downloadFile({ contents, type, filename }) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createExportFilenameStem(archive, timestamp) {
  const paperCount = archive.documentKeys?.length || 0;
  const comparisonCount = archive.comparisonIds?.length || 0;
  return `paper-toaster-export-${timestamp}-${paperCount}-papers-${comparisonCount}-comparisons`;
}
