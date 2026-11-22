import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, PlayCircle, X } from "lucide-react";
import {
  projectById,
  projectCategory,
  projects,
  projectTools,
  systems,
  workCategories,
} from "@/content";
import { fullImage } from "@/components/vivify/media";
import { useRouteMeta } from "@/hooks/use-document-meta";
import { useViewTransitionLink } from "@/hooks/use-view-transition-link";
import { ContactCta } from "@/components/site/ContactCta";
import { ProjectMedia } from "@/components/site/work/ProjectMedia";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

/** Google Drive recordings load only on request (third-party player). */
function DemoRecording({ url, title }: { url: string; title: string }) {
  const [load, setLoad] = useState(false);
  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-3xl bg-navy-800">
        {load ? (
          <iframe
            src={url}
            title={`${title}: demo recording`}
            allow="autoplay; fullscreen"
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoad(true)}
            className="group grid h-full w-full place-items-center bg-[radial-gradient(closest-side,rgb(163_60_255/0.25),transparent)] text-center"
          >
            <span>
              <PlayCircle
                className="mx-auto h-14 w-14 text-snow transition-transform group-hover:scale-110"
                aria-hidden
              />
              <span className="mt-3 block font-semibold">Play the demo recording</span>
              <span className="mt-1 block text-sm text-mist">
                Loads Google Drive's video player
              </span>
            </span>
          </button>
        )}
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="link-arrow mt-3 text-sm text-cyan">
        Open the recording in a new tab <ExternalLink className="h-4 w-4" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

