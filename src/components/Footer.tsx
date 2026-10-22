import React from 'react';
import { PageRoute } from '../types/photobooth';
import { Camera, Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-logo" onClick={() => onNavigate('home')}>
            <span className="brand-icon">📸</span>
            <span className="brand-title">MOCHI BOOTH</span>
          </div>
          <p className="footer-tagline">“Little moments, forever memories.”</p>
          <div className="footer-privacy-pill">
            <ShieldCheck size={16} />
            <span>100% On-Device Privacy • Photos never leave your browser</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul>
            <li>
              <button type="button" onClick={() => onNavigate('home')}>
                Home
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('studio')}>
                Photobooth Studio
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('frames')}>
                Cute Frames (16 Themes)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('gallery')}>
                My Local Gallery
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('about')}>
                About & Camera FAQ
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Booth Features</h4>
          <ul>
            <li>
              <button type="button" onClick={() => onNavigate('studio')}>
                Classic Korean 4-Cut Strip
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('studio')}>
                Polaroid & Twin Strip
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('studio')}>
                K-Beauty Pastel Filters
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('studio')}>
                Interactive Stickers & Text
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-cta-col">
          <h4>Ready to Strike a Pose?</h4>
          <p>Grab a friend or snap solo with our instant countdown timer and pastel stickers!</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('studio')}
          >
            <Camera size={17} />
            <span>Open Studio Now</span>
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          Made with <Heart size={14} className="inline-heart" /> for cute memories • MOCHI BOOTH ©{' '}
          {new Date().getFullYear()}
        </span>
        <span className="footer-sparkle">
          <Sparkles size={14} /> No signup • No watermark traps • Instant high-res PNG/JPEG
        </span>
      </div>
    </footer>
  );
};

