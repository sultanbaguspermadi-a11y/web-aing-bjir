"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { copy, dirOf, isLang, type Copy, type Lang } from "@/content/copy";
import { useIsomorphicLayoutEffect } from "@/lib/use-media";

export type Phase = "idle" | "out" | "in";

export interface Shift {
  outX: number;
  outY: number;
  inX: number;
  inY: number;
}

export interface FontProbe {
  family: string;
  weight: string;
}

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  /** +1 for LTR, -1 for RTL. Multiply horizontal offsets by this. */
  sign: 1 | -1;
  t: Copy;
  /** False until the stored/browser language has been resolved on the client. */
  ready: boolean;
  phase: Phase;
  shift: Shift;
  setLang: (next: Lang) => void;
  /** Start downloading the fonts for a language (hover/focus on the switcher). */
  warm: (next: Lang) => void;
}

const STORAGE_KEY = "sbp-lang";
const OUT_MS = 180;
const IN_MS = 340;
const FONT_TIMEOUT_MS = 600;
const SHIFT_PX = 14;
const AR_SAMPLE = "مشاريع تعليم اللغة العربية";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyDocument(lang: Lang, title: string): void {
  const el = document.documentElement;
  el.lang = lang;
  el.dir = dirOf(lang);
  document.title = title;
}

function readStored(): Lang | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function persist(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* non-fatal */
  }
}

function detectInitial(): Lang {
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromQuery)) return fromQuery;
  const stored = readStored();
  if (stored) return stored;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "id" || base === "in") return "id";
    if (base === "ar") return "ar";
    if (base === "en") return "en";
  }
  return "en";
}

export function LanguageProvider({
  arabicFonts,
  children,
}: {
  arabicFonts: FontProbe[];
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("id");
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shift, setShift] = useState<Shift>({ outX: 0, outY: 0, inX: 0, inY: 0 });

  const langRef = useRef<Lang>("id");
  const switching = useRef(false);
  const mounted = useRef(true);
  const fontsPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /** Resolves when Arabic faces are loaded, or after a timeout (never blocks the UI). */
  const loadArabicFonts = useCallback((): Promise<void> => {
    if (!("fonts" in document)) return Promise.resolve();
    if (!fontsPromise.current) {
      const load = Promise.all(
        arabicFonts.map((f) => document.fonts.load(`${f.weight} 1em ${f.family}`, AR_SAMPLE)),
      ).then(() => undefined);
      fontsPromise.current = load.catch(() => undefined);
    }
    return Promise.race([fontsPromise.current, wait(FONT_TIMEOUT_MS)]);
  }, [arabicFonts]);

  const warm = useCallback(
    (next: Lang) => {
      if (next === "ar") void loadArabicFonts();
    },
    [loadArabicFonts],
  );

  const commit = useCallback((next: Lang) => {
    langRef.current = next;
    applyDocument(next, copy[next].meta.title);
    setLangState(next);
  }, []);

  // Resolve the initial language once, before first paint of visible content.
  useIsomorphicLayoutEffect(() => {
    const initial = detectInitial();
    const finish = () => {
      if (!mounted.current) return;
      commit(initial);
      setReady(true);
    };
    if (initial === "ar") void loadArabicFonts().then(finish);
    else finish();
  }, [commit, loadArabicFonts]);

  const setLang = useCallback(
    (next: Lang) => {
      if (next === langRef.current || switching.current) return;
      persist(next);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (next === "ar") void loadArabicFonts().then(() => mounted.current && commit(next));
        else commit(next);
        return;
      }

      switching.current = true;
      const from = langRef.current;
      const toRtl = next === "ar";
      const fromRtl = from === "ar";

      // LTR -> AR: old content leaves to the left, Arabic enters from the right.
      // AR -> LTR: mirrored. ID <-> EN: a small vertical shift only.
      if (toRtl && !fromRtl) setShift({ outX: -SHIFT_PX, outY: 0, inX: SHIFT_PX, inY: 0 });
      else if (!toRtl && fromRtl) setShift({ outX: SHIFT_PX, outY: 0, inX: -SHIFT_PX, inY: 0 });
      else setShift({ outX: 0, outY: -8, inX: 0, inY: 10 });

      setPhase("out");
      const fonts = next === "ar" ? loadArabicFonts() : Promise.resolve();
      void Promise.all([fonts, wait(OUT_MS)]).then(() => {
        if (!mounted.current) return;
        commit(next);
        setPhase("in");
        void wait(IN_MS).then(() => {
          if (!mounted.current) return;
          setPhase("idle");
          switching.current = false;
        });
      });
    },
    [commit, loadArabicFonts],
  );

  const value = useMemo<LanguageContextValue>(() => {
    const dir = dirOf(lang);
    return {
      lang,
      dir,
      sign: dir === "ltr" ? 1 : -1,
      t: copy[lang],
      ready,
      phase,
      shift,
      setLang,
      warm,
    };
  }, [lang, ready, phase, shift, setLang, warm]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
