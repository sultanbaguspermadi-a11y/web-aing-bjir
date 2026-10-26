"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe as useReducedMotion } from "@/lib/use-media";
import { useLang } from "./language-provider";
import { Button, MaskLine } from "./primitives";
import { PROJECTS, SITE } from "@/content/site";
import { EASE_IN_OUT, EASE_OUT, originX } from "@/lib/motion";

/** Hairline columns + accent trace. Quiet on purpose: no blobs, no glow. */
function HeroBackdrop({ play }: { play: boolean }) {
  const reduced = useReducedMotion();
  const { sign, dir } = useLang();
  const columns = ["start-1/4", "start-2/4", "start-3/4"] as const;
  const [a, b] = PROJECTS;
  const gradient = `linear-gradient(to ${dir === "ltr" ? "right" : "left"}, ${a.accent}, ${b.accent})`;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {columns.map((cls, i) => (
        <m.span
          key={cls}
          className={`absolute inset-y-0 w-px bg-ink/[0.07] ${cls}`}
          style={{ originY: 0 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={play ? { scaleY: 1, opacity: 1 } : undefined}
          transition={{ duration: reduced ? 0.4 : 1.8, delay: reduced ? 0 : 0.25 + i * 0.14, ease: EASE_IN_OUT }}
        />
      ))}
      <m.span
        className="absolute inset-x-0 bottom-0 h-[2px]"
        style={{ backgroundImage: gradient, originX: originX(sign) }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={play ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{ duration: reduced ? 0.4 : 1.6, delay: reduced ? 0 : 1.3, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

export function Hero() {
  const { t, lang, ready } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isAr = lang === "ar";

  // Slow typographic parallax: headline drifts up to -30px, copy a little less.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yHead = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -30]);
  const yMeta = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -12]);
  const yCopy = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -18]);

  // Full-length intro on first load; a snappier replay after a language switch.
  const introPlayed = useRef(false);
  const speed = introPlayed.current ? 0.4 : 1;
  if (ready) introPlayed.current = true;

  const fade = (delay: number, y = 18) => ({
    initial: { opacity: 0, y },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: reduced ? 0.3 : 0.9, delay: reduced ? 0 : delay * speed, ease: EASE_OUT },
  });

  const track = isAr || reduced ? undefined : "0.32em";
  const trackEnd = isAr || reduced ? undefined : "0.14em";

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-clip pb-10 pt-24">
      <HeroBackdrop play={ready} />
      <div className="container-x flex flex-1 flex-col justify-between gap-16">
        {/* Stage 1: metadata */}
        <m.div style={{ y: yMeta }}>
          <m.div
            key={`meta-${lang}`}
            className="ff-meta flex flex-wrap items-start justify-between gap-x-8 gap-y-2"
            initial={{ opacity: 0, y: 12, letterSpacing: track }}
            animate={ready ? { opacity: 1, y: 0, letterSpacing: trackEnd } : undefined}
            transition={{ duration: reduced ? 0.3 : 0.9, delay: reduced ? 0 : 0.1 * speed, ease: EASE_OUT }}
          >
            <span className="uppercase">{SITE.name}</span>
            <span>{t.hero.eyebrow}</span>
          </m.div>
        </m.div>

        {/* Stage 2: headline, line by line */}
        <m.h1 key={`h1-${lang}`} className="hero-title ff-display" style={{ y: yHead }}>
          {t.hero.headline.map((line, i) => (
            <MaskLine
              key={`${lang}-${i}`}
              play={ready}
              delay={(0.35 + i * 0.14) * speed}
              pad={line.face === "nastaliq" ? "0.45em" : undefined}
            >
              {line.face === "nastaliq" ? <span className="face-nastaliq">{line.text}</span> : line.text}
            </MaskLine>
          ))}
        </m.h1>

        <m.div style={{ y: yCopy }} className="grid items-end gap-10 md:grid-cols-12">
          {/* Stage 3: description */}
          <m.p
            key={`desc-${lang}`}
            className="ff-ui max-w-[34rem] text-pretty text-base text-ink-soft md:col-span-5 lg:text-lg"
            {...fade(0.95)}
          >
            {t.hero.description}
          </m.p>
          {/* Stage 4: CTAs */}
          <m.div
            key={`cta-${lang}`}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-6 md:col-start-7 md:justify-end"
            {...fade(1.1, 14)}
          >
            <Button href="#works" icon="down">
              {t.hero.explore}
            </Button>
            <Button href={SITE.github} icon="ne" variant="ghost" external>
              {t.hero.github}
            </Button>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
