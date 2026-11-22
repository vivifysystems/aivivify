import type { Link } from "./schema.ts";

/**
 * Canonical contact and booking links. Components must read from here rather
 * than hard-coding URLs (enforced by content.test.ts).
 *
 * LinkedIn and OnlineJobs.ph: the `href` is the value the live website shows
 * today, kept unchanged. It is NOT a decision — the MCP server lists a different
 * value (recorded only in discrepancies.ts, so the unconfirmed alternative never
 * ships in the public bundle) and the owner must confirm which is correct.
 */
export const links = {
  bookingCall: {
    label: "Book a free 30-minute call",
    href: "https://calendly.com/vivienecreates/automation-discovery-call",
    status: "consistent",
  },
  email: {
    label: "viviene@vivify.solutions",
    href: "mailto:viviene@vivify.solutions",
    status: "consistent",
  },
  website: {
    label: "vivify.solutions",
    href: "https://vivify.solutions",
    status: "consistent",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vivienepitogo/",
    status: "needs-confirmation",
    discrepancies: ["linkedin-url"],
  },
  onlinejobs: {
    label: "OnlineJobs.ph",
    href: "https://v2.onlinejobs.ph/jobseekers/info/4855809",
    status: "needs-confirmation",
    discrepancies: ["onlinejobs-url"],
  },
} as const satisfies Record<string, Link>;

/** Links shown in the footer's social row, in display order. */
export const footerLinks: readonly Link[] = [links.linkedin, links.onlinejobs];
