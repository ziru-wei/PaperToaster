import test from "node:test";
import assert from "node:assert/strict";
import {
  PAPER_VIEW,
  migrateLegacyPaperListColumns,
  normalizePaperViewProperties,
  reorderPaperProperties
} from "../src/dashboard/paper-properties.js";
import { SETTINGS_KEYS, entryId, validateReplica, SYNC_SCHEMA, SYNC_VERSION } from "../src/sync/sync-model.js";

const visibleIds = (properties) => properties.filter((property) => property.visible).map((property) => property.id);

test("stored view properties survive a normalize round trip", () => {
  const configured = normalizePaperViewProperties();
  configured[PAPER_VIEW.LIST] = reorderPaperProperties(configured[PAPER_VIEW.LIST], ["label", "title"])
    .map((property) => property.id === "title" ? { ...property, width: 410 } : property)
    .map((property) => property.id === "star" ? { ...property, visible: false } : property);
  const restored = normalizePaperViewProperties(JSON.parse(JSON.stringify(configured)));
  assert.deepEqual(restored, configured);
});

test("properties added after a config was saved slot in after their default predecessor", () => {
  const restored = normalizePaperViewProperties({ list: [{ id: "label", visible: false }, { id: "title", visible: true, width: 300 }] });
  const ids = restored.list.map((property) => property.id);
  assert.deepEqual(ids.slice(0, 2), ["star", "figure"]);
  assert.ok(ids.indexOf("label") < ids.indexOf("title"), "saved order is kept");
  assert.equal(ids[ids.indexOf("title") + 1], "authors");
  assert.equal(restored.list.find((property) => property.id === "title").width, 300);
  assert.equal(restored.list.find((property) => property.id === "label").visible, false);
  assert.equal(restored.list.length, normalizePaperViewProperties().list.length);
});

test("removed properties are dropped from saved configs", () => {
  const restored = normalizePaperViewProperties({ list: [{ id: "pages", visible: true }, { id: "source", visible: true }] });
  assert.ok(!restored.list.some((property) => property.id === "pages" || property.id === "source"));
});

test("legacy list columns migrate latestAsk to savedAsk in place", () => {
  const restored = normalizePaperViewProperties({
    list: migrateLegacyPaperListColumns([
      { id: "title", visible: true, width: 420 },
      { id: "latestAsk", visible: true, width: 120 },
      { id: "star", visible: false, width: 36 }
    ])
  });
  assert.deepEqual(visibleIds(restored.list).filter((id) => id === "title" || id === "savedAsk"), ["title", "savedAsk"]);
  assert.equal(restored.list[0].width, 420);
  assert.equal(restored.list.find((property) => property.id === "star").visible, false);
});

test("sync accepts both current and legacy dashboard layout keys", () => {
  for (const key of ["dashboardPaperViewProperties", "dashboardPaperViewSettings", "dashboardPaperListColumns", "dashboardPaperMessageRingsVisible"]) {
    assert.ok(SETTINGS_KEYS.includes(key), key);
    const id = entryId("settings", key);
    validateReplica({
      schema: SYNC_SCHEMA,
      version: SYNC_VERSION,
      deviceId: "device",
      entries: { [id]: { clock: 1, deviceId: "device", deleted: false, value: [] } }
    });
  }
});

test("venues abbreviate without mixing up full papers and other tracks", async () => {
  const { abbreviateVenue } = await import("../src/dashboard/venue-abbreviation.js");
  const cases = [
    ["Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems", "CHI"],
    ["International Conference on Human Factors in Computing Systems", "CHI"],
    ["Extended Abstracts of the 2023 CHI Conference on Human Factors in Computing Systems", "CHI EA"],
    ["CHI Extended Abstracts", "CHI EA"],
    ["CHI '24 Workshop on Human-Centered Explainable AI", "CHI Workshop"],
    ["Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology", "UIST"],
    ["Adjunct Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology", "UIST Adjunct"],
    ["Proceedings of the 2022 ACM Designing Interactive Systems Conference", "DIS"],
    ["Companion Publication of the 2021 ACM Designing Interactive Systems Conference", "DIS Companion"],
    ["2023 IEEE International Symposium on Mixed and Augmented Reality (ISMAR)", "ISMAR"],
    ["2023 IEEE International Symposium on Mixed and Augmented Reality Adjunct (ISMAR-Adjunct)", "ISMAR Adjunct"],
    ["Proceedings of the Annual Symposium on Computer-Human Interaction in Play", "CHI PLAY"],
    ["Neural Information Processing Systems", "NeurIPS"],
    ["Journal of Something Else", "Journal of Something Else"]
  ];
  for (const [venue, expected] of cases) assert.equal(abbreviateVenue(venue), expected, venue);
});

