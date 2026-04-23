import { SectionHeader } from "./Framework";
import { TiltCard, useStaggerReveal } from "./TiltCard";

const steps = [
  {
    n: "01",
    title: "Audit",
    desc: "We map your manual bottlenecks and identify high-impact automation opportunities.",
  },
  {
    n: "02",
    title: "Build",
    desc: "I develop, stress-test, and deploy your custom AI agents and logic flows.",
  },
  {
    n: "03",
    title: "Scale",
    desc: "24/7 automation begins, reclaiming your time while your business scales effortlessly.",
  },
];

export function Process() {
  useStaggerReveal("#process [data-reveal]");
  return (
    <section id="process" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Process"
          title="The VIVIFY Process: From Chaos to Clarity"
          sub="A focused 3-step engagement designed to turn operational drag into measurable leverage."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <TiltCard
              key={s.n}
              data-reveal
              data-reveal-index={i}
              className="glass group relative overflow-hidden rounded-2xl p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-6xl font-black leading-none text-primary [text-shadow:0_0_24px_rgba(0,255,65,0.45)]">
                  {s.n}
                </span>
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  Step
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">{s.desc}</p>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-primary/60 via-primary/10 to-transparent" />
              {i < steps.length - 1 && (
                <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 font-mono-ui text-xs text-primary/40 md:inline">
                  →
                </span>
              )}
            </TiltCard>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://calendly.com/vivienecreates/automation-discovery-call"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-transform hover:scale-105"
          >
            Book a Discovery Call <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}