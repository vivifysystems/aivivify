import type { Service } from "./schema.ts";

/** Service categories. Identical on the website and in the MCP server. */
export const services: readonly Service[] = [
  {
    id: "customer-reply-systems",
    icon: "⚡",
    title: "Customer Reply Systems",
    description:
      "AI assistants that answer Facebook, website and chat inquiries quickly, with a person stepping in when it matters.",
    status: "consistent",
  },
  {
    id: "smart-follow-up",
    icon: "🧠",
    title: "Smart Follow-Up",
    description:
      "Automated sequences that follow up with leads across email, SMS and chat so fewer inquiries are forgotten.",
    status: "consistent",
  },
  {
    id: "bookings-scheduling",
    icon: "🗄️",
    title: "Bookings & Scheduling",
    description:
      "Chat assistants, and voice assistants offered as a pilot, that book appointments directly into your calendar.",
    status: "consistent",
  },
  {
    id: "reports-data-sync",
    icon: "📡",
    title: "Reports & Data Sync",
    description:
      "Your tools share data automatically, reducing manual data entry and missed updates.",
    status: "consistent",
  },
];
