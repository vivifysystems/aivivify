import { SectionHeader } from "./Framework";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import { services } from "@/content";

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
          {services.map((s, i) => (
            <div key={s.id} data-reveal data-reveal-index={i} className="skill-card-wrapper h-72">
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
                    <p className="mt-5 font-display text-xl font-bold">{s.title}</p>
                  </div>
                </div>
                {/* BACK */}
                <div className="skill-card-face skill-card-back glass-strong rounded-2xl p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="font-display text-lg font-bold neon-text">{s.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">{s.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
