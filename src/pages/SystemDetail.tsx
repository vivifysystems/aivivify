import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Info } from "lucide-react";
import { demoById, enabledSystems, packages, projectById, systemById } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/site/icons";
import { AvailabilityBadge } from "@/components/site/Badges";
import { DemoPlayer } from "@/components/site/demo/DemoPlayer";
import { ContactCta } from "@/components/site/ContactCta";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ViviSays } from "@/components/site/Vivi";
import NotFound from "./NotFound";

export default function SystemDetail() {
  const { slug = "" } = useParams();
  const system = systemById(slug);
  useRouteMeta();
  if (!system) return <NotFound />;

  const demo = system.demoId ? demoById(system.demoId) : undefined;
  const inPackages = packages.filter(
    (p) => p.systems.includes(system.id) || p.addOns.includes(system.id),
  );
  const related = (system.relatedProjects ?? []).map(projectById).filter((p) => p !== undefined);
  const idx = enabledSystems.findIndex((s) => s.id === system.id);
  const next = enabledSystems[(idx + 1) % enabledSystems.length];

  return (
    <>
      <PageHero
        label={system.title}
        title={system.headline}
        lede={system.benefit}
        aside={
          <div className="anim-rise flex flex-col items-start gap-5 lg:items-end">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-purple-600 text-white shadow-[0_20px_50px_-20px_rgb(163_60_255/0.9)]">
              <Icon name={system.icon} className="h-8 w-8" />
            </span>
            <AvailabilityBadge value={system.availability} />
          </div>
        }
      >
        <nav aria-label="Breadcrumb" className="anim-rise mt-8 text-sm text-mist">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link to="/systems" className="hover:text-snow">
                Systems
              </Link>{" "}
              /
            </li>
            <li aria-current="page" className="text-snow">
              {system.title}
            </li>
          </ol>
        </nav>
      </PageHero>

      <section aria-labelledby="benefits-title" className="bg-ground pb-20">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="benefits-title" className="type-h3">
              What you get
            </h2>
            <ul className="mt-6 space-y-4">
              {system.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-lg">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan">
                    <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="type-h3">How we build it</h2>
            <ol className="mt-6 space-y-4">
              {system.howItWorks.map((h, i) => (
                <li key={h} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-700 text-sm font-semibold text-cyan">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-snow/90">{h}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {demo && (
        <section id="demo" aria-labelledby="demo-title" className="section-y bg-navy">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 id="demo-title" className="type-h2">
                  See it in action.
                </h2>
                <p className="type-lede mt-4 text-mist">{demo.summary}</p>
              </div>
              <ViviSays>{system.viviLine}</ViviSays>
            </div>
            <div className="mt-14">
              <DemoPlayer demo={demo} />
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="fit-title" className="section-y on-light">
        <div className="shell grid gap-12 lg:grid-cols-3">
          <div>
            <h2 id="fit-title" className="type-h3">
              What we'll need from you
            </h2>
            <ul className="mt-5 space-y-3 text-slate">
              {system.youProvide.map((y) => (
                <li key={y} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" aria-hidden />
                  {y}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="type-h3">Good to know</h2>
            <ul className="mt-5 space-y-3 text-slate">
              {system.goodToKnow.map((g) => (
                <li key={g} className="flex gap-3">
                  <Info className="mt-1 h-4 w-4 shrink-0 text-purple-700" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="type-h3">Included in</h2>
            {inPackages.length ? (
              <ul className="mt-5 space-y-3">
                {inPackages.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/solutions"
                      className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy/8 hover:ring-purple-700/40"
                    >
                      <span>
                        <span className="block font-semibold">{p.name}</span>
                        <span className="text-sm text-slate">
                          {p.addOns.includes(system.id) ? "Optional add-on" : "Included"}
                          {p.availability === "pilot" ? " · pilot" : ""}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-purple-700 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-slate">
                Available on its own. Ask us about adding it to any package.
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y bg-ground">
          <div className="shell">
            <h2 id="related-title" className="type-h2">
              Related work from the portfolio.
            </h2>
            <p className="type-lede mt-4 max-w-2xl text-mist">
              Real projects Viviene has built using similar techniques.
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-label="Next system" className="bg-ground pb-4">
        <div className="shell">
          <Link
            to={`/systems/${next.id}`}
            className="group flex items-center justify-between gap-6 rounded-3xl bg-navy-800 p-7 hover:bg-navy-700"
          >
            <span>
              <span className="kicker text-mist">Next system</span>
              <span className="mt-1 block font-display text-2xl font-semibold">{next.title}</span>
            </span>
            <ArrowRight
              className="h-6 w-6 text-cyan transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
