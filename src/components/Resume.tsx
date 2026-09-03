// Hidden until resume content is finalized — not mounted, not in nav.

import { FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Single-page resume rendered from src/data/portfolio.ts.
 *
 * Nothing imports this yet — it is intentionally not in page.tsx and not in
 * the header's NAV_LINKS. TypeScript and ESLint still check it, since
 * tsconfig includes every .tsx under src.
 *
 * TO ENABLE
 * 1. Import and render <Resume /> in src/app/page.tsx.
 * 2. Add `{ id: "resume", label: "Resume" }` to NAV_LINKS in Header.tsx, at
 *    the position matching where the section sits on the page — the scroll-spy
 *    resolves ties by NAV_LINKS order, so the two must agree.
 *
 * Server Component: no interactivity, so it ships no JavaScript. `print:`
 * utilities flatten the surfaces so a browser "Save as PDF" comes out clean.
 *
 * HOW TO UPDATE
 * - Every word here comes from portfolio.ts. There is no copy in this file.
 */

/** Drops the scheme so a printed link reads "github.com/AtaMusleh". */
function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/** Shared heading for each resume block. */
function SectionHeading({ children }: { readonly children: string }) {
  return (
    <h3 className="mb-3 border-b border-black/10 pb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-purple dark:border-white/15">
      {children}
    </h3>
  );
}

export default function Resume() {
  return (
    <section id="resume" className="px-6 py-24 sm:py-32 print:py-0">
      <article className="mx-auto max-w-3xl rounded-2xl border border-black/5 bg-white/60 p-8 backdrop-blur-sm sm:p-10 dark:border-white/10 dark:bg-white/5 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:backdrop-blur-none">
        {/* Identity ---------------------------------------------------- */}
        <header className="border-b border-black/10 pb-6 dark:border-white/15">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {portfolio.personal.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-brand-purple">
            {portfolio.personal.tagline}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <a
                href={`mailto:${portfolio.contact.email}`}
                className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-brand-pink"
              >
                <FiMail aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {portfolio.contact.email}
              </a>
            </li>
            <li>
              <a
                href={portfolio.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-brand-pink"
              >
                <FiGithub aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {stripProtocol(portfolio.contact.github)}
              </a>
            </li>
            <li>
              <a
                href={portfolio.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-brand-pink"
              >
                <FiLinkedin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {stripProtocol(portfolio.contact.linkedin)}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <FiMapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
              {portfolio.personal.location}
            </li>
          </ul>
        </header>

        {/* Summary ----------------------------------------------------- */}
        <section className="mt-8">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {portfolio.personal.bio}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {portfolio.personal.availability}
          </p>
        </section>

        {/* Experience -------------------------------------------------- */}
        <section className="mt-8">
          <SectionHeading>Experience</SectionHeading>

          {portfolio.experience.map((job) => (
            <div key={job.id} className="mb-5 last:mb-0">
              <div className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline sm:justify-between">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {job.role} · {job.company}
                </h4>
                <span className="shrink-0 text-xs text-neutral-500 whitespace-nowrap dark:text-neutral-500">
                  {job.period} · {job.location}
                </span>
              </div>

              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {job.description}
              </p>

              <ul className="mt-2 flex flex-col gap-1.5">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                  >
                    {/* mt-2 sits the dot on the first line's optical centre. */}
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-purple"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects ---------------------------------------------------- */}
        <section className="mt-8">
          <SectionHeading>Projects</SectionHeading>

          {portfolio.projects.map((project) => (
            <div key={project.id} className="mb-5 last:mb-0">
              <div className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline sm:justify-between">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {project.name}
                  <span className="font-normal text-neutral-600 dark:text-neutral-400">
                    {" "}
                    — {project.tagline}
                  </span>
                </h4>
                <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-500">
                  {project.year}
                </span>
              </div>

              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>

              <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                <span className="font-medium">Key detail:</span>{" "}
                {project.keyHighlight}
              </p>

              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-500">
                {project.stack.join(" · ")}
              </p>

              {/* Printed as readable URLs, since a paper copy can't be clicked. */}
              <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {project.repos.map((repo) => (
                  <li key={repo.url}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple transition-colors duration-200 hover:text-brand-pink"
                    >
                      {repo.label}: {stripProtocol(repo.url)}
                    </a>
                  </li>
                ))}

                {project.liveUrl !== null && (
                  <li>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple transition-colors duration-200 hover:text-brand-pink"
                    >
                      Live: {stripProtocol(project.liveUrl)}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </section>

        {/* Education --------------------------------------------------- */}
        <section className="mt-8">
          <SectionHeading>Education</SectionHeading>

          {portfolio.education.map((entry) => (
            <div
              key={`${entry.institution}-${entry.startYear}`}
              className="mb-3 flex flex-col gap-x-3 last:mb-0 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                {entry.degree}
                <span className="font-normal text-neutral-600 dark:text-neutral-400">
                  {" "}
                  · {entry.institution}
                </span>
              </h4>
              <span className="shrink-0 text-xs text-neutral-500 whitespace-nowrap dark:text-neutral-500">
                {entry.startYear} – {entry.endYear ?? "Present"} ·{" "}
                {entry.location}
              </span>
            </div>
          ))}
        </section>

        {/* Skills ------------------------------------------------------ */}
        <section className="mt-8">
          <SectionHeading>Skills</SectionHeading>

          <dl className="flex flex-col gap-2">
            {portfolio.skills.map((group) => (
              <div
                key={group.name}
                className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline"
              >
                <dt className="w-44 shrink-0 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {group.name}
                </dt>
                <dd className="text-sm text-neutral-600 dark:text-neutral-400">
                  {group.skills.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </section>
  );
}
