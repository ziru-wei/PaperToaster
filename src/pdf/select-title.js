const GENERIC_TITLE_PATTERNS = [
  /^pdf(?: viewer)?$/i,
  /^google scholar pdf reader$/i,
  /^chrome-extension:\/\//i,
  /^https?:\/\//i,
  /^abstract$/i,
  /^introduction$/i,
  /^references$/i,
  /^bibliography$/i,
  /^download$/i,
  /^open$/i
];

export function createEmptyTitleInfo() {
  return {
    title: "",
    source: "",
    candidates: []
  };
}

export function selectDocumentTitle(titleCandidates = []) {
  const ranked = dedupeTitleCandidates(titleCandidates)
    .map((candidate) => ({
      ...candidate,
      text: normalizeTitleText(candidate.text),
      score: (candidate.score || 0) + titleQualityScore(candidate.text)
    }))
    .filter((candidate) => candidate.score >= 650 && isPlausibleTitle(candidate.text))
    .sort((left, right) => right.score - left.score);

  return {
    title: ranked[0]?.text || "",
    source: ranked[0]?.source || "",
    candidates: ranked.slice(0, 10)
  };
}

export function selectTitleInfoByPriority(...titleInfos) {
  const normalizedTitleInfos = titleInfos.filter(Boolean);
  const winningTitleInfo = normalizedTitleInfos.find((titleInfo) => titleInfo?.title);
  const candidates = normalizedTitleInfos.flatMap((titleInfo) => titleInfo?.candidates || []);

  if (winningTitleInfo) {
    return {
      ...winningTitleInfo,
      candidates
    };
  }

  return {
    ...createEmptyTitleInfo(),
    candidates
  };
}

function normalizeTitleText(text = "") {
  return String(text)
    .replace(/\[([^\]]*)]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function isPlausibleTitle(title = "") {
  const normalized = normalizeTitleText(title);

  if (normalized.length < 8 || normalized.length > 220) {
    return false;
  }

  if (GENERIC_TITLE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  if (/[@{}<>]|\bdoi\.org\b|^doi:/i.test(normalized)) {
    return false;
  }

  if (/\.(?:pdf|jsp)$/i.test(normalized)) {
    return false;
  }

  const words = normalized.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || [];
  return words.length >= 3;
}

function looksLikeBylineOrAffiliation(title = "") {
  if (/@/.test(title)) {
    return true;
  }

  if (/\b(?:university|laboratory|institute|department|school|college)\b/i.test(title)) {
    return true;
  }

  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 3 && words.length <= 8) {
    return words.every((word) => /^[\p{Lu}][\p{L}’'-]+\.?$/u.test(word) || /^[\p{Lu}]\.?$/u.test(word));
  }

  return false;
}

function titleQualityScore(title = "") {
  let score = 0;

  if (/[a-z]/.test(title) && /[A-Z]/.test(title)) {
    score += 80;
  }

  const words = title.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || [];
  if (words.length >= 5 && words.length <= 22) {
    score += 80;
  }

  if (/[?:]/.test(title)) {
    score += 30;
  }

  if (/^(?:the|a|an|toward|towards|designing|improving|understanding|re-examining)\b/i.test(title)) {
    score += 30;
  }

  if (looksLikeBylineOrAffiliation(title)) {
    score -= 250;
  }

  return score;
}

function dedupeTitleCandidates(candidates) {
  const seen = new Set();
  const output = [];

  for (const candidate of candidates) {
    const key = candidate.text.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(candidate);
  }

  return output;
}
