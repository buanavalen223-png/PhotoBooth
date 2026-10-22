import React from 'react';
import { ThemeId } from '../utils/themes';

const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const MaleIcon = () => (
  <svg {...svgProps}>
    <circle cx="10" cy="14" r="5.5" />
    <path d="M14 10l6-6M15 4h5v5" />
  </svg>
);

export const FemaleIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M12 14.5V22M8.5 18.5h7" />
  </svg>
);

export const MaleFemaleIcon = () => (
  <svg {...svgProps} width={28} height={28} viewBox="0 0 28 24">
    <circle cx="8.5" cy="9" r="5" />
    <path d="M8.5 14v8M5.5 19h6" />
    <circle cx="18" cy="13" r="5" />
    <path d="M21.5 9.5l5-5M22.5 4.5h4v4" />
  </svg>
);

export const THEME_ICONS: Record<ThemeId, React.FC> = {
  straight: MaleFemaleIcon,
  guy: MaleIcon,
  slay: FemaleIcon,
};
