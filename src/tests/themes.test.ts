import { describe, expect, it } from 'vitest';
import { FRAME_THEMES, STICKER_CATALOG } from '../utils/constants';
import { THEMES, THEME_ORDER, themeFrameIds } from '../utils/themes';

describe('Mochi theme presets', () => {
  it('every theme references real frames and stickers', () => {
    const frameIds = new Set(FRAME_THEMES.map((f) => f.id));
    const stickerTypes = new Set(STICKER_CATALOG.map((s) => s.type));
    for (const id of THEME_ORDER) {
      const t = THEMES[id];
      expect(frameIds.has(t.defaultFrameId)).toBe(true);
      expect(themeFrameIds(id)).toContain(t.defaultFrameId);
      for (const c of t.collections) {
        c.frameIds.forEach((f) => expect(frameIds.has(f), `${id}/${c.id}/${f}`).toBe(true));
        c.stickers.forEach((s) => expect(stickerTypes.has(s), `${id}/${c.id}/${s}`).toBe(true));
      }
    }
  });

  it('Guy has comic and aviation collections; Straight has 6 separate categories', () => {
    const guy = THEMES.guy.collections.map((c) => c.id);
    expect(guy).toEqual(expect.arrayContaining(['comic', 'aviation']));
    expect(THEMES.straight.collections.map((c) => c.label)).toEqual(
      expect.arrayContaining(['Classic', 'Cute', 'Comic', 'Adventure', 'Minimal', 'Seasonal'])
    );
  });
});
