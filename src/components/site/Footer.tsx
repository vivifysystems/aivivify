import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { brand, links } from "@/content";
import { Wordmark } from "./Header";

const explore = [
  ["/solutions", "Solutions"],
  ["/systems", "Systems"],
  ["/demos", "Demos"],
  ["/work", "Work"],
  ["/about", "About"],
] as const;

/** Footer links: 44px tall tap targets on touch screens, compact on pointer screens. */
const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-snow/85 transition-colors hover:text-cyan md:min-h-0 md:py-1";

/** Compact footer: brand, two short link lists, and one quiet bottom line. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-snow/10 bg-navy pt-10 pb-6 md:pt-14 md:pb-7">
      <div className="shell">
        <div className="grid gap-x-8 gap-y-8 min-[360px]:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] md:gap-x-12">
          <div className="min-[360px]:col-span-2 md:col-span-1">
            <Wordmark className="min-h-11 md:min-h-0" />
            <p className="mt-4 max-w-[17rem] text-[0.95rem] leading-relaxed text-mist">
              AI automation and business systems for service businesses.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="kicker text-cyan">Explore</p>
            <ul className="mt-2 md:mt-3">
              {explore.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Connect">
            <p className="kicker text-cyan">Connect</p>
            <ul className="mt-2 md:mt-3">
              <li>
                <a href={links.email.href} className={linkClass}>
                  Email us
                </a>
              </li>
              <li>
                <a
                  href={links.bookingCall.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Book a call
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only">(opens Calendly in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={links.linkedin.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-snow/10 pt-5 text-sm text-mist min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
          <p>
            © {year} {brand.name}.
          </p>
          <p>
            Founded by {brand.operator} <span aria-hidden>·</span>{" "}
            <Link
              to="/privacy"
              className="inline-flex min-h-11 items-center text-snow/85 underline-offset-4 transition-colors hover:text-cyan hover:underline md:min-h-0"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
