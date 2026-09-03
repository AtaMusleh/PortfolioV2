import ProjectCard from "@/components/ProjectCard";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectsView from "@/components/ProjectsView";
import { portfolio } from "@/data/portfolio";

/**
 * Projects section: heading plus a carousel/grid view switcher.
 *
 * Server Component. Each card and detail panel is rendered here, on the
 * server, and handed to the client <ProjectsView> as a prop — so the switching
 * and carousel logic ships to the browser, but the project content does not.
 *
 * HOW TO UPDATE
 * - Projects: src/data/portfolio.ts (`projects`). Adding one adds a card, a
 *   carousel slide and a pagination dot.
 * - Screenshots: drop a landscape PNG in public/projects/ and point the
 *   project's `image` at it. Cards crop to 16:10.
 */

export default function Projects() {
  const items = portfolio.projects.map((project) => ({
    id: project.id,
    name: project.name,
    card: <ProjectCard project={project} />,
    detail: <ProjectDetail project={project} />,
  }));

  return (
    <section id="projects" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
          Projects
          <span
            aria-hidden
            className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        <ProjectsView items={items} />
      </div>
    </section>
  );
}
