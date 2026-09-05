import {
  LABEL_STORE,
  PAPER_LABEL_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

const DEFAULT_LABEL_COLORS = ["#eef2f7", "#e8f3ee", "#f2eee8", "#edf1fb", "#f3eef6", "#f5f1dc"];

export async function listLabels() {
  const db = await openPaperDatabase();
  const labels = await getAllFromStore(db, LABEL_STORE);
  return labels.sort(compareLabels);
}

export async function createLabel({ name, color } = {}) {
  const normalizedName = normalizeLabelName(name);
  if (!normalizedName) {
    throw new Error("Label name is required.");
  }

  const db = await openPaperDatabase();
  const existingLabels = await getAllFromStore(db, LABEL_STORE);
  const duplicate = existingLabels.find((label) => label.name.toLowerCase() === normalizedName.toLowerCase());
  if (duplicate) {
    return duplicate;
  }

  const now = Date.now();
  const label = {
    labelId: createLabelId(),
    name: normalizedName,
    color: normalizeLabelColor(color) || DEFAULT_LABEL_COLORS[existingLabels.length % DEFAULT_LABEL_COLORS.length],
    sortOrder: getNextSortOrder(existingLabels),
    createdAt: now,
    updatedAt: now
  };

  const transaction = db.transaction(LABEL_STORE, "readwrite");
  transaction.objectStore(LABEL_STORE).put(label);
  await transactionDone(transaction);
  return label;
}

export async function updateLabel(labelId, updates = {}) {
  if (!labelId) {
    throw new Error("Label id is required.");
  }

  const db = await openPaperDatabase();
  const existing = await requestToPromise(db.transaction(LABEL_STORE, "readonly").objectStore(LABEL_STORE).get(labelId));
  if (!existing) {
    throw new Error("Label not found.");
  }

  const name = Object.prototype.hasOwnProperty.call(updates, "name")
    ? normalizeLabelName(updates.name)
    : existing.name;
  if (!name) {
    throw new Error("Label name is required.");
  }

  const next = {
    ...existing,
    name,
    color: normalizeLabelColor(updates.color) || existing.color,
    sortOrder: Number.isFinite(Number(updates.sortOrder)) ? Number(updates.sortOrder) : existing.sortOrder,
    updatedAt: Date.now()
  };

  const transaction = db.transaction(LABEL_STORE, "readwrite");
  transaction.objectStore(LABEL_STORE).put(next);
  await transactionDone(transaction);
  return next;
}

export async function deleteLabel(labelId) {
  if (!labelId) {
    return;
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction([LABEL_STORE, PAPER_LABEL_STORE], "readwrite");
  transaction.objectStore(LABEL_STORE).delete(labelId);
  deletePaperLabelAssignments(transaction.objectStore(PAPER_LABEL_STORE), "byLabelId", labelId);
  await transactionDone(transaction);
}

export async function assignLabelToPaper(documentKey, labelId) {
  if (!documentKey || !labelId) {
    return;
  }

  const db = await openPaperDatabase();
  const label = await requestToPromise(db.transaction(LABEL_STORE, "readonly").objectStore(LABEL_STORE).get(labelId));
  if (!label) {
    throw new Error("Label not found.");
  }

  const now = Date.now();
  const transaction = db.transaction(PAPER_LABEL_STORE, "readwrite");
  transaction.objectStore(PAPER_LABEL_STORE).put({
    paperLabelId: createPaperLabelId(documentKey, labelId),
    documentKey,
    labelId,
    assignedAt: now
  });
  await transactionDone(transaction);
}

export async function removeLabelFromPaper(documentKey, labelId) {
  if (!documentKey || !labelId) {
    return;
  }

  const db = await openPaperDatabase();
  const transaction = db.transaction(PAPER_LABEL_STORE, "readwrite");
  transaction.objectStore(PAPER_LABEL_STORE).delete(createPaperLabelId(documentKey, labelId));
  await transactionDone(transaction);
}

export async function reorderLabels(labelIds) {
  if (!Array.isArray(labelIds)) {
    return [];
  }

  const db = await openPaperDatabase();
  const labels = await getAllFromStore(db, LABEL_STORE);
  const labelsById = new Map(labels.map((label) => [label.labelId, label]));
  const now = Date.now();
  const transaction = db.transaction(LABEL_STORE, "readwrite");
  const store = transaction.objectStore(LABEL_STORE);

  labelIds.forEach((labelId, index) => {
    const label = labelsById.get(labelId);
    if (label) {
      store.put({
        ...label,
        sortOrder: index + 1,
        updatedAt: now
      });
    }
  });

  await transactionDone(transaction);
  return listLabels();
}

function getAllFromStore(db, storeName) {
  return requestToPromise(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
}

function deletePaperLabelAssignments(store, indexName, value) {
  const request = store.index(indexName).openCursor(IDBKeyRange.only(value));
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    cursor.delete();
    cursor.continue();
  };
}

function compareLabels(left, right) {
  const orderDifference = (Number(left.sortOrder) || 0) - (Number(right.sortOrder) || 0);
  if (orderDifference) {
    return orderDifference;
  }

  return String(left.name || "").localeCompare(String(right.name || ""));
}

function getNextSortOrder(labels) {
  return labels.reduce((max, label) => Math.max(max, Number(label.sortOrder) || 0), 0) + 1;
}

function normalizeLabelName(name) {
  return String(name || "").replace(/\s+/g, " ").trim().slice(0, 40);
}

function normalizeLabelColor(color) {
  const value = String(color || "").trim();
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "";
}

function createLabelId() {
  return `label-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createPaperLabelId(documentKey, labelId) {
  return `${documentKey}::${labelId}`;
}
