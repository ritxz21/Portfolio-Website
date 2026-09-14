"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { WorkMeta } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const TABS = ["All", ...CATEGORIES] as const;
type Tab = (typeof TABS)[number];

/** One card. Flips on hover to show tags; on touch screens it stays flat. */
function Card({ item }: { item: WorkMeta }) {
  return (
    <Link href={`/work/${item.slug}`} className="flip block h-72">
      <div className="flip-inner rounded-lg border border-subtle bg-raised transition-colors hover:border-accent">
        {/* FRONT */}
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

          {/* Shown only on touch screens, where there's no hover to flip with */}
          <div className="flip-touch-tags mt-auto hidden flex-wrap gap-1.5 pt-3">
            {item.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-subtle px-2 py-0.5 text-[10px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* BACK */}
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

          <div className="text-sm text-accent">Read more &rarr;</div>
        </div>
      </div>
    </Link>
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
              <span className={active ? "ml-1.5 opacity-70" : "ml-1.5 opacity-60"}>
                {counts[t]}
              </span>
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
