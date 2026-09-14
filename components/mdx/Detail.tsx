"use client";

import { Children, isValidElement, useState } from "react";

/**
 * One tab's worth of content. Only ever used inside <Detail>.
 * The `label` prop becomes the tab name.
 */
export function Pane({
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

/**
 * Two (or more) versions of the same explanation, switchable by tab.
 * Lets a reader choose depth instead of you guessing it.
 *
 * In MDX — note the blank lines, which let you write normal Markdown
 * inside each pane:
 *
 *   <Detail>
 *   <Pane label="Overview">
 *
 *   The plain-language version.
 *
 *   </Pane>
 *   <Pane label="Technical">
 *
 *   The version with the details in it.
 *
 *   </Pane>
 *   </Detail>
 */
export function Detail({ children }: { children: React.ReactNode }) {
  const panes = Children.toArray(children).filter(isValidElement) as Array<
    React.ReactElement<{ label?: string }>
  >;

  const [active, setActive] = useState(0);

  if (panes.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex gap-1 border-b border-subtle">
        {panes.map((p, i) => {
          const label = p.props.label ?? `Part ${i + 1}`;
          const on = i === active;
          return (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
                on
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-body"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="pt-2">{panes[active]}</div>
    </div>
  );
}
