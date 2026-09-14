const KINDS = {
  decision: { label: "Decision", token: "var(--accent-primary)" },
  note: { label: "Note", token: "var(--text-muted)" },
  caveat: { label: "Caveat", token: "var(--accent-warning)" },
} as const;

/** A pulled-aside block for a design decision, a caveat, or an NDA note. */
export function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: keyof typeof KINDS;
  title?: string;
  children: React.ReactNode;
}) {
  const k = KINDS[kind];
  return (
    <aside
      className="my-8 rounded-r-lg border-l-2 bg-raised px-5 py-4"
      style={{ borderColor: k.token }}
    >
      <div
        className="mb-1 text-xs font-medium tracking-wider uppercase"
        style={{ color: k.token }}
      >
        {title ?? k.label}
      </div>
      <div className="text-body [&>p]:my-2">{children}</div>
    </aside>
  );
}
