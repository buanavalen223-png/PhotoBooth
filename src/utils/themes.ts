import { StickerType } from '../types/photobooth';

/**
 * Single source of truth for the three Mochi PhotoBooth experiences.
 * The photo pipeline is shared; themes only change palette, typography and preset collections.
 */
export type ThemeId = 'straight' | 'guy' | 'slay';

export interface PresetCollection {
  id: string;
  label: string;
  frameIds: string[];
  stickers: StickerType[];
}

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  tagline: string;
  defaultFrameId: string;
  /** CSS custom properties applied to the app shell. */
  palette: Record<string, string>;
  collections: PresetCollection[];
}

export const THEME_STORAGE_KEY = 'mochi_theme_v1';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  slay: {
    id: 'slay',
    label: 'Slay',
    tagline: 'Cute pastel pink booth',
    defaultFrameId: 'pink-mochi-dream',
    palette: {}, // original pink design tokens from :root
    collections: [
      {
        id: 'pink-cute',
        label: 'Pink & Cute',
        frameIds: ['pink-mochi-dream', 'strawberry-milk-carton', 'coquette-ballet-bow', 'seoul-life-4cut'],
        stickers: ['heart-pink', 'heart-sparkle', 'bow-coquette', 'face-mochi', 'face-wink', 'cat-ears', 'bunny-ears'],
      },
      {
        id: 'dreamy',
        label: 'Dreamy',
        frameIds: ['lavender-cloud-9', 'soda-pop-sky', 'spring-daisy-garden'],
        stickers: ['star-pastel', 'star-gold', 'sparkle-magic', 'bow-lavender', 'doodle-cloud', 'flower-cherry', 'flower-daisy'],
      },
      {
        id: 'celebrate',
        label: 'Celebrate',
        frameIds: ['sweet-birthday-bash', 'besties-forever-club', 'couple-love-letter', 'graduation-confetti'],
        stickers: ['doodle-crown', 'doodle-music', 'heart-pink', 'star-gold'],
      },
      {
        id: 'seasonal',
        label: 'Seasonal',
        frameIds: ['spooky-pastel-halloween', 'winter-wonder-holiday'],
        stickers: ['star-gold', 'sparkle-magic', 'doodle-cloud'],
      },
    ],
  },
  guy: {
    id: 'guy',
    label: 'Guy',
    tagline: 'Bold comic, aviation & racing booth',
    defaultFrameId: 'comic-pow-blast',
    palette: {
      '--baby-pink': '#c7d6ea',
      '--baby-pink-deep': '#2563eb',
      '--baby-pink-soft': '#e8eef6',
      '--soft-lavender': '#cbd5e1',
      '--lavender-deep': '#1e3a8a',
      '--cream-white': '#eef2f7',
      '--pastel-blue': '#bfdbfe',
      '--soft-peach': '#fde68a',
      '--dark-text': '#0f172a',
      '--muted-text': '#475569',
      '--border-soft': '#cbd5e1',
      '--shadow-hover': '0 16px 38px rgba(30, 58, 138, 0.22)',
      '--radius-sm': '4px',
      '--radius-md': '6px',
      '--radius-lg': '8px',
      '--radius-pill': '6px',
      '--font-display': '"Arial Black", Impact, "Poppins", sans-serif',
      '--font-main': '"Poppins", Arial, sans-serif',
    },
    collections: [
      {
        id: 'comic',
        label: 'Comic / Action',
        frameIds: ['comic-pow-blast', 'comic-midnight-hero'],
        stickers: ['comic-pow', 'comic-boom', 'speech-bubble', 'lightning-bolt', 'star-gold'],
      },
      {
        id: 'aviation',
        label: 'Aviation',
        frameIds: ['aviation-blue-skies', 'aviation-night-cockpit'],
        stickers: ['airplane', 'pilot-wings', 'flight-badge', 'doodle-cloud'],
      },
      {
        id: 'racing',
        label: 'Racing',
        frameIds: ['racing-checkered'],
        stickers: ['checkered-flag', 'lightning-bolt', 'flight-badge'],
      },
      {
        id: 'street',
        label: 'Street / Mono',
        frameIds: ['midnight-velvet-chic', 'analog-35mm-film'],
        stickers: ['speech-bubble', 'doodle-music', 'lightning-bolt'],
      },
    ],
  },
  straight: {
    id: 'straight',
    label: 'Straight',
    tagline: 'Curated mix of clean styles',
    defaultFrameId: 'minimalist-cream-white',
    palette: {
      '--baby-pink': '#e5e7eb',
      '--baby-pink-deep': '#3b5b8c',
      '--baby-pink-soft': '#f3f4f6',
      '--soft-lavender': '#dbe3ee',
      '--lavender-deep': '#334155',
      '--cream-white': '#fafafa',
      '--pastel-blue': '#dbeafe',
      '--soft-peach': '#fde7d4',
      '--dark-text': '#1f2937',
      '--muted-text': '#6b7280',
      '--border-soft': '#e5e7eb',
      '--shadow-hover': '0 16px 38px rgba(51, 65, 85, 0.16)',
      '--radius-sm': '8px',
      '--radius-md': '12px',
      '--radius-lg': '16px',
      '--radius-pill': '999px',
      '--font-display': '"Poppins", "Nunito", sans-serif',
    },
    collections: [
      {
        id: 'classic',
        label: 'Classic',
        frameIds: ['seoul-life-4cut', 'analog-35mm-film'],
        stickers: ['star-gold', 'doodle-music'],
      },
      {
        id: 'minimal',
        label: 'Minimal',
        frameIds: ['minimalist-cream-white', 'midnight-velvet-chic'],
        stickers: ['star-gold', 'sparkle-magic'],
      },
      {
        id: 'cute',
        label: 'Cute',
        frameIds: ['pink-mochi-dream', 'lavender-cloud-9'],
        stickers: ['heart-pink', 'bow-coquette', 'face-mochi', 'flower-cherry'],
      },
      {
        id: 'comic',
        label: 'Comic',
        frameIds: ['comic-pow-blast'],
        stickers: ['comic-pow', 'speech-bubble', 'lightning-bolt'],
      },
      {
        id: 'adventure',
        label: 'Adventure',
        frameIds: ['aviation-blue-skies', 'soda-pop-sky', 'racing-checkered'],
        stickers: ['airplane', 'flight-badge', 'doodle-cloud', 'checkered-flag'],
      },
      {
        id: 'seasonal',
        label: 'Seasonal',
        frameIds: ['sweet-birthday-bash', 'spooky-pastel-halloween', 'winter-wonder-holiday'],
        stickers: ['doodle-crown', 'star-gold', 'sparkle-magic'],
      },
    ],
  },
};

export const THEME_ORDER: ThemeId[] = ['straight', 'guy', 'slay'];

export function isThemeId(v: unknown): v is ThemeId {
  return v === 'straight' || v === 'guy' || v === 'slay';
}

export function loadStoredTheme(): ThemeId | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(v) ? v : null;
  } catch {
    return null;
  }
}

export function storeTheme(id: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // storage blocked: theme still works for this session
  }
}

export function themeFrameIds(id: ThemeId): string[] {
  return Array.from(new Set(THEMES[id].collections.flatMap((c) => c.frameIds)));
}
