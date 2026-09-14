import Link from "next/link";
import { getAllWork } from "@/lib/content";

// A plain list for now. Phase 2 turns this into the filterable
// card grid with flip animations.
export default function WorkIndex() {
  const work = getAllWork();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; home
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-heading">
        Work
      </h1>
      <p className="mt-2 text-muted">{work.length} things, newest first.</p>

      <div className="mt-12 space-y-4">
        {work.map((w) => (
          <Link
            key={w.slug}
            href={`/work/${w.slug}`}
            className="block rounded-lg border border-subtle bg-raised p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs tracking-wider text-accent uppercase">
                {w.category}
              </span>
              <span className="text-xs text-muted">{w.dates}</span>
            </div>

            <h2 className="mt-2 text-xl font-medium text-heading">{w.title}</h2>
            {w.org && <div className="text-sm text-muted">{w.org}</div>}

            <p className="mt-3 text-sm text-body">{w.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {w.tags.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-subtle px-2.5 py-0.5 text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
