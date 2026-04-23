export function Hero() {
  return (
    <section id="top" className="relative h-screen min-h-[680px] w-full overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster=""
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.85)_90%)]" />
      <div className="scanline absolute inset-0 overflow-hidden" />

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
              rel="noreferrer"
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