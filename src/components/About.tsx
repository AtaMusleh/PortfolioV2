import type { IconType } from "react-icons";
import { FaDumbbell, FaGamepad } from "react-icons/fa6";
import { FiCheckCircle, FiStar } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * About section: bio, interest badges, availability.
 *
 * No "use client" — the hover effects are pure CSS, so this ships as a Server
 * Component and adds nothing to the JS bundle.
 *
 * HOW TO UPDATE
 * - Bio / availability: src/data/portfolio.ts (`personal`).
 * - Interests:          src/data/portfolio.ts (`interests`) — then add a
 *                       matching icon to INTEREST_ICONS below.
 */

/**
 * Interest label -> icon. Keys must match the strings in `portfolio.interests`
 * exactly. An interest with no entry here still renders, with a generic icon,
 * so adding one to the data file can never break the build.
 */
const INTEREST_ICONS: Record<string, IconType> = {
  Lifting: FaDumbbell,
  Gaming: FaGamepad,
};

export default function About() {
  return (
    <section id="about" className="px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-[2.5rem] font-extrabold tracking-tight text-neutral-900 sm:text-[3.25rem] dark:text-neutral-50">
          About Me
          {/* Short gradient rule, echoing the hero's palette. */}
          <span
            aria-hidden
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        {/* Bio card */}
        <div className="mt-12 w-full rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-sm transition-colors duration-300 sm:p-8 dark:border-white/10 dark:bg-white/5">
          <p className="text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
            {portfolio.personal.bio}
          </p>
        </div>

        {/* Interests */}
        <h3 className="mt-12 text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
          Outside work
        </h3>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {portfolio.interests.map((interest) => {
            const Icon = INTEREST_ICONS[interest] ?? FiStar;
            return (
              <li key={interest}>
                {/*
                 * `group` drives the icon's color change from the badge hover,
                 * so the whole badge is one hover target rather than two.
                 */}
                <span className="group inline-flex cursor-default items-center gap-2.5 rounded-full border border-black/5 bg-white/70 px-5 py-3 text-sm font-medium text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-brand-pink/40 hover:bg-brand-pink/10 hover:text-brand-pink hover:shadow-lg hover:shadow-brand-pink/10 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-brand-purple/40 dark:hover:bg-brand-purple/10 dark:hover:text-brand-purple">
                  <Icon
                    aria-hidden
                    className="h-4 w-4 text-brand-purple transition-colors duration-300 group-hover:text-brand-pink dark:group-hover:text-brand-purple"
                  />
                  {interest}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Availability */}
        <p className="mt-12 inline-flex items-center gap-2.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-5 py-3 text-sm text-neutral-700 dark:border-brand-purple/30 dark:bg-brand-purple/10 dark:text-neutral-300">
          <FiCheckCircle
            aria-hidden
            className="h-4 w-4 shrink-0 text-brand-purple"
          />
          {portfolio.personal.availability}
        </p>
      </div>
    </section>
  );
}
