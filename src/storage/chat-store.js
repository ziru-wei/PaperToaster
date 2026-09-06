import { getDocumentMemoryKey, normalizeLegacyDocumentUrl } from "./document-key.js";
import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";
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

export async function getStoredChatThreadById(url, threadId) {
  const documentKey = getDocumentMemoryKey(url);
  const normalizedThreadId = String(threadId || "").trim();
  if (!documentKey || !normalizedThreadId) {
    return createEmptyChatThread({ url, documentKey });
  }

  const db = await openPaperDatabase();
  const thread = await getThreadRecord(db, normalizedThreadId);
  if (!thread || thread.documentKey !== documentKey) {
    return createEmptyChatThread({ url, documentKey });
  }

  const messages = await getThreadMessages(db, normalizedThreadId);
  return normalizeChatThread({
    ...thread,
    url,
    messages
  }, url);
}

export async function saveStoredChatThread(url, thread, options = {}) {
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
  const shouldSetActive = options.setActive !== false;
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
    activeThreadId: shouldSetActive ? threadId : existingPaper?.activeThreadId || threadId
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
  await pruneDuplicateEmptyThreads(db, documentKey);
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

export async function listSavedQuestionAnswerUnits(url) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return [];
  }

  const db = await openPaperDatabase();
  const threads = await getThreadRecordsForDocument(db, documentKey);
  const units = [];

  for (const thread of threads) {
    const messages = await getThreadMessages(db, thread.threadId);
    let latestUser = null;

    for (const [messageIndex, message] of messages.entries()) {
      if (message.role === "user") {
        latestUser = {
          message,
          messageIndex
        };
        continue;
      }

      if (message.role !== "assistant" || !message.isSaved) {
        continue;
      }

      units.push({
        threadId: thread.threadId,
        threadTitle: thread.title || DEFAULT_THREAD_TITLE,
        userMessageIndex: latestUser?.messageIndex ?? null,
        assistantMessageIndex: messageIndex,
        question: latestUser?.message?.text || "",
        selectionText: latestUser?.message?.selectionText || "",
        answer: message.text || "",
        isPinned: isMessageSaved(message) && isMessagePinned(message),
        createdAt: Number(message.createdAt || latestUser?.message?.createdAt || thread.updatedAt || thread.createdAt) || Date.now(),
        questionCreatedAt: Number(latestUser?.message?.createdAt) || null,
        answerCreatedAt: Number(message.createdAt) || null
      });
    }
  }

  return units.sort((left, right) => (
    Number(Boolean(right.isPinned)) - Number(Boolean(left.isPinned)) ||
    (right.createdAt || 0) - (left.createdAt || 0)
  ));
}

export async function setPinnedSavedQuestionAnswerUnit(url, unit) {
  const documentKey = getDocumentMemoryKey(url);
  const threadId = String(unit?.threadId || "").trim();
  const assistantMessageIndex = Number(unit?.assistantMessageIndex);
  if (!documentKey || !threadId || !Number.isInteger(assistantMessageIndex) || assistantMessageIndex < 0) {
    return false;
  }

  const db = await openPaperDatabase();
  const targetMessageId = createMessageId(threadId, assistantMessageIndex);
  const targetMessage = await requestToPromise(
    db.transaction(CONVERSATION_MESSAGE_STORE, "readonly")
      .objectStore(CONVERSATION_MESSAGE_STORE)
      .get(targetMessageId)
  );
  if (
    !targetMessage ||
    targetMessage.documentKey !== documentKey ||
    targetMessage.role !== "assistant" ||
    !isMessageSaved(targetMessage)
  ) {
    return false;
  }

  const shouldPinTarget = !isMessagePinned(targetMessage);
  const transaction = db.transaction(CONVERSATION_MESSAGE_STORE, "readwrite");
  const store = transaction.objectStore(CONVERSATION_MESSAGE_STORE);
  const request = store.index("byDocumentKey").openCursor(IDBKeyRange.only(documentKey));
  const now = Date.now();

  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    const message = cursor.value;
    const isTarget = message.messageId === targetMessageId;
    const nextPinned = isTarget ? shouldPinTarget : false;
    if (message.role === "assistant" && isMessagePinned(message) !== nextPinned) {
      cursor.update({
        ...message,
        isPinned: nextPinned,
        updatedAt: now
      });
    }
    cursor.continue();
  };

  await transactionDone(transaction);
  return true;
}

