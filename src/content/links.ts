import type { Link } from "./schema.ts";

/**
 * Canonical contact and booking links. Components and the public MCP endpoint
 * must read from here rather than hard-coding URLs (enforced by tests).
 *
 * Owner-confirmed 2026-11-22: the LinkedIn profile, the Calendly event
 * ("active and free") and the viviene@vivify.solutions mailbox. No job-board profile is
 * listed: VIVIFY Solutions is not presented as a job-seeker profile.
 */
export const links = {
  bookingCall: {
    label: "Book a free 30-minute call",
    href: "https://calendly.com/vivienecreates/automation-discovery-call",
    status: "verified",
  },
  email: {
    label: "viviene@vivify.solutions",
    href: "mailto:viviene@vivify.solutions",
    status: "verified",
  },
  website: {
    label: "www.vivify.solutions",
    href: "https://www.vivify.solutions",
    status: "consistent",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vivienepitogo/",
    status: "verified",
  },
} as const satisfies Record<string, Link>;

/** Links shown in the footer's social row, in display order. */
export const footerLinks: readonly Link[] = [links.linkedin];
