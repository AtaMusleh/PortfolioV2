import { FaGraduationCap } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Education section: a timeline rail with one card per degree.
 *
 * No "use client" — hover is CSS only, so this ships zero JS.
 *
 * HOW TO UPDATE
 * - Entries: src/data/portfolio.ts (`education`). The list is mapped, so a
 *   second degree needs no changes here — the rail grows with it.
 */

/** "2021 – 2025", or "2021 – Present" while still enrolled. */
function formatYears(startYear: number, endYear: number | null): string {
  return `${startYear} – ${endYear ?? "Present"}`;
}

export default function Education() {
  return (
    <section id="education" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-[2.75rem] font-extrabold tracking-tight text-neutral-900 sm:text-[3.5rem] dark:text-neutral-50">
          Education
          <span
            aria-hidden
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        <ol className="relative mt-12">
          {/*
           * The rail. Absolutely positioned rather than a `border-l` on the
           * <ol> so it can fade out at the bottom, and so the markers sit on
           * it without fighting the list's own padding.
           */}
          <span
            aria-hidden
            className="absolute left-2 top-3 bottom-3 w-px bg-gradient-to-b from-brand-pink via-brand-purple to-transparent"
          />

          {portfolio.education.map((entry) => (
            <li
              key={`${entry.institution}-${entry.startYear}`}
              className="relative pl-10 pb-8 last:pb-0"
            >
              {/* Marker: h-4 w-4 at left-0 puts its centre on the rail at left-2. */}
              <span
                aria-hidden
                className="absolute left-0 top-6 h-4 w-4 rounded-full border-2 border-brand-pink bg-white dark:border-brand-purple dark:bg-neutral-950"
              />

              <article className="rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-sm transition-all sm:p-9 duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-purple/50">
                {/* Stacks on mobile, year badge moves to the top right on sm+. */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-pink/15 to-brand-purple/15 text-brand-purple"
                    >
                      <FaGraduationCap className="h-7 w-7" />
                    </span>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-neutral-50">
                        {entry.degree}
                      </h3>
                      <p className="mt-1 text-base font-medium text-brand-purple sm:text-lg">
                        {entry.institution}
                      </p>
                      <p className="mt-2.5 inline-flex items-center gap-2 text-base text-neutral-600 dark:text-neutral-400">
                        <FiMapPin aria-hidden className="h-4 w-4 shrink-0" />
                        {entry.location}
                      </p>
                    </div>
                  </div>

                  {/* `whitespace-nowrap` keeps the range from wrapping mid-dash. */}
                  <span className="shrink-0 self-start rounded-full border border-black/5 bg-white/70 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
                    {formatYears(entry.startYear, entry.endYear)}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
