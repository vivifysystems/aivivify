// Before/after screenshots for the Phase 4 review tickets.
// Usage: BASE_URL=http://localhost:4180 node e2e/tools/capture.mjs before docs/phase4/screenshots
//        node e2e/tools/capture.mjs after docs/phase4/screenshots        (serves ./dist)
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { launch, newPage, startStatic, distDir, VIEWPORTS } from "../helpers.mjs";

const [, , label = "after", outDir = "docs/phase4/screenshots"] = process.argv;
mkdirSync(outDir, { recursive: true });
const server = process.env.BASE_URL ? null : await startStatic(distDir);
const base = process.env.BASE_URL ?? server.url;
const browser = await launch();
const shot = (page, name, opts = {}) =>
  page.screenshot({
    path: join(outDir, `${name}.${label}.jpg`),
    type: "jpeg",
    quality: 78,
    ...opts,
  });

const reveal = (page) =>
  page.evaluate(() =>
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")),
  );
const scrollToHeading = (page, text, offset = 90) =>
  page.evaluate(
    ([t, o]) => {
      const h = [...document.querySelectorAll("h1,h2")].find((x) => x.textContent.includes(t));
      if (h)
        window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - o, behavior: "instant" });
    },
    [text, offset],
  );

async function ctx(key, touch = false, reducedMotion = false) {
  const page = await newPage(browser, VIEWPORTS[key], { touch, reducedMotion });
  await page.addStyleTag({ content: "" }).catch(() => {});
  return page;
}
const open = async (page, path) => {
  await page.goto(base + path);
  await page.waitForTimeout(700);
};

// ── 1. Systems menu on a short laptop
{
  const page = await ctx("1024x640");
  await open(page, "/");
  await page.getByRole("button", { name: "Systems", exact: true }).click();
  await page.waitForTimeout(500);
  await shot(page, "t1-menu-1024x640-open");
  await page.mouse.move(512, 300);
  for (let i = 0; i < 5; i++) await page.mouse.wheel(0, 400);
  await page.waitForTimeout(500);
  await shot(page, "t1-menu-1024x640-after-wheel");
  await page.context().close();
}

// ── 2/4. Ask VIVI: quick succession, and a missed-call question
for (const [key, name] of [
  ["390", "390x844"],
  ["320", "320x568"],
]) {
  const page = await ctx(key, true);
  await open(page, "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  const dialog = page.getByRole("dialog", { name: "Ask VIVI" });
  await dialog.waitFor();
  await dialog.getByRole("button", { name: "What can VIVIFY build?" }).tap();
  await dialog.getByRole("button", { name: "Which package fits me?" }).tap();
  await page.waitForTimeout(1800);
  await shot(page, `t2-ask-two-quick-prompts-${name}`);
  await page.context().close();
}
{
  const page = await ctx("390", true);
  await open(page, "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  const dialog = page.getByRole("dialog", { name: "Ask VIVI" });
  await dialog
    .getByLabel("Ask a question")
    .fill("I miss calls while I am on a job. Can callers get a text?");
  await dialog.getByLabel("Ask a question").press("Enter");
  await page.waitForTimeout(1500);
  await shot(page, "t4-ask-missed-call-390x844");
  await page.context().close();
}

// ── 3. Quiz result and Contact hand-off
{
  const page = await ctx("390", true);
  await open(page, "/");
  const quiz = page.locator("#readiness");
  await quiz.scrollIntoViewIfNeeded();
  for (const l of [
    "Often",
    "Hardly any",
    "We follow up on a set schedule",
    "Online booking already works well",
    "In one CRM everyone uses",
    "Very little",
  ])
    await quiz.getByRole("button", { name: l, exact: true }).tap();
  await page.waitForTimeout(600);
  await reveal(page);
  await quiz.locator("h3").first().scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 380));
  await page.waitForTimeout(500);
  await shot(page, "t3-quiz-result-390x844");
  await page.evaluate(() => window.scrollBy(0, 640));
  await page.waitForTimeout(400);
  await shot(page, "t3-quiz-result-package-390x844");
  await quiz.getByRole("link", { name: /Talk through my result/ }).tap();
  await page.waitForTimeout(900);
  await page.getByLabel("What's taking up your time?").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 260));
  await page.waitForTimeout(500);
  await shot(page, "t3-contact-prefill-390x844");
  await page.context().close();
}

