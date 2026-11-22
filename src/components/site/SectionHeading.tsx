import { cn } from "@/lib/utils";

/**
 * Section heading: a short technical label, the heading and an optional lede.
 * The label names the section for scanning; the heading carries the message.
 */
export function SectionHeading({
  label,
  title,
  lede,
  id,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
}: {
  label?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  id?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {label && (
        <p
          data-reveal
          className={cn("kicker mb-4", tone === "dark" ? "text-cyan" : "text-cyan-700")}
        >
          {label}
        </p>
      )}
      <Tag
        id={id}
        data-reveal
        style={{ "--reveal-i": 1 } as React.CSSProperties}
        className={Tag === "h1" ? "type-display" : "type-h2"}
      >
        {title}
      </Tag>
      {lede && (
        <p
          data-reveal
          style={{ "--reveal-i": 2 } as React.CSSProperties}
          className={cn(
            "type-lede mt-5",
            tone === "dark" ? "text-mist" : "text-slate",
            align === "center" && "mx-auto",
            "max-w-2xl",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
