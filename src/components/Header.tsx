"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";

/**
 * Fixed site header: brand, section nav with an active indicator, theme
 * toggle, and a slide-in mobile drawer.
 *
 * HOW TO UPDATE
 * - Nav items:   edit NAV_LINKS below. `id` must match the section's DOM id.
 * - Brand text:  comes from src/data/portfolio.ts (`personal.name`).
 * - Colors:      brand-pink / brand-purple are defined in app/globals.css.
 */

/** Order here is display order. `id` is both the anchor target and the key. */
const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

type Theme = "light" | "dark";

/** Must match the key read by the no-flash script in app/layout.tsx. */
const THEME_STORAGE_KEY = "theme";

/*
 * The `.dark` class on <html> is the source of truth — the no-flash script sets
 * it before React exists. Subscribing to it (rather than mirroring it into
 * state) means there is only ever one answer to "what theme is this?", and
 * useSyncExternalStore handles the server/client difference without a
 * hydration mismatch.
 */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** The server has no DOM and no localStorage; light is the pre-hydration guess. */
function getServerTheme(): Theme {
  return "light";
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage: the toggle still works for this visit.
    }
  }

  /* --- Active link ------------------------------------------------------ */

  // IntersectionObserver rather than a scroll listener: no work on every frame.
  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleSections.current.add(entry.target.id);
          else visibleSections.current.delete(entry.target.id);
        }
        // Highest section on the page wins when two are in the band at once.
        const current = NAV_LINKS.find((link) => visibleSections.current.has(link.id));
        if (current) setActiveId(current.id);
      },
      // A band just below the header, so a section activates as it reaches the top.
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* --- Mobile drawer ---------------------------------------------------- */

  // Lock the page behind the drawer, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Resizing to desktop hides the drawer via CSS; close it so scroll unlocks too.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const themeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 dark:border-white/10 dark:bg-neutral-950/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <a
            href="#top"
            className="rounded-md text-lg font-semibold tracking-tight text-neutral-900 transition-colors duration-200 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-pink dark:text-neutral-50 dark:hover:text-brand-pink"
          >
            {portfolio.personal.name}
            <span className="text-brand-purple">.</span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                        isActive
                          ? "text-brand-pink dark:text-brand-pink"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                      }`}
                    >
                      {link.label}
                      {/* Underline: full width when active, grows from centre on hover. */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-center rounded-full bg-gradient-to-r from-brand-pink to-brand-purple transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
              className="grid h-10 w-10 place-items-center rounded-full text-neutral-600 transition-colors duration-200 hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-400 dark:hover:bg-brand-purple/15 dark:hover:text-brand-purple"
            >
              {theme === "dark" ? (
                <FiSun className="h-5 w-5" aria-hidden />
              ) : (
                <FiMoon className="h-5 w-5" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center rounded-full text-neutral-600 transition-colors duration-200 hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink md:hidden dark:text-neutral-400 dark:hover:bg-brand-purple/15 dark:hover:text-brand-purple"
            >
              <FiMenu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop — kept mounted so the drawer can transition out. */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile drawer, slides in from the left */}
      <div
        id="mobile-menu"
        // `inert` keeps links out of tab order and off screen readers while closed.
        inert={!menuOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-black/5 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden dark:border-white/10 dark:bg-neutral-950/90 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-full text-neutral-600 transition-colors duration-200 hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-400 dark:hover:bg-brand-purple/15 dark:hover:text-brand-purple"
          >
            <FiX className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-3 py-2">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                      isActive
                        ? "bg-brand-pink/10 text-brand-pink"
                        : "text-neutral-700 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-neutral-50"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-5 w-0.5 rounded-full transition-colors duration-200 ${
                        isActive ? "bg-gradient-to-b from-brand-pink to-brand-purple" : "bg-transparent"
                      }`}
                    />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
