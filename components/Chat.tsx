"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Msg = { role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "What has Ritika actually built?",
  "Does she know PyTorch?",
  "What was her first role?",
  "Tell me about the Atlas Copco work",
];

export function Chat() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Keep the newest message in view as it streams in.
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;

    setError(null);
    setInput("");
    setBusy(true);

    const history = messages.slice(-6);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "model", text: "" }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "model",
            text: next[next.length - 1].text + chunk,
          };
          return next;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      // drop the empty assistant bubble
      setMessages((m) => m.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  // A question passed in from the homepage box: /ask?q=...
  useEffect(() => {
    if (started.current) return;
    const q = params.get("q");
    if (q) {
      started.current = true;
      void send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
          &larr; home
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-heading">
          Ask about my work
        </h1>
        <p className="mt-2 text-sm text-muted">
          Answers come only from what&apos;s written on this site. It will tell
          you when it doesn&apos;t know.
        </p>
      </div>

      <div className="flex-1 space-y-5">
        {empty && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-subtle px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-raised px-4 py-2.5 text-sm text-body">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="text-body">
              {m.text ? (
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </div>
              ) : (
                <span className="font-hand text-xl text-muted">thinking…</span>
              )}
            </div>
          ),
        )}

        {error && (
          <div className="rounded-lg border border-accent-warn px-4 py-3 text-sm text-accent-warn">
            {error}
          </div>
        )}

        <div ref={bottom} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="sticky bottom-6 mt-8 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          disabled={busy}
          className="flex-1 rounded-full border border-subtle bg-raised px-5 py-3 text-sm text-body outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
