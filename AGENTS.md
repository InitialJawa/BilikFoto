# AGENTS.md — BilikFoto

## Wajib Baca Dulu

**Baca `graphify-out/GRAPH_REPORT.md` sebelum ngapa-ngapain.**

Graph ini peta arsitektur project. Tanpa baca ini:
- Habis token buat eksplorasi manual
- Bikin code duplicate yang udah ada
- Melanggar pola project

## Workflow

### Sebelum Baca/Edit Code
```bash
cat graphify-out/GRAPH_REPORT.md
# atau query spesifik
graphify query "apa fungsi X?"
graphify query "apa yang memanggil Y?"
```

### Sebelum Tambah Fitur
1. Baca GRAPH_REPORT.md → cari komunitas/node terkait
2. `graphify query` → pahami dependensi
3. Ikuti pola di komunitas yang sama
4. Selesai → update graph (lihat bawah)

### Sebelum Fix Bug
1. `graphify query "apa yang terhubung ke [komponen bermasalah]?"`
2. Baca file yang ditunjuk graph
3. Fix pakai pola existing

### Setelah Perubahan Signifikan
```bash
graphify . --update    # incremental (file yang berubah)
graphify .             # full rebuild
```

---

## Ringkas Arsitektur (dari graphify)

**17 Komunitas:**

| ID | Nama | Isi Utama |
|----|------|-----------|
| 0 | Package Config | deps, scripts, package.json |
| 1 | Layout & Canvas Rendering | ChooseLayout, ExportModal, PhotoStripCanvas, types |
| 2 | Camera & Audio | CameraBooth, Header, audio utils, App |
| 3 | Customizer & Presets | CustomizerSidebar, presets, stickers |
| 4 | TypeScript Config | tsconfig, compilerOptions |
| 5 | Pattern & Drawing Utils | patterns, canvas drawing functions |
| 6 | Dev Dependencies | devDeps, tooling |
| 7 | Entry Point & HTML | index.html, main.tsx, fonts |
| 8 | Project Metadata | metadata.json |
| 9 | OpenCode Plugin | .opencode config |
| 10 | Project Docs | project.md |
| 11 | Replace Script | replace.py |
| 12 | Vite Config | vite.config.ts |
| 13-16 | (SEO baru) | SEOContent, prerender, og-image, plan docs |

**Node Kunci (hubungi ini dulu):**
- `CustomizationSettings` (deg 14) — state sentral kustomisasi
- `PhotoItem` (deg 13) — representasi foto
- `FilterType` (deg 5) — 10 filter visual
- `renderPhotoboothToCanvas()` (deg 5) — core rendering engine

---

## Aturan Code

- **Bahasa**: Indonesia (komentar, docs, commit message)
- **State**: `CustomizationSettings` = source of truth
- **Komponen**: Functional + hooks only, no class component
- **Styling**: Tailwind CSS, inline style hanya untuk dynamic values
- **Export**: Named export, kecuali `App.tsx` (default)

---

## Token Efficiency

- **Jangan** baca file manual → pakai `graphify query`
- **Jangan** explore tanpa konteks → baca GRAPH_REPORT.md dulu
- **Jangan** re-implement → cek graph dulu
- **Pakai** `graphify query` untuk pertanyaan arsitektur
- **Pakai** `graphify path "A" "B"` untuk trace dependensi
- **Pakai** `graphify explain "NodeName"` untuk penjelasan node

---

## Update Graph

```bash
graphify . --update      # incremental (default)
graphify .               # full rebuild
graphify . --cluster-only # re-cluster tanpa re-extract
```

Update graph **wajib** setelah: fitur baru, refactor, bug fix besar.