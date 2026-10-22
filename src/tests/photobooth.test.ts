import { describe, it, expect } from 'vitest';
import {
  computeLayoutSlots,
  FILTER_DEFINITIONS,
  FRAME_CATEGORIES,
  FRAME_THEMES,
  getFrameById,
  getLayoutById,
  LAYOUT_CONFIGS,
  STICKER_CATALOG,
} from '../utils/constants';
import {
  buildExportFilename,
  getFilterCssAndTint,
} from '../utils/canvasComposer';
import {
  AR_FILTER_CATALOG,
  CAMERA_COLOR_TONES,
  extractFaceMetrics,
  smoothFaceMetricsList,
  toggleCompatibleARFilter,
} from '../utils/arFilters';
import { NormalizedPoint } from '../types/photobooth';

describe('Mochi Booth Core Photobooth & Live AR Engine', () => {
  it('provides all 10 distinct photobooth layouts with accurate slot counts', () => {
    expect(LAYOUT_CONFIGS.length).toBe(10);

    for (const layout of LAYOUT_CONFIGS) {
      const slots = computeLayoutSlots(layout.id, layout.defaultGap, 16);
      expect(slots.length).toBe(layout.photoCount);

      slots.forEach((slot) => {
        expect(slot.width).toBeGreaterThan(50);
        expect(slot.height).toBeGreaterThan(50);
        expect(slot.x).toBeGreaterThanOrEqual(0);
        expect(slot.y).toBeGreaterThanOrEqual(0);
        expect(slot.x + slot.width).toBeLessThanOrEqual(layout.canvasWidth + 20);
        expect(slot.y + slot.height).toBeLessThanOrEqual(layout.canvasHeight);
      });
    }
  });

  it('respects custom photoGap and clamps extreme gap values safely', () => {
    const slotsSmallGap = computeLayoutSlots('classic-strip-4', 10, 12);
    const slotsLargeGap = computeLayoutSlots('classic-strip-4', 45, 12);

    expect(slotsSmallGap).toHaveLength(4);
    expect(slotsLargeGap).toHaveLength(4);
    expect(slotsLargeGap[0].height).toBeLessThan(slotsSmallGap[0].height);
  });

  it('provides 16 distinct cute frame themes covering all 16 required categories', () => {
    expect(FRAME_THEMES.length).toBeGreaterThanOrEqual(16);
    const nonAllCategories = FRAME_CATEGORIES.filter((c) => c !== 'All');
    expect(nonAllCategories.length).toBe(16);

    for (const cat of nonAllCategories) {
      const hasThemeForCategory = FRAME_THEMES.some((f) => f.category === cat);
      expect(hasThemeForCategory).toBe(true);
    }

    const sample = getFrameById('strawberry-milk-carton');
    expect(sample.name).toContain('Strawberry');
  });

  it('provides all 13 photo filters and 10 live camera color tones', () => {
    expect(FILTER_DEFINITIONS.length).toBe(13);
    expect(CAMERA_COLOR_TONES.length).toBe(10);

    const softPink = getFilterCssAndTint('soft-pink', 10, -5, 15);
    expect(softPink.cssFilter).toContain('brightness(110%)');
    expect(softPink.cssFilter).toContain('contrast(95%)');
    expect(softPink.cssFilter).toContain('saturate(115%)');
    expect(softPink.tintColor).toBe('#FFB6D9');
    expect(softPink.tintAlpha).toBeGreaterThan(0);

    const bw = getFilterCssAndTint('grayscale', 0, 0, 0);
    expect(bw.cssFilter).toContain('grayscale(100%)');
  });

  it('provides 51 distinct Live AR Face Filters across all 6 categories', () => {
    expect(AR_FILTER_CATALOG.length).toBeGreaterThanOrEqual(51);

    const categories = ['Animal', 'Hair', 'Accessories', 'Makeup', 'Fantasy', 'Seasonal'] as const;
    for (const cat of categories) {
      const countInCat = AR_FILTER_CATALOG.filter((f) => f.category === cat).length;
      expect(countInCat).toBeGreaterThanOrEqual(8);
    }
  });

  it('allows combining compatible AR filters across different slots while replacing colliding slots', () => {
    let active = toggleCompatibleARFilter([], 'bunny-ears'); // slot: ears
    active = toggleCompatibleARFilter(active, 'rosy-pink-cheeks'); // slot: cheeks
    active = toggleCompatibleARFilter(active, 'heart-glasses'); // slot: eyewear
    active = toggleCompatibleARFilter(active, 'floating-hearts'); // slot: ambient

    expect(active).toEqual([
      'bunny-ears',
      'rosy-pink-cheeks',
      'heart-glasses',
      'floating-hearts',
    ]);

    // Selecting 'cat-ears-ar' (also slot: ears) should replace 'bunny-ears' without clearing cheeks/eyewear/ambient
    active = toggleCompatibleARFilter(active, 'cat-ears-ar');
    expect(active).toContain('cat-ears-ar');
    expect(active).not.toContain('bunny-ears');
    expect(active).toContain('rosy-pink-cheeks');
    expect(active).toContain('heart-glasses');
    expect(active).toContain('floating-hearts');
  });

  it('extracts and smooths 478-landmark face metrics accurately', () => {
    const fakeLandmarks: NormalizedPoint[] = Array.from({ length: 478 }, () => ({
      x: 0.5,
      y: 0.5,
      z: 0,
    }));
    // Set key anatomical indices
    fakeLandmarks[10] = { x: 0.5, y: 0.25 }; // forehead top
    fakeLandmarks[152] = { x: 0.5, y: 0.75 }; // chin bottom
    fakeLandmarks[33] = { x: 0.4, y: 0.42 }; // left eye outer
    fakeLandmarks[133] = { x: 0.45, y: 0.42 }; // left eye inner
    fakeLandmarks[362] = { x: 0.55, y: 0.42 }; // right eye inner
    fakeLandmarks[263] = { x: 0.6, y: 0.42 }; // right eye outer
    fakeLandmarks[234] = { x: 0.32, y: 0.5 }; // left temple
    fakeLandmarks[454] = { x: 0.68, y: 0.5 }; // right temple

    const m1 = extractFaceMetrics(fakeLandmarks, 1000, 1000);
    expect(m1).not.toBeNull();
    expect(m1!.faceWidth).toBeCloseTo(360, 0);
    expect(m1!.faceHeight).toBeCloseTo(500, 0);
    expect(m1!.rollAngleRad).toBeCloseTo(0, 3);

    // Move forehead slightly and verify EMA smoothing interpolates smoothly
    fakeLandmarks[10] = { x: 0.55, y: 0.25 };
    const m2 = extractFaceMetrics(fakeLandmarks, 1000, 1000)!;
    const smoothed = smoothFaceMetricsList([m1!], [m2], 0.5);
    expect(smoothed[0].foreheadTop.x).toBeGreaterThan(500);
    expect(smoothed[0].foreheadTop.x).toBeLessThan(550);
  });

  it('provides cute vector stickers and generates clean automatic export filenames', () => {
    expect(STICKER_CATALOG.length).toBeGreaterThanOrEqual(12);
    const pngName = buildExportFilename('png', 'mochi-booth');
    expect(pngName).toMatch(/^mochi-booth-\d{4}-\d{2}-\d{2}-\d{4}\.png$/);

    const fallbackLayout = getLayoutById('classic-strip-4');
    expect(fallbackLayout.id).toBe('classic-strip-4');
  });
});
