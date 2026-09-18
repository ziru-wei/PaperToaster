import {
  COMPARISON_MESSAGE_STORE,
  COMPARISON_SESSION_STORE,
  CONVERSATION_MESSAGE_STORE,
  CONVERSATION_THREAD_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";
import { normalizeSavedQaPerPaperLimit } from "./saved-qa-settings-store.js";

export async function setConversationAnswerSaved({ documentKey, threadId, sequence, saved, perPaperLimit }) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  const normalizedThreadId = String(threadId || "").trim();
  const normalizedSequence = normalizeSequence(sequence);
  if (!normalizedDocumentKey || !normalizedThreadId || normalizedSequence === null) {
    return createResult("not-found", [], [], perPaperLimit);
  }

  const limit = normalizeSavedQaPerPaperLimit(perPaperLimit);
  const db = await openPaperDatabase();
  const transaction = db.transaction([
    CONVERSATION_MESSAGE_STORE,
    CONVERSATION_THREAD_STORE,
    COMPARISON_MESSAGE_STORE
  ], "readwrite");
  const messages = transaction.objectStore(CONVERSATION_MESSAGE_STORE);
  const threads = transaction.objectStore(CONVERSATION_THREAD_STORE);
  const comparisonMessages = transaction.objectStore(COMPARISON_MESSAGE_STORE);
  const targetRequest = messages.get(createConversationMessageId(normalizedThreadId, normalizedSequence));
  const threadRequest = threads.get(normalizedThreadId);
  const directCountRequest = messages.index("bySavedDocumentKey").count(normalizedDocumentKey);
  const comparisonCountRequest = comparisonMessages.index("bySavedDocumentKey").count(normalizedDocumentKey);
  const [target, thread, directCount, comparisonCount] = await Promise.all([
    requestToPromise(targetRequest),
    requestToPromise(threadRequest),
    requestToPromise(directCountRequest),
    requestToPromise(comparisonCountRequest)
  ]);

  if (!isConversationTarget(target, normalizedDocumentKey, normalizedThreadId)) {
    transaction.abort();
    return createResult("not-found", [normalizedDocumentKey], [], limit);
  }

  const nextSaved = Boolean(saved);
  if (nextSaved && !target.isSaved && Number(directCount) + Number(comparisonCount) >= limit) {
    transaction.abort();
    return createResult("limit-reached", [normalizedDocumentKey], [normalizedDocumentKey], limit);
  }

  const now = Date.now();
  messages.put({
    ...target,
    isSaved: nextSaved,
    isPinned: nextSaved ? Boolean(target.isPinned) : false,
    savedDocumentKey: nextSaved ? normalizedDocumentKey : "",
    updatedAt: now
  });
  if (thread) {
    threads.put({ ...thread, updatedAt: now });
  }
  await transactionDone(transaction);
  return createResult(nextSaved ? "saved" : "unsaved", [normalizedDocumentKey], [], limit);
}

export async function setComparisonAnswerSaved({ comparisonId, sequence, saved, perPaperLimit }) {
  const normalizedComparisonId = String(comparisonId || "").trim();
  const normalizedSequence = normalizeSequence(sequence);
  if (!normalizedComparisonId || normalizedSequence === null) {
    return createResult("not-found", [], [], perPaperLimit);
  }

  const db = await openPaperDatabase();
  const session = await requestToPromise(
    db.transaction(COMPARISON_SESSION_STORE, "readonly")
      .objectStore(COMPARISON_SESSION_STORE)
      .get(normalizedComparisonId)
  );
  const documentKeys = normalizeDocumentKeys(session?.documentKeys);
  if (!session || !documentKeys.length) {
    return createResult("not-found", documentKeys, [], perPaperLimit);
  }

  const limit = normalizeSavedQaPerPaperLimit(perPaperLimit);
  const transaction = db.transaction([
    COMPARISON_MESSAGE_STORE,
    COMPARISON_SESSION_STORE,
    CONVERSATION_MESSAGE_STORE
  ], "readwrite");
  const comparisonMessages = transaction.objectStore(COMPARISON_MESSAGE_STORE);
  const sessions = transaction.objectStore(COMPARISON_SESSION_STORE);
  const conversationMessages = transaction.objectStore(CONVERSATION_MESSAGE_STORE);
  const targetRequest = comparisonMessages.get(createComparisonMessageId(normalizedComparisonId, normalizedSequence));
  const currentSessionRequest = sessions.get(normalizedComparisonId);
  const countRequests = documentKeys.flatMap((documentKey) => [
    requestToPromise(conversationMessages.index("bySavedDocumentKey").count(documentKey)),
    requestToPromise(comparisonMessages.index("bySavedDocumentKey").count(documentKey))
  ]);
  const [target, currentSession, ...counts] = await Promise.all([
    requestToPromise(targetRequest),
    requestToPromise(currentSessionRequest),
    ...countRequests
  ]);
  if (!isComparisonTarget(target, normalizedComparisonId) || !currentSession) {
    transaction.abort();
    return createResult("not-found", documentKeys, [], limit);
  }

  const nextSaved = Boolean(saved);
  const fullDocumentKeys = nextSaved && !target.isSaved
    ? documentKeys.filter((_documentKey, index) => Number(counts[index * 2]) + Number(counts[index * 2 + 1]) >= limit)
    : [];
  if (fullDocumentKeys.length) {
    transaction.abort();
    return createResult("limit-reached", documentKeys, fullDocumentKeys, limit);
  }

  const now = Date.now();
  comparisonMessages.put({
    ...target,
    isSaved: nextSaved,
    savedDocumentKeys: nextSaved ? documentKeys : [],
    updatedAt: now
  });
  sessions.put({ ...currentSession, updatedAt: now });
  await transactionDone(transaction);
  return createResult(nextSaved ? "saved" : "unsaved", documentKeys, [], limit);
}

function createResult(status, affectedDocumentKeys, fullDocumentKeys, perPaperLimit) {
  return {
    status,
    affectedDocumentKeys,
    fullDocumentKeys,
    perPaperLimit: normalizeSavedQaPerPaperLimit(perPaperLimit)
  };
}

function normalizeSequence(value) {
  const sequence = Number(value);
  return Number.isInteger(sequence) && sequence >= 0 ? sequence : null;
}

function normalizeDocumentKeys(documentKeys) {
  return [...new Set((Array.isArray(documentKeys) ? documentKeys : [])
    .map((key) => String(key || "").trim())
    .filter(Boolean))];
}

function isConversationTarget(message, documentKey, threadId) {
  return Boolean(
    message &&
    message.role === "assistant" &&
    message.documentKey === documentKey &&
    message.threadId === threadId
  );
}

function isComparisonTarget(message, comparisonId) {
  return Boolean(message && message.role === "assistant" && message.comparisonId === comparisonId);
}

function createConversationMessageId(threadId, sequence) {
  return `${threadId}:${String(sequence).padStart(4, "0")}`;
}

function createComparisonMessageId(comparisonId, sequence) {
  return `${comparisonId}:${String(sequence).padStart(4, "0")}`;
}
