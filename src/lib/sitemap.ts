import { brand } from "../content/brand.ts";
import { projects } from "../content/projects.ts";
import { systems } from "../content/systems.ts";

export const SITE = brand.url;

export function sitemapPaths(): string[] {
  return [
    "/",
    "/solutions",
    "/systems",
    ...systems.filter((s) => s.enabled).map((s) => `/systems/${s.id}`),
    "/demos",
    "/work",
    ...projects.map((p) => `/work/${p.id}`),
    "/about",
    "/contact",
    "/privacy",
  ];
}

export function sitemapXml(): string {
  const urls = sitemapPaths()
    .map((p) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
