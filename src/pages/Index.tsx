import { Nav } from "@/components/vivify/Nav";
import { Hero } from "@/components/vivify/Hero";
import { Marquee } from "@/components/vivify/Marquee";
import { Process } from "@/components/vivify/Process";
import { Framework } from "@/components/vivify/Framework";
import { Skills } from "@/components/vivify/Skills";
import { Projects } from "@/components/vivify/Projects";
import { About } from "@/components/vivify/About";
import { Results } from "@/components/vivify/Results";
import { Contact, Footer } from "@/components/vivify/Contact";

export default function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <Process />
      <Skills />
      <Projects />
      <Framework />
      <About />
      <Results />
      <Contact />
      <Footer />
    </main>
  );
}