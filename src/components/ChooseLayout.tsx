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
  Film
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
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#141519] text-[#F3F4F6] rounded-2xl border border-[#23252E] p-6 sm:p-8 flex flex-col justify-between my-auto shadow-2xl">
      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-semibold text-rose-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
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
            { id: 'all', label: 'Semua Layout', icon: Sparkles },
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
                    ? 'bg-rose-500 text-white shadow-sm'
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
                className={`group relative bg-[#1A1B22] rounded-xl border transition-all duration-200 flex flex-col items-center p-4 cursor-pointer hover:-translate-y-1 ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-lg shadow-rose-500/10'
                    : 'border-[#2B2D38] hover:border-zinc-500'
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
                  <div className="absolute -top-2.5 right-4 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md z-10">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Card Strip Preview Frame Mockup */}
                <div className="w-full h-64 bg-[#111216] rounded-lg border border-[#252732] flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-[#16171D] transition-colors">
                  
                  {/* Visual Strip Miniature */}
                  <div 
                    style={{
                      backgroundColor: card.defaultSettings?.frameColor || '#FFFFFF',
                    }}
                    className="w-22 h-56 rounded shadow-md border border-zinc-400/30 p-2 flex flex-col justify-between items-center transition-transform group-hover:scale-105"
                  >
                    {/* Mini Header Text */}
                    <div className="text-[6px] font-bold text-zinc-800 tracking-tighter truncate w-full text-center">
                      {card.defaultSettings?.headerText || 'photobooth'}
                    </div>

                    {/* Mini Photo Slots */}
                    <div className="flex-1 w-full flex flex-col justify-around py-1 gap-1">
                      {[1, 2, 3, 4].map((slotIdx) => {
                        const shape = card.defaultSettings?.photoShape || 'rect';
                        return (
                          <div
                            key={slotIdx}
                            className={`w-full h-9 bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px] ${
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
                        );
                      })}
                    </div>

                    {/* Mini Footer Barcode */}
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="text-[5px] font-mono text-zinc-600">
                        {card.defaultSettings?.footerText || 'LIFE FOUR CUTS'}
                      </div>
                      <div className="w-12 h-1 bg-zinc-800 rounded-2xs opacity-70"></div>
                    </div>
                  </div>

                </div>

                {/* Card Title & Details */}
                <div className="w-full mt-3 text-center">
                  <h3 className="font-bold text-white text-sm leading-tight group-hover:text-rose-400 transition-colors">
                    {card.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {card.subtitle}
                  </p>
                  
                  <div className="mt-2 text-[10px] font-mono font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded py-0.5 px-2 inline-block">
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
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-[#242630] hover:bg-rose-500 hover:text-white text-zinc-300'
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
      <div className="w-full max-w-md mx-auto mt-6 flex flex-col items-center gap-4">
        
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
                currentPageIndex === idx ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {/* Primary Proceed CTA Buttons */}
        <div className="flex items-center gap-3 w-full">
          {photos.length > 0 ? (
            <button
              onClick={onGoToCustomize}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Lanjut Kustomisasi Studio</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              onClick={onGoToCamera}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
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
