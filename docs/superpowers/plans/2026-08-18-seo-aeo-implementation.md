# SEO & AEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agar BilikFoto muncul di pencarian Google DAN AI search engines (ChatGPT, Perplexity, Google AI Overview) dengan prerendering build-time.

**Architecture:** Vite SPA + Playwright prerendering. Konten SEO di-render sebagai HTML statis di bawah React app — visible untuk crawler, hidden untuk user. JSON-LD structured data di-inject saat build time.

**Tech Stack:** Vite 6, React 19, Playwright (prerender), JSON-LD (Schema.org)

## Global Constraints

- Domain: `https://bilik-foto.vercel.app/`
- Bahasa: Indonesia 100% (termasuk semua konten SEO)
- Deploy: Vercel (static files)
- Tidak migrasi framework — tetap Vite + React SPA
- Tidak ada perubahan ke App logic yang ada

---

## File Structure

```
BilikFoto/
├── index.html                          (MODIFY — meta tags lengkap)
├── package.json                        (MODIFY — tambah playwright, build script)
├── vite.config.ts                      (MODIFY — tidak berubah untuk prerender)
├── public/
│   ├── favicon.svg                     (EXISTING)
│   ├── logo.svg                        (EXISTING)
│   ├── robots.txt                      (CREATE)
│   ├── sitemap.xml                     (CREATE)
│   └── og-image.png                    (CREATE — placeholder)
├── scripts/
│   └── prerender.mjs                   (CREATE — Playwright prerender script)
└── src/
    ├── App.tsx                         (MODIFY — render SEOContent)
    └── components/
        └── SEOContent.tsx              (CREATE — komponen SEO content)
```

---

