import { Link } from "react-router-dom";
import { ArrowRight, Check, Plus } from "lucide-react";
import { systemById, type Package } from "@/content";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "./Badges";

export function PackageCard({ pkg, highlight = false }: { pkg: Package; highlight?: boolean }) {
  return (
    <article
      aria-labelledby={`pkg-${pkg.id}`}
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] p-7 sm:p-8",
        highlight ? "bg-purple-600/95 text-white" : "bg-navy-800",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={`pkg-${pkg.id}`} className="font-display text-2xl font-bold tracking-tight">
          {pkg.name}
        </h3>
        {pkg.availability !== "available" && <AvailabilityBadge value={pkg.availability} />}
      </div>
      <p className={cn("mt-3 text-lg font-medium", highlight ? "text-white" : "text-snow")}>
        {pkg.tagline}
      </p>
      <p className={cn("mt-2", highlight ? "text-white/85" : "text-mist")}>{pkg.summary}</p>
      <p className={cn("mt-5 text-sm", highlight ? "text-white/85" : "text-mist")}>
        <span className="font-semibold text-current">Best for:</span> {pkg.bestFor}
      </p>
      <ul className="mt-6 space-y-2.5">
        {pkg.systems.map((id) => {
          const s = systemById(id);
          if (!s) return null;
          return (
            <li key={id} className="flex gap-2.5">
              <Check
                className={cn("mt-1 h-4 w-4 shrink-0", highlight ? "text-white" : "text-cyan")}
                aria-hidden
              />
              <Link to={`/systems/${id}`} className="hover:underline">
                {s.title}
              </Link>
            </li>
          );
        })}
        {pkg.addOns.map((id) => {
          const s = systemById(id);
          if (!s) return null;
          return (
            <li key={id} className={cn("flex gap-2.5", highlight ? "text-white/80" : "text-mist")}>
              <Plus className="mt-1 h-4 w-4 shrink-0" aria-hidden />
              <Link to={`/systems/${id}`} className="hover:underline">
                {s.title} <span className="text-sm">(optional add-on)</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {pkg.availabilityNote && (
        <p
          className={cn(
            "mt-6 rounded-2xl p-3.5 text-sm",
            highlight ? "bg-white/10" : "bg-navy-700 text-purple-200",
          )}
        >
          {pkg.availabilityNote}
        </p>
      )}
      <div className="mt-auto pt-8">
        <Link
          to={`/contact?package=${pkg.id}`}
          className={cn("btn w-full", highlight ? "btn-light" : "btn-ghost")}
        >
          {pkg.availability === "pilot"
            ? "Ask about the pilot"
            : `Discuss ${pkg.name.replace("VIVIFY ", "")}`}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
