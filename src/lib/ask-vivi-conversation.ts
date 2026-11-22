// Ask VIVI conversation state: a single pending-message policy for topic buttons,
// Enter and the send button. Every accepted prompt is answered exactly once, in
// order, and the transcript always reads question → answer → question → answer.
// A prompt sent while VIVI is still replying waits in a visible queue and joins the
// transcript when its turn comes, so a quick second prompt can never cancel or
// outrun the reply to the first. Pure functions; the panel supplies the timing.
import type { AskReply } from "./ask-vivi.ts";

export type Msg = {
  id: number;
  from: "vivi" | "you";
  text: string;
  links?: AskReply["links"];
};

export type Pending = { question: string; reply: AskReply };

export type Conversation = {
  messages: readonly Msg[];
  /**
   * Prompts not yet answered, oldest first. The head is the one VIVI is replying
   * to (already in `messages`); the rest are waiting and not in the transcript yet.
   */
  queue: readonly Pending[];
  nextId: number;
};

/** Prompts accepted in total while a reply is pending (the one being answered + waiting). */
export const MAX_PENDING = 4;

export const GREETING =
  "Hi, I'm VIVI, VIVIFY's guide. Pick a topic or type a question. My answers are pre-written from this site, so for anything specific I'll point you to Viviene.";

export function initialConversation(): Conversation {
  return { messages: [{ id: 0, from: "vivi", text: GREETING }], queue: [], nextId: 1 };
}

/** True while VIVI owes at least one reply. */
export const isReplying = (c: Conversation) => c.queue.length > 0;

/** Prompts accepted but not yet shown in the transcript. */
export const waiting = (c: Conversation): readonly Pending[] => c.queue.slice(1);

export const canAccept = (c: Conversation) => c.queue.length < MAX_PENDING;

const withQuestion = (c: Conversation, question: string): Conversation => ({
  ...c,
  messages: [...c.messages, { id: c.nextId, from: "you", text: question }],
  nextId: c.nextId + 1,
});

/**
 * Accepts a prompt. If VIVI is idle it joins the transcript at once; otherwise it
 * waits. A refused prompt (queue full) is not recorded, so it can never sit on
 * screen unanswered.
 */
export function submitQuestion(
  c: Conversation,
  question: string,
  reply: AskReply,
): { state: Conversation; accepted: boolean } {
  if (!canAccept(c)) return { state: c, accepted: false };
  const idle = c.queue.length === 0;
  const next: Conversation = { ...c, queue: [...c.queue, { question, reply }] };
  return { accepted: true, state: idle ? withQuestion(next, question) : next };
}

/** Shows the reply to the current question, then promotes the next waiting prompt. */
export function deliverNext(c: Conversation): Conversation {
  const [head, ...rest] = c.queue;
  if (!head) return c;
  const answered: Conversation = {
    messages: [
      ...c.messages,
      { id: c.nextId, from: "vivi", text: head.reply.text, links: head.reply.links },
    ],
    queue: rest,
    nextId: c.nextId + 1,
  };
  return rest[0] ? withQuestion(answered, rest[0].question) : answered;
}
