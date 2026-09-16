// ═══════════════════════════════════════════════════════════════
// The shape of every meta.json file.
// If a meta.json is missing a field or has a bad category,
// the build fails with a clear message instead of the site
// silently rendering something broken.
// ═══════════════════════════════════════════════════════════════

export const CATEGORIES = [
  "Research",
  "Project",
  "Professional",
  "Award",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type LinkType = "repo" | "paper" | "demo" | "award" | "site";

export type WorkLink = {
  type: LinkType;
  label: string;
  url: string;
};

export type WorkMeta = {
  slug: string;
  title: string;
  org?: string;
  role?: string;
  category: Category;
  blurb: string;
  tags: string[];
  dates: string;
  location?: string;
  /** Sorts the card grid. Higher shows first. */
  order: number;
  featured?: boolean;
  /** Short badge shown on the card, e.g. "Winner". Omit for no badge. */
  award?: string;
  /** Empty array is fine — the card just renders no links. */
  links: WorkLink[];
};

export type WorkItem = WorkMeta & {
  /** Raw MDX source for the detail page. */
  body: string;
};
