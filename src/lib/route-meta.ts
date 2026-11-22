// Per-route <head> metadata, shared by the browser (useRouteMeta) and the static
// prerender (src/entry-server.tsx), so both always agree.
import { brand } from "../content/brand.ts";
import { contactFormActive } from "../content/privacy.ts";
import { projects } from "../content/projects.ts";
import { systems } from "../content/systems.ts";

export const SITE_URL = brand.url;
export const OG_IMAGE = `${SITE_URL}/og/vivify-og.png`;

export type RouteMeta = { title: string; description: string; path: string; noindex: boolean };

const BRAND = "VIVIFY Solutions";
const full = (t: string) => (t.includes("VIVIFY") ? t : `${t} | ${BRAND}`);

const fixed: Record<string, { title: string; description: string }> = {
  "/": {
    title: "VIVIFY Solutions | AI Automation & Business Systems",
    description:
      "Websites, AI customer assistants and connected business systems that help service businesses manage inquiries, simplify operations and deliver better customer experiences.",
  },
  "/solutions": {
    title: "Solution packages",
    description:
      "VIVIFY Launch, Growth and Connect: website and CRM foundations, AI chat and automated follow-up, and (as a pilot) AI reception and phone systems.",
  },
  "/systems": {
    title: "Systems & features",
    description:
      "The complete VIVIFY catalog: business websites, inbox & CRM, AI chatbot, AI receptionist (pilot), missed-call text back, booking, reviews, campaigns, local SEO and workflow automation.",
  },
  "/demos": {
    title: "Interactive service demos",
    description:
      "Short interactive walkthroughs of each VIVIFY system, using sample scenarios, showing what customers see and what happens behind the scenes.",
  },
  "/work": {
    title: "Work & portfolio",
    description:
      "Automation projects by Viviene Pitogo: AI customer assistants, lead management, email and knowledge workflows, content automation and more, with the tools used.",
  },
  "/about": {
    title: "About Viviene Pitogo, founder",
    description:
      "VIVIFY Solutions was founded by Viviene Pitogo, a Computer Engineering graduate who builds practical websites, AI customer experiences and automated business systems.",
  },
  "/contact": {
    title: "Contact & discovery call",
    description: contactFormActive
      ? "Book a free discovery call with VIVIFY Solutions or send a short message about the inquiries, follow-ups and admin you'd like to automate."
      : "Book a free discovery call with VIVIFY Solutions or email us about the inquiries, follow-ups and admin you'd like to automate.",
  },
  "/privacy": {
    title: "Privacy",
    description: "How the VIVIFY Solutions website handles your information.",
  },
};

const notFound = (path: string): RouteMeta => ({
  title: full("Page not found"),
  description: "This page doesn't exist or has moved.",
  path,
  noindex: true,
});

/** Metadata for a pathname; unknown paths get noindex "Page not found". */
export function metaForPath(rawPath: string): RouteMeta {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : "/";
  const f = fixed[path];
  if (f) return { title: full(f.title), description: f.description, path, noindex: false };
  const sys = path.match(/^\/systems\/([a-z0-9-]+)$/);
  if (sys) {
    const s = systems.find((x) => x.id === sys[1] && x.enabled);
    return s
      ? { title: full(s.title), description: `${s.title}: ${s.benefit}`, path, noindex: false }
      : notFound(path);
  }
  const work = path.match(/^\/work\/([a-z0-9-]+)$/);
  if (work) {
    const p = projects.find((x) => x.id === work[1]);
    return p
      ? { title: full(`${p.title} · Case study`), description: p.summary, path, noindex: false }
      : notFound(path);
  }
  return notFound(path);
}

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** <head> tags for static HTML. Mirrors what useRouteMeta sets in the browser. */
export function headTags(m: RouteMeta): string {
  const url = canonicalUrl(m.path);
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? "noindex" : "index, follow"}" />`,
    m.noindex ? "" : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}
