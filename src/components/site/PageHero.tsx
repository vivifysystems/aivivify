import { cn } from "@/lib/utils";
import { ViviSays } from "./Vivi";

/** Inner-page header: label, h1, lede, optional VIVI line or custom aside. */
export function PageHero({
  label,
  title,
  lede,
  vivi,
  aside,
  children,
  className,
}: {
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  vivi?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn(
        "relative overflow-hidden bg-ground pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_10%,rgb(163_60_255/0.2),transparent_70%),radial-gradient(35%_45%_at_0%_100%,rgb(0_229_255/0.07),transparent_70%)]"
      />
      <div className="shell relative grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="max-w-3xl">
          <p className="kicker anim-rise text-cyan">{label}</p>
          <h1
            id="page-title"
            className="type-display anim-rise mt-5 !text-[clamp(2.5rem,5.4vw,4.6rem)]"
            style={{ animationDelay: "60ms" }}
          >
            {title}
          </h1>
          {lede && (
            <p
              className="type-lede anim-rise mt-6 max-w-2xl text-snow/85"
              style={{ animationDelay: "140ms" }}
            >
              {lede}
            </p>
          )}
          {children}
        </div>
        {aside ?? (vivi && <ViviSays className="anim-rise lg:justify-self-end">{vivi}</ViviSays>)}
      </div>
    </section>
  );
}
