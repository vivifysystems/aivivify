import n8nLogo from "@/assets/logos/n8n.svg";
import makeLogo from "@/assets/logos/make.svg";
import zapierLogo from "@/assets/logos/zapier.svg";
import supabaseLogo from "@/assets/logos/supabase.svg";
import anthropicLogo from "@/assets/logos/anthropic.svg";
import hubspotLogo from "@/assets/logos/hubspot.svg";
import geminiLogo from "@/assets/logos/gemini.svg";
import openaiLogo from "@/assets/logos/openai.svg";

type Platform = {
  name: string;
  src?: string;
  text?: string;
  textColor?: string;
  invert?: boolean;
};

const platforms: Platform[] = [
  { name: "n8n", src: n8nLogo },
  { name: "Make.com", src: makeLogo },
  { name: "Zapier", src: zapierLogo },
  { name: "GoHighLevel", text: "GHL", textColor: "#FF6B35" },
  { name: "OpenAI", src: openaiLogo },
  { name: "Supabase", src: supabaseLogo },
  { name: "Anthropic", src: anthropicLogo },
  { name: "HubSpot", src: hubspotLogo },
  { name: "Gemini", src: geminiLogo },
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