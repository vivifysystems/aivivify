import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { enabledSystems, systemGroups, systemById } from "@/content";
import { cn } from "@/lib/utils";
import { Icon } from "../icons";
import { AvailabilityBadge } from "../Badges";

/**
 * Section 03: a compact index of every system, grouped by need, with a live preview.
 * Phones get the plain grouped list (each item links straight to its page).
 */
export function SystemsNavigator() {
  const [activeId, setActiveId] = useState("ai-chatbot");
  const active = systemById(activeId)!;
  return (
    <section aria-labelledby="systems-nav-title" className="section-y relative bg-ground">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 id="systems-nav-title" data-reveal className="type-h2 max-w-xl">
            Pick the problem. See the system.
          </h2>
          <p data-reveal className="type-lede mt-5 max-w-xl text-mist">
            Twelve systems that work alone or together, plus optional print.
          </p>
          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {systemGroups.map((g, gi) => (
              <div key={g.id} data-reveal style={{ "--reveal-i": gi } as React.CSSProperties}>
                <h3 className="kicker text-cyan">{g.title}</h3>
                <ul className="mt-3 space-y-1">
                  {enabledSystems
                    .filter((s) => s.group === g.id)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/systems/${s.id}`}
                          onPointerEnter={() => setActiveId(s.id)}
                          onFocus={() => setActiveId(s.id)}
                          className={cn(
                            "group -mx-2.5 flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-1.5 transition-colors",
                            activeId === s.id ? "bg-navy-800" : "hover:bg-navy-800/60",
                          )}
                        >
                          <Icon
                            name={s.icon}
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-colors",
                              activeId === s.id ? "text-cyan" : "text-purple-300",
                            )}
                          />
                          <span className="font-medium leading-tight">{s.title}</span>
                          {s.availability === "pilot" && (
                            <span className="tech-label !text-[0.7rem] text-purple-300">Pilot</span>
                          )}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside aria-label="System preview" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)] rounded-[2rem] bg-navy-800 p-9">
            <div key={active.id} className="anim-pop">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-600 text-white">
                  <Icon name={active.icon} className="h-7 w-7" />
                </span>
                <AvailabilityBadge value={active.availability} />
              </div>
              <p className="tech-label mt-7 text-mist">{active.title}</p>
              <p className="type-h3 mt-2">{active.headline}</p>
              <p className="mt-3 text-mist">{active.benefit}</p>
              <ul className="mt-6 space-y-2.5">
                {active.benefits.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[0.95rem]">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/systems/${active.id}`} className="btn btn-primary !min-h-11">
                  {active.exploreLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                {active.demoId && active.demoLabel && (
                  <Link to={`/demos#${active.demoId}`} className="btn btn-ghost !min-h-11">
                    <PlayCircle className="h-4 w-4" aria-hidden /> {active.demoLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
