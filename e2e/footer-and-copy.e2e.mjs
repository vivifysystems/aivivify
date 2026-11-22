// The compact footer and the final copy refinements, checked in a real browser.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup, setupActive } from "./setup.mjs";
import { seriousViolations } from "./axe.mjs";

let env, formActive;
before(async () => {
  env = await setup();
  formActive = await setupActive();
});
after(async () => {
  await env.teardown();
  await formActive.teardown();
});

const MAILTO = "mailto:viviene@vivify.solutions";
const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";
const LINKEDIN = "https://www.linkedin.com/in/vivienepitogo/";
const WIDTHS = [320, 375, 390, 768, 1024, 1440];

async function footerOf(page) {
  const f = page.getByRole("contentinfo");
  await f.scrollIntoViewIfNeeded();
  return f;
}

for (const w of WIDTHS) {
  test(`footer is compact, complete and does not overflow at ${w}px`, async () => {
    const page = await newPage(
      env.browser,
      { width: w, height: w < 500 ? 740 : 900 },
      { touch: w < 800 },
    );
    await page.goto(env.base + "/about");
    const f = await footerOf(page);
    const box = await f.boundingBox();
    // Before this change the footer was 1331px (320) to 811px (1024) high.
    const max = { 320: 800, 375: 600, 390: 600, 768: 380, 1024: 380, 1440: 380 }[w];
    assert.ok(
      box.height <= max,
      `footer is ${Math.round(box.height)}px high at ${w}px (limit ${max})`,
    );
    assert.ok(
      (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0,
      "no horizontal overflow",
    );
    // Brand: the Winged V and the short description; no booking button repeated here.
    assert.equal(await f.locator('img[src="/brand/vivify-mark.svg"]').count(), 1);
    assert.match(
      await f.textContent(),
      /AI automation and business systems for service businesses\./,
    );
    assert.equal(
      await f.getByRole("link", { name: /Book a free 30-minute call/ }).count(),
      0,
      "no repeated booking button",
    );
    // Explore.
    const explore = f.getByRole("navigation", { name: "Explore" });
    assert.deepEqual(await explore.getByRole("link").allTextContents(), [
      "Solutions",
      "Systems",
      "Demos",
      "Work",
      "About",
    ]);
    // Connect.
    const connect = f.getByRole("navigation", { name: "Connect" });
    assert.equal(
      await connect.getByRole("link", { name: "Email us" }).getAttribute("href"),
      MAILTO,
    );
    const book = connect.getByRole("link", { name: /^Book a call/ });
    assert.equal(await book.getAttribute("href"), CALENDLY);
    assert.equal(await book.getAttribute("target"), "_blank");
    const li = connect.getByRole("link", { name: /^LinkedIn/ });
    assert.equal(await li.getAttribute("href"), LINKEDIN);
    assert.equal(await connect.getByRole("link").count(), 3, "three connect links, no duplicates");
    // Bottom line.
    const text = (await f.textContent()).replace(/\s+/g, " ");
    assert.match(text, /© 2026 VIVIFY Solutions\./);
    assert.match(text, /Founded by Viviene Pitogo · Privacy/);
    assert.equal(await f.getByRole("link", { name: "Privacy" }).getAttribute("href"), "/privacy");
    await page.context().close();
  });
}

test("footer: removed items stay removed (decorative lettering, VIVI disclaimer, systems catalog, old wording)", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const f = await footerOf(page);
  const text = await f.textContent();
  assert.doesNotMatch(
    text,
    /brand character|fictional sample|simulations|Founder-led by|OnlineJobs/,
  );
  assert.equal(await f.locator("svg text").count(), 0, "no oversized decorative VIVIFY lettering");
  assert.equal(
    await f
      .getByRole("link", { name: /Functional Business Websites|All-in-One Inbox|AI Receptionist/ })
      .count(),
    0,
  );
  assert.equal(await f.getByRole("link", { name: "All systems" }).count(), 0);
  await page.context().close();
});

test("footer: every link works, and keyboard focus is visible and ordered", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const f = await footerOf(page);
  const hrefs = await f
    .getByRole("link")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  assert.deepEqual(hrefs, [
    "/",
    "/solutions",
    "/systems",
    "/demos",
    "/work",
    "/about",
    MAILTO,
    CALENDLY,
    LINKEDIN,
    "/privacy",
  ]);
  for (const path of ["/solutions", "/systems", "/demos", "/work", "/about", "/privacy"]) {
    const res = await page.request.get(env.base + path);
    assert.equal(res.status(), 200, path);
  }
  // Tab through the footer: each link shows a visible focus ring.
  await f.getByRole("navigation", { name: "Explore" }).getByRole("link").first().focus();
  for (let i = 0; i < 4; i++) {
    const ok = await page.evaluate(() => {
      const e = document.activeElement;
      const cs = getComputedStyle(e);
      return cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2;
    });
    assert.ok(ok, "a visible focus outline on the focused footer link");
    await page.keyboard.press("Tab");
  }
  await page.context().close();
});

