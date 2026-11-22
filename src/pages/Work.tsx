import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  type Project,
  featuredProjectIds,
  projectById,
  projectCategory,
  projects,
  projectTools,
  toolUsage,
  workCategories,
} from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { useViewTransitionLink } from "@/hooks/use-view-transition-link";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectMedia } from "@/components/site/work/ProjectMedia";
import { ContactCta } from "@/components/site/ContactCta";
import { cn } from "@/lib/utils";

/** The spotlighted case study: the first featured launch project (sources agree, not a concept demo). */
const spotlightProject = featuredProjectIds.map((id) => projectById(id)).find(Boolean);

function Spotlight({ p }: { p: Project }) {
  const to = `/work/${p.id}`;
  const onClick = useViewTransitionLink(to);
  const cat = workCategories.find((c) => c.id === projectCategory[p.id]);
  return (
    <article
      aria-labelledby="spotlight-title"
      className="grid overflow-hidden rounded-[2rem] bg-navy-800 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <ProjectMedia project={p} tinted={false} className="aspect-[16/10] h-full lg:aspect-auto" />
      <div className="flex flex-col p-7 sm:p-10">
        <p className="kicker text-cyan">Featured case study · {cat?.label}</p>
        <h2 id="spotlight-title" className="type-h3 mt-3 !text-[clamp(1.6rem,2.6vw,2.2rem)]">
          {p.title}
        </h2>
        <dl className="mt-6 space-y-4 text-[0.98rem]">
          <div>
            <dt className="font-semibold text-snow">The problem</dt>
            <dd className="mt-1 line-clamp-3 text-mist">{p.caseStudy.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-snow">The result</dt>
            <dd className="mt-1 text-mist">{p.caseStudy.result}</dd>
          </div>
        </dl>
        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tools used">
          {projectTools(p).map((t) => (
            <li key={t} className="rounded-full bg-navy-700 px-3 py-1 text-[0.8125rem]">
              {t}
            </li>
          ))}
        </ul>
        <Link to={to} onClick={onClick} className="btn btn-primary mt-8 self-start">
          Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export default function Work() {
  useRouteMeta();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const tool = params.get("tool") ?? "all";
  const allTools = useMemo(() => toolUsage(), []);

  const visible = projects.filter(
    (p) =>
      (category === "all" || projectCategory[p.id] === category) &&
      (tool === "all" || projectTools(p).includes(tool)),
  );
  const countFor = (id: string) =>
    projects.filter(
      (p) =>
        (id === "all" || projectCategory[p.id] === id) &&
        (tool === "all" || projectTools(p).includes(tool)),
    ).length;

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const filterKey = `${category}|${tool}`;
  const filtered = category !== "all" || tool !== "all";

  return (
    <>
      <PageHero
        label="Work"
        title="Systems I've designed and built."
        lede="Automation projects with the problem each one solved, what was built and the tools it runs on. Filter by type of work or by technology."
      />
      {spotlightProject && (
        <section aria-label="Featured case study" className="bg-ground pb-16">
          <div className="shell">
            <Spotlight p={spotlightProject} />
          </div>
        </section>
      )}
      <section aria-labelledby="projects-heading" className="bg-ground pb-24">
        <div className="shell">
          <h2 id="projects-heading" className="type-h3">
            All projects
          </h2>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter by category"
              className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
            >
              {[{ id: "all", label: "All work" }, ...workCategories].map((c) => {
                const n = countFor(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={category === c.id}
                    disabled={n === 0 && category !== c.id}
                    onClick={() => set("category", c.id)}
                    className={cn(
                      "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-40",
                      category === c.id
                        ? "bg-snow text-navy"
                        : "bg-navy-800 text-snow/90 hover:bg-navy-700",
                    )}
                  >
                    {c.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[0.8125rem] tabular-nums",
                        category === c.id ? "bg-navy/10" : "bg-navy-600 text-mist",
                      )}
                    >
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="flex shrink-0 items-center gap-3 text-sm text-mist">
              Technology
              <select
                value={tool}
                onChange={(e) => set("tool", e.target.value)}
                className="h-11 rounded-full bg-navy-800 px-4 text-snow ring-1 ring-inset ring-snow/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <option value="all">Any tool</option>
                {allTools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.count})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex items-center gap-4 text-sm text-mist" aria-live="polite">
            <span>
              Showing {visible.length} of {projects.length} projects
            </span>
            {filtered && (
              <button
                type="button"
                className="font-semibold text-cyan underline-offset-4 hover:underline"
                onClick={() => setParams({}, { replace: true, preventScrollReset: true })}
              >
                Clear filters
              </button>
            )}
          </div>
          {visible.length ? (
            <ul key={filterKey} className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <li key={p.id} className="anim-pop" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-3xl bg-navy-800 p-10 text-center">
              <p className="font-display text-xl font-semibold">No projects match both filters.</p>
              <button
                type="button"
                className="btn btn-ghost mt-6"
                onClick={() => setParams({}, { replace: true })}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
      <ContactCta title="Have a process like one of these? Let's talk it through." />
    </>
  );
}
