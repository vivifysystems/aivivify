import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, CircleCheck, Phone, Play, type LucideIcon } from "lucide-react";
import { homeProof, projectById, proofProjectId } from "@/content";
import { ProjectMedia } from "../work/ProjectMedia";
import { usePrefersReducedMotion } from "@/hooks/use-motion-preferences";
import portrait from "@/assets/optimized/card/viviene-portrait.webp";
import { cn } from "@/lib/utils";

/** Icons for the three steps in `homeProof.steps`. */
const stepIcons: LucideIcon[] = [Phone, CalendarCheck, CircleCheck];

/** Runs the three statuses once when the section scrolls into view; instant with reduced motion. */
function useSequence(count: number) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (reduced) {
      setStage(count);
      return;
    }
    // The prerendered page hydrates with reduced motion assumed; start the sequence from the top.
    setStage(0);
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const tick = (n: number) => {
          setStage(n);
          if (n < count) timer = window.setTimeout(() => tick(n + 1), 900);
        };
        timer = window.setTimeout(() => tick(1), 400);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduced, count]);
  return { ref, stage };
}

/**
 * Proof close to the hero: one approved project, shown as a plainly labelled illustration of
 * the call, what the workflow does step by step, and the real workflow screenshot. The full
 * portfolio stays in /work. It carries no testimonial, statistic or outcome claim.
 */
export function ProofCase() {
  const project = projectById(proofProjectId);
  const { ref, stage } = useSequence(homeProof.steps.length);
  if (!project) return null;

  return (
    <section
      id="proof"
      aria-labelledby="proof-title"
      className="relative scroll-mt-20 bg-navy py-12 sm:py-24"
    >
      <div className="shell grid gap-7 sm:gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div className="lg:col-start-2 lg:row-start-1">
          <p className="kicker text-cyan">{homeProof.kicker}</p>
          <h2 id="proof-title" className="type-h2 mt-3 sm:mt-4">
            {homeProof.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-mist sm:mt-5 sm:text-[1.2rem]">
            {project.caseStudy.problem}
          </p>
        </div>

        <div className="lg:row-span-2 lg:row-start-1">
          <figure aria-label={homeProof.figureLabel} className="mx-auto max-w-sm">
            <div className="overflow-hidden rounded-[1.75rem] bg-ground ring-1 ring-snow/12 shadow-[0_40px_70px_-35px_rgb(0_0_0/0.9)]">
              <div className="flex items-center gap-3 bg-navy-800 px-4 py-2.5 sm:py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {homeProof.device.initial}
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.95rem] font-semibold">
                    {homeProof.device.name}
                  </span>
                  <span className="block text-[0.8125rem] text-mist">
                    {homeProof.device.channel}
                  </span>
                </span>
              </div>
              <div className="space-y-2.5 px-4 py-4 sm:space-y-3 sm:py-5">
                {homeProof.lines.map((l, i) => (
                  <div
                    key={i}
                    className={cn("flex", l.from === "caller" ? "justify-end" : "justify-start")}
                  >
                    <p
                      className={cn(
                        "max-w-[82%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-snug",
                        l.from === "caller"
                          ? "rounded-br-md bg-purple-600 text-white"
                          : "rounded-bl-md bg-navy-700",
                      )}
                    >
                      <span className="sr-only">{l.speaker}: </span>
                      {l.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="mt-3 text-center text-[0.8125rem] text-mist">
              {homeProof.caption}
            </figcaption>
          </figure>
          <figure className="mx-auto mt-6 max-w-sm max-sm:hidden">
            <ProjectMedia
              project={project}
              tinted={false}
              className="aspect-[16/10] rounded-2xl ring-1 ring-snow/10"
            />
            <figcaption className="mt-2 text-center text-[0.8125rem] text-mist">
              {homeProof.workflowCaption}
            </figcaption>
          </figure>
        </div>

        <div ref={ref} className="lg:col-start-2 lg:row-start-2">
          <ol className="grid gap-3" aria-label="What happens, in order">
            {homeProof.steps.map((s, i) => {
              const done = stage > i;
              const Icon = stepIcons[i];
              return (
                <li
                  key={s.title}
                  className="flex items-start gap-4 rounded-2xl bg-navy-800 p-4 ring-1 ring-snow/8"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500",
                      done ? "bg-cyan text-navy" : "bg-navy-700 text-purple-300",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <span className="font-semibold">{s.title}</span>
                      <span
                        className={cn(
                          "tech-label inline-flex items-center gap-1.5 !text-[0.8125rem] transition-colors duration-500",
                          done ? "text-cyan" : "text-[#ffcf85]",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            done ? "bg-cyan" : "bg-[#ffcf85]",
                          )}
                        />
                        <span className="sr-only">Status: </span>
                        {done ? s.done : s.pending}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.95rem] text-mist">{s.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex items-center gap-4 sm:mt-8">
            <img
              src={portrait}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-snow/15"
            />
            <p className="text-[0.95rem] text-snow/90">
              <span className="font-semibold text-snow">I built this.</span> Viviene Pitogo, founder
              of VIVIFY, {homeProof.role}
            </p>
          </div>
          <p className="mt-4 text-[0.875rem] text-mist">{homeProof.pilotNote}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
            <Link to={`/work/${project.id}`} className="btn btn-primary">
              Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {project.demoUrl && (
              <Link to={`/work/${project.id}#demo`} className="link-arrow text-cyan">
                <Play className="h-4 w-4" aria-hidden /> Watch the recorded demo
              </Link>
            )}
            <Link to="/work" className="link-arrow text-snow/80 max-sm:hidden">
              See all projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
