import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import type { Demo } from "@/content";
import { DemoPlayer } from "./DemoPlayer";

/** "See short demo": opens the full player for one demo in an accessible dialog. */
export function DemoDialog({ demo, trigger }: { demo: Demo; trigger: React.ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ground/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={`dlg-${demo.id}-summary`}
          className="fixed inset-x-3 top-[3vh] bottom-[3vh] z-50 mx-auto max-w-5xl overflow-y-auto rounded-3xl bg-navy-800 p-5 shadow-2xl ring-1 ring-snow/10 data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 sm:p-9"
        >
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="type-h3">{demo.title}</Dialog.Title>
              <p id={`dlg-${demo.id}-summary`} className="mt-1.5 text-mist">
                {demo.summary}
              </p>
            </div>
            <Dialog.Close
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-700 hover:bg-navy-600"
              aria-label="Close demo"
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>
          <DemoPlayer demo={demo} />
          <div className="mt-8 flex flex-wrap gap-5">
            <Link to={`/systems/${demo.systemId}`} className="link-arrow text-cyan">
              How this system works <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/demos" className="link-arrow text-snow">
              All demos <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
