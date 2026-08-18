# Task 1: Tambah Dependencies & Build Script

## Task Description

Tambahkan playwright sebagai dependency dan buat `build:seo` script di package.json.

## Requirements

1. Install `playwright` sebagai devDependency
2. Install Playwright chromium browser
3. Tambahkan script `build:seo` di package.json yang menjalankan `vite build && node scripts/prerender.mjs`

## Files to Modify

- `package.json` — tambah dependency dan script

## Acceptance Criteria

- `playwright` terinstall sebagai devDependency
- Script `build:seo` ada di package.json
- `npm run build:seo` bisa dijalankan (meskipun prerender.mjs belum ada, build harus berhasil)

## Verification

```bash
npm ls playwright
node -e "const p = require('./package.json'); console.log(p.scripts['build:seo'])"
```
