// Writes static HTML for every sitemap route plus 404.html into dist/.
// Run via `npm run build:prerender` (the Vercel build command; see docs/launch/prerender.md).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const { render, sitemapPaths } = await import(
  pathToFileURL(join(root, "dist-ssr/entry-server.js")).href
);
const template = readFileSync(join(dist, "index.html"), "utf8");

// Strip the template's default per-page tags; each page gets its own.
const base = template
  .replace(/<title>[\s\S]*?<\/title>/, "<!--head-->")
  .replace(/\s*<meta name="description"[\s\S]*?\/>/, "")
  .replace(/\s*<link rel="canonical"[^>]*>/, "")
  .replace(/\s*<meta property="og:(title|description|url|image)"[\s\S]*?\/>/g, "")
  .replace(/\s*<meta name="twitter:(title|description|image)"[\s\S]*?\/>/g, "");

function page(url) {
  const { html, head } = render(url);
  return base
    .replace("<!--head-->", head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

let count = 0;
for (const path of sitemapPaths()) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(path));
  count++;
}
writeFileSync(join(dist, "404.html"), page("/404"));
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${count} routes + 404.html`);
