import {
  ARFilterId,
  CameraColorToneId,
  CapturedPhoto,
  SmoothedFaceMetrics,
} from '../types/photobooth';
import { getCameraColorTone, renderActiveARFilters } from './arFilters';

const SAMPLE_SCENES = [
  {
    bg1: '#FFC9DE',
    bg2: '#FFF0F5',
    title: 'Say Mochi! ✌️',
    character: 'bunny',
    accent: '#FF6B9E',
  },
  {
    bg1: '#DCCFFF',
    bg2: '#F3EEFF',
    title: 'Wink Time 😉',
    character: 'cat',
    accent: '#8C65F7',
  },
  {
    bg1: '#CDEBFF',
    bg2: '#EDF7FF',
    title: 'Heart Pose 🫶',
    character: 'bear',
    accent: '#3B9AE1',
  },
  {
    bg1: '#FFDCC8',
    bg2: '#FFF5EE',
    title: 'Besties Glow ✨',
    character: 'bunny',
    accent: '#FF8856',
  },
  {
    bg1: '#FFE3EC',
    bg2: '#DCCFFF',
    title: 'Peace & Pout 🌸',
    character: 'cat',
    accent: '#E05780',
  },
  {
    bg1: '#E2F5EA',
    bg2: '#FFF9F2',
    title: 'Big Smile 😊',
    character: 'bear',
    accent: '#42A876',
  },
  {
    bg1: '#FFF0D9',
    bg2: '#FFC9DE',
    title: 'Cheek Poke 👉👈',
    character: 'bunny',
    accent: '#F0788C',
  },
  {
    bg1: '#E5DEFF',
    bg2: '#CDEBFF',
    title: 'Star Idol 🌟',
    character: 'cat',
    accent: '#6E56CF',
  },
];

export function generateCuteDemoPhotos(
  count: number,
  activeARFilters: ARFilterId[] = [],
  activeColorTone: CameraColorToneId = 'original'
): CapturedPhoto[] {
  const photos: CapturedPhoto[] = [];
  const width = 960;
  const height = 720;
  const toneDef = getCameraColorTone(activeColorTone);

  for (let i = 0; i < count; i++) {
    const scene = SAMPLE_SCENES[i % SAMPLE_SCENES.length];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (toneDef.cssFilter && toneDef.cssFilter !== 'none') {
        ctx.filter = toneDef.cssFilter;
      }

      // Soft gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, scene.bg1);
      grad.addColorStop(1, scene.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative pastel circles in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.25, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.82, height * 0.75, 140, 0, Math.PI * 2);
      ctx.fill();

      // Cute Mochi character illustration in center
      const cx = width / 2;
      const cy = height / 2 + 25;

      // Main Mochi head
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 155, 130, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rosy cheeks
      ctx.fillStyle = '#FFB3C9';
      ctx.beginPath();
      ctx.ellipse(cx - 82, cy + 16, 26, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 82, cy + 16, 26, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#393343';
      if (i % 2 === 1) {
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 72, cy - 18);
        ctx.quadraticCurveTo(cx - 52, cy - 38, cx - 32, cy - 18);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(cx - 52, cy - 20, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cx - 56, cy - 25, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#393343';
      ctx.beginPath();
      ctx.arc(cx + 52, cy - 20, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx + 48, cy - 25, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Cute mouth (w shape)
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy + 12);
      ctx.quadraticCurveTo(cx - 11, cy + 26, cx, cy + 14);
      ctx.quadraticCurveTo(cx + 11, cy + 26, cx + 22, cy + 12);
      ctx.stroke();

      ctx.filter = 'none';

      // Apply active AR face filters onto the demo character's synthetic landmarks!
      const syntheticFace: SmoothedFaceMetrics = {
        faceCenter: { x: cx, y: cy },
        foreheadTop: { x: cx, y: cy - 115 },
        crownTop: { x: cx, y: cy - 165 },
        leftEye: { x: cx - 52, y: cy - 20 },
        rightEye: { x: cx + 52, y: cy - 20 },
        eyeCenter: { x: cx, y: cy - 20 },
        noseTip: { x: cx, y: cy - 2 },
        noseBridge: { x: cx, y: cy - 14 },
        leftCheek: { x: cx - 82, y: cy + 16 },
        rightCheek: { x: cx + 82, y: cy + 16 },
        leftTemple: { x: cx - 150, y: cy - 25 },
        rightTemple: { x: cx + 150, y: cy - 25 },
        chinBottom: { x: cx, y: cy + 130 },
        mouthCenter: { x: cx, y: cy + 18 },
        faceWidth: 290,
        faceHeight: 245,
        eyeDistance: 104,
        rollAngleRad: (i % 2 === 0 ? 1 : -1) * 0.04,
      };

      if (activeARFilters.length > 0) {
        renderActiveARFilters(ctx, width, height, [syntheticFace], activeARFilters, 1000 + i * 500);
      }

      if (toneDef.tintColor && toneDef.tintAlpha > 0) {
        ctx.save();
        ctx.fillStyle = toneDef.tintColor;
        ctx.globalAlpha = toneDef.tintAlpha;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Pose badge at top
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.beginPath();
      ctx.roundRect(cx - 150, 28, 300, 52, 26);
      ctx.fill();

      ctx.fillStyle = '#393343';
      ctx.font = 'bold 24px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`SHOT #${i + 1} • ${scene.title}`, cx, 54);
    }

    photos.push({
      id: `demo-shot-${Date.now()}-${i}`,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      timestamp: Date.now() + i,
      width,
      height,
      appliedEffects: [...activeARFilters],
      appliedColorTone: activeColorTone,
    });
  }

  return photos;
}
