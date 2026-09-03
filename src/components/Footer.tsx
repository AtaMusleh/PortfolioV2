import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Site footer. Rendered from the root layout, so it appears on every route.
 *
 * No "use client" — hover is CSS only, so this ships zero JS.
 *
 * HOW TO UPDATE
 * - Links:    QUICK_LINKS below. Header.tsx keeps its own list; see the note there.
 * - Socials:  src/data/portfolio.ts (`contact`).
 */

/**
 * Deliberately a subset of the header's nav — no Education entry, to keep the
 * footer row short. Add `{ id: "education", label: "Education" }` if you'd
 * rather the two match exactly.
 */
const QUICK_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

const SOCIALS = [
  { label: "GitHub", href: portfolio.contact.github, icon: FiGithub },
  { label: "LinkedIn", href: portfolio.contact.linkedin, icon: FiLinkedin },
] as const;

/** Short form of `personal.tagline`, trimmed to fit one footer line. */
const SHORT_TAGLINE = "I build things end to end";

export default function Footer() {
  /*
   * Evaluated when the page is rendered. This route is statically prerendered,
   * so the year is baked in at build time — correct on every deploy, and worth
   * knowing if a build sits untouched across New Year.
   */
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-black/[0.02] px-6 py-10 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-5xl">
        {/* Row 1: identity left, quick links right. Stacks and centres on mobile. */}
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {portfolio.personal.name}
              <span className="text-brand-purple">.</span>
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {SHORT_TAGLINE}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`#${link.id}`}
                    className="text-sm text-neutral-600 transition-colors duration-200 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-400 dark:hover:text-brand-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Row 2: copyright left, socials bottom right. */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-black/5 pt-6 text-center sm:flex-row sm:justify-between sm:text-left dark:border-white/10">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {year} {portfolio.personal.name}. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${portfolio.personal.name} on ${social.label}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-neutral-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-400 dark:hover:bg-brand-purple/15 dark:hover:text-brand-purple"
                >
                  <social.icon aria-hidden className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
