// The Winged V brand assets (owner-approved, licence confirmed by the owner 2026-11-22).
// Only the clean, final assets ship. Concept boards, the reference raster and licence
// documents stay private (brand-private/, outside Git).
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const fromRoot = (p: string) => new URL(`../../${p}`, import.meta.url);
const png = (p: string) => {
  const b = readFileSync(fromRoot(p));
  assert.equal(b.subarray(1, 4).toString(), "PNG", `${p} is not a PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

test("only the final logo assets are in public/brand", () => {
  assert.deepEqual(readdirSync(fromRoot("public/brand")).sort(), [
    "vivify-mark-512.png",
    "vivify-mark.svg",
  ]);
});

test("the SVG marks are clean: no script, no external reference, no embedded raster", () => {
  for (const f of ["public/brand/vivify-mark.svg", "public/favicon.svg"]) {
    const s = readFileSync(fromRoot(f), "utf8");
    assert.ok(s.startsWith("<svg"), `${f} does not start with <svg`);
    assert.ok(
      !/<script|<image|<foreignObject|href=["']https?:|xlink:href/i.test(s),
      `${f} has a forbidden element`,
    );
    assert.ok(/<linearGradient/.test(s) && /<path/.test(s), `${f} lost its paths or gradients`);
    assert.ok(s.length < 12_000, `${f} is unexpectedly large (${s.length} bytes)`);
  }
});

test("favicon, touch icon, social image and structured-data logo exist with the right sizes", () => {
  assert.ok(existsSync(fromRoot("public/favicon.ico")));
  assert.deepEqual(png("public/apple-touch-icon.png"), { w: 180, h: 180 });
  assert.deepEqual(png("public/og/vivify-og.png"), { w: 1200, h: 630 });
  const m = png("public/brand/vivify-mark-512.png");
  assert.equal(m.h, 512);
  const ico = readFileSync(fromRoot("public/favicon.ico"));
  assert.equal(ico.readUInt16LE(2), 1, "not an ICO");
  assert.equal(ico.readUInt16LE(4), 3, "expected 16, 32 and 48 px images");
});

test("index.html links the new icons and logo, and the old mark is gone", () => {
  const html = readFileSync(fromRoot("index.html"), "utf8");
  assert.ok(html.includes('href="/favicon.svg"'));
  assert.ok(html.includes('href="/favicon.ico"'));
  assert.ok(html.includes('rel="apple-touch-icon" href="/apple-touch-icon.png"'));
  const ld = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1],
  );
  assert.equal(ld.logo, "https://www.vivify.solutions/brand/vivify-mark-512.png");
  assert.ok(!existsSync(fromRoot("public/assets/vivi/avatars/vivify-v-mark.webp")));
  const header = readFileSync(fromRoot("src/components/site/Header.tsx"), "utf8");
  assert.ok(header.includes('src="/brand/vivify-mark.svg"'));
  assert.ok(!/vivify-v-mark/.test(header));
});

test("no concept board, reference, licence or private file is in public/", () => {
  const walk = (dir: string): string[] =>
    readdirSync(fromRoot(dir), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
    );
  for (const f of walk("public")) {
    assert.ok(
      !/board|reference|licen[cs]e|owner-approved|brand-private|source\//i.test(f),
      `${f} looks private`,
    );
  }
});
