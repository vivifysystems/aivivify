import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { ArrowRight, SendHorizontal, X } from "lucide-react";
import { quickTopics, respond, topicReply, type AskReply } from "@/lib/ask-vivi";
import {
  canAccept,
  deliverNext,
  initialConversation,
  isReplying,
  submitQuestion,
  waiting,
  type Conversation,
} from "@/lib/ask-vivi-conversation";
import { cn } from "@/lib/utils";
import { ViviAvatar } from "./Vivi";
import { ASK_VIVI_OPEN_EVENT, openAskVivi } from "./ask-vivi-events";

type Action = { type: "ask"; question: string; reply: AskReply } | { type: "deliver" };

function reduce(c: Conversation, a: Action): Conversation {
  return a.type === "ask" ? submitQuestion(c, a.question, a.reply).state : deliverNext(c);
}

/** A short pause so each reply reads as a new message; not simulated "AI thinking". */
const REPLY_DELAY_MS = 450;

/**
 * Header button that opens Ask VIVI. It lives in the fixed header, so it can never
 * cover page content, demo controls or case-study panels.
 */
export function AskViviButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openAskVivi()}
      className={cn(
        "group flex h-11 items-center gap-2 rounded-full bg-snow/8 p-1 transition-colors hover:bg-snow/14 xl:pr-4",
        className,
      )}
      aria-haspopup="dialog"
    >
      <ViviAvatar size={36} ring={false} eager />
      <span className="sr-only xl:not-sr-only xl:text-[0.95rem] xl:font-medium">Ask VIVI</span>
    </button>
  );
}

