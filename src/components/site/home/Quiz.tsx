import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { contactFormActive, packages, quizQuestions, systemById, systems } from "@/content";
import { describeRecommendation, scoreQuiz, type QuizAnswers } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { Icon } from "../icons";
import { SectionHeading } from "../SectionHeading";
import { ViviAvatar } from "../Vivi";

const levelCopy = {
  foundation: {
    title: "You've got a solid foundation.",
    line: "Your answers suggest the basics are covered. A small, targeted improvement may still free up time.",
  },
  clear: {
    title: "There are clear opportunities here.",
    line: "A few repetitive tasks are probably costing your team time and some inquiries.",
  },
  high: {
    title: "Automation could make a real difference.",
    line: "Several areas look like strong candidates for reliable, connected systems.",
  },
} as const;

const STORAGE_KEY = "vivify.readiness";

type Saved = { answers: QuizAnswers; index: number; done: boolean };

/** Progress is kept for this browser tab only (so Back from Contact returns to the result). */
function loadSaved(): Saved | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    const valid =
      s &&
      typeof s.index === "number" &&
      s.index >= 0 &&
      s.index < quizQuestions.length &&
      typeof s.done === "boolean" &&
      s.answers &&
      Object.entries(s.answers).every(([id, i]) => {
        const q = quizQuestions.find((x) => x.id === id);
        return Boolean(q?.options[i as number]);
      });
    return valid ? s : null;
  } catch {
    return null;
  }
}

function save(s: Saved | null) {
  try {
    if (s) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the check still works without it.
  }
}

