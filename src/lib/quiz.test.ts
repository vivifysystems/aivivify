/// <reference types="node" />
// Ticket 3: the quiz recommendation, the published package inclusions and the
// availability wording must always agree.
import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../content/quiz.ts";
import { packages } from "../content/packages.ts";
import { systems } from "../content/systems.ts";
import { describeRecommendation, scoreQuiz, type QuizAnswers } from "./quiz.ts";

const byLabel = (qid: string, label: string) => {
  const q = quizQuestions.find((x) => x.id === qid)!;
  const i = q.options.findIndex((o) => o.label === label);
  assert.ok(i >= 0, `no option "${label}" in ${qid}`);
  return i;
};

/** The exact path from the independent review. */
const reviewPath: QuizAnswers = {
  "missed-inquiries": byLabel("missed-inquiries", "Often"),
  "repeat-questions": byLabel("repeat-questions", "Hardly any"),
  "follow-up": byLabel("follow-up", "We follow up on a set schedule"),
  booking: byLabel("booking", "Online booking already works well"),
  records: byLabel("records", "In one CRM everyone uses"),
  admin: byLabel("admin", "Very little"),
};

const run = (a: QuizAnswers) => scoreQuiz(quizQuestions, a, packages);

test("missed calls recommend Missed-Call Text Back and its own package, Connect", () => {
  const r = run(reviewPath);
  assert.equal(r.primary, "missed-call-text-back");
  assert.equal(r.systems[0], "missed-call-text-back");
  assert.equal(r.packageId, "connect", "the package must be the one that lists the service");
  assert.ok(packages.find((p) => p.id === r.packageId)!.systems.includes(r.primary!));
});

test("the result says which answer led to the first recommendation", () => {
  const r = run(reviewPath);
  assert.deepEqual(r.lead, {
    questionId: "missed-inquiries",
    question: "How often do calls or messages go unanswered for hours?",
    answer: "Often",
  });
});

test("the recommendation copy is availability-qualified and does not invent capabilities", () => {
  const c = describeRecommendation(run(reviewPath), systems, packages);
  assert.equal(c.systemTitle, "Missed-Call Text Back");
  assert.equal(c.packageName, "VIVIFY Connect");
  assert.match(c.availability, /pilot/i);
  assert.match(c.availability, /provider/i);
  // A stand-alone option is offered as a question to ask, never promised.
  assert.match(c.standalone ?? "", /ask/i);
  assert.doesNotMatch(`${c.availability} ${c.standalone}`, /guarantee|included for free|instant/i);
  assert.match(c.summary, /Missed-Call Text Back/);
  assert.match(c.summary, /VIVIFY Connect/);
  assert.match(c.summary, /Often/);
});

test("an available service in an available package needs no availability caveat", () => {
  const chatty = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
  const r = run({ ...chatty, "repeat-questions": byLabel("repeat-questions", "A lot") });
  assert.equal(r.primary, "ai-chatbot");
  assert.equal(r.packageId, "growth");
  const c = describeRecommendation(r, systems, packages);
  assert.equal(c.standalone, null);
  assert.doesNotMatch(c.availability, /pilot/i);
});

test("an all-low-need path reports no urgent need and no package", () => {
  const calm = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
  const r = run(calm);
  assert.equal(r.level, "foundation");
  assert.deepEqual(r.systems, []);
  assert.equal(r.primary, null);
  assert.equal(r.packageId, null);
  assert.equal(r.lead, null);
  assert.equal(describeRecommendation(r, systems, packages).summary, "");
});

test("every possible answer combination yields a package that lists the recommended service", () => {
  const sizes = quizQuestions.map((q) => q.options.length);
  const total = sizes.reduce((a, b) => a * b, 1);
  assert.equal(total, 729);
  for (let n = 0; n < total; n++) {
    const answers: QuizAnswers = {};
    let rest = n;
    quizQuestions.forEach((q, i) => {
      answers[q.id] = rest % sizes[i];
      rest = Math.floor(rest / sizes[i]);
    });
    const r = run(answers);
    if (r.systems.length === 0) {
      assert.equal(r.packageId, null, JSON.stringify(answers));
      assert.equal(r.primary, null);
      continue;
    }
    assert.equal(r.primary, r.systems[0]);
    assert.ok(r.packageId, `no package for ${r.primary}: ${JSON.stringify(answers)}`);
    const pkg = packages.find((p) => p.id === r.packageId)!;
    assert.ok(
      pkg.systems.includes(r.primary!),
      `${r.primary} is recommended with ${pkg.name}, which does not list it (${JSON.stringify(answers)})`,
    );
    const c = describeRecommendation(r, systems, packages);
    if (pkg.availability === "pilot") assert.match(c.availability, /pilot/i);
    assert.ok(r.lead, "a recommendation always names the answer behind it");
  }
});
