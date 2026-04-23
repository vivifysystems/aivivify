import { useEffect, useState } from "react";
import { SectionHeader } from "./Framework";
import { TiltCard, useStaggerReveal } from "./TiltCard";
import { cn } from "@/lib/utils";
import coverFileManagement from "@/assets/cover-file-management.png";
import coverRag from "@/assets/cover-rag.jpeg";
import coverLeadNurturing from "@/assets/cover-lead-nurturing.png";
import coverFinancialSync from "@/assets/cover-financial-sync.png";
import coverLeadRouting from "@/assets/cover-lead-routing.png";
import coverSocialEngine from "@/assets/cover-social-engine.png";
import coverVoice from "@/assets/cover-voice-receptionist.png";
import proofVoice from "@/assets/proof-voice-receptionist.jpg";
import proofFileManagement from "@/assets/proof-file-management.png";
import proofRag from "@/assets/proof-rag.png";
import proofLeadNurturing from "@/assets/proof-lead-nurturing.png";
import proofFinancialSync from "@/assets/proof-financial-sync.png";
import proofLeadRouting from "@/assets/proof-lead-routing.png";
import proofSocialEngine from "@/assets/proof-social-engine.png";

// Bento grid spans (lg = 6 cols). Mix of large hero tiles and standard tiles
// for an asymmetric, high-tech layout. Mobile/tablet stays uniform.
const bentoSpan = (i: number): string => {
  const map: Record<number, string> = {
    0: "lg:col-span-3 lg:row-span-2", // Bobby — hero
    1: "lg:col-span-3",
    2: "lg:col-span-3",
    3: "lg:col-span-2",
    4: "lg:col-span-2",
    5: "lg:col-span-2",
    6: "lg:col-span-3",
    7: "lg:col-span-3",
  };
  return map[i] ?? "lg:col-span-2";
};

type Project = {
  tag: string;
  title: string;
  value: string;
  stack: string[];
  image?: string;
  proofImage?: string;
  impact: string;
  beta?: boolean;
};

