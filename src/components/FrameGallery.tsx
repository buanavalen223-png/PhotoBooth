import React, { useState, useMemo } from 'react';
import { FrameTheme } from '../types/photobooth';
import { THEMES, ThemeId } from '../utils/themes';
import { FRAME_CATEGORIES, FRAME_THEMES } from '../utils/constants';
import { Search, Check, Sparkles, Camera, X } from 'lucide-react';

interface FrameGalleryProps {
  selectedFrameId: string;
  onSelectFrame: (frameId: string) => void;
  onUseInStudio?: (frameId: string) => void;
  compactMode?: boolean;
  /** When set, frames are limited to and grouped by the active theme's preset collections. */
  themeId?: ThemeId;
}

export const FrameGallery: React.FC<FrameGalleryProps> = ({
  selectedFrameId,
  onSelectFrame,
  onUseInStudio,
  compactMode = false,
  themeId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFrames = useMemo(() => {
    const collections = themeId ? THEMES[themeId].collections : null;
    const allowed = collections
      ? new Set(
          collections
            .filter((c) => activeCategory === 'All' || c.label === activeCategory)
            .flatMap((c) => c.frameIds)
        )
      : null;
    return FRAME_THEMES.filter((frame) => {
      const matchesCategory = allowed
        ? allowed.has(frame.id)
        : activeCategory === 'All' || frame.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        frame.name.toLowerCase().includes(q) ||
        frame.category.toLowerCase().includes(q) ||
        frame.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, themeId]);

  const categories: string[] = themeId
    ? ['All', ...THEMES[themeId].collections.map((c) => c.label)]
    : FRAME_CATEGORIES;

  React.useEffect(() => setActiveCategory('All'), [themeId]);

  return (
    <div className={`frame-gallery-wrapper ${compactMode ? 'compact' : 'full-page'}`}>
      {!compactMode && (
        <div className="page-hero-header">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>16 Original Custom Frame Themes</span>
          </div>
          <h1>Cute Frame Collection 🎀</h1>
          <p>
            Every frame features unique pastel palettes, custom vector patterns, and matching header
            & footer typography. Click any frame to preview or launch directly into the studio!
          </p>
        </div>
      )}

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="frame-controls-bar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frames (e.g., Strawberry, Coquette, Retro, Pink)..."
            aria-label="Search frames"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="category-scroll-strip" role="tablist" aria-label="Frame categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FRAMES GRID */}
      {filteredFrames.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-emoji">🔍🌸</div>
          <h3>No matching frames found</h3>
          <p>Try clearing your search filter or picking “All” categories.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={`frames-grid ${compactMode ? 'frames-grid-compact' : ''}`}>
          {filteredFrames.map((frame: FrameTheme) => {
            const isSelected = frame.id === selectedFrameId;
            return (
              <div
                key={frame.id}
                className={`frame-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectFrame(frame.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectFrame(frame.id);
                  }
                }}
              >
                {/* THUMBNAIL STRIP ARTWORK */}
                <div
                  className={`frame-thumb-visual pattern-${frame.patternType}`}
                  style={{
                    backgroundColor: frame.bgColor,
                    borderColor: frame.borderColor,
                  }}
                >
                  <div className="frame-thumb-top" style={{ color: frame.textColor }}>
                    <span>{frame.badgeIcon}</span>
                    <span className="frame-thumb-header-text">{frame.defaultHeaderText}</span>
                  </div>

                  <div className="frame-thumb-slots">
                    {[1, 2, 3].map((slotNum) => (
                      <div
                        key={slotNum}
                        className="frame-thumb-slot"
                        style={{
                          borderColor: frame.borderColor,
                        }}
                      >
                        <span className="slot-sparkle" style={{ color: frame.accentColor }}>
                          {slotNum === 2 ? frame.badgeIcon : '✨'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="frame-thumb-bottom" style={{ color: frame.textColor }}>
                    {frame.defaultFooterText}
                  </div>

                  {isSelected && (
                    <div className="frame-active-badge">
                      <Check size={14} />
                      <span>Active Frame</span>
                    </div>
                  )}
                </div>

                {/* METADATA & ACTION */}
                <div className="frame-item-meta">
                  <div className="frame-meta-top">
                    <span className="frame-category-tag">{frame.category}</span>
                    <span
                      className="color-dot-swatch"
                      style={{ backgroundColor: frame.bgColor }}
                      title={`Primary Color: ${frame.bgColor}`}
                    />
                  </div>
                  <h3 className="frame-item-title">{frame.name}</h3>
                  {!compactMode && <p className="frame-item-desc">{frame.description}</p>}

                  {onUseInStudio && !compactMode && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-block frame-apply-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUseInStudio(frame.id);
                      }}
                    >
                      <Camera size={15} />
                      <span>Use Frame in Studio</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

