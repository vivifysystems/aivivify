import assert from "node:assert/strict";
import test from "node:test";
import { links } from "./links.ts";
import { projects } from "./projects.ts";
import { formatLastUpdated, privacy, privacySections } from "./privacy.ts";

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
  assert.match(all, /VIVIFY Solutions, operated by Viviene Pitogo/);
  assert.ok(all.includes(links.email.label));
  assert.match(all, /12 months after our last communication/);
  assert.match(all, /by hand, not with an automatic system/);
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

test("Resend is described as operational only once contact delivery is active", () => {
  const pending = text({ contactDelivery: "pending", retentionMonths: 12 });
  const active = text({ contactDelivery: "active", retentionMonths: 12 });
  assert.ok(!/Resend/.test(pending), "pending text must not claim Resend is in use");
  assert.match(pending, /not switched on yet/);
  assert.match(active, /through Resend/);
  assert.ok(!/not switched on yet/.test(active));
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
