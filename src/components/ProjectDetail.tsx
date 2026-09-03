import { FiExternalLink, FiGithub } from "react-icons/fi";
import ProjectImage from "@/components/ProjectImage";
import type { Project } from "@/data/portfolio";

/**
 * Body of the project detail dialog.
 *
 * Server Component — <ProjectModal> is only the dialog shell, and receives
 * this already rendered. The full `highlights` list is shown here and nowhere
 * else; the card shows just `keyHighlight`.
 */
export default function ProjectDetail({
  project,
}: {
  readonly project: Project;
}) {
  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
        <ProjectImage src={project.image} name={project.name} />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        {/* id is referenced by the dialog's aria-labelledby. */}
        <h3
          id={`project-detail-${project.id}`}
          className="text-xl font-semibold text-neutral-900 dark:text-neutral-50"
        >
          {project.name}
        </h3>
        <span className="shrink-0 text-sm font-medium text-neutral-500 dark:text-neutral-500">
          {project.year}
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-brand-purple">
        {project.tagline}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>

      <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
        Highlights
      </h4>
      <ul className="mt-3 flex flex-col gap-2.5">
        {project.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
          >
            {/* mt-2 sits the dot on the first line's optical centre. */}
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple"
            />
            {highlight}
          </li>
        ))}
      </ul>

      <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
        Built with
      </h4>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-xs font-medium text-brand-purple dark:bg-brand-purple/15"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/5 pt-5 dark:border-white/10">
        {project.repos.map((repo) => (
          <a
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:border-brand-pink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:border-white/15 dark:text-neutral-300 dark:hover:border-brand-pink"
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
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple px-4 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <FiExternalLink aria-hidden className="h-4 w-4" />
            Live demo
          </a>
        )}
      </div>
    </div>
  );
}
