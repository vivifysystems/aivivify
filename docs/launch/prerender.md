# Static prerendering

Vercel builds the site with `npm run build:prerender` (see `vercel.json`). Every route in the sitemap is
served as a static HTML file that already contains its own title, description, canonical URL, Open Graph tags,
headings and copy. React then hydrates the page in the browser.

## How it works

- `src/routes.tsx`: one route tree shared by the browser and the server render.
- `src/lib/route-meta.ts`: one table of titles, descriptions, canonical URLs and `noindex` flags, used by
  `useRouteMeta()` in the browser and by `headTags()` in static HTML (tested in `route-meta.test.ts`).
- `src/entry-server.tsx` + `scripts/prerender.mjs`: render every sitemap route to `dist/<route>/index.html` and
  the 404 page to `dist/404.html`.
- `src/main.tsx` hydrates when `#root` already contains HTML, and renders normally otherwise, so the same
  bundle works with both builds.
- `npm run build:prerender` = `vite build` → SSR build → prerender.
- `scripts/serve-static.mjs`: local emulation of clean-URL static hosting with a real 404 status.

## Hosting configuration

```json
{
  "installCommand": "bunx bun@1.4.4 install --frozen-lockfile",
  "buildCommand": "npm run build:prerender",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

- There is no catch-all rewrite: every real route is a static file, so an unknown URL gets `404.html` with
  HTTP 404 instead of a soft 200.
- `/api/contact` is a Vercel Function; Functions are routed before static files.
- New routes must be added to `src/lib/sitemap.ts` (and so to the prerender), or they will 404 on a direct visit.

## Checks on a Preview deployment

1. `curl -sI https://<preview>/nope` → `404`; `curl -sI https://<preview>/systems/ai-chatbot` → `200`.
2. `curl -s https://<preview>/systems/ai-chatbot | grep -o '<title>[^<]*'` shows that page's title.
3. `curl -sI https://<preview>/about/` → `308` to `/about`.
4. Client-side navigation, the browser Back button and `/work?tool=…` filters still work.
5. A social card debugger shows the per-page title and description.

To return to the previous single-page setup, restore the earlier `vercel.json` (SPA rewrite of every path to
`/index.html` with `buildCommand: "vite build"`); the bundle works unchanged with either build.
