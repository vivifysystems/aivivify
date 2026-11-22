// Local emulation of static hosting with clean URLs and a real 404 status, for
// checking a prerendered build (npm run build:prerender). Not used in production.
// Usage: node scripts/serve-static.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const port = Number(process.argv[2] ?? 4174);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

async function file(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = [join(dist, rel), join(dist, rel, "index.html"), join(dist, `${rel}.html`)];
  for (const c of candidates) {
    const f = await file(c);
    if (f) {
      res.writeHead(200, { "content-type": types[extname(f)] ?? "application/octet-stream" });
      return res.end(await readFile(f));
    }
  }
  res.writeHead(404, { "content-type": types[".html"] });
  res.end(await readFile(join(dist, "404.html")));
}).listen(port, () => console.log(`static preview on http://localhost:${port}`));
