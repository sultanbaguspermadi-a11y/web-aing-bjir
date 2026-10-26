"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useActiveSection } from "./active-section";
import { EASE_OUT } from "@/lib/motion";
import { PROJECTS } from "@/content/site";

/**
 * Fixed "01 / 02" that follows the project in view. The number rolls
 * vertically through a clipped box (up when moving forward, down when back).
 * Decorative: aria-hidden, desktop only.
 */
export function ProjectCounter() {
  const active = useActiveSection();
  const current = active === "project-lughoti" ? 0 : active === "project-scrabble" ? 1 : null;

  const [shown, setShown] = useState(0);
  const direction = useRef<1 | -1>(1);

  useEffect(() => {
    if (current === null) return;
    direction.current = current >= shown ? 1 : -1;
    setShown(current);
    // `shown` intentionally omitted: it is only read to derive the direction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const total = String(PROJECTS.length).padStart(2, "0");
  const dir = direction.current;

  return (
    <m.div
      aria-hidden="true"
      dir="ltr"
      className="ff-meta pointer-events-none fixed bottom-6 start-[var(--gutter)] z-40 hidden items-center gap-2 md:flex"
      initial={false}
      animate={{ opacity: current === null ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className="relative inline-block h-[1.6em] w-[2.2em] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <m.span
            key={shown}
            custom={dir}
            className="absolute inset-0 block"
            variants={{
              enter: (d: number) => ({ y: `${100 * d}%` }),
              center: { y: "0%", opacity: 1 },
              exit: (d: number) => ({ y: `${-100 * d}%` }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {String(shown + 1).padStart(2, "0")}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="opacity-50">/ {total}</span>
    </m.div>
  );
}
