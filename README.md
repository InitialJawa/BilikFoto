# BilikFoto

Studio photobooth strip online — gratis, jalan di browser, 100% privat.

## Fitur Utama

**Layout & Template**
- 10 template: Strip klasik 4/3/2, Grid 2×2 & 2×3, Polaroid single/duo, Film 35mm, Heart duo, Editorial magazine
- 56 bingkai warna: pastel solid, plaid/tartan, checkerboard, gingham, animal print, floral, marble, metallic foil, holographic
- 10 filter: Normal, Noir B&W, Vintage 90s, Golden Hour, Cyber Y2K, Film 35mm, Soft Blush Korea, Muted Fade, Sepia, Vignette
- 50+ stiker: emoji, badge text Indo/Korea/Y2K/Vintage, koleksi viral photobooth

**Kamera & Capture**
- Webcam langsung (depan/belakang) + countdown 3-2-1 + shutter sound
- Upload dari galeri HP/laptop
- Sample foto aesthetic biar bisa coba langsung tanpa kamera

**Kustomisasi**
- Sidebar tab: Bingkai, Filter, Stiker, Teks, Doodle
- Font: Plus Jakarta Sans (clean), Caveat (handwriting), VT323 (retro pixel)
- Drawing tool: warna, ketebalan, undo/redo
- Frame texture: paper, grain, linen, glitter, dots, diagonal

**Ekspor**
- PNG HD 300 DPI (siap cetak)
- JPEG, copy ke clipboard, cetak langsung
- Motion Strip → animasi WebM
- Logo bahasa: ENG / KOR / CN / IDN

**Privasi**
- Semua proses di browser, **tidak ada upload ke server manapun**
- Foto tidak pernah keluar dari device

## Tech Stack

```
React 19 + TypeScript
Vite 6
Tailwind CSS 4
Motion (Framer Motion)
HTML5 Canvas API
Lucide React (icons)
Google Gemini API (opsional, untuk AI features)
```

## Quick Start

```bash
git clone https://github.com/InitialJawa/BilikFoto.git
cd BilikFoto
npm install
npm run dev
```

Buka http://localhost:3000

## Scripts

| Command | Apa yang dilakukan |
|---------|-------------------|
| `npm run dev` | Dev server port 3000 |
| `npm run build` | Build production ke `dist/` |
| `npm run build:seo` | Build + prerender untuk SEO (Playwright) |
| `npm run preview` | Preview hasil build |
| `npm run lint` | TypeScript check (`tsc --noEmit`) |
| `npm run clean` | Hapus `dist/` dan `server.js` |

## Environment

```bash
# .env (opsional)
GEMINI_API_KEY=xxx    # Kalau mau fitur AI
APP_URL=http://localhost:3000
```

## Struktur Project

```
src/
├── App.tsx                 # Root, state management, step navigation
├── main.tsx                # Entry point
├── types.ts                # Semua type: LayoutType, FilterType, PhotoItem, CustomizationSettings, dll
├── components/
│   ├── Header.tsx          # Top bar + nav step
│   ├── ChooseLayout.tsx    # Grid pilih template
│   ├── CameraBooth.tsx     # Webcam capture + countdown
│   ├── CustomizerSidebar.tsx  # Sidebar kustomisasi (5 tab)
│   ├── PhotoStripCanvas.tsx   # Canvas rendering + interactive tools
│   └── ExportModal.tsx     # Dialog download/print
├── utils/
│   ├── audio.ts            # Sound effects (click, beep, pop, chime)
│   ├── canvasRenderer.ts   # Core drawing engine (renderPhotoboothToCanvas)
│   └── gifEncoder.ts       # Animated GIF / WebM generation
└── data/
    ├── presets.ts          # Layout catalog, font options, default settings
    ├── presetStickers.ts   # Koleksi stiker & kategori
    └── patterns.ts         # Procedural pattern generation
```

## Alur User

```
Pilih Layout → Ambil Foto → Kustomisasi → Preview Canvas → Ekspor
     ↓              ↓            ↓              ↓            ↓
 ChooseLayout  CameraBooth  CustomizerSidebar  PhotoStripCanvas  ExportModal
```

State sentral: `CustomizationSettings` (types.ts) — single source of truth untuk semua kustomisasi.

## SEO & AEO

Project sudah include:
- Meta tags lengkap (Open Graph, Twitter Card, canonical)
- JSON-LD structured data: SoftwareApplication, FAQPage, WebSite
- Prerendering via Playwright (`npm run build:seo`)
- `robots.txt` & `sitemap.xml` di `public/`
- SEO content component (hidden untuk user, visible untuk crawler)

Deploy ke Vercel → `git push` ke branch connected.

---

**Private project** — All rights reserved.