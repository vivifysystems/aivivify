// The primary canonical address is https://www.vivify.solutions (owner decision 2026-11-22).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { sitemapXml } from "../lib/sitemap.ts";
import { OG_IMAGE, SITE_URL, canonicalUrl } from "../lib/route-meta.ts";
import * as mcp from "../lib/mcp/data.ts";
import { brand } from "./brand.ts";
import { links } from "./links.ts";

const fromRoot = (p: string) => new URL(`../../${p}`, import.meta.url);

test("the primary canonical address is https://www.vivify.solutions", () => {
  assert.equal(brand.url, "https://www.vivify.solutions");
  assert.equal(SITE_URL, brand.url);
  assert.equal(links.website.href, brand.url);
  assert.equal(OG_IMAGE, `${brand.url}/og/vivify-og.png`);
  assert.equal(mcp.about.site, brand.url);
  assert.equal(mcp.contact.website, brand.url);
  assert.ok(sitemapXml().includes(`<loc>${brand.url}/</loc>`));
  assert.equal(canonicalUrl("/work"), `${brand.url}/work`);
});

test("no public file names the apex host as an address (email addresses are fine)", () => {
  const apex = /https?:\/\/vivify\.solutions/;
  for (const f of [
    "index.html",
    "public/robots.txt",
    "public/sitemap.xml",
    "src/content/brand.ts",
    "src/content/links.ts",
    "src/lib/route-meta.ts",
    "src/lib/sitemap.ts",
  ]) {
    assert.ok(!apex.test(readFileSync(fromRoot(f), "utf8")), `${f} still uses the apex host`);
  }
  const html = readFileSync(fromRoot("index.html"), "utf8");
  assert.ok(html.includes(`<link rel="canonical" href="${brand.url}/" />`));
  assert.ok(html.includes(`content="${brand.url}/og/vivify-og.png"`));
  assert.ok(existsSync(fromRoot("public/og/vivify-og.png")));
});
