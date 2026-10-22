import React, { useState } from 'react';
import { PageRoute } from '../types/photobooth';
import { THEMES, THEME_ORDER, ThemeId } from '../utils/themes';
import { THEME_ICONS } from './ThemeIcons';
import { Camera, Sparkles, Image as ImageIcon, Frame, Heart, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  galleryCount: number;
  themeId: ThemeId;
  onChangeTheme: (id: ThemeId) => void;
  onOpenThemeGate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  galleryCount,
  themeId,
  onChangeTheme,
  onOpenThemeGate,
}) => {
  const themeSwitch = (
    <div className="theme-switch" role="group" aria-label="Booth style">
      {THEME_ORDER.map((id) => {
        const Icon = THEME_ICONS[id];
        return (
          <button
            key={id}
            type="button"
            aria-pressed={themeId === id}
            title={`${THEMES[id].label}: ${THEMES[id].tagline}`}
            onClick={() => onChangeTheme(id)}
          >
            <Icon />
            <span>{THEMES[id].label}</span>
          </button>
        );
      })}
      {onOpenThemeGate && (
        <button
          type="button"
          className="theme-vibe-btn"
          title="Open Vibe Selector"
          onClick={onOpenThemeGate}
        >
          <span>✨ Vibe</span>
        </button>
      )}
    </div>
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container" aria-label="Main Navigation">
        <button
          type="button"
          className="brand-logo"
          onClick={() => handleNav('home')}
          aria-label="Go to Mochi Booth Home"
        >
          <span className="brand-icon" aria-hidden="true">
            📸
          </span>
          <div className="brand-text-wrap">
            <span className="brand-title">MOCHI BOOTH</span>
            <span className="brand-tag">KOREAN SELF STUDIO</span>
          </div>
        </button>

        <div className="nav-links-desktop">
          <button
            type="button"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <Sparkles size={16} />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'studio' ? 'active' : ''}`}
            onClick={() => handleNav('studio')}
          >
            <Camera size={16} />
            <span>Create Booth</span>
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'frames' ? 'active' : ''}`}
            onClick={() => handleNav('frames')}
          >
            <Frame size={16} />
            <span>Frames</span>
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'gallery' ? 'active' : ''}`}
            onClick={() => handleNav('gallery')}
          >
            <ImageIcon size={16} />
            <span>Gallery</span>
            {galleryCount > 0 && <span className="nav-pill-count">{galleryCount}</span>}
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNav('about')}
          >
            <Heart size={16} />
            <span>About</span>
          </button>
        </div>

        <div className="nav-cta-wrap">
          {themeSwitch}
          <button
            type="button"
            className="btn btn-primary btn-cta-nav"
            onClick={() => handleNav('studio')}
          >
            <Camera size={17} />
            <span>Start My Photobooth</span>
          </button>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-theme-switch">{themeSwitch}</div>
          <button
            type="button"
            className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <Sparkles size={18} />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentPage === 'studio' ? 'active' : ''}`}
            onClick={() => handleNav('studio')}
          >
            <Camera size={18} />
            <span>Create Booth</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentPage === 'frames' ? 'active' : ''}`}
            onClick={() => handleNav('frames')}
          >
            <Frame size={18} />
            <span>Frames Collection</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentPage === 'gallery' ? 'active' : ''}`}
            onClick={() => handleNav('gallery')}
          >
            <ImageIcon size={18} />
            <span>My Gallery ({galleryCount})</span>
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNav('about')}
          >
            <Heart size={18} />
            <span>About & Privacy</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => handleNav('studio')}
          >
            <Camera size={18} />
            <span>Start My Photobooth ✨</span>
          </button>
        </div>
      )}
    </header>
  );
};

