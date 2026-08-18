import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Share2, 
  Sparkles, 
  Film, 
  Check, 
  Scissors, 
  Image as ImageIcon,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomizationSettings, PhotoItem } from '../types';
import { renderPhotoboothToCanvas } from '../utils/canvasRenderer';
import { createAnimatedMotionStrip } from '../utils/gifEncoder';
import { playSuccessChime } from '../utils/audio';

interface ExportModalProps {
  photos: PhotoItem[];
  settings: CustomizationSettings;
  onBackToCustomize: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  photos,
  settings,
  onBackToCustomize,
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const printCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDualStrip, setIsDualStrip] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingGif, setIsGeneratingGif] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  // Render preview canvas
  useEffect(() => {
    if (previewCanvasRef.current) {
      renderPhotoboothToCanvas(previewCanvasRef.current, {
        photos,
        settings,
        scale: 2,
        duplicateStripForPrint: isDualStrip,
      });
    }
  }, [photos, settings, isDualStrip]);

  // Download High-Resolution Image (PNG or JPEG)
  const handleDownload = async (format: 'png' | 'jpeg') => {
    const exportCanvas = document.createElement('canvas');
    await renderPhotoboothToCanvas(exportCanvas, {
      photos,
      settings,
      scale: 3, // Ultra-sharp 300DPI
      duplicateStripForPrint: isDualStrip,
    });

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = exportCanvas.toDataURL(mime, 0.95);

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `BilikFoto-Strip-${timestamp}.${format}`;
    link.href = dataUrl;
    link.click();

    playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Copy Image to Clipboard
  const handleCopyClipboard = async () => {
    try {
      const exportCanvas = document.createElement('canvas');
      await renderPhotoboothToCanvas(exportCanvas, {
        photos,
        settings,
        scale: 2,
        duplicateStripForPrint: isDualStrip,
      });

      exportCanvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setIsCopied(true);
          playSuccessChime();
          setTimeout(() => setIsCopied(false), 2500);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  // Generate Motion Video / GIF
  const handleGenerateGif = async () => {
    setIsGeneratingGif(true);
    setGifProgress(0);
    try {
      const url = await createAnimatedMotionStrip(photos, settings, 2.5, (p) => {
        setGifProgress(p);
      });
      setGifUrl(url);
      playSuccessChime();
    } catch (err) {
      console.error('Motion generator error:', err);
    } finally {
      setIsGeneratingGif(false);
    }
  };

  // Print Dialog
  const handlePrint = async () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2">
      
      {/* Top action header */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={onBackToCustomize}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali ke Kustomisasi</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Siap Cetak HD 300DPI</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Export Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <div className="w-full bg-[#141519] rounded-2xl border border-[#23252E] p-6 flex flex-col items-center justify-center min-h-[500px] shadow-2xl overflow-auto">
            
            {/* Format toggle: Single vs 2-in-1 Dual Strip */}
            <div className="flex items-center gap-1 mb-4 bg-[#1A1B22] p-1 rounded-xl border border-[#2B2D38] no-print">
              <button
                onClick={() => setIsDualStrip(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  !isDualStrip
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1 Strip Tunggal
              </button>
              <button
                onClick={() => setIsDualStrip(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isDualStrip
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 shrink-0" />
                <span>Strip Ganda 2-in-1 (Siap Gunting)</span>
              </button>
            </div>

            {/* Canvas Preview */}
            <canvas
              ref={previewCanvasRef}
              className="max-h-[600px] max-w-full object-contain rounded-lg shadow-2xl border border-[#282A33]"
            />
          </div>
        </div>

        {/* Right Column: Download & Sharing Options (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 no-print">
          
          {/* Main Download Options Card */}
          <div className="bg-[#141519] rounded-2xl border border-[#23252E] p-5 shadow-xl space-y-4">
            <h2 className="font-display font-bold text-base text-white">
              Unduh & Cetak Foto Strip
            </h2>
            <p className="text-xs text-zinc-400">
              Simpan strip fotomu secara gratis tanpa watermark dalam resolusi tinggi.
            </p>

            {/* PNG Download Button */}
            <button
              onClick={() => handleDownload('png')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all active:scale-98 whitespace-nowrap shrink-0"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white">Download Format PNG (HD)</p>
                  <p className="text-[10px] font-normal text-rose-100">Kualitas cetak tajam terbaik (Recommended)</p>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 bg-black/20 rounded font-mono shrink-0">PNG</span>
            </button>

            {/* JPEG Download Button */}
            <button
              onClick={() => handleDownload('jpeg')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1B22] hover:bg-[#23252F] text-zinc-200 font-semibold text-xs border border-[#2B2D38] transition-all whitespace-nowrap shrink-0"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white">Download Format JPEG</p>
                  <p className="text-[10px] text-zinc-400">Ukuran file lebih ringan untuk chat</p>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 bg-black/40 rounded font-mono text-zinc-400 shrink-0">JPG</span>
            </button>

            {/* Print Directly */}
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1B22] hover:bg-[#23252F] text-zinc-200 font-semibold text-xs border border-[#2B2D38] transition-all whitespace-nowrap shrink-0"
            >
              <div className="flex items-center gap-3">
                <Printer className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white">Cetak Langsung ke Printer</p>
                  <p className="text-[10px] text-zinc-400">Buka dialog print kertas foto</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono shrink-0">CTRL+P</span>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyClipboard}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0E0F12] hover:bg-[#1A1B22] text-zinc-300 text-xs font-semibold border border-[#252732] transition-colors whitespace-nowrap shrink-0"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-bold">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  <span>Salin Gambar (Copy to Clipboard)</span>
                </>
              )}
            </button>
          </div>

          {/* Animated Motion Strip Card */}
          <div className="bg-[#141519] rounded-2xl border border-[#23252E] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Motion Strip (Live Photobooth)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Buat animasi loop bergerak dari frame fotomu!
                </p>
              </div>
            </div>

            {gifUrl ? (
              <div className="space-y-3 pt-2">
                <video
                  src={gifUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-h-48 rounded-xl bg-black object-contain border border-[#252732]"
                />
                <a
                  href={gifUrl}
                  download="BilikFoto-Motion.webm"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download Video Motion (.webm)</span>
                </a>
              </div>
            ) : (
              <button
                onClick={handleGenerateGif}
                disabled={isGeneratingGif}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1B22] hover:bg-[#23252F] text-white rounded-xl text-xs font-bold border border-[#2B2D38] transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                {isGeneratingGif ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400 shrink-0" />
                    <span>Sedang Membuat Animasi ({gifProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Generate Motion Strip Sekarang</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
