"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { m, useInView } from "framer-motion";
import { useReducedMotionSafe as useReducedMotion } from "@/lib/use-media";
import { useLang } from "./language-provider";
import { EASE_IN_OUT, EASE_OUT, originX } from "@/lib/motion";

/* ---------------------------------------------------------------- */
/* Arrow icon (inline SVG so it never depends on a font's glyph).    */
/* ---------------------------------------------------------------- */

export type ArrowKind = "ne" | "down" | "right";

function ArrowSvg({ kind }: { kind: ArrowKind }) {
  const path =
    kind === "ne"
      ? "M4 12 12 4M5.5 4H12v6.5"
      : kind === "down"
        ? "M8 3v10M3.5 8.5 8 13l4.5-4.5"
        : "M3 8h10M8.5 3.5 13 8l-4.5 4.5";
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d={path} strokeLinecap="square" />
    </svg>
  );
}

/** Two stacked arrows: on hover the first leaves and the second enters. */
export function ArrowSwap({ kind }: { kind: "ne" | "down" }) {
  return (
    <span className={`arrow arrow--${kind}`} aria-hidden="true">
      <ArrowSvg kind={kind} />
      <ArrowSvg kind={kind} />
    </span>
  );
}

/** Plain, static arrow (cursor label, etc.). */
export function Arrow({ kind, className }: { kind: ArrowKind; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-block", width: "1em", height: "1em" }}>
      <ArrowSvg kind={kind} />
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Roll: label shift on hover (needs a `.hover-root` ancestor).       */
/* ---------------------------------------------------------------- */

export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll__a">{children}</span>
      <span className="roll__b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Buttons                                                            */
/* ---------------------------------------------------------------- */

interface ButtonProps {
  href: string;
  children: string;
  icon: "ne" | "down";
  variant?: "solid" | "ghost";
  external?: boolean;
  className?: string;
}

export function Button({ href, children, icon, variant = "solid", external, className }: ButtonProps) {
  const { t } = useLang();
  const rel = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const sr = external ? <span className="sr-only"> {t.a11y.newTab}</span> : null;

  if (variant === "ghost") {
    return (
      <a href={href} className={`link-ghost hover-root ${className ?? ""}`} {...rel}>
        <Roll>{children}</Roll>
        <ArrowSwap kind={icon} />
        {sr}
      </a>
    );
  }
  return (
    <a href={href} className={`btn hover-root ${className ?? ""}`} {...rel}>
      <span className="btn__wipe" aria-hidden="true" />
      <span className="btn__body">
        <Roll>{children}</Roll>
        <ArrowSwap kind={icon} />
      </span>
      {sr}
    </a>
  );
}

/* ---------------------------------------------------------------- */
/* Masked reveals                                                     */
/* ---------------------------------------------------------------- */

interface MaskLineProps {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Play when true; stay hidden otherwise (used to gate on language-ready). */
  play?: boolean;
  /** Start when the line scrolls into view instead of on mount. */
  whenInView?: boolean;
  duration?: number;
  className?: string;
  /** Extra vertical room for tall scripts (Nastaliq). */
  pad?: string;
}

/**
 * Line reveal from inside a clipping container.
 * translateY 110% -> 0, rotate 1deg -> 0, opacity 0 -> 1.
 * Always animates whole lines: Arabic is never split into letters.
 *
 * Note: the in-view trigger is the clipping wrapper, never the moving child.
 * IntersectionObserver clips a target by its overflow:hidden ancestors, so a
 * child translated out of its mask would report "not visible" forever.
 */
export function MaskLine({ children, delay = 0, play = true, whenInView = false, duration = 1.1, className, pad }: MaskLineProps) {
  const reduced = useReducedMotion();
  const { sign } = useLang();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const go = whenInView ? seen : play;
  return (
    <span
      ref={ref}
      className={`mask ${className ?? ""}`}
      style={pad ? ({ "--mask-pad": pad } as React.CSSProperties) : undefined}
    >
      <m.span
        style={{ display: "block", originX: originX(sign), originY: 1 }}
        initial={{ y: "110%", rotate: 1 * sign, opacity: 0 }}
        animate={go ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
        transition={{ duration: reduced ? 0.3 : duration, delay: reduced ? 0 : delay, ease: EASE_OUT }}
      >
        {children}
      </m.span>
    </span>
  );
}

interface WordsMaskProps {
  text: string;
  delay?: number;
  /** "y": rise from below. "x": slide in from the inline-end edge. */
  mode?: "y" | "x";
  stagger?: number;
}

function MaskWord({
  word,
  index,
  delay,
  mode,
  stagger,
}: {
  word: string;
  index: number;
  delay: number;
  mode: "y" | "x";
  stagger: number;
}) {
  const reduced = useReducedMotion();
  const { sign } = useLang();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <span ref={ref} className="mask-inline">
      <m.span
        style={{ display: "inline-block" }}
        initial={mode === "y" ? { y: "110%", opacity: 0 } : { x: `${105 * sign}%`, rotate: 2 * sign, opacity: 0 }}
        animate={inView ? { y: "0%", x: "0%", rotate: 0, opacity: 1 } : undefined}
        transition={{ duration: reduced ? 0.3 : 1, delay: reduced ? 0 : delay + index * stagger, ease: EASE_OUT }}
      >
        {word}
      </m.span>
    </span>
  );
}

/** Word-by-word masked reveal for Latin project titles (never used on Arabic). */
export function WordsMask({ text, delay = 0, mode = "y", stagger = 0.11 }: WordsMaskProps) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <MaskWord word={word} index={i} delay={delay} mode={mode} stagger={stagger} />
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Divider: scaleX reveal, origin follows reading direction.          */
/* ---------------------------------------------------------------- */

export function Divider({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const { sign } = useLang();
  return (
    <m.div
      aria-hidden="true"
      className={`h-px w-full bg-ink/25 ${className ?? ""}`}
      style={{ originX: originX(sign) }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduced ? 0.3 : 1.3, delay, ease: EASE_IN_OUT }}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Counter: 00 -> N, plain rAF tween (no extra animation dependency). */
/* ---------------------------------------------------------------- */

export function CountUp({ to, duration = 1.1 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} aria-hidden="true">
      {String(value).padStart(2, "0")}
    </span>
  );
}
