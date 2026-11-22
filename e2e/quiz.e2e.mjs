// Ticket 3: the quiz result, the package and the contact form tell one story.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { newPage, VIEWPORTS } from "./helpers.mjs";
import { setup } from "./setup.mjs";

let env;
before(async () => (env = await setup()));
after(async () => env.teardown());

const REVIEW_PATH = [
  "Often",
  "Hardly any",
  "We follow up on a set schedule",
  "Online booking already works well",
  "In one CRM everyone uses",
  "Very little",
];
const ALL_LOW = [
  "Rarely",
  "Hardly any",
  "We follow up on a set schedule",
  "Online booking already works well",
  "In one CRM everyone uses",
  "Very little",
];

async function answer(page, labels) {
  const quiz = page.locator("#readiness");
  await quiz.scrollIntoViewIfNeeded();
  for (const l of labels) await quiz.getByRole("button", { name: l, exact: true }).click();
  return quiz;
}

test("review path: the result leads with Missed-Call Text Back and the Connect pilot, not Growth", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const quiz = await answer(page, REVIEW_PATH);
  const first = quiz.locator("ul li a").first();
  assert.match(await first.textContent(), /Missed-Call Text Back/);
  const text = await quiz.textContent();
  assert.match(text, /VIVIFY Connect/);
  assert.match(text, /pilot/i);
  assert.match(text, /provider/i);
  assert.doesNotMatch(text, /VIVIFY Growth/);
  assert.match(text, /Often/, "names the answer that led to the recommendation");
  assert.match(text, /on its own/i, "offers the stand-alone question");
  await page.context().close();
});

test("the selected system and an editable summary carry into Contact, without answers in the URL", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const quiz = await answer(page, REVIEW_PATH);
  await quiz.getByRole("link", { name: /Talk through my result/ }).click();
  await page.waitForURL("**/contact**");
  const url = new URL(page.url());
  assert.doesNotMatch(url.search, /growth/i);
  assert.doesNotMatch(decodeURIComponent(url.search), /Often|unanswered/);
  const msg = page.getByLabel("What's taking up your time?");
  const value = await msg.inputValue();
  assert.match(value, /Missed-Call Text Back/);
  assert.match(value, /VIVIFY Connect/);
  assert.match(value, /pilot/i);
  const checked = await page
    .locator('fieldset input[type="checkbox"]:checked')
    .evaluateAll((els) => els.map((e) => e.closest("label").textContent));
  assert.equal(checked.length, 1, `preselected: ${JSON.stringify(checked)}`);
  assert.match(checked[0], /Capture & respond/);
  assert.match(await page.locator("body").textContent(), /edit or delete/i);
  // Editable before anything is sent.
  await msg.fill("Edited: I just want to ask about missed calls.");
  assert.equal(await msg.inputValue(), "Edited: I just want to ask about missed calls.");
  await page.context().close();
});

test("an all-low-need path still reports no urgent need and offers no package", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const quiz = await answer(page, ALL_LOW);
  const text = await quiz.textContent();
  assert.match(text, /Nothing stands out as urgent/);
  assert.doesNotMatch(text, /Closest package|Included in|VIVIFY (Launch|Growth|Connect)/);
  await quiz.getByRole("link", { name: /Talk through my result/ }).click();
  await page.waitForURL("**/contact**");
  assert.equal(await page.locator('fieldset input[type="checkbox"]:checked').count(), 0);
  await page.context().close();
});

test("Back keeps the earlier selection and Start again clears everything", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const quiz = await answer(page, REVIEW_PATH.slice(0, 2));
  await quiz.getByRole("button", { name: "Back" }).click();
  assert.equal(await quiz.getByRole("button", { name: "Hardly any", exact: true }).count(), 1);
  // Question 2 again, with its earlier choice still marked.
  await quiz.getByText("Question 2 of 6").waitFor();
  assert.equal(
    await quiz
      .getByRole("button", { name: "Hardly any", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  // Finish, then step back from the result into the last question.
  for (const l of REVIEW_PATH.slice(1))
    await quiz.getByRole("button", { name: l, exact: true }).click();
  await quiz
    .getByRole("button", { name: /Change my answers|Back/ })
    .first()
    .click();
  await quiz.getByText("Question 6 of 6").waitFor();
  assert.equal(
    await quiz
      .getByRole("button", { name: "Very little", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await quiz.getByRole("button", { name: "Very little", exact: true }).click();
  await quiz.getByRole("button", { name: /Start again/ }).click();
  await quiz.getByText("Question 1 of 6").waitFor();
  assert.equal(await quiz.locator('button[aria-pressed="true"]').count(), 0);
  await page.context().close();
});

test("the result survives going to Contact and pressing the browser Back button", async () => {
  const page = await newPage(env.browser, VIEWPORTS["1440"]);
  await page.goto(env.base + "/");
  const quiz = await answer(page, REVIEW_PATH);
  await quiz.getByRole("link", { name: /Talk through my result/ }).click();
  await page.waitForURL("**/contact**");
  await page.goBack();
  await page.waitForURL(env.base + "/");
  await page.locator("#readiness").getByText("Your indicative result").waitFor();
  await page.context().close();
});
