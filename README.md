# Portfolio Website

Personal site for Ritika Chatterjee — MS Data Science, Columbia University.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with CSS-variable design tokens
- **MDX** for long-form project write-ups (coming in Phase 1)
- Deployed free on **Vercel**

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project layout

```
app/          pages and layouts (folder name = URL)
  layout.tsx    wrapper shared by every page
  page.tsx      the homepage  ->  /
  globals.css   design tokens + base styles
components/   reusable UI pieces
content/      project + experience write-ups (one folder each)
lib/          data loading and helpers
public/       static files (resume PDF, images)
```

## Adding a project

Each project is one folder under `content/work/`, containing a
`meta.json` (card info) and an `index.mdx` (the page). Drop a folder
in and it appears on the site — no code changes needed.

## Colours

Every colour is a CSS custom property defined in `app/globals.css`.
Change a value there and it updates everywhere, in both light and
dark mode. Nothing else in the codebase hardcodes a colour.
