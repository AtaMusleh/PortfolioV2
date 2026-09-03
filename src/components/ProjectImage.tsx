"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Project screenshot with a graceful fallback.
 *
 * This is the only client component in the Projects section, and it exists for
 * one reason: `onError` has to be a serialized function, which Server
 * Components can't provide. Keeping it in its own tiny file means the cards,
 * the grid, and all the text stay on the server.
 *
 * A screenshot that is missing (or 404s after a rename) renders the same
 * gradient tile as a project with `image: null`, so the grid never shows a
 * broken-image icon.
 */

type ProjectImageProps = {
  /** Path under /public, or null when no screenshot exists yet. */
  readonly src: string | null;
  /** Project name — used for alt text and for the fallback tile's initial. */
  readonly name: string;
};

export default function ProjectImage({ src, name }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (src === null || failed) {
    return (
      <div
        aria-hidden
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-pink/20 via-brand-purple/15 to-brand-purple/25"
      >
        <span className="bg-gradient-to-br from-brand-pink to-brand-purple bg-clip-text text-5xl font-bold text-transparent">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Screenshot of ${name}`}
      fill
      // Two-up on desktop, full width on mobile — keeps Next from serving a
      // 1200px file to a phone.
      sizes="(min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
