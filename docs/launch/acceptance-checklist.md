# VIVIFY 2.0: manual acceptance tests (real devices)

Run these on the **Vercel Preview** (see `docs/launch/launch-sequence.md`), not on a local build. Opening a Preview needs you to be signed in to Vercel; that is expected. Each test lists what the
automated suite already covers, so you know what only a human can confirm.

**Evidence types used in the release report**

- **Automated**: unit tests and Playwright tests in headless Chromium, run on the release build.
- **Emulated**: Playwright imitating a condition (phone viewport + touch, reduced motion, a shorter viewport
  standing in for the on-screen keyboard, a simulated email provider). Useful, but not the real thing.
- **Real device**: only what you check below. **None of this has been done yet.**

Devices: one iPhone (Safari, current iOS) and one Android phone (Chrome). Desktop: Safari and Chrome on a Mac.
Note the device, OS and browser version next to each result.

## 1. Real phone interaction (iPhone Safari and Android Chrome)

Automated/emulated so far: 320–390 px layouts, touch emulation, menu and drawer behaviour, no horizontal scroll.

- [ ] Home loads without a white flash; hero text, VIVI and the two hero buttons fit the first screen.
- [ ] Scroll the whole homepage with your thumb: nothing jumps, nothing overlaps, no sideways scrolling.
- [ ] Open the menu (top right). Groups expand, links work, the page behind does not scroll, the close button and
      Escape-equivalent (tap outside) work.
- [ ] Demos: pick a demo from the drop-down, play, pause, replay, tap a step. Rotate the phone once.
- [ ] Ask VIVI: open from the header, tap two topics quickly: exactly one reply per question, in order. Close and
      reopen: the conversation is still coherent.
- [ ] Readiness check: answer everything, open the result, press Back, then forward again: answers kept.
      "Start again" clears them. Continue to Contact: only the related need is preselected, and the message says
      nothing has been sent.
- [ ] Work: filter by a tool, open a project, press the browser Back button: you return to the same project
      card with the filter still applied.
- [ ] Tap the logo while scrolled down: the page returns to the top.
- [ ] Open a URL that does not exist (e.g. `/nope`): the "Page not found" page appears.

## 2. Safari and Chromium (desktop)

Automated so far: Chromium only. **Safari has not been tested at all.**

- [ ] Safari: repeat the homepage scroll, Systems menu (hover, click, keyboard), demo playback and Ask VIVI.
- [ ] Safari: fonts load (no fallback serif), VIVI images are sharp, no layout shift after load.
- [ ] Chrome at a short window (about 1024×640): the Systems menu is fully reachable and scrolls inside itself.
- [ ] Both: client-side navigation between pages, then reload on a deep page (`/systems/ai-chatbot`): it loads
      directly (prerendered), with the right tab title.

## 3. VoiceOver (iPhone) or TalkBack (Android)

Automated so far: axe-core finds no serious or critical issues; live-region markup checked in code. **No screen
reader has been used.**

- [ ] Turn on VoiceOver/TalkBack. Swipe through the homepage hero: headings, buttons and links are announced
      with sensible names; decorative images are skipped.
- [ ] Open the menu: focus moves into it; closing returns focus to the menu button.
- [ ] Ask VIVI: send a question; "VIVI is replying" and then the reply are announced **once each**.
- [ ] Contact form: each field announces its label; submit empty: errors are announced and focus lands on the
      first invalid field.
- [ ] Navigate to another page: focus/announcement starts at the new page heading.

## 4. Mobile keyboard behaviour

Emulated so far: viewport shrunk to about 430 px. Real iOS keyboards resize the page differently.

- [ ] Contact form on iPhone and Android: tap each field. The field you are typing in stays visible above the
      keyboard and is not hidden under the fixed header.
- [ ] Email field opens an email keyboard (with @).
- [ ] Ask VIVI on iPhone: type a question. The input and Send button stay visible above the keyboard.
      (Known limitation: the sheet does not lift itself using the visual viewport; note how it behaves.)
- [ ] Rotate with the keyboard open: nothing is cut off permanently.

## 5. Reduced motion

Emulated so far: all 11 demos readable step by step with reduced motion; no looping animation.

- [ ] iPhone: Settings → Accessibility → Motion → Reduce Motion **on**. Reload the site: content appears without
      fade-ins; demos show their full story and every step can be tapped.
