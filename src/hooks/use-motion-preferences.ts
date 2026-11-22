import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * True when the visitor asked their OS/browser to reduce motion. Updates live if
 * the setting changes. Without a DOM (e.g. pre-rendering) it returns true, so the
 * static version is rendered first and motion is added only on the client.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

const noopSubscribe = () => () => {};

/**
 * True when the browser reports the Data Saver / "Save-Data" preference.
 * Like the hook above, it assumes "save data" when there is no DOM.
 */
export function useSaveData(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      ),
    () => true,
  );
}

/** Flips to true (once) when the element comes within `rootMargin` of the viewport. */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "300px"): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}
