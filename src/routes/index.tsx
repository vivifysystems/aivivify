import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vivify/Nav";
import { Hero } from "@/components/vivify/Hero";
import { Framework } from "@/components/vivify/Framework";
import { Skills } from "@/components/vivify/Skills";
import { Projects } from "@/components/vivify/Projects";
import { Testimonial } from "@/components/vivify/Testimonial";
import { Contact, Footer } from "@/components/vivify/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />
      <Hero />
      <Framework />
      <Skills />
      <Projects />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}
