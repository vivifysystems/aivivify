// Ticket 7 (contact QA): the real UI talks to the real /api/contact handler, with the
// email provider SIMULATED. This proves the contract and the failure/retry behaviour.
// It does NOT prove real delivery: that needs Resend credentials and a designated test
// inbox (see docs/launch/contact-form.md and docs/phase4/report.md).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { handleContact, memoryRateLimiter } from "../src/lib/contact-handler.ts";
import { launch, newPage, startStatic, distDir, VIEWPORTS } from "./helpers.mjs";

let server, browser;
let env = {};
let providerStatus = 200;
const sent = [];

const fakeProvider = async (url, init) => {
  assert.equal(
    String(url),
    "https://api.resend.com/emails",
    "the handler only ever calls the provider endpoint",
  );
  sent.push(JSON.parse(init.body));
  return new Response(JSON.stringify({ id: "sim_123" }), { status: providerStatus });
};

before(async () => {
  const allow = memoryRateLimiter(50);
  server = await startStatic(distDir, async (req, res, url) => {
    if (url.pathname !== "/api/contact") {
      res.writeHead(404).end();
      return;
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request("http://x/api/contact", {
      method: req.method,
      headers: req.headers,
      body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
    });
    const r = await handleContact(request, env, { fetch: fakeProvider, now: Date.now, allow });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(await r.text());
  });
  browser = await launch();
});
after(async () => {
  await browser.close();
  await server.close();
});

const CONFIGURED = {
  RESEND_API_KEY: "simulated-key-not-real",
  CONTACT_TO_EMAIL: "test-recipient@example.invalid",
  CONTACT_FROM_EMAIL: "VIVIFY Website <forms@example.invalid>",
};

async function fill(page) {
  await page.goto(server.url + "/contact");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email").fill("test.person@example.invalid");
  await page.getByLabel(/Business and what/).fill("Plumbing, 4 technicians");
  await page
    .getByLabel("What's taking up your time?")
    .fill("Calls go unanswered while we are on jobs.");
  await page.waitForTimeout(3300); // humans take longer than the 3s spam trap
}

test("valid submission: the UI says sent only after the handler reports a provider-accepted send", async () => {
  env = { ...CONFIGURED };
  providerStatus = 200;
  sent.length = 0;
  const page = await newPage(browser, VIEWPORTS["1440"]);
  await fill(page);
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.getByRole("heading", { name: /Message sent/ }).waitFor();
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to[0], CONFIGURED.CONTACT_TO_EMAIL);
  assert.equal(sent[0].reply_to, "test.person@example.invalid");
  assert.match(sent[0].text, /Calls go unanswered/);
  await page.context().close();
});

test("not configured: the UI never claims success and offers the mailto fallback", async () => {
  env = {};
  const page = await newPage(browser, VIEWPORTS["1440"]);
  await fill(page);
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.getByRole("heading", { name: "Not sent yet" }).waitFor();
  assert.match(await page.getByRole("alert").textContent(), /isn't connected yet/);
  assert.equal(await page.getByText("Message sent").count(), 0);
  assert.match(
    await page.getByRole("link", { name: /Open in my email app/ }).getAttribute("href"),
    /^mailto:viviene@vivify\.solutions\?subject=/,
  );
  await page.context().close();
});

test("provider failure: reported as not sent, and nothing is lost", async () => {
  env = { ...CONFIGURED };
  providerStatus = 500;
  const page = await newPage(browser, VIEWPORTS["1440"]);
  await fill(page);
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.getByRole("heading", { name: "Not sent yet" }).waitFor();
  assert.match(await page.getByRole("alert").textContent(), /Something went wrong/);
  assert.match(await page.locator("pre").textContent(), /Calls go unanswered/);
  await page.context().close();
});

test("network failure, then retry: the form keeps the visitor's words and the retry succeeds", async () => {
  env = { ...CONFIGURED };
  providerStatus = 200;
  sent.length = 0;
  const page = await newPage(browser, VIEWPORTS["390"], { touch: true });
  await fill(page);
  await page.route("**/api/contact", (r) => r.abort("internetdisconnected"));
  await page.getByRole("button", { name: /Send message/ }).tap();
  await page.getByRole("heading", { name: "Not sent yet" }).waitFor();
  assert.match(await page.getByRole("alert").textContent(), /couldn't reach the server/);
  assert.equal(sent.length, 0);
  await page.unroute("**/api/contact");
  await page.getByRole("button", { name: "Back to the form" }).tap();
  assert.equal(await page.getByLabel("Your name").inputValue(), "Test Person");
  assert.match(
    await page.getByLabel("What's taking up your time?").inputValue(),
    /Calls go unanswered/,
  );
  await page.getByRole("button", { name: /Send message/ }).tap();
  await page.getByRole("heading", { name: /Message sent/ }).waitFor();
  assert.equal(sent.length, 1, "exactly one email after the retry");
  await page.context().close();
});

test("a post faster than the 3 second spam trap is not reported as sent", async () => {
  env = { ...CONFIGURED };
  sent.length = 0;
  const page = await newPage(browser, VIEWPORTS["1440"]);
  await page.goto(server.url + "/contact");
  await page.getByLabel("Your name").fill("Fast Bot");
  await page.getByLabel("Email").fill("fast@example.invalid");
  await page.getByLabel("What's taking up your time?").fill("This was submitted far too quickly.");
  await page.getByRole("button", { name: /Send message/ }).click();
  await page.getByRole("heading", { name: "Not sent yet" }).waitFor();
  assert.equal(sent.length, 0);
  await page.context().close();
});

test("blank and invalid fields get accessible errors, focus moves to the first one, nothing is sent", async () => {
  env = { ...CONFIGURED };
  sent.length = 0;
  const page = await newPage(browser, VIEWPORTS["390"], { touch: true });
  await page.goto(server.url + "/contact");
  await page.getByRole("button", { name: /Send message/ }).tap();
  const name = page.getByLabel("Your name");
  assert.equal(await name.getAttribute("aria-invalid"), "true");
  assert.equal(await name.evaluate((n) => n === document.activeElement), true);
  const describedBy = await name.getAttribute("aria-describedby");
  assert.match(await page.locator(`[id="${describedBy}"]`).textContent(), /Please enter your name/);
  await page.getByLabel("Your name").fill("A B");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("What's taking up your time?").fill("short");
  await page.getByRole("button", { name: /Send message/ }).tap();
  assert.equal(await page.getByLabel("Email").getAttribute("aria-invalid"), "true");
  assert.equal(
    await page.getByLabel("What's taking up your time?").getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(sent.length, 0);
  await page.context().close();
});
