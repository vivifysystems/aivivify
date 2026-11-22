# VIVIFY 2.0: Preview, launch and rollback sequence

Everything below waits for the owner's explicit approval at each marked step. Contact delivery stays **off** (the switch
`CONTACT_DELIVERY` in `src/content/privacy.ts` stays `"pending"`) until a real message has been delivered and checked. While it is
pending, the Contact page has **no form**: visitors get "Book a free 30-minute call" and "Email me" (a plain `mailto:`), with the
address and a Copy email button, and the privacy page says there is no online contact form.

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

**GitHub authentication.** The push must be made as the account that owns the repository (`vivifysystems`), not as any other
GitHub login stored on the computer. A stored login for a different account is refused with HTTP 403 ("Permission denied").
Use a **fine-grained personal access token** created while signed in to that account: Settings → Developer settings →
Personal access tokens → Fine-grained tokens → Generate new token; Repository access: **only this repository**; Repository
permissions: **Contents: Read and write** (nothing else); expiry: the shortest that suits you (for example 7 days). Give the
token to Git for this one command only, without saving it and without changing any Git or keychain setting:

    read -rs VIVIFY_GH_TOKEN; echo; export VIVIFY_GH_TOKEN
    git -c credential.helper= -c 'credential.helper=!f() { echo username=vivifysystems; echo "password=$VIVIFY_GH_TOKEN"; }; f' \
      push origin release/vivify-2.0-sanitized:refs/heads/preview/v2
    unset VIVIFY_GH_TOKEN

The first `-c credential.helper=` switches off the stored helper for this command. Never paste the token into chat, a file or
a commit. Revoke it (same settings page) when the release is live. A repository deploy key with write access, used through
`GIT_SSH_COMMAND="ssh -i <key> -o IdentitiesOnly=yes"` and the `git@github.com:vivifysystems/aivivify.git` address, works too.

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

The Preview shows the email-only Contact page while the switch is `"pending"`, so test in two rounds:

1. **Endpoint round (switch still pending).** Using the Preview address, `curl` the `/api/contact` endpoint (examples in
   `docs/launch/contact-form.md` step 6): without credentials it answers `503 not_configured`; with credentials, one real message
   to the test inbox; the negative tests (invalid body, trapped honeypot, wrong origin); check the headers for SPF and DKIM pass,
   that it is not in spam, and that Vercel function logs show event names only. Only then is "delivery verified".
2. **Form round.** On the Preview branch only, change `CONTACT_DELIVERY` to `"active"` and refresh `lastUpdated`, push the branch
   (approval), and use the real form from a phone on mobile data and from a desktop; try an empty submit, a message with the phone
   offline, and "Back to the form". Confirm the privacy page now describes the form and Resend.
   If round 2 fails, revert that one commit; the site returns to the email-only state.

## 5. Manual acceptance

`docs/launch/acceptance-checklist.md` on the Preview: real iPhone and Android, Safari and Chrome, VoiceOver/TalkBack, the
phone keyboard, reduced motion, contact delivery, Calendly (a test booking needs your approval), brand and content.

## 6. Production go-live (needs approval; only after steps 1 to 5 pass)

1. Add the same variables with **Production** scope (`CONTACT_TO_EMAIL` = `viviene@vivify.solutions`,
   `CONTACT_ALLOWED_ORIGIN` = `https://www.vivify.solutions`; a different key from Preview).
2. The `"active"` commit from step 4 round 2 is already on the branch (it must not reach `main` without a verified delivery). Re-run the checks.
3. Fast-forward `main` to the branch: `git push origin release/vivify-2.0-sanitized:main`. Vercel deploys to production.
4. Verify with the "after launch" section of the acceptance checklist, then send one real test message through the live form.

## 7. Rollback

- **Site:** Vercel → Deployments → the previous production deployment (the containment build) → **Instant Rollback**. Vercel then stops
  auto-promoting until you undo the rollback; fix forward on the branch and push. Hobby keeps only a few recent deployments, so do
  not wait weeks.
- **Contact form only:** set `CONTACT_DELIVERY` back to `"pending"` and deploy: the form disappears, the Contact page returns to "Book a call" and "Email me", and the privacy page matches. (Removing `RESEND_API_KEY` alone is not enough: the form would still show and visitors would see "Not sent yet".)
- **Git:** revert the release commits with a new commit; never rewrite `main`.

## 8. MCP function (separate approval)

The endpoint still serves the old content (11 projects, old brand) until it is redeployed. Deploy it right after the site goes live, with
the Supabase CLI (`supabase functions deploy mcp --project-ref <ref>`, keeping the live JWT setting), then run the smoke test in the MCP
readiness notes. Roll back by redeploying the previous `supabase/functions/mcp/index.ts`.
