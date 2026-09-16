import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, type WorkMeta, type WorkItem } from "./types";

const WORK_DIR = path.join(process.cwd(), "content", "work");

/**
 * Drafts are visible while you're working locally and invisible on the
 * live site. `npm run dev` shows everything; `npm run build` — which is
 * what Vercel runs — drops anything marked draft.
 */
const SHOW_DRAFTS = process.env.NODE_ENV === "development";

// ═══════════════════════════════════════════════════════════════
// Validation
// Runs at build time. A typo in a meta.json stops the build with
// a message naming the folder and the field, rather than letting
// a half-broken card reach the site.
// ═══════════════════════════════════════════════════════════════

function validate(raw: unknown, slug: string): WorkMeta {
  const m = raw as Record<string, unknown>;
  const fail = (msg: string): never => {
    throw new Error(`content/work/${slug}/meta.json — ${msg}`);
  };

  if (typeof m.title !== "string" || !m.title) fail("`title` is required");
  if (typeof m.blurb !== "string" || !m.blurb) fail("`blurb` is required");
  if (typeof m.dates !== "string" || !m.dates) fail("`dates` is required");
  if (!Array.isArray(m.tags)) fail("`tags` must be an array");
  if (!CATEGORIES.includes(m.category as never)) {
    fail(`\`category\` must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (m.links !== undefined && !Array.isArray(m.links)) {
    fail("`links` must be an array (use [] if there are none)");
  }
  if (m.draft !== undefined && typeof m.draft !== "boolean") {
    fail("`draft` must be true or false");
  }

  return {
    ...(m as object),
    slug,
    links: (m.links as WorkMeta["links"]) ?? [],
    order: typeof m.order === "number" ? m.order : 0,
  } as WorkMeta;
}

// ═══════════════════════════════════════════════════════════════
// Reading
// ═══════════════════════════════════════════════════════════════

function readAll(): WorkMeta[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  return fs
    .readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const file = path.join(WORK_DIR, d.name, "meta.json");
      if (!fs.existsSync(file)) {
        throw new Error(`content/work/${d.name}/ has no meta.json`);
      }
      return validate(JSON.parse(fs.readFileSync(file, "utf8")), d.name);
    })
    .sort((a, b) => b.order - a.order);
}

/** Every published folder under content/work/, validated and sorted. */
export function getAllWork(): WorkMeta[] {
  const all = readAll();
  return SHOW_DRAFTS ? all : all.filter((w) => !w.draft);
}

/** Including drafts — used by the "N drafts hidden" note in dev. */
export function getDraftCount(): number {
  return readAll().filter((w) => w.draft).length;
}

/**
 * Every item, drafts included. Only for the chatbot's knowledge base:
 * a drafted page's blurb still describes real work accurately, even
 * though the page itself isn't ready to publish.
 */
export function getAllWorkWithDrafts(): WorkMeta[] {
  return readAll();
}

/** One item, with its MDX body. Returns null if the slug doesn't exist. */
export function getWork(slug: string): WorkItem | null {
  const dir = path.join(WORK_DIR, slug);
  const metaFile = path.join(dir, "meta.json");
  const mdxFile = path.join(dir, "index.mdx");

  if (!fs.existsSync(metaFile) || !fs.existsSync(mdxFile)) return null;

  const meta = validate(JSON.parse(fs.readFileSync(metaFile, "utf8")), slug);
  if (meta.draft && !SHOW_DRAFTS) return null;

  return { ...meta, body: fs.readFileSync(mdxFile, "utf8") };
}

/**
 * Just the slugs — used to pre-render every page at build time.
 * Drafts are excluded, so a draft page is never generated and a direct
 * visit to its URL 404s.
 */
export function getAllSlugs(): string[] {
  return getAllWork().map((w) => w.slug);
}

/** Counts per filter tab: { All: 9, Research: 2, ... } */
export function getCategoryCounts(items: WorkMeta[]): Record<string, number> {
  const counts: Record<string, number> = { All: items.length };
  for (const c of CATEGORIES) {
    counts[c] = items.filter((i) => i.category === c).length;
  }
  return counts;
}
