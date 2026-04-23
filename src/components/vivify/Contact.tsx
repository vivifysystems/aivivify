import { SectionHeader } from "./Framework";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          kicker="Contact"
          title="Let’s build something hands-off."
          sub="Tell me about the workflow you’re tired of running manually — I’ll architect a system that runs itself."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <a
            href="mailto:vivify.systems@gmail.com"
            className="glass group flex items-center justify-between rounded-2xl p-7 transition-all hover:border-primary/60 hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]"
          >
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">Email</p>
              <p className="mt-2 font-display text-xl">vivify.systems@gmail.com</p>
            </div>
            <span className="text-2xl text-primary transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="https://calendly.com/vivienecreates/automation-discovery-call"
            target="_blank"
            rel="noreferrer"
            className="glass group flex items-center justify-between rounded-2xl p-7 transition-all hover:border-primary/60 hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]"
          >
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">Book a call</p>
              <p className="mt-2 font-display text-xl">Schedule a Discovery Call</p>
            </div>
            <span className="text-2xl text-primary transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-6 pb-12 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-xl font-bold">
                <span className="neon-text">VIVIFY</span> Automation
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                Let’s explore smarter systems.{" "}
                <span className="text-foreground/45">(P.S. Meet the friendly dinosaur on our call! 🦖)</span>
              </p>
            </div>
            <ul className="flex flex-wrap gap-3">
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com/in/vivienepitogo/" },
                { label: "Upwork", href: "https://www.upwork.com/" },
                { label: "OnlineJobs.ph", href: "https://v2.onlinejobs.ph/jobseekers/info/4855809" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 font-mono-ui text-[11px] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-5 text-xs text-foreground/40 sm:flex-row sm:items-center">
            <p>© 2026 Viviene Pitogo | VIVIFY Automation</p>
            <p className="font-mono-ui uppercase tracking-widest">status: <span className="text-primary">all systems operational</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}