import * as pdfjsLib from "../../vendor/pdfjs/pdf.mjs";

// Finds and crops Figure 1 of a PDF for dashboard covers.
// Adapted from PaperClip's figure.js (MIT, https://github.com/AdaZhao1211/PaperClip):
//   1. Locate Figure 1 by its caption ("Figure 1:", "Fig. 1.", ...) on the first pages.
//   2. Grow a region from the graphics next to the caption over raster images,
//      vector drawings and their labels, stopping at the caption and body text.
//   3. Settle the boundary: lines cut by the edge are pulled in when they are
//      figure labels and pushed out when they are page text.
//   4. Render just that rectangle.
// Without a caption, the first figure-sized group of embedded images is used.
// Coordinates are PDF user space (points, y up) unless noted.

if (globalThis.chrome?.runtime?.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/pdfjs/pdf.worker.mjs");
}

const { OPS } = pdfjsLib;

const MAX_PAGES = 5;
const MAX_RENDER_SCALE = 300 / 72;
const CAPTION_RE = /^(figure|fig\.?)\s*1(?:\.\d+)?\s*[:.|—–-]/i;
const CAPTION_SEARCH_PT = 160;
const GRAPHIC_GAP = 8;
const LABEL_GAP = 8;
const PAD = 3;
const MIN_FIGURE_W = 90;
const MIN_FIGURE_H = 60;
const MAX_ASPECT = 6;

const DEFAULT_IMAGE_WIDTH = 720;
const MAX_IMAGE_HEIGHT = 1600;
const IMAGE_QUALITY = 0.86;

/**
 * Resolves to { dataUrl, page, width, height } for Figure 1, or null when no
 * figure is found. The bytes are copied, so the caller keeps ownership.
 */
export async function extractFirstFigureImage(bytes, { imageWidth = DEFAULT_IMAGE_WIDTH } = {}) {
  const loadingTask = pdfjsLib.getDocument({
    data: toUint8Array(bytes).slice(),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  });
  const pdf = await loadingTask.promise;
  try {
    const found = await findFigure(pdf);
    if (!found) return null;
    const page = await pdf.getPage(found.pageNumber);
    const canvas = await renderRegion(page, found.region, imageWidth);
    return {
      dataUrl: canvas.toDataURL("image/jpeg", IMAGE_QUALITY),
      page: found.pageNumber,
      width: canvas.width,
      height: canvas.height
    };
  } finally {
    try {
      await loadingTask.destroy();
    } catch {
      // Cleanup is best-effort.
    }
  }
}

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) return bytes;
  if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
  if (ArrayBuffer.isView(bytes)) return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  throw new Error("PDF bytes must be an ArrayBuffer or typed array.");
}

// Geometry

// Affine matrices as [a, b, c, d, e, f]; mul(A, B) applies B first, then A.
function mul(A, B) {
  return [
    A[0] * B[0] + A[2] * B[1],
    A[1] * B[0] + A[3] * B[1],
    A[0] * B[2] + A[2] * B[3],
    A[1] * B[2] + A[3] * B[3],
    A[0] * B[4] + A[2] * B[5] + A[4],
    A[1] * B[4] + A[3] * B[5] + A[5]
  ];
}

function apply(M, x, y) {
  return [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
}

function transformBox(M, x1, y1, x2, y2) {
  const points = [apply(M, x1, y1), apply(M, x2, y1), apply(M, x1, y2), apply(M, x2, y2)];
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
}

const EMPTY_BOX = { x1: 0, y1: 0, x2: 0, y2: 0 };
const boxW = (box) => box.x2 - box.x1;
const boxH = (box) => box.y2 - box.y1;
const area = (box) => Math.max(0, boxW(box)) * Math.max(0, boxH(box));

function intersect(a, b) {
  const box = { x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1), x2: Math.min(a.x2, b.x2), y2: Math.min(a.y2, b.y2) };
  return box.x2 > box.x1 && box.y2 > box.y1 ? box : null;
}

