"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { FiChevronLeft, FiChevronRight, FiGrid, FiLayers } from "react-icons/fi";
import ProjectModal from "@/components/ProjectModal";

/**
 * Projects view switcher: a coverflow carousel (default) and the grid.
 *
 * Card and detail markup arrives already rendered from the server as
 * `card` / `detail` nodes — this file owns interaction only, so no project
 * content ends up in the client bundle.
 *
 * The carousel is CSS 3D transforms, not a 3D library: four cards on a
 * perspective plane is a transform per card, and pulling in a renderer for it
 * would cost more than the whole rest of the page.
 */

export type ProjectViewItem = {
  readonly id: string;
  readonly name: string;
  /** <ProjectCard>, server-rendered. */
  readonly card: ReactNode;
  /** <ProjectDetail>, server-rendered. */
  readonly detail: ReactNode;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * The server can't read a media query. Guessing "no preference" here means the
 * prerendered HTML matches what most visitors get, so the common case doesn't
 * visibly rearrange at hydration; the minority who prefer reduced motion see
 * one swap to the grid instead.
 */
function getServerReducedMotion(): boolean {
  return false;
}

/* --- Carousel geometry -------------------------------------------------- */

/** Horizontal step per card, as a percentage of card width. */
const STEP_PERCENT = 72;
const SIDE_ROTATION = 30;
const SIDE_SCALE = 0.76;
/** How far a drag must travel before it counts as a swipe. */
const SWIPE_THRESHOLD = 60;
/** Movement past this suppresses the click that would otherwise open a card. */
const CLICK_CANCEL_THRESHOLD = 8;

function cardStyle(offset: number, dragPx: number): CSSProperties {
  const distance = Math.abs(offset);
  const isCentre = distance === 0;
  // Anything beyond the immediate neighbours is hidden outright.
  const isHidden = distance > 1;

  return {
    transform: [
      `translateX(calc(-50% + ${offset * STEP_PERCENT}% + ${dragPx}px))`,
      `translateZ(${isCentre ? "0px" : "-240px"})`,
      `rotateY(${offset * -SIDE_ROTATION}deg)`,
      `scale(${isCentre ? 1 : SIDE_SCALE})`,
    ].join(" "),
    opacity: isHidden ? 0 : isCentre ? 1 : 0.45,
    zIndex: 10 - distance,
    // visibility (not just opacity) also takes hidden cards out of the tab
    // order and the accessibility tree.
    visibility: isHidden ? "hidden" : "visible",
    pointerEvents: isHidden ? "none" : "auto",
  };
}

export default function ProjectsView({
  items,
}: {
  readonly items: readonly ProjectViewItem[];
}) {
  const [view, setView] = useState<"carousel" | "grid">("carousel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragPx, setDragPx] = useState(0);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  // Reduced motion forces the grid; the toggle is hidden rather than disabled,
  // since offering a control that can't apply is worse than not offering it.
  const effectiveView = reducedMotion ? "grid" : view;

  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const openItem = items.find((item) => item.id === openId);

  function goTo(index: number) {
    setActiveIndex(Math.min(items.length - 1, Math.max(0, index)));
  }

  /* --- Drag / swipe ----------------------------------------------------- */

  function onPointerDown(event: React.PointerEvent) {
    isDragging.current = true;
    hasMoved.current = false;
    dragStartX.current = event.clientX;
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!isDragging.current) return;

    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > CLICK_CANCEL_THRESHOLD) hasMoved.current = true;
    setDragPx(delta);
  }

  function onPointerEnd() {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (dragPx <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (dragPx >= SWIPE_THRESHOLD) goTo(activeIndex - 1);

    setDragPx(0);
  }

  /**
   * A swipe ends with a click on whichever card is under the finger. Without
   * this, every swipe would also open a detail dialog.
   */
  function onClickCapture(event: React.MouseEvent) {
    if (!hasMoved.current) return;
    event.preventDefault();
    event.stopPropagation();
    hasMoved.current = false;
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  }

  /* --- Pieces ------------------------------------------------------------ */

  /**
   * `opaque` is for the carousel: ProjectCard is glassmorphic (bg-white/60),
   * and inside a preserve-3d context the card behind shows straight through
   * it — the neighbouring slide's text reads over the featured one. An opaque
   * layer behind the card blocks that without touching the grid's glass look.
   */
  function clickableCard(item: ProjectViewItem, opaque = false) {
    return (
      <div
        className={`relative h-full ${opaque ? "rounded-2xl bg-white dark:bg-neutral-950" : ""}`}
      >
        {item.card}
      </div>
    );
  }

  /**
   * Opens the dialog for whichever card was clicked.
   *
   * Delegated rather than a handler per card: the trigger lives inside
   * ProjectCard, which is server-rendered and cannot carry a function. Clicks
   * on a repo or demo link never reach a trigger, so those links work
   * normally — which is the whole point of the arrangement.
   */
  function onCardClick(event: React.MouseEvent) {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-project-detail]",
    );
    const id = trigger?.dataset.projectDetail;
    if (id !== undefined) setOpenId(id);
  }

  const toggleBase =
    "grid h-9 w-9 place-items-center rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink";
  const toggleActive = "bg-brand-pink/10 text-brand-pink dark:bg-brand-purple/15 dark:text-brand-purple";
  const toggleIdle =
    "text-neutral-500 hover:text-brand-pink dark:text-neutral-400 dark:hover:text-brand-purple";

  return (
    <div className="mt-10" onClick={onCardClick}>
      {!reducedMotion && (
        <div className="mb-6 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setView("carousel")}
            aria-label="Carousel view"
            aria-pressed={view === "carousel"}
            className={`${toggleBase} ${view === "carousel" ? toggleActive : toggleIdle}`}
          >
            <FiLayers aria-hidden className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`${toggleBase} ${view === "grid" ? toggleActive : toggleIdle}`}
          >
            <FiGrid aria-hidden className="h-4 w-4" />
          </button>
        </div>
      )}

      {effectiveView === "grid" ? (
        <ul className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="h-full">
              {clickableCard(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {/* Focusable region so arrow keys work; the arrows and dots below
              give pointer and AT users the same navigation. */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerLeave={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onClickCapture={onClickCapture}
            // touch-pan-y keeps vertical page scrolling working over the
            // carousel while horizontal drags are handled here.
            className="relative h-[640px] touch-pan-y select-none overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink sm:h-[720px]"
            style={{ perspective: "1600px" }}
          >
            <ul className="relative h-full [transform-style:preserve-3d]">
              {items.map((item, index) => {
                const offset = index - activeIndex;
                return (
                  <li
                    key={item.id}
                    aria-label={`${index + 1} of ${items.length}`}
                    style={cardStyle(offset, dragPx)}
                    className={`absolute left-1/2 top-0 h-full w-[min(94%,34rem)] ${
                      // No transition mid-drag, so cards track the finger.
                      dragPx === 0
                        ? "transition-[transform,opacity] duration-500 ease-out"
                        : ""
                    }`}
                  >
                    {clickableCard(item, true)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-neutral-600 transition-colors duration-200 hover:border-brand-pink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:pointer-events-none disabled:opacity-40 dark:border-white/15 dark:text-neutral-400 dark:hover:border-brand-purple dark:hover:text-brand-purple"
            >
              <FiChevronLeft aria-hidden className="h-5 w-5" />
            </button>

            <ul className="flex items-center gap-2">
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Show ${item.name}`}
                    aria-current={index === activeIndex}
                    className={`block h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                      index === activeIndex
                        ? "w-6 bg-gradient-to-r from-brand-pink to-brand-purple"
                        : "w-2.5 bg-neutral-300 hover:bg-brand-pink/50 dark:bg-neutral-700"
                    }`}
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
              aria-label="Next project"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-neutral-600 transition-colors duration-200 hover:border-brand-pink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:pointer-events-none disabled:opacity-40 dark:border-white/15 dark:text-neutral-400 dark:hover:border-brand-purple dark:hover:text-brand-purple"
            >
              <FiChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <ProjectModal
        open={openItem !== undefined}
        onClose={() => setOpenId(null)}
        labelledBy={
          openItem === undefined ? undefined : `project-detail-${openItem.id}`
        }
      >
        {openItem?.detail}
      </ProjectModal>
    </div>
  );
}
