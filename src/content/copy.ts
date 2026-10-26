/**
 * All translatable copy. The `Copy` interface forces every language to
 * provide every key, and copy.test.ts guards the PRD invariants.
 */

export const LANGS = ["id", "en", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export interface HeadlineLine {
  text: string;
  /** Arabic only: render this line in the expressive Nastaliq face. */
  face?: "nastaliq";
}

export interface ProjectCopy {
  category: string;
  summary: string;
  platform: string;
  focus: string;
  imageAlt: string;
}

export interface Copy {
  meta: { title: string; description: string };
  a11y: { skip: string; language: string; newTab: string };
  nav: { works: string; contact: string };
  hero: {
    eyebrow: string;
    headline: readonly HeadlineLine[];
    description: string;
    explore: string;
    github: string;
  };
  works: { label: string; count: string };
  project: {
    labels: { category: string; platform: string; focus: string };
    cta: string;
    cursor: string;
  };
  projects: { lughoti: ProjectCopy; scrabble: ProjectCopy };
  footer: { word: string; face?: "nastaliq"; credit: string; top: string };
}

const id: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — Media Pembelajaran Bahasa Arab & Eksperimen Digital",
    description:
      "Kumpulan proyek akademik dan interaktif yang mengeksplorasi pembelajaran bahasa Arab, teknologi pendidikan, dan desain antarmuka.",
  },
  a11y: { skip: "Lewati ke konten utama", language: "Bahasa", newTab: "(membuka tab baru)" },
  nav: { works: "Karya", contact: "Kontak" },
  hero: {
    eyebrow: "Karya Pilihan · 2026",
    headline: [{ text: "Media Pembelajaran Bahasa Arab" }, { text: "& Eksperimen Digital" }],
    description:
      "Kumpulan proyek akademik dan interaktif yang mengeksplorasi pembelajaran bahasa Arab, teknologi pendidikan, dan desain antarmuka.",
    explore: "Jelajahi Proyek",
    github: "GitHub",
  },
  works: { label: "Karya Pilihan", count: "Proyek" },
  project: {
    labels: { category: "Kategori", platform: "Platform", focus: "Fokus" },
    cta: "Lihat Proyek",
    cursor: "Lihat",
  },
  projects: {
    lughoti: {
      category: "Platform pembelajaran",
      summary:
        "Media pembelajaran bahasa Arab interaktif yang dirancang untuk konteks pendidikan vokasi.",
      platform: "Web",
      focus: "Bahasa Arab",
      imageAlt: "Tampilan antarmuka Lughoti Vokasi",
    },
    scrabble: {
      category: "Gim edukasi",
      summary:
        "Gim kata berhuruf Arab untuk melatih kosakata dan menyusun kata secara interaktif.",
      platform: "Web",
      focus: "Bahasa Arab",
      imageAlt: "Tampilan papan permainan Arabic Scrabble",
    },
  },
  footer: {
    word: "Proyek",
    credit: "© 2026 Sultan Bagus Permadi",
    top: "Kembali ke atas",
  },
};

const en: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — Arabic Learning Media & Digital Experiments",
    description:
      "Selected academic and interactive projects exploring Arabic education, educational technology, and interface design.",
  },
  a11y: { skip: "Skip to main content", language: "Language", newTab: "(opens in a new tab)" },
  nav: { works: "Works", contact: "Contact" },
  hero: {
    eyebrow: "Selected Works · 2026",
    headline: [{ text: "Arabic Learning Media" }, { text: "& Digital Experiments" }],
    description:
      "Selected academic and interactive projects exploring Arabic education, educational technology, and interface design.",
    explore: "Explore Projects",
    github: "GitHub",
  },
  works: { label: "Selected Works", count: "Projects" },
  project: {
    labels: { category: "Category", platform: "Platform", focus: "Focus" },
    cta: "View Project",
    cursor: "View",
  },
  projects: {
    lughoti: {
      category: "Learning platform",
      summary:
        "An interactive Arabic learning medium designed for the context of vocational education.",
      platform: "Web",
      focus: "Arabic language",
      imageAlt: "Interface of Lughoti Vokasi",
    },
    scrabble: {
      category: "Educational game",
      summary:
        "A word game built on Arabic letters, for practising vocabulary and building words interactively.",
      platform: "Web",
      focus: "Arabic language",
      imageAlt: "Game board of Arabic Scrabble",
    },
  },
  footer: {
    word: "Projects",
    credit: "© 2026 Sultan Bagus Permadi",
    top: "Back to top",
  },
};

const ar: Copy = {
  meta: {
    title: "Sultan Bagus Permadi — وسائط تعليم اللغة العربية والتجارب الرقمية",
    description:
      "مجموعة من المشاريع الأكاديمية والتفاعلية التي تستكشف تعليم اللغة العربية، والتقنية التعليمية، وتصميم الواجهات.",
  },
  a11y: { skip: "تخطَّ إلى المحتوى الرئيسي", language: "اللغة", newTab: "(يفتح في تبويب جديد)" },
  nav: { works: "الأعمال", contact: "تواصل" },
  hero: {
    eyebrow: "الأعمال المختارة · 2026",
    headline: [{ text: "وسائط تعليم اللغة العربية" }, { text: "والتجارب الرقمية", face: "nastaliq" }],
    description:
      "مجموعة من المشاريع الأكاديمية والتفاعلية التي تستكشف تعليم اللغة العربية، والتقنية التعليمية، وتصميم الواجهات.",
    explore: "استكشاف المشاريع",
    github: "GitHub",
  },
  works: { label: "الأعمال المختارة", count: "المشاريع" },
  project: {
    labels: { category: "الفئة", platform: "المنصة", focus: "المجال" },
    cta: "عرض المشروع",
    cursor: "عرض",
  },
  projects: {
    lughoti: {
      category: "منصة تعليمية",
      summary: "وسيط تفاعلي لتعلّم اللغة العربية، صُمّم لسياق التعليم المهني.",
      platform: "الويب",
      focus: "اللغة العربية",
      imageAlt: "واجهة مشروع Lughoti Vokasi",
    },
    scrabble: {
      category: "لعبة تعليمية",
      summary: "لعبة كلمات بحروف عربية لتدريب المفردات وتكوين الكلمات بطريقة تفاعلية.",
      platform: "الويب",
      focus: "اللغة العربية",
      imageAlt: "لوحة لعبة Arabic Scrabble",
    },
  },
  footer: {
    word: "مشاريع",
    face: "nastaliq",
    credit: "© 2026 Sultan Bagus Permadi",
    top: "العودة إلى الأعلى",
  },
};

export const copy: Record<Lang, Copy> = { id, en, ar };

export const LANG_LABELS: Record<Lang, string> = { id: "ID", en: "EN", ar: "العربية" };

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}
