type Platform = {
  name: string;
  src?: string;
  text?: string;
  textColor?: string;
  invert?: boolean;
};

const platforms: Platform[] = [
  { name: "n8n", src: "https://n8n.io/favicon.ico" },
  {
    name: "Make.com",
    src: "https://images.ctfassets.net/un655fb9wln6/6HJNHeuWce5PMLaOTqCUzw/00e8de922daf6b6c7f9f2daff22c130e/make-logo-2022.svg",
  },
  { name: "Zapier", src: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg" },
  { name: "GoHighLevel", text: "GHL", textColor: "#FF6B35" },
  { name: "OpenAI", src: "https://openai.com/favicon.ico", invert: true },
  { name: "Supabase", src: "https://supabase.com/brand-assets/supabase-logo-icon.png" },
  { name: "Anthropic", src: "https://anthropic.com/favicon.ico" },
  { name: "HubSpot", src: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png" },
  {
    name: "Gemini",
    src: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_advanced_1743d7f7a7_512px.png",
  },
  { name: "VAPI", text: "VAPI", textColor: "#ffffff" },
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
          {loop.map((p, i) =>
            p.src ? (
              <img
                key={`${p.name}-${i}`}
                src={p.src}
                alt={p.name}
                loading="lazy"
                className={`h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100 ${
                  p.invert ? "invert" : ""
                }`}
              />
            ) : (
              <span
                key={`${p.name}-${i}`}
                className="font-display text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl"
                style={{ color: p.textColor ?? "#ffffff" }}
              >
                {p.text ?? p.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}