import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OG_IMAGE, canonicalUrl, metaForPath } from "@/lib/route-meta";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Applies this route's title, description, canonical URL and link-preview tags from
 * the shared table in src/lib/route-meta.ts (the prerender uses the same table).
 */
export function useRouteMeta({ notFound = false }: { notFound?: boolean } = {}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = notFound ? { ...metaForPath("/__404__"), path: pathname } : metaForPath(pathname);
    document.title = m.title;
    const url = canonicalUrl(m.path);
    setMeta("name", "description", m.description);
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("name", "twitter:title", m.title);
    setMeta("name", "twitter:description", m.description);
    setMeta("name", "twitter:image", OG_IMAGE);
    setMeta("name", "robots", m.noindex ? "noindex" : "index, follow");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (m.noindex) link?.remove();
    else {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = url;
    }
  }, [pathname, notFound]);
}
