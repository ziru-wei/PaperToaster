const UTF8_FLAG = 0x0800;
const STORE_METHOD = 0;
const encoder = new TextEncoder();
const crcTable = buildCrcTable();

export function canDownloadParserArtifacts(document) {
  return Boolean(
    document?.markdown
    && document?.artifacts?.outline
    && document?.artifacts?.debug
  );
}

export function downloadParserArtifacts(document) {
  if (!canDownloadParserArtifacts(document)) {
    throw new Error("Parser artifacts are not available for this paper. Reload it with the new parser first.");
  }

  const archive = createStoredZip([
    { name: "outline.json", content: serializeJson(document.artifacts.outline) },
    { name: "debug.json", content: serializeJson(document.artifacts.debug) },
    { name: "output.md", content: document.markdown }
  ]);
  const url = URL.createObjectURL(new Blob([archive], { type: "application/zip" }));
  const anchor = documentOwner().createElement("a");
  anchor.href = url;
  anchor.download = `${safeFileStem(document.title || document.documentKey || "paper")}-paper-toaster.zip`;
  anchor.hidden = true;
  documentOwner().body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function createStoredZip(files) {
  const now = new Date();
  const { dosDate, dosTime } = toDosTimestamp(now);
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(String(file.content ?? ""));
    const checksum = crc32(data);
    const local = new Uint8Array(30 + name.length + data.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, UTF8_FLAG, true);
    localView.setUint16(8, STORE_METHOD, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(data, 30 + name.length);
    localParts.push(local);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, UTF8_FLAG, true);
    centralView.setUint16(10, STORE_METHOD, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    central.set(name, 46);
    centralParts.push(central);
    offset += local.length;
  }

  const centralOffset = offset;
  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);

  return concatenateBytes([...localParts, ...centralParts, end]);
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function safeFileStem(value) {
  return String(value || "paper")
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "paper";
}

function documentOwner() {
  return globalThis.document;
}

function concatenateBytes(parts) {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function toDosTimestamp(date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    dosDate: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    dosTime: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  };
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildCrcTable() {
  return Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    return value >>> 0;
  });
}
