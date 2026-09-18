import {
  deleteLibraryRecords,
  exportLibraryRecords
} from "../storage/library-archive-store.js";
import {
  archiveLibraryRecords,
  restoreLibraryRecords
} from "../storage/library-lifecycle-store.js";

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
    setManageMode,
    togglePaperSelection,
    setPaperSelection,
    toggleComparisonSelection,
    getSelectedDocumentKeys,
    getSelectedComparisonIds
  };

  function attachEventListeners() {
    elements.manageButton.addEventListener("click", () => {
      setManageMode(!state.manageMode);
    });

    elements.selectAllButton.addEventListener("click", () => {
      selectAllVisiblePapers();
    });

    elements.sendToMachineButton.addEventListener("click", () => {
      sendSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not send papers: ${error.message || String(error)}`;
      });
    });

    elements.archiveSelectedButton.addEventListener("click", () => {
      archiveSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not archive papers: ${error.message || String(error)}`;
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

    elements.deleteSelectedButton.addEventListener("click", () => {
      deleteSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not delete papers: ${error.message || String(error)}`;
      });
    });
  }

  function renderBulkActions() {
    const selectedDocumentKeys = getSelectedDocumentKeys();
    const selectedComparisonIds = getSelectedComparisonIds();
    const selectedCount = selectedDocumentKeys.length + selectedComparisonIds.length;
    const hasSelection = selectedCount > 0;
    elements.bulkActions.classList.toggle("is-hidden", !state.manageMode);
    elements.bulkActions.setAttribute("aria-hidden", String(!state.manageMode));
    elements.selectionSummary.textContent = `${selectedCount} selected`;
    elements.selectAllButton.hidden = hasSelection;
    const archiveView = state.libraryView === "archive";
    elements.sendToMachineButton.hidden = archiveView || selectedDocumentKeys.length === 0;
    elements.archiveSelectedButton.hidden = archiveView || !hasSelection;
    elements.restoreSelectedButton.hidden = !archiveView || !hasSelection;
    elements.exportSelectedButton.hidden = !archiveView || !hasSelection;
    elements.deleteSelectedButton.hidden = !hasSelection;
    elements.selectAllButton.textContent = "Select all";
    elements.selectAllButton.disabled = state.papers.length === 0 && state.comparisons.length === 0;
    elements.sendToMachineButton.disabled = selectedDocumentKeys.length === 0;
    elements.archiveSelectedButton.disabled = selectedCount === 0;
    elements.restoreSelectedButton.disabled = selectedCount === 0;
    elements.exportSelectedButton.disabled = selectedCount === 0;
    elements.deleteSelectedButton.disabled = selectedCount === 0;
    elements.manageButton.classList.toggle("active", state.manageMode);
    elements.manageButton.setAttribute("aria-label", state.manageMode ? "Done selecting papers" : "Select papers");
    elements.manageButton.setAttribute("aria-pressed", String(state.manageMode));
  }

  function setManageMode(manageMode) {
    const nextManageMode = Boolean(manageMode);
    if (nextManageMode && !state.manageMode) {
      if (state.activeDocumentKey) {
        state.selectedDocumentKeys.add(state.activeDocumentKey);
      } else if (state.activeComparisonId) {
        state.selectedComparisonIds.add(state.activeComparisonId);
      }
    }
    state.manageMode = nextManageMode;
    if (!state.manageMode) {
      state.selectedDocumentKeys.clear();
      state.selectedComparisonIds.clear();
    }

    onRenderRequested();
  }

  function togglePaperSelection(documentKey) {
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
    onRenderRequested();
  }

  function toggleComparisonSelection(comparisonId) {
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

    onRenderRequested();
  }

  function selectAllVisiblePapers() {
    const visibleKeys = state.papers.map((paper) => paper.documentKey).filter(Boolean);
    const visibleComparisonIds = state.comparisons.map((comparison) => comparison.comparisonId).filter(Boolean);
    state.selectedDocumentKeys.clear();
    state.selectedComparisonIds.clear();

    for (const documentKey of visibleKeys) {
      state.selectedDocumentKeys.add(documentKey);
    }
    for (const comparisonId of visibleComparisonIds) {
      state.selectedComparisonIds.add(comparisonId);
    }

    onRenderRequested();
  }

  async function archiveSelectedPapers() {
    const selection = getSelectedRecords();
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
    const selection = getSelectedRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    const confirmation = state.libraryView === "archive"
      ? `Burn ${selectedCount} papers? This can't be recovered`
      : `Delete ${selectedCount} selected record(s)? This removes their local conversations and cached records.`;
    if (!selectedCount || !window.confirm(confirmation)) {
      return;
    }

    const result = await deleteLibraryRecords(selection);
    await afterDelete(selection);
    if (result.managedDocumentCleanupFailures.length) {
      elements.summary.textContent = `Papers deleted, but ${result.managedDocumentCleanupFailures.length} local Agent file cleanup(s) failed. Check the console.`;
    }
  }

  async function sendSelectedPapers() {
    const documentKeys = getSelectedDocumentKeys();
    if (!documentKeys.length) {
      return;
    }

    await onSendToMachine(documentKeys);
    setManageMode(false);
  }

  async function exportSelectedRecords() {
    const selection = getSelectedRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    if (!selectedCount || !window.confirm(`Export ${selectedCount} papers to your local storage? (this won't delete them in toaster)`)) {
      return;
    }

    const archive = await exportLibraryRecords(selection);
    downloadArchiveFile(archive);
  }

  async function afterDelete(selection) {
    setManageMode(false);
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
}

function downloadArchiveFile(archive) {
  const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  const paperCount = archive.documentKeys?.length || 0;
  const comparisonCount = archive.comparisonIds?.length || 0;
  link.download = `paper-toaster-export-${date}-${paperCount}-papers-${comparisonCount}-comparisons.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
