import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { createHash, generateKeyPairSync } from "node:crypto";
import { GOOGLE_SCOPES } from "../src/sync/google-drive-client.js";

const { values } = parseArgs({ options: {
  "client-id": { type: "string" },
  "extension-key": { type: "string" },
  "generate-key": { type: "boolean", default: false }
} });
if (values["client-id"] && !/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(values["client-id"])) {
  throw new Error("Pass --client-id with the OAuth client ID registered for this Chrome extension.");
}
const path = new URL("../manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(path, "utf8"));
if (!values["client-id"] && !values["generate-key"] && !values["extension-key"]) {
  throw new Error("Pass --generate-key to create a stable development extension ID, or --client-id to configure Google OAuth.");
}
if (values["client-id"]) manifest.oauth2 = { client_id: values["client-id"], scopes: GOOGLE_SCOPES };
if (values["generate-key"] && !manifest.key) {
  const { publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  manifest.key = publicKey.export({ type: "spki", format: "der" }).toString("base64");
}
if (values["extension-key"]) {
  if (!/^[A-Za-z0-9+/]+=*$/.test(values["extension-key"])) throw new Error("Extension key must be the base64 public key from the Chrome Web Store developer dashboard.");
  manifest.key = values["extension-key"];
}
await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
if (manifest.key) {
  const hex = createHash("sha256").update(Buffer.from(manifest.key, "base64")).digest("hex").slice(0, 32);
  const extensionId = [...hex].map((digit) => String.fromCharCode(97 + parseInt(digit, 16))).join("");
  console.log(`Stable Chrome extension ID: ${extensionId}`);
}
console.log(values["client-id"]
  ? "Google OAuth configured. Reload Paper Toaster in chrome://extensions and open Settings → Google Sync."
  : "Public extension key configured. Register this extension ID as a Chrome Extension OAuth client, then rerun with --client-id.");
