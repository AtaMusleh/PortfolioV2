/**
 * Single source of truth for every piece of content on the portfolio.
 *
 * HOW TO UPDATE
 * -------------
 * Edit the `portfolio` object at the bottom of this file. Nothing else in the
 * app hardcodes copy, so a change here shows up everywhere it is rendered.
 *
 * - New project?      Add an object to `projects`. Give it a unique `id`.
 * - New job?          Add an object to `experience` (newest first).
 * - Changed a link?   Update it in `personal` AND `contact` if it appears in both.
 * - Reordering?       Array order is display order. Nothing sorts these for you.
 *
 * Everything is `readonly` on purpose: this is content, not state. If TypeScript
 * complains about mutating it, that's the point.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

/** ISO 8601 calendar date, e.g. "2004-03-04". */
export type IsoDate = `${number}-${number}-${number}`;

/** Absolute URL. Kept as an alias so intent is readable at call sites. */
export type Url = string;

export interface PersonalInfo {
  readonly name: string;
  readonly email: string;
  readonly github: Url;
  readonly linkedin: Url;
  /** Free-form, "City, Country". */
  readonly location: string;
  readonly birthDate: IsoDate;
  /** One line on where and how you're willing to work. */
  readonly availability: string;
  /** Hero line. Keep it to a single sentence. */
  readonly tagline: string;
  /** About-section bio. Two or three sentences, first person. */
  readonly bio: string;
}

export interface Education {
  readonly degree: string;
  readonly institution: string;
  /** Campus location, "City, Country". */
  readonly location: string;
  /** Four-digit year the programme started. */
  readonly startYear: number;
  /** Four-digit year it ended. Use `null` while still enrolled — the UI
   *  renders that as "Present". */
  readonly endYear: number | null;
}

export interface Experience {
  /** Stable slug, used for React keys. */
  readonly id: string;
  readonly role: string;
  readonly company: string;
  /** Human-readable range, e.g. "October 2025 — Present". */
  readonly period: string;
  readonly location: string;
  /** A sentence of context: what you build there, and who for. */
  readonly description: string;
  /** Concrete responsibilities. Start each with a verb, no trailing periods. */
  readonly bullets: readonly string[];
}

/**
 * A project can live in more than one repository (a split API and client, for
 * example), so repos are a list rather than a single field.
 */
export interface ProjectRepo {
  /** Shown as the link text, e.g. "Repo", "API", "Client". */
  readonly label: string;
  readonly url: Url;
}

export interface Project {
  /** Stable slug. Used for React keys and any per-project routing. */
  readonly id: string;
  readonly name: string;
  /** One line: what it is, and the thing that makes it interesting. */
  readonly tagline: string;
  readonly year: number;
  /** Display order is the order you write them in. */
  readonly stack: readonly string[];
  readonly repos: readonly ProjectRepo[];
  /** Deployed URL, or `null` if there is nothing to show yet. */
  readonly liveUrl: Url | null;
  /** The technically interesting decisions. These are the selling points. */
  readonly highlights: readonly string[];
}

export interface Contact {
  readonly email: string;
  readonly github: Url;
  readonly linkedin: Url;
}

export interface Portfolio {
  readonly personal: PersonalInfo;
  readonly education: readonly Education[];
  /** Newest first. */
  readonly experience: readonly Experience[];
  /** Short labels only — these render as chips, not sentences. */
  readonly interests: readonly string[];
  readonly projects: readonly Project[];
  readonly contact: Contact;
}

/* ------------------------------------------------------------------ */
/* Data — edit below this line                                        */
/* ------------------------------------------------------------------ */

