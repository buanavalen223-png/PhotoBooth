export type BackgroundCategory =
  | 'All'
  | 'Colors'
  | 'Gradients'
  | 'Studio'
  | 'Cute'
  | 'Comic'
  | 'Adventure';

export type BackgroundMode = 'original' | 'blur' | 'replace';

export interface BackgroundItem {
  id: string;
  name: string;
  category: Exclude<BackgroundCategory, 'All'>;
  type: 'color' | 'gradient' | 'scene';
  cssPreview: string; // CSS background for UI thumbnails
  description: string;
  recommendedThemes: ('slay' | 'guy' | 'straight')[];
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const BACKGROUND_CATEGORIES: BackgroundCategory[] = [
  'All',
  'Colors',
  'Gradients',
  'Studio',
  'Cute',
  'Comic',
  'Adventure',
];

export const BACKGROUND_LIBRARY: BackgroundItem[] = [
  // ==========================
  // SOLID COLORS (7)
  // ==========================
  {
    id: 'color-white',
    name: 'Pure White',
    category: 'Colors',
    type: 'color',
    cssPreview: '#FFFFFF',
    description: 'Crisp clean white photo studio wall',
    recommendedThemes: ['straight', 'slay'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-black',
    name: 'Matte Black',
    category: 'Colors',
    type: 'color',
    cssPreview: '#0B0B0E',
    description: 'Deep high-contrast studio black',
    recommendedThemes: ['guy', 'straight'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#0B0B0E';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-pastel-pink',
    name: 'Pastel Pink',
    category: 'Colors',
    type: 'color',
    cssPreview: '#FFD6E8',
    description: 'Sweet baby pink K-studio wall',
    recommendedThemes: ['slay'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFD6E8';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-lavender',
    name: 'Lavender Mist',
    category: 'Colors',
    type: 'color',
    cssPreview: '#E2D9FC',
    description: 'Dreamy soft lilac background',
    recommendedThemes: ['slay', 'straight'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#E2D9FC';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-sky-blue',
    name: 'Sky Blue',
    category: 'Colors',
    type: 'color',
    cssPreview: '#BAE6FD',
    description: 'Crisp airy daylight blue',
    recommendedThemes: ['guy', 'straight', 'slay'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-cream',
    name: 'Warm Cream',
    category: 'Colors',
    type: 'color',
    cssPreview: '#FFF9F0',
    description: 'Cozy warm aesthetic cream paper',
    recommendedThemes: ['straight', 'slay'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#FFF9F0';
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'color-charcoal',
    name: 'Dark Charcoal',
    category: 'Colors',
    type: 'color',
    cssPreview: '#27272A',
    description: 'Modern slate grey portrait backdrop',
    recommendedThemes: ['guy', 'straight'],
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#27272A';
      ctx.fillRect(0, 0, w, h);
    },
  },

  // ==========================
  // GRADIENTS (5)
  // ==========================
  {
    id: 'grad-pink-lavender',
    name: 'Pink to Lavender',
    category: 'Gradients',
    type: 'gradient',
    cssPreview: 'linear-gradient(135deg, #FFB8D2 0%, #DCCFFF 100%)',
    description: 'Soft dreamy pastel ombre glow',
    recommendedThemes: ['slay'],
    draw: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#FFB8D2');
      g.addColorStop(1, '#DCCFFF');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'grad-sunset',
    name: 'Golden Sunset',
    category: 'Gradients',
    type: 'gradient',
    cssPreview: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
    description: 'Warm golden hour peach and coral',
    recommendedThemes: ['slay', 'straight'],
    draw: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#FF7E5F');
      g.addColorStop(1, '#FEB47B');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'grad-blue-purple',
    name: 'Cyber Indigo',
    category: 'Gradients',
    type: 'gradient',
    cssPreview: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
    description: 'Deep electric neon violet gradient',
    recommendedThemes: ['guy'],
    draw: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#4A00E0');
      g.addColorStop(1, '#8E2DE2');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'grad-soft-neutral',
    name: 'Soft Editorial',
    category: 'Gradients',
    type: 'gradient',
    cssPreview: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
    description: 'Clean balanced slate studio gradient',
    recommendedThemes: ['straight'],
    draw: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#E2E8F0');
      g.addColorStop(1, '#CBD5E1');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'grad-dark-cinematic',
    name: 'Cinematic Noir',
    category: 'Gradients',
    type: 'gradient',
    cssPreview: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    description: 'Moody navy & charcoal vignette',
    recommendedThemes: ['guy', 'straight'],
    draw: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0F172A');
      g.addColorStop(1, '#1E293B');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
  },

  // ==========================
  // STUDIO BACKDROPS (2)
  // ==========================
  {
    id: 'scene-studio-spotlight',
    name: 'Studio Backdrop',
    category: 'Studio',
    type: 'scene',
    cssPreview: 'radial-gradient(circle at 50% 45%, #475569 0%, #0F172A 80%)',
    description: 'Professional photographer spotlight backdrop',
    recommendedThemes: ['straight', 'guy'],
    draw: (ctx, w, h) => {
      const grad = ctx.createRadialGradient(w / 2, h * 0.45, 20, w / 2, h * 0.45, Math.max(w, h) * 0.75);
      grad.addColorStop(0, '#475569');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#0B0F19');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Subtle floor horizon line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      ctx.lineTo(w, h * 0.85);
      ctx.stroke();
    },
  },
  {
    id: 'scene-minimal-studio',
    name: 'Minimal White Studio',
    category: 'Studio',
    type: 'scene',
    cssPreview: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 85%, #CBD5E1 100%)',
    description: 'Clean architectural studio with soft floor perspective',
    recommendedThemes: ['straight', 'slay'],
    draw: (ctx, w, h) => {
      const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.82);
      wallGrad.addColorStop(0, '#FFFFFF');
      wallGrad.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, h * 0.82);

      // Floor
      const floorGrad = ctx.createLinearGradient(0, h * 0.82, 0, h);
      floorGrad.addColorStop(0, '#CBD5E1');
      floorGrad.addColorStop(1, '#94A3B8');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, h * 0.82, w, h * 0.18);

      // Soft corner ambient shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, h * 0.815, w, 4);
    },
  },

  // ==========================
  // CUTE SCENES (2)
  // ==========================
  {
    id: 'scene-cute-pastel-room',
    name: 'Cute Pastel Room',
    category: 'Cute',
    type: 'scene',
    cssPreview: 'repeating-linear-gradient(45deg, #FFE4E6 0px, #FFE4E6 16px, #FFF1F2 16px, #FFF1F2 32px)',
    description: 'Cozy pastel gingham room with fairy stars & bunting',
    recommendedThemes: ['slay'],
    draw: (ctx, w, h) => {
      // Pink gingham pattern
      ctx.fillStyle = '#FFF1F2';
      ctx.fillRect(0, 0, w, h);
      const step = 32;
      ctx.fillStyle = 'rgba(255, 182, 193, 0.35)';
      for (let x = 0; x < w; x += step) {
        ctx.fillRect(x, 0, step / 2, h);
      }
      for (let y = 0; y < h; y += step) {
        ctx.fillRect(0, y, w, step / 2);
      }
      // Cute party bunting banner at the top
      ctx.strokeStyle = '#FDA4AF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.quadraticCurveTo(w / 4, 46, w / 2, 24);
      ctx.quadraticCurveTo((3 * w) / 4, 46, w, 24);
      ctx.stroke();

      const pennantColors = ['#F43F5E', '#FB7185', '#FBBF24', '#38BDF8', '#C084FC'];
      for (let i = 0; i < 12; i++) {
        const px = (i + 0.5) * (w / 12);
        const py = 24 + Math.sin((i / 12) * Math.PI * 2) * 8;
        ctx.fillStyle = pennantColors[i % pennantColors.length];
        ctx.beginPath();
        ctx.moveTo(px - 10, py);
        ctx.lineTo(px + 10, py);
        ctx.lineTo(px, py + 18);
        ctx.closePath();
        ctx.fill();
      }

      // Sparkles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const sparklePositions = [
        [w * 0.15, h * 0.25],
        [w * 0.85, h * 0.3],
        [w * 0.2, h * 0.7],
        [w * 0.8, h * 0.75],
        [w * 0.5, h * 0.15],
      ];
      for (const [sx, sy] of sparklePositions) {
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(sx - 8, sy - 1, 16, 2);
        ctx.fillRect(sx - 1, sy - 8, 2, 16);
      }
    },
  },
  {
    id: 'scene-cloudy-sky',
    name: 'Daylight Clouds',
    category: 'Cute',
    type: 'scene',
    cssPreview: 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 50%, #E0F2FE 100%)',
    description: 'Dreamy sky-blue atmosphere with floating fluffy clouds',
    recommendedThemes: ['slay', 'straight'],
    draw: (ctx, w, h) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#38BDF8');
      sky.addColorStop(0.5, '#BAE6FD');
      sky.addColorStop(1, '#F0F9FF');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Fluffy clouds
      const drawCloud = (cx: number, cy: number, s: number) => {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(cx - 30 * s, cy + 6 * s, 22 * s, 0, Math.PI * 2);
        ctx.arc(cx, cy - 10 * s, 32 * s, 0, Math.PI * 2);
        ctx.arc(cx + 34 * s, cy + 4 * s, 24 * s, 0, Math.PI * 2);
        ctx.arc(cx + 60 * s, cy + 10 * s, 18 * s, 0, Math.PI * 2);
        ctx.rect(cx - 30 * s, cy + 6 * s, 90 * s, 22 * s);
        ctx.fill();
        ctx.restore();
      };

      drawCloud(w * 0.22, h * 0.25, 1.2);
      drawCloud(w * 0.78, h * 0.38, 1.4);
      drawCloud(w * 0.45, h * 0.65, 1.1);
      drawCloud(w * 0.88, h * 0.8, 1.0);
      drawCloud(w * 0.1, h * 0.85, 0.9);
    },
  },

  // ==========================
  // COMIC SCENES (2)
  // ==========================
  {
    id: 'scene-comic-action',
    name: 'Comic Action Blast',
    category: 'Comic',
    type: 'scene',
    cssPreview: 'radial-gradient(circle at 50% 50%, #FACC15 0%, #EF4444 80%)',
    description: 'High-energy retro comic action blast with speed lines',
    recommendedThemes: ['guy', 'straight'],
    draw: (ctx, w, h) => {
      // Red background
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(0, 0, w, h);

      // Radial yellow speed ray burst
      const cx = w / 2;
      const cy = h / 2;
      const count = 36;
      const maxR = Math.hypot(w, h);
      ctx.fillStyle = '#FACC15';
      for (let i = 0; i < count; i += 2) {
        const a1 = (i / count) * Math.PI * 2;
        const a2 = ((i + 1) / count) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a1) * maxR, cy + Math.sin(a1) * maxR);
        ctx.lineTo(cx + Math.cos(a2) * maxR, cy + Math.sin(a2) * maxR);
        ctx.closePath();
        ctx.fill();
      }

      // Halftone dot overlay
      ctx.fillStyle = 'rgba(17, 24, 39, 0.3)';
      const step = 20;
      for (let y = 10; y < h; y += step) {
        for (let x = 10; x < w; x += step) {
          const dist = Math.hypot(x - cx, y - cy);
          const r = Math.min(6, (dist / maxR) * 8);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Vignette border
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 14;
      ctx.strokeRect(0, 0, w, h);
    },
  },
  {
    id: 'scene-futuristic-neon-city',
    name: 'Cyberpunk Neon City',
    category: 'Comic',
    type: 'scene',
    cssPreview: 'linear-gradient(180deg, #090A1A 0%, #171033 60%, #3B0764 100%)',
    description: 'Cyberpunk midnight skyline with glowing neon grid & towers',
    recommendedThemes: ['guy'],
    draw: (ctx, w, h) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#050714');
      sky.addColorStop(0.65, '#1E1035');
      sky.addColorStop(1, '#4C0519');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Distant neon skyscrapers
      ctx.fillStyle = '#090D1F';
      const buildings = [
        [w * 0.05, 140, 50],
        [w * 0.16, 200, 42],
        [w * 0.28, 170, 55],
        [w * 0.42, 230, 48],
        [w * 0.56, 180, 52],
        [w * 0.70, 210, 45],
        [w * 0.82, 160, 60],
      ];
      for (const [bx, bh, bw] of buildings) {
        ctx.fillRect(bx, h * 0.75 - bh, bw, bh + h * 0.25);
        // Neon top antenna/spire
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, h * 0.75 - bh);
        ctx.lineTo(bx + bw / 2, h * 0.75 - bh - 24);
        ctx.stroke();
      }

      // Neon horizon grid perspective
      const horizonY = h * 0.75;
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
      ctx.lineWidth = 1.5;
      for (let y = horizonY; y < h; y += 14 * ((y - horizonY + 20) / 60)) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = -w * 0.5; x <= w * 1.5; x += 40) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    },
  },

  // ==========================
  // ADVENTURE SCENES (2)
  // ==========================
  {
    id: 'scene-aviation-cockpit',
    name: 'Cockpit Flight Deck',
    category: 'Adventure',
    type: 'scene',
    cssPreview: 'radial-gradient(circle at 50% 40%, #1E3A8A 0%, #0F172A 70%)',
    description: 'High altitude view from cockpit with HUD flight horizon instruments',
    recommendedThemes: ['guy', 'straight'],
    draw: (ctx, w, h) => {
      // Stratosphere view
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0F172A');
      sky.addColorStop(0.45, '#1E40AF');
      sky.addColorStop(0.55, '#60A5FA');
      sky.addColorStop(1, '#DBEAFE');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Cloud deck below horizon
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.arc(x, h * 0.56, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      // HUD instrument graphics
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.85)';
      ctx.lineWidth = 2;
      const cy = h * 0.48;
      // Horizon pitch ladder
      ctx.beginPath();
      ctx.moveTo(w * 0.35, cy);
      ctx.lineTo(w * 0.45, cy);
      ctx.moveTo(w * 0.55, cy);
      ctx.lineTo(w * 0.65, cy);
      ctx.stroke();

      // Pitch markers
      for (const offset of [-40, -20, 20, 40]) {
        ctx.beginPath();
        ctx.moveTo(w * 0.42, cy + offset);
        ctx.lineTo(w * 0.48, cy + offset);
        ctx.moveTo(w * 0.52, cy + offset);
        ctx.lineTo(w * 0.58, cy + offset);
        ctx.stroke();
      }

      // Cockpit window pillar frame
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.15, 0);
      ctx.lineTo(0, h * 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w * 0.85, 0);
      ctx.lineTo(w, h * 0.35);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'scene-seasonal-galaxy',
    name: 'Cosmic Galaxy & Aurora',
    category: 'Adventure',
    type: 'scene',
    cssPreview: 'radial-gradient(circle at 60% 30%, #1E1B4B 0%, #030712 100%)',
    description: 'Deep cosmic starry night with emerald aurora borealis waves',
    recommendedThemes: ['straight', 'slay', 'guy'],
    draw: (ctx, w, h) => {
      // Space background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Aurora glow
      const aurora = ctx.createLinearGradient(0, h * 0.2, w, h * 0.6);
      aurora.addColorStop(0, 'rgba(16, 185, 129, 0)');
      aurora.addColorStop(0.35, 'rgba(16, 185, 129, 0.45)');
      aurora.addColorStop(0.65, 'rgba(56, 189, 248, 0.4)');
      aurora.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = aurora;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.bezierCurveTo(w * 0.3, h * 0.15, w * 0.7, h * 0.45, w, h * 0.25);
      ctx.lineTo(w, h * 0.65);
      ctx.bezierCurveTo(w * 0.7, h * 0.85, w * 0.3, h * 0.55, 0, h * 0.7);
      ctx.closePath();
      ctx.fill();

      // Twinkling stars
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 90; i++) {
        const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 678.91) * 0.5 + 0.5) * h;
        const size = (i % 3 === 0 ? 2.5 : 1.2);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
];

export function getBackgroundById(id: string): BackgroundItem {
  return BACKGROUND_LIBRARY.find((b) => b.id === id) || BACKGROUND_LIBRARY[0];
}

export function getRecommendedBackgrounds(themeId: 'slay' | 'guy' | 'straight'): BackgroundItem[] {
  return BACKGROUND_LIBRARY.filter((b) => b.recommendedThemes.includes(themeId));
}
