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
import { setAudioMuted, getAudioMuted, playStickerPopSound } from './utils/audio';

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

  return (
    <div className="min-h-screen bg-[#0F1012] text-[#F3F4F6] flex flex-col font-sans selection:bg-rose-500 selection:text-white antialiased">
      
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
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Step 1: Choose Layout */}
        {currentStep === 'layouts' && (
          <ChooseLayout
            currentSettings={settings}
            photos={photos}
            onSelectLayout={handleSelectLayoutFromCatalog}
            onGoToCamera={() => setCurrentStep('capture')}
            onGoToCustomize={() => setCurrentStep('customize')}
          />
        )}

        {/* Step 2: Camera Booth (Capture & Upload) */}
        {currentStep === 'capture' && (
          <CameraBooth
            photos={photos}
            onPhotosChange={setPhotos}
            onProceedToCustomize={() => setCurrentStep('customize')}
            activeFilter={settings.filter}
            requiredCount={4}
            onLoadSamples={handleLoadSamples}
          />
        )}

        {/* Step 3: Customizer Studio */}
        {currentStep === 'customize' && (
          <div className="w-full">
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
          </div>
        )}

        {/* Step 4: Export & Print Studio */}
        {currentStep === 'export' && (
          <ExportModal
            photos={photos}
            settings={settings}
            onBackToCustomize={() => setCurrentStep('customize')}
          />
        )}

      </main>

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
