"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { m, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useLang } from "./language-provider";
import { useCursorLabel } from "./cursor-label";
import { useFinePointer, useReducedMotionSafe as useReducedMotion } from "@/lib/use-media";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

interface ProjectImageProps {
  src: string;
  alt: string;
  accent: string;
  href: string;
  aspect: string;
  sizes: string;
  /** Scrabble: board settles from this rotation to 0. */
  rotateFrom?: number;
  /** Seconds. Image reveals after the project metadata. */
  delay?: number;
}

/**
 * Layered reveal + restrained scroll/pointer response.
 *   L0 clip-path mask  -> L1 entrance scale/rotate -> L2 scroll drift
 *   -> L3 pointer follow (max 8px) -> L4 hover zoom (CSS transform)
 * L2 is oversized so drift and follow never expose an edge.
 */
export function ProjectImage({ src, alt, accent, href, aspect, sizes, rotateFrom = 0, delay = 0.25 }: ProjectImageProps) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { t, sign } = useLang();
  const cursor = useCursorLabel();
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLAnchorElement>(null);
  // Trigger from an unclipped wrapper: Chrome applies the target's own
  // clip-path to IntersectionObserver, so a fully clipped element never "enters".
  const inView = useInView(wrap, { once: true, amount: 0.15 });
  const rect = useRef<DOMRect | null>(null);

  // Scroll progress 0 -> 1: scale 1.04 -> 1, translateY 30px -> -20px.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -20]);
  const driftScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.04, 1]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.6 };
  const mx = useSpring(rawX, spring);
  const my = useSpring(rawY, spring);
  const follow = fine && !reduced;

  const onEnter = (e: React.PointerEvent) => {
    if (!fine) return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
    cursor.show(e.clientX, e.clientY, t.project.cursor);
  };
  const onMove = (e: React.PointerEvent) => {
    const r = rect.current;
    if (!follow || !r) return;
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    rawX.set(nx * 8); // max 8px, per PRD (6-10px)
    rawY.set(ny * 6);
  };
  const onLeave = () => {
    cursor.hide();
    rawX.set(0);
    rawY.set(0);
  };

  // Same targets for everyone (SSR-safe). In reduced-motion, CSS removes the
  // clip-path and MotionConfig makes the transforms instant: only opacity fades.
  const hidden = { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 };
  const shown = { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 };

  return (
    <div ref={wrap} className="relative w-full" style={{ aspectRatio: aspect }}>
    <m.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
      className="group absolute inset-0 block overflow-hidden bg-paper-2"
      style={{ "--accent": accent } as CSSProperties}
      variants={{ hidden, shown }}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
      transition={{ duration: reduced ? 0.4 : 1.3, delay: reduced ? 0 : delay, ease: EASE_IN_OUT }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* L1: entrance */}
      <m.div
        className="absolute inset-0"
        variants={{
          hidden: { scale: 1.08, y: 30, rotate: rotateFrom * sign },
          shown: { scale: 1, y: 0, rotate: 0 },
        }}
        transition={{ duration: 1.5, delay, ease: EASE_OUT }}
      >
        {/* L2: scroll drift (oversized to hide edges) */}
        <m.div className="absolute -inset-[6%]" style={{ y: driftY, scale: driftScale }}>
          {/* L3: pointer follow */}
          <m.div className="absolute inset-0" style={{ x: mx, y: my }}>
            {/* L4: hover zoom + very slight contrast */}
            <div className="absolute inset-0 transition-[transform,filter] duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.035] group-hover:contrast-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover"
                unoptimized={src.endsWith(".svg")}
              />
            </div>
          </m.div>
        </m.div>
      </m.div>

      {/* Accent frame: becomes more visible on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ borderColor: accent }}
      />
    </m.a>
    </div>
  );
}
