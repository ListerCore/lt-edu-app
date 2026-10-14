import { memo } from 'react';

type DotsBackgroundProps = {
  label: string;
  hue?: number;
};

export const DotsBackground = memo(({ label, hue = 28 }: DotsBackgroundProps): React.ReactNode => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id={`dot-tone-${label}`} cx="35%" cy="35%" r="70%">
        <stop offset="0%" stopColor={`oklch(0.72 0.16 ${hue})`} />
        <stop offset="55%" stopColor={`oklch(0.48 0.22 ${hue})`} />
        <stop offset="100%" stopColor={`oklch(0.28 0.16 ${hue})`} />
      </radialGradient>
      <pattern id={`dot-primary-${label}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="11" cy="11" r="2.2" fill={`url(#dot-tone-${label})`} />
      </pattern>
      <clipPath id={`clip-${label}`}>
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontFamily="ui-monospace, monospace" fontSize="500" fontWeight="900" letterSpacing="-8">
          {label}
        </text>
      </clipPath>
    </defs>
    <rect width="100%" height="100%" fill={`url(#dot-primary-${label})`} clipPath={`url(#clip-${label})`} opacity="0.35" />
  </svg>
));

DotsBackground.displayName = 'DotsBackground';
