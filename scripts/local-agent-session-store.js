import os from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { chmod, lstat, mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DOCUMENT_REF_PATTERN = /^sha256-[0-9a-f]{64}$/;
const TEMP_PATTERN = /^\.tmp-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const locks = new Map();

export function getSessionDirectory() {
  return path.resolve(process.env.PAPER_CHAT_LOCAL_AGENT_SESSION_DIR
    || path.join(os.homedir(), ".paper-toaster", "sessions"));
}

export function validateConversationIdentity(mode, conversationKey) {
  const prefix = mode === "single-paper" ? "thread" : mode === "comparative-reading" ? "comparison" : "";
  if (!prefix || typeof conversationKey !== "string"
    || !new RegExp(`^${prefix}-[a-z0-9]+-[a-z0-9]{1,16}$`).test(conversationKey)
    || conversationKey.length > 120) {
    throw storeError("Invalid conversation identity.", 400);
  }
  return { mode, conversationKey };
}

export function validateAgentSessionId(sessionId) {
  if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
    throw storeError("Invalid Codex session ID.", 409);
  }
  return sessionId;
}

export function hashText(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

export function computePaperFingerprint(mode, papers) {
  if (!Array.isArray(papers) || !papers.length || papers.some((paper, index) => (
    paper?.paperId !== `p${index + 1}` || !DOCUMENT_REF_PATTERN.test(paper?.documentRef || "")
  ))) {
    throw storeError("Invalid papers for session fingerprint.", 400);
  }
  return hashText(JSON.stringify({ mode, papers: papers.map(({ paperId, documentRef }) => ({ paperId, documentRef })) }));
}

export async function withConversationLock(mode, conversationKey, callback) {
  validateConversationIdentity(mode, conversationKey);
  const key = `${mode}\0${conversationKey}`;
  const previous = locks.get(key) || Promise.resolve();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const tail = previous.catch(() => {}).then(() => gate);
  locks.set(key, tail);
  await previous.catch(() => {});
  try {
    return await callback();
  } finally {
    release();
    if (locks.get(key) === tail) locks.delete(key);
  }
}

export async function prepareSessionDirectory(directory = getSessionDirectory()) {
  const parent = path.dirname(directory);
  await mkdir(parent, { recursive: true, mode: 0o700 });
  const parentInfo = await lstat(parent);
  if (!parentInfo.isDirectory() || parentInfo.isSymbolicLink()) {
    throw storeError("Local Agent session parent is not a regular directory.", 409);
  }
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await assertPrivateDirectory(directory);
  return directory;
}

export async function cleanupSessionTempFiles(directory = getSessionDirectory()) {
  await prepareSessionDirectory(directory);
  let removed = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!TEMP_PATTERN.test(entry.name) || !entry.isFile()) continue;
    const filename = path.join(directory, entry.name);
    const info = await lstat(filename);
    if (!info.isFile() || Date.now() - info.mtimeMs < 5 * 60_000) continue;
    await unlink(filename);
    removed += 1;
  }
  return removed;
}

export async function readSessionRecord(directory, mode, conversationKey) {
  const filename = await getRecordPath(directory, mode, conversationKey);
  try {
    const info = await lstat(filename);
    if (!info.isFile() || info.isSymbolicLink() || info.size > 8192) {
      throw storeError("Invalid local Agent session record.", 409);
    }
    const record = JSON.parse(await readFile(filename, "utf8"));
    validateRecord(record, mode, conversationKey);
    return record;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    if (error?.status) throw error;
    throw storeError(`Could not read local Agent session record: ${error.message || error}`, 409);
  }
}

export async function writeSessionRecord(directory, record) {
  validateRecord(record, record?.mode, record?.conversationKey);
  const filename = await getRecordPath(directory, record.mode, record.conversationKey);
  const temp = path.join(directory, `.tmp-${randomUUID()}`);
  try {
    await writeFile(temp, JSON.stringify(record), { encoding: "utf8", mode: 0o600, flag: "wx" });
    await rename(temp, filename);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw error;
  }
}

export async function deleteSessionRecord(directory, mode, conversationKey) {
  const filename = await getRecordPath(directory, mode, conversationKey);
  try {
    await unlink(filename);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function validateRecord(record, mode, conversationKey) {
  validateConversationIdentity(mode, conversationKey);
  if (!record || record.version !== 1 || record.mode !== mode || record.conversationKey !== conversationKey
    || !/^[0-9a-f]{64}$/.test(record.paperFingerprint || "")
    || !/^[0-9a-f]{64}$/.test(record.skillHash || "")
    || !/^[0-9a-f]{64}$/.test(record.systemPromptHash || "")
    || !Number.isSafeInteger(record.createdAt) || record.createdAt <= 0
    || !Number.isSafeInteger(record.lastUsedAt) || record.lastUsedAt < record.createdAt) {
    throw storeError("Invalid local Agent session record.", 409);
  }
  validateAgentSessionId(record.agentSessionId);
}

async function getRecordPath(directory, mode, conversationKey) {
  validateConversationIdentity(mode, conversationKey);
  await prepareSessionDirectory(directory);
  return path.join(directory, `${hashText(`${mode}\0${conversationKey}`)}.json`);
}

async function assertPrivateDirectory(directory) {
  const info = await lstat(directory);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw storeError("Local Agent session directory is not a regular directory.", 409);
  }
  await chmod(directory, 0o700);
}

function storeError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}
