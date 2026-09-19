"use client";

import { useEffect, useRef, useState } from "react";

const TOKENS = [
  "surface-base",
  "surface-raised",
  "surface-overlay",
  "text-heading",
  "text-body",
  "text-muted",
  "border-subtle",
  "border-strong",
  "accent-primary",
  "accent-secondary",
  "accent-warning",
];

type Palette = Record<string, string>;
type Custom = { dark: Palette; light: Palette; mood: string };

const EXAMPLES = ["a sunset over water", "brutalist concrete", "old library"];

/** Paints a palette onto <html> by overriding the CSS variables. */
function apply(custom: Custom | null) {
  const root = document.documentElement;
  if (!custom) {
    for (const t of TOKENS) root.style.removeProperty(`--${t}`);
    return;
  }
  const mode = root.dataset.theme === "light" ? "light" : "dark";
  const palette = custom[mode];
  for (const t of TOKENS) {
    if (palette[t]) root.style.setProperty(`--${t}`, palette[t]);
  }
}

export function ThemeStudio() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [custom, setCustom] = useState<Custom | null>(null);
  const box = useRef<HTMLDivElement>(null);

  // Load a previously generated theme, and keep it in step with the
  // light/dark toggle — the toggle changes data-theme, and we need to
  // repaint with that mode's half of the palette when it does.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("customTheme");
      if (saved) {
        const parsed = JSON.parse(saved) as Custom;
        setCustom(parsed);
        apply(parsed);
      }
    } catch {
      /* storage unavailable — the site just uses its default palette */
    }

    const observer = new MutationObserver(() => {
      try {
        const saved = localStorage.getItem("customTheme");
        apply(saved ? (JSON.parse(saved) as Custom) : null);
      } catch {
        /* ignore */
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Click outside to close.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function generate(text: string) {
    const m = text.trim();
    if (!m || busy) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: m }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't generate that.");

      const next: Custom = { dark: data.dark, light: data.light, mood: m };
      setCustom(next);
      apply(next);
      try {
        localStorage.setItem("customTheme", JSON.stringify(next));
      } catch {
        /* not persisted, but applied for this visit */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate that.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setCustom(null);
    apply(null);
    try {
      localStorage.removeItem("customTheme");
    } catch {
      /* ignore */
    }
  }

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Generate a colour theme"
        title="Generate a colour theme"
        className="text-muted transition-colors hover:text-accent"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-8 right-0 z-50 w-72 rounded-lg border border-subtle bg-raised p-4 shadow-xl">
          <p className="font-hand text-xl text-accent">pick your own palette</p>
          <p className="mt-1 text-xs text-muted">
            Describe a mood. The whole site changes.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void generate(mood);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="a sunset over water…"
              disabled={busy}
              className="min-w-0 flex-1 rounded-md border border-subtle bg-surface px-3 py-1.5 text-xs text-body outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={busy || !mood.trim()}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-surface disabled:opacity-40"
            >
              {busy ? "…" : "Go"}
            </button>
          </form>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setMood(e);
                  void generate(e);
                }}
                disabled={busy}
                className="rounded-full border border-subtle px-2 py-0.5 text-[10px] text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                {e}
              </button>
            ))}
          </div>

          {error && <p className="mt-3 text-xs text-accent-warn">{error}</p>}

          {custom && (
            <div className="mt-3 border-t border-subtle pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted">
                  “{custom.mood}”
                </span>
                <button
                  onClick={reset}
                  className="shrink-0 text-xs text-accent hover:underline"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Generated palettes are checked for contrast before they&apos;re
            applied — a theme nobody can read gets rejected.
          </p>
        </div>
      )}
    </div>
  );
}
