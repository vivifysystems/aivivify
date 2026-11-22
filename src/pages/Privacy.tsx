import { Fragment } from "react";
import { Link } from "react-router-dom";
import { links } from "@/content";
import { formatLastUpdated, privacy, privacySections } from "@/content/privacy";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";

const linkClass = "text-cyan underline underline-offset-4 hover:text-snow";

/** Turns the contact email and the NPC address inside a paragraph into links. */
function Linked({ text }: { text: string }) {
  const parts = text.split(/(viviene@vivify\.solutions|privacy\.gov\.ph)/);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part === links.email.label ? (
            <a href={links.email.href} className={linkClass}>
              {part}
            </a>
          ) : part === "privacy.gov.ph" ? (
            <a href="https://privacy.gov.ph" target="_blank" rel="noreferrer" className={linkClass}>
              {part}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </>
  );
}

export default function Privacy() {
  useRouteMeta();
  const sections = privacySections();
  return (
    <>
      <PageHero
        label="Privacy"
        title="Plainly put."
        lede="What this website collects, who handles it, how long we keep it, and how to ask us to delete it."
      />
      <section aria-label="Privacy policy" className="bg-ground pb-24">
        <div className="shell max-w-3xl">
          <p className="text-mist">Last updated {formatLastUpdated(privacy.lastUpdated)}</p>
          <div className="mt-8 space-y-10">
            {sections.map((s) => (
              <section key={s.id} aria-labelledby={`privacy-${s.id}`}>
                <h2 id={`privacy-${s.id}`} className="font-display text-xl font-semibold">
                  {s.title}
                </h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-lg text-snow/85">
                    <Linked text={p} />
                  </p>
                ))}
              </section>
            ))}
          </div>
          <p className="mt-12 text-mist">
            Questions? Email{" "}
            <a href={links.email.href} className={linkClass}>
              {links.email.label}
            </a>{" "}
            or visit the{" "}
            <Link to="/contact" className={linkClass}>
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
