import {
  BatteryFull,
  CalendarDays,
  ChartNoAxesColumn,
  Inbox,
  Lock,
  PhoneCall,
  Search,
  Signal,
  Users,
  Wifi,
} from "lucide-react";
import type { Demo } from "@/content";
import { cn } from "@/lib/utils";

/** Simulated call state for the AI Receptionist demo. */
export type CallState = { status: "ringing" | "live" | "ended"; seconds: number };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function StatusBar() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-between px-6 pt-2.5 text-[0.7rem] font-semibold text-snow/85"
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <BatteryFull className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

/**
 * The screen a demo plays on. Items stack from the bottom: new activity appears at
 * the bottom and older activity drifts up under a soft fade.
 */
export function DeviceFrame({
  device,
  title,
  call,
  children,
}: {
  device: Demo["device"];
  title: string;
  call?: CallState;
  children: React.ReactNode;
}) {
  const screen = (
    <div className="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden px-3.5 pb-4 pt-6 [mask-image:linear-gradient(to_bottom,transparent,black_16%)]">
      {children}
    </div>
  );

  if (device === "phone" || device === "call") {
    return (
      <div className="relative mx-auto w-full max-w-[19.5rem] shrink-0">
        {/* side buttons */}
        <span
          aria-hidden
          className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-[#1b2148]"
        />
        <span
          aria-hidden
          className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-[#1b2148]"
        />
        <span
          aria-hidden
          className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#1b2148]"
        />
        <div className="rounded-[2.75rem] bg-gradient-to-b from-[#232a5c] to-[#0d1233] p-[3px] shadow-[0_50px_90px_-35px_rgb(0_0_0/0.95)]">
          <div className="rounded-[2.65rem] bg-[#05081a] p-2">
            <div className="relative flex h-[33rem] flex-col overflow-hidden rounded-[2.2rem] bg-navy">
              <div
                aria-hidden
                className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#05081a]"
              />
              <StatusBar />
              {device === "call" ? (
                <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-navy-700 to-navy px-4 pb-4 pt-5 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-cyan/15 text-cyan">
                    <PhoneCall className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="mt-1 text-base font-semibold">{title}</span>
                  <span className="text-[0.8rem] text-mist">
                    {call?.status === "ringing"
                      ? "Incoming call…"
                      : call?.status === "ended"
                        ? `Call ended · ${fmt(call.seconds)}`
                        : `AI receptionist · ${fmt(call?.seconds ?? 0)}`}
                  </span>
                  <span aria-hidden className="mt-2 flex h-6 items-end gap-1">
                    {[0.5, 0.9, 0.6, 1, 0.7, 0.85, 0.45].map((h, i) => (
                      <span
                        key={i}
                        className={cn(
                          "w-1 origin-bottom rounded-full bg-purple-300",
                          call?.status === "live" ? "wave-bar" : "opacity-40",
                        )}
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 0.11}s` }}
                      />
                    ))}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 border-b border-snow/6 px-4 pb-3 pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-600 font-display text-sm font-bold text-white">
                    H
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-semibold">Harbor Plumbing</span>
                    <span className="block truncate text-[0.78rem] text-mist">
                      {title} · sample
                    </span>
                  </span>
                </div>
              )}
              {screen}
              <div aria-hidden className="mx-auto mb-2 h-1 w-24 rounded-full bg-snow/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (device === "browser") {
    return (
      <div className="w-full overflow-hidden rounded-2xl bg-navy shadow-[0_50px_90px_-35px_rgb(0_0_0/0.95)] ring-1 ring-snow/10">
        <div className="flex items-center gap-3 bg-navy-800 px-4 py-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]/70" />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-navy-700 px-3 py-1.5 text-[0.8rem] text-mist">
            {title.startsWith("search") ? (
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            <span className="truncate">{title}</span>
          </span>
        </div>
        <div className="flex h-[30rem] flex-col">{screen}</div>
      </div>
    );
  }

  // Desktop app: shared inbox / automation log.
  const nav = [
    { icon: Inbox, label: "Inbox" },
    { icon: Users, label: "Contacts" },
    { icon: CalendarDays, label: "Calendar" },
    { icon: ChartNoAxesColumn, label: "Reports" },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-navy shadow-[0_50px_90px_-35px_rgb(0_0_0/0.95)] ring-1 ring-snow/10">
      <div className="flex items-center justify-between bg-navy-800 px-4 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-[0.8rem] text-mist">Harbor Plumbing · sample</span>
      </div>
      <div className="flex h-[30rem]">
        <nav aria-hidden className="hidden w-32 shrink-0 flex-col gap-1 bg-navy-800/60 p-2 sm:flex">
          {nav.map((n, i) => (
            <span
              key={n.label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.8rem]",
                i === 0 ? "bg-purple-600/25 text-snow" : "text-mist",
              )}
            >
              <n.icon className="h-3.5 w-3.5" />
              {n.label}
            </span>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">{screen}</div>
      </div>
    </div>
  );
}
