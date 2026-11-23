/// <reference types="node" />
// VIVIFY 2.0 content checks: catalog integrity, honesty rules, quiz scoring.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { z } from "zod";
import {
  demoSchema,
  faqSchema,
  packageSchema,
  quizQuestionSchema,
  systemSchema,
} from "./schema.ts";
import { systems } from "./systems.ts";
import { packages, pricingNote } from "./packages.ts";
import { demos } from "./demos.ts";
import { faqs } from "./faq.ts";
import { quizQuestions } from "./quiz.ts";
import { projects } from "./projects.ts";
import { projectCategory, featuredProjectIds, toolUsage, workCategories } from "./work.ts";
import { tools } from "./tools.ts";
import { scoreQuiz } from "../lib/quiz.ts";

const fromSrc = (p: string) => new URL(`../${p}`, import.meta.url);
const systemIds = new Set(systems.map((s) => s.id));
const projectIds = new Set(projects.map((p) => p.id));

function allText(value: unknown): string {
  return JSON.stringify(value);
}

test("v2 content matches its schemas", () => {
  z.array(systemSchema).parse(systems);
  z.array(packageSchema).parse(packages);
  z.array(demoSchema).parse(demos);
  z.array(faqSchema).parse(faqs);
  z.array(quizQuestionSchema).parse(quizQuestions);
});

test("the catalog has all 13 systems with unique ids", () => {
  assert.equal(systems.length, 13);
  assert.equal(systemIds.size, systems.length);
});

test("every icon named in content is registered in icons.tsx", () => {
  const registry = readFileSync(fromSrc("components/site/icons.tsx"), "utf8");
  const used = new Set<string>();
  for (const s of systems) used.add(s.icon);
  for (const d of demos)
    for (const st of d.steps) {
      used.add(st.icon);
      for (const it of [...st.items, ...st.ops]) if (it.kind === "event") used.add(it.icon);
    }
  for (const name of used)
    assert.match(registry, new RegExp(`^  ${name},$`, "m"), `${name} is not registered`);
});

test("every system has explicit CTA labels; demo labels exist only with a demo", () => {
  for (const s of systems) {
    assert.ok(s.exploreLabel, `${s.id}: missing exploreLabel`);
    assert.equal(Boolean(s.demoLabel), Boolean(s.demoId), `${s.id}: demoLabel must match demoId`);
  }
});

test("cross-references point at real content", () => {
  for (const s of systems) {
    if (s.demoId)
      assert.ok(
        demos.some((d) => d.id === s.demoId),
        `${s.id}: unknown demo`,
      );
    for (const p of s.relatedProjects ?? [])
      assert.ok(projectIds.has(p), `${s.id}: unknown project ${p}`);
  }
  for (const p of packages) {
    for (const id of [...p.systems, ...p.addOns])
      assert.ok(systemIds.has(id), `${p.id}: unknown system ${id}`);
  }
  for (const d of demos) assert.ok(systemIds.has(d.systemId), `${d.id}: unknown system`);
  for (const q of quizQuestions)
    for (const [id] of q.systems) assert.ok(systemIds.has(id), `${q.id}: unknown system ${id}`);
  for (const id of Object.keys(projectCategory)) assert.ok(projectIds.has(id), id);
  for (const p of projects) assert.ok(projectCategory[p.id], `${p.id} has no category`);
  for (const c of Object.values(projectCategory)) assert.ok(workCategories.some((w) => w.id === c));
  for (const id of featuredProjectIds) {
    const p = projects.find((x) => x.id === id);
    assert.ok(p, id);
    // Homepage features only projects whose sources agree.
    assert.equal(p.status, "consistent", `${id} is featured but ${p.status}`);
  }
});

test("pilot and partner services are labelled and kept out of core packages", () => {
  const receptionist = systems.find((s) => s.id === "ai-receptionist")!;
  assert.equal(receptionist.availability, "pilot");
  assert.ok(receptionist.menuLine.toLowerCase().includes("pilot"));
  const connect = packages.find((p) => p.id === "connect")!;
  assert.equal(connect.availability, "pilot");
  assert.ok(connect.availabilityNote?.toLowerCase().includes("pilot"));
  const printing = systems.find((s) => s.id === "printing")!;
  assert.equal(printing.availability, "partner-optional");
  assert.equal(printing.featured, false);
  for (const p of packages) assert.ok(!p.systems.includes("printing"), `${p.id} includes printing`);
});

