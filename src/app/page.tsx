import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Education />
      {/*
       * Order is load-bearing: the header's scroll-spy resolves ties by
       * NAV_LINKS order, so document order has to match the nav
       * (About, Education, Skills, Projects, Experience, Contact).
       */}
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
