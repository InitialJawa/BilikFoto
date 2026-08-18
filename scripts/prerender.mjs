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

  // 2. Start local server
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

  // 3. Launch Playwright
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 4. Buka page dan tunggu sampai fully rendered
    console.log('📄 Render page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Tambahkan delay untuk memastikan React hydration selesai
    await page.waitForTimeout(2000);

    // 5. Ambil rendered HTML
    const renderedHtml = await page.content();

    // 6. Simpan rendered HTML
    writeFileSync(resolve(DIST_DIR, 'index.html'), renderedHtml, 'utf-8');
    console.log('✅ index.html berhasil di-prerender');

    // 7. Verify — cek apakah JSON-LD ada
    const hasJsonLd = renderedHtml.includes('application/ld+json');
    console.log(`📋 JSON-LD structured data: ${hasJsonLd ? '✅ Ada' : '❌ Tidak ada'}`);

    // 8. Verify — cek apakah meta tags ada
    const hasOgTitle = renderedHtml.includes('og:title');
    const hasOgDesc = renderedHtml.includes('og:description');
    const hasOgImage = renderedHtml.includes('og:image');
    console.log(`📋 Open Graph tags: ${hasOgTitle && hasOgDesc && hasOgImage ? '✅ Lengkap' : '⚠️ Tidak lengkap'}`);

    // 9. Verify — cek apakah SEO content ada
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
