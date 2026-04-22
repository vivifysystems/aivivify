import { useEffect, useState } from "react";
import { SectionHeader } from "./Framework";
import coverFileManagement from "@/assets/cover-file-management.png";
import coverRag from "@/assets/cover-rag.jpeg";
import coverLeadNurturing from "@/assets/cover-lead-nurturing.png";
import coverFinancialSync from "@/assets/cover-financial-sync.png";
import coverLeadRouting from "@/assets/cover-lead-routing.png";
import coverSocialEngine from "@/assets/cover-social-engine.png";

type Project = {
  tag: string;
  title: string;
  value: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  image: string;
  proofUrl?: string;
};

const projects: Project[] = [
  {
    tag: "Gmail + Gemini",
    title: "Intelligent File Management",
    value:
      "Auto-rename, classify, and file every email attachment so your Drive becomes a searchable archive — with zero manual work.",
    problem:
      "Inboxes flooded with attachments named “Record.csv”, “scan_001.pdf” — impossible to search, sort, or audit later.",
    solution:
      "Make.com scenario monitors Gmail, sends each file to Gemini for semantic analysis, generates a meaningful filename, and routes it into the correct Drive folder while logging every move in Sheets.",
    result:
      "AI-powered semantic renaming + auto-sorting. Full searchable archive with zero manual intervention.",
    stack: ["Make.com", "Gemini", "Gmail", "Google Drive"],
    image: coverFileManagement,
  },
  {
    tag: "RAG Pipeline",
    title: "Self-Updating AI Knowledge Base",
    value:
      "Your AI agents always answer with the latest source-of-truth — documents are embedded the moment they change.",
    problem:
      "AI agents hallucinated or returned stale answers because their knowledge base wasn’t kept in sync with source documents.",
    solution:
      "n8n pipeline watches Google Drive, chunks and embeds new/updated files, and upserts vectors into Supabase pgvector — feeding a Gemini-powered agent with always-fresh context.",
    result:
      "Real-time RAG. Agents respond with current info the moment a document is updated. Zero manual reindexing.",
    stack: ["n8n", "Supabase", "pgvector", "Gemini"],
    image: coverRag,
  },
  {
    tag: "GHL Automation",
    title: "Multi-Channel Lead Nurturing",
    value:
      "Reach every new lead in under 30 seconds across SMS, email, and DM — with smart branching that adapts to their reply.",
    problem:
      "Leads went cold within minutes. Reps couldn’t reply fast enough across SMS, email, and DM channels.",
    solution:
      "GoHighLevel workflow with smart branching: instant SMS + email on form submit, conditional follow-ups based on reply intent (INTERESTED → contract send), with timeouts and graceful fallbacks.",
    result:
      "Response time reduced to <30 seconds. Higher booked-call rate with zero human babysitting.",
    stack: ["GoHighLevel", "SMS", "Email", "Conditional Logic"],
    image: coverLeadNurturing,
  },
  {
    tag: "Xero + Asana",
    title: "Xero & Asana Financial Sync",
    value:
      "Invoices, payments, and project tasks stay in lockstep — finance and delivery teams finally see the same numbers.",
    problem:
      "Finance lived in Xero, delivery lived in Asana. Status mismatches caused billing errors and missed milestones.",
    solution:
      "Two-way sync: invoice status in Xero updates the matching Asana task, and completed milestones in Asana trigger draft invoices in Xero — fully reconciled in a master sheet.",
    result:
      "Zero double-entry. Finance and ops share one source of truth, with audit trail on every change.",
    stack: ["Xero", "Asana", "n8n", "Google Sheets"],
    image: coverFinancialSync,
  },
  {
    tag: "Lead Routing",
    title: "Complex Lead Routing & Personalization",
    value:
      "Every inbound lead is scored, enriched, and routed to the right rep with a personalized first-touch message.",
    problem:
      "High-value leads were treated identically to tire-kickers, slowing conversion and wasting senior rep time.",
    solution:
      "Multi-step workflow enriches leads via Clearbit, scores them on fit + intent, routes by territory/tier, and drafts a personalized opener using GPT-4o.",
    result:
      "Higher SQL rate, faster handoffs, and senior reps focused only on top-tier opportunities.",
    stack: ["n8n", "Clearbit", "GPT-4o", "HubSpot"],
    image: coverLeadRouting,
  },
  {
    tag: "Content Engine",
    title: "Social Media Content Engine",
    value:
      "Turn one long-form idea into a week of LinkedIn posts, Reels, and Shorts — published on schedule, on-brand.",
    problem:
      "Consistent multi-platform posting was eating hours every week and still missed cadence.",
    solution:
      "Pipeline that scripts, generates voiceover + captions, renders short-form video, and schedules posts across LinkedIn, Facebook Reels, and YouTube Shorts.",
    result:
      "5×+ output per week with consistent branding and zero manual editing.",
    stack: ["n8n", "ElevenLabs", "OpenAI", "Buffer"],
    image: coverSocialEngine,
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
          title="Project Gallery"
          sub="Six production systems. Click any card to view the workflow proof — problem, solution, and measurable result."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <article
              key={i}
              className="glass group relative flex flex-col overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-[0_0_40px_rgba(0,255,65,0.28)]"
            >
              <div className="relative aspect-[3/2] overflow-hidden border-b border-white/10 bg-black">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-background/70 px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur">
                  {p.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono-ui text-[10px] text-foreground/40">
                    CASE 0{i + 1}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold leading-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {p.value}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-widest text-primary/90"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActive(p)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-4 py-2.5 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                  View Workflow Proof →
                </button>
              </div>
            </article>
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
        <p className="mt-2 text-sm text-foreground/70">{project.value}</p>

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