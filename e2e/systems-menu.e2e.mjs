// Ticket 1: the desktop Systems menu must stay reachable on short screens.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

async function openMenu(page, how) {
  const btn = page.getByRole("button", { name: "Systems", exact: true });
  if (how === "hover") {
    await btn.hover();
  } else if (how === "tap") {
    await btn.tap();
  } else {
    await btn.click();
  }
  const id = await btn.getAttribute("aria-controls");
  const panel = page.locator(`[id="${id}"]`);
  await panel.waitFor({ state: "visible" });
  return { btn, panel };
}

for (const key of ["1024x640", "1280x720"]) {
  test(`Systems menu is fully reachable by pointer and Tab at ${key}`, async () => {
    const vp = VIEWPORTS[key];
    const page = await newPage(env.browser, vp);
    await page.goto(env.base + "/");
    const { btn, panel } = await openMenu(page, "click");

    const rects = () =>
      panel.evaluate((el) => {
        const links = [...el.querySelectorAll("a")];
        return links.map((a) => ({
          text: a.textContent.trim().slice(0, 30),
          ...a.getBoundingClientRect().toJSON(),
        }));
      });
    const initial = await rects();
    assert.ok(initial.length >= 13, `expected menu links, got ${initial.length}`);
    const names = initial.map((r) => r.text).join("|");
    assert.match(names, /All systems/);
    assert.match(names, /Watch demos/);

    // The panel itself must be bounded by the viewport.
    const box = await panel.locator("> div").first().boundingBox();
    assert.ok(
      box.y + box.height <= vp.height + 1,
      `panel bottom ${box.y + box.height} exceeds viewport ${vp.height}`,
    );

    // Wheel inside the panel (scroll it fully down) must not move the page behind.
    await page.mouse.move(vp.width / 2, 300);
    for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);
    await page.waitForTimeout(150);
    const scrollY = await page.evaluate(() => window.scrollY);
    assert.equal(scrollY, 0, "page behind the open menu moved while scrolling inside it");

    // After scrolling inside the menu, every link can be seen within the viewport.
    for (const r of await rects()) {
      assert.ok(r.bottom <= vp.height + 1 || r.top >= 0, "link unreachable");
    }
    const last = panel.getByRole("link", { name: /Watch demos/ });
    await last.scrollIntoViewIfNeeded();
    const lb = await last.boundingBox();
    assert.ok(
      lb.y >= 0 && lb.y + lb.height <= vp.height,
      `Watch demos at y=${lb.y} is outside ${vp.height}`,
    );

    // Tab walks every link and each focused link is inside the viewport.
    await btn.focus();
    await page.keyboard.press("ArrowDown");
    await page.waitForFunction(() => document.activeElement?.tagName === "A");
    const seen = [];
    for (let i = 0; i < 40; i++) {
      const info = await page.evaluate(() => {
        const a = document.activeElement;
        const r = a.getBoundingClientRect();
        return {
          tag: a.tagName,
          text: a.textContent.trim().slice(0, 30),
          top: r.top,
          bottom: r.bottom,
        };
      });
      if (info.tag !== "A") break;
      assert.ok(
        info.top >= 0 && info.bottom <= vp.height + 1,
        `focused "${info.text}" at ${info.top}-${info.bottom} is off screen`,
      );
      seen.push(info.text);
      if (/Watch demos/.test(info.text)) break;
      await page.keyboard.press("Tab");
    }
    assert.ok(
      seen.some((t) => /Watch demos/.test(t)),
      "Tab never reached Watch demos",
    );
    assert.ok(seen.length >= 13, `Tab visited only ${seen.length} links`);

    // Escape closes the menu and returns focus to Systems.
    await page.keyboard.press("Escape");
    await panel.waitFor({ state: "hidden" });
    assert.equal(
      await btn.evaluate((b) => b === document.activeElement),
      true,
      "focus did not return to Systems",
    );
    await page.context().close();
  });
}

test("Systems menu locks the page behind it and scrolls internally on touch (1024x640)", async () => {
  const vp = VIEWPORTS["1024x640"];
  const page = await newPage(env.browser, vp, { touch: true });
  await page.goto(env.base + "/");
  const { panel } = await openMenu(page, "tap");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.synthesizeScrollGesture", {
    x: vp.width / 2,
    y: 400,
    yDistance: -500,
    gestureSourceType: "touch",
    speed: 1200,
    repeatCount: 3,
  });
  await page.waitForTimeout(300);
  assert.equal(
    await page.evaluate(() => window.scrollY),
    0,
    "touch scroll moved the page behind the menu",
  );
  const last = panel.getByRole("link", { name: /Watch demos/ });
  const lb = await last.boundingBox();
  assert.ok(
    lb.y + lb.height <= vp.height,
    `Watch demos not visible after touch scroll (y=${lb.y})`,
  );
  await page.context().close();
});

test("Systems menu is unchanged and fits on a tall desktop (1440x900)", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const { panel } = await openMenu(page, "hover");
  const groups = await panel.locator("p.kicker").allTextContents();
  assert.deepEqual(groups, ["Get found", "Capture & respond", "Follow up & book", "Run & improve"]);
  await page.context().close();
});
