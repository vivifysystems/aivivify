import { useEffect, useState } from "react";
import { SectionHeader } from "./Framework";
import { useStaggerReveal } from "./TiltCard";
import coverFileManagement from "@/assets/cover-file-management.png";
import coverRag from "@/assets/cover-rag.jpeg";
import coverLeadNurturing from "@/assets/cover-lead-nurturing.png";
import coverFinancialSync from "@/assets/cover-financial-sync.png";
import coverLeadRouting from "@/assets/cover-lead-routing.png";
import coverSocialEngine from "@/assets/cover-social-engine.png";
import coverVoice from "@/assets/cover-voice-receptionist.png";
import coverFbAgent from "@/assets/cover-fb-messenger-agent.png";
import proofVoice from "@/assets/proof-voice-receptionist.jpg";
import proofFbAgent from "@/assets/proof-fb-messenger-agent.png";
import proofFileManagement from "@/assets/proof-file-management.png";
import proofRag from "@/assets/proof-rag.png";
import proofLeadNurturing from "@/assets/proof-lead-nurturing.png";
import proofFinancialSync from "@/assets/proof-financial-sync.png";
import proofLeadRouting from "@/assets/proof-lead-routing.png";
import proofSocialEngine from "@/assets/proof-social-engine.png";

type Project = {
  tag: string;
  title: string;
  value: string;
  stack: string[];
  image?: string;
  proofImage?: string;
  impact: string;
  beta?: boolean;
  caseStudy?: { problem: string; solution: string; result: string };
  demoUrl?: string;
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
      "Missed calls dropped to zero. Bookings come in 24/7 without any staff involvement.",
    caseStudy: {
      problem:
        "A high-volume local business was missing calls outside business hours and during busy periods. Every missed call was a missed booking with no way to recover it.",
      solution:
        "Built an AI voice receptionist named Bobby using n8n and VAPI. Bobby answers calls, handles FAQs, and books appointments directly into Google Calendar — around the clock.",
      result:
        "Zero missed calls after hours. Bookings continue even at 2 AM without any human involvement.",
    },
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
      "Hours of manual file sorting eliminated. Attachments are renamed, categorized, and filed the moment they arrive.",
    caseStudy: {
      problem:
        "A business was drowning in Gmail attachments — invoices, contracts, reports — all arriving with generic filenames and piling up unsorted in their inbox.",
      solution:
        "Built an automated pipeline using Make.com and Gemini that monitors Gmail, semantically renames each attachment based on its content, and sorts it into the correct Google Drive folder automatically.",
      result:
        "Zero manual file sorting. Every attachment is named, categorized, and filed within seconds of arrival.",
    },
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
      "AI agents stay current automatically — no manual retraining or document updates needed.",
    caseStudy: {
      problem:
        "AI agents become outdated the moment new documents, policies, or SOPs are added to a business. Keeping them current required manual re-uploads and constant maintenance.",
      solution:
        "Built a RAG pipeline using n8n and Supabase that watches a Google Drive folder. The moment a new file is added, it's automatically chunked, embedded, and stored in a vector database — making it instantly available to AI agents.",
      result:
        "Knowledge base updates itself in real time. AI agents always have access to the latest information without any human intervention.",
    },
    demoUrl: "https://drive.google.com/file/d/181UOMmc9xRvEgQr0hXrdjAn-D8HTs_tU/preview",
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
      "No lead goes cold. Every prospect gets the right follow-up on the right channel at the right time — automatically.",
    caseStudy: {
      problem:
        "Sales teams were manually deciding when and how to follow up with leads — resulting in inconsistent outreach, forgotten prospects, and lost revenue.",
      solution:
        "Built a smart branching automation in GoHighLevel that triggers personalized SMS, call, and email sequences based on lead behavior and pipeline stage.",
      result:
        "Follow-up happens automatically across all channels. No lead falls through the cracks regardless of team availability.",
    },
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
      "Financial tasks are logged and assigned automatically — no manual data entry between tools.",
    caseStudy: {
      problem:
        "Finance teams were manually cross-referencing Xero transactions and creating Asana tasks for each one — a repetitive process prone to errors and delays.",
      solution:
        "Built a Make.com automation that monitors Xero for new transactions, creates an audit log in Google Sheets, and automatically generates the corresponding task in Asana.",
      result:
        "Every financial event is tracked and actioned automatically. Manual data entry between tools eliminated entirely.",
    },
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
      "Every lead reaches the right rep instantly — with full context, zero manual sorting.",
    caseStudy: {
      problem:
        "High-ticket sales teams were manually reviewing and routing inbound leads — slow, inconsistent, and causing the best leads to sit uncontacted for hours.",
      solution:
        "Built a Zapier automation with AI personalization that scores each lead, routes them to the correct sales rep based on criteria, and prepares a personalized context brief before the first call.",
      result:
        "Lead response time cut to minutes. Every rep gets the right lead with the right context at the right moment.",
    },
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
      "Raw recordings become published posts automatically — content output increased without added effort.",
    caseStudy: {
      problem:
        "A business had hours of recorded video and audio content sitting unused because manually transcribing, editing, and cross-posting to multiple platforms was too time-consuming.",
      solution:
        "Built a Zapier pipeline with AI that auto-transcribes uploaded media, generates platform-optimized captions, and cross-posts to LinkedIn and Facebook Pages automatically.",
      result:
        "Content publishes itself across platforms within minutes of upload. Zero manual editing or posting required.",
    },
  },
  {
    tag: "Multi-Agent · LLM",
    title: "Advanced Multi-Agent Research System",
    value:
      "An orchestrated network of specialized AI agents that plan, research, critique, and synthesize long-form intelligence reports autonomously.",
    stack: ["LangGraph", "OpenAI", "Anthropic", "Supabase"],
    impact:
      "Long-form intelligence reports produced autonomously — what took days of research now runs in the background.",
    beta: true,
    caseStudy: {
      problem:
        "Producing comprehensive research reports required hours of manual searching, synthesizing, and writing — not scalable for teams that need regular intelligence output.",
      solution:
        "Built an orchestrated multi-agent system using LangGraph, OpenAI, and Anthropic where specialized agents divide responsibilities — one plans, one researches, one critiques, one writes — running the full cycle autonomously.",
      result:
        "Full research reports generated end-to-end without human input. Currently in beta with ongoing refinement.",
    },
  },
  {
    tag: "n8n · Gemini",
    title: "24/7 Facebook Messenger AI Agent",
    value:
      "Turns repetitive Facebook inquiries into instant automated replies — so the business never misses a lead, even during peak hours.",
    stack: ["n8n", "Google Gemini", "Webhook", "Facebook Messenger"],
    image: coverFbAgent,
    proofImage: proofFbAgent,
    impact:
      "Response time dropped from 3–5 hours to under 10 seconds. The team no longer loses inquiries during their busiest hours.",
    caseStudy: {
      problem:
        "A local catering business was receiving 15–20 Facebook inquiries daily — pricelist, menu, location — but messages sat unanswered for 3–5 hours during peak order preparation. Potential customers were left waiting or went elsewhere.",
      solution:
        "Built a 24/7 AI agent on Facebook Messenger using n8n and Google Gemini, connected to the business's actual knowledge base. It handles all repetitive questions instantly without any human intervention.",
      result:
        "Response time dropped from 3–5 hours to under 10 seconds. The team no longer loses inquiries during their busiest hours.",
    },
    demoUrl: "https://drive.google.com/file/d/17t8nT8wexs1aVj8QrgZLgZrJH2jlQpBn/preview",
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

  // JS-driven marquee — guarantees motion regardless of OS "Reduce Motion"
  // setting and keeps direction/speed identical across breakpoints.
  useEffect(() => {
    const track = document.querySelector<HTMLDivElement>(
      "#projects .card-marquee-track",
    );
    if (!track) return;

    const SPEED = 60; // pixels per second — consistent on all breakpoints
    let offset = 0;
    let last = performance.now();
    let paused = false;
    let raf = 0;

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        offset -= SPEED * dt;
        const half = track.scrollWidth / 2;
        if (half > 0 && -offset >= half) offset += half;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Projects"
          title="Highlighted Production Systems"
          sub="Real workflows. Real results. Click any card to see the problem, solution, and outcome."
        />

        <div className="card-marquee-mask mt-12 overflow-hidden">
          <div className="card-marquee-track">
            {[...projects, ...projects].map((p, i) => (
              <article
                key={i}
                className="project-card glass group relative flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl text-left sm:w-[380px]"
              >
                <span className="card-shine" aria-hidden />
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
                      CASE {String((i % projects.length) + 1).padStart(2, "0")}
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
              </article>
            ))}
          </div>
        </div>
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showDemo, setShowDemo] = useState(false);
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

        {project.caseStudy && (
          <div className="mt-8 grid gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                Problem
              </p>
              <p className="mt-3 leading-relaxed text-foreground/85">{project.caseStudy.problem}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                Solution
              </p>
              <p className="mt-3 leading-relaxed text-foreground/85">{project.caseStudy.solution}</p>
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                Result
              </p>
              <p className="mt-3 leading-relaxed text-foreground/85">{project.caseStudy.result}</p>
            </div>
          </div>
        )}

        {project.demoUrl && (
          <div className="mt-8">
            {!showDemo ? (
              <button
                onClick={() => setShowDemo(true)}
                className="arrow-slide-host inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-5 py-3 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
              >
                ▶ Watch Demo <span className="arrow-slide" aria-hidden>→</span>
              </button>
            ) : (
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                  Live Demo
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-black">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={project.demoUrl}
                      title={`${project.title} demo`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
