# Contact form: setting up email delivery with Resend

**Status:** the endpoint is built and tested, but no email is sent until the environment variables below are set.
Until then `/api/contact` answers `503 not_configured` and the site shows "Not sent yet" with an email fallback.
The site shows "Message sent" **only** when the server confirms that Resend accepted the message.

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

### 2. Choose the sending address

Resend recommends sending from a subdomain, which keeps the form's sending reputation separate from your
everyday mail. Suggested:

- Domain to verify: `mail.vivify.solutions`
- Sender (`CONTACT_FROM_EMAIL`): `VIVIFY Website <forms@mail.vivify.solutions>`

Verifying the root domain (`vivify.solutions`, sender `forms@vivify.solutions`) also works. Verifying a subdomain
does **not** change where mail to `@vivify.solutions` is delivered.

### 3. Verify the domain (DNS)

1. Resend → **Domains** → **Add domain** → enter the domain from step 2 → pick the region closest to you.
2. Resend shows the records to add. Typically:

   | Purpose | Type                      | Name (host), when verifying `mail.vivify.solutions` | Value                                               |
   | ------- | ------------------------- | --------------------------------------------------- | --------------------------------------------------- |
   | DKIM    | TXT                       | `resend._domainkey.mail`                            | the long `p=…` key Resend shows                     |
   | SPF     | MX                        | `send.mail`                                         | the `feedback-smtp…amazonses.com` host, priority 10 |
   | SPF     | TXT                       | `send.mail`                                         | `v=spf1 include:amazonses.com ~all`                 |
   | DMARC   | TXT (optional, see below) | `_dmarc`                                            | e.g. `v=DMARC1; p=none;`                            |

   **Copy the exact names and values Resend shows**; they are the source of truth. Domains added recently may show
   CNAME records instead of the MX/TXT pair.

3. Find where DNS for `vivify.solutions` is managed: `dig NS vivify.solutions +short`. If the nameservers are
   Vercel's, add the records in Vercel → **Domains** → `vivify.solutions` → **DNS Records**; otherwise at that
   provider.
4. Enter only the host part (`send.mail`, not `send.mail.vivify.solutions`). Paste values without extra quotes or
   spaces. If the DNS host is Cloudflare, set the records to **DNS only** (grey cloud).
5. **Do not edit or remove existing records** for the root domain (its MX and SPF records deliver your current
   email). If a `_dmarc` record already exists, leave it as it is; only add one if there is none.
6. Back in Resend, press **Verify**. It usually completes within 15 minutes, occasionally up to 72 hours. Check
   with `dig TXT resend._domainkey.mail.vivify.solutions +short`.

### 4. Create an API key

Resend → **API Keys** → **Create API key** → permission **Sending access**, restricted to the verified domain.
Copy the key (`re_…`) once; it is not shown again. Do not paste it into chat, email, code or a commit.

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

### 7. Production

After the Preview passes, add the same variables with **Production** scope: `CONTACT_TO_EMAIL` = the real inbox,
`CONTACT_ALLOWED_ORIGIN` = `https://vivify.solutions` (add `https://www.vivify.solutions` if that host serves the
site rather than redirecting). Deploy, then send one real test message. Confirm the privacy page wording first.

**To switch delivery off** at any time: remove `RESEND_API_KEY` from Production and redeploy. The form then shows
"Not sent yet" with the email fallback; no code change is needed.

## Routing

`vercel.json` has no catch-all rewrite (see `docs/launch/prerender.md`), so `/api/contact` is served by the
function and unknown `/api/*` paths return 404. Verified with a local `vercel build`: the function compiles to
`api/contact.js`, its imports resolve, and it answers 503/400/405 as above without credentials.
