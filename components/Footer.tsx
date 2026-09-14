import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-subtle">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-muted">
        <span>
          &copy; {new Date().getFullYear()} {site.name}
        </span>

        <div className="flex gap-5">
          <a
            href={`mailto:${site.email}`}
            className="transition-colors hover:text-accent"
          >
            Email
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