- [ ] Mac: System Settings → Accessibility → Display → Reduce motion **on**. Same checks in Safari and Chrome.
- [ ] With reduced motion **off**: the hero VIVI drift stops after a few loops.

## 6. Contact form delivery (needs the Resend setup first; only after the switch is set to "active" on the Preview)

Simulated so far: every success and failure path against a fake email provider. **No real email has been sent.**
Follow `docs/launch/contact-form.md` steps 1–6, then:

- [ ] Send a real message from your phone on mobile data and from a desktop on Wi-Fi.
- [ ] Each arrives once in the test inbox within about a minute; Reply goes to the address you typed.
- [ ] Headers show SPF pass and DKIM pass; it is not in spam.
- [ ] Airplane mode on the phone, then send: "Not sent yet" appears; turn it off, use "Back to the form", your
      text is still there, and sending again delivers exactly one email.
- [ ] Vercel function logs show only event lines, no personal details.

## 7. Calendly booking flow

Not exercised automatically (a test would create a real booking).

- [ ] Press "Book a free 30-minute call" on Home, Contact and a system page: each opens the correct Calendly event
      ("Automation Discovery Call · 30 min").
- [ ] Book a test slot with your own second email address. Confirmation emails arrive for both sides with the
      right time zone, meeting link and wording.
- [ ] Cancel the test booking from the confirmation email; the slot frees up.
- [ ] On a phone, Calendly opens and returns to the site with the browser Back button.

## 8. Brand, content and addresses (Preview)

Automated so far: logo, canonical and content tests in headless Chromium.

- [ ] The Winged V shows in the header (desktop and phone), the open phone menu and the footer; it is sharp, not stretched,
      and the wordmark next to it did not move.
- [ ] The browser tab shows the new icon (try a light and a dark tab); on an iPhone, "Add to Home Screen" shows the touch icon.
- [ ] Share the Preview home page into a messaging app or a link-preview tool: the social image shows the Winged V,
      "VIVIFY SOLUTIONS", the positioning line and `www.vivify.solutions`. (Link previews of a protected Preview may be blank;
      check again on the real domain after launch.)
- [ ] Home: the proof section is about the AI voice receptionist, says "Illustrated example, not a real call", mentions the
      pilot, and shows no testimonial, statistic or recording.
- [ ] Work: exactly five projects. Social Media Auto Poster and UGC Script Generator show "Concept demo" and a notice on their
      pages. No project shows a recording.
- [ ] Contact page (switch pending): **no form and no "Send a message"**; "Book a free 30-minute call" and "Email me" are the two
      obvious options; the address is on screen; "Email me" opens your email app addressed to viviene@vivify.solutions on iPhone,
      Android, Mac Mail and Gmail-in-browser; "Copy email" copies it (paste it somewhere to check) and a screen reader announces "copied".
- [ ] Privacy page: says there is **no online contact form** while the switch is pending; mentions the Philippines, Cloudflare, Gmail,
      and promises no deletion schedule. After activation it describes the form and names Resend.
- [ ] View source on the home page: canonical and `og:url` start with `https://www.vivify.solutions`.

## 9. After launch, on the real domain

- [ ] `https://vivify.solutions` and `http://vivify.solutions` redirect to `https://www.vivify.solutions` and keep the path.
- [ ] `https://www.vivify.solutions/sitemap.xml` lists 26 `https://www...` URLs; `robots.txt` points to it.
- [ ] A page that does not exist (`/nope`) shows the "Page not found" page with HTTP 404.
- [ ] The five retired screenshots return the site's 404/HTML page, not an image.

## Sign-off

| Area                 | iPhone Safari | Android Chrome | Mac Safari | Mac Chrome | Notes |
| -------------------- | ------------- | -------------- | ---------- | ---------- | ----- |
| 1. Phone interaction |               |                | n/a        | n/a        |       |
| 2. Desktop browsers  | n/a           | n/a            |            |            |       |
| 3. Screen reader     |               |                |            |            |       |
| 4. Mobile keyboard   |               |                | n/a        | n/a        |       |
| 5. Reduced motion    |               |                |            |            |       |
| 6. Contact delivery  |               |                |            |            |       |
| 7. Calendly          |               |                |            |            |       |
| 8. Brand and content |               |                |            |            |       |
| 9. After launch      | n/a           | n/a            |            |            |       |
