import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projectCategory, projectTools, workCategories, type Project } from "@/content";
import { useViewTransitionLink } from "@/hooks/use-view-transition-link";
import { cn } from "@/lib/utils";
import { ProjectMedia } from "./work/ProjectMedia";

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const cat = workCategories.find((c) => c.id === projectCategory[project.id]);
  const to = `/work/${project.id}`;
  const onClick = useViewTransitionLink(to);
  const tools = projectTools(project);
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-navy-800 transition-[transform,background-color] duration-500 hover:-translate-y-1 hover:bg-navy-700"
    >
      <div className="relative">
        <ProjectMedia
          project={project}
          className="aspect-[16/10]"
          transitionName={`project-${project.id}`}
        />
        {project.beta && (
          <span className="tech-label absolute left-4 top-4 rounded-full bg-purple-600 px-2.5 py-1 !text-[0.72rem] text-white">
            Beta
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="kicker !text-[0.875rem] text-cyan">{cat?.label}</p>
        <h3
          className={cn(
            "mt-2 font-display font-semibold leading-snug tracking-tight text-snow",
            large ? "text-[1.6rem]" : "text-[1.3rem]",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[0.95rem] text-mist">{project.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools used">
          {tools.slice(0, 3).map((t) => (
            <li
              key={t}
              className="rounded-full bg-navy-700 px-2.5 py-1 text-[0.8125rem] text-snow/85 group-hover:bg-navy-600"
            >
              {t}
            </li>
          ))}
          {tools.length > 3 && (
            <li className="rounded-full px-1.5 py-1 text-[0.8125rem] text-mist">
              +{tools.length - 3} more
            </li>
          )}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.95rem] font-semibold text-snow">
          Read case study
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
