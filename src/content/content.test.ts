/// <reference types="node" />
// Content checks. Run with `npm test` (Node's built-in runner, Node >= 22.18).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { z } from "zod";
import {
  discrepancySchema,
  linkSchema,
  projectSchema,
  serviceSchema,
  statSchema,
  withheldClaimSchema,
  type Link,
  type Project,
  type Stat,
} from "./schema.ts";
import { links, projects, publishableStats, publishedStats, services } from "./index.ts";
import type { Discrepancy, WithheldClaim } from "./schema.ts";

// Content review files live in src/content/internal/ (gitignored, never committed).
// Checks that need them are skipped when absent. They are loaded by computed URL so
// that `tsc` also passes in a clone that does not have them.
const internal = (file: string) => new URL(`./internal/${file}`, import.meta.url);
const hasInternal = existsSync(internal("discrepancies.ts"));
const noInternal = hasInternal ? false : "local content review files not present";
const { discrepancies }: { discrepancies: readonly Discrepancy[] } = hasInternal
  ? await import(internal("discrepancies.ts").href)
  : { discrepancies: [] };
const { withheldClaims }: { withheldClaims: Record<string, readonly WithheldClaim[]> } = hasInternal
  ? await import(internal("withheld-claims.ts").href)
  : { withheldClaims: {} };
const { statClaims }: { statClaims: readonly Stat[] } = hasInternal
  ? await import(internal("stat-claims.ts").href)
  : { statClaims: [] };
import * as mcp from "../lib/mcp/data.ts";

const fromSrc = (p: string) => new URL(`../${p}`, import.meta.url);
const allStats: readonly Stat[] = [...publishedStats, ...statClaims];

function assertUnique(ids: readonly string[], what: string) {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes, [], `duplicate ${what} ids: ${dupes.join(", ")}`);
}

/** Every text field of a project that the website or MCP server can show. */
function publicFields(p: Project): Record<string, string> {
  return {
    title: p.title,
    summary: p.summary,
    impact: p.impact,
    "caseStudy.problem": p.caseStudy.problem,
    "caseStudy.solution": p.caseStudy.solution,
    "caseStudy.result": p.caseStudy.result,
  };
}

test("all content matches its schema", () => {
  z.record(z.string(), linkSchema).parse(links);
  z.array(serviceSchema).parse(services);
  z.array(projectSchema).parse(projects);
  z.array(statSchema).parse(allStats);
  z.array(discrepancySchema).parse(discrepancies);
  z.record(z.string(), z.array(withheldClaimSchema)).parse(withheldClaims);
});

test("ids are unique", () => {
  assertUnique(
    services.map((s) => s.id),
    "service",
  );
  assertUnique(
    projects.map((p) => p.id),
    "project",
  );
  assertUnique(
    allStats.map((s) => s.id),
    "stat",
  );
  assertUnique(
    discrepancies.map((d) => d.id),
    "discrepancy",
  );
});

test("resolved discrepancies record the owner's decision", { skip: noInternal }, () => {
  for (const d of discrepancies.filter((d) => d.status === "resolved")) {
    assert.ok(d.resolution, `${d.id} is resolved but has no recorded resolution`);
  }
});

test("every flagged item points at a registered discrepancy", { skip: noInternal }, () => {
  const known = new Set(discrepancies.map((d) => d.id));
  const flagged: (Link | Project | Stat)[] = [
    ...Object.values(links as Record<string, Link>),
    ...projects,
    ...allStats,
  ];
  for (const item of flagged) {
    const name = "id" in item ? item.id : item.label;
    for (const ref of item.discrepancies ?? []) {
      assert.ok(known.has(ref), `${name} references unknown discrepancy "${ref}"`);
    }
    if (item.status === "needs-confirmation") {
      assert.ok(item.discrepancies?.length, `${name} needs confirmation but cites no discrepancy`);
    }
  }
});

test("only verified stats are published; unverified ones stay in the register", () => {
  for (const s of publishedStats) {
    assert.equal(s.status, "verified", `${s.id} is published without verification`);
    assert.notEqual(s.value, null, `${s.id} is published without a confirmed value`);
  }
  for (const s of statClaims) {
    assert.notEqual(s.status, "verified", `${s.id} is verified — move it to publishedStats`);
  }
  for (const placement of ["about", "results"] as const) {
    for (const s of publishableStats(placement)) assert.equal(s.status, "verified");
  }
});

test(
  "withheld claims are absent from public copy, with their original wording kept",
  { skip: noInternal },
  () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const id of Object.keys(withheldClaims)) {
      assert.ok(ids.has(id), `withheld-claims.ts references unknown project "${id}"`);
    }
    for (const p of projects) {
      const fields = publicFields(p);
      for (const w of withheldClaims[p.id] ?? []) {
        assert.ok(
          !fields[w.field].includes(w.fragment),
          `${p.id}.${w.field} still says "${w.fragment}"`,
        );
        assert.ok(
          w.original.includes(w.fragment),
          `${p.id}: original wording for "${w.claim}" not preserved`,
        );
        assert.notEqual(fields[w.field], w.original, `${p.id}.${w.field} was not edited`);
      }
    }
  },
);

