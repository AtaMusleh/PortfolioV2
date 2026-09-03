"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

/**
 * Dialog shell for project details.
 *
 * Uses the native <dialog> element with showModal(), which gives focus
 * trapping, Escape-to-close, inert background content and top-layer stacking
 * for free — all of which a div-based modal has to reimplement by hand.
 *
 * The body is passed in as `children`, already rendered on the server by
 * <ProjectDetail>, so this file holds no project content.
 */

type ProjectModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  /** id of the heading inside `children`, for aria-labelledby. */
  readonly labelledBy: string | undefined;
  readonly children: ReactNode;
};

export default function ProjectModal({
  open,
  onClose,
  labelledBy,
  children,
}: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;

    // Guarded: calling showModal() on an already-open dialog throws.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    if (!open) return;

    // showModal() makes the background inert but does not stop it scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      // Fires for Escape and for close() alike, so state stays in sync with
      // the element however it was dismissed.
      onClose={onClose}
      // A click landing on the dialog itself is a backdrop click: the panel
      // inside covers the whole element, so anything else has a nearer target.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(92vw,42rem)] rounded-2xl border border-black/5 bg-white p-0 text-neutral-900 backdrop:bg-neutral-950/50 backdrop:backdrop-blur-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
    >
      <div className="relative max-h-[85vh] overflow-y-auto p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-neutral-600 backdrop-blur-sm transition-colors duration-200 hover:bg-brand-pink/10 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-brand-purple/15 dark:hover:text-brand-purple"
        >
          <FiX aria-hidden className="h-5 w-5" />
        </button>

        {children}
      </div>
    </dialog>
  );
}
