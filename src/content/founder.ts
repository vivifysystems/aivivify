/**
 * Founder content. Facts come from the existing website's About section
 * (Phase 1 canonical copy). The founder's job title is an open discrepancy
 * ("founder-title"), so only the confirmed role "Founder, VIVIFY Solutions" is used.
 */
export const founder = {
  name: "Viviene Pitogo",
  firstName: "Viviene",
  role: "Founder, VIVIFY Solutions",
  intro:
    "I'm Viviene, a Computer Engineering graduate who builds automation systems for service businesses.",
  story: [
    "Before I ever touched n8n or Make, I was writing code in C++ and building embedded systems. That programming foundation shapes how I build workflows: tested, documented and made to hold up under pressure.",
    "I started with my own family's businesses, a catering operation and a computer café, and turned their manual chaos into systems that run without them. Now I build those same systems for founders who are done doing it manually.",
  ],
  approach: [
    {
      title: "Business problem first",
      line: "We start from the missed calls and the repeated questions, not from the technology.",
    },
    {
      title: "People stay in charge",
      line: "Automation handles the repetitive parts. Judgment calls go to a person.",
    },
    {
      title: "Honest about limits",
      line: "If a tool can't do something reliably, you hear it from us first.",
    },
    {
      title: "Yours to keep",
      line: "Accounts in your name and plain-English documentation for everything we build.",
    },
  ],
} as const;
