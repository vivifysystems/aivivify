import type { DemoItem } from "@/content";
import { cn } from "@/lib/utils";
import { Icon } from "../icons";

const toneEvent = {
  cyan: "bg-cyan/12 text-cyan ring-cyan/30",
  purple: "bg-purple/15 text-purple-200 ring-purple/35",
  neutral: "bg-snow/6 text-snow/90 ring-snow/12",
  warn: "bg-[#ffb547]/12 text-[#ffcf85] ring-[#ffb547]/30",
} as const;

const toneCard = {
  cyan: "ring-cyan/35",
  purple: "ring-purple/45",
  neutral: "ring-snow/15",
} as const;

/**
 * Renders one demo item.
 * - surface "screen": inside the device (customer side)
 * - surface "ops":    in the behind-the-scenes pipeline
 * - mode "call":      messages render as a call transcript instead of chat bubbles
 */
export function DemoItemView({
  item,
  fresh,
  delay = 0,
  surface = "screen",
  mode = "chat",
}: {
  item: DemoItem;
  fresh: boolean;
  delay?: number;
  surface?: "screen" | "ops";
  mode?: "chat" | "call";
}) {
  const anim = fresh ? "anim-pop" : "";
  const style = fresh ? { animationDelay: `${delay}ms` } : undefined;
  const ops = surface === "ops";

  switch (item.kind) {
    case "typing":
      return (
        <div
          style={style}
          className={cn(
            anim,
            "flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md bg-purple-600/80 px-4 py-3",
          )}
          aria-label="Assistant is typing"
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="typing-dot h-1.5 w-1.5 rounded-full bg-white"
              style={{ animationDelay: `${d * 0.15}s` }}
            />
          ))}
        </div>
      );
    case "message": {
      const mine = item.from === "customer";
      if (item.from === "system")
        return (
          <p
            style={style}
            className={cn(
              anim,
              "mx-auto max-w-[92%] rounded-xl bg-snow/6 px-3 py-2 text-center text-[0.84rem] leading-snug text-snow/85",
            )}
          >
            {item.text}
          </p>
        );
      const who = mine
        ? mode === "call"
          ? "Caller"
          : "Customer"
        : item.from === "assistant"
          ? mode === "call"
            ? "AI receptionist"
            : "Automated assistant"
          : "Team";
      if (mode === "call")
        return (
          <div
            style={style}
            className={cn(anim, "border-l-2 pl-3", mine ? "border-snow/40" : "border-purple")}
          >
            <span
              className={cn("tech-label !text-[0.7rem]", mine ? "text-mist" : "text-purple-200")}
            >
              {who}
            </span>
            <p className="mt-0.5 text-[0.86rem] leading-snug text-snow">{item.text}</p>
          </div>
        );
      return (
        <div
          style={style}
          className={cn(anim, "flex flex-col", mine ? "items-end" : "items-start")}
        >
          <span className="tech-label mb-1 px-1 !text-[0.7rem] text-mist">
            {who}
            {item.channel ? ` · ${item.channel}` : ""}
          </span>
          <p
            className={cn(
              "max-w-[88%] rounded-2xl px-3.5 py-2 text-[0.86rem] leading-snug",
              mine
                ? "rounded-br-md bg-snow text-navy"
                : item.from === "staff"
                  ? "rounded-bl-md bg-navy-600 text-snow"
                  : "rounded-bl-md bg-purple-600 text-white",
            )}
          >
            {item.text}
          </p>
        </div>
      );
    }
    case "event":
      return (
        <p
          style={style}
          className={cn(
            anim,
            "flex max-w-full items-center gap-2 rounded-xl px-3 py-1.5 text-[0.84rem] font-medium ring-1 ring-inset",
            ops ? "self-start" : "mx-auto",
            toneEvent[item.tone ?? "neutral"],
          )}
        >
          <Icon name={item.icon} className="h-3.5 w-3.5 shrink-0" />
          <span>{item.text}</span>
        </p>
      );
    case "card":
      return (
        <div
          style={style}
          className={cn(
            anim,
            "rounded-2xl p-3.5 ring-1 ring-inset",
            ops ? "bg-navy-800" : "bg-navy-700",
            toneCard[item.tone ?? "neutral"],
          )}
        >
          <p className="text-[0.86rem] font-semibold">{item.title}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.84rem]">
            {item.rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-mist">{k}</dt>
                <dd className="text-snow">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "choice":
      return (
        <div style={style} className={cn(anim, "rounded-2xl bg-navy-700 p-3.5")}>
          <p className="text-[0.86rem] font-semibold">{item.prompt}</p>
          <div className="mt-2.5 grid gap-2">
            {item.options.map((o) => (
              <span
                key={o}
                className="rounded-xl bg-snow/8 px-3 py-2 text-center text-[0.84rem] font-semibold ring-1 ring-inset ring-snow/20"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      );
    case "search":
      return (
        <div style={style} className={cn(anim, "space-y-2")}>
          <p className="flex items-center gap-2 rounded-full bg-snow px-3.5 py-2 text-[0.86rem] text-navy">
            <Icon name="Search" className="h-4 w-4 text-slate" />
            {item.query}
          </p>
          {item.results.map((r) => (
            <div
              key={r.name}
              className={cn(
                "rounded-xl px-3.5 py-2.5",
                r.highlight
                  ? "bg-navy-700 ring-1 ring-inset ring-cyan/40"
                  : "bg-navy-800/70 opacity-70",
              )}
            >
              <p className={cn("text-[0.86rem] font-semibold", r.highlight && "text-cyan")}>
                {r.name}
              </p>
              <p className="text-[0.84rem] text-mist">{r.line}</p>
            </div>
          ))}
        </div>
      );
    case "form":
      return (
        <div style={style} className={cn(anim, "rounded-2xl bg-snow p-4 text-navy")}>
          <div className="grid gap-2">
            {item.fields.map(([k, v]) => (
              <div key={k}>
                <span className="block text-[0.78rem] font-semibold text-slate">{k}</span>
                <span className="mt-0.5 block rounded-lg bg-snow-200 px-2.5 py-1.5 text-[0.86rem]">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <span className="mt-3 block rounded-full bg-purple-600 py-2 text-center text-[0.86rem] font-semibold text-white">
            {item.submit}
          </span>
        </div>
      );
  }
}
