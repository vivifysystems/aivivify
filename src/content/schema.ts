/**
 * Schemas for VIVIFY's canonical content.
 *
 * Content modules import only the *types* below, so zod never reaches the
 * client bundle. The schemas are enforced by `npm test` (content.test.ts).
 */
import { z } from "zod";

/**
 * - verified:           confirmed by the owner with evidence. Only this status may
 *                       be shown for numeric business claims.
 * - consistent:         every source in the repo agrees, but not independently verified.
 * - needs-confirmation: sources conflict; the owner must decide. See discrepancies.ts.
 * - unverified:         a claim with no evidence on file. Never rendered as a statistic.
 */
export const contentStatus = z.enum(["verified", "consistent", "needs-confirmation", "unverified"]);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case");
/** Base filename (no extension) of an image in src/assets/optimized/{card,full}/. */
const assetName = slug;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url({ protocol: /^(https|mailto)$/ }),
  status: contentStatus,
  discrepancies: z.array(slug).optional(),
});

export const serviceSchema = z.object({
  id: slug,
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  status: contentStatus,
});

export const projectSchema = z.object({
  id: slug,
  tag: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  impact: z.string().min(1),
  beta: z.boolean().optional(),
  media: z.object({
    card: assetName.optional(),
    proof: assetName.optional(),
  }),
  caseStudy: z.object({
    problem: z.string().min(1),
    solution: z.string().min(1),
    result: z.string().min(1),
  }),
  demoUrl: z.url({ protocol: /^https$/ }).optional(),
  status: contentStatus,
  discrepancies: z.array(slug).optional(),
});

/** A numeric performance claim withheld from public copy (see withheld-claims.ts). */
export const withheldClaimSchema = z.object({
  claim: z.string().min(1),
  field: z.enum([
    "summary",
    "impact",
    "caseStudy.problem",
    "caseStudy.solution",
    "caseStudy.result",
  ]),
  /** Exact fragment that must no longer appear in the public field. */
  fragment: z.string().min(1),
  /** The field's full wording before the claim was removed. */
  original: z.string().min(1),
});

export const statSchema = z.object({
  id: slug,
  label: z.string().min(1),
  /** null while sources conflict and no value has been confirmed. */
  value: z.string().min(1).nullable(),
  countUp: z.object({ to: z.number(), suffix: z.string() }).optional(),
  placements: z.array(z.enum(["about", "results"])).min(1),
  status: contentStatus,
  sources: z.array(z.object({ where: z.string(), value: z.string() })).min(1),
  discrepancies: z.array(slug).optional(),
});

export const discrepancySchema = z.object({
  id: slug,
  topic: z.string().min(1),
  sources: z.array(z.object({ where: z.string(), value: z.string() })).min(2),
  decisionNeeded: z.string().min(1),
  /** What the site renders until the owner decides. */
  interimHandling: z.string().min(1),
  status: z.enum(["open", "resolved"]),
  /** Required once resolved: what the owner decided, when, and on what basis. */
  resolution: z.string().min(1).optional(),
});

export type ContentStatus = z.infer<typeof contentStatus>;
export type Link = z.infer<typeof linkSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Stat = z.infer<typeof statSchema>;
export type WithheldClaim = z.infer<typeof withheldClaimSchema>;
export type Discrepancy = z.infer<typeof discrepancySchema>;

// ---------------------------------------------------------------------------
// VIVIFY 2.0: systems catalog, packages, demos, FAQ, quiz.
// ---------------------------------------------------------------------------

/**
 * - available:              we deliver it today.
 * - pilot:                  offered case by case until infrastructure, reliability and
 *                           compliance are validated. Always labelled on the site.
 * - integration-dependent:  only where a supported provider/integration exists.
 * - partner-optional:       optional, fulfilled through a partner; never a core system.
 */
export const availability = z.enum([
  "available",
  "pilot",
  "integration-dependent",
  "partner-optional",
]);

export const systemGroup = z.enum([
  "get-found",
  "capture-respond",
  "follow-up-book",
  "run-improve",
]);

