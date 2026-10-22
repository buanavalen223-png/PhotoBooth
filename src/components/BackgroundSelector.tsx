import React, { useState, useMemo } from 'react';
import {
  BACKGROUND_CATEGORIES,
  BACKGROUND_LIBRARY,
  BackgroundCategory,
  BackgroundItem,
  BackgroundMode,
} from '../utils/backgroundLibrary';
import { ThemeId } from '../utils/themes';
import {
  Sparkles,
  Camera,
  Layers,
  RotateCcw,
  Check,
  Loader2,
  Sliders,
} from 'lucide-react';

interface BackgroundSelectorProps {
  themeId: ThemeId;
  mode: BackgroundMode;
  selectedBackgroundId: string;
  isSegmenterReady: boolean;
  isSegmenterLoading: boolean;
  onModeChange: (mode: BackgroundMode) => void;
  onSelectBackground: (id: string) => void;
  onReset: () => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  themeId,
  mode,
  selectedBackgroundId,
  isSegmenterReady,
  isSegmenterLoading,
  onModeChange,
  onSelectBackground,
  onReset,
}) => {
  const [activeCategory, setActiveCategory] = useState<BackgroundCategory>('All');
  const [showRecommendedOnly, setShowRecommendedOnly] = useState<boolean>(true);

  const displayedBackgrounds = useMemo(() => {
    return BACKGROUND_LIBRARY.filter((item: BackgroundItem) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesRecommended =
        !showRecommendedOnly || item.recommendedThemes.includes(themeId);
      return matchesCategory && matchesRecommended;
    });
  }, [activeCategory, showRecommendedOnly, themeId]);

  return (
    <div className="bg-selector-panel" role="region" aria-label="Camera background controls">
      {/* HEADER & STATUS */}
      <div className="bg-panel-header">
        <div className="bg-title-wrap">
          <Layers size={17} />
          <strong>Real-Time Background</strong>
        </div>
        {isSegmenterLoading && (
          <div className="bg-status-pill loading" aria-live="polite">
            <Loader2 size={13} className="spin-icon" />
            <span>AI Loading...</span>
          </div>
        )}
        {isSegmenterReady && mode !== 'original' && (
          <div className="bg-status-pill active" aria-live="polite">
            <Sparkles size={13} />
            <span>AI Active</span>
          </div>
        )}
      </div>

      {/* MODE SELECTOR (ORIGINAL, BLUR, REPLACE) */}
      <div className="bg-mode-tabs" role="tablist" aria-label="Background mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'original'}
          className={`bg-mode-btn ${mode === 'original' ? 'active' : ''}`}
          onClick={() => onModeChange('original')}
        >
          <Camera size={14} />
          <span>Original</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === 'blur'}
          className={`bg-mode-btn ${mode === 'blur' ? 'active' : ''}`}
          onClick={() => onModeChange('blur')}
        >
          <Sliders size={14} />
          <span>Blur Background</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === 'replace'}
          className={`bg-mode-btn ${mode === 'replace' ? 'active' : ''}`}
          onClick={() => onModeChange('replace')}
        >
          <Layers size={14} />
          <span>Replace Scene</span>
        </button>
      </div>

      {/* CONTROLS SPECIFIC TO REPLACE MODE */}
      {mode === 'replace' && (
        <div className="bg-replace-controls">
          {/* CATEGORY & RECOMMENDED FILTER CHIPS */}
          <div className="bg-filter-bar">
            <button
              type="button"
              className={`filter-pill ${showRecommendedOnly ? 'active' : ''}`}
              onClick={() => setShowRecommendedOnly((v) => !v)}
              aria-pressed={showRecommendedOnly}
            >
              <Sparkles size={12} />
              <span>Recommended for {themeId.toUpperCase()}</span>
            </button>

            <div className="bg-category-scroll" role="tablist">
              {BACKGROUND_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`bg-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (cat !== 'All') setShowRecommendedOnly(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* THUMBNAIL GALLERY */}
          <div className="bg-grid-scroller" role="radiogroup" aria-label="Select background">
            {displayedBackgrounds.map((bg) => {
              const isSelected = selectedBackgroundId === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`bg-thumb-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectBackground(bg.id)}
                  title={`${bg.name} - ${bg.description}`}
                >
                  <div
                    className="bg-thumb-preview"
                    style={{ background: bg.cssPreview }}
                  >
                    {isSelected && (
                      <div className="bg-check-badge">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <span className="bg-thumb-name">{bg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RESET & HELPER TEXT */}
      <div className="bg-panel-footer">
        {mode !== 'original' && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            title="Reset to normal camera feed"
          >
            <RotateCcw size={13} />
            <span>Reset to Original</span>
          </button>
        )}
        <span className="bg-hint">
          {mode === 'original' && 'Showing original camera room environment.'}
          {mode === 'blur' && 'Softly blurring your background while keeping you sharp.'}
          {mode === 'replace' && 'Composited live on camera and saved into your final photo strip.'}
        </span>
      </div>
    </div>
  );
};
