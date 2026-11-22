// Every email link opens the visitor's email app addressed to the one public address, and Calendly is untouched.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const MAILTO = "mailto:viviene@vivify.solutions";
const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

for (const key of ["1440", "390"]) {
  test(`contact page: "Email me", the address card and the footer are plain mailto links, Calendly unchanged (${key})`, async () => {
    const page = await newPage(env.browser, VIEWPORTS[key], { touch: key === "390" });
    await page.goto(env.base + "/contact");
    const hero = page.locator("section").first();
    const emailMe = hero.getByRole("link", { name: /^Email me/ });
    assert.equal(await emailMe.count(), 1, "one Email me button in the hero");
    assert.equal(await emailMe.getAttribute("href"), MAILTO);
    assert.equal(await emailMe.getAttribute("target"), null, "mailto must not open a new tab");
    // The address card and the footer link.
    const cards = page.locator(`main a[href="${MAILTO}"]`);
    assert.ok((await cards.count()) >= 2, "Email me plus the 'Email directly' card");
    assert.ok(
      (await page.locator(`footer a[href="${MAILTO}"]`).count()) >= 1,
      "footer address link",
    );
    // Every mailto on the page goes to the public address (the prefilled composer link only appears after a failed send).
    const all = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("href").split("?")[0]));
    for (const h of all) assert.equal(h, MAILTO);
    // Calendly is preserved, opens in a new tab and keeps its label.
    const book = hero.getByRole("link", { name: /Book a free 30-minute call/ });
    assert.equal(await book.getAttribute("href"), CALENDLY);
    assert.equal(await book.getAttribute("target"), "_blank");
    // Clicking Email me stays on the page (the browser hands the link to the email app).
    await page.evaluate(() =>
      document.addEventListener(
        "click",
        (e) => {
          const a = e.target.closest("a");
          if (a?.href.startsWith("mailto:")) e.preventDefault();
        },
        true,
      ),
    );
    await emailMe.click();
    assert.ok(page.url().endsWith("/contact"));
    await page.context().close();
  });
}

test("privacy page and footer on other pages use the same mailto", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  for (const route of ["/", "/privacy", "/about"]) {
    await page.goto(env.base + route);
    const all = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    assert.ok(all.length >= 1, `${route} has an email link`);
    for (const h of all) assert.equal(h, MAILTO, route);
  }
  await page.context().close();
});
