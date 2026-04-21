import { useEffect, useState } from "react";
import { SectionHeader } from "./Framework";

type Project = {
  tag: string;
  title: string;
  client: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
};

const projects: Project[] = [
  {
    tag: "AI Voice Agent",
    title: "24/7 AI Voice Receptionist — “Bobby”",
    client: "Bobert’s Yummy Lechon",
    problem:
      "Missed calls and after-hours bookings were costing the business orders. Manual phone handling couldn’t scale during peak holiday rush.",
    solution:
      "Built a custom AI voice receptionist (“Bobby”) on a Twilio + LLM stack with menu knowledge, real-time availability lookup, and direct calendar booking handoff.",
    result:
      "100% automated booking pipeline. Zero missed calls, full conversation logs, and a measurable lift in confirmed orders during peak season.",
    stack: ["Twilio", "OpenAI", "n8n", "Google Calendar"],
  },
  {
    tag: "Make.com + Gemini",
    title: "Intelligent File Management",
    client: "Operations Workflow",
    problem:
      "Inboxes flooded with attachments named “Record.csv”, “scan_001.pdf” — impossible to search, sort, or audit later.",
    solution:
      "Make.com scenario monitors Gmail, sends each file to Gemini for semantic analysis, generates a meaningful filename, and routes it into the correct Drive folder while logging every move in Sheets.",
    result:
      "AI-powered semantic renaming + auto-sorting. Full searchable archive with zero manual intervention.",
    stack: ["Make.com", "Gemini", "Gmail", "Google Drive"],
  },
  {
    tag: "RAG Pipeline",
    title: "Self-Updating AI Knowledge Base",
    client: "Internal AI Agents",
    problem:
      "AI agents hallucinated or returned stale answers because their knowledge base wasn’t kept in sync with source documents.",
    solution:
      "n8n pipeline watches Google Drive, chunks and embeds new/updated files, and upserts vectors into Supabase pgvector — feeding a Gemini-powered agent with always-fresh context.",
    result:
      "Real-time RAG. Agents respond with current info the moment a document is updated. Zero manual reindexing.",
    stack: ["n8n", "Supabase", "pgvector", "Gemini"],
  },
  {
    tag: "GHL Automation",
    title: "Multi-Channel Lead Nurturing",
    client: "Coaching / Services Brand",
    problem:
      "Leads went cold within minutes. Reps couldn’t reply fast enough across SMS, email, and DM channels.",
    solution:
      "GoHighLevel workflow with smart branching: instant SMS + email on form submit, conditional follow-ups based on reply intent (INTERESTED → contract send), with timeouts and graceful fallbacks.",
    result:
      "Response time reduced to <30 seconds. Higher booked-call rate with zero human babysitting.",
    stack: ["GoHighLevel", "SMS", "Email", "Conditional Logic"],
  },
];

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
  }, [active]);

  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Projects"
          title="Systems In Production"
          sub="Click any card to view the problem, solution, and measurable result."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(p)}
              className="glass group relative overflow-hidden rounded-2xl p-7 text-left transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                  {p.tag}
                </span>
                <span className="font-mono-ui text-[10px] text-foreground/40">
                  CASE 0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold leading-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60">{p.client}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-mono-ui text-[10px] uppercase tracking-widest text-primary/90"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 font-mono-ui text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open case study →
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8 animate-[fade-in_0.25s_ease-out]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-primary/30 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
        >
          ✕ Close
        </button>

        <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
          {project.tag}
        </span>
        <h3 className="mt-3 font-display text-3xl font-bold">{project.title}</h3>
        <p className="mt-1 text-sm text-foreground/60">{project.client}</p>

        <div className="mt-8 space-y-6">
          <Block label="Problem" body={project.problem} />
          <Block label="Solution" body={project.solution} accent />
          <Block label="Result" body={project.result} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-primary/40 bg-primary/5" : "border-white/10 bg-white/[0.02]"}`}>
      <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">{label}</p>
      <p className="mt-2 text-foreground/85 leading-relaxed">{body}</p>
    </div>
  );
}