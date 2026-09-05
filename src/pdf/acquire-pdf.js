import { fetchPdfBytes, isHttpUrl, stripHash } from "./fetch-pdf.js";

export async function acquirePdfBytesFromTab(tab, options = {}) {
  const diagnose = options.onDiagnostic || (() => {});
  if (!isHttpUrl(tab?.url)) {
    throw new Error("Active tab is not a web PDF or publisher PDF viewer page.");
  }

  try {
    diagnose("Step 3A: fetching active tab URL from the extension side panel.");
    return await fetchPdfBytes(tab.url);
  } catch (error) {
    diagnose(`Extension-context fetch failed: ${error.message || String(error)}`);
    diagnose("Step 3B: trying fetch inside the active PDF tab context.");
    return fetchPdfBytesInTabFrames(tab, diagnose);
  }
}

async function fetchPdfBytesInTabFrames(tab, diagnose) {
  let injectionResults;

  try {
    injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      world: "MAIN",
      args: [stripHash(tab.url)],
      func: async (targetUrl) => {
        function normalizeUrl(url) {
          const parsed = new URL(url);
          parsed.hash = "";
          return parsed.href;
        }

        function isFetchableUrl(url) {
          try {
            const parsed = new URL(url);
            return ["http:", "https:", "blob:"].includes(parsed.protocol);
          } catch {
            return false;
          }
        }

        function looksLikePdfUrl(url) {
          try {
            const parsed = new URL(url);
            const pathname = parsed.pathname.toLowerCase();
            return pathname.endsWith(".pdf") || pathname.includes("/pdf") || parsed.search.toLowerCase().includes("pdf");
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

        function arrayBufferToBase64(buffer) {
          const bytes = new Uint8Array(buffer);
          const chunkSize = 0x8000;
          let binary = "";

          for (let index = 0; index < bytes.length; index += chunkSize) {
            const chunk = bytes.subarray(index, index + chunkSize);
            binary += String.fromCharCode(...chunk);
          }

          return btoa(binary);
        }

        function querySelectorAllDeep(selector) {
          const results = [];
          const visitedRoots = new Set();

          function visit(root) {
            if (!root || visitedRoots.has(root)) {
              return;
            }

            visitedRoots.add(root);

            try {
              results.push(...root.querySelectorAll(selector));
            } catch {
              // Ignore selector/root combinations the browser refuses.
            }

            let nodes = [];
            try {
              nodes = [...root.querySelectorAll("*")];
            } catch {
              return;
            }

            for (const node of nodes) {
              if (node.shadowRoot) {
                visit(node.shadowRoot);
              }
            }
          }

          visit(document);
          return results;
        }

        function collectCandidateUrls() {
          const embeddedUrls = new Set();
          const directUrls = new Set();

          function addCandidate(collection, rawUrl, baseUrl) {
            if (!rawUrl) {
              return;
            }

            try {
              const absoluteUrl = normalizeUrl(new URL(rawUrl, baseUrl || document.baseURI).href);
              if (isFetchableUrl(absoluteUrl)) {
                collection.add(absoluteUrl);
              }
            } catch {
              // Ignore invalid candidate URLs.
            }
          }

          try {
            if (looksLikePdfUrl(window.location.href)) {
              addCandidate(directUrls, window.location.href, document.baseURI);
            }
          } catch {
            // Ignore frame location access edge cases.
          }

          for (const selector of [
            "iframe[src]",
            "iframe[data-src]",
            "embed[src]",
            "embed[data-src]",
            "object[data]",
            "object[data-src]"
          ]) {
            for (const node of querySelectorAllDeep(selector)) {
              const rawUrls = [
                node.getAttribute("src"),
                node.getAttribute("data"),
                node.getAttribute("data-src"),
                node.getAttribute("data-url"),
                node.getAttribute("data-pdf-url")
              ].filter(Boolean);

              for (const rawUrl of rawUrls) {
                addCandidate(embeddedUrls, rawUrl, document.baseURI);
              }
            }
          }

          for (const node of querySelectorAllDeep("[data-url], [data-pdf-url]")) {
            const rawUrls = [
              node.getAttribute("data-url"),
              node.getAttribute("data-pdf-url")
            ].filter(Boolean);

            for (const rawUrl of rawUrls) {
              try {
                const absoluteUrl = normalizeUrl(new URL(rawUrl, document.baseURI).href);
                if (looksLikePdfUrl(absoluteUrl) && isFetchableUrl(absoluteUrl)) {
                  directUrls.add(absoluteUrl);
                }
              } catch {
                // Ignore invalid candidate URLs.
              }
            }
          }

          for (const link of querySelectorAllDeep("a[href]")) {
            const rawUrl = link.getAttribute("href");
            if (!rawUrl) {
              continue;
            }

            try {
              const absoluteUrl = normalizeUrl(new URL(rawUrl, document.baseURI).href);
              if (looksLikePdfUrl(absoluteUrl) && isFetchableUrl(absoluteUrl)) {
                directUrls.add(absoluteUrl);
              }
            } catch {
              // Ignore invalid link URLs.
            }
          }

          try {
            for (const entry of performance.getEntriesByType("resource")) {
              const entryUrl = entry.name || "";
              if (looksLikePdfUrl(entryUrl) && isFetchableUrl(entryUrl)) {
                directUrls.add(normalizeUrl(entryUrl));
              }
            }
          } catch {
            // Ignore browsers/pages that restrict performance entries.
          }

          addCandidate(directUrls, targetUrl, document.baseURI);

          return [...embeddedUrls, ...directUrls];
        }

        async function tryFetch(url, variant) {
          const init = {
            credentials: "include",
            redirect: "follow",
            headers: {
              "Accept": "application/pdf,*/*"
            }
          };

          if (variant.cache) {
            init.cache = variant.cache;
          }

          if (variant.mode) {
            init.mode = variant.mode;
          }

          const response = await fetch(url, init);
          const contentType = response.headers.get("content-type") || "";

          if (!response.ok) {
            return {
              ok: false,
              error: `HTTP ${response.status} ${response.statusText || ""}`.trim(),
              status: response.status,
              contentType,
              finalUrl: response.url,
              variant: variant.label,
              url
            };
          }

          const buffer = await response.arrayBuffer();
          const firstBytes = bytesToAscii(buffer.slice(0, 80));
          const hasPdfHeader = firstBytes.startsWith("%PDF");
          const hasPdfContentType = contentType.toLowerCase().includes("application/pdf");

          if (!hasPdfContentType && !hasPdfHeader) {
            return {
              ok: false,
              error: `not a PDF: content-type=${contentType || "unknown"}, first-bytes=${firstBytes || "unreadable"}`,
              status: response.status,
              contentType,
              finalUrl: response.url,
              variant: variant.label,
              url
            };
          }

          return {
            ok: true,
            base64: arrayBufferToBase64(buffer),
            byteLength: buffer.byteLength,
            contentType,
            finalUrl: response.url,
            status: response.status,
            hasPdfHeader,
            variant: variant.label,
            url
          };
        }

        const variants = [
          { label: "default cache" },
          { label: "force-cache", cache: "force-cache" },
          { label: "browser cache only", cache: "only-if-cached", mode: "same-origin" }
        ];
        const attempts = [];

        for (const url of collectCandidateUrls()) {
          for (const variant of variants) {
            try {
              const result = await tryFetch(url, variant);
              attempts.push(result);

              if (result.ok) {
                return {
                  ...result,
                  frameUrl: window.location.href,
                  attempts
                };
              }
            } catch (error) {
              attempts.push({
                ok: false,
                error: error.message || String(error),
                variant: variant.label,
                url
              });
            }
          }
        }

        return {
          ok: false,
          frameUrl: window.location.href,
          attempts
        };
      }
    });
  } catch (error) {
    throw new Error(`Could not run page-context fetch in the active tab: ${error.message || String(error)}`);
  }

  const frameResults = (injectionResults || [])
    .map((entry) => entry.result)
    .filter(Boolean);
  const success = frameResults.find((result) => result.ok);

  for (const result of frameResults) {
    const frameLabel = result.frameUrl ? `Frame ${result.frameUrl}` : "Frame";
    for (const attempt of result.attempts || []) {
      diagnose(`${frameLabel}: ${attempt.variant} -> ${attempt.ok ? "ok" : attempt.error}`);
    }
  }

  if (!success) {
    throw new Error(formatFrameFailures(frameResults));
  }

  diagnose(`Page-context fetch succeeded via ${success.variant}.`);
  if (success.url) {
    diagnose(`Fetched URL: ${success.url}`);
  }

  return {
    bytes: base64ToArrayBuffer(success.base64),
    contentType: success.contentType || "",
    byteLength: success.byteLength,
    finalUrl: success.finalUrl || tab.url,
    status: success.status,
    hasPdfHeader: Boolean(success.hasPdfHeader)
  };
}

function formatFrameFailures(frameResults) {
  const lastAttempt = frameResults
    .flatMap((result) => result.attempts || [])
    .filter((attempt) => !attempt.ok)
    .at(-1);

  if (lastAttempt?.error) {
    return `Page-context fetch failed. Last attempt: ${lastAttempt.variant} -> ${lastAttempt.error}`;
  }

  return "Page-context fetch failed in every frame.";
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}
