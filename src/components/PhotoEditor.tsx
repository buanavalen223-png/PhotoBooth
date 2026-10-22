import React, { useState } from 'react';
import {
  EditorState,
  FilterId,
  StickerItem,
  StickerType,
  TextOverlayItem,
} from '../types/photobooth';
import {
  FILTER_DEFINITIONS,
  QUICK_TEXT_PRESETS,
  STICKER_CATALOG,
} from '../utils/constants';
import { THEMES, ThemeId } from '../utils/themes';
import { getFiltersForTheme, THEME_FILTERS } from '../utils/filters';
import {
  Sliders,
  Sparkles,
  Smile,
  Type,
  RotateCw,
  FlipHorizontal,
  Undo2,
  Redo2,
  RotateCcw,
  Trash2,
  Plus,
  ZoomIn,
  Move,
} from 'lucide-react';

interface PhotoEditorProps {
  editorState: EditorState;
  onUpdateState: (updater: (prev: EditorState) => EditorState, recordHistory?: boolean) => void;
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onResetEditor: () => void;
  themeId: ThemeId;
}

type EditorTab = 'filters' | 'adjust' | 'stickers' | 'text';

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  editorState,
  onUpdateState,
  selectedStickerId,
  onSelectSticker,
  selectedTextId,
  onSelectText,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onResetEditor,
  themeId,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('filters');
  const [stickerCollection, setStickerCollection] = useState<string>('all');
  const themeCollections = THEMES[themeId].collections;
  React.useEffect(() => setStickerCollection('all'), [themeId]);
  const visibleStickerTypes = new Set(
    themeCollections
      .filter((c) => stickerCollection === 'all' || c.id === stickerCollection)
      .flatMap((c) => c.stickers)
  );
  const visibleStickers = STICKER_CATALOG.filter((i) => visibleStickerTypes.has(i.type));
  const [newTextDraft, setNewTextDraft] = useState('Mochi Memories ✨');
  const [filterCollection, setFilterCollection] = useState<'theme' | 'all'>('theme');
  const themeFilters = getFiltersForTheme(themeId);
  const displayedFilters = filterCollection === 'theme' ? themeFilters : THEME_FILTERS;

  const { adjustments, stickers, texts } = editorState;
  const activeSticker = stickers.find((s) => s.id === selectedStickerId) || null;
  const activeText = texts.find((t) => t.id === selectedTextId) || null;

  const handleFilterSelect = (filterId: FilterId) => {
    onUpdateState((prev) => ({
      ...prev,
      adjustments: { ...prev.adjustments, filter: filterId },
    }));
  };

  const handleAddSticker = (type: StickerType, label: string) => {
    const id = `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // Place with slight offset so multiple stickers don't stack invisibly
    const offset = (stickers.length % 5) * 0.05 - 0.1;
    const newSticker: StickerItem = {
      id,
      type,
      label,
      x: Math.max(0.15, Math.min(0.85, 0.5 + offset)),
      y: Math.max(0.15, Math.min(0.85, 0.45 + offset)),
      scale: 1,
      rotation: 0,
    };
    onUpdateState((prev) => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
    onSelectSticker(id);
    onSelectText(null);
  };

  const handleUpdateSelectedSticker = (patch: Partial<StickerItem>) => {
    if (!selectedStickerId) return;
    onUpdateState((prev) => ({
      ...prev,
      stickers: prev.stickers.map((s) => (s.id === selectedStickerId ? { ...s, ...patch } : s)),
    }));
  };

  const handleDeleteSelectedSticker = () => {
    if (!selectedStickerId) return;
    onUpdateState((prev) => ({
      ...prev,
      stickers: prev.stickers.filter((s) => s.id !== selectedStickerId),
    }));
    onSelectSticker(null);
  };

  const handleAddText = (content?: string) => {
    const textValue = (content ?? newTextDraft).trim();
    if (!textValue) return;
    const id = `txt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newText: TextOverlayItem = {
      id,
      text: textValue,
      x: 0.5,
      y: 0.25 + (texts.length % 4) * 0.12,
      color: '#393343',
      fontSize: 38,
      fontFamily: 'Fredoka',
      rotation: 0,
      bgPill: true,
    };
    onUpdateState((prev) => ({
      ...prev,
      texts: [...prev.texts, newText],
    }));
    onSelectText(id);
    onSelectSticker(null);
  };

  const handleUpdateSelectedText = (patch: Partial<TextOverlayItem>) => {
    if (!selectedTextId) return;
    onUpdateState((prev) => ({
      ...prev,
      texts: prev.texts.map((t) => (t.id === selectedTextId ? { ...t, ...patch } : t)),
    }));
  };

  const handleDeleteSelectedText = () => {
    if (!selectedTextId) return;
    onUpdateState((prev) => ({
      ...prev,
      texts: prev.texts.filter((t) => t.id !== selectedTextId),
    }));
    onSelectText(null);
  };

  return (
    <div className="photo-editor-panel">
      {/* HISTORY BAR: UNDO / REDO / RESET */}
      <div className="editor-history-bar">
        <span className="editor-panel-title">✨ Customize & Decorate</span>
        <div className="history-btn-group">
          <button
            type="button"
            className="btn btn-chip"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last edit"
            aria-label="Undo"
          >
            <Undo2 size={15} />
            <span>Undo</span>
          </button>
          <button
            type="button"
            className="btn btn-chip"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo edit"
            aria-label="Redo"
          >
            <Redo2 size={15} />
            <span>Redo</span>
          </button>
          <button
            type="button"
            className="btn btn-chip btn-chip-danger"
            onClick={onResetEditor}
            title="Reset all filters, stickers, and texts"
            aria-label="Reset Editor"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* EDITOR TABS */}
      <div className="editor-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'filters'}
          className={`editor-tab-btn ${activeTab === 'filters' ? 'active' : ''}`}
          onClick={() => setActiveTab('filters')}
        >
          <Sparkles size={16} />
          <span>Filters (11)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'adjust'}
          className={`editor-tab-btn ${activeTab === 'adjust' ? 'active' : ''}`}
          onClick={() => setActiveTab('adjust')}
        >
          <Sliders size={16} />
          <span>Adjust & Crop</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'stickers'}
          className={`editor-tab-btn ${activeTab === 'stickers' ? 'active' : ''}`}
          onClick={() => setActiveTab('stickers')}
        >
          <Smile size={16} />
          <span>Stickers ({stickers.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'text'}
          className={`editor-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <Type size={16} />
          <span>Text ({texts.length})</span>
        </button>
      </div>

      {/* TAB 1: PHOTO FILTERS */}
      {activeTab === 'filters' && (
        <div className="editor-tab-body">
          <div className="category-scroll-strip" role="tablist" aria-label="Filter collection">
            <button
              type="button"
              role="tab"
              aria-selected={filterCollection === 'theme'}
              className={`category-chip ${filterCollection === 'theme' ? 'active' : ''}`}
              onClick={() => setFilterCollection('theme')}
            >
              ✨ {THEMES[themeId].label} Curated ({themeFilters.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filterCollection === 'all'}
              className={`category-chip ${filterCollection === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCollection('all')}
            >
              All Filters ({THEME_FILTERS.length})
            </button>
          </div>

          <p className="editor-helper-text">
            Fine-art color grading & effects—applied directly to your final high-res download!
          </p>

          <div className="filters-grid">
            {displayedFilters.map((f) => {
              const isSelected = adjustments.filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleFilterSelect(f.id as FilterId)}
                  aria-pressed={isSelected}
                >
                  <span className="filter-emoji">{f.badge}</span>
                  <div className="filter-text">
                    <strong>{f.name}</strong>
                    <small>{f.description}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE ADJUSTMENTS (BRIGHTNESS, CONTRAST, SATURATION, ZOOM, CROP PAN, ROTATE, FLIP) */}
      {activeTab === 'adjust' && (
        <div className="editor-tab-body">
          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="slider-brightness">Brightness</label>
              <span>{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
            </div>
            <input
              id="slider-brightness"
              type="range"
              min={-45}
              max={45}
              value={adjustments.brightness}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: { ...prev.adjustments, brightness: Number(e.target.value) },
                }))
              }
            />
          </div>

          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="slider-contrast">Contrast</label>
              <span>{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
            </div>
            <input
              id="slider-contrast"
              type="range"
              min={-45}
              max={45}
              value={adjustments.contrast}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: { ...prev.adjustments, contrast: Number(e.target.value) },
                }))
              }
            />
          </div>

          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="slider-saturation">Saturation</label>
              <span>{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}</span>
            </div>
            <input
              id="slider-saturation"
              type="range"
              min={-50}
              max={50}
              value={adjustments.saturation}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: { ...prev.adjustments, saturation: Number(e.target.value) },
                }))
              }
            />
          </div>

          <div className="slider-control-group">
            <div className="slider-label-row">
              <label htmlFor="slider-zoom">
                <ZoomIn size={14} /> Zoom & Crop Scale
              </label>
              <span>{adjustments.zoom.toFixed(2)}×</span>
            </div>
            <input
              id="slider-zoom"
              type="range"
              min={1}
              max={2.4}
              step={0.05}
              value={adjustments.zoom}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: { ...prev.adjustments, zoom: Number(e.target.value) },
                }))
              }
            />
          </div>

          {adjustments.zoom > 1.02 && (
            <div className="crop-pan-row">
              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="slider-pan-x">
                    <Move size={13} /> Crop Pan Horizontal
                  </label>
                  <span>{Math.round(adjustments.panX * 100)}%</span>
                </div>
                <input
                  id="slider-pan-x"
                  type="range"
                  min={-0.45}
                  max={0.45}
                  step={0.02}
                  value={adjustments.panX}
                  onChange={(e) =>
                    onUpdateState((prev) => ({
                      ...prev,
                      adjustments: { ...prev.adjustments, panX: Number(e.target.value) },
                    }))
                  }
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="slider-pan-y">
                    <Move size={13} /> Crop Pan Vertical
                  </label>
                  <span>{Math.round(adjustments.panY * 100)}%</span>
                </div>
                <input
                  id="slider-pan-y"
                  type="range"
                  min={-0.45}
                  max={0.45}
                  step={0.02}
                  value={adjustments.panY}
                  onChange={(e) =>
                    onUpdateState((prev) => ({
                      ...prev,
                      adjustments: { ...prev.adjustments, panY: Number(e.target.value) },
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="transform-buttons-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: {
                    ...prev.adjustments,
                    rotation: ((prev.adjustments.rotation + 90) % 360) as 0 | 90 | 180 | 270,
                  },
                }))
              }
            >
              <RotateCw size={15} />
              <span>Rotate 90° ({adjustments.rotation}°)</span>
            </button>

            <button
              type="button"
              className={`btn btn-secondary btn-sm ${adjustments.flipH ? 'active-toggle' : ''}`}
              onClick={() =>
                onUpdateState((prev) => ({
                  ...prev,
                  adjustments: {
                    ...prev.adjustments,
                    flipH: !prev.adjustments.flipH,
                  },
                }))
              }
            >
              <FlipHorizontal size={15} />
              <span>Flip Horizontal</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STICKERS */}
      {activeTab === 'stickers' && (
        <div className="editor-tab-body">
          <p className="editor-helper-text">
            Click any cute sticker to add it to your strip! Drag stickers directly on the live
            preview canvas or fine-tune below.
          </p>

          <div className="category-scroll-strip" role="tablist" aria-label="Sticker collections">
            {[{ id: 'all', label: 'All' }, ...themeCollections].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={stickerCollection === c.id}
                className={`category-chip ${stickerCollection === c.id ? 'active' : ''}`}
                onClick={() => setStickerCollection(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="sticker-catalog-grid">
            {visibleStickers.map((item) => (
              <button
                key={item.type}
                type="button"
                className="sticker-pick-btn"
                onClick={() => handleAddSticker(item.type, item.label)}
                title={`Add ${item.label}`}
              >
                <span className="sticker-emoji">{item.emojiPreview}</span>
                <span className="sticker-name">{item.label}</span>
              </button>
            ))}
          </div>

          {activeSticker && (
            <div className="selected-item-inspector">
              <div className="inspector-header">
                <strong>Selected: {activeSticker.label}</strong>
                <button
                  type="button"
                  className="btn btn-chip btn-chip-danger"
                  onClick={handleDeleteSelectedSticker}
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>

              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="stk-scale">Sticker Size</label>
                  <span>{activeSticker.scale.toFixed(1)}×</span>
                </div>
                <input
                  id="stk-scale"
                  type="range"
                  min={0.4}
                  max={2.8}
                  step={0.1}
                  value={activeSticker.scale}
                  onChange={(e) => handleUpdateSelectedSticker({ scale: Number(e.target.value) })}
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="stk-rot">Sticker Rotation</label>
                  <span>{activeSticker.rotation}°</span>
                </div>
                <input
                  id="stk-rot"
                  type="range"
                  min={-180}
                  max={180}
                  step={5}
                  value={activeSticker.rotation}
                  onChange={(e) =>
                    handleUpdateSelectedSticker({ rotation: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEXT OVERLAYS */}
      {activeTab === 'text' && (
        <div className="editor-tab-body">
          <div className="text-add-row">
            <input
              type="text"
              className="text-input-field"
              value={newTextDraft}
              onChange={(e) => setNewTextDraft(e.target.value)}
              placeholder="Type cute caption..."
              aria-label="New text caption"
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleAddText()}
            >
              <Plus size={16} />
              <span>Add Text</span>
            </button>
          </div>

          <div className="quick-presets-wrap">
            {QUICK_TEXT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="preset-chip"
                onClick={() => handleAddText(preset)}
              >
                + {preset}
              </button>
            ))}
          </div>

          {activeText && (
            <div className="selected-item-inspector">
              <div className="inspector-header">
                <strong>Edit Selected Text</strong>
                <button
                  type="button"
                  className="btn btn-chip btn-chip-danger"
                  onClick={handleDeleteSelectedText}
                >
                  <Trash2 size={14} />
                  <span>Delete Text</span>
                </button>
              </div>

              <div className="form-field-row">
                <label htmlFor="edit-text-val">Content</label>
                <input
                  id="edit-text-val"
                  type="text"
                  className="text-input-field"
                  value={activeText.text}
                  onChange={(e) => handleUpdateSelectedText({ text: e.target.value })}
                />
              </div>

              <div className="form-field-grid-2">
                <div>
                  <label htmlFor="edit-text-font">Font Style</label>
                  <select
                    id="edit-text-font"
                    className="select-pill full-width"
                    value={activeText.fontFamily}
                    onChange={(e) =>
                      handleUpdateSelectedText({
                        fontFamily: e.target.value as TextOverlayItem['fontFamily'],
                      })
                    }
                  >
                    <option value="Fredoka">Fredoka Cute</option>
                    <option value="Quicksand">Quicksand Soft</option>
                    <option value="Nunito">Nunito Rounded</option>
                    <option value="Poppins">Poppins Modern</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-text-color">Text Color</label>
                  <input
                    id="edit-text-color"
                    type="color"
                    className="color-picker-input"
                    value={activeText.color}
                    onChange={(e) => handleUpdateSelectedText({ color: e.target.value })}
                  />
                </div>
              </div>

              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="txt-size">Font Size</label>
                  <span>{activeText.fontSize}px</span>
                </div>
                <input
                  id="txt-size"
                  type="range"
                  min={22}
                  max={84}
                  value={activeText.fontSize}
                  onChange={(e) =>
                    handleUpdateSelectedText({ fontSize: Number(e.target.value) })
                  }
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-label-row">
                  <label htmlFor="txt-rot">Rotation</label>
                  <span>{activeText.rotation}°</span>
                </div>
                <input
                  id="txt-rot"
                  type="range"
                  min={-45}
                  max={45}
                  value={activeText.rotation}
                  onChange={(e) =>
                    handleUpdateSelectedText({ rotation: Number(e.target.value) })
                  }
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={activeText.bgPill}
                  onChange={(e) => handleUpdateSelectedText({ bgPill: e.target.checked })}
                />
                <span>Show creamy sticker pill background behind text</span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

