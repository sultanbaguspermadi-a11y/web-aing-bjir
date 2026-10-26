"use client";

import { m } from "framer-motion";
import { useLang } from "./language-provider";
import { CountUp, Divider } from "./primitives";
import { LughotiProject, ScrabbleProject } from "./projects";
import { PROJECTS } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

export function Works() {
  const { t, sign } = useLang();
  const [lughoti, scrabble] = PROJECTS;

  return (
    <section id="works" aria-labelledby="works-title" className="relative pt-28 md:pt-40">
      <div className="container-x">
        <div className="ff-meta flex items-end justify-between gap-6">
          {/* Label slides horizontally, from the inline-start edge. */}
          <m.h2
            id="works-title"
            className="ff-meta"
            initial={{ opacity: 0, x: -36 * sign }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            {t.works.label}
          </m.h2>
          <p className="flex items-baseline gap-2">
            <CountUp to={PROJECTS.length} />
            <span>{t.works.count}</span>
            <span className="sr-only">{PROJECTS.length}</span>
          </p>
        </div>
        <Divider className="mt-4" />
      </div>

      <LughotiProject project={lughoti} />
      <ScrabbleProject project={scrabble} />
    </section>
  );
}
