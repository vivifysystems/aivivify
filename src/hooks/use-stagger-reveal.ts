import { useEffect } from "react";

/** Adds a staggered fade-in-up to elements matching `selector` as they scroll into view. */
export function useStaggerReveal(selector = "[data-reveal]") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = Number(el.dataset.revealIndex ?? 0);
            el.style.transitionDelay = `${Math.min(i * 90, 600)}ms`;
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}
