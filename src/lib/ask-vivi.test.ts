/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { quickTopics, respond, topicReply } from "./ask-vivi.ts";

test("every quick topic has an answer with a next step", () => {
  for (const t of quickTopics) {
    const r = topicReply(t.id);
    assert.ok(r.text.length > 20, t.id);
    assert.ok(r.links.length > 0, `${t.id} has no next step`);
    for (const l of r.links) assert.match(l.to, /^\//, "links stay on-site");
  }
});

test("free text maps to pre-written answers", () => {
  assert.equal(respond("How much does it cost?").id, "faq-cost");
  assert.equal(respond("can the AI make mistakes").id, "faq-ai-mistakes");
  const receptionist = respond("tell me about the receptionist");
  assert.equal(receptionist.id, "system-ai-receptionist");
  assert.match(receptionist.text, /pilot/);
  assert.equal(respond("missed call text back").id, "system-missed-call-text-back");
  assert.equal(respond("qwerty zxcv").id, "fallback");
  assert.equal(respond("   ").id, "contact");
});

test("missed-call questions go straight to the service and its demo (ticket 4)", () => {
  for (const q of [
    "I miss calls while I am on a job. Can callers get a text?",
    "Can you text someone back if I miss their call?",
    "What happens when I miss a call?",
    "do you send a text to people who call when I can't answer",
    "Missed calls are costing me jobs",
    "auto text back for missed calls",
  ]) {
    const r = respond(q);
    assert.equal(r.id, "system-missed-call-text-back", q);
    assert.deepEqual(
      r.links.map((l) => l.to),
      ["/systems/missed-call-text-back", "/demos#missed-call"],
      q,
    );
    assert.match(r.text, /eligible callers?/i, q);
    assert.match(r.text, /provider/i, `${q}: must carry the provider-availability caveat`);
    assert.doesNotMatch(r.text, /guarantee|100%|always/i, q);
  }
});

test("missed-call matching does not swallow nearby topics", () => {
  assert.equal(respond("Do you handle missed appointments?").id.startsWith("system-missed"), false);
  assert.equal(respond("tell me about the receptionist").id, "system-ai-receptionist");
  assert.equal(respond("How much does it cost?").id, "faq-cost");
  assert.equal(respond("Will it work with my CRM?").id, "faq-compatibility");
});

test("a genuinely unsupported question falls back to Viviene", () => {
  const r = respond("Can you track my delivery drones across three warehouses?");
  assert.equal(r.id, "fallback");
  assert.deepEqual(
    r.links.map((l) => l.to),
    ["/contact"],
  );
});

test("every pre-written FAQ answer keeps a human next step", () => {
  for (const q of [
    "Will it work with my CRM?",
    "who looks after it after launch",
    "is my data safe",
  ]) {
    const r = respond(q);
    assert.ok(
      r.links.some((l) => l.to === "/contact"),
      `${q} (${r.id}) has no way to reach Viviene`,
    );
  }
});
