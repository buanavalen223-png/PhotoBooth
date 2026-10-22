import {
  CapturedPhoto,
  EditorState,
  FilterId,
  FrameTheme,
  ImageAdjustments,
  PhotoSlotRect,
  StickerItem,
  StickerType,
  TextOverlayItem,
} from '../types/photobooth';
import { computeLayoutSlots, getFrameById, getLayoutById } from './constants';
import { drawFrameOverlay, drawThemePattern, drawThemeSticker } from './themeArt';
import { applyFilterPostPass, getFilterDefinition } from './filters';

/**
 * Loads an image from a dataURL or URL safely.
 */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode photo data for canvas rendering.'));
    img.src = src;
  });
}

/**
 * Builds a CSS filter string + optional tint overlay for pixel-accurate canvas rendering.
 */
export function getFilterCssAndTint(
  filter: FilterId,
  brightness: number,
  contrast: number,
  saturation: number
): { cssFilter: string; tintColor: string | null; tintAlpha: number } {
  const b = Math.max(30, Math.min(200, 100 + brightness));
  const c = Math.max(30, Math.min(200, 100 + contrast));
  const s = Math.max(0, Math.min(250, 100 + saturation));

  let extraFilter = '';
  let tintColor: string | null = null;
  let tintAlpha = 0;

  switch (filter) {
    case 'warm':
      extraFilter = 'sepia(18%) saturate(118%) brightness(104%)';
      tintColor = '#FFB88C';
      tintAlpha = 0.12;
      break;
    case 'cool':
      extraFilter = 'saturate(105%) brightness(103%) hue-rotate(8deg)';
      tintColor = '#99D6FF';
      tintAlpha = 0.14;
      break;
    case 'vintage':
      extraFilter = 'sepia(38%) contrast(92%) brightness(98%) saturate(85%)';
      tintColor = '#F4E2C6';
      tintAlpha = 0.16;
      break;
    case 'retro':
      extraFilter = 'contrast(118%) saturate(130%) sepia(15%)';
      tintColor = '#FF9966';
      tintAlpha = 0.1;
      break;
    case 'soft-pink':
      extraFilter = 'brightness(107%) contrast(96%) saturate(112%)';
      tintColor = '#FFB6D9';
      tintAlpha = 0.17;
      break;
    case 'lavender':
      extraFilter = 'brightness(104%) saturate(108%)';
      tintColor = '#C9B3FF';
      tintAlpha = 0.18;
      break;
    case 'film':
      extraFilter = 'contrast(114%) saturate(118%) sepia(12%)';
      tintColor = '#FFE0B5';
      tintAlpha = 0.1;
      break;
    case 'dreamy-pastel':
      extraFilter = 'brightness(110%) contrast(94%) saturate(108%)';
      tintColor = '#FFD6F0';
      tintAlpha = 0.15;
      break;
    case 'grayscale':
      extraFilter = 'grayscale(100%) contrast(108%)';
      break;
    case 'sepia':
      extraFilter = 'sepia(85%) contrast(104%) brightness(98%)';
      break;
    case 'bright':
      extraFilter = 'brightness(118%) contrast(104%) saturate(108%)';
      break;
    case 'contrast':
      extraFilter = 'contrast(132%) saturate(115%)';
      break;
    case 'original':
      break;
    default: {
      const def = getFilterDefinition(filter);
      if (def && def.id !== 'original') {
        extraFilter = def.cssFilter !== 'none' ? def.cssFilter : '';
        tintColor = def.tintColor;
        tintAlpha = def.tintAlpha;
      }
      break;
    }
  }

  const cssFilter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) ${extraFilter}`.trim();
  return { cssFilter, tintColor, tintAlpha };
}

/**
 * Draws rounded rectangle path on a 2D context.
 */
function traceRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Draws decorative background patterns for the active frame.
 */
function drawFrameBackgroundAndPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: FrameTheme,
  customBgColor: string | null,
  transparentBg: boolean
) {
  if (transparentBg) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  const primaryBg = customBgColor || frame.bgColor;
  const secondaryBg = frame.secondaryBg || '#FFFFFF';

  if (frame.patternType === 'gradient' && !customBgColor) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, primaryBg);
    grad.addColorStop(1, secondaryBg);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = primaryBg;
  }
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  if (drawThemePattern(ctx, width, height, frame)) {
    ctx.restore();
    return;
  }
  switch (frame.patternType) {
    case 'dots': {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      const step = 48;
      for (let y = 24; y < height; y += step) {
        for (let x = (y % (step * 2) === 0 ? 24 : 0); x < width; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'grid': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      break;
    }
    case 'stripes': {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      const stripeW = 36;
      for (let x = 0; x < width; x += stripeW * 2) {
        ctx.fillRect(x, 0, stripeW, height);
      }
      break;
    }
    case 'film': {
      ctx.fillStyle = 'rgba(255, 249, 242, 0.78)';
      const holeW = 18;
      const holeH = 26;
      const step = 48;
      for (let y = 24; y < height - 24; y += step) {
        traceRoundedRect(ctx, 14, y, holeW, holeH, 4);
        ctx.fill();
        traceRoundedRect(ctx, width - 14 - holeW, y, holeW, holeH, 4);
        ctx.fill();
      }
      break;
    }
    case 'hearts': {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      const step = 90;
      for (let y = 35; y < height; y += step) {
        for (let x = 30; x < width; x += step) {
          drawMiniHeart(ctx, x + ((y / step) % 2) * 35, y, 10);
        }
      }
      break;
    }
    case 'stars': {
      ctx.fillStyle = frame.bgColor.startsWith('#2') || frame.bgColor.startsWith('#3')
        ? 'rgba(255, 215, 130, 0.42)'
        : 'rgba(255, 255, 255, 0.65)';
      const step = 88;
      for (let y = 30; y < height; y += step) {
        for (let x = 28; x < width; x += step) {
          drawFourPointSparkle(ctx, x + ((y / step) % 2) * 40, y, 9);
        }
      }
      break;
    }
    case 'flowers': {
      const step = 100;
      for (let y = 40; y < height; y += step) {
        for (let x = 36; x < width; x += step) {
          drawMiniDaisy(ctx, x + ((y / step) % 2) * 44, y, 10);
        }
      }
      break;
    }
    case 'ribbons': {
      ctx.strokeStyle = frame.accentColor;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      traceRoundedRect(ctx, 18, 18, width - 36, height - 36, 24);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function drawMiniHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.6);
  ctx.bezierCurveTo(cx - size, cy - size * 0.2, cx - size * 0.5, cy - size, cx, cy - size * 0.3);
  ctx.bezierCurveTo(cx + size * 0.5, cy - size, cx + size, cy - size * 0.2, cx, cy + size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFourPointSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMiniDaisy(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * r * 0.7, cy + Math.sin(angle) * r * 0.7, r * 0.48, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a single photo (or cute placeholder if empty) into its target slot with aspect-fill (cover),
 * user zoom/pan/rotation/flip, and filter adjustments.
 */
function drawPhotoInSlot(
  ctx: CanvasRenderingContext2D,
  slot: PhotoSlotRect,
  slotIndex: number,
  img: HTMLImageElement | null,
  adjustments: ImageAdjustments,
  frame: FrameTheme,
  borderThickness: number,
  borderRadius: number
) {
  ctx.save();

  const centerX = slot.x + slot.width / 2;
  const centerY = slot.y + slot.height / 2;

  if (slot.rotation) {
    ctx.translate(centerX, centerY);
    ctx.rotate((slot.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  // Soft drop shadow behind each photo slot
  ctx.save();
  ctx.shadowColor = 'rgba(57, 51, 67, 0.14)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#FFFFFF';
  traceRoundedRect(ctx, slot.x, slot.y, slot.width, slot.height, borderRadius);
  ctx.fill();
  ctx.restore();

  // Clip to rounded slot
  traceRoundedRect(ctx, slot.x, slot.y, slot.width, slot.height, borderRadius);
  ctx.clip();

  if (!img) {
    // Cute placeholder when photo slot isn't taken yet
    ctx.fillStyle = '#FFF9F2';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.min(slot.width, slot.height) * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#393343';
    ctx.font = '700 28px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Photo #${slotIndex + 1}`, centerX, centerY - 12);

    ctx.font = '600 18px Nunito, sans-serif';
    ctx.fillStyle = '#7A7088';
    ctx.fillText('Ready to capture ✨', centerX, centerY + 22);
  } else {
    const { cssFilter, tintColor, tintAlpha } = getFilterCssAndTint(
      adjustments.filter,
      adjustments.brightness,
      adjustments.contrast,
      adjustments.saturation
    );

    ctx.save();
    ctx.filter = cssFilter;

    // Move to slot center for rotation, flip, zoom, pan
    ctx.translate(centerX, centerY);
    if (adjustments.rotation !== 0) {
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
    }
    if (adjustments.flipH) {
      ctx.scale(-1, 1);
    }

    const zoom = Math.max(1, Math.min(3, adjustments.zoom));
    ctx.scale(zoom, zoom);

    const panOffsetX = adjustments.panX * slot.width * 0.5;
    const panOffsetY = adjustments.panY * slot.height * 0.5;
    ctx.translate(panOffsetX, panOffsetY);

    // Aspect-fill (object-fit: cover) calculation so photo NEVER stretches
    const isRotated90 = adjustments.rotation === 90 || adjustments.rotation === 270;
    const targetW = isRotated90 ? slot.height : slot.width;
    const targetH = isRotated90 ? slot.width : slot.height;

    const imgRatio = img.width / img.height;
    const slotRatio = targetW / targetH;

    let drawW = targetW;
    let drawH = targetH;

    if (imgRatio > slotRatio) {
      drawH = targetH;
      drawW = targetH * imgRatio;
    } else {
      drawW = targetW;
      drawH = targetW / imgRatio;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Apply optional pastel color tint overlay
    if (tintColor && tintAlpha > 0) {
      ctx.save();
      ctx.fillStyle = tintColor;
      ctx.globalAlpha = tintAlpha;
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      ctx.restore();
    }

    // Apply fine-art post pass (vignette, film grain, halftone, sparkles)
    ctx.save();
    ctx.translate(slot.x, slot.y);
    applyFilterPostPass(ctx, slot.width, slot.height, adjustments.filter);
    ctx.restore();
  }

  ctx.restore();

  // Draw crisp slot border if borderThickness > 0
  if (borderThickness > 0) {
    ctx.save();
    if (slot.rotation) {
      ctx.translate(centerX, centerY);
      ctx.rotate((slot.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }
    ctx.strokeStyle = frame.borderColor;
    ctx.lineWidth = borderThickness;
    traceRoundedRect(ctx, slot.x, slot.y, slot.width, slot.height, borderRadius);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draws custom vector sticker directly onto the canvas so exports are 100% crisp and self-contained.
 */
export function drawVectorSticker(
  ctx: CanvasRenderingContext2D,
  type: StickerType,
  cx: number,
  cy: number,
  scale = 1,
  rotationDeg = 0
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  // Subtle sticker white outline/shadow effect
  ctx.shadowColor = 'rgba(57, 51, 67, 0.22)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  if (drawThemeSticker(ctx, type)) {
    ctx.restore();
    return;
  }

  switch (type) {
    case 'heart-pink':
    case 'heart-sparkle': {
      ctx.fillStyle = type === 'heart-pink' ? '#FF75A0' : '#FF477E';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 26);
      ctx.bezierCurveTo(-45, -8, -25, -42, 0, -16);
      ctx.bezierCurveTo(25, -42, 45, -8, 0, 26);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Gloss highlight
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath();
      ctx.ellipse(-14, -14, 7, 4, -0.5, 0, Math.PI * 2);
      ctx.fill();

      if (type === 'heart-sparkle') {
        ctx.fillStyle = '#FFE066';
        drawFourPointSparkle(ctx, 24, -22, 12);
      }
      break;
    }
    case 'star-gold':
    case 'star-pastel': {
      ctx.fillStyle = type === 'star-gold' ? '#FFD166' : '#C8B6FF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      const spikes = 5;
      const outerR = 36;
      const innerR = 17;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Cute eyes on star
      ctx.fillStyle = '#393343';
      ctx.beginPath();
      ctx.arc(-8, -2, 3.2, 0, Math.PI * 2);
      ctx.arc(8, -2, 3.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'sparkle-magic': {
      ctx.fillStyle = '#FFF3B0';
      ctx.strokeStyle = '#FF9EBB';
      ctx.lineWidth = 3;
      drawFourPointSparkle(ctx, -6, 0, 32);
      ctx.fillStyle = '#FFC9DE';
      drawFourPointSparkle(ctx, 20, -20, 16);
      ctx.fillStyle = '#CDEBFF';
      drawFourPointSparkle(ctx, -24, 20, 14);
      break;
    }
    case 'flower-cherry':
    case 'flower-daisy': {
      const petalColor = type === 'flower-cherry' ? '#FFB3C6' : '#FFFFFF';
      ctx.fillStyle = petalColor;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * 20;
        const py = Math.sin(angle) * 20;
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'bow-coquette':
    case 'bow-lavender': {
      const bowColor = type === 'bow-coquette' ? '#FF85A9' : '#B892FF';
      ctx.fillStyle = bowColor;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5;

      // Left loop
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-44, -32, -48, 26, 0, 6);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Right loop
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(44, -32, 48, 26, 0, 6);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Ribbon tails
      ctx.lineWidth = 8;
      ctx.strokeStyle = bowColor;
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.quadraticCurveTo(-18, 28, -26, 40);
      ctx.moveTo(4, 6);
      ctx.quadraticCurveTo(18, 28, 26, 40);
      ctx.stroke();

      // Center knot
      ctx.fillStyle = '#FFE5EC';
      ctx.beginPath();
      ctx.arc(0, 2, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'face-mochi':
    case 'face-wink': {
      ctx.fillStyle = '#FFF9F2';
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = '#FFACC5';
      ctx.beginPath();
      ctx.arc(-18, 5, 6, 0, Math.PI * 2);
      ctx.arc(18, 5, 6, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#393343';
      if (type === 'face-wink') {
        ctx.beginPath();
        ctx.moveTo(-18, -5);
        ctx.quadraticCurveTo(-12, -12, -6, -5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-12, -6, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(12, -6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(0, 2, 7, 0.2, Math.PI - 0.2);
      ctx.stroke();
      break;
    }
    case 'cat-ears': {
      ctx.fillStyle = '#FFF9F2';
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 5;

      // Left cat ear
      ctx.beginPath();
      ctx.moveTo(-52, 16);
      ctx.lineTo(-42, -32);
      ctx.lineTo(-14, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right cat ear
      ctx.beginPath();
      ctx.moveTo(52, 16);
      ctx.lineTo(42, -32);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner pink
      ctx.fillStyle = '#FFC9DE';
      ctx.beginPath();
      ctx.moveTo(-44, 10);
      ctx.lineTo(-39, -18);
      ctx.lineTo(-22, 4);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(44, 10);
      ctx.lineTo(39, -18);
      ctx.lineTo(22, 4);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'bunny-ears': {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(-24, -6, 13, 38, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(24, -6, 13, 38, 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFC9DE';
      ctx.beginPath();
      ctx.ellipse(-24, -6, 6, 24, -0.18, 0, Math.PI * 2);
      ctx.ellipse(24, -6, 6, 24, 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'doodle-crown': {
      ctx.fillStyle = '#FFD166';
      ctx.strokeStyle = '#393343';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-32, 18);
      ctx.lineTo(-36, -16);
      ctx.lineTo(-14, 2);
      ctx.lineTo(0, -24);
      ctx.lineTo(14, 2);
      ctx.lineTo(36, -16);
      ctx.lineTo(32, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FF6B9E';
      ctx.beginPath();
      ctx.arc(0, -28, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'doodle-cloud': {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#8ECAE6';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(-20, 6, 18, 0, Math.PI * 2);
      ctx.arc(0, -6, 22, 0, Math.PI * 2);
      ctx.arc(22, 6, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'doodle-music': {
      ctx.strokeStyle = '#8C65F7';
      ctx.fillStyle = '#8C65F7';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-12, 16);
      ctx.lineTo(-12, -22);
      ctx.lineTo(20, -28);
      ctx.lineTo(20, 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(-18, 18, 10, 7, -0.3, 0, Math.PI * 2);
      ctx.ellipse(14, 12, 10, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  item: TextOverlayItem,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!item.text.trim()) return;
  ctx.save();
  const x = item.x * canvasWidth;
  const y = item.y * canvasHeight;

  ctx.translate(x, y);
  ctx.rotate((item.rotation * Math.PI) / 180);

  ctx.font = `700 ${item.fontSize}px "${item.fontFamily}", Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(item.text);
  const padX = 22;
  const padY = 12;
  const boxW = metrics.width + padX * 2;
  const boxH = item.fontSize * 1.25 + padY;

  if (item.bgPill) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.shadowColor = 'rgba(57, 51, 67, 0.16)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    traceRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, boxH / 2);
    ctx.fill();
  }

  // Subtle text outline for readability on any background
  ctx.lineWidth = Math.max(3, item.fontSize * 0.12);
  ctx.strokeStyle = item.color === '#FFFFFF' ? '#393343' : '#FFFFFF';
  ctx.lineJoin = 'round';
  ctx.strokeText(item.text, 0, 0);

  ctx.fillStyle = item.color;
  ctx.fillText(item.text, 0, 0);
  ctx.restore();
}

/**
 * Full master composition renderer onto a target HTMLCanvasElement.
 * Used for both Live Preview and high-resolution PNG/JPEG final export.
 */
export async function renderPhotoboothCanvas(
  canvas: HTMLCanvasElement,
  photos: (CapturedPhoto | null)[],
  editorState: EditorState,
  scaleMultiplier = 1
): Promise<void> {
  const { customization, adjustments, stickers, texts } = editorState;
  const layout = getLayoutById(customization.layoutId);
  const frame = getFrameById(customization.frameId);

  const baseW = layout.canvasWidth;
  const baseH = layout.canvasHeight;

  canvas.width = Math.round(baseW * scaleMultiplier);
  canvas.height = Math.round(baseH * scaleMultiplier);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable on this browser.');
  }

  ctx.save();
  ctx.scale(scaleMultiplier, scaleMultiplier);

  // 1. Background & pattern
  drawFrameBackgroundAndPattern(
    ctx,
    baseW,
    baseH,
    frame,
    customization.customBgColor,
    customization.transparentBg
  );

  // 2. Top header brand text
  ctx.save();
  ctx.fillStyle = frame.textColor;
  ctx.font = frame.headerFont || '800 24px "Fredoka", "Quicksand", Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(frame.defaultHeaderText, baseW / 2, layout.defaultPadding + 28);
  ctx.restore();

  // 3. Decode images & draw each photo slot
  const slots = computeLayoutSlots(
    customization.layoutId,
    customization.photoGap,
    customization.borderRadius
  );

  const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
    slots.map(async (_, idx) => {
      const shot = photos[idx];
      if (!shot || !shot.dataUrl) return null;
      try {
        return await loadImageElement(shot.dataUrl);
      } catch {
        return null;
      }
    })
  );

  slots.forEach((slot, idx) => {
    drawPhotoInSlot(
      ctx,
      slot,
      idx,
      loadedImages[idx],
      adjustments,
      frame,
      customization.borderThickness,
      customization.borderRadius
    );
  });

  // 3b. Theme overlay decoration (comic burst, flight badge, racing flag)
  if (!customization.transparentBg) {
    drawFrameOverlay(ctx, baseW, baseH, frame, layout.bottomFooterHeight);
  }

  // 4. Footer caption & optional date stamp
  const footerCenterY = baseH - layout.bottomFooterHeight / 2;
  ctx.save();
  ctx.fillStyle = frame.textColor;
  ctx.textAlign = 'center';

  const caption =
    customization.customFooterCaption.trim() !== ''
      ? customization.customFooterCaption
      : frame.defaultFooterText;

  ctx.font = '700 26px "Quicksand", Nunito, sans-serif';
  ctx.fillText(caption, baseW / 2, footerCenterY - (customization.showDateStamp ? 14 : 0));

  if (customization.showDateStamp) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    ctx.font = '600 18px Nunito, sans-serif';
    ctx.globalAlpha = 0.78;
    ctx.fillText(`${formattedDate} • MOCHI BOOTH 📸`, baseW / 2, footerCenterY + 22);
  }
  ctx.restore();

  // 5. Render user Stickers
  stickers.forEach((sticker: StickerItem) => {
    drawVectorSticker(
      ctx,
      sticker.type,
      sticker.x * baseW,
      sticker.y * baseH,
      sticker.scale,
      sticker.rotation
    );
  });

  // 6. Render user Texts
  texts.forEach((t: TextOverlayItem) => {
    drawTextOverlay(ctx, t, baseW, baseH);
  });

  ctx.restore();
}

/**
 * Exports a rendered canvas to a Blob in PNG or JPEG format.
 */
export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image file from canvas.'));
            return;
          }
          resolve(blob);
        },
        format,
        format === 'image/jpeg' ? Math.max(0.5, Math.min(1, quality)) : undefined
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Canvas export failed.'));
    }
  });
}

/**
 * Formats an automatic download filename like `mochi-booth-2026-10-22.png`
 */
export function buildExportFilename(extension: 'png' | 'jpg', prefix = 'mochi-booth'): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${prefix}-${yyyy}-${mm}-${dd}-${hh}${min}.${extension}`;
}

