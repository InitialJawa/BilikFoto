import { CustomizationSettings, FilterType, FrameTexture, LayoutType, PhotoItem, PhotoShape, StickerItem } from '../types';
import { createProceduralPatternCanvas, FRAME_SWATCHES } from '../data/patterns';

export interface RenderCanvasOptions {
  photos: PhotoItem[];
  settings: CustomizationSettings;
  scale?: number; // Supersampling factor for HD export (e.g. 2 for 2000px+, 3 for 3000px+)
  showCutLine?: boolean; // For printing 2 side-by-side strips
  duplicateStripForPrint?: boolean; // Render 2 strips side-by-side
}

// Helpers for Date Formatting in Indonesian
export function formatIndonesianDate(format: string, customText?: string): string {
  if (customText && customText.trim() !== '') {
    return customText;
  }

  const now = new Date();
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsFull = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthShort = monthsShort[now.getMonth()];
  const monthFull = monthsFull[now.getMonth()];
  const year = now.getFullYear();

  const pad = (n: number) => n.toString().padStart(2, '0');

  switch (format) {
    case 'short':
      return `${pad(date)} ${monthShort} ${year}`;
    case 'full':
      return `${dayName}, ${date} ${monthFull} ${year}`;
    case 'timestamp':
      return `${year}.${pad(now.getMonth() + 1)}.${pad(date)}`;
    default:
      return `${pad(date)}/${pad(now.getMonth() + 1)}/${year}`;
  }
}