function union(a, b) {
  return { x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) };
}

function near(a, b, gap) {
  return a.x1 - gap <= b.x2 && b.x1 - gap <= a.x2 && a.y1 - gap <= b.y2 && b.y1 - gap <= a.y2;
}

const contains = (outer, inner) =>
  inner.x1 >= outer.x1 - 0.5 && inner.x2 <= outer.x2 + 0.5 && inner.y1 >= outer.y1 - 0.5 && inner.y2 <= outer.y2 + 0.5;

const hOverlap = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
const vOverlap = (a, b) => Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);

// Page contents: graphics and text lines

const PAINT_OPS = new Set([
  OPS.fill, OPS.eoFill, OPS.stroke, OPS.closeStroke, OPS.fillStroke,
  OPS.eoFillStroke, OPS.closeFillStroke, OPS.closeEOFillStroke
]);
const FILL_ONLY_OPS = new Set([OPS.fill, OPS.eoFill]);

function isWhite(args) {
  const value = args && args[0];
  if (typeof value === "string") return /^#?(f{6}|f{3})$/i.test(value);
  if (Array.isArray(args) && args.length >= 3 && args.every((n) => typeof n === "number")) {
    const max = Math.max(...args) > 1 ? 255 : 1;
    return args.slice(0, 3).every((n) => n >= 0.98 * max);
  }
  return false;
}

// Boxes of everything painted except text: raster images and vector paths,
// clipped to the active clip. White fills and page-sized shapes are skipped.
async function pageGraphics(page, pageBox) {
  const ops = await page.getOperatorList();
  const pageArea = area(pageBox);
  const out = [];
  let state = { ctm: [1, 0, 0, 1, 0, 0], clip: pageBox, white: false };
  const stack = [];
  let pendingClip = false;

  const add = (box, kind) => {
    const clipped = intersect(box, state.clip);
    if (!clipped || area(clipped) > pageArea * 0.5) return;
    if (boxW(clipped) < 0.5 && boxH(clipped) < 0.5) return;
    out.push({ ...clipped, kind });
  };

  for (let index = 0; index < ops.fnArray.length; index += 1) {
    const fn = ops.fnArray[index];
    const args = ops.argsArray[index];
    switch (fn) {
      case OPS.save:
        stack.push(state);
        state = { ...state };
        break;
      case OPS.restore:
        if (stack.length) state = stack.pop();
        break;
      case OPS.transform:
        state.ctm = mul(state.ctm, args);
        break;
      case OPS.paintFormXObjectBegin: {
        stack.push(state);
        state = { ...state };
        if (Array.isArray(args[0]) && args[0].length === 6) state.ctm = mul(state.ctm, args[0]);
        const bbox = args[1];
        if (Array.isArray(bbox) && bbox.length === 4) {
          state.clip = intersect(state.clip, transformBox(state.ctm, ...bbox)) || EMPTY_BOX;
        }
        break;
      }
      case OPS.paintFormXObjectEnd:
        if (stack.length) state = stack.pop();
        break;
      case OPS.beginGroup:
        stack.push(state);
        state = { ...state };
        if (args[0] && Array.isArray(args[0].matrix)) state.ctm = mul(state.ctm, args[0].matrix);
        break;
      case OPS.endGroup:
        if (stack.length) state = stack.pop();
        break;
      case OPS.clip:
      case OPS.eoClip:
        pendingClip = true;
        break;
      case OPS.setFillRGBColor:
      case OPS.setFillGray:
      case OPS.setFillCMYKColor:
      case OPS.setFillColor:
        state.white = isWhite(args);
        break;
      case OPS.setFillColorN:
      case OPS.setFillColorSpace:
        state.white = false;
        break;
      case OPS.constructPath: {
        const [paintOp, , minMax] = args;
        if (!minMax || !Number.isFinite(minMax[0])) {
          pendingClip = false;
          break;
        }
        const box = transformBox(state.ctm, minMax[0], minMax[1], minMax[2], minMax[3]);
        if (pendingClip) {
          state.clip = intersect(state.clip, box) || EMPTY_BOX;
          pendingClip = false;
        }
        if (PAINT_OPS.has(paintOp) && !(FILL_ONLY_OPS.has(paintOp) && state.white)) add(box, "path");
        break;
      }
      case OPS.paintImageXObject:
      case OPS.paintInlineImageXObject:
        add(transformBox(state.ctm, 0, 0, 1, 1), "image");
        break;
      case OPS.paintImageMaskXObject:
        add(transformBox(state.ctm, 0, 0, 1, 1), "path");
        break;
      default:
        break;
    }
  }
  return out;
}

