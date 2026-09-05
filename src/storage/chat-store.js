import { getDocumentMemoryKey, normalizeLegacyDocumentUrl } from "./document-key.js";
import {
  CONVERSATION_MESSAGE_STORE,
  CONVERSATION_THREAD_STORE,
  PAPER_STORE,
  openPaperDatabase,
  requestToPromise,
  transactionDone
} from "./paper-database.js";

const LEGACY_CHAT_THREADS_KEY = "paperChatThreadsV1";
const DEFAULT_THREAD_TITLE = "Current conversation";
const MAX_MESSAGES_PER_THREAD = 40;
const MAX_MESSAGE_CHARS = 12000;
const MAX_SELECTION_CHARS = 8000;

export async function getStoredChatThread(url) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return createEmptyChatThread({ url });
  }

  const db = await openPaperDatabase();
  const paper = await getPaperRecord(db, documentKey);
  let threadId = paper?.activeThreadId || "";

  if (!threadId) {
    const legacyThread = await getLegacyChatThread(url, documentKey);
    if (legacyThread.messages.length) {
      return saveStoredChatThread(url, legacyThread);
    }

    const latestThread = await getLatestThreadForDocument(db, documentKey);
    if (latestThread?.threadId) {
      threadId = latestThread.threadId;
      await setActiveStoredChatThread(url, threadId);
    }
  }

  if (!threadId) {
    return createEmptyChatThread({ url, documentKey });
  }

  const thread = await getThreadRecord(db, threadId);
  if (!thread || thread.documentKey !== documentKey) {
    return createEmptyChatThread({ url, documentKey });
  }

  const messages = await getThreadMessages(db, threadId);
  return normalizeChatThread({
    ...thread,
    url,
    messages
  }, url);
}

export async function saveStoredChatThread(url, thread) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return createEmptyChatThread({ url });
  }

  const db = await openPaperDatabase();
  const existingPaper = await getPaperRecord(db, documentKey);
  const threadId = thread?.threadId || existingPaper?.activeThreadId || createThreadId();
  const existingThread = await getThreadRecord(db, threadId);
  const normalizedThread = normalizeChatThread({
    ...thread,
    threadId,
    documentKey,
    url
  }, url);
  const now = Date.now();
  const transaction = db.transaction([PAPER_STORE, CONVERSATION_THREAD_STORE, CONVERSATION_MESSAGE_STORE], "readwrite");

  transaction.objectStore(PAPER_STORE).put({
    ...(existingPaper || {}),
    documentKey,
    canonicalUrl: url || existingPaper?.canonicalUrl || "",
    title: existingPaper?.title || "",
    titleSource: existingPaper?.titleSource || "",
    metadata: existingPaper?.metadata || null,
    createdAt: existingPaper?.createdAt || now,
    updatedAt: now,
    activeThreadId: threadId
  });

  transaction.objectStore(CONVERSATION_THREAD_STORE).put({
    ...(existingThread || {}),
    threadId,
    documentKey,
    title: normalizedThread.title || existingThread?.title || DEFAULT_THREAD_TITLE,
    createdAt: existingThread?.createdAt || now,
    firstMessageCreatedAt: getFirstUserMessageCreatedAt(normalizedThread.messages) || existingThread?.firstMessageCreatedAt || null,
    updatedAt: now,
    messageCount: normalizedThread.messages.length
  });

  writeThreadMessages(transaction.objectStore(CONVERSATION_MESSAGE_STORE), {
    threadId,
    documentKey,
    messages: normalizedThread.messages,
    previousMessageCount: existingThread?.messageCount || 0,
    now
  });

  await transactionDone(transaction);
  return normalizedThread;
}

export async function listStoredChatThreads(url) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return [];
  }

  const db = await openPaperDatabase();
  const threads = await requestToPromise(
    db.transaction(CONVERSATION_THREAD_STORE, "readonly")
      .objectStore(CONVERSATION_THREAD_STORE)
      .index("byDocumentKey")
      .getAll(documentKey)
  );

  const sortedThreads = threads
    .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
    .map(async (thread) => ({
      threadId: thread.threadId,
      documentKey: thread.documentKey,
      title: thread.title || DEFAULT_THREAD_TITLE,
      createdAt: thread.createdAt || null,
      firstMessageCreatedAt: thread.firstMessageCreatedAt || (await getFirstThreadUserMessageCreatedAt(db, thread.threadId)),
      updatedAt: thread.updatedAt || null,
      messageCount: thread.messageCount || 0
    }));

  return Promise.all(sortedThreads);
}

