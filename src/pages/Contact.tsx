import { useId, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleAlert,
  Copy,
  LoaderCircle,
  Mail,
  MessageCircle,
} from "lucide-react";
import { links, packages, systemById, systemGroups } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import {
  composeMessage,
  mailtoHref,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";
import { PageHero } from "@/components/site/PageHero";
import { BookingLink } from "@/components/site/BookingLink";
import { ViviAvatar } from "@/components/site/Vivi";
import { openAskVivi } from "@/components/site/ask-vivi-events";
import { cn } from "@/lib/utils";

const field =
  "mt-2 block w-full rounded-2xl bg-navy-700 px-4 py-3 text-base text-snow placeholder:text-mist/70 ring-1 ring-inset ring-snow/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#ff8fa3]";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not-sent"; reason: "offline" | "not_configured" | "failed" | "rate_limited" };

function Field({
  label,
  error,
  hint,
  children,
  id,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-mist">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#ffb3c0]">
          {error}
        </p>
      )}
    </div>
  );
}

/** What the readiness check hands over: the top system and an editable summary. */
type QuizHandoff = { systemId: string; packageId: string | null; summary: string };

function readHandoff(state: unknown): QuizHandoff | null {
  const q = (state as { quiz?: Partial<QuizHandoff> } | null)?.quiz;
  if (!q || typeof q.systemId !== "string" || typeof q.summary !== "string") return null;
  if (!systemById(q.systemId)) return null;
  return {
    systemId: q.systemId,
    packageId: q.packageId ?? null,
    summary: q.summary.slice(0, 1200),
  };
}

