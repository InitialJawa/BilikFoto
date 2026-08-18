# Task 2: Buat Static Files (robots.txt & sitemap.xml)

## Status: DONE

## Yang Dikerjakan

Membuat 2 file statis di `public/` untuk SEO & AEO:

### public/robots.txt
- `User-agent: *` — Allow semua crawler
- Explicit Allow untuk AI crawlers: GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot
- Sitemap reference ke `https://bilik-foto.vercel.app/sitemap.xml`

### public/sitemap.xml
- Valid XML dengan namespace `http://www.sitemaps.org/schemas/sitemap/0.9`
- 1 URL: halaman utama (`https://bilik-foto.vercel.app/`)
- `lastmod: 2026-08-18`, `changefreq: weekly`, `priority: 1.0`

## Commit

- **0a96239** — `feat(seo): tambahkan robots.txt dan sitemap.xml`

## Verification

- File `public/robots.txt` ada dengan konten yang benar
- File `public/sitemap.xml` ada dengan XML valid
- Kedua file sudah di-commit

## Catatan

- Sitemap hanya berisi 1 URL (homepage). Saat halaman baru ditambahkan, sitemap perlu di-update secara manual atau otomatis via build script.
- Tidak ada error atau concern.
