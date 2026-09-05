import { MessageType } from "../shared/messages.js";
import { getLibraryPaperSummary, setLibraryPaperStarred } from "../storage/library-store.js";

export function createPaperActionsController({
  starElement,
  getCurrentDocument,
  onDiagnostic,
  onError
}) {
  let currentPaperStarred = false;
  let starSavePending = false;

  starElement.addEventListener("click", toggleCurrentDocumentStar);

  async function render(document) {
    const documentKey = document?.documentKey || "";
    if (!documentKey) {
      setDocumentStarState(false, true);
      return;
    }

    let starred = Boolean(document.starred);
    try {
      const paper = await getLibraryPaperSummary(documentKey);
      if (getCurrentDocument()?.documentKey !== documentKey) {
        return;
      }
      starred = Boolean(paper?.starred);
    } catch (error) {
      onDiagnostic?.(`Paper star read skipped: ${error.message || String(error)}`);
    }

    const currentDocument = getCurrentDocument();
    if (currentDocument?.documentKey === documentKey) {
      currentDocument.starred = starred;
    }

    setDocumentStarState(starred, false);
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

    const nextStarred = !currentPaperStarred;
    starSavePending = true;
    setDocumentStarState(nextStarred, false);
    try {
      await setLibraryPaperStarred(document.documentKey, nextStarred, {
        canonicalUrl: document.url,
        title: document.title,
        titleSource: document.titleSource
      });
      document.starred = nextStarred;
      notifyLibraryPaperActivityChanged(document.documentKey);
    } catch (error) {
      setDocumentStarState(!nextStarred, false);
      onError?.(`Could not update star.\n${error.message || String(error)}`);
    } finally {
      starSavePending = false;
    }
  }

  function setDocumentStarState(starred, disabled) {
    currentPaperStarred = Boolean(starred);
    starElement.disabled = Boolean(disabled);
    starElement.classList.toggle("starred", currentPaperStarred);
    starElement.title = currentPaperStarred ? "Unstar paper" : "Star paper";
    starElement.setAttribute("aria-label", starElement.title);
    starElement.setAttribute("aria-pressed", String(currentPaperStarred));
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
