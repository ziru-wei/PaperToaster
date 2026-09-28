import { prepareAnnotatedMarkdownForExport } from "../markdown/highlight-markdown.js";

const LEXICAL_BOLD_FORMAT = 1;
const LEXICAL_HIGHLIGHT_FORMAT = 128;

export function createLibraryRecordsCsv(archive, selection = {}) {
  const records = archive?.records || {};
  const paperKeys = normalizeIds(selection.documentKeys);
  const comparisonIds = normalizeIds(selection.comparisonIds);
  const rows = [
    ...paperKeys.map((documentKey) => createPaperRow(records, documentKey)).filter(Boolean),
    ...comparisonIds.map((comparisonId) => createComparisonRow(records, comparisonId)).filter(Boolean)
  ];
  const maximumQuestionCount = rows.reduce((maximum, row) => Math.max(maximum, row.questionAnswers.length), 0);
  const headers = ["title", "added time", "isComparativeReading", "label", "note"];
  for (let index = 1; index <= maximumQuestionCount; index += 1) {
    headers.push(`q_${index}`, `a_${index}`);
  }

  const csvRows = [headers];
  for (const row of rows) {
    const cells = [row.title, row.addedTime, String(row.isComparativeReading), row.label, row.note];
    for (const unit of row.questionAnswers) {
      cells.push(unit.question, unit.answer);
    }
    while (cells.length < headers.length) {
      cells.push("");
    }
    csvRows.push(cells);
  }

  return `\uFEFF${csvRows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")}`;
}

function createPaperRow(records, documentKey) {
  const paper = (records.papers || []).find((record) => record.documentKey === documentKey);
  const documents = (records.documents || []).filter((record) => record.documentKey === documentKey);
  if (!paper && !documents.length) {
    return null;
  }
  const document = documents.sort((left, right) => getTimestamp(right.parsedAt) - getTimestamp(left.parsedAt))[0];
  const note = (records.paperNotes || []).find((record) => record.documentKey === documentKey);
  return {
    title: paper?.title || document?.title || "Untitled paper",
    addedTime: formatTimestamp(document?.parsedAt || paper?.createdAt),
    isComparativeReading: false,
    label: String(paper?.group || ""),
    note: exportPaperNote(note?.document, note?.plainText || paper?.userNote || ""),
    questionAnswers: collectQuestionAnswers(
      (records.conversationMessages || []).filter((message) => message.documentKey === documentKey),
      "threadId"
    )
  };
}

function createComparisonRow(records, comparisonId) {
  const session = (records.comparisonSessions || []).find((record) => record.comparisonId === comparisonId);
  if (!session) {
    return null;
  }
  return {
    title: session.title || "Comparative reading",
    addedTime: formatTimestamp(session.createdAt),
    isComparativeReading: true,
    label: "",
    note: "",
    questionAnswers: collectQuestionAnswers(
      (records.comparisonMessages || []).filter((message) => message.comparisonId === comparisonId),
      "comparisonId"
    )
  };
}

function collectQuestionAnswers(messages, ownerKey) {
  const messagesByOwner = new Map();
  for (const message of messages) {
    const ownerId = String(message?.[ownerKey] || "");
    if (!ownerId) continue;
    const ownerMessages = messagesByOwner.get(ownerId) || [];
    ownerMessages.push(message);
    messagesByOwner.set(ownerId, ownerMessages);
  }

  const units = [];
  for (const ownerMessages of messagesByOwner.values()) {
    let latestQuestion = null;
    for (const message of ownerMessages.sort(compareMessages)) {
      if (message.role === "user") {
        latestQuestion = message;
      } else if (message.role === "assistant") {
        units.push({
          question: String(latestQuestion?.text || ""),
          answer: prepareAnnotatedMarkdownForExport(message.text || ""),
          createdAt: getTimestamp(message.createdAt || latestQuestion?.createdAt)
        });
      }
    }
  }
  return units
    .sort((left, right) => left.createdAt - right.createdAt)
    .map(({ question, answer }) => ({ question, answer }));
}

function exportPaperNote(noteDocument, fallbackText) {
  if (typeof noteDocument !== "string" || !noteDocument.trim().startsWith("{")) {
    return String(fallbackText || "");
  }
  try {
    const root = JSON.parse(noteDocument)?.root;
    return exportLexicalBlock(root, 0).trim();
  } catch {
    return String(fallbackText || "");
  }
}

function exportLexicalBlock(node, depth) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") {
    const text = String(node.text || "");
    const format = Number(node.format) || 0;
    return format & (LEXICAL_BOLD_FORMAT | LEXICAL_HIGHLIGHT_FORMAT) ? wrapMarkdownBold(text) : text;
  }
  if (node.type === "linebreak") return "\n";
  if (node.type === "image") return node.altText ? `![${node.altText}]` : "";
  if (node.type === "list") {
    return (node.children || []).map((child) => exportLexicalListItem(child, depth)).join("\n");
  }
  const content = (node.children || []).map((child) => exportLexicalBlock(child, depth)).join("");
  if (node.type === "root") {
    return (node.children || []).map((child) => exportLexicalBlock(child, depth)).filter(Boolean).join("\n");
  }
  return content;
}

function exportLexicalListItem(node, depth) {
  const children = Array.isArray(node?.children) ? node.children : [];
  const inline = children.filter((child) => child.type !== "list").map((child) => exportLexicalBlock(child, depth)).join("");
  const nested = children.filter((child) => child.type === "list").map((child) => exportLexicalBlock(child, depth + 1)).filter(Boolean);
  return `${"  ".repeat(depth)}- ${inline}${nested.length ? `\n${nested.join("\n")}` : ""}`;
}

function wrapMarkdownBold(text) {
  const value = String(text || "");
  const match = /^(\s*)([\s\S]*?\S)(\s*)$/.exec(value);
  return match ? `${match[1]}**${match[2]}**${match[3]}` : value;
}

function compareMessages(left, right) {
  const leftSequence = Number(left?.sequence);
  const rightSequence = Number(right?.sequence);
  if (Number.isFinite(leftSequence) && Number.isFinite(rightSequence) && leftSequence !== rightSequence) {
    return leftSequence - rightSequence;
  }
  return getTimestamp(left?.createdAt) - getTimestamp(right?.createdAt);
}

function formatTimestamp(value) {
  const timestamp = getTimestamp(value);
  return timestamp ? new Date(timestamp).toISOString() : "";
}

function getTimestamp(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
}

function normalizeIds(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean))];
}

function escapeCsvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
