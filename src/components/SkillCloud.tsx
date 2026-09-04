"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  CanvasTexture,
  Group,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { getServerTheme, getTheme, subscribeToTheme } from "@/lib/theme";

/**
 * Draggable 3D word cloud of skill labels.
 *
 * The only client component in the Skills section — the heading and the
 * category cards stay server-rendered.
 *
 * Labels are canvas-textured sprites on a Fibonacci sphere. Sprites always
 * face the camera, so text stays readable at any rotation; a mesh-based
 * approach would show labels edge-on and mirrored round the back.
 *
 * Accessibility: the canvas is `aria-hidden`. Every label in it also appears
 * as real text in the category cards below, so nothing is lost — and a
 * drag-to-rotate canvas has no keyboard equivalent worth pretending to.
 */

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
 * The server can't read a media query, and "assume reduced" is the useful
 * guess: the prerendered HTML then contains the readable label list, which is
 * also what a visitor with JavaScript disabled keeps.
 */
function getServerReducedMotion(): boolean {
  return true;
}

/* --- Scene constants --------------------------------------------------- */

const SPHERE_RADIUS = 2;
/** Vertical field of view, degrees. Shared by the camera and fitDistance. */
const FOV = 55;
/** Breathing room past the measured extents, so rounding can never clip. */
const FIT_MARGIN = 1.08;
/** World height of a label sprite; width follows from the texture's aspect. */
const LABEL_HEIGHT = 0.32;
/**
 * Seconds for one full idle revolution. Ambient, not spinning.
 *
 * Expressed as a period in seconds rather than radians per frame on purpose:
 * a per-frame figure silently runs at the display's refresh rate, so the same
 * constant drifts calmly on a 60Hz panel and noticeably faster on a 120 or
 * 144Hz one. Multiplying by elapsed time makes it identical everywhere.
 */
const IDLE_ROTATION_SECONDS = 18;
/** Radians per second. */
const IDLE_SPIN = (Math.PI * 2) / IDLE_ROTATION_SECONDS;
const DRAG_SENSITIVITY = 0.005;
/** Share of a fling's speed still left one second after release. */
const MOMENTUM_RETAINED_PER_SECOND = 0.02;
/** Ceiling on fling speed, radians per second, so a fast swipe can't blur. */
const MAX_FLING = 6;
/** A backgrounded tab hands back one huge delta on return; clamp it. */
const MAX_FRAME_SECONDS = 0.1;
/** Stops the sphere tipping far enough to turn labels upside down. */
const MAX_TILT = 0.6;

/**
 * Camera distance that keeps the whole cloud inside the frame at any aspect
 * ratio.
 *
 * Two things go wrong with a fixed distance. Horizontally, the vertical field
 * of view is what's fixed, so the horizontal one narrows with the viewport and
 * the widest labels fall outside it on a phone. And a label sprite sticks out
 * well past the point it is anchored to, by an amount that depends entirely on
 * how wide the text renders — which varies with the font the visitor actually
 * has.
 *
 * So the extents are not guessed: they are measured from the sprites that were
 * really built, on this machine, with this font. Deriving the distance from
 * whichever axis is tighter then makes clipping impossible by construction,
 * while still letting the sphere fill as much of the frame as it can.
 */
function fitDistance(
  aspect: number,
  horizontalExtent: number,
  verticalExtent: number,
): number {
  const halfHeight = Math.tan((FOV * Math.PI) / 180 / 2);
  const halfWidth = halfHeight * aspect;
  return (
    Math.max(horizontalExtent / halfWidth, verticalExtent / halfHeight) *
    FIT_MARGIN
  );
}

/**
 * Renders one label to a canvas and wraps it in a texture.
 *
 * Returns the aspect ratio too — the sprite has to be scaled to it or the text
 * comes out stretched.
 */
function createLabelTexture(
  text: string,
  color: string,
): { texture: CanvasTexture; aspect: number } | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context === null) return null;

  const fontSize = 64;
  const padding = 24;
  const font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;

  // Measure at the final font before sizing the canvas.
  context.font = font;
  const width = Math.ceil(context.measureText(text).width) + padding * 2;
  const height = fontSize + padding;

  canvas.width = width;
  canvas.height = height;

  // Resizing a canvas resets its 2D context, so every setting goes on again
  // here. Setting the font before the resize only served the measurement.
  context.font = font;
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, padding, height / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;

  return { texture, aspect: width / height };
}

type SkillCloudProps = {
  /** Every skill across all groups, flattened. */
  readonly labels: readonly string[];
};

