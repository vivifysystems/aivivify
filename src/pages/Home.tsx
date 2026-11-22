import { useRouteMeta } from "@/hooks/use-document-meta";
import { Hero } from "@/components/site/home/Hero";
import { ProofCase } from "@/components/site/home/ProofCase";
import { Problems } from "@/components/site/home/Problems";
import { SystemsNavigator } from "@/components/site/home/SystemsNavigator";
import { Showcase } from "@/components/site/home/Showcase";
import { Quiz } from "@/components/site/home/Quiz";
import { Packages } from "@/components/site/home/Packages";
import { FeaturedWork } from "@/components/site/home/FeaturedWork";
import { Tools } from "@/components/site/home/Tools";
import { Founder } from "@/components/site/home/Founder";
import { Process } from "@/components/site/home/Process";
import { Faq } from "@/components/site/home/Faq";
import { ContactCta } from "@/components/site/ContactCta";

export default function Home() {
  useRouteMeta();
  return (
    <>
      <Hero />
      <ProofCase />
      <Problems />
      <SystemsNavigator />
      <Showcase />
      <FeaturedWork />
      <Quiz />
      <Packages />
      <Tools />
      <Founder />
      <Process />
      <Faq />
      <ContactCta />
    </>
  );
}
