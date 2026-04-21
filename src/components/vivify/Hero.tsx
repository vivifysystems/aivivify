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

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
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

        <p className="mt-4 max-w-xl font-mono-ui text-xs text-foreground/75 uppercase tracking-[0.25em] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
          n8n · Make · GHL · Supabase · Gemini · OpenAI
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(0,255,65,0.45)] transition-transform hover:scale-105"
          >
            View Projects
            <span aria-hidden>→</span>
          </a>
          <a
            href="#performance"
            className="glass inline-flex items-center gap-2 rounded-full px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
          >
            The VIVIFY Framework
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono-ui text-[10px] uppercase tracking-[0.4em] text-foreground/50">
        ↓ scroll
      </div>
    </section>
  );
}