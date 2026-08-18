import { CustomizationSettings, LayoutCardItem, TemplatePreset } from '../types';

export const FONT_OPTIONS = [
  { id: 'Plus Jakarta Sans', label: 'Jakarta Sans (Modern Bersih)', class: 'font-sans' },
  { id: 'Syne', label: 'Syne (Estetik & Bold)', class: 'font-display' },
  { id: 'Caveat', label: 'Caveat (Tulisan Tangan)', class: 'font-handwriting' },
  { id: 'VT323', label: 'VT323 (Retro Pixel 90s)', class: 'font-retro' },
  { id: 'Outfit', label: 'Outfit (Trendy Korea)', class: 'font-modern' },
];

export const LAYOUT_CATALOG_CARDS: LayoutCardItem[] = [
  {
    id: 'classic-layout',
    name: 'Classic Layout',
    subtitle: 'Format strip 4 foto legendaris ala photobooth Korea',
    sizeTag: 'Size 6 x 2 Strip (4 Pose)',
    badge: 'POPULAR',
    badgeColor: '#EAB308',
    layout: 'strip_4',
    defaultSettings: {
      photoShape: 'rect',
      frameColor: '#FFFFFF',
      patternId: 'pure-white',
      filter: 'normal',
      photoRadius: 6,
      headerText: 'photobooth',
      footerText: 'LIFE FOUR CUTS',
      logoLanguage: 'ENG'
    }
  },
  {
    id: 'grid-2x2-layout',
    name: 'Grid 2x2 Square',
    subtitle: 'Format 4 foto kotak instagramable dengan bingkai tebal',
    sizeTag: 'Size 4 x 4 Grid (4 Pose)',
    badge: 'HOT',
    badgeColor: '#EF4444',
    layout: 'grid_2x2',
    defaultSettings: {
      photoShape: 'rounded',
      frameColor: '#FFFFFF',
      patternId: 'pure-white',
      filter: 'normal',
      photoRadius: 10,
      headerText: 'BILIK FOTO / GRID',
      footerText: 'BESTIE MOMENTS',
      logoLanguage: 'IDN'
    }
  },
  {
    id: 'polaroid-duo-layout',
    name: 'Polaroid Duo',
    subtitle: 'Dua frame polaroid berdampingan dengan catatan tulisan tangan',
    sizeTag: 'Size 4 x 6 Landscape (2 Pose)',
    badge: 'NEW',
    badgeColor: '#A855F7',
    layout: 'polaroid_duo',
    defaultSettings: {
      photoShape: 'rect',
      frameColor: '#FFFFFF',
      patternId: 'pure-white',
      filter: 'vintage_90s',
      photoRadius: 2,
      showHeader: false,
      footerText: 'Kenangan Terbaik Kita',
      footerFont: 'Caveat',
      logoLanguage: 'IDN'
    }
  },
  {
    id: 'warm-latte',
    name: 'Warm Mocha & Cafe',
    subtitle: 'Nuansa cokelat hangat yang nyaman dan santai',
    sizeTag: 'Strip Pendek (3 Pose)',
    badge: 'AESTHETIC',
    badgeColor: '#D97706',
    layout: 'strip_3',
    defaultSettings: {
      photoShape: 'rounded',
      frameColor: '#EFEAE4',
      patternId: 'beige-latte',
      filter: 'golden_hour',
      photoRadius: 10,
      headerText: 'WARM COFFEE & YOU',
      footerText: 'Hari yang Menyenangkan',
      logoLanguage: 'IDN'
    }
  },
  {
    id: 'noir-minimalist',
    name: 'Noir Editorial',
    subtitle: 'Kontras tinggi hitam putih dengan tipografi elegan',
    sizeTag: 'Size 4 x 4 Grid (4 Pose)',
    badge: 'PRO',
    badgeColor: '#18181B',
    layout: 'grid_2x2',
    defaultSettings: {
      photoShape: 'rect',
      frameColor: '#09090B',
      patternId: 'pure-black',
      filter: 'bw_noir',
      photoRadius: 0,
      headerText: 'VOGUE / STUDIO',
      footerText: 'SPECIAL EDITION',
      logoLanguage: 'ENG'
    }
  },
  {
    id: 'film-35mm-layout',
    name: 'Retro 35mm Film Roll',
    subtitle: 'Klise film analog asli dengan lubang sprocket dan penanda ISO',
    sizeTag: 'Size 6 x 2 Strip (4 Pose)',
    badge: 'POPULAR',
    badgeColor: '#F97316',
    layout: 'film_35mm',
    defaultSettings: {
      photoShape: 'rect',
      frameColor: '#18181B',
      patternId: 'pure-black',
      filter: 'vintage_90s',
      photoRadius: 2,
      headerText: 'KODAK PORTRA 400',
      footerText: 'EXP. 1998 • FILM ARCHIVE',
      logoLanguage: 'ENG'
    }
  },
  {
    id: 'mini-strip-2',
    name: 'Mini Strip Duo',
    subtitle: 'Strip imut dengan 2 foto, cocok untuk pasangan',
    sizeTag: 'Mini Strip (2 Pose)',
    badge: 'CUTE',
    badgeColor: '#EC4899',
    layout: 'strip_2',
    defaultSettings: {
      photoShape: 'circle',
      frameColor: '#FCE7F3',
      patternId: 'pastel-pink',
      filter: 'soft_blush',
      photoRadius: 20,
      headerText: 'COUPLE',
      footerText: 'WITH LOVE',
      logoLanguage: 'ENG'
    }
  },
  {
    id: 'editorial-magazine-layout',
    name: 'Editorial Magazine',
    subtitle: 'Desain majalah mode dengan 1 foto utama dan 2 foto pendukung',
    sizeTag: 'Editorial Portrait (3 Pose)',
    badge: 'HOT',
    badgeColor: '#3B82F6',
    layout: 'editorial',
    defaultSettings: {
      photoShape: 'rect',
      frameColor: '#09090B',
      patternId: 'pure-black',
      filter: 'bw_noir',
      photoRadius: 0,
      headerText: 'VOGUE / STUDIO',
      headerFont: 'Syne',
      headerColor: '#FFFFFF',
      footerText: 'SPECIAL EDITION',
      footerColor: '#FFFFFF',
      logoLanguage: 'ENG'
    }
  }
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'korea-classic',
    name: 'Korea Life4Cut',
    subtitle: 'Putih bersih minimalis ala Gangnam photobooth',
    previewBg: '#FFFFFF',
    previewBorder: '#E5E7EB',
    textColor: '#111827',
    settings: {
      layout: 'strip_4',
      photoShape: 'rect',
      filter: 'soft_blush',
      frameColor: '#FFFFFF',
      patternId: 'pure-white',
      gradientEnabled: false,
      frameTexture: 'none',
      framePadding: 22,
      photoGap: 14,
      photoRadius: 8,
      photoShadow: true,
      showHeader: true,
      headerText: '인생네컷 • BILIK FOTO',
      headerFont: 'Outfit',
      headerColor: '#18181B',
      showFooter: true,
      footerText: 'SWEET MOMENTS',
      footerSubtext: 'Jakarta Studio',
      logoLanguage: 'KOR',
      showDate: true,
      showBarcode: true,
      showQrCode: true,
    }
  },
  {
    id: 'vintage-90s',
    name: 'Retro 1998 Film',
    subtitle: 'Hitam pekat dengan lubang roll film dan grain analog',
    previewBg: '#18181B',
    previewBorder: '#3F3F46',
    textColor: '#FBBF24',
    settings: {
      layout: 'film_35mm',
      photoShape: 'rect',
      filter: 'vintage_90s',
      frameColor: '#18181B',
      patternId: 'pure-black',
      gradientEnabled: false,
      frameTexture: 'grain',
      framePadding: 20,
      photoGap: 16,
      photoRadius: 4,
      photoShadow: false,
      showHeader: true,
      headerText: '🎞️ 35MM ANALOG MEMORY',
      headerFont: 'VT323',
      headerColor: '#F59E0B',
      showFooter: true,
      footerText: 'EXP. 1998 ISO 400',
      footerSubtext: 'DO NOT EXPOSE TO LIGHT',
      logoLanguage: 'ENG',
      showDate: true,
      showBarcode: true,
      showQrCode: false,
    }
  },
  {
    id: 'y2k-pink-dream',
    name: 'Y2K Pink Cyber',
    subtitle: 'Nuansa cerah merah muda dengan stiker bintang',
    previewBg: '#FCE7F3',
    previewBorder: '#F472B6',
    textColor: '#BE185D',
    settings: {
      layout: 'strip_4',
      photoShape: 'rounded',
      filter: 'cyber_y2k',
      frameColor: '#FCE7F3',
      patternId: 'pastel-pink',
      gradientEnabled: false,
      frameTexture: 'glitter',
      framePadding: 24,
      photoGap: 14,
      photoRadius: 16,
      photoShadow: true,
      showHeader: true,
      headerText: '★ 2000s PRINCESS ★',
      headerFont: 'Syne',
      headerColor: '#BE185D',
      showFooter: true,
      footerText: 'SO SWEET • BESTIE',
      footerSubtext: 'xoxo forever',
      logoLanguage: 'ENG',
      showDate: true,
      showBarcode: true,
      showQrCode: true,
    }
  },
  {
    id: 'heart-cutout-sweet',
    name: 'Heart Frame Cutout',
    subtitle: 'Potongan foto berbentuk hati romantis & gemas',
    previewBg: '#FFF1F2',
    previewBorder: '#FB7185',
    textColor: '#E11D48',
    settings: {
      layout: 'strip_4',
      photoShape: 'heart',
      filter: 'soft_blush',
      frameColor: '#FFF1F2',
      patternId: 'pastel-pink',
      gradientEnabled: false,
      frameTexture: 'none',
      framePadding: 20,
      photoGap: 12,
      photoRadius: 16,
      photoShadow: true,
      showHeader: true,
      headerText: '♡ ALWAYS & FOREVER ♡',
      headerFont: 'Syne',
      headerColor: '#E11D48',
      showFooter: true,
      footerText: 'WITH LOVE',
      footerSubtext: 'My Favorite Person',
      logoLanguage: 'ENG',
      showDate: true,
      showBarcode: true,
      showQrCode: true,
    }
  },
  {
    id: 'noir-minimalist',
    name: 'Noir Editorial',
    subtitle: 'Kontras tinggi hitam putih dengan tipografi elegan',
    previewBg: '#09090B',
    previewBorder: '#27272A',
    textColor: '#FAFAFA',
    settings: {
      layout: 'grid_2x2',
      photoShape: 'rect',
      filter: 'bw_noir',
      frameColor: '#09090B',
      patternId: 'pure-black',
      gradientEnabled: false,
      frameTexture: 'paper',
      framePadding: 24,
      photoGap: 16,
      photoRadius: 0,
      photoShadow: false,
      showHeader: true,
      headerText: 'BILIK FOTO / NOIR',
      headerFont: 'Syne',
      headerColor: '#FAFAFA',
      showFooter: true,
      footerText: 'EDISI SPESIAL',
      footerSubtext: 'Portofolio Estetik',
      logoLanguage: 'ENG',
      showDate: true,
      showBarcode: true,
      showQrCode: false,
    }
  },
  {
    id: 'warm-latte',
    name: 'Warm Mocha & Cafe',
    subtitle: 'Nuansa cokelat hangat yang nyaman dan santai',
    previewBg: '#EFEAE4',
    previewBorder: '#D6C0B3',
    textColor: '#443329',
    settings: {
      layout: 'strip_3',
      photoShape: 'rounded',
      filter: 'golden_hour',
      frameColor: '#EFEAE4',
      patternId: 'beige-latte',
      gradientEnabled: false,
      frameTexture: 'linen',
      framePadding: 22,
      photoGap: 14,
      photoRadius: 10,
      photoShadow: true,
      showHeader: true,
      headerText: 'WARM COFFEE & YOU',
      headerFont: 'Caveat',
      headerColor: '#443329',
      showFooter: true,
      footerText: 'Hari yang Menyenangkan',
      footerSubtext: 'Di sudut cafe favorit',
      logoLanguage: 'IDN',
      showDate: true,
      showBarcode: false,
      showQrCode: true,
    }
  }
];

