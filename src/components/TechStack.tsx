/**
 * Auto-scrolling tech logo marquee.
 *
 * Server Component with zero client JS: the scroll, the hover pause and the
 * reduced-motion fallback are all CSS (see `.marquee*` in app/globals.css).
 *
 * HOW TO UPDATE
 * - Edit TECH below. Every entry must be a real skill from portfolio.ts.
 * - `slug` is a devicon icon name; the CDN path is built from it. Leave it
 *   `null` when devicon has no icon and the name renders as a text badge.
 */

type TechItem = {
  readonly name: string;
  /**
   * devicon slug, or null for a text badge. Verified against the CDN — devicon
   * has no icon for GSAP, Recharts, JWT, Zod or Appian.
   */
  readonly slug: string | null;
  /**
   * Logos that are solid black artwork. They vanish against a dark background,
   * so they get inverted to white there.
   */
  readonly monochrome?: boolean;
};

const TECH: readonly TechItem[] = [
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs", monochrome: true },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express", slug: "express", monochrome: true },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma", monochrome: true },
  { name: "Zod", slug: null },
  { name: "JWT", slug: null },
  { name: "Mapbox", slug: "mapbox" },
  { name: "GSAP", slug: null },
  { name: "Recharts", slug: null },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Git", slug: "git" },
  { name: "Vercel", slug: "vercel", monochrome: true },
  { name: "Appian", slug: null },
];

function iconUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
}

/**
 * One full pass of the logos. The track holds two of these; the animation
 * shifts it by exactly 50%, so the second pass lands where the first began and
 * the loop has no visible seam.
 */
function TechRow({ duplicate = false }: { readonly duplicate?: boolean }) {
  return (
    <ul
      // The copy exists only to fill the gap during the loop. Hiding it stops
      // screen readers reading all seventeen technologies twice.
      aria-hidden={duplicate}
      className="flex shrink-0 items-center"
    >
      {TECH.map((tech) => (
        <li
          key={tech.name}
          className="tech-item relative flex h-20 w-36 shrink-0 items-center justify-center px-4"
          data-label={tech.name}
        >
          {tech.slug === null ? (
            <span className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold whitespace-nowrap text-neutral-500 opacity-80 transition duration-300 hover:scale-110 hover:border-brand-purple/40 hover:text-brand-purple hover:opacity-100 dark:border-white/15 dark:text-neutral-400">
              {tech.name}
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- a remote
               CDN SVG. next/image would need `dangerouslyAllowSVG` plus a
               remotePatterns entry to optimise files that are already ~1KB. */
            <img
              src={iconUrl(tech.slug)}
              alt={duplicate ? "" : tech.name}
              width={48}
              height={48}
              /*
               * Eager, deliberately. These sit far outside the viewport in an
               * overflow-hidden track, so lazy loading never fires for them and
               * the loop scrolls empty slots into view — the "gap" at the seam.
               * They are ~1KB SVGs; low priority keeps them behind real images.
               */
              decoding="async"
              fetchPriority="low"
              className={`h-14 w-14 object-contain grayscale opacity-80 transition duration-300 hover:scale-110 hover:grayscale-0 hover:opacity-100 ${
                tech.monochrome === true ? "dark:invert" : ""
              }`}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function TechStack() {
  return (
    <section id="tech-stack" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-[2.5rem] font-extrabold tracking-tight text-neutral-900 sm:text-[3.25rem] dark:text-neutral-50">
          My Tech Stack
          <span
            aria-hidden
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        {/* `marquee` is the hover target that pauses the track inside it. */}
        <div className="marquee marquee-mask mt-12 overflow-hidden py-8">
          <div className="marquee-track flex w-max">
            <TechRow />
            <TechRow duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
