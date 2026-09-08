import {
  COMPARISON_MESSAGE_STORE,
  COMPARISON_SESSION_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";
import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";

const MAX_COMPARISON_MESSAGES = 80;
const MAX_COMPARISON_MESSAGE_CHARS = 20000;
const DEFAULT_COMPARISON_TITLE = "Comparative reading";

export async function createComparisonSession(documentKeys = [], options = {}) {
  const keys = normalizeDocumentKeys(documentKeys);
  const now = Date.now();
  const session = {
    comparisonId: createComparisonId(),
    documentKeys: keys,
    title: normalizeComparisonTitle(options.title) || inferComparisonTitle(options.question),
    createdAt: now,
    updatedAt: now,
    firstMessageCreatedAt: null,
    messageCount: 0,
    isStarred: false,
    starredAt: null
  };

  const db = await openPaperDatabase();
  const transaction = db.transaction(COMPARISON_SESSION_STORE, "readwrite");
  transaction.objectStore(COMPARISON_SESSION_STORE).put(session);
  await transactionDone(transaction);
  return normalizeComparisonSession(session);
}

export async function setComparisonSessionStarred(comparisonId, isStarred) {
  const normalizedId = String(comparisonId || "").trim();
  if (!normalizedId) {
    return null;
  }

  const db = await openPaperDatabase();
  const existing = await getComparisonSessionRecord(db, normalizedId);
  if (!existing) {
    return null;
  }

  const now = Date.now();
  const next = {
    ...existing,
    isStarred: Boolean(isStarred),
    starredAt: isStarred ? now : null,
    updatedAt: existing.updatedAt || now
  };
  const transaction = db.transaction(COMPARISON_SESSION_STORE, "readwrite");
  transaction.objectStore(COMPARISON_SESSION_STORE).put(next);
  await transactionDone(transaction);
  return normalizeComparisonSession(next);
}

export async function listComparisonSessions() {
  const db = await openPaperDatabase();
  const sessions = await requestToPromise(
    db.transaction(COMPARISON_SESSION_STORE, "readonly")
      .objectStore(COMPARISON_SESSION_STORE)
      .getAll()
  );

  return sessions
    .map(normalizeComparisonSession)
    .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));
}

export async function getComparisonSession(comparisonId) {
  const normalizedId = String(comparisonId || "").trim();
  if (!normalizedId) {
    return null;
  }

  const db = await openPaperDatabase();
  const [session, messages] = await Promise.all([
    getComparisonSessionRecord(db, normalizedId),
    getComparisonMessages(db, normalizedId)
  ]);

  return session ? {
    ...normalizeComparisonSession(session),
    messages
  } : null;
}

export async function appendComparisonMessage(comparisonId, message) {
  const normalizedId = String(comparisonId || "").trim();
  if (!normalizedId) {
    throw new Error("Comparison session id is missing.");
  }

  const normalizedMessage = normalizeComparisonMessage(message);
  if (!normalizedMessage) {
    throw new Error("Comparison message is empty.");
  }

  const db = await openPaperDatabase();
  const session = await getComparisonSessionRecord(db, normalizedId);
  if (!session) {
    throw new Error("Comparison session was not found.");
  }

  const existingMessages = await getComparisonMessages(db, normalizedId);
  const nextMessages = [...existingMessages, normalizedMessage].slice(-MAX_COMPARISON_MESSAGES);
  const now = Date.now();
  const transaction = db.transaction([COMPARISON_SESSION_STORE, COMPARISON_MESSAGE_STORE], "readwrite");
  const messageStore = transaction.objectStore(COMPARISON_MESSAGE_STORE);
  const sessionStore = transaction.objectStore(COMPARISON_SESSION_STORE);

  rewriteComparisonMessages(messageStore, {
    comparisonId: normalizedId,
    messages: nextMessages,
    now
  });

  sessionStore.put({
    ...session,
    title: shouldReplaceDefaultTitle(session.title)
      ? inferComparisonTitle(normalizedMessage.role === "user" ? normalizedMessage.text : "")
      : session.title,
    firstMessageCreatedAt: session.firstMessageCreatedAt || getFirstMessageTime(nextMessages),
    messageCount: nextMessages.length,
    updatedAt: now
  });

  await transactionDone(transaction);
  return getComparisonSession(normalizedId);
}

