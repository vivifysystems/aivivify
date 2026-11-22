import { projects } from "./projects.ts";
import type { Project } from "./schema.ts";

/**
 * Portfolio presentation layer. projects.ts stays the verbatim Phase 1 record;
 * this module only groups and labels it. Nothing here adds claims.
 */
export const workCategories = [
  { id: "customer-assistants", label: "AI customer assistants" },
  { id: "knowledge-documents", label: "Email, files & knowledge" },
  { id: "content-automation", label: "Content automation" },
] as const;

export type WorkCategory = (typeof workCategories)[number]["id"];

export const projectCategory: Record<string, WorkCategory> = {
  "ai-voice-receptionist": "customer-assistants",
  "intelligent-file-management": "knowledge-documents",
  "social-engine": "content-automation",
  "social-auto-poster": "content-automation",
  "ugc-script-generator": "content-automation",
};

/** Featured on the homepage: launch projects whose sources agree and that are not concept demonstrations. */
export const featuredProjectIds = [
  "ai-voice-receptionist",
  "intelligent-file-management",
  "social-engine",
] as const;

/** Canonical tool names, so "N8N", "n8n" and "GEMINI AI" filter together. */
const toolAliases: Record<string, string> = {
  n8n: "n8n",
  "google gemini": "Google Gemini",
  gemini: "Google Gemini",
  "gemini ai": "Google Gemini",
  "make.com": "Make",
  openai: "OpenAI",
  supabase: "Supabase",
  pgvector: "pgvector",
  vapi: "VAPI",
  zapier: "Zapier",
  "ai by zapier": "Zapier",
  gohighlevel: "GoHighLevel",
  airtable: "Airtable",
  buffer: "Buffer",
  gmail: "Gmail",
  "google drive": "Google Drive",
  "google sheets": "Google Sheets",
  "google docs": "Google Docs",
  "google calendar": "Google Calendar",
  slack: "Slack",
  xero: "Xero",
  asana: "Asana",
  "groq ai": "Groq",
  webhook: "Webhooks",
  "facebook messenger": "Facebook Messenger",
  "facebook pages": "Facebook Pages",
  linkedin: "LinkedIn",
};

/** Stack entries that describe a technique, not a product; not listed as tools. */
const notTools = new Set(["ai", "crm", "sms", "email", "conditional logic"]);

export function normalizeTool(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (notTools.has(key)) return null;
  return toolAliases[key] ?? raw.trim();
}

export function projectTools(p: Project): string[] {
  return [...new Set(p.stack.map(normalizeTool).filter((t): t is string => t !== null))];
}

/** Every tool that appears in at least one published project, most used first. */
export function toolUsage(list: readonly Project[] = projects): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of list) for (const t of projectTools(p)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * The home page's proof section is about one specific published project. When that
 * project is not in the launch content the section (and the hero link to it) is not shown.
 */
export const proofProjectId = "ai-voice-receptionist";
export const hasProofCase = projects.some((p) => p.id === proofProjectId);

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
