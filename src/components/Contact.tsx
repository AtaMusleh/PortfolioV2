import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Contact section: CTA, three contact methods, location.
 *
 * No "use client" — hover is CSS only, so this ships zero JS.
 *
 * HOW TO UPDATE
 * - Addresses: src/data/portfolio.ts (`contact`) and `personal.location`.
 * - Adding a method: add an entry to METHODS below.
 */

type ContactMethod = {
  readonly label: string;
  readonly href: string;
  /** What the visitor reads — the address itself, not a restatement. */
  readonly display: string;
  readonly icon: IconType;
  /** mailto: opens a mail client; the rest are external sites. */
  readonly external: boolean;
};

/** Drops the scheme so cards read "github.com/AtaMusleh", not the full URL. */
function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

const METHODS: readonly ContactMethod[] = [
  {
    label: "Email",
    href: `mailto:${portfolio.contact.email}`,
    display: portfolio.contact.email,
    icon: FiMail,
    external: false,
  },
  {
    label: "GitHub",
    href: portfolio.contact.github,
    display: stripProtocol(portfolio.contact.github),
    icon: FiGithub,
    external: true,
  },
  {
    label: "LinkedIn",
    href: portfolio.contact.linkedin,
    display: stripProtocol(portfolio.contact.linkedin),
    icon: FiLinkedin,
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
          Get in touch
          <span
            aria-hidden
            className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
          />
        </h2>

        <p className="mt-8 bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
          Let&apos;s work together
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {METHODS.map((method) => (
            <li key={method.label}>
              <a
                href={method.href}
                // rel is only meaningful on the target-blank links; mailto
                // opens in place and must not get target="_blank".
                {...(method.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/60 px-4 py-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-xl hover:shadow-brand-purple/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-purple/50"
              >
                <span
                  aria-hidden
                  className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-pink/15 to-brand-purple/15 text-brand-purple transition-transform duration-300 group-hover:scale-110"
                >
                  <method.icon className="h-5 w-5" />
                </span>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {method.label}
                  <FiArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 text-neutral-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-pink"
                  />
                </span>

                {/* break-all: the LinkedIn slug is long and would otherwise
                    push the card wider than its grid column. */}
                <span className="text-xs break-all text-neutral-600 dark:text-neutral-400">
                  {method.display}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <FiMapPin aria-hidden className="h-4 w-4 shrink-0 text-brand-purple" />
          Based in {portfolio.personal.location}
        </p>
      </div>
    </section>
  );
}
