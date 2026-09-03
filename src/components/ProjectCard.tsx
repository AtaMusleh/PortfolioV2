import { FiExternalLink, FiGithub, FiZap } from "react-icons/fi";
import ProjectImage from "@/components/ProjectImage";
import type { Project } from "@/data/portfolio";

/**
 * A single project card. Extracted from Projects.tsx so the grid and the
 * carousel render the same markup rather than two copies that drift.
 *
 * Server Component (apart from the nested <ProjectImage>) and deliberately
 * free of event handlers: <ProjectsView> renders this on the server and
 * receives it as a prop, so the card content never enters the client bundle.
 */

/**
 * Tech badges alternate pink/purple by position. Purely decorative — the tint
 * carries no meaning, it just stops a six-tag row reading as one grey block.
 */
function tagClasses(index: number): string {
  return index % 2 === 0
    ? "bg-brand-pink/10 text-brand-pink dark:bg-brand-pink/15"
    : "bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/15";
}

export default function ProjectCard({ project }: { readonly project: Project }) {
  return (
    /*
     * `group` drives the image zoom from a hover anywhere on the card.
     * flex + h-full makes every card in a row the same height, with the link
     * footer pinned to the bottom by `mt-auto`.
     */
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-purple/50">
      {/* Positioned + fixed ratio: required by <Image fill>, and it reserves
          the space so the grid doesn't shift while loading. */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-black/5 dark:border-white/10">
        <ProjectImage src={project.image} name={project.name} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {project.name}
          </h3>
          <span className="shrink-0 text-xs font-medium text-neutral-500 dark:text-neutral-500">
            {project.year}
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-brand-purple">
          {project.tagline}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>

        {/* Featured technical detail — the reason the project is here. */}
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-brand-pink/5 px-3 py-2 text-xs leading-relaxed text-neutral-700 dark:bg-brand-purple/10 dark:text-neutral-300">
          <FiZap
            aria-hidden
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-pink dark:text-brand-purple"
          />
          {project.keyHighlight}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech, index) => (
            <li
              key={tech}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagClasses(index)}`}
            >
              {tech}
            </li>
          ))}
        </ul>

        {/*
         * mt-auto pins this row to the card bottom regardless of how long the
         * description above it runs.
         *
         * `relative z-10` lifts these links above the full-card "view details"
         * button that ProjectsView lays over the card — without it, that
         * overlay would swallow every click on a repo or demo link.
         */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-5">
          {project.repos.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              // The label disambiguates "API" from "Client" for screen
              // readers, which read links out of context.
              aria-label={`${project.name} ${repo.label} on GitHub`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-400 dark:hover:text-brand-pink"
            >
              <FiGithub aria-hidden className="h-4 w-4" />
              {repo.label}
            </a>
          ))}

          {project.liveUrl !== null && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} live demo`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple dark:text-neutral-400 dark:hover:text-brand-purple"
            >
              <FiExternalLink aria-hidden className="h-4 w-4" />
              Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
