<div align="center">

# BilikFoto

**Studio Photobooth Strip Online & Kustomisasi**

Aplikasi web photobooth digital estetik ala Korea & vintage dengan kustomisasi strip, filter retro, stiker, teks kustom, dan download instan kualitas HD.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Fitur

- **10+ Layout** — Strip 4/3/2, Grid 2x2/2x3, Polaroid, Film 35mm, Heart, Editorial
- **10 Filter Retro** — B&W Noir, Vintage 90s, Golden Hour, Cyber Y2K, Film 35mm, Soft Blush, dll
- **Kamera Langsung** — Webcam capture dengan countdown & shutter sound
- **Stiker & Doodle** — Koleksi stiker SVG/emoji + drawing tool interaktif
- **Teks Kustom** — Font opsional (Plus Jakarta Sans, Caveat, VT323), warna, posisi
- **Ekspor HD** — Download strip sebagai PNG kualitas tinggi atau GIF animated
- **Audio Feedback** — Click, countdown beep, sticker pop, success chime
- **Multi Bahasa Logo** — ENG, KOR, CN, IDN
- **Frame Texture** — Paper, grain, linen, glitter, dots, diagonal

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build | Vite 6 |
| Animasi | Motion (Framer Motion) |
| Canvas | HTML5 Canvas API |
| AI | Google Gemini API |
| Icons | Lucide React |

## Getting Started

```bash
# Clone
git clone <repo-url>
cd BilikFoto

# Install
npm install

# Jalankan
npm run dev
```

Buka `http://localhost:3000` di browser.

## Environment Variables

```bash
# .env
GEMINI_API_KEY=your_gemini_api_key    # Untuk fitur AI (opsional)
APP_URL=http://localhost:3000          # URL aplikasi
```

## Perintah

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan dev server (port 3000) |
| `npm run build` | Build untuk produksi |
| `npm run preview` | Preview build hasil |
| `npm run lint` | Type check dengan TypeScript |
| `npm run clean` | Hapus dist & server.js |

## Arsitektur

```
src/
├── App.tsx                    # Root component, state management
├── main.tsx                   # Entry point
├── types.ts                   # TypeScript interfaces & types
├── components/
│   ├── Header.tsx             # Top bar + navigation
│   ├── ChooseLayout.tsx       # Layout selection grid
│   ├── CameraBooth.tsx        # Webcam capture + countdown
│   ├── CustomizerSidebar.tsx  # Sidebar kustomisasi (tabs)
│   ├── PhotoStripCanvas.tsx   # Canvas rendering + interactive tools
│   └── ExportModal.tsx        # Download/export dialog
├── utils/
│   ├── audio.ts               # Sound effects (click, beep, pop, chime)
│   ├── canvasRenderer.ts      # Core canvas drawing engine
│   └── gifEncoder.ts          # Animated GIF generation
└── data/
    ├── presets.ts             # Layout catalog, font options, defaults
    ├── presetStickers.ts      # Stiker collection & categories
    └── patterns.ts            # Procedural pattern generation
```

### Alur Aplikasi

```
Layout Selection → Camera Booth → Customizer Sidebar → Canvas Preview → Export
       ↓                ↓               ↓                    ↓            ↓
  ChooseLayout    CameraBooth    CustomizerSidebar    PhotoStripCanvas  ExportModal
```

### Core Abstractions

| Node | Degree | Fungsi |
|------|--------|--------|
| `CustomizationSettings` | 14 | State sentral — semua kustomisasi |
| `PhotoItem` | 13 | Representasi foto di strip |
| `compilerOptions` | 15 | TypeScript config (build) |
| `FilterType` | 5 | 10 filter visual |
| `renderPhotoboothToCanvas()` | 5 | Render strip ke canvas |

## License

Private — All rights reserved.
