import React, { useMemo, useState } from 'react';
import {
  ARFilterCategoryTab,
  ARFilterDefinition,
  ARFilterId,
  CameraColorToneId,
} from '../types/photobooth';
import {
  AR_FILTER_CATALOG,
  AR_FILTER_TABS,
  CAMERA_COLOR_TONES,
  getARFilterById,
} from '../utils/arFilters';
import { FaceTrackerStatus } from '../utils/faceTracker';
import {
  Sparkles,
  Search,
  Heart,
  X,
  RotateCcw,
  Check,
  AlertTriangle,
  RefreshCw,
  Info,
  Users,
} from 'lucide-react';

interface ARFilterPanelProps {
  activeFilters: ARFilterId[];
  onToggleFilter: (filterId: ARFilterId) => void;
  onClearAllFilters: () => void;
  favoriteFilterIds: ARFilterId[];
  onToggleFavorite: (filterId: ARFilterId) => void;
  activeColorTone: CameraColorToneId;
  onSelectColorTone: (toneId: CameraColorToneId) => void;
  trackerStatus: FaceTrackerStatus;
  trackerError: string | null;
  detectedFaceCount: number;
  onRetryTracker: () => void;
  litePerformanceMode: boolean;
  onToggleLiteMode: () => void;
}

export const ARFilterPanel: React.FC<ARFilterPanelProps> = ({
  activeFilters,
  onToggleFilter,
  onClearAllFilters,
  favoriteFilterIds,
  onToggleFavorite,
  activeColorTone,
  onSelectColorTone,
  trackerStatus,
  trackerError,
  detectedFaceCount,
  onRetryTracker,
  litePerformanceMode,
  onToggleLiteMode,
}) => {
  const [activeTab, setActiveTab] = useState<ARFilterCategoryTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalog = useMemo(() => {
    return AR_FILTER_CATALOG.filter((item) => {
      if (activeTab === 'Favorites' && !favoriteFilterIds.includes(item.id)) {
        return false;
      }
      if (activeTab === 'Cute' && !item.isCuteFeatured) {
        return false;
      }
      if (
        activeTab !== 'All' &&
        activeTab !== 'Cute' &&
        activeTab !== 'Favorites' &&
        item.category !== activeTab
      ) {
        return false;
      }

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [activeTab, favoriteFilterIds, searchQuery]);

  const hasActiveHairFilter = activeFilters.some((id) => {
    const def = getARFilterById(id);
    return def?.category === 'Hair';
  });

  return (
    <div className="ar-filter-panel-card">
      {/* HEADER & FACE TRACKING STATUS */}
      <div className="ar-panel-header">
        <div className="ar-panel-title-wrap">
          <span className="ar-badge-sparkle">✨ LIVE AR</span>
          <h3>Real-Time Face Filters & Camera Tones</h3>
        </div>

        <div className="ar-tracker-status-row">
          {trackerStatus === 'loading' && (
            <span className="tracker-pill loading" role="status">
              ⏳ Loading AI Face Landmarker...
            </span>
          )}
          {trackerStatus === 'ready' && (
            <span className="tracker-pill ready" role="status">
              <Users size={13} />
              <span>
                {detectedFaceCount > 0
                  ? `${detectedFaceCount} ${detectedFaceCount === 1 ? 'Face' : 'Faces'} Tracked Live`
                  : 'Face Tracker Ready • Look at camera'}
              </span>
            </span>
          )}
          {trackerStatus === 'error' && (
            <span className="tracker-pill error" role="alert">
              <AlertTriangle size={13} />
              <span>Face Tracking Paused</span>
              <button
                type="button"
                className="btn-inline-retry"
                onClick={onRetryTracker}
              >
                <RefreshCw size={12} /> Retry
              </button>
            </span>
          )}

          <button
            type="button"
            className={`btn btn-chip btn-xs ${litePerformanceMode ? 'active' : ''}`}
            onClick={onToggleLiteMode}
            title="Lite Mode reduces face detection frequency for smoother performance on older devices"
          >
            ⚡ {litePerformanceMode ? 'Lite FPS On' : 'High FPS'}
          </button>
        </div>
      </div>

      {/* TRACKER ERROR FALLBACK EXPLANATION */}
      {trackerStatus === 'error' && (
        <div className="ar-tracker-error-banner" role="alert">
          <AlertTriangle size={16} />
          <div>
            <strong>Face Tracking Unavailable:</strong>{' '}
            {trackerError || 'Could not initialize MediaPipe Face Landmarker.'} Face-anchored effects
            (ears, wigs, glasses) are hidden so they never float randomly. You can still use{' '}
            <strong>Fantasy/Ambient Filters</strong>, <strong>Camera Color Tones</strong>, or capture
            normal photos!
          </div>
          <button type="button" className="btn btn-chip btn-xs" onClick={onRetryTracker}>
            <RefreshCw size={13} /> Retry Model
          </button>
        </div>
      )}

      {/* LIVE CAMERA COLOR TONES STRIP */}
      <div className="ar-color-tones-section">
        <div className="ar-sub-header">
          <span className="ar-sub-label">🎨 Live Camera Color Filter</span>
          {activeColorTone !== 'original' && (
            <button
              type="button"
              className="btn-text-reset"
              onClick={() => onSelectColorTone('original')}
            >
              Reset to Original
            </button>
          )}
        </div>
        <div className="ar-color-tones-strip" role="radiogroup" aria-label="Camera color filters">
          {CAMERA_COLOR_TONES.map((tone) => {
            const isSelected = activeColorTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`color-tone-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectColorTone(tone.id)}
              >
                <span>{tone.badge}</span>
                <span>{tone.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE AR EFFECTS COMBINATION TRAY */}
      <div className="ar-active-tray">
        <div className="ar-active-tray-left">
          <span className="ar-sub-label">
            🪄 Active AR Effects ({activeFilters.length}):
          </span>
          {activeFilters.length === 0 ? (
            <span className="ar-none-label">
              Original (No AR overlays active — click any filter below to combine!)
            </span>
          ) : (
            <div className="active-effect-chips">
              {activeFilters.map((fId) => {
                const def = getARFilterById(fId);
                if (!def) return null;
                return (
                  <span key={fId} className="active-effect-pill">
                    <span>{def.icon}</span>
                    <span>{def.name}</span>
                    <button
                      type="button"
                      onClick={() => onToggleFilter(fId)}
                      aria-label={`Turn off ${def.name}`}
                      title="Turn off this effect"
                    >
                      <X size={13} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {(activeFilters.length > 0 || activeColorTone !== 'original') && (
          <button
            type="button"
            className="btn btn-chip btn-chip-danger btn-xs"
            onClick={() => {
              onClearAllFilters();
              onSelectColorTone('original');
            }}
          >
            <RotateCcw size={13} />
            <span>Clear Effects</span>
          </button>
        )}
      </div>

      {/* HAIR & WIG VISUAL EFFECT DISCLAIMER */}
      {(activeTab === 'Hair' || hasActiveHairFilter) && (
        <div className="ar-wig-disclaimer-note">
          <Info size={15} />
          <span>
            <strong>Hair & Wig Note:</strong> Hair filters apply a transparent illustrated wig
            overlay that tracks your head position and tilt—this is a playful visual AR effect, not
            an actual hair restyling or AI hair replacement.
          </span>
        </div>
      )}

      {/* SEARCH & CATEGORY TABS (All, Cute, Animal, Hair, Accessories, Makeup, Fantasy, Seasonal, Favorites) */}
      <div className="ar-search-and-tabs">
        <div className="ar-search-box">
          <Search size={15} className="ar-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 51 AR filters (e.g., Bunny Ears, Pink Hair, Heart Glasses, Blush)..."
            aria-label="Search AR face filters"
          />
          {searchQuery && (
            <button
              type="button"
              className="ar-clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear filter search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="ar-tabs-scroll" role="tablist" aria-label="AR Filter Categories">
          {AR_FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`ar-tab-chip ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Favorites' ? `❤️ Favorites (${favoriteFilterIds.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* THUMBNAIL GRID OF AR FILTERS */}
      {filteredCatalog.length === 0 ? (
        <div className="ar-empty-catalog">
          <p>
            {activeTab === 'Favorites'
              ? 'No favorite filters saved yet! Click the ♥ icon on any filter to bookmark it.'
              : 'No matching filters found. Try another keyword or tab!'}
          </p>
        </div>
      ) : (
        <div className="ar-catalog-grid">
          {filteredCatalog.map((item: ARFilterDefinition) => {
            const isSelected = activeFilters.includes(item.id);
            const isFav = favoriteFilterIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`ar-filter-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleFilter(item.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                title={item.description}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleFilter(item.id);
                  }
                }}
              >
                <button
                  type="button"
                  className={`ar-fav-btn ${isFav ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  aria-label={isFav ? `Remove ${item.name} from favorites` : `Favorite ${item.name}`}
                  title="Bookmark filter"
                >
                  <Heart size={13} fill={isFav ? '#FF477E' : 'none'} />
                </button>

                <div
                  className="ar-filter-thumb"
                  style={{ backgroundColor: `${item.accentColor}26`, borderColor: item.accentColor }}
                >
                  <span className="ar-filter-emoji">{item.icon}</span>
                  {isSelected && (
                    <span className="ar-active-check">
                      <Check size={11} />
                    </span>
                  )}
                </div>

                <div className="ar-filter-name">{item.name}</div>
                <span className="ar-filter-slot-tag">{item.slot}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="ar-panel-footer-tip">
        <Sparkles size={14} />
        <span>
          <strong>Combo Tip:</strong> Mix & match across slots—like <em>Bunny Ears</em> +{' '}
          <em>Heart Glasses</em> + <em>Rosy Cheeks</em> + <em>Floating Hearts</em>! All active AR
          effects are automatically baked into your captured photos.
        </span>
      </div>
    </div>
  );
};

