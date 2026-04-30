import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./Framework";
import portrait from "@/assets/viviene-portrait.png";

const CALENDLY = "https://calendly.com/vivienecreates/automation-discovery-call";

const stats = [
  { k: 20, suffix: "+", v: "Hrs / week reclaimed" },
  { k: 7, suffix: "", v: "Production systems" },
  { k: 24, suffix: "/7", v: "Hands-off operation" },
];

function CountUp({ to, suffix = "", animate = true }: { to: number; suffix?: string; animate?: boolean }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [n, setN] = useState(animate ? 0 : to);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!animate) {
      setN(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
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
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    // Safety fallback: if observer never fires within 3s, just set the value.
    const fallback = window.setTimeout(() => {
      if (!startedRef.current) {
        setN(to);
      }
    }, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [to, animate]);
  return (
    <p ref={ref} className="font-display text-4xl font-black text-primary [text-shadow:0_0_18px_rgba(0,255,65,0.45)]">
      {n}
      {suffix}
    </p>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
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
              Viviene Pitogo · AI Automation Specialist
            </div>
          </div>

          <div className="glass rounded-2xl p-8 sm:p-10">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              I'm <span className="neon-text">Viviene</span>, a Computer Engineering graduate
              turned <span className="text-primary">AI Automation Specialist</span>.
            </p>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">
              Before I ever touched n8n or Make, I was writing code in C++ and building
              embedded systems. That programming foundation is what separates the workflows I
              build from ones that break under pressure.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              I started with my own family's businesses — a catering operation and a computer
              café — and turned their manual chaos into systems that run without them. Now I
              build those same systems for founders who are done doing it manually.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.v}
                  className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(0,255,65,0.25)]"
                >
                  <CountUp to={s.k} suffix={s.suffix} animate={s.suffix !== "/7"} />
                  <p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
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