import { SectionHeader } from "./Framework";
import portrait from "@/assets/viviene-portrait.png";

export function About() {
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="About"
          title="Why VIVIFY Automation?"
          sub="A human behind every workflow. A system behind every result."
        />

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div className="relative mx-auto w-full max-w-sm md:mx-0">
            <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.25),transparent_70%)] blur-2xl" />
            <div className="glass relative overflow-hidden rounded-3xl p-2">
              <img
                src={portrait}
                alt="Stylized neon portrait of Viviene Pitogo, Automation Engineer"
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

          <div className="glass rounded-2xl p-8 sm:p-10">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              I'm <span className="neon-text">Viviene</span>, an Automation Engineer obsessed
              with efficiency.
            </p>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">
              I don't just build workflows — I build{" "}
              <span className="text-primary">digital employees that never sleep</span>. My
              mission is to help founders stop doing <em>"busy work"</em> so they can focus on{" "}
              <em>"big work"</em>.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: "20+", v: "Hrs / week reclaimed" },
                { k: "7", v: "Production systems" },
                { k: "24/7", v: "Hands-off operation" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-center"
                >
                  <p className="font-display text-2xl font-bold text-primary">{s.k}</p>
                  <p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-2.5 font-mono-ui text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_var(--neon)]"
              >
                Book a Discovery Call →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}