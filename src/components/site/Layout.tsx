import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AskVivi } from "./AskVivi";
import { RevealObserver } from "./RevealObserver";

/** Scroll position per history entry, so Back returns to where the visitor was. */
const positions = new Map<string, number>();

/** Waits (a few frames) for something to exist, then runs `then`. */
function whenFound<T>(find: () => T | null | undefined, then: (found: T) => void, frames = 40) {
  let n = 0;
  let raf = 0;
  const tick = () => {
    const found = find();
    if (found) then(found);
    else if (n++ < frames) raf = requestAnimationFrame(tick);
  };
  tick();
  return () => cancelAnimationFrame(raf);
}

function focusQuietly(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/**
 * Orientation on navigation:
 * - forward: scroll to the top (or the #hash target) and move keyboard focus to the new page's
 *   main heading (or the hash target), so Tab continues from the content and screen readers
 *   announce where they are;
 * - Back/Forward: restore the scroll position the visitor left;
 * - the first load and filter-only changes (same path) do nothing.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    // We restore scroll ourselves; the browser's own restoration fights client-side routing.
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  // Remember where the visitor is on this history entry.
  useEffect(() => {
    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.set(key, window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", save);
    };
  }, [key]);

  useEffect(() => {
    const sig = `${pathname}${hash}`;
    const first = previous.current === null;
    const unchanged = previous.current === sig;
    previous.current = sig;
    if (!first && unchanged && type !== "POP") return; // e.g. a filter changed the query string

    const cancels: Array<() => void> = [];
    const saved = type === "POP" ? positions.get(key) : undefined;

    if (saved !== undefined) {
      // Back/Forward: wait until the page is tall enough, then return to the saved spot.
      cancels.push(
        whenFound(
          () => (document.documentElement.scrollHeight >= saved + window.innerHeight ? true : null),
          () => window.scrollTo({ top: saved, left: 0, behavior: "instant" as ScrollBehavior }),
          60,
        ),
      );
      cancels.push(whenFound(() => document.querySelector<HTMLElement>("main h1"), focusQuietly));
    } else if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      cancels.push(
        whenFound(
          () => document.getElementById(id),
          (el) => {
            el.scrollIntoView({ block: "start" });
            if (!first) focusQuietly(el);
          },
        ),
      );
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      if (!first)
        cancels.push(
          whenFound(
            () => document.querySelector<HTMLElement>("main h1") ?? document.getElementById("main"),
            focusQuietly,
          ),
        );
    }
    return () => cancels.forEach((c) => c());
  }, [pathname, hash, key, type]);

  return null;
}

export function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <RevealObserver />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <AskVivi />
    </>
  );
}
