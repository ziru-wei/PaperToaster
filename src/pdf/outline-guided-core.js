export function buildOutlineGuidedArtifacts({ parsed, pdfFacts, pdfTextPages = [], pdfName = "paper.pdf" }) {
  const blocks = collectBlocks(parsed.pages);
  const title = choosePaperTitle(pdfFacts.title, blocks, pdfName);

  if (pdfFacts.outlineAvailable) {
    const matches = matchOutlineToBlocks(pdfFacts.outline, blocks);
    const markdown = buildOutlineGuidedMarkdown(parsed.pages, matches, title, blocks);
    return {
      title,
      markdown,
      outlineArtifact: {
        outlineType: "embedded",
        outline: pdfFacts.outline
      },
      debugArtifact: {
        pdf: pdfName,
        embeddedOutlineAvailable: true,
        inferenceSkipped: true,
        matches: matches.map(toDebugMatch)
      },
      outlineType: "embedded",
      degradedMode: false,
      matches
    };
  }

  const analysis = inferOutline(parsed.pages, { ...pdfFacts, title }, pdfTextPages);
  const nativeOutline = toNativeOutlineJson(analysis.flatOutline);
  const matches = matchesFromInferredOutline(analysis.flatOutline, blocks);
  const degradedMarkdownResult = analysis.degradedMode
    ? buildDegradedInferredMarkdown(pdfTextPages, matches, title)
    : null;
  const markdown = degradedMarkdownResult
    ? degradedMarkdownResult.markdown
    : buildInferredOutlineMarkdown(parsed.pages, matches, title, blocks);

  return {
    title,
    markdown,
    outlineArtifact: {
      outlineType: "inferred",
      outline: nativeOutline
    },
    debugArtifact: {
      pdf: pdfName,
      embeddedOutlineAvailable: false,
      inferenceSkipped: false,
      bodyFont: analysis.bodyFont,
      degradedMode: analysis.degradedMode,
      pdfJsBodyFontDiagnostic: analysis.pdfJsBodyFontDiagnostic,
      finalInferredOutline: analysis.outline,
      candidates: analysis.candidates,
      deduplicationDecisions: analysis.deduplicationDecisions,
      degradedMarkdownReconstruction: degradedMarkdownResult?.debug || null,
      matches: matches.map(toDebugMatch)
    },
    outlineType: "inferred",
    degradedMode: analysis.degradedMode,
    matches
  };
}

function reconstructPdfTextLines(items, pageIndex, pageWidth) {
  const rows = [];
  for (const item of items.sort((left, right) => left.y - right.y || left.x - right.x)) {
    const tolerance = Math.max(1.5, item.fontSize * 0.28);
    let row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= tolerance);
    if (!row) {
      row = { y: item.y, items: [] };
      rows.push(row);
    }
    row.items.push(item);
  }

  const lines = [];
  for (const row of rows.sort((left, right) => left.y - right.y)) {
    const sorted = row.items.sort((left, right) => left.x - right.x);
    let segment = [];
    for (const item of sorted) {
      const previous = segment.at(-1);
      const gap = previous ? item.x - (previous.x + previous.width) : 0;
      const crossesColumns = previous
        && previous.x < pageWidth * 0.48
        && item.x >= pageWidth * 0.5;
      const columnBreak = previous && gap > Math.max(20, previous.fontSize * 3.25)
        && (item.x > pageWidth * 0.45 || previous.hasEOL);
      if (columnBreak || crossesColumns) {
        lines.push(makePdfTextLine(segment, pageIndex));
        segment = [];
      }
      segment.push(item);
    }
    if (segment.length) lines.push(makePdfTextLine(segment, pageIndex));
  }
  return lines.filter((line) => line.text);
}

function makePdfTextLine(items, pageIndex) {
  const left = Math.min(...items.map((item) => item.x));
  const top = Math.min(...items.map((item) => item.y));
  const right = Math.max(...items.map((item) => item.x + item.width));
  const bottom = Math.max(...items.map((item) => item.y + item.height));
  return {
    pageIndex,
    text: joinPdfTextItems(items),
    items,
    bbox: { x: left, y: top, width: right - left, height: bottom - top }
  };
}

function joinPdfTextItems(items) {
  let text = "";
  let previous = null;
  for (const item of items) {
    const gap = previous ? item.x - (previous.x + previous.width) : 0;
    const needsSpace = text && gap > Math.max(0.8, item.fontSize * 0.12)
      && !/[-/(–—]\s*$/.test(text)
      && !/^[,.;:!?)]/.test(item.text);
    text += `${needsSpace ? " " : ""}${item.text}`;
    previous = item;
  }
  return collapseWhitespace(text);
}

function flattenEmbeddedOutline(items, depth = 0, output = []) {
  for (const item of items) {
    output.push({
      order: output.length,
      title: String(item.title || "").trim(),
      depth,
      destination: item.dest ?? null
    });
    flattenEmbeddedOutline(item.items || [], depth + 1, output);
  }
  return output;
}

async function resolveDestinationPage(pdfDocument, destination) {
  try {
    const explicitDestination = typeof destination === "string"
      ? await pdfDocument.getDestination(destination)
      : destination;
    const target = Array.isArray(explicitDestination) ? explicitDestination[0] : null;
    if (Number.isInteger(target)) return target;
    if (target && typeof target === "object") return await pdfDocument.getPageIndex(target);
  } catch {
    return null;
  }
  return null;
}

function serializeDestination(destination) {
  if (destination == null || typeof destination === "string") return destination ?? null;
  if (!Array.isArray(destination)) return String(destination);
  return destination.map((part) => {
    if (part && typeof part === "object" && Number.isInteger(part.num)) {
      return { num: part.num, gen: part.gen || 0 };
    }
    if (part && typeof part === "object" && typeof part.name === "string") {
      return { name: part.name };
    }
    return part ?? null;
  });
}

function collectBlocks(pages = []) {
  return pages.flatMap((page, pageOffset) => (page.blocks || []).map((block, blockIndex) => ({
    page: Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1,
    pageIndex: (Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1) - 1,
    blockIndex,
    kind: block.kind,
    text: getBlockText(block),
    bbox: block.bbox || null
  }))).filter((block) => block.text);
}

function getBlockText(block) {
  if (typeof block.text === "string") return block.text.trim();
  if (Array.isArray(block.lines)) return block.lines.join("\n").trim();
  return "";
}

function matchOutlineToBlocks(outline, blocks) {
  const usedBlocks = new Set();
  return outline.map((entry) => {
    const match = findBestBlockMatch(entry, blocks, usedBlocks);
    if (match.block) usedBlocks.add(blockKey(match.block));
    return {
      ...entry,
      matchedBlock: match.block,
      matchType: match.type,
      finalMarkdownHeadingLevel: match.block ? Math.min(entry.depth + 2, 6) : null
    };
  });
}

function matchesFromInferredOutline(outline, blocks) {
  return outline.map((entry, order) => {
    const matchedBlock = entry.anchorType === "block"
      ? blocks.find((block) =>
        block.pageIndex === entry.pageIndex && block.blockIndex === entry.blockIndex
      ) || null
      : null;
    return {
      order,
      title: entry.title,
      rawTitle: entry.rawTitle,
      depth: entry.depth,
      resolvedPageIndex: entry.pageIndex,
      resolvedPage: entry.pageIndex + 1,
      matchedBlock,
      source: entry.source,
      anchorType: entry.anchorType,
      spanText: entry.spanText,
      bbox: entry.bbox,
      matchType: entry.anchorType === "span"
        ? "inferred-source-span"
        : matchedBlock ? "inferred-source-block" : "unresolved",
      finalMarkdownHeadingLevel: Math.min(entry.depth + 2, 6)
    };
  });
}

function findBestBlockMatch(entry, blocks, usedBlocks) {
  const target = normalizeHeading(entry.title);
  if (!target) return { block: null, type: "unresolved" };
  const available = blocks.filter((block) => !usedBlocks.has(blockKey(block)));
  const samePage = entry.resolvedPageIndex == null
    ? []
    : available.filter((block) => block.pageIndex === entry.resolvedPageIndex);
  const nearbyPages = entry.resolvedPageIndex == null
    ? []
    : available.filter((block) => Math.abs(block.pageIndex - entry.resolvedPageIndex) === 1);

  for (const candidates of [samePage, nearbyPages, available]) {
    const exact = candidates.find((block) => normalizeHeading(block.text) === target);
    if (exact) return { block: exact, type: "exact" };
  }
  for (const candidates of [samePage, nearbyPages, available]) {
    const fuzzy = candidates
      .map((block) => ({ block, score: headingSimilarity(target, normalizeHeading(block.text)) }))
      .filter(({ block, score }) => isPlausibleFuzzyMatch(target, block.text, score))
      .sort((left, right) => right.score - left.score)[0];
    if (fuzzy) return { block: fuzzy.block, type: "fuzzy" };
  }
  return { block: null, type: "unresolved" };
}

function buildOutlineGuidedMarkdown(pages, matches, title, blocks) {
  const rewrites = new Map();
  for (const match of matches) {
    if (!match.matchedBlock) continue;
    rewrites.set(blockKey(match.matchedBlock), {
      title: match.title,
      level: match.finalMarkdownHeadingLevel
    });
  }

  const titleBlock = findTitleBlock(title, blocks);
  if (titleBlock) rewrites.set(blockKey(titleBlock), { title, level: 1 });
  for (const block of blocks) {
    if (block.kind === "heading" && !rewrites.has(blockKey(block))) {
      rewrites.set(blockKey(block), { title: null, level: 0 });
    }
  }

  const body = pages.map((page, pageOffset) => rewritePageMarkdown(
    page.markdown || "",
    Number.isInteger(page.pageNum) ? page.pageNum - 1 : pageOffset,
    page.blocks || [],
    rewrites
  )).join("\n\n").trim();
  return titleBlock ? `${body}\n` : `# ${title}\n\n${body}\n`;
}

