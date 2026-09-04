"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Easter egg: a mock "security console" that answers a right-click, and
 * notices when devtools open.
 *
 * Deliberately toothless. It blocks nothing real — the source is public, view-
 * source and keyboard shortcuts still work, and every path out of it (button,
 * Escape, backdrop, close) fully dismisses it. It is a wink, not a wall.
 *
 * Renders `null` until something triggers it, so it adds no markup, no layout
 * work and no blocking script to first paint. Its listeners attach after
 * hydration, which keeps it off the critical path for Lighthouse.
 */

type Trigger = "context-menu" | "devtools";

/**
 * Gap between the outer window and the viewport past which docked devtools are
 * the likeliest explanation. Ordinary browser chrome (tab strip, toolbars,
 * bookmarks) accounts for well under this, so false positives are rare — and a
 * false positive here costs the visitor one dismissed dialog.
 */
const DEVTOOLS_GAP = 220;

const MESSAGES: Record<Trigger, readonly string[]> = {
  "context-menu": [
    "$ contextmenu --intercept",
    "> right click captured at " + "{time}",
    "> nothing hidden here — the source is on GitHub",
    "> carry on",
  ],
  devtools: [
    "$ devtools --status",
    "> inspector detected at " + "{time}",
    "> good. that's where the interesting parts are",
    "> poke around",
  ],
};

export default function DevGuard() {
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [stamp, setStamp] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** Devtools nags once per page load; a right-click can open it any time. */
  const devtoolsAnnounced = useRef(false);

  useEffect(() => {
    const open = (next: Trigger) => {
      setStamp(
        new Date().toLocaleTimeString(undefined, { hour12: false }),
      );
      setTrigger(next);
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      open("context-menu");
    };

    const checkDevtools = () => {
      if (devtoolsAnnounced.current) return;
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      if (widthGap > DEVTOOLS_GAP || heightGap > DEVTOOLS_GAP) {
        devtoolsAnnounced.current = true;
        open("devtools");
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("resize", checkDevtools);

    // Deferred, not run inline: it keeps state updates out of the effect body,
    // and leaves first paint alone.
    const initial = window.setTimeout(checkDevtools, 1500);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("resize", checkDevtools);
      window.clearTimeout(initial);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;

    // Guarded: showModal() on an already-open dialog throws.
    if (trigger !== null && !dialog.open) dialog.showModal();
    if (trigger === null && dialog.open) dialog.close();
  }, [trigger]);

  if (trigger === null) return null;

  const lines = MESSAGES[trigger].map((line) => line.replace("{time}", stamp));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="devguard-title"
      // Fires for Escape as well as close(), so state can never drift from the
      // element's own open/closed state.
      onClose={() => setTrigger(null)}
      onClick={(event) => {
        if (event.target === dialogRef.current) setTrigger(null);
      }}
      className="m-auto w-[min(92vw,32rem)] rounded-xl border border-red-500/40 bg-neutral-950 p-0 font-mono text-neutral-200 shadow-2xl shadow-red-500/10 backdrop:bg-neutral-950/70 backdrop:backdrop-blur-sm"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-red-500/30 bg-red-500/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <h2
          id="devguard-title"
          className="text-xs font-semibold tracking-widest text-red-400 uppercase"
        >
          {trigger === "devtools" ? "inspector" : "access log"}
        </h2>
      </div>

      <div className="px-5 py-5 text-sm leading-relaxed">
        {lines.map((line) => (
          <p
            key={line}
            className={
              line.startsWith("$")
                ? "text-red-400"
                : "text-neutral-400 before:text-red-500/60"
            }
          >
            {line}
          </p>
        ))}

        <p className="mt-4 text-xs text-neutral-600">
          esc, or the button — either works.
        </p>

        <button
          type="button"
          onClick={() => setTrigger(null)}
          className="mt-4 w-full rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors duration-200 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        >
          dismiss
        </button>
      </div>
    </dialog>
  );
}
