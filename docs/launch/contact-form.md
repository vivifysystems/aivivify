# Contact form: setting up email delivery with Resend

**Status:** the endpoint is built and tested, but no email is sent until the environment variables below are set, and the Contact
page **shows no form** until the switch `CONTACT_DELIVERY` in `src/content/privacy.ts` is set to `"active"` (see "The one switch"
below). Until then `/api/contact` answers `503 not_configured` and visitors use "Book a free 30-minute call" or "Email me".
Once the form is active, the site shows "Message sent" **only** when the server confirms that Resend accepted the message.

## The confirmed setup (owner decisions, 2026-11-22)

| Item                                             | Value                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Canonical host                                   | `https://www.vivify.solutions` (`CONTACT_ALLOWED_ORIGIN` in Production)                    |
| Sending domain                                   | `mail.vivify.solutions` (a Resend-verified subdomain)                                      |
| Sender (`CONTACT_FROM_EMAIL`)                    | `VIVIFY Website <forms@mail.vivify.solutions>`                                             |
| Public recipient (Production `CONTACT_TO_EMAIL`) | `viviene@vivify.solutions`                                                                 |
| Preview recipient                                | a **separate** test inbox you control; never the production address                        |
| Credentials                                      | server-only environment variables in Vercel; nothing in code, the browser or Git           |
| Other destinations                               | none. The endpoint only calls Resend: no CRM, spreadsheet, Slack or database               |
| Contact page and privacy page                    | stay in the email-only state (`"pending"`, see below) until delivery really works (step 7) |

**Current state of the domain** (public DNS, read on 2026-11-22): nameservers are Cloudflare's; the root has MX records
for Cloudflare Email Routing, an SPF record `v=spf1 include:_spf.mx.cloudflare.net ~all` and a DMARC record
(`p=quarantine`, relaxed alignment). Nothing exists yet for `mail.vivify.solutions`, so adding it touches none of
the root's mail records.

## What the endpoint does

`api/contact.ts` (Vercel Function) wraps `src/lib/contact-handler.ts`:

1. Accepts `POST` JSON only (405 otherwise). Optional Origin allow-list (`CONTACT_ALLOWED_ORIGIN`, 403 otherwise).
2. Rejects bodies over 10 KB (413) and malformed JSON (400).
3. Rate limit: 5 posts per 10 minutes per IP (429). Best effort: the count is kept per function instance.
4. Spam traps: a hidden `website` field and a 3-second minimum fill time. Trapped posts send nothing and the
   visitor sees "Not sent yet".
5. Validates fields with the same rules as the browser (422 with field errors). The email must be one plain
   address, because it becomes the email's reply-to.
6. Optional Cloudflare Turnstile check when `TURNSTILE_SECRET_KEY` is set (403 on failure).
7. Sends one plain-text email through the Resend API with `reply_to` set to the visitor. Control characters are
   stripped from the subject.

**Personal data.** The visitor's name, email, optional business and message are forwarded once to the configured
inbox. Nothing is stored by the site. Function logs contain only event names, provider status codes and missing
variable names (`{"event":"contact.send_failed","status":403}`), never the visitor's details (tested). Resend
keeps its own record of sent emails under its retention policy.

Tests: `src/lib/contact-handler.test.ts` (fake `fetch`, no network), `src/lib/api-build.test.ts` (the compiled
function's imports resolve on Vercel), `e2e/contact-delivery.e2e.mjs` (the real form against the real handler
with a simulated provider).

## Setup, step by step

### 1. Create the Resend account

