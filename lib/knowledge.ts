import fs from "node:fs";
import path from "node:path";
import { getAllWorkWithDrafts } from "./content";

const ABOUT_DIR = path.join(process.cwd(), "content", "about");
const WORK_DIR = path.join(process.cwd(), "content", "work");

/** Strip MDX scaffolding so the model reads prose, not markup. */
function toPlainText(mdx: string): string {
  return mdx
    .replace(/^---[\s\S]*?---\n/, "") // frontmatter
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // {/* TODO comments */}
    .replace(/<[A-Z][^>]*\/>/g, "") // self-closing components
    .replace(/<\/?[A-Z][^>]*>/g, "") // component open/close tags
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Everything the chatbot is allowed to know, as one string.
 *
 * At this size the whole corpus fits comfortably in a single prompt, so
 * there's no retrieval step — the model sees all of it every time, which
 * is both simpler and more accurate than chunking and ranking ~60 chunks.
 *
 * When the nine drafted write-ups are finished this will be roughly ten
 * times bigger, and that's the point to add embeddings and ranking.
 */
export function buildKnowledge(): string {
  const parts: string[] = [];

  if (fs.existsSync(ABOUT_DIR)) {
    for (const f of fs
      .readdirSync(ABOUT_DIR)
      .filter((f) => f.endsWith(".md"))
      .sort()) {
      parts.push(fs.readFileSync(path.join(ABOUT_DIR, f), "utf8").trim());
    }
  }

  const work = getAllWorkWithDrafts();

  parts.push(
    "# Work summaries\n\n" +
      work
        .map((w) => {
          const where = w.org ? ` at ${w.org}` : "";
          const role = w.role ? ` (${w.role})` : "";
          const status = w.draft
            ? "\nStatus: the full write-up for this is still being written."
            : `\nFull write-up: /work/${w.slug}`;
          return `## ${w.title}${where}${role}\n${w.category} · ${w.dates}\n${w.blurb}\nTechnologies: ${w.tags.join(", ")}${status}`;
        })
        .join("\n\n"),
  );

  // Full text of the write-ups that are actually finished
  for (const w of work.filter((w) => !w.draft)) {
    const file = path.join(WORK_DIR, w.slug, "index.mdx");
    if (!fs.existsSync(file)) continue;
    const body = toPlainText(fs.readFileSync(file, "utf8"));
    if (body) parts.push(`# Full write-up: ${w.title}\n\n${body}`);
  }

  return parts.join("\n\n---\n\n");
}
