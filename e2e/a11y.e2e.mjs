// Automated accessibility scan (axe-core) of every route, including the open Systems menu,
// the Ask VIVI panel and the mobile drawer. Fails on serious or critical violations.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

async function scan(page, context) {
  await page.evaluate(axeSource);
  const results = await page.evaluate(async (ctx) => {
    const r = await window.axe.run(ctx ? document.querySelector(ctx) : document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
      resultTypes: ["violations"],
    });
    return r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes
        .slice(0, 3)
        .map(
          (n) =>
            n.target.join(" ") +
            " :: " +
            (n.failureSummary ?? "").split("\n").slice(0, 3).join(" | "),
        ),
    }));
  }, context ?? null);
  return results;
}

const ROUTES = [
  "/",
  "/solutions",
  "/systems",
  "/systems/missed-call-text-back",
  "/demos",
  "/work",
  "/work/ai-voice-receptionist",
  "/about",
  "/contact",
  "/privacy",
];

for (const [name, vp, touch] of [
  ["desktop 1440", VIEWPORTS["1440"], false],
  ["phone 390", VIEWPORTS["390"], true],
]) {
  for (const reducedMotion of [false, true]) {
    test(`axe: all routes at ${name}${reducedMotion ? ", reduced motion" : ""}`, async () => {
      const page = await newPage(env.browser, vp, { touch, reducedMotion });
      const bad = [];
      for (const path of ROUTES) {
        await page.goto(env.base + path);
        await page.waitForTimeout(500);
        // Reveal everything so off-screen content is scanned in its settled state.
        await page.evaluate(() =>
          document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")),
        );
        await page.waitForTimeout(1000);
        for (const v of await scan(page))
          if (["serious", "critical"].includes(v.impact))
            bad.push(`${path} [${v.impact}] ${v.id}: ${v.nodes.join(" // ")}`);
      }
      assert.deepEqual(bad, [], bad.join("\n"));
      await page.context().close();
    });
  }
}

test("axe: Systems menu (desktop, open)", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1024x640"]);
  await page.goto(env.base + "/");
  await page.getByRole("button", { name: "Systems", exact: true }).click();
  await page.waitForTimeout(600);
  const bad = (await scan(page)).filter((v) => ["serious", "critical"].includes(v.impact));
  assert.deepEqual(bad, []);
  await page.context().close();
});

test("axe: Ask VIVI dialog with a reply, and the mobile drawer", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  const dialog = page.getByRole("dialog", { name: "Ask VIVI" });
  await dialog.getByRole("button", { name: "What can VIVIFY build?" }).tap();
  await page.waitForTimeout(900);
  let bad = (await scan(page)).filter((v) => ["serious", "critical"].includes(v.impact));
  assert.deepEqual(bad, [], JSON.stringify(bad));
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page
    .getByRole("dialog", { name: "Site menu" })
    .getByRole("button", { name: "Systems" })
    .tap();
  await page.waitForTimeout(600);
  bad = (await scan(page)).filter((v) => ["serious", "critical"].includes(v.impact));
  assert.deepEqual(bad, [], JSON.stringify(bad));
  await page.context().close();
});
