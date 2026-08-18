import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, Check, Trash2, ArrowRight, Play, Eye, RotateCw, VideoOff, FlipHorizontal, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PhotoItem, FilterType } from '../types';
import { generateSamplePhotos } from '../data/presets';
import { playCountdownBeep, playCameraShutterSound } from '../utils/audio';

interface CameraBoothProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  onProceedToCustomize: () => void;
  activeFilter: FilterType;
  requiredCount?: number;
  onLoadSamples?: () => void;
}

export const CameraBooth: React.FC<CameraBoothProps> = ({
  photos,
  onPhotosChange,
  onProceedToCustomize,
  activeFilter,
  requiredCount = 4,
  onLoadSamples,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);

  const [countdownDuration, setCountdownDuration] = useState<number>(3); // 3s, 5s, 10s
  const [countdownCurrent, setCountdownCurrent] = useState<number | null>(null);
  const [isCapturingSequence, setIsCapturingSequence] = useState<boolean>(false);
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load sample demo photos fallback
  const handleLoadSamplePhotos = () => {
    if (onLoadSamples) {
      onLoadSamples();
    } else {
      const samples = generateSamplePhotos();
      const initialPhotos: PhotoItem[] = samples.slice(0, requiredCount).map((url, i) => ({
        id: `sample-${Date.now()}-${i}`,
        dataUrl: url,
      }));
      onPhotosChange(initialPhotos);
    }
  };

  // Start Camera Stream
  const startCamera = useCallback(async (facing: 'user' | 'environment' = facingMode) => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Perangkat atau browser ini tidak mendukung akses kamera langsung');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.warn('Kamera tidak dapat diakses:', err);
      setIsCameraActive(false);

      let friendlyMsg = 'Akses kamera tidak tersedia.';
      if (err instanceof Error) {
        const msgLower = err.message.toLowerCase();
        if (err.name === 'NotAllowedError' || msgLower.includes('dismissed') || msgLower.includes('denied') || msgLower.includes('permission')) {
          friendlyMsg = 'Akses kamera ditolak atau dilewati. Anda dapat mengizinkan kamera pada ikon gembok 🔒 di bilah alamat URL browser, atau langsung menggunakan foto sampel / unggah foto.';
        } else if (err.name === 'NotFoundError' || msgLower.includes('not found')) {
          friendlyMsg = 'Perangkat kamera tidak ditemukan pada perangkat Anda. Silakan unggah foto dari galeri atau gunakan foto sampel.';
        } else if (err.name === 'NotReadableError' || msgLower.includes('in use')) {
          friendlyMsg = 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut lalu coba hubungkan kembali.';
        } else {
          friendlyMsg = `Gagal membuka kamera (${err.message}). Silakan unggah foto dari galeri atau gunakan foto sampel.`;
        }
      }
      setCameraError(friendlyMsg);
    }
  }, [facingMode]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Single Frame Capture from Video element
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flash animation & Shutter Sound
    setFlashActive(true);
    playCameraShutterSound();
    setTimeout(() => setFlashActive(false), 150);

    ctx.save();
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.92);
  }, [isMirrored]);

  // Run automated multi-shot sequence or single shot
  const triggerCapture = async (targetSlot?: number) => {
    if (!isCameraActive || isCapturingSequence) return;

    if (targetSlot !== undefined) {
      // Retake single slot with countdown
      setIsCapturingSequence(true);
      let count = countdownDuration;
      setCountdownCurrent(count);

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          playCountdownBeep(false);
          setCountdownCurrent(count);
        } else if (count === 0) {
          playCountdownBeep(true);
          setCountdownCurrent(null);
          clearInterval(timer);

          const frameData = captureFrame();
          if (frameData) {
            const updated = [...photos];
            updated[targetSlot] = { id: `photo-${Date.now()}-${targetSlot}`, dataUrl: frameData };
            onPhotosChange(updated);
          }
          setIsCapturingSequence(false);
        }
      }, 1000);

      playCountdownBeep(false);
      return;
    }

    // Full 4-shot automated burst sequence
    setIsCapturingSequence(true);
    const captured: PhotoItem[] = [...photos];

    for (let shot = 0; shot < requiredCount; shot++) {
      setSequenceIndex(shot + 1);

      // Countdown loop for this shot
      for (let c = countdownDuration; c >= 1; c--) {
        setCountdownCurrent(c);
        playCountdownBeep(c === 1);
        await new Promise((r) => setTimeout(r, 1000));
      }

      setCountdownCurrent(null);
      const frameData = captureFrame();
      if (frameData) {
        captured[shot] = {
          id: `photo-${Date.now()}-${shot}`,
          dataUrl: frameData,
        };
        onPhotosChange([...captured]);
      }

      // Small pause between shots
      if (shot < requiredCount - 1) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    setIsCapturingSequence(false);
    setSequenceIndex(0);

    // Celebrate completed photoshoot!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Upload Photos from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: PhotoItem[] = [...photos];
    const fileList: File[] = Array.from(files);

    let nextAvailableSlot = newPhotos.length;
    let loadedCount = 0;

    fileList.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (result) {
          let slot;
          if (selectedSlotIndex !== null) {
            slot = (selectedSlotIndex + index) % requiredCount;
          } else {
            slot = nextAvailableSlot % requiredCount;
            nextAvailableSlot++;
          }
          
          newPhotos[slot] = {
            id: `upload-${Date.now()}-${index}`,
            dataUrl: result,
          };
          loadedCount++;
          if (loadedCount === fileList.length) {
            // Trim to strictly match requiredCount
            const validPhotos = newPhotos.filter(Boolean).slice(0, requiredCount);
            onPhotosChange(validPhotos);
            setSelectedSlotIndex(null);
            
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop for reordering slots
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSlotIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSlotIndex === null || draggedSlotIndex === targetIndex) return;

    const newPhotos = [...photos];
    const temp = newPhotos[draggedSlotIndex];
    newPhotos[draggedSlotIndex] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;
    
    // Remove empty slots caused by moving to an empty index and maintain sequential order
    onPhotosChange(newPhotos.filter(Boolean));
    setDraggedSlotIndex(null);
  };

  // Delete / Clear a slot
  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  // Switch camera front/back
  const handleSwitchCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    startCamera(next);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Camera Booth & Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#141519] rounded-2xl border border-[#23252E] p-4 sm:p-5 relative shadow-xl">
            
            {/* Top Camera Status Bar */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="font-semibold text-zinc-300 whitespace-nowrap">
                  {isCameraActive ? 'Kamera Live' : 'Kamera Nonaktif'}
                </span>
                {isCapturingSequence && (
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold rounded border border-rose-500/30 whitespace-nowrap font-mono">
                    Pose {sequenceIndex}/{requiredCount}
                  </span>
                )}
              </div>

              {/* Countdown duration toggle */}
              <div className="flex items-center gap-1 bg-[#1A1B22] p-1 rounded-lg border border-[#2B2D38]">
                <span className="text-zinc-400 px-1 font-medium text-[11px] whitespace-nowrap">Timer:</span>
                {[3, 5, 10].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setCountdownDuration(dur)}
                    disabled={isCapturingSequence}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                      countdownDuration === dur
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewport Container */}
            <div className="relative aspect-4/3 w-full bg-[#0A0B0D] rounded-xl overflow-hidden border border-[#252732] shadow-inner flex items-center justify-center">
              
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-transform ${
                      isMirrored ? 'scale-x-[-1]' : ''
                    }`}
                  />
                  {/* Viewfinder Overlay */}
                  <div className="absolute inset-4 border-0 pointer-events-none z-10 flex flex-col justify-between p-2">
                    <div className="flex justify-between w-full">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-white/70" />
                      <div className="w-8 h-8 border-t-2 border-r-2 border-white/70" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                      <div className="w-1 h-1 bg-white/50 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-red-500/80 rounded-full" />
                      <div className="w-1 h-1 bg-white/50 rounded-full" />
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="w-8 h-8 border-b-2 border-l-2 border-white/70" />
                      <div className="w-8 h-8 border-b-2 border-r-2 border-white/70" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-300 gap-3 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <VideoOff className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white">Kamera Belum Terhubung</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {cameraError || 'Izin kamera belum aktif. Anda bisa mencoba hubungkan kamera atau langsung memakai foto sampel.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => startCamera()}
                      className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                      <span>Coba Hubungkan</span>
                    </button>

                    <button
                      onClick={handleLoadSamplePhotos}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Gunakan Sampel</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#252732] hover:bg-[#2E313E] text-zinc-200 border border-[#353846] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Unggah Foto</span>
                    </button>
                  </div>
                </div>
              )}

              {/* White Camera Flash Overlay */}
              <div
                className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${
                  flashActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Giant Countdown Overlay */}
              <AnimatePresence>
                {countdownCurrent !== null && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20"
                  >
                    <motion.div 
                      key={countdownCurrent}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-32 h-32 rounded-full bg-white/90 text-black flex items-center justify-center font-display font-extrabold text-7xl shadow-[0_0_50px_rgba(255,255,255,0.4)] border-4 border-black/10 backdrop-blur-md"
                    >
                      {countdownCurrent}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Camera Tools Overlay */}
              {isCameraActive && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    title={isMirrored ? 'Mode Normal' : 'Cermin Kamera (Mirror)'}
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      isMirrored ? 'bg-rose-500 text-white' : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSwitchCamera}
                    title="Ganti Kamera Depan/Belakang"
                    className="p-1.5 rounded text-zinc-300 hover:bg-white/10 transition-all text-xs font-medium"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Camera Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1F212B] hover:bg-[#282A36] text-zinc-200 text-xs font-semibold rounded-xl border border-[#2D303E] transition-all whitespace-nowrap shrink-0"
                >
                  <Upload className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Unggah Foto Galeri</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Photobooth Capture Button */}
              <button
                onClick={() => triggerCapture()}
                disabled={!isCameraActive || isCapturingSequence}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                  isCapturingSequence
                    ? 'bg-zinc-700 cursor-not-allowed opacity-60'
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span>{isCapturingSequence ? 'Merekam Sesi...' : `Mulai Sesi (${requiredCount} Pose)`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Captured Photos Tray & Next Step (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#141519] rounded-2xl border border-[#23252E] p-5 shadow-xl">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  Slot Foto Photobooth
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  {photos.length} / {requiredCount} Foto Terkumpul
                </p>
              </div>

              {photos.length > 0 && (
                <button
                  onClick={() => onPhotosChange([])}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Photo Slots Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {Array.from({ length: Math.max(requiredCount, 4) }).map((_, index) => {
                const photo = photos[index];
                return (
                  <div
                    key={index}
                    draggable={!!photo}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`group relative aspect-4/3 rounded-xl overflow-hidden border transition-all ${
                      photo
                        ? 'border-[#2D303E] bg-[#111216] cursor-move'
                        : 'border-dashed border-[#2B2D38] bg-[#0E0F12] flex flex-col items-center justify-center'
                    }`}
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo.dataUrl}
                          alt={`Slot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => triggerCapture(index)}
                            disabled={!isCameraActive || isCapturingSequence}
                            title="Foto Ulang Slot Ini"
                            className="p-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            title="Hapus Foto"
                            className="p-1.5 bg-zinc-700 text-white rounded-lg text-xs font-medium hover:bg-zinc-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Slot Badge */}
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono font-bold text-white">
                          #{index + 1}
                        </span>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-zinc-500 text-xs font-bold font-mono block mb-1">
                          Slot #{index + 1}
                        </span>
                        <button
                          onClick={() => {
                            if (isCameraActive) {
                              triggerCapture(index);
                            } else {
                              setSelectedSlotIndex(index);
                              fileInputRef.current?.click();
                            }
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline"
                        >
                          + Isi Foto
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Proceed Button */}
            <button
              onClick={onProceedToCustomize}
              disabled={photos.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-lg whitespace-nowrap shrink-0 ${
                photos.length > 0
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                  : 'bg-[#1E2028] text-zinc-600 cursor-not-allowed border border-[#2B2D38]'
              }`}
            >
              <span>Lanjut ke Kustomisasi Studio</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {photos.length === 0 && (
              <p className="text-center text-[11px] text-zinc-500 mt-2">
                Jepret foto dengan kamera atau klik "Gunakan Sampel" di atas.
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
