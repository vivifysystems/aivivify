/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact, memoryRateLimiter, type ContactEnv } from "./contact-handler.ts";

const configured: ContactEnv = {
  RESEND_API_KEY: "test-key-not-real",
  CONTACT_TO_EMAIL: "inbox@example.com",
  CONTACT_FROM_EMAIL: "Website <forms@example.com>",
};
const valid = {
  name: "Sam Lee",
  email: "sam@example.com",
  business: "Plumbing",
  needs: ["capture-respond", "not-a-need"],
  message: "We miss calls while on jobs.",
  website: "",
  elapsedMs: 15_000,
};

function req(body: unknown, init: { method?: string; headers?: Record<string, string> } = {}) {
  return new Request("https://site.example/api/contact", {
    method: init.method ?? "POST",
    headers: { "content-type": "application/json", ...init.headers },
    body:
      init.method === "GET" ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

function deps(over: Partial<{ fetch: typeof fetch; allow: (k: string) => boolean }> = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fakeFetch = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: "email_123" }), { status: 200 });
  }) as unknown as typeof fetch;
  return {
    calls,
    d: { fetch: over.fetch ?? fakeFetch, now: () => 0, allow: over.allow ?? (() => true) },
  };
}

test("not configured: nothing is sent and the client is told so", async () => {
  const { calls, d } = deps();
  const res = await handleContact(req(valid), {}, d);
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { ok: false, code: "not_configured" });
  assert.equal(calls.length, 0);
});

test("configured: sends one email via Resend with reply-to and filtered needs", async () => {
  const { calls, d } = deps();
  const res = await handleContact(req(valid), configured, d);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, delivered: true, id: "email_123" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const sent = JSON.parse(String(calls[0].init?.body));
  assert.deepEqual(sent.to, ["inbox@example.com"]);
  assert.equal(sent.reply_to, "sam@example.com");
  assert.match(sent.text, /Interested in: Capture & respond\n/);
  assert.ok(!sent.text.includes("not-a-need"));
});

test("provider failure is reported as not delivered", async () => {
  const failing = (async () => new Response("err", { status: 500 })) as unknown as typeof fetch;
  const res = await handleContact(req(valid), configured, deps({ fetch: failing }).d);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).code, "send_failed");
});

test("rejects bad methods, origins, payloads and invalid fields", async () => {
  const { d } = deps();
  assert.equal((await handleContact(req(null, { method: "GET" }), configured, d)).status, 405);
  const strict = { ...configured, CONTACT_ALLOWED_ORIGIN: "https://vivify.solutions" };
  assert.equal(
    (await handleContact(req(valid, { headers: { origin: "https://evil.example" } }), strict, d))
      .status,
    403,
  );
  assert.equal((await handleContact(req("x".repeat(20_000)), configured, d)).status, 413);
  assert.equal((await handleContact(req("not json"), configured, d)).status, 400);
  const bad = await handleContact(req({ ...valid, email: "nope" }), configured, d);
  assert.equal(bad.status, 422);
  assert.ok((await bad.json()).errors.email);
});

test("spam traps never send, and rate limiting applies", async () => {
  const { calls, d } = deps();
  const honeypot = await handleContact(req({ ...valid, website: "http://spam" }), configured, d);
  assert.deepEqual(await honeypot.json(), { ok: true, delivered: false, reason: "filtered" });
  const tooFast = await handleContact(req({ ...valid, elapsedMs: 500 }), configured, d);
  assert.equal((await tooFast.json()).delivered, false);
  assert.equal(calls.length, 0);

  const allow = memoryRateLimiter(2, 60_000, () => 0);
  const limited = deps({ allow }).d;
  await handleContact(req(valid), configured, limited);
  await handleContact(req(valid), configured, limited);
  assert.equal((await handleContact(req(valid), configured, limited)).status, 429);
});

test("Turnstile is enforced when a secret is configured", async () => {
  const verifyFails = (async (url: string) =>
    new Response(
      JSON.stringify(url.includes("turnstile") ? { success: false } : { id: "x" }),
    )) as unknown as typeof fetch;
  const res = await handleContact(
    req(valid),
    { ...configured, TURNSTILE_SECRET_KEY: "s" },
    deps({ fetch: verifyFails }).d,
  );
  assert.equal(res.status, 403);
});
