import type { Project } from "./schema.ts";

/**
 * Canonical case studies, in display order. This is the single source for the
 * website and for the public MCP endpoint (src/lib/mcp/data.ts derives from it).
 *
 * Copy describes what each system does. It makes no numeric or guaranteed
 * outcome claims; add one only with owner-verified evidence. A project that is
 * unfinished or not approved for publication is removed from this list, never
 * just visually hidden.
 *
 * `status` records whether the sources agreed when the content was reconciled;
 * it is not a publication approval.
 */
export const projects: readonly Project[] = [
  {
    id: "ai-voice-receptionist",
    tag: "n8n + VAPI",
    title: "AI Voice Receptionist ('Bobby')",
    summary:
      "Automated booking and customer support for high-volume local businesses using n8n and VAPI.",
    stack: ["n8n", "VAPI", "Google Calendar", "Airtable"],
    media: { card: "proof-voice-receptionist", proof: "proof-voice-receptionist" },
    impact:
      "Callers can book appointments by voice, and bookings are written to the calendar automatically.",
    caseStudy: {
      problem:
        "A high-volume local business was missing calls outside business hours and during busy periods. Missed calls meant missed bookings.",
      solution:
        "Built an AI voice receptionist named Bobby using n8n and VAPI. Bobby answers calls, handles FAQs, and books appointments directly into Google Calendar.",
      result: "Appointments are booked straight into Google Calendar without a person on the call.",
    },
    status: "consistent",
  },
  {
    id: "intelligent-file-management",
    tag: "Gmail + Gemini",
    title: "Intelligent File Management",
    summary:
      "AI-powered semantic renaming and sorting of Gmail attachments using Make.com and Gemini.",
    stack: ["Make.com", "Gemini", "Gmail", "Google Drive"],
    media: { card: "proof-file-management", proof: "proof-file-management" },
    impact: "Attachments are renamed and filed automatically as they arrive.",
    caseStudy: {
      problem:
        "A business was drowning in Gmail attachments — invoices, contracts, reports — all arriving with generic filenames and piling up unsorted in their inbox.",
      solution:
        "Built an automated pipeline using Make.com and Gemini that monitors Gmail, semantically renames each attachment based on its content, and sorts it into the correct Google Drive folder automatically.",
      result: "Attachments are named, categorized and filed automatically when they arrive.",
    },
    status: "consistent",
  },
  {
    id: "social-engine",
    tag: "Content Engine",
    title: "Social Media Content Engine",
    summary:
      "Auto-transcribing media and intelligent cross-posting to LinkedIn and Facebook using Zapier and AI.",
    stack: ["Zapier", "AI by Zapier", "LinkedIn", "Facebook Pages"],
    media: { card: "proof-social-engine", proof: "proof-social-engine" },
    impact: "Uploaded recordings are transcribed, turned into captions and posted automatically.",
    caseStudy: {
      problem:
        "Hours of recorded video and audio content can sit unused because transcribing, editing and cross-posting to multiple platforms by hand is too time-consuming.",
      solution:
        "Built a Zapier pipeline with AI that auto-transcribes media uploaded to a Google Drive folder, generates posts from the transcript, and publishes them to Facebook Pages and LinkedIn automatically.",
      result:
        "After upload, content is transcribed, drafted and posted to LinkedIn and Facebook Pages automatically.",
    },
    status: "consistent",
  },
  {
    id: "social-auto-poster",
    tag: "MAKE.COM · AI · BUFFER",
    title: "Social Media Auto Poster",
    summary:
      "Pulls content from Airtable, generates captions using OpenAI, shortens links via Bitly, publishes to Buffer, then logs results back to Airtable and Google Sheets.",
    stack: ["MAKE.COM", "OPENAI", "AIRTABLE", "BUFFER", "GOOGLE SHEETS"],
    media: { card: "cover-social-auto" },
    impact: "Queued content is captioned, link-shortened, scheduled and logged automatically.",
    caseStudy: {
      problem:
        "Keeping a steady posting cadence across channels takes hours each week: writing captions, shortening links, scheduling, and tracking what went out.",
      solution:
        "Built a Make.com scenario that reads queued content from Airtable, generates platform-tailored captions with OpenAI, shortens URLs via Bitly, schedules through Buffer, and writes the full audit trail back to Airtable and Google Sheets.",
      result:
        "Content queued in Airtable is captioned, link-shortened, scheduled through Buffer and logged automatically.",
    },
    kind: "concept",
    status: "consistent",
  },
  {
    id: "ugc-script-generator",
    tag: "N8N · GROQ AI · GOOGLE DRIVE",
    title: "UGC Script Generator",
    summary:
      "Triggers daily at 8AM, reads product research, competitor ads, and audience insights from Google Sheets, builds an AI context brief, generates UGC video scripts via Groq, formats the output, and saves it to a new dated Google Doc automatically.",
    stack: ["N8N", "GROQ AI", "GOOGLE SHEETS", "GOOGLE DRIVE", "GOOGLE DOCS"],
    media: { card: "cover-ugc-script" },
    impact: "A new document of draft UGC scripts is created in Google Drive each morning at 8AM.",
    caseStudy: {
      problem:
        "Producing daily UGC scripts means manually combining product research, competitor ads and audience insights every morning: slow, repetitive, and a creative bottleneck.",
      solution:
        "Built an n8n workflow that fires at 8AM, ingests all three Google Sheets data sources, assembles a rich AI brief, generates scripts through Groq, formats the output, and writes everything into a freshly created dated Google Doc.",
      result: "Each morning's run produces a dated Google Doc of draft UGC scripts.",
    },
    kind: "concept",
    status: "consistent",
  },
];
