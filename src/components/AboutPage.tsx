import React from 'react';
import { PageRoute } from '../types/photobooth';
import {
  Camera,
  ShieldCheck,
  Sparkles,
  Heart,
  Lock,
  Smartphone,
  HelpCircle,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="about-page-wrapper">
      <div className="page-hero-header">
        <div className="hero-pill">
          <Heart size={15} />
          <span>Little moments, forever memories.</span>
        </div>
        <h1>About MOCHI BOOTH 📸</h1>
        <p>
          Inspired by modern Korean self-photo booths, Mochi Booth brings pastel aesthetics,
          playful frames, and instant high-resolution photo strips to any laptop, tablet, or
          smartphone.
        </p>
      </div>

      <div className="about-cards-grid">
        <div className="about-info-card">
          <div className="adv-icon">
            <ShieldCheck size={24} />
          </div>
          <h3>100% On-Device Privacy</h3>
          <p>
            Your camera feed and captured photos are processed strictly inside your browser using
            the HTML5 Canvas API. We never upload your photos to any external server, cloud bucket,
            or third-party tracker.
          </p>
        </div>

        <div className="about-info-card">
          <div className="adv-icon">
            <Lock size={24} />
          </div>
          <h3>Respectful Camera Access</h3>
          <p>
            Mochi Booth never requests webcam permission automatically on page load. The camera
            stream starts only when you click <strong>Start Camera</strong>, and automatically shuts
            down all hardware tracks as soon as you stop the camera or leave the studio.
          </p>
        </div>

        <div className="about-info-card">
          <div className="adv-icon">
            <Smartphone size={24} />
          </div>
          <h3>Works Everywhere (Even Without a Webcam!)</h3>
          <p>
            Whether you’re using a Windows desktop, MacBook, Android phone, or iPhone Safari, Mochi
            Booth adapts seamlessly. Don’t have a camera plugged in? Use <strong>Upload Photos</strong>{' '}
            or <strong>Cute Mochi Demo Shots</strong> to enjoy the full editor!
          </p>
        </div>
      </div>

      <section className="faq-section-card">
        <div className="faq-header">
          <HelpCircle size={22} />
          <h2>Camera & Gallery FAQ</h2>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h4>Why does browser camera access require HTTPS or localhost?</h4>
            <p>
              Modern web browsers enforce secure contexts (<code>https://</code> or{' '}
              <code>http://localhost</code>) before enabling{' '}
              <code>navigator.mediaDevices.getUserMedia()</code>. If you open the site over an
              unencrypted LAN IP address, the browser blocks live camera streaming for your
              protection—though photo uploading and demo shots still work!
            </p>
          </div>

          <div className="faq-item">
            <h4>Where are my Gallery photos stored?</h4>
            <p>
              When you click <strong>Save to Local Gallery</strong>, your high-res strip is stored
              as a binary <code>Blob</code> inside your browser’s <strong>IndexedDB</strong>. It
              stays available across page refreshes on the same browser and device, without
              bloating memory with giant base64 strings.
            </p>
          </div>

          <div className="faq-item">
            <h4>Are filters, frames, and stickers really included in the downloaded file?</h4>
            <p>
              Yes! Every frame pattern, photo slot, filter adjustment, vector sticker, and text
              caption is rendered directly onto a high-resolution HTML5 2D Canvas before exporting
              to PNG or JPEG.
            </p>
          </div>
        </div>

        <div className="about-cta-row">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('studio')}
          >
            <Camera size={20} />
            <span>Start My Photobooth Now</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('frames')}
          >
            <Sparkles size={19} />
            <span>Browse All 16 Frames</span>
          </button>
        </div>
      </section>
    </div>
  );
};

