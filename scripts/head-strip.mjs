// Removes the template's default per-page <head> tags so each prerendered page can carry its own.
// Matches tags however Prettier wrapped them (attributes on one line or several).
export function stripDefaultHead(template) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, "<!--head-->")
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/, "")
    .replace(/\s*<meta\s+property="og:(title|description|url|image)"[\s\S]*?\/>/g, "")
    .replace(/\s*<meta\s+name="twitter:(title|description|image)"[\s\S]*?\/>/g, "");
}
