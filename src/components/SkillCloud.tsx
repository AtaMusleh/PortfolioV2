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
/** World height of a label sprite; width follows from the texture's aspect. */
const LABEL_HEIGHT = 0.32;
/** Idle drift, radians per frame. */
const IDLE_SPIN = 0.0016;
const DRAG_SENSITIVITY = 0.005;
/** Stops the sphere tipping far enough to turn labels upside down. */
const MAX_TILT = 0.6;

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
    const camera = new PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 5.4;

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

    labels.forEach((label, index) => {
      const made = createLabelTexture(label, labelColor);
      if (made === null) return;

      const material = new SpriteMaterial({ map: made.texture, transparent: true });
      const sprite = new Sprite(material);
      sprite.scale.set(LABEL_HEIGHT * made.aspect, LABEL_HEIGHT, 1);

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

    /* --- Interaction -------------------------------------------------- */

    const rotation = { x: 0.15, y: 0 };
    const velocity = { x: 0, y: IDLE_SPIN };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      // Capture keeps the drag alive when the pointer leaves the canvas.
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;

      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      // Applied straight to rotation so the cloud tracks the finger exactly;
      // velocity is recorded only to carry momentum after release.
      rotation.y += deltaX * DRAG_SENSITIVITY;
      rotation.x += deltaY * DRAG_SENSITIVITY;
      velocity.y = deltaX * DRAG_SENSITIVITY;
      velocity.x = deltaY * DRAG_SENSITIVITY;
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

    const renderFrame = () => {
      if (!dragging) {
        // Momentum bleeds off and settles back into the idle drift.
        velocity.y += (IDLE_SPIN - velocity.y) * 0.02;
        velocity.x *= 0.94;
        rotation.y += velocity.y;
        rotation.x += velocity.x;
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
        className="h-[440px] w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-[580px]"
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-500">
        Drag to rotate
      </p>
    </div>
  );
}
