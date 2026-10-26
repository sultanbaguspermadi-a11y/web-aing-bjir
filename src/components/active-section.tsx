"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const SECTION_IDS = ["top", "works", "project-lughoti", "project-scrabble", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Most specific section wins when several overlap the viewport centre. */
const PRIORITY: readonly SectionId[] = ["project-scrabble", "project-lughoti", "contact", "works", "top"];

const ActiveContext = createContext<SectionId | null>(null);

export function useActiveSection(): SectionId | null {
  return useContext(ActiveContext);
}

/** One IntersectionObserver for the whole page (no scroll listeners). */
export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const visible = new Set<SectionId>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setActive(PRIORITY.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return <ActiveContext.Provider value={active}>{children}</ActiveContext.Provider>;
}
