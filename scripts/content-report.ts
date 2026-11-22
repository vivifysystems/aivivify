// Prints the content discrepancy report as Markdown, generated from src/content.
// Usage: npm run content:report   (writes docs/content-discrepancies.md)
import { projects } from "../src/content/index.ts";
import { discrepancies } from "../src/content/internal/discrepancies.ts";
import { withheldClaims } from "../src/content/internal/withheld-claims.ts";
import { statClaims } from "../src/content/internal/stat-claims.ts";

const lines: string[] = [];
const open = discrepancies.filter((d) => d.status === "open");

lines.push("# Content discrepancies", "");
lines.push(
  "_Generated from `src/content` by `npm run content:report`. Do not edit by hand._",
  "",
  `**${open.length} open** · ${discrepancies.length - open.length} resolved. ` +
    "Nothing below has been decided by the developer; each item needs owner confirmation with evidence.",
  "",
);

for (const d of discrepancies) {
  lines.push(`## ${d.topic}`, "", `\`${d.id}\` · **${d.status}**`, "");
  lines.push("| Source | Says |", "|---|---|");
  for (const s of d.sources) lines.push(`| ${s.where} | ${s.value.replace(/\|/g, "\\|")} |`);
  lines.push("", `**Decision needed:** ${d.decisionNeeded}`, "");
  if (d.resolution) lines.push(`**Resolved:** ${d.resolution}`, "");
  else lines.push(`**Until then:** ${d.interimHandling}`, "");
}

lines.push("## Headline statistics hidden until verified", "");
lines.push("| Stat | Value on file | Status | Appeared in |", "|---|---|---|---|");
for (const s of statClaims) {
  lines.push(
    `| ${s.label} | ${s.value ?? "conflicting"} | ${s.status} | ${s.sources.map((x) => x.where).join("; ")} |`,
  );
}

lines.push("", "## Case-study claims withheld pending evidence", "");
lines.push(
  "Removed from the public copy (website) on the owner's instruction. The original wording is " +
    "preserved here and in `src/content/withheld-claims.ts`; restore it only with evidence.",
  "",
);
lines.push("| Project | Claim | Field | Original wording |", "|---|---|---|---|");
for (const p of projects) {
  for (const w of withheldClaims[p.id] ?? []) {
    lines.push(
      `| ${p.title} | ${w.claim} | \`${w.field}\` | ${w.original.replace(/\|/g, "\\|")} |`,
    );
  }
}

console.log(lines.join("\n"));