export function formatIndonesianTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())} WIB`;
}

/**
 * Calculate canvas dimensions based on layout type
 */
export function getLayoutDimensions(layout: LayoutType): { width: number; height: number; photoAspect: number; count: number } {
  switch (layout) {
    case 'strip_4':
      return { width: 440, height: 1320, photoAspect: 4 / 3, count: 4 };
    case 'strip_3':
      return { width: 440, height: 1040, photoAspect: 4 / 3, count: 3 };
    case 'strip_2':
      return { width: 440, height: 750, photoAspect: 4 / 3, count: 2 };
    case 'grid_2x2':
      return { width: 720, height: 860, photoAspect: 4 / 3, count: 4 };
    case 'grid_2x3':
      return { width: 720, height: 1180, photoAspect: 4 / 3, count: 6 };
    case 'polaroid_single':
      return { width: 500, height: 640, photoAspect: 1, count: 1 };
    case 'polaroid_duo':
      return { width: 800, height: 560, photoAspect: 1, count: 2 };
    case 'film_35mm':
      return { width: 480, height: 1360, photoAspect: 3 / 2, count: 4 };
    case 'heart_duo':
      return { width: 480, height: 820, photoAspect: 1, count: 2 };
    case 'editorial':
      return { width: 620, height: 960, photoAspect: 3 / 2, count: 3 };
    default:
      return { width: 440, height: 1320, photoAspect: 4 / 3, count: 4 };
  }
}

/**
 * Preloads all photo images into HTMLImageElements
 */
export async function preloadImages(photos: PhotoItem[]): Promise<Map<string, HTMLImageElement>> {
  const map = new Map<string, HTMLImageElement>();
  const promises = photos.map((p) => {
    return new Promise<void>((resolve) => {
      if (!p.dataUrl) {
        resolve();
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        map.set(p.id, img);
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = p.dataUrl;
    });
  });

  await Promise.all(promises);
  return map;
}

/**
 * Apply filters to an image when rendering to a temporary canvas
 */
function applyPhotoFilter(
  ctx: CanvasRenderingContext2D,
  filter: FilterType,
  intensity: number,
  w: number,
  h: number
) {
  const factor = intensity / 100;

  switch (filter) {
    case 'bw_noir':
      ctx.filter = `grayscale(${100 * factor}%) contrast(${100 + 40 * factor}%) brightness(${100 - 5 * factor}%)`;
      break;
    case 'vintage_90s':
      ctx.filter = `sepia(${35 * factor}%) contrast(${100 + 15 * factor}%) brightness(${100 + 5 * factor}%) saturate(${100 - 20 * factor}%)`;
      break;
    case 'golden_hour':
      ctx.filter = `sepia(${25 * factor}%) saturate(${100 + 35 * factor}%) contrast(${100 + 10 * factor}%) hue-rotate(-10deg)`;
      break;
    case 'cyber_y2k':
      ctx.filter = `saturate(${100 + 40 * factor}%) contrast(${100 + 20 * factor}%) hue-rotate(15deg)`;
      break;
    case 'film_35mm':
      ctx.filter = `contrast(${100 + 25 * factor}%) brightness(${100 + 8 * factor}%) saturate(${100 + 15 * factor}%)`;
      break;
    case 'soft_blush':
      ctx.filter = `brightness(${100 + 10 * factor}%) saturate(${100 + 15 * factor}%) contrast(${100 - 5 * factor}%)`;
      break;
    case 'muted_fade':
      ctx.filter = `contrast(${100 - 20 * factor}%) brightness(${100 + 10 * factor}%) saturate(${100 - 35 * factor}%)`;
      break;
    case 'sepia_retro':
      ctx.filter = `sepia(${80 * factor}%) contrast(${100 + 10 * factor}%)`;
      break;
    case 'vignette':
      ctx.filter = `contrast(${100 + 15 * factor}%) saturate(${100 + 10 * factor}%)`;
      break;
    case 'normal':
    default:
      ctx.filter = 'none';
      break;
  }
}

/**
 * Draw Heart Path for heart-shaped photo cutout
 */
function drawHeartPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  const topY = y + h * 0.28;
  ctx.moveTo(x + w / 2, topY);
  // top left curve
  ctx.bezierCurveTo(x + w / 2, y, x, y, x, topY);
  // bottom left curve
  ctx.bezierCurveTo(x, y + h * 0.65, x + w / 2, y + h * 0.8, x + w / 2, y + h);
  // bottom right curve
  ctx.bezierCurveTo(x + w / 2, y + h * 0.8, x + w, y + h * 0.65, x + w, topY);
  // top right curve
  ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, topY);
  ctx.closePath();
}

/**
 * Draw background textures
 */
function drawTexture(ctx: CanvasRenderingContext2D, texture: FrameTexture, w: number, h: number) {
  if (texture === 'none') return;

  ctx.save();
  if (texture === 'grain') {
    // Grain Noise
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 120;
    grainCanvas.height = 120;
    const gCtx = grainCanvas.getContext('2d');
    if (gCtx) {
      const imgData = gCtx.createImageData(120, 120);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 16;
      }
      gCtx.putImageData(imgData, 0, 0);
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
    }
  } else if (texture === 'paper') {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const len = 3 + Math.random() * 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  } else if (texture === 'dots') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    const spacing = 18;
    for (let x = 8; x < w; x += spacing) {
      for (let y = 8; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (texture === 'glitter') {
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 0.5 + Math.random() * 2;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(251, 191, 36, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (texture === 'diagonal') {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 2;
    for (let x = -h; x < w + h; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
  } else if (texture === 'linen') {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 0; x < w; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Draw decorative realistic barcode
 */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, codeText: string, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const numBars = 42;
  const barWidth = w / (numBars * 1.5);
  let currentX = x;

  for (let i = 0; i < numBars; i++) {
    const isThick = (i * 7 + 3) % 5 === 0;
    const isSkip = (i * 3 + 1) % 7 === 0;
    if (!isSkip) {
      ctx.fillRect(currentX, y, isThick ? barWidth * 2 : barWidth, h - 14);
    }
    currentX += barWidth * 1.5;
  }

  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(codeText, x + w / 2, y + h - 2);
  ctx.restore();
}

/**
 * Draw aesthetic mini QR code box
 */
function drawMiniQrCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  ctx.strokeRect(x, y, size, size);

  const cornerSize = size * 0.28;
  const drawCorner = (cx: number, cy: number) => {
    ctx.fillRect(cx, cy, cornerSize, cornerSize);
    ctx.clearRect(cx + 2, cy + 2, cornerSize - 4, cornerSize - 4);
    ctx.fillRect(cx + 4, cy + 4, cornerSize - 8, cornerSize - 8);
  };

  drawCorner(x + 2, y + 2);
  drawCorner(x + size - cornerSize - 2, y + 2);
  drawCorner(x + 2, y + size - cornerSize - 2);

  const dotSize = 3;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r + c * 3) % 2 === 0) {
        ctx.fillRect(x + cornerSize + 4 + c * (dotSize + 2), y + cornerSize + 4 + r * (dotSize + 2), dotSize, dotSize);
      }
    }
  }

  ctx.restore();
}

/**
 * Draw 35mm film roll sprocket holes and markings
 */
function drawFilmSprockets(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeStyle = '#3F3F46';

  const holeWidth = 14;
  const holeHeight = 22;
  const holeRadius = 4;
  const margin = 8;
  const spacing = 44;

  const drawHole = (hx: number, hy: number) => {
    ctx.beginPath();
    ctx.roundRect(hx, hy, holeWidth, holeHeight, holeRadius);
    ctx.fill();
    ctx.stroke();
  };

  let count = 0;
  for (let y = 20; y < h - 30; y += spacing) {
    drawHole(margin, y);
    drawHole(w - margin - holeWidth, y);

    if (count % 2 === 0) {
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`▲ ${count / 2 + 1}A`, margin + holeWidth / 2, y - 4);
      ctx.fillText(`KODAK 400`, w - margin - holeWidth / 2, y - 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    }
    count++;
  }

  ctx.restore();
}

/**
 * Draw individual sticker on canvas
 */
function drawStickerItem(ctx: CanvasRenderingContext2D, sticker: StickerItem, canvasW: number, canvasH: number) {
  ctx.save();

  const px = (sticker.x / 100) * canvasW;
  const py = (sticker.y / 100) * canvasH;

  ctx.translate(px, py);
  ctx.rotate((sticker.rotation * Math.PI) / 180);
  ctx.scale(sticker.scale, sticker.scale);

  if (sticker.type === 'emoji') {
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 4;
    ctx.fillText(sticker.content, 0, 0);
  } else if (sticker.type === 'badge') {
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(sticker.content);
    const badgeW = textMetrics.width + 24;
    const badgeH = 28;

    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = sticker.color || '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 14);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#18181B';
    ctx.fillText(sticker.content, 0, 1);
  } else if (sticker.type === 'custom' && sticker.content) {
    const img = new Image();
    img.src = sticker.content;
    const size = 60;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  }

  ctx.restore();
}

/**
 * Main Rendering function to draw photobooth strip to any HTMLCanvasElement
 */
export async function renderPhotoboothToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderCanvasOptions
) {
  const { photos, settings, scale = 1, duplicateStripForPrint = false } = options;
  const dim = getLayoutDimensions(settings.layout);

  const baseW = dim.width;
  const baseH = dim.height;

  const totalW = duplicateStripForPrint ? baseW * 2 + 40 : baseW;
  const totalH = baseH;

  targetCanvas.width = totalW * scale;
  targetCanvas.height = totalH * scale;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Preload image elements
  const imageMap = await preloadImages(photos);

  const renderSingleStrip = (offsetX: number) => {
    ctx.save();
    ctx.translate(offsetX, 0);

    // 1. Draw Frame Background (Check if Pattern Swatch is selected or solid color)
    const swatch = FRAME_SWATCHES.find((s) => s.id === settings.patternId);

    if (swatch && swatch.type === 'pattern') {
      const patternCanvas = createProceduralPatternCanvas(swatch.id, settings.frameColor);
      if (patternCanvas) {
        const pat = ctx.createPattern(patternCanvas, 'repeat');
        if (pat) {
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, baseW, baseH);
        } else {
          ctx.fillStyle = swatch.colorHex || settings.frameColor;
          ctx.fillRect(0, 0, baseW, baseH);
        }
      } else {
        ctx.fillStyle = swatch.colorHex || settings.frameColor;
        ctx.fillRect(0, 0, baseW, baseH);
      }
    } else if (settings.gradientEnabled) {
      const angleRad = (settings.gradientAngle * Math.PI) / 180;
      const x1 = baseW / 2 - (Math.cos(angleRad) * baseW) / 2;
      const y1 = baseH / 2 - (Math.sin(angleRad) * baseH) / 2;
      const x2 = baseW / 2 + (Math.cos(angleRad) * baseW) / 2;
      const y2 = baseH / 2 + (Math.sin(angleRad) * baseH) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, settings.frameColor);
      grad.addColorStop(1, settings.frameColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, baseW, baseH);
    } else {
      ctx.fillStyle = settings.frameColor;
      ctx.fillRect(0, 0, baseW, baseH);
    }

    // 2. Draw Frame Texture Overlay
    drawTexture(ctx, settings.frameTexture, baseW, baseH);

    // If film layout, draw sprockets
    if (settings.layout === 'film_35mm') {
      drawFilmSprockets(ctx, baseW, baseH);
    }

    // 3. Layout Photo Slots & Draw Images
    const padding = settings.framePadding;
    const gap = settings.photoGap;
    const radius = settings.photoRadius;
    const shape = settings.photoShape || 'rect';

    // Available space for photos
    let headerHeight = settings.showHeader ? 52 : 16;
    let footerHeight = settings.showFooter ? 90 : 24;

    if (settings.layout === 'polaroid_single') {
      headerHeight = 18;
      footerHeight = 120;
    } else if (settings.layout === 'film_35mm') {
      headerHeight = 44;
      footerHeight = 70;
    }

    // Header Drawing
    if (settings.showHeader) {
      ctx.save();
      ctx.fillStyle = settings.headerColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let fontName = settings.headerFont || 'Plus Jakarta Sans';
      ctx.font = `bold ${settings.headerSize}px "${fontName}", sans-serif`;
      
      let headerDisplay = settings.headerText;
      if (settings.logoLanguage === 'KOR' && (!headerDisplay || headerDisplay === 'photobooth')) {
        headerDisplay = '인생네컷';
      } else if (settings.logoLanguage === 'CN' && (!headerDisplay || headerDisplay === 'photobooth')) {
        headerDisplay = '拍立得';
      } else if (settings.logoLanguage === 'IDN' && (!headerDisplay || headerDisplay === 'photobooth')) {
        headerDisplay = 'BilikFoto';
      }

      ctx.fillText(headerDisplay, baseW / 2, headerHeight / 2 + 10);
      ctx.restore();
    }

    const contentW = baseW - padding * 2;
    const contentH = baseH - headerHeight - footerHeight;

    // Calculate slots per layout
    const slots: { x: number; y: number; w: number; h: number }[] = [];

    if (settings.layout === 'strip_4') {
      const slotH = (contentH - gap * 3) / 4;
      for (let i = 0; i < 4; i++) {
        slots.push({
          x: padding,
          y: headerHeight + i * (slotH + gap),
          w: contentW,
          h: slotH
        });
      }
    } else if (settings.layout === 'strip_3') {
      const slotH = (contentH - gap * 2) / 3;
      for (let i = 0; i < 3; i++) {
        slots.push({
          x: padding,
          y: headerHeight + i * (slotH + gap),
          w: contentW,
          h: slotH
        });
      }
    } else if (settings.layout === 'strip_2') {
      const slotH = (contentH - gap) / 2;
      for (let i = 0; i < 2; i++) {
        slots.push({
          x: padding,
          y: headerHeight + i * (slotH + gap),
          w: contentW,
          h: slotH
        });
      }
    } else if (settings.layout === 'grid_2x2') {
      const slotW = (contentW - gap) / 2;
      const slotH = (contentH - gap) / 2;
      slots.push({ x: padding, y: headerHeight, w: slotW, h: slotH });
      slots.push({ x: padding + slotW + gap, y: headerHeight, w: slotW, h: slotH });
      slots.push({ x: padding, y: headerHeight + slotH + gap, w: slotW, h: slotH });
      slots.push({ x: padding + slotW + gap, y: headerHeight + slotH + gap, w: slotW, h: slotH });
    } else if (settings.layout === 'grid_2x3') {
      const slotW = (contentW - gap) / 2;
      const slotH = (contentH - gap * 2) / 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          slots.push({
            x: padding + c * (slotW + gap),
            y: headerHeight + r * (slotH + gap),
            w: slotW,
            h: slotH
          });
        }
      }
    } else if (settings.layout === 'polaroid_single') {
      slots.push({
        x: padding,
        y: headerHeight,
        w: contentW,
        h: contentW
      });
    } else if (settings.layout === 'polaroid_duo') {
      const slotW = (contentW - gap) / 2;
      slots.push({ x: padding, y: headerHeight, w: slotW, h: slotW });
      slots.push({ x: padding + slotW + gap, y: headerHeight, w: slotW, h: slotW });
    } else if (settings.layout === 'film_35mm') {
      const filmSidePadding = padding + 20;
      const filmContentW = baseW - filmSidePadding * 2;
      const slotH = (contentH - gap * 3) / 4;
      for (let i = 0; i < 4; i++) {
        slots.push({
          x: filmSidePadding,
          y: headerHeight + i * (slotH + gap),
          w: filmContentW,
          h: slotH
        });
      }
    } else if (settings.layout === 'heart_duo') {
      const slotH = (contentH - gap) / 2;
      slots.push({ x: padding, y: headerHeight, w: contentW, h: slotH });
      slots.push({ x: padding, y: headerHeight + slotH + gap, w: contentW, h: slotH });
    } else if (settings.layout === 'editorial') {
      const topH = contentH * 0.55;
      const botH = contentH * 0.45 - gap;
      const botW = (contentW - gap) / 2;
      slots.push({ x: padding, y: headerHeight, w: contentW, h: topH });
      slots.push({ x: padding, y: headerHeight + topH + gap, w: botW, h: botH });
      slots.push({ x: padding + botW + gap, y: headerHeight + topH + gap, w: botW, h: botH });
    }

    // 4. Render Photo into each slot with Filter & Custom Shape Clip Path
    slots.forEach((slot, index) => {
      const photo = photos[index];
      const img = photo ? imageMap.get(photo.id) : null;

      ctx.save();

      // Draw Photo Shadow if enabled
      if (settings.photoShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
      }

      // Clip Path based on PhotoShape
      ctx.beginPath();
      if (shape === 'heart' || settings.layout === 'heart_duo') {
        drawHeartPath(ctx, slot.x, slot.y, slot.w, slot.h);
      } else if (shape === 'circle') {
        ctx.ellipse(slot.x + slot.w / 2, slot.y + slot.h / 2, slot.w / 2, slot.h / 2, 0, 0, Math.PI * 2);
      } else if (shape === 'rounded') {
        ctx.roundRect(slot.x, slot.y, slot.w, slot.h, Math.max(16, radius));
      } else {
        // 'rect'
        ctx.roundRect(slot.x, slot.y, slot.w, slot.h, radius);
      }

      ctx.fillStyle = '#E2E8F0';
      ctx.fill();

      // Reset shadow before clipping
      ctx.shadowColor = 'transparent';
      ctx.clip();

      if (img && img.width > 0) {
        // Create an offscreen canvas to apply filters efficiently
        const offCanvas = document.createElement('canvas');
        offCanvas.width = slot.w * 2;
        offCanvas.height = slot.h * 2;
        const offCtx = offCanvas.getContext('2d');

        if (offCtx) {
          offCtx.scale(2, 2);

          // Apply Filter
          applyPhotoFilter(offCtx, settings.filter, settings.filterIntensity, slot.w, slot.h);

          // Image Center-Crop Object-fit Cover calculation
          const imgAspect = img.width / img.height;
          const slotAspect = slot.w / slot.h;
          let renderW = slot.w;
          let renderH = slot.h;
          let drawX = 0;
          let drawY = 0;

          if (imgAspect > slotAspect) {
            renderH = slot.h;
            renderW = slot.h * imgAspect;
            drawX = (slot.w - renderW) / 2;
          } else {
            renderW = slot.w;
            renderH = slot.w / imgAspect;
            drawY = (slot.h - renderH) / 2;
          }

          // Handle zoom / offset if present
          if (photo.scale && photo.scale !== 1) {
            const zoom = photo.scale;
            renderW *= zoom;
            renderH *= zoom;
            drawX = (slot.w - renderW) / 2 + (photo.offsetX || 0);
            drawY = (slot.h - renderH) / 2 + (photo.offsetY || 0);
          }

          offCtx.drawImage(img, drawX, drawY, renderW, renderH);

          // Vignette effect overlay if selected
          if (settings.filter === 'vignette') {
            const vig = offCtx.createRadialGradient(
              slot.w / 2, slot.h / 2, slot.w * 0.3,
              slot.w / 2, slot.h / 2, slot.w * 0.7
            );
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(0,0,0,0.4)');
            offCtx.fillStyle = vig;
            offCtx.fillRect(0, 0, slot.w, slot.h);
          }

          ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, slot.x, slot.y, slot.w, slot.h);
        }
      } else {
        // Placeholder empty slot
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`+ Foto ${index + 1}`, slot.x + slot.w / 2, slot.y + slot.h / 2);
      }

      // Border outline around photo
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    });

    // 5. Draw Footer (Branding, Date, Barcode, QR)
    if (settings.showFooter) {
      const footerY = baseH - footerHeight + 10;
      ctx.save();
      ctx.fillStyle = settings.footerColor;

      let fontName = settings.footerFont || 'Plus Jakarta Sans';

      if (settings.layout === 'polaroid_single') {
        ctx.font = `bold 24px "Caveat", cursive, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(settings.footerText || 'Kenangan Manis ✨', baseW / 2, footerY + 28);

        if (settings.footerSubtext) {
          ctx.font = `18px "Caveat", cursive, sans-serif`;
          ctx.fillText(settings.footerSubtext, baseW / 2, footerY + 54);
        }

        if (settings.showDate) {
          ctx.font = `16px "Caveat", cursive, sans-serif`;
          const dateStr = formatIndonesianDate(settings.dateFormat, settings.customDateText);
          ctx.fillText(dateStr, baseW / 2, footerY + 80);
        }
      } else {
        ctx.textAlign = 'center';

        // Title with language logo support
        ctx.font = `bold 14px "${fontName}", sans-serif`;
        let footerDisplay = settings.footerText;
        if (settings.logoLanguage === 'KOR' && (!footerDisplay || footerDisplay === 'photobooth')) {
          footerDisplay = '인생네컷';
        } else if (settings.logoLanguage === 'CN' && (!footerDisplay || footerDisplay === 'photobooth')) {
          footerDisplay = '拍立得';
        } else if (settings.logoLanguage === 'IDN' && (!footerDisplay || footerDisplay === 'photobooth')) {
          footerDisplay = 'BilikFoto';
        }

        ctx.fillText(footerDisplay, baseW / 2, footerY + 8);

        // Subtitle
        if (settings.footerSubtext) {
          ctx.font = `11px "${fontName}", sans-serif`;
          ctx.fillText(settings.footerSubtext, baseW / 2, footerY + 24);
        }

        // Date & Location Info Row
        const infoParts: string[] = [];
        if (settings.showDate) {
          infoParts.push(formatIndonesianDate(settings.dateFormat, settings.customDateText));
        }
        if (settings.showTime) {
          infoParts.push(formatIndonesianTime());
        }
        if (settings.showLocation && settings.locationText) {
          infoParts.push(settings.locationText);
        }

        if (infoParts.length > 0) {
          ctx.font = `10px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText(infoParts.join(' • '), baseW / 2, footerY + 38);
        }

        // Barcode / QR Section
        const bottomSectionY = footerY + 44;
        if (settings.showBarcode && settings.showQrCode) {
          drawBarcode(ctx, padding + 10, bottomSectionY, baseW - padding * 2 - 50, 26, settings.barcodeNumber, settings.footerColor);
          drawMiniQrCode(ctx, baseW - padding - 32, bottomSectionY, 26, settings.footerColor);
        } else if (settings.showBarcode) {
          drawBarcode(ctx, baseW / 2 - 90, bottomSectionY, 180, 26, settings.barcodeNumber, settings.footerColor);
        } else if (settings.showQrCode) {
          drawMiniQrCode(ctx, baseW / 2 - 14, bottomSectionY, 28, settings.footerColor);
        }
      }

      ctx.restore();
    }

    // 6. Draw Freehand Doodles
    if (settings.doodles && settings.doodles.length > 0) {
      ctx.save();
      settings.doodles.forEach((path) => {
        if (path.points.length < 2) return;
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const first = path.points[0];
        ctx.moveTo((first.x / 100) * baseW, (first.y / 100) * baseH);

        for (let i = 1; i < path.points.length; i++) {
          const pt = path.points[i];
          ctx.lineTo((pt.x / 100) * baseW, (pt.y / 100) * baseH);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    // 7. Draw Stickers
    if (settings.stickers && settings.stickers.length > 0) {
      const sorted = [...settings.stickers].sort((a, b) => a.zIndex - b.zIndex);
      sorted.forEach((sticker) => {
        drawStickerItem(ctx, sticker, baseW, baseH);
      });
    }

    ctx.restore();
  };

  if (duplicateStripForPrint) {
    renderSingleStrip(0);

    const cutLineX = baseW + 20;
    ctx.save();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cutLineX, 10);
    ctx.lineTo(cutLineX, baseH - 10);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✂️', cutLineX, baseH / 2);
    ctx.restore();

    renderSingleStrip(baseW + 40);
  } else {
    renderSingleStrip(0);
  }
}
