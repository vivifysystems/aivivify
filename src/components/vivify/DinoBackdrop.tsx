import dinoVideo from "/dino.mp4?url";

/**
 * Ghostly dinosaur video backdrop. Uses mix-blend-mode: screen + filter to
 * key out the green-screen background and blend into the dark theme.
 */
export function DinoBackdrop({
  side = "right",
  flip = false,
}: {
  side?: "left" | "right";
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <video
        src={dinoVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="dino-video absolute bottom-0 h-[60%] w-auto max-w-none opacity-60"
        style={{
          [side]: "-4%",
          transform: flip ? "scaleX(-1)" : undefined,
        } as React.CSSProperties}
      />
      {/* Vignette to blend further */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />
    </div>
  );
}