test("no prices, ranking guarantees, review gating or invented proof", () => {
  const text = allText({ systems, packages, demos, faqs, quizQuestions, pricingNote });
  assert.ok(!/[$€£₱]\s?\d/.test(text), "a price appears in v2 content");
  const affirmative = text.replace(
    /(nobody|no one) can guarantee|can't guarantee|cannot guarantee/gi,
    "",
  );
  assert.ok(
    !/guarantee(d|s)? (top|first|#1|rank)/i.test(affirmative),
    "a ranking guarantee appears",
  );
  assert.ok(!/\b(5|five)[- ]star/i.test(text), "a star-rating promise appears");
  assert.ok(!/testimonial|trusted by|clients say/i.test(text), "invented social proof appears");
  const reviews = systems.find((s) => s.id === "review-feedback")!;
  assert.ok(allText(reviews).includes("never filter"), "review system must state it never filters");
  const seo = systems.find((s) => s.id === "local-seo")!;
  assert.ok(allText(seo).includes("Nobody can guarantee rankings"));
});

test("no demo starts on an empty device screen", () => {
  for (const d of demos) {
    const initial = (d.preface?.length ?? 0) + d.steps[0].items.length;
    assert.ok(initial > 0, `${d.id} starts with an empty screen`);
  }
});

test("every demo is labelled as a simulation", () => {
  for (const d of demos) {
    assert.ok(
      /sample (call )?scenario/i.test(d.simulationNote),
      `${d.id}: the note must label it a sample scenario`,
    );
  }
  const seoDemo = demos.find((d) => d.id === "local-seo")!;
  assert.ok(/not real search results/i.test(seoDemo.simulationNote));
  // Fictional phone numbers only (555-01xx range).
  const phones = allText(demos).match(/\b\d{3}-\d{4}\b/g) ?? [];
  for (const p of phones) assert.match(p, /^555-01\d\d$/, `non-fictional number ${p}`);
});

test("every listed tool is used in at least one published project", () => {
  const used = new Set(toolUsage().map((t) => t.name));
  for (const t of tools) assert.ok(used.has(t.name), `${t.name} is not in any project stack`);
});

test("quiz scoring recommends systems from answers and is indicative", () => {
  const none = scoreQuiz(quizQuestions, {}, packages);
  assert.equal(none.opportunity, 0);
  assert.deepEqual(none.systems, []);
  assert.equal(none.packageId, null);

  const calm = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
  assert.equal(scoreQuiz(quizQuestions, calm, packages).level, "foundation");

  const busy = Object.fromEntries(
    quizQuestions.map((q) => [
      q.id,
      q.options.findIndex((o) => o.score === Math.max(...q.options.map((x) => x.score))),
    ]),
  );
  const r = scoreQuiz(quizQuestions, busy, packages);
  assert.equal(r.opportunity, 100);
  assert.equal(r.level, "high");
  assert.equal(r.systems.length, 3);
  assert.ok(r.packageId);

  const chatty = { ...calm, "repeat-questions": 2 };
  const c = scoreQuiz(quizQuestions, chatty, packages);
  assert.equal(c.systems[0], "ai-chatbot");
  assert.equal(c.packageId, "growth");
});

test("site UI code neither imports registers nor hard-codes contact links", () => {
  const register = /["'][^"']*(discrepancies|withheld-claims|stat-claims)(\.ts)?["']/;
  const forbidden = [/calendly\.com/, /linkedin\.com/, /onlinejobs\.ph/, /mailto:viviene/];
  const walk = (dir: string): string[] =>
    readdirSync(fromSrc(dir)).flatMap((f) =>
      statSync(fromSrc(dir + f)).isDirectory() ? walk(`${dir}${f}/`) : [dir + f],
    );
  for (const file of [...walk("components/site/"), ...walk("pages/")].filter((f) =>
    /\.tsx?$/.test(f),
  )) {
    const code = readFileSync(fromSrc(file), "utf8");
    assert.ok(!register.test(code), `${file} imports a register`);
    for (const re of forbidden) assert.ok(!re.test(code), `${file} hard-codes ${re.source}`);
  }
});

test("follow-up and review copy describes what the demos show, without absolutes", () => {
  const follow = systems.find((s) => s.id === "lead-follow-up")!;
  const reviews = systems.find((s) => s.id === "review-feedback")!;
  const followDemo = demos.find((d) => d.id === "lead-follow-up")!;
  const reviewDemo = demos.find((d) => d.id === "review")!;
  assert.equal(
    follow.menuLine,
    "Automatically acknowledge incoming inquiries and follow up on a schedule you approve.",
  );
  assert.ok(follow.benefits.includes("Automated acknowledgement for new inquiries"));
  assert.match(followDemo.summary, /automated acknowledgement/);
  assert.match(reviews.menuLine, /^Send review invitations after completed services/);
  // The review system keeps its safeguards: same invitation, no filtering, eligibility and opt-out.
  assert.match(allText(reviews), /never filter/);
  assert.match(allText(reviews), /only to customers whose service is complete/);
  assert.match(allText(reviews), /opts out is not contacted again/);
  assert.match(allText(reviewDemo), /Reply STOP to opt out/);
  assert.match(reviewDemo.simulationNote, /Everyone invited receives the same invitation/);
  // The follow-up demo still shows the opt-out and the automatic stop.
  assert.match(allText(followDemo), /STOP to opt out/);
  assert.match(allText(followDemo), /Sequence stopped: customer replied/);
  const both = allText([follow, reviews, followDemo, reviewDemo]);
  assert.doesNotMatch(both, /instant|Acknowledge every|Invite every|every customer/i);
});
