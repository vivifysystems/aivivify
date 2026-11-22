import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProjectIds, projectById, projects } from "@/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../SectionHeading";
import { ProjectCard } from "../ProjectCard";

export function FeaturedWork() {
  const featured = featuredProjectIds.map((id) => projectById(id)!).filter(Boolean);
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
                i === 0 || i === 3 ? "lg:col-span-7" : "lg:col-span-5",
                // On phones the Messenger case already sits right after the hero.
                i === 0 && "max-md:hidden",
              )}
            >
              <ProjectCard project={p} large={i === 0 || i === 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
