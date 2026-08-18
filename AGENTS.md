# AGENTS.md — BilikFoto

## MANDAT WAJIB SEBELUM AKSI

**Baca `graphify-out/GRAPH_REPORT.md` SEBELUM melakukan apa pun.**
Graph ini adalah peta arsitektur project. Tanpa membacanya, kamu akan:
- Menghabiskan token tanpa konteks
- Membuat duplicate code yang sudah ada
- Melanggar pola yang sudah mapan

## Workflow Wajib

### 1. Sebelum Membaca/Mengedit Kode

```bash
# Baca graph report (WAJIB)
cat graphify-out/GRAPH_REPORT.md

# Atau query spesifik
graphify query "apa fungsi X?"
graphify query "apa yang memanggil Y?"
```

### 2. Sebelum Menambah Fitur

1. Baca GRAPH_REPORT.md → cari node/komunitas terkait
2. Query graph → pahami dependensi yang terpengaruh
3. Ikuti pola yang ada di komunitas yang sama
4. Setelah selesai → update graph (lihat bawah)

### 3. Sebelum Fix Bug

1. Query graph → "apa yang terhubung ke [komponen bermasalah]?"
2. Baca source file yang ditunjuk graph
3. Fix sesuai pola yang ada

### 4. Setelah Setiap Perubahan

```bash
# Update graph secara incremental
graphify . --update

# Atau rebuild penuh kalau perubahan besar
graphify .
```

## Struktur Komunitas

| ID | Nama | Isi |
|----|------|-----|
| 0 | Package Config | dependencies, scripts, package.json |
| 1 | Layout & Canvas Rendering | ChooseLayout, ExportModal, PhotoStripCanvas, types |
| 2 | Camera & Audio | CameraBooth, Header, audio utils, App |
| 3 | Customizer & Presets | CustomizerSidebar, presets, stickers |
| 4 | TypeScript Config | tsconfig, compilerOptions |
| 5 | Pattern & Drawing Utils | patterns, canvas drawing functions |
| 6 | Dev Dependencies | devDependencies, tooling |
| 7 | Entry Point & HTML | index.html, main.tsx, fonts |
| 8 | Project Metadata | metadata.json |
| 9 | OpenCode Plugin | .opencode config |
| 10 | Project Docs | project.md |
| 11 | Replace Script | replace.py |
| 12 | Vite Config | vite.config.ts |

## Node Kunci

- **`CustomizationSettings`** (degree 14) — State sentral, hubungi ini dulu kalau ada hubungan dengan kustomisasi
- **`PhotoItem`** (degree 13) — Representasi foto, selalu ada di tiap komponen
- **`FilterType`** (degree 5) — 10 filter visual, dipakai di CameraBooth & canvasRenderer
- **`renderPhotoboothToCanvas()`** (degree 5) — Core rendering engine

## Aturan Kode

- **Bahasa**: Indonesia untuk semua komentar, docs, commit message
- **State**: `CustomizationSettings` adalah source of truth untuk semua kustomisasi
- **Komponen**: Functional components + hooks, tidak ada class component
- **Styling**: Tailwind CSS, tidak ada inline style kecuali dynamic
- **Export**: Selalu named export, kecuali App.tsx (default export)

## Token Efficiency

- **JANGAN** baca semua file secara manual → pakai graph query
- **JANGAN** explore codebase tanpa konteks → baca GRAPH_REPORT.md dulu
- **JANGAN** re-implement sesuatu yang sudah ada → cek graph dulu
- **PAKAI** `graphify query` untuk pertanyaan arsitektur
- **PAKAI** `graphify path "A" "B"` untuk trace dependensi
- **PAKAI** `graphify explain "NodeName"` untuk penjelasan node

## Update Graph

```bash
# Incremental (hanya file yang berubah)
graphify . --update

# Full rebuild
graphify .

# Cluster only (kalau ingin re-cluster tanpa re-extract)
graphify . --cluster-only
```

Graph harus di-update SETIAP kali ada perubahan kode signifikan (fitur baru, refactor, bug fix besar).
