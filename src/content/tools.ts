/**
 * Tools & technologies showcase. Each entry must appear in at least one
 * published project's stack (enforced by v2-content.test.ts), so the list is
 * evidence-based. Names identify tools used; they imply no partnership or
 * certification.
 */
export const toolGroups = [
  { id: "automation", label: "Automation platforms" },
  { id: "ai", label: "AI models & voice" },
  { id: "data", label: "Data & knowledge" },
  { id: "apps", label: "Business apps" },
] as const;

export type ToolGroup = (typeof toolGroups)[number]["id"];

export const tools: readonly { name: string; group: ToolGroup }[] = [
  { name: "n8n", group: "automation" },
  { name: "Make", group: "automation" },
  { name: "Zapier", group: "automation" },
  { name: "Google Gemini", group: "ai" },
  { name: "OpenAI", group: "ai" },
  { name: "Groq", group: "ai" },
  { name: "VAPI", group: "ai" },
  { name: "Airtable", group: "data" },
  { name: "Google Sheets", group: "data" },
  { name: "Gmail", group: "apps" },
  { name: "Google Drive", group: "apps" },
  { name: "Google Calendar", group: "apps" },
  { name: "Buffer", group: "apps" },
];

export const toolsDisclaimer =
  "Tools used in the projects on this site. Listing a tool doesn't imply partnership, endorsement or certification.";
