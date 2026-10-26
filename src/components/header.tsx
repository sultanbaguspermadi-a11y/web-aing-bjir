"use client";

import { Fragment } from "react";
import { AnimatePresence, m, useScroll, useSpring, useTransform } from "framer-motion";
import { useLang } from "./language-provider";
import { useActiveSection } from "./active-section";
import { LANGS, LANG_LABELS, type Lang } from "@/content/copy";
import { SITE } from "@/content/site";
import { EASE_OUT, originX } from "@/lib/motion";

/** Label that rolls vertically when its text changes (language switch). */
function SwapLabel({ text }: { text: string }) {
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={text}
          className="block"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {text}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

function LanguageSwitch() {
  const { lang, setLang, warm, t } = useLang();
  return (
    // Fixed ID · EN · العربية order in every direction.
    <div role="group" aria-label={t.a11y.language} dir="ltr" className="flex items-center gap-2.5">
      {LANGS.map((code: Lang, i) => {
        const active = code === lang;
        return (
          <Fragment key={code}>
            {i > 0 ? (
              <span aria-hidden="true" className="ff-meta opacity-35">
                ·
              </span>
            ) : null}
            <button
              type="button"
              lang={code}
              aria-pressed={active}
              onClick={() => setLang(code)}
              onPointerEnter={() => warm(code)}
              onFocus={() => warm(code)}
              className="relative cursor-pointer py-1.5"
              style={code === "ar" ? { fontFamily: "var(--font-ar-kufi), var(--font-ar-ui), sans-serif", fontSize: "0.8rem", fontWeight: 500 } : undefined}
            >
              <span className={code === "ar" ? "" : "ff-meta"} style={{ opacity: active ? 1 : 0.55 }}>
                {LANG_LABELS[code]}
              </span>
              <m.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-ink"
                style={{ originX: 0 }}
                initial={false}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              />
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

export function Header() {
  const { t, ready, sign } = useLang();
  const active = useActiveSection();
  const { scrollY, scrollYProgress } = useScroll();
  const bg = useTransform(scrollY, [0, 120], [0, 1]);
  const nameOpacity = useTransform(scrollY, [60, 200], [0, 1]);
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  const inWorks = active === "works" || active === "project-lughoti" || active === "project-scrabble";
  const inContact = active === "contact";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <m.div aria-hidden="true" className="absolute inset-0 border-b border-ink/10 bg-paper" style={{ opacity: bg }} />
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-ink/70"
        style={{ scaleX: progress, originX: originX(sign) }}
      />
      <m.div
        className="container-x relative flex h-16 items-center justify-between gap-6"
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <m.a href="#top" className="ff-meta whitespace-nowrap uppercase" style={{ opacity: nameOpacity }}>
          {SITE.name}
        </m.a>
        <div className="flex items-center gap-8 md:gap-12">
          <nav aria-label="Primary" className="ff-meta hidden items-center gap-8 sm:flex">
            <a href="#works" className="nav-link" aria-current={inWorks ? "true" : undefined}>
              <SwapLabel text={t.nav.works} />
            </a>
            <a href="#contact" className="nav-link" aria-current={inContact ? "true" : undefined}>
              <SwapLabel text={t.nav.contact} />
            </a>
          </nav>
          <LanguageSwitch />
        </div>
      </m.div>
    </header>
  );
}
