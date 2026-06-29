import { SectionHeader } from "./Framework";
import { useStaggerReveal } from "./TiltCard";

const stacks = [
  {
    icon: "⚡",
    group: "Customer Reply Systems",
    blurb: "AI agents that answer Facebook, website, and chat inquiries instantly — 24/7, no staff needed.",
    items: [],
  },
  {
    icon: "🧠",
    group: "Smart Follow-Up",
    blurb: "Automated sequences that chase every lead across email, SMS, and chat so nothing falls through the cracks.",
    items: [],
  },
  {
    icon: "🗄️",
    group: "Bookings & Scheduling",
    blurb: "Voice and chat assistants that book appointments directly into your calendar with zero human involvement.",
    items: [],
  },
  {
    icon: "📡",
    group: "Reports & Data Sync",
    blurb: "Your tools talk to each other automatically — no manual data entry, no missed updates.",
    items: [],
  },
];

export function Skills() {
  useStaggerReveal("#skills [data-reveal]");
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Skills"
          title="What I Build For You"
          sub="Systems that run your business even when your team isn't available."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stacks.map((s, i) => (
            <div
              key={s.group}
              data-reveal
              data-reveal-index={i}
              className="skill-card-wrapper h-72"
            >
              <div className="skill-card-inner">
                {/* FRONT */}
                <div className="skill-card-face skill-card-front glass rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                      0{i + 1}
                    </span>
                    <span className="font-mono-ui text-[9px] uppercase tracking-widest text-primary/70">
                      hover →
                    </span>
                  </div>
                  <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
                    <span className="text-6xl drop-shadow-[0_0_18px_rgba(0,255,65,0.55)]">
                      {s.icon}
                    </span>
                    <p className="mt-5 font-display text-xl font-bold">{s.group}</p>
                  </div>
                </div>
                {/* BACK */}
                <div className="skill-card-face skill-card-back glass-strong rounded-2xl p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="font-display text-lg font-bold neon-text">
                      {s.group}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">
                    {s.blurb}
                  </p>
                  {s.items.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 font-mono-ui text-[10px] uppercase tracking-wider text-primary"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}