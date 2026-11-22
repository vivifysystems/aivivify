// Ticket 6: small-screen journeys reflow and stay discoverable.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, docOverflow, VIEWPORTS } from "./helpers.mjs";
import { setup, setupActive } from "./setup.mjs";

let env, active;
before(async () => {
  env = await setup();
  active = await setupActive();
});
after(async () => {
  await env.teardown();
  await active.teardown();
});

const PAGES = [
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

for (const key of ["320", "375", "390", "768"]) {
  test(`no page overflows horizontally at ${key}`, async () => {
    const page = await newPage(env.browser, VIEWPORTS[key], { touch: key !== "768" });
    for (const path of PAGES) {
      await page.goto(env.base + path);
      await page.waitForTimeout(250);
      const o = await docOverflow(page);
      assert.ok(
        o.scrollWidth <= o.clientWidth,
        `${path}: document is ${o.scrollWidth}px wide in a ${o.clientWidth}px viewport`,
      );
    }
    await page.context().close();
  });
}

test("the Connect pilot badge wraps inside its card at 320", async () => {
  const page = await newPage(env.browser, VIEWPORTS["320"], { touch: true });
  await page.goto(env.base + "/solutions");
  const card = page.locator("article", { hasText: "VIVIFY Connect" }).first();
  await card.scrollIntoViewIfNeeded();
  const badge = card.locator("span", { hasText: /^\s*Pilot/ }).first();
  const [c, b] = [await card.boundingBox(), await badge.boundingBox()];
  assert.ok(
    b.x >= c.x && b.x + b.width <= c.x + c.width + 0.5,
    `badge spans ${b.x}-${b.x + b.width}, card ${c.x}-${c.x + c.width}`,
  );
  assert.ok(b.x + b.width <= 320, `badge ends at x=${b.x + b.width}, beyond the 320px screen`);
  assert.match(
    await badge.textContent(),
    /Pilot · availability-dependent/,
    "the whole status is readable",
  );
  await page.context().close();
});

test("the mobile Systems drawer carries the task groups and pilot status", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  await page.getByRole("button", { name: "Open menu" }).tap();
  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await drawer.getByRole("button", { name: "Systems" }).tap();
  const text = await drawer.textContent();
  for (const g of ["Get found", "Capture & respond", "Follow up & book", "Run & improve"])
    assert.match(text, new RegExp(g), `missing group ${g}`);
  const receptionist = drawer.getByRole("link", { name: /AI Receptionist/ });
  assert.match(await receptionist.textContent(), /Pilot/);
  const printing = drawer.getByRole("link", { name: /Printing/ });
  assert.match(await printing.textContent(), /Optional/);
  assert.equal(await drawer.getByRole("link", { name: /All systems/ }).count(), 1);
  await page.context().close();
});

for (const key of ["320", "390"]) {
  test(`the demo gallery offers a labelled picker for all 11 demos at ${key}`, async () => {
    const page = await newPage(env.browser, VIEWPORTS[key], { touch: true });
    await page.goto(env.base + "/demos");
    const picker = page.getByRole("combobox", { name: /Choose a demo/ });
    assert.equal(await picker.locator("option").count(), 11);
    assert.ok(await picker.isVisible());
    await picker.selectOption({ index: 5 });
    const label = await picker.locator("option:checked").textContent();
    await page.waitForFunction(
      (l) => document.querySelector("h2.type-h3")?.textContent.trim() === l.trim(),
      label,
    );
    assert.match(page.url(), /#[a-z-]+$/);
    // The horizontal chips remain for browsing.
    assert.ok((await page.locator('nav[aria-label="Choose a demo"] ul li').count()) === 11);
    await page.context().close();
  });
}

test("Ask VIVI exposes all six topics without sideways scrolling at 390", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  const dialog = page.getByRole("dialog", { name: "Ask VIVI" });
  await dialog.waitFor();
  const more = dialog.getByRole("button", { name: /(More|Fewer) topics/ });
  if (await more.count()) {
    assert.equal(await more.getAttribute("aria-expanded"), "false");
    await more.tap();
    assert.equal(await more.getAttribute("aria-expanded"), "true");
  }
  const topics = [
    "What can VIVIFY build?",
    "Which package fits me?",
    "How does pricing work?",
    "Show me a demo",
    "Who's behind VIVIFY?",
    "Talk to Viviene",
  ];
  const box = await dialog.boundingBox();
  for (const t of topics) {
    const b = await dialog.getByRole("button", { name: t }).boundingBox();
    assert.ok(
      b && b.x >= 0 && b.x + b.width <= 390 && b.y >= box.y && b.y + b.height <= box.y + box.height,
      `${t} is not fully visible: ${JSON.stringify(b)}`,
    );
  }
  await page.context().close();
});

for (const key of ["320", "390"]) {
  test(`Contact shows booking and messaging options before the form (form active) at ${key}`, async () => {
    const vp = VIEWPORTS[key];
    const page = await newPage(active.browser, vp, { touch: true });
    await page.goto(active.base + "/contact");
    const book = page
      .getByRole("main")
      .getByRole("link", { name: /Book a free 30-minute call/ })
      .first();
    const jump = page.getByRole("link", { name: /Send a message/ }).first();
    const name = page.getByLabel("Your name");
    const [bb, jb, nb] = [
      await book.boundingBox(),
      await jump.boundingBox(),
      await name.boundingBox(),
    ];
    assert.ok(
      bb.y < nb.y && jb.y < nb.y,
      `options (${bb.y}, ${jb.y}) must precede the form fields (${nb.y})`,
    );
    assert.ok(
      Math.max(bb.y + bb.height, jb.y + jb.height) <= vp.height + 120,
      `options end at ${Math.max(bb.y + bb.height, jb.y + jb.height)}px, too far down for ${vp.height}px`,
    );
    await jump.tap();
    await page.waitForURL(/#send-message$/);
    await page.waitForTimeout(300);
    const top = await name.evaluate((n) => n.getBoundingClientRect().top);
    assert.ok(top > 0 && top < vp.height, "the jump brings the form into view");
    await page.context().close();
  });
}

test("the homepage demo stage describes both the desktop and the stacked layouts", async () => {
  const page = await newPage(active.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(active.base + "/");
  const lede = await page
    .locator("section", { hasText: "See what happens behind the scenes" })
    .first()
    .textContent();
  assert.match(lede, /What the customer sees and what your team receives/);
  assert.doesNotMatch(lede, /on the left|on the right/);
  await page.context().close();
});