// Text runs merged into lines, each with its box, text and font size.
async function textLines(page) {
  const { items } = await page.getTextContent();
  const runs = [];
  for (const item of items) {
    if (!item.str || !item.str.trim()) continue;
    const [a, b, c, d, x, y] = item.transform;
    const size = Math.hypot(c, d) || item.height || 1;
    const vertical = Math.abs(b) > Math.abs(a);
    const box = vertical
      ? { x1: x - size, x2: x + size * 0.25, y1: Math.min(y, y + item.width), y2: Math.max(y, y + item.width) }
      : { x1: x, x2: x + item.width, y1: y - size * 0.25, y2: y + size * 0.85 };
    runs.push({ ...box, str: item.str, size, base: y, vertical });
  }
  runs.sort((p, q) => (q.base - p.base) || (p.x1 - q.x1));

  const lines = [];
  for (const run of runs) {
    let line = null;
    if (!run.vertical) {
      for (let index = lines.length - 1; index >= 0 && index >= lines.length - 12; index -= 1) {
        const candidate = lines[index];
        if (candidate.vertical) continue;
        if (Math.abs(candidate.base - run.base) < 0.5 * Math.min(candidate.size, run.size) &&
            run.x1 - candidate.x2 < 1.2 * Math.max(candidate.size, run.size) && run.x1 >= candidate.x1 - 1) {
          line = candidate;
          break;
        }
      }
    }
    if (line) {
      const space = run.x1 - line.x2 > 0.15 * run.size ? " " : "";
      line.str += space + run.str;
      line.x2 = Math.max(line.x2, run.x2);
      line.y1 = Math.min(line.y1, run.y1);
      line.y2 = Math.max(line.y2, run.y2);
      line.size = Math.max(line.size, run.size);
    } else {
      lines.push({ ...run });
    }
  }
  for (const line of lines) line.str = line.str.replace(/\s+/g, " ").trim();
  return lines;
}

// Most common font size, weighted by amount of text: the body text size.
function bodyFontSize(lines) {
  const weight = new Map();
  for (const line of lines) {
    const size = Math.round(line.size * 2) / 2;
    weight.set(size, (weight.get(size) || 0) + line.str.length);
  }
  let best = 10;
  let bestWeight = -1;
  for (const [size, total] of weight) {
    if (total > bestWeight) {
      best = size;
      bestWeight = total;
    }
  }
  return best;
}

// Finding the figure

// The caption line of Figure 1 plus the lines that continue it.
function captionBlock(lines, captionLine) {
  let block = { x1: captionLine.x1, y1: captionLine.y1, x2: captionLine.x2, y2: captionLine.y2 };
  const members = new Set([captionLine]);
  let last = captionLine;
  const below = lines
    .filter((line) => !line.vertical && line.base < captionLine.base)
    .sort((p, q) => q.base - p.base);
  for (const line of below) {
    if (line.y2 < last.y1 - last.size * 0.9) break;
    if (hOverlap(line, block) <= 0) continue;
    if (Math.abs(line.size - captionLine.size) > 1.5) break;
    block = union(block, line);
    members.add(line);
    last = line;
  }
  return { box: block, members };
}

