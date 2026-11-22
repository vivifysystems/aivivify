// The Winged V logo in the header, footer and head, rendered by a real browser.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const MARK = 'img[src="/brand/vivify-mark.svg"]';

/** Draws the mark into a canvas and counts cyan-ish and purple-ish opaque pixels. */
const paint = (page, selector) =>
  page.evaluate(async (sel) => {
    const img = document.querySelector(sel);
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 120;
    c.height = 142;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let cyan = 0,
      purple = 0,
      opaque = 0;
    for (let i = 0; i < d.length; i += 4) {
      const [r, gr, b, a] = [d[i], d[i + 1], d[i + 2], d[i + 3]];
      if (a > 200) opaque++;
      if (a > 200 && r < 90 && gr > 150 && b > 200) cyan++;
      if (a > 200 && r > 100 && gr < 110 && b > 200) purple++;
    }
    return { cyan, purple, opaque, natural: [img.naturalWidth, img.naturalHeight] };
  }, selector);

for (const [key, touch] of [
  ["1440", false],
  ["390", true],
  ["320", true],
]) {
  for (const route of ["/", "/about", "/contact"]) {
    test(`header and footer show the Winged V on ${route} (${key})`, async () => {
      const page = await newPage(env.browser, VIEWPORTS[key], { touch });
      await page.goto(env.base + route);
      const header = page.locator(`header ${MARK}`);
      await header.first().waitFor();
      assert.equal(await header.count(), 1, "one mark in the header");
      const box = await header.first().boundingBox();
      assert.ok(
        Math.abs(box.height - 36) <= 1 && Math.abs(box.width - 30) <= 1.5,
        `header mark ${box.width}x${box.height}`,
      );
      const p = await paint(page, `header ${MARK}`);
      assert.ok(p.natural[0] > 0 && p.natural[1] > 0, "the SVG did not load");
      assert.ok(p.cyan > 200 && p.purple > 200, `mark colours missing: ${JSON.stringify(p)}`);
      assert.ok(p.opaque > 3000 && p.opaque < 11000, `unexpected coverage ${p.opaque}`);
      // Typography is unchanged next to it.
      assert.match(
        await page.locator("header a[href='/']").first().textContent(),
        /VIVIFY\s*SOLUTIONS/,
      );
      const foot = page.locator(`footer ${MARK}`);
      await foot.first().scrollIntoViewIfNeeded();
      assert.equal(await foot.count(), 1, "one mark in the footer");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(overflow <= 0, `horizontal overflow ${overflow}px`);
      await page.context().close();
    });
  }
}

test("the mark is still visible after the mobile menu opens", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  await page
    .getByRole("button", { name: /open.*menu|menu/i })
    .first()
    .click();
  await page.waitForTimeout(400);
  assert.ok((await page.locator(MARK).count()) >= 1);
  assert.ok(await page.locator(`header ${MARK}`).first().isVisible());
  await page.context().close();
});

test("favicon, touch icon, social image and structured-data logo are served", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']")].map((l) => [
      l.rel,
      l.getAttribute("href"),
      l.type,
    ]),
  );
  assert.deepEqual(links.map((l) => l[1]).sort(), [
    "/apple-touch-icon.png",
    "/favicon.ico",
    "/favicon.svg",
  ]);
  for (const href of [
    "/favicon.svg",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/og/vivify-og.png",
    "/brand/vivify-mark-512.png",
    "/brand/vivify-mark.svg",
  ]) {
    const r = await page.request.get(env.base + href);
    assert.equal(r.status(), 200, href);
  }
  const old = await page.request.get(env.base + "/assets/vivi/avatars/vivify-v-mark.webp");
  assert.ok(
    !(old.headers()["content-type"] ?? "").includes("image/webp"),
    "the old mark is still served",
  );
  const ld = await page.evaluate(() =>
    JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),
  );
  assert.equal(ld.logo, "https://www.vivify.solutions/brand/vivify-mark-512.png");
  await page.context().close();
});
