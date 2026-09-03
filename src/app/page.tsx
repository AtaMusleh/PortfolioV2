import About from "@/components/About";
import Contact from "@/components/Contact";
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
       * #skills goes HERE, between Education and Projects — the header's
       * scroll-spy resolves ties by NAV_LINKS order, so document order has to
       * match the nav (About, Education, Skills, Projects, Experience, Contact).
       */}
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
