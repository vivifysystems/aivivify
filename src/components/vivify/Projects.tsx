import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./Framework";
import { cardImage, fullImage } from "./media";
import { projects, type Project } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/use-motion-preferences";

const SPEED = 60; // pixels per second — consistent on all breakpoints

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = userPaused || active !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
  }, [active]);

  // JS-driven marquee. Disabled entirely for visitors who prefer reduced motion
  // (they get a static, swipeable row instead). Pauses on hover, on keyboard focus,
  // via the pause button, and while a case study is open.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reducedMotion) {
      offsetRef.current = 0;
      track.style.transform = "";
      return;
    }
    if (paused) return;

    let last = performance.now();
    let hovered = false;
    let focused = false;
    let raf = 0;

    const onEnter = () => (hovered = true);
    const onLeave = () => (hovered = false);
    const onFocusIn = () => (focused = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!track.contains(e.relatedTarget as Node | null)) focused = false;
    };
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("focusin", onFocusIn);
    track.addEventListener("focusout", onFocusOut);

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!hovered && !focused) {
        offsetRef.current -= SPEED * dt;
        const half = track.scrollWidth / 2;
        if (half > 0 && -offsetRef.current >= half) offsetRef.current += half;
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("focusin", onFocusIn);
      track.removeEventListener("focusout", onFocusOut);
    };
  }, [reducedMotion, paused]);

  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Projects"
          title="Highlighted Production Systems"
          sub="Real workflows. Real results. Click any card to see the problem, solution, and outcome."
        />

        {!reducedMotion && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-pressed={userPaused}
              className="rounded-full border border-primary/30 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {userPaused ? "▶ Play carousel" : "❚❚ Pause carousel"}
            </button>
          </div>
        )}

        <div
          className={
            reducedMotion
              ? "mt-12 snap-x snap-mandatory overflow-x-auto pb-4"
              : "card-marquee-mask mt-4 overflow-hidden"
          }
        >
          <div ref={trackRef} className="card-marquee-track">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
            ))}
            {/* Visual-only copies for the seamless loop: hidden from assistive tech and focus. */}
            {!reducedMotion &&
              projects.map((p, i) => (
                <ProjectCard key={`${p.id}-clone`} project={p} index={i} onOpen={setActive} clone />
              ))}
          </div>
        </div>
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectCard({
  project: p,
  index,
  onOpen,
  clone = false,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  clone?: boolean;
}) {
  const image = cardImage(p.media.card);
  return (
    <article
      aria-hidden={clone || undefined}
      inert={clone || undefined}
      className="project-card glass group relative flex w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl text-left sm:w-[380px]"
    >
      <span className="card-shine" aria-hidden />
      <div className="relative aspect-[3/2] overflow-hidden border-b border-white/10 bg-black">
        {image ? (
          <img
            src={image}
            alt={p.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid-bg flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background">
            <span
              aria-hidden
              className="font-display text-5xl font-black text-primary/80 [text-shadow:0_0_24px_rgba(0,255,65,0.5)]"
            >
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
            CASE {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-tight">{p.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/65">{p.summary}</p>

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
          type="button"
          onClick={() => onOpen(p)}
          className="arrow-slide-host mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-4 py-2.5 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
        >
          View Workflow Proof{" "}
          <span className="arrow-slide" aria-hidden>
            →
          </span>
        </button>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [showDemo, setShowDemo] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const proof = fullImage(project.media.proof);
  const titleId = `project-modal-title-${project.id}`;

  // Move focus into the dialog on open and give it back to the trigger on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl p-8 animate-[fade-in_0.25s_ease-out]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-primary/30 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
        >
          ✕ Close
        </button>

        <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
          {project.tag}
        </span>
        <h3 id={titleId} className="mt-3 font-display text-3xl font-bold">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-foreground/70">{project.summary}</p>

        <div className="mt-6">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">
            Workflow Proof
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-black">
            {proof ? (
              <img
                src={proof}
                alt={`${project.title} workflow screenshot`}
                decoding="async"
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

        {project.demoUrl && (
          <div className="mt-8">
            {!showDemo ? (
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="arrow-slide-host inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-5 py-3 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
              >
                ▶ Watch Demo{" "}
                <span className="arrow-slide" aria-hidden>
                  →
                </span>
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
