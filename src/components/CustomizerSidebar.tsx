import React, { useState } from 'react';
import { 
  Layout, 
  Sparkles, 
  Palette, 
  Type, 
  Sticker, 
  Wand2, 
  Check, 
  Upload, 
  Sliders, 
  Calendar,
  Heart,
  Square,
  Circle,
  HelpCircle,
  Pencil,
  RotateCcw,
  Wand
} from 'lucide-react';
import { 
  CustomizationSettings, 
  FilterType, 
  FrameTexture, 
  LayoutType, 
  PhotoShape,
  LogoLanguage,
  StickerItem,
  TemplatePreset 
} from '../types';
import { 
  FONT_OPTIONS, 
  TEMPLATE_PRESETS 
} from '../data/presets';
import { 
  FRAME_SWATCHES, 
  PatternSwatch 
} from '../data/patterns';
import { 
  PRESET_STICKERS, 
  STICKER_CATEGORIES, 
  StickerTemplate 
} from '../data/presetStickers';
import { playStickerPopSound, playClickSound } from '../utils/audio';

interface CustomizerSidebarProps {
  settings: CustomizationSettings;
  onSettingsChange: (settings: CustomizationSettings) => void;
  activeTool: 'select' | 'doodle';
  onToolChange: (tool: 'select' | 'doodle') => void;
  doodleColor: string;
  onDoodleColorChange: (color: string) => void;
  doodleWidth: number;
  onDoodleWidthChange: (width: number) => void;
}

type TabType = 'swatches' | 'shape' | 'stickers' | 'filter' | 'text' | 'templates';

