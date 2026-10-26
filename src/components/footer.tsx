"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe as useReducedMotion } from "@/lib/use-media";
import { useLang } from "./language-provider";
import { Button, Divider, MaskLine } from "./primitives";
import { SITE } from "@/content/site";

export function Footer() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const nastaliq = t.footer.face === "nastaliq";

  // The big word drifts upward once as the footer enters. No looping.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [90, 0]);

  return (
    <footer id="contact" ref={ref} className="relative overflow-clip pb-8 pt-24 md:pt-36">
      <div className="container-x">
        <Divider />
        <m.div style={{ y }} className={nastaliq ? "pb-28 pt-10 md:pb-44 md:pt-16" : "py-10 md:py-16"}>
          <p
            lang={lang}
            aria-hidden="true"
            className={`${nastaliq ? "face-nastaliq" : "ff-display"} select-none leading-none`}
            style={{ fontSize: nastaliq ? "clamp(4.5rem, 17vw, 16rem)" : "clamp(4.5rem, 22vw, 20rem)" }}
          >
            <MaskLine key={lang} whenInView duration={1.3} pad={nastaliq ? "0.5em" : "0.08em"}>
              {t.footer.word}
            </MaskLine>
          </p>
        </m.div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-center gap-x-8">
            <Button href={SITE.github} icon="ne" variant="ghost" external>
              GitHub
            </Button>
            <Button href="#top" icon="down" variant="ghost" className="[&_.arrow]:rotate-180">
              {t.footer.top}
            </Button>
          </div>
          <p dir="ltr" className="ff-meta text-ink-soft">
            {t.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
