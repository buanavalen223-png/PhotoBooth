import {
  LayoutConfig,
  LayoutId,
  PhotoSlotRect,
  FrameTheme,
  FrameCategory,
  FilterId,
  StickerType,
  CameraResolutionOption,
  ImageAdjustments,
  BoothCustomization,
} from '../types/photobooth';

export const LAYOUT_CONFIGS: LayoutConfig[] = [
  {
    id: 'classic-strip-4',
    name: 'Classic Korean Strip',
    subtitle: '4 vertical photos • Iconic life4cuts style',
    photoCount: 4,
    canvasWidth: 600,
    canvasHeight: 1800,
    aspectLabel: '1:3 Strip',
    defaultPadding: 44,
    defaultGap: 24,
    bottomFooterHeight: 160,
  },
  {
    id: 'mini-strip-3',
    name: 'Mini Strip',
    subtitle: '3 vertical photos • Compact & sweet',
    photoCount: 3,
    canvasWidth: 600,
    canvasHeight: 1420,
    aspectLabel: '3-Cut Strip',
    defaultPadding: 44,
    defaultGap: 24,
    bottomFooterHeight: 150,
  },
  {
    id: 'double-strip-8',
    name: 'Double Strip',
    subtitle: '8 photos in 2 columns • Twin booth strips',
    photoCount: 8,
    canvasWidth: 1200,
    canvasHeight: 1800,
    aspectLabel: '2×4 Twin Strip',
    defaultPadding: 48,
    defaultGap: 24,
    bottomFooterHeight: 160,
  },
  {
    id: 'square-collage-4',
    name: 'Square Collage',
    subtitle: '4 photos in balanced 1:1 aesthetic frame',
    photoCount: 4,
    canvasWidth: 1200,
    canvasHeight: 1200,
    aspectLabel: '1:1 Square',
    defaultPadding: 64,
    defaultGap: 32,
    bottomFooterHeight: 140,
  },
  {
    id: 'grid-2x2',
    name: 'Grid 2×2',
    subtitle: '4 portrait photos in a 2×2 magazine grid',
    photoCount: 4,
    canvasWidth: 1080,
    canvasHeight: 1350,
    aspectLabel: '4:5 Portrait',
    defaultPadding: 56,
    defaultGap: 28,
    bottomFooterHeight: 150,
  },
  {
    id: 'grid-2x3',
    name: 'Grid 2×3',
    subtitle: '6 photos in 2 columns × 3 rows',
    photoCount: 6,
    canvasWidth: 1080,
    canvasHeight: 1620,
    aspectLabel: '2:3 Poster',
    defaultPadding: 54,
    defaultGap: 24,
    bottomFooterHeight: 150,
  },
  {
    id: 'grid-3x2',
    name: 'Grid 3×2',
    subtitle: '6 photos in 3 columns × 2 rows landscape',
    photoCount: 6,
    canvasWidth: 1620,
    canvasHeight: 1180,
    aspectLabel: 'Wide 3×2',
    defaultPadding: 54,
    defaultGap: 24,
    bottomFooterHeight: 135,
  },
  {
    id: 'single-portrait',
    name: 'Single Portrait',
    subtitle: '1 large studio portrait with cute border',
    photoCount: 1,
    canvasWidth: 1080,
    canvasHeight: 1350,
    aspectLabel: '4:5 Studio',
    defaultPadding: 68,
    defaultGap: 0,
    bottomFooterHeight: 160,
  },
  {
    id: 'polaroid-style',
    name: 'Polaroid Style',
    subtitle: '1 square instant photo with wide caption chin',
    photoCount: 1,
    canvasWidth: 1080,
    canvasHeight: 1320,
    aspectLabel: 'Instant Print',
    defaultPadding: 76,
    defaultGap: 0,
    bottomFooterHeight: 260,
  },
  {
    id: 'free-collage',
    name: 'Free Collage',
    subtitle: '4 tilted scrapbook-style playful snapshots',
    photoCount: 4,
    canvasWidth: 1200,
    canvasHeight: 1350,
    aspectLabel: 'Scrapbook',
    defaultPadding: 70,
    defaultGap: 28,
    bottomFooterHeight: 155,
  },
];

