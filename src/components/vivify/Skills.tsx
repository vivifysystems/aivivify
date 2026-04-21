import { SectionHeader } from "./Framework";

const stacks = [
  {
    group: "Automation",
    items: ["n8n", "Make.com", "Zapier", "GoHighLevel"],
  },
  {
    group: "AI / LLMs",
    items: [
      "OpenAI GPT-4o",
      "Claude 3.5",
      "Google Gemini",
      "Manus",
      "Agentic Workflows",
      "RAG Architecture",
      "Voice Agents",
    ],
  },
  {
    group: "Data & Backend",
    items: ["Supabase", "Postgres", "Vector Stores", "Webhooks / APIs"],
  },
  {
    group: "Comms & CRM",
    items: ["Twilio", "Gmail / Workspace", "Slack", "WhatsApp"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Skills"
          title="The Stack I Operate"
          sub="Polyglot across no-code, low-code, and code. Built for resilience."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stacks.map((s) => (
            <div key={s.group} className="glass rounded-2xl p-6">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                {s.group}
              </p>
              <ul className="mt-4 space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-foreground/85">
                    <span className="h-1.5 w-1.5 rounded-sm bg-primary shadow-[0_0_6px_var(--neon)]" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}