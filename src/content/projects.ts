import type { Project } from "./schema.ts";

/**
 * Canonical case studies, in display order.
 *
 * Display copy is the CURRENT live-website text, moved here verbatim. Where the
 * MCP server (src/lib/mcp/data.ts) describes a project differently, the project
 * is marked `needs-confirmation` and linked to an entry in discrepancies.ts.
 * Keeping the website text is the status quo, not a decision on which is correct.
 *
 * `id` matches the MCP server's project id where one exists.
 */
export const projects: readonly Project[] = [
  {
    id: "ai-voice-receptionist",
    tag: "n8n + VAPI",
    title: "24/7 AI Voice Receptionist ('Bobby')",
    summary:
      "Automated booking and customer support for high-volume local businesses using n8n and VAPI.",
    stack: ["n8n", "VAPI", "Google Calendar", "Airtable"],
    media: { card: "proof-voice-receptionist", proof: "proof-voice-receptionist" },
    impact: "Bookings come in 24/7 without any staff involvement.",
    caseStudy: {
      problem:
        "A high-volume local business was missing calls outside business hours and during busy periods. Every missed call was a missed booking with no way to recover it.",
      solution:
        "Built an AI voice receptionist named Bobby using n8n and VAPI. Bobby answers calls, handles FAQs, and books appointments directly into Google Calendar — around the clock.",
      result: "Bookings continue even at 2 AM without any human involvement.",
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
    impact: "Attachments are renamed, categorized, and filed the moment they arrive.",
    caseStudy: {
      problem:
        "A business was drowning in Gmail attachments — invoices, contracts, reports — all arriving with generic filenames and piling up unsorted in their inbox.",
      solution:
        "Built an automated pipeline using Make.com and Gemini that monitors Gmail, semantically renames each attachment based on its content, and sorts it into the correct Google Drive folder automatically.",
      result:
        "Zero manual file sorting. Every attachment is named, categorized, and filed on arrival.",
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
    impact:
      "Raw recordings become published posts automatically — content output increased without added effort.",
    caseStudy: {
      problem:
        "A business had hours of recorded video and audio content sitting unused because manually transcribing, editing, and cross-posting to multiple platforms was too time-consuming.",
      solution:
        "Built a Zapier pipeline with AI that auto-transcribes uploaded media, generates platform-optimized captions, and cross-posts to LinkedIn and Facebook Pages automatically.",
      result:
        "Content publishes itself across platforms after upload. Zero manual editing or posting required.",
    },
    status: "needs-confirmation",
    discrepancies: ["social-engine-description"],
  },
  {
    id: "social-auto-poster",
    tag: "MAKE.COM · AI · BUFFER",
    title: "Social Media Auto Poster",
    summary:
      "Pulls content from Airtable, generates captions using OpenAI, shortens links via Bitly, publishes to Buffer, then logs results back to Airtable and Google Sheets — fully automated.",
    stack: ["MAKE.COM", "OPENAI", "AIRTABLE", "BUFFER", "GOOGLE SHEETS"],
    media: { card: "cover-social-auto" },
    impact:
      "An entire content calendar publishes itself — captions written, links shortened, posts scheduled, results logged — zero manual posting.",
    caseStudy: {
      problem:
        "Maintaining a consistent multi-channel posting cadence required hours each week writing captions, shortening links, scheduling, and tracking what went out.",
      solution:
        "Built a Make.com scenario that reads queued content from Airtable, generates platform-tailored captions with OpenAI, shortens URLs via Bitly, schedules through Buffer, and writes the full audit trail back to Airtable and Google Sheets.",
      result:
        "Posting cadence is now consistent and effortless. Content creators ship ideas to Airtable; everything downstream happens on its own.",
    },
    status: "needs-confirmation",
    discrepancies: ["social-auto-poster-source"],
  },
  {
    id: "ugc-script-generator",
    tag: "N8N · GROQ AI · GOOGLE DRIVE",
    title: "UGC Script Generator",
    summary:
      "Triggers daily at 8AM, reads product research, competitor ads, and audience insights from Google Sheets, builds an AI context brief, generates UGC video scripts via Groq, formats the output, and saves it to a new dated Google Doc automatically.",
    stack: ["N8N", "GROQ AI", "GOOGLE SHEETS", "GOOGLE DRIVE", "GOOGLE DOCS"],
    media: { card: "cover-ugc-script" },
    impact:
      "A fresh, ready-to-record UGC script lands in Google Drive every morning before the team even logs in.",
    caseStudy: {
      problem:
        "Producing daily UGC scripts meant manually combining product research, competitor ads, and audience insights every morning — slow, repetitive, and a creative bottleneck.",
      solution:
        "Built an n8n workflow that fires at 8AM, ingests all three Google Sheets data sources, assembles a rich AI brief, generates scripts through Groq, formats the output, and writes everything into a freshly created dated Google Doc.",
      result:
        "Creators wake up to a polished script in Drive. Daily content output becomes predictable without burning creative hours on prep.",
    },
    status: "needs-confirmation",
    discrepancies: ["ugc-script-model"],
  },
];
