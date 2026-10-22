import React, { useEffect, useState } from 'react';
import { THEMES, ThemeId } from '../utils/themes';
import { THEME_ICONS } from './ThemeIcons';

interface WelcomeGateProps {
  currentTheme: ThemeId | null;
  /** Saves the theme and enters the PhotoBooth. */
  onChoose: (theme: ThemeId) => void;
  /** Dismisses the panel and keeps the current (or default) theme. */
  onClose: () => void;
}

const OPTIONS: { id: ThemeId; primary?: boolean }[] = [
  { id: 'straight', primary: true },
  { id: 'guy' },
  { id: 'slay' },
];

export const WelcomeGate: React.FC<WelcomeGateProps> = ({ currentTheme, onChoose, onClose }) => {
  const [cookieNote, setCookieNote] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="mg-backdrop">
      <div className="mg-panel" role="dialog" aria-modal="true" aria-labelledby="mg-title">
        <button type="button" className="mg-close" aria-label="Close and continue" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div className="mg-logo" aria-label="Mochi">MOCHI</div>

        <h1 id="mg-title" className="mg-title">
          WELCOME TO MOCHI! <span className="mg-yellow">Choose your vibe</span>.
        </h1>

        <p className="mg-sub">Choose your preferences to personalize your experience.</p>

        <p className="mg-lead">
          Pick a booth style <small>(you can switch any time)</small>
        </p>

        <div className="mg-options">
          {OPTIONS.map(({ id, primary }) => {
            const Icon = THEME_ICONS[id];
            return (
              <button
                key={id}
                type="button"
                className={`mg-opt ${primary ? 'mg-opt-primary' : 'mg-opt-secondary'}${
                  currentTheme === id ? ' is-selected' : ''
                }`}
                aria-pressed={currentTheme === id}
                onClick={() => onChoose(id)}
              >
                <span>{THEMES[id].label}</span>
                <Icon />
              </button>
            );
          })}
        </div>

        <hr className="mg-divider" />

        <button
          type="button"
          className="mg-manage"
          aria-expanded={cookieNote !== null}
          onClick={() =>
            setCookieNote(
              'Mochi sets no cookies. Only your booth style is saved in this browser\u2019s local storage.'
            )
          }
        >
          Manage preferences
        </button>

        <button
          type="button"
          className="mg-reject"
          onClick={() => setCookieNote('Nothing to reject: Mochi does not use optional cookies.')}
        >
          Reject optional cookies
        </button>

        {cookieNote && (
          <p className="mg-note" role="status">
            {cookieNote}
          </p>
        )}

        <p className="mg-footer">Little moments, forever memories. Have fun and be kind.</p>
      </div>
    </div>
  );
};