export const systemSchema = z.object({
  id: slug,
  enabled: z.boolean(),
  /** Shown as an animated showcase on the homepage. */
  featured: z.boolean(),
  group: systemGroup,
  /** lucide-react icon name, resolved in src/components/site/icons.ts. */
  icon: z.string().min(1),
  title: z.string().min(1),
  /** Explicit short name for tabs and compact lists. */
  shortTitle: z.string().min(1).max(24),
  /** One plain-English sentence for menus. */
  menuLine: z.string().min(1).max(90),
  headline: z.string().min(1).max(60),
  benefit: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(3).max(4),
  howItWorks: z.array(z.string().min(1)).min(3).max(5),
  youProvide: z.array(z.string().min(1)).min(1),
  goodToKnow: z.array(z.string().min(1)).min(1),
  availability,
  demoId: slug.optional(),
  /** Portfolio projects (projects.ts ids) that show related, real work. */
  relatedProjects: z.array(slug).optional(),
  /** What VIVI says when presenting this system. */
  viviLine: z.string().min(1).max(110),
  /** Explicit CTA labels; never derived from the title. */
  exploreLabel: z.string().min(1).max(32),
  /** Required when demoId is set (enforced by v2-content.test.ts). */
  demoLabel: z.string().min(1).max(28).optional(),
});

export const packageSchema = z.object({
  id: slug,
  name: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  bestFor: z.string().min(1),
  systems: z.array(slug).min(1),
  addOns: z.array(slug),
  availability,
  availabilityNote: z.string().min(1).optional(),
});

export const demoActor = z.enum(["customer", "assistant", "staff", "system"]);

export const demoItemSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("typing"), from: demoActor }),
  z.object({
    kind: z.literal("message"),
    from: demoActor,
    text: z.string().min(1),
    channel: z.string().optional(),
  }),
  z.object({
    kind: z.literal("event"),
    icon: z.string().min(1),
    text: z.string().min(1),
    tone: z.enum(["cyan", "purple", "neutral", "warn"]).optional(),
  }),
  z.object({
    kind: z.literal("card"),
    title: z.string().min(1),
    rows: z.array(z.tuple([z.string(), z.string()])).min(1),
    tone: z.enum(["cyan", "purple", "neutral"]).optional(),
  }),
  z.object({
    kind: z.literal("choice"),
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
  }),
  z.object({
    kind: z.literal("search"),
    query: z.string().min(1),
    results: z.array(
      z.object({ name: z.string(), line: z.string(), highlight: z.boolean().optional() }),
    ),
  }),
  z.object({
    kind: z.literal("form"),
    fields: z.array(z.tuple([z.string(), z.string()])).min(1),
    submit: z.string().min(1),
  }),
]);

export const demoSchema = z.object({
  id: slug,
  systemId: slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  device: z.enum(["phone", "browser", "desktop", "call"]),
  screenTitle: z.string().min(1),
  /** Shown on every demo: what is simulated. */
  simulationNote: z.string().min(1),
  /** Screen content before step 1, so the device never starts empty. */
  preface: z.array(demoItemSchema).optional(),
  steps: z
    .array(
      z
        .object({
          stage: z.string().min(1).max(26),
          /** lucide icon for the pipeline node. */
          icon: z.string().min(1),
          caption: z.string().min(1),
          /** What the customer sees on the device. */
          items: z.array(demoItemSchema),
          /** What happens behind the scenes (records, rules, notifications). */
          ops: z.array(demoItemSchema),
        })
        .refine((s) => s.items.length + s.ops.length > 0, "a step must show something"),
    )
    .min(3)
    .max(6),
});

export const faqSchema = z.object({
  id: slug,
  question: z.string().min(1),
  answer: z.string().min(1),
  /** Extra words Ask VIVI matches on. */
  keywords: z.array(z.string()).optional(),
});

export const quizQuestionSchema = z.object({
  id: slug,
  question: z.string().min(1),
  options: z
    .array(z.object({ label: z.string().min(1), score: z.number().int().min(0).max(2) }))
    .min(2)
    .max(4),
  /** Systems this question points to, with how strongly. */
  systems: z.array(z.tuple([slug, z.number().positive()])).min(1),
});

export type Availability = z.infer<typeof availability>;
export type SystemGroup = z.infer<typeof systemGroup>;
export type System = z.infer<typeof systemSchema>;
export type Package = z.infer<typeof packageSchema>;
export type DemoItem = z.infer<typeof demoItemSchema>;
export type Demo = z.infer<typeof demoSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
