"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";
import gsap from "gsap";
import { portfolio } from "@/data/portfolio";

/**
 * Landing section: name, title, tagline, two CTAs, drifting gradient
 * background, and a scroll cue.
 *
 * HOW TO UPDATE
 * - Name / tagline: src/data/portfolio.ts (`personal`).
 * - Job title:      TITLE below — it's presentation copy, not portfolio data.
 * - Colors:         brand-pink / brand-purple in app/globals.css.
 * - Animation:      the gsap.matchMedia block; every value is in one place.
 */

/** Headline role. Deliberately not in portfolio.ts — that tracks the real job. */
const TITLE = "Full-stack developer";

/**
 * useLayoutEffect runs before paint (so GSAP's initial state never flashes),
 * but React warns when it runs during SSR. This is the documented GSAP-in-Next
 * shim: layout effect in the browser, no-op effect on the server.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      /*
       * Everything animated lives inside this branch, including the "hide it
       * first" set(). Under reduced motion the branch never runs, so the
       * markup renders exactly as written — visible, in place, no JS needed.
       * That also means a JS failure degrades to plain readable content.
       */
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Selector text inside a context is scoped to rootRef automatically.
        gsap.set("[data-hero-item]", { opacity: 0, y: -28 });
        gsap.set("[data-hero-cue]", { opacity: 0 });

        const intro = gsap.timeline({
          defaults: { duration: 0.9, ease: "power3.out" },
        });

        intro
          .to("[data-hero-item]", { opacity: 1, y: 0, stagger: 0.12 })
          .to("[data-hero-cue]", { opacity: 1, duration: 0.6 }, "-=0.3");

        // Scroll cue pulse. Starts after the intro so the two don't fight.
        intro.add(
          gsap.to("[data-hero-arrow]", {
            y: 8,
            repeat: -1,
            yoyo: true,
            duration: 1.1,
            ease: "sine.inOut",
          }),
        );

        /*
         * Background drift. Transform and opacity only — animating `filter`
         * would re-run the blur every frame and drop the section off the
         * compositor.
         */
        gsap.to("[data-hero-blob='1']", {
          x: 120,
          y: 60,
          scale: 1.15,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-hero-blob='2']", {
          x: -100,
          y: -70,
          scale: 1.2,
          duration: 22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-hero-blob='3']", {
          x: 70,
          y: -90,
          scale: 0.9,
          duration: 26,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="home"
      /*
       * dvh, not vh: on mobile browsers `100vh` includes the collapsing URL bar,
       * which pushes the scroll cue below the fold on first load.
       * The 4rem subtracts the fixed header offset applied in layout.tsx.
       */
      className="relative isolate flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
    >
      {/* Background --------------------------------------------------- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/5 via-transparent to-brand-purple/10 dark:from-brand-pink/10 dark:to-brand-purple/15" />
        <div
          data-hero-blob="1"
          className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-pink/30 blur-3xl dark:bg-brand-pink/20"
        />
        <div
          data-hero-blob="2"
          className="absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-brand-purple/30 blur-3xl dark:bg-brand-purple/20"
        />
        <div
          data-hero-blob="3"
          className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-pink/20 blur-3xl dark:bg-brand-purple/15"
        />
      </div>

      {/* Content ------------------------------------------------------ */}
      <div className="flex max-w-3xl flex-col items-center gap-6">
        <h1
          data-hero-item
          className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl lg:text-8xl"
        >
          {portfolio.personal.name}
        </h1>

        <p
          data-hero-item
          className="text-lg font-medium text-brand-purple sm:text-xl lg:text-2xl"
        >
          {TITLE}
        </p>

        <p
          data-hero-item
          className="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400"
        >
          {portfolio.personal.tagline}
        </p>

        {/* CTAs. min-h-12 keeps both above the 48px touch target floor. */}
        <div
          data-hero-item
          className="mt-2 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Link
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-purple px-7 text-sm font-semibold text-white shadow-lg shadow-brand-pink/25 transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink active:scale-100"
          >
            View Projects
          </Link>

          <Link
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-semibold text-neutral-800 transition-colors duration-200 hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-brand-purple dark:hover:text-brand-purple"
          >
            Get in touch
          </Link>
        </div>
      </div>

      {/* Scroll cue --------------------------------------------------- */}
      <Link
        data-hero-cue
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 grid h-11 w-11 place-items-center rounded-full text-neutral-500 transition-colors duration-200 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:text-neutral-500 dark:hover:text-brand-pink"
      >
        <FiArrowDown data-hero-arrow className="h-5 w-5" aria-hidden />
      </Link>
    </section>
  );
}
