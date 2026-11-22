import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CircleCheck,
  MessageSquareReply,
  Play,
  type LucideIcon,
} from "lucide-react";
import { projectById, projectTools, proofProjectId } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/use-motion-preferences";
import portrait from "@/assets/optimized/card/viviene-portrait.webp";
import { cn } from "@/lib/utils";

/**
 * What the business gains, in the order it happens. Each status is a plain statement
 * taken from the documented case study (problem, solution, result); nothing here is a metric.
 */
const steps: { icon: LucideIcon; title: string; detail: string; pending: string; done: string }[] =
  [
    {
      icon: MessageSquareReply,
      title: "A customer asks",
      detail:
        "Pricelist, menu, location: the questions that arrived every day, often at peak order preparation.",
      pending: "Waiting",
      done: "Received",
    },
    {
      icon: Bot,
      title: "The agent answers",
      detail: "From the business's own knowledge base, with nobody on the team stopping work.",
      pending: "Waiting",
      done: "Answered",
    },
    {
      icon: CircleCheck,
      title: "The team keeps working",
      detail: "",
      pending: "Waiting",
      done: "Inquiry kept",
    },
  ];

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
 * Proof close to the hero: one built project, shown as a plainly labelled illustration of
 * the chat plus the documented outcome and Viviene's role. The full portfolio stays in /work.
 */
export function ProofCase() {
  const project = projectById(proofProjectId);
  const { ref, stage } = useSequence(steps.length);
  if (!project) return null;
  const tools = projectTools(project);

  return (
    <section
      id="proof"
      aria-labelledby="proof-title"
      className="relative scroll-mt-20 bg-navy py-12 sm:py-24"
    >
      <div className="shell grid gap-7 sm:gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div className="lg:col-start-2 lg:row-start-1">
          <p className="kicker text-cyan">A built example · Facebook Messenger</p>
          <h2 id="proof-title" className="type-h2 mt-3 sm:mt-4">
            Inquiries answered while the team is busy preparing orders.
          </h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-mist sm:mt-5 sm:text-[1.2rem]">
            A local catering business got pricelist, menu and location questions on Facebook every
            day, and messages sat unanswered during peak order preparation.
          </p>
        </div>

        <div className="lg:row-span-2 lg:row-start-1">
          <figure
            aria-label="Illustration of a Messenger inquiry and reply"
            className="mx-auto max-w-sm"
          >
            <div className="overflow-hidden rounded-[1.75rem] bg-ground ring-1 ring-snow/12 shadow-[0_40px_70px_-35px_rgb(0_0_0/0.9)]">
              <div className="flex items-center gap-3 bg-navy-800 px-4 py-2.5 sm:py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  C
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.95rem] font-semibold">Catering business</span>
                  <span className="block text-[0.8125rem] text-mist">Messenger</span>
                </span>
              </div>
              <div className="space-y-2.5 px-4 py-4 sm:space-y-3 sm:py-5">
                <div className="flex justify-end">
                  <p className="max-w-[82%] rounded-2xl rounded-br-md bg-purple-600 px-4 py-2.5 text-[0.95rem] leading-snug text-white">
                    <span className="sr-only">Customer: </span>
                    Hi! Could I see your menu and pricelist?
                  </p>
                </div>
                <div className="flex justify-start">
                  <p className="max-w-[82%] rounded-2xl rounded-bl-md bg-navy-700 px-4 py-2.5 text-[0.95rem] leading-snug">
                    <span className="sr-only">Business reply: </span>
                    Of course. Here's our current menu and pricelist.
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-[0.8125rem] text-mist">
              Illustrated example, not a real conversation. The wording is written for this page.
            </figcaption>
          </figure>
        </div>

        <div ref={ref} className="lg:col-start-2 lg:row-start-2">
          <ol className="grid gap-3" aria-label="What happens, in order">
            {steps.map((s, i) => {
              const done = stage > i;
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
                    <s.icon className="h-5 w-5" aria-hidden />
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
                    <span className="mt-1 block text-[0.95rem] text-mist">
                      {s.detail || project.impact}
                    </span>
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
              of VIVIFY, designed and built the agent on {tools.slice(0, 2).join(" and ")},
              connected to the business's actual knowledge base.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
            <Link to={`/work/${project.id}`} className="btn btn-primary">
              Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={`/work/${project.id}#demo`} className="link-arrow text-cyan">
              <Play className="h-4 w-4" aria-hidden /> Watch the recorded demo
            </Link>
            <Link to="/work" className="link-arrow text-snow/80 max-sm:hidden">
              See all projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
