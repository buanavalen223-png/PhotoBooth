import { FrameTheme, StickerType } from '../types/photobooth';

/**
 * Vector artwork for the Guy / Straight theme presets (comic, aviation, racing).
 * Everything is drawn directly onto the canvas so live preview and exports match exactly.
 */

function burstPath(ctx: CanvasRenderingContext2D, r1: number, r2: number, points: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const jitter = i % 4 === 0 ? 1.08 : 1;
    ctx.lineTo(Math.cos(a) * r * jitter, Math.sin(a) * r * jitter);
  }
  ctx.closePath();
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.arc(x - 22 * s, y + 4 * s, 16 * s, 0, Math.PI * 2);
  ctx.arc(x, y - 6 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 4 * s, 15 * s, 0, Math.PI * 2);
  ctx.rect(x - 22 * s, y + 4 * s, 46 * s, 16 * s);
  ctx.fill();
}

function plane(ctx: CanvasRenderingContext2D, color: string) {
  // Side-on jet pointing right, roughly 100 x 50 units
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-46, -4);
  ctx.quadraticCurveTo(-40, -10, -20, -9);
  ctx.lineTo(34, -8);
  ctx.quadraticCurveTo(50, -6, 52, 0);
  ctx.quadraticCurveTo(50, 6, 34, 7);
  ctx.lineTo(-30, 7);
  ctx.quadraticCurveTo(-44, 6, -46, -4);
  ctx.closePath();
  ctx.fill();
  // Wing
  ctx.beginPath();
  ctx.moveTo(4, 2);
  ctx.lineTo(-18, 26);
  ctx.lineTo(-8, 26);
  ctx.lineTo(22, 4);
  ctx.closePath();
  ctx.fill();
  // Tail fin
  ctx.beginPath();
  ctx.moveTo(-30, -8);
  ctx.lineTo(-44, -28);
  ctx.lineTo(-36, -28);
  ctx.lineTo(-16, -8);
  ctx.closePath();
  ctx.fill();
}

/** Returns true when the pattern was handled here. */
export function drawThemePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: FrameTheme
): boolean {
  switch (frame.patternType) {
    case 'halftone': {
      ctx.fillStyle = 'rgba(230, 57, 70, 0.28)';
      const step = 22;
      for (let y = 0; y < height; y += step) {
        for (let x = (y / step) % 2 ? step / 2 : 0; x < width; x += step) {
          const r = 2 + 5 * (y / height);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return true;
    }
    case 'action-lines': {
      ctx.strokeStyle = 'rgba(148, 197, 255, 0.22)';
      const cx = width / 2;
      const cy = height / 2;
      const len = Math.hypot(width, height);
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        ctx.lineWidth = i % 3 === 0 ? 6 : 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 120, cy + Math.sin(a) * 120);
        ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
        ctx.stroke();
      }
      return true;
    }
    case 'sky-clouds': {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, frame.bgColor);
      grad.addColorStop(1, frame.secondaryBg || '#FFFFFF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const step = 170;
      for (let y = 60; y < height; y += step) {
        for (let x = 40; x < width + 80; x += 260) {
          cloud(ctx, x + ((y / step) % 2) * 120, y, 0.9);
        }
      }
      return true;
    }
    case 'checker': {
      const sq = 22;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (let y = 0; y < height; y += sq) {
        for (let col = 0; col < 2; col++) {
          const left = col * sq + ((y / sq) % 2 ? sq : 0) - sq;
          if (left >= 0) ctx.fillRect(left, y, sq, sq);
          const right = width - sq * 2 + col * sq + ((y / sq) % 2 ? 0 : sq) - sq;
          if (right < width) ctx.fillRect(right + sq, y, sq, sq);
        }
      }
      ctx.fillStyle = frame.accentColor;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(width / 2 - 34, 0, 18, height);
      ctx.fillRect(width / 2 + 16, 0, 18, height);
      ctx.globalAlpha = 1;
      return true;
    }
    default:
      return false;
  }
}

