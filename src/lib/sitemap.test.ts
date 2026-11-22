/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sitemapXml } from "./sitemap.ts";

test("public/sitemap.xml matches the content (run npm run sitemap)", () => {
  const onDisk = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
  assert.equal(onDisk, sitemapXml());
});