/** Section 05: Business Automation Readiness check. Answers never leave the browser. */
export function Quiz() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const q = quizQuestions[index];
  const result = useMemo(() => scoreQuiz(quizQuestions, answers, packages), [answers]);
  const pkg = packages.find((p) => p.id === result.packageId);
  const copy = useMemo(() => describeRecommendation(result, systems, packages), [result]);
  const restored = useRef(false);

  // Restore after mount (not in the initial state) so the prerendered HTML matches the first render.
  useEffect(() => {
    const s = loadSaved();
    if (s) {
      setAnswers(s.answers);
      setIndex(s.index);
      setDone(s.done);
    }
    restored.current = true;
  }, []);
  useEffect(() => {
    if (!restored.current) return;
    save(Object.keys(answers).length || done ? { answers, index, done } : null);
  }, [answers, index, done]);

  const focusPanel = () => requestAnimationFrame(() => panelRef.current?.focus());

  const choose = (optionIndex: number) => {
    setAnswers((a) => ({ ...a, [q.id]: optionIndex }));
    if (index < quizQuestions.length - 1) setIndex(index + 1);
    else setDone(true);
    focusPanel();
  };
  const restart = () => {
    setAnswers({});
    setIndex(0);
    setDone(false);
    save(null);
    focusPanel();
  };
  const changeAnswers = () => {
    setDone(false);
    setIndex(quizQuestions.length - 1);
    focusPanel();
  };

  return (
    <section id="readiness" aria-labelledby="quiz-title" className="on-light section-y relative">
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <SectionHeading
            id="quiz-title"
            tone="light"
            label="Readiness check · 6 questions"
            title="Where should you automate first?"
            lede="Answer six quick questions about how your business runs today. You'll get an indicative recommendation straight away, with no sign-up and no contact details needed."
          />
          <p data-reveal className="mt-6 max-w-md text-sm text-slate">
            Indicative only, not a business diagnosis. Your answers stay in your browser and are
            never sent anywhere.{" "}
            {contactFormActive
              ? "If you choose to talk through your result, a short summary is added to the contact form for you to edit or delete before you send anything."
              : "If you choose to talk through your result, we'll take you to the contact page; nothing from your answers is sent."}
          </p>
        </div>

        <div
          ref={panelRef}
          tabIndex={-1}
          data-reveal
          className="rounded-[2rem] bg-navy p-6 text-snow shadow-[0_50px_90px_-40px_rgb(11_18_53/0.75)] outline-none sm:p-9"
        >
          {!done ? (
            <div key={q.id} className="anim-pop">
              <div className="flex items-center justify-between gap-4">
                <p className="tech-label text-cyan" aria-live="polite">
                  Question {index + 1} of {quizQuestions.length}
                </p>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setIndex(index - 1)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-mist hover:bg-snow/8 hover:text-snow"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                  </button>
                )}
              </div>
              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-navy-700"
                role="progressbar"
                aria-label="Progress"
                aria-valuemin={0}
                aria-valuemax={quizQuestions.length}
                aria-valuenow={index}
              >
                <div
                  className="h-full rounded-full bg-cyan transition-[width] duration-500"
                  style={{ width: `${(index / quizQuestions.length) * 100}%` }}
                />
              </div>
              <fieldset className="mt-8">
                <legend className="type-h3">{q.question}</legend>
                <div className="mt-6 grid gap-3">
                  {q.options.map((o, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <button
                        key={o.label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => choose(i)}
                        className={cn(
                          "group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-[1.02rem] font-medium transition-all",
                          selected
                            ? "bg-purple-600 text-white"
                            : "bg-navy-800 ring-1 ring-inset ring-snow/10 hover:bg-navy-700 hover:ring-cyan/50",
                        )}
                      >
                        {o.label}
                        <ArrowRight
                          className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                          aria-hidden
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          ) : (
            <div className="anim-pop" aria-live="polite">
              <div className="flex items-center gap-4">
                <ViviAvatar size={64} />
                <div>
                  <p className="tech-label text-cyan">Your indicative result</p>
                  <h3 className="type-h3 mt-1">{levelCopy[result.level].title}</h3>
                </div>
              </div>
              <p className="mt-5 text-mist">{levelCopy[result.level].line}</p>

              <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Opportunity level">
                {(["foundation", "clear", "high"] as const).map((lvl) => (
                  <li
                    key={lvl}
                    aria-current={result.level === lvl ? "true" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition-colors",
                      result.level === lvl ? "bg-cyan text-navy" : "bg-navy-700 text-mist",
                    )}
                  >
                    {
                      {
                        foundation: "Solid foundation",
                        clear: "Clear opportunities",
                        high: "High potential",
                      }[lvl]
                    }
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[0.8125rem] text-mist">
                Based only on your six answers. Not a measured business outcome.
              </p>

              {result.systems.length > 0 ? (
                <>
                  <p className="mt-8 font-semibold">Systems worth exploring first</p>
                  {result.lead && (
                    <p className="mt-1 text-sm text-mist">
                      The first one came up from your answer “{result.lead.answer}” to “
                      {result.lead.question}”
                    </p>
                  )}
                  <ul className="mt-3 grid gap-2.5">
                    {result.systems.map((id) => {
                      const s = systemById(id);
                      if (!s) return null;
                      return (
                        <li key={id}>
                          <Link
                            to={`/systems/${id}`}
                            className="flex items-center gap-3 rounded-2xl bg-navy-800 p-3.5 transition-colors hover:bg-navy-700"
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-600 text-white">
                              <Icon name={s.icon} className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold leading-tight">{s.title}</span>
                              <span className="block text-sm text-mist">{s.menuLine}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-cyan" aria-hidden />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="mt-8 text-snow/90">
                  Nothing stands out as urgent. If one task still bugs you, tell us about it and
                  we'll give you an honest view.
                </p>
              )}

              {pkg && (
                <div className="mt-6 rounded-2xl bg-navy-700 p-4 text-[0.95rem]">
                  <p>
                    Where {copy.systemTitle} sits:{" "}
                    <strong className="text-purple-200">{pkg.name}</strong>. {pkg.tagline}
                  </p>
                  <p className="mt-2 text-mist">{copy.availability}</p>
                  {copy.standalone && <p className="mt-2 text-mist">{copy.standalone}</p>}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {/* The summary travels in router state: in this tab's history, never in the URL or a request. */}
                <Link
                  to="/contact?topic=readiness"
                  state={
                    result.primary
                      ? {
                          quiz: {
                            systemId: result.primary,
                            packageId: result.packageId,
                            summary: copy.summary,
                          },
                        }
                      : undefined
                  }
                  className="btn btn-primary"
                >
                  Talk through my result <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <button type="button" onClick={changeAnswers} className="btn btn-ghost">
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Change my answers
                </button>
                <button type="button" onClick={restart} className="btn btn-ghost">
                  <RotateCcw className="h-4 w-4" aria-hidden /> Start again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
