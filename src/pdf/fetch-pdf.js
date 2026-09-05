export async function fetchPdfBytes(url) {
  let response;
  const requestUrl = stripHash(url);
  if (!isHttpUrl(requestUrl)) {
    throw new Error(`Unsupported PDF URL scheme: ${new URL(requestUrl).protocol}`);
  }

  try {
    response = await fetch(requestUrl, {
      credentials: "include",
      redirect: "follow"
    });
  } catch (error) {
    throw new Error(`Fetch failed before receiving a response: ${error.message || String(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Fetch returned HTTP ${response.status} ${response.statusText || ""}`.trim());
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = await response.arrayBuffer();
  const firstBytes = bytesToAscii(buffer.slice(0, 80));
  const hasPdfHeader = firstBytes.startsWith("%PDF");
  const hasPdfContentType = contentType.toLowerCase().includes("application/pdf");

  if (!hasPdfContentType && !hasPdfHeader) {
    throw new Error([
      "Fetch succeeded, but the response is not a PDF.",
      `Content-Type: ${contentType || "unknown"}`,
      `First bytes: ${firstBytes || "unreadable"}`
    ].join("\n"));
  }

  return {
    bytes: buffer,
    contentType,
    byteLength: buffer.byteLength,
    finalUrl: response.url,
    status: response.status,
    hasPdfHeader
  };
}

export function looksLikePdfUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return pathname.endsWith(".pdf") || pathname.includes("/pdf") || parsed.search.toLowerCase().includes("pdf");
  } catch {
    return false;
  }
}

export function stripHash(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  return parsed.href;
}

export function isHttpUrl(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function bytesToAscii(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (byte) => {
    if (byte >= 32 && byte <= 126) {
      return String.fromCharCode(byte);
    }
    return ".";
  }).join("");
}