// ── 5. Proof near the hero
for (const [key, name, touch] of [
  ["1440", "1440x900", false],
  ["768", "768x1024", false],
  ["390", "390x844", true],
  ["375", "375x667", true],
  ["320", "320x568", true],
]) {
  const page = await ctx(key, touch);
  await open(page, "/");
  await shot(page, `t5-home-hero-${name}`);
  await reveal(page);
  const has = await page.locator("#proof").count();
  if (has)
    await page.evaluate(() =>
      window.scrollTo({
        top: document.querySelector("#proof").getBoundingClientRect().top + scrollY - 72,
        behavior: "instant",
      }),
    );
  else await scrollToHeading(page, "Real systems, built and documented");
  await page.waitForTimeout(1800);
  await shot(page, `t5-first-built-project-${name}`);
  await page.context().close();
}

// ── 6. Small screens
{
  const page = await ctx("320", true);
  await open(page, "/solutions");
  const card = page.locator("article", { hasText: "VIVIFY Connect" }).first();
  await reveal(page);
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await shot(page, "t6-connect-badge-320x568");
  await page.context().close();
}
{
  const page = await ctx("390", true);
  await open(page, "/");
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page
    .getByRole("dialog", { name: "Site menu" })
    .getByRole("button", { name: "Systems" })
    .tap();
  await page.waitForTimeout(500);
  await shot(page, "t6-mobile-drawer-390x844");
  await page.context().close();
}
for (const [key, name] of [
  ["390", "390x844"],
  ["320", "320x568"],
]) {
  const page = await ctx(key, true);
  await open(page, "/demos");
  await page.evaluate(() =>
    window.scrollTo({
      top:
        document.querySelector('nav[aria-label="Choose a demo"]').getBoundingClientRect().top +
        scrollY -
        90,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(500);
  await shot(page, `t6-demo-gallery-${name}`);
  await page.context().close();
  const p2 = await ctx(key, true);
  await open(p2, "/");
  await p2.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  await p2.waitForTimeout(700);
  await shot(p2, `t6-ask-topics-${name}`);
  await p2.context().close();
  const p3 = await ctx(key, true);
  await open(p3, "/contact");
  await p3.waitForTimeout(900);
  await shot(p3, `t6-contact-top-${name}`);
  await p3.context().close();
}

// ── 7. Motion, short viewport and keyboard
{
  const page = await ctx("390", true, true);
  await open(page, "/demos");
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector("h2.type-h3").getBoundingClientRect().top + scrollY - 90,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(600);
  await shot(page, "t7-reduced-motion-demo-390x844");
  await page.context().close();
}
{
  const page = await ctx("390", true);
  await open(page, "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  await page.getByRole("dialog", { name: "Ask VIVI" }).getByLabel("Ask a question").tap();
  await page.setViewportSize({ width: 390, height: 430 });
  await page.waitForTimeout(600);
  await shot(page, "t7-keyboard-ask-vivi-390x430");
  await page.context().close();
}
{
  const page = await ctx("390", true);
  await open(page, "/");
  await page.setViewportSize({ width: 390, height: 420 });
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page
    .getByRole("dialog", { name: "Site menu" })
    .getByRole("button", { name: "Systems" })
    .tap();
  await page.waitForTimeout(500);
  await shot(page, "t7-short-phone-menu-390x420");
  await page.context().close();
}

await browser.close();
await server?.close();
console.log(`captured (${label}) → ${outDir}`);
