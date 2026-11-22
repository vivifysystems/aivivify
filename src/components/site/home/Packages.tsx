import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { packages, pricingNote } from "@/content";
import { SectionHeading } from "../SectionHeading";
import { PackageCard } from "../PackageCard";

export function Packages() {
  return (
    <section aria-labelledby="packages-title" className="section-y relative bg-navy">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="packages-title"
            label="Solution packages"
            title="Three ways to start."
            lede="Packages are starting points, not boxes. Every setup is scoped to how your business actually runs."
          />
          <Link to="/solutions" className="link-arrow text-cyan">
            Compare packages in detail <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {packages.map((p, i) => (
            <div key={p.id} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
              <PackageCard pkg={p} highlight={p.id === "growth"} />
            </div>
          ))}
        </div>
        <p data-reveal className="mt-8 max-w-3xl text-sm text-mist">
          {pricingNote}
        </p>
      </div>
    </section>
  );
}