export async function createStoredChatThread(url, options = {}) {
  const documentKey = getDocumentMemoryKey(url);
  if (!documentKey) {
    return createEmptyChatThread({ url });
  }

  const now = Date.now();
  const db = await openPaperDatabase();
  const existingPaper = await getPaperRecord(db, documentKey);
  const existingThreads = await getThreadRecordsForDocument(db, documentKey);
  const reusableThread = selectReusableEmptyThread(existingThreads, existingPaper?.activeThreadId);
  if (reusableThread) {
    const transaction = db.transaction([PAPER_STORE, CONVERSATION_THREAD_STORE], "readwrite");
    const threadStore = transaction.objectStore(CONVERSATION_THREAD_STORE);
    const normalizedTitle = normalizeThreadTitle(reusableThread.title || options.title);

    transaction.objectStore(PAPER_STORE).put({
      ...(existingPaper || {}),
      documentKey,
      canonicalUrl: url || existingPaper?.canonicalUrl || "",
      title: existingPaper?.title || "",
      titleSource: existingPaper?.titleSource || "",
      metadata: existingPaper?.metadata || null,
      createdAt: existingPaper?.createdAt || now,
      updatedAt: now,
      activeThreadId: reusableThread.threadId
    });

    threadStore.put({
      ...reusableThread,
      title: normalizedTitle,
      updatedAt: now,
      messageCount: 0
    });
    deleteDuplicateEmptyThreads(threadStore, existingThreads, reusableThread.threadId);

    await transactionDone(transaction);
    return createEmptyChatThread({
      url,
      documentKey,
      threadId: reusableThread.threadId,
      title: normalizedTitle
    });
  }

  const threadId = createThreadId();
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
  const rawText = String(message?.text || "").trim();
  const text = (role === "assistant" ? normalizeAiResponseMarkdown(rawText) : rawText)
    .slice(0, MAX_MESSAGE_CHARS);
  const selectionText = String(message?.selectionText || "").trim().slice(0, MAX_SELECTION_CHARS);
  if (!text) {
    return null;
  }

  return {
    role,
    text,
    selectionText,
    createdAt: Number(message?.createdAt) || Date.now() + index,
    isSaved: isMessageSaved(message),
    isPinned: isMessageSaved(message) && isMessagePinned(message)
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

async function pruneDuplicateEmptyThreads(db, documentKey) {
  const threads = await getThreadRecordsForDocument(db, documentKey);
  const emptyThreads = threads.filter(isEmptyThreadRecord);
  if (emptyThreads.length <= 1) {
    return;
  }

  const paper = await getPaperRecord(db, documentKey);
  const keepThread = selectReusableEmptyThread(emptyThreads, paper?.activeThreadId);
  if (!keepThread) {
    return;
  }

  const now = Date.now();
  const activeThreadId = paper?.activeThreadId || "";
  const activeThread = threads.find((thread) => thread.threadId === activeThreadId);
  const nextActiveThreadId = !activeThread || isEmptyThreadRecord(activeThread)
    ? keepThread.threadId
    : activeThreadId;
  const transaction = db.transaction([PAPER_STORE, CONVERSATION_THREAD_STORE], "readwrite");
  transaction.objectStore(PAPER_STORE).put({
    ...(paper || {}),
    documentKey,
    canonicalUrl: paper?.canonicalUrl || "",
    title: paper?.title || "",
    titleSource: paper?.titleSource || "",
    metadata: paper?.metadata || null,
    createdAt: paper?.createdAt || now,
    updatedAt: now,
    activeThreadId: nextActiveThreadId
  });
  deleteDuplicateEmptyThreads(transaction.objectStore(CONVERSATION_THREAD_STORE), emptyThreads, keepThread.threadId);
  await transactionDone(transaction);
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
      createdAt: message.createdAt || null,
      isSaved: isMessageSaved(message),
      isPinned: isMessageSaved(message) && isMessagePinned(message)
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
      isSaved: isMessageSaved(message),
      isPinned: isMessageSaved(message) && isMessagePinned(message),
      createdAt: message.createdAt || now + index,
      updatedAt: now
    });
  });

  for (let index = messages.length; index < previousMessageCount; index += 1) {
    store.delete(createMessageId(threadId, index));
  }
}

function isMessageSaved(message) {
  return Boolean(message?.isSaved);
}

function isMessagePinned(message) {
  return Boolean(message?.isPinned);
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

function selectReusableEmptyThread(threads, activeThreadId = "") {
  const emptyThreads = threads.filter(isEmptyThreadRecord);
  const activeEmptyThread = emptyThreads.find((thread) => thread.threadId === activeThreadId);
  if (activeEmptyThread) {
    return activeEmptyThread;
  }

  return emptyThreads
    .sort((left, right) => getThreadSortTime(right) - getThreadSortTime(left))[0] || null;
}

function deleteDuplicateEmptyThreads(store, threads, keepThreadId) {
  for (const thread of threads) {
    if (thread.threadId !== keepThreadId && isEmptyThreadRecord(thread)) {
      store.delete(thread.threadId);
    }
  }
}

function isEmptyThreadRecord(thread) {
  return Boolean(thread?.threadId)
    && Number(thread.messageCount) === 0
    && !Number(thread.firstMessageCreatedAt);
}

function getThreadSortTime(thread) {
  return Number(thread?.updatedAt || thread?.createdAt) || 0;
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
