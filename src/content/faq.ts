import type { Faq } from "./schema.ts";

export const faqs: readonly Faq[] = [
  {
    id: "technical",
    question: "Do I need to be technical to use these systems?",
    answer:
      "No. We build around how your business already works, explain everything in plain English and hand over simple documentation. Your team uses the inbox, calendar and notifications; the wiring stays behind the scenes.",
    keywords: ["tech", "technical", "easy", "learn", "training"],
  },
  {
    id: "replace-team",
    question: "Will automation replace my team?",
    answer:
      "That isn't the goal. Automation takes repetitive work off your team: acknowledgements, reminders, data entry, sorting. People stay in charge of judgment calls, relationships and anything sensitive.",
    keywords: ["staff", "replace", "jobs", "people", "team"],
  },
  {
    id: "timeline",
    question: "How long does a project take?",
    answer:
      "It depends on scope and on how quickly accounts and information can be shared. After the discovery call you get a written plan with a timeline, before you commit to anything.",
    keywords: ["time", "long", "timeline", "fast", "when", "weeks"],
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answer:
      "We don't publish fixed prices because every setup is different. You get a written quote after a free discovery call. Third-party subscriptions such as your CRM, phone or messaging plan are billed by those providers, in your name.",
    keywords: ["price", "pricing", "cost", "budget", "quote", "fee", "expensive"],
  },
  {
    id: "ai-mistakes",
    question: "Can the AI get things wrong?",
    answer:
      "Yes. Any AI can. That's why our assistants answer only from information you approve, say clearly that they're automated, and hand uncertain or sensitive questions to a person. We test before launch and review conversations afterwards.",
    keywords: ["ai", "mistake", "wrong", "hallucinate", "accurate", "trust"],
  },
  {
    id: "handoff",
    question: "What happens when a customer needs a real person?",
    answer:
      "Every customer-facing assistant we build has handoff rules. It collects the details, tells the customer a person will follow up, and notifies the right team member with the conversation attached.",
    keywords: ["human", "person", "handoff", "escalate", "talk"],
  },
  {
    id: "compatibility",
    question: "Will it work with the tools I already use?",
    answer:
      "Often, yes. We check compatibility during discovery. If a tool has no reliable integration, we say so early and suggest options instead of forcing a fragile workaround.",
    keywords: ["tools", "integrate", "integration", "crm", "compatible", "software", "apps"],
  },
  {
    id: "maintenance",
    question: "Who looks after it after launch?",
    answer:
      "Support options are agreed before launch. Every system comes with plain-English documentation, automations include error alerts, and your accounts stay in your name, so you're never locked in.",
    keywords: ["support", "maintain", "maintenance", "after", "fix", "broken"],
  },
  {
    id: "data",
    question: "What about customer data and privacy?",
    answer:
      "We use only the data a system needs, keep accounts in your name and follow each provider's rules and the messaging and consent rules where you operate. We'll flag anything that needs your policy or customer consent.",
    keywords: ["privacy", "data", "gdpr", "consent", "security", "secure"],
  },
  {
    id: "pilot",
    question: "Why are some services marked as pilot or integration-dependent?",
    answer:
      "Phone and messaging systems depend on providers, local regulations and reliability testing. We label them honestly and only offer them where we've confirmed they can work properly for your business.",
    keywords: ["pilot", "receptionist", "phone", "calls", "voice", "sms", "text"],
  },
];
