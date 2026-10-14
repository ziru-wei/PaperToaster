import { openPaperDatabase, requestToPromise } from "./paper-database.js";

// Per-paper caches derived from the PDF or public APIs (figures, metadata).
// They can always be rebuilt, so writes skip transactionDone's sync trigger.

export async function listPaperCacheRecords(storeName) {
  const db = await openPaperDatabase();
  const records = await requestToPromise(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
  return new Map(records.filter((record) => record?.documentKey).map((record) => [record.documentKey, record]));
}

export async function putPaperCacheRecord(storeName, record) {
  const db = await openPaperDatabase();
  const transaction = db.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).put(record);
  await new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error(`Could not save ${storeName} record.`));
    transaction.onabort = () => reject(transaction.error || new Error(`${storeName} save aborted.`));
  });
  return record;
}
