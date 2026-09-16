# TODO

Ordered. The two big ones are sequential — the chatbot upgrade only makes
sense after the content exists.

---

## 1. Content — write the nine drafted pages

Each page lives in `content/work/<slug>/index.mdx` and has
`{/* TODO(ritika): ... */}` comments in it saying what belongs where.
Those comments never render on the page.

**To publish a page:** delete the `"draft": true` line from its
`meta.json`. The handwritten "+ N more" note on the homepage counts the
remaining drafts by itself, so it stays accurate.

Suggested order, strongest first:

- [ ] `embedding-robustness` — Word Embedding Robustness Framework
- [ ] `columbia-policy-etl` — Columbia Research Assistant, policy ETL
- [ ] `ganges-pollution-dss` — Smart India Hackathon 2024 winner
- [ ] `neuday-exam-evaluation` — OCR + LLM exam grading
- [ ] `moby-filters-iot` — edge IoT pipeline
- [ ] `disease-prediction-dss` — IJARIIE paper
- [ ] `imdb-film-trends` — R/Quarto analysis
- [ ] `vizathon` — Vizathon 2.0 winner (keep this one short)
- [ ] `tamer-fellowship` — verify the Tamer Center paragraph is accurate
      before publishing; it was written from general knowledge, not a source

### Also finish Atlas Copco (already live)

Four TODO comments in `content/work/atlas-copco/index.mdx`:

- [ ] What was tried FIRST that didn't work — the single most valuable
      paragraph on the page
- [ ] How the schema graph was built, and what guardrails the SQL agent had
- [ ] How the 40% and 30% were measured
- [ ] What you'd do differently, and whether the closing section sounds
      like you rather than like a summary of you

### What makes these pages good

Not the architecture description — the failures. One honest paragraph about
something that broke, and why, is worth more than three paragraphs of what
the system does.

---

## 2. Then: turn the chatbot into actual RAG

**Right now it is not RAG.** `lib/knowledge.ts` assembles the entire
corpus (~6k tokens) and `app/api/ask/route.ts` sends all of it in the
system prompt on every question. No chunking, no embeddings, no retrieval.

That is deliberate. Retrieval solves "too much content to send", and at
6k tokens that problem doesn't exist. Vector search over ~15 chunks would
make answers *worse*, because retrieval can drop the chunk holding the
answer while sending everything cannot.

### The trigger

Once the nine write-ups are done the corpus is roughly 10x bigger —
50-60k tokens per question. Three things start to hurt:

- **Latency** — every question ships the whole corpus
- **Cost** — fine on the free tier now, not at 10x
- **Accuracy** — models attend poorly to material buried mid-context

### What to build then

1. Chunk the content into passages (roughly by heading)
2. Embed each chunk **at build time**, write the vectors to a JSON file —
   keeps it free, no vector database, no embedding API calls at runtime
3. Embed the incoming question at request time
4. Cosine similarity over the array — a few hundred chunks doesn't need
   a vector database, it needs a loop
5. Add BM25 keyword matching alongside it, fuse the two rankings
6. Send only the top chunks to the model
7. Keep ~25 test questions with expected answers, and run them before
   every deploy so retrieval quality can't silently regress

### Worth writing up afterwards

The sequence — built the simple version, measured where it broke, then
added retrieval — is the interesting story, and a better portfolio piece
than the retrieval itself. Starting with a vector database for 15 chunks
would have been cargo-culting.

---

## 3. Loose ends

- [ ] Add real URLs for the awards — `ganges-pollution-dss`,
      `vizathon`, `disease-prediction-dss` all have `"url": ""`, so
      nothing renders. Results page, certificate or news article
- [ ] The LinkedIn link in the nav — flagged as wrong a while back,
      never diagnosed. Send the URL from your profile if the slug differs
- [ ] Rename the Vercel URL to something clean
      (Settings → Domains), before the current one goes on a resume
- [ ] Apply for GitHub Student Pack with the Columbia email — free `.me`
      domain for a year
- [ ] Test the link preview on opengraph.xyz
- [ ] `lib/site.ts` stat tile says "9 Things built" and there are now ten
      cards. Decide whether an award counts
- [ ] Check the light theme on a work page — it gets far less attention
      than dark during development, and that's where contrast bugs hide

---

## Reference

- **Add a project:** new folder under `content/work/` with `meta.json`
  and `index.mdx`. Nothing else to change.
- **Hide a page:** `"draft": true` in its `meta.json`.
- **Local dev:** `npm run dev:clean` (clears the stale `.next` cache).
- **Before pushing code:** `npm run build`. Not needed for content-only
  edits.
- **Chatbot key:** `GEMINI_API_KEY` in `.env.local` locally, and in
  Vercel's environment variables for the live site.