export default function WorkDetail() {
  const { slug = "" } = useParams();
  const project = projectById(slug);
  useRouteMeta();
  const i = projects.findIndex((p) => p.id === slug);
  const next = projects[(i + 1) % projects.length];
  const backTo = useViewTransitionLink("/work");
  const nextTo = useViewTransitionLink(`/work/${next?.id ?? ""}`);
  if (!project) return <NotFound />;

  const img = fullImage(project.media.proof);
  const cat = workCategories.find((c) => c.id === projectCategory[project.id]);
  const relatedSystems = systems.filter(
    (s) => s.enabled && s.relatedProjects?.includes(project.id),
  );
  const tools = projectTools(project);
  const longTitle = project.title.length > 32;

  return (
    <>
      <section
        aria-labelledby="page-title"
        className="relative overflow-hidden bg-ground pb-14 pt-[calc(var(--header-h)+2.5rem)]"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_10%,rgb(163_60_255/0.2),transparent_70%)]"
        />
        <div className="shell relative">
          <Link
            to="/work"
            onClick={backTo}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mist hover:text-snow"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All work
          </Link>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="kicker text-cyan">Case study · {cat?.label}</p>
              <h1
                id="page-title"
                className={cn(
                  "type-display mt-4",
                  longTitle
                    ? "!text-[clamp(2.1rem,3.6vw,3.25rem)]"
                    : "!text-[clamp(2.4rem,4.4vw,4rem)]",
                )}
              >
                {project.title}
              </h1>
              <p className="type-lede mt-5 text-snow/85">{project.summary}</p>
              {project.beta && (
                <p className="mt-5 inline-flex rounded-full bg-purple-600/20 px-3 py-1.5 text-sm font-semibold text-purple-200">
                  In beta, still being refined
                </p>
              )}
              {project.kind === "concept" && (
                <p className="mt-5 max-w-xl rounded-2xl bg-purple-600/20 px-4 py-3 text-sm font-semibold text-purple-100">
                  Concept demonstration: built with sample data to show the approach. This is not a
                  delivered client project.
                </p>
              )}
            </div>
            <ProjectMedia
              project={project}
              tinted={false}
              transitionName={`project-${project.id}`}
              className="aspect-[16/10] rounded-[1.75rem] ring-1 ring-snow/10"
            />
          </div>
        </div>
      </section>

      <section aria-label="Project at a glance" className="bg-ground">
        <div className="shell">
          <dl className="grid gap-px overflow-hidden rounded-3xl bg-snow/8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Category", cat?.label ?? "Automation"],
              ["Built by", "Viviene Pitogo"],
              [
                "Status",
                project.kind === "concept" ? "Concept demo" : project.beta ? "Beta" : "Built",
              ],
              ["Tools", tools.join(", ")],
            ].map(([k, v]) => (
              <div key={k} className="bg-navy-800 p-5">
                <dt className="text-sm text-mist">{k}</dt>
                <dd className="mt-1 font-semibold leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Case study" className="bg-ground py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            {[
              ["The problem", project.caseStudy.problem],
              ["What I built", project.caseStudy.solution],
              ["The result", project.caseStudy.result],
            ].map(([h, body], idx) => (
              <div
                key={h}
                data-reveal
                style={{ "--reveal-i": idx } as React.CSSProperties}
                className={cn(idx === 2 && "lg:rounded-3xl lg:bg-navy-800 lg:p-7")}
              >
                <h2 className="type-h3">{h}</h2>
                <p className="mt-4 text-[1.075rem] leading-relaxed text-snow/90">{body}</p>
              </div>
            ))}
          </div>

          {img && (
            <figure data-reveal className="mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="type-h3">The workflow</h2>
                <Dialog.Root>
                  <Dialog.Trigger className="btn btn-ghost !min-h-11">
                    <Maximize2 className="h-4 w-4" aria-hidden /> View full size
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[60] bg-ground/90" />
                    <Dialog.Content className="fixed inset-2 z-[61] flex flex-col rounded-2xl bg-navy-800 p-3 sm:inset-6">
                      <div className="flex items-center justify-between gap-4 px-2 pb-3">
                        <Dialog.Title className="font-semibold">
                          {project.title}: workflow
                        </Dialog.Title>
                        <Dialog.Description className="sr-only">
                          Full-size workflow screenshot. Scroll to pan.
                        </Dialog.Description>
                        <Dialog.Close
                          className="grid h-11 w-11 place-items-center rounded-full hover:bg-snow/10"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5" aria-hidden />
                        </Dialog.Close>
                      </div>
                      <div className="flex-1 overflow-auto rounded-xl bg-ground">
                        <img
                          src={img}
                          alt={`Full-size workflow screenshot: ${project.title}`}
                          className="max-w-none"
                        />
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl bg-navy-800 ring-1 ring-snow/10">
                <img
                  src={img}
                  alt={`Workflow screenshot: ${project.title}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm text-mist">
                Screenshot of the automation as built.
              </figcaption>
            </figure>
          )}

          {project.demoUrl && (
            <div id="demo" data-reveal className="mt-20 max-w-4xl scroll-mt-28">
              <h2 className="type-h3 mb-6">Demo recording</h2>
              <DemoRecording url={project.demoUrl} title={project.title} />
            </div>
          )}

          <div className="mt-20 grid gap-5 md:grid-cols-2">
            {relatedSystems.length > 0 && (
              <div className="rounded-3xl bg-navy-800 p-7">
                <h2 className="font-display text-lg font-semibold">
                  Built for a business like yours
                </h2>
                <p className="mt-2 text-mist">
                  The techniques in this project power these VIVIFY systems.
                </p>
                <ul className="mt-4 space-y-2">
                  {relatedSystems.map((s) => (
                    <li key={s.id}>
                      <Link to={`/systems/${s.id}`} className="link-arrow min-h-9 text-cyan">
                        {s.exploreLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              to={`/work/${next.id}`}
              onClick={nextTo}
              className="group flex flex-col justify-between rounded-3xl bg-navy-800 p-7 hover:bg-navy-700"
            >
              <span className="text-sm text-mist">Next case study</span>
              <span className="mt-2 font-display text-xl font-semibold">{next.title}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-cyan">
                Read it{" "}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <ContactCta title="Want something like this for your business?" />
    </>
  );
}
