# VIVIFY 2.0: Preview, launch and rollback sequence

Everything below waits for the owner's explicit approval at each marked step. Contact delivery stays **off** (the privacy page
stays `contactDelivery: "pending"`) until a real message has been delivered and checked.

## Where things stand

- Branch `release/vivify-2.0-sanitized` is rebased on the current production `main` and can be fast-forwarded onto it (no
  merge commit, no conflicts to resolve at merge time). Its tests: 88 unit (all pass with the private review files; 82 pass and
  6 skip without them) and 79 browser (78 pass, 1 skipped by design).
- Production today is the old site. The new site has never been deployed.
- `www.vivify.solutions` is the primary host; the apex redirects to it with HTTP 308 and keeps the path and query. The release
  uses `https://www.vivify.solutions` in canonicals, the sitemap, social tags, structured data and the MCP content.
- The project is not connected to Lovable. The MCP function (`supabase/functions/mcp`) is therefore **not** redeployed by a
  Git push: it is deployed separately (see step 8).

## 1. Resend and DNS (owner; see `docs/launch/contact-form.md` steps 1 to 4)

Account, `mail.vivify.solutions` domain, DNS records in Cloudflare as **DNS only**, verified, then a Sending-access API key
restricted to that domain. Cloudflare Email Routing for `viviene@vivify.solutions` is not touched.

## 2. Publish a Preview branch (needs approval)

Vercel builds a Preview from every pushed branch except `main`. Use a **short** branch name so the Preview address is
predictable (Vercel shortens addresses over 63 characters, and `release/vivify-2.0-sanitized` is too long):

    git push origin release/vivify-2.0-sanitized:refs/heads/preview/v2

The expected stable address is `https://aivivify-git-preview-v2-vivifysystems-projects.vercel.app` (copy the exact address
from Vercel → Deployments → the Preview). Vercel Authentication protects Previews: you must be signed in to open it.
**The repository is public, so pushing this branch publishes the release source on GitHub before launch** (the code is not
secret; it contains no credentials). Say so before approving.

## 3. Preview environment variables (Vercel → Settings → Environment Variables → Preview only)

| Name                     | Value                                                                    |
| ------------------------ | ------------------------------------------------------------------------ |
| `RESEND_API_KEY`         | the Preview key (mark **Sensitive**)                                     |
| `CONTACT_FROM_EMAIL`     | `VIVIFY Website <forms@mail.vivify.solutions>`                           |
| `CONTACT_TO_EMAIL`       | a **separate test inbox you control** (never `viviene@vivify.solutions`) |
| `CONTACT_ALLOWED_ORIGIN` | the exact Preview address from step 2, no trailing slash                 |
| `TURNSTILE_SECRET_KEY`   | leave unset                                                              |

Add them **before** the first Preview deploy or redeploy afterwards (variables apply to new deployments only). The Preview
address must match `CONTACT_ALLOWED_ORIGIN`; the per-deployment unique address does not, so test from the branch address.

## 4. End-to-end contact test (needs approval before the first real message)

Run the table in `docs/launch/contact-form.md` step 6 in this order: (a) the endpoint without credentials answers
`503 not_configured`; (b) with credentials, one message to the test inbox from a phone and one from a desktop; (c) the
negative tests (empty form, trapped honeypot, `curl` with a wrong origin, offline phone); (d) check headers for SPF and DKIM
pass and that it is not in spam; (e) Vercel function logs show event names only. Only then is "delivery verified".

## 5. Manual acceptance

`docs/launch/acceptance-checklist.md` on the Preview: real iPhone and Android, Safari and Chrome, VoiceOver/TalkBack, the
phone keyboard, reduced motion, contact delivery, Calendly (a test booking needs your approval), brand and content.

## 6. Production go-live (needs approval; only after steps 1 to 5 pass)

1. Add the same variables with **Production** scope (`CONTACT_TO_EMAIL` = `viviene@vivify.solutions`,
   `CONTACT_ALLOWED_ORIGIN` = `https://www.vivify.solutions`; a different key from Preview).
2. In `src/content/privacy.ts` set `contactDelivery: "active"` and refresh `lastUpdated`; commit it on the branch; re-run the checks.
3. Fast-forward `main` to the branch: `git push origin release/vivify-2.0-sanitized:main`. Vercel deploys to production.
4. Verify with the "after launch" section of the acceptance checklist, then send one real test message through the live form.

## 7. Rollback

- **Site:** Vercel → Deployments → the previous production deployment (the containment build) → **Instant Rollback**. Vercel then stops
  auto-promoting until you undo the rollback; fix forward on the branch and push. Hobby keeps only a few recent deployments, so do
  not wait weeks.
- **Contact form only:** remove `RESEND_API_KEY` from Production and redeploy: the form shows "Not sent yet" with the email fallback.
  If you do this, also set `contactDelivery` back to `"pending"` so the privacy page stays true.
- **Git:** revert the release commits with a new commit; never rewrite `main`.

## 8. MCP function (separate approval)

The endpoint still serves the old content (11 projects, old brand) until it is redeployed. Deploy it right after the site goes live, with
the Supabase CLI (`supabase functions deploy mcp --project-ref <ref>`, keeping the live JWT setting), then run the smoke test in the MCP
readiness notes. Roll back by redeploying the previous `supabase/functions/mcp/index.ts`.
