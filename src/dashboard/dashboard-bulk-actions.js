import {
  deleteLibraryPapers,
  exportLibraryPapers,
  importLibraryArchive
} from "../storage/library-archive-store.js";

export function createDashboardBulkActions({
  state,
  elements,
  getAllDisplayablePapers,
  onDeleteComplete,
  onRenderRequested,
  onRefreshAllRequested
}) {
  return {
    attachEventListeners,
    renderBulkActions,
    setEditMode,
    togglePaperSelection,
    setPaperSelected,
    getSelectedDocumentKeys
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

    elements.editButton.addEventListener("click", () => {
      setEditMode(!state.editMode);
    });

    elements.selectAllButton.addEventListener("click", () => {
      selectAllVisiblePapers();
    });

    elements.backupAllButton.addEventListener("click", () => {
      backupAllPapers().catch((error) => {
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
    const selectedCount = getSelectedDocumentKeys().length;
    const allVisibleSelected = state.papers.length > 0 && selectedCount === state.papers.length;
    elements.bulkActions.hidden = !state.editMode;
    elements.selectionSummary.textContent = `${selectedCount} selected`;
    elements.selectAllButton.textContent = allVisibleSelected ? "Clear" : "Select all";
    elements.selectAllButton.disabled = state.papers.length === 0;
    elements.backupAllButton.disabled = state.papers.length === 0;
    elements.archiveSelectedButton.disabled = selectedCount === 0;
    elements.deleteSelectedButton.disabled = selectedCount === 0;
    elements.editButton.textContent = state.editMode ? "Done" : "Edit";
    elements.editButton.classList.toggle("active", state.editMode);
  }

  function setEditMode(editMode) {
    state.editMode = Boolean(editMode);
    if (!state.editMode) {
      state.selectedDocumentKeys.clear();
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

  function selectAllVisiblePapers() {
    const visibleKeys = state.papers.map((paper) => paper.documentKey).filter(Boolean);
    const selectedVisibleCount = getSelectedDocumentKeys().length;
    const shouldSelectAll = selectedVisibleCount !== visibleKeys.length;
    state.selectedDocumentKeys.clear();

    if (shouldSelectAll) {
      for (const documentKey of visibleKeys) {
        state.selectedDocumentKeys.add(documentKey);
      }
    }

    onRenderRequested();
  }

  async function archiveSelectedPapers() {
    const selectedKeys = getSelectedDocumentKeys();
    if (!selectedKeys.length || !window.confirm(`Archive ${selectedKeys.length} selected paper(s)? This downloads a restorable archive, then removes them from the dashboard.`)) {
      return;
    }

    const archive = await exportLibraryPapers(selectedKeys);
    downloadArchiveFile(archive);
    await deleteLibraryPapers(selectedKeys);
    await afterDelete(selectedKeys);
  }

  async function deleteSelectedPapers() {
    const selectedKeys = getSelectedDocumentKeys();
    if (!selectedKeys.length || !window.confirm(`Delete ${selectedKeys.length} selected paper(s)? This removes their local markdown and conversations.`)) {
      return;
    }

    await deleteLibraryPapers(selectedKeys);
    await afterDelete(selectedKeys);
  }

  async function backupAllPapers() {
    const papers = await getAllDisplayablePapers();
    const documentKeys = papers.map((paper) => paper.documentKey).filter(Boolean);
    if (!documentKeys.length) {
      return;
    }

    const archive = await exportLibraryPapers(documentKeys);
    downloadArchiveFile(archive, "backup");
  }

  async function importArchiveFile(file) {
    if (!file) {
      return;
    }

    const archive = JSON.parse(await file.text());
    const result = await importLibraryArchive(archive);
    state.selectedDocumentKeys.clear();
    await onRefreshAllRequested();
    const summary = `Added ${result.importedPaperCount} papers · skipped ${result.skippedPaperCount} existing`;
    elements.summary.textContent = summary;
    window.alert(`Import complete.\n${summary}`);
  }

  async function afterDelete(documentKeys) {
    setEditMode(false);
    await onDeleteComplete(documentKeys);
  }

  function getSelectedDocumentKeys() {
    const visibleKeys = new Set(state.papers.map((paper) => paper.documentKey));
    return [...state.selectedDocumentKeys].filter((documentKey) => visibleKeys.has(documentKey));
  }
}

function downloadArchiveFile(archive, kind = "archive") {
  const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `reading-dashboard-${kind}-${date}-${archive.documentKeys.length}-papers.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
