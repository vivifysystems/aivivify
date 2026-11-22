/** How a VIVIFY engagement runs: Discover → Design → Build → Test → Launch & Support. */
export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    line: "A free call to learn how inquiries, bookings and admin work today, and where time leaks out.",
  },
  {
    id: "design",
    title: "Design",
    line: "A written plan: which systems, which tools, what customers will see, and a quote.",
  },
  {
    id: "build",
    title: "Build",
    line: "We build and connect everything, using your existing tools where they fit.",
  },
  {
    id: "test",
    title: "Test",
    line: "We run real scenarios, edge cases and handoffs before anything reaches a customer.",
  },
  {
    id: "launch",
    title: "Launch & Support",
    line: "We switch it on, train your team, watch the first weeks and refine.",
  },
] as const;