export async function createStoredChatThread(url, options = {}) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return createEmptyChatThread({ url });
  }

  const now = Date.now();
  const threadId = createThreadId();
  const db = await openPaperDatabase();
  const existingPaper = await getPaperRecord(db, documentKey);
  const transaction = db.transaction([PAPER_STORE, CONVERSATION_THREAD_STORE], "readwrite");

  transaction.objectStore(PAPER_STORE).put({
    ...(existingPaper || {}),
    documentKey,
    canonicalUrl: url || existingPaper?.canonicalUrl || "",
    title: existingPaper?.title || "",
    titleSource: existingPaper?.titleSource || "",
    metadata: existingPaper?.metadata || null,
    createdAt: existingPaper?.createdAt || now,
    updatedAt: now,
    activeThreadId: threadId
  });

  transaction.objectStore(CONVERSATION_THREAD_STORE).put({
    threadId,
    documentKey,
    title: normalizeThreadTitle(options.title),
    createdAt: now,
    firstMessageCreatedAt: null,
    updatedAt: now,
    messageCount: 0
  });

  await transactionDone(transaction);
  return createEmptyChatThread({
    url,
    documentKey,
    threadId,
    title: normalizeThreadTitle(options.title)
  });
}

export async function setActiveStoredChatThread(url, threadId) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey || !threadId) {
    return createEmptyChatThread({ url, documentKey });
  }

  const db = await openPaperDatabase();
  const thread = await getThreadRecord(db, threadId);
  if (!thread || thread.documentKey !== documentKey) {
    throw new Error("Conversation thread does not belong to the active document.");
  }

  const existingPaper = await getPaperRecord(db, documentKey);
  const now = Date.now();
  const transaction = db.transaction(PAPER_STORE, "readwrite");
  transaction.objectStore(PAPER_STORE).put({
    ...(existingPaper || {}),
    documentKey,
    canonicalUrl: url || existingPaper?.canonicalUrl || "",
    title: existingPaper?.title || "",
    titleSource: existingPaper?.titleSource || "",
    metadata: existingPaper?.metadata || null,
    createdAt: existingPaper?.createdAt || now,
    updatedAt: now,
    activeThreadId: threadId
  });
  await transactionDone(transaction);

  return getStoredChatThread(url);
}

export async function deleteStoredChatThread(url, threadId) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey || !threadId) {
    return createEmptyChatThread({ url, documentKey });
  }

  const db = await openPaperDatabase();
  const thread = await getThreadRecord(db, threadId);
  if (!thread || thread.documentKey !== documentKey) {
    throw new Error("Conversation thread does not belong to the active document.");
  }

  const paper = await getPaperRecord(db, documentKey);
  const replacementThread = (await getThreadRecordsForDocument(db, documentKey))
    .filter((candidate) => candidate.threadId !== threadId)
    .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))[0] || null;
  const now = Date.now();
  const transaction = db.transaction([PAPER_STORE, CONVERSATION_THREAD_STORE, CONVERSATION_MESSAGE_STORE], "readwrite");

  transaction.objectStore(CONVERSATION_THREAD_STORE).delete(threadId);
  deleteThreadMessages(transaction.objectStore(CONVERSATION_MESSAGE_STORE), threadId);
  transaction.objectStore(PAPER_STORE).put({
    ...(paper || {}),
    documentKey,
    canonicalUrl: url || paper?.canonicalUrl || "",
    title: paper?.title || "",
    titleSource: paper?.titleSource || "",
    metadata: paper?.metadata || null,
    createdAt: paper?.createdAt || now,
    updatedAt: now,
    activeThreadId: replacementThread?.threadId || ""
  });

  await transactionDone(transaction);
  if (!replacementThread) {
    return createEmptyChatThread({ url, documentKey });
  }

  return getStoredChatThread(url);
}

export function normalizeChatThread(thread, url = "") {
  const messages = Array.isArray(thread?.messages)
    ? thread.messages.map(normalizeChatMessage).filter(Boolean).slice(-MAX_MESSAGES_PER_THREAD)
    : [];

  return {
    threadId: thread?.threadId || "",
    documentKey: thread?.documentKey || "",
    url: thread?.url || url || "",
    title: normalizeThreadTitle(thread?.title),
    messages
  };
}

