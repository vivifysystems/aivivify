import { availabilityLabel, type Availability } from "@/content";
import { cn } from "@/lib/utils";

const styles: Record<Availability, string> = {
  available: "bg-cyan/12 text-cyan ring-cyan/35",
  pilot: "bg-purple/15 text-purple-200 ring-purple/45",
  "integration-dependent": "bg-snow/8 text-snow ring-snow/25",
  "partner-optional": "bg-snow/8 text-mist ring-snow/20",
};
const lightStyles: Record<Availability, string> = {
  available: "bg-cyan-700/10 text-cyan-700 ring-cyan-700/30",
  pilot: "bg-purple-700/10 text-purple-700 ring-purple-700/30",
  "integration-dependent": "bg-navy/5 text-navy ring-navy/20",
  "partner-optional": "bg-navy/5 text-slate ring-navy/15",
};

export function AvailabilityBadge({
  value,
  tone = "dark",
  className,
}: {
  value: Availability;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tech-label inline-flex max-w-full items-start gap-1.5 rounded-2xl px-2.5 py-1 text-left !text-[0.8rem] leading-snug ring-1 ring-inset",
        tone === "dark" ? styles[value] : lightStyles[value],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-full",
          value === "available" ? "bg-current" : value === "pilot" ? "bg-purple" : "bg-mist",
        )}
      />
      {availabilityLabel[value]}
    </span>
  );
}

export function SimulationBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "tech-label inline-flex items-center gap-1.5 rounded-full bg-snow/8 px-2.5 py-1 !text-[0.8rem] text-mist ring-1 ring-inset ring-snow/20",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
      Sample scenario
    </span>
  );
}