// Groups of nearly touching raster images; the first one sized like a figure.
function firstImageCluster(graphics) {
  const tiles = graphics.filter((g) => g.kind === "image" && boxW(g) >= 20 && boxH(g) >= 20);
  const used = new Set();
  for (let i = 0; i < tiles.length; i += 1) {
    if (used.has(i)) continue;
    used.add(i);
    let region = { ...tiles[i] };
    let grew = true;
    while (grew) {
      grew = false;
      for (let j = 0; j < tiles.length; j += 1) {
        if (used.has(j) || !near(region, tiles[j], 14)) continue;
        used.add(j);
        region = union(region, tiles[j]);
        grew = true;
      }
    }
    const w = boxW(region);
    const h = boxH(region);
    if (w >= MIN_FIGURE_W && h >= MIN_FIGURE_H && w / h <= MAX_ASPECT && h / w <= MAX_ASPECT) return region;
  }
  return null;
}

// Grow `seed` into the whole figure and settle its boundary.
// `allowed(box)` limits where the figure may extend (e.g. above its caption).
function growFigure(seed, graphics, lines, caption, pageBox, allowed) {
  const body = bodyFontSize(lines);
  const bodyLines = lines.filter((line) => !line.vertical && Math.abs(line.size - body) <= 0.6);
  const sortedWidths = bodyLines.map(boxW).sort((a, b) => a - b);
  const columnWidth = sortedWidths[Math.floor(sortedWidths.length * 0.9)] || boxW(pageBox) / 2;

  const isCaption = (line) => caption && caption.members.has(line);
  // Caption, body paragraphs, headings and the title block are page text.
  const isPageText = (line) => isCaption(line) ||
    (!line.vertical && Math.abs(line.size - body) <= 0.6 && boxW(line) >= 0.45 * columnWidth) ||
    line.size > body * 1.5;

  const usableGraphics = graphics.filter(allowed);
  const labels = lines.filter((line) => !isPageText(line) && allowed(line));

  let region = { ...seed };
  // Side-by-side panels under the caption's width belong to the figure,
  // however wide the gap between them.
  const sidePanel = (g) => caption &&
    hOverlap(g, caption.box) >= 0.5 * boxW(g) &&
    vOverlap(region, g) >= 0.5 * Math.min(boxH(g), boxH(region));

  const inFigure = new Set();
  let grew = true;
  while (grew) {
    grew = false;
    for (const g of usableGraphics) {
      if (!inFigure.has(g) && (near(region, g, GRAPHIC_GAP) || sidePanel(g))) {
        inFigure.add(g);
        region = union(region, g);
        grew = true;
      }
    }
    for (const line of labels) {
      if (!inFigure.has(line) && near(region, line, LABEL_GAP)) {
        inFigure.add(line);
        region = union(region, line);
        grew = true;
      }
    }
  }

  for (let pass = 0; pass < 4; pass += 1) {
    let changed = false;
    for (const line of lines) {
      if (!intersect(region, line) || contains(region, line)) continue;
      if (!isPageText(line) && allowed(line)) {
        region = union(region, line);
      } else if ((line.y1 + line.y2) / 2 > (region.y1 + region.y2) / 2) {
        region = { ...region, y2: Math.min(region.y2, line.y1 - 0.5) };
      } else {
        region = { ...region, y1: Math.max(region.y1, line.y2 + 0.5) };
      }
      changed = true;
    }
    if (!changed) break;
  }

  // Page text wholly above or below every graphic inside (e.g. an author line) is trimmed off.
  const graphicsInside = usableGraphics.filter((g) => intersect(region, g));
  if (graphicsInside.length) {
    const graphicsTop = Math.max(...graphicsInside.map((g) => g.y2));
    const graphicsBottom = Math.min(...graphicsInside.map((g) => g.y1));
    for (const line of lines) {
      if (!isPageText(line) || !contains(region, line)) continue;
      if (line.y1 >= graphicsTop) region = { ...region, y2: Math.min(region.y2, line.y1 - 0.5) };
      else if (line.y2 <= graphicsBottom) region = { ...region, y1: Math.max(region.y1, line.y2 + 0.5) };
    }
  }

  region = {
    x1: Math.max(pageBox.x1, region.x1 - PAD),
    y1: Math.max(pageBox.y1, region.y1 - PAD),
    x2: Math.min(pageBox.x2, region.x2 + PAD),
    y2: Math.min(pageBox.y2, region.y2 + PAD)
  };
  for (const line of lines) {
    if (!isPageText(line) || !intersect(region, line) || (contains(region, line) && !isCaption(line))) continue;
    if ((line.y1 + line.y2) / 2 > (region.y1 + region.y2) / 2) region.y2 = Math.min(region.y2, line.y1 - 0.5);
    else region.y1 = Math.max(region.y1, line.y2 + 0.5);
  }
  return region;
}

