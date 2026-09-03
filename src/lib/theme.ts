/**
 * Reading the active theme from the DOM.
 *
 * The `.dark` class on <html> is the single source of truth — the no-flash
 * script in app/layout.tsx sets it before React exists, and the header's toggle
 * flips it. Components subscribe to that class rather than keeping their own
 * copy in state, so there is only ever one answer to "what theme is this?".
 *
 * Pair these with `useSyncExternalStore`:
 *   const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
 */

export type Theme = "light" | "dark";

export function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** The server has no DOM and no localStorage; light is the pre-hydration guess. */
export function getServerTheme(): Theme {
  return "light";
}
