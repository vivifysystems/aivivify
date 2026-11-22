// Tickets 2 and 4: Ask VIVI gives every accepted prompt exactly one matching reply.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const openGuide = async (page, tap) => {
  const btn = page.getByRole("banner").getByRole("button", { name: "Ask VIVI" });
  await (tap ? btn.tap() : btn.click());
  await page.getByRole("dialog", { name: "Ask VIVI" }).waitFor();
  return page.getByRole("dialog", { name: "Ask VIVI" });
};

/** The transcript as [speaker, text] pairs, read from the visually-hidden speaker labels. */
const transcript = (dialog) =>
  dialog.evaluate((root) =>
    [...root.querySelectorAll("span.sr-only")]
      .filter((s) => /^(You|VIVI): $/.test(s.textContent))
      .map((s) => [
        s.textContent.replace(": ", ""),
        s.parentElement.textContent.replace(s.textContent, "").trim(),
      ]),
  );

const settle = (page, dialog, n) =>
  page
    .waitForFunction(
      ([count]) =>
        [...document.querySelectorAll('[role="dialog"] span.sr-only')].filter((s) =>
          /^(You|VIVI): $/.test(s.textContent),
        ).length >= count,
      [n],
      { timeout: 4000 },
    )
    .catch(() => {});

for (const [name, vp, touch] of [
  ["desktop 1440", VIEWPORTS["1440"], false],
  ["mobile 390", VIEWPORTS["390"], true],
]) {
  test(`two quickly selected topics each get their own reply (${name})`, async () => {
    const page = await newPage(env.browser, vp, { touch });
    await page.goto(env.base + "/");
    const dialog = await openGuide(page, touch);
    const a = dialog.getByRole("button", { name: "What can VIVIFY build?" });
    const b = dialog.getByRole("button", { name: "Which package fits me?" });
    await (touch ? a.tap() : a.click());
    await (touch ? b.tap() : b.click());
    await settle(page, dialog, 5);
    const t = await transcript(dialog);
    assert.deepEqual(
      t.map(([who]) => who),
      ["VIVI", "You", "VIVI", "You", "VIVI"],
      `transcript: ${JSON.stringify(t.map(([w, x]) => [w, x.slice(0, 30)]))}`,
    );
    assert.equal(t[1][1], "What can VIVIFY build?");
    assert.match(t[2][1], /^We build \d+ connected systems/);
    assert.equal(t[3][1], "Which package fits me?");
    assert.match(t[4][1], /VIVIFY Launch/);
    await page.context().close();
  });
}

test("a visible indicator says VIVI is replying, then clears", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const dialog = await openGuide(page);
  await dialog.getByRole("button", { name: "How does pricing work?" }).click();
  await dialog
    .getByText("VIVI is replying", { exact: false })
    .first()
    .waitFor({ state: "visible", timeout: 1500 });
  await page.waitForFunction(() => !document.body.textContent.includes("VIVI is replying"), null, {
    timeout: 4000,
  });
  await page.context().close();
});

test("typed messages sent in quick succession are each answered in order", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const dialog = await openGuide(page);
  const input = dialog.getByLabel("Ask a question");
  await input.fill("How much does it cost?");
  await input.press("Enter");
  await input.fill("tell me about the receptionist");
  await input.press("Enter");
  await settle(page, dialog, 5);
  const t = await transcript(dialog);
  assert.deepEqual(
    t.map(([who]) => who),
    ["VIVI", "You", "VIVI", "You", "VIVI"],
  );
  assert.equal(t[1][1], "How much does it cost?");
  assert.match(t[2][1], /scoped|quote|discovery/i);
  assert.equal(t[3][1], "tell me about the receptionist");
  assert.match(t[4][1], /^AI Receptionist/);
  await page.context().close();
});

test("closing during a reply and reopening leaves a coherent conversation", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  let dialog = await openGuide(page);
  await dialog.getByRole("button", { name: /More topics/ }).click();
  await dialog.getByRole("button", { name: "Show me a demo" }).click();
  await dialog.getByRole("button", { name: "Talk to Viviene" }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: "Ask VIVI" }).waitFor({ state: "hidden" });
  await page.waitForTimeout(1500);
  dialog = await openGuide(page);
  await settle(page, dialog, 5);
  const t = await transcript(dialog);
  assert.deepEqual(
    t.map(([who]) => who),
    ["VIVI", "You", "VIVI", "You", "VIVI"],
  );
  assert.equal(t[1][1], "Show me a demo");
  assert.match(t[2][1], /walkthrough/);
  assert.equal(t[3][1], "Talk to Viviene");
  assert.match(t[4][1], /discovery call/);
  await page.context().close();
});

test("each reply is announced once, through a status region", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const dialog = await openGuide(page);
  // Record every text the status region takes while a reply arrives.
  await page.evaluate(() => {
    const root = document.querySelector('[role="dialog"]');
    window.__announced = [];
    const live = () => root.querySelector('[role="status"]');
    const log = () => {
      const t = live()?.textContent?.trim();
      if (t && window.__announced.at(-1) !== t) window.__announced.push(t);
    };
    new MutationObserver(log).observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    log();
  });
  await dialog.getByRole("button", { name: "How does pricing work?" }).click();
  await settle(page, dialog, 3);
  await page.waitForTimeout(300);
  const announced = await page.evaluate(() => window.__announced);
  const replies = announced.filter((t) => /scoped|quote/i.test(t));
  assert.equal(
    replies.length,
    1,
    `reply announced ${replies.length} times: ${JSON.stringify(announced)}`,
  );
  // Nothing else in the dialog is a live region that would repeat it.
  const liveRegionsWithReply = await dialog.evaluate(
    (root) =>
      [...root.querySelectorAll('[aria-live], [role="status"], [role="log"]')].filter((el) =>
        /scoped|quote/i.test(el.textContent),
      ).length,
  );
  assert.equal(liveRegionsWithReply, 1);
  await page.context().close();
});

// Ticket 4: missed-call questions go straight to the service and its demo.
for (const q of [
  "I miss calls while I am on a job. Can callers get a text?",
  "Can you text someone back if I miss their call?",
]) {
  test(`missed-call question leads to the service and demo: "${q.slice(0, 40)}"`, async () => {
    const page = await newPage(env.browser, VIEWPORTS["1440"]);
    await page.goto(env.base + "/");
    const dialog = await openGuide(page);
    const input = dialog.getByLabel("Ask a question");
    await input.fill(q);
    await input.press("Enter");
    await settle(page, dialog, 3);
    const t = await transcript(dialog);
    const reply = t.at(-1)[1];
    assert.match(reply, /Missed-Call Text Back/);
    assert.match(reply, /provider|supported/i);
    const hrefs = await dialog
      .locator("a")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    assert.ok(hrefs.includes("/systems/missed-call-text-back"), JSON.stringify(hrefs));
    assert.ok(hrefs.includes("/demos#missed-call"), JSON.stringify(hrefs));
    await page.context().close();
  });
}

test("a genuinely unsupported question still offers contact with Viviene", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const dialog = await openGuide(page);
  const input = dialog.getByLabel("Ask a question");
  await input.fill("Can you track my delivery drones across three warehouses?");
  await input.press("Enter");
  await settle(page, dialog, 3);
  const hrefs = await dialog
    .locator("a")
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  assert.deepEqual(hrefs, ["/contact"]);
  await page.context().close();
});
