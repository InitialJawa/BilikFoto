/**
 * BilikFoto - Studio Photobooth Strip Online & Kustomisasi
 * Reverse engineered from photobooth-io.cc (chooseLayout.html & customize.html) with custom Indonesian aesthetic theme.
 */

import React, { useState, useEffect } from 'react';
import { AppStep, CustomizationSettings, LayoutCardItem, PhotoItem } from './types';
import { DEFAULT_SETTINGS, generateSamplePhotos } from './data/presets';
import { Header } from './components/Header';
import { ChooseLayout } from './components/ChooseLayout';
import { CameraBooth } from './components/CameraBooth';
import { PhotoStripCanvas } from './components/PhotoStripCanvas';
import { CustomizerSidebar } from './components/CustomizerSidebar';
import { ExportModal } from './components/ExportModal';
import { Camera, Sliders, Download, Layout } from 'lucide-react';
import { setAudioMuted, getAudioMuted, playStickerPopSound, playClickSound } from './utils/audio';
import { AnimatePresence, motion } from 'motion/react';
import { SEOContent } from './components/SEOContent';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('layouts');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [settings, setSettings] = useState<CustomizationSettings>(DEFAULT_SETTINGS);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Canvas interactive tool mode
  const [activeTool, setActiveTool] = useState<'select' | 'doodle'>('select');
  const [doodleColor, setDoodleColor] = useState<string>('#F43F5E');
  const [doodleWidth, setDoodleWidth] = useState<number>(6);

  // Initialize with aesthetic demo sample photos so user can experiment immediately
  useEffect(() => {
    const samples = generateSamplePhotos();
    const initialPhotos: PhotoItem[] = samples.slice(0, 4).map((url, i) => ({
      id: `sample-${i}`,
      dataUrl: url,
    }));
    setPhotos(initialPhotos);
  }, []);

  const handleLoadSamples = () => {
    const samples = generateSamplePhotos();
    const initialPhotos: PhotoItem[] = samples.slice(0, 4).map((url, i) => ({
      id: `sample-${Date.now()}-${i}`,
      dataUrl: url,
    }));
    setPhotos(initialPhotos);
    playStickerPopSound();
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setAudioMuted(next);
  };

  const handleSelectLayoutFromCatalog = (card: LayoutCardItem) => {
    setSettings((prev) => ({
      ...prev,
      layout: card.layout,
      ...(card.defaultSettings || {}),
    }));
  };

  const handleNav = (step: AppStep) => {
    playClickSound();
    setCurrentStep(step);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0F1012] text-[#F3F4F6] flex flex-col font-sans selection:bg-white selection:text-white antialiased pb-24">
      
      {/* SEO Content — visible untuk crawler, hidden untuk user */}
      <SEOContent />

      {/* Top Bar Header */}
      <Header
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onLoadSamples={handleLoadSamples}
        photoCount={photos.length}
      />

      {/* Main Content View by Step */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Layout */}
          {currentStep === 'layouts' && (
            <motion.div
              key="step-layouts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
              <ChooseLayout
                currentSettings={settings}
                photos={photos}
                onSelectLayout={handleSelectLayoutFromCatalog}
                onGoToCamera={() => setCurrentStep('capture')}
                onGoToCustomize={() => setCurrentStep('customize')}
              />
            </motion.div>
          )}

          {/* Step 2: Camera Booth (Capture & Upload) */}
          {currentStep === 'capture' && (
            <motion.div
              key="step-capture"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
              <CameraBooth
                photos={photos}
                onPhotosChange={setPhotos}
                onProceedToCustomize={() => setCurrentStep('customize')}
                activeFilter={settings.filter}
                requiredCount={4}
                onLoadSamples={handleLoadSamples}
              />
            </motion.div>
          )}

          {/* Step 3: Customizer Studio */}
          {currentStep === 'customize' && (
            <motion.div
              key="step-customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Canvas Preview & Interactive Stage */}
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center">
                  <PhotoStripCanvas
                    photos={photos}
                    settings={settings}
                    onSettingsChange={setSettings}
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    doodleColor={doodleColor}
                    doodleWidth={doodleWidth}
                  />
                </div>

                {/* Right Customization Sidebar */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
                  <CustomizerSidebar
                    settings={settings}
                    onSettingsChange={setSettings}
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    doodleColor={doodleColor}
                    onDoodleColorChange={setDoodleColor}
                    doodleWidth={doodleWidth}
                    onDoodleWidthChange={setDoodleWidth}
                  />
                </div>

              </div>
            </motion.div>
          )}

          {/* Step 4: Export & Print Studio */}
          {currentStep === 'export' && (
            <motion.div
              key="step-export"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1"
            >
              <ExportModal
                photos={photos}
                settings={settings}
                onBackToCustomize={() => setCurrentStep('customize')}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-4 w-full sm:w-auto flex justify-center pointer-events-none">
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-[#1A1B21]/95 backdrop-blur-xl p-1.5 rounded-2xl border border-[#2B2D38] shadow-2xl overflow-x-auto no-scrollbar pointer-events-auto max-w-full">
          
          <button
            onClick={() => handleNav('layouts')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'layouts'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layout className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>1. Layout</span>
          </button>

          <button
            onClick={() => handleNav('capture')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'capture'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>2. Kamera</span>
            {photos.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-black/10 rounded-full text-[10px] text-black font-mono">
                {photos.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('customize')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'customize'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>3. Kustomisasi</span>
          </button>

          <button
            onClick={() => handleNav('export')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              currentStep === 'export'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>4. Ekspor</span>
          </button>
        </nav>
      </div>

      {/* Footer Branding */}
      <footer className="border-t border-[#1F222A] bg-[#141519] py-3.5 px-6 text-center text-xs text-zinc-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} BilikFoto — Studio Photobooth Strip Online.</p>
          <p className="text-zinc-500 font-mono text-[11px]">100% Privat & Lokal di Browser (Tanpa Upload Server)</p>
        </div>
      </footer>

    </div>
  );
}
