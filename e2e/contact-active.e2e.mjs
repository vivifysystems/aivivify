// Contact delivery is "active" (built with `npm run build:contact-active`): the complete form
// returns with its validation, the "Send a message" jump, the address card and the Resend disclosure.
// The delivery paths themselves are covered in contact-delivery.e2e.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setupActive } from "./setup.mjs";
import { seriousViolations } from "./axe.mjs";

let env;
before(async () => (env = await setupActive()));
after(async () => env.teardown());

const MAILTO = "mailto:viviene@vivify.solutions";
const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

test("the full form is back, and the email-only panel is gone", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/contact");
  assert.equal(await page.locator("form").count(), 1);
  for (const label of ["Your name", "Email", /Business and what/, "What's taking up your time?"])
    assert.equal(await page.getByLabel(label).count(), 1, String(label));
  assert.equal(await page.getByRole("button", { name: /Send message/ }).count(), 1);
  assert.equal(await page.getByTestId("public-email").count(), 0);
  assert.equal(await page.getByRole("button", { name: "Copy email" }).count(), 0);
  // The hero keeps Book and Email me, and gains Send a message.
  const hero = page.locator("section").first();
  assert.equal(
    await hero.getByRole("link", { name: /Book a free 30-minute call/ }).getAttribute("href"),
    CALENDLY,
  );
  assert.equal(await hero.getByRole("link", { name: /^Email me/ }).getAttribute("href"), MAILTO);
  assert.equal(await hero.getByRole("link", { name: /Send a message/ }).count(), 1);
  // The "Email directly" card returns beside the form.
  assert.ok((await page.locator(`aside a[href="${MAILTO}"]`).count()) >= 1);
  await page.context().close();
});

test("validation works: an empty submit shows errors and focuses the first invalid field; nothing is requested", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  const api = [];
  page.on("request", (r) => r.url().includes("/api/") && api.push(r.url()));
  await page.goto(env.base + "/contact");
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.waitForTimeout(300);
  assert.ok((await page.locator('[id$="-error"]').count()) >= 2, "field errors are shown");
  assert.equal(
    await page.evaluate(
      () => document.activeElement?.getAttribute("autocomplete") ?? document.activeElement?.id,
    ),
    await page.getByLabel("Your name").evaluate((e) => e.getAttribute("autocomplete") ?? e.id),
  );
  assert.equal(api.length, 0, "an invalid form is never posted");
  await page.getByLabel("Email").fill("name@");
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.waitForTimeout(200);
  assert.equal(api.length, 0);
  await page.context().close();
});

test("'Send a message' jumps to the form and moves focus there", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/contact");
  await page
    .getByRole("link", { name: /Send a message/ })
    .first()
    .tap();
  await page.waitForURL(/#send-message$/);
  await page.waitForFunction(() => document.activeElement?.id === "send-message");
  await page.context().close();
});

test("the site-wide call to action offers 'Send a message' again", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const cta = page.locator("#cta-title").locator("xpath=ancestor::section[1]");
  assert.equal(await cta.getByRole("link", { name: /Send a message/ }).count(), 1);
  assert.equal(await cta.getByRole("link", { name: /^Email me/ }).count(), 0);
  await page.context().close();
});

test("the privacy page names Resend and the form's data once delivery is active", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/privacy");
  const text = await page.locator("main").textContent();
  assert.match(text, /through Resend/);
  assert.match(text, /name, email address, the business name/);
  assert.doesNotMatch(text, /There is no online contact form/);
  await page.goto(env.base + "/");
  assert.match(await page.locator("#readiness").textContent(), /added to the contact form/);
  await page.context().close();
});

for (const key of ["390", "1440"]) {
  test(`axe finds no serious or critical issue on the active contact page (${key})`, async () => {
    const page = await newPage(env.browser, VIEWPORTS[key], { touch: key === "390" });
    await page.goto(env.base + "/contact");
    await page.waitForTimeout(800);
    await page.evaluate(() =>
      document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")),
    );
    assert.deepEqual(await seriousViolations(page), []);
    await page.context().close();
  });
}