export async function saveComparisonMessages(comparisonId, messages = []) {
  const normalizedId = String(comparisonId || "").trim();
  if (!normalizedId) {
    throw new Error("Comparison session id is missing.");
  }

  const normalizedMessages = (Array.isArray(messages) ? messages : [])
    .map(normalizeComparisonMessage)
    .filter(Boolean)
    .slice(-MAX_COMPARISON_MESSAGES);
  const db = await openPaperDatabase();
  const session = await getComparisonSessionRecord(db, normalizedId);
  if (!session) {
    throw new Error("Comparison session was not found.");
  }

  const now = Date.now();
  const transaction = db.transaction([COMPARISON_SESSION_STORE, COMPARISON_MESSAGE_STORE], "readwrite");
  rewriteComparisonMessages(transaction.objectStore(COMPARISON_MESSAGE_STORE), {
    comparisonId: normalizedId,
    messages: normalizedMessages,
    now,
    previousMessageCount: session.messageCount || 0
  });
  transaction.objectStore(COMPARISON_SESSION_STORE).put({
    ...session,
    firstMessageCreatedAt: getFirstMessageTime(normalizedMessages),
    messageCount: normalizedMessages.length,
    updatedAt: now
  });

  await transactionDone(transaction);
  return getComparisonSession(normalizedId);
}

export async function listSavedComparisonQuestionAnswerUnitsForDocument(documentKey) {
  const normalizedDocumentKey = String(documentKey || "").trim();
  if (!normalizedDocumentKey) {
    return [];
  }

  const db = await openPaperDatabase();
  const sessions = await requestToPromise(
    db.transaction(COMPARISON_SESSION_STORE, "readonly")
      .objectStore(COMPARISON_SESSION_STORE)
      .getAll()
  );
  const relatedSessions = new Map(
    sessions
      .map(normalizeComparisonSession)
      .filter((session) => session.documentKeys.includes(normalizedDocumentKey))
      .map((session) => [session.comparisonId, session])
  );
  if (!relatedSessions.size) {
    return [];
  }

  const messagesByComparisonId = new Map(await Promise.all(
    [...relatedSessions.keys()].map(async (comparisonId) => [
      comparisonId,
      await getComparisonMessages(db, comparisonId)
    ])
  ));

  const units = [];
  for (const [comparisonId, comparisonMessages] of messagesByComparisonId.entries()) {
    const session = relatedSessions.get(comparisonId);
    const sortedMessages = comparisonMessages.sort((left, right) => (left.sequence || 0) - (right.sequence || 0));
    let latestUser = null;

    for (const message of sortedMessages) {
      if (message.role === "user") {
        latestUser = message;
        continue;
      }

      if (message.role !== "assistant" || !isComparisonMessageSaved(message)) {
        continue;
      }

      units.push({
        sourceType: "comparison",
        comparisonId,
        threadTitle: session.title || DEFAULT_COMPARISON_TITLE,
        userMessageIndex: Number.isInteger(latestUser?.sequence) ? latestUser.sequence : null,
        assistantMessageIndex: Number.isInteger(message.sequence) ? message.sequence : null,
        question: latestUser?.text || session.title || DEFAULT_COMPARISON_TITLE,
        selectionText: "",
        answer: message.text || "",
        isPinned: false,
        createdAt: Number(message.createdAt || latestUser?.createdAt || session.updatedAt || session.createdAt) || Date.now(),
        questionCreatedAt: Number(latestUser?.createdAt) || null,
        answerCreatedAt: Number(message.createdAt) || null,
        documentKeys: session.documentKeys,
        citedDocumentKeys: message.citedDocumentKeys || []
      });
    }
  }

  return units.sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));
}

