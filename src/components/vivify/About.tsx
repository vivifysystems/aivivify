import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./Framework";
import portrait from "@/assets/viviene-portrait.png";

const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

const milestones = [
  {
    year: "2021",
    title: "First Workflow",
    desc: "Stitched together my first Zapier flow to kill repetitive admin work — and never looked back.",
  },
  {
    year: "2023",
    title: "Going Deep on n8n & Make",
    desc: "Moved from no-code to low-code: building branching logic, error handling, and self-healing pipelines.",
  },
  {
    year: "2024",
    title: "AI-Native Systems",
    desc: "Started shipping LLM-powered agents with RAG, vector stores, and voice — replacing entire roles, not just tasks.",
  },
  {
    year: "2025",
    title: "VIVIFY Automation",
    desc: "Launched VIVIFY to help founders turn operational chaos into 24/7 intelligent systems.",
  },
];

const stats = [
  { k: 20, suffix: "+", v: "Hrs / week reclaimed" },
  { k: 7, suffix: "", v: "Production systems" },
  { k: 24, suffix: "/7", v: "Hands-off operation" },
];

const funFacts = [
  "I once built a fully automated coffee brewing system.",
  "My spirit animal is a friendly dinosaur (you might meet him on our call!).",
  "I'm constantly experimenting with new AI models to push the boundaries of what's possible.",
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLParagraphElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <p ref={ref} className="font-display text-4xl font-black text-primary [text-shadow:0_0_18px_rgba(0,255,65,0.45)]">
      {n}
      {suffix}
    </p>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-28">
      {/* Cinematic dark-themed background video */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-black/70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.9)_95%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader
          kicker="About"
          title="Turning Chaos into Intelligent Systems: My Journey"
          sub="A human behind every workflow. A system behind every result."
        />

        {/* Portrait + intro */}
        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div className="relative mx-auto w-full max-w-sm md:mx-0">
            {/* animated circuit-style backdrop */}
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,65,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(0,255,65,0.18),transparent_65%)] blur-2xl" />
            <div
              aria-hidden
              className="absolute -inset-2 rounded-3xl opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,255,65,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.18) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage:
                  "radial-gradient(circle at center, black 55%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 55%, transparent 80%)",
              }}
            />
            <div className="glass relative overflow-hidden rounded-3xl p-2">
              <img
                src={portrait}
                alt="Portrait of Viviene Pitogo, Automation Engineer behind VIVIFY Automation"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-auto w-full rounded-2xl object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/30" />
            </div>
            <div className="mt-4 text-center font-mono-ui text-[10px] uppercase tracking-[0.35em] text-primary">
              Viviene Pitogo · Automation Engineer
            </div>
          </div>

          <div className="glass rounded-2xl p-8 sm:p-10">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              I'm <span className="neon-text">Viviene</span>, an Automation Engineer obsessed
              with transforming complex, time-consuming workflows into seamless,{" "}
              <span className="text-primary">intelligent systems</span>.
            </p>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">
              My mission is to empower founders like you to reclaim valuable time and focus on
              the <em>"big work"</em> that truly drives your business forward — while your
              operations run themselves in the background.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.v}
                  className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(0,255,65,0.25)]"
                >
                  <CountUp to={s.k} suffix={s.suffix} />
                  <p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Spark */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
              The Spark
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold">Why Automation?</h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              It started with a brutal Monday: hundreds of attachments to rename, sort, and
              reply to. I lost an entire day to clicks. That night I built my first automation
              — and watched it do eight hours of work in eight minutes. Since then I've believed
              the same thing: <span className="text-primary">humans should architect systems, not babysit them.</span>{" "}
              Automation isn't about replacing people — it's about freeing them to do the work
              that actually matters.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
              Beyond the Code
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold">A Glimpse Into My World</h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              When I'm not architecting intelligent systems, you'll find me chasing sunrises on
              new hiking trails, deep in a sci-fi novel, or tinkering with smart-home gadgets.
              Curiosity is the engine — automation is just where I aim it.
            </p>
            <ul className="mt-5 space-y-2">
              {funFacts.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-foreground/85"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-primary shadow-[0_0_6px_var(--neon)]" />
                  <span>
                    {f}
                    {f.includes("dinosaur") && (
                      <span className="dino-float ml-2" title="Rawr! 🦖" aria-label="friendly dinosaur">
                        🦖
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Professional evolution timeline */}
        <div className="mt-16">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
            Professional Evolution
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            From manual clicks to autonomous systems
          </h3>

          <div className="relative mt-10">
            <div
              aria-hidden
              className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/70 via-primary/30 to-transparent md:left-1/2"
            />
            <ol className="space-y-10">
              {milestones.map((m, i) => (
                <li
                  key={m.year}
                  className={`relative grid gap-4 md:grid-cols-2 md:gap-12 ${
                    i % 2 === 0 ? "" : "md:[&>div:first-child]:order-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute left-4 top-2 -translate-x-1/2 rounded-full bg-primary p-1.5 shadow-[0_0_14px_var(--neon)] md:left-1/2"
                  >
                    <span className="block h-2 w-2 rounded-full bg-background" />
                  </span>
                  <div className="pl-10 md:pl-0 md:text-right md:pr-12">
                    <p className="font-display text-3xl font-black text-primary">{m.year}</p>
                  </div>
                  <div className="glass rounded-2xl p-5 md:ml-12">
                    <p className="font-display text-lg font-bold">{m.title}</p>
                    <p className="mt-2 text-sm text-foreground/75">{m.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-mono-ui text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(0,255,65,0.45)] transition-transform hover:scale-105"
          >
            Let's Architect Your Intelligent System <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}