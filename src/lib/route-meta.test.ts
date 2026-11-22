/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { headTags, metaForPath } from "./route-meta.ts";
import { sitemapPaths } from "./sitemap.ts";

test("every sitemap route has indexable, unique metadata", () => {
  const titles = new Set<string>();
  for (const p of sitemapPaths()) {
    const m = metaForPath(p);
    assert.equal(m.noindex, false, `${p} is noindex`);
    assert.ok(m.description.length > 30, `${p} has a weak description`);
    assert.ok(!titles.has(m.title), `${p} duplicates title "${m.title}"`);
    titles.add(m.title);
  }
});

test("unknown paths are noindex with no canonical", () => {
  for (const p of ["/nope", "/systems/nope", "/work/nope"]) {
    const m = metaForPath(p);
    assert.equal(m.noindex, true);
    assert.ok(!headTags(m).includes("canonical"));
  }
  assert.equal(metaForPath("/solutions/").path, "/solutions");
});

test("head tags escape content", () => {
  const html = headTags({ title: 'A "b" <c>', description: "x & y", path: "/", noindex: false });
  assert.ok(html.includes("A &quot;b&quot; &lt;c&gt;"));
  assert.ok(html.includes("x &amp; y"));
});
