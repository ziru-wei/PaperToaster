import { MessageType } from "../shared/messages.js";
import {
  deleteLibraryPaperGroup,
  getLibraryPaperSummary,
  listLibraryPaperGroups,
  renameLibraryPaperGroup,
  setLibraryPaperGroup,
  setLibraryPaperStarred
} from "../storage/library-store.js";
import {
  createPaperLabelControl,
  getPaperLabelOptions
} from "../components/paper-label-control.js";

export function createPaperActionsController({
  starElement,
  labelElement,
  getCurrentDocument,
  onDiagnostic,
  onError
}) {
  let currentPaperIsStarred = false;
  let starSavePending = false;

  starElement.addEventListener("click", toggleCurrentDocumentStar);

  async function render(document) {
    const documentKey = document?.documentKey || "";
    if (!documentKey) {
      setDocumentStarState(false, true);
      labelElement.replaceChildren();
      return;
    }

    let isStarred = Boolean(document.isStarred);
    let paper = null;
    let papers = [];
    try {
      [paper, papers] = await Promise.all([
        getLibraryPaperSummary(documentKey),
        listLibraryPaperGroups()
      ]);
      if (getCurrentDocument()?.documentKey !== documentKey) {
        return;
      }
      isStarred = Boolean(paper?.isStarred);
    } catch (error) {
      onDiagnostic?.(`Paper star read skipped: ${error.message || String(error)}`);
    }

    const currentDocument = getCurrentDocument();
    if (currentDocument?.documentKey === documentKey) {
      currentDocument.isStarred = isStarred;
      currentDocument.group = paper?.group || "";
      currentDocument.groupTone = paper?.groupTone ?? null;
    }

    setDocumentStarState(isStarred, false);
    renderDocumentLabel(currentDocument, paper, papers);
  }

  async function refresh() {
    const document = getCurrentDocument();
    if (!document?.documentKey) {
      return;
    }

    await render(document);
  }

  async function toggleCurrentDocumentStar() {
    const document = getCurrentDocument();
    if (!document?.documentKey || starSavePending) {
      return;
    }

    const nextIsStarred = !currentPaperIsStarred;
    starSavePending = true;
    setDocumentStarState(nextIsStarred, false);
    try {
      await setLibraryPaperStarred(document.documentKey, nextIsStarred, {
        canonicalUrl: document.url,
        title: document.title,
        titleSource: document.titleSource
      });
      document.isStarred = nextIsStarred;
      notifyLibraryPaperActivityChanged(document.documentKey);
    } catch (error) {
      setDocumentStarState(!nextIsStarred, false);
      onError?.(`Could not update star.\n${error.message || String(error)}`);
    } finally {
      starSavePending = false;
    }
  }

  function renderDocumentLabel(document, paper, papers) {
    if (!document?.documentKey) {
      labelElement.replaceChildren();
      return;
    }

    const labelPaper = {
      documentKey: document.documentKey,
      canonicalUrl: paper?.canonicalUrl || document.url || "",
      title: paper?.title || document.title || "",
      titleSource: paper?.titleSource || document.titleSource || "",
      group: paper?.group || document.group || "",
      groupTone: paper?.groupTone ?? document.groupTone ?? null
    };
    const groupOptions = getPaperLabelOptions(papers);
    labelElement.replaceChildren(createPaperLabelControl({
      paper: labelPaper,
      groupOptions,
      onUpdatePaperGroup: updatePaperGroup,
      onRenamePaperGroup: renamePaperGroup,
      onDeletePaperGroup: deletePaperGroup
    }));
  }

  async function updatePaperGroup(paper, group) {
    try {
      await setLibraryPaperGroup(paper.documentKey, group, {
        canonicalUrl: paper.canonicalUrl,
        title: paper.title,
        titleSource: paper.titleSource
      });
      notifyLibraryPaperActivityChanged(paper.documentKey);
      await refresh();
    } catch (error) {
      onError?.(`Could not update label.\n${error.message || String(error)}`);
      throw error;
    }
  }

  async function renamePaperGroup(oldGroup, newGroup) {
    try {
      const documentKeys = await renameLibraryPaperGroup(oldGroup, newGroup);
      documentKeys.forEach(notifyLibraryPaperActivityChanged);
      await refresh();
    } catch (error) {
      onError?.(`Could not rename label.\n${error.message || String(error)}`);
      throw error;
    }
  }

  async function deletePaperGroup(group) {
    try {
      const documentKeys = await deleteLibraryPaperGroup(group);
      documentKeys.forEach(notifyLibraryPaperActivityChanged);
      await refresh();
    } catch (error) {
      onError?.(`Could not delete label.\n${error.message || String(error)}`);
      throw error;
    }
  }

  function setDocumentStarState(isStarred, disabled) {
    currentPaperIsStarred = Boolean(isStarred);
    starElement.disabled = Boolean(disabled);
    starElement.classList.toggle("starred", currentPaperIsStarred);
    starElement.title = currentPaperIsStarred ? "Unstar paper" : "Star paper";
    starElement.setAttribute("aria-label", starElement.title);
    starElement.setAttribute("aria-pressed", String(currentPaperIsStarred));
  }

  return {
    render,
    refresh
  };
}

export function notifyLibraryPaperActivityChanged(documentKey) {
  if (!documentKey) {
    return;
  }

  chrome.runtime.sendMessage({
    type: MessageType.LIBRARY_PAPER_ACTIVITY_CHANGED,
    documentKey
  }).catch(() => {
    // Dashboard may be closed; it will refresh from storage next time.
  });
}
