import { useEffect, useRef } from "react";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.15 - Math.random() * 0.35,
        r: Math.random() * 1.6 + 0.4,
        a: 0.05 + Math.random() * 0.1,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 65, ${p.a})`;
        ctx.shadowColor = "rgba(0, 255, 65, 0.6)";
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="top" className="relative h-screen min-h-[680px] w-full overflow-hidden">
      {/* Animated neon particle background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full"
      />
      {/* Overlays */}
      <div className="absolute inset-0 z-0 grid-bg opacity-25" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.85)_90%)]" />
      <div className="scanline absolute inset-0 z-0 overflow-hidden" />

      {/* Bottom gradient to mask video watermark and improve scroll cue readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-[#0a0a0a]/70 to-[#0a0a0a]" />

      {/* Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--neon)]" />
          AI Automation Engineer · Online
        </div>

        <h1
          data-text="VIVIENE"
          className="glitch font-display text-[clamp(4rem,16vw,12rem)] font-black leading-none tracking-tighter [text-shadow:0_4px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.8)]"
        >
          VIVIENE
        </h1>

        <p className="mt-6 max-w-2xl font-display text-lg text-foreground sm:text-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
          Turning <span className="neon-text">Complex Workflows</span> into Intelligent Systems.
        </p>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/85 sm:text-base [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
          I build custom AI agents and automated pipelines that reclaim{" "}
          <span className="neon-text font-semibold">20+ hours of your week</span>. Scalable,
          high-ROI solutions for modern businesses using n8n, Make, and Zapier.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://calendly.com/vivienecreates/automation-discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(0,255,65,0.45)] transition-transform hover:scale-105"
            >
              Book a Free Discovery Call
              <span aria-hidden>→</span>
            </a>
            <a
              href="#projects"
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
            >
              View Projects
            </a>
          </div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.25em] text-foreground/65 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
            Let's map out your automation roadmap in 15 minutes.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono-ui text-[10px] uppercase tracking-[0.4em] text-foreground/50">
        ↓ scroll
      </div>
    </section>
  );
}