Sign up at [resend.com](https://resend.com). The free plan is enough for a contact form. Use an inbox you control
(you will receive the account emails there).

### 2. Choose the sending address (confirmed: `mail.vivify.solutions`)

Resend recommends sending from a subdomain, which keeps the form's sending reputation separate from your
everyday mail. Suggested:

- Domain to verify: `mail.vivify.solutions`
- Sender (`CONTACT_FROM_EMAIL`): `VIVIFY Website <forms@mail.vivify.solutions>`

Verifying the root domain (`vivify.solutions`, sender `forms@vivify.solutions`) also works. Verifying a subdomain
does **not** change where mail to `@vivify.solutions` is delivered.

### 3. Verify the domain (DNS)

1. Resend → **Domains** → **Add domain** → enter the domain from step 2 → choose a region. Resend's docs say the
   region controls where mail is routed and sent from (the account's data is stored in the US either way); the options
   are North Virginia, Ireland, São Paulo and Tokyo. Tokyo is the closest to the Philippines. Changing it later means
   deleting and re-adding the domain and its DNS records, so decide now.
2. Resend shows the records to add. Typically:

   | Purpose | Type                      | Name (host), when verifying `mail.vivify.solutions` | Value                                               |
   | ------- | ------------------------- | --------------------------------------------------- | --------------------------------------------------- |
   | DKIM    | TXT                       | `resend._domainkey.mail`                            | the long `p=…` key Resend shows                     |
   | SPF     | MX                        | `send.mail`                                         | the `feedback-smtp…amazonses.com` host, priority 10 |
   | SPF     | TXT                       | `send.mail`                                         | `v=spf1 include:amazonses.com ~all`                 |
   | DMARC   | TXT (optional, see below) | `_dmarc`                                            | e.g. `v=DMARC1; p=none;`                            |

   **Copy the exact names and values Resend shows** in the domain's **Records** tab; they are the source of truth and
   "must match exactly what Resend generated". Resend's Return-Path defaults to `send.<your domain>` (here
   `send.mail.vivify.solutions`). Domains added recently may show CNAME records instead of the MX/TXT pair; Resend's
   docs say a CNAME must **not** be proxied (Cloudflare's orange cloud) or verification will not complete.

3. Find where DNS for `vivify.solutions` is managed: `dig NS vivify.solutions +short`. If the nameservers are
   Vercel's, add the records in Vercel → **Domains** → `vivify.solutions` → **DNS Records**; otherwise at that
   provider.
4. Enter only the host part (`send.mail`, not `send.mail.vivify.solutions`). Paste values without extra quotes or
   spaces. If the DNS host is Cloudflare, set the records to **DNS only** (grey cloud).
5. **Do not edit or remove existing records** for the root domain (its Cloudflare Email Routing MX and SPF records
   deliver your current email). A root `_dmarc` record already exists (`p=quarantine`, relaxed alignment), and it also
   covers the subdomain, so do not add another. Messages sent from `mail.vivify.solutions` are signed with that
   subdomain's own DKIM key, which is what DMARC checks.
6. Back in Resend, press **Verify**. It usually completes within 15 minutes; DNS can take up to 72 hours. If it is
   still not verified after 72 hours, use **Restart verification**. Check with
   `dig TXT resend._domainkey.mail.vivify.solutions +short` (or dns.email).

### 4. Create an API key

Resend → **API Keys** → **Create API key** → a name (50 characters at most, for example `vivify-preview`) →
permission **Sending access** → restrict it to the verified domain `mail.vivify.solutions`. Copy the key (`re_…`)
once; it is not shown again. Do not paste it into chat, email, code or a commit. Use a different key for Production
so each can be revoked alone, and delete any key unused for 30 days. A sending-only key is rejected (`401
restricted_api_key`) by anything other than sending, which is what this endpoint needs.

### 5. Add the Preview environment variables in Vercel

Vercel → project → **Settings** → **Environment Variables** → **Add**. Select **Preview** only (optionally only the
release branch) and mark the key **Sensitive**.

| Name                     | Preview value                                                            | Notes                                                                        |
| ------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `RESEND_API_KEY`         | the key from step 4                                                      | required                                                                     |
| `CONTACT_TO_EMAIL`       | your designated **test** inbox                                           | required                                                                     |
| `CONTACT_FROM_EMAIL`     | `VIVIFY Website <forms@mail.vivify.solutions>`                           | required; must be on the verified domain                                     |
| `CONTACT_ALLOWED_ORIGIN` | the Preview URL, e.g. `https://<project>-git-<branch>-<team>.vercel.app` | recommended; comma-separate several origins; no trailing slash               |
| `TURNSTILE_SECRET_KEY`   | **leave unset**                                                          | the form has no Turnstile widget yet, so setting it rejects every submission |

Environment variables apply to **new** deployments: redeploy the Preview after adding or changing them.

**Test sender and recipient.**

- Before the domain is verified you can try the path with Resend's shared sender
  `VIVIFY Test <onboarding@resend.dev>`; it may only deliver to the address your Resend account is registered with,
  so use that as `CONTACT_TO_EMAIL`.
- `delivered@resend.dev` as `CONTACT_TO_EMAIL` simulates a successful delivery without a real inbox (visible in
  Resend → Emails). Test sends count toward the sending quota.
- For the real test, use the verified sender and a test inbox you control.

**What Resend returns, and what the endpoint does with it.** The endpoint sends `from`, `to`, `reply_to`, `subject` and
`text` to `POST https://api.resend.com/emails`. Resend's default limit is 10 requests per second per team, and the free
plan also has a daily quota (a UTC day). Any non-success answer (for example `403 validation_error` "domain is not
verified", `401 restricted_api_key`, `429 rate_limit_exceeded` or `daily_quota_exceeded`) makes the endpoint return
`502 send_failed`, so the visitor sees "Not sent yet" with the email fallback; the status code goes to the function log
(`{"event":"contact.send_failed","status":403}`), never the visitor's details.

### 6. Validate end to end on the Preview

| Do this                                                                          | Expect                                                                                                                   |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Fill the form normally (take more than 3 seconds) and send                       | "Message sent". Email arrives within about a minute; Resend → Emails shows **Delivered**                                 |
| Open the email                                                                   | From = your sender; subject "Discovery inquiry from …"; all fields present; sent-at timestamp at end                     |
| Press Reply                                                                      | The reply is addressed to the email typed in the form                                                                    |
| Email client: "Show original" / view headers                                     | SPF **pass** and DKIM **pass**                                                                                           |
| Type `name@` in the email field and send                                         | Inline error on the field; nothing sent                                                                                  |
| Send 6 messages within 10 minutes from the same network                          | Usually the 6th shows "Too many attempts from this connection…"; the count is per function instance, so it can take more |
| `curl -s -X POST <preview>/api/contact -H 'origin: https://example.com' -d '{}'` | `403 {"ok":false,"code":"forbidden_origin"}` (when `CONTACT_ALLOWED_ORIGIN` is set)                                      |
| `curl -s <preview>/api/contact`                                                  | `405`                                                                                                                    |
| Vercel → deployment → **Logs**, filter `/api/contact`                            | Only JSON event lines; no names, addresses or message text                                                               |
| Temporarily remove `RESEND_API_KEY` and redeploy (optional)                      | "Not sent yet" with the email fallback                                                                                   |

### 6b. Where a message goes in Production (check this before launch)

Resend delivers to `viviene@vivify.solutions`. Mail for that address is received by **Cloudflare Email Routing** (the
MX records) and **forwarded** to a destination mailbox you set in Cloudflare; the owner's associated mailbox is a
Gmail address. The destination cannot be seen from outside, so confirm it yourself:

1. Cloudflare dashboard → the domain → **Email** → **Email Routing** → **Routes**: the rule for `viviene@` and the
   **Destination addresses** list (it must show the Gmail address as **Verified**). Note whether a catch-all rule exists.
2. Send yourself one ordinary email from another account to `viviene@vivify.solutions` and see where it lands, including
   Spam. (That is a normal email, not a form test. The form test uses the Preview recipient first.)
3. Write down every place a copy can live: the Gmail inbox, its Sent and Spam folders, and any filter or forwarding rule
   in Gmail. The privacy page says copies can exist in more than one place; keep it true.
4. After the first real messages, check Spam in Gmail: forwarded mail sometimes lands there at first.

### 7. Production

After the Preview passes, add the same variables with **Production** scope: `CONTACT_TO_EMAIL` = the real inbox,
`CONTACT_ALLOWED_ORIGIN` = `https://www.vivify.solutions` (the primary host; the apex `vivify.solutions` only
redirects to it, so browsers never post from the apex). Deploy, then send one real test message.

**The one switch: `CONTACT_DELIVERY` in `src/content/privacy.ts`.** It is committed as `"pending"`.

- **While `"pending"`:** the Contact page shows **no form and no "Send a message" button**. The two primary options are
  "Book a free 30-minute call" (Calendly) and "Email me" (`mailto:viviene@vivify.solutions`); the address is shown with a
  "Copy email" button. The site-wide call to action offers "Email me", the readiness check says it only takes visitors to
  the contact page, and `/privacy` says there is no online contact form and names no email provider.
- **When you change it to `"active"`** (and refresh `lastUpdated`): the complete form returns unchanged, with its validation
  and its not-sent fallback, "Send a message" and the "Email directly" card return, and `/privacy` describes the form's data
  and names Resend (processing in the United States, Resend's own retention). Nothing is rebuilt.
- **Order matters:** the form must not appear before real delivery has been verified. So the order is (1) test delivery
  against the Preview's `/api/contact` directly (the endpoint works whatever the page shows), (2) flip the switch on the
  Preview branch and test the form itself, (3) only then go live. See `launch-sequence.md`.
- Tests: `e2e/contact-pending.e2e.mjs` (default build) and `e2e/contact-active.e2e.mjs` (built with
  `npm run build:contact-active`, a test-only mode that no production build uses) cover both states;
  `src/content/privacy.test.ts` checks both wordings and that the committed value is `"pending"`.

**Two things to check before Production (seen in public DNS and HTTP headers on 2026-11-22):**

- **Primary host: `https://www.vivify.solutions`** (owner decision, matching the existing production redirect: the
  apex answers `308` to `www`, and the site is served through Cloudflare in front of Vercel). The release uses this
  host in canonicals, the sitemap, social tags, structured data and the MCP content. In Vercel, `www` must be the
  primary domain and the apex must redirect to it; that is a live setting, so check it, don't change it from here.
  `CONTACT_ALLOWED_ORIGIN` must be exactly `https://www.vivify.solutions` in Production (Preview: the Preview URL),
  or the form answers 403.
- **Rate-limit identity behind Cloudflare.** The limiter keys on the first `x-forwarded-for` address. Behind a
  proxy that can be the proxy's address instead of the visitor's, so limits may be shared or weaker than intended.
  Look at the Preview's behaviour from a real visitor connection before relying on it; the limiter is per function
  instance and best-effort in any case.

**To switch the form off** at any time: set `CONTACT_DELIVERY` back to `"pending"` and deploy. The form disappears and the page returns to "Book a call" and "Email me"; the privacy page matches. Removing `RESEND_API_KEY` as well is optional (the endpoint then answers 503).

## Routing

`vercel.json` has no catch-all rewrite (see `docs/launch/prerender.md`), so `/api/contact` is served by the
function and unknown `/api/*` paths return 404. Verified with a local `vercel build`: the function compiles to
`api/contact.js`, its imports resolve, and it answers 503/400/405 as above without credentials.
