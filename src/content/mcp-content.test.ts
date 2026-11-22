// The public MCP endpoint must say exactly what the website says. Its data module
// derives from src/content; these tests keep it that way and keep the retired
// claims, links and brand name out of it.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import * as mcp from "../lib/mcp/data.ts";
import { brand, links, packages, projects, systems, tools } from "./index.ts";

const fromRoot = (p: string) => new URL(`../../${p}`, import.meta.url);
const mcpSource = [
  "src/lib/mcp/data.ts",
  "src/lib/mcp/index.ts",
  ...readdirSync(fromRoot("src/lib/mcp/tools")).map((f) => `src/lib/mcp/tools/${f}`),
]
  .map((f) => readFileSync(fromRoot(f), "utf8"))
  .join("\n");
const generated = readFileSync(fromRoot("supabase/functions/mcp/index.ts"), "utf8");
const manifest = readFileSync(fromRoot(".lovable/mcp/manifest.json"), "utf8");

test("MCP data is derived from the website's canonical content", () => {
  assert.equal(mcp.about.brand, brand.name);
  assert.equal(mcp.about.positioning, brand.positioning);
  assert.equal(mcp.about.name, "Viviene Pitogo");
  assert.equal(mcp.contact.email, links.email.label);
  assert.equal(mcp.contact.linkedin, links.linkedin.href);
  assert.equal(mcp.contact.booking, links.bookingCall.href);
  assert.equal(mcp.contact.bookingLabel, links.bookingCall.label);
  assert.equal(mcp.projects.length, projects.length);
  for (const p of projects) {
    const m = mcp.projects.find((x) => x.id === p.id);
    assert.ok(m, `${p.id} missing from MCP`);
    assert.deepEqual(
      { ...m },
      {
        id: p.id,
        tag: p.tag,
        title: p.title,
        summary: p.summary,
        stack: [...p.stack],
        problem: p.caseStudy.problem,
        solution: p.caseStudy.solution,
        result: p.caseStudy.result,
      },
    );
  }
  assert.deepEqual(
    mcp.systems.map((s) => s.id),
    systems.filter((s) => s.enabled).map((s) => s.id),
  );
  assert.deepEqual(
    mcp.solutionPackages.map((p) => [p.id, p.includes]),
    packages.map((p) => [p.id, [...p.systems]]),
  );
  assert.deepEqual(
    mcp.platforms,
    tools.map((t) => t.name),
  );
});

test("MCP shows the same pilot and provider-dependent labels as the website", () => {
  const labelled = mcp.systems.filter((s) => s.availability !== "Available");
  assert.ok(labelled.length > 0, "no pilot or provider-dependent system is labelled");
  const connect = mcp.solutionPackages.find((p) => p.id === "connect");
  assert.match(connect?.availability ?? "", /Pilot/);
  assert.ok(connect?.note, "the Connect package lost its pilot note");
});

test("MCP carries no retired content", () => {
  for (const text of [mcpSource, generated, manifest]) {
    assert.ok(!/onlinejobs/i.test(text), "OnlineJobs.ph is still in the MCP server");
    assert.ok(!text.includes("viviene-pitogo"), "the outdated LinkedIn URL is still in the MCP");
    assert.ok(!/VIVIFY Automation/.test(text), "the old brand name is still in the MCP server");
    assert.ok(!/AI Automation Specialist/.test(text), "the old founder title is still in the MCP");
    assert.ok(
      !/e-commerce brands/i.test(text),
      "the unconfirmed audience claim is still in the MCP",
    );
    assert.ok(!/zero missed calls/i.test(text), "an unsupported guarantee is still in the MCP");
  }
});

test("MCP publishes no statistics until the owner verifies one", () => {
  assert.deepEqual(mcp.results, []);
  assert.ok(!/12\+|3–5 hrs|15–20|1 hr → 6 min/.test(generated));
});

test("the generated function matches the source (run the build to regenerate)", () => {
  for (const p of projects) assert.ok(generated.includes(p.id), `${p.id} missing from generated`);
  assert.ok(generated.includes(links.linkedin.href));
});

test("public pages and structured data use the canonical LinkedIn and email", () => {
  const html = readFileSync(fromRoot("index.html"), "utf8");
  const ld = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1],
  );
  assert.equal(ld.email, links.email.label);
  assert.equal(ld.description, brand.positioning);
  assert.deepEqual(ld.sameAs, [links.linkedin.href]);
  assert.deepEqual(ld.founder.sameAs, [links.linkedin.href]);
  assert.ok(!/onlinejobs/i.test(html));
});

test("no source file or page ships OnlineJobs.ph or the old LinkedIn URL", () => {
  const dirs = ["src/content", "src/pages", "src/components/site", "src/lib", "index.html"];
  const files: string[] = [];
  const walk = (rel: string) => {
    const url = fromRoot(rel);
    let entries: string[];
    try {
      entries = readdirSync(url);
    } catch {
      files.push(rel);
      return;
    }
    for (const e of entries) {
      if (e === "internal" || e.endsWith(".test.ts")) continue;
      walk(`${rel}/${e}`);
    }
  };
  dirs.forEach(walk);
  for (const f of files.filter((f) => /\.(tsx?|html)$/.test(f))) {
    const text = readFileSync(fromRoot(f), "utf8");
    assert.ok(!/onlinejobs/i.test(text), `${f} mentions OnlineJobs.ph`);
    assert.ok(!text.includes("viviene-pitogo"), `${f} has the outdated LinkedIn URL`);
  }
});

test("the Lovable manifest snapshot matches the source", () => {
  const m = JSON.parse(manifest);
  assert.equal(m.mcp.server.title, "VIVIFY Solutions");
  assert.deepEqual(
    m.mcp.tools.map((t: { name: string }) => t.name),
    ["list_projects", "get_project", "get_services", "get_contact_info", "get_about"],
  );
});
