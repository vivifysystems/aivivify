// Public entry point for VIVIFY's canonical content: only what the website may
// ship. Registers (discrepancies, withheld claims, unverified stats) are imported
// directly by tests and scripts, never through here and never by components.
export { links, footerLinks } from "./links.ts";
export { services } from "./services.ts";
export { projects } from "./projects.ts";
export { publishedStats, publishableStats } from "./stats.ts";
export type { Link, Service, Project, Stat, ContentStatus } from "./schema.ts";
export { systems, enabledSystems, systemGroups, availabilityLabel, systemById } from "./systems.ts";
export { packages, pricingNote } from "./packages.ts";
export { demos, demoById, SAMPLE_BUSINESS } from "./demos.ts";
export { faqs } from "./faq.ts";
export { processSteps } from "./process.ts";
export { quizQuestions } from "./quiz.ts";
export { founder } from "./founder.ts";
export { brand } from "./brand.ts";
export { homeProof } from "./proof.ts";
export { contactFormActive } from "./privacy.ts";
export {
  workCategories,
  projectCategory,
  featuredProjectIds,
  normalizeTool,
  projectTools,
  toolUsage,
  projectById,
  proofProjectId,
  hasProofCase,
} from "./work.ts";
export type { WorkCategory } from "./work.ts";
export type {
  Availability,
  System,
  SystemGroup,
  Package,
  Demo,
  DemoItem,
  Faq,
  QuizQuestion,
} from "./schema.ts";
export { tools, toolGroups, toolsDisclaimer } from "./tools.ts";
export type { ToolGroup } from "./tools.ts";
