import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { demos, systemById } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";
import { DemoPlayer } from "@/components/site/demo/DemoPlayer";
import { Icon } from "@/components/site/icons";
import { AvailabilityBadge } from "@/components/site/Badges";
import { ContactCta } from "@/components/site/ContactCta";
import { cn } from "@/lib/utils";

export default function Demos() {
  useRouteMeta();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const fromHash = demos.find((d) => `#${d.id}` === hash)?.id;
  const [activeId, setActiveId] = useState(fromHash ?? demos[0].id);
  useEffect(() => {
    if (fromHash) setActiveId(fromHash);
  }, [fromHash]);
  const active = demos.find((d) => d.id === activeId)!;
  const system = systemById(active.systemId);

  const select = (id: string) => {
    setActiveId(id);
    navigate(`/demos#${id}`, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <PageHero
        label="Demos"
        title="See each system at work."
        lede="Pick a system to watch a short simulated scenario. Pause, replay or step through at your own pace."
        vivi="Every demo uses the same fictional sample business, Harbor Plumbing. Nothing here is real customer data."
      />
      <section aria-label="Demo gallery" className="bg-ground pb-24">
        <div className="shell grid gap-10 lg:grid-cols-[18rem_1fr]">
          <nav aria-label="Choose a demo">
            {/* Phones: a labelled picker lists all demos at once; the chips below stay for browsing. */}
            <div className="mb-4 lg:hidden">
              <label htmlFor="demo-picker" className="text-sm font-medium text-mist">
                Choose a demo ({demos.length})
              </label>
              <select
                id="demo-picker"
                value={activeId}
                onChange={(e) => select(e.target.value)}
                className="mt-2 block h-12 w-full rounded-2xl bg-navy-800 px-4 text-base text-snow ring-1 ring-inset ring-snow/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                {demos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
              {demos.map((d) => {
                const s = systemById(d.systemId);
                return (
                  <li key={d.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => select(d.id)}
                      aria-current={d.id === activeId ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                        d.id === activeId
                          ? "bg-purple-600 text-white"
                          : "bg-navy-800 hover:bg-navy-700 lg:bg-transparent",
                      )}
                    >
                      <Icon name={s?.icon ?? "Sparkles"} className="h-[18px] w-[18px] shrink-0" />
                      <span className="whitespace-nowrap text-[0.95rem] font-medium lg:whitespace-normal">
                        {d.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div id={active.id} className="scroll-mt-28 rounded-[2rem] bg-navy p-5 sm:p-9">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="type-h3">{active.title}</h2>
                <p className="mt-2 text-mist">{active.summary}</p>
              </div>
              {system && system.availability !== "available" && (
                <AvailabilityBadge value={system.availability} />
              )}
            </div>
            <DemoPlayer key={active.id} demo={active} />
            {system && (
              <Link to={`/systems/${system.id}`} className="link-arrow mt-8 text-cyan">
                How {system.title} works <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
