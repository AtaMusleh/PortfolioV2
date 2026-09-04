import { FaBriefcase } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Experience section: a timeline rail with one card per role.
 *
 * Deliberately mirrors Education.tsx's rail geometry so the two sections read
 * as one timeline down the page. If you change the rail here, change it there.
 *
 * No "use client" — hover is CSS only, so this ships zero JS.
 *
 * HOW TO UPDATE
 * - Entries: src/data/portfolio.ts (`experience`), newest first. The list is
 *   mapped, so additional roles need no changes in this file.
 */

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-[2.5rem] font-extrabold tracking-tight text-neutral-900 sm:text-[3.25rem] dark:text-neutral-50">
          Experience
          <span
            aria-hidden
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        <ol className="relative mt-12">
          {/* Rail — same geometry as Education: line at left-2, markers centred on it. */}
          <span
            aria-hidden
            className="absolute left-2 top-3 bottom-3 w-px bg-gradient-to-b from-brand-pink via-brand-purple to-transparent"
          />

          {portfolio.experience.map((job) => (
            <li key={job.id} className="relative pl-10 pb-8 last:pb-0">
              <span
                aria-hidden
                className="absolute left-0 top-6 h-4 w-4 rounded-full border-2 border-brand-pink bg-white dark:border-brand-purple dark:bg-neutral-950"
              />

              <article className="rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-sm transition-all sm:p-10 duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-purple/50">
                {/* Header: stacks on mobile, period moves top-right on sm+. */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-pink/15 to-brand-purple/15 text-brand-purple"
                    >
                      <FaBriefcase className="h-7 w-7" />
                    </span>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-neutral-50">
                        {job.role}
                      </h3>
                      <p className="mt-1 text-base font-medium text-brand-purple sm:text-lg">
                        {job.company}
                      </p>
                      <p className="mt-2.5 inline-flex items-center gap-2 text-base text-neutral-600 dark:text-neutral-400">
                        <FiMapPin aria-hidden className="h-4 w-4 shrink-0" />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 self-start rounded-full border border-black/5 bg-white/70 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
                    {job.period}
                  </span>
                </div>

                <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                  {job.description}
                </p>

                <ul className="mt-5 flex flex-col gap-4">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3.5 text-base leading-loose text-neutral-700 dark:text-neutral-300"
                    >
                      {/* mt-2 sits the dot on the first line's optical centre. */}
                      <span
                        aria-hidden
                        className="mt-3.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
