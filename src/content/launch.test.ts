// The public launch content: which projects may appear, which may not, and the
// canonical address. These tests make changes to either deliberate.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { sitemapPaths } from "../lib/sitemap.ts";
import * as mcp from "../lib/mcp/data.ts";
import { projects } from "./projects.ts";
import { featuredProjectIds, hasProofCase, projectCategory, workCategories } from "./work.ts";
import { systems } from "./systems.ts";

const fromRoot = (p: string) => new URL(`../../${p}`, import.meta.url);

// Owner decisions of 2026-11-22. Nothing here is a publication approval: these are the
// projects staged in the release for the owner's final review. Add a project only with
// the owner's explicit approval, and update this list in the same change.
const STAGED = [
  "ai-voice-receptionist",
  "intelligent-file-management",
  "social-engine",
  "social-auto-poster",
  "ugc-script-generator",
];

test("only the staged projects are in the launch content", () => {
  assert.deepEqual(
    projects.map((p) => p.id),
    STAGED,
  );
});

test("the two concept demonstrations are labelled as such everywhere", () => {
  const concepts = projects.filter((p) => p.kind === "concept").map((p) => p.id);
  assert.deepEqual(concepts, ["social-auto-poster", "ugc-script-generator"]);
  for (const p of mcp.projects.filter((p) => concepts.includes(p.id))) {
    assert.equal(p.kind, "concept");
    assert.match(p.summary, /^Concept demonstration/);
  }
  for (const p of projects) {
    const text = JSON.stringify(p);
    if (p.kind === "concept") assert.ok(!/\bclient\b/i.test(text), `${p.id} implies a client`);
  }
});

test("no recording or video is published until the owner has reviewed it", () => {
  for (const p of projects) assert.equal(p.demoUrl, undefined, `${p.id} has a recording`);
  const all = readFileSync(fromRoot("src/content/projects.ts"), "utf8");
  assert.ok(!/drive\.google\.com/.test(all));
});

test("every featured, categorised and related project is a staged project", () => {
  const ids = new Set(STAGED);
  for (const id of featuredProjectIds) assert.ok(ids.has(id), `featured ${id}`);
  for (const id of Object.keys(projectCategory)) assert.ok(ids.has(id), `category map ${id}`);
  for (const s of systems) for (const id of s.relatedProjects ?? []) assert.ok(ids.has(id), id);
  for (const c of workCategories)
    assert.ok(
      Object.values(projectCategory).includes(c.id),
      `category "${c.label}" has no staged project`,
    );
});

test("the home proof section appears only when its project is in the launch content", () => {
  assert.equal(
    hasProofCase,
    projects.some((p) => p.id === "fb-messenger-agent"),
  );
});

test("sitemap, MCP and site list the same projects", () => {
  const paths = sitemapPaths();
  assert.deepEqual(
    paths.filter((p) => p.startsWith("/work/")),
    STAGED.map((id) => `/work/${id}`),
  );
  assert.deepEqual(
    mcp.projects.map((p) => p.id),
    STAGED,
  );
  for (const p of mcp.projects) assert.ok(mcp.projects.find((x) => x.id === p.id));
});

test("only media of staged projects ships in the source tree", () => {
  const keep = new Set([
    "proof-voice-receptionist",
    "proof-file-management",
    "proof-social-engine",
    "cover-social-auto",
    "cover-ugc-script",
    "viviene-portrait",
  ]);
  for (const dir of ["src/assets/optimized/card", "src/assets/optimized/full"]) {
    for (const f of readdirSync(fromRoot(dir))) {
      assert.ok(keep.has(f.replace(/\.webp$/, "")), `${dir}/${f} is not staged media`);
    }
  }
  const originals = readdirSync(fromRoot("src/assets")).filter((f) =>
    /^(proof|cover|project)-/.test(f),
  );
  for (const f of originals) {
    assert.ok(keep.has(f.replace(/\.[^.]+$/, "")), `src/assets/${f} is not staged media`);
  }
});
