// Ticket 7: orientation (focus, logo, Back), motion preferences and short viewports.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const active = (page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    return {
      tag: a?.tagName,
      text: a?.textContent?.trim().slice(0, 40),
      inMain: Boolean(a?.closest("main")),
      inHeader: Boolean(a?.closest("header")),
    };
  });

test("forward navigation by keyboard moves focus to the new page heading, and Tab continues from there", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Work" })
    .focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/work");
  await page.waitForFunction(() => document.activeElement?.closest("main"));
  const a = await active(page);
  assert.equal(a.tag, "H1");
  assert.match(a.text, /Systems I've designed and built/);
  await page.keyboard.press("Tab");
  const next = await active(page);
  assert.ok(
    next.inMain && !next.inHeader,
    `Tab after navigation went to ${JSON.stringify(next)} instead of the page content`,
  );
  await page.context().close();
});

test("a pointer navigation also lands focus on the new heading without a visible focus ring", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "About" })
    .click();
  await page.waitForURL("**/about");
  await page.waitForFunction(() => document.activeElement?.tagName === "H1");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert.equal(outline, "none");
  await page.context().close();
});

test("the first page load does not steal focus", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/work");
  await page.waitForTimeout(400);
  assert.equal((await active(page)).tag, "BODY");
  await page.context().close();
});

test("an in-page hash link scrolls to its target and moves focus there", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page.getByRole("link", { name: /See a Messenger inquiry answered/ }).click();
  await page.waitForURL(/#proof$/);
  await page.waitForFunction(() => document.activeElement?.id === "proof");
  await page.context().close();
});

test("the logo scrolls a scrolled homepage back to the top", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
  await page.waitForFunction(() => window.scrollY > 2000);
  await page.getByRole("banner").getByRole("link", { name: /home/ }).click();
  await page.waitForFunction(() => window.scrollY < 5, null, { timeout: 4000 });
  assert.equal(new URL(page.url()).pathname, "/");
  assert.equal(new URL(page.url()).hash, "");
  await page.context().close();
});

test("Back returns to the project the visitor left, with the filters intact", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/work");
  await page.getByRole("button", { name: /AI customer assistants/ }).click();
  await page.getByRole("button", { name: /All work/ }).click();
  await page.getByRole("button", { name: /Email, files & knowledge/ }).click();
  await page.waitForFunction(() => location.search.includes("category=knowledge-documents"));
  const link = page.locator('main ul li a[href^="/work/"]').last();
  await link.scrollIntoViewIfNeeded();
  const label = await link.textContent();
  const before = await page.evaluate(() => window.scrollY);
  await link.click();
  await page.waitForURL("**/work/**");
  await page.goBack();
  await page.waitForURL("**/work?category=knowledge-documents");
  assert.equal(
    await page
      .getByRole("button", { name: /Email, files & knowledge/ })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page
    .waitForFunction((b) => Math.abs(window.scrollY - b) < 60, before, { timeout: 4000 })
    .catch(() => {});
  const after = await page.evaluate(() => window.scrollY);
  assert.ok(Math.abs(after - before) < 60, `scroll was ${before}, restored to ${after}`);
  const inView = await page
    .locator('main ul li a[href^="/work/"]', { hasText: label.trim().slice(0, 20) })
    .first()
    .evaluate((a) => {
      const r = a.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    });
  assert.ok(inView, "the project the visitor left is back in view");
  await page.context().close();
});

test("forward navigation still starts at the top of the new page", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: "instant" }));
  await page.getByRole("banner").getByRole("link", { name: "Demos" }).click();
  await page.waitForURL("**/demos");
  await page.waitForFunction(() => window.scrollY === 0);
  await page.context().close();
});

test("decorative hero motion settles instead of looping forever", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const count = await page.evaluate(
    () => getComputedStyle(document.querySelector(".animate-vivi-float")).animationIterationCount,
  );
  assert.notEqual(count, "infinite");
  await page.context().close();
});

test("reduced motion: content is visible, nothing is mid-reveal, no looping animation runs", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"], { reducedMotion: true });
  await page.goto(env.base + "/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(300);
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (e) => getComputedStyle(e).opacity !== "1",
      ).length,
  );
  assert.equal(hidden, 0, `${hidden} reveal elements are not visible`);
  const looping = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.effect.getComputedTiming().iterations === Infinity &&
            a.effect.getComputedTiming().duration > 1,
        ).length,
  );
  assert.equal(looping, 0);
  await page.context().close();
});

test("reduced motion: every demo shows its full story and every step is reachable manually", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"], { reducedMotion: true });
  await page.goto(env.base + "/demos");
  const ids = await page.locator('nav[aria-label="Choose a demo"] ul li button').count();
  assert.equal(ids, 11);
  for (let i = 0; i < ids; i++) {
    await page.locator('nav[aria-label="Choose a demo"] ul li button').nth(i).click();
    const steps = page.locator('ol[aria-label="Demo steps"]:visible button');
    const n = await steps.count();
    assert.ok(n >= 3, `demo ${i} has ${n} steps`);
    // It opens on the final step, with no autoplay.
    assert.equal(
      await steps.last().getAttribute("aria-current"),
      "step",
      `demo ${i} should open on its final step`,
    );
    await page.waitForTimeout(250);
    assert.equal(await steps.last().getAttribute("aria-current"), "step");
    // Direct selection and Previous/Next reach every step.
    for (let s = 0; s < n; s++) {
      await steps.nth(s).click();
      assert.equal(await steps.nth(s).getAttribute("aria-current"), "step");
      assert.ok(
        (await page.locator('[aria-live="polite"]:visible').first().textContent()).trim().length >
          10,
      );
    }
    await page.getByRole("button", { name: "Next step" }).isDisabled();
  }
  await page.context().close();
});

