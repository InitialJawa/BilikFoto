export type LayoutType = 
  | 'strip_4'         // Strip vertikal 4 foto klasik (1x4 / Life4Cuts / Size 6 x 2)
  | 'strip_3'         // Strip vertikal 3 foto (1x3)
  | 'strip_2'         // Strip vertikal 2 foto (1x2 Duo)
  | 'grid_2x2'        // Grid 4 foto kotak (2x2)
  | 'grid_2x3'        // Grid 6 foto (2x3)
  | 'polaroid_single' // Polaroid tunggal dengan caption bawah
  | 'polaroid_duo'    // Polaroid ganda berdampingan
  | 'film_35mm'       // Film roll 35mm dengan lubang sprocket
  | 'heart_duo'       // Frame bentuk hati estetik
  | 'editorial';      // Desain majalah minimalis & tipografi besar

export type PhotoShape = 'rect' | 'rounded' | 'circle' | 'heart';

export type LogoLanguage = 'ENG' | 'KOR' | 'CN' | 'IDN';

export type FilterType = 
  | 'normal'        // Asli
  | 'bw_noir'       // Hitam Putih Klasik
  | 'vintage_90s'   // Retro 90s Grain
  | 'golden_hour'   // Hangat Senja / Sunset
  | 'cyber_y2k'     // Cool Tone Pastel Y2K
  | 'film_35mm'     // Tone Sinematik Analog
  | 'soft_blush'    // Pink Estetik Korea
  | 'muted_fade'    // Muted Moody Fade
  | 'sepia_retro'   // Sepia Nostalgia
  | 'vignette';     // Fokus Lensa Gelap Tepi

export type FrameTexture = 'none' | 'paper' | 'grain' | 'linen' | 'glitter' | 'dots' | 'diagonal';

export interface PhotoItem {
  id: string;
  dataUrl: string;
  rotation?: number; // 0, 90, 180, 270
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface StickerItem {
  id: string;
  category: string;
  type: 'svg' | 'emoji' | 'badge' | 'custom';
  content: string; // SVG path string, emoji char, text, or data URL
  label?: string;
  color?: string;
  x: number; // percentage (0-100) on canvas
  y: number; // percentage (0-100) on canvas
  scale: number; // 0.5 to 3
  rotation: number; // degrees -180 to 180
  zIndex: number;
}

export interface DoodlePoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface DoodlePath {
  id: string;
  points: DoodlePoint[];
  color: string;
  width: number;
}

export interface CustomizationSettings {
  layout: LayoutType;
  photoShape: PhotoShape;
  filter: FilterType;
  filterIntensity: number; // 0 - 100
  frameColor: string;
  patternId: string; // selected swatch pattern ID
  gradientEnabled: boolean;
  frameColor2: string;
  gradientAngle: number;
  frameTexture: FrameTexture;
  framePadding: number; // 10 - 48
  photoGap: number; // 0 - 32
  photoRadius: number; // 0 - 36
  photoShadow: boolean;
  
  // Logo & Language
  logoLanguage: LogoLanguage;

  // Header
  showHeader: boolean;
  headerText: string;
  headerFont: string; // 'Syne' | 'Plus Jakarta Sans' | 'Caveat' | 'VT323' | 'Outfit'
  headerColor: string;
  headerSize: number; // 12 - 32

  // Footer
  showFooter: boolean;
  footerText: string;
  footerSubtext: string;
  footerFont: string;
  footerColor: string;
  
  // Tanggal & Stempel
  showDate: boolean;
  dateFormat: 'short' | 'full' | 'timestamp' | 'custom';
  customDateText: string;
  showTime: boolean;
  showLocation: boolean;
  locationText: string;
  showBarcode: boolean;
  showQrCode: boolean;
  barcodeNumber: string;

  // Stiker & Coretan
  stickers: StickerItem[];
  doodles: DoodlePath[];
}

export interface LayoutCardItem {
  id: string;
  name: string;
  subtitle: string;
  sizeTag: string; // e.g. "Size 6 x 2 Strip (4 Pose)"
  badge?: 'NEW LAYOUT' | 'TRY IT NOW' | 'TEMPLATES' | 'POPULAR' | 'HOT';
  badgeColor?: string;
  previewImage?: string;
  layout: LayoutType;
  defaultSettings?: Partial<CustomizationSettings>;
}

export interface TemplatePreset {
  id: string;
  name: string;
  subtitle: string;
  previewBg: string;
  previewBorder: string;
  textColor: string;
  settings: Partial<CustomizationSettings>;
}

export type AppStep = 'layouts' | 'capture' | 'customize' | 'export';

