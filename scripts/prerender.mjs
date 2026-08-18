/**
 * Prerender Script — Render SPA ke static HTML untuk SEO.
 * 
 * Cara kerja:
 * 1. Mulai local server dari dist/
 * 2. Playwright buka page, tunggu sampai fully rendered
 * 3. Jika React gagal mount → inject SEO content langsung ke HTML statis
 * 4. Simpan rendered HTML sebagai dist/index.html
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

const SEO_FALLBACK = `
    <!-- SEO Content (prerender fallback) -->
    <div class="seo-content" aria-hidden="false" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
      <section>
        <h1>BilikFoto — Studio Photobooth Online Gratis</h1>
        <blockquote>BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda — pilih layout, ambil foto via webcam, kustomisasi dengan 56 bingkai dan 10 filter, lalu ekspor sebagai strip foto HD tanpa perlu upload ke server.</blockquote>
      </section>
      <section>
        <h2>Pertanyaan yang Sering Ditanyakan</h2>
        <article><h3>Apa itu BilikFoto?</h3><p>BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda. Pilih dari 10 layout template, ambil foto via webcam, kustomisasi dengan 56 bingkai dan 10 filter, lalu ekspor sebagai strip foto HD.</p></article>
        <article><h3>Apakah BilikFoto benar-benar gratis?</h3><p>Ya, BilikFoto sepenuhnya gratis. Tidak ada biaya tersembunyi, watermark, atau langganan. Semua fitur bisa digunakan tanpa batas.</p></article>
        <article><h3>Apakah foto saya diupload ke server?</h3><p>Tidak. Semua proses di BilikFoto berjalan 100% di browser Anda. Tidak ada foto yang diupload atau disimpan di server manapun.</p></article>
        <article><h3>Bagaimana cara membuat strip foto di BilikFoto?</h3><p>Pilih layout template, ambil foto via webcam atau upload dari galeri, kustomisasi dengan bingkai filter dan stiker, lalu ekspor sebagai PNG HD atau JPEG.</p></article>
        <article><h3>Format apa saja yang bisa di-export?</h3><p>BilikFoto mendukung export PNG HD (300DPI), JPEG, cetak langsung, copy ke clipboard, dan Motion Strip (animasi WebM).</p></article>
        <article><h3>Apakah BilikFoto bisa dipakai di HP?</h3><p>Ya, BilikFoto berjalan di browser dan responsif di semua perangkat termasuk smartphone, tablet, dan laptop.</p></article>
      </section>
    </div>
    <script type="application/ld+json">[{"@context":"https://schema.org","@type":"SoftwareApplication","name":"BilikFoto","description":"Studio photobooth online gratis yang berjalan 100% di browser Anda","url":"https://bilik-foto.vercel.app/","applicationCategory":"MultimediaApplication","operatingSystem":"Web Browser","offers":{"@type":"Offer","price":"0","priceCurrency":"IDR"},"featureList":["10 Layout Template Photobooth","56 Bingkai Warna dan Pola","10 Filter Foto","50+ Stiker Lucu","Ekspor HD 300DPI","100% Privat di Browser"]},{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Apa itu BilikFoto?","acceptedAnswer":{"@type":"Answer","text":"BilikFoto adalah studio photobooth online gratis yang berjalan 100% di browser Anda. Pilih dari 10 layout template, ambil foto via webcam, kustomisasi dengan 56 bingkai dan 10 filter, lalu ekspor sebagai strip foto HD."}},{"@type":"Question","name":"Apakah BilikFoto benar-benar gratis?","acceptedAnswer":{"@type":"Answer","text":"Ya, BilikFoto sepenuhnya gratis. Tidak ada biaya tersembunyi, watermark, atau langganan. Semua fitur bisa digunakan tanpa batas."}},{"@type":"Question","name":"Apakah foto saya diupload ke server?","acceptedAnswer":{"@type":"Answer","text":"Tidak. Semua proses di BilikFoto berjalan 100% di browser Anda. Tidak ada foto yang diupload atau disimpan di server manapun."}},{"@type":"Question","name":"Bagaimana cara membuat strip foto di BilikFoto?","acceptedAnswer":{"@type":"Answer","text":"Pilih layout template, ambil foto via webcam atau upload dari galeri, kustomisasi dengan bingkai filter dan stiker, lalu ekspor sebagai PNG HD atau JPEG."}},{"@type":"Question","name":"Format apa saja yang bisa di-export?","acceptedAnswer":{"@type":"Answer","text":"BilikFoto mendukung export PNG HD (300DPI), JPEG, cetak langsung, copy ke clipboard, dan Motion Strip (animasi WebM)."}},{"@type":"Question","name":"Apakah BilikFoto bisa dipakai di HP?","acceptedAnswer":{"@type":"Answer","text":"Ya, BilikFoto berjalan di browser dan responsif di semua perangkat termasuk smartphone, tablet, dan laptop."}}]},{"@context":"https://schema.org","@type":"WebSite","name":"BilikFoto","url":"https://bilik-foto.vercel.app/","description":"Studio photobooth online gratis","inLanguage":"id"}]</script>`;

async function prerender() {
  console.log('🔄 Memulai prerendering...\n');

  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ tidak ditemukan. Jalankan "vite build" terlebih dahulu.');
    process.exit(1);
  }

  const mimeTypes = {
    'html': 'text/html; charset=utf-8',
    'js':   'application/javascript; charset=utf-8',
    'mjs':  'application/javascript; charset=utf-8',
    'css':  'text/css; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'png':  'image/png',
    'jpg':  'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg':  'image/svg+xml',
    'gif':  'image/gif',
    'ico':  'image/x-icon',
    'woff': 'font/woff',
    'woff2':'font/woff2',
    'ttf':  'font/ttf',
    'webp': 'image/webp',
    'mp4':  'video/mp4',
    'webm': 'video/webm',
  };

  const server = createServer((req, res) => {
    // Strip query string dari URL
    const urlPath = req.url.split('?')[0];
    const filePath = resolve(DIST_DIR, urlPath === '/' ? 'index.html' : '.' + urlPath);

    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop().toLowerCase();
        const mime = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
      } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    } else {
      // SPA fallback — serve index.html (hanya untuk navigasi, bukan asset)
      const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(indexHtml);
    }
  });

  await new Promise((r) => server.listen(PORT, r));
  console.log(`🌐 Server berjalan di ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    console.log('📄 Render page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    let reactMounted = false;
    try {
      await page.waitForSelector('#root > *', { timeout: 8000 });
      reactMounted = true;
      console.log('✅ React berhasil mount');
    } catch {
      console.log('⚠️  React gagal mount dalam 8 detik — menggunakan SEO fallback');
    }

    if (consoleErrors.length > 0) {
      console.log(`⚠️  Console errors (${consoleErrors.length}):`);
      consoleErrors.slice(0, 5).forEach((e) => console.log(`   ${e.substring(0, 200)}`));
    }

    let renderedHtml = await page.content();

    if (!reactMounted || !renderedHtml.includes('application/ld+json')) {
      console.log('💉 Injecting SEO fallback ke HTML...');
      renderedHtml = renderedHtml.replace('</body>', `${SEO_FALLBACK}\n</body>`);
    }

    writeFileSync(resolve(DIST_DIR, 'index.html'), renderedHtml, 'utf-8');
    console.log('✅ index.html berhasil di-prerender');

    const hasJsonLd = renderedHtml.includes('application/ld+json');
    const hasOgTitle = renderedHtml.includes('og:title');
    const hasOgDesc = renderedHtml.includes('og:description');
    const hasOgImage = renderedHtml.includes('og:image');
    const hasH1 = renderedHtml.includes('<h1>');
    const hasFaq = renderedHtml.includes('FAQPage');

    console.log(`\n📋 Hasil Verifikasi:`);
    console.log(`   JSON-LD structured data: ${hasJsonLd ? '✅ Ada' : '❌ Tidak ada'}`);
    console.log(`   Open Graph tags: ${hasOgTitle && hasOgDesc && hasOgImage ? '✅ Lengkap' : '⚠️ Tidak lengkap'}`);
    console.log(`   SEO content (H1, FAQ): ${hasH1 && hasFaq ? '✅ Ada' : '❌ Tidak ada'}`);
    console.log(`   React mount: ${reactMounted ? '✅ Ya' : '❌ Tidak (fallback dipakai)'}`);

  } catch (error) {
    console.error('❌ Gagal prerender:', error.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n🎉 Prerendering selesai!');
}

prerender().catch(console.error);
