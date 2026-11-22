import type { Package } from "./schema.ts";

/**
 * The three VIVIFY solution packages. Prices are deliberately absent: every
 * engagement is scoped and quoted in writing after a discovery call.
 */
export const packages: readonly Package[] = [
  {
    id: "launch",
    name: "VIVIFY Launch",
    tagline: "Get found and capture every inquiry.",
    summary: "Website, lead capture, basic CRM and booking coordination.",
    bestFor: "Service businesses that need a dependable online foundation.",
    systems: ["business-websites", "inbox-crm", "appointment-booking"],
    addOns: ["local-seo", "printing"],
    availability: "available",
  },
  {
    id: "growth",
    name: "VIVIFY Growth",
    tagline: "Respond faster and follow up automatically.",
    summary:
      "AI chatbot, lead qualification, workflow automation, follow-ups, review requests and customer communication.",
    bestFor: "Businesses with steady inquiries and too little time to answer and chase them.",
    systems: [
      "ai-chatbot",
      "inbox-crm",
      "lead-follow-up",
      "workflow-automation",
      "review-feedback",
      "marketing-campaigns",
    ],
    addOns: ["local-seo"],
    availability: "available",
  },
  {
    id: "connect",
    name: "VIVIFY Connect",
    tagline: "Calls answered, routed and followed up.",
    summary: "AI receptionist, phone systems, call routing and missed-call follow-up.",
    bestFor: "Phone-heavy businesses that miss calls while they're on the job.",
    systems: ["ai-receptionist", "business-phone", "missed-call-text-back"],
    addOns: [],
    availability: "pilot",
    availabilityNote:
      "Pilot: offered case by case while phone integrations, reliability and compliance are verified for your location.",
  },
];

export const pricingNote =
  "No fixed prices are published. Each setup is scoped on a free discovery call and quoted in writing before any work starts. Third-party subscriptions such as CRM, phone or messaging plans are billed by those providers.";
