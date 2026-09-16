import type { MetadataRoute } from "next";
import { getAllWork } from "@/lib/content";
import { site } from "@/lib/site";

// Lists every public page so search engines can find them.
// Drafts are excluded automatically, because getAllWork() already
// filters them out at build time.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/work`, lastModified: now, priority: 0.8 },
    ...getAllWork().map((w) => ({
      url: `${site.url}/work/${w.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
