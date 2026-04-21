const steps = [
  { letter: "V", title: "Visualize", desc: "Mapping manual bottlenecks into structured blueprints." },
  { letter: "I", title: "Integrate", desc: "Connecting tech stacks (n8n, Make, GHL) into one ecosystem." },
  { letter: "V", title: "Validate", desc: "Stress-testing logic for bulletproof reliability." },
  { letter: "I", title: "Implement", desc: "Deploying custom AI agents into live production." },
  { letter: "F", title: "Flow", desc: "Optimizing for 100% hands-off, seamless operations." },
  { letter: "Y", title: "Yield", desc: "Delivering measurable ROI and hours saved." },
];

export function Framework() {
  return (
    <section id="performance" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Performance" title="The VIVIFY Framework" sub="A 6-step engineering process behind every system I deliver." />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="glass group relative overflow-hidden rounded-2xl p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-7xl font-black leading-none text-primary/90 [text-shadow:0_0_24px_rgba(0,255,65,0.4)]">
                  {s.letter}
                </span>
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">{s.desc}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/60 via-primary/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
        <span className="h-1 w-1 rounded-full bg-primary" /> {kicker}
      </span>
      <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="max-w-2xl text-foreground/60">{sub}</p>}
    </div>
  );
}