export default function SkillCloud({ labels }: SkillCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  // Label colour is baked into each texture, so a theme flip rebuilds the scene.
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (container === null) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    /* --- Scene ------------------------------------------------------- */

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, width / height, 0.1, 100);
    // Positioned once the sprites exist and their real extents are known.

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    // Capped: uncapped DPR on a 3x phone screen triples the fill cost for no
    // visible gain on text this size.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    container.appendChild(canvas);

    const group = new Group();
    scene.add(group);

    const created: { texture: CanvasTexture; material: SpriteMaterial }[] = [];
    const labelColor = theme === "dark" ? "#ededed" : "#1f1f1f";

    // Widest sprite actually built, in world units. This is what decides how
    // far the camera has to sit, so it is measured rather than assumed.
    let widestLabelHalfWidth = 0;

    labels.forEach((label, index) => {
      const made = createLabelTexture(label, labelColor);
      if (made === null) return;

      const material = new SpriteMaterial({ map: made.texture, transparent: true });
      const sprite = new Sprite(material);
      const spriteWidth = LABEL_HEIGHT * made.aspect;
      sprite.scale.set(spriteWidth, LABEL_HEIGHT, 1);
      widestLabelHalfWidth = Math.max(widestLabelHalfWidth, spriteWidth / 2);

      /*
       * Fibonacci sphere: walk y evenly from +1 to -1 and step the angle by the
       * golden angle each time. Gives near-uniform spacing without the crowding
       * at the poles that naive lat/long loops produce.
       */
      const y = 1 - (index / Math.max(labels.length - 1, 1)) * 2;
      const ringRadius = Math.sqrt(Math.max(1 - y * y, 0));
      const theta = index * Math.PI * (3 - Math.sqrt(5));

      sprite.position.set(
        Math.cos(theta) * ringRadius * SPHERE_RADIUS,
        y * SPHERE_RADIUS,
        Math.sin(theta) * ringRadius * SPHERE_RADIUS,
      );

      group.add(sprite);
      created.push({ texture: made.texture, material });
    });

    /*
     * A label anchored at the sphere's edge reaches SPHERE_RADIUS plus half its
     * own width. Rotation only moves anchors around that same radius, so this
     * bound holds for every frame, not just the first one.
     */
    const horizontalExtent = SPHERE_RADIUS + widestLabelHalfWidth;
    const verticalExtent = SPHERE_RADIUS + LABEL_HEIGHT / 2;

    const fitCamera = () => {
      camera.position.z = fitDistance(
        camera.aspect,
        horizontalExtent,
        verticalExtent,
      );
    };
    fitCamera();

    /* --- Interaction -------------------------------------------------- */

    const rotation = { x: 0.15, y: 0 };
    /** Left over from a fling, in radians per second. Idle drift is separate. */
    const momentum = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = performance.now();

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      lastMoveTime = performance.now();
      // Capture keeps the drag alive when the pointer leaves the canvas.
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;

      const now = performance.now();
      const elapsed = Math.max((now - lastMoveTime) / 1000, 0.001);
      lastMoveTime = now;

      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      // Applied straight to rotation, so dragging tracks the pointer exactly
      // and stays as responsive as before — the idle slowdown is separate.
      const turnY = deltaX * DRAG_SENSITIVITY;
      const turnX = deltaY * DRAG_SENSITIVITY;
      rotation.y += turnY;
      rotation.x += turnX;

      // Recorded as a rate so the fling that follows release is the speed the
      // pointer was actually moving, not the size of the last event's step.
      const clamp = (value: number) =>
        Math.min(MAX_FLING, Math.max(-MAX_FLING, value));
      momentum.y = clamp(turnY / elapsed);
      momentum.x = clamp(turnX / elapsed);
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    /* --- Loop --------------------------------------------------------- */

    const worldPosition = new Vector3();
    let frame = 0;
    let previousTime = performance.now();

    const renderFrame = () => {
      const now = performance.now();
      const elapsed = Math.min((now - previousTime) / 1000, MAX_FRAME_SECONDS);
      previousTime = now;

      if (!dragging) {
        // Any fling decays, then the constant ambient drift underneath it
        // carries on. Both are per-second, so the pace is the same on a 60Hz
        // laptop and a 144Hz monitor.
        const decay = Math.pow(MOMENTUM_RETAINED_PER_SECOND, elapsed);
        momentum.x *= decay;
        momentum.y *= decay;

        rotation.y += (momentum.y + IDLE_SPIN) * elapsed;
        rotation.x += momentum.x * elapsed;
      }

      rotation.x = Math.min(MAX_TILT, Math.max(-MAX_TILT, rotation.x));
      group.rotation.set(rotation.x, rotation.y, 0);

      // Depth fade: labels at the back dim, which reads as volume and stops
      // front and back text from competing.
      for (const child of group.children) {
        const sprite = child as Sprite;
        sprite.getWorldPosition(worldPosition);
        const depth = (worldPosition.z / SPHERE_RADIUS + 1) / 2;
        sprite.material.opacity = 0.2 + depth * 0.8;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(renderFrame);
    };

    frame = requestAnimationFrame(renderFrame);

    /* --- Resize ------------------------------------------------------- */

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (nextWidth === 0 || nextHeight === 0) return;

      camera.aspect = nextWidth / nextHeight;
      // Refit, or rotating to portrait would start clipping labels again.
      fitCamera();
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });
    resizeObserver.observe(container);

    /* --- Teardown ----------------------------------------------------- */

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      // GPU memory is not garbage collected — every texture, material and the
      // renderer's own context have to be released by hand.
      for (const item of created) {
        item.material.dispose();
        item.texture.dispose();
      }
      renderer.dispose();
      canvas.remove();
    };
  }, [labels, reducedMotion, theme]);

  if (reducedMotion) {
    return (
      <ul className="flex flex-wrap justify-center gap-2">
        {labels.map((label) => (
          <li
            key={label}
            className="rounded-full bg-brand-purple/10 px-3 py-1.5 text-sm font-medium text-brand-purple dark:bg-brand-purple/15"
          >
            {label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* touch-none stops a drag on the sphere from scrolling the page. */}
      <div
        ref={containerRef}
        aria-hidden
        className="h-[360px] w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-[600px]"
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-500">
        Drag to rotate
      </p>
    </div>
  );
}
