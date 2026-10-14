import { getLocalPdfHashFromDocumentKey } from "../storage/document-key.js";
import { getLocalPdf, listLocalPdfHashes, restoreLocalPdf } from "../storage/local-pdf-store.js";

// Brings saved local PDFs in line with Drive after the library replica syncs:
// copies Drive lacks are uploaded, and copies that synced papers need but this
// device lacks are downloaded. Nothing is deleted from Drive, so a PDF stays
// recoverable even after its paper is removed on some device.
export async function syncLocalPdfs(client, entries) {
  const referenced = getReferencedPdfHashes(entries);
  const [local, remote] = await Promise.all([listLocalPdfHashes(), client.listPdfFiles()]);
  let uploaded = 0;
  let downloaded = 0;
  for (const sha256 of local) {
    if (remote.has(sha256)) continue;
    const record = await getLocalPdf(sha256);
    if (!record?.blob) continue;
    await client.uploadPdf(sha256, record.blob, record.name);
    uploaded += 1;
  }
  for (const sha256 of referenced) {
    if (local.has(sha256) || !remote.has(sha256)) continue;
    const file = remote.get(sha256);
    await restoreLocalPdf({ sha256, blob: await client.downloadPdf(file.id), name: file.name });
    downloaded += 1;
  }
  return { uploaded, downloaded };
}

// Downloads one copy on demand, e.g. when its viewer opens before sync ran.
export async function fetchLocalPdfFromDrive(client, sha256) {
  if (await getLocalPdf(sha256)) return true;
  const file = (await client.listPdfFiles()).get(sha256);
  if (!file) return false;
  await restoreLocalPdf({ sha256, blob: await client.downloadPdf(file.id), name: file.name });
  return true;
}

function getReferencedPdfHashes(entries) {
  const hashes = new Set();
  for (const [id, entry] of Object.entries(entries || {})) {
    if (entry?.deleted) continue;
    const [store, key] = JSON.parse(id);
    if (store !== "papers") continue;
    const hash = getLocalPdfHashFromDocumentKey(key);
    if (hash) hashes.add(hash);
  }
  return hashes;
}
