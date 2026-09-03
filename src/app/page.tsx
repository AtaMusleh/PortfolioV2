import About from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Education />
      {/*
       * Projects sits before Experience — the header's scroll-spy resolves
       * ties by NAV_LINKS order, so document order has to match the nav
       * (About, Education, Projects, Experience, Contact).
       */}
      <Projects />
      <Experience />
      {/* #contact goes last. */}
    </main>
  );
}
