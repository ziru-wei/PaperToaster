const VOLATILE_QUERY_PARAMS = new Set([
  "casa_token",
  "download",
  "from",
  "ref",
  "source",
  "tracking",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term"
]);

export function getDocumentMemoryKey(url) {
  const canonicalId = extractCanonicalDocumentId(url);
  if (canonicalId) {
    return `${canonicalId.type}:${canonicalId.value}`;
  }

  const normalizedUrl = normalizeDocumentUrl(url);
  return normalizedUrl ? `url:${normalizedUrl}` : "";
}

export function extractCanonicalDocumentId(url) {
  const doi = extractDoi(url);
  if (doi) {
    return {
      type: "doi",
      value: doi
    };
  }

  const arxivId = extractArxivId(url);
  if (arxivId) {
    return {
      type: "arxiv",
      value: arxivId
    };
  }

  const ieeeId = extractIeeeArticleNumber(url);
  if (ieeeId) {
    return {
      type: "ieee-arnumber",
      value: ieeeId
    };
  }

  return null;
}

export function normalizeDocumentUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.search = normalizeQueryParams(parsed.searchParams);
    return parsed.href;
  } catch {
    return String(url || "").trim();
  }
}

export function normalizeLegacyDocumentUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return String(url || "");
  }
}

function extractIeeeArticleNumber(url) {
  try {
    const parsed = new URL(url);
    if (!/\.ieee\.org$/i.test(parsed.hostname) && !/^ieeexplore\.ieee\.org$/i.test(parsed.hostname)) {
      return "";
    }

    const articleNumber = parsed.searchParams.get("arnumber") || parsed.searchParams.get("tp");
    if (/^\d{4,12}$/.test(articleNumber || "")) {
      return articleNumber;
    }

    const pathMatch = parsed.pathname.match(/\/(?:document|stamp)\/(\d{4,12})(?:\/|$)/i);
    return pathMatch?.[1] || "";
  } catch {
    return "";
  }
}

function extractArxivId(url) {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)arxiv\.org$/i.test(parsed.hostname)) {
      return "";
    }

    const pathname = decodeURIComponent(parsed.pathname).replace(/\.pdf$/i, "");
    const match = pathname.match(/\/(?:abs|pdf)\/([a-z-]+\/\d{7}|\d{4}\.\d{4,5})(?:v\d+)?$/i);
    if (!match) {
      return "";
    }

    const versionMatch = pathname.match(/v\d+$/i);
    return `${match[1].toLowerCase()}${versionMatch?.[0]?.toLowerCase() || ""}`;
  } catch {
    return "";
  }
}

function extractDoi(url) {
  const candidates = collectDoiCandidateStrings(url);
  for (const candidate of candidates) {
    const doi = normalizeDoi(candidate);
    if (doi) {
      return doi;
    }
  }

  return "";
}

function collectDoiCandidateStrings(url) {
  const candidates = [String(url || "")];

  try {
    const parsed = new URL(url);
    candidates.push(decodeURIComponent(parsed.pathname));
    for (const value of parsed.searchParams.values()) {
      candidates.push(decodeURIComponent(value));
    }
  } catch {
    // The raw URL string above is still a useful candidate.
  }

  return candidates;
}

function normalizeDoi(candidate) {
  const match = String(candidate || "").match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
  if (!match) {
    return "";
  }

  return match[0]
    .replace(/(?:\.pdf|\/full|\/pdf|#.*)$/i, "")
    .replace(/[.,;)\]]+$/g, "")
    .toLowerCase();
}

function normalizeQueryParams(searchParams) {
  const entries = [];

  for (const [key, value] of searchParams.entries()) {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey.startsWith("utm_") || VOLATILE_QUERY_PARAMS.has(normalizedKey)) {
      continue;
    }

    entries.push([key, value]);
  }

  entries.sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    const keyOrder = leftKey.localeCompare(rightKey);
    return keyOrder || leftValue.localeCompare(rightValue);
  });

  const normalizedParams = new URLSearchParams();
  for (const [key, value] of entries) {
    normalizedParams.append(key, value);
  }

  const query = normalizedParams.toString();
  return query ? `?${query}` : "";
}
