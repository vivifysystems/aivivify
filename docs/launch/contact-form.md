# Contact form: enabling server-side delivery

Status: **implemented, inactive.** `api/contact.ts` (Vercel Function) wraps `src/lib/contact-handler.ts`.
Without credentials it answers `503 not_configured` and the site shows an honest "Not sent yet" panel
with a mailto fallback. The UI shows "Message sent" **only** when the server confirms the email provider
accepted the message (`{ ok: true, delivered: true }`).

## What the endpoint does

1. Accepts `POST` JSON only (405 otherwise); optional exact-Origin check (`CONTACT_ALLOWED_ORIGIN`).
2. Rejects bodies over 10 KB (413) and malformed JSON (400).
3. Best-effort rate limit: 5 posts per 10 minutes per IP per function instance (429). For a durable limit,
   add Vercel KV / Upstash later.
4. Spam traps: hidden `website` field and a 3-second minimum fill time. Trapped posts get a quiet
   `{ ok: true, delivered: false }` and nothing is sent.
5. Same validation as the browser (`validateContact`), returning field errors (422).
6. Optional Cloudflare Turnstile verification when `TURNSTILE_SECRET_KEY` is set (403 on failure).
7. Sends one plain-text email through the Resend REST API with `reply_to` set to the visitor. Strips
   control characters from the subject (header-injection safe). No data is stored.

Tests: `src/lib/contact-handler.test.ts` (6 cases, fake `fetch`; no network, no real keys).

## Owner steps to enable (needs approval: external account + production config)

1. **Resend account** (resend.com), free tier is enough for low volume.
2. **Verify the sending domain** in Resend → Domains → Add `vivify.solutions` (or a subdomain such as
   `mail.vivify.solutions`). Add the DNS records Resend shows (SPF `TXT`, DKIM `CNAME`/`TXT`, optional
   DMARC `TXT`) at the domain's DNS host and wait for "Verified".
3. **Create an API key** in Resend with "Sending access" only, limited to that domain.
4. **(Recommended) Cloudflare Turnstile**: create a widget for `vivify.solutions`; note the site key and
   secret. The site key would be added to the form as `VITE_TURNSTILE_SITE_KEY` (widget code not yet
   added; honeypot + time-trap + rate limit are active without it).
5. **Vercel → Project → Settings → Environment Variables** (Production and Preview):

   | Name                     | Example                                   | Required                             |
   | ------------------------ | ----------------------------------------- | ------------------------------------ |
   | `RESEND_API_KEY`         | `re_…`                                    | yes                                  |
   | `CONTACT_TO_EMAIL`       | `viviene@vivify.solutions`                | yes                                  |
   | `CONTACT_FROM_EMAIL`     | `VIVIFY Website <forms@vivify.solutions>` | yes (must be on the verified domain) |
   | `CONTACT_ALLOWED_ORIGIN` | `https://vivify.solutions`                | recommended (set per environment)    |
   | `TURNSTILE_SECRET_KEY`   | `0x…`                                     | optional                             |

6. **Deploy a Preview** of the branch and test: valid submit → email arrives with reply-to; invalid
   email → field error; submit within 3 s → not sent; unset key → "Not sent yet" panel.
7. Confirm the privacy wording on `/privacy` (what is collected, why, retention) before production.

## Routing compatibility

- Today `vercel.json` rewrites `/(.*)` to `/index.html`. Vercel resolves the filesystem and Functions in
  `/api` before rewrites, so `/api/contact` should still reach the function; **verify on the Preview
  deployment** (this cannot be emulated locally without the Vercel CLI).
- With the proposed prerendering config (`docs/launch/prerender.md`) the catch-all rewrite is removed, so
  there is no conflict at all.
- `api/contact.ts` imports `../src/lib/contact-handler.ts` with a `.ts` extension (needed by the Node test
  runner). If the Vercel build rejects that import, inline the handler into `api/` or drop the extension.
  This is the main thing the Preview deployment must confirm.

## Phase 4 QA status (2026-11-22)

- Verified locally: the real UI against the real `handleContact` with a **simulated** provider (valid submit, not
  configured, provider failure, network failure + retry, spam trap, field errors). See `e2e/contact-delivery.e2e.mjs`.
- **Not verified: real delivery.** Blocked on the owner steps above (Resend account, verified domain, env vars on a
  Preview deployment, and a designated test inbox). Do not describe the form as delivering until step 6 is done.