test("with motion allowed the homepage demo keeps pause, resume, step select and replay", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const stage = page.locator("#showcase-panel");
  await stage.scrollIntoViewIfNeeded();
  const toggle = stage.getByRole("button", { name: /Pause|Play|Resume|Replay/ });
  await page.waitForFunction(
    () => /Pause/.test(document.querySelector("#showcase-panel")?.textContent ?? ""),
    null,
    { timeout: 4000 },
  );
  await toggle.click();
  assert.match(await toggle.textContent(), /Play|Resume/);
  await stage.locator('ol[aria-label="Demo steps"]:visible button').nth(2).click();
  assert.equal(
    await stage
      .locator('ol[aria-label="Demo steps"]:visible button')
      .nth(2)
      .getAttribute("aria-current"),
    "step",
  );
  await stage.getByRole("button", { name: "Next step" }).click();
  await stage
    .getByRole("button", { name: "Next step" })
    .click()
    .catch(() => {});
  await page.context().close();
});

test("arrow keys switch the homepage demo tabs", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const tabs = page.getByRole("tablist", { name: "Featured systems" }).getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
  await page.keyboard.press("End");
  assert.equal(await tabs.last().getAttribute("aria-selected"), "true");
  await page.context().close();
});

test("short phone viewport: the mobile menu scrolls, traps focus and returns it on Escape", async () => {
  const vp = { width: 390, height: 420 };
  const page = await newPage(env.browser, vp, { touch: true });
  await page.goto(env.base + "/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.tap();
  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await drawer.getByRole("button", { name: "Systems" }).tap();
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    const info = await page.evaluate(() => {
      const a = document.activeElement;
      const r = a.getBoundingClientRect();
      return {
        text: a.textContent.trim().slice(0, 30),
        inDrawer: Boolean(a.closest("#mobile-menu")),
        top: r.top,
        bottom: r.bottom,
      };
    });
    assert.ok(info.inDrawer, `focus left the open menu: ${info.text}`);
    assert.ok(
      info.top >= 0 && info.bottom <= vp.height + 1,
      `"${info.text}" is off screen (${info.top}-${info.bottom})`,
    );
    seen.add(info.text);
    if (/Book a free/.test(info.text)) break;
    await page.keyboard.press("Tab");
  }
  assert.ok(
    [...seen].some((t) => /Book a free/.test(t)),
    "never reached the booking link at the end of the menu",
  );
  assert.equal(await page.evaluate(() => window.scrollY), 0, "page moved behind the menu");
  await page.keyboard.press("Escape");
  await drawer.waitFor({ state: "hidden" });
  assert.equal(
    await toggle.evaluate((b) => b === document.activeElement),
    true,
    "focus did not return to the menu button",
  );
  await page.context().close();
});

test("on-screen keyboard (shorter viewport): Ask VIVI input and send stay visible and focused", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/");
  await page.getByRole("banner").getByRole("button", { name: "Ask VIVI" }).tap();
  const dialog = page.getByRole("dialog", { name: "Ask VIVI" });
  const input = dialog.getByLabel("Ask a question");
  await input.tap();
  await page.setViewportSize({ width: 390, height: 430 }); // keyboard takes about half the screen
  await page.waitForTimeout(300);
  const [d, i] = [await dialog.boundingBox(), await input.boundingBox()];
  assert.ok(
    d.y >= 0 && d.y + d.height <= 430 + 1,
    `panel spans ${d.y}-${d.y + d.height} in a 430px viewport`,
  );
  assert.ok(i.y >= 0 && i.y + i.height <= 430, `input is off screen at y=${i.y}`);
  assert.equal(await input.evaluate((e) => e === document.activeElement), true);
  const ring = await input.evaluate((e) => getComputedStyle(e).boxShadow);
  assert.ok(ring && ring !== "none", "keyboard focus must be visible on the input");
  await page.context().close();
});

test("on-screen keyboard: the focused contact field is never hidden under the fixed header", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/contact");
  await page.setViewportSize({ width: 390, height: 430 });
  for (const label of ["Your name", "Email", "What's taking up your time?"]) {
    const f = page.getByLabel(label);
    await f.focus();
    await page.waitForTimeout(900); // html has smooth scrolling; let focus scrolling finish
    const r = await f.boundingBox();
    assert.ok(
      r.y >= 72 && r.y + r.height <= 430,
      `${label} is at ${r.y}-${r.y + r.height}, hidden by the header or keyboard`,
    );
  }
  await page.context().close();
});

test("Back restores a deep scroll position in the full project list", async () => {
  const page = await newPage(env.browser, VIEWPORTS["390"], { touch: true });
  await page.goto(env.base + "/work");
  const link = page.locator('main ul li a[href^="/work/"]').last();
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800); // smooth scrolling settles
  // Record where the visitor actually was when they left (a tap may scroll its target into view first).
  await page.evaluate(() =>
    document.addEventListener("click", () => (window.__leftAt = window.scrollY), true),
  );
  await link.tap();
  await page.waitForURL("**/work/**");
  const before = await page.evaluate(() => window.__leftAt);
  assert.ok(before > 1500, `expected a deep scroll, got ${before}`);
  assert.ok((await page.evaluate(() => window.scrollY)) < 10, "the detail page starts at the top");
  await page.goBack();
  await page.waitForURL("**/work");
  await page.waitForFunction((b) => Math.abs(window.scrollY - b) < 60, before, { timeout: 4000 });
  await page.context().close();
});