test("label columns keep the original column, and papers carry several labels per column", async () => {
  const columns = await import("../src/storage/label-columns.js");
  const settings = columns.normalizeLabelColumns({ columns: [{ id: "labels-a", name: " Topic " }, { id: "bad id!", name: "x" }] });
  assert.deepEqual(settings.columns.map((column) => [column.id, column.name]), [["label", "Label"], ["labels-a", "Topic"]]);

  const legacy = { documentKey: "p", group: "Vision", groupTone: 2 };
  assert.deepEqual(columns.getPaperLabels(legacy, "label"), ["Vision"]);
  assert.deepEqual(columns.getPaperLabels(legacy, "labels-a"), []);

  const updated = columns.withPaperLabels(legacy, "label", ["LLM", "vision", "Vision ", "Agents"]);
  assert.deepEqual(updated.labels.label, ["LLM", "vision", "Agents"]);
  assert.equal(updated.group, "LLM");
  const topic = columns.withPaperLabels(updated, "labels-a", ["HCI"]);
  assert.deepEqual(columns.getPaperLabels(topic, "labels-a"), ["HCI"]);
  assert.deepEqual(columns.getPaperLabels(topic, "label"), ["LLM", "vision", "Agents"]);

  // New labels take unused colors first, keep a legacy color, and repeat after ten.
  assert.equal(columns.getLabelTone(settings, "label", "Vision", 2), 2);
  let colored = settings;
  const names = Array.from({ length: 12 }, (_, index) => `L${index}`);
  colored = columns.withTonesForNewLabels(colored, "labels-a", names, []);
  const tones = names.map((name) => colored.colors["labels-a"][name.toLowerCase()]);
  assert.deepEqual(tones.slice(0, 10).sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.ok(tones.slice(10).every((tone) => tone >= 0 && tone < 10));
  assert.equal(columns.withTonesForNewLabels(colored, "labels-a", ["L0"], names), colored, "existing colors are kept");
});

test("abstract-only agent documents keep the opening and Abstract with the full paper's span ids", async () => {
  const { createMarkdownSourceSpans } = await import("../src/pdf/chunk-document.js");
  const { selectAbstractSpans } = await import("../src/ai/abstract-document.js");
  const filler = (word) => `${word} `.repeat(400);
  const markdown = [
    "# A Study of Things\n\nAda Lovelace, Alan Turing\n\n",
    `## Abstract\n\n${filler("abstract")}\n\n`,
    `## 1 Introduction\n\n${filler("intro")}\n\n`,
    `## 2 Method\n\n${filler("method")}\n`
  ].join("");
  const spans = createMarkdownSourceSpans(markdown, { maxChars: 1200 });
  const selected = selectAbstractSpans(spans);
  assert.ok(selected.length >= 2 && selected.length < spans.length);
  assert.equal(selected[0].id, spans[0].id, "starts with the opening");
  const text = markdown.slice(selected[0].markdownStart, selected.at(-1).markdownEnd);
  assert.ok(text.includes("Ada Lovelace") && text.includes("abstract abstract"));
  assert.ok(!text.includes("intro intro") && !text.includes("method method"));
  // Without an Abstract heading, about a page of the opening is used.
  const noAbstract = createMarkdownSourceSpans(`# Title\n\n${filler("opening")}\n\n## Introduction\n\n${filler("intro")}`, { maxChars: 1200 });
  const fallback = selectAbstractSpans(noAbstract);
  assert.ok(fallback.length >= 1 && fallback.length < noAbstract.length);
});