function normalizeChatMessage(message, index = 0) {
  const role = message?.role === "assistant" ? "assistant" : "user";
  const text = String(message?.text || "").trim().slice(0, MAX_MESSAGE_CHARS);
  const selectionText = String(message?.selectionText || "").trim().slice(0, MAX_SELECTION_CHARS);
  if (!text) {
    return null;
  }

  return {
    role,
    text,
    selectionText,
    createdAt: Number(message?.createdAt) || Date.now() + index
  };
}

async function getPaperRecord(db, documentKey) {
  return requestToPromise(
    db.transaction(PAPER_STORE, "readonly").objectStore(PAPER_STORE).get(documentKey)
  );
}

async function getThreadRecord(db, threadId) {
  return requestToPromise(
    db.transaction(CONVERSATION_THREAD_STORE, "readonly").objectStore(CONVERSATION_THREAD_STORE).get(threadId)
  );
}

async function getThreadRecordsForDocument(db, documentKey) {
  return requestToPromise(
    db.transaction(CONVERSATION_THREAD_STORE, "readonly")
      .objectStore(CONVERSATION_THREAD_STORE)
      .index("byDocumentKey")
      .getAll(documentKey)
  );
}

async function getLatestThreadForDocument(db, documentKey) {
  const threads = await getThreadRecordsForDocument(db, documentKey);

  return threads.sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))[0] || null;
}

async function getFirstThreadUserMessageCreatedAt(db, threadId) {
  return getFirstUserMessageCreatedAt(await getThreadMessages(db, threadId));
}

async function getThreadMessages(db, threadId) {
  const messages = await requestToPromise(
    db.transaction(CONVERSATION_MESSAGE_STORE, "readonly")
      .objectStore(CONVERSATION_MESSAGE_STORE)
      .index("byThreadId")
      .getAll(threadId)
  );

  return messages
    .sort((left, right) => (left.sequence || 0) - (right.sequence || 0))
    .map((message) => ({
      role: message.role,
      text: message.text,
      selectionText: message.selectionText || "",
      createdAt: message.createdAt || null
    }));
}

function writeThreadMessages(store, { threadId, documentKey, messages, previousMessageCount, now }) {
  messages.forEach((message, index) => {
    store.put({
      messageId: createMessageId(threadId, index),
      threadId,
      documentKey,
      sequence: index,
      role: message.role,
      text: message.text,
      selectionText: message.selectionText || "",
      createdAt: message.createdAt || now + index,
      updatedAt: now
    });
  });

  for (let index = messages.length; index < previousMessageCount; index += 1) {
    store.delete(createMessageId(threadId, index));
  }
}

function deleteThreadMessages(store, threadId) {
  const request = store.index("byThreadId").openCursor(IDBKeyRange.only(threadId));
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    cursor.delete();
    cursor.continue();
  };
}

function getFirstUserMessageCreatedAt(messages) {
  const firstMessage = messages.find((message) => message?.role === "user" && Number(message?.createdAt)) ||
    messages.find((message) => Number(message?.createdAt));
  return firstMessage ? Number(firstMessage.createdAt) : null;
}

async function getLegacyChatThread(url, documentKey) {
  if (!globalThis.chrome?.storage?.local) {
    return createEmptyChatThread({ url, documentKey });
  }

  const data = await chrome.storage.local.get(LEGACY_CHAT_THREADS_KEY);
  const threads = data[LEGACY_CHAT_THREADS_KEY];
  if (!threads || typeof threads !== "object" || Array.isArray(threads)) {
    return createEmptyChatThread({ url, documentKey });
  }

  return normalizeChatThread(
    threads[documentKey] || threads[normalizeLegacyDocumentUrl(url)],
    url
  );
}

function createEmptyChatThread({ url = "", documentKey = "", threadId = "", title = DEFAULT_THREAD_TITLE } = {}) {
  return {
    threadId,
    documentKey,
    url,
    title,
    messages: []
  };
}

function createThreadId() {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `thread-${Date.now().toString(36)}-${randomPart}`;
}

function createMessageId(threadId, index) {
  return `${threadId}:${String(index).padStart(4, "0")}`;
}

function normalizeThreadTitle(title) {
  return String(title || DEFAULT_THREAD_TITLE)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160) || DEFAULT_THREAD_TITLE;
}
