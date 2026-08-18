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
          <li>100% Privat & Lokal di Browser — Tidak ada foto yang keluar dari perangkat Anda</li>
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
