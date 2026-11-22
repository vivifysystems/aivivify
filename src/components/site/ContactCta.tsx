import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { contactFormActive, links } from "@/content";
import { openAskVivi } from "./ask-vivi-events";
import { BookingLink } from "./BookingLink";
import { viviArt } from "./vivi-art";

/** Closing call to action, used on the homepage and inner pages. */
export function ContactCta({ title = "Let's find what's worth automating." }: { title?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative bg-ground py-20 sm:py-28">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-purple-600">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(45%_90%_at_88%_100%,rgb(0_229_255/0.35),transparent_70%),radial-gradient(60%_80%_at_0%_0%,rgb(11_18_53/0.45),transparent_70%)]"
          />
          <div className="relative grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="px-6 py-14 sm:px-12 lg:py-20 lg:pl-16">
              <h2 id="cta-title" data-reveal className="type-h2 max-w-2xl text-white">
                {title}
              </h2>
              <p data-reveal className="type-lede mt-5 max-w-xl text-white/90">
                {contactFormActive
                  ? "Book a free discovery call, send a short message, or ask VIVI a quick question."
                  : "Book a free discovery call, email us, or ask VIVI a quick question."}
                You'll get an honest view of what's worth automating, and what isn't.
              </p>
              <div data-reveal className="mt-9 flex flex-wrap gap-3">
                <BookingLink className="!bg-snow !text-navy hover:!bg-white" />
                {contactFormActive ? (
                  <Link to="/contact" className="btn bg-navy/40 text-white hover:bg-navy/60">
                    Send a message <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : (
                  <a href={links.email.href} className="btn bg-navy/40 text-white hover:bg-navy/60">
                    <Mail className="h-4 w-4" aria-hidden /> Email me
                    <span className="sr-only"> at {links.email.label}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openAskVivi()}
                  className="btn text-white underline-offset-4 hover:underline"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden /> Ask VIVI
                </button>
              </div>
            </div>
            {/* VIVI rises from the band's lower edge: front pose, cropped at the waist. */}
            <div aria-hidden className="relative hidden h-full min-h-[22rem] lg:block">
              <img
                src={viviArt.standing.src}
                alt=""
                width={viviArt.standing.width}
                height={viviArt.standing.height}
                loading="lazy"
                decoding="async"
                className="absolute bottom-[-46%] left-1/2 h-[150%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_-10px_40px_rgb(11_18_53/0.35)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
