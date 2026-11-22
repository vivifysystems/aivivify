import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { brand, enabledSystems, footerLinks, links } from "@/content";
import { Wordmark } from "./Header";
import { BookingLink } from "./BookingLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy pt-20 pb-10">
      <div className="shell">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Wordmark />
            <p className="mt-5 max-w-xs text-mist">{brand.positioning}</p>
            <BookingLink className="mt-7" />
          </div>
          <nav aria-label="Systems">
            <p className="kicker text-cyan">Systems</p>
            <ul className="mt-4 space-y-2.5">
              {enabledSystems
                .filter(
                  (s) => s.featured || s.id === "business-websites" || s.id === "ai-receptionist",
                )
                .map((s) => (
                  <li key={s.id}>
                    <Link to={`/systems/${s.id}`} className="text-snow/85 hover:text-snow">
                      {s.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link to="/systems" className="font-semibold text-purple-300 hover:text-purple-200">
                  All systems
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <p className="kicker text-cyan">VIVIFY</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["/solutions", "Solutions"],
                ["/demos", "Demos"],
                ["/work", "Work"],
                ["/about", "About"],
                ["/contact", "Contact"],
                ["/privacy", "Privacy"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-snow/85 hover:text-snow">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-2 sm:col-span-1">
            <p className="kicker text-cyan">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={links.email.href} className="text-snow/85 hover:text-snow">
                  {links.email.label}
                </a>
              </li>
              <li>
                <a
                  href={links.bookingCall.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-snow/85 hover:text-snow"
                >
                  {links.bookingCall.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-snow/85 hover:text-snow"
                  >
                    {l.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <svg aria-hidden viewBox="0 0 1000 205" className="mt-20 w-full select-none">
          <text
            x="-8"
            y="196"
            fontFamily="Sora, sans-serif"
            fontWeight="700"
            fontSize="262"
            letterSpacing="-14"
            fill="rgb(248 250 255 / 0.06)"
            textLength="1010"
            lengthAdjust="spacingAndGlyphs"
          >
            VIVIFY
          </text>
        </svg>
        <div className="mt-8 flex flex-col gap-3 text-sm text-mist sm:flex-row sm:items-start sm:justify-between">
          <p>© {year} VIVIFY Solutions. Founder-led by Viviene Pitogo.</p>
          <p className="max-w-xl sm:text-right">
            VIVI is VIVIFY's brand character. Service demos use a fictional sample business and are
            simulations, not real customer data.
          </p>
        </div>
      </div>
    </footer>
  );
}
