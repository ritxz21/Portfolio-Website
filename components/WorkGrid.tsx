"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkMeta } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const TABS = ["All", ...CATEGORIES] as const;
type Tab = (typeof TABS)[number];

/**
 * One card.
 * Hover  -> faint golden glow and a barely-there lift.
 * Click  -> flips to the back, which holds the tags and the read-more link.
 * Click again flips it back.
 */
function Card({ item }: { item: WorkMeta }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((f) => !f);

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
            <span className="text-[11px] text-muted">{item.dates}</span>
          </div>

          <h3 className="mt-3 text-lg leading-snug font-medium text-heading">
            {item.title}
          </h3>
          {item.org && (
            <div className="mt-0.5 text-sm text-muted">{item.org}</div>
          )}

          <p className="mt-3 line-clamp-4 text-sm text-body">{item.blurb}</p>

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
            <span className="text-[11px] text-muted opacity-70">
              tap for details
            </span>
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────── */}
        <div className="flip-face flip-back flex flex-col justify-between p-6">
          <div>
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
          </div>

          {/* stopPropagation so following the link doesn't also flip the card */}
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

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    for (const cat of CATEGORIES) {
      c[cat] = items.filter((i) => i.category === cat).length;
    }
    return c;
  }, [items]);

  const shown = tab === "All" ? items : items.filter((i) => i.category === tab);

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

      {/* cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <Card key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
