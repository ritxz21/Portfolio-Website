type Step = { label: string; note?: string };

/**
 * A left-to-right pipeline diagram, built from plain HTML rather than SVG
 * so it reflows on mobile (stacks vertically) and follows the theme.
 *
 * Use it in MDX like:
 *   <Flow
 *     caption="Query path through the agent."
 *     steps={[
 *       { label: "Question", note: "natural language" },
 *       { label: "Schema graph walk", note: "real joins only" },
 *       { label: "SQL generation", note: "validated, read-only" }
 *     ]}
 *   />
 */
export function Flow({
  steps,
  caption,
}: {
  steps: Step[];
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="contents sm:flex sm:flex-1 sm:items-stretch"
          >
            {i > 0 && (
              <div
                aria-hidden
                className="flex items-center justify-center text-strong sm:px-1"
              >
                <span className="sm:hidden">&darr;</span>
                <span className="hidden sm:inline">&rarr;</span>
              </div>
            )}
            <div className="flex flex-1 flex-col justify-center rounded-md border border-subtle bg-raised px-4 py-3 text-center">
              <div className="text-sm font-medium text-heading">{s.label}</div>
              {s.note && (
                <div className="mt-0.5 text-[11px] text-muted">{s.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
