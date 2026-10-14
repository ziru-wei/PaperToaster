// Looks up authors, year, venue and citation count from public APIs.
// Adapted from PaperClip's enrich.js (MIT, https://github.com/AdaZhao1211/PaperClip):
// a source-specific API (arXiv, OpenReview, Crossref, IEEE) is authoritative for
// authors and year, and Semantic Scholar supplies the venue a preprint was
// accepted to plus the citation count.
//
// Resolves to metadata, to null when nothing describes the paper, and throws
// on network errors so the caller can retry later.

const S2_FIELDS = "title,authors,year,venue,externalIds,citationCount";
const MIN_REQUEST_GAP_MS = {
  "export.arxiv.org": 3100,
  "api.semanticscholar.org": 1100
};
const RATE_LIMIT_BACKOFF_MS = [0, 4000, 12000];
const lastRequestAt = new Map();

export async function fetchPaperMetadata({ documentKey, canonicalUrl, title }) {
  const source = identifyPaperSource(documentKey, canonicalUrl);
  let primary = null;
  let primaryError = null;
  try {
    primary = await fetchPrimaryMetadata(source);
  } catch (error) {
    primaryError = error;
  }

  const doi = primary?.doi || source.doi || "";
  let supplement = null;
  let supplementError = null;
  try {
    supplement = await fetchSemanticScholar(doi ? `DOI:${doi}` : source.s2Identifier);
    if (!supplement && title) {
      supplement = await matchSemanticScholarTitle(primary?.title || title);
    }
  } catch (error) {
    supplementError = error;
  }

  // Semantic Scholar's keyless tier is often rate limited; OpenAlex still knows the citation count.
  let fallback = null;
  let fallbackError = null;
  if (!supplement) {
    try {
      fallback = await fetchOpenAlex({ doi: doi || source.datacite || "", title: primary?.title || title });
    } catch (error) {
      fallbackError = error;
    }
  }

  if (!primary && !supplement && !fallback) {
    if (primaryError || supplementError || fallbackError) throw primaryError || supplementError || fallbackError;
    return null;
  }
  const merged = mergeMetadata(primary, supplement, source.type);
  merged.year ||= source.year || null;
  const metadata = withOpenAlexFallback(merged, fallback);
  return {
    ...metadata,
    authors: (metadata.authors || []).map(normalizeAuthorName).filter(Boolean),
    // Without Semantic Scholar a preprint's published venue is unknown; flag it to retry sooner.
    complete: Boolean(supplement) || (!primaryError && !supplementError)
  };
}

export function identifyPaperSource(documentKey, canonicalUrl = "") {
  const key = String(documentKey || "");
  const arxivId = key.match(/^arxiv:(.+)$/)?.[1];
  if (arxivId) {
    const baseId = arxivId.replace(/v\d+$/i, "");
    return {
      type: "arxiv",
      id: arxivId,
      s2Identifier: `arXiv:${baseId}`,
      datacite: `10.48550/arxiv.${baseId}`,
      year: getArxivSubmissionYear(baseId)
    };
  }
  const doi = key.match(/^doi:(.+)$/)?.[1];
  if (doi) {
    return { type: "doi", doi, s2Identifier: `DOI:${doi}` };
  }
  const arnumber = key.match(/^ieee-arnumber:(\d+)$/)?.[1];
  if (arnumber) {
    return { type: "ieee", id: arnumber, s2Identifier: "" };
  }
  const openReviewId = getOpenReviewId(canonicalUrl);
  if (openReviewId) {
    return { type: "openreview", id: openReviewId, s2Identifier: "" };
  }
  return { type: "url", s2Identifier: /^https?:/i.test(canonicalUrl) ? `URL:${canonicalUrl}` : "" };
}

function fetchPrimaryMetadata(source) {
  switch (source.type) {
    case "arxiv":
      return fetchArxiv(source.id);
    case "doi":
      return fetchCrossref(source.doi);
    case "ieee":
      return fetchIeee(source.id);
    case "openreview":
      return fetchOpenReview(source.id);
    default:
      return null;
  }
}

function mergeMetadata(primary, supplement, source) {
  if (!primary && !supplement) return { authors: [], citationCount: null, source };
  if (!primary) return { ...supplement, source: `semanticscholar:${source}` };
  if (!supplement) return { ...primary, citationCount: null, source };
  return {
    title: primary.title || supplement.title || "",
    authors: primary.authors?.length ? primary.authors : supplement.authors || [],
    year: primary.year || supplement.year || null,
    venue: supplement.venue || primary.venue || "",
    citationCount: supplement.citationCount ?? null,
    doi: primary.doi || supplement.doi || "",
    source: `${source}+semanticscholar`
  };
}

// OpenAlex fills gaps only: its year and venue for arXiv versions can be off.
function withOpenAlexFallback(metadata, openAlex) {
  if (!openAlex) return metadata;
  return {
    ...metadata,
    title: metadata.title || openAlex.title,
    authors: metadata.authors?.length ? metadata.authors : openAlex.authors,
    year: metadata.year || openAlex.year,
    venue: metadata.venue || openAlex.venue,
    citationCount: metadata.citationCount ?? openAlex.citationCount,
    doi: metadata.doi || openAlex.doi,
    source: `${metadata.source}+openalex`
  };
}

