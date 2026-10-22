import { ThemeId } from './themes';

export interface FilterDefinition {
  id: string;
  name: string;
  theme: ThemeId | 'all';
  badge: string;
  description: string;
  cssFilter: string;
  tintColor: string | null;
  tintAlpha: number;
  vignette?: number; // 0 to 1 intensity
  grain?: number; // 0 to 1 intensity
  halftone?: boolean;
  sparkles?: boolean;
  glow?: boolean;
}

export const THEME_FILTERS: FilterDefinition[] = [
  // ==========================
  // ORIGINAL / NEUTRAL
  // ==========================
  {
    id: 'original',
    name: 'Original',
    theme: 'all',
    badge: '✨',
    description: 'Natural authentic camera tones',
    cssFilter: 'none',
    tintColor: null,
    tintAlpha: 0,
  },

  // ==========================
  // SLAY THEME FILTERS (6)
  // ==========================
  {
    id: 'slay-dreamy',
    name: 'Dreamy Pastel',
    theme: 'slay',
    badge: '🌸',
    description: 'Soft highlights, luminous skin & gentle pastel glow',
    cssFilter: 'brightness(107%) contrast(96%) saturate(112%)',
    tintColor: '#FFE4F0',
    tintAlpha: 0.12,
    glow: true,
  },
  {
    id: 'slay-rosy',
    name: 'Rosy Glow',
    theme: 'slay',
    badge: '🌷',
    description: 'K-beauty peach-pink blush & warm rosy skin tone',
    cssFilter: 'brightness(105%) contrast(102%) saturate(120%) sepia(8%)',
    tintColor: '#FFAEC9',
    tintAlpha: 0.14,
  },
  {
    id: 'slay-film-diary',
    name: 'Film Diary',
    theme: 'slay',
    badge: '📷',
    description: 'Nostalgic 35mm disposable camera aesthetic with fine grain',
    cssFilter: 'contrast(106%) brightness(102%) saturate(94%) sepia(18%)',
    tintColor: '#FFF3DF',
    tintAlpha: 0.12,
    grain: 0.18,
    vignette: 0.22,
  },
  {
    id: 'slay-cloud-nine',
    name: 'Cloud Nine',
    theme: 'slay',
    badge: '☁️',
    description: 'Airy lifted highlights with ethereal lavender undertones',
    cssFilter: 'brightness(112%) contrast(92%) saturate(106%) hue-rotate(-6deg)',
    tintColor: '#E8DEFF',
    tintAlpha: 0.15,
    glow: true,
  },
  {
    id: 'slay-vintage-sweet',
    name: 'Vintage Sweet',
    theme: 'slay',
    badge: '🎀',
    description: 'Sweet faded polaroid warmth with soft creamy shadows',
    cssFilter: 'sepia(24%) contrast(95%) brightness(108%) saturate(108%)',
    tintColor: '#FFEBD4',
    tintAlpha: 0.12,
    vignette: 0.15,
  },
  {
    id: 'slay-glitter-pop',
    name: 'Glitter Pop',
    theme: 'slay',
    badge: '✨',
    description: 'High-clarity sparkle filter with shimmering fairy accents',
    cssFilter: 'contrast(108%) brightness(106%) saturate(125%)',
    tintColor: '#FFD6E8',
    tintAlpha: 0.1,
    sparkles: true,
  },

  // ==========================
  // GUY THEME FILTERS (6)
  // ==========================
  {
    id: 'guy-cinematic',
    name: 'Cinematic Noir',
    theme: 'guy',
    badge: '🎬',
    description: 'Deep theatrical contrast, rich shadows and controlled highlights',
    cssFilter: 'contrast(128%) brightness(96%) saturate(108%)',
    tintColor: '#0F172A',
    tintAlpha: 0.12,
    vignette: 0.38,
  },
  {
    id: 'guy-cold-steel',
    name: 'Cold Steel',
    theme: 'guy',
    badge: '❄️',
    description: 'Desaturated cyan-steel tones inspired by modern sci-fi action',
    cssFilter: 'saturate(70%) contrast(118%) hue-rotate(185deg) brightness(98%)',
    tintColor: '#38BDF8',
    tintAlpha: 0.14,
  },
  {
    id: 'guy-night-drive',
    name: 'Night Drive',
    theme: 'guy',
    badge: '🌃',
    description: 'Moody cyberpunk shadows with punchy electric highlights',
    cssFilter: 'contrast(135%) brightness(92%) saturate(130%) hue-rotate(-12deg)',
    tintColor: '#1E1B4B',
    tintAlpha: 0.18,
    vignette: 0.45,
  },
  {
    id: 'guy-action-comic',
    name: 'Action Comic',
    theme: 'guy',
    badge: '💥',
    description: 'Punchy graphic comic book contrast with pop-art edge styling',
    cssFilter: 'contrast(142%) saturate(145%) brightness(104%)',
    tintColor: '#FACC15',
    tintAlpha: 0.08,
    halftone: true,
  },
  {
    id: 'guy-vintage-flight',
    name: 'Vintage Flight',
    theme: 'guy',
    badge: '✈️',
    description: 'Restrained aviation documentary 16mm film colors',
    cssFilter: 'sepia(20%) contrast(110%) saturate(88%) brightness(101%)',
    tintColor: '#FDE68A',
    tintAlpha: 0.1,
    grain: 0.22,
    vignette: 0.25,
  },
  {
    id: 'guy-street-chrome',
    name: 'Street Chrome',
    theme: 'guy',
    badge: '⚡',
    description: 'High-clarity urban metallic silver tone with crisp shadow lines',
    cssFilter: 'contrast(124%) saturate(60%) brightness(105%)',
    tintColor: '#94A3B8',
    tintAlpha: 0.12,
  },

  // ==========================
  // STRAIGHT THEME FILTERS (6)
  // ==========================
  {
    id: 'straight-natural',
    name: 'Natural Studio',
    theme: 'straight',
    badge: '🌿',
    description: 'Crisp true-to-life studio color balance and neutral skin tones',
    cssFilter: 'contrast(103%) brightness(102%) saturate(104%)',
    tintColor: null,
    tintAlpha: 0,
  },
  {
    id: 'straight-classic-film',
    name: 'Classic Film',
    theme: 'straight',
    badge: '🎞️',
    description: 'Subtle 400 ISO color negative film with gentle warmth',
    cssFilter: 'sepia(12%) contrast(106%) saturate(98%) brightness(102%)',
    tintColor: '#FEF3C7',
    tintAlpha: 0.08,
    grain: 0.14,
  },
  {
    id: 'straight-warm-portrait',
    name: 'Warm Portrait',
    theme: 'straight',
    badge: '☀️',
    description: 'Golden hour soft midtones and flattering gentle warmth',
    cssFilter: 'brightness(104%) contrast(102%) saturate(114%) sepia(10%)',
    tintColor: '#FFEDD5',
    tintAlpha: 0.1,
  },
  {
    id: 'straight-cool-editorial',
    name: 'Cool Editorial',
    theme: 'straight',
    badge: '📰',
    description: 'Magazine editorial grade with crisp whites and refined slate cool',
    cssFilter: 'brightness(103%) contrast(112%) saturate(92%) hue-rotate(6deg)',
    tintColor: '#E0F2FE',
    tintAlpha: 0.1,
  },
  {
    id: 'straight-monochrome',
    name: 'Fine Art B&W',
    theme: 'straight',
    badge: '🖤',
    description: 'Timeless studio monochrome with rich tonal range and deep blacks',
    cssFilter: 'grayscale(100%) contrast(122%) brightness(102%)',
    tintColor: null,
    tintAlpha: 0,
    vignette: 0.18,
  },
  {
    id: 'straight-soft-focus',
    name: 'Soft Focus',
    theme: 'straight',
    badge: '✨',
    description: 'Gentle diffusion glow while preserving facial sharpness',
    cssFilter: 'brightness(106%) contrast(96%) saturate(106%)',
    tintColor: '#FFFFFF',
    tintAlpha: 0.08,
    glow: true,
  },
];