/** Decorative overlay drawn on top of photos for themed frames. */
export function drawFrameOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: FrameTheme,
  footerHeight: number
) {
  if (!frame.overlay) return;
  ctx.save();
  switch (frame.overlay) {
    case 'comic-burst': {
      ctx.translate(width - 70, footerHeight > 0 ? height - footerHeight - 30 : height - 90);
      ctx.rotate(-0.18);
      drawThemeSticker(ctx, 'comic-pow', 0.95);
      break;
    }
    case 'aviation-badge': {
      ctx.translate(width - 62, height - footerHeight / 2);
      drawThemeSticker(ctx, 'flight-badge', 0.7);
      break;
    }
    case 'racing-flags': {
      ctx.translate(62, height - footerHeight / 2);
      drawThemeSticker(ctx, 'checkered-flag', 0.7);
      break;
    }
  }
  ctx.restore();
}

/**
 * Draws a themed sticker centred on the current origin. Returns false for unknown types
 * so the caller can fall back to the original cute sticker renderer.
 */
export function drawThemeSticker(
  ctx: CanvasRenderingContext2D,
  type: StickerType,
  scale = 1
): boolean {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  let handled = true;
  switch (type) {
    case 'comic-pow':
    case 'comic-boom': {
      const isPow = type === 'comic-pow';
      ctx.fillStyle = '#111111';
      burstPath(ctx, 62, 40, 12);
      ctx.fill();
      ctx.fillStyle = isPow ? '#FFD23F' : '#FF5A36';
      burstPath(ctx, 54, 34, 12);
      ctx.fill();
      ctx.font = '900 30px "Arial Black", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#111111';
      const label = isPow ? 'POW!' : 'BOOM!';
      ctx.save();
      ctx.rotate(-0.12);
      ctx.strokeText(label, 0, 2);
      ctx.fillStyle = isPow ? '#E63946' : '#FFFFFF';
      ctx.fillText(label, 0, 2);
      ctx.restore();
      break;
    }
    case 'speech-bubble': {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, -8, 58, 34, 0, 0, Math.PI * 2);
      ctx.moveTo(-18, 20);
      ctx.lineTo(-34, 44);
      ctx.lineTo(2, 24);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, -8, 55, 31, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111111';
      ctx.font = '900 20px "Arial Black", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NICE!', 0, -8);
      break;
    }
    case 'lightning-bolt': {
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(8, -48);
      ctx.lineTo(-26, 6);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-12, 48);
      ctx.lineTo(26, -10);
      ctx.lineTo(2, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'airplane': {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(-110, 14);
      ctx.lineTo(-52, 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#FFFFFF';
      plane(ctx, '#FFFFFF');
      ctx.restore();
      ctx.save();
      ctx.scale(0.9, 0.86);
      plane(ctx, '#1E3A8A');
      ctx.restore();
      ctx.fillStyle = '#93C5FD';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(4 + i * 8, -5, 4, 4);
      }
      break;
    }
    case 'pilot-wings': {
      ctx.fillStyle = '#E5B53A';
      ctx.strokeStyle = '#7A5A12';
      ctx.lineWidth = 2.5;
      for (const dir of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const y = -10 + i * 7;
          ctx.moveTo(dir * 14, y);
          ctx.lineTo(dir * (66 - i * 12), y - 6 + i * 1.5);
          ctx.lineTo(dir * (60 - i * 12), y + 5);
          ctx.lineTo(dir * 14, y + 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#7A5A12';
      ctx.font = '900 14px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M', 0, 3);
      break;
    }
    case 'flight-badge': {
      ctx.fillStyle = '#0F2A44';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.scale(0.5, 0.5);
      ctx.translate(0, -18);
      plane(ctx, '#FFFFFF');
      ctx.restore();
      ctx.fillStyle = '#F59E0B';
      ctx.font = '900 13px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CAPTAIN', 0, 18);
      break;
    }
    case 'checkered-flag': {
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-40, -44);
      ctx.lineTo(-40, 48);
      ctx.stroke();
      const sq = 13;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-38, -44);
      ctx.quadraticCurveTo(0, -56, 46, -42);
      ctx.lineTo(46, 10);
      ctx.quadraticCurveTo(0, -2, -38, 10);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.clip();
      ctx.fillStyle = '#111111';
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if ((r + c) % 2 === 0) ctx.fillRect(-38 + c * sq, -56 + r * sq, sq, sq);
        }
      }
      ctx.restore();
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-38, -44);
      ctx.quadraticCurveTo(0, -56, 46, -42);
      ctx.lineTo(46, 10);
      ctx.quadraticCurveTo(0, -2, -38, 10);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    default:
      handled = false;
  }
  ctx.restore();
  return handled;
}
