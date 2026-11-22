import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { Demo } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/use-motion-preferences";
import { cn } from "@/lib/utils";
import { SimulationBadge } from "../Badges";
import { Icon } from "../icons";
import { DeviceFrame, type CallState } from "./DeviceFrame";
import { DemoItemView } from "./DemoItemView";

const BASE_MS = 2400;
const PER_ITEM_MS = 850;
/** Simulated call clock: each step advances the call by this many seconds. */
const CALL_STEP_SECONDS = 18;

type Props = {
  demo: Demo;
  /** Start playing once the player is mostly in view. */
  autoPlay?: boolean;
  className?: string;
};

/**
 * Plays a scripted demo (src/content/demos.ts) one step at a time, showing the
 * customer's screen beside the operations happening behind the scenes.
 * - Pauses off-screen; stops on the last step (never loops).
 * - Reduced motion: no autoplay; opens on the final step so the whole story is
 *   visible, and every step remains reachable with the controls.
 */
export function DemoPlayer({ demo, autoPlay = true, className }: Props) {
  const reduced = usePrefersReducedMotion();
  const last = demo.steps.length - 1;
  const [step, setStep] = useState(reduced ? last : 0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = `demo-${demo.id}-title`;

  useEffect(() => {
    setStep(reduced ? last : 0);
    setUserPaused(false);
  }, [demo.id, reduced, last]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView && autoPlay && !reduced && !userPaused && step < last) setPlaying(true);
    if (!inView) setPlaying(false);
  }, [inView, autoPlay, reduced, userPaused, step, last]);

  const nextDelay = useMemo(() => {
    const s = demo.steps[Math.min(step + 1, last)];
    return BASE_MS + PER_ITEM_MS * (s.items.length + s.ops.length);
  }, [demo.steps, step, last]);

  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => Math.min(s + 1, last)), nextDelay);
    return () => window.clearTimeout(t);
  }, [playing, step, last, nextDelay]);

  const goTo = useCallback(
    (i: number) => {
      setStep(Math.max(0, Math.min(last, i)));
      setPlaying(false);
      setUserPaused(true);
    },
    [last],
  );
  const toggle = () => {
    if (playing) {
      setPlaying(false);
      setUserPaused(true);
    } else {
      if (step >= last) setStep(0);
      setUserPaused(false);
      setPlaying(true);
    }
  };
  const replay = () => {
    setStep(0);
    setUserPaused(false);
    setPlaying(true);
  };

  const atEnd = step >= last;
  const current = demo.steps[step];
  const mode = demo.device === "call" ? "call" : "chat";
  // Typing indicators are transient: only show them on the current step.
  const screenItems = [
    ...(demo.preface ?? []).map((item, i) => ({ item, key: `p${i}`, fresh: false, delay: 0 })),
    ...demo.steps.slice(0, step + 1).flatMap((s, si) =>
      s.items
        .filter((it) => it.kind !== "typing" || si === step)
        .map((item, ii) => ({
          item,
          key: `${si}-${ii}`,
          fresh: si === step && !reduced,
          delay: ii * 320,
        })),
    ),
  ];
  const call: CallState | undefined =
    demo.device === "call"
      ? {
          status: step === 0 ? "ringing" : atEnd ? "ended" : "live",
          seconds: step * CALL_STEP_SECONDS,
        }
      : undefined;

  const opsCards = (fresh: boolean) =>
    current.ops.map((item, i) => (
      <DemoItemView
        key={`${step}-${i}`}
        item={item}
        fresh={fresh}
        delay={260 + i * 260}
        surface="ops"
      />
    ));

  return (
    <div
      ref={rootRef}
      role="group"
      aria-labelledby={titleId}
      className={cn("grid gap-8 lg:grid-cols-[19.5rem_minmax(0,1fr)] lg:gap-12", className)}
    >
      <h3 id={titleId} className="sr-only">
        {demo.title}: simulated demo
      </h3>

      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-[6%] bottom-[5%] top-[10%] rounded-full bg-purple/20 blur-3xl"
        />
        <div className="relative">
          <DeviceFrame device={demo.device} title={demo.screenTitle} call={call}>
            {screenItems.map(({ item, key, fresh, delay }) => (
              <DemoItemView key={key} item={item} fresh={fresh} delay={delay} mode={mode} />
            ))}
          </DeviceFrame>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold">Behind the scenes</p>
          <SimulationBadge />
        </div>

        {/* Phones and tablets: the active step only, directly under the device. */}
        <div className="lg:hidden">
          {/* Customer-to-team hand-off: a packet drops from the device into the team's side, once per step. */}
          <div
            aria-hidden
            className="relative -mt-4 mb-3 flex h-10 items-center justify-center gap-3 text-[0.8125rem] text-mist"
          >
            <span className="relative h-full w-0.5 rounded-full bg-snow/10">
              {!reduced && step > 0 && (
                <span
                  key={step}
                  className="packet-v absolute left-1/2 top-0 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_#00E5FF]"
                />
              )}
            </span>
            <span>What your team receives</span>
          </div>
          <ol className="mb-4 flex gap-1.5" aria-label="Demo steps">
            {demo.steps.map((s, i) => (
              <li key={s.stage} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Step ${i + 1}: ${s.stage}`}
                  aria-current={i === step ? "step" : undefined}
                  className="flex h-6 w-full items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 w-full rounded-full transition-colors duration-500",
                      i < step ? "bg-cyan/70" : i === step ? "bg-purple" : "bg-snow/15",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl bg-navy-800/70 p-4" aria-live="polite">
            <p className="flex items-center gap-2.5 font-semibold">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-600 text-white">
                <Icon name={current.icon} className="h-4 w-4" />
              </span>
              {current.stage}
            </p>
            <p className="mt-2 text-[0.95rem] text-snow/85">{current.caption}</p>
            {current.ops.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">{opsCards(!reduced)}</div>
            )}
          </div>
        </div>

        {/* Desktop: the full operations pipeline. */}
        <ol className="hidden lg:block" aria-label="Demo steps">
          {demo.steps.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "todo";
            return (
              <li key={s.stage} className="relative pb-3 last:pb-0">
                {i < last && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-[1.15rem] top-[2.6rem] w-0.5 overflow-hidden rounded-full bg-snow/10"
                  >
                    <span
                      className={cn(
                        "block h-full w-full origin-top bg-cyan transition-transform duration-700",
                        i < step ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                  </span>
                )}
                {i === step - 1 && !reduced && (
                  <span
                    aria-hidden
                    key={step}
                    className="packet absolute left-[1.2rem] top-[2.4rem] z-20 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_#00E5FF]"
                  />
                )}
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={state === "active" ? "step" : undefined}
                  className="group flex w-full items-center gap-3.5 rounded-xl text-left"
                >
                  <span
                    className={cn(
                      "relative z-10 grid h-[2.4rem] w-[2.4rem] shrink-0 place-items-center rounded-full transition-all duration-500",
                      state === "done" && "bg-cyan text-navy",
                      state === "active" &&
                        "bg-purple-600 text-white shadow-[0_0_0_5px_rgb(163_60_255/0.22)]",
                      state === "todo" && "bg-navy-700 text-mist group-hover:bg-navy-600",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="h-4 w-4" aria-hidden />
                    ) : (
                      <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[1rem] font-semibold transition-colors",
                      state === "todo" ? "text-mist" : "text-snow",
                    )}
                  >
                    {s.stage}
                  </span>
                </button>
                {state === "active" && (
                  <div className="ml-[3.3rem] mt-2 min-h-[7.5rem]" aria-live="polite">
                    <p className="max-w-lg text-[0.98rem] leading-relaxed text-snow/85">
                      <span className="sr-only">
                        Step {i + 1} of {demo.steps.length}:{" "}
                      </span>
                      {s.caption}
                    </p>
                    {s.ops.length > 0 && (
                      <div className="mt-3 flex max-w-md flex-col gap-2">{opsCards(!reduced)}</div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            aria-label="Previous step"
            className="grid h-11 w-11 place-items-center rounded-full bg-navy-700 transition-colors hover:bg-navy-600 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={atEnd && !playing ? replay : toggle}
            className="btn btn-ghost !min-h-11 !px-5 !text-[0.95rem]"
          >
            {playing ? (
              <>
                <Pause className="h-4 w-4" aria-hidden /> Pause
              </>
            ) : atEnd ? (
              <>
                <RotateCcw className="h-4 w-4" aria-hidden /> Replay
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden /> {step === 0 ? "Play" : "Resume"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={atEnd}
            aria-label="Next step"
            className="grid h-11 w-11 place-items-center rounded-full bg-navy-700 transition-colors hover:bg-navy-600 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
          <span className="ml-1 text-sm tabular-nums text-mist" aria-hidden>
            {step + 1} / {demo.steps.length}
          </span>
        </div>
        <p className="mt-4 max-w-lg text-sm text-mist">{demo.simulationNote}</p>
      </div>
    </div>
  );
}
