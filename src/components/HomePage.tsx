import React from 'react';
import { PageRoute, FrameTheme } from '../types/photobooth';
import { FRAME_THEMES, LAYOUT_CONFIGS } from '../utils/constants';
import {
  Camera,
  Sparkles,
  Download,
  Palette,
  ShieldCheck,
  Smile,
  Wand2,
  Layers,
  ArrowRight,
  Heart,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectFrameAndStart: (frameId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectFrameAndStart,
}) => {
  const featuredFrames: FrameTheme[] = FRAME_THEMES.slice(0, 8);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-doodle hero-doodle-tl" aria-hidden="true">
          ✨ 🌸
        </div>
        <div className="hero-doodle hero-doodle-tr" aria-hidden="true">
          🎀 ⭐
        </div>

        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={15} />
              <span>Korean Self-Photo Studio in Your Browser</span>
            </div>

            <h1 className="hero-title">
              Snap Cute <span className="highlight-pink">4-Cut Strips</span> &{' '}
              <span className="highlight-lavender">Pastel Collages</span> Instantly 📸
            </h1>

            <p className="hero-subtitle">
              <strong>MOCHI BOOTH</strong> — <em>“Little moments, forever memories.”</em> Turn your
              laptop or phone into an aesthetic photobooth with 10 studio layouts, 16 original
              frames, dreamy K-filters, and movable stickers!
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('studio')}
              >
                <Camera size={20} />
                <span>Start My Photobooth</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('frames')}
              >
                <Palette size={19} />
                <span>Explore 16 Cute Frames</span>
              </button>
            </div>

            <div className="hero-trust-badges">
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>10 Studio Layouts</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>11 Pastel & Film Filters</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>100% Private Local Processing</span>
              </div>
            </div>
          </div>

          {/* HERO ILLUSTRATION & LIVE PHOTOBOOTH STRIP PREVIEW */}
          <div className="hero-showcase" aria-label="Example Mochi Booth Strip Showcase">
            <div className="floating-sticker sticker-bow" aria-hidden="true">
              🎀
            </div>
            <div className="floating-sticker sticker-heart" aria-hidden="true">
              💖
            </div>
            <div className="floating-sticker sticker-star" aria-hidden="true">
              🌟
            </div>

            <div className="showcase-strips-wrapper">
              {/* Strip 1: Pink Mochi Dream */}
              <div className="sample-strip strip-pink">
                <div className="sample-strip-header">✨ MOCHI BOOTH ✨</div>
                <div className="sample-slot slot-1">
                  <div className="cute-avatar">🐰✌️</div>
                  <span className="pose-tag">Say Mochi!</span>
                </div>
                <div className="sample-slot slot-2">
                  <div className="cute-avatar">🐱😉</div>
                  <span className="pose-tag">Wink Pose</span>
                </div>
                <div className="sample-slot slot-3">
                  <div className="cute-avatar">🐻🫶</div>
                  <span className="pose-tag">Heart Cheek</span>
                </div>
                <div className="sample-slot slot-4">
                  <div className="cute-avatar">🦊🌸</div>
                  <span className="pose-tag">Besties!</span>
                </div>
                <div className="sample-strip-footer">
                  <span>Little moments, forever ♡</span>
                  <small>2026.10.22</small>
                </div>
              </div>

              {/* Strip 2: Lavender Cloud Polaroid & Mini Strip */}
              <div className="sample-strip strip-lavender">
                <div className="sample-strip-header">☁️ DREAMY 4-CUT ☁️</div>
                <div className="sample-slot slot-lav-1">
                  <div className="cute-avatar">🦄✨</div>
                </div>
                <div className="sample-slot slot-lav-2">
                  <div className="cute-avatar">🐼🎀</div>
                </div>
                <div className="sample-slot slot-lav-3">
                  <div className="cute-avatar">🐨🍓</div>
                </div>
                <div className="sample-strip-footer">
                  <span>Stardust & smiles ✦</span>
                  <small>SEOUL STUDIO</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 SIMPLE STEPS */}
      <section className="section-block how-it-works-section">
        <div className="section-header">
          <span className="section-eyebrow">SUPER EASY & FUN</span>
          <h2 className="section-title">How Mochi Booth Works ✨</h2>
          <p className="section-desc">
            No complicated apps or coins needed—create studio-quality photobooth strips in three
            playful steps.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-box bg-pink">
              <Camera size={28} />
            </div>
            <h3>1. Take Photos</h3>
            <p>
              Choose 1, 3, 4, 6, or 8 shots. Pick a 3s, 5s, or 10s countdown timer, strike your
              cutest poses, or upload/retake any single shot anytime!
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-box bg-lavender">
              <Wand2 size={28} />
            </div>
            <h3>2. Customize</h3>
            <p>
              Switch between 10 layouts (Classic Korean Strip, Double Strip, Polaroid, Grids), pick
              from 16 pastel frames, apply filters, and drag cute stickers & custom text!
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-box bg-blue">
              <Download size={28} />
            </div>
            <h3>3. Download & Save</h3>
            <p>
              Export crisp, high-resolution PNG or JPEG strips ready for Instagram stories, printing,
              or saving directly to your browser’s private Mochi Gallery.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR FRAME COLLECTION PREVIEW */}
      <section className="section-block frames-preview-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">16 ORIGINAL DESIGNS</span>
            <h2 className="section-title">Popular Photobooth Frames 🎀</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('frames')}
          >
            <span>View All 16 Frames</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="popular-frames-grid">
          {featuredFrames.map((frame) => (
            <div
              key={frame.id}
              className="frame-preview-card"
              onClick={() => onSelectFrameAndStart(frame.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFrameAndStart(frame.id);
                }
              }}
            >
              <div
                className="frame-mini-Strip"
                style={{
                  backgroundColor: frame.bgColor,
                  borderColor: frame.borderColor,
                }}
              >
                <span className="frame-mini-badge">{frame.badgeIcon}</span>
                <div className="frame-mini-slots">
                  <span style={{ borderColor: frame.borderColor }} />
                  <span style={{ borderColor: frame.borderColor }} />
                  <span style={{ borderColor: frame.borderColor }} />
                </div>
                <div className="frame-mini-caption" style={{ color: frame.textColor }}>
                  {frame.defaultHeaderText}
                </div>
              </div>
              <div className="frame-card-info">
                <span className="frame-cat-pill">{frame.category}</span>
                <h4>{frame.name}</h4>
                <p>{frame.description}</p>
                <span className="frame-try-link">
                  Use this frame <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAYOUT VARIETY SHOWCASE */}
      <section className="section-block layouts-overview-section">
        <div className="section-header">
          <span className="section-eyebrow">10 TRUE COMPOSITIONS</span>
          <h2 className="section-title">Every Layout You Love 🎞️</h2>
          <p className="section-desc">
            Switch layouts before or after taking photos—our smart canvas automatically reflows your
            shots.
          </p>
        </div>

        <div className="layout-pills-showcase">
          {LAYOUT_CONFIGS.map((l) => (
            <div
              key={l.id}
              className="layout-mini-card"
              onClick={() => onNavigate('studio')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('studio');
              }}
            >
              <div className="layout-mini-header">
                <strong>{l.name}</strong>
                <span className="layout-count-badge">{l.photoCount} Photos</span>
              </div>
              <p>{l.subtitle}</p>
              <span className="layout-aspect-tag">{l.aspectLabel}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY MOCHI BOOTH / ADVANTAGES */}
      <section className="section-block features-why-section">
        <div className="section-header">
          <span className="section-eyebrow">WHY EVERYONE LOVES MOCHI BOOTH</span>
          <h2 className="section-title">Designed for Cute, Stress-Free Memories 💖</h2>
        </div>

        <div className="advantages-grid">
          <div className="advantage-card">
            <div className="adv-icon">
              <ShieldCheck size={24} />
            </div>
            <h3>100% Private & Local</h3>
            <p>
              Your camera stream and photos never leave your device. Everything is composed via
              HTML5 Canvas & stored in your local IndexedDB gallery.
            </p>
          </div>

          <div className="advantage-card">
            <div className="adv-icon">
              <Layers size={24} />
            </div>
            <h3>Single-Shot Retake</h3>
            <p>
              Blinked on photo #3? No need to redo the whole strip! Retake any individual slot while
              keeping your best smiles intact.
            </p>
          </div>

          <div className="advantage-card">
            <div className="adv-icon">
              <Smile size={24} />
            </div>
            <h3>Interactive Stickers & Text</h3>
            <p>
              Add cat ears, coquette bows, sparkles, and custom date captions. Drag, resize, and
              rotate right on the canvas with Undo/Redo support.
            </p>
          </div>

          <div className="advantage-card">
            <div className="adv-icon">
              <Star size={24} />
            </div>
            <h3>No Camera? Demo & Upload Ready</h3>
            <p>
              Even if your device has no webcam, you can upload photos from your phone/PC or load
              instant Mochi Demo Shots to test every feature!
            </p>
          </div>
        </div>

        <div className="bottom-hero-banner">
          <div>
            <h3>Ready to make your cutest photobooth strip? 🌸</h3>
            <p>Jump straight into the studio—no account or installation required.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('studio')}
          >
            <Camera size={20} />
            <span>Launch Photobooth Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
};

