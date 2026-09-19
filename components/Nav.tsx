import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeStudio } from "./ThemeStudio";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-subtle bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-medium text-heading transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/work" className="transition-colors hover:text-accent">
            Work
          </Link>
          <Link href="/ask" className="transition-colors hover:text-accent">
            Ask
          </Link>
          <a
            href={site.links.resume}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            Resume
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="hidden transition-colors hover:text-accent sm:inline"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <ThemeToggle />
          <ThemeStudio />
        </div>
      </nav>
    </header>
  );
}
