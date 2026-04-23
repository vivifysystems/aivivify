import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./Framework";
import portrait from "@/assets/viviene-portrait.png";

const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

const milestones = [
  {
    label: "2021–2024",
    title: "Computer Engineering Foundations",
    desc: "Built projects in C/C++, SQL, Arduino, and PHP/MySQL — including an RFID-based voting system as a capstone.",
  },
  {
    label: "Early 2025",
    title: "AI Automation Deep Dive",
    desc: "Completed certifications in Make.com, Zapier, n8n, and HighLevel CRM through TechVA by Kuya RJ (AI Automation PH).",
  },
  {
    label: "Mid 2025",
    title: "First Production Systems",
    desc: "Deployed real automation workflows for family businesses — catering order intake, AI customer support, and knowledge base pipelines.",
  },
  {
    label: "Now",
    title: "VIVIFY Automation",
    desc: "Building and scaling intelligent systems for e-commerce brands and marketing agencies worldwide.",
    active: true,
  },
];

const funFacts = [
  "My spirit animal is a friendly dinosaur. (P.S. you might meet him on our call!)",
  "I once built a full order management system for a catering business using only no-code tools.",
  "I test new AI models the way some people test new restaurants — constantly.",
  "I believe the best automations are the ones you forget are running.",
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function StatCards() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hours = useCountUp(20, 1500, visible);
  const systems = useCountUp(7, 1500, visible);

  return (
    <div ref={ref} className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="glass rounded-2xl p-6 text-center">
        <p className="font-display text-5xl font-black text-primary [text-shadow:0_0_24px_rgba(0,255,65,0.5)]">
          {hours}+
        </p>
        <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          Hours Saved Per Client, Per Week
        </p>
      </div>
      <div className="glass rounded-2xl p-6 text-center">
        <p className="font-display text-5xl font-black text-primary [text-shadow:0_0_24px_rgba(0,255,65,0.5)]">
          {systems}
        </p>
        <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          Production Systems Deployed
        </p>
      </div>
      <div className="glass rounded-2xl p-6 text-center">
        <p className="animate-pulse font-display text-5xl font-black text-primary [text-shadow:0_0_24px_rgba(0,255,65,0.6)]">
          24/7
        </p>
        <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          Hands-Off Operation
        </p>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        {/* [A] Heading */}
        <SectionHeader
          kicker="About"
          title="Turning Chaos into Intelligent Systems"
          sub="The story behind VIVIFY Automation"
        />

        {/* [B] Intro Two-Column */}
        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div className="relative mx-auto w-full max-w-sm md:mx-0">
            <div className="absolute -inset-4 animate-pulse rounded-3xl bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.3),transparent_70%)] blur-2xl" />
            <div className="glass relative overflow-hidden rounded-3xl p-2 shadow-[0_0_40px_rgba(0,255,65,0.25)] ring-1 ring-primary/40">
              <img
                src={portrait}
                alt="Portrait of Viviene Pitogo, Automation Engineer"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
            <div className="mt-4 text-center font-mono-ui text-[10px] uppercase tracking-[0.35em] text-primary">
              Viviene Pitogo · Automation Engineer
            </div>
          </div>

          <article className="glass rounded-2xl p-8 sm:p-10">
            <h3 className="font-display text-2xl leading-snug sm:text-3xl">
              Hi, I'm <span className="neon-text">Viviene</span> — but you can call me Vivi.
            </h3>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">
              I'm an Automation Engineer obsessed with transforming complex, time-consuming workflows into seamless, intelligent systems. My mission is to help founders reclaim valuable time — so they can stop doing the $10/hour work and get back to leading their business.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              I graduated with a degree in Computer Engineering (CTE-Danao, 2025) and immediately went all-in on AI automation. What started as curiosity quickly became a full obsession: I haven't stopped building since.
            </p>
          </article>
        </div>

        {/* [C] The Spark */}
        <article className="mt-16 border-l-2 border-primary pl-6 sm:pl-8">
          <h3 className="font-display text-3xl font-bold">
            Why <span className="neon-text">Automation</span>?
          </h3>
          <p className="mt-4 max-w-3xl text-lg italic leading-relaxed text-foreground/80">
            Watching small business owners spend hours on repetitive tasks that a well-built system could handle in seconds — that's what ignited this for me. I grew up around family businesses: a lechon catering service, a convenience store, a computer café. I saw firsthand how much time gets burned on things that don't actually grow the business. Automation isn't just a career for me — it's a solution I believe in.
          </p>
        </article>

        {/* [D] Timeline */}
        <div className="mt-20">
          <h3 className="font-display text-3xl font-bold">How I Got Here</h3>
          <div className="relative mt-8 -mx-6 overflow-x-auto px-6 pb-4 md:mx-0 md:overflow-visible md:px-0">
            <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10 md:block" />
            <ol className="flex min-w-max gap-5 md:grid md:min-w-0 md:grid-cols-4 md:gap-6">
              {milestones.map((m) => (
                <li key={m.label} className="relative w-72 shrink-0 md:w-auto">
                  <div className="flex justify-center">
                    <span
                      className={`relative z-10 block h-4 w-4 rounded-full border-2 border-primary bg-background ${
                        m.active ? "shadow-[0_0_20px_var(--neon)]" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`glass mt-5 rounded-2xl p-5 transition-all hover:-translate-y-1 ${
                      m.active ? "border-primary/70 shadow-[0_0_30px_rgba(0,255,65,0.3)]" : ""
                    }`}
                  >
                    <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                      {m.label}
                    </p>
                    <h4 className="mt-2 font-display text-lg font-bold">{m.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/65">{m.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* [E] Stats */}
        <div className="mt-20">
          <h3 className="font-display text-3xl font-bold">VIVIFY in Numbers</h3>
          <StatCards />
        </div>

        {/* [F] Beyond the Code */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <article className="glass rounded-2xl p-8">
            <h3 className="font-display text-3xl font-bold">Beyond the Code</h3>
            <p className="mt-4 leading-relaxed text-foreground/80">
              When I'm not building automation systems, I'm probably tinkering with a new AI model, watching how businesses run (and imagining how they could run better), or spending time with family over a good lechon feast.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/80">
              I'm endlessly curious — about tech, about people, and about the gap between the two.
            </p>
          </article>
          <ul className="flex flex-col gap-3">
            {funFacts.map((f) => (
              <li
                key={f}
                className="glass flex items-start gap-3 rounded-full px-5 py-3 text-sm text-foreground/85"
              >
                <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--neon)]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* [H] CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-mono-ui text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(0,255,65,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,255,65,0.7)]"
          >
            Let's Architect Your Intelligent System
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}