// Sources

async function fetchArxiv(id) {
  const xml = await fetchText(`https://export.arxiv.org/api/query?id_list=${encodeURIComponent(id)}`);
  const entry = xml.match(/<entry\b[\s\S]*?<\/entry>/)?.[0];
  if (!entry) return null;
  const published = firstTagText(entry, "published");
  return {
    title: cleanWhitespace(firstTagText(entry, "title")),
    authors: [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>/g)]
      .map((match) => cleanWhitespace(decodeEntities(match[1])))
      .filter(Boolean),
    year: published ? Number.parseInt(published.slice(0, 4), 10) : null,
    venue: cleanWhitespace(decodeEntities(entry.match(/<arxiv:journal_ref[^>]*>([\s\S]*?)<\/arxiv:journal_ref>/)?.[1] || "")),
    doi: normalizeDoi(entry.match(/<arxiv:doi[^>]*>([\s\S]*?)<\/arxiv:doi>/)?.[1] || "")
  };
}

async function fetchCrossref(doi) {
  const json = await fetchJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  const message = json?.message;
  if (!message) return null;
  const dateParts = (message["published-print"] || message["published-online"] || message.issued || {})["date-parts"];
  return {
    title: cleanWhitespace(firstValue(message.title)),
    authors: Array.isArray(message.author)
      ? message.author.map((author) => cleanWhitespace(author.name || `${author.given || ""} ${author.family || ""}`)).filter(Boolean)
      : [],
    year: Array.isArray(dateParts?.[0]) ? dateParts[0][0] || null : null,
    venue: cleanWhitespace(firstValue(message["container-title"])),
    doi: normalizeDoi(message.DOI || doi)
  };
}

// Venues since 2023 live on API v2; older ones only on v1. Both may demand a bot
// challenge that the user's OpenReview cookies satisfy; otherwise the title match takes over.
async function fetchOpenReview(id) {
  let note = null;
  for (const host of ["api2.openreview.net", "api.openreview.net"]) {
    const response = await throttledFetch(`https://${host}/notes?id=${encodeURIComponent(id)}`, { credentials: "include" });
    if (response.ok) note = (await response.json())?.notes?.[0] || null;
    if (note) break;
  }
  if (!note) return null;
  const content = note.content || {};
  const field = (name) => {
    const value = content[name];
    return value && typeof value === "object" && "value" in value ? value.value : value;
  };
  const authors = field("authors");
  const year = note.pdate || note.cdate ? new Date(note.pdate || note.cdate).getFullYear() : null;
  return {
    title: cleanWhitespace(field("title")),
    authors: (Array.isArray(authors) ? authors : String(authors || "").split(/\s*,\s*|\s+and\s+/))
      .map((author) => cleanWhitespace(String(author)))
      .filter(Boolean),
    year: Number.isFinite(year) ? year : null,
    venue: cleanWhitespace(field("venue") || field("venueid"))
  };
}

// ieeexplore.ieee.org often answers with a bot challenge; when it does, the
// Semantic Scholar title match is the fallback.
async function fetchIeee(arnumber) {
  const response = await throttledFetch(`https://ieeexplore.ieee.org/document/${encodeURIComponent(arnumber)}/`, {
    credentials: "include",
    headers: { Accept: "text/html,application/xhtml+xml" }
  });
  if (!response.ok) throw new Error(`IEEE metadata returned HTTP ${response.status}`);
  const html = await response.text();
  const metadata = extractXplMetadata(html);
  if (!metadata) return null;
  const text = (value) => cleanWhitespace(decodeEntities(String(value || "").replace(/<[^>]+>/g, "")));
  const yearSource = [metadata.publicationYear, metadata.publicationDate, metadata.conferenceDate]
    .map(String)
    .find((value) => /\b(19|20)\d{2}\b/.test(value));
  return {
    title: text(metadata.formulaStrippedArticleTitle || metadata.title),
    authors: (Array.isArray(metadata.authors) ? metadata.authors : [])
      .map((author) => text(author?.name || `${author?.firstName || ""} ${author?.lastName || ""}`))
      .filter(Boolean),
    year: yearSource ? Number.parseInt(yearSource.match(/\b(19|20)\d{2}\b/)[0], 10) : null,
    venue: text(metadata.displayPublicationTitle || metadata.publicationTitle),
    doi: normalizeDoi(metadata.doi)
  };
}

