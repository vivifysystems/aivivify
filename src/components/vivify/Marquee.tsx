const platforms = [
  "n8n",
  "Make.com",
  "Zapier",
  "GoHighLevel",
  "OpenAI",
  "Supabase",
  "Anthropic",
  "HubSpot",
  "Gemini",
  "VAPI",
];

export function Marquee() {
  // Duplicate list so the -50% translate creates a seamless loop.
  const loop = [...platforms, ...platforms];

  return (
    <section
      aria-label="Expertise in industry-leading platforms"
      className="relative border-y border-primary/15 bg-black/40 py-10"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center font-mono-ui text-[10px] uppercase tracking-[0.4em] text-primary/80">
          Expertise in Industry-Leading Platforms
        </p>
      </div>

      <div
        className="relative mt-6 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center gap-14 whitespace-nowrap py-2">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-2xl font-bold uppercase tracking-[0.18em] text-foreground/55 transition-colors hover:text-primary sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}