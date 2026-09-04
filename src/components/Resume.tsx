import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Single-card resume rendered entirely from src/data/portfolio.ts.
 *
 * Live: rendered from page.tsx between Experience and Contact, with a matching
 * `resume` entry in NAV_LINKS. That pairing is load-bearing — the header's
 * scroll-spy resolves ties by NAV_LINKS order, so if this section ever moves on
 * the page, the nav entry has to move with it.
 *
 * Server Component: no interactivity, so it ships no JavaScript. `print:`
 * utilities flatten the surfaces so a browser "Save as PDF" comes out clean.
 *
 * HOW TO UPDATE
 * - Every word here comes from portfolio.ts. There is no copy in this file
 *   beyond the section labels.
 */

/** Files live in /public. Both are served from the site root. */
const DOWNLOADS = [
  { label: "Download PDF", href: "/ata_musleh_resume.pdf" },
  { label: "Download DOCX", href: "/ata_musleh_resume.docx" },
] as const;

/** "2021 – 2025", or "2021 – Present" while still enrolled. */
function formatYears(startYear: number, endYear: number | null): string {
  return `${startYear} – ${endYear ?? "Present"}`;
}

/** Drops the scheme so a printed link reads "github.com/AtaMusleh". */
function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/** Bold section label with the hairline divider under it. */
function SectionHeading({ children }: { readonly children: string }) {
  return (
    <h3 className="mb-4 border-b border-black/10 pb-2 text-sm font-bold uppercase tracking-widest text-neutral-900 dark:border-white/15 dark:text-neutral-100">
      {children}
    </h3>
  );
}

/**
 * Shared timeline row for Experience and Education: a rail down the left with
 * a dot per entry, content indented clear of it.
 */
function TimelineItem({
  children,
  isLast = false,
}: {
  readonly children: React.ReactNode;
  readonly isLast?: boolean;
}) {
  return (
    <li className="relative pl-6">
      {/* Rail. Stops at the last entry so it doesn't trail into blank space. */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[3px] top-3 h-full w-px bg-black/10 dark:bg-white/15"
        />
      )}
      {/* Dot: 7px wide at left-0 centres it on the rail at left-[3px]. */}
      <span
        aria-hidden
        className="absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full bg-brand-purple"
      />
      {children}
    </li>
  );
}

