import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getWork, getAllSlugs } from "@/lib/content";
import { mdxComponents } from "@/components/mdx";

// Tells Next which pages to build ahead of time.
// Every write-up becomes a static HTML file — nothing is
// rendered on demand, so pages load instantly and hosting is free.
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) notFound();

  const { content, frontmatter } = await compileMDX<{
    title: string;
    subtitle?: string;
  }>({
    source: item.body,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <Link
        href="/work"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; all work
      </Link>

      <header className="mt-8 mb-12">
        <div className="text-sm text-muted">
          {item.org ? `${item.org} · ` : ""}
          {item.dates}
        </div>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-heading">
          {frontmatter.title}
        </h1>

        {frontmatter.subtitle && (
          <p className="mt-4 text-lg text-body">{frontmatter.subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-subtle px-3 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        {item.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {item.links
              .filter((l) => l.url)
              .map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  {l.label} &rarr;
                </a>
              ))}
          </div>
        )}
      </header>

      <div className="prose-custom">{content}</div>
    </article>
  );
}