const projects: Project[] = [
  {
    tag: "n8n + VAPI",
    title: "24/7 AI Voice Receptionist ('Bobby')",
    value:
      "Automated booking and customer support for high-volume local businesses using n8n and VAPI.",
    stack: ["n8n", "VAPI", "Google Calendar", "Airtable"],
    image: coverVoice,
    proofImage: proofVoice,
    impact:
      "Handles 100% of after-hours calls — books, reschedules, and cancels appointments without human input. Recovers ~30+ missed-call bookings per month for local businesses.",
  },
  {
    tag: "Gmail + Gemini",
    title: "Intelligent File Management",
    value:
      "AI-powered semantic renaming and sorting of Gmail attachments using Make.com and Gemini.",
    stack: ["Make.com", "Gemini", "Gmail", "Google Drive"],
    image: coverFileManagement,
    proofImage: proofFileManagement,
    impact:
      "Eliminates ~5 hours/week of manual filing. Every attachment becomes instantly searchable and audit-ready — turning a chaotic inbox into a structured archive.",
  },
  {
    tag: "RAG Pipeline",
    title: "Self-Updating AI Knowledge Base",
    value:
      "A dynamic pipeline that 'teaches' AI agents from new Google Drive uploads using n8n and Supabase.",
    stack: ["n8n", "Supabase", "pgvector", "Gemini"],
    image: coverRag,
    proofImage: proofRag,
    impact:
      "Zero stale answers. Support agents respond with current SOPs the moment a doc is updated, cutting hallucinations and removing manual reindexing entirely.",
  },
  {
    tag: "GHL Automation",
    title: "Multi-Channel Lead Nurturing",
    value:
      "Smart branching logic for automated SMS, Call, and Email follow-ups built in GoHighLevel (GHL).",
    stack: ["GoHighLevel", "SMS", "Email", "Conditional Logic"],
    image: coverLeadNurturing,
    proofImage: proofLeadNurturing,
    impact:
      "Response time reduced to <30 seconds. Higher booked-call conversion with zero human babysitting — every lead nurtured on the right channel at the right moment.",
  },
  {
    tag: "Xero + Asana",
    title: "Xero & Asana Financial Sync",
    value:
      "Automated accounting audit logs and task synchronization between Xero and Asana via Make.com.",
    stack: ["Xero", "Asana", "Make.com", "Google Sheets"],
    image: coverFinancialSync,
    proofImage: proofFinancialSync,
    impact:
      "Zero double-entry. Finance and ops share one source of truth with a full audit trail — eliminating billing errors and missed milestones.",
  },
  {
    tag: "Zapier · AI · CRM",
    title: "Complex Lead Routing",
    value:
      "Path-based routing and AI personalization for high-ticket sales — every lead lands with the right rep, with the right context, at the right moment.",
    stack: ["Zapier", "AI", "CRM"],
    image: coverLeadRouting,
    proofImage: proofLeadRouting,
    impact:
      "Higher SQL rate and faster handoffs. Senior reps focus only on top-tier opportunities while every lead receives a personalized, stage-specific touch — no hot lead ever goes cold.",
  },
  {
    tag: "Content Engine",
    title: "Social Media Content Engine",
    value:
      "Auto-transcribing media and intelligent cross-posting to LinkedIn and Facebook using Zapier and AI.",
    stack: ["Zapier", "AI by Zapier", "LinkedIn", "Facebook Pages"],
    image: coverSocialEngine,
    proofImage: proofSocialEngine,
    impact:
      "5×+ output per week with consistent branding. One source file becomes a transcribed blog + scheduled multi-platform posts — zero manual editing.",
  },
  {
    tag: "Multi-Agent · LLM",
    title: "Advanced Multi-Agent Research System",
    value:
      "An orchestrated network of specialized AI agents that plan, research, critique, and synthesize long-form intelligence reports autonomously.",
    stack: ["LangGraph", "OpenAI", "Anthropic", "Supabase"],
    impact:
      "Currently in private beta. Early benchmarks show 10× faster research cycles vs. a single-agent baseline, with self-correcting outputs that need minimal human review.",
    beta: true,
  },
];

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  useStaggerReveal("#projects [data-reveal]");

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
          title="Featured Production Systems"
          sub="Seven systems shipped or shipping. Click any card to view the workflow proof — problem, solution, and measurable result."
        />

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {projects.map((p, i) => (
            <TiltCard
              key={i}
              as="article"
              data-reveal
              data-reveal-index={i}
              className={cn(
                "glass group relative flex flex-col overflow-hidden rounded-2xl text-left",
                "project-card",
                bentoSpan(i),
              )}
            >
              <div className="relative aspect-[3/2] overflow-hidden border-b border-white/10 bg-black">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="grid-bg flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background">
                    <span className="font-display text-5xl font-black text-primary/80 [text-shadow:0_0_24px_rgba(0,255,65,0.5)]">
                      ⌬
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-background/70 px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur">
                  {p.tag}
                </span>
                {p.beta && (
                  <span className="badge-beta absolute right-3 top-3 rounded-full border border-primary/70 bg-primary/15 px-2.5 py-1 font-mono-ui text-[10px] font-bold uppercase tracking-[0.25em] text-primary backdrop-blur">
                    Beta · In Progress
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono-ui text-[10px] text-foreground/40">
                    CASE {String(i + 1).padStart(2, "0")}
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
                  className="arrow-slide-host mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-4 py-2.5 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                  View Workflow Proof <span className="arrow-slide" aria-hidden>→</span>
                </button>
              </div>
            </TiltCard>
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
        className="glass-strong relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl p-8 animate-[fade-in_0.25s_ease-out]"
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

        <div className="mt-6">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
            Workflow Proof
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-black">
            {project.proofImage ? (
              <img
                src={project.proofImage}
                alt={`${project.title} workflow screenshot`}
                className="h-auto w-full object-contain"
              />
            ) : (
              <div className="grid-bg flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center">
                <div>
                  <p className="font-display text-2xl font-bold text-primary">
                    🔬 Workflow under active development
                  </p>
                  <p className="mt-3 text-sm text-foreground/70">
                    Diagrams and demo footage will be published when the system exits private beta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
              Technical Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
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
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
              Business Impact
            </p>
            <p className="mt-3 leading-relaxed text-foreground/85">{project.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
