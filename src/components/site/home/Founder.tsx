import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import portrait from "@/assets/optimized/card/viviene-portrait.webp";
import { founder } from "@/content";
import { SectionHeading } from "../SectionHeading";

export function Founder() {
  return (
    <section aria-labelledby="founder-title" className="on-light section-y relative">
      <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <figure data-reveal className="relative mx-auto w-full max-w-md lg:mx-0">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(163_60_255/0.22),transparent)]"
          />
          <img
            src={portrait}
            alt="Portrait of Viviene Pitogo, founder of VIVIFY Solutions"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="relative aspect-square w-full rounded-[2rem] object-cover"
          />
          <figcaption className="relative mt-4 text-sm text-slate">
            <span className="font-semibold text-navy">{founder.name}</span> · {founder.role}
          </figcaption>
        </figure>
        <div>
          <SectionHeading
            id="founder-title"
            tone="light"
            label="Meet the founder"
            title="Engineering first. Business problem always."
          />
          <p data-reveal className="type-lede mt-6 font-medium text-navy">
            {founder.intro}
          </p>
          {founder.story.map((p) => (
            <p key={p.slice(0, 20)} data-reveal className="mt-4 text-slate">
              {p}
            </p>
          ))}
          <ul className="mt-9 grid gap-5 sm:grid-cols-2">
            {founder.approach.map((a, i) => (
              <li key={a.title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
                <p className="font-display font-semibold text-navy">{a.title}</p>
                <p className="mt-1 text-[0.95rem] text-slate">{a.line}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/about" className="btn btn-primary">
              More about Viviene <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/work" className="btn btn-outline-dark">
              View the portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
