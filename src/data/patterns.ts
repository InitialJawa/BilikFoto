/**
 * BilikFoto - Database 56 Swatch Warna & Tekstur Bingkai Lengkap
 * Sesuai desain photobooth-io.cc/customize.html
 */

export interface PatternSwatch {
  id: string;
  name: string;
  category: 'color' | 'plaid' | 'checker' | 'floral' | 'texture' | 'nature' | 'metallic';
  type: 'color' | 'pattern';
  colorHex?: string;
  cssBackground?: string;
  drawPattern?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  badge?: string;
}

// Generate high quality procedural canvas pattern function
export function createProceduralPatternCanvas(
  patternId: string,
  baseColor: string = '#FFFFFF'
): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 120, 120);

  switch (patternId) {
    // 1. Glitter Pink
    case 'pattern-pink-glitter': {
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(0, 0, 120, 120);
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        const r = Math.random() * 2 + 0.5;
        ctx.fillStyle = Math.random() > 0.4 ? '#FFFFFF' : '#FDE047';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // 2. Pink Plaid / Tartan
    case 'pattern-pink-plaid': {
      ctx.fillStyle = '#FCE7F3';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
      ctx.fillRect(0, 20, 120, 20);
      ctx.fillRect(0, 80, 120, 20);
      ctx.fillRect(20, 0, 20, 120);
      ctx.fillRect(80, 0, 20, 120);
      ctx.fillStyle = 'rgba(225, 29, 72, 0.5)';
      ctx.fillRect(0, 26, 120, 6);
      ctx.fillRect(26, 0, 6, 120);
      ctx.fillRect(0, 86, 120, 6);
      ctx.fillRect(86, 0, 6, 120);
      break;
    }

    // 3. Blue Plaid
    case 'pattern-blue-plaid': {
      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(0, 20, 120, 20);
      ctx.fillRect(0, 80, 120, 20);
      ctx.fillRect(20, 0, 20, 120);
      ctx.fillRect(80, 0, 20, 120);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.5)';
      ctx.fillRect(0, 28, 120, 4);
      ctx.fillRect(28, 0, 4, 120);
      break;
    }

    // 4. Black & White Tartan
    case 'pattern-bw-check': {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 15, 120, 15);
      ctx.fillRect(0, 75, 120, 15);
      ctx.fillRect(15, 0, 15, 120);
      ctx.fillRect(75, 0, 15, 120);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 20, 120, 5);
      ctx.fillRect(20, 0, 5, 120);
      break;
    }

    // 5. White Lace Floral
    case 'pattern-white-lace': {
      ctx.fillStyle = '#FDFBF7';
      ctx.fillRect(0, 0, 120, 120);
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 1.5;
      for (let x = 15; x < 120; x += 30) {
        for (let y = 15; y < 120; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#F472B6';
          ctx.fill();
        }
      }
      break;
    }

    // 6. Pink Quilted Chanel Leather
    case 'pattern-pink-quilted': {
      ctx.fillStyle = '#FBCFE8';
      ctx.fillRect(0, 0, 120, 120);
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 2;
      for (let offset = -120; offset < 240; offset += 30) {
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + 120, 120);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offset, 120);
        ctx.lineTo(offset + 120, 0);
        ctx.stroke();
      }
      // Studs in centers
      for (let x = 15; x < 120; x += 30) {
        for (let y = 15; y < 120; y += 30) {
          ctx.fillStyle = '#DB2777';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    // 7. Checkerboard Black / White
    case 'pattern-checker-bw': {
      const size = 20;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#18181B' : '#FFFFFF';
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 8. Checkerboard Pink / White
    case 'pattern-checker-pink': {
      const size = 20;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#F472B6' : '#FFFFFF';
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 9. Checkerboard Maroon / White
    case 'pattern-checker-maroon': {
      const size = 20;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#881337' : '#FFF1F2';
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 10. Polkadot Pink
    case 'pattern-polkadot-pink': {
      ctx.fillStyle = '#FCE7F3';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = '#F43F5E';
      const spacing = 24;
      for (let x = 12; x < 120; x += spacing) {
        for (let y = 12; y < 120; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    // 11. Red Gingham Picnic
    case 'pattern-gingham-red': {
      const size = 15;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = r % 2 === 0 ? '#DC2626' : '#FFFFFF';
          } else {
            ctx.fillStyle = '#FCA5A5';
          }
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 12. Green Gingham
    case 'pattern-gingham-green': {
      const size = 15;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = r % 2 === 0 ? '#16A34A' : '#FFFFFF';
          } else {
            ctx.fillStyle = '#86EFAC';
          }
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 13. Navy Gingham
    case 'pattern-gingham-navy': {
      const size = 15;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = r % 2 === 0 ? '#1E3A8A' : '#FFFFFF';
          } else {
            ctx.fillStyle = '#93C5FD';
          }
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 14. Blush Ribbed Corduroy
    case 'pattern-ribbed-blush': {
      ctx.fillStyle = '#FDE8E8';
      ctx.fillRect(0, 0, 120, 120);
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 3;
      for (let x = 0; x < 120; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 120);
        ctx.stroke();
      }
      break;
    }

    // 15. Yellow Stripes
    case 'pattern-yellow-stripes': {
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = '#FFFFFF';
      for (let x = 0; x < 120; x += 20) {
        ctx.fillRect(x, 0, 10, 120);
      }
      break;
    }

    // 16. Blue & Yellow Checker
    case 'pattern-checker-blueyellow': {
      const size = 20;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#0284C7' : '#FDE047';
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
      break;
    }

    // 17. Leopard / Cheetah Animal Print
    case 'pattern-leopard': {
      ctx.fillStyle = '#E5B887';
      ctx.fillRect(0, 0, 120, 120);
      const spots = [
        { x: 20, y: 25 }, { x: 70, y: 30 }, { x: 100, y: 80 },
        { x: 30, y: 80 }, { x: 75, y: 95 }, { x: 15, y: 110 }
      ];
      spots.forEach((sp) => {
        ctx.fillStyle = '#92400E';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1C1917';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 10, 0.4, Math.PI * 1.6);
        ctx.stroke();
      });
      break;
    }

    // 18. Cow Print
    case 'pattern-cow-print': {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = '#18181B';
      const blobs = [
        { x: 25, y: 25, rx: 18, ry: 12, rot: 0.2 },
        { x: 90, y: 40, rx: 22, ry: 16, rot: -0.4 },
        { x: 45, y: 85, rx: 26, ry: 18, rot: 0.5 },
        { x: 105, y: 100, rx: 16, ry: 12, rot: 0.1 }
      ];
      blobs.forEach((b) => {
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.rx, b.ry, b.rot, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // 19. Red Vintage Rose
    case 'pattern-red-floral': {
      ctx.fillStyle = '#FFF1F2';
      ctx.fillRect(0, 0, 120, 120);
      const flowers = [{ x: 30, y: 30 }, { x: 90, y: 35 }, { x: 45, y: 85 }, { x: 100, y: 95 }];
      flowers.forEach((f) => {
        ctx.fillStyle = '#BE123C';
        ctx.beginPath();
        ctx.arc(f.x, f.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.arc(f.x - 2, f.y - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        // Green leaf
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.ellipse(f.x + 10, f.y + 6, 6, 3, 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // 20. Sakura Cherry Blossom
    case 'pattern-sakura-floral': {
      ctx.fillStyle = '#FDF2F8';
      ctx.fillRect(0, 0, 120, 120);
      const pet = [{ x: 30, y: 30 }, { x: 85, y: 40 }, { x: 50, y: 90 }, { x: 100, y: 100 }];
      pet.forEach((p) => {
        ctx.fillStyle = '#F472B6';
        for (let a = 0; a < 5; a++) {
          const angle = (a * Math.PI * 2) / 5;
          const px = p.x + Math.cos(angle) * 7;
          const py = p.y + Math.sin(angle) * 7;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // 21. Black & White Fluid Marble
    case 'pattern-black-marble': {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 0, 120, 120);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.bezierCurveTo(40, 10, 80, 70, 120, 50);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, 90);
      ctx.bezierCurveTo(50, 110, 70, 40, 120, 100);
      ctx.stroke();
      break;
    }

    // 22. Starry Constellation Night
    case 'pattern-starry-galaxy': {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 120, 120);
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        ctx.fillStyle = Math.random() > 0.3 ? '#FFFFFF' : '#38BDF8';
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      break;
    }

    // 23. Water Caustics / Ocean Ripples
    case 'pattern-water-caustics': {
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, 0, 120, 120);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(20 + i * 25, 30 + (i % 2) * 40, 18, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    // 24. Tropical Sunset Gradient
    case 'pattern-sunset-palm': {
      const grad = ctx.createLinearGradient(0, 0, 120, 120);
      grad.addColorStop(0, '#FB923C');
      grad.addColorStop(0.5, '#F43F5E');
      grad.addColorStop(1, '#6366F1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 120, 120);
      break;
    }

    // 25. Disco Mosaic Mirror Tiles
    case 'pattern-disco-mosaic': {
      const size = 15;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const shade = Math.floor(180 + Math.random() * 70);
          ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade + 10})`;
          ctx.fillRect(c * size + 1, r * size + 1, size - 2, size - 2);
        }
      }
      break;
    }

    // 26. Holographic Silver Foil
    case 'pattern-holographic': {
      const grad = ctx.createLinearGradient(0, 0, 120, 120);
      grad.addColorStop(0, '#E0E7FF');
      grad.addColorStop(0.25, '#FBCFE8');
      grad.addColorStop(0.5, '#FEF08A');
      grad.addColorStop(0.75, '#BAE6FD');
      grad.addColorStop(1, '#DDD6FE');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 120, 120);
      break;
    }

    // Default fallback
    default: {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 120, 120);
      break;
    }
  }

  return canvas;
}

// Complete 56 Swatch Collection (7 Rows x 8 Columns)
export const FRAME_SWATCHES: PatternSwatch[] = [
  // ================= ROW 1: SOLID PASTELS & RICH COLORS =================
  { id: 'custom-color', name: 'Warna Bebas (Rainbow Picker)', category: 'color', type: 'color', colorHex: '#F43F5E', cssBackground: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' },
  { id: 'pastel-pink', name: 'Pastel Baby Pink', category: 'color', type: 'color', colorHex: '#FCE7F3', cssBackground: '#FCE7F3' },
  { id: 'baby-blue', name: 'Baby Sky Blue', category: 'color', type: 'color', colorHex: '#E0F2FE', cssBackground: '#E0F2FE' },
  { id: 'pastel-yellow', name: 'Butter Cream Yellow', category: 'color', type: 'color', colorHex: '#FEF9C3', cssBackground: '#FEF9C3' },
  { id: 'matcha-green', name: 'Matcha Milk Green', category: 'color', type: 'color', colorHex: '#DCFCE7', cssBackground: '#DCFCE7' },
  { id: 'soft-lavender', name: 'Soft Lavender Lilac', category: 'color', type: 'color', colorHex: '#F3E8FF', cssBackground: '#F3E8FF' },
  { id: 'beige-latte', name: 'Beige Warm Latte', category: 'color', type: 'color', colorHex: '#F5E6D3', cssBackground: '#F5E6D3' },
  { id: 'burgundy-wine', name: 'Deep Burgundy Wine', category: 'color', type: 'color', colorHex: '#7F1D1D', cssBackground: '#7F1D1D' },

  // ================= ROW 2: MONOCHROME & SPARKLE PLAID =================
  { id: 'pure-white', name: 'Putih Bersih (Pure White)', category: 'color', type: 'color', colorHex: '#FFFFFF', cssBackground: '#FFFFFF' },
  { id: 'pure-black', name: 'Hitam Pekat (Deep Black)', category: 'color', type: 'color', colorHex: '#121212', cssBackground: '#121212' },
  { id: 'pattern-pink-glitter', name: 'Pink Glitter Sparkle', category: 'texture', type: 'pattern', colorHex: '#F472B6', cssBackground: 'radial-gradient(circle, #F472B6 20%, #DB2777 90%)', badge: 'glitter' },
  { id: 'pattern-pink-plaid', name: 'Pink Gingham Plaid', category: 'plaid', type: 'pattern', colorHex: '#FCE7F3', cssBackground: 'repeating-linear-gradient(45deg, #FCE7F3, #FCE7F3 10px, #F472B6 10px, #F472B6 20px)' },
  { id: 'pattern-blue-plaid', name: 'Baby Blue Tartan Check', category: 'plaid', type: 'pattern', colorHex: '#E0F2FE', cssBackground: 'repeating-linear-gradient(45deg, #E0F2FE, #E0F2FE 10px, #38BDF8 10px, #38BDF8 20px)' },
  { id: 'pattern-bw-check', name: 'Black & White Tartan', category: 'plaid', type: 'pattern', colorHex: '#FFFFFF', cssBackground: 'repeating-linear-gradient(45deg, #FFFFFF, #FFFFFF 10px, #18181B 10px, #18181B 20px)' },
  { id: 'pattern-white-lace', name: 'White Floral Lace', category: 'floral', type: 'pattern', colorHex: '#FDFBF7', cssBackground: '#FDFBF7' },
  { id: 'pattern-pink-quilted', name: 'Pink Quilted Chanel Leather', category: 'texture', type: 'pattern', colorHex: '#FBCFE8', cssBackground: '#FBCFE8', badge: 'luxe' },

  // ================= ROW 3: CHECKERBOARD & GINGHAM PICNIC =================
  { id: 'pattern-checker-bw', name: 'Papan Catur Hitam Putih', category: 'checker', type: 'pattern', colorHex: '#18181B', cssBackground: 'conic-gradient(#18181B 90deg, #FFFFFF 90deg 180deg, #18181B 180deg 270deg, #FFFFFF 270deg)' },
  { id: 'pattern-checker-pink', name: 'Checkerboard Pink Pastel', category: 'checker', type: 'pattern', colorHex: '#F472B6', cssBackground: 'conic-gradient(#F472B6 90deg, #FFFFFF 90deg 180deg, #F472B6 180deg 270deg, #FFFFFF 270deg)' },
  { id: 'pattern-checker-maroon', name: 'Checkerboard Maroon Red', category: 'checker', type: 'pattern', colorHex: '#881337', cssBackground: 'conic-gradient(#881337 90deg, #FFF1F2 90deg 180deg, #881337 180deg 270deg, #FFF1F2 270deg)' },
  { id: 'pattern-polkadot-pink', name: 'Pink Polkadot Dot', category: 'texture', type: 'pattern', colorHex: '#FCE7F3', cssBackground: '#FCE7F3' },
  { id: 'pattern-gingham-red', name: 'Red Gingham Picnic', category: 'plaid', type: 'pattern', colorHex: '#DC2626', cssBackground: 'conic-gradient(#DC2626 90deg, #FCA5A5 90deg 180deg, #DC2626 180deg 270deg, #FFFFFF 270deg)' },
  { id: 'pattern-gingham-green', name: 'Green Meadow Gingham', category: 'plaid', type: 'pattern', colorHex: '#16A34A', cssBackground: 'conic-gradient(#16A34A 90deg, #86EFAC 90deg 180deg, #16A34A 180deg 270deg, #FFFFFF 270deg)' },
  { id: 'pattern-gingham-navy', name: 'Navy Blue Gingham', category: 'plaid', type: 'pattern', colorHex: '#1E3A8A', cssBackground: 'conic-gradient(#1E3A8A 90deg, #93C5FD 90deg 180deg, #1E3A8A 180deg 270deg, #FFFFFF 270deg)' },
  { id: 'pattern-ribbed-blush', name: 'Blush Ribbed Corduroy', category: 'texture', type: 'pattern', colorHex: '#FDE8E8', cssBackground: '#FDE8E8' },

  // ================= ROW 4: ANIMAL PRINTS & FLORALS =================
  { id: 'pattern-yellow-stripes', name: 'Pastel Yellow Stripes', category: 'texture', type: 'pattern', colorHex: '#FEF08A', cssBackground: 'repeating-linear-gradient(90deg, #FEF08A, #FEF08A 10px, #FFFFFF 10px, #FFFFFF 20px)' },
  { id: 'pattern-checker-blueyellow', name: 'Blue & Yellow Checker', category: 'checker', type: 'pattern', colorHex: '#0284C7', cssBackground: 'conic-gradient(#0284C7 90deg, #FDE047 90deg 180deg, #0284C7 180deg 270deg, #FDE047 270deg)' },
  { id: 'pattern-navy-tartan', name: 'Navy Dark Tartan', category: 'plaid', type: 'pattern', colorHex: '#0F172A', cssBackground: '#0F172A' },
  { id: 'pattern-leopard', name: 'Leopard Cheetah Print', category: 'texture', type: 'pattern', colorHex: '#E5B887', cssBackground: '#E5B887', badge: 'wild' },
  { id: 'pattern-cow-print', name: 'Black & White Cow Spots', category: 'texture', type: 'pattern', colorHex: '#FFFFFF', cssBackground: '#FFFFFF', badge: 'cute' },
  { id: 'pattern-red-floral', name: 'Red Vintage Rose', category: 'floral', type: 'pattern', colorHex: '#FFF1F2', cssBackground: '#FFF1F2' },
  { id: 'pattern-sakura-floral', name: 'Cherry Blossom Sakura', category: 'floral', type: 'pattern', colorHex: '#FDF2F8', cssBackground: '#FDF2F8' },
  { id: 'pattern-lily-floral', name: 'Botanical Lily Flower', category: 'floral', type: 'pattern', colorHex: '#F0FDF4', cssBackground: '#F0FDF4' },

  // ================= ROW 5: TEXTURES, STONE & MARBLE =================
  { id: 'pattern-linen-canvas', name: 'Natural Linen Canvas', category: 'texture', type: 'pattern', colorHex: '#E7E5E4', cssBackground: '#E7E5E4' },
  { id: 'pattern-denim-floral', name: 'Denim Floral Dainty', category: 'texture', type: 'pattern', colorHex: '#1E293B', cssBackground: '#1E293B' },
  { id: 'pattern-starry-galaxy', name: 'Starry Constellation Night', category: 'nature', type: 'pattern', colorHex: '#0F172A', cssBackground: '#0F172A' },
  { id: 'pattern-black-marble', name: 'Fluid Black Marble', category: 'texture', type: 'pattern', colorHex: '#18181B', cssBackground: '#18181B', badge: 'chic' },
  { id: 'pattern-slate-stone', name: 'Slate Grey Concrete', category: 'texture', type: 'pattern', colorHex: '#64748B', cssBackground: '#64748B' },
  { id: 'pattern-cream-stucco', name: 'Cream Stucco Plaster', category: 'texture', type: 'pattern', colorHex: '#FAF7F2', cssBackground: '#FAF7F2' },
  { id: 'pattern-silk-wave', name: 'White Silk Ripple', category: 'texture', type: 'pattern', colorHex: '#F8FAFC', cssBackground: '#F8FAFC' },
  { id: 'pattern-vintage-paper', name: 'Vintage Old Parchment Paper', category: 'texture', type: 'pattern', colorHex: '#F3EAD8', cssBackground: '#F3EAD8' },

  // ================= ROW 6: NATURE, OCEAN & SUNSET =================
  { id: 'pattern-watercolor-blue', name: 'Cyan Ocean Watercolor', category: 'nature', type: 'pattern', colorHex: '#38BDF8', cssBackground: 'linear-gradient(135deg, #38BDF8, #818CF8)' },
  { id: 'pattern-sky-meadow', name: 'Sunny Sky & Meadow Grass', category: 'nature', type: 'pattern', colorHex: '#86EFAC', cssBackground: 'linear-gradient(to bottom, #7DD3FC 50%, #86EFAC 50%)' },
  { id: 'pattern-sea-wave', name: 'Turquoise Ocean Waves', category: 'nature', type: 'pattern', colorHex: '#0D9488', cssBackground: 'linear-gradient(135deg, #0D9488, #5EEAD4)' },
  { id: 'pattern-water-caustics', name: 'Swimming Pool Caustics', category: 'nature', type: 'pattern', colorHex: '#0284C7', cssBackground: '#0284C7' },
  { id: 'pattern-sunset-palm', name: 'Tropical Sunset Palm Glow', category: 'nature', type: 'pattern', colorHex: '#F97316', cssBackground: 'linear-gradient(135deg, #FB923C, #F43F5E, #6366F1)' },
  { id: 'pattern-star-constellation', name: 'Pastel Starry Galaxy', category: 'nature', type: 'pattern', colorHex: '#DDD6FE', cssBackground: '#DDD6FE' },
  { id: 'pattern-damask-wallpaper', name: 'Victorian Damask Wallpaper', category: 'texture', type: 'pattern', colorHex: '#E2E8F0', cssBackground: '#E2E8F0' },
  { id: 'pattern-antique-lace', name: 'Antique Victorian Lace', category: 'floral', type: 'pattern', colorHex: '#FEF3C7', cssBackground: '#FEF3C7' },

  // ================= ROW 7: FOIL, METALLIC & LUXURY =================
  { id: 'pattern-rose-garden', name: 'Rose Garden Bouquet', category: 'floral', type: 'pattern', colorHex: '#FFE4E6', cssBackground: '#FFE4E6' },
  { id: 'pattern-silver-foil', name: 'Crinkled Silver Foil Wrap', category: 'metallic', type: 'pattern', colorHex: '#E2E8F0', cssBackground: 'linear-gradient(135deg, #CBD5E1, #FFFFFF, #94A3B8, #F1F5F9)' },
  { id: 'pattern-liquid-chrome', name: 'Dark Liquid Molten Chrome', category: 'metallic', type: 'pattern', colorHex: '#27272A', cssBackground: 'linear-gradient(135deg, #18181B, #52525B, #09090B, #3F3F46)' },
  { id: 'pattern-holographic', name: 'Rainbow Holographic Foil', category: 'metallic', type: 'pattern', colorHex: '#E0E7FF', cssBackground: 'linear-gradient(135deg, #FBCFE8, #FEF08A, #BAE6FD, #DDD6FE)' },
  { id: 'pattern-retro-pinstripe', name: 'Vintage 70s Pinstripes', category: 'texture', type: 'pattern', colorHex: '#B45309', cssBackground: 'repeating-linear-gradient(90deg, #D97706, #D97706 4px, #FEF3C7 4px, #FEF3C7 8px)' },
  { id: 'pattern-disco-mosaic', name: 'Disco Ball Mirror Tiles', category: 'metallic', type: 'pattern', colorHex: '#CBD5E1', cssBackground: '#CBD5E1', badge: 'party' },
  { id: 'pattern-snake-skin', name: 'Exotic Python Reptile', category: 'texture', type: 'pattern', colorHex: '#64748B', cssBackground: '#64748B' },
  { id: 'pattern-terracotta-clay', name: 'Warm Terracotta Clay', category: 'texture', type: 'pattern', colorHex: '#C25E43', cssBackground: '#C25E43' },
];
