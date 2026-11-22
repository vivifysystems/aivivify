# Static prerendering: proposed production change

Status: **implemented and tested locally; not active.** Production still runs `vite build` from the current
`vercel.json` (SPA rewrite of every path to `/index.html`).

## What exists now

- `src/routes.tsx`: one route tree shared by the browser and the server render.
- `src/lib/route-meta.ts`: one table of titles, descriptions, canonical URLs and `noindex` flags, used by
  `useRouteMeta()` in the browser and by `headTags()` in static HTML (tested in `route-meta.test.ts`).
- `src/entry-server.tsx` + `scripts/prerender.mjs`: render all 33 sitemap routes to
  `dist/<route>/index.html` and the 404 page to `dist/404.html`.
- `src/main.tsx` hydrates when `#root` already contains HTML, and renders normally otherwise, so the same
  bundle works with both builds.
- `npm run build:prerender` = `vite build` → SSR build → prerender.
- `scripts/serve-static.mjs`: local emulation of clean-URL static hosting with real 404 status.

## Verified locally (2026-11-20)

| Request                  | Status  | `<title>`                                             | robots / canonical                  |
| ------------------------ | ------- | ----------------------------------------------------- | ----------------------------------- |
| `/`                      | 200     | VIVIFY Solutions \| AI Automation & Business Systems  | index / `https://vivify.solutions/` |
| `/systems/ai-chatbot`    | 200     | AI Website Chatbot \| VIVIFY Solutions                | index / matching canonical          |
| `/work?tool=Zapier`      | 200     | Work & portfolio                                      | canonical without query             |
| `/nope`, `/systems/nope` | **404** | Page not found                                        | `noindex`, no canonical             |

Hydration produced no React warnings on 7 routes, with and without reduced motion. Page HTML contains the
real headings and copy, so link previews (which don't run JavaScript) show the right title and
description per page.

## Change needed in production (needs approval)

Replace `vercel.json` with `docs/launch/vercel.prerender.proposed.json`:

```json
{
  "buildCommand": "npm run build:prerender",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

- The catch-all rewrite is removed: every real route is a static file, so unknown URLs get Vercel's
  `404.html` with HTTP 404 instead of a soft 200.
- `/api/contact` (see `contact-form.md`) is unaffected; Functions are routed before static files.
- The install step is unchanged (separate package-manager decision in `docs/engineering.md`).

## How to test it safely before production

1. On a branch, swap `vercel.json` for the proposed file and push **to a Preview deployment only**.
2. Check: `curl -I https://<preview>/nope` → 404; view-source of `/systems/ai-chatbot` shows the page title
   and heading; a social card debugger shows per-page titles; client navigation still works.
3. Only then merge.
