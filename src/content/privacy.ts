import { brand } from "./brand.ts";
import { links } from "./links.ts";
import { projects } from "./projects.ts";

/**
 * Visitor-facing privacy policy, written from what the site actually does
 * (verified against the code and the network traffic of the built site).
 *
 * contactDelivery is the activation switch for the contact form disclosure:
 * - "pending": the form's email delivery is not set up; the page says so.
 * - "active":  messages are emailed through Resend. Flip this in the SAME release
 *              that sets the Resend environment variables (docs/launch/contact-form.md).
 * Never set "active" before delivery really works, and never leave it "pending"
 * once it does.
 */
export type ContactDelivery = "pending" | "active";

export const privacy = {
  lastUpdated: "2026-11-22",
  contactDelivery: "pending" as ContactDelivery,
  /**
   * Months after the last communication that inquiry emails are kept, or null for "no fixed
   * schedule". The owner has NOT yet committed to a deletion routine (2026-11-22), so this is
   * null and the page promises no schedule. Set it to 12 (the selected maximum) only when the
   * owner has committed to a routine they can reliably keep (see the retention procedure).
   */
  retentionMonths: null as number | null,
};

export type PrivacySection = { id: string; title: string; paragraphs: string[] };

const email = links.email.label;

export function formatLastUpdated(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function privacySections(
  state: { contactDelivery: ContactDelivery; retentionMonths: number | null } = privacy,
  hasRecordings: boolean = projects.some((p) => p.demoUrl),
): PrivacySection[] {
  const active = state.contactDelivery === "active";

  const contactForm: string[] = [
    "If you use the contact form, we receive your name, email address, the business name if you add one, the areas of help you tick, and your message. Your browser also tells our server how long the form was open and whether a hidden spam-check field was filled in. That is used only to filter automated spam. Please don't put sensitive details in the message, such as passwords, bank or ID numbers, or health information.",
    "We use what you send to reply to you and to work out whether we can help. We don't keep a separate inquiry database or notes after we've replied: your message stays in our email inbox.",
    active
      ? "When you send the form, your message is emailed to our inbox through Resend, an email delivery provider that processes data in the United States. We don't keep a separate database of form submissions. The copy we hold is the email in our inbox. Resend also keeps its own delivery records under its own privacy policy and retention rules, which we don't control."
      : "The online form is not switched on yet. Until it is, sending it does not deliver your message: its contents reach our website server (hosted by Vercel), which replies that delivery isn't set up and discards them. Please email us or book a call instead. This page will name our email provider before the form is switched on.",
  ];

  const sections: PrivacySection[] = [
    {
      id: "who",
      title: "Who runs this site",
      paragraphs: [
        `${brand.url.replace("https://", "")} is run by ${brand.name}, operated by ${brand.operator} from the Philippines. For any privacy question, or to ask about your information, email ${email}.`,
      ],
    },
    {
      id: "short",
      title: "The short version",
      paragraphs: [
        "You can browse this site without giving us any personal information. We only receive your details if you send the contact form, email us or book a call. We don't sell, rent or disclose visitors' information to third parties for their own independent use, and this site has no advertising or analytics trackers. The providers named below handle information only to run this site and our email for us.",
      ],
    },
    { id: "form", title: "Contact form", paragraphs: contactForm },
    {
      id: "email",
      title: "Email",
      paragraphs: [
        `If you email ${email} directly, we receive the address you write from and your message, and we treat it like a form inquiry. Mail sent to that address is forwarded by Cloudflare (Email Routing) to our mailbox, which is hosted by Google (Gmail). Copies can therefore exist at Cloudflare while it is forwarding, and in the Gmail mailbox, including its sent and spam folders.`,
      ],
    },
    {
      id: "booking",
      title: "Booking a call",
      paragraphs: [
        "The booking buttons open Calendly in a new tab. Nothing is sent to Calendly from this site until you open that page. When you book, Calendly collects what you enter (such as your name, email and answers to its questions) and passes the booking to us. Calendly is a United States provider with its own privacy policy and cookies.",
      ],
    },
    {
      id: "hosting",
      title: "Hosting and server logs",
      paragraphs: [
        "This site is hosted on Vercel and served through Cloudflare. Like any web host, Vercel and Cloudflare receive technical details when your browser loads a page, such as your IP address, the pages requested and your browser type, and keep their own logs under their own privacy policies. Our own logs for the contact form record only event names and status codes, never your name, email or message. To limit abuse, the form's server keeps a short-lived count of requests per IP address in memory; it isn't saved to a database.",
        "Fonts, images and scripts are served from this site itself, so loading a page doesn't contact Google Fonts or any analytics or advertising company.",
      ],
    },
    ...(hasRecordings
      ? [
          {
            id: "videos",
            title: "Demo recordings",
            paragraphs: [
              "Some case studies offer a recording hosted on Google Drive. Google's video player loads only after you press play, or you can open the file on Google Drive yourself. Once it loads, Google receives your IP address and may set cookies, under Google's own privacy policy.",
            ],
          },
        ]
      : []),
    {
      id: "storage",
      title: "Cookies and browser storage",
      paragraphs: [
        "We don't set cookies. The readiness check keeps your answers in your browser's session storage for that tab only, so you can come back to your result; closing the tab clears them, and they are never sent to us. Ask VIVI is a guided assistant with pre-written answers: what you type stays in your browser and isn't sent anywhere. Services you choose to open, such as Calendly or Google, set their own cookies.",
      ],
    },
    {
      id: "providers",
      title: "Who else handles information",
      paragraphs: [
        `Vercel hosts this site and Cloudflare serves it, and Cloudflare also forwards mail sent to our address. Google (Gmail) hosts our mailbox. ${active ? "Resend delivers contact form messages to our inbox. " : "An email provider will deliver contact form messages once the form is switched on; it is not in use yet. "}Calendly handles bookings you make. ${hasRecordings ? "Google also serves demo recordings if you play them. " : ""}A public, read-only endpoint that lets AI assistants read the same public information as this site runs on Supabase, which may log requests; it doesn't ask for or store personal information. The footer links to our LinkedIn profile, which LinkedIn's own terms cover.`,
        "These providers process information in the United States and other countries, so your information may be transferred outside the country where you live when you use them. Each publishes its own privacy and data protection terms.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      paragraphs: [
        state.retentionMonths === null
          ? "We don't keep a separate inquiry database or notes. Your message stays in our email inbox until we delete it. We don't run an automatic deletion system and we don't promise a deletion schedule: we delete inquiry emails that didn't lead to work when we review the inbox, and we delete yours sooner if you ask. If you become a client, we keep your information for the working relationship and as long as contracts, accounting or the law require. Copies held by providers, such as Google, Cloudflare or an email delivery provider, follow their own retention periods, which we don't control."
          : `Inquiries that don't become client work: we aim to delete the emails ${state.retentionMonths} months after our last communication with you at the latest. If you become a client, we keep your information for the working relationship and as long as contracts, accounting or the law require. We delete by hand, not with an automatic system. Copies held by providers, such as Google, Cloudflare or an email delivery provider, follow their own retention periods, which we don't control.`,
      ],
    },
    {
      id: "rights",
      title: "Your choices",
      paragraphs: [
        `You can ask us what we hold about you, to correct it, to delete it, or to stop using it for a purpose. Email ${email} from the address you used so we can match it. We may need to confirm it's you, and we'll reply as soon as we reasonably can. If you are in the Philippines and we haven't resolved a concern, you can also contact the National Privacy Commission at privacy.gov.ph.`,
      ],
    },
    {
      id: "changes",
      title: "Changes",
      paragraphs: ["If we change how we handle information, we'll update this page and its date."],
    },
  ];
  return sections;
}
