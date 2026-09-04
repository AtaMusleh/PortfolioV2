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
  /**
   * Optional. Nothing renders until it is set — a phone number is not
   * something to invent, so the resume simply omits the line while it is
   * absent.
   */
  readonly phone?: string;
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
  /**
   * Optional. Relevant modules as one comma-separated line, e.g.
   * "Data Structures, Databases, Operating Systems". The resume renders a
   * coursework line only when this is set.
   */
  readonly coursework?: string;
}

export interface Language {
  readonly name: string;
  /** Proficiency as it would read on a CV: "Native", "B2", "Fluent". */
  readonly level: string;
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
  /** One or two sentences on what the thing actually does, for the card body. */
  readonly description: string;
  /**
   * The single highlight featured on the project card. Kept separate from
   * `highlights` so the card's pick doesn't depend on that array's ordering.
   */
  readonly keyHighlight: string;
  readonly year: number;
  /** Display order is the order you write them in. */
  readonly stack: readonly string[];
  readonly repos: readonly ProjectRepo[];
  /** Deployed URL, or `null` if there is nothing to show yet. */
  readonly liveUrl: Url | null;
  /**
   * Screenshot under /public, e.g. "/projects/roam.png". Use `null` until the
   * file exists — the card falls back to a gradient tile rather than a broken
   * image. Landscape works best; cards crop to 16:10.
   */
  readonly image: string | null;
  /** The technically interesting decisions. These are the selling points. */
  readonly highlights: readonly string[];
}

export interface SkillGroup {
  /** Card heading, e.g. "Database & ORM". */
  readonly name: string;
  /** Display order is the order you write them in. */
  readonly skills: readonly string[];
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
  /** One card per group; the word cloud uses every skill across all groups. */
  readonly skills: readonly SkillGroup[];
  readonly projects: readonly Project[];
  /** Spoken languages, for the resume. */
  readonly languages: readonly Language[];
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
    phone: "+970 597 332 555",
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
      // Jordan Kuwait Bank is a client of Experts Turnkey Solutions, not an
      // employer. Keep that relationship explicit in any rewording.
      description:
        "Building banking applications on the Appian platform for clients including Jordan Kuwait Bank.",
      bullets: [
        "Design SAIL interfaces used daily by branch and back-office staff",
        "Write expression rules encoding banking logic, validation, and data transformation",
        "Model record types and process models against core banking data",
        "Ship production software where correctness and auditability are requirements",
      ],
    },
  ],

  interests: ["Lifting", "Gaming"],

  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "B2" },
  ],

  skills: [
    { name: "Languages", skills: ["TypeScript", "JavaScript", "SQL"] },
    {
      name: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "GSAP", "Recharts"],
    },
    { name: "Backend", skills: ["Node.js", "Express"] },
    { name: "Database & ORM", skills: ["PostgreSQL", "Prisma"] },
    { name: "Auth & Validation", skills: ["JWT", "Zod"] },
    { name: "APIs & Maps", skills: ["Mapbox", "OpenStreetMap"] },
    { name: "Enterprise", skills: ["Appian", "SAIL"] },
    { name: "Tooling & Deploy", skills: ["Git", "Vercel"] },
  ],

  projects: [
    {
      id: "roam",
      name: "Roam",
      tagline: "Geotagged photos, clustered into an interactive journey map",
      description:
        "Reads the EXIF GPS out of a batch of photos and groups them into the places you actually stopped, then draws the route between those stops on a map.",
      keyHighlight: "DBSCAN clustering with haversine distance",
      image: "/projects/roam.png",
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
      tagline: "Kanban task manager with separate API and client",
      description:
        "A drag-and-drop Kanban board, shipped as an Express API and a React client that deploy independently and authenticate over JWT.",
      keyHighlight: "Fractional indexing for card ordering",
      image: "/projects/taskflow.png",
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
      tagline: "URL shortener with click analytics",
      description:
        "Turns long URLs into short slugs and records every visit — including the ones that would normally be lost when a serverless function returns its redirect and shuts down.",
      keyHighlight: "Accurate click tracking in a serverless environment",
      image: "/projects/linksnip.png",
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
      tagline: "Currency converter with ECB rate charts",
      description:
        "Converts between currencies and charts how the pair has moved over time, using the European Central Bank's published daily reference rates.",
      keyHighlight: "Server-side rate caching",
      image: "/projects/fx-convert.png",
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
