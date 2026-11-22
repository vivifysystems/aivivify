import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { stripDefaultHead } from "./head-strip.mjs";

test("the real index.html template keeps none of its default per-page tags after stripping", () => {
  const out = stripDefaultHead(readFileSync(new URL("../index.html", import.meta.url), "utf8"));
  for (const re of [
    /name="description"/,
    /rel="canonical"/,
    /property="og:(title|description|url|image)"/,
    /name="twitter:(title|description|image)"/,
    /<title>/,
  ])
    assert.ok(!re.test(out), `${re} survived stripping`);
  assert.ok(out.includes("<!--head-->"), "the head placeholder is in place");
  assert.ok(out.includes("application/ld+json"), "structured data is kept");
});
