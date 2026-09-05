import * as pdfjsLib from "../../node_modules/docmarrow/node_modules/pdfjs-dist/legacy/build/pdf.mjs";
import { parseDocument } from "../../node_modules/docmarrow/dist/index.js";

if (globalThis.chrome?.runtime?.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/docmarrow/pdf.worker.mjs");
}

export { parseDocument };