async function findFigure(pdf) {
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  const scanned = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const [x1, y1, x2, y2] = page.view;
    const pageBox = { x1, y1, x2, y2 };
    const lines = await textLines(page);
    const captionLine = lines
      .filter((line) => !line.vertical && CAPTION_RE.test(line.str))
      .sort((p, q) => q.base - p.base)[0];
    const entry = { pageNumber, page, pageBox, lines, graphics: null };
    scanned.push(entry);
    if (!captionLine) continue;

    const caption = captionBlock(lines, captionLine);
    entry.graphics = await pageGraphics(page, pageBox);
    const captionBox = caption.box;

    // Figures sit above their caption; occasionally below.
    for (const side of ["above", "below"]) {
      const allowed = side === "above"
        ? (box) => box.y1 >= captionBox.y2 - 0.5
        : (box) => box.y2 <= captionBox.y1 + 0.5;
      const distance = (g) => (side === "above" ? g.y1 - captionBox.y2 : captionBox.y1 - g.y2);
      const seed = entry.graphics
        .filter((g) => allowed(g) && hOverlap(g, captionBox) > 0 && distance(g) <= CAPTION_SEARCH_PT)
        .sort((p, q) => distance(p) - distance(q))[0];
      if (seed) {
        return { pageNumber, region: growFigure(seed, entry.graphics, lines, caption, pageBox, allowed) };
      }
    }
  }

  for (const entry of scanned) {
    entry.graphics ||= await pageGraphics(entry.page, entry.pageBox);
    const seed = firstImageCluster(entry.graphics);
    if (seed) {
      return {
        pageNumber: entry.pageNumber,
        region: growFigure(seed, entry.graphics, entry.lines, null, entry.pageBox, () => true)
      };
    }
  }
  return null;
}

// Render just `region` of the page, sized for a dashboard cover.
async function renderRegion(page, region, imageWidth) {
  const scale = Math.min(
    MAX_RENDER_SCALE,
    imageWidth / Math.max(1, boxW(region)),
    MAX_IMAGE_HEIGHT / Math.max(1, boxH(region))
  );
  const viewport = page.getViewport({ scale });
  const [vx1, vy1] = apply(viewport.transform, region.x1, region.y1);
  const [vx2, vy2] = apply(viewport.transform, region.x2, region.y2);
  const left = Math.floor(Math.min(vx1, vx2));
  const top = Math.floor(Math.min(vy1, vy2));
  const width = Math.max(1, Math.ceil(Math.abs(vx2 - vx1)));
  const height = Math.max(1, Math.ceil(Math.abs(vy2 - vy1)));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  await page.render({
    canvas,
    canvasContext: context,
    viewport,
    transform: [1, 0, 0, 1, -left, -top],
    // "display" paces rendering with requestAnimationFrame, which stalls in
    // background tabs; "print" renders straight through.
    intent: "print"
  }).promise;
  return canvas;
}
