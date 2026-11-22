import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { links } from "./links.ts";
import { projects } from "./projects.ts";
import { contactFormActive, formatLastUpdated, privacy, privacySections } from "./privacy.ts";

const text = (state: Parameters<typeof privacySections>[0] = privacy, rec?: boolean) =>
  privacySections(state, rec)
    .flatMap((s) => [s.title, ...s.paragraphs])
    .join("\n");

test("the privacy policy contains no instruction addressed to the site owner", () => {
  const all = text();
  assert.ok(!/reviewed before launch/i.test(all));
  assert.ok(!/jurisdiction requires/i.test(all));
  assert.ok(!/\b(TODO|TBD|placeholder)\b/i.test(all));
});

test("the policy names the operator, the contact address, the retention period and the date", () => {
  const all = text();
  assert.match(all, /VIVIFY Solutions, operated by Viviene Pitogo from the Philippines/);
  assert.ok(all.includes(links.email.label));
  assert.match(all, /We don.t run an automatic deletion system/);
  assert.match(all, /sell, rent or disclose/);
  assert.match(all, /don.t keep a separate inquiry database or notes/);
  assert.equal(formatLastUpdated("2026-11-22"), "22 November 2026");
  assert.match(privacy.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);
});

test("the policy covers every provider the site actually uses", () => {
  const all = text();
  for (const name of [
    "Vercel",
    "Calendly",
    "Google",
    "Supabase",
    "session storage",
    "National Privacy Commission",
  ]) {
    assert.ok(all.includes(name), `the policy never mentions ${name}`);
  }
});

test("Resend and the form's data are described only once contact delivery is active", () => {
  const pending = text({ contactDelivery: "pending", retentionMonths: null });
  const active = text({ contactDelivery: "active", retentionMonths: null });
  assert.ok(!/Resend/.test(pending), "pending text must not claim Resend is in use");
  assert.match(pending, /There is no online contact form on this site at the moment/);
  assert.match(pending, /will name our email provider before any online form is switched on/);
  assert.ok(
    !/name, email address, the business name|spam-check|send the contact form/.test(pending),
    "pending text must not describe form data",
  );
  assert.match(active, /through Resend/);
  assert.match(active, /name, email address, the business name/);
  assert.ok(!/There is no online contact form/.test(active));
});

test("the launch default is the safe one: delivery pending until Resend is configured", () => {
  assert.equal(privacy.contactDelivery, "pending");
});

test("the recordings paragraph appears only when a published case study has a recording", () => {
  assert.equal(
    /Demo recordings/.test(text(privacy)),
    projects.some((p) => p.demoUrl),
  );
  assert.match(text(privacy, true), /Google Drive/);
  assert.ok(!/Demo recordings/.test(text(privacy, false)));
});

test("no unconditional promise of automatic deletion", () => {
  assert.ok(!/automatically delete/i.test(text()));
});

test("no deletion schedule is promised until the owner commits to one", () => {
  assert.equal(privacy.retentionMonths, null);
  const now = text();
  assert.ok(!/\b12 months\b/.test(now) && !/we aim to delete/i.test(now));
  assert.match(now, /we don.t promise a deletion schedule/);
  // The prepared wording for when the owner commits (not live).
  const committed = text({ contactDelivery: "pending", retentionMonths: 12 });
  assert.match(committed, /we aim to delete the emails 12 months after our last communication/);
});

test("the recordings clause is gone from the provider list while no recording is published", () => {
  assert.ok(!/demo recordings/i.test(text(privacy, false)));
  assert.match(text(privacy, true), /Google also serves demo recordings/);
});

test("the switch is committed as pending, and its test mode is never used by a production build", () => {
  const src = readFileSync(new URL("./privacy.ts", import.meta.url), "utf8");
  assert.match(src, /const CONTACT_DELIVERY: ContactDelivery = "pending";/);
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  for (const name of ["build", "build:prerender"])
    assert.ok(!/e2e-contact-active/.test(pkg.scripts[name]), `${name} must not use the test mode`);
  assert.ok(
    !/e2e-contact-active/.test(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8")),
  );
  assert.equal(contactFormActive, false);
});
