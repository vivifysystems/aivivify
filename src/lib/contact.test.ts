/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeMessage, mailtoHref, validateContact } from "./contact.ts";

const ok = {
  name: "Sam Lee",
  email: "sam@example.com",
  business: "",
  interests: [],
  message: "We miss calls on busy days.",
};

test("valid input passes; invalid fields get specific messages", () => {
  assert.deepEqual(validateContact(ok), {});
  const e = validateContact({ ...ok, name: " ", email: "nope", message: "hi" });
  assert.ok(e.name && e.email && e.message);
  assert.ok(validateContact({ ...ok, message: "x".repeat(2001) }).message);
});

test("mailto is encoded and strips header-injection characters", () => {
  const { subject, body } = composeMessage(
    { ...ok, name: "Sam\r\nBcc: evil@example.com", interests: ["ai-chatbot"] },
    { "ai-chatbot": "AI Website Chatbot" },
  );
  assert.ok(!/[\r\n]/.test(subject));
  assert.match(body, /Interested in: AI Website Chatbot/);
  const href = mailtoHref("mailto:viviene@vivify.solutions", subject, body);
  assert.match(href, /^mailto:viviene@vivify\.solutions\?subject=/);
  assert.ok(!href.includes("\n"));
});

test("an email address must be a single plain address", () => {
  for (const email of [
    "a,b@example.com",
    "a@example.com, b@example.com",
    "a;b@example.com",
    '"a"@example.com',
    "<a@example.com>",
    "a@example.com\u0000",
    "a\u0007@example.com",
  ]) {
    assert.ok(validateContact({ ...ok, email }).email, `accepted ${JSON.stringify(email)}`);
  }
  for (const email of ["first.last+tag@sub.example.co.uk", "o'neil@example.ie", "a_b-c@x.io"]) {
    assert.equal(validateContact({ ...ok, email }).email, undefined, `rejected ${email}`);
  }
});
