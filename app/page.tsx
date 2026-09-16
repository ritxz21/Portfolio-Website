import Link from "next/link";
import { getAllWork, getDraftCount } from "@/lib/content";
import { site } from "@/lib/site";
import { StatTiles } from "@/components/StatTiles";
import { WorkGrid } from "@/components/WorkGrid";
import { Reveal } from "@/components/Reveal";
import { AskBox } from "@/components/AskBox";

export default function Home() {
  const work = getAllWork();
  const drafts = getDraftCount();

  return (
    <main>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="font-hand text-4xl text-accent sm:text-5xl">
          {site.greeting}
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-heading sm:text-7xl">
          {site.name}
        </h1>

        <p className="mt-3 text-lg text-muted">{site.role}</p>

        <p className="mt-6 max-w-xl text-balance text-body">{site.tagline}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={site.links.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          >
            Resume
          </a>
          <Link
            href="#work"
            className="rounded-full border border-strong px-5 py-2 text-sm font-medium text-body transition-colors hover:border-accent hover:text-accent"
          >
            See the work
          </Link>
        </div>

        <p className="mt-20 font-hand text-2xl text-muted">keep scrolling</p>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Reveal>
          <StatTiles />
        </Reveal>
      </section>

      {/* ── WORK ───────────────────────────────────────────── */}
      <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end gap-x-5 gap-y-2">
            <div>
              <p className="font-hand text-2xl text-muted">some of my</p>
              <h2 className="text-4xl font-semibold tracking-tight text-heading">
                Work
              </h2>
            </div>

            {/* Reads the real number of drafted pages, so it can never
                go stale — publish one and the count drops by itself. */}
            {drafts > 0 && (
              <p
                className="font-hand text-2xl text-accent"
                style={{ transform: "rotate(-4deg)" }}
              >
                + {drafts} more, still writing them up!
              </p>
            )}
          </div>
          <WorkGrid items={work} />
        </Reveal>
      </section>

      {/* ── ASK ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <p className="font-hand text-2xl text-muted">curious about something?</p>
          <h2 className="mt-1 mb-8 text-3xl font-semibold tracking-tight text-heading">
            Just ask
          </h2>
          <AskBox />
          <p className="mt-4 text-xs text-muted">
            Answers come only from what&apos;s written on this site.
          </p>
        </Reveal>
      </section>

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-heading">
            Get in touch
          </h2>
          <p className="mt-3 text-body">
            Open to roles in ML engineering, applied research, and anything
            where the data is messier than the slide deck admits.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block rounded-full border border-strong px-6 py-2.5 text-sm text-body transition-colors hover:border-accent hover:text-accent"
          >
            {site.email}
          </a>
        </Reveal>
      </section>
    </main>
  );
}
