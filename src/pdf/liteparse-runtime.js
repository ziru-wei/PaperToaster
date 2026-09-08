import initLiteParse, { LiteParse } from "../../vendor/liteparse/liteparse_wasm.js";

let initializationPromise = null;

export async function parseWithLiteParse(bytes) {
  await ensureLiteParseInitialized();
  const parser = new LiteParse({
    ocrEnabled: false,
    outputFormat: "markdown",
    extractBlocks: true,
    extractLinks: false,
    extractTextMetadata: true
  });

  try {
    return await parser.parse(toUint8Array(bytes).slice());
  } finally {
    parser.free();
  }
}

function ensureLiteParseInitialized() {
  if (!initializationPromise) {
    const wasmUrl = globalThis.chrome?.runtime?.getURL
      ? chrome.runtime.getURL("vendor/liteparse/liteparse_wasm_bg.wasm")
      : new URL("../../vendor/liteparse/liteparse_wasm_bg.wasm", import.meta.url);
    initializationPromise = initLiteParse({ module_or_path: wasmUrl }).catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }
  return initializationPromise;
}

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) return bytes;
  if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
  if (ArrayBuffer.isView(bytes)) {
    return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  throw new TypeError("PDF bytes must be an ArrayBuffer or typed array.");
}
