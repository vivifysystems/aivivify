// Pure scoring for the Business Automation Readiness check. No I/O, no storage.
// The recommended package is derived from the recommended service and the packages'
// published inclusions (src/content/packages.ts), never scored independently, so
// the quiz can't recommend a package that doesn't list the service it leads with.
import type { Package, QuizQuestion, System } from "../content/schema.ts";

export type QuizAnswers = Record<string, number>; // question id -> option index

/** The answer that contributed most to the first recommendation. */
export type QuizLead = { questionId: string; question: string; answer: string };

export type QuizResult = {
  /** 0–100, share of the maximum possible "opportunity" score. */
  opportunity: number;
  level: "foundation" | "clear" | "high";
  /** System ids, strongest opportunity first (max 3, only those with signal). */
  systems: string[];
  /** The first recommendation (systems[0]) or null when nothing stands out. */
  primary: string | null;
  /** Which answer led to the first recommendation. */
  lead: QuizLead | null;
  /** A package that lists `primary` among its systems, or null. */
  packageId: string | null;
};

export function scoreQuiz(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  packages: readonly Package[],
): QuizResult {
  let total = 0;
  let max = 0;
  const weights = new Map<string, number>();
  // Per system: which question's answer pushed it hardest.
  const strongest = new Map<string, { contribution: number; q: QuizQuestion; label: string }>();
  for (const q of questions) {
    const top = Math.max(...q.options.map((o) => o.score));
    max += top;
    const idx = answers[q.id];
    if (idx === undefined || !q.options[idx]) continue;
    const s = q.options[idx].score;
    total += s;
    if (s === 0) continue;
    for (const [id, w] of q.systems) {
      weights.set(id, (weights.get(id) ?? 0) + s * w);
      const prev = strongest.get(id);
      if (!prev || s * w > prev.contribution)
        strongest.set(id, { contribution: s * w, q, label: q.options[idx].label });
    }
  }
  const ranked = [...weights]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([id]) => id)
    .slice(0, 3);
  const opportunity = max === 0 ? 0 : Math.round((total / max) * 100);
  const level = opportunity >= 60 ? "high" : opportunity >= 25 ? "clear" : "foundation";

  const primary = ranked[0] ?? null;
  const led = primary ? strongest.get(primary) : undefined;
  const lead: QuizLead | null = led
    ? { questionId: led.q.id, question: led.q.question, answer: led.label }
    : null;

  return {
    opportunity,
    level,
    systems: ranked,
    primary,
    lead,
    packageId: packageFor(primary, ranked, packages),
  };
}

/**
 * Only packages that list the primary service qualify. Among those, prefer the one
 * covering most of the other recommendations, then an available one over a pilot.
 */
function packageFor(
  primary: string | null,
  ranked: readonly string[],
  packages: readonly Package[],
): string | null {
  if (!primary) return null;
  let best: { id: string; cover: number; pilot: boolean } | null = null;
  for (const p of packages) {
    if (!p.systems.includes(primary)) continue;
    const cover = ranked.reduce((n, id, i) => n + (p.systems.includes(id) ? 3 - i : 0), 0);
    const cand = { id: p.id, cover, pilot: p.availability === "pilot" };
    if (
      !best ||
      cand.cover > best.cover ||
      (cand.cover === best.cover && best.pilot && !cand.pilot)
    )
      best = cand;
  }
  return best?.id ?? null;
}

export type RecommendationCopy = {
  systemTitle: string;
  packageName: string | null;
  /** Where the service sits and how available it is. Always present with a recommendation. */
  availability: string;
  /** Only for pilot / provider-dependent services: an invitation to ask, never a promise. */
  standalone: string | null;
  /** A short, plain summary for the contact form. Visitors can edit it before sending. */
  summary: string;
};

/** Words for the result screen and the contact form, from the published catalog only. */
export function describeRecommendation(
  result: QuizResult,
  systems: readonly Pick<System, "id" | "title" | "availability">[],
  packages: readonly Package[],
): RecommendationCopy {
  const system = systems.find((s) => s.id === result.primary);
  const pkg = packages.find((p) => p.id === result.packageId);
  if (!system) {
    return { systemTitle: "", packageName: null, availability: "", standalone: null, summary: "" };
  }
  const pilot = pkg?.availability === "pilot";
  const providerDependent = system.availability === "integration-dependent";

  const parts: string[] = [];
  if (pkg)
    parts.push(`Included in ${pkg.name}${pilot ? ", offered case by case as a pilot" : ""}.`);
  if (providerDependent)
    parts.push(
      "It depends on a supported phone and messaging provider, so we confirm it for your location first.",
    );
  const availability = parts.join(" ") || "Available.";

  const standalone =
    pilot || providerDependent
      ? `You can also ask whether ${system.title} can be set up on its own.`
      : null;

  const where = pkg ? ` (part of ${pkg.name}${pilot ? ", a pilot offered case by case" : ""})` : "";
  const reason = result.lead
    ? ` It came up from my answer to "${result.lead.question}": ${result.lead.answer}.`
    : "";
  const summary = [
    `I took the readiness check. Top suggestion: ${system.title}${where}.${reason}`,
    providerDependent ? "I understand it depends on my phone and messaging provider." : "",
    standalone ? "Could it also be set up on its own?" : "",
    "I'd like to talk through whether it fits.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    systemTitle: system.title,
    packageName: pkg?.name ?? null,
    availability,
    standalone,
    summary,
  };
}
