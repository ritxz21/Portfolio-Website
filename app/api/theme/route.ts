const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash";
const ENDPOINT = (m: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

// The tokens a theme has to define. These names are deliberately about
// ROLE, not colour — "accent-primary", never "purple". Language models
// anchor hard on colour words: call a token `purple` and you get purple
// back no matter what the user asked for.
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
] as const;

type Palette = Record<string, string>;

// ── rate limiting ──────────────────────────────────────────────
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// ── contrast ───────────────────────────────────────────────────
// A pretty palette that nobody can read is a broken palette, so the
// model's output gets checked rather than trusted.

function luminance(hex: string): number {
  const v = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Returns a complaint string, or null if the palette is fine. */
function checkPalette(p: Palette, mode: string): string | null {
  for (const t of TOKENS) {
    if (!/^#[0-9a-fA-F]{6}$/.test(p[t] ?? "")) {
      return `${mode}.${t} is not a 6-digit hex colour`;
    }
  }

  const checks: [string, string, number][] = [
    ["text-body", "surface-base", 4.5],
    ["text-heading", "surface-base", 4.5],
    ["text-muted", "surface-base", 3],
    ["accent-primary", "surface-base", 3],
  ];

  for (const [fg, bg, min] of checks) {
    const ratio = contrast(p[fg], p[bg]);
    if (ratio < min) {
      return `${mode}.${fg} on ${mode}.${bg} has contrast ${ratio.toFixed(2)}, needs at least ${min}`;
    }
  }
  return null;
}

// ── prompt ─────────────────────────────────────────────────────
function buildPrompt(mood: string, complaint?: string): string {
  return `Design a website colour scheme for this mood: "${mood}"

Return ONLY valid JSON, no markdown fence, in exactly this shape:
{"dark":{${TOKENS.map((t) => `"${t}":"#rrggbb"`).join(",")}},"light":{${TOKENS.map((t) => `"${t}":"#rrggbb"`).join(",")}}}

What each token is for:
- surface-base: the page background
- surface-raised: cards and panels, slightly distinct from surface-base
- surface-overlay: the layer above those, e.g. inline code
- text-heading: headings; the highest-contrast text
- text-body: body copy
- text-muted: secondary text like dates and captions
- border-subtle: hairlines between sections
- border-strong: more visible borders
- accent-primary: the single highlight colour — links, buttons, key numbers
- accent-secondary: a supporting accent for diagrams
- accent-warning: cautions and drafts

Rules:
- "dark" means a dark background with light text. "light" means the reverse. Both must express the same mood.
- text-body and text-heading must reach 4.5:1 contrast against surface-base. text-muted and accent-primary must reach 3:1.
- Use one accent, not five. Restraint reads as designed; a rainbow reads as a template.
- All eleven tokens in both themes. Six-digit hex only.${
    complaint
      ? `\n\nYour previous attempt was rejected: ${complaint}. Fix that and keep the mood.`
      : ""
  }`;
}

async function generate(
  model: string,
  prompt: string,
  apiKey: string,
): Promise<{ dark: Palette; light: Palette } | null> {
  const res = await fetch(`${ENDPOINT(model)}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.0, // this is a creative task, unlike the Q&A route
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    console.error("theme:", model, res.status, (await res.text()).slice(0, 300));
    return null;
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "";

  try {
    const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, "").trim());
    if (parsed?.dark && parsed?.light) return parsed;
  } catch {
    console.error("theme: unparsable JSON", text.slice(0, 200));
  }
  return null;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Not configured." }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "That's a lot of themes! Try again later." },
      { status: 429 },
    );
  }

  let mood = "";
  try {
    mood = String((await req.json()).mood ?? "").slice(0, 120);
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  if (!mood.trim()) {
    return Response.json({ error: "Describe a mood first." }, { status: 400 });
  }

  // Two attempts. If the first palette fails the contrast check, the
  // model is told exactly what was wrong and asked to fix it.
  let complaint: string | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    const result =
      (await generate(MODEL, buildPrompt(mood, complaint), apiKey)) ??
      (await generate(FALLBACK_MODEL, buildPrompt(mood, complaint), apiKey));

    if (!result) break;

    const problem =
      checkPalette(result.dark, "dark") ?? checkPalette(result.light, "light");

    if (!problem) return Response.json(result);

    console.warn(`theme: attempt ${attempt + 1} rejected — ${problem}`);
    complaint = problem;
  }

  return Response.json(
    { error: "Couldn't make that one readable. Try describing it differently." },
    { status: 422 },
  );
}
