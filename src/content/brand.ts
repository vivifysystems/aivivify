/**
 * Brand and positioning, shared by the website, structured data and the public
 * MCP endpoint so they cannot drift apart.
 */
export const brand = {
  name: "VIVIFY Solutions",
  /** Operator shown in the privacy policy and structured data. */
  operator: "Viviene Pitogo",
  positioning: "Founder-led AI automation and business systems consultancy for service businesses.",
  focus: "Practical business outcomes and reliable customer operations.",
  /** Primary canonical address (owner decision 2026-11-22), matching the existing production redirect from the apex. */
  url: "https://www.vivify.solutions",
} as const;
