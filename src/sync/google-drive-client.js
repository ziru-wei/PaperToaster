import { SYNC_SCHEMA, SYNC_VERSION, validateReplica } from "./sync-model.js";

const DRIVE_URL = "https://www.googleapis.com/drive/v3/files";
export const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/drive.appdata", "openid", "email"];

export function isGoogleSyncConfigured() {
  return Boolean(chrome.runtime.getManifest().oauth2?.client_id);
}

export async function getGoogleToken(interactive = false) {
  if (!isGoogleSyncConfigured()) {
    throw new Error("Google sync needs an OAuth Client ID. Follow the Google sync setup in README.md.");
  }
  const result = await chrome.identity.getAuthToken({ interactive, scopes: GOOGLE_SCOPES });
  const token = typeof result === "string" ? result : result.token;
  if (!token) throw new Error("Google sign-in did not return an access token.");
  return token;
}

export class GoogleDriveClient {
  constructor(token) {
    this.token = token;
  }

  async request(url, options = {}, retry = true) {
    const { timeoutMs = 20000, ...fetchOptions } = options;
    const response = await fetch(url, {
      ...fetchOptions,
      headers: { ...fetchOptions.headers, Authorization: `Bearer ${this.token}` },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (response.status === 401 && retry) {
      await chrome.identity.removeCachedAuthToken({ token: this.token });
      this.token = await getGoogleToken(false);
      return this.request(url, options, false);
    }
    if (!response.ok) {
      const details = await response.json().catch(() => null);
      throw new Error(`Google sync (${response.status}): ${details?.error?.message || response.statusText}`);
    }
    return response;
  }

  async getAccount() {
    const response = await this.request("https://www.googleapis.com/oauth2/v3/userinfo");
    const info = await response.json();
    if (!info.sub || !info.email) throw new Error("Could not identify the signed-in Google account.");
    return { id: info.sub, email: info.email };
  }

  async listReplicas() {
    const files = [];
    let pageToken = "";
    do {
      const query = new URLSearchParams({
        spaces: "appDataFolder",
        q: "trashed = false and appProperties has { key='paperToasterSync' and value='1' }",
        fields: "nextPageToken,files(id,name)",
        pageSize: "1000",
        ...(pageToken ? { pageToken } : {})
      });
      const data = await (await this.request(`${DRIVE_URL}?${query}`)).json();
      files.push(...(data.files || []));
      pageToken = data.nextPageToken || "";
    } while (pageToken);
    return files;
  }

  // Saved local PDFs live beside the replicas as their own files, named and
  // tagged by content hash, so each is uploaded once and never conflicts.
  async listPdfFiles() {
    const files = new Map();
    let pageToken = "";
    do {
      const query = new URLSearchParams({
        spaces: "appDataFolder",
        q: "trashed = false and appProperties has { key='paperToasterPdf' and value='1' }",
        fields: "nextPageToken,files(id,name,appProperties)",
        pageSize: "1000",
        ...(pageToken ? { pageToken } : {})
      });
      const data = await (await this.request(`${DRIVE_URL}?${query}`)).json();
      for (const file of data.files || []) {
        const sha256 = file.appProperties?.sha256;
        if (/^[0-9a-f]{64}$/.test(sha256 || "")) files.set(sha256, { id: file.id, name: file.appProperties?.fileName || "" });
      }
      pageToken = data.nextPageToken || "";
    } while (pageToken);
    return files;
  }

  async uploadPdf(sha256, blob, fileName = "") {
    const metadata = {
      name: `papertoaster-pdf-${sha256}.pdf`,
      mimeType: "application/pdf",
      parents: ["appDataFolder"],
      appProperties: { paperToasterPdf: "1", sha256, fileName: String(fileName).slice(0, 100) }
    };
    const session = await this.request("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "application/pdf",
        "X-Upload-Content-Length": String(blob.size)
      },
      body: JSON.stringify(metadata)
    });
    const uploadUrl = session.headers.get("Location");
    if (!uploadUrl) throw new Error("Google Drive did not start the PDF upload.");
    await this.request(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: blob,
      timeoutMs: 10 * 60 * 1000
    });
  }

  async downloadPdf(fileId) {
    const response = await this.request(`${DRIVE_URL}/${encodeURIComponent(fileId)}?alt=media`, {
      timeoutMs: 10 * 60 * 1000
    });
    return response.blob();
  }

  async readReplica(fileId) {
    const response = await this.request(`${DRIVE_URL}/${encodeURIComponent(fileId)}?alt=media`);
    return validateReplica(await response.json());
  }

  async writeReplica(fileId, deviceId, entries) {
    const body = JSON.stringify({ schema: SYNC_SCHEMA, version: SYNC_VERSION, deviceId, entries });
    const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files";
    if (fileId) {
      await this.request(`${uploadUrl}/${encodeURIComponent(fileId)}?uploadType=media`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body
      });
      return fileId;
    }
    const boundary = `papertoaster_${crypto.randomUUID()}`;
    const metadata = {
      name: `papertoaster-sync-v1-${deviceId}.json`,
      mimeType: "application/json",
      parents: ["appDataFolder"],
      appProperties: { paperToasterSync: "1" }
    };
    const response = await this.request(`${uploadUrl}?uploadType=multipart&fields=id`, {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body: `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${boundary}--`
    });
    return (await response.json()).id;
  }
}
