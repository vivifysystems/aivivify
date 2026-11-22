import type { Stat } from "./schema.ts";

/**
 * Owner-verified headline statistics — the only numbers the website may show.
 * Empty until evidence is supplied; candidates wait in stat-claims.ts.
 */
export const publishedStats: readonly Stat[] = [];

/** Stats that may be shown in a given section: verified, with a confirmed value. */
export function publishableStats(placement: Stat["placements"][number]): Stat[] {
  return publishedStats.filter(
    (s) => s.status === "verified" && s.value !== null && s.placements.includes(placement),
  );
}
