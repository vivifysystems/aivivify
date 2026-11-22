import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { faqs } from "@/content";
import { SectionHeading } from "../SectionHeading";
import { ViviSays } from "../Vivi";
import { openAskVivi } from "../ask-vivi-events";

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="section-y relative bg-ground">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            id="faq-title"
            label="FAQ"
            title="Straight answers."
            lede="Costs, timing, AI limits, handoffs and the tools you already use."
          />
          <ViviSays className="mt-10">
            Can't find your question? Ask me, or I'll point you to Viviene.
          </ViviSays>
          <button type="button" onClick={() => openAskVivi()} className="btn btn-ghost mt-5">
            <MessageCircle className="h-4 w-4" aria-hidden /> Ask VIVI
          </button>
        </div>
        <Accordion.Root
          type="single"
          collapsible
          className="divide-y divide-snow/10 border-y border-snow/10"
        >
          {faqs.map((f) => (
            <Accordion.Item key={f.id} value={f.id}>
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold sm:text-xl">
                  {f.question}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-800 transition-colors group-hover:bg-navy-700">
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-2xl pb-6 text-mist">{f.answer}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
