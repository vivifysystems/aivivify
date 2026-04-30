import { SectionHeader } from "./Framework";

const results = [
  { value: "15–20", label: "Daily inquiries automated via FB AI Agent" },
  { value: "3–5 hrs → 10 sec", label: "Customer response time reduced" },
  { value: "24/7", label: "Uptime across all deployed systems" },
  { value: "7+", label: "Production workflows shipped" },
];

export function Results() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Real Impact"
          title="Real Systems. Measurable Results."
          sub="Numbers from production deployments — not estimates."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r) => (
            <div
              key={r.label}
              className="glass group relative overflow-hidden rounded-2xl p-7 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
            >
              <p className="font-display text-3xl font-black leading-tight text-primary [text-shadow:0_0_18px_rgba(0,255,65,0.45)] sm:text-4xl">
                {r.value}
              </p>
              <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-foreground/65">
                {r.label}
              </p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/60 via-primary/10 to-transparent" />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-mono-ui text-xs uppercase tracking-[0.25em] text-foreground/40">
          Updated as new systems ship.
        </p>
      </div>
    </section>
  );
}