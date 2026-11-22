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