export function getLayoutById(id: LayoutId): LayoutConfig {
  return LAYOUT_CONFIGS.find((l) => l.id === id) || LAYOUT_CONFIGS[0];
}

/**
 * Computes exact pixel coordinates for each photo slot based on layout, gap, and border radius.
 */
export function computeLayoutSlots(
  layoutId: LayoutId,
  customGap?: number,
  borderRadius = 16
): PhotoSlotRect[] {
  const config = getLayoutById(layoutId);
  const pad = config.defaultPadding;
  const gap = customGap !== undefined ? Math.max(0, Math.min(64, customGap)) : config.defaultGap;
  const topHeader = 76;
  const availW = config.canvasWidth - pad * 2;
  const availH = config.canvasHeight - pad - topHeader - config.bottomFooterHeight;

  const slots: PhotoSlotRect[] = [];

  switch (layoutId) {
    case 'classic-strip-4': {
      const count = 4;
      const slotH = (availH - gap * (count - 1)) / count;
      for (let i = 0; i < count; i++) {
        slots.push({
          x: pad,
          y: pad + topHeader + i * (slotH + gap),
          width: availW,
          height: slotH,
          borderRadius,
        });
      }
      break;
    }
    case 'mini-strip-3': {
      const count = 3;
      const slotH = (availH - gap * (count - 1)) / count;
      for (let i = 0; i < count; i++) {
        slots.push({
          x: pad,
          y: pad + topHeader + i * (slotH + gap),
          width: availW,
          height: slotH,
          borderRadius,
        });
      }
      break;
    }
    case 'double-strip-8': {
      const cols = 2;
      const rows = 4;
      const colGap = Math.max(gap, 36);
      const slotW = (availW - colGap) / cols;
      const slotH = (availH - gap * (rows - 1)) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({
            x: pad + c * (slotW + colGap),
            y: pad + topHeader + r * (slotH + gap),
            width: slotW,
            height: slotH,
            borderRadius,
          });
        }
      }
      break;
    }
    case 'square-collage-4':
    case 'grid-2x2': {
      const cols = 2;
      const rows = 2;
      const slotW = (availW - gap) / cols;
      const slotH = (availH - gap) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({
            x: pad + c * (slotW + gap),
            y: pad + topHeader + r * (slotH + gap),
            width: slotW,
            height: slotH,
            borderRadius,
          });
        }
      }
      break;
    }
    case 'grid-2x3': {
      const cols = 2;
      const rows = 3;
      const slotW = (availW - gap) / cols;
      const slotH = (availH - gap * (rows - 1)) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({
            x: pad + c * (slotW + gap),
            y: pad + topHeader + r * (slotH + gap),
            width: slotW,
            height: slotH,
            borderRadius,
          });
        }
      }
      break;
    }
    case 'grid-3x2': {
      const cols = 3;
      const rows = 2;
      const slotW = (availW - gap * (cols - 1)) / cols;
      const slotH = (availH - gap) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({
            x: pad + c * (slotW + gap),
            y: pad + topHeader + r * (slotH + gap),
            width: slotW,
            height: slotH,
            borderRadius,
          });
        }
      }
      break;
    }
    case 'single-portrait': {
      slots.push({
        x: pad,
        y: pad + topHeader,
        width: availW,
        height: availH,
        borderRadius,
      });
      break;
    }
    case 'polaroid-style': {
      const side = Math.min(availW, availH);
      const offsetX = pad + (availW - side) / 2;
      slots.push({
        x: offsetX,
        y: pad + 30,
        width: side,
        height: side,
        borderRadius: Math.min(borderRadius, 12),
      });
      break;
    }
    case 'free-collage': {
      const cols = 2;
      const rows = 2;
      const slotW = (availW - gap * 1.4) / cols;
      const slotH = (availH - gap * 1.4) / rows;
      const angles = [-3.5, 2.8, 2.4, -3.0];
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({
            x: pad + c * (slotW + gap * 1.4) + (r % 2 === 0 ? 6 : -6),
            y: pad + topHeader + r * (slotH + gap * 1.4),
            width: slotW,
            height: slotH,
            rotation: angles[idx % angles.length],
            borderRadius,
          });
          idx++;
        }
      }
      break;
    }
  }

  return slots;
}

