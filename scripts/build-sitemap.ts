// Writes public/sitemap.xml from canonical content. Run: npm run sitemap
// A test (src/content/sitemap.test.ts) fails if the file drifts from content.
import { writeFileSync } from "node:fs";
import { sitemapXml } from "../src/lib/sitemap.ts";

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), sitemapXml());
console.log("public/sitemap.xml written");