/** The Ask VIVI panel. Opened via openAskVivi() from the header, FAQ, contact or CTA. */
export function AskVivi() {
  const [open, setOpen] = useState(false);
  const [convo, dispatch] = useReducer(reduce, undefined, initialConversation);
  const [draft, setDraft] = useState("");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const replying = isReplying(convo);
  const full = !canAccept(convo);
  const headQuestion = convo.queue[0]?.question;

  // One reply at a time, in order. The timer is keyed to the question being answered,
  // so prompts that join the queue never restart or cancel it.
  useEffect(() => {
    if (!headQuestion) return;
    const t = window.setTimeout(() => dispatch({ type: "deliver" }), REPLY_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [headQuestion, convo.messages.length]);

  const ask = useCallback((question: string, reply: AskReply) => {
    dispatch({ type: "ask", question, reply });
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      const topic = (e as CustomEvent<{ topic?: string }>).detail?.topic;
      const t = quickTopics.find((q) => q.id === topic);
      if (t) ask(t.label, topicReply(t.id));
    };
    window.addEventListener(ASK_VIVI_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASK_VIVI_OPEN_EVENT, onOpen);
  }, [ask]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [convo.messages.length, convo.queue.length, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = draft.trim().slice(0, 300);
    if (!q || full) return;
    setDraft("");
    ask(q, respond(q));
  };

  const lastReply = [...convo.messages].reverse().find((m) => m.from === "vivi" && m.id !== 0);
  // The one spoken announcement: a short status while replying, then the reply itself.
  const announcement = replying
    ? "VIVI is replying."
    : lastReply && convo.messages.length > 1
      ? `VIVI: ${lastReply.text}`
      : "";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ground/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="ask-vivi-note"
          onCloseAutoFocus={(e) => {
            // Return focus to whichever control opened the panel.
            if (opener.current && document.contains(opener.current)) {
              e.preventDefault();
              opener.current.focus();
            }
          }}
          className={cn(
            "fixed z-[61] flex flex-col overflow-hidden bg-navy-800 shadow-2xl ring-1 ring-snow/10 data-[state=open]:animate-in data-[state=open]:fade-in-0",
            // Phones: bottom sheet clear of the home indicator.
            "inset-x-0 bottom-0 h-[min(86dvh,640px)] rounded-t-3xl pb-[env(safe-area-inset-bottom)] data-[state=open]:slide-in-from-bottom-6",
            // Larger screens: anchored under the header button.
            "sm:inset-x-auto sm:bottom-auto sm:right-[max(var(--gutter),env(safe-area-inset-right))] sm:top-[calc(var(--header-h)+0.5rem)] sm:h-[min(calc(100dvh-var(--header-h)-2rem),620px)] sm:w-[25rem] sm:rounded-3xl sm:pb-0 sm:data-[state=open]:slide-in-from-top-2",
          )}
        >
          <div className="flex items-center gap-3 bg-navy-700 px-5 py-4">
            <ViviAvatar size={44} eager />
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-lg font-semibold leading-tight">
                Ask VIVI
              </Dialog.Title>
              <p id="ask-vivi-note" className="text-[0.8125rem] text-mist">
                Guided assistant · pre-written answers, not live AI
              </p>
            </div>
            <Dialog.Close
              className="grid h-11 w-11 place-items-center rounded-full hover:bg-snow/10"
              aria-label="Close Ask VIVI"
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5"
            aria-busy={replying}
          >
            {convo.messages.map((m) => (
              <Bubble key={m.id} from={m.from} onNavigate={() => setOpen(false)} links={m.links}>
                {m.text}
              </Bubble>
            ))}
            {replying && (
              <div
                className="flex items-center gap-2 px-2 py-1 text-[0.8125rem] text-mist"
                data-replying
              >
                <span className="flex gap-1.5" aria-hidden>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="typing-dot h-2 w-2 rounded-full bg-purple-300"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </span>
                VIVI is replying…
              </div>
            )}
            {waiting(convo).map((w, i) => (
              <Bubble key={`wait-${i}-${w.question}`} from="you" queued>
                {w.question}
              </Bubble>
            ))}
          </div>

          {/* The single spoken announcement: replying, then the reply once. */}
          <p role="status" className="sr-only">
            {announcement}
          </p>

          <div className="bg-navy-800 px-4 pb-4">
            <div className="flex flex-wrap gap-2 pb-3" role="group" aria-label="Suggested topics">
              {(showAllTopics ? quickTopics : quickTopics.slice(0, 3)).map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => ask(t.label, topicReply(t.id))}
                  aria-disabled={full || undefined}
                  className={cn(
                    "min-h-10 rounded-full bg-navy-700 px-3.5 py-2 text-sm text-snow ring-1 ring-inset ring-snow/10 transition-colors hover:ring-cyan/60",
                    // Short screens keep the transcript roomy: the third suggestion waits behind "More topics".
                    i === 2 && !showAllTopics && "[@media(max-height:700px)]:hidden",
                  )}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                aria-expanded={showAllTopics}
                onClick={() => setShowAllTopics((v) => !v)}
                className="min-h-10 rounded-full px-3.5 py-2 text-sm font-semibold text-cyan hover:bg-snow/8"
              >
                {showAllTopics ? "Fewer topics" : "More topics"}
              </button>
            </div>
            {full && (
              <p className="pb-2 text-[0.8125rem] text-mist">VIVI is catching up. One moment…</p>
            )}
            <form onSubmit={submit} className="flex items-center gap-2">
              <label htmlFor="ask-vivi-input" className="sr-only">
                Ask a question
              </label>
              <input
                id="ask-vivi-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={300}
                autoComplete="off"
                placeholder="Ask about systems, pricing, demos…"
                className="h-12 min-w-0 flex-1 rounded-full bg-navy-700 px-4 text-base text-snow ring-1 ring-inset ring-snow/10 placeholder:text-mist/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                disabled={!draft.trim() || full}
              >
                <SendHorizontal className="h-5 w-5" aria-hidden />
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Bubble({
  from,
  children,
  links,
  queued,
  onNavigate,
}: {
  from: "vivi" | "you";
  children: React.ReactNode;
  links?: AskReply["links"];
  queued?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      data-from={from}
      data-queued={queued || undefined}
      className={cn(
        "anim-pop flex",
        from === "you" ? "justify-end" : "justify-start",
        queued && "opacity-60",
      )}
    >
      <div
        className={cn(
          "max-w-[86%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-snug",
          from === "you"
            ? "rounded-br-md bg-purple-600 text-white"
            : "rounded-bl-md bg-navy-700 text-snow",
          queued && "border border-dashed border-snow/30 !bg-transparent",
        )}
      >
        <span className="sr-only">{from === "you" ? "You: " : "VIVI: "}</span>
        {children}
        {queued && <span className="ml-2 text-[0.75rem] text-mist">Waiting</span>}
        {links && links.length > 0 && (
          <span className="mt-2.5 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                onClick={onNavigate}
                className="inline-flex min-h-9 items-center gap-1 rounded-full bg-snow/10 px-3 py-1.5 text-sm font-semibold text-cyan hover:bg-snow/15"
              >
                {l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
