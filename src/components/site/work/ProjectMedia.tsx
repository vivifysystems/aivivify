import type { Project } from "@/content";
import { cardImage } from "@/components/vivify/media";
import { cn } from "@/lib/utils";

/**
 * One consistent treatment for project imagery: workflow screenshots are tinted
 * into the brand palette at rest and shown in full colour on hover or focus.
 */
export function ProjectMedia({
  project,
  className,
  transitionName,
  tinted = true,
}: {
  project: Project;
  className?: string;
  transitionName?: string;
  tinted?: boolean;
}) {
  const img = cardImage(project.media.card);
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,#2a1a6e,#0b1235_60%,#003d4d)]",
        className,
      )}
      style={
        transitionName ? ({ viewTransitionName: transitionName } as React.CSSProperties) : undefined
      }
    >
      {img ? (
        <img
          src={img}
          alt={`Workflow screenshot from the ${project.title} project`}
          loading="lazy"
          decoding="async"
          width={800}
          height={500}
          className={cn(
            "h-full w-full object-cover object-left-top transition-all duration-700",
            tinted &&
              "opacity-80 mix-blend-luminosity group-hover:scale-[1.03] group-hover:opacity-100 group-hover:mix-blend-normal group-focus-visible:opacity-100 group-focus-visible:mix-blend-normal",
          )}
        />
      ) : (
        <div className="grid h-full place-items-center p-8 text-center font-display text-xl text-snow/50">
          {project.tag}
        </div>
      )}
    </div>
  );
}
