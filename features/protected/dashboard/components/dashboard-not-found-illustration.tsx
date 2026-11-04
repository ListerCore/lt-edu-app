import type { CSSProperties, JSX } from 'react';

type DelayStyle = CSSProperties & { '--nf-delay'?: string };

const delay = (seconds: number): DelayStyle => ({ '--nf-delay': `${seconds}s` });

// Chalk strokes of the "404" on the board, drawn in sequence
const digits: Array<{ d: string; at: number }> = [
  { d: 'M168 182 V96 L120 156 H188', at: 0.2 },
  { d: 'M240 96 C266 96 274 120 274 139 C274 158 266 182 240 182 C214 182 206 158 206 139 C206 120 214 96 240 96 Z', at: 0.9 },
  { d: 'M344 182 V96 L296 156 H364', at: 1.6 },
];

const sparkles: Array<{ x: number; y: number; r: number; at: number }> = [
  { x: 58, y: 70, r: 4, at: 0 },
  { x: 428, y: 92, r: 5, at: 0.8 },
  { x: 404, y: 262, r: 3.5, at: 1.4 },
  { x: 74, y: 236, r: 3, at: 0.4 },
];

// Panel 404 art: a classroom board where the 404 is chalked in, a magnifier searching it and a paper plane passing by
// Colors come from the theme tokens, so it follows light/dark; motion stops under prefers-reduced-motion
export const DashboardNotFoundIllustration = (): JSX.Element => (
  <svg viewBox="0 0 480 320" role="img" aria-label="Pizarra con el número 404 y una lupa que lo busca" className="h-auto w-full max-w-md">
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
    </g>

    <g className="nf-sweep">
      <circle cx="120" cy="150" r="30" fill="var(--brand-soft)" stroke="var(--foreground)" strokeWidth="6" />
      <circle cx="110" cy="140" r="8" fill="var(--background)" opacity="0.7" />
      <path d="M142 172 L170 200" stroke="var(--foreground)" strokeWidth="10" strokeLinecap="round" />
    </g>

    {sparkles.map(({ x, y, r, at }): JSX.Element => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="nf-twinkle" style={delay(at)} fill="var(--brand-vivid)" />
    ))}
  </svg>
);
