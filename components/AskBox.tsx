"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** The homepage prompt. Hands the question to /ask, which answers it. */
export function AskBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/ask?q=${encodeURIComponent(q.trim())}` : "/ask");
      }}
      className="mx-auto flex max-w-xl gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ask me anything about my work…"
        className="flex-1 rounded-full border border-subtle bg-raised px-5 py-3 text-sm text-body outline-none transition-colors placeholder:text-muted focus:border-accent"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90"
      >
        Ask
      </button>
    </form>
  );
}
