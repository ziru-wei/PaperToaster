import { normalizeAiResponseMarkdown } from "../markdown/normalize-ai-response-markdown.js";
import {
  COMPARISON_MESSAGE_STORE,
  CONVERSATION_MESSAGE_STORE,
  openPaperDatabase,
  transactionDone
} from "./paper-database.js";

export async function stripStoredAssistantBoldMarkers() {
  const db = await openPaperDatabase();
  const transaction = db.transaction([CONVERSATION_MESSAGE_STORE, COMPARISON_MESSAGE_STORE], "readwrite");
  const stores = [
    {
      key: "conversation",
      store: transaction.objectStore(CONVERSATION_MESSAGE_STORE)
    },
    {
      key: "comparison",
      store: transaction.objectStore(COMPARISON_MESSAGE_STORE)
    }
  ];
  const results = {
    conversation: { checked: 0, updated: 0 },
    comparison: { checked: 0, updated: 0 }
  };

  await Promise.all(stores.map(({ key, store }) => rewriteAssistantMessages(store, results[key])));
  await transactionDone(transaction);
  return results;
}

function rewriteAssistantMessages(store, result) {
  return new Promise((resolve, reject) => {
    const request = store.openCursor();
    request.onerror = () => reject(request.error || new Error("Could not read stored messages."));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        resolve();
        return;
      }

      const record = cursor.value || {};
      if (record.role === "assistant") {
        result.checked += 1;
        const nextText = normalizeAiResponseMarkdown(record.text || "");
        if (nextText !== record.text) {
          result.updated += 1;
          cursor.update({
            ...record,
            text: nextText,
            updatedAt: Date.now()
          });
        }
      }

      cursor.continue();
    };
  });
}
