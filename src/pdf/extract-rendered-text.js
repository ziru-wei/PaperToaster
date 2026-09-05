export async function extractRenderedTextContentFromTab(tab, options = {}) {
  const diagnose = options.onDiagnostic || (() => {});
  diagnose("Step 3C: extracting visible text from rendered PDF viewer frames.");

  let injectionResults;

  try {
    injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      world: "ISOLATED",
      func: () => {
        function cleanText(text) {
          return (text || "").replace(/\s+/g, " ").trim();
        }

        function visibleText(node) {
          if (!node || typeof node.innerText !== "string") {
            return "";
          }

          return cleanText(node.innerText);
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

        function collectPageTexts() {
          const pageNodes = [
            ...querySelectorAllDeep("[data-page-number], .page")
          ].filter((node) => visibleText(node).length > 40);

          if (pageNodes.length) {
            return pageNodes.map((node, index) => ({
              pageNumber: Number(node.getAttribute("data-page-number")) || index + 1,
              text: visibleText(node)
            }));
          }

          const textLayerNodes = [
            ...querySelectorAllDeep(".textLayer, [class*='textLayer']")
          ].filter((node) => visibleText(node).length > 40);

          if (textLayerNodes.length) {
            return textLayerNodes.map((node, index) => ({
              pageNumber: index + 1,
              text: visibleText(node)
            }));
          }

          const bodyText = visibleText(document.body);
          return bodyText ? [{ pageNumber: 1, text: bodyText }] : [];
        }

        const pages = collectPageTexts();
        const textLength = pages.reduce((total, page) => total + page.text.length, 0);

        return {
          frameUrl: window.location.href,
          pageCount: pages.length,
          textLength,
          pages
        };
      }
    });
  } catch (error) {
    throw new Error(`Could not inspect rendered PDF viewer text: ${error.message || String(error)}`);
  }

  const candidates = (injectionResults || [])
    .map((entry) => entry.result)
    .filter((result) => result?.textLength > 0)
    .map((result) => ({
      ...result,
      quality: assessRenderedTextCandidate(result)
    }))
    .sort((a, b) => b.textLength - a.textLength);

  for (const candidate of candidates.slice(0, 5)) {
    diagnose([
      `Rendered frame candidate: ${candidate.textLength.toLocaleString()} chars`,
      `quality=${candidate.quality.accepted ? "accepted" : "rejected"}`,
      candidate.quality.reason,
      `from ${candidate.frameUrl}`
    ].filter(Boolean).join(", "));
  }

  const accepted = candidates
    .filter((candidate) => candidate.quality.accepted)
    .sort((a, b) => {
      if (b.quality.score !== a.quality.score) {
        return b.quality.score - a.quality.score;
      }

      return b.textLength - a.textLength;
    });

  const best = accepted[0];
  if (!best) {
    const reason = candidates[0]?.quality?.reason;
    throw new Error([
      "No usable rendered paper text was found in the PDF viewer DOM.",
      reason ? `Best rejected candidate: ${reason}.` : "",
      "The page may be a publisher wrapper rather than a rendered PDF."
    ].filter(Boolean).join(" "));
  }

  return {
    parserId: "rendered-text-fallback",
    parserLabel: "Rendered Text Fallback",
    outputKind: "text",
    pageCount: best.pageCount,
    pages: best.pages,
    markdown: pagesToPlainMarkdown(best.pages),
    chunks: null,
    metadata: {
      source: "rendered-viewer-dom",
      frameUrl: best.frameUrl
    },
    warnings: [{
      code: "rendered_text_only",
      severity: "warning",
      message: "PDF bytes could not be fetched. Text was extracted from the rendered viewer DOM, so it may include only currently rendered pages."
    }],
    stats: {
      textLength: best.textLength,
      qualityScore: best.quality.score
    }
  };
}

export function assessRenderedTextCandidate(candidate) {
  const text = (candidate?.pages || [])
    .map((page) => page.text || "")
    .join("\n");
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length < 200) {
    return {
      accepted: false,
      score: 0,
      reason: "too little visible text"
    };
  }

  const wrapperMarkers = [
    /\bXplore\.Fingerprint\b/i,
    /\bTEALIUM\b/i,
    /\badobeDataLayer\b/i,
    /\blocalStorage\.setItem\b/i,
    /\balloy\("getIdentity"\)/i,
    /\bwindow\.[A-Za-z_$][\w$]*/i,
    /\bdocument\.[A-Za-z_$][\w$]*/i,
    /\bfunction\s*\(/i,
    /\bset(?:Timeout|Interval)\s*\(/i,
    /\biframe\s*\{[^}]*display\s*:/i,
    /\bhtml\s*\{[^}]*margin\s*:/i
  ];
  const wrapperMarkerCount = wrapperMarkers.reduce((count, pattern) => {
    return count + (pattern.test(normalized) ? 1 : 0);
  }, 0);

  const punctuationCount = (normalized.match(/[{};=<>]/g) || []).length;
  const punctuationDensity = punctuationCount / normalized.length;
  const startsLikeScript = /^\s*(?:\(?function\b|var\s+|let\s+|const\s+|window\.|document\.)/i.test(normalized);

  if (startsLikeScript || wrapperMarkerCount >= 3 || (wrapperMarkerCount >= 1 && punctuationDensity > 0.035)) {
    return {
      accepted: false,
      score: 0,
      reason: "looks like publisher wrapper JavaScript/CSS, not paper text"
    };
  }

  const scholarlyMarkers = [
    /\bAbstract\b/i,
    /\bIntroduction\b/i,
    /\bReferences\b/i,
    /\bKeywords\b/i,
    /\bIndex Terms\b/i,
    /\bIEEE\b/,
    /\bACM\b/
  ];
  const scholarlyMarkerCount = scholarlyMarkers.reduce((count, pattern) => {
    return count + (pattern.test(normalized) ? 1 : 0);
  }, 0);

  const sentenceCount = (normalized.match(/\b[A-Z][^.!?]{30,}[.!?](?=\s|$)/g) || []).length;
  const wordMatches = normalized.match(/\b[A-Za-z][A-Za-z-]{2,}\b/g) || [];
  const uniqueWordCount = new Set(wordMatches.map((word) => word.toLowerCase())).size;

  if (uniqueWordCount < 40 || (scholarlyMarkerCount === 0 && sentenceCount < 4)) {
    return {
      accepted: false,
      score: 0,
      reason: "does not look like natural-language paper text"
    };
  }

  const score = normalized.length + scholarlyMarkerCount * 2000 + sentenceCount * 50 + uniqueWordCount;
  return {
    accepted: true,
    score,
    reason: "visible text resembles paper content"
  };
}

function pagesToPlainMarkdown(pages) {
  return pages
    .filter((page) => page.text)
    .map((page) => `<!-- rendered-page:${page.pageNumber} -->\n\n${page.text}`)
    .join("\n\n---\n\n");
}
