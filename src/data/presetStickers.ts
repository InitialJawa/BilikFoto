export interface StickerTemplate {
  id: string;
  category: 'photobooth_io' | 'indo' | 'korean' | 'y2k' | 'vintage' | 'emoji';
  categoryLabel: string;
  type: 'svg' | 'emoji' | 'badge';
  label: string;
  content: string;
  badge?: 'new' | 'special' | 'hot';
  defaultColor?: string;
  bg?: string;
  border?: string;
}

export const STICKER_CATEGORIES = [
  { id: 'all', label: 'Semua Stiker' },
  { id: 'photobooth_io', label: '🌸 Viral Photobooth' },
  { id: 'indo', label: '🇮🇩 Stiker Indo' },
  { id: 'korean', label: '🎀 Cute Korea' },
  { id: 'y2k', label: '⭐ Y2K Aesthetic' },
  { id: 'vintage', label: '🎞️ Vintage & Cap' },
];

export const PRESET_STICKERS: StickerTemplate[] = [
  // ================= EXACT PHOTOBOOTH-IO VIRAL COLLECTION =================
  // Row 1
  { id: 'pb-bunny', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Bunny', content: '🐰' },
  { id: 'pb-clover', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Four Leaf Clover', content: '🍀' },
  { id: 'pb-kiss', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Red Kiss Mark', content: '💋' },
  { id: 'pb-pink-heart', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Pink Heart', content: '💗' },
  { id: 'pb-red-bow', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Red Bow', content: '🎀' },

  // Row 2
  { id: 'pb-sparkle-star', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Sparkle Star', content: '✨' },
  { id: 'pb-pearl-heart', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'White Pearl Heart', content: '🤍' },
  { id: 'pb-seal', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Cute Seal', content: '🦭' },
  { id: 'pb-magic-dots', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Magic Dots', content: '🎆' },
  { id: 'pb-pink-laces', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Pink Laces', content: '🎗️' },
  { id: 'pb-blue-laces', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Blue Laces', content: '🧵' },

  // Row 3
  { id: 'pb-black-star', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Black Star', content: '✦' },
  { id: 'pb-duckling', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Yellow Duck', content: '🐥' },
  { id: 'pb-teddy', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Teddy Bear', content: '🧸' },
  { id: 'pb-glossy-heart', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: '3D Glossy Heart', content: '💖' },
  { id: 'pb-screaming-cat', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Screaming Cat', content: '🙀' },
  { id: 'pb-cute-cat', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Meme Cat', content: '🐱' },

  // Row 4
  { id: 'pb-puppy', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'White Puppy', content: '🐶' },
  { id: 'pb-sakura', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Cherry Blossom', content: '🌸' },
  { id: 'pb-chibi-trio', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Anime Trio', content: '👥' },
  { id: 'pb-triangle-black', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Down Triangle', content: '▼' },
  { id: 'pb-triangle-white', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'White Triangle', content: '▽' },
  { id: 'pb-happy-birthday', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'badge', label: 'Happy Birthday', content: 'Happy Birthday 🎂', badge: 'new', bg: '#FFF0F5', border: '#F472B6', defaultColor: '#DB2777' },

  // Row 5 [NEW]
  { id: 'pb-bouquet', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Flower Bouquet', content: '💐', badge: 'new' },
  { id: 'pb-strawberry', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Strawberry', content: '🍓', badge: 'new' },
  { id: 'pb-peach', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Juicy Peach', content: '🍑', badge: 'new' },
  { id: 'pb-bunny-doll', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Bunny Plushie', content: '🐇', badge: 'new' },
  { id: 'pb-hibiscus', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Hibiscus Flower', content: '🌺', badge: 'new' },
  { id: 'pb-koi-fish', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Koi Fish', content: '🎏', badge: 'new' },

  // Row 6 [NEW]
  { id: 'pb-chrome-dollar', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'badge', label: 'Chrome $', content: '$', badge: 'new', bg: '#E2E8F0', border: '#94A3B8', defaultColor: '#1E293B' },
  { id: 'pb-iloveme', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'badge', label: 'I Love Me', content: 'I ❤️ ME', badge: 'new', bg: '#FFFFFF', border: '#18181B', defaultColor: '#18181B' },
  { id: 'pb-matcha-cup', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Matcha Cup', content: '🍵', badge: 'new' },
  { id: 'pb-chanel-tag', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'badge', label: 'Luxe Ribbon', content: 'CHIC 🎀', badge: 'new', bg: '#FCE7F3', border: '#F472B6', defaultColor: '#9D174D' },
  { id: 'pb-mario-mushroom', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Super Mushroom', content: '🍄', badge: 'new' },
  { id: 'pb-sims-pink', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Pink Crystal', content: '💎', badge: 'new' },

  // Row 7 [SPECIAL]
  { id: 'pb-sims-green', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'badge', label: 'Sims Plumbob', content: '❇️ SIMS', badge: 'new', bg: '#DCFCE7', border: '#22C55E', defaultColor: '#15803D' },
  { id: 'pb-gingerbread', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Gingerbread Man', content: '🍪', badge: 'special' },
  { id: 'pb-stocking', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Xmas Stocking', content: '🧦', badge: 'special' },
  { id: 'pb-grinch', category: 'photobooth_io', categoryLabel: 'Viral Photobooth', type: 'emoji', label: 'Holiday Monster', content: '🎄', badge: 'special' },

  // ================= INDONESIAN AESTHETIC STICKERS =================
  {
    id: 'indo-gemes',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Gemes Banget',
    content: 'GEMES BGT! 🎀',
    bg: '#FFF0F5',
    border: '#FF69B4',
    defaultColor: '#C71585'
  },
  {
    id: 'indo-bestie',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Bestie Abadi',
    content: 'BESTIE FOREVER 👯‍♀️',
    bg: '#E0F2FE',
    border: '#38BDF8',
    defaultColor: '#0284C7'
  },
  {
    id: 'indo-cantik',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Cantik Hari Ini',
    content: 'CANTIK HARI INI ✨',
    bg: '#FEF3C7',
    border: '#FBBF24',
    defaultColor: '#B45309'
  },
  {
    id: 'indo-ganteng',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Ganteng Maksimal',
    content: 'GANTENG MAKSIMAL 😎',
    bg: '#DCFCE7',
    border: '#4ADE80',
    defaultColor: '#15803D'
  },
  {
    id: 'indo-kenangan',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Bilik Kenangan',
    content: 'BILIK KENANGAN 📸',
    bg: '#18181B',
    border: '#FFFFFF',
    defaultColor: '#FFFFFF'
  },
  {
    id: 'indo-cinta',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Sayang Kamu',
    content: 'LUV YOU SO MUCH 💕',
    bg: '#FFE4E6',
    border: '#FB7185',
    defaultColor: '#E11D48'
  },
  {
    id: 'indo-wkwk',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Wkwkwk',
    content: 'WKWKWK 😆✌️',
    bg: '#F3E8FF',
    border: '#C084FC',
    defaultColor: '#9333EA'
  },
  {
    id: 'indo-gaskeun',
    category: 'indo',
    categoryLabel: 'Stiker Indo',
    type: 'badge',
    label: 'Gaskeun',
    content: 'GASKEUN! 🔥',
    bg: '#FFEDD5',
    border: '#FB923C',
    defaultColor: '#C2410C'
  },

  // ================= Y2K AESTHETIC =================
  {
    id: 'y2k-cyberstar',
    category: 'y2k',
    categoryLabel: 'Y2K Aesthetic',
    type: 'badge',
    label: 'Y2K Star',
    content: '★ 2000s BABY ★',
    bg: '#000000',
    border: '#38BDF8',
    defaultColor: '#38BDF8'
  },
  { id: 'y2k-cd', category: 'y2k', categoryLabel: 'Y2K Aesthetic', type: 'emoji', label: 'CD Disc', content: '💿' },
  { id: 'y2k-butterfly', category: 'y2k', categoryLabel: 'Y2K Aesthetic', type: 'emoji', label: 'Blue Butterfly', content: '🦋' },
  { id: 'y2k-alien', category: 'y2k', categoryLabel: 'Y2K Aesthetic', type: 'emoji', label: 'Alien', content: '👽' },
  { id: 'y2k-dice', category: 'y2k', categoryLabel: 'Y2K Aesthetic', type: 'emoji', label: 'Dice', content: '🎲' },
  { id: 'y2k-fire', category: 'y2k', categoryLabel: 'Y2K Aesthetic', type: 'emoji', label: 'Flame Fire', content: '🔥' },

  // ================= VINTAGE & STAMPS =================
  {
    id: 'vt-film-roll',
    category: 'vintage',
    categoryLabel: 'Vintage & Cap',
    type: 'badge',
    label: '35mm Film',
    content: '🎞️ 35mm ISO 400',
    bg: '#F5F5F4',
    border: '#78716C',
    defaultColor: '#292524'
  },
  {
    id: 'vt-polaroid',
    category: 'vintage',
    categoryLabel: 'Vintage & Cap',
    type: 'badge',
    label: 'Original Shot',
    content: 'POLAROID • ORIGINAL',
    bg: '#FFFFFF',
    border: '#E2E8F0',
    defaultColor: '#0F172A'
  },
  {
    id: 'vt-date-stamp',
    category: 'vintage',
    categoryLabel: 'Vintage & Cap',
    type: 'badge',
    label: 'Rec Stamp',
    content: '● REC 00:24:19',
    bg: '#991B1B',
    border: '#EF4444',
    defaultColor: '#FFFFFF'
  },
  { id: 'vt-camera', category: 'vintage', categoryLabel: 'Vintage & Cap', type: 'emoji', label: 'Vintage Camera', content: '📷' },
  { id: 'vt-ticket', category: 'vintage', categoryLabel: 'Vintage & Cap', type: 'emoji', label: 'Admission Ticket', content: '🎟️' },
];
