import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BellRing, CalendarCheck, MessageSquareReply } from "lucide-react";
import portrait from "@/assets/optimized/card/viviene-portrait.webp";
import { usePrefersReducedMotion } from "@/hooks/use-motion-preferences";
import { BookingLink } from "../BookingLink";
import { viviArt } from "../vivi-art";

const chips = [
  {
    icon: MessageSquareReply,
    title: "New inquiry",
    pending: "Received",
    state: "Acknowledged",
    pos: "left-0 top-[28%] sm:left-[2%]",
    thread: "M 22 33 C 32 30, 40 30, 48 32",
  },
  {
    icon: BellRing,
    title: "Follow-up",
    pending: "Queued",
    state: "Scheduled",
    pos: "right-0 top-[46%]",
    thread: "M 78 51 C 68 50, 62 46, 56 44",
  },
  {
    icon: CalendarCheck,
    title: "Booking",
    pending: "Requested",
    state: "Confirmed",
    pos: "left-0 bottom-[18%] sm:left-[6%]",
    thread: "M 26 77 C 34 74, 40 66, 46 60",
  },
];

function HeroVivi() {
  const reduced = usePrefersReducedMotion();
  const figRef = useRef<HTMLDivElement>(null);

  // Gentle pointer parallax on fine pointers only.
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        figRef.current?.style.setProperty("--px", `${(x * -14).toFixed(1)}px`);
        figRef.current?.style.setProperty("--py", `${(y * -10).toFixed(1)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  // Chips resolve once from "received" to "done": a tiny story of a system at work.
  const [resolved, setResolved] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setResolved(true);
      return;
    }
    const t = window.setTimeout(() => setResolved(true), 2600);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div className="relative mx-auto h-[min(30rem,112vw)] w-full max-w-[30rem] lg:h-[min(44rem,calc(100svh-6rem))] lg:max-w-none">
      {/* Backlight and the platform VIVI stands on: decorative. */}
      <div aria-hidden className="vivi-light absolute inset-[-10%]" />
      <div aria-hidden className="absolute bottom-[1%] left-1/2 h-[9%] w-[62%] -translate-x-1/2">
        <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgb(163_60_255/0.55),rgb(11_18_53/0)_75%)]" />
        <div className="absolute inset-[18%_8%] rounded-[50%] ring-1 ring-cyan/50 shadow-[0_0_30px_rgb(0_229_255/0.35)]" />
        <div className="absolute inset-[32%_22%] rounded-[50%] ring-1 ring-purple/40" />
      </div>

      {/* Threads from each status chip to VIVI. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {chips.map((c, i) => (
          <path
            key={c.title}
            d={c.thread}
            fill="none"
            stroke={resolved ? "#00E5FF" : "#A33CFF"}
            strokeOpacity={resolved ? 0.45 : 0.3}
            strokeWidth="1"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            className="transition-[stroke] duration-700"
            style={{ transitionDelay: `${i * 250}ms` }}
          />
        ))}
      </svg>

      <div
        ref={figRef}
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: "translate3d(var(--px,0),var(--py,0),0)" }}
      >
        <div className="anim-vivi-enter h-full">
          <div className="h-full animate-vivi-float will-change-transform motion-reduce:animate-none">
            <picture>
              <source media="(max-width: 640px)" srcSet={viviArt.hero.srcSm} />
              <img
                src={viviArt.hero.src}
                width={viviArt.hero.width}
                height={viviArt.hero.height}
                alt="VIVI, the VIVIFY Solutions mascot: a friendly futuristic hero with long dark hair, a purple visor and headset, white and navy armour with a V emblem, and a purple cape."
                fetchPriority="high"
                decoding="async"
                className="mx-auto h-[94%] w-auto object-contain [filter:drop-shadow(-6px_0_16px_rgb(0_229_255/0.22))_drop-shadow(10px_-6px_26px_rgb(163_60_255/0.38))_drop-shadow(0_30px_30px_rgb(5_8_26/0.55))]"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* Illustrative system activity around VIVI. */}
      <div aria-hidden>
        {chips.map((c, i) => (
          <div
            key={c.title}
            className={`anim-pop absolute ${c.pos} flex items-center gap-2.5 rounded-2xl bg-navy-800 py-2 pl-2 pr-3.5 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.9)] ring-1 ring-snow/10`}
            style={{ animationDelay: `${700 + i * 350}ms` }}
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-600 text-white">
              <c.icon className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.84rem] font-semibold">{c.title}</span>
              <span
                className={`flex items-center gap-1.5 text-[0.84rem] transition-colors duration-500 ${resolved ? "text-cyan" : "text-[#ffcf85]"}`}
                style={{ transitionDelay: `${i * 250}ms` }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${resolved ? "bg-cyan" : "bg-[#ffcf85]"}`}
                />
                {resolved ? c.state : c.pending}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="absolute bottom-0 right-0 text-[0.8125rem] text-mist">Example activity</p>
    </div>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ground pt-[var(--header-h)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_40%,rgb(163_60_255/0.18),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgb(0_229_255/0.08),transparent_70%)]"
      />
      <div className="shell relative grid items-center gap-6 pb-16 pt-8 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:pb-10 lg:pt-0">
        <div className="relative z-10 max-w-2xl">
          <p className="kicker anim-rise mb-6 inline-flex items-center gap-2.5 text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_#00E5FF]" />
            AI automation &amp; business systems
          </p>
          <h1
            id="hero-title"
            className="type-display anim-rise !text-[clamp(2.6rem,4.5vw,4.6rem)]"
            style={{ animationDelay: "80ms" }}
          >
            <span className="block lg:whitespace-nowrap">Smart systems.</span>
            <span className="block lg:whitespace-nowrap">Less busywork.</span>
            <span className="block text-purple lg:whitespace-nowrap">More room to grow.</span>
          </h1>
          <p
            className="type-lede anim-rise mt-7 max-w-xl text-snow/85"
            style={{ animationDelay: "180ms" }}
          >
            Service teams miss inquiries while they're doing the work. We build the websites, AI
            customer assistants and connected systems that catch every inquiry, answer it and keep
            the follow-up moving.
          </p>
          <div
            className="anim-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <BookingLink />
            <Link to="/#proof" className="btn btn-ghost">
              See a Messenger inquiry answered <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="anim-rise mt-5 text-sm text-mist" style={{ animationDelay: "320ms" }}>
            Or{" "}
            <Link
              to="/systems"
              className="font-semibold text-snow underline-offset-4 hover:underline"
            >
              explore our systems
            </Link>{" "}
            and{" "}
            <Link to="/work" className="font-semibold text-snow underline-offset-4 hover:underline">
              all projects
            </Link>
            .
          </p>
          <Link
            to="/about"
            className="anim-rise group mt-10 inline-flex items-center gap-3 text-sm text-mist"
            style={{ animationDelay: "380ms" }}
          >
            <img
              src={portrait}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-snow/15"
            />
            <span>
              Founder-led by{" "}
              <span className="font-semibold text-snow group-hover:underline">Viviene Pitogo</span>
            </span>
          </Link>
        </div>
        <HeroVivi />
      </div>
    </section>
  );
}
