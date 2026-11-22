// Shared helpers for the browser tests (Playwright driving a locally served build).
// BASE_URL points the suite at any running server (used to reproduce defects on the
// pre-fix build); otherwise the freshly built ./dist is served with SPA fallback.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { existsSync, readdirSync } from "node:fs";
import { chromium } from "playwright-core";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

export const VIEWPORTS = {
  320: { width: 320, height: 568 },
  375: { width: 375, height: 667 },
  390: { width: 390, height: 844 },
  768: { width: 768, height: 1024 },
  "1024x640": { width: 1024, height: 640 },
  "1280x720": { width: 1280, height: 720 },
  1440: { width: 1440, height: 900 },
};

async function fileOrNull(p) {
  try {
    return (await stat(p)).isFile() ? p : null;
  } catch {
    return null;
  }
}

/** Static server with SPA fallback. The optional `api` handler stands in for /api routes. */
export async function startStatic(dir, api) {
  const root = normalize(dir);
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    if (api && url.pathname.startsWith("/api/")) return api(req, res, url);
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    const hit =
      (await fileOrNull(join(root, rel))) ?? (await fileOrNull(join(root, rel, "index.html")));
    const target = hit ?? join(root, "index.html");
    res.writeHead(200, { "content-type": types[extname(target)] ?? "application/octet-stream" });
    res.end(await readFile(target));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return { url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) };
}

export const distDir = fileURLToPath(new URL("../dist/", import.meta.url));

function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const cache = join(homedir(), "Library/Caches/ms-playwright");
  if (!existsSync(cache)) return undefined; // fall back to Playwright's own download
  const shell = readdirSync(cache)
    .filter((d) => d.startsWith("chromium_headless_shell-"))
    .sort()
    .pop();
  if (!shell) return undefined;
  const dir = join(cache, shell);
  const arch = readdirSync(dir).find((d) => d.startsWith("chrome-headless-shell"));
  return join(dir, arch, "chrome-headless-shell");
}

export async function launch() {
  return chromium.launch({ executablePath: chromiumPath() });
}

/** A fresh page in its own context. `touch` emulates a phone (touch events, mobile viewport). */
export async function newPage(browser, viewport, opts = {}) {
  const ctx = await browser.newContext({
    viewport,
    reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
    hasTouch: Boolean(opts.touch),
    isMobile: Boolean(opts.touch),
    deviceScaleFactor: opts.touch ? 2 : 1,
    serviceWorkers: "block",
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  return page;
}

/** No horizontal overflow: the document must fit the viewport width. */
export async function docOverflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}
