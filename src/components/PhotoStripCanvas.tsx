import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Trash2, 
  Pencil, 
  MousePointer, 
  Undo,
  Maximize2
} from 'lucide-react';
import { CustomizationSettings, PhotoItem, StickerItem, DoodlePath } from '../types';
import { renderPhotoboothToCanvas, getLayoutDimensions } from '../utils/canvasRenderer';
import { playStickerPopSound } from '../utils/audio';

interface PhotoStripCanvasProps {
  photos: PhotoItem[];
  settings: CustomizationSettings;
  onSettingsChange: (newSettings: CustomizationSettings) => void;
  activeTool: 'select' | 'doodle';
  onToolChange: (tool: 'select' | 'doodle') => void;
  doodleColor: string;
  doodleWidth: number;
}

export const PhotoStripCanvas: React.FC<PhotoStripCanvasProps> = ({
  photos,
  settings,
  onSettingsChange,
  activeTool,
  onToolChange,
  doodleColor,
  doodleWidth,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scaleFactor, setScaleFactor] = useState<number>(0.95);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isDraggingSticker, setIsDraggingSticker] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Doodle state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<DoodlePath | null>(null);

  // Redraw canvas whenever photos, settings, or dimensions change
  const redraw = useCallback(async () => {
    if (!canvasRef.current) return;
    await renderPhotoboothToCanvas(canvasRef.current, {
      photos,
      settings,
      scale: 2, // High resolution preview
    });
  }, [photos, settings]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Convert client mouse/touch coords to percentage on canvas (0-100)
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // Sticker Selection & Dragging
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);
    if (!coords) return;

    if (activeTool === 'doodle') {
      setIsDrawing(true);
      const newStroke: DoodlePath = {
        id: `doodle-${Date.now()}`,
        points: [{ x: coords.x, y: coords.y }],
        color: doodleColor,
        width: doodleWidth,
      };
      setCurrentStroke(newStroke);
      return;
    }

    // Select mode: check if user clicked on any sticker
    const clickedSticker = [...settings.stickers].reverse().find((st) => {
      const dx = Math.abs(st.x - coords.x);
      const dy = Math.abs(st.y - coords.y);
      return dx < 8 * st.scale && dy < 8 * st.scale;
    });

    if (clickedSticker) {
      setSelectedStickerId(clickedSticker.id);
      setIsDraggingSticker(true);
      setDragOffset({
        x: coords.x - clickedSticker.x,
        y: coords.y - clickedSticker.y,
      });
      playStickerPopSound();
    } else {
      setSelectedStickerId(null);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);
    if (!coords) return;

    if (activeTool === 'doodle' && isDrawing && currentStroke) {
      const updatedStroke = {
        ...currentStroke,
        points: [...currentStroke.points, { x: coords.x, y: coords.y }],
      };
      setCurrentStroke(updatedStroke);

      const updatedDoodles = [...settings.doodles, updatedStroke];
      onSettingsChange({
        ...settings,
        doodles: updatedDoodles,
      });
      return;
    }

    if (isDraggingSticker && selectedStickerId) {
      const updatedStickers = settings.stickers.map((st) => {
        if (st.id === selectedStickerId) {
          return {
            ...st,
            x: Math.max(2, Math.min(98, coords.x - dragOffset.x)),
            y: Math.max(2, Math.min(98, coords.y - dragOffset.y)),
          };
        }
        return st;
      });

      onSettingsChange({
        ...settings,
        stickers: updatedStickers,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingSticker(false);
    if (isDrawing && currentStroke) {
      setIsDrawing(false);
      setCurrentStroke(null);
    }
  };

  const updateSelectedSticker = (updater: (st: StickerItem) => StickerItem) => {
    if (!selectedStickerId) return;
    const updated = settings.stickers.map((st) => (st.id === selectedStickerId ? updater(st) : st));
    onSettingsChange({ ...settings, stickers: updated });
  };

  const deleteSelectedSticker = () => {
    if (!selectedStickerId) return;
    const updated = settings.stickers.filter((st) => st.id !== selectedStickerId);
    onSettingsChange({ ...settings, stickers: updated });
    setSelectedStickerId(null);
  };

  const undoLastDoodle = () => {
    if (settings.doodles.length === 0) return;
    const updated = settings.doodles.slice(0, -1);
    onSettingsChange({ ...settings, doodles: updated });
  };

  const selectedSticker = settings.stickers.find((st) => st.id === selectedStickerId);
  const dim = getLayoutDimensions(settings.layout);

  return (
    <div className="flex flex-col items-center gap-3.5 w-full">
      
      {/* Floating Studio Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full bg-[#141519] border border-[#23252E] p-2.5 rounded-2xl shadow-xl">
        
        {/* Tool Mode Selector */}
        <div className="flex items-center gap-1 bg-[#1A1B21] p-1 rounded-xl border border-[#2B2D38]">
          <button
            onClick={() => onToolChange('select')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTool === 'select'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5 shrink-0" />
            <span>Pilih / Geser</span>
          </button>

          <button
            onClick={() => onToolChange('doodle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTool === 'doodle'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
            <span>Kuas Coretan</span>
          </button>
        </div>

        {/* Action Buttons: Undo & Zoom */}
        <div className="flex items-center gap-2">
          {settings.doodles.length > 0 && (
            <button
              onClick={undoLastDoodle}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all whitespace-nowrap shrink-0"
              title="Batalkan Coretan Terakhir"
            >
              <Undo className="w-3.5 h-3.5 shrink-0" />
              <span>Urungkan</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-[#1A1B21] p-1 rounded-xl border border-[#2B2D38]">
            <button
              onClick={() => setScaleFactor((s) => Math.max(0.5, s - 0.1))}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors shrink-0"
              title="Perkecil Tampilan"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-rose-400 px-1">
              {Math.round(scaleFactor * 100)}%
            </span>
            <button
              onClick={() => setScaleFactor((s) => Math.min(1.4, s + 0.1))}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors shrink-0"
              title="Perbesar Tampilan"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Studio Light-Table Viewport */}
      <div 
        ref={containerRef}
        className="w-full flex items-center justify-center p-4 sm:p-8 bg-[#0B0C0E] rounded-3xl border border-[#23252E] overflow-auto min-h-[580px] shadow-2xl relative select-none"
      >
        <div
          style={{
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top center',
            transition: 'transform 0.1s ease-out',
          }}
          className="relative inline-block shadow-2xl rounded-2xl overflow-visible my-4"
        >
          {/* Main Visual Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            style={{
              width: `${dim.width}px`,
              height: `${dim.height}px`,
              cursor: activeTool === 'doodle' ? 'crosshair' : isDraggingSticker ? 'grabbing' : 'default',
            }}
            className="rounded-2xl shadow-2xl block bg-[#141519] border border-[#282A33]"
          />

          {/* Selected Sticker Floating Control Handles */}
          {selectedSticker && activeTool === 'select' && (
            <div
              style={{
                left: `${selectedSticker.x}%`,
                top: `${selectedSticker.y}%`,
                transform: `translate(-50%, -50%) rotate(${selectedSticker.rotation}deg)`,
              }}
              className="absolute pointer-events-auto border-2 border-rose-500 border-dashed rounded-xl p-3 z-50 flex items-center justify-center group"
            >
              {/* Quick Actions Floating Pill */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#181920] text-white px-2 py-1 rounded-xl border border-[#2E313E] shadow-2xl whitespace-nowrap z-50">
                <button
                  onClick={() => updateSelectedSticker((st) => ({ ...st, rotation: (st.rotation + 15) % 360 }))}
                  title="Putar Stiker"
                  className="p-1 hover:bg-[#252733] rounded text-xs"
                >
                  <RotateCw className="w-3 h-3 text-amber-400" />
                </button>
                <button
                  onClick={() => updateSelectedSticker((st) => ({ ...st, scale: Math.min(3, st.scale + 0.2) }))}
                  title="Perbesar"
                  className="p-1 hover:bg-[#252733] rounded text-xs font-bold text-emerald-400"
                >
                  +
                </button>
                <button
                  onClick={() => updateSelectedSticker((st) => ({ ...st, scale: Math.max(0.5, st.scale - 0.2) }))}
                  title="Perkecil"
                  className="p-1 hover:bg-[#252733] rounded text-xs font-bold text-sky-400"
                >
                  -
                </button>
                <button
                  onClick={deleteSelectedSticker}
                  title="Hapus Stiker"
                  className="p-1 hover:bg-rose-500/20 text-rose-400 rounded text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
