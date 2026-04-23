import { useEffect, useState } from "react";

const links = [
  { href: "#process", label: "Process" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={`glass-strong flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all ${
          scrolled ? "shadow-[0_0_30px_rgba(0,255,65,0.18)]" : ""
        }`}
      >
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold tracking-widest">
          <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--neon)]" />
          <span className="neon-text">VIVIFY</span>
          <span className="text-foreground/60 text-xs font-mono-ui">/automation</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono-ui text-xs uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://calendly.com/vivienecreates/automation-discovery-call"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 font-mono-ui text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_var(--neon)] md:inline-flex"
        >
          Book a Discovery Call
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden rounded-full border border-primary/40 p-2 text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>
      {open && (
        <div className="glass-strong absolute top-20 mx-4 w-[calc(100%-2rem)] max-w-5xl rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 font-mono-ui text-sm uppercase tracking-widest text-foreground/80 hover:bg-primary/10 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}