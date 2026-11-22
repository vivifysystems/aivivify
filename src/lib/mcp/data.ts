// Public MCP data. Everything here is derived from the website's canonical content
// (src/content) so the website and this endpoint cannot drift apart. Edit the
// content modules, not this file. Plain data only (no UI imports) so the MCP
// entry stays import-safe; the Lovable plugin bundles these modules into the
// generated Supabase function.
import { brand } from "../../content/brand.ts";
import { founder } from "../../content/founder.ts";
import { links } from "../../content/links.ts";
import { packages } from "../../content/packages.ts";
import { projects as siteProjects } from "../../content/projects.ts";
import { publishedStats } from "../../content/stats.ts";
import { availabilityLabel, enabledSystems, systemGroups } from "../../content/systems.ts";
import { pricingNote } from "../../content/packages.ts";
import { tools } from "../../content/tools.ts";

export const about = {
  name: founder.name,
  brand: brand.name,
  role: founder.role,
  positioning: brand.positioning,
  location: "Philippines",
  bio: founder.intro,
  availability: "Free 30-minute discovery calls can be booked online.",
  site: brand.url,
};

export const contact = {
  email: links.email.label,
  website: brand.url,
  linkedin: links.linkedin.href,
  booking: links.bookingCall.href,
  bookingLabel: links.bookingCall.label,
};

/** The four groups the website's /systems page uses. */
export const services = systemGroups.map((g) => ({ title: g.title, description: g.line }));

/** Every enabled system, with the same availability labels the website shows. */
export const systems = enabledSystems.map((s) => ({
  id: s.id,
  title: s.title,
  group: s.group,
  summary: s.menuLine,
  availability: availabilityLabel[s.availability],
}));

export const solutionPackages = packages.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  summary: p.summary,
  bestFor: p.bestFor,
  includes: p.systems,
  optionalAddOns: p.addOns,
  availability: availabilityLabel[p.availability],
  ...(p.availabilityNote ? { note: p.availabilityNote } : {}),
}));

export const pricing = pricingNote;

export const platforms = tools.map((t) => t.name);

export type Project = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  /** "concept": a demonstration built with sample data, not a delivered client project. */
  kind?: "concept";
  stack: string[];
  problem: string;
  solution: string;
  result: string;
};

export const CONCEPT_PREFIX = "Concept demonstration (sample data, not a client project): ";

export const projects: Project[] = siteProjects.map((p) => ({
  id: p.id,
  tag: p.tag,
  title: p.title,
  summary: p.kind === "concept" ? `${CONCEPT_PREFIX}${p.summary}` : p.summary,
  ...(p.kind ? { kind: p.kind } : {}),
  stack: [...p.stack],
  problem: p.caseStudy.problem,
  solution: p.caseStudy.solution,
  result: p.caseStudy.result,
}));

/** Only owner-verified statistics. Empty until evidence is supplied. */
export const results = publishedStats
  .filter((s) => s.status === "verified" && s.value !== null)
  .map((s) => ({ metric: s.value as string, label: s.label }));
