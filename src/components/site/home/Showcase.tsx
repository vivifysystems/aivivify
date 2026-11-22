import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { demoById, demos, systems, type System } from "@/content";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "../Badges";
import { Icon } from "../icons";
import { ViviSays } from "../Vivi";
import { DemoPlayer } from "../demo/DemoPlayer";

/** The four systems featured in the homepage demo stage, in tab order. */
const ORDER = ["ai-chatbot", "ai-receptionist", "missed-call-text-back", "review-feedback"];

export function Showcase() {
  const featured = ORDER.map((id) => systems.find((s) => s.id === id && s.enabled)).filter(
    (s): s is System => Boolean(s?.demoId),
  );
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const system = featured[active];
  const demo = demoById(system.demoId!)!;

  const onKey = (e: React.KeyboardEvent) => {
    const n = featured.length;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      aria-labelledby="showcase-title"
      className="section-y relative overflow-hidden bg-navy"
    >
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="showcase-title" data-reveal className="type-h2">
            See what happens behind the scenes.
          </h2>
          <p data-reveal className="type-lede mx-auto mt-5 max-w-2xl text-mist">
            What the customer sees and what your team receives, step by step. Each demo plays a
            short sample scenario.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Featured systems"
          onKeyDown={onKey}
          className="mt-12 grid grid-cols-2 gap-2 sm:mx-auto sm:flex sm:max-w-4xl sm:flex-wrap sm:justify-center"
        >
          {featured.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`showcase-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="showcase-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "flex min-w-0 items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-left text-[0.9rem] font-semibold leading-tight transition-colors sm:text-[0.95rem]",
                i === active ? "bg-snow text-navy" : "bg-navy-800 text-snow/85 hover:bg-navy-700",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full",
                  i === active ? "bg-purple-600 text-white" : "bg-navy-700 text-purple-300",
                )}
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              {s.shortTitle}
              {s.availability === "pilot" && (
                <span className="tech-label !text-[0.7rem] opacity-70">Pilot</span>
              )}
            </button>
          ))}
        </div>

        <div
          id="showcase-panel"
          role="tabpanel"
          aria-labelledby={`showcase-tab-${system.id}`}
          className="mt-12"
        >
          <div
            key={system.id}
            className="anim-rise grid gap-10 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-12"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="kicker text-cyan">{system.title}</p>
                {system.availability !== "available" && (
                  <AvailabilityBadge value={system.availability} />
                )}
              </div>
              <h3 className="type-h3 mt-3 !text-[clamp(1.5rem,2.1vw,1.75rem)]">
                {system.headline}
              </h3>
              <p className="mt-4 text-mist">{system.benefit}</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                {system.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-[0.95rem]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan">
                      <Check className="h-3 w-3" aria-hidden strokeWidth={2.5} />
                    </span>
                    <span className="text-snow/90">{b}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/systems/${system.id}`} className="btn btn-primary mt-7">
                {system.exploreLabel} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <ViviSays className="mt-9 hidden xl:flex">{system.viviLine}</ViviSays>
            </div>
            <div className="rounded-[2rem] bg-ground/60 p-5 ring-1 ring-snow/8 sm:p-8">
              <DemoPlayer demo={demo} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
          <p className="text-mist">
            {demos.length} demos in total, covering websites, booking, campaigns, local SEO and
            more.
          </p>
          <Link to="/demos" className="link-arrow text-cyan">
            Open the demo gallery <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
