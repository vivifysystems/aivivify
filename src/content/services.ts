import type { Service } from "./schema.ts";

/** Service categories. Identical on the website and in the MCP server. */
export const services: readonly Service[] = [
  {
    id: "customer-reply-systems",
    icon: "⚡",
    title: "Customer Reply Systems",
    description:
      "AI agents that answer Facebook, website, and chat inquiries instantly — 24/7, no staff needed.",
    status: "consistent",
  },
  {
    id: "smart-follow-up",
    icon: "🧠",
    title: "Smart Follow-Up",
    description:
      "Automated sequences that chase every lead across email, SMS, and chat so nothing falls through the cracks.",
    status: "consistent",
  },
  {
    id: "bookings-scheduling",
    icon: "🗄️",
    title: "Bookings & Scheduling",
    description:
      "Voice and chat assistants that book appointments directly into your calendar with zero human involvement.",
    status: "consistent",
  },
  {
    id: "reports-data-sync",
    icon: "📡",
    title: "Reports & Data Sync",
    description:
      "Your tools talk to each other automatically — no manual data entry, no missed updates.",
    status: "consistent",
  },
];
