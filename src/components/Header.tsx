import React from 'react';
import { Camera, Sliders, Download, Volume2, VolumeX, Sparkles, Layout, RotateCcw } from 'lucide-react';
import { AppStep } from '../types';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLoadSamples: () => void;
  photoCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepChange,
  isMuted,
  onToggleMute,
  onLoadSamples,
  photoCount,
}) => {
  const handleNav = (step: AppStep) => {
    playClickSound();
    onStepChange(step);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#22242C] bg-[#141519]/90 backdrop-blur-md px-4 sm:px-6 py-3 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Single text element) */}
        <div 
          onClick={() => handleNav('layouts')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white font-bold font-display flex items-center justify-center text-sm tracking-widest shadow-md group-hover:bg-rose-600 transition-colors">
            BF
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
            BilikFoto<span className="text-rose-500">.</span>
          </span>
        </div>

        {/* Zone 2: Navigation Steps (Single-line controls) */}
        <nav className="flex items-center gap-1 bg-[#1A1B21] p-1 rounded-xl border border-[#2B2D38] overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => handleNav('layouts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'layouts'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="w-3.5 h-3.5 shrink-0" />
            <span>1. Layout</span>
          </button>

          <button
            onClick={() => handleNav('capture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'capture'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>2. Kamera</span>
            {photoCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] text-white font-mono">
                {photoCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('customize')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'customize'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>3. Kustomisasi</span>
          </button>

          <button
            onClick={() => handleNav('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'export'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>4. Ekspor</span>
          </button>
        </nav>

        {/* Zone 3: Primary Utility Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onLoadSamples}
            title="Gunakan Foto Sampel Studio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Foto Sampel</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-2 text-zinc-400 hover:text-white bg-[#1A1B21] hover:bg-[#252730] rounded-lg border border-[#2B2D38] transition-all shrink-0"
            title={isMuted ? 'Suara Hening' : 'Efek Suara Aktif'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
