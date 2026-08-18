# Task 3: Update index.html dengan Meta Tags Lengkap

**Status:** DONE  
**Commit:** `c082cd0` — seo: update meta tags lengkap (OG, Twitter Card, canonical, theme-color)

## Perubahan

File `index.html` diupdate dari head section minimalis menjadi head section SEO-lengkap:

- **Title** diupdate ke "BilikFoto — Studio Photobooth Online Gratis | Strip Foto Estetik"
- **Description** diupdate ke deskripsi yang lebih detail (10 layout, 56 bingkai, 10 filter, 50+ stiker)
- **Canonical URL** ditambahkan: `https://bilik-foto.vercel.app/`
- **Robots** ditambahkan: `index, follow`
- **Theme-color** ditambahkan: `#0F1012`
- **Language** & **Author** ditambahkan
- **Open Graph** — 7 tag (og:type, og:url, og:title, og:description, og:image, og:locale, og:site_name)
- **Twitter Card** — 4 tag (twitter:card, twitter:title, twitter:description, twitter:image)
- **Apple Touch Icon** ditambahkan
- **Font preconnect & links** tetap dipertahankan
- **Body class** tetap dipertahankan

## Acceptance Criteria

| Criteria | Status |
|----------|--------|
| Title updated | ✓ |
| Open Graph tags present | ✓ (7 tags) |
| Twitter Card tags present | ✓ (4 tags) |
| Canonical URL present | ✓ |
| Theme-color present | ✓ |
| Font preconnect & links preserved | ✓ |
| Body class preserved | ✓ |
| Committed | ✓ |

## Catatan

- Pastikan file `og-image.svg` tersedia di root untuk OG/Twitter image preview
- Pastikan file `apple-touch-icon.png` tersedia di root untuk iOS icon