export function inferComparisonTitle(question = "") {
  const normalized = String(question || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) {
    return DEFAULT_COMPARISON_TITLE;
  }

  return normalized.slice(0, 90);
}

function getComparisonSessionRecord(db, comparisonId) {
  return requestToPromise(
    db.transaction(COMPARISON_SESSION_STORE, "readonly")
      .objectStore(COMPARISON_SESSION_STORE)
      .get(comparisonId)
  );
}

function getComparisonMessages(db, comparisonId) {
  return requestToPromise(
    db.transaction(COMPARISON_MESSAGE_STORE, "readonly")
      .objectStore(COMPARISON_MESSAGE_STORE)
      .index("byComparisonId")
      .getAll(comparisonId)
  ).then((messages) => messages
    .map(normalizeComparisonMessage)
    .filter(Boolean)
    .sort((left, right) => (left.sequence || 0) - (right.sequence || 0)));
}

function rewriteComparisonMessages(store, { comparisonId, messages, now, previousMessageCount = 0 }) {
  messages.forEach((message, index) => {
    store.put({
      messageId: createComparisonMessageId(comparisonId, index),
      comparisonId,
      sequence: index,
      role: message.role,
      text: message.text,
      model: message.model || "",
      citedDocumentKeys: message.citedDocumentKeys || [],
      isSaved: isComparisonMessageSaved(message),
      createdAt: message.createdAt || now + index,
      updatedAt: now
    });
  });

  for (let index = messages.length; index < previousMessageCount; index += 1) {
    store.delete(createComparisonMessageId(comparisonId, index));
  }
}

function normalizeComparisonSession(session) {
  return {
    comparisonId: String(session?.comparisonId || "").trim(),
    documentKeys: normalizeDocumentKeys(session?.documentKeys),
    title: normalizeComparisonTitle(session?.title) || DEFAULT_COMPARISON_TITLE,
    createdAt: Number(session?.createdAt) || null,
    updatedAt: Number(session?.updatedAt) || null,
    firstMessageCreatedAt: Number(session?.firstMessageCreatedAt) || null,
    messageCount: Number(session?.messageCount) || 0,
    isStarred: Boolean(session?.isStarred),
    starredAt: Number(session?.starredAt) || null
  };
}

function normalizeComparisonMessage(message) {
  const role = message?.role === "assistant" ? "assistant" : "user";
  const rawText = String(message?.text || "").trim();
  const text = (role === "assistant" ? normalizeAiResponseMarkdown(rawText) : rawText)
    .slice(0, MAX_COMPARISON_MESSAGE_CHARS);
  if (!text) {
    return null;
  }

  return {
    comparisonId: String(message?.comparisonId || "").trim(),
    role,
    text,
    model: role === "assistant" ? normalizeMessageModel(message?.model) : "",
    citedDocumentKeys: normalizeDocumentKeys(message?.citedDocumentKeys || []),
    isSaved: isComparisonMessageSaved(message),
    sequence: Number(message?.sequence) || 0,
    createdAt: Number(message?.createdAt) || Date.now()
  };
}

function isComparisonMessageSaved(message) {
  return Boolean(message?.isSaved);
}

function normalizeMessageModel(model) {
  return String(model || "").replace(/\s+/g, " ").trim().slice(0, 160);
}

function normalizeDocumentKeys(documentKeys) {
  const keys = Array.isArray(documentKeys) ? documentKeys : [];
  return [...new Set(keys.map((key) => String(key || "").trim()).filter(Boolean))];
}

function normalizeComparisonTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function shouldReplaceDefaultTitle(title) {
  return !title || title === DEFAULT_COMPARISON_TITLE;
}

function getFirstMessageTime(messages) {
  return messages.find((message) => Number(message.createdAt))?.createdAt || null;
}

function createComparisonId() {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `comparison-${Date.now().toString(36)}-${randomPart}`;
}

function createComparisonMessageId(comparisonId, index) {
  return `${comparisonId}:${String(index).padStart(4, "0")}`;
}
