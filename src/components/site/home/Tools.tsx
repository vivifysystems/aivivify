import { toolGroups, tools, toolsNote } from "@/content";
import { SectionHeading } from "../SectionHeading";

export function Tools() {
  const row = [...tools, ...tools];
  return (
    <section aria-labelledby="tools-title" className="section-y relative overflow-hidden bg-ground">
      <div className="shell">
        <SectionHeading
          id="tools-title"
          label="Tools & technologies"
          title="Built with tools you may already use."
          lede="We choose tools for reliability and fit, and prefer what your team already knows."
        />
      </div>

      {/* Decorative scrolling row; the full list is repeated as text below. */}
      <div
        aria-hidden
        className="marquee relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        <ul className="marquee-track flex w-max items-center motion-reduce:animate-none">
          {row.map((t, i) => (
            <li key={`${t.name}-${i}`} className="flex items-center">
              <span className="whitespace-nowrap px-7 font-display text-[clamp(1.75rem,3.4vw,3rem)] font-semibold tracking-tight text-snow/85">
                {t.name}
              </span>
              <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-purple" />
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {toolGroups.map((g, gi) => (
          <div key={g.id} data-reveal style={{ "--reveal-i": gi } as React.CSSProperties}>
            <h3 className="font-display text-base font-semibold text-snow">{g.label}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tools
                .filter((t) => t.group === g.id)
                .map((t) => (
                  <li
                    key={t.name}
                    className="rounded-full bg-navy-800 px-3 py-1.5 text-sm text-snow/90"
                  >
                    {t.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="shell mt-10 text-sm text-mist">{toolsNote}</p>
    </section>
  );
}
