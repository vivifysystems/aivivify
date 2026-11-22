import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { enabledSystems, systemGroups } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/site/icons";
import { AvailabilityBadge } from "@/components/site/Badges";
import { ContactCta } from "@/components/site/ContactCta";

export default function Systems() {
  useRouteMeta();
  return (
    <>
      <PageHero
        label="Systems & features"
        title="Every system, in plain English."
        lede="Use one on its own or connect several. Each page explains what it does, how we build it, what we need from you and its honest limits."
        vivi="Look for the demo button. Most systems have a short sample walkthrough."
      />
      <section aria-label="Systems catalog" className="bg-ground pb-24">
        <div className="shell space-y-20">
          {systemGroups.map((g) => (
            <div key={g.id} className="grid gap-8 lg:grid-cols-[16rem_1fr]">
              <div>
                <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
                <p className="mt-2 text-mist">{g.line}</p>
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                {enabledSystems
                  .filter((s) => s.group === g.id)
                  .map((s, i) => (
                    <li key={s.id} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
                      <article className="group relative flex h-full flex-col rounded-[1.75rem] bg-navy-800 p-7 transition-colors hover:bg-navy-700">
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 text-white">
                            <Icon name={s.icon} className="h-6 w-6" />
                          </span>
                          <AvailabilityBadge value={s.availability} />
                        </div>
                        <h3 className="mt-6 font-display text-xl font-semibold">
                          <Link
                            to={`/systems/${s.id}`}
                            className="after:absolute after:inset-0 after:rounded-[1.75rem]"
                          >
                            {s.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-mist">{s.menuLine}</p>
                        <div className="relative mt-auto flex items-center gap-5 pt-6 text-sm font-semibold">
                          <span className="inline-flex items-center gap-1.5 text-snow">
                            {s.exploreLabel}
                            <ArrowRight
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                              aria-hidden
                            />
                          </span>
                          {s.demoId && (
                            <Link
                              to={`/demos#${s.demoId}`}
                              className="relative z-10 inline-flex items-center gap-1.5 text-cyan hover:underline"
                            >
                              <PlayCircle className="h-4 w-4" aria-hidden /> {s.demoLabel}
                            </Link>
                          )}
                        </div>
                      </article>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <ContactCta />
    </>
  );
}