test("project copy carries no unevidenced numeric performance figures", () => {
  // Ranges ("2–4", "3-5") and number + time unit ("10 seconds", "6 min", "20 hrs").
  // Clock times ("8AM", "2 AM") and "24/7" are schedule/capability facts and allowed.
  const numericClaim =
    /\d+\s*[–-]\s*\d+|\b\d+(\.\d+)?\s*(%|x\b|hours?\b|hrs?\b|minutes?\b|mins?\b|seconds?\b|secs?\b|days?\b|weeks?\b)/i;
  for (const p of projects) {
    for (const [field, text] of Object.entries(publicFields(p))) {
      const m = text.match(numericClaim);
      assert.ok(!m, `${p.id}.${field} contains "${m?.[0]}" — withhold it until there is evidence`);
    }
  }
});

// The website bundles every value in the modules it imports, displayed or not. So UI
// code must never import a register, and the public content modules must not contain
// withheld wording, unpublished stat values, or unconfirmed alternative links.
test("registers stay out of the website bundle", { skip: noInternal }, () => {
  const register = /["'][^"']*(discrepancies|withheld-claims|stat-claims)(\.ts)?["']/;
  for (const dir of ["components/vivify/", "pages/", "hooks/"]) {
    for (const file of readdirSync(fromSrc(dir)).filter((f) => /\.tsx?$/.test(f))) {
      const code = readFileSync(fromSrc(dir + file), "utf8");
      assert.ok(!register.test(code), `${dir}${file} imports a register`);
    }
  }
  const index = readFileSync(fromSrc("content/index.ts"), "utf8");
  assert.ok(!register.test(index), "content/index.ts re-exports a register");

  const publicSource = ["links", "services", "projects", "stats"]
    .map((m) => readFileSync(fromSrc(`content/${m}.ts`), "utf8"))
    .join("\n");
  const mustNotShip = [
    ...Object.values(withheldClaims).flatMap((ws) => ws.map((w) => w.fragment)),
    // "24/7" is also legitimate capability wording (for example in a project title),
    // so only the distinctive stat values are checked.
    ...statClaims.flatMap((s) => (s.value === null || s.value === "24/7" ? [] : [s.value])),
    ...discrepancies
      .filter((d) => d.id === "linkedin-url" || d.id === "onlinejobs-url")
      .flatMap((d) => d.sources.filter((s) => s.where.startsWith("MCP")).map((s) => s.value)),
  ];
  for (const text of mustNotShip) {
    assert.ok(!publicSource.includes(text), `public content modules contain "${text}"`);
  }
});

test("every referenced image has an optimized copy and the original is preserved", () => {
  const originals = readdirSync(fromSrc("assets")).map((f) => f.replace(/\.[^.]+$/, ""));
  for (const p of projects) {
    const { card, proof } = p.media;
    if (card)
      assert.ok(
        existsSync(fromSrc(`assets/optimized/card/${card}.webp`)),
        `${p.id}: missing card ${card}`,
      );
    if (proof)
      assert.ok(
        existsSync(fromSrc(`assets/optimized/full/${proof}.webp`)),
        `${p.id}: missing proof ${proof}`,
      );
    for (const name of [card, proof].filter(Boolean)) {
      assert.ok(originals.includes(name!), `${p.id}: original for ${name} is gone`);
    }
  }
});

test("components read links from content instead of hard-coding them", () => {
  const dir = fromSrc("components/vivify/");
  const forbidden = [/calendly\.com/, /linkedin\.com/, /onlinejobs\.ph/, /mailto:/];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const code = readFileSync(new URL(file, dir), "utf8");
    for (const re of forbidden) {
      assert.ok(!re.test(code), `${file} hard-codes ${re.source}; use src/content/links.ts`);
    }
  }
});

// Drift guard: the MCP server keeps its own copy of the data until it is migrated.
// Any conflict with it must stay flagged until the owner resolves it.
test("conflicts with the MCP server data remain flagged", { skip: noInternal }, () => {
  const canonical = new Map(projects.map((p) => [p.id, p]));

  for (const m of mcp.projects) {
    const site = canonical.get(m.id);
    assert.ok(site, `MCP project "${m.id}" has no canonical counterpart`);
    const siteText = [site.title, site.summary, ...site.stack, ...Object.values(site.caseStudy)]
      .join(" ")
      .toLowerCase();
    const unknownTools = m.stack.filter((tool) => !siteText.includes(tool.toLowerCase()));
    if (unknownTools.length) {
      assert.equal(
        site.status,
        "needs-confirmation",
        `${m.id}: MCP lists ${unknownTools.join(", ")} which the website never mentions`,
      );
    }
  }

  const mcpIds = new Set(mcp.projects.map((p) => p.id));
  for (const p of projects.filter((p) => !mcpIds.has(p.id))) {
    assert.equal(p.status, "needs-confirmation", `${p.id} is missing from the MCP server`);
  }

  for (const key of ["linkedin", "onlinejobs"] as const) {
    const link: Link = links[key];
    const mcpValue = mcp.contact[key];
    if (mcpValue !== link.href) {
      assert.equal(link.status, "needs-confirmation", `${key} differs from MCP but is not flagged`);
      const recorded = discrepancies
        .filter((d) => link.discrepancies?.includes(d.id))
        .some((d) => d.sources.some((s) => s.value === mcpValue));
      assert.ok(recorded, `${key}: MCP value not recorded in its discrepancy`);
    }
  }
});

test("open items summary", { skip: noInternal }, (t) => {
  const open = discrepancies.filter((d) => d.status === "open");
  const withheld = Object.values(withheldClaims).flat();
  t.diagnostic(`${open.length} open discrepancies: ${open.map((d) => d.id).join(", ")}`);
  t.diagnostic(`${statClaims.length} headline stats unpublished until verified`);
  t.diagnostic(`${withheld.length} case-study claim edits withheld pending evidence`);
});