test("footer: tap targets are at least 44px high on touch screens, and text stays readable", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  const f = await footerOf(page);
  const small = await f
    .getByRole("link")
    .evaluateAll((els) =>
      els
        .map((e) => [e.textContent.trim(), e.getBoundingClientRect().height])
        .filter(([, h]) => h < 43),
    );
  assert.deepEqual(small, [], `links under 44px: ${JSON.stringify(small)}`);
  const fonts = await f
    .locator("p, a")
    .evaluateAll((els) => Math.min(...els.map((e) => parseFloat(getComputedStyle(e).fontSize))));
  assert.ok(fonts >= 14, `smallest footer text is ${fonts}px`);
  await page.context().close();
});

for (const key of ["390", "1440"]) {
  test(`axe finds no serious or critical issue in the footer (${key})`, async () => {
    const page = await newPage(env.browser, VIEWPORTS[key], { touch: key === "390" });
    await page.goto(env.base + "/work");
    await page.waitForTimeout(600);
    await page.evaluate(() =>
      document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")),
    );
    await page.waitForTimeout(1500);
    assert.deepEqual(await seriousViolations(page), []);
    await page.context().close();
  });
}

test("copy: founder wording, sample-scenario labels and the concise disclosures", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const body = (await page.locator("body").textContent()).replace(/\s+/g, " ");
  assert.match(body, /Founder — Viviene Pitogo/, "compact founder label in the hero");
  assert.equal(
    (body.match(/Founded by Viviene Pitogo/g) ?? []).length,
    1,
    "'Founded by' appears once on the page",
  );
  assert.doesNotMatch(body, /Founder-led by/);
  assert.match(await page.locator("#proof").textContent(), /Sample call scenario\./);
  assert.doesNotMatch(
    await page.locator("#proof").textContent(),
    /Illustrated example|written for this page|\(screenshot\)/,
  );
  assert.match(await page.locator("#proof").textContent(), /The workflow as built in n8n\./);
  const quiz = (await page.locator("#readiness").textContent()).replace(/\s+/g, " ");
  assert.match(
    quiz,
    /Explore a starting point for your business\. Your answers stay in your browser\./,
  );
  assert.doesNotMatch(quiz, /Indicative only|business diagnosis|never sent anywhere|contact form/);
  assert.match(body, /Tools used across selected projects\./);
  assert.doesNotMatch(body, /Listing a tool doesn't imply/);
  assert.match(body, /Sample scenario\./);
  assert.doesNotMatch(
    body,
    /Illustrative example, not real customer data|Simulated demo with a fictional/,
  );
  await page.context().close();
});

test("copy: the readiness note matches the form being active (it mentions the form only then)", async () => {
  const page = await newPage(formActive.browser, VIEWPORTS["1440"]);
  await page.goto(formActive.base + "/");
  const quiz = (await page.locator("#readiness").textContent()).replace(/\s+/g, " ");
  assert.match(
    quiz,
    /Your answers stay in your browser\. A short summary can be added to the contact form if you choose to talk it through\./,
  );
  await page.context().close();
});

test("copy: the Demos page has one concise disclosure, and each demo is labelled a sample scenario", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/demos");
  const text = (await page.locator("main").textContent()).replace(/\s+/g, " ");
  assert.equal(
    (text.match(/Interactive demonstrations using sample scenarios\./g) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    text,
    /Harbor Plumbing\. Nothing here is real customer data|fictional sample business/,
  );
  assert.ok((text.match(/Sample scenario/g) ?? []).length >= 2, "the demo carries its own label");
  await page.context().close();
});

test("copy: no editing artifacts, internal notes or stray fragments on any public page", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const routes = [
    ...sitemap.matchAll(/<loc>https:\/\/www\.vivify\.solutions(\/[^<]*)<\/loc>/g),
  ].map((m) => m[1]);
  assert.ok(routes.length >= 20);
  const bad = [];
  for (const r of routes) {
    await page.goto(env.base + r);
    const t = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    for (const [re, why] of [
      [/\(screenshot\)/i, "(screenshot)"],
      [/TODO|TBD|lorem|placeholder|FIXME/i, "placeholder"],
      [/Founder-led by/, "old founder wording"],
      [/VIVIFY Automation/, "old brand"],
      [/[a-z]\.[A-Z][a-z]/, "sentence without a space"],
      [/ {2,}|\s,|\(\s*\)/, "stray spacing or empty brackets"],
    ]) {
      const m = t.match(re);
      if (m) bad.push(`${r}: ${why}: ...${t.slice(Math.max(0, m.index - 25), m.index + 35)}...`);
    }
  }
  assert.deepEqual(
    bad.filter((b) => !/\.js|\.mp4|n8n\.io|\.com\b|\.ph\b|\.png|\.webp|\.svg|e\.g\./i.test(b)),
    [],
    bad.join("\n"),
  );
  await page.context().close();
});
