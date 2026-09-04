import SkillCloud from "@/components/SkillCloud";
import { portfolio } from "@/data/portfolio";

/**
 * Skills section: draggable word cloud over a grid of category cards.
 *
 * Server Component apart from <SkillCloud>, which needs WebGL and pointer
 * events. The cards are the authoritative, readable copy of the same list.
 *
 * HOW TO UPDATE
 * - Groups and skills: src/data/portfolio.ts (`skills`). One card per group,
 *   and the cloud picks up every skill automatically — no edits needed here.
 */

export default function Skills() {
  // Flattened once on the server and passed down, so the cloud never has to
  // know about the group structure.
  const allSkills = portfolio.skills.flatMap((group) => group.skills);

  return (
    <section id="skills" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[2.5rem] font-extrabold tracking-tight text-neutral-900 sm:text-[3.25rem] dark:text-neutral-50">
          Skills
          <span
            aria-hidden
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        <div className="mt-12">
          <SkillCloud labels={allSkills} />
        </div>

        <ul className="mt-12 grid items-stretch gap-6 sm:grid-cols-2">
          {portfolio.skills.map((group) => (
            <li key={group.name}>
              <article className="flex h-full flex-col rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-sm sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-purple/50">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
                  {group.name}
                </h3>

                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-brand-pink/10 px-3.5 py-1.5 text-sm font-medium text-brand-pink transition-colors duration-200 dark:bg-brand-purple/15 dark:text-brand-purple"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
