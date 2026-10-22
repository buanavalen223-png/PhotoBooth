import { describe, it, expect } from 'vitest';
import {
  BACKGROUND_CATEGORIES,
  BACKGROUND_LIBRARY,
  getBackgroundById,
  getRecommendedBackgrounds,
} from '../utils/backgroundLibrary';
import {
  THEME_FILTERS,
  getFilterDefinition,
  getFiltersForTheme,
} from '../utils/filters';
import { backgroundSegmenterService } from '../utils/backgroundSegmenter';

describe('Real-Time Background Replacement Library', () => {
  it('provides all 6 background categories and required background items', () => {
    expect(BACKGROUND_CATEGORIES).toContain('Colors');
    expect(BACKGROUND_CATEGORIES).toContain('Gradients');
    expect(BACKGROUND_CATEGORIES).toContain('Studio');
    expect(BACKGROUND_CATEGORIES).toContain('Cute');
    expect(BACKGROUND_CATEGORIES).toContain('Comic');
    expect(BACKGROUND_CATEGORIES).toContain('Adventure');

    expect(BACKGROUND_LIBRARY.length).toBeGreaterThanOrEqual(16);

    // Verify solid colors
    const colors = BACKGROUND_LIBRARY.filter((b) => b.category === 'Colors');
    expect(colors.length).toBeGreaterThanOrEqual(7);
    const colorIds = colors.map((c) => c.id);
    expect(colorIds).toContain('color-white');
    expect(colorIds).toContain('color-black');
    expect(colorIds).toContain('color-pastel-pink');
    expect(colorIds).toContain('color-lavender');
    expect(colorIds).toContain('color-sky-blue');
    expect(colorIds).toContain('color-cream');
    expect(colorIds).toContain('color-charcoal');

    // Verify gradients
    const grads = BACKGROUND_LIBRARY.filter((b) => b.category === 'Gradients');
    expect(grads.length).toBeGreaterThanOrEqual(5);

    // Verify scene backgrounds
    const scenes = BACKGROUND_LIBRARY.filter(
      (b) => ['Studio', 'Cute', 'Comic', 'Adventure'].includes(b.category)
    );
    expect(scenes.length).toBeGreaterThanOrEqual(8);
  });

  it('correctly filters recommended backgrounds per theme', () => {
    const slayRecs = getRecommendedBackgrounds('slay');
    expect(slayRecs.some((b) => b.id === 'color-pastel-pink')).toBe(true);
    expect(slayRecs.some((b) => b.id === 'scene-cute-pastel-room')).toBe(true);

    const guyRecs = getRecommendedBackgrounds('guy');
    expect(guyRecs.some((b) => b.id === 'scene-comic-action')).toBe(true);
    expect(guyRecs.some((b) => b.id === 'scene-aviation-cockpit')).toBe(true);
    expect(guyRecs.some((b) => b.id === 'color-black')).toBe(true);

    const straightRecs = getRecommendedBackgrounds('straight');
    expect(straightRecs.some((b) => b.id === 'scene-studio-spotlight')).toBe(true);
    expect(straightRecs.some((b) => b.id === 'color-white')).toBe(true);
  });

  it('safely falls back to default background when invalid ID is requested', () => {
    const fallback = getBackgroundById('non-existent-id');
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe(BACKGROUND_LIBRARY[0].id);
  });

  it('draws background on a test canvas context without throwing', () => {
    const mockCtx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      bezierCurveTo: () => {},
      closePath: () => {},
      rect: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      save: () => {},
      restore: () => {},
    } as unknown as CanvasRenderingContext2D;

    for (const bg of BACKGROUND_LIBRARY) {
      expect(() => bg.draw(mockCtx, 400, 300)).not.toThrow();
    }
  });

  it('segmenter service reports idle status before camera start', () => {
    expect(['idle', 'ready', 'loading', 'error']).toContain(
      backgroundSegmenterService.getStatus()
    );
  });
});

describe('Theme Filter Engine', () => {
  it('provides dedicated distinct filters for Slay, Guy, and Straight', () => {
    const slayFilters = getFiltersForTheme('slay');
    const slayIds = slayFilters.map((f) => f.id);
    expect(slayIds).toContain('slay-dreamy');
    expect(slayIds).toContain('slay-rosy');
    expect(slayIds).toContain('slay-film-diary');
    expect(slayIds).toContain('slay-cloud-nine');
    expect(slayIds).toContain('slay-vintage-sweet');
    expect(slayIds).toContain('slay-glitter-pop');

    const guyFilters = getFiltersForTheme('guy');
    const guyIds = guyFilters.map((f) => f.id);
    expect(guyIds).toContain('guy-cinematic');
    expect(guyIds).toContain('guy-cold-steel');
    expect(guyIds).toContain('guy-night-drive');
    expect(guyIds).toContain('guy-action-comic');
    expect(guyIds).toContain('guy-vintage-flight');
    expect(guyIds).toContain('guy-street-chrome');

    const straightFilters = getFiltersForTheme('straight');
    const straightIds = straightFilters.map((f) => f.id);
    expect(straightIds).toContain('straight-natural');
    expect(straightIds).toContain('straight-classic-film');
    expect(straightIds).toContain('straight-warm-portrait');
    expect(straightIds).toContain('straight-cool-editorial');
    expect(straightIds).toContain('straight-monochrome');
    expect(straightIds).toContain('straight-soft-focus');
  });

  it('resolves legacy filter aliases correctly', () => {
    const softPink = getFilterDefinition('soft-pink');
    expect(softPink.id).toBe('slay-rosy');

    const mono = getFilterDefinition('grayscale');
    expect(mono.id).toBe('straight-monochrome');

    const cine = getFilterDefinition('contrast');
    expect(cine.id).toBe('guy-cinematic');
  });
});
