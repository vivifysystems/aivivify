// Static portfolio data exposed via the public MCP server.
// Kept as plain data (no UI imports) so the MCP entry stays import-safe.

export const about = {
  name: "Viviene Pitogo",
  brand: "VIVIFY Automation",
  role: "AI Automation Specialist",
  location: "Philippines",
  bio: "Computer Engineering graduate turned AI Automation Specialist. I build customer reply systems, smart follow-up sequences, booking automations, and data-sync pipelines for e-commerce brands and agencies — so their ops keep running 24/7 without extra staff.",
  availability: "Available for projects",
  site: "https://vivify.solutions",
};

export const contact = {
  email: "viviene@vivify.solutions",
  website: "https://vivify.solutions",
  linkedin: "https://www.linkedin.com/in/viviene-pitogo",
  onlinejobs: "https://www.onlinejobs.ph/jobseekers/info/2872196",
};

export const services = [
  {
    title: "Customer Reply Systems",
    description:
      "AI agents that answer Facebook, website, and chat inquiries instantly — 24/7, no staff needed.",
  },
  {
    title: "Smart Follow-Up",
    description:
      "Automated sequences that chase every lead across email, SMS, and chat so nothing falls through the cracks.",
  },
  {
    title: "Bookings & Scheduling",
    description:
      "Voice and chat assistants that book appointments directly into your calendar with zero human involvement.",
  },
  {
    title: "Reports & Data Sync",
    description:
      "Your tools talk to each other automatically — no manual data entry, no missed updates.",
  },
];

export const platforms = [
  "n8n", "Make.com", "Zapier", "GoHighLevel", "OpenAI",
  "Supabase", "Anthropic", "HubSpot", "Google Gemini", "VAPI",
];

export type Project = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  stack: string[];
  problem: string;
  solution: string;
  result: string;
};

