/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { respond, topicReply } from "./ask-vivi.ts";
import {
  MAX_PENDING,
  deliverNext,
  initialConversation,
  isReplying,
  submitQuestion,
  waiting,
} from "./ask-vivi-conversation.ts";

const roles = (c: ReturnType<typeof initialConversation>) => c.messages.map((m) => m.from);

test("two quick prompts each get exactly one reply, in order", () => {
  let c = initialConversation();
  c = submitQuestion(c, "What can VIVIFY build?", topicReply("build")).state;
  // The second prompt arrives while the first reply is still pending.
  c = submitQuestion(c, "Which package fits me?", topicReply("package")).state;
  assert.equal(isReplying(c), true);
  assert.deepEqual(roles(c), ["vivi", "you"], "the second prompt waits its turn");
  assert.equal(waiting(c).length, 1);

  c = deliverNext(c);
  assert.equal(c.messages.at(-2)?.text, topicReply("build").text, "first reply is delivered first");
  assert.equal(
    c.messages.at(-1)?.from,
    "you",
    "second question joins the transcript when its turn starts",
  );
  assert.equal(c.messages.at(-1)?.text, "Which package fits me?");
  assert.equal(isReplying(c), true);

  c = deliverNext(c);
  assert.equal(isReplying(c), false);
  assert.deepEqual(roles(c), ["vivi", "you", "vivi", "you", "vivi"]);
  assert.equal(c.messages[2].text, topicReply("build").text);
  assert.equal(c.messages[4].text, topicReply("package").text);
});

test("conversation stays paired: every question is followed by its own reply", () => {
  const qs = ["How much does it cost?", "missed call text back", "tell me about the receptionist"];
  let c = initialConversation();
  for (const q of qs) c = submitQuestion(c, q, respond(q)).state;
  while (isReplying(c)) c = deliverNext(c);
  const convo = c.messages.slice(1); // drop greeting
  qs.forEach((q, i) => {
    assert.equal(convo[i * 2].from, "you");
    assert.equal(convo[i * 2].text, q);
    assert.equal(convo[i * 2 + 1].from, "vivi");
    assert.equal(convo[i * 2 + 1].text, respond(q).text);
  });
  assert.equal(convo.length, qs.length * 2);
});

test("delivering with nothing pending changes nothing", () => {
  const c = initialConversation();
  assert.equal(deliverNext(c), c);
});

test("a full queue refuses a new prompt without recording it", () => {
  let c = initialConversation();
  for (let i = 0; i < MAX_PENDING; i++) c = submitQuestion(c, `q${i}`, respond("price")).state;
  const r = submitQuestion(c, "one too many", respond("price"));
  assert.equal(r.accepted, false);
  assert.equal(r.state, c, "a refused prompt must leave the conversation untouched");
  // Once a reply lands there is room again.
  const after = submitQuestion(deliverNext(r.state), "now fits", respond("price"));
  assert.equal(after.accepted, true);
});

test("message ids are unique so rows never collide", () => {
  let c = initialConversation();
  c = submitQuestion(c, "a b", respond("price")).state;
  c = submitQuestion(c, "c d", respond("price")).state;
  while (isReplying(c)) c = deliverNext(c);
  const ids = c.messages.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
});