export const FRAME_CATEGORIES: FrameCategory[] = [
  'All',
  'Pink Cute',
  'Korean Classic',
  'Purple Dream',
  'Blue Sky',
  'Strawberry Milk',
  'Coquette Ribbon',
  'Minimalist White',
  'Black Chic',
  'Retro Film',
  'Flower Garden',
  'Birthday',
  'Best Friends',
  'Couple Memories',
  'Graduation',
  'Halloween',
  'Holiday',
];

export const FRAME_THEMES: FrameTheme[] = [
  {
    id: 'pink-mochi-dream',
    name: 'Pink Mochi Dream',
    category: 'Pink Cute',
    bgColor: '#FFC9DE',
    secondaryBg: '#FFE5F0',
    patternType: 'hearts',
    borderColor: '#FFFFFF',
    textColor: '#5E2B42',
    accentColor: '#FF6B9E',
    defaultHeaderText: '✨ MOCHI BOOTH ✨',
    defaultFooterText: 'Little moments, forever memories ♡',
    badgeIcon: '🌸',
    description: 'Sweet pastel baby pink with floating micro hearts & creamy borders.',
  },
  {
    id: 'seoul-life-4cut',
    name: 'Seoul Studio Classic',
    category: 'Korean Classic',
    bgColor: '#F7F4EF',
    secondaryBg: '#EAE4DC',
    patternType: 'solid',
    borderColor: '#393343',
    textColor: '#393343',
    accentColor: '#9E8FB2',
    defaultHeaderText: 'MOCHI STUDIO • SEOUL',
    defaultFooterText: 'LIFE IN FOUR CUTS',
    badgeIcon: '🎞️',
    description: 'Clean Korean self-photo studio aesthetic with crisp typography.',
  },
  {
    id: 'lavender-cloud-9',
    name: 'Lavender Cloud 9',
    category: 'Purple Dream',
    bgColor: '#DCCFFF',
    secondaryBg: '#F1EBFF',
    patternType: 'stars',
    borderColor: '#FFFFFF',
    textColor: '#3D2C63',
    accentColor: '#8C65F7',
    defaultHeaderText: '☁️ DREAMY LAVENDER ☁️',
    defaultFooterText: 'Stardust & sweet memories ✦',
    badgeIcon: '🔮',
    description: 'Soft lavender haze decorated with dreamy pastel sparkles.',
  },
  {
    id: 'soda-pop-sky',
    name: 'Soda Pop Blue Sky',
    category: 'Blue Sky',
    bgColor: '#CDEBFF',
    secondaryBg: '#EAF6FF',
    patternType: 'dots',
    borderColor: '#FFFFFF',
    textColor: '#234661',
    accentColor: '#4BA3E3',
    defaultHeaderText: '🫧 BLUE SKY CLUB 🫧',
    defaultFooterText: 'Clear skies & happy smiles',
    badgeIcon: '☁️',
    description: 'Refreshing pastel blue with playful polka dots and airy vibes.',
  },
  {
    id: 'strawberry-milk-carton',
    name: 'Strawberry Milk 🍓',
    category: 'Strawberry Milk',
    bgColor: '#FFD6E6',
    secondaryBg: '#FFF9F2',
    patternType: 'grid',
    borderColor: '#FF85A2',
    textColor: '#692338',
    accentColor: '#FF4F79',
    defaultHeaderText: '🍓 STRAWBERRY MILK 100%',
    defaultFooterText: 'Sweet & Fresh Daily!',
    badgeIcon: '🍓',
    description: 'Cute picnic gingham check in strawberry pink and cream white.',
  },
  {
    id: 'coquette-ballet-bow',
    name: 'Coquette Ballet Ribbon',
    category: 'Coquette Ribbon',
    bgColor: '#FFF5F8',
    secondaryBg: '#FFC9DE',
    patternType: 'ribbons',
    borderColor: '#F4A9C7',
    textColor: '#543342',
    accentColor: '#E06C9F',
    defaultHeaderText: '🎀 COQUETTE DIARIES 🎀',
    defaultFooterText: 'aced with ribbons & grace',
    badgeIcon: '🎀',
    description: 'Delicate bows and pearl-inspired soft blush aesthetic.',
  },
  {
    id: 'minimalist-cream-white',
    name: 'Pure Cream Minimal',
    category: 'Minimalist White',
    bgColor: '#FFF9F2',
    secondaryBg: '#FFFFFF',
    patternType: 'solid',
    borderColor: '#E6DEC8',
    textColor: '#393343',
    accentColor: '#B8A99A',
    defaultHeaderText: 'MOCHI BOOTH',
    defaultFooterText: 'timeless moments.',
    badgeIcon: '🤍',
    description: 'Warm cream white gallery frame that lets your photos shine.',
  },
  {
    id: 'midnight-velvet-chic',
    name: 'Midnight Black Chic',
    category: 'Black Chic',
    bgColor: '#231F29',
    secondaryBg: '#393343',
    patternType: 'stars',
    borderColor: '#FFC9DE',
    textColor: '#FFF9F2',
    accentColor: '#FFC9DE',
    defaultHeaderText: '✦ AFTER HOURS BOOTH ✦',
    defaultFooterText: 'Too glam to give a damn',
    badgeIcon: '🖤',
    description: 'High-contrast dark charcoal frame with baby pink neon accents.',
  },
  {
    id: 'analog-35mm-film',
    name: '90s Analog Film Roll',
    category: 'Retro Film',
    bgColor: '#2B2623',
    secondaryBg: '#FFDCC8',
    patternType: 'film',
    borderColor: '#F5E6D3',
    textColor: '#FFDCC8',
    accentColor: '#FF9E6D',
    defaultHeaderText: 'KODAK MOCHI 400 • 35MM',
    defaultFooterText: 'EXP 24 • ANALOG MEMORIES',
    badgeIcon: '📷',
    description: 'Authentic film sprocket holes with warm peach vintage lettering.',
  },
  {
    id: 'spring-daisy-garden',
    name: 'Peachy Daisy Garden',
    category: 'Flower Garden',
    bgColor: '#FFDCC8',
    secondaryBg: '#FFF9F2',
    patternType: 'flowers',
    borderColor: '#FFFFFF',
    textColor: '#5C3A28',
    accentColor: '#FF8A5B',
    defaultHeaderText: '🌼 FLOWER GARDEN 🌼',
    defaultFooterText: 'Blooming together every day',
    badgeIcon: '🌼',
    description: 'Soft peach sunshine scattered with hand-drawn pastel daisies.',
  },
  {
    id: 'sweet-birthday-bash',
    name: 'Birthday Cake Confetti',
    category: 'Birthday',
    bgColor: '#FFF0F6',
    secondaryBg: '#CDEBFF',
    patternType: 'dots',
    borderColor: '#FFB3D1',
    textColor: '#4A2C40',
    accentColor: '#FF5C93',
    defaultHeaderText: '🎂 HAPPY BIRTHDAY TO YOU! 🎉',
    defaultFooterText: 'Make a wish & smile big ✨',
    badgeIcon: '🎂',
    description: 'Festive pastel sprinkles and birthday party celebration vibes.',
  },
  {
    id: 'besties-forever-club',
    name: 'Best Friends Club',
    category: 'Best Friends',
    bgColor: '#E5DBFF',
    secondaryBg: '#FFC9DE',
    patternType: 'gradient',
    borderColor: '#FFFFFF',
    textColor: '#393343',
    accentColor: '#FF6B9E',
    defaultHeaderText: '👯‍♀️ BESTIES FOREVER CLUB 💖',
    defaultFooterText: 'Partners in crime since day one',
    badgeIcon: '🫶',
    description: 'Cotton candy pink-to-lavender gradient for you and your BFF.',
  },
  {
    id: 'couple-love-letter',
    name: 'Couple Love Note',
    category: 'Couple Memories',
    bgColor: '#FFE3EC',
    secondaryBg: '#FFF9F2',
    patternType: 'hearts',
    borderColor: '#FF9EBB',
    textColor: '#592236',
    accentColor: '#E84A7F',
    defaultHeaderText: '💌 YOU + ME = FOREVER 💌',
    defaultFooterText: 'My favorite place is next to you ♡',
    badgeIcon: '💕',
    description: 'Romantic blush frame with sweet love notes and twin hearts.',
  },
  {
    id: 'graduation-confetti',
    name: 'Class Grad Honors',
    category: 'Graduation',
    bgColor: '#E8F2FF',
    secondaryBg: '#FFF9F2',
    patternType: 'stars',
    borderColor: '#486581',
    textColor: '#243B53',
    accentColor: '#F0B429',
    defaultHeaderText: '🎓 CONGRATS GRADUATE! 🎓',
    defaultFooterText: 'The tassel was worth the hassle ★',
    badgeIcon: '🎓',
    description: 'Proud sky blue & gold star accents for graduation milestones.',
  },
  {
    id: 'spooky-pastel-halloween',
    name: 'Spooky Pastel Boo!',
    category: 'Halloween',
    bgColor: '#3B2D4A',
    secondaryBg: '#FFDCC8',
    patternType: 'stars',
    borderColor: '#FF9F68',
    textColor: '#FFDCC8',
    accentColor: '#C59BFF',
    defaultHeaderText: '👻 SPOOKY & CUTE BOOTH 🎃',
    defaultFooterText: 'Creepin’ it real cute tonight',
    badgeIcon: '🎃',
    description: 'Witchy plum purple and pastel pumpkin peach for Halloween.',
  },
  {
    id: 'winter-wonder-holiday',
    name: 'Cozy Winter Holiday',
    category: 'Holiday',
    bgColor: '#DFF3FF',
    secondaryBg: '#FFE3EC',
    patternType: 'stripes',
    borderColor: '#FFFFFF',
    textColor: '#2A4359',
    accentColor: '#E64980',
    defaultHeaderText: '❄️ SNOWY MOCHI HOLIDAY ⛄',
    defaultFooterText: 'Warm hugs & cocoa wishes',
    badgeIcon: '❄️',
    description: 'Candy-cane pastel stripes and frosty winter wonderland charm.',
  },
];

