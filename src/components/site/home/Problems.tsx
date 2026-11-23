import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleCheck,
  PhoneMissed,
  MessageCircleQuestion,
  Hourglass,
  FolderOpen,
  CalendarX2,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../SectionHeading";

const problems = [
  {
    icon: PhoneMissed,
    title: "Missed customer inquiries",
    line: "Calls and messages arrive while you're on a job.",
    without: "3 missed calls · 1 unread message",
    withSys: "Callers texted back · details in the inbox",
    system: "missed-call-text-back",
  },
  {
    icon: MessageCircleQuestion,
    title: "The same questions, all day",
    line: "Prices, hours, service areas, again and again.",
    without: "“Do you service my area?” ×4",
    withSys: "Answered from approved information",
    system: "ai-chatbot",
  },
  {
    icon: Hourglass,
    title: "Slow follow-up",
    line: "Interested leads go quiet before anyone calls back.",
    without: "Quote request from last Tuesday",
    withSys: "Acknowledged automatically · follow-up scheduled",
    system: "lead-follow-up",
  },
  {
    icon: FolderOpen,
    title: "Scattered customer information",
    line: "Details live in inboxes, notebooks and memory.",
    without: "Which app was that conversation in?",
    withSys: "One inbox · full history on every contact",
    system: "inbox-crm",
  },
  {
    icon: CalendarX2,
    title: "Manual booking coordination",
    line: "Back-and-forth messages to find one time slot.",
    without: "“Does Thursday work? What about Friday?”",
    withSys: "Booked from real availability · reminder sent",
    system: "appointment-booking",
  },
  {
    icon: ClipboardList,
    title: "Repetitive admin",
    line: "Copying, filing and updating the same records.",
    without: "Invoice attachments waiting to be filed",
    withSys: "Filed, logged and summarised automatically",
    system: "workflow-automation",
  },
];

export function Problems() {
  const [solved, setSolved] = useState(false);
  return (
    <section aria-labelledby="problems-title" className="on-light section-y relative">
      <div className="shell grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            id="problems-title"
            tone="light"
            label="The problems we solve"
            title="Busy is good. Missed leads aren't."
            lede="Most service businesses don't need more software. They need the inquiries, follow-ups and admin that slip through the cracks to be handled reliably."
          />
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {problems.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                style={{ "--reveal-i": i } as React.CSSProperties}
                className="flex gap-3.5"
              >
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-cyan">
                  <p.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold leading-snug">{p.title}</span>
                  <span className="mt-1 block text-[0.95rem] leading-snug text-slate">
                    {p.line}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The live thing: flip the same Monday morning from chaos to handled. */}
        <div data-reveal className="relative">
          <div className="rounded-[2rem] bg-navy p-5 text-snow shadow-[0_50px_90px_-40px_rgb(11_18_53/0.75)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="tech-label text-mist">Monday · 9:14 am</p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {solved ? "Handled by your systems" : "Your notifications"}
                </p>
              </div>
              <div
                role="group"
                aria-label="Show the morning"
                className="flex rounded-full bg-navy-700 p-1 text-sm font-semibold"
              >
                {[
                  [false, "Without a system"],
                  [true, "With VIVIFY"],
                ].map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    aria-pressed={solved === val}
                    onClick={() => setSolved(val as boolean)}
                    className={cn(
                      "rounded-full px-4 py-2 transition-colors",
                      solved === val ? "bg-snow text-navy" : "text-mist hover:text-snow",
                    )}
                  >
                    {label as string}
                  </button>
                ))}
              </div>
            </div>
            <ul className="mt-6 grid gap-2.5" aria-live="polite">
              {problems.map((p, i) => (
                <li
                  key={p.title + String(solved)}
                  className="anim-pop flex items-center gap-3 rounded-2xl bg-navy-800 px-4 py-3"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                      solved ? "bg-cyan/15 text-cyan" : "bg-[#ffb547]/15 text-[#ffcf85]",
                    )}
                  >
                    {solved ? (
                      <CircleCheck className="h-[18px] w-[18px]" aria-hidden />
                    ) : (
                      <p.icon className="h-[18px] w-[18px]" aria-hidden />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] font-medium">
                      {solved ? p.withSys : p.without}
                    </span>
                    <span className="block text-[0.8125rem] text-mist">{p.title}</span>
                  </span>
                  {solved && (
                    <Link
                      to={`/systems/${p.system}`}
                      className="hidden shrink-0 text-[0.8125rem] font-semibold text-cyan hover:underline sm:block"
                    >
                      How
                      <span className="sr-only"> {p.title} is handled</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.8125rem] text-mist">Sample scenario.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
