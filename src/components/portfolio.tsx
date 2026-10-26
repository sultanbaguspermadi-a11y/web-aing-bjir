"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-media";
import { LanguageProvider, useLang, type FontProbe } from "./language-provider";
import { ActiveSectionProvider } from "./active-section";
import { CursorProvider } from "./cursor-label";
import { Header } from "./header";
import { Hero } from "./hero";
import { Works } from "./works";
import { Footer } from "./footer";
import { ProjectCounter } from "./project-counter";
import { EASE_IN, EASE_OUT } from "@/lib/motion";

/**
 * Language-switch choreography (total about 500ms):
 *   out (180ms) -> swap lang/dir/fonts -> in (340ms) -> settle
 * Arabic enters from the right, LTR from the left; ID <-> EN shifts vertically.
 */
function ContentTransition({ children }: { children: React.ReactNode }) {
  const { phase, shift } = useLang();
  const reduced = useReducedMotionSafe();
  const animate =
    phase === "out"
      ? { opacity: 0, x: shift.outX, y: shift.outY, transition: { duration: 0.18, ease: EASE_IN } }
      : phase === "in"
        ? {
            opacity: [0, 1],
            x: [shift.inX, 0],
            y: [shift.inY, 0],
            transition: { duration: reduced ? 0.2 : 0.34, ease: EASE_OUT },
          }
        : { opacity: 1, x: 0, y: 0, transition: { duration: 0 } };

  return (
    <m.div initial={false} animate={animate}>
      {children}
    </m.div>
  );
}

function Page() {
  const { t } = useLang();
  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skip}
      </a>
      <Header />
      <ProjectCounter />
      <ContentTransition>
        <main id="main">
          <Hero />
          <Works />
        </main>
        <Footer />
      </ContentTransition>
    </>
  );
}

export function Portfolio({ arabicFonts }: { arabicFonts: FontProbe[] }) {
  return (
    <LanguageProvider arabicFonts={arabicFonts}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <ActiveSectionProvider>
            <CursorProvider>
              <Page />
            </CursorProvider>
          </ActiveSectionProvider>
        </MotionConfig>
      </LazyMotion>
    </LanguageProvider>
  );
}
