import { useEffect } from "react";

/**
 * Adds `.is-in` to every `[data-reveal]` element once it scrolls into view,
 * including elements rendered later (route changes, lazy pages, filters).
 * Elements may set `style={{ "--reveal-i": n }}` to stagger.
 */
export function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = (root: ParentNode) =>
      root.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches("[data-reveal]:not(.is-in)")) io.observe(n);
            scan(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
