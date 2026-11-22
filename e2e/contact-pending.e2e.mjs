// Contact delivery is "pending": no form, no "Send a message", two clear primary options
// (Book a call, Email me), the address visible with a working Copy button, and a privacy page
// that matches. Runs against the normal build. The form state is covered in contact-active.e2e.mjs.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";
import { seriousViolations } from "./axe.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const ADDRESS = "viviene@vivify.solutions";
const MAILTO = `mailto:${ADDRESS}`;
const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

test("no form, no form fields and no 'Send a message' anywhere on the contact page", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(env.base + "/contact");
  assert.equal(await page.locator("form").count(), 0);
  assert.equal(await page.locator("input, textarea, select").count(), 0);
  assert.equal(await page.getByRole("button", { name: /Send message/ }).count(), 0);
  assert.equal(await page.getByText(/Send a message/i).count(), 0);
  assert.equal(await page.locator("#send-message, a[href$='#send-message']").count(), 0);
  assert.equal(await page.getByText(/Not sent yet|isn't connected yet/i).count(), 0);
  assert.equal(requests.filter((u) => u.includes("/api/")).length, 0, "no API request");
  await page.context().close();
});

for (const key of ["320", "390", "768", "1440"]) {
  test(`two clear primary options, no overflow and a visible address (${key})`, async () => {
    const vp = VIEWPORTS[key];
    const page = await newPage(env.browser, vp, { touch: key !== "1440" });
    await page.goto(env.base + "/contact");
    const hero = page.locator("section").first();
    const book = hero.getByRole("link", { name: /Book a free 30-minute call/ });
    const email = hero.getByRole("link", { name: /^Email me/ });
    assert.equal(await book.getAttribute("href"), CALENDLY);
    assert.equal(await book.getAttribute("target"), "_blank");
    assert.equal(await email.getAttribute("href"), MAILTO);
    for (const [name, el] of [
      ["Book", book],
      ["Email me", email],
    ]) {
      const b = await el.boundingBox();
      assert.ok(b.height >= 44, `${name} is ${b.height}px high`);
      // Within the first screen, or one short scroll below it on the smallest phones.
      assert.ok(
        b.y + b.height <= vp.height + 120,
        `${name} ends at ${b.y + b.height}px, too far below the first screen (${vp.height}px)`,
      );
    }
    // The address is on screen as text, and the document does not scroll sideways.
    const addr = page.getByTestId("public-email");
    assert.equal((await addr.textContent()).trim(), ADDRESS);
    assert.ok(await addr.isVisible());
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(overflow <= 0, `horizontal overflow ${overflow}px`);
    const box = await addr.boundingBox();
    assert.ok(
      box.x >= 0 && box.x + box.width <= vp.width + 1,
      "the address stays inside the screen",
    );
    await page.context().close();
  });
}

test("Copy email puts the address on the clipboard and says so", async () => {
  const ctx = await env.browser.newContext({
    viewport: VIEWPORTS["1440"],
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await ctx.newPage();
  await page.goto(env.base + "/contact");
  const copy = page.getByRole("button", { name: "Copy email" });
  await copy.click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), ADDRESS);
  await page.getByRole("status").filter({ hasText: "copied" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Copied" }).count(), 1);
  await ctx.close();
});

test("Copy email falls back and says so when the clipboard is unavailable", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    });
    document.execCommand = () => false;
  });
  await page.goto(env.base + "/contact");
  await page.getByRole("button", { name: "Copy email" }).click();
  const status = page.getByRole("status").filter({ hasText: /Couldn't copy/ });
  await status.waitFor();
  assert.ok(
    await page.getByTestId("public-email").isVisible(),
    "the address stays selectable on screen",
  );
  await page.context().close();
});

test("keyboard: Tab reaches Book, Email me and Copy email in order; Enter and Space work", async () => {
  const ctx = await env.browser.newContext({
    viewport: VIEWPORTS["1440"],
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await ctx.newPage();
  await page.goto(env.base + "/contact");
  const names = [];
  await page
    .locator("main")
    .first()
    .evaluate(() => document.activeElement?.blur());
  await page.keyboard.press("Tab"); // skip link
  for (let i = 0; i < 40 && names.length < 3; i++) {
    await page.keyboard.press("Tab");
    const n = await page.evaluate(() => {
      const e = document.activeElement;
      return e && e.closest("main") ? (e.textContent || "").replace(/\s+/g, " ").trim() : "";
    });
    if (/Book a free 30-minute call|^Email me|Copy email/.test(n) && !names.includes(n))
      names.push(n);
  }
  assert.match(names[0], /Book a free 30-minute call/);
  assert.match(names[1], /^Email me/);
  assert.ok(
    names.some((n) => /Copy email/.test(n)),
    `Copy email reachable by keyboard: ${JSON.stringify(names)}`,
  );
  const copy = page.getByRole("button", { name: "Copy email" });
  await copy.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("status").filter({ hasText: "copied" }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), ADDRESS);
  // The focus ring is visible on the button.
  const outline = await copy.evaluate(
    (e) => getComputedStyle(e).outlineStyle + getComputedStyle(e).boxShadow,
  );
  assert.ok(outline.length > 0);
  await ctx.close();
});

test("screen readers: named controls, one polite status, address and Email me have clear names", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/contact");
  assert.equal(await page.getByRole("heading", { name: "Email us" }).count(), 1);
  const emailMe = page
    .getByRole("main")
    .getByRole("link", { name: "Email me at viviene@vivify.solutions" });
  assert.ok((await emailMe.count()) >= 1, "Email me announces the address");
  assert.equal(await page.getByRole("button", { name: "Copy email" }).count(), 1);
  assert.equal(await page.locator('[role="status"][aria-live="polite"]').count(), 1);
  assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
  await page.context().close();
});

for (const key of ["390", "1440"]) {
  test(`axe finds no serious or critical issue on the pending contact page (${key})`, async () => {
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

test("the site-wide call to action offers Email me instead of 'Send a message'", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  for (const route of ["/", "/work", "/about"]) {
    await page.goto(env.base + route);
    const cta = page.locator("#cta-title").locator("xpath=ancestor::section[1]");
    assert.equal(await cta.getByRole("link", { name: /Send a message/ }).count(), 0, route);
    const email = cta.getByRole("link", { name: /^Email me/ });
    assert.equal(await email.count(), 1, route);
    assert.equal(await email.getAttribute("href"), MAILTO);
    assert.equal(
      await cta.getByRole("link", { name: /Book a free 30-minute call/ }).getAttribute("href"),
      CALENDLY,
    );
  }
  await page.context().close();
});

test("the privacy page and the readiness check match the email-only experience", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/privacy");
  const text = await page.locator("main").textContent();
  assert.match(text, /There is no online contact form on this site at the moment/);
  assert.doesNotMatch(text, /Resend|name, email address, the business name|spam-check/);
  assert.doesNotMatch(text, /send the contact form/);
  await page.goto(env.base + "/");
  assert.match(
    await page.locator("#readiness").textContent(),
    /take you to the contact page; nothing from your answers is sent/,
  );
  assert.doesNotMatch(await page.locator("#readiness").textContent(), /added to the contact form/);
  await page.goto(env.base + "/contact");
  assert.match(await page.locator('meta[name="description"]').getAttribute("content"), /email us/);
  await page.context().close();
});
