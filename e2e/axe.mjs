// Small axe-core helper for the contact tests (the full-site scan lives in a11y.e2e.mjs).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);

/** Returns serious and critical violations on the current page, as readable strings. */
export async function seriousViolations(page) {
  await page.evaluate(axeSource);
  const v = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
      resultTypes: ["violations"],
    });
    return r.violations.map((x) => ({
      id: x.id,
      impact: x.impact,
      n: x.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
  });
  return v
    .filter((x) => ["serious", "critical"].includes(x.impact))
    .map((x) => `${x.id} (${x.impact}): ${x.n.join(", ")}`);
}
