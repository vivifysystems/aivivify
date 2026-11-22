// Ticket 5: proof and a useful next action sit close to the hero.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";
import { hasProofCase } from "../src/content/work.ts";
import { projects } from "../src/content/projects.ts";

// The home proof section is about one project. When that project is not in the launch
// content the section is absent by design, so its tests are skipped and replaced by one
// that checks nothing dangles.
const proofTest = hasProofCase ? test : test.skip;

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const docTop = (page, selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  }, selector);

const headingTop = (page, name) =>
  page.evaluate((n) => {
    const h = [...document.querySelectorAll("h2")].find((x) => x.textContent.includes(n));
    return h ? h.getBoundingClientRect().top + window.scrollY : null;
  }, name);

for (const [key, touch] of [
  ["1440", false],
  ["390", true],
  ["320", true],
]) {
  proofTest(
    `a built project appears right after the hero, far above Featured Work (${key})`,
    async () => {
      const vp = VIEWPORTS[key];
      const page = await newPage(env.browser, vp, { touch });
      await page.goto(env.base + "/");
      const proof = await docTop(page, "#proof");
      const featured = await headingTop(page, "Real systems, built and documented");
      assert.ok(proof !== null, "no #proof section on the homepage");
      assert.ok(proof < 1500, `proof starts at ${proof}px`);
      assert.ok(
        featured > proof + 2000,
        `featured ${featured} should stay well below proof ${proof}`,
      );
      // The review measured Featured Work at 10,038px on a 390px phone. Adding proof must not push it lower.
      if (key === "390")
        assert.ok(
          featured <= 10038,
          `Featured Work starts at ${featured}px, worse than the reviewed 10,038px`,
        );
      // It comes before the catalog, demo stage, quiz and packages.
      for (const title of [
        "See what happens behind the scenes",
        "Where should you automate first",
        "Which package",
      ]) {
        const t = await headingTop(page, title);
        if (t !== null)
          assert.ok(t > proof, `${title} (${t}) should come after the proof section (${proof})`);
      }
      await page.context().close();
    },
  );
}

proofTest(
  "the proof shows the question, the reply, Viviene's role and a plain illustration label",
  async () => {
    const page = await newPage(env.browser, VIEWPORTS["1440"]);
    await page.goto(env.base + "/");
    const proof = page.locator("#proof");
    const text = await proof.textContent();
    assert.match(text, /Caller: .*Thursday afternoon/);
    assert.match(text, /Assistant: /);
    assert.match(text, /I built this/);
    assert.match(text, /Viviene Pitogo/);
    assert.match(text, /Sample call scenario\./);
    assert.match(text, /written to Google Calendar and logged in Airtable/);
    // Voice receptionists are a pilot service, and the proof says so.
    assert.match(text, /offered as a pilot, case by case/);
    // Honest by construction: no invented statistics or testimonials.
    assert.doesNotMatch(text, /\d+\s?%|\d+x\b|testimonial|“|”|★/i);
    assert.equal(await proof.locator("blockquote").count(), 0, "no quoted testimonial");
    await page.context().close();
  },
);

test("hero: one prominent booking action and one descriptive link straight to the scenario", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const hero = page.locator("section").first();
  const book = hero.getByRole("link", { name: /Book a free 30-minute call/ });
  assert.match(
    await book.getAttribute("href"),
    /^https:\/\/calendly\.com\/vivienecreates\/automation-discovery-call$/,
  );
  if (hasProofCase) {
    const see = hero.getByRole("link", { name: /See a call become a booking/ });
    await see.click();
    await page.waitForURL(/#proof$/);
    await page.waitForFunction(() => {
      const r = document.querySelector("#proof h2").getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight * 0.6;
    });
  } else {
    await hero.getByRole("link", { name: /See the projects/ }).waitFor();
  }
  // The catalog stays reachable through navigation and the hero's own text links.
  assert.equal(
    await page.getByRole("link", { name: "explore our systems", exact: true }).count(),
    1,
  );
  assert.equal(await page.getByRole("link", { name: "all projects", exact: true }).count(), 1);
  await page.context().close();
});

proofTest(
  "the proof links to the case study, shows the real workflow and offers no recording",
  async () => {
    const page = await newPage(env.browser, VIEWPORTS["1440"]);
    await page.goto(env.base + "/");
    const proof = page.locator("#proof");
    assert.equal(await proof.getByRole("link", { name: /recorded demo/ }).count(), 0);
    assert.equal(await proof.locator("iframe").count(), 0);
    assert.equal(await proof.getByRole("img", { name: /Workflow screenshot/ }).count(), 1);
    await proof.getByRole("link", { name: /Read the case study/ }).click();
    await page.waitForURL("**/work/ai-voice-receptionist");
    assert.equal(await page.locator("#demo").count(), 0, "no recording section");
    await page.context().close();
  },
);

(hasProofCase ? test.skip : test)(
  "without a published proof project the home page has no proof section and nothing points to it",
  async () => {
    const page = await newPage(env.browser, VIEWPORTS["1440"]);
    await page.goto(env.base + "/");
    assert.equal(await page.locator("#proof").count(), 0);
    assert.equal(await page.locator('a[href$="#proof"]').count(), 0);
    assert.equal(await page.getByText(/Messenger inquiry/).count(), 0);
    await page
      .getByRole("link", { name: /See the projects/ })
      .first()
      .click();
    await page.waitForURL("**/work");
    await page.context().close();
  },
);

test("the portfolio shows exactly the launch projects", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/work");
  const n = projects.length;
  assert.match(
    await page.getByText(/Showing \d+ of \d+ projects/).textContent(),
    new RegExp(`${n} of ${n}`),
  );
  for (const p of projects)
    assert.equal((await page.locator(`a[href="/work/${p.id}"]`).count()) > 0, true, p.id);
  await page.context().close();
});

proofTest("with reduced motion every proof status is already in its final state", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"], { reducedMotion: true });
  await page.goto(env.base + "/");
  const text = await page.locator("#proof ol").textContent();
  assert.match(text, /Received/);
  assert.match(text, /Checked/);
  assert.match(text, /Booked/);
  assert.doesNotMatch(text, /Waiting/);
  await page.context().close();
});

proofTest("without reduced motion the statuses resolve once and then rest", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  await page.locator("#proof").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector("#proof ol")?.textContent.includes("Booked"),
    null,
    { timeout: 6000 },
  );
  const a = await page.locator("#proof ol").textContent();
  await page.waitForTimeout(1500);
  assert.equal(await page.locator("#proof ol").textContent(), a, "the sequence must not loop");
  await page.context().close();
});
