"use client";

import { useRef, type ReactNode } from "react";
import { m, useInView } from "framer-motion";
import { useReducedMotionSafe as useReducedMotion } from "@/lib/use-media";
import { useLang } from "./language-provider";
import { EASE_IN_OUT, EASE_OUT, originX } from "@/lib/motion";

/** Faint accent field behind a project. Fades with the viewport, edges feathered. */
export function AccentTint({ color }: { color: string }) {
  return (
    <m.div
      aria-hidden="true"
      className="tint pointer-events-none absolute inset-0 -z-10"
      style={{ backgroundColor: color }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.16 }}
      viewport={{ amount: 0.25 }}
      transition={{ duration: 1.4, ease: EASE_OUT }}
    />
  );
}

/** "01 / 02" with the current number rolling up through a clipped box. */
export function ProjectIndex({ n, total }: { n: number; total: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger from the clipping wrapper: a child translated out of an
  // overflow:hidden box is "invisible" to IntersectionObserver.
  const inView = useInView(ref, { once: true });
  const pad = (v: number) => String(v).padStart(2, "0");
  return (
    <p className="ff-meta flex items-center gap-2 md:hidden" aria-label={`${n} / ${total}`}>
      <span ref={ref} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
        <m.span
          className="block"
          initial={{ y: "100%" }}
          animate={inView ? { y: "0%" } : undefined}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          {pad(n)}
        </m.span>
      </span>
      <span aria-hidden="true" className="opacity-50">
        / {pad(total)}
      </span>
    </p>
  );
}

/** Meta text that reveals with its own delay (metadata comes before the image). */
export function Rise({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "dl";
}) {
  const reduced = useReducedMotion();
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduced ? 0.3 : 0.9, delay: reduced ? 0 : delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

/** Hairline under a project that grows on hover (see .project-line in globals.css). */
export function HoverLine({ color }: { color: string }) {
  return (
    <span aria-hidden="true" className="block h-[2px] w-full overflow-hidden">
      <span className="project-line block h-full w-full" style={{ backgroundColor: color }} />
    </span>
  );
}

/** Four Arabic letters on tiles spelling "عربي". Decorative. Letters are never split in text. */
export function Tiles({ color }: { color: string }) {
  const reduced = useReducedMotion();
  const { sign } = useLang();
  const letters = ["ع", "ر", "ب", "ي"];
  return (
    // Forced RTL so the row always reads عربي, whichever language the page is in.
    <div dir="rtl" aria-hidden="true" className="flex w-fit gap-2">
      {letters.map((ch, i) => (
        <m.span
          key={ch}
          className="grid size-12 place-items-center border border-ink/80 text-2xl text-ink"
          style={{
            backgroundColor: color,
            fontFamily: "var(--font-ar-kufi), var(--font-ar-ui), sans-serif",
            fontWeight: 500,
            originX: originX(sign),
          }}
          initial={{ opacity: 0, y: 18, rotate: -5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.5 + i * 0.09, ease: EASE_IN_OUT }}
        >
          {ch}
        </m.span>
      ))}
    </div>
  );
}
