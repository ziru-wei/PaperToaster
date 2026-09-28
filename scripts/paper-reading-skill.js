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

// Skill files are static for the lifetime of the bridge process. The combined
// markdown below is written into AGENTS.md (see local-agent-agents-file.js)
// instead of being injected into every first-turn prompt, so Codex picks up
// edits to these files on its next invocation without needing a bridge
// restart or a session-invalidating "skill changed" check. Cache it once per
// process; restart the bridge if you edit the skill files during development.
let cachedSkillMarkdown = null;

export async function loadPaperReadingSkillMarkdown() {
  if (!cachedSkillMarkdown) {
    cachedSkillMarkdown = buildSkillMarkdown().catch((error) => {
      cachedSkillMarkdown = null;
      throw error;
    });
  }
  return cachedSkillMarkdown;
}

async function buildSkillMarkdown() {
  const [entrypoint, sharedGuidance, singlePaperGuidance, comparativeGuidance] = await Promise.all([
    readSkillFile("SKILL.md"),
    readSkillFile("references", SHARED_REFERENCE),
    readSkillFile("references", MODE_REFERENCES["single-paper"]),
    readSkillFile("references", MODE_REFERENCES["comparative-reading"])
  ]);

  return [
    "Paper-reading skill instructions.",
    "Every request states its mode with a `Mode: single-paper` or `Mode: comparative-reading` line;" +
      " apply only the mode reference section below that matches it.",
    "",
    stripYamlFrontmatter(entrypoint),
    "",
    `Shared reference (${SHARED_REFERENCE}):`,
    sharedGuidance,
    "",
    `Mode reference for "single-paper" (${MODE_REFERENCES["single-paper"]}):`,
    singlePaperGuidance,
    "",
    `Mode reference for "comparative-reading" (${MODE_REFERENCES["comparative-reading"]}):`,
    comparativeGuidance
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
