import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { usePrefersReducedMotion } from "./use-motion-preferences";

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown };

/**
 * onClick handler for internal links that animates the page change with the View
 * Transitions API where supported (shared elements use `view-transition-name`).
 * Falls back to a normal navigation; skipped for reduced motion and modified clicks.
 */
export function useViewTransitionLink(to: string) {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const doc = document as DocWithVT;
      if (reduced || !doc.startViewTransition) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      e.preventDefault();
      doc.startViewTransition(() => flushSync(() => navigate(to)));
    },
    [navigate, reduced, to],
  );
}