export default function Resume() {
  const { personal, contact } = portfolio;
  // The current role doubles as the header's title line.
  const currentRole =
    portfolio.experience.length > 0 ? portfolio.experience[0].role : null;

  return (
    <section id="resume" className="px-6 py-24 sm:py-32 print:py-0">
      <div className="mx-auto max-w-[45rem]">
        {/* Download bar — outside the card, right-aligned, hidden in print. */}
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2 print:hidden">
          {DOWNLOADS.map((file) => (
            <a
              key={file.href}
              href={file.href}
              // The attribute value is the filename the browser saves as.
              download={file.href.replace(/^\//, "")}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-black/10 px-4 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:border-white/15 dark:text-neutral-300 dark:hover:border-brand-purple dark:hover:text-brand-purple"
            >
              <FiDownload aria-hidden className="h-3.5 w-3.5" />
              {file.label}
            </a>
          ))}
        </div>

        <article className="rounded-2xl border border-black/5 bg-white/60 p-8 backdrop-blur-sm sm:p-10 dark:border-white/10 dark:bg-white/5 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:backdrop-blur-none">
          {/* Header ---------------------------------------------------- */}
          <header className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between dark:border-white/15">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {personal.name}
              </h2>
              {currentRole !== null && (
                <p className="mt-1 text-base font-medium text-brand-purple">
                  {currentRole}
                </p>
              )}
            </div>

            <ul className="flex flex-col gap-1.5 text-xs text-neutral-600 sm:items-end sm:text-right dark:text-neutral-400">
              <li className="inline-flex items-center gap-1.5">
                <FiMapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {personal.location}
              </li>

              {/* Renders only once a phone number exists in portfolio.ts. */}
              {personal.phone !== undefined && (
                <li className="inline-flex items-center gap-1.5">
                  <FiPhone aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  <a
                    href={`tel:${personal.phone.replace(/\s/g, "")}`}
                    className="text-brand-purple hover:underline"
                  >
                    {personal.phone}
                  </a>
                </li>
              )}

              <li className="inline-flex items-center gap-1.5">
                <FiMail aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-brand-purple hover:underline"
                >
                  {contact.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FiGithub aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-purple hover:underline"
                >
                  {stripProtocol(contact.github)}
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FiLinkedin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-purple hover:underline"
                >
                  {stripProtocol(contact.linkedin)}
                </a>
              </li>
            </ul>
          </header>

          {/* Summary --------------------------------------------------- */}
          <section className="mt-8">
            <SectionHeading>Summary</SectionHeading>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {personal.bio}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {personal.availability}
            </p>
          </section>

          {/* Experience ------------------------------------------------ */}
          <section className="mt-8">
            <SectionHeading>Experience</SectionHeading>
            <ol className="flex flex-col gap-6">
              {portfolio.experience.map((job, index) => (
                <TimelineItem
                  key={job.id}
                  isLast={index === portfolio.experience.length - 1}
                >
                  <div className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline sm:justify-between">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                      {job.role}
                    </h4>
                    <span className="shrink-0 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-500">
                      {job.period}
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm font-medium text-brand-purple">
                    {job.company}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                    {job.location}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {job.description}
                  </p>

                  <ul className="mt-2 flex flex-col gap-1.5">
                    {job.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                      >
                        {/* mt-[0.45rem] sits the dot on the first line's centre. */}
                        <span
                          aria-hidden
                          className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
            </ol>
          </section>

          {/* Projects -------------------------------------------------- */}
          <section className="mt-8">
            <SectionHeading>Projects</SectionHeading>
            <ul className="grid items-stretch gap-4 sm:grid-cols-2">
              {portfolio.projects.map((project) => (
                <li key={project.id}>
                  <div className="flex h-full flex-col rounded-xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                          {project.name}
                        </h4>
                        {/* The tagline is the project's category line. */}
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                          {project.tagline}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        {project.repos.map((repo) => (
                          <a
                            key={repo.url}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} ${repo.label} on GitHub`}
                            className="text-xs font-medium text-brand-purple hover:underline"
                          >
                            {repo.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-purple dark:bg-brand-purple/15"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {project.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Education ------------------------------------------------- */}
          <section className="mt-8">
            <SectionHeading>Education</SectionHeading>
            <ol className="flex flex-col gap-6">
              {portfolio.education.map((entry, index) => (
                <TimelineItem
                  key={`${entry.institution}-${entry.startYear}`}
                  isLast={index === portfolio.education.length - 1}
                >
                  <div className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline sm:justify-between">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                      {entry.degree}
                    </h4>
                    <span className="shrink-0 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-500">
                      {formatYears(entry.startYear, entry.endYear)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm font-medium text-brand-purple">
                    {entry.institution}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                    {entry.location}
                  </p>

                  {/* Renders only once coursework is set in portfolio.ts. */}
                  {entry.coursework !== undefined && (
                    <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">
                      Relevant coursework: {entry.coursework}
                    </p>
                  )}
                </TimelineItem>
              ))}
            </ol>
          </section>

          {/* Technical skills ------------------------------------------ */}
          <section className="mt-8">
            <SectionHeading>Technical Skills</SectionHeading>
            <dl className="flex flex-col gap-2">
              {portfolio.skills.map((group) => (
                <div
                  key={group.name}
                  className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline"
                >
                  <dt className="w-44 shrink-0 text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    {group.name}
                  </dt>
                  <dd className="text-sm text-neutral-600 dark:text-neutral-400">
                    {group.skills.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Languages ------------------------------------------------- */}
          <section className="mt-8">
            <SectionHeading>Languages</SectionHeading>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {portfolio.languages
                .map((language) => `${language.name} (${language.level})`)
                .join(" · ")}
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