async function fetchSemanticScholar(identifier) {
  if (!identifier) return null;
  const response = await throttledFetch(
    `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(identifier)}?fields=${S2_FIELDS}`
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Semantic Scholar returned HTTP ${response.status}`);
  return fromSemanticScholar(await response.json());
}

async function matchSemanticScholarTitle(title) {
  const query = cleanWhitespace(title);
  if (query.length < 12) return null;
  const response = await throttledFetch(
    `https://api.semanticscholar.org/graph/v1/paper/search/match?query=${encodeURIComponent(query)}&fields=${S2_FIELDS}`
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Semantic Scholar returned HTTP ${response.status}`);
  const match = (await response.json())?.data?.[0];
  // Only trust a match whose title is the paper's title.
  return match && normalizeTitle(match.title) === normalizeTitle(query) ? fromSemanticScholar(match) : null;
}

const OPENALEX_SELECT = "display_name,publication_year,cited_by_count,primary_location,authorships,doi";

async function fetchOpenAlex({ doi, title }) {
  if (doi) {
    const work = await fetchJson(`https://api.openalex.org/works/doi:${encodeURIComponent(doi)}?select=${OPENALEX_SELECT}`);
    if (work) return fromOpenAlex(work);
  }
  const query = cleanWhitespace(title);
  if (query.length < 12) return null;
  const json = await fetchJson(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=5&select=${OPENALEX_SELECT}`);
  const match = (json?.results || []).find((work) => normalizeTitle(work.display_name) === normalizeTitle(query));
  return match ? fromOpenAlex(match) : null;
}

function fromOpenAlex(work) {
  // OpenAlex sometimes joins alternate names with "/".
  const venue = cleanWhitespace(String(work.primary_location?.source?.display_name || "").split("/")[0]);
  return {
    title: cleanWhitespace(work.display_name),
    authors: (work.authorships || []).map((authorship) => cleanWhitespace(authorship?.author?.display_name)).filter(Boolean),
    year: work.publication_year || null,
    venue: /arxiv/i.test(venue) ? "" : venue,
    citationCount: Number.isFinite(work.cited_by_count) ? work.cited_by_count : null,
    doi: normalizeDoi(work.doi || "")
  };
}

function fromSemanticScholar(json) {
  if (!json?.title) return null;
  const venue = cleanWhitespace(json.venue);
  return {
    title: cleanWhitespace(json.title),
    authors: (json.authors || []).map((author) => cleanWhitespace(author?.name)).filter(Boolean),
    year: json.year || null,
    // Semantic Scholar names unpublished preprints "arXiv.org".
    venue: /^arxiv(\.org)?$/i.test(venue) ? "arXiv" : venue,
    citationCount: Number.isFinite(json.citationCount) ? json.citationCount : null,
    doi: normalizeDoi(json.externalIds?.DOI || "")
  };
}

// Helpers

async function fetchText(url) {
  const response = await throttledFetch(url);
  if (!response.ok) throw new Error(`${new URL(url).hostname} returned HTTP ${response.status}`);
  return response.text();
}

async function fetchJson(url) {
  const response = await throttledFetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${new URL(url).hostname} returned HTTP ${response.status}`);
  return response.json();
}

// Keeps to the public APIs' rate limits; callers run lookups one at a time.
// arXiv and Semantic Scholar answer bursts with 429, so those are retried with backoff.
async function throttledFetch(url, options) {
  const host = new URL(url).hostname;
  const gap = MIN_REQUEST_GAP_MS[host] || 0;
  let response = null;
  for (const backoff of RATE_LIMIT_BACKOFF_MS) {
    const wait = Math.max((lastRequestAt.get(host) || 0) + gap - Date.now(), backoff);
    if (wait > 0) await sleep(wait);
    lastRequestAt.set(host, Date.now());
    response = await fetch(url, options);
    if (response.status !== 429) return response;
  }
  return response;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// arXiv IDs start with the submission year and month: 1706.03762, hep-th/9901001.
function getArxivSubmissionYear(id) {
  const yy = id.match(/^(\d{2})\d{2}\./)?.[1] || id.match(/\/(\d{2})\d{5}$/)?.[1];
  if (!yy) return null;
  const year = Number(yy);
  return year >= 91 ? 1900 + year : 2000 + year;
}

function getOpenReviewId(url) {
  try {
    const parsed = new URL(url);
    return /(^|\.)openreview\.net$/i.test(parsed.hostname) ? parsed.searchParams.get("id") || "" : "";
  } catch {
    return "";
  }
}

// IEEE keeps its metadata in `xplGlobal.document.metadata = {...};`.
function extractXplMetadata(html) {
  const match = /xplGlobal\.document\.metadata\s*=\s*\{/.exec(html || "");
  if (!match) return null;
  const start = match.index + match[0].length - 1;
  let depth = 0;
  let inString = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (char === "\\") index += 1;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) {
      try {
        return JSON.parse(html.slice(start, index + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function firstTagText(xml, tag) {
  return decodeEntities(xml.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1] || "");
}

function firstValue(value) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&(apos|#39);/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
    .replace(/&amp;/g, "&");
}

function cleanWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

// Some sources list "Brown, Tom B."; show names in reading order.
function normalizeAuthorName(name) {
  const match = cleanWhitespace(name).match(/^([^,]+),\s*([^,]+)$/);
  return match ? `${match[2]} ${match[1]}` : cleanWhitespace(name);
}

function normalizeTitle(value) {
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function normalizeDoi(value) {
  const match = cleanWhitespace(value).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").match(/10\.\d{4,9}\/\S+/i);
  return match ? match[0].replace(/[\s"'>).,;]+$/g, "").toLowerCase() : "";
}
