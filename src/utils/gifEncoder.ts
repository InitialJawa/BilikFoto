/**
 * Lightweight, zero-dependency Animated GIF & Motion WebM/Video Generator
 * Converts photobooth frames into a looping motion animated strip.
 */

import { PhotoItem, CustomizationSettings } from '../types';
import { preloadImages } from './canvasRenderer';

/**
 * Creates an animated video/GIF blob using MediaRecorder (WebM) or frame loop.
 */
export async function createAnimatedMotionStrip(
  photos: PhotoItem[],
  settings: CustomizationSettings,
  fps = 2,
  onProgress?: (progress: number) => void
): Promise<string> {
  const validPhotos = photos.filter((p) => Boolean(p.dataUrl));
  if (validPhotos.length === 0) {
    throw new Error('Tidak ada foto untuk dibuat animasi');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = 580;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context tidak tersedia');

  const imageMap = await preloadImages(validPhotos);

  // Check if MediaRecorder is supported for WebM/MP4 video clip
  if (typeof MediaRecorder !== 'undefined' && canvas.captureStream) {
    const stream = canvas.captureStream(24);
    const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    return new Promise((resolve, reject) => {
      try {
        const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: selectedMime });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };

        recorder.start();

        let frameIndex = 0;
        const totalCycles = 2; // 2 complete loops
        const totalFrames = validPhotos.length * totalCycles;
        const frameDuration = 1000 / fps;

        const interval = setInterval(() => {
          const photo = validPhotos[frameIndex % validPhotos.length];
          const img = imageMap.get(photo.id);

          // Draw Frame Base
          ctx.fillStyle = settings.frameColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Header
          ctx.fillStyle = settings.headerColor;
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(settings.headerText || 'BILIK FOTO MOTION', canvas.width / 2, 34);

          // Photo Slot
          const slotX = 24;
          const slotY = 54;
          const slotW = canvas.width - 48;
          const slotH = 420;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(slotX, slotY, slotW, slotH, 12);
          ctx.clip();

          if (img && img.width > 0) {
            const imgAspect = img.width / img.height;
            const slotAspect = slotW / slotH;
            let renderW = slotW;
            let renderH = slotH;
            let drawX = 0;
            let drawY = 0;

            if (imgAspect > slotAspect) {
              renderH = slotH;
              renderW = slotH * imgAspect;
              drawX = (slotW - renderW) / 2;
            } else {
              renderW = slotW;
              renderH = slotW / imgAspect;
              drawY = (slotH - renderH) / 2;
            }

            ctx.drawImage(img, slotX + drawX, slotY + drawY, renderW, renderH);
          }
          ctx.restore();

          // Footer
          ctx.fillStyle = settings.footerColor;
          ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`Frame ${((frameIndex % validPhotos.length) + 1)}/${validPhotos.length} • BILIK FOTO`, canvas.width / 2, 510);

          ctx.font = '11px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(settings.footerText || 'Kenangan Abadi', canvas.width / 2, 532);

          frameIndex++;
          if (onProgress) {
            onProgress(Math.min(100, Math.round((frameIndex / totalFrames) * 100)));
          }

          if (frameIndex >= totalFrames) {
            clearInterval(interval);
            setTimeout(() => {
              recorder.stop();
            }, 300);
          }
        }, frameDuration);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Fallback: Return first frame data URL
  return validPhotos[0].dataUrl;
}
