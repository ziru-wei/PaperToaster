import { MessageType } from "../shared/messages.js";
import { getLibraryPaperSummary, setLibraryPaperStarred } from "../storage/library-store.js";

export function createPaperActionsController({
  starElement,
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
      return;
    }

    let isStarred = Boolean(document.isStarred);
    try {
      const paper = await getLibraryPaperSummary(documentKey);
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
    }

    setDocumentStarState(isStarred, false);
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
