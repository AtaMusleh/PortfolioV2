import About from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Education />
      {/*
       * #projects goes HERE, before Experience — the header's scroll-spy
       * resolves ties by NAV_LINKS order, so document order has to match the
       * nav (About, Education, Projects, Experience, Contact).
       */}
      <Experience />
      {/* #contact goes last. */}
    </main>
  );
}
