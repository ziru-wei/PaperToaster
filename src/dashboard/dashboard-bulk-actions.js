import {
  deleteLibraryRecords,
  exportLibraryRecords,
  importLibraryArchive
} from "../storage/library-archive-store.js";

export function createDashboardBulkActions({
  state,
  elements,
  onGetClearUnaskedSelection,
  onDeleteComplete,
  onRenderRequested,
  onRefreshAllRequested
}) {
  return {
    attachEventListeners,
    renderBulkActions,
    setManageMode,
    togglePaperSelection,
    setPaperSelected,
    toggleComparisonSelection,
    setComparisonSelected,
    getSelectedDocumentKeys,
    getSelectedComparisonIds
  };

  function attachEventListeners() {
    elements.importButton.addEventListener("click", () => {
      elements.importFile.click();
    });

    elements.importFile.addEventListener("change", () => {
      importArchiveFile(elements.importFile.files?.[0]).catch((error) => {
        elements.summary.textContent = `Could not import archive: ${error.message || String(error)}`;
      }).finally(() => {
        elements.importFile.value = "";
      });
    });

    elements.manageButton.addEventListener("click", () => {
      setManageMode(!state.manageMode);
    });

    elements.selectAllButton.addEventListener("click", () => {
      selectAllVisiblePapers();
    });

    elements.clearUnaskedButton.addEventListener("click", () => {
      clearUnaskedPapers().catch((error) => {
        elements.summary.textContent = `Could not clear unasked papers: ${error.message || String(error)}`;
      });
    });

    elements.backupSelectedButton.addEventListener("click", () => {
      backupSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not back up papers: ${error.message || String(error)}`;
      });
    });

    elements.archiveSelectedButton.addEventListener("click", () => {
      archiveSelectedPapers().catch((error) => {
        elements.summary.textContent = `Could not archive papers: ${error.message || String(error)}`;
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
    elements.bulkActions.hidden = !state.manageMode;
    elements.selectionSummary.textContent = `${selectedCount} selected`;
    elements.importButton.hidden = hasSelection;
    elements.selectAllButton.hidden = hasSelection;
    elements.clearUnaskedButton.hidden = hasSelection;
    elements.backupSelectedButton.hidden = !hasSelection;
    elements.archiveSelectedButton.hidden = !hasSelection;
    elements.deleteSelectedButton.hidden = !hasSelection;
    elements.selectAllButton.textContent = "Select all";
    elements.selectAllButton.disabled = state.papers.length === 0 && state.comparisons.length === 0;
    elements.clearUnaskedButton.disabled = false;
    elements.backupSelectedButton.disabled = selectedCount === 0;
    elements.archiveSelectedButton.disabled = selectedCount === 0;
    elements.deleteSelectedButton.disabled = selectedCount === 0;
    elements.manageButton.classList.toggle("active", state.manageMode);
    elements.manageButton.setAttribute("aria-label", state.manageMode ? "Done managing papers" : "Manage papers");
    elements.manageButton.setAttribute("aria-pressed", String(state.manageMode));
  }

  function setManageMode(manageMode) {
    state.manageMode = Boolean(manageMode);
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
    if (!selectedCount || !window.confirm(`Archive ${selectedCount} selected record(s)? This downloads a restorable archive, then removes them from the dashboard.`)) {
      return;
    }

    const archive = await exportLibraryRecords(selection);
    downloadArchiveFile(archive);
    await deleteLibraryRecords(selection);
    await afterDelete(selection);
  }

  async function deleteSelectedPapers() {
    const selection = getSelectedRecords();
    const selectedCount = selection.documentKeys.length + selection.comparisonIds.length;
    if (!selectedCount || !window.confirm(`Delete ${selectedCount} selected record(s)? This removes their local conversations and cached records.`)) {
      return;
    }

    await deleteLibraryRecords(selection);
    await afterDelete(selection);
  }

  async function clearUnaskedPapers() {
    const selection = await Promise.resolve(onGetClearUnaskedSelection?.());
    const documentKeys = Array.isArray(selection?.documentKeys) ? selection.documentKeys : [];
    if (!documentKeys.length) {
      window.alert("No unasked standalone papers to clear.");
      return;
    }

    if (!window.confirm(`Clear ${documentKeys.length} unasked standalone paper(s)? This removes local paper records with no Q&A history and leaves comparative readings untouched.`)) {
      return;
    }

    await deleteLibraryRecords({
      documentKeys,
      comparisonIds: []
    });
    await afterDelete({
      documentKeys,
      comparisonIds: []
    });
  }

  async function backupSelectedPapers() {
    const selection = getSelectedRecords();
    if (!selection.documentKeys.length && !selection.comparisonIds.length) {
      return;
    }

    const archive = await exportLibraryRecords(selection);
    downloadArchiveFile(archive, "backup");
  }

  async function importArchiveFile(file) {
    if (!file) {
      return;
    }

    const archive = JSON.parse(await file.text());
    const result = await importLibraryArchive(archive);
    state.selectedDocumentKeys.clear();
    state.selectedComparisonIds.clear();
    await onRefreshAllRequested();
    const summary = `Added ${result.importedPaperCount} papers · ${result.comparisonCount} comparisons · skipped ${result.skippedPaperCount} existing`;
    elements.summary.textContent = summary;
    window.alert(`Import complete.\n${summary}`);
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

function downloadArchiveFile(archive, kind = "archive") {
  const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  const paperCount = archive.documentKeys?.length || 0;
  const comparisonCount = archive.comparisonIds?.length || 0;
  link.download = `reading-dashboard-${kind}-${date}-${paperCount}-papers-${comparisonCount}-comparisons.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
