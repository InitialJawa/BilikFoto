import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Camera, 
  Sliders, 
  ArrowRight,
  Heart,
  Grid,
  Film,
  Layout
} from 'lucide-react';
import { CustomizationSettings, LayoutCardItem, PhotoItem } from '../types';
import { LAYOUT_CATALOG_CARDS } from '../data/presets';
import { playClickSound, playCameraShutterSound } from '../utils/audio';

interface ChooseLayoutProps {
  currentSettings: CustomizationSettings;
  photos: PhotoItem[];
  onSelectLayout: (item: LayoutCardItem) => void;
  onGoToCamera: () => void;
  onGoToCustomize: () => void;
}

export const ChooseLayout: React.FC<ChooseLayoutProps> = ({
  currentSettings,
  photos,
  onSelectLayout,
  onGoToCamera,
  onGoToCustomize,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'strip' | 'polaroid' | 'grid'>('all');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  const filteredCards = LAYOUT_CATALOG_CARDS.filter((card) => {
    if (activeCategory === 'strip') return card.layout === 'strip_4' || card.layout === 'strip_3' || card.layout === 'strip_2' || card.layout === 'film_35mm';
    if (activeCategory === 'polaroid') return card.layout === 'polaroid_single' || card.layout === 'polaroid_duo' || card.layout === 'heart_duo';
    if (activeCategory === 'grid') return card.layout === 'grid_2x2' || card.layout === 'grid_2x3' || card.layout === 'editorial';
    return true;
  });

  const cardsPerPage = 4;
  const maxPages = Math.ceil(filteredCards.length / cardsPerPage);
  const visibleCards = filteredCards.slice(currentPageIndex * cardsPerPage, (currentPageIndex + 1) * cardsPerPage);

  const handlePrev = () => {
    playClickSound();
    setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    playClickSound();
    setCurrentPageIndex((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  const handleCardClick = (card: LayoutCardItem) => {
    playClickSound();
    onSelectLayout(card);
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#141519]/40 backdrop-blur-xl text-[#F3F4F6] rounded-2xl border border-white/5 p-6 sm:p-8 flex flex-col justify-between my-auto shadow-2xl relative overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/5 blur-[100px] pointer-events-none rounded-full" />

      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300 mb-3">
          <Layout className="w-3.5 h-3.5" />
          <span>Katalog Template Photobooth Strip</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-display mb-2">
          Pilih Format Layout Strip
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium">
          Pilih tata letak photobooth favorit Anda sebelum memulai sesi pengambilan foto
        </p>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          {[
            { id: 'all', label: 'Semua Layout', icon: Layout },
            { id: 'strip', label: 'Strip 4 Pose (6x2)', icon: Film },
            { id: 'polaroid', label: 'Duo & Hati', icon: Heart },
            { id: 'grid', label: 'Grid & Editorial', icon: Grid },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveCategory(tab.id as any);
                  setCurrentPageIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-[#1A1B22] text-zinc-400 hover:text-white border border-[#2B2D38]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Carousel & Grid Viewport */}
      <div className="w-full max-w-6xl mx-auto relative my-auto">
        
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          aria-label="Layout Sebelumnya"
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#1D1E26] hover:bg-[#282A36] text-white rounded-full shadow-lg border border-[#2E313D] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-rose-400" />
        </button>

        {/* Layout Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-3 sm:px-6">
          {visibleCards.map((card) => {
            const isSelected = currentSettings.layout === card.layout && 
              (!card.defaultSettings?.photoShape || card.defaultSettings.photoShape === currentSettings.photoShape);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`group relative bg-[#1A1B22]/60 backdrop-blur-md rounded-xl border transition-all duration-300 flex flex-col items-center p-4 cursor-pointer hover:-translate-y-2 hover:z-10 ${
                  isSelected
                    ? 'border-white ring-2 ring-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                    : 'border-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                }`}
              >
                {/* Badge Top Left */}
                {card.badge && (
                  <div 
                    style={{ backgroundColor: card.badgeColor || '#E11D48' }}
                    className="absolute -top-2.5 left-4 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm z-10"
                  >
                    {card.badge}
                  </div>
                )}

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute -top-2.5 right-4 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center shadow-md z-10">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Card Strip Preview Frame Mockup */}
                <div className="w-full h-64 bg-[#111216]/50 rounded-lg border border-white/5 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-[#16171D]/80 transition-colors">
                  
                  {/* Visual Strip Miniature Dynamic */}
                  {(() => {
                    const layoutType = card.layout || 'strip_4';
                    const shape = card.defaultSettings?.photoShape || 'rect';
                    const frameColor = card.defaultSettings?.frameColor || '#FFFFFF';
                    const isDark = frameColor === '#000000' || frameColor === '#09090B' || frameColor === '#18181B';
                    const textColor = card.defaultSettings?.headerColor || (isDark ? '#FFFFFF' : '#18181B');
                    const textOpacity = isDark ? 'opacity-80' : 'opacity-60';

                    // Determine container shape and slot count based on layout
                    let containerClass = "w-22 h-56 flex-col";
                    let slotArray = [1, 2, 3, 4];
                    let slotsContainerClass = "flex-1 w-full flex flex-col justify-around py-1 gap-1";
                    
                    if (layoutType === 'strip_3') {
                      slotArray = [1, 2, 3];
                    } else if (layoutType === 'strip_2') {
                      containerClass = "w-22 h-40 flex-col";
                      slotArray = [1, 2];
                    } else if (layoutType === 'grid_2x2') {
                      containerClass = "w-28 h-32 flex-col";
                      slotsContainerClass = "flex-1 w-full grid grid-cols-2 grid-rows-2 gap-1 py-1";
                      slotArray = [1, 2, 3, 4];
                    } else if (layoutType === 'polaroid_duo') {
                      containerClass = "w-32 h-24 flex-col";
                      slotsContainerClass = "flex-1 w-full grid grid-cols-2 gap-1 py-1";
                      slotArray = [1, 2];
                    } else if (layoutType === 'editorial') {
                      containerClass = "w-28 h-36 flex-col";
                      slotsContainerClass = "flex-1 w-full flex flex-col gap-1 py-1";
                      slotArray = [1, 2, 3];
                    }

                    return (
                      <div 
                        style={{ backgroundColor: frameColor }}
                        className={`${containerClass} rounded shadow-md border border-zinc-400/30 p-2 flex justify-between items-center transition-transform group-hover:scale-105`}
                      >
                        {/* Mini Header Text */}
                        {card.defaultSettings?.showHeader !== false && (
                          <div 
                            style={{ color: textColor }}
                            className={`text-[6px] font-bold tracking-tighter truncate w-full text-center ${textOpacity}`}
                          >
                            {card.defaultSettings?.headerText || 'photobooth'}
                          </div>
                        )}

                        {/* Mini Photo Slots */}
                        <div className={slotsContainerClass}>
                          {layoutType === 'editorial' ? (
                            <>
                              <div className="w-full h-1/2 bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px]">✨</div>
                              <div className="w-full h-1/2 flex gap-1">
                                <div className="w-1/2 h-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px]">📸</div>
                                <div className="w-1/2 h-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px]">🎀</div>
                              </div>
                            </>
                          ) : (
                            slotArray.map((slotIdx) => (
                              <div
                                key={slotIdx}
                                className={`w-full h-full min-h-[10px] bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px] ${
                                  shape === 'heart'
                                    ? 'rounded-xs clip-heart bg-rose-200'
                                    : shape === 'circle'
                                    ? 'rounded-full'
                                    : shape === 'rounded'
                                    ? 'rounded-xs'
                                    : 'rounded-none'
                                }`}
                              >
                                {slotIdx === 1 ? '✨' : slotIdx === 2 ? '📸' : slotIdx === 3 ? '🎀' : '✌️'}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Mini Footer */}
                        <div className="w-full flex flex-col items-center gap-0.5">
                          <div 
                            style={{ color: card.defaultSettings?.footerColor || textColor }}
                            className={`text-[5px] font-mono ${textOpacity}`}
                          >
                            {card.defaultSettings?.footerText || 'LIFE FOUR CUTS'}
                          </div>
                          <div className={`w-12 h-1 rounded-2xs opacity-50`} style={{ backgroundColor: textColor }}></div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Card Title & Details */}
                <div className="w-full mt-3 text-center">
                  <h3 className="font-bold text-white text-sm leading-tight transition-colors">
                    {card.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {card.subtitle}
                  </p>
                  
                  <div className="mt-2 text-[10px] font-mono font-medium text-zinc-300 bg-white/10 border border-white/20 rounded py-0.5 px-2 inline-block">
                    {card.sizeTag}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card);
                  }}
                  className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#242630] hover:bg-white hover:text-black text-zinc-300'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Dipilih</span>
                    </>
                  ) : (
                    <span>Pilih Layout Ini</span>
                  )}
                </button>

              </div>
            );
          })}
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          aria-label="Layout Berikutnya"
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#1D1E26] hover:bg-[#282A36] text-white rounded-full shadow-lg border border-[#2E313D] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-rose-400" />
        </button>

      </div>

      {/* Bottom Pagination Dots & Next Action Bar */}
      <div className="w-full max-w-md mx-auto mt-2 sm:-mt-2 relative z-10 flex flex-col items-center gap-3">
        
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClickSound();
                setCurrentPageIndex(idx);
              }}
              aria-label={`Halaman ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentPageIndex === idx ? 'w-6 bg-white' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {/* Primary Proceed CTA Buttons */}
        <div className="flex items-center gap-3 w-full">
          {photos.length > 0 ? (
            <button
              onClick={onGoToCustomize}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Lanjut Kustomisasi Studio</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              onClick={onGoToCamera}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>Mulai Sesi Foto Kamera</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