export const CustomizerSidebar: React.FC<CustomizerSidebarProps> = ({
  settings,
  onSettingsChange,
  activeTool,
  onToolChange,
  doodleColor,
  onDoodleColorChange,
  doodleWidth,
  onDoodleWidthChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('swatches');
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [hoveredSwatch, setHoveredSwatch] = useState<PatternSwatch | null>(null);

  // Swatch Selection
  const handleSelectSwatch = (swatch: PatternSwatch) => {
    playClickSound();
    if (swatch.id === 'custom-color') {
      return;
    }

    if (swatch.type === 'pattern') {
      onSettingsChange({
        ...settings,
        patternId: swatch.id,
        frameColor: swatch.colorHex || settings.frameColor,
        gradientEnabled: false,
      });
    } else {
      onSettingsChange({
        ...settings,
        patternId: swatch.id,
        frameColor: swatch.colorHex || '#FFFFFF',
        gradientEnabled: false,
      });
    }
  };

  // Add Sticker to canvas
  const handleAddSticker = (template: StickerTemplate) => {
    playStickerPopSound();
    const newSticker: StickerItem = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: template.category,
      type: template.type,
      content: template.content,
      label: template.label,
      color: template.bg || '#FFFFFF',
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      scale: 1,
      rotation: (Math.random() - 0.5) * 20,
      zIndex: settings.stickers.length + 1,
    };

    onSettingsChange({
      ...settings,
      stickers: [...settings.stickers, newSticker],
    });
  };

  // Upload Custom PNG Sticker
  const handleUploadCustomSticker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        playStickerPopSound();
        const customSticker: StickerItem = {
          id: `custom-sticker-${Date.now()}`,
          category: 'custom',
          type: 'custom',
          content: dataUrl,
          label: 'Stiker Kustom',
          x: 50,
          y: 50,
          scale: 1,
          rotation: 0,
          zIndex: settings.stickers.length + 1,
        };
        onSettingsChange({
          ...settings,
          stickers: [...settings.stickers, customSticker],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply Template Preset
  const handleApplyTemplate = (tpl: TemplatePreset) => {
    onSettingsChange({
      ...settings,
      ...tpl.settings,
    });
    playStickerPopSound();
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'swatches', label: 'Warna & Tekstur (56)', icon: <Palette className="w-4 h-4" /> },
    { id: 'shape', label: 'Bentuk & Layout', icon: <Layout className="w-4 h-4" /> },
    { id: 'stickers', label: 'Stiker & Coretan', icon: <Sticker className="w-4 h-4" /> },
    { id: 'filter', label: 'Filter Foto', icon: <Wand className="w-4 h-4" /> },
    { id: 'text', label: 'Teks, Tanggal & Logo', icon: <Type className="w-4 h-4" /> },
    { id: 'templates', label: 'Template 1-Klik', icon: <Wand2 className="w-4 h-4" /> },
  ];

  const photoShapes: { id: PhotoShape; label: string; icon: React.ReactNode }[] = [
    { id: 'rect', label: 'Kotak (Rect)', icon: <Square className="w-5 h-5" /> },
    { id: 'rounded', label: 'Sudut Bulat', icon: <div className="w-5 h-5 border-2 border-current rounded-md" /> },
    { id: 'circle', label: 'Lingkaran (Oval)', icon: <Circle className="w-5 h-5" /> },
    { id: 'heart', label: 'Bentuk Hati ♥', icon: <Heart className="w-5 h-5 fill-current" /> },
  ];

  const layoutOptions: { id: LayoutType; name: string; desc: string; iconLabel: string }[] = [
    { id: 'strip_4', name: 'Strip 4 Foto Klasik (6x2)', desc: 'Desain photobooth Life4Cuts (1x4)', iconLabel: '1x4' },
    { id: 'strip_3', name: 'Strip 3 Foto Vertikal', desc: 'Tata letak 3 foto proporsional (1x3)', iconLabel: '1x3' },
    { id: 'strip_2', name: 'Strip 2 Foto Duo', desc: 'Strip kompak 2 foto pasangan (1x2)', iconLabel: '1x2' },
    { id: 'grid_2x2', name: 'Grid 2x2 Kotak', desc: 'Format 4 foto kotak instagramable', iconLabel: '2x2' },
    { id: 'grid_2x3', name: 'Grid 2x3 Lebar (6 Foto)', desc: 'Galeri lengkap 6 foto momen seru', iconLabel: '2x3' },
    { id: 'polaroid_single', name: 'Polaroid Tunggal', desc: 'Polaroid klasik dengan caption bawah', iconLabel: 'PLR' },
    { id: 'polaroid_duo', name: 'Polaroid Ganda (Duo)', desc: 'Dua polaroid berdampingan horizontal', iconLabel: 'PLR2' },
    { id: 'film_35mm', name: 'Roll Film 35mm Vintage', desc: 'Efek klise film analog dengan sprocket', iconLabel: '35MM' },
    { id: 'heart_duo', name: 'Heart Frame Romantis', desc: 'Bentuk hati manis untuk pasangan', iconLabel: '♥' },
    { id: 'editorial', name: 'Editorial Majalah', desc: 'Tipografi besar gaya majalah mode', iconLabel: 'MAG' },
  ];

  const filterOptions: { id: FilterType; name: string; tag: string }[] = [
    { id: 'normal', name: 'Asli (No Filter)', tag: 'Natural' },
    { id: 'soft_blush', name: 'Soft Blush Korea', tag: 'Aesthetic Pink' },
    { id: 'bw_noir', name: 'Noir Hitam Putih', tag: 'High Contrast Mono' },
    { id: 'vintage_90s', name: 'Retro 1998 Film', tag: 'Warm Grain' },
    { id: 'golden_hour', name: 'Golden Hour Sunset', tag: 'Warm Glow' },
    { id: 'cyber_y2k', name: 'Y2K Cyber Teal', tag: 'Cool Tone' },
    { id: 'film_35mm', name: 'Cinematic 35mm', tag: 'Rich Analog' },
    { id: 'muted_fade', name: 'Muted Moody Fade', tag: 'Matte Low Contrast' },
    { id: 'sepia_retro', name: 'Sepia Nostalgia', tag: 'Classic Brown' },
    { id: 'vignette', name: 'Vignette Focus', tag: 'Dark Edge Lens' },
  ];

  const filteredStickers = stickerCategory === 'all'
    ? PRESET_STICKERS
    : PRESET_STICKERS.filter((s) => s.category === stickerCategory);

  return (
    <div className="w-full bg-[#141519]/60 backdrop-blur-2xl lg:rounded-2xl border-t lg:border border-white/10 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] lg:shadow-2xl flex flex-col h-[65vh] lg:h-full text-[#F3F4F6] fixed bottom-0 left-0 right-0 z-30 lg:relative lg:z-0 rounded-t-3xl transition-all">
      
      {/* Mobile drag handle */}
      <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 lg:hidden shrink-0" />

      {/* Scrollable Tabs Header */}
      <div className="flex items-center gap-1 p-2 bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound();
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6 max-h-[660px]">
        
        {/* ================= TAB 1: 56 SWATCHES WARNA & TEKSTUR ================= */}
        {activeTab === 'swatches' && (
          <div className="space-y-6">
            
            {/* Swatches Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Warna & Tekstur Bingkai ({FRAME_SWATCHES.length} Swatch)
                </h3>
                {hoveredSwatch && (
                  <span className="text-[11px] font-semibold text-zinc-400 truncate max-w-[180px]">
                    {hoveredSwatch.name}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 mb-3">
                Pilih pola tartan, kain linen, kilau glitter, checkerboard, marmer, hingga foil holografik:
              </p>

              {/* 8 Columns Swatches Grid */}
              <div className="grid grid-cols-8 gap-2 bg-[#0E0F12] p-3 rounded-xl border border-[#252732] shadow-inner">
                {FRAME_SWATCHES.map((swatch) => {
                  const isSelected = settings.patternId === swatch.id || 
                    (!settings.patternId && settings.frameColor === swatch.colorHex);

                  if (swatch.id === 'custom-color') {
                    return (
                      <div
                        key={swatch.id}
                        onMouseEnter={() => setHoveredSwatch(swatch)}
                        onMouseLeave={() => setHoveredSwatch(null)}
                        className="relative group aspect-square flex items-center justify-center"
                        title={swatch.name}
                      >
                        <label
                          style={{ background: swatch.cssBackground }}
                          className="w-8 h-8 rounded-full border-2 border-white/80 shadow-md cursor-pointer hover:scale-110 transition-transform flex items-center justify-center group-hover:ring-2 group-hover:ring-rose-400"
                        >
                          <input
                            type="color"
                            value={settings.frameColor}
                            onChange={(e) => {
                              onSettingsChange({
                                ...settings,
                                patternId: 'custom-color',
                                frameColor: e.target.value,
                                gradientEnabled: false,
                              });
                            }}
                            className="opacity-0 w-0 h-0 absolute pointer-events-none"
                          />
                          <span className="text-[10px] font-black text-white">🎨</span>
                        </label>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={swatch.id}
                      onClick={() => handleSelectSwatch(swatch)}
                      onMouseEnter={() => setHoveredSwatch(swatch)}
                      onMouseLeave={() => setHoveredSwatch(null)}
                      title={swatch.name}
                      style={{
                        background: swatch.cssBackground || swatch.colorHex || '#FFFFFF',
                      }}
                      className={`relative aspect-square rounded-full border transition-all hover:scale-110 flex items-center justify-center ${
                        isSelected
                          ? 'border-white scale-110 ring-2 ring-white/50 shadow-md z-10'
                          : 'border-white/40 hover:border-white ring-1 ring-black/40'
                      }`}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 stroke-[3] ${
                          swatch.colorHex === '#FFFFFF' || swatch.category === 'plaid' ? 'text-black' : 'text-white'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hex Code Input */}
            <div className="bg-[#1A1B22] p-3 rounded-xl border border-[#2B2D38] flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">Kode Warna Hex Aktif</span>
              <div className="flex items-center gap-2">
                <div 
                  style={{ backgroundColor: settings.frameColor }}
                  className="w-5 h-5 rounded border border-zinc-600"
                />
                <input
                  type="text"
                  value={settings.frameColor}
                  onChange={(e) => onSettingsChange({ ...settings, frameColor: e.target.value, patternId: 'custom' })}
                  className="w-24 bg-[#0E0F12] text-xs font-mono px-2 py-1 rounded border border-[#2D303E] text-white uppercase text-center font-bold"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: BENTUK FOTO & TATA LETAK ================= */}
        {activeTab === 'shape' && (
          <div className="space-y-6">
            
            {/* Photo Shape 4 Buttons Selector */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Bentuk Potongan Foto (Photo Shape)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {photoShapes.map((shape) => {
                  const isSelected = (settings.photoShape || 'rect') === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => {
                        playClickSound();
                        onSettingsChange({ ...settings, photoShape: shape.id });
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 text-zinc-400 ring-1 ring-white/30'
                          : 'border-[#2B2D38] bg-[#1A1B22] hover:border-zinc-500 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="mb-1.5">{shape.icon}</div>
                      <span className="text-xs font-bold whitespace-nowrap">{shape.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Options Grid */}
            <div className="border-t border-[#23252E] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Format Tata Letak (Layout Format)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {layoutOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSettingsChange({ ...settings, layout: opt.id });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      settings.layout === opt.id
                        ? 'border-white bg-white/10 text-white ring-1 ring-white/30'
                        : 'border-[#2B2D38] bg-[#1A1B22] text-zinc-400 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      settings.layout === opt.id ? 'bg-white text-black' : 'bg-[#252733] text-zinc-400'
                    }`}>
                      {opt.iconLabel}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate text-white">{opt.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{opt.desc}</p>
                    </div>
                    {settings.layout === opt.id && <Check className="w-4 h-4 text-zinc-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Geometry Sliders */}
            <div className="border-t border-[#23252E] pt-4 space-y-4 bg-[#111216] p-3.5 rounded-xl border border-[#252732]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pengaturan Jarak & Geometri
              </h3>

              {/* Padding */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                  <span>Ketebalan Bingkai</span>
                  <span className="font-mono font-bold text-zinc-400">{settings.framePadding}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="48"
                  value={settings.framePadding}
                  onChange={(e) => onSettingsChange({ ...settings, framePadding: Number(e.target.value) })}
                  className="w-full accent-white bg-[#252733] h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Gap */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                  <span>Jarak Antar Foto</span>
                  <span className="font-mono font-bold text-zinc-400">{settings.photoGap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={settings.photoGap}
                  onChange={(e) => onSettingsChange({ ...settings, photoGap: Number(e.target.value) })}
                  className="w-full accent-white bg-[#252733] h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Corner Radius */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                  <span>Kelengkungan Sudut Foto</span>
                  <span className="font-mono font-bold text-zinc-400">{settings.photoRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={settings.photoRadius}
                  onChange={(e) => onSettingsChange({ ...settings, photoRadius: Number(e.target.value) })}
                  className="w-full accent-white bg-[#252733] h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-zinc-300">Efek Bayangan Foto (Drop Shadow)</span>
                <button
                  onClick={() => onSettingsChange({ ...settings, photoShadow: !settings.photoShadow })}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.photoShadow ? 'bg-white' : 'bg-[#2E313E]'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.photoShadow ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: STIKER & CORETAN ================= */}
        {activeTab === 'stickers' && (
          <div className="space-y-6">
            
            {/* Tool Mode selector */}
            <div className="flex items-center gap-1 bg-[#1A1B22] p-1 rounded-xl border border-[#2B2D38]">
              <button
                onClick={() => onToolChange('select')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTool === 'select'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Koleksi Stiker
              </button>

              <button
                onClick={() => onToolChange('doodle')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTool === 'doodle'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Kuas Coretan
              </button>
            </div>

            {activeTool === 'select' ? (
              <div className="space-y-4">
                
                {/* Sticker Category Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {STICKER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStickerCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                        stickerCategory === cat.id
                          ? 'bg-white text-zinc-900 font-bold'
                          : 'bg-[#1A1B22] text-zinc-400 hover:text-white border border-[#2B2D38]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sticker Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-2 bg-[#0E0F12] rounded-xl border border-[#252732]">
                  {filteredStickers.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleAddSticker(st)}
                      className="group relative aspect-square bg-[#1A1B22] hover:bg-[#252733] border border-[#2B2D38] hover:border-white rounded-lg p-2 flex flex-col items-center justify-center transition-all transform active:scale-90"
                      title={`Pasang stiker: ${st.label}`}
                    >
                      {st.type === 'emoji' ? (
                        <span className="text-2xl group-hover:scale-120 transition-transform">{st.content}</span>
                      ) : (
                        <span className="text-[10px] font-bold px-1 py-0.5 rounded text-center leading-tight bg-white text-zinc-900 truncate max-w-full">
                          {st.content}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Upload Custom Sticker */}
                <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-[#1A1B22] hover:bg-[#22242E] text-zinc-400 text-xs font-semibold rounded-xl border border-dashed border-white/40 cursor-pointer transition-colors whitespace-nowrap shrink-0">
                  <Upload className="w-4 h-4 shrink-0" />
                  <span>Unggah Stiker Custom (PNG)</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleUploadCustomSticker}
                    className="hidden"
                  />
                </label>

                {/* Clear all stickers button */}
                {settings.stickers.length > 0 && (
                  <button
                    onClick={() => onSettingsChange({ ...settings, stickers: [] })}
                    className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-300 font-semibold transition-colors"
                  >
                    Hapus Semua Stiker ({settings.stickers.length})
                  </button>
                )}

              </div>
            ) : (
              /* Doodle Brush Controls */
              <div className="space-y-4 bg-[#111216] p-4 rounded-xl border border-[#252732]">
                <p className="text-xs text-zinc-400">
                  Gunakan kuas untuk menggambar tanda tangan atau coretan estetik di foto strip.
                </p>

                {/* Color Palette */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-2">Warna Kuas</label>
                  <div className="flex flex-wrap gap-2">
                    {['#FFFFFF', '#18181B', '#F43F5E', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'].map((col) => (
                      <button
                        key={col}
                        onClick={() => onDoodleColorChange(col)}
                        style={{ backgroundColor: col }}
                        className={`w-7 h-7 rounded-full border transition-transform ${
                          doodleColor === col ? 'scale-125 border-white ring-2 ring-white/50' : 'border-zinc-600'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={doodleColor}
                      onChange={(e) => onDoodleColorChange(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer bg-transparent"
                    />
                  </div>
                </div>

                {/* Brush Width */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                    <span>Ketebalan Kuas</span>
                    <span className="font-mono text-zinc-400">{doodleWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="18"
                    value={doodleWidth}
                    onChange={(e) => onDoodleWidthChange(Number(e.target.value))}
                    className="w-full accent-white bg-[#252733] h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {settings.doodles.length > 0 && (
                  <button
                    onClick={() => onSettingsChange({ ...settings, doodles: [] })}
                    className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-300 font-semibold transition-colors"
                  >
                    Hapus Semua Coretan ({settings.doodles.length})
                  </button>
                )}
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 4: FILTER FOTO ================= */}
        {activeTab === 'filter' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Pilih Filter Estetik
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {filterOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playClickSound();
                      onSettingsChange({ ...settings, filter: f.id });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.filter === f.id
                        ? 'border-white bg-white/10 text-white ring-1 ring-white/30'
                        : 'border-[#2B2D38] bg-[#1A1B22] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate text-white">{f.name}</span>
                      {settings.filter === f.id && <Check className="w-3.5 h-3.5 text-zinc-400" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 block truncate">{f.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Intensity Slider */}
            {settings.filter !== 'normal' && (
              <div className="border-t border-[#23252E] pt-4">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1.5">
                  <span>Intensitas Filter</span>
                  <span className="font-mono text-zinc-400">{settings.filterIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.filterIntensity}
                  onChange={(e) => onSettingsChange({ ...settings, filterIntensity: Number(e.target.value) })}
                  className="w-full accent-white bg-[#252733] h-2 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: TEKS, LOGO & TANGGAL ================= */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            
            {/* Logo Style / Language Switcher */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Gaya Logo / Bahasa (Logo Style)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'ENG', label: 'ENG', title: 'photobooth' },
                  { id: 'KOR', label: 'KOR', title: '인생네컷' },
                  { id: 'CN', label: 'CN', title: '拍立得' },
                  { id: 'IDN', label: 'IDN', title: 'BilikFoto' },
                ].map((lang) => {
                  const isSelected = settings.logoLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        playClickSound();
                        onSettingsChange({
                          ...settings,
                          logoLanguage: lang.id as LogoLanguage,
                          headerText: lang.title,
                          footerText: lang.title,
                        });
                      }}
                      className={`py-2 px-2 rounded-xl border font-bold text-xs transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 text-zinc-400 ring-1 ring-white/30'
                          : 'border-[#2B2D38] bg-[#1A1B22] text-zinc-400 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      <span className="block">{lang.label}</span>
                      <span className="text-[9px] font-normal text-zinc-400 truncate block mt-0.5">{lang.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header Text */}
            <div className="border-t border-[#23252E] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Judul Atas (Header Text)
                </h3>
                <button
                  onClick={() => onSettingsChange({ ...settings, showHeader: !settings.showHeader })}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    settings.showHeader ? 'bg-white' : 'bg-[#2E313E]'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    settings.showHeader ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {settings.showHeader && (
                <div className="space-y-2 bg-[#111216] p-3 rounded-xl border border-[#252732]">
                  <input
                    type="text"
                    value={settings.headerText}
                    onChange={(e) => onSettingsChange({ ...settings, headerText: e.target.value })}
                    className="w-full bg-[#1A1B22] text-xs px-3 py-2 rounded-lg border border-[#2D303E] text-white font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={settings.headerFont}
                      onChange={(e) => onSettingsChange({ ...settings, headerFont: e.target.value })}
                      className="w-full bg-[#1A1B22] text-xs p-1.5 rounded border border-[#2D303E] text-white"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                    <input
                      type="color"
                      value={settings.headerColor}
                      onChange={(e) => onSettingsChange({ ...settings, headerColor: e.target.value })}
                      className="w-full h-8 rounded bg-[#1A1B22] cursor-pointer border border-[#2D303E]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Text */}
            <div className="border-t border-[#23252E] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Teks Bawah (Footer Text)
                </h3>
                <button
                  onClick={() => onSettingsChange({ ...settings, showFooter: !settings.showFooter })}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    settings.showFooter ? 'bg-white' : 'bg-[#2E313E]'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    settings.showFooter ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {settings.showFooter && (
                <div className="space-y-2 bg-[#111216] p-3 rounded-xl border border-[#252732]">
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => onSettingsChange({ ...settings, footerText: e.target.value })}
                    className="w-full bg-[#1A1B22] text-xs px-3 py-2 rounded-lg border border-[#2D303E] text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={settings.footerSubtext}
                    onChange={(e) => onSettingsChange({ ...settings, footerSubtext: e.target.value })}
                    placeholder="Subteks tambahan..."
                    className="w-full bg-[#1A1B22] text-xs px-3 py-2 rounded-lg border border-[#2D303E] text-white"
                  />
                </div>
              )}
            </div>

            {/* Date & Time Checkboxes */}
            <div className="border-t border-[#23252E] pt-4 space-y-2 bg-[#111216] p-3.5 rounded-xl border border-[#252732]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Stempel Tanggal & Waktu
              </h3>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer">
                <span>Tambah Tanggal</span>
                <input
                  type="checkbox"
                  checked={settings.showDate}
                  onChange={(e) => onSettingsChange({ ...settings, showDate: e.target.checked })}
                  className="accent-white w-4 h-4 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer pt-1 border-t border-[#23252E]">
                <span>Tambah Waktu</span>
                <input
                  type="checkbox"
                  checked={settings.showTime}
                  onChange={(e) => onSettingsChange({ ...settings, showTime: e.target.checked })}
                  className="accent-white w-4 h-4 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer pt-1 border-t border-[#23252E]">
                <span>Barcode Estetik</span>
                <input
                  type="checkbox"
                  checked={settings.showBarcode}
                  onChange={(e) => onSettingsChange({ ...settings, showBarcode: e.target.checked })}
                  className="accent-white w-4 h-4 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-zinc-300 cursor-pointer pt-1 border-t border-[#23252E]">
                <span>Mini QR Code</span>
                <input
                  type="checkbox"
                  checked={settings.showQrCode}
                  onChange={(e) => onSettingsChange({ ...settings, showQrCode: e.target.checked })}
                  className="accent-white w-4 h-4 rounded"
                />
              </label>
            </div>

          </div>
        )}

        {/* ================= TAB 6: TEMPLATE INSTAN ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 mb-2">
              Terapkan kombinasi warna, font, dan layout dengan 1 kali klik:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {TEMPLATE_PRESETS.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#2B2D38] bg-[#1A1B22] hover:bg-[#23252F] text-left transition-all group"
                >
                  <div
                    style={{ backgroundColor: tpl.previewBg, borderColor: tpl.previewBorder }}
                    className="w-9 h-9 rounded-lg border shadow-xs flex items-center justify-center font-bold text-xs shrink-0"
                  >
                    <span style={{ color: tpl.textColor }}>BF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-white group-hover:text-zinc-400 transition-colors">
                      {tpl.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{tpl.subtitle}</p>
                  </div>
                  <Wand2 className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
