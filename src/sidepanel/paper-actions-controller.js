import { MessageType } from "../shared/messages.js";
import {
  deleteLibraryPaperLabel,
  getLibraryPaperSummary,
  listLibraryPaperGroups,
  renameLibraryPaperLabel,
  setLibraryPaperLabels,
  setLibraryPaperStarred
} from "../storage/library-store.js";
import {
  getPaperLabels,
  normalizeLabelColumns,
  readLabelColumns,
  withLabelTone,
  withTonesForNewLabels,
  withoutLabelTone,
  writeLabelColumns
} from "../storage/label-columns.js";
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
      paper = await getLibraryPaperSummary(documentKey);
      const scope = paper?.archivedAt ? "archive" : "board";
      [paper, papers] = await Promise.all([
        Promise.resolve(paper),
        listLibraryPaperGroups({ scope })
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
      currentDocument.labelState = paper?.labelState || "live";
      currentDocument.archivedAt = paper?.archivedAt || null;
    }

    starElement.hidden = Boolean(paper?.archivedAt);
    setDocumentStarState(isStarred, Boolean(paper?.archivedAt));
    await renderDocumentLabel(currentDocument, paper, papers);
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
    if (!document?.documentKey || document.archivedAt || starSavePending) {
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

  // Every label column for this paper, each with its own multi-select control.
  async function renderDocumentLabel(paperDocument, paper, papers) {
    if (!paperDocument?.documentKey) {
      labelElement.replaceChildren();
      return;
    }

    const settings = await readLabelColumns().catch(() => normalizeLabelColumns());
    if (getCurrentDocument()?.documentKey !== paperDocument.documentKey) {
      return;
    }
    const labelPaper = {
      documentKey: paperDocument.documentKey,
      canonicalUrl: paper?.canonicalUrl || paperDocument.url || "",
      title: paper?.title || paperDocument.title || "",
      titleSource: paper?.titleSource || paperDocument.titleSource || "",
      group: paper?.group || paperDocument.group || "",
      groupTone: paper?.groupTone ?? paperDocument.groupTone ?? null,
      labels: paper?.labels || {},
      labelState: paper?.labelState || paperDocument.labelState || "live"
    };
    const scope = paper?.archivedAt ? "archive" : "board";
    const appearance = scope === "archive" || labelPaper.labelState === "dead" ? "gray" : "colored";
    labelElement.classList.toggle("multiple-label-columns", settings.columns.length > 1);
    labelElement.replaceChildren(...settings.columns.map((column) => {
      const wrapper = document.createElement("span");
      wrapper.className = "document-label-column";
      if (settings.columns.length > 1) {
        const name = document.createElement("span");
        name.className = "document-label-column-name";
        name.textContent = column.name;
        wrapper.append(name);
      }
      wrapper.append(createPaperLabelControl({
        paper: labelPaper,
        columnId: column.id,
        columnName: column.name,
        labels: getPaperLabels(labelPaper, column.id),
        options: getPaperLabelOptions(papers, { columnId: column.id, settings, appearance }),
        appearance,
        onChangeLabels: (labels) => changeLabels(labelPaper, column.id, labels, papers, settings),
        onRenameLabel: (from, to) => renameLabel(column.id, from, to, settings),
        onDeleteLabel: (name) => deleteLabel(column.id, name, settings),
        onSetLabelTone: (name, tone) => writeLabelColumns(withLabelTone(settings, column.id, name, tone)).then(refresh)
      }));
      return wrapper;
    }));
  }

  function getScope() {
    return getCurrentDocument()?.archivedAt ? "archive" : "board";
  }

  // Label edits apply one at a time, so quick toggles never overwrite each other.
  let labelChangeChain = Promise.resolve();
  function changeLabels(...args) {
    labelChangeChain = labelChangeChain.catch(() => {}).then(() => applyLabelChange(...args));
    return labelChangeChain;
  }

  async function applyLabelChange(paper, columnId, labels, papers) {
    try {
      const settings = await readLabelColumns();
      const existing = [...new Set(papers.flatMap((item) => getPaperLabels(item, columnId)))];
      const nextSettings = withTonesForNewLabels(settings, columnId, labels, existing);
      if (nextSettings !== settings) await writeLabelColumns(nextSettings);
      await setLibraryPaperLabels(paper.documentKey, columnId, labels, {
        canonicalUrl: paper.canonicalUrl,
        title: paper.title,
        titleSource: paper.titleSource
      });
      notifyLibraryPaperActivityChanged(paper.documentKey);
      await refresh();
    } catch (error) {
      onError?.(`Could not update labels.\n${error.message || String(error)}`);
      throw error;
    }
  }

  async function renameLabel(columnId, from, to, settings) {
    try {
      const documentKeys = await renameLibraryPaperLabel(columnId, from, to, { scope: getScope() });
      const tone = settings.colors?.[columnId]?.[from.toLowerCase()];
      if (Number.isInteger(tone)) {
        await writeLabelColumns(withLabelTone(withoutLabelTone(settings, columnId, from), columnId, to, tone));
      }
      documentKeys.forEach(notifyLibraryPaperActivityChanged);
      await refresh();
    } catch (error) {
      onError?.(`Could not rename label.\n${error.message || String(error)}`);
      throw error;
    }
  }

  async function deleteLabel(columnId, name, settings) {
    try {
      const documentKeys = await deleteLibraryPaperLabel(columnId, name, { scope: getScope() });
      await writeLabelColumns(withoutLabelTone(settings, columnId, name));
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
    starElement.removeAttribute("title");
    starElement.setAttribute("aria-label", currentPaperIsStarred ? "Unstar paper" : "Star paper");
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
