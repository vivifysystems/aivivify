import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import { enabledSystems, packages, pricingNote } from "@/content";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { PageHero } from "@/components/site/PageHero";
import { PackageCard } from "@/components/site/PackageCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ContactCta } from "@/components/site/ContactCta";
import { AvailabilityBadge } from "@/components/site/Badges";

export default function Solutions() {
  useRouteMeta();
  const rows = enabledSystems.filter((s) =>
    packages.some((p) => p.systems.includes(s.id) || p.addOns.includes(s.id)),
  );
  return (
    <>
      <PageHero
        label="Solutions"
        title="Start where your time goes."
        lede="Three packages built around the most common needs of service businesses. Each one is scoped and quoted for your business; nothing here is one-size-fits-all."
        vivi="Not sure which fits? The 2-minute readiness check on the homepage suggests a starting point."
      />
      <section aria-label="Packages" className="bg-ground pb-24">
        <div className="shell grid gap-5 lg:grid-cols-3">
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} highlight={p.id === "growth"} />
          ))}
        </div>
        <p className="shell mt-8 max-w-3xl text-sm text-mist">{pricingNote}</p>
      </section>

      <section aria-labelledby="compare-title" className="section-y bg-navy">
        <div className="shell">
          <SectionHeading id="compare-title" label="Compare" title="What each package includes." />
          <div className="relative mt-12 overflow-x-auto rounded-3xl bg-navy-800">
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">Systems included in each package</caption>
              <thead>
                <tr className="border-b border-snow/10">
                  <th scope="col" className="px-6 py-5 font-display text-base font-semibold">
                    System
                  </th>
                  {packages.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className="px-6 py-5 font-display text-base font-semibold"
                    >
                      {p.name.replace("VIVIFY ", "")}
                      {p.availability === "pilot" && (
                        <span className="ml-2 text-[0.8125rem] font-normal text-purple-200">
                          (pilot)
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-snow/6 last:border-0">
                    <th scope="row" className="px-6 py-4 font-medium">
                      <Link to={`/systems/${s.id}`} className="hover:underline">
                        {s.title}
                      </Link>
                      {s.availability !== "available" && (
                        <AvailabilityBadge value={s.availability} className="ml-3 align-middle" />
                      )}
                    </th>
                    {packages.map((p) => (
                      <td key={p.id} className="px-6 py-4">
                        {p.systems.includes(s.id) ? (
                          <span className="inline-flex items-center gap-2 text-cyan">
                            <Check className="h-5 w-5" aria-hidden />
                            <span className="sr-only">Included</span>
                          </span>
                        ) : p.addOns.includes(s.id) ? (
                          <span className="text-sm text-mist">Optional add-on</span>
                        ) : (
                          <span className="text-snow/30">
                            <Minus className="h-5 w-5" aria-hidden />
                            <span className="sr-only">Not included</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-mist">
            Packages can be combined, and any system can be added on its own. See the{" "}
            <Link
              to="/systems"
              className="text-cyan underline underline-offset-4 hover:no-underline"
            >
              full systems catalog
            </Link>
            .
          </p>
        </div>
      </section>
      <ContactCta title="Tell us how you work. We'll suggest the smallest useful setup." />
    </>
  );
}