function buildInferredOutlineMarkdown(pages, matches, title, blocks) {
  const blockMatches = matches.filter((match) => match.anchorType === "block");
  const spanMatches = matches.filter((match) => match.anchorType === "span");
  const rewrites = new Map();
  for (const match of blockMatches) {
    if (!match.matchedBlock) continue;
    rewrites.set(blockKey(match.matchedBlock), {
      title: match.title,
      level: match.finalMarkdownHeadingLevel
    });
  }

  const titleBlock = findTitleBlock(title, blocks);
  if (titleBlock) rewrites.set(blockKey(titleBlock), { title, level: 1 });
  for (const block of blocks) {
    if (block.kind === "heading" && !rewrites.has(blockKey(block))) {
      rewrites.set(blockKey(block), { title: null, level: 0 });
    }
  }

  const body = pages.map((page, pageOffset) => {
    const pageIndex = Number.isInteger(page.pageNum) ? page.pageNum - 1 : pageOffset;
    const blockRewritten = rewritePageMarkdown(
      page.markdown || "",
      pageIndex,
      page.blocks || [],
      rewrites
    );
    return rewriteSpanHeadings(
      blockRewritten,
      spanMatches.filter((match) => match.resolvedPageIndex === pageIndex)
    );
  }).join("\n\n").trim();
  return titleBlock ? `${body}\n` : `# ${title}\n\n${body}\n`;
}

function buildDegradedInferredMarkdown(pdfTextPages, matches, title) {
  const spacing = buildDegradedSpacingProfiles(pdfTextPages);
  const spacingCounters = { spacingFallbacks: 0, suppressedSpaces: 0 };
  const reconstructedPages = applyDegradedSpacingProfiles(
    pdfTextPages,
    spacing.profiles,
    spacingCounters
  );
  const headingAnchors = matchDegradedHeadingsToPdfLines(reconstructedPages, matches);
  const anchorsByLine = new Map();
  for (const anchor of headingAnchors.matched) {
    const key = `${anchor.pageIndex}:${anchor.lineIndex}`;
    const entries = anchorsByLine.get(key) || [];
    entries.push(anchor);
    anchorsByLine.set(key, entries);
  }

  const output = [`# ${title}`];
  let paragraph = "";
  let previousBodyLine = null;
  let linesUsed = 0;
  let linesRejectedAsNoise = 0;
  let oneColumnRegions = 0;
  let twoColumnRegions = 0;
  let readingOrderFallbacks = 0;

  const flushParagraph = () => {
    const cleaned = escapeDegradedBodyMarkdown(paragraph.trim());
    if (cleaned) output.push(cleaned);
    paragraph = "";
    previousBodyLine = null;
  };

  for (const page of reconstructedPages) {
    const orderedResult = orderDegradedPageByRegions(page, anchorsByLine);
    const orderedLines = orderedResult.lines;
    oneColumnRegions += orderedResult.oneColumnRegions;
    twoColumnRegions += orderedResult.twoColumnRegions;
    readingOrderFallbacks += orderedResult.readingOrderFallbacks;
    flushParagraph();

    for (const ordered of orderedLines) {
      const lineKey = `${page.pageIndex}:${ordered.lineIndex}`;
      const anchors = (anchorsByLine.get(lineKey) || [])
        .sort((left, right) => left.start - right.start);
      if (!anchors.length && isDegradedBodyNoise(ordered.line.text)) {
        linesRejectedAsNoise += 1;
        continue;
      }
      linesUsed += 1;

      const fragments = splitDegradedLineAtHeadings(ordered.line.text, anchors);
      for (const fragment of fragments) {
        if (fragment.type === "heading") {
          flushParagraph();
          output.push(`${"#".repeat(fragment.level)} ${fragment.title}`);
          continue;
        }

        const text = collapseWhitespace(fragment.text);
        if (!text || isDegradedBodyNoise(text)) continue;
        const canJoin = previousBodyLine
          && previousBodyLine.pageIndex === page.pageIndex
          && previousBodyLine.column === ordered.column
          && previousBodyLine.regionIndex === ordered.regionIndex
          && hasNormalDegradedLineSpacing(previousBodyLine.line, ordered.line, ordered.lineSpacing)
          && !hasSubstantialRegionChange(previousBodyLine.line, ordered.line, page.width);
        if (!canJoin) flushParagraph();
        paragraph = appendDegradedBodyLine(paragraph, text);
        previousBodyLine = {
          pageIndex: page.pageIndex,
          column: ordered.column,
          regionIndex: ordered.regionIndex,
          line: ordered.line
        };
      }
    }
  }
  flushParagraph();

  return {
    markdown: `${output.filter(Boolean).join("\n\n").trim()}\n`,
    debug: {
      pdfJsLinesUsed: linesUsed,
      linesRejectedAsNoise,
      headingsMatched: headingAnchors.matched.length,
      headingsUnresolved: headingAnchors.unresolved.map((match) => match.title),
      reliableSpacingProfiles: spacing.reliableProfileCount,
      spacingFallbacks: spacingCounters.spacingFallbacks,
      suppressedSpaces: spacingCounters.suppressedSpaces,
      oneColumnRegions,
      twoColumnRegions,
      readingOrderFallbacks
    }
  };
}

function buildDegradedSpacingProfiles(pdfTextPages) {
  const groups = new Map();
  for (const page of pdfTextPages) {
    for (const line of page.lines) {
      const items = [...line.items].sort((left, right) => left.x - right.x);
      for (let index = 1; index < items.length; index += 1) {
        const left = items[index - 1];
        const right = items[index];
        if (!areCompatibleSpacingItems(left, right)) continue;
        const fontSize = (left.fontSize + right.fontSize) / 2;
        const normalizedGap = (right.x - (left.x + left.width)) / Math.max(fontSize, 1);
        if (normalizedGap < -0.25 || normalizedGap > 2.5) continue;
        const key = degradedSpacingGroupKey(left, right);
        const samples = groups.get(key) || [];
        samples.push(normalizedGap);
        groups.set(key, samples);
      }
    }
  }

  const profiles = new Map();
  for (const [key, samples] of groups) {
    const profile = estimateDegradedSpacingSplit(samples);
    if (profile) profiles.set(key, profile);
  }
  return { profiles, reliableProfileCount: profiles.size };
}

function areCompatibleSpacingItems(left, right) {
  return normalizeFontName(left.fontName) === normalizeFontName(right.fontName)
    && Math.abs(left.fontSize - right.fontSize) <= 0.5;
}

function degradedSpacingGroupKey(left, right) {
  const fontSize = roundTo((left.fontSize + right.fontSize) / 2, 0.5).toFixed(1);
  return `${normalizeFontName(left.fontName)}|${fontSize}`;
}

function estimateDegradedSpacingSplit(samples) {
  if (samples.length < 20) return null;
  const sorted = [...samples].sort((left, right) => left - right);
  const minimumPopulation = Math.max(5, Math.ceil(sorted.length * 0.1));
  let splitIndex = -1;
  let splitGap = 0;
  for (let index = minimumPopulation; index <= sorted.length - minimumPopulation; index += 1) {
    const gap = sorted[index] - sorted[index - 1];
    if (gap > splitGap) {
      splitGap = gap;
      splitIndex = index;
    }
  }
  if (splitIndex < 0 || splitGap < 0.045) return null;
  const lowMedian = median(sorted.slice(0, splitIndex));
  const highMedian = median(sorted.slice(splitIndex));
  if (highMedian - lowMedian < 0.1) return null;
  return {
    sampleCount: sorted.length,
    threshold: (sorted[splitIndex - 1] + sorted[splitIndex]) / 2,
    lowMedian,
    highMedian
  };
}

function applyDegradedSpacingProfiles(pdfTextPages, profiles, counters) {
  return pdfTextPages.map((page) => ({
    ...page,
    lines: page.lines.map((line) => ({
      ...line,
      text: joinDegradedTextItems(line.items, profiles, counters)
    }))
  }));
}

function joinDegradedTextItems(items, profiles, counters) {
  const sorted = [...items].sort((left, right) => left.x - right.x);
  let text = "";
  let previous = null;
  for (const item of sorted) {
    if (!previous) {
      text = item.text;
      previous = item;
      continue;
    }
    const gap = item.x - (previous.x + previous.width);
    const existingNeedsSpace = gap > Math.max(0.8, item.fontSize * 0.12)
      && !/[-/(–—]\s*$/.test(text)
      && !/^[,.;:!?)]/.test(item.text);
    let needsSpace = existingNeedsSpace;
    if (areCompatibleSpacingItems(previous, item)) {
      const key = degradedSpacingGroupKey(previous, item);
      const profile = profiles.get(key);
      if (profile) {
        const normalizedGap = gap / Math.max((previous.fontSize + item.fontSize) / 2, 1);
        if (normalizedGap <= profile.threshold) {
          needsSpace = false;
          if (existingNeedsSpace) counters.suppressedSpaces += 1;
        }
      } else {
        counters.spacingFallbacks += 1;
      }
    } else {
      counters.spacingFallbacks += 1;
    }
    text += `${needsSpace ? " " : ""}${item.text}`;
    previous = item;
  }
  return text.trim();
}

function orderDegradedPageByRegions(page, anchorsByLine) {
  const verticalLines = page.lines
    .map((line, lineIndex) => ({ line, lineIndex }))
    .sort((left, right) =>
      (left.line.bbox?.y ?? 0) - (right.line.bbox?.y ?? 0)
      || (left.line.bbox?.x ?? 0) - (right.line.bbox?.x ?? 0)
    );
  const regions = [];
  let pending = [];
  const flushRegion = () => {
    if (pending.length) regions.push({ type: "content", lines: pending });
    pending = [];
  };
  for (const entry of verticalLines) {
    const key = `${page.pageIndex}:${entry.lineIndex}`;
    const separator = anchorsByLine.has(key) || isWideMidpointSeparator(entry.line, page.width);
    if (separator) {
      flushRegion();
      regions.push({ type: "separator", lines: [entry] });
    } else {
      pending.push(entry);
    }
  }
  flushRegion();

  const result = {
    lines: [],
    oneColumnRegions: 0,
    twoColumnRegions: 0,
    readingOrderFallbacks: 0
  };
  regions.forEach((region, regionIndex) => {
    if (region.type === "separator") {
      result.lines.push({
        ...region.lines[0],
        column: -1,
        regionIndex,
        lineSpacing: 14
      });
      return;
    }
    const layout = detectDegradedRegionColumns(region.lines, page.width);
    if (layout.mode === "two-column") result.twoColumnRegions += 1;
    else result.oneColumnRegions += 1;
    if (layout.fallback) result.readingOrderFallbacks += 1;
    const ordered = region.lines
      .map((entry) => ({
        ...entry,
        column: layout.mode === "two-column" && entry.line.bbox?.x >= layout.splitX ? 1 : 0,
        regionIndex
      }))
      .sort((left, right) =>
        left.column - right.column
        || (left.line.bbox?.y ?? 0) - (right.line.bbox?.y ?? 0)
        || (left.line.bbox?.x ?? 0) - (right.line.bbox?.x ?? 0)
      );
    const lineSpacing = estimateDegradedLineSpacing(
      ordered.map((entry) => entry.line),
      layout.mode,
      page.width,
      layout.splitX
    );
    result.lines.push(...ordered.map((entry) => ({ ...entry, lineSpacing })));
  });
  return result;
}

