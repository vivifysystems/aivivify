import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import portrait from "@/assets/optimized/card/viviene-portrait.webp";
import { founder, projects, toolGroups, tools } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";
import { ContactCta } from "@/components/site/ContactCta";
import { viviArt } from "@/components/site/vivi-art";

export default function About() {
  useRouteMeta();
  return (
    <>
      <PageHero
        label="About"
        title="Founder-led, on purpose."
        lede="VIVIFY Solutions is a small, founder-led practice. You work directly with the person who designs and builds your systems."
        aside={
          <img
            src={portrait}
            alt="Portrait of Viviene Pitogo, founder of VIVIFY Solutions"
            width={800}
            height={800}
            className="anim-rise aspect-square w-full max-w-xs rounded-[2rem] object-cover lg:justify-self-end"
          />
        }
      />

      <section aria-labelledby="story-title" className="bg-ground pb-24">
        <div className="shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 id="story-title" className="type-h2">
              {founder.name}
            </h2>
            <p className="mt-2 text-mist">{founder.role}</p>
            <p className="type-lede mt-8 font-medium">{founder.intro}</p>
            {founder.story.map((p) => (
              <p key={p.slice(0, 16)} className="mt-5 text-lg leading-relaxed text-snow/85">
                {p}
              </p>
            ))}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/work" className="btn btn-primary">
                See {projects.length} projects <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-navy-800 p-8">
            <h2 className="font-display text-xl font-semibold">How I work</h2>
            <ul className="mt-6 space-y-6">
              {founder.approach.map((a) => (
                <li key={a.title}>
                  <p className="font-semibold text-purple-200">{a.title}</p>
                  <p className="mt-1 text-mist">{a.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="section-y bg-navy">
        <div className="shell">
          <h2 id="stack-title" className="type-h2">
            Tools I build with.
          </h2>
          <p className="type-lede mt-4 max-w-2xl text-mist">
            Drawn from the projects in my portfolio, alongside a programming background in C++ and
            embedded systems.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {toolGroups.map((g) => (
              <div key={g.id}>
                <h3 className="font-display font-semibold">{g.label}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tools
                    .filter((t) => t.group === g.id)
                    .map((t) => (
                      <li key={t.name}>
                        <Link
                          to={`/work?tool=${encodeURIComponent(t.name)}`}
                          className="block rounded-full bg-navy-700 px-3 py-1.5 text-sm hover:bg-navy-600"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="vivi-title" className="section-y on-light overflow-hidden">
        <div className="shell grid items-center gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <img
            src={viviArt.standing.src}
            alt="VIVI, the VIVIFY Solutions brand character, standing in her white, navy and purple armour with a purple cape."
            width={viviArt.standing.width}
            height={viviArt.standing.height}
            loading="lazy"
            decoding="async"
            className="mx-auto h-[28rem] w-auto drop-shadow-[0_30px_40px_rgb(11_18_53/0.35)]"
          />
          <div>
            <p className="kicker text-cyan-700">Meet VIVI</p>
            <h2 id="vivi-title" className="type-h2 mt-4">
              The Automation Architect.
            </h2>
            <p className="type-lede mt-6 text-slate">
              VIVI is VIVIFY's brand character and your guide around this site. She introduces the
              systems, narrates the demos and answers common questions in Ask VIVI.
            </p>
            <p className="mt-4 text-slate">
              She's a guide, not a product: the customer-facing assistants we build for clients
              carry their own business's name and always say they're automated.
            </p>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
