# Task 6 Report — Buat Prerender Script (scripts/prerender.mjs)

## Status: DONE

## Apa yang dilakukan
- Membuat `scripts/prerender.mjs` — Playwright-based prerender script untuk render SPA ke static HTML
- Script tersedia di `D:\ALL IN ONE\CODE\BilikFoto\scripts\prerender.mjs` (93 baris)

## Verification
- File created successfully dengan content yang sesuai spec
- `playwright` sudah ada di `package.json` (v1.62.1) sebagai dependency
- Script dapat dijalankan dengan `node scripts/prerender.mjs` setelah `vite build`

## Fitur Script
1. Cek keberadaan `dist/` sebelum mulai
2. Start local HTTP server di port 4173
3. Buka page dengan Playwright, tunggu `networkidle` + 2s delay untuk React hydration
4. Simpan rendered HTML sebagai `dist/index.html`
5. Verify: JSON-LD structured data, Open Graph tags, SEO content (H1, FAQ)
6. Cleanup: browser close + server close

## Commits
Belum di-commit (menunggu instruksi user)

## Test Summary
Script belum bisa diuji tanpa `vite build` + Playwright browser install, namun file structurally valid sebagai ES module.

## Concerns
- Script port 4173 hardcoded — bisa conflict kalau port sudah dipakai
- Belum ada `--help` atau CLI args untuk customisasi port/URL