### Task 1: Tambah Dependencies & Build Script

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run build:seo` command

- [ ] **Step 1: Install Playwright**

```bash
npm install playwright --save-dev
```

- [ ] **Step 2: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 3: Update package.json scripts**

Tambahkan script `build:seo` di `package.json`:

```json
{
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "build:seo": "vite build && node scripts/prerender.mjs",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: tambah playwright untuk prerendering SEO"
```

---

### Task 2: Buat Static Files (robots.txt & sitemap.xml)

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Produces: robots.txt dan sitemap.xml yang bisa diakses di `/robots.txt` dan `/sitemap.xml`

- [ ] **Step 1: Buat robots.txt**

Buat file `public/robots.txt`:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://bilik-foto.vercel.app/sitemap.xml
```

- [ ] **Step 2: Buat sitemap.xml**

Buat file `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bilik-foto.vercel.app/</loc>
    <lastmod>2026-08-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt public/sitemap.xml
git commit -m "feat: tambah robots.txt dan sitemap.xml untuk SEO"
```

---

### Task 3: Update index.html dengan Meta Tags Lengkap

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: HTML head dengan OG tags, Twitter Card, canonical, theme-color

- [ ] **Step 1: Baca index.html yang ada**

Baca file `index.html` untuk memahami struktur saat ini.

- [ ] **Step 2: Update head section**

Ganti seluruh `<head>` section di `index.html` dengan versi yang sudah dioptimasi:

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Basics -->
    <title>BilikFoto — Studio Photobooth Online Gratis | Strip Foto Estetik</title>
    <meta name="description" content="Buat strip foto photobooth online gratis di browser. Pilih dari 10 layout, 56 bingkai, 10 filter, dan 50+ stiker. Ekspor HD 300DPI tanpa upload server." />
    <link rel="canonical" href="https://bilik-foto.vercel.app/" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#0F1012" />
    <meta name="language" content="Indonesian" />
    <meta name="author" content="BilikFoto" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bilik-foto.vercel.app/" />
    <meta property="og:title" content="BilikFoto — Studio Photobooth Online Gratis" />
    <meta property="og:description" content="Buat strip foto photobooth online gratis di browser. 10 layout, 56 bingkai, 10 filter, ekspor HD." />
    <meta property="og:image" content="https://bilik-foto.vercel.app/og-image.png" />
    <meta property="og:locale" content="id_ID" />
    <meta property="og:site_name" content="BilikFoto" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="BilikFoto — Studio Photobooth Online Gratis" />
    <meta name="twitter:description" content="Buat strip foto photobooth online gratis di browser. 10 layout, 56 bingkai, 10 filter, ekspor HD." />
    <meta name="twitter:image" content="https://bilik-foto.vercel.app/og-image.png" />

    <!-- Favicon & Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=VT323&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#121316] text-[#F3F4F6] antialiased selection:bg-rose-500 selection:text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: tambah meta tags lengkap (OG, Twitter, canonical, theme-color)"
```

---

### Task 4: Buat SEO Content Component

**Files:**
- Create: `src/components/SEOContent.tsx`

**Interfaces:**
- Produces: React component yang render konten SEO (hero, features, FAQ, cara kerja)
- Component harus visible untuk crawler, hidden untuk user dengan CSS

- [ ] **Step 1: Buat file SEOContent.tsx**

Buat file `src/components/SEOContent.tsx`:

```tsx
/**
 * SEOContent — Komponen konten SEO yang visible untuk crawler tapi hidden untuk user.
 * Berisi: Hero section, Fitur, Cara Kerja, FAQ, Trust Signals.
 * Semua konten di-render sebagai HTML statis untuk AEO extraction.
 */

export function SEOContent() {
  return (
    <div
      className="seo-content"
      aria-hidden="false"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {/* Hero Section */}
      <section>
        <h1>BilikFoto — Studio Photobooth Online Gratis</h1>
        <blockquote>
          BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda — 
          pilih layout, ambil foto via webcam, kustomisasi dengan 56 bingkai dan 10 filter, 
          lalu ekspor sebagai strip foto HD tanpa perlu upload ke server.
        </blockquote>
        <a href="#app">Mulai Sekarang — Gratis</a>
      </section>

      {/* Fitur Utama */}
      <section>
        <h2>Fitur Utama BilikFoto</h2>
        <table>
          <thead>
            <tr>
              <th>Fitur</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 Layout Template</td>
              <td>Classic Strip 4, Strip 3, Grid 2x2, Grid 2x3, Polaroid Single, Polaroid Duo, Film Roll 35mm, Heart Duo, Editorial Magazine, dan lainnya</td>
            </tr>
            <tr>
              <td>56 Bingkai Warna</td>
              <td>Pastel solid, plaid/tartan, checkerboard, gingham, animal print, floral, marble, metallic foil, holographic</td>
            </tr>
            <tr>
              <td>10 Filter Foto</td>
              <td>Normal, Noir B&W, Vintage 90s, Golden Hour, Y2K Cyber, Film 35mm, Soft Blush Korea, Muted Fade, Sepia, Vignette</td>
            </tr>
            <tr>
              <td>50+ Stiker</td>
              <td>Emoji, badge text Indonesia, Korea, Y2K, Vintage, Photobooth viral collection</td>
            </tr>
            <tr>
              <td>Ekspor HD</td>
              <td>PNG 300DPI, JPEG, cetak langsung, copy ke clipboard, Motion Strip (animasi WebM)</td>
            </tr>
            <tr>
              <td>100% Privat</td>
              <td>Semua proses di browser, tanpa upload ke server manapun</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Cara Kerja */}
      <section>
        <h2>Cara Membuat Strip Foto di BilikFoto</h2>
        <ol>
          <li>
            <strong>Pilih Layout</strong> — Pilih dari 10 template strip photobooth termasuk gaya Korea Life4Cuts, Retro Film, dan Editorial Magazine.
          </li>
          <li>
            <strong>Ambil Foto</strong> — Gunakan webcam depan atau belakang, atau upload foto dari galeri HP/laptop.
          </li>
          <li>
            <strong>Kustomisasi</strong> — Tambah bingkai warna, terapkan filter, tempel stiker lucu, tulis teks, dan gambar doodle.
          </li>
          <li>
            <strong>Ekspor & Bagikan</strong> — Download sebagai PNG HD (300DPI), cetak langsung, atau buat animasi Motion Strip.
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section>
        <h2>Pertanyaan yang Sering Ditanyakan</h2>

        <article>
          <h3>Apa itu BilikFoto?</h3>
          <p>
            BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda. 
            Pilih dari 10 layout template, ambil foto via webcam, kustomisasi dengan 56 bingkai 
            dan 10 filter, lalu ekspor sebagai strip foto HD.
          </p>
        </article>

        <article>
          <h3>Apakah BilikFoto benar-benar gratis?</h3>
          <p>
            Ya, BilikFoto sepenuhnya gratis. Tidak ada biaya tersembunyi, watermark, atau langganan. 
            Semua fitur bisa digunakan tanpa batas.
          </p>
        </article>

        <article>
          <h3>Apakah foto saya diupload ke server?</h3>
          <p>
            Tidak. Semua proses di BilikFoto berjalan 100% di browser Anda. 
            Tidak ada foto yang diupload atau disimpan di server manapun.
          </p>
        </article>

        <article>
          <h3>Bagaimana cara membuat strip foto di BilikFoto?</h3>
          <p>
            Pilih layout template, ambil foto via webcam atau upload dari galeri, 
            kustomisasi dengan bingkai filter dan stiker, lalu ekspor sebagai PNG HD atau JPEG.
          </p>
        </article>

        <article>
          <h3>Format apa saja yang bisa di-export?</h3>
          <p>
            BilikFoto mendukung export PNG HD (300DPI), JPEG, cetak langsung, 
            copy ke clipboard, dan Motion Strip (animasi WebM).
          </p>
        </article>

        <article>
          <h3>Apakah BilikFoto bisa dipakai di HP?</h3>
          <p>
            Ya, BilikFoto berjalan di browser dan responsif di semua perangkat 
            termasuk smartphone, tablet, dan laptop.
          </p>
        </article>
      </section>

      {/* Trust Signals */}
      <section>
        <h2>Mengapa BilikFoto?</h2>
        <ul>
          <li>100% Privat & Lokal di Browser — Tidak ada foto yang离开 dari perangkat Anda</li>
          <li>Tanpa Upload Server — Semua proses terjadi di browser Anda sendiri</li>
          <li>Gratis Sepenuhnya — Tanpa watermark, tanpa langganan, tanpa batasan</li>
          <li>Hasil HD 300DPI — Kualitas cetak profesional langsung dari browser</li>
        </ul>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BilikFoto",
              "description": "Studio photobooth online gratis yang berjalan 100% di browser Anda",
              "url": "https://bilik-foto.vercel.app/",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR"
              },
              "featureList": [
                "10 Layout Template Photobooth",
                "56 Bingkai Warna dan Pola",
                "10 Filter Foto",
                "50+ Stiker Lucu",
                "Ekspor HD 300DPI",
                "100% Privat di Browser"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Apa itu BilikFoto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda. Pilih dari 10 layout template, ambil foto via webcam, kustomisasi dengan 56 bingkai dan 10 filter, lalu ekspor sebagai strip foto HD."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Apakah BilikFoto benar-benar gratis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ya, BilikFoto sepenuhnya gratis. Tidak ada biaya tersembunyi, watermark, atau langganan. Semua fitur bisa digunakan tanpa batas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Apakah foto saya diupload ke server?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tidak. Semua proses di BilikFoto berjalan 100% di browser Anda. Tidak ada foto yang diupload atau disimpan di server manapun."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Bagaimana cara membuat strip foto di BilikFoto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pilih layout template, ambil foto via webcam atau upload dari galeri, kustomisasi dengan bingkai filter dan stiker, lalu ekspor sebagai PNG HD atau JPEG."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Format apa saja yang bisa di-export?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BilikFoto mendukung export PNG HD (300DPI), JPEG, cetak langsung, copy ke clipboard, dan Motion Strip (animasi WebM)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Apakah BilikFoto bisa dipakai di HP?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ya, BilikFoto berjalan di browser dan responsif di semua perangkat termasuk smartphone, tablet, dan laptop."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BilikFoto",
              "url": "https://bilik-foto.vercel.app/",
              "description": "Studio photobooth online gratis",
              "inLanguage": "id"
            }
          ])
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SEOContent.tsx
git commit -m "feat: buat komponen SEOContent untuk konten SEO & AEO"
```

---

### Task 5: Integrasikan SEOContent ke App.tsx

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `SEOContent` dari `src/components/SEOContent.tsx`
- Modifies: Render SEOContent di dalam App component

- [ ] **Step 1: Import SEOContent di App.tsx**

Tambahkan import di bagian atas `src/App.tsx`:

```tsx
import { SEOContent } from './components/SEOContent';
```

- [ ] **Step 2: Render SEOContent di dalam App**

Tambahkan `<SEOContent />` sebagai child pertama dari `<div>` utama di App.tsx (sebelum Header):

```tsx
return (
  <div className="min-h-[100dvh] bg-[#0F1012] text-[#F3F4F6] flex flex-col font-sans selection:bg-white selection:text-white antialiased pb-24">
    
    {/* SEO Content — visible untuk crawler, hidden untuk user */}
    <SEOContent />

    {/* Top Bar Header */}
    <Header
      ...
    />
    ...
  </div>
);
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrasikan SEOContent ke App untuk rendering SEO"
```

---

### Task 6: Buat Prerender Script

**Files:**
- Create: `scripts/prerender.mjs`

**Interfaces:**
- Produces: Script yang prerender SPA ke static HTML dengan JSON-LD

- [ ] **Step 1: Buat directory scripts**

```bash
mkdir -p scripts
```

- [ ] **Step 2: Buat file prerender.mjs**

Buat file `scripts/prerender.mjs`:

```javascript
/**
 * Prerender Script — Render SPA ke static HTML untuk SEO.
 * 
 * Cara kerja:
 * 1. Mulai local server dari dist/
 * 2. Playwright buka page, tunggu sampai fully rendered
 * 3. Simpan rendered HTML sebagai dist/index.html
 * 
 * Jalankan: node scripts/prerender.mjs
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function prerender() {
  console.log('🔄 Memulai prerendering...\n');

  // 1. Cek apakah dist/ ada
  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ tidak ditemukan. Jalankan "vite build" terlebih dahulu.');
    process.exit(1);
  }

  // 2. Baca index.html
  const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');

  // 3. Start local server
  const server = createServer((req, res) => {
    let filePath = resolve(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Default ke index.html untuk SPA routing
    if (!existsSync(filePath)) {
      filePath = resolve(DIST_DIR, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const mimeTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'woff2': 'font/woff2',
        'woff': 'font/woff',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`🌐 Server berjalan di ${BASE_URL}`);

  // 4. Launch Playwright
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 5. Buka page dan tunggu sampai fully rendered
    console.log('📄 Render page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Tambahkan delay untuk memastikan React hydration selesai
    await page.waitForTimeout(2000);

    // 6. Ambil rendered HTML
    const renderedHtml = await page.content();

    // 7. Simpan rendered HTML
    writeFileSync(resolve(DIST_DIR, 'index.html'), renderedHtml, 'utf-8');
    console.log('✅ index.html berhasil di-prerender');

    // 8. Verify — cek apakah JSON-LD ada
    const hasJsonLd = renderedHtml.includes('application/ld+json');
    console.log(`📋 JSON-LD structured data: ${hasJsonLd ? '✅ Ada' : '❌ Tidak ada'}`);

    // 9. Verify — cek apakah meta tags ada
    const hasOgTitle = renderedHtml.includes('og:title');
    const hasOgDesc = renderedHtml.includes('og:description');
    const hasOgImage = renderedHtml.includes('og:image');
    console.log(`📋 Open Graph tags: ${hasOgTitle && hasOgDesc && hasOgImage ? '✅ Lengkap' : '⚠️ Tidak lengkap'}`);

    // 10. Verify — cek apakah SEO content ada
    const hasH1 = renderedHtml.includes('<h1>');
    const hasFaq = renderedHtml.includes('FAQPage');
    console.log(`📋 SEO content (H1, FAQ): ${hasH1 && hasFaq ? '✅ Ada' : '❌ Tidak ada'}`);

  } catch (error) {
    console.error('❌ Gagal prerender:', error.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n🎉 Prerendering selesai!');
}

prerender().catch(console.error);
```

- [ ] **Step 3: Commit**

```bash
git add scripts/prerender.mjs
git commit -m "feat: buat Playwright prerender script untuk SEO"
```

---

### Task 7: Update Build Pipeline

**Files:**
- Modify: `package.json` (sudah di-update di Task 1)
- Verify: `vite.config.ts` (tidak perlu diubah)

**Interfaces:**
- Produces: `npm run build:seo` yang menjalankan build + prerender

- [ ] **Step 1: Verifikasi vite.config.ts tidak perlu diubah**

Prerendering dilakukan setelah build (bukan sebagai Vite plugin), jadi `vite.config.ts` tidak perlu diubah.

- [ ] **Step 2: Test build pipeline**

```bash
npm run build:seo
```

Expected output:
- `dist/` dibuat
- Prerender script berjalan
- `dist/index.html` berisi rendered HTML dengan meta tags dan JSON-LD

- [ ] **Step 3: Verify output**

```bash
# Cek apakah JSON-LD ada di dist/index.html
node -e "const fs = require('fs'); const html = fs.readFileSync('dist/index.html', 'utf-8'); console.log('JSON-LD:', html.includes('application/ld+json')); console.log('OG Title:', html.includes('og:title')); console.log('H1:', html.includes('<h1>')); console.log('FAQ:', html.includes('FAQPage'))"
```

Expected: Semua `true`

- [ ] **Step 4: Commit (jika ada perubahan)**

```bash
git add -A
git commit -m "feat: update build pipeline dengan prerendering SEO"
```

---

### Task 8: Buat OG Image Placeholder

**Files:**
- Create: `public/og-image.png`

**Interfaces:**
- Produces: OG image 1200x630px untuk social media preview

- [ ] **Step 1: Buat OG image placeholder**

Karena kita tidak bisa generate gambar secara programmatic di sini, buat placeholder sederhana:

```bash
# Buat SVG placeholder yang bisa di-convert
cat > public/og-image.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F1012"/>
      <stop offset="100%" style="stop-color:#1A1B21"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#F3F4F6">BilikFoto</text>
  <text x="600" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#9CA3AF">Studio Photobooth Online Gratis</text>
  <text x="600" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#6B7280">10 Layout · 56 Bingkai · 10 Filter · 50+ Stiker · Ekspor HD</text>
</svg>
EOF
```

**Note:** Vercel OG image harus PNG. SVG bisa di-convert manual atau pakai tool online. Untuk sementara, OG image bisa di-skip atau gunakan screenshot app sebagai placeholder.

- [ ] **Step 2: Update meta tag OG image jika perlu**

Jika menggunakan SVG, update `index.html`:
```html
<meta property="og:image" content="https://bilik-foto.vercel.app/og-image.svg" />
<meta property="og:image:type" content="image/svg+xml" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

- [ ] **Step 3: Commit**

```bash
git add public/og-image.svg
git commit -m "feat: tambah OG image placeholder untuk social media preview"
```

---

### Task 9: Final Verification & Testing

**Files:**
- Test: `dist/index.html` (output dari build)

**Interfaces:**
- Produces: Verified SEO output

- [ ] **Step 1: Jalankan build lengkap**

```bash
npm run build:seo
```

- [ ] **Step 2: Preview hasil build**

```bash
npm run preview
```

Buka `http://localhost:4173` di browser.

- [ ] **Step 3: View Source check**

Buka `http://localhost:4173` → View Source → pastikan:
- ✅ `<title>` sudah update
- ✅ `<meta name="description">` ada
- ✅ `<link rel="canonical">` ada
- ✅ Open Graph tags ada (`og:title`, `og:description`, `og:image`)
- ✅ Twitter Card tags ada
- ✅ `<script type="application/ld+json">` ada (3 schema)
- ✅ SEO content (H1, H2, table, FAQ) ada di HTML
- ✅ `<blockquote>` AEO sentence ada

- [ ] **Step 4: Google Rich Results Test**

Buka https://search.google.com/test/rich-results
Masukkan URL `https://bilik-foto.vercel.app/`
Pastikan:
- ✅ FAQ rich results terdeteksi
- ✅ SoftwareApplication terdeteksi
- ✅ Tidak ada errors

- [ ] **Step 5: Open Graph Preview Test**

Buka https://www.opengraph.xyz/
Masukkan URL `https://bilik-foto.vercel.app/`
Pastikan:
- ✅ Title muncul
- ✅ Description muncul
- ✅ Image muncul

- [ ] **Step 6: Lighthouse SEO Audit**

Buka Chrome DevTools → Lighthouse → SEO
Pastikan score ≥ 95.

- [ ] **Step 7: Final Commit**

```bash
git add -A
git commit -m "feat: SEO & AEO strategy selesai — prerendering, structured data, meta tags"
```

---

## Post-Implementation

Setelah semua task selesai:
1. Deploy ke Vercel (`git push` ke branch yang connected)
2. Submit `sitemap.xml` ke Google Search Console
3. Tunggu 1-2 minggu untuk indexing
4. Cek performa di Google Search Console
5. Test AI citations di ChatGPT/Perplexity