export const portfolio: Portfolio = {
  personal: {
    name: "Ata Musleh",
    email: "atamusleh3@gmail.com",
    github: "https://github.com/AtaMusleh",
    linkedin: "https://linkedin.com/in/ata-musleh-53600b265",
    location: "Ramallah, Palestine",
    birthDate: "2004-03-04",
    availability:
      "Open to remote roles internationally, and relocation with visa sponsorship.",
    tagline:
      "I build things end to end, and care most about the parts that are easy to get subtly wrong.",
    bio: "I studied computer science at Birzeit University and now build banking software at Experts Turnkey Solutions in Ramallah, working on Appian applications for clients like Jordan Kuwait Bank. The part of the job I actually enjoy is the unglamorous half — validation rules, edge cases, and the things that fail quietly rather than loudly. Away from the keyboard I lift and I game.",
  },

  education: [
    {
      degree: "BSc Computer Science",
      institution: "Birzeit University",
      location: "Birzeit, Palestine",
      startYear: 2021,
      endYear: 2025,
    },
  ],

  experience: [
    {
      id: "experts-turnkey-solutions",
      role: "Software Developer",
      company: "Experts Turnkey Solutions",
      period: "October 2025 — Present",
      location: "Ramallah, Palestine",
      description:
        "Building banking applications on the Appian platform for clients like Jordan Kuwait Bank",
      bullets: [
        "Design SAIL interfaces used by branch and back-office staff",
        "Write expression rules encoding banking logic and validation",
        "Model record types and process models against core banking data",
        "Ship production software where correctness is critical",
      ],
    },
  ],

  interests: ["Lifting", "Gaming"],

  projects: [
    {
      id: "roam",
      name: "Roam",
      tagline: "Geotagged photos, clustered into an interactive journey map",
      year: 2025,
      stack: [
        "Next.js 16",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Mapbox",
        "GSAP",
      ],
      repos: [{ label: "Repo", url: "https://github.com/AtaMusleh/roam" }],
      liveUrl: "https://roam-khaki.vercel.app/trips",
      highlights: [
        "DBSCAN clustering using haversine distance (in metres, not degrees)",
        "Temporal splitting to handle multiple visits to same location",
        "Interpolated coordinates for photos with missing GPS",
        "OSM place naming ranked by containment",
        "Scroll-driven route animation",
      ],
    },
    {
      id: "taskflow",
      name: "TaskFlow",
      tagline: "Kanban task manager with separate API and client deployment",
      year: 2025,
      stack: ["Express", "React", "TypeScript", "PostgreSQL", "Zod", "JWT"],
      repos: [
        { label: "API", url: "https://github.com/AtaMusleh/taskflow-api" },
        { label: "Client", url: "https://github.com/AtaMusleh/taskflow-client" },
      ],
      liveUrl: "https://taskflow-client-eta.vercel.app",
      highlights: [
        "Fractional indexing for card ordering",
        "OpenAPI docs generated from Zod validators",
        "Optimistic drag-and-drop with rollback",
        "Single-flight token refresh to prevent race conditions",
      ],
    },
    {
      id: "linksnip",
      name: "LinkSnip",
      tagline: "URL shortener with click analytics that counts every click",
      year: 2025,
      stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma"],
      repos: [{ label: "Repo", url: "https://github.com/AtaMusleh/linksnip" }],
      liveUrl: "https://linksnip-vert.vercel.app",
      highlights: [
        "Click tracking using Next's after() to survive serverless response",
        "302 redirects instead of 301 to avoid browser caching",
        "Collision-safe slug generation with database uniqueness constraint",
      ],
    },
    {
      id: "fx-convert",
      name: "FX Convert",
      tagline: "Currency converter with historical ECB rate charts",
      year: 2025,
      stack: ["Next.js 16", "TypeScript", "Tailwind", "Recharts"],
      repos: [{ label: "Repo", url: "https://github.com/AtaMusleh/fx-convert" }],
      liveUrl: "https://fx-convert-black.vercel.app",
      highlights: [
        "Caching on currency pair, not amount",
        "Server-side cached rate routes matched to ECB publish cadence",
        "WCAG AA contrast audit compliance",
      ],
    },
  ],

  contact: {
    email: "atamusleh3@gmail.com",
    github: "https://github.com/AtaMusleh",
    linkedin: "https://linkedin.com/in/ata-musleh-53600b265",
  },
};

/* ------------------------------------------------------------------ */
/* Derived values                                                     */
/* ------------------------------------------------------------------ */

/**
 * Age in whole years, derived from `personal.birthDate`.
 *
 * Never write the number down anywhere — it goes stale every 4th of March.
 * Prefer calling this from a Server Component; in a client component the
 * value is computed against the visitor's clock, which can disagree with the
 * server-rendered HTML across a timezone boundary on a birthday.
 */
export function getAge(today: Date = new Date()): number {
  // Split rather than `new Date(string)`: that parses as UTC midnight and then
  // reads back in local time, landing on the previous day west of Greenwich.
  const [year, month, day] = portfolio.personal.birthDate.split("-").map(Number);

  let age = today.getFullYear() - year;
  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasHadBirthday) age -= 1;

  return age;
}

export default portfolio;
