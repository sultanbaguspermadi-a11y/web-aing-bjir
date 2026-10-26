# Sultan Bagus Permadi — Trilingual Portfolio

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion (`LazyMotion` + `domAnimation`, tanpa GSAP).
Bahasa: Indonesia · English · العربية (RTL native). Tepat dua proyek: **Lughoti Vokasi** dan **Arabic Scrabble**.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi URL asli (GitHub + dua proyek)
npm run dev                  # http://localhost:3000
npm run build && npm start   # produksi
npm run typecheck && npm test
```

## Yang WAJIB kamu ganti

1. **Screenshot proyek.** `public/projects/*.svg` hanyalah gambar sementara (wireframe abstrak).
   Taruh screenshot asli, lalu ubah `image.src` di `src/content/site.ts`
   (mis. `/projects/lughoti-vokasi.png`). SVG di-render `unoptimized`; PNG/JPG/WebP otomatis dioptimasi `next/image`.
   Rasio: Lughoti `16 / 9.4`, Scrabble `4 / 3.2` (ubah di `src/components/projects.tsx`).
2. **URL.** `.env.local`: `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LUGHOTI_URL`, `NEXT_PUBLIC_SCRABBLE_URL`, `NEXT_PUBLIC_SITE_URL`.
3. **Deskripsi proyek** (`src/content/copy.ts` → `projects`). Teks saat ini ditulis dari nama proyek saja
   (mis. "konteks pendidikan vokasi", platform "Web"); sesuaikan dengan fakta sebenarnya, di tiga bahasa.
4. **Aksen Scrabble** `#E9B44C` dipilih sebagai pasangan `#8ECDF4` (PRD tidak menentukan). Ubah di `site.ts`.

## Struktur

```
src/content/copy.ts      semua teks 3 bahasa (tipe `Copy` memaksa kelengkapan)
src/content/site.ts      data non-terjemahan: nama, 2 proyek, aksen, URL
src/app/fonts.ts         font lokal (OFL); Latin di-preload, Arab TIDAK di-preload
src/app/globals.css      peran tipografi, aturan RTL, hover/roll/button, reduced-motion
src/components/language-provider.tsx   state bahasa + koreografi pergantian (~520 ms) + tunggu font Arab
src/components/{hero,works,projects,project-image,footer,header}.tsx
```

## Sistem tipografi Arab

| Peran | Font | Dipakai di |
|---|---|---|
| UI / body | IBM Plex Sans Arabic 400/500/600 | navigasi, body, tombol, headline baris 1 |
| Geometris | Noto Kufi Arabic 500/700 | metadata, indeks, switcher, tile |
| Literer | Noto Naskh Arabic 400 | ringkasan proyek |
| Ekspresif | Noto Nastaliq Urdu 400 | baris kedua headline hero, kata besar footer |
| Tulisan tangan | Aref Ruqaa 400 (gaya Ruq'ah) | kategori proyek (anotasi pendek) |

Aturan yang dijaga: Arab tidak pernah dipecah per huruf (hanya per baris/kata), `letter-spacing` selalu 0 di mode Arab,
Nastaliq tidak pernah untuk paragraf.

## Catatan teknis

- Pemicu `whileInView` ada di pembungkus yang tidak ter-clip: Chrome menghitung `clip-path`/`overflow` target pada
  IntersectionObserver, sehingga elemen yang sepenuhnya ter-clip tidak pernah dianggap "terlihat".
- Reduced-motion: target `initial/animate` sama untuk semua pengguna (aman hidrasi). `MotionConfig reducedMotion="user"`
  membuat transform instan, CSS menghapus `clip-path`, scroll-linked dimatikan; tinggal fade opacity.
- Metadata SSR berbahasa Indonesia (sesuai konten SSR); `document.title` mengikuti bahasa aktif di client.
  Untuk SEO per bahasa yang sempurna, pindahkan ke route `/id`, `/en`, `/ar`.
- Lisensi font: `src/fonts/LICENSE-*.txt` (SIL OFL).
