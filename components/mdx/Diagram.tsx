/**
 * Wrapper for a hand-drawn diagram — usually an inline <svg>.
 * Gives it a frame, a caption, and horizontal scrolling on narrow
 * screens so a wide diagram never breaks the page layout.
 */
export function Diagram({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-lg border border-subtle bg-raised p-5">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
