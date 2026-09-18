import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SKILL_DIR = path.resolve(SCRIPT_DIR, "../.agents/skills/paper-reading");
const SKILL_DIR = path.resolve(
  String(process.env.PAPER_CHAT_READING_SKILL_DIR || DEFAULT_SKILL_DIR)
);
const SHARED_REFERENCE = "evidence-and-citations.md";
const MODE_REFERENCES = Object.freeze({
  "single-paper": "single-paper.md",
  "comparative-reading": "comparative-reading.md"
});

export function inferPaperReadingMode(contextPack) {
  const mode = String(contextPack?.mode || "").trim();
  if (mode === "comparative-reading" || contextPack?.kind === "comparison-context-pack") {
    return "comparative-reading";
  }
  return "single-paper";
}

export async function loadPaperReadingSkillPrompt(contextPack) {
  const mode = inferPaperReadingMode(contextPack);
  return buildSkillPrompt(mode);
}

async function buildSkillPrompt(mode) {
  const modeReference = MODE_REFERENCES[mode];
  const [entrypoint, sharedGuidance, modeGuidance] = await Promise.all([
    readSkillFile("SKILL.md"),
    readSkillFile("references", SHARED_REFERENCE),
    readSkillFile("references", modeReference)
  ]);

  return [
    "Paper-reading skill instructions:",
    "The references required for this request are embedded below; do not try to read them from disk.",
    stripYamlFrontmatter(entrypoint),
    "",
    `Shared reference (${SHARED_REFERENCE}):`,
    sharedGuidance,
    "",
    `Mode reference (${modeReference}):`,
    modeGuidance
  ].join("\n").trim();
}

async function readSkillFile(...segments) {
  const filename = path.join(SKILL_DIR, ...segments);
  try {
    return (await readFile(filename, "utf8")).trim();
  } catch (error) {
    throw new Error(`Could not load paper-reading skill file ${filename}: ${error.message || error}`);
  }
}

function stripYamlFrontmatter(markdown) {
  return String(markdown || "").replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "").trim();
}
