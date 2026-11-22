import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { enabledSystems, systemGroups } from "@/content";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { ViviAvatar } from "./Vivi";
import { AskViviButton } from "./AskVivi";
import { BookingLink } from "./BookingLink";

const primaryLinks = [
  { to: "/solutions", label: "Solutions" },
  { to: "/demos", label: "Demos" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export function Wordmark({ className }: { className?: string }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  return (
    <Link
      to="/"
      onClick={(e) => {
        // Already home: a normal link click would do nothing, so take the visitor back to the top.
        if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        if (hash) navigate("/");
        else window.scrollTo({ top: 0, left: 0 });
      }}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <img
        src="/assets/vivi/avatars/vivify-v-mark.webp"
        alt=""
        width={39}
        height={32}
        className="h-8 w-auto transition-transform duration-300 group-hover:-rotate-6"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-bold tracking-[0.04em]">VIVIFY</span>
        <span className="mt-1 font-display text-[0.56rem] font-medium tracking-[0.42em] text-mist">
          SOLUTIONS
        </span>
      </span>
      <span className="sr-only"> home</span>
    </Link>
  );
}

/** Desktop "Systems" mega menu: hover (with intent delay), click, keyboard, Escape. */
function SystemsMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const hoverOpened = useRef(false);
  const location = useLocation();

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => close(), [location.pathname, close]);

  // Keep the page still while the menu is open: only the menu itself scrolls.
  // `scrollbar-gutter: stable` (styles.css) stops the layout shifting when the page scrollbar goes.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // Hover opens only for mouse pointers; touch uses click.
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      hoverOpened.current = true;
      setOpen(true);
    }, 90);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      hoverOpened.current = false;
      setOpen(false);
    }, 220);
  };

  return (
    <div ref={wrapRef} onPointerEnter={onEnter} onPointerLeave={onLeave} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // A mouse click right after hover-open keeps the menu open instead of toggling it shut.
          window.clearTimeout(timer.current);
          if (hoverOpened.current) {
            hoverOpened.current = false;
            setOpen(true);
            return;
          }
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              document.getElementById(panelId)?.querySelector<HTMLAnchorElement>("a")?.focus(),
            );
          }
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
          open || location.pathname.startsWith("/systems")
            ? "bg-snow/10 text-snow"
            : "text-snow/85 hover:text-snow",
        )}
      >
        Systems
        <ChevronDown
          aria-hidden
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-40 px-[var(--gutter)]"
      >
        {/* Bounded to the viewport below the header: the groups scroll, the footer links stay in view. */}
        <div className="anim-pop pointer-events-auto mx-auto flex max-h-[calc(100dvh-var(--header-h)-1rem)] max-w-[76rem] flex-col overflow-hidden rounded-3xl bg-navy-800 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ring-1 ring-snow/10">
          <div
            data-systems-scroll
            className="grid min-h-0 flex-1 gap-x-6 gap-y-8 overflow-y-auto overscroll-contain p-7 lg:grid-cols-4"
          >
            {systemGroups.map((g) => (
              <div key={g.id}>
                <p className="kicker text-cyan">{g.title}</p>
                <p className="mt-1 min-h-[2.5rem] text-sm text-mist">{g.line}</p>
                <ul className="mt-4 space-y-1">
                  {enabledSystems
                    .filter((s) => s.group === g.id)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/systems/${s.id}`}
                          className="group flex gap-3 rounded-2xl p-2.5 -mx-2.5 transition-colors hover:bg-navy-700 focus-visible:bg-navy-700"
                        >
                          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy-700 text-purple-300 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                            <Icon name={s.icon} className="h-[18px] w-[18px]" />
                          </span>
                          <span>
                            <span className="block text-[0.95rem] font-semibold leading-tight text-snow">
                              {s.title}
                              {s.availability === "pilot" && (
                                <span className="tech-label ml-2 !text-[0.78rem] text-purple-300">
                                  Pilot
                                </span>
                              )}
                              {s.availability === "partner-optional" && (
                                <span className="tech-label ml-2 !text-[0.78rem] text-mist">
                                  Optional
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 block text-[0.85rem] leading-snug text-mist">
                              {s.menuLine}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 bg-navy-700/60 px-7 py-4">
            <div className="flex items-center gap-3 text-sm text-mist">
              <ViviAvatar size={32} ring={false} />
              <span>Not sure where to start? Most systems have a short demo.</span>
            </div>
            <div className="flex gap-5 text-sm">
              <Link to="/systems" className="link-arrow text-snow">
                All systems <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/demos" className="link-arrow text-cyan">
                Watch demos <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  onEscape,
}: {
  open: boolean;
  onClose: () => void;
  onEscape: () => void;
}) {
  const [systemsOpen, setSystemsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onEscape]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-ground px-[var(--gutter)] pb-10 lg:hidden"
    >
      <nav aria-label="Mobile" className="anim-rise mx-auto max-w-lg pt-4">
        <button
          type="button"
          aria-expanded={systemsOpen}
          onClick={() => setSystemsOpen((o) => !o)}
          className="flex w-full items-center justify-between py-4 font-display text-2xl font-semibold"
        >
          Systems
          <ChevronDown
            aria-hidden
            className={cn("h-6 w-6 transition-transform", systemsOpen && "rotate-180")}
          />
        </button>
        {systemsOpen && (
          <div className="mb-3 grid gap-4 rounded-2xl bg-navy-800 p-3">
            {systemGroups.map((g) => (
              <div key={g.id}>
                <p className="kicker px-3 text-cyan">{g.title}</p>
                <ul className="mt-1 grid gap-0.5">
                  {enabledSystems
                    .filter((s) => s.group === g.id)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/systems/${s.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.98rem] hover:bg-navy-700"
                        >
                          <Icon
                            name={s.icon}
                            className="h-[18px] w-[18px] shrink-0 text-purple-300"
                          />
                          <span>
                            {s.title}
                            {s.availability === "pilot" && (
                              <span className="tech-label ml-2 !text-[0.78rem] text-purple-300">
                                Pilot
                              </span>
                            )}
                            {s.availability === "partner-optional" && (
                              <span className="tech-label ml-2 !text-[0.78rem] text-mist">
                                Optional
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <Link
              to="/systems"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-semibold text-cyan"
            >
              All systems <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        )}
        {[...primaryLinks, { to: "/contact", label: "Contact" }].map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onClose}
            className="block py-4 font-display text-2xl font-semibold aria-[current=page]:text-purple-300"
          >
            {l.label}
          </NavLink>
        ))}
        <BookingLink onClick={onClose} className="mt-6 w-full" />
      </nav>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  // Escape closes the menu and hands focus back to the button that opened it.
  const escapeMobile = useCallback(() => {
    setMobileOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [location.pathname]);

  // The mobile menu is a sibling of <header>: the header's backdrop-filter would
  // otherwise become the containing block for the fixed-position menu.
  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow] duration-300",
          scrolled || mobileOpen
            ? "bg-ground/92 shadow-[0_1px_0_rgb(163_171_207/0.12)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Wordmark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <SystemsMenu />
            {primaryLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                    isActive ? "text-snow bg-snow/10" : "text-snow/85 hover:text-snow",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <AskViviButton />
            <BookingLink className="hidden !min-h-11 !px-5 !text-[0.95rem] md:inline-flex" />
            <button
              ref={toggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-snow/8 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={closeMobile} onEscape={escapeMobile} />
    </>
  );
}