export function getFrameById(id: string): FrameTheme {
  return FRAME_THEMES.find((f) => f.id === id) || FRAME_THEMES[0];
}

export interface FilterDefinition {
  id: FilterId;
  name: string;
  badge: string;
  description: string;
}

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  { id: 'original', name: 'Original', badge: '✨', description: 'True natural camera colors' },
  { id: 'warm', name: 'Warm Peach', badge: '🍑', description: 'Golden hour cozy warmth' },
  { id: 'cool', name: 'Cool Soda', badge: '🧊', description: 'Crisp airy blue tone' },
  { id: 'vintage', name: 'Vintage Cream', badge: '🎞️', description: 'Faded nostalgic film look' },
  { id: 'retro', name: '90s Retro', badge: '📼', description: 'Punchy warm retro contrast' },
  { id: 'soft-pink', name: 'Soft Pink', badge: '🌸', description: 'K-beauty rosy skin glow' },
  { id: 'lavender', name: 'Lavender Haze', badge: '💜', description: 'Dreamy lilac tint' },
  { id: 'film', name: 'Analog Film', badge: '📷', description: 'Warm 35mm cinema grain tone' },
  { id: 'dreamy-pastel', name: 'Dreamy Pastel', badge: '☁️', description: 'Soft airy cotton-candy glow' },
  { id: 'grayscale', name: 'B&W Studio', badge: '🖤', description: 'Classic monochrome portrait' },
  { id: 'sepia', name: 'Warm Sepia', badge: '🍂', description: 'Antique brown photograph' },
  { id: 'bright', name: 'Idol Bright', badge: '💡', description: 'Lifted luminous studio light' },
  { id: 'contrast', name: 'Pop Contrast', badge: '⚡', description: 'Crisp shadows & vivid pop' },
];

