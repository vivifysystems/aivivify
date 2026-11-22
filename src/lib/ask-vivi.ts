// Ask VIVI: a guided assistant. Every answer is pre-written from this site's
// canonical content (src/content). It is NOT a live AI: no network calls, no API
// keys, nothing the visitor types leaves the browser.
import { faqs } from "../content/faq.ts";
import { packages } from "../content/packages.ts";
import { systems } from "../content/systems.ts";
import { founder } from "../content/founder.ts";

export type AskLink = { label: string; to: string };
export type AskReply = { id: string; text: string; links: AskLink[] };

export const quickTopics: readonly { id: string; label: string }[] = [
  { id: "build", label: "What can VIVIFY build?" },
  { id: "package", label: "Which package fits me?" },
  { id: "pricing", label: "How does pricing work?" },
  { id: "demo", label: "Show me a demo" },
  { id: "founder", label: "Who's behind VIVIFY?" },
  { id: "contact", label: "Talk to Viviene" },
];

const faq = (id: string) => faqs.find((f) => f.id === id)!;

export function topicReply(id: string): AskReply {
  switch (id) {
    case "build":
      return {
        id,
        text: `We build ${systems.filter((s) => s.enabled && s.availability !== "partner-optional").length} connected systems for service businesses: websites, a shared inbox and CRM, AI chat, follow-ups, booking, reviews, campaigns, local SEO and workflow automation. Phone systems and the AI receptionist depend on providers and are labelled as such.`,
        links: [
          { label: "Browse all systems", to: "/systems" },
          { label: "Take the readiness check", to: "/#readiness" },
        ],
      };
    case "package":
      return {
        id,
        text: packages
          .map((p) => `${p.name}: ${p.summary}${p.availability === "pilot" ? " (pilot)" : ""}`)
          .join(" "),
        links: [
          { label: "Compare packages", to: "/solutions" },
          { label: "Find my fit (2-minute check)", to: "/#readiness" },
        ],
      };
    case "pricing":
      return {
        id,
        text: faq("cost").answer,
        links: [{ label: "Book a discovery call", to: "/contact" }],
      };
    case "demo":
      return {
        id,
        text: "Every system has a short, simulated walkthrough with a sample business. The chatbot demo is a good place to start.",
        links: [
          { label: "Chatbot demo", to: "/demos#chatbot" },
          { label: "All demos", to: "/demos" },
        ],
      };
    case "founder":
      return {
        id,
        text: `VIVIFY Solutions is founder-led by ${founder.name}. ${founder.intro.replace("I'm Viviene, a", "She's a")}`,
        links: [
          { label: "Meet the founder", to: "/about" },
          { label: "See the portfolio", to: "/work" },
        ],
      };
    case "contact":
    default:
      return {
        id: "contact",
        text: "The best next step is a free discovery call, or send a short message about what's taking up your time.",
        links: [{ label: "Contact & booking", to: "/contact" }],
      };
  }
}

const STOP = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "do",
  "does",
  "can",
  "i",
  "my",
  "me",
  "you",
  "your",
  "we",
  "to",
  "for",
  "of",
  "and",
  "or",
  "it",
  "in",
  "on",
  "with",
  "what",
  "how",
  "who",
  "will",
  "this",
  "that",
  "be",
  "have",
  "there",
  "any",
  "about",
]);

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/**
 * Phrasings that mean "text my missed callers back". Checked before the broad
 * phone/text keywords, which would otherwise route these to the generic
 * provider FAQ even though the site has a service page and a demo for exactly this.
 */
const MISSED_CALL_INTENT = [
  /\bmiss(?:ed|es|ing)?\b.{0,40}\b(?:calls?|callers?|phone)\b/,
  /\b(?:calls?|callers?)\b.{0,40}\bmiss(?:ed|es|ing)?\b/,
  /\btext(?:s|ed|ing)?[\s-]*(?:them |someone |people |callers? |customers? )?back\b/,
  /\bcallers?\b.{0,30}\b(?:get|receive|send|sent)\b.{0,12}\btexts?\b/,
  /\btexts?\b.{0,40}\b(?:people|those|anyone|someone)\b.{0,25}\bcall(?:s|ed)?\b/,
];

function missedCallReply(): AskReply | null {
  const s = systems.find((x) => x.id === "missed-call-text-back" && x.enabled);
  if (!s) return null;
  return {
    id: `system-${s.id}`,
    text: `${s.title}: ${s.benefit} ${s.goodToKnow[0]} Availability depends on your phone and messaging provider and where you operate, so we confirm it for your setup first.`,
    links: [
      { label: `About ${s.title}`, to: `/systems/${s.id}` },
      ...(s.demoId ? [{ label: "Watch the demo", to: `/demos#${s.demoId}` }] : []),
    ],
  };
}

const humanFallback: AskLink = { label: "Ask Viviene", to: "/contact" };

/** Best pre-written answer for free text, or an honest fallback. */
export function respond(query: string): AskReply {
  const q = words(query);
  if (q.length === 0) return topicReply("contact");
  const plain = query.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ");
  if (MISSED_CALL_INTENT.some((re) => re.test(plain))) {
    const reply = missedCallReply();
    if (reply) return reply;
  }
  const has = (w: string) => q.some((x) => x === w || (w.length > 3 && x.startsWith(w)));

  let best: { score: number; reply: AskReply } = { score: 0, reply: fallback() };
  for (const f of faqs) {
    const kw = [...(f.keywords ?? []), ...words(f.question)];
    const score = new Set(kw.filter(has)).size;
    if (score > best.score)
      best = {
        score,
        reply: {
          id: `faq-${f.id}`,
          text: f.answer,
          links:
            f.id === "cost"
              ? [{ label: "Book a discovery call", to: "/contact" }]
              : [humanFallback],
        },
      };
  }
  for (const s of systems.filter((x) => x.enabled)) {
    const score = new Set(words(s.title).filter(has)).size * 1.5;
    if (score > best.score)
      best = {
        score,
        reply: {
          id: `system-${s.id}`,
          text: `${s.title}: ${s.benefit}${s.availability === "pilot" ? " This is currently a pilot service." : ""}`,
          links: [
            { label: `About ${s.title}`, to: `/systems/${s.id}` },
            ...(s.demoId ? [{ label: "Watch the demo", to: `/demos#${s.demoId}` }] : []),
          ],
        },
      };
  }
  if (best.score === 0 && (has("price") || has("cost"))) return topicReply("pricing");
  return best.reply;
}

function fallback(): AskReply {
  return {
    id: "fallback",
    text: "I don't have a pre-written answer for that one. Viviene can answer it properly. Send a quick message or book a call.",
    links: [{ label: "Contact Viviene", to: "/contact" }],
  };
}
