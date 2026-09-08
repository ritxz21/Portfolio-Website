export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-hand text-4xl text-accent">hello there :)</p>

      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-heading sm:text-7xl">
        Ritika Chatterjee
      </h1>

      <p className="mt-4 text-lg text-muted">Data Scientist &middot; AI Engineer</p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href="/resume"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
        >
          Resume
        </a>
        <a
          href="/work"
          className="rounded-full border border-strong px-5 py-2 text-sm font-medium text-body transition-colors hover:border-accent hover:text-accent"
        >
          See the work
        </a>
      </div>

      <div className="mt-20 rounded-lg border border-subtle bg-raised px-6 py-4">
        <p className="text-sm text-body">
          <span className="text-accent">Phase 0 complete.</span> Fonts, colours
          and the build pipeline are wired up.
        </p>
        <p className="mt-1 text-xs text-muted">
          Next: the content layer, so projects are just folders you drop in.
        </p>
      </div>
    </main>
  );
}
