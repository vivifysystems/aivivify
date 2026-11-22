// Server-side handler for the contact form, written against the standard
// Request/Response API so it runs in a Vercel Function (api/contact.ts) and in
// unit tests with injected dependencies. Answers 503 "not_configured" until the
// environment variables are set (see docs/launch/contact-form.md).
//
// Personal data: the visitor's message is forwarded once to the configured inbox
// and is not stored here. Logs carry event names and status codes only, never
// the visitor's name, address, business or message.
import { composeMessage, validateContact, type ContactInput } from "./contact.ts";

export type ContactEnv = {
  /** Resend API key. Without it the handler answers 503 "not_configured". */
  RESEND_API_KEY?: string;
  /** Inbox that receives inquiries, e.g. viviene@vivify.solutions. */
  CONTACT_TO_EMAIL?: string;
  /** Verified sender on a Resend-verified domain, e.g. "VIVIFY Website <forms@vivify.solutions>". */
  CONTACT_FROM_EMAIL?: string;
  /** Optional Cloudflare Turnstile secret. When set, a valid token is required. */
  TURNSTILE_SECRET_KEY?: string;
  /** Optional comma-separated exact Origins allowed to post, e.g. https://vivify.solutions. */
  CONTACT_ALLOWED_ORIGIN?: string;
};

export type ContactDeps = {
  fetch: typeof fetch;
  now: () => number;
  /** Returns false when this client has exceeded its quota. */
  allow: (key: string) => boolean;
  /** Operational log line. Must never receive the visitor's personal data. */
  log?: (event: string, detail?: Record<string, string | number>) => void;
};

/** Default log: one JSON line per event in the Vercel Function logs. */
export function consoleLog(event: string, detail?: Record<string, string | number>) {
  console.error(JSON.stringify({ event, ...detail }));
}

const REQUIRED_ENV = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;

export type ContactResult =
  | { ok: true; delivered: true; id?: string }
  | { ok: true; delivered: false; reason: "filtered" }
  | {
      ok: false;
      code:
        | "method_not_allowed"
        | "forbidden_origin"
        | "payload_too_large"
        | "bad_request"
        | "invalid"
        | "verification_failed"
        | "rate_limited"
        | "not_configured"
        | "send_failed";
      errors?: Record<string, string>;
    };

const MAX_BYTES = 10_000;
/** Humans take longer than this to fill the form; faster posts are treated as bots. */
const MIN_FILL_MS = 3_000;
export const NEED_IDS = ["get-found", "capture-respond", "follow-up-book", "run-improve"] as const;
const NEED_LABELS: Record<string, string> = {
  "get-found": "Get found",
  "capture-respond": "Capture & respond",
  "follow-up-book": "Follow up & book",
  "run-improve": "Run & improve",
};

function json(body: ContactResult, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

/** Best-effort in-memory limiter (per function instance): N requests per window per key. */
export function memoryRateLimiter(limit = 5, windowMs = 10 * 60_000, now = () => Date.now()) {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    return true;
  };
}

export async function handleContact(
  req: Request,
  env: ContactEnv,
  deps: ContactDeps,
): Promise<Response> {
  const log = deps.log ?? (() => {});
  if (req.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);

  const origin = req.headers.get("origin");
  if (env.CONTACT_ALLOWED_ORIGIN) {
    const allowed = env.CONTACT_ALLOWED_ORIGIN.split(",").map((o) => o.trim());
    if (!origin || !allowed.includes(origin))
      return json({ ok: false, code: "forbidden_origin" }, 403);
  }

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json({ ok: false, code: "payload_too_large" }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!deps.allow(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  // Spam traps: a hidden field humans never fill, and an implausibly fast submit.
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  const trap =
    str(body.website, 200).trim() !== "" ? "honeypot" : elapsed < MIN_FILL_MS ? "too_fast" : null;
  if (trap) {
    log("contact.filtered", { reason: trap });
    return json({ ok: true, delivered: false, reason: "filtered" }, 200);
  }

  const input: ContactInput = {
    name: str(body.name, 200),
    email: str(body.email, 320),
    business: str(body.business, 300),
    interests: Array.isArray(body.needs)
      ? body.needs
          .filter((n): n is string => NEED_IDS.includes(n as never))
          .slice(0, NEED_IDS.length)
      : [],
    message: str(body.message, 4000),
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length)
    return json({ ok: false, code: "invalid", errors: errors as Record<string, string> }, 422);

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: str(body.turnstileToken, 2048),
      remoteip: ip,
    });
    try {
      const v = await deps.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: form,
      });
      const data = (await v.json()) as { success?: boolean };
      if (!data.success) {
        log("contact.verification_failed");
        return json({ ok: false, code: "verification_failed" }, 403);
      }
    } catch (err) {
      log("contact.verification_error", { error: errorName(err) });
      return json({ ok: false, code: "verification_failed" }, 403);
    }
  }

  const missing = REQUIRED_ENV.filter((k) => !env[k]);
  if (missing.length) {
    log("contact.not_configured", { missing: missing.join(", ") });
    return json({ ok: false, code: "not_configured" }, 503);
  }

  const { subject, body: text } = composeMessage(input, NEED_LABELS);
  try {
    const res = await deps.fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: input.email.trim(),
        subject,
        text: `${text}\n\n— Sent from the vivify.solutions contact form at ${new Date(deps.now()).toISOString()}`,
      }),
    });
    if (!res.ok) {
      log("contact.send_failed", { status: res.status });
      return json({ ok: false, code: "send_failed" }, 502);
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return json({ ok: true, delivered: true, id: data.id }, 200);
  } catch (err) {
    log("contact.send_error", { error: errorName(err) });
    return json({ ok: false, code: "send_failed" }, 502);
  }
}

const errorName = (err: unknown) => (err instanceof Error ? err.name : "unknown");
