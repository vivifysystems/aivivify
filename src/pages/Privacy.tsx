import { Link } from "react-router-dom";
import { links } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";

export default function Privacy() {
  useRouteMeta();
  const items = [
    ["Readiness check", "Your answers are scored in your browser and are never sent or stored."],
    [
      "Ask VIVI",
      "A guided assistant with pre-written answers. What you type stays in your browser and isn't sent anywhere.",
    ],
    [
      "Contact form",
      "When you send the form, your name, email, optional business details and message are emailed to VIVIFY so we can reply. If sending fails, nothing is stored and you can email us directly instead.",
    ],
    [
      "Booking",
      "Discovery calls are scheduled through Calendly, which has its own privacy policy.",
    ],
    [
      "Demo recordings",
      "Some case studies offer recordings hosted on Google Drive. Google's player loads only when you choose to play one.",
    ],
  ];
  return (
    <>
      <PageHero
        label="Privacy"
        title="Plainly put."
        lede="This site is designed to work without collecting your personal information."
      />
      <section aria-label="Privacy details" className="bg-ground pb-24">
        <div className="shell max-w-3xl">
          <dl className="space-y-8">
            {items.map(([t, d]) => (
              <div key={t}>
                <dt className="font-display text-xl font-semibold">{t}</dt>
                <dd className="mt-2 text-lg text-snow/85">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-mist">
            Questions? Email{" "}
            <a href={links.email.href} className="text-cyan underline-offset-4 hover:underline">
              {links.email.label}
            </a>{" "}
            or visit the{" "}
            <Link to="/contact" className="text-cyan underline-offset-4 hover:underline">
              contact page
            </Link>
            .
          </p>
          <p className="mt-6 text-sm text-mist">
            This summary describes how the site works today. Have it reviewed before launch if your
            jurisdiction requires a formal privacy policy.
          </p>
        </div>
      </section>
    </>
  );
}