function isWideMidpointSeparator(line, pageWidth) {
  if (!line.bbox) return false;
  const right = line.bbox.x + line.bbox.width;
  return line.bbox.width >= pageWidth * 0.45
    && line.bbox.x <= pageWidth * 0.35
    && right >= pageWidth * 0.65;
}

function detectDegradedRegionColumns(entries, pageWidth) {
  const lines = entries
    .map((entry) => entry.line)
    .filter((line) => line.bbox && nonWhitespaceLength(line.text) >= 20)
    .filter((line) => !isWideMidpointSeparator(line, pageWidth));
  if (lines.length < 6) {
    return { mode: "one-column", splitX: pageWidth / 2, fallback: true };
  }
  const starts = lines.map((line) => line.bbox.x).sort((left, right) => left - right);
  let splitIndex = -1;
  let largestGap = 0;
  for (let index = 3; index <= starts.length - 3; index += 1) {
    const gap = starts[index] - starts[index - 1];
    if (gap > largestGap) {
      largestGap = gap;
      splitIndex = index;
    }
  }
  if (splitIndex < 0 || largestGap < pageWidth * 0.16) {
    return { mode: "one-column", splitX: pageWidth / 2, fallback: true };
  }
  const splitX = (starts[splitIndex - 1] + starts[splitIndex]) / 2;
  const left = lines.filter((line) => line.bbox.x < splitX);
  const right = lines.filter((line) => line.bbox.x >= splitX);
  const minimumSide = Math.max(3, Math.ceil(lines.length * 0.18));
  const gutter = Math.min(...right.map((line) => line.bbox.x))
    - median(left.map((line) => line.bbox.x + line.bbox.width));
  if (left.length < minimumSide || right.length < minimumSide || gutter < 6) {
    return { mode: "one-column", splitX: pageWidth / 2, fallback: true };
  }
  return { mode: "two-column", splitX, fallback: false };
}

function estimateDegradedLineSpacing(lines, mode, pageWidth, splitX = pageWidth * 0.48) {
  const deltas = [];
  const ordered = lines
    .filter((line) => line.bbox)
    .map((line) => ({
      line,
      column: mode === "two-column" && line.bbox.x >= splitX ? 1 : 0
    }))
    .sort((left, right) => left.column - right.column || left.line.bbox.y - right.line.bbox.y);
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].column !== ordered[index - 1].column) continue;
    const delta = ordered[index].line.bbox.y - ordered[index - 1].line.bbox.y;
    if (delta > 2 && delta < 40) deltas.push(delta);
  }
  return deltas.length ? median(deltas) : 14;
}

function matchDegradedHeadingsToPdfLines(pdfTextPages, matches) {
  const matched = [];
  const unresolved = [];
  const claimed = new Map();
  for (const match of matches) {
    const page = pdfTextPages.find((entry) => entry.pageIndex === match.resolvedPageIndex);
    if (!page) {
      unresolved.push(match);
      continue;
    }
    const anchorText = match.spanText || match.rawTitle || match.title;
    const target = normalizeSpanSearchText(anchorText);
    const compactTarget = compactDegradedText(target);
    const candidates = page.lines.map((line, lineIndex) => {
      const normalized = normalizeSpanSearchText(line.text);
      const compact = compactDegradedText(normalized);
      const textualScore = normalized === target || compact === compactTarget
        ? 100
        : normalized.startsWith(`${target} `) || compact.startsWith(compactTarget)
          ? 85
          : normalized.includes(` ${target} `) || normalized.endsWith(` ${target}`)
            ? 70
            : 0;
      const proximity = match.bbox && line.bbox
        ? Math.abs((match.bbox.y + match.bbox.height / 2) - (line.bbox.y + line.bbox.height / 2))
        : 0;
      return { line, lineIndex, textualScore, proximity };
    }).filter((candidate) => candidate.textualScore > 0)
      .sort((left, right) =>
        right.textualScore - left.textualScore
        || left.proximity - right.proximity
      );
    const selected = candidates.find((candidate) => {
      const key = `${page.pageIndex}:${candidate.lineIndex}`;
      const ranges = claimed.get(key) || [];
      const span = locateDegradedHeadingSpan(candidate.line.text, anchorText);
      return span && !ranges.some((range) => rangesOverlap(range, span));
    });
    if (!selected) {
      unresolved.push(match);
      continue;
    }
    const span = locateDegradedHeadingSpan(selected.line.text, anchorText);
    const key = `${page.pageIndex}:${selected.lineIndex}`;
    const ranges = claimed.get(key) || [];
    ranges.push(span);
    claimed.set(key, ranges);
    matched.push({
      ...match,
      pageIndex: page.pageIndex,
      lineIndex: selected.lineIndex,
      start: span.start,
      end: span.end
    });
  }
  return { matched, unresolved };
}

function locateDegradedHeadingSpan(lineText, headingText) {
  const tokens = collapseWhitespace(headingText).split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  const pattern = tokens.map(escapeRegExp).join("\\s+");
  const match = lineText.match(new RegExp(pattern, "iu"));
  if (match) return { start: match.index, end: match.index + match[0].length };
  if (compactDegradedText(lineText) === compactDegradedText(headingText)) {
    return { start: 0, end: lineText.length };
  }
  return null;
}

