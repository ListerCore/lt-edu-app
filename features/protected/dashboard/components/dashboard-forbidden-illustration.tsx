import type { CSSProperties, JSX } from 'react';

type DelayStyle = CSSProperties & { '--nf-delay'?: string };

const delay = (seconds: number): DelayStyle => ({ '--nf-delay': `${seconds}s` });

// Chalk strokes of the "403" on the board, drawn in sequence (same board and hand as the panel 404)
const digits: Array<{ d: string; at: number }> = [
  { d: 'M168 182 V96 L120 156 H188', at: 0.2 },
  { d: 'M240 96 C266 96 274 120 274 139 C274 158 266 182 240 182 C214 182 206 158 206 139 C206 120 214 96 240 96 Z', at: 0.9 },
  { d: 'M300 108 C310 96 352 92 356 116 C358 132 344 138 326 139 C348 140 362 150 360 164 C356 190 312 188 298 172', at: 1.6 },
];

const sparkles: Array<{ x: number; y: number; r: number; at: number }> = [
  { x: 58, y: 70, r: 4, at: 0 },
  { x: 428, y: 92, r: 5, at: 0.8 },
  { x: 404, y: 262, r: 3.5, at: 1.4 },
  { x: 74, y: 236, r: 3, at: 0.4 },
];

// Panel 403 art: the classroom board with 403 chalked in and a padlock hanging from its corner, swinging gently
// Colors come from the theme tokens, so it follows light/dark; motion stops under prefers-reduced-motion
export const DashboardForbiddenIllustration = (): JSX.Element => (
  <svg viewBox="0 0 480 320" role="img" aria-label="Pizarra con el número 403 y un candado colgado" className="h-auto w-full max-w-md">
    <ellipse cx="240" cy="298" rx="170" ry="10" fill="var(--foreground)" opacity="0.06" />

    <path className="nf-fly" d="M0 -9 L22 0 L0 9 L5 0 Z" fill="var(--brand)" opacity="0.85" />
    <path d="M-20 70 C 80 10, 160 120, 260 40 S 440 30, 520 -10" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.25" />

    <g className="nf-float">
      <path d="M150 232 L118 292 M330 232 L362 292 M240 232 V292" stroke="var(--muted-foreground)" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
      <rect x="86" y="58" width="308" height="182" rx="16" fill="var(--card)" stroke="var(--border)" strokeWidth="4" />
      <rect x="102" y="74" width="276" height="150" rx="8" fill="var(--secondary)" />
      {digits.map(({ d, at }): JSX.Element => (
        <path key={at} d={d} pathLength={1} className="nf-draw" style={delay(at)} fill="none" stroke="var(--brand)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <path d="M150 204 C190 196 230 210 270 202 S330 198 340 204" pathLength={1} className="nf-draw" style={delay(2.3)} fill="none" stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <rect x="120" y="236" width="240" height="8" rx="4" fill="var(--border)" />
      <rect x="292" y="229" width="26" height="8" rx="3" fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />

      <g className="nf-swing">
        <path d="M380 62 V96" stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round" />
        <path d="M366 118 V106 a14 14 0 0 1 28 0 V118" fill="none" stroke="var(--foreground)" strokeWidth="6" strokeLinecap="round" />
        <rect x="356" y="116" width="48" height="40" rx="8" fill="var(--brand-soft)" stroke="var(--foreground)" strokeWidth="6" />
        <circle cx="380" cy="132" r="5" fill="var(--foreground)" />
        <path d="M380 136 V145" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>

    {sparkles.map(({ x, y, r, at }): JSX.Element => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="nf-twinkle" style={delay(at)} fill="var(--brand-vivid)" />
    ))}
  </svg>
);
