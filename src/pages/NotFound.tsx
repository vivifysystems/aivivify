import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { ViviAvatar } from "@/components/site/Vivi";

export default function NotFound() {
  useRouteMeta({ notFound: true });
  return (
    <section
      aria-labelledby="nf-title"
      className="relative overflow-hidden bg-ground pt-[calc(var(--header-h)+3rem)] pb-24"
    >
      <div className="shell grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <p className="kicker text-cyan">Error 404</p>
          <h1 id="nf-title" className="type-display mt-5 !text-[clamp(2.5rem,6vw,4.5rem)]">
            This page took a different route.
          </h1>
          <p className="type-lede mt-6 text-mist">
            The link may be old or mistyped. These are good places to pick up again.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary">
              Back to home <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/systems" className="btn btn-ghost">
              Browse systems
            </Link>
          </div>
        </div>
        <ViviAvatar size={220} className="mx-auto" />
      </div>
    </section>
  );
}