function compactDegradedText(value) {
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function rangesOverlap(left, right) {
  return left.start < right.end && right.start < left.end;
}

function splitDegradedLineAtHeadings(text, anchors) {
  if (!anchors.length) return [{ type: "body", text }];
  const fragments = [];
  let cursor = 0;
  for (const anchor of anchors) {
    if (anchor.start > cursor) fragments.push({ type: "body", text: text.slice(cursor, anchor.start) });
    fragments.push({
      type: "heading",
      title: anchor.title,
      level: anchor.finalMarkdownHeadingLevel
    });
    cursor = anchor.end;
  }
  if (cursor < text.length) fragments.push({ type: "body", text: text.slice(cursor) });
  return fragments;
}

function isDegradedBodyNoise(value) {
  const text = collapseWhitespace(value);
  if (!text) return true;
  if (text.length > 48) return false;
  return Boolean(degradedGarbageReason(text));
}

function hasNormalDegradedLineSpacing(previous, current, typicalSpacing) {
  if (!previous.bbox || !current.bbox) return false;
  const delta = current.bbox.y - previous.bbox.y;
  return delta >= -1 && delta <= Math.max(typicalSpacing * 1.65, 18);
}

function hasSubstantialRegionChange(previous, current, pageWidth) {
  if (!previous.bbox || !current.bbox) return true;
  return Math.abs(previous.bbox.x - current.bbox.x) > Math.max(42, pageWidth * 0.14);
}

function appendDegradedBodyLine(paragraph, line) {
  if (!paragraph) return line;
  if (/\p{L}-$/u.test(paragraph) && /^\p{Ll}/u.test(line)) {
    return `${paragraph.slice(0, -1)}${line}`;
  }
  return `${paragraph} ${line}`;
}

function escapeDegradedBodyMarkdown(value) {
  return value
    .replace(/^(```|~~~)/, "\\$1")
    .replace(/^(#{1,6})(?=\s)/, "\\$1")
    .replace(/^\|/, "\\|");
}

function rewriteSpanHeadings(markdown, matches) {
  let lines = markdown.split("\n");
  for (const match of matches) {
    const target = normalizeSpanSearchText(match.spanText || match.rawTitle || match.title);
    const lineIndex = lines.findIndex((line) => {
      const normalized = normalizeSpanSearchText(stripMarkdownLineSyntax(line));
      return normalized === target
        || normalized.startsWith(`${target} `)
        || normalized.includes(` ${target} `)
        || normalized.endsWith(` ${target}`);
    });
    if (lineIndex < 0) continue;

    const split = splitMarkdownHeadingSpan(lines[lineIndex], match.spanText || match.rawTitle);
    if (!split) continue;
    const heading = `${"#".repeat(match.finalMarkdownHeadingLevel)} ${match.title}`;
    const replacement = [];
    if (split.prefix) replacement.push(split.prefix, "");
    replacement.push(heading);
    if (split.remainder) replacement.push("", split.remainder);
    lines.splice(lineIndex, 1, ...replacement);
  }
  return lines.join("\n").trim();
}

function splitMarkdownHeadingSpan(line, spanText) {
  const leadingSyntax = line.match(/^\s{0,3}(?:#{1,6}\s+|[*_]{1,3})?/)?.[0] || "";
  const content = line.slice(leadingSyntax.length);
  const tokens = collapseWhitespace(spanText).split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  const pattern = tokens.map(escapeRegExp).join("\\s+");
  const match = content.match(new RegExp(`${pattern}(?:[*_]{1,3})?\\s*`, "iu"));
  if (!match) return null;
  return {
    prefix: content.slice(0, match.index).replace(/[*_]\s*$/, "").trim(),
    remainder: content
      .slice(match.index + match[0].length)
      .replace(/^\s*[*_:—-]+\s*/, "")
      .trim()
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSpanSearchText(value) {
  return collapseWhitespace(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function rewritePageMarkdown(markdown, pageIndex, pageBlocks, rewrites) {
  const lines = markdown.split("\n");
  const claimedLines = new Set();
  pageBlocks.forEach((block, blockIndex) => {
    const rewrite = rewrites.get(`${pageIndex}:${blockIndex}`);
    if (!rewrite) return;
    const lineIndex = findMarkdownLine(lines, getBlockText(block), claimedLines);
    if (lineIndex < 0) return;
    lines[lineIndex] = rewrite.level === 0
      ? lines[lineIndex].replace(/^(\s{0,3})#{1,6}\s+/, "$1")
      : `${"#".repeat(rewrite.level)} ${rewrite.title}`;
    claimedLines.add(lineIndex);
  });
  return lines.join("\n").trim();
}

function findMarkdownLine(lines, blockText, claimedLines) {
  const target = normalizeHeading(blockText);
  let best = { index: -1, score: 0 };
  lines.forEach((line, index) => {
    if (claimedLines.has(index)) return;
    const candidate = normalizeHeading(stripMarkdownLineSyntax(line));
    if (candidate === target) {
      best = { index, score: 1 };
      return;
    }
    const score = headingSimilarity(target, candidate);
    if (score > best.score && score >= 0.9) best = { index, score };
  });
  return best.index;
}

function stripMarkdownLineSyntax(line) {
  return line
    .replace(/^\s{0,3}#{1,6}\s+/, "")
    .replace(/^\s*(?:[-*+] |\d+[.)] )/, "")
    .replace(/[*_`]/g, "")
    .trim();
}

function normalizeHeading(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^(?:section\s+)?(?:\d+(?:\.\d+)*|[ivxlcdm]+|[a-z])(?:\s*[.):\]-]\s*|\s+)/i, "")
    .replace(/[*_`]/g, "")
    .trim();
}

function headingSimilarity(left, right) {
  if (!left || !right) return 0;
  const maxLength = Math.max(left.length, right.length);
  return maxLength ? 1 - levenshteinDistance(left, right) / maxLength : 1;
}

function isPlausibleFuzzyMatch(target, blockText, score) {
  const candidate = normalizeHeading(blockText);
  if (!candidate || score < 0.82) return false;
  return Math.min(target.length, candidate.length) / Math.max(target.length, candidate.length) >= 0.72;
}

function levenshteinDistance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function choosePaperTitle(metadataTitle, blocks, pdfName) {
  if (metadataTitle) return metadataTitle;
  return blocks.find((block) => block.kind === "heading" && block.pageIndex <= 1)?.text
    || String(pdfName || "Untitled paper").replace(/\.[^.]+$/, "");
}

function findTitleBlock(title, blocks) {
  const target = normalizeHeading(title);
  return blocks
    .filter((block) => block.pageIndex <= 1)
    .map((block) => ({ block, score: headingSimilarity(target, normalizeHeading(block.text)) }))
    .filter(({ block, score }) => normalizeHeading(block.text) === target || score >= 0.9)
    .sort((left, right) => right.score - left.score)[0]?.block || null;
}

function blockKey(block) {
  return `${block.pageIndex}:${block.blockIndex}`;
}

function toDebugMatch(match) {
  return {
    outlineTitle: match.title,
    outlineDepth: match.depth,
    resolvedPage: match.resolvedPage,
    matchedBlockText: match.matchedBlock?.text || null,
    matchedBlockPage: match.matchedBlock?.page || null,
    matchedBlockBbox: match.matchedBlock?.bbox || null,
    matchType: match.matchType,
    finalMarkdownHeadingLevel: match.finalMarkdownHeadingLevel
  };
}

function inferOutline(pages, pdfFacts, pdfTextPages) {
  const bodyFont = estimateBodyFont(pages);
  const degradedMode = bodyFont.fontSize <= 0 || bodyFont.itemCount === 0;
  const liteParseCandidates = collectCandidates(pages, bodyFont);
  const pdfJsCandidates = collectPdfJsSpanCandidates(pdfTextPages, bodyFont);
  const degradedCandidates = degradedMode
    ? collectDegradedMarkdownCandidates(pages, bodyFont)
    : [];
  const merged = mergeInferredCandidates(
    liteParseCandidates,
    [...pdfJsCandidates, ...degradedCandidates]
  );
  const candidates = merged.candidates;
  if (degradedMode) orderDegradedCandidatesByMarkdown(candidates, pages);
  const repeatedBands = findRepeatedPageBandText(candidates, pages);
  const numbered = candidates.map((candidate) => parseSectionNumber(candidate.rawTitle));
  const styleCounts = countCandidateStyles(candidates, bodyFont);
  const numberedIndentTiers = buildNumberedIndentTiers(candidates, numbered);
  const referencesStart = findReferencesStart(candidates);
  const authorNames = splitAuthorNames(pdfFacts.author);

  candidates.forEach((candidate, index) => {
    const context = {
      bodyFont,
      repeatedBands,
      numbering: numbered[index],
      numberingCoherent: hasCoherentNumbering(index, numbered),
      numberingContextValid: hasDegradedNumberingContext(index, numbered, candidates),
      repeatedStyle: (styleCounts.get(candidate.styleSignature) || 0) >= 2,
      indentationMatch: matchesIndentTier(candidate, numberedIndentTiers),
      bibliographyEntry: isBibliographyEntry(candidate, referencesStart),
      authorNames,
      documentTitle: pdfFacts.title,
      degradedMode,
      likelyDocumentTitle: candidate.pageIndex === 0
        && candidate.blockIndex === 0
        && !numbered[index]
        && candidate.fontSize >= bodyFont.fontSize + 3
    };
    scoreCandidate(candidate, context);
  });

  const admitted = candidates.filter((candidate) => candidate.admitted);
  assignDepths(admitted, numberedIndentTiers);
  const inferredTree = nestOutline(admitted.map(toOutlineItem));
  const flatOutline = flattenOutlineTree(inferredTree);
  return {
    bodyFont,
    degradedMode,
    pdfJsBodyFontDiagnostic: degradedMode ? estimatePdfJsBodyFont(pdfTextPages) : null,
    flatOutline,
    outline: inferredTree,
    candidates: candidates.map(toDebugCandidate),
    deduplicationDecisions: merged.decisions
  };
}

function orderDegradedCandidatesByMarkdown(candidates, pages) {
  const pageLines = new Map(pages.map((page, pageOffset) => {
    const pageIndex = (Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1) - 1;
    return [
      pageIndex,
      String(page.markdown || "").split("\n").map(normalizeSpanSearchText)
    ];
  }));

  for (const candidate of candidates) {
    const lines = pageLines.get(candidate.pageIndex) || [];
    const target = normalizeSpanSearchText(candidate.rawTitle);
    candidate.degradedMarkdownOrder = target.length < 4 ? null : lines.findIndex((line) =>
      line === target
      || line.startsWith(`${target} `)
      || line.includes(` ${target} `)
      || line.endsWith(` ${target}`)
    );
    if (candidate.degradedMarkdownOrder < 0) candidate.degradedMarkdownOrder = null;
  }

  candidates.sort((left, right) =>
    left.pageIndex - right.pageIndex
    || (left.degradedMarkdownOrder ?? Number.MAX_SAFE_INTEGER)
      - (right.degradedMarkdownOrder ?? Number.MAX_SAFE_INTEGER)
    || candidateColumn(left) - candidateColumn(right)
    || (left.bbox?.y ?? Number.MAX_SAFE_INTEGER) - (right.bbox?.y ?? Number.MAX_SAFE_INTEGER)
    || (left.bbox?.x ?? 0) - (right.bbox?.x ?? 0)
  );
  candidates.forEach((candidate, index) => {
    candidate.documentOrder = index;
    delete candidate.degradedMarkdownOrder;
  });
}

function toNativeOutlineJson(items) {
  return items.map((item, order) => ({
    order,
    title: item.title,
    depth: item.depth,
    destination: null,
    resolvedPageIndex: item.pageIndex,
    resolvedPage: item.pageIndex + 1
  }));
}

function estimateBodyFont(pages) {
  const styles = new Map();

  for (const page of pages) {
    const paragraphBoxes = (page.blocks || [])
      .filter((block) => ["paragraph", "list_item"].includes(block.kind))
      .filter((block) => String(block.text || "").length >= 80)
      .map((block) => block.bbox)
      .filter(Boolean);

    for (const item of page.textItems || []) {
      if (!paragraphBoxes.some((bbox) => rectContainsCenter(bbox, item))) {
        continue;
      }
      const size = effectiveFontSize(item);
      if (!(size > 0) || isBoldTextItem(item)) {
        continue;
      }
      const family = normalizeFontName(item.fontName);
      const sizeBucket = roundTo(size, 0.25);
      const key = `${family}|${sizeBucket.toFixed(2)}`;
      const weight = nonWhitespaceLength(item.text);
      const entry = styles.get(key) || {
        fontName: family,
        fontSize: sizeBucket,
        characterCoverage: 0,
        areaCoverage: 0,
        itemCount: 0
      };
      entry.characterCoverage += weight;
      entry.areaCoverage += Math.max(0, item.width || 0) * Math.max(0, item.height || 0);
      entry.itemCount += 1;
      styles.set(key, entry);
    }
  }

  const ranked = [...styles.values()].sort((left, right) =>
    right.characterCoverage - left.characterCoverage
    || right.areaCoverage - left.areaCoverage
    || right.itemCount - left.itemCount
    || left.fontSize - right.fontSize
    || left.fontName.localeCompare(right.fontName)
  );
  return ranked[0] || {
    fontName: "unknown",
    fontSize: 0,
    characterCoverage: 0,
    areaCoverage: 0,
    itemCount: 0
  };
}

function collectCandidates(pages, bodyFont) {
  const candidates = [];
  let documentOrder = 0;

  pages.forEach((page, pageOffset) => {
    const pageIndex = (Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1) - 1;
    const blocks = (page.blocks || [])
      .map((block, blockIndex) => ({ block, blockIndex }))
      .filter(({ block }) => typeof block.text === "string" && block.text.trim());

    blocks.forEach(({ block, blockIndex }) => {
      const items = (page.textItems || []).filter((item) =>
        block.bbox && rectContainsCenter(block.bbox, item)
      );
      const style = summarizeBlockStyle(block, items, bodyFont);
      const lineCount = estimateLineCount(block, items, style.fontSize);
      const gaps = measureVerticalGaps(block, blocks.map((entry) => entry.block), bodyFont.fontSize);
      const rawTitle = collapseWhitespace(block.text);
      candidates.push({
        rawTitle,
        title: stripSectionNumber(rawTitle),
        pageIndex,
        pageWidth: page.width,
        pageHeight: page.height,
        bbox: block.bbox || null,
        source: "liteparse-block",
        anchorType: "block",
        blockIndex,
        spanText: null,
        blockKind: block.kind,
        liteParseLevel: block.level ?? null,
        documentOrder: documentOrder++,
        fontName: style.fontName,
        fontSize: style.fontSize,
        bold: style.bold,
        lineCount,
        visuallyIsolated: lineCount === 1,
        extraVerticalWhitespace: gaps.extra,
        gapAbove: gaps.above,
        gapBelow: gaps.below,
        styleSignature: makeStyleSignature(style, block.bbox),
        score: 0,
        confidence: null,
        matchedSignals: [],
        rejectedSignals: [],
        admitted: false,
        admissionReason: "rejected",
        hardVeto: false
      });
    });
  });

  return candidates;
}

function collectPdfJsSpanCandidates(pdfTextPages, bodyFont) {
  const candidates = [];
  for (const page of pdfTextPages) {
    page.lines.forEach((line, lineIndex) => {
      const extracted = extractHeadingSpan(line);
      if (!extracted) return;
      const headingItems = itemsCoveringPrefix(line.items, extracted.rawTitle);
      const bbox = unionItemBbox(headingItems.length ? headingItems : line.items);
      const fontSize = Number(weightedMode(
        headingItems,
        (item) => roundTo(item.fontSize, 0.25)
      ) ?? bodyFont.fontSize);
      const fontName = String(weightedMode(
        headingItems,
        (item) => normalizeFontName(item.fontName)
      ) ?? bodyFont.fontName);
      const bold = headingItems.some((item) => isBoldTextItem({
        fontName: item.fontName,
        fontWeight: 0
      }));
      const style = { fontName, fontSize, bold };
      candidates.push({
        rawTitle: extracted.rawTitle,
        title: stripSectionNumber(extracted.rawTitle),
        pageIndex: page.pageIndex,
        pageWidth: page.width,
        pageHeight: page.height,
        bbox,
        source: "pdfjs-span",
        anchorType: "span",
        blockIndex: null,
        spanText: extracted.rawTitle,
        blockKind: null,
        liteParseLevel: null,
        documentOrder: page.pageIndex * 10000 + lineIndex,
        fontName,
        fontSize,
        bold,
        lineCount: 1,
        visuallyIsolated: true,
        extraVerticalWhitespace: Boolean(extracted.standardLabel),
        gapAbove: null,
        gapBelow: null,
        styleSignature: makeStyleSignature(style, bbox),
        score: 0,
        confidence: null,
        matchedSignals: [],
        rejectedSignals: [],
        admitted: false,
        admissionReason: "rejected",
        hardVeto: false,
        standardLabel: Boolean(extracted.standardLabel)
      });
    });
  }
  return candidates;
}

function collectDegradedMarkdownCandidates(pages, bodyFont) {
  const candidates = [];
  pages.forEach((page, pageOffset) => {
    const pageIndex = (Number.isInteger(page.pageNum) ? page.pageNum : pageOffset + 1) - 1;
    String(page.markdown || "").split("\n").forEach((rawLine, lineIndex) => {
      const markdownHeading = rawLine.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*$/);
      const visibleText = stripMarkdownLineSyntax(rawLine);
      const standardLabel = isStandardSectionLabel(visibleText);
      const standaloneAllCaps = isStandaloneAllCapsHeading(visibleText);
      if (!markdownHeading && !standardLabel && !standaloneAllCaps) return;

      const rawTitle = collapseWhitespace(visibleText);
      const matchedBlockIndex = (page.blocks || []).findIndex((block) =>
        normalizeText(getBlockText(block)) === normalizeText(rawTitle)
      );
      const matchedBlock = matchedBlockIndex >= 0 ? page.blocks[matchedBlockIndex] : null;
      candidates.push({
        rawTitle,
        title: stripSectionNumber(rawTitle),
        pageIndex,
        pageWidth: page.width,
        pageHeight: page.height,
        bbox: matchedBlock?.bbox || null,
        source: "liteparse-markdown-line",
        anchorType: "span",
        blockIndex: matchedBlockIndex >= 0 ? matchedBlockIndex : null,
        spanText: rawTitle,
        blockKind: null,
        liteParseLevel: markdownHeading ? markdownHeading[1].length : null,
        documentOrder: pageIndex * 10000 + lineIndex,
        fontName: bodyFont.fontName,
        fontSize: bodyFont.fontSize,
        bold: false,
        lineCount: 1,
        visuallyIsolated: true,
        extraVerticalWhitespace: false,
        gapAbove: null,
        gapBelow: null,
        styleSignature: `degraded-markdown|${markdownHeading?.[1].length || 0}`,
        score: 0,
        confidence: null,
        matchedSignals: [],
        rejectedSignals: [],
        admitted: false,
        admissionReason: "rejected",
        hardVeto: false,
        standardLabel,
        standaloneAllCaps,
        explicitMarkdownHeading: Boolean(markdownHeading)
      });
    });
  });
  return candidates;
}

function isStandardSectionLabel(value) {
  return /^(?:abstract|introduction|summary|conclusions?|acknowledg(?:e)?ments?|references|bibliography)$/i
    .test(collapseWhitespace(value).replace(/[:—-]+$/, ""));
}

function isStandaloneAllCapsHeading(value) {
  const text = collapseWhitespace(value);
  return text.length <= 100
    && wordCount(text) <= 12
    && isAllCaps(text)
    && (text.match(/\p{L}/gu) || []).length >= 4;
}

function estimatePdfJsBodyFont(pdfTextPages) {
  const styles = new Map();
  for (const page of pdfTextPages) {
    for (const line of page.lines) {
      for (const item of line.items) {
        const key = `${normalizeFontName(item.fontName)}|${roundTo(item.fontSize, 0.25).toFixed(2)}`;
        const entry = styles.get(key) || {
          fontName: normalizeFontName(item.fontName),
          fontSize: roundTo(item.fontSize, 0.25),
          characterCoverage: 0,
          itemCount: 0
        };
        entry.characterCoverage += nonWhitespaceLength(item.text);
        entry.itemCount += 1;
        styles.set(key, entry);
      }
    }
  }
  return [...styles.values()].sort((left, right) =>
    right.characterCoverage - left.characterCoverage
    || right.itemCount - left.itemCount
  )[0] || { fontName: "unknown", fontSize: 0, characterCoverage: 0, itemCount: 0 };
}

function extractHeadingSpan(line) {
  const text = collapseWhitespace(line.text);
  if (!text || text.length > 300) return null;

  const standardLabel = text.match(/^(Abstract|Acknowledgments?|References|Bibliography)(?=\s*[-—:]|\s|$)/i);
  if (standardLabel) return { rawTitle: standardLabel[1], standardLabel: true };

  const roman = text.match(/^([IVXLCDM]+\.)\s+([A-Z][A-Z0-9'’/&-]*(?:\s+(?:[A-Z][A-Z0-9'’/&-]*|AND|OR|OF|THE|TO|IN|WITH|FOR)){0,11})/);
  if (roman && romanToNumber(roman[1].slice(0, -1)) <= 20) {
    return { rawTitle: `${roman[1]} ${roman[2]}` };
  }

  const first = line.items[0]?.text || "";
  const second = line.items[1]?.text || "";
  if (/^[A-Z]\.$/.test(first) && second.length >= 3 && isShortHeadingPhrase(second)) {
    return { rawTitle: `${first} ${second}` };
  }
  if (/^\d+\)$/.test(first) && second.length >= 3 && isShortHeadingPhrase(second)) {
    return { rawTitle: `${first} ${second}` };
  }

  const letter = text.match(/^([A-Z]\.)\s+(.+)$/);
  if (letter) {
    const phrase = takeTitleCasePrefix(letter[2]);
    if (phrase) return { rawTitle: `${letter[1]} ${phrase}` };
  }

  const local = text.match(/^(\d+\))\s+(.+)$/);
  if (local) {
    const phrase = takeTitleCasePrefix(local[2]);
    if (phrase) return { rawTitle: `${local[1]} ${phrase}` };
  }

  const decimal = text.match(/^(\d+(?:\.\d+)*\.?)\s+(.+)$/);
  if (decimal) {
    const phrase = takeTitleCasePrefix(decimal[2]);
    const topLevel = Number(decimal[1].split(".")[0]);
    if (phrase && /\p{L}/u.test(phrase) && topLevel <= 20) {
      return { rawTitle: `${decimal[1]} ${phrase}` };
    }
  }

  if (isAllCaps(text) && wordCount(text) <= 12 && text.length <= 80) {
    const words = text.split(/\s+/);
    const enoughLetters = (text.match(/[A-Z]/g) || []).length >= 8;
    const substantialWord = words.some((word) => word.replace(/[^A-Z]/g, "").length >= 6);
    if (enoughLetters && (substantialWord || /^(?:ABSTRACT|ACKNOWLEDGMENTS?|REFERENCES|BIBLIOGRAPHY)$/.test(text))) {
      return { rawTitle: text };
    }
  }
  return null;
}

function takeTitleCasePrefix(value) {
  const words = collapseWhitespace(value).split(" ");
  const minor = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);
  const accepted = [];
  for (const word of words.slice(0, 12)) {
    const bare = word.replace(/^["'“‘(]+|["'”’),:;]+$/g, "");
    if (/^[A-Z0-9][\p{L}\p{N}'’/&-]*$/u.test(bare) || (accepted.length && minor.has(bare.toLowerCase()))) {
      accepted.push(word);
      continue;
    }
    break;
  }
  const phrase = accepted.join(" ").replace(/[,:;]+$/, "");
  return isShortHeadingPhrase(phrase) ? phrase : null;
}

function isShortHeadingPhrase(value) {
  const text = collapseWhitespace(value);
  return Boolean(text)
    && (text.match(/\p{L}/gu) || []).length >= 2
    && text.length <= 100
    && wordCount(text) <= 12
    && !/[.!?]$/.test(text);
}

function itemsCoveringPrefix(items, prefix) {
  const target = normalizeText(prefix);
  const selected = [];
  for (const item of items) {
    selected.push(item);
    const current = normalizeText(joinPdfTextItems(selected));
    if (current === target || current.length >= target.length) break;
  }
  return selected;
}

function unionItemBbox(items) {
  if (!items.length) return null;
  const left = Math.min(...items.map((item) => item.x));
  const top = Math.min(...items.map((item) => item.y));
  const right = Math.max(...items.map((item) => item.x + item.width));
  const bottom = Math.max(...items.map((item) => item.y + item.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function mergeInferredCandidates(liteParseCandidates, pdfJsCandidates) {
  const candidates = [...liteParseCandidates];
  const decisions = [];
  for (const pdfCandidate of pdfJsCandidates) {
    const duplicateIndex = candidates.findIndex((candidate) =>
      candidate.pageIndex === pdfCandidate.pageIndex
      && (
        normalizeText(candidate.title) === normalizeText(pdfCandidate.title)
        || normalizeText(candidate.rawTitle).startsWith(`${normalizeText(pdfCandidate.rawTitle)} `)
      )
      && verticallyNear(candidate.bbox, pdfCandidate.bbox)
    );
    if (duplicateIndex < 0) {
      candidates.push(pdfCandidate);
      decisions.push({ action: "kept-pdfjs-span", title: pdfCandidate.rawTitle, pageIndex: pdfCandidate.pageIndex });
      continue;
    }

    const existing = candidates[duplicateIndex];
    const lengthRatio = Math.min(existing.rawTitle.length, pdfCandidate.rawTitle.length)
      / Math.max(existing.rawTitle.length, pdfCandidate.rawTitle.length);
    const cleanWholeBlock = existing.source === "liteparse-block"
      && existing.rawTitle.length <= 100
      && existing.visuallyIsolated
      && !pdfCandidate.standardLabel
      && (
        normalizeText(existing.rawTitle) === normalizeText(pdfCandidate.rawTitle)
        || (existing.blockKind === "heading" && lengthRatio >= 0.65)
      );
    if (existing.source === "liteparse-block" && cleanWholeBlock) {
      existing.standardLabel ||= pdfCandidate.standardLabel;
      existing.standaloneAllCaps ||= pdfCandidate.standaloneAllCaps;
      existing.explicitMarkdownHeading ||= pdfCandidate.explicitMarkdownHeading;
      decisions.push({
        action: "kept-liteparse-block",
        title: existing.rawTitle,
        pageIndex: existing.pageIndex,
        discarded: pdfCandidate.rawTitle
      });
    } else {
      candidates[duplicateIndex] = pdfCandidate;
      decisions.push({
        action: "replaced-merged-block-with-pdfjs-span",
        title: pdfCandidate.rawTitle,
        pageIndex: pdfCandidate.pageIndex,
        discarded: existing.rawTitle
      });
    }
  }

  const ordered = candidates.sort((left, right) =>
    left.pageIndex - right.pageIndex
    || candidateColumn(left) - candidateColumn(right)
    || (left.bbox?.y ?? Number.MAX_SAFE_INTEGER) - (right.bbox?.y ?? Number.MAX_SAFE_INTEGER)
    || (left.bbox?.x ?? 0) - (right.bbox?.x ?? 0)
    || left.rawTitle.localeCompare(right.rawTitle)
  );
  ordered.forEach((candidate, index) => { candidate.documentOrder = index; });
  return { candidates: ordered, decisions };
}

function candidateColumn(candidate) {
  if (!candidate.bbox || !candidate.pageWidth) return 0;
  return candidate.bbox.x >= candidate.pageWidth * 0.48 ? 1 : 0;
}

function verticallyNear(left, right) {
  if (!left || !right) return true;
  const rightCenterY = right.y + right.height / 2;
  if (rightCenterY >= left.y - 2 && rightCenterY <= left.y + left.height + 2) return true;
  const leftCenter = left.y + left.height / 2;
  const rightCenter = right.y + right.height / 2;
  return Math.abs(leftCenter - rightCenter) <= Math.max(18, left.height, right.height);
}

function scoreCandidate(candidate, context) {
  const positives = [];
  const negatives = [];
  const text = candidate.rawTitle;
  const words = wordCount(text);
  const chars = text.length;
  const short80 = words <= 12 || chars <= 80;
  const short100 = words <= 12 && chars <= 100;
  const allCaps = isAllCaps(text);
  const titleCase = !allCaps && isTitleCase(text);

  if (context.numbering) addSignal(positives, "explicit hierarchical section numbering", 5);
  if (allCaps && words <= 12 && chars <= 80 && candidate.visuallyIsolated) {
    addSignal(positives, "ALL CAPS short isolated line", 4);
  }
  if (titleCase && short100 && candidate.visuallyIsolated) {
    addSignal(positives, "Title Case short isolated line", 3);
  }
  if (!context.degradedMode && candidate.bold && chars <= 100) {
    addSignal(positives, "bold or semibold", 3);
  }
  if (!context.degradedMode && candidate.fontSize >= context.bodyFont.fontSize + 1.5) {
    addSignal(positives, "font size at least body + 1.5pt", 3);
  }
  if (candidate.visuallyIsolated) addSignal(positives, "visually isolated", 2);
  if (candidate.extraVerticalWhitespace) addSignal(positives, "extra vertical whitespace", 2);
  if (context.repeatedStyle) addSignal(positives, "repeated document-wide heading style", 2);
  if (context.numberingCoherent) addSignal(positives, "coherent numbering sequence", 2);
  if (context.indentationMatch) addSignal(positives, "indentation matches established tier", 1);
  if (short80) addSignal(positives, "short heading-like length", 1);

  const caption = isCaption(text);
  if (caption) addSignal(negatives, "figure or table caption", -5);
  const repeat = context.repeatedBands.get(normalizeText(text));
  const repeatedRunningBand = repeat?.pages >= 3 || (allCaps && repeat?.pages >= 2);
  if (repeat?.pages >= 3) addSignal(negatives, "repeated running header or footer", -5);
  if (allCaps && repeat?.pages >= 2) {
    addSignal(negatives, "ALL CAPS repeated running header or footer", -5);
  }
  const authorMetadata = isAuthorAffiliationOrEmail(text, context.authorNames);
  if (authorMetadata) {
    addSignal(negatives, "author, affiliation, or email metadata", -4);
  }
  if (context.bibliographyEntry) addSignal(negatives, "bibliography or reference entry", -4);
  if (chars > 100) addSignal(negatives, "long sentence-like candidate over 100 chars", -4);
  if (context.numbering && chars > 60) {
    addSignal(negatives, "numbered candidate with body text over 60 chars", -4);
  }
  const strongEvidence = sumSignals(positives) >= 9;
  if (/[.?!]\s*$/.test(text) && !strongEvidence) {
    addSignal(negatives, "ends like a normal sentence", -3);
  }
  if (isEquationHeavy(text)) addSignal(negatives, "equation-heavy line", -3);
  if (!context.degradedMode && typographyMatchesBody(candidate, context.bodyFont)) {
    addSignal(negatives, "typography identical to body text", -2);
  }

  candidate.matchedSignals = positives;
  candidate.rejectedSignals = negatives;
  candidate.score = sumSignals(positives) + sumSignals(negatives);

  const normalizedTitle = normalizeText(context.documentTitle);
  const isDocumentTitle = (normalizedTitle && normalizeText(text) === normalizedTitle)
    || context.likelyDocumentTitle;
  if (isDocumentTitle) {
    candidate.admissionReason = "document title excluded from section outline";
    return;
  }

  const garbageReason = context.degradedMode ? degradedGarbageReason(candidate.rawTitle) : null;
  const unsupportedNumbering = context.degradedMode
    && context.numbering
    && ["letter", "local"].includes(context.numbering.kind)
    && !context.numberingContextValid;

  if (caption || repeatedRunningBand || authorMetadata || context.bibliographyEntry
    || garbageReason || unsupportedNumbering) {
    candidate.hardVeto = true;
    candidate.admissionReason = `hard veto: ${[
      caption && "caption",
      repeatedRunningBand && "running header/footer",
      authorMetadata && "author/affiliation/email metadata",
      context.bibliographyEntry && "bibliography entry",
      garbageReason,
      unsupportedNumbering && "numbering lacks degraded-mode parent/sibling context"
    ].filter(Boolean).join(", ")}`;
    return;
  }

  if (context.degradedMode && !isDegradedStructurallyStrong(candidate, context)) {
    candidate.admissionReason = "degraded rejection: no strong text-structure signal";
    return;
  }

  if (candidate.score >= 7) {
    candidate.admitted = true;
    candidate.confidence = candidate.score >= 9 ? "high" : "medium";
    candidate.admissionReason = "score threshold";
    return;
  }
  if (candidate.score >= 5 && (
    context.numberingCoherent
    || context.repeatedStyle
    || (context.degradedMode && (candidate.standardLabel || candidate.explicitMarkdownHeading))
  )) {
    candidate.admitted = true;
    candidate.confidence = "conditional";
    candidate.admissionReason = context.numberingCoherent
      ? "conditional: coherent numbering sequence"
      : "conditional: repeated document-wide heading style";
  }
}

function degradedGarbageReason(value) {
  const text = stripMarkdownLineSyntax(collapseWhitespace(value));
  const letters = text.match(/\p{L}/gu) || [];
  const words = text.match(/\p{L}+/gu) || [];
  const oneCharacterWords = words.filter((word) => word.length === 1).length;
  const meaningfulWords = words.filter((word) => word.length >= 3);
  const nonSpaceLength = nonWhitespaceLength(text);
  const punctuationLength = (text.match(/[^\p{L}\p{N}\s]/gu) || []).length;

  if (letters.length < 4) return "degraded garbage: too few alphabetic characters";
  if (/^[ivxlcdm]+$/i.test(text)) return "degraded garbage: isolated roman-like fragment";
  if (words.length >= 2 && oneCharacterWords / words.length >= 0.5) {
    return "degraded garbage: mostly one-character tokens";
  }
  if (!meaningfulWords.length) return "degraded garbage: no meaningful multi-character word";
  if (punctuationLength / Math.max(nonSpaceLength, 1) > 0.32) {
    return "degraded garbage: excessive punctuation or symbol noise";
  }
  return null;
}

function isDegradedStructurallyStrong(candidate, context) {
  return Boolean(
    candidate.standardLabel
    || isStandardSectionLabel(candidate.title)
    || candidate.explicitMarkdownHeading
    || candidate.standaloneAllCaps
    || isStandaloneAllCapsHeading(candidate.rawTitle)
    || (context.numbering && context.numberingContextValid)
  );
}

function hasDegradedNumberingContext(index, numbering, candidates) {
  const current = numbering[index];
  if (!current) return false;
  if (!isPlausibleDegradedNumberedTitle(candidates[index], current)) return false;
  if (["roman", "decimal"].includes(current.kind) && current.depth === 0) {
    return hasNearbyNumberedSibling(index, numbering, candidates, current.kind);
  }
  if (current.kind === "letter") {
    return hasPlausibleParentSection(index, numbering, candidates, new Set(["roman", "decimal"]))
      && hasNearbyNumberedSibling(index, numbering, candidates, "letter");
  }
  if (current.kind === "local") {
    return hasPlausibleParentSection(index, numbering, candidates, new Set(["letter", "roman", "decimal"]))
      && hasNearbyNumberedSibling(index, numbering, candidates, "local");
  }
  return current.depth > 0
    && hasPlausibleParentSection(index, numbering, candidates, new Set(["decimal"]))
    && hasNearbyNumberedSibling(index, numbering, candidates, "decimal");
}

function isPlausibleDegradedNumberedTitle(candidate, numbering) {
  const title = collapseWhitespace(numbering.title);
  if (isStandardSectionLabel(title) || isStandaloneAllCapsHeading(title)) return true;
  return wordCount(title) >= 2
    && wordCount(title) <= 12
    && title.length <= 100
    && isTitleCase(title)
    && !/[.!?]$/.test(title)
    && !degradedGarbageReason(title);
}

function hasNearbyNumberedSibling(index, numbering, candidates, kind) {
  const current = numbering[index];
  for (let offset = 1; offset <= 40; offset += 1) {
    for (const siblingIndex of [index - offset, index + offset]) {
      if (siblingIndex < 0 || siblingIndex >= numbering.length) continue;
      const sibling = numbering[siblingIndex];
      if (!sibling || sibling.kind !== kind || sibling.depth !== current.depth) continue;
      if (Math.abs(candidates[siblingIndex].pageIndex - candidates[index].pageIndex) > 2) continue;
      if (isCoherentPair(sibling, current) || isCoherentPair(current, sibling)) return true;
    }
  }
  return false;
}

function hasPlausibleParentSection(index, numbering, candidates, parentKinds) {
  const current = numbering[index];
  for (let parentIndex = index - 1; parentIndex >= 0; parentIndex -= 1) {
    if (candidates[index].pageIndex - candidates[parentIndex].pageIndex > 3) return false;
    const parent = numbering[parentIndex];
    if (!parent) continue;
    if (parent.depth < current.depth && parentKinds.has(parent.kind)) return true;
    if (parent.depth === 0 && current.depth > 0) return false;
  }
  return false;
}

function assignDepths(candidates, numberedIndentTiers) {
  const styleDepths = new Map();
  const establishedIndents = new Map(numberedIndentTiers);

  for (const candidate of candidates) {
    const numbering = parseSectionNumber(candidate.rawTitle);
    if (numbering) {
      candidate.depth = numbering.depth;
      rememberStyleDepth(styleDepths, candidate.styleSignature, candidate.depth);
      rememberIndent(establishedIndents, candidate.depth, candidate.bbox?.x);
      continue;
    }

    const styleDepth = mode(styleDepths.get(candidate.styleSignature) || []);
    if (styleDepth != null) {
      candidate.depth = styleDepth;
      continue;
    }

    const indentDepth = nearestIndentDepth(candidate.bbox?.x, establishedIndents);
    if (indentDepth != null) {
      candidate.depth = indentDepth;
      rememberStyleDepth(styleDepths, candidate.styleSignature, candidate.depth);
      continue;
    }

    const previous = candidates[candidates.indexOf(candidate) - 1];
    candidate.depth = inferDepthFromSequence(candidate, previous);
    rememberStyleDepth(styleDepths, candidate.styleSignature, candidate.depth);
    rememberIndent(establishedIndents, candidate.depth, candidate.bbox?.x);
  }
}

function inferDepthFromSequence(candidate, previous) {
  if (!previous) return 0;
  const xDelta = (candidate.bbox?.x ?? 0) - (previous.bbox?.x ?? 0);
  const sameTypography = candidate.fontName === previous.fontName
    && Math.abs(candidate.fontSize - previous.fontSize) <= 0.5
    && candidate.bold === previous.bold;
  if (sameTypography) return previous.depth;
  if (xDelta >= 12) return Math.min(previous.depth + 1, 5);
  if (xDelta <= -12) return Math.max(previous.depth - 1, 0);
  return previous.depth;
}

function toOutlineItem(candidate) {
  return {
    title: candidate.title,
    rawTitle: candidate.rawTitle,
    depth: candidate.depth,
    pageIndex: candidate.pageIndex,
    source: candidate.source,
    anchorType: candidate.anchorType,
    blockIndex: candidate.blockIndex,
    spanText: candidate.spanText,
    bbox: candidate.bbox,
    score: candidate.score,
    confidence: candidate.confidence,
    matchedSignals: candidate.matchedSignals,
    rejectedSignals: candidate.rejectedSignals,
    children: []
  };
}

function nestOutline(flatItems) {
  const roots = [];
  const stack = [];
  for (const source of flatItems) {
    const item = { ...source, children: [] };
    const depth = Math.min(source.depth, stack.length);
    item.depth = depth;
    while (stack.length > depth) stack.pop();
    if (depth === 0) roots.push(item);
    else stack[depth - 1].children.push(item);
    stack[depth] = item;
    stack.length = depth + 1;
  }
  return roots;
}

function flattenOutlineTree(items, output = []) {
  for (const item of items) {
    const { children, ...flatItem } = item;
    output.push(flatItem);
    flattenOutlineTree(children, output);
  }
  return output;
}

function toDebugCandidate(candidate) {
  return {
    source: candidate.source,
    anchorType: candidate.anchorType,
    title: candidate.title,
    rawTitle: candidate.rawTitle,
    depth: candidate.admitted ? candidate.depth : null,
    pageIndex: candidate.pageIndex,
    bbox: candidate.bbox,
    blockIndex: candidate.blockIndex,
    spanText: candidate.spanText,
    blockKind: candidate.blockKind,
    fontName: candidate.fontName,
    fontSize: candidate.fontSize,
    bold: candidate.bold,
    lineCount: candidate.lineCount,
    gapAbove: candidate.gapAbove,
    gapBelow: candidate.gapBelow,
    score: candidate.score,
    confidence: candidate.confidence,
    matchedSignals: candidate.matchedSignals,
    rejectedSignals: candidate.rejectedSignals,
    admitted: candidate.admitted,
    admissionReason: candidate.admissionReason,
    hardVeto: candidate.hardVeto,
    children: []
  };
}

function summarizeBlockStyle(block, items, bodyFont) {
  const fontSizes = weightedMode(items, (item) => roundTo(effectiveFontSize(item), 0.25));
  const fontNames = weightedMode(items, (item) => normalizeFontName(item.fontName));
  const totalChars = items.reduce((sum, item) => sum + nonWhitespaceLength(item.text), 0);
  const boldChars = items.reduce((sum, item) =>
    sum + (isBoldTextItem(item) ? nonWhitespaceLength(item.text) : 0), 0
  );
  return {
    fontSize: Number(fontSizes ?? bodyFont.fontSize),
    fontName: String(fontNames ?? bodyFont.fontName),
    bold: Boolean(block.bold) || (totalChars > 0 && boldChars / totalChars >= 0.6)
  };
}

function weightedMode(items, valueOf) {
  const weights = new Map();
  for (const item of items) {
    const value = valueOf(item);
    if (value == null || value === "" || (typeof value === "number" && !(value > 0))) continue;
    weights.set(value, (weights.get(value) || 0) + nonWhitespaceLength(item.text));
  }
  return [...weights.entries()].sort((left, right) =>
    right[1] - left[1] || String(left[0]).localeCompare(String(right[0]))
  )[0]?.[0];
}

function estimateLineCount(block, items, fontSize) {
  if (!items.length) return String(block.text || "").split(/\n/).length;
  const tolerance = Math.max(1.5, fontSize * 0.35);
  const rows = [];
  for (const y of items.map((item) => item.y).sort((a, b) => a - b)) {
    if (!rows.some((row) => Math.abs(row - y) <= tolerance)) rows.push(y);
  }
  return rows.length;
}

function measureVerticalGaps(block, allBlocks, bodySize) {
  if (!block.bbox) return { above: null, below: null, extra: false };
  const peers = allBlocks.filter((other) => other !== block && other.bbox
    && horizontalOverlapRatio(block.bbox, other.bbox) >= 0.15);
  const top = block.bbox.y;
  const bottom = block.bbox.y + block.bbox.height;
  const above = peers
    .map((other) => top - (other.bbox.y + other.bbox.height))
    .filter((gap) => gap >= 0)
    .sort((a, b) => a - b)[0] ?? null;
  const below = peers
    .map((other) => other.bbox.y - bottom)
    .filter((gap) => gap >= 0)
    .sort((a, b) => a - b)[0] ?? null;
  const threshold = Math.max(4, bodySize * 0.55);
  const known = [above, below].filter((gap) => gap != null);
  return {
    above,
    below,
    extra: known.length === 2
      ? known[0] >= threshold && known[1] >= threshold
      : known.length === 1 && known[0] >= threshold * 1.5
  };
}

function findRepeatedPageBandText(candidates, pages) {
  const occurrences = new Map();
  for (const candidate of candidates) {
    if (!candidate.bbox || !candidate.pageHeight) continue;
    const inBand = candidate.bbox.y <= candidate.pageHeight * 0.12
      || candidate.bbox.y + candidate.bbox.height >= candidate.pageHeight * 0.88;
    if (!inBand) continue;
    const key = normalizeText(candidate.rawTitle);
    if (!key) continue;
    const entry = occurrences.get(key) || new Set();
    entry.add(candidate.pageIndex);
    occurrences.set(key, entry);
  }
  return new Map([...occurrences].map(([key, pageSet]) => [key, { pages: pageSet.size }]));
}

function countCandidateStyles(candidates, bodyFont) {
  const counts = new Map();
  for (const candidate of candidates) {
    const preliminary = parseSectionNumber(candidate.rawTitle)
      || isAllCaps(candidate.rawTitle)
      || isTitleCase(candidate.rawTitle)
      || candidate.bold
      || candidate.fontSize >= bodyFont.fontSize + 1.5;
    if (!preliminary || !candidate.visuallyIsolated || candidate.rawTitle.length > 100) continue;
    counts.set(candidate.styleSignature, (counts.get(candidate.styleSignature) || 0) + 1);
  }
  return counts;
}

function buildNumberedIndentTiers(candidates, numbering) {
  const values = new Map();
  candidates.forEach((candidate, index) => {
    if (!numbering[index] || candidate.bbox?.x == null) return;
    const depth = numbering[index].depth;
    const positions = values.get(depth) || [];
    positions.push(candidate.bbox.x);
    values.set(depth, positions);
  });
  return new Map([...values].map(([depth, positions]) => [depth, median(positions)]));
}

function hasCoherentNumbering(index, numbering) {
  const current = numbering[index];
  if (!current) return false;
  const previous = findNeighborNumbering(numbering, index, -1);
  const next = findNeighborNumbering(numbering, index, 1);
  return isCoherentPair(previous, current) || isCoherentPair(current, next);
}

function findNeighborNumbering(numbering, start, direction) {
  for (let index = start + direction; index >= 0 && index < numbering.length; index += direction) {
    if (numbering[index]) return numbering[index];
  }
  return null;
}

function isCoherentPair(left, right) {
  if (!left || !right) return false;
  if (left.kind !== right.kind) return false;
  const a = left.values;
  const b = right.values;
  if (b.length === a.length + 1 && a.every((value, index) => value === b[index])) return true;
  if (a.length === b.length && a.slice(0, -1).every((value, index) => value === b[index])) {
    return b.at(-1) === a.at(-1) + 1;
  }
  return b.length === 1 && b[0] === a[0] + 1;
}

function matchesIndentTier(candidate, tiers) {
  if (candidate.bbox?.x == null) return false;
  return [...tiers.values()].some((x) => Math.abs(x - candidate.bbox.x) <= 8);
}

function findReferencesStart(candidates) {
  return candidates.find((candidate) => /^(references|bibliography)$/i.test(candidate.title))
    ?.documentOrder ?? null;
}

function isBibliographyEntry(candidate, referencesStart) {
  if (referencesStart == null || candidate.documentOrder <= referencesStart) return false;
  if (isStandardSectionLabel(candidate.title)) return false;
  return true;
}

function parseSectionNumber(text) {
  const value = String(text).trim();
  const roman = value.match(/^([IVXLCDM]+)\.\s+(.+)$/);
  if (roman && romanToNumber(roman[1]) <= 20) {
    return {
      token: `${roman[1]}.`,
      values: [romanToNumber(roman[1])],
      depth: 0,
      kind: "roman",
      title: roman[2]
    };
  }
  const letter = value.match(/^([A-Z])\.\s+(.+)$/);
  if (letter) {
    return {
      token: `${letter[1]}.`,
      values: [letter[1].charCodeAt(0) - 64],
      depth: 1,
      kind: "letter",
      title: letter[2]
    };
  }
  const local = value.match(/^(\d+)\)\s+(.+)$/);
  if (local) {
    return {
      token: `${local[1]})`,
      values: [Number(local[1])],
      depth: 2,
      kind: "local",
      title: local[2]
    };
  }
  const match = value.match(/^(\d+(?:\.\d+)*\.?)\s+(.+)$/);
  if (!match) return null;
  const token = match[1].replace(/\.$/, "");
  const parts = token.split(".");
  const values = parts.map(sectionPartValue);
  if (values.some((value) => value == null)) return null;
  return {
    token: match[1],
    values,
    depth: Math.max(0, parts.length - 1),
    kind: "decimal",
    title: match[2]
  };
}

function sectionPartValue(part) {
  if (/^\d+$/.test(part)) return Number(part);
  if (/^[A-Z]$/.test(part)) return part.charCodeAt(0) - 64;
  if (/^[IVXLCDM]+$/.test(part)) return romanToNumber(part);
  return null;
}

function romanToNumber(value) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return [...value].reduce((total, char, index, chars) =>
    total + (map[char] < (map[chars[index + 1]] || 0) ? -map[char] : map[char]), 0
  );
}

function stripSectionNumber(text) {
  return parseSectionNumber(text)?.title || text;
}

function isAllCaps(text) {
  const letters = [...text].filter((char) => /\p{L}/u.test(char));
  return letters.length >= 2 && letters.every((char) => char === char.toUpperCase());
}

function isTitleCase(text) {
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
  if (!words.length) return false;
  const minor = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);
  let eligible = 0;
  let titleWords = 0;
  words.forEach((word, index) => {
    const lower = word.toLowerCase();
    if (index > 0 && minor.has(lower)) return;
    eligible += 1;
    if (/^[\p{Lu}\d]/u.test(word)) titleWords += 1;
  });
  return eligible > 0 && titleWords / eligible >= 0.8;
}

function isCaption(text) {
  return /^\s*(?:figure|fig\.|table)\s*\d+[.:]?/i.test(text);
}

function isAuthorAffiliationOrEmail(text, authorNames) {
  const normalized = normalizeText(text).replace(/\d+/g, "");
  if (/@|\b(?:university|institute|department|laboratory|college|school|faculty|research center)\b/i.test(text)) {
    return true;
  }
  return authorNames.some((name) => name.length >= 5 && normalized.includes(name));
}

function splitAuthorNames(author) {
  if (!author) return [];
  return author
    .split(/\s*(?:,|;|\band\b|&)\s*/i)
    .map((name) => normalizeText(name).replace(/\d+/g, ""))
    .filter((name) => name.length >= 5);
}

function isEquationHeavy(text) {
  const symbols = (text.match(/[=<>±×÷∑∏∫√∞≈≠≤≥{}^_]/g) || []).length;
  const nonSpace = nonWhitespaceLength(text);
  return symbols >= 3 && symbols / Math.max(nonSpace, 1) >= 0.08;
}

function typographyMatchesBody(candidate, bodyFont) {
  return bodyFont.fontSize > 0
    && Math.abs(candidate.fontSize - bodyFont.fontSize) <= 0.35
    && candidate.fontName === bodyFont.fontName
    && !candidate.bold;
}

function makeStyleSignature(style, bbox) {
  return [
    style.fontName,
    roundTo(style.fontSize, 0.5).toFixed(1),
    style.bold ? "bold" : "regular",
    Math.round((bbox?.x ?? 0) / 12) * 12
  ].join("|");
}

function nearestIndentDepth(x, tiers) {
  if (x == null || !tiers.size) return null;
  const nearest = [...tiers.entries()]
    .map(([depth, tierX]) => ({ depth, distance: Math.abs(tierX - x) }))
    .sort((left, right) => left.distance - right.distance || left.depth - right.depth)[0];
  return nearest?.distance <= 8 ? nearest.depth : null;
}

function rememberStyleDepth(map, signature, depth) {
  const values = map.get(signature) || [];
  values.push(depth);
  map.set(signature, values);
}

function rememberIndent(map, depth, x) {
  if (x == null || map.has(depth)) return;
  map.set(depth, x);
}

function mode(values) {
  if (!values.length) return null;
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0] - right[0])[0][0];
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function effectiveFontSize(item) {
  if (Number(item.fontSize) > 1.5) return Number(item.fontSize);
  if (Number(item.fontHeight) > 0) return Number(item.fontHeight);
  return Number(item.height) || 0;
}

function isBoldTextItem(item) {
  return Number(item.fontWeight) >= 600 || /bold|black|heavy|semibold|demibold/i.test(item.fontName || "");
}

function normalizeFontName(value) {
  return String(value || "unknown")
    .replace(/^[A-Z]{6}\+/, "")
    .replace(/[-_,]?(?:bold|black|heavy|semibold|demibold|italic|oblique)/gi, "")
    .toLowerCase();
}

function rectContainsCenter(rect, item) {
  const x = item.x + (item.width || 0) / 2;
  const y = item.y + (item.height || 0) / 2;
  return x >= rect.x - 1 && x <= rect.x + rect.width + 1
    && y >= rect.y - 1 && y <= rect.y + rect.height + 1;
}

function horizontalOverlapRatio(left, right) {
  const overlap = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x));
  return overlap / Math.max(1, Math.min(left.width, right.width));
}

function addSignal(collection, signal, points) {
  collection.push({ signal, points });
}

function sumSignals(signals) {
  return signals.reduce((sum, entry) => sum + entry.points, 0);
}

function collapseWhitespace(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeText(value) {
  return collapseWhitespace(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function nonWhitespaceLength(value) {
  return String(value || "").replace(/\s/g, "").length;
}

function roundTo(value, step) {
  return Math.round(Number(value) / step) * step;
}

function cleanMetadataValue(value) {
  const cleaned = typeof value === "string" ? collapseWhitespace(value) : "";
  return cleaned && cleaned.toLowerCase() !== "untitled" ? cleaned : null;
}


export {
  flattenEmbeddedOutline,
  reconstructPdfTextLines,
  resolveDestinationPage,
  serializeDestination
};
