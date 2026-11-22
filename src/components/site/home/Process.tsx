import { processSteps } from "@/content";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="section-y relative overflow-hidden bg-navy">
      <div className="shell">
        <div>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
            <h2 id="process-title" data-reveal className="type-h2">
              Discover. Design. Build. Test. Launch.
            </h2>
            <p data-reveal className="type-lede text-mist">
              A simple, visible process. You always know what's happening, what's next and what it
              needs from you, and nothing reaches a customer until it has been tested.
            </p>
          </div>
          <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
            <span
              aria-hidden
              className="absolute left-[1.35rem] top-0 h-full w-0.5 bg-snow/10 md:hidden"
            />
            <span
              aria-hidden
              data-reveal
              className="draw-y absolute left-[1.35rem] top-0 h-full w-0.5 bg-gradient-to-b from-cyan to-purple md:hidden"
            />
            <span
              aria-hidden
              className="absolute left-0 top-[1.35rem] hidden h-0.5 w-full bg-snow/10 md:block"
            />
            <span
              aria-hidden
              data-reveal
              className="draw-x absolute left-0 top-[1.35rem] hidden h-0.5 w-full bg-gradient-to-r from-cyan to-purple md:block"
            />
            {processSteps.map((s, i) => (
              <li
                key={s.id}
                data-reveal
                style={{ "--reveal-i": i + 1 } as React.CSSProperties}
                className="relative flex gap-5 md:block"
              >
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-700 font-display font-semibold text-cyan ring-4 ring-navy">
                  {i + 1}
                </span>
                <div className="md:mt-6">
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-mist">{s.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
