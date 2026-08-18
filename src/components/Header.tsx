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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0F1012]/60 backdrop-blur-lg px-4 sm:px-6 py-3 no-print transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Single text element) */}
        <div 
          onClick={() => handleNav('layouts')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <img src="/logo.svg" alt="BilikFoto Logo" className="w-7 h-7 group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
            BilikFoto
          </span>
        </div>


        {/* Zone 3: Primary Utility Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onLoadSamples}
            title="Gunakan Foto Sampel Studio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all whitespace-nowrap shrink-0"
          >
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
