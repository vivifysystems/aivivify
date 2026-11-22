import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProjectIds, hasProofCase, projectById, projects } from "@/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../SectionHeading";
import { ProjectCard } from "../ProjectCard";

export function FeaturedWork() {
  const featured = featuredProjectIds.map((id) => projectById(id)!).filter(Boolean);
  // 3 projects: a wide row, then two cards, then one full-width card; 4: the original 7/5/5/7 rhythm.
  const spans =
    featured.length === 3
      ? ["lg:col-span-7", "lg:col-span-5", "lg:col-span-12"]
      : ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];
  return (
    <section aria-labelledby="work-title" className="section-y relative bg-ground">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="work-title"
            label="Featured work"
            title="Real systems, built and documented."
            lede="Selected automation projects by Viviene: the problem, what was built, and the tools behind it."
          />
          <Link to="/work" className="btn btn-ghost">
            All {projects.length} projects <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {featured.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ "--reveal-i": i } as React.CSSProperties}
              className={cn(
                spans[i] ?? "lg:col-span-5",
                // On phones the proof case already sits right after the hero.
                hasProofCase && i === 0 && "max-md:hidden",
              )}
            >
              <ProjectCard project={p} large={spans[i] !== "lg:col-span-5"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
