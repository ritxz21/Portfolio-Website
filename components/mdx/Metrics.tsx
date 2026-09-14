type Item = { value: string; label: string; note?: string };

/** A row of headline numbers. Use 2-3, never more. */
export function Metrics({ items }: { items: Item[] }) {
  return (
    <div className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-subtle bg-raised p-5"
        >
          <div className="text-3xl font-semibold text-accent">{it.value}</div>
          <div className="mt-1 text-sm text-body">{it.label}</div>
          {it.note && <div className="mt-0.5 text-xs text-muted">{it.note}</div>}
        </div>
      ))}
    </div>
  );
}