export interface StickerCatalogItem {
  type: StickerType;
  label: string;
  category: 'Hearts & Stars' | 'Flowers & Bows' | 'Cute & Doodles';
  emojiPreview: string;
}

export const STICKER_CATALOG: StickerCatalogItem[] = [
  { type: 'heart-pink', label: 'Puffy Pink Heart', category: 'Hearts & Stars', emojiPreview: '💖' },
  { type: 'heart-sparkle', label: 'Berry Heart', category: 'Hearts & Stars', emojiPreview: '💘' },
  { type: 'star-gold', label: 'Twinkle Star', category: 'Hearts & Stars', emojiPreview: '⭐' },
  { type: 'star-pastel', label: 'Lavender Star', category: 'Hearts & Stars', emojiPreview: '🌟' },
  { type: 'sparkle-magic', label: 'Magic Sparkles', category: 'Hearts & Stars', emojiPreview: '✨' },
  { type: 'flower-cherry', label: 'Sakura Blossom', category: 'Flowers & Bows', emojiPreview: '🌸' },
  { type: 'flower-daisy', label: 'Happy Daisy', category: 'Flowers & Bows', emojiPreview: '🌼' },
  { type: 'bow-coquette', label: 'Coquette Pink Bow', category: 'Flowers & Bows', emojiPreview: '🎀' },
  { type: 'bow-lavender', label: 'Lilac Ribbon', category: 'Flowers & Bows', emojiPreview: '🎗️' },
  { type: 'face-mochi', label: 'Happy Mochi Face', category: 'Cute & Doodles', emojiPreview: '😊' },
  { type: 'face-wink', label: 'Kawaii Wink', category: 'Cute & Doodles', emojiPreview: '😉' },
  { type: 'cat-ears', label: 'Kitty Ears', category: 'Cute & Doodles', emojiPreview: '🐱' },
  { type: 'bunny-ears', label: 'Bunny Ears', category: 'Cute & Doodles', emojiPreview: '🐰' },
  { type: 'doodle-crown', label: 'Princess Crown', category: 'Cute & Doodles', emojiPreview: '👑' },
  { type: 'doodle-cloud', label: 'Fluffy Cloud', category: 'Cute & Doodles', emojiPreview: '☁️' },
  { type: 'doodle-music', label: 'Melody Note', category: 'Cute & Doodles', emojiPreview: '🎵' },
];

export const CAMERA_RESOLUTIONS: CameraResolutionOption[] = [
  { label: 'HD Standard (1280×720)', width: 1280, height: 720 },
  { label: 'Full HD Crisp (1920×1080)', width: 1920, height: 1080 },
  { label: 'Square Friendly (1080×1080)', width: 1080, height: 1080 },
  { label: 'Compact Fast (640×480)', width: 640, height: 480 },
];

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  filter: 'original',
  brightness: 0,
  contrast: 0,
  saturation: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  rotation: 0,
  flipH: false,
};

export const DEFAULT_CUSTOMIZATION: BoothCustomization = {
  layoutId: 'classic-strip-4',
  frameId: 'pink-mochi-dream',
  customBgColor: null,
  photoGap: 24,
  borderThickness: 6,
  borderRadius: 18,
  showDateStamp: true,
  customFooterCaption: 'Little moments, forever memories ♡',
  transparentBg: false,
};

export const QUICK_TEXT_PRESETS = [
  'Besties Forever 💖',
  'Mochi Memories ✨',
  'October 2026 📸',
  'So Cute!! 🌸',
  ' Seoul Life 4 Cuts ',
  'Happy Day ♡',
];