export const projects: Project[] = [
  {
    id: "fb-messenger-agent",
    tag: "n8n · Gemini",
    title: "24/7 Facebook Messenger AI Agent",
    summary:
      "Turns repetitive Facebook inquiries into instant automated replies so no lead is missed during peak hours.",
    stack: ["n8n", "Google Gemini", "Webhook", "Facebook Messenger"],
    problem:
      "A local catering business was receiving 15–20 Facebook inquiries daily — pricelist, menu, location — but messages sat unanswered for 3–5 hours during peak order preparation.",
    solution:
      "Built a 24/7 AI agent on Facebook Messenger using n8n and Google Gemini, connected to the business's actual knowledge base.",
    result:
      "Response time dropped from 3–5 hours to under 10 seconds. The team no longer loses inquiries during their busiest hours.",
  },
  {
    id: "ai-voice-receptionist",
    tag: "n8n + VAPI",
    title: "24/7 AI Voice Receptionist (Bobby)",
    summary:
      "Automated booking and customer support for high-volume local businesses using n8n and VAPI.",
    stack: ["n8n", "VAPI", "Google Calendar", "Airtable"],
    problem:
      "A high-volume local business was missing calls outside business hours and during busy periods. Every missed call was a missed booking.",
    solution:
      "Built an AI voice receptionist named Bobby using n8n and VAPI. Bobby answers calls, handles FAQs, and books appointments directly into Google Calendar around the clock.",
    result:
      "Zero missed calls after hours. Bookings continue even at 2 AM without any human involvement.",
  },
  {
    id: "intelligent-file-management",
    tag: "Gmail + Gemini",
    title: "Intelligent File Management",
    summary:
      "AI-powered semantic renaming and sorting of Gmail attachments using Make.com and Gemini.",
    stack: ["Make.com", "Gemini", "Gmail", "Google Drive"],
    problem:
      "A business was drowning in Gmail attachments — invoices, contracts, reports — all arriving with generic filenames and piling up unsorted.",
    solution:
      "Built an automated pipeline using Make.com and Gemini that monitors Gmail, semantically renames each attachment, and sorts it into the correct Drive folder.",
    result:
      "Zero manual file sorting. Every attachment is named, categorized, and filed within seconds of arrival.",
  },
  {
    id: "self-updating-rag",
    tag: "RAG Pipeline",
    title: "Self-Updating AI Knowledge Base",
    summary:
      "A dynamic RAG pipeline that teaches AI agents from new Google Drive uploads using n8n and Supabase.",
    stack: ["n8n", "Supabase", "pgvector", "Gemini"],
    problem:
      "AI agents kept giving outdated answers because their knowledge base was static and had to be manually refreshed whenever the business updated docs.",
    solution:
      "Built a self-updating RAG pipeline: new Google Drive uploads are chunked, embedded, and stored in Supabase pgvector automatically.",
    result:
      "AI agents stay current automatically — no manual retraining or document updates needed.",
  },
  {
    id: "lead-nurturing",
    tag: "CRM Automation",
    title: "Automated Lead Nurturing System",
    summary:
      "Cross-channel follow-up sequences that qualify and warm leads automatically.",
    stack: ["n8n", "GoHighLevel", "HubSpot", "SMS"],
    problem:
      "Sales reps were manually chasing every lead, and warm leads went cold because follow-ups were inconsistent.",
    solution:
      "Automated multi-channel drip sequences that adapt to lead behavior across email, SMS, and chat.",
    result:
      "Every lead gets a timely, personalized touch. Reps focus only on closing, not chasing.",
  },
  {
    id: "financial-sync",
    tag: "Data Sync",
    title: "Financial Data Sync Pipeline",
    summary:
      "Two-way sync between accounting tools, spreadsheets, and dashboards.",
    stack: ["Make.com", "Google Sheets", "QuickBooks"],
    problem:
      "Finance ops was rekeying the same numbers across systems and reports were always out of date.",
    solution:
      "Automated bidirectional sync that keeps every system aligned in real time.",
    result:
      "Zero manual re-entry. Dashboards reflect the latest financial state at all times.",
  },
  {
    id: "lead-routing",
    tag: "Routing",
    title: "Smart Lead Routing System",
    summary:
      "AI-scored inbound leads routed to the right rep instantly.",
    stack: ["n8n", "OpenAI", "HubSpot"],
    problem:
      "Inbound leads sat in a shared inbox with no owner, and high-value leads were treated the same as spam.",
    solution:
      "AI classifies and scores each lead, then routes it to the right rep with full context.",
    result:
      "High-value leads get responded to first, and nothing sits unassigned.",
  },
  {
    id: "social-engine",
    tag: "Content Engine",
    title: "Social Content Engine",
    summary:
      "End-to-end pipeline that generates, approves, and schedules social content.",
    stack: ["n8n", "OpenAI", "Buffer"],
    problem:
      "Content teams spent days brainstorming, drafting, and manually scheduling posts across platforms.",
    solution:
      "AI generates drafts on-brand, humans approve in one place, and posts are scheduled automatically.",
    result:
      "Weeks of content shipped in hours with consistent brand voice.",
  },
  {
    id: "email-routing",
    tag: "AI Email",
    title: "AI Email Classification & Routing",
    summary:
      "Classifies every inbound email and routes it to the right team or automation.",
    stack: ["n8n", "Gemini", "Gmail"],
    problem:
      "Support and sales emails landed in the same inbox and were triaged manually every morning.",
    solution:
      "AI classifier tags each email by intent and routes it to the right destination automatically.",
    result:
      "Inbox triage went from an hour a day to zero.",
  },
  {
    id: "social-auto-poster",
    tag: "Auto Poster",
    title: "Social Media Auto Poster",
    summary:
      "Publishes approved content to multiple social platforms on a schedule.",
    stack: ["Make.com", "Buffer", "Notion"],
    problem:
      "Manual cross-posting to every platform was eating hours a week and inconsistent.",
    solution:
      "Approved posts flow from Notion to every platform on schedule with platform-specific formatting.",
    result:
      "Cross-posting is fully hands-off and always on time.",
  },
  {
    id: "ugc-script-generator",
    tag: "UGC Scripts",
    title: "UGC Script Generator",
    summary:
      "Generates 10 on-brand UGC scripts in minutes from a single prompt.",
    stack: ["n8n", "OpenAI", "Google Sheets"],
    problem:
      "Creative teams needed a steady flow of UGC scripts but writing 10 variations took an hour each round.",
    solution:
      "AI pipeline that ingests a brief and outputs 10 polished, on-brand script variations to a shared sheet.",
    result:
      "Script production time dropped from ~1 hour to ~6 minutes for 10 scripts.",
  },
];

export const results = [
  { metric: "15–20", label: "daily inquiries handled automatically" },
  { metric: "3–5 hrs → 10 sec", label: "response time" },
  { metric: "24/7", label: "uptime" },
  { metric: "12+", label: "production workflows shipped" },
  { metric: "1 hr → 6 min", label: "script production time for 10 UGC scripts" },
];