export const DEFAULT_SETTINGS: CustomizationSettings = {
  layout: 'strip_4',
  photoShape: 'rect',
  filter: 'normal',
  filterIntensity: 85,
  frameColor: '#FFFFFF',
  patternId: 'pure-white',
  gradientEnabled: false,
  frameColor2: '#FCE7F3',
  gradientAngle: 135,
  frameTexture: 'none',
  framePadding: 20,
  photoGap: 12,
  photoRadius: 8,
  photoShadow: true,

  logoLanguage: 'ENG',

  showHeader: false,
  headerText: 'photobooth',
  headerFont: 'Plus Jakarta Sans',
  headerColor: '#18181B',
  headerSize: 18,

  showFooter: false,
  footerText: 'photobooth',
  footerSubtext: 'studio moments',
  footerFont: 'Plus Jakarta Sans',
  footerColor: '#18181B',

  showDate: false,
  dateFormat: 'short',
  customDateText: '',
  showTime: false,
  showLocation: false,
  locationText: 'Jakarta, ID',
  showBarcode: false,
  showQrCode: false,
  barcodeNumber: '899302194820',

  stickers: [],
  doodles: []
};

// Generates placeholder sample photos so the user sees a rich photo strip immediately
export function generateSamplePhotos(): string[] {
  const samples: string[] = [];
  const poses = [
    { bg: '#FDA4AF', emo: '✌️', text: 'Pose 1: V Sign', hat: '🎀' },
    { bg: '#93C5FD', emo: '😎', text: 'Pose 2: Kacamata Keren', hat: '⭐' },
    { bg: '#86EFAC', emo: '🥰', text: 'Pose 3: Hati Pipi', hat: '🌸' },
    { bg: '#FDE047', emo: '🤪', text: 'Pose 4: Wajah Lucu', hat: '👑' },
    { bg: '#D8B4FE', emo: '🤩', text: 'Pose 5: Bintang', hat: '✨' },
    { bg: '#FDBA74', emo: '📸', text: 'Pose 6: Jepret!', hat: '🎞️' },
  ];

  poses.forEach((pose) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 450);
    grad.addColorStop(0, pose.bg);
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 450);

    // Decorative backdrop rings
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(300, 225, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(300, 225, 200, 0, Math.PI * 2);
    ctx.stroke();

    // Cute Hat / Accessory
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pose.hat, 300, 140);

    // Main Emoji Face
    ctx.font = '110px sans-serif';
    ctx.fillText(pose.emo, 300, 250);

    // Pose text label
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(pose.text, 300, 320);

    ctx.fillStyle = '#64748B';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BilikFoto Studio Online', 300, 355);

    samples.push(canvas.toDataURL('image/jpeg', 0.9));
  });

  return samples;
}