export function getFilterDefinition(id: string): FilterDefinition {
  const match = THEME_FILTERS.find((f) => f.id === id);
  if (match) return match;

  // Fallback aliases for legacy IDs
  switch (id) {
    case 'warm':
      return getFilterDefinition('straight-warm-portrait');
    case 'cool':
      return getFilterDefinition('straight-cool-editorial');
    case 'vintage':
      return getFilterDefinition('slay-vintage-sweet');
    case 'retro':
      return getFilterDefinition('slay-film-diary');
    case 'soft-pink':
      return getFilterDefinition('slay-rosy');
    case 'lavender':
      return getFilterDefinition('slay-cloud-nine');
    case 'grayscale':
      return getFilterDefinition('straight-monochrome');
    case 'sepia':
      return getFilterDefinition('guy-vintage-flight');
    case 'bright':
      return getFilterDefinition('slay-dreamy');
    case 'contrast':
      return getFilterDefinition('guy-cinematic');
    case 'film':
      return getFilterDefinition('straight-classic-film');
    case 'dreamy-pastel':
      return getFilterDefinition('slay-dreamy');
    default:
      return THEME_FILTERS[0];
  }
}

export function getFiltersForTheme(themeId: ThemeId): FilterDefinition[] {
  return THEME_FILTERS.filter((f) => f.theme === 'all' || f.theme === themeId);
}

/**
 * Applies fine-art post-pass effects (vignette, film grain, halftone, sparkles)
 * directly onto a 2D canvas context so exported photos and live previews match 100%.
 */
export function applyFilterPostPass(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterId: string
) {
  const def = getFilterDefinition(filterId);

  // 1. Color Tint Overlay
  if (def.tintColor && def.tintAlpha > 0) {
    ctx.save();
    ctx.fillStyle = def.tintColor;
    ctx.globalAlpha = def.tintAlpha;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 2. Vignette
  if (def.vignette && def.vignette > 0) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.hypot(cx, cy);
    const grad = ctx.createRadialGradient(cx, cy, r * 0.45, cx, cy, r);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, `rgba(0, 0, 0, ${def.vignette})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 3. Film Grain
  if (def.grain && def.grain > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    const grainStep = 4;
    for (let y = 0; y < height; y += grainStep) {
      for (let x = (y % 8 === 0 ? 0 : 2); x < width; x += grainStep * 2) {
        if (Math.sin(x * 12.9898 + y * 78.233) > 0.3) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
    }
    ctx.restore();
  }

  // 4. Halftone Screen Effect
  if (def.halftone) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
    const dotStep = 14;
    for (let y = 4; y < height; y += dotStep) {
      for (let x = (y / dotStep) % 2 ? 4 : 11; x < width; x += dotStep) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 5. Sparkle Motifs
  if (def.sparkles) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const points = [
      [width * 0.12, height * 0.18, 10],
      [width * 0.88, height * 0.22, 12],
      [width * 0.85, height * 0.78, 9],
      [width * 0.15, height * 0.82, 8],
    ];
    for (const [sx, sy, sr] of points) {
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(sx - sr, sy - 1.5, sr * 2, 3);
      ctx.fillRect(sx - 1.5, sy - sr, 3, sr * 2);
    }
    ctx.restore();
  }
}