export default function Contact() {
  useRouteMeta();
  const [params] = useSearchParams();
  const location = useLocation();
  const handoff = readHandoff(location.state);
  const handoffSystem = handoff ? systemById(handoff.systemId) : undefined;
  const pkg = packages.find((p) => p.id === params.get("package"));
  const fromQuiz = params.get("topic") === "readiness";
  const uid = useId();
  const startedAt = useRef(Date.now());
  const [values, setValues] = useState<ContactInput>(() => ({
    name: "",
    email: "",
    business: "",
    // The readiness check preselects only the group of the system it recommended;
    // a plain ?package= link preselects the needs that package's systems cover.
    interests: handoffSystem
      ? [handoffSystem.group]
      : pkg
        ? [...new Set(pkg.systems.map((id) => systemById(id)?.group).filter(Boolean) as string[])]
        : [],
    message: handoff
      ? handoff.summary
      : fromQuiz
        ? `I took the readiness check${pkg ? ` (closest package: ${pkg.name})` : ""} and would like to talk through the result.`
        : "",
  }));
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const labels = useMemo(() => Object.fromEntries(systemGroups.map((g) => [g.id, g.title])), []);
  const composed = useMemo(() => composeMessage(values, labels), [values, labels]);

  const update = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          business: values.business,
          needs: values.interests,
          message: values.message,
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        delivered?: boolean;
        code?: string;
        errors?: ContactErrors;
      } | null;
      // Success is shown ONLY when the server confirms the email was handed to the provider.
      if (res.ok && data?.ok && data.delivered) setStatus({ kind: "sent" });
      else if (res.status === 422 && data?.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
      } else if (res.status === 429) setStatus({ kind: "not-sent", reason: "rate_limited" });
      else if (data?.code === "not_configured")
        setStatus({ kind: "not-sent", reason: "not_configured" });
      else setStatus({ kind: "not-sent", reason: "failed" });
    } catch {
      setStatus({ kind: "not-sent", reason: "offline" });
    }
  };

  const desc = (k: keyof ContactInput, hint?: boolean) =>
    errors[k] ? `${uid}-${k}-error` : hint ? `${uid}-${k}-hint` : undefined;

  const notSentCopy = {
    offline: "We couldn't reach the server, so your message was not sent.",
    not_configured: "The online form isn't connected yet, so your message was not sent.",
    failed: "Something went wrong on our side, so your message was not sent.",
    rate_limited: "Too many attempts from this connection. Your message was not sent.",
  } as const;

  return (
    <>
      <PageHero
        label="Contact"
        title="Tell us what's taking up your time."
        lede="Book a free discovery call, or send a short message. You'll get an honest view of what's worth automating, and what isn't."
      >
        {/* Both paths are visible before the form, on every screen size. */}
        <div
          className="anim-rise mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <BookingLink />
          {/* Plain mailto: opens the visitor's email app addressed to the public address. */}
          <a href={links.email.href} className="btn btn-ghost">
            <Mail className="h-4 w-4" aria-hidden /> Email me
            <span className="sr-only"> at {links.email.label}</span>
          </a>
          <Link to="/contact#send-message" className="btn btn-ghost">
            <Mail className="h-4 w-4" aria-hidden /> Send a message
          </Link>
        </div>
      </PageHero>
      <section aria-label="Contact options" className="bg-ground pb-24">
        <div className="shell grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] bg-navy-800 p-6 sm:p-10">
            {status.kind === "sent" ? (
              <div className="anim-pop" role="status">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan/15 text-cyan">
                  <Check className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="type-h3 mt-5">Message sent. Thank you.</h2>
                <p className="mt-3 text-mist">
                  It's in Viviene's inbox. You'll get a reply at {values.email}. If it's urgent, you
                  can also book a call.
                </p>
              </div>
            ) : status.kind === "not-sent" ? (
              <div className="anim-pop" role="alert">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ffb547]/15 text-[#ffcf85]">
                  <CircleAlert className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="type-h3 mt-5">Not sent yet</h2>
                <p className="mt-3 text-mist">
                  {notSentCopy[status.reason]} Nothing is lost: send it from your own email, or copy
                  it.
                </p>
                <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl bg-navy-700 p-4 font-sans text-sm text-snow/90">
                  {composed.body}
                </pre>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={mailtoHref(links.email.href, composed.subject, composed.body)}
                    className="btn btn-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden /> Open in my email app
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `${composed.subject}\n\n${composed.body}`,
                        );
                        setCopied(true);
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" aria-hidden /> {copied ? "Copied" : "Copy message"}
                  </button>
                  <button
                    type="button"
                    className="btn text-mist hover:text-snow"
                    onClick={() => setStatus({ kind: "idle" })}
                  >
                    Back to the form
                  </button>
                </div>
                <p className="mt-5 text-sm text-mist">
                  Or email{" "}
                  <a
                    href={links.email.href}
                    className="text-cyan underline-offset-4 hover:underline"
                  >
                    {links.email.label}
                  </a>{" "}
                  directly.
                </p>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={submit}
                className="space-y-6"
                aria-describedby={`${uid}-how`}
              >
                <div>
                  <h2 id="send-message" tabIndex={-1} className="type-h3 scroll-mt-28 outline-none">
                    Send a message
                  </h2>
                  <p id={`${uid}-how`} className="mt-2 text-sm text-mist">
                    Your details are used only to reply to you.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id={`${uid}-name`} label="Your name" error={errors.name}>
                    <input
                      id={`${uid}-name`}
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={desc("name")}
                      className={field}
                      required
                    />
                  </Field>
                  <Field id={`${uid}-email`} label="Email" error={errors.email}>
                    <input
                      id={`${uid}-email`}
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={desc("email")}
                      className={field}
                      required
                    />
                  </Field>
                </div>
                <Field
                  id={`${uid}-business`}
                  label="Business and what it does (optional)"
                  error={errors.business}
                >
                  <input
                    id={`${uid}-business`}
                    autoComplete="organization"
                    value={values.business}
                    onChange={(e) => update("business", e.target.value)}
                    aria-invalid={Boolean(errors.business)}
                    aria-describedby={desc("business")}
                    placeholder="e.g. Plumbing, 4 technicians"
                    className={field}
                  />
                </Field>
                <fieldset>
                  <legend className="font-medium">What do you need most? (optional)</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {systemGroups.map((g) => {
                      const on = values.interests.includes(g.id);
                      return (
                        <label
                          key={g.id}
                          className={cn(
                            "flex cursor-pointer select-none items-start gap-3 rounded-2xl p-3.5 ring-1 ring-inset transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan",
                            on
                              ? "bg-purple-600/20 ring-purple"
                              : "bg-navy-700 ring-snow/12 hover:ring-snow/30",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 accent-[#8b2be2]"
                            checked={on}
                            onChange={() =>
                              update(
                                "interests",
                                on
                                  ? values.interests.filter((i) => i !== g.id)
                                  : [...values.interests, g.id],
                              )
                            }
                          />
                          <span>
                            <span className="block font-semibold leading-tight">{g.title}</span>
                            <span className="mt-0.5 block text-sm text-mist">{g.line}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <Field
                  id={`${uid}-message`}
                  label="What's taking up your time?"
                  error={errors.message}
                  hint={
                    handoff
                      ? "Pre-filled from your readiness check. Edit or delete anything before you send; nothing has been sent."
                      : "A few sentences is plenty: what happens today, and what you'd like to change."
                  }
                >
                  <textarea
                    id={`${uid}-message`}
                    rows={handoff ? 8 : 5}
                    value={values.message}
                    maxLength={2000}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={desc("message", true)}
                    className={cn(field, "resize-y")}
                    required
                  />
                </Field>
                {/* Spam trap: hidden from people and assistive tech; bots tend to fill it. */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                    disabled={status.kind === "sending"}
                  >
                    {status.kind === "sending" ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" aria-hidden /> Send message
                      </>
                    )}
                  </button>
                  <p className="text-sm text-mist">
                    See the{" "}
                    <a href="/privacy" className="text-cyan underline-offset-4 hover:underline">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-5">
            <a
              href={links.bookingCall.href}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-[2rem] bg-purple-600 p-7 text-white transition-transform hover:-translate-y-0.5"
            >
              <CalendarDays className="h-7 w-7" aria-hidden />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                {links.bookingCall.label.split(/(30-minute)/).map((part, i) =>
                  part === "30-minute" ? (
                    <span key={i} className="whitespace-nowrap">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </h2>
              <p className="mt-2 text-white/90">
                A free call to map how inquiries, bookings and admin work today. Scheduling opens in
                Calendly.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-semibold">
                Choose a time <ArrowUpRight className="h-4 w-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
            <a
              href={links.email.href}
              className="block rounded-[2rem] bg-navy-800 p-7 hover:bg-navy-700"
            >
              <Mail className="h-6 w-6 text-cyan" aria-hidden />
              <p className="mt-4 text-sm text-mist">Email directly</p>
              <p className="mt-1 break-all font-display text-xl font-semibold">
                {links.email.label}
              </p>
            </a>
            <div className="rounded-[2rem] bg-navy-800 p-7">
              <div className="flex items-center gap-3">
                <ViviAvatar size={48} />
                <div>
                  <p className="font-display text-lg font-semibold">Quick question first?</p>
                  <p className="text-sm text-mist">Guided answers from this site</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAskVivi()}
                className="btn btn-ghost mt-5 w-full"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> Ask VIVI
              </button>
            </div>
            <div className="rounded-[2rem] bg-navy-800 p-7">
              <h2 className="font-display text-lg font-semibold">What happens next</h2>
              <ol className="mt-4 space-y-3 text-[0.95rem] text-snow/90">
                {[
                  "A reply from Viviene, usually with a few questions.",
                  "A discovery call to understand how things work today.",
                  "A written plan and quote before any work starts.",
                ].map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-700 text-[0.8125rem] font-semibold text-cyan">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
