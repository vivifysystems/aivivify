import { useRef, type CSSProperties } from "react";
import {
  useNearViewport,
  usePrefersReducedMotion,
  useSaveData,
} from "@/hooks/use-motion-preferences";

const DINO_VIDEO = "/videos/dino-480.mp4";

/**
 * Ghostly dinosaur video backdrop. Uses mix-blend-mode: screen + filter to
 * key out the green-screen background and blend into the dark theme.
 *
 * The video is only requested when the section is near the viewport, and never
 * for reduced-motion or data-saver visitors (it is purely decorative).
 */
export function DinoBackdrop({
  side = "right",
  flip = false,
}: {
  side?: "left" | "right";
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  const reducedMotion = usePrefersReducedMotion();
  const saveData = useSaveData();
  const showVideo = near && !reducedMotion && !saveData;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {showVideo && (
        <video
          src={DINO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="dino-video absolute bottom-0 h-[60%] w-auto max-w-none opacity-60"
          style={
            {
              [side]: "-4%",
              transform: flip ? "scaleX(-1)" : undefined,
            } as CSSProperties
          }
        />
      )}
      {/* Vignette to blend further */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />
    </div>
  );
}
