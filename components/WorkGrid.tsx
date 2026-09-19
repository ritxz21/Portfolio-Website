"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkMeta } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const TABS = ["All", ...CATEGORIES] as const;
type Tab = (typeof TABS)[number];

/**
 * One card.
 * Hover -> faint golden glow and a barely-there lift.
 * Click -> flips to the back, which holds the full tag list and any
 *          external links the front had no room for.
 * "Read more" goes straight to the write-up from either face.
 */
function Card({ item }: { item: WorkMeta }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

  const shown = item.tags.slice(0, 4);
  const hidden = item.tags.length - shown.length;
  const links = item.links.filter((l) => l.url);

  return (
    <div
      className={`flip h-72 ${flipped ? "is-flipped" : ""}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${item.title} — press to see details`}
    >
      <div className="flip-inner">
        {/* ── FRONT ─────────────────────────────────────── */}
        <div className="flip-face flex flex-col p-6">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] font-medium tracking-wider text-accent uppercase">
              {item.category}
            </span>
            {item.draft ? (
              <span className="rounded border border-accent-warn px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-accent-warn uppercase">
                Draft
              </span>
            ) : (
              <span className="text-[11px] text-muted">{item.dates}</span>
            )}
          </div>

          <h3 className="mt-2.5 text-lg leading-snug font-medium text-heading">
            {item.title}
          </h3>
          {item.org && (
            <div className="mt-0.5 text-sm text-muted">{item.org}</div>
          )}

          <p className="mt-2.5 line-clamp-3 text-sm text-body">{item.blurb}</p>

          {/* tags visible without flipping — the point is scanning */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((t) => (
              <span
                key={t}
                className="rounded-full border border-subtle px-2 py-0.5 text-[10px] text-muted"
              >
                {t}
              </span>
            ))}
            {hidden > 0 && (
              <span className="px-1 py-0.5 text-[10px] text-muted">
                +{hidden}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            {item.award ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 px-2 py-0.5 text-[10px] font-medium text-accent">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
                  <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
                </svg>
                {item.award}
              </span>
            ) : (
              <span />
            )}

            {/* stopPropagation, or clicking the link would also flip the card */}
            <Link
              href={`/work/${item.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-accent hover:underline"
            >
              Read more &rarr;
            </Link>
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────── */}
        <div className="flip-face flip-back flex flex-col justify-between p-6">
          <div className="min-h-0 overflow-hidden">
            <div className="text-[11px] font-medium tracking-wider text-accent uppercase">
              Built with
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-strong px-2.5 py-1 text-xs text-body"
                >
                  {t}
                </span>
              ))}
            </div>

            {links.length > 0 && (
              <div className="mt-4 flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-muted hover:text-accent hover:underline"
                  >
                    {l.label} &rarr;
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/work/${item.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium text-accent hover:underline"
          >
            Read more &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export function WorkGrid({ items }: { items: WorkMeta[] }) {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    for (const cat of CATEGORIES) {
      c[cat] = items.filter((i) => i.category === cat).length;
    }
    return c;
  }, [items]);

  // Category tab AND text query. The query matches tags, title and org,
  // so "PyTorch", "Columbia" and "hackathon" all find something.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (tab !== "All" && i.category !== tab) return false;
      if (!q) return true;
      return (
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.title.toLowerCase().includes(q) ||
        (i.org ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, tab, query]);

  return (
    <div>
      {/* filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-surface"
                  : "border-subtle text-muted hover:border-strong hover:text-body"
              }`}
            >
              {t}
              <span className="ml-1.5 opacity-65">{counts[t]}</span>
            </button>
          );
        })}
      </div>

      {/* tech search */}
      <div className="relative mt-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by tech, title or place…"
          className="w-full rounded-full border border-subtle bg-raised px-5 py-2.5 text-sm text-body outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear filter"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted hover:text-accent"
          >
            ✕
          </button>
        )}
      </div>

      {/* cards */}
      {shown.length === 0 ? (
        <p className="mt-10 text-center font-hand text-2xl text-muted">
          nothing matches that — try another word?
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <Card key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
