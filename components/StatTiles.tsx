"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/** Counts 0 -> target once the tile scrolls into view. */
function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // ease-out: fast at first, settles gently on the number
          setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, n };
}

function Tile({
  value,
  label,
  note,
}: {
  value: number;
  label: string;
  note?: string;
}) {
  const { ref, n } = useCountUp(value);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-semibold tracking-tight text-heading tabular-nums sm:text-6xl">
        {n}
      </div>
      <div className="mt-2 text-sm text-body">{label}</div>
      {note && <div className="font-hand text-xl text-accent">{note}</div>}
    </div>
  );
}

export function StatTiles() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
      {site.stats.map((s) => (
        <Tile key={s.label} {...s} />
      ))}
    </div>
  );
}
