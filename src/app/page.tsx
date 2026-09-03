import About from "@/components/About";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      {/* Remaining sections land here: #projects, #experience, #contact. */}
    </main>
  );
}
